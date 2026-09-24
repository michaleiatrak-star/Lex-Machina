import { createHash } from "node:crypto";
import { chunkDocumentPages } from "./document-ingestion.js";
import { LocalPolishPseudonymizer, PseudonymizationVault } from "./privacy/pseudonymizer.js";
import { privacyRecognizerFor } from "./privacy/local-llm-ner.js";
import { genderOf, placeholderGrammar } from "./privacy/token-legend.js";
import { PERSON_CASES } from "./privacy/person-morphology.js";
import { DOCX_MEDIA_TYPE, ODT_MEDIA_TYPE } from "./office-document-extractor.js";
import { XLSX_MEDIA_TYPE, XLSM_MEDIA_TYPE, CSV_MEDIA_TYPE, TSV_MEDIA_TYPE } from "./spreadsheet-extractor.js";
/** UTF-8 (BOM stripped), else Windows-1250 as used by older Polish files. */
export function decodePlainText(data) {
    try {
        return new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(data);
    }
    catch {
        return new TextDecoder("windows-1250").decode(data);
    }
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** Replaces whole-word surfaces (longest first) outside existing tokens. */
export function replaceOutsideTokens(text, surfaces, token) {
    const ordered = [...surfaces].sort((a, b) => b.length - a.length).map(escapeRegExp);
    if (!ordered.length)
        return { text, count: 0 };
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${ordered.join("|")})(?![\\p{L}\\p{N}])`, "giu");
    let count = 0;
    const parts = text.split(/(\[(?:LMPII:D\d{2}|PII):[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\])/);
    const out = parts.map((part, index) => index % 2 === 1
        ? part
        : part.replace(pattern, () => {
            count += 1;
            return token;
        }));
    return { text: out.join(""), count };
}
export class LocalPrivateDocumentService {
    pdfIngestor;
    namedEntities;
    maxChunkChars;
    imageIngestor;
    privacyVaultStore;
    secureDocumentStore;
    officeExtractor;
    spreadsheetExtractor;
    personMorphology;
    documents = new Map();
    constructor(pdfIngestor, namedEntities, maxChunkChars = 24_000, imageIngestor, privacyVaultStore, secureDocumentStore, officeExtractor, spreadsheetExtractor, 
    // One token per person and inflected restore ([PII:PERSON:0001|GEN]).
    personMorphology) {
        this.pdfIngestor = pdfIngestor;
        this.namedEntities = namedEntities;
        this.maxChunkChars = maxChunkChars;
        this.imageIngestor = imageIngestor;
        this.privacyVaultStore = privacyVaultStore;
        this.secureDocumentStore = secureDocumentStore;
        this.officeExtractor = officeExtractor;
        this.spreadsheetExtractor = spreadsheetExtractor;
        this.personMorphology = personMorphology;
    }
    digitalTextResult(data, text) {
        if (data.byteLength >
            64 * 1024 * 1024 ||
            text.length >
                100_000_000) {
            throw new Error("DOCUMENT_TEXT_LIMIT_EXCEEDED");
        }
        const page = {
            page: 1,
            text,
            source: text.trim()
                ? "DIGITAL"
                : "BLANK"
        };
        const pages = [
            page
        ];
        return {
            complete: true,
            sha256: createHash("sha256")
                .update(data)
                .digest("hex"),
            bytes: data.byteLength,
            totalPages: 1,
            digitalPages: page.source ===
                "DIGITAL"
                ? 1
                : 0,
            ocrPages: 0,
            blankPages: page.source ===
                "BLANK"
                ? 1
                : 0,
            sourceChars: text.length,
            pages,
            chunks: chunkDocumentPages(pages, this.maxChunkChars)
        };
    }
    async extract(data, mediaType, onProgress) {
        if (mediaType === "application/pdf") {
            return this.pdfIngestor.ingest(data, onProgress);
        }
        if (mediaType ===
            "text/plain" ||
            mediaType ===
                "text/markdown") {
            return this.digitalTextResult(data, decodePlainText(data));
        }
        if (mediaType ===
            XLSX_MEDIA_TYPE ||
            mediaType ===
                XLSM_MEDIA_TYPE ||
            mediaType ===
                CSV_MEDIA_TYPE ||
            mediaType ===
                TSV_MEDIA_TYPE) {
            if (!this.spreadsheetExtractor) {
                throw new Error("SPREADSHEET_EXTRACTOR_UNAVAILABLE");
            }
            return this.digitalTextResult(data, await this.spreadsheetExtractor
                .extract(data, mediaType));
        }
        if (mediaType ===
            DOCX_MEDIA_TYPE ||
            mediaType ===
                ODT_MEDIA_TYPE) {
            if (!this.officeExtractor) {
                throw new Error("OFFICE_DOCUMENT_EXTRACTOR_UNAVAILABLE");
            }
            return this.digitalTextResult(data, await this.officeExtractor
                .extract(data, mediaType));
        }
        if (!this.imageIngestor) {
            throw new Error("IMAGE_OCR_UNAVAILABLE");
        }
        onProgress?.({ stage: "OCR", done: 0, total: 1 });
        const image = await this.imageIngestor.ingest(data, mediaType);
        onProgress?.({ stage: "OCR", done: 1, total: 1 });
        return image;
    }
    async review(data, mediaType, security) {
        const onProgress = security?.onProgress;
        onProgress?.({ stage: "READING" });
        const source = await this.extract(data, mediaType, onProgress);
        const documentId = `doc_${source.sha256.slice(0, 24)}`;
        const persistentDocument = Boolean(this.secureDocumentStore &&
            security?.caseId);
        if (persistentDocument) {
            if (!security?.caseDataKey ||
                !Number.isInteger(security.keyVersion) ||
                (security.keyVersion ?? 0) <
                    1) {
                throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
            }
            await this
                .secureDocumentStore
                .saveSource({
                caseId: security.caseId,
                documentId,
                mediaType,
                source,
                caseDataKey: security.caseDataKey,
                keyVersion: security.keyVersion
            });
        }
        const vault = new PseudonymizationVault();
        this.documents.set(documentId, {
            mediaType,
            ...(security?.caseId
                ? {
                    caseId: security.caseId
                }
                : {}),
            vault,
            source
        });
        const suggestionVault = new PseudonymizationVault();
        const suggestions = [];
        for (const [index, page] of source.pages.entries()) {
            onProgress?.({ stage: "DETECTING", done: index, total: source.pages.length });
            const preview = await new LocalPolishPseudonymizer(suggestionVault, privacyRecognizerFor(this.namedEntities, page.source === "OCR"), this.personMorphology).pseudonymize(page.text);
            for (const finding of preview.findings) {
                suggestions.push({
                    page: page.page,
                    start: finding.start,
                    end: finding.end,
                    kind: finding.kind
                });
            }
        }
        return {
            documentId,
            mediaType,
            complete: true,
            totalPages: source.totalPages,
            pages: source.pages.map((page) => ({
                page: page.page,
                text: page.text,
                source: page.source,
                ...(page.confidence !== undefined
                    ? { confidence: page.confidence }
                    : {}),
                ...(page.engine
                    ? { engine: page.engine }
                    : {})
            })),
            suggestions
        };
    }
    async finalizeReview(documentId, directives, security) {
        const record = this.documents.get(documentId);
        if (!record) {
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        }
        for (const directive of directives) {
            if (!Number.isInteger(directive.page) ||
                directive.page < 1 ||
                directive.page > record.source.totalPages) {
                throw new Error("INVALID_PRIVACY_DIRECTIVE_PAGE");
            }
        }
        const persistentVault = Boolean(this.privacyVaultStore &&
            record.caseId);
        if (persistentVault) {
            if (!security ||
                security.caseId !==
                    record.caseId ||
                !security.caseDataKey ||
                !Number.isInteger(security.keyVersion) ||
                (security.keyVersion ?? 0) <
                    1) {
                throw new Error("DOCUMENT_VAULT_CONTEXT_REQUIRED");
            }
            record.vault =
                await this
                    .privacyVaultStore
                    .loadDocumentVault({
                    caseId: record.caseId,
                    documentId,
                    caseDataKey: security.caseDataKey,
                    keyVersion: security.keyVersion
                });
        }
        const pages = [];
        const counts = {};
        const annotations = [];
        let findings = 0;
        let manualPseudonymizations = 0;
        let keptRanges = 0;
        const onProgress = security?.onProgress;
        for (const [pageIndex, page] of record.source.pages.entries()) {
            onProgress?.({ stage: "PSEUDONYMIZING", done: pageIndex, total: record.source.pages.length });
            const pageDirectives = directives
                .filter((directive) => directive.page === page.page)
                .map(({ page: _page, ...directive }) => directive);
            const protectedPage = await new LocalPolishPseudonymizer(record.vault, privacyRecognizerFor(this.namedEntities, page.source === "OCR"), this.personMorphology).pseudonymize(page.text, pageDirectives);
            findings += protectedPage.findings.length;
            manualPseudonymizations +=
                protectedPage.findings.filter((item) => item.source === "USER").length;
            keptRanges +=
                protectedPage.keptRanges.length;
            for (const [kind, count] of Object.entries(protectedPage.counts)) {
                counts[kind] = (counts[kind] ?? 0) + count;
            }
            for (const annotation of protectedPage.annotations) {
                annotations.push({
                    page: page.page,
                    ...annotation
                });
            }
            pages.push({
                ...page,
                text: protectedPage.text
            });
        }
        const chunks = chunkDocumentPages(pages, this.maxChunkChars);
        const pseudonymizedChars = pages.reduce((sum, page) => sum + page.text.length, 0);
        const publicChunks = chunks.map((chunk) => ({
            index: chunk.index,
            pageStart: chunk.pageStart,
            pageEnd: chunk.pageEnd,
            text: chunk.text
        }));
        record.protectedChunks = publicChunks;
        onProgress?.({ stage: "SAVING" });
        if (persistentVault &&
            security?.caseDataKey &&
            security.keyVersion &&
            record.caseId) {
            await this
                .privacyVaultStore
                .saveDocumentVault({
                caseId: record.caseId,
                documentId,
                vault: record.vault,
                caseDataKey: security.caseDataKey,
                keyVersion: security.keyVersion
            });
        }
        const result = {
            documentId,
            mediaType: record.mediaType,
            complete: true,
            totalPages: record.source.totalPages,
            digitalPages: record.source.digitalPages,
            ocrPages: record.source.ocrPages,
            blankPages: record.source.blankPages,
            sourceChars: record.source.sourceChars,
            pseudonymizedChars,
            chunks: publicChunks.map((chunk) => ({
                ...chunk
            })),
            privacy: {
                findings,
                counts,
                manualPseudonymizations,
                keptRanges,
                annotations,
                reversibleLocally: true
            }
        };
        record.protectedIngestion = result;
        if (this.secureDocumentStore &&
            record.caseId) {
            if (!security ||
                security.caseId !==
                    record.caseId ||
                !security.caseDataKey ||
                !Number.isInteger(security.keyVersion) ||
                (security.keyVersion ?? 0) <
                    1) {
                throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
            }
            await this
                .secureDocumentStore
                .saveProtected({
                caseId: record.caseId,
                documentId,
                ingestion: result,
                caseDataKey: security.caseDataKey,
                keyVersion: security.keyVersion
            });
        }
        return result;
    }
    async ingestPdf(data, security) {
        const review = await this.review(data, "application/pdf", security);
        return this.finalizeReview(review.documentId, [], security);
    }
    async ingestImage(data, mediaType, security) {
        const review = await this.review(data, mediaType, security);
        return this.finalizeReview(review.documentId, [], security);
    }
    async resolveProtectedChunks(selection) {
        const record = this.documents.get(selection.documentId);
        if (!record) {
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        }
        if (!record.protectedChunks) {
            throw new Error("DOCUMENT_NOT_FINALIZED");
        }
        const unique = [
            ...new Set(selection.chunkIndices)
        ].sort((a, b) => a - b);
        if (unique.length === 0 ||
            unique.length > 32 ||
            unique.some((index) => !Number.isInteger(index) ||
                index < 1)) {
            throw new Error("INVALID_DOCUMENT_CHUNK_SELECTION");
        }
        const byIndex = new Map(record.protectedChunks.map((chunk) => [chunk.index, chunk]));
        const chunks = unique.map((index) => {
            const chunk = byIndex.get(index);
            if (!chunk) {
                throw new Error("UNKNOWN_DOCUMENT_CHUNK");
            }
            return { ...chunk };
        });
        const totalChars = chunks.reduce((sum, chunk) => sum + chunk.text.length, 0);
        if (totalChars > 160_000) {
            throw new Error("DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE");
        }
        return {
            documentId: selection.documentId,
            chunks,
            totalChars,
            grammar: placeholderGrammar(chunks.map((chunk) => chunk.text).join("\n"), record.vault)
        };
    }
    async restoreDocument(args) {
        if (!this.secureDocumentStore) {
            throw new Error("DOCUMENT_STORAGE_UNAVAILABLE");
        }
        const source = await this
            .secureDocumentStore
            .loadSource(args);
        const protectedResult = await this
            .secureDocumentStore
            .loadProtected(args);
        if (protectedResult.mediaType !==
            source.mediaType) {
            throw new Error("DOCUMENT_STORAGE_MEDIA_TYPE_MISMATCH");
        }
        let vault = new PseudonymizationVault();
        if (this.privacyVaultStore) {
            vault =
                await this
                    .privacyVaultStore
                    .loadDocumentVault({
                    caseId: args.caseId,
                    documentId: args.documentId,
                    caseDataKey: args.caseDataKey,
                    keyVersion: args.keyVersion
                });
        }
        this.documents.set(args.documentId, {
            mediaType: source.mediaType,
            caseId: args.caseId,
            vault,
            source: source.source,
            protectedIngestion: protectedResult,
            protectedChunks: protectedResult
                .chunks
                .map((chunk) => ({
                ...chunk
            }))
        });
        return protectedResult;
    }
    deanonymize(documentId, text) {
        const record = this.documents.get(documentId);
        if (!record) {
            throw new Error("Unknown local document.");
        }
        return record.vault.deanonymize(text);
    }
    /**
     * The document's anonymization key: every token, the value it hides and
     * its case forms, with how often it occurs in the protected text. Needs
     * the document restored (restoreDocument) with the case key first.
     */
    privacyKey(documentId) {
        const record = this.documents.get(documentId);
        if (!record || !record.protectedChunks) {
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        }
        const counts = new Map();
        for (const chunk of record.protectedChunks) {
            for (const match of chunk.text.matchAll(/\[PII:([A-Z_]+):(\d{4})(?:\|[A-Z]{2,4})?\]/g)) {
                const token = `[PII:${match[1]}:${match[2]}]`;
                counts.set(token, (counts.get(token) ?? 0) + 1);
            }
        }
        return record.vault
            .snapshot()
            .tokens.sort((a, b) => a.token.localeCompare(b.token, "en"))
            .map((item) => {
            const entity = item.entity;
            const forms = entity
                ? PERSON_CASES.map((personCase) => ({ case: personCase, text: entity.forms[personCase].text }))
                : undefined;
            return {
                token: item.token,
                kind: item.kind,
                value: entity?.canonical ?? item.value,
                ...(forms ? { forms } : {}),
                ...(item.kind === "PERSON" ? { gender: genderOf(record.vault, item.token) } : {}),
                occurrences: counts.get(item.token) ?? 0
            };
        });
    }
    editableRecord(documentId) {
        const record = this.documents.get(documentId);
        if (!record || !record.protectedIngestion) {
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        }
        return record;
    }
    /** The anonymized version as stored: chunks with tokens, and its key. */
    anonymizedVersion(documentId) {
        const record = this.editableRecord(documentId);
        return {
            documentId,
            chunks: record.protectedIngestion.chunks.map((chunk) => ({ ...chunk })),
            entries: this.privacyKey(documentId)
        };
    }
    /**
     * Anonymizes one more value everywhere in the anonymized version: a person
     * or address in every case form, anything else verbatim. The version and
     * the key are saved together.
     */
    async addProtection(documentId, text, kind, security) {
        const record = this.editableRecord(documentId);
        const value = text.replace(/\s+/g, " ").trim();
        if (value.length < 2 || value.length > 300 || /\[|\]/.test(value)) {
            throw new Error("PRIVACY_EDIT_TEXT_INVALID");
        }
        let entity;
        if (kind === "PERSON" && this.personMorphology) {
            [entity] = await this.personMorphology.analyze([value]);
        }
        else if (kind === "ADDRESS" && this.personMorphology?.analyzeAddresses) {
            [entity] = await this.personMorphology.analyzeAddresses([value]);
        }
        const known = new Set(record.vault.snapshot().tokens.map((item) => item.token));
        const token = record.vault.getOrCreate(kind, value, entity ?? undefined);
        const stored = record.vault.entity(token);
        const surfaces = [
            ...new Set([
                value,
                ...(stored ? PERSON_CASES.map((personCase) => stored.forms[personCase].text) : [])
            ])
        ].filter((surface) => surface.trim().length >= 2);
        let replaced = 0;
        const chunks = record.protectedIngestion.chunks.map((chunk) => {
            const result = replaceOutsideTokens(chunk.text, surfaces, token);
            replaced += result.count;
            return { ...chunk, text: result.text };
        });
        if (replaced === 0) {
            // Nothing matched: do not keep a new token that stands for nothing.
            if (!known.has(token))
                record.vault.remove(token);
            throw new Error("PRIVACY_EDIT_TEXT_NOT_FOUND");
        }
        const privacy = record.protectedIngestion.privacy;
        this.replaceProtected(record, chunks, {
            ...privacy,
            findings: privacy.findings + replaced,
            manualPseudonymizations: privacy.manualPseudonymizations + replaced,
            counts: { ...privacy.counts, [kind]: (privacy.counts[kind] ?? 0) + replaced }
        });
        await this.persistEdit(documentId, record, security);
        return { ...this.anonymizedVersion(documentId), token, replaced };
    }
    /**
     * Takes a value out of the anonymization: every occurrence of the token
     * gets the value back (a person or address in the nominative, since the
     * stored text does not keep each occurrence's case) and the token leaves
     * the key.
     */
    async removeProtection(documentId, token, security) {
        const record = this.editableRecord(documentId);
        if (!/^\[PII:[A-Z_]+:\d{4}\]$/.test(token) || !record.vault.hasToken(token)) {
            throw new Error("PRIVACY_KEY_TOKEN_NOT_FOUND");
        }
        const value = record.vault.restore(token, "NOM").text;
        const kind = /^\[PII:([A-Z_]+):/.exec(token)[1];
        const pattern = new RegExp(escapeRegExp(token.slice(0, -1)) + "(?:\\|[A-Z]{2,4})?\\]", "g");
        let restored = 0;
        const chunks = record.protectedIngestion.chunks.map((chunk) => ({
            ...chunk,
            text: chunk.text.replace(pattern, () => {
                restored += 1;
                return value;
            })
        }));
        record.vault.remove(token);
        const privacy = record.protectedIngestion.privacy;
        this.replaceProtected(record, chunks, {
            ...privacy,
            findings: Math.max(0, privacy.findings - restored),
            counts: { ...privacy.counts, [kind]: Math.max(0, (privacy.counts[kind] ?? 0) - restored) }
        });
        await this.persistEdit(documentId, record, security);
        return { ...this.anonymizedVersion(documentId), restored };
    }
    /** Corrects case forms of a person or address in the key. */
    async updateKeyForms(documentId, token, forms, security) {
        const record = this.editableRecord(documentId);
        for (const value of Object.values(forms)) {
            if (typeof value !== "string" || value.length > 300 || /\[|\]/.test(value)) {
                throw new Error("PRIVACY_EDIT_TEXT_INVALID");
            }
        }
        record.vault.updateForms(token, forms);
        await this.persistEdit(documentId, record, security);
        return this.anonymizedVersion(documentId);
    }
    replaceProtected(record, chunks, privacy) {
        record.protectedIngestion = {
            ...record.protectedIngestion,
            chunks,
            pseudonymizedChars: chunks.reduce((sum, chunk) => sum + chunk.text.length, 0),
            privacy
        };
        record.protectedChunks = chunks.map((chunk) => ({ ...chunk }));
    }
    async persistEdit(documentId, record, security) {
        if (!record.caseId)
            return;
        if (!this.secureDocumentStore ||
            !this.privacyVaultStore ||
            security.caseId !== record.caseId ||
            !security.caseDataKey ||
            !security.keyVersion) {
            throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
        }
        const context = {
            caseId: record.caseId,
            documentId,
            caseDataKey: security.caseDataKey,
            keyVersion: security.keyVersion
        };
        // The key first: a version never refers to a token its key lacks.
        await this.privacyVaultStore.saveDocumentVault({ ...context, vault: record.vault });
        await this.secureDocumentStore.saveProtected({ ...context, ingestion: record.protectedIngestion });
    }
    forget(documentId) {
        return this.documents.delete(documentId);
    }
}

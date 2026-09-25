import { maskBoxes, protectedValues, wantsImage } from "./document-evidence.js";
import { createHash } from "node:crypto";
import { chunkDocumentPages } from "./document-ingestion.js";
import { LocalPolishPseudonymizer, organizationEntity, PseudonymizationVault } from "./privacy/pseudonymizer.js";
import { privacyRecognizerFor } from "./privacy/local-llm-ner.js";
import { restoreWithReport } from "./privacy/restoration-report.js";
import { genderOf, placeholderGrammar } from "./privacy/token-legend.js";
import { PERSON_CASES } from "./privacy/person-morphology.js";
import { DOCX_MEDIA_TYPE, ODT_MEDIA_TYPE } from "./office-document-extractor.js";
import { XLSX_MEDIA_TYPE, XLSM_MEDIA_TYPE, CSV_MEDIA_TYPE, TSV_MEDIA_TYPE } from "./spreadsheet-extractor.js";
/**
 * OCR correction by the local model: on for "z AI" anonymization unless
 * switched off (undo), and on its own for "Tylko OCR z korektą AI".
 */
export function shouldCorrectOcr(security) {
    return (security?.ocrFix === true ||
        (security?.localAi === true && security.ocrFix !== false));
}
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
const PROTECTED_PART = /(\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\])/;
const PAGE_HEADER = /^\[STRONA [^\]\n]+\]\n?/gm;
/**
 * Lines the anonymized text up with the source to show the original words
 * (in their original case) where each token stands. A token takes the
 * longest of its known forms found at that point; otherwise the text up to
 * where the next literal part continues in the source.
 */
export function highlightProtected(protectedText, source, surfaces, fallback) {
    const parts = protectedText.split(PROTECTED_PART);
    const lower = source.toLocaleLowerCase("pl");
    let cursor = 0;
    let text = "";
    const marks = [];
    for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index];
        if (index % 2 === 0) {
            text += part;
            const literal = part.replace(PAGE_HEADER, "");
            if (literal) {
                const found = source.indexOf(literal, cursor);
                if (found >= 0 && found - cursor < 4000)
                    cursor = found + literal.length;
            }
            continue;
        }
        const token = part.replace(/\|[A-Z]{2,4}\]$/, "]");
        const kind = /^\[PII:([A-Z_]+):/.exec(token)[1];
        let original = "";
        for (const surface of [...surfaces(token)].sort((a, b) => b.length - a.length)) {
            if (surface && lower.startsWith(surface.toLocaleLowerCase("pl"), cursor)) {
                original = source.slice(cursor, cursor + surface.length);
                break;
            }
        }
        if (!original) {
            const anchor = (parts[index + 1] ?? "").replace(PAGE_HEADER, "").slice(0, 24);
            const found = anchor ? source.indexOf(anchor, cursor) : -1;
            if (found > cursor && found - cursor <= 300)
                original = source.slice(cursor, found);
        }
        // Not found in the source (e.g. text changed since): the stored value.
        const shown = original || fallback(token);
        cursor += original.length;
        text += shown;
        marks.push({ start: text.length - shown.length, end: text.length, token, kind });
    }
    return { text, marks };
}
function withAiMemory(recognizer, memory) {
    return memory ? rememberingRecognizer(recognizer, memory) : recognizer;
}
/** Reuses the local-AI findings of a page already checked during the review. */
function rememberingRecognizer(inner, memory) {
    return {
        recognize: async (text) => {
            const known = memory.get(text);
            if (known)
                return known.map((span) => ({ ...span }));
            const found = await inner.recognize(text);
            memory.set(text, found.map((span) => ({ ...span })));
            return found;
        }
    };
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
    pageMasker;
    ocrCorrector;
    documents = new Map();
    constructor(pdfIngestor, namedEntities, maxChunkChars = 24_000, imageIngestor, privacyVaultStore, secureDocumentStore, officeExtractor, spreadsheetExtractor, 
    // One token per person and inflected restore ([PII:PERSON:0001|GEN]).
    personMorphology, 
    // Masks personal data on scanned pages sent to a model as evidence.
    pageMasker, 
    // "z lokalnym AI": fixes OCR errors before anonymization.
    ocrCorrector) {
        this.pdfIngestor = pdfIngestor;
        this.namedEntities = namedEntities;
        this.maxChunkChars = maxChunkChars;
        this.imageIngestor = imageIngestor;
        this.privacyVaultStore = privacyVaultStore;
        this.secureDocumentStore = secureDocumentStore;
        this.officeExtractor = officeExtractor;
        this.spreadsheetExtractor = spreadsheetExtractor;
        this.personMorphology = personMorphology;
        this.pageMasker = pageMasker;
        this.ocrCorrector = ocrCorrector;
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
        const extracted = await this.extract(data, mediaType, onProgress);
        const source = shouldCorrectOcr(security)
            ? await this.correctOcr(extracted, onProgress)
            : extracted;
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
            ...(security?.localAi ? { localAi: true, aiFindings: new Map() } : {}),
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
            const preview = await new LocalPolishPseudonymizer(suggestionVault, withAiMemory(privacyRecognizerFor(this.namedEntities, page.source === "OCR", security?.localAi
                ? {
                    onCheck: (item, done, total) => onProgress?.({ stage: "AI_CHECK", done, total, item: `s. ${page.page}: ${item}`.slice(0, 160) })
                }
                : undefined), this.documents.get(documentId)?.aiFindings), this.personMorphology).pseudonymize(page.text);
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
                    : {}),
                ...(page.corrections?.length
                    ? { corrections: page.corrections }
                    : {})
            })),
            suggestions
        };
    }
    /** OCR pages through the local model's correction (original words kept). */
    async correctOcr(source, onProgress) {
        if (!this.ocrCorrector || !source.pages.some((page) => page.source === "OCR" && page.lines?.length)) {
            return source;
        }
        const pages = [];
        for (const page of source.pages) {
            pages.push(await this.ocrCorrector.correct(page, (item, done, total) => onProgress?.({ stage: "AI_CHECK", done, total, item: `korekta OCR s. ${page.page}: ${item}`.slice(0, 160) })));
        }
        if (!pages.some((page) => page.corrections?.length))
            return source;
        return {
            ...source,
            pages,
            sourceChars: pages.reduce((sum, page) => sum + page.text.length, 0),
            chunks: chunkDocumentPages(pages, this.maxChunkChars)
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
        }
        const pages = [];
        const counts = {};
        const annotations = [];
        let findings = 0;
        let manualPseudonymizations = 0;
        let keptRanges = 0;
        const onProgress = security?.onProgress;
        const pseudonymizePages = async () => {
            for (const [pageIndex, page] of record.source.pages.entries()) {
                onProgress?.({ stage: "PSEUDONYMIZING", done: pageIndex, total: record.source.pages.length });
                const pageDirectives = directives
                    .filter((directive) => directive.page === page.page)
                    .map(({ page: _page, ...directive }) => directive);
                const protectedPage = await new LocalPolishPseudonymizer(record.vault, withAiMemory(privacyRecognizerFor(this.namedEntities, page.source === "OCR", record.localAi
                    ? {
                        onCheck: (item, done, total) => onProgress?.({ stage: "AI_CHECK", done, total, item: `s. ${page.page}: ${item}`.slice(0, 160) })
                    }
                    : undefined), record.aiFindings), this.personMorphology).pseudonymize(page.text, pageDirectives);
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
        };
        // One key per case: the document is pseudonymized with the case's
        // shared key under the case lock, so a person keeps one symbol in all of
        // the case's documents. Without a store that supports it (tests, older
        // setups) the document keeps its own key.
        const sharedStore = persistentVault && this.privacyVaultStore.withSharedVault
            ? this.privacyVaultStore
            : undefined;
        if (sharedStore) {
            await sharedStore.withSharedVault({ caseId: record.caseId, caseDataKey: security.caseDataKey, keyVersion: security.keyVersion }, documentId, async (vault) => {
                record.vault = vault;
                await pseudonymizePages();
            });
            record.sharedKey = true;
        }
        else {
            if (persistentVault) {
                record.vault = await this.privacyVaultStore.loadDocumentVault({
                    caseId: record.caseId,
                    documentId,
                    caseDataKey: security.caseDataKey,
                    keyVersion: security.keyVersion
                });
            }
            await pseudonymizePages();
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
        if (!sharedStore &&
            persistentVault &&
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
    async resolveProtectedChunks(selection, options = {}) {
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
        const images = options.images
            ? await this.evidenceImages(record, chunks, options.images)
            : [];
        return {
            documentId: selection.documentId,
            chunks,
            totalChars,
            grammar: placeholderGrammar(chunks.map((chunk) => chunk.text).join("\n"), record.vault),
            totalPages: record.source.totalPages,
            ...(images.length ? { images } : {})
        };
    }
    /**
     * Pages of the chunks as images (photos by default, text pages on request),
     * with everything the
     * document's current key hides painted black (so key edits apply), plus
     * unreadable regions and badly read lines. A page that cannot be aligned
     * or masked is not sent.
     */
    async evidenceImages(record, chunks, policy) {
        if (!this.pageMasker)
            return [];
        const wanted = new Set(chunks.flatMap((chunk) => Array.from({ length: chunk.pageEnd - chunk.pageStart + 1 }, (_, offset) => chunk.pageStart + offset)));
        const values = protectedValues(record.vault.snapshot().tokens);
        const images = [];
        for (const page of record.source.pages) {
            if (!wanted.has(page.page) || !page.image || !wantsImage(page, record.mediaType, policy))
                continue;
            const boxes = maskBoxes(page, values);
            if (!boxes)
                continue;
            try {
                images.push({
                    page: page.page,
                    mediaType: "image/jpeg",
                    data: await this.pageMasker.mask(page.image.jpeg, boxes),
                    masked: boxes.length
                });
            }
            catch (error) {
                process.stderr.write(`EVIDENCE_IMAGE_SKIPPED:${error instanceof Error ? error.message : String(error)}\n`);
            }
        }
        return images;
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
        const sharedKey = Boolean(this.privacyVaultStore?.sharedMembers &&
            (await this.privacyVaultStore.sharedMembers({
                caseId: args.caseId,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion
            })).has(args.documentId));
        this.documents.set(args.documentId, {
            mediaType: source.mediaType,
            caseId: args.caseId,
            vault,
            sharedKey,
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
                ...(item.kind === "PERSON" && entity
                    ? {
                        entity: entity.type === "organization" ? "organization" : entity.number === "pl" ? "group" : "person",
                        ...(entity.legalForm ? { legalForm: entity.legalForm } : {})
                    }
                    : {}),
                occurrences: counts.get(item.token) ?? 0
            };
        })
            // A shared key also holds the case's other documents' entries.
            .filter((entry) => !record.sharedKey || entry.occurrences > 0);
    }
    editableRecord(documentId) {
        const record = this.documents.get(documentId);
        if (!record || !record.protectedIngestion) {
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        }
        return record;
    }
    /** The case's shared key, to give chat the same symbols as the documents. */
    async sharedKeyState(args) {
        return (await this.privacyVaultStore?.sharedState?.(args)) ?? null;
    }
    /** Whether a restored document uses the case's shared key. */
    usesSharedKey(documentId) {
        return Boolean(this.documents.get(documentId)?.sharedKey);
    }
    /** Values of this document's key put back into any text (a file with its placeholders). */
    restoreText(documentId, text) {
        const record = this.documents.get(documentId);
        if (!record)
            throw new Error("UNKNOWN_LOCAL_DOCUMENT");
        const result = restoreWithReport(text, record.vault);
        return { text: result.text, count: result.restorations.length, unresolved: result.unresolved };
    }
    /** The anonymized version as stored: chunks with tokens, and its key. */
    anonymizedVersion(documentId) {
        const record = this.editableRecord(documentId);
        const vault = record.vault;
        const surfaces = (token) => {
            const entity = vault.entity(token);
            const value = vault.hasToken(token) ? vault.restore(token, null).text : "";
            return [
                ...new Set([
                    value,
                    ...(entity ? PERSON_CASES.map((personCase) => entity.forms[personCase].text) : [])
                ])
            ].filter(Boolean);
        };
        const fallback = (token) => vault.hasToken(token) ? vault.restore(token, "NOM").text : token;
        const chunks = record.protectedIngestion.chunks;
        return {
            documentId,
            totalPages: record.source.totalPages,
            chunks: chunks.map((chunk) => ({ ...chunk })),
            highlighted: chunks.map((chunk) => {
                const source = record.source.pages
                    .filter((page) => page.page >= chunk.pageStart && page.page <= chunk.pageEnd)
                    .map((page) => page.text)
                    .join("\n");
                return {
                    index: chunk.index,
                    pageStart: chunk.pageStart,
                    pageEnd: chunk.pageEnd,
                    ...highlightProtected(chunk.text, source, surfaces, fallback)
                };
            }),
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
        const { token, replaced } = await this.withKey(documentId, record, security, (vault) => {
            const known = new Set(vault.snapshot().tokens.map((item) => item.token));
            const token = vault.getOrCreate(kind, value, entity ?? undefined);
            const stored = vault.entity(token);
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
                    vault.remove(token);
                throw new Error("PRIVACY_EDIT_TEXT_NOT_FOUND");
            }
            const privacy = record.protectedIngestion.privacy;
            this.replaceProtected(record, chunks, {
                ...privacy,
                findings: privacy.findings + replaced,
                manualPseudonymizations: privacy.manualPseudonymizations + replaced,
                counts: { ...privacy.counts, [kind]: (privacy.counts[kind] ?? 0) + replaced }
            });
            return { token, replaced };
        });
        return { ...this.anonymizedVersion(documentId), token, replaced };
    }
    /**
     * Takes a value out of the anonymization: every occurrence of the token
     * gets the value back (a person or address in the nominative, since the
     * stored text does not keep each occurrence's case). With a document's own
     * key the token leaves it; the case's shared key keeps it for the other
     * documents and this document's key simply no longer lists it.
     */
    async removeProtection(documentId, token, security) {
        const record = this.editableRecord(documentId);
        if (!/^\[PII:[A-Z_]+:\d{4}\]$/.test(token))
            throw new Error("PRIVACY_KEY_TOKEN_NOT_FOUND");
        const restored = await this.withKey(documentId, record, security, (vault) => {
            if (!vault.hasToken(token))
                throw new Error("PRIVACY_KEY_TOKEN_NOT_FOUND");
            const value = vault.restore(token, "NOM").text;
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
            if (!record.sharedKey)
                vault.remove(token);
            const privacy = record.protectedIngestion.privacy;
            this.replaceProtected(record, chunks, {
                ...privacy,
                findings: Math.max(0, privacy.findings - restored),
                counts: { ...privacy.counts, [kind]: Math.max(0, (privacy.counts[kind] ?? 0) - restored) }
            });
            return restored;
        });
        return { ...this.anonymizedVersion(documentId), restored };
    }
    /**
     * Moves a document with its own key onto the case's shared key without
     * re-running OCR: every token of its key is matched to the shared key (the
     * same person or value keeps one token case-wide, new ones get the next
     * free number) and the anonymized version is rewritten with those tokens.
     */
    async joinSharedKey(documentId, security) {
        const record = this.editableRecord(documentId);
        const store = this.privacyVaultStore;
        if (!store?.withSharedVault || !record.caseId)
            throw new Error("SHARED_KEY_UNAVAILABLE");
        if (record.sharedKey)
            return { ...this.anonymizedVersion(documentId), remapped: 0 };
        if (security.caseId !== record.caseId || !security.caseDataKey || !security.keyVersion) {
            throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
        }
        const own = record.vault.snapshot().tokens;
        let remapped = 0;
        await store.withSharedVault({ caseId: record.caseId, caseDataKey: security.caseDataKey, keyVersion: security.keyVersion }, documentId, async (vault) => {
            const map = new Map();
            for (const item of own) {
                map.set(item.token, vault.getOrCreate(item.kind, item.value, item.entity));
            }
            const chunks = record.protectedIngestion.chunks.map((chunk) => ({
                ...chunk,
                // One pass, so a remapped token is never remapped again.
                text: chunk.text.replace(/\[PII:([A-Z_]+):(\d{4})(\|[A-Z]{2,4})?\]/g, (match, kind, sequence, requestedCase) => {
                    const next = map.get(`[PII:${kind}:${sequence}]`);
                    if (!next)
                        return match;
                    remapped += 1;
                    return requestedCase ? next.slice(0, -1) + requestedCase + "]" : next;
                })
            }));
            this.replaceProtected(record, chunks, record.protectedIngestion.privacy);
            record.vault = vault;
        });
        record.sharedKey = true;
        await this.persistEdit(documentId, record, security, false);
        return { ...this.anonymizedVersion(documentId), remapped };
    }
    /** Corrects case forms of a person or address in the key (case-wide with a shared key). */
    async updateKeyForms(documentId, token, forms, security) {
        const record = this.editableRecord(documentId);
        for (const value of Object.values(forms)) {
            if (typeof value !== "string" || value.length > 300 || /\[|\]/.test(value)) {
                throw new Error("PRIVACY_EDIT_TEXT_INVALID");
            }
        }
        await this.withKey(documentId, record, security, (vault) => {
            vault.updateForms(token, forms);
        });
        return this.anonymizedVersion(documentId);
    }
    /**
     * Sets what a person token is: a man or a woman (forms of that gender), a
     * family named together (plural forms), or a firm (never inflected). The
     * model's key and the restored forms follow.
     */
    async updateKeyGrammar(documentId, token, grammar, security) {
        const record = this.editableRecord(documentId);
        await this.withKey(documentId, record, security, async (vault) => {
            const current = vault.entity(token);
            if (!current)
                throw new Error("PRIVACY_KEY_ENTITY_NOT_FOUND");
            // The name as the key holds it: a firm as written, a person in the nominative.
            const name = current.canonical;
            if (grammar === "organization") {
                vault.setEntity(token, organizationEntity(name, current.legalForm));
                return;
            }
            const gender = grammar === "f" || grammar === "group-f" ? "f" : "m1";
            const group = grammar.startsWith("group");
            const [analysed] = this.personMorphology
                ? await this.personMorphology.analyze([name], [{ genderHint: gender, numberHint: group ? "pl" : "sg" }])
                : [null];
            if (group && analysed?.number !== "pl")
                throw new Error("PRIVACY_KEY_GROUP_UNSUPPORTED");
            const { type: _type, legalForm: _legalForm, ...base } = current;
            vault.setEntity(token, analysed
                ? { ...analysed, status: "ok", genderAlternatives: [], warnings: analysed.warnings.filter((w) => w !== "GENDER_HEURISTIC") }
                : { ...base, gender, status: "ok", genderAlternatives: [], warnings: base.warnings.filter((w) => w !== "GENDER_HEURISTIC") });
        });
        return this.anonymizedVersion(documentId);
    }
    /**
     * Runs a key change on the current key and saves it with the anonymized
     * version: the case's shared key is re-read under the case lock (another
     * document may have added entries since), a document's own key is edited
     * in place.
     */
    async withKey(documentId, record, security, change) {
        const store = this.privacyVaultStore;
        if (record.sharedKey && store?.withSharedVault && record.caseId) {
            if (security.caseId !== record.caseId || !security.caseDataKey || !security.keyVersion) {
                throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
            }
            const result = await store.withSharedVault({ caseId: record.caseId, caseDataKey: security.caseDataKey, keyVersion: security.keyVersion }, documentId, async (vault) => {
                const value = await change(vault);
                record.vault = vault;
                return value;
            });
            await this.persistEdit(documentId, record, security, false);
            return result;
        }
        const result = await change(record.vault);
        await this.persistEdit(documentId, record, security, true);
        return result;
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
    async persistEdit(documentId, record, security, saveVault) {
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
        if (saveVault)
            await this.privacyVaultStore.saveDocumentVault({ ...context, vault: record.vault });
        await this.secureDocumentStore.saveProtected({ ...context, ingestion: record.protectedIngestion });
    }
    forget(documentId) {
        return this.documents.delete(documentId);
    }
}

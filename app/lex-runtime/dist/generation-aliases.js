import { agreementIssues } from "./privacy/restoration-report.js";
import { PERSON_CASES } from "./privacy/person-morphology.js";
import { genderOf } from "./privacy/token-legend.js";
export function buildGenerationAliases(documents) {
    let ownKeyIndex = 0;
    const sharedTokens = new Set();
    if (documents.length > 99) {
        throw new Error("GENERATION_DOCUMENT_LIMIT");
    }
    const entries = [];
    const documentIds = new Set();
    documents.forEach((document, documentIndex) => {
        if (!/^doc_[a-f0-9]{24}$/
            .test(document.documentId) ||
            documentIds.has(document.documentId)) {
            throw new Error("GENERATION_DOCUMENT_INVALID");
        }
        documentIds.add(document.documentId);
        void documentIndex;
        // Own-key documents are numbered in order, as the attachment context
        // namespaces them (session-executor namespaceDocumentAttachmentTokens).
        const prefix = document.shared
            ? "D00"
            : "D" +
                String(++ownKeyIndex).padStart(2, "0");
        for (const item of document.vault
            .snapshot()
            .tokens
            .sort((a, b) => a.token.localeCompare(b.token, "en"))) {
            const match = /^\[PII:([A-Z_]+):(\d{4})\]$/
                .exec(item.token);
            if (!match) {
                throw new Error("GENERATION_SOURCE_TOKEN_INVALID");
            }
            if (document.shared) {
                if (sharedTokens.has(item.token))
                    continue;
                sharedTokens.add(item.token);
            }
            entries.push({
                alias: `[LMPII:${prefix}:${match[1]}:${match[2]}]`,
                documentId: document.documentId,
                sourceToken: item.token,
                kind: item.kind,
                ...(item.kind === "PERSON"
                    ? item.entity?.type === "organization"
                        ? { entity: "organization", ...(item.entity.legalForm ? { legalForm: item.entity.legalForm } : {}) }
                        : { gender: genderOf(document.vault, item.token), ...(item.entity?.number === "pl" ? { entity: "group" } : {}) }
                    : {})
            });
        }
    });
    return {
        schemaVersion: 1,
        entries
    };
}
export function resolveGenerationAliases(manifest, vaults) {
    const result = new Map();
    for (const entry of manifest.entries) {
        const vault = vaults.get(entry.documentId);
        if (!vault) {
            throw new Error("GENERATION_VAULT_MISSING");
        }
        const value = vault.restore(entry.sourceToken, null).text;
        if (result.has(entry.alias)) {
            throw new Error("GENERATION_ALIAS_DUPLICATE");
        }
        result.set(entry.alias, value);
        // A person alias may be written with its case ([LMPII:D01:PERSON:0001|GEN]).
        if (vault.entity(entry.sourceToken)) {
            for (const personCase of PERSON_CASES) {
                result.set(entry.alias.slice(0, -1) + "|" + personCase + "]", vault.restore(entry.sourceToken, personCase).text);
            }
        }
    }
    return result;
}
const DOCUMENT_ALIAS = /\[LMPII:D\d{2}:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\]/g;
export function describeGenerationAliases(tokenizedText, manifest, vaults) {
    const counts = new Map();
    for (const match of tokenizedText.matchAll(DOCUMENT_ALIAS)) {
        counts.set(match[0], (counts.get(match[0]) ?? 0) + 1);
    }
    const entityOfAlias = (alias) => {
        const entry = manifest.entries.find((item) => item.alias === alias);
        return entry ? vaults.get(entry.documentId)?.entity(entry.sourceToken) : undefined;
    };
    // Per alias as written: the first disagreement found among its occurrences.
    const agreement = new Map();
    const issues = agreementIssues(tokenizedText, entityOfAlias);
    for (const match of tokenizedText.matchAll(DOCUMENT_ALIAS)) {
        const note = issues.get(match.index);
        if (note && !agreement.has(match[0]))
            agreement.set(match[0], note);
    }
    return [...counts].map(([alias, occurrences]) => {
        const [, base, requestedCase] = /^(\[LMPII:D\d{2}:[A-Z_]+:\d{4})(?:\|([A-Z]{2,4}))?\]$/.exec(alias);
        const entry = manifest.entries.find((item) => item.alias === `${base}]`);
        const vault = entry ? vaults.get(entry.documentId) : undefined;
        if (!entry || !vault || !vault.hasToken(entry.sourceToken)) {
            return {
                alias,
                kind: /:([A-Z_]+):\d{4}/.exec(alias)[1],
                text: alias,
                source: "unresolved",
                confidence: 0,
                status: "unresolved",
                occurrences
            };
        }
        const restored = vault.restore(entry.sourceToken, requestedCase ?? null);
        const entity = vault.entity(entry.sourceToken);
        return {
            alias,
            kind: entry.kind,
            ...(requestedCase ? { case: requestedCase } : entity ? { case: "NOM", caseMissing: true } : {}),
            text: restored.text,
            source: entity ? restored.source : "vault",
            confidence: restored.confidence,
            status: restored.status === "ok" && entity && entity.status !== "ok"
                ? entity.status
                : restored.status === "unknown_token"
                    ? "unresolved"
                    : restored.status === "ok" && entity && (!requestedCase || agreement.has(alias))
                        // No case (the nominative is a guess, hard gate) or a verb that
                        // disagrees with the key: a person checks it.
                        ? "needs_review"
                        : restored.status,
            ...(entity ? { canonical: entity.canonical } : {}),
            ...(agreement.has(alias) ? { agreement: agreement.get(alias) } : {}),
            // Gender matters for remembering a person's name form, not for addresses.
            ...(entity && (entity.gender === "m1" || entity.gender === "f") ? { gender: entity.gender } : {}),
            occurrences
        };
    });
}
export function renderRestorationPreview(tokenizedText, restorations) {
    const byAlias = new Map(restorations.map((item) => [item.alias, item]));
    const marks = [];
    let text = "";
    let cursor = 0;
    for (const match of tokenizedText.matchAll(DOCUMENT_ALIAS)) {
        text += tokenizedText.slice(cursor, match.index);
        cursor = match.index + match[0].length;
        const value = byAlias.get(match[0])?.text ?? match[0];
        marks.push({ start: text.length, end: text.length + value.length, alias: match[0] });
        text += value;
    }
    text += tokenizedText.slice(cursor);
    return { text, restorations, marks };
}
const OVERRIDE_TEXT = /^[^\[\]\r\n]{1,300}$/u;
/** User corrections replace restored values, only for aliases the document uses. */
export function applyRestorationOverrides(replacements, restorations, overrides) {
    if (!overrides)
        return;
    const used = new Set(restorations.map((item) => item.alias));
    for (const [alias, value] of Object.entries(overrides)) {
        if (!used.has(alias) ||
            !replacements.has(alias) ||
            typeof value !== "string" ||
            !OVERRIDE_TEXT.test(value.trim())) {
            throw new Error("DEANONYMIZATION_OVERRIDE_INVALID");
        }
        replacements.set(alias, value.trim());
    }
}

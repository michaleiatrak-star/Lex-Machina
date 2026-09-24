import { PERSON_CASES } from "./privacy/person-morphology.js";
export function buildGenerationAliases(documents) {
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
        const prefix = "D" +
            String(documentIndex + 1).padStart(2, "0");
        for (const item of document.vault
            .snapshot()
            .tokens
            .sort((a, b) => a.token.localeCompare(b.token, "en"))) {
            const match = /^\[PII:([A-Z_]+):(\d{4})\]$/
                .exec(item.token);
            if (!match) {
                throw new Error("GENERATION_SOURCE_TOKEN_INVALID");
            }
            entries.push({
                alias: `[LMPII:${prefix}:${match[1]}:${match[2]}]`,
                documentId: document.documentId,
                sourceToken: item.token,
                kind: item.kind
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

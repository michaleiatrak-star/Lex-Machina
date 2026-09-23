const STOP_WORDS = new Set([
    "oraz",
    "jest",
    "dla",
    "nie",
    "się",
    "sie",
    "czy",
    "jak",
    "lub",
    "ale",
    "przez",
    "przy",
    "nad",
    "pod",
    "bez",
    "ten",
    "ta",
    "to",
    "te",
    "tych",
    "tym",
    "który",
    "ktory",
    "która",
    "ktora",
    "które",
    "ktore",
    "został",
    "zostal",
    "została",
    "zostala",
    "oraz",
    "wraz",
    "jako",
    "jego",
    "jej",
    "ich"
]);
function normalizedText(value) {
    return value
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .toLowerCase();
}
function terms(value) {
    return (normalizedText(value)
        .match(/[\p{L}\p{N}]+/gu) ??
        []).filter((term) => term.length >= 3 &&
        !STOP_WORDS.has(term));
}
function frequency(haystack, needle) {
    let count = 0;
    for (const item of haystack) {
        if (item === needle) {
            count += 1;
        }
    }
    return count;
}
export class LocalCaseKnowledgeSearch {
    documents;
    maxDocuments;
    maxChunks;
    maxQueryChars;
    constructor(documents, options = {}) {
        this.documents = documents;
        this.maxDocuments =
            options.maxDocuments ?? 500;
        this.maxChunks =
            options.maxChunks ?? 5_000;
        this.maxQueryChars =
            options.maxQueryChars ?? 500;
    }
    async search(args) {
        const query = args.query.trim();
        if (query.length < 2 ||
            query.length >
                this.maxQueryChars) {
            throw new Error("INVALID_KNOWLEDGE_QUERY");
        }
        const queryTerms = [...new Set(terms(query))].slice(0, 32);
        if (queryTerms.length === 0) {
            throw new Error("INVALID_KNOWLEDGE_QUERY");
        }
        const limit = args.limit ?? 8;
        if (!Number.isInteger(limit) ||
            limit < 1 ||
            limit > 16) {
            throw new Error("INVALID_KNOWLEDGE_LIMIT");
        }
        const documentIds = await this.documents
            .listDocumentIds(args.caseId);
        if (documentIds.length >
            this.maxDocuments) {
            throw new Error("KNOWLEDGE_DOCUMENT_LIMIT_EXCEEDED");
        }
        const normalizedQuery = normalizedText(query);
        const hits = [];
        let chunkCount = 0;
        for (const documentId of documentIds) {
            const protectedDocument = await this.documents
                .loadProtected({
                caseId: args.caseId,
                documentId,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion
            });
            chunkCount +=
                protectedDocument
                    .chunks.length;
            if (chunkCount >
                this.maxChunks) {
                throw new Error("KNOWLEDGE_CHUNK_LIMIT_EXCEEDED");
            }
            for (const chunk of protectedDocument
                .chunks) {
                const chunkTerms = terms(chunk.text);
                if (chunkTerms.length === 0) {
                    continue;
                }
                let score = 0;
                let matchedTerms = 0;
                for (const queryTerm of queryTerms) {
                    const count = frequency(chunkTerms, queryTerm);
                    if (count > 0) {
                        matchedTerms += 1;
                        score +=
                            count * 1000 /
                                (24 +
                                    chunkTerms.length);
                    }
                }
                if (matchedTerms === 0) {
                    continue;
                }
                score +=
                    matchedTerms * 2;
                if (normalizedQuery.length <=
                    160 &&
                    normalizedText(chunk.text).includes(normalizedQuery)) {
                    score += 12;
                }
                hits.push({
                    caseId: args.caseId,
                    documentId,
                    chunkIndex: chunk.index,
                    pageStart: chunk.pageStart,
                    pageEnd: chunk.pageEnd,
                    score: Number(score.toFixed(6)),
                    text: chunk.text
                });
            }
        }
        return hits
            .sort((left, right) => right.score -
            left.score ||
            left.documentId
                .localeCompare(right.documentId) ||
            left.chunkIndex -
                right.chunkIndex)
            .slice(0, limit);
    }
}

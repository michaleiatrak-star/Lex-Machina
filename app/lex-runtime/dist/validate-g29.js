import { CompleteDocumentIngestor } from "./document-ingestion.js";
import { LocalPrivateDocumentService } from "./document-service.js";
const pageSource = {
    async extract(data) {
        return {
            bytes: data.byteLength,
            pages: [
                {
                    page: 1,
                    text: "Jan Kowalski, PESEL 44051401458, opis sprawy " +
                        "A".repeat(900)
                },
                {
                    page: 2,
                    text: ""
                }
            ]
        };
    }
};
const ocr = {
    async recognizePages(_data, pages) {
        return pages.map((page) => ({
            page,
            text: "Zeskanowana strona: Anna Nowak, e-mail anna@example.pl.",
            confidence: 0.98,
            lineCount: 1,
            engine: "PP-OCRv6-test-double"
        }));
    }
};
const namedEntities = {
    async recognize(text) {
        const names = ["Jan Kowalski", "Anna Nowak"];
        return names.flatMap((value) => {
            const start = text.indexOf(value);
            return start < 0
                ? []
                : [{
                        start,
                        end: start + value.length,
                        kind: "PERSON",
                        value,
                        confidence: 0.99
                    }];
        });
    }
};
const service = new LocalPrivateDocumentService(new CompleteDocumentIngestor(pageSource, ocr, {
    maxBytes: 100_000,
    maxPages: 100,
    maxTotalChars: 100_000,
    minDigitalCharsPerPage: 40,
    maxChunkChars: 700
}), namedEntities, 700);
const result = await service.ingestPdf(new TextEncoder().encode("G29"));
const publicText = result.chunks
    .map((chunk) => chunk.text)
    .join("\n");
for (const secret of [
    "Jan Kowalski",
    "Anna Nowak",
    "44051401458",
    "anna@example.pl"
]) {
    if (publicText.includes(secret)) {
        throw new Error(`G29 public document chunks exposed protected data: ${secret}`);
    }
}
if (!result.complete ||
    result.totalPages !== 2 ||
    result.ocrPages !== 1 ||
    result.chunks.length < 2) {
    throw new Error("G29 document pipeline did not preserve complete/chunked ingestion.");
}
process.stdout.write(JSON.stringify({
    gate: "G29_PRIVATE_DOCUMENT_PIPELINE",
    result: "PASS",
    documentId: result.documentId,
    totalPages: result.totalPages,
    ocrPages: result.ocrPages,
    chunks: result.chunks.length,
    privacyFindings: result.privacy.findings,
    publicChunksContainOriginalPii: false
}, null, 2) + "\n");

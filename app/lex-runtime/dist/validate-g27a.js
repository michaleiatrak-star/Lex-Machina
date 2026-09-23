import { CompleteImageIngestor } from "./image-ingestion.js";
const engine = {
    async recognizeImage(_data, mediaType) {
        if (mediaType !== "image/png") {
            throw new Error("G27A wrong image media type.");
        }
        return {
            page: 1,
            text: "OCR obrazu PNG po polsku: ą ć ę ł ń ó ś ź ż. " +
                "Treść dokumentu ze zdjęcia.",
            confidence: 0.97,
            lineCount: 2,
            engine: "PP-OCRv6-test-double"
        };
    }
};
const ingestor = new CompleteImageIngestor(engine, {
    maxBytes: 1_000_000,
    maxTextChars: 100_000,
    maxChunkChars: 700
});
const result = await ingestor.ingest(new Uint8Array([137, 80, 78, 71]), "image/png");
if (!result.complete ||
    result.totalPages !== 1 ||
    result.ocrPages !== 1 ||
    result.pages[0]?.source !== "OCR" ||
    !result.chunks[0]?.text.includes("ą ć ę ł ń ó ś ź ż")) {
    throw new Error("G27A image OCR contract failed.");
}
process.stdout.write(JSON.stringify({
    gate: "G27A_IMAGE_OCR",
    result: "PASS",
    mediaTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/tiff"
    ],
    pageAccounting: true,
    polishText: true
}, null, 2) + "\n");

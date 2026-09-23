import { createHash } from "node:crypto";
import { chunkDocumentPages } from "./document-ingestion.js";
export class CompleteImageIngestor {
    ocr;
    limits;
    constructor(ocr, limits = {
        maxBytes: 128 * 1024 * 1024,
        maxTextChars: 10_000_000,
        maxChunkChars: 24_000
    }) {
        this.ocr = ocr;
        this.limits = limits;
    }
    async ingest(data, mediaType) {
        if (data.byteLength > this.limits.maxBytes) {
            throw new Error("IMAGE_TOO_LARGE");
        }
        const result = await this.ocr.recognizeImage(data, mediaType);
        if (result.page !== 1) {
            throw new Error("IMAGE_OCR_PAGE_INVALID");
        }
        const text = result.text.trim();
        if (text.length > this.limits.maxTextChars) {
            throw new Error("IMAGE_TEXT_TOO_LARGE");
        }
        const page = {
            page: 1,
            text,
            source: text ? "OCR" : "BLANK",
            ...(result.confidence !== undefined
                ? { confidence: result.confidence }
                : {}),
            ...(result.lineCount !== undefined
                ? { lineCount: result.lineCount }
                : {}),
            ...(result.engine ? { engine: result.engine } : {})
        };
        const chunks = chunkDocumentPages([page], this.limits.maxChunkChars);
        if (chunks.reduce((sum, chunk) => sum + chunk.sourceChars, 0) !== text.length) {
            throw new Error("IMAGE_CHUNKING_INCOMPLETE");
        }
        return {
            complete: true,
            sha256: createHash("sha256")
                .update(data)
                .digest("hex"),
            bytes: data.byteLength,
            totalPages: 1,
            digitalPages: 0,
            ocrPages: text ? 1 : 0,
            blankPages: text ? 0 : 1,
            sourceChars: text.length,
            pages: [page],
            chunks
        };
    }
}

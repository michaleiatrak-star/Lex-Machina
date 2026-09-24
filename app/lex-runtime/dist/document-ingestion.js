import { createHash } from "node:crypto";
export const DEFAULT_DOCUMENT_INGESTION_LIMITS = {
    maxBytes: 512 * 1024 * 1024,
    maxPages: 10_000,
    maxTotalChars: 100_000_000,
    minDigitalCharsPerPage: 40,
    maxChunkChars: 24_000
};
export class DocumentIngestionError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "DocumentIngestionError";
    }
}
function assertPageSequence(pages) {
    for (let i = 0; i < pages.length; i += 1) {
        if (pages[i]?.page !== i + 1) {
            throw new DocumentIngestionError("Document page extraction did not account for every page in order.", "PAGE_SEQUENCE_INVALID");
        }
    }
}
function splitLosslessly(value, maxChars) {
    if (value.length <= maxChars)
        return [value];
    const parts = [];
    for (let offset = 0; offset < value.length; offset += maxChars) {
        parts.push(value.slice(offset, offset + maxChars));
    }
    return parts;
}
export function chunkDocumentPages(pages, maxChunkChars) {
    if (maxChunkChars < 512) {
        throw new Error("maxChunkChars must be at least 512.");
    }
    const chunks = [];
    let buffer = "";
    let pageStart = 0;
    let pageEnd = 0;
    let sourceChars = 0;
    const flush = () => {
        if (!buffer)
            return;
        chunks.push({
            index: chunks.length + 1,
            pageStart,
            pageEnd,
            text: buffer,
            sourceChars
        });
        buffer = "";
        pageStart = 0;
        pageEnd = 0;
        sourceChars = 0;
    };
    for (const page of pages) {
        const headerReserve = 96;
        const fragmentLimit = Math.max(1, maxChunkChars - headerReserve);
        const parts = page.text
            ? splitLosslessly(page.text, fragmentLimit)
            : [""];
        for (let index = 0; index < parts.length; index += 1) {
            const part = parts[index] ?? "";
            const header = `[STRONA ${page.page}${parts.length > 1
                ? ` · CZĘŚĆ ${index + 1}/${parts.length}`
                : ""} · ${page.source}]\n`;
            const entry = header + part;
            const separator = buffer ? "\n\n" : "";
            if (buffer &&
                buffer.length + separator.length + entry.length >
                    maxChunkChars) {
                flush();
            }
            if (!buffer) {
                pageStart = page.page;
            }
            pageEnd = page.page;
            buffer += (buffer ? "\n\n" : "") + entry;
            sourceChars += part.length;
        }
    }
    flush();
    return chunks;
}
export class CompleteDocumentIngestor {
    pageSource;
    ocr;
    limits;
    constructor(pageSource, ocr, limits = DEFAULT_DOCUMENT_INGESTION_LIMITS) {
        this.pageSource = pageSource;
        this.ocr = ocr;
        this.limits = limits;
    }
    async ingest(data, onProgress) {
        if (data.byteLength > this.limits.maxBytes) {
            throw new DocumentIngestionError("Document exceeds the configured byte safety limit.", "DOCUMENT_TOO_LARGE");
        }
        const extracted = await this.pageSource.extract(data);
        if (extracted.pages.length > this.limits.maxPages) {
            throw new DocumentIngestionError("Document exceeds the configured page safety limit.", "DOCUMENT_TOO_MANY_PAGES");
        }
        assertPageSequence(extracted.pages);
        const ocrCandidates = extracted.pages
            .filter((page) => page.text.trim().length <
            this.limits.minDigitalCharsPerPage &&
            page.hasImages !== false)
            .map((page) => page.page);
        if (ocrCandidates.length > 0 && !this.ocr) {
            throw new DocumentIngestionError(`OCR is required for ${ocrCandidates.length} page(s), but no local OCR engine is configured.`, "OCR_REQUIRED");
        }
        if (ocrCandidates.length) {
            onProgress?.({ stage: "OCR", done: 0, total: ocrCandidates.length });
        }
        const ocrResults = this.ocr && ocrCandidates.length
            ? await this.ocr.recognizePages(data, ocrCandidates, onProgress
                ? (done) => onProgress({ stage: "OCR", done, total: ocrCandidates.length })
                : undefined)
            : [];
        const ocrByPage = new Map(ocrResults.map((result) => [result.page, result]));
        for (const page of ocrCandidates) {
            if (!ocrByPage.has(page)) {
                throw new DocumentIngestionError(`OCR did not return an accounted result for page ${page}.`, "OCR_INCOMPLETE");
            }
        }
        const pages = extracted.pages.map((page) => {
            const digital = page.text.trim();
            const ocr = ocrByPage.get(page.page);
            const ocrText = ocr?.text.trim() ?? "";
            if (ocr && ocrText.length > digital.length) {
                return {
                    page: page.page,
                    text: ocrText,
                    source: "OCR",
                    ...(ocr.confidence !== undefined
                        ? { confidence: ocr.confidence }
                        : {}),
                    ...(ocr.lineCount !== undefined
                        ? { lineCount: ocr.lineCount }
                        : {}),
                    ...(ocr.engine ? { engine: ocr.engine } : {})
                };
            }
            if (digital) {
                return {
                    page: page.page,
                    text: digital,
                    source: "DIGITAL"
                };
            }
            return {
                page: page.page,
                text: ocrText,
                source: ocrText ? "OCR" : "BLANK",
                ...(ocr?.confidence !== undefined
                    ? { confidence: ocr.confidence }
                    : {}),
                ...(ocr?.lineCount !== undefined
                    ? { lineCount: ocr.lineCount }
                    : {}),
                ...(ocr?.engine ? { engine: ocr.engine } : {})
            };
        });
        const sourceChars = pages.reduce((sum, page) => sum + page.text.length, 0);
        if (sourceChars > this.limits.maxTotalChars) {
            throw new DocumentIngestionError("Document text exceeds the configured character safety limit.", "DOCUMENT_TEXT_TOO_LARGE");
        }
        const chunks = chunkDocumentPages(pages, this.limits.maxChunkChars);
        const chunkSourceChars = chunks.reduce((sum, chunk) => sum + chunk.sourceChars, 0);
        if (chunkSourceChars !== sourceChars) {
            throw new DocumentIngestionError("Chunking did not preserve the complete source character count.", "CHUNKING_INCOMPLETE");
        }
        const accountedPages = new Set();
        for (const chunk of chunks) {
            for (let page = chunk.pageStart; page <= chunk.pageEnd; page += 1) {
                accountedPages.add(page);
            }
        }
        if (accountedPages.size !== pages.length) {
            throw new DocumentIngestionError("Chunking did not account for every document page.", "CHUNKING_INCOMPLETE");
        }
        return {
            complete: true,
            sha256: createHash("sha256").update(data).digest("hex"),
            bytes: extracted.bytes,
            totalPages: pages.length,
            digitalPages: pages.filter((p) => p.source === "DIGITAL").length,
            ocrPages: pages.filter((p) => p.source === "OCR").length,
            blankPages: pages.filter((p) => p.source === "BLANK").length,
            sourceChars,
            pages,
            chunks
        };
    }
}

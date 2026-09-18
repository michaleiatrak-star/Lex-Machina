import {
  CompleteDocumentIngestor,
  type DocumentPageSource,
  type OcrEngine
} from "./document-ingestion.js";

const source: DocumentPageSource = {
  async extract(data) {
    return {
      bytes: data.byteLength,
      pages: Array.from({ length: 80 }, (_, index) => {
        const page = index + 1;
        if (page % 11 === 0) {
          return { page, text: "" };
        }
        return {
          page,
          text:
            `Strona ${page}. ` +
            "Treść dokumentu prawnego z polskimi znakami: ą ć ę ł ń ó ś ź ż. ".repeat(
              page % 7 === 0 ? 90 : 4
            )
        };
      })
    };
  }
};

const ocr: OcrEngine = {
  async recognizePages(_data, pages) {
    return pages.map((page) => ({
      page,
      text:
        `OCR strony ${page}: zeskanowana treść została odczytana lokalnie w języku polskim.`,
      confidence: 0.96,
      lineCount: 1,
      engine: "PP-OCRv6-test-double"
    }));
  }
};

const ingestor = new CompleteDocumentIngestor(
  source,
  ocr,
  {
    maxBytes: 1024 * 1024,
    maxPages: 1000,
    maxTotalChars: 10_000_000,
    minDigitalCharsPerPage: 40,
    maxChunkChars: 2000
  }
);

const result = await ingestor.ingest(
  new TextEncoder().encode("G27 deterministic document fixture")
);

if (!result.complete || result.totalPages !== 80) {
  throw new Error("G27 did not account for all document pages.");
}
if (result.ocrPages !== 7) {
  throw new Error(
    `G27 expected 7 OCR pages, got ${result.ocrPages}.`
  );
}
if (
  result.chunks.reduce(
    (sum, chunk) => sum + chunk.sourceChars,
    0
  ) !== result.sourceChars
) {
  throw new Error("G27 chunking lost or duplicated source characters.");
}
if (result.chunks.length <= 1) {
  throw new Error("G27 large-document fixture was not divided into chunks.");
}

const chunkText = result.chunks
  .map((chunk) => chunk.text)
  .join("\n");
for (let page = 1; page <= result.totalPages; page += 1) {
  if (!chunkText.includes(`[STRONA ${page}`)) {
    throw new Error(`G27 page ${page} is missing from chunk map.`);
  }
}

process.stdout.write(JSON.stringify({
  gate: "G27_COMPLETE_DOCUMENT_OCR_AND_CHUNKING",
  result: "PASS",
  totalPages: result.totalPages,
  digitalPages: result.digitalPages,
  ocrPages: result.ocrPages,
  blankPages: result.blankPages,
  chunks: result.chunks.length,
  sourceChars: result.sourceChars,
  allPagesAccounted: true,
  sourceCharsPreserved: true
}, null, 2) + "\n");

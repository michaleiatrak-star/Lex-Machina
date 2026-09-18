import { describe, expect, it } from "vitest";
import {
  CompleteImageIngestor,
  type ImageOcrEngine
} from "../src/image-ingestion.js";

describe("complete image ingestion", () => {
  it("OCRs a Polish image as one fully accounted page", async () => {
    const engine: ImageOcrEngine = {
      async recognizeImage(_data, mediaType) {
        expect(mediaType).toBe("image/jpeg");
        return {
          page: 1,
          text:
            "Zdjęcie dokumentu: Zażółć gęślą jaźń. PESEL 44051401458.",
          confidence: 0.98,
          lineCount: 2,
          engine: "PP-OCRv6-test-double"
        };
      }
    };

    const ingestor =
      new CompleteImageIngestor(
        engine,
        {
          maxBytes: 1_000_000,
          maxTextChars: 100_000,
          maxChunkChars: 700
        }
      );

    const result = await ingestor.ingest(
      new Uint8Array([1, 2, 3]),
      "image/jpeg"
    );

    expect(result.complete).toBe(true);
    expect(result.totalPages).toBe(1);
    expect(result.ocrPages).toBe(1);
    expect(result.digitalPages).toBe(0);
    expect(result.pages[0]?.source).toBe("OCR");
    expect(result.chunks[0]?.text)
      .toContain("[STRONA 1 · OCR]");
    expect(result.chunks[0]?.text)
      .toContain("Zażółć gęślą jaźń");
  });
});

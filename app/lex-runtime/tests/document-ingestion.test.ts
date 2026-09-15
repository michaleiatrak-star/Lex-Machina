import { describe, expect, it } from "vitest";
import {
  CompleteDocumentIngestor,
  DocumentIngestionError,
  type DocumentPageSource,
  type OcrEngine
} from "../src/document-ingestion.js";

class FakePageSource implements DocumentPageSource {
  async extract(data: Uint8Array) {
    return {
      bytes: data.byteLength,
      pages: [
        { page: 1, text: "Pełny tekst strony pierwszej ma wystarczającą długość do warstwy cyfrowej." },
        { page: 2, text: "" },
        { page: 3, text: "Krótki" },
        { page: 4, text: "A".repeat(1300) },
        { page: 5, text: "" }
      ]
    };
  }
}

class FakeOcr implements OcrEngine {
  calls: number[][] = [];

  async recognizePages(
    _data: Uint8Array,
    pages: number[]
  ) {
    this.calls.push([...pages]);
    return pages.map((page) => {
      if (page === 2) {
        return {
          page,
          text: "OCR strony drugiej: Zażółć gęślą jaźń. PESEL 44051401458.",
          confidence: 0.97,
          lineCount: 2,
          engine: "fake-ppocrv6"
        };
      }
      if (page === 3) {
        return {
          page,
          text: "OCR rozszerza krótki tekst strony trzeciej i zachowuje polskie znaki ąęłńóśźż.",
          confidence: 0.95,
          lineCount: 1,
          engine: "fake-ppocrv6"
        };
      }
      return {
        page,
        text: "",
        confidence: 1,
        lineCount: 0,
        engine: "fake-ppocrv6"
      };
    });
  }
}

describe("complete document ingestion", () => {
  it("accounts for every page and chunks without source character loss", async () => {
    const ocr = new FakeOcr();
    const ingestor = new CompleteDocumentIngestor(
      new FakePageSource(),
      ocr,
      {
        maxBytes: 10_000,
        maxPages: 100,
        maxTotalChars: 20_000,
        minDigitalCharsPerPage: 40,
        maxChunkChars: 700
      }
    );

    const result = await ingestor.ingest(
      new TextEncoder().encode("fixture")
    );

    expect(result.complete).toBe(true);
    expect(result.totalPages).toBe(5);
    expect(result.pages.map((page) => page.page))
      .toEqual([1, 2, 3, 4, 5]);
    expect(ocr.calls).toEqual([[2, 3, 5]]);
    expect(result.digitalPages).toBe(2);
    expect(result.ocrPages).toBe(2);
    expect(result.blankPages).toBe(1);
    expect(result.chunks.length).toBeGreaterThan(3);
    expect(
      result.chunks.reduce(
        (sum, chunk) => sum + chunk.sourceChars,
        0
      )
    ).toBe(result.sourceChars);

    const joined = result.chunks
      .map((chunk) => chunk.text)
      .join("\n");
    for (let page = 1; page <= 5; page += 1) {
      expect(joined).toContain(`[STRONA ${page}`);
    }
    expect(joined).toContain("Zażółć gęślą jaźń");
    expect(joined).toContain("[STRONA 4 · CZĘŚĆ 1/3 · DIGITAL]");
  });

  it("fails closed when OCR omits a required page", async () => {
    const incomplete: OcrEngine = {
      async recognizePages(_data, pages) {
        return pages
          .filter((page) => page !== 5)
          .map((page) => ({ page, text: "ocr" }));
      }
    };

    const ingestor = new CompleteDocumentIngestor(
      new FakePageSource(),
      incomplete,
      {
        maxBytes: 10_000,
        maxPages: 100,
        maxTotalChars: 20_000,
        minDigitalCharsPerPage: 40,
        maxChunkChars: 700
      }
    );

    await expect(
      ingestor.ingest(new Uint8Array([1, 2, 3]))
    ).rejects.toMatchObject({
      code: "OCR_INCOMPLETE"
    } satisfies Partial<DocumentIngestionError>);
  });
});

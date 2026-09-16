import {
  describe,
  expect,
  it
} from "vitest";
import {
  CompleteDocumentIngestor
} from "../src/document-ingestion.js";
import {
  LocalPrivateDocumentService
} from "../src/document-service.js";
import {
  DOCX_MEDIA_TYPE,
  ODT_MEDIA_TYPE
} from "../src/office-document-extractor.js";
import {
  CSV_MEDIA_TYPE,
  XLSX_MEDIA_TYPE
} from "../src/spreadsheet-extractor.js";

function service() {
  const pdf =
    new CompleteDocumentIngestor({
      extract: async (
        data
      ) => ({
        bytes:
          data.byteLength,
        pages: [{
          page: 1,
          text:
            "PDF fixture with enough local digital text to avoid OCR."
        }]
      })
    });
  return new LocalPrivateDocumentService(
    pdf,
    {
      recognize:
        async () => []
    },
    24_000,
    undefined,
    undefined,
    undefined,
    {
      extract:
        async (
          _data,
          mediaType
        ) =>
          mediaType ===
            DOCX_MEDIA_TYPE
            ? "Know-how kancelarii o karze umownej i miarkowaniu."
            : "Procedura ODT dotycząca cesji wierzytelności."
    },
    {
      extract:
        async (
          _data,
          mediaType
        ) =>
          mediaType ===
            XLSX_MEDIA_TYPE
            ? "[ARKUSZ: Dane]\nA1=Klient | B1=Kwota\nA2=Kowalski | B2=100"
            : "ROW 1 | C1=klient | C2=kwota"
    }
  );
}

describe("office and text privacy ingestion", () => {
  it("reviews and finalizes DOCX through the same protected chunk pipeline", async () => {
    const current =
      service();
    const review =
      await current.review(
        Buffer.from(
          "docx-fixture"
        ),
        DOCX_MEDIA_TYPE
      );

    expect(
      review.mediaType
    ).toBe(
      DOCX_MEDIA_TYPE
    );
    expect(
      review.pages
    ).toHaveLength(1);
    expect(
      review.pages[0]?.text
    ).toContain(
      "kara umowna"
    );

    const finalized =
      await current
        .finalizeReview(
          review.documentId,
          []
        );
    expect(
      finalized.chunks[0]
        ?.text
    ).toContain(
      "Know-how kancelarii"
    );
  });

  it("reviews and finalizes spreadsheet text through the protected chunk pipeline", async () => {
    const current =
      service();

    const xlsx =
      await current.review(
        Buffer.from(
          "xlsx-fixture"
        ),
        XLSX_MEDIA_TYPE
      );
    expect(
      xlsx.pages[0]?.source
    ).toBe("DIGITAL");
    expect(
      xlsx.pages[0]?.text
    ).toContain(
      "[ARKUSZ: Dane]"
    );

    const finalized =
      await current
        .finalizeReview(
          xlsx.documentId,
          []
        );
    expect(
      finalized.ocrPages
    ).toBe(0);
    expect(
      finalized.chunks[0]
        ?.text
    ).toContain(
      "A2=Kowalski"
    );

    const csv =
      await current.review(
        Buffer.from(
          "klient,kwota",
          "utf8"
        ),
        CSV_MEDIA_TYPE
      );
    expect(
      csv.pages[0]?.text
    ).toContain(
      "ROW 1"
    );
  });

  it("supports ODT, plain text and Markdown as digital sources", async () => {
    const current =
      service();

    const odt =
      await current.review(
        Buffer.from(
          "odt-fixture"
        ),
        ODT_MEDIA_TYPE
      );
    expect(
      odt.pages[0]?.text
    ).toContain(
      "cesji wierzytelności"
    );

    const text =
      await current.review(
        Buffer.from(
          "Wewnętrzna procedura kancelarii.",
          "utf8"
        ),
        "text/plain"
      );
    expect(
      text.pages[0]?.source
    ).toBe("DIGITAL");

    const markdown =
      await current.review(
        Buffer.from(
          "# Know-how\nStrategia procesowa.",
          "utf8"
        ),
        "text/markdown"
      );
    expect(
      markdown.pages[0]?.text
    ).toContain(
      "Strategia procesowa"
    );
  });
});

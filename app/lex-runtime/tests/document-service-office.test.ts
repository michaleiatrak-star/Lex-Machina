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

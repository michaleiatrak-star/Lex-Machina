import type {
  DocumentPageSource,
  DocumentSourceExtraction
} from "./document-ingestion.js";

export type PdfPageSourceLimits = {
  maxPages: number;
  maxTextChars: number;
};

const DEFAULT_LIMITS: PdfPageSourceLimits = {
  maxPages: 10_000,
  maxTextChars: 100_000_000
};

export class PdfJsDocumentPageSource
implements DocumentPageSource {
  constructor(
    private readonly limits: PdfPageSourceLimits =
      DEFAULT_LIMITS
  ) {}

  async extract(
    data: Uint8Array
  ): Promise<DocumentSourceExtraction> {
    const pdfjs = await import(
      "pdfjs-dist/legacy/build/pdf.mjs"
    );
    const task = pdfjs.getDocument({
      data,
      useSystemFonts: false,
      disableFontFace: true,
      verbosity: 0
    });

    try {
      const document = await task.promise;
      if (document.numPages > this.limits.maxPages) {
        throw new Error("PDF_PAGE_LIMIT");
      }

      const pages: Array<{ page: number; text: string }> = [];
      let totalChars = 0;

      for (
        let pageNumber = 1;
        pageNumber <= document.numPages;
        pageNumber += 1
      ) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) =>
            "str" in item && typeof item.str === "string"
              ? item.str
              : ""
          )
          .filter(Boolean)
          .join(" ")
          .trim();

        totalChars += text.length;
        if (totalChars > this.limits.maxTextChars) {
          throw new Error("PDF_TEXT_LIMIT");
        }

        pages.push({
          page: pageNumber,
          text
        });
        page.cleanup();
      }

      return {
        bytes: data.byteLength,
        pages
      };
    } finally {
      await task.destroy().catch(() => undefined);
    }
  }
}

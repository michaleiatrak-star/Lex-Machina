export type PdfTextExtractionResult = {
  text: string;
  pages: number;
  bytes: number;
};

export type PdfTextLimits = {
  maxBytes: number;
  maxPages: number;
  maxTextChars: number;
};

export interface PdfTextExtractor {
  extract(
    data: Uint8Array
  ): Promise<PdfTextExtractionResult>;
}

export const DEFAULT_PDF_MAX_BYTES =
  25 * 1024 * 1024;

const DEFAULT_LIMITS: PdfTextLimits = {
  maxBytes: DEFAULT_PDF_MAX_BYTES,
  maxPages: 2500,
  maxTextChars: 15_000_000
};

export class PdfTextExtractionError extends Error {
  constructor(
    message: string,
    readonly code:
      | "PDF_TOO_LARGE"
      | "PDF_TOO_MANY_PAGES"
      | "PDF_TEXT_TOO_LARGE"
      | "PDF_NO_TEXT"
      | "PDF_PARSE_FAILED"
  ) {
    super(message);
    this.name = "PdfTextExtractionError";
  }
}

export class LocalPdfTextExtractor
implements PdfTextExtractor {
  constructor(
    private readonly limits: PdfTextLimits =
      DEFAULT_LIMITS
  ) {}

  async extract(
    data: Uint8Array
  ): Promise<PdfTextExtractionResult> {
    if (data.byteLength > this.limits.maxBytes) {
      throw new PdfTextExtractionError(
        "PDF exceeds the configured byte limit.",
        "PDF_TOO_LARGE"
      );
    }

    let loadingTask:
      | Awaited<
          ReturnType<
            typeof import(
              "pdfjs-dist/legacy/build/pdf.mjs"
            )["getDocument"]
          >
        >
      | undefined;

    let document:
      | Awaited<
          Awaited<
            ReturnType<
              typeof import(
                "pdfjs-dist/legacy/build/pdf.mjs"
              )["getDocument"]
            >
          >["promise"]
        >
      | undefined;

    try {
      const pdfjs = await import(
        "pdfjs-dist/legacy/build/pdf.mjs"
      );

      loadingTask = pdfjs.getDocument({
        data,
        useSystemFonts: true
      });

      document = await loadingTask.promise;

      if (
        document.numPages >
        this.limits.maxPages
      ) {
        throw new PdfTextExtractionError(
          "PDF exceeds the configured page limit.",
          "PDF_TOO_MANY_PAGES"
        );
      }

      const chunks: string[] = [];
      let textChars = 0;

      for (
        let pageNumber = 1;
        pageNumber <= document.numPages;
        pageNumber += 1
      ) {
        const page =
          await document.getPage(pageNumber);
        const content =
          await page.getTextContent();

        const pageText = content.items
          .map((item) =>
            "str" in item
              ? item.str
              : ""
          )
          .filter(Boolean)
          .join(" ");

        textChars += pageText.length + 1;
        if (
          textChars >
          this.limits.maxTextChars
        ) {
          throw new PdfTextExtractionError(
            "Extracted PDF text exceeds the configured limit.",
            "PDF_TEXT_TOO_LARGE"
          );
        }

        chunks.push(pageText);
        page.cleanup();
      }

      const text = chunks.join("\n").trim();
      if (!text) {
        throw new PdfTextExtractionError(
          "PDF contains no extractable text.",
          "PDF_NO_TEXT"
        );
      }

      return {
        text,
        pages: document.numPages,
        bytes: data.byteLength
      };
    } catch (error) {
      if (
        error instanceof
        PdfTextExtractionError
      ) {
        throw error;
      }

      throw new PdfTextExtractionError(
        "PDF could not be parsed safely.",
        "PDF_PARSE_FAILED"
      );
    } finally {
      if (loadingTask) {
        await loadingTask.destroy();
      }
    }
  }
}
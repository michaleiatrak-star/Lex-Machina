import { describe, expect, it } from "vitest";
import {
  LocalPdfTextExtractor,
  PdfTextExtractionError
} from "../src/pdf-text-extractor.js";

function makePdf(text: string): Uint8Array {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] " +
      "/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  const escaped = text
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
  const stream =
    "BT /F1 12 Tf 72 720 Td (" +
    escaped +
    ") Tj ET";
  objects[3] =
    "<< /Length " +
    Buffer.byteLength(stream, "latin1") +
    " >>\nstream\n" +
    stream +
    "\nendstream";

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((body, index) => {
    offsets[index + 1] =
      Buffer.byteLength(pdf, "latin1");
    pdf +=
      String(index + 1) +
      " 0 obj\n" +
      body +
      "\nendobj\n";
  });

  const xref =
    Buffer.byteLength(pdf, "latin1");
  pdf +=
    "xref\n0 6\n" +
    "0000000000 65535 f \n";

  for (let id = 1; id <= 5; id += 1) {
    pdf +=
      String(offsets[id])
        .padStart(10, "0") +
      " 00000 n \n";
  }

  pdf +=
    "trailer\n<< /Size 6 /Root 1 0 R >>\n" +
    "startxref\n" +
    xref +
    "\n%%EOF\n";

  return new Uint8Array(
    Buffer.from(pdf, "latin1")
  );
}

describe("LocalPdfTextExtractor", () => {
  it("extracts text from a valid one-page PDF", async () => {
    const pdf = makePdf(
      "Kodeks cywilny Art. 5. Test."
    );

    const result =
      await new LocalPdfTextExtractor()
        .extract(pdf);

    expect(result.pages).toBe(1);
    expect(result.bytes).toBe(pdf.byteLength);
    expect(result.text).toContain(
      "Kodeks cywilny"
    );
    expect(result.text).toContain("Art. 5");
  });

  it("blocks PDFs above the configured byte limit", async () => {
    const extractor =
      new LocalPdfTextExtractor({
        maxBytes: 3,
        maxPages: 10,
        maxTextChars: 1000
      });

    await expect(
      extractor.extract(
        new Uint8Array([1, 2, 3, 4])
      )
    ).rejects.toMatchObject({
      code: "PDF_TOO_LARGE"
    } satisfies Partial<PdfTextExtractionError>);
  });

  it("blocks extracted text above the configured character limit", async () => {
    const extractor =
      new LocalPdfTextExtractor({
        maxBytes: 100_000,
        maxPages: 10,
        maxTextChars: 5
      });

    await expect(
      extractor.extract(
        makePdf("Long legal text")
      )
    ).rejects.toMatchObject({
      code: "PDF_TEXT_TOO_LARGE"
    } satisfies Partial<PdfTextExtractionError>);
  });

  it("fails closed for malformed PDF bytes", async () => {
    await expect(
      new LocalPdfTextExtractor().extract(
        new Uint8Array([1, 2, 3, 4])
      )
    ).rejects.toMatchObject({
      code: "PDF_PARSE_FAILED"
    } satisfies Partial<PdfTextExtractionError>);
  });
});

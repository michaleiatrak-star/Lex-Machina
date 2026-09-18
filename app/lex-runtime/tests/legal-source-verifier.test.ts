import { describe, expect, it, vi } from "vitest";
import {
  PdfTextExtractionError,
  type PdfTextExtractor
} from "../src/pdf-text-extractor.js";
import {
  LegalSourceVerificationError,
  OfficialLegalSourceVerifier
} from "../src/legal-source-verifier.js";

describe("OfficialLegalSourceVerifier", () => {
  it("verifies an article only when official content matches both act title and article", async () => {
    const fetcher = vi.fn(async (_input, init) => {
      expect(init?.redirect).toBe("error");
      return new Response(
        "<html><head><title>Kodeks cywilny</title></head>" +
        "<body><h2>Art. 5.</h2><p>Treść przepisu.</p></body></html>",
        {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" }
        }
      );
    });

    const verifier = new OfficialLegalSourceVerifier(
      fetcher,
      () => "2026-09-15T18:00:00.000Z"
    );

    const result = await verifier.verify({
      claim: "art. 5 KC",
      kind: "statute",
      url: "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.html",
      expectedTitle: "Kodeks cywilny",
      toolCallId: "tool-1"
    });

    expect(result.matched).toBe(true);
    expect(result.record).toMatchObject({
      claim: "art. 5 KC",
      status: "VERIFIED",
      sourceTier: "R1",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.html",
      toolCallId: "tool-1",
      verificationMethod: "web_fetch"
    });
  });

  it("rejects a wrong act even when the same article number exists", async () => {
    const verifier = new OfficialLegalSourceVerifier(
      async () =>
        new Response(
          "<html><head><title>Inna ustawa</title></head>" +
          "<body><h2>Art. 5.</h2></body></html>",
          {
            status: 200,
            headers: { "content-type": "text/html" }
          }
        ),
      () => "2026-09-15T18:00:00.000Z"
    );

    const result = await verifier.verify({
      claim: "art. 5 KC",
      kind: "statute",
      url: "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.html",
      expectedTitle: "Kodeks cywilny",
      toolCallId: "tool-title"
    });

    expect(result.matched).toBe(false);
    expect(result.record).toMatchObject({
      status: "UNVERIFIED",
      evidence:
        "Official source was fetched, but the expected act title was not found."
    });
  });

  it("records UNVERIFIED when the official response lacks the requested article", async () => {
    const verifier = new OfficialLegalSourceVerifier(
      async () =>
        new Response(
          "<html><title>Kodeks cywilny</title><body>Art. 6. Inna treść.</body></html>",
          {
            status: 200,
            headers: { "content-type": "text/html" }
          }
        ),
      () => "2026-09-15T18:00:00.000Z"
    );

    const result = await verifier.verify({
      claim: "art. 5 KC",
      kind: "statute",
      url: "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.html",
      expectedTitle: "Kodeks cywilny",
      toolCallId: "tool-2"
    });

    expect(result.matched).toBe(false);
    expect(result.record.status).toBe("UNVERIFIED");
  });

  it("rejects non-official and non-HTTPS sources", async () => {
    const verifier = new OfficialLegalSourceVerifier(
      async () => new Response("Art. 5.", { status: 200 })
    );

    await expect(
      verifier.verify({
        claim: "art. 5 KC",
        kind: "statute",
        url: "https://example.com/kodeks",
        expectedTitle: "Kodeks cywilny",
        toolCallId: "tool-3"
      })
    ).rejects.toMatchObject({
      code: "SOURCE_NOT_OFFICIAL"
    } satisfies Partial<LegalSourceVerificationError>);

    await expect(
      verifier.verify({
        claim: "art. 5 KC",
        kind: "statute",
        url: "http://eli.gov.pl/eli/DU/1964/93",
        expectedTitle: "Kodeks cywilny",
        toolCallId: "tool-4"
      })
    ).rejects.toMatchObject({
      code: "INVALID_SOURCE_URL"
    } satisfies Partial<LegalSourceVerificationError>);
  });

  it("verifies an official PDF only after local text extraction", async () => {
    const extractor: PdfTextExtractor = {
      async extract(data) {
        expect(data.byteLength).toBeGreaterThan(0);
        return {
          text:
            "Kodeks cywilny\nArt. 5. Treść przepisu.",
          pages: 2,
          bytes: data.byteLength
        };
      }
    };

    const verifier = new OfficialLegalSourceVerifier(
      async () =>
        new Response(
          new Uint8Array([37, 80, 68, 70]),
          {
            status: 200,
            headers: {
              "content-type": "application/pdf"
            }
          }
        ),
      () => "2026-09-15T18:00:00.000Z",
      extractor
    );

    const result = await verifier.verify({
      claim: "art. 5 KC",
      kind: "statute",
      url:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf",
      expectedTitle: "Kodeks cywilny",
      toolCallId: "tool-pdf-1"
    });

    expect(result.matched).toBe(true);
    expect(result.record).toMatchObject({
      status: "VERIFIED",
      verificationMethod: "web_fetch_pdf",
      sourceFormat: "PDF",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf"
    });
  });

  it("fails closed when official PDF text extraction fails", async () => {
    const extractor: PdfTextExtractor = {
      async extract() {
        throw new PdfTextExtractionError(
          "No text.",
          "PDF_NO_TEXT"
        );
      }
    };

    const verifier = new OfficialLegalSourceVerifier(
      async () =>
        new Response(
          new Uint8Array([37, 80, 68, 70]),
          {
            status: 200,
            headers: {
              "content-type": "application/pdf"
            }
          }
        ),
      () => "2026-09-15T18:00:00.000Z",
      extractor
    );

    await expect(
      verifier.verify({
        claim: "art. 5 KC",
        kind: "statute",
        url:
          "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf",
        expectedTitle: "Kodeks cywilny",
        toolCallId: "tool-pdf-2"
      })
    ).rejects.toMatchObject({
      code: "PDF_EXTRACTION_FAILED"
    } satisfies Partial<LegalSourceVerificationError>);
  });

  it("still rejects unsupported non-text non-PDF content", async () => {
    const verifier = new OfficialLegalSourceVerifier(
      async () =>
        new Response("binary", {
          status: 200,
          headers: {
            "content-type":
              "application/octet-stream"
          }
        })
    );

    await expect(
      verifier.verify({
        claim: "art. 5 KC",
        kind: "statute",
        url:
          "https://api.sejm.gov.pl/eli/acts/DU/1964/93/content.bin",
        expectedTitle: "Kodeks cywilny",
        toolCallId: "tool-binary"
      })
    ).rejects.toMatchObject({
      code: "UNSUPPORTED_SOURCE_CONTENT"
    } satisfies Partial<LegalSourceVerificationError>);
  });
});
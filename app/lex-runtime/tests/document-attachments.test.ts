import { describe, expect, it } from "vitest";
import {
  CompleteDocumentIngestor,
  type DocumentPageSource
} from "../src/document-ingestion.js";
import {
  LocalPrivateDocumentService
} from "../src/document-service.js";

const source: DocumentPageSource = {
  async extract(data) {
    return {
      bytes: data.byteLength,
      pages: [{
        page: 1,
        text:
          "Osoba Testowa jest stroną dokumentu; dalsza treść zapewnia wystarczająco długą warstwę tekstową."
      }]
    };
  }
};

const namedEntities = {
  async recognize(text: string) {
    const value = "Osoba Testowa";
    const start = text.indexOf(value);
    return [{
      start,
      end: start + value.length,
      kind: "PERSON" as const,
      value,
      confidence: 0.99
    }];
  }
};

describe("G32 protected document chunk resolution", () => {
  it("exposes only finalized pseudonymized chunks to a session attachment", async () => {
    const service =
      new LocalPrivateDocumentService(
        new CompleteDocumentIngestor(source),
        namedEntities,
        700
      );

    const review = await service.review(
      new TextEncoder().encode("fixture"),
      "application/pdf"
    );

    await expect(
      service.resolveProtectedChunks({
        documentId: review.documentId,
        chunkIndices: [1]
      })
    ).rejects.toThrow("DOCUMENT_NOT_FINALIZED");

    const finalized =
      await service.finalizeReview(
        review.documentId,
        []
      );

    const attachment =
      await service.resolveProtectedChunks({
        documentId: review.documentId,
        chunkIndices: [1]
      });

    expect(finalized.chunks).toHaveLength(1);
    expect(attachment.chunks).toHaveLength(1);
    expect(attachment.chunks[0]?.text)
      .toContain("[PII:PERSON:0001]");
    expect(JSON.stringify(attachment))
      .not.toContain("Osoba Testowa");
  });

  it("fails closed for unknown chunks", async () => {
    const service =
      new LocalPrivateDocumentService(
        new CompleteDocumentIngestor(source),
        namedEntities,
        700
      );
    const result = await service.ingestPdf(
      new TextEncoder().encode("fixture")
    );

    await expect(
      service.resolveProtectedChunks({
        documentId: result.documentId,
        chunkIndices: [999]
      })
    ).rejects.toThrow("UNKNOWN_DOCUMENT_CHUNK");
  });
});

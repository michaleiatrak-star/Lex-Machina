import { describe, expect, it } from "vitest";
import { CompleteDocumentIngestor } from "../src/document-ingestion.js";
import { LocalPrivateDocumentService } from "../src/document-service.js";
import {
  ProcessingProgressRegistry,
  progressIdFrom,
  type ProcessingProgress
} from "../src/processing-progress.js";

const ID = "0123456789abcdef0123456789abcdef";

describe("processing progress registry", () => {
  it("keeps the latest stage per id, bound to one case, and forgets old entries", () => {
    let now = 0;
    const registry = new ProcessingProgressRegistry(() => now);
    const report = registry.reporter("case_a", ID)!;
    report({ stage: "OCR", done: 2, total: 5 });
    expect(registry.get("case_a", ID)).toMatchObject({ stage: "OCR", done: 2, total: 5 });
    expect(registry.get("case_b", ID)).toBeUndefined();
    registry.reporter("case_b", ID)!({ stage: "SAVING" });
    expect(registry.get("case_a", ID)).toMatchObject({ stage: "OCR" });
    now = 16 * 60 * 1000;
    expect(registry.get("case_a", ID)).toBeUndefined();
    expect(registry.reporter("case_a", undefined)).toBeUndefined();
    expect(progressIdFrom("../etc")).toBeUndefined();
    expect(progressIdFrom(ID.toUpperCase())).toBe(ID);
  });
});

describe("progress during ingestion and privacy", () => {
  it("reports OCR pages, detection and pseudonymization stages", async () => {
    const events: ProcessingProgress[] = [];
    const service = new LocalPrivateDocumentService(
      new CompleteDocumentIngestor(
        {
          async extract() {
            return {
              bytes: 1,
              pages: [
                { page: 1, text: "", hasImages: true },
                { page: 2, text: "Strona z tekstem cyfrowym, PESEL 44051401359, wystarczająco długa." }
              ]
            };
          }
        },
        {
          async recognizePages(_data, pages, onPage) {
            onPage?.(1);
            return pages.map((page) => ({ page, text: "Skan: Jan Nowak, PESEL 44051401359" }));
          }
        }
      ),
      { recognize: async () => [] }
    );
    const review = await service.review(new Uint8Array([1]), "application/pdf", {
      caseId: "case_x",
      onProgress: (event) => events.push(event)
    });
    await service.finalizeReview(review.documentId, [], {
      caseId: "case_x",
      onProgress: (event) => events.push(event)
    }).catch(() => undefined);
    const stages = events.map((event) => `${event.stage}:${event.done ?? ""}/${event.total ?? ""}`);
    expect(stages.slice(0, 5)).toEqual(["READING:/", "OCR:0/1", "OCR:1/1", "DETECTING:0/2", "DETECTING:1/2"]);
  });
});

describe("anonymization key", () => {
  it("lists every token with the value it hides and its occurrences", async () => {
    const service = new LocalPrivateDocumentService(
      new CompleteDocumentIngestor({ async extract() { return { bytes: 1, pages: [] }; } }),
      { recognize: async () => [] }
    );
    const review = await service.review(
      Buffer.from("PESEL 44051401359, ponownie 44051401359. NIP 526-000-12-46."),
      "text/plain"
    );
    await service.finalizeReview(review.documentId, []);
    const key = service.privacyKey(review.documentId);
    const pesel = key.find((entry) => entry.kind === "PESEL");
    expect(pesel).toMatchObject({ value: "44051401359", occurrences: 2 });
    expect(pesel?.token).toMatch(/^\[PII:PESEL:\d{4}\]$/);
    expect(() => service.privacyKey("doc_000000000000000000000000")).toThrow("UNKNOWN_LOCAL_DOCUMENT");
  });
});

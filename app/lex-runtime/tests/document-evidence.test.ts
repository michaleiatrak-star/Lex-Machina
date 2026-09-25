import { describe, expect, it } from "vitest";
import { CompleteDocumentIngestor, type IngestedPage } from "../src/document-ingestion.js";
import { maskBoxes, protectedValues, wantsImage, type Box } from "../src/document-evidence.js";
import { LocalPrivateDocumentService } from "../src/document-service.js";
import { CompleteImageIngestor } from "../src/image-ingestion.js";
import { selectEvidenceImages } from "../src/session-executor.js";
import type { PiiSpan } from "../src/privacy/pseudonymizer.js";

const image = { jpeg: "AAAA", width: 1000, height: 800, unread: [[10, 700, 200, 740]] as Box[] };

function page(text: string, lines: Array<{ text: string; score?: number; box: Box }>): IngestedPage {
  return { page: 1, text, source: "OCR", lines, image };
}

describe("page images as evidence", () => {
  it("masks protected values on their lines, unread regions and badly read lines", () => {
    const scan = page("Umowa najmu\nNajemca Jan Kowalski\nPodpis ~~", [
      { text: "Umowa najmu", score: 0.99, box: [100, 50, 320, 80] },
      { text: "Najemca Jan Kowalski", score: 0.97, box: [100, 100, 500, 130] },
      { text: "Podpis ~~", score: 0.3, box: [100, 600, 300, 640] }
    ]);
    const boxes = maskBoxes(scan, ["Jan Kowalski"])!;
    expect(boxes).toContainEqual([10, 700, 200, 740]);
    // Whole badly read line.
    expect(boxes.some((box) => box[1] <= 597 && box[3] >= 643 && box[0] <= 100 && box[2] >= 300)).toBe(true);
    // The name: from "Jan" (char 8 of 20) to the end of the line, padded.
    const name = boxes.find((box) => box[1] === 97)!;
    expect(name[0]).toBeLessThan(100 + 20 * 8);
    expect(name[2]).toBeGreaterThanOrEqual(500);
    // "Umowa najmu" stays visible.
    expect(boxes.some((box) => box[1] < 80 && box[3] > 50)).toBe(false);
  });

  it("finds a name split over two lines by its parts", () => {
    const values = protectedValues([
      { token: "[PII:PERSON:0001]", kind: "PERSON", value: "Jan Kowalski", createdAt: "" }
    ]);
    const scan = page("Wynajmujący Jan\nKowalski oświadcza", [
      { text: "Wynajmujący Jan", box: [0, 0, 300, 20] },
      { text: "Kowalski oświadcza", box: [0, 30, 360, 50] }
    ]);
    const boxes = maskBoxes(scan, values)!;
    expect(boxes.filter((box) => box[1] === -3).length).toBeGreaterThan(0);
    expect(boxes.filter((box) => box[1] === 27).length).toBeGreaterThan(0);
  });

  it("sends nothing when the image and the text cannot be aligned", () => {
    expect(maskBoxes(page("inny tekst", [{ text: "Najemca", box: [0, 0, 1, 1] }]), [])).toBeNull();
    expect(maskBoxes({ page: 1, text: "x", source: "OCR" }, [])).toBeNull();
  });

  it("photos go by default, text pages only on request, PDFs never by default", () => {
    const photo = page("STOP", [{ text: "STOP", box: [0, 0, 10, 10] }]);
    const scan = page("Sąd Rejonowy ".repeat(10), [{ text: "Sąd Rejonowy ".repeat(10), box: [0, 0, 10, 10] }]);
    expect(wantsImage(photo, "image/jpeg", "photos")).toBe(true);
    expect(wantsImage(scan, "image/jpeg", "photos")).toBe(false);
    expect(wantsImage(scan, "image/jpeg", "all")).toBe(true);
    expect(wantsImage(photo, "application/pdf", "photos")).toBe(false);
    expect(wantsImage(photo, "application/pdf", "all")).toBe(true);
  });

  it("resolves a photo with the current key masked, only when asked", async () => {
    const masked: Box[][] = [];
    const recognizer = {
      recognize: async (text: string): Promise<PiiSpan[]> => {
        const start = text.indexOf("WX 12345");
        return start < 0 ? [] : [{ start, end: start + 8, kind: "VEHICLE_PLATE", value: "WX 12345", confidence: 1, source: "AUTO" }];
      }
    };
    const service = new LocalPrivateDocumentService(
      new CompleteDocumentIngestor({ async extract() { return { bytes: 1, pages: [] }; } }),
      recognizer,
      24_000,
      new CompleteImageIngestor({
        async recognizeImage() {
          return { page: 1, text: "WX 12345", lines: [{ text: "WX 12345", score: 0.95, box: [400, 500, 520, 530] }], image };
        }
      }),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        async mask(_jpeg, boxes) {
          masked.push(boxes);
          return "MASKED";
        }
      }
    );
    const ingestion = await service.ingestImage(new Uint8Array([1, 2, 3]), "image/jpeg");
    expect(ingestion.chunks[0]!.text).not.toContain("WX 12345");

    const textOnly = await service.resolveProtectedChunks({ documentId: ingestion.documentId, chunkIndices: [1] });
    expect(textOnly.images).toBeUndefined();

    const withImage = await service.resolveProtectedChunks(
      { documentId: ingestion.documentId, chunkIndices: [1] },
      { images: "photos" }
    );
    expect(withImage.images).toEqual([{ page: 1, mediaType: "image/jpeg", data: "MASKED", masked: 2 }]);
    const plate = masked[0]!.find((box) => box[1] === 497)!;
    expect(plate[0]).toBeLessThanOrEqual(400);
    expect(plate[2]).toBeGreaterThanOrEqual(520);
  });

  it("selects images only for pages whose chunks are in context, within the limit", () => {
    const images = [1, 2, 3].map((pageNumber) => ({ page: pageNumber, mediaType: "image/jpeg" as const, data: "x", masked: 0 }));
    const requested = [{ documentId: "doc_a", images, chunks: [] }];
    const inContext = [{ documentId: "doc_a", chunks: [{ index: 1, pageStart: 1, pageEnd: 2, text: "" }] }];
    expect(selectEvidenceImages(requested, inContext).map((image) => image.page)).toEqual([1, 2]);
  });
});

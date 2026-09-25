import { describe, expect, it } from "vitest";
import { shouldCorrectOcr } from "../src/document-service.js";
import { documentProcessingOptions } from "../src/http/app.js";

describe("per-file document processing", () => {
  it("corrects OCR with the local model on its own or with the AI personal-data check", () => {
    expect(shouldCorrectOcr(undefined)).toBe(false);
    expect(shouldCorrectOcr({})).toBe(false);
    expect(shouldCorrectOcr({ ocrFix: true })).toBe(true);
    expect(shouldCorrectOcr({ localAi: true })).toBe(true);
    expect(shouldCorrectOcr({ localAi: true, ocrFix: false })).toBe(false);
  });

  it("reads the processing header of a raw upload", () => {
    expect(documentProcessingOptions(undefined)).toEqual({});
    expect(documentProcessingOptions("ocr-fix")).toEqual({ ocrFix: true });
    expect(documentProcessingOptions("local-ai, OCR-FIX")).toEqual({ localAi: true, ocrFix: true });
    expect(documentProcessingOptions("unknown")).toEqual({});
  });
});

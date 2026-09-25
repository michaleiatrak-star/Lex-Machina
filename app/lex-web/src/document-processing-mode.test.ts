import { describe, expect, it } from "vitest";
import {
  DOCUMENT_PROCESSING_MODES,
  processingModeKeepsClearText,
  processingModeOptions,
  processingModeUsesLocalAi
} from "./document-processing-mode.js";
import { createDocumentStagingState, setStagedDocumentMode, stageDocuments } from "./document-staging.js";

describe("document processing modes", () => {
  it("offers four modes and maps them to the runtime options", () => {
    expect(DOCUMENT_PROCESSING_MODES.map((item) => item.label)).toEqual([
      "OCR + anonimizacja",
      "OCR + anonimizacja z AI",
      "Tylko OCR",
      "Tylko OCR z korektą AI"
    ]);
    expect(processingModeOptions("ANONYMIZE")).toBeUndefined();
    expect(processingModeOptions("ANONYMIZE_AI")).toEqual({ localAi: true, ocrFix: true });
    expect(processingModeOptions("OCR")).toBeUndefined();
    expect(processingModeOptions("OCR_AI")).toEqual({ ocrFix: true });
    expect(processingModeKeepsClearText("OCR_AI")).toBe(true);
    expect(processingModeKeepsClearText("ANONYMIZE_AI")).toBe(false);
    expect(processingModeUsesLocalAi("OCR")).toBe(false);
  });

  it("keeps a mode per staged file, anonymization by default", () => {
    const file = { name: "a.pdf", size: 10, type: "", lastModified: 1 } as File;
    let state = stageDocuments(createDocumentStagingState(), [file]);
    expect(state.items[0]!.mode).toBe("ANONYMIZE");
    state = setStagedDocumentMode(state, state.items[0]!.id, "OCR_AI");
    expect(state.items[0]!.mode).toBe("OCR_AI");
  });
});

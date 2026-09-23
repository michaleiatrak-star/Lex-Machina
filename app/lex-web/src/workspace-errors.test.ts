import { describe, expect, it } from "vitest";
import { ApiError } from "./api.js";
import { documentProcessingFailureMessage } from "./WorkspaceManager.js";

describe("document processing failure message", () => {
  it("names the OCR cause and keeps the code", () => {
    const message = documentProcessingFailureMessage(
      new ApiError("STORED_FILE_PROCESSING_FAILED", 422, undefined, "OCR_ENGINE_FAILED")
    );
    expect(message).toContain("lokalny OCR");
    expect(message).toContain("Kod: OCR_ENGINE_FAILED");
  });

  it("explains a desktop proxy timeout", () => {
    expect(
      documentProcessingFailureMessage(
        new ApiError("DESKTOP_RUNTIME_PROXY_FAILED:READ", 502)
      )
    ).toContain("limicie czasu");
  });
});

import { describe, expect, it } from "vitest";
import {
  accountSessionModelId,
  accountSessionResumeMode,
  isAccountSessionModel,
  isMissingResumableSessionMessage
} from "./account-session.js";

describe("provider account-session transport", () => {
  it("uses isolated pseudo-model ids for each account lane", () => {
    expect(
      accountSessionModelId(
        "openai"
      )
    ).toBe(
      "account/openai/default"
    );
    expect(
      accountSessionModelId(
        "anthropic"
      )
    ).toBe(
      "account/anthropic/default"
    );
    expect(
      accountSessionModelId(
        "xai"
      )
    ).toBe(
      "account/xai/default"
    );
  });


  it("uses last-or-new continuity for account hosts", () => {
    expect(
      accountSessionResumeMode()
    ).toBe("LAST_OR_NEW");
  });

  it("falls back to a new host session only for missing-session failures", () => {
    expect(
      isMissingResumableSessionMessage(
        "No saved session found"
      )
    ).toBe(true);
    expect(
      isMissingResumableSessionMessage(
        "conversation not found"
      )
    ).toBe(true);
    expect(
      isMissingResumableSessionMessage(
        "network connection failed"
      )
    ).toBe(false);
  });

  it("does not confuse API or local models with account-session models", () => {
    expect(
      isAccountSessionModel(
        "openai",
        "account/openai/default"
      )
    ).toBe(true);
    expect(
      isAccountSessionModel(
        "openai",
        "gpt-5"
      )
    ).toBe(false);
    expect(
      isAccountSessionModel(
        "openai",
        "local/mistral-nemo-12b-q4km"
      )
    ).toBe(false);
    expect(
      isAccountSessionModel(
        "anthropic",
        "account/openai/default"
      )
    ).toBe(false);
  });
});

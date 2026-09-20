import { describe, expect, it } from "vitest";
import {
  accountSessionModelId,
  isAccountSessionModel
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

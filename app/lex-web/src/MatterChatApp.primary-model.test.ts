import { describe, expect, it } from "vitest";
import {
  canExecutePrimaryModel,
  shouldLoadPrimaryModelCatalog
} from "./MatterChatApp.js";

describe("primary local model chat policy", () => {
  it("discovers local OpenAI-compatible models even without an OpenAI API key", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "openai",
        false
      )
    ).toBe(true);
  });

  it("waits for provider status before opening the primary model catalog", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "openai",
        undefined
      )
    ).toBe(false);
  });

  it("still requires credentials to discover non-local provider catalogs", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "anthropic",
        false
      )
    ).toBe(false);
    expect(
      shouldLoadPrimaryModelCatalog(
        "xai",
        true
      )
    ).toBe(true);
  });

  it("allows Bielik and Mistral local ids to execute as primary without an OpenAI key", () => {
    expect(
      canExecutePrimaryModel(
        false,
        "local/bielik-11b-v3-q4km"
      )
    ).toBe(true);
    expect(
      canExecutePrimaryModel(
        false,
        "local/mistral-nemo-12b-q4km"
      )
    ).toBe(true);
  });

  it("keeps remote primary models credential-gated", () => {
    expect(
      canExecutePrimaryModel(
        false,
        "gpt-5"
      )
    ).toBe(false);
    expect(
      canExecutePrimaryModel(
        true,
        "gpt-5"
      )
    ).toBe(true);
  });
});

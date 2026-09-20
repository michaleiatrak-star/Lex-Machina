import { describe, expect, it } from "vitest";
import {
  canExecutePrimaryModel,
  modelsForPrimarySource,
  runtimeProviderForPrimarySource,
  shouldLoadPrimaryModelCatalog
} from "./primary-model-policy.js";

describe("primary local model chat policy", () => {
  it("exposes local models as a separate primary source", () => {
    expect(
      runtimeProviderForPrimarySource("local")
    ).toBe("openai");
    expect(
      runtimeProviderForPrimarySource("anthropic")
    ).toBe("anthropic");
  });

  it("loads the local model catalog without an OpenAI API key", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "local",
        false
      )
    ).toBe(true);
  });

  it("does not expose local models inside the OpenAI cloud lane", () => {
    const catalog = [
      { id: "local/bielik-11b-v3-q4km" },
      { id: "local/mistral-nemo-12b-q4km" },
      { id: "gpt-5" }
    ];

    expect(
      modelsForPrimarySource("local", catalog)
        .map((item) => item.id)
    ).toEqual([
      "local/bielik-11b-v3-q4km",
      "local/mistral-nemo-12b-q4km"
    ]);
    expect(
      modelsForPrimarySource("openai", catalog)
        .map((item) => item.id)
    ).toEqual(["gpt-5"]);
  });

  it("requires credentials before opening cloud provider catalogs", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "openai",
        false
      )
    ).toBe(false);
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

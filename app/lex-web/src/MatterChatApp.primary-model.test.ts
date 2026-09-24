import { describe, expect, it } from "vitest";
import {
  accountModelIdForPrimarySource,
  canExecutePrimaryModel,
  isAccountPrimarySource,
  modelsForPrimarySource,
  runtimeProviderForPrimarySource,
  shouldLoadPrimaryModelCatalog
} from "./primary-model-policy.js";

describe("primary model chat policy", () => {
  it("exposes local models as a separate primary source", () => {
    expect(
      runtimeProviderForPrimarySource("local")
    ).toBe("openai");
    expect(
      runtimeProviderForPrimarySource("anthropic")
    ).toBe("anthropic");
  });

  it("maps account lanes back to their runtime providers", () => {
    expect(
      runtimeProviderForPrimarySource(
        "openai-account"
      )
    ).toBe("openai");
    expect(
      runtimeProviderForPrimarySource(
        "anthropic-account"
      )
    ).toBe("anthropic");
    expect(
      runtimeProviderForPrimarySource(
        "xai-account"
      )
    ).toBe("xai");
    expect(
      isAccountPrimarySource(
        "anthropic-account"
      )
    ).toBe(true);
    expect(
      accountModelIdForPrimarySource(
        "xai-account"
      )
    ).toBe(
      "account/xai/default"
    );
  });

  it("loads the local model catalog without an OpenAI API key", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "local",
        false
      )
    ).toBe(true);
  });

  it("does not open cloud model catalogs for account-session lanes", () => {
    expect(
      shouldLoadPrimaryModelCatalog(
        "openai-account",
        true
      )
    ).toBe(false);
    expect(
      shouldLoadPrimaryModelCatalog(
        "anthropic-account",
        true
      )
    ).toBe(false);
  });

  it("does not expose local or account models inside the OpenAI API lane", () => {
    const catalog = [
      { id: "local/bielik-11b-v3-q4km" },
      { id: "local/mistral-nemo-12b-q4km" },
      { id: "account/openai/default" },
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
    expect(
      modelsForPrimarySource(
        "openai-account",
        catalog
      )
    ).toEqual([]);
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

  it("gates account models on authenticated account sessions", () => {
    expect(
      canExecutePrimaryModel(
        false,
        "account/openai/default",
        false
      )
    ).toBe(false);
    expect(
      canExecutePrimaryModel(
        false,
        "account/openai/default",
        true
      )
    ).toBe(true);
  });

  it("keeps remote API primary models credential-gated", () => {
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

describe("provider failure message", () => {
  it("names Claude, always shows the code and the sanitized detail", async () => {
    const { providerFailureMessage } = await import("./MatterChatApp.js");
    const message = providerFailureMessage(
      "anthropic-account",
      "ACCOUNT_SESSION_CLI_SPAWN_FAILED",
      "ACCOUNT_SESSION_CLI_SPAWN_FAILED:ENOENT:claude"
    );
    expect(message).toContain("Claude Code");
    expect(message).not.toContain("ChatGPT");
    expect(message).toContain("Kod: ACCOUNT_SESSION_CLI_SPAWN_FAILED");
    expect(message).toContain("Szczegóły:");
    expect(
      providerFailureMessage("openai-account", "ACCOUNT_SESSION_CLI_FAILED")
    ).toContain("Codex");
  });
});

describe("routing footer", () => {
  it("does not show a legal route for an answer without legal skills", async () => {
    const { routingMeta } = await import("./MatterChatApp.js");
    expect(
      routingMeta(
        {
          primarySkill:
            "dr-01-ustroj-konstytucyjny-i-zrodla-prawa",
          loadedSkills: []
        },
        "dr-01-ustroj-konstytucyjny-i-zrodla-prawa"
      )
    ).toBe("rozmowa bez skilli prawnych");
    expect(
      routingMeta(
        {
          primarySkill:
            "dr-02-prawo-cywilne-rodzinne-gospodarcze",
          loadedSkills: [
            "prawny-router-v3",
            "dr-02-prawo-cywilne-rodzinne-gospodarcze"
          ]
        },
        "dr-02-prawo-cywilne-rodzinne-gospodarcze"
      )
    ).toMatch(/^routing: DR 02/);
  });
});

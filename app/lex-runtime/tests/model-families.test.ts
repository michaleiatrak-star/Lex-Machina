import { describe, expect, it } from "vitest";
import { newestModelFamilies } from "../src/providers/model-families.js";
import { accountSessionClientModel, isAccountSessionModel } from "../src/providers/account-session.js";
import type { ModelDescriptor } from "../src/providers/model-catalog.js";

const model = (provider: ModelDescriptor["provider"], id: string, createdAt = ""): ModelDescriptor => ({
  provider,
  id,
  displayName: id,
  selectable: true,
  ...(createdAt ? { createdAt } : {})
});

describe("model families", () => {
  it("keeps the two newest Claude versions per family and no Haiku", () => {
    const ids = newestModelFamilies([
      model("anthropic", "claude-haiku-4-5"),
      model("anthropic", "claude-opus-4-8"),
      model("anthropic", "claude-opus-5"),
      model("anthropic", "claude-opus-5-5"),
      model("anthropic", "claude-sonnet-4-5-20250929"),
      model("anthropic", "claude-sonnet-4-6"),
      model("anthropic", "claude-sonnet-5"),
      model("anthropic", "claude-fable-5"),
      model("anthropic", "claude-fable-5-1")
    ]).map((item) => item.id);
    expect(ids).toEqual([
      "claude-fable-5-1",
      "claude-fable-5",
      "claude-opus-5-5",
      "claude-opus-5",
      "claude-sonnet-5",
      "claude-sonnet-4-6"
    ]);
  });

  it("keeps the main GPT line without mini, nano or specialised variants, and local models", () => {
    const ids = newestModelFamilies([
      model("openai", "local/bielik-11b-v3-q4km"),
      model("openai", "gpt-5.4"),
      model("openai", "gpt-5.4-mini"),
      model("openai", "gpt-5.5"),
      model("openai", "gpt-5.5-nano"),
      model("openai", "gpt-5.5-2026-05-01", "2026-05-01"),
      model("openai", "gpt-5.6-luna"),
      model("openai", "gpt-5.5-codex"),
      model("openai", "gpt-realtime")
    ]).map((item) => item.id);
    expect(ids).toEqual(["local/bielik-11b-v3-q4km", "gpt-5.6-luna", "gpt-5.5"]);
  });
});

describe("account session models", () => {
  it("accepts only offered models next to the client default", () => {
    expect(isAccountSessionModel("anthropic", "account/anthropic/default")).toBe(true);
    expect(accountSessionClientModel("anthropic", "account/anthropic/default")).toBeNull();
    expect(accountSessionClientModel("anthropic", "account/anthropic/claude-opus-5-5")).toBe("claude-opus-5-5");
    expect(isAccountSessionModel("anthropic", "account/anthropic/claude-haiku-4-5")).toBe(false);
    expect(accountSessionClientModel("openai", "account/openai/gpt-5.5")).toBe("gpt-5.5");
    expect(isAccountSessionModel("openai", "account/anthropic/claude-opus-5")).toBe(false);
  });
});

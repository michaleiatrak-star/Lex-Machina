import { describe, expect, it } from "vitest";
import {
  AiSdkProviderAdapter,
  createLiveProviderRegistry
} from "../src/providers/ai-sdk-adapter.js";
import {
  MissingProviderCredentialError,
  StaticCredentialResolver
} from "../src/providers/credentials.js";

describe("AiSdkProviderAdapter", () => {
  it("fails before provider invocation when the API key is missing", async () => {
    const adapter = new AiSdkProviderAdapter(
      "openai",
      new StaticCredentialResolver({})
    );

    await expect(
      adapter.stream({
        model: "gpt-test",
        systemPrompt: "system",
        messages: [{ role: "user", content: "hello" }]
      })
    ).rejects.toBeInstanceOf(MissingProviderCredentialError);
  });

  it("registers all supported live providers", () => {
    const registry = createLiveProviderRegistry(
      new StaticCredentialResolver({})
    );

    expect(
      registry.list().map((adapter) => adapter.id).sort()
    ).toEqual(["anthropic", "openai", "xai"]);
  });
});

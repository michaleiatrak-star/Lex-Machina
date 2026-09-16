import { describe, expect, it } from "vitest";
import { runProviderConformance } from "../src/providers/conformance.js";
import { ProviderGateway, ProviderRegistry } from "../src/providers/gateway.js";
import { ScriptedProviderAdapter } from "../src/providers/scripted-provider.js";
import { smokeTestAiSdkFactories } from "../src/providers/ai-sdk-factories.js";
import {
  MemoryOverlayCredentialResolver,
  StaticCredentialResolver
} from "../src/providers/credentials.js";

describe("provider conformance", () => {
  for (const id of ["openai", "anthropic", "xai"] as const) {
    it(`${id} satisfies the normalized provider contract`, async () => {
      const report = await runProviderConformance(
        new ScriptedProviderAdapter({
          id,
          autoToolCall: true
        })
      );
      expect(report.pass, JSON.stringify(report, null, 2)).toBe(true);
    });
  }

  it("fails closed when tools are requested from a non-tool provider", async () => {
    const adapter = new ScriptedProviderAdapter({
      id: "openai",
      capabilities: { tools: false }
    });
    const report = await runProviderConformance(adapter);
    expect(report.pass, JSON.stringify(report, null, 2)).toBe(true);
    expect(report.cases).toContainEqual(
      expect.objectContaining({
        id: "tools-fail-closed",
        pass: true
      })
    );
  });

  it("normalizes unknown provider errors", async () => {
    const registry = new ProviderRegistry();
    registry.register(
      new ScriptedProviderAdapter({
        id: "openai"
      })
    );
    const gateway = new ProviderGateway(registry);

    await expect(
      gateway.stream("anthropic", {
        model: "claude-test",
        systemPrompt: "",
        messages: []
      })
    ).rejects.toMatchObject({
      code: "UNKNOWN_PROVIDER",
      provider: "anthropic"
    });
  });

  it("keeps provider overrides in process memory and falls back after clear", async () => {
    const resolver =
      new MemoryOverlayCredentialResolver(
        new StaticCredentialResolver({
          openai:
            "fallback-openai-key-12345"
        })
      );

    expect(
      await resolver.getApiKey(
        "openai"
      )
    ).toBe(
      "fallback-openai-key-12345"
    );

    resolver.setApiKey(
      "openai",
      "memory-openai-key-67890"
    );
    expect(
      resolver.hasMemoryKey(
        "openai"
      )
    ).toBe(true);
    expect(
      await resolver.getApiKey(
        "openai"
      )
    ).toBe(
      "memory-openai-key-67890"
    );

    resolver.clearApiKey(
      "openai"
    );
    expect(
      resolver.hasMemoryKey(
        "openai"
      )
    ).toBe(false);
    expect(
      await resolver.getApiKey(
        "openai"
      )
    ).toBe(
      "fallback-openai-key-12345"
    );

    resolver.close();
  });

  it("rejects malformed provider keys without persisting them", async () => {
    const resolver =
      new MemoryOverlayCredentialResolver(
        new StaticCredentialResolver({})
      );

    expect(() =>
      resolver.setApiKey(
        "anthropic",
        "short"
      )
    ).toThrow(
      "INVALID_PROVIDER_API_KEY"
    );
    expect(() =>
      resolver.setApiKey(
        "anthropic",
        "valid-looking-key\nsecond-line"
      )
    ).toThrow(
      "INVALID_PROVIDER_API_KEY"
    );
    expect(
      await resolver.getApiKey(
        "anthropic"
      )
    ).toBeNull();

    resolver.close();
  });

  it("can instantiate OpenAI, Anthropic and xAI AI-SDK models without network calls", async () => {
    const results = await smokeTestAiSdkFactories();
    expect(results.every((entry) => entry.pass), JSON.stringify(results, null, 2)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { runProviderConformance } from "../src/providers/conformance.js";
import { ProviderGateway, ProviderRegistry } from "../src/providers/gateway.js";
import { ScriptedProviderAdapter } from "../src/providers/scripted-provider.js";
import { smokeTestAiSdkFactories } from "../src/providers/ai-sdk-factories.js";

describe("provider conformance", () => {
  for (const id of ["openai", "anthropic", "xai"] as const) {
    it(`${id} satisfies the normalized provider contract`, async () => {
      const report = await runProviderConformance(
        new ScriptedProviderAdapter({ id })
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

  it("can instantiate OpenAI, Anthropic and xAI AI-SDK models without network calls", async () => {
    const results = await smokeTestAiSdkFactories();
    expect(results.every((entry) => entry.pass), JSON.stringify(results, null, 2)).toBe(true);
  });
});

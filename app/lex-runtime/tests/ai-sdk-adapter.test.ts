import { describe, expect, it } from "vitest";
import {
  AiSdkProviderAdapter,
  buildLocalToolSystemPrompt,
  createLiveProviderRegistry,
  parseLocalToolCalls
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

  it("uses a runtime-owned text tool protocol for local models", () => {
    const params = {
      model:
        "local/mistral-nemo-12b-q4km",
      systemPrompt:
        "system",
      messages: [
        {
          role:
            "user" as const,
          content:
            "Sprawdź źródło."
        }
      ],
      tools: [
        {
          type:
            "function" as const,
          function: {
            name:
              "verify_source",
            description:
              "Verify a source",
            parameters: {
              type:
                "object",
              properties: {}
            }
          }
        }
      ]
    };

    const prompt =
      buildLocalToolSystemPrompt(
        params,
        []
      );
    expect(prompt).toContain(
      "LEX MACHINA LOCAL TOOL PROTOCOL"
    );
    expect(prompt).toContain(
      "verify_source"
    );

    expect(
      parseLocalToolCalls(
        'LEX_TOOL_CALLS_JSON:{"calls":[{"id":"call_1","name":"verify_source","input":{}}]}'
      )
    ).toEqual([
      {
        id: "call_1",
        name:
          "verify_source",
        input: {}
      }
    ]);
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

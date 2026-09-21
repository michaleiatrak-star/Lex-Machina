import { describe, expect, it } from "vitest";
import {
  AiSdkProviderAdapter,
  buildLocalChatRequest,
  buildLocalToolSystemPrompt,
  classifyLocalInferenceFailure,
  createLiveProviderRegistry,
  parseLocalSseLine,
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

  it("uses a minimal llama.cpp-compatible request shape for local chat", () => {
    expect(
      buildLocalChatRequest(
        "local/mistral-nemo-12b-q4km",
        "system",
        [
          {
            role: "user",
            content:
              "Odpowiedz wyłącznie: OK"
          }
        ]
      )
    ).toEqual({
      model:
        "local/mistral-nemo-12b-q4km",
      messages: [
        {
          role: "system",
          content:
            "system"
        },
        {
          role: "user",
          content:
            "Odpowiedz wyłącznie: OK"
        }
      ],
      max_tokens:
        16_384,
      stream: true
    });
  });

  it("parses the exact llama.cpp SSE frame pattern used by Mistral NeMo", () => {
    const frames = [
      'data: {"choices":[{"finish_reason":null,"index":0,"delta":{"role":"assistant","content":null}}],"object":"chat.completion.chunk"}',
      'data: {"choices":[{"finish_reason":null,"index":0,"delta":{"content":"OK"}}],"object":"chat.completion.chunk"}',
      'data: {"choices":[{"finish_reason":"stop","index":0,"delta":{}}],"object":"chat.completion.chunk"}',
      "data: [DONE]"
    ];
    expect(
      frames
        .map(
          parseLocalSseLine
        )
        .join("")
    ).toBe("OK");
  });

  it("classifies local inference failures into actionable diagnostics", () => {
    expect(
      classifyLocalInferenceFailure(
        "TypeError: fetch failed cause ECONNREFUSED 127.0.0.1"
      )
    ).toBe(
      "LOCAL_MODEL_SERVER_UNREACHABLE"
    );
    expect(
      classifyLocalInferenceFailure(
        "HTTP status 400: Bad Request"
      )
    ).toBe(
      "LOCAL_MODEL_REQUEST_REJECTED"
    );
    expect(
      classifyLocalInferenceFailure(
        "HTTP status 503: Service Unavailable"
      )
    ).toBe(
      "LOCAL_MODEL_SERVER_ERROR"
    );
    expect(
      classifyLocalInferenceFailure(
        "prompt exceeds maximum context window"
      )
    ).toBe(
      "LOCAL_MODEL_CONTEXT_OVERFLOW"
    );
    expect(
      classifyLocalInferenceFailure(
        "failed to allocate device memory"
      )
    ).toBe(
      "LOCAL_MODEL_RESOURCE_EXHAUSTED"
    );
    expect(
      classifyLocalInferenceFailure(
        "generation stopped unexpectedly"
      )
    ).toBe(
      "LOCAL_MODEL_INFERENCE_FAILED"
    );
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

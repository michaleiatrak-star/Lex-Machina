import { describe, expect, it } from "vitest";
import {
  AiSdkProviderAdapter,
  accountSessionBackendAllowed,
  buildLocalChatRequest,
  buildLocalToolSystemPrompt,
  classifyLocalInferenceFailure,
  isLocalSseTerminalLine,
  localChatBudget,
  createLiveProviderRegistry,
  parseLocalSseLine,
  parseLocalToolCalls,
  readLocalSse
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

  it("allows documented account and OAuth automation backends without conflating them with API keys", () => {
    expect(
      accountSessionBackendAllowed(
        "anthropic"
      )
    ).toBe(true);
    expect(
      accountSessionBackendAllowed(
        "openai"
      )
    ).toBe(true);
    expect(
      accountSessionBackendAllowed(
        "xai"
      )
    ).toBe(true);
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
        4_096,
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

  it("detects Mistral/llama.cpp terminal SSE frames without waiting for socket close", () => {
    expect(
      isLocalSseTerminalLine(
        'data: {"choices":[{"finish_reason":"stop","index":0,"delta":{}}]}'
      )
    ).toBe(true);
    expect(
      isLocalSseTerminalLine(
        "data: [DONE]"
      )
    ).toBe(true);
    expect(
      isLocalSseTerminalLine(
        'data: {"choices":[{"finish_reason":null,"index":0,"delta":{"content":"OK"}}]}'
      )
    ).toBe(false);
  });

  it("finishes a Mistral SSE response even when the HTTP stream stays open after stop", async () => {
    const encoder =
      new TextEncoder();
    let controllerRef:
      ReadableStreamDefaultController<
        Uint8Array
      > | null = null;
    const body =
      new ReadableStream<
        Uint8Array
      >({
        start(controller) {
          controllerRef =
            controller;
          controller.enqueue(
            encoder.encode(
              'data: {"choices":[{"finish_reason":null,"index":0,"delta":{"content":"OK"}}]}\n\n'
            )
          );
          controller.enqueue(
            encoder.encode(
              'data: {"choices":[{"finish_reason":"stop","index":0,"delta":{}}]}\n\n'
            )
          );
          // Intentionally do not close the stream. This reproduces a local
          // llama.cpp/Mistral keep-alive connection after the terminal frame.
        },
        cancel() {
          controllerRef =
            null;
        }
      });

    const result =
      await Promise.race([
        readLocalSse(
          new Response(
            body,
            {
              status: 200,
              headers: {
                "content-type":
                  "text/event-stream"
              }
            }
          )
        ),
        new Promise<string>(
          (_, reject) => {
            setTimeout(
              () =>
                reject(
                  new Error(
                    "MISTRAL_SSE_DID_NOT_FINISH"
                  )
                ),
              500
            );
          }
        )
      ]);

    expect(result).toBe("OK");
    expect(
      controllerRef
    ).toBeNull();
  });

  it("budgets local output against a 64k qualified context without logging prompt content", () => {
    const budget =
      localChatBudget(
        64_000,
        "S".repeat(
          20_000
        ),
        [
          {
            role: "user",
            content:
              "napisz ok, nic więcej"
          }
        ],
        2
      );

    expect(
      budget.contextTokens
    ).toBe(64_000);
    expect(
      budget.promptChars
    ).toBeGreaterThan(
      20_000
    );
    expect(
      budget.estimatedPromptTokens
    ).toBeLessThan(
      64_000
    );
    expect(
      budget.maxOutputTokens
    ).toBe(4_096);
  });

  it("rejects a generated system prompt that would exhaust the configured local context", () => {
    expect(() =>
      localChatBudget(
        64_000,
        "S".repeat(
          130_000
        ),
        [
          {
            role: "user",
            content:
              "napisz ok, nic więcej"
          }
        ],
        2
      )
    ).toThrow(
      /LOCAL_MODEL_CONTEXT_OVERFLOW/
    );
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

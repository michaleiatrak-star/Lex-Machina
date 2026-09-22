import { describe, expect, it, vi } from "vitest";
import {
  AiSdkProviderAdapter,
  accountSessionBackendAllowed,
  buildLocalChatRequest,
  buildLocalToolSystemPrompt,
  classifyLocalInferenceFailure,
  compactLocalToolSchemas,
  isLocalSseTerminalLine,
  localChatBudget,
  createLiveProviderRegistry,
  parseLocalSseErrorLine,
  parseLocalSseLine,
  parseLocalToolCalls,
  readLocalSse,
  shouldRetryLocalAtMinimumContext
} from "../src/providers/ai-sdk-adapter.js";
import type { LocalModelRuntime } from "../src/local-model-runtime.js";
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

  it("recognizes llama.cpp legacy SSE error fields and preserves the real reason", () => {
    expect(
      parseLocalSseErrorLine(
        'error: {"code":400,"message":"the request exceeds the available context size","type":"invalid_request_error"}'
      )
    ).toBe(
      "400:the request exceeds the available context size"
    );

    expect(
      classifyLocalInferenceFailure(
        "LOCAL_MODEL_HTTP_STREAM_ERROR:400:the request exceeds the available context size"
      )
    ).toBe(
      "LOCAL_MODEL_CONTEXT_OVERFLOW"
    );
  });

  it("fails immediately on llama.cpp SSE error fields instead of misreporting an empty response", async () => {
    const encoder =
      new TextEncoder();
    const body =
      new ReadableStream<
        Uint8Array
      >({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              'error: {"code":400,"message":"the request exceeds the available context size","type":"invalid_request_error"}\n\n'
            )
          );
          controller.enqueue(
            encoder.encode(
              "data: [DONE]\n\n"
            )
          );
          controller.close();
        }
      });

    await expect(
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
      )
    ).rejects.toThrow(
      "LOCAL_MODEL_HTTP_STREAM_ERROR:400:the request exceeds the available context size"
    );
  });

  it("compacts verbose runtime tool schemas before putting them into a local-model prompt", () => {
    const verbose =
      "Opis parametru ".repeat(
        100
      );
    const compact =
      compactLocalToolSchemas([
        {
          type:
            "function",
          function: {
            name:
              "verify_source",
            description:
              verbose,
            parameters: {
              type:
                "object",
              properties: {
                query: {
                  type:
                    "string",
                  description:
                    verbose,
                  examples: [
                    verbose
                  ]
                }
              },
              required: [
                "query"
              ],
              additionalProperties:
                false
            }
          }
        }
      ]);
    const serialized =
      JSON.stringify(
        compact
      );

    expect(
      serialized.length
    ).toBeLessThan(
      verbose.length
    );
    expect(serialized).toContain(
      '"query"'
    );
    expect(serialized).not.toContain(
      '"examples"'
    );
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

  it("fails a silent local SSE stream instead of hanging forever", async () => {
    let controllerRef:
      ReadableStreamDefaultController<
        Uint8Array
      > | null = null;
    const body =
      new ReadableStream<
        Uint8Array
      >({
        start(controller) {
          // Retain the controller so Node cannot treat the synthetic stream as
          // exhausted while we reproduce a server that keeps the socket open.
          controllerRef =
            controller;
        },
        cancel() {
          controllerRef =
            null;
        }
      });

    await expect(
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
        ),
        {
          firstContentMs: 20,
          idleMs: 20
        }
      )
    ).rejects.toThrow(
      "LOCAL_MODEL_SSE_FIRST_CONTENT_TIMEOUT"
    );
    expect(
      controllerRef
    ).toBeNull();
  });

  it("fails a stalled local SSE stream after content instead of hanging forever", async () => {
    const encoder =
      new TextEncoder();
    const body =
      new ReadableStream<
        Uint8Array
      >({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              'data: {"choices":[{"finish_reason":null,"index":0,"delta":{"content":"O"}}]}\n\n'
            )
          );
          // Keep the stream open after one content token.
        }
      });

    await expect(
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
        ),
        {
          firstContentMs: 50,
          idleMs: 20
        }
      )
    ).rejects.toThrow(
      "LOCAL_MODEL_SSE_IDLE_TIMEOUT"
    );
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

  it("continues local generation when the auxiliary input-token endpoint fails", async () => {
    const fetchMock =
      vi.fn(
        async (
          input: string | URL | Request
        ) => {
          const url =
            typeof input === "string"
              ? input
              : input instanceof URL
                ? input.toString()
                : input.url;

          if (
            url.endsWith(
              "/v1/chat/completions/input_tokens"
            )
          ) {
            return new Response(
              "token counter unavailable",
              { status: 500 }
            );
          }

          if (
            url.endsWith(
              "/v1/chat/completions"
            )
          ) {
            const encoder =
              new TextEncoder();
            return new Response(
              new ReadableStream<
                Uint8Array
              >({
                start(controller) {
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
                  controller.close();
                }
              }),
              {
                status: 200,
                headers: {
                  "content-type":
                    "text/event-stream"
                }
              }
            );
          }

          throw new Error(
            `unexpected fetch: ${url}`
          );
        }
      );
    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    const localModels = {
      ensureRunning:
        vi.fn(
          async () => ({
            id:
              "local/mistral-nemo-12b-q4km",
            contextWindow:
              64_000
          })
        ),
      status: () => ({
        endpoint:
          "http://127.0.0.1:43190/v1",
        configuredContextTokens:
          64_000,
        qualification:
          null
      })
    } as unknown as
      LocalModelRuntime;

    try {
      const adapter =
        new AiSdkProviderAdapter(
          "openai",
          new StaticCredentialResolver(
            {}
          ),
          localModels
        );

      await expect(
        adapter.stream({
          model:
            "local/mistral-nemo-12b-q4km",
          systemPrompt:
            "system",
          messages: [
            {
              role:
                "user",
              content:
                "Odpowiedz: OK"
            }
          ]
        })
      ).resolves.toEqual({
        fullText:
          "OK"
      });
      expect(
        fetchMock
      ).toHaveBeenCalledTimes(
        2
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("retries local response timeouts once at the minimum qualified context", () => {
    expect(
      shouldRetryLocalAtMinimumContext(
        new Error(
          "LOCAL_MODEL_SSE_FIRST_CONTENT_TIMEOUT"
        ),
        128_000,
        64_000
      )
    ).toBe(true);
    expect(
      shouldRetryLocalAtMinimumContext(
        new Error(
          "LOCAL_MODEL_HTTP_RESPONSE_TIMEOUT"
        ),
        64_000,
        64_000
      )
    ).toBe(false);
    expect(
      shouldRetryLocalAtMinimumContext(
        new Error(
          "LOCAL_MODEL_CONTEXT_OVERFLOW"
        ),
        128_000,
        64_000
      )
    ).toBe(false);
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
        "the request exceeds the available context size"
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
        "LOCAL_MODEL_SSE_READ_FAILED:LOCAL_MODEL_SSE_FIRST_CONTENT_TIMEOUT"
      )
    ).toBe(
      "LOCAL_MODEL_RESPONSE_TIMEOUT"
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

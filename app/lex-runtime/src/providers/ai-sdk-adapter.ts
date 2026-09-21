import type { LanguageModel, ToolSet } from "ai";
import { AI_SDK_MODEL_FACTORIES } from "./ai-sdk-factories.js";
import {
  MissingProviderCredentialError,
  type ProviderCredentialResolver
} from "./credentials.js";
import { ProviderRegistry } from "./gateway.js";
import type {
  NormalizedToolCall,
  NormalizedToolResult,
  ProviderAdapter,
  ProviderCapabilities,
  ProviderId,
  ProviderStreamParams,
  ProviderStreamResult
} from "./types.js";
import type { LocalModelRuntime } from "../local-model-runtime.js";
import {
  AccountSessionManager,
  isAccountSessionModel,
  streamAccountSession
} from "./account-session.js";

const MAX_OUTPUT_TOKENS = 16_384;

const LOCAL_TOOL_SENTINEL =
  "LEX_TOOL_CALLS_JSON:";

export function classifyLocalInferenceFailure(
  detail: string
):
  | "LOCAL_MODEL_SERVER_UNREACHABLE"
  | "LOCAL_MODEL_REQUEST_REJECTED"
  | "LOCAL_MODEL_SERVER_ERROR"
  | "LOCAL_MODEL_CONTEXT_OVERFLOW"
  | "LOCAL_MODEL_RESOURCE_EXHAUSTED"
  | "LOCAL_MODEL_INFERENCE_FAILED" {
  const lower =
    detail.toLowerCase();

  if (
    /context.{0,40}(exceed|overflow|too (large|long)|window)/i.test(
      detail
    ) ||
    /too many tokens|prompt is too long|maximum context/i.test(
      detail
    )
  ) {
    return "LOCAL_MODEL_CONTEXT_OVERFLOW";
  }

  if (
    /out of memory|\boom\b|bad_alloc|failed to allocate|insufficient memory|device memory/i.test(
      detail
    )
  ) {
    return "LOCAL_MODEL_RESOURCE_EXHAUSTED";
  }

  if (
    /econnrefused|und_err_connect|connection refused|fetch failed|socket hang up|socket closed|network error|failed to connect/i.test(
      lower
    )
  ) {
    return "LOCAL_MODEL_SERVER_UNREACHABLE";
  }

  const statusMatch =
    detail.match(
      /(?:http(?: status)?|status(?: code)?)[^0-9]{0,8}([45]\d\d)/i
    ) ??
    detail.match(
      /\b([45]\d\d)\s+(?:bad request|unauthorized|forbidden|not found|request|internal|server|service|gateway)/i
    );
  if (statusMatch) {
    const status =
      Number(
        statusMatch[1]
      );
    if (
      status >= 400 &&
      status < 500
    ) {
      return "LOCAL_MODEL_REQUEST_REJECTED";
    }
    if (
      status >= 500 &&
      status < 600
    ) {
      return "LOCAL_MODEL_SERVER_ERROR";
    }
  }

  return "LOCAL_MODEL_INFERENCE_FAILED";
}

export function parseLocalToolCalls(
  text: string
): NormalizedToolCall[] | null {
  let normalized =
    text.trim();
  if (
    normalized.startsWith("~~~") &&
    normalized.endsWith("~~~")
  ) {
    normalized = normalized
      .replace(/^~~~(?:json)?\s*/i, "")
      .replace(/\s*~~~$/, "")
      .trim();
  }
  if (
    normalized.startsWith("```") &&
    normalized.endsWith("```")
  ) {
    normalized = normalized
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  if (
    !normalized.startsWith(
      LOCAL_TOOL_SENTINEL
    )
  ) {
    return null;
  }

  let parsed: {
    calls?: unknown;
  };
  try {
    parsed =
      JSON.parse(
        normalized
          .slice(
            LOCAL_TOOL_SENTINEL.length
          )
          .trim()
      ) as {
        calls?: unknown;
      };
  } catch {
    throw new Error(
      "LOCAL_MODEL_TOOL_PROTOCOL_INVALID"
    );
  }
  if (
    !Array.isArray(
      parsed.calls
    )
  ) {
    throw new Error(
      "LOCAL_MODEL_TOOL_PROTOCOL_INVALID"
    );
  }

  return parsed.calls.map(
    (item, index) => {
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {
        throw new Error(
          "LOCAL_MODEL_TOOL_PROTOCOL_INVALID"
        );
      }
      const record =
        item as
          Record<string, unknown>;
      const name =
        typeof record.name ===
          "string"
          ? record.name
          : "";
      const id =
        typeof record.id ===
          "string" &&
        record.id
          ? record.id
          : `local_tool_${index + 1}`;
      const input =
        record.input &&
        typeof record.input ===
          "object" &&
        !Array.isArray(
          record.input
        )
          ? record.input as
              Record<
                string,
                unknown
              >
          : {};
      if (!name) {
        throw new Error(
          "LOCAL_MODEL_TOOL_PROTOCOL_INVALID"
        );
      }
      return {
        id,
        name,
        input
      };
    }
  );
}

export function buildLocalToolSystemPrompt(
  params: ProviderStreamParams,
  toolTranscript: string[]
): string {
  const toolSchemas =
    params.tools?.length
      ? JSON.stringify(
          params.tools.map(
            (tool) => ({
              name:
                tool.function.name,
              description:
                tool.function
                  .description,
              parameters:
                tool.function
                  .parameters
            })
          )
        )
      : "[]";

  const protocol =
    params.tools?.length
      ? [
          "LEX MACHINA LOCAL TOOL PROTOCOL:",
          "Tool execution belongs exclusively to Lex Machina runtime.",
          "Never invent a tool result and never claim that a tool ran unless its result appears in LEX_RUNTIME_TOOL_TRANSCRIPT.",
          "When a runtime tool is required, output ONLY one line beginning with:",
          `${LOCAL_TOOL_SENTINEL}{"calls":[{"id":"call_1","name":"tool_name","input":{}}]}`,
          "Use only names listed in LEX_RUNTIME_TOOLS.",
          "After tool results are supplied, continue the task. When no more tools are required, return the final answer normally.",
          `LEX_RUNTIME_TOOLS=${toolSchemas}`
        ]
      : [
          "LEX MACHINA LOCAL TOOL PROTOCOL:",
          "No runtime tools are available for this turn."
        ];

  return [
    params.systemPrompt,
    "",
    ...protocol,
    ...(toolTranscript.length
      ? [
          "",
          "LEX_RUNTIME_TOOL_TRANSCRIPT:",
          toolTranscript.join(
            "\n\n"
          )
        ]
      : [])
  ].join("\n");
}

export function buildLocalChatRequest(
  modelId: string,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"]
): {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  max_tokens: number;
  stream: true;
} {
  return {
    model: modelId,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      ...messages
    ],
    max_tokens: MAX_OUTPUT_TOKENS,
    stream: true
  };
}

async function streamLocalChatCompletion(
  endpoint: string,
  modelId: string,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"],
  abortSignal?: AbortSignal
): Promise<ProviderStreamResult> {
  const url =
    `${endpoint.replace(/\/$/, "")}/chat/completions`;
  let response: Response;
  try {
    response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "text/event-stream"
        },
        body: JSON.stringify(
          buildLocalChatRequest(
            modelId,
            systemPrompt,
            messages
          )
        ),
        ...(abortSignal
          ? {
              signal:
                abortSignal
            }
          : {})
      }
    );
  } catch (error) {
    throw new Error(
      `LOCAL_MODEL_HTTP_NETWORK:${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  }

  if (!response.ok) {
    const detail =
      await response.text()
        .catch(() => "");
    throw new Error(
      `HTTP status ${response.status}: ${detail
        .replace(/[\r\n]+/g, " ")
        .slice(-1200)}`
    );
  }

  if (!response.body) {
    throw new Error(
      "LOCAL_MODEL_HTTP_EMPTY_BODY"
    );
  }

  const reader =
    response.body.getReader();
  const decoder =
    new TextDecoder();
  let buffer = "";
  let fullText = "";

  const consumeLine = (
    rawLine: string
  ) => {
    const line =
      rawLine.trim();
    if (
      !line.startsWith(
        "data:"
      )
    ) {
      return;
    }
    const data =
      line.slice(5).trim();
    if (
      !data ||
      data === "[DONE]"
    ) {
      return;
    }

    let payload: {
      choices?: Array<{
        delta?: {
          content?: unknown;
        };
      }>;
      error?: {
        message?: unknown;
      };
    };
    try {
      payload =
        JSON.parse(data) as
          typeof payload;
    } catch {
      throw new Error(
        "LOCAL_MODEL_HTTP_INVALID_SSE_JSON"
      );
    }

    if (
      payload.error
    ) {
      throw new Error(
        `LOCAL_MODEL_HTTP_STREAM_ERROR:${
          typeof payload.error
            .message === "string"
            ? payload.error
                .message
            : "unknown"
        }`
      );
    }

    const content =
      payload.choices?.[0]
        ?.delta?.content;
    if (
      typeof content ===
        "string"
    ) {
      fullText += content;
    }
  };

  while (true) {
    const {
      done,
      value
    } =
      await reader.read();
    buffer +=
      decoder.decode(
        value,
        {
          stream:
            !done
        }
      );

    let newline =
      buffer.indexOf("\n");
    while (
      newline >= 0
    ) {
      const line =
        buffer.slice(
          0,
          newline
        );
      buffer =
        buffer.slice(
          newline + 1
        );
      consumeLine(line);
      newline =
        buffer.indexOf("\n");
    }

    if (done) {
      if (
        buffer.trim()
      ) {
        consumeLine(
          buffer
        );
      }
      break;
    }
  }

  if (!fullText.trim()) {
    throw new Error(
      "LOCAL_MODEL_HTTP_EMPTY_RESPONSE"
    );
  }

  return {
    fullText
  };
}

async function streamLocalModel(
  endpoint: string,
  modelId: string,
  params: ProviderStreamParams
): Promise<ProviderStreamResult> {
  const allowedTools =
    new Set(
      (params.tools ?? [])
        .map(
          (tool) =>
            tool.function.name
        )
    );
  const toolTranscript:
    string[] = [];
  const maxIterations =
    Math.max(
      1,
      Math.min(
        params.maxIterations ??
          10,
        12
      )
    );

  for (
    let iteration = 0;
    iteration <
      maxIterations;
    iteration += 1
  ) {
    let result:
      ProviderStreamResult;
    const {
      tools:
        _nativeTools,
      runTools:
        _nativeRunTools,
      callbacks:
        _nativeCallbacks,
      ...localParams
    } = params;
    try {
      result =
        await streamLocalChatCompletion(
          endpoint,
          modelId,
          buildLocalToolSystemPrompt(
            params,
            toolTranscript
          ),
          localParams.messages,
          localParams.abortSignal
        );
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : String(error);
      const reason =
        classifyLocalInferenceFailure(
          detail
        );
      throw new Error(
        `${reason}:${detail
          .replace(/[\r\n]+/g, " ")
          .slice(-800)}`
      );
    }

    const calls =
      parseLocalToolCalls(
        result.fullText
      );
    if (!calls) {
      params.callbacks
        ?.onContentDelta?.(
          result.fullText
        );
      return result;
    }

    if (
      calls.length === 0 ||
      !params.runTools
    ) {
      throw new Error(
        "LOCAL_MODEL_TOOL_PROTOCOL_UNAVAILABLE"
      );
    }

    for (
      const call
      of calls
    ) {
      if (
        !allowedTools.has(
          call.name
        )
      ) {
        throw new Error(
          `LOCAL_MODEL_UNKNOWN_TOOL:${call.name}`
        );
      }
      params.callbacks
        ?.onToolCallStart?.(
          call
        );
    }

    const results =
      await params.runTools(
        calls
      );
    for (
      const call
      of calls
    ) {
      const toolResult =
        results.find(
          (item) =>
            item.tool_use_id ===
              call.id
        );
      if (!toolResult) {
        throw new Error(
          `LOCAL_MODEL_TOOL_RESULT_MISSING:${call.id}`
        );
      }
      toolTranscript.push(
        [
          `TOOL_CALL ${call.id} ${call.name}`,
          JSON.stringify(
            call.input
          ),
          `TOOL_RESULT ${call.id}`,
          toolResult.content
        ].join("\n")
      );
    }
  }

  throw new Error(
    "LOCAL_MODEL_MAX_TOOL_ITERATIONS"
  );
}

type PendingToolExecution = {
  call: NormalizedToolCall;
  resolve: (content: string) => void;
  reject: (error: unknown) => void;
};

class ToolExecutionBatcher {
  private pending: PendingToolExecution[] = [];
  private scheduled = false;

  constructor(
    private readonly runTools: NonNullable<ProviderStreamParams["runTools"]>
  ) {}

  execute(call: NormalizedToolCall): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pending.push({ call, resolve, reject });
      if (!this.scheduled) {
        this.scheduled = true;
        queueMicrotask(() => void this.flush());
      }
    });
  }

  private async flush(): Promise<void> {
    const pending = this.pending;
    this.pending = [];
    this.scheduled = false;

    try {
      const results = await this.runTools(
        pending.map(({ call }) => call)
      );
      const byId = new Map(
        results.map((result: NormalizedToolResult) => [
          result.tool_use_id,
          result.content
        ])
      );

      for (const item of pending) {
        const content = byId.get(item.call.id);
        if (content === undefined) {
          item.reject(
            new Error(
              `Tool ${item.call.name} returned no result for call ${item.call.id}.`
            )
          );
        } else {
          item.resolve(content);
        }
      }
    } catch (error) {
      for (const item of pending) item.reject(error);
    }
  }
}

function normalizeToolInput(
  input: unknown
): Record<string, unknown> {
  return input && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

async function toAiSdkTools(
  params: ProviderStreamParams
): Promise<ToolSet | undefined> {
  const schemas = params.tools ?? [];
  if (schemas.length === 0) return undefined;

  const sdk = await import("ai");
  const batcher = params.runTools
    ? new ToolExecutionBatcher(params.runTools)
    : null;

  return Object.fromEntries(
    schemas.map((schema) => {
      const definition = {
        description: schema.function.description,
        inputSchema: sdk.jsonSchema<Record<string, unknown>>(
          schema.function.parameters as never
        ),
        ...(batcher
          ? {
              execute: (
                input: Record<string, unknown>,
                { toolCallId }: { toolCallId: string }
              ) =>
                batcher.execute({
                  id: toolCallId,
                  name: schema.function.name,
                  input: normalizeToolInput(input)
                })
            }
          : {})
      };

      return [
        schema.function.name,
        sdk.tool(definition as never)
      ];
    })
  );
}

function providerLabel(id: ProviderId): string {
  if (id === "openai") return "OpenAI";
  if (id === "anthropic") return "Anthropic";
  return "xAI";
}

function providerCapabilities(): ProviderCapabilities {
  return {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };
}

async function streamModel(
  model: LanguageModel,
  params: ProviderStreamParams,
  label: string
): Promise<ProviderStreamResult> {
  const sdk = await import("ai");
  const tools = await toAiSdkTools(params);
  const reasoning = (params.reasoning ?? "none") as
    | "provider-default"
    | "none"
    | "low"
    | "medium"
    | "high"
    | "xhigh";

  const result = sdk.streamText({
    model,
    system: params.systemPrompt,
    messages: params.messages,
    ...(tools ? { tools } : {}),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: sdk.stepCountIs(params.maxIterations ?? 10),
    ...(params.abortSignal
      ? { abortSignal: params.abortSignal }
      : {}),
    reasoning
  });

  let fullText = "";
  const openReasoning = new Set<string>();

  for await (const part of result.stream) {
    switch (part.type) {
      case "text-delta":
        fullText += part.text;
        params.callbacks?.onContentDelta?.(part.text);
        break;

      case "reasoning-start":
        openReasoning.add(part.id);
        break;

      case "reasoning-delta":
        openReasoning.add(part.id);
        params.callbacks?.onReasoningDelta?.(part.text);
        break;

      case "reasoning-end":
        if (openReasoning.delete(part.id)) {
          params.callbacks?.onReasoningBlockEnd?.();
        }
        break;

      case "tool-call":
        params.callbacks?.onToolCallStart?.({
          id: part.toolCallId,
          name: part.toolName,
          input: normalizeToolInput(part.input)
        });
        break;

      case "tool-error":
        throw new Error(
          part.error instanceof Error
            ? part.error.message
            : `${label} tool execution failed.`
        );

      case "error":
        throw new Error(
          part.error instanceof Error
            ? part.error.message
            : `${label} stream failed.`
        );

      case "abort": {
        const error = new Error(part.reason || "Stream aborted.");
        error.name = "AbortError";
        throw error;
      }
    }
  }

  for (const id of openReasoning) {
    openReasoning.delete(id);
    params.callbacks?.onReasoningBlockEnd?.();
  }

  return { fullText };
}

export class AiSdkProviderAdapter implements ProviderAdapter {
  readonly label: string;
  readonly capabilities = providerCapabilities();

  constructor(
    readonly id: ProviderId,
    private readonly credentials: ProviderCredentialResolver,
    private readonly localModels?: LocalModelRuntime,
    private readonly accountSessions?: AccountSessionManager
  ) {
    this.label = providerLabel(id);
  }

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    if (
      isAccountSessionModel(
        this.id,
        params.model
      )
    ) {
      if (!this.accountSessions) {
        throw new Error(
          "ACCOUNT_SESSION_RUNTIME_UNAVAILABLE"
        );
      }
      return streamAccountSession(
        this.accountSessions,
        this.id,
        params
      );
    }

    if (params.model.startsWith("local/")) {
      if (this.id !== "openai" || !this.localModels) {
        throw new Error("LOCAL_MODEL_RUNTIME_UNAVAILABLE");
      }
      const configuredModel =
        await this.localModels
          .ensureRunning(
            params.model
          );
      return streamLocalModel(
        this.localModels
          .status()
          .endpoint,
        configuredModel.id,
        {
          ...params,
          model:
            configuredModel.id,
          reasoning: "none"
        }
      );
    }

    const apiKey = await this.credentials.getApiKey(this.id);
    if (!apiKey) {
      throw new MissingProviderCredentialError(this.id);
    }

    const model = await AI_SDK_MODEL_FACTORIES[
      this.id
    ].createModel({
      apiKey,
      model: params.model
    });

    return streamModel(model, params, this.label);
  }
}

export function createLiveProviderRegistry(
  credentials: ProviderCredentialResolver,
  localModels?: LocalModelRuntime,
  accountSessions?: AccountSessionManager
): ProviderRegistry {
  const registry = new ProviderRegistry();
  for (const id of ["openai", "anthropic", "xai"] as const) {
    registry.register(
      new AiSdkProviderAdapter(
        id,
        credentials,
        id === "openai" ? localModels : undefined,
        accountSessions
      )
    );
  }
  return registry;
}

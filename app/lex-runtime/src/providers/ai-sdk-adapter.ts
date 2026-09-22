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
const LOCAL_DEFAULT_OUTPUT_TOKENS =
  4_096;
const LOCAL_CONTEXT_SAFETY_TOKENS =
  1_024;
const LOCAL_HTTP_RESPONSE_TIMEOUT_MS =
  300_000;
const LOCAL_FIRST_CONTENT_TIMEOUT_MS =
  300_000;
const LOCAL_STREAM_IDLE_TIMEOUT_MS =
  120_000;
const LOCAL_JSON_BODY_TIMEOUT_MS =
  300_000;

const LOCAL_TOOL_SENTINEL =
  "LEX_TOOL_CALLS_JSON:";

function compactLocalSchema(
  value: unknown,
  depth = 0
): unknown {
  if (
    depth > 6 ||
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .slice(0, 64)
      .map(
        (item) =>
          compactLocalSchema(
            item,
            depth + 1
          )
      );
  }

  const source =
    value as
      Record<string, unknown>;
  const result:
    Record<string, unknown> = {};
  const keys = [
    "type",
    "required",
    "enum",
    "properties",
    "items",
    "additionalProperties"
  ];
  for (const key of keys) {
    if (
      source[key] !==
        undefined
    ) {
      result[key] =
        compactLocalSchema(
          source[key],
          depth + 1
        );
    }
  }
  if (
    typeof source.description ===
      "string" &&
    source.description.trim()
  ) {
    result.description =
      source.description
        .replace(
          /\s+/g,
          " "
        )
        .trim()
        .slice(0, 180);
  }
  return result;
}

export function compactLocalToolSchemas(
  tools:
    NonNullable<
      ProviderStreamParams[
        "tools"
      ]
    >
): Array<{
  name: string;
  description: string;
  parameters: unknown;
}> {
  return tools.map(
    (tool) => ({
      name:
        tool.function.name,
      description:
        tool.function
          .description
          .replace(
            /\s+/g,
            " "
          )
          .trim()
          .slice(0, 240),
      parameters:
        compactLocalSchema(
          tool.function
            .parameters
        )
    })
  );
}

export function classifyLocalInferenceFailure(
  detail: string
):
  | "LOCAL_MODEL_SERVER_UNREACHABLE"
  | "LOCAL_MODEL_REQUEST_REJECTED"
  | "LOCAL_MODEL_SERVER_ERROR"
  | "LOCAL_MODEL_CONTEXT_OVERFLOW"
  | "LOCAL_MODEL_RESOURCE_EXHAUSTED"
  | "LOCAL_MODEL_RESPONSE_TIMEOUT"
  | "LOCAL_MODEL_INFERENCE_FAILED" {
  const lower =
    detail.toLowerCase();

  if (
    /context.{0,60}(exceed|overflow|too (large|long)|window)/i.test(
      detail
    ) ||
    /(exceed|overflow|too (large|long)).{0,60}context/i.test(
      detail
    ) ||
    /available context size|context size has been exceeded|too many tokens|prompt is too long|maximum context|n_prompt_tokens|\bn_ctx\b/i.test(
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
    /local_model_(?:http_response|sse_first_content|sse_idle|json_body)_timeout|headers timeout|body timeout/i.test(
      lower
    )
  ) {
    return "LOCAL_MODEL_RESPONSE_TIMEOUT";
  }

  if (
    /econnrefused|und_err_connect|und_err_socket|terminated|connection refused|fetch failed|socket hang up|socket closed|network error|failed to connect/i.test(
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
          compactLocalToolSchemas(
            params.tools
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

export type LocalChatBudget = {
  contextTokens: number;
  promptChars: number;
  estimatedPromptTokens: number;
  maxOutputTokens: number;
};

export function localChatBudget(
  contextTokens: number,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"],
  conservativeCharsPerToken = 2
): LocalChatBudget {
  const promptChars =
    systemPrompt.length +
    messages.reduce(
      (sum, message) =>
        sum +
        message.content.length,
      0
    );
  const charsPerToken =
    Number.isFinite(
      conservativeCharsPerToken
    ) &&
    conservativeCharsPerToken >= 1
      ? conservativeCharsPerToken
      : 2;
  // Reserve a small fixed margin for role/chat-template tokens that are not
  // represented directly by the raw character count.
  const estimatedPromptTokens =
    Math.ceil(
      promptChars /
        charsPerToken
    ) +
    512;
  const available =
    contextTokens -
    estimatedPromptTokens -
    LOCAL_CONTEXT_SAFETY_TOKENS;

  if (available < 64) {
    throw new Error(
      `LOCAL_MODEL_CONTEXT_OVERFLOW:context=${contextTokens}:estimated_prompt=${estimatedPromptTokens}:prompt_chars=${promptChars}`
    );
  }

  return {
    contextTokens,
    promptChars,
    estimatedPromptTokens,
    maxOutputTokens:
      Math.max(
        64,
        Math.min(
          MAX_OUTPUT_TOKENS,
          LOCAL_DEFAULT_OUTPUT_TOKENS,
          available
        )
      )
  };
}

export function buildLocalChatRequest(
  modelId: string,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"],
  maxOutputTokens:
    number = LOCAL_DEFAULT_OUTPUT_TOKENS,
  stream = true
): {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  max_tokens: number;
  stream: boolean;
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
    max_tokens:
      maxOutputTokens,
    stream
  };
}

export function isLocalSseTerminalLine(
  rawLine: string
): boolean {
  const line =
    rawLine.trim();
  if (
    !line.startsWith(
      "data:"
    )
  ) {
    return false;
  }
  const data =
    line.slice(5).trim();
  if (
    data === "[DONE]"
  ) {
    return true;
  }
  if (!data) {
    return false;
  }
  try {
    const payload =
      JSON.parse(data) as {
        choices?: Array<{
          finish_reason?: unknown;
        }>;
      };
    return payload.choices?.some(
      (choice) =>
        typeof choice
          .finish_reason ===
          "string" &&
        choice.finish_reason
          .trim().length > 0
    ) === true;
  } catch {
    return false;
  }
}

export function parseLocalSseErrorLine(
  rawLine: string
): string | null {
  const line =
    rawLine.trim();
  const prefix =
    line.startsWith(
      "error:"
    )
      ? "error:"
      : line.startsWith(
          "data:"
        )
        ? "data:"
        : null;
  if (!prefix) {
    return null;
  }
  const raw =
    line.slice(
      prefix.length
    ).trim();
  if (
    !raw ||
    raw === "[DONE]"
  ) {
    return null;
  }
  try {
    const payload =
      JSON.parse(raw) as {
        code?: unknown;
        message?: unknown;
        error?: {
          code?: unknown;
          message?: unknown;
        };
      };
    const error =
      payload.error ??
      (
        prefix ===
          "error:"
          ? payload
          : null
      );
    if (!error) {
      return null;
    }
    const message =
      typeof error.message ===
        "string"
        ? error.message
        : "llama.cpp stream error";
    const code =
      typeof error.code ===
        "number" ||
      typeof error.code ===
        "string"
        ? String(
            error.code
          )
        : "";
    return [
      code,
      message
    ].filter(Boolean)
      .join(":");
  } catch {
    return prefix ===
      "error:"
      ? raw.slice(
          0,
          1200
        )
      : null;
  }
}

export function parseLocalSseLine(
  rawLine: string
): string {
  const line =
    rawLine.trim();
  if (
    !line.startsWith(
      "data:"
    )
  ) {
    return "";
  }
  const data =
    line.slice(5).trim();
  if (
    !data ||
    data === "[DONE]"
  ) {
    return "";
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
  return typeof content ===
    "string"
    ? content
    : "";
}

function timeoutError(
  code: string
): Error {
  return new Error(code);
}

async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  code: string,
  onTimeout?: () => void | Promise<void>
): Promise<T> {
  let timer:
    ReturnType<typeof setTimeout> |
    undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>(
        (_, reject) => {
          timer =
            setTimeout(
              () => {
                reject(
                  timeoutError(
                    code
                  )
                );
                try {
                  void onTimeout?.();
                } catch {
                  // Timeout remains authoritative even if cleanup fails.
                }
              },
              timeoutMs
            );
        }
      )
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

function linkedAbortController(
  external?: AbortSignal
): {
  controller:
    AbortController;
  cleanup:
    () => void;
} {
  const controller =
    new AbortController();
  const onAbort = () =>
    controller.abort(
      external?.reason
    );
  if (external) {
    if (external.aborted) {
      onAbort();
    } else {
      external.addEventListener(
        "abort",
        onAbort,
        { once: true }
      );
    }
  }
  return {
    controller,
    cleanup: () =>
      external?.removeEventListener(
        "abort",
        onAbort
      )
  };
}

async function fetchLocalChatResponse(
  endpoint: string,
  body: ReturnType<
    typeof buildLocalChatRequest
  >,
  abortSignal?: AbortSignal
): Promise<Response> {
  const {
    controller,
    cleanup
  } =
    linkedAbortController(
      abortSignal
    );
  try {
    return await withTimeout(
      fetch(
        `${endpoint.replace(/\/$/, "")}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              body.stream
                ? "text/event-stream"
                : "application/json"
          },
          body: JSON.stringify(
            body
          ),
          signal:
            controller.signal
        }
      ),
      LOCAL_HTTP_RESPONSE_TIMEOUT_MS,
      "LOCAL_MODEL_HTTP_RESPONSE_TIMEOUT",
      () =>
        controller.abort(
          "LOCAL_MODEL_HTTP_RESPONSE_TIMEOUT"
        )
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "LOCAL_MODEL_HTTP_RESPONSE_TIMEOUT"
    ) {
      throw error;
    }
    if (
      abortSignal?.aborted
    ) {
      throw error;
    }
    throw new Error(
      `LOCAL_MODEL_HTTP_NETWORK:${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  } finally {
    cleanup();
  }
}

async function localHttpFailure(
  response: Response
): Promise<never> {
  const detail =
    await response.text()
      .catch(() => "");
  throw new Error(
    `HTTP status ${response.status}: ${detail
      .replace(/[\r\n]+/g, " ")
      .slice(-1200)}`
  );
}

export async function readLocalSse(
  response: Response,
  timeouts?: {
    firstContentMs?: number;
    idleMs?: number;
  }
): Promise<string> {
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

  let terminalSeen =
    false;
  const firstContentDeadline =
    Date.now() +
    Math.max(
      1,
      timeouts?.firstContentMs ??
        LOCAL_FIRST_CONTENT_TIMEOUT_MS
    );
  const idleTimeoutMs =
    Math.max(
      1,
      timeouts?.idleMs ??
        LOCAL_STREAM_IDLE_TIMEOUT_MS
    );

  const consumeLine = (
    rawLine: string
  ) => {
    const streamError =
      parseLocalSseErrorLine(
        rawLine
      );
    if (streamError) {
      throw new Error(
        `LOCAL_MODEL_HTTP_STREAM_ERROR:${streamError}`
      );
    }
    fullText +=
      parseLocalSseLine(
        rawLine
      );
    if (
      isLocalSseTerminalLine(
        rawLine
      )
    ) {
      terminalSeen = true;
    }
  };

  try {
    while (true) {
      const {
        done,
        value
      } =
        await withTimeout(
          reader.read(),
          fullText.trim()
            ? idleTimeoutMs
            : Math.max(
                1,
                firstContentDeadline -
                  Date.now()
              ),
          fullText.trim()
            ? "LOCAL_MODEL_SSE_IDLE_TIMEOUT"
            : "LOCAL_MODEL_SSE_FIRST_CONTENT_TIMEOUT",
          () =>
            reader.cancel()
        );
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
        consumeLine(
          buffer.slice(
            0,
            newline
          )
        );
        buffer =
          buffer.slice(
            newline + 1
          );
        newline =
          buffer.indexOf("\n");
        if (
          terminalSeen
        ) {
          break;
        }
      }

      if (
        terminalSeen
      ) {
        try {
          await reader.cancel();
        } catch {
          // The server may already have closed the stream. The terminal
          // SSE frame is authoritative and the generated text is complete.
        }
        break;
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
  } catch (error) {
    if (
      error instanceof Error &&
      error.name ===
        "AbortError"
    ) {
      throw error;
    }
    throw new Error(
      `LOCAL_MODEL_SSE_READ_FAILED:${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  }

  if (!fullText.trim()) {
    throw new Error(
      "LOCAL_MODEL_HTTP_EMPTY_RESPONSE"
    );
  }
  return fullText;
}

async function readLocalJson(
  response: Response
): Promise<string> {
  let payload: {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
    error?: {
      message?: unknown;
    };
  };
  try {
    const raw =
      await withTimeout(
        response.text(),
        LOCAL_JSON_BODY_TIMEOUT_MS,
        "LOCAL_MODEL_JSON_BODY_TIMEOUT",
        () =>
          response.body?.cancel()
      );
    payload =
      JSON.parse(raw) as
        typeof payload;
  } catch (error) {
    throw new Error(
      `LOCAL_MODEL_HTTP_INVALID_JSON:${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  }

  if (payload.error) {
    throw new Error(
      `LOCAL_MODEL_HTTP_RESPONSE_ERROR:${
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
      ?.message?.content;
  if (
    typeof content !==
      "string" ||
    !content.trim()
  ) {
    throw new Error(
      "LOCAL_MODEL_HTTP_EMPTY_RESPONSE"
    );
  }
  return content;
}

async function directLocalJsonCompletion(
  endpoint: string,
  modelId: string,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"],
  maxOutputTokens: number,
  abortSignal?: AbortSignal
): Promise<ProviderStreamResult> {
  const response =
    await fetchLocalChatResponse(
      endpoint,
      buildLocalChatRequest(
        modelId,
        systemPrompt,
        messages,
        Math.max(
          16,
          Math.min(
            1_024,
            maxOutputTokens
          )
        ),
        false
      ),
      abortSignal
    );
  if (!response.ok) {
    await localHttpFailure(
      response
    );
  }
  return {
    fullText:
      await readLocalJson(
        response
      )
  };
}

async function exactLocalInputTokens(
  endpoint: string,
  body: ReturnType<
    typeof buildLocalChatRequest
  >,
  abortSignal?: AbortSignal
): Promise<number | null> {
  const {
    controller,
    cleanup
  } =
    linkedAbortController(
      abortSignal
    );
  try {
    const response =
      await withTimeout(
        fetch(
          `${endpoint.replace(/\/$/, "")}/chat/completions/input_tokens`,
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json"
            },
            body:
              JSON.stringify({
                model:
                  body.model,
                messages:
                  body.messages
              }),
            signal:
              controller.signal
          }
        ),
        30_000,
        "LOCAL_MODEL_TOKEN_COUNT_TIMEOUT",
        () =>
          controller.abort(
            "LOCAL_MODEL_TOKEN_COUNT_TIMEOUT"
          )
      );
    if (
      response.status ===
        404
    ) {
      return null;
    }
    if (!response.ok) {
      const detail =
        await response
          .text()
          .catch(
            () => ""
          );
      throw new Error(
        `LOCAL_MODEL_TOKEN_COUNT_FAILED:HTTP_${response.status}:${detail
          .replace(/[\r\n]+/g, " ")
          .slice(-800)}`
      );
    }
    const payload =
      await response.json() as {
        input_tokens?:
          unknown;
      };
    return typeof payload
      .input_tokens ===
        "number" &&
      Number.isInteger(
        payload.input_tokens
      ) &&
      payload.input_tokens >=
        0
      ? payload.input_tokens
      : null;
  } catch (error) {
    if (
      abortSignal?.aborted
    ) {
      throw error;
    }

    // Exact token counting is a guardrail optimization, not a prerequisite
    // for inference. Some llama.cpp builds or chat templates can reject or
    // time out on the auxiliary input_tokens request even though the actual
    // chat completion endpoint is healthy. Fall back to the conservative
    // localChatBudget estimate and attempt the real generation.
    return null;
  } finally {
    cleanup();
  }
}

async function streamLocalChatCompletion(
  endpoint: string,
  modelId: string,
  systemPrompt: string,
  messages: ProviderStreamParams["messages"],
  contextTokens: number,
  conservativeCharsPerToken: number,
  abortSignal?: AbortSignal
): Promise<ProviderStreamResult> {
  const budget =
    localChatBudget(
      contextTokens,
      systemPrompt,
      messages,
      conservativeCharsPerToken
    );
  const countBody =
    buildLocalChatRequest(
      modelId,
      systemPrompt,
      messages,
      budget.maxOutputTokens,
      false
    );
  const exactPromptTokens =
    await exactLocalInputTokens(
      endpoint,
      countBody,
      abortSignal
    );
  const exactAvailable =
    exactPromptTokens ===
      null
      ? null
      : contextTokens -
        exactPromptTokens -
        LOCAL_CONTEXT_SAFETY_TOKENS;
  if (
    exactAvailable !== null &&
    exactAvailable < 64
  ) {
    throw new Error(
      `LOCAL_MODEL_CONTEXT_OVERFLOW:context=${contextTokens}:exact_prompt=${exactPromptTokens}:prompt_chars=${budget.promptChars}`
    );
  }
  const maxOutputTokens =
    exactAvailable === null
      ? budget.maxOutputTokens
      : Math.max(
          64,
          Math.min(
            budget.maxOutputTokens,
            exactAvailable
          )
        );
  const streamingBody =
    buildLocalChatRequest(
      modelId,
      systemPrompt,
      messages,
      maxOutputTokens,
      true
    );
  const response =
    await fetchLocalChatResponse(
      endpoint,
      streamingBody,
      abortSignal
    );
  if (!response.ok) {
    await localHttpFailure(
      response
    );
  }

  try {
    return {
      fullText:
        await readLocalSse(
          response
        )
    };
  } catch (streamError) {
    if (
      streamError instanceof
        Error &&
      streamError.name ===
        "AbortError"
    ) {
      throw streamError;
    }

    const streamDetail =
      streamError instanceof Error
        ? streamError.message
        : String(streamError);
    if (
      /LOCAL_MODEL_SSE_(?:FIRST_CONTENT|IDLE)_TIMEOUT/.test(
        streamDetail
      )
    ) {
      // A timeout on CPU may mean the model is still evaluating a large
      // prompt. Starting a second full generation would compete for the same
      // RAM/CPU and make recovery less likely, so surface the timeout directly.
      throw streamError;
    }

    // llama.cpp can successfully serve the same request in JSON mode even
    // when a platform-specific SSE/undici stream is interrupted. Local
    // inference has no external side effect, so one controlled retry is safe.
    const fallback =
      await fetchLocalChatResponse(
        endpoint,
        buildLocalChatRequest(
          modelId,
          systemPrompt,
          messages,
          maxOutputTokens,
          false
        ),
        abortSignal
      );
    if (!fallback.ok) {
      await localHttpFailure(
        fallback
      );
    }

    try {
      return {
        fullText:
          await readLocalJson(
            fallback
          )
      };
    } catch (fallbackError) {
      const first =
        streamError instanceof Error
          ? streamError.message
          : String(streamError);
      const second =
        fallbackError instanceof Error
          ? fallbackError.message
          : String(
              fallbackError
            );
      throw new Error(
        `LOCAL_MODEL_STREAM_AND_JSON_FAILED:stream=${first}:json=${second}:context=${budget.contextTokens}:estimated_prompt=${budget.estimatedPromptTokens}:prompt_chars=${budget.promptChars}:exact_prompt=${exactPromptTokens ?? "unavailable"}:max_output=${maxOutputTokens}`
      );
    }
  }
}

async function streamLocalModel(
  endpoint: string,
  modelId: string,
  contextTokens: number,
  conservativeCharsPerToken: number,
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
          contextTokens,
          conservativeCharsPerToken,
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

export function accountSessionBackendAllowed(
  _id: ProviderId
): boolean {
  return true;
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

export function shouldRetryLocalAtMinimumContext(
  error: unknown,
  currentContextTokens: number,
  minimumContextTokens: number
): boolean {
  if (
    currentContextTokens <=
      minimumContextTokens
  ) {
    return false;
  }
  const detail =
    error instanceof Error
      ? error.message
      : String(error);
  return /LOCAL_MODEL_(?:RESPONSE|HTTP_RESPONSE|SSE_FIRST_CONTENT|SSE_IDLE|JSON_BODY)_TIMEOUT/.test(
    detail
  );
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
      if (
        !accountSessionBackendAllowed(
          this.id
        )
      ) {
        throw new Error(
          "ACCOUNT_SESSION_PROVIDER_POLICY_UNSUPPORTED:anthropic"
        );
      }
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
      const localStatus =
        this.localModels
          .status();
      const contextTokens =
        localStatus
          .configuredContextTokens ??
        configuredModel.contextWindow;
      const conservativeCharsPerToken =
        localStatus
          .qualification
          ?.tokenizerCalibration
          ?.conservativeCharsPerToken ??
        2;
      const localParams = {
        ...params,
        model:
          configuredModel.id,
        reasoning: "none" as const
      };

      if (
        params.localTransport ===
          "json"
      ) {
        try {
          const direct =
            await directLocalJsonCompletion(
              localStatus.endpoint,
              configuredModel.id,
              params.systemPrompt,
              params.messages,
              params.localMaxOutputTokens ??
                128,
              params.abortSignal
            );
          params.callbacks
            ?.onContentDelta?.(
              direct.fullText
            );
          return direct;
        } catch (error) {
          const detail =
            error instanceof Error
              ? error.message
              : String(error);
          throw new Error(
            `${classifyLocalInferenceFailure(
              detail
            )}:${detail
              .replace(/[\r\n]+/g, " ")
              .slice(-800)}`
          );
        }
      }

      try {
        return await streamLocalModel(
          localStatus.endpoint,
          configuredModel.id,
          contextTokens,
          conservativeCharsPerToken,
          localParams
        );
      } catch (error) {
        const minimumContextTokens =
          configuredModel
            .minimumContextWindow;
        if (
          !shouldRetryLocalAtMinimumContext(
            error,
            contextTokens,
            minimumContextTokens
          )
        ) {
          throw error;
        }

        await this.localModels
          .reconfigureContext(
            configuredModel.id,
            minimumContextTokens
          );
        const recoveredModel =
          await this.localModels
            .ensureRunning(
              configuredModel.id
            );
        const recoveredStatus =
          this.localModels
            .status();
        const recoveredContextTokens =
          recoveredStatus
            .configuredContextTokens ??
          recoveredModel
            .contextWindow;
        const recoveredCharsPerToken =
          recoveredStatus
            .qualification
            ?.tokenizerCalibration
            ?.conservativeCharsPerToken ??
          conservativeCharsPerToken;

        return await streamLocalModel(
          recoveredStatus.endpoint,
          recoveredModel.id,
          recoveredContextTokens,
          recoveredCharsPerToken,
          {
            ...localParams,
            model:
              recoveredModel.id
          }
        );
      }
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

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
      const configuredModel = await this.localModels.ensureRunning(params.model);
      const { createOpenAI } = await import("@ai-sdk/openai");
      const local = createOpenAI({
        apiKey: "lex-machina-local-only",
        baseURL: this.localModels.status().endpoint
      });
      return streamModel(
        local.chat(configuredModel.id),
        {
          ...params,
          model: configuredModel.id,
          reasoning: "none"
        },
        "Local llama.cpp"
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

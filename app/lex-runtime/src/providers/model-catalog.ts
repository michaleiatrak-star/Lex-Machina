import type { LocalModelRuntime } from "../local-model-runtime.js";
import { LocalModelRuntime as DefaultLocalModelRuntime } from "../local-model-runtime.js";
import {
  MissingProviderCredentialError,
  type ProviderCredentialResolver
} from "./credentials.js";
import type { ProviderId } from "./types.js";

export type ModelDescriptor = {
  provider: ProviderId;
  id: string;
  displayName: string;
  selectable: boolean;
  compatibilityReason?: string;
  createdAt?: string;
  ownedBy?: string;
  contextWindow?: number;
  nativeContextWindow?: number;
  contextMode?:
    | "NATIVE_OR_REDUCED"
    | "YARN_EXTENDED";
  inputModalities?: string[];
  outputModalities?: string[];
  capabilities?: string[];
};

export type FetchLike = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function strings(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const result = value.filter(
    (item): item is string => typeof item === "string"
  );
  return result.length > 0 ? result : undefined;
}

function unixDate(value: unknown): string | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value * 1000).toISOString()
    : undefined;
}

function capabilityNames(value: unknown): string[] | undefined {
  const obj = record(value);
  if (!obj) return undefined;
  const supported = Object.entries(obj)
    .filter(([, details]) => record(details)?.supported === true)
    .map(([name]) => name);
  return supported.length > 0 ? supported : undefined;
}

function openAiCompatibility(id: string): {
  selectable: boolean;
  reason?: string;
} {
  const lower = id.toLowerCase();
  const blockedPrefixes = [
    "gpt-image",
    "chatgpt-image",
    "gpt-realtime",
    "gpt-live",
    "gpt-audio",
    "gpt-transcribe",
    "omni-moderation",
    "text-moderation",
    "text-embedding",
    "sora",
    "tts-",
    "whisper-"
  ];

  if (blockedPrefixes.some((prefix) => lower.startsWith(prefix))) {
    return {
      selectable: false,
      reason: "non-text-chat model family"
    };
  }

  if (
    lower.startsWith("gpt-") ||
    /^o\d/.test(lower) ||
    lower.startsWith("ft:gpt-") ||
    lower.startsWith("ft:o")
  ) {
    return { selectable: true };
  }

  return {
    selectable: false,
    reason: "unclassified OpenAI model; advanced/manual enablement required"
  };
}

async function parseJson(response: Response, provider: ProviderId): Promise<unknown> {
  if (!response.ok) {
    throw new Error(
      `Model catalog request failed for ${provider}: HTTP ${response.status}`
    );
  }
  return response.json() as Promise<unknown>;
}

export class DynamicModelCatalog {
  constructor(
    private readonly credentials: ProviderCredentialResolver,
    private readonly fetcher: FetchLike = globalThis.fetch.bind(globalThis),
    private readonly localModels: LocalModelRuntime = new DefaultLocalModelRuntime()
  ) {}

  localContextWindow(
    modelId: string
  ): number | undefined {
    const runtime =
      this.localModels.status();
    if (
      !runtime.configured ||
      runtime.selectedModelId !==
        modelId
    ) {
      return undefined;
    }
    const selected =
      this.localModels
        .listModels()
        .find(
          (model) =>
            model.id === modelId &&
            model.installed
        );
    if (!selected) {
      return undefined;
    }
    const value =
      selected.configuredContextWindow ??
      selected.contextWindow;
    return Number.isInteger(value) &&
      value >= 8_192 &&
      value <= 262_144
      ? value
      : undefined;
  }

  async list(provider: ProviderId): Promise<ModelDescriptor[]> {
    if (provider === "openai") {
      const local = this.listConfiguredLocalOpenAiModels();
      const key = await this.credentials.getApiKey(provider);
      if (!key) {
        if (local.length > 0) return local;
        throw new MissingProviderCredentialError(provider);
      }
      return [
        ...local,
        ...await this.listOpenAI(key)
      ];
    }

    const key = await this.credentials.getApiKey(provider);
    if (!key) throw new MissingProviderCredentialError(provider);
    if (provider === "anthropic") {
      return this.listAnthropic(key);
    }
    return this.listXai(key);
  }

  private listConfiguredLocalOpenAiModels(): ModelDescriptor[] {
    const runtime = this.localModels.status();
    if (!runtime.configured || !runtime.selectedModelId) return [];
    const selected = this.localModels
      .listModels()
      .find((model) => model.id === runtime.selectedModelId);
    if (!selected || !selected.installed) return [];
    return [{
      provider: "openai",
      id: selected.id,
      displayName: `Lokalny · ${selected.displayName}`,
      selectable: true,
      contextWindow:
        selected.configuredContextWindow ??
        selected.contextWindow,
      nativeContextWindow:
        selected.nativeContextWindow,
      contextMode:
        selected.contextMode,
      ownedBy: "local",
      inputModalities: ["text"],
      outputModalities: ["text"],
      capabilities: [
        "local-only",
        "offline-inference",
        selected.contextMode === "YARN_EXTENDED"
          ? "yarn-context-extension"
          : "native-context"
      ]
    }];
  }

  private async listOpenAI(apiKey: string): Promise<ModelDescriptor[]> {
    const response = await this.fetcher("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });
    const payload = record(await parseJson(response, "openai"));
    const data = Array.isArray(payload?.data) ? payload.data : [];

    return data.flatMap((item): ModelDescriptor[] => {
      const model = record(item);
      const id = typeof model?.id === "string" ? model.id : "";
      if (!id) return [];
      const compatibility = openAiCompatibility(id);
      return [{
        provider: "openai",
        id,
        displayName: id,
        selectable: compatibility.selectable,
        ...(compatibility.reason
          ? { compatibilityReason: compatibility.reason }
          : {}),
        ...(unixDate(model?.created)
          ? { createdAt: unixDate(model?.created)! }
          : {}),
        ...(typeof model?.owned_by === "string"
          ? { ownedBy: model.owned_by }
          : {})
      }];
    });
  }

  private async listAnthropic(apiKey: string): Promise<ModelDescriptor[]> {
    const models: ModelDescriptor[] = [];
    let afterId: string | null = null;

    for (let page = 0; page < 20; page += 1) {
      const url = new URL("https://api.anthropic.com/v1/models");
      url.searchParams.set("limit", "1000");
      if (afterId) url.searchParams.set("after_id", afterId);

      const response = await this.fetcher(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          Accept: "application/json"
        }
      });
      const payload = record(await parseJson(response, "anthropic"));
      const data = Array.isArray(payload?.data) ? payload.data : [];

      for (const item of data) {
        const model = record(item);
        const id = typeof model?.id === "string" ? model.id : "";
        if (!id) continue;
        const displayName =
          typeof model?.display_name === "string"
            ? model.display_name
            : id;
        const caps = capabilityNames(model?.capabilities);
        models.push({
          provider: "anthropic",
          id,
          displayName,
          selectable: true,
          ...(typeof model?.created_at === "string"
            ? { createdAt: model.created_at }
            : {}),
          ...(caps ? { capabilities: caps } : {})
        });
      }

      if (payload?.has_more !== true) break;
      afterId =
        typeof payload?.last_id === "string" && payload.last_id
          ? payload.last_id
          : null;
      if (!afterId) break;
    }

    return models;
  }

  private async listXai(apiKey: string): Promise<ModelDescriptor[]> {
    const response = await this.fetcher(
      "https://api.x.ai/v1/language-models",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json"
        }
      }
    );
    const payload = record(await parseJson(response, "xai"));
    const data = Array.isArray(payload?.models)
      ? payload.models
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    return data.flatMap((item): ModelDescriptor[] => {
      const model = record(item);
      const id =
        typeof model?.id === "string"
          ? model.id
          : typeof model?.name === "string"
            ? model.name
            : "";
      if (!id) return [];
      const contextWindow =
        typeof model?.max_prompt_length === "number"
          ? model.max_prompt_length
          : typeof model?.context_length === "number"
            ? model.context_length
            : undefined;
      const input = strings(model?.input_modalities);
      const output = strings(model?.output_modalities);

      return [{
        provider: "xai",
        id,
        displayName: id,
        selectable: true,
        ...(typeof model?.owned_by === "string"
          ? { ownedBy: model.owned_by }
          : {}),
        ...(contextWindow !== undefined
          ? { contextWindow }
          : {}),
        ...(input ? { inputModalities: input } : {}),
        ...(output ? { outputModalities: output } : {})
      }];
    });
  }
}

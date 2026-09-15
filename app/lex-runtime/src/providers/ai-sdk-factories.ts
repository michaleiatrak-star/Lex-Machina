import type { LanguageModel } from "ai";
import type { ProviderId } from "./types.js";

export type AiSdkModelFactory = {
  id: ProviderId;
  label: string;
  apiKeyEnvironment: "OPENAI_API_KEY" | "ANTHROPIC_API_KEY" | "XAI_API_KEY";
  packageName:
    | "@ai-sdk/openai"
    | "@ai-sdk/anthropic"
    | "@ai-sdk/xai";
  createModel(args: {
    apiKey: string;
    model: string;
  }): Promise<LanguageModel>;
};

export const AI_SDK_MODEL_FACTORIES: Record<
  ProviderId,
  AiSdkModelFactory
> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    apiKeyEnvironment: "OPENAI_API_KEY",
    packageName: "@ai-sdk/openai",
    async createModel({ apiKey, model }) {
      const { createOpenAI } = await import("@ai-sdk/openai");
      const openai = createOpenAI({ apiKey });
      return openai.responses(model);
    }
  },

  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    apiKeyEnvironment: "ANTHROPIC_API_KEY",
    packageName: "@ai-sdk/anthropic",
    async createModel({ apiKey, model }) {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      const anthropic = createAnthropic({ apiKey });
      return anthropic(model);
    }
  },

  xai: {
    id: "xai",
    label: "xAI",
    apiKeyEnvironment: "XAI_API_KEY",
    packageName: "@ai-sdk/xai",
    async createModel({ apiKey, model }) {
      const { createXai } = await import("@ai-sdk/xai");
      const xai = createXai({ apiKey });
      return xai(model);
    }
  }
};

export async function smokeTestAiSdkFactories(): Promise<
  Array<{
    provider: ProviderId;
    packageName: string;
    pass: boolean;
    error?: string;
  }>
> {
  const modelIds: Record<ProviderId, string> = {
    openai: "gpt-test",
    anthropic: "claude-test",
    xai: "grok-test"
  };

  const results = [];
  for (const id of ["openai", "anthropic", "xai"] as const) {
    const factory = AI_SDK_MODEL_FACTORIES[id];
    try {
      const model = await factory.createModel({
        apiKey: "test-key-no-network-call",
        model: modelIds[id]
      });
      results.push({
        provider: id,
        packageName: factory.packageName,
        pass: Boolean(model)
      });
    } catch (error) {
      results.push({
        provider: id,
        packageName: factory.packageName,
        pass: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return results;
}

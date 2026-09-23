export const AI_SDK_MODEL_FACTORIES = {
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
export async function smokeTestAiSdkFactories() {
    const modelIds = {
        openai: "gpt-test",
        anthropic: "claude-test",
        xai: "grok-test"
    };
    const results = [];
    for (const id of ["openai", "anthropic", "xai"]) {
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
        }
        catch (error) {
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

import { ProviderGateway, ProviderRegistry } from "./gateway.js";
const ECHO_TOOL = {
    type: "function",
    function: {
        name: "echo_test",
        description: "Return the provided value.",
        parameters: {
            type: "object",
            properties: {
                value: { type: "string" }
            },
            required: ["value"],
            additionalProperties: false
        }
    }
};
export async function runProviderConformance(adapter) {
    const registry = new ProviderRegistry();
    registry.register(adapter);
    const gateway = new ProviderGateway(registry);
    const cases = [];
    const contentChunks = [];
    const reasoningChunks = [];
    const basic = await gateway.stream(adapter.id, {
        model: "conformance-model",
        systemPrompt: "System",
        messages: [{ role: "user", content: "ping" }],
        callbacks: {
            onContentDelta: (text) => contentChunks.push(text),
            onReasoningDelta: (text) => reasoningChunks.push(text)
        }
    });
    cases.push({
        id: "streaming-content",
        pass: basic.fullText === contentChunks.join("") &&
            basic.fullText.length > 0
    });
    cases.push({
        id: "reasoning-callback",
        pass: !adapter.capabilities.reasoning ||
            reasoningChunks.join("").length > 0
    });
    const observedCalls = [];
    const toolParams = {
        model: "conformance-model",
        systemPrompt: "System",
        messages: [{ role: "user", content: "Use echo." }],
        tools: [ECHO_TOOL],
        callbacks: {
            onToolCallStart: (call) => observedCalls.push(call)
        },
        runTools: async (calls) => calls.map((call) => ({
            tool_use_id: call.id,
            content: String(call.input.value ?? "")
        }))
    };
    if (adapter.capabilities.tools) {
        const toolResult = await gateway.stream(adapter.id, toolParams);
        cases.push({
            id: "normalized-tool-call",
            pass: observedCalls.length === 1 &&
                observedCalls[0]?.name === "echo_test" &&
                observedCalls[0]?.input.value === "abc"
        });
        cases.push({
            id: "tool-result-roundtrip",
            pass: toolResult.fullText === "tool-result:abc"
        });
    }
    else {
        let code;
        try {
            await gateway.stream(adapter.id, toolParams);
        }
        catch (error) {
            code =
                typeof error === "object" &&
                    error !== null &&
                    "code" in error &&
                    typeof error.code === "string"
                    ? error.code
                    : undefined;
        }
        cases.push({
            id: "tools-fail-closed",
            pass: code === "TOOLS_UNSUPPORTED"
        });
    }
    const models = adapter.listModels
        ? await adapter.listModels()
        : [];
    cases.push({
        id: "model-discovery-contract",
        pass: !adapter.capabilities.modelDiscovery ||
            models.length > 0
    });
    return {
        provider: adapter.id,
        cases,
        pass: cases.every((entry) => entry.pass)
    };
}

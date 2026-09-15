import type {
  NormalizedToolCall,
  ProviderAdapter,
  ProviderCapabilities,
  ProviderId,
  ProviderStreamParams,
  ProviderStreamResult
} from "./types.js";

export type ScriptedProviderOptions = {
  id: ProviderId;
  label?: string;
  capabilities?: Partial<ProviderCapabilities>;
};

const DEFAULT_CAPABILITIES: ProviderCapabilities = {
  streaming: true,
  tools: true,
  reasoning: true,
  modelDiscovery: true
};

export class ScriptedProviderAdapter implements ProviderAdapter {
  readonly id: ProviderId;
  readonly label: string;
  readonly capabilities: ProviderCapabilities;

  constructor(options: ScriptedProviderOptions) {
    this.id = options.id;
    this.label = options.label ?? options.id;
    this.capabilities = {
      ...DEFAULT_CAPABILITIES,
      ...options.capabilities
    };
  }

  async listModels(): Promise<string[]> {
    return [`${this.id}/conformance-model`];
  }

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    params.callbacks?.onReasoningDelta?.("reasoning");
    params.callbacks?.onReasoningBlockEnd?.();

    const requestedTool = params.tools?.[0];
    if (requestedTool) {
      if (!params.runTools) {
        throw new Error("TOOLS_REQUESTED_WITHOUT_RUNNER");
      }

      const call: NormalizedToolCall = {
        id: `${this.id}-tool-1`,
        name: requestedTool.function.name,
        input: { value: "abc" }
      };

      params.callbacks?.onToolCallStart?.(call);
      const results = await params.runTools([call]);
      const result = results.find(
        (candidate) => candidate.tool_use_id === call.id
      );
      if (!result) {
        throw new Error("PROVIDER_TOOL_RESULT_MISSING");
      }

      const text = `tool-result:${result.content}`;
      params.callbacks?.onContentDelta?.(text);
      return { fullText: text };
    }

    const chunks = ["provider:", this.id, ":ok"];
    for (const chunk of chunks) {
      params.callbacks?.onContentDelta?.(chunk);
    }
    return { fullText: chunks.join("") };
  }
}

export type ProviderId = "openai" | "anthropic" | "xai";

export type ReasoningLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max";

export type ProviderCapabilities = {
  streaming: boolean;
  tools: boolean;
  reasoning: boolean;
  modelDiscovery: boolean;
};

export type LlmMessage = {
  role: "user" | "assistant";
  content: string;
};

export type NormalizedToolSchema = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type NormalizedToolCall = {
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type NormalizedToolResult = {
  tool_use_id: string;
  content: string;
};

export type StreamCallbacks = {
  onReasoningDelta?: (text: string) => void;
  onReasoningBlockEnd?: () => void;
  onContentDelta?: (text: string) => void;
  onToolCallStart?: (call: NormalizedToolCall) => void;
};

export type ProviderStreamParams = {
  model: string;
  systemPrompt: string;
  messages: LlmMessage[];
  tools?: NormalizedToolSchema[];
  maxIterations?: number;
  callbacks?: StreamCallbacks;
  runTools?: (
    calls: NormalizedToolCall[]
  ) => Promise<NormalizedToolResult[]>;
  reasoning?: ReasoningLevel;
  abortSignal?: AbortSignal;
};

export type ProviderStreamResult = {
  fullText: string;
};

export interface ProviderAdapter {
  readonly id: ProviderId;
  readonly label: string;
  readonly capabilities: ProviderCapabilities;
  stream(params: ProviderStreamParams): Promise<ProviderStreamResult>;
  listModels?(): Promise<string[]>;
}

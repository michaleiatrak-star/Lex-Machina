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
  continuityKey?: string;
  tools?: NormalizedToolSchema[];
  maxIterations?: number;
  callbacks?: StreamCallbacks;
  runTools?: (
    calls: NormalizedToolCall[]
  ) => Promise<NormalizedToolResult[]>;
  reasoning?: ReasoningLevel;
  /**
   * Internal Lex local-runtime transport preference. Cloud/account adapters
   * ignore this field. "json" intentionally bypasses SSE for tiny local
   * smoke/conversation requests.
   */
  localTransport?: "stream" | "json";
  localMaxOutputTokens?: number;
  abortSignal?: AbortSignal;
  /**
   * Read-only access to the legal skill corpus for a model CLI that can
   * confine its own file tools to one directory (Claude account session):
   * skills and all their subfolders are read natively in one CLI run, and
   * `tools` are served over MCP. Other adapters ignore it.
   */
  nativeCorpus?: NativeCorpusAccess;
};

export type NativeCorpusAccess = {
  root: string;
  // Relative path of every corpus file the model read (audit).
  onRead?: (relativePath: string) => void;
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
  // True when this model reads the skill corpus with its own confined file tools.
  nativeCorpusAccess?(model: string): boolean;
}

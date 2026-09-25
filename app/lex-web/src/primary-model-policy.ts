import type { ProviderId } from "./api.js";

export type AccountPrimaryModelSource =
  | "openai-account"
  | "anthropic-account"
  | "xai-account";

export type PrimaryModelSource =
  | ProviderId
  | AccountPrimaryModelSource
  | "local";

export function isAccountPrimarySource(
  source: PrimaryModelSource
): source is AccountPrimaryModelSource {
  return source.endsWith(
    "-account"
  );
}

export function runtimeProviderForPrimarySource(
  source: PrimaryModelSource
): ProviderId {
  if (source === "local") {
    return "openai";
  }
  if (
    source ===
      "openai-account"
  ) {
    return "openai";
  }
  if (
    source ===
      "anthropic-account"
  ) {
    return "anthropic";
  }
  if (
    source ===
      "xai-account"
  ) {
    return "xai";
  }
  return source;
}

export function accountModelIdForPrimarySource(
  source: PrimaryModelSource
): string | null {
  if (!isAccountPrimarySource(source)) {
    return null;
  }
  return `account/${runtimeProviderForPrimarySource(
    source
  )}/default`;
}

export function shouldLoadPrimaryModelCatalog(
  source: PrimaryModelSource,
  providerConfigured: boolean | undefined
): boolean {
  if (source === "local") {
    return true;
  }
  if (
    isAccountPrimarySource(
      source
    )
  ) {
    return false;
  }
  return providerConfigured === true;
}

export function modelsForPrimarySource<
  T extends { id: string }
>(
  source: PrimaryModelSource,
  models: T[]
): T[] {
  if (
    isAccountPrimarySource(
      source
    )
  ) {
    return [];
  }
  const wantsLocal =
    source === "local";
  return models.filter((model) =>
    wantsLocal
      ? model.id.startsWith("local/")
      : !model.id.startsWith("local/") &&
        !model.id.startsWith("account/")
  );
}

export function canExecutePrimaryModel(
  providerConfigured: boolean | undefined,
  modelId: string,
  accountAuthenticated = false
): boolean {
  if (
    modelId.startsWith(
      "local/"
    )
  ) {
    return true;
  }
  if (
    modelId.startsWith(
      "account/"
    )
  ) {
    return accountAuthenticated;
  }
  return providerConfigured === true;
}

// Account sessions (Claude Code / Codex): "default" leaves the choice to the
// client; the rest are the two newest versions of each main family. Keep in
// sync with ACCOUNT_SESSION_MODELS in the runtime (model-families.ts).
const ACCOUNT_SESSION_MODELS: Partial<Record<ProviderId, Array<{ id: string; label: string }>>> = {
  anthropic: [
    { id: "claude-fable-5-1", label: "Claude Fable 5.1" },
    { id: "claude-fable-5", label: "Claude Fable 5" },
    { id: "claude-opus-5-5", label: "Claude Opus 5.5" },
    { id: "claude-opus-5", label: "Claude Opus 5" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" }
  ],
  openai: [
    { id: "gpt-5.6-luna", label: "GPT-5.6 Luna" },
    { id: "gpt-5.5", label: "GPT-5.5" }
  ]
};

export function accountModelChoices(
  source: PrimaryModelSource,
  defaultLabel: string
): Array<{ id: string; label: string }> {
  const defaultId = accountModelIdForPrimarySource(source);
  if (!defaultId) return [];
  const provider = runtimeProviderForPrimarySource(source);
  return [
    { id: defaultId, label: defaultLabel },
    ...(ACCOUNT_SESSION_MODELS[provider] ?? []).map((item) => ({
      id: `account/${provider}/${item.id}`,
      label: `${item.label} · konto`
    }))
  ];
}

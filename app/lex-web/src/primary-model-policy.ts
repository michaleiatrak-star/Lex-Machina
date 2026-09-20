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

import type { ProviderId } from "./api.js";

export function shouldLoadPrimaryModelCatalog(
  provider: ProviderId,
  providerConfigured: boolean | undefined
): boolean {
  if (providerConfigured === undefined) {
    return false;
  }
  return (
    providerConfigured === true ||
    provider === "openai"
  );
}

export function canExecutePrimaryModel(
  providerConfigured: boolean | undefined,
  modelId: string
): boolean {
  return (
    modelId.startsWith("local/") ||
    providerConfigured === true
  );
}

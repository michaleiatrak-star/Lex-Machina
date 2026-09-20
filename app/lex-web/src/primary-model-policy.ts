import type { ProviderId } from "./api.js";

export type PrimaryModelSource =
  | ProviderId
  | "local";

export function runtimeProviderForPrimarySource(
  source: PrimaryModelSource
): ProviderId {
  return source === "local"
    ? "openai"
    : source;
}

export function shouldLoadPrimaryModelCatalog(
  source: PrimaryModelSource,
  providerConfigured: boolean | undefined
): boolean {
  if (source === "local") {
    return true;
  }
  return providerConfigured === true;
}

export function modelsForPrimarySource<
  T extends { id: string }
>(
  source: PrimaryModelSource,
  models: T[]
): T[] {
  const wantsLocal =
    source === "local";
  return models.filter((model) =>
    wantsLocal
      ? model.id.startsWith("local/")
      : !model.id.startsWith("local/")
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

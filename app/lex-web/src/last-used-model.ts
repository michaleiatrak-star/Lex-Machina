import type { PrimaryModelSource } from "./primary-model-policy.js";

/**
 * The model the user last worked with, per user, in the app's local storage.
 * It only preselects the source and model on the next start; it holds no
 * secrets. Storage may be unavailable (private window): then nothing is kept.
 */

export type LastUsedModel = {
  provider: PrimaryModelSource;
  model: string;
};

const SOURCES: ReadonlySet<string> = new Set([
  "local",
  "openai",
  "anthropic",
  "xai",
  "openai-account",
  "anthropic-account",
  "xai-account"
]);

function storageKey(userId: string): string {
  return `lex.lastUsedModel.${userId}`;
}

export function parseLastUsedModel(raw: string | null): LastUsedModel | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<LastUsedModel>;
    if (
      typeof value.provider === "string" &&
      SOURCES.has(value.provider) &&
      typeof value.model === "string" &&
      value.model.length > 0 &&
      value.model.length <= 200
    ) {
      return { provider: value.provider as PrimaryModelSource, model: value.model };
    }
  } catch {
    // Damaged entry: treat as absent.
  }
  return null;
}

export function loadLastUsedModel(userId: string): LastUsedModel | null {
  try {
    return parseLastUsedModel(window.localStorage.getItem(storageKey(userId)));
  } catch {
    return null;
  }
}

export function saveLastUsedModel(userId: string, value: LastUsedModel): void {
  if (!value.model) return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(value));
  } catch {
    // Storage unavailable: the choice is simply not remembered.
  }
}

/** Start the local model on entry only when the remembered one is local. */
export function shouldAutoStartLocalModel(args: {
  remembered: LastUsedModel | null;
  provider: PrimaryModelSource;
  model: string;
  runtimeState: string | undefined;
  activeModelId: string | null | undefined;
}): boolean {
  return (
    args.remembered?.provider === "local" &&
    args.provider === "local" &&
    args.model === args.remembered.model &&
    args.model.startsWith("local/") &&
    args.runtimeState !== undefined &&
    args.runtimeState !== "STARTING" &&
    args.runtimeState !== "PROVISIONING" &&
    !(args.runtimeState === "READY" && args.activeModelId === args.model)
  );
}

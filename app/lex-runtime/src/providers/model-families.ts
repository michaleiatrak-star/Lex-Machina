import type { ModelDescriptor } from "./model-catalog.js";
import type { ProviderId } from "./types.js";

/**
 * Model choice for legal work: the two newest versions of each main model
 * family. Small tiers (Haiku, mini, nano) and specialised variants (audio,
 * search, codex, realtime...) are not offered for legal analysis.
 */

export const VERSIONS_PER_FAMILY = 2;

type Parsed = {
  family: string;
  version: number[];
};

const SMALL_TIER = /(?:^|[-.])(?:haiku|mini|nano|lite|small)(?:[-.]|$)/i;

// "claude-opus-5-5", "claude-sonnet-4-6-20260101", "claude-fable-5-1"
function parseAnthropic(id: string): Parsed | null {
  const match =
    /^claude-(opus|sonnet|fable)-(\d+(?:-\d{1,2})*)(?:-\d{8})?$/i.exec(id);
  if (!match) return null;
  return {
    family: match[1]!.toLowerCase(),
    version: match[2]!.split("-").map(Number)
  };
}

// "gpt-5.5", "gpt-5.6-luna", "gpt-5-2025-08-07"; the main line only.
function parseOpenAi(id: string): Parsed | null {
  const match =
    /^gpt-(\d+(?:\.\d+)?)(?:-(luna))?(?:-\d{4}-\d{2}-\d{2})?$/i.exec(id);
  if (!match) return null;
  return {
    family: "gpt",
    version: match[1]!.split(".").map(Number)
  };
}

// "grok-4", "grok-4.1", "grok-4-0709"
function parseXai(id: string): Parsed | null {
  const match =
    /^grok-(\d+(?:\.\d+)?)(?:-\d{4})?$/i.exec(id);
  if (!match) return null;
  return {
    family: "grok",
    version: match[1]!.split(".").map(Number)
  };
}

export function parseModelFamily(
  provider: ProviderId,
  id: string
): Parsed | null {
  if (SMALL_TIER.test(id)) return null;
  if (provider === "anthropic") return parseAnthropic(id);
  if (provider === "openai") return parseOpenAi(id);
  return parseXai(id);
}

function compareVersions(a: number[], b: number[]): number {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const diff = (a[index] ?? 0) - (b[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Keeps the newest VERSIONS_PER_FAMILY versions of each family; snapshots of
 * one version collapse to the newest listed one. Local models are kept as
 * they are.
 */
export function newestModelFamilies(
  models: ModelDescriptor[],
  perFamily = VERSIONS_PER_FAMILY
): ModelDescriptor[] {
  const local = models.filter((model) => model.id.startsWith("local/"));
  const byVersion = new Map<string, { parsed: Parsed; model: ModelDescriptor }>();
  for (const model of models) {
    if (model.id.startsWith("local/") || !model.selectable) continue;
    const parsed = parseModelFamily(model.provider, model.id);
    if (!parsed) continue;
    const key = `${model.provider}:${parsed.family}:${parsed.version.join(".")}`;
    const current = byVersion.get(key);
    // Prefer the undated alias; otherwise the most recent snapshot.
    const undated = !/\d{4}-?\d{2}-?\d{2}$/.test(model.id);
    const currentUndated = current ? !/\d{4}-?\d{2}-?\d{2}$/.test(current.model.id) : false;
    if (
      !current ||
      (undated && !currentUndated) ||
      (undated === currentUndated && (model.createdAt ?? "") > (current.model.createdAt ?? ""))
    ) {
      byVersion.set(key, { parsed, model });
    }
  }
  const families = new Map<string, Array<{ parsed: Parsed; model: ModelDescriptor }>>();
  for (const entry of byVersion.values()) {
    const key = `${entry.model.provider}:${entry.parsed.family}`;
    families.set(key, [...(families.get(key) ?? []), entry]);
  }
  const chosen = [...families.values()].flatMap((entries) =>
    entries
      .sort((a, b) => compareVersions(b.parsed.version, a.parsed.version))
      .slice(0, perFamily)
  );
  const familyOrder = ["fable", "opus", "sonnet", "gpt", "grok"];
  chosen.sort(
    (a, b) =>
      familyOrder.indexOf(a.parsed.family) - familyOrder.indexOf(b.parsed.family) ||
      compareVersions(b.parsed.version, a.parsed.version)
  );
  return [...local, ...chosen.map((entry) => entry.model)];
}

/**
 * Models for the account sessions (Claude Code / Codex CLI). "default" leaves
 * the choice to the client. IDs verified against the provider documentation
 * on 2026-09-25; update together with the pinned clients.
 */
export const ACCOUNT_SESSION_MODELS: Partial<Record<ProviderId, Array<{ id: string; label: string }>>> = {
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

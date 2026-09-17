import type { LexSkillRegistry } from "./registry.js";

export const SKILL_SELECTION_ENVELOPE_PREFIX = "__LEX_SKILLS_V1__";
export const MANDATORY_SESSION_SKILLS = [
  "prawny-router-v3",
  "shared",
  "prawo-polskie-v2"
] as const;

const STOP_WORDS = new Set([
  "albo", "bez", "byc", "czy", "dla", "gdzie", "jest", "jako",
  "ktora", "ktore", "ktory", "mam", "oraz", "przez", "sie", "tego", "ten",
  "tym", "wobec", "zeby", "and", "for", "from", "into", "that", "the",
  "this", "with"
]);

export type SkillSelectionEnvelope = {
  query: string;
  automatic: boolean;
  manualSkills: string[];
};

export type ResolvedSkillSelection = {
  additionalSkills: string[];
  loadedSkills: string[];
};

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(value: string): Set<string> {
  return new Set(
    normalize(value)
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 3 && !STOP_WORDS.has(item))
  );
}

function safeManualSkillNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => /^[a-z0-9][a-z0-9._-]{1,159}$/i.test(item))
    )
  ].slice(0, 16);
}

export function parseSkillSelectionEnvelope(rawQuery: string): SkillSelectionEnvelope {
  const firstBreak = rawQuery.indexOf("\n");
  if (firstBreak < 0) {
    return {
      query: rawQuery,
      automatic: true,
      manualSkills: []
    };
  }

  const firstLine = rawQuery.slice(0, firstBreak).trim();
  if (!firstLine.startsWith(SKILL_SELECTION_ENVELOPE_PREFIX)) {
    return {
      query: rawQuery,
      automatic: true,
      manualSkills: []
    };
  }

  const encoded = firstLine.slice(SKILL_SELECTION_ENVELOPE_PREFIX.length).trim();
  try {
    const parsed = JSON.parse(encoded) as Record<string, unknown>;
    return {
      query: rawQuery.slice(firstBreak + 1).trimStart(),
      automatic: parsed.auto !== false,
      manualSkills: safeManualSkillNames(parsed.manual)
    };
  } catch {
    return {
      query: rawQuery,
      automatic: true,
      manualSkills: []
    };
  }
}

function scoreSkill(
  queryTokens: Set<string>,
  name: string,
  description: string
): number {
  const nameTokens = tokens(name.replace(/^dr-\d{2}-/, ""));
  const descriptionTokens = tokens(description);
  let score = 0;

  for (const token of queryTokens) {
    if (nameTokens.has(token)) score += 8;
    if (descriptionTokens.has(token)) score += 2;
  }

  return score;
}

export function resolveAdditionalSkills(
  registry: LexSkillRegistry,
  query: string,
  primarySkill: string,
  automatic: boolean,
  manualSkills: readonly string[]
): ResolvedSkillSelection {
  const core = new Set<string>([
    "prawny-router-v3",
    "prawo-polskie-v2",
    primarySkill
  ]);

  const manual = [
    ...new Set(manualSkills)
  ].filter((name) =>
    !core.has(name) &&
    name !== "shared" &&
    Boolean(registry.get(name))
  );

  const selected = new Set<string>(manual);

  if (automatic) {
    const queryTokens = tokens(query);
    const ranked = [...registry.skills.values()]
      .filter((skill) => !core.has(skill.name) && skill.name !== "shared")
      .map((skill) => ({
        name: skill.name,
        score: scoreSkill(
          queryTokens,
          skill.name,
          typeof skill.frontmatter.description === "string"
            ? skill.frontmatter.description
            : ""
        )
      }))
      .filter((item) => item.score >= 4)
      .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name, "pl"))
      .slice(0, 4);

    for (const item of ranked) {
      selected.add(item.name);
    }
  }

  const additionalSkills = [...selected].slice(0, 12);
  return {
    additionalSkills,
    loadedSkills: [
      "prawny-router-v3",
      "shared",
      "prawo-polskie-v2",
      primarySkill,
      ...additionalSkills
    ]
  };
}

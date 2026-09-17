import type { LexSkillRecord, LexSkillRegistry } from "./registry.js";

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
  executionSkills: string[];
  domainSkills: string[];
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

function isExecutionSkill(skill: LexSkillRecord): boolean {
  return (
    typeof skill.frontmatter.type === "string" &&
    skill.frontmatter.type.toLowerCase().startsWith("executive-")
  );
}

function isDomainSkill(skill: LexSkillRecord): boolean {
  return skill.name.startsWith("dr-");
}

function descriptionOf(skill: LexSkillRecord): string {
  return typeof skill.frontmatter.description === "string"
    ? skill.frontmatter.description
    : "";
}

function rankSkills(
  skills: LexSkillRecord[],
  queryTokens: Set<string>
): Array<{ skill: LexSkillRecord; score: number }> {
  return skills
    .map((skill) => ({
      skill,
      score: scoreSkill(
        queryTokens,
        skill.name,
        descriptionOf(skill)
      )
    }))
    .sort((left, right) =>
      right.score - left.score ||
      left.skill.name.localeCompare(right.skill.name, "pl")
    );
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
  const executionSkills = new Set<string>();
  const domainSkills = new Set<string>([primarySkill]);

  for (const name of manual) {
    const skill = registry.get(name);
    if (!skill) continue;
    if (isExecutionSkill(skill)) executionSkills.add(name);
    if (isDomainSkill(skill)) domainSkills.add(name);
  }

  if (automatic) {
    const queryTokens = tokens(query);
    const candidates = [...registry.skills.values()]
      .filter((skill) => !core.has(skill.name) && skill.name !== "shared");

    const rankedExecution = rankSkills(
      candidates.filter(isExecutionSkill),
      queryTokens
    );
    const matchingExecution = rankedExecution
      .filter((item) => item.score >= 2)
      .slice(0, 4);

    if (matchingExecution.length === 0 && executionSkills.size === 0) {
      const fallback =
        candidates.find((skill) => skill.name === "przewodnik-prawny-v2") ??
        rankedExecution[0]?.skill;
      if (fallback) {
        executionSkills.add(fallback.name);
        selected.add(fallback.name);
      }
    } else {
      for (const item of matchingExecution) {
        executionSkills.add(item.skill.name);
        selected.add(item.skill.name);
      }
    }

    const rankedDomains = rankSkills(
      candidates.filter(isDomainSkill),
      queryTokens
    )
      .filter((item) => item.score >= 4)
      .slice(0, 3);

    for (const item of rankedDomains) {
      domainSkills.add(item.skill.name);
      selected.add(item.skill.name);
    }

    const rankedAuxiliary = rankSkills(
      candidates.filter(
        (skill) =>
          !isExecutionSkill(skill) &&
          !isDomainSkill(skill)
      ),
      queryTokens
    )
      .filter((item) => item.score >= 4)
      .slice(0, 4);

    for (const item of rankedAuxiliary) {
      selected.add(item.skill.name);
    }
  }

  const additionalSkills = [...selected].slice(0, 12);
  const retained = new Set(additionalSkills);

  return {
    additionalSkills,
    loadedSkills: [
      "prawny-router-v3",
      "shared",
      "prawo-polskie-v2",
      primarySkill,
      ...additionalSkills
    ],
    executionSkills: [...executionSkills].filter((name) => retained.has(name)),
    domainSkills: [...domainSkills].filter(
      (name) => name === primarySkill || retained.has(name)
    )
  };
}

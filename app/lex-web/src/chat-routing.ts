export const SKILL_SELECTION_ENVELOPE_PREFIX = "__LEX_SKILLS_V1__";
export const AUTO_CASE_TYPE = "AUTO";

/**
 * Execution skills that run a checkpointed, multi-step pipeline rather than a
 * single answer. They are offered explicitly when a conversation starts, so a
 * user does not have to rely on Auto picking them up from the wording.
 */
export const DETERMINISTIC_PIPELINE_SKILLS = [
  "pisma-procesowe-v3",
  "chronologia-sprawy-v1",
  "analiza-sadowa-v6",
  "analizator-umow-v1",
  "analizator-dowodow-v3"
] as const;

export type PublicSkillDescriptor = {
  name: string;
  version?: string;
  type?: string;
  status?: string;
  description?: string;
  category?: "domain" | "execution" | string;
};

const STOP_WORDS = new Set([
  "albo", "bez", "byc", "czy", "dla", "gdzie", "jest", "jako", "ktora",
  "ktore", "ktory", "mam", "oraz", "przez", "sie", "tego", "ten", "tym",
  "wobec", "zeby", "and", "for", "from", "into", "that", "the", "this",
  "with"
]);

let caseTypeExecutionSkills: string[] = [];
let allowedDomainSkills: string[] = [];

function safeExecutionSkillNames(names: readonly string[]): string[] {
  return [
    ...new Set(
      names
        .map((name) => name.trim())
        .filter((name) =>
          Boolean(name) &&
          name !== AUTO_CASE_TYPE &&
          name !== "prawny-router-v3" &&
          name !== "shared" &&
          name !== "prawo-polskie-v2" &&
          !name.startsWith("dr-") &&
          /^[a-z0-9][a-z0-9._-]{1,159}$/i.test(name)
        )
    )
  ].slice(0, 8);
}

export function setCaseTypeExecutionSkills(names: readonly string[]): void {
  caseTypeExecutionSkills = safeExecutionSkillNames(names);
}

export function getCaseTypeExecutionSkills(): string[] {
  return [...caseTypeExecutionSkills];
}

function safeDomainSkillNames(
  names: readonly string[]
): string[] {
  return [
    ...new Set(
      names
        .map((name) => name.trim())
        .filter((name) =>
          /^dr-\d{2}-[a-z0-9-]{1,140}$/i.test(name)
        )
    )
  ].slice(0, 32);
}

/**
 * Restrict which DR domains the router may use. An empty list means "no
 * restriction", which is what a full selection sends: the envelope then stays
 * exactly as it was before, and the router keeps every domain available.
 */
export function setAllowedDomainSkills(
  names: readonly string[]
): void {
  allowedDomainSkills = safeDomainSkillNames(names);
}

export function getAllowedDomainSkills(): string[] {
  return [...allowedDomainSkills];
}

// Compatibility aliases for older callers/tests. New UI uses the plural API.
export function setCaseTypeExecutionSkill(name: string): void {
  setCaseTypeExecutionSkills(name ? [name] : []);
}

export function getCaseTypeExecutionSkill(): string {
  return caseTypeExecutionSkills[0] ?? "";
}

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

function scoreRoute(
  route: string,
  queryTokens: Set<string>,
  skill?: PublicSkillDescriptor
): number {
  const nameTokens = tokens(route.replace(/^dr-\d{2}-/, ""));
  const descriptionTokens = tokens(skill?.description ?? "");
  let score = 0;
  for (const token of queryTokens) {
    if (nameTokens.has(token)) score += 10;
    if (descriptionTokens.has(token)) score += 3;
  }
  return score;
}

export function choosePrimaryRoute(
  query: string,
  routes: readonly string[],
  skills: readonly PublicSkillDescriptor[],
  manualSkills: readonly string[]
): string {
  const manualRoute = manualSkills.find((name) => routes.includes(name));
  if (manualRoute) return manualRoute;
  if (routes.length === 0) return "";

  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  const queryTokens = tokens(query);
  const ranked = routes
    .map((route) => ({
      route,
      score: scoreRoute(route, queryTokens, byName.get(route))
    }))
    .sort((left, right) => right.score - left.score || left.route.localeCompare(right.route, "pl"));

  return ranked[0]?.route ?? routes[0] ?? "";
}

export function buildSkillSelectionEnvelope(
  query: string,
  automatic: boolean,
  manualSkills: readonly string[]
): string {
  const prioritizedExecutionSkills = getCaseTypeExecutionSkills();
  const manual = [
    ...new Set([
      ...manualSkills,
      ...prioritizedExecutionSkills
    ])
  ]
    .filter((name) =>
      name !== "prawny-router-v3" &&
      name !== "shared" &&
      name !== "prawo-polskie-v2"
    )
    .slice(0, 16);

  // AUTO is always genuinely automatic. When execution skills are explicitly
  // prioritized, the user's Auto-skills switch still controls whether the
  // router may add further cooperating skills and additional DR domains.
  const effectiveAutomatic =
    prioritizedExecutionSkills.length === 0
      ? true
      : automatic;

  // Domains travel in their own field. Folding them into `manual` would let a
  // full DR selection exhaust the 16-name manual budget and push every
  // execution skill out of the envelope.
  const domains = getAllowedDomainSkills();

  return `${SKILL_SELECTION_ENVELOPE_PREFIX} ${JSON.stringify({
    auto: effectiveAutomatic,
    manual,
    ...(domains.length > 0
      ? { domains }
      : {}),
    caseType:
      prioritizedExecutionSkills.length > 0
        ? prioritizedExecutionSkills
        : AUTO_CASE_TYPE
  })}\n${query}`;
}

export function labelForSkill(name: string): string {
  return name
    .replace(/^dr-(\d{2})-/, "DR-$1 · ")
    .replaceAll("-", " ");
}

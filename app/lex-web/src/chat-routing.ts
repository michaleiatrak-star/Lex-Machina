export const SKILL_SELECTION_ENVELOPE_PREFIX = "__LEX_SKILLS_V1__";
export const AUTO_CASE_TYPE = "AUTO";

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
  ].slice(0, 1);
}

export function setCaseTypeExecutionSkills(names: readonly string[]): void {
  caseTypeExecutionSkills = safeExecutionSkillNames(names);
}

export function getCaseTypeExecutionSkills(): string[] {
  return [...caseTypeExecutionSkills];
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
      ...prioritizedExecutionSkills,
      ...manualSkills
    ])
  ]
    .filter((name) =>
      name !== "prawny-router-v3" &&
      name !== "shared" &&
      name !== "prawo-polskie-v2"
    )
    .slice(0, 16);

  const deterministicSkill =
    prioritizedExecutionSkills[0] ?? null;
  const workflowMode =
    deterministicSkill
      ? "DETERMINISTIC"
      : "SKILL_AUTO";

  // In SKILL_AUTO the router may select cooperating execution skills, but
  // they remain semantic skill modules under the universal Gate I workflow.
  // A specialized coded state machine is activated only by an explicit
  // deterministic execution-skill choice.
  const effectiveAutomatic =
    deterministicSkill
      ? automatic
      : true;

  return `${SKILL_SELECTION_ENVELOPE_PREFIX} ${JSON.stringify({
    auto: effectiveAutomatic,
    manual,
    caseType:
      deterministicSkill
        ? [deterministicSkill]
        : AUTO_CASE_TYPE,
    workflowMode,
    workflowSkill:
      deterministicSkill
  })}\n${query}`;
}

export function labelForSkill(name: string): string {
  return name
    .replace(/^dr-(\d{2})-/, "DR-$1 · ")
    .replaceAll("-", " ");
}

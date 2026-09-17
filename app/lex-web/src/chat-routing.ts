export const SKILL_SELECTION_ENVELOPE_PREFIX = "__LEX_SKILLS_V1__";

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
  const manual = [
    ...new Set(manualSkills)
  ]
    .filter((name) =>
      name !== "prawny-router-v3" &&
      name !== "shared" &&
      name !== "prawo-polskie-v2"
    )
    .slice(0, 16);

  return `${SKILL_SELECTION_ENVELOPE_PREFIX} ${JSON.stringify({
    auto: automatic,
    manual
  })}\n${query}`;
}

export function labelForSkill(name: string): string {
  return name
    .replace(/^dr-(\d{2})-/, "DR-$1 · ")
    .replaceAll("-", " ");
}

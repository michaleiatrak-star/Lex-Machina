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
  "analizator-dowodow-v3",
  "pisma-proste-v2",
  "analizator-przepisow-v2",
  "orzeczenia-sadowe-v2",
  "przesluchanie-swiadkow-v2-min90",
  "raport-sytuacyjny-v2",
  "raport-klienta-v1"
] as const;

export const DETERMINISTIC_ACTION_META_PREFIX =
  "LEX_ACTION=";

export const DETERMINISTIC_ACTIONS = [
  {
    id: "COURT_ANALYSIS",
    label: "Analiza sądowa",
    description:
      "Deterministyczna analiza akt i problemu procesowego.",
    skills: [
      "analiza-sadowa-v6"
    ]
  },
  {
    id: "CHRONOLOGY",
    label: "Chronologia sprawy",
    description:
      "Porządkuje zdarzenia, daty, terminy i zależności czasowe.",
    skills: [
      "chronologia-sprawy-v1"
    ]
  },
  {
    id: "EVIDENCE_ANALYSIS",
    label: "Analiza dowodów",
    description:
      "Ocena materiału dowodowego, luk, spójności i ryzyk.",
    skills: [
      "analizator-dowodow-v3"
    ]
  },
  {
    id: "CONTRACT_ANALYSIS",
    label: "Analiza umowy",
    description:
      "Deterministyczna analiza postanowień, ryzyk i obowiązków.",
    skills: [
      "analizator-umow-v1"
    ]
  },
  {
    id: "PROCESS_PLEADING",
    label: "Pismo procesowe",
    description:
      "Uruchamia checkpointowany pipeline przygotowania pisma procesowego.",
    skills: [
      "pisma-procesowe-v3"
    ]
  },
  {
    id: "SIMPLE_LETTER",
    label: "Pismo proste",
    description:
      "Wezwania, wnioski i krótsze pisma z walidacją przed plikiem.",
    skills: [
      "pisma-proste-v2"
    ]
  },
  {
    id: "STATUTE_ANALYSIS",
    label: "Analiza przepisu",
    description:
      "Brzmienie aktualne i historyczne, przesłanki, wykładnia, nowelizacje.",
    skills: [
      "analizator-przepisow-v2"
    ]
  },
  {
    id: "CASE_LAW_RESEARCH",
    label: "Research orzecznictwa",
    description:
      "Wyszukiwanie i weryfikacja sygnatur oraz tez orzeczeń.",
    skills: [
      "orzeczenia-sadowe-v2"
    ]
  },
  {
    id: "WITNESS_EXAMINATION",
    label: "Przesłuchanie świadków",
    description:
      "Cele dowodowe, sprzeczności i zestawy pytań do świadków.",
    skills: [
      "przesluchanie-swiadkow-v2-min90"
    ]
  },
  {
    id: "SITUATION_REPORT",
    label: "Raport sytuacyjny",
    description:
      "Fakty, ryzyka, dowody, terminy, warianty i priorytety sprawy.",
    skills: [
      "raport-sytuacyjny-v2"
    ]
  },
  {
    id: "CLIENT_REPORT",
    label: "Raport dla klienta",
    description:
      "Stan sprawy, ryzyka i kolejne kroki zrozumiałym językiem.",
    skills: [
      "raport-klienta-v1"
    ]
  }
] as const;

/** New-conversation work mode: router-driven AUTO or a pinned execution skill. */
export type ChatWorkMode =
  | "AUTO"
  | "MECHANICAL";

export function workModeForAction(
  actionId: DeterministicActionId | ""
): ChatWorkMode {
  return actionId
    ? "MECHANICAL"
    : "AUTO";
}

export type DeterministicActionId =
  (typeof DETERMINISTIC_ACTIONS)[number]["id"];

export function skillsForDeterministicAction(
  actionId: DeterministicActionId | ""
): string[] {
  if (!actionId) return [];
  const action =
    DETERMINISTIC_ACTIONS.find(
      (item) =>
        item.id === actionId
    );
  return action
    ? [...action.skills]
    : [];
}

export function deterministicActionMeta(
  actionId: DeterministicActionId | ""
): string {
  return `${DETERMINISTIC_ACTION_META_PREFIX}${
    actionId || AUTO_CASE_TYPE
  }`;
}

export function deterministicActionFromMeta(
  meta?: string
): DeterministicActionId | "" {
  if (!meta) return "";
  const token =
    meta
      .split(/\s*[|;]\s*/)
      .find((item) =>
        item.startsWith(
          DETERMINISTIC_ACTION_META_PREFIX
        )
      );
  if (!token) return "";
  const value =
    token.slice(
      DETERMINISTIC_ACTION_META_PREFIX.length
    );
  if (
    value === AUTO_CASE_TYPE
  ) {
    return "";
  }
  return DETERMINISTIC_ACTIONS.some(
    (item) =>
      item.id === value
  )
    ? value as DeterministicActionId
    : "";
}

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

  const normalizedQuery =
    normalize(query)
      .replace(/\s+/g, " ")
      .trim();
  const deterministicRouteHints: Array<{
    routePrefix: string;
    patterns: RegExp[];
  }> = [
    {
      routePrefix:
        "dr-03-prawo-karne",
      patterns: [
        /\bk\.?\s*k\.?\b/,
        /\bkodeks karny\b/,
        /\bk\.?\s*p\.?\s*k\.?\b/,
        /\bkodeks postepowania karnego\b/,
        /\bprzestepstw[a-z]*\b/,
        /\bodpowiedzialnosc karn[a-z]*\b/
      ]
    }
  ];
  for (
    const hint
    of deterministicRouteHints
  ) {
    if (
      hint.patterns.some(
        (pattern) =>
          pattern.test(
            normalizedQuery
          )
      )
    ) {
      const hinted =
        routes.find(
          (route) =>
            route.startsWith(
              hint.routePrefix
            )
        );
      if (hinted) {
        return hinted;
      }
    }
  }

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
  manualSkills: readonly string[],
  executionAllowList:
    readonly string[] | null = null
): string {
  const prioritizedExecutionSkills =
    getCaseTypeExecutionSkills();
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

  // AUTO remains semantic routing. Checkbox state is an allow-list and must
  // never become workflow priority merely because every skill is selected.
  const effectiveAutomatic =
    prioritizedExecutionSkills.length === 0
      ? true
      : automatic;

  const domains =
    getAllowedDomainSkills();

  const execution =
    executionAllowList === null
      ? null
      : [
          ...new Set([
            ...executionAllowList,
            // A deterministic action pins its required execution skill even
            // if the general panel was narrowed independently.
            ...prioritizedExecutionSkills
          ])
        ]
          .filter((name) =>
            name !== "prawny-router-v3" &&
            name !== "shared" &&
            name !== "prawo-polskie-v2" &&
            !name.startsWith("dr-")
          )
          .slice(0, 64);

  return `${SKILL_SELECTION_ENVELOPE_PREFIX} ${JSON.stringify({
    auto: effectiveAutomatic,
    manual,
    ...(domains.length > 0
      ? { domains }
      : {}),
    ...(execution !== null
      ? { execution }
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

export const MANDATORY_SKILLS = [
  "prawny-router-v3",
  "shared"
] as const;

export const OPTIONAL_EXECUTION_SKILLS = [
  "analiza-sadowa-v6",
  "analizator-dowodow-v3",
  "analizator-przepisow-v2",
  "analizator-umow-v1",
  "chronologia-sprawy-v1",
  "orzeczenia-sadowe-v2",
  "pisma-procesowe-v3",
  "pisma-proste-v2",
  "przesluchanie-swiadkow-v2-min90",
  "przewodnik-prawny-v2",
  "raport-klienta-v1",
  "raport-sytuacyjny-v2"
] as const;

const ROUTE_KEYWORDS: Record<string, string[]> = {
  "dr-01": [
    "konstytuc", "ustroj", "źródł", "zrodl", "dziennik ustaw",
    "rozporządzen", "rozporzadzen", "ustawa", "trybunał konstytuc"
  ],
  "dr-02": [
    "cywil", "umow", "najmu", "sprzeda", "odszkod", "rodzin",
    "rozwod", "aliment", "spad", "gospodarcz", "spółk", "spolk",
    "konsument", "wierzytel", "kodeks cywil"
  ],
  "dr-03": [
    "karn", "przestęp", "przestep", "wykroc", "prokurator",
    "oskarż", "oskarz", "podejrz", "areszt", "grzywn", "egzekucj karn"
  ],
  "dr-04": [
    "prac", "pracownik", "pracodawc", "zus", "emeryt", "rent",
    "świadczen", "swiadczen", "zasił", "zasil", "ubezpieczen społecz"
  ],
  "dr-05": [
    "administr", "kpa", "wsa", "nsa", "decyzj administr",
    "organ", "bezczynno", "postępowani administr", "postepowani administr"
  ],
  "dr-06": [
    "podat", "vat", "pit", "cit", "akcyz", "skarbow", "finans public",
    "aml", "pranie pieni", "ordynacj podat"
  ],
  "dr-07": [
    "zamówie", "zamowie", "przetarg", "pzp", "fundusz ue", "dotacj",
    "kio", "zamawiając", "zamawiajac"
  ],
  "dr-08": [
    "samorząd", "samorzad", "gmin", "powiat", "województ", "wojewodzt",
    "rada miasta", "uchwał lokal", "uchwal lokal"
  ],
  "dr-09": [
    "budow", "nieruchomość bud", "nieruchomosc bud", "środowisk", "srodowisk",
    "energi", "transport", "droga", "kolej", "pozwolenie na budowę", "budowe"
  ],
  "dr-10": [
    "zdrow", "medycz", "lecznic", "farmac", "lek", "żywno", "zywno",
    "rolnict", "pacjent", "szpital"
  ],
  "dr-11": [
    "cyber", "ai", "sztuczn", "dane", "rodo", "gdpr", "internet",
    "autorsk", "własnoś intelekt", "wlasnos intelekt", "patent", "znak towar"
  ],
  "dr-12": [
    "sąd", "sad", "sędz", "sedz", "prokuratur", "adwokat", "radca praw",
    "notarius", "komornik", "zawód prawn", "zawod prawn"
  ],
  "dr-13": [
    "służb", "sluzb", "bezpieczeńst", "bezpieczenst", "niejawn",
    "tajemnic państw", "tajemnic panstw", "abw", "policj"
  ],
  "dr-14": [
    "unia europej", "ue", "tsue", "etpc", "międzynarod", "miedzynarod",
    "prawa człowieka", "prawa czlowieka", "konwencj", "europejsk"
  ],
  "dr-15": [
    "compliance", "iso", "governance", "audyt", "zgodno", "whistlebl",
    "sygnalist", "procedur wewnętrz", "procedur wewnetrz"
  ],
  "dr-16": [
    "pismo", "pozew", "apelac", "zażalen", "zazalen", "strateg",
    "dowód", "dowod", "orzecznict", "świadk", "swiadk", "argumentac"
  ]
};

const EXTRA_SKILL_KEYWORDS: Array<[string, string[]]> = [
  ["analizator-umow-v1", ["umow", "kontrakt", "klauzul", "aneks"]],
  ["analizator-dowodow-v3", ["dowód", "dowod", "materiał dowod", "material dowod"]],
  ["analizator-przepisow-v2", ["przepis", "artykuł", "art.", "ustaw", "rozporządzen", "rozporzadzen"]],
  ["orzeczenia-sadowe-v2", ["orzeczen", "wyrok", "uchwał", "uchwal", "sygnatur", "sn ", "nsa ", "wsa ", "tsue", "etpc"]],
  ["pisma-procesowe-v3", ["pozew", "apelac", "zażalen", "zazalen", "sprzeciw", "wniosek proces", "odpowiedź na pozew", "odpowiedz na pozew"]],
  ["pisma-proste-v2", ["wezwanie", "oświadczen", "oswiadczen", "pismo do", "reklamac"]],
  ["chronologia-sprawy-v1", ["chronolog", "oś czasu", "os czasu", "kolejność zdarzeń", "kolejnosc zdarzen"]],
  ["przesluchanie-swiadkow-v2-min90", ["świadek", "swiadek", "przesłuch", "przesluch", "pytania do świadka", "pytania do swiadka"]],
  ["analiza-sadowa-v6", ["sprawa sąd", "sprawa sad", "proces", "ryzyko proces", "strategia proces"]],
  ["raport-klienta-v1", ["raport dla klient", "podsumowanie dla klient", "informacja dla klient"]],
  ["raport-sytuacyjny-v2", ["raport sytuacyj", "status sprawy", "stan sprawy"]],
  ["przewodnik-prawny-v2", ["wyjaśnij prosto", "wyjasnij prosto", "dla laika", "co mam zrobić", "co mam zrobic"]]
];

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("pl-PL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ąćęłńóśźż]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreNeedle(haystack: string, needle: string): number {
  const normalizedNeedle = normalize(needle);
  if (!normalizedNeedle) return 0;
  if (haystack.includes(normalizedNeedle)) {
    return normalizedNeedle.includes(" ") ? 5 : 3;
  }
  return 0;
}

export function labelForSkill(skill: string): string {
  if (skill === "prawny-router-v3") return "Prawny router v3";
  if (skill === "shared") return "Shared · bramki obowiązkowe";
  if (/^dr-\d{2}-/.test(skill)) {
    return skill
      .replace(/^dr-(\d{2})-/, "DR-$1 · ")
      .replaceAll("-", " ");
  }
  return skill.replaceAll("-", " ");
}

export function choosePrimaryRoute(query: string, routes: string[]): string {
  if (routes.length === 0) return "";
  const haystack = normalize(query);
  let best = "";
  let bestScore = -1;

  for (const route of routes) {
    const prefix = route.slice(0, 5);
    const slugTokens = route
      .replace(/^dr-\d{2}-/, "")
      .split("-")
      .filter((token) => token.length >= 4);
    const keywordScore = (ROUTE_KEYWORDS[prefix] ?? [])
      .reduce((sum, keyword) => sum + scoreNeedle(haystack, keyword), 0);
    const slugScore = slugTokens
      .reduce((sum, token) => sum + (haystack.includes(normalize(token)) ? 2 : 0), 0);
    const score = keywordScore + slugScore;
    if (score > bestScore) {
      best = route;
      bestScore = score;
    }
  }

  if (bestScore > 0) return best;
  return routes.find((route) => route.startsWith("dr-02-")) ?? routes[0] ?? "";
}

export function chooseAutomaticExtraSkills(query: string): string[] {
  const haystack = normalize(query);
  return EXTRA_SKILL_KEYWORDS
    .map(([skill, keywords]) => ({
      skill,
      score: keywords.reduce(
        (sum, keyword) => sum + scoreNeedle(haystack, keyword),
        0
      )
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((item) => item.skill);
}

export function encodeExtraSkills(query: string, skills: readonly string[]): string {
  const safe = [...new Set(skills)]
    .filter((skill) => /^[a-z0-9-]{2,80}$/.test(skill))
    .filter((skill) => !MANDATORY_SKILLS.includes(skill as (typeof MANDATORY_SKILLS)[number]))
    .slice(0, 8);
  return safe.length > 0
    ? `[LEX_EXTRA_SKILLS:${safe.join(",")}]\n${query}`
    : query;
}

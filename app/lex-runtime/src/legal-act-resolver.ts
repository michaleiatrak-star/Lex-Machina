export type LegalActId = "KC" | "KPC" | "KPK";

export type LegalActDescriptor = {
  id: LegalActId;
  title: string;
  eli: string;
  baseEli: string;
  sourceUrl: string;
  sourceKind: "consolidated_text";
  registryAsOf: string;
};

type LegalActEntry = LegalActDescriptor & {
  aliases: string[];
};

const REGISTRY_AS_OF = "2026-09-15";

const ACTS: LegalActEntry[] = [
  {
    id: "KC",
    title: "Kodeks cywilny",
    eli: "DU/2026/795",
    baseEli: "DU/1964/93",
    sourceUrl:
      "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html",
    sourceKind: "consolidated_text",
    registryAsOf: REGISTRY_AS_OF,
    aliases: [
      "KC",
      "k.c.",
      "kodeks cywilny"
    ]
  },
  {
    id: "KPC",
    title: "Kodeks postępowania cywilnego",
    eli: "DU/2026/468",
    baseEli: "DU/1964/296",
    sourceUrl:
      "https://api.sejm.gov.pl/eli/acts/DU/2026/468/text.html",
    sourceKind: "consolidated_text",
    registryAsOf: REGISTRY_AS_OF,
    aliases: [
      "KPC",
      "k.p.c.",
      "kodeks postępowania cywilnego"
    ]
  },
  {
    id: "KPK",
    title: "Kodeks postępowania karnego",
    eli: "DU/2026/490",
    baseEli: "DU/1997/555",
    sourceUrl:
      "https://api.sejm.gov.pl/eli/acts/DU/2026/490/text.html",
    sourceKind: "consolidated_text",
    registryAsOf: REGISTRY_AS_OF,
    aliases: [
      "KPK",
      "k.p.k.",
      "kodeks postępowania karnego"
    ]
  }
];

function normalizeAlias(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("pl")
    .replace(/[._-]+/g, "")
    .replace(/s+/g, " ")
    .trim();
}

const BY_ALIAS = new Map<string, LegalActEntry>();
for (const entry of ACTS) {
  const aliases = new Set(
    [
      entry.id,
      entry.title,
      ...entry.aliases
    ].map(normalizeAlias)
  );

  for (const key of aliases) {
    const existing = BY_ALIAS.get(key);
    if (existing && existing.id !== entry.id) {
      throw new Error(
        "Legal act alias collision in runtime registry: " + key
      );
    }
    BY_ALIAS.set(key, entry);
  }
}

export class LegalActResolutionError extends Error {
  constructor(
    message: string,
    readonly code:
      | "UNKNOWN_LEGAL_ACT"
      | "EMPTY_LEGAL_ACT"
  ) {
    super(message);
    this.name = "LegalActResolutionError";
  }
}

export class DeterministicLegalActResolver {
  resolve(value: string): LegalActDescriptor {
    const normalized = normalizeAlias(value);
    if (!normalized) {
      throw new LegalActResolutionError(
        "Legal act identifier cannot be empty.",
        "EMPTY_LEGAL_ACT"
      );
    }

    const entry = BY_ALIAS.get(normalized);
    if (!entry) {
      throw new LegalActResolutionError(
        "Legal act is not present in the runtime registry.",
        "UNKNOWN_LEGAL_ACT"
      );
    }

    return {
      id: entry.id,
      title: entry.title,
      eli: entry.eli,
      baseEli: entry.baseEli,
      sourceUrl: entry.sourceUrl,
      sourceKind: entry.sourceKind,
      registryAsOf: entry.registryAsOf
    };
  }

  list(): LegalActDescriptor[] {
    return ACTS.map((entry) => ({
      id: entry.id,
      title: entry.title,
      eli: entry.eli,
      baseEli: entry.baseEli,
      sourceUrl: entry.sourceUrl,
      sourceKind: entry.sourceKind,
      registryAsOf: entry.registryAsOf
    }));
  }
}
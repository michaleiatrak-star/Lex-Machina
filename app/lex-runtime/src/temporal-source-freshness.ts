import type {
  LegalActDescriptor
} from "./legal-act-resolver.js";

export type TemporalFreshnessStatus =
  | "CURRENT"
  | "STALE_CONSOLIDATED_TEXT"
  | "POST_TJ_AMENDMENTS"
  | "CURRENT_TEXT_REQUIRES_PDF"
  | "REPEALED_CONSOLIDATED_TEXT"
  | "NO_CURRENT_CONSOLIDATED_TEXT"
  | "SOURCE_METADATA_UNAVAILABLE";

export type TemporalAmendment = {
  eli: string;
  displayAddress: string;
  promulgation: string;
  title: string;
  provenance: "DATE" | "API" | "DATE+API";
};

export type TemporalFreshnessResult = {
  status: TemporalFreshnessStatus;
  checkedAt: string;
  baseEli: string;
  pinnedEli: string;
  currentEli?: string;
  currentPromulgation?: string;
  sourceUrl?: string;
  amendmentsAfter: TemporalAmendment[];
  reason?: string;
};

export type EliFetch = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

type EliAct = {
  ELI?: unknown;
  year?: unknown;
  pos?: unknown;
  status?: unknown;
  displayAddress?: unknown;
  title?: unknown;
  promulgation?: unknown;
  announcementDate?: unknown;
  textHTML?: unknown;
  textPDF?: unknown;
};

const ELI_API = "https://api.sejm.gov.pl/eli/acts";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEli(value: unknown): string {
  const raw = text(value).replace(/^https?:\/\/[^/]+\/eli\/acts\//u, "");
  const match = raw.match(/(DU|MP)\/(\d{4})\/(\d+)/u);
  return match ? match[0] : "";
}

function unwrapAct(value: unknown): EliAct | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.act && typeof candidate.act === "object") {
    return candidate.act as EliAct;
  }
  return candidate as EliAct;
}

function list(
  refs: unknown,
  relation: string
): unknown[] {
  if (!refs || typeof refs !== "object") return [];
  const value = (refs as Record<string, unknown>)[relation];
  return Array.isArray(value) ? value : [];
}

function activeStatus(value: unknown): boolean {
  return text(value)
    .toLocaleLowerCase("pl")
    .includes("obowiązując");
}

function repealedStatus(value: unknown): boolean {
  const status = text(value)
    .toLocaleLowerCase("pl");

  return (
    status.includes("uchyl") ||
    status.includes("wygaś") ||
    status.includes("utracił moc") ||
    status.includes("utrata mocy") ||
    status.includes("nieobowiąz")
  );
}

function numeric(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

function pickCurrentConsolidated(
  refs: unknown
): {
  eli: string;
  year: number;
  pos: number;
  status: string;
} | null {
  const candidates = list(
    refs,
    "Inf. o tekście jednolitym"
  )
    .map(unwrapAct)
    .filter((act): act is EliAct => Boolean(act))
    .map((act) => ({
      eli: normalizeEli(act.ELI),
      year: numeric(act.year),
      pos: numeric(act.pos),
      status: text(act.status)
    }))
    .filter((act) =>
      Boolean(act.eli) &&
      activeStatus(act.status)
    )
    .sort((a, b) =>
      a.year - b.year ||
      a.pos - b.pos
    );

  return candidates.at(-1) ?? null;
}

function amendmentFromAct(
  act: EliAct
): Omit<TemporalAmendment, "provenance"> | null {
  const eli = normalizeEli(act.ELI);
  const promulgation =
    text(act.promulgation) ||
    text(act.announcementDate);

  if (!eli) return null;

  return {
    eli,
    displayAddress:
      text(act.displayAddress) || eli,
    promulgation,
    title: text(act.title)
  };
}

function postTjByDate(
  refs: unknown,
  promulgation: string
): Map<string, Omit<TemporalAmendment, "provenance">> {
  const result = new Map<
    string,
    Omit<TemporalAmendment, "provenance">
  >();

  if (!promulgation) return result;

  for (const item of list(refs, "Akty zmieniające")) {
    const act = unwrapAct(item);
    if (!act) continue;
    const amendment = amendmentFromAct(act);
    if (
      amendment &&
      amendment.promulgation &&
      amendment.promulgation > promulgation
    ) {
      result.set(amendment.eli, amendment);
    }
  }

  return result;
}

function postTjByApi(
  refs: unknown
): Map<string, Omit<TemporalAmendment, "provenance">> {
  const result = new Map<
    string,
    Omit<TemporalAmendment, "provenance">
  >();

  for (
    const item of list(
      refs,
      "Nowelizacje po tekście jednolitym"
    )
  ) {
    const act = unwrapAct(item);
    if (!act) continue;
    const amendment = amendmentFromAct(act);
    if (amendment) {
      result.set(amendment.eli, amendment);
    }
  }

  return result;
}

function mergeAmendments(
  dateMap: Map<
    string,
    Omit<TemporalAmendment, "provenance">
  >,
  apiMap: Map<
    string,
    Omit<TemporalAmendment, "provenance">
  >
): TemporalAmendment[] {
  const ids = new Set([
    ...dateMap.keys(),
    ...apiMap.keys()
  ]);

  return [...ids]
    .map((eli) => {
      const date = dateMap.get(eli);
      const api = apiMap.get(eli);
      const value = date ?? api;
      if (!value) return null;

      return {
        ...value,
        provenance:
          date && api
            ? "DATE+API" as const
            : date
              ? "DATE" as const
              : "API" as const
      };
    })
    .filter(
      (value): value is TemporalAmendment =>
        Boolean(value)
    )
    .sort((a, b) =>
      a.promulgation.localeCompare(b.promulgation) ||
      a.eli.localeCompare(b.eli)
    );
}

function parts(eli: string): [string, string, string] | null {
  const match = normalizeEli(eli).match(
    /^(DU|MP)\/(\d{4})\/(\d+)$/u
  );
  if (!match) return null;
  return [match[1]!, match[2]!, match[3]!];
}

function apiUrl(
  eli: string,
  suffix = ""
): string | null {
  const split = parts(eli);
  if (!split) return null;
  return `${ELI_API}/${split[0]}/${split[1]}/${split[2]}${suffix}`;
}

async function json(
  fetcher: EliFetch,
  url: string
): Promise<unknown> {
  const response = await fetcher(url, {
    method: "GET",
    redirect: "error",
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(
      "ELI_HTTP_" + response.status
    );
  }
  return response.json();
}

export class TemporalSourceFreshnessChecker {
  constructor(
    private readonly fetcher: EliFetch =
      globalThis.fetch.bind(globalThis),
    private readonly now: () => string =
      () => new Date().toISOString()
  ) {}

  async check(
    descriptor: LegalActDescriptor
  ): Promise<TemporalFreshnessResult> {
    const checkedAt = this.now();
    const failure = (
      status: TemporalFreshnessStatus,
      reason: string,
      extra: Partial<TemporalFreshnessResult> = {}
    ): TemporalFreshnessResult => ({
      status,
      checkedAt,
      baseEli: descriptor.baseEli,
      pinnedEli: descriptor.eli,
      amendmentsAfter: [],
      reason,
      ...extra
    });

    const baseRefsUrl = apiUrl(
      descriptor.baseEli,
      "/references"
    );
    if (!baseRefsUrl) {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "INVALID_BASE_ELI"
      );
    }

    let baseRefs: unknown;
    try {
      baseRefs = await json(
        this.fetcher,
        baseRefsUrl
      );
    } catch {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "BASE_REFERENCES_FETCH_FAILED"
      );
    }

    const pinnedRelation = list(
      baseRefs,
      "Inf. o tekście jednolitym"
    )
      .map(unwrapAct)
      .filter((act): act is EliAct => Boolean(act))
      .find(
        (act) =>
          normalizeEli(act.ELI) ===
          normalizeEli(descriptor.eli)
      );

    if (
      pinnedRelation &&
      repealedStatus(pinnedRelation.status)
    ) {
      return failure(
        "REPEALED_CONSOLIDATED_TEXT",
        "PINNED_CONSOLIDATED_TEXT_REPEALED"
      );
    }

    const current = pickCurrentConsolidated(
      baseRefs
    );
    if (!current) {
      return failure(
        "NO_CURRENT_CONSOLIDATED_TEXT",
        "NO_IN_FORCE_CONSOLIDATED_TEXT"
      );
    }

    const metadataUrl = apiUrl(current.eli);
    const currentRefsUrl = apiUrl(
      current.eli,
      "/references"
    );
    if (!metadataUrl || !currentRefsUrl) {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "INVALID_CURRENT_ELI",
        { currentEli: current.eli }
      );
    }

    let metadata: unknown;
    let currentRefs: unknown;
    try {
      [metadata, currentRefs] = await Promise.all([
        json(this.fetcher, metadataUrl),
        json(this.fetcher, currentRefsUrl)
      ]);
    } catch {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_METADATA_FETCH_FAILED",
        { currentEli: current.eli }
      );
    }

    const act = unwrapAct(metadata) ?? {};

    if (repealedStatus(act.status)) {
      return failure(
        "REPEALED_CONSOLIDATED_TEXT",
        "CURRENT_CONSOLIDATED_TEXT_REPEALED",
        { currentEli: current.eli }
      );
    }

    const promulgation =
      text(act.promulgation) ||
      text(act.announcementDate);

    if (!promulgation) {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_PROMULGATION_MISSING",
        { currentEli: current.eli }
      );
    }

    const amendmentsAfter = mergeAmendments(
      postTjByDate(
        baseRefs,
        promulgation
      ),
      postTjByApi(currentRefs)
    );

    const common = {
      currentEli: current.eli,
      currentPromulgation: promulgation,
      amendmentsAfter
    };

    if (
      normalizeEli(descriptor.eli) !==
      current.eli
    ) {
      return failure(
        "STALE_CONSOLIDATED_TEXT",
        "PINNED_ELI_DIFFERS_FROM_CURRENT",
        common
      );
    }

    if (amendmentsAfter.length > 0) {
      return failure(
        "POST_TJ_AMENDMENTS",
        "OFFICIAL_AMENDMENTS_AFTER_CONSOLIDATED_TEXT",
        common
      );
    }

    if (act.textHTML !== true) {
      if (act.textPDF === true) {
        const pdfUrl = apiUrl(
          current.eli,
          "/text.pdf"
        );
        return failure(
          "CURRENT_TEXT_REQUIRES_PDF",
          "CURRENT_TEXT_HAS_NO_HTML",
          {
            ...common,
            ...(pdfUrl
              ? { sourceUrl: pdfUrl }
              : {})
          }
        );
      }

      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_TEXT_FORMAT_UNAVAILABLE",
        common
      );
    }

    const sourceUrl = apiUrl(
      current.eli,
      "/text.html"
    );
    if (!sourceUrl) {
      return failure(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_TEXT_URL_INVALID",
        common
      );
    }

    return {
      status: "CURRENT",
      checkedAt,
      baseEli: descriptor.baseEli,
      pinnedEli: descriptor.eli,
      currentEli: current.eli,
      currentPromulgation: promulgation,
      sourceUrl,
      amendmentsAfter: []
    };
  }
}
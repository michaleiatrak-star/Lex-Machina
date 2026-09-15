import type {
  LegalActDescriptor
} from "./legal-act-resolver.js";

export type TemporalFreshnessStatus =
  | "CURRENT"
  | "HISTORICAL"
  | "STALE_CONSOLIDATED_TEXT"
  | "POST_TJ_AMENDMENTS"
  | "CURRENT_TEXT_REQUIRES_PDF"
  | "HISTORICAL_TEXT_REQUIRES_PDF"
  | "REPEALED_CONSOLIDATED_TEXT"
  | "ACT_NOT_IN_FORCE_AT_DATE"
  | "NO_HISTORICAL_CONSOLIDATED_TEXT"
  | "HISTORICAL_POST_TJ_AMENDMENTS"
  | "INVALID_HISTORICAL_DATE"
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
  mode: "CURRENT" | "HISTORICAL";
  checkedAt: string;
  baseEli: string;
  pinnedEli: string;
  requestedAsOf?: string;
  currentEli?: string;
  currentPromulgation?: string;
  sourceUrl?: string;
  actValidFrom?: string;
  actValidTo?: string;
  amendmentsAfter: TemporalAmendment[];
  reason?: string;
};

export type TemporalFreshnessOptions = {
  asOf?: string;
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
  entryIntoForce?: unknown;
  validFrom?: unknown;
  repealDate?: unknown;
  expirationDate?: unknown;
  legalStatusDate?: unknown;
  date?: unknown;
  textHTML?: unknown;
  textPDF?: unknown;
};

type HistoricalCandidate = {
  eli: string;
  metadata: EliAct;
  stateDate: string;
  sourceUrl?: string;
};

const ELI_API = "https://api.sejm.gov.pl/eli/acts";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function dateOnly(value: unknown): string {
  const match = text(value).match(/^(d{4}-d{2}-d{2})/u);
  return match?.[1] ?? "";
}

function validIsoDate(value: string): boolean {
  if (!/^d{4}-d{2}-d{2}$/u.test(value)) return false;
  const parsed = new Date(value + "T00:00:00.000Z");
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function normalizeEli(value: unknown): string {
  const raw = text(value).replace(
    /^https?://[^/]+/eli/acts//u,
    ""
  );
  const match = raw.match(/(DU|MP)/(d{4})/(d+)/u);
  return match?.[0] ?? "";
}

function unwrapAct(value: unknown): EliAct | null {
  if (!value || typeof value !== "object") return null;
  const wrapper = value as Record<string, unknown>;
  if (wrapper.act && typeof wrapper.act === "object") {
    const act = wrapper.act as EliAct;
    return {
      ...act,
      ...(wrapper.date !== undefined && act.date === undefined
        ? { date: wrapper.date }
        : {})
    };
  }
  return wrapper as EliAct;
}

function list(refs: unknown, relation: string): unknown[] {
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
  const status = text(value).toLocaleLowerCase("pl");
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

function validityStart(act: EliAct): string {
  return (
    dateOnly(act.validFrom) ||
    dateOnly(act.entryIntoForce) ||
    dateOnly(act.legalStatusDate) ||
    dateOnly(act.promulgation) ||
    dateOnly(act.announcementDate)
  );
}

function validityEnd(act: EliAct): string {
  return [
    dateOnly(act.repealDate),
    dateOnly(act.expirationDate)
  ].filter(Boolean).sort()[0] ?? "";
}

function isInForceAt(
  act: EliAct,
  asOf: string
): {
  inForce: boolean;
  validFrom: string;
  validTo: string;
} {
  const validFrom = validityStart(act);
  const validTo = validityEnd(act);
  return {
    inForce:
      Boolean(validFrom) &&
      asOf >= validFrom &&
      (!validTo || asOf < validTo),
    validFrom,
    validTo
  };
}

function parts(
  eli: string
): [string, string, string] | null {
  const match = normalizeEli(eli).match(
    /^(DU|MP)/(d{4})/(d+)$/u
  );
  return match
    ? [match[1]!, match[2]!, match[3]!]
    : null;
}

function apiUrl(eli: string, suffix = ""): string | null {
  const split = parts(eli);
  if (!split) return null;
  return (
    ELI_API +
    "/" +
    split[0] +
    "/" +
    split[1] +
    "/" +
    split[2] +
    suffix
  );
}

async function json(
  fetcher: EliFetch,
  url: string
): Promise<unknown> {
  const response = await fetcher(url, {
    method: "GET",
    redirect: "error",
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error("ELI_HTTP_" + response.status);
  }
  return response.json();
}

function pickCurrentConsolidated(
  refs: unknown
): {
  eli: string;
  year: number;
  pos: number;
  status: string;
} | null {
  const candidates = list(refs, "Inf. o tekście jednolitym")
    .map(unwrapAct)
    .filter((act): act is EliAct => Boolean(act))
    .map((act) => ({
      eli: normalizeEli(act.ELI),
      year: numeric(act.year),
      pos: numeric(act.pos),
      status: text(act.status)
    }))
    .filter((act) => Boolean(act.eli) && activeStatus(act.status))
    .sort((a, b) => a.year - b.year || a.pos - b.pos);

  return candidates.at(-1) ?? null;
}

function amendmentFromAct(
  act: EliAct
): Omit<TemporalAmendment, "provenance"> | null {
  const eli = normalizeEli(act.ELI);
  if (!eli) return null;

  return {
    eli,
    displayAddress: text(act.displayAddress) || eli,
    promulgation:
      dateOnly(act.date) ||
      dateOnly(act.promulgation) ||
      dateOnly(act.announcementDate),
    title: text(act.title)
  };
}

function amendmentsBetween(
  refs: unknown,
  after: string,
  through: string
): Map<string, Omit<TemporalAmendment, "provenance">> {
  const result = new Map<
    string,
    Omit<TemporalAmendment, "provenance">
  >();

  if (!after || !through) return result;

  for (const item of list(refs, "Akty zmieniające")) {
    const act = unwrapAct(item);
    if (!act) continue;
    const amendment = amendmentFromAct(act);
    if (
      amendment?.promulgation &&
      amendment.promulgation > after &&
      amendment.promulgation <= through
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
    if (amendment) result.set(amendment.eli, amendment);
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
  return [...new Set([...dateMap.keys(), ...apiMap.keys()])]
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
    .sort(
      (a, b) =>
        a.promulgation.localeCompare(b.promulgation) ||
        a.eli.localeCompare(b.eli)
    );
}

async function historicalCandidate(
  fetcher: EliFetch,
  eli: string,
  asOf: string
): Promise<HistoricalCandidate | null> {
  const metadataUrl = apiUrl(eli);
  if (!metadataUrl) return null;

  let metadata: unknown;
  try {
    metadata = await json(fetcher, metadataUrl);
  } catch {
    return null;
  }

  const act = unwrapAct(metadata);
  if (!act) return null;

  const stateDate =
    dateOnly(act.legalStatusDate) ||
    dateOnly(act.validFrom) ||
    dateOnly(act.entryIntoForce) ||
    dateOnly(act.promulgation) ||
    dateOnly(act.announcementDate);

  if (!stateDate || stateDate > asOf) return null;

  const interval = isInForceAt(act, asOf);
  const hasExplicitEnd = Boolean(interval.validTo);

  if (
    hasExplicitEnd &&
    !interval.inForce
  ) {
    return null;
  }

  if (
    repealedStatus(act.status) &&
    !hasExplicitEnd
  ) {
    return null;
  }

  const sourceUrl =
    act.textHTML === true
      ? apiUrl(eli, "/text.html") ?? undefined
      : act.textPDF === true
        ? apiUrl(eli, "/text.pdf") ?? undefined
        : undefined;

  return {
    eli,
    metadata: act,
    stateDate,
    ...(sourceUrl ? { sourceUrl } : {})
  };
}

export class TemporalSourceFreshnessChecker {
  constructor(
    private readonly fetcher: EliFetch =
      globalThis.fetch.bind(globalThis),
    private readonly now: () => string =
      () => new Date().toISOString()
  ) {}

  async check(
    descriptor: LegalActDescriptor,
    options: TemporalFreshnessOptions = {}
  ): Promise<TemporalFreshnessResult> {
    const checkedAt = this.now();
    const asOf = options.asOf?.trim();

    return asOf
      ? this.checkHistorical(descriptor, asOf, checkedAt)
      : this.checkCurrent(descriptor, checkedAt);
  }

  private failure(
    descriptor: LegalActDescriptor,
    mode: "CURRENT" | "HISTORICAL",
    checkedAt: string,
    status: TemporalFreshnessStatus,
    reason: string,
    extra: Partial<TemporalFreshnessResult> = {}
  ): TemporalFreshnessResult {
    return {
      status,
      mode,
      checkedAt,
      baseEli: descriptor.baseEli,
      pinnedEli: descriptor.eli,
      amendmentsAfter: [],
      reason,
      ...extra
    };
  }

  private async checkHistorical(
    descriptor: LegalActDescriptor,
    asOf: string,
    checkedAt: string
  ): Promise<TemporalFreshnessResult> {
    const fail = (
      status: TemporalFreshnessStatus,
      reason: string,
      extra: Partial<TemporalFreshnessResult> = {}
    ) =>
      this.failure(
        descriptor,
        "HISTORICAL",
        checkedAt,
        status,
        reason,
        {
          requestedAsOf: asOf,
          ...extra
        }
      );

    const today = checkedAt.slice(0, 10);
    if (!validIsoDate(asOf) || asOf >= today) {
      return fail(
        "INVALID_HISTORICAL_DATE",
        "AS_OF_MUST_BE_A_PAST_ISO_DATE"
      );
    }

    const baseMetadataUrl = apiUrl(descriptor.baseEli);
    const baseRefsUrl = apiUrl(
      descriptor.baseEli,
      "/references"
    );
    if (!baseMetadataUrl || !baseRefsUrl) {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "INVALID_BASE_ELI"
      );
    }

    let baseMetadata: unknown;
    let baseRefs: unknown;
    try {
      [baseMetadata, baseRefs] = await Promise.all([
        json(this.fetcher, baseMetadataUrl),
        json(this.fetcher, baseRefsUrl)
      ]);
    } catch {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "BASE_METADATA_FETCH_FAILED"
      );
    }

    const baseAct = unwrapAct(baseMetadata);
    if (!baseAct) {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "BASE_METADATA_INVALID"
      );
    }

    const baseInterval = isInForceAt(baseAct, asOf);
    if (!baseInterval.inForce) {
      return fail(
        "ACT_NOT_IN_FORCE_AT_DATE",
        "BASE_ACT_NOT_IN_FORCE_AT_AS_OF",
        {
          ...(baseInterval.validFrom
            ? { actValidFrom: baseInterval.validFrom }
            : {}),
          ...(baseInterval.validTo
            ? { actValidTo: baseInterval.validTo }
            : {})
        }
      );
    }

    const candidateElis = [
      ...new Set(
        list(baseRefs, "Inf. o tekście jednolitym")
          .map(unwrapAct)
          .filter((act): act is EliAct => Boolean(act))
          .map((act) => normalizeEli(act.ELI))
          .filter(Boolean)
      )
    ];

    const candidates = (
      await Promise.all(
        candidateElis.map((eli) =>
          historicalCandidate(this.fetcher, eli, asOf)
        )
      )
    )
      .filter(
        (candidate): candidate is HistoricalCandidate =>
          Boolean(candidate)
      )
      .sort(
        (a, b) =>
          a.stateDate.localeCompare(b.stateDate) ||
          a.eli.localeCompare(b.eli)
      );

    let selected = candidates.at(-1);

    if (!selected) {
      const baseStateDate =
        dateOnly(baseAct.legalStatusDate) ||
        dateOnly(baseAct.validFrom) ||
        dateOnly(baseAct.entryIntoForce) ||
        dateOnly(baseAct.promulgation) ||
        dateOnly(baseAct.announcementDate);
      const baseEli =
        normalizeEli(baseAct.ELI) ||
        normalizeEli(descriptor.baseEli);
      const baseSourceUrl =
        baseAct.textHTML === true
          ? apiUrl(baseEli, "/text.html") ?? undefined
          : baseAct.textPDF === true
            ? apiUrl(baseEli, "/text.pdf") ?? undefined
            : undefined;

      if (baseStateDate && baseStateDate <= asOf && baseEli) {
        selected = {
          eli: baseEli,
          metadata: baseAct,
          stateDate: baseStateDate,
          ...(baseSourceUrl ? { sourceUrl: baseSourceUrl } : {})
        };
      }
    }

    if (!selected) {
      return fail(
        "NO_HISTORICAL_CONSOLIDATED_TEXT",
        "NO_OFFICIAL_TEXT_APPLICABLE_AT_AS_OF",
        {
          actValidFrom: baseInterval.validFrom,
          ...(baseInterval.validTo
            ? { actValidTo: baseInterval.validTo }
            : {})
        }
      );
    }

    const amendmentsAfter = mergeAmendments(
      amendmentsBetween(baseRefs, selected.stateDate, asOf),
      new Map()
    );

    if (amendmentsAfter.length > 0) {
      return fail(
        "HISTORICAL_POST_TJ_AMENDMENTS",
        "AMENDMENTS_AFTER_SELECTED_TJ_BEFORE_AS_OF",
        {
          currentEli: selected.eli,
          currentPromulgation: selected.stateDate,
          actValidFrom: baseInterval.validFrom,
          ...(baseInterval.validTo
            ? { actValidTo: baseInterval.validTo }
            : {}),
          amendmentsAfter
        }
      );
    }

    const sourceUrl = selected.sourceUrl;
    if (!sourceUrl) {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "HISTORICAL_TEXT_FORMAT_UNAVAILABLE",
        {
          currentEli: selected.eli,
          currentPromulgation: selected.stateDate,
          actValidFrom: baseInterval.validFrom,
          ...(baseInterval.validTo
            ? { actValidTo: baseInterval.validTo }
            : {})
        }
      );
    }

    if (
      selected.metadata.textHTML !== true &&
      selected.metadata.textPDF === true
    ) {
      return fail(
        "HISTORICAL_TEXT_REQUIRES_PDF",
        "HISTORICAL_TEXT_HAS_NO_HTML",
        {
          currentEli: selected.eli,
          currentPromulgation: selected.stateDate,
          sourceUrl,
          actValidFrom: baseInterval.validFrom,
          ...(baseInterval.validTo
            ? { actValidTo: baseInterval.validTo }
            : {})
        }
      );
    }

    return {
      status: "HISTORICAL",
      mode: "HISTORICAL",
      checkedAt,
      baseEli: descriptor.baseEli,
      pinnedEli: descriptor.eli,
      requestedAsOf: asOf,
      currentEli: selected.eli,
      currentPromulgation: selected.stateDate,
      sourceUrl,
      actValidFrom: baseInterval.validFrom,
      ...(baseInterval.validTo
        ? { actValidTo: baseInterval.validTo }
        : {}),
      amendmentsAfter: []
    };
  }

  private async checkCurrent(
    descriptor: LegalActDescriptor,
    checkedAt: string
  ): Promise<TemporalFreshnessResult> {
    const fail = (
      status: TemporalFreshnessStatus,
      reason: string,
      extra: Partial<TemporalFreshnessResult> = {}
    ) =>
      this.failure(
        descriptor,
        "CURRENT",
        checkedAt,
        status,
        reason,
        extra
      );

    const baseRefsUrl = apiUrl(
      descriptor.baseEli,
      "/references"
    );
    if (!baseRefsUrl) {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "INVALID_BASE_ELI"
      );
    }

    let baseRefs: unknown;
    try {
      baseRefs = await json(this.fetcher, baseRefsUrl);
    } catch {
      return fail(
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
      return fail(
        "REPEALED_CONSOLIDATED_TEXT",
        "PINNED_CONSOLIDATED_TEXT_REPEALED"
      );
    }

    const current = pickCurrentConsolidated(baseRefs);
    if (!current) {
      return fail(
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
      return fail(
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
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_METADATA_FETCH_FAILED",
        { currentEli: current.eli }
      );
    }

    const act = unwrapAct(metadata) ?? {};
    if (repealedStatus(act.status)) {
      return fail(
        "REPEALED_CONSOLIDATED_TEXT",
        "CURRENT_CONSOLIDATED_TEXT_REPEALED",
        { currentEli: current.eli }
      );
    }

    const promulgation =
      dateOnly(act.promulgation) ||
      dateOnly(act.announcementDate);

    if (!promulgation) {
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_PROMULGATION_MISSING",
        { currentEli: current.eli }
      );
    }

    const amendmentsAfter = mergeAmendments(
      amendmentsBetween(
        baseRefs,
        promulgation,
        "9999-12-31"
      ),
      postTjByApi(currentRefs)
    );

    const common = {
      currentEli: current.eli,
      currentPromulgation: promulgation,
      amendmentsAfter
    };

    if (normalizeEli(descriptor.eli) !== current.eli) {
      return fail(
        "STALE_CONSOLIDATED_TEXT",
        "PINNED_ELI_DIFFERS_FROM_CURRENT",
        common
      );
    }

    if (amendmentsAfter.length > 0) {
      return fail(
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
        return fail(
          "CURRENT_TEXT_REQUIRES_PDF",
          "CURRENT_TEXT_HAS_NO_HTML",
          {
            ...common,
            ...(pdfUrl ? { sourceUrl: pdfUrl } : {})
          }
        );
      }

      return fail(
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
      return fail(
        "SOURCE_METADATA_UNAVAILABLE",
        "CURRENT_TEXT_URL_INVALID",
        common
      );
    }

    return {
      status: "CURRENT",
      mode: "CURRENT",
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

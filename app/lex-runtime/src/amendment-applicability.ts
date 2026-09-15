import type {
  EliFetch,
  TemporalAmendment
} from "./temporal-source-freshness.js";

export type AmendmentApplicabilityStatus =
  | "FUTURE"
  | "EFFECTIVE"
  | "UNKNOWN";

export type AmendmentApplicabilityDecision = {
  eli: string;
  targetDate: string;
  status: AmendmentApplicabilityStatus;
  relationDate?: string;
  promulgation?: string;
  entryIntoForce?: string;
  validFrom?: string;
  effectiveFrom?: string;
  reason?: string;
};

type EliAct = {
  ELI?: unknown;
  promulgation?: unknown;
  announcementDate?: unknown;
  entryIntoForce?: unknown;
  validFrom?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function dateOnly(value: unknown): string {
  const match = text(value).match(
    /^(\d{4}-\d{2}-\d{2})/u
  );
  return match?.[1] ?? "";
}

function normalizeEli(
  value: string
): string {
  const match = value.match(
    /(DU|MP)\/(\d{4})\/(\d+)/u
  );
  return match?.[0] ?? "";
}

function apiUrl(
  eli: string
): string | null {
  const normalized =
    normalizeEli(eli);
  const match = normalized.match(
    /^(DU|MP)\/(\d{4})\/(\d+)$/u
  );
  if (!match) return null;
  return (
    "https://api.sejm.gov.pl/eli/acts/" +
    match[1] +
    "/" +
    match[2] +
    "/" +
    match[3]
  );
}

function unwrapAct(
  value: unknown
): EliAct | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const wrapper =
    value as Record<string, unknown>;

  if (
    wrapper.act &&
    typeof wrapper.act === "object"
  ) {
    return wrapper.act as EliAct;
  }

  return wrapper as EliAct;
}

function earliest(
  values: string[]
): string | undefined {
  return values
    .filter(Boolean)
    .sort()[0];
}

export class AmendmentApplicabilityResolver {
  constructor(
    private readonly fetcher: EliFetch =
      globalThis.fetch.bind(globalThis)
  ) {}

  async classify(
    amendments: TemporalAmendment[],
    targetDate: string
  ): Promise<
    AmendmentApplicabilityDecision[]
  > {
    return Promise.all(
      amendments.map((amendment) =>
        this.classifyOne(
          amendment,
          targetDate
        )
      )
    );
  }

  private async classifyOne(
    amendment: TemporalAmendment,
    targetDate: string
  ): Promise<
    AmendmentApplicabilityDecision
  > {
    const relationDate =
      dateOnly(
        amendment.promulgation
      );
    const url = apiUrl(
      amendment.eli
    );

    if (!url) {
      return {
        eli: amendment.eli,
        targetDate,
        status: "UNKNOWN",
        ...(relationDate
          ? { relationDate }
          : {}),
        reason:
          "INVALID_AMENDMENT_ELI"
      };
    }

    let metadata: unknown;
    try {
      const response =
        await this.fetcher(url, {
          method: "GET",
          redirect: "error",
          headers: {
            Accept:
              "application/json"
          }
        });

      if (!response.ok) {
        return {
          eli: amendment.eli,
          targetDate,
          status: "UNKNOWN",
          ...(relationDate
            ? { relationDate }
            : {}),
          reason:
            "AMENDMENT_METADATA_HTTP_" +
            response.status
        };
      }

      metadata =
        await response.json();
    } catch {
      return {
        eli: amendment.eli,
        targetDate,
        status: "UNKNOWN",
        ...(relationDate
          ? { relationDate }
          : {}),
        reason:
          "AMENDMENT_METADATA_FETCH_FAILED"
      };
    }

    const act =
      unwrapAct(metadata);
    if (!act) {
      return {
        eli: amendment.eli,
        targetDate,
        status: "UNKNOWN",
        ...(relationDate
          ? { relationDate }
          : {}),
        reason:
          "AMENDMENT_METADATA_INVALID"
      };
    }

    const validFrom =
      dateOnly(act.validFrom);
    const entryIntoForce =
      dateOnly(
        act.entryIntoForce
      );
    const promulgation =
      dateOnly(
        act.promulgation
      ) ||
      dateOnly(
        act.announcementDate
      );

    // Use the earliest official effectiveness
    // signal. Relation dates are intentionally
    // included as a conservative lower bound:
    // if ELI says the relation started earlier
    // than the general metadata date, the
    // runtime must not silently classify it as
    // future.
    const effectiveFrom =
      earliest([
        validFrom,
        entryIntoForce,
        relationDate
      ]);

    if (!effectiveFrom) {
      return {
        eli: amendment.eli,
        targetDate,
        status: "UNKNOWN",
        ...(relationDate
          ? { relationDate }
          : {}),
        ...(promulgation
          ? { promulgation }
          : {}),
        reason:
          "AMENDMENT_EFFECT_DATE_UNKNOWN"
      };
    }

    const common = {
      eli: amendment.eli,
      targetDate,
      ...(relationDate
        ? { relationDate }
        : {}),
      ...(promulgation
        ? { promulgation }
        : {}),
      ...(entryIntoForce
        ? { entryIntoForce }
        : {}),
      ...(validFrom
        ? { validFrom }
        : {}),
      effectiveFrom
    };

    return effectiveFrom >
      targetDate
      ? {
          ...common,
          status: "FUTURE"
        }
      : {
          ...common,
          status: "EFFECTIVE"
        };
  }
}

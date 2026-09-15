import { describe, expect, it } from "vitest";
import {
  AmendmentApplicabilityResolver
} from "../src/amendment-applicability.js";
import type {
  TemporalAmendment
} from "../src/temporal-source-freshness.js";

function amendment(
  eli: string,
  options?: {
    relationDate?: string;
    promulgation?: string;
  }
): TemporalAmendment {
  return {
    eli,
    displayAddress: eli,
    promulgation:
      options?.promulgation ?? "",
    ...(options?.relationDate
      ? {
          relationDate:
            options.relationDate
        }
      : {}),
    title: "Ustawa zmieniająca",
    provenance: "API"
  };
}

function metadataFetcher(
  values:
    Record<
      string,
      Record<string, unknown>
    >
) {
  return async (
    input: string | URL
  ): Promise<Response> => {
    const value =
      values[String(input)];

    if (!value) {
      return new Response(
        "{}",
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify(value),
      {
        status: 200,
        headers: {
          "content-type":
            "application/json"
        }
      }
    );
  };
}

describe(
  "AmendmentApplicabilityResolver",
  () => {
    it("classifies a not-yet-effective amendment as FUTURE", async () => {
      const resolver =
        new AmendmentApplicabilityResolver(
          metadataFetcher({
            "https://api.sejm.gov.pl/eli/acts/DU/2026/1001":
              {
                ELI: "DU/2026/1001",
                promulgation:
                  "2026-07-15",
                entryIntoForce:
                  "2026-10-01"
              }
          })
        );

      const [decision] =
        await resolver.classify(
          [
            amendment(
              "DU/2026/1001",
              {
                relationDate:
                  "2026-10-01",
                promulgation:
                  "2026-07-15"
              }
            )
          ],
          "2026-09-15"
        );

      expect(decision).toMatchObject({
        status: "FUTURE",
        effectiveFrom:
          "2026-10-01",
        promulgation:
          "2026-07-15"
      });
    });

    it("classifies an already effective amendment as EFFECTIVE", async () => {
      const resolver =
        new AmendmentApplicabilityResolver(
          metadataFetcher({
            "https://api.sejm.gov.pl/eli/acts/DU/2026/1002":
              {
                ELI: "DU/2026/1002",
                entryIntoForce:
                  "2026-09-01"
              }
          })
        );

      const [decision] =
        await resolver.classify(
          [
            amendment(
              "DU/2026/1002",
              {
                relationDate:
                  "2026-09-01"
              }
            )
          ],
          "2026-09-15"
        );

      expect(decision).toMatchObject({
        status: "EFFECTIVE",
        effectiveFrom:
          "2026-09-01"
      });
    });

    it("uses the earliest official effectiveness signal conservatively", async () => {
      const resolver =
        new AmendmentApplicabilityResolver(
          metadataFetcher({
            "https://api.sejm.gov.pl/eli/acts/DU/2026/1003":
              {
                ELI: "DU/2026/1003",
                entryIntoForce:
                  "2026-10-01"
              }
          })
        );

      const [decision] =
        await resolver.classify(
          [
            amendment(
              "DU/2026/1003",
              {
                relationDate:
                  "2026-09-01"
              }
            )
          ],
          "2026-09-15"
        );

      expect(decision).toMatchObject({
        status: "EFFECTIVE",
        relationDate:
          "2026-09-01",
        entryIntoForce:
          "2026-10-01",
        effectiveFrom:
          "2026-09-01"
      });
    });

    it("fails closed when no effect date can be established", async () => {
      const resolver =
        new AmendmentApplicabilityResolver(
          metadataFetcher({
            "https://api.sejm.gov.pl/eli/acts/DU/2026/1004":
              {
                ELI: "DU/2026/1004",
                promulgation:
                  "2026-07-01"
              }
          })
        );

      const [decision] =
        await resolver.classify(
          [
            amendment(
              "DU/2026/1004",
              {
                promulgation:
                  "2026-07-01"
              }
            )
          ],
          "2026-09-15"
        );

      expect(decision).toMatchObject({
        status: "UNKNOWN",
        reason:
          "AMENDMENT_EFFECT_DATE_UNKNOWN"
      });
    });

    it("fails closed when amendment metadata cannot be fetched", async () => {
      const resolver =
        new AmendmentApplicabilityResolver(
          metadataFetcher({})
        );

      const [decision] =
        await resolver.classify(
          [
            amendment(
              "DU/2026/1999"
            )
          ],
          "2026-09-15"
        );

      expect(decision).toMatchObject({
        status: "UNKNOWN",
        reason:
          "AMENDMENT_METADATA_HTTP_404"
      });
    });
  }
);

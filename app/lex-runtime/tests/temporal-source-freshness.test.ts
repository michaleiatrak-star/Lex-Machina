import { describe, expect, it } from "vitest";
import {
  TemporalSourceFreshnessChecker
} from "../src/temporal-source-freshness.js";
import {
  DeterministicLegalActResolver
} from "../src/legal-act-resolver.js";

const kc =
  new DeterministicLegalActResolver().resolve("KC");

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: {
      "content-type": "application/json"
    }
  });
}

function fixtureFetcher(options?: {
  currentEli?: string;
  textHTML?: boolean;
  textPDF?: boolean;
  amendments?: Array<{
    eli: string;
    promulgation: string;
  }>;
}) {
  const currentEli =
    options?.currentEli ?? "DU/2026/795";
  const amendments = options?.amendments ?? [];

  return async (input: string | URL): Promise<Response> => {
    const url = String(input);

    if (url.endsWith("/DU/1964/93/references")) {
      return jsonResponse({
        "Inf. o tekście jednolitym": [{
          act: {
            ELI: currentEli,
            year: Number(currentEli.split("/")[1]),
            pos: Number(currentEli.split("/")[2]),
            status: "obowiązujący"
          }
        }],
        "Akty zmieniające": amendments.map(
          (item) => ({
            act: {
              ELI: item.eli,
              promulgation: item.promulgation,
              displayAddress: item.eli,
              title: "Ustawa zmieniająca"
            }
          })
        )
      });
    }

    if (url.endsWith("/references")) {
      return jsonResponse({
        "Nowelizacje po tekście jednolitym":
          amendments.map((item) => ({
            act: {
              ELI: item.eli,
              promulgation: item.promulgation,
              displayAddress: item.eli,
              title: "Ustawa zmieniająca"
            }
          }))
      });
    }

    return jsonResponse({
      ELI: currentEli,
      promulgation: "2026-06-17",
      textHTML: options?.textHTML ?? true,
      textPDF: options?.textPDF ?? true
    });
  };
}

describe("TemporalSourceFreshnessChecker", () => {
  it("returns CURRENT only for the pinned in-force t.j. with no later amendments", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher(),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc);

    expect(result).toMatchObject({
      status: "CURRENT",
      currentEli: "DU/2026/795",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html",
      amendmentsAfter: []
    });
  });

  it("detects a newer in-force consolidated text", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        currentEli: "DU/2027/10"
      })
    ).check(kc);

    expect(result).toMatchObject({
      status: "STALE_CONSOLIDATED_TEXT",
      currentEli: "DU/2027/10",
      reason: "PINNED_ELI_DIFFERS_FROM_CURRENT"
    });
  });

  it("blocks when an amendment was promulgated after the t.j.", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/999",
          promulgation: "2026-07-01"
        }]
      })
    ).check(kc);

    expect(result.status).toBe("POST_TJ_AMENDMENTS");
    expect(result.amendmentsAfter).toEqual([
      expect.objectContaining({
        eli: "DU/2026/999",
        provenance: "DATE+API"
      })
    ]);
  });

  it("reports PDF-only current text instead of pretending it is verifiable HTML", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        textHTML: false,
        textPDF: true
      })
    ).check(kc);

    expect(result).toMatchObject({
      status: "CURRENT_TEXT_REQUIRES_PDF",
      currentEli: "DU/2026/795",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf"
    });
  });
});

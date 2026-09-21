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
  relationStatus?: string;
  metadataStatus?: string;
  amendments?: Array<{
    eli: string;
    relationDate: string;
    promulgation?: string;
    entryIntoForce?: string;
  }>;
  amendmentTexts?: Record<string, string>;
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
            status:
              options?.relationStatus ??
              "obowiązujący"
          }
        }],
        "Akty zmieniające": amendments.map(
          (item) => ({
            act: {
              ELI: item.eli,
              date: item.relationDate,
              promulgation:
                item.promulgation ??
                item.relationDate,
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
              date: item.relationDate,
              promulgation:
                item.promulgation ??
                item.relationDate,
              displayAddress: item.eli,
              title: "Ustawa zmieniająca"
            }
          }))
      });
    }

    const amendmentText =
      amendments.find((item) =>
        url.endsWith(
          "/" +
            item.eli +
            "/text.html"
        )
      );

    if (amendmentText) {
      return new Response(
        options?.amendmentTexts?.[
          amendmentText.eli
        ] ??
          "<html><body>Art. 1. Zmiana innej jednostki.</body></html>",
        {
          status: 200,
          headers: {
            "content-type":
              "text/html; charset=utf-8"
          }
        }
      );
    }

    const amendment =
      amendments.find((item) =>
        url.endsWith("/" + item.eli)
      );

    if (amendment) {
      return jsonResponse({
        ELI: amendment.eli,
        promulgation:
          amendment.promulgation ??
          amendment.relationDate,
        textHTML: true,
        textPDF: true,
        ...(amendment.entryIntoForce
          ? {
              entryIntoForce:
                amendment.entryIntoForce
            }
          : {})
      });
    }

    return jsonResponse({
      ELI: currentEli,
      status:
        options?.metadataStatus ??
        "obowiązujący",
      promulgation: "2026-06-17",
      textHTML: options?.textHTML ?? true,
      textPDF: options?.textPDF ?? true
    });
  };
}

function historicalFetcher(options?: {
  amendmentDate?: string;
}) {
  return async (input: string | URL): Promise<Response> => {
    const url = String(input);

    if (url.endsWith("/DU/1964/93/references")) {
      return jsonResponse({
        "Inf. o tekście jednolitym": [
          {
            act: {
              ELI: "DU/2019/1145",
              year: 2019,
              pos: 1145,
              status: "uznany za uchylony"
            }
          },
          {
            act: {
              ELI: "DU/2026/795",
              year: 2026,
              pos: 795,
              status: "obowiązujący"
            }
          }
        ],
        "Akty zmieniające": options?.amendmentDate
          ? [{
              act: {
                ELI: "DU/2020/1000",
                date: options.amendmentDate,
                displayAddress: "Dz.U. 2020 poz. 1000",
                title: "Ustawa zmieniająca"
              }
            }]
          : []
      });
    }

    if (url.endsWith("/DU/1964/93")) {
      return jsonResponse({
        ELI: "DU/1964/93",
        status: "obowiązujący",
        entryIntoForce: "1965-01-01",
        repealDate: "2021-01-01",
        promulgation: "1964-05-18"
      });
    }

    if (url.endsWith("/DU/2019/1145")) {
      return jsonResponse({
        ELI: "DU/2019/1145",
        status: "uznany za uchylony",
        legalStatusDate: "2019-06-01",
        repealDate: "2021-01-01",
        promulgation: "2019-06-19",
        textHTML: true,
        textPDF: true
      });
    }

    if (url.endsWith("/DU/2026/795")) {
      return jsonResponse({
        ELI: "DU/2026/795",
        status: "obowiązujący",
        legalStatusDate: "2026-05-20",
        promulgation: "2026-06-17",
        textHTML: true,
        textPDF: true
      });
    }

    if (
      options?.amendmentDate &&
      url.endsWith("/DU/2020/1000")
    ) {
      return jsonResponse({
        ELI: "DU/2020/1000",
        promulgation: "2020-01-10",
        entryIntoForce:
          options.amendmentDate
      });
    }

    if (url.endsWith("/references")) {
      return jsonResponse({});
    }

    throw new Error("Unexpected historical fixture URL: " + url);
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
      mode: "CURRENT",
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
      mode: "CURRENT",
      currentEli: "DU/2027/10",
      reason: "PINNED_ELI_DIFFERS_FROM_CURRENT"
    });
  });

  it("does not treat the base-act text.html as a current unified text after post-t.j. amendments", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/999",
          relationDate: "2026-07-01",
          promulgation: "2026-06-20",
          entryIntoForce: "2026-07-01"
        }]
      })
    ).check(kc);

    expect(result).toMatchObject({
      status:
        "POST_TJ_AMENDMENTS",
      reason:
        "EFFECTIVE_AMENDMENTS_AFTER_CONSOLIDATED_TEXT"
    });
    expect(result.sourceUrl).toBeUndefined();
  });

  it("keeps an exact article current when every effective post-t.j. amendment provably leaves it untouched", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/999",
          relationDate: "2026-07-01",
          promulgation: "2026-06-20",
          entryIntoForce: "2026-07-01"
        }],
        amendmentTexts: {
          "DU/2026/999":
            "<html><body>Art. 1. W art. 191 § 1 wyrazy X zastępuje się wyrazami Y.</body></html>"
        }
      })
    ).check(kc, {
      claim: "art. 190a KK"
    });

    expect(result).toMatchObject({
      status: "CURRENT",
      currentEli:
        "DU/2026/795",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html",
      reason:
        "POST_TJ_AMENDMENTS_DO_NOT_TOUCH_REQUESTED_ARTICLE"
    });
  });

  it("fails closed when an effective post-t.j. amendment touches the requested article", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/999",
          relationDate: "2026-07-01",
          promulgation: "2026-06-20",
          entryIntoForce: "2026-07-01"
        }],
        amendmentTexts: {
          "DU/2026/999":
            "<html><body>Art. 1. W art. 190a § 1 wyrazy X zastępuje się wyrazami Y.</body></html>"
        }
      })
    ).check(kc, {
      claim: "art. 190a KK"
    });

    expect(result).toMatchObject({
      status:
        "POST_TJ_AMENDMENTS",
      reason:
        "POST_TJ_AMENDMENT_TOUCHES_REQUESTED_ARTICLE"
    });
  });

  it("does not block current law solely for a future amendment", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/1001",
          relationDate: "2026-10-01",
          promulgation: "2026-07-15",
          entryIntoForce: "2026-10-01"
        }]
      }),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc);

    expect(result.status).toBe("CURRENT");
    expect(result.amendmentApplicability).toEqual([
      expect.objectContaining({
        eli: "DU/2026/1001",
        status: "FUTURE",
        effectiveFrom: "2026-10-01"
      })
    ]);
  });

  it("blocks when an amendment effect date cannot be established", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        amendments: [{
          eli: "DU/2026/1002",
          relationDate: "",
          promulgation: "2026-07-15"
        }]
      }),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc);

    expect(result).toMatchObject({
      status: "AMENDMENT_EFFECT_DATE_UNKNOWN",
      reason: "OFFICIAL_AMENDMENT_EFFECT_DATE_UNKNOWN"
    });
    expect(result.amendmentApplicability).toEqual([
      expect.objectContaining({
        eli: "DU/2026/1002",
        status: "UNKNOWN"
      })
    ]);
  });

  it("blocks when the pinned consolidated text is repealed in ELI references", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        relationStatus: "wygaśnięcie aktu"
      })
    ).check(kc);

    expect(result).toMatchObject({
      status: "REPEALED_CONSOLIDATED_TEXT",
      mode: "CURRENT",
      reason: "PINNED_CONSOLIDATED_TEXT_REPEALED"
    });
  });

  it("blocks when current act metadata reports repeal", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        metadataStatus: "uchylony"
      })
    ).check(kc);

    expect(result).toMatchObject({
      status: "REPEALED_CONSOLIDATED_TEXT",
      mode: "CURRENT",
      currentEli: "DU/2026/795",
      reason: "CURRENT_CONSOLIDATED_TEXT_REPEALED"
    });
  });

  it("allows a repealed historical t.j. only for a date when the base act and that t.j. were in force", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      historicalFetcher(),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc, {
      asOf: "2020-06-01"
    });

    expect(result).toMatchObject({
      status: "HISTORICAL",
      mode: "HISTORICAL",
      requestedAsOf: "2020-06-01",
      currentEli: "DU/2019/1145",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2019/1145/text.html",
      actValidFrom: "1965-01-01",
      actValidTo: "2021-01-01"
    });
  });

  it("keeps repeal red when the requested historical date is after the act ceased to be in force", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      historicalFetcher(),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc, {
      asOf: "2021-01-01"
    });

    expect(result).toMatchObject({
      status: "ACT_NOT_IN_FORCE_AT_DATE",
      mode: "HISTORICAL",
      requestedAsOf: "2021-01-01",
      reason: "BASE_ACT_NOT_IN_FORCE_AT_AS_OF"
    });
  });

  it("blocks a historical t.j. when a later amendment was already effective by asOf", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      historicalFetcher({
        amendmentDate: "2020-01-15"
      }),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc, {
      asOf: "2020-06-01"
    });

    expect(result).toMatchObject({
      status: "HISTORICAL_POST_TJ_AMENDMENTS",
      mode: "HISTORICAL",
      currentEli: "DU/2019/1145"
    });
  });

  it("rejects current/future dates from the historical exception", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      historicalFetcher(),
      () => "2026-09-15T20:00:00.000Z"
    ).check(kc, {
      asOf: "2026-09-15"
    });

    expect(result).toMatchObject({
      status: "INVALID_HISTORICAL_DATE",
      mode: "HISTORICAL"
    });
  });

  it("treats an official PDF-only current text as a normal current source", async () => {
    const result = await new TemporalSourceFreshnessChecker(
      fixtureFetcher({
        textHTML: false,
        textPDF: true
      })
    ).check(kc);

    expect(result).toMatchObject({
      status: "CURRENT",
      mode: "CURRENT",
      currentEli: "DU/2026/795",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf"
    });
  });
});

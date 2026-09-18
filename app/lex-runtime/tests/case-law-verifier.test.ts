import { describe, expect, it, vi } from "vitest";
import {
  SupremeCourtCaseVerifier
} from "../src/case-law-verifier.js";

function json(value: unknown): Response {
  return new Response(
    JSON.stringify(value),
    {
      status: 200,
      headers: {
        "content-type": "application/json"
      }
    }
  );
}

function fullText(
  signature: string
): Response {
  const html =
    "<html><body>Sąd Najwyższy " +
    signature +
    " pełny tekst orzeczenia</body></html>";

  return json({
    data: [{
      success: true,
      data: {
        raw: Buffer
          .from(html, "utf8")
          .toString("base64")
      }
    }]
  });
}

describe("SupremeCourtCaseVerifier", () => {
  it("filters near-matches and verifies the exact SN full text", async () => {
    const calls: string[] = [];
    const fetcher = vi.fn(
      async (input: string | URL) => {
        const url = String(input);
        calls.push(url);

        if (
          url.includes(
            "task=searchOrzeczenia"
          )
        ) {
          return json({
            data: [{
              data: [
                {
                  id: "near-1",
                  sygnatura_sprawy:
                    "II CZP 25/11"
                },
                {
                  id: "exact-1",
                  sygnatura_sprawy:
                    "III CZP 25/11",
                  data_wydania:
                    "2011-10-18",
                  forma_orzeczenia:
                    "uchwała"
                }
              ]
            }]
          });
        }

        expect(url).toContain(
          "task=OrzeczeniePlikHtml"
        );
        expect(url).toContain(
          "id=exact-1"
        );
        return fullText(
          "III CZP 25/11"
        );
      }
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher,
        () =>
          "2026-09-15T22:30:00.000Z"
      ).verify({
        claim:
          "sygn. III CZP 25/11",
        signature:
          "III  C.Z.P.  25/11",
        toolCallId:
          "case-tool-1"
      });

    expect(result.status).toBe(
      "FOUND"
    );
    expect(result.rejectedNearMatches)
      .toEqual(["II CZP 25/11"]);
    expect(result.record).toMatchObject({
      claim:
        "sygn. III CZP 25/11",
      kind: "case",
      status: "VERIFIED",
      sourceTier: "R1",
      verificationMethod:
        "web_fetch",
      sourceFormat: "TEXT",
      caseScope: "FULL_TEXT",
      caseSignature:
        "III CZP 25/11"
    });
    expect(result.judgment).toMatchObject({
      signature:
        "III CZP 25/11",
      date: "2011-10-18",
      form: "uchwała",
      contentScope: "FULL_TEXT"
    });
    expect(calls).toHaveLength(2);
  });

  it("verifies an exact quote against the already verified official SN full text", async () => {
    const quote =
      "pełny tekst orzeczenia zawiera tę dokładną wypowiedź";

    const fetcher = vi.fn(
      async (input: string | URL) => {
        const url = String(input);

        if (
          url.includes(
            "task=searchOrzeczenia"
          )
        ) {
          return json({
            data: [{
              data: [{
                id: "quote-1",
                sygnatura_sprawy:
                  "III CZP 25/11",
                data_wydania:
                  "2011-10-18"
              }]
            }]
          });
        }

        const html =
          "<html><body>Sąd Najwyższy " +
          "III CZP 25/11 " +
          quote +
          "</body></html>";

        return json({
          data: [{
            data: {
              raw: Buffer
                .from(
                  html,
                  "utf8"
                )
                .toString(
                  "base64"
                )
            }
          }]
        });
      }
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher,
        () =>
          "2026-09-15T22:30:00.000Z"
      ).verifyExactQuote({
        caseClaim:
          "sygn. III CZP 25/11",
        signature:
          "III CZP 25/11",
        quote,
        toolCallId:
          "case-quote-1"
      });

    expect(result.status).toBe(
      "VERIFIED"
    );
    expect(result.evidenceHash)
      .toMatch(
        /^[a-f0-9]{20}$/u
      );
    expect(result.quoteRecord)
      .toMatchObject({
        claim: quote,
        kind: "case",
        status: "VERIFIED",
        caseScope:
          "EXACT_QUOTE",
        caseSignature:
          "III CZP 25/11"
      });
  });

  it("does not verify a quote absent from the official judgment text", async () => {
    const fetcher = vi.fn(
      async (input: string | URL) => {
        const url = String(input);

        if (
          url.includes(
            "task=searchOrzeczenia"
          )
        ) {
          return json({
            data: [{
              data: [{
                id: "quote-2",
                sygnatura_sprawy:
                  "III CZP 25/11"
              }]
            }]
          });
        }

        return fullText(
          "III CZP 25/11"
        );
      }
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher
      ).verifyExactQuote({
        caseClaim:
          "sygn. III CZP 25/11",
        signature:
          "III CZP 25/11",
        quote:
          "To zdanie nie występuje w oficjalnym tekście orzeczenia.",
        toolCallId:
          "case-quote-2"
      });

    expect(result).toMatchObject({
      status:
        "QUOTE_NOT_FOUND",
      reason:
        "EXACT_QUOTE_NOT_FOUND_IN_OFFICIAL_TEXT"
    });
    expect(result.quoteRecord)
      .toBeUndefined();
  });

  it("returns NOT_FOUND when only a near-match is returned", async () => {
    const fetcher = vi.fn(
      async () =>
        json({
          data: [{
            data: [{
              id: "near",
              sygnatura_sprawy:
                "II NSNc 10/24"
            }]
          }]
        })
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher
      ).verify({
        claim:
          "sygn. I NSNc 10/24",
        signature:
          "I NSNc 10/24",
        toolCallId:
          "case-tool-2"
      });

    expect(result).toMatchObject({
      status: "NOT_FOUND",
      rejectedNearMatches: [
        "II NSNc 10/24"
      ]
    });
    expect(fetcher).toHaveBeenCalledTimes(
      1
    );
  });

  it("returns AMBIGUOUS for multiple exact records instead of choosing one", async () => {
    const fetcher = vi.fn(
      async () =>
        json({
          data: [{
            data: [
              {
                id: "1",
                sygnatura_sprawy:
                  "III CZP 42/22"
              },
              {
                id: "2",
                sygnatura_sprawy:
                  "III CZP 42/22"
              }
            ]
          }]
        })
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher
      ).verify({
        claim:
          "sygn. III CZP 42/22",
        signature:
          "III CZP 42/22",
        toolCallId:
          "case-tool-3"
      });

    expect(result).toMatchObject({
      status: "AMBIGUOUS",
      reason:
        "MULTIPLE_EXACT_SN_RECORDS"
    });
    expect(fetcher).toHaveBeenCalledTimes(
      1
    );
  });

  it("rejects non-SN repertories before network access", async () => {
    const fetcher = vi.fn();

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher
      ).verify({
        claim:
          "sygn. I C 100/15",
        signature:
          "I C 100/15",
        toolCallId:
          "case-tool-4"
      });

    expect(result).toMatchObject({
      status: "OUT_OF_SCOPE",
      reason:
        "INVALID_OR_NON_SN_SIGNATURE"
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("fails closed when official full text does not contain the exact signature", async () => {
    const fetcher = vi.fn(
      async (input: string | URL) => {
        const url = String(input);
        if (
          url.includes(
            "task=searchOrzeczenia"
          )
        ) {
          return json({
            data: [{
              data: [{
                id: "bad-text",
                sygnatura_sprawy:
                  "III CZP 25/11"
              }]
            }]
          });
        }
        return fullText(
          "II CZP 25/11"
        );
      }
    );

    const result =
      await new SupremeCourtCaseVerifier(
        fetcher
      ).verify({
        claim:
          "sygn. III CZP 25/11",
        signature:
          "III CZP 25/11",
        toolCallId:
          "case-tool-5"
      });

    expect(result).toMatchObject({
      status: "OUT_OF_SCOPE",
      reason:
        "SN_FULL_TEXT_IDENTITY_MISMATCH"
    });
  });
});

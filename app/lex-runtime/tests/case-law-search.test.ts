import {
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  CaseLawSearchService
} from "../src/case-law-search.js";

describe(
  "CaseLawSearchService",
  () => {
    it(
      "searches SAOS full text and returns discovery-only candidates",
      async () => {
        const fetcher =
          vi.fn(
            async (
              input:
                string | URL,
              init?:
                RequestInit
            ) => {
              const url =
                new URL(
                  String(input)
                );
              expect(
                url.hostname
              ).toBe(
                "www.saos.org.pl"
              );
              expect(
                url.pathname
              ).toBe(
                "/api/search/judgments"
              );
              expect(
                url.searchParams.get(
                  "all"
                )
              ).toBe(
                "bezpodstawne wzbogacenie"
              );
              expect(
                new Headers(
                  init?.headers
                ).get("accept")
              ).toBe(
                "application/json"
              );

              return new Response(
                JSON.stringify({
                  info: {
                    totalResults:
                      1
                  },
                  items: [
                    {
                      id: 12345,
                      courtType:
                        "COMMON",
                      judgmentDate:
                        "2026-01-12",
                      courtCases: [
                        {
                          caseNumber:
                            "I ACa 10/26"
                        }
                      ],
                      division: {
                        court: {
                          name:
                            "Sąd Apelacyjny w Warszawie"
                        }
                      }
                    }
                  ]
                }),
                {
                  status: 200,
                  headers: {
                    "content-type":
                      "application/json"
                  }
                }
              );
            }
          );

        const result =
          await new CaseLawSearchService(
            fetcher
          ).search({
            source: "SAOS",
            query:
              "bezpodstawne wzbogacenie",
            limit: 5
          });

        expect(
          result.status
        ).toBe("FOUND");
        expect(
          result.total
        ).toBe(1);
        expect(
          result.candidates
        ).toEqual([
          expect.objectContaining({
            source: "SAOS",
            id: "12345",
            caseNumbers: [
              "I ACa 10/26"
            ],
            court:
              "Sąd Apelacyjny w Warszawie",
            contentScope:
              "DISCOVERY"
          })
        ]);
        expect(fetcher)
          .toHaveBeenCalledTimes(
            1
          );
      }
    );

    it(
      "searches CBOSA through POST and resolves candidate documents",
      async () => {
        const fetcher =
          vi.fn(
            async (
              input:
                string | URL,
              init?:
                RequestInit
            ) => {
              const url =
                String(input);

              if (
                url.endsWith(
                  "/cbo/search"
                )
              ) {
                expect(
                  init?.method
                ).toBe("POST");
                expect(
                  String(init?.body)
                ).toContain(
                  "wszystkieSlowa=bezczynno"
                );
                return new Response(
                  [
                    "<html><body>",
                    "Znaleziono 1 orzeczenie",
                    '<a href="/doc/ABCDEF1234">wynik</a>',
                    "</body></html>"
                  ].join(""),
                  {
                    status: 200,
                    headers: {
                      "content-type":
                        "text/html; charset=utf-8"
                    }
                  }
                );
              }

              if (
                url.endsWith(
                  "/doc/ABCDEF1234"
                )
              ) {
                return new Response(
                  [
                    "<html><head>",
                    "<title>II SAB/Wa 123/26 - Wyrok WSA</title>",
                    "</head><body><table>",
                    '<tr><td class="lista-label">Sąd</td>',
                    '<td class="info-list-value">Wojewódzki Sąd Administracyjny w Warszawie</td></tr>',
                    '<tr><td class="lista-label">Data orzeczenia</td>',
                    '<td class="info-list-value">2026-02-03</td></tr>',
                    "</table></body></html>"
                  ].join(""),
                  {
                    status: 200,
                    headers: {
                      "content-type":
                        "text/html; charset=utf-8"
                    }
                  }
                );
              }

              throw new Error(
                "unexpected url: " +
                url
              );
            }
          );

        const result =
          await new CaseLawSearchService(
            fetcher
          ).search({
            source: "CBOSA",
            query: "bezczynność",
            limit: 1
          });

        expect(
          result.status
        ).toBe("FOUND");
        expect(
          result.total
        ).toBe(1);
        expect(
          result.candidates
        ).toEqual([
          expect.objectContaining({
            source:
              "CBOSA",
            id:
              "ABCDEF1234",
            caseNumbers: [
              "II SAB/Wa 123/26"
            ],
            court:
              "Wojewódzki Sąd Administracyjny w Warszawie",
            judgmentDate:
              "2026-02-03",
            contentScope:
              "DISCOVERY"
          })
        ]);
        expect(fetcher)
          .toHaveBeenCalledTimes(
            2
          );
      }
    );

    it(
      "fails closed when CBOSA result-count contract drifts",
      async () => {
        const fetcher =
          vi.fn(
            async () =>
              new Response(
                "<html><body>brak rozpoznawalnego licznika</body></html>",
                {
                  status: 200
                }
              )
          );

        const result =
          await new CaseLawSearchService(
            fetcher
          ).search({
            source: "CBOSA",
            query:
              "postępowanie",
            limit: 1
          });

        expect(
          result
        ).toMatchObject({
          status:
            "OUT_OF_SCOPE",
          reason:
            "CBOSA_RESULT_COUNT_DRIFT"
        });
      }
    );
  }
);

import {
  describe,
  expect,
  it
} from "vitest";
import {
  FEDERATED_LEGAL_TOOL_NAMES,
  LegalFederationToolRuntime,
  annotateFederatedLegalContent
} from "../src/legal-federation-tool-runtime.js";

describe(
  "LegalFederationToolRuntime",
  () => {
    it(
      "exposes the legal federation broker and local source assessor",
      () => {
        const runtime =
          new LegalFederationToolRuntime();
        const names =
          runtime.schemas().map(
            (schema) =>
              schema.function.name
          );

        expect(names).toEqual([
          "list_federated_legal_sources",
          "search_federated_legal_sources",
          "get_federated_legal_document",
          "call_federated_legal_source",
          "assess_legal_source",
          "fetch_auxiliary_legal_source",
          "federated_legal_coverage"
        ]);
        expect(
          [...FEDERATED_LEGAL_TOOL_NAMES]
        ).toEqual(names);

        const search =
          runtime.schemas().find(
            (schema) =>
              schema.function.name ===
              "search_federated_legal_sources"
          );
        const params =
          search?.function
            .parameters as
            Record<string, unknown>;
        const properties =
          params["properties"] as
            Record<string, unknown>;
        const source =
          properties["source"] as {
            enum?: string[];
          };
        expect(
          source.enum
        ).toEqual([
          "saos",
          "nsa",
          "isap",
          "krs",
          "eureka",
          "kio",
          "uodo",
          "eu-sparql",
          "eu-compliance",
          "legalize"
        ]);
      }
    );

    it(
      "serves coverage locally so federation fallback policy works without starting an upstream process",
      async () => {
        const runtime =
          new LegalFederationToolRuntime();
        const [result] =
          await runtime.runTools([
            {
              id:
                "coverage-1",
              name:
                "federated_legal_coverage",
              input: {}
            }
          ]);
        expect(result).toBeDefined();

        const payload =
          JSON.parse(
            result!.content
          ) as {
            status: string;
            aggregatorPackage: string;
            sources: Array<{
              source: string;
              fallback: string;
              sourcePolicy: {
                sourceTier: string;
                provenance: string;
                verificationAuthority: string;
                verificationEligible: boolean;
                crossCheckRequired: boolean;
              };
            }>;
            policy: {
              verificationAuthority: string;
              emptySearch: string;
              privacy: string;
              sourceTierCoverage: {
                tier1: string;
                tier2A: string;
                tier2B: string;
                tier3: string;
              };
            };
          };

        expect(
          payload.status
        ).toBe("OK");
        expect(
          payload.aggregatorPackage
        ).toBe(
          "prawo-pl-mcp==0.1.4"
        );
        expect(
          payload.sources
        ).toHaveLength(10);
        expect(
          payload.sources.map(
            (source) =>
              source.source
          )
        ).toContain(
          "eureka"
        );
        expect(
          payload.policy
            .verificationAuthority
        ).toBe(
          "LEX_NATIVE_ONLY"
        );
        expect(
          payload.policy
            .emptySearch
        ).toBe(
          "OUT_OF_SCOPE_UNTIL_FALLBACK_CHECKED"
        );
        expect(
          payload.policy
            .privacy
        ).toContain(
          "NO_CASE_FACTS"
        );
        expect(
          payload.policy
            .sourceTierCoverage
            .tier2B
        ).toBe(
          "SAFE_AUXILIARY_HTTPS_RETRIEVER_AND_RUNTIME_HARD_GATE_IMPLEMENTED"
        );
        expect(
          payload.policy
            .sourceTierCoverage
            .tier3
        ).toContain(
          "SAFE_AUXILIARY_HTTPS_RETRIEVER_AND_RUNTIME_HARD_GATE_IMPLEMENTED"
        );
        expect(
          payload.sources.find(
            (source) =>
              source.source ===
              "isap"
          )?.sourcePolicy
        ).toMatchObject({
          sourceTier: "R1",
          verificationAuthority:
            "LEX_NATIVE_ONLY",
          verificationEligible:
            false
        });
        expect(
          payload.sources.find(
            (source) =>
              source.source ===
              "legalize"
          )?.sourcePolicy
        ).toMatchObject({
          sourceTier: "R3",
          crossCheckRequired:
            true
        });
      }
    );

    it(
      "classifies auxiliary URLs locally but leaves higher-tier cross-check attestation to the session ledger",
      async () => {
        const runtime =
          new LegalFederationToolRuntime();

        const [known] =
          await runtime.runTools([
            {
              id:
                "assess-known",
              name:
                "assess_legal_source",
              input: {
                claim:
                  "art. 5 KC",
                url:
                  "https://prawo.pl/prawo/example",
                updatedAt:
                  "2026-09-01"
              }
            }
          ]);

        expect(
          JSON.parse(
            known?.content ??
              "{}"
          )
        ).toMatchObject({
          classification:
            "KNOWN_DOMAIN",
          candidate: {
            claim:
              "art. 5 KC",
            tier:
              "R2B",
            crossCheckStatus:
              "PENDING"
          },
          assessment: {
            higherTierCrossCheckSatisfied:
              false,
            canBeSoleLegalBasis:
              false,
            canCreateVerifiedMarker:
              false
          }
        });

        const [unknown] =
          await runtime.runTools([
            {
              id:
                "assess-unknown",
              name:
                "assess_legal_source",
              input: {
                url:
                  "https://nowy-blog-prawny.example/post"
              }
            }
          ]);

        expect(
          JSON.parse(
            unknown?.content ??
              "{}"
          )
        ).toMatchObject({
          classification:
            "CONSERVATIVE_R3",
          candidate: {
            tier: "R3",
            crossCheckStatus:
              "PENDING"
          },
          assessment: {
            requiresHigherTierCrossCheck:
              true,
            canCreateVerifiedMarker:
              false
          }
        });

        const assessSchema =
          runtime.schemas().find(
            (schema) =>
              schema.function.name ===
              "assess_legal_source"
          );
        const params =
          assessSchema?.function
            .parameters as {
              properties?: Record<
                string,
                unknown
              >;
            };

        expect(
          params.properties
        ).not.toHaveProperty(
          "crossCheckStatus"
        );
        expect(
          params.properties
        ).not.toHaveProperty(
          "crossCheckUrl"
        );
      }
    );

    it(
      "fetches an R2B page through the safe auxiliary retriever without upgrading it to verified evidence",
      async () => {
        const runtime =
          new LegalFederationToolRuntime({
            async fetch(
              url: string
            ) {
              expect(url).toBe(
                "https://prawo.pl/prawo/example"
              );
              return {
                requestedUrl:
                  url,
                finalUrl:
                  url,
                contentType:
                  "text/html; charset=utf-8",
                bytes: 321,
                sha256:
                  "a".repeat(64),
                fetchedAt:
                  "2026-09-22T07:30:00.000Z",
                text:
                  "Komentarz pomocniczy do art. 5 KC.",
                publishedAt:
                  "2026-08-01",
                updatedAt:
                  "2026-09-20",
                redirectCount: 0
              };
            }
          });

        const [result] =
          await runtime.runTools([
            {
              id:
                "fetch-aux-1",
              name:
                "fetch_auxiliary_legal_source",
              input: {
                url:
                  "https://prawo.pl/prawo/example",
                claim:
                  "art. 5 KC"
              }
            }
          ]);

        expect(
          JSON.parse(
            result?.content ??
              "{}"
          )
        ).toMatchObject({
          status: "OK",
          classification:
            "KNOWN_DOMAIN",
          candidate: {
            claim:
              "art. 5 KC",
            sourceTier:
              undefined,
            tier: "R2B",
            crossCheckStatus:
              "PENDING",
            provenance: {
              accessMode:
                "DIRECT_LIVE",
              updatedAt:
                "2026-09-20"
            }
          },
          assessment: {
            auxiliaryOnly:
              true,
            canBeSoleLegalBasis:
              false,
            canCreateVerifiedMarker:
              false,
            higherTierCrossCheckSatisfied:
              false
          },
          retrieval: {
            sha256:
              "a".repeat(64),
            text:
              "Komentarz pomocniczy do art. 5 KC.",
            textTruncated:
              false
          }
        });
      }
    );

    it(
      "refuses to use the auxiliary retriever for known R1/R2A URLs or protected case tokens",
      async () => {
        const runtime =
          new LegalFederationToolRuntime({
            async fetch() {
              throw new Error(
                "NETWORK_SHOULD_NOT_RUN"
              );
            }
          });

        const [official] =
          await runtime.runTools([
            {
              id:
                "fetch-official",
              name:
                "fetch_auxiliary_legal_source",
              input: {
                url:
                  "https://eli.gov.pl/eli/DU/2026/1"
              }
            }
          ]);
        expect(
          JSON.parse(
            official?.content ??
              "{}"
          )
        ).toMatchObject({
          status:
            "POLICY_BLOCKED",
          error:
            "AUX_SOURCE_REQUIRES_R2B_R3"
        });

        const [protectedInput] =
          await runtime.runTools([
            {
              id:
                "fetch-protected",
              name:
                "fetch_auxiliary_legal_source",
              input: {
                url:
                  "https://prawo.pl/example",
                claim:
                  "[PII:PERSON:0001]"
              }
            }
          ]);
        expect(
          JSON.parse(
            protectedInput
              ?.content ??
              "{}"
          )
        ).toMatchObject({
          status:
            "POLICY_BLOCKED",
          error:
            "AUX_SOURCE_CASE_DATA_FORBIDDEN"
        });
      }
    );

    it(
      "annotates federated payloads with immutable Lex source policy metadata",
      () => {
        const objectPayload =
          JSON.parse(
            annotateFederatedLegalContent(
              "isap",
              JSON.stringify({
                status: "OK",
                items: [
                  {
                    id: "DU/2026/1"
                  }
                ]
              })
            )
          ) as {
            status: string;
            _lexSourcePolicy: {
              sourceTier: string;
              verificationAuthority: string;
              verificationEligible: boolean;
            };
          };

        expect(
          objectPayload.status
        ).toBe("OK");
        expect(
          objectPayload
            ._lexSourcePolicy
        ).toMatchObject({
          sourceTier: "R1",
          verificationAuthority:
            "LEX_NATIVE_ONLY",
          verificationEligible:
            false
        });

        const arrayPayload =
          JSON.parse(
            annotateFederatedLegalContent(
              "legalize",
              JSON.stringify([
                {
                  id: "x"
                }
              ])
            )
          ) as {
            results: unknown[];
            _lexSourcePolicy: {
              sourceTier: string;
              crossCheckRequired: boolean;
            };
          };

        expect(
          arrayPayload.results
        ).toHaveLength(1);
        expect(
          arrayPayload
            ._lexSourcePolicy
        ).toMatchObject({
          sourceTier: "R3",
          crossCheckRequired:
            true
        });
      }
    );
  }
);

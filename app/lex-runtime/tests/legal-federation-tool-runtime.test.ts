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
          "POLICY_AND_RUNTIME_HARD_GATE_IMPLEMENTED_GENERIC_RETRIEVER_NOT_IMPLEMENTED"
        );
        expect(
          payload.policy
            .sourceTierCoverage
            .tier3
        ).toContain(
          "POLICY_AND_RUNTIME_HARD_GATE_IMPLEMENTED"
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
      "classifies auxiliary URLs locally and requires a real known R1/R2A cross-check before marking it confirmed",
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
                url:
                  "https://prawo.pl/prawo/example",
                updatedAt:
                  "2026-09-01",
                crossCheckStatus:
                  "CONFIRMED_R1_R2A",
                crossCheckUrl:
                  "https://eli.gov.pl/eli/DU/2026/1"
              }
            }
          ]);

        const knownPayload =
          JSON.parse(
            known?.content ??
              "{}"
          ) as {
            candidate: {
              tier: string;
              crossCheckTier?: string;
            };
            assessment: {
              canBeSoleLegalBasis: boolean;
              canCreateVerifiedMarker: boolean;
              higherTierCrossCheckSatisfied: boolean;
            };
          };

        expect(
          knownPayload
            .candidate
            .tier
        ).toBe("R2B");
        expect(
          knownPayload
            .candidate
            .crossCheckTier
        ).toBe("R1");
        expect(
          knownPayload
            .assessment
            .higherTierCrossCheckSatisfied
        ).toBe(true);
        expect(
          knownPayload
            .assessment
            .canBeSoleLegalBasis
        ).toBe(false);
        expect(
          knownPayload
            .assessment
            .canCreateVerifiedMarker
        ).toBe(false);

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

        const [invalidCrossCheck] =
          await runtime.runTools([
            {
              id:
                "assess-bad-crosscheck",
              name:
                "assess_legal_source",
              input: {
                url:
                  "https://prawo.pl/prawo/example",
                crossCheckStatus:
                  "CONFIRMED_R1_R2A",
                crossCheckUrl:
                  "https://example.com/not-authoritative"
              }
            }
          ]);

        expect(
          JSON.parse(
            invalidCrossCheck
              ?.content ??
              "{}"
          )
        ).toMatchObject({
          status:
            "SOURCE_UNAVAILABLE",
          error:
            "LEGAL_SOURCE_CROSSCHECK_REQUIRES_KNOWN_R1_R2A_URL"
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

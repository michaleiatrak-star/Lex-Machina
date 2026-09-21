import {
  describe,
  expect,
  it
} from "vitest";
import {
  FEDERATED_LEGAL_TOOL_NAMES,
  LegalFederationToolRuntime
} from "../src/legal-federation-tool-runtime.js";

describe(
  "LegalFederationToolRuntime",
  () => {
    it(
      "exposes one five-tool broker for all ten legal source families",
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
            }>;
            policy: {
              verificationAuthority: string;
              emptySearch: string;
              privacy: string;
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
      }
    );
  }
);

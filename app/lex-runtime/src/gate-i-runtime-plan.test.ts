import {
  describe,
  expect,
  it
} from "vitest";
import {
  GATE_I_WORKFLOWS,
  gateIRuntimePlan
} from "./gate-i-runtime-plan.js";

describe(
  "Gate I runtime ownership plan",
  () => {
    it(
      "classifies every canonical stage and mandatory policy for every workflow",
      () => {
        for (
          const workflow
          of GATE_I_WORKFLOWS
        ) {
          const plan =
            gateIRuntimePlan(
              workflow,
              null
            );
          expect(
            plan.result,
            JSON.stringify(
              plan,
              null,
              2
            )
          ).toBe("PASS");
          expect(
            plan.stageOwnership
              .length
          ).toBeGreaterThan(0);
          expect(
            plan.policyOwnership
              .length
          ).toBeGreaterThan(0);
        }
      }
    );

    it(
      "keeps citation and source mechanics outside model ownership in every workflow",
      () => {
        for (
          const workflow
          of GATE_I_WORKFLOWS
        ) {
          const plan =
            gateIRuntimePlan(
              workflow,
              null
            );
          const byPolicy =
            new Map(
              plan.policyOwnership
                .map(
                  (item) => [
                    item.policy,
                    item.phase
                  ]
                )
            );

          expect(
            byPolicy.get(
              "SOURCE_HIERARCHY"
            )
          ).toBe(
            "TOOL_VERIFICATION"
          );
          expect(
            byPolicy.get(
              "TEMPORAL_FRESHNESS"
            )
          ).toBe(
            "TOOL_VERIFICATION"
          );
          expect(
            byPolicy.get(
              "CITATION_LEDGER"
            )
          ).toBe(
            "POST_DRAFT_VALIDATION"
          );
          expect(
            byPolicy.get(
              "CASE_SIGNATURES"
            )
          ).toBe(
            "TOOL_VERIFICATION"
          );
          expect(
            byPolicy.get(
              "DOCUMENT_CITATIONS"
            )
          ).toBe(
            "POST_DRAFT_VALIDATION"
          );
        }
      }
    );

    it(
      "moves case-law search, signature verification and freshness to runtime",
      () => {
        const plan =
          gateIRuntimePlan(
            "CASE_LAW_V1",
            "orzeczenia-sadowe-v2"
          );
        expect(
          plan.runtimeStages
        ).toEqual(
          expect.arrayContaining([
            "SEARCH",
            "SIGNATURE_AND_FULLTEXT_VERIFY",
            "FRESHNESS"
          ])
        );
        expect(
          plan.semanticStages
        ).toEqual(
          expect.arrayContaining([
            "RISK_PROFILE",
            "ELEMENTS_AND_BURDEN",
            "DIRECTION_TEST",
            "CATEGORIZE"
          ])
        );
      }
    );

    it(
      "keeps simple-letter intake and escalation in runtime while drafting remains semantic",
      () => {
        const plan =
          gateIRuntimePlan(
            "SIMPLE_LETTER_V1",
            "pisma-proste-v2"
          );
        expect(
          plan.runtimeStages
        ).toEqual([
          "INTAKE",
          "ESCALATION_CHECK"
        ]);
        expect(
          plan.semanticStages
        ).toEqual([
          "DRAFT"
        ]);
        expect(
          plan.validationStages
        ).toEqual([
          "HYBRID_VALIDATION",
          "FINALIZE"
        ]);
      }
    );
  }
);

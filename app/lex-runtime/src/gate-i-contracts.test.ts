import {
  describe,
  expect,
  it
} from "vitest";
import {
  evaluateGateIInputCompleteness,
  gateIWorkflowContract
} from "./gate-i-contracts.js";
import type {
  DeterministicWorkflowId
} from "./deterministic-workflow.js";

const WORKFLOWS:
  DeterministicWorkflowId[] = [
    "LEGAL_QUERY_V1",
    "LEGAL_GUIDE_V1",
    "SIMPLE_LETTER_V1",
    "PROCESS_PLEADING_V1",
    "COURT_ANALYSIS_V1",
    "EVIDENCE_ANALYSIS_V1",
    "STATUTE_ANALYSIS_V1",
    "CONTRACT_ANALYSIS_V1",
    "CHRONOLOGY_V1",
    "CASE_LAW_V1",
    "WITNESS_QUESTIONING_V1",
    "CLIENT_REPORT_V1",
    "SITUATION_REPORT_V1"
  ];

describe(
  "Gate I workflow contracts",
  () => {
    it(
      "classifies every deterministic workflow",
      () => {
        for (
          const workflow
          of WORKFLOWS
        ) {
          const contract =
            gateIWorkflowContract(
              workflow,
              null
            );
          expect(
            contract.workflow
          ).toBe(workflow);
          expect(
            contract
              .canonicalStages
              .length
          ).toBeGreaterThan(0);
          expect(
            contract
              .mandatoryPolicies
          ).toContain(
            "ROUTER_FIRST"
          );
          expect(
            contract
              .mandatoryPolicies
          ).toContain(
            "CITATION_LEDGER"
          );
          expect(
            contract
              .mandatoryPolicies
          ).toContain(
            "CASE_SIGNATURES"
          );
        }
      }
    );

    it(
      "uses durable case state only where persisted multi-turn state is already required",
      () => {
        expect(
          gateIWorkflowContract(
            "PROCESS_PLEADING_V1",
            "pisma-procesowe-v3"
          ).stateModel
        ).toBe("DURABLE_CASE");
        expect(
          gateIWorkflowContract(
            "COURT_ANALYSIS_V1",
            "analiza-sadowa-v6"
          ).stateModel
        ).toBe("DURABLE_CASE");
        expect(
          gateIWorkflowContract(
            "CHRONOLOGY_V1",
            "chronologia-sprawy-v1"
          ).stateModel
        ).toBe("DURABLE_CASE");
        expect(
          gateIWorkflowContract(
            "CONTRACT_ANALYSIS_V1",
            "analizator-umow-v1"
          ).stateModel
        ).toBe("DURABLE_CASE");
        expect(
          gateIWorkflowContract(
            "EVIDENCE_ANALYSIS_V1",
            "analizator-dowodow-v3"
          ).stateModel
        ).toBe("DURABLE_CASE");
        expect(
          gateIWorkflowContract(
            "WITNESS_QUESTIONING_V1",
            "przesluchanie-swiadkow-v2-min90"
          ).stateModel
        ).toBe("DURABLE_CASE");
      }
    );

    it(
      "uses durable session state for the legal guide",
      () => {
        expect(
          gateIWorkflowContract(
            "LEGAL_GUIDE_V1",
            "przewodnik-prawny-v2"
          ).stateModel
        ).toBe("DURABLE_SESSION");
      }
    );

    it(
      "fails closed when the user explicitly refers to a missing attachment",
      () => {
        expect(
          evaluateGateIInputCompleteness(
            "Przeanalizuj dokument w załączniku.",
            0
          )
        ).toEqual({
          result: "BLOCKED",
          attachmentAssertion:
            true,
          attachmentCount: 0,
          reason:
            "ATTACHMENT_ASSERTED_BUT_MISSING"
        });

        expect(
          evaluateGateIInputCompleteness(
            "Przeanalizuj dokument w załączniku.",
            1
          ).result
        ).toBe("PASS");
      }
    );

    it(
      "does not demand an attachment for an abstract legal question",
      () => {
        expect(
          evaluateGateIInputCompleteness(
            "Jak rozumieć art. 5 KC?",
            0
          ).result
        ).toBe("PASS");
      }
    );
  }
);

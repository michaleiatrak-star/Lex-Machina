import {
  describe,
  expect,
  it
} from "vitest";
import {
  completeOrderedCaseExecution,
  createOrderedCaseWorkflowState,
  markOrderedCaseCheckpointNotApplicable,
  nextOrderedCaseCheckpoint,
  orderedCaseWorkflowSequence,
  requireOrderedCaseExecutionPermit
} from "./ordered-case-workflow-state.js";

const CASE_ID =
  "case_" + "a".repeat(32);

describe(
  "ordered case workflows",
  () => {
    it(
      "keeps evidence analysis in the canonical skill pipeline order",
      () => {
        let state =
          createOrderedCaseWorkflowState(
            "EVIDENCE_ANALYSIS_V1",
            CASE_ID
          );

        expect(
          nextOrderedCaseCheckpoint(
            state
          )
        ).toBe(
          "AD-KROK0-BLOKADA"
        );

        for (
          const checkpoint
          of orderedCaseWorkflowSequence(
            "EVIDENCE_ANALYSIS_V1"
          )
        ) {
          const permit =
            requireOrderedCaseExecutionPermit(
              state
            );
          expect(
            permit.checkpoint
          ).toBe(
            checkpoint
          );
          state =
            completeOrderedCaseExecution(
              state,
              permit,
              [
                "artifact://artifact_1234567890abcdef"
              ]
            );
        }

        expect(state.status)
          .toBe("COMPLETE");
        expect(
          nextOrderedCaseCheckpoint(
            state
          )
        ).toBeNull();
      }
    );

    it(
      "permits only declared optional evidence checkpoints to be N/A",
      () => {
        let state =
          createOrderedCaseWorkflowState(
            "EVIDENCE_ANALYSIS_V1",
            CASE_ID
          );

        for (
          let index = 0;
          index < 6;
          index += 1
        ) {
          const permit =
            requireOrderedCaseExecutionPermit(
              state
            );
          state =
            completeOrderedCaseExecution(
              state,
              permit,
              [
                "artifact://artifact_1234567890abcdef"
              ]
            );
        }

        const optionalPermit =
          requireOrderedCaseExecutionPermit(
            state
          );
        expect(
          optionalPermit.checkpoint
        ).toBe(
          "AD-BLOKG-STRONY"
        );
        state =
          markOrderedCaseCheckpointNotApplicable(
            state,
            optionalPermit,
            "Materiał nie zawiera odrębnego bloku stron wymagającego tej analizy.",
            [
              "artifact://artifact_1234567890abcdef"
            ]
          );
        expect(
          state.history.at(-1)
            ?.outcome
        ).toBe("NA");

        const nextPermit =
          requireOrderedCaseExecutionPermit(
            state
          );
        expect(
          nextPermit.checkpoint
        ).toBe(
          "AD-BLOKJ-LAPSUSY"
        );
      }
    );

    it(
      "rejects stale permits",
      () => {
        let state =
          createOrderedCaseWorkflowState(
            "WITNESS_QUESTIONING_V1",
            CASE_ID
          );
        const permit =
          requireOrderedCaseExecutionPermit(
            state
          );
        state =
          completeOrderedCaseExecution(
            state,
            permit,
            [
              "artifact://artifact_1234567890abcdef"
            ]
          );

        expect(() =>
          completeOrderedCaseExecution(
            state,
            permit,
            [
              "artifact://artifact_1234567890abcdef"
            ]
          )
        ).toThrow(
          "ORDERED_WORKFLOW_PERMIT_STALE"
        );
      }
    );

    it(
      "never allows a mandatory witness checkpoint to be skipped as N/A",
      () => {
        const state =
          createOrderedCaseWorkflowState(
            "WITNESS_QUESTIONING_V1",
            CASE_ID
          );
        const permit =
          requireOrderedCaseExecutionPermit(
            state
          );
        expect(
          permit.checkpoint
        ).toBe(
          "PRE-W1a-SD-VER"
        );

        expect(() =>
          markOrderedCaseCheckpointNotApplicable(
            state,
            permit,
            "Nie dotyczy.",
            [
              "artifact://artifact_1234567890abcdef"
            ]
          )
        ).toThrow(
          "ORDERED_WORKFLOW_NA_NOT_ALLOWED"
        );
      }
    );
  }
);

import {
  describe,
  expect,
  it
} from "vitest";
import {
  completeContractCheckpoint,
  createContractAnalysisState
} from "./contract-analysis-state.js";
import {
  completeContractExecution,
  requireContractExecutionPermit
} from "./contract-analysis-execution-gate.js";

const CASE_ID =
  "case_" + "1".repeat(32);

describe(
  "contract-analysis execution gate",
  () => {
    it(
      "issues one permit for the current AU checkpoint",
      () => {
        const state =
          createContractAnalysisState(
            CASE_ID,
            "ANALYSIS"
          );
        const permit =
          requireContractExecutionPermit(
            state
          );
        expect(permit).toEqual({
          revision: 1,
          mode: "ANALYSIS",
          stage: "INTAKE",
          checkpoint: "AU-F0"
        });

        const next =
          completeContractExecution(
            state,
            permit,
            [
              "audit://contract/session/AU-F0"
            ]
          );
        expect(next.revision)
          .toBe(2);
        expect(
          next.closedCheckpoints
        ).toEqual([
          "AU-F0"
        ]);
      }
    );

    it(
      "rejects a stale permit after another transition",
      () => {
        const state =
          createContractAnalysisState(
            CASE_ID,
            "DRAFT"
          );
        const permit =
          requireContractExecutionPermit(
            state
          );
        const changed =
          completeContractCheckpoint(
            state,
            "AU-F0",
            [
              "audit://contract/other/AU-F0"
            ]
          );

        expect(() =>
          completeContractExecution(
            changed,
            permit,
            [
              "audit://contract/stale/AU-F0"
            ]
          )
        ).toThrow(
          "CONTRACT_STATE_CONFLICT"
        );
      }
    );
  }
);

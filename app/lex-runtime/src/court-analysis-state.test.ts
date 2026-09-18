import {
  describe,
  expect,
  it
} from "vitest";
import {
  completeCourtAnalysisCheckpoint,
  createCourtAnalysisState,
  nextCourtAnalysisCheckpoint,
  validateCourtAnalysisState,
  type CourtAnalysisCheckpoint,
  type CourtAnalysisState
} from "./court-analysis-state.js";

const CASE_ID =
  "case_" +
  "b".repeat(32);

function close(
  state: CourtAnalysisState,
  checkpoint:
    CourtAnalysisCheckpoint
): CourtAnalysisState {
  return completeCourtAnalysisCheckpoint(
    state,
    checkpoint,
    [
      `audit://court/${checkpoint}`
    ],
    "2026-09-18T08:00:00.000Z"
  );
}

describe(
  "deterministic court analysis state",
  () => {
    it(
      "enforces SD scan, four passes, double verification and delivery order",
      () => {
        let state =
          createCourtAnalysisState(
            CASE_ID,
            "2026-09-18T07:59:00.000Z"
          );

        expect(state.stage)
          .toBe("EVIDENCE_SCAN");
        expect(
          nextCourtAnalysisCheckpoint(
            state
          )
        ).toBe(
          "SD_VER_COMPLETE"
        );

        state = close(
          state,
          "SD_VER_COMPLETE"
        );
        expect(state.stage)
          .toBe("PASS_I_FACTS");

        state = close(
          state,
          "PASS_I_ISOLATION_CLEAN"
        );
        expect(state.stage)
          .toBe("PASS_II_LAW");

        state = close(
          state,
          "PASS_II_SOURCES_VERIFIED"
        );
        expect(state.stage)
          .toBe(
            "PASS_III_ADVERSARIAL"
          );

        state = close(
          state,
          "FIRST_VERIFICATION_COMPLETE"
        );
        expect(state.stage)
          .toBe(
            "PASS_IV_FINAL_VERIFICATION"
          );

        state = close(
          state,
          "FINAL_VERIFICATION_COMPLETE"
        );
        expect(state.stage)
          .toBe(
            "PASS_IV_FINAL_VERIFICATION"
          );
        expect(
          nextCourtAnalysisCheckpoint(
            state
          )
        ).toBe(
          "FINAL_GATE_APPROVED"
        );

        state = close(
          state,
          "FINAL_GATE_APPROVED"
        );
        expect(state.stage)
          .toBe("FINAL_REPORT");

        state = close(
          state,
          "FINAL_REPORT_PRESENTED"
        );
        expect(state.stage)
          .toBe(
            "SITUATIONAL_REPORT"
          );

        state = close(
          state,
          "SITUATIONAL_REPORT_PRESENTED"
        );
        expect(state.stage)
          .toBe(
            "PROCESS_PLEADING_OFFER"
          );

        state = close(
          state,
          "PROCESS_PLEADING_OFFER_PRESENTED"
        );
        expect(state.stage)
          .toBe("COMPLETE");
        expect(
          nextCourtAnalysisCheckpoint(
            state
          )
        ).toBeNull();
      }
    );

    it(
      "blocks skipping directly to a later verification or final report",
      () => {
        const state =
          createCourtAnalysisState(
            CASE_ID
          );

        expect(() =>
          completeCourtAnalysisCheckpoint(
            state,
            "FIRST_VERIFICATION_COMPLETE",
            [
              "audit://invalid/skip"
            ]
          )
        ).toThrow(
          "COURT_ANALYSIS_CHECKPOINT_OUT_OF_ORDER"
        );

        const corrupted = {
          ...state,
          stage:
            "FINAL_REPORT" as const,
          closedCheckpoints: [
            "FINAL_GATE_APPROVED" as const
          ]
        };
        expect(() =>
          validateCourtAnalysisState(
            corrupted
          )
        ).toThrow(
          "COURT_ANALYSIS_FINAL_GATE_INVALID"
        );
      }
    );

    it(
      "requires audit evidence for every checkpoint",
      () => {
        const state =
          createCourtAnalysisState(
            CASE_ID
          );

        expect(() =>
          completeCourtAnalysisCheckpoint(
            state,
            "SD_VER_COMPLETE",
            []
          )
        ).toThrow(
          "COURT_ANALYSIS_AUDIT_REFS_INVALID"
        );
      }
    );

    it(
      "does not allow completing an already finished workflow",
      () => {
        let state =
          createCourtAnalysisState(
            CASE_ID
          );
        for (
          const checkpoint
          of [
            "SD_VER_COMPLETE",
            "PASS_I_ISOLATION_CLEAN",
            "PASS_II_SOURCES_VERIFIED",
            "FIRST_VERIFICATION_COMPLETE",
            "FINAL_VERIFICATION_COMPLETE",
            "FINAL_GATE_APPROVED",
            "FINAL_REPORT_PRESENTED",
            "SITUATIONAL_REPORT_PRESENTED",
            "PROCESS_PLEADING_OFFER_PRESENTED"
          ] as const
        ) {
          state = close(
            state,
            checkpoint
          );
        }

        expect(() =>
          completeCourtAnalysisCheckpoint(
            state,
            "PROCESS_PLEADING_OFFER_PRESENTED",
            [
              "audit://court/repeat"
            ]
          )
        ).toThrow(
          "COURT_ANALYSIS_ALREADY_COMPLETE"
        );
      }
    );
  }
);

import {
  describe,
  expect,
  it
} from "vitest";
import {
  completeChronologyCheckpoint,
  createChronologyState,
  nextChronologyCheckpoint,
  requireChronologyTemporalGate
} from "./chronology-state.js";

const CASE_ID =
  "case_" + "d".repeat(32);

function close(
  state: ReturnType<
    typeof createChronologyState
  >,
  checkpoint: Parameters<
    typeof completeChronologyCheckpoint
  >[1]
) {
  return completeChronologyCheckpoint(
    state,
    checkpoint,
    [
      `audit://chronology/${checkpoint}`
    ],
    "2026-09-18T09:00:00.000Z"
  );
}

describe(
  "deterministic chronology state",
  () => {
    it(
      "advances inventory -> threads -> extraction -> contradictions -> report without temporal gate when fewer than two dates are detected",
      () => {
        let state =
          createChronologyState(
            CASE_ID,
            "2026-09-18T08:59:00.000Z"
          );
        expect(
          nextChronologyCheckpoint(state)
        ).toBe(
          "DOCUMENT_INVENTORY_COMPLETE"
        );

        state = close(
          state,
          "DOCUMENT_INVENTORY_COMPLETE"
        );
        expect(state.stage).toBe("THREADS");

        state = close(
          state,
          "THREAD_IDENTIFICATION_COMPLETE"
        );
        expect(state.stage)
          .toBe("EXTRACTION");

        state = close(
          state,
          "EVENT_EXTRACTION_COMPLETE"
        );
        expect(state.stage)
          .toBe("CONTRADICTIONS");

        state = close(
          state,
          "CONTRADICTION_INDEX_COMPLETE"
        );
        expect(state.stage).toBe("REPORT");

        state = close(
          state,
          "CHRONOLOGY_REPORT_COMPLETE"
        );
        expect(state.stage)
          .toBe("COMPLETE");
      }
    );

    it(
      "inserts the temporal gate when the mechanical trigger is activated before extraction closes",
      () => {
        let state =
          createChronologyState(CASE_ID);
        state =
          requireChronologyTemporalGate(
            state,
            true
          );
        expect(
          state.temporalGateRequired
        ).toBe(true);

        state = close(
          state,
          "DOCUMENT_INVENTORY_COMPLETE"
        );
        state = close(
          state,
          "THREAD_IDENTIFICATION_COMPLETE"
        );
        state = close(
          state,
          "EVENT_EXTRACTION_COMPLETE"
        );
        expect(state.stage)
          .toBe("TEMPORAL_GATE");
        expect(
          nextChronologyCheckpoint(state)
        ).toBe(
          "TEMPORAL_GATE_COMPLETE"
        );

        state = close(
          state,
          "TEMPORAL_GATE_COMPLETE"
        );
        expect(state.stage)
          .toBe("CONTRADICTIONS");
      }
    );

    it(
      "never permits a late temporal trigger after contradiction analysis has begun",
      () => {
        let state =
          createChronologyState(CASE_ID);
        state = close(
          state,
          "DOCUMENT_INVENTORY_COMPLETE"
        );
        state = close(
          state,
          "THREAD_IDENTIFICATION_COMPLETE"
        );
        state = close(
          state,
          "EVENT_EXTRACTION_COMPLETE"
        );

        expect(() =>
          requireChronologyTemporalGate(
            state,
            true
          )
        ).toThrow(
          "CHRONOLOGY_TEMPORAL_GATE_LATE_TRIGGER"
        );
      }
    );

    it(
      "rejects out-of-order checkpoints and empty audit evidence",
      () => {
        const state =
          createChronologyState(CASE_ID);

        expect(() =>
          completeChronologyCheckpoint(
            state,
            "EVENT_EXTRACTION_COMPLETE",
            ["audit://invalid/skip"]
          )
        ).toThrow(
          "CHRONOLOGY_CHECKPOINT_OUT_OF_ORDER"
        );

        expect(() =>
          completeChronologyCheckpoint(
            state,
            "DOCUMENT_INVENTORY_COMPLETE",
            []
          )
        ).toThrow(
          "CHRONOLOGY_AUDIT_REFS_INVALID"
        );
      }
    );
  }
);

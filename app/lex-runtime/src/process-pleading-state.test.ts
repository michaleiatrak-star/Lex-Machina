import {
  describe,
  expect,
  it
} from "vitest";
import {
  acceptProcessPleadingStart,
  confirmProcessCheckpoint,
  createProcessPleadingState,
  markProcessCheckpointNotApplicable,
  markProcessCheckpointReady
} from "./process-pleading-state.js";

const CASE_ID =
  "case_" + "a".repeat(32);

function close(
  state: ReturnType<
    typeof createProcessPleadingState
  >,
  checkpoint: Parameters<
    typeof markProcessCheckpointReady
  >[1]
) {
  return confirmProcessCheckpoint(
    markProcessCheckpointReady(
      state,
      checkpoint,
      "2026-09-18T00:00:00.000Z"
    ),
    checkpoint,
    "2026-09-18T00:00:01.000Z"
  );
}

describe(
  "deterministic process pleading state",
  () => {
    it(
      "requires start acceptance and advances only after mandatory checkpoints",
      () => {
        let state =
          createProcessPleadingState(
            CASE_ID,
            "CHECKPOINT",
            "2026-09-17T23:59:00.000Z"
          );
        expect(state.stage)
          .toBe("CG_ACCEPTANCE");
        expect(state.documentStatus)
          .toBe("DRAFT");

        state =
          acceptProcessPleadingStart(
            state,
            "2026-09-18T00:00:00.000Z"
          );
        expect(state.stage).toBe("W1");

        state = close(
          state,
          "CP-W1"
        );
        expect(state.stage)
          .toBe("PRE_W2");

        state = close(
          state,
          "CP-PRE-W2"
        );
        expect(state.stage)
          .toBe("W2");

        state = close(
          state,
          "CP-ATAK"
        );
        expect(state.stage)
          .toBe("W3");

        state = close(
          state,
          "CP-PODMIOT"
        );
        state = close(
          state,
          "CP-QUALITY"
        );
        state = close(
          state,
          "CP-AUDYT"
        );
        expect(state.stage)
          .toBe("W3");
        expect(state.documentStatus)
          .toBe("DRAFT");

        state = close(
          state,
          "CP-PEER"
        );
        expect(state.stage)
          .toBe("FINAL");
        expect(state.documentStatus)
          .toBe("FINAL");
      }
    );

    it(
      "cannot confirm a checkpoint without a pending user confirmation",
      () => {
        const state =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              CASE_ID
            )
          );
        expect(() =>
          confirmProcessCheckpoint(
            state,
            "CP-W1"
          )
        ).toThrow(
          "PROCESS_PLEADING_CONFIRMATION_INVALID"
        );
      }
    );

    it(
      "blocks checkpoints from a later stage",
      () => {
        const state =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              CASE_ID
            )
          );
        expect(() =>
          markProcessCheckpointReady(
            state,
            "CP-PEER"
          )
        ).toThrow(
          "PROCESS_PLEADING_CHECKPOINT_TRANSITION_INVALID"
        );
      }
    );

    it(
      "permits conditional W1 checkpoints to be N/A but never a mandatory stage gate",
      () => {
        let state =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              CASE_ID
            )
          );
        state =
          markProcessCheckpointNotApplicable(
            state,
            "CP-1b"
          );
        expect(
          state.checkpoints["CP-1b"]
        ).toBe("NA");

        expect(() =>
          markProcessCheckpointNotApplicable(
            state,
            "CP-W1"
          )
        ).toThrow(
          "PROCESS_PLEADING_NA_TRANSITION_INVALID"
        );
      }
    );

    it(
      "AUTO closes stage checkpoints without waiting but still preserves order",
      () => {
        let state =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              CASE_ID,
              "AUTO"
            )
          );
        state =
          markProcessCheckpointReady(
            state,
            "CP-W1"
          );
        expect(state.stage)
          .toBe("PRE_W2");
        expect(state.pendingCheckpoint)
          .toBeNull();

        expect(() =>
          markProcessCheckpointReady(
            state,
            "CP-ATAK"
          )
        ).toThrow(
          "PROCESS_PLEADING_CHECKPOINT_TRANSITION_INVALID"
        );
      }
    );
  }
);

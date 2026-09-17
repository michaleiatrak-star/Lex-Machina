import {
  describe,
  expect,
  it
} from "vitest";
import {
  PROCESS_PLEADING_CHECKPOINTS,
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
      "requires start acceptance and resolves the complete registry before FINAL",
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

        for (const checkpoint of [
          "CP-1a",
          "CP-1b",
          "CP-1c-skan",
          "CP-PD",
          "CP-FSL-D",
          "CP-1c-macierz",
          "CP-1c-lancuch",
          "CP-1d-anomalie",
          "CP-1d",
          "CP-W1"
        ] as const) {
          state = close(
            state,
            checkpoint
          );
        }
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

        for (const checkpoint of [
          "CP-PODMIOT",
          "CP-QUALITY",
          "CP-AUDYT",
          "CP-PEER"
        ] as const) {
          state = close(
            state,
            checkpoint
          );
        }

        expect(state.stage)
          .toBe("FINAL");
        expect(state.documentStatus)
          .toBe("FINAL");
        expect(
          PROCESS_PLEADING_CHECKPOINTS
            .every(
              (checkpoint) =>
                state.checkpoints[
                  checkpoint
                ] === "CLOSED" ||
                state.checkpoints[
                  checkpoint
                ] === "NA"
            )
        ).toBe(true);
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
        state = close(
          state,
          "CP-1a"
        );
        state =
          markProcessCheckpointNotApplicable(
            state,
            "CP-1b"
          );
        expect(
          state.checkpoints["CP-1b"]
        ).toBe("NA");

        for (const checkpoint of [
          "CP-1c-skan",
          "CP-PD",
          "CP-FSL-D",
          "CP-1c-macierz",
          "CP-1c-lancuch",
          "CP-1d-anomalie",
          "CP-1d"
        ] as const) {
          state =
            markProcessCheckpointNotApplicable(
              state,
              checkpoint
            );
        }
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
            "CP-1a"
          );
        expect(state.stage)
          .toBe("W1");
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

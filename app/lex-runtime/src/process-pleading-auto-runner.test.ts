import {
  describe,
  expect,
  it
} from "vitest";
import {
  acceptProcessPleadingStart,
  createProcessPleadingState
} from "./process-pleading-state.js";
import {
  runBoundedProcessAutoSequence
} from "./process-pleading-auto-runner.js";

const CASE_ID =
  "case_" + "a".repeat(32);

function autoState() {
  return acceptProcessPleadingStart(
    createProcessPleadingState(
      CASE_ID,
      "AUTO",
      "2026-09-18T06:00:00.000Z"
    ),
    "2026-09-18T06:00:01.000Z"
  );
}

describe(
  "bounded process AUTO runner",
  () => {
    it(
      "executes at most four semantic checkpoints per request",
      async () => {
        const executed:
          string[] = [];

        const result =
          await runBoundedProcessAutoSequence({
            initialState:
              autoState(),
            execute:
              async (permit) => {
                executed.push(
                  permit.checkpoint
                );
                return {
                  result:
                    permit.checkpoint,
                  commit: true
                };
              },
            persist:
              async (_previous, next) =>
                next
          });

        expect(executed).toEqual([
          "CP-1a",
          "CP-1b",
          "CP-1c-skan",
          "CP-PD"
        ]);
        expect(result.steps)
          .toHaveLength(4);
        expect(
          result.limitReached
        ).toBe(true);
        expect(result.stopped)
          .toBe(
            "LIMIT_REACHED"
          );
        expect(
          result.state.checkpoints[
            "CP-PD"
          ]
        ).toBe("CLOSED");
        expect(
          result.state.checkpoints[
            "CP-FSL-D"
          ]
        ).toBe("OPEN");
      }
    );

    it(
      "does not advance state when a semantic node is blocked",
      async () => {
        const initial =
          autoState();

        const result =
          await runBoundedProcessAutoSequence({
            initialState:
              initial,
            execute:
              async (permit) => ({
                result: {
                  checkpoint:
                    permit.checkpoint,
                  status:
                    "BLOCKED"
                },
                commit: false
              }),
            persist:
              async () => {
                throw new Error(
                  "PERSIST_MUST_NOT_RUN"
                );
              }
          });

        expect(result.stopped)
          .toBe("NODE_BLOCKED");
        expect(result.steps)
          .toHaveLength(0);
        expect(
          result.state.revision
        ).toBe(
          initial.revision
        );
        expect(
          result.state.checkpoints[
            "CP-1a"
          ]
        ).toBe("OPEN");
      }
    );

    it(
      "lets deterministic applicability prepare the state before each semantic node",
      async () => {
        const prepared:
          number[] = [];

        const result =
          await runBoundedProcessAutoSequence({
            initialState:
              autoState(),
            maxSteps: 2,
            prepareState:
              async (state) => {
                prepared.push(
                  state.revision
                );
                return state;
              },
            execute:
              async (permit) => ({
                result:
                  permit.checkpoint,
                commit: true
              }),
            persist:
              async (_previous, next) =>
                next
          });

        expect(prepared)
          .toHaveLength(2);
        expect(result.steps)
          .toHaveLength(2);
      }
    );

    it(
      "rejects CHECKPOINT mode and oversized batches",
      async () => {
        const checkpointState =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              CASE_ID,
              "CHECKPOINT"
            )
          );

        await expect(
          runBoundedProcessAutoSequence({
            initialState:
              checkpointState,
            execute:
              async () => ({
                result: "x",
                commit: true
              }),
            persist:
              async (_previous, next) =>
                next
          })
        ).rejects.toThrow(
          "PROCESS_PLEADING_AUTO_MODE_REQUIRED"
        );

        await expect(
          runBoundedProcessAutoSequence({
            initialState:
              autoState(),
            maxSteps: 5,
            execute:
              async () => ({
                result: "x",
                commit: true
              }),
            persist:
              async (_previous, next) =>
                next
          })
        ).rejects.toThrow(
          "PROCESS_PLEADING_AUTO_STEP_LIMIT_INVALID"
        );
      }
    );
  }
);

import {
  completeProcessExecution,
  requireProcessExecutionPermit,
  type ProcessExecutionPermit
} from "./process-pleading-execution-gate.js";
import {
  validateProcessPleadingState,
  type ProcessPleadingState
} from "./process-pleading-state.js";

export const PROCESS_AUTO_MAX_STEPS = 4;

export type ProcessAutoNodeOutcome<T> = {
  result: T;
  commit: boolean;
};

export type ProcessAutoStep<T> = {
  permit: ProcessExecutionPermit;
  result: T;
  revisionAfter: number;
  stageAfter: ProcessPleadingState["stage"];
};

export type ProcessAutoSequenceResult<T> = {
  state: ProcessPleadingState;
  steps: ProcessAutoStep<T>[];
  stopped:
    | "FINAL"
    | "LIMIT_REACHED"
    | "NODE_BLOCKED";
  limitReached: boolean;
  blockedResult?: T;
};

function assertSameWorkflow(
  previous: ProcessPleadingState,
  next: ProcessPleadingState
): void {
  if (
    previous.caseId !== next.caseId ||
    previous.workflowId !== next.workflowId ||
    previous.mode !== next.mode
  ) {
    throw new Error(
      "PROCESS_PLEADING_AUTO_STATE_CONFLICT"
    );
  }
}

export async function runBoundedProcessAutoSequence<T>(args: {
  initialState: ProcessPleadingState;
  maxSteps?: number;
  prepareState?: (
    state: ProcessPleadingState
  ) => Promise<ProcessPleadingState>;
  execute: (
    permit: ProcessExecutionPermit,
    state: ProcessPleadingState
  ) => Promise<ProcessAutoNodeOutcome<T>>;
  persist: (
    previous: ProcessPleadingState,
    next: ProcessPleadingState
  ) => Promise<ProcessPleadingState>;
}): Promise<ProcessAutoSequenceResult<T>> {
  const maxSteps =
    args.maxSteps ??
    PROCESS_AUTO_MAX_STEPS;
  if (
    !Number.isSafeInteger(maxSteps) ||
    maxSteps < 1 ||
    maxSteps >
      PROCESS_AUTO_MAX_STEPS
  ) {
    throw new Error(
      "PROCESS_PLEADING_AUTO_STEP_LIMIT_INVALID"
    );
  }

  let state =
    validateProcessPleadingState(
      args.initialState
    );
  if (state.mode !== "AUTO") {
    throw new Error(
      "PROCESS_PLEADING_AUTO_MODE_REQUIRED"
    );
  }

  const steps:
    ProcessAutoStep<T>[] = [];

  for (
    let index = 0;
    index < maxSteps;
    index += 1
  ) {
    if (args.prepareState) {
      const prepared =
        validateProcessPleadingState(
          await args.prepareState(
            state
          )
        );
      assertSameWorkflow(
        state,
        prepared
      );
      if (
        prepared.revision <
        state.revision
      ) {
        throw new Error(
          "PROCESS_PLEADING_AUTO_STATE_CONFLICT"
        );
      }
      state = prepared;
    }

    if (state.stage === "FINAL") {
      return {
        state,
        steps,
        stopped: "FINAL",
        limitReached: false
      };
    }

    const permit =
      requireProcessExecutionPermit(
        state
      );
    if (permit.mode !== "AUTO") {
      throw new Error(
        "PROCESS_PLEADING_AUTO_MODE_REQUIRED"
      );
    }

    const node =
      await args.execute(
        permit,
        state
      );
    if (!node.commit) {
      return {
        state,
        steps,
        stopped:
          "NODE_BLOCKED",
        limitReached: false,
        blockedResult:
          node.result
      };
    }

    const next =
      completeProcessExecution(
        state,
        permit
      );
    const persisted =
      validateProcessPleadingState(
        await args.persist(
          state,
          next
        )
      );

    assertSameWorkflow(
      state,
      persisted
    );
    if (
      persisted.revision !==
        next.revision ||
      persisted.stage !==
        next.stage ||
      persisted.pendingCheckpoint !==
        next.pendingCheckpoint
    ) {
      throw new Error(
        "PROCESS_PLEADING_AUTO_STATE_CONFLICT"
      );
    }

    state = persisted;
    steps.push({
      permit,
      result: node.result,
      revisionAfter:
        state.revision,
      stageAfter:
        state.stage
    });

    if (state.stage === "FINAL") {
      return {
        state,
        steps,
        stopped: "FINAL",
        limitReached: false
      };
    }
  }

  return {
    state,
    steps,
    stopped:
      "LIMIT_REACHED",
    limitReached: true
  };
}

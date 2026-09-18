import {
  markProcessCheckpointReady,
  nextRequiredProcessCheckpoint,
  validateProcessPleadingState,
  type ProcessPleadingCheckpoint,
  type ProcessPleadingMode,
  type ProcessPleadingStage,
  type ProcessPleadingState
} from "./process-pleading-state.js";

export type ProcessExecutionPermit = {
  revision: number;
  stage: Exclude<
    ProcessPleadingStage,
    "CG_ACCEPTANCE" | "FINAL"
  >;
  checkpoint: ProcessPleadingCheckpoint;
  mode: ProcessPleadingMode;
};

export function requireProcessExecutionPermit(
  input: ProcessPleadingState | null
): ProcessExecutionPermit {
  if (!input) {
    throw new Error(
      "PROCESS_PLEADING_STATE_REQUIRED"
    );
  }
  const state =
    validateProcessPleadingState(input);

  if (state.stage === "CG_ACCEPTANCE") {
    throw new Error(
      "PROCESS_PLEADING_START_ACCEPTANCE_REQUIRED"
    );
  }
  if (state.pendingCheckpoint) {
    throw new Error(
      `PROCESS_PLEADING_CONFIRMATION_REQUIRED:${state.pendingCheckpoint}`
    );
  }
  if (state.stage === "FINAL") {
    throw new Error(
      "PROCESS_PLEADING_ALREADY_FINAL"
    );
  }

  const checkpoint =
    nextRequiredProcessCheckpoint(
      state
    );
  if (!checkpoint) {
    throw new Error(
      "PROCESS_PLEADING_CHECKPOINT_UNAVAILABLE"
    );
  }

  return {
    revision: state.revision,
    stage: state.stage,
    checkpoint,
    mode: state.mode
  };
}

export function completeProcessExecution(
  input: ProcessPleadingState,
  permit: ProcessExecutionPermit
): ProcessPleadingState {
  const state =
    validateProcessPleadingState(input);
  if (
    state.revision !==
      permit.revision
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_CONFLICT"
    );
  }
  if (
    state.stage !== permit.stage ||
    state.mode !== permit.mode
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_CONFLICT"
    );
  }
  const currentCheckpoint =
    nextRequiredProcessCheckpoint(
      state
    );
  if (
    currentCheckpoint !==
      permit.checkpoint
  ) {
    throw new Error(
      "PROCESS_PLEADING_CHECKPOINT_CONFLICT"
    );
  }
  return markProcessCheckpointReady(
    state,
    permit.checkpoint
  );
}

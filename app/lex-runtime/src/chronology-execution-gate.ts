import {
  completeChronologyCheckpoint,
  nextChronologyCheckpoint,
  validateChronologyState,
  type ChronologyCheckpoint,
  type ChronologyStage,
  type ChronologyState
} from "./chronology-state.js";

export type ChronologyExecutionPermit = {
  revision: number;
  stage: Exclude<
    ChronologyStage,
    "COMPLETE"
  >;
  checkpoint: ChronologyCheckpoint;
};

export function requireChronologyExecutionPermit(
  input: ChronologyState | null
): ChronologyExecutionPermit {
  if (!input) {
    throw new Error(
      "CHRONOLOGY_STATE_REQUIRED"
    );
  }
  const state =
    validateChronologyState(input);
  if (state.stage === "COMPLETE") {
    throw new Error(
      "CHRONOLOGY_ALREADY_COMPLETE"
    );
  }
  const checkpoint =
    nextChronologyCheckpoint(state);
  if (!checkpoint) {
    throw new Error(
      "CHRONOLOGY_CHECKPOINT_UNAVAILABLE"
    );
  }
  return {
    revision: state.revision,
    stage: state.stage,
    checkpoint
  };
}

export function completeChronologyExecution(
  input: ChronologyState,
  permit: ChronologyExecutionPermit,
  auditRefs: readonly string[]
): ChronologyState {
  const state =
    validateChronologyState(input);
  if (
    state.revision !== permit.revision ||
    state.stage !== permit.stage
  ) {
    throw new Error(
      "CHRONOLOGY_STATE_CONFLICT"
    );
  }
  if (
    nextChronologyCheckpoint(state) !==
    permit.checkpoint
  ) {
    throw new Error(
      "CHRONOLOGY_CHECKPOINT_CONFLICT"
    );
  }
  return completeChronologyCheckpoint(
    state,
    permit.checkpoint,
    auditRefs
  );
}

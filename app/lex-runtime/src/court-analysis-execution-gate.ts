import {
  completeCourtAnalysisCheckpoint,
  nextCourtAnalysisCheckpoint,
  validateCourtAnalysisState,
  type CourtAnalysisCheckpoint,
  type CourtAnalysisStage,
  type CourtAnalysisState
} from "./court-analysis-state.js";

export type CourtAnalysisExecutionPermit = {
  revision: number;
  stage: Exclude<
    CourtAnalysisStage,
    "COMPLETE"
  >;
  checkpoint:
    CourtAnalysisCheckpoint;
};

export function requireCourtAnalysisExecutionPermit(
  input: CourtAnalysisState | null
): CourtAnalysisExecutionPermit {
  if (!input) {
    throw new Error(
      "COURT_ANALYSIS_STATE_REQUIRED"
    );
  }
  const state =
    validateCourtAnalysisState(
      input
    );
  if (
    state.stage === "COMPLETE"
  ) {
    throw new Error(
      "COURT_ANALYSIS_ALREADY_COMPLETE"
    );
  }
  const checkpoint =
    nextCourtAnalysisCheckpoint(
      state
    );
  if (!checkpoint) {
    throw new Error(
      "COURT_ANALYSIS_CHECKPOINT_UNAVAILABLE"
    );
  }
  return {
    revision:
      state.revision,
    stage:
      state.stage,
    checkpoint
  };
}

export function completeCourtAnalysisExecution(
  input: CourtAnalysisState,
  permit:
    CourtAnalysisExecutionPermit,
  auditRefs:
    readonly string[]
): CourtAnalysisState {
  const state =
    validateCourtAnalysisState(
      input
    );
  if (
    state.revision !==
      permit.revision ||
    state.stage !==
      permit.stage
  ) {
    throw new Error(
      "COURT_ANALYSIS_STATE_CONFLICT"
    );
  }
  if (
    nextCourtAnalysisCheckpoint(
      state
    ) !==
      permit.checkpoint
  ) {
    throw new Error(
      "COURT_ANALYSIS_CHECKPOINT_CONFLICT"
    );
  }
  return completeCourtAnalysisCheckpoint(
    state,
    permit.checkpoint,
    auditRefs
  );
}

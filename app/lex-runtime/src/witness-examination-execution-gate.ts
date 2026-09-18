import {
  completeWitnessCheckpoint,
  nextRequiredWitnessCheckpoint,
  validateWitnessExaminationState,
  type WitnessCheckpointOutcome,
  type WitnessExaminationCheckpoint,
  type WitnessExaminationState
} from "./witness-examination-state.js";

export type WitnessExecutionPermit = {
  workflowId:
    "WITNESS_EXAMINATION_V1";
  caseId: string;
  expectedRevision: number;
  checkpoint:
    Exclude<
      WitnessExaminationCheckpoint,
      "W2_USER_CONFIRMED"
    >;
};

export function requireWitnessExecutionPermit(
  input:
    WitnessExaminationState
):
  WitnessExecutionPermit {
  const state =
    validateWitnessExaminationState(
      input
    );
  const checkpoint =
    nextRequiredWitnessCheckpoint(
      state
    );

  if (
    checkpoint === null
  ) {
    throw new Error(
      "WITNESS_QUESTION_SET_ALREADY_READY"
    );
  }
  if (
    checkpoint ===
      "W2_USER_CONFIRMED"
  ) {
    throw new Error(
      "WITNESS_W2_CONFIRMATION_REQUIRED"
    );
  }

  return {
    workflowId:
      "WITNESS_EXAMINATION_V1",
    caseId: state.caseId,
    expectedRevision:
      state.revision,
    checkpoint
  };
}

export function completeWitnessExecution(
  input:
    WitnessExaminationState,
  permit:
    WitnessExecutionPermit,
  auditRefs:
    readonly string[],
  options?: {
    outcome?:
      WitnessCheckpointOutcome;
    reason?: string;
    at?: string;
  }
):
  WitnessExaminationState {
  const state =
    validateWitnessExaminationState(
      input
    );

  if (
    permit.workflowId !==
      "WITNESS_EXAMINATION_V1" ||
    permit.caseId !==
      state.caseId ||
    permit.expectedRevision !==
      state.revision
  ) {
    throw new Error(
      "WITNESS_EXECUTION_PERMIT_STALE"
    );
  }

  const required =
    nextRequiredWitnessCheckpoint(
      state
    );
  if (
    required === null ||
    required ===
      "W2_USER_CONFIRMED" ||
    required !==
      permit.checkpoint
  ) {
    throw new Error(
      "WITNESS_EXECUTION_PERMIT_INVALID"
    );
  }

  return completeWitnessCheckpoint(
    state,
    permit.checkpoint,
    auditRefs,
    options
  );
}

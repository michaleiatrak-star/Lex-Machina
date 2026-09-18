import {
  completeContractCheckpoint,
  nextContractCheckpoint,
  validateContractAnalysisState,
  type ContractAnalysisState,
  type ContractCheckpoint,
  type ContractStage,
  type ContractWorkflowMode
} from "./contract-analysis-state.js";

export type ContractExecutionPermit = {
  revision: number;
  mode: ContractWorkflowMode;
  stage: Exclude<
    ContractStage,
    "COMPLETE"
  >;
  checkpoint:
    ContractCheckpoint;
};

export function requireContractExecutionPermit(
  input:
    ContractAnalysisState | null
): ContractExecutionPermit {
  if (!input) {
    throw new Error(
      "CONTRACT_STATE_REQUIRED"
    );
  }
  const state =
    validateContractAnalysisState(
      input
    );
  if (
    state.stage ===
      "COMPLETE"
  ) {
    throw new Error(
      "CONTRACT_ALREADY_COMPLETE"
    );
  }
  const checkpoint =
    nextContractCheckpoint(
      state
    );
  if (!checkpoint) {
    throw new Error(
      "CONTRACT_CHECKPOINT_UNAVAILABLE"
    );
  }

  return {
    revision:
      state.revision,
    mode:
      state.mode,
    stage:
      state.stage,
    checkpoint
  };
}

export function completeContractExecution(
  input:
    ContractAnalysisState,
  permit:
    ContractExecutionPermit,
  auditRefs:
    readonly string[]
): ContractAnalysisState {
  const state =
    validateContractAnalysisState(
      input
    );
  if (
    state.revision !==
      permit.revision ||
    state.mode !==
      permit.mode ||
    state.stage !==
      permit.stage
  ) {
    throw new Error(
      "CONTRACT_STATE_CONFLICT"
    );
  }
  if (
    nextContractCheckpoint(
      state
    ) !==
      permit.checkpoint
  ) {
    throw new Error(
      "CONTRACT_CHECKPOINT_CONFLICT"
    );
  }

  return completeContractCheckpoint(
    state,
    permit.checkpoint,
    auditRefs
  );
}

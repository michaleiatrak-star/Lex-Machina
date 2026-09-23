import { completeContractCheckpoint, nextContractCheckpoint, validateContractAnalysisState } from "./contract-analysis-state.js";
export function requireContractExecutionPermit(input) {
    if (!input) {
        throw new Error("CONTRACT_STATE_REQUIRED");
    }
    const state = validateContractAnalysisState(input);
    if (state.stage ===
        "COMPLETE") {
        throw new Error("CONTRACT_ALREADY_COMPLETE");
    }
    const checkpoint = nextContractCheckpoint(state);
    if (!checkpoint) {
        throw new Error("CONTRACT_CHECKPOINT_UNAVAILABLE");
    }
    return {
        revision: state.revision,
        mode: state.mode,
        stage: state.stage,
        checkpoint
    };
}
export function completeContractExecution(input, permit, auditRefs) {
    const state = validateContractAnalysisState(input);
    if (state.revision !==
        permit.revision ||
        state.mode !==
            permit.mode ||
        state.stage !==
            permit.stage) {
        throw new Error("CONTRACT_STATE_CONFLICT");
    }
    if (nextContractCheckpoint(state) !==
        permit.checkpoint) {
        throw new Error("CONTRACT_CHECKPOINT_CONFLICT");
    }
    return completeContractCheckpoint(state, permit.checkpoint, auditRefs);
}

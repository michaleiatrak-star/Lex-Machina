import { completeCourtAnalysisCheckpoint, nextCourtAnalysisCheckpoint, validateCourtAnalysisState } from "./court-analysis-state.js";
export function requireCourtAnalysisExecutionPermit(input) {
    if (!input) {
        throw new Error("COURT_ANALYSIS_STATE_REQUIRED");
    }
    const state = validateCourtAnalysisState(input);
    if (state.stage === "COMPLETE") {
        throw new Error("COURT_ANALYSIS_ALREADY_COMPLETE");
    }
    const checkpoint = nextCourtAnalysisCheckpoint(state);
    if (!checkpoint) {
        throw new Error("COURT_ANALYSIS_CHECKPOINT_UNAVAILABLE");
    }
    return {
        revision: state.revision,
        stage: state.stage,
        checkpoint
    };
}
export function completeCourtAnalysisExecution(input, permit, auditRefs) {
    const state = validateCourtAnalysisState(input);
    if (state.revision !==
        permit.revision ||
        state.stage !==
            permit.stage) {
        throw new Error("COURT_ANALYSIS_STATE_CONFLICT");
    }
    if (nextCourtAnalysisCheckpoint(state) !==
        permit.checkpoint) {
        throw new Error("COURT_ANALYSIS_CHECKPOINT_CONFLICT");
    }
    return completeCourtAnalysisCheckpoint(state, permit.checkpoint, auditRefs);
}

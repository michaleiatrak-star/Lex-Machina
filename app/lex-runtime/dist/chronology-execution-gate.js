import { completeChronologyCheckpoint, nextChronologyCheckpoint, validateChronologyState } from "./chronology-state.js";
export function requireChronologyExecutionPermit(input) {
    if (!input) {
        throw new Error("CHRONOLOGY_STATE_REQUIRED");
    }
    const state = validateChronologyState(input);
    if (state.stage === "COMPLETE") {
        throw new Error("CHRONOLOGY_ALREADY_COMPLETE");
    }
    const checkpoint = nextChronologyCheckpoint(state);
    if (!checkpoint) {
        throw new Error("CHRONOLOGY_CHECKPOINT_UNAVAILABLE");
    }
    return {
        revision: state.revision,
        stage: state.stage,
        checkpoint
    };
}
export function completeChronologyExecution(input, permit, auditRefs) {
    const state = validateChronologyState(input);
    if (state.revision !== permit.revision ||
        state.stage !== permit.stage) {
        throw new Error("CHRONOLOGY_STATE_CONFLICT");
    }
    if (nextChronologyCheckpoint(state) !==
        permit.checkpoint) {
        throw new Error("CHRONOLOGY_CHECKPOINT_CONFLICT");
    }
    return completeChronologyCheckpoint(state, permit.checkpoint, auditRefs);
}

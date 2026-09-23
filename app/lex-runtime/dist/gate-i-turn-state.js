const ORDER = [
    "ROUTER_PREFLIGHT",
    "SKILL_PREFLIGHT",
    "RESOURCE_READS",
    "SEMANTIC_EXECUTION",
    "SOURCE_VERIFICATION",
    "CITATION_VALIDATION",
    "OUTPUT_VALIDATION",
    "FINALIZATION",
    "COMPLETE"
];
function now() {
    return new Date().toISOString();
}
function push(state, phase, result, detail) {
    state.events.push({
        sequence: state.events.length + 1,
        phase,
        result,
        at: now(),
        ...(detail ? { detail } : {})
    });
}
export function createGateITurnState(workflowId) {
    if (!/^[A-Z0-9_]{3,96}$/.test(workflowId)) {
        throw new Error("GATE_I_WORKFLOW_ID_INVALID");
    }
    const state = {
        schemaVersion: 1,
        workflowId,
        phase: "ROUTER_PREFLIGHT",
        result: "IN_PROGRESS",
        events: []
    };
    push(state, "ROUTER_PREFLIGHT", "ENTER");
    return state;
}
export function passGateITurnPhase(state, phase, detail) {
    if (state.result !==
        "IN_PROGRESS" ||
        state.phase !== phase) {
        throw new Error("GATE_I_PHASE_TRANSITION_INVALID");
    }
    push(state, phase, "PASS", detail);
    const index = ORDER.indexOf(phase);
    const next = ORDER[index + 1];
    if (!next) {
        throw new Error("GATE_I_PHASE_TRANSITION_INVALID");
    }
    state.phase = next;
    if (next === "COMPLETE") {
        state.result = "PASS";
        push(state, "COMPLETE", "PASS");
    }
    else {
        push(state, next, "ENTER");
    }
    return {
        ...state,
        events: state.events.map((event) => ({
            ...event
        }))
    };
}
export function blockGateITurn(state, detail) {
    if (state.result !==
        "IN_PROGRESS") {
        throw new Error("GATE_I_PHASE_TRANSITION_INVALID");
    }
    push(state, state.phase, "BLOCKED", detail);
    state.phase =
        "BLOCKED";
    state.result =
        "BLOCKED";
    push(state, "BLOCKED", "BLOCKED", detail);
    return {
        ...state,
        events: state.events.map((event) => ({
            ...event
        }))
    };
}

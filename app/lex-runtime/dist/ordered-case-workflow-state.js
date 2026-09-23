export const ORDERED_CASE_WORKFLOW_SEQUENCES = {
    EVIDENCE_ANALYSIS_V1: [
        "AD-KROK0-BLOKADA",
        "AD-KROK0a-MODE",
        "AD-KROK0b-SDVER",
        "AD-KROK0c-STINIT",
        "AD-KROK1-INTAKE",
        "AD-KROK2-ROUTER",
        "AD-BLOKG-STRONY",
        "AD-BLOKJ-LAPSUSY",
        "AD-BLOKH-DIS",
        "AD-KROK3-WYKONANIE",
        "AD-KROK4-DASHBOARD"
    ],
    WITNESS_QUESTIONING_V1: [
        "PRE-W1a-SD-VER",
        "PRE-W1a.4-RZ-SHOW",
        "KROK-PRE-W1-INTELLIGENCE",
        "KROK-0-KONTEKST",
        "W1-INTAKE",
        "W1-SUPPLEMENT",
        "W2-THESES-AND-MODEL",
        "CHECKPOINT-W2",
        "W3-QUESTIONS",
        "W4-REHEARSAL",
        "W5-BINDER",
        "W6-LIVE-DIRECT"
    ]
};
const OPTIONAL_CHECKPOINTS = {
    EVIDENCE_ANALYSIS_V1: new Set([
        "AD-BLOKG-STRONY",
        "AD-BLOKJ-LAPSUSY",
        "AD-BLOKH-DIS"
    ]),
    WITNESS_QUESTIONING_V1: new Set([
        "W1-SUPPLEMENT",
        "W4-REHEARSAL",
        "W5-BINDER",
        "W6-LIVE-DIRECT"
    ])
};
const CASE_ID = /^case_[a-f0-9]{32}$/;
const AUDIT_REF = /^[A-Za-z0-9._:/-]{3,240}$/;
const CONTROL = /[\x00-\x1f\x7f]/g;
const HISTORY_MAX = 160;
function validIso(value) {
    return (typeof value === "string" &&
        value.length > 0 &&
        value.length <= 64 &&
        !Number.isNaN(Date.parse(value)));
}
function sequence(workflowId) {
    return (ORDERED_CASE_WORKFLOW_SEQUENCES[workflowId]);
}
function sanitizeAuditRefs(values) {
    const refs = [
        ...new Set(values.map((value) => value.trim()))
    ];
    if (refs.length < 1 ||
        refs.length > 64 ||
        refs.some((value) => !AUDIT_REF.test(value))) {
        throw new Error("ORDERED_WORKFLOW_AUDIT_REFS_INVALID");
    }
    return refs;
}
function sanitizeReason(value) {
    const reason = value
        .normalize("NFKC")
        .replace(CONTROL, " ")
        .replace(/\s+/g, " ")
        .trim();
    if (reason.length < 3 ||
        reason.length > 500) {
        throw new Error("ORDERED_WORKFLOW_NA_REASON_INVALID");
    }
    return reason;
}
function clone(state) {
    return {
        ...state,
        closedCheckpoints: [
            ...state.closedCheckpoints
        ],
        history: state.history.map((event) => ({
            ...event,
            auditRefs: [
                ...event.auditRefs
            ]
        }))
    };
}
export function createOrderedCaseWorkflowState(workflowId, caseId, at = new Date().toISOString()) {
    if (!CASE_ID.test(caseId) ||
        !validIso(at)) {
        throw new Error("ORDERED_WORKFLOW_INITIAL_STATE_INVALID");
    }
    return {
        schemaVersion: 1,
        workflowId,
        caseId,
        revision: 1,
        status: "ACTIVE",
        closedCheckpoints: [],
        history: [],
        createdAt: at,
        updatedAt: at
    };
}
export function nextOrderedCaseCheckpoint(input) {
    const state = validateOrderedCaseWorkflowState(input);
    return (sequence(state.workflowId)[state.closedCheckpoints
        .length] ?? null);
}
export function validateOrderedCaseWorkflowState(input) {
    if (input.schemaVersion !== 1 ||
        ![
            "EVIDENCE_ANALYSIS_V1",
            "WITNESS_QUESTIONING_V1"
        ].includes(input.workflowId) ||
        !CASE_ID.test(input.caseId) ||
        !Number.isSafeInteger(input.revision) ||
        input.revision < 1 ||
        ![
            "ACTIVE",
            "COMPLETE"
        ].includes(input.status) ||
        !Array.isArray(input.closedCheckpoints) ||
        !Array.isArray(input.history) ||
        input.history.length >
            HISTORY_MAX ||
        !validIso(input.createdAt) ||
        !validIso(input.updatedAt)) {
        throw new Error("ORDERED_WORKFLOW_STATE_INVALID");
    }
    const expected = sequence(input.workflowId);
    if (input.closedCheckpoints
        .length >
        expected.length ||
        input.closedCheckpoints
            .some((checkpoint, index) => checkpoint !==
            expected[index]) ||
        input.history.length !==
            input.closedCheckpoints
                .length) {
        throw new Error("ORDERED_WORKFLOW_PREFIX_INVALID");
    }
    let prior = 0;
    input.history.forEach((event, index) => {
        if (!Number.isSafeInteger(event.sequence) ||
            event.sequence <= prior ||
            !validIso(event.at) ||
            event.checkpoint !==
                input.closedCheckpoints[index] ||
            ![
                "DONE",
                "NA"
            ].includes(event.outcome)) {
            throw new Error("ORDERED_WORKFLOW_HISTORY_INVALID");
        }
        sanitizeAuditRefs(event.auditRefs);
        if (event.outcome === "NA") {
            if (!OPTIONAL_CHECKPOINTS[input.workflowId].has(event.checkpoint) ||
                typeof event.reason !==
                    "string") {
                throw new Error("ORDERED_WORKFLOW_NA_STATE_INVALID");
            }
            sanitizeReason(event.reason);
        }
        else if (event.reason !==
            undefined) {
            throw new Error("ORDERED_WORKFLOW_HISTORY_INVALID");
        }
        prior =
            event.sequence;
    });
    const complete = input.closedCheckpoints
        .length ===
        expected.length;
    if ((complete &&
        input.status !==
            "COMPLETE") ||
        (!complete &&
            input.status !==
                "ACTIVE")) {
        throw new Error("ORDERED_WORKFLOW_STATUS_INVALID");
    }
    return clone(input);
}
export function requireOrderedCaseExecutionPermit(input) {
    const state = validateOrderedCaseWorkflowState(input);
    const checkpoint = nextOrderedCaseCheckpoint(state);
    if (!checkpoint) {
        throw new Error("ORDERED_WORKFLOW_ALREADY_COMPLETE");
    }
    return {
        workflowId: state.workflowId,
        caseId: state.caseId,
        revision: state.revision,
        checkpoint
    };
}
function close(input, permit, outcome, auditRefs, at, reason) {
    const state = validateOrderedCaseWorkflowState(input);
    if (permit.workflowId !==
        state.workflowId ||
        permit.caseId !==
            state.caseId ||
        permit.revision !==
            state.revision) {
        throw new Error("ORDERED_WORKFLOW_PERMIT_STALE");
    }
    const expected = nextOrderedCaseCheckpoint(state);
    if (!expected ||
        permit.checkpoint !==
            expected) {
        throw new Error("ORDERED_WORKFLOW_CHECKPOINT_OUT_OF_ORDER");
    }
    if (!validIso(at)) {
        throw new Error("ORDERED_WORKFLOW_TIMESTAMP_INVALID");
    }
    if (outcome === "NA" &&
        !OPTIONAL_CHECKPOINTS[state.workflowId].has(expected)) {
        throw new Error("ORDERED_WORKFLOW_NA_NOT_ALLOWED");
    }
    const refs = sanitizeAuditRefs(auditRefs);
    const cleanReason = outcome === "NA"
        ? sanitizeReason(reason ?? "")
        : undefined;
    state.closedCheckpoints
        .push(expected);
    state.revision += 1;
    state.updatedAt = at;
    state.history.push({
        sequence: (state.history.at(-1)
            ?.sequence ?? 0) + 1,
        at,
        checkpoint: expected,
        outcome,
        auditRefs: refs,
        ...(cleanReason
            ? {
                reason: cleanReason
            }
            : {})
    });
    state.history =
        state.history.slice(-HISTORY_MAX);
    state.status =
        state.closedCheckpoints
            .length ===
            sequence(state.workflowId).length
            ? "COMPLETE"
            : "ACTIVE";
    return validateOrderedCaseWorkflowState(state);
}
export function completeOrderedCaseExecution(input, permit, auditRefs, at = new Date().toISOString()) {
    return close(input, permit, "DONE", auditRefs, at);
}
export function markOrderedCaseCheckpointNotApplicable(input, permit, reason, auditRefs, at = new Date().toISOString()) {
    return close(input, permit, "NA", auditRefs, at, reason);
}
export function orderedCaseWorkflowSequence(workflowId) {
    return [
        ...sequence(workflowId)
    ];
}

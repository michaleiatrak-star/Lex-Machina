export const MODEL_TASK_OWNERSHIP = [
    {
        task: "LEGAL_SEMANTIC_RESPONSE",
        owner: "PRIMARY",
        mandatory: true
    },
    {
        task: "AMBIGUOUS_ROUTING_CLASSIFICATION",
        owner: "PRIMARY",
        mandatory: true
    },
    {
        // Deterministic Gate I prelude: the same detector as finalization,
        // verified through ELI. There is no auxiliary model role.
        task: "LEGAL_REFERENCE_PREFLIGHT",
        owner: "RUNTIME",
        mandatory: false
    },
    {
        task: "LEGAL_REFERENCE_VERIFICATION",
        owner: "RUNTIME",
        mandatory: true
    }
];
export function modelTaskPolicy(task) {
    const policy = MODEL_TASK_OWNERSHIP.find((entry) => entry.task === task);
    if (!policy) {
        throw new Error(`MODEL_TASK_POLICY_MISSING:${task}`);
    }
    return policy;
}
export function validateModelTaskOwnership() {
    const seen = new Set();
    const duplicateTasks = [];
    // Kept in the report shape; no task has an auxiliary owner any more.
    const missingFallbacks = [];
    const invalidFallbacks = [];
    for (const policy of MODEL_TASK_OWNERSHIP) {
        if (seen.has(policy.task)) {
            duplicateTasks.push(policy.task);
        }
        seen.add(policy.task);
        if (policy.fallbackOwner &&
            policy.fallbackOwner ===
                policy.owner) {
            invalidFallbacks.push(policy.task);
        }
    }
    return {
        result: missingFallbacks.length ===
            0 &&
            invalidFallbacks.length ===
                0 &&
            duplicateTasks.length ===
                0
            ? "PASS"
            : "BLOCKED",
        missingFallbacks,
        invalidFallbacks,
        duplicateTasks
    };
}
/** Reference preflight is runtime work whenever the message cites law. */
export function resolveReferencePreflightOwnership(applicable) {
    const policy = modelTaskPolicy("LEGAL_REFERENCE_PREFLIGHT");
    return {
        task: policy.task,
        applicable,
        configuredOwner: policy.owner,
        effectiveOwner: applicable
            ? policy.owner
            : "NOT_APPLICABLE",
        fallbackApplied: false
    };
}
export function evaluateModelTaskOwnershipGate(resolution) {
    const registry = validateModelTaskOwnership();
    const errors = [];
    if (resolution.applicable &&
        resolution.effectiveOwner ===
            "NOT_APPLICABLE") {
        errors.push("APPLICABLE_TASK_WITHOUT_OWNER");
    }
    if (resolution.fallbackApplied &&
        !resolution.fallbackOwner) {
        errors.push("FALLBACK_APPLIED_WITHOUT_OWNER");
    }
    return {
        gate: "G39K_MODEL_TASK_OWNERSHIP",
        result: registry.result === "PASS" &&
            errors.length === 0
            ? "PASS"
            : "BLOCKED",
        registry,
        resolution,
        errors
    };
}

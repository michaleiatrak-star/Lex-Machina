export type ModelTaskId =
  | "LEGAL_SEMANTIC_RESPONSE"
  | "AMBIGUOUS_ROUTING_CLASSIFICATION"
  | "LEGAL_REFERENCE_PREFLIGHT"
  | "LEGAL_REFERENCE_VERIFICATION";

export type ModelTaskOwner =
  | "PRIMARY"
  | "RUNTIME";

export type EffectiveModelTaskOwner =
  | ModelTaskOwner
  | "NOT_APPLICABLE";

export type ModelTaskPolicy = {
  task: ModelTaskId;
  owner: ModelTaskOwner;
  fallbackOwner?: ModelTaskOwner;
  mandatory: boolean;
};

export const MODEL_TASK_OWNERSHIP:
  readonly ModelTaskPolicy[] = [
    {
      task:
        "LEGAL_SEMANTIC_RESPONSE",
      owner: "PRIMARY",
      mandatory: true
    },
    {
      task:
        "AMBIGUOUS_ROUTING_CLASSIFICATION",
      owner: "PRIMARY",
      mandatory: true
    },
    {
      // Deterministic Gate I prelude: the same detector as finalization,
      // verified through ELI. There is no auxiliary model role.
      task:
        "LEGAL_REFERENCE_PREFLIGHT",
      owner: "RUNTIME",
      mandatory: false
    },
    {
      task:
        "LEGAL_REFERENCE_VERIFICATION",
      owner: "RUNTIME",
      mandatory: true
    }
  ] as const;

export function modelTaskPolicy(
  task: ModelTaskId
): ModelTaskPolicy {
  const policy =
    MODEL_TASK_OWNERSHIP.find(
      (entry) =>
        entry.task === task
    );
  if (!policy) {
    throw new Error(
      `MODEL_TASK_POLICY_MISSING:${task}`
    );
  }
  return policy;
}

export type ModelTaskOwnershipValidation = {
  result: "PASS" | "BLOCKED";
  missingFallbacks: ModelTaskId[];
  invalidFallbacks: ModelTaskId[];
  duplicateTasks: ModelTaskId[];
};

export function validateModelTaskOwnership():
  ModelTaskOwnershipValidation {
  const seen =
    new Set<ModelTaskId>();
  const duplicateTasks:
    ModelTaskId[] = [];
  // Kept in the report shape; no task has an auxiliary owner any more.
  const missingFallbacks:
    ModelTaskId[] = [];
  const invalidFallbacks:
    ModelTaskId[] = [];

  for (
    const policy
    of MODEL_TASK_OWNERSHIP
  ) {
    if (seen.has(policy.task)) {
      duplicateTasks.push(
        policy.task
      );
    }
    seen.add(policy.task);
    if (
      policy.fallbackOwner &&
      policy.fallbackOwner ===
        policy.owner
    ) {
      invalidFallbacks.push(
        policy.task
      );
    }
  }

  return {
    result:
      missingFallbacks.length ===
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

export type ModelTaskResolution = {
  task: ModelTaskId;
  applicable: boolean;
  configuredOwner: ModelTaskOwner;
  fallbackOwner?: ModelTaskOwner;
  effectiveOwner:
    EffectiveModelTaskOwner;
  fallbackApplied: boolean;
  fallbackReason?: string;
};

/** Reference preflight is runtime work whenever the message cites law. */
export function resolveReferencePreflightOwnership(
  applicable: boolean
): ModelTaskResolution {
  const policy =
    modelTaskPolicy("LEGAL_REFERENCE_PREFLIGHT");
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

export type ModelTaskOwnershipGate = {
  gate:
    "G39K_MODEL_TASK_OWNERSHIP";
  result: "PASS" | "BLOCKED";
  registry:
    ModelTaskOwnershipValidation;
  resolution:
    ModelTaskResolution;
  errors: string[];
};

export function evaluateModelTaskOwnershipGate(
  resolution:
    ModelTaskResolution
): ModelTaskOwnershipGate {
  const registry =
    validateModelTaskOwnership();
  const errors:
    string[] = [];

  if (
    resolution.applicable &&
    resolution.effectiveOwner ===
      "NOT_APPLICABLE"
  ) {
    errors.push(
      "APPLICABLE_TASK_WITHOUT_OWNER"
    );
  }

  if (
    resolution.fallbackApplied &&
    !resolution.fallbackOwner
  ) {
    errors.push(
      "FALLBACK_APPLIED_WITHOUT_OWNER"
    );
  }

  return {
    gate:
      "G39K_MODEL_TASK_OWNERSHIP",
    result:
      registry.result === "PASS" &&
      errors.length === 0
        ? "PASS"
        : "BLOCKED",
    registry,
    resolution,
    errors
  };
}

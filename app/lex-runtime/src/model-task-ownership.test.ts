import {
  describe,
  expect,
  it
} from "vitest";
import {
  MODEL_TASK_OWNERSHIP,
  evaluateModelTaskOwnershipGate,
  resolveReferencePreflightOwnership,
  validateModelTaskOwnership
} from "./model-task-ownership.js";

describe(
  "model task ownership",
  () => {
    it(
      "classifies every registered task exactly once, without an auxiliary model owner",
      () => {
        expect(validateModelTaskOwnership()).toEqual({
          result: "PASS",
          missingFallbacks: [],
          invalidFallbacks: [],
          duplicateTasks: []
        });
        expect(
          MODEL_TASK_OWNERSHIP.map((policy) => policy.owner)
        ).not.toContain("AUXILIARY");
      }
    );

    it(
      "keeps the reference preflight runtime-owned",
      () => {
        const resolution =
          resolveReferencePreflightOwnership(true);
        expect(resolution.effectiveOwner).toBe("RUNTIME");
        expect(resolution.fallbackApplied).toBe(false);
        expect(evaluateModelTaskOwnershipGate(resolution).result).toBe("PASS");
        expect(resolveReferencePreflightOwnership(false).effectiveOwner).toBe("NOT_APPLICABLE");
      }
    );

    it(
      "keeps deterministic legal verification runtime-owned",
      () => {
        expect(
          MODEL_TASK_OWNERSHIP
            .find(
              (policy) =>
                policy.task ===
                  "LEGAL_REFERENCE_VERIFICATION"
            )?.owner
        ).toBe("RUNTIME");
      }
    );
  }
);

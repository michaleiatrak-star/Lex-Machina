import { describe, expect, it } from "vitest";
import { MODEL_TASK_OWNERSHIP, evaluateModelTaskOwnershipGate, resolveAuxiliaryTaskOwnership, validateModelTaskOwnership } from "./model-task-ownership.js";
describe("model task ownership", () => {
    it("classifies every registered task exactly once and requires a non-auxiliary fallback for auxiliary work", () => {
        const report = validateModelTaskOwnership();
        expect(report)
            .toEqual({
            result: "PASS",
            missingFallbacks: [],
            invalidFallbacks: [],
            duplicateTasks: []
        });
        const auxiliary = MODEL_TASK_OWNERSHIP
            .filter((policy) => policy.owner ===
            "AUXILIARY");
        expect(auxiliary.length).toBeGreaterThan(0);
        for (const policy of auxiliary) {
            expect(policy.fallbackOwner).toBe("PRIMARY");
        }
    });
    it("falls back to the primary model when the auxiliary preflight cannot run", () => {
        const resolution = resolveAuxiliaryTaskOwnership("LEGAL_REFERENCE_PREFLIGHT", {
            applicable: true,
            auxiliarySucceeded: false,
            reason: "AUXILIARY_DISABLED"
        });
        expect(resolution
            .effectiveOwner).toBe("PRIMARY");
        expect(resolution
            .fallbackApplied).toBe(true);
        expect(evaluateModelTaskOwnershipGate(resolution).result).toBe("PASS");
    });
    it("keeps deterministic legal verification runtime-owned", () => {
        expect(MODEL_TASK_OWNERSHIP
            .find((policy) => policy.task ===
            "LEGAL_REFERENCE_VERIFICATION")?.owner).toBe("RUNTIME");
    });
});

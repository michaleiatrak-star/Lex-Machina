import { describe, expect, it } from "vitest";
import { createChronologyState, requireChronologyTemporalGate } from "./chronology-state.js";
import { completeChronologyExecution, requireChronologyExecutionPermit } from "./chronology-execution-gate.js";
const CASE_ID = "case_" + "e".repeat(32);
describe("chronology execution gate", () => {
    it("binds exactly one checkpoint and advances with audit evidence", () => {
        const state = createChronologyState(CASE_ID);
        const permit = requireChronologyExecutionPermit(state);
        expect(permit).toEqual({
            revision: 1,
            stage: "INVENTORY",
            checkpoint: "DOCUMENT_INVENTORY_COMPLETE"
        });
        const next = completeChronologyExecution(state, permit, [
            "audit://session/test/DOCUMENT_INVENTORY_COMPLETE"
        ]);
        expect(next.stage)
            .toBe("THREADS");
        expect(next.revision)
            .toBe(2);
    });
    it("rejects a permit made stale by the temporal-trigger revision", () => {
        const state = createChronologyState(CASE_ID);
        const permit = requireChronologyExecutionPermit(state);
        const changed = requireChronologyTemporalGate(state, true);
        expect(() => completeChronologyExecution(changed, permit, [
            "audit://session/test/stale"
        ])).toThrow("CHRONOLOGY_STATE_CONFLICT");
    });
});

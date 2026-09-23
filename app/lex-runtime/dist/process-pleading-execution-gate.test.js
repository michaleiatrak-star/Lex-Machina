import { describe, expect, it } from "vitest";
import { acceptProcessPleadingStart, confirmProcessCheckpoint, createProcessPleadingState } from "./process-pleading-state.js";
import { completeProcessExecution, requireProcessExecutionPermit } from "./process-pleading-execution-gate.js";
const CASE_ID = "case_" + "b".repeat(32);
describe("process pleading execution gate", () => {
    it("blocks provider execution when no workflow state exists", () => {
        expect(() => requireProcessExecutionPermit(null)).toThrow("PROCESS_PLEADING_STATE_REQUIRED");
    });
    it("blocks before explicit start acceptance", () => {
        const state = createProcessPleadingState(CASE_ID);
        expect(() => requireProcessExecutionPermit(state)).toThrow("PROCESS_PLEADING_START_ACCEPTANCE_REQUIRED");
    });
    it("permits exactly the first unresolved checkpoint", () => {
        const state = acceptProcessPleadingStart(createProcessPleadingState(CASE_ID));
        const permit = requireProcessExecutionPermit(state);
        expect(permit.stage)
            .toBe("W1");
        expect(permit.checkpoint)
            .toBe("CP-1a");
        const afterExecution = completeProcessExecution(state, permit);
        expect(afterExecution
            .pendingCheckpoint).toBe("CP-1a");
        expect(afterExecution
            .checkpoints["CP-1a"]).toBe("PENDING_CONFIRMATION");
    });
    it("blocks another provider execution until the pending CP is confirmed", () => {
        const state = acceptProcessPleadingStart(createProcessPleadingState(CASE_ID));
        const permit = requireProcessExecutionPermit(state);
        const waiting = completeProcessExecution(state, permit);
        expect(() => requireProcessExecutionPermit(waiting)).toThrow("PROCESS_PLEADING_CONFIRMATION_REQUIRED:CP-1a");
        const confirmed = confirmProcessCheckpoint(waiting, "CP-1a");
        expect(requireProcessExecutionPermit(confirmed).checkpoint).toBe("CP-1b");
    });
    it("rejects stale permits after revision changes", () => {
        const state = acceptProcessPleadingStart(createProcessPleadingState(CASE_ID));
        const stale = requireProcessExecutionPermit(state);
        const first = completeProcessExecution(state, stale);
        const confirmed = confirmProcessCheckpoint(first, "CP-1a");
        expect(() => completeProcessExecution(confirmed, stale)).toThrow("PROCESS_PLEADING_STATE_CONFLICT");
    });
});

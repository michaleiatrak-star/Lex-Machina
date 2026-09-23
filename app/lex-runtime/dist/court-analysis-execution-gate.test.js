import { describe, expect, it } from "vitest";
import { createCourtAnalysisState } from "./court-analysis-state.js";
import { completeCourtAnalysisExecution, requireCourtAnalysisExecutionPermit } from "./court-analysis-execution-gate.js";
const CASE_ID = "case_" + "c".repeat(32);
describe("court analysis execution gate", () => {
    it("binds the exact next checkpoint and advances only with audit evidence", () => {
        const state = createCourtAnalysisState(CASE_ID);
        const permit = requireCourtAnalysisExecutionPermit(state);
        expect(permit).toEqual({
            revision: 1,
            stage: "EVIDENCE_SCAN",
            checkpoint: "SD_VER_COMPLETE"
        });
        const next = completeCourtAnalysisExecution(state, permit, [
            "audit://session/test/SD_VER_COMPLETE"
        ]);
        expect(next.stage)
            .toBe("PASS_I_FACTS");
        expect(next.revision)
            .toBe(2);
    });
    it("rejects stale permits and empty audit evidence", () => {
        const state = createCourtAnalysisState(CASE_ID);
        const permit = requireCourtAnalysisExecutionPermit(state);
        expect(() => completeCourtAnalysisExecution(state, permit, [])).toThrow("COURT_ANALYSIS_AUDIT_REFS_INVALID");
        expect(() => completeCourtAnalysisExecution({
            ...state,
            revision: 2
        }, permit, [
            "audit://session/test/stale"
        ])).toThrow("COURT_ANALYSIS_STATE_CONFLICT");
    });
});

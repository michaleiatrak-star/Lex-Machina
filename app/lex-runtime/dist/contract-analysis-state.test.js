import { describe, expect, it } from "vitest";
import { completeContractCheckpoint, contractWorkflowSequence, createContractAnalysisState, markContractCheckpointNotApplicable, nextContractCheckpoint } from "./contract-analysis-state.js";
const CASE_ID = "case_" + "f".repeat(32);
function close(state, checkpoint) {
    return completeContractCheckpoint(state, checkpoint, [
        `audit://contract/${checkpoint}`
    ], "2026-09-18T09:30:00.000Z");
}
describe("deterministic contract analysis state", () => {
    it("uses the A-F branch for analysis and enforces finalization afterwards", () => {
        const expected = [
            "AU-F0",
            "AU-GAP",
            "AU-POV",
            "AU-ROUTE",
            "AU-A",
            "AU-B",
            "AU-C",
            "AU-D",
            "AU-F",
            "AU-HYBRID",
            "AU-STRIP",
            "AU-POST",
            "AU-DISC"
        ];
        expect(contractWorkflowSequence("ANALYSIS")).toEqual(expected);
        let state = createContractAnalysisState(CASE_ID, "ANALYSIS");
        for (const checkpoint of expected) {
            expect(nextContractCheckpoint(state)).toBe(checkpoint);
            state = close(state, checkpoint);
        }
        expect(state.stage)
            .toBe("COMPLETE");
        expect(nextContractCheckpoint(state)).toBeNull();
    });
    it("routes redaction, draft and supplement through the generation branch", () => {
        for (const mode of [
            "REDACTION",
            "DRAFT",
            "SUPPLEMENT"
        ]) {
            const sequence = contractWorkflowSequence(mode);
            expect(sequence)
                .toContain("AU-GENCORE");
            expect(sequence)
                .toContain("AU-GENBUILD");
            expect(sequence)
                .toContain("AU-GENSHARED");
            expect(sequence)
                .not.toContain("AU-A");
            expect(sequence.slice(-4)).toEqual([
                "AU-HYBRID",
                "AU-STRIP",
                "AU-POST",
                "AU-DISC"
            ]);
        }
    });
    it("allows objective N/A only for intake gap and party-identity checks", () => {
        let state = createContractAnalysisState(CASE_ID, "ANALYSIS");
        state = close(state, "AU-F0");
        state =
            markContractCheckpointNotApplicable(state, "AU-GAP", "Brak pól wymagających uzupełnienia po intake.", [
                "audit://contract/AU-GAP"
            ]);
        expect(state.history.at(-1)
            ?.outcome).toBe("NA");
        state =
            markContractCheckpointNotApplicable(state, "AU-POV", "Dokument nie zawiera danych podmiotu do odrębnej weryfikacji.", [
                "audit://contract/AU-POV"
            ]);
        expect(nextContractCheckpoint(state)).toBe("AU-ROUTE");
        expect(() => markContractCheckpointNotApplicable(state, "AU-ROUTE", "Nie dotyczy", [
            "audit://contract/AU-ROUTE"
        ])).toThrow("CONTRACT_NA_NOT_ALLOWED");
    });
    it("blocks out-of-order and unaudited transitions", () => {
        const state = createContractAnalysisState(CASE_ID, "ANALYSIS");
        expect(() => completeContractCheckpoint(state, "AU-A", [
            "audit://contract/AU-A"
        ])).toThrow("CONTRACT_CHECKPOINT_OUT_OF_ORDER");
        expect(() => completeContractCheckpoint(state, "AU-F0", [])).toThrow("CONTRACT_AUDIT_REFS_INVALID");
    });
    it("never permits finalization to be marked N/A", () => {
        const state = createContractAnalysisState(CASE_ID, "DRAFT");
        expect(() => markContractCheckpointNotApplicable(state, "AU-HYBRID", "Użytkownik chce pominąć walidację.", [
            "audit://contract/AU-HYBRID"
        ])).toThrow("CONTRACT_NA_NOT_ALLOWED");
    });
});

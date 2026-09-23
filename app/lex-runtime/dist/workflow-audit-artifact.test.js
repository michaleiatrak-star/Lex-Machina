import { describe, expect, it } from "vitest";
import { SESSION_EXECUTION_INTERNAL } from "./session-executor.js";
import { buildWorkflowAuditArtifact, parseWorkflowAuditArtifact } from "./workflow-audit-artifact.js";
const CASE_ID = "case_" +
    "a".repeat(32);
function resultFixture() {
    const result = {
        sessionId: "session-test-123",
        status: "DRAFT_PRESENTABLE",
        provider: "openai",
        model: "local/test-model",
        primarySkill: "analiza-sadowa-v6",
        answer: "TA TREŚĆ NIE MOŻE TRAFIĆ DO AUDYTU",
        documentCitations: [
            {
                citationId: "docref_1",
                marker: "[[LEXDOCREF:docref_1]]",
                label: "Dokument 1, s. 2",
                caseId: CASE_ID,
                documentId: "doc_1234567890abcdef",
                chunkIndex: 3,
                pageStart: 2,
                pageEnd: 2,
                contextText: "TAJNY KONTEKST DOKUMENTU",
                quote: "TAJNY CYTAT",
                highlightStart: 10,
                highlightEnd: 20
            }
        ],
        documentCitationFreshness: {
            result: "PASS",
            checked: 1
        },
        finalization: "PASS",
        blockedReferences: [],
        verification: {
            records: 2,
            verified: 2,
            supported: 2,
            unverified: 0
        },
        evidence: [],
        audit: {
            result: "PASS",
            eventCount: 3,
            closed: true
        },
        workflow: {
            id: "COURT_ANALYSIS_V1",
            result: "PASS",
            requiredResources: [
                "analiza-sadowa-v6/SKILL.md"
            ],
            missingResources: []
        }
    };
    Object.defineProperty(result, SESSION_EXECUTION_INTERNAL, {
        value: {
            verificationRecords: [],
            auditEvents: [
                {
                    sequence: 1,
                    timestamp: "2026-09-18T07:00:00.000Z",
                    type: "session_started",
                    target: "session-test-123",
                    status: "OK",
                    detail: {
                        raw: "NIE ZAPISUJ TEGO"
                    }
                },
                {
                    sequence: 2,
                    timestamp: "2026-09-18T07:00:01.000Z",
                    type: "gate",
                    target: "G39H_WORKFLOW_FINALIZATION",
                    status: "OK",
                    detail: {
                        secret: "NIE ZAPISUJ DETAIL"
                    }
                },
                {
                    sequence: 3,
                    timestamp: "2026-09-18T07:00:02.000Z",
                    type: "session_closed",
                    target: "session-test-123",
                    status: "OK"
                }
            ]
        },
        enumerable: false
    });
    return result;
}
describe("workflow audit artifact", () => {
    it("persists only privacy-bounded execution evidence", () => {
        const bytes = buildWorkflowAuditArtifact({
            caseId: CASE_ID,
            workflowId: "COURT_ANALYSIS_V1",
            checkpoint: "SD_VER_COMPLETE",
            result: resultFixture(),
            createdAt: "2026-09-18T07:00:03.000Z"
        });
        const text = bytes.toString("utf8");
        expect(text)
            .not.toContain("TA TREŚĆ NIE MOŻE TRAFIĆ DO AUDYTU");
        expect(text)
            .not.toContain("TAJNY KONTEKST DOKUMENTU");
        expect(text)
            .not.toContain("TAJNY CYTAT");
        expect(text)
            .not.toContain("NIE ZAPISUJ DETAIL");
        const parsed = parseWorkflowAuditArtifact(bytes);
        expect(parsed.workflowId).toBe("COURT_ANALYSIS_V1");
        expect(parsed.checkpoint).toBe("SD_VER_COMPLETE");
        expect(parsed.events.map((event) => event.sequence)).toEqual([
            1,
            2,
            3
        ]);
        expect(parsed.citations[0]).toEqual({
            caseId: CASE_ID,
            documentId: "doc_1234567890abcdef",
            chunkIndex: 3,
            pageStart: 2,
            pageEnd: 2,
            highlightStart: 10,
            highlightEnd: 20
        });
    });
    it("refuses to build an artifact for a blocked or mismatched workflow", () => {
        const blocked = resultFixture();
        blocked.audit.result =
            "BLOCKED";
        expect(() => buildWorkflowAuditArtifact({
            caseId: CASE_ID,
            workflowId: "COURT_ANALYSIS_V1",
            checkpoint: "SD_VER_COMPLETE",
            result: blocked
        })).toThrow("WORKFLOW_AUDIT_RESULT_NOT_PASS");
        const mismatch = resultFixture();
        expect(() => buildWorkflowAuditArtifact({
            caseId: CASE_ID,
            workflowId: "CHRONOLOGY_V1",
            checkpoint: "DOCS_INDEXED",
            result: mismatch
        })).toThrow("WORKFLOW_AUDIT_RESULT_NOT_PASS");
    });
    it("rejects tampered stored payloads", () => {
        const bytes = buildWorkflowAuditArtifact({
            caseId: CASE_ID,
            workflowId: "COURT_ANALYSIS_V1",
            checkpoint: "SD_VER_COMPLETE",
            result: resultFixture()
        });
        const parsed = JSON.parse(bytes.toString("utf8"));
        parsed.caseId =
            "case_invalid";
        expect(() => parseWorkflowAuditArtifact(Buffer.from(JSON.stringify(parsed), "utf8"))).toThrow("WORKFLOW_AUDIT_ARTIFACT_INVALID");
    });
});

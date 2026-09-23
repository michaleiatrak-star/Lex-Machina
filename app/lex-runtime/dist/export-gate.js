import { createHash } from "node:crypto";
import { AuditedFinalizer } from "./audited-finalizer.js";
function bytesOf(content) {
    return typeof content === "string"
        ? new TextEncoder().encode(content)
        : content;
}
function sha256(content) {
    return createHash("sha256").update(bytesOf(content)).digest("hex");
}
export function buildNeutralVerificationLog(sessionId, ledger) {
    return {
        session_id: sessionId,
        events: ledger.all().map((record) => ({
            tool: record.verificationMethod ?? "provider_tool",
            query_context: record.claim,
            status: record.status,
            ...(record.sourceUrl ? { url: record.sourceUrl } : {}),
            ...(record.sourceTier ? { source_tier: record.sourceTier } : {}),
            ...(record.temporalMode ? { temporal_mode: record.temporalMode } : {}),
            ...(record.asOf ? { as_of: record.asOf } : {}),
            ...(record.sourceFormat
                ? { source_format: record.sourceFormat }
                : {}),
            ...(record.caseScope
                ? { case_scope: record.caseScope }
                : {}),
            fetched_at: record.fetchedAt,
            ...(record.toolCallId ? { tool_call_id: record.toolCallId } : {})
        }))
    };
}
function hybridRequired(kind) {
    return (kind === "docx" ||
        kind === "odt" ||
        kind === "pdf");
}
function preCloseAuditIsComplete(report) {
    return (report.violations.length === 0 &&
        report.missing.every((item) => item === "session_closed"));
}
export class ExportGate {
    finalizer;
    constructor(finalizer = new AuditedFinalizer()) {
        this.finalizer = finalizer;
    }
    evaluate(args) {
        const verificationLog = buildNeutralVerificationLog(args.audit.sessionId, args.ledger);
        const reasons = [];
        if (args.audit.isClosed) {
            return {
                gate: "G10_EXPORT_GATE",
                result: "BLOCKED",
                reasons: ["AUDIT_ALREADY_CLOSED"],
                verificationLog
            };
        }
        const requiresHybrid = hybridRequired(args.documentKind);
        if (requiresHybrid &&
            args.hybridValidation !== "PASS") {
            args.audit.record("gate", "HYBRID_VALIDATION", "BLOCKED", { status: args.hybridValidation, documentKind: args.documentKind });
            args.audit.record("gate", "G10_EXPORT_GATE", "BLOCKED", { reason: "HYBRID_VALIDATION_REQUIRED" });
            return {
                gate: "G10_EXPORT_GATE",
                result: "BLOCKED",
                reasons: ["HYBRID_VALIDATION_REQUIRED"],
                verificationLog
            };
        }
        args.audit.record("gate", "HYBRID_VALIDATION", "OK", {
            status: args.hybridValidation,
            documentKind: args.documentKind
        });
        const finalization = this.finalizer.finalize({
            text: args.documentText,
            ledger: args.ledger,
            audit: args.audit,
            closeSession: false
        });
        if (finalization.result !== "PASS") {
            const reason = finalization.result === "DEGRADED"
                ? "UNVERIFIED_REFERENCE_REQUIRES_HUMAN_DECISION"
                : "G8_FINALIZATION_BLOCKED";
            reasons.push(reason);
            args.audit.record("gate", "G10_EXPORT_GATE", "BLOCKED", { reason, g8: finalization.result });
            return {
                gate: "G10_EXPORT_GATE",
                result: "BLOCKED",
                reasons,
                finalization,
                verificationLog
            };
        }
        const requireVerification = finalization.references.length > 0;
        const preClose = args.audit.validateCompletion({
            requireVerification
        });
        if (!preCloseAuditIsComplete(preClose)) {
            reasons.push("G9_AUDIT_INCOMPLETE");
            args.audit.record("gate", "G10_EXPORT_GATE", "BLOCKED", {
                reason: "G9_AUDIT_INCOMPLETE",
                missing: preClose.missing,
                violations: preClose.violations
            });
            return {
                gate: "G10_EXPORT_GATE",
                result: "BLOCKED",
                reasons,
                finalization,
                auditCompleteness: preClose,
                verificationLog
            };
        }
        const documentHash = sha256(args.documentContent);
        args.audit.record("document_generated", args.documentSkill, "OK", {
            documentKind: args.documentKind,
            hashAlgorithm: "SHA-256",
            hash: documentHash
        });
        args.audit.record("gate", "G10_EXPORT_GATE", "OK", {
            documentKind: args.documentKind,
            documentHash
        });
        args.audit.close("OK", {
            exportGate: "PASS",
            documentHash
        });
        const auditCompleteness = args.audit.validateCompletion({
            requireVerification
        });
        if (auditCompleteness.result !== "PASS") {
            throw new Error("Invariant violation: audit became incomplete after successful export close.");
        }
        return {
            gate: "G10_EXPORT_GATE",
            result: "PASS",
            reasons: [],
            documentHash,
            finalization,
            auditCompleteness,
            verificationLog
        };
    }
}

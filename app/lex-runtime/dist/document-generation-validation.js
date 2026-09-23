import { AuditTrail } from "./audit-trail.js";
import { VerificationLedger } from "./verification-ledger.js";
export function validateLocalHybridDocument(text, context) {
    const reasons = [];
    if (!text.trim())
        reasons.push("EMPTY_DOCUMENT");
    if (/⬛/u.test(text) || /\[UZUPEŁNIJ(?::|\])/iu.test(text)) {
        reasons.push("OPEN_PLACEHOLDER");
    }
    if (/DRAFT\s*[—-]\s*NIEWERYFIKOWANY/iu.test(text)) {
        reasons.push("DRAFT_UNVERIFIED");
    }
    if (/\[(?:LMPII|PII):[^\]]+\]/u.test(text)) {
        reasons.push("PRIVACY_TOKEN_REMAINS");
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text)) {
        reasons.push("CONTROL_CHARACTER");
    }
    const blockedSourceEvent = context.auditEvents.some((event) => event.status === "BLOCKED");
    if (blockedSourceEvent)
        reasons.push("SOURCE_SESSION_BLOCKED_EVENT");
    if (context.usedDocumentContext &&
        !context.auditEvents.some((event) => event.type === "resource_read" && event.target.startsWith("local-document:"))) {
        reasons.push("SOURCE_DOCUMENT_AUDIT_MISSING");
    }
    return {
        result: reasons.length === 0 ? "PASS" : "BLOCKED",
        reasons
    };
}
export function rebuildGenerationExportState(context) {
    if (context.schemaVersion !== 1 ||
        !context.sourceSessionId ||
        !context.primarySkill ||
        !context.model) {
        throw new Error("GENERATION_VALIDATION_CONTEXT_INVALID");
    }
    const ledger = new VerificationLedger();
    for (const record of context.verificationRecords) {
        ledger.add({ ...record });
    }
    const audit = new AuditTrail(context.sourceSessionId + ":document-export");
    audit.start({
        sourceSessionId: context.sourceSessionId,
        provider: context.provider,
        model: context.model,
        primarySkill: context.primarySkill,
        continuation: "FINAL_DOCUMENT_EXPORT"
    });
    const replayable = new Set([
        "skill_read",
        "resource_read",
        "route",
        "provider_start",
        "provider_end",
        "tool_decision",
        "gate"
    ]);
    for (const event of context.auditEvents) {
        if (!replayable.has(event.type))
            continue;
        if (event.type === "gate" &&
            [
                "G8_HARD_GATE_FINALIZATION",
                "G15_SAFE_SESSION_EXECUTION",
                "HYBRID_VALIDATION",
                "G10_EXPORT_GATE"
            ].includes(event.target)) {
            continue;
        }
        audit.record(event.type, event.target, event.status, {
            sourceSequence: event.sequence,
            ...(event.detail ? { sourceDetail: { ...event.detail } } : {})
        });
    }
    return { audit, ledger };
}

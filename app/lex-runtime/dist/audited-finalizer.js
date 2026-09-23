import { FinalizationGate } from "./finalization-gate.js";
export class AuditedFinalizer {
    gate;
    constructor(gate = new FinalizationGate()) {
        this.gate = gate;
    }
    finalize(args) {
        for (const record of args.ledger.all()) {
            args.audit.record("verification", record.claim, record.status === "VERIFIED" ||
                record.status === "SUPPORTED"
                ? "OK"
                : "DEGRADED", {
                kind: record.kind,
                status: record.status,
                sourceUrl: record.sourceUrl ?? null,
                sourceTier: record.sourceTier ?? null,
                fetchedAt: record.fetchedAt,
                toolCallId: record.toolCallId ?? null,
                verificationMethod: record.verificationMethod ?? null,
                temporalMode: record.temporalMode ?? "CURRENT",
                asOf: record.asOf ?? null,
                sourceFormat: record.sourceFormat ?? null,
                caseScope: record.caseScope ?? null,
                caseSignature: record.caseSignature ?? null,
                evidenceHash: record.evidenceHash ?? null,
                supportQuoteHash: record.supportQuoteHash ?? null
            });
        }
        const report = this.gate.evaluate(args.text, args.ledger);
        args.audit.record("gate", report.gate, report.result === "BLOCKED"
            ? "BLOCKED"
            : report.result === "DEGRADED"
                ? "DEGRADED"
                : "OK", {
            result: report.result,
            references: report.references.length,
            findings: report.findings.length,
            caseQuoteFindings: report.caseQuoteFindings.length,
            caseSupportFindings: report.caseSupportFindings.length
        });
        if (args.closeSession !== false &&
            report.result !== "BLOCKED") {
            args.audit.close(report.result === "DEGRADED" ? "DEGRADED" : "OK", {
                finalization: report.result
            });
        }
        return report;
    }
}

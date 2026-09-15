import { AuditTrail } from "./audit-trail.js";
import {
  FinalizationGate,
  type FinalizationReport
} from "./finalization-gate.js";
import { VerificationLedger } from "./verification-ledger.js";

export class AuditedFinalizer {
  constructor(private readonly gate = new FinalizationGate()) {}

  finalize(args: {
    text: string;
    ledger: VerificationLedger;
    audit: AuditTrail;
    closeSession?: boolean;
  }): FinalizationReport {
    for (const record of args.ledger.all()) {
      args.audit.record(
        "verification",
        record.claim,
        record.status === "VERIFIED" ? "OK" : "DEGRADED",
        {
          kind: record.kind,
          status: record.status,
          sourceUrl: record.sourceUrl ?? null,
          sourceTier: record.sourceTier ?? null,
          fetchedAt: record.fetchedAt,
          toolCallId: record.toolCallId ?? null,
          verificationMethod: record.verificationMethod ?? null
        }
      );
    }

    const report = this.gate.evaluate(args.text, args.ledger);
    args.audit.record(
      "gate",
      report.gate,
      report.result === "BLOCKED"
        ? "BLOCKED"
        : report.result === "DEGRADED"
          ? "DEGRADED"
          : "OK",
      {
        result: report.result,
        references: report.references.length,
        findings: report.findings.length
      }
    );

    if (
      args.closeSession !== false &&
      report.result !== "BLOCKED"
    ) {
      args.audit.close(report.result === "DEGRADED" ? "DEGRADED" : "OK", {
        finalization: report.result
      });
    }

    return report;
  }
}

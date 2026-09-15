import { createHash } from "node:crypto";
import { AuditTrail, type AuditCompletenessReport } from "./audit-trail.js";
import { AuditedFinalizer } from "./audited-finalizer.js";
import type { FinalizationReport } from "./finalization-gate.js";
import {
  VerificationLedger,
  type VerificationRecord
} from "./verification-ledger.js";

export type ExportDocumentKind = "docx" | "pdf" | "md" | "txt";
export type HybridValidationStatus = "PASS" | "BLOCKED" | "NOT_REQUIRED";

export type NeutralVerificationEvent = {
  tool: string;
  query_context: string;
  status: VerificationRecord["status"];
  url?: string;
  source_tier?: VerificationRecord["sourceTier"];
  fetched_at: string;
  tool_call_id?: string;
};

export type NeutralVerificationLog = {
  session_id: string;
  events: NeutralVerificationEvent[];
};

export type ExportGateReport = {
  gate: "G10_EXPORT_GATE";
  result: "PASS" | "BLOCKED";
  reasons: string[];
  documentHash?: string;
  finalization?: FinalizationReport;
  auditCompleteness?: AuditCompletenessReport;
  verificationLog: NeutralVerificationLog;
};

function bytesOf(content: string | Uint8Array): Uint8Array {
  return typeof content === "string"
    ? new TextEncoder().encode(content)
    : content;
}

function sha256(content: string | Uint8Array): string {
  return createHash("sha256").update(bytesOf(content)).digest("hex");
}

export function buildNeutralVerificationLog(
  sessionId: string,
  ledger: VerificationLedger
): NeutralVerificationLog {
  return {
    session_id: sessionId,
    events: ledger.all().map((record) => ({
      tool: record.verificationMethod ?? "provider_tool",
      query_context: record.claim,
      status: record.status,
      ...(record.sourceUrl ? { url: record.sourceUrl } : {}),
      ...(record.sourceTier ? { source_tier: record.sourceTier } : {}),
      fetched_at: record.fetchedAt,
      ...(record.toolCallId ? { tool_call_id: record.toolCallId } : {})
    }))
  };
}

function hybridRequired(kind: ExportDocumentKind): boolean {
  return kind === "docx" || kind === "pdf";
}

function preCloseAuditIsComplete(report: AuditCompletenessReport): boolean {
  return (
    report.violations.length === 0 &&
    report.missing.every((item) => item === "session_closed")
  );
}

export class ExportGate {
  constructor(private readonly finalizer = new AuditedFinalizer()) {}

  evaluate(args: {
    documentContent: string | Uint8Array;
    documentText: string;
    documentKind: ExportDocumentKind;
    documentSkill: string;
    ledger: VerificationLedger;
    audit: AuditTrail;
    hybridValidation: HybridValidationStatus;
  }): ExportGateReport {
    const verificationLog = buildNeutralVerificationLog(
      args.audit.sessionId,
      args.ledger
    );
    const reasons: string[] = [];

    if (args.audit.isClosed) {
      return {
        gate: "G10_EXPORT_GATE",
        result: "BLOCKED",
        reasons: ["AUDIT_ALREADY_CLOSED"],
        verificationLog
      };
    }

    const requiresHybrid = hybridRequired(args.documentKind);
    if (
      requiresHybrid &&
      args.hybridValidation !== "PASS"
    ) {
      args.audit.record(
        "gate",
        "HYBRID_VALIDATION",
        "BLOCKED",
        { status: args.hybridValidation, documentKind: args.documentKind }
      );
      args.audit.record(
        "gate",
        "G10_EXPORT_GATE",
        "BLOCKED",
        { reason: "HYBRID_VALIDATION_REQUIRED" }
      );
      return {
        gate: "G10_EXPORT_GATE",
        result: "BLOCKED",
        reasons: ["HYBRID_VALIDATION_REQUIRED"],
        verificationLog
      };
    }

    args.audit.record(
      "gate",
      "HYBRID_VALIDATION",
      "OK",
      {
        status: args.hybridValidation,
        documentKind: args.documentKind
      }
    );

    const finalization = this.finalizer.finalize({
      text: args.documentText,
      ledger: args.ledger,
      audit: args.audit,
      closeSession: false
    });

    if (finalization.result !== "PASS") {
      const reason =
        finalization.result === "DEGRADED"
          ? "UNVERIFIED_REFERENCE_REQUIRES_HUMAN_DECISION"
          : "G8_FINALIZATION_BLOCKED";
      reasons.push(reason);
      args.audit.record(
        "gate",
        "G10_EXPORT_GATE",
        "BLOCKED",
        { reason, g8: finalization.result }
      );
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
      args.audit.record(
        "gate",
        "G10_EXPORT_GATE",
        "BLOCKED",
        {
          reason: "G9_AUDIT_INCOMPLETE",
          missing: preClose.missing,
          violations: preClose.violations
        }
      );
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
    args.audit.record(
      "document_generated",
      args.documentSkill,
      "OK",
      {
        documentKind: args.documentKind,
        hashAlgorithm: "SHA-256",
        hash: documentHash
      }
    );
    args.audit.record(
      "gate",
      "G10_EXPORT_GATE",
      "OK",
      {
        documentKind: args.documentKind,
        documentHash
      }
    );
    args.audit.close("OK", {
      exportGate: "PASS",
      documentHash
    });

    const auditCompleteness = args.audit.validateCompletion({
      requireVerification
    });
    if (auditCompleteness.result !== "PASS") {
      throw new Error(
        "Invariant violation: audit became incomplete after successful export close."
      );
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

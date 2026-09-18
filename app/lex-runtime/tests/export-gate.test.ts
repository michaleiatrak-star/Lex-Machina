import { describe, expect, it } from "vitest";
import { AuditTrail } from "../src/audit-trail.js";
import { ExportGate } from "../src/export-gate.js";
import { VerificationLedger } from "../src/verification-ledger.js";

function baseAudit(): AuditTrail {
  const audit = new AuditTrail(
    "export-test",
    () => "2026-09-15T00:00:00Z"
  );
  audit.start();
  audit.record("skill_read", "prawny-router-v3");
  audit.record("resource_read", "shared/PRAWO-HARDGATE.md");
  audit.record("skill_read", "prawo-polskie-v2");
  audit.record("route", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
  audit.record("skill_read", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
  audit.record("provider_start", "openai");
  audit.record("provider_end", "openai");
  return audit;
}

function verifiedLedger(): VerificationLedger {
  const ledger = new VerificationLedger();
  ledger.add({
    claim: "art. 5 KC",
    kind: "statute",
    status: "VERIFIED",
    sourceUrl: "https://eli.gov.pl/",
    sourceTier: "R1",
    fetchedAt: "2026-09-15T00:00:00Z",
    toolCallId: "fetch-1",
    verificationMethod: "web_fetch"
  });
  return ledger;
}

describe("ExportGate", () => {
  it("passes a verified DOCX export and records its SHA-256 hash", () => {
    const audit = baseAudit();
    const text =
      "Znaczenie ma art. 5 KC. ✅ [VER: https://eli.gov.pl/, 2026-09-15]";

    const report = new ExportGate().evaluate({
      documentContent: text,
      documentText: text,
      documentKind: "docx",
      documentSkill: "pisma-procesowe-v3",
      ledger: verifiedLedger(),
      audit,
      hybridValidation: "PASS"
    });

    expect(report.result).toBe("PASS");
    expect(report.documentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(report.auditCompleteness?.result).toBe("PASS");
    expect(report.verificationLog.events).toContainEqual(
      expect.objectContaining({
        tool: "web_fetch",
        query_context: "art. 5 KC",
        status: "VERIFIED"
      })
    );
    expect(audit.isClosed).toBe(true);
    expect(audit.events).toContainEqual(
      expect.objectContaining({
        type: "document_generated",
        target: "pisma-procesowe-v3",
        status: "OK"
      })
    );
  });

  it("blocks DOCX export without successful HYBRID-VALIDATION", () => {
    const audit = baseAudit();
    const report = new ExportGate().evaluate({
      documentContent: "draft",
      documentText: "draft",
      documentKind: "docx",
      documentSkill: "pisma-procesowe-v3",
      ledger: new VerificationLedger(),
      audit,
      hybridValidation: "BLOCKED"
    });

    expect(report).toMatchObject({
      result: "BLOCKED",
      reasons: ["HYBRID_VALIDATION_REQUIRED"]
    });
    expect(audit.isClosed).toBe(false);
  });

  it("blocks automatic export for an unsupported legal reference", () => {
    const audit = baseAudit();
    const report = new ExportGate().evaluate({
      documentContent: "Art. 1234 KC.",
      documentText: "Art. 1234 KC.",
      documentKind: "docx",
      documentSkill: "pisma-procesowe-v3",
      ledger: new VerificationLedger(),
      audit,
      hybridValidation: "PASS"
    });

    expect(report).toMatchObject({
      result: "BLOCKED",
      reasons: ["G8_FINALIZATION_BLOCKED"]
    });
  });

  it("blocks automatic export for a visibly unverified reference", () => {
    const audit = baseAudit();
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "sygn. III ABC 12/26",
      kind: "case",
      status: "UNVERIFIED",
      fetchedAt: "2026-09-15T00:00:00Z",
      toolCallId: "search-1",
      verificationMethod: "web_search"
    });

    const text =
      "Orzeczenie sygn. III ABC 12/26 ⚠️ [NIEWERYFIKOWANE]";
    const report = new ExportGate().evaluate({
      documentContent: text,
      documentText: text,
      documentKind: "pdf",
      documentSkill: "pisma-procesowe-v3",
      ledger,
      audit,
      hybridValidation: "PASS"
    });

    expect(report).toMatchObject({
      result: "BLOCKED",
      reasons: ["UNVERIFIED_REFERENCE_REQUIRES_HUMAN_DECISION"]
    });
  });

  it("blocks export when the earlier audit is incomplete", () => {
    const audit = new AuditTrail(
      "incomplete-export",
      () => "2026-09-15T00:00:00Z"
    );
    audit.start();
    audit.record("skill_read", "prawny-router-v3");
    audit.record("route", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
    audit.record("provider_start", "openai");

    const report = new ExportGate().evaluate({
      documentContent: "No legal references.",
      documentText: "No legal references.",
      documentKind: "md",
      documentSkill: "raport-klienta-v1",
      ledger: new VerificationLedger(),
      audit,
      hybridValidation: "NOT_REQUIRED"
    });

    expect(report).toMatchObject({
      result: "BLOCKED",
      reasons: ["G9_AUDIT_INCOMPLETE"]
    });
  });

  it("allows non-DOCX/PDF export with HYBRID-VALIDATION not required", () => {
    const audit = baseAudit();
    const text = "Technical report without legal references.";
    const report = new ExportGate().evaluate({
      documentContent: text,
      documentText: text,
      documentKind: "md",
      documentSkill: "raport-klienta-v1",
      ledger: new VerificationLedger(),
      audit,
      hybridValidation: "NOT_REQUIRED"
    });

    expect(report.result).toBe("PASS");
  });
});

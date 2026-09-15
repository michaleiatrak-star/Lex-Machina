import { describe, expect, it } from "vitest";
import { FinalizationGate } from "../src/finalization-gate.js";
import { VerificationLedger } from "../src/verification-ledger.js";

describe("FinalizationGate", () => {
  it("passes text with no legal references", () => {
    const report = new FinalizationGate().evaluate(
      "Opis stanu faktycznego bez powołań prawnych.",
      new VerificationLedger()
    );
    expect(report.result).toBe("PASS");
    expect(report.references).toHaveLength(0);
  });

  it("blocks a legal article with no verification record", () => {
    const report = new FinalizationGate().evaluate(
      "Zastosowanie ma art. 1234 KC.",
      new VerificationLedger()
    );
    expect(report.result).toBe("BLOCKED");
    expect(report.findings[0]?.status).toBe("MISSING_LEDGER_RECORD");
  });

  it("blocks a verified record when the output hides the verification marker", () => {
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "art. 5 KC",
      kind: "statute",
      status: "VERIFIED",
      sourceUrl: "https://eli.gov.pl/",
      sourceTier: "R1",
      fetchedAt: "2026-09-15T00:00:00Z",
      toolCallId: "fetch-1"
    });

    const report = new FinalizationGate().evaluate(
      "Znaczenie ma art. 5 KC.",
      ledger
    );
    expect(report.result).toBe("BLOCKED");
    expect(report.findings[0]?.status).toBe("MISSING_VERIFICATION_MARKER");
  });

  it("passes a verified article when evidence and marker are present", () => {
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "art. 5 KC",
      kind: "statute",
      status: "VERIFIED",
      sourceUrl: "https://eli.gov.pl/",
      sourceTier: "R1",
      fetchedAt: "2026-09-15T00:00:00Z",
      toolCallId: "fetch-1"
    });

    const report = new FinalizationGate().evaluate(
      "Znaczenie ma art. 5 KC. ✅ [VER: https://eli.gov.pl/, 2026-09-15]",
      ledger
    );
    expect(report.result).toBe("PASS");
    expect(report.findings[0]?.status).toBe("VERIFIED");
  });

  it("allows explicit degraded output only with an UNVERIFIED ledger record", () => {
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "sygn. III ABC 12/26",
      kind: "case",
      status: "UNVERIFIED",
      fetchedAt: "2026-09-15T00:00:00Z",
      toolCallId: "search-2",
      evidence: "Official source unavailable after attempted verification."
    });

    const report = new FinalizationGate().evaluate(
      "Orzeczenie sygn. III ABC 12/26 ⚠️ [NIEWERYFIKOWANE]",
      ledger
    );
    expect(report.result).toBe("DEGRADED");
    expect(report.findings[0]?.status).toBe("UNVERIFIED_MARKED");
  });

  it("blocks an unverified record when the warning marker is missing", () => {
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "Dz.U. 2026 poz. 9999",
      kind: "journal",
      status: "UNVERIFIED",
      fetchedAt: "2026-09-15T00:00:00Z",
      toolCallId: "fetch-3"
    });

    const report = new FinalizationGate().evaluate(
      "Akt opublikowano jako Dz.U. 2026 poz. 9999.",
      ledger
    );
    expect(report.result).toBe("BLOCKED");
    expect(report.findings[0]?.status).toBe("UNVERIFIED_NOT_MARKED");
  });
});

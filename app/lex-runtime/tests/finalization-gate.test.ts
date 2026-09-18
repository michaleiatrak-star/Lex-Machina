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

  it("blocks a forged VER marker when its source receipt differs from the ledger", () => {
    const ledger = new VerificationLedger();
    ledger.add({
      claim: "art. 5 KC",
      kind: "statute",
      status: "VERIFIED",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      toolCallId: "fetch-forged-marker"
    });

    const report =
      new FinalizationGate().evaluate(
        "Znaczenie ma art. 5 KC. ✅ [VER: https://example.invalid/fake, 2026-09-15]",
        ledger
      );

    expect(report.result)
      .toBe("BLOCKED");
    expect(
      report.findings[0]?.status
    ).toBe(
      "VERIFICATION_MARKER_MISMATCH"
    );
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

  it("passes a verified SN exact quote only when hash, quote and signature share the line", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim: "sygn. III CZP 25/11",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      toolCallId: "case-1",
      caseScope: "FULL_TEXT"
    });

    ledger.add({
      claim:
        "pełny tekst orzeczenia zawiera tę dokładną wypowiedź",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      toolCallId: "quote-1",
      caseScope: "EXACT_QUOTE",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "0123456789abcdefabcd"
    });

    const report =
      new FinalizationGate().evaluate(
        "„pełny tekst orzeczenia zawiera tę dokładną wypowiedź” sygn. III CZP 25/11 ✅ [VER: https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1, 2026-09-15] ✅ [CASE-QUOTE:0123456789abcdefabcd]",
        ledger
      );

    expect(report.result).toBe("PASS");
    expect(
      report.caseQuoteFindings
    ).toEqual([
      expect.objectContaining({
        status: "VERIFIED",
        evidenceHash:
          "0123456789abcdefabcd"
      })
    ]);
  });

  it("blocks a fabricated CASE-QUOTE marker with no ledger evidence", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim: "sygn. III CZP 25/11",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z"
    });

    const report =
      new FinalizationGate().evaluate(
        "„zmyślony cytat” sygn. III CZP 25/11 ✅ [VER: https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1, 2026-09-15] ✅ [CASE-QUOTE:aaaaaaaaaaaaaaaaaaaa]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseQuoteFindings[0]
        ?.status
    ).toBe(
      "MISSING_CASE_QUOTE_LEDGER"
    );
  });

  it("blocks when the output edits a quote after verification", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim: "sygn. III CZP 25/11",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z"
    });

    ledger.add({
      claim:
        "dokładnie zweryfikowany cytat z orzeczenia",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope: "EXACT_QUOTE",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "bbbbbbbbbbbbbbbbbbbb"
    });

    const report =
      new FinalizationGate().evaluate(
        "„zmieniony cytat z orzeczenia” sygn. III CZP 25/11 ✅ [VER: https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1, 2026-09-15] ✅ [CASE-QUOTE:bbbbbbbbbbbbbbbbbbbb]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseQuoteFindings[0]
        ?.status
    ).toBe("QUOTE_TEXT_MISMATCH");
  });

  it("blocks when a verified quote marker is detached from its case signature", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim:
        "dokładnie zweryfikowany cytat z orzeczenia",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope: "EXACT_QUOTE",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "cccccccccccccccccccc"
    });

    const report =
      new FinalizationGate().evaluate(
        "„dokładnie zweryfikowany cytat z orzeczenia” ✅ [CASE-QUOTE:cccccccccccccccccccc]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseQuoteFindings[0]
        ?.status
    ).toBe(
      "CASE_SIGNATURE_MISSING"
    );
  });


  it("passes evidence-linked proposition only when proposition, support quote and signature stay on one line", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim: "sygn. III CZP 25/11",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope: "FULL_TEXT"
    });

    ledger.add({
      claim:
        "pełny tekst orzeczenia zawiera tę dokładną wypowiedź",
      kind: "case",
      status: "VERIFIED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope: "EXACT_QUOTE",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "11111111111111111111"
    });

    ledger.add({
      claim:
        "SN wskazał na znaczenie tej zasady.",
      kind: "case",
      status: "SUPPORTED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope:
        "PROPOSITION_SUPPORT",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "22222222222222222222",
      supportQuoteHash:
        "11111111111111111111",
      supportQuote:
        "pełny tekst orzeczenia zawiera tę dokładną wypowiedź"
    });

    const report =
      new FinalizationGate().evaluate(
        "SN wskazał na znaczenie tej zasady. „pełny tekst orzeczenia zawiera tę dokładną wypowiedź” sygn. III CZP 25/11 ✅ [VER: https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1, 2026-09-15] ✅ [CASE-QUOTE:11111111111111111111] 🔗 [CASE-SUPPORT:22222222222222222222]",
        ledger
      );

    expect(report.result).toBe("PASS");
    expect(
      report.caseSupportFindings
    ).toEqual([
      expect.objectContaining({
        status: "SUPPORTED",
        evidenceHash:
          "22222222222222222222"
      })
    ]);
  });

  it("blocks a fabricated CASE-SUPPORT marker", () => {
    const ledger = new VerificationLedger();

    const report =
      new FinalizationGate().evaluate(
        "SN wskazał na znaczenie tej zasady. „pełny tekst orzeczenia zawiera tę dokładną wypowiedź” sygn. III CZP 25/11 ✅ [VER: https://sn.pl/fake, 2026-09-15] ✅ [CASE-QUOTE:11111111111111111111] 🔗 [CASE-SUPPORT:33333333333333333333]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseSupportFindings[0]
        ?.status
    ).toBe(
      "MISSING_CASE_SUPPORT_LEDGER"
    );
  });

  it("blocks when supported proposition wording changes after evidence linking", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim:
        "SN wskazał na znaczenie tej zasady.",
      kind: "case",
      status: "SUPPORTED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope:
        "PROPOSITION_SUPPORT",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "44444444444444444444",
      supportQuoteHash:
        "11111111111111111111",
      supportQuote:
        "pełny tekst orzeczenia zawiera tę dokładną wypowiedź"
    });

    const report =
      new FinalizationGate().evaluate(
        "SN przesądził tę zasadę. „pełny tekst orzeczenia zawiera tę dokładną wypowiedź” sygn. III CZP 25/11 🔗 [CASE-SUPPORT:44444444444444444444]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseSupportFindings[0]
        ?.status
    ).toBe(
      "PROPOSITION_TEXT_MISMATCH"
    );
  });

  it("blocks when the exact support quote is omitted from a supported proposition", () => {
    const ledger = new VerificationLedger();

    ledger.add({
      claim:
        "SN wskazał na znaczenie tej zasady.",
      kind: "case",
      status: "SUPPORTED",
      sourceUrl:
        "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
      sourceTier: "R1",
      fetchedAt:
        "2026-09-15T00:00:00Z",
      caseScope:
        "PROPOSITION_SUPPORT",
      caseSignature:
        "III CZP 25/11",
      evidenceHash:
        "55555555555555555555",
      supportQuoteHash:
        "11111111111111111111",
      supportQuote:
        "pełny tekst orzeczenia zawiera tę dokładną wypowiedź"
    });

    const report =
      new FinalizationGate().evaluate(
        "SN wskazał na znaczenie tej zasady. sygn. III CZP 25/11 🔗 [CASE-SUPPORT:55555555555555555555]",
        ledger
      );

    expect(report.result).toBe(
      "BLOCKED"
    );
    expect(
      report.caseSupportFindings[0]
        ?.status
    ).toBe(
      "SUPPORT_QUOTE_MISSING"
    );
  });

});

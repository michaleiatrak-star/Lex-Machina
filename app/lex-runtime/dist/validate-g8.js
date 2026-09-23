import { FinalizationGate } from "./finalization-gate.js";
import { VerificationLedger } from "./verification-ledger.js";
const gate = new FinalizationGate();
const cases = [
    {
        id: "unsupported-article-blocked",
        text: "Zastosowanie ma art. 1234 KC.",
        setup() { },
        expected: "BLOCKED"
    },
    {
        id: "verified-article-passes",
        text: "Zastosowanie ma art. 5 KC. ✅ [VER: https://eli.gov.pl/, 2026-09-15]",
        setup(ledger) {
            ledger.add({
                claim: "art. 5 KC",
                kind: "statute",
                status: "VERIFIED",
                sourceUrl: "https://eli.gov.pl/",
                sourceTier: "R1",
                fetchedAt: "2026-09-15T00:00:00Z",
                toolCallId: "fetch-art-5"
            });
        },
        expected: "PASS"
    },
    {
        id: "unverified-case-visible-degraded",
        text: "Orzeczenie sygn. III ABC 12/26 ⚠️ [NIEWERYFIKOWANE]",
        setup(ledger) {
            ledger.add({
                claim: "sygn. III ABC 12/26",
                kind: "case",
                status: "UNVERIFIED",
                fetchedAt: "2026-09-15T00:00:00Z",
                toolCallId: "search-case"
            });
        },
        expected: "DEGRADED"
    },
    {
        id: "unverified-hidden-blocked",
        text: "Akt: Dz.U. 2026 poz. 9999.",
        setup(ledger) {
            ledger.add({
                claim: "Dz.U. 2026 poz. 9999",
                kind: "journal",
                status: "UNVERIFIED",
                fetchedAt: "2026-09-15T00:00:00Z",
                toolCallId: "fetch-dzu"
            });
        },
        expected: "BLOCKED"
    }
];
const results = cases.map((testCase) => {
    const ledger = new VerificationLedger();
    testCase.setup(ledger);
    const report = gate.evaluate(testCase.text, ledger);
    return {
        id: testCase.id,
        expected: testCase.expected,
        actual: report.result,
        pass: report.result === testCase.expected,
        findings: report.findings
    };
});
const pass = results.every((entry) => entry.pass);
process.stdout.write(JSON.stringify({
    gate: "G8_HARD_GATE_FINALIZATION",
    result: pass ? "PASS" : "BLOCKED",
    cases: results
}, null, 2) + "\n");
if (!pass)
    process.exitCode = 1;

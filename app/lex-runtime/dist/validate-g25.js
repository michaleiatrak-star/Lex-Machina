import { publicEvidenceBundle } from "./session-executor.js";
const hiddenA = "internal statute snippet";
const hiddenB = "internal support passage";
const records = [
    {
        claim: "art. 5 KC",
        kind: "statute",
        status: "VERIFIED",
        sourceUrl: "https://api.sejm.gov.pl/eli/acts/DU/2019/1145/text.html",
        sourceTier: "R1",
        fetchedAt: "2026-09-15T20:00:00Z",
        verificationMethod: "web_fetch",
        temporalMode: "HISTORICAL",
        asOf: "2020-06-01",
        sourceFormat: "TEXT",
        evidence: hiddenA
    },
    {
        claim: "art. 5 KC",
        kind: "statute",
        status: "VERIFIED",
        sourceUrl: "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf",
        sourceTier: "R1",
        fetchedAt: "2026-09-15T20:01:00Z",
        verificationMethod: "web_fetch_pdf",
        temporalMode: "CURRENT",
        sourceFormat: "PDF"
    },
    {
        claim: "dokładny cytat",
        kind: "case",
        status: "VERIFIED",
        sourceUrl: "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
        sourceTier: "R1",
        fetchedAt: "2026-09-15T20:02:00Z",
        verificationMethod: "web_fetch",
        sourceFormat: "TEXT",
        caseScope: "EXACT_QUOTE",
        caseSignature: "III CZP 25/11",
        evidenceHash: "11111111111111111111"
    },
    {
        claim: "Parafraza powiązana z dowodem.",
        kind: "case",
        status: "SUPPORTED",
        sourceUrl: "https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=1",
        sourceTier: "R1",
        fetchedAt: "2026-09-15T20:03:00Z",
        verificationMethod: "web_fetch",
        sourceFormat: "TEXT",
        caseScope: "PROPOSITION_SUPPORT",
        caseSignature: "III CZP 25/11",
        evidenceHash: "22222222222222222222",
        supportQuoteHash: "11111111111111111111",
        supportQuote: hiddenB,
        evidence: "internal relation note"
    }
];
const bundle = publicEvidenceBundle(records);
const serialized = JSON.stringify(bundle);
const historical = bundle.find((item) => item.temporalMode === "HISTORICAL");
const pdf = bundle.find((item) => item.sourceFormat === "PDF");
const quote = bundle.find((item) => item.caseScope === "EXACT_QUOTE");
const supported = bundle.find((item) => item.status === "SUPPORTED");
const leaked = [hiddenA, hiddenB].filter((value) => serialized.includes(value));
const pass = bundle.length === 4 &&
    historical?.asOf === "2020-06-01" &&
    pdf?.verificationMethod === "web_fetch_pdf" &&
    quote?.caseSignature === "III CZP 25/11" &&
    quote?.evidenceHash === "11111111111111111111" &&
    supported?.caseScope === "PROPOSITION_SUPPORT" &&
    supported?.supportQuoteHash === "11111111111111111111" &&
    leaked.length === 0;
process.stdout.write(JSON.stringify({
    gate: "G25_STRUCTURED_EVIDENCE_BUNDLE",
    result: pass ? "PASS" : "BLOCKED",
    records: bundle.length,
    statuses: bundle.map((item) => item.status),
    historicalAsOf: historical?.asOf ?? null,
    pdfMethod: pdf?.verificationMethod ?? null,
    quoteScope: quote?.caseScope ?? null,
    supportScope: supported?.caseScope ?? null,
    backendOnlyValuesLeaked: leaked
}, null, 2) + "\n");
if (!pass) {
    process.exitCode = 1;
}

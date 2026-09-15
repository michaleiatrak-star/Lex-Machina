import {
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";

const sourceUrl =
  "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf";

const result =
  await new OfficialLegalSourceVerifier()
    .verify({
      claim: "art. 5 KC",
      kind: "statute",
      url: sourceUrl,
      expectedTitle:
        "Kodeks cywilny",
      toolCallId:
        "g20-live-pdf"
    });

const pass =
  result.matched === true &&
  result.record.status ===
    "VERIFIED" &&
  result.record.sourceUrl ===
    sourceUrl &&
  result.record.verificationMethod ===
    "web_fetch_pdf" &&
  result.record.sourceFormat ===
    "PDF";

process.stdout.write(
  JSON.stringify({
    gate:
      "G20_LIVE_OFFICIAL_PDF_PROBE",
    result:
      pass ? "PASS" : "BLOCKED",
    sourceUrl,
    matched:
      result.matched,
    verificationStatus:
      result.record.status,
    verificationMethod:
      result.record
        .verificationMethod ?? null,
    sourceFormat:
      result.record
        .sourceFormat ?? null,
    sourceTier:
      result.record
        .sourceTier ?? null,
    fetchedAt:
      result.record.fetchedAt,
    modelProviderCallExecuted:
      false
  }, null, 2) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}

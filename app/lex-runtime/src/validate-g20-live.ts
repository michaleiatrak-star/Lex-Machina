import {
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";
import {
  LocalPdfTextExtractor
} from "./pdf-text-extractor.js";

const sourceUrl =
  "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf";

async function fetchWithTimeout(
  input: string | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    25_000
  );

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

const verifier =
  new OfficialLegalSourceVerifier(
    fetchWithTimeout,
    undefined,
    new LocalPdfTextExtractor()
  );

let result:
  | Awaited<
      ReturnType<
        typeof verifier.verify
      >
    >
  | null = null;
let lastError: unknown = null;
let attempts = 0;

for (
  let attempt = 1;
  attempt <= 2;
  attempt += 1
) {
  attempts = attempt;
  try {
    result = await verifier.verify({
      claim: "art. 5 KC",
      kind: "statute",
      url: sourceUrl,
      expectedTitle:
        "Kodeks cywilny",
      toolCallId:
        "g20-live-pdf"
    });
    break;
  } catch (error) {
    lastError = error;
  }
}

const pass =
  result?.matched === true &&
  result.record.status ===
    "VERIFIED" &&
  result.record.sourceUrl ===
    sourceUrl &&
  result.record.verificationMethod ===
    "web_fetch_pdf" &&
  result.record.sourceFormat ===
    "PDF" &&
  Boolean(result.record.evidence);

process.stdout.write(
  JSON.stringify({
    gate:
      "G20_LIVE_OFFICIAL_PDF_PROBE",
    result:
      pass ? "PASS" : "BLOCKED",
    sourceUrl,
    attempts,
    matched:
      result?.matched ?? false,
    verificationStatus:
      result?.record.status ?? null,
    verificationMethod:
      result?.record
        .verificationMethod ?? null,
    sourceFormat:
      result?.record
        .sourceFormat ?? null,
    sourceTier:
      result?.record
        .sourceTier ?? null,
    evidencePresent:
      Boolean(result?.record.evidence),
    modelProviderCallExecuted:
      false,
    ...(lastError && !result
      ? {
          error:
            lastError instanceof Error
              ? lastError.name
              : "UNKNOWN_ERROR"
        }
      : {})
  }, null, 2) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}

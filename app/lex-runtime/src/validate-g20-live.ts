import {
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";
import {
  LocalPdfTextExtractor
} from "./pdf-text-extractor.js";
import {
  TemporalSourceFreshnessChecker
} from "./temporal-source-freshness.js";
import {
  LegalVerificationToolRuntime
} from "./verification-tool-runtime.js";
import {
  VerificationLedger
} from "./verification-ledger.js";

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

const ledger =
  new VerificationLedger();
const runtime =
  new LegalVerificationToolRuntime(
    ledger,
    verifier,
    undefined,
    new TemporalSourceFreshnessChecker(
      fetchWithTimeout
    )
  );

const [kkToolResult] =
  await runtime.runTools([{
    id:
      "g20-live-kk-190a",
    name:
      "verify_legal_reference",
    input: {
      claim:
        "art. 190a KK",
      kind:
        "statute",
      act:
        "KK"
    }
  }]);

let kkPayload:
  Record<string, unknown> =
    {};
try {
  kkPayload =
    JSON.parse(
      kkToolResult?.content ??
        "{}"
    ) as
      Record<string, unknown>;
} catch {
  kkPayload = {};
}

const kkEvidence =
  typeof kkPayload.evidence ===
    "string"
    ? kkPayload.evidence
    : "";
const kkSourceUrl =
  typeof kkPayload.sourceUrl ===
    "string"
    ? kkPayload.sourceUrl
    : "";

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
  Boolean(result.record.evidence) &&
  kkPayload.status ===
    "VERIFIED" &&
  /\bArt\.?\s+190a\b/iu.test(
    kkEvidence
  ) &&
  kkSourceUrl.includes(
    "/DU/2025/383/"
  );

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
    kk190a: {
      status:
        kkPayload.status ??
        null,
      sourceUrl:
        kkSourceUrl ||
        null,
      sourceFormat:
        kkPayload.sourceFormat ??
        null,
      evidencePresent:
        Boolean(
          kkEvidence
        ),
      exactArticlePresent:
        /\bArt\.?\s+190a\b/iu.test(
          kkEvidence
        )
    },
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

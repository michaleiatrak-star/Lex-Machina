import {
  LegalSourceVerificationError,
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";

const SOURCE_URL =
  "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.html";

async function fetchWithTimeout(
  input: string | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    15_000
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

async function runAttempt() {
  const verifier = new OfficialLegalSourceVerifier(
    fetchWithTimeout
  );

  return verifier.verify({
    claim: "art. 5 KC",
    kind: "statute",
    url: SOURCE_URL,
    expectedTitle: "Kodeks cywilny",
    toolCallId: "g17-live-eli-art-5"
  });
}

let result: Awaited<ReturnType<typeof runAttempt>> | null = null;
let lastError: unknown = null;
let attempts = 0;

for (let attempt = 1; attempt <= 2; attempt += 1) {
  attempts = attempt;
  try {
    result = await runAttempt();
    if (
      result.matched === true &&
      result.record.status ===
        "VERIFIED"
    ) {
      break;
    }
    if (attempt < 2) {
      await new Promise<void>(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );
    }
  } catch (error) {
    lastError = error;
    if (attempt < 2) {
      await new Promise<void>(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );
    }
  }
}

const pass =
  result?.matched === true &&
  result.record.status === "VERIFIED" &&
  result.record.claim === "art. 5 KC" &&
  result.record.sourceUrl === SOURCE_URL &&
  result.record.sourceTier === "R1" &&
  result.record.verificationMethod === "web_fetch" &&
  Boolean(result.record.evidence);

process.stdout.write(
  JSON.stringify({
    gate: "G17_LIVE_OFFICIAL_SOURCE_PROBE",
    result: pass ? "PASS" : "BLOCKED",
    source: SOURCE_URL,
    attempts,
    matched: result?.matched ?? false,
    verificationStatus: result?.record.status ?? null,
    sourceTier: result?.record.sourceTier ?? null,
    evidencePresent: Boolean(result?.record.evidence),
    ...(result?.record.status === "UNVERIFIED"
      ? {
          verificationEvidence:
            result.record.evidence
        }
      : {}),
    providerCredentialsRequired: false,
    modelProviderCallExecuted: false,
    ...(lastError && !result
      ? {
          error:
            lastError instanceof LegalSourceVerificationError
              ? lastError.code
              : lastError instanceof Error
                ? lastError.name
                : "UNKNOWN_ERROR"
        }
      : {})
  }, null, 2) + "\n"
);

if (!pass) process.exitCode = 1;

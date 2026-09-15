import {
  SupremeCourtCaseVerifier
} from "./case-law-verifier.js";

const signature =
  "II CSK 101/20";

let result:
  | Awaited<
      ReturnType<
        SupremeCourtCaseVerifier["verify"]
      >
    >
  | null = null;

let lastReason: string | null = null;
let attempts = 0;

for (
  let attempt = 1;
  attempt <= 2;
  attempt += 1
) {
  attempts = attempt;

  const candidate =
    await new SupremeCourtCaseVerifier()
      .verify({
        claim:
          "sygn. II CSK 101/20",
        signature,
        toolCallId:
          "g22-live-sn"
      });

  result = candidate;

  if (
    candidate.status === "FOUND"
  ) {
    break;
  }

  lastReason =
    candidate.reason ??
    candidate.status;
}

const sourceHost =
  result?.record?.sourceUrl
    ? new URL(
        result.record.sourceUrl
      ).hostname
    : null;

const pass =
  result?.status === "FOUND" &&
  result.normalizedSignature ===
    signature &&
  result.record?.status ===
    "VERIFIED" &&
  result.record.kind === "case" &&
  result.record.sourceTier === "R1" &&
  result.record.caseScope ===
    "FULL_TEXT" &&
  result.judgment?.contentScope ===
    "FULL_TEXT" &&
  sourceHost === "sn.pl";

process.stdout.write(
  JSON.stringify({
    gate:
      "G22_LIVE_SN_CASE_LAW_PROBE",
    result:
      pass
        ? "PASS"
        : "BLOCKED",
    attempts,
    signature,
    verificationStatus:
      result?.status ?? null,
    normalizedSignature:
      result?.normalizedSignature ??
      null,
    sourceUrl:
      result?.record?.sourceUrl ??
      null,
    sourceTier:
      result?.record?.sourceTier ??
      null,
    caseScope:
      result?.record?.caseScope ??
      null,
    judgmentDate:
      result?.judgment?.date ??
      null,
    judgmentForm:
      result?.judgment?.form ??
      null,
    rejectedNearMatches:
      result?.rejectedNearMatches ??
      [],
    lastReason,
    modelProviderCallExecuted:
      false
  }, null, 2) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}

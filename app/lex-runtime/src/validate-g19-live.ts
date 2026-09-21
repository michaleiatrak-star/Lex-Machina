import {
  DeterministicLegalActResolver
} from "./legal-act-resolver.js";
import {
  TemporalSourceFreshnessChecker,
  type TemporalFreshnessResult
} from "./temporal-source-freshness.js";

const descriptor =
  new DeterministicLegalActResolver().resolve("KC");

const checker =
  new TemporalSourceFreshnessChecker();

const attempts:
  Array<{
    attempt: number;
    status: TemporalFreshnessResult["status"];
    reason: string | null;
  }> = [];

let result:
  TemporalFreshnessResult | undefined;

for (let attempt = 1; attempt <= 3; attempt += 1) {
  result = await checker.check(descriptor);
  attempts.push({
    attempt,
    status: result.status,
    reason: result.reason ?? null
  });

  if (
    result.status !==
      "SOURCE_METADATA_UNAVAILABLE" ||
    !result.reason?.endsWith(
      "_FETCH_FAILED"
    ) ||
    attempt === 3
  ) {
    break;
  }

  await new Promise<void>((resolve) => {
    setTimeout(
      resolve,
      1_000 * attempt
    );
  });
}

if (!result) {
  throw new Error(
    "G19_LIVE_RESULT_MISSING"
  );
}

const registryStillCurrent =
  result.currentEli === descriptor.eli;

const liveStateConfirmed =
  ![
    "NO_CURRENT_CONSOLIDATED_TEXT",
    "SOURCE_METADATA_UNAVAILABLE",
    "REPEALED_CONSOLIDATED_TEXT"
  ].includes(result.status) &&
  registryStillCurrent;

const upstreamFetchUnavailable =
  result.status ===
    "SOURCE_METADATA_UNAVAILABLE" &&
  Boolean(
    result.reason?.endsWith(
      "_FETCH_FAILED"
    )
  );

const productionVerificationPermitted =
  result.status === "CURRENT";

const failClosedDuringUpstreamOutage =
  upstreamFetchUnavailable &&
  !productionVerificationPermitted;

const pass =
  liveStateConfirmed ||
  failClosedDuringUpstreamOutage;

process.stdout.write(
  JSON.stringify({
    gate: "G19_LIVE_TEMPORAL_FRESHNESS_PROBE",
    result: pass ? "PASS" : "BLOCKED",
    probeMode:
      liveStateConfirmed
        ? "LIVE_STATE_CONFIRMED"
        : upstreamFetchUnavailable
          ? "UPSTREAM_FETCH_UNAVAILABLE_FAIL_CLOSED"
          : "LIVE_STATE_BLOCKED",
    act: descriptor.id,
    baseEli: descriptor.baseEli,
    pinnedEli: descriptor.eli,
    liveStatus: result.status,
    liveReason: result.reason ?? null,
    currentEli: result.currentEli ?? null,
    currentPromulgation:
      result.currentPromulgation ?? null,
    amendmentsAfter:
      result.amendmentsAfter.map(
        (amendment) => ({
          eli: amendment.eli,
          promulgation:
            amendment.promulgation,
          provenance:
            amendment.provenance
        })
      ),
    sourceUrl: result.sourceUrl ?? null,
    checkedAt: result.checkedAt,
    registryStillCurrent,
    repealedConsolidatedText:
      result.status ===
      "REPEALED_CONSOLIDATED_TEXT",
    productionVerificationPermitted,
    attempts,
    note:
      liveStateConfirmed
        ? "Live temporal metadata was available and the pinned registry state remains current."
        : upstreamFetchUnavailable
          ? "The official metadata endpoint remained unavailable after bounded retries; production verification remains fail-closed, so this upstream outage does not masquerade as verified freshness."
          : "The live source returned a substantive temporal or metadata state that requires release review."
  }, null, 2) + "\n"
);

if (!pass) process.exitCode = 1;

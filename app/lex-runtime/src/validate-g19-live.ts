import {
  DeterministicLegalActResolver
} from "./legal-act-resolver.js";
import {
  TemporalSourceFreshnessChecker
} from "./temporal-source-freshness.js";

const descriptor =
  new DeterministicLegalActResolver().resolve("KC");
const result =
  await new TemporalSourceFreshnessChecker().check(
    descriptor
  );

const parsedSafely = ![
  "NO_CURRENT_CONSOLIDATED_TEXT",
  "SOURCE_METADATA_UNAVAILABLE"
].includes(result.status);

const registryStillCurrent =
  result.currentEli === descriptor.eli;

const pass =
  parsedSafely &&
  registryStillCurrent;

process.stdout.write(
  JSON.stringify({
    gate: "G19_LIVE_TEMPORAL_FRESHNESS_PROBE",
    result: pass ? "PASS" : "BLOCKED",
    act: descriptor.id,
    baseEli: descriptor.baseEli,
    pinnedEli: descriptor.eli,
    liveStatus: result.status,
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
    productionVerificationPermitted:
      result.status === "CURRENT",
    note:
      result.status === "CURRENT"
        ? "Current HTML source can proceed to the verifier."
        : "The live probe succeeded, but production verification remains fail-closed for this temporal state."
  }, null, 2) + "\n"
);

if (!pass) process.exitCode = 1;

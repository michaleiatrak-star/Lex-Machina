import {
  CaseLawSearchService
} from "./case-law-search.js";

const service =
  new CaseLawSearchService();

const saos =
  await service.search({
    source: "SAOS",
    query:
      "bezpodstawne wzbogacenie",
    limit: 1
  });

const cbosa =
  await service.search({
    source: "CBOSA",
    query:
      "bezczynność",
    limit: 1
  });

const checks = {
  saosLiveFound:
    saos.status ===
      "FOUND" &&
    saos.candidates.length >
      0 &&
    saos.candidates.every(
      (candidate) =>
        candidate.source ===
          "SAOS" &&
        new URL(
          candidate.sourceUrl
        ).hostname ===
          "www.saos.org.pl"
    ),
  cbosaLiveFound:
    cbosa.status ===
      "FOUND" &&
    cbosa.candidates.length >
      0 &&
    cbosa.candidates.every(
      (candidate) =>
        candidate.source ===
          "CBOSA" &&
        new URL(
          candidate.sourceUrl
        ).hostname ===
          "orzeczenia.nsa.gov.pl"
    ),
  discoveryOnly:
    [
      ...saos.candidates,
      ...cbosa.candidates
    ].every(
      (candidate) =>
        candidate.contentScope ===
        "DISCOVERY"
    )
};

const saosExternalTransportBlock =
  saos.status ===
    "OUT_OF_SCOPE" &&
  [
    "SAOS_TRANSPORT_FAILED",
    "SAOS_NON_JSON_RESPONSE"
  ].includes(
    saos.reason ?? ""
  );

const cbosaExternalTransportBlock =
  cbosa.status === "OUT_OF_SCOPE" &&
  [
    "CBOSA_TRANSPORT_FAILED",
    "CBOSA_PAGINATION_TRANSPORT_FAILED",
    "CBOSA_DOCUMENT_TRANSPORT_FAILED"
  ].includes(cbosa.reason ?? "");

const pass =
  Object.values(checks).every(Boolean);

const externalBlocked =
  checks.discoveryOnly &&
  (
    (
      checks.saosLiveFound ||
      saosExternalTransportBlock
    ) &&
    (
      checks.cbosaLiveFound ||
      cbosaExternalTransportBlock
    )
  ) &&
  (
    saosExternalTransportBlock ||
    cbosaExternalTransportBlock
  );

const result =
  pass
    ? "PASS"
    : externalBlocked
      ? "EXTERNAL_BLOCKED"
      : "BLOCKED";

console.log(
  JSON.stringify(
    {
      gate:
        "G30A_LIVE_CASE_LAW_DISCOVERY",
      result,
      releaseBlocking:
        result === "BLOCKED",
      checks,
      saos: {
        status:
          saos.status,
        total:
          saos.total ?? null,
        reason:
          saos.reason ?? null,
        candidates:
          saos.candidates.length
      },
      cbosa: {
        status:
          cbosa.status,
        total:
          cbosa.total ?? null,
        reason:
          cbosa.reason ?? null,
        candidates:
          cbosa.candidates.length
      }
    },
    null,
    2
  )
);

if (result === "BLOCKED") {
  process.exitCode = 1;
}

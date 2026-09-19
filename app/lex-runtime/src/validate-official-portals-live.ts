type PortalState =
  | "PASS"
  | "PASS_AUTH_REQUIRED"
  | "EXPECTED_WEB_ONLY"
  | "EXTERNAL_BLOCKED"
  | "DEGRADED";

type PortalKind =
  | "HTML"
  | "API";

type PortalProbe = {
  id: string;
  kind: PortalKind;
  sourceClass:
    | "R1"
    | "R2A"
    | "OFFICIAL_REGISTER"
    | "LEGISLATIVE";
  url: string;
  allowedHosts?: string[];
  expectedBody?: RegExp;
  minBytes?: number;
  acceptableStatuses?: number[];
  expectedRestrictedStatuses?: number[];
  critical?: boolean;
  note?: string;
};

type PortalResult = {
  id: string;
  kind: PortalKind;
  sourceClass: PortalProbe["sourceClass"];
  url: string;
  state: PortalState;
  attempts: number;
  status?: number;
  finalUrl?: string;
  contentType?: string;
  bytes?: number;
  note?: string;
};

const USER_AGENT =
  "curl/8.5.0";
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 8;
const MAX_BODY_BYTES =
  1_500_000;

function hostAllowed(
  hostname: string,
  probe: PortalProbe
): boolean {
  const original =
    new URL(probe.url)
      .hostname
      .toLowerCase();

  const allowed =
    new Set([
      original,
      ...(
        probe.allowedHosts ??
        []
      ).map(
        (item) =>
          item.toLowerCase()
      )
    ]);

  return allowed.has(
    hostname.toLowerCase()
  );
}

async function fetchSafe(
  probe: PortalProbe
): Promise<Response> {
  let current =
    probe.url;

  for (
    let redirect = 0;
    redirect <= MAX_REDIRECTS;
    redirect += 1
  ) {
    const response =
      await fetch(
        current,
        {
          method: "GET",
          redirect: "manual",
          signal:
            AbortSignal.timeout(
              TIMEOUT_MS
            ),
          headers: {
            "User-Agent":
              USER_AGENT,
            Accept:
              probe.kind === "API"
                ? "application/json,text/plain,*/*;q=0.1"
                : "text/html,application/xhtml+xml,*/*;q=0.1",
            "Accept-Language":
              "pl,en;q=0.5"
          }
        }
      );

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location =
        response.headers.get(
          "location"
        );

      if (!location) {
        throw new Error(
          "PORTAL_REDIRECT_WITHOUT_LOCATION"
        );
      }

      const next =
        new URL(
          location,
          current
        );

      if (
        next.protocol !==
          "https:" ||
        !hostAllowed(
          next.hostname,
          probe
        )
      ) {
        throw new Error(
          "PORTAL_REDIRECT_DENIED:" +
          next.hostname
        );
      }

      current =
        next.toString();
      continue;
    }

    return response;
  }

  throw new Error(
    "PORTAL_REDIRECT_LIMIT_EXCEEDED"
  );
}

async function runProbe(
  probe: PortalProbe
): Promise<PortalResult> {
  let lastError:
    unknown = null;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt += 1
  ) {
    try {
      const response =
        await fetchSafe(
          probe
        );

      const bytes =
        new Uint8Array(
          await response
            .arrayBuffer()
        );

      const text =
        new TextDecoder(
          "utf-8",
          { fatal: false }
        ).decode(
          bytes.slice(
            0,
            MAX_BODY_BYTES
          )
        );

      const acceptable =
        probe.acceptableStatuses ??
        [200];

      const restricted =
        probe.expectedRestrictedStatuses ??
        [];

      const state:
        PortalState =
        restricted.includes(
          response.status
        )
          ? (
              response.status === 401
                ? "PASS_AUTH_REQUIRED"
                : "EXPECTED_WEB_ONLY"
            )
          : acceptable.includes(
                response.status
              ) &&
              bytes.length >=
                (
                  probe.minBytes ??
                  1
                ) &&
              (
                !probe.expectedBody ||
                probe.expectedBody
                  .test(text)
              )
            ? "PASS"
            : response.status >= 500
              ? "EXTERNAL_BLOCKED"
              : "DEGRADED";

      return {
        id:
          probe.id,
        kind:
          probe.kind,
        sourceClass:
          probe.sourceClass,
        url:
          probe.url,
        state,
        attempts:
          attempt,
        status:
          response.status,
        finalUrl:
          response.url ||
          probe.url,
        contentType:
          response.headers.get(
            "content-type"
          ) ?? "",
        bytes:
          bytes.length,
        ...(probe.note
          ? {
              note:
                probe.note
            }
          : {})
      };
    } catch (error) {
      lastError =
        error;

      if (
        attempt <
        MAX_ATTEMPTS
      ) {
        await new Promise<void>(
          (resolve) =>
            setTimeout(
              resolve,
              attempt * 750
            )
        );
      }
    }
  }

  return {
    id:
      probe.id,
    kind:
      probe.kind,
    sourceClass:
      probe.sourceClass,
    url:
      probe.url,
    state:
      "EXTERNAL_BLOCKED",
    attempts:
      MAX_ATTEMPTS,
    note:
      lastError instanceof Error
        ? lastError.message
        : "UNKNOWN_TRANSPORT_ERROR"
  };
}

const today =
  new Date()
    .toISOString()
    .slice(0, 10);

const probes:
  PortalProbe[] = [
  {
    id:
      "MS_CASE_LAW_HTML",
    kind:
      "HTML",
    sourceClass:
      "R2A",
    url:
      "https://orzeczenia.ms.gov.pl/search/advanced",
    expectedBody:
      /orzecze|sygnatur|wyszuk/iu,
    minBytes:
      500,
    critical:
      true,
    note:
      "Official common-court case-law portal; neutral UA is intentional."
  },
  {
    id:
      "TK_IPO_HTML",
    kind:
      "HTML",
    sourceClass:
      "R2A",
    url:
      "https://ipo.trybunal.gov.pl/",
    expectedBody:
      /Trybunał|orzecze|IPO/iu,
    minBytes:
      200,
    allowedHosts: [
      "trybunal.gov.pl",
      "www.trybunal.gov.pl"
    ],
    critical:
      true
  },
  {
    id:
      "UKE_BIP_HTML",
    kind:
      "HTML",
    sourceClass:
      "R2A",
    url:
      "https://bip.uke.gov.pl/",
    expectedBody:
      /UKE|Komunikacji Elektronicznej|Biuletyn/iu,
    minBytes:
      200,
    allowedHosts: [
      "uke.gov.pl",
      "www.uke.gov.pl"
    ]
  },
  {
    id:
      "UOKIK_DECISIONS_HTML",
    kind:
      "HTML",
    sourceClass:
      "R2A",
    url:
      "https://decyzje.uokik.gov.pl/bp/dec_prez.nsf",
    expectedBody:
      /decyz|Prezes|UOKiK/iu,
    minBytes:
      200,
    allowedHosts: [
      "uokik.gov.pl",
      "www.uokik.gov.pl"
    ],
    critical:
      true
  },
  {
    id:
      "KRZ_HTML",
    kind:
      "HTML",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://krz.ms.gov.pl/",
    expectedBody:
      /Krajowy Rejestr Zadłużonych|KRZ/iu,
    minBytes:
      100,
    expectedRestrictedStatuses: [
      401,
      403
    ],
    note:
      "A WAF response is recorded explicitly; registry use may require interactive access."
  },
  {
    id:
      "EKW_HTML",
    kind:
      "HTML",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://ekw.ms.gov.pl/eukw_ogol/menu.do",
    expectedBody:
      /księg|wieczyst|EKW/iu,
    minBytes:
      200,
    expectedRestrictedStatuses: [
      403
    ],
    critical:
      true
  },
  {
    id:
      "SUDOP_HTML",
    kind:
      "HTML",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://sudop.uokik.gov.pl/",
    expectedBody:
      /SUDOP|pomoc publiczn|de minimis/iu,
    minBytes:
      200,
    allowedHosts: [
      "www.sudop.uokik.gov.pl"
    ],
    critical:
      true
  },
  {
    id:
      "EZAMOWIENIA_HTML",
    kind:
      "HTML",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://ezamowienia.gov.pl/",
    expectedBody:
      /e.?Zamówienia|zamówień publicznych/iu,
    minBytes:
      200,
    allowedHosts: [
      "www.ezamowienia.gov.pl"
    ],
    critical:
      true
  },
  {
    id:
      "BZP_HTML",
    kind:
      "HTML",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://bzp.uzp.gov.pl/Default.aspx",
    expectedBody:
      /Biuletyn Zamówień Publicznych|BZP|zamówień/iu,
    minBytes:
      200,
    allowedHosts: [
      "www.bzp.uzp.gov.pl"
    ],
    critical:
      true,
    note:
      "The portal is historically intermittent; this gate retries three times."
  },
  {
    id:
      "RCL_LEGISLATION_HTML",
    kind:
      "HTML",
    sourceClass:
      "LEGISLATIVE",
    url:
      "https://legislacja.rcl.gov.pl/",
    expectedBody:
      /Rządowe Centrum Legislacji|legislac|projekt/iu,
    minBytes:
      200,
    allowedHosts: [
      "www.legislacja.rcl.gov.pl"
    ],
    note:
      "Legislative material only; source availability is reported but does not replace promulgated law."
  },
  {
    id:
      "VAT_WHITE_LIST_API",
    kind:
      "API",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://wl-api.mf.gov.pl/api/search/nip/5260250995?date=" +
      today,
    expectedBody:
      /"subject"|"statusVat"|"requestId"/u,
    minBytes:
      100,
    critical:
      true
  }
];

const results =
  await Promise.all(
    probes.map(
      runProbe
    )
  );

const requiredIds =
  new Set(
    probes.map(
      (probe) =>
        probe.id
    )
  );

const coverageComplete =
  results.length ===
    requiredIds.size &&
  results.every(
    (result) =>
      requiredIds.has(
        result.id
      )
  );

const criticalFailures =
  results.filter(
    (result) => {
      const spec =
        probes.find(
          (item) =>
            item.id ===
            result.id
        );

      return Boolean(
        spec?.critical
      ) &&
        result.state !==
          "PASS" &&
        result.state !==
          "PASS_AUTH_REQUIRED" &&
        result.state !==
          "EXPECTED_WEB_ONLY";
    }
  );

const warnings =
  results.filter(
    (result) =>
      result.state !==
        "PASS" &&
      result.state !==
        "PASS_AUTH_REQUIRED"
  );

const releaseBlocking =
  !coverageComplete ||
  criticalFailures.length >
    0;

const result =
  releaseBlocking
    ? "BLOCKED"
    : warnings.length > 0
      ? "PASS_WITH_WARNINGS"
      : "PASS";

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "OFFICIAL_PORTALS_HTML_API_MATRIX",
      result,
      releaseBlocking,
      coverageComplete,
      criticalFailures:
        criticalFailures.map(
          (item) =>
            item.id
        ),
      notes: {
        existingDedicatedGates:
          "ELI/ISAP/EUR-Lex/R1, SAOS/CBOSA, SN, UODO/KRS/CEIDG/REGON/EUREKA APIs and KIO/UZP are tested by dedicated jobs.",
        classification:
          "Official case-law and registry portals are R2A/OFFICIAL_REGISTER; they are not promoted to R1 statute-text sources."
      },
      results
    },
    null,
    2
  ) + "\n"
);

if (releaseBlocking) {
  process.exitCode =
    1;
}

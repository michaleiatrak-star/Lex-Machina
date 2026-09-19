type ApiState =
  | "PASS"
  | "PASS_AUTH_REQUIRED"
  | "DEGRADED"
  | "EXTERNAL_BLOCKED";

type ApiProbe = {
  id: string;
  sourceClass:
    | "R1"
    | "R2A"
    | "OFFICIAL_REGISTER";
  url: string;
  accept?: string;
  expectedStatus?:
    number | number[];
  expectedBody?: RegExp;
  minBytes?: number;
  allowRedirectHosts?: string[];
  note?: string;
};

type ApiProbeResult = {
  id: string;
  sourceClass:
    ApiProbe["sourceClass"];
  url: string;
  state: ApiState;
  attempts: number;
  status?: number;
  contentType?: string;
  bytes?: number;
  finalUrl?: string;
  note?: string;
};

const USER_AGENT = "curl/8.5.0";
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 5;
const MAX_BODY_BYTES = 1_500_000;

function hostAllowed(
  host: string,
  probe: ApiProbe
): boolean {
  const original =
    new URL(probe.url)
      .hostname
      .toLowerCase();
  return host === original ||
    (probe.allowRedirectHosts ?? [])
      .map((value) =>
        value.toLowerCase()
      )
      .includes(host);
}

async function fetchSafe(
  probe: ApiProbe
): Promise<Response> {
  let current = probe.url;

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
              REQUEST_TIMEOUT_MS
            ),
          headers: {
            "User-Agent":
              USER_AGENT,
            Accept:
              probe.accept ??
              "application/json,text/plain,*/*;q=0.1"
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
          "API_REDIRECT_WITHOUT_LOCATION"
        );
      }

      const next =
        new URL(
          location,
          current
        );

      if (
        next.protocol !== "https:" ||
        !hostAllowed(
          next.hostname
            .toLowerCase(),
          probe
        )
      ) {
        throw new Error(
          "API_REDIRECT_HOST_DENIED:" +
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
    "API_REDIRECT_LIMIT_EXCEEDED"
  );
}

function expectedStatus(
  probe: ApiProbe,
  status: number
): boolean {
  const expected =
    probe.expectedStatus ?? 200;

  return Array.isArray(expected)
    ? expected.includes(status)
    : expected === status;
}

function authRequired(
  probe: ApiProbe,
  status: number
): boolean {
  return (
    probe.id ===
      "CEIDG_V3_AUTH_BOUNDARY" &&
    (status === 401 ||
      status === 403)
  );
}

async function runProbe(
  probe: ApiProbe
): Promise<ApiProbeResult> {
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
      const limited =
        bytes.slice(
          0,
          MAX_BODY_BYTES
        );
      const body =
        new TextDecoder(
          "utf-8",
          { fatal: false }
        ).decode(limited);
      const statusOk =
        expectedStatus(
          probe,
          response.status
        );
      const bodyOk =
        !probe.expectedBody ||
        probe.expectedBody
          .test(body);
      const sizeOk =
        bytes.length >=
        (probe.minBytes ?? 0);

      const state:
        ApiState =
        authRequired(
          probe,
          response.status
        )
          ? "PASS_AUTH_REQUIRED"
          : statusOk &&
              bodyOk &&
              sizeOk
            ? "PASS"
            : response.status >= 500
              ? "EXTERNAL_BLOCKED"
              : "DEGRADED";

      return {
        id: probe.id,
        sourceClass:
          probe.sourceClass,
        url: probe.url,
        state,
        attempts: attempt,
        status:
          response.status,
        contentType:
          response.headers.get(
            "content-type"
          ) ?? "",
        bytes:
          bytes.length,
        finalUrl:
          response.url ||
          probe.url,
        ...(probe.note
          ? { note:
              probe.note }
          : {})
      };
    } catch (error) {
      lastError = error;

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
    id: probe.id,
    sourceClass:
      probe.sourceClass,
    url: probe.url,
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

const probes: ApiProbe[] = [
  {
    id:
      "ELI_DU_METADATA_API",
    sourceClass: "R1",
    url:
      "https://api.sejm.gov.pl/eli/acts/DU/2026/795",
    expectedBody:
      /Kodeks cywilny/iu,
    minBytes: 100
  },
  {
    id:
      "ELI_MP_METADATA_API",
    sourceClass: "R1",
    url:
      "https://api.sejm.gov.pl/eli/acts/MP/2026/642",
    expectedBody:
      /2026|642|obwieszczen/iu,
    minBytes: 100
  },
  {
    id:
      "SEJM_LEGISLATIVE_API",
    sourceClass: "R2A",
    url:
      "https://api.sejm.gov.pl/sejm/term10/interpellations?limit=1",
    expectedBody:
      /\[|term|num|title/iu,
    minBytes: 20,
    note:
      "Legislative material only; never used as binding statute text."
  },
  {
    id:
      "SAOS_SEARCH_API",
    sourceClass: "R2A",
    url:
      "https://www.saos.org.pl/api/search/judgments?all=bezpodstawne%20wzbogacenie&pageSize=10&pageNumber=0&sortingField=JUDGMENT_DATE&sortingDirection=DESC",
    expectedBody:
      /"items"|"info"/u,
    minBytes: 50,
    note:
      "Discovery/cross-check only; not the deciding source for NSA/WSA or SN."
  },
  {
    id:
      "UODO_OPENAPI",
    sourceClass: "R2A",
    url:
      "https://orzeczenia.uodo.gov.pl/api-doc/schemas/openapi.yml",
    accept:
      "application/yaml,text/yaml,text/plain,*/*;q=0.1",
    expectedBody:
      /openapi:/iu,
    minBytes: 200
  },
  {
    id:
      "UODO_DECISIONS_API",
    sourceClass: "R2A",
    url:
      "https://orzeczenia.uodo.gov.pl/api/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo?order=-id&fields=id,refid,refname",
    expectedBody:
      /"refname"|"refid"|\[/iu,
    minBytes: 2
  },
  {
    id:
      "EUREKA_DOCUMENT_API",
    sourceClass: "R2A",
    url:
      "https://eureka.mf.gov.pl/api/public/v1/informacje/100000",
    expectedBody:
      /"dokument"|interpretac|informac/iu,
    minBytes: 20,
    note:
      "Read-by-ID channel only; search POST schema remains undocumented."
  },
  {
    id:
      "EUREKA_SEARCH_METADATA_API",
    sourceClass: "R2A",
    url:
      "https://eureka.mf.gov.pl/api/public/v1/parametry-wyszukiwarki",
    expectedBody:
      /\{|\[|parametr|rodzaj/iu,
    minBytes: 20,
    note:
      "Metadata endpoint does not prove full-text search POST compatibility."
  },
  {
    id:
      "KRS_CURRENT_EXTRACT_API",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0000028860?rejestr=P&format=json",
    expectedBody:
      /"odpis"/iu,
    minBytes: 100
  },
  {
    id:
      "CEIDG_V3_AUTH_BOUNDARY",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://dane.biznes.gov.pl/api/ceidg/v3/firmy?nip=1234567890",
    expectedStatus:
      [401, 403],
    minBytes: 0,
    note:
      "401/403 without Bearer JWT is treated as a healthy authenticated API boundary."
  },
  {
    id:
      "GUS_REGON_API_PORTAL",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://api.stat.gov.pl/Home/RegonApi",
    accept:
      "text/html,*/*;q=0.1",
    expectedBody:
      /REGON|BIR|API/iu,
    minBytes: 100,
    note:
      "Actual BIR data calls require a key and session login."
  },
  {
    id:
      "NBP_EXCHANGE_RATE_API",
    sourceClass:
      "OFFICIAL_REGISTER",
    url:
      "https://api.nbp.pl/api/exchangerates/rates/a/eur?format=json",
    expectedBody:
      /"currency"|"code"|"rates"/iu,
    minBytes: 50
  }
];

const results =
  await Promise.all(
    probes.map(runProbe)
  );

const blockingIds =
  new Set([
    "ELI_DU_METADATA_API",
    "ELI_MP_METADATA_API"
  ]);

const releaseBlocking =
  results.some(
    (result) =>
      blockingIds.has(
        result.id
      ) &&
      result.state !==
        "PASS"
  );

const degraded =
  results.some(
    (result) =>
      result.state ===
        "DEGRADED" ||
      result.state ===
        "EXTERNAL_BLOCKED"
  );

const result =
  releaseBlocking
    ? "BLOCKED"
    : degraded
      ? "PASS_WITH_WARNINGS"
      : "PASS";

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "OFFICIAL_API_LIVE_CONNECTIVITY",
      result,
      releaseBlocking,
      capabilityNotes: {
        cbosa:
          "NO_PUBLIC_REST_JSON_API; deterministic HTML adapter is tested by G30A live",
        sn:
          "NO_DOCUMENTED_PUBLIC_REST_API; snproxy transport is tested by G22 live",
        kio:
          "NO_PUBLIC_REST_API; HTML/PDF channel only",
        tk:
          "NO_DOCUMENTED_PUBLIC_REST_API; official HTML portals are the channel",
        ceidg:
          "BEARER_JWT_REQUIRED; unauthenticated 401/403 confirms the API boundary"
      },
      results
    },
    null,
    2
  ) + "\n"
);

if (releaseBlocking) {
  process.exitCode = 1;
}

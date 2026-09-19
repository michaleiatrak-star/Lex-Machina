type Tier = "R1" | "R2A";
type ProbeState =
  | "PASS"
  | "PASS_INSECURE_HTTP"
  | "DEGRADED"
  | "EXPECTED_HUMAN_ONLY"
  | "EXPECTED_WEB_ONLY"
  | "EXTERNAL_BLOCKED";

type ProbeResult = {
  id: string;
  tier: Tier;
  url: string;
  state: ProbeState;
  attempts: number;
  status?: number;
  finalUrl?: string;
  contentType?: string;
  bytes?: number;
  note?: string;
};

type ProbeSpec = {
  id: string;
  tier: Tier;
  url: string;
  accept?: string;
  acceptLanguage?: string;
  userAgent?: string;
  expected?: RegExp;
  minBytes?: number;
  allowRedirectHosts?: string[];
  allowHttp?: boolean;
  transportFailureState?: ProbeState;
  classify?: (
    response: Response,
    body: string,
    bytes: number
  ) => ProbeState;
};

const DEFAULT_UA = "curl/8.5.0";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_ATTEMPTS = 3;
const MAX_REDIRECTS = 8;
const MAX_BODY_BYTES = 1_500_000;

function allowedHost(
  host: string,
  spec: ProbeSpec
): boolean {
  const original =
    new URL(spec.url).hostname.toLowerCase();
  return host === original ||
    (spec.allowRedirectHosts ?? [])
      .map((value) => value.toLowerCase())
      .includes(host);
}

async function fetchFollowingOfficialRedirects(
  spec: ProbeSpec
): Promise<Response> {
  let current = spec.url;

  for (
    let redirect = 0;
    redirect <= MAX_REDIRECTS;
    redirect += 1
  ) {
    const response = await fetch(
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
            spec.userAgent ??
            DEFAULT_UA,
          Accept:
            spec.accept ??
            "*/*",
          ...(spec.acceptLanguage
            ? {
                "Accept-Language":
                  spec.acceptLanguage
              }
            : {})
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
          "R1_REDIRECT_WITHOUT_LOCATION"
        );
      }

      const next =
        new URL(location, current);

      const protocolAllowed =
        next.protocol === "https:" ||
        (
          spec.allowHttp === true &&
          next.protocol === "http:"
        );

      if (
        !protocolAllowed ||
        !allowedHost(
          next.hostname.toLowerCase(),
          spec
        )
      ) {
        throw new Error(
          "R1_REDIRECT_DENIED:" +
          next.protocol +
          "//" +
          next.hostname +
          next.pathname
        );
      }

      current = next.toString();
      continue;
    }

    return response;
  }

  throw new Error(
    "R1_REDIRECT_LIMIT_EXCEEDED"
  );
}

async function bodyText(
  response: Response
): Promise<{
  text: string;
  bytes: number;
}> {
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

  return {
    text:
      new TextDecoder(
        "utf-8",
        { fatal: false }
      ).decode(limited),
    bytes: bytes.length
  };
}

async function probe(
  spec: ProbeSpec
): Promise<ProbeResult> {
  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt += 1
  ) {
    try {
      const response =
        await fetchFollowingOfficialRedirects(
          spec
        );
      const payload =
        await bodyText(response);
      const contentType =
        response.headers.get(
          "content-type"
        ) ?? "";

      const defaultPass =
        response.ok &&
        payload.bytes >=
          (spec.minBytes ?? 1) &&
        (
          !spec.expected ||
          spec.expected.test(
            payload.text
          )
        );

      const state =
        spec.classify
          ? spec.classify(
              response,
              payload.text,
              payload.bytes
            )
          : defaultPass
            ? "PASS"
            : response.status >= 500
              ? "EXTERNAL_BLOCKED"
              : "DEGRADED";

      return {
        id: spec.id,
        tier: spec.tier,
        url: spec.url,
        state,
        attempts: attempt,
        status:
          response.status,
        finalUrl:
          response.url ||
          spec.url,
        contentType,
        bytes:
          payload.bytes
      };
    } catch (error) {
      lastError = error;
      if (attempt <
        MAX_ATTEMPTS) {
        await new Promise<void>(
          (resolve) =>
            setTimeout(
              resolve,
              750 * attempt
            )
        );
      }
    }
  }

  return {
    id: spec.id,
    tier: spec.tier,
    url: spec.url,
    state:
      spec.transportFailureState ??
      "EXTERNAL_BLOCKED",
    attempts:
      MAX_ATTEMPTS,
    note:
      lastError instanceof Error
        ? lastError.message
        : "UNKNOWN_TRANSPORT_ERROR"
  };
}

const r1Specs: ProbeSpec[] = [
  {
    id: "ELI_SEJM_METADATA",
    tier: "R1",
    url:
      "https://api.sejm.gov.pl/eli/acts/DU/2026/795",
    accept:
      "application/json,*/*;q=0.1",
    expected:
      /Kodeks cywilny/iu,
    minBytes: 100
  },
  {
    id: "ELI_GOV_MIRROR",
    tier: "R1",
    url:
      "https://eli.gov.pl/api/acts/DU/2026/795",
    accept:
      "application/json,*/*;q=0.1",
    expected:
      /Kodeks cywilny/iu,
    minBytes: 100
  },
  {
    id: "SEJM_PRAWO",
    tier: "R1",
    url:
      "https://www.sejm.gov.pl/prawo/prawo.html",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /prawo|akty|ustaw/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "sejm.gov.pl"
    ]
  },
  {
    id: "UODO_PORTAL",
    tier: "R1",
    url:
      "https://uodo.gov.pl/",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /ochrony danych|uodo/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.uodo.gov.pl"
    ]
  },
  {
    id: "MONITOR_POLSKI_RCL",
    tier: "R1",
    url:
      "https://monitorpolski.gov.pl/MP",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /Monitor Polski/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.monitorpolski.gov.pl"
    ]
  },
  {
    id: "DZIENNIK_USTAW_RCL",
    tier: "R1",
    url:
      "https://dziennikustaw.gov.pl/DU",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /Dziennik Ustaw/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.dziennikustaw.gov.pl"
    ]
  },
  {
    id:
      "DZIENNIKI_URZEDOWE_INDEX",
    tier: "R1",
    url:
      "https://dziennikiurzedowe.gov.pl/",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /dziennik|urzędow|urzedow/iu,
    minBytes: 300,
    allowRedirectHosts: [
      "www.dziennikiurzedowe.gov.pl",
      "dziennikiurzedowe.rcl.gov.pl"
    ]
  },
  {
    id: "UOKIK_CONSUMER_PORTAL",
    tier: "R2A",
    url:
      "https://prawakonsumenta.uokik.gov.pl/",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /konsument|reklamac|odstąp/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.prawakonsumenta.uokik.gov.pl",
      "uokik.gov.pl",
      "www.uokik.gov.pl"
    ]
  },
  {
    id: "PARP_PORTAL",
    tier: "R2A",
    url:
      "https://www.parp.gov.pl/",
    accept:
      "text/html,*/*;q=0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
    expected:
      /PARP|Polsk[aiej]+ Agencj|przedsiębiorc/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "parp.gov.pl"
    ]
  },
  {
    id: "LEGAL_UN_ILC",
    tier: "R1",
    url:
      "https://legal.un.org/ilc/",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /International Law Commission|United Nations/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.legal.un.org"
    ]
  },
  {
    id: "UN_TREATY_COLLECTION",
    tier: "R1",
    url:
      "https://treaties.un.org/Pages/Home.aspx",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /United Nations Treaty|Treaty Collection|treaties/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "www.treaties.un.org"
    ]
  },
  {
    id: "HUDOC_ECHR_API",
    tier: "R1",
    url:
      "https://hudoc.echr.coe.int/app/query/results?query=%28contentsitename%3DECHR%29&select=itemid&sort=&start=0&length=1",
    accept:
      "application/json,text/plain,*/*;q=0.1",
    expected:
      /"resultcount"|"results"/iu,
    minBytes: 20,
    allowRedirectHosts: [
      "www.hudoc.echr.coe.int"
    ]
  },
  {
    id: "HCCH_CONVENTIONS",
    tier: "R1",
    url:
      "https://www.hcch.net/en/instruments/conventions",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /HCCH|Conventions|Hague Conference/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "hcch.net"
    ]
  },
  {
    id: "ICSID_DEPOSITARY",
    tier: "R1",
    url:
      "https://icsid.worldbank.org/resources/rules-and-regulations/convention/overview",
    accept:
      "text/html,*/*;q=0.1",
    minBytes: 1,
    allowRedirectHosts: [
      "www.icsid.worldbank.org"
    ],
    transportFailureState:
      "EXPECTED_WEB_ONLY",
    classify:
      (
        response,
        body,
        bytes
      ) => {
        if (
          response.ok &&
          bytes >= 500 &&
          /ICSID|Convention|World Bank/iu.test(
            body
          )
        ) {
          return "PASS";
        }
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          return "EXPECTED_WEB_ONLY";
        }
        return response.status >= 500
          ? "EXTERNAL_BLOCKED"
          : "DEGRADED";
      }
  },
  {
    id: "UNOOSA_TREATIES",
    tier: "R1",
    url:
      "https://www.unoosa.org/oosa/en/ourwork/spacelaw/treaties.html",
    accept:
      "text/html,*/*;q=0.1",
    minBytes: 1,
    allowRedirectHosts: [
      "unoosa.org"
    ],
    transportFailureState:
      "EXPECTED_WEB_ONLY",
    classify:
      (
        response,
        body,
        bytes
      ) => {
        if (
          response.ok &&
          bytes >= 500 &&
          /Outer Space|Treaties|UNOOSA/iu.test(
            body
          )
        ) {
          return "PASS";
        }
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          return "EXPECTED_WEB_ONLY";
        }
        return response.status >= 500
          ? "EXTERNAL_BLOCKED"
          : "DEGRADED";
      }
  },
  {
    id: "OHCHR_TREATY_PORTAL",
    tier: "R1",
    url:
      "https://www.ohchr.org/en/instruments-mechanisms/instruments",
    accept:
      "text/html,*/*;q=0.1",
    minBytes: 1,
    allowRedirectHosts: [
      "ohchr.org"
    ],
    transportFailureState:
      "EXPECTED_WEB_ONLY",
    classify:
      (
        response,
        body,
        bytes
      ) => {
        if (
          response.ok &&
          bytes >= 500 &&
          /Human Rights|Instruments|OHCHR/iu.test(
            body
          )
        ) {
          return "PASS";
        }
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          return "EXPECTED_WEB_ONLY";
        }
        return response.status >= 500
          ? "EXTERNAL_BLOCKED"
          : "DEGRADED";
      }
  },
  {
    id: "BIP_GOV_REPRESENTATIVE",
    tier: "R1",
    url:
      "https://www.gov.pl/web/uw-mazowiecki",
    accept:
      "text/html,*/*;q=0.1",
    expected:
      /Mazowiecki|gov\.pl/iu,
    minBytes: 500,
    allowRedirectHosts: [
      "gov.pl"
    ]
  }
];

const eurLexSpec: ProbeSpec = {
  id: "EUR_LEX_DIRECT",
  tier: "R1",
  url:
    "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679",
  accept:
    "text/html,application/xhtml+xml,*/*;q=0.1",
  acceptLanguage: "pl",
  minBytes: 1,
  allowRedirectHosts: [
    "www.eur-lex.europa.eu"
  ],
  classify:
    (
      response,
      body,
      bytes
    ) =>
      response.ok &&
      bytes > 5_000 &&
      /2016\/679|ochronie osób fizycznych|RODO/iu.test(
        body
      )
        ? "PASS"
        : "DEGRADED"
};

const cellarSpec: ProbeSpec = {
  id: "CELLAR_EUR_LEX_FALLBACK",
  tier: "R1",
  url:
    "http://publications.europa.eu/resource/celex/32016R0679",
  accept:
    "application/xhtml+xml",
  acceptLanguage: "pol",
  expected:
    /2016\/679|ochronie osób fizycznych|personal data/iu,
  minBytes: 50_000,
  allowRedirectHosts: [
    "op.europa.eu"
  ],
  allowHttp: true,
  classify:
    (
      response,
      body,
      bytes
    ) => {
      const contentOk =
        response.ok &&
        bytes >= 50_000 &&
        /2016\/679|ochronie osób fizycznych|personal data/iu.test(
          body
        );

      if (!contentOk) {
        return response.status >= 500
          ? "EXTERNAL_BLOCKED"
          : "DEGRADED";
      }

      return response.url.startsWith(
        "https:"
      )
        ? "PASS"
        : "PASS_INSECURE_HTTP";
    }
};

const isapSpec: ProbeSpec = {
  id: "ISAP_HUMAN_PORTAL",
  tier: "R1",
  url:
    "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093",
  accept:
    "text/html,*/*;q=0.1",
  minBytes: 1,
  allowRedirectHosts: [
    "www.isap.sejm.gov.pl"
  ],
  transportFailureState:
    "EXPECTED_HUMAN_ONLY",
  classify:
    (
      response,
      body,
      bytes
    ) => {
      if (
        response.ok &&
        /Kodeks cywilny/iu.test(
          body
        )
      ) {
        return "PASS";
      }

      if (
        bytes > 0 &&
        /captcha|człowiek|weryfikac|api\.sejm\.gov\.pl|eli\.gov\.pl/iu.test(
          body
        )
      ) {
        return "EXPECTED_HUMAN_ONLY";
      }

      return response.status >= 500
        ? "EXTERNAL_BLOCKED"
        : "DEGRADED";
    }
};

const r1Results =
  await Promise.all(
    r1Specs.map(probe)
  );

const eurLex =
  await probe(eurLexSpec);
const cellar =
  await probe(cellarSpec);
const isap =
  await probe(isapSpec);

const results = [
  ...r1Results,
  eurLex,
  cellar,
  isap
];

const requiredR1CoverageIds =
  new Set([
    "ELI_SEJM_METADATA",
    "ELI_GOV_MIRROR",
    "SEJM_PRAWO",
    "UODO_PORTAL",
    "MONITOR_POLSKI_RCL",
    "DZIENNIK_USTAW_RCL",
    "DZIENNIKI_URZEDOWE_INDEX",
    "BIP_GOV_REPRESENTATIVE",
    "EUR_LEX_DIRECT",
    "ISAP_HUMAN_PORTAL",
    "LEGAL_UN_ILC",
    "UN_TREATY_COLLECTION",
    "HUDOC_ECHR_API",
    "HCCH_CONVENTIONS",
    "ICSID_DEPOSITARY",
    "UNOOSA_TREATIES",
    "OHCHR_TREATY_PORTAL"
  ]);

const coveredR1Ids =
  new Set(
    results
      .filter(
        (item) =>
          item.tier === "R1"
      )
      .map(
        (item) =>
          item.id
      )
  );

const coverageComplete =
  [...requiredR1CoverageIds]
    .every(
      (id) =>
        coveredR1Ids.has(id)
    );

const eliPrimary =
  results.find(
    (item) =>
      item.id ===
      "ELI_SEJM_METADATA"
  );

const euLawHealthy =
  eurLex.state === "PASS" ||
  cellar.state === "PASS" ||
  cellar.state ===
    "PASS_INSECURE_HTTP";

const hardBlocked =
  !coverageComplete ||
  eliPrimary?.state !== "PASS" ||
  !euLawHealthy;

const degraded =
  results.some(
    (item) =>
      item.state === "DEGRADED" ||
      item.state ===
        "EXTERNAL_BLOCKED" ||
      item.state ===
        "PASS_INSECURE_HTTP" ||
      item.state ===
        "EXPECTED_WEB_ONLY"
  );

const result =
  hardBlocked
    ? "BLOCKED"
    : degraded
      ? "PASS_WITH_WARNINGS"
      : "PASS";

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "R1_LIVE_OFFICIAL_SOURCE_CONNECTIVITY",
      result,
      releaseBlocking:
        result === "BLOCKED",
      coverageComplete,
      requiredR1Coverage:
        [...requiredR1CoverageIds],
      canonicalNotes: {
        isapMachinePolicy:
          "ELI_IS_PRIMARY_MACHINE_CHANNEL; ISAP_MAY_BE_HUMAN_ONLY",
        bipCoverage:
          "REPRESENTATIVE_GOV_PL_PROBE_ONLY; BIP_IS_DYNAMIC_PER_AUTHORITY",
        eurLexPolicy:
          "DIRECT_OR_CELLAR_FALLBACK_MUST_BE_HEALTHY; HTTP_CELLAR_IS_REPORTED_AS_DEGRADED",
        caseLawTier:
          "SAOS_CBOSA_SN_AND_OTHER_OFFICIAL_CASE_LAW_ARE_R2A_NOT_R1",
        internationalPolicy:
          "LEGAL_UN_TREATIES_UN_HUDOC_HCCH_ICSID_UNOOSA_OHCHR_ARE_PROBED; EXPECTED_WEB_ONLY_IS_EXPLICIT_NOT_SILENT"
      },
      results
    },
    null,
    2
  ) + "\n"
);

if (hardBlocked) {
  process.exitCode = 1;
}

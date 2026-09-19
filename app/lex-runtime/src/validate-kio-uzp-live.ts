import {
  LocalPdfTextExtractor
} from "./pdf-text-extractor.js";

type GateState =
  | "PASS"
  | "PASS_WITH_WARNINGS"
  | "NO_PUBLIC_API"
  | "DEGRADED"
  | "BLOCKED";

type HttpTrace = {
  url: string;
  status?: number;
  finalUrl?: string;
  contentType?: string;
  bytes?: number;
  error?: string;
};

type ApiAudit = {
  state:
    | "PUBLIC_API_FOUND"
    | "NO_PUBLIC_API"
    | "DEGRADED";
  probes: HttpTrace[];
};

const UA =
  "Lex-Machina-KIO-UZP-Gate/1.0 (+https://github.com/michaleiatrak-star/Lex-Machina)";
const TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 8;
const MAX_BODY_BYTES =
  2_500_000;

function normalize(
  value: string
): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleUpperCase("pl");
}

function compactLegalKey(
  value: string
): string {
  return value
    .normalize("NFKC")
    .toUpperCase()
    .replace(/[^A-Z0-9]/gu, "");
}

async function fetchSafe(
  initialUrl: string,
  allowedHosts: string[],
  accept:
    string =
      "text/html,application/xhtml+xml,application/json,application/pdf,*/*;q=0.1"
): Promise<Response> {
  let current =
    initialUrl;
  const allowed =
    new Set(
      allowedHosts.map(
        (item) =>
          item.toLowerCase()
      )
    );

  for (
    let redirect = 0;
    redirect <=
      MAX_REDIRECTS;
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
              UA,
            Accept: accept,
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
          "REDIRECT_WITHOUT_LOCATION"
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
        !allowed.has(
          next.hostname
            .toLowerCase()
        )
      ) {
        throw new Error(
          "REDIRECT_HOST_DENIED:" +
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
    "REDIRECT_LIMIT_EXCEEDED"
  );
}

async function textResult(
  url: string,
  allowedHosts: string[]
): Promise<{
  trace: HttpTrace;
  text: string;
}> {
  try {
    const response =
      await fetchSafe(
        url,
        allowedHosts
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
    const text =
      new TextDecoder(
        "utf-8",
        { fatal: false }
      ).decode(
        limited
      );

    return {
      trace: {
        url,
        status:
          response.status,
        finalUrl:
          response.url ||
          url,
        contentType:
          response.headers.get(
            "content-type"
          ) ?? "",
        bytes:
          bytes.length
      },
      text
    };
  } catch (error) {
    return {
      trace: {
        url,
        error:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR"
      },
      text: ""
    };
  }
}

async function binaryResult(
  url: string,
  allowedHosts: string[]
): Promise<{
  trace: HttpTrace;
  bytes: Uint8Array;
}> {
  try {
    const response =
      await fetchSafe(
        url,
        allowedHosts,
        "application/pdf,*/*;q=0.1"
      );
    const bytes =
      new Uint8Array(
        await response
          .arrayBuffer()
      );

    return {
      trace: {
        url,
        status:
          response.status,
        finalUrl:
          response.url ||
          url,
        contentType:
          response.headers.get(
            "content-type"
          ) ?? "",
        bytes:
          bytes.length
      },
      bytes
    };
  } catch (error) {
    return {
      trace: {
        url,
        error:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR"
      },
      bytes:
        new Uint8Array()
    };
  }
}

function looksLikePublicApi(
  trace: HttpTrace,
  body: string
): boolean {
  if (
    trace.status !== 200
  ) {
    return false;
  }

  const contentType =
    (
      trace.contentType ??
      ""
    ).toLowerCase();

  const normalized =
    body
      .slice(0, 40_000)
      .toLowerCase();

  return (
    contentType.includes(
      "application/json"
    ) ||
    contentType.includes(
      "application/yaml"
    ) ||
    contentType.includes(
      "text/yaml"
    ) ||
    normalized.includes(
      "\"openapi\""
    ) ||
    normalized.includes(
      "openapi:"
    ) ||
    normalized.includes(
      "\"swagger\""
    )
  );
}

async function auditApi(
  urls: string[],
  allowedHosts: string[]
): Promise<ApiAudit> {
  const probes:
    HttpTrace[] = [];
  let publicApiFound =
    false;
  let transportFailures =
    0;

  for (
    const url of urls
  ) {
    const result =
      await textResult(
        url,
        allowedHosts
      );
    probes.push(
      result.trace
    );

    if (
      result.trace.error
    ) {
      transportFailures +=
        1;
    }

    if (
      looksLikePublicApi(
        result.trace,
        result.text
      )
    ) {
      publicApiFound =
        true;
    }
  }

  return {
    state:
      publicApiFound
        ? "PUBLIC_API_FOUND"
        : transportFailures ===
            urls.length
          ? "DEGRADED"
          : "NO_PUBLIC_API",
    probes
  };
}

const KIO_HOST =
  "orzeczenia.uzp.gov.pl";
const KIO_ID =
  "35709";
const KIO_PRIMARY_SIGNATURE =
  "KIO 3017/26";
const KIO_SIGNATURES = [
  "KIO 3017/26",
  "KIO 3019/26",
  "KIO 3020/26",
  "KIO 3025/26"
];

const kioSearch =
  await textResult(
    "https://orzeczenia.uzp.gov.pl/",
    [KIO_HOST]
  );

const kioFilteredSearch =
  await textResult(
    "https://orzeczenia.uzp.gov.pl/Home/Search?Sign=KIO%203017%2F26",
    [KIO_HOST]
  );

const kioDetails =
  await textResult(
    "https://orzeczenia.uzp.gov.pl/Home/Details/" +
      KIO_ID +
      "?CountStats=False&Fle=1&Pg=1&SCnt=1&ind=48",
    [KIO_HOST]
  );

const kioContent =
  await textResult(
    "https://orzeczenia.uzp.gov.pl/Home/ContentHtml/" +
      KIO_ID +
      "?Kind=KIO&flection=1",
    [KIO_HOST]
  );

const kioPdf =
  await binaryResult(
    "https://orzeczenia.uzp.gov.pl/Home/PdfContent/" +
      KIO_ID +
      "?Kind=KIO",
    [KIO_HOST]
  );

let kioPdfText =
  "";
let kioPdfPages:
  number | null = null;
let kioPdfExtractionError:
  string | null = null;

if (
  kioPdf.trace.status ===
    200 &&
  kioPdf.bytes.length >
    4 &&
  String.fromCharCode(
    ...kioPdf.bytes.slice(
      0,
      4
    )
  ) === "%PDF"
) {
  try {
    const extracted =
      await new LocalPdfTextExtractor()
        .extract(
          kioPdf.bytes
        );
    kioPdfText =
      extracted.text;
    kioPdfPages =
      extracted.pages;
  } catch (error) {
    kioPdfExtractionError =
      error instanceof Error
        ? error.message
        : "UNKNOWN_PDF_EXTRACTION_ERROR";
  }
}

const kioSearchHtmlPass =
  kioSearch.trace.status ===
    200 &&
  /wyszukiwarka orzeczeń/iu
    .test(kioSearch.text) &&
  /sygnatura/iu
    .test(kioSearch.text);

const primaryCompact =
  compactLegalKey(
    KIO_PRIMARY_SIGNATURE
  );

function signatureHits(
  value: string
): string[] {
  const compact =
    compactLegalKey(
      value
    );

  return KIO_SIGNATURES
    .filter(
      (signature) =>
        compact.includes(
          compactLegalKey(
            signature
          )
        )
    );
}

const kioDetailsHits =
  signatureHits(
    kioDetails.text
  );
const kioContentHits =
  signatureHits(
    kioContent.text
  );
const kioPdfHits =
  signatureHits(
    kioPdfText
  );

const kioDetailsPass =
  kioDetails.trace.status ===
    200 &&
  compactLegalKey(
    kioDetails.text
  ).includes(
    primaryCompact
  );

const kioContentPass =
  kioContent.trace.status ===
    200 &&
  compactLegalKey(
    kioContent.text
  ).includes(
    primaryCompact
  ) &&
  /Krajowa\s+Izba\s+Odwoławcza|\bKIO\b/iu
    .test(
      kioContent.text
    );

const kioPdfMagicValid =
  kioPdf.trace.status ===
    200 &&
  kioPdf.bytes.length >
    10_000 &&
  String.fromCharCode(
    ...kioPdf.bytes.slice(
      0,
      Math.min(
        1024,
        kioPdf.bytes.length
      )
    )
  ).includes("%PDF-");

const kioPdfTextPass =
  kioPdfPages !== null &&
  kioPdfExtractionError ===
    null &&
  compactLegalKey(
    kioPdfText
  ).includes(
    primaryCompact
  );

const kioPdfPass =
  kioPdfMagicValid &&
  kioPdfTextPass;

const kioMappingPass =
  kioDetailsPass &&
  kioContentPass &&
  kioPdfPass;

const kioSignSearchPass =
  kioFilteredSearch.trace
    .status === 200 &&
  kioFilteredSearch.text
    .includes(
      "/Home/Details/" +
      KIO_ID
    );

const kioApi =
  await auditApi(
    [
      "https://orzeczenia.uzp.gov.pl/swagger/v1/swagger.json",
      "https://orzeczenia.uzp.gov.pl/swagger/index.html",
      "https://orzeczenia.uzp.gov.pl/openapi.json",
      "https://orzeczenia.uzp.gov.pl/api"
    ],
    [KIO_HOST]
  );

const kioBlocking =
  !kioSearchHtmlPass ||
  !kioMappingPass;

const kioState:
  GateState =
  kioBlocking
    ? "BLOCKED"
    : kioSignSearchPass
      ? "PASS"
      : "PASS_WITH_WARNINGS";

const UZP_HOSTS = [
  "uzp.gov.pl",
  "www.uzp.gov.pl",
  "www.gov.pl",
  "gov.pl"
];

const uzpHome =
  await textResult(
    "https://uzp.gov.pl/",
    UZP_HOSTS
  );

const UZP_DOC_URL =
  "https://www.gov.pl/web/uzp/aktualne-progi-unijne-oraz-ich-rownowartosci-w-zlotych-na-lata-2026-2027";

const uzpDocument =
  await textResult(
    UZP_DOC_URL,
    UZP_HOSTS
  );

const uzpHomePass =
  uzpHome.trace.status ===
    200 &&
  /urząd zamówień publicznych/iu
    .test(
      uzpHome.text
    ) &&
  Boolean(
    uzpHome.trace.finalUrl &&
    new URL(
      uzpHome.trace.finalUrl
    ).hostname
      .toLowerCase() ===
      "www.gov.pl"
  );

const uzpDocumentPass =
  uzpDocument.trace.status ===
    200 &&
  /aktualne progi unijne/iu
    .test(
      uzpDocument.text
    ) &&
  /2026.?2027/iu
    .test(
      uzpDocument.text
    ) &&
  /monitor polski|m\.\s*p\./iu
    .test(
      uzpDocument.text
    );

const uzpApi =
  await auditApi(
    [
      "https://uzp.gov.pl/swagger/v1/swagger.json",
      "https://uzp.gov.pl/swagger/index.html",
      "https://uzp.gov.pl/openapi.json",
      "https://uzp.gov.pl/api"
    ],
    UZP_HOSTS
  );

const uzpBlocking =
  !uzpHomePass ||
  !uzpDocumentPass;

const uzpState:
  GateState =
  uzpBlocking
    ? "BLOCKED"
    : "PASS";

const releaseBlocking =
  kioBlocking ||
  uzpBlocking;

const warnings = [
  !kioSignSearchPass
    ? "KIO_SIGN_FILTER_NOT_DETERMINISTIC"
    : null,
  kioApi.state ===
    "DEGRADED"
    ? "KIO_API_PROBE_TRANSPORT_DEGRADED"
    : null,
  uzpApi.state ===
    "DEGRADED"
    ? "UZP_API_PROBE_TRANSPORT_DEGRADED"
    : null
].filter(
  (item):
    item is string =>
      Boolean(item)
);

const result:
  GateState =
  releaseBlocking
    ? "BLOCKED"
    : warnings.length > 0
      ? "PASS_WITH_WARNINGS"
      : "PASS";

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "KIO_UZP_LIVE_SOURCE_GATE",
      result,
      releaseBlocking,
      warnings,
      sources: {
        KIO: {
          result:
            kioState,
          html: {
            search:
              kioSearch.trace,
            filteredSearch:
              kioFilteredSearch.trace,
            searchPageValid:
              kioSearchHtmlPass,
            signFilterDeterministic:
              kioSignSearchPass
          },
          api:
            kioApi,
          download: {
            pdf:
              kioPdf.trace,
            pdfMagicValid:
              kioPdfMagicValid,
            pdfTextMatchesPrimary:
              kioPdfTextPass,
            signaturesFound:
              kioPdfHits,
            pdfPages:
              kioPdfPages,
            pdfExtractionError:
              kioPdfExtractionError
          },
          documentMapping: {
            internalId:
              KIO_ID,
            expectedSignatures:
              KIO_SIGNATURES,
            details:
              kioDetails.trace,
            detailsPrimarySignatureValid:
              kioDetailsPass,
            detailsSignaturesFound:
              kioDetailsHits,
            contentHtml:
              kioContent.trace,
            contentPrimarySignatureValid:
              kioContentPass,
            contentSignaturesFound:
              kioContentHits,
            sameDocumentConfirmed:
              kioMappingPass
          }
        },
        UZP: {
          result:
            uzpState,
          html: {
            home:
              uzpHome.trace,
            redirectToGovPlValid:
              uzpHomePass
          },
          api:
            uzpApi,
          download: {
            document:
              uzpDocument.trace,
            documentContentValid:
              uzpDocumentPass
          },
          documentMapping: {
            canonicalDocumentUrl:
              UZP_DOC_URL,
            title:
              "Aktualne progi unijne oraz ich równowartości w złotych na lata 2026-2027",
            mappedToOfficialPublication:
              uzpDocumentPass
          }
        }
      }
    },
    null,
    2
  ) + "\n"
);

if (releaseBlocking) {
  process.exitCode = 1;
}

import { createHash } from "node:crypto";
import type {
  VerificationRecord
} from "./verification-ledger.js";

export type CaseLawFetch = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type CaseVerificationStatus =
  | "FOUND"
  | "NOT_FOUND"
  | "AMBIGUOUS"
  | "OUT_OF_SCOPE";

export type SupremeCourtCaseVerificationRequest = {
  claim: string;
  signature: string;
  toolCallId: string;
};

export type SupremeCourtQuoteVerificationRequest = {
  caseClaim: string;
  signature: string;
  quote: string;
  toolCallId: string;
};

export type CaseQuoteVerificationStatus =
  | "VERIFIED"
  | "QUOTE_NOT_FOUND"
  | "INVALID_QUOTE"
  | "CASE_NOT_VERIFIED";

export type SupremeCourtCaseVerificationResult = {
  status: CaseVerificationStatus;
  normalizedSignature: string;
  rejectedNearMatches: string[];
  record?: VerificationRecord;
  judgment?: {
    id: string;
    signature: string;
    date?: string;
    form?: string;
    sourceUrl: string;
    contentScope: "FULL_TEXT";
    normalizedFullText: string;
  };
  reason?: string;
};

export type SupremeCourtQuoteVerificationResult = {
  status: CaseQuoteVerificationStatus;
  normalizedSignature: string;
  caseResult: SupremeCourtCaseVerificationResult;
  quoteRecord?: VerificationRecord;
  evidenceHash?: string;
  reason?: string;
};

const SN_PROXY =
  "https://sn.pl/index.php";
const SN_HUMAN =
  "https://sn.pl/pl/wyszukiwarka-orzeczen";

const SN_BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/128.0.0.0 Safari/537.36";

const SN_HOSTS = new Set([
  "sn.pl",
  "www.sn.pl"
]);

const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_SEARCH_RECORDS = 25;
const MAX_BASE64_CHARS = 8_000_000;

const SN_REPERTORIES = new Set([
  "CSK",
  "CSKP",
  "KK",
  "NKK",
  "UK",
  "NSNC",
  "NSNU",
  "NKN",
  "CNP",
  "CNPP",
  "SDI",
  "ZK",
  "CZP",
  "KZP",
  "UZP",
  "PZP",
  "NSNZP",
  "SNO",
  "DSI",
  "DSP",
  "CZ",
  "KO",
  "KSP",
  "NSW"
]);

function stripDotsAndSpace(
  value: string
): string {
  return value
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCaseSignature(
  value: string
): string {
  return stripDotsAndSpace(value)
    .toLocaleUpperCase("pl");
}

function signatureParts(
  value: string
): {
  repertory: string;
  year: number;
} | null {
  const normalized =
    stripDotsAndSpace(value);

  const match = normalized.match(
    /^(?:[IVXL]+\s+)?([A-Za-z][A-Za-z-]*)\s+(\d+)\/(\d{2,4})$/u
  );

  if (!match) return null;

  let year = Number(match[3]);
  if (year < 100) {
    year += year > 50 ? 1900 : 2000;
  }

  return {
    repertory:
      match[1]!.toLocaleUpperCase("pl"),
    year
  };
}

export function isSupremeCourtSignature(
  value: string
): boolean {
  const parts = signatureParts(value);
  return Boolean(
    parts &&
    SN_REPERTORIES.has(parts.repertory)
  );
}

function proxyUrl(
  task: string,
  params: Record<string, string>
): string {
  const url = new URL(SN_PROXY);
  url.searchParams.set("option", "com_ajax");
  url.searchParams.set("plugin", "snproxy");
  url.searchParams.set("format", "json");
  url.searchParams.set("task", task);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function supremeCourtSearchUrl(
  signature: string
): string {
  return proxyUrl(
    "searchOrzeczenia",
    {
      sygnatura:
        stripDotsAndSpace(signature),
      strona: "1",
      rozmiar_strony:
        String(MAX_SEARCH_RECORDS)
    }
  );
}

function supremeCourtTextUrl(
  id: string
): string {
  return proxyUrl(
    "OrzeczeniePlikHtml",
    { id }
  );
}

function humanUrl(
  id: string
): string {
  const url = new URL(SN_HUMAN);
  url.searchParams.set(
    "orzeczenie",
    id
  );
  return url.toString();
}

function cookiesFrom(
  response: Response
): string[] {
  const headers =
    response.headers as Headers & {
      getSetCookie?: () => string[];
    };

  const values =
    headers.getSetCookie?.() ??
    (
      response.headers.get("set-cookie")
        ? [
            response.headers.get(
              "set-cookie"
            )!
          ]
        : []
    );

  return values
    .map((value) =>
      value.split(";", 1)[0]?.trim()
    )
    .filter(
      (value): value is string =>
        Boolean(value)
    );
}

function mergeCookies(
  current: string[],
  incoming: string[]
): string[] {
  const byName =
    new Map<string, string>();

  for (const cookie of [
    ...current,
    ...incoming
  ]) {
    const name =
      cookie.split("=", 1)[0]?.trim();

    if (name) {
      byName.set(name, cookie);
    }
  }

  return [...byName.values()];
}

async function fetchSn(
  fetcher: CaseLawFetch,
  input: string
): Promise<Response> {
  let url = input;
  let cookies: string[] = [];

  for (
    let redirect = 0;
    redirect <= MAX_REDIRECTS;
    redirect += 1
  ) {
    const response =
      await fetcher(url, {
        method: "GET",
        redirect: "manual",
        signal:
          AbortSignal.timeout(
            REQUEST_TIMEOUT_MS
          ),
        headers: {
          "User-Agent":
            SN_BROWSER_UA,
          Accept: "*/*",
          ...(cookies.length
            ? {
                Cookie:
                  cookies.join("; ")
              }
            : {})
        }
      });

    cookies = mergeCookies(
      cookies,
      cookiesFrom(response)
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
          "SN_REDIRECT_WITHOUT_LOCATION"
        );
      }

      const next =
        new URL(location, url);

      if (
        next.protocol !== "https:" ||
        !SN_HOSTS.has(
          next.hostname.toLowerCase()
        )
      ) {
        throw new Error(
          "SN_REDIRECT_HOST_DENIED"
        );
      }

      url = next.toString();
      continue;
    }

    return response;
  }

  throw new Error(
    "SN_REDIRECT_LIMIT_EXCEEDED"
  );
}

function object(
  value: unknown
): Record<string, unknown> | null {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
    ? value as Record<string, unknown>
    : null;
}

function array(
  value: unknown
): unknown[] {
  return Array.isArray(value)
    ? value
    : [];
}

function searchRecords(
  payload: unknown
): Record<string, unknown>[] | null {
  const root = object(payload);
  const wrapper =
    object(array(root?.data)[0]);
  const records = wrapper?.data;

  if (!Array.isArray(records)) {
    return null;
  }

  return records
    .map(object)
    .filter(
      (
        item
      ): item is Record<string, unknown> =>
        Boolean(item)
    );
}

function rawFullText(
  payload: unknown
): string | null {
  const root = object(payload);
  const first =
    object(array(root?.data)[0]);

  const directRaw =
    first?.raw;
  if (
    typeof directRaw === "string" &&
    directRaw.length > 0
  ) {
    return directRaw;
  }

  // Current sn.pl com_ajax wraps the plugin
  // JsonResponse once more:
  // root.data[0].data.raw.
  const nested =
    object(first?.data);
  const nestedRaw =
    nested?.raw;

  if (
    typeof nestedRaw === "string" &&
    nestedRaw.length > 0
  ) {
    return nestedRaw;
  }

  return null;
}

function decodeBase64Html(
  raw: string
): string | null {
  if (
    raw.length > MAX_BASE64_CHARS ||
    !/^[A-Za-z0-9+/=\s]+$/u.test(raw)
  ) {
    return null;
  }

  try {
    return Buffer
      .from(
        raw.replace(/\s+/g, ""),
        "base64"
      )
      .toString("utf8");
  } catch {
    return null;
  }
}

function normalizeQuoteText(
  value: string
): string {
  return value
    .normalize("NFKC")
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleUpperCase("pl");
}

function quoteEvidenceHash(
  signature: string,
  quote: string
): string {
  return createHash("sha256")
    .update(
      normalizeCaseSignature(signature) +
      "\n" +
      normalizeQuoteText(quote),
      "utf8"
    )
    .digest("hex")
    .slice(0, 20);
}

export function propositionEvidenceHash(
  signature: string,
  proposition: string,
  supportQuote: string
): string {
  return createHash("sha256")
    .update(
      normalizeCaseSignature(signature) +
      "\n" +
      normalizeQuoteText(proposition) +
      "\n" +
      normalizeQuoteText(supportQuote),
      "utf8"
    )
    .digest("hex")
    .slice(0, 20);
}

function normalizeOfficialText(
  html: string
): string {
  return html
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/giu,
      " "
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/giu,
      " "
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;/giu, "&")
    .normalize("NFKC")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleUpperCase("pl");
}

export class SupremeCourtCaseVerifier {
  constructor(
    private readonly fetcher:
      CaseLawFetch =
        globalThis.fetch.bind(
          globalThis
        ),
    private readonly now:
      () => string =
        () => new Date().toISOString()
  ) {}

  async verify(
    request:
      SupremeCourtCaseVerificationRequest
  ): Promise<SupremeCourtCaseVerificationResult> {
    const normalizedSignature =
      normalizeCaseSignature(
        request.signature
      );

    if (
      !request.claim.trim() ||
      !isSupremeCourtSignature(
        normalizedSignature
      )
    ) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "INVALID_OR_NON_SN_SIGNATURE"
      };
    }

    let searchResponse: Response;

    try {
      searchResponse =
        await fetchSn(
          this.fetcher,
          supremeCourtSearchUrl(
            normalizedSignature
          )
        );
    } catch {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "SN_SEARCH_TRANSPORT_FAILED"
      };
    }

    if (!searchResponse.ok) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "SN_SEARCH_HTTP_" +
          searchResponse.status
      };
    }

    let searchPayload: unknown;

    try {
      searchPayload =
        await searchResponse.json();
    } catch {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "SN_SEARCH_JSON_DRIFT"
      };
    }

    const records =
      searchRecords(searchPayload);

    if (!records) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "SN_SEARCH_SCHEMA_DRIFT"
      };
    }

    if (
      records.length >=
      MAX_SEARCH_RECORDS
    ) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches: [],
        reason:
          "SN_SEARCH_MAY_BE_TRUNCATED"
      };
    }

    const exact =
      records.filter((record) =>
        normalizeCaseSignature(
          String(
            record.sygnatura_sprawy ??
            ""
          )
        ) === normalizedSignature
      );

    const rejectedNearMatches =
      records
        .filter(
          (record) =>
            !exact.includes(record)
        )
        .map((record) =>
          String(
            record.sygnatura_sprawy ??
            ""
          ).trim()
        )
        .filter(Boolean);

    if (exact.length === 0) {
      return {
        status: "NOT_FOUND",
        normalizedSignature,
        rejectedNearMatches
      };
    }

    if (exact.length > 1) {
      return {
        status: "AMBIGUOUS",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "MULTIPLE_EXACT_SN_RECORDS"
      };
    }

    const searchRecord =
      exact[0]!;

    const id =
      String(
        searchRecord.id ?? ""
      ).trim();

    if (!id) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_RECORD_ID_MISSING"
      };
    }

    let textResponse: Response;

    try {
      textResponse =
        await fetchSn(
          this.fetcher,
          supremeCourtTextUrl(id)
        );
    } catch {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_FULL_TEXT_TRANSPORT_FAILED"
      };
    }

    if (!textResponse.ok) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_FULL_TEXT_HTTP_" +
          textResponse.status
      };
    }

    let textPayload: unknown;

    try {
      textPayload =
        await textResponse.json();
    } catch {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_FULL_TEXT_JSON_DRIFT"
      };
    }

    const raw =
      rawFullText(textPayload);

    const html =
      raw
        ? decodeBase64Html(raw)
        : null;

    if (!html) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_FULL_TEXT_UNAVAILABLE"
      };
    }

    const officialText =
      normalizeOfficialText(html);

    if (
      !officialText.includes(
        normalizedSignature
      ) ||
      !officialText.includes(
        "SĄD NAJWYŻSZY"
      )
    ) {
      return {
        status: "OUT_OF_SCOPE",
        normalizedSignature,
        rejectedNearMatches,
        reason:
          "SN_FULL_TEXT_IDENTITY_MISMATCH"
      };
    }

    const sourceUrl =
      humanUrl(id);

    const date =
      typeof searchRecord.data_wydania ===
        "string"
        ? searchRecord.data_wydania
        : undefined;

    const form =
      typeof searchRecord.forma_orzeczenia ===
        "string"
        ? searchRecord.forma_orzeczenia
        : undefined;

    const fetchedAt =
      this.now();

    const verificationRecord:
      VerificationRecord = {
        claim: request.claim,
        kind: "case",
        status: "VERIFIED",
        sourceUrl,
        sourceTier: "R2A",
        fetchedAt,
        toolCallId:
          request.toolCallId,
        verificationMethod:
          "web_fetch",
        sourceFormat: "TEXT",
        caseScope: "FULL_TEXT",
        caseSignature:
          normalizedSignature,
        evidence:
          [
            "Sąd Najwyższy",
            normalizedSignature,
            date,
            form
          ]
            .filter(Boolean)
            .join(" · ")
      };

    return {
      status: "FOUND",
      normalizedSignature,
      rejectedNearMatches,
      record:
        verificationRecord,
      judgment: {
        id,
        signature:
          normalizedSignature,
        ...(date
          ? { date }
          : {}),
        ...(form
          ? { form }
          : {}),
        sourceUrl,
        contentScope:
          "FULL_TEXT",
        normalizedFullText:
          officialText
      }
    };
  }

  async verifyExactQuote(
    request:
      SupremeCourtQuoteVerificationRequest
  ): Promise<
    SupremeCourtQuoteVerificationResult
  > {
    const quote =
      request.quote.trim();
    const normalizedQuote =
      normalizeQuoteText(quote);

    const caseResult =
      await this.verify({
        claim:
          request.caseClaim,
        signature:
          request.signature,
        toolCallId:
          request.toolCallId
      });

    if (
      caseResult.status !== "FOUND" ||
      !caseResult.record ||
      caseResult.record.status !== "VERIFIED" ||
      !caseResult.judgment
    ) {
      return {
        status:
          "CASE_NOT_VERIFIED",
        normalizedSignature:
          caseResult.normalizedSignature,
        caseResult,
        reason:
          caseResult.reason ??
          caseResult.status
      };
    }

    if (
      normalizedQuote.length < 24 ||
      normalizedQuote.length > 1200
    ) {
      return {
        status: "INVALID_QUOTE",
        normalizedSignature:
          caseResult.normalizedSignature,
        caseResult,
        reason:
          "QUOTE_LENGTH_OUT_OF_RANGE"
      };
    }

    if (
      !caseResult.judgment
        .normalizedFullText
        .includes(
          normalizedQuote
        )
    ) {
      return {
        status:
          "QUOTE_NOT_FOUND",
        normalizedSignature:
          caseResult.normalizedSignature,
        caseResult,
        reason:
          "EXACT_QUOTE_NOT_FOUND_IN_OFFICIAL_TEXT"
      };
    }

    const evidenceHash =
      quoteEvidenceHash(
        caseResult.normalizedSignature,
        quote
      );

    const quoteRecord:
      VerificationRecord = {
        claim: quote,
        kind: "case",
        status: "VERIFIED",
        ...(caseResult.record.sourceUrl
          ? {
              sourceUrl:
                caseResult.record.sourceUrl
            }
          : {}),
        ...(caseResult.record.sourceTier
          ? {
              sourceTier:
                caseResult.record.sourceTier
            }
          : {}),
        fetchedAt:
          caseResult.record.fetchedAt,
        toolCallId:
          request.toolCallId,
        verificationMethod:
          "web_fetch",
        sourceFormat: "TEXT",
        caseScope:
          "EXACT_QUOTE",
        caseSignature:
          caseResult.normalizedSignature,
        evidenceHash,
        evidence:
          quote.slice(0, 500)
      };

    return {
      status: "VERIFIED",
      normalizedSignature:
        caseResult.normalizedSignature,
      caseResult,
      quoteRecord,
      evidenceHash
    };
  }
}

import {
  DEFAULT_PDF_MAX_BYTES,
  LocalPdfTextExtractor,
  PdfTextExtractionError,
  type PdfTextExtractor
} from "./pdf-text-extractor.js";
import type {
  VerificationKind,
  VerificationRecord
} from "./verification-ledger.js";

export type LegalSourceFetch = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type LegalSourceVerificationRequest = {
  claim: string;
  kind: VerificationKind;
  url: string;
  toolCallId: string;
  expectedTitle?: string;
};

export type LegalSourceVerificationResult = {
  record: VerificationRecord;
  matched: boolean;
  host: string;
};

const NSA_WSA_SNAPSHOT_HOSTS = new Set<string>([
  "nsa.gov.pl",
  "orzeczenia.nsa.gov.pl"
]);

export const OFFICIAL_LEGAL_SOURCE_HOSTS = [
  "eli.gov.pl",
  "isap.sejm.gov.pl",
  "api.sejm.gov.pl",
  "orzeczenia.ms.gov.pl",
  "www.orzeczenia.ms.gov.pl",
  "nsa.gov.pl",
  "orzeczenia.nsa.gov.pl",
  "sn.pl",
  "www.sn.pl"
] as const;

const OFFICIAL_SOURCE_HOSTS = new Set<string>([
  ...OFFICIAL_LEGAL_SOURCE_HOSTS
]);

const MAX_SOURCE_CHARS = 2_000_000;
const MAX_EVIDENCE_CHARS = 12_000;

function decodeHtmlEntities(
  value: string
): string {
  const named: Record<string, string> = {
    nbsp: " ",
    sect: "§",
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">"
  };

  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/giu,
    (match, token: string) => {
      const lower = token.toLocaleLowerCase("en");
      if (lower.startsWith("#x")) {
        const code = Number.parseInt(lower.slice(2), 16);
        return Number.isFinite(code)
          ? String.fromCodePoint(code)
          : match;
      }
      if (lower.startsWith("#")) {
        const code = Number.parseInt(lower.slice(1), 10);
        return Number.isFinite(code)
          ? String.fromCodePoint(code)
          : match;
      }
      return named[lower] ?? match;
    }
  );
}

function readableText(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
      .replace(/<\s*(?:br\b[^>]*|\/?(?:body|main|section|article|header|footer|title|p|div|li|tr|td|th|h[1-6])\b[^>]*)>/giu, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(
    /[.*+?^$()|[\]\\{}]/g,
    (match) => "\\" + match
  );
}
function articleSection(
  claim: string,
  body: string
): string | null {
  const article = articleToken(claim);
  if (!article) return null;

  const readable = readableText(body);
  const strictHeading = new RegExp(
    "(?:^|\\n)\\s*Art\\.?\\s+" +
      escapeRegExp(article) +
      "(?=\\s*(?:\\.|§|$))",
    "u"
  );
  const fallbackHeading = new RegExp(
    "\\bArt\\.?\\s+" +
      escapeRegExp(article) +
      "(?=\\s*(?:\\.|§|$))",
    "u"
  );
  const match =
    strictHeading.exec(readable) ??
    fallbackHeading.exec(readable);
  if (!match) return null;

  const start =
    match.index +
    (match[0].startsWith("\n") ? 1 : 0);
  const afterHeading =
    match.index + match[0].length;
  const nextHeading = /\n\s*Art\.?\s+\d+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*(?=\s*(?:\.|§|$))/u.exec(
    readable.slice(afterHeading)
  );
  const end = nextHeading
    ? afterHeading + nextHeading.index
    : readable.length;
  const section = readable.slice(start, end).trim();
  return section ? section.slice(0, MAX_EVIDENCE_CHARS) : null;
}

function normalize(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&sect;/giu, "§")
    .replace(/&amp;/giu, "&")
    .normalize("NFKC")
    .toLocaleLowerCase("pl")
    .replace(/[.,;:()[\]{}§]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function articleToken(claim: string): string | null {
  const match = claim.match(
    /\bart\.?\s+(\d+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*)/iu
  );
  return match?.[1]?.toLocaleLowerCase("pl") ?? null;
}

function journalTokens(claim: string): string[] {
  const normalized = normalize(claim);
  const year = normalized.match(/\b(20\d{2}|19\d{2})\b/u)?.[1];
  const position = normalized.match(/\bpoz\s+(\d+)\b/u)?.[1];
  return [year, position].filter(
    (value): value is string => Boolean(value)
  );
}

function caseSignature(claim: string): string | null {
  const normalized = normalize(
    claim.replace(/^.*?sygn\.?\s*(?:akt\s*)?/iu, "")
  );
  return normalized || null;
}

function titleMatches(
  expectedTitle: string | undefined,
  body: string,
  kind: VerificationKind
): boolean {
  if (kind !== "statute" && kind !== "journal") {
    return true;
  }

  const expected = normalize(expectedTitle ?? "");
  if (expected.length < 4) return false;
  return normalize(body).includes(expected);
}

function matchesClaim(
  claim: string,
  kind: VerificationKind,
  body: string
): boolean {
  const haystack = normalize(body);
  if (!haystack) return false;

  if (kind === "statute") {
    return Boolean(
      articleSection(
        claim,
        body
      )
    );
  }

  if (kind === "journal") {
    const tokens = journalTokens(claim);
    return tokens.length >= 2 && tokens.every((token) =>
      haystack.includes(token)
    );
  }

  if (kind === "case") {
    const signature = caseSignature(claim);
    return Boolean(signature && haystack.includes(signature));
  }

  return haystack.includes(normalize(claim));
}

function evidenceSnippet(
  claim: string,
  kind: VerificationKind,
  body: string
): string | undefined {
  if (kind === "statute") {
    return articleSection(
      claim,
      body
    ) ?? undefined;
  }

  const normalizedBody = normalize(body);
  const needle =
    kind === "case"
      ? caseSignature(claim) ?? normalize(claim)
      : normalize(claim);

  if (!needle) return undefined;
  const index = normalizedBody.indexOf(needle);
  if (index < 0) return undefined;
  const start = Math.max(0, index - 160);
  return normalizedBody
    .slice(start, start + MAX_EVIDENCE_CHARS)
    .trim();
}
function sourceTier(host: string): "R1" | "R2A" {
  return host === "eli.gov.pl" ||
    host === "isap.sejm.gov.pl" ||
    host === "api.sejm.gov.pl"
    ? "R1"
    : "R2A";
}

function isPdfResponse(
  url: URL,
  contentType: string
): boolean {
  return (
    contentType.includes("application/pdf") ||
    url.pathname.toLowerCase().endsWith(".pdf")
  );
}

export class LegalSourceVerificationError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_SOURCE_URL"
      | "SOURCE_NOT_OFFICIAL"
      | "SOURCE_FETCH_FAILED"
      | "SOURCE_TOO_LARGE"
      | "UNSUPPORTED_SOURCE_CONTENT"
      | "PDF_EXTRACTION_FAILED"
  ) {
    super(message);
    this.name = "LegalSourceVerificationError";
  }
}

export class OfficialLegalSourceVerifier {
  constructor(
    private readonly fetcher: LegalSourceFetch =
      globalThis.fetch.bind(globalThis),
    private readonly now: () => string =
      () => new Date().toISOString(),
    private readonly pdfTextExtractor:
      PdfTextExtractor =
      new LocalPdfTextExtractor()
  ) {}

  supportsPdf(): boolean {
    return Boolean(this.pdfTextExtractor);
  }

  async verify(
    request: LegalSourceVerificationRequest
  ): Promise<LegalSourceVerificationResult> {
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      throw new LegalSourceVerificationError(
        "Legal source URL is invalid.",
        "INVALID_SOURCE_URL"
      );
    }

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password
    ) {
      throw new LegalSourceVerificationError(
        "Legal verification requires credential-free HTTPS.",
        "INVALID_SOURCE_URL"
      );
    }

    const host = url.hostname.toLowerCase();
    if (!OFFICIAL_SOURCE_HOSTS.has(host)) {
      throw new LegalSourceVerificationError(
        "Legal source host is not on the official-source allowlist.",
        "SOURCE_NOT_OFFICIAL"
      );
    }

    let response: Response;
    try {
      response = await this.fetcher(url, {
        method: "GET",
        redirect: "error",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/json,text/plain,application/pdf;q=0.9,*/*;q=0.1"
        }
      });
    } catch {
      throw new LegalSourceVerificationError(
        "Official legal source could not be fetched without redirects.",
        "SOURCE_FETCH_FAILED"
      );
    }

    if (!response.ok) {
      throw new LegalSourceVerificationError(
        "Official legal source returned HTTP " + response.status + ".",
        "SOURCE_FETCH_FAILED"
      );
    }

    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";

    const pdfSource =
      isPdfResponse(url, contentType);

    let body: string;
    if (pdfSource) {
      if (!this.pdfTextExtractor) {
        throw new LegalSourceVerificationError(
          "Official PDF requires a configured local PDF text extractor.",
          "UNSUPPORTED_SOURCE_CONTENT"
        );
      }

      const contentLength = Number(
        response.headers.get("content-length") ?? "0"
      );
      if (
        Number.isFinite(contentLength) &&
        contentLength >
          DEFAULT_PDF_MAX_BYTES
      ) {
        throw new LegalSourceVerificationError(
          "Official PDF exceeds the configured byte limit.",
          "SOURCE_TOO_LARGE"
        );
      }

      const bytes = new Uint8Array(
        await response.arrayBuffer()
      );
      try {
        const extracted =
          await this.pdfTextExtractor.extract(
            bytes
          );
        body = extracted.text.slice(
          0,
          MAX_SOURCE_CHARS
        );
      } catch (error) {
        if (
          error instanceof
          PdfTextExtractionError &&
          error.code === "PDF_TOO_LARGE"
        ) {
          throw new LegalSourceVerificationError(
            "Official PDF exceeds the configured byte limit.",
            "SOURCE_TOO_LARGE"
          );
        }

        throw new LegalSourceVerificationError(
          "Official PDF could not be converted into verifiable text.",
          "PDF_EXTRACTION_FAILED"
        );
      }
    } else {
      if (
        contentType &&
        !contentType.includes("text/") &&
        !contentType.includes("html") &&
        !contentType.includes("json") &&
        !contentType.includes("xml")
      ) {
        throw new LegalSourceVerificationError(
          "Official source content is not directly verifiable text.",
          "UNSUPPORTED_SOURCE_CONTENT"
        );
      }

      body = (await response.text()).slice(
        0,
        MAX_SOURCE_CHARS
      );
    }

    const titleMatched = titleMatches(
      request.expectedTitle,
      body,
      request.kind
    );
    const referenceMatched = matchesClaim(
      request.claim,
      request.kind,
      body
    );
    const matched =
      titleMatched &&
      referenceMatched;
    const fetchedAt = this.now();
    const sourceUrl = url.toString();

    const evidence = evidenceSnippet(
      request.claim,
      request.kind,
      body
    );

    const snapshotOnly =
      NSA_WSA_SNAPSHOT_HOSTS.has(host);
    const record: VerificationRecord = matched && !snapshotOnly
      ? {
          claim: request.claim,
          kind: request.kind,
          status: "VERIFIED",
          sourceUrl,
          sourceTier: sourceTier(host),
          fetchedAt,
          toolCallId: request.toolCallId,
          verificationMethod:
            pdfSource
              ? "web_fetch_pdf"
              : "web_fetch",
          sourceFormat:
            pdfSource ? "PDF" : "TEXT",
          ...(evidence ? { evidence } : {})
        }
      : {
          claim: request.claim,
          kind: request.kind,
          status: "UNVERIFIED",
          sourceUrl,
          sourceTier: sourceTier(host),
          fetchedAt,
          toolCallId: request.toolCallId,
          verificationMethod:
            pdfSource
              ? "web_fetch_pdf"
              : "web_fetch",
          sourceFormat:
            pdfSource ? "PDF" : "TEXT",
          ...(snapshotOnly
            ? {
                verificationCeiling:
                  "SNAPSHOT_NO_PROMOTION" as const
              }
            : {}),
          evidence:
            snapshotOnly && matched
              ? `NSA/WSA SNAPSHOT (not promoted to VERIFIED): ${evidence ?? "reference found in the fetched CBOSA text"}`
              : !titleMatched
                ? "Official source was fetched, but the expected act title was not found."
                : "Official source was fetched, but the requested reference was not found in the fetched text."
        };

    return {
      record,
      matched,
      host
    };
  }
}

export function isOfficialLegalSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      OFFICIAL_SOURCE_HOSTS.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}
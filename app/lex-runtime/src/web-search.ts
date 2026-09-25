import {
  classifyKnownLegalSourceUrl,
  type LegalSourceTier
} from "./legal-source-policy.js";

/**
 * General internet search for every model in the Lex tool path (ChatGPT,
 * Claude, Bielik, Mistral). Ports the search half of installer/llama-web-mcp.py
 * so it no longer depends on llama.cpp native agent mode.
 *
 * Results are discovery only: snippets are never evidence. R1/R2A hits must go
 * through the native verifiers, R2B/R3 hits through fetch_auxiliary_legal_source.
 */

export type WebSearchHit = {
  title: string;
  url: string;
  snippet: string;
};

export type WebSearchProviderName =
  | "brave"
  | "duckduckgo";

export type WebSearchResponse = {
  provider: WebSearchProviderName;
  hits: WebSearchHit[];
};

export interface WebSearchProvider {
  search(
    query: string,
    maxResults: number
  ): Promise<WebSearchResponse>;
}

export class WebSearchError extends Error {
  constructor(
    readonly code:
      | "WEB_SEARCH_QUERY_INVALID"
      | "WEB_SEARCH_CASE_DATA_FORBIDDEN"
      | "WEB_SEARCH_DISABLED"
      | "WEB_SEARCH_NO_RESULTS",
    detail?: string
  ) {
    super(detail ? `${code}:${detail}` : code);
    this.name = "WebSearchError";
  }
}

const MAX_QUERY_CHARS = 300;
const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LexMachina/1.0";

export function assertPublicWebSearchQuery(
  raw: unknown
): string {
  const query =
    typeof raw === "string"
      ? raw.replace(/\s+/g, " ").trim()
      : "";
  if (
    !query ||
    query.length > MAX_QUERY_CHARS
  ) {
    throw new WebSearchError(
      "WEB_SEARCH_QUERY_INVALID"
    );
  }
  // The chat is pseudonymized before it reaches any model; a query carrying
  // vault tokens or document markers would leak case context to a search engine.
  if (
    /\[(?:LM)?PII:/iu.test(query) ||
    /\[(?:DOCUMENT|CASE KNOWLEDGE|FIRM KNOWLEDGE)\s/iu.test(query)
  ) {
    throw new WebSearchError(
      "WEB_SEARCH_CASE_DATA_FORBIDDEN"
    );
  }
  return query;
}

function decodeEntities(
  value: string
): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number(dec))
    )
    .replace(/&quot;/g, "\"")
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeDuckDuckGoUrl(
  href: string
): string {
  let value =
    decodeEntities(href);
  if (value.startsWith("//")) {
    value = `https:${value}`;
  } else if (value.startsWith("/")) {
    value = `https://duckduckgo.com${value}`;
  }
  try {
    const parsed = new URL(value);
    if (parsed.hostname.endsWith("duckduckgo.com")) {
      const target =
        parsed.searchParams.get("uddg");
      if (target) return target;
    }
  } catch {
    return "";
  }
  return value;
}

export function parseDuckDuckGoHtml(
  html: string,
  maxResults: number
): WebSearchHit[] {
  const hits: WebSearchHit[] = [];
  const anchor =
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while (
    (match = anchor.exec(html)) !== null
  ) {
    const attributes = match[1] ?? "";
    const body = match[2] ?? "";
    const classes =
      /\bclass\s*=\s*"([^"]*)"/i.exec(attributes)?.[1]
        ?.split(/\s+/) ?? [];
    if (classes.includes("result__a")) {
      const href =
        /\bhref\s*=\s*"([^"]*)"/i.exec(attributes)?.[1] ?? "";
      const url =
        decodeDuckDuckGoUrl(href);
      const title =
        decodeEntities(body);
      if (
        title &&
        /^https?:\/\//i.test(url)
      ) {
        hits.push({
          title,
          url,
          snippet: ""
        });
      }
    } else if (
      classes.includes("result__snippet") &&
      hits.length > 0
    ) {
      hits[hits.length - 1]!.snippet =
        decodeEntities(body);
    }
  }
  return hits.slice(0, maxResults);
}

async function readLimitedText(
  response: Response
): Promise<string> {
  const buffer =
    Buffer.from(await response.arrayBuffer());
  return buffer
    .subarray(0, MAX_BODY_BYTES)
    .toString("utf8");
}

export class PublicWebSearch implements WebSearchProvider {
  constructor(
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS
  ) {}

  async search(
    query: string,
    maxResults: number
  ): Promise<WebSearchResponse> {
    const provider = (
      this.env.LEX_WEB_SEARCH_PROVIDER ??
      "auto"
    ).trim().toLowerCase();
    if (
      provider === "off" ||
      provider === "disabled"
    ) {
      throw new WebSearchError(
        "WEB_SEARCH_DISABLED"
      );
    }

    const errors: string[] = [];
    const braveKey =
      this.env.BRAVE_SEARCH_API_KEY?.trim();
    if (
      braveKey &&
      (provider === "auto" || provider === "brave")
    ) {
      try {
        const hits =
          await this.searchBrave(query, maxResults, braveKey);
        if (hits.length > 0) {
          return { provider: "brave", hits };
        }
      } catch (error) {
        errors.push(
          `brave:${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    if (
      provider === "auto" ||
      provider === "duckduckgo" ||
      provider === "ddg"
    ) {
      try {
        const hits =
          await this.searchDuckDuckGo(query, maxResults);
        if (hits.length > 0) {
          return { provider: "duckduckgo", hits };
        }
      } catch (error) {
        errors.push(
          `duckduckgo:${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    throw new WebSearchError(
      "WEB_SEARCH_NO_RESULTS",
      errors.join("; ") || `provider=${provider}`
    );
  }

  private async searchBrave(
    query: string,
    maxResults: number,
    apiKey: string
  ): Promise<WebSearchHit[]> {
    const url =
      new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.set("q", query);
    url.searchParams.set("count", String(maxResults));
    const response =
      await this.fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": apiKey,
          "User-Agent": USER_AGENT
        },
        signal: AbortSignal.timeout(this.timeoutMs)
      });
    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }
    const payload =
      JSON.parse(await readLimitedText(response)) as {
        web?: {
          results?: Array<{
            url?: unknown;
            title?: unknown;
            description?: unknown;
          }>;
        };
      };
    return (payload.web?.results ?? [])
      .map((item) => ({
        title:
          typeof item.title === "string"
            ? decodeEntities(item.title)
            : "",
        url:
          typeof item.url === "string"
            ? item.url.trim()
            : "",
        snippet:
          typeof item.description === "string"
            ? decodeEntities(item.description)
            : ""
      }))
      .filter((item) =>
        item.title &&
        /^https?:\/\//i.test(item.url)
      )
      .slice(0, maxResults);
  }

  private async searchDuckDuckGo(
    query: string,
    maxResults: number
  ): Promise<WebSearchHit[]> {
    const url =
      new URL("https://html.duckduckgo.com/html/");
    url.searchParams.set("q", query);
    const response =
      await this.fetchImpl(url, {
        headers: {
          Accept: "text/html",
          "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.6",
          "User-Agent": USER_AGENT
        },
        signal: AbortSignal.timeout(this.timeoutMs)
      });
    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }
    return parseDuckDuckGoHtml(
      await readLimitedText(response),
      maxResults
    );
  }
}

export type ClassifiedWebSearchHit =
  WebSearchHit & {
    sourceTier: LegalSourceTier;
    nextStep: string;
  };

export function classifyWebSearchHits(
  hits: WebSearchHit[]
): ClassifiedWebSearchHit[] {
  return hits.map((hit) => {
    const sourceTier =
      classifyKnownLegalSourceUrl(hit.url) ?? "R3";
    return {
      ...hit,
      sourceTier,
      nextStep:
        sourceTier === "R1"
          ? "Official statute source: verify the exact provision with verify_legal_reference before citing."
          : sourceTier === "R2A"
            ? "Official case-law/register source: verify with the matching verify_case_* tool or federated document fetch before citing."
            : "Auxiliary source: read it with fetch_auxiliary_legal_source; it can never be the sole legal basis."
    };
  });
}

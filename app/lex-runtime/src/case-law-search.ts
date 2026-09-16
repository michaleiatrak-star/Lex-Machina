export type CaseLawSearchFetch = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type CaseLawSearchSource =
  | "SAOS"
  | "CBOSA";

export type CaseLawSearchRequest = {
  source: CaseLawSearchSource;
  query: string;
  limit?: number;
};

export type CaseLawSearchCandidate = {
  source: CaseLawSearchSource;
  id: string;
  caseNumbers: string[];
  judgmentDate?: string;
  court?: string;
  courtType?: string;
  sourceUrl: string;
  contentScope: "DISCOVERY";
};

export type CaseLawSearchResult = {
  source: CaseLawSearchSource;
  status:
    | "FOUND"
    | "NOT_FOUND"
    | "OUT_OF_SCOPE";
  query: string;
  candidates: CaseLawSearchCandidate[];
  total?: number;
  reason?: string;
};

export const CASE_LAW_SEARCH_HOSTS = [
  "saos.org.pl",
  "www.saos.org.pl",
  "orzeczenia.nsa.gov.pl"
] as const;

const SAOS_ENDPOINT =
  "https://www.saos.org.pl/api/search/judgments";
const CBOSA_QUERY =
  "https://orzeczenia.nsa.gov.pl/cbo/query";
const CBOSA_SEARCH =
  "https://orzeczenia.nsa.gov.pl/cbo/search";

const REQUEST_TIMEOUT_MS = 60_000;
const MAX_RESULTS = 10;
const CBOSA_PAGE_SIZE = 10;
const MAX_CBOSA_REDIRECTS = 3;
const MAX_CBOSA_TRANSPORT_ATTEMPTS = 4;

const USER_AGENT =
  "Lex-Machina/0.1 (+local legal research runtime)";
const CBOSA_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/140.0.0.0 Safari/537.36";

function clampLimit(
  value: number | undefined
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 5;
  }
  return Math.max(
    1,
    Math.min(
      MAX_RESULTS,
      Math.trunc(value)
    )
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

function text(
  value: unknown
): string | undefined {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : undefined;
}

function decodeHtml(
  value: string
): string {
  return value
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/<[^>]+>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function saosCourt(
  item: Record<string, unknown>
): string | undefined {
  const division =
    object(item.division);
  const court =
    object(division?.court);
  const courtName =
    text(court?.name);
  if (courtName) {
    return courtName;
  }

  const chamber =
    object(array(item.chambers)[0]);
  return text(chamber?.name);
}

function saosCaseNumbers(
  item: Record<string, unknown>
): string[] {
  return array(item.courtCases)
    .map(object)
    .map((entry) =>
      text(entry?.caseNumber)
    )
    .filter(
      (value): value is string =>
        Boolean(value)
    );
}

function saosCandidate(
  raw: unknown
): CaseLawSearchCandidate | null {
  const item = object(raw);
  if (!item) return null;

  const idValue = item.id;
  const id =
    (
      typeof idValue === "number" ||
      typeof idValue === "string"
    )
      ? String(idValue)
      : "";

  if (!id) return null;

  const judgmentDate =
    text(item.judgmentDate);
  const courtType =
    text(item.courtType);
  const court =
    saosCourt(item);

  return {
    source: "SAOS",
    id,
    caseNumbers:
      saosCaseNumbers(item),
    ...(judgmentDate
      ? { judgmentDate }
      : {}),
    ...(court
      ? { court }
      : {}),
    ...(courtType
      ? { courtType }
      : {}),
    sourceUrl:
      `https://www.saos.org.pl/judgments/${encodeURIComponent(id)}`,
    contentScope:
      "DISCOVERY"
  };
}

function saosTotal(
  payload: Record<string, unknown>
): number | undefined {
  const info = object(payload.info);
  const value =
    info?.totalResults ??
    info?.total ??
    payload.totalResults ??
    payload.total;

  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : undefined;
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
      response.headers.get(
        "set-cookie"
      )
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

function sleep(
  milliseconds: number
): Promise<void> {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}

async function fetchCbosa(
  fetcher: CaseLawSearchFetch,
  input: string,
  init: RequestInit,
  cookies: string[]
): Promise<{
  response: Response;
  cookies: string[];
}> {
  let url = input;
  let method =
    (init.method ?? "GET")
      .toUpperCase();
  let body = init.body;
  let jar = [...cookies];

  for (
    let redirect = 0;
    redirect <= MAX_CBOSA_REDIRECTS;
    redirect += 1
  ) {
    const {
      body: _initBody,
      ...initWithoutBody
    } = init;
    const requestInit:
      RequestInit = {
        ...initWithoutBody,
        method,
        redirect: "manual",
        signal:
          AbortSignal.timeout(
            REQUEST_TIMEOUT_MS
          ),
        headers: {
          "User-Agent":
            CBOSA_USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language":
            "pl-PL,pl;q=0.9,en;q=0.7",
          "Cache-Control":
            "no-cache",
          Pragma:
            "no-cache",
          ...(init.headers ?? {}),
          ...(jar.length
            ? {
                Cookie:
                  jar.join("; ")
              }
            : {})
        }
      };

    if (
      method !== "GET" &&
      method !== "HEAD" &&
      body !== undefined &&
      body !== null
    ) {
      requestInit.body = body;
    }

    let response:
      Response | undefined;
    let lastError:
      unknown;

    for (
      let attempt = 1;
      attempt <=
        MAX_CBOSA_TRANSPORT_ATTEMPTS;
      attempt += 1
    ) {
      try {
        response =
          await fetcher(
            url,
            requestInit
          );
        break;
      } catch (error) {
        lastError = error;
        if (
          attempt >=
          MAX_CBOSA_TRANSPORT_ATTEMPTS
        ) {
          throw lastError;
        }
        await sleep(
          500 *
          2 ** (attempt - 1)
        );
      }
    }

    if (!response) {
      throw lastError ??
        new Error(
          "CBOSA_TRANSPORT_FAILED"
        );
    }

    jar = mergeCookies(
      jar,
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
          "CBOSA_REDIRECT_WITHOUT_LOCATION"
        );
      }

      const next =
        new URL(location, url);
      if (
        next.protocol !== "https:" ||
        next.hostname.toLowerCase() !==
          "orzeczenia.nsa.gov.pl"
      ) {
        throw new Error(
          "CBOSA_REDIRECT_HOST_DENIED"
        );
      }

      url = next.toString();
      if (
        response.status === 303 ||
        (
          response.status === 302 &&
          method === "POST"
        )
      ) {
        method = "GET";
        body = undefined;
      }
      continue;
    }

    return {
      response,
      cookies: jar
    };
  }

  throw new Error(
    "CBOSA_REDIRECT_LIMIT_EXCEEDED"
  );
}

function cbosaTotal(
  html: string
): number | undefined {
  const normalized =
    decodeHtml(html);
  const match =
    normalized.match(
      /Znaleziono\s+(\d+)\s+orzecze(?:ń|nia|nie)/iu
    );
  return match?.[1]
    ? Number(match[1])
    : undefined;
}

function cbosaDocIds(
  html: string
): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const regex =
    /href\s*=\s*["']\/doc\/([A-Z0-9]{10})\/?["']/giu;

  for (
    const match of html.matchAll(regex)
  ) {
    const id =
      match[1]?.toUpperCase();
    if (
      id &&
      !seen.has(id)
    ) {
      seen.add(id);
      ids.push(id);
    }
  }

  return ids;
}

function cbosaCaseNumber(
  html: string
): string[] {
  const titleMatch =
    html.match(
      /<title\b[^>]*>([\s\S]*?)<\/title>/iu
    );
  const title =
    titleMatch?.[1]
      ? decodeHtml(titleMatch[1])
      : "";

  const match =
    title.match(
      /^(.+?)\s+-\s+(?:Wyrok|Postanowienie|Uchwała)\b/iu
    );

  return match?.[1]?.trim()
    ? [match[1].trim()]
    : [];
}

function cbosaField(
  html: string,
  label: string
): string | undefined {
  const escaped =
    label.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
  const pattern =
    new RegExp(
      `<td[^>]*class=["'][^"']*lista-label[^"']*["'][^>]*>\\s*${escaped}\\s*<\\/td>[\\s\\S]{0,500}?<td[^>]*class=["'][^"']*info-list-value[^"']*["'][^>]*>([\\s\\S]*?)<\\/td>`,
      "iu"
    );
  const value =
    html.match(pattern)?.[1];
  return value
    ? decodeHtml(value)
    : undefined;
}

function cbosaCandidate(
  id: string,
  html: string
): CaseLawSearchCandidate {
  const judgmentDate =
    cbosaField(
      html,
      "Data orzeczenia"
    );
  const court =
    cbosaField(
      html,
      "Sąd"
    );

  return {
    source: "CBOSA",
    id,
    caseNumbers:
      cbosaCaseNumber(html),
    ...(judgmentDate
      ? { judgmentDate }
      : {}),
    ...(court
      ? { court }
      : {}),
    courtType:
      "ADMINISTRATIVE",
    sourceUrl:
      `https://orzeczenia.nsa.gov.pl/doc/${id}`,
    contentScope:
      "DISCOVERY"
  };
}

export function caseLawSearchEntryUrl(
  source: CaseLawSearchSource
): string {
  return source === "SAOS"
    ? SAOS_ENDPOINT
    : CBOSA_SEARCH;
}

export class CaseLawSearchService {
  constructor(
    private readonly fetcher:
      CaseLawSearchFetch =
        globalThis.fetch.bind(
          globalThis
        )
  ) {}

  async search(
    request: CaseLawSearchRequest
  ): Promise<CaseLawSearchResult> {
    const query =
      request.query
        .normalize("NFKC")
        .replace(/\s+/gu, " ")
        .trim();
    const limit =
      clampLimit(request.limit);

    if (
      query.length < 2 ||
      query.length > 500
    ) {
      return {
        source: request.source,
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "INVALID_SEARCH_QUERY"
      };
    }

    return request.source === "SAOS"
      ? await this.searchSaos(
          query,
          limit
        )
      : await this.searchCbosa(
          query,
          limit
        );
  }

  private async searchSaos(
    query: string,
    limit: number
  ): Promise<CaseLawSearchResult> {
    const url =
      new URL(SAOS_ENDPOINT);
    url.searchParams.set(
      "all",
      query
    );
    url.searchParams.set(
      "pageSize",
      String(
        Math.max(10, limit)
      )
    );
    url.searchParams.set(
      "pageNumber",
      "0"
    );
    url.searchParams.set(
      "sortingField",
      "JUDGMENT_DATE"
    );
    url.searchParams.set(
      "sortingDirection",
      "DESC"
    );

    let response: Response;
    try {
      response =
        await this.fetcher(
          url,
          {
            method: "GET",
            redirect: "error",
            signal:
              AbortSignal.timeout(
                REQUEST_TIMEOUT_MS
              ),
            headers: {
              Accept:
                "application/json",
              "User-Agent":
                USER_AGENT
            }
          }
        );
    } catch {
      return {
        source: "SAOS",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "SAOS_TRANSPORT_FAILED"
      };
    }

    if (!response.ok) {
      return {
        source: "SAOS",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "SAOS_HTTP_" +
          response.status
      };
    }

    let payload: unknown;
    try {
      payload =
        await response.json();
    } catch {
      return {
        source: "SAOS",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "SAOS_JSON_DRIFT"
      };
    }

    const root =
      object(payload);
    if (!root) {
      return {
        source: "SAOS",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "SAOS_SCHEMA_DRIFT"
      };
    }

    const candidates =
      array(root.items)
        .map(saosCandidate)
        .filter(
          (
            item
          ): item is CaseLawSearchCandidate =>
            Boolean(item)
        )
        .slice(0, limit);

    const total =
      saosTotal(root);

    return {
      source: "SAOS",
      status:
        candidates.length
          ? "FOUND"
          : "NOT_FOUND",
      query,
      candidates,
      ...(total !== undefined
        ? { total }
        : {})
    };
  }

  private async searchCbosa(
    query: string,
    limit: number
  ): Promise<CaseLawSearchResult> {
    const form =
      new URLSearchParams({
        wszystkieSlowa:
          query,
        wystepowanie:
          "gdziekolwiek",
        odmiana:
          "on",
        sygnatura:
          "",
        sad:
          "dowolny",
        rodzaj:
          "dowolny",
        symbole:
          "",
        odDaty:
          "",
        doDaty:
          "",
        sedziowie:
          "",
        funkcja:
          "",
        submit:
          "Szukaj"
      });

    let first:
      | {
          response:
            Response;
          cookies:
            string[];
        }
      | undefined;

    try {
      const warmup =
        await fetchCbosa(
          this.fetcher,
          CBOSA_QUERY,
          {
            method: "GET"
          },
          []
        );

      if (!warmup.response.ok) {
        return {
          source: "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          reason:
            "CBOSA_PROBE_HTTP_" +
            warmup.response.status
        };
      }

      first =
        await fetchCbosa(
          this.fetcher,
          CBOSA_SEARCH,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
              Origin:
                "https://orzeczenia.nsa.gov.pl",
              Referer:
                CBOSA_QUERY
            },
            body:
              form.toString()
          },
          warmup.cookies
        );
    } catch {
      return {
        source: "CBOSA",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "CBOSA_TRANSPORT_FAILED"
      };
    }

    if (!first.response.ok) {
      return {
        source: "CBOSA",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "CBOSA_HTTP_" +
          first.response.status
      };
    }

    const firstHtml =
      await first.response.text();

    const total =
      cbosaTotal(firstHtml);
    if (total === undefined) {
      return {
        source: "CBOSA",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        reason:
          "CBOSA_RESULT_COUNT_DRIFT"
      };
    }

    if (total === 0) {
      return {
        source: "CBOSA",
        status:
          "NOT_FOUND",
        query,
        candidates: [],
        total: 0
      };
    }

    const ids: string[] = [];
    const seen =
      new Set<string>();
    const collect =
      (html: string) => {
        for (
          const id
          of cbosaDocIds(html)
        ) {
          if (!seen.has(id)) {
            seen.add(id);
            ids.push(id);
          }
        }
      };

    collect(firstHtml);

    const needed =
      Math.min(
        total,
        limit
      );
    let page = 2;

    while (
      ids.length < needed
    ) {
      if (
        page > 25 ||
        (
          page - 1
        ) * CBOSA_PAGE_SIZE >
          total + CBOSA_PAGE_SIZE
      ) {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_PAGINATION_LIMIT"
        };
      }

      let next:
        | {
            response:
              Response;
            cookies:
              string[];
          }
        | undefined;
      try {
        next =
          await fetchCbosa(
            this.fetcher,
            `https://orzeczenia.nsa.gov.pl/cbo/find?p=${page}`,
            {
              method:
                "GET"
            },
            first.cookies
          );
      } catch {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_PAGINATION_TRANSPORT_FAILED"
        };
      }

      if (!next.response.ok) {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_PAGINATION_HTTP_" +
            next.response.status
        };
      }

      const html =
        await next.response.text();
      const before =
        ids.length;
      collect(html);
      if (
        ids.length === before
      ) {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_PAGINATION_STALLED"
        };
      }
      page += 1;
    }

    if (!ids.length) {
      return {
        source: "CBOSA",
        status:
          "OUT_OF_SCOPE",
        query,
        candidates: [],
        total,
        reason:
          "CBOSA_RESULT_LINK_DRIFT"
      };
    }

    const candidates:
      CaseLawSearchCandidate[] = [];

    for (
      const id
      of ids.slice(0, needed)
    ) {
      let document:
        | {
            response:
              Response;
            cookies:
              string[];
          }
        | undefined;
      try {
        document =
          await fetchCbosa(
            this.fetcher,
            `https://orzeczenia.nsa.gov.pl/doc/${id}`,
            {
              method:
                "GET"
            },
            first.cookies
          );
      } catch {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_DOCUMENT_TRANSPORT_FAILED"
        };
      }

      if (!document.response.ok) {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_DOCUMENT_HTTP_" +
            document.response.status
        };
      }

      const html =
        await document.response.text();
      const caseNumbers =
        cbosaCaseNumber(html);
      if (!caseNumbers.length) {
        return {
          source:
            "CBOSA",
          status:
            "OUT_OF_SCOPE",
          query,
          candidates: [],
          total,
          reason:
            "CBOSA_DOCUMENT_SCHEMA_DRIFT"
        };
      }

      candidates.push(
        cbosaCandidate(
          id,
          html
        )
      );
    }

    return {
      source: "CBOSA",
      status:
        candidates.length
          ? "FOUND"
          : "NOT_FOUND",
      query,
      candidates,
      total
    };
  }
}

import {
  createHash
} from "node:crypto";
import {
  lookup as dnsLookup
} from "node:dns/promises";
import https from "node:https";
import {
  isIP
} from "node:net";

const DEFAULT_TIMEOUT_MS =
  12_000;
const DEFAULT_MAX_BYTES =
  1_500_000;
const DEFAULT_MAX_REDIRECTS =
  3;
const DEFAULT_MAX_TEXT_CHARS =
  250_000;

const ALLOWED_CONTENT_TYPES = [
  "text/html",
  "application/xhtml+xml",
  "text/plain",
  "application/json",
  "application/xml",
  "text/xml"
] as const;

const REDIRECT_STATUSES =
  new Set([
    301,
    302,
    303,
    307,
    308
  ]);

export type AuxiliaryDnsAddress = {
  address: string;
  family:
    | 4
    | 6;
};

export type AuxiliaryDnsResolver = (
  hostname: string
) => Promise<
  AuxiliaryDnsAddress[]
>;

export type AuxiliaryResolvedTarget = {
  url: URL;
  address: string;
  family:
    | 4
    | 6;
};

export type AuxiliaryTransportResponse = {
  statusCode: number;
  contentType?: string;
  location?: string;
  body: Uint8Array;
};

export type AuxiliaryTransport = (
  target:
    AuxiliaryResolvedTarget,
  options: {
    timeoutMs: number;
    maxBytes: number;
  }
) => Promise<
  AuxiliaryTransportResponse
>;

export type AuxiliarySourceFetchResult = {
  requestedUrl: string;
  finalUrl: string;
  contentType: string;
  bytes: number;
  sha256: string;
  fetchedAt: string;
  text: string;
  publishedAt?: string;
  updatedAt?: string;
  redirectCount: number;
};

export class AuxiliarySourceFetchError
  extends Error {
  constructor(
    message: string,
    readonly code:
      | "AUX_SOURCE_URL_INVALID"
      | "AUX_SOURCE_HOST_FORBIDDEN"
      | "AUX_SOURCE_DNS_FAILED"
      | "AUX_SOURCE_DNS_PRIVATE"
      | "AUX_SOURCE_REDIRECT_LIMIT"
      | "AUX_SOURCE_REDIRECT_INVALID"
      | "AUX_SOURCE_TIMEOUT"
      | "AUX_SOURCE_HTTP_FAILED"
      | "AUX_SOURCE_TOO_LARGE"
      | "AUX_SOURCE_CONTENT_TYPE_UNSUPPORTED"
      | "AUX_SOURCE_EMPTY"
  ) {
    super(message);
    this.name =
      "AuxiliarySourceFetchError";
  }
}

function ipv4Octets(
  address: string
): number[] | null {
  const parts =
    address.split(".");
  if (
    parts.length !== 4
  ) {
    return null;
  }
  const octets =
    parts.map(
      (part) =>
        Number(part)
    );
  if (
    octets.some(
      (value) =>
        !Number.isInteger(
          value
        ) ||
        value < 0 ||
        value > 255
    )
  ) {
    return null;
  }
  return octets;
}

export function isPublicInternetAddress(
  address: string
): boolean {
  const family =
    isIP(address);

  if (family === 4) {
    const octets =
      ipv4Octets(
        address
      );
    if (!octets) {
      return false;
    }
    const [
      a = 0,
      b = 0,
      c = 0
    ] = octets;

    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (
        a === 100 &&
        b >= 64 &&
        b <= 127
      ) ||
      (
        a === 169 &&
        b === 254
      ) ||
      (
        a === 172 &&
        b >= 16 &&
        b <= 31
      ) ||
      (
        a === 192 &&
        b === 0 &&
        c === 0
      ) ||
      (
        a === 192 &&
        b === 168
      ) ||
      (
        a === 192 &&
        b === 0 &&
        c === 2
      ) ||
      (
        a === 198 &&
        (
          b === 18 ||
          b === 19
        )
      ) ||
      (
        a === 198 &&
        b === 51 &&
        c === 100
      ) ||
      (
        a === 203 &&
        b === 0 &&
        c === 113
      ) ||
      a >= 224
    ) {
      return false;
    }

    return true;
  }

  if (family === 6) {
    const lower =
      address.toLocaleLowerCase(
        "en"
      );

    // Conservative public IPv6 gate: currently routable global
    // unicast is within 2000::/3. This also excludes loopback,
    // unspecified, ULA, link-local, multicast and IPv4-mapped forms.
    if (
      !lower.startsWith("2") &&
      !lower.startsWith("3")
    ) {
      return false;
    }

    if (
      lower.startsWith(
        "2001:db8:"
      ) ||
      lower ===
        "2001:db8::"
    ) {
      return false;
    }

    return true;
  }

  return false;
}

function forbiddenHostname(
  hostname: string
): boolean {
  const lower =
    hostname
      .toLocaleLowerCase(
        "en"
      )
      .replace(/\.$/u, "");

  return (
    lower === "localhost" ||
    lower.endsWith(
      ".localhost"
    ) ||
    lower.endsWith(
      ".local"
    ) ||
    lower.endsWith(
      ".internal"
    ) ||
    lower.endsWith(
      ".home"
    ) ||
    isIP(lower) !== 0
  );
}

export function parseAuxiliarySourceUrl(
  raw: string
): URL {
  let url: URL;
  try {
    url =
      new URL(raw);
  } catch {
    throw new AuxiliarySourceFetchError(
      "Auxiliary source URL is invalid.",
      "AUX_SOURCE_URL_INVALID"
    );
  }

  if (
    url.protocol !==
      "https:" ||
    url.username ||
    url.password ||
    (
      url.port &&
      url.port !== "443"
    ) ||
    !url.hostname ||
    forbiddenHostname(
      url.hostname
    )
  ) {
    throw new AuxiliarySourceFetchError(
      "Auxiliary source requires credential-free public HTTPS on port 443 and a DNS hostname.",
      "AUX_SOURCE_HOST_FORBIDDEN"
    );
  }

  return url;
}

async function defaultResolver(
  hostname: string
): Promise<
  AuxiliaryDnsAddress[]
> {
  try {
    const values =
      await dnsLookup(
        hostname,
        {
          all: true,
          verbatim: true
        }
      );

    return values
      .filter(
        (
          value
        ): value is {
          address: string;
          family: 4 | 6;
        } =>
          value.family ===
            4 ||
          value.family ===
            6
      )
      .map(
        (value) => ({
          address:
            value.address,
          family:
            value.family
        })
      );
  } catch {
    throw new AuxiliarySourceFetchError(
      "Auxiliary source DNS lookup failed.",
      "AUX_SOURCE_DNS_FAILED"
    );
  }
}

export async function resolveAuxiliarySourceTarget(
  raw: string,
  resolver:
    AuxiliaryDnsResolver =
      defaultResolver
): Promise<
  AuxiliaryResolvedTarget
> {
  const url =
    parseAuxiliarySourceUrl(
      raw
    );

  let addresses:
    AuxiliaryDnsAddress[];
  try {
    addresses =
      await resolver(
        url.hostname
      );
  } catch (error) {
    if (
      error instanceof
        AuxiliarySourceFetchError
    ) {
      throw error;
    }
    throw new AuxiliarySourceFetchError(
      "Auxiliary source DNS lookup failed.",
      "AUX_SOURCE_DNS_FAILED"
    );
  }

  if (
    addresses.length === 0
  ) {
    throw new AuxiliarySourceFetchError(
      "Auxiliary source DNS returned no addresses.",
      "AUX_SOURCE_DNS_FAILED"
    );
  }

  if (
    addresses.some(
      (entry) =>
        !isPublicInternetAddress(
          entry.address
        )
    )
  ) {
    throw new AuxiliarySourceFetchError(
      "Auxiliary source DNS resolved to a non-public address.",
      "AUX_SOURCE_DNS_PRIVATE"
    );
  }

  // Pin the selected public address into the actual HTTPS connection.
  // Re-resolution is performed for every redirect.
  const selected =
    addresses[0]!;

  return {
    url,
    address:
      selected.address,
    family:
      selected.family
  };
}

function headerString(
  value:
    | string
    | string[]
    | undefined
): string | undefined {
  if (
    Array.isArray(value)
  ) {
    return value[0];
  }
  return value;
}

const defaultTransport:
  AuxiliaryTransport =
    async (
      target,
      options
    ) =>
      await new Promise(
        (
          resolve,
          reject
        ) => {
          let settled =
            false;

          const fail = (
            error:
              unknown
          ) => {
            if (settled) {
              return;
            }
            settled = true;
            reject(error);
          };

          const request =
            https.request(
              {
                protocol:
                  "https:",
                hostname:
                  target.address,
                family:
                  target.family,
                port: 443,
                method: "GET",
                path:
                  target.url
                    .pathname +
                  target.url
                    .search,
                servername:
                  target.url
                    .hostname,
                rejectUnauthorized:
                  true,
                headers: {
                  Host:
                    target.url
                      .hostname,
                  Accept:
                    "text/html,application/xhtml+xml,text/plain,application/json,application/xml,text/xml;q=0.9,*/*;q=0.1",
                  "Accept-Encoding":
                    "identity",
                  "User-Agent":
                    "Lex-Machina/0.1.7 AuxiliaryLegalResearch"
                }
              },
              (response) => {
                const chunks:
                  Buffer[] =
                  [];
                let bytes = 0;

                response.on(
                  "data",
                  (
                    chunk:
                      Buffer
                  ) => {
                    bytes +=
                      chunk.length;
                    if (
                      bytes >
                      options
                        .maxBytes
                    ) {
                      response.destroy();
                      request.destroy();
                      fail(
                        new AuxiliarySourceFetchError(
                          "Auxiliary source exceeded the response byte limit.",
                          "AUX_SOURCE_TOO_LARGE"
                        )
                      );
                      return;
                    }
                    chunks.push(
                      chunk
                    );
                  }
                );

                response.on(
                  "error",
                  fail
                );

                response.on(
                  "end",
                  () => {
                    if (settled) {
                      return;
                    }
                    settled =
                      true;
                    resolve({
                      statusCode:
                        response
                          .statusCode ??
                        0,
                      ...(headerString(
                        response
                          .headers[
                          "content-type"
                        ]
                      )
                        ? {
                            contentType:
                              headerString(
                                response
                                  .headers[
                                  "content-type"
                                ]
                              )!
                          }
                        : {}),
                      ...(headerString(
                        response
                          .headers
                          .location
                      )
                        ? {
                            location:
                              headerString(
                                response
                                  .headers
                                  .location
                              )!
                          }
                        : {}),
                      body:
                        Buffer.concat(
                          chunks
                        )
                    });
                  }
                );
              }
            );

          request.setTimeout(
            options.timeoutMs,
            () => {
              request.destroy();
              fail(
                new AuxiliarySourceFetchError(
                  "Auxiliary source request timed out.",
                  "AUX_SOURCE_TIMEOUT"
                )
              );
            }
          );

          request.on(
            "error",
            (error) => {
              if (settled) {
                return;
              }
              fail(
                error instanceof
                  AuxiliarySourceFetchError
                  ? error
                  : new AuxiliarySourceFetchError(
                      "Auxiliary source HTTPS request failed.",
                      "AUX_SOURCE_HTTP_FAILED"
                    )
              );
            }
          );

          request.end();
        }
      );

function supportedContentType(
  value: string
): boolean {
  const normalized =
    value
      .split(";")[0]
      ?.trim()
      .toLocaleLowerCase(
        "en"
      ) ??
    "";

  return ALLOWED_CONTENT_TYPES
    .includes(
      normalized as
        (typeof ALLOWED_CONTENT_TYPES)[number]
    );
}

function decodeEntities(
  value: string
): string {
  return value
    .replace(
      /&nbsp;|&#160;/giu,
      " "
    )
    .replace(
      /&amp;/giu,
      "&"
    )
    .replace(
      /&lt;/giu,
      "<"
    )
    .replace(
      /&gt;/giu,
      ">"
    )
    .replace(
      /&quot;/giu,
      "\""
    )
    .replace(
      /&#39;|&apos;/giu,
      "'"
    );
}

function textFromBody(
  body: Uint8Array,
  contentType: string,
  maxChars: number
): string {
  const raw =
    Buffer.from(
      body
    ).toString(
      "utf8"
    );

  if (
    contentType
      .toLocaleLowerCase(
        "en"
      )
      .includes(
        "html"
      )
  ) {
    return decodeEntities(
      raw
        .replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/giu,
          " "
        )
        .replace(
          /<style\b[^>]*>[\s\S]*?<\/style>/giu,
          " "
        )
        .replace(
          /<\s*(?:br\b[^>]*|\/?(?:p|div|li|tr|td|th|h[1-6]|section|article|main|header|footer)\b[^>]*)>/giu,
          "\n"
        )
        .replace(
          /<[^>]+>/gu,
          " "
        )
    )
      .normalize(
        "NFKC"
      )
      .replace(
        /[ \t\f\v]+/gu,
        " "
      )
      .replace(
        / *\n */gu,
        "\n"
      )
      .replace(
        /\n{3,}/gu,
        "\n\n"
      )
      .trim()
      .slice(
        0,
        maxChars
      );
  }

  return raw
    .normalize(
      "NFKC"
    )
    .trim()
    .slice(
      0,
      maxChars
    );
}

function normalizedDate(
  value:
    string | undefined
): string | undefined {
  if (!value) {
    return undefined;
  }
  const candidate =
    value.trim();
  const parsed =
    new Date(candidate);
  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return undefined;
  }
  return parsed
    .toISOString()
    .slice(0, 10);
}

function firstMatch(
  html: string,
  expressions:
    RegExp[]
): string | undefined {
  for (
    const expression
    of expressions
  ) {
    const match =
      expression.exec(
        html
      );
    const value =
      match?.[1];
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function extractAuxiliarySourceDates(
  body: Uint8Array,
  contentType: string
): {
  publishedAt?: string;
  updatedAt?: string;
} {
  if (
    !contentType
      .toLocaleLowerCase(
        "en"
      )
      .includes(
        "html"
      )
  ) {
    return {};
  }

  const html =
    Buffer.from(
      body
    )
      .toString(
        "utf8"
      )
      .slice(
        0,
        500_000
      );

  const publishedAt =
    normalizedDate(
      firstMatch(
        html,
        [
          /<meta[^>]+(?:property|name)=["']article:published_time["'][^>]+content=["']([^"']+)["'][^>]*>/iu,
          /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']article:published_time["'][^>]*>/iu,
          /"datePublished"\s*:\s*"([^"]+)"/iu
        ]
      )
    );

  const updatedAt =
    normalizedDate(
      firstMatch(
        html,
        [
          /<meta[^>]+(?:property|name)=["']article:modified_time["'][^>]+content=["']([^"']+)["'][^>]*>/iu,
          /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']article:modified_time["'][^>]*>/iu,
          /"dateModified"\s*:\s*"([^"]+)"/iu
        ]
      )
    );

  return {
    ...(publishedAt
      ? {
          publishedAt
        }
      : {}),
    ...(updatedAt
      ? {
          updatedAt
        }
      : {})
  };
}

export class SafeAuxiliarySourceFetcher {
  constructor(
    private readonly resolver:
      AuxiliaryDnsResolver =
        defaultResolver,
    private readonly transport:
      AuxiliaryTransport =
        defaultTransport,
    private readonly now:
      () => string =
        () =>
          new Date()
            .toISOString(),
    private readonly limits: {
      timeoutMs: number;
      maxBytes: number;
      maxRedirects: number;
      maxTextChars: number;
    } = {
      timeoutMs:
        DEFAULT_TIMEOUT_MS,
      maxBytes:
        DEFAULT_MAX_BYTES,
      maxRedirects:
        DEFAULT_MAX_REDIRECTS,
      maxTextChars:
        DEFAULT_MAX_TEXT_CHARS
    }
  ) {}

  async fetch(
    rawUrl: string
  ): Promise<
    AuxiliarySourceFetchResult
  > {
    const requested =
      parseAuxiliarySourceUrl(
        rawUrl
      )
        .toString();
    let current =
      requested;
    let redirectCount =
      0;

    while (true) {
      const target =
        await resolveAuxiliarySourceTarget(
          current,
          this.resolver
        );
      const response =
        await this.transport(
          target,
          {
            timeoutMs:
              this.limits
                .timeoutMs,
            maxBytes:
              this.limits
                .maxBytes
          }
        );

      if (
        REDIRECT_STATUSES.has(
          response.statusCode
        )
      ) {
        if (
          !response.location
        ) {
          throw new AuxiliarySourceFetchError(
            "Auxiliary source redirect is missing Location.",
            "AUX_SOURCE_REDIRECT_INVALID"
          );
        }
        if (
          redirectCount >=
          this.limits
            .maxRedirects
        ) {
          throw new AuxiliarySourceFetchError(
            "Auxiliary source exceeded the redirect limit.",
            "AUX_SOURCE_REDIRECT_LIMIT"
          );
        }

        let redirected:
          URL;
        try {
          redirected =
            new URL(
              response.location,
              target.url
            );
        } catch {
          throw new AuxiliarySourceFetchError(
            "Auxiliary source redirect URL is invalid.",
            "AUX_SOURCE_REDIRECT_INVALID"
          );
        }

        current =
          parseAuxiliarySourceUrl(
            redirected
              .toString()
          )
            .toString();
        redirectCount +=
          1;
        continue;
      }

      if (
        response.statusCode <
          200 ||
        response.statusCode >=
          300
      ) {
        throw new AuxiliarySourceFetchError(
          "Auxiliary source returned HTTP " +
            response.statusCode +
            ".",
          "AUX_SOURCE_HTTP_FAILED"
        );
      }

      if (
        response.body
          .byteLength >
        this.limits.maxBytes
      ) {
        throw new AuxiliarySourceFetchError(
          "Auxiliary source exceeded the response byte limit.",
          "AUX_SOURCE_TOO_LARGE"
        );
      }

      const contentType =
        response
          .contentType
          ?.trim();
      if (
        !contentType ||
        !supportedContentType(
          contentType
        )
      ) {
        throw new AuxiliarySourceFetchError(
          "Auxiliary source content type is not allowed for research retrieval.",
          "AUX_SOURCE_CONTENT_TYPE_UNSUPPORTED"
        );
      }

      const text =
        textFromBody(
          response.body,
          contentType,
          this.limits
            .maxTextChars
        );
      if (!text) {
        throw new AuxiliarySourceFetchError(
          "Auxiliary source returned no readable text.",
          "AUX_SOURCE_EMPTY"
        );
      }

      const dates =
        extractAuxiliarySourceDates(
          response.body,
          contentType
        );

      return {
        requestedUrl:
          requested,
        finalUrl:
          target.url
            .toString(),
        contentType,
        bytes:
          response.body
            .byteLength,
        sha256:
          createHash(
            "sha256"
          )
            .update(
              response.body
            )
            .digest(
              "hex"
            ),
        fetchedAt:
          this.now(),
        text,
        ...dates,
        redirectCount
      };
    }
  }
}

import {
  Server
} from "@modelcontextprotocol/sdk/server/index.js";
import {
  StdioServerTransport
} from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const BASE =
  "https://orzeczenia.uodo.gov.pl/api";

const SEARCH_FIELDS =
  "id,refid,refname,name,title,dates";

type AnyRecord =
  Record<string, unknown>;

function asRecord(
  value: unknown
): AnyRecord {
  return value &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
    ? value as AnyRecord
    : {};
}

function textResult(
  value: unknown
) {
  return {
    content: [
      {
        type:
          "text" as const,
        text:
          typeof value ===
            "string"
            ? value
            : JSON.stringify(
                value
              )
      }
    ]
  };
}

async function fetchJson(
  url: string
): Promise<unknown> {
  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            "application/json",
          "User-Agent":
            "Lex-Machina/0.1.6 UODO-MCP-Fallback"
        },
        signal:
          AbortSignal.timeout(
            30_000
          )
      }
    );
  if (!response.ok) {
    throw new Error(
      "UODO_HTTP_" +
        response.status
    );
  }
  return response.json();
}

async function fetchText(
  url: string
): Promise<string> {
  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            "text/html,application/xml,text/xml;q=0.9,*/*;q=0.5",
          "User-Agent":
            "Lex-Machina/0.1.6 UODO-MCP-Fallback"
        },
        signal:
          AbortSignal.timeout(
            30_000
          )
      }
    );
  if (!response.ok) {
    throw new Error(
      "UODO_HTTP_" +
        response.status
    );
  }
  return response.text();
}

function recentUrl():
  string {
  return (
    BASE +
    "/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo" +
    "?order=-id&fields=" +
    encodeURIComponent(
      SEARCH_FIELDS
    )
  );
}

function rowsFrom(
  value: unknown
): AnyRecord[] {
  if (
    Array.isArray(value)
  ) {
    return value.filter(
      (item) =>
        item &&
        typeof item ===
          "object"
    ) as AnyRecord[];
  }

  const record =
    asRecord(value);
  for (
    const key
    of [
      "items",
      "results",
      "data",
      "documents"
    ]
  ) {
    const candidate =
      record[key];
    if (
      Array.isArray(
        candidate
      )
    ) {
      return candidate.filter(
        (item) =>
          item &&
          typeof item ===
            "object"
      ) as AnyRecord[];
    }
  }
  return [];
}

function signatureToUrn(
  signature: string
): string | null {
  const normalized =
    signature
      .trim()
      .replace(
        /\s+/g,
        ""
      );
  const match =
    normalized.match(
      /^([A-Za-z]+(?:\.[0-9A-Za-z]+)+)\.(20\d{2})$/
    );
  if (!match) {
    return null;
  }
  return (
    "urn:ndoc:gov:pl:uodo:" +
    match[2] +
    ":" +
    match[1]!
      .toLowerCase()
      .replaceAll(
        ".",
        "_"
      )
  );
}

async function recent(
  limit = 20
): Promise<AnyRecord[]> {
  const raw =
    await fetchJson(
      recentUrl()
    );
  return rowsFrom(
    raw
  ).slice(
    0,
    Math.max(
      1,
      Math.min(
        100,
        limit
      )
    )
  );
}

async function documentByReference(
  raw:
    string
): Promise<unknown> {
  const value =
    raw.trim();

  if (
    value.startsWith(
      "PublicDocument-"
    )
  ) {
    const encoded =
      encodeURIComponent(
        value
      );
    const [
      meta,
      body
    ] =
      await Promise.all([
        fetchJson(
          BASE +
            "/documents/events/" +
            encoded
        ),
        fetchText(
          BASE +
            "/documents/events/" +
            encoded +
            "/000_pl.xml"
        )
      ]);
    return {
      source:
        "UODO_OFFICIAL_API",
      id:
        value,
      meta,
      body
    };
  }

  const urn =
    value.startsWith(
      "urn:ndoc:gov:pl:uodo:"
    )
      ? value
      : signatureToUrn(
          value
        );

  if (!urn) {
    const candidates =
      await recent(
        100
      );
    const needle =
      value.toLowerCase();
    const found =
      candidates.find(
        (item) =>
          JSON.stringify(
            item
          )
            .toLowerCase()
            .includes(
              needle
            )
      );
    const refid =
      typeof found?.refid ===
        "string"
        ? found.refid
        : undefined;
    if (!refid) {
      throw new Error(
        "UODO_DOCUMENT_NOT_FOUND_IN_RECENT_INDEX"
      );
    }
    return documentByReference(
      refid
    );
  }

  const encoded =
    encodeURIComponent(
      urn
    );
  const [
    meta,
    title,
    body
  ] =
    await Promise.all([
      fetchJson(
        BASE +
          "/documents/public/items/" +
          encoded +
          "/meta.json"
      ),
      fetchJson(
        BASE +
          "/documents/public/items/" +
          encoded +
          "/title.json"
      ),
      fetchText(
        BASE +
          "/documents/public/items/" +
          encoded +
          ":0/body.html"
      )
    ]);

  return {
    source:
      "UODO_OFFICIAL_API",
    refid:
      urn,
    meta,
    title,
    body
  };
}

async function keywordSearch(
  query: string,
  limit: number
): Promise<unknown> {
  const needle =
    query
      .trim()
      .toLowerCase();
  const items =
    await recent(
      100
    );

  if (!needle) {
    return {
      source:
        "UODO_OFFICIAL_API",
      scope:
        "RECENT_1Y",
      items:
        items.slice(
          0,
          limit
        )
    };
  }

  const metadataMatches =
    items.filter(
      (item) =>
        JSON.stringify(
          item
        )
          .toLowerCase()
          .includes(
            needle
          )
    );

  if (
    metadataMatches
      .length >=
      limit
  ) {
    return {
      source:
        "UODO_OFFICIAL_API",
      scope:
        "RECENT_1Y_METADATA",
      items:
        metadataMatches.slice(
          0,
          limit
        )
    };
  }

  const bodyMatches:
    unknown[] = [
      ...metadataMatches
    ];
  const seen =
    new Set(
      metadataMatches.map(
        (item) =>
          String(
            item.refid ??
            item.id ??
            ""
          )
      )
    );

  for (
    const item
    of items.slice(
      0,
      30
    )
  ) {
    const ref =
      typeof item.refid ===
        "string"
        ? item.refid
        : typeof item.id ===
            "string"
          ? item.id
          : "";
    if (
      !ref ||
      seen.has(
        ref
      )
    ) {
      continue;
    }
    try {
      const doc =
        await documentByReference(
          ref
        );
      if (
        JSON.stringify(
          doc
        )
          .toLowerCase()
          .includes(
            needle
          )
      ) {
        bodyMatches.push(
          doc
        );
      }
    } catch {
      // One malformed/removed decision must not poison the bounded search.
    }
    if (
      bodyMatches.length >=
      limit
    ) {
      break;
    }
  }

  return {
    source:
      "UODO_OFFICIAL_API",
    scope:
      "RECENT_1Y_BOUNDED_BODY_SCAN",
    warning:
      "Fallback searches the official UODO API over a bounded recent window; a zero result is not proof of non-existence.",
    items:
      bodyMatches.slice(
        0,
        limit
      )
  };
}

const tools = [
  {
    name:
      "uodo_search",
    description:
      "Search recent UODO decisions through the official orzeczenia.uodo.gov.pl API fallback.",
    inputSchema: {
      type:
        "object",
      properties: {
        keyword: {
          type:
            "string"
        },
        date_from: {
          type:
            "string"
        },
        date_to: {
          type:
            "string"
        },
        page: {
          type:
            "integer",
          minimum: 1
        },
        size: {
          type:
            "integer",
          minimum: 1,
          maximum: 50
        }
      }
    }
  },
  {
    name:
      "uodo_get_decision",
    description:
      "Get a UODO decision by PublicDocument id, UODO URN or signature.",
    inputSchema: {
      type:
        "object",
      required: [
        "urn_or_signature"
      ],
      properties: {
        urn_or_signature: {
          type:
            "string"
        }
      }
    }
  },
  {
    name:
      "uodo_recent",
    description:
      "List recent UODO decisions from the official API.",
    inputSchema: {
      type:
        "object",
      properties: {
        limit: {
          type:
            "integer",
          minimum: 1,
          maximum: 100
        }
      }
    }
  },
  {
    name:
      "uodo_by_gdpr_article",
    description:
      "Bounded official-API search for recent UODO decisions mentioning a GDPR article.",
    inputSchema: {
      type:
        "object",
      required: [
        "article"
      ],
      properties: {
        article: {
          type: [
            "string",
            "number"
          ]
        },
        limit: {
          type:
            "integer",
          minimum: 1,
          maximum: 25
        }
      }
    }
  },
  {
    name:
      "uodo_stats",
    description:
      "Return bounded recent UODO decision counts from the official API fallback.",
    inputSchema: {
      type:
        "object",
      properties: {
        period_from: {
          type:
            "string"
        },
        period_to: {
          type:
            "string"
        }
      }
    }
  }
];

const server =
  new Server(
    {
      name:
        "lex-machina-uodo-fallback",
      version:
        "0.1.6"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools
  })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    const name =
      request.params.name;
    const args =
      asRecord(
        request.params
          .arguments
      );

    if (
      name ===
        "uodo_recent"
    ) {
      const limit =
        Number.isInteger(
          args.limit
        )
          ? Number(
              args.limit
            )
          : 20;
      return textResult(
        {
          source:
            "UODO_OFFICIAL_API",
          fallbackFor:
            "uodo-orzeczenia-mcp",
          items:
            await recent(
              limit
            )
        }
      );
    }

    if (
      name ===
        "uodo_get_decision"
    ) {
      const ref =
        typeof args
          .urn_or_signature ===
          "string"
          ? args
              .urn_or_signature
          : "";
      if (!ref) {
        throw new Error(
          "UODO_REFERENCE_REQUIRED"
        );
      }
      return textResult(
        await documentByReference(
          ref
        )
      );
    }

    if (
      name ===
        "uodo_search"
    ) {
      const keyword =
        typeof args.keyword ===
          "string"
          ? args.keyword
          : "";
      const size =
        Number.isInteger(
          args.size
        )
          ? Math.max(
              1,
              Math.min(
                50,
                Number(
                  args.size
                )
              )
            )
          : 20;
      return textResult(
        await keywordSearch(
          keyword,
          size
        )
      );
    }

    if (
      name ===
        "uodo_by_gdpr_article"
    ) {
      const article =
        String(
          args.article ??
          ""
        ).trim();
      if (!article) {
        throw new Error(
          "UODO_GDPR_ARTICLE_REQUIRED"
        );
      }
      const limit =
        Number.isInteger(
          args.limit
        )
          ? Math.max(
              1,
              Math.min(
                25,
                Number(
                  args.limit
                )
              )
            )
          : 10;
      return textResult(
        await keywordSearch(
          "art. " +
            article,
          limit
        )
      );
    }

    if (
      name ===
        "uodo_stats"
    ) {
      const items =
        await recent(
          100
        );
      return textResult({
        source:
          "UODO_OFFICIAL_API",
        scope:
          "RECENT_1Y",
        count:
          items.length,
        requestedPeriod: {
          from:
            args.period_from ??
            null,
          to:
            args.period_to ??
            null
        },
        warning:
          "Fallback statistics describe the bounded official-API recent window and are not a complete historical aggregate."
      });
    }

    throw new Error(
      "UODO_UNKNOWN_TOOL:" +
        name
    );
  }
);

await server.connect(
  new StdioServerTransport()
);

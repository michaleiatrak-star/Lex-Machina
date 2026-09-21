import fs from "node:fs";
import path from "node:path";
import {
  Client
} from "@modelcontextprotocol/sdk/client/index.js";
import {
  StdioClientTransport
} from "@modelcontextprotocol/sdk/client/stdio.js";
import type {
  NormalizedToolCall,
  NormalizedToolResult,
  NormalizedToolSchema
} from "./providers/types.js";

/**
 * MateMatic legal MCP fleet adapter.
 *
 * Registry semantics are intentionally aligned with:
 * https://github.com/matematicsolutions/prawo-pl-mcp
 * (Apache-2.0). Lex Machina keeps the integration layer separate from its
 * authoritative legal-verification ledger: MCP is retrieval/discovery, while
 * final Polish statutory citations still pass verify_legal_reference.
 */

export type LegalMcpSourceId =
  | "saos"
  | "nsa"
  | "isap"
  | "krs"
  | "eureka"
  | "kio"
  | "uodo"
  | "eu-sparql"
  | "eu-compliance"
  | "legalize";

type SearchSpec = {
  tool: string;
  queryParam?: string;
  dateFromParam?: string;
  dateToParam?: string;
  pageParam?: string;
  pageBase?: 0 | 1;
  sizeParam?: string;
  sizeMin?: number;
  sizeMax?: number;
  requiredExtra?: string[];
};

type GetSpec = {
  tool: string;
  idParam: string;
  pageParam?: string;
  requiredExtra?: string[];
};

type SourceSpec = {
  id: LegalMcpSourceId;
  name: string;
  group: "pl" | "eu";
  coverage: string;
  runtime: "npx" | "uvx";
  packageName: string;
  pinnedVersion?: string;
  search?: SearchSpec;
  get: GetSpec;
  nativeTools: string[];
  notes?: string;
};

export type LegalMcpAuditEvent = {
  tool: string;
  source?: LegalMcpSourceId;
  nativeTool?: string;
  decision: "ALLOW" | "BLOCK";
  detail?: Record<string, unknown>;
};

type McpClientLike = {
  listTools(): Promise<unknown>;
  callTool(input: {
    name: string;
    arguments?: Record<string, unknown>;
  }): Promise<unknown>;
  close?(): Promise<void>;
};

type ClientFactory = (
  source: SourceSpec
) => Promise<McpClientLike>;

const SOURCES: Record<
  LegalMcpSourceId,
  SourceSpec
> = {
  saos: {
    id: "saos",
    name:
      "SAOS — sądy powszechne, SN, TK i citator",
    group: "pl",
    coverage:
      "Orzecznictwo z SAOS. Źródło discovery/support; dla SN finalne powołanie nadal przechodzi natywny verifier Lex Machina.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-saos",
    pinnedVersion: "1.2.0",
    search: {
      tool: "search",
      queryParam: "all",
      dateFromParam: "dateFrom",
      dateToParam: "dateTo",
      pageParam: "pageNumber",
      pageBase: 0,
      sizeParam: "pageSize",
      sizeMin: 10,
      sizeMax: 100
    },
    get: {
      tool: "get_judgment",
      idParam: "id"
    },
    nativeTools: [
      "search",
      "get_judgment",
      "search_by_case",
      "saos_cite_check"
    ]
  },
  nsa: {
    id: "nsa",
    name:
      "CBOSA — NSA i 16 WSA",
    group: "pl",
    coverage:
      "Orzecznictwo sądów administracyjnych przez konektor CBOSA.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-nsa",
    pinnedVersion: "1.3.0",
    search: {
      tool: "search",
      queryParam: "query",
      dateFromParam: "dateFrom",
      dateToParam: "dateTo",
      pageParam: "pageNumber",
      pageBase: 1
    },
    get: {
      tool: "get_judgment",
      idParam: "doc_id"
    },
    nativeTools: [
      "search",
      "get_judgment",
      "search_by_case"
    ]
  },
  isap: {
    id: "isap",
    name:
      "Sejm ELI / ISAP — Dz.U. i M.P.",
    group: "pl",
    coverage:
      "Akty prawne z oficjalnego API ELI Sejmu. MCP pomaga znaleźć/pobrać akt, ale finalne cytowanie prawa polskiego musi przejść verify_legal_reference.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-isap",
    pinnedVersion: "1.3.0",
    search: {
      tool: "search_acts",
      queryParam: "title",
      sizeParam: "limit",
      sizeMax: 50
    },
    get: {
      tool: "get_act_text",
      idParam: "eli",
      pageParam: "page"
    },
    nativeTools: [
      "search_acts",
      "get_act",
      "get_act_text"
    ],
    notes:
      "Tekst bazowego aktu może być historycznym tekstem ogłoszonym; aktualność rozstrzyga natywny resolver/freshness gate Lex Machina."
  },
  krs: {
    id: "krs",
    name:
      "KRS — rejestr przedsiębiorców",
    group: "pl",
    coverage:
      "Dane podmiotów i reprezentacji z API Ministerstwa Sprawiedliwości.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-krs",
    pinnedVersion: "1.1.1",
    get: {
      tool: "get_entity",
      idParam: "krs"
    },
    nativeTools: [
      "get_entity",
      "get_entity_full",
      "get_board"
    ]
  },
  eureka: {
    id: "eureka",
    name:
      "EUREKA — interpretacje KIS/MF",
    group: "pl",
    coverage:
      "Interpretacje indywidualne, ogólne, objaśnienia, WIS/WIA z systemu EUREKA.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-eureka",
    pinnedVersion: "0.2.0",
    search: {
      tool: "search",
      queryParam: "query",
      dateFromParam: "date_from",
      dateToParam: "date_to",
      pageParam: "page",
      pageBase: 0,
      sizeParam: "page_size",
      sizeMax: 50
    },
    get: {
      tool: "get_interpretation",
      idParam: "id"
    },
    nativeTools: [
      "search",
      "get_interpretation",
      "search_by_signature",
      "list_categories"
    ],
    notes:
      "Interpretacje są praktyką organów, nie źródłem prawa i nie mogą zamknąć PRAWO-HARDGATE dla przepisu."
  },
  kio: {
    id: "kio",
    name:
      "KIO — zamówienia publiczne",
    group: "pl",
    coverage:
      "Orzecznictwo KIO z bazy UZP.",
    runtime: "uvx",
    packageName:
      "kio-orzeczenia-mcp",
    pinnedVersion: "0.4.3",
    search: {
      tool: "kio_search",
      queryParam: "phrase",
      dateFromParam: "date_from",
      dateToParam: "date_to",
      pageParam: "page",
      pageBase: 1,
      sizeParam: "size",
      sizeMax: 100
    },
    get: {
      tool: "kio_get_orzeczenie",
      idParam: "signature_or_id"
    },
    nativeTools: [
      "kio_search",
      "kio_get_orzeczenie",
      "kio_recent",
      "kio_by_pzp_article",
      "kio_get_pdf_url"
    ],
    notes:
      "KIO jest materiałem orzeczniczym, nie źródłem prawa; pusty wynik nie dowodzi braku orzeczeń."
  },
  uodo: {
    id: "uodo",
    name:
      "UODO — decyzje Prezesa UODO",
    group: "pl",
    coverage:
      "Decyzje UODO, kary i statystyki. Warstwa praktyki organu.",
    runtime: "uvx",
    packageName:
      "uodo-orzeczenia-mcp",
    get: {
      tool: "uodo_get_decision",
      idParam: "urn_or_signature"
    },
    search: {
      tool: "uodo_search",
      queryParam: "keyword",
      dateFromParam: "date_from",
      dateToParam: "date_to",
      pageParam: "page",
      pageBase: 1,
      sizeParam: "size",
      sizeMax: 50
    },
    nativeTools: [
      "uodo_search",
      "uodo_get_decision",
      "uodo_recent",
      "uodo_by_gdpr_article",
      "uodo_stats"
    ],
    notes:
      "Pakiet UODO jest uruchamiany przez uvx; gdy źródło/registry jest niedostępne, Lex ma własny oficjalny kanał UODO jako fallback."
  },
  "eu-sparql": {
    id: "eu-sparql",
    name:
      "EUR-Lex / CELLAR / TSUE",
    group: "eu",
    coverage:
      "Prawo UE, CELEX/ECLI, TSUE oraz GDPRhub przez SPARQL Urzędu Publikacji.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-eu-sparql",
    pinnedVersion: "1.2.0",
    search: {
      tool: "search_cjeu",
      queryParam: "query",
      dateFromParam: "date_from",
      dateToParam: "date_to",
      sizeParam: "limit",
      sizeMax: 50
    },
    get: {
      tool: "search_by_celex",
      idParam: "celex"
    },
    nativeTools: [
      "search_by_celex",
      "search_by_date_range",
      "search_cjeu",
      "search_cjeu_by_ecli",
      "search_gdprhub"
    ]
  },
  "eu-compliance": {
    id: "eu-compliance",
    name:
      "EU-Compliance — lokalny korpus 14 regulacji",
    group: "eu",
    coverage:
      "Offline, verbatim korpus regulacji digital/data/cyber do szybkiego lookupu i porównań.",
    runtime: "npx",
    packageName:
      "@matematicsolutions/mcp-eu-compliance",
    pinnedVersion: "0.4.0",
    search: {
      tool: "eu_search",
      queryParam: "query",
      sizeParam: "limit",
      sizeMax: 25
    },
    get: {
      tool: "eu_article",
      idParam: "article_number",
      requiredExtra: [
        "regulation"
      ]
    },
    nativeTools: [
      "eu_search",
      "eu_article",
      "eu_compare",
      "eu_check_applicability",
      "eu_evidence"
    ],
    notes:
      "Korpus offline jest pomocą retrieval; przy aktualnym stanie prawa UE preferuj live EUR-Lex/CELLAR."
  },
  legalize: {
    id: "legalize",
    name:
      "Legalize — law-as-git, 32 jurysdykcje",
    group: "eu",
    coverage:
      "Wersjonowane prawo krajowe z legalize-dev; użyteczne dla historii zmian i prawa obcego.",
    runtime: "uvx",
    packageName:
      "legalize-mcp",
    pinnedVersion: "0.2.4",
    search: {
      tool:
        "legalize_search_laws",
      queryParam: "query",
      sizeParam: "limit",
      sizeMax: 100,
      requiredExtra: [
        "country"
      ]
    },
    get: {
      tool:
        "legalize_get_law",
      idParam: "law_id",
      requiredExtra: [
        "country"
      ]
    },
    nativeTools: [
      "legalize_list_countries",
      "legalize_search_laws",
      "legalize_get_law",
      "legalize_get_meta",
      "legalize_list_reforms"
    ],
    notes:
      "Źródło przekrojowe/historical. Dla bieżącego prawa konkretnej jurysdykcji źródło urzędowe zachowuje pierwszeństwo."
  }
};

const TOOL_NAMES = new Set([
  "pl_list_sources",
  "pl_search",
  "pl_get_document",
  "pl_call",
  "pl_coverage"
]);

const LIST_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: "pl_list_sources",
    description:
      "List the integrated Polish/EU legal MCP fleet. With source_id, also asks that connector for its live native tool schemas. Do not send case facts or document contents.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        source_id: {
          type: "string",
          enum:
            Object.keys(SOURCES)
        },
        group: {
          type: "string",
          enum: [
            "pl",
            "eu"
          ]
        }
      }
    }
  }
};

const SEARCH_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: "pl_search",
    description:
      "Search one integrated legal source using normalized parameters. Use for retrieval/discovery. An empty result is not proof that the law or judgment does not exist; check pl_coverage and native Lex fallbacks.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "source"
      ],
      properties: {
        source: {
          type: "string",
          enum:
            Object.keys(SOURCES)
        },
        query: {
          type: "string"
        },
        date_from: {
          type: "string"
        },
        date_to: {
          type: "string"
        },
        page: {
          type: "integer",
          minimum: 1
        },
        limit: {
          type: "integer",
          minimum: 1
        },
        extra: {
          type: "object",
          additionalProperties: true
        }
      }
    }
  }
};

const GET_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name:
      "pl_get_document",
    description:
      "Retrieve one full legal document from an integrated source by its source identifier. This is source retrieval, not automatic authorization to mark a statutory citation VERIFIED.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "source",
        "document_id"
      ],
      properties: {
        source: {
          type: "string",
          enum:
            Object.keys(SOURCES)
        },
        document_id: {
          type: [
            "string",
            "number"
          ]
        },
        page: {
          type: "integer",
          minimum: 1
        },
        extra: {
          type: "object",
          additionalProperties: true
        }
      }
    }
  }
};

const CALL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: "pl_call",
    description:
      "Call one source-specific read-only tool from the integrated legal MCP fleet. Use only native tool names reported by pl_list_sources. Never send client facts, uploaded document text or secrets.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "source",
        "tool"
      ],
      properties: {
        source: {
          type: "string",
          enum:
            Object.keys(SOURCES)
        },
        tool: {
          type: "string"
        },
        arguments: {
          type: "object",
          additionalProperties: true
        }
      }
    }
  }
};

const COVERAGE_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name:
      "pl_coverage",
    description:
      "Return integrated MCP coverage and collision/fallback policy. Call after an empty/failed search or before claiming that a source contains no relevant material.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {}
    }
  }
};

function asSource(
  value: unknown
): SourceSpec {
  if (
    typeof value !==
      "string" ||
    !(value in SOURCES)
  ) {
    throw new Error(
      "MCP_LEGAL_SOURCE_INVALID"
    );
  }
  return SOURCES[
    value as LegalMcpSourceId
  ];
}

function extraObject(
  value: unknown
): Record<string, unknown> {
  if (
    value === undefined ||
    value === null
  ) {
    return {};
  }
  if (
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "MCP_LEGAL_EXTRA_INVALID"
    );
  }
  return {
    ...(
      value as Record<
        string,
        unknown
      >
    )
  };
}

function assertRequiredExtra(
  required:
    string[] | undefined,
  extra:
    Record<string, unknown>
): void {
  for (
    const key
    of required ?? []
  ) {
    if (
      extra[key] === undefined ||
      extra[key] === null ||
      extra[key] === ""
    ) {
      throw new Error(
        "MCP_LEGAL_REQUIRED_EXTRA_MISSING:" +
          key
      );
    }
  }
}

function safeArguments(
  args:
    Record<string, unknown>
): Record<string, unknown> {
  const serialized =
    JSON.stringify(args);
  if (
    serialized.length >
      20_000
  ) {
    throw new Error(
      "MCP_LEGAL_ARGUMENTS_TOO_LARGE"
    );
  }
  if (
    /\[DOCUMENT\s|\[CASE KNOWLEDGE\s|\[FIRM KNOWLEDGE\s/i
      .test(serialized)
  ) {
    throw new Error(
      "MCP_LEGAL_DOCUMENT_CONTENT_FORBIDDEN"
    );
  }
  return args;
}

function stringEnvironment():
  Record<string, string> {
  const env:
    Record<string, string> = {};
  for (
    const [key, value]
    of Object.entries(
      process.env
    )
  ) {
    if (
      typeof value ===
        "string"
    ) {
      env[key] = value;
    }
  }
  return env;
}

function commandOverride(
  source: SourceSpec
): string | undefined {
  const key =
    "LEX_MCP_CMD_" +
    source.id
      .replaceAll("-", "_")
      .toUpperCase();
  const value =
    process.env[key]
      ?.trim();
  return value || undefined;
}

function splitCommand(
  value: string
): {
  command: string;
  args: string[];
} {
  const parts =
    value
      .match(
        /(?:[^\s"]+|"[^"]*")+/g
      )
      ?.map(
        (part) =>
          part.startsWith('"') &&
          part.endsWith('"')
            ? part.slice(
                1,
                -1
              )
            : part
      ) ?? [];
  if (
    parts.length === 0
  ) {
    throw new Error(
      "MCP_LEGAL_COMMAND_INVALID"
    );
  }
  return {
    command:
      parts[0]!,
    args:
      parts.slice(1)
  };
}

function privateExecutable(
  relative:
    string[],
  fallback:
    string
): string {
  const root =
    process.env
      .LEX_RUNTIME_ROOT;
  if (root) {
    const candidate =
      path.join(
        root,
        ...relative
      );
    if (
      fs.existsSync(
        candidate
      )
    ) {
      return candidate;
    }
  }
  return fallback;
}

function launchFor(
  source: SourceSpec
): {
  command: string;
  args: string[];
  env:
    Record<string, string>;
} {
  const override =
    commandOverride(source);
  if (override) {
    const parsed =
      splitCommand(
        override
      );
    return {
      ...parsed,
      env:
        stringEnvironment()
    };
  }

  const env =
    stringEnvironment();
  const root =
    process.env
      .LEX_RUNTIME_ROOT;
  if (root) {
    const additions = [
      path.join(
        root,
        "node"
      ),
      path.join(
        root,
        "python",
        "Scripts"
      )
    ];
    env.PATH =
      additions.join(
        path.delimiter
      ) +
      path.delimiter +
      (env.PATH ?? "");
  }

  if (
    source.runtime ===
      "npx"
  ) {
    const command =
      privateExecutable(
        [
          "node",
          process.platform ===
            "win32"
            ? "npx.cmd"
            : "npx"
        ],
        process.platform ===
          "win32"
          ? "npx.cmd"
          : "npx"
      );
    const packageRef =
      source.pinnedVersion
        ? source.packageName +
          "@" +
          source.pinnedVersion
        : source.packageName;
    return {
      command,
      args: [
        "-y",
        packageRef
      ],
      env
    };
  }

  const command =
    privateExecutable(
      [
        "python",
        "Scripts",
        process.platform ===
          "win32"
          ? "uvx.exe"
          : "uvx"
      ],
      process.platform ===
        "win32"
        ? "uvx.exe"
        : "uvx"
    );

  if (
    source.pinnedVersion
  ) {
    return {
      command,
      args: [
        "--from",
        source.packageName +
          "==" +
          source.pinnedVersion,
        source.packageName
      ],
      env
    };
  }

  return {
    command,
    args: [
      source.packageName
    ],
    env
  };
}

async function defaultClientFactory(
  source: SourceSpec
): Promise<McpClientLike> {
  const launch =
    launchFor(source);
  const transport =
    new StdioClientTransport({
      command:
        launch.command,
      args:
        launch.args,
      env:
        launch.env,
      stderr: "pipe"
    });
  const client =
    new Client(
      {
        name:
          "lex-machina",
        version:
          "0.1.6"
      },
      {
        capabilities: {}
      }
    );
  await client.connect(
    transport
  );
  return client;
}

function normalizedResult(
  source:
    SourceSpec,
  nativeTool:
    string,
  upstream:
    unknown
): string {
  return JSON.stringify({
    status: "OK",
    source:
      source.id,
    sourceName:
      source.name,
    nativeTool,
    retrievalOnly: true,
    upstream,
    collisionPolicy:
      source.id ===
        "isap"
        ? "Final Polish statutory citations must still pass verify_legal_reference."
        : source.id ===
              "eureka" ||
            source.id ===
              "kio" ||
            source.id ===
              "uodo"
          ? "This material is interpretive/decisional practice, not a statutory source."
          : "Keep source hierarchy and Lex Machina verification gates active."
  });
}

export class LegalMcpFleetRuntime {
  private readonly clients =
    new Map<
      LegalMcpSourceId,
      McpClientLike
    >();
  private readonly events:
    LegalMcpAuditEvent[] =
      [];

  constructor(
    private readonly clientFactory:
      ClientFactory =
        defaultClientFactory
  ) {}

  schemas():
    NormalizedToolSchema[] {
    return [
      LIST_SCHEMA,
      SEARCH_SCHEMA,
      GET_SCHEMA,
      CALL_SCHEMA,
      COVERAGE_SCHEMA
    ];
  }

  handles(
    name: string
  ): boolean {
    return TOOL_NAMES.has(
      name
    );
  }

  systemPromptAppendix():
    string {
    return [
      "# LEGAL MCP FLEET — RETRIEVAL LAYER",
      "The integrated MateMatic-style fleet exposes pl_list_sources, pl_search, pl_get_document, pl_call and pl_coverage across SAOS, NSA/CBOSA, ISAP/ELI, KRS, EUREKA, KIO, UODO, EUR-Lex/CJEU, EU-Compliance and Legalize.",
      "This layer supplements the native Lex Machina legal verifier; it does not replace it.",
      "For Polish statutory citations, always use verify_legal_reference before emitting a VERIFIED marker, even if ISAP MCP returned the act or text.",
      "EUREKA interpretations, KIO rulings and UODO decisions are practice/decisional material, not sources of statutory law.",
      "For current EU law prefer live EUR-Lex/CELLAR over offline EU-Compliance or Legalize when they disagree.",
      "For SN citations keep using the native exact official SN verification workflow after discovery.",
      "A zero-result MCP search is never proof of non-existence. Call pl_coverage and use the existing native official-source fallback.",
      "If MCP and a native official verifier conflict, do not silently choose the MCP result. Re-run the official verifier and surface the unresolved conflict.",
      "Never send client facts, document contents, secrets or raw attachments to MCP tools. Queries must be limited to legal concepts, public identifiers, act names, citations and case signatures.",
      "The user's chat text is pseudonymized before the model can call this layer; preserve those privacy boundaries."
    ].join(
      "\n"
    );
  }

  auditEvents():
    LegalMcpAuditEvent[] {
    return this.events.map(
      (event) => ({
        ...event,
        ...(event.detail
          ? {
              detail: {
                ...event.detail
              }
            }
          : {})
      })
    );
  }

  async close():
    Promise<void> {
    for (
      const client
      of this.clients.values()
    ) {
      try {
        await client.close?.();
      } catch {
        // Best-effort shutdown only.
      }
    }
    this.clients.clear();
  }

  async runTools(
    calls:
      NormalizedToolCall[]
  ): Promise<
    NormalizedToolResult[]
  > {
    const results:
      NormalizedToolResult[] =
        [];
    for (const call of calls) {
      try {
        results.push({
          tool_use_id:
            call.id,
          content:
            await this.execute(
              call
            )
        });
      } catch (error) {
        const source =
          typeof call.input
            .source ===
            "string" &&
          call.input.source in
            SOURCES
            ? call.input
                .source as
                LegalMcpSourceId
            : undefined;
        this.events.push({
          tool:
            call.name,
          ...(source
            ? { source }
            : {}),
          decision:
            "BLOCK",
          detail: {
            error:
              error instanceof Error
                ? error.message
                : String(
                    error
                  )
          }
        });
        results.push({
          tool_use_id:
            call.id,
          content:
            JSON.stringify({
              status:
                "SOURCE_UNAVAILABLE",
              ...(source
                ? { source }
                : {}),
              error:
                error instanceof Error
                  ? error.message
                  : String(
                      error
                    ),
              fallback:
                "Use the native Lex Machina official-source resolver/verifier. Do not treat MCP failure as evidence that the legal material does not exist."
            })
        });
      }
    }
    return results;
  }

  private async connector(
    source:
      SourceSpec
  ): Promise<McpClientLike> {
    const existing =
      this.clients.get(
        source.id
      );
    if (existing) {
      return existing;
    }
    const client =
      await this.clientFactory(
        source
      );
    this.clients.set(
      source.id,
      client
    );
    return client;
  }

  private async callNative(
    source:
      SourceSpec,
    nativeTool:
      string,
    args:
      Record<string, unknown>
  ): Promise<string> {
    if (
      !source.nativeTools
        .includes(
          nativeTool
        )
    ) {
      throw new Error(
        "MCP_LEGAL_NATIVE_TOOL_FORBIDDEN:" +
          nativeTool
      );
    }
    const started =
      Date.now();
    const client =
      await this.connector(
        source
      );
    const safe =
      safeArguments(
        args
      );
    const upstream =
      await client.callTool({
        name:
          nativeTool,
        arguments:
          safe
      });
    this.events.push({
      tool:
        "mcp_source_call",
      source:
        source.id,
      nativeTool,
      decision:
        "ALLOW",
      detail: {
        latencyMs:
          Date.now() -
          started
      }
    });
    return normalizedResult(
      source,
      nativeTool,
      upstream
    );
  }

  private async execute(
    call:
      NormalizedToolCall
  ): Promise<string> {
    if (
      call.name ===
        "pl_coverage"
    ) {
      return JSON.stringify({
        status: "OK",
        sources:
          Object.values(
            SOURCES
          ).map(
            (source) => ({
              id:
                source.id,
              name:
                source.name,
              group:
                source.group,
              coverage:
                source.coverage,
              package:
                source.packageName,
              version:
                source
                  .pinnedVersion ??
                null,
              runtime:
                source.runtime,
              notes:
                source.notes ??
                null
            })
          ),
        policy: {
          statutoryTruth:
            "native verify_legal_reference + official freshness gate",
          mcpRole:
            "retrieval/discovery/support",
          zeroResults:
            "OUT_OF_SCOPE_UNTIL_FALLBACK_CHECKED",
          conflict:
            "STOP_AND_REVERIFY_OFFICIAL_SOURCE",
          privacy:
            "NO_CLIENT_FACTS_OR_DOCUMENT_TEXT"
        }
      });
    }

    if (
      call.name ===
        "pl_list_sources"
    ) {
      const group =
        call.input.group ===
          "pl" ||
        call.input.group ===
          "eu"
          ? call.input.group
          : undefined;
      const sourceId =
        typeof call.input
          .source_id ===
          "string"
          ? call.input
              .source_id
          : undefined;
      if (sourceId) {
        const source =
          asSource(
            sourceId
          );
        const client =
          await this.connector(
            source
          );
        const tools =
          await client
            .listTools();
        this.events.push({
          tool:
            call.name,
          source:
            source.id,
          decision:
            "ALLOW",
          detail: {
            liveSchemas:
              true
          }
        });
        return JSON.stringify({
          status: "OK",
          source: {
            ...source
          },
          tools
        });
      }

      const sources =
        Object.values(
          SOURCES
        )
        .filter(
          (source) =>
            !group ||
            source.group ===
              group
        )
        .map(
          (source) => ({
            id:
              source.id,
            name:
              source.name,
            group:
              source.group,
            coverage:
              source.coverage,
            searchable:
              Boolean(
                source.search
              ),
            nativeTools:
              source
                .nativeTools,
            notes:
              source.notes ??
              null
          })
        );
      this.events.push({
        tool:
          call.name,
        decision:
          "ALLOW",
        detail: {
          count:
            sources.length,
          group:
            group ??
            null
        }
      });
      return JSON.stringify({
        status: "OK",
        sources
      });
    }

    const source =
      asSource(
        call.input.source
      );

    if (
      call.name ===
        "pl_call"
    ) {
      const nativeTool =
        typeof call.input
          .tool ===
          "string"
          ? call.input.tool
              .trim()
          : "";
      if (!nativeTool) {
        throw new Error(
          "MCP_LEGAL_NATIVE_TOOL_REQUIRED"
        );
      }
      return this.callNative(
        source,
        nativeTool,
        extraObject(
          call.input
            .arguments
        )
      );
    }

    if (
      call.name ===
        "pl_search"
    ) {
      const spec =
        source.search;
      if (!spec) {
        throw new Error(
          "MCP_LEGAL_SOURCE_NOT_SEARCHABLE"
        );
      }
      const extra =
        extraObject(
          call.input.extra
        );
      assertRequiredExtra(
        spec.requiredExtra,
        extra
      );
      const args:
        Record<string, unknown> =
          {
            ...extra
          };
      if (
        spec.queryParam &&
        typeof call.input
          .query ===
          "string" &&
        call.input.query.trim()
      ) {
        args[
          spec.queryParam
        ] =
          call.input.query
            .trim();
      }
      if (
        spec.dateFromParam &&
        typeof call.input
          .date_from ===
          "string"
      ) {
        args[
          spec.dateFromParam
        ] =
          call.input
            .date_from;
      }
      if (
        spec.dateToParam &&
        typeof call.input
          .date_to ===
          "string"
      ) {
        args[
          spec.dateToParam
        ] =
          call.input
            .date_to;
      }
      if (
        spec.pageParam
      ) {
        const page =
          Number.isInteger(
            call.input.page
          )
            ? Number(
                call.input.page
              )
            : 1;
        if (page < 1) {
          throw new Error(
            "MCP_LEGAL_PAGE_INVALID"
          );
        }
        args[
          spec.pageParam
        ] =
          spec.pageBase ===
            0
            ? page - 1
            : page;
      }
      if (
        spec.sizeParam &&
        Number.isInteger(
          call.input.limit
        )
      ) {
        let limit =
          Number(
            call.input.limit
          );
        if (
          spec.sizeMin !==
            undefined
        ) {
          limit =
            Math.max(
              spec.sizeMin,
              limit
            );
        }
        if (
          spec.sizeMax !==
            undefined
        ) {
          limit =
            Math.min(
              spec.sizeMax,
              limit
            );
        }
        args[
          spec.sizeParam
        ] = limit;
      }
      return this.callNative(
        source,
        spec.tool,
        args
      );
    }

    if (
      call.name ===
        "pl_get_document"
    ) {
      const extra =
        extraObject(
          call.input.extra
        );
      assertRequiredExtra(
        source.get
          .requiredExtra,
        extra
      );
      const documentId =
        call.input
          .document_id;
      if (
        (
          typeof documentId !==
            "string" &&
          typeof documentId !==
            "number"
        ) ||
        String(
          documentId
        ).trim() === ""
      ) {
        throw new Error(
          "MCP_LEGAL_DOCUMENT_ID_INVALID"
        );
      }
      const args:
        Record<string, unknown> =
          {
            ...extra,
            [
              source.get
                .idParam
            ]:
              documentId
          };
      if (
        source.get
          .pageParam &&
        Number.isInteger(
          call.input.page
        )
      ) {
        args[
          source.get
            .pageParam
        ] =
          Number(
            call.input.page
          );
      }
      return this.callNative(
        source,
        source.get.tool,
        args
      );
    }

    throw new Error(
      "UNKNOWN_MCP_LEGAL_TOOL"
    );
  }
}

export const LEGAL_MCP_TOOL_NAMES =
  TOOL_NAMES;

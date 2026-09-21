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

// 0.1.4 is the published build used by the release runtime.
 // The upstream main branch is newer, but installers must not depend on an
 // unpublished package version. Lex supplies the coverage contract locally,
 // while the four published unified proxy tools remain upstream.
const AGGREGATOR_PACKAGE =
  "prawo-pl-mcp==0.1.4";

const SOURCE_IDS = [
  "saos",
  "nsa",
  "isap",
  "krs",
  "eureka",
  "kio",
  "uodo",
  "eu-sparql",
  "eu-compliance",
  "legalize"
] as const;

const SOURCE_ENUM = [
  ...SOURCE_IDS
];

type SourceId =
  (typeof SOURCE_IDS)[number];

const LOCAL_COVERAGE: Record<
  SourceId,
  {
    family: string;
    authority: string;
    role: string;
    fallback: string;
  }
> = {
  saos: {
    family:
      "case-law",
    authority:
      "SAOS",
    role:
      "discovery/support",
    fallback:
      "Native Lex SAOS discovery; SN citations still require the official SN verifier."
  },
  nsa: {
    family:
      "administrative-case-law",
    authority:
      "CBOSA",
    role:
      "discovery/retrieval",
    fallback:
      "Native Lex direct-CBOSA adapter and its fail-closed indexed fallback."
  },
  isap: {
    family:
      "polish-legislation",
    authority:
      "Sejm ELI",
    role:
      "retrieval",
    fallback:
      "Native Lex legal-act resolver, temporal freshness gate and verify_legal_reference."
  },
  krs: {
    family:
      "company-register",
    authority:
      "KRS Ministry of Justice API",
    role:
      "registry lookup",
    fallback:
      "Native official KRS API path used by the entity verification gate."
  },
  eureka: {
    family:
      "tax-interpretations",
    authority:
      "EUREKA MF/KIS",
    role:
      "interpretive practice",
    fallback:
      "EUREKA web/source lookup; statutory propositions still require ELI verification."
  },
  kio: {
    family:
      "public-procurement-case-law",
    authority:
      "KIO/UZP",
    role:
      "decisional practice",
    fallback:
      "Native official-source research path; do not infer non-existence from connector failure."
  },
  uodo: {
    family:
      "data-protection-decisions",
    authority:
      "UODO",
    role:
      "decisional practice",
    fallback:
      "Native Lex official UODO API path."
  },
  "eu-sparql": {
    family:
      "eu-law-and-cjeu",
    authority:
      "EUR-Lex/CELLAR/CJEU",
    role:
      "live official retrieval",
    fallback:
      "Native EUR-Lex/CELLAR official-source verification path."
  },
  "eu-compliance": {
    family:
      "eu-compliance-offline-corpus",
    authority:
      "local corpus derived from EUR-Lex",
    role:
      "fast offline research",
    fallback:
      "Live EUR-Lex/CELLAR takes precedence for current-law verification."
  },
  legalize: {
    family:
      "multi-jurisdiction-law-as-git",
    authority:
      "legalize-dev corpus",
    role:
      "historical/comparative research",
    fallback:
      "Use the official source for the relevant jurisdiction for final current-law verification."
  }
};

export type LegalFederationAuditEvent = {
  tool: string;
  source?: string;
  decision:
    "ALLOW" |
    "BLOCK";
  detail?:
    Record<string, unknown>;
};

const LIST_TOOL =
  "list_federated_legal_sources";
const SEARCH_TOOL =
  "search_federated_legal_sources";
const GET_TOOL =
  "get_federated_legal_document";
const CALL_TOOL =
  "call_federated_legal_source";
const COVERAGE_TOOL =
  "federated_legal_coverage";

const LIST_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: LIST_TOOL,
      description:
        "List the read-only Polish/EU legal source federation backed by prawo-pl-mcp. " +
        "Use without sourceId for the ten-source catalog; provide sourceId to inspect live native tool schemas. " +
        "This is research/discovery only and never replaces Lex Machina citation verification.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: {
            type: "string",
            enum: SOURCE_ENUM
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

const SEARCH_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: SEARCH_TOOL,
      description:
        "Search one source in the prawo-pl-mcp federation. " +
        "Sources: SAOS, NSA/CBOSA, ISAP/ELI, KRS, EUREKA/KIS, KIO, UODO, EUR-Lex/CJEU, EU compliance and Legalize. " +
        "Search results are discovery material; fetch the document before relying on its contents.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: [
          "source"
        ],
        properties: {
          source: {
            type: "string",
            enum: SOURCE_ENUM
          },
          query: {
            type: "string"
          },
          dateFrom: {
            type: "string",
            description:
              "Optional YYYY-MM-DD."
          },
          dateTo: {
            type: "string",
            description:
              "Optional YYYY-MM-DD."
          },
          page: {
            type: "integer",
            minimum: 1
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 100
          },
          extra: {
            type: "object",
            description:
              "Optional source-native filters. Inspect the source schema first when uncertain."
          }
        }
      }
    }
  };

const GET_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: GET_TOOL,
      description:
        "Fetch a full legal/research document from one federated source by the identifier returned from search. " +
        "Long documents are paginated. Federation documents remain research evidence; statutory and SN citation hard gates still use Lex Machina verification tools.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: [
          "source",
          "documentId"
        ],
        properties: {
          source: {
            type: "string",
            enum: SOURCE_ENUM
          },
          documentId: {
            type: "string"
          },
          page: {
            type: "integer",
            minimum: 1
          },
          extra: {
            type: "object"
          }
        }
      }
    }
  };

const CALL_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: CALL_TOOL,
      description:
        "Call a source-specific read-only tool through prawo-pl-mcp, e.g. SAOS citator, KIO article search, UODO statistics, KRS board, EUREKA categories or EU comparison. " +
        "Inspect the source schema first. This tool cannot create Lex Machina VERIFIED markers.",
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
            enum: SOURCE_ENUM
          },
          tool: {
            type: "string"
          },
          arguments: {
            type: "object"
          }
        }
      }
    }
  };

const COVERAGE_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: COVERAGE_TOOL,
      description:
        "Return prawo-pl-mcp coverage and known gaps. Use after an empty search before claiming that a legal source or material does not exist.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {}
      }
    }
  };

function privateCommand(
  relative: string[],
  fallback: string
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

function guardOutboundPayload(
  value:
    Record<string, unknown>
): Record<string, unknown> {
  const serialized =
    JSON.stringify(
      value
    );
  if (
    serialized.length >
      20_000
  ) {
    throw new Error(
      "FEDERATED_PAYLOAD_TOO_LARGE"
    );
  }
  if (
    /\[(?:DOCUMENT|CASE KNOWLEDGE|FIRM KNOWLEDGE)\s/i
      .test(
        serialized
      ) ||
    /\[(?:LM)?PII:/i
      .test(
        serialized
      )
  ) {
    throw new Error(
      "FEDERATED_CASE_DATA_FORBIDDEN"
    );
  }
  return value;
}

function cleanEnvironment():
  Record<string, string> {
  const env:
    Record<string, string> = {};

  for (
    const [
      key,
      value
    ] of Object.entries(
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

  const runtimeRoot =
    env.LEX_RUNTIME_ROOT;
  if (runtimeRoot) {
    const privatePaths = [
      path.join(
        runtimeRoot,
        "node"
      ),
      path.join(
        runtimeRoot,
        "python",
        "Scripts"
      )
    ];
    env.PATH =
      privatePaths.join(
        path.delimiter
      ) +
      path.delimiter +
      (env.PATH ?? "");
  }

  return {
    ...env,
    PRAWO_PL_MCP_INIT_TIMEOUT:
      env.PRAWO_PL_MCP_INIT_TIMEOUT ??
      "180",
    PRAWO_PL_MCP_TIMEOUT:
      env.PRAWO_PL_MCP_TIMEOUT ??
      "90",

    // Pin the connector fleet where the upstream package version is
    // published in the canonical repository. UODO remains delegated to the
    // aggregator because its registry/package is the current source of truth.
    PRAWO_PL_MCP_CMD_SAOS:
      env.PRAWO_PL_MCP_CMD_SAOS ??
      "npx -y @matematicsolutions/mcp-saos@1.2.0",
    PRAWO_PL_MCP_CMD_NSA:
      env.PRAWO_PL_MCP_CMD_NSA ??
      "npx -y @matematicsolutions/mcp-nsa@1.3.0",
    PRAWO_PL_MCP_CMD_ISAP:
      env.PRAWO_PL_MCP_CMD_ISAP ??
      "npx -y @matematicsolutions/mcp-isap@1.3.0",
    PRAWO_PL_MCP_CMD_KRS:
      env.PRAWO_PL_MCP_CMD_KRS ??
      "npx -y @matematicsolutions/mcp-krs@1.1.1",
    PRAWO_PL_MCP_CMD_EUREKA:
      env.PRAWO_PL_MCP_CMD_EUREKA ??
      "npx -y @matematicsolutions/mcp-eureka@0.2.0",
    PRAWO_PL_MCP_CMD_KIO:
      env.PRAWO_PL_MCP_CMD_KIO ??
      "uvx --from kio-orzeczenia-mcp==0.4.3 kio-orzeczenia-mcp",
    PRAWO_PL_MCP_CMD_EU_SPARQL:
      env.PRAWO_PL_MCP_CMD_EU_SPARQL ??
      "npx -y @matematicsolutions/mcp-eu-sparql@1.2.0",
    PRAWO_PL_MCP_CMD_EU_COMPLIANCE:
      env.PRAWO_PL_MCP_CMD_EU_COMPLIANCE ??
      "npx -y @matematicsolutions/mcp-eu-compliance@0.4.0",
    PRAWO_PL_MCP_CMD_LEGALIZE:
      env.PRAWO_PL_MCP_CMD_LEGALIZE ??
      "uvx --from legalize-mcp==0.2.4 legalize-mcp"
  };
}

function sourceFrom(
  input:
    Record<string, unknown>
): SourceId | undefined {
  const raw =
    typeof input.source ===
      "string"
      ? input.source
      : typeof input.sourceId ===
          "string"
        ? input.sourceId
        : undefined;
  if (
    !raw ||
    !SOURCE_IDS.includes(
      raw as SourceId
    )
  ) {
    return undefined;
  }
  return raw as SourceId;
}

function extractToolText(
  value: unknown
): string {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return String(
      value ?? ""
    );
  }

  const result =
    value as {
      content?: Array<
        {
          type?: string;
          text?: string;
        }
      >;
      structuredContent?: unknown;
      isError?: boolean;
    };

  const text =
    (result.content ?? [])
      .filter(
        (item) =>
          item.type === "text" &&
          typeof item.text ===
            "string"
      )
      .map(
        (item) =>
          item.text!
      )
      .join("\n");

  if (text) {
    if (
      result.isError
    ) {
      throw new Error(
        text
      );
    }
    return text;
  }

  if (
    result.structuredContent !==
      undefined
  ) {
    const serialized =
      JSON.stringify(
        result.structuredContent
      );
    if (
      result.isError
    ) {
      throw new Error(
        serialized
      );
    }
    return serialized;
  }

  if (
    result.isError
  ) {
    throw new Error(
      "FEDERATED_LEGAL_SOURCE_ERROR"
    );
  }

  return JSON.stringify(
    value
  );
}

class PrawoPlMcpClient {
  private client:
    Client | null = null;
  private connecting:
    Promise<Client> | null =
      null;

  private async ensureClient():
    Promise<Client> {
    if (this.client) {
      return this.client;
    }
    if (this.connecting) {
      return this.connecting;
    }

    this.connecting =
      (async () => {
        const command =
          process.env
            .LEX_LEGAL_MCP_UVX ??
          privateCommand(
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
        const transport =
          new StdioClientTransport({
            command,
            args: [
              "--from",
              AGGREGATOR_PACKAGE,
              "prawo-pl-mcp"
            ],
            env:
              cleanEnvironment(),
            stderr: "pipe"
          });
        const client =
          new Client({
            name:
              "lex-machina-legal-federation",
            version:
              "0.1.6"
          });

        await client.connect(
          transport
        );
        this.client =
          client;
        return client;
      })();

    try {
      return await this
        .connecting;
    } catch (error) {
      this.client = null;
      throw error;
    } finally {
      this.connecting =
        null;
    }
  }

  async close():
    Promise<void> {
    const client =
      this.client;
    this.client = null;
    this.connecting = null;
    if (client) {
      try {
        await client.close();
      } catch {
        // Best-effort shutdown.
      }
    }
  }

  async call(
    name: string,
    args:
      Record<string, unknown>
  ): Promise<string> {
    const client =
      await this.ensureClient();
    try {
      const result =
        await client.callTool({
          name,
          arguments:
            guardOutboundPayload(
              args
            )
        });
      return extractToolText(
        result
      );
    } catch (error) {
      try {
        await client.close();
      } catch {
        // Best effort: the next call creates a fresh MCP transport.
      }
      this.client = null;
      throw error;
    }
  }
}

export class LegalFederationToolRuntime {
  private readonly client =
    new PrawoPlMcpClient();
  private readonly events:
    LegalFederationAuditEvent[] =
      [];

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
    return [
      LIST_TOOL,
      SEARCH_TOOL,
      GET_TOOL,
      CALL_TOOL,
      COVERAGE_TOOL
    ].includes(
      name
    );
  }

  systemPromptAppendix():
    string {
    return [
      "# FEDERATED LEGAL RESEARCH",
      "Lex Machina has an optional read-only prawo-pl-mcp federation with ten source families: SAOS, NSA/CBOSA, ISAP/ELI, KRS, EUREKA/KIS, KIO, UODO, EUR-Lex/CJEU, EU compliance and Legalize.",
      "Use list_federated_legal_sources when you need source capabilities or a native schema. Search first, then fetch the actual document before relying on its contents.",
      "This federation is DISCOVERY/RESEARCH ONLY. It never creates a Lex Machina VERIFIED ledger entry and never bypasses Gate I.",
      "For Polish statutory citations and current legal wording, verify_legal_reference remains authoritative. For Sąd Najwyższy signatures/quotes/propositions, use verify_case_reference / verify_case_quote / verify_case_proposition.",
      "SAOS, NSA and ISAP federation results can broaden discovery or retrieve source material, but they do not replace the native Lex verification path.",
      "EUREKA interpretations, KIO rulings, UODO decisions and other administrative/case materials must be described with their actual legal status; do not present them as generally binding statutory law.",
      "After an empty federated search, call federated_legal_coverage before concluding that material is absent.",
      "Never send case facts, uploaded-document text, secrets, PII tokens or client-specific narrative to the external MCP fleet. Restrict calls to public legal concepts, act/case identifiers, citations and neutral search phrases.",
      "If a federated result conflicts with a native official-source verifier, the native official verification path is authoritative; fail closed until the conflict is resolved.",
      "Do not expose connector implementation details or treat a source_unavailable error as absence of law."
    ].join(
      "\n"
    );
  }

  async close():
    Promise<void> {
    await this.client.close();
  }

  auditEvents():
    LegalFederationAuditEvent[] {
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

  async runTools(
    calls:
      NormalizedToolCall[]
  ): Promise<
    NormalizedToolResult[]
  > {
    const results:
      NormalizedToolResult[] =
      [];

    // Intentionally sequential: several upstreams publish explicit rate limits.
    for (
      const call
      of calls
    ) {
      const source =
        sourceFrom(
          call.input
        );
      try {
        const content =
          await this.execute(
            call
          );
        this.events.push({
          tool:
            call.name,
          ...(source
            ? {
                source
              }
            : {}),
          decision:
            "ALLOW"
        });
        results.push({
          tool_use_id:
            call.id,
          content
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(
                error
              );
        this.events.push({
          tool:
            call.name,
          ...(source
            ? {
                source
              }
            : {}),
          decision:
            "BLOCK",
          detail: {
            error:
              message
          }
        });
        results.push({
          tool_use_id:
            call.id,
          content:
            JSON.stringify({
              status:
                "SOURCE_UNAVAILABLE",
              error:
                message,
              instruction:
                "Do not infer absence of law from this failure. Use another verified source path or report the source as temporarily unavailable."
            })
        });
      }
    }

    return results;
  }

  private async execute(
    call:
      NormalizedToolCall
  ): Promise<string> {
    if (
      call.name ===
        LIST_TOOL
    ) {
      const source =
        sourceFrom(
          call.input
        );
      const group =
        typeof call.input
          .group ===
          "string"
          ? call.input.group
          : undefined;
      return this.client.call(
        "pl_list_sources",
        {
          ...(source
            ? {
                source_id:
                  source
              }
            : {}),
          ...(group
            ? {
                group
              }
            : {})
        }
      );
    }

    if (
      call.name ===
        COVERAGE_TOOL
    ) {
      return JSON.stringify({
        status:
          "OK",
        aggregatorPackage:
          AGGREGATOR_PACKAGE,
        sources:
          SOURCE_IDS.map(
            (source) => ({
              source,
              ...LOCAL_COVERAGE[
                source
              ]
            })
          ),
        policy: {
          verificationAuthority:
            "LEX_NATIVE_ONLY",
          emptySearch:
            "OUT_OF_SCOPE_UNTIL_FALLBACK_CHECKED",
          conflict:
            "REVERIFY_WITH_OFFICIAL_NATIVE_PATH_AND_FAIL_CLOSED",
          privacy:
            "NO_CASE_FACTS_DOCUMENT_TEXT_OR_PII_TOKENS_TO_EXTERNAL_MCP"
        }
      });
    }

    const source =
      sourceFrom(
        call.input
      );
    if (!source) {
      throw new Error(
        "FEDERATED_SOURCE_INVALID"
      );
    }

    if (
      call.name ===
        SEARCH_TOOL
    ) {
      return this.client.call(
        "pl_search",
        {
          source,
          ...(typeof call.input
            .query === "string"
            ? {
                query:
                  call.input
                    .query
              }
            : {}),
          ...(typeof call.input
            .dateFrom === "string"
            ? {
                date_from:
                  call.input
                    .dateFrom
              }
            : {}),
          ...(typeof call.input
            .dateTo === "string"
            ? {
                date_to:
                  call.input
                    .dateTo
              }
            : {}),
          ...(Number.isInteger(
            call.input.page
          )
            ? {
                page:
                  call.input
                    .page
              }
            : {}),
          ...(Number.isInteger(
            call.input.limit
          )
            ? {
                limit:
                  call.input
                    .limit
              }
            : {}),
          ...(call.input.extra &&
          typeof call.input
            .extra ===
            "object" &&
          !Array.isArray(
            call.input.extra
          )
            ? {
                extra:
                  call.input
                    .extra
              }
            : {})
        }
      );
    }

    if (
      call.name ===
        GET_TOOL
    ) {
      const documentId =
        typeof call.input
          .documentId ===
          "string"
          ? call.input
              .documentId
              .trim()
          : "";
      if (!documentId) {
        throw new Error(
          "FEDERATED_DOCUMENT_ID_REQUIRED"
        );
      }
      return this.client.call(
        "pl_get_document",
        {
          source,
          document_id:
            documentId,
          ...(Number.isInteger(
            call.input.page
          )
            ? {
                page:
                  call.input
                    .page
              }
            : {}),
          ...(call.input.extra &&
          typeof call.input
            .extra ===
            "object" &&
          !Array.isArray(
            call.input.extra
          )
            ? {
                extra:
                  call.input
                    .extra
              }
            : {})
        }
      );
    }

    if (
      call.name ===
        CALL_TOOL
    ) {
      const tool =
        typeof call.input
          .tool ===
          "string"
          ? call.input.tool
              .trim()
          : "";
      if (!tool) {
        throw new Error(
          "FEDERATED_NATIVE_TOOL_REQUIRED"
        );
      }
      const args =
        call.input.arguments &&
        typeof call.input
          .arguments ===
          "object" &&
        !Array.isArray(
          call.input.arguments
        )
          ? call.input
              .arguments as
              Record<
                string,
                unknown
              >
          : {};
      return this.client.call(
        "pl_call",
        {
          source,
          tool,
          arguments:
            args
        }
      );
    }

    throw new Error(
      "UNKNOWN_FEDERATED_LEGAL_TOOL"
    );
  }
}

export const FEDERATED_LEGAL_TOOL_NAMES =
  new Set([
    LIST_TOOL,
    SEARCH_TOOL,
    GET_TOOL,
    CALL_TOOL,
    COVERAGE_TOOL
  ]);

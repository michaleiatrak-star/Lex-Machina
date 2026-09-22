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
import {
  assessLegalSourceCandidate,
  classifyKnownLegalSourceUrl,
  federatedSourcePolicy
} from "./legal-source-policy.js";
import {
  AuxiliarySourceFetchError,
  SafeAuxiliarySourceFetcher
} from "./auxiliary-source-fetcher.js";

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
const ASSESS_SOURCE_TOOL =
  "assess_legal_source";
const FETCH_AUXILIARY_SOURCE_TOOL =
  "fetch_auxiliary_legal_source";

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

const ASSESS_SOURCE_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name:
        ASSESS_SOURCE_TOOL,
      description:
        "Classify and assess a public legal/research URL under Lex Machina source hierarchy without fetching it. " +
        "Known R1/R2A/R2B domains are classified deterministically; unknown domains are conservatively R3 until editorial criteria are independently established. " +
        "This tool never creates VERIFIED/SUPPORTED status and never replaces native verification.",
      parameters: {
        type: "object",
        additionalProperties:
          false,
        required: [
          "url"
        ],
        properties: {
          url: {
            type: "string",
            description:
              "Public HTTP(S) source URL to classify."
          },
          claim: {
            type: "string",
            description:
              "Optional exact proposition for which this source is being assessed."
          },

        }
      }
    }
  };

const FETCH_AUXILIARY_SOURCE_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name:
        FETCH_AUXILIARY_SOURCE_TOOL,
      description:
        "Safely fetch one public R2B/R3 auxiliary legal-research page through Lex Machina's SSRF-protected HTTPS retriever. " +
        "Use only after you have a specific public URL. The runtime classifies the final URL, extracts source-owned publication dates and records a content hash. " +
        "This tool never creates VERIFIED/SUPPORTED status and R2B/R3 can never be the sole legal basis.",
      parameters: {
        type: "object",
        additionalProperties:
          false,
        required: [
          "url"
        ],
        properties: {
          url: {
            type: "string",
            description:
              "Specific public HTTPS URL for an auxiliary legal/research page. Never include case facts, PII tokens or protected document context."
          },
          claim: {
            type: "string",
            description:
              "Optional exact public legal proposition being researched. Do not include client-specific facts."
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
    // published in the canonical repository. UODO is intentionally handled
    // by a local read-only MCP sibling over the official UODO API because the
    // upstream uodo-orzeczenia-mcp package currently closes during startup.
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
    PRAWO_PL_MCP_CMD_UODO:
      env.PRAWO_PL_MCP_CMD_UODO ??
      "node dist/uodo-official-mcp-server.js",
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

export function annotateFederatedLegalContent(
  source:
    string,
  content:
    string
): string {
  const sourcePolicy =
    federatedSourcePolicy(
      source
    );

  try {
    const parsed =
      JSON.parse(
        content
      ) as unknown;

    if (
      parsed &&
      typeof parsed ===
        "object" &&
      !Array.isArray(
        parsed
      )
    ) {
      return JSON.stringify({
        ...(
          parsed as
            Record<
              string,
              unknown
            >
        ),
        _lexSourcePolicy:
          sourcePolicy
      });
    }

    return JSON.stringify({
      _lexSourcePolicy:
        sourcePolicy,
      results:
        parsed
    });
  } catch {
    return JSON.stringify({
      _lexSourcePolicy:
        sourcePolicy,
      content
    });
  }
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
              "0.1.7"
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

type AuxiliarySourceFetcher =
  Pick<
    SafeAuxiliarySourceFetcher,
    "fetch"
  >;

export class LegalFederationToolRuntime {
  private readonly client =
    new PrawoPlMcpClient();

  constructor(
    private readonly auxiliarySourceFetcher:
      AuxiliarySourceFetcher =
        new SafeAuxiliarySourceFetcher()
  ) {}
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
      ASSESS_SOURCE_SCHEMA,
      FETCH_AUXILIARY_SOURCE_SCHEMA,
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
      ASSESS_SOURCE_TOOL,
      FETCH_AUXILIARY_SOURCE_TOOL,
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
      "Every federated search/get/call result carries _lexSourcePolicy with sourceTier, provenance and verificationAuthority=LEX_NATIVE_ONLY. Preserve that metadata when reasoning about the result.",
      "Use assess_legal_source for classification only. Use fetch_auxiliary_legal_source to retrieve a specific public R2B/R3 page through the SSRF-protected HTTPS channel; the fetched page remains auxiliary evidence.",
      "R2B and R3 material is auxiliary only: it can never create VERIFIED or formal SUPPORTED status and can never be the sole legal basis. Cross-check the proposition against R1/R2A before using it.",
      "For R3 material, check publication/update date. Missing date or material older than 24 months requires an explicit staleness warning.",
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
        const policyBlocked =
          call.name ===
            ASSESS_SOURCE_TOOL ||
          (
            call.name ===
              FETCH_AUXILIARY_SOURCE_TOOL &&
            (
              message ===
                "AUX_SOURCE_REQUIRES_R2B_R3" ||
              message ===
                "AUX_SOURCE_CASE_DATA_FORBIDDEN" ||
              (
                error instanceof
                  AuxiliarySourceFetchError &&
                [
                  "AUX_SOURCE_URL_INVALID",
                  "AUX_SOURCE_HOST_FORBIDDEN",
                  "AUX_SOURCE_DNS_PRIVATE"
                ].includes(
                  error.code
                )
              )
            )
          );
        results.push({
          tool_use_id:
            call.id,
          content:
            JSON.stringify({
              status:
                policyBlocked
                  ? "POLICY_BLOCKED"
                  : "SOURCE_UNAVAILABLE",
              error:
                message,
              instruction:
                policyBlocked
                  ? "Source assessment was rejected by Lex source policy. Correct the URL/cross-check evidence; do not treat this as a source outage."
                  : "Do not infer absence of law from this failure. Use another verified source path or report the source as temporarily unavailable."
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
        ASSESS_SOURCE_TOOL
    ) {
      const rawUrl =
        typeof call.input
          .url === "string"
          ? call.input.url
              .trim()
          : "";
      let url: URL;
      try {
        url =
          new URL(rawUrl);
      } catch {
        throw new Error(
          "LEGAL_SOURCE_URL_INVALID"
        );
      }
      if (
        (
          url.protocol !==
            "https:" &&
          url.protocol !==
            "http:"
        ) ||
        url.username ||
        url.password
      ) {
        throw new Error(
          "LEGAL_SOURCE_URL_INVALID"
        );
      }

      const knownTier =
        classifyKnownLegalSourceUrl(
          url.toString()
        );
      const tier =
        knownTier ??
        "R3";
      const crossCheckStatus =
        tier === "R2B" ||
        tier === "R3"
          ? "PENDING" as const
          : "NOT_REQUIRED" as const;

      const candidate = {
        ...(typeof call.input
          .claim ===
          "string" &&
        call.input
          .claim
          .trim()
          ? {
              claim:
                call.input
                  .claim
                  .trim()
            }
          : {}),
        url:
          url.toString(),
        tier,
        provenance: {
          sourceUrl:
            url.toString(),
          retrievedVia:
            "WEB_RESEARCH" as const,
          accessMode:
            "UNKNOWN" as const,
          classificationBasis:
            knownTier
              ? "KNOWN_CANONICAL_DOMAIN"
              : "UNKNOWN_DOMAIN_CONSERVATIVE_R3_UNTIL_EDITORIAL_CRITERIA_VERIFIED",
        },
        crossCheckStatus
      };

      return JSON.stringify({
        status: "OK",
        candidate,
        assessment:
          assessLegalSourceCandidate(
            candidate
          ),
        classification:
          knownTier
            ? "KNOWN_DOMAIN"
            : "CONSERVATIVE_R3",
        instruction:
          knownTier
            ? "Preserve the tier and assessment. R2B/R3 remains auxiliary only. A higher-tier cross-check can be confirmed only by the session runtime from a real VerificationLedger record; model input cannot attest it."
            : "Unknown domain was conservatively classified as R3. It may be reconsidered as R2B only after independent evidence of professional editorial board, recognized publisher/brand and systematic updating. A higher-tier cross-check can be confirmed only by the session runtime."
      });
    }

    if (
      call.name ===
        FETCH_AUXILIARY_SOURCE_TOOL
    ) {
      const rawUrl =
        typeof call.input
          .url === "string"
          ? call.input.url
              .trim()
          : "";
      const publicClaim =
        typeof call.input
          .claim === "string"
          ? call.input.claim
              .trim()
          : "";

      if (
        /\[(?:DOCUMENT|CASE KNOWLEDGE|FIRM KNOWLEDGE)\s/iu
          .test(
            rawUrl +
              " " +
              publicClaim
          ) ||
        /\[(?:LM)?PII:/iu
          .test(
            rawUrl +
              " " +
              publicClaim
          )
      ) {
        throw new Error(
          "AUX_SOURCE_CASE_DATA_FORBIDDEN"
        );
      }

      const requestedTier =
        classifyKnownLegalSourceUrl(
          rawUrl
        );
      if (
        requestedTier === "R1" ||
        requestedTier === "R2A"
      ) {
        throw new Error(
          "AUX_SOURCE_REQUIRES_R2B_R3"
        );
      }

      const fetched =
        await this
          .auxiliarySourceFetcher
          .fetch(
            rawUrl
          );
      const finalKnownTier =
        classifyKnownLegalSourceUrl(
          fetched.finalUrl
        );
      if (
        finalKnownTier === "R1" ||
        finalKnownTier === "R2A"
      ) {
        throw new Error(
          "AUX_SOURCE_REQUIRES_R2B_R3"
        );
      }
      const tier =
        finalKnownTier ??
        "R3";
      const candidate = {
        ...(publicClaim
          ? {
              claim:
                publicClaim
            }
          : {}),
        url:
          fetched.finalUrl,
        tier,
        provenance: {
          sourceUrl:
            fetched.finalUrl,
          retrievedVia:
            "WEB_RESEARCH" as const,
          accessMode:
            "DIRECT_LIVE" as const,
          classificationBasis:
            finalKnownTier
              ? "KNOWN_CANONICAL_DOMAIN_AFTER_SAFE_FETCH"
              : "UNKNOWN_DOMAIN_CONSERVATIVE_R3_AFTER_SAFE_FETCH",
          ...(fetched
            .publishedAt
            ? {
                publishedAt:
                  fetched
                    .publishedAt
              }
            : {}),
          ...(fetched
            .updatedAt
            ? {
                updatedAt:
                  fetched
                    .updatedAt
              }
            : {})
        },
        crossCheckStatus:
          "PENDING" as const
      };
      const textLimit =
        80_000;
      return JSON.stringify({
        status:
          "OK",
        classification:
          finalKnownTier
            ? "KNOWN_DOMAIN"
            : "CONSERVATIVE_R3",
        candidate,
        assessment:
          assessLegalSourceCandidate(
            candidate
          ),
        retrieval: {
          requestedUrl:
            fetched.requestedUrl,
          finalUrl:
            fetched.finalUrl,
          fetchedAt:
            fetched.fetchedAt,
          contentType:
            fetched.contentType,
          bytes:
            fetched.bytes,
          sha256:
            fetched.sha256,
          redirectCount:
            fetched
              .redirectCount,
          ...(fetched
            .publishedAt
            ? {
                publishedAt:
                  fetched
                    .publishedAt
              }
            : {}),
          ...(fetched
            .updatedAt
            ? {
                updatedAt:
                  fetched
                    .updatedAt
              }
            : {}),
          text:
            fetched.text
              .slice(
                0,
                textLimit
              ),
          textTruncated:
            fetched.text
              .length >
            textLimit
        },
        instruction:
          "This is auxiliary R2B/R3 research material. Do not create VERIFIED/SUPPORTED from it and do not use it as the sole legal basis. For a legal proposition, obtain a real R1/R2A verification record for the same claim."
      });
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
              ],
              transport:
                source ===
                  "uodo"
                  ? "PRAWO_PL_MCP_LOCAL_OFFICIAL_MCP_OVERRIDE"
                  : "PRAWO_PL_MCP_CHILD_CONNECTOR",
              sourcePolicy:
                federatedSourcePolicy(
                  source
                )
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
            "NO_CASE_FACTS_DOCUMENT_TEXT_OR_PII_TOKENS_TO_EXTERNAL_MCP",
          sourceTierCoverage: {
            tier1:
              "IMPLEMENTED_OFFICIAL_RETRIEVAL_WITH_NATIVE_VERIFICATION",
            tier2A:
              "IMPLEMENTED_OFFICIAL_AND_AUTHORITY_RETRIEVAL_WITH_NATIVE_VERIFICATION_WHERE_SUPPORTED",
            tier2B:
              "SAFE_AUXILIARY_HTTPS_RETRIEVER_AND_RUNTIME_HARD_GATE_IMPLEMENTED",
            tier3:
              "SAFE_AUXILIARY_HTTPS_RETRIEVER_AND_RUNTIME_HARD_GATE_IMPLEMENTED_WITH_CONSERVATIVE_UNKNOWN_DOMAIN_CLASSIFICATION"
          }
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
      const content =
        await this.client.call(
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
      return annotateFederatedLegalContent(
        source,
        content
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
      const content =
        await this.client.call(
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
      return annotateFederatedLegalContent(
        source,
        content
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
      const content =
        await this.client.call(
          "pl_call",
          {
            source,
            tool,
            arguments:
              args
          }
        );
      return annotateFederatedLegalContent(
        source,
        content
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
    ASSESS_SOURCE_TOOL,
    FETCH_AUXILIARY_SOURCE_TOOL,
    COVERAGE_TOOL
  ]);

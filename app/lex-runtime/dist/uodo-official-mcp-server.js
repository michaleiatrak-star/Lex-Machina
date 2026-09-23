#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const BASE = "https://orzeczenia.uodo.gov.pl";
async function fetchText(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: "application/json, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
                "User-Agent": "LexMachina-UODO-MCP/0.1.6"
            }
        });
        const body = await response.text();
        if (!response.ok) {
            throw new Error("UODO_HTTP_" +
                response.status +
                ":" +
                body.slice(0, 500));
        }
        return body;
    }
    finally {
        clearTimeout(timeout);
    }
}
async function fetchJson(url) {
    const text = await fetchText(url);
    return JSON.parse(text);
}
function asObject(value) {
    return value &&
        typeof value ===
            "object" &&
        !Array.isArray(value)
        ? value
        : {};
}
function asString(value) {
    return typeof value ===
        "string" &&
        value.trim()
        ? value.trim()
        : undefined;
}
function asPositiveInt(value, fallback, max) {
    const parsed = typeof value ===
        "number" &&
        Number.isInteger(value)
        ? value
        : fallback;
    return Math.min(max, Math.max(1, parsed));
}
function textResult(value) {
    return {
        content: [
            {
                type: "text",
                text: typeof value ===
                    "string"
                    ? value
                    : JSON.stringify(value, null, 2)
            }
        ]
    };
}
function listUrl() {
    return (BASE +
        "/api/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo" +
        "?order=-id&fields=id,refid,refname");
}
async function recentRows() {
    const payload = await fetchJson(listUrl());
    if (Array.isArray(payload)) {
        return payload
            .filter((item) => item &&
            typeof item ===
                "object" &&
            !Array.isArray(item))
            .map((item) => item);
    }
    const object = asObject(payload);
    for (const key of [
        "items",
        "results",
        "data",
        "documents"
    ]) {
        const value = object[key];
        if (Array.isArray(value)) {
            return value
                .filter((item) => item &&
                typeof item ===
                    "object" &&
                !Array.isArray(item))
                .map((item) => item);
        }
    }
    throw new Error("UODO_SEARCH_SHAPE_UNRECOGNIZED");
}
function rowText(row) {
    return [
        row.refname,
        row.refid,
        row.id
    ]
        .filter((value) => value !==
        undefined &&
        value !==
            null)
        .join(" ")
        .toLowerCase();
}
async function resolveId(signatureOrId) {
    if (/^\d+$/.test(signatureOrId)) {
        return signatureOrId;
    }
    const wanted = signatureOrId
        .trim()
        .toLowerCase();
    const rows = await recentRows();
    const matches = rows.filter((row) => String(row.refname ??
        "")
        .trim()
        .toLowerCase() ===
        wanted ||
        String(row.refid ??
            "")
            .trim()
            .toLowerCase() ===
            wanted);
    if (matches.length !==
        1) {
        throw new Error(matches.length ===
            0
            ? "UODO_EXACT_REFERENCE_NOT_FOUND_IN_1Y_INDEX"
            : "UODO_REFERENCE_AMBIGUOUS");
    }
    const id = matches[0]?.id;
    if (id === undefined ||
        id === null) {
        throw new Error("UODO_DOCUMENT_ID_MISSING");
    }
    return String(id);
}
async function getDecision(signatureOrId) {
    const id = await resolveId(signatureOrId);
    const meta = await fetchJson(BASE +
        "/api/documents/events/" +
        encodeURIComponent(id));
    const xml = await fetchText(BASE +
        "/api/documents/events/" +
        encodeURIComponent(id) +
        "/000_pl.xml");
    return {
        id,
        metadata: meta,
        fullTextXml: xml,
        sourceUrl: BASE +
            "/api/documents/events/" +
            encodeURIComponent(id),
        authority: "Prezes UODO",
        legalStatus: "decyzja organu; materiał decyzyjny, nie źródło prawa"
    };
}
const tools = [
    {
        name: "uodo_search",
        description: "Search the official UODO decision index. The built-in fallback uses the live one-year official index and filters public metadata locally; empty results are OUT_OF_SCOPE, not proof of non-existence.",
        inputSchema: {
            type: "object",
            properties: {
                keyword: {
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
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: 50
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "uodo_get_decision",
        description: "Fetch UODO decision metadata and full official XML by numeric document id or exact public signature/refid visible in the one-year index.",
        inputSchema: {
            type: "object",
            required: [
                "urn_or_signature"
            ],
            properties: {
                urn_or_signature: {
                    type: "string"
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "uodo_recent",
        description: "Return recent UODO decisions from the official one-year index.",
        inputSchema: {
            type: "object",
            properties: {
                limit: {
                    type: "integer",
                    minimum: 1,
                    maximum: 50
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "uodo_by_gdpr_article",
        description: "Best-effort lookup of recent UODO decisions mentioning a GDPR article. Searches the official one-year index metadata first; use full-document verification before relying on a proposition.",
        inputSchema: {
            type: "object",
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
                    type: "integer",
                    minimum: 1,
                    maximum: 25
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "uodo_stats",
        description: "Return live index health and counts for the built-in official UODO fallback.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
];
const server = new Server({
    name: "lex-uodo-official-mcp",
    version: "0.1.6"
}, {
    capabilities: {
        tools: {}
    }
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const args = asObject(request.params
            .arguments);
        if (request.params.name ===
            "uodo_recent") {
            const rows = await recentRows();
            const limit = asPositiveInt(args.limit, 10, 50);
            return textResult({
                status: "FOUND",
                source: BASE,
                transport: "official-public-api",
                scope: "official UODO one-year index",
                results: rows.slice(0, limit)
            });
        }
        if (request.params.name ===
            "uodo_search") {
            const rows = await recentRows();
            const keyword = asString(args.keyword)
                ?.toLowerCase();
            const page = asPositiveInt(args.page, 1, 10_000);
            const size = asPositiveInt(args.size, 20, 50);
            const filtered = keyword
                ? rows.filter((row) => rowText(row).includes(keyword))
                : rows;
            const start = (page - 1) *
                size;
            return textResult({
                status: filtered.length >
                    0
                    ? "FOUND"
                    : "OUT_OF_SCOPE",
                scope: "official UODO one-year metadata index",
                limitation: "Built-in fallback filters public index metadata locally; it does not claim exhaustive historical full-text search.",
                totalInScope: filtered.length,
                results: filtered.slice(start, start +
                    size)
            });
        }
        if (request.params.name ===
            "uodo_get_decision") {
            const value = asString(args
                .urn_or_signature);
            if (!value) {
                throw new Error("UODO_REFERENCE_REQUIRED");
            }
            return textResult(await getDecision(value));
        }
        if (request.params.name ===
            "uodo_by_gdpr_article") {
            const article = args.article;
            if (typeof article !==
                "string" &&
                typeof article !==
                    "number") {
                throw new Error("UODO_GDPR_ARTICLE_REQUIRED");
            }
            const rows = await recentRows();
            const needle = "art. " +
                String(article)
                    .trim()
                    .toLowerCase();
            const limit = asPositiveInt(args.limit, 10, 25);
            const results = rows.filter((row) => rowText(row).includes(needle));
            return textResult({
                status: results.length >
                    0
                    ? "FOUND"
                    : "OUT_OF_SCOPE",
                scope: "official UODO one-year metadata index",
                limitation: "Use uodo_get_decision and inspect official XML before citing a proposition.",
                results: results.slice(0, limit)
            });
        }
        if (request.params.name ===
            "uodo_stats") {
            const rows = await recentRows();
            return textResult({
                status: "OK",
                source: BASE,
                indexWindow: "1Y",
                indexedRows: rows.length,
                first: rows[0] ??
                    null,
                transport: "official-public-api"
            });
        }
        return {
            isError: true,
            content: [
                {
                    type: "text",
                    text: "UNKNOWN_UODO_TOOL:" +
                        request.params.name
                }
            ]
        };
    }
    catch (error) {
        return {
            isError: true,
            content: [
                {
                    type: "text",
                    text: error instanceof Error
                        ? error.message
                        : String(error)
                }
            ]
        };
    }
});
await server.connect(new StdioServerTransport());

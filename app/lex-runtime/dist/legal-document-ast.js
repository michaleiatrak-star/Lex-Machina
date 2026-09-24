import { PERSON_CASES } from "./privacy/person-morphology.js";
const DOCUMENT_TYPES = new Set([
    "pleading",
    "contract",
    "opinion",
    "letter",
    "report",
    "other"
]);
const STYLE_PROFILES = new Set([
    "lex-classic-clean-v1",
    "lex-light-legal-design-v1",
    "lex-classic-tnr-v1"
]);
const SOURCE_TOKEN_RE = /\[PII:[A-Z_]+:\d{4}\]/;
const GENERATION_ALIAS_RE = /^\[LMPII:D\d{2}:[A-Z_]+:\d{4}\]$/;
const TOKEN_LIKE_RE = /\[(?:LMPII|PII):[^\]]+\]/;
function recordOf(value, code) {
    if (!value ||
        typeof value !== "object" ||
        Array.isArray(value)) {
        throw new Error(code);
    }
    return value;
}
function safeText(value, max, code) {
    if (typeof value !== "string" ||
        value.length > max ||
        /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
            .test(value)) {
        throw new Error(code);
    }
    if (TOKEN_LIKE_RE.test(value) ||
        SOURCE_TOKEN_RE.test(value)) {
        throw new Error("AST_TOKEN_IN_TEXT_NODE");
    }
    return value;
}
function parseInline(value, aliases, used) {
    const record = recordOf(value, "AST_INLINE_INVALID");
    if (record.type === "text") {
        return {
            type: "text",
            text: safeText(record.text, 100_000, "AST_TEXT_INVALID")
        };
    }
    if (record.type === "pii_ref") {
        const alias = typeof record.alias ===
            "string"
            ? record.alias
            : "";
        if (!GENERATION_ALIAS_RE
            .test(alias) ||
            !aliases.has(alias)) {
            throw new Error("AST_UNKNOWN_PII_ALIAS");
        }
        used.add(alias);
        if (record.case !== undefined &&
            !PERSON_CASES.includes(record.case)) {
            throw new Error("AST_PII_CASE_INVALID");
        }
        return {
            type: "pii_ref",
            alias,
            ...(record.case !== undefined
                ? { case: record.case }
                : {})
        };
    }
    if (record.type === "xref") {
        const targetId = safeText(record.targetId, 120, "AST_XREF_TARGET_INVALID");
        const label = safeText(record.label, 500, "AST_XREF_LABEL_INVALID");
        if (!/^[A-Za-z0-9_-]{1,120}$/
            .test(targetId)) {
            throw new Error("AST_XREF_TARGET_INVALID");
        }
        return {
            type: "xref",
            targetId,
            label
        };
    }
    throw new Error("AST_INLINE_TYPE_UNSUPPORTED");
}
function parseInlineArray(value, aliases, used) {
    if (!Array.isArray(value) ||
        value.length > 2_000) {
        throw new Error("AST_INLINE_ARRAY_INVALID");
    }
    return value.map((item) => parseInline(item, aliases, used));
}
function parseBlock(value, aliases, used, depth, ids) {
    if (depth > 4) {
        throw new Error("AST_DEPTH_LIMIT");
    }
    const record = recordOf(value, "AST_BLOCK_INVALID");
    const id = record.id === undefined
        ? undefined
        : safeText(record.id, 120, "AST_ID_INVALID");
    if (id) {
        if (!/^[A-Za-z0-9_-]{1,120}$/
            .test(id) ||
            ids.has(id)) {
            throw new Error("AST_ID_INVALID");
        }
        ids.add(id);
    }
    if (record.type ===
        "page_break") {
        return {
            type: "page_break"
        };
    }
    if (record.type === "heading") {
        if (record.level !== 1 &&
            record.level !== 2 &&
            record.level !== 3) {
            throw new Error("AST_HEADING_LEVEL_INVALID");
        }
        return {
            ...(id ? { id } : {}),
            type: "heading",
            level: record.level,
            content: parseInlineArray(record.content, aliases, used)
        };
    }
    if (record.type ===
        "paragraph" ||
        record.type ===
            "quote" ||
        record.type ===
            "signature") {
        return {
            ...(id ? { id } : {}),
            type: record.type,
            content: parseInlineArray(record.content, aliases, used)
        };
    }
    if (record.type === "list") {
        if (typeof record.ordered !==
            "boolean" ||
            !Array.isArray(record.items) ||
            record.items.length > 500) {
            throw new Error("AST_LIST_INVALID");
        }
        return {
            ...(id ? { id } : {}),
            type: "list",
            ordered: record.ordered,
            items: record.items.map((item) => parseInlineArray(item, aliases, used))
        };
    }
    if (record.type === "table") {
        if (!Array.isArray(record.rows) ||
            record.rows.length > 300) {
            throw new Error("AST_TABLE_INVALID");
        }
        const rows = record.rows.map((row) => {
            if (!Array.isArray(row) ||
                row.length > 30) {
                throw new Error("AST_TABLE_INVALID");
            }
            return row.map((cell) => {
                const cellRecord = recordOf(cell, "AST_TABLE_CELL_INVALID");
                if (!Array.isArray(cellRecord.blocks) ||
                    cellRecord.blocks.length >
                        100) {
                    throw new Error("AST_TABLE_CELL_INVALID");
                }
                return {
                    blocks: cellRecord.blocks
                        .map((block) => parseBlock(block, aliases, used, depth + 1, ids))
                };
            });
        });
        return {
            ...(id ? { id } : {}),
            type: "table",
            rows
        };
    }
    throw new Error("AST_BLOCK_TYPE_UNSUPPORTED");
}
function allInlineNodes(ast) {
    const result = [];
    const visitBlock = (block) => {
        if (block.type ===
            "paragraph" ||
            block.type ===
                "heading" ||
            block.type ===
                "quote" ||
            block.type ===
                "signature") {
            result.push(...block.content);
        }
        else if (block.type === "list") {
            for (const item of block.items) {
                result.push(...item);
            }
        }
        else if (block.type === "table") {
            for (const row of block.rows) {
                for (const cell of row) {
                    for (const child of cell.blocks) {
                        visitBlock(child);
                    }
                }
            }
        }
    };
    if (ast.title) {
        result.push(...ast.title);
    }
    for (const block of ast.blocks) {
        visitBlock(block);
    }
    return result;
}
export function validateLegalDocumentAst(value, aliasEntries) {
    if (aliasEntries.length >
        20_000) {
        throw new Error("ALIAS_MANIFEST_LIMIT");
    }
    const aliasMap = new Map();
    for (const entry of aliasEntries) {
        if (!GENERATION_ALIAS_RE
            .test(entry.alias) ||
            !/^doc_[a-f0-9]{24}$/
                .test(entry.documentId) ||
            !/^\[PII:[A-Z_]+:\d{4}\]$/
                .test(entry.sourceToken) ||
            typeof entry.kind !==
                "string" ||
            aliasMap.has(entry.alias)) {
            throw new Error("ALIAS_MANIFEST_INVALID");
        }
        aliasMap.set(entry.alias, entry);
    }
    const record = recordOf(value, "AST_INVALID");
    if (record.schemaVersion !== "1" ||
        !DOCUMENT_TYPES.has(record.documentType) ||
        record.locale !== "pl-PL" ||
        !STYLE_PROFILES.has(record.styleProfile) ||
        !Array.isArray(record.blocks) ||
        record.blocks.length >
            5_000) {
        throw new Error("AST_HEADER_INVALID");
    }
    const used = new Set();
    const ids = new Set();
    const ast = {
        schemaVersion: "1",
        documentType: record.documentType,
        locale: "pl-PL",
        styleProfile: record.styleProfile,
        ...(record.title !==
            undefined
            ? {
                title: parseInlineArray(record.title, aliasMap, used)
            }
            : {}),
        blocks: record.blocks.map((block) => parseBlock(block, aliasMap, used, 0, ids))
    };
    const knownTargets = ids;
    for (const inline of allInlineNodes(ast)) {
        if (inline.type === "xref" &&
            !knownTargets.has(inline.targetId)) {
            throw new Error("AST_XREF_TARGET_MISSING");
        }
    }
    return {
        ast,
        aliasesUsed: [...used].sort()
    };
}
export function legalDocumentPlainText(ast) {
    const inlineText = (nodes) => nodes
        .map((node) => node.type ===
        "text"
        ? node.text
        : node.type ===
            "pii_ref"
            ? node.case
                ? node.alias.slice(0, -1) + "|" + node.case + "]"
                : node.alias
            : node.label)
        .join("");
    const output = [];
    if (ast.title) {
        output.push(inlineText(ast.title));
    }
    const renderBlock = (block) => {
        if (block.type ===
            "paragraph" ||
            block.type ===
                "heading" ||
            block.type ===
                "quote" ||
            block.type ===
                "signature") {
            output.push(inlineText(block.content));
            return;
        }
        if (block.type === "list") {
            for (const item of block.items) {
                output.push(inlineText(item));
            }
            return;
        }
        if (block.type === "table") {
            for (const row of block.rows) {
                const cells = [];
                for (const cell of row) {
                    const before = output.length;
                    for (const child of cell.blocks) {
                        renderBlock(child);
                    }
                    cells.push(output
                        .splice(before)
                        .join(" "));
                }
                output.push(cells.join(" | "));
            }
        }
    };
    for (const block of ast.blocks) {
        renderBlock(block);
    }
    return output
        .filter(Boolean)
        .join("\n");
}

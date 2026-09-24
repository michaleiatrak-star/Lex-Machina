import { SESSION_EXECUTION_INTERNAL } from "./session-executor.js";
import { validateLegalDocumentAst } from "./legal-document-ast.js";
function extractJson(value) {
    const trimmed = value.trim();
    const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
    const source = fenced?.[1] ?? trimmed;
    const first = source.indexOf("{");
    const last = source.lastIndexOf("}");
    if (first < 0 || last < first) {
        throw new Error("DOCUMENT_AST_JSON_MISSING");
    }
    try {
        return JSON.parse(source.slice(first, last + 1));
    }
    catch {
        throw new Error("DOCUMENT_AST_JSON_INVALID");
    }
}
function generationInstruction(request) {
    const aliasRows = request.aliases.entries
        .map((entry) => entry.sourceToken + " -> " + entry.alias + " (" + entry.kind +
        (entry.gender === "f"
            ? ", rodzaj żeński"
            : entry.gender === "m"
                ? ", rodzaj męski"
                : entry.gender === "unknown"
                    ? ", rodzaj nieustalony - formy neutralne"
                    : "") +
        ")")
        .join("\n");
    return [
        request.query,
        "",
        "# OUTPUT CONTRACT — LEGAL DOCUMENT AST",
        "Return ONLY one JSON object. No Markdown fence, explanation, commentary or prose outside JSON.",
        "schemaVersion must equal \"1\".",
        "documentType must equal \"" + request.documentType + "\".",
        "locale must equal \"pl-PL\".",
        "styleProfile must equal \"" + request.styleProfile + "\".",
        "Allowed block types: heading(level 1-3), paragraph, quote, list, table, signature, page_break.",
        "Allowed inline types: text, pii_ref, xref.",
        "Generate the actual finished legal document, not a chat answer about the document.",
        "Do not add meta-sections such as DANE DO UZUPEŁNIENIA, UWAGI PRAKTYCZNE, CO DALEJ, HYBRID-VALIDATION, disclaimers, routing notes or explanations outside the document itself.",
        "Use a professional Polish legal-office layout: concise title, date/party/address blocks where appropriate, clear subject or heading, logically separated body paragraphs, numbered or bulleted demands only when useful, and a signature block.",
        "For reusable templates, place missing user data directly in neutral square-bracket fields such as [Miejscowość, data], [Kwota] or [Termin zapłaty]; never use the marker [UZUPEŁNIJ].",
        "Avoid Markdown markers such as **, # or backticks inside text nodes. Structure belongs in AST block types.",
        "For a demand for payment, include at minimum: parties, title WEZWANIE DO ZAPŁATY, basis/description of the debt, amount, due date, an additional payment deadline, payment method/account placeholder, consequence of non-payment stated proportionately, and signature.",
        "Never emit raw OOXML, ODF, HTML, scripts, macros, URLs as package relationships, or executable content.",
        "Never place token-looking syntax inside a text node.",
        "When protected source context contains a source PII token listed below, use its generation alias only as a typed pii_ref node.",
        "HARD GATE: every PERSON or ADDRESS pii_ref MUST carry the grammatical case of that occurrence as \"case\" (a pii_ref without it is an error): NOM, GEN, DAT, ACC, INS, LOC or VOC, e.g. {\"type\":\"pii_ref\",\"alias\":\"[LMPII:D01:PERSON:0001]\",\"case\":\"GEN\"} after \"wobec\" or \"od\", or \"LOC\" for an ADDRESS after \"przy\". The value is inflected locally; never write the name or address yourself.",
        "Agree verbs, adjectives and participles with the gender given for a PERSON alias in the map below (e.g. \"wniosła\"/\"wniósł\", \"pozwana\"/\"pozwany\"); for an undetermined gender use neutral wording.",
        "Do not invent aliases. Do not attempt to infer the underlying clear value.",
        "",
        "# PROVIDER-SAFE PII ALIAS MAP",
        aliasRows || "(no aliases available)"
    ].join("\n");
}
export class LegalDocumentAstGenerator {
    sessions;
    constructor(sessions) {
        this.sessions = sessions;
    }
    async generate(request) {
        const result = await this.sessions.execute({
            query: generationInstruction(request),
            provider: request.provider,
            model: request.model,
            primarySkill: request.primarySkill,
            mode: request.mode,
            ...(request.attachments?.length
                ? { documentAttachments: request.attachments }
                : {})
        });
        if (result.status !== "DRAFT_PRESENTABLE" ||
            result.finalization !== "PASS" ||
            result.audit.result !== "PASS" ||
            !result.answer) {
            throw new Error("DOCUMENT_AST_SESSION_BLOCKED");
        }
        const parsed = extractJson(result.answer);
        const validated = validateLegalDocumentAst(parsed, request.aliases.entries);
        if (validated.ast.documentType !== request.documentType ||
            validated.ast.styleProfile !== request.styleProfile) {
            throw new Error("DOCUMENT_AST_CONTRACT_MISMATCH");
        }
        const internal = result[SESSION_EXECUTION_INTERNAL];
        if (!internal) {
            throw new Error("DOCUMENT_AST_INTERNAL_VALIDATION_MISSING");
        }
        return {
            ast: validated.ast,
            aliasesUsed: validated.aliasesUsed,
            sessionId: result.sessionId,
            validationContext: {
                schemaVersion: 1,
                sourceSessionId: result.sessionId,
                primarySkill: request.primarySkill,
                provider: request.provider,
                model: request.model,
                usedDocumentContext: Boolean(request.attachments
                    ?.length),
                verificationRecords: internal
                    .verificationRecords
                    .map((record) => ({
                    ...record
                })),
                auditEvents: internal.auditEvents
                    .map((event) => ({
                    ...event,
                    ...(event.detail
                        ? {
                            detail: {
                                ...event.detail
                            }
                        }
                        : {})
                }))
            }
        };
    }
}

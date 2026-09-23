const MARKER = /\[\[LEXDOC:([^:\]\r\n]{1,180}):(\d{1,7})\]\]/g;
const MAX_QUOTE_SCAN = 4_500;
function quoteBefore(text, markerStart) {
    const window = text.slice(Math.max(0, markerStart - MAX_QUOTE_SCAN), markerStart).trimEnd();
    const candidates = [
        /„([^„”]{2,4000})”\s*$/s,
        /“([^“”]{2,4000})”\s*$/s,
        /"([^"\r\n]{2,4000})"\s*$/s,
        /'([^'\r\n]{2,4000})'\s*$/s
    ];
    for (const pattern of candidates) {
        const match = window.match(pattern);
        const quote = match?.[1]?.trim();
        if (quote)
            return quote;
    }
    return undefined;
}
function locateQuote(contextText, quote) {
    if (!quote)
        return undefined;
    const direct = contextText.indexOf(quote);
    if (direct >= 0) {
        return { start: direct, end: direct + quote.length };
    }
    // Permit only whitespace folding, never fuzzy semantic matching. This keeps
    // highlighting anchored to actual document text rather than model wording.
    const tokens = quote.split(/\s+/).filter(Boolean);
    if (tokens.length === 0)
        return undefined;
    const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(escaped.join("\\s+"), "u");
    const match = pattern.exec(contextText);
    if (!match || match.index < 0)
        return undefined;
    return {
        start: match.index,
        end: match.index + match[0].length
    };
}
export function documentCitationSystemPrompt(attachments) {
    if (attachments.length === 0)
        return "";
    return [
        "# LOCAL DOCUMENT CITATION PROTOCOL",
        "When you quote or closely rely on an attached local document, cite the exact chunk immediately after the relevant sentence or quotation using this internal marker:",
        "[[LEXDOC:<documentId>:<chunkIndex>]]",
        "Use only documentId and chunkIndex values present in LOCAL_DOCUMENT_CONTEXT.",
        "Never invent a document id, page, chunk, quote, or marker.",
        "For a verbatim quotation, place the marker immediately after the closing quotation mark so the application can validate and highlight the exact passage.",
        "Markers are machine-readable metadata and will be replaced by clickable in-chat citations before presentation."
    ].join("\n");
}
export function processDocumentCitationMarkers(text, attachments) {
    const chunks = new Map();
    for (const attachment of attachments) {
        for (const chunk of attachment.chunks) {
            chunks.set(`${attachment.documentId}:${chunk.index}`, {
                attachment,
                chunk
            });
        }
    }
    const citations = [];
    let rejectedMarkers = 0;
    let output = "";
    let cursor = 0;
    let match;
    MARKER.lastIndex = 0;
    while ((match = MARKER.exec(text)) !== null) {
        output += text.slice(cursor, match.index);
        const documentId = match[1] ?? "";
        const chunkIndex = Number(match[2]);
        const resolved = chunks.get(`${documentId}:${chunkIndex}`);
        if (!resolved || !Number.isInteger(chunkIndex)) {
            rejectedMarkers += 1;
            cursor = match.index + match[0].length;
            continue;
        }
        const citationId = `docref_${citations.length + 1}`;
        const marker = `[[LEXDOCREF:${citationId}]]`;
        const quote = quoteBefore(text, match.index);
        const location = locateQuote(resolved.chunk.text, quote);
        const pageLabel = resolved.chunk.pageStart === resolved.chunk.pageEnd
            ? `s. ${resolved.chunk.pageStart}`
            : `s. ${resolved.chunk.pageStart}–${resolved.chunk.pageEnd}`;
        const citation = {
            citationId,
            marker,
            label: `Dokument ${citations.length + 1}, ${pageLabel}`,
            ...(resolved.attachment.caseId
                ? { caseId: resolved.attachment.caseId }
                : {}),
            documentId,
            chunkIndex,
            pageStart: resolved.chunk.pageStart,
            pageEnd: resolved.chunk.pageEnd,
            contextText: resolved.chunk.text,
            ...(quote ? { quote } : {}),
            ...(location
                ? {
                    highlightStart: location.start,
                    highlightEnd: location.end
                }
                : {})
        };
        citations.push(citation);
        output += marker;
        cursor = match.index + match[0].length;
    }
    output += text.slice(cursor);
    return {
        text: output,
        citations,
        rejectedMarkers
    };
}

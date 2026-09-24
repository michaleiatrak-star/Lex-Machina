import { PII_TOKEN_WITH_CASE } from "./pseudonymizer.js";
/** Values below this confidence are shown as "check this". */
export const RESTORATION_REVIEW_CONFIDENCE = 0.8;
export function restoreWithReport(text, vault) {
    const restorations = [];
    const unresolved = new Set();
    let output = "";
    let cursor = 0;
    for (const match of text.matchAll(new RegExp(PII_TOKEN_WITH_CASE.source, "g"))) {
        const [token, kind, sequence, requestedCase] = match;
        const base = `[PII:${kind}:${sequence}]`;
        output += text.slice(cursor, match.index);
        cursor = match.index + token.length;
        if (!vault.hasToken(base)) {
            unresolved.add(token);
            output += token;
            continue;
        }
        const restored = vault.restore(base, requestedCase ?? null);
        const entity = vault.entity(base);
        const start = output.length;
        output += restored.text;
        restorations.push({
            start,
            end: output.length,
            token: base,
            kind: restored.kind,
            ...(requestedCase ? { case: requestedCase } : entity ? { case: "NOM" } : {}),
            text: restored.text,
            source: entity ? restored.source : "vault",
            confidence: restored.confidence,
            status: restored.status === "ok" && entity && entity.status !== "ok"
                ? entity.status
                : restored.status === "unknown_token"
                    ? "no_forms"
                    : restored.status,
            ...(entity ? { canonical: entity.canonical } : {}),
            // Gender matters for remembering a person's name form, not for addresses.
            ...(entity && (entity.gender === "m1" || entity.gender === "f") ? { gender: entity.gender } : {})
        });
    }
    output += text.slice(cursor);
    return { text: output, restorations, unresolved: [...unresolved] };
}
export function needsReview(restoration) {
    return restoration.status !== "ok" || restoration.confidence < RESTORATION_REVIEW_CONFIDENCE;
}

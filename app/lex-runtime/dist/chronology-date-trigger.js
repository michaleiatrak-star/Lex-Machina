const NUMERIC_DATE = /\b(?:0?[1-9]|[12]\d|3[01])[.\/-](?:0?[1-9]|1[0-2])[.\/-](?:19|20)\d{2}\b/g;
const ISO_DATE = /\b(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b/g;
const POLISH_DATE = /\b(?:0?[1-9]|[12]\d|3[01])\s+(?:stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|wrzesnia|października|pazdziernika|listopada|grudnia)\s+(?:19|20)\d{2}\b/giu;
function normalizeDateToken(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}
export function distinctChronologyDateTokens(texts) {
    const dates = new Set();
    for (const input of texts) {
        const text = typeof input === "string"
            ? input
            : "";
        for (const pattern of [
            NUMERIC_DATE,
            ISO_DATE,
            POLISH_DATE
        ]) {
            pattern.lastIndex = 0;
            for (const match of text.matchAll(pattern)) {
                const token = normalizeDateToken(match[0]);
                if (token) {
                    dates.add(token);
                }
                if (dates.size >= 64) {
                    break;
                }
            }
            if (dates.size >= 64) {
                break;
            }
        }
        if (dates.size >= 64) {
            break;
        }
    }
    return [...dates].sort();
}
export function chronologyTemporalGateRequired(texts) {
    return (distinctChronologyDateTokens(texts).length >= 2);
}

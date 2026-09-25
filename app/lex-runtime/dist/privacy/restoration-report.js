import { PII_TOKEN_WITH_CASE } from "./pseudonymizer.js";
const AGREEMENT_LABEL = {
    "sg-m": "rodzaj męski",
    "sg-f": "rodzaj żeński",
    "pl-m": "liczba mnoga męskoosobowa",
    "pl-f": "liczba mnoga niemęskoosobowa"
};
// Role words before a subject token ("pozwana [..]"), nominative only.
const ROLE_AGREEMENT = {
    pozwany: "sg-m", pozwana: "sg-f", pozwani: "pl-m", pozwane: "pl-f",
    powód: "sg-m", powódka: "sg-f", powodowie: "pl-m", powódki: "pl-f",
    wnioskodawca: "sg-m", wnioskodawczyni: "sg-f", wnioskodawcy: "pl-m", wnioskodawczynie: "pl-f",
    uczestnik: "sg-m", uczestniczka: "sg-f", uczestnicy: "pl-m", uczestniczki: "pl-f",
    oskarżony: "sg-m", oskarżona: "sg-f", oskarżeni: "pl-m", oskarżone: "pl-f",
    dłużnik: "sg-m", dłużniczka: "sg-f", dłużnicy: "pl-m", dłużniczki: "pl-f",
    wierzyciel: "sg-m", wierzycielka: "sg-f", wierzyciele: "pl-m", wierzycielki: "pl-f",
    najemca: "sg-m", najemczyni: "sg-f", najemcy: "pl-m"
};
/** What the key says the token agrees with; null when the key is not certain. */
function expectedAgreement(entity) {
    if (!entity)
        return null;
    // A firm agrees through "spółka"/"firma": feminine.
    if (entity.type === "organization")
        return "sg-f";
    if (entity.status === "gender_ambiguous" || entity.warnings.includes("GENDER_HEURISTIC"))
        return null;
    if (entity.gender !== "m1" && entity.gender !== "f")
        return null;
    return `${entity.number === "pl" ? "pl" : "sg"}-${entity.gender === "f" ? "f" : "m"}`;
}
/** Past-tense form after a subject: wniósł / wniosła / wnieśli / wniosły (zrobił, poszedł, mógł, wziął). */
function verbAgreement(word) {
    if (word.length < 4 || word !== word.toLocaleLowerCase("pl"))
        return null;
    if (/(?:[aeiouyęąó]|[śzdrkgn])li$/u.test(word))
        return "pl-m";
    if (/(?:[aeiouyęąó]|[szdrkg])ły$/u.test(word))
        return "pl-f";
    if (/(?:[aeiouyęąó]|[szdrkg])ła$/u.test(word))
        return "sg-f";
    if (/(?:[aeiouyęąó]|[szdrkg])ł$/u.test(word))
        return "sg-m";
    return null;
}
/**
 * Agreement notes for subject tokens in a model's text: a past-tense verb
 * right after the token, or a role word right before it, that disagrees with
 * the gender and number in the key. Works for [PII:...] and for the aliases
 * of generated documents ([LMPII:Dnn:...]); keyed by the token's position.
 */
export function agreementIssues(text, entityOf) {
    const issues = new Map();
    const pattern = /\[((?:LMPII:D\d{2}|PII):PERSON:\d{4})(?:\|([A-Z]{2,4}))?\]/g;
    for (const match of text.matchAll(pattern)) {
        // Only a subject: nominative or no case written.
        if (match[2] && match[2] !== "NOM")
            continue;
        const expected = expectedAgreement(entityOf(`[${match[1]}]`));
        if (!expected)
            continue;
        const after = text.slice(match.index + match[0].length, match.index + match[0].length + 60);
        // "[A] i [B] wnieśli": a list agrees as a whole, not checked per token.
        if (/^\s*(?:,|i|oraz)\s*\[(?:LMPII|PII):/u.test(after))
            continue;
        const before = text.slice(Math.max(0, match.index - 40), match.index);
        if (/\[(?:LMPII|PII):[^\]]+\]\s*(?:,|i|oraz)\s*$/u.test(before))
            continue;
        const verb = /^\s+(?:się\s+|nie\s+)?(\p{Ll}+)(?![\p{L}])/u.exec(after)?.[1];
        const role = /(?<![\p{L}])(\p{L}+)\s+$/u.exec(before)?.[1]?.toLocaleLowerCase("pl");
        const found = [
            verb ? { word: verb, agreement: verbAgreement(verb) } : null,
            role && ROLE_AGREEMENT[role] ? { word: role, agreement: ROLE_AGREEMENT[role] } : null
        ].find((item) => item?.agreement && item.agreement !== expected);
        if (found) {
            issues.set(match.index, `„${found.word}” nie zgadza się z kluczem (${AGREEMENT_LABEL[expected]})`);
        }
    }
    return issues;
}
/** Values below this confidence are shown as "check this". */
export const RESTORATION_REVIEW_CONFIDENCE = 0.8;
export function restoreWithReport(text, vault) {
    const restorations = [];
    const unresolved = new Set();
    const agreement = agreementIssues(text, (token) => vault.entity(token));
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
            ...(requestedCase ? { case: requestedCase } : entity ? { case: "NOM", caseMissing: true } : {}),
            text: restored.text,
            source: entity ? restored.source : "vault",
            confidence: restored.confidence,
            status: restored.status === "ok" && entity && entity.status !== "ok"
                ? entity.status
                : restored.status === "unknown_token"
                    ? "no_forms"
                    : restored.status === "ok" && entity && (!requestedCase || agreement.has(match.index))
                        // No case (the nominative is a guess, hard gate) or a verb that
                        // disagrees with the key: a person checks it.
                        ? "needs_review"
                        : restored.status,
            ...(entity ? { canonical: entity.canonical } : {}),
            ...(agreement.has(match.index) ? { agreement: agreement.get(match.index) } : {}),
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

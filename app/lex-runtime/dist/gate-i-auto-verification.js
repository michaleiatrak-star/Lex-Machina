import { detectLegalReferences } from "./finalization-gate.js";
const ACT_ALIAS = /\b(KC|KPC|KK|KPK|KPA|KP|KRO|KSH|KW|KPW|PZP)\b/giu;
const SUPREME_COURT = /\b(?:SN|SĄD\s+NAJWYŻSZY|SĄDU\s+NAJWYŻSZEGO)\b/iu;
const CASE_SIGNATURE = /\bsygn\.?\s*(?:akt\s*)?([A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,8}(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,12}){0,3}\s+\d+\/\d{2,4})\b/iu;
const HISTORICAL_SCOPE = /\b(?:według\s+stanu\s+na|stan(?:u)?\s+(?:prawa\s+)?na|na\s+dzień)\s+(\d{4}-\d{2}-\d{2})\b/giu;
const EXPLICIT_UNVERIFIED_MARKER = "⚠️ [NIEWERYFIKOWANE]";
export function detectHistoricalAsOf(value) {
    const matches = [
        ...value.matchAll(HISTORICAL_SCOPE)
    ]
        .map((match) => match[1])
        .filter((date) => Boolean(date));
    const unique = [
        ...new Set(matches)
    ];
    return unique.length === 1
        ? unique[0]
        : undefined;
}
function ledgerRecordForScope(ledger, claim, asOf) {
    const records = ledger.find(claim);
    return [...records]
        .reverse()
        .find((record) => asOf
        ? record.asOf === asOf &&
            record.temporalMode ===
                "HISTORICAL"
        : !record.asOf &&
            record.temporalMode !==
                "HISTORICAL");
}
function normalizedClaim(value) {
    return value
        .normalize("NFKC")
        .toLocaleLowerCase("pl")
        .replace(/\s+/gu, " ")
        .trim();
}
function aliases(value) {
    return [
        ...new Set([...value.matchAll(ACT_ALIAS)]
            .map((match) => match[1]
            ?.toLocaleUpperCase("pl"))
            .filter((item) => Boolean(item)))
    ];
}
function uniqueActAlias(reference) {
    const claimAliases = aliases(reference.claim);
    if (claimAliases.length === 1) {
        return claimAliases[0];
    }
    if (claimAliases.length > 1) {
        return null;
    }
    const lineAliases = aliases(reference.lineText);
    return lineAliases.length === 1
        ? lineAliases[0]
        : null;
}
function caseSignature(reference) {
    if (reference.kind !== "case" ||
        !SUPREME_COURT.test(reference.lineText)) {
        return null;
    }
    return reference.claim
        .match(CASE_SIGNATURE)?.[1]
        ?.trim() ?? null;
}
export function planAutomaticLegalVerification(text, ledger, requestedAsOf) {
    const references = detectLegalReferences(text);
    const globalAsOf = requestedAsOf ??
        detectHistoricalAsOf(text);
    const calls = [];
    const skipped = [];
    const seen = new Set();
    for (const reference of references) {
        const key = normalizedClaim(reference.claim);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        const referenceAsOf = detectHistoricalAsOf(reference.lineText) ??
            globalAsOf;
        if (reference.lineText.includes(EXPLICIT_UNVERIFIED_MARKER)) {
            skipped.push({
                claim: reference.claim,
                reason: "EXPLICIT_UNVERIFIED_MARKER"
            });
            continue;
        }
        if (ledgerRecordForScope(ledger, reference.claim, referenceAsOf)) {
            skipped.push({
                claim: reference.claim,
                reason: "ALREADY_IN_LEDGER"
            });
            continue;
        }
        if (reference.kind ===
            "statute" ||
            reference.kind ===
                "journal") {
            const alias = uniqueActAlias(reference);
            if (!alias) {
                skipped.push({
                    claim: reference.claim,
                    reason: "ACT_ALIAS_AMBIGUOUS"
                });
                continue;
            }
            calls.push({
                id: `gate-i-auto-${calls.length + 1}`,
                name: "verify_legal_reference",
                input: {
                    claim: reference.claim,
                    kind: reference.kind,
                    act: alias,
                    ...(referenceAsOf
                        ? {
                            asOf: referenceAsOf
                        }
                        : {})
                }
            });
            continue;
        }
        if (reference.kind ===
            "case") {
            if (!SUPREME_COURT.test(reference.lineText)) {
                skipped.push({
                    claim: reference.claim,
                    reason: "COURT_FAMILY_AMBIGUOUS"
                });
                continue;
            }
            const signature = caseSignature(reference);
            if (!signature) {
                skipped.push({
                    claim: reference.claim,
                    reason: "CASE_SIGNATURE_INVALID"
                });
                continue;
            }
            calls.push({
                id: `gate-i-auto-${calls.length + 1}`,
                name: "verify_case_reference",
                input: {
                    claim: reference.claim,
                    signature,
                    courtFamily: "SN"
                }
            });
            continue;
        }
        skipped.push({
            claim: reference.claim,
            reason: "UNSUPPORTED_KIND"
        });
    }
    return {
        calls,
        skipped
    };
}
function marker(record) {
    if (record.status ===
        "UNVERIFIED") {
        return "⚠️ [NIEWERYFIKOWANE]";
    }
    if (record.status !==
        "VERIFIED" ||
        record.sourceTier ===
            "R2B" ||
        record.sourceTier ===
            "R3" ||
        !record.sourceUrl ||
        !record.fetchedAt) {
        return null;
    }
    return [
        "✅ [VER: ",
        record.sourceUrl,
        ", ",
        record.fetchedAt
            .slice(0, 10),
        record.asOf
            ? `, STAN NA ${record.asOf}`
            : "",
        "]"
    ].join("");
}
export function applyAutomaticVerificationMarkers(text, ledger, requestedAsOf) {
    const references = detectLegalReferences(text);
    const globalAsOf = requestedAsOf ??
        detectHistoricalAsOf(text);
    if (references.length === 0) {
        return {
            text,
            inserted: 0
        };
    }
    const byLine = new Map();
    for (const reference of references) {
        if (reference.lineText.includes(EXPLICIT_UNVERIFIED_MARKER)) {
            continue;
        }
        const referenceAsOf = detectHistoricalAsOf(reference.lineText) ??
            globalAsOf;
        const record = ledgerRecordForScope(ledger, reference.claim, referenceAsOf);
        if (!record) {
            continue;
        }
        const current = byLine.get(reference.line) ?? [];
        if (!current.some((item) => normalizedClaim(item.claim) ===
            normalizedClaim(record.claim))) {
            current.push(record);
            byLine.set(reference.line, current);
        }
    }
    if (byLine.size === 0) {
        return {
            text,
            inserted: 0
        };
    }
    let inserted = 0;
    const lines = text.split(/\r?\n/u)
        .map((line, index) => {
        const records = byLine.get(index + 1);
        if (!records ||
            records.length === 0) {
            return line;
        }
        const missingMarkers = records
            .map(marker)
            .filter((value) => Boolean(value))
            .filter((value) => !line.includes(value));
        if (missingMarkers.length ===
            0) {
            return line;
        }
        inserted +=
            missingMarkers.length;
        return [
            line.trimEnd(),
            ...missingMarkers
        ].join(" ");
    });
    return {
        text: lines.join("\n"),
        inserted
    };
}

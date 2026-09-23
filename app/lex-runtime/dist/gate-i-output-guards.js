const CRIMINAL_REFERENCE = /\bart\.?\s+\d+[a-ząćęłńóśźż]*(?:\s*§\s*\d+[a-z]*)?\s+(?:KK|KPK|KKS|KW|KPW)\b/giu;
const HIGH_RISK_CRIMINAL_SIGNAL = /\b(?:zawiadomieni[ae]\s+o\s+(?:możliwości\s+)?popełnieni[ua]\s+przestępstwa|odpowiedzialność\s+karna|kwalifikacja\s+karna)\b/giu;
function unique(values) {
    return [
        ...new Set(values.map((value) => value.trim())
            .filter(Boolean))
    ];
}
export function evaluateDomainLock(args) {
    const criminalDomainLoaded = args.loadedSkills.some((skill) => skill.startsWith("dr-03-"));
    const criminalLegalReferences = unique([
        ...args.text.matchAll(CRIMINAL_REFERENCE)
    ].map((match) => match[0] ?? ""));
    const unsupportedCriminalSignals = unique([
        ...args.text.matchAll(HIGH_RISK_CRIMINAL_SIGNAL)
    ].map((match) => match[0] ?? ""));
    const contamination = !criminalDomainLoaded &&
        (criminalLegalReferences.length >
            0 ||
            unsupportedCriminalSignals
                .length > 0);
    return {
        gate: "G39I_DOMAIN_LOCK",
        result: contamination
            ? "BLOCKED"
            : "PASS",
        criminalDomainLoaded,
        criminalLegalReferences,
        unsupportedCriminalSignals
    };
}
const RATE_TOPIC = /\b(?:odsetk\w*|waloryzac\w*|inflacj\w*|minimaln\w*\s+wynagrodzen\w*|przeciętn\w*\s+wynagrodzen\w*|rekompensat\w*\s+za\s+koszty\s+odzyskiwania\s+należności)\b/iu;
const NUMERIC_RATE = /(?:\b\d{1,3}(?:[.,]\d{1,4})?\s*%\b|\b\d{1,3}(?:[ .]\d{3})*(?:[.,]\d{1,2})?\s*(?:zł|PLN)\b)/iu;
const VERIFIED_OR_GAP = /(?:✅\s*\[VER:|⚠️?\s*\[NIEWERYFIKOWANE\]|⬛\s*\[(?:DO UZUPEŁNIENIA|UZUPEŁNIJ))/iu;
const AGGREGATE = /\b(?:łącznie|suma|kwota\s+łączna|razem\s+do\s+zapłaty|należność\s+łącznie)\b/iu;
const EXPLICIT_INTERVAL = /\b(?:od\s+\d{1,4}[-./]\d{1,2}[-./]\d{1,4}\s+do\s+\d{1,4}[-./]\d{1,2}[-./]\d{1,4}|przedział\s*[:=-]\s*\d{1,4}[-./]\d{1,2}[-./]\d{1,4}\s*(?:–|-|do)\s*\d{1,4}[-./]\d{1,2}[-./]\d{1,4})\b/iu;
const SERIES_HEADER = /\|\s*Od\s*\|\s*Do\s*\|\s*Stawka\s*\|/iu;
export function evaluateRateCompleteness(text) {
    const triggered = RATE_TOPIC.test(text);
    if (!triggered) {
        return {
            gate: "G39I_RATE_COMPLETENESS",
            result: "PASS",
            triggered: false,
            numericRateLines: 0,
            unverifiedNumericRateLines: 0,
            aggregateClaim: false,
            hasExplicitInterval: false,
            hasSeriesTable: false,
            missing: []
        };
    }
    const lines = text.split(/\r?\n/u);
    const numericLines = lines.filter((line) => RATE_TOPIC.test(line) &&
        NUMERIC_RATE.test(line));
    const unverified = numericLines.filter((line) => !VERIFIED_OR_GAP.test(line));
    const aggregateClaim = AGGREGATE.test(text) &&
        (NUMERIC_RATE.test(text) ||
            /\b\d+(?:[.,]\d+)?\s*(?:zł|PLN)\b/iu.test(text));
    const hasExplicitInterval = EXPLICIT_INTERVAL.test(text);
    const hasSeriesTable = SERIES_HEADER.test(text);
    const missing = [];
    if (numericLines.length > 0 &&
        unverified.length > 0) {
        missing.push("RATE_LINE_VERIFICATION_MARKER");
    }
    if (aggregateClaim &&
        !hasExplicitInterval) {
        missing.push("RATE_INTERVAL");
    }
    if (aggregateClaim &&
        !hasSeriesTable) {
        missing.push("RATE_SERIES_TABLE");
    }
    return {
        gate: "G39I_RATE_COMPLETENESS",
        result: missing.length === 0
            ? "PASS"
            : "BLOCKED",
        triggered,
        numericRateLines: numericLines.length,
        unverifiedNumericRateLines: unverified.length,
        aggregateClaim,
        hasExplicitInterval,
        hasSeriesTable,
        missing
    };
}

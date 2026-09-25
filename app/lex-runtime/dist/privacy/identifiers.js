/**
 * Deterministic detectors for identification numbers. Every number with a
 * checksum is validated, so ordinary numbers (amounts, case numbers, article
 * numbers) are not taken for identifiers; numbers without a checksum
 * (KRS, birth date, registration plate, 9-digit phone) need their context word.
 */
function digits(value) {
    return value.replace(/\D/g, "");
}
function weighted(raw, weights) {
    return weights.reduce((sum, weight, index) => sum + weight * Number(raw[index]), 0);
}
export function validPesel(value) {
    const raw = digits(value);
    if (!/^\d{11}$/.test(raw))
        return false;
    const month = Number(raw.slice(2, 4)) % 20;
    const day = Number(raw.slice(4, 6));
    if (month < 1 || month > 12 || day < 1 || day > 31)
        return false;
    return (10 - (weighted(raw, [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]) % 10)) % 10 === Number(raw[10]);
}
export function validNip(value) {
    const raw = digits(value);
    if (!/^\d{10}$/.test(raw) || /^0{10}$/.test(raw))
        return false;
    return weighted(raw, [6, 5, 7, 2, 3, 4, 5, 6, 7]) % 11 === Number(raw[9]);
}
export function validRegon(value) {
    const raw = digits(value);
    if (/^0+$/.test(raw))
        return false;
    if (raw.length === 9) {
        return (weighted(raw, [8, 9, 2, 3, 4, 5, 6, 7]) % 11) % 10 === Number(raw[8]);
    }
    if (raw.length === 14) {
        return validRegon(raw.slice(0, 9)) &&
            (weighted(raw, [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8]) % 11) % 10 === Number(raw[13]);
    }
    return false;
}
export function validIban(value) {
    let compact = value.replace(/[\s-]/g, "").toUpperCase();
    if (/^\d{26}$/.test(compact))
        compact = "PL" + compact;
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(compact))
        return false;
    if (compact.startsWith("PL") && compact.length !== 28)
        return false;
    const rearranged = compact.slice(4) + compact.slice(0, 4);
    let remainder = 0;
    for (const char of rearranged) {
        const code = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
        for (const digit of code)
            remainder = (remainder * 10 + Number(digit)) % 97;
    }
    return remainder === 1;
}
function letterValue(char) {
    return /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55;
}
/** Polish ID card: ABC123456, first digit is the check digit. */
export function validIdCard(value) {
    const compact = value.replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z]{3}\d{6}$/.test(compact))
        return false;
    const weights = [7, 3, 1, 9, 7, 3, 1, 7, 3];
    const sum = [...compact].reduce((acc, char, index) => acc + weights[index] * letterValue(char), 0);
    return sum % 10 === 0;
}
/** Polish passport: AB1234567, first digit is the check digit. */
export function validPassport(value) {
    const compact = value.replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{7}$/.test(compact))
        return false;
    const weights = [7, 3, 9, 1, 7, 3, 1, 7, 3];
    const values = [...compact].map(letterValue);
    const check = values[2];
    const sum = values.reduce((acc, item, index) => (index === 2 ? acc : acc + weights[index] * item), 0);
    return sum % 10 === check;
}
const LAND_REGISTRY_VALUES = "0123456789XABCDEFGHIJKLMNOPRSTUWYZ";
/** Land and mortgage register number: WA1M/00012345/6. */
export function validLandRegistry(value) {
    const match = /^([A-Z]{2}\d[A-Z])\/(\d{8})\/(\d)$/.exec(value.toUpperCase());
    if (!match)
        return false;
    const chars = [...(match[1] + match[2])];
    const weights = [1, 3, 7];
    let sum = 0;
    for (let index = 0; index < chars.length; index += 1) {
        const valueOf = LAND_REGISTRY_VALUES.indexOf(chars[index]);
        if (valueOf < 0)
            return false;
        sum += valueOf * weights[index % 3];
    }
    return sum % 10 === Number(match[3]);
}
export function validLuhn(value) {
    const raw = digits(value);
    if (raw.length < 13 || raw.length > 19)
        return false;
    let sum = 0;
    for (let index = 0; index < raw.length; index += 1) {
        let digit = Number(raw[raw.length - 1 - index]);
        if (index % 2 === 1) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
}
const MONTHS = "stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia";
const DATE = `(?:\\d{1,2}[.\\-/]\\d{1,2}[.\\-/](?:19|20)\\d{2}|\\d{1,2}\\s+(?:${MONTHS})\\s+(?:19|20)\\d{2}|(?:19|20)\\d{2}-\\d{2}-\\d{2})(?:\\s*r\\.)?`;
const DETECTORS = [
    { kind: "PESEL", regex: /(?<![\d-])\d{11}(?![\d-])/g, validate: validPesel },
    {
        kind: "NIP",
        regex: /(?<![\w-])(?:PL\s?)?(?:\d{3}-\d{3}-\d{2}-\d{2}|\d{3}-\d{2}-\d{2}-\d{3}|\d{3} \d{3} \d{2} \d{2}|\d{10})(?![\w-])/g,
        validate: validNip
    },
    { kind: "REGON", regex: /(?<![\d-])(?:\d{9}|\d{14})(?![\d-])/g, validate: validRegon },
    {
        kind: "IBAN",
        regex: /(?<![\w])(?:[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]{4}){2,7}(?:[ -]?[A-Z0-9]{1,4})?|\d{2}(?:[ -]?\d{4}){6})(?![\w])/g,
        validate: validIban
    },
    { kind: "EMAIL", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
    {
        kind: "PHONE",
        regex: /(?<![\w+])(?:\+48[\s-]?)?(?:\d{3}[\s-]\d{3}[\s-]\d{3}|\(\d{2}\)\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\d{2}\s\d{3}\s\d{2}\s\d{2})(?!\d)/g
    },
    {
        kind: "PHONE",
        regex: /(?:tel\.?|telefon\w*|kom\.?|komórk\w*|fax)\s*(?:nr\.?\s*)?:?\s*((?:\+48\s?)?\d{9})(?!\d)/gi,
        group: 1
    },
    { kind: "PHONE", regex: /\+\d{2,3}[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3,4}(?!\d)/g },
    { kind: "ID_CARD", regex: /(?<![\w])[A-Z]{3}\s?\d{6}(?![\w])/g, validate: validIdCard },
    { kind: "PASSPORT", regex: /(?<![\w])[A-Z]{2}\s?\d{7}(?![\w])/g, validate: validPassport },
    { kind: "LAND_REGISTRY", regex: /(?<![\w])[A-Z]{2}\d[A-Z]\/\d{8}\/\d(?![\w])/g, validate: validLandRegistry },
    { kind: "KRS", regex: /\bKRS\s*(?:nr\.?|numer)?\s*:?\s*(\d{10})(?!\d)/g, group: 1 },
    {
        kind: "BIRTH_DATE",
        regex: new RegExp(`(?:ur\\.|urodzon[aey]j?|urodzin|data\\s+urodzenia|dat[ąy]\\s+urodzenia)\\s*(?:się\\s*)?(?:dnia\\s*|w\\s+dniu\\s*)?:?\\s*(${DATE})`, "giu"),
        group: 1
    },
    {
        kind: "VEHICLE_PLATE",
        regex: /(?:nr\.?\s+rej\.?|numer(?:ze|u)?\s+rejestracyjn\w*|tablic\w*\s+rejestracyjn\w*)\s*:?\s*([A-Z]{1,3}\s?[0-9A-Z]{4,5})(?![\w])/giu,
        group: 1
    },
    {
        kind: "PAYMENT_CARD",
        regex: /(?<![\d])(?:[3-6]\d{3}(?:[ -]?\d{4}){2}[ -]?\d{1,7})(?![\d])/g,
        validate: validLuhn
    }
];
export function detectIdentifiers(text) {
    const spans = [];
    for (const detector of DETECTORS) {
        for (const match of text.matchAll(detector.regex)) {
            const value = detector.group ? match[detector.group] : match[0];
            if (!value || typeof match.index !== "number")
                continue;
            const offset = detector.group ? match[0].lastIndexOf(value) : 0;
            if (offset < 0)
                continue;
            if (detector.validate && !detector.validate(value))
                continue;
            const start = match.index + offset;
            spans.push({
                start,
                end: start + value.length,
                kind: detector.kind,
                value,
                confidence: 1,
                source: "AUTO"
            });
        }
    }
    return spans;
}

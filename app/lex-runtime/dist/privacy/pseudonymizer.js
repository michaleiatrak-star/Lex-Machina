import { PERSON_CASES } from "./person-morphology.js";
/** [PII:PERSON:0001] or, with the grammatical case a model asked for, [PII:PERSON:0001|INS]. */
export const PII_TOKEN_WITH_CASE = /\[PII:([A-Z_]+):(\d{4})(?:\|([A-Z]{2,4}))?\]/g;
function personEntityKey(entity) {
    return `PERSON\u0000entity\u0000${entity.canonical.toLocaleLowerCase("pl")}\u0000${entity.gender}`;
}
function digits(value) {
    return value.replace(/\D/g, "");
}
function validPesel(value) {
    const raw = digits(value);
    if (!/^\d{11}$/.test(raw))
        return false;
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = weights.reduce((acc, weight, index) => acc + weight * Number(raw[index]), 0);
    return (10 - (sum % 10)) % 10 === Number(raw[10]);
}
function validNip(value) {
    const raw = digits(value);
    if (!/^\d{10}$/.test(raw))
        return false;
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const sum = weights.reduce((acc, weight, index) => acc + weight * Number(raw[index]), 0);
    return sum % 11 === Number(raw[9]);
}
function collectRegex(text, regex, kind, validate) {
    const spans = [];
    for (const match of text.matchAll(regex)) {
        const value = match[0];
        const start = match.index;
        if (typeof start !== "number" ||
            !value ||
            (validate && !validate(value))) {
            continue;
        }
        spans.push({
            start,
            end: start + value.length,
            kind,
            value,
            confidence: 1,
            source: "AUTO"
        });
    }
    return spans;
}
const PRIORITY = {
    PESEL: 100,
    NIP: 95,
    REGON: 90,
    IBAN: 85,
    EMAIL: 80,
    PHONE: 70,
    PERSON: 60,
    ADDRESS: 55,
    CUSTOM: 50
};
function overlaps(a, b) {
    return a.start < b.end && a.end > b.start;
}
function nonOverlapping(spans) {
    const sorted = [...spans].sort((a, b) => a.start - b.start ||
        (a.source === "USER" ? -1 : 1) -
            (b.source === "USER" ? -1 : 1) ||
        PRIORITY[b.kind] - PRIORITY[a.kind] ||
        (b.end - b.start) - (a.end - a.start));
    const accepted = [];
    for (const candidate of sorted) {
        if (candidate.start < 0 ||
            candidate.end <= candidate.start) {
            continue;
        }
        if (!accepted.some((current) => overlaps(candidate, current))) {
            accepted.push(candidate);
        }
    }
    return accepted.sort((a, b) => a.start - b.start);
}
function normalizeDirectives(text, directives) {
    const normalized = directives.map((directive) => {
        if (!Number.isInteger(directive.start) ||
            !Number.isInteger(directive.end) ||
            directive.start < 0 ||
            directive.end <= directive.start ||
            directive.end > text.length) {
            throw new Error("INVALID_PRIVACY_DIRECTIVE_RANGE");
        }
        const label = directive.label?.trim();
        if (directive.action === "LABEL" &&
            (!label || label.length > 120)) {
            throw new Error("INVALID_PRIVACY_DIRECTIVE_LABEL");
        }
        return {
            ...directive,
            ...(label ? { label } : {})
        };
    }).sort((a, b) => a.start - b.start || a.end - b.end);
    for (let index = 1; index < normalized.length; index += 1) {
        if (overlaps(normalized[index - 1], normalized[index])) {
            throw new Error("OVERLAPPING_PRIVACY_DIRECTIVES");
        }
    }
    return normalized;
}
export class PseudonymizationVault {
    tokenToValue = new Map();
    keyToToken = new Map();
    counters = new Map();
    tokenMetadata = new Map();
    tokenEntities = new Map();
    constructor(snapshot) {
        if (snapshot) {
            this.hydrate(snapshot);
        }
    }
    hydrate(snapshot) {
        for (const [kind, rawCount] of Object.entries(snapshot.counters)) {
            if (!Number.isInteger(rawCount) ||
                rawCount < 0) {
                throw new Error("INVALID_PRIVACY_VAULT_COUNTER");
            }
            this.counters.set(kind, rawCount);
        }
        for (const item of snapshot.tokens) {
            const match = /^\[PII:([A-Z_]+):(\d{4})\]$/
                .exec(item.token);
            if (!match ||
                match[1] !== item.kind ||
                typeof item.value !==
                    "string" ||
                typeof item.createdAt !==
                    "string" ||
                !Number.isFinite(Date.parse(item.createdAt)) ||
                this.tokenToValue.has(item.token)) {
                throw new Error("INVALID_PRIVACY_VAULT_TOKEN");
            }
            const key = `${item.kind}\u0000${item.value}`;
            if (this.keyToToken.has(key)) {
                throw new Error("DUPLICATE_PRIVACY_VAULT_VALUE");
            }
            const sequence = Number(match[2]);
            const counter = this.counters.get(item.kind) ?? 0;
            if (sequence > counter) {
                this.counters.set(item.kind, sequence);
            }
            this.keyToToken.set(key, item.token);
            this.tokenToValue.set(item.token, item.value);
            this.tokenMetadata.set(item.token, {
                kind: item.kind,
                createdAt: item.createdAt
            });
            if (item.entity) {
                this.tokenEntities.set(item.token, item.entity);
                this.keyToToken.set(personEntityKey(item.entity), item.token);
            }
        }
    }
    getOrCreate(kind, value, entity) {
        const key = `${kind}\u0000${value}`;
        const existing = this.keyToToken.get(key);
        if (existing) {
            return existing;
        }
        // One person, one token: "Jana Kowalskiego" and "Janem Kowalskim" are the
        // same Jan Kowalski.
        const entityKey = kind === "PERSON" && entity
            ? personEntityKey(entity)
            : null;
        const sameEntity = entityKey
            ? this.keyToToken.get(entityKey)
            : undefined;
        if (sameEntity) {
            this.keyToToken.set(key, sameEntity);
            return sameEntity;
        }
        const next = (this.counters.get(kind) ?? 0) + 1;
        this.counters.set(kind, next);
        const token = `[PII:${kind}:${String(next).padStart(4, "0")}]`;
        this.keyToToken.set(key, token);
        this.tokenToValue.set(token, value);
        this.tokenMetadata.set(token, {
            kind,
            createdAt: new Date()
                .toISOString()
        });
        if (entity && entityKey) {
            this.tokenEntities.set(token, entity);
            this.keyToToken.set(entityKey, token);
        }
        return token;
    }
    entity(token) {
        return this.tokenEntities.get(token);
    }
    /**
     * Value for a token in a model's output. A person token with a case
     * ([PII:PERSON:0001|INS]) gets that inflected form; a bare person token gets
     * the nominative. Other kinds return the stored value.
     */
    restore(token, requestedCase) {
        const value = this.tokenToValue.get(token);
        const metadata = this.tokenMetadata.get(token);
        if (value === undefined || !metadata) {
            throw new Error(`Unknown pseudonymization token: ${token}`);
        }
        const entity = this.tokenEntities.get(token);
        const validCase = requestedCase &&
            PERSON_CASES.includes(requestedCase)
            ? requestedCase
            : null;
        if (!entity) {
            return {
                token,
                requestedCase: validCase,
                text: value,
                kind: metadata.kind,
                source: "stored",
                confidence: 1,
                status: metadata.kind === "PERSON" && requestedCase
                    ? "no_forms"
                    : "ok"
            };
        }
        const form = entity.forms[validCase ?? "NOM"];
        return {
            token,
            requestedCase: validCase,
            text: form.text,
            kind: metadata.kind,
            source: form.source,
            confidence: form.confidence,
            status: requestedCase && !validCase
                ? "invalid_case"
                : "ok"
        };
    }
    hasToken(token) {
        return this.tokenToValue
            .has(token);
    }
    resolveToken(token) {
        const value = this.tokenToValue.get(token);
        if (value === undefined) {
            throw new Error(`Unknown pseudonymization token: ${token}`);
        }
        return value;
    }
    snapshot() {
        const counters = {};
        for (const [kind, count] of this.counters) {
            counters[kind] = count;
        }
        const tokens = [...this.tokenToValue
                .entries()]
            .map(([token, value]) => {
            const metadata = this.tokenMetadata
                .get(token);
            if (!metadata) {
                throw new Error("PRIVACY_VAULT_METADATA_MISSING");
            }
            const entity = this.tokenEntities.get(token);
            return {
                token,
                kind: metadata.kind,
                value,
                createdAt: metadata.createdAt,
                ...(entity
                    ? { entity }
                    : {})
            };
        })
            .sort((a, b) => a.token.localeCompare(b.token, "en"));
        return {
            counters,
            tokens
        };
    }
    deanonymize(text) {
        return text.replace(PII_TOKEN_WITH_CASE, (_match, kind, sequence, requestedCase) => this.restore(`[PII:${kind}:${sequence}]`, requestedCase ?? null).text);
    }
    get size() {
        return this.tokenToValue
            .size;
    }
}
export class LocalPolishPseudonymizer {
    vault;
    namedEntities;
    morphology;
    constructor(vault, namedEntities, morphology) {
        this.vault = vault;
        this.namedEntities = namedEntities;
        this.morphology = morphology;
    }
    async pseudonymize(text, directives = []) {
        const manual = normalizeDirectives(text, directives);
        const keep = manual.filter((item) => item.action === "KEEP");
        const labelDirectives = manual.filter((item) => item.action === "LABEL");
        const annotations = labelDirectives.map((item) => ({
            start: item.start,
            end: item.end,
            label: item.label
        }));
        const manualPseudonyms = manual
            .filter((item) => item.action === "PSEUDONYMIZE")
            .map((item) => ({
            start: item.start,
            end: item.end,
            kind: item.kind ?? "CUSTOM",
            value: text.slice(item.start, item.end),
            source: "USER",
            ...(item.label ? { label: item.label } : {})
        }));
        const autoSpans = [
            ...collectRegex(text, /\b\d{11}\b/g, "PESEL", validPesel),
            ...collectRegex(text, /\b\d{10}\b/g, "NIP", validNip),
            ...collectRegex(text, /\b(?:\d{9}|\d{14})\b/g, "REGON"),
            ...collectRegex(text, /\bPL(?:[\s-]?\d){26}\b/gi, "IBAN"),
            ...collectRegex(text, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "EMAIL"),
            ...collectRegex(text, /(?:\+48[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{3}\b/g, "PHONE")
        ];
        if (this.namedEntities) {
            const named = await this.namedEntities.recognize(text);
            for (const span of named) {
                if (text.slice(span.start, span.end) === span.value) {
                    autoSpans.push({
                        ...span,
                        source: "AUTO"
                    });
                }
            }
        }
        const autoAllowed = autoSpans.filter((span) => !keep.some((item) => overlaps(span, item)) &&
            !labelDirectives.some((item) => overlaps(span, item)) &&
            !manualPseudonyms.some((item) => overlaps(span, item)));
        const findings = nonOverlapping([
            ...manualPseudonyms,
            ...autoAllowed
        ]);
        let output = text;
        const publicFindings = [];
        // Canonical identity and paradigm of every person mention. Without the
        // morphology engine tokens fall back to exact-surface identity.
        const personEntities = new Map();
        if (this.morphology) {
            const persons = [
                ...new Set(findings
                    .filter((finding) => finding.kind === "PERSON")
                    .map((finding) => finding.value))
            ];
            if (persons.length > 0) {
                try {
                    const analysed = await this.morphology.analyze(persons);
                    persons.forEach((surface, index) => {
                        const entity = analysed[index];
                        if (entity) {
                            personEntities.set(surface, entity);
                        }
                    });
                }
                catch (error) {
                    process.stderr.write(`PERSON_MORPHOLOGY_DEGRADED:${error instanceof Error ? error.message : String(error)}\n`);
                }
            }
        }
        for (let index = findings.length - 1; index >= 0; index -= 1) {
            const finding = findings[index];
            const token = this.vault.getOrCreate(finding.kind, finding.value, finding.kind === "PERSON"
                ? personEntities.get(finding.value)
                : undefined);
            output =
                output.slice(0, finding.start) +
                    token +
                    output.slice(finding.end);
            publicFindings.push({
                token,
                kind: finding.kind,
                start: finding.start,
                end: finding.end,
                source: finding.source ?? "AUTO",
                ...(finding.label
                    ? { label: finding.label }
                    : {})
            });
        }
        publicFindings.reverse();
        const counts = {};
        for (const finding of publicFindings) {
            counts[finding.kind] =
                (counts[finding.kind] ?? 0) + 1;
        }
        return {
            text: output,
            findings: publicFindings,
            annotations,
            keptRanges: keep.map((item) => ({
                start: item.start,
                end: item.end
            })),
            counts
        };
    }
    deanonymize(text) {
        return this.vault.deanonymize(text);
    }
}

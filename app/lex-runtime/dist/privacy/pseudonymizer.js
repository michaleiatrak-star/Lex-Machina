import { personPart } from "./generic-words.js";
import { detectIdentifiers } from "./identifiers.js";
import { PERSON_CASES } from "./person-morphology.js";
/** [PII:PERSON:0001] or, with the grammatical case a model asked for, [PII:PERSON:0001|INS]. */
export const PII_TOKEN_WITH_CASE = /\[PII:([A-Z_]+):(\d{4})(?:\|([A-Z]{2,4}))?\]/g;
function isShouting(text) {
    return text === text.toLocaleUpperCase("pl") && /\p{L}{2}/u.test(text);
}
function titleCase(text) {
    return text
        .toLocaleLowerCase("pl")
        .replace(/(^|[\s\-'’])(\p{L})/gu, (_match, lead, letter) => lead + letter.toLocaleUpperCase("pl"));
}
/**
 * A name read from an all-caps heading ("JAN KOWALSKI") is restored in normal
 * spelling inside sentences; abbreviations of addresses (ul., al.) stay lower.
 */
function calmEntity(entity) {
    if (!isShouting(entity.canonical))
        return entity;
    const calm = (text) => titleCase(text).replace(/\b(Ul|Al|Pl|Os|Ulica|Ulicy|Ulicę|Ulicą|Ulico|Aleja|Alei|Aleję|Aleją|Alejo|Plac|Placu|Placem|Osiedle|Osiedla|Osiedlu|Osiedlem)\b/gu, (word) => word.toLocaleLowerCase("pl"));
    return {
        ...entity,
        canonical: calm(entity.canonical),
        forms: Object.fromEntries(Object.entries(entity.forms).map(([key, form]) => [key, { ...form, text: calm(form.text) }]))
    };
}
// Persons and addresses with a paradigm: one token per canonical entity.
const ENTITY_KINDS = new Set(["PERSON", "ADDRESS"]);
function personEntityKey(entity, kind = "PERSON") {
    return `${kind}\u0000entity\u0000${entity.canonical.toLocaleLowerCase("pl")}\u0000${entity.gender}`;
}
const PRIORITY = {
    PESEL: 100,
    PAYMENT_CARD: 99,
    ID_CARD: 98,
    PASSPORT: 97,
    LAND_REGISTRY: 96,
    NIP: 95,
    REGON: 90,
    IBAN: 85,
    EMAIL: 80,
    PHONE: 70,
    // A structural address wins over a name inside it ("ul. Jana Kowalskiego 5").
    ADDRESS: 65,
    PERSON: 60,
    BIRTH_DATE: 54,
    VEHICLE_PLATE: 53,
    KRS: 52,
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
    // Every surface mapped to a token in this session (for entity merging).
    tokenSurfaces = new Map();
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
                this.keyToToken.set(personEntityKey(item.entity, item.kind), item.token);
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
        const entityKey = ENTITY_KINDS.has(kind) && entity
            ? personEntityKey(entity, kind)
            : null;
        const sameEntity = entityKey
            ? this.keyToToken.get(entityKey) ?? this.overlappingEntityToken(kind, entity, value)
            : undefined;
        if (sameEntity) {
            this.keyToToken.set(key, sameEntity);
            if (entityKey)
                this.keyToToken.set(entityKey, sameEntity);
            // The document's own nominative decides the paradigm: "Martyna Jurga"
            // wins over "Martyna Jurda" read from "Martynie Jurdze".
            this.tokenSurfaces.get(sameEntity)?.add(value);
            const current = this.tokenEntities.get(sameEntity);
            const nominative = entity &&
                current &&
                value.toLocaleLowerCase("pl") === entity.canonical.toLocaleLowerCase("pl") &&
                current.canonical.toLocaleLowerCase("pl") !== entity.canonical.toLocaleLowerCase("pl") &&
                this.keyToToken.get(`${kind}\u0000${current.canonical}`) !== sameEntity;
            // An unambiguous reading replaces an ambiguous one, and a normally
            // written name replaces one read from an all-caps heading.
            const clearer = entity && current && current.status !== "ok" && entity.status === "ok";
            const calmer = entity && current && isShouting(current.canonical) && !isShouting(entity.canonical);
            if (entity && (nominative || clearer || calmer)) {
                this.tokenEntities.set(sameEntity, calmEntity(entity));
            }
            return sameEntity;
        }
        const next = (this.counters.get(kind) ?? 0) + 1;
        this.counters.set(kind, next);
        const token = `[PII:${kind}:${String(next).padStart(4, "0")}]`;
        this.keyToToken.set(key, token);
        this.tokenToValue.set(token, value);
        this.tokenSurfaces.set(token, new Set([value]));
        this.tokenMetadata.set(token, {
            kind,
            createdAt: new Date()
                .toISOString()
        });
        if (entity && entityKey) {
            this.tokenEntities.set(token, calmEntity(entity));
            this.keyToToken.set(entityKey, token);
        }
        return token;
    }
    /**
     * Two analyses of one person can reach different lemmas (Malek from
     * "Daniel Malek", Malc from "Danielem Malkiem"); when two paradigms share at
     * a case form they are the same entity.
     */
    overlappingEntityToken(kind, entity, value) {
        const lower = (text) => text.toLocaleLowerCase("pl");
        const forms = new Set(Object.values(entity.forms).map((form) => lower(form.text)));
        for (const [token, other] of this.tokenEntities) {
            if (this.tokenMetadata.get(token)?.kind !== kind)
                continue;
            const otherForms = new Set(Object.values(other.forms).map((form) => lower(form.text)));
            // The mention is one of the forms of a known entity, or a known mention
            // is one of this entity's forms - whatever gender either analysis chose
            // for an ambiguous form ("Martynie Jurdze").
            if (otherForms.has(lower(value)))
                return token;
            const surfaces = this.tokenSurfaces.get(token);
            if (surfaces && [...surfaces].some((surface) => forms.has(lower(surface))))
                return token;
            if (other.gender === entity.gender && [...otherForms].some((text) => forms.has(text)))
                return token;
        }
        return undefined;
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
    /**
     * Every known written form of every person in this vault: the surfaces
     * found so far and, with the morphology engine, all seven cases.
     */
    /** Drops a token and everything that maps to it (the user un-anonymized it). */
    remove(token) {
        if (!this.tokenToValue.has(token))
            return false;
        this.tokenToValue.delete(token);
        this.tokenMetadata.delete(token);
        this.tokenEntities.delete(token);
        this.tokenSurfaces.delete(token);
        for (const [key, value] of [...this.keyToToken]) {
            if (value === token)
                this.keyToToken.delete(key);
        }
        return true;
    }
    /**
     * Case forms corrected by the user: each given form becomes a manual,
     * certain form; the nominative also becomes the entity's canonical name.
     */
    updateForms(token, forms) {
        const entity = this.tokenEntities.get(token);
        if (!entity)
            throw new Error("PRIVACY_KEY_ENTITY_NOT_FOUND");
        const next = {
            ...entity,
            forms: { ...entity.forms },
            warnings: [...entity.warnings]
        };
        for (const personCase of PERSON_CASES) {
            const text = forms[personCase]?.trim();
            if (!text)
                continue;
            next.forms[personCase] = { text, source: "manual", confidence: 1 };
        }
        next.canonical = next.forms.NOM.text;
        next.status = "ok";
        this.tokenEntities.set(token, next);
        this.keyToToken.set(`${this.tokenMetadata.get(token).kind}\u0000${next.canonical}`, token);
        return next;
    }
    knownEntityForms() {
        const forms = new Map();
        for (const [token, value] of this.tokenToValue) {
            const kind = this.tokenMetadata.get(token)?.kind;
            if (!kind || !ENTITY_KINDS.has(kind))
                continue;
            const entity = this.tokenEntities.get(token);
            forms.set(value, entity ? { kind, entity } : { kind });
            if (entity) {
                for (const form of Object.values(entity.forms)) {
                    if (!forms.has(form.text))
                        forms.set(form.text, { kind, entity });
                }
            }
        }
        return [...forms]
            .filter(([text]) => text.trim().length >= 4)
            .map(([text, item]) => ({ text, ...item }));
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
        const autoSpans = detectIdentifiers(text);
        // A person found once is protected everywhere: mentions the recognizer
        // missed (another page, another case form) are matched by known forms.
        const propagatedEntities = new Map();
        for (const form of this.vault.knownEntityForms()) {
            const escaped = form.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            for (const match of text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "gu"))) {
                autoSpans.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    kind: form.kind,
                    value: match[0],
                    confidence: 1,
                    source: "AUTO"
                });
                if (form.entity)
                    propagatedEntities.set(`${form.kind}\u0000${match[0]}`, form.entity);
            }
        }
        if (this.namedEntities) {
            const named = await this.namedEntities.recognize(text);
            for (const found of named) {
                // "Bank", "Rada Gminy": an institution; "Najemca Jan Kowalski": the name only.
                const span = found.kind === "PERSON" ? personPart(text, found) : found;
                if (span &&
                    text.slice(span.start, span.end) === span.value) {
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
        // Canonical identity and paradigm of every person and address mention,
        // keyed by kind and surface. Without the morphology engine tokens fall back
        // to exact-surface identity.
        const entities = new Map(propagatedEntities);
        const analyse = async (kind, run) => {
            if (!run)
                return;
            const surfaces = [
                ...new Set(findings
                    .filter((finding) => finding.kind === kind)
                    .map((finding) => finding.value)
                    .filter((value) => !entities.has(`${kind}\u0000${value}`)))
            ];
            if (surfaces.length === 0)
                return;
            try {
                const analysed = await run(surfaces);
                surfaces.forEach((surface, index) => {
                    const entity = analysed[index];
                    if (entity)
                        entities.set(`${kind}\u0000${surface}`, entity);
                });
            }
            catch (error) {
                process.stderr.write(`${kind}_MORPHOLOGY_DEGRADED:${error instanceof Error ? error.message : String(error)}\n`);
            }
        };
        if (this.morphology) {
            const morphology = this.morphology;
            await analyse("PERSON", (surfaces) => morphology.analyze(surfaces));
            await analyse("ADDRESS", morphology.analyzeAddresses
                ? (surfaces) => morphology.analyzeAddresses(surfaces)
                : undefined);
        }
        for (let index = findings.length - 1; index >= 0; index -= 1) {
            const finding = findings[index];
            const token = this.vault.getOrCreate(finding.kind, finding.value, entities.get(`${finding.kind}\u0000${finding.value}`));
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

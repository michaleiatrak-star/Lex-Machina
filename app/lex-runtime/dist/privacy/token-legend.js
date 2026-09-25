const PLACEHOLDER = /\[(?:LMPII:D\d{2}|PII):(PERSON|ADDRESS):\d{4}(?:\|[A-Z]{2,4})?\]/g;
/** Base form of a placeholder: the case suffix removed. */
export function placeholderBase(token) {
    return token.replace(/\|[A-Z]{2,4}\]$/, "]");
}
export function genderOf(vault, token) {
    const entity = vault.entity(token);
    // Gender guessed from an unknown first name is not given to the model as fact.
    if (!entity || entity.status === "gender_ambiguous" || entity.warnings.includes("GENDER_HEURISTIC"))
        return "unknown";
    return entity.gender === "f" ? "f" : entity.gender === "m1" ? "m" : "unknown";
}
/** Person and address placeholders in the text, with gender and kind of entity from the vault. */
export function placeholderGrammar(text, vault) {
    const seen = new Map();
    for (const match of text.matchAll(PLACEHOLDER)) {
        const token = placeholderBase(match[0]);
        if (seen.has(token))
            continue;
        const kind = match[1];
        if (kind === "ADDRESS") {
            seen.set(token, { token, kind });
            continue;
        }
        const entity = vault.entity(token);
        if (entity?.type === "organization") {
            seen.set(token, { token, kind, entity: "organization", ...(entity.legalForm ? { legalForm: entity.legalForm } : {}) });
        }
        else {
            seen.set(token, { token, kind, gender: genderOf(vault, token), entity: entity?.number === "pl" ? "group" : "person" });
        }
    }
    // A firm carrying the name of a person in the same text ("PHU Jan Kowalski"
    // and Jan Kowalski): the model is told they are linked, not the name.
    const persons = [...seen.values()].filter((entry) => entry.entity === "person");
    for (const entry of seen.values()) {
        if (entry.entity !== "organization")
            continue;
        const firm = vault.entity(entry.token)?.canonical.toLocaleLowerCase("pl") ?? "";
        const owner = persons.find((person) => {
            const name = vault.entity(person.token);
            if (!name || !firm)
                return false;
            const forms = Object.values(name.forms).map((form) => form.text.toLocaleLowerCase("pl"));
            return forms.some((form) => form.length >= 4 && firm.includes(form));
        });
        if (owner)
            entry.owner = owner.token;
    }
    return [...seen.values()];
}
const GENDER_LINE = {
    f: "osoba, rodzaj żeński - uzgadniaj formy żeńskie (np. „wniosła”, „pozwana”, „była zatrudniona”)",
    m: "osoba, rodzaj męski - uzgadniaj formy męskie (np. „wniósł”, „pozwany”, „był zatrudniony”)",
    unknown: "osoba, rodzaj nieustalony - nie zgaduj; pisz formami neutralnymi (np. „strona wniosła”, „osoba ta”)"
};
const GROUP_LINE = {
    m: "kilka osób o wspólnym nazwisku (np. małżonkowie, rodzina), liczba mnoga, rodzaj męskoosobowy - „wnieśli”, „pozwani”, „zobowiązali się”",
    f: "kilka kobiet o wspólnym nazwisku, liczba mnoga, rodzaj niemęskoosobowy - „wniosły”, „pozwane”, „zobowiązały się”",
    unknown: "kilka osób o wspólnym nazwisku, liczba mnoga - „wnieśli”, „pozwani”"
};
function describe(entry) {
    if (entry.kind === "ADDRESS")
        return "adres";
    if (entry.entity === "organization") {
        const head = entry.legalForm ? "spółka" : "firma";
        return [
            `firma, której nazwa zawiera imię lub nazwisko${entry.owner ? ` osoby ${entry.owner}` : ""}`,
            entry.legalForm ? `forma prawna: ${entry.legalForm}` : null,
            `nazwy nie odmieniaj; uzgadniaj przez rzeczownik „${head}” (np. „${head} ${entry.token.replace(/\]$/, "|NOM]")} wniosła”, „od ${head === "spółka" ? "spółki" : "firmy"} ${entry.token.replace(/\]$/, "|NOM]")}”)`,
            entry.owner ? "firma i osoba to nie to samo: pisz o osobie, gdy chodzi o przedsiębiorcę, o firmie, gdy chodzi o nazwę" : null
        ]
            .filter(Boolean)
            .join("; ");
    }
    if (entry.entity === "group")
        return GROUP_LINE[entry.gender ?? "unknown"];
    return GENDER_LINE[entry.gender ?? "unknown"];
}
const PERSON_TOKEN = String.raw `\[(?:LMPII:D\d{2}|PII):PERSON:\d{4}(?:\|[A-Z]{2,4})?\]`;
const PARTY_LIST = new RegExp(String.raw `(?<![\p{L}])(\p{L}{4,})\s+(${PERSON_TOKEN}(?:\s*(?:,|\bi\b|\boraz\b)\s*${PERSON_TOKEN})+)`, "gu");
/**
 * Several persons named together after a role word ("powodowie [P1] i [P2]",
 * "pozwanym [P3], [P4] oraz [P5]"): one party of several persons.
 */
export function partyGroups(texts, isRole) {
    const groups = new Map();
    for (const text of texts) {
        for (const match of text.matchAll(PARTY_LIST)) {
            const role = match[1].toLocaleLowerCase("pl");
            if (!isRole(role))
                continue;
            const tokens = [...new Set([...match[2].matchAll(new RegExp(PERSON_TOKEN, "gu"))].map((item) => placeholderBase(item[0])))];
            if (tokens.length < 2)
                continue;
            const key = tokens.join(",");
            if (!groups.has(key))
                groups.set(key, { role, tokens });
        }
    }
    return [...groups.values()];
}
function partyLine(group, byToken) {
    const members = group.tokens.map((token) => byToken.get(token));
    const persons = members.filter((member) => member && member.entity !== "organization");
    let agreement;
    if (members.some((member) => !member || member.gender === "unknown") || persons.length !== members.length) {
        agreement = "skład płciowy nieustalony - pisz „strona” z formą żeńską („strona powodowa wniosła”) albo formą męskoosobową tylko przy pewności";
    }
    else if (members.some((member) => member.gender === "m" || member.entity === "group" && member.gender !== "f")) {
        agreement = "rodzaj męskoosobowy - „wnieśli”, „pozwani”, „na rzecz powodów”";
    }
    else {
        agreement = "same kobiety, rodzaj niemęskoosobowy - „wniosły”, „pozwane”, „na rzecz powódek”";
    }
    return `- ${group.role}: ${group.tokens.join(", ")} - ${group.tokens.length} osoby po jednej stronie, liczba mnoga, ${agreement}`;
}
/**
 * The key sent to the model with pseudonymized text: which placeholder is a
 * person (and of which gender), several persons, a firm or an address, and
 * which persons form one party. Only grammar; names and addresses stay local.
 */
export function placeholderKeyPrompt(entries, parties = []) {
    const unique = [...new Map(entries.map((entry) => [entry.token, entry])).values()];
    if (!unique.length)
        return null;
    const byToken = new Map(unique.map((entry) => [entry.token, entry]));
    const lines = unique.slice(0, 200).map((entry) => `- ${entry.token}: ${describe(entry)}`);
    const partyLines = parties.filter((group) => group.tokens.every((token) => byToken.has(token))).slice(0, 40);
    return [
        "# KLUCZ SYMBOLI ZASTĘPCZYCH (HARD GATE)",
        "Każdy symbol oznacza jedną prawdziwą osobę, grupę osób o wspólnym nazwisku, firmę albo adres; dane zostają na komputerze użytkownika i wracają do tekstu lokalnie.",
        ...lines,
        ...(partyLines.length
            ? [
                "Strony wieloosobowe (kilka symboli po jednej stronie):",
                ...partyLines.map((group) => partyLine(group, byToken)),
                "Przy kilku osobach po jednej stronie w piśmie nazwij je wszystkie, uzgadniaj liczbę mnogą i wprost rozstrzygnij, czy żądanie lub zasądzenie jest solidarne, czy w częściach; nie zakładaj tego bez podstawy w faktach."
            ]
            : []),
        "Zasady obowiązkowe:",
        "1. Każdy symbol osoby i adresu MUSI mieć przypadek wpisany w nawias: |NOM, |GEN, |DAT, |ACC, |INS, |LOC albo |VOC, zgodnie z funkcją w zdaniu, np. „pozew przeciwko [PII:PERSON:0001|DAT]”, „od [PII:PERSON:0001|GEN]”, „zamieszkały przy [PII:ADDRESS:0001|LOC]”. Symbol bez przypadku jest błędem.",
        "2. Czasowniki, przymiotniki i imiesłowy uzgadniaj z rodzajem i liczbą podanymi w kluczu.",
        "3. Nigdy nie wpisuj, nie odmieniaj ani nie odgaduj imion, nazwisk, nazw firm i adresów; nie zmieniaj numerów symboli."
    ].join("\n");
}

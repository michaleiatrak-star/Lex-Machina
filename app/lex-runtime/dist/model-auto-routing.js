import { isLocalLightweightConversation } from "./execution-engine.js";
import { MANDATORY_SESSION_SKILLS, SKILL_SELECTION_ENVELOPE_PREFIX, parseSkillSelectionEnvelope } from "./skill-selection.js";
const EXECUTION_SKILL_NAME_OVERRIDES = new Set([
    "przesluchanie-swiadkow-v2-min90",
    "raport-klienta-v1"
]);
function isExecutionSkill(skill) {
    return (EXECUTION_SKILL_NAME_OVERRIDES.has(skill.name) ||
        (typeof skill.frontmatter.type ===
            "string" &&
            skill.frontmatter.type
                .toLowerCase()
                .startsWith("executive-")));
}
function description(skill) {
    return typeof skill
        .frontmatter.description ===
        "string"
        ? skill.frontmatter
            .description.trim()
        : "";
}
function parseObject(value) {
    const trimmed = value.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start < 0 ||
        end <= start) {
        return null;
    }
    try {
        const parsed = JSON.parse(trimmed.slice(start, end + 1));
        return parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
            ? parsed
            : null;
    }
    catch {
        return null;
    }
}
function stringArray(value) {
    if (!Array.isArray(value)) {
        return null;
    }
    if (value.some((item) => typeof item !==
        "string")) {
        return null;
    }
    return [
        ...new Set(value.map((item) => String(item)
            .trim()))
    ].filter(Boolean);
}
function allowedDomains(registry, allowList, restrictionActive) {
    const all = [...registry.skills.values()]
        .filter((skill) => skill.name.startsWith("dr-"))
        .map((skill) => skill.name)
        .sort((a, b) => a.localeCompare(b, "pl"));
    // An explicitly empty DR selection means "model chooses the one required
    // primary domain, but may not add optional secondary domains".
    if (restrictionActive &&
        allowList.length > 0) {
        const allowed = new Set(allowList);
        return all.filter((name) => allowed.has(name));
    }
    return all;
}
function allowedExecutionSkills(registry, allowList, restrictionActive) {
    const allowed = new Set(allowList);
    return [
        ...registry.skills.values()
    ]
        .filter((skill) => isExecutionSkill(skill) &&
        !MANDATORY_SESSION_SKILLS
            .includes(skill.name) &&
        (!restrictionActive ||
            allowed.has(skill.name)))
        .sort((a, b) => a.name.localeCompare(b.name, "pl"));
}
function validateDecision(value, domainCandidates, executionCandidates, primaryOnlyDomains) {
    const parsed = parseObject(value);
    if (!parsed) {
        return null;
    }
    if (parsed.legal === false) {
        return {
            legal: false,
            primarySkill: domainCandidates[0] ?? "",
            domainSkills: domainCandidates[0]
                ? [domainCandidates[0]]
                : [],
            executionSkills: [],
            workflowExecutionSkill: null
        };
    }
    const primarySkill = typeof parsed
        .primarySkill ===
        "string"
        ? parsed
            .primarySkill
            .trim()
        : "";
    const domainSkills = stringArray(parsed.domainSkills);
    const executionSkills = stringArray(parsed.executionSkills);
    const workflow = parsed
        .workflowExecutionSkill ===
        null
        ? null
        : typeof parsed
            .workflowExecutionSkill ===
            "string"
            ? parsed
                .workflowExecutionSkill
                .trim()
            : undefined;
    const domainSet = new Set(domainCandidates);
    const executionSet = new Set(executionCandidates);
    if (!primarySkill ||
        !domainSet.has(primarySkill) ||
        !domainSkills ||
        !executionSkills ||
        workflow === undefined ||
        domainSkills.length > 3 ||
        executionSkills.length > 6 ||
        domainSkills.some((name) => !domainSet.has(name)) ||
        executionSkills.some((name) => !executionSet.has(name)) ||
        (workflow !== null &&
            !executionSkills.includes(workflow))) {
        return null;
    }
    const normalizedDomains = [
        primarySkill,
        ...domainSkills.filter((name) => name !== primarySkill)
    ];
    if (primaryOnlyDomains &&
        normalizedDomains.length > 1) {
        return null;
    }
    return {
        legal: true,
        primarySkill,
        domainSkills: normalizedDomains,
        executionSkills,
        workflowExecutionSkill: workflow
    };
}
const LOCAL_CATALOG_DESCRIPTION_CHARS = 220;
function catalogLine(skill, maxDescriptionChars) {
    const text = description(skill) ||
        "(brak opisu)";
    return [
        skill.name,
        maxDescriptionChars &&
            text.length > maxDescriptionChars
            ? text.slice(0, maxDescriptionChars) + "…"
            : text
    ].join(" :: ");
}
export class ModelAutoRouter {
    registry;
    providers;
    constructor(registry, providers) {
        this.registry = registry;
        this.providers = providers;
    }
    async resolve(args) {
        const envelope = parseSkillSelectionEnvelope(args.query);
        if (!envelope.automatic) {
            throw new Error("AUTO_ROUTING_NOT_REQUESTED");
        }
        const domains = allowedDomains(this.registry, envelope.domainAllowList, envelope
            .domainRestrictionActive);
        const executions = allowedExecutionSkills(this.registry, envelope.executionAllowList, envelope
            .executionRestrictionActive);
        if (domains.length === 0) {
            throw new Error("AUTO_ROUTING_NO_DOMAIN_CANDIDATES");
        }
        const primaryOnlyDomains = envelope
            .domainRestrictionActive &&
            envelope
                .domainAllowList
                .length === 0;
        // Local models run on the user's CPU/GPU: a trivial chat command must not
        // pay for a semantic routing pass at all.
        if (isLocalLightweightConversation(args.model, envelope.query, false)) {
            return {
                decision: {
                    legal: false,
                    primarySkill: domains[0],
                    domainSkills: [
                        domains[0]
                    ],
                    executionSkills: [],
                    workflowExecutionSkill: null
                },
                query: SKILL_SELECTION_ENVELOPE_PREFIX +
                    " " +
                    JSON.stringify({
                        auto: false,
                        manual: [],
                        modelRouted: true,
                        workflow: null
                    }) +
                    "\n" +
                    envelope.query
            };
        }
        // The central routing map alone is ~24k characters (~8k tokens); a local
        // 11-12B model spends minutes just reading it before the first token.
        // Local models route from the compact catalog below instead.
        const localModel = args.model.startsWith("local/");
        const routingMap = localModel
            ? null
            : this.registry
                .resolveResource("prawo-polskie-v2", "prawo-polskie-v2/ROUTING-MAP.md");
        const routingMapText = routingMap
            ? (await import("node:fs/promises")).readFile(routingMap, "utf8")
            : Promise.resolve("");
        const mapText = await routingMapText;
        const catalogLimit = localModel
            ? LOCAL_CATALOG_DESCRIPTION_CHARS
            : undefined;
        const domainCatalog = domains.map((name) => {
            const skill = this.registry.get(name);
            return skill
                ? catalogLine(skill, catalogLimit)
                : name;
        });
        const executionCatalog = executions.map((skill) => catalogLine(skill, catalogLimit));
        const executionNames = executions.map((skill) => skill.name);
        const systemPrompt = [
            "# LEX MACHINA — MODEL ROUTER AUTO",
            "Jesteś wyłącznie semantycznym routerem. Nie odpowiadaj na pytanie użytkownika.",
            "W trybie AUTO to TY dobierasz właściwą domenę prawa i skille na podstawie całej rozmowy. Runtime nie używa regexów ani scoringu słów do wyboru.",
            "Wybieraj wyłącznie nazwy z katalogu poniżej. Nie wybieraj skilla tylko dlatego, że jest dostępny.",
            "primarySkill: dokładnie jedna główna domena DR.",
            primaryOnlyDomains
                ? "domainSkills: tylko primarySkill; użytkownik wyłączył wszystkie opcjonalne domeny wtórne."
                : "domainSkills: primarySkill oraz tylko rzeczywiście potrzebne domeny wtórne; maksymalnie 3.",
            "executionSkills: tylko skille rzeczywiście potrzebne do wykonania bieżącego zadania; maksymalnie 6; może być [].",
            "workflowExecutionSkill: jeden z executionSkills, jeśli bieżące zadanie wymaga konkretnego workflow; w przeciwnym razie null.",
            "legal: false TYLKO gdy wiadomość nie zawiera żadnej kwestii prawnej (powitanie, test, podziękowanie, pytanie ogólne niezwiązane z prawem). Wtedy zwróć wyłącznie {\"legal\":false}. Wtedy Lex Machina nie ładuje skilli prawnych.",
            "legal: true dla każdej sprawy lub pytania z elementem prawnym, także pośrednim (fakty sprawy, pismo, umowa, termin, przepis, urząd, sąd, dokumenty). W razie wątpliwości legal: true.",
            "Dla krótkiej komendy konwersacyjnej bez zadania prawnego executionSkills powinno być [].",
            "Dla pytania o konkretny przepis wybierz właściwą domenę kodeksu i analizator przepisu, jeśli jest dostępny.",
            "Zwróć TYLKO jeden obiekt JSON bez markdownu i bez komentarza:",
            '{"legal":true,"primarySkill":"dr-...","domainSkills":["dr-..."],"executionSkills":[],"workflowExecutionSkill":null}',
            'albo dla wiadomości bez kwestii prawnej: {"legal":false}',
            "",
            "# DOZWOLONE DOMENY",
            ...domainCatalog.map((line) => "- " + line),
            "",
            "# DOZWOLONE SKILLE WYKONAWCZE",
            ...(executionCatalog.length
                ? executionCatalog.map((line) => "- " + line)
                : ["- (brak)"]),
            ...(mapText
                ? [
                    "",
                    "# CENTRALNA MAPA ROUTINGU",
                    mapText.slice(0, 24_000)
                ]
                : [])
        ].join("\n");
        const routeOnce = async (repair) => {
            const response = await this.providers
                .stream(args.provider, {
                model: args.model,
                systemPrompt: repair
                    ? systemPrompt +
                        "\n\n# NAPRAWA FORMATU\nPoprzedni wynik był nieprawidłowy: " +
                        repair +
                        "\nZwróć ponownie wyłącznie poprawny JSON z nazwami z katalogu."
                    : systemPrompt,
                messages: [
                    {
                        role: "user",
                        content: envelope
                            .query
                    }
                ],
                reasoning: "none"
            });
            return response
                .fullText
                .trim();
        };
        let raw = await routeOnce(null);
        let decision = validateDecision(raw, domains, executionNames, primaryOnlyDomains);
        if (!decision) {
            raw =
                await routeOnce(raw.slice(0, 2_000));
            decision =
                validateDecision(raw, domains, executionNames, primaryOnlyDomains);
        }
        if (!decision) {
            throw new Error("AUTO_ROUTING_INVALID_MODEL_OUTPUT");
        }
        const manual = [
            ...decision
                .executionSkills,
            ...decision
                .domainSkills
                .filter((name) => name !==
                decision
                    .primarySkill)
        ];
        const resolvedEnvelope = {
            auto: false,
            manual,
            modelRouted: true,
            workflow: decision
                .workflowExecutionSkill
        };
        return {
            decision,
            query: SKILL_SELECTION_ENVELOPE_PREFIX +
                " " +
                JSON.stringify(resolvedEnvelope) +
                "\n" +
                envelope.query
        };
    }
}

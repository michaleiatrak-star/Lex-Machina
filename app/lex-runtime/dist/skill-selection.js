export const SKILL_SELECTION_ENVELOPE_PREFIX = "__LEX_SKILLS_V1__";
export const MANDATORY_SESSION_SKILLS = [
    "prawny-router-v3",
    "shared",
    "prawo-polskie-v2"
];
const STOP_WORDS = new Set([
    "albo", "bez", "byc", "czy", "dla", "gdzie", "jest", "jako",
    "ktora", "ktore", "ktory", "mam", "oraz", "przez", "sie", "tego", "ten",
    "tym", "wobec", "zeby", "and", "for", "from", "into", "that", "the",
    "this", "with"
]);
const EXECUTION_SKILL_NAME_OVERRIDES = new Set([
    "przesluchanie-swiadkow-v2-min90",
    "raport-klienta-v1"
]);
function normalize(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll("ł", "l");
}
function tokens(value) {
    return new Set(normalize(value)
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 3 && !STOP_WORDS.has(item)));
}
function safeManualSkillNames(value) {
    if (!Array.isArray(value))
        return [];
    return [
        ...new Set(value
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => /^[a-z0-9][a-z0-9._-]{1,159}$/i.test(item)))
    ].slice(0, 16);
}
function safeExecutionAllowList(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [
        ...new Set(value
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => /^[a-z0-9][a-z0-9._-]{1,159}$/i.test(item)))
    ].slice(0, 64);
}
function safeDomainAllowList(value) {
    if (!Array.isArray(value))
        return [];
    return [
        ...new Set(value
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => /^dr-\d{2}-[a-z0-9-]{1,140}$/i.test(item)))
    ].slice(0, 32);
}
export function parseSkillSelectionEnvelope(rawQuery) {
    const firstBreak = rawQuery.indexOf("\n");
    if (firstBreak < 0) {
        return {
            query: rawQuery,
            automatic: true,
            manualSkills: [],
            domainAllowList: [],
            domainRestrictionActive: false,
            executionAllowList: [],
            executionRestrictionActive: false,
            modelRouted: false,
            workflowExecutionSkill: null
        };
    }
    const firstLine = rawQuery.slice(0, firstBreak).trim();
    if (!firstLine.startsWith(SKILL_SELECTION_ENVELOPE_PREFIX)) {
        return {
            query: rawQuery,
            automatic: true,
            manualSkills: [],
            domainAllowList: [],
            domainRestrictionActive: false,
            executionAllowList: [],
            executionRestrictionActive: false,
            modelRouted: false,
            workflowExecutionSkill: null
        };
    }
    const encoded = firstLine.slice(SKILL_SELECTION_ENVELOPE_PREFIX.length).trim();
    try {
        const parsed = JSON.parse(encoded);
        const domainRestrictionActive = Object.prototype.hasOwnProperty.call(parsed, "domains") &&
            Array.isArray(parsed.domains);
        const executionRestrictionActive = Object.prototype.hasOwnProperty.call(parsed, "execution") &&
            Array.isArray(parsed.execution);
        return {
            query: rawQuery.slice(firstBreak + 1).trimStart(),
            automatic: parsed.auto !== false,
            manualSkills: safeManualSkillNames(parsed.manual),
            domainAllowList: safeDomainAllowList(parsed.domains),
            domainRestrictionActive,
            executionAllowList: safeExecutionAllowList(parsed.execution),
            executionRestrictionActive,
            modelRouted: parsed.modelRouted ===
                true,
            workflowExecutionSkill: typeof parsed.workflow ===
                "string" &&
                /^[a-z0-9][a-z0-9._-]{1,159}$/i.test(parsed.workflow)
                ? parsed.workflow
                : null
        };
    }
    catch {
        return {
            query: rawQuery,
            automatic: true,
            manualSkills: [],
            domainAllowList: [],
            domainRestrictionActive: false,
            executionAllowList: [],
            executionRestrictionActive: false,
            modelRouted: false,
            workflowExecutionSkill: null
        };
    }
}
const EXPLICIT_EXECUTION_RULES = [
    {
        skill: "pisma-procesowe-v3",
        patterns: [
            /\bpozew\b/,
            /\bapelacj[a-z]*\b/,
            /\bzazalen[a-z]*\b/,
            /\bodpowiedz na pozew\b/,
            /\bpismo procesow[a-z]*\b/,
            /\bpismo wielowatk[a-z]*\b/,
            /\bskarga kasacyjn[a-z]*\b/
        ]
    },
    {
        skill: "pisma-proste-v2",
        patterns: [
            /\bsprzeciw od nakazu\b/,
            /\bklauzul[a-z]* wykonalnosci\b/,
            /\bprzywrocen[a-z]* terminu\b/,
            /\bwglad do akt\b/,
            /\bwniosek o uzasadnienie\b/,
            /\bwezwanie do zaplaty\b/,
            /\bostateczne wezwanie\b/
        ]
    },
    {
        skill: "analizator-umow-v1",
        patterns: [
            /\bumow[a-z]*\b/,
            /\bowu\b/,
            /\bkontrakt[a-z]*\b/,
            /\bugod[a-z]*\b/,
            /\bregulamin[a-z]*\b/,
            /\btestament[a-z]*\b/,
            /\bklauzul[a-z]*\b/
        ]
    },
    {
        skill: "chronologia-sprawy-v1",
        patterns: [
            /\bchronologi[a-z]*\b/,
            /\bos czasu\b/,
            /\btimeline\b/,
            /\bkolejnosc zdarzen\b/
        ]
    },
    {
        skill: "raport-klienta-v1",
        patterns: [
            /\braport klient[a-z]*\b/,
            /\braport dla klient[a-z]*\b/,
            /\bpodsumowani[a-z]* dla klient[a-z]*\b/,
            /\bstatus dla klient[a-z]*\b/
        ]
    },
    {
        skill: "raport-sytuacyjny-v2",
        patterns: [
            /\braport sytuacyjn[a-z]*\b/,
            /\bwidok sytuacji\b/,
            /\bstatus sprawy z ryzykami\b/
        ]
    },
    {
        skill: "analiza-sadowa-v6",
        patterns: [
            /\banaliza sadow[a-z]*\b/,
            /\bjakie mam szanse\b/,
            /\banaliza pozycji\b/,
            /\bpismo przeciwnika\b/,
            /\bwyrok[a-z]*\b/,
            /\bnakaz zaplaty\b/
        ]
    },
    {
        skill: "orzeczenia-sadowe-v2",
        patterns: [
            /\bznajdz wyrok\b/,
            /\bprecedens[a-z]*\b/,
            /\blinia orzecznicz[a-z]*\b/,
            /\bweryfikacj[a-z]* sygnatur[a-z]*\b/
        ]
    },
    {
        skill: "analizator-dowodow-v3",
        patterns: [
            /\bmail[a-z]*\b/,
            /\bsms[a-z]*\b/,
            /\bnagran[a-z]*\b/,
            /\bfaktur[a-z]*\b/,
            /\btermin[a-z]* procesow[a-z]*\b/,
            /\bkoszt[a-z]* sadow[a-z]*\b/,
            /\boplat[a-z]* komornicz[a-z]*\b/
        ]
    },
    {
        skill: "przesluchanie-swiadkow-v2-min90",
        patterns: [
            /\bswiadek\b/,
            /\bswiadk[a-z]*\b/,
            /\bbiegly\b/,
            /\bpytani[a-z]* do swiadk[a-z]*\b/,
            /\bcross examination\b/
        ]
    },
    {
        skill: "analizator-przepisow-v2",
        patterns: [
            /\bart\.?\s*\d+/,
            /\bprzeslank[a-z]*\b/,
            /\bwykladni[a-z]*\b/,
            /\bczy mnie dotyczy\b/,
            /\bzweryfikuj[a-z]* (?:te |ten )?przepis[a-z]*\b/
        ]
    },
    {
        skill: "przewodnik-prawny-v2",
        patterns: [
            /\bco mam zrobic\b/,
            /\bod czego zaczac\b/,
            /\bwyjasn[a-z]* wynik[a-z]*\b/
        ]
    }
];
function explicitExecutionSkillHints(query, candidates) {
    const normalized = normalize(query)
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const available = new Set(candidates
        .filter(isExecutionSkill)
        .map((skill) => skill.name));
    const matched = EXPLICIT_EXECUTION_RULES
        .filter((rule) => available.has(rule.skill) &&
        rule.patterns.some((pattern) => pattern.test(normalized)))
        .map((rule) => rule.skill);
    let resolved = matched;
    if (resolved.includes("pisma-procesowe-v3") &&
        resolved.includes("pisma-proste-v2")) {
        resolved = resolved.filter((skill) => skill !== "pisma-proste-v2");
    }
    // A specific case-law research request (find/verify judgment,
    // jurisprudential line) must control the workflow instead of the
    // broader court-analysis rule that can also match the word "wyrok".
    if (resolved.includes("orzeczenia-sadowe-v2")) {
        resolved = [
            "orzeczenia-sadowe-v2",
            ...resolved.filter((skill) => skill !== "orzeczenia-sadowe-v2" &&
                skill !== "analiza-sadowa-v6")
        ];
    }
    return resolved;
}
function scoreSkill(queryTokens, name, description) {
    const nameTokens = tokens(name.replace(/^dr-\d{2}-/, ""));
    const descriptionTokens = tokens(description);
    let score = 0;
    for (const token of queryTokens) {
        if (nameTokens.has(token))
            score += 8;
        if (descriptionTokens.has(token))
            score += 2;
    }
    return score;
}
function isExecutionSkill(skill) {
    return (EXECUTION_SKILL_NAME_OVERRIDES.has(skill.name) ||
        (typeof skill.frontmatter.type ===
            "string" &&
            skill.frontmatter.type
                .toLowerCase()
                .startsWith("executive-")));
}
function isDomainSkill(skill) {
    return skill.name.startsWith("dr-");
}
function descriptionOf(skill) {
    return typeof skill.frontmatter.description === "string"
        ? skill.frontmatter.description
        : "";
}
function rankSkills(skills, queryTokens) {
    return skills
        .map((skill) => ({
        skill,
        score: scoreSkill(queryTokens, skill.name, descriptionOf(skill))
    }))
        .sort((left, right) => right.score - left.score ||
        left.skill.name.localeCompare(right.skill.name, "pl"));
}
function referencedExecutionSkills(registry, sourceNames, candidates) {
    const executionCandidates = candidates.filter(isExecutionSkill);
    const referenced = [];
    for (const sourceName of sourceNames) {
        const source = registry.get(sourceName);
        if (!source)
            continue;
        const declared = source.frontmatter.dependencies?.requires ?? [];
        for (const target of executionCandidates) {
            if (target.name === sourceName)
                continue;
            // Delegation must be an explicit dependency declaration. Merely
            // mentioning another skill in prose is not authority to activate it.
            if (declared.includes(target.name)) {
                referenced.push(target.name);
            }
        }
    }
    return [...new Set(referenced)];
}
export function resolveAdditionalSkills(registry, query, primarySkill, automatic, manualSkills, domainAllowList = [], domainRestrictionActive = domainAllowList.length > 0, executionAllowList = [], executionRestrictionActive = false, workflowExecutionSkillOverride = null) {
    // An empty allow-list means every domain stays available, so an older
    // client that does not send the field keeps today's behaviour exactly.
    const allowedDomains = domainRestrictionActive
        ? new Set(domainAllowList)
        : null;
    const domainAllowed = (name) => allowedDomains === null ||
        name === primarySkill ||
        allowedDomains.has(name);
    const allowedExecution = executionRestrictionActive
        ? new Set(executionAllowList)
        : null;
    const executionAllowed = (name) => allowedExecution === null ||
        allowedExecution.has(name);
    const core = new Set([
        "prawny-router-v3",
        "prawo-polskie-v2",
        primarySkill
    ]);
    const manual = [
        ...new Set(manualSkills)
    ].filter((name) => {
        if (core.has(name) ||
            name === "shared") {
            return false;
        }
        const skill = registry.get(name);
        if (!skill) {
            return false;
        }
        return (!isExecutionSkill(skill) ||
            executionAllowed(name));
    });
    const selected = new Set(manual);
    const executionSkills = new Set();
    let workflowExecutionSkill = null;
    const promoteWorkflowExecutionSkill = (name) => {
        if (name === "pisma-procesowe-v3") {
            workflowExecutionSkill = name;
            return;
        }
        if (workflowExecutionSkill !== "pisma-procesowe-v3" &&
            name === "pisma-proste-v2") {
            workflowExecutionSkill = name;
            return;
        }
        if (workflowExecutionSkill === null) {
            workflowExecutionSkill = name;
        }
    };
    const domainSkills = new Set([primarySkill]);
    let usedFallbackExecution = false;
    for (const name of manual) {
        const skill = registry.get(name);
        if (!skill)
            continue;
        if (isExecutionSkill(skill)) {
            executionSkills.add(name);
            promoteWorkflowExecutionSkill(name);
        }
        if (isDomainSkill(skill) && domainAllowed(name)) {
            domainSkills.add(name);
        }
    }
    if (automatic) {
        const queryTokens = tokens(query);
        const candidates = [...registry.skills.values()]
            .filter((skill) => !core.has(skill.name) &&
            skill.name !== "shared");
        const executionCandidates = candidates.filter((skill) => isExecutionSkill(skill) &&
            executionAllowed(skill.name));
        const rankedExecution = rankSkills(executionCandidates, queryTokens);
        const explicitExecution = explicitExecutionSkillHints(query, executionCandidates);
        for (const name of explicitExecution) {
            if (executionSkills.size >= 4)
                break;
            executionSkills.add(name);
            selected.add(name);
            promoteWorkflowExecutionSkill(name);
        }
        const matchingExecution = explicitExecution.length > 0
            ? []
            : rankedExecution
                .filter((item) => item.score >= 4 &&
                !executionSkills.has(item.skill.name))
                .slice(0, Math.max(0, 4 -
                executionSkills.size));
        if (explicitExecution.length === 0 &&
            matchingExecution.length === 0 &&
            executionSkills.size === 0) {
            // Keep trivial/non-semantic chat turns free of stateful legal workflows.
            // A genuinely vague legal question can still use the general guide, but
            // a command such as "napisz ok" has too little legal signal to do so.
            if (queryTokens.size >= 2) {
                const fallback = executionCandidates.find((skill) => skill.name ===
                    "przewodnik-prawny-v2");
                if (fallback) {
                    usedFallbackExecution =
                        true;
                    executionSkills.add(fallback.name);
                    selected.add(fallback.name);
                    // The general guide is conversational fallback only. It must not
                    // pin a deterministic workflow or fan out through references merely
                    // because its SKILL.md documents optional next-step integrations.
                }
            }
        }
        else {
            for (const item of matchingExecution) {
                executionSkills.add(item.skill.name);
                selected.add(item.skill.name);
                if (workflowExecutionSkill === null) {
                    promoteWorkflowExecutionSkill(item.skill.name);
                }
            }
        }
        const delegatedExecution = usedFallbackExecution
            ? []
            : referencedExecutionSkills(registry, [
                ...executionSkills
            ], executionCandidates);
        for (const name of delegatedExecution) {
            if (executionSkills.size >= 6)
                break;
            executionSkills.add(name);
            selected.add(name);
        }
        const rankedDomains = rankSkills(candidates.filter((skill) => isDomainSkill(skill) &&
            domainAllowed(skill.name)), queryTokens)
            .filter((item) => item.score >= 4)
            .slice(0, 3);
        for (const item of rankedDomains) {
            domainSkills.add(item.skill.name);
            selected.add(item.skill.name);
        }
        const rankedAuxiliary = rankSkills(candidates.filter((skill) => !isExecutionSkill(skill) &&
            !isDomainSkill(skill)), queryTokens)
            .filter((item) => item.score >= 4)
            .slice(0, 4);
        for (const item of rankedAuxiliary) {
            selected.add(item.skill.name);
        }
    }
    const additionalSkills = [...selected].slice(0, 12);
    const retained = new Set(additionalSkills);
    if (workflowExecutionSkillOverride &&
        executionSkills.has(workflowExecutionSkillOverride) &&
        retained.has(workflowExecutionSkillOverride)) {
        workflowExecutionSkill =
            workflowExecutionSkillOverride;
    }
    return {
        additionalSkills,
        loadedSkills: [
            "prawny-router-v3",
            "shared",
            "prawo-polskie-v2",
            primarySkill,
            ...additionalSkills
        ],
        executionSkills: [...executionSkills].filter((name) => retained.has(name)),
        workflowExecutionSkill: workflowExecutionSkill && retained.has(workflowExecutionSkill)
            ? workflowExecutionSkill
            : null,
        domainSkills: [...domainSkills].filter((name) => name === primarySkill || retained.has(name))
    };
}

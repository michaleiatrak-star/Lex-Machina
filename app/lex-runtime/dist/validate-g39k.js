import path from "node:path";
import { fileURLToPath } from "node:url";
import { LegalSession, CORE_LEGAL_RESOURCES } from "./legal-session.js";
import { validateModelTaskOwnership } from "./model-task-ownership.js";
import { LexSkillRegistry } from "./registry.js";
const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const corpusRoot = path.resolve(process.env
    .LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana"));
const registry = new LexSkillRegistry(corpusRoot);
const structuralIssues = [
    ...registry.scan(),
    ...registry
        .validateDeclarations()
];
const router = registry.get("prawny-router-v3");
const declaredRequired = [
    ...new Set((router?.frontmatter
        .required_modules ??
        [])
        .map((resource) => String(resource)
        .split("#", 1)
        .at(0)
        ?.trim() ??
        "")
        .filter(Boolean))
];
let sessionResult = "BLOCKED";
let sessionError = null;
let runtimeRequired = [];
let events = [];
if (structuralIssues.length === 0 &&
    router &&
    declaredRequired.length > 0) {
    try {
        const session = new LegalSession(registry);
        events =
            session
                .initializeLegalQuery()
                .map((event) => ({
                type: event.type,
                target: event.target,
                status: event.status
            }));
        runtimeRequired =
            [
                ...session
                    .runtimeRequiredResources
                    .keys()
            ].sort();
        const expected = [...declaredRequired]
            .sort();
        sessionResult =
            JSON.stringify(runtimeRequired) ===
                JSON.stringify(expected) &&
                CORE_LEGAL_RESOURCES
                    .every((resource) => session
                    .loadedResources
                    .has(resource)) &&
                events.some((event) => event.type ===
                    "gate" &&
                    event.target ===
                        "G39L_ROUTER_REQUIRED_MODULES" &&
                    event.status ===
                        "OK")
                ? "PASS"
                : "BLOCKED";
    }
    catch (error) {
        sessionError =
            error instanceof Error
                ? error.message
                : String(error);
    }
}
const modelOwnership = validateModelTaskOwnership();
const result = structuralIssues.length === 0 &&
    router &&
    declaredRequired.length > 0 &&
    sessionResult === "PASS" &&
    modelOwnership.result ===
        "PASS"
    ? "PASS"
    : "BLOCKED";
process.stdout.write(JSON.stringify({
    gate: "G39K_MODEL_AND_ROUTER_CONTRACT",
    result,
    corpusRoot,
    router: {
        present: Boolean(router),
        declaredRequiredModules: declaredRequired.length,
        runtimeReadRequiredModules: runtimeRequired.length,
        coreResources: [...CORE_LEGAL_RESOURCES],
        sessionResult,
        sessionError
    },
    modelTaskOwnership: modelOwnership,
    structuralIssues
}, null, 2) + "\n");
if (result !== "PASS") {
    process.exitCode = 1;
}

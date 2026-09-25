import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { SupremeCourtCaseVerifier } from "./case-law-verifier.js";
import { CaseLawSearchService } from "./case-law-search.js";
import { createLexHttpApp } from "./http/app.js";
import { OfficialLegalSourceVerifier } from "./legal-source-verifier.js";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { LexSkillRegistry } from "./registry.js";
import { SafeSessionExecutor } from "./session-executor.js";
import { LegalVerificationToolRuntime } from "./verification-tool-runtime.js";
const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana"));
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";
const CASE_LAW_WORKFLOW_RESOURCES = [
    "shared/MCP-INTEGRACJA.md",
    "shared/SYGNATURY.md",
    "shared/PRAWO-HARDGATE.md",
    "shared/SELF-CHECK-ANTY-FASADA.md"
];
async function satisfyCaseLawWorkflowPreflight(params, idPrefix) {
    const readTool = params.tools?.find((candidate) => candidate.function.name ===
        "read_legal_resource");
    if (!readTool || !params.runTools) {
        throw new Error("G22_CASE_LAW_PREFLIGHT_TOOL_MISSING");
    }
    const results = await params.runTools(CASE_LAW_WORKFLOW_RESOURCES.map((resource, index) => ({
        id: `${idPrefix}-case-law-read-${index + 1}`,
        name: readTool.function.name,
        input: {
            skill: "orzeczenia-sadowe-v2",
            path: resource
        }
    })));
    for (const result of results) {
        const payload = JSON.parse(result.content ?? "{}");
        if (payload.status !== "OK") {
            throw new Error("G22_CASE_LAW_PREFLIGHT_FAILED");
        }
    }
}
function json(value) {
    return new Response(JSON.stringify(value), {
        status: 200,
        headers: {
            "content-type": "application/json"
        }
    });
}
function caseLawDiscoveryFetcher(input) {
    const url = String(input);
    if (url.includes("saos.org.pl/api/search/judgments")) {
        return Promise.resolve(json({
            items: [],
            info: {
                totalResults: 0
            }
        }));
    }
    if (url.includes("orzeczenia.nsa.gov.pl/cbo/search")) {
        return Promise.resolve(new Response("<html><body>Znaleziono 0 orzeczeń</body></html>", {
            status: 200,
            headers: {
                "content-type": "text/html; charset=utf-8"
            }
        }));
    }
    if (url.includes("orzeczenia.nsa.gov.pl/cbo/query")) {
        return Promise.resolve(new Response("<html><body>CBOSA</body></html>", {
            status: 200,
            headers: {
                "content-type": "text/html; charset=utf-8"
            }
        }));
    }
    return Promise.reject(new Error("G22_UNEXPECTED_DISCOVERY_URL:" +
        url));
}
function caseFetcher(mode) {
    return async (input) => {
        const url = String(input);
        if (url.includes("task=searchOrzeczenia")) {
            return json({
                data: [{
                        data: mode === "found"
                            ? [
                                {
                                    id: "near",
                                    sygnatura_sprawy: "II CZP 25/11"
                                },
                                {
                                    id: "exact",
                                    sygnatura_sprawy: "III CZP 25/11",
                                    data_wydania: "2011-10-18",
                                    forma_orzeczenia: "uchwała"
                                }
                            ]
                            : [{
                                    id: "near",
                                    sygnatura_sprawy: "II CZP 25/11"
                                }]
                    }]
            });
        }
        const html = "<html><body>" +
            "Sąd Najwyższy " +
            "III CZP 25/11 " +
            "pełny tekst orzeczenia" +
            "</body></html>";
        return json({
            data: [{
                    raw: Buffer
                        .from(html, "utf8")
                        .toString("base64")
                }]
        });
    };
}
class CaseProvider {
    mode;
    id = "openai";
    label = "G22 deterministic case provider";
    capabilities = {
        streaming: true,
        tools: true,
        reasoning: true,
        modelDiscovery: false
    };
    constructor(mode) {
        this.mode = mode;
    }
    async stream(params) {
        await satisfyCaseLawWorkflowPreflight(params, "g22");
        if (this.mode ===
            "fake-marker") {
            return {
                fullText: "Zob. sygn. III CZP 25/11 " +
                    "✅ [VER: https://sn.pl/fake, 2026-09-15]"
            };
        }
        const tool = params.tools?.find((candidate) => candidate.function.name ===
            "verify_case_reference");
        const readTool = params.tools?.find((candidate) => candidate.function.name ===
            "read_legal_resource");
        if (!tool ||
            !readTool ||
            !params.runTools) {
            throw new Error("G22_CASE_TOOL_MISSING");
        }
        const requiredReads = [
            "shared/MCP-INTEGRACJA.md",
            "shared/SYGNATURY.md",
            "shared/PRAWO-HARDGATE.md",
            "shared/SELF-CHECK-ANTY-FASADA.md"
        ];
        const readResults = await params.runTools(requiredReads.map((resource, index) => ({
            id: `g22-case-resource-${index + 1}`,
            name: readTool.function.name,
            input: {
                skill: "orzeczenia-sadowe-v2",
                path: resource
            }
        })));
        if (readResults.length !==
            requiredReads.length ||
            readResults.some((item) => !item.content.includes('"status":"OK"'))) {
            throw new Error("G22_CASE_WORKFLOW_READ_FAILED");
        }
        const [result] = await params.runTools([{
                id: "g22-case-1",
                name: tool.function.name,
                input: {
                    claim: "sygn. III CZP 25/11",
                    signature: "III  C.Z.P.  25/11",
                    courtFamily: "SN"
                }
            }]);
        const payload = JSON.parse(result?.content ?? "{}");
        if (payload.status ===
            "VERIFIED" &&
            typeof payload.marker ===
                "string") {
            return {
                fullText: "Zob. sygn. III CZP 25/11 " +
                    payload.marker
            };
        }
        return {
            fullText: "Zob. sygn. III CZP 25/11 " +
                "⚠️ [NIEWERYFIKOWANE]"
        };
    }
}
function executor(registry, providerMode, sourceMode) {
    const providers = new ProviderRegistry();
    providers.register(new CaseProvider(providerMode));
    const statuteVerifier = new OfficialLegalSourceVerifier(async () => new Response("<html></html>", {
        status: 200,
        headers: {
            "content-type": "text/html"
        }
    }));
    return new SafeSessionExecutor(registry, new ProviderGateway(providers), undefined, (ledger) => new LegalVerificationToolRuntime(ledger, statuteVerifier, undefined, null, new SupremeCourtCaseVerifier(caseFetcher(sourceMode), () => "2026-09-15T23:00:00.000Z"), new CaseLawSearchService(caseLawDiscoveryFetcher)));
}
function appFor(registry, providerMode, sourceMode) {
    return createLexHttpApp({
        registry,
        modelCatalog: {
            list: async () => [{
                    provider: "openai",
                    id: "g22-model",
                    displayName: "g22-model",
                    selectable: true
                }]
        },
        sessionExecutor: executor(registry, providerMode, sourceMode)
    });
}
function body() {
    return {
        query: "Zweryfikuj istnienie orzeczenia SN o sygnaturze III CZP 25/11.",
        provider: "openai",
        model: "g22-model",
        primarySkill: DR02,
        mode: "PRAWNIK"
    };
}
function verification(value) {
    return (value.verification &&
        typeof value.verification ===
            "object")
        ? value.verification
        : {};
}
const registry = new LexSkillRegistry(lexRoot);
const issues = [
    ...registry.scan(),
    ...registry.validateDeclarations()
];
const foundHttp = await request(appFor(registry, "tool", "found"))
    .post("/api/sessions/execute")
    .send(body());
const nearHttp = await request(appFor(registry, "tool", "near-only"))
    .post("/api/sessions/execute")
    .send(body());
const fakeHttp = await request(appFor(registry, "fake-marker", "found"))
    .post("/api/sessions/execute")
    .send(body());
const found = foundHttp.body;
const near = nearHttp.body;
const fake = fakeHttp.body;
const foundVerification = verification(found);
const nearVerification = verification(near);
const fakeVerification = verification(fake);
const pass = issues.length === 0 &&
    foundHttp.status === 200 &&
    found.status ===
        "DRAFT_PRESENTABLE" &&
    found.finalization ===
        "PASS" &&
    typeof found.answer ===
        "string" &&
    String(found.answer).includes("sygn. III CZP 25/11") &&
    String(found.answer).includes("https://sn.pl/pl/wyszukiwarka-orzeczen") &&
    typeof foundVerification.records ===
        "number" &&
    foundVerification.records >= 1 &&
    foundVerification.verified ===
        foundVerification.records &&
    foundVerification.supported === 0 &&
    foundVerification.unverified === 0 &&
    nearHttp.status === 200 &&
    near.status === "DRAFT_PRESENTABLE" &&
    typeof near.answer === "string" &&
    nearVerification.records === 0 &&
    fakeHttp.status === 200 &&
    // HARD GATE: a fabricated or altered case-law claim is never shown.
    fake.status === "BLOCKED" &&
    fake.answer === undefined &&
    typeof fakeVerification.records ===
        "number" &&
    fakeVerification.records >= 1 &&
    fakeVerification.verified ===
        fakeVerification.records &&
    fakeVerification.supported === 0 &&
    fakeVerification.unverified === 0;
process.stdout.write(JSON.stringify({
    gate: "G22_OFFICIAL_SN_CASE_LAW",
    result: pass
        ? "PASS"
        : "BLOCKED",
    exactMatchPath: {
        http: foundHttp.status,
        status: found.status,
        finalization: found.finalization,
        verification: foundVerification,
        workflow: found.workflow ?? null,
        gateI: found.gateI ?? null,
        gateIWorkflowContract: found.gateIWorkflowContract ??
            null,
        gateITurn: found.gateITurn ?? null,
        audit: found.audit ?? null,
        answerReleased: typeof found.answer ===
            "string"
    },
    nearMatchPath: {
        http: nearHttp.status,
        status: near.status,
        verification: nearVerification,
        answerReleased: "answer" in near
    },
    fakeMarkerPath: {
        http: fakeHttp.status,
        status: fake.status,
        verification: fakeVerification,
        answerReleased: "answer" in fake
    },
    liveOfficialNetworkCallExecuted: false,
    modelProviderCallExecuted: false
}, null, 2) + "\n");
if (!pass) {
    process.exitCode = 1;
}

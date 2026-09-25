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
        throw new Error("G23_CASE_LAW_PREFLIGHT_TOOL_MISSING");
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
            throw new Error("G23_CASE_LAW_PREFLIGHT_FAILED");
        }
    }
}
const signature = "III CZP 25/11";
const exactQuote = "pełny tekst orzeczenia zawiera tę dokładną wypowiedź";
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
    return Promise.reject(new Error("G23_UNEXPECTED_DISCOVERY_URL:" +
        url));
}
function caseFetcher() {
    return async (input) => {
        const url = String(input);
        if (url.includes("task=searchOrzeczenia")) {
            return json({
                data: [{
                        data: [{
                                id: "g23-case",
                                sygnatura_sprawy: signature,
                                data_wydania: "2011-10-18",
                                forma_orzeczenia: "uchwała"
                            }]
                    }]
            });
        }
        const html = "<html><body>" +
            "Sąd Najwyższy " +
            signature +
            " " +
            exactQuote +
            "</body></html>";
        return json({
            data: [{
                    data: {
                        raw: Buffer
                            .from(html, "utf8")
                            .toString("base64")
                    }
                }]
        });
    };
}
class QuoteProvider {
    mode;
    id = "openai";
    label = "G23 deterministic quote provider";
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
        await satisfyCaseLawWorkflowPreflight(params, "g23");
        if (this.mode ===
            "fake-marker") {
            return {
                fullText: "„zmyślony cytat” " +
                    "sygn. III CZP 25/11 " +
                    "✅ [VER: https://sn.pl/fake, 2026-09-15] " +
                    "✅ [CASE-QUOTE:aaaaaaaaaaaaaaaaaaaa]"
            };
        }
        const tool = params.tools?.find((candidate) => candidate.function.name ===
            "verify_case_quote");
        if (!tool ||
            !params.runTools) {
            throw new Error("G23_CASE_QUOTE_TOOL_MISSING");
        }
        const [result] = await params.runTools([{
                id: "g23-quote-1",
                name: tool.function.name,
                input: {
                    caseClaim: "sygn. III CZP 25/11",
                    signature,
                    quote: exactQuote,
                    courtFamily: "SN"
                }
            }]);
        const payload = JSON.parse(result?.content ?? "{}");
        if (payload.status !==
            "VERIFIED" ||
            typeof payload.caseMarker !==
                "string" ||
            typeof payload.quoteMarker !==
                "string") {
            return {
                fullText: "sygn. III CZP 25/11 " +
                    "⚠️ [NIEWERYFIKOWANE]"
            };
        }
        const quote = this.mode ===
            "altered-after-tool"
            ? "zmieniony cytat po weryfikacji"
            : exactQuote;
        return {
            fullText: "„" +
                quote +
                "” sygn. III CZP 25/11 " +
                payload.caseMarker +
                " " +
                payload.quoteMarker
        };
    }
}
function appFor(registry, mode) {
    const providers = new ProviderRegistry();
    providers.register(new QuoteProvider(mode));
    const statuteVerifier = new OfficialLegalSourceVerifier(async () => new Response("<html></html>", {
        status: 200,
        headers: {
            "content-type": "text/html"
        }
    }));
    const caseVerifier = new SupremeCourtCaseVerifier(caseFetcher(), () => "2026-09-15T23:30:00.000Z");
    return createLexHttpApp({
        registry,
        modelCatalog: {
            list: async () => [{
                    provider: "openai",
                    id: "g23-model",
                    displayName: "g23-model",
                    selectable: true
                }]
        },
        sessionExecutor: new SafeSessionExecutor(registry, new ProviderGateway(providers), undefined, (ledger) => new LegalVerificationToolRuntime(ledger, statuteVerifier, undefined, null, caseVerifier, new CaseLawSearchService(caseLawDiscoveryFetcher)))
    });
}
function body() {
    return {
        query: "Zweryfikuj dokładny cytat z orzeczenia SN III CZP 25/11.",
        provider: "openai",
        model: "g23-model",
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
const verifiedHttp = await request(appFor(registry, "verified"))
    .post("/api/sessions/execute")
    .send(body());
const fakeHttp = await request(appFor(registry, "fake-marker"))
    .post("/api/sessions/execute")
    .send(body());
const alteredHttp = await request(appFor(registry, "altered-after-tool"))
    .post("/api/sessions/execute")
    .send(body());
const verified = verifiedHttp.body;
const fake = fakeHttp.body;
const altered = alteredHttp.body;
const verifiedSummary = verification(verified);
const fakeSummary = verification(fake);
const alteredSummary = verification(altered);
const pass = issues.length === 0 &&
    verifiedHttp.status === 200 &&
    verified.status ===
        "DRAFT_PRESENTABLE" &&
    verified.finalization ===
        "PASS" &&
    typeof verified.answer ===
        "string" &&
    String(verified.answer).includes(exactQuote) &&
    String(verified.answer).includes("CASE-QUOTE:") &&
    typeof verifiedSummary.records ===
        "number" &&
    verifiedSummary.records >= 2 &&
    verifiedSummary.verified ===
        verifiedSummary.records &&
    verifiedSummary.supported === 0 &&
    verifiedSummary.unverified === 0 &&
    fakeHttp.status === 200 &&
    // HARD GATE: a fabricated or altered case-law claim is never shown.
    fake.status === "BLOCKED" &&
    fake.answer === undefined &&
    typeof fakeSummary.records ===
        "number" &&
    fakeSummary.records >= 1 &&
    fakeSummary.verified ===
        fakeSummary.records &&
    fakeSummary.supported === 0 &&
    fakeSummary.unverified === 0 &&
    alteredHttp.status === 200 &&
    // HARD GATE: a fabricated or altered case-law claim is never shown.
    altered.status === "BLOCKED" &&
    altered.answer === undefined &&
    typeof alteredSummary.records ===
        "number" &&
    alteredSummary.records >= 2 &&
    alteredSummary.verified ===
        alteredSummary.records &&
    alteredSummary.supported === 0 &&
    alteredSummary.unverified === 0;
process.stdout.write(JSON.stringify({
    gate: "G23_EXACT_SN_CASE_QUOTE_EVIDENCE",
    result: pass
        ? "PASS"
        : "BLOCKED",
    verifiedQuotePath: {
        http: verifiedHttp.status,
        status: verified.status,
        finalization: verified.finalization,
        verification: verifiedSummary,
        answerReleased: typeof verified.answer ===
            "string",
        caseQuoteMarker: typeof verified.answer ===
            "string" &&
            String(verified.answer).includes("CASE-QUOTE:")
    },
    fabricatedMarkerPath: {
        http: fakeHttp.status,
        status: fake.status,
        verification: fakeSummary,
        answerReleased: "answer" in fake
    },
    alteredAfterVerificationPath: {
        http: alteredHttp.status,
        status: altered.status,
        verification: alteredSummary,
        answerReleased: "answer" in altered
    },
    liveOfficialNetworkCallExecuted: false,
    modelProviderCallExecuted: false
}, null, 2) + "\n");
if (!pass) {
    process.exitCode = 1;
}

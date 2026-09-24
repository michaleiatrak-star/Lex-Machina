import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ModelAutoRouter } from "./model-auto-routing.js";
import { LexSkillRegistry } from "./registry.js";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { parseSkillSelectionEnvelope, SKILL_SELECTION_ENVELOPE_PREFIX } from "./skill-selection.js";
const roots = [];
const DR01 = "dr-01-ustroj-konstytucyjny-i-zrodla-prawa";
const DR03 = "dr-03-prawo-karne-wykroczenia-egzekucja";
function skill(root, name, type, description) {
    const directory = path.join(root, name);
    fs.mkdirSync(directory, {
        recursive: true
    });
    fs.writeFileSync(path.join(directory, "SKILL.md"), [
        "---",
        `name: ${name}`,
        `type: ${type}`,
        `description: "${description}"`,
        "---",
        `# ${name}`
    ].join("\n"));
}
function fixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-model-auto-router-"));
    roots.push(root);
    skill(root, "prawny-router-v3", "router", "centralny router");
    skill(root, "prawo-polskie-v2", "domain-router", "router prawa polskiego");
    skill(root, "shared", "shared", "wspólne zasady");
    skill(root, DR01, "domain", "ustrój konstytucyjny źródła prawa");
    skill(root, DR03, "domain", "prawo karne kodeks karny wykroczenia");
    skill(root, "analizator-przepisow-v2", "executive-analiza", "analiza konkretnego przepisu");
    skill(root, "analiza-sadowa-v6", "executive-sadowa", "pełna analiza sprawy sądowej");
    fs.writeFileSync(path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"), [
        "# routing",
        `- ${DR01}`,
        `- ${DR03}`
    ].join("\n"));
    const registry = new LexSkillRegistry(root);
    expect(registry.scan()).toEqual([]);
    return registry;
}
class QueueAdapter {
    outputs;
    id = "openai";
    label = "queue";
    capabilities = {
        streaming: true,
        tools: true,
        reasoning: true,
        modelDiscovery: false
    };
    calls = [];
    constructor(outputs) {
        this.outputs = outputs;
    }
    async stream(params) {
        this.calls.push(params);
        const output = this.outputs.shift();
        if (output === undefined) {
            throw new Error("NO_SCRIPTED_ROUTER_OUTPUT");
        }
        return {
            fullText: output
        };
    }
}
function router(registry, outputs) {
    const providerRegistry = new ProviderRegistry();
    const adapter = new QueueAdapter(outputs);
    providerRegistry.register(adapter);
    return {
        router: new ModelAutoRouter(registry, new ProviderGateway(providerRegistry)),
        adapter
    };
}
afterEach(() => {
    for (const root of roots.splice(0)) {
        fs.rmSync(root, {
            recursive: true,
            force: true
        });
    }
});
describe("ModelAutoRouter", () => {
    it("classifies a message without a legal matter so no legal skills are loaded", async () => {
        const registry = fixture();
        const setup = router(registry, [
            '{"legal":false}'
        ]);
        const result = await setup.router
            .resolve({
            query: `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[]}\nCześć, jak się masz?`,
            provider: "openai",
            model: "account/openai/default"
        });
        expect(result.decision.legal).toBe(false);
        expect(result.decision.executionSkills).toEqual([]);
        expect(result.decision.workflowExecutionSkill).toBeNull();
        expect(setup.adapter.calls[0]
            ?.systemPrompt).toContain('{"legal":false}');
    });
    it("does not call a local model to route a trivial chat command", async () => {
        const setup = router(fixture(), []);
        const result = await setup.router
            .resolve({
            query: `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[]}\npowiedz ok`,
            provider: "openai",
            model: "local/bielik-11b-v3-q4km"
        });
        expect(result.decision.legal).toBe(false);
        expect(setup.adapter.calls).toHaveLength(0);
    });
    it("routes local models from the compact catalog without the central routing map", async () => {
        const setup = router(fixture(), [
            '{"legal":false}'
        ]);
        await setup.router
            .resolve({
            query: `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[]}\nJaka będzie pogoda?`,
            provider: "openai",
            model: "local/bielik-11b-v3-q4km"
        });
        expect(setup.adapter.calls[0]?.systemPrompt).not.toContain("# CENTRALNA MAPA ROUTINGU");
    });
    it("uses the model decision as the AUTO route and exact skill selection", async () => {
        const registry = fixture();
        const setup = router(registry, [
            JSON.stringify({
                primarySkill: DR03,
                domainSkills: [
                    DR03
                ],
                executionSkills: [
                    "analizator-przepisow-v2"
                ],
                workflowExecutionSkill: "analizator-przepisow-v2"
            })
        ]);
        const result = await setup.router
            .resolve({
            query: `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[]}\nJaka jest odpowiedzialność karna z art. 276 k.k.?`,
            provider: "openai",
            model: "account/openai/default"
        });
        expect(result.decision).toEqual({
            legal: true,
            primarySkill: DR03,
            domainSkills: [
                DR03
            ],
            executionSkills: [
                "analizator-przepisow-v2"
            ],
            workflowExecutionSkill: "analizator-przepisow-v2"
        });
        const envelope = parseSkillSelectionEnvelope(result.query);
        expect(envelope.automatic).toBe(false);
        expect(envelope.modelRouted).toBe(true);
        expect(envelope.manualSkills).toEqual([
            "analizator-przepisow-v2"
        ]);
        expect(envelope
            .workflowExecutionSkill).toBe("analizator-przepisow-v2");
    });
    it("does not semantically override a valid model choice with regex or token scoring", async () => {
        const registry = fixture();
        const setup = router(registry, [
            JSON.stringify({
                primarySkill: DR01,
                domainSkills: [
                    DR01
                ],
                executionSkills: [],
                workflowExecutionSkill: null
            })
        ]);
        const result = await setup.router
            .resolve({
            query: "Jaka jest odpowiedzialność karna z art. 276 k.k.?",
            provider: "openai",
            model: "router-model"
        });
        // This is deliberately semantically wrong. The runtime validates only
        // catalog membership in AUTO; it does not secretly replace the model's
        // decision with a deterministic rule.
        expect(result.decision
            .primarySkill).toBe(DR01);
        expect(setup.adapter.calls).toHaveLength(1);
    });
    it("retries model routing once instead of using a deterministic fallback", async () => {
        const registry = fixture();
        const setup = router(registry, [
            "niepoprawny wynik",
            JSON.stringify({
                primarySkill: DR03,
                domainSkills: [
                    DR03
                ],
                executionSkills: [],
                workflowExecutionSkill: null
            })
        ]);
        const result = await setup.router
            .resolve({
            query: "Pytanie prawne",
            provider: "openai",
            model: "router-model"
        });
        expect(result.decision
            .primarySkill).toBe(DR03);
        expect(setup.adapter.calls).toHaveLength(2);
    });
    it("fails closed when the model selects an unchecked execution skill", async () => {
        const registry = fixture();
        const invalid = JSON.stringify({
            primarySkill: DR03,
            domainSkills: [
                DR03
            ],
            executionSkills: [
                "analiza-sadowa-v6"
            ],
            workflowExecutionSkill: "analiza-sadowa-v6"
        });
        const setup = router(registry, [
            invalid,
            invalid
        ]);
        await expect(setup.router.resolve({
            query: `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[],"execution":["analizator-przepisow-v2"]}\nPytanie`,
            provider: "openai",
            model: "router-model"
        })).rejects.toThrow("AUTO_ROUTING_INVALID_MODEL_OUTPUT");
    });
});

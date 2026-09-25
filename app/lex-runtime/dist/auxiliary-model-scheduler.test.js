import { describe, expect, it } from "vitest";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { AuxiliaryModelScheduler, auxiliaryVerificationCallKey } from "./auxiliary-model-scheduler.js";
function gatewayWith(handler) {
    const calls = [];
    const registry = new ProviderRegistry();
    const adapter = {
        id: "openai",
        label: "test",
        capabilities: {
            streaming: true,
            tools: true,
            reasoning: true,
            modelDiscovery: false
        },
        async stream(params) {
            calls.push(params);
            return {
                fullText: await handler(params)
            };
        }
    };
    registry.register(adapter);
    return {
        gateway: new ProviderGateway(registry),
        calls
    };
}
describe("program-controlled auxiliary scheduler", () => {
    it("does not call a helper when disabled", async () => {
        const { gateway, calls } = gatewayWith(async () => "SHOULD_NOT_RUN");
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const result = await scheduler.preflight({
            config: {
                enabled: false,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "openai",
                model: "gpt-test"
            },
            currentUserText: "art. 5 KC"
        });
        expect(result.summary.status).toBe("DISABLED");
        expect(result.summary
            .ownership
            .effectiveOwner).toBe("PRIMARY");
        expect(result.summary
            .ownership
            .fallbackApplied).toBe(true);
        expect(result.appendix)
            .toContain("PRIMARY FALLBACK");
        expect(calls)
            .toHaveLength(0);
    });
    it("skips messages without an eligible legal-reference task", async () => {
        const { gateway, calls } = gatewayWith(async () => "SHOULD_NOT_RUN");
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "openai",
                model: "gpt-test"
            },
            currentUserText: "Napisz krótkie podsumowanie faktów."
        });
        expect(result.summary.status).toBe("SKIPPED_NO_ELIGIBLE_TASK");
        expect(calls)
            .toHaveLength(0);
    });
    it("never duplicates the primary model as auxiliary lane", async () => {
        const { gateway, calls } = gatewayWith(async () => "SHOULD_NOT_RUN");
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            currentUserText: "Sprawdź art. 5 KC."
        });
        expect(result.summary.status).toBe("SKIPPED_SAME_AS_PRIMARY");
        expect(result.summary
            .ownership
            .effectiveOwner).toBe("PRIMARY");
        expect(result.summary
            .ownership
            .fallbackApplied).toBe(true);
        expect(calls)
            .toHaveLength(0);
    });
    it("keeps local models for files only and never runs them as a legal helper", async () => {
        const { gateway, calls } = gatewayWith(async () => "SHOULD_NOT_RUN");
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "openai",
                model: "local/mistral-nemo-12b-q4km"
            },
            currentUserText: "Sprawdź art. 5 KC.",
            runVerificationTools: async () => []
        });
        expect(result.summary.status).toBe("SKIPPED_LOCAL_MODEL_FILES_ONLY");
        expect(result.summary
            .ownership
            .effectiveOwner).toBe("PRIMARY");
        expect(result.summary
            .ownership
            .fallbackReason).toBe("AUXILIARY_LOCAL_MODEL_FILES_ONLY");
        expect(calls)
            .toHaveLength(0);
    });
    it("does not load a local model as a legal helper for a cloud primary", async () => {
        const { gateway, calls } = gatewayWith(async () => "SHOULD_NOT_RUN");
        const result = await new AuxiliaryModelScheduler(gateway).preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "anthropic",
                model: "claude-test"
            },
            currentUserText: "Sprawdź art. 5 KC.",
            runVerificationTools: async () => []
        });
        expect(result.summary.status).toBe("SKIPPED_LOCAL_MODEL_FILES_ONLY");
        expect(result.summary.ownership.effectiveOwner).toBe("PRIMARY");
        expect(calls).toHaveLength(0);
    });
    it("uses helper only for extraction and sends candidates to deterministic verifier", async () => {
        const { gateway, calls } = gatewayWith(async () => JSON.stringify({
            references: [
                {
                    kind: "statute",
                    claim: "art. 5 KC",
                    act: "KC"
                },
                {
                    kind: "case",
                    claim: "sygn. III CZP 25/11",
                    signature: "III CZP 25/11",
                    courtFamily: "SN"
                }
            ]
        }));
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const verificationCalls = [];
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "helper-cloud-test"
            },
            primary: {
                provider: "anthropic",
                model: "claude-test"
            },
            currentUserText: "Sprawdź art. 5 KC i sygn. III CZP 25/11.",
            runVerificationTools: async (items) => {
                verificationCalls.push(...items.map((item) => ({
                    name: item.name,
                    input: {
                        ...item.input
                    }
                })));
                return items.map((item) => ({
                    tool_use_id: item.id,
                    content: JSON.stringify({
                        status: "VERIFIED",
                        claim: item.input
                            .claim
                    })
                }));
            }
        });
        expect(calls)
            .toHaveLength(1);
        expect(calls[0]?.tools).toBeUndefined();
        expect(calls[0]?.reasoning).toBe("none");
        expect(verificationCalls.map((item) => item.name)).toEqual([
            "verify_legal_reference",
            "verify_case_reference"
        ]);
        expect(result.summary
            .deterministicVerifications).toBe(2);
        expect(result.summary.status).toBe("PASS");
        expect(result.summary
            .ownership
            .effectiveOwner).toBe("AUXILIARY");
        expect(result.summary
            .ownership
            .fallbackApplied).toBe(false);
        expect(result.appendix)
            .toContain("deterministic runtime verification");
        const key = auxiliaryVerificationCallKey({
            name: "verify_legal_reference",
            input: {
                claim: "art. 5 KC",
                kind: "statute",
                act: "KC"
            }
        });
        expect(result
            .cachedVerificationResults
            .has(key)).toBe(true);
    });
    it("pins an explicit historical scope even when the helper omits asOf", async () => {
        const { gateway } = gatewayWith(async () => JSON.stringify({
            references: [
                {
                    kind: "statute",
                    claim: "art. 5 KC",
                    act: "KC"
                }
            ]
        }));
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const verificationInputs = [];
        await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "helper-cloud-test"
            },
            primary: {
                provider: "anthropic",
                model: "claude-test"
            },
            currentUserText: "Według stanu na 2020-06-01 sprawdź art. 5 KC.",
            runVerificationTools: async (items) => {
                verificationInputs.push(...items.map((item) => ({
                    ...item.input
                })));
                return items.map((item) => ({
                    tool_use_id: item.id,
                    content: JSON.stringify({
                        status: "VERIFIED"
                    })
                }));
            }
        });
        expect(verificationInputs).toEqual([
            expect.objectContaining({
                claim: "art. 5 KC",
                act: "KC",
                asOf: "2020-06-01"
            })
        ]);
    });
    it("rejects helper-invented references that are absent from the current user turn", async () => {
        const { gateway } = gatewayWith(async () => JSON.stringify({
            references: [
                {
                    kind: "statute",
                    claim: "art. 58 KC",
                    act: "KC"
                }
            ]
        }));
        const scheduler = new AuxiliaryModelScheduler(gateway);
        let verificationCount = 0;
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: "anthropic",
                model: "claude-test"
            },
            currentUserText: "Zweryfikuj art. 5 KC.",
            runVerificationTools: async (items) => {
                verificationCount +=
                    items.length;
                return [];
            }
        });
        expect(result.summary
            .extractedCandidates).toBe(0);
        expect(verificationCount).toBe(0);
        expect(result
            .cachedVerificationResults
            .size).toBe(0);
    });
    it("degrades instead of blocking primary execution when helper fails", async () => {
        const { gateway } = gatewayWith(async () => {
            throw new Error("LOCAL_MODEL_NOT_CONFIGURED");
        });
        const scheduler = new AuxiliaryModelScheduler(gateway);
        const result = await scheduler.preflight({
            config: {
                enabled: true,
                provider: "openai",
                model: "helper-cloud-test"
            },
            primary: {
                provider: "xai",
                model: "grok-test"
            },
            currentUserText: "Zweryfikuj art. 5 KC.",
            runVerificationTools: async () => []
        });
        expect(result.summary.status).toBe("FAILED");
        expect(result.summary.error).toContain("LOCAL_MODEL_NOT_CONFIGURED");
    });
});

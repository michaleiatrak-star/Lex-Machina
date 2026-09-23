import { planAutomaticLegalVerification } from "./gate-i-auto-verification.js";
function parseToolPayload(result) {
    if (typeof result.content !==
        "string") {
        return null;
    }
    try {
        const parsed = JSON.parse(result.content);
        return (parsed &&
            typeof parsed ===
                "object" &&
            !Array.isArray(parsed))
            ? parsed
            : null;
    }
    catch {
        return null;
    }
}
function resultPassed(payload) {
    if (!payload) {
        return false;
    }
    const status = typeof payload.status ===
        "string"
        ? payload.status
        : "";
    return [
        "OK",
        "VERIFIED",
        "SUPPORTED"
    ].includes(status);
}
function discoveryPayload(result, source) {
    const payload = parseToolPayload(result);
    if (!payload ||
        payload.verificationStatus !==
            "DISCOVERY_ONLY") {
        return null;
    }
    return {
        source,
        payload
    };
}
function boundedJson(value, maxChars = 12_000) {
    const serialized = JSON.stringify(value, null, 2);
    return serialized.length <=
        maxChars
        ? serialized
        : serialized.slice(0, maxChars) +
            "\n[TRUNCATED_BY_RUNTIME]";
}
export async function runGateIRuntimePrelude(args) {
    const actions = [];
    const appendix = [];
    const verificationPlan = planAutomaticLegalVerification(args.query, args.ledger);
    if (verificationPlan
        .calls.length > 0) {
        if (!args.runTools) {
            for (const call of verificationPlan.calls) {
                actions.push({
                    kind: "VERIFY_USER_REFERENCE",
                    target: String(call.input.claim ??
                        call.name),
                    result: "BLOCKED",
                    detail: "VERIFICATION_RUNTIME_UNAVAILABLE"
                });
            }
        }
        else {
            const results = await args.runTools(verificationPlan.calls);
            const byId = new Map(results.map((result) => [
                result.tool_use_id,
                result
            ]));
            for (const call of verificationPlan.calls) {
                const result = byId.get(call.id);
                const payload = result
                    ? parseToolPayload(result)
                    : null;
                const pass = resultPassed(payload);
                actions.push({
                    kind: "VERIFY_USER_REFERENCE",
                    target: String(call.input.claim ??
                        call.name),
                    result: pass
                        ? "PASS"
                        : "BLOCKED",
                    ...(pass
                        ? {}
                        : {
                            detail: typeof payload?.error ===
                                "string"
                                ? payload.error
                                : "REFERENCE_VERIFICATION_FAILED"
                        })
                });
            }
            const records = args.ledger
                .all()
                .filter((record) => record.status ===
                "VERIFIED" ||
                record.status ===
                    "SUPPORTED");
            if (records.length > 0) {
                appendix.push([
                    "# GATE I — PREVERIFIED USER REFERENCES",
                    "The runtime verified these references before semantic execution. Do not re-run the same mechanical verification unless the exact claim changes.",
                    boundedJson(records.map((record) => ({
                        claim: record.claim,
                        kind: record.kind,
                        status: record.status,
                        sourceUrl: record.sourceUrl ??
                            null,
                        sourceTier: record.sourceTier ??
                            null,
                        temporalMode: record.temporalMode ??
                            null,
                        temporalFreshnessStatus: record.temporalFreshnessStatus ??
                            null,
                        caseSignature: record.caseSignature ??
                            null,
                        fetchedAt: record.fetchedAt
                    })))
                ].join("\n"));
            }
        }
    }
    if (args.workflow ===
        "CASE_LAW_V1") {
        if (!args.runTools) {
            actions.push({
                kind: "CASE_LAW_DISCOVERY",
                target: "SAOS+CBOSA",
                result: "BLOCKED",
                detail: "CASE_LAW_DISCOVERY_RUNTIME_UNAVAILABLE"
            });
        }
        else {
            const calls = [
                {
                    id: "gate-i-prelude-case-saos",
                    name: "search_case_law",
                    input: {
                        query: args.query,
                        source: "SAOS",
                        limit: 5
                    }
                },
                {
                    id: "gate-i-prelude-case-cbosa",
                    name: "search_case_law",
                    input: {
                        query: args.query,
                        source: "CBOSA",
                        limit: 5
                    }
                }
            ];
            const results = await args.runTools(calls);
            const byId = new Map(results.map((result) => [
                result.tool_use_id,
                result
            ]));
            const discoveries = [];
            for (const [call, source] of [
                [
                    calls[0],
                    "SAOS"
                ],
                [
                    calls[1],
                    "CBOSA"
                ]
            ]) {
                const result = byId.get(call.id);
                const discovery = result
                    ? discoveryPayload(result, source)
                    : null;
                actions.push({
                    kind: "CASE_LAW_DISCOVERY",
                    target: source,
                    result: discovery
                        ? "PASS"
                        : "BLOCKED",
                    ...(discovery
                        ? {}
                        : {
                            detail: "DISCOVERY_FAILED_OR_UNVERIFIED_FORMAT"
                        })
                });
                if (discovery) {
                    discoveries.push(discovery);
                }
            }
            if (discoveries.length >
                0) {
                appendix.push([
                    "# GATE I — RUNTIME CASE-LAW DISCOVERY",
                    "The runtime already performed the mandatory baseline discovery before semantic execution.",
                    "All candidates below are DISCOVERY_ONLY. Never cite them as verified merely because they appear here.",
                    "Select semantically relevant candidates; any emitted signature/quote/proposition still must pass the deterministic verification ledger.",
                    boundedJson(discoveries)
                ].join("\n"));
            }
        }
    }
    const runtimeUnavailable = actions.some((action) => action.result ===
        "BLOCKED" &&
        (action.detail ===
            "VERIFICATION_RUNTIME_UNAVAILABLE" ||
            action.detail ===
                "CASE_LAW_DISCOVERY_RUNTIME_UNAVAILABLE"));
    if (actions.some((action) => action.result ===
        "BLOCKED" &&
        !(action.detail ===
            "VERIFICATION_RUNTIME_UNAVAILABLE" ||
            action.detail ===
                "CASE_LAW_DISCOVERY_RUNTIME_UNAVAILABLE"))) {
        appendix.push([
            "# GATE I — RUNTIME TOOL FALLBACK",
            "At least one mandatory runtime lookup was attempted but did not return a usable verified result.",
            "Do not invent the missing source, signature or search result. Continue only with claims that can pass the final deterministic ledger/finalization gates."
        ].join("\n"));
    }
    return {
        gate: "G39I_RUNTIME_PRELUDE",
        result: runtimeUnavailable
            ? "BLOCKED"
            : "PASS",
        actions,
        appendix: appendix.join("\n\n")
    };
}

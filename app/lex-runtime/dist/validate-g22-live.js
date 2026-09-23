import { SupremeCourtCaseVerifier } from "./case-law-verifier.js";
const signature = "II CSK 101/20";
function shape(value, depth = 0) {
    if (value === null) {
        return { type: "null" };
    }
    if (depth >= 3) {
        return {
            type: Array.isArray(value)
                ? "array"
                : typeof value
        };
    }
    if (Array.isArray(value)) {
        return {
            type: "array",
            length: value.length,
            ...(value.length > 0
                ? {
                    first: shape(value[0], depth + 1)
                }
                : {})
        };
    }
    if (typeof value === "object") {
        const objectValue = value;
        return {
            type: "object",
            keys: Object.keys(objectValue)
                .slice(0, 20),
            ...("data" in objectValue
                ? {
                    data: shape(objectValue.data, depth + 1)
                }
                : {}),
            ...("raw" in objectValue
                ? {
                    raw: shape(objectValue.raw, depth + 1)
                }
                : {})
        };
    }
    if (typeof value === "string") {
        return {
            type: "string",
            length: value.length
        };
    }
    return {
        type: typeof value
    };
}
const transportTrace = [];
const tracedFetch = async (input, init) => {
    const response = await globalThis.fetch(input, init);
    const contentType = response.headers
        .get("content-type") ??
        "";
    let payloadShape = null;
    if (contentType
        .toLowerCase()
        .includes("json")) {
        try {
            payloadShape =
                shape(await response
                    .clone()
                    .json());
        }
        catch {
            payloadShape = null;
        }
    }
    transportTrace.push({
        url: String(input)
            .replace(/([?&]id=)[^&]+/u, "$1<redacted-id>"),
        status: response.status,
        contentType,
        locationHost: response.headers
            .get("location")
            ? new URL(response.headers
                .get("location"), String(input)).hostname
            : null,
        payloadShape
    });
    return response;
};
let result = null;
let lastReason = null;
let attempts = 0;
for (let attempt = 1; attempt <= 2; attempt += 1) {
    attempts = attempt;
    const candidate = await new SupremeCourtCaseVerifier(tracedFetch).verify({
        claim: "sygn. " + signature,
        signature,
        toolCallId: "g22-live-sn"
    });
    result = candidate;
    if (candidate.status === "FOUND") {
        break;
    }
    lastReason =
        candidate.reason ??
            candidate.status;
}
const sourceHost = result?.record?.sourceUrl
    ? new URL(result.record.sourceUrl).hostname
    : null;
const pass = result?.status === "FOUND" &&
    result.normalizedSignature ===
        signature &&
    result.record?.status ===
        "VERIFIED" &&
    result.record.kind === "case" &&
    result.record.sourceTier === "R1" &&
    result.record.caseScope ===
        "FULL_TEXT" &&
    result.judgment?.contentScope ===
        "FULL_TEXT" &&
    sourceHost === "sn.pl";
process.stdout.write(JSON.stringify({
    gate: "G22_LIVE_SN_CASE_LAW_PROBE",
    result: pass
        ? "PASS"
        : "BLOCKED",
    attempts,
    signature,
    verificationStatus: result?.status ?? null,
    normalizedSignature: result?.normalizedSignature ??
        null,
    sourceUrl: result?.record?.sourceUrl ??
        null,
    sourceTier: result?.record?.sourceTier ??
        null,
    caseScope: result?.record?.caseScope ??
        null,
    judgmentDate: result?.judgment?.date ??
        null,
    judgmentForm: result?.judgment?.form ??
        null,
    rejectedNearMatches: result?.rejectedNearMatches ??
        [],
    lastReason,
    transportTrace,
    modelProviderCallExecuted: false
}, null, 2) + "\n");
if (!pass) {
    process.exitCode = 1;
}

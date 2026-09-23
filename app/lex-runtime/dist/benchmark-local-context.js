import fs from "node:fs";
import path from "node:path";
import { LocalModelRuntime } from "./local-model-runtime.js";
const DEFAULT_PROFILES = [
    64_000,
    96_000,
    128_000,
    160_000,
    200_000
];
const FILLER = [
    "Materiał kontrolny opisuje neutralną chronologię czynności, dokumentów i terminów.",
    "Każde zdanie jest wyłącznie wypełnieniem testowym i nie stanowi porady prawnej.",
    "Dokument A został zarejestrowany, dokument B przypisano do osi czasu, a dokument C pozostaje załącznikiem.",
    "Analiza techniczna ma zachować pełny kontekst bez pomijania informacji kontrolnej."
].join(" ");
function fail(message) {
    throw new Error(message);
}
function argument(name) {
    const prefix = `--${name}=`;
    return process.argv
        .slice(2)
        .find((value) => value.startsWith(prefix))
        ?.slice(prefix.length);
}
function parseProfiles(value) {
    if (!value) {
        return [
            ...DEFAULT_PROFILES
        ];
    }
    const profiles = [
        ...new Set(value
            .split(",")
            .map((item) => Number(item.trim())))
    ];
    if (profiles.length < 1 ||
        profiles.length > 8 ||
        profiles.some((item) => !Number.isInteger(item) ||
            item < 64_000 ||
            item > 200_000)) {
        fail("LOCAL_CONTEXT_BENCHMARK_PROFILES_INVALID");
    }
    return profiles.sort((left, right) => left - right);
}
function parseBackendPreference(value, fallback) {
    if (!value) {
        return fallback;
    }
    if (value !== "AUTO" &&
        value !== "VULKAN_X64" &&
        value !== "CPU_X64_PORTABLE") {
        fail("LOCAL_CONTEXT_BENCHMARK_BACKEND_INVALID");
    }
    return value;
}
async function tokenize(endpoint, content) {
    const response = await fetch(`${endpoint}/tokenize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            content,
            add_special: false,
            parse_special: true,
            with_pieces: false
        }),
        signal: AbortSignal.timeout(60_000)
    });
    if (!response.ok) {
        fail(`LOCAL_CONTEXT_BENCHMARK_TOKENIZE_HTTP_${response.status}`);
    }
    const payload = await response.json();
    if (!Array.isArray(payload.tokens)) {
        fail("LOCAL_CONTEXT_BENCHMARK_TOKENIZE_INVALID");
    }
    return payload.tokens.length;
}
function fillerChars(count) {
    if (count <= 0) {
        return "";
    }
    const unit = `${FILLER} `;
    const repeats = Math.ceil(count /
        unit.length);
    return unit
        .repeat(repeats)
        .slice(0, count);
}
function promptWithPasskey(totalChars, position, passkey) {
    const instructionStart = [
        "TEST TECHNICZNY DŁUGIEGO KONTEKSTU.",
        "W całym materiale znajduje się dokładnie jeden KOD KONTROLNY.",
        "Po przeczytaniu materiału zwróć wyłącznie wartość kodu, bez komentarza.",
        ""
    ].join("\n");
    const marker = `\nKOD KONTROLNY: ${passkey}\n`;
    const instructionEnd = [
        "",
        "Koniec materiału.",
        "Jaki jest KOD KONTROLNY?",
        "Odpowiedz wyłącznie kodem."
    ].join("\n");
    const reserved = instructionStart.length +
        marker.length +
        instructionEnd.length;
    const fillerLength = Math.max(0, totalChars -
        reserved);
    const beforeLength = Math.floor(fillerLength *
        position);
    return [
        instructionStart,
        fillerChars(beforeLength),
        marker,
        fillerChars(fillerLength -
            beforeLength),
        instructionEnd
    ].join("");
}
async function fitPrompt(args) {
    let chars = Math.max(2_000, Math.floor(args.targetTokens *
        args.charsPerToken));
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const content = promptWithPasskey(chars, args.position, args.passkey);
        const inputTokens = await tokenize(args.endpoint, content);
        const ratio = inputTokens /
            args.targetTokens;
        if (ratio >= 0.96 &&
            ratio <= 1.0) {
            return {
                content,
                inputTokens
            };
        }
        if (inputTokens < 1) {
            fail("LOCAL_CONTEXT_BENCHMARK_EMPTY_TOKENIZATION");
        }
        const correction = args.targetTokens /
            inputTokens;
        chars =
            Math.max(2_000, Math.floor(chars *
                correction *
                0.985));
    }
    const content = promptWithPasskey(chars, args.position, args.passkey);
    const inputTokens = await tokenize(args.endpoint, content);
    if (inputTokens >
        args.targetTokens) {
        fail("LOCAL_CONTEXT_BENCHMARK_PROMPT_TOO_LARGE");
    }
    if (inputTokens <
        Math.floor(args.targetTokens *
            0.96)) {
        fail("LOCAL_CONTEXT_BENCHMARK_PROMPT_UNDERFILLED");
    }
    return {
        content,
        inputTokens
    };
}
async function recall(endpoint, modelId, content) {
    const response = await fetch(`${endpoint}/v1/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            model: modelId,
            messages: [
                {
                    role: "user",
                    content
                }
            ],
            temperature: 0,
            max_tokens: 24,
            stream: false
        }),
        signal: AbortSignal.timeout(20 * 60_000)
    });
    if (!response.ok) {
        fail(`LOCAL_CONTEXT_BENCHMARK_CHAT_HTTP_${response.status}`);
    }
    const payload = await response.json();
    const output = payload.choices?.[0]
        ?.message?.content;
    if (typeof output !==
        "string") {
        fail("LOCAL_CONTEXT_BENCHMARK_CHAT_INVALID");
    }
    return output.trim();
}
async function main() {
    if (process.platform !==
        "win32") {
        fail("LOCAL_CONTEXT_BENCHMARK_WINDOWS_REQUIRED");
    }
    const outputArg = argument("output");
    if (!outputArg) {
        fail("LOCAL_CONTEXT_BENCHMARK_OUTPUT_REQUIRED");
    }
    const outputPath = path.resolve(outputArg);
    const profiles = parseProfiles(argument("profiles"));
    const runtime = new LocalModelRuntime();
    const identity = runtime
        .installedModelUpdateIdentity();
    if (!identity) {
        fail("LOCAL_CONTEXT_BENCHMARK_MODEL_NOT_INSTALLED");
    }
    const requestedModel = argument("model");
    if (requestedModel &&
        requestedModel !==
            identity.modelId) {
        fail("LOCAL_CONTEXT_BENCHMARK_MODEL_MISMATCH");
    }
    const modelId = identity.modelId;
    const originalContext = identity.contextTokens;
    const initialStatus = runtime.status();
    const originalBackendMode = initialStatus
        .hardware
        .backendSelectionMode ??
        initialStatus
            .backendPolicy
            .default;
    const benchmarkBackendMode = parseBackendPreference(argument("backend"), originalBackendMode);
    if (!initialStatus
        .backendPolicy
        .allowed
        .includes(benchmarkBackendMode)) {
        fail("LOCAL_CONTEXT_BENCHMARK_BACKEND_NOT_ALLOWED");
    }
    const models = runtime.listModels();
    const descriptor = models.find((model) => model.id ===
        modelId &&
        model.installed);
    if (!descriptor) {
        fail("LOCAL_CONTEXT_BENCHMARK_MODEL_DESCRIPTOR_MISSING");
    }
    const allowedProfiles = profiles.filter((profile) => profile >=
        descriptor
            .minimumContextWindow &&
        profile <=
            descriptor
                .maximumContextWindow);
    if (allowedProfiles.length !==
        profiles.length) {
        fail("LOCAL_CONTEXT_BENCHMARK_PROFILE_OUTSIDE_MODEL_POLICY");
    }
    const signedModelPack = Boolean(identity.packVersion);
    if (signedModelPack &&
        benchmarkBackendMode !==
            originalBackendMode) {
        fail("LOCAL_CONTEXT_BENCHMARK_SIGNED_MODEL_BACKEND_SWITCH_BLOCKED");
    }
    const results = [];
    let fatal = null;
    try {
        for (const contextTokens of profiles) {
            const result = {
                contextTokens,
                result: "FAIL",
                backend: null,
                startupMs: null,
                tokenizerCharsPerToken: null,
                cases: []
            };
            try {
                if (signedModelPack) {
                    await runtime
                        .reconfigureContext(modelId, contextTokens);
                }
                else {
                    await runtime.provision(modelId, contextTokens, undefined, benchmarkBackendMode);
                }
                await runtime.ensureRunning(modelId);
                const status = runtime.status();
                const qualification = status.qualification;
                if (!qualification ||
                    qualification.modelId !==
                        modelId ||
                    qualification
                        .contextTokens !==
                        contextTokens) {
                    fail("LOCAL_CONTEXT_BENCHMARK_QUALIFICATION_MISSING");
                }
                result.backend =
                    qualification.backend ??
                        status.hardware
                            .configuredBackend ??
                        "CPU_X64_PORTABLE";
                result.startupMs =
                    qualification.startupMs;
                const charsPerToken = qualification
                    .tokenizerCalibration
                    ?.conservativeCharsPerToken;
                if (typeof charsPerToken !==
                    "number" ||
                    !Number.isFinite(charsPerToken) ||
                    charsPerToken < 1 ||
                    charsPerToken > 3) {
                    fail("LOCAL_CONTEXT_BENCHMARK_TOKENIZER_CALIBRATION_REQUIRED");
                }
                result.tokenizerCharsPerToken =
                    charsPerToken;
                const endpoint = `http://${runtime.host}:${runtime.port}`;
                const targetTokens = Math.floor(contextTokens *
                    0.72);
                for (const [index, position] of [
                    0.05,
                    0.5,
                    0.95
                ].entries()) {
                    const passkey = `LEXCTX-${contextTokens}-P${index + 1}-A7F3C9`;
                    const fitted = await fitPrompt({
                        endpoint,
                        targetTokens,
                        charsPerToken,
                        position,
                        passkey
                    });
                    const started = Date.now();
                    const output = await recall(endpoint, modelId, fitted.content);
                    const elapsedMs = Date.now() -
                        started;
                    result.cases.push({
                        position,
                        passkey,
                        inputTokens: fitted.inputTokens,
                        targetTokens,
                        output: output.slice(0, 200),
                        passed: output === passkey &&
                            fitted.inputTokens >=
                                Math.floor(targetTokens *
                                    0.96),
                        elapsedMs
                    });
                }
                result.result =
                    result.cases.length ===
                        3 &&
                        result.cases.every((item) => item.passed)
                        ? "PASS"
                        : "FAIL";
            }
            catch (error) {
                result.error =
                    error instanceof Error
                        ? error.message
                        : String(error);
            }
            finally {
                await runtime.stop();
            }
            results.push(result);
        }
    }
    catch (error) {
        fatal =
            error instanceof Error
                ? error.message
                : String(error);
    }
    finally {
        try {
            if (signedModelPack) {
                await runtime
                    .reconfigureContext(modelId, originalContext);
            }
            else {
                await runtime.provision(modelId, originalContext, undefined, originalBackendMode);
            }
            await runtime.stop();
        }
        catch (error) {
            fatal =
                fatal ??
                    `RESTORE_FAILED:${error instanceof Error
                        ? error.message
                        : String(error)}`;
        }
    }
    const report = {
        schemaVersion: 1,
        kind: "LEX_MACHINA_LOCAL_CONTEXT_BENCHMARK",
        modelId,
        modelSha256: identity.sha256,
        modelPack: {
            signed: signedModelPack,
            ...(identity.packVersion
                ? {
                    packVersion: identity.packVersion
                }
                : {}),
            ...(identity.signerKeyId
                ? {
                    signerKeyId: identity.signerKeyId
                }
                : {})
        },
        model: {
            displayName: descriptor.displayName,
            nativeContextWindow: descriptor
                .nativeContextWindow,
            minimumContextWindow: descriptor
                .minimumContextWindow,
            maximumContextWindow: descriptor
                .maximumContextWindow,
            quantization: descriptor.quantization
        },
        hardware: runtime.hardwareProfile(),
        acceptance: {
            targetPromptLoadFraction: 0.72,
            minimumTargetFitFraction: 0.96,
            minimumRequestedContextLoadFraction: 0.6912,
            positions: [
                0.05,
                0.5,
                0.95
            ],
            requiredExactRecall: "3_OF_3",
            interpretation: "CONTEXT_CAPABILITY_ONLY_NOT_GENERAL_LEGAL_QUALITY"
        },
        originalContext,
        originalBackendMode,
        benchmarkBackendMode,
        profiles: results,
        fatalError: fatal,
        generatedAt: new Date().toISOString()
    };
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const temporary = `${outputPath}.tmp`;
    fs.writeFileSync(temporary, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    fs.renameSync(temporary, outputPath);
    console.log(JSON.stringify({
        outputPath,
        modelId,
        result: !fatal &&
            results.length ===
                profiles.length &&
            results.every((item) => item.result ===
                "PASS")
            ? "PASS"
            : "FAIL",
        profiles: results.map((item) => ({
            contextTokens: item.contextTokens,
            result: item.result,
            backend: item.backend
        }))
    }, null, 2));
    if (fatal ||
        results.some((item) => item.result !==
            "PASS")) {
        process.exitCode = 1;
    }
}
void main().catch((error) => {
    console.error(error instanceof Error
        ? error.stack
        : String(error));
    process.exitCode = 1;
});

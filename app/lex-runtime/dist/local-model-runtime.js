import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { compareVersions } from "./update-discovery.js";
const PROGRESS_PREFIX = "LEX_LOCAL_AI_PROGRESS:";
export function parseLocalAiProgressLine(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(PROGRESS_PREFIX)) {
        return null;
    }
    let value;
    try {
        value = JSON.parse(trimmed.slice(PROGRESS_PREFIX.length));
    }
    catch {
        return null;
    }
    if (!value ||
        typeof value !== "object" ||
        Array.isArray(value)) {
        return null;
    }
    const record = value;
    const phase = record.phase;
    const label = record.label;
    const bytesDownloaded = record.bytesDownloaded;
    const bytesTotal = record.bytesTotal;
    const percent = record.percent;
    if (![
        "DOWNLOAD",
        "CACHE_HIT",
        "VERIFIED"
    ].includes(String(phase)) ||
        typeof label !== "string" ||
        label.length < 1 ||
        label.length > 200 ||
        typeof bytesDownloaded !==
            "number" ||
        !Number.isSafeInteger(bytesDownloaded) ||
        bytesDownloaded < 0 ||
        !(bytesTotal === null ||
            (typeof bytesTotal ===
                "number" &&
                Number.isSafeInteger(bytesTotal) &&
                bytesTotal >= 0)) ||
        !(percent === null ||
            (typeof percent ===
                "number" &&
                Number.isInteger(percent) &&
                percent >= 0 &&
                percent <= 100))) {
        return null;
    }
    if (bytesTotal !== null &&
        bytesDownloaded >
            bytesTotal) {
        return null;
    }
    return {
        phase: phase,
        label,
        bytesDownloaded,
        bytesTotal,
        percent,
        updatedAt: new Date().toISOString()
    };
}
const LEGACY_MODEL_ALIASES = {
    "local/bielik-11b-v3-q4km-64k-yarn": "local/bielik-11b-v3-q4km"
};
const FALLBACK_MODELS = [
    {
        id: "local/mistral-nemo-12b-q4km",
        displayName: "Mistral NeMo 12B Instruct Q4_K_M",
        sourceModel: "mistralai/Mistral-Nemo-Instruct-2407",
        filename: "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf",
        sha256: "",
        quantization: "Q4_K_M",
        nativeContext: 131_072,
        minimumContext: 32_000,
        maximumRuntimeContext: 200_000,
        license: "Apache-2.0"
    },
    {
        id: "local/bielik-11b-v3-q4km",
        displayName: "Bielik 11B v3 Instruct Q4_K_M",
        sourceModel: "speakleash/Bielik-11B-v3.0-Instruct",
        filename: "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
        sha256: "",
        quantization: "Q4_K_M",
        nativeContext: 32_768,
        minimumContext: 32_000,
        maximumRuntimeContext: 200_000,
        license: "Apache-2.0"
    }
];
function localAppDataRoot() {
    const configured = process.env.LEX_LOCAL_LLM_ROOT?.trim();
    if (configured)
        return path.resolve(configured);
    const local = process.env.LOCALAPPDATA?.trim();
    if (local)
        return path.resolve(local, "LexMachina", "local-ai");
    return path.resolve(os.homedir(), ".lex-machina", "local-ai");
}
function packagedRuntimeRoot() {
    const configured = process.env.LEX_RUNTIME_ROOT?.trim();
    if (configured)
        return path.resolve(configured);
    return path.resolve(process.cwd(), "..");
}
function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    }
    catch {
        return null;
    }
}
function finiteInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function isBackendId(value) {
    return (value ===
        "CPU_X64_PORTABLE" ||
        value === "VULKAN_X64");
}
function isBackendPreference(value) {
    return (value === "AUTO" ||
        isBackendId(value));
}
function configBackend(config) {
    if (!config)
        return null;
    return isBackendId(config.engine.backend)
        ? config.engine.backend
        : "CPU_X64_PORTABLE";
}
function configSelectionMode(config) {
    if (!config)
        return null;
    return isBackendPreference(config.engine.selectionMode)
        ? config.engine.selectionMode
        : configBackend(config);
}
function usableAcceleratorName(name) {
    return ![
        "microsoft basic display",
        "remote display",
        "indirect display",
        "virtual display"
    ].some((needle) => name
        .toLocaleLowerCase("en")
        .includes(needle));
}
function normalizeModelId(id) {
    return LEGACY_MODEL_ALIASES[id] ?? id;
}
const NATIVE_AGENT_ENV_KEYS = [
    "LLAMA_ARG_AGENT",
    "LLAMA_ARG_MCP_SERVERS_CONFIG",
    "LLAMA_ARG_UI_CONFIG_FILE"
];
export function lexNativeLocalAgentEnabled(env = process.env) {
    return /^(?:1|true|yes)$/i.test(env.LEX_LOCAL_LLAMA_NATIVE_AGENT?.trim() ?? "");
}
/**
 * The llama-server owned by Lex Machina is driven by Lex's own prompt and
 * LEX_TOOL_CALLS_JSON protocol. The native agent mode (server-side MCP tool
 * loops) and the web-grounded chat templates belong to the standalone
 * start-llama-native-agent.ps1 launcher: applied to Lex requests they prepend
 * a tool-forcing policy, run server-side tool loops and reject non-alternating
 * roles, so Lex never receives a response (LOCAL_MODEL_RESPONSE_TIMEOUT).
 *
 * configure-llama-native-web.ps1 also persists LLAMA_ARG_* as user-level
 * environment variables, so they are stripped here unless explicitly enabled
 * with LEX_LOCAL_LLAMA_NATIVE_AGENT=1 (and all assets exist).
 */
export function buildOptionalLocalLaunchSpec(rootDir, modelId, baseArgs, baseEnv = process.env) {
    const canonical = normalizeModelId(modelId);
    const args = [...baseArgs];
    const env = { ...baseEnv };
    for (const key of NATIVE_AGENT_ENV_KEYS) {
        delete env[key];
    }
    if (!lexNativeLocalAgentEnabled(baseEnv)) {
        return { args, env };
    }
    const mcpConfigPath = path.join(rootDir, "mcp-servers.json");
    const uiConfigPath = path.join(rootDir, "llama-ui-config.json");
    if (fs.existsSync(mcpConfigPath) &&
        fs.existsSync(uiConfigPath)) {
        env.LLAMA_ARG_AGENT = "true";
        env.LLAMA_ARG_CORS_ORIGINS =
            "localhost";
        env.LLAMA_ARG_MCP_SERVERS_CONFIG =
            mcpConfigPath;
        env.LLAMA_ARG_UI_CONFIG_FILE =
            uiConfigPath;
    }
    const groundedTemplatePath = canonical ===
        "local/mistral-nemo-12b-q4km"
        ? path.join(rootDir, "mistral-nemo-web-grounded.jinja")
        : canonical ===
            "local/bielik-11b-v3-q4km"
            ? path.join(rootDir, "bielik-web-grounded.jinja")
            : null;
    if (groundedTemplatePath &&
        fs.existsSync(groundedTemplatePath)) {
        args.push("--chat-template-file", groundedTemplatePath, "--temp", "0.3");
    }
    return { args, env };
}
export function localModelListContainsAlias(payload, expectedModelId) {
    if (!payload ||
        typeof payload !==
            "object" ||
        Array.isArray(payload)) {
        return false;
    }
    const data = payload.data;
    if (!Array.isArray(data)) {
        return false;
    }
    const expected = normalizeModelId(expectedModelId);
    return data.some((item) => Boolean(item &&
        typeof item ===
            "object" &&
        !Array.isArray(item) &&
        typeof item.id ===
            "string" &&
        normalizeModelId(String(item.id)) === expected));
}
export class LocalModelRuntime {
    rootDir;
    runtimeRoot;
    host = "127.0.0.1";
    port;
    child = null;
    activeModelId = null;
    startup = null;
    provisioning = null;
    provisioningProgress = null;
    hardwareCache = null;
    constructor(options) {
        this.rootDir = path.resolve(options?.rootDir ?? localAppDataRoot());
        this.runtimeRoot = path.resolve(options?.runtimeRoot ?? packagedRuntimeRoot());
        this.port = options?.port ?? Number(process.env.LEX_LOCAL_LLM_PORT ?? 4318);
        if (!Number.isInteger(this.port) || this.port < 1024 || this.port > 65535) {
            throw new Error("LOCAL_MODEL_PORT_INVALID");
        }
        this.recoverInterruptedProvision();
        this.recoverInterruptedInactiveModelUpdate();
    }
    listModels() {
        const configured = this.readConfig();
        return this.models().map((model) => this.publicDescriptor(model, configured));
    }
    configuredModelId() {
        const config = this.readConfig();
        return config
            ? normalizeModelId(config.model.id)
            : null;
    }
    qualificationForModel(modelId) {
        const canonical = normalizeModelId(modelId);
        const active = this.readConfig();
        if (active &&
            normalizeModelId(active.model.id) === canonical) {
            const current = this.readQualification();
            if (current &&
                normalizeModelId(current.modelId) === canonical) {
                return current;
            }
        }
        return this.readProfileQualification(canonical);
    }
    requiresModelPackRepair() {
        const config = this.readConfig();
        if (!config)
            return false;
        const canonical = normalizeModelId(config.model.id);
        const trusted = this.modelSpec(canonical);
        if (!trusted ||
            !trusted.sha256 ||
            !/^[a-f0-9]{64}$/i.test(trusted.sha256)) {
            return false;
        }
        return (config.model.sha256
            .toLowerCase() !==
            trusted.sha256
                .toLowerCase());
    }
    installedModelUpdateIdentity(requestedModelId) {
        const config = this.readConfig();
        const modelId = requestedModelId
            ? normalizeModelId(requestedModelId)
            : config
                ? normalizeModelId(config.model.id)
                : null;
        if (!modelId) {
            return null;
        }
        const spec = this.modelSpec(modelId);
        if (!spec) {
            return null;
        }
        const modelPath = path.join(this.rootDir, "models", spec.filename);
        if (!fs.existsSync(modelPath)) {
            return null;
        }
        const active = Boolean(config &&
            normalizeModelId(config.model.id) === modelId);
        const receipt = this.readModelPackReceipt(modelId);
        let sha256 = null;
        let contextTokens = Math.max(spec.minimumContext ??
            this.contextPolicy()
                .minimum, this.contextPolicy()
            .default);
        if (active && config) {
            if (!/^[a-f0-9]{64}$/i.test(config.model.sha256)) {
                throw new Error("LOCAL_MODEL_CONFIG_HASH_INVALID");
            }
            sha256 =
                config.model.sha256
                    .toLowerCase();
            contextTokens =
                config.context
                    .requestedTokens;
            if (receipt &&
                receipt.modelSha256
                    .toLowerCase() !==
                    sha256) {
                throw new Error("MODEL_PACK_RECEIPT_STATE_MISMATCH");
            }
        }
        else if (receipt) {
            sha256 =
                receipt.modelSha256
                    .toLowerCase();
        }
        else if (spec.sha256 &&
            /^[a-f0-9]{64}$/i.test(spec.sha256)) {
            // Legacy/on-demand installs are pinned by the application release
            // manifest even before they receive an independent model-pack receipt.
            sha256 =
                spec.sha256
                    .toLowerCase();
        }
        if (!sha256) {
            return null;
        }
        return {
            modelId,
            sha256,
            contextTokens,
            active,
            ...(receipt
                ? {
                    packVersion: receipt.packVersion,
                    signerKeyId: receipt.signerKeyId
                }
                : {})
        };
    }
    hardwareProfile() {
        const now = Date.now();
        if (this.hardwareCache &&
            this.hardwareCache.expiresAt >
                now) {
            return {
                ...this.hardwareCache.value,
                accelerators: this.hardwareCache.value
                    .accelerators.map((item) => ({
                    ...item
                }))
            };
        }
        const cpus = os.cpus();
        const accelerators = [];
        if (process.platform ===
            "win32") {
            const powershell = process.env.SystemRoot
                ? path.join(process.env.SystemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe")
                : "powershell.exe";
            const command = [
                "$ErrorActionPreference='SilentlyContinue'",
                "$items=@(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion)",
                "$items | ConvertTo-Json -Compress"
            ].join("; ");
            const result = spawnSync(powershell, [
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                command
            ], {
                encoding: "utf8",
                windowsHide: true,
                timeout: 5_000
            });
            if (result.status === 0 &&
                result.stdout.trim()) {
                try {
                    const parsed = JSON.parse(result.stdout.trim());
                    const items = Array.isArray(parsed)
                        ? parsed
                        : [parsed];
                    for (const value of items.slice(0, 8)) {
                        if (!value ||
                            typeof value !==
                                "object" ||
                            Array.isArray(value)) {
                            continue;
                        }
                        const record = value;
                        if (typeof record.Name !==
                            "string" ||
                            !record.Name.trim()) {
                            continue;
                        }
                        accelerators.push({
                            name: record.Name
                                .trim()
                                .slice(0, 200),
                            ...(typeof record.DriverVersion ===
                                "string" &&
                                record.DriverVersion.trim()
                                ? {
                                    driverVersion: record.DriverVersion
                                        .trim()
                                        .slice(0, 100)
                                }
                                : {})
                        });
                    }
                }
                catch {
                    // Accelerator discovery is informational only.
                }
            }
        }
        const config = this.readConfig();
        const qualification = this.readQualification();
        const configuredBackend = configBackend(config);
        const selectionMode = configSelectionMode(config);
        const gpuCandidateDetected = accelerators.some((item) => usableAcceleratorName(item.name));
        const gpuOffloadEnabled = Boolean(config &&
            configuredBackend ===
                "VULKAN_X64" &&
            config.engine.gpuOffload ===
                true &&
            qualification &&
            normalizeModelId(qualification.modelId) ===
                normalizeModelId(config.model.id) &&
            qualification
                .contextTokens ===
                config.context
                    .requestedTokens &&
            (qualification.backend ??
                configuredBackend) ===
                configuredBackend);
        const value = {
            platform: process.platform,
            arch: process.arch,
            totalMemoryBytes: os.totalmem(),
            logicalCpuCount: cpus.length,
            cpuModel: cpus[0]?.model?.trim() ||
                null,
            accelerators,
            packagedBackend: this.manifest()
                .runtime
                ?.llamaCpp
                ?.backend ??
                "UNKNOWN",
            configuredBackend,
            backendSelectionMode: selectionMode,
            gpuCandidateDetected,
            gpuOffloadEnabled,
            detectedAt: new Date().toISOString()
        };
        this.hardwareCache = {
            value,
            expiresAt: now + 60_000
        };
        return {
            ...value,
            accelerators: value.accelerators.map((item) => ({
                ...item
            }))
        };
    }
    backendSelectionPolicy() {
        const raw = this.manifest()
            .localAi
            ?.backendSelection;
        const allowed = Array.isArray(raw?.allowed)
            ? raw.allowed
                .filter(isBackendPreference)
            : [
                "AUTO",
                "VULKAN_X64",
                "CPU_X64_PORTABLE"
            ];
        const unique = [
            ...new Set(allowed)
        ];
        const defaultBackend = isBackendPreference(raw?.default) &&
            unique.includes(raw.default)
            ? raw.default
            : "AUTO";
        return {
            allowed: unique.length > 0
                ? unique
                : [
                    "AUTO",
                    "CPU_X64_PORTABLE"
                ],
            default: defaultBackend
        };
    }
    resolveBackend(preference) {
        const policy = this.backendSelectionPolicy();
        if (!policy.allowed.includes(preference)) {
            throw new Error("LOCAL_MODEL_BACKEND_NOT_ALLOWED:" +
                preference);
        }
        if (preference !== "AUTO") {
            return preference;
        }
        return this
            .hardwareProfile()
            .gpuCandidateDetected &&
            policy.allowed.includes("VULKAN_X64")
            ? "VULKAN_X64"
            : "CPU_X64_PORTABLE";
    }
    contextPolicy() {
        const policy = this.manifest().localAi?.contextSelection;
        const minimum = finiteInteger(policy?.minimum) ? policy.minimum : 32_000;
        const maximum = finiteInteger(policy?.maximum) ? policy.maximum : 200_000;
        const step = finiteInteger(policy?.step) ? policy.step : 1_000;
        const recommendedProfiles = Array.isArray(policy?.recommendedProfiles)
            ? policy.recommendedProfiles.filter(finiteInteger)
            : [32_000, 64_000, 96_000, 128_000, 160_000, 200_000];
        const fallbackDefault = minimum;
        const defaultContext = finiteInteger(policy?.default)
            ? Math.min(maximum, Math.max(minimum, policy.default))
            : fallbackDefault;
        return {
            minimum,
            maximum,
            step,
            recommendedProfiles,
            default: defaultContext
        };
    }
    status() {
        const config = this.readConfig();
        const enginePresent = Boolean(config && fs.existsSync(config.engine.executable));
        const modelsPresent = Object.fromEntries(this.models().map((model) => [
            model.id,
            fs.existsSync(path.join(this.rootDir, "models", model.filename))
        ]));
        const selectedModelId = config ? normalizeModelId(config.model.id) : null;
        const selectedPresent = selectedModelId
            ? Boolean(modelsPresent[selectedModelId])
            : false;
        const configured = Boolean(config && enginePresent && selectedPresent);
        return {
            configured,
            provisioning: Boolean(this.provisioning),
            configPath: this.configPath(),
            enginePresent,
            modelsPresent,
            selectedModelId,
            configuredContextTokens: config?.context.requestedTokens ?? null,
            activeModelId: this.activeModelId,
            state: this.provisioning
                ? "PROVISIONING"
                : this.startup
                    ? "STARTING"
                    : this.child && this.activeModelId
                        ? "READY"
                        : "STOPPED",
            endpoint: `http://${this.host}:${this.port}/v1`,
            contextPolicy: this.contextPolicy(),
            backendPolicy: this.backendSelectionPolicy(),
            qualification: this.readQualification(),
            progress: this.provisioningProgress
                ? { ...this.provisioningProgress }
                : null,
            hardware: this.hardwareProfile()
        };
    }
    async provision(modelId, contextTokens, sourceOverride, backendPreference = "AUTO") {
        if (process.platform !== "win32") {
            throw new Error("LOCAL_MODEL_PROVISIONING_PLATFORM_UNSUPPORTED");
        }
        if (this.provisioning) {
            throw new Error("LOCAL_MODEL_PROVISIONING_IN_PROGRESS");
        }
        const canonical = normalizeModelId(modelId);
        const model = sourceOverride?.model ??
            this.modelSpec(canonical);
        if (!model ||
            normalizeModelId(model.id) !==
                canonical) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        this.validateContext(model, contextTokens);
        if (!isBackendPreference(backendPreference)) {
            throw new Error("LOCAL_MODEL_BACKEND_INVALID");
        }
        const selectedBackend = this.resolveBackend(backendPreference);
        await this.stop();
        this.recoverInterruptedProvision();
        fs.mkdirSync(this.rootDir, { recursive: true });
        const configPath = this.configPath();
        const previousConfigObject = this.readConfig();
        const previousQualificationObject = this.readQualification();
        if (previousConfigObject &&
            normalizeModelId(previousConfigObject
                .model.id) !== canonical &&
            previousQualificationObject &&
            normalizeModelId(previousQualificationObject
                .modelId) ===
                normalizeModelId(previousConfigObject
                    .model.id) &&
            previousQualificationObject
                .contextTokens ===
                previousConfigObject
                    .context
                    .requestedTokens) {
            this.writeModelProfile(previousConfigObject, previousQualificationObject);
        }
        const previousConfig = fs.existsSync(configPath)
            ? fs.readFileSync(configPath)
            : null;
        const qualificationPath = this.qualificationPath();
        const previousQualification = fs.existsSync(qualificationPath)
            ? fs.readFileSync(qualificationPath)
            : null;
        const modelPackReceiptPath = this.modelPackReceiptPathForFilename(model.filename);
        const previousModelPackReceipt = fs.existsSync(modelPackReceiptPath)
            ? fs.readFileSync(modelPackReceiptPath)
            : null;
        const targetModelPath = path.join(this.rootDir, "models", model.filename);
        const rollbackModelPath = `${targetModelPath}.lex-rollback`;
        const previousTargetExisted = fs.existsSync(targetModelPath);
        const previousTargetWasActive = Boolean(previousConfigObject &&
            path.resolve(previousConfigObject
                .model.path) ===
                path.resolve(targetModelPath) &&
            fs.existsSync(targetModelPath));
        this.writeProvisionTransaction({
            schemaVersion: 1,
            modelFilename: model.filename,
            hadPreviousModel: previousTargetExisted,
            hadPreviousConfig: previousConfig !== null,
            hadPreviousQualification: previousQualification !==
                null,
            hadPreviousModelPackReceipt: previousModelPackReceipt !==
                null,
            startedAt: new Date().toISOString()
        }, previousConfig, previousQualification, previousModelPackReceipt);
        if (previousTargetWasActive) {
            fs.rmSync(rollbackModelPath, { force: true });
            fs.renameSync(targetModelPath, rollbackModelPath);
        }
        const restoreModelFile = () => {
            if (previousTargetWasActive &&
                fs.existsSync(rollbackModelPath)) {
                fs.rmSync(targetModelPath, { force: true });
                fs.renameSync(rollbackModelPath, targetModelPath);
            }
        };
        const commitModelFile = () => {
            fs.rmSync(rollbackModelPath, { force: true });
        };
        const restorePreviousConfig = () => {
            if (previousConfig) {
                fs.writeFileSync(configPath, previousConfig);
            }
            else {
                fs.rmSync(configPath, { force: true });
            }
            this.hardwareCache = null;
        };
        this.provisioningProgress = {
            phase: "STARTING",
            label: canonical,
            bytesDownloaded: 0,
            bytesTotal: null,
            percent: null,
            updatedAt: new Date().toISOString()
        };
        const task = this.runProvisioner(canonical, contextTokens, sourceOverride?.manifestPath, selectedBackend, backendPreference);
        this.provisioning = task;
        try {
            await task;
            this.hardwareCache = null;
            let config = this.readConfig();
            if (!config || normalizeModelId(config.model.id) !== canonical) {
                throw new Error("LOCAL_MODEL_PROVISIONING_CONFIG_MISSING");
            }
            this.assertConfiguredComponents(config);
            this.provisioningProgress = {
                phase: "VALIDATING_RUNTIME",
                label: canonical,
                bytesDownloaded: this.provisioningProgress
                    ?.bytesDownloaded ?? 0,
                bytesTotal: this.provisioningProgress
                    ?.bytesTotal ?? null,
                percent: 100,
                updatedAt: new Date().toISOString()
            };
            try {
                const startupStartedAt = Date.now();
                config =
                    await this
                        .ensureRunningWithAutoFallback(canonical, config);
                const tokenizerCalibration = await this
                    .calibrateTokenizer();
                const qualification = {
                    schemaVersion: 1,
                    result: "PASS",
                    modelId: canonical,
                    contextTokens: config.context.requestedTokens,
                    contextMode: config.context.mode,
                    engine: "llama.cpp",
                    backend: configBackend(config) ??
                        "CPU_X64_PORTABLE",
                    startupMs: Math.max(0, Date.now() -
                        startupStartedAt),
                    tokenizerCalibration,
                    validatedAt: new Date().toISOString()
                };
                this.writeQualification(qualification);
                this.provisioningProgress = {
                    phase: "READY",
                    label: canonical,
                    bytesDownloaded: this.provisioningProgress
                        ?.bytesDownloaded ?? 0,
                    bytesTotal: this.provisioningProgress
                        ?.bytesTotal ?? null,
                    percent: 100,
                    updatedAt: new Date().toISOString()
                };
            }
            catch (error) {
                restorePreviousConfig();
                const detail = error instanceof Error
                    ? error.message
                    : String(error);
                throw new Error(`LOCAL_MODEL_RESOURCE_VALIDATION_FAILED:${detail}`);
            }
            finally {
                await this.stop();
            }
            if (sourceOverride?.beforeCommit) {
                await sourceOverride
                    .beforeCommit();
            }
            this.writeModelProfile(config, this.readQualification());
            commitModelFile();
            this.clearProvisionTransaction(model.filename);
            return {
                model: this.publicDescriptor(model, config),
                contextTokens: config.context.requestedTokens,
                configPath
            };
        }
        catch (error) {
            restoreModelFile();
            restorePreviousConfig();
            if (previousQualification) {
                fs.writeFileSync(qualificationPath, previousQualification);
            }
            else {
                fs.rmSync(qualificationPath, { force: true });
            }
            if (previousModelPackReceipt) {
                fs.writeFileSync(modelPackReceiptPath, previousModelPackReceipt);
            }
            else {
                fs.rmSync(modelPackReceiptPath, { force: true });
            }
            this.clearProvisionTransaction(model.filename);
            this.provisioningProgress = {
                phase: "FAILED",
                label: canonical,
                bytesDownloaded: this.provisioningProgress
                    ?.bytesDownloaded ?? 0,
                bytesTotal: this.provisioningProgress
                    ?.bytesTotal ?? null,
                percent: this.provisioningProgress
                    ?.percent ?? null,
                updatedAt: new Date().toISOString()
            };
            throw error;
        }
        finally {
            this.provisioning = null;
        }
    }
    async reconfigureContext(modelId, contextTokens) {
        if (this.provisioning) {
            throw new Error("LOCAL_MODEL_PROVISIONING_IN_PROGRESS");
        }
        const config = this.readConfig();
        if (!config) {
            throw new Error("LOCAL_MODEL_NOT_CONFIGURED");
        }
        const canonical = normalizeModelId(modelId);
        if (normalizeModelId(config.model.id) !== canonical) {
            throw new Error("LOCAL_MODEL_RECONFIGURE_MODEL_MISMATCH");
        }
        const model = this.modelSpec(canonical);
        if (!model) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        this.validateContext(model, contextTokens);
        this.assertConfiguredComponents(config);
        await this.stop();
        const configPath = this.configPath();
        const previousConfig = fs.readFileSync(configPath);
        const updated = {
            ...config,
            configuredAt: new Date()
                .toISOString(),
            context: {
                requestedTokens: contextTokens,
                mode: contextTokens >
                    config.model
                        .nativeContext
                    ? "YARN_EXTENDED"
                    : "NATIVE_OR_REDUCED",
                extendedBeyondNative: contextTokens >
                    config.model
                        .nativeContext,
                ropeScale: Math.max(1, contextTokens /
                    config.model
                        .nativeContext)
            }
        };
        this.writeConfig(updated);
        this.provisioningProgress = {
            phase: "VALIDATING_RUNTIME",
            label: canonical,
            bytesDownloaded: 0,
            bytesTotal: 0,
            percent: 100,
            updatedAt: new Date().toISOString()
        };
        try {
            const startedAt = Date.now();
            const validatedConfig = await this
                .ensureRunningWithAutoFallback(canonical, updated);
            const tokenizerCalibration = await this
                .calibrateTokenizer();
            const qualification = {
                schemaVersion: 1,
                result: "PASS",
                modelId: canonical,
                contextTokens,
                contextMode: validatedConfig
                    .context.mode,
                engine: "llama.cpp",
                backend: configBackend(validatedConfig) ??
                    "CPU_X64_PORTABLE",
                startupMs: Math.max(0, Date.now() -
                    startedAt),
                tokenizerCalibration,
                validatedAt: new Date()
                    .toISOString()
            };
            this.writeQualification(qualification);
            this.writeModelProfile(validatedConfig, qualification);
            this.provisioningProgress = {
                phase: "READY",
                label: canonical,
                bytesDownloaded: 0,
                bytesTotal: 0,
                percent: 100,
                updatedAt: new Date().toISOString()
            };
            return {
                model: this.publicDescriptor(model, this.readConfig() ??
                    updated),
                contextTokens,
                configPath
            };
        }
        catch (error) {
            fs.writeFileSync(configPath, previousConfig);
            this.hardwareCache = null;
            this.provisioningProgress = {
                phase: "FAILED",
                label: canonical,
                bytesDownloaded: 0,
                bytesTotal: 0,
                percent: null,
                updatedAt: new Date().toISOString()
            };
            const detail = error instanceof Error
                ? error.message
                : String(error);
            throw new Error(`LOCAL_MODEL_CONTEXT_RECONFIGURATION_FAILED:${detail}`);
        }
        finally {
            await this.stop();
        }
    }
    async applyVerifiedModelPack(args) {
        const entry = args.target.model;
        const canonical = normalizeModelId(entry.id);
        const installed = this.installedModelUpdateIdentity(canonical);
        if (!installed ||
            installed.modelId !==
                canonical) {
            throw new Error("MODEL_PACK_UPDATE_MODEL_NOT_INSTALLED");
        }
        if (installed.packVersion) {
            const versionComparison = compareVersions(args.target.packVersion, installed.packVersion);
            if (versionComparison < 0) {
                throw new Error("MODEL_PACK_UPDATE_ROLLBACK_BLOCKED");
            }
            if (versionComparison === 0 &&
                installed.sha256 !==
                    entry.sha256
                        .toLowerCase()) {
                throw new Error("MODEL_PACK_UPDATE_VERSION_HASH_CONFLICT");
            }
        }
        if (!args.force &&
            installed.sha256 ===
                entry.sha256
                    .toLowerCase()) {
            throw new Error("MODEL_PACK_UPDATE_NOT_AVAILABLE");
        }
        const trustedModel = this.modelSpec(canonical);
        if (!trustedModel) {
            throw new Error("MODEL_PACK_UPDATE_MODEL_UNKNOWN");
        }
        if (trustedModel.filename !==
            entry.filename ||
            trustedModel.quantization !==
                entry.quantization ||
            trustedModel.nativeContext !==
                entry.nativeContext ||
            (trustedModel.minimumContext ??
                this.contextPolicy()
                    .minimum) !==
                entry.minimumContext ||
            (trustedModel
                .maximumRuntimeContext ??
                trustedModel
                    .nativeContext) !==
                entry.maximumRuntimeContext ||
            (trustedModel.license ??
                "") !== entry.license) {
            throw new Error("MODEL_PACK_UPDATE_METADATA_CHANGE_REQUIRES_APP_UPDATE");
        }
        this.validateContext(trustedModel, args.contextTokens);
        const rawManifest = JSON.parse(fs.readFileSync(this.manifestPath(), "utf8"));
        const rawModels = (rawManifest.models &&
            typeof rawManifest.models ===
                "object" &&
            !Array.isArray(rawManifest.models))
            ? rawManifest.models
            : null;
        const localLlm = Array.isArray(rawModels?.localLlm)
            ? rawModels.localLlm
            : [];
        const trustedRaw = localLlm.find((value) => value.id === canonical);
        if (!trustedRaw) {
            throw new Error("MODEL_PACK_UPDATE_TRUSTED_MODEL_MISSING");
        }
        const stagingRoot = path.join(this.rootDir, "staging");
        fs.mkdirSync(stagingRoot, { recursive: true });
        const nonce = `${Date.now()}-${process.pid}`;
        const manifestPath = path.join(stagingRoot, `model-pack-${nonce}.json`);
        const stagedManifest = {
            ...rawManifest,
            models: {
                ...rawModels,
                localLlm: [
                    {
                        ...trustedRaw,
                        url: entry.url,
                        sha256: entry.sha256
                            .toLowerCase()
                    }
                ]
            }
        };
        fs.writeFileSync(manifestPath, `${JSON.stringify(stagedManifest, null, 2)}\n`, {
            encoding: "utf8",
            flag: "wx"
        });
        let committedReceipt = null;
        const existingConfig = this.readConfig();
        const preserveActiveConfiguration = Boolean(existingConfig &&
            normalizeModelId(existingConfig.model.id) !== canonical);
        const backendPreference = args.backendPreference ??
            configSelectionMode(existingConfig) ??
            "AUTO";
        if (preserveActiveConfiguration) {
            this.beginInactiveModelUpdate(canonical);
        }
        try {
            const result = await this.provision(canonical, args.contextTokens, {
                model: trustedModel,
                manifestPath,
                beforeCommit: () => {
                    const config = this.readConfig();
                    if (!config ||
                        config.model.sha256
                            .toLowerCase() !==
                            entry.sha256
                                .toLowerCase()) {
                        throw new Error("MODEL_PACK_UPDATE_CONFIG_HASH_MISMATCH");
                    }
                    const receipt = {
                        schemaVersion: 1,
                        kind: "LEX_MACHINA_MODEL_PACK_INSTALL",
                        packVersion: args.target
                            .packVersion,
                        signerKeyId: args.target
                            .signerKeyId,
                        indexSha256: args.target
                            .indexSha256,
                        modelId: canonical,
                        modelSha256: entry.sha256
                            .toLowerCase(),
                        installedAt: new Date()
                            .toISOString()
                    };
                    this.writeModelPackReceipt(receipt);
                    committedReceipt =
                        receipt;
                }
            }, backendPreference);
            if (!committedReceipt) {
                throw new Error("MODEL_PACK_UPDATE_RECEIPT_MISSING");
            }
            if (preserveActiveConfiguration) {
                this.restoreInactiveModelUpdate();
            }
            return {
                ...result,
                model: this.publicDescriptor(trustedModel, this.readConfig()),
                receipt: committedReceipt
            };
        }
        catch (error) {
            if (preserveActiveConfiguration &&
                fs.existsSync(this.inactiveModelUpdateTransactionPath())) {
                this.restoreInactiveModelUpdate();
            }
            throw error;
        }
        finally {
            fs.rmSync(manifestPath, { force: true });
        }
    }
    async repair() {
        const config = this.readConfig();
        if (!config) {
            throw new Error("LOCAL_MODEL_NOT_CONFIGURED");
        }
        return await this.provision(normalizeModelId(config.model.id), config.context.requestedTokens, undefined, configSelectionMode(config) ?? "AUTO");
    }
    async remove(modelId) {
        if (this.provisioning) {
            throw new Error("LOCAL_MODEL_PROVISIONING_IN_PROGRESS");
        }
        const canonical = normalizeModelId(modelId);
        const model = this.modelSpec(canonical);
        if (!model) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        if (path.basename(model.filename) !== model.filename ||
            model.filename.includes("..")) {
            throw new Error("LOCAL_MODEL_FILENAME_INVALID");
        }
        await this.stop();
        const target = path.join(this.rootDir, "models", model.filename);
        fs.rmSync(target, { force: true });
        const config = this.readConfig();
        const configRemoved = Boolean(config &&
            normalizeModelId(config.model.id) === canonical);
        if (configRemoved) {
            fs.rmSync(this.configPath(), { force: true });
        }
        fs.rmSync(this.modelPackReceiptPathForFilename(model.filename), { force: true });
        const legacyReceipt = this.readLegacyModelPackReceipt();
        if (legacyReceipt &&
            normalizeModelId(legacyReceipt.modelId) === canonical) {
            fs.rmSync(this.legacyModelPackReceiptPath(), { force: true });
        }
        const qualification = this.readQualification();
        if (qualification?.modelId ===
            canonical) {
            fs.rmSync(this.qualificationPath(), { force: true });
        }
        fs.rmSync(this.profileConfigPath(canonical), { force: true });
        fs.rmSync(this.profileQualificationPath(canonical), { force: true });
        return {
            removedModelId: canonical,
            configRemoved
        };
    }
    async ensureRunning(id) {
        const canonical = normalizeModelId(id);
        const spec = this.modelSpec(canonical);
        if (!spec)
            throw new Error("LOCAL_MODEL_UNKNOWN");
        let config = this.readConfig();
        if (!config ||
            normalizeModelId(config.model.id) !== canonical) {
            const profile = this.readProfileConfig(canonical);
            if (!profile) {
                const targetModelPath = path.join(this.rootDir, "models", spec.filename);
                if (process.platform !== "win32" ||
                    !fs.existsSync(targetModelPath)) {
                    throw new Error(`LOCAL_MODEL_PROFILE_NOT_CONFIGURED:${canonical}`);
                }
                const policy = this.contextPolicy();
                const minimum = Math.max(policy.minimum, spec.minimumContext ??
                    policy.minimum);
                const maximum = Math.min(policy.maximum, spec.maximumRuntimeContext ??
                    spec.nativeContext);
                const recoveryContext = Math.min(maximum, Math.max(minimum, policy.default));
                const backendPreference = configSelectionMode(config) ?? "AUTO";
                await this.provision(canonical, recoveryContext, undefined, backendPreference);
                config =
                    this.readConfig();
                if (!config ||
                    normalizeModelId(config.model.id) !== canonical) {
                    throw new Error(`LOCAL_MODEL_PROFILE_RECOVERY_FAILED:${canonical}`);
                }
            }
            const recoveredProfile = this.readProfileConfig(canonical);
            const qualification = this.readProfileQualification(canonical);
            const activeProfile = recoveredProfile ??
                profile;
            if (!activeProfile ||
                !qualification ||
                qualification
                    .contextTokens !==
                    activeProfile.context
                        .requestedTokens) {
                throw new Error(`LOCAL_MODEL_PROFILE_NOT_QUALIFIED:${canonical}`);
            }
            await this.stop();
            this.writeConfig(activeProfile);
            this.writeQualification(qualification);
            config = activeProfile;
        }
        if (this.child &&
            this.activeModelId === canonical &&
            !this.startup &&
            await this.isHealthy() &&
            await this.isServingModel(canonical)) {
            return this.publicDescriptor(spec, config);
        }
        if (this.startup && this.activeModelId === canonical) {
            await this.startup;
            return this.publicDescriptor(spec, config);
        }
        await this.stop();
        this.assertConfiguredComponents(config);
        this.activeModelId = canonical;
        this.startup = this.launch(config);
        try {
            await this.startup;
            return this.publicDescriptor(spec, config);
        }
        catch (error) {
            await this.stop();
            throw error;
        }
        finally {
            this.startup = null;
        }
    }
    async stop() {
        const child = this.child;
        this.child = null;
        this.startup = null;
        this.activeModelId = null;
        if (!child || child.killed)
            return;
        child.kill();
        await new Promise((resolve) => {
            const timeout = setTimeout(resolve, 2_000);
            child.once("exit", () => {
                clearTimeout(timeout);
                resolve();
            });
        });
    }
    manifestPath() {
        return path.join(this.runtimeRoot, "release-source.json");
    }
    provisionerPath() {
        return path.join(this.runtimeRoot, "bootstrap", "install-local-llm.ps1");
    }
    configPath() {
        return path.join(this.rootDir, "config.json");
    }
    provisionTransactionPath() {
        return path.join(this.rootDir, "provision-transaction.json");
    }
    inactiveModelUpdateTransactionPath() {
        return path.join(this.rootDir, "inactive-model-update-transaction.json");
    }
    inactiveModelUpdateConfigBackupPath() {
        return `${this.configPath()}.inactive-update-backup`;
    }
    inactiveModelUpdateQualificationBackupPath() {
        return `${this.qualificationPath()}.inactive-update-backup`;
    }
    beginInactiveModelUpdate(targetModelId) {
        const marker = this.inactiveModelUpdateTransactionPath();
        const configBackup = this.inactiveModelUpdateConfigBackupPath();
        const qualificationBackup = this.inactiveModelUpdateQualificationBackupPath();
        fs.rmSync(marker, { force: true });
        fs.rmSync(configBackup, { force: true });
        fs.rmSync(qualificationBackup, { force: true });
        const hadPreviousConfig = fs.existsSync(this.configPath());
        const hadPreviousQualification = fs.existsSync(this.qualificationPath());
        if (hadPreviousConfig) {
            fs.copyFileSync(this.configPath(), configBackup);
        }
        if (hadPreviousQualification) {
            fs.copyFileSync(this.qualificationPath(), qualificationBackup);
        }
        const transaction = {
            schemaVersion: 1,
            targetModelId: normalizeModelId(targetModelId),
            hadPreviousConfig,
            hadPreviousQualification,
            startedAt: new Date().toISOString()
        };
        const temporary = `${marker}.tmp`;
        fs.writeFileSync(temporary, `${JSON.stringify(transaction, null, 2)}\n`, {
            encoding: "utf8",
            flag: "wx"
        });
        fs.renameSync(temporary, marker);
    }
    restoreInactiveModelUpdate() {
        const marker = this.inactiveModelUpdateTransactionPath();
        if (!fs.existsSync(marker)) {
            return;
        }
        let transaction;
        try {
            transaction =
                JSON.parse(fs.readFileSync(marker, "utf8"));
        }
        catch {
            throw new Error("INACTIVE_MODEL_UPDATE_MARKER_INVALID");
        }
        if (transaction.schemaVersion !== 1 ||
            typeof transaction.targetModelId !==
                "string" ||
            !transaction.targetModelId.startsWith("local/") ||
            typeof transaction.hadPreviousConfig !==
                "boolean" ||
            typeof transaction.hadPreviousQualification !==
                "boolean" ||
            typeof transaction.startedAt !==
                "string" ||
            Number.isNaN(Date.parse(transaction.startedAt))) {
            throw new Error("INACTIVE_MODEL_UPDATE_MARKER_INVALID");
        }
        const configBackup = this.inactiveModelUpdateConfigBackupPath();
        const qualificationBackup = this.inactiveModelUpdateQualificationBackupPath();
        if (transaction.hadPreviousConfig) {
            if (!fs.existsSync(configBackup)) {
                throw new Error("INACTIVE_MODEL_UPDATE_CONFIG_BACKUP_MISSING");
            }
            fs.copyFileSync(configBackup, this.configPath());
        }
        else {
            fs.rmSync(this.configPath(), { force: true });
        }
        if (transaction.hadPreviousQualification) {
            if (!fs.existsSync(qualificationBackup)) {
                throw new Error("INACTIVE_MODEL_UPDATE_QUALIFICATION_BACKUP_MISSING");
            }
            fs.copyFileSync(qualificationBackup, this.qualificationPath());
        }
        else {
            fs.rmSync(this.qualificationPath(), { force: true });
        }
        fs.rmSync(configBackup, { force: true });
        fs.rmSync(qualificationBackup, { force: true });
        fs.rmSync(marker, { force: true });
        this.hardwareCache = null;
    }
    recoverInterruptedInactiveModelUpdate() {
        const marker = this.inactiveModelUpdateTransactionPath();
        if (!fs.existsSync(marker)) {
            return;
        }
        try {
            this.restoreInactiveModelUpdate();
        }
        catch (error) {
            const detail = error instanceof Error
                ? error.message
                : String(error);
            throw new Error(`INACTIVE_MODEL_UPDATE_RECOVERY_FAILED:${detail}`);
        }
    }
    configRollbackPath() {
        return `${this.configPath()}.lex-rollback`;
    }
    qualificationRollbackPath() {
        return `${this.qualificationPath()}.lex-rollback`;
    }
    modelPackReceiptRollbackPath(modelFilename) {
        return `${this.modelPackReceiptPathForFilename(modelFilename)}.lex-rollback`;
    }
    writeProvisionTransaction(transaction, previousConfig, previousQualification, previousModelPackReceipt) {
        fs.mkdirSync(this.rootDir, { recursive: true });
        const configBackup = this.configRollbackPath();
        const qualificationBackup = this.qualificationRollbackPath();
        const modelPackReceiptBackup = this.modelPackReceiptRollbackPath(transaction.modelFilename);
        const marker = this.provisionTransactionPath();
        fs.rmSync(configBackup, { force: true });
        fs.rmSync(qualificationBackup, { force: true });
        fs.rmSync(modelPackReceiptBackup, { force: true });
        fs.rmSync(marker, { force: true });
        if (previousConfig) {
            fs.writeFileSync(configBackup, previousConfig, { flag: "wx" });
        }
        if (previousQualification) {
            fs.writeFileSync(qualificationBackup, previousQualification, { flag: "wx" });
        }
        if (previousModelPackReceipt) {
            fs.writeFileSync(modelPackReceiptBackup, previousModelPackReceipt, { flag: "wx" });
        }
        const temporary = `${marker}.tmp`;
        fs.writeFileSync(temporary, `${JSON.stringify(transaction, null, 2)}\n`, {
            encoding: "utf8",
            flag: "wx"
        });
        fs.renameSync(temporary, marker);
    }
    clearProvisionTransaction(modelFilename) {
        fs.rmSync(this.configRollbackPath(), { force: true });
        fs.rmSync(this.qualificationRollbackPath(), { force: true });
        fs.rmSync(this.modelPackReceiptRollbackPath(modelFilename), { force: true });
        fs.rmSync(this.provisionTransactionPath(), { force: true });
    }
    recoverInterruptedProvision() {
        const marker = this.provisionTransactionPath();
        if (!fs.existsSync(marker)) {
            return;
        }
        let transaction;
        try {
            transaction =
                JSON.parse(fs.readFileSync(marker, "utf8"));
        }
        catch {
            throw new Error("LOCAL_MODEL_RECOVERY_MARKER_INVALID");
        }
        if (transaction.schemaVersion !== 1 ||
            typeof transaction.modelFilename !==
                "string" ||
            transaction.modelFilename !==
                path.basename(transaction.modelFilename) ||
            !/^[A-Za-z0-9._-]+\.gguf$/i.test(transaction.modelFilename) ||
            typeof transaction.hadPreviousModel !==
                "boolean" ||
            typeof transaction.hadPreviousConfig !==
                "boolean" ||
            typeof transaction.hadPreviousQualification !==
                "boolean" ||
            typeof transaction.hadPreviousModelPackReceipt !==
                "boolean") {
            throw new Error("LOCAL_MODEL_RECOVERY_MARKER_INVALID");
        }
        const target = path.join(this.rootDir, "models", transaction.modelFilename);
        const rollback = `${target}.lex-rollback`;
        const configBackup = this.configRollbackPath();
        const qualificationBackup = this.qualificationRollbackPath();
        const modelPackReceiptBackup = this.modelPackReceiptRollbackPath(transaction.modelFilename);
        try {
            if (transaction.hadPreviousModel) {
                if (fs.existsSync(rollback)) {
                    fs.rmSync(target, { force: true });
                    fs.renameSync(rollback, target);
                }
                else if (!fs.existsSync(target)) {
                    throw new Error("LOCAL_MODEL_RECOVERY_MODEL_BACKUP_MISSING");
                }
            }
            else {
                fs.rmSync(target, { force: true });
                fs.rmSync(rollback, { force: true });
            }
            if (transaction.hadPreviousConfig) {
                if (!fs.existsSync(configBackup)) {
                    throw new Error("LOCAL_MODEL_RECOVERY_CONFIG_BACKUP_MISSING");
                }
                fs.copyFileSync(configBackup, this.configPath());
            }
            else {
                fs.rmSync(this.configPath(), { force: true });
            }
            if (transaction.hadPreviousQualification) {
                if (!fs.existsSync(qualificationBackup)) {
                    throw new Error("LOCAL_MODEL_RECOVERY_QUALIFICATION_BACKUP_MISSING");
                }
                fs.copyFileSync(qualificationBackup, this.qualificationPath());
            }
            else {
                fs.rmSync(this.qualificationPath(), { force: true });
            }
            if (transaction.hadPreviousModelPackReceipt) {
                if (!fs.existsSync(modelPackReceiptBackup)) {
                    throw new Error("LOCAL_MODEL_RECOVERY_MODEL_PACK_RECEIPT_BACKUP_MISSING");
                }
                fs.copyFileSync(modelPackReceiptBackup, this.modelPackReceiptPathForFilename(transaction.modelFilename));
            }
            else {
                fs.rmSync(this.modelPackReceiptPathForFilename(transaction.modelFilename), { force: true });
            }
            this.clearProvisionTransaction(transaction.modelFilename);
        }
        catch (error) {
            const detail = error instanceof Error
                ? error.message
                : String(error);
            throw new Error(`LOCAL_MODEL_RECOVERY_FAILED:${detail}`);
        }
    }
    legacyModelPackReceiptPath() {
        return path.join(this.rootDir, "model-pack-install.json");
    }
    modelPackReceiptPathForFilename(modelFilename) {
        if (modelFilename !==
            path.basename(modelFilename) ||
            !/^[A-Za-z0-9._-]+\.gguf$/i.test(modelFilename)) {
            throw new Error("MODEL_PACK_RECEIPT_FILENAME_INVALID");
        }
        return path.join(this.rootDir, "models", `${modelFilename}.model-pack.json`);
    }
    modelPackReceiptPathForModel(modelId) {
        const model = this.modelSpec(normalizeModelId(modelId));
        if (!model) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        return this
            .modelPackReceiptPathForFilename(model.filename);
    }
    parseModelPackReceipt(target) {
        if (!fs.existsSync(target)) {
            return null;
        }
        const receipt = readJson(target);
        if (!receipt ||
            receipt.schemaVersion !== 1 ||
            receipt.kind !==
                "LEX_MACHINA_MODEL_PACK_INSTALL" ||
            typeof receipt.packVersion !==
                "string" ||
            !/^\d+\.\d+\.\d+$/.test(receipt.packVersion) ||
            typeof receipt.signerKeyId !==
                "string" ||
            !/^[A-Za-z0-9._-]{3,96}$/.test(receipt.signerKeyId) ||
            typeof receipt.indexSha256 !==
                "string" ||
            !/^[a-f0-9]{64}$/i.test(receipt.indexSha256) ||
            typeof receipt.modelId !==
                "string" ||
            receipt.modelId.length < 3 ||
            receipt.modelId.length > 160 ||
            typeof receipt.modelSha256 !==
                "string" ||
            !/^[a-f0-9]{64}$/i.test(receipt.modelSha256) ||
            typeof receipt.installedAt !==
                "string" ||
            Number.isNaN(Date.parse(receipt.installedAt))) {
            throw new Error("MODEL_PACK_RECEIPT_INVALID");
        }
        return {
            ...receipt,
            modelId: normalizeModelId(receipt.modelId),
            indexSha256: receipt.indexSha256
                .toLowerCase(),
            modelSha256: receipt.modelSha256
                .toLowerCase()
        };
    }
    readLegacyModelPackReceipt() {
        return this.parseModelPackReceipt(this.legacyModelPackReceiptPath());
    }
    readModelPackReceipt(modelId) {
        const canonical = normalizeModelId(modelId);
        const current = this.parseModelPackReceipt(this.modelPackReceiptPathForModel(canonical));
        if (current) {
            if (normalizeModelId(current.modelId) !== canonical) {
                throw new Error("MODEL_PACK_RECEIPT_STATE_MISMATCH");
            }
            return current;
        }
        const legacy = this.readLegacyModelPackReceipt();
        if (legacy &&
            normalizeModelId(legacy.modelId) === canonical) {
            return legacy;
        }
        return null;
    }
    writeModelPackReceipt(receipt) {
        const target = this.modelPackReceiptPathForModel(receipt.modelId);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        const temporary = `${target}.tmp`;
        fs.writeFileSync(temporary, `${JSON.stringify(receipt, null, 2)}\n`, {
            encoding: "utf8",
            flag: "w"
        });
        fs.renameSync(temporary, target);
        const legacy = this.readLegacyModelPackReceipt();
        if (legacy &&
            normalizeModelId(legacy.modelId) ===
                normalizeModelId(receipt.modelId)) {
            fs.rmSync(this.legacyModelPackReceiptPath(), { force: true });
        }
    }
    qualificationPath() {
        return path.join(this.rootDir, "context-qualification.json");
    }
    readQualification() {
        const receipt = readJson(this.qualificationPath());
        if (!receipt ||
            receipt.schemaVersion !== 1 ||
            receipt.result !== "PASS" ||
            typeof receipt.modelId !== "string" ||
            !finiteInteger(receipt.contextTokens) ||
            ![
                "NATIVE_OR_REDUCED",
                "YARN_EXTENDED"
            ].includes(receipt.contextMode) ||
            receipt.engine !==
                "llama.cpp" ||
            (receipt.backend !==
                undefined &&
                !isBackendId(receipt.backend)) ||
            !Number.isFinite(receipt.startupMs) ||
            receipt.startupMs < 0 ||
            (!receipt.tokenizerCalibration ||
                (receipt
                    .tokenizerCalibration
                    .endpoint !==
                    "/tokenize" ||
                    !finiteInteger(receipt
                        .tokenizerCalibration
                        .sampleCount) ||
                    receipt
                        .tokenizerCalibration
                        .sampleCount < 1 ||
                    !Number.isFinite(receipt
                        .tokenizerCalibration
                        .observedMinCharsPerToken) ||
                    receipt
                        .tokenizerCalibration
                        .observedMinCharsPerToken <= 0 ||
                    !Number.isFinite(receipt
                        .tokenizerCalibration
                        .conservativeCharsPerToken) ||
                    receipt
                        .tokenizerCalibration
                        .conservativeCharsPerToken < 1 ||
                    receipt
                        .tokenizerCalibration
                        .conservativeCharsPerToken > 3 ||
                    typeof receipt
                        .tokenizerCalibration
                        .calibratedAt !==
                        "string" ||
                    Number.isNaN(Date.parse(receipt
                        .tokenizerCalibration
                        .calibratedAt)))) ||
            typeof receipt.validatedAt !==
                "string" ||
            Number.isNaN(Date.parse(receipt.validatedAt))) {
            return null;
        }
        return {
            ...receipt,
            modelId: normalizeModelId(receipt.modelId)
        };
    }
    writeQualification(receipt) {
        fs.mkdirSync(this.rootDir, { recursive: true });
        const target = this.qualificationPath();
        const temporary = `${target}.tmp`;
        fs.writeFileSync(temporary, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
        fs.renameSync(temporary, target);
        this.hardwareCache = null;
    }
    profilesRoot() {
        return path.join(this.rootDir, "profiles");
    }
    profileConfigPath(modelId) {
        const model = this.modelSpec(normalizeModelId(modelId));
        if (!model) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        return path.join(this.profilesRoot(), `${model.filename}.config.json`);
    }
    profileQualificationPath(modelId) {
        const model = this.modelSpec(normalizeModelId(modelId));
        if (!model) {
            throw new Error("LOCAL_MODEL_UNKNOWN");
        }
        return path.join(this.profilesRoot(), `${model.filename}.qualification.json`);
    }
    readProfileConfig(modelId) {
        const canonical = normalizeModelId(modelId);
        const config = readJson(this.profileConfigPath(canonical));
        if (!config ||
            config.schemaVersion !== 1 ||
            typeof config.model?.id !==
                "string" ||
            normalizeModelId(config.model.id) !== canonical ||
            typeof config.model?.path !==
                "string" ||
            !fs.existsSync(config.model.path) ||
            !finiteInteger(config.context
                ?.requestedTokens) ||
            !finiteInteger(config.model
                ?.nativeContext) ||
            typeof config.engine
                ?.executable !==
                "string") {
            return null;
        }
        return config;
    }
    readProfileQualification(modelId) {
        const canonical = normalizeModelId(modelId);
        const value = readJson(this.profileQualificationPath(canonical));
        if (!value ||
            value.schemaVersion !== 1 ||
            value.result !== "PASS" ||
            typeof value.modelId !==
                "string" ||
            normalizeModelId(value.modelId) !== canonical ||
            !finiteInteger(value.contextTokens) ||
            ![
                "NATIVE_OR_REDUCED",
                "YARN_EXTENDED"
            ].includes(value.contextMode) ||
            value.engine !==
                "llama.cpp" ||
            typeof value.validatedAt !==
                "string" ||
            Number.isNaN(Date.parse(value.validatedAt))) {
            return null;
        }
        return value;
    }
    writeModelProfile(config, qualification) {
        const canonical = normalizeModelId(config.model.id);
        fs.mkdirSync(this.profilesRoot(), { recursive: true });
        const configTarget = this.profileConfigPath(canonical);
        const configTemporary = `${configTarget}.tmp`;
        fs.writeFileSync(configTemporary, `${JSON.stringify(config, null, 2)}\n`, "utf8");
        fs.renameSync(configTemporary, configTarget);
        const qualificationTarget = this.profileQualificationPath(canonical);
        if (qualification) {
            const qualificationTemporary = `${qualificationTarget}.tmp`;
            fs.writeFileSync(qualificationTemporary, `${JSON.stringify(qualification, null, 2)}\n`, "utf8");
            fs.renameSync(qualificationTemporary, qualificationTarget);
        }
    }
    manifest() {
        return readJson(this.manifestPath()) ?? {};
    }
    models() {
        const models = this.manifest().models?.localLlm;
        return Array.isArray(models) && models.length > 0
            ? models
            : FALLBACK_MODELS;
    }
    modelSpec(id) {
        return this.models().find((item) => normalizeModelId(item.id) === id);
    }
    readConfig() {
        const config = readJson(this.configPath());
        if (!config || config.schemaVersion !== 1)
            return null;
        if (!finiteInteger(config.context?.requestedTokens))
            return null;
        if (!finiteInteger(config.model?.nativeContext))
            return null;
        if (typeof config.model?.id !== "string")
            return null;
        if (typeof config.model?.path !== "string")
            return null;
        if (typeof config.engine?.executable !== "string")
            return null;
        if (config.engine.backend !==
            undefined &&
            !isBackendId(config.engine.backend)) {
            return null;
        }
        if (config.engine.selectionMode !==
            undefined &&
            !isBackendPreference(config.engine
                .selectionMode)) {
            return null;
        }
        if (config.engine.gpuOffload !==
            undefined &&
            typeof config.engine
                .gpuOffload !==
                "boolean") {
            return null;
        }
        if (config.engine.fallbackBackend !==
            undefined &&
            config.engine.fallbackBackend !==
                null &&
            !isBackendId(config.engine
                .fallbackBackend)) {
            return null;
        }
        if (config.engine
            .fallbackExecutable !==
            undefined &&
            config.engine
                .fallbackExecutable !==
                null &&
            typeof config.engine
                .fallbackExecutable !==
                "string") {
            return null;
        }
        return config;
    }
    writeConfig(config) {
        const target = this.configPath();
        const temporary = target + ".tmp";
        fs.mkdirSync(this.rootDir, { recursive: true });
        fs.writeFileSync(temporary, JSON.stringify(config, null, 2) + "\n", "utf8");
        fs.renameSync(temporary, target);
        this.hardwareCache = null;
    }
    cpuFallbackConfig(config) {
        if (config.engine
            .selectionMode !==
            "AUTO" ||
            configBackend(config) !==
                "VULKAN_X64" ||
            config.engine
                .fallbackBackend !==
                "CPU_X64_PORTABLE" ||
            typeof config.engine
                .fallbackExecutable !==
                "string" ||
            !config.engine
                .fallbackExecutable ||
            !fs.existsSync(config.engine
                .fallbackExecutable)) {
            return null;
        }
        return {
            ...config,
            configuredAt: new Date()
                .toISOString(),
            engine: {
                ...config.engine,
                backend: "CPU_X64_PORTABLE",
                gpuOffload: false,
                executable: config.engine
                    .fallbackExecutable
            }
        };
    }
    async ensureRunningWithAutoFallback(modelId, config) {
        try {
            await this.ensureRunning(modelId);
            return config;
        }
        catch (error) {
            const fallback = this.cpuFallbackConfig(config);
            if (!fallback) {
                throw error;
            }
            await this.stop();
            this.writeConfig(fallback);
            await this.ensureRunning(modelId);
            return fallback;
        }
    }
    publicDescriptor(model, config) {
        const canonical = normalizeModelId(model.id);
        const selected = config && normalizeModelId(config.model.id) === canonical
            ? config
            : null;
        const savedProfile = this.readProfileConfig(canonical);
        const savedQualification = this.readProfileQualification(canonical);
        const profile = selected ??
            (savedProfile &&
                savedQualification &&
                savedQualification
                    .contextTokens ===
                    savedProfile.context
                        .requestedTokens
                ? savedProfile
                : null);
        const contextPolicy = this.contextPolicy();
        const minimum = model.minimumContext ??
            contextPolicy.minimum;
        const maximum = model.maximumRuntimeContext ??
            model.nativeContext;
        const contextWindow = profile?.context.requestedTokens ??
            Math.min(maximum, Math.max(minimum, contextPolicy.default));
        return {
            provider: "local",
            id: canonical,
            displayName: model.displayName,
            selectable: true,
            contextWindow,
            nativeContextWindow: model.nativeContext,
            minimumContextWindow: minimum,
            maximumContextWindow: maximum,
            ...(profile ? { configuredContextWindow: profile.context.requestedTokens } : {}),
            contextMode: profile?.context.mode ?? (contextWindow > model.nativeContext ? "YARN_EXTENDED" : "NATIVE_OR_REDUCED"),
            quantization: model.quantization,
            license: model.license ?? "UNKNOWN",
            source: model.sourceModel ?? model.id,
            localOnly: true,
            installed: fs.existsSync(path.join(this.rootDir, "models", model.filename))
        };
    }
    validateContext(model, contextTokens) {
        if (!finiteInteger(contextTokens)) {
            throw new Error("LOCAL_MODEL_CONTEXT_INVALID");
        }
        const policy = this.contextPolicy();
        const minimum = Math.max(policy.minimum, model.minimumContext ??
            policy.minimum);
        const maximum = Math.min(policy.maximum, model.maximumRuntimeContext ??
            model.nativeContext);
        if (contextTokens < minimum || contextTokens > maximum) {
            throw new Error(`LOCAL_MODEL_CONTEXT_UNSUPPORTED:${contextTokens}:${minimum}:${maximum}`);
        }
        if ((contextTokens - policy.minimum) % policy.step !== 0) {
            throw new Error(`LOCAL_MODEL_CONTEXT_STEP_INVALID:${policy.step}`);
        }
    }
    async runProvisioner(modelId, contextTokens, manifestOverride, backend, backendMode) {
        const script = this.provisionerPath();
        const manifest = manifestOverride
            ? path.resolve(manifestOverride)
            : this.manifestPath();
        if (!fs.existsSync(script)) {
            throw new Error("LOCAL_MODEL_PROVISIONER_MISSING");
        }
        if (!fs.existsSync(manifest)) {
            throw new Error("LOCAL_MODEL_RELEASE_MANIFEST_MISSING");
        }
        const powershell = process.env.SystemRoot
            ? path.join(process.env.SystemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe")
            : "powershell.exe";
        const args = [
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            script,
            "-RuntimeRoot",
            this.runtimeRoot,
            "-ManifestPath",
            manifest,
            "-ModelId",
            modelId,
            "-ContextTokens",
            String(contextTokens),
            "-Backend",
            backend,
            "-BackendMode",
            backendMode,
            "-LocalAiRoot",
            this.rootDir
        ];
        await new Promise((resolve, reject) => {
            const child = spawn(powershell, args, {
                windowsHide: true,
                stdio: ["ignore", "pipe", "pipe"]
            });
            let stdout = "";
            let stderr = "";
            let stdoutLineBuffer = "";
            const consumeStdoutLine = (line) => {
                const progress = parseLocalAiProgressLine(line);
                if (progress) {
                    this.provisioningProgress =
                        progress;
                }
            };
            const timeout = setTimeout(() => {
                child.kill();
                reject(new Error("LOCAL_MODEL_PROVISIONING_TIMEOUT"));
            }, 2 * 60 * 60_000);
            child.stdout?.setEncoding("utf8");
            child.stderr?.setEncoding("utf8");
            child.stdout?.on("data", (chunk) => {
                const text = chunk.toString();
                stdout =
                    `${stdout}${text}`
                        .slice(-16_000);
                stdoutLineBuffer +=
                    text;
                let newline = stdoutLineBuffer
                    .indexOf("\n");
                while (newline >= 0) {
                    const line = stdoutLineBuffer
                        .slice(0, newline)
                        .replace(/\r$/, "");
                    stdoutLineBuffer =
                        stdoutLineBuffer.slice(newline + 1);
                    consumeStdoutLine(line);
                    newline =
                        stdoutLineBuffer
                            .indexOf("\n");
                }
            });
            child.stderr?.on("data", (chunk) => {
                stderr = `${stderr}${chunk.toString()}`.slice(-16_000);
            });
            child.once("error", (error) => {
                clearTimeout(timeout);
                reject(error);
            });
            child.once("exit", (code) => {
                clearTimeout(timeout);
                if (stdoutLineBuffer.trim()) {
                    consumeStdoutLine(stdoutLineBuffer);
                }
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`LOCAL_MODEL_PROVISIONING_FAILED:${code ?? "signal"}:${stderr || stdout}`));
            });
        });
    }
    assertConfiguredComponents(config) {
        if (!fs.existsSync(config.engine.executable)) {
            throw new Error("LOCAL_MODEL_ENGINE_MISSING");
        }
        if (config.engine.selectionMode ===
            "AUTO" &&
            configBackend(config) ===
                "VULKAN_X64" &&
            (config.engine.fallbackBackend !==
                "CPU_X64_PORTABLE" ||
                typeof config.engine
                    .fallbackExecutable !==
                    "string" ||
                !fs.existsSync(config.engine
                    .fallbackExecutable))) {
            throw new Error("LOCAL_MODEL_CPU_FALLBACK_MISSING");
        }
        if (!fs.existsSync(config.model.path)) {
            throw new Error(`LOCAL_MODEL_FILE_MISSING:${config.model.id}`);
        }
    }
    async launch(config) {
        const canonical = normalizeModelId(config.model.id);
        const args = [
            "--model",
            config.model.path,
            "--alias",
            canonical,
            "--host",
            this.host,
            "--port",
            String(this.port),
            "--ctx-size",
            String(config.context.requestedTokens),
            "--parallel",
            "1",
            "--jinja",
            "--flash-attn",
            "auto",
            "--cache-type-k",
            "q8_0",
            "--cache-type-v",
            "q8_0"
        ];
        if (configBackend(config) ===
            "VULKAN_X64" &&
            config.engine.gpuOffload ===
                true) {
            args.push("--n-gpu-layers", "999");
        }
        if (config.context.extendedBeyondNative) {
            args.push("--rope-scaling", "yarn", "--rope-scale", String(config.context.ropeScale), "--yarn-orig-ctx", String(config.model.nativeContext));
        }
        const launchSpec = buildOptionalLocalLaunchSpec(this.rootDir, canonical, args, process.env);
        const child = spawn(config.engine.executable, launchSpec.args, {
            cwd: this.rootDir,
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
            env: launchSpec.env
        });
        this.child = child;
        let stderrTail = "";
        child.stderr?.setEncoding("utf8");
        child.stderr?.on("data", (chunk) => {
            stderrTail = `${stderrTail}${chunk.toString()}`.slice(-8_000);
        });
        const exited = new Promise((_resolve, reject) => {
            child.once("error", reject);
            child.once("exit", (code) => {
                reject(new Error(`LOCAL_MODEL_SERVER_EXIT:${code ?? "signal"}:${stderrTail.slice(-1200)}`));
            });
        });
        const deadline = Date.now() + 180_000;
        while (Date.now() < deadline) {
            if (await this.isHealthy() &&
                await this.isServingModel(canonical)) {
                await this.probeChatCompletion(config.model.id);
                return;
            }
            await Promise.race([
                new Promise((resolve) => setTimeout(resolve, 500)),
                exited
            ]);
        }
        throw new Error("LOCAL_MODEL_START_TIMEOUT");
    }
    async probeChatCompletion(modelId) {
        let response;
        try {
            response =
                await fetch(`http://${this.host}:${this.port}/v1/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        model: normalizeModelId(modelId),
                        messages: [
                            {
                                role: "user",
                                content: "Odpowiedz wyłącznie: OK"
                            }
                        ],
                        max_tokens: 8,
                        stream: false
                    }),
                    signal: AbortSignal.timeout(90_000)
                });
        }
        catch (error) {
            throw new Error(`LOCAL_MODEL_GENERATION_PROBE_FAILED:NETWORK:${error instanceof Error
                ? error.message
                : String(error)}`);
        }
        if (!response.ok) {
            const detail = await response.text()
                .catch(() => "");
            throw new Error(`LOCAL_MODEL_GENERATION_PROBE_FAILED:HTTP_${response.status}:${detail
                .replace(/[\r\n]+/g, " ")
                .slice(-600)}`);
        }
        let payload;
        try {
            payload =
                await response.json();
        }
        catch {
            throw new Error("LOCAL_MODEL_GENERATION_PROBE_FAILED:INVALID_JSON");
        }
        if (payload.error) {
            throw new Error(`LOCAL_MODEL_GENERATION_PROBE_FAILED:MODEL_ERROR:${typeof payload.error
                .message === "string"
                ? payload.error.message
                : "unknown"}`);
        }
        const content = payload.choices?.[0]
            ?.message?.content;
        if (typeof content !==
            "string" ||
            !content.trim()) {
            throw new Error("LOCAL_MODEL_GENERATION_PROBE_FAILED:EMPTY_RESPONSE");
        }
    }
    async calibrateTokenizer() {
        const samples = [
            "Powód wnosi o zasądzenie kwoty 12 345,67 zł wraz z odsetkami ustawowymi za opóźnienie od dnia 18 września 2026 r.",
            "§ 4. Wykonawca zobowiązuje się wykonać przedmiot umowy w terminie 14 dni od doręczenia kompletnej dokumentacji.",
            "Sygn. III CZP 25/11; art. 6 KC; faktura VAT nr FV/09/2026; termin płatności: 30 dni."
        ];
        const ratios = [];
        for (const sample of samples) {
            let response;
            try {
                response =
                    await fetch(`http://${this.host}:${this.port}/tokenize`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: JSON.stringify({
                            content: sample,
                            add_special: false,
                            parse_special: true,
                            with_pieces: false
                        }),
                        signal: AbortSignal.timeout(2_500)
                    });
            }
            catch (error) {
                throw new Error(`LOCAL_TOKENIZER_CALIBRATION_FAILED:NETWORK:${error instanceof Error
                    ? error.message
                    : String(error)}`);
            }
            if (!response.ok) {
                throw new Error(`LOCAL_TOKENIZER_CALIBRATION_FAILED:HTTP_${response.status}`);
            }
            let payload;
            try {
                payload =
                    await response.json();
            }
            catch {
                throw new Error("LOCAL_TOKENIZER_CALIBRATION_FAILED:INVALID_JSON");
            }
            if (!Array.isArray(payload.tokens) ||
                payload.tokens.length <
                    1 ||
                payload.tokens.length >
                    sample.length * 4) {
                throw new Error("LOCAL_TOKENIZER_CALIBRATION_FAILED:TOKENS_INVALID");
            }
            const ratio = sample.length /
                payload.tokens.length;
            if (!Number.isFinite(ratio) ||
                ratio < 0.5 ||
                ratio > 16) {
                throw new Error("LOCAL_TOKENIZER_CALIBRATION_FAILED:RATIO_INVALID");
            }
            ratios.push(ratio);
        }
        if (ratios.length !==
            samples.length) {
            throw new Error("LOCAL_TOKENIZER_CALIBRATION_FAILED:INCOMPLETE");
        }
        const observedMin = Math.min(...ratios);
        const conservative = Math.max(1, Math.min(3, observedMin * 0.9));
        return {
            endpoint: "/tokenize",
            sampleCount: samples.length,
            observedMinCharsPerToken: Number(observedMin.toFixed(4)),
            conservativeCharsPerToken: Number(conservative.toFixed(4)),
            calibratedAt: new Date().toISOString()
        };
    }
    async isServingModel(expectedModelId) {
        try {
            const response = await fetch(`http://${this.host}:${this.port}/v1/models`, {
                headers: {
                    Accept: "application/json"
                },
                signal: AbortSignal.timeout(1_500)
            });
            if (!response.ok) {
                return false;
            }
            return localModelListContainsAlias(await response.json(), expectedModelId);
        }
        catch {
            return false;
        }
    }
    async isHealthy() {
        try {
            const response = await fetch(`http://${this.host}:${this.port}/health`, {
                signal: AbortSignal.timeout(1_500)
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
}

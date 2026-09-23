import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const PROVIDERS = [
    "openai",
    "anthropic",
    "xai"
];
function localAiRoot() {
    const configured = process.env.LEX_LOCAL_LLM_ROOT?.trim();
    if (configured)
        return path.resolve(configured);
    const local = process.env.LOCALAPPDATA?.trim();
    if (local)
        return path.resolve(local, "LexMachina", "local-ai");
    return path.resolve(os.homedir(), ".lex-machina", "local-ai");
}
function localConfigExecutionReady(configPath, qualificationPath) {
    try {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const qualification = JSON.parse(fs.readFileSync(qualificationPath, "utf8"));
        if (config.schemaVersion !== 1 ||
            qualification.schemaVersion !== 1 ||
            qualification.result !== "PASS" ||
            typeof config.model?.id !==
                "string" ||
            typeof qualification.modelId !==
                "string" ||
            qualification.modelId !==
                config.model.id ||
            typeof config.context
                ?.requestedTokens !==
                "number" ||
            !Number.isSafeInteger(config.context
                .requestedTokens) ||
            qualification.contextTokens !==
                config.context
                    .requestedTokens) {
            return false;
        }
        const modelPath = typeof config.model?.path ===
            "string"
            ? config.model.path
            : "";
        const enginePath = typeof config.engine
            ?.executable ===
            "string"
            ? config.engine
                .executable
            : "";
        return Boolean(modelPath &&
            enginePath &&
            fs.existsSync(modelPath) &&
            fs.existsSync(enginePath));
    }
    catch {
        return false;
    }
}
function localAiExecutionReady() {
    const root = localAiRoot();
    if (localConfigExecutionReady(path.join(root, "config.json"), path.join(root, "context-qualification.json"))) {
        return true;
    }
    const profiles = path.join(root, "profiles");
    try {
        return fs
            .readdirSync(profiles, {
            withFileTypes: true
        })
            .filter((entry) => entry.isFile() &&
            entry.name.endsWith(".config.json"))
            .slice(0, 16)
            .some((entry) => {
            const qualificationName = entry.name.replace(/\.config\.json$/, ".qualification.json");
            return localConfigExecutionReady(path.join(profiles, entry.name), path.join(profiles, qualificationName));
        });
    }
    catch {
        return false;
    }
}
export async function providerConfigurationStatus(resolver) {
    const localOpenAiCompatibleReady = localAiExecutionReady();
    return Promise.all(PROVIDERS.map(async (provider) => ({
        provider,
        configured: Boolean(await resolver.getApiKey(provider)) ||
            (provider === "openai" &&
                localOpenAiCompatibleReady)
    })));
}
const PROVIDER_ENV = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    xai: "XAI_API_KEY"
};
export class EnvironmentCredentialResolver {
    async getApiKey(provider) {
        return process.env[PROVIDER_ENV[provider]]?.trim() || null;
    }
}
export class MemoryOverlayCredentialResolver {
    fallback;
    memory = new Map();
    constructor(fallback = new EnvironmentCredentialResolver()) {
        this.fallback = fallback;
    }
    async getApiKey(provider) {
        const value = this.memory.get(provider);
        if (value) {
            return value.toString("utf8");
        }
        return await this.fallback
            .getApiKey(provider);
    }
    setApiKey(provider, apiKey) {
        const normalized = apiKey.trim();
        if (normalized.length < 10 ||
            normalized.length > 8192 ||
            /[\r\n]/.test(normalized)) {
            throw new Error("INVALID_PROVIDER_API_KEY");
        }
        const previous = this.memory.get(provider);
        previous?.fill(0);
        this.memory.set(provider, Buffer.from(normalized, "utf8"));
    }
    clearApiKey(provider) {
        const previous = this.memory.get(provider);
        previous?.fill(0);
        this.memory.delete(provider);
    }
    hasMemoryKey(provider) {
        return this.memory.has(provider);
    }
    close() {
        for (const value of this.memory.values()) {
            value.fill(0);
        }
        this.memory.clear();
    }
}
export class StaticCredentialResolver {
    keys;
    constructor(keys) {
        this.keys = keys;
    }
    async getApiKey(provider) {
        return this.keys[provider]?.trim() || null;
    }
}
export class MissingProviderCredentialError extends Error {
    provider;
    constructor(provider) {
        super(`Missing API credential for provider: ${provider}`);
        this.provider = provider;
        this.name = "MissingProviderCredentialError";
    }
}

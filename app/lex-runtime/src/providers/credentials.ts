import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { ProviderId } from "./types.js";

export interface ProviderCredentialResolver {
  getApiKey(provider: ProviderId): Promise<string | null>;
}

export type ProviderConfigurationStatus = {
  provider: ProviderId;
  configured: boolean;
};

const PROVIDERS: ProviderId[] = [
  "openai",
  "anthropic",
  "xai"
];

function localAiRoot(): string {
  const configured = process.env.LEX_LOCAL_LLM_ROOT?.trim();
  if (configured) return path.resolve(configured);
  const local = process.env.LOCALAPPDATA?.trim();
  if (local) return path.resolve(local, "LexMachina", "local-ai");
  return path.resolve(os.homedir(), ".lex-machina", "local-ai");
}

function localConfigExecutionReady(
  configPath: string
): boolean {
  try {
    const config = JSON.parse(
      fs.readFileSync(
        configPath,
        "utf8"
      )
    ) as {
      schemaVersion?: unknown;
      model?: {
        path?: unknown;
      };
      engine?: {
        executable?: unknown;
      };
    };
    if (
      config.schemaVersion !== 1
    ) {
      return false;
    }
    const modelPath =
      typeof config.model?.path ===
        "string"
        ? config.model.path
        : "";
    const enginePath =
      typeof config.engine
        ?.executable ===
        "string"
        ? config.engine
            .executable
        : "";
    return Boolean(
      modelPath &&
      enginePath &&
      fs.existsSync(modelPath) &&
      fs.existsSync(enginePath)
    );
  } catch {
    return false;
  }
}

function localAiExecutionReady(): boolean {
  const root =
    localAiRoot();
  if (
    localConfigExecutionReady(
      path.join(
        root,
        "config.json"
      )
    )
  ) {
    return true;
  }

  const profiles =
    path.join(
      root,
      "profiles"
    );
  try {
    return fs
      .readdirSync(
        profiles,
        {
          withFileTypes: true
        }
      )
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(
            ".config.json"
          )
      )
      .slice(0, 16)
      .some(
        (entry) =>
          localConfigExecutionReady(
            path.join(
              profiles,
              entry.name
            )
          )
      );
  } catch {
    return false;
  }
}

export async function providerConfigurationStatus(
  resolver: ProviderCredentialResolver
): Promise<ProviderConfigurationStatus[]> {
  const localOpenAiCompatibleReady = localAiExecutionReady();
  return Promise.all(
    PROVIDERS.map(async (provider) => ({
      provider,
      configured:
        Boolean(
          await resolver.getApiKey(
            provider
          )
        ) ||
        (
          provider === "openai" &&
          localOpenAiCompatibleReady
        )
    }))
  );
}

const PROVIDER_ENV: Record<ProviderId, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  xai: "XAI_API_KEY"
};

export class EnvironmentCredentialResolver
  implements ProviderCredentialResolver
{
  async getApiKey(provider: ProviderId): Promise<string | null> {
    return process.env[PROVIDER_ENV[provider]]?.trim() || null;
  }
}

export interface ProviderCredentialManager
  extends ProviderCredentialResolver
{
  setApiKey(
    provider: ProviderId,
    apiKey: string
  ): void;
  clearApiKey(
    provider: ProviderId
  ): void;
  hasMemoryKey(
    provider: ProviderId
  ): boolean;
  close(): void;
}

export class MemoryOverlayCredentialResolver
  implements ProviderCredentialManager
{
  private readonly memory =
    new Map<
      ProviderId,
      Buffer
    >();

  constructor(
    private readonly fallback:
      ProviderCredentialResolver =
        new EnvironmentCredentialResolver()
  ) {}

  async getApiKey(
    provider: ProviderId
  ): Promise<string | null> {
    const value =
      this.memory.get(provider);
    if (value) {
      return value.toString(
        "utf8"
      );
    }
    return await this.fallback
      .getApiKey(provider);
  }

  setApiKey(
    provider: ProviderId,
    apiKey: string
  ): void {
    const normalized =
      apiKey.trim();
    if (
      normalized.length < 10 ||
      normalized.length > 8192 ||
      /[\r\n]/.test(
        normalized
      )
    ) {
      throw new Error(
        "INVALID_PROVIDER_API_KEY"
      );
    }

    const previous =
      this.memory.get(provider);
    previous?.fill(0);
    this.memory.set(
      provider,
      Buffer.from(
        normalized,
        "utf8"
      )
    );
  }

  clearApiKey(
    provider: ProviderId
  ): void {
    const previous =
      this.memory.get(provider);
    previous?.fill(0);
    this.memory.delete(
      provider
    );
  }

  hasMemoryKey(
    provider: ProviderId
  ): boolean {
    return this.memory.has(
      provider
    );
  }

  close(): void {
    for (
      const value
      of this.memory.values()
    ) {
      value.fill(0);
    }
    this.memory.clear();
  }
}

export class StaticCredentialResolver
  implements ProviderCredentialResolver
{
  constructor(
    private readonly keys: Partial<Record<ProviderId, string>>
  ) {}

  async getApiKey(provider: ProviderId): Promise<string | null> {
    return this.keys[provider]?.trim() || null;
  }
}

export class MissingProviderCredentialError extends Error {
  constructor(readonly provider: ProviderId) {
    super(`Missing API credential for provider: ${provider}`);
    this.name = "MissingProviderCredentialError";
  }
}

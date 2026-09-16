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

export async function providerConfigurationStatus(
  resolver: ProviderCredentialResolver
): Promise<ProviderConfigurationStatus[]> {
  return Promise.all(
    PROVIDERS.map(async (provider) => ({
      provider,
      configured:
        Boolean(
          await resolver.getApiKey(
            provider
          )
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

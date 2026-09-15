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

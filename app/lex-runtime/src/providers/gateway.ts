import type {
  ProviderAdapter,
  ProviderId,
  ProviderStreamParams,
  ProviderStreamResult
} from "./types.js";

export type ProviderFailureCode =
  | "UNKNOWN_PROVIDER"
  | "TOOLS_UNSUPPORTED"
  | "REASONING_UNSUPPORTED"
  | "PROVIDER_ERROR";

export class ProviderGatewayError extends Error {
  constructor(
    readonly code: ProviderFailureCode,
    message: string,
    readonly provider?: ProviderId,
    readonly causeValue?: unknown
  ) {
    super(message);
    this.name = "ProviderGatewayError";
  }
}

export class ProviderRegistry {
  private readonly providers = new Map<ProviderId, ProviderAdapter>();

  register(adapter: ProviderAdapter): void {
    if (this.providers.has(adapter.id)) {
      throw new Error(`Provider already registered: ${adapter.id}`);
    }
    this.providers.set(adapter.id, adapter);
  }

  get(id: ProviderId): ProviderAdapter | undefined {
    return this.providers.get(id);
  }

  list(): ProviderAdapter[] {
    return [...this.providers.values()];
  }
}

export class ProviderGateway {
  constructor(private readonly registry: ProviderRegistry) {}

  nativeCorpusAccess(providerId: ProviderId, model: string): boolean {
    return this.registry.get(providerId)?.nativeCorpusAccess?.(model) === true;
  }

  supportsImages(providerId: ProviderId, model: string): boolean {
    return this.registry.get(providerId)?.supportsImages?.(model) === true;
  }

  async stream(
    providerId: ProviderId,
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    const provider = this.registry.get(providerId);
    if (!provider) {
      throw new ProviderGatewayError(
        "UNKNOWN_PROVIDER",
        `Provider is not registered: ${providerId}`,
        providerId
      );
    }

    if (params.tools?.length && !provider.capabilities.tools) {
      throw new ProviderGatewayError(
        "TOOLS_UNSUPPORTED",
        `Provider ${providerId} does not support tool calling.`,
        providerId
      );
    }

    if (
      params.reasoning &&
      params.reasoning !== "none" &&
      !provider.capabilities.reasoning
    ) {
      throw new ProviderGatewayError(
        "REASONING_UNSUPPORTED",
        `Provider ${providerId} does not support reasoning controls.`,
        providerId
      );
    }

    try {
      return await provider.stream(params);
    } catch (error) {
      if (error instanceof ProviderGatewayError) throw error;
      throw new ProviderGatewayError(
        "PROVIDER_ERROR",
        error instanceof Error ? error.message : String(error),
        providerId,
        error
      );
    }
  }
}

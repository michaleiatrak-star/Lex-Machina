export class ProviderGatewayError extends Error {
    code;
    provider;
    causeValue;
    constructor(code, message, provider, causeValue) {
        super(message);
        this.code = code;
        this.provider = provider;
        this.causeValue = causeValue;
        this.name = "ProviderGatewayError";
    }
}
export class ProviderRegistry {
    providers = new Map();
    register(adapter) {
        if (this.providers.has(adapter.id)) {
            throw new Error(`Provider already registered: ${adapter.id}`);
        }
        this.providers.set(adapter.id, adapter);
    }
    get(id) {
        return this.providers.get(id);
    }
    list() {
        return [...this.providers.values()];
    }
}
export class ProviderGateway {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    nativeCorpusAccess(providerId, model) {
        return this.registry.get(providerId)?.nativeCorpusAccess?.(model) === true;
    }
    supportsImages(providerId, model) {
        return this.registry.get(providerId)?.supportsImages?.(model) === true;
    }
    async stream(providerId, params) {
        const provider = this.registry.get(providerId);
        if (!provider) {
            throw new ProviderGatewayError("UNKNOWN_PROVIDER", `Provider is not registered: ${providerId}`, providerId);
        }
        if (params.tools?.length && !provider.capabilities.tools) {
            throw new ProviderGatewayError("TOOLS_UNSUPPORTED", `Provider ${providerId} does not support tool calling.`, providerId);
        }
        if (params.reasoning &&
            params.reasoning !== "none" &&
            !provider.capabilities.reasoning) {
            throw new ProviderGatewayError("REASONING_UNSUPPORTED", `Provider ${providerId} does not support reasoning controls.`, providerId);
        }
        try {
            return await provider.stream(params);
        }
        catch (error) {
            if (error instanceof ProviderGatewayError)
                throw error;
            throw new ProviderGatewayError("PROVIDER_ERROR", error instanceof Error ? error.message : String(error), providerId, error);
        }
    }
}

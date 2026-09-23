import { StaticCredentialResolver, providerConfigurationStatus } from "./providers/credentials.js";
async function main() {
    const secrets = {
        openai: "g26-openai-secret",
        xai: "g26-xai-secret"
    };
    const status = await providerConfigurationStatus(new StaticCredentialResolver(secrets));
    const expected = [
        { provider: "openai", configured: true },
        { provider: "anthropic", configured: false },
        { provider: "xai", configured: true }
    ];
    if (JSON.stringify(status) !== JSON.stringify(expected)) {
        throw new Error("G26 provider configuration status is not deterministic.");
    }
    const serialized = JSON.stringify(status);
    for (const secret of Object.values(secrets)) {
        if (serialized.includes(secret)) {
            throw new Error("G26 exposed a provider credential.");
        }
    }
    if (/API_KEY|credential|secret-value/i.test(serialized)) {
        throw new Error("G26 exposed credential metadata instead of boolean status.");
    }
    process.stdout.write(JSON.stringify({
        gate: "G26_PROVIDER_CONFIGURATION_STATUS",
        result: "PASS",
        providers: status,
        secretValuesExposed: false
    }, null, 2) + "\n");
}
await main();

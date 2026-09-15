import {
  EnvironmentCredentialResolver
} from "./providers/credentials.js";

async function main(): Promise<void> {
  const names = [
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "XAI_API_KEY"
  ] as const;
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]])
  );

  const secrets = {
    OPENAI_API_KEY: "g6-openai-secret",
    ANTHROPIC_API_KEY: "g6-anthropic-secret",
    XAI_API_KEY: "g6-xai-secret"
  };

  try {
    Object.assign(process.env, secrets);
    const resolver = new EnvironmentCredentialResolver();

    const resolved = await Promise.all([
      resolver.getApiKey("openai"),
      resolver.getApiKey("anthropic"),
      resolver.getApiKey("xai")
    ]);

    if (
      resolved[0] !== secrets.OPENAI_API_KEY ||
      resolved[1] !== secrets.ANTHROPIC_API_KEY ||
      resolved[2] !== secrets.XAI_API_KEY
    ) {
      throw new Error("G6 credential resolver did not resolve server-side credentials.");
    }

    const serialized = JSON.stringify(resolver);
    for (const secret of Object.values(secrets)) {
      if (serialized.includes(secret)) {
        throw new Error("G6 credential resolver serialized a provider secret.");
      }
    }

    if (Object.keys(resolver).length !== 0) {
      throw new Error("G6 environment resolver must not retain credentials as object state.");
    }

    process.stdout.write(JSON.stringify({
      gate: "G6_PROVIDER_CREDENTIAL_BOUNDARY",
      result: "PASS",
      serverSideEnvironmentOnly: true,
      retainedCredentialFields: 0,
      providerCount: 3
    }, null, 2) + "\n");
  } finally {
    for (const name of names) {
      const value = previous[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

await main();

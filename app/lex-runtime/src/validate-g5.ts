import { runProviderConformance } from "./providers/conformance.js";
import { ScriptedProviderAdapter } from "./providers/scripted-provider.js";
import { smokeTestAiSdkFactories } from "./providers/ai-sdk-factories.js";

const reports = [];
for (const id of ["openai", "anthropic", "xai"] as const) {
  reports.push(
    await runProviderConformance(new ScriptedProviderAdapter({ id }))
  );
}

const factorySmoke = await smokeTestAiSdkFactories();
const pass =
  reports.every((report) => report.pass) &&
  factorySmoke.every((entry) => entry.pass);

process.stdout.write(
  JSON.stringify(
    {
      gate: "G5_PROVIDER_CONFORMANCE",
      result: pass ? "PASS" : "BLOCKED",
      providers: reports,
      aiSdkFactories: factorySmoke,
      liveApiCallsExecuted: false,
      liveValidationStatus: "PENDING_CREDENTIALLED_TESTS"
    },
    null,
    2
  ) + "\n"
);

if (!pass) process.exitCode = 1;

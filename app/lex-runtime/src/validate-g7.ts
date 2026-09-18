import path from "node:path";
import { fileURLToPath } from "node:url";
import { LexExecutionEngine } from "./execution-engine.js";
import { LexSkillRegistry } from "./registry.js";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { ScriptedProviderAdapter } from "./providers/scripted-provider.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);

const registry = new LexSkillRegistry(lexRoot);
const scanIssues = registry.scan();
const declarationIssues = registry.validateDeclarations();

if (scanIssues.length || declarationIssues.length) {
  process.stdout.write(
    JSON.stringify(
      {
        gate: "G7_VERTICAL_SLICE",
        result: "BLOCKED",
        issues: [...scanIssues, ...declarationIssues]
      },
      null,
      2
    ) + "\n"
  );
  process.exitCode = 1;
} else {
  const providers = new ProviderRegistry();
  for (const id of ["openai", "anthropic", "xai"] as const) {
    providers.register(new ScriptedProviderAdapter({ id }));
  }

  const engine = new LexExecutionEngine(
    registry,
    new ProviderGateway(providers)
  );

  const results = [];
  for (const provider of ["openai", "anthropic", "xai"] as const) {
    const result = await engine.executePolishLegalQuery({
      query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nTest techniczny pionowego routingu domeny cywilnej bez uruchamiania wykonawczego workflow dokumentowego.',
      provider,
      model: `${provider}-g7-test`,
      route: {
        jurisdiction: "PL",
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
        mode: "PRAWNIK"
      }
    });

    const skillReads = result.events
      .filter((event) => event.type === "skill_read")
      .map((event) => event.target);

    const routingMapRead = result.events.find(
      (event) =>
        event.type === "resource_read" &&
        event.target === "prawo-polskie-v2/ROUTING-MAP.md"
    );

    const pass =
      skillReads[0] === "prawny-router-v3" &&
      skillReads.includes("prawo-polskie-v2") &&
      skillReads.includes("dr-02-prawo-cywilne-rodzinne-gospodarcze") &&
      routingMapRead?.status === "OK" &&
      result.workflowPlan.id === "LEGAL_QUERY_V1" &&
      result.workflowPlan.executionSkill === null &&
      result.events.at(-1)?.target === "G7_VERTICAL_SLICE";

    results.push({
      provider,
      pass,
      skillReads,
      routingMapRead: routingMapRead?.status ?? null,
      workflow: result.workflowPlan.id,
      executionSkill: result.workflowPlan.executionSkill,
      output: result.output
    });
  }

  const pass = results.every((entry) => entry.pass);
  process.stdout.write(
    JSON.stringify(
      {
        gate: "G7_VERTICAL_SLICE",
        result: pass ? "PASS" : "BLOCKED",
        routeDecisionSource: "DETERMINISTIC_TEST_FIXTURE",
        legalAnalysisExecuted: false,
        results
      },
      null,
      2
    ) + "\n"
  );

  if (!pass) process.exitCode = 1;
}

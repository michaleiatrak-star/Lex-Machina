import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ProviderGateway,
  ProviderRegistry
} from "./providers/gateway.js";
import { ScriptedProviderAdapter } from "./providers/scripted-provider.js";
import type { ProviderAdapter } from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import { SafeSessionExecutor } from "./session-executor.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);

const registry = new LexSkillRegistry(lexRoot);
const issues = [...registry.scan(), ...registry.validateDeclarations()];

if (issues.length > 0) {
  process.stdout.write(
    JSON.stringify({
      gate: "G15_SAFE_SESSION_EXECUTION",
      result: "BLOCKED",
      issues
    }, null, 2) + "\n"
  );
  process.exitCode = 1;
} else {
  const safeProviders = new ProviderRegistry();
  safeProviders.register(
    new ScriptedProviderAdapter({ id: "openai" })
  );
  const safeExecutor = new SafeSessionExecutor(
    registry,
    new ProviderGateway(safeProviders)
  );

  const safe = await safeExecutor.execute({
    query: "Techniczny test G15 bez analizy prawnej.",
    provider: "openai",
    model: "g15-safe",
    primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
    mode: "PRAWNIK"
  });

  const unsafeAdapter: ProviderAdapter = {
    id: "anthropic",
    label: "g15-unsafe",
    capabilities: {
      streaming: true,
      tools: true,
      reasoning: true,
      modelDiscovery: false
    },
    async stream() {
      return {
        fullText: "Zastosowanie ma art. 1234 KC."
      };
    }
  };

  const unsafeProviders = new ProviderRegistry();
  unsafeProviders.register(unsafeAdapter);
  const unsafeExecutor = new SafeSessionExecutor(
    registry,
    new ProviderGateway(unsafeProviders)
  );

  const unsafe = await unsafeExecutor.execute({
    query: "Techniczny test blokady G15.",
    provider: "anthropic",
    model: "g15-unsafe",
    primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
    mode: "PRAWNIK"
  });

  const pass =
    safe.status === "DRAFT_PRESENTABLE" &&
    safe.finalization === "PASS" &&
    typeof safe.answer === "string" &&
    safe.audit.result === "PASS" &&
    safe.audit.closed === true &&
    unsafe.status === "BLOCKED" &&
    unsafe.finalization === "BLOCKED" &&
    unsafe.answer === undefined &&
    unsafe.audit.closed === true &&
    unsafe.blockedReferences.some(
      (reference) =>
        reference.claim === "art. 1234 KC" &&
        reference.status === "MISSING_LEDGER_RECORD"
    );

  process.stdout.write(
    JSON.stringify({
      gate: "G15_SAFE_SESSION_EXECUTION",
      result: pass ? "PASS" : "BLOCKED",
      safePath: {
        status: safe.status,
        finalization: safe.finalization,
        audit: safe.audit.result
      },
      blockedPath: {
        status: unsafe.status,
        finalization: unsafe.finalization,
        answerExposed: unsafe.answer !== undefined,
        references: unsafe.blockedReferences
      },
      liveApiCallsExecuted: false,
      liveValidationStatus: "PENDING_CREDENTIALLED_TESTS"
    }, null, 2) + "\n"
  );

  if (!pass) process.exitCode = 1;
}

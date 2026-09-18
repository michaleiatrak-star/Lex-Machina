import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { createLexHttpApp } from "./http/app.js";
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
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

const registry = new LexSkillRegistry(lexRoot);
const issues = [...registry.scan(), ...registry.validateDeclarations()];

function appWithExecutor(executor: SafeSessionExecutor) {
  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider: "openai" as const,
        id: "g15-safe",
        displayName: "g15-safe",
        selectable: true
      }]
    },
    sessionExecutor: executor
  });
}

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

  const safeHttp = await request(appWithExecutor(safeExecutor))
    .post("/api/sessions/execute")
    .send({
      query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nScenariusz kontrolny G15 alfa beta gamma.',
      provider: "openai",
      model: "g15-safe",
      primarySkill: DR02,
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

  const unsafeHttp = await request(appWithExecutor(unsafeExecutor))
    .post("/api/sessions/execute")
    .send({
      query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nTechniczny test blokady G15.',
      provider: "anthropic",
      model: "g15-unsafe",
      primarySkill: DR02,
      mode: "PRAWNIK"
    });

  const invalidRouteHttp = await request(appWithExecutor(safeExecutor))
    .post("/api/sessions/execute")
    .send({
      query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nTest niedozwolonego routingu.',
      provider: "openai",
      model: "g15-safe",
      primarySkill: "pisma-procesowe-v3",
      mode: "PRAWNIK"
    });

  const safe = safeHttp.body as Record<string, unknown>;
  const unsafe = unsafeHttp.body as Record<string, unknown>;
  const safeAudit =
    typeof safe.audit === "object" && safe.audit !== null
      ? safe.audit as Record<string, unknown>
      : {};
  const unsafeAudit =
    typeof unsafe.audit === "object" && unsafe.audit !== null
      ? unsafe.audit as Record<string, unknown>
      : {};
  const unsafeReferences = Array.isArray(unsafe.blockedReferences)
    ? unsafe.blockedReferences as Array<Record<string, unknown>>
    : [];

  const pass =
    safeHttp.status === 200 &&
    safe.status === "DRAFT_PRESENTABLE" &&
    safe.finalization === "PASS" &&
    typeof safe.answer === "string" &&
    safeAudit.result === "PASS" &&
    safeAudit.closed === true &&
    (safe.workflow as Record<string, unknown> | undefined)?.id ===
      "LEGAL_QUERY_V1" &&
    unsafeHttp.status === 200 &&
    unsafe.status === "BLOCKED" &&
    unsafe.finalization === "BLOCKED" &&
    !("answer" in unsafe) &&
    unsafeAudit.closed === true &&
    unsafeReferences.some(
      (reference) =>
        reference.claim === "art. 1234 KC" &&
        reference.status === "MISSING_LEDGER_RECORD"
    ) &&
    invalidRouteHttp.status === 422 &&
    invalidRouteHttp.body?.error === "INVALID_ROUTE";

  process.stdout.write(
    JSON.stringify({
      gate: "G15_SAFE_SESSION_EXECUTION",
      result: pass ? "PASS" : "BLOCKED",
      safePath: {
        http: safeHttp.status,
        status: safe.status,
        finalization: safe.finalization,
        audit: safeAudit.result,
        auditMissing: safeAudit.missing ?? [],
        auditViolations: safeAudit.violations ?? [],
        workflow: safe.workflow ?? null,
        answerReleased: typeof safe.answer === "string"
      },
      blockedPath: {
        http: unsafeHttp.status,
        status: unsafe.status,
        finalization: unsafe.finalization,
        audit: unsafeAudit.result,
        auditMissing: unsafeAudit.missing ?? [],
        auditViolations: unsafeAudit.violations ?? [],
        workflow: unsafe.workflow ?? null,
        answerReleased: "answer" in unsafe,
        references: unsafeReferences
      },
      invalidRoute: {
        http: invalidRouteHttp.status,
        error: invalidRouteHttp.body?.error
      },
      liveApiCallsExecuted: false,
      liveValidationStatus: "PENDING_CREDENTIALLED_TESTS"
    }, null, 2) + "\n"
  );

  if (!pass) process.exitCode = 1;
}

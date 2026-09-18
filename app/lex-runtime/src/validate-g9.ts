import path from "node:path";
import { fileURLToPath } from "node:url";
import { AuditTrail } from "./audit-trail.js";
import { AuditedFinalizer } from "./audited-finalizer.js";
import { LexExecutionEngine } from "./execution-engine.js";
import { LexSkillRegistry } from "./registry.js";
import { VerificationLedger } from "./verification-ledger.js";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { ScriptedProviderAdapter } from "./providers/scripted-provider.js";

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
    JSON.stringify(
      {
        gate: "G9_AUDIT_COMPLETENESS",
        result: "BLOCKED",
        issues
      },
      null,
      2
    ) + "\n"
  );
  process.exitCode = 1;
} else {
  const providers = new ProviderRegistry();
  providers.register(new ScriptedProviderAdapter({ id: "openai" }));

  const audit = new AuditTrail(
    "g9-real-corpus",
    () => "2026-09-15T00:00:00Z"
  );
  audit.start({ gate: "G9" });

  const engine = new LexExecutionEngine(
    registry,
    new ProviderGateway(providers)
  );

  const execution = await engine.executePolishLegalQuery({
    query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nTest techniczny audytu — bez analizy prawnej.',
    provider: "openai",
    model: "g9-test",
    route: {
      jurisdiction: "PL",
      primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
      mode: "PRAWNIK"
    }
  });

  for (const event of execution.events) {
    if (
      [
        "skill_read",
        "resource_read",
        "route",
        "provider_start",
        "provider_end",
        "gate"
      ].includes(event.type)
    ) {
      audit.record(
        event.type as
          | "skill_read"
          | "resource_read"
          | "route"
          | "provider_start"
          | "provider_end"
          | "gate",
        event.target,
        event.status === "BLOCKED" ? "BLOCKED" : "OK",
        event.detail ? { detail: event.detail } : undefined
      );
    }
  }

  const ledger = new VerificationLedger();
  const finalization = new AuditedFinalizer().finalize({
    text: execution.output,
    ledger,
    audit
  });

  const completeness = audit.validateCompletion();
  const pass =
    finalization.result === "PASS" &&
    completeness.result === "PASS";

  process.stdout.write(
    JSON.stringify(
      {
        gate: "G9_AUDIT_COMPLETENESS",
        result: pass ? "PASS" : "BLOCKED",
        finalization: finalization.result,
        completeness,
        events: audit.events
      },
      null,
      2
    ) + "\n"
  );

  if (!pass) process.exitCode = 1;
}

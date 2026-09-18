import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AuditTrail } from "./audit-trail.js";
import { ExportGate } from "./export-gate.js";
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

async function buildExecutionAudit(id: string): Promise<AuditTrail> {
  const providers = new ProviderRegistry();
  providers.register(new ScriptedProviderAdapter({ id: "openai" }));
  const engine = new LexExecutionEngine(
    registry,
    new ProviderGateway(providers)
  );

  const execution = await engine.executePolishLegalQuery({
    query: '__LEX_SKILLS_V1__ {"auto":false,"manual":[]}\nTest techniczny eksportu — bez analizy prawnej.',
    provider: "openai",
    model: "g10-test",
    route: {
      jurisdiction: "PL",
      primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
      mode: "PRAWNIK"
    }
  });

  const audit = new AuditTrail(id, () => "2026-09-15T00:00:00Z");
  audit.start({ gate: "G10" });
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
  return audit;
}

if (issues.length > 0) {
  process.stdout.write(
    JSON.stringify(
      {
        gate: "G10_EXPORT_GATE",
        result: "BLOCKED",
        issues
      },
      null,
      2
    ) + "\n"
  );
  process.exitCode = 1;
} else {
  const positiveAudit = await buildExecutionAudit("g10-positive");
  const positiveText = "Synthetic export fixture without legal references.";
  const positive = new ExportGate().evaluate({
    documentContent: positiveText,
    documentText: positiveText,
    documentKind: "docx",
    documentSkill: "pisma-procesowe-v3",
    ledger: new VerificationLedger(),
    audit: positiveAudit,
    hybridValidation: "PASS"
  });

  const negativeAudit = await buildExecutionAudit("g10-negative");
  const negative = new ExportGate().evaluate({
    documentContent: "Art. 1234 KC.",
    documentText: "Art. 1234 KC.",
    documentKind: "docx",
    documentSkill: "pisma-procesowe-v3",
    ledger: new VerificationLedger(),
    audit: negativeAudit,
    hybridValidation: "PASS"
  });

  const legacyTools = [
    "walidator_cytowan.py",
    "extract_api_verification_log.py",
    "export_gate.py"
  ];
  const legacyToolPresence = Object.fromEntries(
    legacyTools.map((name) => [
      name,
      fs.existsSync(path.join(lexRoot, "shared", "tools", name))
    ])
  );

  const pass =
    positive.result === "PASS" &&
    negative.result === "BLOCKED" &&
    positive.documentHash?.length === 64;

  process.stdout.write(
    JSON.stringify(
      {
        gate: "G10_EXPORT_GATE",
        result: pass ? "PASS" : "BLOCKED",
        positive: {
          result: positive.result,
          documentHash: positive.documentHash,
          audit: positive.auditCompleteness?.result
        },
        negativeUnsupportedReference: negative.result,
        legacyPythonTools: legacyToolPresence,
        compatibilityMode: "RUNTIME_NATIVE_NEUTRAL_LOG",
        note:
          "README documents legacy Python export tools, but the current corpus contains only shared/tools/README.md. Runtime-native G10 preserves the documented neutral verification-log contract."
      },
      null,
      2
    ) + "\n"
  );

  if (!pass) process.exitCode = 1;
}

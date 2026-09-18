import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createDeterministicWorkflowPlan,
  evaluateDeterministicWorkflowReads
} from "./deterministic-workflow.js";
import { LexSkillRegistry } from "./registry.js";

const roots: string[] = [];

const simpleResources = [
  "shared/NAZEWNICTWO-STRON.md",
  "pisma-proste-v2/references/M1-zasady.md",
  "pisma-proste-v2/references/M2-intake.md",
  "pisma-proste-v2/references/M4-struktura.md",
  "pisma-proste-v2/references/M8-checklista.md",
  "shared/HYBRID-VALIDATION.md",
  "pisma-proste-v2/references/M9-format.md"
];

const processResources = [
  "pisma-procesowe-v3/references/AUTOMAT-STANOW.md",
  "shared/CP-GATE.md",
  "shared/MOD-STEP-TRACKER.md",
  "pisma-procesowe-v3/references/SELF-CHECK-PISMA.md"
];

const courtResources = [
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/PRAWO-HARDGATE.md",
  "analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md"
];

const evidenceResources = [
  "shared/PRAWO-HARDGATE.md",
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/MOD-STEP-TRACKER.md",
  "shared/DOMAIN-LOCK.md",
  "shared/RATE-COMPLETENESS.md"
];

const statuteResources = [
  "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/HIERARCHIA-ZRODEL.md",
  "shared/SELF-CHECK-ANTY-FASADA.md"
];

function writeFile(root: string, relative: string): void {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `fixture:${relative}\n`);
}

function fixture(): LexSkillRegistry {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-g39h-")
  );
  roots.push(root);

  for (const skill of [
    "pisma-proste-v2",
    "pisma-procesowe-v3",
    "analiza-sadowa-v6",
    "analizator-dowodow-v3",
    "analizator-przepisow-v2"
  ]) {
    writeFile(
      root,
      `${skill}/SKILL.md`
    );
    fs.writeFileSync(
      path.join(root, skill, "SKILL.md"),
      [
        "---",
        `name: ${skill}`,
        'version: "test"',
        `type: ${["analiza-sadowa-v6", "analizator-dowodow-v3", "analizator-przepisow-v2"].includes(skill) ? "executive-analiza" : "executive-pisma"}`,
        "---",
        "",
        "# Fixture"
      ].join("\n")
    );
  }

  for (const resource of [
    ...simpleResources,
    ...processResources,
    ...courtResources,
    ...evidenceResources,
    ...statuteResources
  ]) {
    writeFile(root, resource);
  }

  const registry = new LexSkillRegistry(root);
  expect(registry.scan()).toEqual([]);
  return registry;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true
    });
  }
});

describe("deterministic legal workflow", () => {
  it("selects the simple-letter workflow and verifies actual resource reads", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "pisma-proste-v2"
    );

    expect(plan.id).toBe("SIMPLE_LETTER_V1");
    expect(plan.requiredFreshResources)
      .toEqual(simpleResources);

    const report = evaluateDeterministicWorkflowReads(
      plan,
      simpleResources.map((target) => ({
        tool: "read_legal_resource",
        target,
        decision: "ALLOW" as const
      }))
    );
    expect(report.result).toBe("PASS");
    expect(report.missing).toEqual([]);
  });

  it("fails closed when one mandatory fresh read is absent", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "pisma-proste-v2"
    );
    const report = evaluateDeterministicWorkflowReads(
      plan,
      simpleResources.slice(0, -1).map((target) => ({
        tool: "read_legal_resource",
        target,
        decision: "ALLOW" as const
      }))
    );

    expect(report.result).toBe("BLOCKED");
    expect(report.missing).toEqual([
      "pisma-proste-v2/references/M9-format.md"
    ]);
  });

  it("uses the process workflow when process pleading controls the turn", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "pisma-procesowe-v3"
    );

    expect(plan.id).toBe("PROCESS_PLEADING_V1");
    expect(plan.escalatedFromSimpleLetter).toBe(false);
    expect(plan.requiredFreshResources)
      .toEqual(processResources);
  });

  it("uses the court-analysis workflow and requires fresh evidence/law verification resources", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "analiza-sadowa-v6"
    );

    expect(plan.id).toBe("COURT_ANALYSIS_V1");
    expect(plan.requiredFreshResources)
      .toEqual(courtResources);

    const report =
      evaluateDeterministicWorkflowReads(
        plan,
        courtResources.map((target) => ({
          tool: "read_legal_resource",
          target,
          decision: "ALLOW" as const
        }))
      );
    expect(report.result).toBe("PASS");
    expect(report.missing).toEqual([]);
  });

  it("uses the evidence-analysis workflow with only always-on deterministic gates", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "analizator-dowodow-v3"
    );

    expect(plan.id).toBe("EVIDENCE_ANALYSIS_V1");
    expect(plan.requiredFreshResources)
      .toEqual(evidenceResources);

    const report = evaluateDeterministicWorkflowReads(
      plan,
      evidenceResources.map((target) => ({
        tool: "read_legal_resource",
        target,
        decision: "ALLOW" as const
      }))
    );
    expect(report.result).toBe("PASS");
  });

  it("uses the statute-analysis workflow and requires source-hierarchy/freshness gates", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      "analizator-przepisow-v2"
    );

    expect(plan.id).toBe("STATUTE_ANALYSIS_V1");
    expect(plan.requiredFreshResources)
      .toEqual(statuteResources);

    const report = evaluateDeterministicWorkflowReads(
      plan,
      statuteResources.slice(0, -1).map((target) => ({
        tool: "read_legal_resource",
        target,
        decision: "ALLOW" as const
      }))
    );
    expect(report.result).toBe("BLOCKED");
    expect(report.missing).toEqual([
      "shared/SELF-CHECK-ANTY-FASADA.md"
    ]);
  });

  it("blocks preflight when a required process resource is missing", () => {
    const registry = fixture();
    const missing = path.join(
      registry.root,
      "shared",
      "CP-GATE.md"
    );
    fs.rmSync(missing);

    expect(() =>
      createDeterministicWorkflowPlan(
        registry,
        "pisma-procesowe-v3"
      )
    ).toThrow(
      "DETERMINISTIC_WORKFLOW_RESOURCE_MISSING:shared/CP-GATE.md"
    );
  });

  it("keeps ordinary legal analysis compatible with the deterministic lifecycle", () => {
    const registry = fixture();
    const plan = createDeterministicWorkflowPlan(
      registry,
      null
    );
    expect(plan.id).toBe("LEGAL_QUERY_V1");
    expect(plan.requiredFreshResources).toEqual([]);
    expect(
      evaluateDeterministicWorkflowReads(
        plan,
        []
      ).result
    ).toBe("PASS");
  });
});

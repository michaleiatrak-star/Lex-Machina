import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createDeterministicWorkflowPlan,
  evaluateDeterministicWorkflowOutput,
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

const contractResources = [
  "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-STEP-TRACKER.md"
];

const chronologyResources = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md",
  "chronologia-sprawy-v1/references/sprzecznosci-dat.md",
  "shared/MOD-OS-CZASU-PRZESLANEK.md"
];

const caseLawResources = [
  "shared/MCP-INTEGRACJA.md",
  "shared/SYGNATURY.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md"
];

const witnessResources = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/MOD-STEP-TRACKER.md",
  "przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md"
];

const clientReportResources = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "raport-klienta-v1/references/jezyk-klienta.md",
  "raport-klienta-v1/references/BLUEPRINT-SCHEMA.md"
];

const situationReportResources = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-WIDGET-IO.md"
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
    "analizator-przepisow-v2",
    "analizator-umow-v1",
    "chronologia-sprawy-v1",
    "orzeczenia-sadowe-v2",
    "przesluchanie-swiadkow-v2-min90",
    "raport-klienta-v1",
    "raport-sytuacyjny-v2"
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
        `type: ${["analiza-sadowa-v6", "analizator-dowodow-v3", "analizator-przepisow-v2", "analizator-umow-v1", "chronologia-sprawy-v1", "orzeczenia-sadowe-v2", "przesluchanie-swiadkow-v2-min90"].includes(skill) ? "executive-analiza" : "ux-raport"}`,
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
    ...statuteResources,
    ...contractResources,
    ...chronologyResources,
    ...caseLawResources,
    ...witnessResources,
    ...clientReportResources,
    ...situationReportResources
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

  it(
    "accepts an explicit simple-letter intake gap without pretending the letter is ready",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-proste-v2"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "📋 DANE DO UZUPEŁNIENIA",
            "Proszę podać nazwę sądu, strony i datę doręczenia."
          ].join("\n")
        );

      expect(report.result)
        .toBe("PASS");
      expect(report.mode)
        .toBe(
          "INTAKE_REQUIRED"
        );
      expect(report.missing)
        .toEqual([]);
    }
  );

  it(
    "blocks an intake-only response that names no concrete missing data",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-proste-v2"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          "📋 DANE DO UZUPEŁNIENIA"
        );

      expect(report.result)
        .toBe("BLOCKED");
      expect(report.mode)
        .toBe("INTAKE_REQUIRED");
      expect(report.missing)
        .toContain(
          "KONKRETNA LISTA BRAKUJĄCYCH DANYCH"
        );
    }
  );

  it(
    "blocks orphaned ready-letter sections in an intake-only response",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-proste-v2"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "📋 DANE DO UZUPEŁNIENIA",
            "Proszę podać adres strony przeciwnej.",
            "💡 UWAGI PRAKTYCZNE",
            "Zachowaj dokumenty."
          ].join("\n")
        );

      expect(report.result)
        .toBe("BLOCKED");
      expect(report.mode)
        .toBe("INTAKE_REQUIRED");
      expect(report.orderValid)
        .toBe(false);
      expect(report.missing)
        .toContain(
          "BRAK SEKCJI GOTOWEGO PISMA"
        );
    }
  );

  it(
    "accepts a complete simple-letter M9 presentation contract",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-proste-v2"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "════════ TREŚĆ PISMA ════════",
            "WEZWANIE DO ZAPŁATY",
            "Treść.",
            "💡 UWAGI PRAKTYCZNE",
            "Zachowaj dowód nadania.",
            "📅 CO DALEJ",
            "Po doręczeniu odczekaj wskazany termin.",
            "📋 HYBRID-VALIDATION",
            "Pismo zawiera ⬛ [0] pól do uzupełnienia."
          ].join("\n")
        );

      expect(report.result)
        .toBe("PASS");
      expect(report.mode)
        .toBe(
          "READY_ARTIFACT"
        );
      expect(report.orderValid)
        .toBe(true);
      expect(report.missing)
        .toEqual([]);
    }
  );

  it(
    "blocks a simple-letter artifact that omits or reorders mandatory M9 sections",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-proste-v2"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "📋 HYBRID-VALIDATION",
            "Pismo zawiera ⬛ [0] pól do uzupełnienia.",
            "════════ TREŚĆ PISMA ════════",
            "Treść.",
            "📅 CO DALEJ",
            "Krok."
          ].join("\n")
        );

      expect(report.result)
        .toBe("BLOCKED");
      expect(report.mode)
        .toBe(
          "READY_ARTIFACT"
        );
      expect(report.orderValid)
        .toBe(false);
      expect(report.missing)
        .toContain(
          "UWAGI PRAKTYCZNE"
        );
    }
  );

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

  it(
    "allows an intermediate process checkpoint without a final-document contract",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-procesowe-v3"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          "RAPORT W1\nAnaliza faktów i dowodów. Pismo pozostaje projektem.",
          {
            processCheckpoint:
              "CP-W1"
          }
        );

      expect(report.result)
        .toBe("PASS");
      expect(report.mode)
        .toBe(
          "PROCESS_CHECKPOINT"
        );
      expect(report.missing)
        .toEqual([]);
    }
  );

  it(
    "blocks a premature process-final status before CP-PEER",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-procesowe-v3"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          "STATUS PISMA: ✅ FINAL — GOTOWE DO ZŁOŻENIA",
          {
            processCheckpoint:
              "CP-AUDYT"
          }
        );

      expect(report.result)
        .toBe("BLOCKED");
      expect(report.mode)
        .toBe(
          "PROCESS_CHECKPOINT"
        );
      expect(report.missing)
        .toContain(
          "CP-PEER_REQUIRED_FOR_FINAL_STATUS"
        );
    }
  );

  it(
    "requires the full process-final presentation package at CP-PEER",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "pisma-procesowe-v3"
        );

      const valid =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "━━━━━━━━ RAPORT W3 ━━━━━━━━",
            "STATUS PISMA: GOTOWE",
            "Treść pisma finalnego.",
            "⚖️ UWAGI REDAKCYJNE PRZED ZŁOŻENIEM:",
            "Brak kwestii krytycznych.",
            "REJESTR KROKÓW",
            "CP-PEER: ✅ WYKONANY"
          ].join("\n"),
          {
            processCheckpoint:
              "CP-PEER"
          }
        );
      expect(valid.result)
        .toBe("PASS");
      expect(valid.mode)
        .toBe("PROCESS_FINAL");
      expect(valid.orderValid)
        .toBe(true);

      const invalid =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "REJESTR KROKÓW",
            "RAPORT W3",
            "STATUS PISMA: GOTOWE"
          ].join("\n"),
          {
            processCheckpoint:
              "CP-PEER"
          }
        );
      expect(invalid.result)
        .toBe("BLOCKED");
      expect(invalid.missing)
        .toContain(
          "UWAGI REDAKCYJNE PRZED ZŁOŻENIEM"
        );
      expect(invalid.orderValid)
        .toBe(false);
    }
  );

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

  it(
    "does not require the final court report during earlier court-analysis checkpoints",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "analiza-sadowa-v6"
        );
      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          "PRZEJŚCIE III — RAPORT ADVERSARIALNY\nWeryfikacja pierwsza.",
          {
            courtCheckpoint:
              "FIRST_VERIFICATION_COMPLETE"
          }
        );

      expect(report.result)
        .toBe("PASS");
      expect(report.mode)
        .toBe("COURT_CHECKPOINT");
      expect(report.missing)
        .toEqual([]);
    }
  );

  it(
    "requires the complete court-analysis final report at FINAL_REPORT_PRESENTED",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "analiza-sadowa-v6"
        );
      const valid =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "RAPORT ANALITYCZNY — sprawa testowa",
            "EXECUTIVE SUMMARY",
            "PRZEJŚCIE I — MAPA FAKTYCZNA",
            "PRZEJŚCIE II — MACIERZ FAKT-NORMA",
            "PRZEJŚCIE III — RAPORT ADVERSARIALNY",
            "PRZEJŚCIE IV — AUTOKOREKTA",
            "§1. KWALIFIKACJA PRAWNA I ZNAMIONA",
            "§2. ORZECZNICTWO",
            "§3. STRONA PODMIOTOWA",
            "§4. OCENA MATERIAŁU DOWODOWEGO",
            "§5. SŁABOŚCI STRON",
            "§6. TEST IN DUBIO",
            "§7. SYGNAŁY PROCEDURALNE",
            "§8. MODUŁY SPECJALISTYCZNE",
            "§9. PREDYKCJA ROZSTRZYGNIĘCIA",
            "§10. REKOMENDACJE PROCESOWE",
            "§11. AUTOKOREKTA"
          ].join("\n"),
          {
            courtCheckpoint:
              "FINAL_REPORT_PRESENTED"
          }
        );

      expect(valid.result)
        .toBe("PASS");
      expect(valid.mode)
        .toBe("COURT_FINAL");
      expect(valid.orderValid)
        .toBe(true);

      const invalid =
        evaluateDeterministicWorkflowOutput(
          plan,
          [
            "RAPORT ANALITYCZNY",
            "EXECUTIVE SUMMARY",
            "PRZEJŚCIE I",
            "§1. KWALIFIKACJA",
            "§11. AUTOKOREKTA"
          ].join("\n"),
          {
            courtCheckpoint:
              "FINAL_REPORT_PRESENTED"
          }
        );

      expect(invalid.result)
        .toBe("BLOCKED");
      expect(invalid.missing)
        .toContain("§10.");
      expect(invalid.orderValid)
        .toBe(false);
    }
  );

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

  it(
    "allows a narrow statute answer without pretending a full Moduł 4 report",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "analizator-przepisow-v2"
        );

      const report =
        evaluateDeterministicWorkflowOutput(
          plan,
          "Stan prawny na 2026-09-18. Krótkie wyjaśnienie przepisu bez pełnego raportu."
        );

      expect(report.result)
        .toBe("PASS");
      expect(report.mode)
        .toBe("NOT_APPLICABLE");
    }
  );

  it(
    "requires the canonical statute-analysis Moduł 4 structure when a full report is claimed",
    () => {
      const registry = fixture();
      const plan =
        createDeterministicWorkflowPlan(
          registry,
          "analizator-przepisow-v2"
        );

      const complete = [
        "RAPORT ANALIZY — art. testowy",
        "Stan prawny na: 2026-09-18",
        "1. PRZEPIS",
        "2. STRUKTURA PRZESŁANEK",
        "3. WYNIK: ? NIEJEDNOZNACZNY",
        "4. PRZESŁANKI — PODSUMOWANIE",
        "5. UZASADNIENIE MERYTORYCZNE",
        "6. LINIA ORZECZNICZA (skrót)",
        "7. RYZYKA I ZASTRZEŻENIA",
        "DRZEWO-LIMIT — wynik literalny nie zastępuje wykładni orzeczniczej.",
        "8. REKOMENDACJE",
        "9. POWIĄZANE PRZEPISY",
        "10. ŹRÓDŁA"
      ].join("\n");

      const pass =
        evaluateDeterministicWorkflowOutput(
          plan,
          complete
        );
      expect(pass.result)
        .toBe("PASS");
      expect(pass.mode)
        .toBe("STATUTE_FINAL");

      const blocked =
        evaluateDeterministicWorkflowOutput(
          plan,
          complete
            .replace(
              "DRZEWO-LIMIT — wynik literalny nie zastępuje wykładni orzeczniczej.\n",
              ""
            )
            .replace(
              "9. POWIĄZANE PRZEPISY\n10. ŹRÓDŁA",
              "10. ŹRÓDŁA\n9. POWIĄZANE PRZEPISY"
            )
        );

      expect(blocked.result)
        .toBe("BLOCKED");
      expect(blocked.missing)
        .toContain("DRZEWO-LIMIT");
      expect(blocked.orderValid)
        .toBe(false);
    }
  );

  it.each([
    ["analizator-umow-v1", "CONTRACT_ANALYSIS_V1", contractResources],
    ["chronologia-sprawy-v1", "CHRONOLOGY_V1", chronologyResources],
    ["orzeczenia-sadowe-v2", "CASE_LAW_V1", caseLawResources],
    ["przesluchanie-swiadkow-v2-min90", "WITNESS_QUESTIONING_V1", witnessResources],
    ["raport-klienta-v1", "CLIENT_REPORT_V1", clientReportResources],
    ["raport-sytuacyjny-v2", "SITUATION_REPORT_V1", situationReportResources]
  ] as const)(
    "uses deterministic preflight %s → %s and requires every fresh read",
    (skill, workflow, resources) => {
      const registry = fixture();
      const plan = createDeterministicWorkflowPlan(
        registry,
        skill
      );

      expect(plan.id).toBe(workflow);
      expect(plan.requiredFreshResources)
        .toEqual(resources);

      const pass =
        evaluateDeterministicWorkflowReads(
          plan,
          resources.map((target) => ({
            tool: "read_legal_resource",
            target,
            decision: "ALLOW" as const
          }))
        );
      expect(pass.result).toBe("PASS");

      const blocked =
        evaluateDeterministicWorkflowReads(
          plan,
          resources.slice(0, -1).map((target) => ({
            tool: "read_legal_resource",
            target,
            decision: "ALLOW" as const
          }))
        );
      expect(blocked.result)
        .toBe("BLOCKED");
      expect(blocked.missing)
        .toEqual([
          resources.at(-1)
        ]);
    }
  );

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

import fs from "node:fs";
import type { LegalCorpusAuditEvent } from "./legal-corpus-tool-runtime.js";
import type { LexSkillRegistry } from "./registry.js";
import type { ProcessPleadingCheckpoint } from "./process-pleading-state.js";
import type { CourtAnalysisCheckpoint } from "./court-analysis-state.js";

export type DeterministicWorkflowId =
  | "LEGAL_QUERY_V1"
  | "LEGAL_GUIDE_V1"
  | "SIMPLE_LETTER_V1"
  | "PROCESS_PLEADING_V1"
  | "COURT_ANALYSIS_V1"
  | "EVIDENCE_ANALYSIS_V1"
  | "STATUTE_ANALYSIS_V1"
  | "CONTRACT_ANALYSIS_V1"
  | "CHRONOLOGY_V1"
  | "CASE_LAW_V1"
  | "WITNESS_QUESTIONING_V1"
  | "CLIENT_REPORT_V1"
  | "SITUATION_REPORT_V1";

export const DETERMINISTIC_WORKFLOW_EXECUTION_SKILLS = [
  "przewodnik-prawny-v2",
  "pisma-procesowe-v3",
  "pisma-proste-v2",
  "analiza-sadowa-v6",
  "analizator-dowodow-v3",
  "analizator-przepisow-v2",
  "analizator-umow-v1",
  "chronologia-sprawy-v1",
  "orzeczenia-sadowe-v2",
  "przesluchanie-swiadkow-v2-min90",
  "raport-klienta-v1",
  "raport-sytuacyjny-v2"
] as const;

export type DeterministicWorkflowExecutionSkill =
  typeof DETERMINISTIC_WORKFLOW_EXECUTION_SKILLS[number];

const DETERMINISTIC_WORKFLOW_EXECUTION_SKILL_SET =
  new Set<string>(
    DETERMINISTIC_WORKFLOW_EXECUTION_SKILLS
  );

export function supportsDeterministicWorkflow(
  skill: string
): skill is DeterministicWorkflowExecutionSkill {
  return DETERMINISTIC_WORKFLOW_EXECUTION_SKILL_SET.has(
    skill
  );
}

export type DeterministicWorkflowPlan = {
  id: DeterministicWorkflowId;
  executionSkill: string | null;
  escalatedFromSimpleLetter: boolean;
  requiredFreshResources: string[];
  semanticContextResources: string[];
  phases: readonly [
    "PREFLIGHT",
    "SEMANTIC_EXECUTION",
    "FINALIZATION"
  ];
};

export type DeterministicWorkflowReadReport = {
  workflow: DeterministicWorkflowId;
  required: string[];
  observed: string[];
  missing: string[];
  result: "PASS" | "BLOCKED";
};

export type DeterministicWorkflowOutputReport = {
  workflow: DeterministicWorkflowId;
  mode:
    | "NOT_APPLICABLE"
    | "INTAKE_REQUIRED"
    | "READY_ARTIFACT"
    | "PROCESS_CHECKPOINT"
    | "PROCESS_FINAL"
    | "COURT_CHECKPOINT"
    | "COURT_FINAL"
    | "EVIDENCE_CHECKPOINT"
    | "EVIDENCE_FINAL"
    | "CONTRACT_FINAL"
    | "CONTRACT_LITE"
    | "STATUTE_FINAL"
    | "CASE_LAW_FINAL"
    | "CHRONOLOGY_FINAL"
    | "WITNESS_CHECKPOINT"
    | "WITNESS_W3_FINAL";
  required: string[];
  observed: string[];
  missing: string[];
  orderValid: boolean;
  result: "PASS" | "BLOCKED";
};

const LEGAL_GUIDE_RESOURCES = [
  "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/DOMAIN-LOCK.md",
  "shared/RATE-COMPLETENESS.md",
  "przewodnik-prawny-v2/references/TRYB-SUROWA-ANALIZA.md"
] as const;

const SIMPLE_LETTER_RESOURCES = [
  "shared/NAZEWNICTWO-STRON.md",
  "pisma-proste-v2/references/M1-zasady.md",
  "pisma-proste-v2/references/M2-intake.md",
  "pisma-proste-v2/references/M4-struktura.md",
  "pisma-proste-v2/references/M8-checklista.md",
  "shared/HYBRID-VALIDATION.md",
  "pisma-proste-v2/references/M9-format.md"
] as const;

const PROCESS_PLEADING_RESOURCES = [
  "pisma-procesowe-v3/references/AUTOMAT-STANOW.md",
  "shared/CP-GATE.md",
  "shared/MOD-STEP-TRACKER.md",
  "pisma-procesowe-v3/references/SELF-CHECK-PISMA.md"
] as const;

const COURT_ANALYSIS_RESOURCES = [
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/PRAWO-HARDGATE.md",
  "analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md"
] as const;

const EVIDENCE_ANALYSIS_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/MOD-STEP-TRACKER.md",
  "shared/DOMAIN-LOCK.md",
  "shared/RATE-COMPLETENESS.md"
] as const;

const STATUTE_ANALYSIS_RESOURCES = [
  "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/HIERARCHIA-ZRODEL.md",
  "shared/SELF-CHECK-ANTY-FASADA.md"
] as const;

const CONTRACT_ANALYSIS_RESOURCES = [
  "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-STEP-TRACKER.md"
] as const;

const CHRONOLOGY_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md",
  "chronologia-sprawy-v1/references/sprzecznosci-dat.md",
  "shared/MOD-OS-CZASU-PRZESLANEK.md"
] as const;

const CASE_LAW_RESOURCES = [
  "shared/MCP-INTEGRACJA.md",
  "shared/SYGNATURY.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md"
] as const;

const WITNESS_QUESTIONING_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
  "shared/MOD-STEP-TRACKER.md",
  "przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md"
] as const;

const CLIENT_REPORT_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "raport-klienta-v1/references/jezyk-klienta.md",
  "raport-klienta-v1/references/BLUEPRINT-SCHEMA.md"
] as const;

const SITUATION_REPORT_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md",
  "shared/MOD-WIDGET-IO.md"
] as const;

const SEMANTIC_CONTEXT_RESOURCES:
  Readonly<
    Partial<
      Record<
        DeterministicWorkflowId,
        readonly string[]
      >
    >
  > = {
    COURT_ANALYSIS_V1: [
      "analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md"
    ],
    CHRONOLOGY_V1: [
      "chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md",
      "chronologia-sprawy-v1/references/sprzecznosci-dat.md"
    ],
    WITNESS_QUESTIONING_V1: [
      "przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md"
    ],
    CLIENT_REPORT_V1: [
      "raport-klienta-v1/references/jezyk-klienta.md"
    ]
  };

const SIMPLE_LETTER_READY_MARKERS = [
  "TREŚĆ PISMA",
  "UWAGI PRAKTYCZNE",
  "CO DALEJ",
  "HYBRID-VALIDATION"
] as const;

const PROCESS_PLEADING_FINAL_MARKERS = [
  "RAPORT W3",
  "STATUS PISMA",
  "UWAGI REDAKCYJNE PRZED ZŁOŻENIEM",
  "REJESTR KROKÓW"
] as const;

const COURT_ANALYSIS_FINAL_MARKERS = [
  "RAPORT ANALITYCZNY",
  "EXECUTIVE SUMMARY",
  "PRZEJŚCIE I",
  "PRZEJŚCIE II",
  "PRZEJŚCIE III",
  "PRZEJŚCIE IV",
  "§1.",
  "§2.",
  "§3.",
  "§4.",
  "§5.",
  "§6.",
  "§7.",
  "§8.",
  "§9.",
  "§10.",
  "§11."
] as const;

const EVIDENCE_ANALYSIS_FINAL_MARKERS = [
  "RAPORT DOWODOWY",
  "POZYCJA PROCESOWA",
  "HIERARCHIA:",
  "WALIDACJA:",
  "POKRYCIE:",
  "DOWODY DO PISMA",
  "TERMINY:",
  "SPRZECZNOŚCI",
  "REKOMENDACJE:"
] as const;

const CONTRACT_ANALYSIS_FULL_MARKERS = [
  "RAPORT ANALIZY UMOWY V1",
  "## 1. IDENTYFIKACJA",
  "## 2. BALANS DOKUMENTU",
  "## 3. KLAUZULE NIEDOZWOLONE",
  "## 4. KLAUZULE NIEZGODNE Z PRAWEM",
  "## 5. KLAUZULE RYZYKOWNE",
  "## 6. EKSPOZYCJA FINANSOWA",
  "## 7. ALERTY RODO",
  "## 8. KLAUZULE KORZYSTNE DLA STRONY CHRONIONEJ",
  "## 9. BRAKUJĄCE KLAUZULE",
  "## 10. REKOMENDACJE ZMIAN",
  "## 11. PLAN DZIAŁANIA PRZED PODPISANIEM",
  "## 12. OCENA OGÓLNA",
  "## 13. DISCLAIMER"
] as const;

const CONTRACT_ANALYSIS_LITE_MARKERS = [
  "RAPORT ANALIZY UMOWY — LITE",
  "## 1. IDENTYFIKACJA + FORMA",
  "## 2. BALANS:",
  "## 3. KLAUZULE KRYTYCZNE I WYSOKIEGO RYZYKA",
  "## 4. EKSPOZYCJA",
  "## 5. BRAKUJĄCE KLAUZULE",
  "## 6. OCENA OGÓLNA + PLAN 3 KROKÓW",
  "## 7. DISCLAIMER"
] as const;

const STATUTE_ANALYSIS_FINAL_MARKERS = [
  "RAPORT ANALIZY",
  "STAN PRAWNY NA",
  "1. PRZEPIS",
  "2. STRUKTURA PRZESŁANEK",
  "3. WYNIK",
  "4. PRZESŁANKI",
  "5. UZASADNIENIE MERYTORYCZNE",
  "6. LINIA ORZECZNICZA",
  "7. RYZYKA I ZASTRZEŻENIA",
  "DRZEWO-LIMIT",
  "8. REKOMENDACJE",
  "9. POWIĄZANE PRZEPISY",
  "10. ŹRÓDŁA"
] as const;

const CASE_LAW_FINAL_MARKERS = [
  "RAPORT ORZECZEŃ",
  "WSKAŹNIK POKRYCIA PRZESŁANEK",
  "PLAN MINIMUM",
  "ORZECZENIA WSPIERAJĄCE TEZĘ",
  "LINIA PRZECIWNA"
] as const;

const CHRONOLOGY_FINAL_MARKERS = [
  "CHRONOLOGIA SPRAWY",
  "INWENTARYZACJA DOKUMENTÓW",
  "OŚ CZASU — WĄTEK",
  "OŚ CZASU — WIDOK ZBIORCZY",
  "FAKTY BEZSPORNE",
  "INDEKS SPRZECZNOŚCI",
  "ZDARZENIA WYDEDUKOWANE — REJESTR",
  "LUKI CZASOWE",
  "ZDARZENIA NIEUSTALONE CHRONOLOGICZNIE",
  "REKOMENDACJE DO PISMA"
] as const;

const WITNESS_W3_FINAL_MARKERS = [
  "BLOK A",
  "A-1",
  "A-2",
  "A-3",
  "A-4",
  "BLOK B",
  "BLOK C",
  "BLOK D",
  "MACIERZ FINALNA",
  "SCORING FINALNY",
  "REKOMENDACJE KOŃCOWE"
] as const;




function assertReadableResource(
  registry: LexSkillRegistry,
  skillName: string,
  semanticPath: string
): void {
  const resolved = registry.resolveResource(
    skillName,
    semanticPath
  );
  if (!resolved || !fs.statSync(resolved).isFile()) {
    throw new Error(
      `DETERMINISTIC_WORKFLOW_RESOURCE_MISSING:${semanticPath}`
    );
  }
  const stat = fs.statSync(resolved);
  if (stat.size < 1) {
    throw new Error(
      `DETERMINISTIC_WORKFLOW_RESOURCE_EMPTY:${semanticPath}`
    );
  }
}

export function createDeterministicWorkflowPlan(
  registry: LexSkillRegistry,
  workflowExecutionSkill: string | null
): DeterministicWorkflowPlan {
  if (
    workflowExecutionSkill &&
    !supportsDeterministicWorkflow(
      workflowExecutionSkill
    )
  ) {
    throw new Error(
      `DETERMINISTIC_WORKFLOW_SKILL_UNSUPPORTED:${workflowExecutionSkill}`
    );
  }

  const hasGuide =
    workflowExecutionSkill === "przewodnik-prawny-v2";
  const hasProcess =
    workflowExecutionSkill === "pisma-procesowe-v3";
  const hasSimple =
    workflowExecutionSkill === "pisma-proste-v2";
  const hasCourtAnalysis =
    workflowExecutionSkill === "analiza-sadowa-v6";
  const hasEvidenceAnalysis =
    workflowExecutionSkill === "analizator-dowodow-v3";
  const hasStatuteAnalysis =
    workflowExecutionSkill === "analizator-przepisow-v2";
  const hasContractAnalysis =
    workflowExecutionSkill === "analizator-umow-v1";
  const hasChronology =
    workflowExecutionSkill === "chronologia-sprawy-v1";
  const hasCaseLaw =
    workflowExecutionSkill === "orzeczenia-sadowe-v2";
  const hasWitnessQuestioning =
    workflowExecutionSkill === "przesluchanie-swiadkow-v2-min90";
  const hasClientReport =
    workflowExecutionSkill === "raport-klienta-v1";
  const hasSituationReport =
    workflowExecutionSkill === "raport-sytuacyjny-v2";

  const executionSkill = hasGuide
    ? "przewodnik-prawny-v2"
    : hasProcess
      ? "pisma-procesowe-v3"
    : hasSimple
      ? "pisma-proste-v2"
      : hasCourtAnalysis
        ? "analiza-sadowa-v6"
        : hasEvidenceAnalysis
          ? "analizator-dowodow-v3"
          : hasStatuteAnalysis
          ? "analizator-przepisow-v2"
          : hasContractAnalysis
            ? "analizator-umow-v1"
            : hasChronology
              ? "chronologia-sprawy-v1"
              : hasCaseLaw
                ? "orzeczenia-sadowe-v2"
                : hasWitnessQuestioning
                  ? "przesluchanie-swiadkow-v2-min90"
                  : hasClientReport
                    ? "raport-klienta-v1"
                    : hasSituationReport
                      ? "raport-sytuacyjny-v2"
                      : workflowExecutionSkill;

  const id: DeterministicWorkflowId = hasGuide
    ? "LEGAL_GUIDE_V1"
    : hasProcess
      ? "PROCESS_PLEADING_V1"
    : hasSimple
      ? "SIMPLE_LETTER_V1"
      : hasCourtAnalysis
        ? "COURT_ANALYSIS_V1"
        : hasEvidenceAnalysis
          ? "EVIDENCE_ANALYSIS_V1"
          : hasStatuteAnalysis
            ? "STATUTE_ANALYSIS_V1"
            : hasContractAnalysis
              ? "CONTRACT_ANALYSIS_V1"
              : hasChronology
                ? "CHRONOLOGY_V1"
                : hasCaseLaw
                  ? "CASE_LAW_V1"
                  : hasWitnessQuestioning
                    ? "WITNESS_QUESTIONING_V1"
                    : hasClientReport
                      ? "CLIENT_REPORT_V1"
                      : hasSituationReport
                        ? "SITUATION_REPORT_V1"
                        : "LEGAL_QUERY_V1";

  const requiredFreshResources = hasGuide
    ? [...LEGAL_GUIDE_RESOURCES]
    : hasProcess
      ? [...PROCESS_PLEADING_RESOURCES]
    : hasSimple
      ? [...SIMPLE_LETTER_RESOURCES]
      : hasCourtAnalysis
        ? [...COURT_ANALYSIS_RESOURCES]
        : hasEvidenceAnalysis
          ? [...EVIDENCE_ANALYSIS_RESOURCES]
          : hasStatuteAnalysis
            ? [...STATUTE_ANALYSIS_RESOURCES]
            : hasContractAnalysis
              ? [...CONTRACT_ANALYSIS_RESOURCES]
              : hasChronology
                ? [...CHRONOLOGY_RESOURCES]
                : hasCaseLaw
                  ? [...CASE_LAW_RESOURCES]
                  : hasWitnessQuestioning
                    ? [...WITNESS_QUESTIONING_RESOURCES]
                    : hasClientReport
                      ? [...CLIENT_REPORT_RESOURCES]
                      : hasSituationReport
                        ? [...SITUATION_REPORT_RESOURCES]
                        : [];

  if (executionSkill) {
    const skill = registry.get(executionSkill);
    if (!skill) {
      throw new Error(
        `DETERMINISTIC_WORKFLOW_SKILL_MISSING:${executionSkill}`
      );
    }
    for (const resource of requiredFreshResources) {
      assertReadableResource(
        registry,
        executionSkill,
        resource
      );
    }
  }

  const requiredResourceSet =
    new Set<string>(
      requiredFreshResources
    );
  const semanticContextResources = [
    ...(
      SEMANTIC_CONTEXT_RESOURCES[
        id
      ] ?? []
    )
  ].filter(
    (resource) =>
      requiredResourceSet.has(
        resource
      )
  );

  return {
    id,
    executionSkill,
    escalatedFromSimpleLetter: false,
    requiredFreshResources,
    semanticContextResources,
    phases: [
      "PREFLIGHT",
      "SEMANTIC_EXECUTION",
      "FINALIZATION"
    ]
  };
}

export function deterministicWorkflowPrompt(
  plan: DeterministicWorkflowPlan
): string {
  if (plan.requiredFreshResources.length === 0) {
    return [
      "# DETERMINISTIC RUNTIME WORKFLOW",
      `Workflow: ${plan.id}.`,
      "The runtime controls routing, source/citation gates and finalization order.",
      "Do not claim that a runtime gate passed unless the corresponding tool action actually occurred."
    ].join("\n");
  }

  return [
    "# DETERMINISTIC RUNTIME WORKFLOW",
    `Workflow: ${plan.id}.`,
    "The runtime enforces PREFLIGHT → SEMANTIC_EXECUTION → FINALIZATION.",
    "Mandatory workflow resources are pre-read by deterministic runtime before provider execution.",
    "Do not spend tool calls reopening the resources listed below unless a separate semantic need requires a different resource or pagination range.",
    ...plan.requiredFreshResources.map(
      (resource) => `- runtime-read: ${resource}`
    ),
    "Only resources explicitly injected under RUNTIME-PRELOADED SEMANTIC CONTEXT should be treated as semantic reading material. The remaining required resources are mechanical policy enforced by code.",
    ...(plan.id === "SIMPLE_LETTER_V1"
      ? [
          "SIMPLE_LETTER_V1 output contract is runtime-enforced.",
          "If critical intake data are missing, present an explicit DANE DO UZUPEŁNIENIA section and do not pretend a complete letter is ready.",
          "Otherwise present the required sections in this order: TREŚĆ PISMA → UWAGI PRAKTYCZNE → CO DALEJ → HYBRID-VALIDATION.",
          "The HYBRID-VALIDATION section must include the final count statement 'Pismo zawiera ... pól do uzupełnienia.'."
        ]
      : []),
    ...(plan.id === "PROCESS_PLEADING_V1"
      ? [
          "PROCESS_PLEADING_V1 output state is runtime-enforced.",
          "Do not claim STATUS PISMA: GOTOWE before the final CP-PEER checkpoint.",
          "At CP-PEER the finalization package must expose RAPORT W3 → STATUS PISMA → UWAGI REDAKCYJNE PRZED ZŁOŻENIEM → REJESTR KROKÓW."
        ]
      : []),
    ...(plan.id === "COURT_ANALYSIS_V1"
      ? [
          "COURT_ANALYSIS_V1 final-report structure is runtime-enforced only at FINAL_REPORT_PRESENTED.",
          "At that checkpoint present RAPORT ANALITYCZNY, EXECUTIVE SUMMARY, the four pass summaries, and RAPORT §1-§11 in order.",
          "Do not merge the following situational-report or process-pleading-offer checkpoints into the final-report turn."
        ]
      : []),
    ...(plan.id === "CASE_LAW_V1"
      ? [
          "CASE_LAW_V1 keeps short single-reference answers flexible.",
          "If you claim to present a full RAPORT ORZECZEŃ, the runtime requires WSKAŹNIK POKRYCIA PRZESŁANEK → PLAN MINIMUM → [A] ORZECZENIA WSPIERAJĄCE TEZĘ → [B] LINIA PRZECIWNA in that order.",
          "The BILANS section remains conditional on the directional Faza 1-D and is therefore not blindly required by this output gate."
        ]
      : []),
    ...(plan.id === "CHRONOLOGY_V1"
      ? [
          "CHRONOLOGY_V1 may return bounded intermediate chronology findings without forcing the full report.",
          "If you claim a full CHRONOLOGIA SPRAWY report, the runtime requires INWENTARYZACJA DOKUMENTÓW → OŚ CZASU — WĄTEK → OŚ CZASU — WIDOK ZBIORCZY → FAKTY BEZSPORNE → INDEKS SPRZECZNOŚCI → ZDARZENIA WYDEDUKOWANE — REJESTR → LUKI CZASOWE → ZDARZENIA NIEUSTALONE CHRONOLOGICZNIE → REKOMENDACJE DO PISMA in order."
        ]
      : []),
    ...(plan.id === "WITNESS_QUESTIONING_V1"
      ? [
          "WITNESS_QUESTIONING_V1 keeps W1/W2 and bounded question drafts flexible.",
          "If you claim the final W3 package, the runtime requires BLOK A with A-1/A-2/A-3/A-4 coverage → BLOK B → BLOK C → BLOK D (or an explicit unavailable marker) → MACIERZ FINALNA → SCORING FINALNY → REKOMENDACJE KOŃCOWE in order."
        ]
      : []),
    ...(plan.id === "EVIDENCE_ANALYSIS_V1"
      ? [
          "EVIDENCE_ANALYSIS_V1 may return bounded intermediate findings without forcing a final report.",
          "If you claim a full RAPORT DOWODOWY, the runtime requires the canonical MD6 sections in order: POZYCJA PROCESOWA → HIERARCHIA → WALIDACJA → POKRYCIE → DOWODY DO PISMA → TERMINY → SPRZECZNOŚCI → REKOMENDACJE."
        ]
      : []),
    ...(plan.id === "CONTRACT_ANALYSIS_V1"
      ? [
          "CONTRACT_ANALYSIS_V1 keeps the value-based report scale from the skill.",
          "If you claim RAPORT ANALIZY UMOWY v1, the runtime requires the canonical F.1 sections 1-13 in order.",
          "If you claim RAPORT ANALIZY UMOWY — LITE, the runtime requires the canonical F.1-LITE sections 1-7 in order.",
          "A short F.2-style answer remains flexible and is not forced into either long report schema."
        ]
      : []),
    ...(plan.id === "STATUTE_ANALYSIS_V1"
      ? [
          "STATUTE_ANALYSIS_V1 may answer a narrow question without forcing a full report.",
          "If you present a full 'RAPORT ANALIZY', the runtime requires the canonical Moduł 4 sections 1-10 in order and the DRZEWO-LIMIT warning inside the risk section."
        ]
      : []),
    ...(plan.escalatedFromSimpleLetter
      ? [
          "Both simple and process pleading skills were selected. The stricter PROCESS_PLEADING_V1 workflow controls this turn."
        ]
      : [])
  ].join("\n");
}

export function evaluateDeterministicWorkflowOutput(
  plan: DeterministicWorkflowPlan,
  text: string,
  context?: {
    processCheckpoint?:
      ProcessPleadingCheckpoint;
    courtCheckpoint?:
      CourtAnalysisCheckpoint;
    orderedCheckpoint?: string;
  }
): DeterministicWorkflowOutputReport {
  const normalized =
    text
      .normalize("NFC")
      .toLocaleUpperCase("pl");

  if (
    plan.id ===
      "PROCESS_PLEADING_V1"
  ) {
    const finalCheckpoint =
      context?.processCheckpoint ===
        "CP-PEER";

    if (!finalCheckpoint) {
      const prematureFinalStatus =
        /STATUS\s+PISMA\s*[:=]\s*(?:✅\s*)?(?:FINAL\s*[—-]\s*)?GOTOWE(?:\s+DO\s+ZŁOŻENIA)?/u
          .test(normalized);
      return {
        workflow: plan.id,
        mode:
          "PROCESS_CHECKPOINT",
        required: [],
        observed:
          prematureFinalStatus
            ? [
                "PREMATURE_FINAL_STATUS"
              ]
            : [],
        missing:
          prematureFinalStatus
            ? [
                "CP-PEER_REQUIRED_FOR_FINAL_STATUS"
              ]
            : [],
        orderValid:
          !prematureFinalStatus,
        result:
          prematureFinalStatus
            ? "BLOCKED"
            : "PASS"
      };
    }

    const required = [
      ...PROCESS_PLEADING_FINAL_MARKERS
    ];
    const observed =
      PROCESS_PLEADING_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      PROCESS_PLEADING_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      PROCESS_PLEADING_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode: "PROCESS_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "COURT_ANALYSIS_V1"
  ) {
    const finalReport =
      context?.courtCheckpoint ===
        "FINAL_REPORT_PRESENTED";

    if (!finalReport) {
      return {
        workflow: plan.id,
        mode:
          "COURT_CHECKPOINT",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...COURT_ANALYSIS_FINAL_MARKERS
    ];
    const observed =
      COURT_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      COURT_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      COURT_ANALYSIS_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode: "COURT_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "EVIDENCE_ANALYSIS_V1"
  ) {
    if (
      context?.orderedCheckpoint &&
      context.orderedCheckpoint !==
        "AD-KROK4-DASHBOARD"
    ) {
      const prematureFinal =
        normalized.includes(
          "RAPORT DOWODOWY"
        );
      return {
        workflow: plan.id,
        mode:
          "EVIDENCE_CHECKPOINT",
        required: [],
        observed:
          prematureFinal
            ? [
                "PREMATURE_FINAL_REPORT"
              ]
            : [],
        missing:
          prematureFinal
            ? [
                "AD-KROK4-DASHBOARD_REQUIRED_FOR_FINAL_REPORT"
              ]
            : [],
        orderValid:
          !prematureFinal,
        result:
          prematureFinal
            ? "BLOCKED"
            : "PASS"
      };
    }

    const claimsFullReport =
      normalized.includes(
        "RAPORT DOWODOWY"
      );

    if (!claimsFullReport) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...EVIDENCE_ANALYSIS_FINAL_MARKERS
    ];
    const observed =
      EVIDENCE_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      EVIDENCE_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      EVIDENCE_ANALYSIS_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode: "EVIDENCE_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "CONTRACT_ANALYSIS_V1"
  ) {
    const claimsLite =
      normalized.includes(
        "RAPORT ANALIZY UMOWY — LITE"
      );
    const claimsFull =
      !claimsLite &&
      normalized.includes(
        "RAPORT ANALIZY UMOWY V1"
      );

    if (!claimsFull && !claimsLite) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const markers =
      claimsLite
        ? CONTRACT_ANALYSIS_LITE_MARKERS
        : CONTRACT_ANALYSIS_FULL_MARKERS;
    const required = [
      ...markers
    ];
    const observed =
      markers.filter(
        (marker) =>
          normalized.includes(
            marker
          )
      );
    const missing =
      markers.filter(
        (marker) =>
          !normalized.includes(
            marker
          )
      );
    const positions =
      markers.map(
        (marker) =>
          normalized.indexOf(
            marker
          )
      );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode:
        claimsLite
          ? "CONTRACT_LITE"
          : "CONTRACT_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "STATUTE_ANALYSIS_V1"
  ) {
    const claimsFullReport =
      normalized.includes(
        "RAPORT ANALIZY"
      );

    if (!claimsFullReport) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...STATUTE_ANALYSIS_FINAL_MARKERS
    ];
    const observed =
      STATUTE_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      STATUTE_ANALYSIS_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      STATUTE_ANALYSIS_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode: "STATUTE_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "WITNESS_QUESTIONING_V1"
  ) {
    if (
      context?.orderedCheckpoint &&
      context.orderedCheckpoint !==
        "W3-QUESTIONS"
    ) {
      const prematureW3 =
        normalized.includes(
          "MACIERZ FINALNA"
        ) ||
        normalized.includes(
          "SCORING FINALNY"
        );
      return {
        workflow: plan.id,
        mode:
          "WITNESS_CHECKPOINT",
        required: [],
        observed:
          prematureW3
            ? [
                "PREMATURE_W3_FINAL"
              ]
            : [],
        missing:
          prematureW3
            ? [
                "W3-QUESTIONS_REQUIRED_FOR_FINAL_MATRIX"
              ]
            : [],
        orderValid:
          !prematureW3,
        result:
          prematureW3
            ? "BLOCKED"
            : "PASS"
      };
    }

    const claimsFinalW3 =
      normalized.includes(
        "ETAP W3"
      ) ||
      normalized.includes(
        "MACIERZ FINALNA"
      ) ||
      normalized.includes(
        "SCORING FINALNY"
      );

    if (!claimsFinalW3) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...WITNESS_W3_FINAL_MARKERS
    ];
    const observed =
      WITNESS_W3_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      WITNESS_W3_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      WITNESS_W3_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode:
        "WITNESS_W3_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "CHRONOLOGY_V1"
  ) {
    const claimsFullReport =
      normalized.includes(
        "CHRONOLOGIA SPRAWY"
      );

    if (!claimsFullReport) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...CHRONOLOGY_FINAL_MARKERS
    ];
    const observed =
      CHRONOLOGY_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      CHRONOLOGY_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      CHRONOLOGY_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode:
        "CHRONOLOGY_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (
    plan.id ===
      "CASE_LAW_V1"
  ) {
    const claimsFullReport =
      normalized.includes(
        "RAPORT ORZECZEŃ"
      );

    if (!claimsFullReport) {
      return {
        workflow: plan.id,
        mode:
          "NOT_APPLICABLE",
        required: [],
        observed: [],
        missing: [],
        orderValid: true,
        result: "PASS"
      };
    }

    const required = [
      ...CASE_LAW_FINAL_MARKERS
    ];
    const observed =
      CASE_LAW_FINAL_MARKERS
        .filter((marker) =>
          normalized.includes(
            marker
          )
        );
    const missing =
      CASE_LAW_FINAL_MARKERS
        .filter((marker) =>
          !normalized.includes(
            marker
          )
        );
    const positions =
      CASE_LAW_FINAL_MARKERS
        .map((marker) =>
          normalized.indexOf(
            marker
          )
        );
    const orderValid =
      missing.length === 0 &&
      positions.every(
        (position, index) =>
          index === 0 ||
          position >
            positions[index - 1]!
      );

    return {
      workflow: plan.id,
      mode: "CASE_LAW_FINAL",
      required,
      observed: [
        ...observed
      ],
      missing: [
        ...missing
      ],
      orderValid,
      result:
        missing.length === 0 &&
        orderValid
          ? "PASS"
          : "BLOCKED"
    };
  }

  if (plan.id !== "SIMPLE_LETTER_V1") {
    return {
      workflow: plan.id,
      mode: "NOT_APPLICABLE",
      required: [],
      observed: [],
      missing: [],
      orderValid: true,
      result: "PASS"
    };
  }

  const normalizedSimple = normalized;
  const intakeRequired =
    normalizedSimple.includes(
      "DANE DO UZUPEŁNIENIA"
    );
  const hasLetterBody =
    normalizedSimple.includes(
      "TREŚĆ PISMA"
    );

  if (
    intakeRequired &&
    !hasLetterBody
  ) {
    const marker =
      "DANE DO UZUPEŁNIENIA";
    const markerIndex =
      normalizedSimple.indexOf(
        marker
      );
    const intakeTail =
      markerIndex >= 0
        ? normalizedSimple.slice(
            markerIndex +
              marker.length
          )
        : "";
    const hasSpecificMissingData =
      intakeTail
        .split(/\r?\n/)
        .some((line) =>
          /[A-ZĄĆĘŁŃÓŚŹŻ0-9]{2,}/.test(
            line
          )
        );
    const partialArtifactMarkers =
      SIMPLE_LETTER_READY_MARKERS
        .filter(
          (readyMarker) =>
            readyMarker !==
              "TREŚĆ PISMA" &&
            normalizedSimple.includes(
              readyMarker
            )
        );

    const required = [
      "DANE DO UZUPEŁNIENIA",
      "KONKRETNA LISTA BRAKUJĄCYCH DANYCH",
      "BRAK SEKCJI GOTOWEGO PISMA"
    ];
    const observed = [
      "DANE DO UZUPEŁNIENIA",
      ...(hasSpecificMissingData
        ? [
            "KONKRETNA LISTA BRAKUJĄCYCH DANYCH"
          ]
        : []),
      ...(partialArtifactMarkers.length ===
      0
        ? [
            "BRAK SEKCJI GOTOWEGO PISMA"
          ]
        : [])
    ];
    const missing = [
      ...(!hasSpecificMissingData
        ? [
            "KONKRETNA LISTA BRAKUJĄCYCH DANYCH"
          ]
        : []),
      ...(partialArtifactMarkers.length >
      0
        ? [
            "BRAK SEKCJI GOTOWEGO PISMA"
          ]
        : [])
    ];

    return {
      workflow: plan.id,
      mode: "INTAKE_REQUIRED",
      required,
      observed,
      missing,
      orderValid:
        partialArtifactMarkers.length ===
        0,
      result:
        missing.length === 0
          ? "PASS"
          : "BLOCKED"
    };
  }

  const required = [
    ...SIMPLE_LETTER_READY_MARKERS,
    "PISMO ZAWIERA … PÓL DO UZUPEŁNIENIA"
  ];
  const observed: string[] =
    SIMPLE_LETTER_READY_MARKERS
      .filter((marker) =>
        normalizedSimple.includes(
          marker
        )
      );
  const missing: string[] =
    SIMPLE_LETTER_READY_MARKERS
      .filter((marker) =>
        !normalizedSimple.includes(
          marker
        )
      );

  const positions =
    SIMPLE_LETTER_READY_MARKERS
      .map((marker) =>
        normalizedSimple.indexOf(
          marker
        )
      );
  const orderValid =
    missing.length === 0 &&
    positions.every(
      (position, index) =>
        index === 0 ||
        position >
          positions[index - 1]!
    );

  const hasCompletionCount =
    normalizedSimple.includes(
      "PISMO ZAWIERA"
    ) &&
    normalizedSimple.includes(
      "PÓL DO UZUPEŁNIENIA"
    );
  if (hasCompletionCount) {
    observed.push(
      "PISMO ZAWIERA … PÓL DO UZUPEŁNIENIA"
    );
  } else {
    missing.push(
      "PISMO ZAWIERA … PÓL DO UZUPEŁNIENIA"
    );
  }

  return {
    workflow: plan.id,
    mode: "READY_ARTIFACT",
    required,
    observed,
    missing,
    orderValid,
    result:
      missing.length === 0 &&
      orderValid
        ? "PASS"
        : "BLOCKED"
  };
}

export function evaluateDeterministicWorkflowReads(
  plan: DeterministicWorkflowPlan,
  corpusAudit: readonly LegalCorpusAuditEvent[],
  executionEvents: readonly {
    type: string;
    target: string;
    status: string;
  }[] = []
): DeterministicWorkflowReadReport {
  const observed = [
    ...new Set([
      ...corpusAudit
        .filter(
          (event) =>
            event.tool === "read_legal_resource" &&
            event.decision === "ALLOW"
        )
        .map((event) => event.target),
      ...executionEvents
        .filter(
          (event) =>
            event.type === "resource_read" &&
            event.status === "OK" &&
            plan.requiredFreshResources
              .includes(event.target)
        )
        .map(
          (event) =>
            event.target
        )
    ])
  ];

  const missing =
    plan.requiredFreshResources.filter(
      (resource) => !observed.includes(resource)
    );

  return {
    workflow: plan.id,
    required: [...plan.requiredFreshResources],
    observed,
    missing,
    result: missing.length === 0
      ? "PASS"
      : "BLOCKED"
  };
}

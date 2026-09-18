import fs from "node:fs";
import type { LegalCorpusAuditEvent } from "./legal-corpus-tool-runtime.js";
import type { LexSkillRegistry } from "./registry.js";

export type DeterministicWorkflowId =
  | "LEGAL_QUERY_V1"
  | "SIMPLE_LETTER_V1"
  | "PROCESS_PLEADING_V1"
  | "COURT_ANALYSIS_V1"
  | "EVIDENCE_ANALYSIS_V1"
  | "STATUTE_ANALYSIS_V1";

export type DeterministicWorkflowPlan = {
  id: DeterministicWorkflowId;
  executionSkill: string | null;
  escalatedFromSimpleLetter: boolean;
  requiredFreshResources: string[];
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

  const executionSkill = hasProcess
    ? "pisma-procesowe-v3"
    : hasSimple
      ? "pisma-proste-v2"
      : hasCourtAnalysis
        ? "analiza-sadowa-v6"
        : hasEvidenceAnalysis
          ? "analizator-dowodow-v3"
          : hasStatuteAnalysis
            ? "analizator-przepisow-v2"
            : workflowExecutionSkill;

  const id: DeterministicWorkflowId = hasProcess
    ? "PROCESS_PLEADING_V1"
    : hasSimple
      ? "SIMPLE_LETTER_V1"
      : hasCourtAnalysis
        ? "COURT_ANALYSIS_V1"
        : hasEvidenceAnalysis
          ? "EVIDENCE_ANALYSIS_V1"
          : hasStatuteAnalysis
            ? "STATUTE_ANALYSIS_V1"
            : "LEGAL_QUERY_V1";

  const requiredFreshResources = hasProcess
    ? [...PROCESS_PLEADING_RESOURCES]
    : hasSimple
      ? [...SIMPLE_LETTER_RESOURCES]
      : hasCourtAnalysis
        ? [...COURT_ANALYSIS_RESOURCES]
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

  return {
    id,
    executionSkill,
    escalatedFromSimpleLetter: false,
    requiredFreshResources,
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
    "Before completing this turn, perform fresh read_legal_resource calls for every resource below.",
    "Merely mentioning a filename or remembering an earlier copy does not satisfy the gate.",
    ...plan.requiredFreshResources.map(
      (resource) => `- ${resource}`
    ),
    "The runtime will compare actual corpus-tool audit events against this list and block presentation if any required read is missing.",
    ...(plan.escalatedFromSimpleLetter
      ? [
          "Both simple and process pleading skills were selected. The stricter PROCESS_PLEADING_V1 workflow controls this turn."
        ]
      : [])
  ].join("\n");
}

export function evaluateDeterministicWorkflowReads(
  plan: DeterministicWorkflowPlan,
  corpusAudit: readonly LegalCorpusAuditEvent[]
): DeterministicWorkflowReadReport {
  const observed = [
    ...new Set(
      corpusAudit
        .filter(
          (event) =>
            event.tool === "read_legal_resource" &&
            event.decision === "ALLOW"
        )
        .map((event) => event.target)
    )
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

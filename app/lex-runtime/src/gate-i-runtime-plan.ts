import {
  gateIWorkflowContract,
  type GateIWorkflowContract
} from "./gate-i-contracts.js";
import type {
  DeterministicWorkflowId
} from "./deterministic-workflow.js";

export type GateIStageOwner =
  | "RUNTIME"
  | "SEMANTIC"
  | "VALIDATION";

export type GateIRuntimePhase =
  | "PRE_SEMANTIC"
  | "DURABLE_STATE"
  | "TOOL_VERIFICATION"
  | "POST_DRAFT_VALIDATION"
  | "FINALIZATION";

export type GateIStageOwnership = {
  stage: string;
  owner:
    GateIStageOwner;
};

export type GateIPolicyOwnership = {
  policy:
    GateIWorkflowContract["mandatoryPolicies"][number];
  phase:
    GateIRuntimePhase;
};

export type GateIRuntimePlan = {
  workflow:
    DeterministicWorkflowId;
  stateModel:
    GateIWorkflowContract["stateModel"];
  stageOwnership:
    GateIStageOwnership[];
  policyOwnership:
    GateIPolicyOwnership[];
  semanticStages:
    string[];
  runtimeStages:
    string[];
  validationStages:
    string[];
  result:
    "PASS" | "BLOCKED";
  errors: string[];
};

const STAGE_OWNERS:
  Readonly<
    Record<
      DeterministicWorkflowId,
      Readonly<
        Record<
          string,
          GateIStageOwner
        >
      >
    >
  > = {
    LEGAL_QUERY_V1: {
      ROUTER: "RUNTIME",
      SEMANTIC_ANSWER:
        "SEMANTIC",
      VERIFY: "RUNTIME",
      FINALIZE:
        "VALIDATION"
    },
    SIMPLE_LETTER_V1: {
      INTAKE: "RUNTIME",
      ESCALATION_CHECK:
        "RUNTIME",
      DRAFT: "SEMANTIC",
      HYBRID_VALIDATION:
        "VALIDATION",
      FINALIZE:
        "VALIDATION"
    },
    PROCESS_PLEADING_V1: {
      CG_ACCEPTANCE:
        "RUNTIME",
      W1: "SEMANTIC",
      PRE_W2:
        "SEMANTIC",
      W2: "SEMANTIC",
      W3: "SEMANTIC",
      FINAL: "VALIDATION"
    },
    COURT_ANALYSIS_V1: {
      PASS_I: "SEMANTIC",
      PASS_II: "SEMANTIC",
      PASS_III: "SEMANTIC",
      PASS_IV: "SEMANTIC",
      FINAL_REPORT:
        "SEMANTIC",
      COMPLETE:
        "VALIDATION"
    },
    EVIDENCE_ANALYSIS_V1: {
      "AD-KROK0-BLOKADA":
        "RUNTIME",
      "AD-KROK0a-MODE":
        "RUNTIME",
      "AD-KROK0b-SDVER":
        "RUNTIME",
      "AD-KROK0c-STINIT":
        "RUNTIME",
      "AD-KROK1-INTAKE":
        "RUNTIME",
      "AD-KROK2-ROUTER":
        "RUNTIME",
      "AD-BLOKG-STRONY":
        "SEMANTIC",
      "AD-BLOKJ-LAPSUSY":
        "SEMANTIC",
      "AD-BLOKH-DIS":
        "SEMANTIC",
      "AD-KROK3-WYKONANIE":
        "SEMANTIC",
      "AD-KROK4-DASHBOARD":
        "VALIDATION"
    },
    STATUTE_ANALYSIS_V1: {
      MODULE_0_INTAKE:
        "RUNTIME",
      MODULE_1_VERIFY_TEXT:
        "RUNTIME",
      MODULE_2_DECOMPOSE:
        "SEMANTIC",
      MODULE_3_APPLY:
        "SEMANTIC",
      MODULE_4_REPORT:
        "VALIDATION",
      OPTIONAL_SPECIAL_MODULES:
        "SEMANTIC"
    },
    CONTRACT_ANALYSIS_V1: {
      MODE: "RUNTIME",
      INVENTORY: "RUNTIME",
      LEGAL_CHECKS:
        "RUNTIME",
      RISK: "SEMANTIC",
      CHANGES: "SEMANTIC",
      FINAL: "VALIDATION"
    },
    CHRONOLOGY_V1: {
      INVENTORY: "RUNTIME",
      EXTRACT: "SEMANTIC",
      ORDER: "RUNTIME",
      CONFLICTS:
        "SEMANTIC",
      TEMPORAL_GATES:
        "RUNTIME",
      FINAL: "VALIDATION"
    },
    CASE_LAW_V1: {
      RISK_PROFILE:
        "SEMANTIC",
      ELEMENTS_AND_BURDEN:
        "SEMANTIC",
      EXPECTED_OUTCOME_PROFILE:
        "SEMANTIC",
      SEARCH: "RUNTIME",
      SIGNATURE_AND_FULLTEXT_VERIFY:
        "RUNTIME",
      DIRECTION_TEST:
        "SEMANTIC",
      CATEGORIZE:
        "SEMANTIC",
      FRESHNESS:
        "RUNTIME",
      FINAL_REPORT:
        "VALIDATION"
    },
    WITNESS_QUESTIONING_V1: {
      "PRE-W1a-SD-VER":
        "RUNTIME",
      "PRE-W1a.4-RZ-SHOW":
        "RUNTIME",
      "KROK-PRE-W1-INTELLIGENCE":
        "SEMANTIC",
      "KROK-0-KONTEKST":
        "RUNTIME",
      "W1-INTAKE":
        "RUNTIME",
      "W1-SUPPLEMENT":
        "SEMANTIC",
      "W2-THESES-AND-MODEL":
        "SEMANTIC",
      "CHECKPOINT-W2":
        "VALIDATION",
      "W3-QUESTIONS":
        "SEMANTIC",
      "W4-REHEARSAL":
        "SEMANTIC",
      "W5-BINDER":
        "SEMANTIC",
      "W6-LIVE-DIRECT":
        "SEMANTIC"
    },
    CLIENT_REPORT_V1: {
      BLUEPRINT:
        "RUNTIME",
      SOURCE_NUMERIC_VALIDATION:
        "RUNTIME",
      PLAIN_LANGUAGE_RENDER:
        "SEMANTIC",
      FINALIZE:
        "VALIDATION"
    },
    SITUATION_REPORT_V1: {
      BLUEPRINT:
        "RUNTIME",
      SOURCE_STATUS_VALIDATION:
        "RUNTIME",
      RISK_AND_TIMELINE:
        "SEMANTIC",
      RENDER: "SEMANTIC",
      FINALIZE:
        "VALIDATION"
    }
  };

const POLICY_PHASE:
  Readonly<
    Record<
      GateIWorkflowContract["mandatoryPolicies"][number],
      GateIRuntimePhase
    >
  > = {
    ROUTER_FIRST:
      "PRE_SEMANTIC",
    PRIVACY:
      "PRE_SEMANTIC",
    FRESH_POLICY_READS:
      "PRE_SEMANTIC",
    ATTACHMENT_COMPLETENESS:
      "PRE_SEMANTIC",
    SOURCE_HIERARCHY:
      "TOOL_VERIFICATION",
    TEMPORAL_FRESHNESS:
      "TOOL_VERIFICATION",
    CITATION_LEDGER:
      "POST_DRAFT_VALIDATION",
    CASE_SIGNATURES:
      "TOOL_VERIFICATION",
    DOCUMENT_CITATIONS:
      "POST_DRAFT_VALIDATION",
    STEP_TRACKER:
      "DURABLE_STATE",
    DOMAIN_LOCK:
      "PRE_SEMANTIC",
    RATE_COMPLETENESS:
      "PRE_SEMANTIC",
    OUTPUT_SCHEMA:
      "POST_DRAFT_VALIDATION",
    REPORT_BLUEPRINT:
      "POST_DRAFT_VALIDATION",
    IRREVERSIBLE_ACTION_WARNING:
      "DURABLE_STATE"
  };

export function gateIRuntimePlan(
  workflow:
    DeterministicWorkflowId,
  executionSkill:
    string | null
): GateIRuntimePlan {
  const contract =
    gateIWorkflowContract(
      workflow,
      executionSkill
    );
  const configured =
    STAGE_OWNERS[workflow];
  const errors:
    string[] = [];
  const stageOwnership:
    GateIStageOwnership[] = [];

  for (
    const stage
    of contract.canonicalStages
  ) {
    const owner =
      configured[stage];
    if (!owner) {
      errors.push(
        `UNCLASSIFIED_STAGE:${stage}`
      );
      continue;
    }
    stageOwnership.push({
      stage,
      owner
    });
  }

  for (
    const stage
    of Object.keys(
      configured
    )
  ) {
    if (
      !contract
        .canonicalStages
        .includes(stage)
    ) {
      errors.push(
        `STALE_STAGE:${stage}`
      );
    }
  }

  const policyOwnership:
    GateIPolicyOwnership[] = [];
  for (
    const policy
    of contract
      .mandatoryPolicies
  ) {
    const phase =
      POLICY_PHASE[
        policy
      ];
    if (!phase) {
      errors.push(
        `UNCLASSIFIED_POLICY:${policy}`
      );
      continue;
    }
    policyOwnership.push({
      policy,
      phase
    });
  }

  return {
    workflow,
    stateModel:
      contract.stateModel,
    stageOwnership,
    policyOwnership,
    semanticStages:
      stageOwnership
        .filter(
          (item) =>
            item.owner ===
              "SEMANTIC"
        )
        .map(
          (item) =>
            item.stage
        ),
    runtimeStages:
      stageOwnership
        .filter(
          (item) =>
            item.owner ===
              "RUNTIME"
        )
        .map(
          (item) =>
            item.stage
        ),
    validationStages:
      stageOwnership
        .filter(
          (item) =>
            item.owner ===
              "VALIDATION"
        )
        .map(
          (item) =>
            item.stage
        ),
    result:
      errors.length === 0
        ? "PASS"
        : "BLOCKED",
    errors
  };
}

export function gateIRuntimePlanPrompt(
  plan:
    GateIRuntimePlan
): string {
  if (
    plan.result !==
      "PASS"
  ) {
    throw new Error(
      `GATE_I_RUNTIME_PLAN_INVALID:${plan.errors.join(",")}`
    );
  }

  return [
    "# GATE I — RUNTIME/STAGE OWNERSHIP",
    `Workflow: ${plan.workflow}.`,
    `State model: ${plan.stateModel}.`,
    "The runtime owns every mechanical stage and mandatory policy. Do not repeat them in prose or simulate their completion.",
    `Runtime stages: ${plan.runtimeStages.length > 0 ? plan.runtimeStages.join(" → ") : "none"}.`,
    `Semantic stages assigned to the model: ${plan.semanticStages.length > 0 ? plan.semanticStages.join(" → ") : "none"}.`,
    `Validation/finalization stages: ${plan.validationStages.length > 0 ? plan.validationStages.join(" → ") : "none"}.`,
    "Source hierarchy, temporal freshness, citation ledger, case signatures, document citations and fail-closed finalization are runtime responsibilities even when the skill text describes them as mandatory steps.",
    "Return only the substantive semantic work required by the active semantic stage(s); never fabricate runtime evidence."
  ].join("\n");
}

export const GATE_I_WORKFLOWS:
  readonly DeterministicWorkflowId[] = [
    "LEGAL_QUERY_V1",
    "SIMPLE_LETTER_V1",
    "PROCESS_PLEADING_V1",
    "COURT_ANALYSIS_V1",
    "EVIDENCE_ANALYSIS_V1",
    "STATUTE_ANALYSIS_V1",
    "CONTRACT_ANALYSIS_V1",
    "CHRONOLOGY_V1",
    "CASE_LAW_V1",
    "WITNESS_QUESTIONING_V1",
    "CLIENT_REPORT_V1",
    "SITUATION_REPORT_V1"
  ] as const;

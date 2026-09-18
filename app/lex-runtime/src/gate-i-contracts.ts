import type {
  DeterministicWorkflowId
} from "./deterministic-workflow.js";
import type {
  GateIInvariantReport
} from "./gate-i-invariants.js";

export type GateIStateModel =
  | "DURABLE_CASE"
  | "DURABLE_SESSION"
  | "CHAT_TURN"
  | "SCHEMA_PIPELINE";

export type GateIWorkflowContract = {
  workflow:
    DeterministicWorkflowId;
  executionSkill:
    string | null;
  stateModel:
    GateIStateModel;
  canonicalStages:
    readonly string[];
  mandatoryPolicies:
    readonly (
      | "ROUTER_FIRST"
      | "PRIVACY"
      | "FRESH_POLICY_READS"
      | "ATTACHMENT_COMPLETENESS"
      | "SOURCE_HIERARCHY"
      | "TEMPORAL_FRESHNESS"
      | "CITATION_LEDGER"
      | "CASE_SIGNATURES"
      | "DOCUMENT_CITATIONS"
      | "STEP_TRACKER"
      | "DOMAIN_LOCK"
      | "RATE_COMPLETENESS"
      | "OUTPUT_SCHEMA"
      | "REPORT_BLUEPRINT"
      | "IRREVERSIBLE_ACTION_WARNING"
    )[];
};

const COMMON = [
  "ROUTER_FIRST",
  "PRIVACY",
  "FRESH_POLICY_READS",
  "SOURCE_HIERARCHY",
  "TEMPORAL_FRESHNESS",
  "CITATION_LEDGER",
  "CASE_SIGNATURES",
  "DOCUMENT_CITATIONS"
] as const;

const CONTRACTS:
  Readonly<
    Record<
      DeterministicWorkflowId,
      Omit<
        GateIWorkflowContract,
        "workflow" |
        "executionSkill"
      >
    >
  > = {
    LEGAL_QUERY_V1: {
      stateModel:
        "CHAT_TURN",
      canonicalStages: [
        "ROUTER",
        "SEMANTIC_ANSWER",
        "VERIFY",
        "FINALIZE"
      ],
      mandatoryPolicies: [
        ...COMMON
      ]
    },
    LEGAL_GUIDE_V1: {
      stateModel:
        "DURABLE_SESSION",
      canonicalStages: [
        "SESSION_STATE",
        "ACTIVE_GUIDE_STEP",
        "SOURCE_VERIFICATION",
        "OUTPUT_GUARD",
        "FINALIZE"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "DOMAIN_LOCK",
        "RATE_COMPLETENESS",
        "IRREVERSIBLE_ACTION_WARNING",
        "OUTPUT_SCHEMA"
      ]
    },
    SIMPLE_LETTER_V1: {
      stateModel:
        "SCHEMA_PIPELINE",
      canonicalStages: [
        "INTAKE",
        "ESCALATION_CHECK",
        "DRAFT",
        "HYBRID_VALIDATION",
        "FINALIZE"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "OUTPUT_SCHEMA"
      ]
    },
    PROCESS_PLEADING_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "CG_ACCEPTANCE",
        "W1",
        "PRE_W2",
        "W2",
        "W3",
        "FINAL"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "DOMAIN_LOCK",
        "RATE_COMPLETENESS",
        "OUTPUT_SCHEMA"
      ]
    },
    COURT_ANALYSIS_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "PASS_I",
        "PASS_II",
        "PASS_III",
        "PASS_IV",
        "FINAL_REPORT",
        "COMPLETE"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "OUTPUT_SCHEMA"
      ]
    },
    EVIDENCE_ANALYSIS_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "AD-KROK0-BLOKADA",
        "AD-KROK0a-MODE",
        "AD-KROK0b-SDVER",
        "AD-KROK0c-STINIT",
        "AD-KROK1-INTAKE",
        "AD-KROK2-ROUTER",
        "AD-BLOKG-STRONY",
        "AD-BLOKJ-LAPSUSY",
        "AD-BLOKH-DIS",
        "AD-KROK3-WYKONANIE",
        "AD-KROK4-DASHBOARD"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "DOMAIN_LOCK",
        "RATE_COMPLETENESS",
        "OUTPUT_SCHEMA"
      ]
    },
    STATUTE_ANALYSIS_V1: {
      stateModel:
        "CHAT_TURN",
      canonicalStages: [
        "MODULE_0_INTAKE",
        "MODULE_1_VERIFY_TEXT",
        "MODULE_2_DECOMPOSE",
        "MODULE_3_APPLY",
        "MODULE_4_REPORT",
        "OPTIONAL_SPECIAL_MODULES"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "OUTPUT_SCHEMA"
      ]
    },
    CONTRACT_ANALYSIS_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "MODE",
        "INVENTORY",
        "LEGAL_CHECKS",
        "RISK",
        "CHANGES",
        "FINAL"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "OUTPUT_SCHEMA"
      ]
    },
    CHRONOLOGY_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "INVENTORY",
        "EXTRACT",
        "ORDER",
        "CONFLICTS",
        "TEMPORAL_GATES",
        "FINAL"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "OUTPUT_SCHEMA"
      ]
    },
    CASE_LAW_V1: {
      stateModel:
        "CHAT_TURN",
      canonicalStages: [
        "RISK_PROFILE",
        "ELEMENTS_AND_BURDEN",
        "EXPECTED_OUTCOME_PROFILE",
        "SEARCH",
        "SIGNATURE_AND_FULLTEXT_VERIFY",
        "DIRECTION_TEST",
        "CATEGORIZE",
        "FRESHNESS",
        "FINAL_REPORT"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "OUTPUT_SCHEMA"
      ]
    },
    WITNESS_QUESTIONING_V1: {
      stateModel:
        "DURABLE_CASE",
      canonicalStages: [
        "PRE-W1a-SD-VER",
        "PRE-W1a.4-RZ-SHOW",
        "KROK-PRE-W1-INTELLIGENCE",
        "KROK-0-KONTEKST",
        "W1-INTAKE",
        "W1-SUPPLEMENT",
        "W2-THESES-AND-MODEL",
        "CHECKPOINT-W2",
        "W3-QUESTIONS",
        "W4-REHEARSAL",
        "W5-BINDER",
        "W6-LIVE-DIRECT"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "ATTACHMENT_COMPLETENESS",
        "STEP_TRACKER",
        "OUTPUT_SCHEMA"
      ]
    },
    CLIENT_REPORT_V1: {
      stateModel:
        "SCHEMA_PIPELINE",
      canonicalStages: [
        "BLUEPRINT",
        "SOURCE_NUMERIC_VALIDATION",
        "PLAIN_LANGUAGE_RENDER",
        "FINALIZE"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "REPORT_BLUEPRINT",
        "OUTPUT_SCHEMA"
      ]
    },
    SITUATION_REPORT_V1: {
      stateModel:
        "SCHEMA_PIPELINE",
      canonicalStages: [
        "BLUEPRINT",
        "SOURCE_STATUS_VALIDATION",
        "RISK_AND_TIMELINE",
        "RENDER",
        "FINALIZE"
      ],
      mandatoryPolicies: [
        ...COMMON,
        "REPORT_BLUEPRINT",
        "OUTPUT_SCHEMA"
      ]
    }
  };

const ATTACHMENT_ASSERTION =
  /\b(?:w\s+załączniku|załączam|załączone|w\s+pliku|wgrałem|wgrałam|przesyłam\s+(?:plik|dokument)|te\s+(?:pliki|dokumenty)|załączone\s+akta|akta\s+w\s+załączniku)\b/iu;

export function gateIWorkflowContract(
  workflow:
    DeterministicWorkflowId,
  executionSkill:
    string | null
): GateIWorkflowContract {
  const contract =
    CONTRACTS[workflow];
  return {
    workflow,
    executionSkill,
    stateModel:
      contract.stateModel,
    canonicalStages:
      [...contract.canonicalStages],
    mandatoryPolicies:
      [...contract.mandatoryPolicies]
  };
}

export type GateIInputCompletenessReport = {
  result:
    | "PASS"
    | "BLOCKED";
  attachmentAssertion:
    boolean;
  attachmentCount: number;
  reason:
    | "NO_ATTACHMENT_ASSERTION"
    | "ATTACHMENTS_PRESENT"
    | "ATTACHMENT_ASSERTED_BUT_MISSING";
};

export function evaluateGateIInputCompleteness(
  query: string,
  attachmentCount: number
): GateIInputCompletenessReport {
  const attachmentAssertion =
    ATTACHMENT_ASSERTION.test(
      query
    );
  if (!attachmentAssertion) {
    return {
      result: "PASS",
      attachmentAssertion,
      attachmentCount,
      reason:
        "NO_ATTACHMENT_ASSERTION"
    };
  }
  if (attachmentCount > 0) {
    return {
      result: "PASS",
      attachmentAssertion,
      attachmentCount,
      reason:
        "ATTACHMENTS_PRESENT"
    };
  }
  return {
    result: "BLOCKED",
    attachmentAssertion,
    attachmentCount,
    reason:
      "ATTACHMENT_ASSERTED_BUT_MISSING"
  };
}

export type GateIWorkflowExtensionCheck = {
  subgate:
    | "I-I_INPUT_COMPLETENESS"
    | "I-J_STATE_TRANSITION";
  result:
    | "PASS"
    | "BLOCKED"
    | "NOT_APPLICABLE";
  detail: string;
};

export type GateIWorkflowContractReport = {
  gate:
    "G39I_WORKFLOW_CONTRACT";
  workflow:
    DeterministicWorkflowId;
  stateModel:
    GateIStateModel;
  commonInvariants:
    "PASS" | "BLOCKED";
  result:
    "PASS" | "BLOCKED";
  checks:
    GateIWorkflowExtensionCheck[];
};

export function evaluateGateIWorkflowContract(args: {
  contract:
    GateIWorkflowContract;
  invariants:
    GateIInvariantReport;
  input:
    GateIInputCompletenessReport;
  stateTransition:
    | "PASS"
    | "BLOCKED"
    | "NOT_APPLICABLE";
}): GateIWorkflowContractReport {
  const checks:
    GateIWorkflowExtensionCheck[] = [
      {
        subgate:
          "I-I_INPUT_COMPLETENESS",
        result:
          args.input.result,
        detail:
          args.input.reason
      },
      {
        subgate:
          "I-J_STATE_TRANSITION",
        result:
          args.stateTransition,
        detail:
          `stateModel=${args.contract.stateModel}`
      }
    ];

  return {
    gate:
      "G39I_WORKFLOW_CONTRACT",
    workflow:
      args.contract.workflow,
    stateModel:
      args.contract.stateModel,
    commonInvariants:
      args.invariants.result,
    result:
      args.invariants.result ===
        "PASS" &&
      checks.every(
        (check) =>
          check.result !==
            "BLOCKED"
      )
        ? "PASS"
        : "BLOCKED",
    checks
  };
}

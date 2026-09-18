import type {
  DeterministicWorkflowId
} from "./deterministic-workflow.js";
import type {
  GateIInvariantReport
} from "./gate-i-invariants.js";

export type GateISubgateId =
  | "I0_BOOTSTRAP"
  | "I1_POLICY_PREFLIGHT"
  | "I2_INPUT_COMPLETENESS"
  | "I3_SOURCE_PROVENANCE"
  | "I4_CITATIONS_SIGNATURES"
  | "I5_SKILL_OUTPUT"
  | "I6_STATE_TRANSITION"
  | "I7_FINALIZATION";

export type GateIStateModel =
  | "DURABLE_CASE"
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
        "CHAT_TURN",
      canonicalStages: [
        "AD_KROK0_BLOCK",
        "AD_KROK0A_MODE",
        "AD_KROK0B_SDVER",
        "AD_KROK0C_TRACKER",
        "AD_KROK1_INTAKE",
        "AD_KROK2_ROUTER",
        "AD_KROK3_EXECUTION",
        "AD_KROK3B_SYNTHESIS",
        "AD_KROK4_OUTPUT"
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
        "CHAT_TURN",
      canonicalStages: [
        "PRE_W1_EVIDENCE",
        "W1_INTAKE",
        "W2_THESES_AND_MODEL",
        "W2_CHECKPOINT",
        "W3_QUESTIONS",
        "OPTIONAL_W4_REHEARSAL",
        "OPTIONAL_W5_BINDER",
        "OPTIONAL_W6_ADAPTATION"
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

export type GateISubgateResult = {
  id: GateISubgateId;
  result:
    | "PASS"
    | "BLOCKED"
    | "NOT_APPLICABLE";
  detail: string;
};

export type GateISubgateReport = {
  gate:
    "G39I_SUBGATES";
  workflow:
    DeterministicWorkflowId;
  stateModel:
    GateIStateModel;
  result:
    | "PASS"
    | "BLOCKED";
  subgates:
    GateISubgateResult[];
};

function invariant(
  report:
    GateIInvariantReport,
  id:
    GateIInvariantReport["checks"][number]["id"]
): boolean {
  return report.checks
    .find(
      (check) =>
        check.id === id
    )?.result === "PASS";
}

export function evaluateGateISubgates(args: {
  contract:
    GateIWorkflowContract;
  invariants:
    GateIInvariantReport;
  input:
    GateIInputCompletenessReport;
  outputPass: boolean;
  stateTransitionPass: boolean;
  finalizationPass: boolean;
}): GateISubgateReport {
  const bootstrap =
    invariant(
      args.invariants,
      "ROUTER_FIRST"
    ) &&
    invariant(
      args.invariants,
      "CORE_RESOURCES"
    );
  const policy =
    invariant(
      args.invariants,
      "WORKFLOW_RESOURCES"
    );
  const source =
    invariant(
      args.invariants,
      "SOURCE_PROVENANCE"
    );
  const citations =
    invariant(
      args.invariants,
      "LEGAL_CITATIONS"
    ) &&
    invariant(
      args.invariants,
      "CASE_SIGNATURES"
    );

  const stateApplicable =
    args.contract.stateModel ===
      "DURABLE_CASE";

  const subgates:
    GateISubgateResult[] = [
      {
        id: "I0_BOOTSTRAP",
        result:
          bootstrap
            ? "PASS"
            : "BLOCKED",
        detail:
          "router-first + core legal resources"
      },
      {
        id:
          "I1_POLICY_PREFLIGHT",
        result:
          policy
            ? "PASS"
            : "BLOCKED",
        detail:
          `runtime-owned policies=${args.contract.mandatoryPolicies.length}`
      },
      {
        id:
          "I2_INPUT_COMPLETENESS",
        result:
          args.input.result,
        detail:
          args.input.reason
      },
      {
        id:
          "I3_SOURCE_PROVENANCE",
        result:
          source
            ? "PASS"
            : "BLOCKED",
        detail:
          "verified/supported records require runtime provenance"
      },
      {
        id:
          "I4_CITATIONS_SIGNATURES",
        result:
          citations
            ? "PASS"
            : "BLOCKED",
        detail:
          "legal citations + case signatures"
      },
      {
        id:
          "I5_SKILL_OUTPUT",
        result:
          args.outputPass
            ? "PASS"
            : "BLOCKED",
        detail:
          "workflow/guide/report output contract"
      },
      {
        id:
          "I6_STATE_TRANSITION",
        result:
          !stateApplicable
            ? "NOT_APPLICABLE"
            : args.stateTransitionPass
              ? "PASS"
              : "BLOCKED",
        detail:
          `stateModel=${args.contract.stateModel}`
      },
      {
        id:
          "I7_FINALIZATION",
        result:
          args.finalizationPass
            ? "PASS"
            : "BLOCKED",
        detail:
          "hard finalization gate"
      }
    ];

  return {
    gate:
      "G39I_SUBGATES",
    workflow:
      args.contract.workflow,
    stateModel:
      args.contract.stateModel,
    result:
      subgates.every(
        (subgate) =>
          subgate.result !==
            "BLOCKED"
      )
        ? "PASS"
        : "BLOCKED",
    subgates
  };
}

import type {
  DeterministicSkillCoverageEntry
} from "./deterministic-skill-coverage.js";
import {
  DETERMINISTIC_SKILL_COVERAGE
} from "./deterministic-skill-coverage.js";

export type GateISemanticContract = {
  skill: string;
  runtimeEnforced: true;
  semanticResponsibilities:
    readonly string[];
  forbiddenMechanicalResponsibilities:
    readonly string[];
};

const COMMON_FORBIDDEN = [
  "Do not decide or reorder deterministic workflow stages.",
  "Do not fabricate completion of runtime checkpoints.",
  "Do not invent source-verification results, URLs, citation markers or court signatures.",
  "Do not bypass STOP/fail-closed gates, provenance or finalization."
] as const;

const CONTRACTS:
  Readonly<
    Record<
      string,
      readonly string[]
    >
  > = {
    "prawny-router-v3": [
      "Interpret genuinely ambiguous user intent only when deterministic routing cannot resolve it.",
      "Explain the selected route to the user when useful; the runtime owns the route and dependencies."
    ],
    "prawo-polskie-v2": [
      "Perform legal interpretation inside the domain modules selected by runtime.",
      "Do not override jurisdiction, DR allowlist or routing-map decisions."
    ],
    "pisma-proste-v2": [
      "Turn verified facts and legal conclusions into concise user-ready wording.",
      "Identify semantic ambiguity in facts; never invent missing party, date, claim or requested relief."
    ],
    "pisma-procesowe-v3": [
      "Perform strategy, argumentation, counterargument and drafting within the current task scope.",
      "Distinguish fact, allegation, inference and legal argument in substantive drafting."
    ],
    "analiza-sadowa-v6": [
      "Perform legal qualification, adversarial interpretation and significance analysis within the current task scope.",
      "Assess competing explanations without claiming completion of runtime-controlled stages."
    ],
    "analizator-dowodow-v3": [
      "Assess evidentiary significance, hypotheses, conflicts and alternative explanations.",
      "Keep semantic conclusions linked to the runtime evidence inventory and provenance."
    ],
    "analizator-przepisow-v2": [
      "Interpret verified provisions, conflicts of norms and practical legal meaning.",
      "Separate literal text, interpretive inference and uncertainty."
    ],
    "analizator-umow-v1": [
      "Assess semantic contractual risk, negotiation position and proposed wording.",
      "Explain the practical consequence of a clause without overriding runtime clause/checklist gates."
    ],
    "chronologia-sprawy-v1": [
      "Explain the legal significance of events, temporal conflicts and uncertainty.",
      "Do not alter runtime ordering, provenance or certainty fields."
    ],
    "orzeczenia-sadowe-v2": [
      "Assess similarity, ratio relevance, contrary lines and argumentative usefulness.",
      "Never treat discovery candidates as verified case authorities."
    ],
    "przesluchanie-swiadkow-v2-min90": [
      "Generate and adapt questions to the proven thesis/evidence map.",
      "Apply examination strategy without bypassing runtime admissibility and coverage gates."
    ],
    "raport-klienta-v1": [
      "Explain verified findings in plain language and frame user options neutrally.",
      "Do not recalculate or rewrite runtime-controlled numeric/source fields."
    ],
    "raport-sytuacyjny-v2": [
      "Synthesize the verified situation, risks and priorities into a coherent narrative.",
      "Do not alter runtime-controlled status, numeric or source fields."
    ],
    "przewodnik-prawny-v2": [
      "Interpret user intent, conduct the current guided dialogue step and explain legal material in lay language.",
      "Ask only the number of questions allowed by the runtime guide state and respect irreversible-action warnings."
    ]
  };

function coverage(
  skill: string
): DeterministicSkillCoverageEntry | undefined {
  return DETERMINISTIC_SKILL_COVERAGE
    .find(
      (entry) =>
        entry.skill === skill
    );
}

export function gateISemanticContract(
  skill: string
): GateISemanticContract | null {
  const entry =
    coverage(skill);
  const responsibilities =
    CONTRACTS[skill];

  if (
    !entry ||
    !responsibilities ||
    entry.status !== "ENFORCED"
  ) {
    return null;
  }

  return {
    skill,
    runtimeEnforced: true,
    semanticResponsibilities:
      responsibilities,
    forbiddenMechanicalResponsibilities:
      COMMON_FORBIDDEN
  };
}

export function gateISemanticPrompt(
  skill: string,
  options: {
    specializedWorkflowActive?: boolean;
  } = {}
): string | null {
  const contract =
    gateISemanticContract(
      skill
    );
  if (!contract) {
    return null;
  }

  const specialized =
    options.specializedWorkflowActive === true;

  return [
    `# SEMANTIC CONTRACT: ${skill}`,
    specialized
      ? "This skill controls the active specialized deterministic workflow. The runtime owns checkpoint order, state transitions and every mechanical gate."
      : "This skill is active as a semantic module only. No skill-specific state machine is active for it in this turn; the common legal runtime still owns routing, source verification, citations, provenance and finalization.",
    specialized
      ? "Work only within the active runtime checkpoint/stage supplied elsewhere in this prompt."
      : "Do not simulate, announce, close or skip any skill-specific checkpoint or stage.",
    "Your responsibilities:",
    ...contract.semanticResponsibilities
      .map(
        (item) => `- ${item}`
      ),
    "Runtime-owned responsibilities:",
    ...contract
      .forbiddenMechanicalResponsibilities
      .map(
        (item) => `- ${item}`
      )
  ].join("\n");
}

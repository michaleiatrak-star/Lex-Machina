export const CONTRACT_CHECKPOINTS = [
  "AU-F0",
  "AU-GAP",
  "AU-POV",
  "AU-ROUTE",
  "AU-A",
  "AU-B",
  "AU-C",
  "AU-D",
  "AU-F",
  "AU-GENCORE",
  "AU-GENBUILD",
  "AU-GENSHARED",
  "AU-HYBRID",
  "AU-STRIP",
  "AU-POST",
  "AU-DISC"
] as const;

export type ContractCheckpoint =
  typeof CONTRACT_CHECKPOINTS[number];

export type ContractWorkflowMode =
  | "ANALYSIS"
  | "REDACTION"
  | "DRAFT"
  | "SUPPLEMENT";

export type ContractStage =
  | "INTAKE"
  | "ANALYSIS"
  | "GENERATION"
  | "FINALIZATION"
  | "COMPLETE";

export type ContractCheckpointOutcome =
  | "DONE"
  | "NA";

export type ContractCheckpointEvent = {
  sequence: number;
  at: string;
  checkpoint: ContractCheckpoint;
  outcome: ContractCheckpointOutcome;
  fromStage: ContractStage;
  toStage: ContractStage;
  auditRefs: string[];
  reason?: string;
};

export type ContractAnalysisState = {
  schemaVersion: 1;
  workflowId: "CONTRACT_ANALYSIS_V1";
  caseId: string;
  revision: number;
  mode: ContractWorkflowMode;
  stage: ContractStage;
  closedCheckpoints: ContractCheckpoint[];
  history: ContractCheckpointEvent[];
  createdAt: string;
  updatedAt: string;
};

const CASE_ID =
  /^case_[a-f0-9]{32}$/;
const AUDIT_REF =
  /^[A-Za-z0-9._:/-]{3,240}$/;
const REASON_CONTROL =
  /[\x00-\x1f\x7f]/g;
const HISTORY_MAX = 128;

const COMMON_SEQUENCE:
  readonly ContractCheckpoint[] = [
    "AU-F0",
    "AU-GAP",
    "AU-POV",
    "AU-ROUTE"
  ];

const ANALYSIS_SEQUENCE:
  readonly ContractCheckpoint[] = [
    "AU-A",
    "AU-B",
    "AU-C",
    "AU-D",
    "AU-F"
  ];

const GENERATION_SEQUENCE:
  readonly ContractCheckpoint[] = [
    "AU-GENCORE",
    "AU-GENBUILD",
    "AU-GENSHARED"
  ];

const FINALIZATION_SEQUENCE:
  readonly ContractCheckpoint[] = [
    "AU-HYBRID",
    "AU-STRIP",
    "AU-POST",
    "AU-DISC"
  ];

const OBJECTIVE_NA =
  new Set<ContractCheckpoint>([
    "AU-GAP",
    "AU-POV"
  ]);

function validIso(
  value: string
): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 64 &&
    !Number.isNaN(
      Date.parse(value)
    )
  );
}

function sequenceForMode(
  mode: ContractWorkflowMode
): ContractCheckpoint[] {
  return [
    ...COMMON_SEQUENCE,
    ...(
      mode === "ANALYSIS"
        ? ANALYSIS_SEQUENCE
        : GENERATION_SEQUENCE
    ),
    ...FINALIZATION_SEQUENCE
  ];
}

function stageForCheckpoint(
  checkpoint: ContractCheckpoint | null
): ContractStage {
  if (!checkpoint) {
    return "COMPLETE";
  }
  if (
    COMMON_SEQUENCE.includes(
      checkpoint
    )
  ) {
    return "INTAKE";
  }
  if (
    ANALYSIS_SEQUENCE.includes(
      checkpoint
    )
  ) {
    return "ANALYSIS";
  }
  if (
    GENERATION_SEQUENCE.includes(
      checkpoint
    )
  ) {
    return "GENERATION";
  }
  return "FINALIZATION";
}

function sanitizeAuditRefs(
  values: readonly string[]
): string[] {
  const refs = [
    ...new Set(
      values.map(
        (value) =>
          value.trim()
      )
    )
  ];
  if (
    refs.length < 1 ||
    refs.length > 64 ||
    refs.some(
      (value) =>
        !AUDIT_REF.test(value)
    )
  ) {
    throw new Error(
      "CONTRACT_AUDIT_REFS_INVALID"
    );
  }
  return refs;
}

function sanitizeReason(
  value: string
): string {
  const reason = value
    .normalize("NFKC")
    .replace(
      REASON_CONTROL,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  if (
    reason.length < 3 ||
    reason.length > 500
  ) {
    throw new Error(
      "CONTRACT_NA_REASON_INVALID"
    );
  }
  return reason;
}

function clone(
  state: ContractAnalysisState
): ContractAnalysisState {
  return {
    ...state,
    closedCheckpoints: [
      ...state.closedCheckpoints
    ],
    history:
      state.history.map(
        (event) => ({
          ...event,
          auditRefs: [
            ...event.auditRefs
          ]
        })
      )
  };
}

export function createContractAnalysisState(
  caseId: string,
  mode: ContractWorkflowMode,
  at = new Date().toISOString()
): ContractAnalysisState {
  if (
    !CASE_ID.test(caseId) ||
    ![
      "ANALYSIS",
      "REDACTION",
      "DRAFT",
      "SUPPLEMENT"
    ].includes(mode) ||
    !validIso(at)
  ) {
    throw new Error(
      "CONTRACT_INITIAL_STATE_INVALID"
    );
  }

  return {
    schemaVersion: 1,
    workflowId:
      "CONTRACT_ANALYSIS_V1",
    caseId,
    revision: 1,
    mode,
    stage: "INTAKE",
    closedCheckpoints: [],
    history: [],
    createdAt: at,
    updatedAt: at
  };
}

export function nextContractCheckpoint(
  input: ContractAnalysisState
): ContractCheckpoint | null {
  const state =
    validateContractAnalysisState(
      input
    );
  const sequence =
    sequenceForMode(
      state.mode
    );
  return (
    sequence[
      state.closedCheckpoints
        .length
    ] ?? null
  );
}

export function validateContractAnalysisState(
  input: ContractAnalysisState
): ContractAnalysisState {
  if (
    input.schemaVersion !== 1 ||
    input.workflowId !==
      "CONTRACT_ANALYSIS_V1" ||
    !CASE_ID.test(input.caseId) ||
    !Number.isSafeInteger(
      input.revision
    ) ||
    input.revision < 1 ||
    ![
      "ANALYSIS",
      "REDACTION",
      "DRAFT",
      "SUPPLEMENT"
    ].includes(input.mode) ||
    ![
      "INTAKE",
      "ANALYSIS",
      "GENERATION",
      "FINALIZATION",
      "COMPLETE"
    ].includes(input.stage) ||
    !Array.isArray(
      input.closedCheckpoints
    ) ||
    !Array.isArray(
      input.history
    ) ||
    input.history.length >
      HISTORY_MAX ||
    !validIso(
      input.createdAt
    ) ||
    !validIso(
      input.updatedAt
    )
  ) {
    throw new Error(
      "CONTRACT_STATE_INVALID"
    );
  }

  const sequence =
    sequenceForMode(input.mode);

  if (
    input.closedCheckpoints
      .length >
      sequence.length ||
    input.closedCheckpoints.some(
      (checkpoint, index) =>
        checkpoint !==
          sequence[index]
    )
  ) {
    throw new Error(
      "CONTRACT_CHECKPOINT_PREFIX_INVALID"
    );
  }

  const expectedStage =
    stageForCheckpoint(
      sequence[
        input.closedCheckpoints
          .length
      ] ?? null
    );
  if (
    input.stage !==
      expectedStage
  ) {
    throw new Error(
      "CONTRACT_STAGE_INVALID"
    );
  }

  if (
    input.history.length !==
      input.closedCheckpoints
        .length
  ) {
    throw new Error(
      "CONTRACT_HISTORY_INVALID"
    );
  }

  let previousSequence = 0;
  for (
    let index = 0;
    index <
    input.history.length;
    index += 1
  ) {
    const event =
      input.history[index]!;
    const checkpoint =
      input.closedCheckpoints[
        index
      ]!;
    if (
      event.sequence <=
        previousSequence ||
      !Number.isSafeInteger(
        event.sequence
      ) ||
      !validIso(event.at) ||
      event.checkpoint !==
        checkpoint ||
      ![
        "DONE",
        "NA"
      ].includes(
        event.outcome
      ) ||
      ![
        "INTAKE",
        "ANALYSIS",
        "GENERATION",
        "FINALIZATION",
        "COMPLETE"
      ].includes(
        event.fromStage
      ) ||
      ![
        "INTAKE",
        "ANALYSIS",
        "GENERATION",
        "FINALIZATION",
        "COMPLETE"
      ].includes(
        event.toStage
      )
    ) {
      throw new Error(
        "CONTRACT_HISTORY_INVALID"
      );
    }
    sanitizeAuditRefs(
      event.auditRefs
    );
    if (
      event.outcome === "NA"
    ) {
      if (
        !OBJECTIVE_NA.has(
          event.checkpoint
        ) ||
        typeof event.reason !==
          "string"
      ) {
        throw new Error(
          "CONTRACT_NA_STATE_INVALID"
        );
      }
      sanitizeReason(
        event.reason
      );
    } else if (
      event.reason !==
        undefined
    ) {
      throw new Error(
        "CONTRACT_HISTORY_INVALID"
      );
    }
    previousSequence =
      event.sequence;
  }

  return clone(input);
}

function closeCheckpoint(
  input: ContractAnalysisState,
  checkpoint: ContractCheckpoint,
  outcome: ContractCheckpointOutcome,
  auditRefs: readonly string[],
  at: string,
  reason?: string
): ContractAnalysisState {
  const state =
    validateContractAnalysisState(
      input
    );
  if (!validIso(at)) {
    throw new Error(
      "CONTRACT_TIMESTAMP_INVALID"
    );
  }

  const expected =
    nextContractCheckpoint(
      state
    );
  if (
    expected !== checkpoint
  ) {
    throw new Error(
      `CONTRACT_CHECKPOINT_OUT_OF_ORDER:expected=${expected ?? "NONE"}:actual=${checkpoint}`
    );
  }

  const refs =
    sanitizeAuditRefs(
      auditRefs
    );
  const fromStage =
    state.stage;
  const sequence =
    sequenceForMode(
      state.mode
    );
  const nextIndex =
    state.closedCheckpoints
      .length + 1;
  const next =
    sequence[nextIndex] ??
    null;
  const toStage =
    stageForCheckpoint(next);

  state.closedCheckpoints.push(
    checkpoint
  );
  state.stage = toStage;
  state.revision += 1;
  state.updatedAt = at;
  state.history.push({
    sequence:
      (state.history.at(-1)
        ?.sequence ?? 0) + 1,
    at,
    checkpoint,
    outcome,
    fromStage,
    toStage,
    auditRefs: refs,
    ...(reason
      ? { reason }
      : {})
  });
  state.history =
    state.history.slice(
      -HISTORY_MAX
    );

  return validateContractAnalysisState(
    state
  );
}

export function completeContractCheckpoint(
  input: ContractAnalysisState,
  checkpoint: ContractCheckpoint,
  auditRefs: readonly string[],
  at = new Date().toISOString()
): ContractAnalysisState {
  return closeCheckpoint(
    input,
    checkpoint,
    "DONE",
    auditRefs,
    at
  );
}

export function markContractCheckpointNotApplicable(
  input: ContractAnalysisState,
  checkpoint: ContractCheckpoint,
  reason: string,
  auditRefs: readonly string[],
  at = new Date().toISOString()
): ContractAnalysisState {
  if (
    !OBJECTIVE_NA.has(
      checkpoint
    )
  ) {
    throw new Error(
      "CONTRACT_NA_NOT_ALLOWED"
    );
  }
  return closeCheckpoint(
    input,
    checkpoint,
    "NA",
    auditRefs,
    at,
    sanitizeReason(reason)
  );
}

export function contractWorkflowSequence(
  mode: ContractWorkflowMode
): ContractCheckpoint[] {
  return sequenceForMode(mode);
}

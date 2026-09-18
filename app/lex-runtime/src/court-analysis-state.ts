export const COURT_ANALYSIS_CHECKPOINTS = [
  "SD_VER_COMPLETE",
  "PASS_I_ISOLATION_CLEAN",
  "PASS_II_SOURCES_VERIFIED",
  "FIRST_VERIFICATION_COMPLETE",
  "FINAL_VERIFICATION_COMPLETE",
  "FINAL_GATE_APPROVED",
  "FINAL_REPORT_PRESENTED",
  "SITUATIONAL_REPORT_PRESENTED",
  "PROCESS_PLEADING_OFFER_PRESENTED"
] as const;

export type CourtAnalysisCheckpoint =
  typeof COURT_ANALYSIS_CHECKPOINTS[number];

export type CourtAnalysisStage =
  | "EVIDENCE_SCAN"
  | "PASS_I_FACTS"
  | "PASS_II_LAW"
  | "PASS_III_ADVERSARIAL"
  | "PASS_IV_FINAL_VERIFICATION"
  | "FINAL_REPORT"
  | "SITUATIONAL_REPORT"
  | "PROCESS_PLEADING_OFFER"
  | "COMPLETE";

export type CourtAnalysisEvent = {
  sequence: number;
  at: string;
  checkpoint: CourtAnalysisCheckpoint;
  fromStage: CourtAnalysisStage;
  toStage: CourtAnalysisStage;
  auditRefs: string[];
};

export type CourtAnalysisState = {
  schemaVersion: 1;
  workflowId: "COURT_ANALYSIS_V1";
  caseId: string;
  revision: number;
  stage: CourtAnalysisStage;
  closedCheckpoints: CourtAnalysisCheckpoint[];
  history: CourtAnalysisEvent[];
  createdAt: string;
  updatedAt: string;
};

const CASE_ID = /^case_[a-f0-9]{32}$/;
const AUDIT_REF = /^[A-Za-z0-9._:/-]{3,240}$/;
const HISTORY_MAX = 128;

const STAGE_SEQUENCE:
  Readonly<Record<
    CourtAnalysisStage,
    readonly CourtAnalysisCheckpoint[]
  >> = {
    EVIDENCE_SCAN: [
      "SD_VER_COMPLETE"
    ],
    PASS_I_FACTS: [
      "PASS_I_ISOLATION_CLEAN"
    ],
    PASS_II_LAW: [
      "PASS_II_SOURCES_VERIFIED"
    ],
    PASS_III_ADVERSARIAL: [
      "FIRST_VERIFICATION_COMPLETE"
    ],
    PASS_IV_FINAL_VERIFICATION: [
      "FINAL_VERIFICATION_COMPLETE",
      "FINAL_GATE_APPROVED"
    ],
    FINAL_REPORT: [
      "FINAL_REPORT_PRESENTED"
    ],
    SITUATIONAL_REPORT: [
      "SITUATIONAL_REPORT_PRESENTED"
    ],
    PROCESS_PLEADING_OFFER: [
      "PROCESS_PLEADING_OFFER_PRESENTED"
    ],
    COMPLETE: []
  };

function nextStage(
  stage: CourtAnalysisStage
): CourtAnalysisStage {
  switch (stage) {
    case "EVIDENCE_SCAN":
      return "PASS_I_FACTS";
    case "PASS_I_FACTS":
      return "PASS_II_LAW";
    case "PASS_II_LAW":
      return "PASS_III_ADVERSARIAL";
    case "PASS_III_ADVERSARIAL":
      return "PASS_IV_FINAL_VERIFICATION";
    case "PASS_IV_FINAL_VERIFICATION":
      return "FINAL_REPORT";
    case "FINAL_REPORT":
      return "SITUATIONAL_REPORT";
    case "SITUATIONAL_REPORT":
      return "PROCESS_PLEADING_OFFER";
    case "PROCESS_PLEADING_OFFER":
      return "COMPLETE";
    case "COMPLETE":
      return "COMPLETE";
  }
}

function validIso(
  value: string
): boolean {
  return (
    value.length > 0 &&
    value.length <= 64 &&
    !Number.isNaN(
      Date.parse(value)
    )
  );
}

function sanitizeAuditRefs(
  input: readonly string[]
): string[] {
  const refs = [
    ...new Set(
      input.map(
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
        !AUDIT_REF.test(
          value
        )
    )
  ) {
    throw new Error(
      "COURT_ANALYSIS_AUDIT_REFS_INVALID"
    );
  }
  return refs;
}

function clone(
  state: CourtAnalysisState
): CourtAnalysisState {
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

export function createCourtAnalysisState(
  caseId: string,
  at =
    new Date().toISOString()
): CourtAnalysisState {
  if (
    !CASE_ID.test(caseId) ||
    !validIso(at)
  ) {
    throw new Error(
      "COURT_ANALYSIS_INITIAL_STATE_INVALID"
    );
  }

  return {
    schemaVersion: 1,
    workflowId:
      "COURT_ANALYSIS_V1",
    caseId,
    revision: 1,
    stage:
      "EVIDENCE_SCAN",
    closedCheckpoints: [],
    history: [],
    createdAt: at,
    updatedAt: at
  };
}

export function validateCourtAnalysisState(
  input: CourtAnalysisState
): CourtAnalysisState {
  if (
    input.schemaVersion !== 1 ||
    input.workflowId !==
      "COURT_ANALYSIS_V1" ||
    !CASE_ID.test(
      input.caseId
    ) ||
    !Number.isSafeInteger(
      input.revision
    ) ||
    input.revision < 1 ||
    !Object.hasOwn(
      STAGE_SEQUENCE,
      input.stage
    ) ||
    !validIso(
      input.createdAt
    ) ||
    !validIso(
      input.updatedAt
    ) ||
    !Array.isArray(
      input.closedCheckpoints
    ) ||
    !Array.isArray(
      input.history
    ) ||
    input.history.length >
      HISTORY_MAX
  ) {
    throw new Error(
      "COURT_ANALYSIS_STATE_INVALID"
    );
  }

  const checkpointSet =
    new Set(
      input.closedCheckpoints
    );
  if (
    checkpointSet.size !==
      input.closedCheckpoints.length ||
    input.closedCheckpoints.some(
      (checkpoint) =>
        !COURT_ANALYSIS_CHECKPOINTS
          .includes(checkpoint)
    )
  ) {
    throw new Error(
      "COURT_ANALYSIS_STATE_INVALID"
    );
  }

  let previousSequence = 0;
  for (
    const event
    of input.history
  ) {
    if (
      !Number.isSafeInteger(
        event.sequence
      ) ||
      event.sequence <=
        previousSequence ||
      !validIso(event.at) ||
      !COURT_ANALYSIS_CHECKPOINTS
        .includes(
          event.checkpoint
        ) ||
      !Object.hasOwn(
        STAGE_SEQUENCE,
        event.fromStage
      ) ||
      !Object.hasOwn(
        STAGE_SEQUENCE,
        event.toStage
      )
    ) {
      throw new Error(
        "COURT_ANALYSIS_HISTORY_INVALID"
      );
    }
    sanitizeAuditRefs(
      event.auditRefs
    );
    previousSequence =
      event.sequence;
  }

  if (
    input.stage ===
      "FINAL_REPORT" &&
    (
      !checkpointSet.has(
        "FIRST_VERIFICATION_COMPLETE"
      ) ||
      !checkpointSet.has(
        "FINAL_VERIFICATION_COMPLETE"
      ) ||
      !checkpointSet.has(
        "FINAL_GATE_APPROVED"
      )
    )
  ) {
    throw new Error(
      "COURT_ANALYSIS_FINAL_GATE_INVALID"
    );
  }

  if (
    (
      input.stage ===
        "SITUATIONAL_REPORT" ||
      input.stage ===
        "PROCESS_PLEADING_OFFER" ||
      input.stage ===
        "COMPLETE"
    ) &&
    !checkpointSet.has(
      "FINAL_REPORT_PRESENTED"
    )
  ) {
    throw new Error(
      "COURT_ANALYSIS_DELIVERY_ORDER_INVALID"
    );
  }

  return clone(input);
}

export function nextCourtAnalysisCheckpoint(
  input: CourtAnalysisState
): CourtAnalysisCheckpoint | null {
  const state =
    validateCourtAnalysisState(
      input
    );
  const required =
    STAGE_SEQUENCE[
      state.stage
    ];
  return (
    required.find(
      (checkpoint) =>
        !state
          .closedCheckpoints
          .includes(
            checkpoint
          )
    ) ?? null
  );
}

export function completeCourtAnalysisCheckpoint(
  input: CourtAnalysisState,
  checkpoint:
    CourtAnalysisCheckpoint,
  auditRefs:
    readonly string[],
  at =
    new Date().toISOString()
): CourtAnalysisState {
  const state =
    validateCourtAnalysisState(
      input
    );
  if (
    state.stage ===
      "COMPLETE"
  ) {
    throw new Error(
      "COURT_ANALYSIS_ALREADY_COMPLETE"
    );
  }
  if (!validIso(at)) {
    throw new Error(
      "COURT_ANALYSIS_TIMESTAMP_INVALID"
    );
  }

  const expected =
    nextCourtAnalysisCheckpoint(
      state
    );
  if (
    expected !== checkpoint
  ) {
    throw new Error(
      `COURT_ANALYSIS_CHECKPOINT_OUT_OF_ORDER:expected=${expected ?? "NONE"}:actual=${checkpoint}`
    );
  }

  const refs =
    sanitizeAuditRefs(
      auditRefs
    );
  const fromStage =
    state.stage;
  state.closedCheckpoints.push(
    checkpoint
  );

  const remaining =
    STAGE_SEQUENCE[
      fromStage
    ].some(
      (required) =>
        !state
          .closedCheckpoints
          .includes(
            required
          )
    );
  const toStage =
    remaining
      ? fromStage
      : nextStage(
          fromStage
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
    fromStage,
    toStage,
    auditRefs: refs
  });
  state.history =
    state.history.slice(
      -HISTORY_MAX
    );

  return validateCourtAnalysisState(
    state
  );
}

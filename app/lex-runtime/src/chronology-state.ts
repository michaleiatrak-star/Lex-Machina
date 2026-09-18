export const CHRONOLOGY_CHECKPOINTS = [
  "DOCUMENT_INVENTORY_COMPLETE",
  "THREAD_IDENTIFICATION_COMPLETE",
  "EVENT_EXTRACTION_COMPLETE",
  "TEMPORAL_GATE_COMPLETE",
  "CONTRADICTION_INDEX_COMPLETE",
  "CHRONOLOGY_REPORT_COMPLETE"
] as const;

export type ChronologyCheckpoint =
  typeof CHRONOLOGY_CHECKPOINTS[number];

export type ChronologyStage =
  | "INVENTORY"
  | "THREADS"
  | "EXTRACTION"
  | "TEMPORAL_GATE"
  | "CONTRADICTIONS"
  | "REPORT"
  | "COMPLETE";

export type ChronologyEvent = {
  sequence: number;
  at: string;
  checkpoint: ChronologyCheckpoint;
  fromStage: ChronologyStage;
  toStage: ChronologyStage;
  auditRefs: string[];
};

export type ChronologyState = {
  schemaVersion: 1;
  workflowId: "CHRONOLOGY_V1";
  caseId: string;
  revision: number;
  stage: ChronologyStage;
  temporalGateRequired: boolean;
  closedCheckpoints: ChronologyCheckpoint[];
  history: ChronologyEvent[];
  createdAt: string;
  updatedAt: string;
};

const CASE_ID = /^case_[a-f0-9]{32}$/;
const AUDIT_REF = /^[A-Za-z0-9._:/-]{3,240}$/;
const HISTORY_MAX = 128;

function validIso(value: string): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 64 &&
    !Number.isNaN(Date.parse(value))
  );
}

function sanitizeAuditRefs(
  refs: readonly string[]
): string[] {
  const result = [
    ...new Set(
      refs.map((value) => value.trim())
    )
  ];
  if (
    result.length < 1 ||
    result.length > 64 ||
    result.some(
      (value) => !AUDIT_REF.test(value)
    )
  ) {
    throw new Error(
      "CHRONOLOGY_AUDIT_REFS_INVALID"
    );
  }
  return result;
}

function clone(
  state: ChronologyState
): ChronologyState {
  return {
    ...state,
    closedCheckpoints: [
      ...state.closedCheckpoints
    ],
    history: state.history.map(
      (event) => ({
        ...event,
        auditRefs: [
          ...event.auditRefs
        ]
      })
    )
  };
}

function checkpointForStage(
  stage: ChronologyStage
): ChronologyCheckpoint | null {
  switch (stage) {
    case "INVENTORY":
      return "DOCUMENT_INVENTORY_COMPLETE";
    case "THREADS":
      return "THREAD_IDENTIFICATION_COMPLETE";
    case "EXTRACTION":
      return "EVENT_EXTRACTION_COMPLETE";
    case "TEMPORAL_GATE":
      return "TEMPORAL_GATE_COMPLETE";
    case "CONTRADICTIONS":
      return "CONTRADICTION_INDEX_COMPLETE";
    case "REPORT":
      return "CHRONOLOGY_REPORT_COMPLETE";
    case "COMPLETE":
      return null;
  }
}

function nextStage(
  state: ChronologyState
): ChronologyStage {
  switch (state.stage) {
    case "INVENTORY":
      return "THREADS";
    case "THREADS":
      return "EXTRACTION";
    case "EXTRACTION":
      return state.temporalGateRequired
        ? "TEMPORAL_GATE"
        : "CONTRADICTIONS";
    case "TEMPORAL_GATE":
      return "CONTRADICTIONS";
    case "CONTRADICTIONS":
      return "REPORT";
    case "REPORT":
      return "COMPLETE";
    case "COMPLETE":
      return "COMPLETE";
  }
}

export function createChronologyState(
  caseId: string,
  at = new Date().toISOString()
): ChronologyState {
  if (!CASE_ID.test(caseId) || !validIso(at)) {
    throw new Error(
      "CHRONOLOGY_INITIAL_STATE_INVALID"
    );
  }
  return {
    schemaVersion: 1,
    workflowId: "CHRONOLOGY_V1",
    caseId,
    revision: 1,
    stage: "INVENTORY",
    temporalGateRequired: false,
    closedCheckpoints: [],
    history: [],
    createdAt: at,
    updatedAt: at
  };
}

export function validateChronologyState(
  input: ChronologyState
): ChronologyState {
  if (
    input.schemaVersion !== 1 ||
    input.workflowId !== "CHRONOLOGY_V1" ||
    !CASE_ID.test(input.caseId) ||
    !Number.isSafeInteger(input.revision) ||
    input.revision < 1 ||
    ![
      "INVENTORY",
      "THREADS",
      "EXTRACTION",
      "TEMPORAL_GATE",
      "CONTRADICTIONS",
      "REPORT",
      "COMPLETE"
    ].includes(input.stage) ||
    typeof input.temporalGateRequired !== "boolean" ||
    !Array.isArray(input.closedCheckpoints) ||
    !Array.isArray(input.history) ||
    input.history.length > HISTORY_MAX ||
    !validIso(input.createdAt) ||
    !validIso(input.updatedAt)
  ) {
    throw new Error(
      "CHRONOLOGY_STATE_INVALID"
    );
  }

  const closed = new Set(
    input.closedCheckpoints
  );
  if (
    closed.size !== input.closedCheckpoints.length ||
    input.closedCheckpoints.some(
      (checkpoint) =>
        !CHRONOLOGY_CHECKPOINTS.includes(checkpoint)
    )
  ) {
    throw new Error(
      "CHRONOLOGY_STATE_INVALID"
    );
  }

  if (
    !input.temporalGateRequired &&
    closed.has("TEMPORAL_GATE_COMPLETE")
  ) {
    throw new Error(
      "CHRONOLOGY_TEMPORAL_GATE_STATE_INVALID"
    );
  }
  if (
    input.stage === "TEMPORAL_GATE" &&
    !input.temporalGateRequired
  ) {
    throw new Error(
      "CHRONOLOGY_TEMPORAL_GATE_STATE_INVALID"
    );
  }

  let previous = 0;
  for (const event of input.history) {
    if (
      !Number.isSafeInteger(event.sequence) ||
      event.sequence <= previous ||
      !validIso(event.at) ||
      !CHRONOLOGY_CHECKPOINTS.includes(
        event.checkpoint
      ) ||
      ![
        "INVENTORY",
        "THREADS",
        "EXTRACTION",
        "TEMPORAL_GATE",
        "CONTRADICTIONS",
        "REPORT",
        "COMPLETE"
      ].includes(event.fromStage) ||
      ![
        "INVENTORY",
        "THREADS",
        "EXTRACTION",
        "TEMPORAL_GATE",
        "CONTRADICTIONS",
        "REPORT",
        "COMPLETE"
      ].includes(event.toStage)
    ) {
      throw new Error(
        "CHRONOLOGY_HISTORY_INVALID"
      );
    }
    sanitizeAuditRefs(event.auditRefs);
    previous = event.sequence;
  }

  if (
    input.stage === "COMPLETE" &&
    !closed.has(
      "CHRONOLOGY_REPORT_COMPLETE"
    )
  ) {
    throw new Error(
      "CHRONOLOGY_COMPLETE_STATE_INVALID"
    );
  }

  return clone(input);
}

export function requireChronologyTemporalGate(
  input: ChronologyState,
  required: boolean,
  at = new Date().toISOString()
): ChronologyState {
  const state = validateChronologyState(input);
  if (!required || state.temporalGateRequired) {
    return state;
  }
  if (!validIso(at)) {
    throw new Error(
      "CHRONOLOGY_TIMESTAMP_INVALID"
    );
  }
  if (
    state.stage === "CONTRADICTIONS" ||
    state.stage === "REPORT" ||
    state.stage === "COMPLETE"
  ) {
    throw new Error(
      "CHRONOLOGY_TEMPORAL_GATE_LATE_TRIGGER"
    );
  }
  state.temporalGateRequired = true;
  state.revision += 1;
  state.updatedAt = at;
  return validateChronologyState(state);
}

export function nextChronologyCheckpoint(
  input: ChronologyState
): ChronologyCheckpoint | null {
  const state = validateChronologyState(input);
  return checkpointForStage(state.stage);
}

export function completeChronologyCheckpoint(
  input: ChronologyState,
  checkpoint: ChronologyCheckpoint,
  auditRefs: readonly string[],
  at = new Date().toISOString()
): ChronologyState {
  const state = validateChronologyState(input);
  if (state.stage === "COMPLETE") {
    throw new Error(
      "CHRONOLOGY_ALREADY_COMPLETE"
    );
  }
  if (!validIso(at)) {
    throw new Error(
      "CHRONOLOGY_TIMESTAMP_INVALID"
    );
  }
  const expected = checkpointForStage(
    state.stage
  );
  if (expected !== checkpoint) {
    throw new Error(
      `CHRONOLOGY_CHECKPOINT_OUT_OF_ORDER:expected=${expected ?? "NONE"}:actual=${checkpoint}`
    );
  }
  const refs = sanitizeAuditRefs(
    auditRefs
  );
  const fromStage = state.stage;
  const toStage = nextStage(state);

  state.closedCheckpoints.push(
    checkpoint
  );
  state.stage = toStage;
  state.revision += 1;
  state.updatedAt = at;
  state.history.push({
    sequence:
      (state.history.at(-1)?.sequence ?? 0) + 1,
    at,
    checkpoint,
    fromStage,
    toStage,
    auditRefs: refs
  });
  state.history = state.history.slice(
    -HISTORY_MAX
  );

  return validateChronologyState(state);
}

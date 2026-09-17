export const PROCESS_PLEADING_CHECKPOINTS = [
  "CP-1a",
  "CP-1b",
  "CP-1c-skan",
  "CP-PD",
  "CP-FSL-D",
  "CP-1c-macierz",
  "CP-1c-lancuch",
  "CP-1d-anomalie",
  "CP-1d",
  "CP-W1",
  "CP-PRE-W2",
  "CP-ATAK",
  "CP-PODMIOT",
  "CP-QUALITY",
  "CP-AUDYT",
  "CP-PEER"
] as const;

export type ProcessPleadingCheckpoint =
  typeof PROCESS_PLEADING_CHECKPOINTS[number];

export type ProcessPleadingCheckpointStatus =
  | "OPEN"
  | "PENDING_CONFIRMATION"
  | "CLOSED"
  | "NA";

export type ProcessPleadingStage =
  | "CG_ACCEPTANCE"
  | "W1"
  | "PRE_W2"
  | "W2"
  | "W3"
  | "FINAL";

export type ProcessPleadingMode =
  | "CHECKPOINT"
  | "AUTO";

export type ProcessPleadingStateEvent = {
  sequence: number;
  at: string;
  type:
    | "INITIALIZED"
    | "START_ACCEPTED"
    | "CHECKPOINT_READY"
    | "CHECKPOINT_CONFIRMED"
    | "CHECKPOINT_NA"
    | "STAGE_ADVANCED"
    | "FINALIZED";
  checkpoint?: ProcessPleadingCheckpoint;
  fromStage?: ProcessPleadingStage;
  toStage?: ProcessPleadingStage;
};

export type ProcessPleadingState = {
  schemaVersion: 1;
  workflowId: "PROCESS_PLEADING_V1";
  caseId: string;
  mode: ProcessPleadingMode;
  stage: ProcessPleadingStage;
  documentStatus: "DRAFT" | "FINAL";
  startAccepted: boolean;
  pendingCheckpoint: ProcessPleadingCheckpoint | null;
  checkpoints: Record<
    ProcessPleadingCheckpoint,
    ProcessPleadingCheckpointStatus
  >;
  history: ProcessPleadingStateEvent[];
  createdAt: string;
  updatedAt: string;
};

const CASE_ID = /^case_[a-f0-9]{32}$/;
const ISO_DATE_MAX = 64;
const HISTORY_MAX = 256;

const CHECKPOINT_STAGE:
  Readonly<Record<
    ProcessPleadingCheckpoint,
    Exclude<
      ProcessPleadingStage,
      "CG_ACCEPTANCE" | "FINAL"
    >
  >> = {
    "CP-1a": "W1",
    "CP-1b": "W1",
    "CP-1c-skan": "W1",
    "CP-PD": "W1",
    "CP-FSL-D": "W1",
    "CP-1c-macierz": "W1",
    "CP-1c-lancuch": "W1",
    "CP-1d-anomalie": "W1",
    "CP-1d": "W1",
    "CP-W1": "W1",
    "CP-PRE-W2": "PRE_W2",
    "CP-ATAK": "W2",
    "CP-PODMIOT": "W3",
    "CP-QUALITY": "W3",
    "CP-AUDYT": "W3",
    "CP-PEER": "W3"
  };

const MAIN_STAGE_CHECKPOINTS:
  Readonly<Record<
    Exclude<ProcessPleadingStage, "CG_ACCEPTANCE" | "FINAL">,
    readonly ProcessPleadingCheckpoint[]
  >> = {
    W1: ["CP-W1"],
    PRE_W2: ["CP-PRE-W2"],
    W2: ["CP-ATAK"],
    W3: [
      "CP-PODMIOT",
      "CP-QUALITY",
      "CP-AUDYT",
      "CP-PEER"
    ]
  };

function validIso(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= ISO_DATE_MAX &&
    !Number.isNaN(Date.parse(value))
  );
}

function cloneState(
  state: ProcessPleadingState
): ProcessPleadingState {
  return {
    ...state,
    checkpoints: {
      ...state.checkpoints
    },
    history: state.history.map(
      (event) => ({ ...event })
    )
  };
}

function pushEvent(
  state: ProcessPleadingState,
  event: Omit<
    ProcessPleadingStateEvent,
    "sequence" | "at"
  >,
  at: string
): void {
  state.history.push({
    sequence:
      (state.history.at(-1)?.sequence ?? 0) + 1,
    at,
    ...event
  });
  state.history =
    state.history.slice(-HISTORY_MAX);
  state.updatedAt = at;
}

function advanceStageIfReady(
  state: ProcessPleadingState,
  at: string
): void {
  const previous = state.stage;
  const next: ProcessPleadingStage | null =
    previous === "W1"
      ? "PRE_W2"
      : previous === "PRE_W2"
        ? "W2"
        : previous === "W2"
          ? "W3"
          : previous === "W3" &&
              state.checkpoints["CP-PEER"] === "CLOSED"
            ? "FINAL"
            : null;

  if (!next) return;

  state.stage = next;
  pushEvent(
    state,
    {
      type:
        next === "FINAL"
          ? "FINALIZED"
          : "STAGE_ADVANCED",
      fromStage: previous,
      toStage: next
    },
    at
  );
  if (next === "FINAL") {
    state.documentStatus = "FINAL";
  }
}

export function createProcessPleadingState(
  caseId: string,
  mode: ProcessPleadingMode = "CHECKPOINT",
  at = new Date().toISOString()
): ProcessPleadingState {
  if (!CASE_ID.test(caseId)) {
    throw new Error(
      "PROCESS_PLEADING_CASE_ID_INVALID"
    );
  }
  if (!validIso(at)) {
    throw new Error(
      "PROCESS_PLEADING_TIMESTAMP_INVALID"
    );
  }

  const checkpoints =
    Object.fromEntries(
      PROCESS_PLEADING_CHECKPOINTS.map(
        (checkpoint) => [
          checkpoint,
          "OPEN" as const
        ]
      )
    ) as ProcessPleadingState["checkpoints"];

  return {
    schemaVersion: 1,
    workflowId:
      "PROCESS_PLEADING_V1",
    caseId,
    mode,
    stage: "CG_ACCEPTANCE",
    documentStatus: "DRAFT",
    startAccepted: false,
    pendingCheckpoint: null,
    checkpoints,
    history: [
      {
        sequence: 1,
        at,
        type: "INITIALIZED"
      }
    ],
    createdAt: at,
    updatedAt: at
  };
}

export function validateProcessPleadingState(
  input: ProcessPleadingState
): ProcessPleadingState {
  if (
    input.schemaVersion !== 1 ||
    input.workflowId !==
      "PROCESS_PLEADING_V1" ||
    !CASE_ID.test(input.caseId) ||
    !["CHECKPOINT", "AUTO"].includes(
      input.mode
    ) ||
    ![
      "CG_ACCEPTANCE",
      "W1",
      "PRE_W2",
      "W2",
      "W3",
      "FINAL"
    ].includes(input.stage) ||
    !["DRAFT", "FINAL"].includes(
      input.documentStatus
    ) ||
    typeof input.startAccepted !==
      "boolean" ||
    !validIso(input.createdAt) ||
    !validIso(input.updatedAt) ||
    !Array.isArray(input.history) ||
    input.history.length < 1 ||
    input.history.length > HISTORY_MAX
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_INVALID"
    );
  }

  if (
    input.pendingCheckpoint !== null &&
    !PROCESS_PLEADING_CHECKPOINTS.includes(
      input.pendingCheckpoint
    )
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_INVALID"
    );
  }

  for (
    const checkpoint
    of PROCESS_PLEADING_CHECKPOINTS
  ) {
    if (
      ![
        "OPEN",
        "PENDING_CONFIRMATION",
        "CLOSED",
        "NA"
      ].includes(
        input.checkpoints?.[checkpoint]
      )
    ) {
      throw new Error(
        "PROCESS_PLEADING_STATE_INVALID"
      );
    }
  }

  const pending = PROCESS_PLEADING_CHECKPOINTS
    .filter(
      (checkpoint) =>
        input.checkpoints[checkpoint] ===
          "PENDING_CONFIRMATION"
    );
  if (
    pending.length > 1 ||
    (
      pending.length === 1 &&
      input.pendingCheckpoint !==
        pending[0]
    ) ||
    (
      pending.length === 0 &&
      input.pendingCheckpoint !== null
    )
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_INVALID"
    );
  }

  if (
    input.stage === "CG_ACCEPTANCE" &&
    input.startAccepted
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_INVALID"
    );
  }
  if (
    input.stage !== "CG_ACCEPTANCE" &&
    !input.startAccepted
  ) {
    throw new Error(
      "PROCESS_PLEADING_STATE_INVALID"
    );
  }
  if (
    input.stage === "FINAL" &&
    (
      input.documentStatus !== "FINAL" ||
      input.checkpoints["CP-PEER"] !==
        "CLOSED" ||
      input.pendingCheckpoint !== null
    )
  ) {
    throw new Error(
      "PROCESS_PLEADING_FINAL_INVALID"
    );
  }
  if (
    input.stage !== "FINAL" &&
    input.documentStatus !== "DRAFT"
  ) {
    throw new Error(
      "PROCESS_PLEADING_DRAFT_REQUIRED"
    );
  }

  let previousSequence = 0;
  for (const event of input.history) {
    if (
      !Number.isInteger(event.sequence) ||
      event.sequence <= previousSequence ||
      !validIso(event.at)
    ) {
      throw new Error(
        "PROCESS_PLEADING_HISTORY_INVALID"
      );
    }
    previousSequence = event.sequence;
  }

  return cloneState(input);
}

export function acceptProcessPleadingStart(
  input: ProcessPleadingState,
  at = new Date().toISOString()
): ProcessPleadingState {
  const state =
    validateProcessPleadingState(input);
  if (
    state.stage !== "CG_ACCEPTANCE" ||
    state.startAccepted
  ) {
    throw new Error(
      "PROCESS_PLEADING_START_TRANSITION_INVALID"
    );
  }
  state.startAccepted = true;
  state.stage = "W1";
  pushEvent(
    state,
    {
      type: "START_ACCEPTED",
      fromStage: "CG_ACCEPTANCE",
      toStage: "W1"
    },
    at
  );
  return validateProcessPleadingState(
    state
  );
}

export function markProcessCheckpointReady(
  input: ProcessPleadingState,
  checkpoint: ProcessPleadingCheckpoint,
  at = new Date().toISOString()
): ProcessPleadingState {
  const state =
    validateProcessPleadingState(input);
  if (
    state.stage === "CG_ACCEPTANCE" ||
    state.stage === "FINAL" ||
    state.pendingCheckpoint !== null ||
    state.checkpoints[checkpoint] !==
      "OPEN" ||
    CHECKPOINT_STAGE[checkpoint] !==
      state.stage
  ) {
    throw new Error(
      "PROCESS_PLEADING_CHECKPOINT_TRANSITION_INVALID"
    );
  }

  const mandatory =
    MAIN_STAGE_CHECKPOINTS[
      state.stage
    ];
  if (
    mandatory.includes(checkpoint) ===
      false &&
    state.mode === "AUTO"
  ) {
    // AUTO may run conditional checkpoints,
    // but does not wait for confirmation.
  }

  state.checkpoints[checkpoint] =
    state.mode === "AUTO"
      ? "CLOSED"
      : "PENDING_CONFIRMATION";
  state.pendingCheckpoint =
    state.mode === "CHECKPOINT"
      ? checkpoint
      : null;

  pushEvent(
    state,
    {
      type: "CHECKPOINT_READY",
      checkpoint
    },
    at
  );

  if (state.mode === "AUTO") {
    pushEvent(
      state,
      {
        type: "CHECKPOINT_CONFIRMED",
        checkpoint
      },
      at
    );
    if (
      mandatory.includes(checkpoint)
    ) {
      const allMandatoryClosed =
        mandatory.every(
          (item) =>
            state.checkpoints[item] ===
              "CLOSED" ||
            state.checkpoints[item] ===
              "NA"
        );
      if (allMandatoryClosed) {
        advanceStageIfReady(
          state,
          at
        );
      }
    }
  }

  return validateProcessPleadingState(
    state
  );
}

export function confirmProcessCheckpoint(
  input: ProcessPleadingState,
  checkpoint: ProcessPleadingCheckpoint,
  at = new Date().toISOString()
): ProcessPleadingState {
  const state =
    validateProcessPleadingState(input);
  if (
    state.mode !== "CHECKPOINT" ||
    state.pendingCheckpoint !==
      checkpoint ||
    state.checkpoints[checkpoint] !==
      "PENDING_CONFIRMATION"
  ) {
    throw new Error(
      "PROCESS_PLEADING_CONFIRMATION_INVALID"
    );
  }

  state.checkpoints[checkpoint] =
    "CLOSED";
  state.pendingCheckpoint = null;
  pushEvent(
    state,
    {
      type: "CHECKPOINT_CONFIRMED",
      checkpoint
    },
    at
  );

  const mandatory =
    state.stage === "W1" ||
    state.stage === "PRE_W2" ||
    state.stage === "W2" ||
    state.stage === "W3"
      ? MAIN_STAGE_CHECKPOINTS[
          state.stage
        ]
      : [];
  if (
    mandatory.includes(checkpoint) &&
    mandatory.every(
      (item) =>
        state.checkpoints[item] ===
          "CLOSED" ||
        state.checkpoints[item] ===
          "NA"
    )
  ) {
    advanceStageIfReady(
      state,
      at
    );
  }

  return validateProcessPleadingState(
    state
  );
}

export function markProcessCheckpointNotApplicable(
  input: ProcessPleadingState,
  checkpoint: ProcessPleadingCheckpoint,
  at = new Date().toISOString()
): ProcessPleadingState {
  const state =
    validateProcessPleadingState(input);
  if (
    state.stage === "CG_ACCEPTANCE" ||
    state.stage === "FINAL" ||
    state.pendingCheckpoint !== null ||
    state.checkpoints[checkpoint] !==
      "OPEN" ||
    CHECKPOINT_STAGE[checkpoint] !==
      state.stage ||
    MAIN_STAGE_CHECKPOINTS[
      state.stage
    ].includes(checkpoint)
  ) {
    throw new Error(
      "PROCESS_PLEADING_NA_TRANSITION_INVALID"
    );
  }
  state.checkpoints[checkpoint] = "NA";
  pushEvent(
    state,
    {
      type: "CHECKPOINT_NA",
      checkpoint
    },
    at
  );
  return validateProcessPleadingState(
    state
  );
}

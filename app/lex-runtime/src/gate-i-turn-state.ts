export type GateITurnPhase =
  | "ROUTER_PREFLIGHT"
  | "SKILL_PREFLIGHT"
  | "RESOURCE_READS"
  | "SEMANTIC_EXECUTION"
  | "SOURCE_VERIFICATION"
  | "CITATION_VALIDATION"
  | "OUTPUT_VALIDATION"
  | "FINALIZATION"
  | "COMPLETE"
  | "BLOCKED";

export type GateITurnEvent = {
  sequence: number;
  phase: GateITurnPhase;
  result: "ENTER" | "PASS" | "BLOCKED";
  at: string;
  detail?: string;
};

export type GateITurnState = {
  schemaVersion: 1;
  workflowId: string;
  phase: GateITurnPhase;
  result: "IN_PROGRESS" | "PASS" | "BLOCKED";
  events: GateITurnEvent[];
};

const ORDER: readonly GateITurnPhase[] = [
  "ROUTER_PREFLIGHT",
  "SKILL_PREFLIGHT",
  "RESOURCE_READS",
  "SEMANTIC_EXECUTION",
  "SOURCE_VERIFICATION",
  "CITATION_VALIDATION",
  "OUTPUT_VALIDATION",
  "FINALIZATION",
  "COMPLETE"
] as const;

function now(): string {
  return new Date().toISOString();
}

function push(
  state: GateITurnState,
  phase: GateITurnPhase,
  result: GateITurnEvent["result"],
  detail?: string
): void {
  state.events.push({
    sequence:
      state.events.length + 1,
    phase,
    result,
    at: now(),
    ...(detail ? { detail } : {})
  });
}

export function createGateITurnState(
  workflowId: string
): GateITurnState {
  if (
    !/^[A-Z0-9_]{3,96}$/.test(
      workflowId
    )
  ) {
    throw new Error(
      "GATE_I_WORKFLOW_ID_INVALID"
    );
  }
  const state: GateITurnState = {
    schemaVersion: 1,
    workflowId,
    phase:
      "ROUTER_PREFLIGHT",
    result:
      "IN_PROGRESS",
    events: []
  };
  push(
    state,
    "ROUTER_PREFLIGHT",
    "ENTER"
  );
  return state;
}

export function passGateITurnPhase(
  state: GateITurnState,
  phase: Exclude<
    GateITurnPhase,
    "COMPLETE" | "BLOCKED"
  >,
  detail?: string
): GateITurnState {
  if (
    state.result !==
      "IN_PROGRESS" ||
    state.phase !== phase
  ) {
    throw new Error(
      "GATE_I_PHASE_TRANSITION_INVALID"
    );
  }

  push(
    state,
    phase,
    "PASS",
    detail
  );

  const index =
    ORDER.indexOf(phase);
  const next =
    ORDER[index + 1];
  if (!next) {
    throw new Error(
      "GATE_I_PHASE_TRANSITION_INVALID"
    );
  }

  state.phase = next;
  if (next === "COMPLETE") {
    state.result = "PASS";
    push(
      state,
      "COMPLETE",
      "PASS"
    );
  } else {
    push(
      state,
      next,
      "ENTER"
    );
  }

  return {
    ...state,
    events:
      state.events.map(
        (event) => ({
          ...event
        })
      )
  };
}

export function blockGateITurn(
  state: GateITurnState,
  detail: string
): GateITurnState {
  if (
    state.result !==
      "IN_PROGRESS"
  ) {
    throw new Error(
      "GATE_I_PHASE_TRANSITION_INVALID"
    );
  }

  push(
    state,
    state.phase,
    "BLOCKED",
    detail
  );
  state.phase =
    "BLOCKED";
  state.result =
    "BLOCKED";
  push(
    state,
    "BLOCKED",
    "BLOCKED",
    detail
  );

  return {
    ...state,
    events:
      state.events.map(
        (event) => ({
          ...event
        })
      )
  };
}

export type GuideAudience =
  | "LAIK"
  | "PRAWNIK";

export type GuideInteractionMode =
  | "PROWADZENIE"
  | "QA"
  | "MENU";

export type GuideStep =
  | "FAZA0"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "M"
  | "Q";

export type GuideSessionState = {
  schemaVersion: 1;
  sessionId: string;
  revision: number;
  audience: GuideAudience;
  interactionMode:
    GuideInteractionMode;
  rawAnalysis: boolean;
  step: GuideStep;
  guidedQuestionIndex: 0 | 1 | 2 | 3;
  pendingIrreversibleAction:
    | {
        actionId: string;
        warningAcknowledged:
          boolean;
      }
    | null;
  createdAt: string;
  updatedAt: string;
};

export type GuideTransition =
  | {
      type: "SET_AUDIENCE";
      audience: GuideAudience;
    }
  | {
      type:
        "SET_INTERACTION_MODE";
      mode:
        GuideInteractionMode;
    }
  | {
      type: "SET_RAW_ANALYSIS";
      enabled: boolean;
    }
  | {
      type: "MOVE_STEP";
      step: GuideStep;
    }
  | {
      type:
        "ADVANCE_GUIDED_QUESTION";
    }
  | {
      type:
        "BEGIN_IRREVERSIBLE_ACTION";
      actionId: string;
    }
  | {
      type:
        "ACKNOWLEDGE_IRREVERSIBLE_WARNING";
      actionId: string;
    }
  | {
      type:
        "CLEAR_IRREVERSIBLE_ACTION";
      actionId: string;
    };

const SESSION_ID =
  /^authsess_[a-f0-9]{32}$/;
const ACTION_ID =
  /^[A-Za-z0-9._:-]{3,96}$/;

export function parseGuideTransition(
  input: unknown
): GuideTransition | null {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return null;
  }
  const value =
    input as Record<string, unknown>;
  const type =
    typeof value.type === "string"
      ? value.type
      : "";

  if (
    type === "SET_AUDIENCE" &&
    (
      value.audience === "LAIK" ||
      value.audience === "PRAWNIK"
    )
  ) {
    return {
      type,
      audience: value.audience
    };
  }

  if (
    type === "SET_INTERACTION_MODE" &&
    (
      value.mode === "PROWADZENIE" ||
      value.mode === "QA" ||
      value.mode === "MENU"
    )
  ) {
    return {
      type,
      mode: value.mode
    };
  }

  if (
    type === "SET_RAW_ANALYSIS" &&
    typeof value.enabled ===
      "boolean"
  ) {
    return {
      type,
      enabled: value.enabled
    };
  }

  if (
    type === "MOVE_STEP" &&
    typeof value.step === "string" &&
    [
      "FAZA0",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "M",
      "Q"
    ].includes(value.step)
  ) {
    return {
      type,
      step: value.step as
        GuideStep
    };
  }

  if (
    type ===
      "ADVANCE_GUIDED_QUESTION"
  ) {
    return { type };
  }

  if (
    (
      type ===
        "BEGIN_IRREVERSIBLE_ACTION" ||
      type ===
        "ACKNOWLEDGE_IRREVERSIBLE_WARNING" ||
      type ===
        "CLEAR_IRREVERSIBLE_ACTION"
    ) &&
    typeof value.actionId ===
      "string" &&
    ACTION_ID.test(
      value.actionId
    )
  ) {
    return {
      type,
      actionId:
        value.actionId
    } as GuideTransition;
  }

  return null;
}

const ALLOWED_STEP_TRANSITIONS:
  Readonly<
    Record<
      GuideStep,
      readonly GuideStep[]
    >
  > = {
    FAZA0: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "M",
      "Q"
    ],
    A: ["G", "H", "I", "Q"],
    B: ["G", "H", "I", "Q"],
    C: ["D", "I", "Q"],
    D: ["I", "Q"],
    E: ["H", "I", "Q"],
    F: ["H", "I", "Q"],
    G: ["B", "H", "I", "Q"],
    H: ["I", "Q"],
    I: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "M",
      "Q"
    ],
    M: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "Q"
    ],
    Q: [
      "Q",
      "I",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "M"
    ]
  };

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

function clone(
  state: GuideSessionState
): GuideSessionState {
  return {
    ...state,
    pendingIrreversibleAction:
      state.pendingIrreversibleAction
        ? {
            ...state
              .pendingIrreversibleAction
          }
        : null
  };
}

export function validateGuideSessionState(
  state: GuideSessionState
): GuideSessionState {
  if (
    state.schemaVersion !== 1 ||
    !SESSION_ID.test(
      state.sessionId
    ) ||
    !Number.isSafeInteger(
      state.revision
    ) ||
    state.revision < 1 ||
    ![
      "LAIK",
      "PRAWNIK"
    ].includes(
      state.audience
    ) ||
    ![
      "PROWADZENIE",
      "QA",
      "MENU"
    ].includes(
      state.interactionMode
    ) ||
    typeof state.rawAnalysis !==
      "boolean" ||
    !Object.keys(
      ALLOWED_STEP_TRANSITIONS
    ).includes(
      state.step
    ) ||
    ![0, 1, 2, 3].includes(
      state.guidedQuestionIndex
    ) ||
    !validIso(
      state.createdAt
    ) ||
    !validIso(
      state.updatedAt
    )
  ) {
    throw new Error(
      "GUIDE_SESSION_STATE_INVALID"
    );
  }

  if (
    state.pendingIrreversibleAction
  ) {
    if (
      !ACTION_ID.test(
        state
          .pendingIrreversibleAction
          .actionId
      ) ||
      typeof state
        .pendingIrreversibleAction
        .warningAcknowledged !==
        "boolean"
    ) {
      throw new Error(
        "GUIDE_SESSION_STATE_INVALID"
      );
    }
  }

  return clone(state);
}

export function createGuideSessionState(
  sessionId: string,
  audience:
    GuideAudience = "PRAWNIK",
  at = new Date().toISOString()
): GuideSessionState {
  const state:
    GuideSessionState = {
      schemaVersion: 1,
      sessionId,
      revision: 1,
      audience,
      interactionMode:
        "PROWADZENIE",
      rawAnalysis: false,
      step: "FAZA0",
      guidedQuestionIndex: 0,
      pendingIrreversibleAction:
        null,
      createdAt: at,
      updatedAt: at
    };
  return validateGuideSessionState(
    state
  );
}

export function applyGuideTransition(
  input: GuideSessionState,
  transition: GuideTransition,
  at = new Date().toISOString()
): GuideSessionState {
  const state =
    validateGuideSessionState(
      input
    );

  if (!validIso(at)) {
    throw new Error(
      "GUIDE_SESSION_TIMESTAMP_INVALID"
    );
  }

  if (
    state.pendingIrreversibleAction &&
    transition.type !==
      "ACKNOWLEDGE_IRREVERSIBLE_WARNING" &&
    transition.type !==
      "CLEAR_IRREVERSIBLE_ACTION"
  ) {
    throw new Error(
      "GUIDE_IRREVERSIBLE_ACTION_PENDING"
    );
  }

  switch (transition.type) {
    case "SET_AUDIENCE":
      state.audience =
        transition.audience;
      break;

    case "SET_INTERACTION_MODE":
      state.interactionMode =
        transition.mode;
      state.step =
        transition.mode === "MENU"
          ? "M"
          : transition.mode ===
              "QA"
            ? "Q"
            : state.step === "M" ||
                state.step === "Q"
              ? "FAZA0"
              : state.step;
      break;

    case "SET_RAW_ANALYSIS":
      state.rawAnalysis =
        transition.enabled;
      break;

    case "MOVE_STEP":
      if (
        !ALLOWED_STEP_TRANSITIONS[
          state.step
        ].includes(
          transition.step
        )
      ) {
        throw new Error(
          "GUIDE_STEP_TRANSITION_INVALID"
        );
      }
      state.step =
        transition.step;
      if (
        transition.step === "C"
      ) {
        state.guidedQuestionIndex =
          0;
      }
      break;

    case "ADVANCE_GUIDED_QUESTION":
      if (
        state.interactionMode !==
          "PROWADZENIE" ||
        state.step !== "C" ||
        state.guidedQuestionIndex >=
          3
      ) {
        throw new Error(
          "GUIDE_QUESTION_TRANSITION_INVALID"
        );
      }
      state.guidedQuestionIndex =
        (state.guidedQuestionIndex +
          1) as 1 | 2 | 3;
      break;

    case "BEGIN_IRREVERSIBLE_ACTION":
      if (
        state
          .pendingIrreversibleAction
      ) {
        throw new Error(
          "GUIDE_IRREVERSIBLE_ACTION_PENDING"
        );
      }
      if (
        !ACTION_ID.test(
          transition.actionId
        )
      ) {
        throw new Error(
          "GUIDE_IRREVERSIBLE_ACTION_ID_INVALID"
        );
      }
      state.pendingIrreversibleAction =
        {
          actionId:
            transition.actionId,
          warningAcknowledged:
            false
        };
      break;

    case "ACKNOWLEDGE_IRREVERSIBLE_WARNING":
      if (
        state
          .pendingIrreversibleAction
          ?.actionId !==
        transition.actionId
      ) {
        throw new Error(
          "GUIDE_IRREVERSIBLE_ACTION_MISMATCH"
        );
      }
      state
        .pendingIrreversibleAction
        .warningAcknowledged =
        true;
      break;

    case "CLEAR_IRREVERSIBLE_ACTION":
      if (
        state
          .pendingIrreversibleAction
          ?.actionId !==
          transition.actionId ||
        !state
          .pendingIrreversibleAction
          .warningAcknowledged
      ) {
        throw new Error(
          "GUIDE_IRREVERSIBLE_CONFIRMATION_REQUIRED"
        );
      }
      state.pendingIrreversibleAction =
        null;
      break;
  }

  state.revision += 1;
  state.updatedAt = at;
  return validateGuideSessionState(
    state
  );
}

export type GuideOutputReport = {
  questionCount: number;
  oneQuestionRuleActive: boolean;
  irreversibleWarningRequired:
    boolean;
  irreversibleWarningPresent:
    boolean;
  result:
    | "PASS"
    | "BLOCKED";
  violations: string[];
};

export function evaluateGuideOutput(
  state: Pick<
    GuideSessionState,
    | "interactionMode"
    | "pendingIrreversibleAction"
  >,
  text: string
): GuideOutputReport {
  const withoutCode =
    text.replace(
      /```[\s\S]*?```/g,
      ""
    );
  const withoutUrls =
    withoutCode.replace(
      /https?:\/\/\S+/gi,
      ""
    );
  const questionCount =
    (
      withoutUrls.match(
        /\?/g
      ) ?? []
    ).length;
  const oneQuestionRuleActive =
    state.interactionMode ===
      "PROWADZENIE";
  const irreversibleWarningRequired =
    Boolean(
      state
        .pendingIrreversibleAction &&
      !state
        .pendingIrreversibleAction
        .warningAcknowledged
    );
  const normalized =
    withoutCode
      .normalize("NFC")
      .toLocaleUpperCase("pl");
  const irreversibleWarningPresent =
    !irreversibleWarningRequired ||
    normalized.includes(
      "OSTRZEŻENIE"
    ) ||
    normalized.includes(
      "NIEODWRACAL"
    );

  const violations: string[] =
    [];
  if (
    oneQuestionRuleActive &&
    questionCount > 1
  ) {
    violations.push(
      "GUIDE_ONE_QUESTION_RULE"
    );
  }
  if (
    irreversibleWarningRequired &&
    !irreversibleWarningPresent
  ) {
    violations.push(
      "GUIDE_IRREVERSIBLE_WARNING_REQUIRED"
    );
  }

  return {
    questionCount,
    oneQuestionRuleActive,
    irreversibleWarningRequired,
    irreversibleWarningPresent,
    result:
      violations.length === 0
        ? "PASS"
        : "BLOCKED",
    violations
  };
}

export class GuideSessionStateStore {
  private readonly states =
    new Map<
      string,
      GuideSessionState
    >();

  get(
    sessionId: string
  ): GuideSessionState | null {
    const state =
      this.states.get(sessionId);
    return state
      ? validateGuideSessionState(
          state
        )
      : null;
  }

  initialize(
    sessionId: string,
    audience:
      GuideAudience = "PRAWNIK",
    at = new Date().toISOString()
  ): GuideSessionState {
    const existing =
      this.states.get(sessionId);
    if (existing) {
      return validateGuideSessionState(
        existing
      );
    }
    const state =
      createGuideSessionState(
        sessionId,
        audience,
        at
      );
    this.states.set(
      sessionId,
      state
    );
    return validateGuideSessionState(
      state
    );
  }

  transition(args: {
    sessionId: string;
    expectedRevision: number;
    transition: GuideTransition;
    at?: string;
  }): GuideSessionState {
    const current =
      this.states.get(
        args.sessionId
      );
    if (!current) {
      throw new Error(
        "GUIDE_SESSION_STATE_NOT_FOUND"
      );
    }
    if (
      current.revision !==
        args.expectedRevision
    ) {
      throw new Error(
        "GUIDE_SESSION_STATE_CONFLICT"
      );
    }
    const next =
      applyGuideTransition(
        current,
        args.transition,
        args.at
      );
    this.states.set(
      args.sessionId,
      next
    );
    return validateGuideSessionState(
      next
    );
  }

  revoke(
    sessionId: string
  ): boolean {
    return this.states.delete(
      sessionId
    );
  }

  clear(): void {
    this.states.clear();
  }
}

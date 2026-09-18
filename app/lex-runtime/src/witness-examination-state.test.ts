import {
  describe,
  expect,
  it
} from "vitest";
import {
  completeWitnessCheckpoint,
  confirmWitnessW2,
  createWitnessExaminationState,
  nextRequiredWitnessCheckpoint,
  validateWitnessExaminationState
} from "./witness-examination-state.js";

const CASE_ID =
  "case_" +
  "a".repeat(32);

function complete(
  state:
    ReturnType<
      typeof createWitnessExaminationState
    >,
  checkpoint:
    Parameters<
      typeof completeWitnessCheckpoint
    >[1],
  options?:
    Parameters<
      typeof completeWitnessCheckpoint
    >[3]
) {
  return completeWitnessCheckpoint(
    state,
    checkpoint,
    [
      "audit:witness-test"
    ],
    {
      ...options,
      at:
        options?.at ??
        "2026-09-18T10:00:00.000Z"
    }
  );
}

describe(
  "witness examination state",
  () => {
    it(
      "enforces the canonical PRE-W1/W1/W2/confirmation/W3 order",
      () => {
        let state =
          createWitnessExaminationState(
            CASE_ID,
            "2026-09-18T09:00:00.000Z"
          );

        expect(
          nextRequiredWitnessCheckpoint(
            state
          )
        ).toBe(
          "SD_VER_COMPLETE"
        );

        state = complete(
          state,
          "SD_VER_COMPLETE"
        );
        state = complete(
          state,
          "RZ_SHOW_COMPLETE"
        );
        state = complete(
          state,
          "WITNESS_INTELLIGENCE_COMPLETE"
        );
        state = complete(
          state,
          "CONTEXT_MAPPED",
          {
            outcome: "NA",
            reason:
              "Brak wcześniejszego kontekstu sprawy do importu."
          }
        );
        state = complete(
          state,
          "W1_INTAKE_COMPLETE"
        );
        state = complete(
          state,
          "W1_SUPPLEMENT_RESOLVED",
          {
            outcome: "NA",
            reason:
              "Intake był kompletny i nie wymagał pytań uzupełniających."
          }
        );
        state = complete(
          state,
          "W2_THESES_MODEL_COMPLETE"
        );

        expect(
          state.stage
        ).toBe(
          "AWAITING_W2_CONFIRMATION"
        );
        expect(
          nextRequiredWitnessCheckpoint(
            state
          )
        ).toBe(
          "W2_USER_CONFIRMED"
        );
        expect(() =>
          completeWitnessCheckpoint(
            state,
            "W2_USER_CONFIRMED",
            [
              "audit:test"
            ]
          )
        ).toThrow(
          "WITNESS_USER_CONFIRMATION_REQUIRED"
        );

        state =
          confirmWitnessW2(
            state,
            [
              "user-confirmation:w2"
            ],
            "2026-09-18T10:10:00.000Z"
          );
        expect(state.stage)
          .toBe(
            "PRE_W3_REREAD"
          );

        state = complete(
          state,
          "PRE_W3_REREAD_COMPLETE"
        );
        state = complete(
          state,
          "W3_QUESTIONS_COMPLETE"
        );

        expect(state.stage)
          .toBe(
            "QUESTION_SET_READY"
          );
        expect(
          state.deliverableStatus
        ).toBe(
          "QUESTION_SET_READY"
        );
        expect(
          nextRequiredWitnessCheckpoint(
            state
          )
        ).toBeNull();
        expect(
          state.closedCheckpoints
        ).toHaveLength(10);
        expect(state.revision)
          .toBe(11);
      }
    );

    it(
      "rejects checkpoint skipping",
      () => {
        const state =
          createWitnessExaminationState(
            CASE_ID
          );
        expect(() =>
          complete(
            state,
            "W1_INTAKE_COMPLETE"
          )
        ).toThrow(
          "WITNESS_CHECKPOINT_TRANSITION_INVALID"
        );
      }
    );

    it(
      "allows N/A only for optional context and W1 supplement checkpoints",
      () => {
        let state =
          createWitnessExaminationState(
            CASE_ID
          );
        state = complete(
          state,
          "SD_VER_COMPLETE"
        );
        state = complete(
          state,
          "RZ_SHOW_COMPLETE"
        );
        state = complete(
          state,
          "WITNESS_INTELLIGENCE_COMPLETE"
        );

        expect(() =>
          complete(
            state,
            "CONTEXT_MAPPED",
            {
              outcome: "NA",
              reason: "x"
            }
          )
        ).toThrow(
          "WITNESS_NA_REASON_INVALID"
        );

        state = complete(
          state,
          "CONTEXT_MAPPED",
          {
            outcome: "NA",
            reason:
              "Brak źródła kontekstu z wcześniejszej analizy."
          }
        );

        expect(() =>
          complete(
            state,
            "W1_INTAKE_COMPLETE",
            {
              outcome: "NA",
              reason:
                "Nie dotyczy"
            }
          )
        ).toThrow(
          "WITNESS_CHECKPOINT_NA_FORBIDDEN"
        );
      }
    );

    it(
      "rejects user confirmation before W2 theses/model are complete",
      () => {
        const state =
          createWitnessExaminationState(
            CASE_ID
          );
        expect(() =>
          confirmWitnessW2(
            state,
            [
              "user-confirmation:w2"
            ]
          )
        ).toThrow(
          "WITNESS_W2_CONFIRMATION_INVALID"
        );
      }
    );

    it(
      "rejects tampered state order and revision",
      () => {
        const state =
          createWitnessExaminationState(
            CASE_ID
          );
        state.closedCheckpoints =
          [
            "W1_INTAKE_COMPLETE"
          ];
        state.revision = 2;
        state.history = [
          {
            sequence: 1,
            at:
              "2026-09-18T10:00:00.000Z",
            checkpoint:
              "W1_INTAKE_COMPLETE",
            outcome: "DONE",
            fromStage:
              "PRE_W1_SD_VER",
            toStage:
              "PRE_W1_RZ_SHOW",
            auditRefs: [
              "audit:tamper"
            ]
          }
        ];
        state.stage =
          "PRE_W1_RZ_SHOW";

        expect(() =>
          validateWitnessExaminationState(
            state
          )
        ).toThrow(
          "WITNESS_STATE_SEQUENCE_INVALID"
        );
      }
    );
  }
);

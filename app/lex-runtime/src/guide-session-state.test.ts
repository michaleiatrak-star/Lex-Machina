import {
  describe,
  expect,
  it
} from "vitest";
import {
  GuideSessionStateStore,
  applyGuideTransition,
  createGuideSessionState,
  evaluateGuideOutput,
  parseGuideTransition
} from "./guide-session-state.js";

const SESSION =
  "authsess_" +
  "a".repeat(32);

describe(
  "session-bound legal guide state",
  () => {
    it(
      "keeps one ordered state across turns and rejects stale revisions",
      () => {
        const store =
          new GuideSessionStateStore();
        const initial =
          store.initialize(
            SESSION,
            "LAIK",
            "2026-09-18T09:00:00.000Z"
          );
        expect(initial.step)
          .toBe("FAZA0");
        expect(
          initial.interactionMode
        ).toBe("PROWADZENIE");

        const menu =
          store.transition({
            sessionId: SESSION,
            expectedRevision:
              initial.revision,
            transition: {
              type:
                "SET_INTERACTION_MODE",
              mode: "MENU"
            },
            at:
              "2026-09-18T09:00:01.000Z"
          });
        expect(menu.step).toBe("M");

        expect(() =>
          store.transition({
            sessionId: SESSION,
            expectedRevision:
              initial.revision,
            transition: {
              type:
                "SET_RAW_ANALYSIS",
              enabled: true
            }
          })
        ).toThrow(
          "GUIDE_SESSION_STATE_CONFLICT"
        );
      }
    );

    it(
      "enforces exactly three sequential diagnostic-question advances in guided KROK C",
      () => {
        let state =
          createGuideSessionState(
            SESSION,
            "LAIK"
          );
        state =
          applyGuideTransition(
            state,
            {
              type: "MOVE_STEP",
              step: "C"
            }
          );

        for (
          let index = 1;
          index <= 3;
          index += 1
        ) {
          state =
            applyGuideTransition(
              state,
              {
                type:
                  "ADVANCE_GUIDED_QUESTION"
              }
            );
          expect(
            state
              .guidedQuestionIndex
          ).toBe(index);
        }

        expect(() =>
          applyGuideTransition(
            state,
            {
              type:
                "ADVANCE_GUIDED_QUESTION"
            }
          )
        ).toThrow(
          "GUIDE_QUESTION_TRANSITION_INVALID"
        );
      }
    );

    it(
      "keeps raw-analysis mode explicit and session-scoped",
      () => {
        const raw =
          applyGuideTransition(
            createGuideSessionState(
              SESSION
            ),
            {
              type:
                "SET_RAW_ANALYSIS",
              enabled: true
            }
          );
        expect(raw.rawAnalysis)
          .toBe(true);

        const normal =
          applyGuideTransition(
            raw,
            {
              type:
                "SET_RAW_ANALYSIS",
              enabled: false
            }
          );
        expect(normal.rawAnalysis)
          .toBe(false);
      }
    );

    it(
      "blocks unrelated transitions while an irreversible action waits for warning acknowledgement",
      () => {
        let state =
          applyGuideTransition(
            createGuideSessionState(
              SESSION
            ),
            {
              type:
                "BEGIN_IRREVERSIBLE_ACTION",
              actionId:
                "submit-court-filing"
            }
          );

        expect(() =>
          applyGuideTransition(
            state,
            {
              type: "MOVE_STEP",
              step: "D"
            }
          )
        ).toThrow(
          "GUIDE_IRREVERSIBLE_ACTION_PENDING"
        );

        expect(() =>
          applyGuideTransition(
            state,
            {
              type:
                "CLEAR_IRREVERSIBLE_ACTION",
              actionId:
                "submit-court-filing"
            }
          )
        ).toThrow(
          "GUIDE_IRREVERSIBLE_CONFIRMATION_REQUIRED"
        );

        state =
          applyGuideTransition(
            state,
            {
              type:
                "ACKNOWLEDGE_IRREVERSIBLE_WARNING",
              actionId:
                "submit-court-filing"
            }
          );
        state =
          applyGuideTransition(
            state,
            {
              type:
                "CLEAR_IRREVERSIBLE_ACTION",
              actionId:
                "submit-court-filing"
            }
          );
        expect(
          state
            .pendingIrreversibleAction
        ).toBeNull();
      }
    );

    it(
      "parses only explicit guide transitions",
      () => {
        expect(
          parseGuideTransition({
            type:
              "SET_INTERACTION_MODE",
            mode: "QA"
          })
        ).toEqual({
          type:
            "SET_INTERACTION_MODE",
          mode: "QA"
        });
        expect(
          parseGuideTransition({
            type: "MOVE_STEP",
            step: "Z"
          })
        ).toBeNull();
        expect(
          parseGuideTransition({
            type:
              "BEGIN_IRREVERSIBLE_ACTION",
            actionId: "../escape"
          })
        ).toBeNull();
      }
    );

    it(
      "blocks multiple user-facing questions in PROWADZENIE but ignores question marks in code and URLs",
      () => {
        const state =
          createGuideSessionState(
            SESSION,
            "LAIK"
          );
        const pass =
          evaluateGuideOutput(
            state,
            "Co chcesz osiągnąć?\n```js\nconst x = '?'\n```\nŹródło: https://example.test/?q=1"
          );
        expect(pass.result)
          .toBe("PASS");
        expect(pass.questionCount)
          .toBe(1);

        const blocked =
          evaluateGuideOutput(
            state,
            "Co chcesz osiągnąć? Czy masz już dokument?"
          );
        expect(blocked.result)
          .toBe("BLOCKED");
        expect(blocked.violations)
          .toContain(
            "GUIDE_ONE_QUESTION_RULE"
          );
      }
    );

    it(
      "requires an explicit warning while an irreversible action awaits acknowledgement",
      () => {
        const state =
          applyGuideTransition(
            createGuideSessionState(
              SESSION
            ),
            {
              type:
                "BEGIN_IRREVERSIBLE_ACTION",
              actionId:
                "submit-court-filing"
            }
          );

        expect(
          evaluateGuideOutput(
            state,
            "Można przejść dalej."
          ).result
        ).toBe("BLOCKED");

        expect(
          evaluateGuideOutput(
            state,
            "OSTRZEŻENIE: złożenie pisma może wywołać skutek procesowy."
          ).result
        ).toBe("PASS");
      }
    );

    it(
      "deletes guide control state when its auth session is revoked",
      () => {
        const store =
          new GuideSessionStateStore();
        store.initialize(SESSION);
        expect(
          store.get(SESSION)
        ).not.toBeNull();
        expect(
          store.revoke(SESSION)
        ).toBe(true);
        expect(
          store.get(SESSION)
        ).toBeNull();
      }
    );
  }
);

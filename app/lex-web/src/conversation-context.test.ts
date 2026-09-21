import {
  describe,
  expect,
  it
} from "vitest";
import {
  conversationForProvider
} from "./conversation-context.js";
import type {
  CaseChatMessage
} from "./case-thread.js";

describe(
  "continued chat context",
  () => {
    it(
      "keeps earlier turns so the next message continues the same chat",
      () => {
        const messages:
          CaseChatMessage[] = [
            {
              id: "m1",
              role: "user",
              content:
                "Pierwsza wiadomość"
            },
            {
              id: "m2",
              role: "assistant",
              content:
                "Pierwsza odpowiedź"
            },
            {
              id: "m3",
              role: "user",
              content:
                "Druga wiadomość"
            },
            {
              id: "m4",
              role: "assistant",
              content:
                "Druga odpowiedź"
            }
          ];

        const context =
          conversationForProvider(
            messages,
            "Kontynuuj"
          );

        expect(context).toContain(
          "Użytkownik: Pierwsza wiadomość"
        );
        expect(context).toContain(
          "Asystent: Pierwsza odpowiedź"
        );
        expect(context).toContain(
          "Użytkownik: Druga wiadomość"
        );
        expect(context).toContain(
          "Asystent: Druga odpowiedź"
        );
        expect(context).toMatch(
          /Użytkownik: Kontynuuj$/
        );
      }
    );

    it(
      "keeps the newest context inside the runtime query budget",
      () => {
        const old =
          "STARY_".repeat(
            6_000
          );
        const messages:
          CaseChatMessage[] = [
            {
              id: "m1",
              role: "user",
              content: old
            },
            {
              id: "m2",
              role: "assistant",
              content:
                "NAJNOWSZA_ODPOWIEDZ"
            }
          ];

        const context =
          conversationForProvider(
            messages,
            "NAJNOWSZE_PYTANIE"
          );

        expect(
          context.length
        ).toBeLessThanOrEqual(
          28_000
        );
        expect(context).toContain(
          "NAJNOWSZA_ODPOWIEDZ"
        );
        expect(context).toMatch(
          /Użytkownik: NAJNOWSZE_PYTANIE$/
        );
      }
    );
  }
);

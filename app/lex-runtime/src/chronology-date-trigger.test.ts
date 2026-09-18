import {
  describe,
  expect,
  it
} from "vitest";
import {
  chronologyTemporalGateRequired,
  distinctChronologyDateTokens
} from "./chronology-date-trigger.js";

describe(
  "chronology temporal gate trigger",
  () => {
    it(
      "requires the gate for two distinct explicit dates",
      () => {
        expect(
          chronologyTemporalGateRequired([
            "Pismo z 12.03.2025 doręczono 18 marca 2025."
          ])
        ).toBe(true);
      }
    );

    it(
      "does not count the same date twice",
      () => {
        expect(
          chronologyTemporalGateRequired([
            "12.03.2025",
            "Ponownie: 12.03.2025"
          ])
        ).toBe(false);
      }
    );

    it(
      "accepts ISO and slash date formats but ignores standalone years",
      () => {
        expect(
          distinctChronologyDateTokens([
            "W 2025 roku.",
            "2025-03-12",
            "18/03/2025"
          ])
        ).toEqual([
          "18/03/2025",
          "2025-03-12"
        ]);
      }
    );
  }
);

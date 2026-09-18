import fs from "node:fs";
import path from "node:path";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  scoreLegalQualityCase,
  validateLegalQualityCorpus
} from "../src/legal-quality-benchmark-core.js";

function corpus() {
  const file = path.resolve(
    "tests/fixtures/legal-quality-synthetic-v1.json"
  );
  return validateLegalQualityCorpus(
    JSON.parse(
      fs.readFileSync(
        file,
        "utf8"
      )
    )
  );
}

describe(
  "deterministic legal-quality evaluator",
  () => {
    it(
      "validates the committed synthetic corpus",
      () => {
        const value = corpus();
        expect(value.cases)
          .toHaveLength(5);
        expect(
          value.confidentiality
        ).toBe("SYNTHETIC");
      }
    );

    it(
      "passes an exact source-bound answer",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "TIMELY",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "DEFAULT_14_DAY_RULE",
                sources: [
                  "R1"
                ]
              },
              {
                id:
                  "ISSUE_E_CHANNEL_EXCEPTION",
                verdict:
                  "SPECIAL_21_DAY_RULE_CONTROLS",
                sources: [
                  "R1",
                  "R2",
                  "F1",
                  "F2"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );

        expect(score.passed)
          .toBe(true);
        expect(
          score.issueRecall
        ).toBe(1);
        expect(
          score.citationRecall
        ).toBe(1);
        expect(
          score.citationPrecision
        ).toBe(1);
      }
    );

    it(
      "fails a wrong decision even with correct issues",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "LATE",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "DEFAULT_14_DAY_RULE",
                sources: [
                  "R1"
                ]
              },
              {
                id:
                  "ISSUE_E_CHANNEL_EXCEPTION",
                verdict:
                  "SPECIAL_21_DAY_RULE_CONTROLS",
                sources: [
                  "R1",
                  "R2",
                  "F1",
                  "F2"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );
        expect(score.passed)
          .toBe(false);
        expect(
          score.decisionCorrect
        ).toBe(false);
      }
    );

    it(
      "fails an incorrect issue verdict even when the decision and cited sources are otherwise exact",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "TIMELY",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "WRONG_VERDICT",
                sources: [
                  "R1"
                ]
              },
              {
                id:
                  "ISSUE_E_CHANNEL_EXCEPTION",
                verdict:
                  "SPECIAL_21_DAY_RULE_CONTROLS",
                sources: [
                  "R1",
                  "R2",
                  "F1",
                  "F2"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );

        expect(score.passed)
          .toBe(false);
        expect(
          score.decisionCorrect
        ).toBe(true);
        expect(
          score.issueRecall
        ).toBe(0.5);
      }
    );

    it(
      "fails missing issues and citations",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "TIMELY",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "DEFAULT_14_DAY_RULE",
                sources: [
                  "R1"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );
        expect(score.passed)
          .toBe(false);
        expect(
          score.issueRecall
        ).toBe(0.5);
        expect(
          score.citationRecall
        ).toBeLessThan(1);
        expect(
          score.missingIssueIds
        ).toContain(
          "ISSUE_E_CHANNEL_EXCEPTION"
        );
      }
    );

    it(
      "penalizes a real source assigned to the wrong issue",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "TIMELY",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "DEFAULT_14_DAY_RULE",
                sources: [
                  "R1",
                  "F1"
                ]
              },
              {
                id:
                  "ISSUE_E_CHANNEL_EXCEPTION",
                verdict:
                  "SPECIAL_21_DAY_RULE_CONTROLS",
                sources: [
                  "R1",
                  "R2",
                  "F1",
                  "F2"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );
        expect(score.passed)
          .toBe(false);
        expect(
          score.citationPrecision
        ).toBeLessThan(1);
        expect(
          score.unknownSourceCount
        ).toBe(0);
      }
    );

    it(
      "rejects an invented source id",
      () => {
        const sample =
          corpus().cases[0]!;
        const raw =
          JSON.stringify({
            decision: "TIMELY",
            issues: [
              {
                id:
                  "ISSUE_DEFAULT_DEADLINE",
                verdict:
                  "DEFAULT_14_DAY_RULE",
                sources: [
                  "R1",
                  "FAKE"
                ]
              },
              {
                id:
                  "ISSUE_E_CHANNEL_EXCEPTION",
                verdict:
                  "SPECIAL_21_DAY_RULE_CONTROLS",
                sources: [
                  "R1",
                  "R2",
                  "F1",
                  "F2"
                ]
              }
            ]
          });
        const score =
          scoreLegalQualityCase(
            sample,
            raw
          );
        expect(score.passed)
          .toBe(false);
        expect(
          score.unknownSourceCount
        ).toBe(1);
      }
    );
  }
);

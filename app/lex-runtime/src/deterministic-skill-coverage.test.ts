import fs from "node:fs";
import path from "node:path";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  DETERMINISTIC_SKILL_COVERAGE,
  validateDeterministicSkillCoverage
} from "./deterministic-skill-coverage.js";

function installedCorpusSkills(): string[] {
  const root = path.resolve(
    process.cwd(),
    "../../Wersja rozwojowa rozpakowana"
  );
  if (!fs.statSync(root).isDirectory()) {
    throw new Error(
      "DETERMINISTIC_SKILL_COVERAGE_CORPUS_MISSING"
    );
  }

  return fs.readdirSync(
    root,
    { withFileTypes: true }
  )
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(
          path.join(
            root,
            entry.name,
            "SKILL.md"
          )
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe(
  "deterministic skill migration coverage",
  () => {
    it(
      "classifies every top-level skill in the development corpus exactly once",
      () => {
        const installed =
          installedCorpusSkills();
        const report =
          validateDeterministicSkillCoverage(
            installed
          );

        expect(
          report,
          JSON.stringify(
            report,
            null,
            2
          )
        ).toEqual({
          result: "PASS",
          missingClassifications: [],
          staleClassifications: [],
          duplicateClassifications: []
        });

        expect(
          DETERMINISTIC_SKILL_COVERAGE
            .length
        ).toBe(
          installed.length
        );
      }
    );

    it(
      "keeps every executable/orchestration/report skill out of implicit semantic-only limbo",
      () => {
        const executable = [
          "prawny-router-v3",
          "prawo-polskie-v2",
          "pisma-proste-v2",
          "pisma-procesowe-v3",
          "analiza-sadowa-v6",
          "analizator-dowodow-v3",
          "analizator-przepisow-v2",
          "analizator-umow-v1",
          "chronologia-sprawy-v1",
          "orzeczenia-sadowe-v2",
          "przesluchanie-swiadkow-v2-min90",
          "raport-klienta-v1",
          "raport-sytuacyjny-v2",
          "przewodnik-prawny-v2",
          "audyt-systemu-v4"
        ];

        const bySkill =
          new Map(
            DETERMINISTIC_SKILL_COVERAGE
              .map((entry) => [
                entry.skill,
                entry
              ])
          );

        for (const skill of executable) {
          const entry =
            bySkill.get(skill);
          expect(
            entry,
            skill
          ).toBeDefined();
          expect(
            [
              "ENFORCED",
              "PARTIAL",
              "CODE_FIRST"
            ],
            skill
          ).toContain(
            entry?.status
          );
        }
      }
    );

    it(
      "keeps DR content hybrid instead of pretending domain interpretation is deterministic",
      () => {
        const domainEntries =
          DETERMINISTIC_SKILL_COVERAGE
            .filter(
              (entry) =>
                entry.skill
                  .startsWith(
                    "dr-"
                  )
            );

        expect(
          domainEntries
        ).toHaveLength(16);
        for (const entry of domainEntries) {
          expect(entry.status)
            .toBe("POLICY_TARGET");
          expect(
            entry.migrationClass
          ).toBe(
            "DOMAIN_POLICY_HYBRID"
          );
        }
      }
    );
  }
);

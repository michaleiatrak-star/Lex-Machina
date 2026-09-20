import {
  describe,
  expect,
  it
} from "vitest";
import {
  gateISemanticContract,
  gateISemanticPrompt
} from "./gate-i-semantic-contract.js";

const ENFORCED_EXECUTION_SKILLS = [
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
  "przewodnik-prawny-v2"
] as const;

describe(
  "Gate I semantic contracts",
  () => {
    it.each(
      ENFORCED_EXECUTION_SKILLS
    )(
      "compacts %s to semantic-only model responsibilities",
      (skill) => {
        const contract =
          gateISemanticContract(
            skill
          );
        const prompt =
          gateISemanticPrompt(
            skill
          );

        expect(contract)
          .not.toBeNull();
        expect(
          contract
            ?.runtimeEnforced
        ).toBe(true);
        expect(
          contract
            ?.semanticResponsibilities
            .length
        ).toBeGreaterThan(0);
        expect(
          contract
            ?.forbiddenMechanicalResponsibilities
            .length
        ).toBeGreaterThan(0);
        expect(prompt)
          .toContain(
            "semantic module only"
          );
        expect(prompt)
          .not.toContain(
            "SKILL.md"
          );
      }
    );

    it(
      "marks only the controlling execution skill as a specialized deterministic workflow",
      () => {
        const active =
          gateISemanticPrompt(
            "pisma-procesowe-v3",
            {
              specializedWorkflowActive:
                true
            }
          );
        const cooperating =
          gateISemanticPrompt(
            "chronologia-sprawy-v1"
          );

        expect(active)
          .toContain(
            "controls the active specialized deterministic workflow"
          );
        expect(active)
          .toContain(
            "active runtime checkpoint/stage"
          );
        expect(cooperating)
          .toContain(
            "semantic module only"
          );
        expect(cooperating)
          .toContain(
            "Do not simulate, announce, close or skip any skill-specific checkpoint"
          );
      }
    );

    it(
      "does not compact DR domain content into a fake deterministic interpretation",
      () => {
        expect(
          gateISemanticPrompt(
            "dr-02-prawo-cywilne-rodzinne-gospodarcze"
          )
        ).toBeNull();
      }
    );
  }
);

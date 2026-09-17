import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "./registry.js";
import {
  SKILL_SELECTION_ENVELOPE_PREFIX,
  parseSkillSelectionEnvelope,
  resolveAdditionalSkills
} from "./skill-selection.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function registryWithSkills(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-skill-selection-"));
  roots.push(root);
  const skills = [
    {
      name: "prawny-router-v3",
      description: "router prawny",
      type: "router"
    },
    {
      name: "prawo-polskie-v2",
      description: "prawo polskie",
      type: "domain-router"
    },
    {
      name: "dr-01-prawo-pracy",
      description: "umowa o pracę pracownik pracodawca wypowiedzenie",
      type: "domain"
    },
    {
      name: "dr-02-prawo-cywilne",
      description: "umowy cywilne odszkodowanie zobowiązania",
      type: "domain"
    },
    {
      name: "terminy-procesowe",
      description: "obliczanie terminów procesowych i doręczeń",
      type: "helper"
    },
    {
      name: "analizator-umow-v1",
      description: "analiza redakcja negocjacje ryzyka klauzul umów i kontraktów",
      type: "executive-umowy"
    },
    {
      name: "pisma-procesowe-v3",
      description: "pozew apelacja zażalenie odpowiedź na pozew pismo procesowe",
      type: "executive-pisma"
    },
    {
      name: "przewodnik-prawny-v2",
      description: "ogólna analiza prawna i dobór dalszych działań",
      type: "executive-guide"
    }
  ];

  for (const skill of skills) {
    const directory = path.join(root, skill.name);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "SKILL.md"),
      [
        "---",
        `name: ${skill.name}`,
        `type: ${skill.type}`,
        `description: \"${skill.description}\"`,
        "---",
        `# ${skill.name}`
      ].join("\n")
    );
  }

  fs.mkdirSync(path.join(root, "shared"), { recursive: true });
  const registry = new LexSkillRegistry(root);
  expect(registry.scan()).toEqual([]);
  return registry;
}

describe("skill selection", () => {
  it("strips the internal envelope and preserves manual skill choices", () => {
    const input =
      `${SKILL_SELECTION_ENVELOPE_PREFIX} {\"auto\":false,\"manual\":[\"terminy-procesowe\"]}\n` +
      "Czy termin na apelację już upłynął?";

    expect(parseSkillSelectionEnvelope(input)).toEqual({
      query: "Czy termin na apelację już upłynął?",
      automatic: false,
      manualSkills: ["terminy-procesowe"]
    });
  });

  it("selects one matching execution skill automatically and keeps matching helpers", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przeanalizuj ryzyka i klauzule tej umowy oraz policz termin procesowy.",
      "dr-02-prawo-cywilne",
      true,
      ["terminy-procesowe"]
    );

    expect(selected.loadedSkills.slice(0, 4)).toEqual([
      "prawny-router-v3",
      "shared",
      "prawo-polskie-v2",
      "dr-02-prawo-cywilne"
    ]);
    expect(selected.executionSkill).toBe("analizator-umow-v1");
    expect(selected.additionalSkills).toContain("analizator-umow-v1");
    expect(selected.additionalSkills).toContain("terminy-procesowe");
    expect(selected.additionalSkills).not.toContain("pisma-procesowe-v3");
  });

  it("keeps a manually selected execution skill instead of replacing it", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przygotuj analizę umowy.",
      "dr-02-prawo-cywilne",
      true,
      ["pisma-procesowe-v3"]
    );

    expect(selected.executionSkill).toBe("pisma-procesowe-v3");
    expect(selected.additionalSkills).toContain("pisma-procesowe-v3");
    expect(selected.additionalSkills).not.toContain("analizator-umow-v1");
  });

  it("uses the general legal guide when automatic mode has no semantic match", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Nietypowe zagadnienie xyz bez charakterystycznych słów.",
      "dr-02-prawo-cywilne",
      true,
      []
    );

    expect(selected.executionSkill).toBe("przewodnik-prawny-v2");
  });

  it("ignores unknown manual skill names when automatic mode is disabled", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "zwykłe pytanie",
      "dr-02-prawo-cywilne",
      false,
      ["nie-istnieje", "shared"]
    );

    expect(selected.additionalSkills).toEqual([]);
    expect(selected.executionSkill).toBeUndefined();
    expect(selected.loadedSkills).toContain("shared");
  });
});

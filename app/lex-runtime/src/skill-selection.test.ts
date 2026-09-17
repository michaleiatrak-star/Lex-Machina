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
      description: "router prawny"
    },
    {
      name: "prawo-polskie-v2",
      description: "prawo polskie"
    },
    {
      name: "dr-01-prawo-pracy",
      description: "umowa o pracę pracownik pracodawca wypowiedzenie"
    },
    {
      name: "dr-02-prawo-cywilne",
      description: "umowy cywilne odszkodowanie zobowiązania"
    },
    {
      name: "terminy-procesowe",
      description: "obliczanie terminów procesowych i doręczeń"
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

  it("always returns mandatory core resources and adds matching plus manual skills", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Pracownik dostał wypowiedzenie umowy o pracę i trzeba policzyć termin.",
      "dr-01-prawo-pracy",
      true,
      ["terminy-procesowe"]
    );

    expect(selected.loadedSkills.slice(0, 4)).toEqual([
      "prawny-router-v3",
      "shared",
      "prawo-polskie-v2",
      "dr-01-prawo-pracy"
    ]);
    expect(selected.additionalSkills).toContain("terminy-procesowe");
  });

  it("ignores unknown manual skill names", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "zwykłe pytanie",
      "dr-02-prawo-cywilne",
      false,
      ["nie-istnieje", "shared"]
    );

    expect(selected.additionalSkills).toEqual([]);
    expect(selected.loadedSkills).toContain("shared");
  });
});

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "../src/registry.js";
import {
  CORE_EXECUTION_SKILLS,
  EXPECTED_DR_SKILLS,
  validateSkillContractMatrix
} from "../src/skill-contract-matrix.js";

const roots: string[] = [];

function writeSkill(root: string, name: string): void {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "SKILL.md"),
    `---\nname: ${name}\nversion: "1.0"\ndescription: "test"\n---\n# ${name}\n`
  );
}

function completeFixture(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-matrix-"));
  roots.push(root);
  writeSkill(root, "prawo-polskie-v2");
  for (const name of EXPECTED_DR_SKILLS) writeSkill(root, name);
  for (const name of CORE_EXECUTION_SKILLS) writeSkill(root, name);
  fs.writeFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    EXPECTED_DR_SKILLS.join("\n")
  );
  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("skill contract matrix", () => {
  it("passes an exact 16-DR + core-execution fixture", () => {
    const report = validateSkillContractMatrix(completeFixture());
    expect(report.result, JSON.stringify(report, null, 2)).toBe("PASS");
    expect(report.discoveredDrCount).toBe(16);
  });

  it("blocks when a required execution skill is absent", () => {
    const registry = completeFixture();
    registry.skills.delete("pisma-procesowe-v3");
    const report = validateSkillContractMatrix(registry);
    expect(report.result).toBe("BLOCKED");
    expect(report.missingExecutionSkills).toContain("pisma-procesowe-v3");
  });

  it("blocks when an expected DR disappears from the routing map", () => {
    const registry = completeFixture();
    const routingMap = registry.resolveResource(
      "prawo-polskie-v2",
      "prawo-polskie-v2/ROUTING-MAP.md"
    )!;
    const missing = EXPECTED_DR_SKILLS[0];
    fs.writeFileSync(
      routingMap,
      EXPECTED_DR_SKILLS.filter((name) => name !== missing).join("\n")
    );
    const report = validateSkillContractMatrix(registry);
    expect(report.result).toBe("BLOCKED");
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        id: "dr-listed-in-routing-map",
        target: missing,
        pass: false
      })
    );
  });
});

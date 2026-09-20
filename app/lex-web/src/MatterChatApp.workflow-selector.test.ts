import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  new URL("./MatterChatApp.tsx", import.meta.url),
  "utf8"
);

describe("matter chat deterministic workflow picker", () => {
  it("keeps one in-chat selector as the only execution-workflow choice", () => {
    expect(source).toContain(
      'aria-label="Workflow deterministyczny"'
    );
    expect(source).toContain(
      'value={caseTypeSkills[0] ?? ""}'
    );
    expect(source).toContain(
      "AUTO — router + skille"
    );
    expect(source).toContain(
      "{executionSkills.map((skill) => ("
    );
    expect(source).not.toContain(
      'name="deterministic-workflow-skill"'
    );
  });

  it("keeps execution skills out of the generic helper checklist", () => {
    expect(source).toContain(
      'item.name !== "prawo-polskie-v2" &&\n          !isExecutionSkill(item)'
    );
  });

  it("allows workflow changes between turns but not during an active execution", () => {
    expect(source).toContain(
      "disabled={\n                      executing ||\n                      Boolean(selectedCase?.archivedAt)"
    );
    expect(source).toContain(
      "selectDeterministicWorkflowSkill(\n                        event.target.value"
    );
  });
});

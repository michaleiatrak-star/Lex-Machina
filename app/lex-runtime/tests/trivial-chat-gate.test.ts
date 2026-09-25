import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { applyTrivialChatGate } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import { parseSkillSelectionEnvelope } from "../src/skill-selection.js";

const roots: string[] = [];
afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, { recursive: true, force: true });
});

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-gate-"));
  roots.push(root);
  for (const name of ["dr-02-cywilne", "dr-03-karne", "pisma-procesowe-v3"]) {
    fs.mkdirSync(path.join(root, name));
    fs.writeFileSync(path.join(root, name, "SKILL.md"), `---\nname: ${name}\n---\n# ${name}\n`);
  }
  const value = new LexSkillRegistry(root);
  value.scan();
  return value;
}

describe("trivial chat gate", () => {
  it("drops a pinned workflow and routing for a trivial command", () => {
    const request = {
      query: '__LEX_SKILLS_V1__ {"auto":false,"manual":["pisma-procesowe-v3"],"workflow":"pisma-procesowe-v3"}\nok',
      provider: "openai",
      model: "account/openai/default",
      primarySkill: "AUTO",
      mode: "PRAWNIK",
      modelSelectsSkills: true
    } as never as Parameters<typeof applyTrivialChatGate>[1];
    expect(applyTrivialChatGate(registry(), request, 0)).toBe(true);
    const envelope = parseSkillSelectionEnvelope(request.query);
    expect(envelope.workflowExecutionSkill).toBeNull();
    expect(envelope.manualSkills).toEqual([]);
    expect(envelope.query).toBe("ok");
    expect(request.primarySkill).toBe("dr-02-cywilne");
    expect(request.conversationalOnly).toBe(true);
    expect(request.modelSelectsSkills).toBeUndefined();
  });

  it("keeps legal requests and messages with attachments on the legal path", () => {
    const legal = { query: "czy to przestępstwo?", primarySkill: "AUTO" } as never as Parameters<typeof applyTrivialChatGate>[1];
    expect(applyTrivialChatGate(registry(), legal, 0)).toBe(false);
    const withFile = { query: "ok", primarySkill: "AUTO" } as never as Parameters<typeof applyTrivialChatGate>[1];
    expect(applyTrivialChatGate(registry(), withFile, 1)).toBe(false);
    expect(withFile.primarySkill).toBe("AUTO");
  });
});

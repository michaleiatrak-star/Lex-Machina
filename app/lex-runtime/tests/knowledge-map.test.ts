import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { knowledgeMapPrompt } from "../src/knowledge-map.js";
import { LexSkillRegistry } from "../src/registry.js";

const roots: string[] = [];
afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, { recursive: true, force: true });
});

function corpus(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-knowledge-map-"));
  roots.push(root);
  const write = (file: string, body: string) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), body);
  };
  write("dr-02-cywilne/SKILL.md", "---\nname: dr-02-cywilne\ndescription: Prawo cywilne\n---\n# c\n");
  for (let i = 1; i <= 20; i += 1) write(`dr-02-cywilne/modules/mod-${String(i).padStart(2, "0")}.md`, "# m\n");
  write("dr-02-cywilne/agents/openai.yaml", "x: 1\n");
  write("dr-02-cywilne/references/CHANGELOG.md", "# log\n");
  write("dr-03-karne/SKILL.md", "---\nname: dr-03-karne\ndescription: Prawo karne\n---\n# k\n");
  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

const acts = [
  { eli: "DU/1964/93", title: "Kodeks cywilny", labels: ["KC"], domains: ["dr-02-cywilne"], articleCount: 1100 },
  { eli: "DU/1997/553", title: "Kodeks karny", labels: ["KK"], domains: ["dr-03-karne"], articleCount: 400 }
];

describe("knowledge map", () => {
  it("lists every file of the active skill, other skills, core acts and tools for a hosted model", () => {
    const text = knowledgeMapPrompt({
      registry: corpus(),
      activeSkills: ["dr-02-cywilne"],
      local: false,
      toolNames: new Set(["read_legal_resource", "read_core_law_article", "search_case_law"]),
      coreLaw: acts
    });
    expect(text).toContain("dr-02-cywilne (dr-02-cywilne/): 20 plików poza SKILL.md");
    expect(text).toContain("modules/mod-20.md");
    expect(text).not.toContain("openai.yaml");
    expect(text).not.toContain("CHANGELOG");
    expect(text).toContain("- dr-03-karne (1 plików) :: Prawo karne");
    expect(text).toContain("KC (DU/1964/93, 1100 art.)");
    expect(text).toContain("KK (DU/1997/553, 400 art.)");
    expect(text).toContain("read_legal_resource skill=<nazwa> path=<plik>");
    expect(text).toContain("orzecznictwo (SAOS, CBOSA, SN): search_case_law");
  });

  it("keeps a short version for a local model: fewer files, acts of the active domain only", () => {
    const text = knowledgeMapPrompt({
      registry: corpus(),
      activeSkills: ["dr-02-cywilne"],
      local: true,
      toolNames: new Set(["read_core_law_article"]),
      coreLaw: acts
    });
    expect(text).toContain("tryb uproszczony");
    expect(text).toContain("… (+8)");
    expect(text).toContain("KC (DU/1964/93");
    expect(text).not.toContain("KK (DU/1997/553");
    expect(text).toContain("… oraz 1 innych aktów.");
  });
});

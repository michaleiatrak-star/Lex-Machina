import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "../src/registry.js";

const temporaryRoots: string[] = [];

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-runtime-"));
  temporaryRoots.push(root);

  fs.mkdirSync(path.join(root, "shared"), { recursive: true });
  fs.writeFileSync(path.join(root, "shared", "PRAWO-HARDGATE.md"), "# gate\n");

  fs.mkdirSync(path.join(root, "prawny-router-v3", "references"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "prawny-router-v3", "references", "KROK1-detekcja.md"),
    "# detect\n"
  );
  fs.writeFileSync(
    path.join(root, "prawny-router-v3", "SKILL.md"),
    `---
name: prawny-router-v3
dependencies:
  requires:
    - shared
required_modules:
  - shared/PRAWO-HARDGATE.md
  - references/KROK1-detekcja.md
---
# Router
`
  );

  return root;
}

afterEach(() => {
  while (temporaryRoots.length) {
    fs.rmSync(temporaryRoots.pop()!, { recursive: true, force: true });
  }
});

describe("LexSkillRegistry", () => {
  it("scans skill frontmatter and resolves semantic resources", () => {
    const root = fixture();
    const registry = new LexSkillRegistry(root);
    expect(registry.scan()).toEqual([]);
    expect(registry.get("prawny-router-v3")).toBeDefined();
    expect(
      registry.resolveResource("prawny-router-v3", "shared/PRAWO-HARDGATE.md")
    ).toBe(path.join(root, "shared", "PRAWO-HARDGATE.md"));
    expect(
      registry.resolveResource("prawny-router-v3", "references/KROK1-detekcja.md")
    ).toBe(
      path.join(root, "prawny-router-v3", "references", "KROK1-detekcja.md")
    );
    expect(registry.validateDeclarations()).toEqual([]);
  });

  it("blocks path traversal outside the Lex root", () => {
    const root = fixture();
    const registry = new LexSkillRegistry(root);
    registry.scan();

    expect(() =>
      registry.resolveResource("prawny-router-v3", "../../etc/passwd")
    ).toThrow(/PATH_ESCAPE/);
  });

  it("reports a missing declared dependency", () => {
    const root = fixture();
    const skillPath = path.join(root, "prawny-router-v3", "SKILL.md");
    fs.writeFileSync(
      skillPath,
      `---
name: prawny-router-v3
dependencies:
  requires:
    - missing-skill
---
# Router
`
    );

    const registry = new LexSkillRegistry(root);
    expect(registry.scan()).toEqual([]);
    expect(registry.validateDeclarations()).toEqual([
      expect.objectContaining({
        code: "MISSING_DEPENDENCY",
        skill: "prawny-router-v3",
        target: "missing-skill"
      })
    ]);
  });
});

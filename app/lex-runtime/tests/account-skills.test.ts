import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyAccountSkills,
  compareSkillVersions,
  defaultAccountSkillRoots
} from "../src/account-skills.js";
import { LexSkillRegistry } from "../src/registry.js";

const roots: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  roots.push(dir);
  return dir;
}

function writeSkill(
  root: string,
  name: string,
  version: string,
  extra = "",
  files: Record<string, string> = {}
): void {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "SKILL.md"),
    `---\nname: ${name}\nversion: "${version}"\n${extra}---\n# ${name} ${version}\n`
  );
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  }
}

function bundledCorpus(): string {
  const root = tempDir("lex-bundled-");
  writeSkill(root, "prawny-router-v3", "3.50");
  writeSkill(root, "shared", "3.61");
  writeSkill(root, "dr-02-prawo-cywilne", "3.50");
  return root;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("account skills", () => {
  it("compares dotted versions numerically", () => {
    expect(compareSkillVersions("3.10", "3.9")).toBe(1);
    expect(compareSkillVersions("6.124", "6.98")).toBe(1);
    expect(compareSkillVersions("5.16.8", "5.16.12")).toBe(-1);
    expect(compareSkillVersions("3.50", "3.50")).toBe(0);
  });

  it("finds Claude account sync, Codex, Agents and Grok folders", () => {
    const home = tempDir("lex-home-");
    fs.mkdirSync(path.join(home, ".claude", "skills", "synced", "org_account"), { recursive: true });
    const sources = defaultAccountSkillRoots({}, home);
    expect(sources.map((item) => item.source)).toEqual([
      "claude-account",
      "claude",
      "codex",
      "agents",
      "grok"
    ]);
    expect(sources[0]!.root).toBe(
      path.join(home, ".claude", "skills", "synced", "org_account")
    );
    expect(defaultAccountSkillRoots({ LEX_ACCOUNT_SKILL_DIRS: "off" }, home)).toEqual([]);
  });

  it("runs on newer account versions of Lex legal skills only", () => {
    const base = bundledCorpus();
    const account = tempDir("lex-account-");
    writeSkill(account, "prawny-router-v3", "3.53", "", { "modules/new.md": "nowy moduł" });
    writeSkill(account, "shared", "3.40");
    writeSkill(account, "docx", "1.0");
    const cache = tempDir("lex-cache-");

    const result = applyAccountSkills(base, {
      roots: [{ source: "claude-account", root: account }],
      cacheRoot: cache
    });

    expect(result.applied).toEqual([
      {
        name: "prawny-router-v3",
        source: "claude-account",
        version: "3.53",
        bundledVersion: "3.50"
      }
    ]);
    const registry = new LexSkillRegistry(result.root);
    registry.scan();
    expect(registry.get("prawny-router-v3")!.frontmatter.version).toBe("3.53");
    expect(registry.resolveResource("prawny-router-v3", "modules/new.md")).not.toBeNull();
    // Older account version and non-legal skills are ignored.
    expect(registry.get("shared")!.frontmatter.version).toBe("3.61");
    expect(registry.get("docx")).toBeUndefined();
    // The bundled corpus itself is never modified.
    expect(fs.readFileSync(path.join(base, "prawny-router-v3", "SKILL.md"), "utf8")).toContain("3.50");
  });

  it("keeps the bundled skill when the account version breaks corpus validation", () => {
    const base = bundledCorpus();
    const account = tempDir("lex-account-");
    writeSkill(account, "dr-02-prawo-cywilne", "3.56", "required_modules:\n  - modules/missing.md\n");
    writeSkill(account, "prawny-router-v3", "3.53");

    const result = applyAccountSkills(base, {
      roots: [{ source: "codex", root: account }],
      cacheRoot: tempDir("lex-cache-")
    });

    expect(result.applied.map((item) => item.name)).toEqual(["prawny-router-v3"]);
    expect(result.rejected).toContainEqual({
      name: "dr-02-prawo-cywilne",
      source: "codex",
      reason: "CORPUS_VALIDATION_FAILED"
    });
    const registry = new LexSkillRegistry(result.root);
    registry.scan();
    expect(registry.get("dr-02-prawo-cywilne")!.frontmatter.version).toBe("3.50");
  });

  it("returns the base corpus when no account has a newer legal skill", () => {
    const base = bundledCorpus();
    const result = applyAccountSkills(base, {
      roots: [{ source: "grok", root: path.join(base, "does-not-exist") }],
      cacheRoot: tempDir("lex-cache-")
    });
    expect(result).toEqual({ root: base, applied: [], rejected: [] });
  });
});

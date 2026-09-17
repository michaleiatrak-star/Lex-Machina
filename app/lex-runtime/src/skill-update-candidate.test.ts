import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "./registry.js";
import {
  validateSkillCandidateAgainstIndex
} from "./maintenance-service.js";
import type {
  SkillUpdateIndex
} from "./skill-update-verifier.js";

const roots: string[] = [];

function sha256(filePath: string): string {
  return createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function fixture() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-skill-index-")
  );
  roots.push(root);

  const shared = path.join(root, "shared");
  fs.mkdirSync(shared, { recursive: true });
  fs.writeFileSync(
    path.join(shared, "SKILL.md"),
    [
      "---",
      "name: shared",
      "version: 1.0",
      "dependencies:",
      "  requires: []",
      "---",
      "Shared runtime policy."
    ].join("\n"),
    "utf8"
  );

  const router = path.join(root, "prawny-router-v3");
  fs.mkdirSync(router, { recursive: true });
  fs.writeFileSync(
    path.join(router, "SKILL.md"),
    [
      "---",
      "name: prawny-router-v3",
      "version: 3.52",
      "dependencies:",
      "  requires:",
      "    - shared",
      "---",
      "Router body."
    ].join("\n"),
    "utf8"
  );

  const registry = new LexSkillRegistry(root);
  expect(registry.scan()).toEqual([]);
  expect(registry.validateDeclarations()).toEqual([]);

  const index: SkillUpdateIndex = {
    schemaVersion: 1,
    kind: "LEX_MACHINA_SKILLS_INDEX",
    version: "0.1.4",
    bundle: {
      filename: "LexMachina-Skills-0.1.4.zip",
      sha256: "a".repeat(64),
      bytes: 123
    },
    compatibility: {
      minAppVersion: "0.1.3",
      maxAppVersion: "0.2.0"
    },
    skills: [
      {
        id: "prawny-router-v3",
        version: "3.52",
        sha256: sha256(
          path.join(router, "SKILL.md")
        ),
        dependencies: ["shared"]
      },
      {
        id: "shared",
        version: "1.0",
        sha256: sha256(
          path.join(shared, "SKILL.md")
        ),
        dependencies: []
      }
    ]
  };

  return {
    registry,
    index,
    routerSkill: path.join(router, "SKILL.md")
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true
    });
  }
});

describe("signed skill candidate validation", () => {
  it("accepts an exact corpus/index match", () => {
    const { registry, index } = fixture();
    expect(() =>
      validateSkillCandidateAgainstIndex(
        registry,
        index
      )
    ).not.toThrow();
  });

  it("rejects dependency mismatch", () => {
    const { registry, index } = fixture();
    index.skills[0]!.dependencies = [];

    expect(() =>
      validateSkillCandidateAgainstIndex(
        registry,
        index
      )
    ).toThrow(
      "SKILL_UPDATE_INDEX_DEPENDENCY_MISMATCH:prawny-router-v3"
    );
  });

  it("rejects version mismatch", () => {
    const { registry, index } = fixture();
    index.skills[0]!.version = "3.51";

    expect(() =>
      validateSkillCandidateAgainstIndex(
        registry,
        index
      )
    ).toThrow(
      "SKILL_UPDATE_INDEX_VERSION_MISMATCH:prawny-router-v3"
    );
  });

  it("rejects a changed SKILL.md hash", () => {
    const {
      registry,
      index,
      routerSkill
    } = fixture();

    fs.appendFileSync(
      routerSkill,
      "\nTampered after index generation.\n",
      "utf8"
    );

    expect(() =>
      validateSkillCandidateAgainstIndex(
        registry,
        index
      )
    ).toThrow(
      "SKILL_UPDATE_INDEX_HASH_MISMATCH:prawny-router-v3"
    );
  });
});

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export type SkillFrontmatter = {
  name?: string;
  version?: string;
  type?: string;
  status?: string;
  entrypoint?: string;
  compatibility?: string;
  description?: string;
  dependencies?: {
    requires?: string[];
    called_by?: string[];
  };
  required_modules?: string[];
  [key: string]: unknown;
};

export type LexSkillRecord = {
  name: string;
  directory: string;
  skillFile: string;
  frontmatter: SkillFrontmatter;
  body: string;
};

export type ValidationIssue = {
  code:
    | "INVALID_FRONTMATTER"
    | "MISSING_NAME"
    | "DUPLICATE_SKILL_NAME"
    | "MISSING_DEPENDENCY"
    | "MISSING_REQUIRED_RESOURCE"
    | "PATH_ESCAPE";
  skill?: string;
  target?: string;
  detail: string;
};

const FRONTMATTER = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

export function parseSkillFile(filePath: string): {
  frontmatter: SkillFrontmatter;
  body: string;
} {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(FRONTMATTER);
  if (!match || match[1] === undefined) {
    throw new Error(`Missing YAML frontmatter: ${filePath}`);
  }
  const parsed = YAML.parse(match[1]) as SkillFrontmatter | null;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Invalid YAML frontmatter object: ${filePath}`);
  }
  return { frontmatter: parsed, body: raw.slice(match[0].length) };
}

function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function assertInside(root: string, target: string): string {
  const absoluteRoot = path.resolve(root);
  const absoluteTarget = path.resolve(target);
  const relative = path.relative(absoluteRoot, absoluteTarget);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`PATH_ESCAPE: ${target}`);
  }
  return absoluteTarget;
}

export class LexSkillRegistry {
  readonly root: string;
  readonly skills = new Map<string, LexSkillRecord>();

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  scan(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    this.skills.clear();

    for (const entry of fs.readdirSync(this.root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const directory = path.join(this.root, entry.name);
      const skillFile = path.join(directory, "SKILL.md");
      if (!isFile(skillFile)) continue;

      try {
        const { frontmatter, body } = parseSkillFile(skillFile);
        const name = typeof frontmatter.name === "string"
          ? frontmatter.name.trim()
          : "";

        if (!name) {
          issues.push({
            code: "MISSING_NAME",
            target: skillFile,
            detail: "SKILL.md does not declare a non-empty frontmatter name."
          });
          continue;
        }

        if (this.skills.has(name)) {
          issues.push({
            code: "DUPLICATE_SKILL_NAME",
            skill: name,
            target: skillFile,
            detail: `Duplicate skill name: ${name}`
          });
          continue;
        }

        this.skills.set(name, {
          name,
          directory,
          skillFile,
          frontmatter,
          body
        });
      } catch (error) {
        issues.push({
          code: "INVALID_FRONTMATTER",
          target: skillFile,
          detail: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return issues;
  }

  get(name: string): LexSkillRecord | undefined {
    return this.skills.get(name);
  }

  resolveDependency(name: string): string | null {
    const direct = this.skills.get(name);
    if (direct) return direct.directory;

    const candidate = assertInside(this.root, path.join(this.root, name));
    return isDirectory(candidate) ? candidate : null;
  }

  resolveResource(skillName: string, semanticPath: string): string | null {
    const normalized = semanticPath.replaceAll("\\", "/").trim();
    if (!normalized) return null;

    let candidate: string;

    if (
      normalized.startsWith("shared/") ||
      normalized.startsWith("references/") ||
      normalized.startsWith("modules/") ||
      normalized.startsWith("assets/")
    ) {
      if (normalized.startsWith("shared/")) {
        candidate = path.join(this.root, normalized);
      } else {
        const skill = this.skills.get(skillName);
        if (!skill) return null;
        candidate = path.join(skill.directory, normalized);
      }
    } else {
      const first = normalized.split("/", 1).at(0);
      if (!first) return null;
      if (this.skills.has(first)) {
        candidate = path.join(this.root, normalized);
      } else {
        const skill = this.skills.get(skillName);
        if (!skill) return null;
        candidate = path.join(skill.directory, normalized);
      }
    }

    const safe = assertInside(this.root, candidate);
    return isFile(safe) || isDirectory(safe) ? safe : null;
  }

  validateDeclarations(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const skill of this.skills.values()) {
      const dependencies = skill.frontmatter.dependencies?.requires ?? [];
      for (const dependency of dependencies) {
        if (!this.resolveDependency(dependency)) {
          issues.push({
            code: "MISSING_DEPENDENCY",
            skill: skill.name,
            target: dependency,
            detail: `Declared dependency cannot be resolved: ${dependency}`
          });
        }
      }

      const resources = skill.frontmatter.required_modules ?? [];
      for (const resource of resources) {
        const semantic = String(resource).split("#", 1).at(0)?.trim() ?? "";
        if (!semantic) continue;
        try {
          if (!this.resolveResource(skill.name, semantic)) {
            issues.push({
              code: "MISSING_REQUIRED_RESOURCE",
              skill: skill.name,
              target: semantic,
              detail: `Declared required resource cannot be resolved: ${semantic}`
            });
          }
        } catch (error) {
          issues.push({
            code: "PATH_ESCAPE",
            skill: skill.name,
            target: semantic,
            detail: error instanceof Error ? error.message : String(error)
          });
        }
      }
    }

    return issues;
  }
}

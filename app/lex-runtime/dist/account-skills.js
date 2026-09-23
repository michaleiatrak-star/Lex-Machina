import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LexSkillRegistry } from "./registry.js";
function localAppDataRoot(env) {
    const base = env.LOCALAPPDATA?.trim();
    if (base)
        return path.resolve(base, "LexMachina");
    return path.resolve(os.homedir(), ".lex-machina");
}
function subdirectories(root) {
    try {
        return fs
            .readdirSync(root, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() &&
            !entry.name.startsWith("."))
            .map((entry) => path.join(root, entry.name));
    }
    catch {
        return [];
    }
}
export function defaultAccountSkillRoots(env = process.env, home = os.homedir()) {
    const override = env.LEX_ACCOUNT_SKILL_DIRS?.trim();
    if (override !== undefined && override !== "") {
        if (/^(off|none|disabled)$/i.test(override)) {
            return [];
        }
        return override
            .split(path.delimiter)
            .map((item) => item.trim())
            .filter(Boolean)
            .map((root, index) => ({
            source: `custom${index + 1}`,
            root: path.resolve(root)
        }));
    }
    const claudeRoot = path.join(env.CLAUDE_CONFIG_DIR?.trim() ||
        path.join(home, ".claude"), "skills");
    const grokRoot = path.join(env.GROK_HOME?.trim() ||
        path.join(home, ".grok"), "skills");
    const codexRoot = path.join(env.CODEX_HOME?.trim() ||
        path.join(home, ".codex"), "skills");
    return [
        // claude.ai account skills synced by Claude Code, one folder per account.
        ...subdirectories(path.join(claudeRoot, "synced")).map((root) => ({
            source: "claude-account",
            root
        })),
        { source: "claude", root: claudeRoot },
        { source: "codex", root: codexRoot },
        { source: "agents", root: path.join(home, ".agents", "skills") },
        { source: "grok", root: grokRoot }
    ];
}
function versionOf(value) {
    if (typeof value === "number")
        return String(value);
    if (typeof value !== "string")
        return null;
    const trimmed = value.trim();
    return /^\d+(?:\.\d+)*$/.test(trimmed) ? trimmed : null;
}
/** Numeric per-segment comparison: "3.53" > "3.50", "6.124" > "6.98". */
export function compareSkillVersions(a, b) {
    const left = a.split(".").map(Number);
    const right = b.split(".").map(Number);
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
        const difference = (left[index] ?? 0) - (right[index] ?? 0);
        if (difference !== 0)
            return Math.sign(difference);
    }
    return 0;
}
function containsSymlink(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isSymbolicLink())
            return true;
        if (entry.isDirectory() &&
            containsSymlink(path.join(directory, entry.name))) {
            return true;
        }
    }
    return false;
}
function newestAccountCandidates(bundled, roots, rejected) {
    const best = new Map();
    for (const { source, root } of roots) {
        let registry;
        try {
            if (!fs.statSync(root).isDirectory())
                continue;
            registry = new LexSkillRegistry(root);
            registry.scan();
        }
        catch {
            continue;
        }
        for (const skill of registry.skills.values()) {
            const bundledSkill = bundled.get(skill.name);
            // Only Lex legal skills; general account skills are not part of the
            // legal corpus.
            if (!bundledSkill)
                continue;
            if (path.basename(skill.directory) !== path.basename(bundledSkill.directory)) {
                rejected.push({
                    name: skill.name,
                    source,
                    reason: "DIRECTORY_NAME_MISMATCH"
                });
                continue;
            }
            const version = versionOf(skill.frontmatter.version);
            if (!version) {
                rejected.push({ name: skill.name, source, reason: "VERSION_MISSING" });
                continue;
            }
            const bundledVersion = versionOf(bundledSkill.frontmatter.version);
            if (bundledVersion &&
                compareSkillVersions(version, bundledVersion) <= 0) {
                continue;
            }
            const current = best.get(skill.name);
            if (current &&
                compareSkillVersions(version, current.version) <= 0) {
                continue;
            }
            if (containsSymlink(skill.directory)) {
                rejected.push({ name: skill.name, source, reason: "SYMLINK_PRESENT" });
                continue;
            }
            best.set(skill.name, {
                name: skill.name,
                source,
                version,
                bundledVersion,
                directory: skill.directory
            });
        }
    }
    return best;
}
function fingerprint(baseRoot, bundled, candidates) {
    const hash = crypto.createHash("sha256");
    hash.update(path.resolve(baseRoot));
    // An application update replaces the bundled corpus in place.
    for (const skill of [...bundled.skills.values()].sort((a, b) => a.name.localeCompare(b.name))) {
        hash.update(`\0${skill.name}\0${String(skill.frontmatter.version ?? "")}\0${fs.statSync(skill.skillFile).mtimeMs}`);
    }
    for (const candidate of candidates) {
        hash.update(`\0${candidate.name}\0${candidate.version}\0${candidate.directory}`);
        const stack = [candidate.directory];
        while (stack.length) {
            const directory = stack.pop();
            for (const entry of fs
                .readdirSync(directory, { withFileTypes: true })
                .sort((a, b) => a.name.localeCompare(b.name))) {
                const target = path.join(directory, entry.name);
                if (entry.isDirectory()) {
                    stack.push(target);
                }
                else if (entry.isFile()) {
                    const stat = fs.statSync(target);
                    hash.update(`\0${path.relative(candidate.directory, target)}\0${stat.size}\0${stat.mtimeMs}`);
                }
            }
        }
    }
    return hash.digest("hex").slice(0, 16);
}
function validationIssues(root) {
    const registry = new LexSkillRegistry(root);
    return [
        ...registry.scan(),
        ...registry.validateDeclarations()
    ].map((issue) => issue.skill ?? issue.target ?? issue.code);
}
function assemble(baseRoot, target, candidates) {
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(baseRoot, target, { recursive: true });
    for (const candidate of candidates) {
        const destination = path.join(target, path.basename(candidate.directory));
        fs.rmSync(destination, { recursive: true, force: true });
        fs.cpSync(candidate.directory, destination, { recursive: true });
    }
}
/**
 * Returns the corpus root to run on: `baseRoot` itself when no account holds
 * a newer legal skill, otherwise a validated merged copy.
 */
export function applyAccountSkills(baseRoot, options) {
    const env = options?.env ?? process.env;
    const rejected = [];
    const bundled = new LexSkillRegistry(baseRoot);
    bundled.scan();
    let candidates = [
        ...newestAccountCandidates(bundled, options?.roots ?? defaultAccountSkillRoots(env), rejected).values()
    ].sort((a, b) => a.name.localeCompare(b.name));
    if (candidates.length === 0) {
        return { root: baseRoot, applied: [], rejected };
    }
    const cacheRoot = options?.cacheRoot ??
        path.join(localAppDataRoot(env), "skills", "account");
    fs.mkdirSync(cacheRoot, { recursive: true });
    // One retry without the skills that broke validation; then the base corpus.
    for (let attempt = 0; attempt < 2 && candidates.length > 0; attempt += 1) {
        const id = fingerprint(baseRoot, bundled, candidates);
        const target = path.join(cacheRoot, id);
        const ready = path.join(target, ".lex-account-skills.json");
        if (!fs.existsSync(ready)) {
            const staging = `${target}.staging-${process.pid}`;
            try {
                assemble(baseRoot, staging, candidates);
            }
            catch (error) {
                fs.rmSync(staging, { recursive: true, force: true });
                for (const candidate of candidates) {
                    rejected.push({
                        name: candidate.name,
                        source: candidate.source,
                        reason: `COPY_FAILED:${error instanceof Error ? error.message : String(error)}`
                    });
                }
                return { root: baseRoot, applied: [], rejected };
            }
            const broken = new Set(validationIssues(staging));
            const failing = candidates.filter((candidate) => broken.has(candidate.name));
            if (broken.size > 0) {
                fs.rmSync(staging, { recursive: true, force: true });
                for (const candidate of failing) {
                    rejected.push({
                        name: candidate.name,
                        source: candidate.source,
                        reason: "CORPUS_VALIDATION_FAILED"
                    });
                }
                if (failing.length === 0) {
                    // The breakage is not attributable to one account skill.
                    return { root: baseRoot, applied: [], rejected };
                }
                candidates = candidates.filter((candidate) => !broken.has(candidate.name));
                continue;
            }
            fs.writeFileSync(path.join(staging, ".lex-account-skills.json"), JSON.stringify(candidates.map(({ directory: _directory, ...rest }) => rest), null, 2));
            fs.rmSync(target, { recursive: true, force: true });
            fs.renameSync(staging, target);
        }
        for (const entry of fs.readdirSync(cacheRoot)) {
            if (entry !== id) {
                fs.rmSync(path.join(cacheRoot, entry), { recursive: true, force: true });
            }
        }
        return {
            root: target,
            applied: candidates.map(({ directory: _directory, ...rest }) => rest),
            rejected
        };
    }
    return { root: baseRoot, applied: [], rejected };
}

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installedSkillOverlayPreviousRoot, installedSkillOverlayRoot, installedSkillOverlayVersion, commitSkillOverlayRuntimeHealth, recoverSkillOverlayForStartup } from "./maintenance-service.js";
import { CURRENT_APPLICATION_VERSION } from "./update-discovery.js";
let root = "";
let previousLocalAppData;
function writeSkillCorpus(target, version, health) {
    const shared = path.join(target, "shared");
    const router = path.join(target, "prawny-router-v3");
    fs.mkdirSync(shared, { recursive: true });
    fs.mkdirSync(router, { recursive: true });
    fs.writeFileSync(path.join(shared, "SKILL.md"), [
        "---",
        "name: shared",
        'version: "1.0"',
        "dependencies:",
        "  requires: []",
        "---",
        "Shared policy."
    ].join("\n"), "utf8");
    fs.writeFileSync(path.join(router, "SKILL.md"), [
        "---",
        "name: prawny-router-v3",
        'version: "3.52"',
        "dependencies:",
        "  requires:",
        "    - shared",
        "---",
        "Router."
    ].join("\n"), "utf8");
    if (version) {
        fs.writeFileSync(path.join(target, ".lex-skills-version.json"), JSON.stringify({
            version,
            installedAt: "2026-09-18T00:00:00.000Z",
            ...(health
                ? { health }
                : {})
        }, null, 2), "utf8");
    }
}
function marker(target) {
    return JSON.parse(fs.readFileSync(path.join(target, ".lex-skills-version.json"), "utf8"));
}
beforeEach(() => {
    previousLocalAppData =
        process.env.LOCALAPPDATA;
    root =
        fs.mkdtempSync(path.join(os.tmpdir(), "lex-skill-recovery-"));
    process.env.LOCALAPPDATA =
        root;
});
afterEach(() => {
    if (previousLocalAppData ===
        undefined) {
        delete process.env
            .LOCALAPPDATA;
    }
    else {
        process.env.LOCALAPPDATA =
            previousLocalAppData;
    }
    fs.rmSync(root, {
        recursive: true,
        force: true
    });
});
describe("skill overlay restart recovery", () => {
    it("keeps a legacy healthy current overlay without inventing a restart-validation cycle", () => {
        const current = installedSkillOverlayRoot();
        writeSkillCorpus(current, "0.1.4");
        const bundled = path.join(root, "bundled");
        writeSkillCorpus(bundled);
        const result = recoverSkillOverlayForStartup(bundled);
        expect(result.action)
            .toBe("CURRENT_HEALTHY");
        expect(result.version)
            .toBe("0.1.4");
        expect(marker(current).health).toBeUndefined();
    });
    it("commits a newly activated overlay only after runtime startup health is explicitly confirmed", () => {
        const current = installedSkillOverlayRoot();
        writeSkillCorpus(current, "0.1.4", "PENDING_RESTART_VALIDATION");
        const previous = installedSkillOverlayPreviousRoot();
        writeSkillCorpus(previous, "0.1.3", "ACTIVE_HEALTHY");
        const bundled = path.join(root, "bundled");
        writeSkillCorpus(bundled);
        const first = recoverSkillOverlayForStartup(bundled);
        expect(first.action)
            .toBe("CURRENT_RUNTIME_VALIDATION");
        expect(marker(current).health).toBe("RUNTIME_VALIDATION_IN_PROGRESS");
        commitSkillOverlayRuntimeHealth(current);
        expect(marker(current).health).toBe("ACTIVE_HEALTHY");
        expect(marker(current)
            .runtimeValidatedAt).toEqual(expect.any(String));
        const next = recoverSkillOverlayForStartup(bundled);
        expect(next.action)
            .toBe("CURRENT_HEALTHY");
        expect(installedSkillOverlayVersion()).toBe("0.1.4");
        expect(fs.existsSync(previous)).toBe(true);
    });
    it("rolls back a structurally valid overlay when the prior runtime startup never committed health", () => {
        const current = installedSkillOverlayRoot();
        writeSkillCorpus(current, "0.1.4", "PENDING_RESTART_VALIDATION");
        const previous = installedSkillOverlayPreviousRoot();
        writeSkillCorpus(previous, "0.1.3", "ACTIVE_HEALTHY");
        const bundled = path.join(root, "bundled");
        writeSkillCorpus(bundled);
        const first = recoverSkillOverlayForStartup(bundled);
        expect(first.action)
            .toBe("CURRENT_RUNTIME_VALIDATION");
        const second = recoverSkillOverlayForStartup(bundled);
        expect(second.action)
            .toBe("ROLLED_BACK_TO_PREVIOUS");
        expect(second.version)
            .toBe("0.1.3");
        expect(second.rolledBackFromVersion).toBe("0.1.4");
        expect(marker(installedSkillOverlayRoot()).rollbackReason).toEqual([
            "RUNTIME_VALIDATION_INCOMPLETE"
        ]);
    });
    it("rolls a corrupt current overlay back to the retained previous package", () => {
        const current = installedSkillOverlayRoot();
        fs.mkdirSync(current, { recursive: true });
        fs.writeFileSync(path.join(current, ".lex-skills-version.json"), JSON.stringify({
            version: "0.1.4"
        }), "utf8");
        const previous = installedSkillOverlayPreviousRoot();
        writeSkillCorpus(previous, "0.1.3");
        const bundled = path.join(root, "bundled");
        writeSkillCorpus(bundled);
        const result = recoverSkillOverlayForStartup(bundled);
        expect(result.action)
            .toBe("ROLLED_BACK_TO_PREVIOUS");
        expect(result.version)
            .toBe("0.1.3");
        expect(result.rolledBackFromVersion).toBe("0.1.4");
        expect(installedSkillOverlayVersion()).toBe("0.1.3");
        expect(fs.existsSync(previous)).toBe(false);
        expect(marker(current).health).toBe("ROLLED_BACK_HEALTHY");
    });
    it("falls back to the bundled corpus when the first overlay update is corrupt", () => {
        const current = installedSkillOverlayRoot();
        fs.mkdirSync(current, { recursive: true });
        fs.writeFileSync(path.join(current, ".lex-skills-version.json"), JSON.stringify({
            version: "0.1.4"
        }), "utf8");
        const bundled = path.join(root, "bundled");
        writeSkillCorpus(bundled);
        const result = recoverSkillOverlayForStartup(bundled);
        expect(result.action)
            .toBe("ROLLED_BACK_TO_BUNDLED");
        expect(result.root)
            .toBe(path.resolve(bundled));
        expect(result.version)
            .toBe(CURRENT_APPLICATION_VERSION);
        expect(fs.existsSync(current)).toBe(false);
    });
    it("fails closed when current, previous and bundled corpora are all unhealthy", () => {
        const current = installedSkillOverlayRoot();
        const previous = installedSkillOverlayPreviousRoot();
        const bundled = path.join(root, "bundled");
        for (const [target, version] of [
            [current, "0.1.4"],
            [previous, "0.1.3"]
        ]) {
            fs.mkdirSync(target, {
                recursive: true
            });
            fs.writeFileSync(path.join(target, ".lex-skills-version.json"), JSON.stringify({
                version
            }), "utf8");
        }
        fs.mkdirSync(bundled, { recursive: true });
        expect(() => recoverSkillOverlayForStartup(bundled)).toThrow("SKILL_OVERLAY_STARTUP_INVALID_NO_ROLLBACK");
    });
});

import path from "node:path";
import { describe, expect, it } from "vitest";
import { LegalSession, CORE_LEGAL_RESOURCES } from "./legal-session.js";
import { LexSkillRegistry } from "./registry.js";
function developmentRegistry() {
    const root = path.resolve(process.cwd(), "../../Wersja rozwojowa rozpakowana");
    const registry = new LexSkillRegistry(root);
    const issues = registry.scan();
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
    return registry;
}
describe("router required-module runtime gate", () => {
    it("reads the entire router required_modules contract before execution becomes ready", () => {
        const registry = developmentRegistry();
        const router = registry.get("prawny-router-v3");
        expect(router)
            .toBeDefined();
        const declared = [
            ...new Set((router?.frontmatter
                .required_modules ??
                [])
                .map((resource) => String(resource)
                .split("#", 1)
                .at(0)
                ?.trim() ??
                "")
                .filter(Boolean))
        ];
        expect(declared.length).toBeGreaterThan(0);
        const session = new LegalSession(registry);
        const events = session
            .initializeLegalQuery();
        expect(session.state).toBe("EXECUTION_READY");
        expect(session
            .runtimeRequiredResources
            .size).toBe(declared.length);
        for (const resource of declared) {
            expect(session
                .runtimeRequiredResources
                .has(resource), resource).toBe(true);
        }
        for (const resource of CORE_LEGAL_RESOURCES) {
            expect(session
                .loadedResources
                .has(resource), resource).toBe(true);
        }
        expect(events.find((event) => event.type ===
            "gate" &&
            event.target ===
                "G39L_ROUTER_REQUIRED_MODULES")?.status).toBe("OK");
    });
});

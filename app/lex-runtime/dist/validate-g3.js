import path from "node:path";
import { fileURLToPath } from "node:url";
import { LexSkillRegistry } from "./registry.js";
import { LegalSession, LegalSessionBootstrapError } from "./legal-session.js";
const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana"));
const registry = new LexSkillRegistry(lexRoot);
const scanIssues = registry.scan();
if (scanIssues.length > 0) {
    process.stdout.write(JSON.stringify({
        gate: "G3_ROUTER_FIRST_BOOTSTRAP",
        result: "BLOCKED",
        reason: "CORPUS_SCAN_FAILED",
        issues: scanIssues
    }, null, 2) + "\n");
    process.exitCode = 1;
}
else {
    try {
        const session = new LegalSession(registry);
        const events = session.initializeLegalQuery();
        const firstSkillRead = events.find((event) => event.type === "skill_read");
        const pass = firstSkillRead?.target === "prawny-router-v3" &&
            session.state === "EXECUTION_READY";
        process.stdout.write(JSON.stringify({
            gate: "G3_ROUTER_FIRST_BOOTSTRAP",
            lexRoot,
            state: session.state,
            firstSkillRead: firstSkillRead?.target ?? null,
            events,
            result: pass ? "PASS" : "BLOCKED"
        }, null, 2) + "\n");
        if (!pass)
            process.exitCode = 1;
    }
    catch (error) {
        const details = error instanceof LegalSessionBootstrapError
            ? { target: error.target, events: error.events }
            : {};
        process.stdout.write(JSON.stringify({
            gate: "G3_ROUTER_FIRST_BOOTSTRAP",
            result: "BLOCKED",
            error: error instanceof Error ? error.message : String(error),
            ...details
        }, null, 2) + "\n");
        process.exitCode = 1;
    }
}

import path from "node:path";
import { fileURLToPath } from "node:url";
import { LexSkillRegistry } from "./registry.js";
const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana"));
const registry = new LexSkillRegistry(lexRoot);
const scanIssues = registry.scan();
const declarationIssues = registry.validateDeclarations();
const issues = [...scanIssues, ...declarationIssues];
const report = {
    gate: "G1_CORPUS_INTEGRITY",
    lexRoot,
    skillsDiscovered: registry.skills.size,
    issues,
    result: issues.length === 0 ? "PASS" : "BLOCKED"
};
process.stdout.write(JSON.stringify(report, null, 2) + "\n");
if (issues.length > 0) {
    process.exitCode = 1;
}

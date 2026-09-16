import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (p: string) => fs.readFileSync(path.join(repo, p), "utf8");

const source = JSON.parse(read("app/installer/windows-release-source.json"));
const runtime = JSON.parse(read("app/lex-runtime/package.json"));
const requirements = read("app/installer/windows-release-requirements.txt")
  .split(/\r?\n/)
  .map((line: string) => line.trim())
  .filter(Boolean);
const generator = read("app/installer/generate-component-lock.ps1");

const exactProd = Object.values(runtime.dependencies ?? {})
  .every((value) =>
    typeof value === "string" &&
    !/[~^*xX><=\s]/.test(value)
  );
const exactPython = requirements.every((line: string) =>
  /^[A-Za-z0-9_.-]+==[^=\s]+$/.test(line)
);
const pinnedSources =
  source.schemaVersion === 1 &&
  source.target === "windows-x86_64" &&
  /^\d+\.\d+\.\d+$/.test(source.runtime?.node?.version ?? "") &&
  /^https:\/\//.test(source.runtime?.node?.url ?? "") &&
  /^\d+\.\d+\.\d+$/.test(source.runtime?.python?.version ?? "") &&
  /^https:\/\//.test(source.runtime?.python?.url ?? "") &&
  !JSON.stringify(source).includes("TBD");
const lockContract =
  generator.includes("sha256Manifest") &&
  generator.includes("sourceCommit") &&
  generator.includes("networkRequiredAtInstall = $false") &&
  generator.includes('expectedUserActionAfterInstall = "PROVIDER_API_KEY_ONLY"');

const pass = exactProd && exactPython && pinnedSources && lockContract;
console.log(JSON.stringify({
  gate: "G33A_INSTALLER_COMPONENT_MANIFEST",
  result: pass ? "PASS" : "BLOCKED",
  exactRuntimeDependencies: exactProd,
  exactPythonPackages: exactPython,
  pinnedSources,
  perFileAndComponentHashes: lockContract
}, null, 2));
if (!pass) process.exitCode = 1;

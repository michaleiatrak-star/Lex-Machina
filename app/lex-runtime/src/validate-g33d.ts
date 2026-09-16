import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (relative: string) =>
  fs.readFileSync(path.join(repo, relative), "utf8");

const workflow = read(".github/workflows/lex-installer.yml");
const acceptance = read("app/installer/windows-installer-acceptance.ps1");
const selftest = read("app/installer/windows-payload-selftest.ps1");
const hooks = read("app/lex-desktop/src-tauri/windows/hooks.nsh");

const checks = {
  realOfflinePayloadJob:
    workflow.includes("G33D Windows offline installer build and acceptance") &&
    workflow.includes("build-windows-offline.ps1"),
  realNsisBundle:
    workflow.includes("tauri build --bundles nsis") &&
    workflow.includes("windows-installer-acceptance.ps1"),
  artifactPublished:
    workflow.includes("actions/upload-artifact") &&
    workflow.includes("LexMachina-Windows-Offline-Installer"),
  installedCopyTested:
    acceptance.includes("/S") &&
    acceptance.includes("lex-runtime-sidecar.exe") &&
    acceptance.includes("--self-test") &&
    acceptance.includes("PROVIDER_API_KEY_ONLY"),
  systemNodePythonExcluded:
    acceptance.includes("$env:PATH = \"$env:SystemRoot\\System32;$env:SystemRoot\"") &&
    acceptance.includes("privateNode") &&
    acceptance.includes("privatePython"),
  firstRunWithoutProviderKey:
    acceptance.includes("first desktop startup without provider key") &&
    acceptance.includes("INSTALLER_ACCEPTANCE_DESKTOP_EARLY_EXIT"),
  actualOcrNerRendererSelftest:
    selftest.includes("SELFTEST_OCR_INFERENCE_FAILED") &&
    selftest.includes("SELFTEST_NER_INFERENCE_FAILED") &&
    selftest.includes("SELFTEST_DOCX_RENDER_FAILED"),
  postInstallFailClosed:
    hooks.includes("--self-test") &&
    hooks.includes("Abort")
};

const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33D_INSTALLER_SELFTEST_ROLLBACK_ACCEPTANCE",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  expectedUserActionAfterInstall: "PROVIDER_API_KEY_ONLY"
}, null, 2));
if (!pass) process.exitCode = 1;

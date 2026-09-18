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
const bootstrap = read("app/installer/windows-online-bootstrap.ps1");
const packageVerifier = read("app/installer/verify-python-package-set.py");
const tauriConfig = JSON.parse(
  read("app/lex-desktop/src-tauri/tauri.conf.json")
) as {
  bundle?: {
    resources?: unknown;
  };
};

const checks = {
  realOnlineBootstrapJob:
    workflow.includes("G33D Windows online installer build and acceptance") &&
    workflow.includes("build-windows-online.ps1") &&
    !workflow.includes("NSISBI"),
  realNsisBundle:
    workflow.includes("tauri build --bundles nsis") &&
    workflow.includes("windows-installer-acceptance.ps1"),
  artifactPublished:
    workflow.includes("actions/upload-artifact") &&
    workflow.includes("LexMachina-Windows-Online-Installer"),
  installedCopyBootstrappedAndTested:
    acceptance.includes("/S") &&
    acceptance.includes("component-lock.json") &&
    acceptance.includes("lex-runtime-sidecar.exe") &&
    acceptance.includes("--self-test") &&
    acceptance.includes("runtimeNetworkRequiredAfterBootstrap"),
  monolithicBundleRejected:
    acceptance.includes("MONOLITHIC_BUNDLE_TOO_LARGE"),
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
  missingOnlyAndHashChecked:
    bootstrap.includes("Test-CommandVersion") &&
    bootstrap.includes("verify-python-package-set.py") &&
    bootstrap.includes("& $pythonExe $packageVerifier $manifestPath") &&
    packageVerifier.includes("importlib.metadata.version") &&
    packageVerifier.includes('print("PYTHON_PACKAGE_SET_PASS")') &&
    bootstrap.includes("Using verified cache") &&
    bootstrap.includes("BOOTSTRAP_HASH_MISMATCH"),
  postInstallFailClosed:
    hooks.includes("windows-online-bootstrap.ps1") &&
    hooks.includes("--self-test") &&
    hooks.includes("Abort"),
  deterministicRuntimeResourceMapping:
    tauriConfig.bundle?.resources === undefined &&
    hooks.includes('SetOutPath "$INSTDIR\\runtime"') &&
    hooks.includes(
      'File /r "${LEX_HOOK_FILE_DIR}\\..\\runtime\\*"'
    ) &&
    hooks.includes(
      'IfFileExists "$INSTDIR\\runtime\\app\\dist\\http\\server.js"'
    ) &&
    hooks.includes(
      'RMDir /r "$INSTDIR\\runtime\\app"'
    )
};

const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33D_INSTALLER_BOOTSTRAP_SELFTEST_ACCEPTANCE",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  expectedUserActionAfterInstall:
    "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP"
}, null, 2));
if (!pass) process.exitCode = 1;

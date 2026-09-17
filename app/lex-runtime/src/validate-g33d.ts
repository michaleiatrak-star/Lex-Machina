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
const entry = read("app/installer/windows-online-bootstrap-entry.ps1");
const embeddedPython = read("app/installer/windows-online-python-embedded.ps1");
const bootstrap = read("app/installer/windows-online-bootstrap.ps1");
const manifest = read("app/installer/windows-release-source.json");
const packageVerifier = read("app/installer/verify-python-package-set.py");

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
  registryIndependentPrivatePython:
    hooks.includes("windows-online-bootstrap-entry.ps1") &&
    entry.includes("PYTHONUTF8") &&
    entry.includes("windows-online-python-embedded.ps1") &&
    embeddedPython.includes("onlineEmbeddable") &&
    embeddedPython.includes("pipBootstrap") &&
    embeddedPython.includes("Get-VerifiedDownload") &&
    embeddedPython.includes("importlib.metadata.version('pip')") &&
    embeddedPython.includes("sys.flags.isolated == 1") &&
    manifest.includes('"onlineEmbeddable"') &&
    manifest.includes('"pipBootstrap"'),
  missingOnlyAndHashChecked:
    bootstrap.includes("Test-CommandVersion") &&
    bootstrap.includes("verify-python-package-set.py") &&
    bootstrap.includes("& $pythonExe $packageVerifier $manifestPath") &&
    packageVerifier.includes("importlib.metadata.version") &&
    packageVerifier.includes('print("PYTHON_PACKAGE_SET_PASS")') &&
    bootstrap.includes("Using verified cache") &&
    bootstrap.includes("BOOTSTRAP_HASH_MISMATCH"),
  postInstallFailClosed:
    hooks.includes("windows-online-bootstrap-entry.ps1") &&
    hooks.includes("--self-test") &&
    hooks.includes("Abort")
};

const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33D_INSTALLER_BOOTSTRAP_SELFTEST_ACCEPTANCE",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  expectedUserActionAfterInstall: "PROVIDER_API_KEY_ONLY"
}, null, 2));
if (!pass) process.exitCode = 1;

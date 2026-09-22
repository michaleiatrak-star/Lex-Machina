import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (p: string) => fs.readFileSync(path.join(repo, p), "utf8");

const config = JSON.parse(read("app/lex-desktop/src-tauri/tauri.conf.json"));
const source = JSON.parse(read("app/installer/windows-release-source.json"));
const build = read("app/installer/build-windows-online.ps1");
const bootstrap = read("app/installer/windows-online-bootstrap.ps1");
const packageVerifier = read("app/installer/verify-python-package-set.py");
const hooks = read("app/lex-desktop/src-tauri/windows/hooks.nsh");
const sidecar = read("app/lex-desktop/src-tauri/src/runtime_sidecar.rs");
const selftest = read("app/installer/windows-payload-selftest.ps1");
const paddle = read("app/ocr/paddle_worker.py");
const stanza = read("app/privacy/stanza_ner_worker.py");

const checks = {
  currentUserInstaller:
    config.bundle?.windows?.nsis?.installMode === "currentUser",
  webViewDownloadIfMissing:
    config.bundle?.windows?.webviewInstallMode?.type === "downloadBootstrapper",
  thinBundledRuntime:
    config.bundle?.resources === undefined &&
    hooks.includes('SetOutPath "$INSTDIR\\runtime"') &&
    hooks.includes(
      'File /r "${LEX_HOOK_FILE_DIR}\\..\\runtime\\*"'
    ) &&
    hooks.includes(
      'IfFileExists "$INSTDIR\\runtime\\app\\dist\\http\\server.js"'
    ) &&
    build.includes("Thin payload contract") &&
    build.includes("windows-online-bootstrap.ps1") &&
    build.includes("verify-python-package-set.py"),
  privateNodeDownloadIfMissing:
    bootstrap.includes("Test-CommandVersion") &&
    bootstrap.includes("manifest.runtime.node.url") &&
    bootstrap.includes("manifest.runtime.node.sha256") &&
    sidecar.includes('join("node")') &&
    sidecar.includes('join("node.exe")'),
  privatePythonDownloadIfMissing:
    source.runtime?.python?.delivery === "EMBEDDABLE_APP_LOCAL" &&
    bootstrap.includes("manifest.runtime.python.embeddable") &&
    bootstrap.includes("embedded.url") &&
    bootstrap.includes("embedded.sha256") &&
    bootstrap.includes("pipBootstrap.url") &&
    bootstrap.includes("pipBootstrap.sha256") &&
    sidecar.includes('join("python")') &&
    sidecar.includes('join("python.exe")'),
  pinnedPackagesOnlyIfNeeded:
    bootstrap.includes("verify-python-package-set.py") &&
    bootstrap.includes('$verifierArguments = (\'-X utf8 "{0}" "{1}"\' -f $packageVerifier, $manifestPath)') &&
    bootstrap.includes("Invoke-RedirectedNativeProcess") &&
    bootstrap.includes("-Executable $pythonExe") &&
    packageVerifier.includes("importlib.metadata.version") &&
    packageVerifier.includes('print("PYTHON_PACKAGE_SET_PASS")') &&
    bootstrap.includes("--upgrade-strategy only-if-needed") &&
    bootstrap.includes("windows-release-requirements.txt") === false &&
    build.includes("release-requirements.txt"),
  modelsDownloadIfMissing:
    bootstrap.includes("prefetch-release-models.py") &&
    bootstrap.includes("$modelsReady") &&
    selftest.includes("PP-OCRv6_medium_det") &&
    selftest.includes("PP-OCRv6_medium_rec") &&
    sidecar.includes('join("models").join("paddle")') &&
    sidecar.includes('join("models").join("stanza")'),
  visualCppDownloadIfMissing:
    source.systemPrerequisites?.visualCppRuntime?.delivery === "DOWNLOAD_IF_MISSING" &&
    /^[a-f0-9]{64}$/i.test(
      source.systemPrerequisites?.visualCppRuntime?.sha256 ?? ""
    ) &&
    bootstrap.includes("visual-cpp-runtime") &&
    bootstrap.includes(
      'Get-VerifiedDownload $vc.url $vc.sha256 $vcInstaller "visual-cpp-runtime"'
    ) &&
    bootstrap.includes("if (-not (Test-IsAdministrator))") &&
    bootstrap.includes('$startArgs.Verb = "RunAs"'),
  verifiedSourceCache:
    source.notes?.cachePolicy === "REUSE_ONLY_AFTER_SHA256_VERIFICATION" &&
    bootstrap.includes("Using verified cache") &&
    bootstrap.includes("BOOTSTRAP_HASH_MISMATCH"),
  coreRuntimeNetworkIndependentAfterBootstrap:
    source.localAi?.delivery === "USER_INITIATED_AFTER_INSTALL" &&
    source.localAi?.applicationUsableWithoutLocalAi === true &&
    source.notes?.networkAtInstall ===
      "REQUIRED_FOR_MISSING_CORE_COMPONENTS_ONLY; LOCAL_LLM_IS_NOT_INSTALLED_DURING_APPLICATION_INSTALL" &&
    source.notes?.networkAfterBootstrapBeforeProviderUse ===
      "OPTIONAL_FOR_USER_INITIATED_LOCAL_AI_PROVISIONING, LOCAL_AI_WEB_RESEARCH, DIRECT_LEGAL_MCP_FIRST_USE, ACCOUNT_SESSION_CLIENT_PROVISIONING, AND UPDATES" &&
    source.localAi?.networkRequiredForCoreInference === false &&
    source.localAi?.networkRequiredForWebResearch === true &&
    source.localAi?.directMcp?.legalFederation?.firstUseNetworkRequired === true &&
    source.accountSessionClients?.bundledInInstaller === false &&
    source.accountSessionClients?.codex?.delivery === "ON_DEMAND_AFTER_USER_SELECTS_CHATGPT_ACCOUNT" &&
    source.accountSessionClients?.claude?.delivery === "ON_DEMAND_AFTER_USER_SELECTS_CLAUDE_ACCOUNT" &&
    selftest.includes("runtimeNetworkRequiredAfterBootstrap") &&
    selftest.includes("LOCAL_AI_PROVISIONING") &&
    paddle.includes("LEX_PADDLE_MODEL_DIR is required") &&
    sidecar.includes("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK") &&
    stanza.includes("download_method=None"),
  postInstallBootstrapFailClosed:
    hooks.includes("windows-online-bootstrap.ps1") &&
    hooks.includes("Abort")
};
const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33B_VERIFIED_ONLINE_BOOTSTRAP_INSTALLATION",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  expectedUserActionAfterInstall:
    "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP"
}, null, 2));
if (!pass) process.exitCode = 1;

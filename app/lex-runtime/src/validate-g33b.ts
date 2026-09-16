import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (p: string) => fs.readFileSync(path.join(repo, p), "utf8");

const config = JSON.parse(read("app/lex-desktop/src-tauri/tauri.conf.json"));
const build = read("app/installer/build-windows-offline.ps1");
const sidecar = read("app/lex-desktop/src-tauri/src/runtime_sidecar.rs");
const paddle = read("app/ocr/paddle_worker.py");
const stanza = read("app/privacy/stanza_ner_worker.py");

const checks = {
  currentUserInstaller:
    config.bundle?.windows?.nsis?.installMode === "currentUser",
  offlineWebView2:
    config.bundle?.windows?.webviewInstallMode?.type === "offlineInstaller",
  bundledRuntime:
    Array.isArray(config.bundle?.resources) &&
    config.bundle.resources.includes("runtime/**/*"),
  privateNode:
    build.includes("Private Node") &&
    sidecar.includes('join("node")') &&
    sidecar.includes('join("node.exe")'),
  privatePython:
    build.includes("Private Python") &&
    sidecar.includes('join("python")') &&
    sidecar.includes('join("python.exe")'),
  bundledModels:
    build.includes("prefetch-release-models.py") &&
    sidecar.includes("PP-OCRv6_medium_det") &&
    sidecar.includes("PP-OCRv6_medium_rec") &&
    sidecar.includes('join("stanza")'),
  paddleNetworkDisabled:
    paddle.includes("LEX_PADDLE_MODEL_DIR is required") &&
    sidecar.includes("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"),
  stanzaNetworkDisabled:
    stanza.includes("download_method=None") &&
    stanza.includes("STANZA_RESOURCES_DIR is required"),
  noInstallNetwork:
    build.includes("windows-payload-selftest.ps1")
};
const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33B_OFFLINE_BUNDLED_INSTALLATION",
  result: pass ? "PASS" : "BLOCKED",
  checks
}, null, 2));
if (!pass) process.exitCode = 1;

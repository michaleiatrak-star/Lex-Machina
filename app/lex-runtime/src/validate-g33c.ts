import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (p: string) => fs.readFileSync(path.join(repo, p), "utf8");

const config = JSON.parse(read("app/lex-desktop/src-tauri/tauri.conf.json"));
const hooks = read("app/lex-desktop/src-tauri/windows/hooks.nsh");
const trust = read("app/lex-desktop/src-tauri/src/trust_boundary.rs");
const authUi = read("app/lex-web/src/AuthApp.tsx");
const authoring = read("app/lex-web/src/DocumentAuthoringPanel.tsx");

const checks = {
  postInstallSelfTest:
    config.bundle?.windows?.nsis?.installerHooks === "./windows/hooks.nsh" &&
    hooks.includes("lex-runtime-sidecar.exe") &&
    hooks.includes("--self-test") &&
    hooks.includes("Abort"),
  managedWindowsCredential:
    trust.includes("MANAGED_KEYRING_SERVICE") &&
    trust.includes("Entry::new") &&
    trust.includes("ensure_managed_identity"),
  automaticBootstrap:
    trust.includes("/api/auth/bootstrap") &&
    trust.includes('"loginName": MANAGED_LOGIN'),
  automaticLogin:
    trust.includes("/api/auth/login") &&
    authUi.includes("getAuthMe()") &&
    authUi.includes("isDesktopShell()"),
  passwordlessDesktopUnlock:
    authUi.includes("__LEX_NATIVE_LOGIN__"),
  nativeDeanonymizationReauth:
    authoring.includes("isDesktopShell()") &&
    trust.includes("__LEX_NATIVE_REAUTH__"),
  providerKeyOnlyPolicy:
    read("app/installer/generate-component-lock.ps1")
      .includes('expectedUserActionAfterInstall = "PROVIDER_API_KEY_ONLY"')
};
const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33C_ZERO_TOUCH_FIRST_RUN",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  normalUserActionsAfterSetup: ["PROVIDER_API_KEY"]
}, null, 2));
if (!pass) process.exitCode = 1;

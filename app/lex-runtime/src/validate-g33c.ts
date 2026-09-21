import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const read = (p: string) => fs.readFileSync(path.join(repo, p), "utf8");

const config = JSON.parse(read("app/lex-desktop/src-tauri/tauri.conf.json"));
const hooks = read("app/lex-desktop/src-tauri/windows/hooks.nsh");
const server = read("app/lex-runtime/src/http/server.ts");
const crypto = read("app/lex-runtime/src/auth/crypto.ts");
const authUi = read("app/lex-web/src/AuthApp.tsx");
const securityUi = read("app/lex-web/src/AccountSecurityPanel.tsx");
const trust = read("app/lex-desktop/src-tauri/src/trust_boundary.rs");
const authoring = read("app/lex-web/src/DocumentAuthoringPanel.tsx");

const checks = {
  postInstallSelfTest:
    config.bundle?.windows?.nsis?.installerHooks === "./windows/hooks.nsh" &&
    hooks.includes("lex-runtime-sidecar.exe") &&
    hooks.includes("--self-test") &&
    hooks.includes("Abort"),
  firstAdminSeeded:
    server.includes('loginName: "admin"') &&
    server.includes('password: "admin"') &&
    server.includes("passwordSetupPending: true"),
  bootstrapSessionNotExposed:
    server.includes("logoutAuthorization(") &&
    server.includes("bootstrap.sessionToken"),
  manualFirstLogin:
    authUi.includes("temporaryAdminCredentialsActive") &&
    authUi.includes('? "admin"') &&
    authUi.includes("<strong>Pierwsze logowanie</strong>") &&
    authUi.includes("Login <b>admin</b>, hasło <b>admin</b>."),
  warnedPasswordReplacement:
    authUi.includes("passwordSetupPending === true") &&
    authUi.includes("password-setup-banner") &&
    authUi.includes('role="alert"') &&
    authUi.includes("Konto korzysta jeszcze z hasła początkowego") &&
    authUi.includes('section: "security"') &&
    securityUi.includes("co najmniej 10 znaków") &&
    crypto.includes("length < 10"),
  firstRunIsWarningNotBlockade:
    !authUi.includes("Zanim przejdziesz dalej") &&
    !/passwordSetupPending === true\s*\)\s*\{\s*return \(/.test(authUi) &&
    authUi.includes("<App"),
  nativeDeanonymizationReauth:
    authoring.includes("isDesktopShell()") &&
    trust.includes("__LEX_NATIVE_REAUTH__"),
  providerCredentialPersistence:
    trust.includes("PROVIDER_KEYRING_SERVICE") &&
    trust.includes("restore_provider_credentials") &&
    trust.includes("persist_provider_credential"),
  providerOrOptionalLocalAiPolicy:
    read("app/installer/generate-component-lock.ps1")
      .includes(
        'expectedUserActionAfterInstall = "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP"'
      ) &&
    read("app/installer/generate-component-lock.ps1")
      .includes('delivery = "USER_INITIATED_AFTER_INSTALL"')
};
const pass = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  gate: "G33C_FIRST_RUN_ADMIN_LOGIN",
  result: pass ? "PASS" : "BLOCKED",
  checks,
  requiredFirstRunActions: [
    "LOGIN_WITH_TEMPORARY_ADMIN_CREDENTIAL",
    "WORK_IS_ALLOWED_WITH_PERSISTENT_TOP_WARNING",
    "CHANGE_PASSWORD_MIN_10_CHARACTERS"
  ],
  normalUserActionsAfterSetup: [
    "PROVIDER_API_KEY",
    "OPTIONAL_LOCAL_AI_SETUP"
  ]
}, null, 2));
if (!pass) process.exitCode = 1;

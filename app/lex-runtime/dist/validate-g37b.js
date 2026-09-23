import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
function read(relative) {
    return fs.readFileSync(path.join(repoRoot, relative), "utf8");
}
const service = read("app/lex-runtime/src/auth/service.ts");
const server = read("app/lex-runtime/src/http/server.ts");
const store = read("app/lex-runtime/src/auth/store.ts");
const types = read("app/lex-runtime/src/auth/types.ts");
const crypto = read("app/lex-runtime/src/auth/crypto.ts");
const authUi = read("app/lex-web/src/AuthApp.tsx");
const securityUi = read("app/lex-web/src/AccountSecurityPanel.tsx");
const test = read("app/lex-runtime/tests/g37b-password-setup.test.ts");
const checks = {
    explicitPendingState: types.includes("passwordSetupPending?: boolean") &&
        store.includes("password_setup_pending"),
    exactTemporaryDefaultAdmin: service.includes('normalizedLoginName === "admin"') &&
        service.includes('input.password === "admin"') &&
        service.includes("input.passwordSetupPending === true"),
    productionSeed: server.includes('loginName: "admin"') &&
        server.includes('password: "admin"') &&
        server.includes("passwordSetupPending: true"),
    bootstrapSessionDiscarded: server.includes("logoutAuthorization(") &&
        server.includes("bootstrap.sessionToken"),
    replacementMinimumTen: crypto.includes("length < 10") &&
        securityUi.includes("co najmniej 10 znaków"),
    setupUsesSameUmk: service.includes("completePasswordSetupAndRotateRecovery") &&
        service.includes("encryptUserMasterKey("),
    recoveryRotatedOnSetup: service.includes("password_setup_completed") &&
        service.includes("encryptRecoveryUserMasterKey("),
    authEpochRevoked: service.includes('"AUTH_EPOCH"') &&
        store.includes("auth_epoch + 1"),
    uiWarnsUntilPasswordChanged: authUi.includes("passwordSetupPending === true") &&
        authUi.includes("password-setup-banner") &&
        authUi.includes("Konto korzysta jeszcze z hasła początkowego") &&
        authUi.includes('section: "security"') &&
        securityUi.includes("Zmień początkowe hasło"),
    uiDoesNotBlockWorkBeforeSetup: authUi.includes("<App") &&
        !authUi.includes("Zanim przejdziesz dalej"),
    lifecycleRegression: test.includes("allows admin/admin only for first-run bootstrap") &&
        test.includes('newPassword: "123456789"') &&
        test.includes('newPassword: "1234567890"') &&
        test.includes("INVALID_CREDENTIALS")
};
const pass = Object.values(checks)
    .every(Boolean);
console.log(JSON.stringify({
    gate: "G37B_FIRST_ADMIN_PASSWORD_SETUP",
    result: pass
        ? "PASS"
        : "BLOCKED",
    checks
}, null, 2));
if (!pass) {
    process.exitCode = 1;
}

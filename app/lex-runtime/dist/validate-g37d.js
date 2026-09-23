import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
function read(relative) {
    return fs.readFileSync(path.join(repoRoot, relative), "utf8");
}
const support = read("app/lex-runtime/src/support-service.ts");
const http = read("app/lex-runtime/src/http/app.ts");
const server = read("app/lex-runtime/src/http/server.ts");
const trust = read("app/lex-desktop/src-tauri/src/trust_boundary.rs");
const test = read("app/lex-runtime/tests/g37d-support-entitlement.test.ts");
const checks = {
    noUniversalSupportPassword: !support.includes("servicePassword") &&
        !trust.includes("SUPPORT_PASSWORD"),
    installationBound: support.includes("installationId") &&
        trust.includes("SUPPORT_INSTALLATION_ACCOUNT"),
    nativeChallengeKey: trust.includes("SigningKey") &&
        trust.includes("challenge-signing-key") &&
        trust.includes("challengeSignature"),
    vendorSignature: support.includes("createPublicKey") &&
        support.includes("verify(") &&
        support.includes("ed25519"),
    explicitAdminApproval: support.includes('actor.user.appRole !== "ADMIN"') &&
        http.includes('"/api/admin/support/activate"'),
    boundedTtlAndReplay: support.includes("MAX_ENTITLEMENT_TTL_MS") &&
        support.includes("this.challenges.delete"),
    serviceSeparateFromUserAuth: http.includes('"/api/support"') &&
        http.includes("x-lex-service-authorization") &&
        trust.includes("service_token") &&
        trust.includes("extract_and_strip_service_token"),
    nativeHeaderCannotBeSpoofed: trust.includes('lower != "x-lex-service-authorization"'),
    noCaseDataSupportRoutes: http.includes('"/api/support/diagnostics"') &&
        !support.includes("withCaseDataKey") &&
        !support.includes("reidentify"),
    auditedLifecycle: support.includes("support_session_activated") &&
        support.includes("support_operation") &&
        support.includes("support_session_revoked"),
    failClosedTrustConfig: support.includes("SUPPORT_NOT_CONFIGURED") &&
        server.includes("LEX_SUPPORT_VENDOR_PUBLIC_KEY_PEM"),
    deterministicRegression: test.includes("signed SERVICE support entitlement") &&
        test.includes("SUPPORT_CHALLENGE_INVALID") &&
        test.includes("SUPPORT_SESSION_EXPIRED")
};
const pass = Object.values(checks)
    .every(Boolean);
console.log(JSON.stringify({
    gate: "G37D_SIGNED_SERVICE_SUPPORT_ENTITLEMENT",
    result: pass
        ? "PASS"
        : "BLOCKED",
    checks
}, null, 2));
if (!pass) {
    process.exitCode = 1;
}

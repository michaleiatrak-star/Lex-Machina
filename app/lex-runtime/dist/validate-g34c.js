import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LocalAuthStore } from "./auth/store.js";
import { LocalAuthService } from "./auth/service.js";
import { AuthSessionManager } from "./auth/session-manager.js";
import { LocalCaseFileStore } from "./case-file-store.js";
import { LocalCaseAccessService } from "./case-access.js";
const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-g34c-"));
try {
    const store = new LocalAuthStore({
        rootDir: root
    });
    const auth = new LocalAuthService(store, {
        sessionManager: new AuthSessionManager({
            scheduleExpiryTimers: false
        }),
        kdf: {
            memoryKiB: 1024,
            iterations: 1,
            parallelism: 1,
            keyLength: 32,
            version: 1
        }
    });
    const files = new LocalCaseFileStore({
        rootDir: root
    });
    const cases = new LocalCaseAccessService(store, auth, files);
    const owner = await auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password: "G34C owner bezpieczne haslo 2026"
    });
    const ownerContext = {
        user: owner.user,
        session: owner.session
    };
    const target = await auth.createUser(ownerContext, {
        loginName: "analyst",
        displayName: "Analyst",
        password: "G34C analyst bezpieczne haslo 2026"
    });
    const legacy = await files.createCase("legacy fixture");
    if (cases.listCases(ownerContext).some((item) => item.caseId ===
        legacy.caseId)) {
        throw new Error("G34C_LEGACY_AUTO_ASSIGNED");
    }
    const localCase = await cases.createCase(ownerContext, "G34C fixture");
    await cases.grantAccess(ownerContext, localCase.caseId, {
        userId: target.userId,
        role: "ANALYST",
        canReidentify: false
    });
    const targetLogin = await auth.login({
        loginName: "analyst",
        password: "G34C analyst bezpieczne haslo 2026"
    });
    const targetContext = {
        user: targetLogin.user,
        session: targetLogin.session
    };
    const visible = cases.listCases(targetContext);
    if (visible.length !== 1 ||
        visible[0]?.caseId !==
            localCase.caseId ||
        visible[0]?.role !==
            "ANALYST") {
        throw new Error("G34C_VISIBLE_CASE_SET_FAILED");
    }
    let writeDenied = false;
    try {
        cases.assertAccess(targetContext, localCase.caseId, "WRITE");
    }
    catch {
        writeDenied = true;
    }
    if (!writeDenied) {
        throw new Error("G34C_WRITE_ROLE_BYPASS");
    }
    let reidentifyDenied = false;
    try {
        cases.assertAccess(targetContext, localCase.caseId, "REIDENTIFY");
    }
    catch {
        reidentifyDenied = true;
    }
    if (!reidentifyDenied) {
        throw new Error("G34C_REIDENTIFY_BYPASS");
    }
    auth.close();
    process.stdout.write("G34C_CASE_ACL: PASS\n");
}
finally {
    fs.rmSync(root, {
        recursive: true,
        force: true
    });
}

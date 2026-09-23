import { randomBytes } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LocalCaseFileStore } from "./case-file-store.js";
import { SecureCaseUploadStore } from "./case-secure-store.js";
import { LegacyCaseStorageMigrator } from "./legacy-case-migration.js";
const root = await mkdtemp(path.join(os.tmpdir(), "lex-g34h5-validate-"));
const ownerId = "user_0123456789abcdef0123456789abcdef";
async function containsNeedle(directory, needle) {
    let entries;
    try {
        entries = await readdir(directory, { withFileTypes: true });
    }
    catch (error) {
        if (error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT") {
            return false;
        }
        throw error;
    }
    for (const entry of entries) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (await containsNeedle(target, needle)) {
                return true;
            }
        }
        else {
            const data = await readFile(target);
            try {
                if (data.includes(needle)) {
                    return true;
                }
            }
            finally {
                data.fill(0);
            }
        }
    }
    return false;
}
try {
    const legacy = new LocalCaseFileStore({
        rootDir: root
    });
    const secure = new SecureCaseUploadStore({
        rootDir: root
    });
    const migrator = new LegacyCaseStorageMigrator(secure, { rootDir: root });
    const key = randomBytes(32);
    const clear = Buffer.from("%PDF-client-pesel-90010112345-legacy");
    const localCase = await legacy.createCase({
        createdByUserId: ownerId,
        keyVersion: 1,
        displayName: "Legacy H5"
    });
    const uploaded = await legacy.saveUpload({
        caseId: localCase.caseId,
        filename: "legacy.pdf",
        mediaType: "application/pdf",
        data: clear,
        extractArchive: false
    });
    const first = await migrator.migrate({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
    });
    const secureInventory = await secure.listUploads({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
    });
    const secureMatch = secureInventory.find((item) => item.uploadId ===
        uploaded.uploadId);
    const payload = await secure.readUploadPayload({
        caseId: localCase.caseId,
        uploadId: uploaded.uploadId,
        caseDataKey: key,
        keyVersion: 1,
        maxBytes: 1024
    });
    const encryptedRoundTrip = payload.equals(clear);
    payload.fill(0);
    const caseRoot = path.join(root, "cases", localCase.caseId);
    const plaintextRemaining = await containsNeedle(caseRoot, Buffer.from("client-pesel-90010112345-legacy"));
    const second = await migrator.migrate({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
    });
    const idempotent = second.remainingLegacyPlaintext ===
        false &&
        second.migratedUploads.length ===
            0;
    const blockedCase = await legacy.createCase({
        createdByUserId: ownerId,
        keyVersion: 1,
        displayName: "Blocked H5"
    });
    const blockerPath = path.join(root, "cases", blockedCase.caseId, "artifacts", "unknown.bin");
    await writeFile(blockerPath, "must-survive");
    const blocked = await migrator.migrate({
        caseId: blockedCase.caseId,
        caseDataKey: key,
        keyVersion: 1
    });
    const blockerPreserved = (await readFile(blockerPath, "utf8")) === "must-survive";
    const pass = first.remainingLegacyPlaintext ===
        false &&
        first.migratedUploads.includes(uploaded.uploadId) &&
        secureMatch?.storage ===
            "ENCRYPTED_LME1" &&
        secureMatch.sha256 ===
            uploaded.sha256 &&
        encryptedRoundTrip &&
        !plaintextRemaining &&
        idempotent &&
        blocked.remainingLegacyPlaintext ===
            true &&
        blocked.blockedEntries.includes("artifacts:NONEMPTY_LEGACY_DIRECTORY") &&
        blockerPreserved;
    process.stdout.write(JSON.stringify({
        gate: "G34H5_LEGACY_PLAINTEXT_MIGRATION",
        result: pass ? "PASS" : "BLOCKED",
        verifiedBeforePlaintextRemoval: encryptedRoundTrip,
        plaintextRemaining,
        sameUploadIdPreserved: secureMatch?.uploadId ===
            uploaded.uploadId,
        idempotent,
        unknownLegacyBlocked: blocked.remainingLegacyPlaintext,
        unknownLegacyPreserved: blockerPreserved,
        secureEraseClaimed: false
    }, null, 2) + "\n");
    key.fill(0);
    clear.fill(0);
    if (!pass) {
        process.exitCode = 1;
    }
}
finally {
    await rm(root, {
        recursive: true,
        force: true
    });
}

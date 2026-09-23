import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CompleteDocumentIngestor } from "./document-ingestion.js";
import { LocalPrivateDocumentService } from "./document-service.js";
import { LocalAuthStore } from "./auth/store.js";
import { LocalAuthService } from "./auth/service.js";
import { AuthSessionManager } from "./auth/session-manager.js";
import { LocalCaseFileStore } from "./case-file-store.js";
import { LocalCaseAccessService } from "./case-access.js";
import { SecureCaseUploadStore } from "./case-secure-store.js";
import { SecureCaseDocumentStore } from "./case-document-store.js";
import { EncryptedPrivacyVaultStore } from "./privacy/vault-store.js";
import { CaseSecurityRotationCoordinator } from "./case-security-rotation.js";
const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-g34h3-validate-"));
function allBytes(directory) {
    const parts = [];
    const walk = (current) => {
        for (const entry of fs.readdirSync(current, {
            withFileTypes: true
        })) {
            parts.push(Buffer.from(entry.name, "utf8"));
            const target = path.join(current, entry.name);
            if (entry.isDirectory()) {
                walk(target);
            }
            else {
                parts.push(fs.readFileSync(target));
            }
        }
    };
    if (fs.existsSync(directory)) {
        walk(directory);
    }
    return Buffer.concat(parts);
}
try {
    const authStore = new LocalAuthStore({
        rootDir: root
    });
    const auth = new LocalAuthService(authStore, {
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
    const vaultStore = new EncryptedPrivacyVaultStore({
        rootDir: root
    });
    const uploadStore = new SecureCaseUploadStore({
        rootDir: root
    });
    const documentStore = new SecureCaseDocumentStore({
        rootDir: root
    });
    const rotation = new CaseSecurityRotationCoordinator(vaultStore, uploadStore, documentStore);
    const cases = new LocalCaseAccessService(authStore, auth, files, rotation);
    const owner = await auth.bootstrap({
        loginName: "g34h3-owner",
        displayName: "G34H3 Owner",
        password: "G34H3 walidacyjne bezpieczne haslo 2026"
    });
    const actor = {
        user: owner.user,
        session: owner.session
    };
    const legalCase = await cases.createCase(actor, "G34H3");
    const sourceText = "Jan Kowalski jest powodem. PESEL 44051401458. Treść sprawy pozostaje lokalna.";
    const ingestor = new CompleteDocumentIngestor({
        extract: async (data) => ({
            bytes: data.byteLength,
            pages: [{
                    page: 1,
                    text: sourceText
                }]
        })
    });
    const service = new LocalPrivateDocumentService(ingestor, {
        recognize: async () => []
    }, 24_000, undefined, vaultStore, documentStore);
    let documentId = "";
    let oldKey;
    await cases.withCaseDataKey(actor, legalCase.caseId, "WRITE", async (caseDataKey) => {
        oldKey =
            Buffer.from(caseDataKey);
        const review = await service.review(Buffer.from("%PDF-g34h3-validator"), "application/pdf", {
            caseId: legalCase.caseId,
            caseDataKey,
            keyVersion: legalCase.keyVersion
        });
        documentId =
            review.documentId;
        await service.finalizeReview(documentId, [{
                page: 1,
                start: 0,
                end: "Jan Kowalski".length,
                action: "PSEUDONYMIZE",
                kind: "PERSON"
            }], {
            caseId: legalCase.caseId,
            caseDataKey,
            keyVersion: legalCase.keyVersion
        });
    });
    const secureDocumentRoot = path.join(root, "cases", legalCase.caseId, "secure", "documents", documentId);
    const disk = allBytes(secureDocumentRoot);
    const noPlaintext = !disk.includes(Buffer.from("Jan Kowalski", "utf8")) &&
        !disk.includes(Buffer.from("44051401458", "utf8"));
    let restartRoundTrip = false;
    await cases.withCaseDataKey(actor, legalCase.caseId, "READ", async (caseDataKey) => {
        const restarted = new LocalPrivateDocumentService(ingestor, {
            recognize: async () => []
        }, 24_000, undefined, new EncryptedPrivacyVaultStore({
            rootDir: root
        }), new SecureCaseDocumentStore({
            rootDir: root
        }));
        const restored = await restarted
            .restoreDocument({
            caseId: legalCase.caseId,
            documentId,
            caseDataKey,
            keyVersion: 1
        });
        const attachment = await restarted
            .resolveProtectedChunks({
            documentId,
            chunkIndices: [1]
        });
        restartRoundTrip =
            restored.chunks.length >
                0 &&
                attachment.chunks[0]
                    ?.text.includes("[PII:PERSON:0001]") === true &&
                restarted.deanonymize(documentId, "[PII:PERSON:0001]") ===
                    "Jan Kowalski";
    });
    const rotated = await cases.rotateCaseKey(actor, legalCase.caseId);
    let rotatedRoundTrip = false;
    await cases.withCaseDataKey(actor, legalCase.caseId, "READ", async (caseDataKey) => {
        const restarted = new LocalPrivateDocumentService(ingestor, {
            recognize: async () => []
        }, 24_000, undefined, new EncryptedPrivacyVaultStore({
            rootDir: root
        }), new SecureCaseDocumentStore({
            rootDir: root
        }));
        const restored = await restarted
            .restoreDocument({
            caseId: legalCase.caseId,
            documentId,
            caseDataKey,
            keyVersion: rotated.keyVersion
        });
        rotatedRoundTrip =
            restored.chunks[0]
                ?.text.includes("[PII:PERSON:0001]") === true &&
                restarted.deanonymize(documentId, "[PII:PERSON:0001]") ===
                    "Jan Kowalski";
    });
    let oldKeyBlocked = false;
    try {
        await documentStore
            .loadSource({
            caseId: legalCase.caseId,
            documentId,
            caseDataKey: oldKey,
            keyVersion: rotated.keyVersion
        });
    }
    catch {
        oldKeyBlocked = true;
    }
    const pass = noPlaintext &&
        restartRoundTrip &&
        rotated.keyVersion === 2 &&
        rotatedRoundTrip &&
        oldKeyBlocked;
    process.stdout.write(JSON.stringify({
        gate: "G34H3_ENCRYPTED_DOCUMENT_PERSISTENCE",
        result: pass
            ? "PASS"
            : "BLOCKED",
        sourceAndProtectedLmePresent: fs.existsSync(path.join(secureDocumentRoot, "source.lme")) &&
            fs.existsSync(path.join(secureDocumentRoot, "protected.lme")),
        clearOcrOrPiiPersisted: !noPlaintext,
        restartRoundTrip,
        caseKeyRotationCompatible: rotatedRoundTrip,
        oldCaseKeyBlocked: oldKeyBlocked,
        fullG34HClaimed: false,
        remaining: [
            "G34H4_ARTIFACT_PERSISTENCE",
            "G34H5_LEGACY_MIGRATION"
        ]
    }, null, 2) +
        "\n");
    oldKey?.fill(0);
    auth.close();
    if (!pass) {
        process.exitCode = 1;
    }
}
finally {
    fs.rmSync(root, {
        recursive: true,
        force: true
    });
}

import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LocalAuthStore } from "./auth/store.js";
import { LocalAuthService } from "./auth/service.js";
import { AuthSessionManager } from "./auth/session-manager.js";
import { LocalCaseFileStore } from "./case-file-store.js";
import { LocalCaseAccessService } from "./case-access.js";
import { PseudonymizationVault } from "./privacy/pseudonymizer.js";
import { EncryptedPrivacyVaultStore } from "./privacy/vault-store.js";
import { SecureCaseArtifactStore } from "./case-artifact-store.js";
import { DocumentGenerationStateStore } from "./document-generation-state.js";
import { LocalDocumentAuthoringService } from "./document-authoring-service.js";
import { DeanonymizationReauthorizationManager } from "./auth/reauthorization.js";
import { SensitiveDownloadTicketManager } from "./sensitive-download-ticket.js";
const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-g34f-full-"));
let auth;
try {
    const store = new LocalAuthStore({
        rootDir: root
    });
    const now = {
        value: Date.parse("2026-09-16T15:00:00.000Z")
    };
    const clock = {
        now: () => now.value
    };
    auth =
        new LocalAuthService(store, {
            clock,
            sessionManager: new AuthSessionManager({
                clock,
                scheduleExpiryTimers: false,
                policy: {
                    idleTimeoutMs: 60 * 60 *
                        1000,
                    overallTimeoutMs: 8 * 60 *
                        60 * 1000
                }
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
    const password = "G34F pelny walidator bezpieczne haslo 2026";
    const owner = await auth.bootstrap({
        loginName: "owner-g34f",
        displayName: "Owner G34F",
        password
    });
    const actor = {
        user: owner.user,
        session: owner.session
    };
    const legalCase = await cases.createCase(actor, "G34F full");
    const privacy = new EncryptedPrivacyVaultStore({
        rootDir: root
    });
    const artifacts = new SecureCaseArtifactStore({
        rootDir: root
    });
    const generationState = new DocumentGenerationStateStore({
        rootDir: root
    });
    const authoring = new LocalDocumentAuthoringService(privacy, artifacts, generationState);
    const documentId = "doc_0123456789abcdef01234567";
    const vault = new PseudonymizationVault();
    vault.getOrCreate("PERSON", "Jan Kowalski");
    const caseView = cases.openCase(actor, legalCase.caseId);
    await cases.withCaseDataKey(actor, legalCase.caseId, "WRITE", async (caseDataKey) => {
        await privacy
            .saveDocumentVault({
            caseId: legalCase.caseId,
            documentId,
            vault,
            caseDataKey,
            keyVersion: caseView.keyVersion
        });
    });
    const validationContext = {
        schemaVersion: 1,
        sourceSessionId: "g34f-full-session",
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
        provider: "openai",
        model: "g34f-validator",
        usedDocumentContext: true,
        verificationRecords: [],
        auditEvents: [
            {
                sequence: 1,
                timestamp: "2026-09-16T15:00:00.000Z",
                type: "session_started",
                target: "g34f-full-session",
                status: "OK"
            },
            {
                sequence: 2,
                timestamp: "2026-09-16T15:00:01.000Z",
                type: "skill_read",
                target: "prawny-router-v3",
                status: "OK"
            },
            {
                sequence: 3,
                timestamp: "2026-09-16T15:00:02.000Z",
                type: "skill_read",
                target: "prawo-polskie-v2",
                status: "OK"
            },
            {
                sequence: 4,
                timestamp: "2026-09-16T15:00:03.000Z",
                type: "route",
                target: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
                status: "OK"
            },
            {
                sequence: 5,
                timestamp: "2026-09-16T15:00:04.000Z",
                type: "resource_read",
                target: "local-document:" +
                    documentId,
                status: "OK"
            },
            {
                sequence: 6,
                timestamp: "2026-09-16T15:00:05.000Z",
                type: "provider_start",
                target: "openai",
                status: "OK"
            },
            {
                sequence: 7,
                timestamp: "2026-09-16T15:00:06.000Z",
                type: "provider_end",
                target: "openai",
                status: "OK"
            },
            {
                sequence: 8,
                timestamp: "2026-09-16T15:00:07.000Z",
                type: "session_closed",
                target: "g34f-full-session",
                status: "OK"
            }
        ]
    };
    const tokenized = await cases.withCaseDataKey(actor, legalCase.caseId, "WRITE", async (caseDataKey) => await authoring
        .createTokenized({
        caseId: legalCase.caseId,
        createdByUserId: owner.user.userId,
        format: "docx",
        ast: {
            schemaVersion: "1",
            documentType: "letter",
            locale: "pl-PL",
            styleProfile: "lex-classic-clean-v1",
            blocks: [{
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "Klient: "
                        },
                        {
                            type: "pii_ref",
                            alias: "[LMPII:D01:PERSON:0001]"
                        }
                    ]
                }]
        },
        sourceDocumentIds: [
            documentId
        ],
        caseDataKey,
        keyVersion: caseView.keyVersion,
        validationContext
    }));
    const manager = new DeanonymizationReauthorizationManager(auth, cases, store, generationState, {
        clock,
        grantTtlMs: 90 * 1000
    });
    const intent = await manager.createIntent(actor, legalCase.caseId, tokenized.artifact
        .artifactId);
    let wrongPasswordBlocked = false;
    try {
        await manager
            .authorizeIntent(actor, intent.intentId, "bledne haslo");
    }
    catch {
        wrongPasswordBlocked =
            true;
    }
    const authorized = await manager
        .authorizeIntent(actor, intent.intentId, password);
    const strongActor = {
        user: owner.user,
        session: authorized.session
    };
    const target = await manager.consumeGrant(strongActor, authorized.grant.grantId);
    const final = await cases.withCaseDataKey(strongActor, legalCase.caseId, "REIDENTIFY", async (caseDataKey) => await authoring
        .deanonymizeConsumed({
        target,
        createdByUserId: owner.user.userId,
        caseDataKey,
        keyVersion: caseView.keyVersion
    }));
    let secondGrantUseBlocked = false;
    try {
        await manager.consumeGrant(strongActor, authorized.grant.grantId);
    }
    catch {
        secondGrantUseBlocked =
            true;
    }
    const tickets = new SensitiveDownloadTicketManager(auth);
    const ticket = tickets.issue(strongActor, {
        caseId: legalCase.caseId,
        artifactId: final.artifact
            .artifactId,
        finalSha256: final.sha256
    });
    const consumedTicket = tickets.consume(strongActor, ticket.ticketId);
    let secondTicketUseBlocked = false;
    try {
        tickets.consume(strongActor, ticket.ticketId);
    }
    catch {
        secondTicketUseBlocked =
            true;
    }
    const storedFinal = await cases.withCaseDataKey(strongActor, legalCase.caseId, "REIDENTIFY", async (caseDataKey) => await artifacts
        .readArtifact({
        caseId: legalCase.caseId,
        artifactId: final.artifact
            .artifactId,
        caseDataKey,
        keyVersion: caseView.keyVersion,
        maxBytes: 64 * 1024 *
            1024
    }));
    const storedHash = createHash("sha256")
        .update(storedFinal)
        .digest("hex");
    storedFinal.fill(0);
    const finalizedState = await generationState
        .resolve(legalCase.caseId, tokenized.artifact
        .artifactId);
    const pass = wrongPasswordBlocked &&
        secondGrantUseBlocked &&
        secondTicketUseBlocked &&
        consumedTicket
            .remainingUses === 0 &&
        final.artifact
            .sensitivity ===
            "CLEAR_PII" &&
        final.text.includes("Jan Kowalski") &&
        !final.text.includes("LMPII") &&
        final.sha256 ===
            storedHash &&
        finalizedState === null;
    process.stdout.write(JSON.stringify({
        gate: "G34F_FULL_DEANONYMIZATION_EXPORT",
        result: pass
            ? "PASS"
            : "BLOCKED",
        passwordStepUp: wrongPasswordBlocked,
        oneUseGrant: secondGrantUseBlocked,
        localDeanonymization: final.text.includes("Jan Kowalski"),
        zeroResidualTokens: !final.text.includes("LMPII"),
        g10CommittedHash: final.sha256 ===
            storedHash,
        oneUseDownloadTicket: secondTicketUseBlocked,
        tokenizedStateClosed: finalizedState ===
            null
    }, null, 2) + "\n");
    if (!pass) {
        process.exitCode = 1;
    }
}
finally {
    auth?.close();
    fs.rmSync(root, {
        recursive: true,
        force: true
    });
}

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  LocalAuthStore
} from "./auth/store.js";
import {
  LocalAuthService
} from "./auth/service.js";
import {
  AuthSessionManager
} from "./auth/session-manager.js";
import {
  LocalCaseFileStore
} from "./case-file-store.js";
import {
  LocalCaseAccessService
} from "./case-access.js";
import {
  SecureCaseUploadStore
} from "./case-secure-store.js";
import {
  SecureCaseDocumentStore
} from "./case-document-store.js";
import {
  SecureCaseArtifactStore
} from "./case-artifact-store.js";
import {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";
import {
  CaseSecurityRotationCoordinator
} from "./case-security-rotation.js";

const root =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g34h4-validate-"
    )
  );

function allBytes(
  directory: string
): Buffer {
  const parts:
    Buffer[] = [];
  const walk = (
    current: string
  ): void => {
    for (
      const entry
      of fs.readdirSync(
        current,
        {
          withFileTypes: true
        }
      )
    ) {
      parts.push(
        Buffer.from(
          entry.name,
          "utf8"
        )
      );
      const target =
        path.join(
          current,
          entry.name
        );
      if (
        entry.isDirectory()
      ) {
        walk(target);
      } else {
        parts.push(
          fs.readFileSync(
            target
          )
        );
      }
    }
  };
  if (
    fs.existsSync(
      directory
    )
  ) {
    walk(directory);
  }
  return Buffer.concat(parts);
}

try {
  const authStore =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      authStore,
      {
        sessionManager:
          new AuthSessionManager({
            scheduleExpiryTimers:
              false
          }),
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  const files =
    new LocalCaseFileStore({
      rootDir: root
    });
  const vault =
    new EncryptedPrivacyVaultStore({
      rootDir: root
    });
  const uploads =
    new SecureCaseUploadStore({
      rootDir: root
    });
  const documents =
    new SecureCaseDocumentStore({
      rootDir: root
    });
  const artifacts =
    new SecureCaseArtifactStore({
      rootDir: root
    });
  const rotation =
    new CaseSecurityRotationCoordinator(
      vault,
      uploads,
      documents,
      artifacts
    );
  const cases =
    new LocalCaseAccessService(
      authStore,
      auth,
      files,
      rotation
    );

  const owner =
    await auth.bootstrap({
      loginName:
        "g34h4-owner",
      displayName:
        "G34H4 Owner",
      password:
        "G34H4 walidacyjne bezpieczne haslo 2026"
    });
  const actor = {
    user: owner.user,
    session: owner.session
  };
  const legalCase =
    await cases.createCase(
      actor,
      "G34H4"
    );

  const clear =
    Buffer.from(
      "Jan Kowalski PESEL 44051401458 — finalny artefakt"
    );
  const filename =
    "Pozew Jan Kowalski.docx";
  let artifactId = "";

  await cases.withCaseDataKey(
    actor,
    legalCase.caseId,
    "WRITE",
    async (caseDataKey) => {
      const stored =
        await artifacts
          .saveArtifact({
            caseId:
              legalCase.caseId,
            filename,
            mediaType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            data: clear,
            caseDataKey,
            keyVersion: 1,
            sensitivity:
              "CLEAR_PII",
            createdByUserId:
              owner.user.userId
          });
      artifactId =
        stored.artifactId;
    }
  );

  const artifactRoot =
    path.join(
      root,
      "cases",
      legalCase.caseId,
      "secure",
      "artifacts"
    );
  const disk =
    allBytes(
      artifactRoot
    );
  const noPlaintext =
    !disk.includes(
      Buffer.from(
        filename,
        "utf8"
      )
    ) &&
    !disk.includes(
      Buffer.from(
        "Jan Kowalski",
        "utf8"
      )
    ) &&
    !disk.includes(
      Buffer.from(
        "44051401458",
        "utf8"
      )
    );

  let roundTrip = false;
  await cases.withCaseDataKey(
    actor,
    legalCase.caseId,
    "READ",
    async (caseDataKey) => {
      const restored =
        await artifacts
          .readArtifact({
            caseId:
              legalCase.caseId,
            artifactId,
            caseDataKey,
            keyVersion: 1,
            maxBytes: 1024
          });
      roundTrip =
        restored.equals(
          clear
        );
      restored.fill(0);
    }
  );

  const rotated =
    await cases.rotateCaseKey(
      actor,
      legalCase.caseId
    );

  let rotatedRoundTrip =
    false;
  await cases.withCaseDataKey(
    actor,
    legalCase.caseId,
    "READ",
    async (caseDataKey) => {
      const restored =
        await artifacts
          .readArtifact({
            caseId:
              legalCase.caseId,
            artifactId,
            caseDataKey,
            keyVersion:
              rotated.keyVersion,
            maxBytes: 1024
          });
      rotatedRoundTrip =
        restored.equals(
          clear
        );
      restored.fill(0);
    }
  );

  const pass =
    noPlaintext &&
    roundTrip &&
    rotated.keyVersion === 2 &&
    rotatedRoundTrip;

  process.stdout.write(
    JSON.stringify({
      gate:
        "G34H4_ENCRYPTED_ARTIFACT_STORE",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      artifactId,
      clearArtifactOrFilenamePersisted:
        !noPlaintext,
      encryptedRoundTrip:
        roundTrip,
      caseKeyRotationCompatible:
        rotatedRoundTrip,
      fullG34HClaimed:
        false,
      remaining: [
        "G34H5_LEGACY_MIGRATION"
      ],
      generationIntegration:
        "PENDING_G31D_G31E"
    }, null, 2) +
      "\n"
  );

  clear.fill(0);
  auth.close();

  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  fs.rmSync(
    root,
    {
      recursive: true,
      force: true
    }
  );
}

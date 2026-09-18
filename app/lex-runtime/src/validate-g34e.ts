import {
  createHash
} from "node:crypto";
import {
  mkdtemp,
  readFile,
  rm
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LocalAuthStore } from "./auth/store.js";
import { LocalAuthService } from "./auth/service.js";
import { AuthSessionManager } from "./auth/session-manager.js";
import { LocalCaseFileStore } from "./case-file-store.js";
import { LocalCaseAccessService } from "./case-access.js";

const root = await mkdtemp(
  path.join(
    os.tmpdir(),
    "lex-g34e-validate-"
  )
);

const digest = (
  value: Buffer
): string =>
  createHash("sha256")
    .update(value)
    .digest("hex");

try {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      store,
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
  const cases =
    new LocalCaseAccessService(
      store,
      auth,
      files
    );

  const firstPassword =
    "G34E pierwsze bezpieczne haslo 2026";
  const secondPassword =
    "G34E drugie bezpieczne haslo 2026";
  const thirdPassword =
    "G34E trzecie bezpieczne haslo 2026";

  const first =
    await auth.bootstrap({
      loginName: "owner",
      displayName: "Owner",
      password: firstPassword
    });
  const firstContext = {
    user: first.user,
    session: first.session
  };
  const legalCase =
    await cases.createCase(
      firstContext,
      "G34E"
    );
  const before =
    await cases.withCaseDataKey(
      firstContext,
      legalCase.caseId,
      "READ",
      digest
    );

  const recovery =
    await auth.createRecoveryCode(
      firstContext,
      {
        password:
          firstPassword
      }
    );

  const changed =
    await auth.changePassword(
      firstContext,
      {
        currentPassword:
          firstPassword,
        newPassword:
          secondPassword
      }
    );
  const afterPassword =
    await cases.withCaseDataKey(
      {
        user: changed.user,
        session:
          changed.session
      },
      legalCase.caseId,
      "READ",
      digest
    );

  let oldSessionRevoked =
    false;
  try {
    auth.authenticateAuthorization(
      `Bearer ${first.sessionToken}`
    );
  } catch {
    oldSessionRevoked = true;
  }

  const recovered =
    await auth.recoverAccount({
      loginName: "owner",
      recoveryCode:
        recovery.recoveryCode,
      newPassword:
        thirdPassword
    });
  const afterRecovery =
    await cases.withCaseDataKey(
      {
        user:
          recovered.user,
        session:
          recovered.session
      },
      legalCase.caseId,
      "READ",
      digest
    );

  let oldRecoveryBlocked =
    false;
  try {
    await auth.recoverAccount({
      loginName: "owner",
      recoveryCode:
        recovery.recoveryCode,
      newPassword:
        "G34E czwarte bezpieczne haslo 2026"
    });
  } catch {
    oldRecoveryBlocked =
      true;
  }

  const db =
    await readFile(
      path.join(
        root,
        "auth",
        "auth.sqlite"
      )
    );
  const secretNotPersisted =
    !db.includes(
      Buffer.from(
        recovery.recoveryCode
      )
    ) &&
    !db.includes(
      Buffer.from(
        recovered.recoveryCode
      )
    ) &&
    !db.includes(
      Buffer.from(
        thirdPassword
      )
    );

  const pass =
    before === afterPassword &&
    before === afterRecovery &&
    oldSessionRevoked &&
    oldRecoveryBlocked &&
    recovery.recoveryCode !==
      recovered.recoveryCode &&
    secretNotPersisted;

  process.stdout.write(
    JSON.stringify({
      gate:
        "G34E_RECOVERY_PASSWORD_LIFECYCLE",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      sameCaseDataKeyAfterPasswordChange:
        before === afterPassword,
      sameCaseDataKeyAfterRecovery:
        before === afterRecovery,
      oldSessionRevoked,
      oldRecoveryBlocked,
      recoveryRotated:
        recovery.recoveryCode !==
        recovered.recoveryCode,
      plaintextRecoveryOrPasswordPersisted:
        !secretNotPersisted
    }, null, 2) + "\n"
  );

  auth.close();
  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  await rm(
    root,
    {
      recursive: true,
      force: true
    }
  );
}

import {
  createHash
} from "node:crypto";
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

const root = fs.mkdtempSync(
  path.join(
    os.tmpdir(),
    "lex-g34d-"
  )
);

function digest(
  value: Buffer
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

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

  const owner =
    await auth.bootstrap({
      loginName: "owner",
      displayName: "Owner",
      password:
        "G34D owner bezpieczne haslo 2026"
    });
  const ownerContext = {
    user: owner.user,
    session: owner.session
  };
  const target =
    await auth.createUser(
      ownerContext,
      {
        loginName: "editor",
        displayName: "Editor",
        password:
          "G34D editor bezpieczne haslo 2026"
      }
    );

  const localCase =
    await cases.createCase(
      ownerContext,
      "G34D fixture"
    );

  const ownerDigest =
    await cases.withCaseDataKey(
      ownerContext,
      localCase.caseId,
      "MANAGE",
      digest
    );

  await cases.grantAccess(
    ownerContext,
    localCase.caseId,
    {
      userId: target.userId,
      role: "EDITOR",
      canReidentify: true
    }
  );

  const targetLogin =
    await auth.login({
      loginName: "editor",
      password:
        "G34D editor bezpieczne haslo 2026"
    });
  const targetContext = {
    user: targetLogin.user,
    session:
      targetLogin.session
  };
  const targetDigest =
    await cases.withCaseDataKey(
      targetContext,
      localCase.caseId,
      "READ",
      digest
    );

  if (
    targetDigest !==
      ownerDigest
  ) {
    throw new Error(
      "G34D_OFFLINE_ENVELOPE_MISMATCH"
    );
  }

  const access =
    store.getCaseAccess(
      localCase.caseId,
      target.userId
    );
  if (
    !access ||
    access.envelope.algorithm !==
      "X25519-HKDF-SHA256-AES-256-GCM" ||
    !access.envelope
      .ephemeralPublicKeyDer ||
    access.envelope.ciphertext
      .length !== 32
  ) {
    throw new Error(
      "G34D_OFFLINE_ENVELOPE_INVALID"
    );
  }

  const revoked =
    await cases.revokeAccess(
      ownerContext,
      localCase.caseId,
      target.userId
    );
  if (
    revoked.keyVersion !== 2
  ) {
    throw new Error(
      "G34D_ROTATION_VERSION_FAILED"
    );
  }

  const rotatedDigest =
    await cases.withCaseDataKey(
      ownerContext,
      localCase.caseId,
      "MANAGE",
      digest
    );
  if (
    rotatedDigest ===
      ownerDigest
  ) {
    throw new Error(
      "G34D_CDK_NOT_ROTATED"
    );
  }

  let revokedDenied = false;
  try {
    await cases.withCaseDataKey(
      targetContext,
      localCase.caseId,
      "READ",
      digest
    );
  } catch {
    revokedDenied = true;
  }
  if (!revokedDenied) {
    throw new Error(
      "G34D_REVOKED_USER_RETAINED_ACCESS"
    );
  }

  auth.close();

  process.stdout.write(
    "G34D_CASE_KEY_ENVELOPES: PASS\n"
  );
} finally {
  fs.rmSync(
    root,
    {
      recursive: true,
      force: true
    }
  );
}

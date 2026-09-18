import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  LocalAuthService
} from "./auth/service.js";
import {
  LocalAuthStore
} from "./auth/store.js";
import {
  AuthSessionManager
} from "./auth/session-manager.js";

const root = fs.mkdtempSync(
  path.join(
    os.tmpdir(),
    "lex-g34a-"
  )
);
const password =
  "Walidacyjne bardzo dlugie haslo 2026";

try {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const service =
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

  const before =
    service.status();
  if (
    before.initialized ||
    !before.requiresBootstrap
  ) {
    throw new Error(
      "G34A_PRECONDITION_FAILED"
    );
  }

  const created =
    await service.bootstrap({
      loginName: "validator",
      displayName:
        "Validator",
      password
    });
  if (
    created.user.appRole !==
      "ADMIN"
  ) {
    throw new Error(
      "G34A_FIRST_USER_NOT_ADMIN"
    );
  }
  service.close();

  const dbBytes =
    fs.readFileSync(
      path.join(
        root,
        "auth",
        "auth.sqlite"
      )
    );
  if (
    dbBytes.includes(
      Buffer.from(password)
    )
  ) {
    throw new Error(
      "G34A_PASSWORD_PERSISTED"
    );
  }

  const reopenedStore =
    new LocalAuthStore({
      rootDir: root
    });
  const reopened =
    new LocalAuthService(
      reopenedStore,
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
  const logged =
    await reopened.login({
      loginName: "validator",
      password
    });
  if (
    logged.user.userId !==
      created.user.userId
  ) {
    throw new Error(
      "G34A_UMK_RESTART_FAILED"
    );
  }
  reopened.close();

  process.stdout.write(
    "G34A_LOCAL_ACCOUNT_BOOTSTRAP: PASS\n"
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

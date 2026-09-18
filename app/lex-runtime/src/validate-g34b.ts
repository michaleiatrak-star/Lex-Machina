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
import type {
  AuthClock
} from "./auth/types.js";

let now = 1_000_000;
const clock: AuthClock = {
  now: () => now
};
const root = fs.mkdtempSync(
  path.join(
    os.tmpdir(),
    "lex-g34b-"
  )
);

try {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const sessions =
    new AuthSessionManager({
      clock,
      scheduleExpiryTimers:
        false,
      policy: {
        idleTimeoutMs: 1_000,
        overallTimeoutMs: 5_000
      }
    });
  const service =
    new LocalAuthService(
      store,
      {
        clock,
        sessionManager:
          sessions,
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  const password =
    "Walidacyjne haslo sesji G34B 2026";
  const created =
    await service.bootstrap({
      loginName: "g34b",
      displayName: "G34B",
      password
    });

  for (
    let attempt = 1;
    attempt <= 5;
    attempt += 1
  ) {
    try {
      await service.login({
        loginName: "g34b",
        password:
          "Bledne walidacyjne haslo 2026"
      });
      throw new Error(
        "G34B_BAD_PASSWORD_ACCEPTED"
      );
    } catch (error) {
      const code =
        error instanceof Error
          ? error.message
          : "";
      if (
        attempt < 5 &&
        code !==
          "INVALID_CREDENTIALS"
      ) {
        throw error;
      }
      if (
        attempt === 5 &&
        code !==
          "AUTH_BACKOFF_ACTIVE"
      ) {
        throw error;
      }
    }
  }

  now += 31_000;
  const logged =
    await service.login({
      loginName: "g34b",
      password
    });

  now += 1_001;
  try {
    service.authenticateAuthorization(
      `Bearer ${logged.sessionToken}`
    );
    throw new Error(
      "G34B_IDLE_EXPIRY_FAILED"
    );
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !==
        "SESSION_IDLE_EXPIRED"
    ) {
      throw error;
    }
  }

  service.logoutAuthorization(
    `Bearer ${created.sessionToken}`
  );
  service.close();

  process.stdout.write(
    "G34B_LOGIN_SESSION: PASS\n"
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

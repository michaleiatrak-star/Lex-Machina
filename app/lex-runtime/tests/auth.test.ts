import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  LocalAuthService,
  AuthError
} from "../src/auth/service.js";
import {
  LocalAuthStore
} from "../src/auth/store.js";
import {
  AuthSessionManager
} from "../src/auth/session-manager.js";
import type {
  AuthClock
} from "../src/auth/types.js";

const roots: string[] = [];

function tempRoot(): string {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-auth-"
    )
  );
  roots.push(root);
  return root;
}

function serviceAt(
  root: string,
  options?: {
    clock?: AuthClock;
    idleTimeoutMs?: number;
    overallTimeoutMs?: number;
  }
): {
  store: LocalAuthStore;
  service: LocalAuthService;
} {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const sessionManager =
    new AuthSessionManager({
      ...(options?.clock
        ? { clock: options.clock }
        : {}),
      scheduleExpiryTimers: false,
      policy: {
        idleTimeoutMs:
          options?.idleTimeoutMs ??
          60_000,
        overallTimeoutMs:
          options?.overallTimeoutMs ??
          600_000
      }
    });
  const service =
    new LocalAuthService(
      store,
      {
        ...(options?.clock
          ? { clock: options.clock }
          : {}),
        sessionManager,
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  return { store, service };
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(
      roots.pop()!,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe("local auth service", () => {
  it("bootstraps exactly one ADMIN and never persists the password", async () => {
    const root = tempRoot();
    const { service } =
      serviceAt(root);
    expect(
      service.status()
    ).toEqual({
      initialized: false,
      requiresBootstrap: true,
      temporaryAdminCredentialsActive: false
    });

    const password =
      "Bardzo dlugie haslo testowe 2026";
    const created =
      await service.bootstrap({
        loginName: "mecenas",
        displayName:
          "Mecenas Testowy",
        password
      });

    expect(
      created.user.appRole
    ).toBe("ADMIN");
    expect(
      created.sessionToken
    ).toMatch(
      /^[A-Za-z0-9_-]{40,}$/
    );
    expect(
      service.status()
    ).toEqual({
      initialized: true,
      requiresBootstrap: false,
      temporaryAdminCredentialsActive: false
    });

    await expect(
      service.bootstrap({
        loginName: "drugi",
        displayName: "Drugi",
        password:
          "Inne wystarczajaco dlugie haslo 2026"
      })
    ).rejects.toMatchObject({
      code:
        "BOOTSTRAP_ALREADY_COMPLETED"
    });

    service.close();

    const db = fs.readFileSync(
      path.join(
        root,
        "auth",
        "auth.sqlite"
      )
    );
    expect(
      db.includes(
        Buffer.from(password)
      )
    ).toBe(false);
  });

  it("persists the encrypted UMK across restart but not the session", async () => {
    const root = tempRoot();
    const first =
      serviceAt(root);
    const password =
      "Restart zachowuje klucz uzytkownika 2026";
    const created =
      await first.service.bootstrap({
        loginName: "anna",
        displayName: "Anna",
        password
      });

    first.service.close();

    const second =
      serviceAt(root);
    expect(() =>
      second.service
        .authenticateAuthorization(
          `Bearer ${created.sessionToken}`
        )
    ).toThrow(
      "AUTHENTICATION_REQUIRED"
    );

    const logged =
      await second.service.login({
        loginName: "ANNA",
        password
      });
    expect(
      logged.user.userId
    ).toBe(
      created.user.userId
    );
    second.service.close();
  });

  it("applies persistent escalating backoff after failed passwords", async () => {
    let now =
      Date.parse(
        "2026-09-16T08:00:00.000Z"
      );
    const clock: AuthClock = {
      now: () => now
    };
    const root = tempRoot();
    const current =
      serviceAt(
        root,
        { clock }
      );
    await current.service.bootstrap({
      loginName: "jan",
      displayName: "Jan",
      password:
        "Poprawne bardzo dlugie haslo Jana 2026"
    });

    for (
      let attempt = 1;
      attempt <= 4;
      attempt += 1
    ) {
      await expect(
        current.service.login({
          loginName: "jan",
          password:
            "Bledne bardzo dlugie haslo 2026"
        })
      ).rejects.toMatchObject({
        code:
          "INVALID_CREDENTIALS"
      });
    }

    const fifth =
      current.service.login({
        loginName: "jan",
        password:
          "Bledne bardzo dlugie haslo 2026"
      });
    await expect(
      fifth
    ).rejects.toMatchObject({
      code:
        "AUTH_BACKOFF_ACTIVE"
    });

    current.service.close();

    const reopened =
      serviceAt(
        root,
        { clock }
      );
    await expect(
      reopened.service.login({
        loginName: "jan",
        password:
          "Poprawne bardzo dlugie haslo Jana 2026"
      })
    ).rejects.toMatchObject({
      code:
        "AUTH_BACKOFF_ACTIVE"
    });

    now += 31_000;
    await expect(
      reopened.service.login({
        loginName: "jan",
        password:
          "Poprawne bardzo dlugie haslo Jana 2026"
      })
    ).resolves.toMatchObject({
      user: {
        loginName: "jan"
      }
    });
    reopened.service.close();
  });

  it("enforces idle and overall timeout in the trusted session manager", async () => {
    let now = 1_000_000;
    const clock: AuthClock = {
      now: () => now
    };
    const root = tempRoot();
    const current =
      serviceAt(
        root,
        {
          clock,
          idleTimeoutMs: 1_000,
          overallTimeoutMs: 5_000
        }
      );
    const created =
      await current.service.bootstrap({
        loginName: "ola",
        displayName: "Ola",
        password:
          "Ola ma wystarczajaco dlugie haslo 2026"
      });

    now += 1_001;
    expect(() =>
      current.service
        .authenticateAuthorization(
          `Bearer ${created.sessionToken}`
        )
    ).toThrow(
      "SESSION_IDLE_EXPIRED"
    );

    const logged =
      await current.service.login({
        loginName: "ola",
        password:
          "Ola ma wystarczajaco dlugie haslo 2026"
      });

    for (
      let index = 0;
      index < 5;
      index += 1
    ) {
      now += 900;
      current.service
        .touchSession(
          logged.session.sessionId
        );
    }
    now += 600;

    expect(() =>
      current.service
        .authenticateAuthorization(
          `Bearer ${logged.sessionToken}`
        )
    ).toThrow(
      "SESSION_OVERALL_EXPIRED"
    );
    current.service.close();
  });

  it("revokes a session when authEpoch changes", async () => {
    const root = tempRoot();
    const { store, service } =
      serviceAt(root);
    const created =
      await service.bootstrap({
        loginName: "ewa",
        displayName: "Ewa",
        password:
          "Ewa ma bezpieczne dlugie haslo 2026"
      });

    store
      .setUserStatusAndIncrementEpoch(
        created.user.userId,
        "ACTIVE",
        new Date().toISOString()
      );

    expect(() =>
      service
        .authenticateAuthorization(
          `Bearer ${created.sessionToken}`
        )
    ).toThrow(
      "SESSION_REVOKED"
    );
    service.close();
  });

  it("uses the same generic credential result for an unknown login", async () => {
    const root = tempRoot();
    const { service } =
      serviceAt(root);
    await service.bootstrap({
      loginName: "owner",
      displayName: "Owner",
      password:
        "Owner ma bardzo dlugie haslo 2026"
    });

    try {
      await service.login({
        loginName:
          "nieistniejacy",
        password:
          "Dowolne bardzo dlugie haslo 2026"
      });
      throw new Error(
        "expected failure"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(
        AuthError
      );
      expect(
        (error as AuthError).code
      ).toBe(
        "INVALID_CREDENTIALS"
      );
    }
    service.close();
  });
});

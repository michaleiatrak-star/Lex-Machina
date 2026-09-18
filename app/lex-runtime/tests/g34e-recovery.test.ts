import {
  createHash
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import { LocalAuthStore } from "../src/auth/store.js";
import { LocalAuthService } from "../src/auth/service.js";
import { AuthSessionManager } from "../src/auth/session-manager.js";
import { LocalCaseFileStore } from "../src/case-file-store.js";
import { LocalCaseAccessService } from "../src/case-access.js";

const roots: string[] = [];

function fixture() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-g34e-")
  );
  roots.push(root);
  const store = new LocalAuthStore({ rootDir: root });
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
  const files = new LocalCaseFileStore({ rootDir: root });
  const cases = new LocalCaseAccessService(store, auth, files);
  return { root, auth, cases };
}

function ctx(value: {
  user: any;
  session: any;
}) {
  return {
    user: value.user,
    session: value.session
  };
}

async function caseDigest(
  cases: LocalCaseAccessService,
  authResult: {
    user: any;
    session: any;
  },
  caseId: string
): Promise<string> {
  return await cases.withCaseDataKey(
    ctx(authResult),
    caseId,
    "READ",
    (key) =>
      createHash("sha256")
        .update(key)
        .digest("hex")
  );
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, {
      recursive: true,
      force: true
    });
  }
});

describe("G34E recovery and password lifecycle", () => {
  it("preserves the same CDK through password change and recovery and rotates recovery code", async () => {
    const current = fixture();
    const firstPassword =
      "Pierwsze bezpieczne haslo wlasciciela 2026";
    const secondPassword =
      "Drugie bezpieczne haslo wlasciciela 2026";
    const thirdPassword =
      "Trzecie bezpieczne haslo wlasciciela 2026";

    const owner = await current.auth.bootstrap({
      loginName: "owner",
      displayName: "Owner",
      password: firstPassword
    });
    const localCase = await current.cases.createCase(
      ctx(owner),
      "G34E case"
    );
    const before = await caseDigest(
      current.cases,
      owner,
      localCase.caseId
    );

    const recovery =
      await current.auth.createRecoveryCode(
        ctx(owner),
        { password: firstPassword }
      );
    expect(recovery.recoveryCode).toMatch(
      /^LMR1_[A-Za-z0-9_-]{43}$/
    );

    const changed =
      await current.auth.changePassword(
        ctx(owner),
        {
          currentPassword: firstPassword,
          newPassword: secondPassword
        }
      );

    expect(() =>
      current.auth.authenticateAuthorization(
        `Bearer ${owner.sessionToken}`
      )
    ).toThrow();

    await expect(
      current.auth.login({
        loginName: "owner",
        password: firstPassword
      })
    ).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS"
    });

    expect(
      await caseDigest(
        current.cases,
        changed,
        localCase.caseId
      )
    ).toBe(before);

    const recovered =
      await current.auth.recoverAccount({
        loginName: "owner",
        recoveryCode: recovery.recoveryCode,
        newPassword: thirdPassword
      });

    expect(recovered.recoveryCode).toMatch(
      /^LMR1_[A-Za-z0-9_-]{43}$/
    );
    expect(recovered.recoveryCode).not.toBe(
      recovery.recoveryCode
    );

    expect(() =>
      current.auth.authenticateAuthorization(
        `Bearer ${changed.sessionToken}`
      )
    ).toThrow();

    await expect(
      current.auth.recoverAccount({
        loginName: "owner",
        recoveryCode: recovery.recoveryCode,
        newPassword:
          "Czwarte bezpieczne haslo wlasciciela 2026"
      })
    ).rejects.toMatchObject({
      code:
        "INVALID_RECOVERY_CREDENTIALS"
    });

    await expect(
      current.auth.login({
        loginName: "owner",
        password: secondPassword
      })
    ).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS"
    });

    expect(
      await caseDigest(
        current.cases,
        recovered,
        localCase.caseId
      )
    ).toBe(before);

    const db = fs.readFileSync(
      path.join(
        current.root,
        "auth",
        "auth.sqlite"
      )
    );
    for (const secret of [
      recovery.recoveryCode,
      recovered.recoveryCode,
      thirdPassword
    ]) {
      expect(
        db.includes(
          Buffer.from(secret)
        )
      ).toBe(false);
    }

    current.auth.close();
  });
});

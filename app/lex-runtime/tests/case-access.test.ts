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
import {
  LocalAuthStore
} from "../src/auth/store.js";
import {
  LocalAuthService
} from "../src/auth/service.js";
import {
  AuthSessionManager
} from "../src/auth/session-manager.js";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  CaseAccessError,
  LocalCaseAccessService
} from "../src/case-access.js";

const roots: string[] = [];

function fixture() {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-case-access-"
    )
  );
  roots.push(root);
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
  return {
    root,
    store,
    auth,
    files,
    cases
  };
}

function context(
  auth: Awaited<
    ReturnType<
      LocalAuthService["login"]
    >
  >
) {
  return {
    user: auth.user,
    session: auth.session
  };
}

function keyDigest(
  value: Buffer
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
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

describe("G34C/G34D case access", () => {
  it("creates owner ACL and unwraps the same CDK for an offline-granted user", async () => {
    const current = fixture();
    const owner =
      await current.auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password:
          "Owner haslo testowe bezpieczne 2026"
      });
    const ownerContext =
      context(owner);

    const colleague =
      await current.auth.createUser(
        ownerContext,
        {
          loginName: "anna",
          displayName: "Anna",
          password:
            "Anna haslo testowe bezpieczne 2026"
        }
      );

    const localCase =
      await current.cases.createCase(
        ownerContext,
        "Sprawa A"
      );

    expect(localCase).toMatchObject({
      role: "OWNER",
      canReidentify: true,
      keyVersion: 1
    });

    const ownerDigest =
      await current.cases
        .withCaseDataKey(
          ownerContext,
          localCase.caseId,
          "MANAGE",
          keyDigest
        );

    const granted =
      await current.cases.grantAccess(
        ownerContext,
        localCase.caseId,
        {
          userId:
            colleague.userId,
          role: "ANALYST",
          canReidentify: false
        }
      );
    expect(granted).toMatchObject({
      role: "ANALYST",
      canReidentify: false,
      keyVersion: 1
    });

    const colleagueLogin =
      await current.auth.login({
        loginName: "anna",
        password:
          "Anna haslo testowe bezpieczne 2026"
      });
    const colleagueContext =
      context(colleagueLogin);

    const colleagueDigest =
      await current.cases
        .withCaseDataKey(
          colleagueContext,
          localCase.caseId,
          "ANALYZE",
          keyDigest
        );
    expect(
      colleagueDigest
    ).toBe(ownerDigest);

    expect(() =>
      current.cases.assertAccess(
        colleagueContext,
        localCase.caseId,
        "WRITE"
      )
    ).toThrow(
      "CASE_ACCESS_DENIED"
    );
    expect(() =>
      current.cases.assertAccess(
        colleagueContext,
        localCase.caseId,
        "REIDENTIFY"
      )
    ).toThrow(
      "CASE_ACCESS_DENIED"
    );

    current.auth.close();
  });

  it("revokes access with mandatory CDK rotation", async () => {
    const current = fixture();
    const owner =
      await current.auth.bootstrap({
        loginName: "owner2",
        displayName: "Owner 2",
        password:
          "Owner dwa haslo bezpieczne 2026"
      });
    const ownerContext =
      context(owner);
    const colleague =
      await current.auth.createUser(
        ownerContext,
        {
          loginName: "ewa",
          displayName: "Ewa",
          password:
            "Ewa haslo testowe bezpieczne 2026"
        }
      );

    const localCase =
      await current.cases.createCase(
        ownerContext
      );
    await current.cases.grantAccess(
      ownerContext,
      localCase.caseId,
      {
        userId:
          colleague.userId,
        role: "EDITOR",
        canReidentify: true
      }
    );

    const colleagueLogin =
      await current.auth.login({
        loginName: "ewa",
        password:
          "Ewa haslo testowe bezpieczne 2026"
      });
    const colleagueContext =
      context(colleagueLogin);

    const before =
      await current.cases
        .withCaseDataKey(
          ownerContext,
          localCase.caseId,
          "MANAGE",
          keyDigest
        );

    const revoked =
      await current.cases.revokeAccess(
        ownerContext,
        localCase.caseId,
        colleague.userId
      );
    expect(
      revoked.keyVersion
    ).toBe(2);
    expect(
      current.store.getCaseAccess(
        localCase.caseId,
        colleague.userId
      )
    ).toBeNull();

    const after =
      await current.cases
        .withCaseDataKey(
          ownerContext,
          localCase.caseId,
          "MANAGE",
          keyDigest
        );
    expect(after).not.toBe(before);

    await expect(
      current.cases.withCaseDataKey(
        colleagueContext,
        localCase.caseId,
        "READ",
        keyDigest
      )
    ).rejects.toMatchObject({
      code:
        "CASE_ACCESS_DENIED"
    });

    current.auth.close();
  });

  it("keeps legacy G31A cases unassigned until explicit ADMIN import", async () => {
    const current = fixture();

    const legacy =
      await current.files.createCase(
        "Legacy"
      );

    const owner =
      await current.auth.bootstrap({
        loginName:
          "administrator",
        displayName:
          "Administrator",
        password:
          "Administrator haslo bezpieczne 2026"
      });
    const ownerContext =
      context(owner);

    expect(
      current.cases.listCases(
        ownerContext
      )
    ).toEqual([]);

    const legacyList =
      await current.cases
        .listLegacyCases(
          ownerContext
        );
    expect(
      legacyList.map(
        (item) => item.caseId
      )
    ).toContain(
      legacy.caseId
    );

    const imported =
      await current.cases
        .importLegacyCase(
          ownerContext,
          legacy.caseId
        );
    expect(imported).toMatchObject({
      caseId: legacy.caseId,
      role: "OWNER",
      keyVersion: 1
    });

    const metadata =
      await current.files
        .readCaseMetadata(
          legacy.caseId
        );
    expect(
      metadata.createdByUserId
    ).toBe(owner.user.userId);
    expect(
      metadata.keyVersion
    ).toBe(1);

    await expect(
      current.cases
        .importLegacyCase(
          ownerContext,
          legacy.caseId
        )
    ).rejects.toBeInstanceOf(
      CaseAccessError
    );

    current.auth.close();
  });
});

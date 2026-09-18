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
  LocalCaseAccessService
} from "../src/case-access.js";
import {
  PseudonymizationVault
} from "../src/privacy/pseudonymizer.js";
import {
  EncryptedPrivacyVaultStore
} from "../src/privacy/vault-store.js";

const roots: string[] = [];
const DOC_ID =
  "doc_0123456789abcdef01234567";

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g31c1-rotate-"
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
  const vaultStore =
    new EncryptedPrivacyVaultStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      store,
      auth,
      files,
      vaultStore
    );
  return {
    auth,
    store,
    cases,
    vaultStore
  };
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

describe("G31C1 vault case-key rotation", () => {
  it("rekeys the encrypted vault when case access revocation rotates the CDK", async () => {
    const current =
      fixture();
    const owner =
      await current.auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password:
          "G31C1 owner bezpieczne haslo 2026"
      });
    const ownerContext = {
      user: owner.user,
      session: owner.session
    };
    const target =
      await current.auth.createUser(
        ownerContext,
        {
          loginName: "editor",
          displayName: "Editor",
          password:
            "G31C1 editor bezpieczne haslo 2026"
        }
      );

    const localCase =
      await current.cases
        .createCase(
          ownerContext,
          "Vault rotation"
        );
    await current.cases
      .grantAccess(
        ownerContext,
        localCase.caseId,
        {
          userId:
            target.userId,
          role: "EDITOR",
          canReidentify: true
        }
      );

    const vault =
      new PseudonymizationVault();
    const token =
      vault.getOrCreate(
        "PERSON",
        "Maria Wiśniewska"
      );

    await current.cases
      .withCaseDataKey(
        ownerContext,
        localCase.caseId,
        "WRITE",
        async (caseDataKey) => {
          await current.vaultStore
            .saveDocumentVault({
              caseId:
                localCase.caseId,
              documentId:
                DOC_ID,
              vault,
              caseDataKey,
              keyVersion: 1
            });
        }
      );

    const result =
      await current.cases
        .revokeAccess(
          ownerContext,
          localCase.caseId,
          target.userId
        );
    expect(
      result.keyVersion
    ).toBe(2);

    const restored =
      await current.cases
        .withCaseDataKey(
          ownerContext,
          localCase.caseId,
          "READ",
          async (caseDataKey) =>
            await current
              .vaultStore
              .loadDocumentVault({
                caseId:
                  localCase.caseId,
                documentId:
                  DOC_ID,
                caseDataKey,
                keyVersion: 2
              })
        );

    expect(
      restored.resolveToken(
        token
      )
    ).toBe(
      "Maria Wiśniewska"
    );
    expect(
      current.store
        .getCaseAccess(
          localCase.caseId,
          target.userId
        )
    ).toBeNull();

    current.auth.close();
  });
});

import {
  randomBytes
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
  PseudonymizationVault
} from "../src/privacy/pseudonymizer.js";
import {
  EncryptedPrivacyVaultStore,
  privacyVaultDeanonymizationKeyBinding
} from "../src/privacy/vault-store.js";

const roots: string[] = [];

function root(): string {
  const value =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-vault-"
      )
    );
  roots.push(value);
  return value;
}

const CASE_ID =
  "case_0123456789abcdef0123456789abcdef";
const DOC_ID =
  "doc_0123456789abcdef01234567";

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

describe("encrypted privacy vault store", () => {
  it("derives a stable non-secret deanonymization binding from the same privacy key context", () => {
    const key =
      Buffer.alloc(
        32,
        7
      );
    const same =
      privacyVaultDeanonymizationKeyBinding({
        caseId:
          CASE_ID,
        caseDataKey:
          key,
        keyVersion: 1
      });
    const repeated =
      privacyVaultDeanonymizationKeyBinding({
        caseId:
          CASE_ID,
        caseDataKey:
          key,
        keyVersion: 1
      });
    const nextVersion =
      privacyVaultDeanonymizationKeyBinding({
        caseId:
          CASE_ID,
        caseDataKey:
          key,
        keyVersion: 2
      });
    const otherKey =
      privacyVaultDeanonymizationKeyBinding({
        caseId:
          CASE_ID,
        caseDataKey:
          Buffer.alloc(
            32,
            8
          ),
        keyVersion: 1
      });

    expect(same)
      .toMatch(
        /^[a-f0-9]{64}$/
      );
    expect(repeated)
      .toBe(same);
    expect(nextVersion)
      .not.toBe(same);
    expect(otherKey)
      .not.toBe(same);

    key.fill(0);
  });

  it("persists reversible mapping encrypted and restores it after restart", async () => {
    const dir = root();
    const key =
      randomBytes(32);
    const first =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const vault =
      new PseudonymizationVault();
    const token =
      vault.getOrCreate(
        "PERSON",
        "Jan Kowalski"
      );
    vault.getOrCreate(
      "EMAIL",
      "jan@example.test"
    );

    await first.saveDocumentVault({
      caseId: CASE_ID,
      documentId: DOC_ID,
      vault,
      caseDataKey: key,
      keyVersion: 1
    });

    const bytes =
      fs.readFileSync(
        path.join(
          dir,
          "cases",
          CASE_ID,
          "private",
          "privacy",
          "vault.lmv"
        )
      );
    expect(
      bytes.includes(
        Buffer.from(
          "Jan Kowalski"
        )
      )
    ).toBe(false);
    expect(
      bytes.includes(
        Buffer.from(
          "jan@example.test"
        )
      )
    ).toBe(false);

    const second =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const restored =
      await second
        .loadDocumentVault({
          caseId: CASE_ID,
          documentId: DOC_ID,
          caseDataKey: key,
          keyVersion: 1
        });

    expect(
      restored.resolveToken(
        token
      )
    ).toBe(
      "Jan Kowalski"
    );
    expect(
      restored.deanonymize(
        `Powód: ${token}`
      )
    ).toBe(
      "Powód: Jan Kowalski"
    );

    key.fill(0);
  });

  it("fails closed for wrong key and modified ciphertext", async () => {
    const dir = root();
    const key =
      randomBytes(32);
    const store =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const vault =
      new PseudonymizationVault();
    vault.getOrCreate(
      "PERSON",
      "Anna Nowak"
    );
    await store.saveDocumentVault({
      caseId: CASE_ID,
      documentId: DOC_ID,
      vault,
      caseDataKey: key,
      keyVersion: 1
    });

    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey:
          randomBytes(32),
        keyVersion: 1
      })
    ).rejects.toThrow();

    const target =
      path.join(
        dir,
        "cases",
        CASE_ID,
        "private",
        "privacy",
        "vault.lmv"
      );
    const bytes =
      fs.readFileSync(target);
    bytes[
      bytes.length - 20
    ]! ^= 0x01;
    fs.writeFileSync(
      target,
      bytes
    );

    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey: key,
        keyVersion: 1
      })
    ).rejects.toThrow();

    key.fill(0);
  });

  it("fails closed for truncated vault, wrong key version and stale metadata generation", async () => {
    const dir = root();
    const key =
      randomBytes(32);
    const store =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const vault =
      new PseudonymizationVault();
    vault.getOrCreate(
      "PERSON",
      "Zofia Kaczmarek"
    );
    await store.saveDocumentVault({
      caseId: CASE_ID,
      documentId: DOC_ID,
      vault,
      caseDataKey: key,
      keyVersion: 1
    });

    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey: key,
        keyVersion: 2
      })
    ).rejects.toThrow(
      "PRIVACY_VAULT_HEADER_INVALID"
    );

    const privacyDir =
      path.join(
        dir,
        "cases",
        CASE_ID,
        "private",
        "privacy"
      );
    const vaultPath =
      path.join(
        privacyDir,
        "vault.lmv"
      );
    const metaPath =
      path.join(
        privacyDir,
        "vault-meta.json"
      );
    const originalVault =
      fs.readFileSync(
        vaultPath
      );
    const originalMeta =
      fs.readFileSync(
        metaPath,
        "utf8"
      );

    fs.writeFileSync(
      vaultPath,
      originalVault.subarray(
        0,
        originalVault.length - 8
      )
    );
    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey: key,
        keyVersion: 1
      })
    ).rejects.toThrow();

    fs.writeFileSync(
      vaultPath,
      originalVault
    );
    const staleMeta =
      JSON.parse(
        originalMeta
      ) as {
        generation: number;
      };
    staleMeta.generation += 1;
    fs.writeFileSync(
      metaPath,
      JSON.stringify(
        staleMeta
      )
    );

    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey: key,
        keyVersion: 1
      })
    ).rejects.toThrow(
      "PRIVACY_VAULT_META_MISMATCH"
    );

    key.fill(0);
  });

  it("binds LMV1 AAD to the exact case id", async () => {
    const dir = root();
    const key =
      randomBytes(32);
    const store =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const vault =
      new PseudonymizationVault();
    vault.getOrCreate(
      "PERSON",
      "Tomasz Lewandowski"
    );
    await store.saveDocumentVault({
      caseId: CASE_ID,
      documentId: DOC_ID,
      vault,
      caseDataKey: key,
      keyVersion: 1
    });

    const otherCase =
      "case_fedcba9876543210fedcba9876543210";
    const sourceDir =
      path.join(
        dir,
        "cases",
        CASE_ID,
        "private",
        "privacy"
      );
    const targetDir =
      path.join(
        dir,
        "cases",
        otherCase,
        "private",
        "privacy"
      );
    fs.mkdirSync(
      targetDir,
      {
        recursive: true
      }
    );
    for (
      const name
      of [
        "vault.lmv",
        "vault-meta.json"
      ]
    ) {
      fs.copyFileSync(
        path.join(
          sourceDir,
          name
        ),
        path.join(
          targetDir,
          name
        )
      );
    }

    await expect(
      store.loadDocumentVault({
        caseId: otherCase,
        documentId: DOC_ID,
        caseDataKey: key,
        keyVersion: 1
      })
    ).rejects.toThrow(
      "PRIVACY_VAULT_AAD_INVALID"
    );

    key.fill(0);
  });

  it("re-encrypts the same mapping under a rotated case key", async () => {
    const dir = root();
    const oldKey =
      randomBytes(32);
    const nextKey =
      randomBytes(32);
    const store =
      new EncryptedPrivacyVaultStore({
        rootDir: dir
      });
    const vault =
      new PseudonymizationVault();
    const token =
      vault.getOrCreate(
        "PERSON",
        "Piotr Zieliński"
      );

    await store.saveDocumentVault({
      caseId: CASE_ID,
      documentId: DOC_ID,
      vault,
      caseDataKey: oldKey,
      keyVersion: 1
    });

    await expect(
      store.rekeyCaseVault({
        caseId: CASE_ID,
        oldCaseDataKey:
          oldKey,
        oldKeyVersion: 1,
        newCaseDataKey:
          nextKey,
        newKeyVersion: 2
      })
    ).resolves.toBe(true);

    await expect(
      store.loadDocumentVault({
        caseId: CASE_ID,
        documentId: DOC_ID,
        caseDataKey: oldKey,
        keyVersion: 1
      })
    ).rejects.toThrow();

    const restored =
      await store
        .loadDocumentVault({
          caseId: CASE_ID,
          documentId: DOC_ID,
          caseDataKey:
            nextKey,
          keyVersion: 2
        });
    expect(
      restored.resolveToken(
        token
      )
    ).toBe(
      "Piotr Zieliński"
    );

    oldKey.fill(0);
    nextKey.fill(0);
  });
});

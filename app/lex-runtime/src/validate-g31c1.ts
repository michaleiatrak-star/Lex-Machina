import {
  randomBytes
} from "node:crypto";
import {
  mkdtemp,
  readFile,
  rm,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  PseudonymizationVault
} from "./privacy/pseudonymizer.js";
import {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";

const root = await mkdtemp(
  path.join(
    os.tmpdir(),
    "lex-g31c1-"
  )
);

const caseId =
  "case_0123456789abcdef0123456789abcdef";
const documentId =
  "doc_0123456789abcdef01234567";
const clearName =
  "Aleksandra Kowalska";
const clearEmail =
  "aleksandra@example.test";

try {
  const oldKey =
    randomBytes(32);
  const nextKey =
    randomBytes(32);
  const store =
    new EncryptedPrivacyVaultStore({
      rootDir: root
    });
  const vault =
    new PseudonymizationVault();
  const nameToken =
    vault.getOrCreate(
      "PERSON",
      clearName
    );
  vault.getOrCreate(
    "EMAIL",
    clearEmail
  );

  await store.saveDocumentVault({
    caseId,
    documentId,
    vault,
    caseDataKey: oldKey,
    keyVersion: 1
  });

  const vaultPath =
    path.join(
      root,
      "cases",
      caseId,
      "private",
      "privacy",
      "vault.lmv"
    );
  const encrypted =
    await readFile(vaultPath);
  const noPlaintext =
    !encrypted.includes(
      Buffer.from(clearName)
    ) &&
    !encrypted.includes(
      Buffer.from(clearEmail)
    );

  const restarted =
    new EncryptedPrivacyVaultStore({
      rootDir: root
    });
  const restored =
    await restarted
      .loadDocumentVault({
        caseId,
        documentId,
        caseDataKey: oldKey,
        keyVersion: 1
      });
  const restartRoundTrip =
    restored.resolveToken(
      nameToken
    ) === clearName;

  let wrongKeyBlocked = false;
  const wrongKey =
    randomBytes(32);
  try {
    await restarted
      .loadDocumentVault({
        caseId,
        documentId,
        caseDataKey:
          wrongKey,
        keyVersion: 1
      });
  } catch {
    wrongKeyBlocked = true;
  } finally {
    wrongKey.fill(0);
  }

  await restarted
    .rekeyCaseVault({
      caseId,
      oldCaseDataKey:
        oldKey,
      oldKeyVersion: 1,
      newCaseDataKey:
        nextKey,
      newKeyVersion: 2
    });
  const afterRekey =
    await restarted
      .loadDocumentVault({
        caseId,
        documentId,
        caseDataKey:
          nextKey,
        keyVersion: 2
      });
  const rekeyRoundTrip =
    afterRekey.resolveToken(
      nameToken
    ) === clearName;

  const validCopy =
    await readFile(vaultPath);
  const corrupt =
    Buffer.from(validCopy);
  corrupt[
    corrupt.length - 20
  ]! ^= 1;
  await writeFile(
    vaultPath,
    corrupt
  );

  let corruptionBlocked =
    false;
  try {
    await restarted
      .loadDocumentVault({
        caseId,
        documentId,
        caseDataKey:
          nextKey,
        keyVersion: 2
      });
  } catch {
    corruptionBlocked = true;
  }

  const pass =
    noPlaintext &&
    restartRoundTrip &&
    wrongKeyBlocked &&
    rekeyRoundTrip &&
    corruptionBlocked;

  process.stdout.write(
    JSON.stringify({
      gate:
        "G31C1_ENCRYPTED_PRIVACY_VAULT",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      plaintextMappingPersisted:
        !noPlaintext,
      restartRoundTrip,
      wrongKeyBlocked,
      corruptionBlocked,
      caseKeyRotationCompatible:
        rekeyRoundTrip,
      providerBoundaryChanged:
        false
    }, null, 2) + "\n"
  );

  oldKey.fill(0);
  nextKey.fill(0);

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

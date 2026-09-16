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
  EncryptedPrivacyVaultStore
} from "../src/privacy/vault-store.js";
import {
  SecureCaseArtifactStore
} from "../src/case-artifact-store.js";
import {
  DocumentGenerationStateStore
} from "../src/document-generation-state.js";
import {
  LocalDocumentAuthoringService
} from "../src/document-authoring-service.js";

const roots:
  string[] = [];

afterEach(() => {
  while (
    roots.length
  ) {
    fs.rmSync(
      roots.pop()!,
      {
        recursive: true,
        force: true
      }
    );
  }
});

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-authoring-"
      )
    );
  roots.push(root);
  const caseId =
    "case_0123456789abcdef0123456789abcdef";
  const userId =
    "user_0123456789abcdef0123456789abcdef";
  const documentId =
    "doc_0123456789abcdef01234567";
  const caseDataKey =
    Buffer.alloc(
      32,
      7
    );
  fs.mkdirSync(
    path.join(
      root,
      "cases",
      caseId
    ),
    {
      recursive: true
    }
  );
  fs.writeFileSync(
    path.join(
      root,
      "cases",
      caseId,
      "case.json"
    ),
    JSON.stringify({
      caseId,
      caseKind:
        "MATTER",
      createdByUserId:
        userId,
      createdAt:
        "2026-09-16T10:00:00.000Z",
      updatedAt:
        "2026-09-16T10:00:00.000Z",
      keyVersion: 1
    })
  );
  const vaultStore =
    new EncryptedPrivacyVaultStore({
      rootDir: root
    });
  const artifacts =
    new SecureCaseArtifactStore({
      rootDir: root
    });
  const states =
    new DocumentGenerationStateStore({
      rootDir: root
    });
  const service =
    new LocalDocumentAuthoringService(
      vaultStore,
      artifacts,
      states
    );
  return {
    root,
    caseId,
    userId,
    documentId,
    caseDataKey,
    vaultStore,
    artifacts,
    states,
    service
  };
}

describe("document authoring lifecycle", () => {
  for (
    const format
    of ["docx", "odt"] as const
  ) {
    it(`persists tokenized ${format}, resolves after restart and creates clear final artifact`, async () => {
      const current =
        fixture();
      const vault =
        new PseudonymizationVault();
      vault.getOrCreate(
        "PERSON",
        "Jan Kowalski"
      );
      const generation =
        await current
          .vaultStore
          .saveDocumentVault({
            caseId:
              current.caseId,
            documentId:
              current.documentId,
            vault,
            caseDataKey:
              current.caseDataKey,
            keyVersion: 1
          });
      expect(generation)
        .toBe(1);

      const aliases =
        await current
          .service
          .aliasManifest({
            caseId:
              current.caseId,
            sourceDocumentIds: [
              current
                .documentId
            ],
            caseDataKey:
              current
                .caseDataKey,
            keyVersion: 1
          });
      expect(
        aliases.entries[0]
          ?.alias
      ).toBe(
        "[LMPII:D01:PERSON:0001]"
      );

      const tokenized =
        await current
          .service
          .createTokenized({
            caseId:
              current.caseId,
            createdByUserId:
              current.userId,
            format,
            sourceDocumentIds: [
              current
                .documentId
            ],
            caseDataKey:
              current
                .caseDataKey,
            keyVersion: 1,
            ast: {
              schemaVersion:
                "1",
              documentType:
                "letter",
              locale: "pl-PL",
              styleProfile:
                "lex-classic-clean-v1",
              blocks: [{
                type:
                  "paragraph",
                content: [
                  {
                    type:
                      "text",
                    text:
                      "Klient: "
                  },
                  {
                    type:
                      "pii_ref",
                    alias:
                      "[LMPII:D01:PERSON:0001]"
                  }
                ]
              }]
            }
          });

      expect(
        tokenized.artifact
          .sensitivity
      ).toBe(
        "PROTECTED"
      );
      expect(
        tokenized.text
      ).toContain(
        "[LMPII:D01:PERSON:0001]"
      );

      const restartedState =
        new DocumentGenerationStateStore({
          rootDir:
            current.root
        });
      const target =
        await restartedState
          .resolve(
            current.caseId,
            tokenized
              .artifact
              .artifactId
          );
      expect(target)
        .toMatchObject({
          state:
            "TOKENIZED_VALIDATED",
          vaultGeneration: 1,
          caseKeyVersion: 1,
          artifactFormat:
            format
        });

      const restartedService =
        new LocalDocumentAuthoringService(
          new EncryptedPrivacyVaultStore({
            rootDir:
              current.root
          }),
          new SecureCaseArtifactStore({
            rootDir:
              current.root
          }),
          restartedState
        );
      const final =
        await restartedService
          .deanonymizeConsumed({
            target: target!,
            createdByUserId:
              current.userId,
            caseDataKey:
              current
                .caseDataKey,
            keyVersion: 1
          });

      expect(
        final.artifact
          .sensitivity
      ).toBe(
        "CLEAR_PII"
      );
      expect(
        final.text
      ).toContain(
        "Jan Kowalski"
      );
      expect(
        final.text
      ).not.toContain(
        "LMPII"
      );
      expect(
        await restartedState
          .resolve(
            current.caseId,
            tokenized
              .artifact
              .artifactId
          )
      ).toBeNull();

      current
        .caseDataKey
        .fill(0);
    });
  }
});

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
  CompleteDocumentIngestor
} from "../src/document-ingestion.js";
import {
  LocalPrivateDocumentService
} from "../src/document-service.js";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  SecureCaseDocumentStore
} from "../src/case-document-store.js";
import {
  EncryptedPrivacyVaultStore
} from "../src/privacy/vault-store.js";

const roots: string[] = [];

function tempRoot(): string {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g34h3-doc-"
      )
    );
  roots.push(root);
  return root;
}

function allBytes(
  directory: string
): Buffer {
  const parts: Buffer[] = [];
  const walk = (
    current: string
  ): void => {
    for (
      const entry
      of fs.readdirSync(
        current,
        {
          withFileTypes: true
        }
      )
    ) {
      parts.push(
        Buffer.from(
          entry.name,
          "utf8"
        )
      );
      const target =
        path.join(
          current,
          entry.name
        );
      if (
        entry.isDirectory()
      ) {
        walk(target);
      } else {
        parts.push(
          fs.readFileSync(
            target
          )
        );
      }
    }
  };
  walk(directory);
  return Buffer.concat(parts);
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

describe("G34H3 encrypted document persistence", () => {
  it("persists OCR source and protected chunks encrypted and restores them after restart", async () => {
    const root =
      tempRoot();
    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const created =
      await files.createCase({
        createdByUserId:
          "user_0123456789abcdef0123456789abcdef",
        keyVersion: 1
      });
    const key =
      randomBytes(32);
    const sourceText =
      "Jan Kowalski jest powodem. Pozostała treść dokumentu testowego.";
    const ingestor =
      new CompleteDocumentIngestor({
        extract: async (data) => ({
          bytes:
            data.byteLength,
          pages: [{
            page: 1,
            text: sourceText
          }]
        })
      });
    const vaultStore =
      new EncryptedPrivacyVaultStore({
        rootDir: root
      });
    const documentStore =
      new SecureCaseDocumentStore({
        rootDir: root
      });
    const service =
      new LocalPrivateDocumentService(
        ingestor,
        {
          recognize:
            async () => []
        },
        24_000,
        undefined,
        vaultStore,
        documentStore
      );

    const review =
      await service.review(
        Buffer.from(
          "%PDF-g34h3"
        ),
        "application/pdf",
        {
          caseId:
            created.caseId,
          caseDataKey: key,
          keyVersion: 1
        }
      );
    const result =
      await service.finalizeReview(
        review.documentId,
        [{
          page: 1,
          start: 0,
          end:
            "Jan Kowalski".length,
          action:
            "PSEUDONYMIZE",
          kind: "PERSON"
        }],
        {
          caseId:
            created.caseId,
          caseDataKey: key,
          keyVersion: 1
        }
      );

    expect(
      result.chunks[0]?.text
    ).toContain(
      "[PII:PERSON:0001]"
    );

    const secureDocumentDir =
      path.join(
        root,
        "cases",
        created.caseId,
        "secure",
        "documents",
        review.documentId
      );
    expect(
      fs.existsSync(
        path.join(
          secureDocumentDir,
          "source.lme"
        )
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          secureDocumentDir,
          "protected.lme"
        )
      )
    ).toBe(true);

    const disk =
      allBytes(
        secureDocumentDir
      );
    expect(
      disk.includes(
        Buffer.from(
          "Jan Kowalski",
          "utf8"
        )
      )
    ).toBe(false);

    const restarted =
      new LocalPrivateDocumentService(
        ingestor,
        {
          recognize:
            async () => []
        },
        24_000,
        undefined,
        new EncryptedPrivacyVaultStore({
          rootDir: root
        }),
        new SecureCaseDocumentStore({
          rootDir: root
        })
      );

    const restored =
      await restarted
        .restoreDocument({
          caseId:
            created.caseId,
          documentId:
            review.documentId,
          caseDataKey: key,
          keyVersion: 1
        });

    expect(
      restored.chunks
    ).toEqual(
      result.chunks
    );
    const attachment =
      await restarted
        .resolveProtectedChunks({
          documentId:
            review.documentId,
          chunkIndices: [1]
        });
    expect(
      JSON.stringify(
        attachment
      )
    ).not.toContain(
      "Jan Kowalski"
    );
    expect(
      restarted.deanonymize(
        review.documentId,
        "[PII:PERSON:0001]"
      )
    ).toBe(
      "Jan Kowalski"
    );

    key.fill(0);
  });
});

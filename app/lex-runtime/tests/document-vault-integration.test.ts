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
  EncryptedPrivacyVaultStore
} from "../src/privacy/vault-store.js";

const roots: string[] = [];
const CASE_ID =
  "case_0123456789abcdef0123456789abcdef";

function tempRoot(): string {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g31c1-doc-"
    )
  );
  roots.push(root);
  return root;
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

describe("G31C1 document vault integration", () => {
  it("persists finalized document mapping and restores exact deanonymization after vault-store restart", async () => {
    const root = tempRoot();
    const key =
      randomBytes(32);
    const sourceText =
      "Jan Kowalski jest powodem w sprawie cywilnej i wnosi o zasądzenie należności wraz z odsetkami.";

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
    const firstStore =
      new EncryptedPrivacyVaultStore({
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
        firstStore
      );

    const data =
      Buffer.from(
        "%PDF-g31c1-fixture"
      );
    const review =
      await service.review(
        data,
        "application/pdf",
        {
          caseId: CASE_ID
        }
      );

    const protectedResult =
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
          caseId: CASE_ID,
          caseDataKey: key,
          keyVersion: 1
        }
      );

    const token =
      protectedResult.chunks[0]
        ?.text.match(
          /\[PII:PERSON:\d{4}\]/
        )?.[0];
    expect(token).toBe(
      "[PII:PERSON:0001]"
    );

    const diskPath =
      path.join(
        root,
        "cases",
        CASE_ID,
        "private",
        "privacy",
        "vault.lmv"
      );
    const diskBytes =
      fs.readFileSync(
        diskPath
      );
    expect(
      diskBytes.includes(
        Buffer.from(
          "Jan Kowalski"
        )
      )
    ).toBe(false);

    const restartedStore =
      new EncryptedPrivacyVaultStore({
        rootDir: root
      });
    const restored =
      await restartedStore
        .loadDocumentVault({
          caseId: CASE_ID,
          documentId:
            review.documentId,
          caseDataKey: key,
          keyVersion: 1
        });

    expect(
      restored.deanonymize(
        `Powód: ${token}`
      )
    ).toBe(
      "Powód: Jan Kowalski"
    );

    key.fill(0);
  });
});

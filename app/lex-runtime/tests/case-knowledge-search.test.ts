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
import {
  LocalCaseKnowledgeSearch
} from "../src/case-knowledge-search.js";

const roots: string[] = [];

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

describe("G39 protected case knowledge retrieval", () => {
  it("searches only protected chunks from the encrypted case document store", async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "lex-g39-"
        )
      );
    roots.push(root);

    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const created =
      await files.createCase({
        createdByUserId:
          "user_0123456789abcdef0123456789abcdef",
        keyVersion: 1,
        caseKind: "MATTER"
      });
    const key =
      randomBytes(32);
    const documentStore =
      new SecureCaseDocumentStore({
        rootDir: root
      });
    const service =
      new LocalPrivateDocumentService(
        new CompleteDocumentIngestor({
          extract: async () => ({
            bytes: 100,
            pages: [{
              page: 1,
              text:
                "Jan Kowalski. Strategia apelacji opiera się na dowodzie z opinii biegłego i zarzucie naruszenia art. 233 k.p.c."
            }]
          })
        }),
        {
          recognize:
            async () => []
        },
        24_000,
        undefined,
        new EncryptedPrivacyVaultStore({
          rootDir: root
        }),
        documentStore
      );

    const review =
      await service.review(
        Buffer.from(
          "%PDF-g39"
        ),
        "application/pdf",
        {
          caseId:
            created.caseId,
          caseDataKey: key,
          keyVersion: 1
        }
      );
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

    const search =
      new LocalCaseKnowledgeSearch(
        documentStore
      );
    const hits =
      await search.search({
        caseId:
          created.caseId,
        caseDataKey: key,
        keyVersion: 1,
        query:
          "strategia apelacji opinia biegłego",
        limit: 4
      });

    expect(hits).toHaveLength(1);
    expect(
      hits[0]?.documentId
    ).toBe(
      review.documentId
    );
    expect(
      hits[0]?.text
    ).toContain(
      "Strategia apelacji"
    );
    expect(
      hits[0]?.text
    ).toContain(
      "[PII:PERSON:0001]"
    );
    expect(
      hits[0]?.text
    ).not.toContain(
      "Jan Kowalski"
    );

    key.fill(0);
  });

  it("returns no unrelated chunks and rejects meaningless queries", async () => {
    const store = {
      listDocumentIds:
        async () =>
          ["doc_0123456789abcdef01234567"],
      loadProtected:
        async () => ({
          documentId:
            "doc_0123456789abcdef01234567",
          mediaType:
            "application/pdf" as const,
          complete: true as const,
          totalPages: 1,
          digitalPages: 1,
          ocrPages: 0,
          blankPages: 0,
          sourceChars: 20,
          pseudonymizedChars: 20,
          chunks: [{
            index: 1,
            pageStart: 1,
            pageEnd: 1,
            text:
              "Umowa najmu lokalu użytkowego."
          }],
          privacy: {
            findings: 0,
            counts: {},
            manualPseudonymizations: 0,
            keptRanges: 0,
            annotations: [],
            reversibleLocally:
              true as const
          }
        })
    };
    const search =
      new LocalCaseKnowledgeSearch(
        store as never
      );
    const key =
      randomBytes(32);

    await expect(
      search.search({
        caseId:
          "case_0123456789abcdef0123456789abcdef",
        caseDataKey: key,
        keyVersion: 1,
        query:
          "odpowiedzialność deliktowa"
      })
    ).resolves.toEqual([]);

    await expect(
      search.search({
        caseId:
          "case_0123456789abcdef0123456789abcdef",
        caseDataKey: key,
        keyVersion: 1,
        query: "i"
      })
    ).rejects.toThrow(
      "INVALID_KNOWLEDGE_QUERY"
    );

    key.fill(0);
  });
});

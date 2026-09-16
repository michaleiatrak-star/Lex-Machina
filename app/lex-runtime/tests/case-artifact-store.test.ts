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
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  SecureCaseArtifactStore
} from "../src/case-artifact-store.js";

const roots: string[] = [];

function tempRoot(): string {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g34h4-artifact-"
      )
    );
  roots.push(root);
  return root;
}

function allBytes(
  directory: string
): Buffer {
  const parts:
    Buffer[] = [];
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

describe("G34H4 encrypted artifact store", () => {
  it("keeps filename and clear-PII artifact bytes encrypted at rest and rekeys them", async () => {
    const root =
      tempRoot();
    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const legalCase =
      await files.createCase({
        createdByUserId:
          "user_0123456789abcdef0123456789abcdef",
        keyVersion: 1
      });
    const store =
      new SecureCaseArtifactStore({
        rootDir: root
      });
    const oldKey =
      randomBytes(32);
    const newKey =
      randomBytes(32);
    const filename =
      "Pozew Jan Kowalski.docx";
    const clear =
      Buffer.from(
        "DOCX fixture: Jan Kowalski, PESEL 44051401458"
      );

    const artifact =
      await store.saveArtifact({
        caseId:
          legalCase.caseId,
        filename,
        mediaType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        data: clear,
        caseDataKey: oldKey,
        keyVersion: 1,
        sensitivity:
          "CLEAR_PII",
        createdByUserId:
          "user_0123456789abcdef0123456789abcdef"
      });

    const rootBytes =
      allBytes(
        path.join(
          root,
          "cases",
          legalCase.caseId,
          "secure",
          "artifacts"
        )
      );
    for (
      const value of [
        filename,
        "Jan Kowalski",
        "44051401458"
      ]
    ) {
      expect(
        rootBytes.includes(
          Buffer.from(
            value,
            "utf8"
          )
        )
      ).toBe(false);
    }

    const listed =
      await store.listArtifacts({
        caseId:
          legalCase.caseId,
        caseDataKey:
          oldKey,
        keyVersion: 1
      });
    expect(listed).toEqual([
      expect.objectContaining({
        artifactId:
          artifact.artifactId,
        filename,
        sensitivity:
          "CLEAR_PII",
        storage:
          "ENCRYPTED_LME1"
      })
    ]);

    const restored =
      await store.readArtifact({
        caseId:
          legalCase.caseId,
        artifactId:
          artifact.artifactId,
        caseDataKey:
          oldKey,
        keyVersion: 1,
        maxBytes: 1024
      });
    expect(
      restored.equals(clear)
    ).toBe(true);
    restored.fill(0);

    await expect(
      store.rekeyCaseArtifacts({
        caseId:
          legalCase.caseId,
        oldCaseDataKey:
          oldKey,
        oldKeyVersion: 1,
        newCaseDataKey:
          newKey,
        newKeyVersion: 2
      })
    ).resolves.toBe(true);
    await files.updateCaseKeyVersion(
      legalCase.caseId,
      2
    );

    const after =
      await store.readArtifact({
        caseId:
          legalCase.caseId,
        artifactId:
          artifact.artifactId,
        caseDataKey:
          newKey,
        keyVersion: 2,
        maxBytes: 1024
      });
    expect(
      after.equals(clear)
    ).toBe(true);
    after.fill(0);

    await expect(
      store.readArtifact({
        caseId:
          legalCase.caseId,
        artifactId:
          artifact.artifactId,
        caseDataKey:
          oldKey,
        keyVersion: 2,
        maxBytes: 1024
      })
    ).rejects.toThrow();

    oldKey.fill(0);
    newKey.fill(0);
    clear.fill(0);
  });
});

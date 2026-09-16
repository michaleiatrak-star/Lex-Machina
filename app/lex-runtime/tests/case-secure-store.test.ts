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
  SecureCaseUploadStore
} from "../src/case-secure-store.js";

const roots: string[] = [];

function tempRoot(): string {
  const value =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-secure-upload-"
      )
    );
  roots.push(value);
  return value;
}

function allFileBytes(
  root: string
): Buffer {
  const parts: Buffer[] = [];
  function walk(
    directory: string
  ): void {
    for (
      const entry
      of fs.readdirSync(
        directory,
        {
          withFileTypes: true
        }
      )
    ) {
      const target =
        path.join(
          directory,
          entry.name
        );
      parts.push(
        Buffer.from(
          entry.name,
          "utf8"
        )
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
  }
  walk(root);
  return Buffer.concat(
    parts
  );
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

describe("G34H1 secure incoming upload store", () => {
  it("stores filename, metadata and payload only in encrypted LME1 objects", async () => {
    const root =
      tempRoot();
    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const metadata =
      await files.createCase({
        createdByUserId:
          "user_0123456789abcdef0123456789abcdef",
        keyVersion: 1
      });
    const secure =
      new SecureCaseUploadStore({
        rootDir: root
      });
    const key =
      randomBytes(32);
    const filename =
      "Pozew Jan Kowalski.pdf";
    const clear =
      Buffer.from(
        "TAJNE AKTA: Jan Kowalski, PESEL 44051401458"
      );

    const stored =
      await secure.saveUpload({
        caseId:
          metadata.caseId,
        filename,
        mediaType:
          "application/pdf",
        data: clear,
        caseDataKey: key,
        keyVersion: 1
      });

    expect(stored).toMatchObject({
      filename,
      storage:
        "ENCRYPTED_LME1",
      archive: false
    });

    const caseBytes =
      allFileBytes(
        path.join(
          root,
          "cases",
          metadata.caseId,
          "secure"
        )
      );
    expect(
      caseBytes.includes(
        Buffer.from(
          filename,
          "utf8"
        )
      )
    ).toBe(false);
    expect(
      caseBytes.includes(
        Buffer.from(
          "Jan Kowalski",
          "utf8"
        )
      )
    ).toBe(false);
    expect(
      caseBytes.includes(
        Buffer.from(
          "44051401458",
          "utf8"
        )
      )
    ).toBe(false);

    const listed =
      await secure.listUploads({
        caseId:
          metadata.caseId,
        caseDataKey: key,
        keyVersion: 1
      });
    expect(listed).toEqual([
      expect.objectContaining({
        uploadId:
          stored.uploadId,
        filename,
        storage:
          "ENCRYPTED_LME1"
      })
    ]);

    const restored =
      await secure.readUploadPayload({
        caseId:
          metadata.caseId,
        uploadId:
          stored.uploadId,
        caseDataKey: key,
        keyVersion: 1,
        maxBytes: 1024
      });
    expect(
      restored.equals(clear)
    ).toBe(true);

    restored.fill(0);
    clear.fill(0);
    key.fill(0);
  });

  it("rekeys every secure upload with the case CDK version", async () => {
    const root =
      tempRoot();
    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const metadata =
      await files.createCase({
        createdByUserId:
          "user_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        keyVersion: 1
      });
    const secure =
      new SecureCaseUploadStore({
        rootDir: root
      });
    const oldKey =
      randomBytes(32);
    const newKey =
      randomBytes(32);

    const stored =
      await secure.saveUpload({
        caseId:
          metadata.caseId,
        filename:
          "dowod.png",
        mediaType:
          "image/png",
        data:
          Buffer.from(
            "binary-image-fixture"
          ),
        caseDataKey:
          oldKey,
        keyVersion: 1
      });

    await expect(
      secure.rekeyCaseIncoming({
        caseId:
          metadata.caseId,
        oldCaseDataKey:
          oldKey,
        oldKeyVersion: 1,
        newCaseDataKey:
          newKey,
        newKeyVersion: 2
      })
    ).resolves.toBe(true);

    await files.updateCaseKeyVersion(
      metadata.caseId,
      2
    );

    const listed =
      await secure.listUploads({
        caseId:
          metadata.caseId,
        caseDataKey:
          newKey,
        keyVersion: 2
      });
    expect(
      listed[0]?.uploadId
    ).toBe(
      stored.uploadId
    );

    await expect(
      secure.readUploadPayload({
        caseId:
          metadata.caseId,
        uploadId:
          stored.uploadId,
        caseDataKey:
          oldKey,
        keyVersion: 2,
        maxBytes: 1024
      })
    ).rejects.toThrow();

    const restored =
      await secure.readUploadPayload({
        caseId:
          metadata.caseId,
        uploadId:
          stored.uploadId,
        caseDataKey:
          newKey,
        keyVersion: 2,
        maxBytes: 1024
      });
    expect(
      restored.toString("utf8")
    ).toBe(
      "binary-image-fixture"
    );

    restored.fill(0);
    oldKey.fill(0);
    newKey.fill(0);
  });

  it("marks ZIP extraction deferred until G34H2 instead of writing plaintext members", async () => {
    const root =
      tempRoot();
    const files =
      new LocalCaseFileStore({
        rootDir: root
      });
    const metadata =
      await files.createCase({
        createdByUserId:
          "user_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        keyVersion: 1
      });
    const secure =
      new SecureCaseUploadStore({
        rootDir: root
      });
    const key =
      randomBytes(32);

    const stored =
      await secure.saveUpload({
        caseId:
          metadata.caseId,
        filename:
          "akta.zip",
        mediaType:
          "application/zip",
        data:
          Buffer.from(
            "PK\u0003\u0004fixture"
          ),
        caseDataKey: key,
        keyVersion: 1
      });

    expect(stored).toMatchObject({
      archive: true,
      extracted: [],
      archiveExtractionStatus:
        "DEFERRED_G34H2",
      storage:
        "ENCRYPTED_LME1"
    });
    expect(
      fs.existsSync(
        path.join(
          root,
          "cases",
          metadata.caseId,
          "secure",
          "extracted"
        )
      )
    ).toBe(false);

    key.fill(0);
  });
});

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
  readCaseBlob,
  rekeyCaseBlob,
  writeCaseBlob,
  type CaseBlobIdentity
} from "../src/case-blob.js";

const roots: string[] = [];

function tempRoot(): string {
  const value =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-lme1-"
      )
    );
  roots.push(value);
  return value;
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

describe("LME1 encrypted case blob", () => {
  it("stores no clear payload and round-trips under the exact case identity", async () => {
    const root = tempRoot();
    const file =
      path.join(
        root,
        "payload.lme"
      );
    const key =
      randomBytes(32);
    const identity:
      CaseBlobIdentity = {
        caseId:
          "case_0123456789abcdef0123456789abcdef",
        objectId:
          "upload_0123456789abcdef0123456789abcdef",
        purpose:
          "incoming-payload",
        keyVersion: 1
      };
    const clear =
      Buffer.from(
        "Jan Kowalski\nPESEL 44051401458\nsekretna treść akt"
      );

    await writeCaseBlob({
      targetFile: file,
      identity,
      caseDataKey: key,
      data: clear
    });

    const disk =
      fs.readFileSync(
        file
      );
    expect(
      disk.includes(clear)
    ).toBe(false);
    expect(
      disk.includes(
        Buffer.from(
          "Jan Kowalski"
        )
      )
    ).toBe(false);

    const restored =
      await readCaseBlob({
        targetFile: file,
        identity,
        caseDataKey: key,
        maxBytes: 1024
      });
    expect(
      restored.equals(clear)
    ).toBe(true);

    key.fill(0);
    restored.fill(0);
    clear.fill(0);
  });

  it("fails closed for wrong key, wrong case AAD and truncated data", async () => {
    const root = tempRoot();
    const file =
      path.join(
        root,
        "payload.lme"
      );
    const key =
      randomBytes(32);
    const identity:
      CaseBlobIdentity = {
        caseId:
          "case_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        objectId:
          "upload_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        purpose:
          "incoming-payload",
        keyVersion: 1
      };

    await writeCaseBlob({
      targetFile: file,
      identity,
      caseDataKey: key,
      data:
        Buffer.from(
          "tajne dane"
        )
    });

    const wrong =
      randomBytes(32);
    await expect(
      readCaseBlob({
        targetFile: file,
        identity,
        caseDataKey: wrong,
        maxBytes: 1024
      })
    ).rejects.toThrow();
    wrong.fill(0);

    await expect(
      readCaseBlob({
        targetFile: file,
        identity: {
          ...identity,
          caseId:
            "case_cccccccccccccccccccccccccccccccc"
        },
        caseDataKey: key,
        maxBytes: 1024
      })
    ).rejects.toThrow(
      "CASE_BLOB_AAD_INVALID"
    );

    const original =
      fs.readFileSync(
        file
      );
    fs.writeFileSync(
      file,
      original.subarray(
        0,
        original.length - 7
      )
    );
    await expect(
      readCaseBlob({
        targetFile: file,
        identity,
        caseDataKey: key,
        maxBytes: 1024
      })
    ).rejects.toThrow();

    key.fill(0);
  });

  it("rekeys a multi-chunk blob without changing plaintext", async () => {
    const root = tempRoot();
    const file =
      path.join(
        root,
        "large.lme"
      );
    const oldKey =
      randomBytes(32);
    const newKey =
      randomBytes(32);
    const oldIdentity:
      CaseBlobIdentity = {
        caseId:
          "case_dddddddddddddddddddddddddddddddd",
        objectId:
          "upload_eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        purpose:
          "incoming-payload",
        keyVersion: 1
      };
    const newIdentity = {
      ...oldIdentity,
      keyVersion: 2
    };
    const clear =
      Buffer.alloc(
        2 * 1024 * 1024 +
          777,
        0x5a
      );

    await writeCaseBlob({
      targetFile: file,
      identity:
        oldIdentity,
      caseDataKey:
        oldKey,
      data: clear
    });
    await rekeyCaseBlob({
      targetFile: file,
      oldIdentity,
      newIdentity,
      oldCaseDataKey:
        oldKey,
      newCaseDataKey:
        newKey
    });

    await expect(
      readCaseBlob({
        targetFile: file,
        identity:
          oldIdentity,
        caseDataKey:
          oldKey,
        maxBytes:
          clear.byteLength + 1
      })
    ).rejects.toThrow();

    const restored =
      await readCaseBlob({
        targetFile: file,
        identity:
          newIdentity,
        caseDataKey:
          newKey,
        maxBytes:
          clear.byteLength + 1
      });
    expect(
      restored.equals(clear)
    ).toBe(true);

    oldKey.fill(0);
    newKey.fill(0);
    restored.fill(0);
    clear.fill(0);
  });
});

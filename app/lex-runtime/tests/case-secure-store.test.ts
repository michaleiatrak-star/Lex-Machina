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

function crc32(
  data: Buffer
): number {
  let crc = 0xffffffff;
  for (
    const byte of data
  ) {
    crc ^= byte;
    for (
      let bit = 0;
      bit < 8;
      bit += 1
    ) {
      crc =
        (crc >>> 1) ^
        (
          (crc & 1)
            ? 0xedb88320
            : 0
        );
    }
  }
  return (
    crc ^ 0xffffffff
  ) >>> 0;
}

function createStoredZip(
  entries: Array<{
    name: string;
    data: Buffer;
  }>
): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (
    const entry of entries
  ) {
    const name =
      Buffer.from(
        entry.name,
        "utf8"
      );
    const checksum =
      crc32(entry.data);
    const local =
      Buffer.alloc(30);
    local.writeUInt32LE(
      0x04034b50,
      0
    );
    local.writeUInt16LE(
      20,
      4
    );
    local.writeUInt16LE(
      0,
      6
    );
    local.writeUInt16LE(
      0,
      8
    );
    local.writeUInt32LE(
      checksum,
      14
    );
    local.writeUInt32LE(
      entry.data.length,
      18
    );
    local.writeUInt32LE(
      entry.data.length,
      22
    );
    local.writeUInt16LE(
      name.length,
      26
    );

    const central =
      Buffer.alloc(46);
    central.writeUInt32LE(
      0x02014b50,
      0
    );
    central.writeUInt16LE(
      20,
      4
    );
    central.writeUInt16LE(
      20,
      6
    );
    central.writeUInt16LE(
      0,
      8
    );
    central.writeUInt16LE(
      0,
      10
    );
    central.writeUInt32LE(
      checksum,
      16
    );
    central.writeUInt32LE(
      entry.data.length,
      20
    );
    central.writeUInt32LE(
      entry.data.length,
      24
    );
    central.writeUInt16LE(
      name.length,
      28
    );
    central.writeUInt32LE(
      offset,
      42
    );

    locals.push(
      local,
      name,
      entry.data
    );
    centrals.push(
      central,
      name
    );
    offset +=
      local.length +
      name.length +
      entry.data.length;
  }

  const centralOffset =
    offset;
  const centralBytes =
    Buffer.concat(
      centrals
    );
  const end =
    Buffer.alloc(22);
  end.writeUInt32LE(
    0x06054b50,
    0
  );
  end.writeUInt16LE(
    entries.length,
    8
  );
  end.writeUInt16LE(
    entries.length,
    10
  );
  end.writeUInt32LE(
    centralBytes.length,
    12
  );
  end.writeUInt32LE(
    centralOffset,
    16
  );

  return Buffer.concat([
    ...locals,
    centralBytes,
    end
  ]);
}

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

  it("extracts ZIP in private workdir and persists members only as encrypted opaque LME1 objects", async () => {
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
    const secretPdf =
      Buffer.from(
        "%PDF tajny dowod Jan Kowalski"
      );
    const secretNote =
      Buffer.from(
        "sekretna notatka klienta"
      );
    const zip =
      createStoredZip([
        {
          name:
            "dowody/Jan-Kowalski.pdf",
          data:
            secretPdf
        },
        {
          name:
            "notatka.txt",
          data:
            secretNote
        }
      ]);

    const stored =
      await secure.saveUpload({
        caseId:
          metadata.caseId,
        filename:
          "akta.zip",
        mediaType:
          "application/zip",
        data: zip,
        caseDataKey: key,
        keyVersion: 1
      });

    expect(stored).toMatchObject({
      archive: true,
      archiveExtractionStatus:
        "COMPLETE",
      storage:
        "ENCRYPTED_LME1"
    });
    expect(
      stored.extracted.map(
        (entry) =>
          entry.relativePath
      )
    ).toEqual([
      "dowody/Jan-Kowalski.pdf",
      "notatka.txt"
    ]);
    expect(
      stored.extracted.every(
        (entry) =>
          typeof entry.fileId ===
            "string" &&
          /^file_[a-f0-9]{32}$/
            .test(entry.fileId)
      )
    ).toBe(true);

    const pdfMember =
      stored.extracted.find(
        (entry) =>
          entry.relativePath ===
            "dowody/Jan-Kowalski.pdf"
      );
    expect(
      pdfMember?.fileId
    ).toMatch(
      /^file_[a-f0-9]{32}$/
    );
    const restoredMember =
      await secure
        .readExtractedPayload({
          caseId:
            metadata.caseId,
          uploadId:
            stored.uploadId,
          fileId:
            pdfMember!.fileId!,
          caseDataKey: key,
          keyVersion: 1,
          maxBytes: 1024
        });
    expect(
      restoredMember
        .manifest
        .relativePath
    ).toBe(
      "dowody/Jan-Kowalski.pdf"
    );
    expect(
      restoredMember.data
        .equals(secretPdf)
    ).toBe(true);
    restoredMember.data.fill(0);

    const secureBytes =
      allFileBytes(
        path.join(
          root,
          "cases",
          metadata.caseId,
          "secure"
        )
      );
    for (
      const clear of [
        "Jan-Kowalski.pdf",
        "tajny dowod Jan Kowalski",
        "notatka.txt",
        "sekretna notatka klienta"
      ]
    ) {
      expect(
        secureBytes.includes(
          Buffer.from(
            clear,
            "utf8"
          )
        )
      ).toBe(false);
    }

    const extractedRoot =
      path.join(
        root,
        "cases",
        metadata.caseId,
        "secure",
        "incoming",
        stored.uploadId,
        "extracted"
      );
    const opaqueEntries =
      fs.readdirSync(
        extractedRoot
      );
    expect(
      opaqueEntries
    ).toHaveLength(2);
    expect(
      opaqueEntries.every(
        (value) =>
          /^file_[a-f0-9]{32}$/
            .test(value)
      )
    ).toBe(true);

    const workRoot =
      path.join(
        root,
        "work",
        "zip"
      );
    expect(
      fs.existsSync(workRoot)
        ? fs.readdirSync(
            workRoot
          ).length
        : 0
    ).toBe(0);

    key.fill(0);
    zip.fill(0);
    secretPdf.fill(0);
    secretNote.fill(0);
  });
});

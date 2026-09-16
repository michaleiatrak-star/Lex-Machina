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
import {
  LegacyCaseStorageMigrator
} from "../src/legacy-case-migration.js";

const roots: string[] = [];
const OWNER_ID =
  "user_0123456789abcdef0123456789abcdef";

function fixture() {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g34h5-"
    )
  );
  roots.push(root);
  const legacy =
    new LocalCaseFileStore({
      rootDir: root
    });
  const secure =
    new SecureCaseUploadStore({
      rootDir: root
    });
  const migrator =
    new LegacyCaseStorageMigrator(
      secure,
      { rootDir: root }
    );
  return {
    root,
    legacy,
    secure,
    migrator
  };
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

describe("G34H5 legacy plaintext migration", () => {
  it("encrypts and verifies a legacy upload before removing plaintext", async () => {
    const current = fixture();
    const key = randomBytes(32);
    const clear = Buffer.from(
      "%PDF-legacy-client-secret-12345"
    );
    const localCase =
      await current.legacy.createCase({
        createdByUserId: OWNER_ID,
        keyVersion: 1,
        displayName: "Legacy"
      });
    const legacyUpload =
      await current.legacy.saveUpload({
        caseId: localCase.caseId,
        filename: "pozew.pdf",
        mediaType: "application/pdf",
        data: clear,
        extractArchive: false
      });

    const report =
      await current.migrator.migrate({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
      });

    expect(
      report.remainingLegacyPlaintext
    ).toBe(false);
    expect(
      report.migratedUploads
    ).toEqual([
      legacyUpload.uploadId
    ]);
    expect(
      fs.existsSync(
        path.join(
          current.root,
          "cases",
          localCase.caseId,
          "incoming"
        )
      )
    ).toBe(false);

    const secureUploads =
      await current.secure.listUploads({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
      });
    expect(secureUploads).toEqual([
      expect.objectContaining({
        uploadId:
          legacyUpload.uploadId,
        sha256:
          legacyUpload.sha256,
        storage:
          "ENCRYPTED_LME1"
      })
    ]);

    const payload =
      await current.secure
        .readUploadPayload({
          caseId: localCase.caseId,
          uploadId:
            legacyUpload.uploadId,
          caseDataKey: key,
          keyVersion: 1,
          maxBytes: 1024
        });
    try {
      expect(payload.equals(clear))
        .toBe(true);
    } finally {
      payload.fill(0);
    }

    const caseRoot = path.join(
      current.root,
      "cases",
      localCase.caseId
    );
    const plaintextNeedle =
      Buffer.from(
        "legacy-client-secret-12345"
      );
    function scan(dir: string): boolean {
      for (
        const entry
        of fs.readdirSync(
          dir,
          {
            withFileTypes: true
          }
        )
      ) {
        const target = path.join(
          dir,
          entry.name
        );
        if (entry.isDirectory()) {
          if (scan(target)) {
            return true;
          }
        } else if (
          fs.readFileSync(target)
            .includes(
              plaintextNeedle
            )
        ) {
          return true;
        }
      }
      return false;
    }
    expect(scan(caseRoot)).toBe(false);

    const second =
      await current.migrator.migrate({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
      });
    expect(
      second.remainingLegacyPlaintext
    ).toBe(false);
    expect(
      second.migratedUploads
    ).toEqual([]);

    key.fill(0);
    clear.fill(0);
  });

  it("blocks unknown legacy files without deleting them", async () => {
    const current = fixture();
    const key = randomBytes(32);
    const localCase =
      await current.legacy.createCase({
        createdByUserId: OWNER_ID,
        keyVersion: 1
      });
    const target = path.join(
      current.root,
      "cases",
      localCase.caseId,
      "documents",
      "unknown-legacy.txt"
    );
    fs.writeFileSync(
      target,
      "do-not-delete"
    );

    const report =
      await current.migrator.migrate({
        caseId: localCase.caseId,
        caseDataKey: key,
        keyVersion: 1
      });

    expect(
      report.remainingLegacyPlaintext
    ).toBe(true);
    expect(
      report.blockedEntries
    ).toContain(
      "documents:NONEMPTY_LEGACY_DIRECTORY"
    );
    expect(
      fs.readFileSync(
        target,
        "utf8"
      )
    ).toBe("do-not-delete");

    key.fill(0);
  });
});

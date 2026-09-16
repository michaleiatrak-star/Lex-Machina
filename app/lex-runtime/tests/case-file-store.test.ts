import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";

const roots: string[] = [];

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(
    path.join(os.tmpdir(), "lex-case-store-")
  );
  roots.push(root);
  return root;
}

function makeZip(
  target: string,
  mode: "safe" | "traversal" | "symlink" | "bomb"
): void {
  const script = String.raw`
import sys, zipfile
from zipfile import ZipInfo, ZIP_DEFLATED
target, mode = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(target, "w", compression=ZIP_DEFLATED) as z:
    if mode == "safe":
        z.writestr("akta/notatka.txt", "tekst sprawy")
        z.writestr("scan.pdf", b"%PDF-fixture")
    elif mode == "traversal":
        z.writestr("../escape.txt", "no")
    elif mode == "symlink":
        info = ZipInfo("link")
        info.create_system = 3
        info.external_attr = (0o120777 << 16)
        z.writestr(info, "target")
    elif mode == "bomb":
        z.writestr("huge.txt", b"0" * (4 * 1024 * 1024))
`;
  const result = spawnSync(
    process.env.LEX_STORAGE_PYTHON ?? "python3",
    ["-c", script, target, mode],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(
      result.stderr || "zip fixture creation failed"
    );
  }
}

afterEach(async () => {
  while (roots.length) {
    await rm(roots.pop()!, {
      recursive: true,
      force: true
    });
  }
});

describe("LocalCaseFileStore", () => {
  it("creates an opaque case directory and persists original uploads", async () => {
    const root = await tempRoot();
    const store =
      new LocalCaseFileStore({
        rootDir: root
      });
    const created =
      await store.createCase(
        "Sprawa testowa"
      );

    expect(created.caseId)
      .toMatch(/^case_[a-f0-9]{32}$/);

    const upload =
      await store.saveUpload({
        caseId: created.caseId,
        filename: "dowod.pdf",
        mediaType: "application/pdf",
        data: new TextEncoder()
          .encode("%PDF-fixture"),
        extractArchive: false
      });

    const original = path.join(
      root,
      "cases",
      created.caseId,
      "incoming",
      upload.uploadId,
      "original",
      "dowod.pdf"
    );
    expect(
      (await stat(original)).isFile()
    ).toBe(true);
    expect(
      await readFile(original, "utf8")
    ).toBe("%PDF-fixture");
    expect(upload.sha256)
      .toMatch(/^[a-f0-9]{64}$/);
  });

  it("extracts safe ZIP members into the case upload directory", async () => {
    const root = await tempRoot();
    const fixture =
      path.join(root, "safe.zip");
    makeZip(fixture, "safe");
    const bytes =
      await readFile(fixture);

    const store =
      new LocalCaseFileStore({
        rootDir: root
      });
    const created =
      await store.createCase();

    const upload =
      await store.saveUpload({
        caseId: created.caseId,
        filename: "akta.zip",
        mediaType: "application/zip",
        data: bytes
      });

    expect(upload.archive).toBe(true);
    expect(upload.extracted)
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            relativePath:
              "akta/notatka.txt"
          }),
          expect.objectContaining({
            relativePath: "scan.pdf",
            processable: true
          })
        ])
      );

    const extracted = path.join(
      root,
      "cases",
      created.caseId,
      "incoming",
      upload.uploadId,
      "extracted",
      "akta",
      "notatka.txt"
    );
    expect(
      await readFile(
        extracted,
        "utf8"
      )
    ).toBe("tekst sprawy");
  });

  for (const mode of [
    "traversal",
    "symlink",
    "bomb"
  ] as const) {
    it(`rejects unsafe ZIP mode: ${mode}`, async () => {
      const root = await tempRoot();
      const fixture =
        path.join(root, `${mode}.zip`);
      makeZip(fixture, mode);
      const bytes =
        await readFile(fixture);

      const store =
        new LocalCaseFileStore({
          rootDir: root
        });
      const created =
        await store.createCase();

      await expect(
        store.saveUpload({
          caseId: created.caseId,
          filename: `${mode}.zip`,
          mediaType:
            "application/zip",
          data: bytes
        })
      ).rejects.toThrow();

      const incoming =
        await readdir(
          path.join(
            root,
            "cases",
            created.caseId,
            "incoming"
          )
        );
      expect(incoming).toEqual([]);
    });
  }
});

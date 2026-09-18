import {
  mkdtemp,
  readFile,
  readdir,
  rm
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import {
  LocalCaseFileStore
} from "./case-file-store.js";

const root = await mkdtemp(
  path.join(os.tmpdir(), "lex-g31b-")
);

function makeZip(
  target: string,
  unsafe: boolean
): void {
  const script = String.raw`
import sys, zipfile
target, unsafe = sys.argv[1], sys.argv[2] == "1"
with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
    if unsafe:
        z.writestr("../escape.txt", "blocked")
    else:
        z.writestr("akta/readme.txt", "safe")
        z.writestr("scan.pdf", b"%PDF-safe")
`;
  const run = spawnSync(
    process.env.LEX_STORAGE_PYTHON ??
      "python3",
    [
      "-c",
      script,
      target,
      unsafe ? "1" : "0"
    ],
    { encoding: "utf8" }
  );
  if (run.status !== 0) {
    throw new Error(
      run.stderr ||
      "ZIP_FIXTURE_CREATION_FAILED"
    );
  }
}

try {
  const store =
    new LocalCaseFileStore({
      rootDir: root
    });
  const localCase =
    await store.createCase();

  const safeZip =
    path.join(root, "safe.zip");
  makeZip(safeZip, false);
  const safe =
    await store.saveUpload({
      caseId: localCase.caseId,
      filename: "akta.zip",
      mediaType: "application/zip",
      data: await readFile(safeZip)
    });

  const badZip =
    path.join(root, "bad.zip");
  makeZip(badZip, true);
  let traversalBlocked = false;
  try {
    await store.saveUpload({
      caseId: localCase.caseId,
      filename: "bad.zip",
      mediaType: "application/zip",
      data: await readFile(badZip)
    });
  } catch {
    traversalBlocked = true;
  }

  const incoming = await readdir(
    path.join(
      root,
      "cases",
      localCase.caseId,
      "incoming"
    )
  );

  const pass =
    safe.archive === true &&
    safe.extracted.some(
      (entry) =>
        entry.relativePath ===
          "akta/readme.txt"
    ) &&
    safe.extracted.some(
      (entry) =>
        entry.relativePath ===
          "scan.pdf" &&
        entry.processable
    ) &&
    traversalBlocked &&
    incoming.length === 1;

  process.stdout.write(
    JSON.stringify({
      gate: "G31B_SAFE_ZIP_INTAKE",
      result: pass
        ? "PASS"
        : "BLOCKED",
      extractedEntries:
        safe.extracted.length,
      traversalBlocked,
      rejectedUploadRemoved:
        incoming.length === 1,
      recursiveArchiveExtraction:
        false
    }, null, 2) + "\n"
  );

  if (!pass) process.exitCode = 1;
} finally {
  await rm(root, {
    recursive: true,
    force: true
  });
}

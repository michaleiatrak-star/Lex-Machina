import {
  mkdtemp,
  readFile,
  rm,
  stat
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  LocalCaseFileStore
} from "./case-file-store.js";

const root = await mkdtemp(
  path.join(os.tmpdir(), "lex-g31a-")
);

try {
  const store =
    new LocalCaseFileStore({
      rootDir: root
    });
  const localCase =
    await store.createCase(
      "G31A fixture"
    );
  const upload =
    await store.saveUpload({
      caseId: localCase.caseId,
      filename: "dowod.pdf",
      mediaType: "application/pdf",
      data:
        new TextEncoder()
          .encode("%PDF-g31a"),
      extractArchive: false
    });

  const original = path.join(
    root,
    "cases",
    localCase.caseId,
    "incoming",
    upload.uploadId,
    "original",
    "dowod.pdf"
  );

  const pass =
    /^case_[a-f0-9]{32}$/
      .test(localCase.caseId) &&
    (await stat(original)).isFile() &&
    (await readFile(original, "utf8")) ===
      "%PDF-g31a" &&
    /^[a-f0-9]{64}$/
      .test(upload.sha256);

  process.stdout.write(
    JSON.stringify({
      gate: "G31A_CASE_STORAGE",
      result: pass
        ? "PASS"
        : "BLOCKED",
      opaqueCaseId: true,
      uploadPersistedBeforeProcessing:
        pass,
      sourceRepositoryStorage: false
    }, null, 2) + "\n"
  );

  if (!pass) process.exitCode = 1;
} finally {
  await rm(root, {
    recursive: true,
    force: true
  });
}

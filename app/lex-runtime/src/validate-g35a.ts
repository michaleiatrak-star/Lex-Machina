import {
  mkdtemp,
  rm
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  LocalCaseFileStore
} from "./case-file-store.js";

const root = await mkdtemp(
  path.join(
    os.tmpdir(),
    "lex-g35a-"
  )
);

try {
  const store =
    new LocalCaseFileStore({
      rootDir: root
    });
  const caseA =
    await store.createCase(
      "A"
    );
  const caseB =
    await store.createCase(
      "B"
    );

  await store.saveUpload({
    caseId: caseA.caseId,
    filename: "a.pdf",
    mediaType:
      "application/pdf",
    data:
      Buffer.from(
        "%PDF-A"
      ),
    extractArchive: false
  });
  await store.saveUpload({
    caseId: caseB.caseId,
    filename: "b.pdf",
    mediaType:
      "application/pdf",
    data:
      Buffer.from(
        "%PDF-B"
      ),
    extractArchive: false
  });

  const a =
    await store.listUploads(
      caseA.caseId
    );
  const b =
    await store.listUploads(
      caseB.caseId
    );

  const pass =
    a.length === 1 &&
    a[0]?.filename ===
      "a.pdf" &&
    b.length === 1 &&
    b[0]?.filename ===
      "b.pdf";

  process.stdout.write(
    JSON.stringify({
      gate:
        "G35A_CASE_WORKSPACE_BROWSER",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      caseAUploads:
        a.map(
          (item) =>
            item.filename
        ),
      caseBUploads:
        b.map(
          (item) =>
            item.filename
        ),
      rawFileBytesExposedByList:
        false
    }, null, 2) + "\n"
  );

  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  await rm(
    root,
    {
      recursive: true,
      force: true
    }
  );
}

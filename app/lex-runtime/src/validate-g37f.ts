import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here =
  path.dirname(
    fileURLToPath(import.meta.url)
  );
const repo =
  path.resolve(
    here,
    "../../.."
  );
const read =
  (relative: string) =>
    fs.readFileSync(
      path.join(repo, relative),
      "utf8"
    );

const app =
  read("app/lex-web/src/ChatApp.tsx");
const queue =
  read("app/lex-web/src/document-drop-queue.ts");
const test =
  read("app/lex-web/src/document-drop-queue.test.ts");
const tauri =
  read("app/lex-desktop/src-tauri/tauri.conf.json");

const checks = {
  multiFileDrop:
    app.includes(
      "event.dataTransfer.files"
    ) &&
    app.includes(
      "enqueueDocumentDropFiles"
    ),
  boundedSequentialQueue:
    queue.includes(
      "MAX_DOCUMENT_DROP_QUEUE = 20"
    ) &&
    queue.includes(
      "consumeDocumentDropFile"
    ),
  nestedDragCounter:
    app.includes(
      "dragDepth.current += 1"
    ) &&
    app.includes(
      "dragDepth.current - 1"
    ),
  keyboardEquivalent:
    app.includes(
      'type="file"'
    ) &&
    app.includes(
      "multiple"
    ) &&
    app.includes(
      "DOCUMENT_FILE_ACCEPT"
    ) &&
    app.includes(
      "fileInputRef.current?.click()"
    ),
  progressAndAccessibility:
    app.includes(
      'aria-live="polite"'
    ) &&
    app.includes(
      "Przetwarzanie"
    ) &&
    app.includes(
      "documentDropQueue.completed"
    ),
  perFileFeedback:
    app.includes(
      "describeDocumentFile(file)"
    ) &&
    queue.includes(
      "formatBytes"
    ),
  samePrivacyPipeline:
    app.includes(
      "<DocumentPrivacyPanel"
    ) &&
    app.includes(
      "documentDropQueue.files[0]"
    ) &&
    app.includes(
      "onIncomingFileConsumed"
    ),
  crossCaseQueueReset:
    app.includes(
      "createDocumentDropQueueState()"
    ) &&
    app.includes(
      "}, [caseId]);"
    ),
  desktopHtmlDropEnabled:
    tauri.includes(
      '"dragDropEnabled": false'
    ),
  regressionTests:
    test.includes(
      "processes multiple files sequentially"
    ) &&
    test.includes(
      "caps pending files"
    ) &&
    test.includes(
      "per-file size and type metadata"
    )
};

const pass =
  Object.values(checks)
    .every(Boolean);

console.log(
  JSON.stringify(
    {
      gate:
        "G37F_MULTI_FILE_DND_QUEUE",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      checks
    },
    null,
    2
  )
);

if (!pass) {
  process.exitCode = 1;
}

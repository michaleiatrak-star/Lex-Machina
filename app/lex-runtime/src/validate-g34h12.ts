import {
  spawnSync
} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";
import {
  startLocalServer
} from "./http/server.js";

function allBytes(
  root: string
): Buffer {
  const parts:
    Buffer[] = [];
  const walk = (
    directory: string
  ): void => {
    for (
      const entry
      of fs.readdirSync(
        directory,
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
          directory,
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
  if (
    fs.existsSync(root)
  ) {
    walk(root);
  }
  return Buffer.concat(
    parts
  );
}

const here =
  path.dirname(
    fileURLToPath(
      import.meta.url
    )
  );
const repositoryRoot =
  path.resolve(
    here,
    "../../.."
  );
process.env.LEX_SKILLS_PATH =
  path.join(
    repositoryRoot,
    "Wersja rozwojowa rozpakowana"
  );

const dataRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g34h12-data-"
    )
  );
process.env.LEX_DATA_DIR =
  dataRoot;

const zipPath =
  path.join(
    dataRoot,
    "fixture.zip"
  );
const zipScript = String.raw`
import sys, zipfile
target = sys.argv[1]
with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
    z.writestr("dowody/Jan-Kowalski.txt", "tajna notatka klienta 44051401458")
    z.writestr("scan.pdf", b"%PDF secure fixture")
`;
const zipResult =
  spawnSync(
    process.env
      .LEX_STORAGE_PYTHON ??
      "python3",
    [
      "-c",
      zipScript,
      zipPath
    ],
    {
      encoding: "utf8"
    }
  );
if (
  zipResult.status !== 0
) {
  throw new Error(
    "G34H_ZIP_FIXTURE_FAILED:" +
    (
      zipResult.stderr ??
      ""
    )
  );
}
const zipBytes =
  fs.readFileSync(
    zipPath
  );
fs.rmSync(
  zipPath,
  { force: true }
);

const server =
  await startLocalServer({
    host: "127.0.0.1",
    port: 0
  });

let result = {
  encryptedDirectUpload: false,
  encryptedZipUpload: false,
  zipExtractionComplete: false,
  secureTreeNoPlaintext: false,
  legacyIncomingUnused: false,
  rekeyPreservedInventory: false,
  originalFilenameHiddenOnDisk: false,
  extractedNamesHiddenOnDisk: false
};

try {
  const base =
    `http://127.0.0.1:${server.port}`;
  const login =
    await fetch(
      `${base}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          loginName: "admin",
          password: "admin"
        })
      }
    );
  if (!login.ok) {
    throw new Error(
      "G34H_DEFAULT_ADMIN_LOGIN_FAILED"
    );
  }
  const auth =
    await login.json() as {
      sessionToken: string;
      user?: {
        passwordSetupPending?: boolean;
      };
    };
  if (
    !auth.sessionToken ||
    auth.user?.passwordSetupPending !== true
  ) {
    throw new Error(
      "G34H_DEFAULT_ADMIN_CONTRACT_INVALID"
    );
  }
  const headers = {
    Authorization:
      `Bearer ${auth.sessionToken}`
  };

  const create =
    await fetch(
      `${base}/api/cases`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          displayName:
            "G34H secure case"
        })
      }
    );
  if (!create.ok) {
    throw new Error(
      "G34H_CASE_CREATE_FAILED"
    );
  }
  const legalCase =
    await create.json() as {
      caseId: string;
      keyVersion: number;
    };

  const clearPdf =
    Buffer.from(
      "%PDF TAJNE Jan Kowalski PESEL 44051401458"
    );
  const filename =
    "Pozew Jan Kowalski.pdf";
  const direct =
    await fetch(
      `${base}/api/cases/${legalCase.caseId}/files`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type":
            "application/pdf",
          "X-Lex-Filename":
            encodeURIComponent(
              filename
            )
        },
        body: clearPdf
      }
    );
  if (!direct.ok) {
    throw new Error(
      "G34H_DIRECT_UPLOAD_FAILED:" +
      await direct.text()
    );
  }
  const directStored =
    await direct.json() as {
      uploadId: string;
      storage?: string;
    };
  result.encryptedDirectUpload =
    directStored.storage ===
      "ENCRYPTED_LME1";

  const zip =
    await fetch(
      `${base}/api/cases/${legalCase.caseId}/files`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type":
            "application/zip",
          "X-Lex-Filename":
            encodeURIComponent(
              "Akta Jan Kowalski.zip"
            )
        },
        body: zipBytes
      }
    );
  if (!zip.ok) {
    throw new Error(
      "G34H_ZIP_UPLOAD_FAILED:" +
      await zip.text()
    );
  }
  const zipStored =
    await zip.json() as {
      storage?: string;
      archiveExtractionStatus?:
        string;
      extracted?: Array<{
        relativePath: string;
      }>;
    };
  result.encryptedZipUpload =
    zipStored.storage ===
      "ENCRYPTED_LME1";
  result.zipExtractionComplete =
    zipStored
      .archiveExtractionStatus ===
        "COMPLETE" &&
    Array.isArray(
      zipStored.extracted
    ) &&
    zipStored.extracted.length ===
      2;

  const listBefore =
    await fetch(
      `${base}/api/cases/${legalCase.caseId}/files`,
      {
        headers
      }
    );
  if (!listBefore.ok) {
    throw new Error(
      "G34H_LIST_FAILED"
    );
  }
  const before =
    await listBefore.json() as {
      uploads: Array<{
        uploadId: string;
        filename: string;
        storage?: string;
      }>;
    };

  const caseRoot =
    path.join(
      dataRoot,
      "cases",
      legalCase.caseId
    );
  const secureRoot =
    path.join(
      caseRoot,
      "secure"
    );
  const bytes =
    allBytes(
      secureRoot
    );
  const forbidden = [
    filename,
    "Akta Jan Kowalski.zip",
    "Jan-Kowalski.txt",
    "tajna notatka klienta",
    "44051401458",
    "%PDF TAJNE Jan Kowalski"
  ];
  result.secureTreeNoPlaintext =
    forbidden.every(
      (value) =>
        !bytes.includes(
          Buffer.from(
            value,
            "utf8"
          )
        )
    );
  result.originalFilenameHiddenOnDisk =
    !bytes.includes(
      Buffer.from(
        filename,
        "utf8"
      )
    );
  result.extractedNamesHiddenOnDisk =
    !bytes.includes(
      Buffer.from(
        "Jan-Kowalski.txt",
        "utf8"
      )
    );

  const legacyIncoming =
    path.join(
      caseRoot,
      "incoming"
    );
  result.legacyIncomingUnused =
    fs.existsSync(
      legacyIncoming
    )
      ? fs.readdirSync(
          legacyIncoming
        ).length === 0
      : true;

  const rotate =
    await fetch(
      `${base}/api/cases/${legalCase.caseId}/rotate-key`,
      {
        method: "POST",
        headers
      }
    );
  if (!rotate.ok) {
    throw new Error(
      "G34H_REKEY_FAILED:" +
      await rotate.text()
    );
  }
  const rotated =
    await rotate.json() as {
      keyVersion: number;
    };

  const listAfter =
    await fetch(
      `${base}/api/cases/${legalCase.caseId}/files`,
      {
        headers
      }
    );
  if (!listAfter.ok) {
    throw new Error(
      "G34H_LIST_AFTER_REKEY_FAILED"
    );
  }
  const after =
    await listAfter.json() as {
      uploads: Array<{
        uploadId: string;
        filename: string;
        storage?: string;
      }>;
    };
  result.rekeyPreservedInventory =
    rotated.keyVersion === 2 &&
    before.uploads.length ===
      after.uploads.length &&
    before.uploads
      .map(
        (item) =>
          item.uploadId
      )
      .sort()
      .join(",") ===
    after.uploads
      .map(
        (item) =>
          item.uploadId
      )
      .sort()
      .join(",") &&
    after.uploads.every(
      (item) =>
        item.storage ===
          "ENCRYPTED_LME1"
    );

  clearPdf.fill(0);
} finally {
  zipBytes.fill(0);
  await server.close();
}

const pass =
  Object.values(result)
    .every(Boolean);

process.stdout.write(
  JSON.stringify({
    gate:
      "G34H12_SECURE_INCOMING_ZIP_AT_REST",
    result:
      pass
        ? "PASS"
        : "BLOCKED",
    ...result,
    plaintextWorkdirCleanup:
      true,
    fullG34HClaimed:
      false,
    remaining:
      [
        "G34H3_DOCUMENT_PERSISTENCE",
        "G34H4_ARTIFACT_PERSISTENCE",
        "G34H5_LEGACY_MIGRATION"
      ]
  }, null, 2) + "\n"
);

fs.rmSync(
  dataRoot,
  {
    recursive: true,
    force: true
  }
);

if (!pass) {
  process.exitCode = 1;
}

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  mkdtemp,
  rm
} from "node:fs/promises";
import {
  LocalAuthStore
} from "./auth/store.js";
import {
  LocalAuthService
} from "./auth/service.js";
import {
  AuthSessionManager
} from "./auth/session-manager.js";
import {
  LocalCaseFileStore
} from "./case-file-store.js";
import {
  LocalCaseAccessService
} from "./case-access.js";

const root =
  await mkdtemp(
    path.join(
      os.tmpdir(),
      "lex-p4b-validate-"
    )
  );
const password =
  "P4B walidacja bezpieczne haslo 2026";

try {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      store,
      {
        sessionManager:
          new AuthSessionManager({
            scheduleExpiryTimers:
              false
          }),
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  const files =
    new LocalCaseFileStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      store,
      auth,
      files
    );

  const owner =
    await auth.bootstrap({
      loginName: "owner",
      displayName: "Owner",
      password
    });
  const actor = {
    user: owner.user,
    session: owner.session
  };
  const localCase =
    await cases.createCase(
      actor,
      "Przed zmianą"
    );

  const renamed =
    await cases.renameCase(
      actor,
      localCase.caseId,
      "Po zmianie"
    );
  const archived =
    await cases.setCaseArchived(
      actor,
      localCase.caseId,
      true
    );

  let archivedWriteBlocked =
    false;
  try {
    cases.assertAccess(
      actor,
      localCase.caseId,
      "WRITE"
    );
  } catch (error) {
    archivedWriteBlocked =
      error instanceof Error &&
      error.message ===
        "CASE_ARCHIVED";
  }

  const unarchived =
    await cases.setCaseArchived(
      actor,
      localCase.caseId,
      false
    );
  const metadata =
    await files.readCaseMetadata(
      localCase.caseId
    );

  let wrongPasswordBlocked =
    false;
  try {
    await cases.deleteCase(
      actor,
      localCase.caseId,
      "wrong"
    );
  } catch {
    wrongPasswordBlocked =
      true;
  }
  const survivedWrongPassword =
    store.getCase(
      localCase.caseId
    ) !== null &&
    fs.existsSync(
      path.join(
        root,
        "cases",
        localCase.caseId
      )
    );

  const deleted =
    await cases.deleteCase(
      actor,
      localCase.caseId,
      password
    );
  const registrationGone =
    store.getCase(
      localCase.caseId
    ) === null;
  const aclGone =
    store.listCaseAccess(
      localCase.caseId
    ).length === 0;
  const filesGone =
    !fs.existsSync(
      path.join(
        root,
        "cases",
        localCase.caseId
      )
    );

  const pass =
    renamed.displayName ===
      "Po zmianie" &&
    Boolean(
      archived.archivedAt
    ) &&
    archivedWriteBlocked &&
    !unarchived.archivedAt &&
    metadata.displayName ===
      "Po zmianie" &&
    !metadata.archivedAt &&
    wrongPasswordBlocked &&
    survivedWrongPassword &&
    deleted.caseId ===
      localCase.caseId &&
    registrationGone &&
    aclGone &&
    filesGone;

  process.stdout.write(
    JSON.stringify({
      gate:
        "P4B_CASE_LIFECYCLE",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      renamePersisted:
        renamed.displayName ===
          "Po zmianie" &&
        metadata.displayName ===
          "Po zmianie",
      archiveStatePersisted:
        Boolean(
          archived.archivedAt
        ),
      archivedWriteBlocked,
      unarchiveRestoresWrite:
        !unarchived.archivedAt,
      freshPasswordRequired:
        wrongPasswordBlocked &&
        survivedWrongPassword,
      deleteRemovedRegistration:
        registrationGone,
      deleteRemovedAcl:
        aclGone,
      deleteRemovedCaseDirectory:
        filesGone,
      secureEraseClaimed:
        false
    }, null, 2) +
    "\n"
  );

  auth.close();
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

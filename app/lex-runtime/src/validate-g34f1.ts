import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LocalAuthStore } from "./auth/store.js";
import { LocalAuthService } from "./auth/service.js";
import { AuthSessionManager } from "./auth/session-manager.js";
import { LocalCaseFileStore } from "./case-file-store.js";
import { LocalCaseAccessService } from "./case-access.js";
import {
  DeanonymizationReauthorizationManager,
  type DeanonymizationTargetState
} from "./auth/reauthorization.js";

const root = fs.mkdtempSync(
  path.join(
    os.tmpdir(),
    "lex-g34f1-validate-"
  )
);
let now =
  Date.parse(
    "2026-09-16T12:00:00.000Z"
  );

try {
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const clock = {
    now: () => now
  };
  const auth =
    new LocalAuthService(
      store,
      {
        clock,
        sessionManager:
          new AuthSessionManager({
            clock,
            scheduleExpiryTimers:
              false,
            policy: {
              idleTimeoutMs:
                60 * 60 * 1000,
              overallTimeoutMs:
                8 * 60 * 60 * 1000
            }
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
  const password =
    "G34F1 walidator bezpieczne haslo 2026";
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
  const legalCase =
    await cases.createCase(
      actor,
      "G34F1"
    );

  const original:
    DeanonymizationTargetState = {
      caseId:
        legalCase.caseId,
      artifactId:
        "artifact_" +
        "a".repeat(32),
      artifactFormat:
        "docx",
      state:
        "TOKENIZED_VALIDATED",
      tokenizedSha256:
        "b".repeat(64),
      vaultGeneration: 9,
      caseKeyVersion:
        legalCase.keyVersion
    };
  let target = {
    ...original
  };
  const manager =
    new DeanonymizationReauthorizationManager(
      auth,
      cases,
      store,
      {
        resolve:
          async (
            caseId,
            artifactId
          ) =>
            caseId ===
              target.caseId &&
            artifactId ===
              target.artifactId
              ? { ...target }
              : null
      },
      {
        clock,
        intentTtlMs:
          5 * 60 * 1000,
        grantTtlMs: 1000
      }
    );

  const intent =
    await manager.createIntent(
      actor,
      legalCase.caseId,
      original.artifactId
    );
  const authorized =
    await manager.authorizeIntent(
      actor,
      intent.intentId,
      password
    );

  target = {
    ...target,
    tokenizedSha256:
      "c".repeat(64)
  };
  let changedTargetBlocked =
    false;
  try {
    await manager.consumeGrant(
      {
        user: actor.user,
        session:
          authorized.session
      },
      authorized.grant.grantId
    );
  } catch {
    changedTargetBlocked =
      true;
  }

  target = {
    ...original
  };
  await manager.consumeGrant(
    {
      user: actor.user,
      session:
        authorized.session
    },
    authorized.grant.grantId
  );

  let secondUseBlocked =
    false;
  try {
    await manager.consumeGrant(
      {
        user: actor.user,
        session:
          authorized.session
      },
      authorized.grant.grantId
    );
  } catch {
    secondUseBlocked = true;
  }

  const secondIntent =
    await manager.createIntent(
      {
        user: actor.user,
        session:
          authorized.session
      },
      legalCase.caseId,
      original.artifactId
    );
  const secondAuth =
    await manager.authorizeIntent(
      {
        user: actor.user,
        session:
          authorized.session
      },
      secondIntent.intentId,
      password
    );
  now += 1001;
  let expiredBlocked = false;
  try {
    await manager.consumeGrant(
      {
        user: actor.user,
        session:
          secondAuth.session
      },
      secondAuth.grant.grantId
    );
  } catch {
    expiredBlocked = true;
  }

  now += 1;
  const thirdIntent =
    await manager.createIntent(
      {
        user: actor.user,
        session:
          secondAuth.session
      },
      legalCase.caseId,
      original.artifactId
    );
  const thirdAuth =
    await manager.authorizeIntent(
      {
        user: actor.user,
        session:
          secondAuth.session
      },
      thirdIntent.intentId,
      password
    );
  auth.lockSession(
    thirdAuth.session.sessionId
  );
  let sessionRevocationBlocked =
    false;
  try {
    await manager.consumeGrant(
      {
        user: actor.user,
        session:
          thirdAuth.session
      },
      thirdAuth.grant.grantId
    );
  } catch {
    sessionRevocationBlocked =
      true;
  }

  const pass =
    intent.status ===
      "PENDING" &&
    authorized.intent.status ===
      "AUTHORIZED" &&
    changedTargetBlocked &&
    secondUseBlocked &&
    expiredBlocked &&
    sessionRevocationBlocked;

  process.stdout.write(
    JSON.stringify({
      gate:
        "G34F1_TRANSACTION_REAUTH_FOUNDATION",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      freshPasswordRequired:
        true,
      exactTargetChangeBlocked:
        changedTargetBlocked,
      oneUse:
        secondUseBlocked,
      expiryBlocked:
        expiredBlocked,
      sessionRevocationBlocked,
      fullG34FClaimed: false,
      pendingIntegration:
        "G31D_G31E_DEANONYMIZATION_PATH"
    }, null, 2) + "\n"
  );

  auth.close();
  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  fs.rmSync(
    root,
    {
      recursive: true,
      force: true
    }
  );
}

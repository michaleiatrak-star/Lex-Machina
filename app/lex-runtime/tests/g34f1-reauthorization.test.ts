import {
  createHash
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
import { LocalAuthStore } from "../src/auth/store.js";
import { LocalAuthService } from "../src/auth/service.js";
import { AuthSessionManager } from "../src/auth/session-manager.js";
import { LocalCaseFileStore } from "../src/case-file-store.js";
import { LocalCaseAccessService } from "../src/case-access.js";
import {
  DeanonymizationReauthorizationManager,
  type DeanonymizationTargetResolver,
  type DeanonymizationTargetState
} from "../src/auth/reauthorization.js";

const roots: string[] = [];

function root(): string {
  const value =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g34f1-"
      )
    );
  roots.push(value);
  return value;
}

function fixture(
  nowRef: { value: number }
) {
  const dataRoot = root();
  const store =
    new LocalAuthStore({
      rootDir: dataRoot
    });
  const clock = {
    now: () => nowRef.value
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
      rootDir: dataRoot
    });
  const cases =
    new LocalCaseAccessService(
      store,
      auth,
      files
    );
  return {
    store,
    auth,
    cases
  };
}

class MutableResolver
implements DeanonymizationTargetResolver {
  constructor(
    public target:
      DeanonymizationTargetState
  ) {}

  async resolve(
    caseId: string,
    artifactId: string
  ): Promise<
    DeanonymizationTargetState | null
  > {
    return (
      caseId ===
        this.target.caseId &&
      artifactId ===
        this.target.artifactId
    )
      ? { ...this.target }
      : null;
  }
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

describe("G34F1 transaction reauthorization foundation", () => {
  it("binds a one-use grant to exact artifact state and requires fresh password", async () => {
    const now = {
      value: Date.parse(
        "2026-09-16T10:00:00.000Z"
      )
    };
    const current =
      fixture(now);
    const password =
      "G34F1 bezpieczne haslo wlasciciela 2026";
    const owner =
      await current.auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password
      });
    const actor = {
      user: owner.user,
      session: owner.session
    };
    const legalCase =
      await current.cases
        .createCase(
          actor,
          "Reauth"
        );
    const artifactId =
      "artifact_" +
      "1".repeat(32);
    const target:
      DeanonymizationTargetState = {
        caseId:
          legalCase.caseId,
        artifactId,
        artifactFormat:
          "docx",
        state:
          "TOKENIZED_VALIDATED",
        tokenizedSha256:
          createHash("sha256")
            .update(
              "tokenized-docx"
            )
            .digest("hex"),
        vaultGeneration: 7,
        caseKeyVersion:
          legalCase.keyVersion,
        deanonymizationKeyBinding:
          "b".repeat(64)
    };
    const resolver =
      new MutableResolver(
        target
      );
    const manager =
      new DeanonymizationReauthorizationManager(
        current.auth,
        current.cases,
        current.store,
        resolver,
        {
          clock: {
            now: () =>
              now.value
          },
          intentTtlMs:
            5 * 60 * 1000,
          grantTtlMs:
            90 * 1000
        }
      );

    const intent =
      await manager.createIntent(
        actor,
        legalCase.caseId,
        artifactId
      );
    expect(
      intent.status
    ).toBe("PENDING");

    await expect(
      manager.authorizeIntent(
        actor,
        intent.intentId,
        "Bledne bezpieczne haslo 2026"
      )
    ).rejects.toMatchObject({
      code:
        "INVALID_CREDENTIALS"
    });

    const authorized =
      await manager.authorizeIntent(
        actor,
        intent.intentId,
        password
      );
    expect(
      authorized.intent.status
    ).toBe("AUTHORIZED");
    expect(
      authorized.grant
        .deanonymizationKeyBinding
    ).toBe(
      target
        .deanonymizationKeyBinding
    );
    expect(
      Date.parse(
        authorized.session
          .lastFullAuthenticationAt
      )
    ).toBe(now.value);

    resolver.target = {
      ...resolver.target,
      vaultGeneration: 8
    };
    await expect(
      manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            authorized.session
        },
        authorized.grant.grantId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_TARGET_CHANGED"
    });

    resolver.target = {
      ...target,
      deanonymizationKeyBinding:
        "c".repeat(64)
    };
    await expect(
      manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            authorized.session
        },
        authorized.grant.grantId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_TARGET_CHANGED"
    });

    resolver.target = {
      ...target
    };
    const consumed =
      await manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            authorized.session
        },
        authorized.grant.grantId
      );
    expect(consumed).toEqual(
      target
    );

    await expect(
      manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            authorized.session
        },
        authorized.grant.grantId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_GRANT_ALREADY_USED"
    });

    current.auth.close();
  });

  it("rejects a tokenized artifact that has no deanonymization-key binding", async () => {
    const now = {
      value: Date.parse(
        "2026-09-16T10:30:00.000Z"
      )
    };
    const current =
      fixture(now);
    const password =
      "G34F1 brak bindingu 2026";
    const owner =
      await current.auth.bootstrap({
        loginName:
          "owner-no-binding",
        displayName:
          "Owner no binding",
        password
      });
    const actor = {
      user: owner.user,
      session: owner.session
    };
    const legalCase =
      await current.cases
        .createCase(
          actor,
          "Reauth no binding"
        );
    const resolver =
      new MutableResolver({
        caseId:
          legalCase.caseId,
        artifactId:
          "artifact_" +
          "3".repeat(32),
        artifactFormat:
          "docx",
        state:
          "TOKENIZED_VALIDATED",
        tokenizedSha256:
          "e".repeat(64),
        vaultGeneration: 1,
        caseKeyVersion:
          legalCase.keyVersion
      });
    const manager =
      new DeanonymizationReauthorizationManager(
        current.auth,
        current.cases,
        current.store,
        resolver,
        {
          clock: {
            now: () =>
              now.value
          }
        }
      );

    await expect(
      manager.createIntent(
        actor,
        legalCase.caseId,
        resolver.target
          .artifactId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_TARGET_NOT_READY"
    });

    current.auth.close();
  });

  it("expires grants and revokes them automatically with the session", async () => {
    const now = {
      value: Date.parse(
        "2026-09-16T11:00:00.000Z"
      )
    };
    const current =
      fixture(now);
    const password =
      "G34F1 drugie bezpieczne haslo 2026";
    const owner =
      await current.auth.bootstrap({
        loginName: "owner2",
        displayName: "Owner 2",
        password
      });
    const actor = {
      user: owner.user,
      session: owner.session
    };
    const legalCase =
      await current.cases
        .createCase(
          actor,
          "Reauth 2"
        );
    const target:
      DeanonymizationTargetState = {
        caseId:
          legalCase.caseId,
        artifactId:
          "artifact_" +
          "2".repeat(32),
        artifactFormat:
          "odt",
        state:
          "TOKENIZED_VALIDATED",
        tokenizedSha256:
          "a".repeat(64),
        vaultGeneration: 3,
        caseKeyVersion:
          legalCase.keyVersion,
        deanonymizationKeyBinding:
          "d".repeat(64)
    };
    const resolver =
      new MutableResolver(
        target
      );
    const manager =
      new DeanonymizationReauthorizationManager(
        current.auth,
        current.cases,
        current.store,
        resolver,
        {
          clock: {
            now: () =>
              now.value
          },
          grantTtlMs: 1000
        }
      );

    const firstIntent =
      await manager.createIntent(
        actor,
        legalCase.caseId,
        target.artifactId
      );
    const firstAuth =
      await manager.authorizeIntent(
        actor,
        firstIntent.intentId,
        password
      );
    now.value += 1001;
    await expect(
      manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            firstAuth.session
        },
        firstAuth.grant.grantId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_GRANT_EXPIRED"
    });

    now.value += 1;
    const secondIntent =
      await manager.createIntent(
        {
          user:
            actor.user,
          session:
            firstAuth.session
        },
        legalCase.caseId,
        target.artifactId
      );
    const secondAuth =
      await manager.authorizeIntent(
        {
          user:
            actor.user,
          session:
            firstAuth.session
        },
        secondIntent.intentId,
        password
      );

    current.auth.lockSession(
      secondAuth.session
        .sessionId
    );

    await expect(
      manager.consumeGrant(
        {
          user:
            actor.user,
          session:
            secondAuth.session
        },
        secondAuth.grant.grantId
      )
    ).rejects.toMatchObject({
      code:
        "REAUTH_GRANT_REVOKED"
    });

    current.auth.close();
  });
});

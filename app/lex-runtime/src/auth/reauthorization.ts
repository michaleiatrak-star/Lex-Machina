import {
  randomBytes
} from "node:crypto";
import type {
  AuthenticatedContext,
  AuthSessionView
} from "./types.js";
import type {
  AuthService
} from "./service.js";
import type {
  LocalAuthStore
} from "./store.js";
import type {
  LocalCaseAccessService
} from "../case-access.js";

export type DeanonymizationArtifactFormat =
  | "docx"
  | "odt";

export type DeanonymizationTargetState = {
  caseId: string;
  artifactId: string;
  artifactFormat:
    DeanonymizationArtifactFormat;
  state: "TOKENIZED_VALIDATED";
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  deanonymizationKeyBinding?: string;
};

export interface DeanonymizationTargetResolver {
  resolve(
    caseId: string,
    artifactId: string
  ): Promise<
    DeanonymizationTargetState | null
  >;
}

export type DeanonymizationIntentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CONSUMED"
  | "REVOKED"
  | "EXPIRED";

export type DeanonymizationIntent = {
  intentId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  artifactFormat:
    DeanonymizationArtifactFormat;
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  deanonymizationKeyBinding?: string;
  purpose:
    "DEANONYMIZE_AND_EXPORT";
  createdAt: string;
  expiresAt: string;
  status:
    DeanonymizationIntentStatus;
};

export type DeanonymizationGrant = {
  grantId: string;
  intentId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  artifactFormat:
    DeanonymizationArtifactFormat;
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  deanonymizationKeyBinding?: string;
  purpose:
    "DEANONYMIZE_AND_EXPORT";
  issuedAt: string;
  expiresAt: string;
  consumedAt?: string;
  revokedAt?: string;
};

export type ReauthorizationClock = {
  now(): number;
};

const SYSTEM_CLOCK:
  ReauthorizationClock = {
    now: () => Date.now()
  };

export type ReauthorizationErrorCode =
  | "REAUTH_INTENT_NOT_FOUND"
  | "REAUTH_INTENT_EXPIRED"
  | "REAUTH_INTENT_NOT_PENDING"
  | "REAUTH_SESSION_MISMATCH"
  | "REAUTH_TARGET_NOT_READY"
  | "REAUTH_TARGET_CHANGED"
  | "REAUTH_GRANT_NOT_FOUND"
  | "REAUTH_GRANT_EXPIRED"
  | "REAUTH_GRANT_ALREADY_USED"
  | "REAUTH_GRANT_REVOKED";

export class ReauthorizationError
extends Error {
  constructor(
    readonly code:
      ReauthorizationErrorCode
  ) {
    super(code);
    this.name =
      "ReauthorizationError";
  }
}

function validArtifactId(
  value: string
): boolean {
  return /^artifact_[a-f0-9]{32}$/
    .test(value);
}

function validSha256(
  value: string
): boolean {
  return /^[a-f0-9]{64}$/
    .test(value);
}

function exactTarget(
  intent:
    Pick<
      DeanonymizationIntent,
      | "caseId"
      | "artifactId"
      | "artifactFormat"
      | "tokenizedSha256"
      | "vaultGeneration"
      | "caseKeyVersion"
      | "deanonymizationKeyBinding"
    >,
  current:
    DeanonymizationTargetState
): boolean {
  return (
    current.state ===
      "TOKENIZED_VALIDATED" &&
    current.caseId ===
      intent.caseId &&
    current.artifactId ===
      intent.artifactId &&
    current.artifactFormat ===
      intent.artifactFormat &&
    current.tokenizedSha256 ===
      intent.tokenizedSha256 &&
    current.vaultGeneration ===
      intent.vaultGeneration &&
    current.caseKeyVersion ===
      intent.caseKeyVersion &&
    (
      current
        .deanonymizationKeyBinding ??
        null
    ) ===
      (
        intent
          .deanonymizationKeyBinding ??
        null
      )
  );
}

export class DeanonymizationReauthorizationManager {
  private readonly intents =
    new Map<
      string,
      DeanonymizationIntent
    >();
  private readonly grants =
    new Map<
      string,
      DeanonymizationGrant
    >();
  private readonly clock:
    ReauthorizationClock;
  private readonly intentTtlMs:
    number;
  private readonly grantTtlMs:
    number;

  constructor(
    private readonly auth:
      Pick<
        AuthService,
        | "reauthenticate"
        | "onSessionRevoked"
      >,
    private readonly cases:
      Pick<
        LocalCaseAccessService,
        "assertAccess"
      >,
    private readonly store:
      Pick<
        LocalAuthStore,
        "recordSecurityEvent"
      >,
    private readonly resolver:
      DeanonymizationTargetResolver,
    options?: {
      clock?:
        ReauthorizationClock;
      intentTtlMs?: number;
      grantTtlMs?: number;
    }
  ) {
    this.clock =
      options?.clock ??
      SYSTEM_CLOCK;
    this.intentTtlMs =
      options?.intentTtlMs ??
      5 * 60 * 1000;
    this.grantTtlMs =
      options?.grantTtlMs ??
      90 * 1000;
    this.auth
      .onSessionRevoked(
        (event) =>
          this.revokeSession(
            event.sessionId
          )
      );
  }

  async createIntent(
    actor: AuthenticatedContext,
    caseId: string,
    artifactId: string
  ): Promise<
    DeanonymizationIntent
  > {
    this.cases.assertAccess(
      actor,
      caseId,
      "REIDENTIFY"
    );
    if (
      !validArtifactId(
        artifactId
      )
    ) {
      throw new ReauthorizationError(
        "REAUTH_TARGET_NOT_READY"
      );
    }

    const target =
      await this.resolver.resolve(
        caseId,
        artifactId
      );
    if (
      !target ||
      target.caseId !==
        caseId ||
      target.artifactId !==
        artifactId ||
      !["docx", "odt"].includes(
        target.artifactFormat
      ) ||
      target.state !==
        "TOKENIZED_VALIDATED" ||
      !validSha256(
        target.tokenizedSha256
      ) ||
      !Number.isInteger(
        target.vaultGeneration
      ) ||
      target.vaultGeneration < 1 ||
      !Number.isInteger(
        target.caseKeyVersion
      ) ||
      target.caseKeyVersion < 1 ||
      typeof target
        .deanonymizationKeyBinding !==
        "string" ||
      !validSha256(
        target
          .deanonymizationKeyBinding
      )
    ) {
      throw new ReauthorizationError(
        "REAUTH_TARGET_NOT_READY"
      );
    }

    const now =
      this.clock.now();
    const intent:
      DeanonymizationIntent = {
        intentId:
          "intent_" +
          randomBytes(16)
            .toString("hex"),
        sessionId:
          actor.session.sessionId,
        userId:
          actor.user.userId,
        caseId,
        artifactId,
        artifactFormat:
          target.artifactFormat,
        tokenizedSha256:
          target.tokenizedSha256,
        vaultGeneration:
          target.vaultGeneration,
        caseKeyVersion:
          target.caseKeyVersion,
        ...(target
          .deanonymizationKeyBinding
          ? {
              deanonymizationKeyBinding:
                target
                  .deanonymizationKeyBinding
            }
          : {}),
        purpose:
          "DEANONYMIZE_AND_EXPORT",
        createdAt:
          new Date(
            now
          ).toISOString(),
        expiresAt:
          new Date(
            now +
            this.intentTtlMs
          ).toISOString(),
        status: "PENDING"
      };
    this.intents.set(
      intent.intentId,
      intent
    );
    this.audit(
      actor.user.userId,
      "deanonymization_intent_created",
      "PASS",
      {
        intentId:
          intent.intentId,
        caseId,
        artifactId
      }
    );
    return {
      ...intent
    };
  }

  async authorizeIntent(
    actor: AuthenticatedContext,
    intentId: string,
    password: string
  ): Promise<{
    intent:
      DeanonymizationIntent;
    grant:
      DeanonymizationGrant;
    session:
      AuthSessionView;
  }> {
    const intent =
      this.requirePendingIntent(
        actor,
        intentId
      );
    this.cases.assertAccess(
      actor,
      intent.caseId,
      "REIDENTIFY"
    );

    const current =
      await this.resolver.resolve(
        intent.caseId,
        intent.artifactId
      );
    if (
      !current ||
      !exactTarget(
        intent,
        current
      )
    ) {
      throw new ReauthorizationError(
        "REAUTH_TARGET_CHANGED"
      );
    }

    const session =
      await this.auth
        .reauthenticate(
          actor,
          password,
          "DEANONYMIZE_AND_EXPORT"
        );

    const now =
      this.clock.now();
    const grant:
      DeanonymizationGrant = {
        grantId:
          "grant_" +
          randomBytes(16)
            .toString("hex"),
        intentId:
          intent.intentId,
        sessionId:
          intent.sessionId,
        userId:
          intent.userId,
        caseId:
          intent.caseId,
        artifactId:
          intent.artifactId,
        artifactFormat:
          intent.artifactFormat,
        tokenizedSha256:
          intent.tokenizedSha256,
        vaultGeneration:
          intent.vaultGeneration,
        caseKeyVersion:
          intent.caseKeyVersion,
        ...(intent
          .deanonymizationKeyBinding
          ? {
              deanonymizationKeyBinding:
                intent
                  .deanonymizationKeyBinding
            }
          : {}),
        purpose:
          "DEANONYMIZE_AND_EXPORT",
        issuedAt:
          new Date(
            now
          ).toISOString(),
        expiresAt:
          new Date(
            now +
            this.grantTtlMs
          ).toISOString()
      };
    intent.status =
      "AUTHORIZED";
    this.grants.set(
      grant.grantId,
      grant
    );
    this.audit(
      actor.user.userId,
      "deanonymization_reauth_success",
      "PASS",
      {
        intentId:
          intent.intentId,
        grantId:
          grant.grantId,
        caseId:
          intent.caseId,
        artifactId:
          intent.artifactId
      }
    );
    return {
      intent: {
        ...intent
      },
      grant: {
        ...grant
      },
      session
    };
  }

  async consumeGrant(
    actor: AuthenticatedContext,
    grantId: string
  ): Promise<
    DeanonymizationTargetState
  > {
    const grant =
      this.grants.get(
        grantId
      );
    if (!grant) {
      throw new ReauthorizationError(
        "REAUTH_GRANT_NOT_FOUND"
      );
    }
    if (
      grant.sessionId !==
        actor.session.sessionId ||
      grant.userId !==
        actor.user.userId
    ) {
      throw new ReauthorizationError(
        "REAUTH_SESSION_MISMATCH"
      );
    }
    if (grant.revokedAt) {
      throw new ReauthorizationError(
        "REAUTH_GRANT_REVOKED"
      );
    }
    if (grant.consumedAt) {
      throw new ReauthorizationError(
        "REAUTH_GRANT_ALREADY_USED"
      );
    }
    const now =
      this.clock.now();
    if (
      Date.parse(
        grant.expiresAt
      ) <= now
    ) {
      throw new ReauthorizationError(
        "REAUTH_GRANT_EXPIRED"
      );
    }

    this.cases.assertAccess(
      actor,
      grant.caseId,
      "REIDENTIFY"
    );
    const current =
      await this.resolver.resolve(
        grant.caseId,
        grant.artifactId
      );
    if (
      !current ||
      !exactTarget(
        grant,
        current
      )
    ) {
      throw new ReauthorizationError(
        "REAUTH_TARGET_CHANGED"
      );
    }

    // Consume before the caller is allowed to unlock/decrypt the vault.
    grant.consumedAt =
      new Date(
        now
      ).toISOString();
    const intent =
      this.intents.get(
        grant.intentId
      );
    if (intent) {
      intent.status =
        "CONSUMED";
    }
    this.audit(
      actor.user.userId,
      "deanonymization_grant_consumed",
      "PASS",
      {
        grantId,
        intentId:
          grant.intentId,
        caseId:
          grant.caseId,
        artifactId:
          grant.artifactId
      }
    );
    return {
      ...current
    };
  }

  revokeSession(
    sessionId: string
  ): void {
    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    for (
      const intent
      of this.intents.values()
    ) {
      if (
        intent.sessionId ===
          sessionId &&
        (
          intent.status ===
            "PENDING" ||
          intent.status ===
            "AUTHORIZED"
        )
      ) {
        intent.status =
          "REVOKED";
      }
    }
    for (
      const grant
      of this.grants.values()
    ) {
      if (
        grant.sessionId ===
          sessionId &&
        !grant.consumedAt &&
        !grant.revokedAt
      ) {
        grant.revokedAt =
          now;
      }
    }
  }

  getIntentForTest(
    intentId: string
  ): DeanonymizationIntent | null {
    const value =
      this.intents.get(
        intentId
      );
    return value
      ? { ...value }
      : null;
  }

  private requirePendingIntent(
    actor: AuthenticatedContext,
    intentId: string
  ): DeanonymizationIntent {
    const intent =
      this.intents.get(
        intentId
      );
    if (!intent) {
      throw new ReauthorizationError(
        "REAUTH_INTENT_NOT_FOUND"
      );
    }
    if (
      intent.sessionId !==
        actor.session.sessionId ||
      intent.userId !==
        actor.user.userId
    ) {
      throw new ReauthorizationError(
        "REAUTH_SESSION_MISMATCH"
      );
    }
    const now =
      this.clock.now();
    if (
      Date.parse(
        intent.expiresAt
      ) <= now
    ) {
      intent.status =
        "EXPIRED";
      throw new ReauthorizationError(
        "REAUTH_INTENT_EXPIRED"
      );
    }
    if (
      intent.status !==
        "PENDING"
    ) {
      throw new ReauthorizationError(
        "REAUTH_INTENT_NOT_PENDING"
      );
    }
    return intent;
  }

  private audit(
    userId: string,
    eventType: string,
    result: string,
    metadata:
      Record<string, unknown>
  ): void {
    this.store
      .recordSecurityEvent({
        eventId:
          "event_" +
          randomBytes(16)
            .toString("hex"),
        userId,
        eventType,
        occurredAt:
          new Date(
            this.clock.now()
          ).toISOString(),
        result,
        metadata
      });
  }
}

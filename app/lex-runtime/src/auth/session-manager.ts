import {
  createHash,
  randomBytes
} from "node:crypto";
import type {
  AuthClock,
  AuthSessionPolicy,
  AuthSessionView
} from "./types.js";
import {
  DEFAULT_AUTH_SESSION_POLICY
} from "./types.js";

type SessionExpiryReason =
  | "IDLE"
  | "OVERALL";

export type SessionRevocationReason =
  | "IDLE_TIMEOUT"
  | "OVERALL_TIMEOUT"
  | "USER_LOCK"
  | "LOGOUT"
  | "AUTH_EPOCH"
  | "USER_REVOKED"
  | "SERVICE_CLOSE";

export type SessionRevocationEvent = {
  sessionId: string;
  userId: string;
  reason: SessionRevocationReason;
  occurredAt: string;
};

export type SessionLookup =
  | {
      status: "OK";
      session: AuthSessionView;
    }
  | {
      status:
        | "MISSING"
        | "IDLE_EXPIRED"
        | "OVERALL_EXPIRED";
    };

type InternalSession = {
  sessionId: string;
  userId: string;
  authEpoch: number;
  createdAtMs: number;
  lastActivityAtMs: number;
  lastFullAuthenticationAtMs: number;
  idleExpiresAtMs: number;
  overallExpiresAtMs: number;
  userMasterKey: Buffer;
  idleTimer?: NodeJS.Timeout;
  overallTimer?: NodeJS.Timeout;
};

export type CreatedSession = {
  token: string;
  session: AuthSessionView;
};

const SYSTEM_CLOCK: AuthClock = {
  now: () => Date.now()
};

function tokenDigest(
  token: string
): string {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function iso(value: number): string {
  return new Date(value).toISOString();
}

export class AuthSessionManager {
  private readonly byDigest =
    new Map<string, InternalSession>();
  private readonly digestBySessionId =
    new Map<string, string>();
  private readonly policy:
    AuthSessionPolicy;
  private readonly clock: AuthClock;
  private readonly scheduleExpiryTimers:
    boolean;
  private revocationListener?:
    (event: SessionRevocationEvent) => void;

  constructor(options?: {
    policy?: Partial<AuthSessionPolicy>;
    clock?: AuthClock;
    scheduleExpiryTimers?: boolean;
  }) {
    this.policy = {
      ...DEFAULT_AUTH_SESSION_POLICY,
      ...options?.policy
    };
    this.clock =
      options?.clock ?? SYSTEM_CLOCK;
    this.scheduleExpiryTimers =
      options?.scheduleExpiryTimers ??
      true;
  }

  setRevocationListener(
    listener:
      | ((event: SessionRevocationEvent) => void)
      | undefined
  ): void {
    this.revocationListener =
      listener;
  }

  create(args: {
    userId: string;
    authEpoch: number;
    userMasterKey: Buffer;
  }): CreatedSession {
    const now = this.clock.now();
    const token =
      randomBytes(32).toString(
        "base64url"
      );
    const digest =
      tokenDigest(token);
    const session: InternalSession = {
      sessionId:
        "authsess_" +
        randomBytes(16).toString("hex"),
      userId: args.userId,
      authEpoch: args.authEpoch,
      createdAtMs: now,
      lastActivityAtMs: now,
      lastFullAuthenticationAtMs: now,
      idleExpiresAtMs:
        now + this.policy.idleTimeoutMs,
      overallExpiresAtMs:
        now + this.policy.overallTimeoutMs,
      userMasterKey:
        Buffer.from(args.userMasterKey)
    };
    this.byDigest.set(
      digest,
      session
    );
    this.digestBySessionId.set(
      session.sessionId,
      digest
    );
    this.scheduleTimers(
      digest,
      session
    );
    return {
      token,
      session: this.view(session)
    };
  }

  lookup(
    token: string
  ): SessionLookup {
    const digest =
      tokenDigest(token);
    const session =
      this.byDigest.get(digest);
    if (!session) {
      return { status: "MISSING" };
    }

    const now = this.clock.now();
    if (
      now >= session.overallExpiresAtMs
    ) {
      this.revokeDigest(
        digest,
        "OVERALL_TIMEOUT"
      );
      return {
        status: "OVERALL_EXPIRED"
      };
    }
    if (
      now >= session.idleExpiresAtMs
    ) {
      this.revokeDigest(
        digest,
        "IDLE_TIMEOUT"
      );
      return {
        status: "IDLE_EXPIRED"
      };
    }
    return {
      status: "OK",
      session: this.view(session)
    };
  }

  getInternalBySessionId(
    sessionId: string
  ): {
    userId: string;
    authEpoch: number;
  } | null {
    const digest =
      this.digestBySessionId.get(
        sessionId
      );
    const session = digest
      ? this.byDigest.get(digest)
      : undefined;
    return session
      ? {
          userId: session.userId,
          authEpoch:
            session.authEpoch
        }
      : null;
  }

  touch(
    sessionId: string
  ): AuthSessionView | null {
    const digest =
      this.digestBySessionId.get(
        sessionId
      );
    if (!digest) return null;
    const session =
      this.byDigest.get(digest);
    if (!session) return null;

    const now = this.clock.now();
    if (
      now >= session.overallExpiresAtMs
    ) {
      this.revokeDigest(
        digest,
        "OVERALL_TIMEOUT"
      );
      return null;
    }
    if (
      now >= session.idleExpiresAtMs
    ) {
      this.revokeDigest(
        digest,
        "IDLE_TIMEOUT"
      );
      return null;
    }

    session.lastActivityAtMs = now;
    session.idleExpiresAtMs =
      now + this.policy.idleTimeoutMs;
    this.scheduleIdleTimer(
      digest,
      session
    );
    return this.view(session);
  }

  revokeToken(
    token: string,
    reason:
      SessionRevocationReason =
        "LOGOUT"
  ): void {
    this.revokeDigest(
      tokenDigest(token),
      reason
    );
  }

  revokeSessionId(
    sessionId: string,
    reason:
      SessionRevocationReason =
        "USER_LOCK"
  ): void {
    const digest =
      this.digestBySessionId.get(
        sessionId
      );
    if (digest) {
      this.revokeDigest(
        digest,
        reason
      );
    }
  }

  revokeUser(
    userId: string,
    reason:
      SessionRevocationReason =
        "USER_REVOKED"
  ): void {
    for (
      const [digest, session]
      of this.byDigest
    ) {
      if (
        session.userId === userId
      ) {
        this.revokeDigest(
          digest,
          reason
        );
      }
    }
  }

  clear(
    reason:
      SessionRevocationReason =
        "SERVICE_CLOSE"
  ): void {
    for (
      const digest
      of [...this.byDigest.keys()]
    ) {
      this.revokeDigest(
        digest,
        reason
      );
    }
  }

  private scheduleTimers(
    digest: string,
    session: InternalSession
  ): void {
    if (!this.scheduleExpiryTimers) {
      return;
    }
    this.scheduleIdleTimer(
      digest,
      session
    );
    const delay = Math.max(
      1,
      session.overallExpiresAtMs -
        this.clock.now()
    );
    session.overallTimer =
      setTimeout(
        () => {
          this.expireIfCurrent(
            digest,
            "OVERALL"
          );
        },
        delay
      );
    session.overallTimer.unref();
  }

  private scheduleIdleTimer(
    digest: string,
    session: InternalSession
  ): void {
    if (!this.scheduleExpiryTimers) {
      return;
    }
    if (session.idleTimer) {
      clearTimeout(
        session.idleTimer
      );
    }
    const delay = Math.max(
      1,
      session.idleExpiresAtMs -
        this.clock.now()
    );
    session.idleTimer =
      setTimeout(
        () => {
          this.expireIfCurrent(
            digest,
            "IDLE"
          );
        },
        delay
      );
    session.idleTimer.unref();
  }

  private expireIfCurrent(
    digest: string,
    reason: SessionExpiryReason
  ): void {
    const session =
      this.byDigest.get(digest);
    if (!session) return;
    const now = this.clock.now();
    const expired =
      reason === "IDLE"
        ? now >=
          session.idleExpiresAtMs
        : now >=
          session.overallExpiresAtMs;
    if (expired) {
      this.revokeDigest(
        digest,
        reason === "IDLE"
          ? "IDLE_TIMEOUT"
          : "OVERALL_TIMEOUT"
      );
    } else if (reason === "IDLE") {
      this.scheduleIdleTimer(
        digest,
        session
      );
    }
  }

  private revokeDigest(
    digest: string,
    reason: SessionRevocationReason
  ): void {
    const session =
      this.byDigest.get(digest);
    if (!session) return;

    if (session.idleTimer) {
      clearTimeout(session.idleTimer);
    }
    if (session.overallTimer) {
      clearTimeout(
        session.overallTimer
      );
    }
    session.userMasterKey.fill(0);
    this.byDigest.delete(digest);
    this.digestBySessionId.delete(
      session.sessionId
    );
    this.revocationListener?.({
      sessionId:
        session.sessionId,
      userId: session.userId,
      reason,
      occurredAt:
        iso(this.clock.now())
    });
  }

  private view(
    session: InternalSession
  ): AuthSessionView {
    return {
      sessionId: session.sessionId,
      userId: session.userId,
      createdAt:
        iso(session.createdAtMs),
      lastActivityAt:
        iso(
          session.lastActivityAtMs
        ),
      lastFullAuthenticationAt:
        iso(
          session
            .lastFullAuthenticationAtMs
        ),
      idleExpiresAt:
        iso(
          session.idleExpiresAtMs
        ),
      overallExpiresAt:
        iso(
          session.overallExpiresAtMs
        )
    };
  }
}

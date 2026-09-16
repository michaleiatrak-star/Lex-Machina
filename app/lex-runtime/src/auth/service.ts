import {
  randomBytes
} from "node:crypto";
import type {
  AuthClock,
  AuthenticatedContext,
  AuthKdfPolicy,
  AuthStatus,
  AuthSuccess,
  PublicLocalUser,
  StoredLocalUser
} from "./types.js";
import {
  DEFAULT_AUTH_KDF
} from "./types.js";
import {
  decryptUserMasterKey,
  encryptUserMasterKey,
  isValidLoginName,
  normalizeLoginName,
  PasswordKdfExecutor,
  randomKdfSalt,
  randomUserMasterKey,
  validateDisplayName,
  validateNewPassword
} from "./crypto.js";
import {
  AuthSessionManager
} from "./session-manager.js";
import {
  LocalAuthStore,
  type AuthRateLimitRecord
} from "./store.js";

export type AuthErrorCode =
  | "INVALID_BOOTSTRAP_REQUEST"
  | "BOOTSTRAP_ALREADY_COMPLETED"
  | "INVALID_CREDENTIALS"
  | "AUTH_BACKOFF_ACTIVE"
  | "AUTH_BUSY"
  | "AUTHENTICATION_REQUIRED"
  | "SESSION_IDLE_EXPIRED"
  | "SESSION_OVERALL_EXPIRED"
  | "SESSION_REVOKED";

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    readonly httpStatus: number,
    readonly retryAfter?: string
  ) {
    super(code);
    this.name = "AuthError";
  }
}

export interface AuthService {
  status(): AuthStatus;
  bootstrap(input: {
    loginName: string;
    displayName: string;
    password: string;
  }): Promise<AuthSuccess>;
  login(input: {
    loginName: string;
    password: string;
  }): Promise<AuthSuccess>;
  authenticateAuthorization(
    authorization: string | undefined
  ): AuthenticatedContext;
  touchSession(
    sessionId: string
  ): void;
  logoutAuthorization(
    authorization: string | undefined
  ): void;
  lockSession(
    sessionId: string
  ): void;
}

type DummyUser = Pick<
  StoredLocalUser,
  | "userId"
  | "normalizedLoginName"
  | "kdf"
  | "kdfSalt"
  | "umkWrapNonce"
  | "umkWrapCiphertext"
  | "umkWrapTag"
  | "umkKeyVersion"
>;

const SYSTEM_CLOCK: AuthClock = {
  now: () => Date.now()
};

const QUIET_RESET_MS =
  24 * 60 * 60 * 1000;

function delayForFailures(
  failures: number
): number {
  if (failures < 5) return 0;
  if (failures === 5) return 30_000;
  if (failures === 6) return 60_000;
  if (failures === 7) return 2 * 60_000;
  if (failures === 8) return 5 * 60_000;
  if (failures === 9) return 15 * 60_000;
  return 30 * 60_000;
}

function publicUser(
  user: StoredLocalUser
): PublicLocalUser {
  return {
    userId: user.userId,
    loginName: user.loginName,
    displayName: user.displayName,
    appRole: user.appRole,
    status: user.status,
    createdAt: user.createdAt,
    ...(user.lastLoginAt
      ? {
          lastLoginAt:
            user.lastLoginAt
        }
      : {})
  };
}

function parseBearer(
  authorization: string | undefined
): string | null {
  if (!authorization) return null;
  const match =
    /^Bearer\s+([A-Za-z0-9_-]{20,})$/i
      .exec(authorization.trim());
  return match?.[1] ?? null;
}

function strongerPolicyNeeded(
  current: AuthKdfPolicy,
  target: AuthKdfPolicy
): boolean {
  return (
    current.version <
      target.version ||
    current.memoryKiB <
      target.memoryKiB ||
    current.iterations <
      target.iterations ||
    current.parallelism <
      target.parallelism ||
    current.keyLength <
      target.keyLength
  );
}

export class LocalAuthService
implements AuthService {
  private readonly store:
    LocalAuthStore;
  private readonly sessions:
    AuthSessionManager;
  private readonly kdf:
    AuthKdfPolicy;
  private readonly clock:
    AuthClock;
  private readonly kdfExecutor:
    PasswordKdfExecutor;
  private readonly dummy:
    DummyUser;

  constructor(
    store: LocalAuthStore,
    options?: {
      kdf?: Partial<
        Omit<
          AuthKdfPolicy,
          "algorithm"
        >
      >;
      clock?: AuthClock;
      sessionManager?:
        AuthSessionManager;
      kdfExecutor?:
        PasswordKdfExecutor;
    }
  ) {
    this.store = store;
    this.clock =
      options?.clock ?? SYSTEM_CLOCK;
    this.kdf = {
      ...DEFAULT_AUTH_KDF,
      ...options?.kdf,
      algorithm: "ARGON2ID"
    };
    this.sessions =
      options?.sessionManager ??
      new AuthSessionManager({
        clock: this.clock
      });
    this.kdfExecutor =
      options?.kdfExecutor ??
      new PasswordKdfExecutor();

    const dummyKey =
      randomBytes(32);
    const dummyUmk =
      randomBytes(32);
    const userId =
      "user_" +
      randomBytes(16).toString("hex");
    const normalizedLoginName =
      "synthetic-user";
    const keyVersion = 1;
    const envelope =
      encryptUserMasterKey(
        dummyKey,
        dummyUmk,
        {
          userId,
          normalizedLoginName,
          keyVersion
        }
      );
    dummyKey.fill(0);
    dummyUmk.fill(0);
    this.dummy = {
      userId,
      normalizedLoginName,
      kdf: this.kdf,
      kdfSalt: randomKdfSalt(),
      umkWrapNonce:
        envelope.nonce,
      umkWrapCiphertext:
        envelope.ciphertext,
      umkWrapTag:
        envelope.tag,
      umkKeyVersion:
        keyVersion
    };
  }

  close(): void {
    this.sessions.clear();
    this.store.close();
    this.dummy.kdfSalt.fill(0);
    this.dummy.umkWrapNonce.fill(0);
    this.dummy.umkWrapCiphertext.fill(0);
    this.dummy.umkWrapTag.fill(0);
  }

  status(): AuthStatus {
    const initialized =
      this.store.countUsers() > 0;
    return {
      initialized,
      requiresBootstrap:
        !initialized
    };
  }

  async bootstrap(input: {
    loginName: string;
    displayName: string;
    password: string;
  }): Promise<AuthSuccess> {
    if (this.store.countUsers() > 0) {
      throw new AuthError(
        "BOOTSTRAP_ALREADY_COMPLETED",
        409
      );
    }

    const normalizedLoginName =
      normalizeLoginName(
        input.loginName
      );
    if (
      !isValidLoginName(
        normalizedLoginName
      )
    ) {
      throw new AuthError(
        "INVALID_BOOTSTRAP_REQUEST",
        400
      );
    }

    let password: string;
    let displayName: string;
    try {
      password =
        validateNewPassword(
          input.password
        );
      displayName =
        validateDisplayName(
          input.displayName
        );
    } catch {
      throw new AuthError(
        "INVALID_BOOTSTRAP_REQUEST",
        400
      );
    }

    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    const userId =
      "user_" +
      randomBytes(16)
        .toString("hex");
    const salt =
      randomKdfSalt();
    const userMasterKey =
      randomUserMasterKey();
    const keyEncryptionKey =
      await this.deriveKey(
        password,
        salt,
        this.kdf
      );

    try {
      const envelope =
        encryptUserMasterKey(
          keyEncryptionKey,
          userMasterKey,
          {
            userId,
            normalizedLoginName,
            keyVersion: 1
          }
        );

      const stored:
        StoredLocalUser = {
          userId,
          loginName:
            input.loginName
              .normalize("NFKC")
              .trim(),
          normalizedLoginName,
          displayName,
          appRole: "ADMIN",
          status: "ACTIVE",
          createdAt: now,
          updatedAt: now,
          authEpoch: 1,
          kdf: { ...this.kdf },
          kdfSalt: salt,
          umkWrapNonce:
            envelope.nonce,
          umkWrapCiphertext:
            envelope.ciphertext,
          umkWrapTag:
            envelope.tag,
          umkKeyVersion: 1
        };

      if (
        !this.store
          .createFirstUser(stored)
      ) {
        throw new AuthError(
          "BOOTSTRAP_ALREADY_COMPLETED",
          409
        );
      }

      this.store.recordSecurityEvent({
        eventId:
          "event_" +
          randomBytes(16)
            .toString("hex"),
        userId,
        eventType:
          "account_created",
        occurredAt: now,
        result: "PASS",
        metadata: {
          appRole: "ADMIN"
        }
      });

      return this.createSuccess(
        stored,
        userMasterKey
      );
    } finally {
      keyEncryptionKey.fill(0);
      userMasterKey.fill(0);
    }
  }

  async login(input: {
    loginName: string;
    password: string;
  }): Promise<AuthSuccess> {
    const candidate =
      normalizeLoginName(
        input.loginName
          .slice(0, 256)
      );
    const validLogin =
      isValidLoginName(candidate);
    const loginTag =
      this.store.loginTag(
        candidate
      );
    const nowMs =
      this.clock.now();
    const nowIso =
      new Date(
        nowMs
      ).toISOString();

    const rate =
      this.normalizedRateRecord(
        this.store.getRateLimit(
          loginTag
        ),
        nowMs
      );
    if (
      rate?.retryAfter &&
      Date.parse(
        rate.retryAfter
      ) > nowMs
    ) {
      throw new AuthError(
        "AUTH_BACKOFF_ACTIVE",
        429,
        rate.retryAfter
      );
    }

    const realUser =
      validLogin
        ? this.store
            .getUserByNormalizedLogin(
              candidate
            )
        : null;
    const verifier =
      realUser ?? this.dummy;
    const normalizedPassword =
      input.password.normalize("NFKC");
    const passwordLength =
      Array.from(
        normalizedPassword
      ).length;
    const passwordForKdf =
      passwordLength <= 128
        ? input.password
        : "invalid-overlong-password";
    const passwordLengthAccepted =
      passwordLength <= 128;

    let keyEncryptionKey:
      Buffer | undefined;
    let userMasterKey:
      Buffer | undefined;
    let verified = false;
    try {
      keyEncryptionKey =
        await this.deriveKey(
          passwordForKdf,
          verifier.kdfSalt,
          verifier.kdf
        );
      try {
        userMasterKey =
          decryptUserMasterKey(
            keyEncryptionKey,
            verifier as StoredLocalUser
          );
        verified =
          passwordLengthAccepted &&
          realUser !== null &&
          realUser.status ===
            "ACTIVE";
      } catch {
        verified = false;
      }

      if (
        !verified ||
        !realUser ||
        !userMasterKey
      ) {
        const retryAfter =
          this.recordFailure(
            loginTag,
            rate,
            nowMs
          );
        this.store
          .recordSecurityEvent({
            eventId:
              "event_" +
              randomBytes(16)
                .toString("hex"),
            eventType:
              "login_failure",
            occurredAt: nowIso,
            result: "BLOCKED",
            metadata: {
              reason:
                "INVALID_CREDENTIALS"
            }
          });
        if (retryAfter) {
          this.store
            .recordSecurityEvent({
              eventId:
                "event_" +
                randomBytes(16)
                  .toString("hex"),
              eventType:
                "login_backoff_started",
              occurredAt:
                nowIso,
              result: "BLOCKED",
              metadata: {
                retryAfter
              }
            });
          throw new AuthError(
            "AUTH_BACKOFF_ACTIVE",
            429,
            retryAfter
          );
        }
        throw new AuthError(
          "INVALID_CREDENTIALS",
          401
        );
      }

      this.store.clearRateLimit(
        loginTag
      );
      this.store.updateLastLogin(
        realUser.userId,
        nowIso
      );

      if (
        strongerPolicyNeeded(
          realUser.kdf,
          this.kdf
        )
      ) {
        await this.upgradeEnvelope(
          realUser,
          input.password,
          userMasterKey,
          nowIso
        );
      }

      const refreshed =
        this.store.getUserById(
          realUser.userId
        ) ?? realUser;
      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            realUser.userId,
          eventType:
            "login_success",
          occurredAt: nowIso,
          result: "PASS"
        });

      return this.createSuccess(
        {
          ...refreshed,
          lastLoginAt: nowIso
        },
        userMasterKey
      );
    } finally {
      keyEncryptionKey?.fill(0);
      userMasterKey?.fill(0);
    }
  }

  authenticateAuthorization(
    authorization:
      string | undefined
  ): AuthenticatedContext {
    const token =
      parseBearer(authorization);
    if (!token) {
      throw new AuthError(
        "AUTHENTICATION_REQUIRED",
        401
      );
    }

    const lookup =
      this.sessions.lookup(token);
    if (
      lookup.status ===
      "IDLE_EXPIRED"
    ) {
      throw new AuthError(
        "SESSION_IDLE_EXPIRED",
        401
      );
    }
    if (
      lookup.status ===
      "OVERALL_EXPIRED"
    ) {
      throw new AuthError(
        "SESSION_OVERALL_EXPIRED",
        401
      );
    }
    if (
      lookup.status !== "OK"
    ) {
      throw new AuthError(
        "AUTHENTICATION_REQUIRED",
        401
      );
    }

    const internal =
      this.sessions
        .getInternalBySessionId(
          lookup.session
            .sessionId
        );
    if (!internal) {
      throw new AuthError(
        "SESSION_REVOKED",
        401
      );
    }
    const user =
      this.store.getUserById(
        internal.userId
      );
    if (
      !user ||
      user.status !== "ACTIVE" ||
      user.authEpoch !==
        internal.authEpoch
    ) {
      this.sessions
        .revokeSessionId(
          lookup.session
            .sessionId
        );
      throw new AuthError(
        "SESSION_REVOKED",
        401
      );
    }

    return {
      user: publicUser(user),
      session:
        lookup.session
    };
  }

  touchSession(
    sessionId: string
  ): void {
    this.sessions.touch(
      sessionId
    );
  }

  logoutAuthorization(
    authorization:
      string | undefined
  ): void {
    const token =
      parseBearer(authorization);
    if (token) {
      this.sessions
        .revokeToken(token);
    }
  }

  lockSession(
    sessionId: string
  ): void {
    this.sessions
      .revokeSessionId(
        sessionId
      );
  }

  revokeUserSessions(
    userId: string
  ): void {
    this.sessions
      .revokeUser(userId);
  }

  private createSuccess(
    user: StoredLocalUser,
    userMasterKey: Buffer
  ): AuthSuccess {
    const created =
      this.sessions.create({
        userId: user.userId,
        authEpoch:
          user.authEpoch,
        userMasterKey
      });
    return {
      user: publicUser(user),
      session:
        created.session,
      sessionToken:
        created.token
    };
  }

  private normalizedRateRecord(
    record:
      AuthRateLimitRecord | null,
    nowMs: number
  ): AuthRateLimitRecord | null {
    if (
      !record?.lastFailureAt
    ) {
      return record;
    }
    const last =
      Date.parse(
        record.lastFailureAt
      );
    if (
      Number.isFinite(last) &&
      nowMs - last >=
        QUIET_RESET_MS
    ) {
      return null;
    }
    return record;
  }

  private recordFailure(
    loginTag: Buffer,
    current:
      AuthRateLimitRecord | null,
    nowMs: number
  ): string | undefined {
    const failures =
      (current
        ?.consecutiveFailures ??
        0) + 1;
    const delay =
      delayForFailures(failures);
    const lastFailureAt =
      new Date(
        nowMs
      ).toISOString();
    const retryAfter =
      delay > 0
        ? new Date(
            nowMs + delay
          ).toISOString()
        : undefined;

    this.store.setRateLimit(
      loginTag,
      {
        consecutiveFailures:
          failures,
        lastFailureAt,
        ...(retryAfter
          ? { retryAfter }
          : {})
      }
    );
    return retryAfter;
  }

  private async deriveKey(
    password: string,
    salt: Buffer,
    policy: AuthKdfPolicy
  ): Promise<Buffer> {
    try {
      return await this.kdfExecutor
        .derive(
          password,
          salt,
          policy
        );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "AUTH_KDF_BUSY"
      ) {
        throw new AuthError(
          "AUTH_BUSY",
          503
        );
      }
      throw error;
    }
  }

  private async upgradeEnvelope(
    user: StoredLocalUser,
    password: string,
    userMasterKey: Buffer,
    nowIso: string
  ): Promise<void> {
    const salt =
      randomKdfSalt();
    const key =
      await this.deriveKey(
        password,
        salt,
        this.kdf
      );
    try {
      const keyVersion =
        user.umkKeyVersion + 1;
      const envelope =
        encryptUserMasterKey(
          key,
          userMasterKey,
          {
            userId:
              user.userId,
            normalizedLoginName:
              user
                .normalizedLoginName,
            keyVersion
          }
        );
      this.store
        .updatePasswordEnvelope({
          userId: user.userId,
          updatedAt: nowIso,
          kdf: this.kdf,
          kdfSalt: salt,
          nonce:
            envelope.nonce,
          ciphertext:
            envelope.ciphertext,
          tag: envelope.tag,
          keyVersion
        });
    } finally {
      key.fill(0);
    }
  }
}

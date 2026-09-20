import {
  randomBytes
} from "node:crypto";
import type {
  AuthClock,
  AuthenticatedContext,
  AuthKdfPolicy,
  AuthStatus,
  AuthSuccess,
  AuthSessionView,
  AuthRecoverySuccess,
  PublicLocalUser,
  RecoveryCodeResult,
  LocalUserStatus,
  ModelRoutingPreferences,
  StoredLocalUser
} from "./types.js";
import {
  DEFAULT_AUTH_KDF,
  DEFAULT_MODEL_ROUTING_PREFERENCES
} from "./types.js";
import {
  decryptRecoveryUserMasterKey,
  decryptUserMasterKey,
  deriveRecoveryKey,
  encryptRecoveryUserMasterKey,
  encryptUserMasterKey,
  generateRecoveryCode,
  isValidLoginName,
  normalizeLoginName,
  PasswordKdfExecutor,
  randomKdfSalt,
  randomRecoverySalt,
  randomUserMasterKey,
  validateDisplayName,
  validateNewPassword
} from "./crypto.js";
import {
  generateUserSharingKeys
} from "../case-crypto.js";
import {
  AuthSessionManager,
  type SessionRevocationEvent
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
  | "AUTHORIZATION_DENIED"
  | "INVALID_USER_REQUEST"
  | "ACCOUNT_LOGIN_EXISTS"
  | "USER_NOT_FOUND"
  | "USER_STATUS_CONFLICT"
  | "SELF_ADMIN_MUTATION_DENIED"
  | "USER_DELETE_REQUIRES_DISABLE"
  | "USER_DELETE_REQUIRES_CASE_CLEANUP"
  | "SESSION_IDLE_EXPIRED"
  | "SESSION_OVERALL_EXPIRED"
  | "SESSION_REVOKED"
  | "INVALID_PASSWORD_CHANGE"
  | "INVALID_RECOVERY_REQUEST"
  | "INVALID_RECOVERY_CREDENTIALS";

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
  getModelRoutingPreferences(
    actor: AuthenticatedContext
  ): ModelRoutingPreferences;
  setModelRoutingPreferences(
    actor: AuthenticatedContext,
    input: {
      auxiliaryEnabled: boolean;
      auxiliaryProvider:
        ModelRoutingPreferences["auxiliaryProvider"];
      auxiliaryModel: string;
    }
  ): ModelRoutingPreferences;
  bootstrap(input: {
    loginName: string;
    displayName: string;
    password: string;
    passwordSetupPending?: boolean;
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
  createUser(
    actor: AuthenticatedContext,
    input: {
      loginName: string;
      displayName: string;
      password: string;
    }
  ): Promise<PublicLocalUser>;
  listUsers(
    actor: AuthenticatedContext
  ): PublicLocalUser[];
  setUserStatus(
    actor: AuthenticatedContext,
    userId: string,
    status: LocalUserStatus
  ): PublicLocalUser;
  deleteUser(
    actor: AuthenticatedContext,
    userId: string
  ): {
    userId: string;
    deletedAt: string;
  };
  createRecoveryCode(
    actor: AuthenticatedContext,
    input: {
      password: string;
    }
  ): Promise<RecoveryCodeResult>;
  changePassword(
    actor: AuthenticatedContext,
    input: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<
    AuthSuccess | AuthRecoverySuccess
  >;
  recoverAccount(input: {
    loginName: string;
    recoveryCode: string;
    newPassword: string;
  }): Promise<AuthRecoverySuccess>;
  reauthenticate(
    actor: AuthenticatedContext,
    password: string,
    purpose: string
  ): Promise<AuthSessionView>;
  onSessionRevoked(
    listener: (
      event: SessionRevocationEvent
    ) => void
  ): () => void;
  withSessionUserMasterKey<T>(
    sessionId: string,
    callback: (
      userMasterKey: Buffer
    ) => T | Promise<T>
  ): Promise<T>;
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
    passwordSetupPending:
      user.passwordSetupPending === true,
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
  private readonly revocationSubscribers =
    new Set<
      (
        event:
          SessionRevocationEvent
      ) => void
    >();

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
    this.sessions
      .setRevocationListener(
        (event) =>
          this.recordSessionRevocation(
            event
          )
      );

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

  getModelRoutingPreferences(
    actor: AuthenticatedContext
  ): ModelRoutingPreferences {
    const stored =
      this.store
        .getModelRoutingPreferences(
          actor.user.userId
        );
    return stored
      ? { ...stored }
      : {
          ...DEFAULT_MODEL_ROUTING_PREFERENCES
        };
  }

  setModelRoutingPreferences(
    actor: AuthenticatedContext,
    input: {
      auxiliaryEnabled: boolean;
      auxiliaryProvider:
        ModelRoutingPreferences["auxiliaryProvider"];
      auxiliaryModel: string;
    }
  ): ModelRoutingPreferences {
    const model =
      input.auxiliaryModel
        .normalize("NFKC")
        .trim();
    if (
      model.length < 1 ||
      model.length > 256 ||
      (
        model.startsWith("local/") &&
        input.auxiliaryProvider !==
          "openai"
      )
    ) {
      throw new AuthError(
        "INVALID_USER_REQUEST",
        400
      );
    }

    const value:
      ModelRoutingPreferences = {
        auxiliaryEnabled:
          input.auxiliaryEnabled,
        auxiliaryProvider:
          input.auxiliaryProvider,
        auxiliaryModel: model,
        updatedAt:
          new Date(
            this.clock.now()
          ).toISOString()
      };
    this.store
      .setModelRoutingPreferences(
        actor.user.userId,
        value
      );
    return { ...value };
  }

  async bootstrap(input: {
    loginName: string;
    displayName: string;
    password: string;
    passwordSetupPending?: boolean;
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
      const temporaryDefaultAdmin =
        input.passwordSetupPending === true &&
        normalizedLoginName === "admin" &&
        input.password === "admin";
      password =
        temporaryDefaultAdmin
          ? input.password.normalize("NFKC")
          : validateNewPassword(
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
          passwordSetupPending:
            input.passwordSetupPending ===
            true,
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

      this.ensureUserSharingKeys(
        userId,
        userMasterKey,
        now
      );

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

      this.ensureUserSharingKeys(
        realUser.userId,
        userMasterKey,
        nowIso
      );

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

  async createUser(
    actor: AuthenticatedContext,
    input: {
      loginName: string;
      displayName: string;
      password: string;
    }
  ): Promise<PublicLocalUser> {
    if (
      actor.user.appRole !==
        "ADMIN"
    ) {
      throw new AuthError(
        "AUTHORIZATION_DENIED",
        403
      );
    }

    const normalizedLoginName =
      normalizeLoginName(
        input.loginName
      );
    if (
      !isValidLoginName(
        normalizedLoginName
      ) ||
      this.store
        .getUserByNormalizedLogin(
          normalizedLoginName
        )
    ) {
      if (
        this.store
          .getUserByNormalizedLogin(
            normalizedLoginName
          )
      ) {
        throw new AuthError(
          "ACCOUNT_LOGIN_EXISTS",
          409
        );
      }
      throw new AuthError(
        "INVALID_USER_REQUEST",
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
        "INVALID_USER_REQUEST",
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
          appRole: "USER",
          status: "ACTIVE",
          createdAt: now,
          updatedAt: now,
          authEpoch: 1,
          kdf: {
            ...this.kdf
          },
          kdfSalt: salt,
          umkWrapNonce:
            envelope.nonce,
          umkWrapCiphertext:
            envelope.ciphertext,
          umkWrapTag:
            envelope.tag,
          umkKeyVersion: 1
        };

      try {
        this.store.createUser(
          stored
        );
      } catch (error) {
        if (
          error instanceof Error &&
          /UNIQUE|normalized_login_name/i
            .test(error.message)
        ) {
          throw new AuthError(
            "ACCOUNT_LOGIN_EXISTS",
            409
          );
        }
        throw error;
      }

      this.ensureUserSharingKeys(
        userId,
        userMasterKey,
        now
      );
      this.store.recordSecurityEvent({
        eventId:
          "event_" +
          randomBytes(16)
            .toString("hex"),
        userId:
          actor.user.userId,
        eventType:
          "account_created",
        occurredAt: now,
        result: "PASS",
        metadata: {
          targetUserId: userId,
          appRole: "USER"
        }
      });
      return publicUser(stored);
    } finally {
      keyEncryptionKey.fill(0);
      userMasterKey.fill(0);
    }
  }

  listUsers(
    actor: AuthenticatedContext
  ): PublicLocalUser[] {
    if (
      actor.user.appRole !==
        "ADMIN"
    ) {
      throw new AuthError(
        "AUTHORIZATION_DENIED",
        403
      );
    }
    return this.store
      .listUsers()
      .map(publicUser);
  }

  setUserStatus(
    actor: AuthenticatedContext,
    userId: string,
    status: LocalUserStatus
  ): PublicLocalUser {
    if (
      actor.user.appRole !==
        "ADMIN"
    ) {
      throw new AuthError(
        "AUTHORIZATION_DENIED",
        403
      );
    }
    if (
      !/^user_[a-f0-9]{32}$/
        .test(userId) ||
      ![
        "ACTIVE",
        "DISABLED"
      ].includes(status)
    ) {
      throw new AuthError(
        "INVALID_USER_REQUEST",
        400
      );
    }
    if (
      userId === actor.user.userId
    ) {
      throw new AuthError(
        "SELF_ADMIN_MUTATION_DENIED",
        409
      );
    }

    const target =
      this.store.getUserById(
        userId
      );
    if (!target) {
      throw new AuthError(
        "USER_NOT_FOUND",
        404
      );
    }
    if (
      target.appRole !== "USER"
    ) {
      throw new AuthError(
        "USER_STATUS_CONFLICT",
        409
      );
    }
    if (
      target.status === status
    ) {
      return publicUser(target);
    }

    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    this.store
      .setUserStatusAndIncrementEpoch(
        userId,
        status,
        now
      );
    this.sessions.revokeUser(
      userId,
      "USER_REVOKED"
    );
    this.store.recordSecurityEvent({
      eventId:
        "event_" +
        randomBytes(16)
          .toString("hex"),
      userId:
        actor.user.userId,
      eventType:
        status === "DISABLED"
          ? "account_disabled"
          : "account_reactivated",
      occurredAt: now,
      result: "PASS",
      metadata: {
        targetUserId: userId
      }
    });

    const updated =
      this.store.getUserById(
        userId
      );
    if (!updated) {
      throw new AuthError(
        "USER_NOT_FOUND",
        404
      );
    }
    return publicUser(updated);
  }

  deleteUser(
    actor: AuthenticatedContext,
    userId: string
  ): {
    userId: string;
    deletedAt: string;
  } {
    if (
      actor.user.appRole !==
        "ADMIN"
    ) {
      throw new AuthError(
        "AUTHORIZATION_DENIED",
        403
      );
    }
    if (
      !/^user_[a-f0-9]{32}$/
        .test(userId)
    ) {
      throw new AuthError(
        "INVALID_USER_REQUEST",
        400
      );
    }
    if (
      userId === actor.user.userId
    ) {
      throw new AuthError(
        "SELF_ADMIN_MUTATION_DENIED",
        409
      );
    }

    const target =
      this.store.getUserById(
        userId
      );
    if (!target) {
      throw new AuthError(
        "USER_NOT_FOUND",
        404
      );
    }
    if (
      target.appRole !== "USER"
    ) {
      throw new AuthError(
        "USER_STATUS_CONFLICT",
        409
      );
    }
    if (
      target.status !==
        "DISABLED"
    ) {
      throw new AuthError(
        "USER_DELETE_REQUIRES_DISABLE",
        409
      );
    }

    const relations =
      this.store
        .getUserCaseRelationCounts(
          userId
        );
    if (
      relations.createdCases > 0 ||
      relations.accessRows > 0 ||
      relations.grantedRows > 0
    ) {
      throw new AuthError(
        "USER_DELETE_REQUIRES_CASE_CLEANUP",
        409
      );
    }

    const deletedAt =
      new Date(
        this.clock.now()
      ).toISOString();
    this.sessions.revokeUser(
      userId,
      "USER_REVOKED"
    );
    if (
      !this.store.deleteUser(
        userId
      )
    ) {
      throw new AuthError(
        "USER_NOT_FOUND",
        404
      );
    }
    this.store.recordSecurityEvent({
      eventId:
        "event_" +
        randomBytes(16)
          .toString("hex"),
      userId:
        actor.user.userId,
      eventType:
        "account_deleted",
      occurredAt: deletedAt,
      result: "PASS",
      metadata: {
        targetUserId: userId
      }
    });

    return {
      userId,
      deletedAt
    };
  }

  async createRecoveryCode(
    actor: AuthenticatedContext,
    input: {
      password: string;
    }
  ): Promise<RecoveryCodeResult> {
    const user =
      this.store.getUserById(
        actor.user.userId
      );
    if (
      !user ||
      user.status !== "ACTIVE"
    ) {
      throw new AuthError(
        "SESSION_REVOKED",
        401
      );
    }

    const userMasterKey =
      await this
        .verifyPasswordForUser(
          user,
          input.password,
          "recovery_setup"
        );
    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    const previous =
      this.store
        .getRecoveryEnvelope(
          user.userId
        );
    const keyVersion =
      (previous?.keyVersion ??
        0) + 1;
    const recoveryCode =
      generateRecoveryCode();
    const salt =
      randomRecoverySalt();
    const recoveryKey =
      deriveRecoveryKey(
        recoveryCode,
        salt,
        {
          userId:
            user.userId,
          keyVersion
        }
      );

    try {
      const envelope =
        encryptRecoveryUserMasterKey(
          recoveryKey,
          userMasterKey,
          {
            userId:
              user.userId,
            keyVersion
          }
        );
      this.store
        .putRecoveryEnvelope({
          userId:
            user.userId,
          algorithm:
            "HKDF-SHA256-AES-256-GCM",
          salt,
          nonce:
            envelope.nonce,
          ciphertext:
            envelope.ciphertext,
          tag:
            envelope.tag,
          keyVersion,
          createdAt: now,
          updatedAt: now
        });
      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            user.userId,
          eventType:
            "recovery_code_created",
          occurredAt: now,
          result: "PASS",
          metadata: {
            keyVersion
          }
        });
      return {
        recoveryCode,
        createdAt: now
      };
    } finally {
      userMasterKey.fill(0);
      recoveryKey.fill(0);
      salt.fill(0);
    }
  }

  async changePassword(
    actor: AuthenticatedContext,
    input: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<
    AuthSuccess | AuthRecoverySuccess
  > {
    const user =
      this.store.getUserById(
        actor.user.userId
      );
    if (
      !user ||
      user.status !== "ACTIVE"
    ) {
      throw new AuthError(
        "SESSION_REVOKED",
        401
      );
    }

    let newPassword: string;
    try {
      newPassword =
        validateNewPassword(
          input.newPassword
        );
    } catch {
      throw new AuthError(
        "INVALID_PASSWORD_CHANGE",
        400
      );
    }

    const userMasterKey =
      await this
        .verifyPasswordForUser(
          user,
          input.currentPassword,
          user.passwordSetupPending
            ? "password_setup"
            : "password_change"
        );
    const salt =
      randomKdfSalt();
    const newKey =
      await this.deriveKey(
        newPassword,
        salt,
        this.kdf
      );
    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    const keyVersion =
      user.umkKeyVersion + 1;
    const completingSetup =
      user.passwordSetupPending ===
      true;
    const recoveryCode =
      completingSetup
        ? generateRecoveryCode()
        : undefined;
    const recoverySalt =
      completingSetup
        ? randomRecoverySalt()
        : undefined;
    const previousRecovery =
      completingSetup
        ? this.store
            .getRecoveryEnvelope(
              user.userId
            )
        : null;
    const recoveryKeyVersion =
      (previousRecovery?.keyVersion ??
        0) + 1;
    const recoveryKey =
      recoveryCode &&
      recoverySalt
        ? deriveRecoveryKey(
            recoveryCode,
            recoverySalt,
            {
              userId:
                user.userId,
              keyVersion:
                recoveryKeyVersion
            }
          )
        : undefined;

    try {
      const envelope =
        encryptUserMasterKey(
          newKey,
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

      if (
        completingSetup &&
        recoveryCode &&
        recoverySalt &&
        recoveryKey
      ) {
        const recoveryEnvelope =
          encryptRecoveryUserMasterKey(
            recoveryKey,
            userMasterKey,
            {
              userId:
                user.userId,
              keyVersion:
                recoveryKeyVersion
            }
          );
        this.store
          .completePasswordSetupAndRotateRecovery({
            password: {
              userId:
                user.userId,
              updatedAt: now,
              kdf: this.kdf,
              kdfSalt: salt,
              nonce:
                envelope.nonce,
              ciphertext:
                envelope.ciphertext,
              tag:
                envelope.tag,
              keyVersion
            },
            recovery: {
              userId:
                user.userId,
              algorithm:
                "HKDF-SHA256-AES-256-GCM",
              salt:
                recoverySalt,
              nonce:
                recoveryEnvelope.nonce,
              ciphertext:
                recoveryEnvelope
                  .ciphertext,
              tag:
                recoveryEnvelope.tag,
              keyVersion:
                recoveryKeyVersion,
              createdAt: now,
              updatedAt: now
            }
          });
      } else {
        this.store
          .updatePasswordEnvelopeAndIncrementEpoch({
            userId:
              user.userId,
            updatedAt: now,
            kdf: this.kdf,
            kdfSalt: salt,
            nonce:
              envelope.nonce,
            ciphertext:
              envelope.ciphertext,
            tag: envelope.tag,
            keyVersion
          });
      }

      this.sessions
        .revokeUser(
          user.userId,
          "AUTH_EPOCH"
        );
      const refreshed =
        this.store.getUserById(
          user.userId
        );
      if (!refreshed) {
        throw new Error(
          "AUTH_USER_MISSING_AFTER_PASSWORD_CHANGE"
        );
      }

      let committedMasterKey:
        Buffer | undefined;
      try {
        committedMasterKey =
          decryptUserMasterKey(
            newKey,
            refreshed
          );
        if (
          !committedMasterKey.equals(
            userMasterKey
          ) ||
          refreshed.umkKeyVersion !==
            keyVersion ||
          (
            completingSetup &&
            refreshed
              .passwordSetupPending !==
              false
          )
        ) {
          throw new Error(
            "AUTH_PASSWORD_CHANGE_COMMIT_VERIFICATION_FAILED"
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "AUTH_PASSWORD_CHANGE_COMMIT_VERIFICATION_FAILED"
        ) {
          throw error;
        }
        throw new Error(
          "AUTH_PASSWORD_CHANGE_COMMIT_VERIFICATION_FAILED"
        );
      } finally {
        committedMasterKey?.fill(0);
      }

      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            user.userId,
          eventType:
            completingSetup
              ? "password_setup_completed"
              : "password_changed",
          occurredAt: now,
          result: "PASS",
          metadata: {
            authEpoch:
              refreshed.authEpoch,
            umkKeyVersion:
              keyVersion,
            ...(completingSetup
              ? {
                  recoveryKeyVersion
                }
              : {})
          }
        });

      const success =
        this.createSuccess(
          refreshed,
          userMasterKey
        );
      return completingSetup &&
        recoveryCode
        ? {
            ...success,
            recoveryCode
          }
        : success;
    } finally {
      userMasterKey.fill(0);
      newKey.fill(0);
      salt.fill(0);
      recoveryKey?.fill(0);
      recoverySalt?.fill(0);
    }
  }

  async recoverAccount(input: {
    loginName: string;
    recoveryCode: string;
    newPassword: string;
  }): Promise<AuthRecoverySuccess> {
    const normalizedLoginName =
      normalizeLoginName(
        input.loginName
          .slice(0, 256)
      );
    let newPassword: string;
    try {
      if (
        !isValidLoginName(
          normalizedLoginName
        )
      ) {
        throw new Error(
          "INVALID_LOGIN"
        );
      }
      newPassword =
        validateNewPassword(
          input.newPassword
        );
    } catch {
      throw new AuthError(
        "INVALID_RECOVERY_REQUEST",
        400
      );
    }

    const user =
      this.store
        .getUserByNormalizedLogin(
          normalizedLoginName
        );
    const recovery =
      user
        ? this.store
            .getRecoveryEnvelope(
              user.userId
            )
        : null;

    if (
      !user ||
      user.status !== "ACTIVE" ||
      !recovery
    ) {
      throw new AuthError(
        "INVALID_RECOVERY_CREDENTIALS",
        401
      );
    }

    let recoveryKey:
      Buffer | undefined;
    let userMasterKey:
      Buffer | undefined;
    try {
      recoveryKey =
        deriveRecoveryKey(
          input.recoveryCode,
          recovery.salt,
          {
            userId:
              user.userId,
            keyVersion:
              recovery.keyVersion
          }
        );
      userMasterKey =
        decryptRecoveryUserMasterKey(
          recoveryKey,
          {
            nonce:
              recovery.nonce,
            ciphertext:
              recovery.ciphertext,
            tag:
              recovery.tag
          },
          {
            userId:
              user.userId,
            keyVersion:
              recovery.keyVersion
          }
        );
    } catch {
      recoveryKey?.fill(0);
      userMasterKey?.fill(0);
      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            user.userId,
          eventType:
            "recovery_failure",
          occurredAt:
            new Date(
              this.clock.now()
            ).toISOString(),
          result: "BLOCKED",
          metadata: {
            reason:
              "INVALID_RECOVERY_CREDENTIALS"
          }
        });
      throw new AuthError(
        "INVALID_RECOVERY_CREDENTIALS",
        401
      );
    } finally {
      recoveryKey?.fill(0);
    }

    const passwordSalt =
      randomKdfSalt();
    const passwordKey =
      await this.deriveKey(
        newPassword,
        passwordSalt,
        this.kdf
      );
    const nextRecoveryCode =
      generateRecoveryCode();
    const nextRecoverySalt =
      randomRecoverySalt();
    const nextRecoveryVersion =
      recovery.keyVersion + 1;
    const nextRecoveryKey =
      deriveRecoveryKey(
        nextRecoveryCode,
        nextRecoverySalt,
        {
          userId:
            user.userId,
          keyVersion:
            nextRecoveryVersion
        }
      );
    const now =
      new Date(
        this.clock.now()
      ).toISOString();
    const passwordKeyVersion =
      user.umkKeyVersion + 1;

    try {
      const passwordEnvelope =
        encryptUserMasterKey(
          passwordKey,
          userMasterKey!,
          {
            userId:
              user.userId,
            normalizedLoginName:
              user
                .normalizedLoginName,
            keyVersion:
              passwordKeyVersion
          }
        );
      const recoveryEnvelope =
        encryptRecoveryUserMasterKey(
          nextRecoveryKey,
          userMasterKey!,
          {
            userId:
              user.userId,
            keyVersion:
              nextRecoveryVersion
          }
        );

      this.store
        .recoverPasswordAndRotateRecovery({
          password: {
            userId:
              user.userId,
            updatedAt: now,
            kdf: this.kdf,
            kdfSalt:
              passwordSalt,
            nonce:
              passwordEnvelope.nonce,
            ciphertext:
              passwordEnvelope
                .ciphertext,
            tag:
              passwordEnvelope.tag,
            keyVersion:
              passwordKeyVersion
          },
          recovery: {
            userId:
              user.userId,
            algorithm:
              "HKDF-SHA256-AES-256-GCM",
            salt:
              nextRecoverySalt,
            nonce:
              recoveryEnvelope.nonce,
            ciphertext:
              recoveryEnvelope
                .ciphertext,
            tag:
              recoveryEnvelope.tag,
            keyVersion:
              nextRecoveryVersion,
            createdAt: now,
            updatedAt: now
          }
        });

      this.sessions
        .revokeUser(
          user.userId,
          "AUTH_EPOCH"
        );
      const refreshed =
        this.store.getUserById(
          user.userId
        );
      if (!refreshed) {
        throw new Error(
          "AUTH_USER_MISSING_AFTER_RECOVERY"
        );
      }
      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            user.userId,
          eventType:
            "recovery_used",
          occurredAt: now,
          result: "PASS",
          metadata: {
            authEpoch:
              refreshed.authEpoch,
            recoveryKeyVersion:
              nextRecoveryVersion,
            umkKeyVersion:
              passwordKeyVersion
          }
        });

      return {
        ...this.createSuccess(
          refreshed,
          userMasterKey!
        ),
        recoveryCode:
          nextRecoveryCode
      };
    } finally {
      userMasterKey?.fill(0);
      passwordKey.fill(0);
      passwordSalt.fill(0);
      nextRecoveryKey.fill(0);
      nextRecoverySalt.fill(0);
    }
  }

  async reauthenticate(
    actor: AuthenticatedContext,
    password: string,
    purpose: string
  ): Promise<AuthSessionView> {
    const user =
      this.store.getUserById(
        actor.user.userId
      );
    if (
      !user ||
      user.status !== "ACTIVE"
    ) {
      throw new AuthError(
        "SESSION_REVOKED",
        401
      );
    }
    const umk =
      await this
        .verifyPasswordForUser(
          user,
          password,
          purpose
        );
    try {
      const refreshed =
        this.sessions
          .markFullAuthentication(
            actor.session
              .sessionId
          );
      if (!refreshed) {
        throw new AuthError(
          "SESSION_REVOKED",
          401
        );
      }
      this.store
        .recordSecurityEvent({
          eventId:
            "event_" +
            randomBytes(16)
              .toString("hex"),
          userId:
            user.userId,
          eventType:
            "reauth_success",
          occurredAt:
            refreshed
              .lastFullAuthenticationAt,
          result: "PASS",
          metadata: {
            purpose,
            sessionId:
              refreshed.sessionId
          }
        });
      return refreshed;
    } finally {
      umk.fill(0);
    }
  }

  async withSessionUserMasterKey<T>(
    sessionId: string,
    callback: (
      userMasterKey: Buffer
    ) => T | Promise<T>
  ): Promise<T> {
    try {
      return await this.sessions
        .withUserMasterKey(
          sessionId,
          callback
        );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "SESSION_KEY_UNAVAILABLE"
      ) {
        throw new AuthError(
          "SESSION_REVOKED",
          401
        );
      }
      throw error;
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
            .sessionId,
          "AUTH_EPOCH"
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
        .revokeToken(
          token,
          "LOGOUT"
        );
    }
  }

  lockSession(
    sessionId: string
  ): void {
    this.sessions
      .revokeSessionId(
        sessionId,
        "USER_LOCK"
      );
  }

  onSessionRevoked(
    listener: (
      event:
        SessionRevocationEvent
    ) => void
  ): () => void {
    this.revocationSubscribers
      .add(listener);
    return () => {
      this.revocationSubscribers
        .delete(listener);
    };
  }

  revokeUserSessions(
    userId: string
  ): void {
    this.sessions
      .revokeUser(
        userId,
        "USER_REVOKED"
      );
  }

  private async verifyPasswordForUser(
    user: StoredLocalUser,
    password: string,
    purpose: string
  ): Promise<Buffer> {
    const nowMs =
      this.clock.now();
    const nowIso =
      new Date(
        nowMs
      ).toISOString();
    const loginTag =
      this.store.loginTag(
        user.normalizedLoginName
      );
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

    const normalizedPassword =
      password.normalize("NFKC");
    const length =
      Array.from(
        normalizedPassword
      ).length;
    const passwordForKdf =
      length <= 128
        ? password
        : "invalid-overlong-password";
    let key:
      Buffer | undefined;
    let umk:
      Buffer | undefined;
    try {
      key =
        await this.deriveKey(
          passwordForKdf,
          user.kdfSalt,
          user.kdf
        );
      try {
        umk =
          decryptUserMasterKey(
            key,
            user
          );
      } catch {
        umk = undefined;
      }

      if (
        length > 128 ||
        !umk ||
        user.status !== "ACTIVE"
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
            userId:
              user.userId,
            eventType:
              "reauth_failure",
            occurredAt:
              nowIso,
            result: "BLOCKED",
            metadata: {
              purpose,
              reason:
                "INVALID_CREDENTIALS",
              ...(retryAfter
                ? {
                    retryAfter
                  }
                : {})
            }
          });
        if (retryAfter) {
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
      return umk;
    } finally {
      key?.fill(0);
    }
  }

  private ensureUserSharingKeys(
    userId: string,
    userMasterKey: Buffer,
    at: string
  ): void {
    if (
      this.store
        .getUserSharingKeys(userId)
    ) {
      return;
    }
    const generated =
      generateUserSharingKeys(
        userMasterKey,
        userId
      );
    this.store.putUserSharingKeys({
      userId,
      algorithm: "X25519",
      publicKeyDer:
        generated.publicKeyDer,
      privateKeyWrapNonce:
        generated
          .privateKeyEnvelope
          .nonce,
      privateKeyWrapCiphertext:
        generated
          .privateKeyEnvelope
          .ciphertext,
      privateKeyWrapTag:
        generated
          .privateKeyEnvelope
          .tag,
      keyVersion:
        generated.keyVersion,
      createdAt: at,
      updatedAt: at
    });
  }

  private recordSessionRevocation(
    event: SessionRevocationEvent
  ): void {
    for (
      const listener
      of this.revocationSubscribers
    ) {
      try {
        listener(event);
      } catch {
        // Session revocation must not be blocked by a subscriber.
      }
    }
    if (
      event.reason ===
        "SERVICE_CLOSE"
    ) {
      return;
    }
    const eventType =
      event.reason ===
        "USER_LOCK"
        ? "session_locked"
        : event.reason ===
              "LOGOUT"
          ? "logout"
          : event.reason ===
                "IDLE_TIMEOUT" ||
              event.reason ===
                "OVERALL_TIMEOUT"
            ? "session_expired"
            : "session_revoked";
    this.store
      .recordSecurityEvent({
        eventId:
          "event_" +
          randomBytes(16)
            .toString("hex"),
        userId: event.userId,
        eventType,
        occurredAt:
          event.occurredAt,
        result: "PASS",
        metadata: {
          reason: event.reason,
          sessionId:
            event.sessionId
        }
      });
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

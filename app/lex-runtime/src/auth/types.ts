export type AppRole = "ADMIN" | "USER";

export type LocalUserStatus =
  | "ACTIVE"
  | "DISABLED";

export type AuthKdfPolicy = {
  algorithm: "ARGON2ID";
  memoryKiB: number;
  iterations: number;
  parallelism: number;
  keyLength: number;
  version: number;
};

export type PublicLocalUser = {
  userId: string;
  loginName: string;
  displayName: string;
  appRole: AppRole;
  status: LocalUserStatus;
  createdAt: string;
  lastLoginAt?: string;
};

export type StoredLocalUser = PublicLocalUser & {
  normalizedLoginName: string;
  updatedAt: string;
  authEpoch: number;
  kdf: AuthKdfPolicy;
  kdfSalt: Buffer;
  umkWrapNonce: Buffer;
  umkWrapCiphertext: Buffer;
  umkWrapTag: Buffer;
  umkKeyVersion: number;
};

export type AuthSessionView = {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActivityAt: string;
  lastFullAuthenticationAt: string;
  idleExpiresAt: string;
  overallExpiresAt: string;
};

export type AuthenticatedContext = {
  user: PublicLocalUser;
  session: AuthSessionView;
};

export type AuthSuccess = AuthenticatedContext & {
  sessionToken: string;
};

export type AuthStatus = {
  initialized: boolean;
  requiresBootstrap: boolean;
};

export type AuthClock = {
  now(): number;
};

export type AuthSessionPolicy = {
  idleTimeoutMs: number;
  overallTimeoutMs: number;
};

export const DEFAULT_AUTH_SESSION_POLICY:
  AuthSessionPolicy = {
    idleTimeoutMs: 15 * 60 * 1000,
    overallTimeoutMs: 8 * 60 * 60 * 1000
  };

export const DEFAULT_AUTH_KDF:
  AuthKdfPolicy = {
    algorithm: "ARGON2ID",
    memoryKiB: 64 * 1024,
    iterations: 3,
    parallelism: 1,
    keyLength: 32,
    version: 1
  };

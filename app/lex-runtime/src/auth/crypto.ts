import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes
} from "node:crypto";
import * as nodeCrypto from "node:crypto";
import type {
  AuthKdfPolicy,
  StoredLocalUser
} from "./types.js";

type NativeArgon2 = (
  algorithm: "argon2id",
  parameters: {
    message: Buffer;
    nonce: Buffer;
    parallelism: number;
    tagLength: number;
    memory: number;
    passes: number;
  },
  callback: (
    error: Error | null,
    derivedKey: Buffer
  ) => void
) => void;

function nativeArgon2(): NativeArgon2 {
  const candidate = (
    nodeCrypto as typeof nodeCrypto & {
      argon2?: NativeArgon2;
    }
  ).argon2;
  if (!candidate) {
    throw new Error(
      "ARGON2_RUNTIME_UNAVAILABLE_NODE_24_7_REQUIRED"
    );
  }
  return candidate;
}

export function normalizeLoginName(
  value: string
): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("pl-PL");
}

export function isValidLoginName(
  normalized: string
): boolean {
  const length = Array.from(normalized).length;
  return (
    length >= 3 &&
    length <= 64 &&
    /^[\p{L}\p{N}._-]+$/u.test(normalized)
  );
}

export function normalizePassword(
  value: string
): string {
  return value.normalize("NFKC");
}

const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "qwerty123456789",
  "123456789012345",
  "administrator123",
  "lexmachina12345"
]);

export function validateNewPassword(
  value: string
): string {
  const normalized = normalizePassword(value);
  const length = Array.from(normalized).length;
  if (length < 10 || length > 128) {
    throw new Error("PASSWORD_POLICY_LENGTH");
  }
  if (
    COMMON_PASSWORDS.has(
      normalized.toLocaleLowerCase("pl-PL")
    )
  ) {
    throw new Error("PASSWORD_POLICY_COMMON");
  }
  return normalized;
}

export function validateDisplayName(
  value: string
): string {
  const normalized = value
    .normalize("NFKC")
    .trim();
  const length = Array.from(normalized).length;
  if (length < 1 || length > 120) {
    throw new Error("INVALID_DISPLAY_NAME");
  }
  return normalized;
}

export async function derivePasswordKey(
  password: string,
  salt: Buffer,
  policy: AuthKdfPolicy
): Promise<Buffer> {
  const message = Buffer.from(
    normalizePassword(password),
    "utf8"
  );
  try {
    return await new Promise<Buffer>(
      (resolve, reject) => {
        nativeArgon2()(
          "argon2id",
          {
            message,
            nonce: salt,
            parallelism:
              policy.parallelism,
            tagLength: policy.keyLength,
            memory: policy.memoryKiB,
            passes: policy.iterations
          },
          (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey);
          }
        );
      }
    );
  } finally {
    message.fill(0);
  }
}

function umkAad(args: {
  userId: string;
  normalizedLoginName: string;
  keyVersion: number;
}): Buffer {
  return Buffer.from(
    [
      "lex-auth-umk-v1",
      args.userId,
      args.normalizedLoginName,
      String(args.keyVersion)
    ].join("\u0000"),
    "utf8"
  );
}

export type UmkEnvelope = {
  nonce: Buffer;
  ciphertext: Buffer;
  tag: Buffer;
};

export function encryptUserMasterKey(
  keyEncryptionKey: Buffer,
  userMasterKey: Buffer,
  args: {
    userId: string;
    normalizedLoginName: string;
    keyVersion: number;
  }
): UmkEnvelope {
  const nonce = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    keyEncryptionKey,
    nonce
  );
  cipher.setAAD(umkAad(args));
  const ciphertext = Buffer.concat([
    cipher.update(userMasterKey),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return {
    nonce,
    ciphertext,
    tag
  };
}

export function decryptUserMasterKey(
  keyEncryptionKey: Buffer,
  user: Pick<
    StoredLocalUser,
    | "userId"
    | "normalizedLoginName"
    | "umkWrapNonce"
    | "umkWrapCiphertext"
    | "umkWrapTag"
    | "umkKeyVersion"
  >
): Buffer {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyEncryptionKey,
    user.umkWrapNonce
  );
  decipher.setAAD(
    umkAad({
      userId: user.userId,
      normalizedLoginName:
        user.normalizedLoginName,
      keyVersion: user.umkKeyVersion
    })
  );
  decipher.setAuthTag(user.umkWrapTag);
  return Buffer.concat([
    decipher.update(user.umkWrapCiphertext),
    decipher.final()
  ]);
}

export function randomUserMasterKey(): Buffer {
  return randomBytes(32);
}

export function randomKdfSalt(): Buffer {
  return randomBytes(16);
}


export class PasswordKdfExecutor {
  private active = 0;
  private readonly queue:
    Array<{
      resolve: () => void;
      reject: (error: Error) => void;
    }> = [];

  constructor(
    private readonly maxConcurrent = 2,
    private readonly maxQueued = 16
  ) {
    if (
      maxConcurrent < 1 ||
      maxQueued < 0
    ) {
      throw new Error(
        "INVALID_KDF_EXECUTOR_LIMITS"
      );
    }
  }

  async derive(
    password: string,
    salt: Buffer,
    policy: AuthKdfPolicy
  ): Promise<Buffer> {
    await this.acquire();
    try {
      return await derivePasswordKey(
        password,
        salt,
        policy
      );
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    if (
      this.active <
      this.maxConcurrent
    ) {
      this.active += 1;
      return Promise.resolve();
    }
    if (
      this.queue.length >=
      this.maxQueued
    ) {
      return Promise.reject(
        new Error("AUTH_KDF_BUSY")
      );
    }
    return new Promise<void>(
      (resolve, reject) => {
        this.queue.push({
          resolve,
          reject
        });
      }
    );
  }

  private release(): void {
    this.active -= 1;
    const next =
      this.queue.shift();
    if (next) {
      this.active += 1;
      next.resolve();
    }
  }
}


const RECOVERY_PREFIX =
  "LMR1_";

function recoveryAad(args: {
  userId: string;
  keyVersion: number;
}): Buffer {
  return Buffer.from(
    [
      "lex-auth-recovery-v1",
      args.userId,
      String(args.keyVersion)
    ].join("\u0000"),
    "utf8"
  );
}

export function generateRecoveryCode(): string {
  return (
    RECOVERY_PREFIX +
    randomBytes(32).toString(
      "base64url"
    )
  );
}

export function randomRecoverySalt(): Buffer {
  return randomBytes(16);
}

function recoverySecretBytes(
  recoveryCode: string
): Buffer {
  const match =
    /^LMR1_([A-Za-z0-9_-]{43})$/
      .exec(
        recoveryCode.trim()
      );
  if (!match) {
    throw new Error(
      "INVALID_RECOVERY_CODE_FORMAT"
    );
  }
  const secret =
    Buffer.from(
      match[1]!,
      "base64url"
    );
  if (
    secret.byteLength !== 32
  ) {
    secret.fill(0);
    throw new Error(
      "INVALID_RECOVERY_CODE_FORMAT"
    );
  }
  return secret;
}

export function deriveRecoveryKey(
  recoveryCode: string,
  salt: Buffer,
  args: {
    userId: string;
    keyVersion: number;
  }
): Buffer {
  const secret =
    recoverySecretBytes(
      recoveryCode
    );
  try {
    return Buffer.from(
      hkdfSync(
        "sha256",
        secret,
        salt,
        Buffer.from(
          [
            "lex/recovery-umk/v1",
            args.userId,
            String(
              args.keyVersion
            )
          ].join("\u0000"),
          "utf8"
        ),
        32
      )
    );
  } finally {
    secret.fill(0);
  }
}

export function encryptRecoveryUserMasterKey(
  recoveryKey: Buffer,
  userMasterKey: Buffer,
  args: {
    userId: string;
    keyVersion: number;
  }
): UmkEnvelope {
  if (
    recoveryKey.byteLength !==
      32
  ) {
    throw new Error(
      "INVALID_RECOVERY_KEY"
    );
  }
  const nonce =
    randomBytes(12);
  const cipher =
    createCipheriv(
      "aes-256-gcm",
      recoveryKey,
      nonce
    );
  cipher.setAAD(
    recoveryAad(args)
  );
  const ciphertext =
    Buffer.concat([
      cipher.update(
        userMasterKey
      ),
      cipher.final()
    ]);
  return {
    nonce,
    ciphertext,
    tag: cipher.getAuthTag()
  };
}

export function decryptRecoveryUserMasterKey(
  recoveryKey: Buffer,
  envelope: {
    nonce: Buffer;
    ciphertext: Buffer;
    tag: Buffer;
  },
  args: {
    userId: string;
    keyVersion: number;
  }
): Buffer {
  if (
    recoveryKey.byteLength !==
      32
  ) {
    throw new Error(
      "INVALID_RECOVERY_KEY"
    );
  }
  const decipher =
    createDecipheriv(
      "aes-256-gcm",
      recoveryKey,
      envelope.nonce
    );
  decipher.setAAD(
    recoveryAad(args)
  );
  decipher.setAuthTag(
    envelope.tag
  );
  return Buffer.concat([
    decipher.update(
      envelope.ciphertext
    ),
    decipher.final()
  ]);
}

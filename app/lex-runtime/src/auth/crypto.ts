import {
  createCipheriv,
  createDecipheriv,
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
  if (length < 15 || length > 128) {
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

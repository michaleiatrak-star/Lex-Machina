import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import * as nodeCrypto from "node:crypto";
function nativeArgon2() {
    const candidate = nodeCrypto.argon2;
    if (!candidate) {
        throw new Error("ARGON2_RUNTIME_UNAVAILABLE_NODE_24_7_REQUIRED");
    }
    return candidate;
}
export function normalizeLoginName(value) {
    return value
        .normalize("NFKC")
        .trim()
        .toLocaleLowerCase("pl-PL");
}
export function isValidLoginName(normalized) {
    const length = Array.from(normalized).length;
    return (length >= 3 &&
        length <= 64 &&
        /^[\p{L}\p{N}._-]+$/u.test(normalized));
}
export function normalizePassword(value) {
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
export function validateNewPassword(value) {
    const normalized = normalizePassword(value);
    const length = Array.from(normalized).length;
    if (length < 10 || length > 128) {
        throw new Error("PASSWORD_POLICY_LENGTH");
    }
    if (COMMON_PASSWORDS.has(normalized.toLocaleLowerCase("pl-PL"))) {
        throw new Error("PASSWORD_POLICY_COMMON");
    }
    return normalized;
}
export function validateDisplayName(value) {
    const normalized = value
        .normalize("NFKC")
        .trim();
    const length = Array.from(normalized).length;
    if (length < 1 || length > 120) {
        throw new Error("INVALID_DISPLAY_NAME");
    }
    return normalized;
}
export async function derivePasswordKey(password, salt, policy) {
    const message = Buffer.from(normalizePassword(password), "utf8");
    try {
        return await new Promise((resolve, reject) => {
            nativeArgon2()("argon2id", {
                message,
                nonce: salt,
                parallelism: policy.parallelism,
                tagLength: policy.keyLength,
                memory: policy.memoryKiB,
                passes: policy.iterations
            }, (error, derivedKey) => {
                if (error)
                    reject(error);
                else
                    resolve(derivedKey);
            });
        });
    }
    finally {
        message.fill(0);
    }
}
function umkAad(args) {
    return Buffer.from([
        "lex-auth-umk-v1",
        args.userId,
        args.normalizedLoginName,
        String(args.keyVersion)
    ].join("\u0000"), "utf8");
}
export function encryptUserMasterKey(keyEncryptionKey, userMasterKey, args) {
    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", keyEncryptionKey, nonce);
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
export function decryptUserMasterKey(keyEncryptionKey, user) {
    const decipher = createDecipheriv("aes-256-gcm", keyEncryptionKey, user.umkWrapNonce);
    decipher.setAAD(umkAad({
        userId: user.userId,
        normalizedLoginName: user.normalizedLoginName,
        keyVersion: user.umkKeyVersion
    }));
    decipher.setAuthTag(user.umkWrapTag);
    return Buffer.concat([
        decipher.update(user.umkWrapCiphertext),
        decipher.final()
    ]);
}
export function randomUserMasterKey() {
    return randomBytes(32);
}
export function randomKdfSalt() {
    return randomBytes(16);
}
export class PasswordKdfExecutor {
    maxConcurrent;
    maxQueued;
    active = 0;
    queue = [];
    constructor(maxConcurrent = 2, maxQueued = 16) {
        this.maxConcurrent = maxConcurrent;
        this.maxQueued = maxQueued;
        if (maxConcurrent < 1 ||
            maxQueued < 0) {
            throw new Error("INVALID_KDF_EXECUTOR_LIMITS");
        }
    }
    async derive(password, salt, policy) {
        await this.acquire();
        try {
            return await derivePasswordKey(password, salt, policy);
        }
        finally {
            this.release();
        }
    }
    acquire() {
        if (this.active <
            this.maxConcurrent) {
            this.active += 1;
            return Promise.resolve();
        }
        if (this.queue.length >=
            this.maxQueued) {
            return Promise.reject(new Error("AUTH_KDF_BUSY"));
        }
        return new Promise((resolve, reject) => {
            this.queue.push({
                resolve,
                reject
            });
        });
    }
    release() {
        this.active -= 1;
        const next = this.queue.shift();
        if (next) {
            this.active += 1;
            next.resolve();
        }
    }
}
const RECOVERY_PREFIX = "LMR1_";
function recoveryAad(args) {
    return Buffer.from([
        "lex-auth-recovery-v1",
        args.userId,
        String(args.keyVersion)
    ].join("\u0000"), "utf8");
}
export function generateRecoveryCode() {
    return (RECOVERY_PREFIX +
        randomBytes(32).toString("base64url"));
}
export function randomRecoverySalt() {
    return randomBytes(16);
}
function recoverySecretBytes(recoveryCode) {
    const match = /^LMR1_([A-Za-z0-9_-]{43})$/
        .exec(recoveryCode.trim());
    if (!match) {
        throw new Error("INVALID_RECOVERY_CODE_FORMAT");
    }
    const secret = Buffer.from(match[1], "base64url");
    if (secret.byteLength !== 32) {
        secret.fill(0);
        throw new Error("INVALID_RECOVERY_CODE_FORMAT");
    }
    return secret;
}
export function deriveRecoveryKey(recoveryCode, salt, args) {
    const secret = recoverySecretBytes(recoveryCode);
    try {
        return Buffer.from(hkdfSync("sha256", secret, salt, Buffer.from([
            "lex/recovery-umk/v1",
            args.userId,
            String(args.keyVersion)
        ].join("\u0000"), "utf8"), 32));
    }
    finally {
        secret.fill(0);
    }
}
export function encryptRecoveryUserMasterKey(recoveryKey, userMasterKey, args) {
    if (recoveryKey.byteLength !==
        32) {
        throw new Error("INVALID_RECOVERY_KEY");
    }
    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", recoveryKey, nonce);
    cipher.setAAD(recoveryAad(args));
    const ciphertext = Buffer.concat([
        cipher.update(userMasterKey),
        cipher.final()
    ]);
    return {
        nonce,
        ciphertext,
        tag: cipher.getAuthTag()
    };
}
export function decryptRecoveryUserMasterKey(recoveryKey, envelope, args) {
    if (recoveryKey.byteLength !==
        32) {
        throw new Error("INVALID_RECOVERY_KEY");
    }
    const decipher = createDecipheriv("aes-256-gcm", recoveryKey, envelope.nonce);
    decipher.setAAD(recoveryAad(args));
    decipher.setAuthTag(envelope.tag);
    return Buffer.concat([
        decipher.update(envelope.ciphertext),
        decipher.final()
    ]);
}

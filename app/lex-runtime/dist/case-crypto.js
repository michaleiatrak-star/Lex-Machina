import { createCipheriv, createDecipheriv, createPrivateKey, createPublicKey, diffieHellman, generateKeyPairSync, hkdfSync, randomBytes } from "node:crypto";
export const CASE_KEY_BYTES = 32;
function derive(ikm, salt, info) {
    return Buffer.from(hkdfSync("sha256", ikm, salt, Buffer.from(info, "utf8"), 32));
}
function encrypt(key, plaintext, aad) {
    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, nonce);
    cipher.setAAD(aad);
    const ciphertext = Buffer.concat([
        cipher.update(plaintext),
        cipher.final()
    ]);
    return {
        nonce,
        ciphertext,
        tag: cipher.getAuthTag()
    };
}
function decrypt(key, envelope, aad) {
    const decipher = createDecipheriv("aes-256-gcm", key, envelope.nonce);
    decipher.setAAD(aad);
    decipher.setAuthTag(envelope.tag);
    return Buffer.concat([
        decipher.update(envelope.ciphertext),
        decipher.final()
    ]);
}
function sharingPrivateAad(userId, keyVersion) {
    return Buffer.from([
        "lex-user-sharing-private-v1",
        userId,
        String(keyVersion)
    ].join("\u0000"), "utf8");
}
export function generateUserSharingKeys(userMasterKey, userId, keyVersion = 1) {
    const pair = generateKeyPairSync("x25519");
    const publicKeyDer = pair.publicKey
        .export({
        type: "spki",
        format: "der"
    });
    const privateKeyDer = pair.privateKey
        .export({
        type: "pkcs8",
        format: "der"
    });
    const wrapKey = derive(userMasterKey, Buffer.from(userId, "utf8"), "lex/user-sharing-private/v1");
    try {
        return {
            publicKeyDer: Buffer.from(publicKeyDer),
            privateKeyEnvelope: encrypt(wrapKey, Buffer.from(privateKeyDer), sharingPrivateAad(userId, keyVersion)),
            keyVersion
        };
    }
    finally {
        wrapKey.fill(0);
        privateKeyDer.fill(0);
    }
}
export function unwrapUserSharingPrivateKey(userMasterKey, userId, keyVersion, envelope) {
    const wrapKey = derive(userMasterKey, Buffer.from(userId, "utf8"), "lex/user-sharing-private/v1");
    let privateKeyDer;
    try {
        privateKeyDer = decrypt(wrapKey, envelope, sharingPrivateAad(userId, keyVersion));
        return createPrivateKey({
            key: privateKeyDer,
            format: "der",
            type: "pkcs8"
        });
    }
    finally {
        wrapKey.fill(0);
        privateKeyDer?.fill(0);
    }
}
function caseAad(args) {
    return Buffer.from([
        "lex-case-envelope-v1",
        args.algorithm,
        args.userId,
        args.caseId,
        String(args.keyVersion)
    ].join("\u0000"), "utf8");
}
export function randomCaseDataKey() {
    return randomBytes(CASE_KEY_BYTES);
}
export function wrapCaseKeyForSessionUser(userMasterKey, args) {
    const algorithm = "UMK-HKDF-SHA256-AES-256-GCM";
    const key = derive(userMasterKey, Buffer.from(args.caseId, "utf8"), "lex/case-wrap/v1");
    try {
        return {
            algorithm,
            ...encrypt(key, args.caseDataKey, caseAad({
                userId: args.userId,
                caseId: args.caseId,
                keyVersion: args.keyVersion,
                algorithm
            })),
            keyVersion: args.keyVersion
        };
    }
    finally {
        key.fill(0);
    }
}
export function unwrapCaseKeyForSessionUser(userMasterKey, args) {
    if (args.envelope.algorithm !==
        "UMK-HKDF-SHA256-AES-256-GCM") {
        throw new Error("CASE_ENVELOPE_ALGORITHM_MISMATCH");
    }
    const key = derive(userMasterKey, Buffer.from(args.caseId, "utf8"), "lex/case-wrap/v1");
    try {
        return decrypt(key, args.envelope, caseAad({
            userId: args.userId,
            caseId: args.caseId,
            keyVersion: args.keyVersion,
            algorithm: args.envelope.algorithm
        }));
    }
    finally {
        key.fill(0);
    }
}
export function wrapCaseKeyForOfflineUser(targetPublicKeyDer, args) {
    const algorithm = "X25519-HKDF-SHA256-AES-256-GCM";
    const ephemeral = generateKeyPairSync("x25519");
    const targetPublicKey = createPublicKey({
        key: targetPublicKeyDer,
        format: "der",
        type: "spki"
    });
    const shared = diffieHellman({
        privateKey: ephemeral.privateKey,
        publicKey: targetPublicKey
    });
    const wrapKey = derive(shared, Buffer.from(args.caseId, "utf8"), "lex/case-share/v1");
    shared.fill(0);
    try {
        const encrypted = encrypt(wrapKey, args.caseDataKey, caseAad({
            userId: args.targetUserId,
            caseId: args.caseId,
            keyVersion: args.keyVersion,
            algorithm
        }));
        return {
            algorithm,
            ...encrypted,
            ephemeralPublicKeyDer: Buffer.from(ephemeral.publicKey
                .export({
                type: "spki",
                format: "der"
            })),
            keyVersion: args.keyVersion
        };
    }
    finally {
        wrapKey.fill(0);
    }
}
export function unwrapCaseKeyForOfflineUser(privateKey, args) {
    if (args.envelope.algorithm !==
        "X25519-HKDF-SHA256-AES-256-GCM" ||
        !args.envelope
            .ephemeralPublicKeyDer) {
        throw new Error("CASE_ENVELOPE_ALGORITHM_MISMATCH");
    }
    const ephemeralPublic = createPublicKey({
        key: args.envelope
            .ephemeralPublicKeyDer,
        format: "der",
        type: "spki"
    });
    const shared = diffieHellman({
        privateKey,
        publicKey: ephemeralPublic
    });
    const wrapKey = derive(shared, Buffer.from(args.caseId, "utf8"), "lex/case-share/v1");
    shared.fill(0);
    try {
        return decrypt(wrapKey, args.envelope, caseAad({
            userId: args.userId,
            caseId: args.caseId,
            keyVersion: args.keyVersion,
            algorithm: args.envelope.algorithm
        }));
    }
    finally {
        wrapKey.fill(0);
    }
}

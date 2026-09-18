import {
  createCipheriv,
  createDecipheriv,
  createPrivateKey,
  createPublicKey,
  diffieHellman,
  generateKeyPairSync,
  hkdfSync,
  randomBytes
} from "node:crypto";

export const CASE_KEY_BYTES = 32;

export type AeadEnvelope = {
  nonce: Buffer;
  ciphertext: Buffer;
  tag: Buffer;
};

export type UserSharingKeyMaterial = {
  publicKeyDer: Buffer;
  privateKeyEnvelope: AeadEnvelope;
  keyVersion: number;
};

export type CaseKeyEnvelope = {
  algorithm:
    | "UMK-HKDF-SHA256-AES-256-GCM"
    | "X25519-HKDF-SHA256-AES-256-GCM";
  nonce: Buffer;
  ciphertext: Buffer;
  tag: Buffer;
  ephemeralPublicKeyDer?: Buffer;
  keyVersion: number;
};

function derive(
  ikm: Buffer,
  salt: Buffer,
  info: string
): Buffer {
  return Buffer.from(
    hkdfSync(
      "sha256",
      ikm,
      salt,
      Buffer.from(info, "utf8"),
      32
    )
  );
}

function encrypt(
  key: Buffer,
  plaintext: Buffer,
  aad: Buffer
): AeadEnvelope {
  const nonce = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    key,
    nonce
  );
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

function decrypt(
  key: Buffer,
  envelope: AeadEnvelope,
  aad: Buffer
): Buffer {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    envelope.nonce
  );
  decipher.setAAD(aad);
  decipher.setAuthTag(envelope.tag);
  return Buffer.concat([
    decipher.update(
      envelope.ciphertext
    ),
    decipher.final()
  ]);
}

function sharingPrivateAad(
  userId: string,
  keyVersion: number
): Buffer {
  return Buffer.from(
    [
      "lex-user-sharing-private-v1",
      userId,
      String(keyVersion)
    ].join("\u0000"),
    "utf8"
  );
}

export function generateUserSharingKeys(
  userMasterKey: Buffer,
  userId: string,
  keyVersion = 1
): UserSharingKeyMaterial {
  const pair =
    generateKeyPairSync("x25519");
  const publicKeyDer = pair.publicKey
    .export({
      type: "spki",
      format: "der"
    }) as Buffer;
  const privateKeyDer = pair.privateKey
    .export({
      type: "pkcs8",
      format: "der"
    }) as Buffer;

  const wrapKey = derive(
    userMasterKey,
    Buffer.from(userId, "utf8"),
    "lex/user-sharing-private/v1"
  );
  try {
    return {
      publicKeyDer:
        Buffer.from(publicKeyDer),
      privateKeyEnvelope:
        encrypt(
          wrapKey,
          Buffer.from(privateKeyDer),
          sharingPrivateAad(
            userId,
            keyVersion
          )
        ),
      keyVersion
    };
  } finally {
    wrapKey.fill(0);
    privateKeyDer.fill(0);
  }
}

export function unwrapUserSharingPrivateKey(
  userMasterKey: Buffer,
  userId: string,
  keyVersion: number,
  envelope: AeadEnvelope
) {
  const wrapKey = derive(
    userMasterKey,
    Buffer.from(userId, "utf8"),
    "lex/user-sharing-private/v1"
  );
  let privateKeyDer: Buffer | undefined;
  try {
    privateKeyDer = decrypt(
      wrapKey,
      envelope,
      sharingPrivateAad(
        userId,
        keyVersion
      )
    );
    return createPrivateKey({
      key: privateKeyDer,
      format: "der",
      type: "pkcs8"
    });
  } finally {
    wrapKey.fill(0);
    privateKeyDer?.fill(0);
  }
}

function caseAad(args: {
  userId: string;
  caseId: string;
  keyVersion: number;
  algorithm: CaseKeyEnvelope["algorithm"];
}): Buffer {
  return Buffer.from(
    [
      "lex-case-envelope-v1",
      args.algorithm,
      args.userId,
      args.caseId,
      String(args.keyVersion)
    ].join("\u0000"),
    "utf8"
  );
}

export function randomCaseDataKey():
  Buffer {
  return randomBytes(
    CASE_KEY_BYTES
  );
}

export function wrapCaseKeyForSessionUser(
  userMasterKey: Buffer,
  args: {
    userId: string;
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }
): CaseKeyEnvelope {
  const algorithm =
    "UMK-HKDF-SHA256-AES-256-GCM" as const;
  const key = derive(
    userMasterKey,
    Buffer.from(
      args.caseId,
      "utf8"
    ),
    "lex/case-wrap/v1"
  );
  try {
    return {
      algorithm,
      ...encrypt(
        key,
        args.caseDataKey,
        caseAad({
          userId: args.userId,
          caseId: args.caseId,
          keyVersion:
            args.keyVersion,
          algorithm
        })
      ),
      keyVersion:
        args.keyVersion
    };
  } finally {
    key.fill(0);
  }
}

export function unwrapCaseKeyForSessionUser(
  userMasterKey: Buffer,
  args: {
    userId: string;
    caseId: string;
    keyVersion: number;
    envelope: CaseKeyEnvelope;
  }
): Buffer {
  if (
    args.envelope.algorithm !==
      "UMK-HKDF-SHA256-AES-256-GCM"
  ) {
    throw new Error(
      "CASE_ENVELOPE_ALGORITHM_MISMATCH"
    );
  }
  const key = derive(
    userMasterKey,
    Buffer.from(
      args.caseId,
      "utf8"
    ),
    "lex/case-wrap/v1"
  );
  try {
    return decrypt(
      key,
      args.envelope,
      caseAad({
        userId: args.userId,
        caseId: args.caseId,
        keyVersion:
          args.keyVersion,
        algorithm:
          args.envelope.algorithm
      })
    );
  } finally {
    key.fill(0);
  }
}

export function wrapCaseKeyForOfflineUser(
  targetPublicKeyDer: Buffer,
  args: {
    targetUserId: string;
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }
): CaseKeyEnvelope {
  const algorithm =
    "X25519-HKDF-SHA256-AES-256-GCM" as const;
  const ephemeral =
    generateKeyPairSync("x25519");
  const targetPublicKey =
    createPublicKey({
      key: targetPublicKeyDer,
      format: "der",
      type: "spki"
    });
  const shared = diffieHellman({
    privateKey:
      ephemeral.privateKey,
    publicKey:
      targetPublicKey
  });
  const wrapKey = derive(
    shared,
    Buffer.from(
      args.caseId,
      "utf8"
    ),
    "lex/case-share/v1"
  );
  shared.fill(0);

  try {
    const encrypted = encrypt(
      wrapKey,
      args.caseDataKey,
      caseAad({
        userId:
          args.targetUserId,
        caseId: args.caseId,
        keyVersion:
          args.keyVersion,
        algorithm
      })
    );
    return {
      algorithm,
      ...encrypted,
      ephemeralPublicKeyDer:
        Buffer.from(
          ephemeral.publicKey
            .export({
              type: "spki",
              format: "der"
            }) as Buffer
        ),
      keyVersion:
        args.keyVersion
    };
  } finally {
    wrapKey.fill(0);
  }
}

export function unwrapCaseKeyForOfflineUser(
  privateKey: ReturnType<typeof createPrivateKey>,
  args: {
    userId: string;
    caseId: string;
    keyVersion: number;
    envelope: CaseKeyEnvelope;
  }
): Buffer {
  if (
    args.envelope.algorithm !==
      "X25519-HKDF-SHA256-AES-256-GCM" ||
    !args.envelope
      .ephemeralPublicKeyDer
  ) {
    throw new Error(
      "CASE_ENVELOPE_ALGORITHM_MISMATCH"
    );
  }

  const ephemeralPublic =
    createPublicKey({
      key:
        args.envelope
          .ephemeralPublicKeyDer,
      format: "der",
      type: "spki"
    });
  const shared =
    diffieHellman({
      privateKey,
      publicKey:
        ephemeralPublic
    });
  const wrapKey = derive(
    shared,
    Buffer.from(
      args.caseId,
      "utf8"
    ),
    "lex/case-share/v1"
  );
  shared.fill(0);

  try {
    return decrypt(
      wrapKey,
      args.envelope,
      caseAad({
        userId: args.userId,
        caseId: args.caseId,
        keyVersion:
          args.keyVersion,
        algorithm:
          args.envelope.algorithm
      })
    );
  } finally {
    wrapKey.fill(0);
  }
}

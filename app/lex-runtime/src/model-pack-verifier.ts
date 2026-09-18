import {
  createHash,
  createPublicKey,
  verify as verifySignature
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type TrustedModelPackKey = {
  keyId: string;
  publicKeyPem: string;
};

export type LocalModelUpdateFamily =
  | "BIELIK"
  | "MISTRAL";

export function modelUpdateFamilyForId(
  modelId: string
): LocalModelUpdateFamily | null {
  const normalized =
    modelId.trim().toLowerCase();
  if (
    /^local\/bielik-/.test(
      normalized
    )
  ) {
    return "BIELIK";
  }
  if (
    /^local\/(?:mistral|ministral)-/.test(
      normalized
    )
  ) {
    return "MISTRAL";
  }
  return null;
}

export type ModelPackEntry = {
  id: string;
  family?: LocalModelUpdateFamily;
  displayName: string;
  filename: string;
  url: string;
  sha256: string;
  bytes?: number;
  quantization: string;
  nativeContext: number;
  minimumContext: number;
  maximumRuntimeContext: number;
  license: string;
};

export type ModelPackIndex = {
  schemaVersion: 1;
  kind: "LEX_MACHINA_MODEL_PACK_INDEX";
  version: string;
  compatibility: {
    minAppVersion: string;
    maxAppVersion?: string;
  };
  models: ModelPackEntry[];
};

export type VerifiedModelPackIndex = {
  index: ModelPackIndex;
  signerKeyId: string;
  indexSha256: string;
};

type ModelPackTrustManifest = {
  modelPackUpdate?: {
    verification?: unknown;
    trustedEd25519PublicKeys?: unknown;
    temporaryUnsignedAllowed?: unknown;
  };
};

type SignatureEnvelope = {
  schemaVersion?: unknown;
  algorithm?: unknown;
  keyId?: unknown;
  signature?: unknown;
};

const SAFE_KEY_ID =
  /^[A-Za-z0-9._-]{3,96}$/;
const SAFE_MODEL_ID =
  /^local\/[a-z0-9][a-z0-9._-]{1,120}$/;
const SAFE_FILENAME =
  /^[A-Za-z0-9._-]+\.gguf$/i;
const SAFE_TEXT =
  /^[^\x00-\x1f\x7f]{1,200}$/;
const SHA256 =
  /^[a-f0-9]{64}$/i;
const APP_VERSION =
  /^\d+\.\d+\.\d+$/;

function defaultManifestPath(): string {
  const runtimeRoot =
    process.env
      .LEX_RUNTIME_ROOT
      ?.trim();
  if (!runtimeRoot) {
    throw new Error(
      "MODEL_PACK_RUNTIME_ROOT_MISSING"
    );
  }
  return path.join(
    path.resolve(runtimeRoot),
    "release-source.json"
  );
}

function parseTrustedKeys(
  value: unknown
): TrustedModelPackKey[] {
  if (!Array.isArray(value)) {
    throw new Error(
      "MODEL_PACK_SIGNER_POLICY_MISSING"
    );
  }

  const keys:
    TrustedModelPackKey[] = [];
  const seen =
    new Set<string>();

  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "MODEL_PACK_SIGNER_POLICY_MISSING"
      );
    }
    const record =
      item as Record<string, unknown>;
    const keyId =
      typeof record.keyId === "string"
        ? record.keyId.trim()
        : "";
    const publicKeyPem =
      typeof record.publicKeyPem ===
        "string"
        ? record.publicKeyPem.trim()
        : "";

    if (
      !SAFE_KEY_ID.test(keyId) ||
      seen.has(keyId) ||
      !publicKeyPem.includes(
        "-----BEGIN PUBLIC KEY-----"
      ) ||
      !publicKeyPem.includes(
        "-----END PUBLIC KEY-----"
      )
    ) {
      throw new Error(
        "MODEL_PACK_SIGNER_POLICY_MISSING"
      );
    }

    const publicKey =
      createPublicKey(
        publicKeyPem
      );
    if (
      publicKey.asymmetricKeyType !==
        "ed25519"
    ) {
      throw new Error(
        "MODEL_PACK_SIGNER_POLICY_MISSING"
      );
    }

    seen.add(keyId);
    keys.push({
      keyId,
      publicKeyPem
    });
  }

  if (keys.length === 0) {
    throw new Error(
      "MODEL_PACK_SIGNER_POLICY_MISSING"
    );
  }
  return keys;
}

function modelPackVerificationPolicy(
  manifestPath: string =
    defaultManifestPath()
): {
  mode: "SIGNED_REQUIRED" | "UNSIGNED_ALLOWED";
  keys: TrustedModelPackKey[];
} {
  let manifest:
    ModelPackTrustManifest;
  try {
    manifest = JSON.parse(
      fs.readFileSync(
        manifestPath,
        "utf8"
      )
    ) as ModelPackTrustManifest;
  } catch {
    throw new Error(
      "MODEL_PACK_SIGNER_POLICY_MISSING"
    );
  }

  if (
    manifest.modelPackUpdate
      ?.verification ===
      "SHA256_AND_ED25519_SIGNED_INDEX"
  ) {
    return {
      mode: "SIGNED_REQUIRED",
      keys: parseTrustedKeys(
        manifest.modelPackUpdate
          .trustedEd25519PublicKeys
      )
    };
  }

  if (
    manifest.modelPackUpdate
      ?.verification ===
      "SHA256_AND_OPTIONAL_ED25519_INDEX" &&
    manifest.modelPackUpdate
      .temporaryUnsignedAllowed === true
  ) {
    let keys:
      TrustedModelPackKey[] = [];
    try {
      keys = parseTrustedKeys(
        manifest.modelPackUpdate
          .trustedEd25519PublicKeys
      );
    } catch {
      keys = [];
    }
    return {
      mode: "UNSIGNED_ALLOWED",
      keys
    };
  }

  throw new Error(
    "MODEL_PACK_SIGNER_POLICY_MISSING"
  );
}

export function modelPackSignatureMode(
  manifestPath?: string
): "SIGNED_REQUIRED" | "UNSIGNED_ALLOWED" {
  return modelPackVerificationPolicy(
    manifestPath
  ).mode;
}

export function trustedModelPackKeys(
  manifestPath: string =
    defaultManifestPath()
): TrustedModelPackKey[] {
  const policy =
    modelPackVerificationPolicy(
      manifestPath
    );
  if (
    policy.keys.length === 0
  ) {
    throw new Error(
      "MODEL_PACK_SIGNER_POLICY_MISSING"
    );
  }
  return policy.keys;
}

export function modelPackTrustReady(
  manifestPath?: string
): boolean {
  try {
    modelPackVerificationPolicy(
      manifestPath
    );
    return true;
  } catch {
    return false;
  }
}

function parseSignature(
  data: Uint8Array
): {
  keyId: string;
  signature: Buffer;
} {
  let envelope:
    SignatureEnvelope;
  try {
    envelope = JSON.parse(
      Buffer.from(data)
        .toString("utf8")
    ) as SignatureEnvelope;
  } catch {
    throw new Error(
      "MODEL_PACK_SIGNATURE_INVALID"
    );
  }

  if (
    envelope.schemaVersion !== 1 ||
    envelope.algorithm !==
      "Ed25519" ||
    typeof envelope.keyId !==
      "string" ||
    !SAFE_KEY_ID.test(
      envelope.keyId
    ) ||
    typeof envelope.signature !==
      "string" ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(
      envelope.signature
    )
  ) {
    throw new Error(
      "MODEL_PACK_SIGNATURE_INVALID"
    );
  }

  const signature =
    Buffer.from(
      envelope.signature,
      "base64"
    );
  if (
    signature.byteLength !== 64
  ) {
    throw new Error(
      "MODEL_PACK_SIGNATURE_INVALID"
    );
  }

  return {
    keyId:
      envelope.keyId,
    signature
  };
}

function parseHttpsUrl(
  value: unknown
): string | null {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    value.length > 2_048
  ) {
    return null;
  }
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !url.hostname
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function positiveInteger(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0
  );
}

export function parseModelPackIndex(
  data: Uint8Array
): ModelPackIndex {
  let value: unknown;
  try {
    value = JSON.parse(
      Buffer.from(data)
        .toString("utf8")
    );
  } catch {
    throw new Error(
      "MODEL_PACK_INDEX_INVALID"
    );
  }

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "MODEL_PACK_INDEX_INVALID"
    );
  }

  const record =
    value as Record<string, unknown>;
  const compatibility =
    record.compatibility &&
    typeof record.compatibility ===
      "object" &&
    !Array.isArray(
      record.compatibility
    )
      ? record.compatibility as
          Record<string, unknown>
      : null;
  const models =
    Array.isArray(record.models)
      ? record.models
      : null;

  if (
    record.schemaVersion !== 1 ||
    record.kind !==
      "LEX_MACHINA_MODEL_PACK_INDEX" ||
    typeof record.version !==
      "string" ||
    !APP_VERSION.test(
      record.version
    ) ||
    !compatibility ||
    typeof compatibility
      .minAppVersion !==
      "string" ||
    !APP_VERSION.test(
      compatibility.minAppVersion
    ) ||
    (
      compatibility.maxAppVersion !==
        undefined &&
      (
        typeof compatibility
          .maxAppVersion !==
          "string" ||
        !APP_VERSION.test(
          compatibility
            .maxAppVersion
        )
      )
    ) ||
    !models ||
    models.length < 1 ||
    models.length > 16
  ) {
    throw new Error(
      "MODEL_PACK_INDEX_INVALID"
    );
  }

  const parsed:
    ModelPackEntry[] = [];
  const seen =
    new Set<string>();

  for (const item of models) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "MODEL_PACK_INDEX_INVALID"
      );
    }
    const model =
      item as Record<string, unknown>;
    const url =
      parseHttpsUrl(
        model.url
      );
    const inferredFamily =
      typeof model.id ===
        "string"
        ? modelUpdateFamilyForId(
            model.id
          )
        : null;
    const declaredFamily =
      model.family ===
        "BIELIK" ||
      model.family ===
        "MISTRAL"
        ? model.family
        : null;

    if (
      typeof model.id !==
        "string" ||
      !SAFE_MODEL_ID.test(
        model.id
      ) ||
      !inferredFamily ||
      (
        model.family !==
          undefined &&
        declaredFamily !==
          inferredFamily
      ) ||
      seen.has(model.id) ||
      typeof model.displayName !==
        "string" ||
      !SAFE_TEXT.test(
        model.displayName
      ) ||
      typeof model.filename !==
        "string" ||
      !SAFE_FILENAME.test(
        model.filename
      ) ||
      !url ||
      typeof model.sha256 !==
        "string" ||
      !SHA256.test(
        model.sha256
      ) ||
      !(
        model.bytes ===
          undefined ||
        positiveInteger(
          model.bytes
        )
      ) ||
      typeof model.quantization !==
        "string" ||
      !SAFE_TEXT.test(
        model.quantization
      ) ||
      !positiveInteger(
        model.nativeContext
      ) ||
      !positiveInteger(
        model.minimumContext
      ) ||
      !positiveInteger(
        model.maximumRuntimeContext
      ) ||
      Number(
        model.minimumContext
      ) >
        Number(
          model.maximumRuntimeContext
        ) ||
      typeof model.license !==
        "string" ||
      !SAFE_TEXT.test(
        model.license
      )
    ) {
      throw new Error(
        "MODEL_PACK_INDEX_INVALID"
      );
    }

    seen.add(model.id);
    parsed.push({
      id: model.id,
      family:
        inferredFamily!,
      displayName:
        model.displayName,
      filename:
        model.filename,
      url,
      sha256:
        model.sha256
          .toLowerCase(),
      ...(model.bytes !== undefined
        ? {
            bytes:
              model.bytes as number
          }
        : {}),
      quantization:
        model.quantization,
      nativeContext:
        model.nativeContext as number,
      minimumContext:
        model.minimumContext as number,
      maximumRuntimeContext:
        model.maximumRuntimeContext as number,
      license:
        model.license
    });
  }

  return {
    schemaVersion: 1,
    kind:
      "LEX_MACHINA_MODEL_PACK_INDEX",
    version:
      record.version,
    compatibility: {
      minAppVersion:
        compatibility.minAppVersion,
      ...(typeof compatibility
        .maxAppVersion === "string"
        ? {
            maxAppVersion:
              compatibility
                .maxAppVersion
          }
        : {})
    },
    models: parsed
  };
}

export function verifyModelPackIndex(
  indexBytes: Uint8Array,
  signatureBytes: Uint8Array,
  configuredKeys?:
    readonly TrustedModelPackKey[],
  manifestPath?: string
): VerifiedModelPackIndex {
  const policy =
    configuredKeys
      ? {
          mode:
            "SIGNED_REQUIRED" as const,
          keys:
            parseTrustedKeys(
              configuredKeys
            )
        }
      : modelPackVerificationPolicy(
          manifestPath
        );

  if (
    policy.mode ===
      "UNSIGNED_ALLOWED" &&
    (
      signatureBytes.byteLength === 0 ||
      policy.keys.length === 0
    )
  ) {
    return {
      index:
        parseModelPackIndex(
          indexBytes
        ),
      signerKeyId:
        "UNSIGNED_ALLOWED",
      indexSha256:
        createHash("sha256")
          .update(indexBytes)
          .digest("hex")
    };
  }

  const keys =
    policy.keys;
  const envelope =
    parseSignature(
      signatureBytes
    );
  const trusted =
    keys.find(
      (key) =>
        key.keyId ===
          envelope.keyId
    );
  if (!trusted) {
    throw new Error(
      "MODEL_PACK_SIGNER_NOT_TRUSTED"
    );
  }

  const publicKey =
    createPublicKey(
      trusted.publicKeyPem
    );
  if (
    !verifySignature(
      null,
      Buffer.from(
        indexBytes
      ),
      publicKey,
      envelope.signature
    )
  ) {
    throw new Error(
      "MODEL_PACK_SIGNATURE_INVALID"
    );
  }

  return {
    index:
      parseModelPackIndex(
        indexBytes
      ),
    signerKeyId:
      trusted.keyId,
    indexSha256:
      createHash("sha256")
        .update(indexBytes)
        .digest("hex")
  };
}

import {
  createHash,
  createPublicKey,
  verify as verifySignature
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type SkillIndexEntry = {
  id: string;
  version: string;
  sha256: string;
  dependencies: string[];
};

export type SkillUpdateIndex = {
  schemaVersion: 1;
  kind: "LEX_MACHINA_SKILLS_INDEX";
  version: string;
  bundle: {
    filename: string;
    sha256: string;
    bytes: number;
  };
  compatibility: {
    minAppVersion: string;
    maxAppVersion?: string;
  };
  skills: SkillIndexEntry[];
};

export type VerifiedSkillIndex = {
  index: SkillUpdateIndex;
  signerKeyId: string;
  indexSha256: string;
};

export type TrustedSkillUpdateKey = {
  keyId: string;
  publicKeyPem: string;
};

type SkillUpdateTrustManifest = {
  skillUpdate?: {
    verification?: unknown;
    trustedEd25519PublicKeys?: unknown;
  };
};

type DetachedSignatureEnvelope = {
  schemaVersion?: unknown;
  algorithm?: unknown;
  keyId?: unknown;
  signature?: unknown;
};

const SAFE_ID = /^[a-z0-9][a-z0-9._-]{1,159}$/i;
const SAFE_KEY_ID = /^[A-Za-z0-9._-]{3,96}$/;
const SHA256 = /^[a-f0-9]{64}$/i;
const APP_VERSION = /^\d+\.\d+\.\d+$/;

function defaultManifestPath(): string {
  const runtimeRoot =
    process.env.LEX_RUNTIME_ROOT?.trim();
  if (!runtimeRoot) {
    throw new Error(
      "SKILL_UPDATE_RUNTIME_ROOT_MISSING"
    );
  }
  return path.join(
    path.resolve(runtimeRoot),
    "release-source.json"
  );
}

function parseTrustedKeys(
  value: unknown
): TrustedSkillUpdateKey[] {
  if (!Array.isArray(value)) {
    throw new Error(
      "SKILL_UPDATE_SIGNER_POLICY_MISSING"
    );
  }
  const result: TrustedSkillUpdateKey[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "SKILL_UPDATE_SIGNER_POLICY_MISSING"
      );
    }
    const record =
      item as Record<string, unknown>;
    const keyId =
      typeof record.keyId === "string"
        ? record.keyId.trim()
        : "";
    const publicKeyPem =
      typeof record.publicKeyPem === "string"
        ? record.publicKeyPem.trim()
        : "";
    if (
      !SAFE_KEY_ID.test(keyId) ||
      !publicKeyPem.includes(
        "-----BEGIN PUBLIC KEY-----"
      ) ||
      !publicKeyPem.includes(
        "-----END PUBLIC KEY-----"
      ) ||
      seen.has(keyId)
    ) {
      throw new Error(
        "SKILL_UPDATE_SIGNER_POLICY_MISSING"
      );
    }
    const publicKey =
      createPublicKey(publicKeyPem);
    if (
      publicKey.asymmetricKeyType !== "ed25519"
    ) {
      throw new Error(
        "SKILL_UPDATE_SIGNER_POLICY_MISSING"
      );
    }
    seen.add(keyId);
    result.push({
      keyId,
      publicKeyPem
    });
  }

  if (result.length === 0) {
    throw new Error(
      "SKILL_UPDATE_SIGNER_POLICY_MISSING"
    );
  }
  return result;
}

export function trustedSkillUpdateKeys(
  manifestPath: string =
    defaultManifestPath()
): TrustedSkillUpdateKey[] {
  let manifest: SkillUpdateTrustManifest;
  try {
    manifest = JSON.parse(
      fs.readFileSync(
        manifestPath,
        "utf8"
      )
    ) as SkillUpdateTrustManifest;
  } catch {
    throw new Error(
      "SKILL_UPDATE_SIGNER_POLICY_MISSING"
    );
  }

  if (
    manifest.skillUpdate?.verification !==
      "SHA256_AND_ED25519_SIGNED_INDEX"
  ) {
    throw new Error(
      "SKILL_UPDATE_SIGNER_POLICY_MISSING"
    );
  }

  return parseTrustedKeys(
    manifest.skillUpdate
      .trustedEd25519PublicKeys
  );
}

export function skillUpdateTrustReady(
  manifestPath?: string
): boolean {
  try {
    trustedSkillUpdateKeys(manifestPath);
    return true;
  } catch {
    return false;
  }
}

function sha256(
  data: Uint8Array
): string {
  return createHash("sha256")
    .update(data)
    .digest("hex");
}

function parseSignatureEnvelope(
  data: Uint8Array
): {
  keyId: string;
  signature: Buffer;
} {
  let parsed: DetachedSignatureEnvelope;
  try {
    parsed = JSON.parse(
      Buffer.from(data).toString("utf8")
    ) as DetachedSignatureEnvelope;
  } catch {
    throw new Error(
      "SKILL_UPDATE_SIGNATURE_INVALID"
    );
  }

  if (
    parsed.schemaVersion !== 1 ||
    parsed.algorithm !== "Ed25519" ||
    typeof parsed.keyId !== "string" ||
    !SAFE_KEY_ID.test(parsed.keyId) ||
    typeof parsed.signature !== "string" ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(
      parsed.signature
    )
  ) {
    throw new Error(
      "SKILL_UPDATE_SIGNATURE_INVALID"
    );
  }

  const signature =
    Buffer.from(
      parsed.signature,
      "base64"
    );
  if (signature.byteLength !== 64) {
    throw new Error(
      "SKILL_UPDATE_SIGNATURE_INVALID"
    );
  }
  return {
    keyId: parsed.keyId,
    signature
  };
}

function parseIndex(
  data: Uint8Array
): SkillUpdateIndex {
  let value: unknown;
  try {
    value = JSON.parse(
      Buffer.from(data).toString("utf8")
    );
  } catch {
    throw new Error(
      "SKILL_UPDATE_INDEX_INVALID"
    );
  }

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "SKILL_UPDATE_INDEX_INVALID"
    );
  }

  const record =
    value as Record<string, unknown>;
  const bundle =
    record.bundle &&
    typeof record.bundle === "object" &&
    !Array.isArray(record.bundle)
      ? record.bundle as
          Record<string, unknown>
      : null;
  const compatibility =
    record.compatibility &&
    typeof record.compatibility ===
      "object" &&
    !Array.isArray(record.compatibility)
      ? record.compatibility as
          Record<string, unknown>
      : null;
  const skills =
    Array.isArray(record.skills)
      ? record.skills
      : null;

  if (
    record.schemaVersion !== 1 ||
    record.kind !==
      "LEX_MACHINA_SKILLS_INDEX" ||
    typeof record.version !== "string" ||
    !APP_VERSION.test(record.version) ||
    !bundle ||
    typeof bundle.filename !== "string" ||
    !/^[A-Za-z0-9._-]+\.zip$/i.test(
      bundle.filename
    ) ||
    typeof bundle.sha256 !== "string" ||
    !SHA256.test(bundle.sha256) ||
    typeof bundle.bytes !== "number" ||
    !Number.isSafeInteger(bundle.bytes) ||
    bundle.bytes < 1 ||
    !compatibility ||
    typeof compatibility.minAppVersion !==
      "string" ||
    !APP_VERSION.test(
      compatibility.minAppVersion
    ) ||
    (
      compatibility.maxAppVersion !==
        undefined &&
      (
        typeof compatibility.maxAppVersion !==
          "string" ||
        !APP_VERSION.test(
          compatibility.maxAppVersion
        )
      )
    ) ||
    !skills ||
    skills.length < 1
  ) {
    throw new Error(
      "SKILL_UPDATE_INDEX_INVALID"
    );
  }

  const parsedSkills:
    SkillIndexEntry[] = [];
  const seen = new Set<string>();

  for (const item of skills) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "SKILL_UPDATE_INDEX_INVALID"
      );
    }
    const skill =
      item as Record<string, unknown>;
    if (
      typeof skill.id !== "string" ||
      !SAFE_ID.test(skill.id) ||
      seen.has(skill.id) ||
      typeof skill.version !== "string" ||
      !skill.version.trim() ||
      skill.version.length > 64 ||
      typeof skill.sha256 !== "string" ||
      !SHA256.test(skill.sha256) ||
      !Array.isArray(skill.dependencies) ||
      skill.dependencies.some(
        (dependency) =>
          typeof dependency !== "string" ||
          !SAFE_ID.test(dependency)
      )
    ) {
      throw new Error(
        "SKILL_UPDATE_INDEX_INVALID"
      );
    }
    seen.add(skill.id);
    parsedSkills.push({
      id: skill.id,
      version: skill.version.trim(),
      sha256:
        skill.sha256.toLowerCase(),
      dependencies: [
        ...new Set(
          skill.dependencies as string[]
        )
      ].sort()
    });
  }

  return {
    schemaVersion: 1,
    kind:
      "LEX_MACHINA_SKILLS_INDEX",
    version: record.version,
    bundle: {
      filename: bundle.filename,
      sha256:
        bundle.sha256.toLowerCase(),
      bytes: bundle.bytes
    },
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
    skills: parsedSkills
  };
}

export function verifySkillUpdateIndex(
  indexBytes: Uint8Array,
  signatureBytes: Uint8Array,
  configuredKeys?: readonly TrustedSkillUpdateKey[],
  manifestPath?: string
): VerifiedSkillIndex {
  const keys = configuredKeys
    ? parseTrustedKeys(configuredKeys)
    : trustedSkillUpdateKeys(
        manifestPath
      );
  const envelope =
    parseSignatureEnvelope(
      signatureBytes
    );
  const trusted = keys.find(
    (key) =>
      key.keyId === envelope.keyId
  );
  if (!trusted) {
    throw new Error(
      "SKILL_UPDATE_SIGNER_NOT_TRUSTED"
    );
  }

  const publicKey =
    createPublicKey(
      trusted.publicKeyPem
    );
  const valid = verifySignature(
    null,
    Buffer.from(indexBytes),
    publicKey,
    envelope.signature
  );
  if (!valid) {
    throw new Error(
      "SKILL_UPDATE_SIGNATURE_INVALID"
    );
  }

  return {
    index: parseIndex(indexBytes),
    signerKeyId: trusted.keyId,
    indexSha256:
      sha256(indexBytes)
  };
}

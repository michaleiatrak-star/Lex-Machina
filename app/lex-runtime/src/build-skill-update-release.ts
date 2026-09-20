import {
  createHash,
  createPrivateKey,
  sign
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { LexSkillRegistry } from "./registry.js";

const APP_VERSION = /^\d+\.\d+\.\d+$/;
const SAFE_KEY_ID = /^[A-Za-z0-9._-]{3,96}$/;

function fail(message: string): never {
  throw new Error(message);
}

function sha256File(filePath: string): string {
  return createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function atomicWrite(
  filePath: string,
  data: Uint8Array | string
): void {
  const target = path.resolve(filePath);
  fs.mkdirSync(path.dirname(target), {
    recursive: true
  });
  const temporary = `${target}.tmp`;
  fs.writeFileSync(temporary, data, {
    flag: "w"
  });
  fs.renameSync(temporary, target);
}

const [
  corpusArg,
  bundleArg,
  outputArg,
  releaseVersion,
  minAppVersion,
  maxAppVersionArg,
  keyId
] = process.argv.slice(2);

if (
  !corpusArg ||
  !bundleArg ||
  !outputArg ||
  !releaseVersion ||
  !minAppVersion ||
  !keyId
) {
  fail(
    "USAGE: build-skill-update-release <corpusRoot> <bundleZip> <outputDir> <releaseVersion> <minAppVersion> <maxAppVersion|-> <keyId|->"
  );
}
if (
  !APP_VERSION.test(releaseVersion) ||
  !APP_VERSION.test(minAppVersion) ||
  (
    maxAppVersionArg &&
    maxAppVersionArg !== "-" &&
    !APP_VERSION.test(maxAppVersionArg)
  )
) {
  fail("SKILL_RELEASE_VERSION_INVALID");
}
const unsigned =
  keyId === "-";
if (
  !unsigned &&
  !SAFE_KEY_ID.test(keyId)
) {
  fail("SKILL_RELEASE_KEY_ID_INVALID");
}

const corpusRoot = path.resolve(corpusArg);
const bundlePath = path.resolve(bundleArg);
const outputDir = path.resolve(outputArg);
if (!fs.statSync(corpusRoot).isDirectory()) {
  fail("SKILL_RELEASE_CORPUS_MISSING");
}
if (!fs.statSync(bundlePath).isFile()) {
  fail("SKILL_RELEASE_BUNDLE_MISSING");
}

const registry = new LexSkillRegistry(corpusRoot);
const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];
if (registry.skills.size === 0 || issues.length > 0) {
  fail(
    `SKILL_RELEASE_CORPUS_INVALID:${JSON.stringify(issues)}`
  );
}

const skills = [...registry.skills.values()]
  .map((skill) => {
    const version =
      typeof skill.frontmatter.version === "string"
        ? skill.frontmatter.version.trim()
        : "";
    if (!version || version.length > 64) {
      fail(
        `SKILL_RELEASE_SKILL_VERSION_INVALID:${skill.name}`
      );
    }
    return {
      id: skill.name,
      version,
      sha256: sha256File(skill.skillFile),
      dependencies: [
        ...new Set(
          skill.frontmatter.dependencies?.requires ?? []
        )
      ].sort()
    };
  })
  .sort((left, right) =>
    left.id.localeCompare(right.id, "en")
  );

const bundleStat = fs.statSync(bundlePath);
const index = {
  schemaVersion: 1,
  kind: "LEX_MACHINA_SKILLS_INDEX",
  version: releaseVersion,
  bundle: {
    filename: path.basename(bundlePath),
    sha256: sha256File(bundlePath),
    bytes: bundleStat.size
  },
  compatibility: {
    minAppVersion,
    ...(maxAppVersionArg &&
    maxAppVersionArg !== "-"
      ? { maxAppVersion: maxAppVersionArg }
      : {})
  },
  skills
};

const indexBytes = Buffer.from(
  `${JSON.stringify(index, null, 2)}\n`,
  "utf8"
);

let signatureEnvelope:
  Buffer | null = null;
if (!unsigned) {
  const privateKeyPem =
    process.env.LEX_SKILL_UPDATE_PRIVATE_KEY_PEM;
  if (!privateKeyPem?.trim()) {
    fail("SKILL_RELEASE_PRIVATE_KEY_MISSING");
  }
  const privateKey =
    createPrivateKey(privateKeyPem);
  if (
    privateKey.asymmetricKeyType !==
      "ed25519"
  ) {
    fail("SKILL_RELEASE_PRIVATE_KEY_TYPE_INVALID");
  }

  const signature = sign(
    null,
    indexBytes,
    privateKey
  );
  signatureEnvelope = Buffer.from(
    `${JSON.stringify(
      {
        schemaVersion: 1,
        algorithm: "Ed25519",
        keyId,
        signature:
          signature.toString("base64")
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

const indexPath = path.join(
  outputDir,
  "LexMachina-Skills-Index.json"
);
const signaturePath = path.join(
  outputDir,
  "LexMachina-Skills-Index.sig"
);
atomicWrite(indexPath, indexBytes);
if (signatureEnvelope) {
  atomicWrite(
    signaturePath,
    signatureEnvelope
  );
} else if (
  fs.existsSync(signaturePath)
) {
  fs.rmSync(signaturePath);
}

console.log(
  JSON.stringify(
    {
      result: "PASS",
      releaseVersion,
      skillCount: skills.length,
      bundle: index.bundle,
      signatureMode:
        unsigned
          ? "UNSIGNED_OFFICIAL_SOURCE"
          : "ED25519",
      keyId:
        unsigned
          ? null
          : keyId,
      indexSha256: createHash("sha256")
        .update(indexBytes)
        .digest("hex"),
      outputs: {
        index: indexPath,
        signature:
          signatureEnvelope
            ? signaturePath
            : null
      }
    },
    null,
    2
  )
);

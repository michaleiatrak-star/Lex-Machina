import {
  generateKeyPairSync,
  sign
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  verifySkillUpdateIndex,
  type TrustedSkillUpdateKey
} from "./skill-update-verifier.js";

function fixture() {
  const { privateKey, publicKey } =
    generateKeyPairSync("ed25519");
  const trusted: TrustedSkillUpdateKey[] = [
    {
      keyId: "release-test-key",
      publicKeyPem:
        publicKey.export({
          type: "spki",
          format: "pem"
        }).toString()
    }
  ];
  const index = {
    schemaVersion: 1,
    kind: "LEX_MACHINA_SKILLS_INDEX",
    version: "0.1.4",
    bundle: {
      filename:
        "LexMachina-Skills-0.1.4.zip",
      sha256:
        "a".repeat(64),
      bytes: 12345
    },
    compatibility: {
      minAppVersion: "0.1.3",
      maxAppVersion: "0.2.0"
    },
    skills: [
      {
        id: "prawny-router-v3",
        version: "3.49",
        sha256:
          "b".repeat(64),
        dependencies: [
          "shared",
          "prawo-polskie-v2"
        ]
      }
    ]
  };
  const indexBytes = Buffer.from(
    JSON.stringify(index),
    "utf8"
  );
  const signature = sign(
    null,
    indexBytes,
    privateKey
  );
  const signatureBytes = Buffer.from(
    JSON.stringify({
      schemaVersion: 1,
      algorithm: "Ed25519",
      keyId: "release-test-key",
      signature:
        signature.toString("base64")
    }),
    "utf8"
  );
  return {
    trusted,
    indexBytes,
    signatureBytes
  };
}

describe("signed skill update index", () => {
  it("accepts an Ed25519-signed compatible index", () => {
    const {
      trusted,
      indexBytes,
      signatureBytes
    } = fixture();

    const result =
      verifySkillUpdateIndex(
        indexBytes,
        signatureBytes,
        trusted
      );

    expect(result.signerKeyId)
      .toBe("release-test-key");
    expect(result.index.version)
      .toBe("0.1.4");
    expect(result.index.skills[0]?.id)
      .toBe("prawny-router-v3");
  });


  it("allows an unsigned index under the official-source SHA-256 policy", () => {
    const { indexBytes } = fixture();
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), "lex-skill-unsigned-")
    );
    const manifestPath = path.join(
      root,
      "release-source.json"
    );
    try {
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({
          skillUpdate: {
            verification:
              "SHA256_AND_OPTIONAL_ED25519_INDEX",
            trustedEd25519PublicKeys: [],
            officialSourceUnsignedAllowed: true,
            temporaryUnsignedAllowed: false
          }
        }),
        "utf8"
      );

      const result =
        verifySkillUpdateIndex(
          indexBytes,
          new Uint8Array(),
          undefined,
          manifestPath
        );

      expect(result.signerKeyId)
        .toBe("UNSIGNED_ALLOWED");
      expect(result.index.version)
        .toBe("0.1.4");

      expect(() =>
        verifySkillUpdateIndex(
          Buffer.from("{}", "utf8"),
          new Uint8Array(),
          undefined,
          manifestPath
        )
      ).toThrow(
        "SKILL_UPDATE_INDEX_INVALID"
      );
    } finally {
      fs.rmSync(root, {
        recursive: true,
        force: true
      });
    }
  });

  it("restores fail-closed behavior when signed mode is selected", () => {
    const { indexBytes } = fixture();
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), "lex-skill-signed-")
    );
    const manifestPath = path.join(
      root,
      "release-source.json"
    );
    try {
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({
          skillUpdate: {
            verification:
              "SHA256_AND_ED25519_SIGNED_INDEX",
            trustedEd25519PublicKeys: []
          }
        }),
        "utf8"
      );

      expect(() =>
        verifySkillUpdateIndex(
          indexBytes,
          new Uint8Array(),
          undefined,
          manifestPath
        )
      ).toThrow(
        "SKILL_UPDATE_SIGNER_POLICY_MISSING"
      );
    } finally {
      fs.rmSync(root, {
        recursive: true,
        force: true
      });
    }
  });

  it("rejects a tampered index even when the signature envelope is unchanged", () => {
    const {
      trusted,
      indexBytes,
      signatureBytes
    } = fixture();
    const tampered = Buffer.from(
      indexBytes
        .toString("utf8")
        .replace(
          '"version":"0.1.4"',
          '"version":"0.1.5"'
        ),
      "utf8"
    );

    expect(() =>
      verifySkillUpdateIndex(
        tampered,
        signatureBytes,
        trusted
      )
    ).toThrow(
      "SKILL_UPDATE_SIGNATURE_INVALID"
    );
  });

  it("rejects a signature from an untrusted key id", () => {
    const {
      trusted,
      indexBytes,
      signatureBytes
    } = fixture();
    const envelope =
      JSON.parse(
        signatureBytes.toString("utf8")
      ) as Record<string, unknown>;
    envelope.keyId = "unknown-release-key";

    expect(() =>
      verifySkillUpdateIndex(
        indexBytes,
        Buffer.from(
          JSON.stringify(envelope),
          "utf8"
        ),
        trusted
      )
    ).toThrow(
      "SKILL_UPDATE_SIGNER_NOT_TRUSTED"
    );
  });

  it("rejects an invalid index schema after a valid signature", () => {
    const { privateKey, publicKey } =
      generateKeyPairSync("ed25519");
    const trusted: TrustedSkillUpdateKey[] = [
      {
        keyId: "schema-test-key",
        publicKeyPem:
          publicKey.export({
            type: "spki",
            format: "pem"
          }).toString()
      }
    ];
    const indexBytes = Buffer.from(
      JSON.stringify({
        schemaVersion: 2,
        kind:
          "LEX_MACHINA_SKILLS_INDEX"
      }),
      "utf8"
    );
    const signature = sign(
      null,
      indexBytes,
      privateKey
    );
    const signatureBytes = Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        algorithm: "Ed25519",
        keyId: "schema-test-key",
        signature:
          signature.toString("base64")
      }),
      "utf8"
    );

    expect(() =>
      verifySkillUpdateIndex(
        indexBytes,
        signatureBytes,
        trusted
      )
    ).toThrow(
      "SKILL_UPDATE_INDEX_INVALID"
    );
  });
});

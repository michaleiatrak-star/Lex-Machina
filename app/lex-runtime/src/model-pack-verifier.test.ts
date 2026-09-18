import {
  generateKeyPairSync,
  sign
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  verifyModelPackIndex,
  type TrustedModelPackKey
} from "./model-pack-verifier.js";

function fixture() {
  const {
    privateKey,
    publicKey
  } = generateKeyPairSync(
    "ed25519"
  );
  const trusted:
    TrustedModelPackKey[] = [
      {
        keyId:
          "model-release-test",
        publicKeyPem:
          publicKey
            .export({
              type: "spki",
              format: "pem"
            })
            .toString()
      }
    ];

  const index = {
    schemaVersion: 1,
    kind:
      "LEX_MACHINA_MODEL_PACK_INDEX",
    version: "0.1.0",
    compatibility: {
      minAppVersion:
        "0.1.3",
      maxAppVersion:
        "0.2.0"
    },
    models: [
      {
        id:
          "local/bielik-11b-v3-q4km",
        family:
          "BIELIK",
        displayName:
          "Bielik 11B v3",
        filename:
          "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
        url:
          "https://example.invalid/Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
        sha256:
          "a".repeat(64),
        bytes:
          6_000_000_000,
        quantization:
          "Q4_K_M",
        nativeContext:
          32_768,
        minimumContext:
          64_000,
        maximumRuntimeContext:
          200_000,
        license:
          "Apache-2.0"
      }
    ]
  };

  const indexBytes =
    Buffer.from(
      JSON.stringify(index),
      "utf8"
    );
  const signature =
    sign(
      null,
      indexBytes,
      privateKey
    );
  const signatureBytes =
    Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        algorithm:
          "Ed25519",
        keyId:
          "model-release-test",
        signature:
          signature.toString(
            "base64"
          )
      }),
      "utf8"
    );

  return {
    privateKey,
    publicKey,
    trusted,
    index,
    indexBytes,
    signatureBytes
  };
}

describe(
  "signed model-pack index",
  () => {
    it(
      "accepts a trusted Ed25519 index",
      () => {
        const {
          trusted,
          indexBytes,
          signatureBytes
        } = fixture();

        const result =
          verifyModelPackIndex(
            indexBytes,
            signatureBytes,
            trusted
          );

        expect(
          result.signerKeyId
        ).toBe(
          "model-release-test"
        );
        expect(
          result.index.models[0]
            ?.maximumRuntimeContext
        ).toBe(200_000);
        expect(
          result.index.models[0]
            ?.family
        ).toBe("BIELIK");
      }
    );


    it(
      "allows an unsigned index only under the explicit temporary policy",
      () => {
        const {
          indexBytes
        } = fixture();
        const root =
          fs.mkdtempSync(
            path.join(
              os.tmpdir(),
              "lex-model-unsigned-"
            )
          );
        const manifestPath =
          path.join(
            root,
            "release-source.json"
          );
        try {
          fs.writeFileSync(
            manifestPath,
            JSON.stringify({
              modelPackUpdate: {
                verification:
                  "SHA256_AND_OPTIONAL_ED25519_INDEX",
                trustedEd25519PublicKeys: [],
                temporaryUnsignedAllowed: true
              }
            }),
            "utf8"
          );

          const result =
            verifyModelPackIndex(
              indexBytes,
              new Uint8Array(),
              undefined,
              manifestPath
            );

          expect(
            result.signerKeyId
          ).toBe(
            "UNSIGNED_ALLOWED"
          );
          expect(
            result.index
              .models[0]
              ?.sha256
          ).toBe(
            "a".repeat(64)
          );

          expect(() =>
            verifyModelPackIndex(
              Buffer.from(
                "{}",
                "utf8"
              ),
              new Uint8Array(),
              undefined,
              manifestPath
            )
          ).toThrow(
            "MODEL_PACK_INDEX_INVALID"
          );
        } finally {
          fs.rmSync(
            root,
            {
              recursive: true,
              force: true
            }
          );
        }
      }
    );

    it(
      "restores fail-closed behavior when signed mode is selected",
      () => {
        const {
          indexBytes
        } = fixture();
        const root =
          fs.mkdtempSync(
            path.join(
              os.tmpdir(),
              "lex-model-signed-"
            )
          );
        const manifestPath =
          path.join(
            root,
            "release-source.json"
          );
        try {
          fs.writeFileSync(
            manifestPath,
            JSON.stringify({
              modelPackUpdate: {
                verification:
                  "SHA256_AND_ED25519_SIGNED_INDEX",
                trustedEd25519PublicKeys: []
              }
            }),
            "utf8"
          );

          expect(() =>
            verifyModelPackIndex(
              indexBytes,
              new Uint8Array(),
              undefined,
              manifestPath
            )
          ).toThrow(
            "MODEL_PACK_SIGNER_POLICY_MISSING"
          );
        } finally {
          fs.rmSync(
            root,
            {
              recursive: true,
              force: true
            }
          );
        }
      }
    );

    it(
      "rejects tampered metadata",
      () => {
        const {
          trusted,
          indexBytes,
          signatureBytes
        } = fixture();
        const tampered =
          Buffer.from(
            indexBytes
              .toString("utf8")
              .replace(
                "200000",
                "220000"
              ),
            "utf8"
          );

        expect(() =>
          verifyModelPackIndex(
            tampered,
            signatureBytes,
            trusted
          )
        ).toThrow(
          "MODEL_PACK_SIGNATURE_INVALID"
        );
      }
    );

    it(
      "rejects an untrusted key id",
      () => {
        const {
          trusted,
          indexBytes,
          signatureBytes
        } = fixture();
        const envelope =
          JSON.parse(
            signatureBytes
              .toString("utf8")
          ) as Record<
            string,
            unknown
          >;
        envelope.keyId =
          "other-key";

        expect(() =>
          verifyModelPackIndex(
            indexBytes,
            Buffer.from(
              JSON.stringify(
                envelope
              ),
              "utf8"
            ),
            trusted
          )
        ).toThrow(
          "MODEL_PACK_SIGNER_NOT_TRUSTED"
        );
      }
    );

    it(
      "rejects a signed family label that conflicts with the model id",
      () => {
        const {
          privateKey,
          publicKey,
          index
        } = fixture();
        index.models[0]!.family =
          "MISTRAL";
        const bytes =
          Buffer.from(
            JSON.stringify(index),
            "utf8"
          );
        const signature =
          sign(
            null,
            bytes,
            privateKey
          );
        const envelope =
          Buffer.from(
            JSON.stringify({
              schemaVersion: 1,
              algorithm:
                "Ed25519",
              keyId:
                "family-test-key",
              signature:
                signature.toString(
                  "base64"
                )
            }),
            "utf8"
          );
        const trusted:
          TrustedModelPackKey[] = [
            {
              keyId:
                "family-test-key",
              publicKeyPem:
                publicKey
                  .export({
                    type: "spki",
                    format: "pem"
                  })
                  .toString()
            }
          ];

        expect(() =>
          verifyModelPackIndex(
            bytes,
            envelope,
            trusted
          )
        ).toThrow(
          "MODEL_PACK_INDEX_INVALID"
        );
      }
    );

    it(
      "rejects unsafe model metadata even when correctly signed",
      () => {
        const {
          privateKey,
          publicKey,
          index
        } = fixture();
        index.models[0]!.url =
          "http://example.invalid/model.gguf";
        const bytes =
          Buffer.from(
            JSON.stringify(index),
            "utf8"
          );
        const signature =
          sign(
            null,
            bytes,
            privateKey
          );
        const envelope =
          Buffer.from(
            JSON.stringify({
              schemaVersion: 1,
              algorithm:
                "Ed25519",
              keyId:
                "safe-metadata-key",
              signature:
                signature.toString(
                  "base64"
                )
            }),
            "utf8"
          );
        const trusted:
          TrustedModelPackKey[] = [
            {
              keyId:
                "safe-metadata-key",
              publicKeyPem:
                publicKey
                  .export({
                    type:
                      "spki",
                    format:
                      "pem"
                  })
                  .toString()
            }
          ];

        expect(() =>
          verifyModelPackIndex(
            bytes,
            envelope,
            trusted
          )
        ).toThrow(
          "MODEL_PACK_INDEX_INVALID"
        );
      }
    );
  }
);

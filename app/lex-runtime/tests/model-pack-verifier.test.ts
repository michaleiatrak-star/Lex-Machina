import fs from "node:fs";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  modelPackSignatureMode,
  modelPackTrustReady,
  verifyModelPackIndex
} from "../src/model-pack-verifier.js";

const here =
  path.dirname(
    fileURLToPath(
      import.meta.url
    )
  );
const manifestPath =
  path.resolve(
    here,
    "../../installer/windows-release-source.json"
  );

describe(
  "temporary unsigned model-pack policy",
  () => {
    it(
      "allows the 0.1.7 manifest to operate without a production Ed25519 key",
      () => {
        const manifest =
          JSON.parse(
            fs.readFileSync(
              manifestPath,
              "utf8"
            )
          ) as {
            modelPackUpdate?: {
              verification?: string;
              temporaryUnsignedAllowed?: boolean;
              trustedEd25519PublicKeys?: unknown[];
            };
          };

        expect(
          manifest.modelPackUpdate
            ?.verification
        ).toBe(
          "SHA256_AND_OPTIONAL_ED25519_INDEX"
        );
        expect(
          manifest.modelPackUpdate
            ?.temporaryUnsignedAllowed
        ).toBe(true);
        expect(
          manifest.modelPackUpdate
            ?.trustedEd25519PublicKeys
        ).toEqual([]);
        expect(
          modelPackSignatureMode(
            manifestPath
          )
        ).toBe(
          "UNSIGNED_ALLOWED"
        );
        expect(
          modelPackTrustReady(
            manifestPath
          )
        ).toBe(true);
      }
    );

    it(
      "accepts an unsigned index while still producing a SHA-256 receipt",
      () => {
        const indexBytes =
          Buffer.from(
            JSON.stringify({
              schemaVersion: 1,
              kind:
                "LEX_MACHINA_MODEL_PACK_INDEX",
              version:
                "0.1.7",
              compatibility: {
                minAppVersion:
                  "0.1.7"
              },
              models: [
                {
                  id:
                    "local/bielik-test-q4km",
                  family:
                    "BIELIK",
                  displayName:
                    "Bielik test",
                  filename:
                    "bielik-test.gguf",
                  url:
                    "https://example.com/bielik-test.gguf",
                  sha256:
                    "a".repeat(
                      64
                    ),
                  bytes:
                    1024,
                  quantization:
                    "Q4_K_M",
                  nativeContext:
                    4096,
                  minimumContext:
                    4096,
                  maximumRuntimeContext:
                    8192,
                  license:
                    "test"
                }
              ]
            }),
            "utf8"
          );

        const verified =
          verifyModelPackIndex(
            indexBytes,
            new Uint8Array(),
            undefined,
            manifestPath
          );

        expect(
          verified.signerKeyId
        ).toBe(
          "UNSIGNED_ALLOWED"
        );
        expect(
          verified.indexSha256
        ).toMatch(
          /^[a-f0-9]{64}$/
        );
      }
    );
  }
);

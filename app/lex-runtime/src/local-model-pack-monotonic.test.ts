import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  LocalModelRuntime
} from "./local-model-runtime.js";

const roots: string[] = [];
const MODEL_ID =
  "local/bielik-11b-v3-q4km";
const MODEL_FILE =
  "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf";
const INSTALLED_HASH =
  "a".repeat(64);
const TARGET_HASH =
  "b".repeat(64);

function fixture(
  receiptOverrides: Record<
    string,
    unknown
  > = {}
) {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-model-pack-monotonic-"
    )
  );
  roots.push(root);

  const runtimeRoot =
    path.join(
      root,
      "runtime"
    );
  const localRoot =
    path.join(
      root,
      "local-ai"
    );
  const modelDir =
    path.join(
      localRoot,
      "models"
    );
  fs.mkdirSync(
    modelDir,
    { recursive: true }
  );

  const modelPath =
    path.join(
      modelDir,
      MODEL_FILE
    );
  fs.writeFileSync(
    modelPath,
    "fixture",
    "utf8"
  );

  fs.mkdirSync(
    runtimeRoot,
    { recursive: true }
  );

  fs.writeFileSync(
    path.join(
      localRoot,
      "config.json"
    ),
    JSON.stringify(
      {
        schemaVersion: 1,
        configuredAt:
          "2026-09-18T08:00:00.000Z",
        applicationVersion:
          "0.1.3",
        model: {
          id: MODEL_ID,
          displayName:
            "Bielik 11B v3 Instruct Q4_K_M",
          filename:
            MODEL_FILE,
          path: modelPath,
          sha256:
            INSTALLED_HASH,
          quantization:
            "Q4_K_M",
          nativeContext:
            32_768
        },
        context: {
          requestedTokens:
            64_000,
          mode:
            "YARN_EXTENDED",
          extendedBeyondNative:
            true,
          ropeScale:
            64_000 /
            32_768
        },
        engine: {
          type:
            "llama.cpp",
          version:
            "test",
          executable:
            path.join(
              localRoot,
              "llama",
              "llama-server.exe"
            ),
          bind:
            "127.0.0.1"
        },
        network: {
          requiredForProvisioning:
            true,
          requiredForInference:
            false
        }
      },
      null,
      2
    ),
    "utf8"
  );

  fs.writeFileSync(
    path.join(
      localRoot,
      "model-pack-install.json"
    ),
    JSON.stringify(
      {
        schemaVersion: 1,
        kind:
          "LEX_MACHINA_MODEL_PACK_INSTALL",
        packVersion:
          "0.1.5",
        signerKeyId:
          "model-release-test",
        indexSha256:
          "c".repeat(64),
        modelId:
          MODEL_ID,
        modelSha256:
          INSTALLED_HASH,
        installedAt:
          "2026-09-18T08:01:00.000Z",
        ...receiptOverrides
      },
      null,
      2
    ),
    "utf8"
  );

  const runtime =
    new LocalModelRuntime({
      rootDir:
        localRoot,
      runtimeRoot,
      port: 54318
    });

  return {
    runtime,
    localRoot
  };
}

function target(
  packVersion: string
) {
  return {
    packVersion,
    signerKeyId:
      "model-release-test",
    indexSha256:
      "d".repeat(64),
    model: {
      id: MODEL_ID,
      displayName:
        "Bielik 11B v3 Instruct Q4_K_M",
      filename:
        MODEL_FILE,
      url:
        "https://example.invalid/Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
      sha256:
        TARGET_HASH,
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
  };
}

afterEach(() => {
  for (
    const root
    of roots.splice(0)
  ) {
    fs.rmSync(
      root,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe(
  "model-pack monotonic signed update state",
  () => {
    it(
      "exposes the signed pack version only when the receipt matches the installed model state",
      () => {
        const { runtime } =
          fixture();
        expect(
          runtime
            .installedModelUpdateIdentity()
        ).toMatchObject({
          modelId:
            MODEL_ID,
          sha256:
            INSTALLED_HASH,
          contextTokens:
            64_000,
          packVersion:
            "0.1.5",
          signerKeyId:
            "model-release-test"
        });
      }
    );

    it(
      "tracks signed receipts independently for an installed inactive Mistral model",
      () => {
        const {
          runtime,
          localRoot
        } = fixture();
        const mistralId =
          "local/mistral-nemo-12b-q4km";
        const mistralFile =
          "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf";
        const mistralHash =
          "9".repeat(64);

        fs.writeFileSync(
          path.join(
            localRoot,
            "models",
            mistralFile
          ),
          "mistral-fixture",
          "utf8"
        );
        fs.writeFileSync(
          path.join(
            localRoot,
            "models",
            `${mistralFile}.model-pack.json`
          ),
          JSON.stringify(
            {
              schemaVersion: 1,
              kind:
                "LEX_MACHINA_MODEL_PACK_INSTALL",
              packVersion:
                "0.1.6",
              signerKeyId:
                "model-release-test",
              indexSha256:
                "8".repeat(64),
              modelId:
                mistralId,
              modelSha256:
                mistralHash,
              installedAt:
                "2026-09-18T09:00:00.000Z"
            },
            null,
            2
          ),
          "utf8"
        );

        expect(
          runtime
            .installedModelUpdateIdentity(
              mistralId
            )
        ).toMatchObject({
          modelId:
            mistralId,
          sha256:
            mistralHash,
          packVersion:
            "0.1.6",
          signerKeyId:
            "model-release-test",
          active:
            false
        });
      }
    );

    it(
      "blocks a lower signed pack version before provisioning",
      async () => {
        const { runtime } =
          fixture();

        await expect(
          runtime
            .applyVerifiedModelPack({
              target:
                target(
                  "0.1.4"
                ),
              contextTokens:
                64_000
            })
        ).rejects.toThrow(
          "MODEL_PACK_UPDATE_ROLLBACK_BLOCKED"
        );
      }
    );

    it(
      "blocks a different hash under the same signed pack version",
      async () => {
        const { runtime } =
          fixture();

        await expect(
          runtime
            .applyVerifiedModelPack({
              target:
                target(
                  "0.1.5"
                ),
              contextTokens:
                64_000
            })
        ).rejects.toThrow(
          "MODEL_PACK_UPDATE_VERSION_HASH_CONFLICT"
        );
      }
    );

    it(
      "fails closed when the local signed receipt no longer matches the configured model hash",
      () => {
        const { runtime } =
          fixture({
            modelSha256:
              "e".repeat(64)
          });

        expect(() =>
          runtime
            .installedModelUpdateIdentity()
        ).toThrow(
          "MODEL_PACK_RECEIPT_STATE_MISMATCH"
        );
      }
    );
  }
);

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
import {
  DynamicModelCatalog
} from "./providers/model-catalog.js";

const roots: string[] = [];

function makeConfig(args: {
  id: string;
  filename: string;
  nativeContext: number;
  context: number;
  modelPath: string;
  enginePath: string;
}) {
  return {
    schemaVersion: 1,
    configuredAt:
      "2026-09-18T08:00:00.000Z",
    applicationVersion:
      "0.1.3",
    model: {
      id: args.id,
      displayName: args.id,
      filename:
        args.filename,
      path:
        args.modelPath,
      sha256:
        "a".repeat(64),
      quantization:
        "Q4_K_M",
      nativeContext:
        args.nativeContext
    },
    context: {
      requestedTokens:
        args.context,
      mode:
        args.context >
          args.nativeContext
          ? "YARN_EXTENDED"
          : "NATIVE_OR_REDUCED",
      extendedBeyondNative:
        args.context >
          args.nativeContext,
      ropeScale:
        Math.max(
          1,
          args.context /
            args.nativeContext
        )
    },
    engine: {
      type: "llama.cpp",
      version: "test",
      backend:
        "CPU_X64_PORTABLE",
      selectionMode:
        "AUTO",
      gpuOffload: false,
      executable:
        args.enginePath,
      fallbackBackend: null,
      fallbackExecutable: null,
      bind: "127.0.0.1"
    },
    network: {
      requiredForProvisioning: true,
      requiredForInference: false
    }
  };
}

function qualification(args: {
  id: string;
  context: number;
  nativeContext: number;
}) {
  return {
    schemaVersion: 1,
    result: "PASS",
    modelId: args.id,
    contextTokens:
      args.context,
    contextMode:
      args.context >
        args.nativeContext
        ? "YARN_EXTENDED"
        : "NATIVE_OR_REDUCED",
    engine: "llama.cpp",
    backend:
      "CPU_X64_PORTABLE",
    startupMs: 10,
    tokenizerCalibration: {
      endpoint: "/tokenize",
      sampleCount: 3,
      observedMinCharsPerToken:
        2.1,
      conservativeCharsPerToken:
        2,
      calibratedAt:
        "2026-09-18T08:00:01.000Z"
    },
    validatedAt:
      "2026-09-18T08:00:02.000Z"
  };
}

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-local-profiles-"
      )
    );
  roots.push(root);

  const runtimeRoot =
    path.join(root, "runtime");
  const localRoot =
    path.join(root, "local-ai");
  const modelsRoot =
    path.join(
      localRoot,
      "models"
    );
  const profilesRoot =
    path.join(
      localRoot,
      "profiles"
    );
  const enginePath =
    path.join(
      localRoot,
      "llama",
      "llama-server.exe"
    );

  fs.mkdirSync(
    runtimeRoot,
    { recursive: true }
  );
  fs.mkdirSync(
    modelsRoot,
    { recursive: true }
  );
  fs.mkdirSync(
    profilesRoot,
    { recursive: true }
  );
  fs.mkdirSync(
    path.dirname(enginePath),
    { recursive: true }
  );
  fs.writeFileSync(
    enginePath,
    "fixture"
  );

  const models = [
    {
      id:
        "local/bielik-11b-v3-q4km",
      displayName:
        "Bielik 11B v3",
      filename:
        "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
      sha256:
        "a".repeat(64),
      quantization:
        "Q4_K_M",
      nativeContext: 32_768,
      minimumContext: 64_000,
      maximumRuntimeContext:
        200_000,
      license: "Apache-2.0",
      sourceModel:
        "speakleash/Bielik-11B-v3.0-Instruct"
    },
    {
      id:
        "local/mistral-nemo-12b-q4km",
      displayName:
        "Mistral NeMo 12B",
      filename:
        "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf",
      sha256:
        "b".repeat(64),
      quantization:
        "Q4_K_M",
      nativeContext:
        131_072,
      minimumContext:
        64_000,
      maximumRuntimeContext:
        200_000,
      license: "Apache-2.0",
      sourceModel:
        "mistralai/Mistral-Nemo-Instruct-2407"
    }
  ];

  fs.writeFileSync(
    path.join(
      runtimeRoot,
      "release-source.json"
    ),
    JSON.stringify({
      applicationVersion:
        "0.1.3",
      models: {
        localLlm: models
      },
      localAi: {
        contextSelection: {
          minimum: 64_000,
          maximum: 200_000,
          step: 1_000,
          recommendedProfiles: [
            64_000,
            96_000,
            128_000,
            160_000,
            200_000
          ],
          default: 128_000
        },
        backendSelection: {
          allowed: [
            "AUTO",
            "CPU_X64_PORTABLE"
          ],
          default: "AUTO"
        }
      }
    }),
    "utf8"
  );

  const contexts =
    new Map([
      [
        models[0]!.id,
        96_000
      ],
      [
        models[1]!.id,
        160_000
      ]
    ]);

  for (const model of models) {
    const modelPath =
      path.join(
        modelsRoot,
        model.filename
      );
    fs.writeFileSync(
      modelPath,
      "gguf-fixture"
    );

    const context =
      contexts.get(model.id)!;
    const config =
      makeConfig({
        id: model.id,
        filename:
          model.filename,
        nativeContext:
          model.nativeContext,
        context,
        modelPath,
        enginePath
      });
    fs.writeFileSync(
      path.join(
        profilesRoot,
        `${model.filename}.config.json`
      ),
      JSON.stringify(
        config,
        null,
        2
      ),
      "utf8"
    );
    fs.writeFileSync(
      path.join(
        profilesRoot,
        `${model.filename}.qualification.json`
      ),
      JSON.stringify(
        qualification({
          id: model.id,
          context,
          nativeContext:
            model.nativeContext
        }),
        null,
        2
      ),
      "utf8"
    );
  }

  return new LocalModelRuntime({
    rootDir:
      localRoot,
    runtimeRoot,
    port: 54_330
  });
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
  "switchable local model profiles",
  () => {
    it(
      "exposes independent validated profiles for Bielik and Mistral",
      () => {
        const runtime =
          fixture();
        const models =
          runtime.listModels();

        expect(
          runtime
            .contextPolicy()
            .default
        ).toBe(128_000);

        expect(
          models
            .filter(
              (model) =>
                model.installed
            )
            .map((model) => ({
              id: model.id,
              context:
                model.configuredContextWindow
            }))
        ).toEqual([
          {
            id:
              "local/mistral-nemo-12b-q4km",
            context: 160_000
          },
          {
            id:
              "local/bielik-11b-v3-q4km",
            context: 96_000
          }
        ].sort((a, b) =>
          a.id.localeCompare(
            b.id
          )
        ));

        expect(
          runtime
            .qualificationForModel(
              "local/bielik-11b-v3-q4km"
            )
            ?.tokenizerCalibration
            ?.conservativeCharsPerToken
        ).toBe(2);
      }
    );

    it(
      "returns all switchable local profiles through the OpenAI-compatible catalog without an API key",
      async () => {
        const runtime =
          fixture();
        const catalog =
          new DynamicModelCatalog(
            {
              async getApiKey() {
                return null;
              }
            },
            undefined,
            runtime
          );

        const models =
          await catalog.list(
            "openai"
          );
        const local =
          models.filter(
            (model) =>
              model.id.startsWith(
                "local/"
              )
          );

        expect(
          local.map(
            (model) =>
              model.id
          )
        ).toEqual(
          expect.arrayContaining([
            "local/bielik-11b-v3-q4km",
            "local/mistral-nemo-12b-q4km"
          ])
        );
        expect(
          local.find(
            (model) =>
              model.id ===
              "local/mistral-nemo-12b-q4km"
          )?.contextWindow
        ).toBe(160_000);
        expect(
          local.find(
            (model) =>
              model.id ===
              "local/bielik-11b-v3-q4km"
          )?.contextWindow
        ).toBe(96_000);
      }
    );
  }
);

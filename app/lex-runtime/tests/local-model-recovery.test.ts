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
} from "../src/local-model-runtime.js";

const roots: string[] = [];

function fixture() {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-local-model-recovery-"
    )
  );
  roots.push(root);
  const runtimeRoot =
    path.join(root, "runtime");
  const localRoot =
    path.join(root, "local-ai");
  const models =
    path.join(
      localRoot,
      "models"
    );
  fs.mkdirSync(
    runtimeRoot,
    { recursive: true }
  );
  fs.mkdirSync(
    models,
    { recursive: true }
  );
  return {
    runtimeRoot,
    localRoot,
    models
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
  "LocalModelRuntime interrupted provisioning recovery",
  () => {
    it(
      "restores previous GGUF, config, qualification and model-pack receipt",
      () => {
        const {
          runtimeRoot,
          localRoot,
          models
        } = fixture();
        const filename =
          "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf";
        const target =
          path.join(
            models,
            filename
          );
        const rollback =
          target +
          ".lex-rollback";
        const config =
          path.join(
            localRoot,
            "config.json"
          );
        const configBackup =
          config +
          ".lex-rollback";
        const qualification =
          path.join(
            localRoot,
            "context-qualification.json"
          );
        const qualificationBackup =
          qualification +
          ".lex-rollback";
        const receipt =
          path.join(
            models,
            filename +
              ".model-pack.json"
          );
        const receiptBackup =
          receipt +
          ".lex-rollback";
        const marker =
          path.join(
            localRoot,
            "provision-transaction.json"
          );

        fs.writeFileSync(
          target,
          "new-model"
        );
        fs.writeFileSync(
          rollback,
          "old-model"
        );
        fs.writeFileSync(
          config,
          "new-config"
        );
        fs.writeFileSync(
          configBackup,
          "old-config"
        );
        fs.writeFileSync(
          qualification,
          "new-qualification"
        );
        fs.writeFileSync(
          qualificationBackup,
          "old-qualification"
        );
        fs.writeFileSync(
          receipt,
          "new-receipt"
        );
        fs.writeFileSync(
          receiptBackup,
          "old-receipt"
        );
        fs.writeFileSync(
          marker,
          JSON.stringify({
            schemaVersion: 1,
            modelFilename:
              filename,
            hadPreviousModel:
              true,
            hadPreviousConfig:
              true,
            hadPreviousQualification:
              true,
            hadPreviousModelPackReceipt:
              true,
            startedAt:
              "2026-09-18T08:00:00.000Z"
          })
        );

        new LocalModelRuntime({
          rootDir:
            localRoot,
          runtimeRoot,
          port: 54318
        });

        expect(
          fs.readFileSync(
            target,
            "utf8"
          )
        ).toBe("old-model");
        expect(
          fs.readFileSync(
            config,
            "utf8"
          )
        ).toBe("old-config");
        expect(
          fs.readFileSync(
            qualification,
            "utf8"
          )
        ).toBe(
          "old-qualification"
        );
        expect(
          fs.readFileSync(
            receipt,
            "utf8"
          )
        ).toBe("old-receipt");

        for (
          const stale
          of [
            rollback,
            configBackup,
            qualificationBackup,
            receiptBackup,
            marker
          ]
        ) {
          expect(
            fs.existsSync(stale)
          ).toBe(false);
        }
      }
    );

    it(
      "removes an interrupted first-install GGUF when there was no previous model",
      () => {
        const {
          runtimeRoot,
          localRoot,
          models
        } = fixture();
        const filename =
          "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf";
        const target =
          path.join(
            models,
            filename
          );
        const marker =
          path.join(
            localRoot,
            "provision-transaction.json"
          );

        fs.writeFileSync(
          target,
          "partial-new-model"
        );
        fs.writeFileSync(
          marker,
          JSON.stringify({
            schemaVersion: 1,
            modelFilename:
              filename,
            hadPreviousModel:
              false,
            hadPreviousConfig:
              false,
            hadPreviousQualification:
              false,
            hadPreviousModelPackReceipt:
              false,
            startedAt:
              "2026-09-18T08:00:00.000Z"
          })
        );

        new LocalModelRuntime({
          rootDir:
            localRoot,
          runtimeRoot,
          port: 54319
        });

        expect(
          fs.existsSync(target)
        ).toBe(false);
        expect(
          fs.existsSync(marker)
        ).toBe(false);
      }
    );
  }
);

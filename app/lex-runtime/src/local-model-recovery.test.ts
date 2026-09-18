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

function temporaryRoot(): string {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-local-ai-recovery-"
      )
    );
  roots.push(root);
  return root;
}

function write(
  filePath: string,
  value: string
): void {
  fs.mkdirSync(
    path.dirname(filePath),
    { recursive: true }
  );
  fs.writeFileSync(
    filePath,
    value,
    "utf8"
  );
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
  "Local AI crash-safe provisioning journal",
  () => {
    it(
      "restores the previously validated model, config and qualification",
      () => {
        const root =
          temporaryRoot();
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
        const filename =
          "model.Q4_K_M.gguf";
        const target =
          path.join(
            localRoot,
            "models",
            filename
          );

        write(
          target,
          "new-uncommitted-model"
        );
        write(
          `${target}.lex-rollback`,
          "old-validated-model"
        );
        write(
          path.join(
            localRoot,
            "config.json"
          ),
          '{"state":"new"}'
        );
        write(
          path.join(
            localRoot,
            "config.json.lex-rollback"
          ),
          '{"state":"old"}'
        );
        write(
          path.join(
            localRoot,
            "context-qualification.json"
          ),
          '{"qualification":"new"}'
        );
        write(
          path.join(
            localRoot,
            "context-qualification.json.lex-rollback"
          ),
          '{"qualification":"old"}'
        );
        write(
          path.join(
            localRoot,
            "model-pack-install.json"
          ),
          '{"receipt":"new"}'
        );
        write(
          path.join(
            localRoot,
            "model-pack-install.json.lex-rollback"
          ),
          '{"receipt":"old"}'
        );
        write(
          path.join(
            localRoot,
            "provision-transaction.json"
          ),
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
              new Date().toISOString()
          })
        );

        new LocalModelRuntime({
          rootDir:
            localRoot,
          runtimeRoot,
          port: 54_321
        });

        expect(
          fs.readFileSync(
            target,
            "utf8"
          )
        ).toBe(
          "old-validated-model"
        );
        expect(
          fs.readFileSync(
            path.join(
              localRoot,
              "config.json"
            ),
            "utf8"
          )
        ).toBe(
          '{"state":"old"}'
        );
        expect(
          fs.readFileSync(
            path.join(
              localRoot,
              "context-qualification.json"
            ),
            "utf8"
          )
        ).toBe(
          '{"qualification":"old"}'
        );
        expect(
          fs.readFileSync(
            path.join(
              localRoot,
              "model-pack-install.json"
            ),
            "utf8"
          )
        ).toBe(
          '{"receipt":"old"}'
        );
        expect(
          fs.existsSync(
            `${target}.lex-rollback`
          )
        ).toBe(false);
        expect(
          fs.existsSync(
            path.join(
              localRoot,
              "provision-transaction.json"
            )
          )
        ).toBe(false);
      }
    );

    it(
      "removes an interrupted first-install model and config",
      () => {
        const root =
          temporaryRoot();
        const localRoot =
          path.join(
            root,
            "local-ai"
          );
        const filename =
          "first.Q4_K_M.gguf";
        const target =
          path.join(
            localRoot,
            "models",
            filename
          );

        write(
          target,
          "uncommitted-model"
        );
        write(
          path.join(
            localRoot,
            "config.json"
          ),
          '{"state":"partial"}'
        );
        write(
          path.join(
            localRoot,
            "context-qualification.json"
          ),
          '{"qualification":"partial"}'
        );
        write(
          path.join(
            localRoot,
            "provision-transaction.json"
          ),
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
              new Date().toISOString()
          })
        );

        new LocalModelRuntime({
          rootDir:
            localRoot,
          runtimeRoot:
            path.join(
              root,
              "runtime"
            ),
          port: 54_322
        });

        expect(
          fs.existsSync(target)
        ).toBe(false);
        expect(
          fs.existsSync(
            path.join(
              localRoot,
              "config.json"
            )
          )
        ).toBe(false);
        expect(
          fs.existsSync(
            path.join(
              localRoot,
              "context-qualification.json"
            )
          )
        ).toBe(false);
        expect(
          fs.existsSync(
            path.join(
              localRoot,
              "model-pack-install.json"
            )
          )
        ).toBe(false);
      }
    );

    it(
      "restores the previously active model configuration after an interrupted inactive-model update",
      () => {
        const root =
          temporaryRoot();
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

        write(
          path.join(
            localRoot,
            "config.json"
          ),
          '{"active":"mistral-temporary"}'
        );
        write(
          path.join(
            localRoot,
            "context-qualification.json"
          ),
          '{"qualification":"mistral-temporary"}'
        );
        write(
          path.join(
            localRoot,
            "config.json.inactive-update-backup"
          ),
          '{"active":"bielik"}'
        );
        write(
          path.join(
            localRoot,
            "context-qualification.json.inactive-update-backup"
          ),
          '{"qualification":"bielik"}'
        );
        write(
          path.join(
            localRoot,
            "inactive-model-update-transaction.json"
          ),
          JSON.stringify({
            schemaVersion: 1,
            targetModelId:
              "local/mistral-nemo-12b-q4km",
            hadPreviousConfig:
              true,
            hadPreviousQualification:
              true,
            startedAt:
              "2026-09-18T09:00:00.000Z"
          })
        );

        new LocalModelRuntime({
          rootDir:
            localRoot,
          runtimeRoot,
          port: 54_324
        });

        expect(
          fs.readFileSync(
            path.join(
              localRoot,
              "config.json"
            ),
            "utf8"
          )
        ).toBe(
          '{"active":"bielik"}'
        );
        expect(
          fs.readFileSync(
            path.join(
              localRoot,
              "context-qualification.json"
            ),
            "utf8"
          )
        ).toBe(
          '{"qualification":"bielik"}'
        );
        expect(
          fs.existsSync(
            path.join(
              localRoot,
              "inactive-model-update-transaction.json"
            )
          )
        ).toBe(false);
      }
    );

    it(
      "fails closed on an invalid recovery marker",
      () => {
        const root =
          temporaryRoot();
        const localRoot =
          path.join(
            root,
            "local-ai"
          );

        write(
          path.join(
            localRoot,
            "provision-transaction.json"
          ),
          JSON.stringify({
            schemaVersion: 1,
            modelFilename:
              "../escape.gguf",
            hadPreviousModel:
              true,
            hadPreviousConfig:
              true,
            hadPreviousQualification:
              true,
            hadPreviousModelPackReceipt:
              true,
            startedAt:
              new Date().toISOString()
          })
        );

        expect(
          () =>
            new LocalModelRuntime({
              rootDir:
                localRoot,
              runtimeRoot:
                path.join(
                  root,
                  "runtime"
                ),
              port: 54_323
            })
        ).toThrow(
          "LOCAL_MODEL_RECOVERY_MARKER_INVALID"
        );
      }
    );
  }
);

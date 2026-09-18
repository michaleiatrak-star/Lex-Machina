import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import request from "supertest";
import {
  afterEach,
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  createLexHttpApp
} from "../src/http/app.js";
import {
  registerWorkspaceRoutes
} from "../src/http/workspace-routes.js";
import {
  LexSkillRegistry
} from "../src/registry.js";
import {
  LocalAuthStore
} from "../src/auth/store.js";
import {
  LocalAuthService
} from "../src/auth/service.js";
import {
  AuthSessionManager
} from "../src/auth/session-manager.js";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  LocalCaseAccessService
} from "../src/case-access.js";
import {
  SecureCaseUploadStore
} from "../src/case-secure-store.js";
import {
  EncryptedCaseWorkspaceStore
} from "../src/case-workspace-store.js";
import type {
  SessionExecutor
} from "../src/session-executor.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function writeFile(
  root: string,
  relative: string,
  content: string
): void {
  const target =
    path.join(
      root,
      ...relative.split("/")
    );
  fs.mkdirSync(
    path.dirname(target),
    { recursive: true }
  );
  fs.writeFileSync(
    target,
    content,
    "utf8"
  );
}

function workflowRegistry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-http-skills-"
      )
    );
  roots.push(root);

  writeFile(
    root,
    "prawo-polskie-v2/SKILL.md",
    [
      "---",
      "name: prawo-polskie-v2",
      'version: "test"',
      "---",
      "# fixture"
    ].join("\n")
  );
  writeFile(
    root,
    `${DR}/SKILL.md`,
    [
      "---",
      `name: ${DR}`,
      'version: "test"',
      "---",
      "# fixture"
    ].join("\n")
  );
  writeFile(
    root,
    "prawo-polskie-v2/ROUTING-MAP.md",
    `${DR}\n`
  );
  writeFile(
    root,
    "pisma-procesowe-v3/SKILL.md",
    [
      "---",
      "name: pisma-procesowe-v3",
      'version: "test"',
      "type: executive-pisma",
      "---",
      "# fixture"
    ].join("\n")
  );

  for (
    const relative
    of [
      "pisma-procesowe-v3/references/AUTOMAT-STANOW.md",
      "shared/CP-GATE.md",
      "shared/MOD-STEP-TRACKER.md",
      "pisma-procesowe-v3/references/SELF-CHECK-PISMA.md"
    ]
  ) {
    writeFile(
      root,
      relative,
      `fixture:${relative}\n`
    );
  }

  const registry =
    new LexSkillRegistry(root);
  expect(
    registry.scan()
  ).toEqual([]);
  return registry;
}

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-http-data-"
      )
    );
  roots.push(root);

  const authStore =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      authStore,
      {
        sessionManager:
          new AuthSessionManager({
            scheduleExpiryTimers:
              false
          }),
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  const files =
    new LocalCaseFileStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      authStore,
      auth,
      files
    );
  const uploads =
    new SecureCaseUploadStore({
      rootDir: root
    });
  const workspace =
    new EncryptedCaseWorkspaceStore({
      rootDir: root
    });

  const execute =
    vi.fn<
      SessionExecutor["execute"]
    >(
      async (input) => ({
        sessionId:
          "session-g39i",
        status:
          "DRAFT_PRESENTABLE",
        provider:
          input.provider,
        model:
          input.model,
        primarySkill:
          input.primarySkill,
        answer:
          "draft",
        finalization:
          "PASS",
        blockedReferences: [],
        verification: {
          records: 0,
          verified: 0,
          supported: 0,
          unverified: 0
        },
        evidence: [],
        audit: {
          result: "PASS",
          eventCount: 1,
          closed: true
        },
        workflow: {
          id:
            "PROCESS_PLEADING_V1",
          result: "PASS",
          requiredResources: [],
          missingResources: []
        }
      })
    );

  const core =
    createLexHttpApp({
      registry:
        workflowRegistry(),
      modelCatalog: {
        list:
          vi.fn(
            async () => []
          )
      },
      authService: auth,
      caseFileStore: files,
      secureCaseUploadStore:
        uploads,
      caseAccessService:
        cases,
      processWorkflowStore:
        workspace,
      sessionExecutor: {
        execute
      }
    });

  const app =
    express();
  app.use(
    express.json({
      limit: "2mb"
    })
  );

  const workspaceDependencies:
    Parameters<
      typeof registerWorkspaceRoutes
    >[1] = {
      authService: auth,
      caseAccessService:
        cases,
      uploads,
      templates: {
        templatesDir:
          path.join(
            root,
            "templates"
          ),
        listTemplates:
          vi.fn(
            async () => []
          ),
        readTemplate:
          vi.fn(
            async () => {
              throw new Error(
                "TEST_TEMPLATE_NOT_USED"
              );
            }
          )
      },
      privacyVaults: {
        deleteDocumentVault:
          vi.fn(
            async () => false
          )
      },
      documentService: {
        forget:
          vi.fn(
            () => false
          )
      },
      workspace,
      rootDir: root
    };

  registerWorkspaceRoutes(
    app,
    workspaceDependencies
  );
  app.use(core);

  return {
    root,
    app,
    auth,
    execute
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
  "G39I process workflow HTTP integration",
  () => {
    it(
      "suppresses provider calls before start acceptance and auto-resolves only objective N/A checkpoints",
      async () => {
        const current =
          fixture();

        const bootstrap =
          await request(
            current.app
          )
            .post(
              "/api/auth/bootstrap"
            )
            .send({
              loginName:
                "owner",
              displayName:
                "Owner",
              password:
                "G39I integration strong password 2026"
            })
            .expect(201);
        const token =
          String(
            bootstrap.body
              .sessionToken
          );
        const authorization =
          `Bearer ${token}`;

        const createdCase =
          await request(
            current.app
          )
            .post(
              "/api/cases"
            )
            .set(
              "Authorization",
              authorization
            )
            .send({
              displayName:
                "Workflow E2E"
            })
            .expect(201);
        const caseId =
          String(
            createdCase.body
              .caseId
          );

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/workflow/process-pleading/initialize`
          )
          .set(
            "Authorization",
            authorization
          )
          .send({
            mode:
              "CHECKPOINT"
          })
          .expect(201);

        const sessionBody = {
          query:
            "Przygotuj pismo procesowe w tej sprawie.",
          provider:
            "openai",
          model:
            "gpt-test",
          primarySkill: DR,
          mode:
            "PRAWNIK",
          knowledge: {
            caseId,
            includeCase:
              false,
            includeFirm:
              false,
            limit: 8
          }
        };

        await request(
          current.app
        )
          .post(
            "/api/sessions/execute"
          )
          .set(
            "Authorization",
            authorization
          )
          .send(
            sessionBody
          )
          .expect(
            409,
            {
              error:
                "PROCESS_PLEADING_START_ACCEPTANCE_REQUIRED"
            }
          );

        expect(
          current.execute
        ).not.toHaveBeenCalled();

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/workflow/process-pleading/accept-start`
          )
          .set(
            "Authorization",
            authorization
          )
          .send({})
          .expect(200);

        const first =
          await request(
            current.app
          )
            .post(
              "/api/sessions/execute"
            )
            .set(
              "Authorization",
              authorization
            )
            .send(
              sessionBody
            )
            .expect(200);

        expect(
          current.execute
        ).toHaveBeenCalledTimes(
          1
        );
        expect(
          current.execute
            .mock.calls[0]?.[0]
            .processWorkflowContext
        ).toEqual({
          stage: "W1",
          checkpoint:
            "CP-1a",
          mode:
            "CHECKPOINT"
        });
        expect(
          first.body
            .processWorkflow
            .pendingCheckpoint
        ).toBe("CP-1a");

        const confirmed =
          await request(
            current.app
          )
            .post(
              `/api/cases/${caseId}/workflow/process-pleading/confirm`
            )
            .set(
              "Authorization",
              authorization
            )
            .send({
              checkpoint:
                "CP-1a"
            })
            .expect(200);

        const afterCp1aRevision =
          Number(
            confirmed.body
              .state.revision
          );

        const cp1b =
          await request(
            current.app
          )
            .post(
              `/api/cases/${caseId}/workflow/process-pleading/not-applicable`
            )
            .set(
              "Authorization",
              authorization
            )
            .send({
              checkpoint:
                "CP-1b",
              expectedRevision:
                afterCp1aRevision,
              reason:
                "N/A — w tym teście brak drugiej ścieżki prawnej i anomalii podmiotowej."
            })
            .expect(200);

        expect(
          cp1b.body.state
            .checkpoints[
              "CP-1b"
            ]
        ).toBe("NA");

        const second =
          await request(
            current.app
          )
            .post(
              "/api/sessions/execute"
            )
            .set(
              "Authorization",
              authorization
            )
            .send(
              sessionBody
            )
            .expect(200);

        expect(
          current.execute
        ).toHaveBeenCalledTimes(
          2
        );
        expect(
          current.execute
            .mock.calls[1]?.[0]
            .processWorkflowContext
        ).toEqual({
          stage: "W1",
          checkpoint:
            "CP-FSL-D",
          mode:
            "CHECKPOINT"
        });
        expect(
          second.body
            .processWorkflow
            .checkpoints[
              "CP-1c-skan"
            ]
        ).toBe("NA");
        expect(
          second.body
            .processWorkflow
            .checkpoints[
              "CP-PD"
            ]
        ).toBe("NA");
        expect(
          second.body
            .processWorkflow
            .pendingCheckpoint
        ).toBe(
          "CP-FSL-D"
        );

        const encrypted =
          fs.readFileSync(
            path.join(
              current.root,
              "cases",
              caseId,
              "secure",
              "workspace",
              "index.lmw1"
            ),
            "utf8"
          );
        expect(
          encrypted
        ).not.toContain(
          "CP-1c-skan"
        );
        expect(
          encrypted
        ).not.toContain(
          "CP-FSL-D"
        );
        expect(
          encrypted
        ).not.toContain(
          "PENDING_CONFIRMATION"
        );

        current.auth.close();
      }
    );
  }
);

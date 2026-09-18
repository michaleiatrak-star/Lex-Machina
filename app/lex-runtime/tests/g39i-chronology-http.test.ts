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
  SecureCaseArtifactStore
} from "../src/case-artifact-store.js";
import {
  EncryptedCaseWorkspaceStore
} from "../src/case-workspace-store.js";
import {
  SESSION_EXECUTION_INTERNAL,
  type SessionExecutionResponse,
  type SessionExecutor
} from "../src/session-executor.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function writeFixture(
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

function registry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-chronology-skills-"
      )
    );
  roots.push(root);

  for (
    const [
      name,
      type,
      description
    ] of [
      [
        "prawo-polskie-v2",
        "domain-router",
        "routing polskiego prawa"
      ],
      [
        DR,
        "domain",
        "cywilne gospodarcze"
      ],
      [
        "chronologia-sprawy-v1",
        "executive-chronologia",
        "oś czasu zdarzeń dokumentów i terminów"
      ]
    ] as const
  ) {
    writeFixture(
      root,
      `${name}/SKILL.md`,
      [
        "---",
        `name: ${name}`,
        'version: "test"',
        `type: ${type}`,
        `description: "${description}"`,
        "---",
        "# fixture"
      ].join("\n")
    );
  }

  writeFixture(
    root,
    "prawo-polskie-v2/ROUTING-MAP.md",
    DR + "\n"
  );

  for (
    const relative
    of [
      "shared/PRAWO-HARDGATE.md",
      "shared/SELF-CHECK-ANTY-FASADA.md",
      "shared/MOD-OS-CZASU-PRZESLANEK.md",
      "chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md",
      "chronologia-sprawy-v1/references/sprzecznosci-dat.md"
    ]
  ) {
    writeFixture(
      root,
      relative,
      `fixture:${relative}\n`
    );
  }

  const result =
    new LexSkillRegistry(root);
  expect(result.scan())
    .toEqual([]);
  return result;
}

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-chronology-data-"
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
  const artifacts =
    new SecureCaseArtifactStore({
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
      async (input) => {
        const result:
          SessionExecutionResponse = {
          sessionId:
            "session-g39i-chronology",
          status:
            "DRAFT_PRESENTABLE",
          provider:
            input.provider,
          model:
            input.model,
          primarySkill:
            input.primarySkill,
          answer:
            "chronology-step-result",
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
            eventCount: 3,
            closed: true
          },
          workflow: {
            id:
              "CHRONOLOGY_V1",
            result: "PASS",
            requiredResources: [],
            missingResources: []
          }
        };

        Object.defineProperty(
          result,
          SESSION_EXECUTION_INTERNAL,
          {
            value: {
              verificationRecords: [],
              auditEvents: [
                {
                  sequence: 1,
                  timestamp:
                    "2026-09-18T07:00:00.000Z",
                  type:
                    "session_started",
                  target:
                    "session-g39i-chronology",
                  status: "OK"
                },
                {
                  sequence: 2,
                  timestamp:
                    "2026-09-18T07:00:01.000Z",
                  type: "gate",
                  target:
                    "G39H_WORKFLOW_FINALIZATION",
                  status: "OK"
                },
                {
                  sequence: 3,
                  timestamp:
                    "2026-09-18T07:00:02.000Z",
                  type:
                    "session_closed",
                  target:
                    "session-g39i-chronology",
                  status: "OK"
                }
              ]
            },
            enumerable: false
          }
        );

        return result;
      }
    );

  const core =
    createLexHttpApp({
      registry: registry(),
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
      secureCaseArtifactStore:
        artifacts,
      caseAccessService:
        cases,
      chronologyWorkflowStore:
        workspace,
      sessionExecutor: {
        execute
      }
    });

  const app = express();
  app.use(
    express.json({
      limit: "2mb"
    })
  );
  registerWorkspaceRoutes(
    app,
    {
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
    }
  );
  app.use(core);

  return {
    root,
    app,
    auth,
    execute
  };
}

async function bootstrapCase(
  current:
    ReturnType<
      typeof fixture
    >
) {
  const bootstrap =
    await request(
      current.app
    )
      .post(
        "/api/auth/bootstrap"
      )
      .send({
        loginName:
          "chronology-owner",
        displayName:
          "Chronology Owner",
        password:
          "G39I chronology strong password 2026"
      })
      .expect(201);
  const authorization =
    `Bearer ${String(
      bootstrap.body
        .sessionToken
    )}`;

  const created =
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
          "Chronology E2E"
      })
      .expect(201);

  return {
    authorization,
    caseId:
      String(
        created.body.caseId
      )
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
  "G39I chronology HTTP integration",
  () => {
    it(
      "advances one checkpoint and persists an authorized audit artifact",
      async () => {
        const current =
          fixture();
        const {
          authorization,
          caseId
        } =
          await bootstrapCase(
            current
          );

        const response =
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
            .send({
              query:
                "Zbuduj chronologię sprawy i oś czasu zdarzeń.",
              provider:
                "openai",
              model:
                "gpt-test",
              primarySkill:
                DR,
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
            })
            .expect(200);

        expect(
          current.execute
        ).toHaveBeenCalledTimes(
          1
        );
        expect(
          current.execute
            .mock.calls[0]?.[0]
            .chronologyWorkflowContext
        ).toEqual({
          stage:
            "INVENTORY",
          checkpoint:
            "DOCUMENT_INVENTORY_COMPLETE",
          temporalGateRequired:
            false
        });

        expect(
          response.body
            .chronologyWorkflow
        ).toMatchObject({
          revision: 2,
          stage: "THREADS",
          temporalGateRequired:
            false,
          nextCheckpoint:
            "THREAD_IDENTIFICATION_COMPLETE",
          closedCheckpoints: [
            "DOCUMENT_INVENTORY_COMPLETE"
          ]
        });

        const state =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow/chronology`
            )
            .set(
              "Authorization",
              authorization
            )
            .expect(200);

        const auditRef =
          String(
            state.body.state
              .history.at(-1)
              .auditRefs[0]
          );
        expect(auditRef)
          .toMatch(
            /^artifact:\/\/artifact_[a-f0-9]{32}$/
          );

        const audit =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow-audits/${auditRef.slice("artifact://".length)}`
            )
            .set(
              "Authorization",
              authorization
            )
            .expect(200);

        expect(
          audit.body.audit
        ).toMatchObject({
          caseId,
          workflowId:
            "CHRONOLOGY_V1",
          checkpoint:
            "DOCUMENT_INVENTORY_COMPLETE",
          audit: {
            result: "PASS",
            closed: true
          }
        });

        const encrypted =
          fs.readFileSync(
            path.join(
              current.root,
              "cases",
              caseId,
              "secure",
              "artifacts",
              audit.body
                .artifactId,
              "payload.lme"
            ),
            "utf8"
          );
        expect(encrypted)
          .not.toContain(
            "CHRONOLOGY_V1"
          );
        expect(encrypted)
          .not.toContain(
            "DOCUMENT_INVENTORY_COMPLETE"
          );

        current.auth.close();
      }
    );
  }
);

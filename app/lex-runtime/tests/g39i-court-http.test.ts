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
import {
  SESSION_EXECUTION_INTERNAL,
  type SessionExecutionResponse,
  type SessionExecutor
} from "../src/session-executor.js";
import {
  SecureCaseArtifactStore
} from "../src/case-artifact-store.js";

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

function registry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-court-skills-"
      )
    );
  roots.push(root);

  for (
    const [
      name,
      type
    ] of [
      [
        "prawo-polskie-v2",
        "domain-router"
      ],
      [DR, "domain"],
      [
        "analiza-sadowa-v6",
        "executive-analiza"
      ]
    ] as const
  ) {
    writeFile(
      root,
      `${name}/SKILL.md`,
      [
        "---",
        `name: ${name}`,
        'version: "test"',
        `type: ${type}`,
        'description: "analiza pozycji sprawy sądowej jakie mam szanse dowody"',
        "---",
        "# fixture"
      ].join("\n")
    );
  }

  writeFile(
    root,
    "prawo-polskie-v2/ROUTING-MAP.md",
    `${DR}\n`
  );

  for (
    const relative of [
      "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
      "shared/PRAWO-HARDGATE.md",
      "analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md"
    ]
  ) {
    writeFile(
      root,
      relative,
      `fixture:${relative}\n`
    );
  }

  const current =
    new LexSkillRegistry(root);
  expect(current.scan())
    .toEqual([]);
  return current;
}

function fixture(
  blocked = false
) {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-court-data-"
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
  const artifacts =
    new SecureCaseArtifactStore({
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
            "session-g39i-court",
          status:
            blocked
              ? "BLOCKED"
              : "DRAFT_PRESENTABLE",
          provider:
            input.provider,
          model:
            input.model,
          primarySkill:
            input.primarySkill,
          ...(!blocked
            ? {
                answer:
                  "court-stage-result"
              }
            : {}),
          finalization:
            blocked
              ? "BLOCKED"
              : "PASS",
          blockedReferences: [],
          verification: {
            records: 0,
            verified: 0,
            supported: 0,
            unverified: 0
          },
          evidence: [],
          audit: {
            result:
              blocked
                ? "BLOCKED"
                : "PASS",
            eventCount:
              blocked
                ? 1
                : 3,
            closed: true
          },
          workflow: {
            id:
              "COURT_ANALYSIS_V1",
            result:
              blocked
                ? "BLOCKED"
                : "PASS",
            requiredResources: [],
            missingResources: []
          }
        };

        if (!blocked) {
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
                      "session-g39i-court",
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
                      "session-g39i-court",
                    status: "OK"
                  }
                ]
              },
              enumerable: false
            }
          );
        }

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
      caseAccessService:
        cases,
      courtAnalysisWorkflowStore:
        workspace,
      secureCaseArtifactStore:
        artifacts,
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
  current: ReturnType<
    typeof fixture
  >,
  suffix: string
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
          `court-${suffix}`,
        displayName:
          "Court Owner",
        password:
          `G39I court ${suffix} strong password 2026`
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
          "Court analysis E2E"
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
  "G39I court analysis HTTP integration",
  () => {
    it(
      "auto-initializes encrypted state and advances exactly one audited checkpoint",
      async () => {
        const current =
          fixture();
        const {
          authorization,
          caseId
        } =
          await bootstrapCase(
            current,
            "pass"
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
                "Jakie mam szanse w tej sprawie? Przeprowadź analizę sądową.",
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
            .courtWorkflowContext
        ).toEqual({
          stage:
            "EVIDENCE_SCAN",
          checkpoint:
            "SD_VER_COMPLETE"
        });
        expect(
          response.body
            .courtWorkflow
            .revision
        ).toBe(2);
        expect(
          response.body
            .courtWorkflow
            .stage
        ).toBe(
          "PASS_I_FACTS"
        );
        expect(
          response.body
            .courtWorkflow
            .nextCheckpoint
        ).toBe(
          "PASS_I_ISOLATION_CLEAN"
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
        expect(encrypted)
          .not.toContain(
            "COURT_ANALYSIS_V1"
          );
        expect(encrypted)
          .not.toContain(
            "SD_VER_COMPLETE"
          );
        expect(encrypted)
          .not.toContain(
            "PASS_I_FACTS"
          );

        const state =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow/court-analysis`
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
        const auditId =
          auditRef.slice(
            "artifact://".length
          );
        const audit =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow-audits/${auditId}`
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
            "COURT_ANALYSIS_V1",
          checkpoint:
            "SD_VER_COMPLETE",
          audit: {
            result: "PASS",
            closed: true
          }
        });

        current.auth.close();
      }
    );

    it(
      "does not advance persisted state when the semantic node is blocked",
      async () => {
        const current =
          fixture(true);
        const {
          authorization,
          caseId
        } =
          await bootstrapCase(
            current,
            "blocked"
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
                "Jakie mam szanse? Analiza pozycji sądowej.",
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
          response.body.status
        ).toBe("BLOCKED");
        expect(
          response.body
            .courtWorkflow
            .revision
        ).toBe(1);
        expect(
          response.body
            .courtWorkflow
            .stage
        ).toBe(
          "EVIDENCE_SCAN"
        );
        expect(
          response.body
            .courtWorkflow
            .nextCheckpoint
        ).toBe(
          "SD_VER_COMPLETE"
        );

        const state =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow/court-analysis`
            )
            .set(
              "Authorization",
              authorization
            )
            .expect(200);
        expect(
          state.body.state
            .revision
        ).toBe(1);
        expect(
          state.body.state
            .closedCheckpoints
        ).toEqual([]);

        current.auth.close();
      }
    );
  }
);

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

function put(
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
        "lex-g39i-ordered-skills-"
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
        "routing prawa"
      ],
      [
        DR,
        "domain",
        "cywilne gospodarcze"
      ],
      [
        "analizator-dowodow-v3",
        "executive-analiza",
        "mail sms nagranie faktura dowód"
      ],
      [
        "przesluchanie-swiadkow-v2-min90",
        "legal-skill",
        "świadek pytania do świadka"
      ]
    ] as const
  ) {
    put(
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

  put(
    root,
    "prawo-polskie-v2/ROUTING-MAP.md",
    DR + "\n"
  );

  for (
    const relative
    of [
      "shared/PRAWO-HARDGATE.md",
      "shared/SELF-CHECK-ANTY-FASADA.md",
      "shared/MOD-SKAN-DOWODOW-KOMPLETNY.md",
      "shared/MOD-STEP-TRACKER.md",
      "shared/DOMAIN-LOCK.md",
      "shared/RATE-COMPLETENESS.md",
      "przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md"
    ]
  ) {
    put(
      root,
      relative,
      `fixture:${relative}\n`
    );
  }

  const value =
    new LexSkillRegistry(root);
  expect(value.scan())
    .toEqual([]);
  return value;
}

function fixture(
  blocked = false
) {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-ordered-data-"
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
        const workflowId =
          input
            .orderedCaseWorkflowContext
            ?.workflowId;
        if (!workflowId) {
          throw new Error(
            "ORDERED_CONTEXT_EXPECTED"
          );
        }

        const result:
          SessionExecutionResponse = {
          sessionId:
            "session-g39i-ordered",
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
                  "ordered-checkpoint-result"
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
            id: workflowId,
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
                      "2026-09-18T13:20:00.000Z",
                    type:
                      "session_started",
                    target:
                      "session-g39i-ordered",
                    status: "OK"
                  },
                  {
                    sequence: 2,
                    timestamp:
                      "2026-09-18T13:20:01.000Z",
                    type: "gate",
                    target:
                      "G39I_WORKFLOW_CONTRACT",
                    status: "OK"
                  },
                  {
                    sequence: 3,
                    timestamp:
                      "2026-09-18T13:20:02.000Z",
                    type:
                      "session_closed",
                    target:
                      "session-g39i-ordered",
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
      secureCaseArtifactStore:
        artifacts,
      caseAccessService:
        cases,
      orderedCaseWorkflowStore:
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

async function bootstrap(
  current:
    ReturnType<
      typeof fixture
    >,
  suffix: string
) {
  const auth =
    await request(
      current.app
    )
      .post(
        "/api/auth/bootstrap"
      )
      .send({
        loginName:
          `ordered-${suffix}`,
        displayName:
          "Ordered Owner",
        password:
          `G39I ordered ${suffix} strong password 2026`
      })
      .expect(201);
  const authorization =
    `Bearer ${String(
      auth.body.sessionToken
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
          `Ordered ${suffix}`
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

async function run(
  current:
    ReturnType<
      typeof fixture
    >,
  authorization: string,
  caseId: string,
  query: string
) {
  return await request(
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
      query,
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
        includeCase: false,
        includeFirm: false,
        limit: 8
      }
    })
    .expect(200);
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
  "G39I ordered evidence/witness HTTP integration",
  () => {
    it.each([
      {
        workflowId:
          "EVIDENCE_ANALYSIS_V1",
        query:
          "Przeanalizuj fakturę jako dowód w tej sprawie.",
        first:
          "AD-KROK0-BLOKADA",
        next:
          "AD-KROK0a-MODE"
      },
      {
        workflowId:
          "WITNESS_QUESTIONING_V1",
        query:
          "Przygotuj pytania do świadka w tej sprawie.",
        first:
          "PRE-W1a-SD-VER",
        next:
          "PRE-W1a.4-RZ-SHOW"
      }
    ] as const)(
      "advances exactly one audited checkpoint for $workflowId",
      async ({
        workflowId,
        query,
        first,
        next
      }) => {
        const current =
          fixture();
        const {
          authorization,
          caseId
        } =
          await bootstrap(
            current,
            workflowId
              .toLowerCase()
              .slice(0, 18)
          );

        const response =
          await run(
            current,
            authorization,
            caseId,
            query
          );

        expect(
          current.execute
            .mock.calls[0]?.[0]
            .orderedCaseWorkflowContext
        ).toEqual({
          workflowId,
          checkpoint: first,
          revision: 1
        });
        expect(
          response.body
            .orderedCaseWorkflow
        ).toMatchObject({
          workflowId,
          caseId,
          revision: 2,
          status: "ACTIVE",
          nextCheckpoint: next,
          closedCheckpoints: [
            first
          ]
        });

        const state =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow/ordered/${workflowId}`
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
          workflowId,
          checkpoint: first,
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
              "workspace",
              "index.lmw1"
            ),
            "utf8"
          );
        expect(encrypted)
          .not.toContain(
            workflowId
          );
        expect(encrypted)
          .not.toContain(
            first
          );

        current.auth.close();
      }
    );

    it(
      "does not advance evidence state after a blocked turn",
      async () => {
        const current =
          fixture(true);
        const {
          authorization,
          caseId
        } =
          await bootstrap(
            current,
            "blocked"
          );

        const response =
          await run(
            current,
            authorization,
            caseId,
            "Przeanalizuj fakturę jako dowód w tej sprawie."
          );

        expect(
          response.body.status
        ).toBe("BLOCKED");
        expect(
          response.body
            .orderedCaseWorkflow
        ).toMatchObject({
          workflowId:
            "EVIDENCE_ANALYSIS_V1",
          revision: 1,
          status: "ACTIVE",
          nextCheckpoint:
            "AD-KROK0-BLOKADA",
          closedCheckpoints: []
        });

        current.auth.close();
      }
    );
  }
);

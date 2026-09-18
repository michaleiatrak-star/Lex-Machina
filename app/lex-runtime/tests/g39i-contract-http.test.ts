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
        "lex-g39i-contract-skills-"
      )
    );
  roots.push(root);

  for (
    const [name, type, description]
    of [
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
        "analizator-umow-v1",
        "executive-umowy",
        "analiza redakcja przygotowanie umowy kontraktu"
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
    `${DR}\n`
  );

  for (
    const relative
    of [
      "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
      "shared/PRAWO-HARDGATE.md",
      "shared/SELF-CHECK-ANTY-FASADA.md",
      "shared/MOD-STEP-TRACKER.md"
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

function fixture(
  blocked = false
) {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g39i-contract-data-"
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
          "session-g39i-contract",
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
                "contract-step-result"
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
          eventCount: 1,
          closed: true
        },
        workflow: {
          id:
            "CONTRACT_ANALYSIS_V1",
          result:
            blocked
              ? "BLOCKED"
              : "PASS",
          requiredResources: [],
          missingResources: []
        }
      })
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
      contractWorkflowStore:
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
          `contract-${suffix}`,
        displayName:
          "Contract Owner",
        password:
          `G39I contract ${suffix} strong password 2026`
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
      .post("/api/cases")
      .set(
        "Authorization",
        authorization
      )
      .send({
        displayName:
          "Contract analysis E2E"
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

function sessionBody(
  caseId: string
) {
  return {
    query:
      "Przygotuj projekt umowy i wykonaj analizę kontraktową.",
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
  "G39I contract-analysis HTTP integration",
  () => {
    it(
      "requires explicit mode initialization before provider execution",
      async () => {
        const current =
          fixture();
        const {
          authorization,
          caseId
        } =
          await bootstrapCase(
            current,
            "missing"
          );

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
            sessionBody(caseId)
          )
          .expect(409, {
            error:
              "CONTRACT_STATE_REQUIRED"
          });

        expect(
          current.execute
        ).not.toHaveBeenCalled();

        current.auth.close();
      }
    );

    it(
      "advances exactly AU-F0 after a fully passing semantic node",
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

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/workflow/contract-analysis/initialize`
          )
          .set(
            "Authorization",
            authorization
          )
          .send({
            mode: "DRAFT"
          })
          .expect(201);

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
            .send(
              sessionBody(caseId)
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
            .contractWorkflowContext
        ).toEqual({
          mode: "DRAFT",
          stage: "INTAKE",
          checkpoint: "AU-F0"
        });

        expect(
          response.body
            .contractWorkflow
        ).toMatchObject({
          revision: 2,
          mode: "DRAFT",
          stage: "INTAKE",
          nextCheckpoint:
            "AU-GAP",
          closedCheckpoints: [
            "AU-F0"
          ]
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
            "CONTRACT_ANALYSIS_V1"
          );
        expect(encrypted)
          .not.toContain("AU-F0");
        expect(encrypted)
          .not.toContain("DRAFT");

        current.auth.close();
      }
    );

    it(
      "does not advance persisted AU state when the semantic node is blocked",
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

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/workflow/contract-analysis/initialize`
          )
          .set(
            "Authorization",
            authorization
          )
          .send({
            mode: "ANALYSIS"
          })
          .expect(201);

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
            .send(
              sessionBody(caseId)
            )
            .expect(200);

        expect(
          response.body.status
        ).toBe("BLOCKED");
        expect(
          response.body
            .contractWorkflow
        ).toMatchObject({
          revision: 1,
          mode: "ANALYSIS",
          stage: "INTAKE",
          nextCheckpoint:
            "AU-F0",
          closedCheckpoints: []
        });

        const state =
          await request(
            current.app
          )
            .get(
              `/api/cases/${caseId}/workflow/contract-analysis`
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

        current.auth.close();
      }
    );
  }
);

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import {
  MissingProviderCredentialError,
  StaticCredentialResolver
} from "../src/providers/credentials.js";
import {
  ProviderGatewayError
} from "../src/providers/gateway.js";
import { LexSkillRegistry } from "../src/registry.js";
import {
  SESSION_EXECUTION_INTERNAL,
  type SessionExecutor,
  type SessionExecutionResponse
} from "../src/session-executor.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-http-session-"));
  roots.push(root);

  for (const name of ["prawo-polskie-v2", DR]) {
    const dir = path.join(root, name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      `---\nname: ${name}\n---\n# test\n`
    );
  }
  fs.writeFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    DR + "\n"
  );

  const result = new LexSkillRegistry(root);
  result.scan();
  return result;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("session execution HTTP API", () => {
  it("returns only boolean provider configuration status", async () => {
    const secretOpenAi =
      "test-openai-secret-value";
    const secretXai =
      "test-xai-secret-value";

    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      credentialResolver:
        new StaticCredentialResolver({
          openai: secretOpenAi,
          xai: secretXai
        })
    });

    const response =
      await request(app)
        .get("/api/providers")
        .expect(200);

    expect(response.body).toEqual({
      providers: [
        {
          provider: "openai",
          configured: true
        },
        {
          provider: "anthropic",
          configured: false
        },
        {
          provider: "xai",
          configured: true
        }
      ]
    });

    const serialized =
      JSON.stringify(response.body);

    expect(serialized)
      .not.toContain(secretOpenAi);
    expect(serialized)
      .not.toContain(secretXai);
    expect(serialized)
      .not.toContain("API_KEY");
  });

  it("returns the executor's sanitized result", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn(async (input) => ({
        sessionId: "session-1",
        status: "DRAFT_PRESENTABLE" as const,
        provider: input.provider,
        model: input.model,
        primarySkill: input.primarySkill,
        answer: "safe draft",
        finalization: "PASS" as const,
        blockedReferences: [],
        verification: {
          records: 0,
          verified: 0,
          supported: 0,
          unverified: 0
        },
        evidence: [],
        audit: {
          result: "PASS" as const,
          eventCount: 12,
          closed: true
        }
      }))
    };

    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });

    const response = await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR,
        mode: "PRAWNIK"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      status: "DRAFT_PRESENTABLE",
      answer: "safe draft",
      finalization: "PASS"
    });
  });

  it("exposes the live draft of a running execution and removes it when done", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let draftSeen!: () => void;
    const drafted = new Promise<void>((resolve) => {
      draftSeen = resolve;
    });
    const executor: SessionExecutor = {
      execute: vi.fn(async (input) => {
        input.onDraft?.("Częściowa odpowiedź");
        draftSeen();
        await gate;
        return {
          sessionId: "session-draft",
          status: "DRAFT_PRESENTABLE" as const,
          provider: input.provider,
          model: input.model,
          primarySkill: input.primarySkill,
          answer: "Pełna odpowiedź",
          finalization: "PASS" as const,
          blockedReferences: [],
          verification: { records: 0, verified: 0, supported: 0, unverified: 0 },
          evidence: [],
          audit: { result: "PASS" as const, eventCount: 1, closed: true }
        };
      })
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });
    const executionId = "0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0";

    const running = request(app)
      .post("/api/sessions/execute")
      .set("X-Lex-Execution-Id", executionId)
      .send({
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR,
        mode: "PRAWNIK"
      })
      .then((response) => response);

    await drafted;
    const progress = await request(app)
      .get(`/api/sessions/progress/${executionId}`)
      .expect(200);
    expect(progress.body.text).toBe("Częściowa odpowiedź");

    release();
    const final = await running;
    expect(final.status).toBe(200);
    expect(final.body.answer).toBe("Pełna odpowiedź");

    await request(app)
      .get(`/api/sessions/progress/${executionId}`)
      .expect(404);
  });

  it("restores document aliases only at the local HTTP presentation boundary", async () => {
    const result:
      SessionExecutionResponse = {
        sessionId:
          "session-pii-1",
        status:
          "DRAFT_PRESENTABLE",
        provider:
          "openai",
        model:
          "gpt-test",
        primarySkill:
          DR,
        answer:
          "Powód [LMPII:D01:PERSON:0001], pozwany [LMPII:D02:PERSON:0001].",
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
        }
      };
    Object.defineProperty(
      result,
      SESSION_EXECUTION_INTERNAL,
      {
        value: {
          verificationRecords: [],
          auditEvents: [],
          documentAliasDocumentIds: [
            "doc_aaaaaaaaaaaaaaaaaaaaaaaa",
            "doc_bbbbbbbbbbbbbbbbbbbbbbbb"
          ]
        },
        enumerable: false
      }
    );

    const executor:
      SessionExecutor = {
        execute:
          vi.fn(
            async () =>
              result
          )
      };
    const documentService = {
      ingestPdf:
        vi.fn(),
      ingestImage:
        vi.fn(),
      review:
        vi.fn(),
      finalizeReview:
        vi.fn(),
      resolveProtectedChunks:
        vi.fn(),
      deanonymize:
        vi.fn(
          (
            documentId:
              string,
            text: string
          ) => {
            if (
              documentId ===
                "doc_aaaaaaaaaaaaaaaaaaaaaaaa" &&
              text ===
                "[PII:PERSON:0001]"
            ) {
              return "Jan Kowalski";
            }
            if (
              documentId ===
                "doc_bbbbbbbbbbbbbbbbbbbbbbbb" &&
              text ===
                "[PII:PERSON:0001]"
            ) {
              return "Anna Nowak";
            }
            throw new Error(
              "Unknown token"
            );
          }
        )
    };

    const app =
      createLexHttpApp({
        registry:
          registry(),
        modelCatalog: {
          list:
            vi.fn(
              async () => []
            )
        },
        sessionExecutor:
          executor,
        documentService
      });

    const response =
      await request(app)
        .post(
          "/api/sessions/execute"
        )
        .send({
          query:
            "Pytanie",
          provider:
            "openai",
          model:
            "gpt-test",
          primarySkill:
            DR,
          mode:
            "PRAWNIK"
        })
        .expect(200);

    expect(
      response.body.answer
    ).toBe(
      "Powód Jan Kowalski, pozwany Anna Nowak."
    );
    expect(
      JSON.stringify(
        response.body
      )
    ).not.toContain(
      "LMPII"
    );
  });

  it("rejects malformed requests before provider execution", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn()
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });

    await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR
      })
      .expect(400, { error: "INVALID_SESSION_REQUEST" });

    expect(executor.execute).not.toHaveBeenCalled();
  });

  it("rejects non-DR execution routes before provider execution", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn()
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });

    const response = await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: "prawo-polskie-v2"
      })
      .expect(422);

    expect(response.body).toMatchObject({
      error: "INVALID_ROUTE",
      reason: "NOT_A_DR"
    });
    expect(executor.execute).not.toHaveBeenCalled();
  });

  it("sanitizes missing-provider-credential failures", async () => {
    const executor: SessionExecutor = {
      async execute() {
        throw new MissingProviderCredentialError("xai");
      }
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });

    const response = await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Pytanie",
        provider: "xai",
        model: "grok-test",
        primarySkill: DR
      })
      .expect(503);

    expect(response.body).toEqual({
      error: "PROVIDER_NOT_CONFIGURED",
      provider: "xai"
    });
  });

  it("surfaces local runtime startup failures instead of SESSION_EXECUTION_FAILED", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn(async () => {
        throw new ProviderGatewayError(
          "PROVIDER_ERROR",
          "local provider failed",
          "openai",
          new Error(
            "LOCAL_MODEL_SERVER_EXIT:1:insufficient memory"
          )
        );
      })
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      sessionExecutor: executor
    });

    await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Czy używasz lokalnego modelu językowego?",
        provider: "openai",
        model:
          "local/mistral-nemo-12b-q4km",
        primarySkill: DR,
        mode: "PRAWNIK"
      })
      .expect(503, {
        error:
          "LOCAL_MODEL_EXECUTION_FAILED",
        reason:
          "LOCAL_MODEL_SERVER_EXIT",
        description:
          "LOCAL_MODEL_SERVER_EXIT:1:insufficient memory"
      });
  });

  it("maps unclassified local inference failures to a local diagnostic", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn(
        async () => {
          throw new Error(
            "fetch failed"
          );
        }
      )
    };
    const app =
      createLexHttpApp({
        registry:
          registry(),
        modelCatalog: {
          list:
            vi.fn(
              async () => []
            )
        },
        sessionExecutor:
          executor
      });

    await request(app)
      .post(
        "/api/sessions/execute"
      )
      .send({
        query:
          "Czy używasz lokalnego modelu językowego?",
        provider:
          "openai",
        model:
          "local/mistral-nemo-12b-q4km",
        primarySkill:
          DR,
        mode:
          "PRAWNIK"
      })
      .expect(503, {
        error:
          "LOCAL_MODEL_EXECUTION_FAILED",
        reason:
          "LOCAL_MODEL_INFERENCE_FAILED",
        description:
          "fetch failed"
      });
  });

  it("reports the fail-closed chat privacy gate instead of a generic failure", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn(async () => {
        throw new Error(
          "CHAT_PRIVACY_GATE_FAILED"
        );
      })
    };
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor
    });

    // The gate blocks the turn before anything reaches a provider, which is a
    // named, actionable condition. Surfacing it as SESSION_EXECUTION_FAILED
    // left the user with an unexplained error and no way to act on it.
    await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR,
        mode: "PRAWNIK"
      })
      .expect(503, {
        error: "CHAT_PRIVACY_GATE_FAILED"
      });

    expect(executor.execute)
      .toHaveBeenCalledTimes(1);
  });
});

describe("AUTO skill selection", () => {
  const envelope = (query: string) =>
    `__LEX_SKILLS_V1__ ${JSON.stringify({ auto: true, manual: [], caseType: "AUTO" })}\n${query}`;

  function app() {
    const execute = vi.fn(async () => {
      throw new Error("STOP");
    });
    const resolveAutoRouting = vi.fn(async () => ({
      decision: {
        legal: true,
        primarySkill: DR,
        domainSkills: [DR],
        executionSkills: [],
        workflowExecutionSkill: null
      },
      query: envelope("Pytanie")
    }));
    return {
      execute,
      resolveAutoRouting,
      app: createLexHttpApp({
        registry: registry(),
        modelCatalog: { list: vi.fn(async () => []) },
        sessionExecutor: { execute, resolveAutoRouting }
      })
    };
  }

  it("lets an account or API model pick the skills itself", async () => {
    const setup = app();
    await request(setup.app)
      .post("/api/sessions/execute")
      .send({
        query: envelope("Sąsiad nie oddaje pożyczki."),
        provider: "anthropic",
        model: "account/claude",
        primarySkill: "AUTO",
        mode: "PRAWNIK"
      });
    expect(setup.resolveAutoRouting).not.toHaveBeenCalled();
    expect(setup.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        modelSelectsSkills: true,
        primarySkill: expect.stringMatching(/^dr-/)
      })
    );
  });

  it("routes an AUTO document request instead of rejecting it as INVALID_ROUTE", async () => {
    const setup = app();
    const documentApp = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: {
        execute: setup.execute,
        resolveAutoRouting: setup.resolveAutoRouting
      },
      caseAccessService: {} as never,
      documentAuthoringService: {} as never,
      documentAstGenerator: {} as never,
      documentService: {} as never
    });
    const response = await request(documentApp)
      .post("/api/cases/case_abc/artifacts/generate")
      .send({
        query: envelope("Zrób wzór wezwania do zapłaty"),
        provider: "anthropic",
        model: "account/claude",
        primarySkill: "AUTO",
        mode: "PRAWNIK",
        format: "docx",
        documentType: "letter",
        styleProfile: "lex-classic-clean-v1"
      });
    // Past routing: without a signed-in user the request stops at the
    // authentication context, not at route validation.
    expect(response.body.error).toBe("AUTH_CONTEXT_MISSING");
    // The document pipeline needs its domain before it starts.
    expect(setup.resolveAutoRouting).toHaveBeenCalledTimes(1);
  });

  it("keeps the routing pass for local models", async () => {
    const setup = app();
    await request(setup.app)
      .post("/api/sessions/execute")
      .send({
        query: envelope("Sąsiad nie oddaje pożyczki."),
        provider: "openai",
        model: "local/bielik-11b-v3-q4km",
        primarySkill: "AUTO",
        mode: "PRAWNIK"
      });
    expect(setup.resolveAutoRouting).toHaveBeenCalledTimes(1);
    expect(setup.execute).toHaveBeenCalledWith(
      expect.not.objectContaining({
        modelSelectsSkills: true
      })
    );
  });
});

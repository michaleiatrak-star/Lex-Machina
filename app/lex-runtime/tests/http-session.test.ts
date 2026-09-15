import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import {
  MissingProviderCredentialError
} from "../src/providers/credentials.js";
import { LexSkillRegistry } from "../src/registry.js";
import type { SessionExecutor } from "../src/session-executor.js";

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
});

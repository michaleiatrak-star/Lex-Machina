import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import { MissingProviderCredentialError } from "../src/providers/credentials.js";

const roots: string[] = [];

function createSkill(
  root: string,
  name: string,
  extra = ""
): void {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "SKILL.md"),
    `---\nname: ${name}\nversion: "1.0"\ndescription: "public desc"\n${extra}---\nSECRET PROMPT BODY FOR ${name}\n`
  );
}

function fixture(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-http-"));
  roots.push(root);
  createSkill(root, "prawo-polskie-v2");
  createSkill(root, "dr-02-prawo-cywilne-rodzinne-gospodarcze");

  fs.writeFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    "dr-02-prawo-cywilne-rodzinne-gospodarcze\n"
  );

  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("Lex local HTTP API", () => {
  it("exposes a minimal health endpoint", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: { list: vi.fn(async () => []) }
    });

    const response = await request(app).get("/health").expect(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "lex-machina-runtime",
      localOnly: true
    });
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  it("never exposes SKILL.md prompt bodies through the skills API", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: { list: vi.fn(async () => []) }
    });

    const response = await request(app).get("/api/skills").expect(200);
    expect(JSON.stringify(response.body)).not.toContain(
      "SECRET PROMPT BODY"
    );
    expect(response.body.skills).toContainEqual(
      expect.objectContaining({
        name: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
        version: "1.0"
      })
    );
  });

  it("allows loopback origins and rejects remote web origins", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: { list: vi.fn(async () => []) }
    });

    await request(app)
      .get("/health")
      .set("Origin", "http://127.0.0.1:5173")
      .expect(200);

    await request(app)
      .get("/health")
      .set("Origin", "https://example.com")
      .expect(403, { error: "ORIGIN_NOT_ALLOWED" });
  });

  it("validates DR routing without invoking a model", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: { list: vi.fn(async () => []) }
    });

    await request(app)
      .post("/api/routes/validate")
      .send({
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze"
      })
      .expect(200, {
        valid: true,
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze"
      });

    const invalid = await request(app)
      .post("/api/routes/validate")
      .send({ primarySkill: "pisma-procesowe-v3" })
      .expect(422);
    expect(invalid.body).toMatchObject({
      valid: false,
      reason: "NOT_A_DR"
    });
  });

  it("returns sanitized provider-not-configured errors", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: {
        list: vi.fn(async () => {
          throw new MissingProviderCredentialError("openai");
        })
      }
    });

    const response = await request(app)
      .get("/api/models/openai")
      .expect(503);

    expect(response.body).toEqual({
      error: "PROVIDER_NOT_CONFIGURED",
      provider: "openai"
    });
    expect(JSON.stringify(response.body)).not.toContain("API_KEY");
  });

  it("returns model descriptors but never credential material", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: {
        list: vi.fn(async () => [{
          provider: "openai" as const,
          id: "gpt-test",
          displayName: "gpt-test",
          selectable: true
        }])
      }
    });

    const response = await request(app)
      .get("/api/models/openai")
      .expect(200);

    expect(response.body).toEqual({
      provider: "openai",
      models: [{
        provider: "openai",
        id: "gpt-test",
        displayName: "gpt-test",
        selectable: true
      }]
    });
  });

  it("rejects unknown providers", async () => {
    const app = createLexHttpApp({
      registry: fixture(),
      modelCatalog: { list: vi.fn(async () => []) }
    });

    await request(app)
      .get("/api/models/not-a-provider")
      .expect(404, { error: "UNKNOWN_PROVIDER" });
  });
});

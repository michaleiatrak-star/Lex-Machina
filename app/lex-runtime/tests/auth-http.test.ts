import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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
  LexSkillRegistry
} from "../src/registry.js";
import {
  LocalAuthStore
} from "../src/auth/store.js";
import {
  LocalAuthService
} from "../src/auth/service.js";
import {
  MemoryOverlayCredentialResolver,
  StaticCredentialResolver
} from "../src/providers/credentials.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry(): LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-auth-http-skills-"
      )
    );
  roots.push(root);
  for (
    const name
    of ["prawo-polskie-v2", DR]
  ) {
    const dir =
      path.join(root, name);
    fs.mkdirSync(
      dir,
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(
        dir,
        "SKILL.md"
      ),
      `---\nname: ${name}\n---\n# test\n`
    );
  }
  fs.writeFileSync(
    path.join(
      root,
      "prawo-polskie-v2",
      "ROUTING-MAP.md"
    ),
    DR + "\n"
  );
  const result =
    new LexSkillRegistry(root);
  result.scan();
  return result;
}

function auth(): LocalAuthService {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-auth-http-data-"
      )
    );
  roots.push(root);
  return new LocalAuthService(
    new LocalAuthStore({
      rootDir: root
    }),
    {
      kdf: {
        memoryKiB: 1024,
        iterations: 1,
        parallelism: 1,
        keyLength: 32,
        version: 1
      }
    }
  );
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(
      roots.pop()!,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe("authenticated localhost HTTP API", () => {
  it("keeps only health/auth bootstrap public and protects private API", async () => {
    const authService = auth();
    const app =
      createLexHttpApp({
        registry: registry(),
        modelCatalog: {
          list: vi.fn(
            async () => []
          )
        },
        authService
      });

    await request(app)
      .get("/health")
      .expect(200);

    await request(app)
      .get("/api/routes")
      .expect(401, {
        error:
          "AUTHENTICATION_REQUIRED"
      });

    await request(app)
      .get("/api/auth/status")
      .expect(200, {
        initialized: false,
        requiresBootstrap: true,
        temporaryAdminCredentialsActive: false
      });

    const bootstrap =
      await request(app)
        .post(
          "/api/auth/bootstrap"
        )
        .send({
          loginName: "owner",
          displayName:
            "Wlasciciel",
          password:
            "Bardzo dlugie haslo wlasciciela 2026"
        })
        .expect(201);

    const token =
      String(
        bootstrap.body
          .sessionToken
      );
    expect(token).toMatch(
      /^[A-Za-z0-9_-]{40,}$/
    );

    const routes =
      await request(app)
        .get("/api/routes")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .expect(200);
    expect(
      routes.body.primarySkills
    ).toContain(DR);

    await request(app)
      .get("/api/auth/me")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .expect(200);

    await request(app)
      .post("/api/auth/logout")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .expect(204);

    await request(app)
      .get("/api/routes")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .expect(401);

    await request(app)
      .post("/api/auth/logout")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .expect(204);

    authService.close();
  });
});


describe("admin user lifecycle HTTP API", () => {
  it("creates, disables, reactivates and safely deletes an unrelated USER", async () => {
    const authService = auth();
    const app =
      createLexHttpApp({
        registry: registry(),
        modelCatalog: {
          list: vi.fn(
            async () => []
          )
        },
        authService
      });

    const bootstrap =
      await request(app)
        .post(
          "/api/auth/bootstrap"
        )
        .send({
          loginName: "owner-admin",
          displayName:
            "Owner Admin",
          password:
            "Owner admin bardzo dlugie haslo 2026"
        })
        .expect(201);
    const adminToken =
      String(
        bootstrap.body
          .sessionToken
      );

    const created =
      await request(app)
        .post(
          "/api/admin/users"
        )
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .send({
          loginName: "worker",
          displayName:
            "Worker",
          password:
            "Worker bardzo dlugie haslo 2026"
        })
        .expect(201);
    const userId =
      String(
        created.body.user
          .userId
      );

    const workerLogin =
      await request(app)
        .post(
          "/api/auth/login"
        )
        .send({
          loginName: "worker",
          password:
            "Worker bardzo dlugie haslo 2026"
        })
        .expect(200);
    const workerToken =
      String(
        workerLogin.body
          .sessionToken
      );

    await request(app)
      .patch(
        `/api/admin/users/${userId}/status`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        status: "DISABLED"
      })
      .expect(200);

    await request(app)
      .get("/api/auth/me")
      .set(
        "Authorization",
        `Bearer ${workerToken}`
      )
      .expect(401);

    await request(app)
      .post("/api/auth/login")
      .send({
        loginName: "worker",
        password:
          "Worker bardzo dlugie haslo 2026"
      })
      .expect(401);

    await request(app)
      .patch(
        `/api/admin/users/${userId}/status`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        status: "ACTIVE"
      })
      .expect(200);

    await request(app)
      .post("/api/auth/login")
      .send({
        loginName: "worker",
        password:
          "Worker bardzo dlugie haslo 2026"
      })
      .expect(200);

    await request(app)
      .delete(
        `/api/admin/users/${userId}`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .expect(409, {
        error:
          "USER_DELETE_REQUIRES_DISABLE"
      });

    await request(app)
      .patch(
        `/api/admin/users/${userId}/status`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        status: "DISABLED"
      })
      .expect(200);

    await request(app)
      .delete(
        `/api/admin/users/${userId}`
      )
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .expect(200);

    const users =
      await request(app)
        .get("/api/admin/users")
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .expect(200);
    expect(
      users.body.users.some(
        (item: { userId: string }) =>
          item.userId === userId
      )
    ).toBe(false);

    authService.close();
  });
});


describe("admin provider credential HTTP API", () => {
  it("stores an API key only in backend memory and never echoes the secret", async () => {
    const authService = auth();
    const credentials =
      new MemoryOverlayCredentialResolver(
        new StaticCredentialResolver({})
      );
    const app =
      createLexHttpApp({
        registry: registry(),
        modelCatalog: {
          list: vi.fn(
            async () => []
          )
        },
        authService,
        credentialResolver:
          credentials,
        credentialManager:
          credentials
      });

    const bootstrap =
      await request(app)
        .post(
          "/api/auth/bootstrap"
        )
        .send({
          loginName:
            "provider-admin",
          displayName:
            "Provider Admin",
          password:
            "Provider admin bardzo dlugie haslo 2026"
        })
        .expect(201);
    const adminToken =
      String(
        bootstrap.body
          .sessionToken
      );
    const secret =
      "sk-test-memory-only-provider-key-123456789";

    const saved =
      await request(app)
        .put(
          "/api/admin/providers/openai/credential"
        )
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .send({
          apiKey: secret
        })
        .expect(200);

    expect(
      JSON.stringify(
        saved.body
      )
    ).not.toContain(secret);
    expect(
      await credentials.getApiKey(
        "openai"
      )
    ).toBe(secret);

    const status =
      await request(app)
        .get(
          "/api/providers"
        )
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .expect(200);
    expect(
      status.body.providers
    ).toContainEqual({
      provider: "openai",
      configured: true
    });

    const createdUser =
      await request(app)
        .post(
          "/api/admin/users"
        )
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .send({
          loginName:
            "provider-user",
          displayName:
            "Provider User",
          password:
            "Provider user bardzo dlugie haslo 2026"
        })
        .expect(201);
    expect(
      createdUser.body.user
        .appRole
    ).toBe("USER");

    const userLogin =
      await request(app)
        .post(
          "/api/auth/login"
        )
        .send({
          loginName:
            "provider-user",
          password:
            "Provider user bardzo dlugie haslo 2026"
        })
        .expect(200);

    await request(app)
      .put(
        "/api/admin/providers/openai/credential"
      )
      .set(
        "Authorization",
        `Bearer ${String(
          userLogin.body
            .sessionToken
        )}`
      )
      .send({
        apiKey:
          "another-valid-memory-key-123456"
      })
      .expect(403);

    const cleared =
      await request(app)
        .delete(
          "/api/admin/providers/openai/credential"
        )
        .set(
          "Authorization",
          `Bearer ${adminToken}`
        )
        .expect(200);
    expect(
      cleared.body
    ).toEqual({
      provider: "openai",
      cleared: true,
      storage:
        "PROCESS_MEMORY"
    });
    expect(
      await credentials.getApiKey(
        "openai"
      )
    ).toBeNull();

    credentials.close();
    authService.close();
  });
});

describe("idle session activity", () => {
  function fakeAuth() {
    const touchSession = vi.fn();
    const service = {
      authenticateAuthorization: vi.fn(() => ({
        user: {
          userId: "u1",
          loginName: "owner",
          displayName: "Owner",
          role: "ADMIN",
          status: "ACTIVE"
        },
        session: {
          sessionId: "s1"
        }
      })),
      touchSession,
      getModelRoutingPreferences: vi.fn(() => ({
        auxiliaryEnabled: false,
        auxiliaryProvider: "openai",
        auxiliaryModel: ""
      })),
      status: vi.fn(() => ({
        initialized: true,
        requiresBootstrap: false,
        temporaryAdminCredentialsActive: false
      })),
      onSessionRevoked: vi.fn(() => () => undefined)
    };
    return { service, touchSession };
  }

  it("treats window activity reports as user activity", async () => {
    const { service, touchSession } = fakeAuth();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      authService: service as never
    });

    await request(app)
      .post("/api/auth/activity")
      .set("Authorization", "Bearer token")
      .expect(204);
    expect(touchSession).toHaveBeenCalledWith("s1");
  });

  it("keeps the session active while a long request is still running", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval"]
    });
    try {
      const { service, touchSession } = fakeAuth();
      let release!: () => void;
      let markStarted!: () => void;
      const started = new Promise<void>((resolve) => {
        markStarted = resolve;
      });
      const app = createLexHttpApp({
        registry: registry(),
        modelCatalog: { list: vi.fn(async () => []) },
        authService: service as never,
        sessionExecutor: {
          execute: vi.fn(
            () =>
              new Promise<never>((_resolve, reject) => {
                release = () => reject(new Error("done"));
                markStarted();
              })
          )
        }
      });

      const pending = request(app)
        .post("/api/sessions/execute")
        .set("Authorization", "Bearer token")
        .send({
          query: "Pytanie",
          provider: "openai",
          model: "gpt-test",
          primarySkill: DR,
          mode: "PRAWNIK"
        })
        .then((response) => response);
      const early = await Promise.race([
        started.then(() => null),
        pending
      ]);
      expect(early).toBeNull();

      const beforeWait = touchSession.mock.calls.length;
      vi.advanceTimersByTime(20 * 60_000);
      expect(touchSession.mock.calls.length - beforeWait).toBe(20);

      release();
      await pending;
      const afterFinish = touchSession.mock.calls.length;
      vi.advanceTimersByTime(5 * 60_000);
      expect(touchSession.mock.calls.length).toBe(afterFinish);
    } finally {
      vi.useRealTimers();
    }
  });
});

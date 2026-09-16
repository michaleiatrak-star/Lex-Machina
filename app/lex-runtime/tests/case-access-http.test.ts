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
  AuthSessionManager
} from "../src/auth/session-manager.js";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  LocalCaseAccessService
} from "../src/case-access.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g34cd-http-skills-"
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

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g34cd-http-data-"
      )
    );
  roots.push(root);
  const store =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      store,
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
      store,
      auth,
      files
    );
  const app =
    createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(
          async () => []
        )
      },
      authService: auth,
      caseFileStore: files,
      caseAccessService:
        cases
    });
  return {
    app,
    auth
  };
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

describe("G34C/G34D HTTP boundary", () => {
  it("lists only authorized cases and denies case writes after grant/revoke policy", async () => {
    const current =
      fixture();

    const bootstrap =
      await request(current.app)
        .post(
          "/api/auth/bootstrap"
        )
        .send({
          loginName: "owner",
          displayName: "Owner",
          password:
            "Owner http bezpieczne haslo 2026"
        })
        .expect(201);

    const ownerToken =
      String(
        bootstrap.body
          .sessionToken
      );

    const createdUser =
      await request(current.app)
        .post(
          "/api/admin/users"
        )
        .set(
          "Authorization",
          `Bearer ${ownerToken}`
        )
        .send({
          loginName: "analyst",
          displayName: "Analyst",
          password:
            "Analyst http bezpieczne haslo 2026"
        })
        .expect(201);

    const targetUserId =
      String(
        createdUser.body
          .user.userId
      );

    const createdCase =
      await request(current.app)
        .post("/api/cases")
        .set(
          "Authorization",
          `Bearer ${ownerToken}`
        )
        .send({
          displayName:
            "Sprawa HTTP"
        })
        .expect(201);

    const caseId =
      String(
        createdCase.body
          .caseId
      );
    expect(
      createdCase.body
    ).toMatchObject({
      role: "OWNER",
      canReidentify: true,
      keyVersion: 1
    });

    await request(current.app)
      .post(
        `/api/cases/${caseId}/access`
      )
      .set(
        "Authorization",
        `Bearer ${ownerToken}`
      )
      .send({
        userId:
          targetUserId,
        role: "ANALYST",
        canReidentify: false
      })
      .expect(201);

    const targetLogin =
      await request(current.app)
        .post("/api/auth/login")
        .send({
          loginName: "analyst",
          password:
            "Analyst http bezpieczne haslo 2026"
        })
        .expect(200);
    const targetToken =
      String(
        targetLogin.body
          .sessionToken
      );

    const visible =
      await request(current.app)
        .get("/api/cases")
        .set(
          "Authorization",
          `Bearer ${targetToken}`
        )
        .expect(200);

    expect(
      visible.body.cases
    ).toEqual([
      expect.objectContaining({
        caseId,
        role: "ANALYST",
        canReidentify: false
      })
    ]);

    await request(current.app)
      .post(
        `/api/cases/${caseId}/files`
      )
      .set(
        "Authorization",
        `Bearer ${targetToken}`
      )
      .set(
        "Content-Type",
        "application/pdf"
      )
      .set(
        "X-Lex-Filename",
        encodeURIComponent(
          "blocked.pdf"
        )
      )
      .send(
        Buffer.from(
          "%PDF-blocked"
        )
      )
      .expect(403, {
        error:
          "CASE_ACCESS_DENIED"
      });

    const revoke =
      await request(current.app)
        .delete(
          `/api/cases/${caseId}/access/${targetUserId}`
        )
        .set(
          "Authorization",
          `Bearer ${ownerToken}`
        )
        .expect(200);

    expect(
      revoke.body.keyVersion
    ).toBe(2);

    await request(current.app)
      .get(
        `/api/cases/${caseId}`
      )
      .set(
        "Authorization",
        `Bearer ${targetToken}`
      )
      .expect(403, {
        error:
          "CASE_ACCESS_DENIED"
      });

    current.auth.close();
  });
});

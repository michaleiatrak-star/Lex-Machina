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
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  LocalSharedTemplateStore,
  DOCX_MEDIA_TYPE
} from "../src/shared-template-store.js";
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
  LocalCaseAccessService
} from "../src/case-access.js";
import {
  createLexHttpApp
} from "../src/http/app.js";
import {
  LexSkillRegistry
} from "../src/registry.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function tempRoot(
  prefix: string
): string {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        prefix
      )
    );
  roots.push(root);
  return root;
}

function registry():
  LexSkillRegistry {
  const root =
    tempRoot(
      "lex-g35-skills-"
    );
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
    tempRoot(
      "lex-g35-data-"
    );
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
  const templates =
    new LocalSharedTemplateStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      authStore,
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
      sharedTemplateStore:
        templates,
      caseAccessService:
        cases
    });
  return {
    root,
    auth,
    files,
    templates,
    cases,
    app
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

describe("G35 case workspace and shared templates", () => {
  it("keeps case file inventories isolated and stores one shared template once", async () => {
    const current =
      fixture();
    const owner =
      await current.auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password:
          "G35 owner bezpieczne haslo 2026"
      });
    const context = {
      user: owner.user,
      session: owner.session
    };

    const caseA =
      await current.cases
        .createCase(
          context,
          "Sprawa A"
        );
    const caseB =
      await current.cases
        .createCase(
          context,
          "Sprawa B"
        );

    await current.files.saveUpload({
      caseId: caseA.caseId,
      filename: "pozew.pdf",
      mediaType:
        "application/pdf",
      data:
        Buffer.from(
          "%PDF-case-a"
        ),
      extractArchive: false
    });
    await current.files.saveUpload({
      caseId: caseB.caseId,
      filename: "odpowiedz.pdf",
      mediaType:
        "application/pdf",
      data:
        Buffer.from(
          "%PDF-case-b"
        ),
      extractArchive: false
    });

    const listA =
      await current.files
        .listUploads(
          caseA.caseId
        );
    const listB =
      await current.files
        .listUploads(
          caseB.caseId
        );

    expect(
      listA.map(
        (item) => item.filename
      )
    ).toEqual(["pozew.pdf"]);
    expect(
      listB.map(
        (item) => item.filename
      )
    ).toEqual([
      "odpowiedz.pdf"
    ]);

    const template =
      await current.templates
        .saveTemplate({
          filename:
            "pozew-wzor.docx",
          mediaType:
            DOCX_MEDIA_TYPE,
          data:
            Buffer.from(
              "PK\u0003\u0004-template"
            ),
          createdByUserId:
            owner.user.userId
        });

    expect(
      await current.templates
        .listTemplates()
    ).toEqual([
      expect.objectContaining({
        templateId:
          template.templateId,
        scope: "FIRM_SHARED",
        filename:
          "pozew-wzor.docx",
        generationReady: false
      })
    ]);

    const dirs =
      fs.readdirSync(
        path.join(
          current.root,
          "shared",
          "templates"
        )
      );
    expect(dirs).toEqual([
      template.templateId
    ]);

    current.auth.close();
  });

  it("exposes the same shared template from two authorized cases while preserving case ACL", async () => {
    const current =
      fixture();
    const bootstrap =
      await request(current.app)
        .post(
          "/api/auth/bootstrap"
        )
        .send({
          loginName: "admin",
          displayName: "Admin",
          password:
            "G35 admin bezpieczne haslo 2026"
        })
        .expect(201);
    const token =
      String(
        bootstrap.body
          .sessionToken
      );

    const makeCase =
      async (name: string) =>
        await request(current.app)
          .post("/api/cases")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            displayName: name
          })
          .expect(201);

    const caseA =
      await makeCase(
        "Sprawa A"
      );
    const caseB =
      await makeCase(
        "Sprawa B"
      );

    const uploaded =
      await request(current.app)
        .post(
          "/api/shared/templates"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .set(
          "Content-Type",
          DOCX_MEDIA_TYPE
        )
        .set(
          "X-Lex-Filename",
          encodeURIComponent(
            "umowa.docx"
          )
        )
        .send(
          Buffer.from(
            "PK\u0003\u0004-docx"
          )
        )
        .expect(201);

    for (
      const caseId
      of [
        caseA.body.caseId,
        caseB.body.caseId
      ]
    ) {
      const response =
        await request(
          current.app
        )
          .get(
            `/api/cases/${caseId}/templates`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .expect(200);
      expect(
        response.body.templates
      ).toEqual([
        expect.objectContaining({
          templateId:
            uploaded.body
              .templateId,
          filename:
            "umowa.docx"
        })
      ]);
    }

    current.auth.close();
  });
});

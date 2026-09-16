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
  createLexHttpApp
} from "../src/http/app.js";
import {
  LexSkillRegistry
} from "../src/registry.js";

const roots: string[] = [];
const PASSWORD =
  "P4B owner bardzo bezpieczne haslo 2026";
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function skillRegistry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-p4b-skills-"
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
  const registry =
    new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-p4b-data-"
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
      registry:
        skillRegistry(),
      modelCatalog: {
        list: vi.fn(
          async () => []
        )
      },
      authService: auth,
      caseFileStore: files,
      caseAccessService: cases
    });
  return {
    root,
    store,
    auth,
    files,
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

describe(
  "P4B case lifecycle",
  () => {
    it(
      "persists rename/archive and keeps archived cases read-only",
      async () => {
        const current =
          fixture();
        const owner =
          await current.auth
            .bootstrap({
              loginName:
                "owner",
              displayName:
                "Owner",
              password:
                PASSWORD
            });
        const actor = {
          user: owner.user,
          session:
            owner.session
        };
        const localCase =
          await current.cases
            .createCase(
              actor,
              "Pierwotna"
            );

        const renamed =
          await current.cases
            .renameCase(
              actor,
              localCase.caseId,
              "  Nowa nazwa  "
            );
        expect(
          renamed.displayName
        ).toBe("Nowa nazwa");

        const archived =
          await current.cases
            .setCaseArchived(
              actor,
              localCase.caseId,
              true
            );
        expect(
          archived.archivedAt
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}T/
        );
        expect(() =>
          current.cases
            .assertAccess(
              actor,
              localCase.caseId,
              "WRITE"
            )
        ).toThrow(
          "CASE_ARCHIVED"
        );
        expect(() =>
          current.cases
            .assertAccess(
              actor,
              localCase.caseId,
              "READ"
            )
        ).not.toThrow();

        const metadata =
          await current.files
            .readCaseMetadata(
              localCase.caseId
            );
        expect(
          metadata.displayName
        ).toBe("Nowa nazwa");
        expect(
          metadata.archivedAt
        ).toBe(
          archived.archivedAt
        );

        current.auth.close();

        const reopenedStore =
          new LocalAuthStore({
            rootDir:
              current.root
          });
        expect(
          reopenedStore
            .getCase(
              localCase.caseId
            )
        ).toMatchObject({
          displayName:
            "Nowa nazwa",
          archivedAt:
            archived.archivedAt
        });
        reopenedStore.close();
      }
    );

    it(
      "requires fresh password before permanent case deletion",
      async () => {
        const current =
          fixture();
        const bootstrap =
          await request(
            current.app
          )
            .post(
              "/api/auth/bootstrap"
            )
            .send({
              loginName:
                "delete-owner",
              displayName:
                "Delete Owner",
              password:
                PASSWORD
            })
            .expect(201);
        const token =
          String(
            bootstrap.body
              .sessionToken
          );

        const created =
          await request(
            current.app
          )
            .post("/api/cases")
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send({
              displayName:
                "Do usunięcia"
            })
            .expect(201);
        const caseId =
          String(
            created.body.caseId
          );

        await request(
          current.app
        )
          .patch(
            `/api/cases/${caseId}`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            displayName:
              "Po zmianie"
          })
          .expect(200);

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/archive`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .expect(200);

        await request(
          current.app
        )
          .post(
            `/api/cases/${caseId}/unarchive`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .expect(200);

        await request(
          current.app
        )
          .delete(
            `/api/cases/${caseId}`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            password:
              "niepoprawne haslo"
          })
          .expect(401);

        expect(
          fs.existsSync(
            path.join(
              current.root,
              "cases",
              caseId
            )
          )
        ).toBe(true);
        expect(
          current.store
            .getCase(caseId)
        ).not.toBeNull();

        await request(
          current.app
        )
          .delete(
            `/api/cases/${caseId}`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            password:
              PASSWORD
          })
          .expect(200);

        expect(
          fs.existsSync(
            path.join(
              current.root,
              "cases",
              caseId
            )
          )
        ).toBe(false);
        expect(
          current.store
            .getCase(caseId)
        ).toBeNull();
        expect(
          current.store
            .listCaseAccess(
              caseId
            )
        ).toEqual([]);

        current.auth.close();
      }
    );
  }
);

import express from "express";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import {
  afterEach,
  describe,
  expect,
  it
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
  SecureCaseUploadStore
} from "../src/case-secure-store.js";
import {
  LegacyCaseStorageMigrator
} from "../src/legacy-case-migration.js";
import {
  registerLegacyMigrationRoutes
} from "../src/http/legacy-migration-routes.js";

const roots: string[] = [];

function fixture() {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g34h5-http-"
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
  const secure =
    new SecureCaseUploadStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      authStore,
      auth,
      files
    );
  const migrator =
    new LegacyCaseStorageMigrator(
      secure,
      { rootDir: root }
    );
  const app = express();
  registerLegacyMigrationRoutes(
    app,
    {
      authService: auth,
      securityEvents: authStore,
      caseAccessService: cases,
      migrator
    }
  );
  app.use((_req, res) => {
    res.status(404).json({
      error: "CORE_NOT_FOUND"
    });
  });
  return {
    root,
    app,
    auth,
    files,
    secure,
    cases
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

describe("G34H5 migration HTTP boundary", () => {
  it("reaches the migration route before catch-all and requires MANAGE", async () => {
    const current = fixture();
    const owner =
      await current.auth.bootstrap({
        loginName: "owner",
        displayName: "Owner",
        password:
          "G34H5 owner bezpieczne haslo 2026"
      });
    const ownerContext = {
      user: owner.user,
      session: owner.session
    };
    const localCase =
      await current.cases
        .createCase(
          ownerContext,
          "Legacy migration HTTP"
        );
    const legacyUpload =
      await current.files.saveUpload({
        caseId: localCase.caseId,
        filename: "legacy.pdf",
        mediaType:
          "application/pdf",
        data: Buffer.from(
          "%PDF-http-legacy"
        ),
        extractArchive: false
      });

    const response =
      await request(current.app)
        .post(
          `/api/cases/${localCase.caseId}/migrate-legacy-storage`
        )
        .set(
          "Authorization",
          `Bearer ${owner.sessionToken}`
        )
        .expect(200);

    expect(
      response.body.report
        .remainingLegacyPlaintext
    ).toBe(false);
    expect(
      response.body.report
        .migratedUploads
    ).toContain(
      legacyUpload.uploadId
    );

    await request(current.app)
      .post(
        `/api/cases/${localCase.caseId}/migrate-legacy-storage`
      )
      .expect(401);

    current.auth.close();
  });
});

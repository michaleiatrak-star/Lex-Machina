import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import type { DocumentService } from "../src/document-service.js";
import type { LocalCaseFileStore } from "../src/case-file-store.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";
const CASE_ID =
  "case_0123456789abcdef0123456789abcdef";

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-case-http-")
  );
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

function caseStore(): Pick<
  LocalCaseFileStore,
  "createCase" | "saveUpload" | "assertCase"
> {
  return {
    createCase: vi.fn(async () => ({
      caseId: CASE_ID,
      createdAt: "2026-09-16T12:00:00.000Z"
    })),
    assertCase: vi.fn(async () => undefined),
    saveUpload: vi.fn(async (input) => ({
      caseId: input.caseId,
      uploadId:
        "upload_0123456789abcdef0123456789abcdef",
      filename: input.filename,
      mediaType: input.mediaType,
      sha256: "a".repeat(64),
      bytes: input.data.byteLength,
      storedAt: "2026-09-16T12:00:00.000Z",
      archive:
        input.mediaType === "application/zip",
      extracted:
        input.mediaType === "application/zip"
          ? [{
              relativePath: "akta/a.txt",
              compressedBytes: 3,
              uncompressedBytes: 4,
              sha256: "b".repeat(64),
              mediaType: "text/plain",
              processable: true
            }]
          : []
    }))
  };
}

function documentService(): DocumentService {
  return {
    ingestPdf: vi.fn(),
    ingestImage: vi.fn(),
    review: vi.fn(async () => ({
      documentId:
        "doc_0123456789abcdef01234567",
      mediaType: "image/png" as const,
      complete: true as const,
      totalPages: 1,
      pages: [{
        page: 1,
        text: "tekst",
        source: "OCR" as const
      }],
      suggestions: []
    })),
    finalizeReview: vi.fn(),
    resolveProtectedChunks: vi.fn()
  };
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, {
      recursive: true,
      force: true
    });
  }
});

describe("case storage HTTP API", () => {
  it("creates a local case", async () => {
    const store = caseStore();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      caseFileStore: store
    });

    const response = await request(app)
      .post("/api/cases")
      .send({})
      .expect(201);

    expect(response.body.caseId)
      .toBe(CASE_ID);
    expect(store.createCase)
      .toHaveBeenCalledTimes(1);
  });

  it("stores and expands ZIP uploads in the selected case", async () => {
    const store = caseStore();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      caseFileStore: store
    });

    const response = await request(app)
      .post(`/api/cases/${CASE_ID}/files`)
      .set("Content-Type", "application/zip")
      .set(
        "X-Lex-Filename",
        encodeURIComponent("akta.zip")
      )
      .send(Buffer.from([80, 75, 3, 4]))
      .expect(201);

    expect(response.body).toMatchObject({
      caseId: CASE_ID,
      filename: "akta.zip",
      archive: true
    });
    expect(response.body.extracted)
      .toHaveLength(1);
    expect(store.saveUpload)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          caseId: CASE_ID,
          filename: "akta.zip",
          mediaType: "application/zip",
          extractArchive: true
        })
      );
  });

  it("persists a document upload before privacy review", async () => {
    const store = caseStore();
    const documents = documentService();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      caseFileStore: store,
      documentService: documents
    });

    const response = await request(app)
      .post("/api/documents/review")
      .set("Content-Type", "image/png")
      .set("X-Lex-Case-Id", CASE_ID)
      .set(
        "X-Lex-Filename",
        encodeURIComponent("skan.png")
      )
      .send(Buffer.from([137, 80, 78, 71]))
      .expect(201);

    expect(store.saveUpload)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          caseId: CASE_ID,
          filename: "skan.png",
          mediaType: "image/png",
          extractArchive: false
        })
      );
    expect(documents.review)
      .toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
      caseId: CASE_ID,
      uploadId:
        "upload_0123456789abcdef0123456789abcdef"
    });
  });

  it("requires a case id in production-style document storage mode", async () => {
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      caseFileStore: caseStore(),
      documentService: documentService()
    });

    await request(app)
      .post("/api/documents/review")
      .set("Content-Type", "image/png")
      .send(Buffer.from([137, 80, 78, 71]))
      .expect(400, {
        error: "CASE_ID_REQUIRED"
      });
  });
});

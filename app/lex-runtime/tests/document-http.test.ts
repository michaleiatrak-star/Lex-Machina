import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import type { DocumentService } from "../src/document-service.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-document-http-")
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

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, {
      recursive: true,
      force: true
    });
  }
});

describe("private document HTTP API", () => {
  it("accepts a PDF body and returns only the document service's protected result", async () => {
    const documentService: DocumentService = {
      ingestPdf: vi.fn(async () => ({
        documentId: "doc_test",
        complete: true as const,
        totalPages: 2,
        digitalPages: 1,
        ocrPages: 1,
        blankPages: 0,
        sourceChars: 120,
        pseudonymizedChars: 128,
        chunks: [
          {
            index: 1,
            pageStart: 1,
            pageEnd: 2,
            text: "[STRONA 1 · DIGITAL]\n[PII:PERSON:0001]"
          }
        ],
        privacy: {
          findings: 1,
          counts: {
            PERSON: 1
          },
          reversibleLocally: true as const
        }
      }))
    };

    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      documentService
    });

    const response = await request(app)
      .post("/api/documents/ingest")
      .set("Content-Type", "application/pdf")
      .send(Buffer.from("%PDF-1.7 fixture"))
      .expect(201);

    expect(response.body).toMatchObject({
      documentId: "doc_test",
      complete: true,
      totalPages: 2,
      ocrPages: 1
    });
    expect(
      JSON.stringify(response.body)
    ).not.toContain("Jan Kowalski");
    expect(documentService.ingestPdf)
      .toHaveBeenCalledTimes(1);
  });

  it("fails closed when document ingestion is unavailable", async () => {
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      }
    });

    await request(app)
      .post("/api/documents/ingest")
      .set("Content-Type", "application/pdf")
      .send(Buffer.from("%PDF-1.7 fixture"))
      .expect(503, {
        error: "DOCUMENT_INGESTION_UNAVAILABLE"
      });
  });
});

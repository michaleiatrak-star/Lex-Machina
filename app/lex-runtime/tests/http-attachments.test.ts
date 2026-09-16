import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import type { SessionExecutor } from "../src/session-executor.js";
import type { DocumentService } from "../src/document-service.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-http-attachments-")
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

describe("G32 HTTP document attachments", () => {
  it("resolves documentId + chunk indices server-side before execution", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn(async (input) => ({
        sessionId: "session-attachment",
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
          eventCount: 13,
          closed: true
        }
      }))
    };

    const documentService: DocumentService = {
      resolveProtectedChunks: vi.fn(
        async (selection) => ({
          documentId: selection.documentId,
          chunks: [{
            index: 2,
            pageStart: 3,
            pageEnd: 4,
            text: "[STRONA 3 · OCR]\nchroniony fragment"
          }],
          totalChars: 38
        })
      ),
      ingestPdf: vi.fn(),
      ingestImage: vi.fn(),
      review: vi.fn(),
      finalizeReview: vi.fn()
    };

    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      sessionExecutor: executor,
      documentService
    });

    await request(app)
      .post("/api/sessions/execute")
      .send({
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR,
        mode: "PRAWNIK",
        attachments: [{
          documentId:
            "doc_0123456789abcdef01234567",
          chunkIndices: [2]
        }]
      })
      .expect(200);

    expect(
      documentService.resolveProtectedChunks
    ).toHaveBeenCalledWith({
      documentId:
        "doc_0123456789abcdef01234567",
      chunkIndices: [2]
    });
    expect(executor.execute)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          documentAttachments: [{
            documentId:
              "doc_0123456789abcdef01234567",
            sourceScope:
              "MANUAL",
            chunks: [{
              index: 2,
              pageStart: 3,
              pageEnd: 4,
              text:
                "[STRONA 3 · OCR]\nchroniony fragment"
            }]
          }]
        })
      );
  });

  it("rejects malformed chunk references", async () => {
    const executor: SessionExecutor = {
      execute: vi.fn()
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
        query: "Pytanie",
        provider: "openai",
        model: "gpt-test",
        primarySkill: DR,
        attachments: [{
          documentId: "invalid",
          chunkIndices: [0]
        }]
      })
      .expect(400, {
        error: "INVALID_SESSION_REQUEST"
      });

    expect(executor.execute)
      .not.toHaveBeenCalled();
  });
});

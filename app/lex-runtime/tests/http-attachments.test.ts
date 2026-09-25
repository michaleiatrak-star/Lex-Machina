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
            selectedByUser: true,
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

  it("re-fetches cited chunks before presenting the answer", async () => {
    const documentId =
      "doc_0123456789abcdef01234567";
    const chunk = {
      index: 2,
      pageStart: 3,
      pageEnd: 4,
      text:
        "[STRONA 3 · OCR]\nchroniony fragment"
    };
    const executor: SessionExecutor = {
      execute: vi.fn(async (input) => ({
        sessionId:
          "session-citation-refresh",
        status:
          "DRAFT_PRESENTABLE" as const,
        provider: input.provider,
        model: input.model,
        primarySkill:
          input.primarySkill,
        answer:
          "Treść [[LEXDOCREF:docref_1]]",
        documentCitations: [{
          citationId: "docref_1",
          marker:
            "[[LEXDOCREF:docref_1]]",
          label: "Dokument 1, s. 3–4",
          documentId,
          chunkIndex: 2,
          pageStart: 3,
          pageEnd: 4,
          contextText: chunk.text
        }],
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
      resolveProtectedChunks:
        vi.fn(async (selection) => ({
          documentId:
            selection.documentId,
          chunks: [{ ...chunk }],
          totalChars:
            chunk.text.length
        })),
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

    const response =
      await request(app)
        .post("/api/sessions/execute")
        .send({
          query: "Pytanie",
          provider: "openai",
          model: "gpt-test",
          primarySkill: DR,
          mode: "PRAWNIK",
          attachments: [{
            documentId,
            chunkIndices: [2]
          }]
        })
        .expect(200);

    expect(
      documentService
        .resolveProtectedChunks
    ).toHaveBeenCalledTimes(2);
    expect(
      response.body
        .documentCitationFreshness
    ).toEqual({
      result: "PASS",
      checked: 1
    });
  });

  it("blocks a citation when the protected source changed before presentation", async () => {
    const documentId =
      "doc_0123456789abcdef01234567";
    const original = {
      index: 2,
      pageStart: 3,
      pageEnd: 4,
      text: "oryginalny fragment"
    };
    const changed = {
      ...original,
      text: "zmieniony fragment"
    };
    const executor: SessionExecutor = {
      execute: vi.fn(async (input) => ({
        sessionId:
          "session-citation-stale",
        status:
          "DRAFT_PRESENTABLE" as const,
        provider: input.provider,
        model: input.model,
        primarySkill:
          input.primarySkill,
        answer: "Treść",
        documentCitations: [{
          citationId: "docref_1",
          marker:
            "[[LEXDOCREF:docref_1]]",
          label: "Dokument 1, s. 3–4",
          documentId,
          chunkIndex: 2,
          pageStart: 3,
          pageEnd: 4,
          contextText: original.text
        }],
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
    const resolveProtectedChunks =
      vi.fn()
        .mockResolvedValueOnce({
          documentId,
          chunks: [{ ...original }],
          totalChars:
            original.text.length
        })
        .mockResolvedValueOnce({
          documentId,
          chunks: [{ ...changed }],
          totalChars:
            changed.text.length
        });
    const documentService:
      DocumentService = {
        resolveProtectedChunks,
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
          documentId,
          chunkIndices: [2]
        }]
      })
      .expect(409, {
        error:
          "DOCUMENT_CITATION_SOURCE_CHANGED"
      });

    expect(
      resolveProtectedChunks
    ).toHaveBeenCalledTimes(2);
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

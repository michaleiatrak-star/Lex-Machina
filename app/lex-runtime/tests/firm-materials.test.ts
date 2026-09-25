import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import type { SessionDocumentAttachment, SessionExecutor } from "../src/session-executor.js";
import { buildDocumentContextForTest } from "../src/session-executor.js";
import type { DocumentService } from "../src/document-service.js";
import {
  ContextBudgetError,
  estimateDocumentFit,
  orchestrateDocumentContext
} from "../src/context-orchestrator.js";
import { templateChunks, templateText } from "../src/firm-template-text.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function registry(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-firm-materials-"));
  roots.push(root);
  for (const name of ["prawo-polskie-v2", DR]) {
    fs.mkdirSync(path.join(root, name), { recursive: true });
    fs.writeFileSync(path.join(root, name, "SKILL.md"), `---\nname: ${name}\n---\n# test\n`);
  }
  fs.writeFileSync(path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"), DR + "\n");
  const result = new LexSkillRegistry(root);
  result.scan();
  return result;
}

afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, { recursive: true, force: true });
});

function doc(id: string, scope: SessionDocumentAttachment["sourceScope"], chars: number, selected = false): SessionDocumentAttachment {
  return {
    documentId: id,
    ...(scope ? { sourceScope: scope } : {}),
    ...(selected ? { selectedByUser: true } : {}),
    chunks: [
      { index: 1, pageStart: 1, pageEnd: 1, text: "Umowa najmu. ".repeat(Math.ceil(chars / 26)).slice(0, chars / 2) },
      { index: 2, pageStart: 2, pageEnd: 2, text: "Kaucja zwrotna. ".repeat(Math.ceil(chars / 32)).slice(0, chars / 2) }
    ]
  };
}

describe("firm templates as model text", () => {
  it("keeps headings, lists and tables visible", () => {
    const text = templateText({
      kind: "document",
      blocks: [
        { type: "heading", level: 1, runs: [{ text: "POZEW", b: true, i: false, u: false }] },
        { type: "paragraph", runs: [{ text: "Wnoszę o:", b: false, i: false, u: false }] },
        { type: "list", ordered: true, items: [[{ text: "zasądzenie", b: false, i: false, u: false }]] },
        { type: "table", rows: [["Kwota", "Data"]] }
      ]
    });
    expect(text).toBe("# POZEW\n\nWnoszę o:\n\n1. zasądzenie\n\n| Kwota | Data |");
  });

  it("splits long templates on paragraph boundaries, numbered from 1", () => {
    const chunks = templateChunks(Array.from({ length: 30 }, (_, index) => `Akapit ${index} ${"x".repeat(400)}`).join("\n\n"));
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]!.index).toBe(1);
    expect(chunks.every((chunk) => chunk.text.length <= 6_000)).toBe(true);
  });
});

describe("what reaches the model", () => {
  it("sends a picked firm document whole and reports each document", () => {
    const result = orchestrateDocumentContext({
      attachments: [
        doc("doc_case", "MANUAL", 2_000, true),
        doc("doc_firm", "FIRM_KNOWLEDGE", 2_000, true),
        doc("doc_hit", "CASE_KNOWLEDGE", 2_000)
      ],
      query: "Najem",
      modelContextTokens: 128_000
    });
    expect(result.report.documents).toEqual([
      expect.objectContaining({ documentId: "doc_case", status: "FULL", chunks: 2, fullChunks: 2 }),
      expect.objectContaining({ documentId: "doc_firm", status: "FULL", sourceScope: "FIRM_KNOWLEDGE" }),
      expect.objectContaining({ documentId: "doc_hit", status: "FULL" })
    ]);
  });

  it("reports retrieved passages cut to fit and keeps picked ones whole", () => {
    const result = orchestrateDocumentContext({
      attachments: [doc("doc_case", "MANUAL", 40_000, true), doc("doc_hit", "CASE_KNOWLEDGE", 60_000)],
      query: "Kaucja",
      modelContextTokens: 32_768
    });
    const [picked, hit] = result.report.documents!;
    expect(picked!.status).toBe("FULL");
    expect(["PARTIAL", "DIGEST", "OMITTED"]).toContain(hit!.status);
  });

  it("refuses picked documents that do not fit, with the numbers", () => {
    let failure: unknown;
    try {
      orchestrateDocumentContext({
        attachments: [doc("doc_a", "MANUAL", 200_000, true)],
        query: "x",
        modelContextTokens: 32_768
      });
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(ContextBudgetError);
    expect((failure as ContextBudgetError).details.neededTokens).toBeGreaterThan(
      (failure as ContextBudgetError).details.budgetTokens
    );
  });

  it("estimates the fit before sending with the same token count", () => {
    const small = estimateDocumentFit({ attachments: [doc("doc_a", "MANUAL", 3_000, true)], modelContextTokens: 200_000 });
    expect(small.fits).toBe(true);
    expect(small.documents[0]!.tokens).toBeGreaterThan(900);
    const big = estimateDocumentFit({ attachments: [doc("doc_a", "MANUAL", 900_000, true)], modelContextTokens: 128_000 });
    expect(big.fits).toBe(false);
  });

  it("tells the model what firm material is and names the template", () => {
    const context = buildDocumentContextForTest([
      {
        documentId: "template_0123",
        title: "Wzór pozwu.docx",
        sourceScope: "FIRM_TEMPLATE",
        chunks: [{ index: 1, pageStart: 1, pageEnd: 1, text: "# POZEW" }]
      }
    ]);
    expect(context).toContain("# MATERIAŁY KANCELARII");
    expect(context).toContain("[template_0123 · PLIK: Wzór pozwu.docx]");
    expect(context).toContain("[WZÓR KANCELARII template_0123 · CHUNK 1");
  });
});

describe("document limits per model", () => {
  const executor = (): SessionExecutor => ({
    execute: vi.fn(async (input) => ({
      sessionId: "s",
      status: "DRAFT_PRESENTABLE" as const,
      provider: input.provider,
      model: input.model,
      primarySkill: input.primarySkill,
      answer: "ok",
      finalization: "PASS" as const,
      blockedReferences: [],
      verification: { records: 0, verified: 0, supported: 0, unverified: 0 },
      evidence: [],
      audit: { result: "PASS" as const, eventCount: 1, closed: true }
    }))
  });
  const documentService = (): DocumentService => ({
    resolveProtectedChunks: vi.fn(async (selection) => ({
      documentId: selection.documentId,
      chunks: [{ index: 1, pageStart: 1, pageEnd: 1, text: "fragment" }],
      totalChars: 8
    })),
    ingestPdf: vi.fn(),
    ingestImage: vi.fn(),
    review: vi.fn(),
    finalizeReview: vi.fn()
  });
  const picks = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
      documentId: `doc_${index.toString(16).padStart(24, "0")}`,
      chunkIndices: [1]
    }));
  const body = (model: string, count: number) => ({
    query: "Pytanie",
    provider: "openai",
    model,
    primarySkill: DR,
    mode: "PRAWNIK",
    attachments: picks(count)
  });

  it("takes 20 documents for a hosted model and 4 for a local one", async () => {
    const run = executor();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => []),
        localContextWindow: (model: string) => (model.startsWith("local/") ? 32_768 : undefined)
      },
      sessionExecutor: run,
      documentService: documentService()
    });
    await request(app).post("/api/sessions/execute").send(body("gpt-test", 20)).expect(200);
    expect(run.execute).toHaveBeenCalledWith(
      expect.objectContaining({ modelContextTokens: 128_000 })
    );
    await request(app).post("/api/sessions/execute").send(body("gpt-test", 21)).expect(400);
    const local = await request(app).post("/api/sessions/execute").send(body("local/qwen", 5)).expect(422);
    expect(local.body).toEqual({ error: "TOO_MANY_DOCUMENT_ATTACHMENTS", limit: 4 });
  });

  it("estimates the fit of picked files for the chosen model", async () => {
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: { list: vi.fn(async () => []) },
      sessionExecutor: executor(),
      documentService: documentService()
    });
    const response = await request(app)
      .post("/api/sessions/document-fit")
      .send({ provider: "anthropic", model: "claude-test", attachments: picks(2) })
      .expect(200);
    expect(response.body).toMatchObject({
      limit: 20,
      local: false,
      count: 2,
      estimate: { modelContextTokens: 200_000, fits: true }
    });
    expect(response.body.estimate.documents).toHaveLength(2);
  });
});

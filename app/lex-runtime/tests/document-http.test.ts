import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import type {
  DocumentService,
  PublicDocumentIngestion,
  PublicDocumentReview
} from "../src/document-service.js";

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

function protectedResult(
  mediaType: "application/pdf" | "image/jpeg"
): PublicDocumentIngestion {
  return {
    documentId: "doc_0123456789abcdef01234567",
    mediaType,
    complete: true,
    totalPages: mediaType === "application/pdf" ? 2 : 1,
    digitalPages: mediaType === "application/pdf" ? 1 : 0,
    ocrPages: 1,
    blankPages: 0,
    sourceChars: 120,
    pseudonymizedChars: 128,
    chunks: [
      {
        index: 1,
        pageStart: 1,
        pageEnd:
          mediaType === "application/pdf" ? 2 : 1,
        text:
          "[STRONA 1 · OCR]\n[PII:PERSON:0001]"
      }
    ],
    privacy: {
      findings: 1,
      counts: {
        PERSON: 1
      },
      manualPseudonymizations: 0,
      keptRanges: 0,
      annotations: [],
      reversibleLocally: true
    }
  };
}

function reviewResult(): PublicDocumentReview {
  return {
    documentId: "doc_0123456789abcdef01234567",
    mediaType: "image/jpeg",
    complete: true,
    totalPages: 1,
    pages: [
      {
        page: 1,
        text:
          "Jan Kowalski jest świadkiem. PESEL 44051401458.",
        source: "OCR",
        confidence: 0.98,
        engine: "PP-OCRv6-test-double"
      }
    ],
    suggestions: [
      {
        page: 1,
        start: 0,
        end: 12,
        kind: "PERSON"
      }
    ]
  };
}

function service(): DocumentService {
  return {
    ingestPdf: vi.fn(
      async () => protectedResult(
        "application/pdf"
      )
    ),
    ingestImage: vi.fn(
      async () => protectedResult(
        "image/jpeg"
      )
    ),
    review: vi.fn(
      async () => reviewResult()
    ),
    finalizeReview: vi.fn(
      async () => ({
        ...protectedResult("image/jpeg"),
        privacy: {
          ...protectedResult("image/jpeg").privacy,
          manualPseudonymizations: 1,
          annotations: [
            {
              page: 1,
              start: 14,
              end: 26,
              label: "świadek"
            }
          ]
        }
      })
    )
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

describe("private document HTTP API", () => {
  it("accepts PDF and image bodies", async () => {
    const documentService = service();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      documentService
    });

    await request(app)
      .post("/api/documents/ingest")
      .set("Content-Type", "application/pdf")
      .send(Buffer.from("%PDF-1.7 fixture"))
      .expect(201);

    const image = await request(app)
      .post("/api/documents/ingest")
      .set("Content-Type", "image/jpeg")
      .send(Buffer.from([0xff, 0xd8, 0xff]))
      .expect(201);

    expect(image.body).toMatchObject({
      mediaType: "image/jpeg",
      totalPages: 1,
      ocrPages: 1
    });
    expect(documentService.ingestPdf)
      .toHaveBeenCalledTimes(1);
    expect(documentService.ingestImage)
      .toHaveBeenCalledTimes(1);
  });

  it("supports local review and user privacy directives before finalization", async () => {
    const documentService = service();
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      documentService
    });

    const review = await request(app)
      .post("/api/documents/review")
      .set("Content-Type", "image/jpeg")
      .send(Buffer.from([0xff, 0xd8, 0xff]))
      .expect(201);

    expect(review.body.pages[0].text)
      .toContain("Jan Kowalski");
    expect(review.body.suggestions)
      .toHaveLength(1);

    const response = await request(app)
      .post(
        "/api/documents/doc_0123456789abcdef01234567/finalize"
      )
      .send({
        directives: [
          {
            page: 1,
            start: 0,
            end: 12,
            action: "PSEUDONYMIZE",
            kind: "PERSON",
            label: "świadek"
          },
          {
            page: 1,
            start: 14,
            end: 26,
            action: "LABEL",
            label: "rola procesowa"
          }
        ]
      })
      .expect(200);

    expect(response.body.privacy)
      .toMatchObject({
        manualPseudonymizations: 1
      });
    expect(documentService.finalizeReview)
      .toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported media types", async () => {
    const app = createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list: vi.fn(async () => [])
      },
      documentService: service()
    });

    await request(app)
      .post("/api/documents/ingest")
      .set("Content-Type", "text/plain")
      .send("text")
      .expect(415, {
        error: "UNSUPPORTED_DOCUMENT_MEDIA_TYPE"
      });
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

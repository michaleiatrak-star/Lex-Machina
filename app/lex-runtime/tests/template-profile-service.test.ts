import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocalSharedTemplateStore, DOCX_MEDIA_TYPE } from "../src/shared-template-store.js";
import { LocalLegalDocumentRenderer } from "../src/legal-document-renderer.js";
import { LocalTemplateProfileService } from "../src/template-profile-service.js";

const roots: string[] = [];
afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("LocalTemplateProfileService", () => {
  it("derives an approved profile without exposing template content to generation", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-template-profile-"));
    roots.push(root);
    const renderer = new LocalLegalDocumentRenderer({ timeoutMs: 10000 });
    const rendered = await renderer.render("docx", {
      schemaVersion: "1",
      documentType: "letter",
      locale: "pl-PL",
      styleProfile: "lex-classic-tnr-v1",
      blocks: [{
        type: "paragraph",
        content: [{ type: "text", text: "Poufna treść wzoru nie jest kopiowana." }]
      }]
    });
    try {
      const store = new LocalSharedTemplateStore({ rootDir: root });
      const manifest = await store.saveTemplate({
        filename: "wzor.docx",
        mediaType: DOCX_MEDIA_TYPE,
        data: rendered.data,
        createdByUserId: "user_0123456789abcdef0123456789abcdef"
      });
      const service = new LocalTemplateProfileService(store, renderer);
      const profile = await service.resolve(manifest.templateId);
      expect(profile.styleProfile).toBe("lex-classic-tnr-v1");
      expect(profile.sourceFormat).toBe("docx");
      expect(profile.sourceSha256).toBe(manifest.sha256);
      expect(JSON.stringify(profile)).not.toContain("Poufna treść");
    } finally {
      rendered.data.fill(0);
    }
  });

  it("fails closed when stored template bytes are tampered", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-template-tamper-"));
    roots.push(root);
    const renderer = new LocalLegalDocumentRenderer({ timeoutMs: 10000 });
    const rendered = await renderer.render("docx", {
      schemaVersion: "1",
      documentType: "letter",
      locale: "pl-PL",
      styleProfile: "lex-classic-clean-v1",
      blocks: [{ type: "paragraph", content: [{ type: "text", text: "Wzór" }] }]
    });
    try {
      const store = new LocalSharedTemplateStore({ rootDir: root });
      const manifest = await store.saveTemplate({
        filename: "wzor.docx",
        mediaType: DOCX_MEDIA_TYPE,
        data: rendered.data,
        createdByUserId: "user_0123456789abcdef0123456789abcdef"
      });
      fs.appendFileSync(
        path.join(root, "shared", "templates", manifest.templateId, "original", "wzor.docx"),
        Buffer.from("tamper")
      );
      const service = new LocalTemplateProfileService(store, renderer);
      await expect(service.resolve(manifest.templateId)).rejects.toThrow("TEMPLATE_PAYLOAD_MISMATCH");
    } finally {
      rendered.data.fill(0);
    }
  });
});

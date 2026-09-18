import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LocalLegalDocumentRenderer } from "./legal-document-renderer.js";
import { LocalSharedTemplateStore, DOCX_MEDIA_TYPE } from "./shared-template-store.js";
import { LocalTemplateProfileService } from "./template-profile-service.js";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-g35c-"));
const renderer = new LocalLegalDocumentRenderer({ timeoutMs: 10000 });
let rendered: Awaited<ReturnType<typeof renderer.render>> | undefined;
try {
  rendered = await renderer.render("docx", {
    schemaVersion: "1",
    documentType: "letter",
    locale: "pl-PL",
    styleProfile: "lex-classic-tnr-v1",
    blocks: [{
      type: "paragraph",
      content: [{ type: "text", text: "POUFNA TRESC WZORU" }]
    }]
  });
  const store = new LocalSharedTemplateStore({ rootDir: root });
  const manifest = await store.saveTemplate({
    filename: "firm-template.docx",
    mediaType: DOCX_MEDIA_TYPE,
    data: rendered.data,
    createdByUserId: "user_0123456789abcdef0123456789abcdef"
  });
  const profile = await new LocalTemplateProfileService(store, renderer)
    .resolve(manifest.templateId);

  const safeProfileOnly =
    profile.styleProfile === "lex-classic-tnr-v1" &&
    profile.sourceFormat === "docx" &&
    profile.sourceSha256 === manifest.sha256 &&
    !JSON.stringify(profile).includes("POUFNA TRESC WZORU");

  process.stdout.write(JSON.stringify({
    gate: "G35C_TEMPLATE_ASSISTED_GENERATION",
    result: safeProfileOnly ? "PASS" : "BLOCKED",
    templateId: manifest.templateId,
    styleProfile: profile.styleProfile,
    rawTemplateContentExcluded: safeProfileOnly
  }, null, 2) + "\n");
  if (!safeProfileOnly) process.exitCode = 1;
} finally {
  rendered?.data.fill(0);
  fs.rmSync(root, { recursive: true, force: true });
}

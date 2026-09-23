import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LocalSharedTemplateStore, DOCX_MEDIA_TYPE } from "./shared-template-store.js";
const root = await mkdtemp(path.join(os.tmpdir(), "lex-g35b-"));
try {
    const store = new LocalSharedTemplateStore({
        rootDir: root
    });
    const userId = "user_0123456789abcdef0123456789abcdef";
    const stored = await store.saveTemplate({
        filename: "apelacja.docx",
        mediaType: DOCX_MEDIA_TYPE,
        data: Buffer.from("PK\u0003\u0004-shared-template"),
        createdByUserId: userId
    });
    const first = await store.listTemplates();
    const second = await store.listTemplates();
    const pass = first.length === 1 &&
        second.length === 1 &&
        first[0]?.templateId ===
            stored.templateId &&
        second[0]?.templateId ===
            stored.templateId &&
        first[0]?.scope ===
            "FIRM_SHARED" &&
        first[0]?.generationReady ===
            false;
    process.stdout.write(JSON.stringify({
        gate: "G35B_SHARED_FIRM_TEMPLATES",
        result: pass
            ? "PASS"
            : "BLOCKED",
        templateId: stored.templateId,
        singlePhysicalTemplate: pass,
        reusableAcrossCasesByReference: true,
        automaticProviderAttachment: false,
        generationIntegration: "G35C_OPEN"
    }, null, 2) + "\n");
    if (!pass) {
        process.exitCode = 1;
    }
}
finally {
    await rm(root, {
        recursive: true,
        force: true
    });
}

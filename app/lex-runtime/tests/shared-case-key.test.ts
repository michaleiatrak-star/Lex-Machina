import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CompleteDocumentIngestor } from "../src/document-ingestion.js";
import { LocalPrivateDocumentService, type PublicDocumentIngestion } from "../src/document-service.js";
import { EncryptedPrivacyVaultStore } from "../src/privacy/vault-store.js";
import { buildGenerationAliases } from "../src/generation-aliases.js";
import { PseudonymizationVault } from "../src/privacy/pseudonymizer.js";

const CASE_ID = "case_0123456789abcdef0123456789abcdef";
const roots: string[] = [];
afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, { recursive: true, force: true });
});

function documents() {
  const sources = new Map<string, unknown>();
  const protectedDocs = new Map<string, PublicDocumentIngestion>();
  return {
    async saveSource(args: { documentId: string; mediaType: string; source: unknown }) {
      sources.set(args.documentId, { mediaType: args.mediaType, source: args.source });
    },
    async loadSource(args: { documentId: string }) {
      return sources.get(args.documentId) as never;
    },
    async saveProtected(args: { documentId: string; ingestion: PublicDocumentIngestion }) {
      protectedDocs.set(args.documentId, structuredClone(args.ingestion));
    },
    async loadProtected(args: { documentId: string }) {
      return structuredClone(protectedDocs.get(args.documentId)) as never;
    }
  };
}

function service(store: object, docs: ReturnType<typeof documents>) {
  return new LocalPrivateDocumentService(
    new CompleteDocumentIngestor({ async extract() { return { bytes: 1, pages: [] }; } }),
    { recognize: async () => [] },
    24_000,
    undefined,
    store as EncryptedPrivacyVaultStore,
    docs as never
  );
}

const person = (text: string, name: string) => {
  const start = text.indexOf(name);
  return { page: 1, start, end: start + name.length, action: "PSEUDONYMIZE" as const, kind: "PERSON" as const };
};

async function processText(current: LocalPrivateDocumentService, text: string, names: string[], key: Buffer) {
  const review = await current.review(Buffer.from(text), "text/plain", { caseId: CASE_ID, caseDataKey: key, keyVersion: 1 });
  const result = await current.finalizeReview(
    review.documentId,
    names.map((name) => person(text, name)),
    { caseId: CASE_ID, caseDataKey: key, keyVersion: 1 }
  );
  return result;
}

describe("one anonymization key per case", () => {
  it("gives a person the same token in every document of the case", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-shared-key-"));
    roots.push(root);
    const key = randomBytes(32);
    const store = new EncryptedPrivacyVaultStore({ rootDir: root });
    const docs = documents();
    const current = service(store, docs);
    const security = { caseId: CASE_ID, caseDataKey: key, keyVersion: 1 };

    const first = await processText(current, "Jan Kowalski jest pozwanym.", ["Jan Kowalski"], key);
    const second = await processText(current, "Ewa Lis wezwała Jan Kowalski do zapłaty.", ["Ewa Lis", "Jan Kowalski"], key);
    expect(first.chunks[0]!.text).toContain("[PII:PERSON:0001] jest pozwanym");
    expect(second.chunks[0]!.text).toContain("[PII:PERSON:0002] wezwała [PII:PERSON:0001]");

    const state = await current.sharedKeyState(security);
    expect([...state!.members].sort()).toEqual([first.documentId, second.documentId].sort());

    // Each document lists only its own entries; restoring uses the shared key.
    await current.restoreDocument({ ...security, documentId: first.documentId });
    expect(current.usesSharedKey(first.documentId)).toBe(true);
    expect(current.privacyKey(first.documentId).map((entry) => entry.token)).toEqual(["[PII:PERSON:0001]"]);
    expect(current.restoreText(first.documentId, "[PII:PERSON:0002]").text).toBe("Ewa Lis");

    // A document anonymized before the shared key keeps its own numbering until joined.
    const ownKeyStore = {
      loadDocumentVault: store.loadDocumentVault.bind(store),
      saveDocumentVault: store.saveDocumentVault.bind(store)
    };
    const legacy = await processText(service(ownKeyStore, docs), "Świadek Ewa Lis potwierdziła.", ["Ewa Lis"], key);
    expect(legacy.chunks[0]!.text).toContain("Świadek [PII:PERSON:0001] potwierdziła");
    await current.restoreDocument({ ...security, documentId: legacy.documentId });
    expect(current.usesSharedKey(legacy.documentId)).toBe(false);

    const joined = await current.joinSharedKey(legacy.documentId, security);
    expect(joined.remapped).toBe(1);
    expect(joined.chunks[0]!.text).toContain("Świadek [PII:PERSON:0002] potwierdziła");
    await current.restoreDocument({ ...security, documentId: legacy.documentId });
    expect(current.usesSharedKey(legacy.documentId)).toBe(true);
    expect(current.restoreText(legacy.documentId, "[PII:PERSON:0002|GEN]").text).toContain("Ewa");

    // A new token added in one document never collides with another document's.
    const added = await current.addProtection(legacy.documentId, "potwierdziła", "CUSTOM", security);
    expect(added.token).toBe("[PII:CUSTOM:0001]");
    const after = await current.sharedKeyState(security);
    expect(new PseudonymizationVault(after!.snapshot).hasToken("[PII:CUSTOM:0001]")).toBe(true);
  });

  it("gives shared-key documents one alias per token in document generation", () => {
    const vault = new PseudonymizationVault();
    vault.getOrCreate("PESEL", "44051401359");
    const other = new PseudonymizationVault();
    other.getOrCreate("PESEL", "02070803628");
    const manifest = buildGenerationAliases([
      { documentId: "doc_000000000000000000000001", vault, shared: true },
      { documentId: "doc_000000000000000000000002", vault, shared: true },
      { documentId: "doc_000000000000000000000003", vault: other }
    ]);
    expect(manifest.entries.map((entry) => entry.alias)).toEqual([
      "[LMPII:D00:PESEL:0001]",
      "[LMPII:D01:PESEL:0001]"
    ]);
  });
});

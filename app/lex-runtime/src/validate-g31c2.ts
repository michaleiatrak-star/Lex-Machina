import { PseudonymizationVault } from "./privacy/pseudonymizer.js";
import { buildGenerationAliases } from "./generation-aliases.js";
import { validateLegalDocumentAst } from "./legal-document-ast.js";

const documentId = "doc_0123456789abcdef01234567";
const vault = new PseudonymizationVault();
vault.getOrCreate("PERSON", "Jan Kowalski");
const manifest = buildGenerationAliases([{ documentId, vault }]);
const alias = manifest.entries[0]?.alias ?? "";

const positive = validateLegalDocumentAst({
  schemaVersion: "1",
  documentType: "letter",
  locale: "pl-PL",
  styleProfile: "lex-classic-clean-v1",
  blocks: [{
    type: "paragraph",
    content: [
      { type: "text", text: "Klient: " },
      { type: "pii_ref", alias }
    ]
  }]
}, manifest.entries);

let inventedBlocked = false;
try {
  validateLegalDocumentAst({
    schemaVersion: "1",
    documentType: "letter",
    locale: "pl-PL",
    styleProfile: "lex-classic-clean-v1",
    blocks: [{
      type: "paragraph",
      content: [{ type: "pii_ref", alias: "[LMPII:D01:PERSON:9999]" }]
    }]
  }, manifest.entries);
} catch {
  inventedBlocked = true;
}

let tokenTextBlocked = false;
try {
  validateLegalDocumentAst({
    schemaVersion: "1",
    documentType: "letter",
    locale: "pl-PL",
    styleProfile: "lex-classic-clean-v1",
    blocks: [{
      type: "paragraph",
      content: [{ type: "text", text: "[PII:PERSON:0001]" }]
    }]
  }, manifest.entries);
} catch {
  tokenTextBlocked = true;
}

const providerSafe =
  !JSON.stringify(manifest).includes("Jan Kowalski");

const pass =
  positive.aliasesUsed.length === 1 &&
  alias === "[LMPII:D01:PERSON:0001]" &&
  inventedBlocked &&
  tokenTextBlocked &&
  providerSafe;

process.stdout.write(JSON.stringify({
  gate: "G31C2_TYPED_AUTHORING_AST",
  result: pass ? "PASS" : "BLOCKED",
  generationAlias: alias,
  inventedAliasBlocked: inventedBlocked,
  tokenSyntaxInTextBlocked: tokenTextBlocked,
  clearValueExcludedFromAliasManifest: providerSafe
}, null, 2) + "\n");
if (!pass) process.exitCode = 1;

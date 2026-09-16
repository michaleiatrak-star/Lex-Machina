# G31 — Local DOCX/ODT Authoring + Case Storage Architecture

Status: **G31A/G31B FOUNDATION IMPLEMENTED; G31C-G31E DESIGN COMPLETE, NOT YET PASS**  
Date: 2026-09-16

## 1. Target pipeline

The target authoring flow is:

`case file → local extraction/OCR → local pseudonymization → provider sees tokens only → AI edits typed document AST → deterministic local DOCX/ODT renderer → local deanonymization → token/package/legal validation → artifact store → immediate localhost download`

A deanonymized artifact must never be sent back to an external model provider.

The same semantic document AST is rendered to either DOCX or ODT. The AI does not emit raw OOXML or raw ODF XML.

---

## 2. Trust zones

### Private local zone

May contain:
- original uploaded files;
- extracted ZIP contents;
- OCR/extracted raw text;
- privacy directives;
- per-document pseudonymization vault;
- generation token aliases;
- deanonymized DOCX/ODT bytes;
- local render previews.

This zone never crosses the provider boundary.

### Provider-safe zone

Contains only:
- finalized protected chunks;
- generation-scoped PII token aliases;
- safe semantic annotations;
- legal evidence allowed by the runtime;
- typed AST / typed edit patches.

### Browser zone

May receive:
- case/file metadata;
- local raw review text when the user is reviewing privacy locally;
- protected chunks;
- generation status;
- artifact metadata;
- final document bytes only through an explicit localhost download.

The browser never receives the re-identification vault.

---

## 3. Current-state audit and resolved storage gap

Before G31A, uploads were **not persisted to a case directory**: HTTP passed request bytes directly to document review/ingestion and `LocalPrivateDocumentService` retained only source/vault state in memory.

That gap is now closed for production uploads:

- the web app creates an opaque local `caseId` before accepting files;
- production `POST /api/documents/review` and `/ingest` require that case id when the case store is wired;
- PDF/image bytes are persisted under the case before OCR/review;
- the stored original has an upload manifest and SHA-256;
- `POST /api/cases/:caseId/files` persists ZIP archives and extracts safe members under the same case;
- rejected archives are removed rather than leaving a partial upload directory.

The OCR/privacy source pages and reversible vault are still runtime-private objects. G31C-G31E must define any additional durable private-state policy rather than serializing clear-value vault contents by default.

---

## 4. Case storage root

Introduce:

`LEX_DATA_DIR`

The implemented foundation resolves outside the source repository:

`LEX_DATA_DIR` when explicitly configured, otherwise `~/.lex-machina/data`.

A future desktop packaging layer may map this to the operating system's standard application-data directory. Never default case data into the Git checkout.

### Directory model

```text
<LEX_DATA_DIR>/
  cases/
    <caseId>/
      case.json
      incoming/
        <uploadId>/
          manifest.json
          original/
            <original-file>
          extracted/
            ... safe ZIP members ...
      documents/
        <documentId>/
          document.json
          protected/
            chunks.json
          private/
            source metadata / private runtime state
      artifacts/
        <artifactId>/
          artifact.json
          result.docx | result.odt
          preview.pdf
      audit/
        events.jsonl
```

Private values must not be duplicated unnecessarily. The reversible vault remains a local secret-state object; persistent vault encryption is a separate policy decision and must not be silently implemented as plaintext JSON.

---

## 5. Case identity

Use a non-user-derived opaque id, e.g.:

`case_<random 128-bit id>`

Rules:
- never use client name, PESEL, court signature or matter title as filesystem path;
- validate exact id syntax before filesystem access;
- resolve every path beneath the configured case root;
- reject traversal after normalization;
- case display name lives only in metadata.

Suggested API:

- `POST /api/cases` → create local case;
- `GET /api/cases/:caseId` → metadata only;
- `POST /api/cases/:caseId/files` → upload one file/archive;
- `GET /api/cases/:caseId/files` → local file manifest;
- `DELETE /api/cases/:caseId/files/:uploadId` → explicit local deletion.

---

## 6. Upload persistence contract

Every uploaded file must be persisted before it is processed.

The current foundation:
1. accepts a bounded localhost request body;
2. writes a `.partial` file inside the target case;
3. atomically renames it into `incoming/<uploadId>/original/`;
4. computes SHA-256 and writes the upload manifest;
5. only then invokes document review/OCR, or ZIP extraction.

For very large production case files, a later hardening step should replace the current Express in-memory raw-body stage with streaming-to-disk + fsync while preserving the same store contract.

Repeat operations should eventually consume the immutable stored-file reference rather than requiring the browser to re-upload the same bytes.

---

## 7. ZIP intake

Supported archive type:

- `application/zip`
- file extension `.zip`

ZIP is an intake container, not a document sent directly to the model.

### Safe extraction requirements

Mandatory protections:

- reject absolute paths;
- reject `..` traversal;
- reject Windows drive/UNC paths;
- normalize separators before validation;
- reject NUL/control characters in names;
- reject symlinks and hardlink-like archive entries;
- reject device/special files;
- cap entry count;
- cap total uncompressed bytes;
- cap single-entry uncompressed bytes;
- cap path length and nesting depth;
- detect extreme compression ratio / ZIP bomb patterns;
- reject duplicate normalized output paths;
- never overwrite an existing extracted file;
- extract with create-new semantics;
- no executable launch/hooks;
- nested ZIPs are stored as files but are **not recursively auto-extracted**.

Recommended initial limits:

- archive input: 512 MiB;
- entries: 10,000;
- one extracted file: 512 MiB;
- total uncompressed: 2 GiB;
- path depth: 32;
- normalized relative path: 512 characters;
- suspicious expansion ratio threshold: configurable fail-closed threshold.

The exact production limits remain configuration, not provider-controlled values.

### Archive manifest

Store for every member:

```ts
type ExtractedArchiveEntry = {
  relativePath: string;
  compressedBytes: number;
  uncompressedBytes: number;
  sha256: string;
  mediaType: string | null;
  processable: boolean;
};
```

No archive member is sent to a model automatically.

---

## 8. Files after ZIP extraction

All safe members remain in the case directory even when the runtime does not understand their format.

Classification:

### Processable now
- PDF;
- JPEG;
- PNG;
- WebP;
- TIFF.

### Planned document intake
- DOCX;
- ODT;
- TXT/MD and other explicitly supported text formats.

### Stored only
Unknown/binary formats stay in the case archive but are not parsed or attached to provider context until an explicit safe adapter exists.

File type should be determined from trusted parser/signature checks where possible, not solely from filename extension.

---

## 9. Pseudonymization and generation-scoped aliases

Existing document vault tokens are document-local, e.g.:

`[PII:PERSON:0001]`

A multi-document authoring session must not expose those directly because two document vaults can contain the same visible token for different people.

Create a generation-only alias:

`[LMPII:D01:PERSON:0001]`

Backend-only mapping:

`generation alias → documentId + source vault token`

The provider receives the alias and kind, never the value.

Rules:
- aliases immutable within one generation;
- unique across all source documents;
- provider cannot introduce unknown aliases;
- normal text nodes cannot contain token-shaped strings;
- PII must be represented by a typed `pii_ref` AST node.

---

## 10. Shared semantic document AST

Both DOCX and ODT renderers consume the same validated AST.

```ts
type LegalDocumentAst = {
  schemaVersion: "1";
  documentType:
    | "pleading"
    | "contract"
    | "opinion"
    | "letter"
    | "report"
    | "other";
  locale: "pl-PL";
  styleProfile:
    | "lex-classic-clean-v1"
    | "lex-light-legal-design-v1"
    | "lex-classic-tnr-v1";
  title?: InlineNode[];
  blocks: BlockNode[];
};
```

Inline nodes:

- text;
- pii_ref;
- internal cross-reference.

Block nodes:

- title/subtitle;
- headings 1–3;
- paragraph;
- legal clause;
- ordered/unordered list;
- table;
- key-terms table;
- block quote;
- signature block;
- page/section break;
- footnote;
- bookmark/cross-reference;
- optional explainer box.

The AI chooses semantics. The local style profile chooses physical formatting.

---

## 11. AI editing

Provider input:

- user task;
- selected finalized G32 protected chunks;
- generation token manifest without values;
- safe annotations;
- legal evidence;
- AST schema/capabilities;
- selected legal-generation skill instructions.

Provider output:

- full `LegalDocumentAst`, or
- typed `DocumentPatch[]` for iterative editing.

Model cannot:
- emit raw OOXML/ODF package XML;
- create package relationship targets;
- embed scripts/macros/OLE/ActiveX;
- read the vault;
- invent token aliases;
- insert token syntax as ordinary text.

---

## 12. Pre-render gates

### AST gate

Validate:
- schema/version;
- block/depth/table limits;
- unique node ids;
- existing cross-reference targets;
- allowed style roles only;
- no unsupported executable/embed nodes.

### Token gate A

For each `pii_ref`:
- alias exists;
- syntax is exact;
- declared kind matches manifest.

Reject token-like text inside plain text nodes.

### Privacy regression gate

Locally inspect model-created normal text for newly introduced high-confidence private identifiers.

Hard block at minimum:
- valid PESEL;
- valid NIP;
- IBAN;
- e-mail;
- protected phone formats.

PERSON/ADDRESS NER may use configurable blocking/warning policy because public names/places can legitimately appear in legal text.

---

# DOCX branch

## 13. Deterministic OOXML renderer

The trusted local renderer creates WordprocessingML. The model never accesses it.

Required core package parts include:

- `[Content_Types].xml`;
- `_rels/.rels`;
- `docProps/core.xml`;
- `docProps/app.xml`;
- `word/document.xml`;
- `word/styles.xml`;
- `word/settings.xml`;
- `word/fontTable.xml`;
- `word/numbering.xml`;
- `word/_rels/document.xml.rels`;
- required headers/footers;
- optional footnotes/theme.

Determinism:
- stable ZIP entry order;
- fixed ZIP timestamps;
- stable ids/relationship allocation;
- canonical internal XML serialization;
- no random rsid values;
- no volatile author/application metadata.

Forbidden:
- VBA/macros;
- ActiveX;
- OLE/embeddings;
- `altChunk`;
- external attached templates;
- external media relationships;
- unknown package parts.

Existing legal-design profile controls Arial 11.5 pt, headings, borders, margins, justification, line spacing, list indentation, tables, TOC threshold and internal navigation.

---

## 14. DOCX token rendering and local deanonymization

Every `pii_ref` should be rendered as a dedicated text run where possible.

Deanonymization is a WordprocessingML text operation, never ZIP byte replacement.

For each allowed text scope:

1. concatenate visible text nodes in logical order;
2. find complete `LMPII` aliases;
3. map offsets back to underlying runs/text nodes;
4. resolve alias → document vault token → local clear value;
5. XML-escape value as text only;
6. replace across split runs safely;
7. preserve formatting of the first token run;
8. remove empty continuation token fragments when structurally safe.

Whitelist text-bearing parts only:
- main body;
- header/footer;
- footnotes/endnotes;
- deliberately enabled comments.

Never deanonymize relationship targets, metadata, field instruction code or filenames.

---

# ODT branch

## 15. Deterministic ODT renderer

ODT uses the same validated AST and privacy/token gates.

Media type:

`application/vnd.oasis.opendocument.text`

Core package:

- uncompressed first ZIP entry `mimetype` with exact ODT media type;
- `content.xml`;
- `styles.xml`;
- `meta.xml`;
- `settings.xml`;
- `META-INF/manifest.xml`;
- optional local images/assets generated by the renderer.

Determinism:
- `mimetype` first and stored without compression;
- stable entry ordering;
- fixed ZIP timestamps;
- canonical XML serialization;
- normalized metadata;
- stable style ids/names;
- no generator-specific volatile values.

Forbidden:
- scripts;
- executable macros;
- arbitrary embedded binaries;
- external linked images;
- remote templates;
- unknown package parts outside the renderer whitelist.

ODT style profiles must map the same Lex semantics as DOCX:
- default Arial 11.5 pt;
- title/heading hierarchy;
- 2.5 cm margins;
- justified body;
- 6 pt paragraph spacing;
- 1.25 line spacing;
- legal numbering;
- monochrome borders/tables;
- table of contents/navigation when required.

---

## 16. ODT local deanonymization

Do not do raw ZIP-byte replacement.

Operate only in whitelisted ODF text XML.

Typical visible-text locations include content in:
- `text:p`;
- `text:h`;
- `text:span`;
- table-cell text;
- headers/footers/footnotes represented in ODF content/styles.

Algorithm mirrors DOCX:

1. build logical visible text across adjacent ODF text nodes/spans;
2. find complete `LMPII` aliases, including split-span cases;
3. map offsets back to XML text nodes;
4. resolve locally through generation alias + document vault;
5. XML-escape and replace as text only;
6. preserve the first span's style;
7. validate XML after replacement.

Never replace inside:
- XML attributes not explicitly designated as visible user content;
- manifest paths;
- URLs;
- metadata identifiers;
- style names.

---

## 17. Token gates B/C — both formats

### Before deanonymization

PASS only when:
- every alias is known;
- no malformed alias exists;
- no raw source `[PII:...]` tokens remain;
- aliases occur only in allowed visible-text positions;
- no alias occurs in package metadata/relationships/instructions.

### After deanonymization

PASS only when:
- zero `LMPII` aliases remain anywhere in package;
- zero source `PII` tokens remain;
- all replacements came from the backend alias map;
- XML/package remains structurally valid.

Public report contains counts only, no clear values.

---

## 18. Package validation and local re-read

For DOCX and ODT:

- ZIP structure valid;
- required parts exist;
- every XML part parses;
- package manifest/relationships are internally consistent;
- forbidden executable/embedded content absent;
- user-visible text can be re-extracted;
- expected sections exist;
- no privacy tokens remain;
- citations in final extracted text are the citations sent to legal validation.

For visual QA:
- render DOCX/ODT locally through headless LibreOffice;
- optionally produce a local preview PDF;
- never upload the deanonymized render to cloud vision.

Visual checks:
- plausible page count;
- no accidental blank pages;
- table width/layout sanity where detectable;
- headers/footers visible;
- no missing-glyph boxes;
- TOC/fields reasonable.

LibreOffice is QA/conversion infrastructure, not the authoritative semantic renderer.

---

## 19. Final legal/export sequence

1. stored case files selected;
2. local extraction/OCR;
3. local pseudonymization/privacy review;
4. protected chunks attached with G32;
5. AI returns tokenized AST;
6. AST/token/privacy gates;
7. HYBRID-VALIDATION and required legal-document gates;
8. deterministic pseudonymized DOCX or ODT render;
9. token gate B;
10. local deanonymization;
11. token gate C;
12. structural package validation;
13. local text re-read;
14. local visual render/QA;
15. final legal/export gate evaluates extracted final text;
16. hash exact final artifact bytes;
17. artifact marked downloadable;
18. user receives immediate localhost download.

**No provider call after deanonymization.**

G10 currently defines DOCX/PDF hybrid requirements. G31 implementation must explicitly extend the export contract to ODT with the same legal validation standard before declaring ODT PASS.

---

## 20. Artifact store and immediate download

Local ephemeral artifact record:

```ts
type LocalArtifact = {
  artifactId: string;
  caseId: string;
  format: "docx" | "odt";
  mediaType: string;
  filename: string;
  sha256: string;
  createdAt: string;
  gate: "PASS";
};
```

Bytes live under:

`cases/<caseId>/artifacts/<artifactId>/result.docx|result.odt`

Suggested API:

- `POST /api/cases/:caseId/artifacts/generate`;
- `GET /api/cases/:caseId/artifacts/:artifactId`;
- `GET /api/cases/:caseId/artifacts/:artifactId/download`.

Download response:
- exact MIME type;
- `Content-Disposition: attachment`;
- sanitized filename;
- `X-Content-Type-Options: nosniff`;
- no-store cache policy;
- only localhost origin accepted;
- only artifact with final gate PASS.

The UI should expose **Pobierz DOCX** / **Pobierz ODT** immediately after successful generation.

---

## 21. Implementation gates

### G31A — Case storage foundation — IMPLEMENTED
- opaque local case ids/directories;
- document upload persistence before review/OCR;
- atomic `.partial` → final rename;
- upload manifests and SHA-256;
- case storage outside the source repository by default.

### G31B — Safe ZIP intake foundation — IMPLEMENTED
- ZIP upload retained in the case;
- ZIP-slip/path traversal defense;
- absolute/drive/UNC path rejection;
- symlink/special-file rejection;
- entry/single-file/total-size/depth/path/ratio limits;
- duplicate-path rejection;
- safe extracted-file manifest;
- rejected archive cleanup;
- nested archives are not recursively auto-extracted.

### G31C — Typed authoring AST
- schema;
- provider contract;
- token aliases;
- AST/token/privacy regression gates.

### G31D — Deterministic DOCX
- OOXML renderer;
- local deanonymization;
- package/text/visual QA;
- G10 integration;
- immediate download.

### G31E — Deterministic ODT
- ODF renderer;
- local deanonymization;
- package/text/visual QA;
- ODT export gate equivalent;
- immediate download.

G31 should be reported PASS only when the implemented sub-gates required by the release scope are green.

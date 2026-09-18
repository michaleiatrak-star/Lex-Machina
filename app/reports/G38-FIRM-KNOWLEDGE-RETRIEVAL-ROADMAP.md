# G38 — Firm Knowledge, Case Retrieval and Extended Document Intake

Date: 2026-09-16  
Repository: `michaleiatrak-star/Lex-Machina`  
Execution branch: `codex/g37-admin-settings-dnd-updater-audit-2026-09-16`  
Parent: `feature/local-runtime`

## Goal

Allow a law firm to use three distinct private resource classes without collapsing them into a template library:

1. **case files** — documents belonging to one matter and protected by that matter's ACL;
2. **firm know-how** — reusable internal knowledge shared through an encrypted firm workspace;
3. **document templates** — DOCX/ODT generation inputs, kept as a separate authoring capability.

G38 does not treat templates as a substitute for retrieval knowledge.

## G38A — encrypted firm-knowledge workspace

Status: **PASS**

Model:

- one special local case of kind `FIRM_KNOWLEDGE`;
- created by ADMIN;
- encrypted with the same CDK/envelope model as a normal matter;
- roles: OWNER / EDITOR / ANALYST / VIEWER;
- per-user encrypted case-key envelopes;
- access revocation rotates the workspace key;
- secure document/vault/artifact rekey participates in the existing rotation transaction;
- users without ACL do not discover the workspace through `getFirmKnowledgeWorkspace()`.

API:

- `GET /api/firm-knowledge`;
- `POST /api/firm-knowledge`;
- standard case ACL endpoints for collaboration.

UI:

- dedicated **Know-how kancelarii** panel;
- create encrypted workspace;
- upload knowledge through the same privacy workbench;
- reuse case collaboration ACL panel.

## G38B — local protected retrieval

Status: **PASS**

`LocalCaseKnowledgeSearch` searches only protected/pseudonymized chunks stored in `SecureCaseDocumentStore`.

Search never indexes raw vault mappings or raw source text outside the case encryption boundary.

Supported sources:

- current `MATTER`;
- `FIRM_KNOWLEDGE`.

Search endpoint:

- `POST /api/cases/:caseId/knowledge/search`.

Search is performed only after case ACL has been verified and the caller's case key has been unwrapped in-process.

## G38C — use retrieval in legal analysis

Status: **PASS**

`POST /api/sessions/execute` accepts an explicit `knowledge` request:

- `includeCase`;
- `caseId`;
- `includeFirm`;
- bounded `limit`.

Security rules:

- retrieval is opt-in;
- current-case retrieval requires `ANALYZE`;
- firm retrieval requires `ANALYZE` on the firm workspace;
- VIEWER cannot add private retrieval content to provider context;
- ranking happens locally;
- only the selected protected chunks are passed to the provider;
- session attachment document count remains bounded;
- no reidentification vault is sent to the provider.

UI:

- explicit **Przeszukaj chronione dokumenty bieżącej sprawy** toggle;
- explicit **Przeszukaj know-how kancelarii** toggle;
- manual search panel can also add a selected protected hit to analysis.

## G38D — extended local document intake

Status: **PASS**

### Digital PDF

PDF remains digital-first.

`PdfJsDocumentPageSource` extracts the embedded PDF text layer first.

`CompleteDocumentIngestor` invokes OCR only for pages whose extracted text is below the configured minimum. A digital-text PDF with sufficient text therefore has:

- `digitalPages > 0`;
- `ocrPages = 0`;
- no OCR engine call for those pages.

A regression test now proves this behavior using an actual generated PDF fixture.

### Office/text documents

Supported through the same privacy-review and secure-document pipeline:

- PDF;
- JPEG / PNG / WebP / TIFF;
- TXT;
- Markdown;
- DOCX;
- ODT;
- XLSX;
- XLSM;
- CSV;
- TSV.

DOCX/ODT extraction is local ZIP/XML processing.

XLSX/XLSM extraction is local ZIP/XML processing.

For XLSM:

- worksheet XML may be read;
- VBA payload is ignored;
- macros are never executed.

For spreadsheet formulas:

- formulas are never evaluated;
- the formula expression is serialized as text;
- an existing cached result may be included as text;
- no recalculation engine runs.

CSV/TSV are decoded locally into row/cell text.

All extracted text then follows:

`review → local PII suggestions/manual decisions → finalize → protected chunks → encrypted store → ACL-aware retrieval`.

### Safety limits

Spreadsheet extraction is fail-closed with limits on:

- input bytes;
- archive entry count;
- aggregate uncompressed archive size;
- XML member size;
- sheet count;
- row count;
- cell count;
- output text size;
- worker execution time.

DTD/ENTITY declarations in spreadsheet XML are rejected.

### Explicit current limitation

Legacy binary Excel `.xls` is **not** parsed by this gate.

Reason:

- it is a separate BIFF binary format;
- introducing Office/LibreOffice execution or an unpinned extra parser only to claim coverage would weaken the current local trust boundary.

For the first secure implementation, legacy `.xls` must be converted to XLSX/CSV before ingestion. Native `.xls` may be added only with a pinned offline parser plus adversarial file tests.

## G38E — restart and case identity correctness

Status: **PASS**

Document attachment selections carry explicit `caseId`.

For a persisted document after process restart:

1. backend verifies the requested case ACL;
2. unwraps the case key;
3. restores protected document chunks from `SecureCaseDocumentStore`;
4. resolves selected chunks;
5. only then builds provider context.

This removes reliance on an ephemeral `documentId → caseId` process-memory map and avoids ambiguity when identical document bytes exist in different cases.

## Required validation

G38 closure evidence is satisfied by validated HEAD `2e42a4e29ad48e8c5004866e7535746fdd0ac44a`. The validation set included:

- TypeScript strict typecheck;
- Python worker syntax;
- office extraction tests;
- spreadsheet extraction tests;
- digital PDF no-OCR regression;
- document-service privacy/chunk tests;
- case knowledge search tests;
- firm workspace ACL lifecycle;
- multi-user encrypted document/rekey test;
- web API tests;
- production web build;
- G14 browser-bundle safety;
- full existing deterministic G1-G36/P4B/G34H regression;
- live source probes where CI requires them.

## Relationship to installer

G38 is application functionality and should be stable before the installer is frozen.

The installer self-test must eventually include:

- digital PDF without unnecessary OCR;
- scanned PDF with OCR;
- DOCX/ODT extraction;
- XLSX extraction;
- firm knowledge search;
- case knowledge search;
- multi-user grant/revoke/rekey.

No installer should be called release-ready while these candidate tests are red.

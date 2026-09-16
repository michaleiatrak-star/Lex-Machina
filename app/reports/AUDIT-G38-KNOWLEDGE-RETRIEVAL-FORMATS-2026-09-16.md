# Audit — G38 firm know-how, case-document retrieval and document formats

Date: 2026-09-16  
Repository: `michaleiatrak-star/Lex-Machina`  
Branch: `codex/g37-admin-settings-dnd-updater-audit-2026-09-16`  
PR: #40

## 1. User requirement

The law firm needs more than a document-template library.

Required private resources:

- reusable firm know-how;
- case files as an additional searchable resource;
- controlled use of search hits in model context;
- multi-user access according to case/workspace ACL;
- common office/document formats including Excel;
- digital PDFs should not be sent through OCR when an adequate text layer already exists.

## 2. Baseline finding

The project already had:

- encrypted case files;
- per-case ACL;
- protected document chunks;
- secure case document persistence;
- case-key rotation/rekey;
- shared DOCX/ODT template storage;
- a partially introduced `FIRM_KNOWLEDGE` case kind;
- a local `LocalCaseKnowledgeSearch` implementation.

The template library is not a knowledge base.

Templates are authoring inputs and should remain separate from retrieval knowledge.

## 3. Multi-user case/document access

Backend model:

- one OWNER per case;
- multiple EDITOR / ANALYST / VIEWER participants;
- EDITOR: READ + WRITE + ANALYZE;
- ANALYST: READ + ANALYZE;
- VIEWER: READ;
- OWNER additionally manages ACL/lifecycle.

Each participant receives an individual encrypted case-key envelope.

Revocation triggers case-key rotation and rekey of encrypted case resources.

A real secure-upload test verifies:

- owner stores encrypted document;
- VIEWER can read but cannot write;
- upgraded EDITOR can add a document;
- revoked participant loses READ;
- owner retains both documents after rekey.

UI now exposes case collaborators to OWNER.

## 4. Firm know-how

A special encrypted workspace of kind `FIRM_KNOWLEDGE` is used rather than plaintext shared folders.

Properties:

- ADMIN creates the workspace;
- one workspace per installation;
- normal case ACL roles apply;
- users without ACL cannot access it;
- knowledge documents enter via `DocumentPrivacyPanel`;
- privacy decisions and protected chunks are persisted under the workspace CDK.

This is materially different from `FIRM_SHARED` DOCX/ODT templates.

## 5. Retrieval

`LocalCaseKnowledgeSearch` performs local lexical ranking over protected chunks.

It does not search plaintext vault mappings.

Manual retrieval:

- user can search current matter;
- user can search firm know-how;
- results identify document/chunk/page;
- authorized ANALYZE roles can add a result to analysis.

Automatic session retrieval:

- `executeSession.knowledge.includeCase`;
- `executeSession.knowledge.includeFirm`;
- ranking occurs before provider call;
- selected protected chunks become bounded session attachments.

ACL is checked before case key unwrap/search.

## 6. Document identity/restart audit

Previous weak point:

`documentId → caseId` had an in-process HTTP map.

That is insufficient because:

- map disappears after restart;
- documentId is content-derived and identical bytes can exist in different cases.

Correction:

- web selections now carry explicit `caseId`;
- finalization accepts explicit `caseId`;
- session attachment resolution verifies the specified case;
- persisted protected document is restored from encrypted storage when necessary.

## 7. Digital PDF behavior

Current PDF implementation is already text-layer-first:

- pdf.js extracts text from every PDF page;
- OCR candidates are only pages below the minimum digital-text threshold.

Therefore a digital text PDF does not require OCR.

A new actual-PDF regression test asserts:

- one digital page;
- zero OCR pages;
- OCR engine call count remains zero.

## 8. DOCX/ODT/TXT/Markdown

Added local digital extraction for:

- TXT;
- Markdown;
- DOCX;
- ODT.

DOCX/ODT are parsed as ZIP/XML and never opened through Microsoft Office.

The output enters the standard privacy-review and protected-chunk pipeline.

## 9. Excel/spreadsheet intake

Added local extraction for:

- XLSX;
- XLSM;
- CSV;
- TSV.

XLSX/XLSM parser:

- reads workbook/sheet XML only;
- ignores macros and embedded active content;
- does not execute VBA;
- does not evaluate formulas;
- emits formula source and optional cached value as plain text.

Spreadsheet output is represented with sheet/row/cell identity so retrieval hits retain useful table context.

Hard limits exist for archive size, member size, sheets, rows, cells, output text and worker timeout.

XML DTD/ENTITY constructs are rejected.

### Legacy XLS

Binary BIFF `.xls` remains unsupported in this gate.

It is intentionally not routed through LibreOffice/Excel and not silently treated as XLSX.

Users must convert old XLS to XLSX/CSV until a pinned offline BIFF parser is separately validated.

## 10. Security boundary

For all supported knowledge/case documents:

1. source is ingested locally;
2. privacy review happens locally;
3. protected chunks are persisted encrypted;
4. retrieval occurs only after ACL;
5. only selected protected chunks may cross provider boundary;
6. vault/reidentification state remains local.

## 11. Validation status

G38 is **PASS** on validated code SHA `2e42a4e29ad48e8c5004866e7535746fdd0ac44a`.

Validation evidence:

- F-138 structural audit run `35102533273` — SUCCESS;
- Lex Runtime Validation run `35102533235` — SUCCESS;
- runtime tests — 55/55 files, 207/207 tests PASS;
- strict TypeScript typecheck — PASS;
- Python worker syntax — PASS;
- web tests — 1/1 file, 15/15 tests PASS;
- production web build — PASS;
- G14 browser-bundle safety — PASS;
- deterministic G1-G36/P4B/G34H gate set — PASS;
- live G17/G19/G20/G22 probes — PASS.

The earlier `caseKind` mapper/import defects and G32/document-format test regressions were corrected before this validation. Web dependency resolution was made deterministic for the validated build by pinning Vite 8.2.2 and overriding Rolldown to the published 1.2.8 release.

## 12. Release impact

Installer work should start only after G38 is green, because the package/self-test must include the local extraction workers and their Python runtime dependencies.

Required installer acceptance adds:

- digital PDF text-layer test;
- scanned PDF OCR test;
- DOCX/ODT extraction;
- XLSX extraction;
- protected retrieval;
- firm workspace ACL;
- multi-user rekey after revoke.

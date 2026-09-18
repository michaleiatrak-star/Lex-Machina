# BUILD-0043 — G38 Firm Knowledge, Case Retrieval and Extended Document Intake

Date: 2026-09-16  
Status: **PASS**  
Validated code SHA: `2e42a4e29ad48e8c5004866e7535746fdd0ac44a`

## Implemented

### Multi-user case collaboration

- OWNER-managed case ACL;
- EDITOR / ANALYST / VIEWER roles;
- collaborator candidate listing;
- React collaborator management panel;
- encrypted per-user case-key envelopes;
- revoke triggers key rotation/rekey;
- real encrypted-upload multi-user regression proves read/write/revoke behavior.

### Firm know-how

- unique encrypted `FIRM_KNOWLEDGE` workspace;
- ADMIN creation;
- normal case ACL semantics;
- dedicated React firm-knowledge panel;
- same privacy and encrypted document storage path as matters.

### Protected retrieval

- local search over protected/pseudonymized chunks;
- current-case retrieval;
- firm-knowledge retrieval;
- manual search-hit attachment;
- automatic `executeSession.knowledge` retrieval;
- `ANALYZE` required before private retrieval content enters provider context;
- bounded provider context;
- reidentification vault never enters provider payload.

### Restart-safe document authorization

- attachment selections carry explicit `caseId`;
- document finalization is case-bound;
- persisted protected documents are restored from `SecureCaseDocumentStore` after restart;
- authorization no longer relies on an ephemeral `documentId → caseId` process map.

### Extended document intake

Supported in the privacy/retrieval pipeline:

- digital PDF;
- JPEG / PNG / WebP / TIFF;
- TXT;
- Markdown;
- DOCX;
- ODT;
- XLSX;
- XLSM;
- CSV;
- TSV.

Digital PDF:
- embedded text layer first;
- OCR only for insufficient-text pages;
- regression proves zero OCR calls for a valid digital-text PDF.

DOCX/ODT:
- local ZIP/XML extraction;
- no Office process execution.

XLSX/XLSM:
- local ZIP/XML extraction;
- VBA/macros ignored and never executed;
- formulas never evaluated;
- formula source and optional cached value are treated only as text;
- DTD/ENTITY rejected;
- archive/XML/sheet/row/cell/text/time limits fail closed.

CSV/TSV:
- local table-to-text extraction with row/cell identity.

Explicit limitation:
- legacy binary `.xls` remains unsupported pending a pinned offline BIFF parser with adversarial tests.

### Web dependency reproducibility repair

CI exposed a registry-resolution problem where the moving Vite dependency range selected an unavailable Rolldown tarball.

The validated web build now uses:
- Vite `8.2.2`;
- npm override Rolldown `1.2.8`.

## Validation

F-138 structural audit:
- run `35102533273`;
- conclusion: SUCCESS.

Lex Runtime Validation:
- run `35102533235`;
- conclusion: SUCCESS.

Runtime:
- strict TypeScript typecheck: PASS;
- Python worker syntax: PASS;
- test files: **55/55 PASS**;
- tests: **207/207 PASS**;
- deterministic G1-G36/P4B/G34H gate set: PASS.

Web:
- test files: **1/1 PASS**;
- tests: **15/15 PASS**;
- production build: PASS;
- G14 browser bundle safety: PASS.

Live:
- G17: PASS;
- G19: PASS;
- G20: PASS;
- G22: PASS.

## Release significance

G38 closes the private firm-knowledge and case-document retrieval requirement and broadens real-law-firm intake beyond template files.

It does **not** close the still-unimplemented release gates:
- G31C2;
- G35C;
- G31D;
- G31E;
- full G34F;
- G34G;
- G33A-D.

Those gates remain prerequsites for the production installer defined by the master roadmap.

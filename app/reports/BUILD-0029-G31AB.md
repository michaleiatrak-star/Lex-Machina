# Build 0029 — G31A Case Storage + G31B Safe ZIP Intake

Date: 2026-09-16  
Branch: `feature/local-runtime`

## Status

**IMPLEMENTED — validation pending final CI for this documentation head**

This build closes the previously identified persistence gap for production uploads and adds a safe local ZIP intake foundation. It does **not** claim full G31 DOCX/ODT authoring PASS.

## G31A — Local case storage foundation

Implemented:

- opaque `case_<128-bit random>` identifiers;
- data root outside the Git checkout:
  - `LEX_DATA_DIR` when configured;
  - otherwise `~/.lex-machina/data`;
- per-case directories for:
  - incoming uploads;
  - future document state;
  - future artifacts;
  - audit data;
- production web app creates a local case before file upload;
- production document review/ingest requires that case id when case storage is enabled;
- PDF/image bytes are persisted before OCR/review;
- upload ids are opaque/random;
- original upload is written as `.partial` and atomically renamed;
- SHA-256 and manifest are stored;
- filename is normalized and cannot create filesystem paths.

Important boundary:

- the reversible PII vault remains runtime-private and is **not** serialized as plaintext case metadata;
- the current Express raw upload stage is bounded but still memory-backed; a later large-file hardening step should stream directly to the case store.

## G31B — Safe ZIP intake foundation

New endpoint:

`POST /api/cases/:caseId/files`

ZIP handling:

- original archive retained under the case;
- safe members extracted under the same upload directory;
- extracted manifest records relative path, sizes, SHA-256, MIME guess and current processing support;
- nested archives are not recursively extracted;
- extracted files are not attached to AI automatically.

Fail-closed protections:

- absolute path rejection;
- `..` traversal / ZIP-slip rejection;
- Windows drive and UNC path rejection;
- NUL/control-name rejection;
- symlink rejection;
- special-file rejection;
- encrypted-entry rejection;
- duplicate normalized path rejection;
- entry count cap;
- single-file size cap;
- total uncompressed size cap;
- path length and nesting depth cap;
- suspicious expansion ratio / ZIP-bomb rejection;
- create-new extraction semantics;
- rejected archive upload directory is removed.

Current extracted formats marked directly processable:

- PDF;
- JPEG;
- PNG;
- WebP;
- TIFF.

DOCX, ODT and other files may be safely retained in the case, but they are not marked processable until explicit input adapters are implemented.

## UI

The local workbench now accepts:

- PDF;
- JPEG/PNG/WebP/TIFF;
- ZIP.

For ZIP it displays the extracted file manifest and makes clear that no archive member is automatically sent to a model provider.

## Current upload audit conclusion

Before this build: **NO** — uploaded files were only passed into the in-memory document service and did not land in a case directory.

After this build in the production server/UI path: **YES** — PDF/image uploads are persisted in the current local case before OCR/review, and ZIP archives plus safe extracted members are stored in that case.

## Full G31 status

Still open:

- **G31C** — typed AI authoring AST + generation-scoped PII aliases;
- **G31D** — deterministic DOCX OOXML renderer + local deanonymization + final download;
- **G31E** — deterministic ODT renderer + local deanonymization + final download.

Architecture:

`app/reports/G31-DOCX-ODT-CASE-STORAGE-ARCHITECTURE.md`

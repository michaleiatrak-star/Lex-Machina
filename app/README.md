# Lex Machina App — local runtime

This directory contains the application/runtime workstream for running the development Lex Machina corpus outside a vendor-specific host.

## Source of truth

The legal methodology remains in:

`Wersja rozwojowa rozpakowana/`

The application MUST NOT duplicate or silently rewrite legal skill instructions. Runtime code is responsible for:

- loading skills and resources;
- resolving declared dependencies;
- enforcing mandatory reads and fail-closed behavior;
- exposing provider-neutral tools;
- recording an auditable execution trace;
- invoking model providers through adapters;
- enforcing validation gates before a final/exportable result.

## Initial build gates

- **G0 — Baseline:** exact Lex commit recorded, corpus untouched.
- **G1 — Corpus Integrity:** all skill frontmatter parses, declared dependencies/resources resolve.
- **G2 — Resolver:** semantic resource paths resolve inside the allowed Lex root and traversal is blocked.
- **G3 — Routing:** legal execution loads `prawny-router-v3` first and required core gates are read.
- **G4 — Tool Safety:** model tools are mediated by a policy-enforcing Tool Broker.
- **G5 — Provider Conformance:** OpenAI/Anthropic/xAI providers normalize streaming + tool calls.
- **G6 — Credential Boundary:** provider secrets stay server-side and are non-serializable through the public contract.
- **G7 — Vertical Slice:** router -> prawo-polskie-v2 -> one DR executes end-to-end.
- **G8 — HARD GATE:** unsupported legal references cannot silently become final.
- **G9 — Audit Completeness:** every final answer has a complete execution trace.
- **G10 — Export Gate:** invalid citations/verification block export.
- **G11-G25:** routing contracts, dynamic providers, localhost API/UI, source verification, temporal law, PDF/case-law evidence and structured evidence bundle.
- **G26 — Provider Status:** UI sees configured/not-configured only.
- **G27 — Complete Document OCR:** all PDF pages are accounted for; scanned pages use local Polish PP-OCRv6; large documents are chunked without truncation.
- **G27A — Image OCR:** JPEG/PNG/WebP/TIFF are OCRed locally as fully accounted single-page documents.
- **G28 — Local Privacy:** reversible pseudonymization/deanonymization with backend-only vault and local Polish PERSON NER.
- **G28A — User Privacy Review:** exact user selections can PSEUDONYMIZE, KEEP or LABEL text before protected chunks are generated.
- **G29 — Private Document Pipeline:** OCR + privacy + chunking exposed through the localhost document-ingestion API.
- **G31A — Case Storage Foundation:** production uploads are persisted locally under an opaque case id before OCR/review.
- **G31B — Safe ZIP Intake Foundation:** ZIP archives are stored and extracted locally with traversal/symlink/bomb limits; archive members are never sent to a provider automatically.
- **G32 — Protected Document Attachment Session:** the user explicitly selects finalized protected chunks; only those chunks can enter provider context, while raw pages and the re-identification vault remain local.
- **G34A — Local Account Bootstrap:** zero-user first ADMIN, Argon2id password-derived UMK envelope and persistent local auth metadata.
- **G34B — Login / Session Boundary:** authenticated private API, persistent failed-attempt backoff, idle/overall expiry, lock/logout and in-memory browser session handling.

## Current scope

G0-G29 plus G27A/G28A, G31A/G31B, G32 and **G34A/G34B** are implemented on `feature/local-runtime`. G31A/G31B provide the storage/archive foundation: after authentication the current workbench creates a local case, PDF/image uploads are persisted under that case before OCR, and ZIP archives are safely extracted into the case directory. G34A/G34B add the first local ADMIN bootstrap, Argon2id-encrypted UMK envelope, authenticated private API, persistent login backoff and expiring in-memory sessions. Heavy OCR/NER model weights are intentionally installed locally rather than downloaded in every CI run; CI verifies adapters, worker syntax, completeness contracts and fail-closed behavior.

Full G31 is **not** claimed PASS: G31C now includes an encrypted file-backed reversible privacy vault plus typed authoring AST/token aliases; G31D deterministic DOCX/deanonymization/download and G31E deterministic ODT/deanonymization/download remain open. G30 open-web discovery also remains open.

**G33 installer/bootstrap is designed but not implemented:** offline-first Tauri desktop packaging, bundled private runtimes/models/LibreOffice, prerequisite probing, guided animated first-run setup, repair/rollback and local self-tests. See `app/reports/G33-INSTALLER-BOOTSTRAP-ARCHITECTURE.md`.


## Security architecture before installer

**G34A/G34B are implemented and validated; G34C-G34H remain open.**

Implemented now:
- zero-user first ADMIN bootstrap;
- Argon2id + encrypted User Master Key envelope;
- local SQLite auth metadata;
- persistent failed-login backoff;
- 15-minute idle / 8-hour overall session enforcement;
- lock/logout/authEpoch revocation;
- private API authentication;
- React authentication shell with bearer held only in memory.

Remaining G34 design includes:
- local ADMIN/USER accounts;
- Argon2id password-derived account unlocking;
- random per-user master keys;
- independent per-case data keys;
- per-user case-key envelopes and case ACLs;
- explicit re-identification permission;
- encrypted persistent privacy vault;
- idle lock / step-up reauthentication;
- recovery-code flow without security questions;
- production Tauri session boundary;
- required encryption-at-rest hardening for raw case files before claiming secure shared-workstation mode.

See:
- `app/reports/G34-IDENTITY-LOGIN-VAULT-ARCHITECTURE.md`
- `app/auth/schema.example.sql`

Installer implementation should follow G34/G31C-D-E rather than freezing the current unauthenticated localhost prototype into a distributable package.


## Master execution roadmap

The consolidated implementation order from the current validated baseline through local identity, encrypted case storage, DOCX/ODT generation, Tauri and the offline installer is documented in:

- `app/reports/MASTER-ROADMAP-SECURE-DESKTOP-RELEASE.md`

**Batch A / G34A-G34B is complete and validated.** The next implementation batch is **Batch B / G34C-G34D**: case ownership/ACL, independent case data keys, per-user key envelopes and authenticated case list/open access.

G30 remains a parallel capability and does not block the secure local-document/installer critical path unless explicitly included in the first desktop release scope.


### Build 0030 validation

- validated code SHA: `b3783309189a6d043fc077e52c736e16b64c10d5`;
- Lex Runtime Validation `35069444351`: success;
- F-138 `35069444331`: success;
- G34A/G34B deterministic validation: PASS;
- web tests/build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

See `app/reports/BUILD-0030-G34AB.md`.

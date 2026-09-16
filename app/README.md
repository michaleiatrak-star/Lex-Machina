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
- **G34C — Case ACL:** explicit case ownership, OWNER/EDITOR/ANALYST/VIEWER roles, separate canReidentify capability and ACL enforcement on case/document operations.
- **G34D — Case Key Envelopes:** independent 256-bit CDK per case, UMK/X25519 per-user envelopes and revoke-with-rotation path.
- **G35A — Case Workspace Browser:** authenticated per-case file inventory from persisted manifests.
- **G35B — Shared Firm Template Library:** one shared DOCX/ODT template store reusable across independently authorized cases by reference.
- **G31C1 — Encrypted Persistent Privacy Vault:** LMV1 AES-256-GCM reversible PII mapping persisted per case, restart-safe and rekeyed with the case CDK.

## Current scope

G0-G29 plus G27A/G28A, G31A/G31B/**G31C1**, G32, **G34A-G34D and G35A/G35B** are implemented on `feature/local-runtime`. G31A/G31B provide the storage/archive foundation. G34A/G34B add local identity/login/session controls. G34C/G34D add explicit case ownership, ACL-filtered case access, independent per-case CDKs, per-user envelopes and revoke-with-key-rotation. The workbench now lists ACL-visible cases and requires explicit selection/creation rather than creating a case on every mount. Heavy OCR/NER model weights are intentionally installed locally rather than downloaded in every CI run; CI verifies adapters, worker syntax, completeness contracts and fail-closed behavior.

Full G31 is **not** claimed PASS: G31C1 encrypted file-backed reversible privacy vault is implemented and validated; G31C2 typed authoring AST/token aliases, G31D deterministic DOCX/deanonymization/download and G31E deterministic ODT/deanonymization/download remain open. G30 open-web discovery also remains open.

**G33 installer/bootstrap is designed but not implemented:** offline-first Tauri desktop packaging, bundled private runtimes/models/LibreOffice, prerequisite probing, guided animated first-run setup, repair/rollback and local self-tests. See `app/reports/G33-INSTALLER-BOOTSTRAP-ARCHITECTURE.md`.


## Security architecture before installer

**G34A-G34D are implemented and validated; G31C1 is also implemented and validated; G34E-G34H remain open.**

Implemented now:
- zero-user first ADMIN bootstrap;
- Argon2id + encrypted User Master Key envelope;
- local SQLite auth metadata;
- persistent failed-login backoff;
- 15-minute idle / 8-hour overall session enforcement;
- lock/logout/authEpoch revocation;
- private API authentication;
- React authentication shell with bearer held only in memory;
- ADMIN-created local USER identities;
- explicit case ownership and ACL roles;
- independent 256-bit Case Data Keys;
- UMK-derived owner envelopes;
- X25519 offline per-user case grants;
- separate canReidentify capability;
- revoke path with CDK rotation;
- explicit legacy-case import;
- ACL-filtered case list/open UI.

Remaining G34 design includes:
- recovery/password lifecycle;
- transaction-bound step-up reauthentication;
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

**Batch A / G34A-G34B, Batch B / G34C-G34D, G35A/G35B and G31C1 are complete and validated.** The next dependency is **G34E/G34F**: recovery/password lifecycle and transaction-bound reauthorization. G35C remains open for later template-assisted DOCX/ODT generation.

G30 remains a parallel capability and does not block the secure local-document/installer critical path unless explicitly included in the first desktop release scope.


### Build 0030 validation

- validated code SHA: `b3783309189a6d043fc077e52c736e16b64c10d5`;
- Lex Runtime Validation `35069444351`: success;
- F-138 `35069444331`: success;
- G34A/G34B deterministic validation: PASS;
- web tests/build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

See `app/reports/BUILD-0030-G34AB.md`.


### Build 0031 validation

- validated code SHA: `a41fd86dd550dc41c93705edc423516d05199d8c`;
- Lex Runtime Validation `35072926001`: success;
- F-138 `35072925987`: success;
- G34C/G34D deterministic validation: PASS;
- web tests/build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

See `app/reports/BUILD-0031-G34CD.md`.

Important: G34H remains open. Current original uploads and extracted ZIP members are still plaintext local files even though case ownership and CDK envelopes now exist.


### Build 0032 validation

- validated code SHA: `181e439232dac1c3e00f9cb45fd1596329d986a8`;
- Lex Runtime Validation `35074544206`: success;
- F-138 `35074544281`: success;
- G35A/G35B deterministic validation: PASS;
- G14-G35 web build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

See `app/reports/BUILD-0032-G35AB.md`.

Shared template generation is not yet claimed: G35C remains open and depends on the typed authoring/rendering pipeline.


### Build 0033 validation

- validated code SHA: `8c1a4c3c61b3e3b28c5c648adcfbf932c7dd7394`;
- Lex Runtime Validation `35076077413`: success;
- F-138 `35076077538`: success;
- G31C1 encrypted persistent privacy vault: PASS;
- strict TypeScript and runtime/app tests: PASS;
- G14-G35 web build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

See `app/reports/BUILD-0033-G31C1.md`.

G31C1 encrypts the reversible privacy mapping only. Raw uploads, extracted ZIP members and shared template originals remain plaintext until G34H.

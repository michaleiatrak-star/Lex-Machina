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

## Current scope

G0-G29 plus G27A/G28A and G32 are implemented on `feature/local-runtime`. G31A/G31B provide the storage/archive foundation: the UI creates a local case, PDF/image uploads are persisted under that case before OCR, and ZIP archives are safely extracted into the case directory. Heavy OCR/NER model weights are intentionally installed locally rather than downloaded in every CI run; CI verifies adapters, worker syntax, completeness contracts and fail-closed behavior.

Full G31 is **not** claimed PASS: G31C typed authoring AST/token aliases, G31D deterministic DOCX/deanonymization/download and G31E deterministic ODT/deanonymization/download remain open. G30 open-web discovery also remains open.

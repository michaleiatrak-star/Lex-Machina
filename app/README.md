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
- **G28 — Local Privacy:** reversible pseudonymization/deanonymization with backend-only vault and local Polish PERSON NER.
- **G29 — Private Document Pipeline:** OCR + privacy + chunking exposed through the localhost document-ingestion API.

## Current scope

G0-G29 are implemented and validated on `feature/local-runtime`. Heavy OCR/NER model weights are intentionally installed locally rather than downloaded in every CI run; CI verifies adapters, worker syntax, completeness contracts and fail-closed behavior.

Next planned gates are G30 open-web discovery, G31 local DOCX generation and G32 document attachment/session flow.

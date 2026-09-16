# Build 0026A — G28A User-Directed Privacy Review

Date: 2026-09-16  
Branch: `feature/local-runtime`  
PR: #38

## Status

**PASS — G28A USER-DIRECTED PRIVACY REVIEW**

## Goal

Let the user correct or enrich automatic privacy decisions before protected chunks are created.

## Manual actions

An exact page-text range can be assigned one action:

- `PSEUDONYMIZE` — replace it with a stable local PII token; optional semantic label;
- `KEEP` — keep the text and suppress automatic anonymization for that range;
- `LABEL` — keep the text, suppress automatic anonymization for that range, and attach a semantic meaning such as witness, attorney or correspondence address.

Overlapping manual directives are rejected fail-closed.

## Local review flow

`PDF/image → local extraction/OCR → review text + automatic suggestions → user selections → finalization → protected chunks`

Endpoints:
- `POST /api/documents/review`
- `POST /api/documents/:documentId/finalize`

The local React workbench supports:
- PDF and image selection;
- page navigation;
- exact text selection;
- action/type/label selection;
- automatic suggestion acceptance;
- deletion of user decisions;
- finalization summary.

Raw review text remains inside the local browser/runtime boundary and is not sent to model providers by this flow.

## Validation

- strict TypeScript — PASS
- runtime privacy tests — PASS
- HTTP review/finalize tests — PASS
- G28A deterministic gate — PASS
- web unit tests — PASS
- production web build — PASS
- browser bundle safety — PASS
- G17/G19/G20/G22 live regressions — PASS
- GitHub Actions `35058485740` — success
- F-138 `35058485712` — success

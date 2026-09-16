# Audit — gate closure status, SAOS/CBOSA and G37C2

Date: 2026-09-16  
Repository: `michaleiatrak-star/Lex-Machina`  
Working line: `codex/g39-authoring-installer-prereqs-2026-09-16` (PR #41)  
Audited baseline SHA: `9c7f1d55aea3806182f6198e97ee55138fe460fb`

## Executive status

This audit is deliberately scoped outside `main`. The current application line is the stacked PR chain #38 → #40 → #41.

Confirmed on baseline SHA `9c7f1d55...`:

- F-138 structural audit: PASS, run `35148527543`;
- Lex Runtime Validation: PASS, run `35148527524`;
- deterministic G30A SAOS + CBOSA discovery: PASS;
- live G30A Windows probe against real SAOS + CBOSA: PASS;
- G34G Tauri trust-boundary job: PASS;
- G33A component manifest: PASS;
- G33B verified online bootstrap contract: PASS;
- G33C zero-touch first run: PASS.

The G33D Windows online installer acceptance workflow `35148527570` was still in progress at the audited baseline and is therefore not claimed as PASS in this section.

## SAOS and CBOSA

Case-law search is no longer documentation-only on the working line.

Runtime implementation:

- `CaseLawSearchService` exposes `SAOS` and `CBOSA`;
- provider tool `search_case_law` exposes the same two-source enum;
- SAOS uses the public JSON search endpoint with explicit `Accept: application/json`;
- CBOSA performs same-host warm-up/session handling, search, pagination and document metadata retrieval;
- candidates are explicitly marked `DISCOVERY`; discovery alone is not treated as proposition evidence.

CI evidence on the audited baseline:

- deterministic step `G30A — SAOS + CBOSA case-law discovery`: PASS;
- live job `G30A live SAOS and CBOSA discovery probe`: PASS.

This closes the technical requirement that judgment search be enabled for both SAOS and CBOSA on the non-main working line.

## Earlier gate closure audit

Closed on the current stacked line by exact-head CI or earlier validated commits:

- G0-G29;
- G30A SAOS/CBOSA discovery;
- G31A/G31B/G31B2/G31C1/G31C2/G31D/G31E;
- G32;
- G34A-G34G and G34H1-H5;
- G35A-G35C;
- G36;
- P4B case lifecycle;
- G38A-G38E;
- G39 secure authoring closure;
- G33A-G33C.

Still open or not yet eligible for closure:

- G33D real installed-copy bootstrap/self-test acceptance until its Windows workflow is green on the exact candidate SHA;
- G37B full passwordless-first-ADMIN lifecycle with later user password setup remains different from the current managed local-admin bootstrap;
- G37D signed, installation-bound SERVICE support entitlement;
- G37E2 signed update transaction / staging / rollback;
- G37F multi-file drag-and-drop queue/progress/accessibility completion;
- G37G final repository/release closure;
- Phase 13 clean-machine/release hardening matrix;
- true stream-to-encrypted-store HTTP intake remains a separate engineering-hardening item.

## G37C2 — persistent provider credentials

The desktop trust boundary already contains the implementation primitives required for G37C2:

- Windows/macOS/Linux OS credential backend through the Rust `keyring` crate;
- per-provider entries under `LexMachina/ProviderCredential`;
- restoration during desktop startup into the backend memory overlay;
- persistence only after the runtime accepts a provider-key PUT;
- OS-keyring delete on successful DELETE;
- provider allowlist limited to OpenAI, Anthropic and xAI;
- transient Rust string zeroization after persistence;
- backend memory overlay zeroization on replace/clear/close;
- no browser localStorage/sessionStorage persistence.

A dedicated gate `G37C2_OS_KEYRING_PROVIDER_CREDENTIALS` is wired into Lex Runtime Validation. G37C2 may be marked final PASS only after the new exact-head CI run succeeds.

## GitHub state

- PR #17: closed as superseded; historical branch retained for explicit retention cleanup;
- PR #38: open parent application line;
- PR #40: open stacked G37/G38 line;
- PR #41: open current authoring/desktop/installer line;
- no merge to `main` is performed by this audit.

The stacked PR state is intentional while release gates remain open. Closing parent PRs without integration would reduce review provenance.

## Next closure order

1. exact-head G37C2 CI;
2. G33D Windows online installer acceptance;
3. reconcile roadmap/build-log status with exact-head evidence;
4. G37B / G37D / G37E2 / G37F;
5. Phase 13 clean-machine acceptance;
6. G37G repository cleanup and release closure.

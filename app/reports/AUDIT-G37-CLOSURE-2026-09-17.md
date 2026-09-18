# AUDIT — G37 closure and non-main release stack — 2026-09-17

## Scope

This audit covers the non-`main` application/release line beginning at G37 and the stacked PR chain through PR #45.

## Verified GitHub state

- PR #38 — closed, unmerged; historical parent `feature/local-runtime`.
- PR #40 — closed, unmerged; G37A/C1/E1 evidence green.
- PR #41 — closed, unmerged; exact-head F-138 and Lex Runtime Validation green; G37C2 PASS.
- PR #42 — closed, unmerged; G37F PASS on exact head.
- PR #43 — closed, unmerged; G37B implementation present; exact-head F-138/runtime green; release closure still depends on G33D.
- PR #44 — closed, unmerged; G37D implementation present; exact-head F-138/runtime green; closure still depends on predecessor/G33D.
- PR #45 — current top-of-stack release-hardening PR.

All stack branches from `feature/local-runtime` through `codex/g37d-service-entitlement-2026-09-17` are ancestors of the PR #45 head. They are therefore superseded by the top branch for code-content purposes, but should only be deleted after the stack is integrated into its non-main parent and provenance is preserved.

## G37 gate status

- G37A — PASS.
- G37B — implementation present; release closure PENDING G33D installed-copy acceptance.
- G37C1 — PASS.
- G37C2 — PASS.
- G37D — implementation present; release closure PENDING G37B/G33D acceptance.
- G37E1 — PASS.
- G37E2 — OPEN; signed update transaction/staging/rollback is not evidenced as complete on the audited top.
- G37F — PASS.
- G37G — IN PROGRESS; repository/release closure follows successful integration and branch cleanup.

## Release-gate finding

Offline Windows workflow run `35158914005` failed while building the monolithic NSIS package with:

`Internal compiler error #12345: error mmapping file (...) is out of range.`

The complete private runtime (Node, Python/ML, OCR/NER models and corpus) exceeded the practical monolithic NSIS packaging boundary. Removing runtime components would invalidate the release-hardening scope.

## Remediation

The offline release is changed from one oversized executable to one downloadable **offline distribution artifact** containing:

1. a thin NSIS installer with the offline WebView2 prerequisite;
2. `LexMachina-Offline-Runtime.zip` containing the complete private runtime;
3. SHA-256 receipts and the component lock.

The NSIS hook detects the adjacent runtime archive, verifies its embedded receipt and SHA-256, verifies the component lock before installation, installs the bundled Visual C++ prerequisite when required, copies the full runtime locally, and runs the deterministic private-runtime self-test. CI blocks network during installed-copy acceptance.

This preserves the clean-machine/offline contract while avoiding the NSIS ~2 GB monolithic bundle failure.

## Merge/cleanup rule

No merge to `main`.

PR #45 may be merged into its non-main base only after exact-head F-138, Lex Runtime Validation, offline distribution acceptance and G33D online installer acceptance are green. Then the stack can be folded back through its non-main parent chain, after which ancestor branches with no unique commits become deletion candidates.

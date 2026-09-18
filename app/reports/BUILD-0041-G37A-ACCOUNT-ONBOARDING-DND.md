# BUILD-0041 — G37A Account Administration, Provider Onboarding and Conversation Drag-and-Drop

Date: 2026-09-16  
PR: #40  
Parent: `feature/local-runtime`  
Validated code SHA: `f4cb530e47b8af15d5a7320330939fcfc0054176`

## Status

**G37A — PASS**

## Implemented scope

### G31B2 regression repair

`LocalCaseAccessService.withCaseDataKey()` now separates:

- key-unwrapping failures -> `CASE_KEY_UNAVAILABLE` / 409;
- callback/business-validation failures -> preserved unchanged.

This restores the intended 422 stored-document validation response and keeps case-key zeroization in `finally`.

### ADMIN user lifecycle

Backend:

- list users;
- create ordinary USER;
- activate/deactivate USER;
- revoke all target sessions on status transition;
- auth epoch increment;
- safe hard delete.

Hard delete is blocked unless:

- target is not current ADMIN;
- target role is USER;
- target is already DISABLED;
- target owns no case;
- target has no case ACL;
- target is not referenced as ACL grantor.

Frontend:

- ADMIN-only user panel;
- user list;
- create user;
- deactivate/reactivate;
- delete eligible disabled user;
- actionable error messages.

### Provider onboarding

Provider configuration UI now links to the provider key-management surface:

- OpenAI;
- Claude Platform;
- xAI Console.

No API key value is returned to or stored by the browser.

### Conversation drag-and-drop

The conversation/query card accepts dropped files.

The dropped file is passed into the existing `DocumentPrivacyPanel` intake flow. This preserves the same local privacy/document pipeline as manual file selection.

Current G37A scope processes the first dropped file. Multi-file queue remains G37F.

## Validation

GitHub Actions — Lex Runtime Validation run `35095122173`: **SUCCESS**

Deterministic job:

- TypeScript strict typecheck — PASS;
- runtime/app unit tests — PASS;
- Python worker syntax — PASS;
- G1 — PASS;
- G3-G13 — PASS;
- G15-G29 — PASS;
- G31A — PASS;
- G31B — PASS;
- G32 — PASS;
- G34A-G34E — PASS;
- G34F1 — PASS;
- G35A/G35B — PASS;
- G31C1 — PASS;
- G36 — PASS;
- P4B — PASS;
- G34H1-H5 — PASS.

Runtime tests:

- **49/49 test files PASS**;
- **185/185 tests PASS**.

Web job:

- web tests: **1/1 file PASS**;
- web tests: **10/10 tests PASS**;
- production build — PASS;
- G14 browser-bundle safety — PASS.

Live probes:

- G17 API Sejm/ELI — PASS;
- G19 temporal freshness — PASS;
- G20 official PDF — PASS;
- G22 SN case-law — PASS.

F-138 structural audit run `35095122216`: **SUCCESS**.

## Security notes

G37A deliberately does not implement:

- an empty-password first ADMIN;
- a universal embedded service/developer password;
- plaintext/browser persistence of provider API keys;
- update-from-branch behavior.

Those items require the G37B-G37E security contracts described in `G37-ACCOUNT-ONBOARDING-SUPPORT-UPDATE-ROADMAP.md`.

## Remaining G37 work

- G37B — OS-vault-backed passwordless first-user bootstrap;
- G37C — provider API-key settings with OS keychain storage;
- G37D — signed temporary SERVICE support identity;
- G37E — signed GitHub Release updater;
- G37F — multi-file drag-and-drop completion;
- G37G — repository/release closure audit.

## Overall project blockers remain

G37A PASS does not mean secure desktop release PASS. Still open:

- G31B2 final functional closure/document UX;
- G31C2;
- G31D;
- G31E;
- full G34F;
- G34G;
- G33A-G33D;
- clean-machine release acceptance.

# BUILD-0040 — P4B Case Lifecycle

Status: **PASS**
Date: 2026-09-16

Validated implementation SHA:

`4a32f21f49de6d484bfdae3686c16437ebe3fb40`

Validation:
- Lex Runtime Validation `35092482078` — success
- F-138 structural audit `35092482105` — success
- strict TypeScript — success
- runtime unit/integration tests — success
- P4B_CASE_LIFECYCLE — PASS
- web unit tests/build/G14 bundle safety — success
- G17/G19/G20/G22 live probes — success

## Implemented lifecycle

OWNER/MANAGE case lifecycle now supports:
- rename;
- archive;
- unarchive;
- permanent application-level delete with current-password reauthentication.

Archive state is persisted in the local auth registry as `archived_at` and synchronized to `case.json`.

Archived cases:
- remain listed and readable;
- remain manageable by OWNER;
- reject WRITE / ANALYZE / REIDENTIFY with `CASE_ARCHIVED`;
- hide the document-upload/privacy work path in the web UI until restored.

Delete:
- requires OWNER access;
- requires fresh current-password verification through `AuthService.reauthenticate(..., "DELETE_CASE")`;
- wrong password preserves the case;
- removes the case directory before deleting the SQLite registration/ACL so an unexpected registry failure is retryable without leaving accessible case data;
- cascades case ACL after registry deletion;
- records a `case_deleted` security event;
- does not claim secure erase of SSD/flash blocks.

## Upgrade compatibility

Auth schema v4 adds nullable `archived_at` using a conditional SQLite migration.

A regression test starts from a pre-archive schema v3 case record, opens it with the current store, verifies the case is preserved, and then persists archive state successfully.

## UI

OWNER controls now include:
- `Zmień nazwę`;
- `Archiwizuj sprawę` / `Przywróć z archiwum`;
- destructive delete section requiring literal `USUŃ` plus current password.

The G14 browser bundle gate requires these controls and continues to reject browser secret/session persistence markers.

# Audit — G37 account lifecycle, onboarding, drag-and-drop and update readiness

Date: 2026-09-16  
Repository: `michaleiatrak-star/Lex-Machina`  
Parent development line: `feature/local-runtime`  
Audit branch: `codex/g37-admin-settings-dnd-updater-audit-2026-09-16`  
PR: #40

## 1. Baseline finding

The parent HEAD `b7da10b8121c8695a18747f5cfcd0d6c7c4e11c9` had:

- F-138 structural audit: PASS;
- Lex Runtime Validation: FAIL;
- TypeScript strict typecheck: PASS;
- unit tests: 182 PASS / 1 FAIL;
- failing test: `tests/g31b2-stored-processing.test.ts`;
- expected 422, observed 409.

Root cause:

`LocalCaseAccessService.withCaseDataKey()` wrapped the document-processing callback in the same catch block used for key-unwrapping failures. A legitimate `STORED_DOCUMENT_SIGNATURE_MISMATCH` thrown by the callback was therefore converted to `CASE_KEY_UNAVAILABLE` with HTTP 409.

## 2. G31B2 repair

Work branch changes separate:

- cryptographic/key-unwrapping failures -> fail closed as `CASE_KEY_UNAVAILABLE` 409;
- callback/business-validation failures -> propagate unchanged;
- case data key -> still zeroized in `finally`.

A regression test now requires callback errors to remain visible to the caller.

Status: **IMPLEMENTED — CI validation pending/currently running at audit time**.

## 3. User administration audit

### Baseline

Already present:

- roles: `ADMIN`, `USER`;
- first account -> ADMIN;
- admin API list users;
- admin API create USER;
- account password change;
- recovery code and recovery flow;
- persistent `ACTIVE/DISABLED` status in SQLite;
- auth epoch;
- session manager with per-user revocation.

Missing before G37:

- UI for account administration;
- status-changing API;
- explicit session revocation on admin disable;
- safe hard-delete contract;
- user deletion UI.

### G37A implementation

Added:

- `PATCH /api/admin/users/:userId/status`;
- `DELETE /api/admin/users/:userId`;
- React `AdminUsersPanel`;
- web API client operations.

Disable/reactivate:

- ADMIN only;
- current ADMIN cannot mutate itself through this flow;
- target ADMIN cannot be mutated through USER lifecycle;
- status change increments auth epoch;
- active sessions are revoked immediately;
- audit event recorded.

Hard delete:

- ADMIN only;
- self-delete blocked;
- ADMIN target blocked;
- target must be `DISABLED`;
- deletion blocked when target:
  - created any case;
  - owns/holds any `case_access` row;
  - remains `granted_by_user_id` for an ACL row;
- user crypto/recovery rows use existing ON DELETE CASCADE;
- audit event recorded.

This intentionally does not pretend that deleting an account with case access is safe. Existing case access must first be removed through the case-access lifecycle, which performs required key rotation.

## 4. Passwordless first ADMIN

Current code still requires a password.

Audit conclusion:

A literal empty-password ADMIN would weaken the existing UMK design and is not acceptable.

Safe implementation requires:

- OS-protected bootstrap wrapping secret;
- `PASSWORD_SETUP_PENDING` state;
- later rewrap of the same UMK under Argon2id-derived KEK;
- removal of bootstrap secret after password setup.

Dependency: production desktop/OS keychain boundary.  
Status: **NOT IMPLEMENTED — correctly deferred**.

## 5. SERVICE / developer highest rank

No universal service account exists in current code.

Audit conclusion:

A fixed highest-rank account with one universal embedded password would be a cross-installation backdoor.

G37 design therefore uses:

- future `SERVICE > ADMIN > USER` control-plane ordering;
- vendor/developer public verification key embedded in the app;
- signed, installation-bound, short-lived support entitlement;
- explicit local ADMIN approval;
- complete audit trail;
- no automatic cleartext case/reidentification access.

Status: **DESIGN COMPLETE — implementation waits for desktop trust boundary**.

## 6. Provider API key onboarding

Baseline:

- runtime resolver reads:
  - `OPENAI_API_KEY`;
  - `ANTHROPIC_API_KEY`;
  - `XAI_API_KEY`;
- browser sees only `configured: true|false`;
- no API key settings panel;
- no browser persistence.

G37A added direct provider-console links:

- OpenAI API keys;
- Claude Platform API key settings;
- xAI Console.

This improves discovery but does not yet persist keys inside Lex Machina.

Target persistent storage remains OS keychain/credential vault only.

Status: **PARTIAL PASS — onboarding link implemented, credential settings open**.

## 7. Drag-and-drop

Baseline scan of `app/lex-web/src` found no:

- `onDrop`;
- `onDragEnter`;
- `onDragOver`;
- `dataTransfer` handling.

G37A now adds drop handling to the conversation/query card.

Important security property:

The dropped `File` is passed to `DocumentPrivacyPanel.openFile()`; the application does not create a new bypass upload path.

Current limitation:

- first file only;
- multi-file queue not implemented.

Status: **IMPLEMENTED FOR SINGLE FILE — browser/build validation pending**.

## 8. Update mechanism

Existing G33 architecture already defines:

- component lock;
- SHA-256 verification;
- signed updater artifacts;
- staging;
- self-test;
- atomic switch;
- rollback.

Repository state at the start of G37:

- no production updater implementation;
- no published GitHub Releases available as a stable application channel;
- desktop/Tauri production boundary remains open.

Audit conclusion:

Do not implement “update from latest branch commit”. Update source must be immutable GitHub Releases with signed release metadata/artifacts.

Status: **DESIGN ONLY / BLOCKED BY G33D + G34G**.

## 9. Repository closure audit

Open PRs observed before G37:

- #38 — `feature/local-runtime`, draft;
- #39 — DR-09 module-count correction;
- #17 — old F-108 line, still open and non-mergeable;
- #40 — G37 work branch (this audit).

Branch comparison found:

- many old `codex/*` branches are behind `main` with `ahead=0`: likely cleanup candidates;
- several historical branches are diverged and must be inspected before deletion;
- `feature/local-runtime` is the active application line and remains far ahead of `main`.

Status: **REPOSITORY NOT YET CLOSED**.

## 10. Release blockers after G37A

Even if G37A becomes fully green, the secure desktop release still has open work:

- G31B2 final stored-file/member processing closure;
- G31C2 typed authoring AST/generation aliases;
- G31D DOCX;
- G31E ODT;
- full G34F deanonymization/export transaction;
- G34G Tauri production trust boundary;
- G33 installer/update execution;
- provider secret-store settings;
- passwordless bootstrap through OS credential storage;
- signed SERVICE support sessions;
- clean-machine acceptance;
- repository/PR/branch cleanup.

## 11. Audit verdict rules

G37A can be marked PASS only after the exact implementation SHA has:

- Lex Runtime Validation success;
- F-138 structural audit success;
- runtime unit tests success;
- web unit tests success;
- production web build success;
- G14 success;
- live probes that are part of the parent workflow success.

Until then the work is **implemented but not validated**.

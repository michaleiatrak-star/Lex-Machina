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

Status: **PASS** — validated at code SHA `f4cb530e47b8af15d5a7320330939fcfc0054176`.

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

### Baseline

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

### G37C1 implementation and validation

G37C1 is now **PASS** at code SHA `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`.

Added:
- memory-only backend credential overlay;
- ADMIN-only set/delete credential endpoints;
- environment fallback remains supported;
- zeroization on replace, clear and server shutdown;
- UI editor stores no key in browser persistence;
- API never echoes the key.

Persistent user-selected storage remains G37C2 and is blocked on OS credential-vault integration.

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

Status: **PASS FOR SINGLE-FILE G37A SCOPE** — web tests, production build and G14 passed.

## 8. Update mechanism

### Existing architecture

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

### G37E1 implementation and validation

G37E1 is **PASS** at code SHA `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`.

Implemented:
- read-only GitHub Releases discovery;
- strict semver;
- draft/prerelease filtering;
- repository-bound trusted release URLs;
- `NO_RELEASE / UP_TO_DATE / AVAILABLE / UNAVAILABLE` state;
- non-blocking UI status and manual refresh;
- no download or installation side effect.

G37E2 remains **OPEN / BLOCKED BY G33D + G34G** for signed metadata/artifacts, staging, self-test, atomic switch and rollback.

## 9. Repository closure audit

Open PRs observed before G37:

- #38 — `feature/local-runtime`, draft;
- #39 — DR-09 module-count correction;
- #17 — old F-108 line, still open and non-mergeable;
- #40 — G37 work branch (this audit).

During G37:
- PR #39 was verified as byte-identical to the DR-09 file already carried by `feature/local-runtime`;
- its F-138 workflow was green;
- PR #39 was squash-merged into `main` as `54a696638fb58789e66c417f79219237004f75c1`;
- PR #17 remains open because its historical branch still contains unique commits; later `main` contains its key F-86/F-108 module artifacts but not an exact preservation of the old T18 workflow, so it is not deleted automatically.

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

## 11. Validation verdict

G37A is **PASS** at validated code SHA `f4cb530e47b8af15d5a7320330939fcfc0054176`.

Evidence:

- Lex Runtime Validation `35095122173` — SUCCESS;
- F-138 structural audit `35095122216` — SUCCESS;
- runtime unit tests — 49/49 files, 185/185 tests PASS;
- web unit tests — 1/1 file, 10/10 tests PASS;
- production web build — PASS;
- G14 — PASS;
- G17 live ELI — PASS;
- G19 live temporal freshness — PASS;
- G20 official PDF — PASS;
- G22 live SN — PASS.

This verdict applies only to G37A and the previously validated gates exercised by the workflow. It does not close G37B-G37G or the still-open desktop release gates.


## 12. G37C1 + G37E1 validation

Validated code SHA: `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`.

- Lex Runtime Validation `35096139283` — SUCCESS;
- F-138 structural audit `35096139253` — SUCCESS;
- runtime: 50/50 test files, 192/192 tests PASS;
- web: 1/1 test file, 12/12 tests PASS;
- production build — PASS;
- G14 — PASS;
- G17/G19/G20/G22 live probes — PASS.

Diff audit against `feature/local-runtime` confirms G37 changes are limited to `app/` runtime/web/version/reports. The legal corpus under `Wersja rozwojowa rozpakowana` is unchanged by G37.

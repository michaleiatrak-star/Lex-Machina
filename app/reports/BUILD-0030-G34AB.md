# Build 0030 — G34A/G34B Local Identity + Login/Session Foundation

Status: **PASS — G34A LOCAL ACCOUNT BOOTSTRAP + G34B LOGIN/SESSION BOUNDARY**  
Date: 2026-09-16

## Validated code

Validated code SHA:

`b3783309189a6d043fc077e52c736e16b64c10d5`

Validation:

- Lex Runtime Validation `35069444351` — **success**
- F-138 structural audit `35069444331` — **success**
- deterministic G1-G29 + G31A/G31B + G32 + G34A/G34B job — **success**
- G14 web unit tests / production build / browser bundle safety — **success**
- G17 live official-source probe — **success**
- G19 live temporal freshness — **success**
- G20 live official PDF — **success**
- G22 live SN case-law — **success**

Subsequent documentation commits are not included in the validated code SHA above.

---

## 1. G34A — local account bootstrap

Implemented:

- persistent local auth database under the Lex data root;
- first-run zero-user bootstrap;
- exactly one first bootstrap account;
- first account is local `ADMIN`;
- opaque random `user_<128-bit>` identity;
- user password is never stored;
- random 256-bit User Master Key (UMK);
- password-derived Key Encryption Key using Argon2id;
- UMK stored only as an AES-256-GCM authenticated envelope;
- atomic first-user creation with `BEGIN IMMEDIATE`;
- first-user bootstrap closes permanently after the first account exists;
- persistent non-secret security audit events.

Production KDF policy currently configured as:
- Argon2id;
- 64 MiB memory;
- 3 passes;
- parallelism 1;
- 32-byte derived key.

Node runtime requirement is now `>=24.7.0`, allowing the runtime to use the built-in Node Argon2 and `node:sqlite` implementations without adding a separate native Argon2 npm package.

The deterministic CI tests inject a deliberately smaller KDF cost only to keep validation bounded; they do not change the production default.

---

## 2. Auth persistence

New runtime components:

- `src/auth/types.ts`
- `src/auth/crypto.ts`
- `src/auth/store.ts`
- `src/auth/session-manager.ts`
- `src/auth/service.ts`

Local auth state:

```text
<LEX_DATA_DIR or ~/.lex-machina/data>/
  auth/
    auth.sqlite
    rate-limit.key
```

The database stores:
- user identity/public profile;
- account status and `authEpoch`;
- per-user Argon2id parameters/salt;
- encrypted UMK envelope;
- persistent login throttling state;
- sanitized security events.

It does **not** store:
- plaintext passwords;
- password-derived KEKs;
- plaintext UMKs;
- session bearer tokens;
- case keys;
- privacy-vault clear values.

`rate-limit.key` is currently an installation-local random HMAC key with restrictive filesystem permissions where supported. Moving small installation/account secrets behind the production Tauri/OS secret boundary remains part of G34G; this build does not claim OS-keychain protection for that file.

---

## 3. G34B — login/session boundary

Implemented production API boundary:

Public:
- `GET /health`;
- `GET /api/auth/status`;
- `POST /api/auth/bootstrap`;
- `POST /api/auth/login`;
- idempotent `POST /api/auth/logout`.

When the production auth service is wired, every other `/api/*` operation requires a valid local session.

Authenticated:
- `GET /api/auth/me`;
- `POST /api/auth/lock`;
- all existing Lex routes/models/case/document/provider/session endpoints.

G13 was updated so the localhost API validation now bootstraps an isolated local account and proves that private endpoints require authentication before probing them.

---

## 4. Login privacy / user enumeration defense

Login behavior:
- login name is normalized with NFKC and a fixed local rule;
- persistent throttling key is `HMAC-SHA256(AuthRateKey, normalizedLogin)`;
- guessed/nonexistent login strings are not persisted directly in rate-limit rows;
- a nonexistent account executes a dummy Argon2id verification path in the same cost class;
- disabled account and invalid password follow the same outward credential-failure contract;
- UI uses a generic invalid-credentials message.

Password verification input is bounded:
- accepted password length max is 128 Unicode code points;
- overlong input cannot authenticate and is replaced by a fixed bounded KDF input for the failure path;
- Argon2 execution has bounded concurrency and queue depth;
- overload fails closed with `AUTH_BUSY`.

---

## 5. Persistent failed-attempt backoff

Implemented exact G34B schedule:

| consecutive failures | minimum next attempt |
|---:|---:|
| 1-4 | no added account delay |
| 5 | 30 seconds |
| 6 | 60 seconds |
| 7 | 2 minutes |
| 8 | 5 minutes |
| 9 | 15 minutes |
| 10+ | 30 minutes |

Properties:
- state survives application restart;
- successful login clears the counter;
- 24 hours without another failure resets the sequence;
- requests during active backoff do not execute another Argon2id calculation;
- the application does not use permanent password-only automatic lockout.

---

## 6. Session model

Session secret:
- CSPRNG 256-bit opaque value;
- returned only to the current development/browser client;
- server retains lookup by SHA-256 digest, not the raw bearer;
- never persisted;
- process restart invalidates every session.

Session policy:
- idle timeout: 15 minutes;
- overall timeout: 8 hours;
- ordinary deliberate non-GET application actions refresh idle only;
- GET polling such as `/api/auth/me` does not refresh idle;
- timer-based runtime expiry removes stale sessions even without a subsequent request.

On revocation:
- session record is deleted;
- in-memory UMK copy is overwritten with zero bytes where the runtime allows;
- lock/logout/expiry produce sanitized security events without bearer/key/PII data.

`authEpoch` is checked on every authenticated request and invalidates a session if the user's account epoch changed.

---

## 7. Browser/UI boundary

Added `AuthApp.tsx` in front of the existing React workbench.

Flows:
- first start → `Utwórz konto właściciela`;
- later start → login;
- authenticated → existing Lex workbench;
- manual lock → locked login view;
- logout → normal login view.

Security behavior:
- reusable bearer exists only in module memory;
- no `localStorage`;
- no `sessionStorage`;
- no IndexedDB session persistence;
- lock/logout clear the in-memory bearer even if the network request fails;
- authenticated workbench is unmounted on lock/expiry, which removes raw OCR/privacy/query/result component state instead of visually hiding it;
- 401 from an authenticated request centrally clears the client session and returns to LOCKED;
- password field is cleared after authentication attempts.

The browser bundle validator now blocks storage API markers and requires the G34A/G34B authentication endpoints/UI markers.

This is still a transitional browser boundary. G34G remains required so the final Tauri production React process does not receive a reusable backend bearer at all.

---

## 8. Tests and validators

New tests cover:
- zero-user bootstrap;
- first account ADMIN;
- second bootstrap rejected;
- password absent from SQLite file bytes;
- encrypted UMK survives process restart;
- session does not survive restart;
- persistent failed-attempt backoff;
- successful login after backoff expiry;
- idle expiry;
- overall expiry despite activity;
- `authEpoch` session revocation;
- generic unknown-login credential failure;
- private HTTP routes blocked without auth;
- authenticated route access;
- logout invalidation;
- idempotent logout;
- in-memory web bearer propagation;
- no browser persistent-storage session mechanism.

New deterministic validators:
- `G34A_LOCAL_ACCOUNT_BOOTSTRAP: PASS`;
- `G34B_LOGIN_SESSION: PASS`.

---

## 9. Explicitly not implemented in Build 0030

G34 as a whole is **not PASS**.

Still open:
- G34C — case ownership/ACL;
- G34D — independent per-case data keys and per-user key envelopes;
- additional user-account creation/management;
- G31C1 — encrypted persistent privacy vault;
- G34E — recovery and password lifecycle;
- G34F — transaction-bound reauthorization before deanonymization;
- G34G — Tauri/OS production secret/session boundary;
- G34H — encryption at rest for original uploads, ZIP members, OCR/raw state and sensitive artifacts;
- G31C2 — typed authoring AST/generation aliases;
- G31D — DOCX;
- G31E — ODT;
- G33 — installer execution;
- G30 — Open Web Discovery.

Important limitations:
- current G31A original uploads and extracted ZIP members remain plaintext local files;
- the current privacy re-identification vault remains process-memory-only;
- existing React workbench still creates a fresh case when it mounts; case registry/reopen is a later phase;
- the production browser transition still uses an in-memory Bearer; G34G moves this secret out of React;
- only the first local ADMIN bootstrap exists in this batch; full multi-user account management begins in the next authorization/key-ownership work.

---

## 10. Next batch

Next implementation batch:

**Batch B — G34C/G34D Case Authorization + Key Ownership**

Planned order:
1. case ownership migration contract;
2. case ACL store/service;
3. OWNER/EDITOR/ANALYST/VIEWER + `canReidentify`;
4. independent random Case Data Key per case;
5. per-user authenticated CDK envelopes;
6. user/keypair foundation needed for offline case sharing;
7. ACL middleware on every case/document/artifact operation;
8. authenticated case list/open API;
9. replace auto-create-on-mount with explicit case selection after the authorization model is ready;
10. deterministic G34C/G34D validation and full regression.

# G34B/G34F — Authentication, Session, Lockout and Deanonymization Reauthorization Protocol

Status: **PARTIALLY IMPLEMENTED — G34B + G34E + G34F1 PASS; FULL G34F/G34G OPEN**  
Date: 2026-09-16

This document is normative for the local multi-user Lex Machina runtime. G34B login/session and G34E recovery/password lifecycle are implemented and validated; G34F1 transaction-bound reauthorization foundation is implemented and validated. Full G34F remains open until real DOCX/ODT deanonymization/export consumes the grant with no bypass path, and G34G remains open until the Tauri production boundary exists.

The policy is intentionally stricter than generic low-risk web defaults because Lex Machina processes sensitive legal files.

---

## 1. Security invariants

1. No non-public API or privileged desktop command executes without a valid authenticated session.
2. Session validity is decided only by the trusted runtime/Rust boundary, never by a React timer.
3. A locked UI has **no valid session** and no unlocked UMK/CDK/vault state.
4. Session secrets are non-persistent and never survive application restart.
5. Logout, idle timeout, OS workstation lock and account disable immediately revoke authorization.
6. Background polling, streaming, OCR progress and animations never keep a session alive.
7. An ACTIVE session alone is insufficient for deanonymization.
8. Every deanonymization requires a transaction-bound password reauthorization for exact case/artifact content.
9. Passwords, UMK/CDK/PVK, vault plaintext and clear PII never enter provider context.
10. Provider calls are forbidden after the deanonymization grant is consumed and vault unlock begins.

---

## 2. State machine

```text
NO_SESSION
   |
   | successful full login
   v
ACTIVE ------------------------------+
   |                                  |
   | idle timeout / user lock /       | logout / account disabled /
   | workstation lock / suspend       | unrecoverable security event
   v                                  v
LOCKED                            NO_SESSION
   |
   | full password authentication
   v
ACTIVE
```

`IDLE_WARNING` is UI-only. The trusted runtime remains ACTIVE until the real deadline.

LOCKED is not a weaker session. It retains:
- no accepted session bearer/handle;
- no UMK;
- no unwrapped CDK;
- no decrypted vault;
- no step-up grant.

The desktop shell may retain only a non-secret last-user/display-name hint.

---

## 3. Session record

```ts
type AuthenticatedSession = {
  sessionId: string;
  userId: string;
  authEpoch: number;
  createdAt: string;
  lastUserActivityAt: string;
  lastFullAuthenticationAt: string;
  idleExpiresAt: string;
  overallExpiresAt: string;
  status: "ACTIVE" | "REVOKED";
  userMasterKey: SecretBuffer;
};
```

Production Tauri mode:
- React receives no reusable backend session secret;
- Rust/Tauri owns the session and invokes typed privileged operations.

Development HTTP mode only:
- login may return a CSPRNG 256-bit opaque bearer;
- bearer is process-memory only;
- no localStorage/sessionStorage/IndexedDB/file persistence;
- bearer never appears in logs;
- server should retain only a digest for lookup where practical.

---

## 4. Initial timing policy

| Parameter | Policy |
|---|---:|
| idle timeout | 15 minutes |
| idle warning | 2 minutes before expiry |
| overall timeout | 8 hours from last full authentication/reauthentication |
| overall warning | 5 minutes before expiry |
| deanonymization intent | 5 minutes |
| deanonymization grant | 90 seconds |
| immediate sensitive download ticket | 60 seconds, one use |

Successful full password reauthentication resets idle and overall deadlines.

Ordinary deliberate user activity resets idle only.

Background work never resets either deadline.

These values are Lex policy choices, not values claimed to be mandated by NIST/OWASP.

---

## 5. Activity that resets idle timeout

Qualifying:
- opening/selecting a case;
- saving privacy review;
- explicit user analysis/generation command;
- editing case data;
- explicit `Kontynuuj sesję` before expiry.

Non-qualifying:
- `/health`;
- provider/model status polling;
- progress polling;
- model stream chunks;
- OCR/NER progress;
- automatic retries;
- animations;
- background jobs;
- passive filesystem watchers;
- keepalive/heartbeat calls.

Long local encrypted jobs may finish after lock, but result remains inaccessible until a new authenticated session.

External-provider calls should be cancelled on lock/logout when cancellation is available; no further case content may be attached under a revoked session.

---

# LOGIN

## 6. Request

Conceptual development API:

```http
POST /api/auth/login

{
  "loginName": "...",
  "password": "..."
}
```

In production the password is passed through a typed Tauri/Rust command and is never persisted by React.

Password may only travel as request/IPC body data, never query string, URL path, log field or analytics event.

---

## 7. Login-name rate key

Normalize login using the fixed G34 normalization rule, then compute:

`loginTag = HMAC-SHA256(AuthRateKey, normalizedLoginName)`

`AuthRateKey` is an installation-local protected secret.

Failed-attempt state is indexed by `loginTag`, including for nonexistent login names. This avoids storing guessed usernames in plaintext and makes outward throttling behavior equivalent for existing/nonexistent accounts.

---

## 8. Login verification sequence

1. normalize login;
2. compute `loginTag`;
3. load persistent backoff state;
4. if `retryAfter > now`, return throttled result without another Argon2 calculation;
5. load real account if present;
6. if absent, use a synthetic account with current Argon2id policy and dummy authenticated envelope;
7. execute Argon2id on both paths;
8. attempt authenticated UMK-envelope open;
9. validate ACTIVE status through an outwardly indistinguishable failure path;
10. on failure: increment throttling state and audit a generic failure;
11. on success:
   - reset failure state;
   - optionally upgrade KDF/rewrap UMK;
   - create a fresh session;
   - set idle/overall deadlines;
   - update lastLoginAt;
   - emit `login_success`.

Unauthenticated UI credential error:

`Nieprawidłowa nazwa użytkownika lub hasło.`

Do not disclose whether the account:
- exists;
- is disabled;
- has a wrong password.

---

# FAILED ATTEMPTS / TEMPORARY LOCK

## 9. No permanent automatic password lockout

Lex uses increasing temporary backoff, not permanent automatic lockout, because permanent password-only lockout creates an easy denial-of-service mechanism.

The retry deadline persists across application restart.

Password recovery has an independent cryptographic path and is not disabled merely because password attempts are delayed.

---

## 10. Backoff schedule

| Consecutive failed attempts | Earliest next attempt |
|---:|---:|
| 1-4 | no additional account delay |
| 5 | +30 seconds |
| 6 | +60 seconds |
| 7 | +2 minutes |
| 8 | +5 minutes |
| 9 | +15 minutes |
| 10+ | +30 minutes |

Rules:
- successful full login resets count to zero;
- 24 hours without another failed attempt resets count to zero;
- after a delay expires, another failure increments the count;
- requests during an active delay do not repeatedly run Argon2id;
- requests during an active delay do not extend the lock just by being spammed;
- password failures alone never cause an irreversible/permanent lock.

Outward backoff behavior is the same for real and nonexistent `loginTag` values.

---

## 11. Argon2 local CPU control

Because Argon2id is intentionally expensive:
- authentication execution has bounded concurrency;
- duplicate login-button submissions are rejected/coalesced while one attempt is pending;
- no unbounded worker/thread/process pool;
- nonexistent-account verification is still in the same cost class as a valid-account attempt.

---

## 12. Backoff UI

Generic message:

`Zbyt wiele nieudanych prób. Kolejna próba będzie możliwa za chwilę.`

A countdown may display trusted `retryAfter`, but backend/runtime time remains authoritative.

Audit:
- `login_failure`;
- `login_backoff_started`;
- never password;
- never plaintext guessed unknown login.

---

# ACTIVE SESSION AND EXPIRY

## 13. Validation before every privileged operation

Trusted runtime checks, in order:

1. session exists;
2. session status ACTIVE;
3. user account still ACTIVE;
4. session authEpoch equals account authEpoch;
5. current time < idleExpiresAt;
6. current time < overallExpiresAt;
7. endpoint/command permission;
8. case ACL, if a case is referenced.

If 3-6 fail, revoke before returning.

HTTP transition semantics:
- `401 AUTHENTICATION_REQUIRED` for missing/expired/revoked session;
- `403 FORBIDDEN` only for a valid identity lacking authorization.

---

## 14. Idle warning

At two minutes remaining:

`Sesja zostanie zablokowana z powodu braku aktywności.`

Buttons:
- `Kontynuuj` — deliberate authenticated action, resets idle only if not expired;
- `Zablokuj teraz` — executes lock protocol.

Closing the warning without deliberate continuation does not extend the session.

Client countdown is informational. Trusted runtime deadline wins.

---

## 15. Idle expiration

At 15 minutes without qualifying user activity:

1. mark/revoke session;
2. revoke all reauth intents/grants/download tickets;
3. signal sensitive-operation cancellation;
4. zero UMK and cached/unwrapped CDKs where runtime allows;
5. remove decrypted vault caches;
6. emit `session_locked`, reason `IDLE_TIMEOUT`;
7. instruct UI to scrub sensitive state;
8. transition to LOCKED.

The old session can never be revived. Unlock is a new full login.

---

## 16. Overall expiration

At eight hours since last full login or full password reauthentication:
- revoke exactly as above;
- reason `OVERALL_TIMEOUT`;
- require full password authentication.

Ordinary activity never extends this deadline.

A successful password-based step-up reauthorization is itself a full authentication and may reset idle/overall deadlines.

---

## 17. OS/app lifecycle

- confirmed workstation lock -> immediate Lex LOCKED;
- suspend/hibernate -> mark for lock; reauthenticate on resume;
- uncertain resume state -> fail safe to LOCKED;
- application process close destroys sessions;
- process restart never resumes a session.

---

# EXPLICIT LOCK

## 18. User lock protocol

Conceptual call:

`POST /api/auth/lock`

Order:

1. locate current session;
2. revoke it **before response**;
3. revoke intents/grants/download tickets;
4. cancel sensitive in-flight operations;
5. zero UMK/CDK/vault plaintext caches;
6. delete active session entry;
7. audit `session_locked` reason `USER_LOCK`;
8. return success;
9. UI destroys sensitive state and renders LOCKED.

Unlock uses normal full login and creates a different session.

---

# LOGOUT

## 19. Logout protocol

Conceptual call:

`POST /api/auth/logout`

Order:

1. revoke trusted-runtime session first;
2. revoke all reauth intents/grants/download tickets;
3. cancel sensitive in-flight operations;
4. zero UMK/CDK/vault plaintext caches;
5. clear in-memory case handles;
6. emit `logout`;
7. scrub UI sensitive state;
8. clear last-user hint if policy says logout rather than lock;
9. render login/user-selection screen.

Logout is idempotent.

If the UI dies without calling logout, idle/overall expiry and process teardown remain sufficient to invalidate the session.

---

## 20. Jobs on lock/logout

### External AI
- cancel if supported;
- stop rendering output;
- attach no new case data;
- never cross into deanonymization/export.

### Local OCR/indexing
May complete only under an internal job identity with output retained in the encrypted case store. Result stays inaccessible until authentication + ACL.

### Deanonymization
Uses stricter cancellation rules below.

---

# REAUTHORIZATION BEFORE DEANONYMIZATION

## 21. Active login is insufficient

Deanonymization converts a tokenized/provider-safe artifact into clear personal data. It is a high-risk transaction.

Every deanonymization therefore requires password confirmation bound to the exact transaction target.

There is no generic five-minute global "PII unlocked" mode.

---

## 22. Create immutable intent

Conceptual call:

`POST /api/cases/:caseId/artifacts/:artifactId/deanonymization-intents`

Preconditions:
- ACTIVE session;
- case access;
- `canReidentify = true`;
- artifact belongs to case;
- state `TOKENIZED_VALIDATED`;
- token gate B PASS;
- tokenized bytes closed and SHA-256 known.

```ts
type DeanonymizationIntent = {
  intentId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  artifactFormat: "docx" | "odt";
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  purpose: "DEANONYMIZE_AND_EXPORT";
  createdAt: string;
  expiresAt: string; // +5 minutes
  status:
    | "PENDING"
    | "AUTHORIZED"
    | "CONSUMED"
    | "REVOKED"
    | "EXPIRED";
};
```

UI must show:
- case display name;
- output filename;
- format;
- clear statement that personal data will be restored locally.

---

## 23. Password reauthorization

Conceptual call:

```http
POST /api/auth/reauthorize

{
  "intentId": "intent_...",
  "password": "..."
}
```

Runtime sequence:

1. current session ACTIVE;
2. intent belongs to the same session + user;
3. intent PENDING and not expired;
4. account ACTIVE and authEpoch unchanged;
5. current ACL still allows access;
6. `canReidentify = true`;
7. re-read tokenized artifact hash; exact match required;
8. case key version unchanged;
9. vault generation unchanged;
10. execute normal Argon2id/UMK verification;
11. wrong password enters the same login/backoff mechanism;
12. success:
   - reset failed-password state;
   - set lastFullAuthenticationAt=now;
   - reset idle/overall deadlines;
   - create a server-side one-use grant;
   - mark intent AUTHORIZED;
   - audit `reauth_success`.

No vault decryption occurs during this step.

---

## 24. One-use grant

```ts
type DeanonymizationGrant = {
  grantId: string;
  intentId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  purpose: "DEANONYMIZE_AND_EXPORT";
  issuedAt: string;
  expiresAt: string; // +90 seconds
  remainingUses: 1;
};
```

Grant is:
- trusted-runtime only;
- not persisted;
- session-bound;
- user-bound;
- purpose-bound;
- exact artifact-hash-bound;
- exact vault/key generation-bound;
- one use.

Production React does not receive a reusable authorization secret.

---

## 25. Failed reauthorization

Wrong password:
- no vault read/decryption;
- intent may remain PENDING only until its five-minute expiry;
- increment the same login failure/backoff counter;
- backoff blocks further login/reauth attempts until `retryAfter`;
- generic error only.

If the session locks/expires while the password dialog is open:
- intent is revoked;
- submitted password cannot authorize a newly-created implicit session;
- UI returns to LOCKED/login.

---

# DEANONYMIZATION EXECUTION

## 26. Checks immediately before use

Require:
- session ACTIVE;
- grant unexpired;
- remainingUses=1;
- account ACTIVE;
- ACL + `canReidentify` still valid;
- artifact still exists;
- SHA-256 unchanged;
- vaultGeneration unchanged;
- caseKeyVersion unchanged;
- token gate B still PASS;
- output path inside case artifact workspace.

Any mismatch revokes grant and requires new intent + password reauthorization.

---

## 27. Consumption boundary

After all non-secret checks pass and immediately before vault/CDK unlock:

1. atomically set `remainingUses=0`;
2. mark intent CONSUMED;
3. audit `reidentification_started`;
4. set operation flag `providerCallsForbidden=true`;
5. unwrap CDK into operation-local secret memory;
6. derive privacy vault key;
7. decrypt exact vault generation;
8. begin file-to-file deanonymization.

A consumed grant is never restored after an error.

Any retry after consumption requires a new password reauthorization.

---

## 28. Local file transform

```text
tokenized.docx|odt
      ↓
trusted local XML/package transformation
      ↓
final.partial
      ↓
reopen + token gate C + package validation + final legal/export gate
      ↓
encrypted artifact store / final artifact
```

Never modify tokenized input in place.

Never persist an unpacked directory tree of clear OOXML/ODF XML.

No provider request is permitted after grant consumption.

---

## 29. Session revocation during deanonymization

The operation owns a cancellation token linked to its session.

If revocation occurs before atomic publication:

1. stop at the next safe cancellation point;
2. close package/worker handles;
3. delete or quarantine `final.partial`;
4. do not set DOWNLOADABLE;
5. clear CDK/PVK/vault plaintext buffers;
6. audit `reidentification_aborted`, reason `SESSION_REVOKED`;
7. require new login + new reauthorization.

If the final validated artifact was atomically committed before revocation:
- never expose it to the revoked session;
- retain it only according to G34H encrypted-at-rest policy;
- future access requires authentication, ACL and a new sensitive-operation authorization.

---

## 30. Completion and immediate download

On PASS:

1. token gate C PASS;
2. structural validation PASS;
3. final legal/export gate PASS;
4. hash exact final bytes;
5. atomically commit artifact;
6. clear operation CDK/PVK/vault plaintext;
7. audit `reidentification_completed`;
8. create a same-session immediate download ticket.

```ts
type SensitiveDownloadTicket = {
  ticketId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  finalSha256: string;
  expiresAt: string; // +60 seconds
  remainingUses: 1;
};
```

This permits the just-authorized result to be downloaded once without asking for the password again immediately.

After ticket use/expiry, any later open/download/export of an artifact containing clear PII requires a new transaction reauthorization.

---

# SECURITY EVENTS

## 31. authEpoch

Every user has an integer `authEpoch`.

Increment it on:
- password change;
- recovery completion;
- account disable/re-enable;
- administrator force-revoke;
- account key reset.

Sessions store the epoch seen at login.

Mismatch invalidates a session at the next trusted call, while the local runtime should also eagerly revoke that user's live sessions.

---

## 32. Password change

- requires current password / sensitive authorization;
- rewraps the same UMK;
- increments authEpoch;
- revokes all other sessions;
- revokes all deanonymization intents/grants;
- may establish one fresh replacement session for the current flow after successful commit.

---

## 33. Recovery

Successful recovery:
- unwraps UMK with recovery mechanism;
- writes new password envelope;
- increments authEpoch;
- revokes every session/grant;
- resets failed-login/backoff state;
- rotates/invalidates recovery material according to G34 recovery policy.

Recovery does not bypass case ACL or `canReidentify`.

---

# AUDIT

## 34. Required events

Record:
- `login_success`;
- `login_failure`;
- `login_backoff_started`;
- `session_locked` + reason;
- `session_expired` + reason;
- `logout`;
- `reauth_started`;
- `reauth_failure`;
- `reauth_success`;
- `reauth_grant_expired`;
- `reidentification_started`;
- `reidentification_aborted`;
- `reidentification_completed`;
- `sensitive_download`.

Never log:
- password;
- session bearer;
- usable grant secret;
- UMK/CDK/PVK;
- vault plaintext;
- clear PII;
- token-to-value map.

Permitted references:
- userId;
- caseId;
- artifactId;
- intentId;
- non-secret reason/result codes.

---

# UI RULES

## 35. Login
- disable duplicate submit during Argon2 verification;
- clear password field after failed attempt;
- generic error wording;
- show trusted retry countdown;
- no raw backend auth exception by default.

## 36. Active session
- `Zablokuj` always visible;
- `Wyloguj` always available;
- show two-minute idle warning;
- passive/background activity cannot dismiss it.

## 37. Locked state
Remove, not merely hide/blur:
- raw OCR/source text;
- privacy selections;
- sensitive previews;
- deanonymized document preview;
- object/download URLs;
- case crypto state.

## 38. Deanonymization dialog

Show before password:
- case;
- exact output artifact filename;
- DOCX/ODT format;
- `Dane osobowe zostaną przywrócone wyłącznie lokalnie.`;
- `Po rozpoczęciu tej operacji dokument nie jest wysyłany do dostawcy AI.`

Action:
- `Autoryzuj i przywróć dane`.

Password is cleared from component/input state after the call returns.

---

# STABLE RESULT CODES

## 39. Authentication
- `AUTHENTICATION_REQUIRED`
- `INVALID_CREDENTIALS`
- `AUTH_BACKOFF_ACTIVE`
- `ACCOUNT_UNAVAILABLE`
- `SESSION_IDLE_EXPIRED`
- `SESSION_OVERALL_EXPIRED`
- `SESSION_REVOKED`

## 40. Authorization
- `FORBIDDEN`
- `CASE_ACCESS_REQUIRED`
- `REIDENTIFICATION_PERMISSION_REQUIRED`

## 41. Reauthorization
- `REAUTH_INTENT_EXPIRED`
- `REAUTH_INTENT_MISMATCH`
- `REAUTH_REQUIRED`
- `REAUTH_GRANT_EXPIRED`
- `REAUTH_GRANT_CONSUMED`
- `REAUTH_TARGET_CHANGED`

## 42. Deanonymization
- `TOKEN_GATE_B_FAILED`
- `VAULT_GENERATION_CHANGED`
- `CASE_KEY_VERSION_CHANGED`
- `DEANONYMIZATION_ABORTED`
- `TOKEN_GATE_C_FAILED`
- `FINAL_ARTIFACT_NOT_DOWNLOADABLE`

Unauthenticated UI must not use outwardly distinct codes/messages that reveal whether a login exists.

---

# PASS CRITERIA

## 43. G34B login/session

Tests must prove:
1. correct password creates a fresh session;
2. wrong password does not;
3. nonexistent login executes comparable dummy-KDF path;
4. disabled account does not disclose its existence;
5. session handle changes on each login;
6. no session survives restart;
7. idle expiry is trusted-runtime enforced;
8. background events do not reset idle;
9. deliberate activity resets idle;
10. overall timeout occurs despite activity;
11. lock revokes before UI acknowledgment;
12. logout is idempotent;
13. authEpoch change revokes old sessions;
14. OS-lock integration revokes where supported;
15. sensitive UI state is removed on lock/logout.

## 44. Failed-attempt protection

Tests must prove:
1. attempts 5-10+ produce the defined backoff;
2. retryAfter persists across restart;
3. spam during delay does not extend it indefinitely;
4. existing/nonexistent loginTags have equivalent outward behavior;
5. success resets failure count;
6. 24h quiet period resets count;
7. no permanent password-only lockout;
8. Argon concurrency is bounded;
9. recovery remains independently available.

## 45. G34F deanonymization reauthorization

Tests must prove:
1. ACTIVE session alone cannot deanonymize;
2. user without `canReidentify` cannot create intent;
3. intent expires after five minutes;
4. wrong password never authorizes;
5. password success creates exact scoped grant;
6. grant expires after 90 seconds;
7. grant is single-use;
8. grant from another session/user fails;
9. artifact hash change invalidates grant;
10. vault generation change invalidates grant;
11. case key version change invalidates grant;
12. grant is consumed before vault unlock;
13. provider call is impossible after consumption;
14. session revocation during transform prevents publication/download;
15. operation clears secrets after completion/failure;
16. immediate ticket is same-session, one-use, 60 seconds;
17. later access to clear artifact requires fresh reauthorization;
18. audit contains no PII/credentials/keys.

---

## 46. Standards alignment

Design basis:
- NIST SP 800-63B session model: authenticated sessions have inactivity and overall timeouts; expiration is verifier/relying-party enforced; successful reauthentication can re-establish/reset session timing.
- OWASP Session Management: idle and absolute expiration must be enforced server-side; logout/expiry must invalidate server-side state.
- OWASP Authentication: sensitive/high-risk actions should require reauthentication; login throttling should be associated with identity rather than relying solely on source IP; lockout design must account for denial-of-service risk.

Lex-specific timeout/backoff/grant constants above are application policy choices and require implementation tests.

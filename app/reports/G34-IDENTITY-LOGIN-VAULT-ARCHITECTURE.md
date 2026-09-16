# G34 — Local Identity, Login, ACL and Encrypted Vault Architecture

Status: **PARTIALLY IMPLEMENTED — G34A-G34D PASS; G34E-G34H OPEN**  
Date: 2026-09-16

## 1. Feasibility conclusion

Local identity and case authorization are now implemented through G34D.

Current validated repository state includes:
- local ADMIN/USER identities;
- Argon2id password unlocking and encrypted UMK envelopes;
- authenticated expiring sessions;
- localhost authentication middleware;
- explicit case ownership and ACL roles;
- separate `canReidentify` capability;
- independent per-case CDKs;
- UMK/X25519 per-user CDK envelopes;
- explicit legacy-case import;
- ACL-filtered case selection and document/session authorization.

A secure multi-user release still requires:
1. encrypted persistent privacy vault (G31C1);
2. recovery/password lifecycle (G34E);
3. transaction-bound reauthentication before sensitive re-identification (G34F);
4. production Tauri session/secret boundary (G34G);
5. encryption-at-rest hardening for raw case files and artifacts (G34H).

---

## 2. Scope: local accounts, not cloud accounts

G34 defines **local application accounts**.

An account exists on the workstation/data root and does not require Internet access.

No email address is required.

Initial supported deployment modes:

### PERSONAL
- one Lex user;
- user remains authenticated only inside an active local session;
- optional OS-backed quick unlock may be enabled.

### SHARED_WORKSTATION
- multiple Lex users in the same Lex data root;
- each user has a separate password and cryptographic identity;
- case access is granted explicitly;
- automatic "remember me" is disabled by default.

Out of initial scope:
- cloud identity;
- central organization server;
- cross-device login;
- SSO/OIDC;
- automatic case sync across computers.

Those require a separate network identity/security architecture.

---

## 3. Threat boundary

G34 is intended to protect against:
- another Lex user on a shared workstation;
- unauthenticated access through the localhost API/UI;
- theft/copy of Lex auth/vault files;
- offline password guessing subject to the password/KDF strength;
- accidental use of another user's case;
- stale sessions after locking/logout.

G34 alone cannot protect against:
- malware/keyloggers running with the same OS user's privileges;
- a fully compromised administrator/root account;
- data the user has already exported in plaintext;
- a user who copied plaintext before access was revoked.

Important current limitation:

**G31A currently stores original uploads and safe ZIP extraction members as ordinary plaintext files.**

Therefore app-level accounts are not yet sufficient for strong cryptographic separation between Lex users who can read the same OS filesystem location.

Before declaring secure SHARED_WORKSTATION mode PASS, sensitive case-at-rest encryption must be implemented (see G34H).

---

# IDENTITY MODEL

## 4. User identity

Opaque identifier:

`user_<128-bit random id>`

Never use:
- login name;
- email;
- lawyer name;
- PESEL;
- case data

as a filesystem identifier or cryptographic key id.

User record:

```ts
type LocalUser = {
  userId: string;
  loginName: string;
  normalizedLoginName: string;
  displayName: string;
  appRole: "ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;

  passwordKdf: {
    algorithm: "ARGON2ID";
    salt: string;
    memoryKiB: number;
    iterations: number;
    parallelism: number;
    version: number;
  };

  userMasterKeyEnvelope: {
    algorithm: "AES-256-GCM";
    nonce: string;
    ciphertext: string;
    tag: string;
    keyVersion: number;
  };

  recoveryEnvelope?: {
    algorithm: "AES-256-GCM";
    salt: string;
    nonce: string;
    ciphertext: string;
    tag: string;
  };
};
```

Password plaintext and the User Master Key are never stored in this record.

---

## 5. First-run account bootstrap

When the user database contains zero accounts:

`GET /api/auth/status`

may return:

```json
{
  "initialized": false,
  "requiresBootstrap": true
}
```

Only in that state is account bootstrap permitted.

`POST /api/auth/bootstrap`

creates:
- first user;
- `appRole = ADMIN`;
- random 256-bit User Master Key (UMK);
- password-derived wrapping key;
- encrypted UMK envelope;
- optional recovery envelope.

After the first account exists:
- bootstrap endpoint permanently fails closed;
- creating additional accounts requires an authenticated ADMIN session.

Use an atomic "create first user if count is still zero" transaction to prevent two concurrent bootstrap requests.

---

# PASSWORD / USER MASTER KEY

## 6. Password policy

Password is the primary local factor for initial G34.

Recommended policy:
- minimum 15 Unicode code points;
- support at least 128 characters;
- spaces allowed;
- Unicode allowed;
- no mandatory upper/lower/digit/symbol composition rules;
- bundled local blocklist for common/expected passwords;
- no periodic forced password change;
- password change on suspected compromise or user request.

Normalize the accepted password representation consistently before KDF; the exact normalization form must be fixed in the schema and covered by compatibility test vectors.

Do not:
- truncate passwords;
- log password length/content;
- store password hints;
- use security questions.

---

## 7. Argon2id

Use Argon2id for deriving a password Key Encryption Key (KEK).

Parameters are stored **per user** so they can be upgraded over time.

Release policy:
- never below the current OWASP minimum;
- calibrate on supported hardware toward an interactive local unlock target;
- keep a release-defined minimum even if calibration would choose lower values;
- rewrap the UMK with stronger parameters after successful login when a user's record is below the current policy.

Example implementation target for benchmarking:
- Argon2id;
- >= 64 MiB memory where supported;
- >= 3 iterations as an initial desktop candidate;
- tune against supported low-end hardware before release.

The implementation gate must measure real unlock latency before locking final parameters.

---

## 8. Key hierarchy

### Password

User knows:

`password`

### Password KEK

Derived locally:

`password → Argon2id(user salt + parameters) → Password KEK`

Password KEK is never stored.

### User Master Key (UMK)

Random 256-bit key created once per user:

`UMK = CSPRNG(32 bytes)`

Stored only as an AEAD envelope encrypted by Password KEK.

### Case Data Key (CDK)

Each case gets an independent random 256-bit key:

`CDK = CSPRNG(32 bytes)`

### Case key envelope

For every authorized user, store a separate envelope:

`CDK → encrypted/wrapped under a key derived from that user's UMK`

Conceptually:

`CaseWrapKey = HKDF-SHA256(UMK, caseId, "lex/case-wrap/v1")`

`case envelope = AES-256-GCM(CaseWrapKey, CDK, AAD=userId+caseId+keyVersion)`

This makes case sharing possible without giving users each other's UMKs.

### Privacy Vault Key

Derive from CDK:

`PVK = HKDF-SHA256(CDK, caseId, "lex/privacy-vault/v1")`

### Other future case keys

Use different HKDF labels for:
- raw-file encryption;
- protected file store;
- artifact-at-rest encryption;
- audit integrity key.

Never reuse one derived key for different purposes.

---

## 9. Why this hierarchy

Benefits:
- changing a password only rewraps the UMK;
- it does not reencrypt every case;
- sharing a case only creates another CDK envelope;
- user account deletion can remove its envelope;
- case-key rotation can revoke future access;
- vault encryption is separated from account password storage;
- one compromised case key does not expose another case.

---

# ENCRYPTED PRIVACY VAULT

## 10. Vault ownership

Privacy vault is **per case**, not per global user.

Recommended path:

```text
cases/<caseId>/
  private/
    privacy/
      vault.lmv
      vault-meta.json
```

The key is never stored next to it in plaintext.

Case/user CDK envelopes belong in the auth/access store, not `vault-key.ref` files containing key material.

---

## 11. Vault plaintext model

Do not serialize the current in-memory `keyToToken` duplicate map.

Canonical decrypted payload:

```ts
type PrivacyVaultPayloadV1 = {
  schemaVersion: 1;
  caseId: string;
  generation: number;
  documents: Record<
    string,
    {
      counters: Partial<Record<PiiKind, number>>;
      tokens: Array<{
        token: string;
        kind: PiiKind;
        value: string;
        createdAt: string;
      }>;
    }
  >;
};
```

On unlock, the runtime reconstructs reverse lookup maps in memory.

This avoids storing the same clear value twice.

Source document tokens remain document-scoped. Generation-scoped `LMPII` aliases remain a separate layer so that provider context does not accidentally link equal-looking document tokens across different documents.

---

## 12. vault.lmv binary envelope

Suggested envelope:

```text
magic               4 bytes   "LMV1"
schemaVersion        u16
cipherSuite          u16
keyVersion           u32
vaultGeneration      u64
nonceLength          u16
aadLength            u32
ciphertextLength     u64
nonce                bytes
AAD                  bytes
ciphertext           bytes
GCM tag              bytes
```

Cipher:
- AES-256-GCM.

AAD includes canonical:
- schema version;
- caseId;
- vault generation;
- key version.

The AAD is authenticated but not secret.

`vault-meta.json` may contain only non-secret operational metadata:
- schema;
- cipher suite;
- generation;
- key version;
- encrypted byte count;
- ciphertext SHA-256;
- modifiedAt.

Do not expose:
- clear values;
- token/value relationships;
- document text.

---

## 13. Atomic vault writes

Every vault mutation:

1. authenticated session resolves current user;
2. ACL confirms user can modify privacy state;
3. user session unwraps CDK;
4. derive PVK;
5. read `vault.lmv`;
6. verify/decrypt in memory;
7. update canonical payload;
8. increment generation;
9. serialize canonical payload;
10. encrypt with a fresh GCM nonce;
11. write `vault.lmv.partial`;
12. fsync/close;
13. reopen and decrypt the partial file;
14. verify case id + generation + structure;
15. atomically replace `vault.lmv`;
16. update metadata atomically;
17. zero transient plaintext/key buffers where runtime APIs allow.

Crash before replacement leaves the previous vault intact.

Never overwrite the only valid copy in place.

---

## 14. Vault backup

A copied encrypted vault is useful only together with:
- an authorized user's UMK/recovery path;
- the corresponding case CDK envelope.

Case backup should include:
- encrypted vault;
- case metadata;
- user access envelopes;
- encrypted case files after G34H exists.

Do not create an unencrypted backup for convenience.

---

# LOGIN AND SESSION

## 15. Login flow

`POST /api/auth/login`

Input:
- login name;
- password.

Server flow:

1. normalize login name;
2. load candidate user record;
3. for an unknown login, execute a dummy Argon2id calculation using current policy parameters to reduce timing/user-enumeration differences;
4. derive Password KEK;
5. attempt AEAD decryption of the UMK envelope;
6. if decryption fails, record a generic failed attempt;
7. if success:
   - verify user ACTIVE;
   - place UMK in session-private memory;
   - create random 256-bit session secret;
   - update lastLoginAt;
   - optionally upgrade KDF/rewrap envelope;
8. return only public user/session metadata.

UI error is always generic:

`Nieprawidłowa nazwa użytkownika lub hasło.`

Do not tell unauthenticated callers whether the account exists.

---

## 16. Session secret

Session secret:
- CSPRNG 256 bits;
- opaque;
- no embedded user claims;
- never stored in localStorage/sessionStorage;
- never written to logs;
- invalidated on logout/lock.

Runtime keeps:

```ts
type AuthenticatedSession = {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActivityAt: string;
  lastStrongAuthAt: string;
  expiresAt: string;
  unlockedUserMasterKey: SecretBuffer;
};
```

Initial policy:
- idle lock default: 15 minutes;
- absolute session lifetime: 8 hours;
- both configurable only within release-safe bounds;
- OS workstation lock/suspend should trigger Lex lock when desktop integration exists.

When locked:
- invalidate session secret;
- clear UMK and unwrapped case keys from memory;
- require login again.

---

## 17. Production Tauri session transport

Preferred production architecture:

**Do not expose the authentication session secret to React JavaScript.**

Tauri/Rust owns:
- logged-in session handle;
- session secret;
- sensitive key operations.

React invokes narrowly typed Tauri commands such as:
- `auth_login`;
- `auth_logout`;
- `case_list`;
- `case_open`;
- `document_upload`;
- `artifact_download`.

The Rust shell proxies authenticated requests/operations to the local runtime.

Current direct browser `fetch(http://127.0.0.1:4317)` may remain for development, with an in-memory bearer token only.

Never persist bearer tokens in web storage.

---

## 18. HTTP transition mode

Until all production calls are moved behind Tauri IPC:

Public endpoints only:
- `GET /health`;
- `GET /api/auth/status`;
- `POST /api/auth/bootstrap` only when zero accounts;
- `POST /api/auth/login`.

Every other endpoint requires:

`Authorization: Bearer <opaque-session-secret>`

Authentication middleware resolves:
- user;
- app role;
- session;
- last strong-auth time.

Origin guard remains defense in depth, not the authentication mechanism.

---

## 19. Sensitive-operation reauthentication

Even inside an active session, operations that restore clear PII should require recent strong authentication.

Examples:
- deanonymize/export DOCX;
- deanonymize/export ODT;
- reveal original source;
- export raw case archive;
- change password;
- create recovery code;
- add/remove user case access;
- delete a case.

Initial rule:

`lastStrongAuthAt <= 5 minutes`

Otherwise UI asks for password again.

A later Windows Hello / Touch ID / hardware-authenticator path can satisfy step-up authentication without changing the case-key model.

---

## 20. Login throttling

Persist per-user authentication failure metadata separately from secret material.

Policy:
- maximum 10 consecutive failed activation attempts before enforced delay;
- progressively increasing delay before that ceiling;
- successful login resets failure counter;
- local ADMIN cannot read another user's password;
- audit never records entered password.

Avoid indefinite permanent lockout that turns guessing into a trivial denial-of-service mechanism.

---

# ACCOUNT MANAGEMENT

## 21. Adding users

Authenticated ADMIN can create a new account:

`POST /api/users`

Fields:
- loginName;
- displayName;
- initial password entered directly by the new user where practical.

Recommended shared-workstation UX:
1. ADMIN selects "Dodaj użytkownika";
2. creates login/display name;
3. Lex switches to a protected new-user password entry step;
4. password never needs to be known or displayed to ADMIN;
5. random UMK created;
6. account activated;
7. no case access is granted automatically.

First user is ADMIN.

Subsequent users default to app role USER.

---

## 22. App roles versus case roles

App role controls application administration:

### ADMIN
- create/disable users;
- view technical health;
- installer/repair administration when permitted;
- does **not automatically receive case decryption rights**.

### USER
- normal application use.

Case role is separate.

This prevents "application administrator" from silently becoming an owner of every legal case.

---

## 23. Case ACL

Recommended case roles:

### OWNER
- all case permissions;
- grant/revoke access;
- rotate case key;
- delete case.

### EDITOR
- read original/raw case data;
- privacy review;
- attach protected context to AI;
- generate documents;
- reidentify/export if allowed by case policy.

### ANALYST
- protected document access;
- AI analysis;
- no raw source or deanonymization by default.

### VIEWER
- read protected/final permitted material;
- no provider send;
- no write;
- no reidentification.

Additionally keep an explicit sensitive capability:

`canReidentify: boolean`

so OWNER can permit an EDITOR to work on a case without granting deanonymization/export.

ACL record:

```ts
type CaseAccess = {
  caseId: string;
  userId: string;
  role: "OWNER" | "EDITOR" | "ANALYST" | "VIEWER";
  canReidentify: boolean;
  wrappedCaseDataKey: string;
  keyVersion: number;
  grantedByUserId: string;
  grantedAt: string;
};
```

VIEWER/ANALYST may eventually receive a separate restricted protected-data key instead of the full CDK if cryptographic separation from raw data is required. Initial implementation must not pretend role checks alone are cryptographic separation if all roles receive the same CDK.

---

## 24. Case creation

Authenticated user creates a case:

1. generate caseId;
2. generate CDK;
3. create case directories;
4. create OWNER ACL entry;
5. derive CaseWrapKey from creator UMK;
6. wrap CDK;
7. initialize encrypted empty vault;
8. commit metadata + access record atomically.

`case.json` gains at minimum:
- caseId;
- createdAt;
- createdByUserId;
- keyVersion;
- no clear secret keys.

---

## 25. Granting access

OWNER selects another existing local user.

Runtime:
1. requires recent re-auth;
2. unwraps CDK using owner's UMK;
3. derives target user's case wrapping key only if the target UMK can be addressed securely.

Important consequence:

The server cannot derive a target user's UMK while that user is logged out unless there is a separate public-key or escrow architecture.

Therefore initial sharing should use one of two designs.

### Preferred G34 design: per-user asymmetric key pair

At account creation also generate:
- X25519 or P-256 key agreement key pair;
- private key encrypted under UMK;
- public key stored in user directory.

Then OWNER can grant case access while target is logged out:
- create an envelope for target using target public key;
- target opens it after login with its private key.

This avoids storing target UMK centrally and avoids requiring simultaneous login.

### Simpler transitional design

Require target user to log in once to accept case access.

G34 should prefer the asymmetric envelope model for a real multi-user release.

---

## 26. Password change

User supplies current password and new password:

1. authenticate current password;
2. unwrap UMK;
3. derive new Password KEK with new salt/parameters;
4. re-encrypt exactly the same UMK;
5. atomically replace account envelope;
6. invalidate other sessions.

No case re-encryption is required.

---

## 27. Forgotten password / recovery

Never implement "ADMIN sets a new password and transparently preserves everything" without a cryptographic recovery path.

Two supported paths:

### User recovery code

At account creation or later:
- generate high-entropy random recovery secret;
- use it to create a second UMK envelope;
- show recovery secret once;
- user stores it offline.

Recovery:
- recovery secret unwraps UMK;
- user sets a new password;
- same UMK is rewrapped.

### Administrative reset without recovery

ADMIN may reset the account identity, but:
- old UMK is not recoverable;
- create a new UMK/key pair;
- existing case access envelopes for the old identity cannot simply be decrypted;
- case OWNERs must regrant case access.

This is safer than building a universal administrator escrow key by default.

No security questions.

---

## 28. Disabling/deleting a user

Disable:
- invalidate sessions immediately;
- prevent new login;
- retain records for audit.

Delete:
- requires ADMIN + recent re-auth;
- remove account login material;
- enumerate case ACLs;
- for each case, OWNER policy decides revocation.

Strong revocation requires:
1. generate new CDK;
2. reencrypt protected case secrets/files under new key;
3. create new envelopes only for remaining authorized users;
4. increment keyVersion.

Deleting only an ACL row does not cryptographically revoke a user who previously copied a case key or plaintext.

---

# OS SECRET STORAGE / QUICK UNLOCK

## 29. Platform secret stores

OS secret storage can improve UX but is not the primary shared-workstation password boundary.

### Windows
DPAPI current-user protection can protect small secrets tied to the Windows logon context.

Do not use machine-wide DPAPI for user secrets.

### macOS
Use Keychain for small keys/secrets.

### Linux
Use Secret Service when available.

### Tauri Stronghold
Tauri Stronghold is a viable local encrypted secret store and supports password-derived initialization including Argon2.

If used:
- keep Stronghold behind Rust commands;
- do not grant React a generic "read any secret" capability;
- use it for small account/key material, not entire legal files;
- the explicit Lex case envelope format remains the source of truth for portable case encryption.

---

## 30. Remember me / quick unlock

PERSONAL mode may offer:

`Odblokuj przy użyciu konta systemowego tego komputera`

This stores or wraps an account unlock secret in the OS secret store.

SHARED_WORKSTATION:
- disabled by default;
- enabling it requires explicit warning because users sharing the same OS login may not receive meaningful separation from DPAPI/Keychain quick unlock alone.

Password login remains available.

---

# FULL CASE AT-REST ENCRYPTION

## 31. Why it is required

Today these G31A objects are plaintext:
- uploaded original files;
- extracted ZIP members;
- potentially final deanonymized artifacts.

Therefore a user who can browse the case directory can bypass Lex login.

For secure multi-user mode this must change.

---

## 32. G34H — encrypted case file store

Target layout:

```text
cases/<caseId>/
  case.json                 # minimal non-secret metadata
  secure/
    incoming/
      <uploadId>.lme
    extracted/
      <fileId>.lme
    raw/
      <documentId>.lme
    privacy/
      vault.lmv
    artifacts/
      <artifactId>.lme
```

`.lme` is an authenticated encrypted blob/container under a key derived from CDK.

Plaintext filenames may themselves reveal sensitive information, so encrypted-store metadata should use opaque file ids. Original filename belongs inside encrypted metadata.

Protected/pseudonymized data may be separately keyed if ANALYST/VIEWER cryptographic access is required.

---

## 33. Working plaintext

OCR and DOCX/ODT tooling sometimes requires a filesystem path.

Policy:
- prefer in-memory streams;
- where an external worker requires a file, create it in a Lex-controlled private work directory;
- restrictive OS permissions;
- random filename;
- no user-derived names;
- delete immediately after worker exit;
- never rely on secure deletion on SSD as a guarantee.

For high-assurance mode, use an encrypted temporary volume or platform-specific protected workspace where available.

Do not claim that deleting a plaintext SSD temp file makes the previous bytes cryptographically unrecoverable.

---

# AUDIT

## 34. Authentication/security audit events

Record:
- account_created;
- account_disabled;
- login_success;
- login_failure;
- session_locked;
- logout;
- password_changed;
- recovery_used;
- case_access_granted;
- case_access_revoked;
- case_key_rotated;
- vault_unlocked;
- reidentification_started;
- reidentification_completed;
- sensitive_export_created.

Never record:
- password;
- Password KEK;
- UMK;
- CDK;
- recovery secret;
- session bearer;
- clear PII mapping.

Audit references userId/caseId/artifactId and result only.

---

# API / UI

## 35. Proposed API

Public:
- `GET /api/auth/status`
- `POST /api/auth/bootstrap` (zero-users only)
- `POST /api/auth/login`

Authenticated:
- `POST /api/auth/logout`
- `POST /api/auth/lock`
- `POST /api/auth/reauthenticate`
- `GET /api/auth/me`
- `GET /api/users` (ADMIN)
- `POST /api/users` (ADMIN)
- `PATCH /api/users/:userId/status` (ADMIN)
- `POST /api/users/:userId/password/change` (self)
- `POST /api/users/:userId/recovery/create` (self)
- `POST /api/auth/recover`
- `GET /api/cases` (ACL-filtered)
- `POST /api/cases`
- `POST /api/cases/:caseId/access` (OWNER)
- `DELETE /api/cases/:caseId/access/:userId` (OWNER)

All existing case/document/session/artifact APIs require authenticated user + case authorization.

---

## 36. Login UI

Startup state machine:

`BOOT → AUTH_STATUS → BOOTSTRAP | LOGIN → UNLOCKED → LOCKED`

### First run

Screen:
- "Utwórz konto właściciela"
- login;
- display name;
- password;
- repeat password;
- optional recovery-code setup.

### Normal run

Screen:
- select/enter login;
- password;
- "Zaloguj";
- optional quick unlock when configured.

### Locked

No case metadata/text remains visible.

Show:
- current user display name;
- password field;
- "Odblokuj";
- "Zmień użytkownika".

### User management

ADMIN:
- account list;
- active/disabled;
- create account;
- disable account;
- no password visibility.

### Case sharing

OWNER:
- add local user;
- role;
- explicit `Może przywracać dane osobowe / generować jawny dokument` toggle.

---

## 37. Privacy in locked UI

When session locks:
- clear currently displayed raw review text from React state;
- clear selected chunks;
- clear sensitive previews;
- invalidate downloads;
- backend zeroizes session keys;
- reopening requires authentication and fresh ACL resolution.

Do not rely on CSS blur/hiding sensitive DOM content.

---

# IMPLEMENTATION GATES

## 38. G34A — Local account bootstrap

PASS:
- zero-user bootstrap only;
- first ADMIN;
- opaque user id;
- password never persisted;
- UMK envelope persists.

## 39. G34B — Login/session

PASS:
- Argon2id unlock;
- opaque 256-bit sessions;
- throttling;
- logout/idle lock;
- generic login errors;
- all non-public APIs require auth.

## 40. G34C — Case ACL

PASS:
- every case has OWNER;
- list/read/write filtered by ACL;
- app ADMIN does not imply case access;
- sensitive `canReidentify` permission enforced.

## 41. G34D — Multi-user case key envelopes

PASS:
- independent CDK;
- per-user envelopes;
- preferred public-key grant path;
- password changes do not reencrypt cases;
- revoked access has a tested key-rotation path.

## 42. G31C1 — Persistent encrypted privacy vault

PASS:
- file-backed authenticated vault;
- restart round trip;
- no plaintext mapping;
- atomic generation updates;
- corrupt/truncated vault fails closed.

## 43. G34E — Recovery

PASS:
- one-time high-entropy recovery secret;
- same UMK restored;
- no security questions;
- admin reset without recovery cannot silently bypass cryptographic ownership.

## 44. G34F — Step-up reauthentication

PASS:
- clear PII/deanonymized exports require recent authentication;
- timeout tested;
- audit events generated.

## 45. G34G — Production Tauri auth boundary

PASS:
- production frontend never receives a reusable backend bearer secret;
- narrow typed commands only;
- generic Stronghold/keychain access not exposed to web UI.

## 46. G34H — Sensitive case encryption at rest

Required before claiming secure SHARED_WORKSTATION.

PASS:
- raw uploads not plaintext at rest;
- extracted ZIP members not plaintext at rest;
- private OCR/raw state encrypted;
- sensitive artifact store encrypted;
- file names/metadata minimized;
- worker plaintext lifecycle explicitly controlled and tested.

---

## 47. Recommended implementation order before installer execution

1. G34A local account store/bootstrap;
2. G34B login/session + authentication middleware;
3. G34C case ownership/ACL;
4. G34D per-user case-key envelopes;
5. G31C1 persistent encrypted privacy vault;
6. G34E recovery;
7. G34F reauthentication;
8. G34H case-at-rest encryption;
9. G31C2 authoring AST/generation aliases;
10. G31D DOCX;
11. G31E ODT;
12. G34G Tauri production session boundary;
13. G33 installer implementation.

This order prevents the installer from freezing an insecure storage/auth architecture into a distributable package.


---

## 48. Normative authentication/session protocol

Detailed login, logout, idle expiry, failed-attempt backoff and transaction-bound deanonymization reauthorization are specified in:

`app/reports/G34-AUTH-SESSION-REAUTH-PROTOCOL.md`

That protocol is normative for G34B and G34F and supersedes earlier shorthand such as a generic "recent authentication within five minutes" rule.

Key decisions:
- 15-minute idle timeout;
- 8-hour overall timeout;
- LOCKED has no valid session or unlocked UMK/CDK;
- increasing temporary login backoff, no permanent automatic password lockout;
- every deanonymization requires an exact artifact-bound one-use password reauthorization grant;
- intent lifetime 5 minutes;
- grant lifetime 90 seconds;
- immediate sensitive-download ticket 60 seconds / one use;
- later access to a deanonymized artifact requires fresh transaction authorization.

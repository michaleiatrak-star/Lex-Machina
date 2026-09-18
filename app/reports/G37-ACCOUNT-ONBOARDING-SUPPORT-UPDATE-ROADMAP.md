# G37 — Account Administration, Provider Onboarding, Support Access and Update UX

Status: **IN EXECUTION — G37A/G37C1/G37E1 PASS; G37C2 implemented and under exact-head validation; G37B/G37D/G37E2/G37F/G37G remain open**  
Date: 2026-09-16  
Base: `feature/local-runtime`  
Work branch: `codex/g37-admin-settings-dnd-updater-audit-2026-09-16`

## 1. Objective

G37 closes the usability and operational gaps found after the P4B/G34H/G36 baseline:

- local account administration must be available from the UI;
- ordinary users must be creatable, disableable, reactivateable and safely removable;
- password recovery must remain compatible with the existing encrypted UMK design;
- the first-user flow may become passwordless only when an OS-protected secret store is available;
- provider API onboarding must guide the user directly to the provider key console;
- files must be attachable by drag-and-drop on the conversation composer without bypassing privacy review;
- developer/service support access must not rely on a universal embedded password;
- application updates must be discovered from signed releases and applied only after explicit user consent;
- every implemented sub-gate must have deterministic tests and GitHub Actions evidence.

## 2. Security invariants

1. No universal plaintext or embedded service password.
2. No provider API key in browser localStorage/sessionStorage, ordinary JSON, logs or repository files.
3. Disabling an account increments auth epoch and revokes every active local session.
4. Hard user deletion never silently removes case ownership or ACL entries.
5. Case-key rotation remains mandatory when access to an existing encrypted case is revoked.
6. Drag-and-drop uses the same document/privacy pipeline as manual file selection.
7. The updater never installs directly from a mutable branch.
8. Update discovery uses GitHub Releases; installation requires signed release metadata and signed artifacts.
9. A failed update must preserve the last known-good version and all case/vault data.
10. A support/service session is device-scoped, time-limited, auditable and locally approved.

## 3. G37A — ADMIN user lifecycle and onboarding UX

Status: **PASS — validated code SHA `f4cb530e47b8af15d5a7320330939fcfc0054176`**

### Implemented

- ADMIN user list API already existed and remains the source of truth.
- ADMIN can create ordinary `USER` accounts.
- new account status API:
  - `PATCH /api/admin/users/:userId/status`;
  - supports `ACTIVE` and `DISABLED`;
  - increments `auth_epoch`;
  - revokes all active target-user sessions.
- new safe-delete API:
  - `DELETE /api/admin/users/:userId`;
  - self-delete is blocked;
  - ADMIN deletion is blocked;
  - target must first be `DISABLED`;
  - hard delete is blocked while the target owns a case, has case ACL rows or remains a grantor referenced by ACL.
- React ADMIN panel:
  - list users;
  - create user;
  - deactivate/reactivate;
  - hard delete when eligible.
- provider onboarding:
  - OpenAI key console link;
  - Claude Platform key settings link;
  - xAI Console link;
  - the application still exposes only configured/not-configured state.
- conversation drag-and-drop:
  - file may be dropped on the query/composer card;
  - the dropped file is handed to `DocumentPrivacyPanel`;
  - the existing local review/upload pipeline remains authoritative.

### Validation evidence

GitHub Actions:
- Lex Runtime Validation `35095122173` — SUCCESS;
- F-138 structural audit `35095122216` — SUCCESS;
- runtime tests: 49/49 files, 185/185 tests PASS;
- web tests: 1/1 file, 10/10 tests PASS;
- production web build and G14 PASS;
- G17/G19/G20/G22 live probes PASS.

### PASS criteria

- TypeScript strict typecheck.
- Runtime unit suite.
- Web unit suite and production build.
- G14 browser-bundle safety.
- account lifecycle HTTP test:
  - create;
  - login;
  - disable;
  - existing session invalid;
  - login rejected while disabled;
  - reactivate;
  - login succeeds;
  - delete rejected while active;
  - disable and delete;
  - removed user no longer listed.
- G31B2 regression returns intended validation status rather than masking callback errors as 409.

## 4. G37B — first-user passwordless bootstrap with later password setup

Status: **DESIGN — BLOCKED ON DESKTOP OS SECRET STORE**

The original requirement for a first ADMIN without a password is acceptable only if the initial UMK remains protected.

### Required design

When an OS credential vault is available:

1. create first ADMIN with random UMK;
2. generate a random bootstrap wrapping key;
3. store that wrapping key only in:
   - Windows Credential Manager / DPAPI-backed credential store;
   - macOS Keychain;
   - Linux Secret Service/libsecret;
4. set account state `PASSWORD_SETUP_PENDING`;
5. allow local unlock through the OS-protected bootstrap secret;
6. require/offer password setup from the security panel;
7. after password setup:
   - derive KEK through Argon2id;
   - rewrap the same UMK;
   - increment auth epoch;
   - erase bootstrap credential;
   - rotate recovery code.

### Fail-closed rule

If an OS-protected secret store is unavailable, first-user bootstrap remains password-required. No empty-string password and no plaintext key file are allowed.

## 5. G37C — provider credential settings

Status: **G37C1 PASS — memory-only runtime credentials; G37C2 IMPLEMENTED — persistent OS keychain, exact-head CI pending**

### G37C1 — PASS

Validated code SHA: `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`.

Implemented:

- ADMIN may paste a provider key into the local UI;
- the key is stored only in backend process memory;
- memory value overrides the environment fallback;
- clearing/replacing zeroizes the previous Buffer;
- server shutdown zeroizes all memory-only keys;
- no API response returns the key;
- browser localStorage/sessionStorage remain unused;
- provider links remain available for obtaining/managing keys;
- environment variables remain supported as fallback.

Validation:
- runtime tests 50/50 files and 192/192 tests PASS;
- web tests 12/12 PASS;
- build/G14 PASS;
- full runtime workflow and live probes PASS.

### G37C2 — persistent OS keychain implementation

Implemented on the desktop trust boundary:

- persistent provider key stored in the OS credential backend through Rust `keyring`;
- restore on desktop startup into the existing memory-only runtime overlay;
- replace/persist only after the runtime accepts the credential;
- delete removes the OS-vault entry;
- provider allowlist is limited to OpenAI, Anthropic and xAI;
- transient Rust secret strings and replaced backend Buffers are zeroized;
- browser localStorage/sessionStorage are not used.

A dedicated `G37C2_OS_KEYRING_PROVIDER_CREDENTIALS` validator is wired into `Lex Runtime Validation`. Final PASS requires the exact-head workflow to be green.

The API must never return key prefix, length, hash or fingerprint.

### G37C PASS

- no secret enters browser persistence;
- no secret is serialized to application JSON;
- process restart restores an opted-in persistent key from OS vault;
- delete removes the OS-vault entry;
- API and UI tests prove redaction.

## 6. G37D — SERVICE / DEVELOPER support identity

Status: **DESIGN**

A universal account/password shared by all installations is explicitly rejected.

### Role model

Application control-plane roles become:

`SERVICE > ADMIN > USER`

`SERVICE` is a maintenance/support role, not a permanent human account created during bootstrap.

### Activation contract

1. installation owns a random `installationId` and local public/private support challenge key;
2. Lex Machina ships only the developer/vendor public verification key;
3. developer produces a signed support entitlement containing:
   - installationId;
   - nonce/challenge;
   - requested capabilities;
   - issuedAt;
   - expiresAt;
   - ticket/support reference;
4. local ADMIN explicitly approves activation;
5. application verifies signature and TTL;
6. a temporary SERVICE session is created;
7. every operation is security-audited;
8. logout/expiry revokes the session.

### Data-access boundary

SERVICE may administer application/account/update state, but must not automatically obtain cleartext case data. Case content/reidentification requires a separate explicit local grant bound to a case and support session. This prevents the highest maintenance rank from becoming a universal data backdoor.

## 7. G37E — signed GitHub Release updater

Status: **G37E1 PASS — trusted release discovery; G37E2 OPEN — signed install/rollback requires G33D/G34G**

### G37E1 — PASS: discovery

Validated code SHA: `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`.

Implemented:
- source: GitHub Releases for `michaleiatrak-star/Lex-Machina`;
- never use mutable `main` or feature branch HEAD as an update channel;
- compare semantic application versions;
- ignore drafts and prereleases unless the user opts into a prerelease channel;
- display version/release identity and publication date when available;
- ignore untrusted release URLs;
- network/payload failure degrades to `UNAVAILABLE`;
- discovery performs no artifact download.

The UI checks non-blockingly and allows manual refresh.

### G37E2 — user consent and installation

Update discovery may occur automatically when network is available. Download/install starts only after the user chooses **Aktualizuj**.

### G37E2 trust contract

A release contains:

- signed release metadata;
- application version;
- target OS/architecture;
- artifact URL;
- artifact SHA-256;
- component lock hash;
- minimum compatible schema;
- signing-key id.

The desktop app embeds only the updater verification public key.

### G37E2 transaction

1. download to `<version>.staging`;
2. verify metadata signature;
3. verify artifact signature/hash;
4. unpack to staging;
5. verify component lock;
6. run offline self-test;
7. create schema/data backup if migration is required;
8. atomically switch `state/current.json`;
9. start new version;
10. if health/self-test fails, roll back;
11. preserve case/vault data.

### G37E2 PASS

- newer signed release detected;
- same/older release ignored;
- tampered metadata blocked;
- tampered artifact blocked;
- user decline performs no installation;
- successful update switches version;
- failed self-test rolls back;
- cases remain readable after update and rollback.

Full execution is deferred until G34G/G33 provide the production Tauri trust boundary and signed desktop artifacts.

## 8. G37F — drag-and-drop completion

Status: **PARTIAL IMPLEMENTATION IN G37A**

Current scope accepts the first dropped file and routes it through the same privacy panel.

Remaining:

- multi-file queue;
- explicit per-file size/type feedback;
- keyboard-accessible equivalent;
- progress state;
- drag counter to avoid flicker across nested elements;
- end-to-end browser test.

## 9. G37G — repository and release closure audit

Before G37 is marked complete:

1. all runtime/web workflows green on the exact candidate SHA;
2. compare candidate against `feature/local-runtime`;
3. close or supersede stale PRs whose work exists in newer branches;
4. inspect diverged historical branches before deletion;
5. merge PR #39 or otherwise resolve its DR-09 correction;
6. merge G37 only after the parent `feature/local-runtime` line is green;
7. after integration, rerun the full release acceptance suite;
8. publish a signed GitHub Release only after G33 acceptance.

## 10. Current execution order

1. restore G31B2 CI;
2. G37A account lifecycle + onboarding + drag-and-drop;
3. rerun complete runtime/web validation;
4. fix any regressions;
5. G31B2 closure;
6. G31C2/G35C;
7. G31D/G31E/full G34F;
8. G34G;
9. G33A-G33D;
10. G37B/G37C/G37D/G37E desktop integration;
11. clean-machine release acceptance;
12. repository cleanup and signed release.

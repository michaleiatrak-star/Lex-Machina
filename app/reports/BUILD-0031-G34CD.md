# Build 0031 — G34C/G34D Case ACL + Key Ownership

Status: **PASS — G34C CASE ACL + G34D CASE KEY ENVELOPES**  
Date: 2026-09-16

## Validated code

Validated code SHA:

`a41fd86dd550dc41c93705edc423516d05199d8c`

Validation:

- Lex Runtime Validation `35072926001` — **success**
- F-138 structural audit `35072925987` — **success**
- deterministic G1-G29 + G31A/G31B + G32 + G34A-G34D job — **success**
- TypeScript strict typecheck — **success**
- runtime/app unit tests — **success**
- G34C deterministic validator — **PASS**
- G34D deterministic validator — **PASS**
- web unit tests / production build / browser bundle safety — **success**
- G17 live official-source probe — **success**
- G19 live temporal freshness — **success**
- G20 live official PDF probe — **success**
- G22 live SN case-law probe — **success**

Subsequent documentation commits are not included in the validated code SHA above.

---

## 1. G34C — case ownership and ACL

Implemented a local case-access model that is independent from global application role.

Case roles:
- `OWNER`
- `EDITOR`
- `ANALYST`
- `VIEWER`

Capabilities:

| Case role | READ | WRITE | ANALYZE | MANAGE |
|---|---:|---:|---:|---:|
| OWNER | yes | yes | yes | yes |
| EDITOR | yes | yes | yes | no |
| ANALYST | yes | no | yes | no |
| VIEWER | yes | no | no | no |

`canReidentify` is a separate per-case capability and is not implied by role.

Global `ADMIN` remains separate from case ownership. Being an application ADMIN does not automatically create an ACL row for every case.

---

## 2. Explicit case ownership

New secured cases are created with:
- opaque random `caseId`;
- `createdByUserId`;
- `keyVersion`;
- OWNER ACL row for the creating user;
- `canReidentify = true` for the initial OWNER.

Both local filesystem metadata and SQLite access metadata record the ownership binding.

The existing G31A case layout remains compatible for old tests, but production creation now routes through the authenticated case-access service.

---

## 3. Legacy case migration

Existing pre-G34 development case directories are **not silently assigned** to the first or current account.

Legacy candidates are cases whose `case.json` lacks:
- `createdByUserId`; or
- `keyVersion`.

ADMIN can explicitly:
- list legacy candidates;
- import one selected case;
- become its OWNER;
- initialize its first CDK/envelope;
- bind the legacy `case.json` to the selected user.

A legacy case does not appear in a user's normal case list before this explicit import.

---

## 4. Additional local users

Build 0031 adds ADMIN-only local user creation and user listing at the backend/API layer.

A new user receives:
- opaque random `userId`;
- local password/Argon2id UMK envelope from G34A;
- `appRole = USER`;
- independent X25519 sharing keypair;
- public key persisted;
- private sharing key persisted only as an authenticated encrypted envelope under a UMK-derived wrapping key.

There is not yet a complete user-management administration UI; the API/service foundation is present for the case-sharing model.

---

## 5. G34D — Case Data Key

Every newly secured case receives an independent random 256-bit Case Data Key (CDK).

The CDK is not stored in plaintext.

For the active owner, the CDK is wrapped using:

```text
UMK
  -> HKDF-SHA256(
       salt = caseId,
       info = "lex/case-wrap/v1"
     )
  -> CaseWrapKey
  -> AES-256-GCM(CDK)
```

AAD binds:
- envelope algorithm;
- user id;
- case id;
- key version.

This separates password/account encryption from case encryption and prevents one case CDK from being reused for another case.

---

## 6. Offline per-user case sharing

A case can be granted to another local user even when the target user is logged out.

Each user has:
- X25519 public key;
- X25519 private key encrypted under a UMK-derived key.

Grant flow:

```text
OWNER unlocks current CDK
      ↓
ephemeral X25519 keypair
      ↓
ECDH(ephemeral private, target public)
      ↓
HKDF-SHA256(... "lex/case-share/v1")
      ↓
AES-256-GCM(CDK)
      ↓
target-specific case envelope
```

The envelope stores:
- algorithm;
- ephemeral public key;
- nonce;
- ciphertext;
- authentication tag;
- case key version.

When the target later logs in:
1. password unlocks UMK;
2. UMK unlocks that user's X25519 private key;
3. X25519 derives the case wrap key;
4. the target's case envelope unlocks the same CDK.

Tests prove the owner and an offline-granted target recover the same CDK digest.

---

## 7. Grant and revoke

OWNER can grant:
- EDITOR;
- ANALYST;
- VIEWER;
with an independent `canReidentify` flag.

OWNER itself is not revocable in this batch; ownership transfer remains future lifecycle work.

Revoke uses strong future-key revocation:
1. current OWNER ACL is checked;
2. the current OWNER envelope is cryptographically opened;
3. a fresh random CDK is generated;
4. `keyVersion` increments;
5. all remaining users receive new envelopes;
6. the revoked user's row is removed;
7. local case metadata is updated to the new key version.

Tests prove:
- key version increments;
- owner CDK digest changes;
- revoked user loses case access;
- revoked user cannot obtain the rotated CDK.

This protects future cryptographic layers. It does **not** retroactively protect current plaintext G31A raw files; G34H remains mandatory for filesystem-level separation.

---

## 8. ACL enforcement in production HTTP

Production `server.ts` always wires `LocalCaseAccessService`.

Authenticated case API:
- `GET /api/cases` — list only cases visible to current user;
- `GET /api/cases/:caseId` — open authorized case metadata;
- `POST /api/cases` — create secured case;
- `GET /api/cases/:caseId/access` — OWNER/MANAGE;
- `POST /api/cases/:caseId/access` — grant;
- `DELETE /api/cases/:caseId/access/:userId` — revoke + rotate;
- `POST /api/cases/:caseId/rotate-key` — explicit key rotation;
- `GET /api/cases/legacy` — ADMIN legacy candidates;
- `POST /api/cases/:caseId/import-legacy` — explicit ADMIN import.

ADMIN user API:
- `GET /api/admin/users`;
- `POST /api/admin/users`.

Existing case file upload requires WRITE.

Document operations in the current runtime:
- ingest/review require WRITE to the selected case;
- returned `documentId` is bound in trusted runtime memory to its `caseId`;
- privacy finalization requires WRITE to that mapped case;
- protected document attachments require ANALYZE to the mapped case before chunk resolution.

This prevents a user from bypassing ACL merely by learning a random `documentId` during the same runtime process.

---

## 9. Case selector UI

The existing behavior that created a new case on every authenticated workbench mount has been removed.

After login the browser:
- lists only cases returned by the authenticated ACL endpoint;
- selects an existing visible case only if one exists;
- otherwise leaves no active case;
- lets the user explicitly create a new case;
- displays case role, `canReidentify`, and key version;
- clears current document attachment/execution state when switching cases.

Production bundle validation requires:
- explicit case selection UI;
- the marker that cases are no longer auto-created after login;
- role/re-identification display;
- explicit “Utwórz sprawę”.

---

## 10. Persistence

New tables in the local auth SQLite:
- `user_crypto`;
- `cases`;
- `case_access`.

The database persists:
- public X25519 user key;
- encrypted user private sharing key;
- case metadata;
- role/capability ACL;
- encrypted CDK envelopes;
- key versions.

The database has no plaintext-CDK column.

Live UMK and CDK material exists only in trusted runtime memory and scoped callback buffers, which are overwritten after use where the runtime permits.

---

## 11. Tests

New tests cover:
- owner ACL creation;
- additional ADMIN-created USER;
- role capability separation;
- independent `canReidentify`;
- case list visibility;
- offline X25519 grant;
- same CDK recovered by owner and target;
- target WRITE denial as ANALYST;
- explicit legacy case import;
- no legacy auto-assignment;
- revoke + key rotation;
- changed CDK after rotation;
- revoked target denial;
- multi-user HTTP case visibility;
- HTTP WRITE denial;
- HTTP revoke and subsequent denial.

Deterministic validators:
- `G34C_CASE_ACL: PASS`
- `G34D_CASE_KEY_ENVELOPES: PASS`

---

## 12. Explicit limitations

G34 as a whole is **not PASS**.

Still open:
- G31C1 — encrypted persistent privacy vault;
- G34E — password/recovery lifecycle;
- G34F — transaction-bound reauthentication before deanonymization;
- G34G — Tauri production secret/session boundary;
- G34H — encryption at rest for raw uploads, extracted ZIP members, OCR/raw state and sensitive artifacts;
- case ownership transfer/deletion lifecycle;
- persistent reopened document-working-state mapping;
- full user-management UI;
- G31C2 typed authoring AST;
- G31D DOCX;
- G31E ODT;
- G33 installer implementation;
- G30 Open Web Discovery.

Important security boundary:
- raw case uploads and extracted ZIP members are still plaintext local files;
- current reversible privacy vault remains process-memory-only;
- CDK/envelope mechanics provide authorization/key ownership for future encrypted case layers but do not yet make those plaintext files unreadable to another process/OS user with filesystem access;
- `canReidentify = true` is not sufficient by itself to deanonymize; G34F password step-up remains required before that capability is exposed to the future persistent vault/deanonymization path;
- browser still holds an in-memory bearer until G34G moves the production session trust boundary out of React.

---

## 13. Next batch

Next dependency is **G31C1 — encrypted persistent privacy vault**, followed by **G34E/G34F — recovery/password lifecycle and transaction-bound reauthorization**.

Recommended Batch C order:
1. LMV1 vault binary format;
2. CDK -> HKDF privacy-vault key;
3. canonical vault payload;
4. authenticated atomic writes;
5. runtime vault adapter;
6. restart round trip;
7. corruption/wrong-key/wrong-AAD tests;
8. password/recovery lifecycle;
9. deanonymization intent;
10. fresh password step-up;
11. one-use reidentification grant;
12. cancellation and audit tests;
13. full regression before moving to G34H.

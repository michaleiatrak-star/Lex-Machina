# Lex Machina — Master Roadmap to Secure Desktop Release

Status: **IN EXECUTION — G34H1/H2/H3/H4 PASS; NEXT G34H5**  
Date: 2026-09-16  
Branch baseline: `feature/local-runtime`

This roadmap consolidates the completed gates and all design decisions from G31, G33 and G34 into one execution sequence.

It is intentionally ordered so that the installer is built only after storage, identity, vault, document generation and desktop trust boundaries are stable.

---

# 1. Current baseline

Validated implementation baseline:

- G0-G29 — PASS
- G27A — PASS
- G28A — PASS
- G31A — PASS
- G31B — PASS
- G32 — PASS
- G34A — PASS
- G34B — PASS
- G34C — PASS
- G34D — PASS
- G35A — PASS
- G35B — PASS
- G31C1 — PASS
- G34E — PASS
- G34F1 — PASS (foundation only; full G34F still open)
- G34H1 — PASS
- G34H2 — PASS
- G34H3 — PASS
- G34H4 — PASS

Validated code SHA:
- `bfa79b656e302dda37ab000bda08c55f2f889525`

Validated CI:
- Lex Runtime Validation `35083339870` — success
- F-138 `35083339857` — success

Designs completed but not yet fully implemented:
- G31C2
- G31D/G31E
- G33A-G33D
- full G34F integration with actual deanonymization/export
- G34G/G34H

Open independent capability:
- G30 — Open Web Discovery

Do not claim full G31/G33/G34 PASS until their remaining implementation gates are green. G34A-G34D are validated sub-gates only.

---

# 2. Release target

Target release behavior:

```text
install offline
    ↓
create/login local user
    ↓
open existing or create new case
    ↓
encrypted local case storage
    ↓
upload PDF/image/ZIP
    ↓
local extraction/OCR
    ↓
local privacy review
    ↓
encrypted reversible vault
    ↓
select protected chunks
    ↓
provider sees protected aliases only
    ↓
AI returns typed legal-document AST
    ↓
local deterministic DOCX/ODT rendering
    ↓
password reauthorization
    ↓
local file-to-file deanonymization
    ↓
legal/package/token validation
    ↓
encrypted artifact store
    ↓
one-use local download
```

No provider call is permitted after a deanonymization grant is consumed.

---

# 3. Critical-path dependency map

```text
BASELINE
 G0-G29 + G27A/G28A + G31A/B + G32
                |
                v
 PHASE 1 — G34A/G34B
 accounts + login + sessions + throttling
                |
                v
 PHASE 2 — G34C/G34D
 case ACL + per-user case-key envelopes
                |
                v
 PHASE 2B — G35A/G35B
 case workspace + shared firm templates
                |
                v
 PHASE 3 — G31C1
 encrypted persistent privacy vault
                |
                +----------+
                |          |
                v          v
 PHASE 4A      PHASE 4B
 G34E/F        case lifecycle UX
 recovery      reopen/list/select cases
 reauth
                |          |
                +----+-----+
                     v
 PHASE 5 — G34H
 encrypted case storage + migration
                     |
                     v
 PHASE 6 — G31B2
 process selected stored/ZIP members
                     |
                     v
 PHASE 7 — G31C2
 typed authoring AST + generation aliases
                     |
              +------+------+
              |             |
              v             v
 PHASE 8      PHASE 9
 G31D DOCX    G31E ODT
              |             |
              +------+------+
                     v
 PHASE 10 — G34G
 Tauri production trust/session boundary
                     |
                     v
 PHASE 11 — G33A/B
 frozen component lock + offline payload
                     |
                     v
 PHASE 12 — G33C/D
 guided installer + repair/update/rollback
                     |
                     v
 PHASE 13
 release hardening / clean-machine acceptance
```

G30 Open Web Discovery runs as a parallel track and does not block the secure local-document/installer critical path unless release scope explicitly requires it.

---

# 4. Execution rule

Each phase follows the same closure pattern:

1. schema/contracts;
2. implementation;
3. unit tests;
4. adversarial/negative tests;
5. deterministic validation gate;
6. UI integration;
7. browser/desktop boundary test;
8. migration/restart test where applicable;
9. CI green;
10. build report + BUILD-LOG entry;
11. only then begin a dependent phase.

No phase may be marked PASS from architecture documentation alone.

---

# PHASE 0 — BASELINE FREEZE / TEST HARNESS

Goal: protect the already-working runtime while security/storage is refactored.

## P0-T01 — Record implementation baseline
- keep validated code SHA/reference;
- keep current run ids;
- capture all current G0-G32 expected PASS outputs.

## P0-T02 — Add future gate slots
Add scripts/jobs for:
- G34A;
- G34B;
- G34C;
- G34D;
- G31C1;
- G34E;
- G34F;
- G34H;
- G31C2;
- G31D;
- G31E;
- G34G;
- G33A-D.

Initially they must not falsely PASS.

## P0-T03 — Secret-regression scanner
CI/static checks for:
- password fields serialized/logged;
- session tokens in localStorage/sessionStorage;
- plaintext vault patterns;
- provider requests containing vault values;
- deanonymized artifact provider upload.

## P0 PASS
Existing gates remain green and no new security gate is reported PASS.

---

# PHASE 1 — G34A/G34B LOCAL IDENTITY + LOGIN/SESSION

Goal: replace the unauthenticated localhost trust model.

Primary spec:
- `G34-IDENTITY-LOGIN-VAULT-ARCHITECTURE.md`
- `G34-AUTH-SESSION-REAUTH-PROTOCOL.md`

## P1-T01 — Auth persistence layer
Implement local auth database with:
- users;
- KDF parameters;
- UMK envelopes;
- authEpoch;
- rate-limit state;
- security events.

Recommended implementation decision to make before coding:
- SQLite for transactional local metadata;
- migration/version table;
- restrictive filesystem permissions.

## P1-T02 — Argon2id service
Implement:
- password normalization contract;
- salt generation;
- configurable release KDF policy;
- dummy account/KDF path;
- KDF upgrade/rewrap after successful login.

## P1-T03 — First-user bootstrap
Implement:
- zero-users-only bootstrap;
- first ADMIN;
- random UMK;
- encrypted UMK envelope;
- atomic race protection.

## P1-T04 — Session manager
Implement trusted-memory:
- random session handles;
- 15-minute idle deadline;
- 8-hour overall deadline;
- authEpoch checks;
- no restart persistence.

## P1-T05 — Login throttling
Implement exact backoff:
- failures 1-4: no added delay;
- 5: 30s;
- 6: 60s;
- 7: 2m;
- 8: 5m;
- 9: 15m;
- 10+: 30m;
- 24h quiet reset.

Index by protected `loginTag`, not plaintext guessed login.

## P1-T06 — Auth middleware
Public only:
- health;
- auth status;
- zero-user bootstrap;
- login.

All other API surfaces require authentication.

## P1-T07 — Lock/logout
Implement:
- immediate trusted-runtime revocation;
- key-cache cleanup;
- intent/grant invalidation;
- idempotent logout;
- user lock;
- restart = no session.

## P1-T08 — Login UI
Add:
- bootstrap screen;
- login;
- retry countdown;
- session warning;
- lock/logout;
- locked state that removes sensitive React state.

## P1-T09 — Activity classification
Ensure:
- deliberate user actions refresh idle;
- polling/streaming/OCR/animations do not.

## P1 tests
Must include:
- existing vs nonexistent timing/cost-class behavior;
- disabled account generic failure;
- throttling survives restart;
- no bearer in browser storage;
- idle and absolute expiry;
- background traffic does not refresh idle;
- authEpoch invalidation;
- UI raw text removed on lock.

## G34A PASS
First account/bootstrap/UMK envelope implemented.

## G34B PASS
Login/session/throttling/lock/logout implemented and all non-public API routes authenticated.

---

# PHASE 2 — G34C/G34D CASE ACL + KEY ENVELOPES

Goal: identity controls actual case access cryptographically, not only UI visibility.

## P2-T01 — Case ownership migration
Extend case metadata:
- createdByUserId;
- keyVersion;
- owner ACL.

Existing development cases require explicit migration/import ownership assignment.

Never silently assign old cases to an arbitrary account.

## P2-T02 — Case ACL service
Roles:
- OWNER;
- EDITOR;
- ANALYST;
- VIEWER.

Separate:
- app ADMIN role;
- case access role;
- `canReidentify`.

## P2-T03 — Case Data Key
For each new case:
- random 256-bit CDK;
- no plaintext storage.

## P2-T04 — Per-user key envelope
Implement:
- UMK-derived case-wrap keys;
- authenticated wrapping;
- key version/AAD.

## P2-T05 — Offline case sharing
Implement preferred per-user asymmetric keypair:
- public key stored in user directory;
- private key encrypted under UMK;
- owner can prepare case envelope for logged-out target user.

## P2-T06 — ACL middleware
Every case/document/upload/session/artifact route:
- resolve user;
- resolve case;
- verify role/capability.

## P2-T07 — Revocation
Implement:
- ACL removal;
- eager session impact where needed;
- documented strong-revocation path via CDK rotation.

## P2-T08 — Case list/open API
Add:
- list cases visible to user;
- open metadata;
- no automatic creation merely because UI mounts.

## P2-T09 — Case selector UI
Replace current startup auto-case model with:
- recent cases;
- open existing case;
- create new case;
- role/capability display.

## G34C PASS
Case ACL is enforced on all case-scoped access.

## G34D PASS
Per-user case-key envelopes and tested grant/revoke/key-rotation mechanics exist.

---

# PHASE 2B — G35A/G35B CASE WORKSPACE + FIRM TEMPLATE LIBRARY

Goal: one browsable workspace per legal case plus one reusable office-template library shared safely across authorized cases.

Primary spec:
- `G35-CASE-WORKSPACE-TEMPLATE-LIBRARY.md`

## P2B-T01 — Case file inventory
List persisted upload manifests and safe ZIP member metadata from exactly one selected case.

## P2B-T02 — Case file API
`GET /api/cases/:caseId/files`:
- requires READ;
- no arbitrary path parameter;
- metadata only in G35A.

## P2B-T03 — Case workspace UI
When case selection changes:
- clear prior-case file inventory;
- load only selected case files;
- show filename/type/size/time/archive members.

## P2B-T04 — Shared template store
Create application scope:
`shared/templates/template_<opaque-id>/`.

Persist:
- manifest;
- original DOCX/ODT;
- hash;
- safe filename;
- creator user id.

## P2B-T05 — Shared template permissions
Initial policy:
- authenticated users: list metadata;
- ADMIN: add template;
- no case ACL row is created for a template.

## P2B-T06 — Cross-case template reference
`GET /api/cases/:caseId/templates` first verifies READ for that case and then returns references to the same shared library.

No physical copy into the case.

## P2B-T07 — Template UI
Show common office templates beside the selected case.
ADMIN may add a template.
Changing cases does not duplicate or move the shared template.

## G35A PASS — IMPLEMENTED / VALIDATED
Authorized user can browse the persisted file inventory of one selected case without seeing another case's files.

Validated code SHA: `181e439232dac1c3e00f9cb45fd1596329d986a8`.

## G35B PASS — IMPLEMENTED / VALIDATED
A single stored firm template can be listed from multiple independently authorized cases without weakening case ACL or copying the template.

Validated code SHA: `181e439232dac1c3e00f9cb45fd1596329d986a8`.

## G35C — later generation integration
After G31C2/G31D/G31E, selected `templateId` may supply a locally validated style/structure profile to deterministic generation. Raw template package bytes must not be sent automatically to AI.

---

# PHASE 2C — G36 LEGAL SKILL RUNTIME COMPLETENESS

Goal: the desktop runtime must not merely detect legal SKILL.md files; it must actually be able to read the canonical local skill tree on demand and prove that mandatory core resources were read.

Current pre-G36 gap identified on 2026-09-16:
- registry safely resolves `modules/`, `references/`, `shared/` and cross-skill paths;
- execution loaded only `prawny-router-v3`, `prawo-polskie-v2` and the selected DR SKILL.md body;
- `LegalSession` previously emitted `resource_read=OK` for three core resources after existence checks only, without injecting their content;
- arbitrary `view ...` references inside the corpus were not executable by the provider runtime.

## P2C-T01 — Real core-resource reads
The always-required router resources are opened as UTF-8 and their exact content is inserted into the execution system prompt.

Fail closed on missing, unreadable or empty core resources.

## P2C-T02 — Safe legal corpus tools
Every legal provider session exposes local-only tools:
- `list_legal_skills`;
- `list_legal_resources`;
- `read_legal_resource`.

No arbitrary operating-system path is accepted.

## P2C-T03 — Full-resource pagination
Large text modules can be read in deterministic chunks using offset/nextOffset until EOF.

This makes the complete textual resource readable without placing the whole corpus in one prompt.

## P2C-T04 — Cross-skill and shared reads
Support canonical semantic paths:
- `modules/...`;
- `references/...`;
- `shared/...`;
- `<other-skill>/SKILL.md`;
- other text resources under a registered skill.

## P2C-T05 — Corpus/tool audit
Record legal corpus list/read decisions and close the G36 gate as BLOCKED after an invalid/path-escape resource attempt.

## P2C-T06 — Current-law separation
Local skill content is workflow/domain context, not fresh proof of statutory or case-law validity.

Legal citations still require the existing official-source verification tools and temporal gates.

## G36 PASS
PASS requires:
- actual core resource content present in execution prompt;
- full paginated module read;
- shared/cross-skill access;
- path traversal blocked;
- deterministic validator and full regression green.

Important semantic limit:
- G36 means the runtime can access the full canonical textual skill corpus on demand;
- it does not mean every file is preloaded into every prompt;
- it does not convert COV/B+ corpus coverage into a claim that every provision of Polish law is stored locally or current without live verification.

---

# PHASE 3 — G31C1 ENCRYPTED PERSISTENT PRIVACY VAULT

Goal: reversible privacy mapping survives restart without plaintext persistence.

## P3-T01 — Vault binary format
Implement LMV1:
- magic/version;
- cipher suite;
- key version;
- generation;
- nonce;
- AAD;
- ciphertext/tag.

## P3-T02 — Key derivation
`CDK → HKDF-SHA256(... "lex/privacy-vault/v1") → PVK`.

## P3-T03 — Canonical payload
Persist only:
- document counters;
- token;
- kind;
- value;
- creation metadata.

Do not persist duplicate reverse map.

## P3-T04 — Atomic writer
Implement:
- partial;
- fsync/close;
- decrypt verification;
- atomic replace;
- generation monotonicity.

## P3-T05 — Runtime vault adapter
Replace production RAM-only `PseudonymizationVault` storage with:
- unlocked per-case in-memory view;
- encrypted persistence backend;
- exact token lookup;
- fail closed on unknown/corrupt token.

## P3-T06 — Restart round trip
Test:
- pseudonymize;
- close runtime;
- restart;
- authenticate;
- reopen case;
- recover exact mapping.

## P3-T07 — Corruption tests
- truncated file;
- modified tag;
- wrong case AAD;
- stale generation;
- wrong key version.

All fail closed.

## G31C1 PASS — IMPLEMENTED / VALIDATED

No plaintext reversible map is written to disk and mapping survives restart.

Validated code SHA: `8c1a4c3c61b3e3b28c5c648adcfbf932c7dd7394`.

Validation:
- restart round-trip;
- wrong key fail-closed;
- corruption/truncation fail-closed;
- wrong case/AAD fail-closed;
- wrong keyVersion fail-closed;
- stale generation/meta mismatch fail-closed;
- CDK rotation rekeys the vault.

---

# PHASE 4A — G34E/G34F RECOVERY + TRANSACTION REAUTH

Goal: secure lifecycle and exact authorization before clear-PII operations.

## P4A-T01 — Recovery envelope
Implement high-entropy one-time recovery secret:
- shown once;
- creates second UMK envelope;
- no security questions.

## P4A-T02 — Password change
- verify current password;
- unwrap same UMK;
- new salt/KDF;
- rewrap only;
- authEpoch++;
- revoke other sessions/grants.

## P4A-T03 — Recovery flow
- recover same UMK;
- set new password;
- rotate recovery material;
- authEpoch++;
- revoke sessions/grants.

## P4A-T04 — Deanonymization intent
Bind:
- session/user;
- case;
- artifact;
- SHA-256;
- vault generation;
- case key version;
- 5-minute expiry.

## P4A-T05 — Password step-up
Exact G34F protocol:
- fresh Argon2/UMK confirmation;
- same throttling counter;
- ACL + `canReidentify`;
- no vault open yet.

## P4A-T06 — One-use grant
- 90 seconds;
- one use;
- transaction-bound;
- consume before vault unlock.

## P4A-T07 — Sensitive download ticket
- same session;
- exact final hash;
- 60 seconds;
- one use.

## P4A-T08 — Cancellation
Session revoke during deanonymization:
- abort;
- remove/quarantine partial;
- never mark downloadable.

## G34E PASS — IMPLEMENTED / VALIDATED
Recovery/password lifecycle preserves the same UMK and existing case CDKs.

Validated code SHA: `f057a0bb22ba89c8a4eb9cb5f9dc774c8cde6524`.

## G34F1 PASS — IMPLEMENTED / VALIDATED
Transaction reauthorization foundation requires exact target binding, fresh password, one-use grant, expiry and automatic session revocation.

Validated code SHA: `f057a0bb22ba89c8a4eb9cb5f9dc774c8cde6524`.

## Full G34F — OPEN
Do not mark full G34F PASS until G31D/G31E deanonymization/export requires and consumes the G34F grant with no bypass path.

---

# PHASE 4B — CASE LIFECYCLE / USER EXPERIENCE

Can run partly in parallel with Phase 4A after G34C.

Goal: remove current prototype behavior where every app mount creates a new case.

## P4B-T01 — Case registry
List:
- display name;
- createdAt/updatedAt;
- user's case role;
- non-sensitive counts/status.

## P4B-T02 — Open/close active case
UI explicitly opens one case.

## P4B-T03 — Rename/archive
Owner/editor policy for display metadata.

## P4B-T04 — Delete flow
OWNER + recent reauth:
- precise deletion preview;
- encrypted key/data deletion;
- audit.

## P4B-T05 — Existing-case migration
Detect legacy G31A cases and require explicit owner import/migration.

No silent deletion/move.

## P4B PASS
Restart allows the same authorized user to log in and reopen an existing case without re-uploading files.

---

# PHASE 5 — G34H FULL SENSITIVE CASE ENCRYPTION AT REST

Execution split:

- G34H1 — encrypted incoming/raw upload container;
- G34H2 — encrypted ZIP extracted members + working-file hygiene;
- G34H3 — encrypted protected/document persistence;
- G34H4 — encrypted artifacts/audit-sensitive payloads;
- G34H5 — explicit legacy plaintext migration and verification.



Goal: Lex login cannot be bypassed by directly browsing the case directory.

This is mandatory for secure SHARED_WORKSTATION claims.

## P5-T01 — LME encrypted blob/container
Define versioned authenticated format for:
- raw upload;
- extracted member;
- OCR/raw source;
- sensitive artifact.

## P5-T02 — Opaque storage IDs
No original client/matter filename in filesystem path.

Original filename lives inside encrypted metadata.

## P5-T03 — Streaming encrypt/decrypt
Avoid loading large files entirely in RAM where practical.

## P5-T04 — Upload store migration
Change:
- HTTP/store path;
- incoming originals;
- hashes/manifest behavior.

## P5-T05 — ZIP extraction into secure store
Safe ZIP logic remains.
Extraction worker output must be re-encrypted immediately or adapted to encrypted staging.

No long-lived plaintext extracted tree.

## P5-T06 — OCR worker plaintext contract
Where workers need a path:
- random Lex work dir;
- restrictive permissions;
- lifecycle tied to job;
- cleanup on success/failure/startup recovery.

## P5-T07 — Artifact encryption
Deanonymized final artifact remains encrypted at rest in Lex store.
Plaintext exists only:
- transiently during local processing;
- in explicitly downloaded/exported user file.

## P5-T08 — Migration
Explicit migration of old plaintext G31A cases:
- preflight;
- sufficient disk space;
- encrypt to staging;
- verify;
- atomic cutover;
- never delete old copy before validation;
- user-visible recovery path.

## P5-T09 — Filesystem adversarial tests
Prove direct inspection of Lex data directory does not expose:
- upload contents;
- original filenames;
- vault values;
- final artifact PII.

## G34H PASS
Secure shared-workstation at-rest boundary is real, not only an API permission layer.

---

# PHASE 6 — G31B2 STORED FILE / ZIP MEMBER PROCESSING

Goal: case files persist once and are processed from stored references rather than browser re-upload.

## P6-T01 — Stored-file identity
Introduce opaque `fileId` referencing:
- direct upload;
- extracted ZIP member.

## P6-T02 — Trusted type detection
Do not rely only on extension:
- signature/parser confirmation where applicable.

## P6-T03 — Process selected member API
User explicitly selects one stored file/member.
Server resolves it from manifest/fileId.
No arbitrary relative paths supplied by browser.

## P6-T04 — Existing supported formats
PDF/JPEG/PNG/WebP/TIFF:
- decrypt/stage locally;
- reuse G27/G27A pipeline.

## P6-T05 — DOCX/ODT input extraction
Add local text-intake adapters only if needed for source-document analysis.
This is separate from generated DOCX/ODT output.

No arbitrary active content execution.

## P6-T06 — ZIP UI
- full safe manifest;
- filter/search;
- explicitly choose files;
- process selected;
- no automatic provider attachment.

## P6 PASS
Existing stored case material can be reopened and processed without re-upload.

---

# PHASE 7 — G31C2 TYPED AUTHORING AST + GENERATION ALIASES

Goal: provider generates semantics, never OOXML/ODF.

## P7-T01 — LegalDocumentAst schema
Define exact:
- document type;
- locale;
- style profile;
- block node union;
- inline node union;
- limits.

## P7-T02 — AST validator
Reject:
- unknown node kinds;
- excessive depth/size;
- duplicate ids;
- invalid refs;
- unsupported embedded/executable content.

## P7-T03 — Backend vault lookup API
Internal only:
- `hasToken`;
- `resolveToken`;
- safe enumeration/manifest as needed.

Never expose clear token map over public HTTP.

## P7-T04 — Generation alias registry
Map:
`LMPII alias → documentId + source token`.

Prevent collisions across documents.

## P7-T05 — Protected context remapping
Before provider call:
- selected G32 chunks only;
- replace source document tokens with generation aliases;
- no raw values.

## P7-T06 — Typed `pii_ref`
PII token cannot appear as arbitrary text node.
Unknown aliases block.

## P7-T07 — Privacy regression gate
Scan model-created normal text for newly emitted identifiers.

## P7-T08 — Provider structured-output contract
Model returns strict JSON AST/patch, not XML.

## G31C2 PASS
Provider can author a validated tokenized legal document AST without access to clear values.

---

# PHASE 8 — G31D DETERMINISTIC DOCX

Goal: production DOCX with local re-identification and exact download.

## P8-T01 — Renderer technology spike
Select deterministic ZIP/XML implementation.
Criteria:
- fixed timestamps/order;
- stable IDs;
- no volatile metadata;
- exact control over package parts.

## P8-T02 — Core OOXML renderer
Implement:
- document;
- styles;
- numbering;
- settings;
- font table;
- headers/footers;
- footnotes as scoped.

## P8-T03 — Legal style profiles
Implement corpus design rules:
- Arial 11.5;
- margins;
- headings;
- justification;
- spacing;
- lists/tables;
- signatures.

## P8-T04 — Tokenized render
Every PII ref rendered predictably in visible-text scope.

## P8-T05 — Token gate B
No malformed/unknown/source PII token and no alias in forbidden package locations.

## P8-T06 — File-to-file deanonymizer
`tokenized.docx → final.partial`.
Handle split runs structurally.

## P8-T07 — Token gate C
Zero remaining privacy tokens.

## P8-T08 — OOXML validator
Required parts/XML relationships/forbidden content.

Reject:
- macros;
- ActiveX;
- OLE;
- altChunk;
- external templates/media.

## P8-T09 — Re-read final visible text
Feed exact extracted final text to final export/legal gate.

## P8-T10 — Local LibreOffice QA
Headless reopen/render preview.
CI strategy can separate deterministic structural gate from optional heavier visual integration.

## P8-T11 — Encrypted artifact store/download
Integrate G34F grant and G34H storage.
Immediate one-use download ticket.

## G31D PASS
DOCX is deterministic, locally deanonymized, validated and downloadable.

---

# PHASE 9 — G31E DETERMINISTIC ODT

Goal: same semantic pipeline for ODT.

## P9-T01 — Extend G10/export contract
Add ODT as HYBRID-required equivalent before renderer PASS.

## P9-T02 — ODF renderer
Required package:
- first uncompressed `mimetype`;
- content.xml;
- styles.xml;
- meta.xml;
- settings.xml;
- META-INF/manifest.xml.

## P9-T03 — Deterministic style mapping
Same legal semantics as DOCX.

## P9-T04 — Token gate B
Same alias/location rules.

## P9-T05 — File-to-file ODF deanonymizer
Handle split spans/text nodes.

## P9-T06 — Token gate C
Zero remaining privacy tokens.

## P9-T07 — ODF package validator
Reject:
- scripts;
- macros;
- arbitrary embeds;
- external linked content;
- unknown forbidden parts.

## P9-T08 — Local re-read/LibreOffice QA
Same final legal/export principle.

## P9-T09 — Encrypted artifact/download
Same G34F/G34H path.

## G31E PASS
ODT reaches parity with DOCX for required release behavior.

---

# PHASE 10 — G34G TAURI PRODUCTION TRUST BOUNDARY

Goal: desktop production UI does not hold reusable runtime authentication secrets.

## P10-T01 — Tauri shell
Reuse React/Vite UI.

## P10-T02 — Narrow command surface
Examples:
- auth status/login/logout/lock;
- case list/open/create;
- upload/process;
- privacy review;
- provider operation;
- generate artifact;
- reauthorize/download.

No generic shell/command execution from web UI.

## P10-T03 — Session ownership
Rust owns:
- active session handle;
- sensitive IPC state;
- OS lock lifecycle integration.

React never receives reusable bearer secret.

## P10-T04 — Secret store integration
Use platform key store / Stronghold only through Rust-side narrow APIs.

## P10-T05 — OS lock/resume
Integrate workstation lock/suspend/resume with normative G34 protocol.

## P10-T06 — Loopback runtime hardening
If runtime remains separate process:
- dynamic/authenticated IPC/loopback bootstrap;
- no unauthenticated reusable port endpoint;
- child lifetime bound to desktop shell as appropriate.

## G34G PASS
Production session and secret boundary is enforced outside browser JavaScript.

---

# PHASE 11 — G33A/G33B INSTALLER PAYLOAD

Goal: reproducible full offline package.

## P11-T01 — Freeze release dependency versions
Exact:
- Node;
- Python;
- npm runtime dependencies;
- Paddle;
- Torch;
- Stanza;
- models;
- LibreOffice;
- WebView2 prerequisite;
- VC runtime.

## P11-T02 — Component lock
Production signed manifest:
- exact version;
- target architecture;
- source/provenance;
- license;
- hashes;
- size;
- min OS;
- probe.

## P11-T03 — Private runtimes
Build application-private:
- Node/runtime;
- Python;
- Python packages;
- model assets;
- LibreOffice;
- corpus.

No install-time public `pip install` or `npm install`.

## P11-T04 — Offline prerequisites
Bundle only prerequisites actually needed for target:
- WebView2 offline installer;
- VC runtime where necessary.

## P11-T05 — License/compliance bundle
Produce notices/license inventory for redistributed runtimes/models.

## G33A PASS
Component manifest is immutable/reproducible and complete.

## G33B PASS
Clean offline VM can install all required runtime components from package.

---

# PHASE 12 — G33C/G33D GUIDED INSTALLER / REPAIR / UPDATE

Goal: step-by-step setup with real health state.

## P12-T01 — Native installer
Windows x86-64 first release target.

Per-user default.
No PATH pollution.
No global Python/Node ownership.

## P12-T02 — First-run wizard
Steps:
1. welcome/privacy;
2. environment scan;
3. install plan;
4. data location;
5. install/repair;
6. local self-test;
7. create first ADMIN;
8. optional provider setup;
9. ready.

## P12-T03 — Real progress/animations
State-driven only:
- probe;
- extract;
- verify;
- self-test.

Respect reduced-motion.
No fake timer progress.

## P12-T04 — Transactional version install
`version.staging → verify → atomic current pointer`.

## P12-T05 — Repair
Rehash/restore application payload only.
Never delete:
- cases;
- vault;
- account db;
- provider secrets.

## P12-T06 — Update
Signed update metadata/artifact.
Rollback on failed self-test.

## P12-T07 — Uninstall
Default preserves case data.
Explicit second confirmation to delete data.

## P12-T08 — Installer self-test
Must cover:
- auth DB;
- bootstrap lock;
- login failure/success;
- vault restart;
- case ACL;
- OCR;
- NER;
- DOCX/ODT synthetic round trip;
- LibreOffice;
- encrypted at-rest paths.

## G33C PASS
Guided setup/repair UI works.

## G33D PASS
Update/rollback/uninstall and full clean-machine self-test pass.

---

# PHASE 13 — RELEASE HARDENING

Goal: prove integrated behavior on an actual release candidate.

## P13-T01 — Clean-machine matrix
At minimum:
- clean Windows 11 x86-64;
- no Node;
- no Python;
- no LibreOffice;
- no provider key;
- offline during install/self-test.

## P13-T02 — Multi-user acceptance
Two local Lex users:
- independent login;
- user B cannot list/read A-only case;
- grant B access;
- revoke;
- rotate key;
- B loses future cryptographic access.

## P13-T03 — Restart/crash matrix
Crash during:
- vault save;
- case encryption migration;
- DOCX deanonymization;
- installer update.

Recover without false PASS.

## P13-T04 — Filesystem inspection
No plaintext:
- vault map;
- upload;
- extracted source;
- OCR raw data;
- sensitive stored artifacts.

## P13-T05 — Privacy/provider trace
Prove provider traffic contains:
- protected chunks;
- approved generation aliases;
and never:
- clear PII;
- vault;
- decrypted final artifact.

## P13-T06 — Update migration test
Old release data → new release:
- backup;
- migration;
- validation;
- rollback path.

## P13-T07 — Supply-chain validation
- package signatures;
- component manifest;
- hash verification;
- dependency inventory.

## P13-T08 — Final release report
One report containing:
- exact commit;
- installer hash;
- component lock hash;
- all gate results;
- VM acceptance evidence;
- known limitations.

---

# PARALLEL TRACK — G30 OPEN WEB DISCOVERY

G30 is independent from secure local document/installer critical path.

## G30-T01 — Local SearXNG discovery architecture
- local service;
- unrestricted public-domain discovery;
- source-tier classification after discovery.

## G30-T02 — Tool broker integration
- provider cannot bypass safety/policy;
- query/result audit;
- source URL/evidence normalization.

## G30-T03 — Legal-source routing
Discovery is not evidence by itself.
Discovered source must pass appropriate legal verification.

## G30-T04 — Privacy boundary
Never send raw case PII into search automatically.
User intent + protected query construction.

## G30 PASS
Only when deterministic + live tests prove search discovery cannot bypass source verification/privacy controls.

---

# 5. Cross-cutting test matrix

Every security/storage phase must test:

### Positive
- normal single-user path;
- multi-user authorized path;
- restart/resume;
- successful export.

### Authorization negative
- wrong user;
- wrong case;
- insufficient role;
- missing `canReidentify`;
- disabled account;
- expired session;
- stale authEpoch.

### Crypto negative
- wrong key;
- modified ciphertext;
- modified AAD;
- stale key version;
- stale vault generation;
- truncated file.

### Race/crash
- simultaneous first-user bootstrap;
- simultaneous vault update;
- case access changed mid-operation;
- session revoked mid-job;
- process killed before atomic rename.

### Privacy
- no clear PII in logs;
- no clear PII in public metadata;
- no vault in browser;
- no vault/provider crossing;
- no persistent session secret;
- no provider after deanonymization grant consumption.

### Filesystem
- traversal;
- symlink;
- ZIP bomb;
- unsafe filename;
- permission denial;
- disk full;
- stale partial files.

---

# 6. Migration plan from current development state

Current development data cannot be silently treated as secure multi-user data.

Migration wizard/process must classify:

### Legacy case
Current G31A layout with plaintext originals/extracted files.

### Migration steps
1. authenticate destination OWNER;
2. inventory legacy case;
3. show case/display metadata;
4. choose import;
5. generate CDK;
6. encrypt files into new secure staging;
7. initialize encrypted vault;
8. verify hashes/counts;
9. atomically register new secure case;
10. retain old legacy directory until user explicitly approves deletion.

Do not silently convert/remove legacy source data.

---

# 7. Definition of first installable release

The first installer may be called release-ready only when all are PASS:

- existing G0-G29/G27A/G28A/G31A/G31B/G32;
- G34A;
- G34B;
- G34C;
- G34D;
- G31C1;
- G34E;
- G34F;
- G34H;
- case reopen/lifecycle;
- stored-file processing;
- G31C2;
- G31D;
- G31E;
- G34G;
- G35A;
- G35B;
- G35C template-generation integration;
- G36 legal skill runtime completeness;
- G33A;
- G33B;
- G33C;
- G33D;
- final clean-machine acceptance.

G30 can remain a separately scoped release capability if explicitly excluded from the first desktop package.

---

# 8. Recommended execution batches

To keep reviews manageable:

### Batch A — Identity foundation — COMPLETE / PASS
P0 + P1

Validated code SHA: `b3783309189a6d043fc077e52c736e16b64c10d5`  
Validation run: `35069444351`  
F-138: `35069444331`

### Batch B — Case authorization/key ownership — COMPLETE / PASS
P2

Validated code SHA: `a41fd86dd550dc41c93705edc423516d05199d8c`  
Validation run: `35072926001`  
F-138: `35072925987`

### Batch C — Vault + recovery + reauthorization
P3 + P4A

### Parallel Core Batch — Legal skill runtime completeness
P2C / G36

### Batch D — Case lifecycle + encrypted file store
P4B + P5

### Batch E — Stored-file processing + authoring AST
P6 + P7

### Batch F — DOCX
P8

### Batch G — ODT
P9

### Batch H — Tauri trust boundary
P10

### Batch I — Installer payload
P11

### Batch J — Installer UX/update/repair
P12

### Batch K — Release acceptance
P13

At the end of every batch:
- update PR;
- append BUILD-LOG only for actual implemented PASS work;
- publish validation evidence;
- keep failed/open gates explicit.

---

# 9. Immediate next implementation batch

Completed/validated on the current critical path:
- G34A-G34E;
- G34F1 foundation;
- G31C1;
- G35A/G35B;
- G34H1/G34H2.

Parallel work in progress:
- G36 legal skill runtime completeness.

Next: **G34H5 — explicit legacy plaintext migration/removal**, including a fail-closed review of remaining plaintext case metadata before any full G34H/shared-workstation claim.

Execution order:

1. define the LMV1 authenticated vault envelope and canonical payload;
2. derive a dedicated privacy-vault key from the current case CDK using HKDF with a separate label;
3. persist no clear token/value mapping;
4. implement atomic `.partial → verify → rename` vault updates;
5. enforce case ACL before every vault read/write;
6. implement runtime restart round-trip using the current authenticated CDK envelope path;
7. fail closed on wrong case AAD, wrong key version, modified tag, truncation and stale generation;
8. integrate the existing pseudonymization service with the encrypted per-case vault;
9. only after G31C1 is green, implement password/recovery lifecycle G34E;
10. implement artifact/case-bound deanonymization intent and fresh password step-up G34F;
11. issue one-use, short-lived reidentification grants and sensitive download tickets;
12. prove session revoke/cancel removes partial sensitive outputs;
13. run the full regression suite before beginning G34H encrypted raw-file migration.

Do not expose persistent deanonymization simply because `canReidentify` is true; G34F remains an independent mandatory step-up gate.

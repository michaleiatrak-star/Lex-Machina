# Retrospective Implementation Audit — 2026-09-16

Status: **COMPLETED — CURRENT VALIDATED GATES CONSISTENT; OPEN GATES REMAIN EXPLICIT**

Validated implementation SHA used for the final regression:

`4599d4827eb724c480bb3c563a7b58134b844bdf`

Evidence:
- Lex Runtime Validation `35091284197` — success
- F-138 structural audit `35091284195` — success
- G17/G19/G20/G22 live probes — success
- G14-G35 web tests/build/bundle — success

This audit was requested to verify whether previously completed steps were actually implemented correctly rather than relying only on roadmap labels.

---

## 1. Audit method

The audit used four independent checks:

1. **Historical evidence cross-check**
   - checked validated implementation SHAs recorded in build reports;
   - checked GitHub Actions runs associated with those SHAs;
   - distinguished push-triggered runs from pull-request-triggered runs.

2. **Current full regression**
   - re-ran the current code through all executable deterministic gates in the main Runtime Validation workflow;
   - re-ran live official-source probes;
   - re-ran web tests/build/bundle safety.

3. **Critical-path code inspection**
   - authentication/session memory boundary;
   - ACL before case-key use;
   - per-user CDK envelopes and rotation;
   - encrypted privacy vault;
   - recovery/password rewrap;
   - transaction reauthorization;
   - encrypted upload/document/artifact storage;
   - rotation coordinator production wiring;
   - shared template boundary;
   - legal-skill runtime access.

4. **Claim-vs-implementation review**
   - checked that larger phases are not marked PASS merely because a subgate is complete;
   - checked known limitations remain documented.

---

## 2. Historical validation evidence

The following representative validated SHAs were independently confirmed to have successful Runtime Validation and F-138 runs:

| Area | Validated SHA | Result |
|---|---|---|
| G0-G24 era | `3f55b92eed6d8b94884b6fc9798e10c59bf45f15` | PASS |
| G25 | `9e3ab1fd95aedb68caa8591efe2f81bc780a1232` | PASS |
| G31A/G31B | `56134cfa983e8ea88957e08ed46c6d8d3c5565c7` | PASS |
| G34A/G34B | `b3783309189a6d043fc077e52c736e16b64c10d5` | PASS |
| G34C/G34D | `a41fd86dd550dc41c93705edc423516d05199d8c` | PASS |
| G35A/G35B | `181e439232dac1c3e00f9cb45fd1596329d986a8` | PASS |
| G31C1 | `8c1a4c3c61b3e3b28c5c648adcfbf932c7dd7394` | PASS |
| G34E/G34F1 | `f057a0bb22ba89c8a4eb9cb5f9dc774c8cde6524` | PASS |
| G34H1/H2 | `32bb2106c1293448e5ae8fbca1b3d416d27d0d7d` | PASS |
| G34H3 | `0db39cee7af26d1304f40fb6987af0cb0d320235` | PASS |
| G34H4 baseline | `bfa79b656e302dda37ab000bda08c55f2f889525` | PASS |
| G36 + regression fixes | `5c19ec48f2c25b5bee7c39a63717e7c808cb3a3e` | PASS |
| G34H5 + migration HTTP boundary | `4599d4827eb724c480bb3c563a7b58134b844bdf` | PASS |

Older build notes sometimes cite a push run while commit-oriented tooling returns a pull-request run for the same SHA. Direct run inspection confirmed those are separate successful runs of the same commit, not mismatched evidence.

---

## 3. Gate-by-gate audit outcome

### G0/G1/G2/G3
Correctly scoped.
- G0 is the baseline branch/corpus pin, not a missing executable validator.
- G1/G2 validate corpus/semantic path integrity and traversal safety.
- G3 enforces router-first bootstrap and fail-closed mandatory-resource presence.
- G36 later strengthened the meaning of actual resource reading; this does not invalidate the earlier G3 scope.

### G4-G13
No regression found.
- tool broker remains default-deny;
- provider abstraction and credential boundary remain server-side;
- export/source/audit/routing gates continue to pass current deterministic regression;
- localhost bind restriction remains enforced.

### G14-G26
No regression found.
- current web suite/build/bundle is green;
- evidence metadata remains sanitized;
- provider configuration status exposes booleans, not keys;
- current live source probes pass.

### G27/G27A/G28/G28A/G29
No regression found in current tests.
- complete PDF/image OCR pipelines remain local;
- privacy review remains before provider attachment;
- reversible clear mapping is not returned through public APIs;
- G31C1 supersedes the former RAM-only persistence limitation for finalized case-backed privacy mappings.

### G31A/G31B
Historical PASS remains valid for the original foundation.
- safe case identity and ZIP constraints remain covered.
- plaintext-at-rest behavior from the original foundation has since been superseded for new production intake by G34H1/H2.
- legacy plaintext data still requires G34H5 migration.

### G32
PASS remains valid.
- provider receives only server-resolved finalized protected chunks selected by documentId/chunk index;
- raw vault mapping is outside the provider session interface.
- existing explicit KEEP/LABEL behavior remains user-authorized clear content and therefore must still be treated carefully.

### G34A/G34B
PASS remains supported.
- sessions are process-memory only;
- runtime stores only token digests for lookup;
- UMK is zeroed on revocation;
- idle/overall expiry is enforced in trusted runtime;
- authEpoch/session revocation remains implemented;
- login throttling remains persistent.

### G34C/G34D
PASS remains supported.
- case ACL is checked before case-key operations;
- application ADMIN does not automatically imply case access;
- CDK is independent per case;
- offline grants use per-user asymmetric sharing material;
- revoke/key rotation path remains tested.

### G31C1
PASS remains supported.
- LMV1 AES-GCM vault is file-backed;
- wrong key/case/version/corruption fails closed;
- queue serialization prevents lost in-process updates;
- CDK rotation includes the vault.

### G34E
PASS remains supported.
- password change and recovery rewrap the same UMK;
- case CDKs do not change merely because password changes;
- old sessions and old recovery code are revoked/rotated.

### G34F1
PASS remains correctly scoped as a foundation only.
- exact artifact/hash/vault-generation/key-version binding exists;
- fresh password step-up exists;
- grant is short-lived and one-use;
- lock/logout/expiry revokes it.
- **Full G34F is still OPEN** because no real G31D/G31E deanonymization/export route consumes the grant yet.

### G34H1/H2/H3/H4/H5
PASS remains supported after current regression.
- incoming uploads and ZIP members: LME1;
- document source/protected state: LME1;
- artifacts: LME1;
- production key rotation is wired to vault + upload + document + artifact stores;
- G34H5 migrates the known legacy plaintext upload layout only after hash/size validation and encrypted round-trip verification;
- unknown/non-empty legacy documents/artifacts/audit content is preserved and blocks migration;
- migration is idempotent and records security events;
- no secure-erase guarantee is claimed for SSD/flash media.
- **The G34H1-H5 encrypted-at-rest gate set is now complete.**

Engineering qualification:
- direct production HTTP uploads are still accepted through bounded whole-body buffering before encrypted persistence; true stream-to-encrypted-store intake remains a roadmap hardening item.

### G35A/G35B
PASS remains correctly scoped.
- selected-case file inventory is ACL filtered;
- shared template scope does not provide cross-case file access;
- one template can be referenced from multiple cases without copying it.
- shared template originals remain plaintext application-scope files; this is a known release concern and G35C generation integration remains open.

### G36
Newly implemented and validated.
- actual core resource content is read and injected;
- local corpus tools expose on-demand reads;
- traversal is blocked;
- real production corpus audit proves 32 skills / 16 DR / 1,187 supported text resources are fully readable.

---

## 4. Issues found by this retrospective audit

### Finding A — legal resource read semantics
Before G36, `resource_read=OK` for the three core resources meant successful resolution/existence, not actual content injection.

Resolution:
- fixed in G36;
- actual read is now required;
- unreadable/empty core resource fails closed.

### Finding B — no host implementation for arbitrary corpus `view`
Before G36, corpus instructions could name additional modules/resources, but the provider runtime had no controlled local read tool.

Resolution:
- added list/read corpus tools;
- full production corpus readability validator added.

### Finding C — G36 test-provider interaction
Adding corpus tools to every legal session caused the scripted test provider to auto-call the first tool even in tests that expected plain output.

Resolution:
- scripted auto-tool behavior is now explicit opt-in only for conformance testing.

### Finding D — finalization status regression during G36 integration
A blocked release path temporarily overwrote the underlying finalizer result.

Resolution:
- release status and finalizer status are separated again;
- G16 regression caught and verified the fix.

### Finding E — secure incoming parent robustness
After later storage refactoring, `SecureCaseUploadStore` could attempt to create an upload directory before `secure/incoming` existed.

Resolution:
- secure parent is created after case/key-version validation and before atomic per-upload directory creation;
- full regression is green.

### Finding F — stale G34 documentation status
Normative G34 documents still said implementation was entirely absent.

Resolution:
- status headers updated to distinguish implemented subgates from still-open full G34F/G34G/G34H5.

---

## 5. Phase closure audit

| Roadmap phase | Status | Evidence / remaining work |
|---|---|---|
| Phase 0 — baseline/test harness | CLOSED FOR CURRENT BASELINE | CI/browser/auth/vault/privacy regression coverage exists across G14, auth tests, G31C1/G32 and the main gate suite; it is distributed rather than one dedicated secret-scanner gate. |
| Phase 1 — identity/login/session | CLOSED | G34A/G34B PASS. |
| Phase 2 — ACL/key ownership | CLOSED | G34C/G34D PASS. |
| Phase 2B — workspace/templates foundation | CLOSED FOR G35A/G35B | G35A/G35B PASS; G35C is a later generation gate. |
| Phase 3 — encrypted privacy vault | CLOSED | G31C1 PASS. |
| Phase 4A — recovery/reauthorization | PARTIAL | G34E and G34F1 PASS; full G34F awaits real G31D/G31E deanonymization/export grant consumption. |
| Phase 4B — case lifecycle | PARTIAL | list/create/reopen/select and explicit legacy import exist; rename/archive/delete are not implemented. |
| Phase 5 — encrypted case storage | G34H GATES CLOSED / CHECKLIST PARTIAL | G34H1-H5 PASS; true streaming direct upload remains open and unknown legacy formats intentionally block rather than auto-delete. |
| Parallel G36 — legal skill runtime | CLOSED | 32 skills / 16 DR / 1,187 supported text resources readable; G36 PASS. |

Therefore the answer to “are all earlier stages closed?” is **no**: the validated security foundations are strong, but Phase 4A, Phase 4B and parts of the Phase 5 engineering checklist remain open.

---

## 6. No false full-phase claims

The audit confirms the following must remain OPEN:

- G30 Open Web Discovery;
- G31C2 typed authoring AST;
- G31D deterministic DOCX;
- G31E deterministic ODT;
- full G34F integration with real deanonymization/export;
- G34G Tauri production session boundary;
- G35C template-assisted generation;
- G33A-G33D installer execution;
- final release/clean-machine acceptance.

The installer must not be called release-ready until those required release gates are complete.

---

## 7. Current conclusion

After fixing the issues found during this audit, there is **no current evidence that a previously recorded implemented PASS gate is falsely marked PASS**.

Important qualification:
- a PASS is only for the exact scope of that gate;
- larger phases remain open where explicitly stated;
- latest full regression validates the present integrated code, not only historical snapshots.

Next critical path:
1. close case lifecycle gaps: rename/archive/delete + migration UX;
2. G31B2 stored-file/member processing;
3. G31C2 typed authoring AST;
4. G35C template profile integration;
5. G31D/G31E;
6. full G34F consumption/download integration;
7. G34G;
8. G33 installer execution.

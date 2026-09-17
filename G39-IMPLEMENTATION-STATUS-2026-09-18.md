# G39 implementation status — 2026-09-18

Branch: `feature/g39-execution-2026-09-17`  
PR: #51  
Scope: deterministic installer, on-demand Local AI, skill/application updates.

## Status legend

- **PASS** — implementation and relevant CI/acceptance are green on the current head.
- **IMPLEMENTED / VERIFYING** — implementation exists; current-head CI/acceptance is still required.
- **PARTIAL** — useful vertical slice exists, but the roadmap gate is not fully satisfied.
- **BLOCKED** — cannot be promoted safely until an external trust/configuration dependency is supplied.
- **OPEN** — not yet implemented.

## G39G — installer state machine

Status: **IMPLEMENTED / VERIFYING**

Implemented:

- deterministic states: FRESH / UPGRADE / REPAIR / CURRENT / DOWNGRADE_BLOCKED;
- downgrade fail-closed preinstall gate;
- Local AI is no longer part of application-health REPAIR criteria;
- installer-critical PowerShell bootstrap toolchain is explicitly embedded by NSIS and copied into `runtime/bootstrap` before execution;
- online/offline acceptance contract now treats Local AI as optional post-install provisioning;
- the state probe can discover an existing current-user install from the Tauri uninstall key and records the registered install root plus discovery source;
- an upgrade/repair attempt targeting a different directory than the registered installation fails closed with exit code 24 instead of creating a second inconsistent copy;
- the self-test covers a registered installation in a non-default directory, a correctly restored target path, and the mismatched-target block;
- Tauri's built-in maintenance page remains in use, avoiding a fork of the full NSIS template;
- an explicit Polish custom language file makes the maintenance choices user-facing as update-in-place / repair-reinstall / uninstall rather than the ambiguous default wording.

Evidence already observed on an earlier head:

- G39 Installer State Machine: PASS;
- F-138 structural audit: PASS.

Closure condition:

- current-head runtime validation, online installer acceptance and offline installer acceptance must all pass.

## G39F — application update transaction

Status: **IMPLEMENTED / BLOCKED FOR PRODUCTION SIGNING**

Implemented:

1. discovery of a newer GitHub release;
2. release asset requires GitHub-provided SHA-256 digest;
3. download into fixed staging root;
4. Authenticode verification with pinned publisher policy;
5. immutable receipt containing version, SHA-256, size and signer identity;
6. native Tauri handoff accepts only a constrained receipt token;
7. external update runner waits for the current process to exit;
8. private runtime process tree is stopped on Tauri `RunEvent::Exit`;
9. backup capacity check;
10. backup of installation files and uninstall registry metadata;
11. NSIS update with `/S /UPDATE /D=<existing install root>`;
12. post-install version check and runtime sidecar self-test;
13. rollback of files and registry on failure;
14. transaction journal with PREPARED / BACKED_UP / INSTALLING / VERIFYING / COMMITTED / ROLLING_BACK / ROLLED_BACK / ROLLBACK_FAILED states;
15. maintenance UI: check -> download+verify -> install+restart.

Production blocker:

- `applicationUpdate.trustedSignerThumbprints` is intentionally empty;
- application updates therefore fail closed until the production Authenticode certificate thumbprint is configured and release artifacts are signed by that certificate.

Negative unit tests now also prove that the signer policy rejects an empty trust root, malformed thumbprints and any weakened `SHA256_ONLY` policy.

Do not mark G39F PASS before a signed release acceptance test succeeds.

## G39E — skill update transaction

Status: **IMPLEMENTED / BLOCKED FOR PRODUCTION SIGNING**

Implemented:

- update discovery for ZIP + `LexMachina-Skills-Index.json` + detached `.sig`;
- verified GitHub release-asset SHA-256 for all three transport artifacts;
- independent Ed25519 publisher trust root from the installed release manifest;
- fail-closed behavior when the production skill signer is not configured;
- signed index schema with release version, bundle SHA/size, min/max app compatibility and per-skill version/SHA/dependencies;
- signed release version must equal the discovered release version;
- app compatibility is checked before downloading/activating the bundle;
- archive extraction into an isolated work directory;
- full corpus registry scan and declaration validation;
- exact skill-set, version, `SKILL.md` hash and dependency comparison against the signed index;
- candidate -> current atomic rename;
- previous version rollback if activation fails;
- installed marker stores signed-index SHA-256 and signer key id;
- maintenance UI exposes trust readiness and explains missing signer/index states;
- unit tests cover valid Ed25519 signature, tampered index, unknown signer and invalid schema.

Still required for full roadmap PASS:

- configure the real production Ed25519 public key in the release manifest;
- publish signed index/signature assets from the release pipeline;
- acceptance test against a real signed skills release;
- retained rollback package policy across restarts and post-restart healthcheck;
- negative integration tests for dependency mismatch and incompatible app version.

## G39A/B/D — Local AI runtime, model provisioning and UI

Status: **PARTIAL / VERIFYING**

Current architecture:

- Local AI is not installed with the application;
- user explicitly selects and provisions it after installation;
- only the selected model is downloaded;
- root: `%LOCALAPPDATA%\LexMachina\local-ai`;
- llama.cpp and GGUF are SHA-256 verified;
- persistent `config.json`;
- local inference requires no network after provisioning;
- Mistral NeMo and Bielik are available through the local OpenAI-compatible provider path without a cloud API key;
- legacy Bielik model identifier remains accepted.

Context policy:

- user-selectable range: 64,000–200,000 tokens;
- values above a model native context are explicitly marked `YARN_EXTENDED`;
- requested context must satisfy manifest range and step;
- after provisioning the runtime actually launches llama.cpp with the selected context and waits for `/health`;
- if the selected context cannot start successfully, the configuration is rolled back while downloaded files remain cached for a lower-context retry;
- successful provisioning/repair writes a local qualification receipt with model id, exact context, native/YaRN mode, validation timestamp and measured startup time;
- the Local AI UI shows the last hardware-qualified profile instead of presenting a configured context as implicitly validated;
- repair and deterministic model removal are implemented; removal clears only the selected GGUF/config/qualification and keeps the shared engine cache when appropriate.

Still required for full gates:

- GPU/backend discovery and selection;
- progress reporting during multi-GB downloads;
- explicit model-pack update discovery/versioning beyond repair/re-provision;
- benchmark matrix for 64k / 96k / 128k / 160k / 200k;
- explicit quality acceptance thresholds for extended context;
- signed model-pack metadata rather than relying only on fixed upstream URLs and hashes.

## G39C — effective extended context orchestrator

Status: **PARTIAL / VERIFYING**

Implemented:

- deterministic context budget module with explicit per-session report;
- local model sessions read the actually configured context window from the shared `LocalModelRuntime` instance without querying a cloud catalog;
- selected 64k–200k runtime context is therefore the budget input rather than a hard-coded context size;
- conservative reserves are kept for system/query content, output generation and safety margin;
- manually selected evidence has priority and is never silently truncated: an over-budget manual selection fails closed;
- case/firm retrieval fills only the remaining budget and is cut only at complete chunk boundaries;
- legacy sessions whose model context is unknown retain the previous 160k-character hard cap;
- existing deterministic local knowledge retrieval remains the source of case/firm knowledge chunks;
- existing `LEXDOC` citation markers remain validated against real document/chunk identifiers and exact quote locations;
- session audit/response exposes context strategy, model window, document budget, estimated usage and selected/omitted chunk/document counts;
- final local-document citations are re-resolved immediately before HTTP presentation; case-bound citations first restore the current encrypted document through case ACL/key access;
- changed/unavailable cited chunks fail closed with HTTP 409 before process-workflow state is advanced;
- UI distinguishes native model context, active runtime context and effective document-context usage;
- HTTP tests cover both successful citation refresh and source mutation between execution and presentation.

Still required before G39C PASS:

- summary backlinks for context compression;
- quality/regression benchmarks across 64k / 96k / 128k / 160k / 200k;
- token estimation calibration against the bundled tokenizer/runtime rather than the current conservative character heuristic.

A 200k llama.cpp context is not a substitute for retrieval/provenance gates.

## G39H/I — deterministic execution engine and skill migration

Status: **PARTIAL / VERIFYING**

Implemented deterministic execution foundation:

- router-first and core legal resources remain runtime-enforced by `LegalSession`;
- explicit deterministic execution-routing rules are evaluated before semantic scoring;
- process pleading has priority over simple-letter routing when both rules match;
- Polish `ł` normalization is deterministic for routing;
- workflow plans: `LEGAL_QUERY_V1`, `SIMPLE_LETTER_V1`, `PROCESS_PLEADING_V1`;
- deterministic phase order: PREFLIGHT -> SEMANTIC_EXECUTION -> FINALIZATION;
- simple-letter preflight requires the always-on M1/M2/M4/M8/M9 + naming + hybrid-validation resources to exist;
- process-pleading preflight requires AUTOMAT-STANOW, CP-GATE, MOD-STEP-TRACKER and SELF-CHECK-PISMA to exist;
- runtime checks actual `read_legal_resource` audit events after provider execution;
- missing mandatory fresh read blocks presentation fail-closed;
- source/citation/finalization gates remain deterministic and mandatory in every mode.

Implemented multi-turn process-pleading state slice:

- typed main stages: `CG_ACCEPTANCE -> W1 -> PRE_W2 -> W2 -> W3 -> FINAL`;
- full CP registry is represented in runtime state, including conditional W1 checkpoints and final quality/peer gates;
- canonical checkpoint order is enforced in code; a later checkpoint cannot be marked ready before the first unresolved checkpoint;
- every checkpoint has explicit `OPEN / PENDING_CONFIRMATION / CLOSED / NA` status;
- `FINAL` is invalid unless every checkpoint is `CLOSED` or `NA`, `CP-PEER` is closed and no confirmation is pending;
- CHECKPOINT mode requires explicit user confirmation before the runtime can permit the next provider execution;
- AUTO mode removes the user-confirmation stop but does not remove deterministic ordering or other invariant gates;
- state is persisted per `caseId` inside the existing AES-256-GCM encrypted case workspace;
- workflow state inherits case ACL and key rotation; tests verify checkpoint identifiers are not visible in the on-disk encrypted envelope and survive rekey;
- optimistic concurrency uses a monotonically increasing `revision`; stale provider turns cannot overwrite a newer user decision;
- HTTP execution calculates the same workflow selection as `LexExecutionEngine` before invoking a provider;
- process execution requires an active case, initialized state, accepted start, no pending confirmation and a non-final state;
- the runtime injects the exact active stage/checkpoint into the provider system context; it is not accepted from user request JSON;
- after a successful provider turn the runtime may mark only the exact permitted checkpoint as `PENDING_CONFIRMATION`;
- a dedicated pure execution gate is unit-tested for missing state, missing start acceptance, pending confirmation and stale revision;
- the desktop UI has deterministic controls for initialization, start acceptance, current checkpoint confirmation and continuation; it has no control that can directly mark a checkpoint as completed;
- conditional N/A decisions require an explicit bounded reason and valid optimistic-concurrency revision;
- workflow reset requires a dedicated confirmation token plus matching revision; stale reset/N/A requests fail with conflict;
- no public endpoint exists for `checkpoint-ready`; only the verified runtime execution gate can move semantic work into pending confirmation;
- document generation records a workflow requirement for process pleadings, and final deanonymization/export is guarded by the persisted workflow state: process artifacts requiring finalization cannot become final unless stage/documentStatus are FINAL and no checkpoint confirmation is pending; tokenized DOCX/ODT may exist earlier only as draft-safe artifacts.

Still required before G39H/I PASS:

1. deterministically evaluate conditional checkpoint applicability where possible (file counts, attachment presence, evidence counts, document classes) and record an explicit N/A reason rather than relying on semantic narrative;
2. make AUTO mode run a bounded sequence of semantic checkpoint nodes in one requested workflow without requiring repeated user messages, while preserving all deterministic invariant gates;
3. add end-to-end HTTP tests around ACL + encrypted workflow store + provider call suppression and final-artifact suppression;
4. migrate `analiza-sadowa-v6`;
5. migrate `analizator-dowodow-v3`;
6. migrate `analizator-przepisow-v2`;
7. migrate remaining execution skills.

Invariant:

- automatic mode may choose goals/skills, but security, privacy, source hierarchy, citation registry, provenance, STOP/fail-closed gates and final validation remain deterministic in every mode.

## G39J — release / supply-chain hardening

Status: **PARTIAL / BLOCKED FOR PRODUCTION TRUST CONFIGURATION**

Implemented in repo:

- release-critical online/offline/skill-candidate workflows pin `checkout`, `setup-node` and `upload-artifact` to exact commit SHA;
- Windows signing gate verifies that the CI PFX certificate thumbprint is already present in the committed application trust root; the signing secret cannot define its own trust root;
- Authenticode signing requires SHA-256, RFC3161 timestamping and a post-signature verification pass;
- negative CI self-test covers empty trust root and missing signing secret and must fail closed without producing a receipt;
- manual signed Windows release-candidate workflow builds the online installer, signs it, runs installed-copy acceptance, generates npm CycloneDX SBOMs and Rust dependency inventory, writes a release provenance receipt and requests GitHub build-provenance attestation;
- signed skill-update release-candidate workflow exists and requires an Ed25519 private key secret;
- application updater and skill updater remain fail-closed while their committed public trust roots are empty.

External / production blockers:

- configure the real production Authenticode certificate and commit its public thumbprint to `applicationUpdate.trustedSignerThumbprints`;
- configure the corresponding CI PFX/password secrets and execute a signed installer/update acceptance;
- configure the production Ed25519 skill signing key and commit its public key to the skill trust root;
- signed model-pack metadata/trust root is still required;
- protect `main` / release rules and required status checks in GitHub repository administration. The current GitHub integration cannot read or modify branch-protection settings (403: administration permission unavailable), so this cannot be marked PASS from this session;
- add/verify negative tests for a correctly hashed installer signed by an untrusted certificate and for tampered signed model metadata once model-pack signing exists.

## Current closure order

1. make current-head runtime validation green;
2. make current-head online installer acceptance green;
3. make current-head offline installer acceptance green;
4. add/update transaction tests for G39F without weakening the empty-signer fail-closed policy;
5. configure production signing and execute signed update acceptance;
6. complete G39E signed compatibility index;
7. complete Local AI model-manager actions and benchmark matrix;
8. implement G39C;
9. implement G39H/I;
10. complete G39J.

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

Status: **PASS**

Implemented and current-head G39G self-test passed:

- deterministic states: FRESH / UPGRADE / REPAIR / CURRENT / DOWNGRADE_BLOCKED;
- downgrade fail-closed preinstall gate;
- Local AI is no longer part of application-health REPAIR criteria;
- installer-critical PowerShell bootstrap toolchain is explicitly embedded by NSIS and copied into `runtime/bootstrap` before execution;
- online/offline acceptance contract treats Local AI as optional post-install provisioning;
- existing `currentUser` install location is restored through Tauri/NSIS registry state rather than defaulting to a fresh location;
- deterministic probe independently discovers the registered install root from HKCU uninstall metadata, with `InstallLocation` primary and `UninstallString` fallback;
- custom/non-default install locations are covered by the self-test;
- an attempted upgrade/repair into a different directory fails closed with `INSTALL_ROOT_MISMATCH` / exit 24 instead of creating a second inconsistent installation;
- the Polish maintenance language file is explicitly configured through `customLanguageFiles` and has a dedicated CI contract test for upgrade / repair / uninstall wording;
- F-138 structural audit remains PASS on the same tested line.

Closure evidence:

- G39 Installer State Machine job: **success** on commit `525e60d238892beb79ce51a453f243c8e6d0e8c0`;
- G39G no longer depends on production signing keys and is closed independently of G39F/G39J.

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
15. maintenance UI: check -> download+verify -> install+restart;
16. the staged Authenticode-signed EXE exposes a Windows `ProductVersion` that must normalize exactly to the discovered release version before the receipt is committed or NSIS is launched; a reused older signed installer under a newer GitHub tag therefore fails in staging, while the transaction runner independently re-checks the installed runtime version after NSIS and rolls back on mismatch.

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

Restart/rollback closure implemented:

- activation keeps the prior healthy overlay in `skills/previous` and marks the new overlay `PENDING_RESTART_VALIDATION`;
- runtime startup calls `recoverSkillOverlayForStartup()`, re-runs registry/dependency validation and records `ACTIVE_HEALTHY` only after restart validation;
- an unhealthy current overlay automatically rolls back to retained `previous`; if no valid previous overlay exists it falls back to the bundled corpus; if current/previous/bundled are all unhealthy startup fails closed;
- tests cover healthy restart, rollback to previous, rollback to bundled and no-healthy-copy failure;
- maintenance-level negative tests prove signed min/max app incompatibility and release/index version mismatch fail before ZIP download; dependency/hash/version mismatch of the extracted candidate is covered by candidate-index validation tests.

Still required for full roadmap PASS:

- configure the real production Ed25519 public key in the release manifest;
- publish signed index/signature assets from the release pipeline;
- acceptance test against a real signed skills release.

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
- qualification now requires the pinned llama.cpp `/tokenize` endpoint to calibrate three fixed non-sensitive Polish/legal samples; provisioning/reconfigure rolls back if tokenizer calibration fails, and legacy receipts without calibration are no longer accepted as qualified;
- the Local AI UI shows the last hardware-qualified profile instead of presenting a configured context as implicitly validated;
- repair and deterministic model removal are implemented; removal clears only the selected GGUF/config/qualification and keeps the shared engine cache when appropriate;
- multi-GB engine/model downloads are streamed to `.part`, report verified byte/percent progress to the runtime UI, and become cache entries only after SHA-256 verification;
- runtime reports RAM/CPU and detected Windows video controllers; the manifest pins both `CPU_X64_PORTABLE` and `VULKAN_X64`, with user-selectable `AUTO / VULKAN_X64 / CPU_X64_PORTABLE`; AUTO may try Vulkan only when an accelerator is detected and retains CPU fallback; GPU offload is reported as active only after the configured Vulkan backend passes runtime health/tokenizer qualification;
- model-pack update discovery uses a separate Ed25519-signed index trust root; update metadata is schema-validated, HTTPS-only and fail-closed while the production public key is absent;
- model updates are user-approved from the Local AI UI and may change only the signed URL/hash for an app-approved model identity; filename, quantization, license and context capabilities require an application update;
- model replacement keeps the prior GGUF as rollback until the new runtime passes `/health`;
- signed model-pack installs persist `packVersion`, signer key id, index SHA-256 and model SHA-256 in a local receipt;
- subsequent signed model updates are monotonic: an older signed pack is blocked as rollback/replay and the same pack version with a different model hash is blocked as an integrity conflict; the runtime enforces this again internally before provisioning, not only in the UI/status layer;
- a corrupted/mismatched local signed-pack receipt fails closed instead of silently discarding update history;
- provisioning/update now writes a persistent crash-recovery journal plus config/qualification backups; interrupted replacement is rolled back automatically at the next runtime construction, while invalid recovery metadata fails closed.

Still required for full gates:

- execute Vulkan and CPU backend qualification/benchmark acceptance on representative supported Windows hardware; backend implementation/selection exists, but production GPU support is not considered qualified until those artifacts are reviewed;
- execute the committed self-hosted Windows benchmark matrix for 64k / 96k / 128k / 160k / 200k on representative supported hardware; the harness restores the user's previous context after execution;
- context-capability acceptance is explicitly 3/3 exact passkey recall at three positions with prompts fitted to 72% of each requested context; this is a long-context qualification threshold, not a general legal-quality score;
- define and run a separate semantic/legal-quality benchmark before claiming extended-context legal quality;
- configure and exercise the production Ed25519 model-pack signing key/trust root in a real release acceptance.

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
- retrieved knowledge may be represented as deterministic extractive digests when full chunks exceed the context budget; every digest keeps its original document/chunk/page backlink while citation validation uses a separate full-original `citationSources` view;
- digest regression tests prove that excerpts are literal substrings of the original and that the full original chunk remains the citation source;
- Local AI provisioning/repair calibrates the bundled llama.cpp `/tokenize` endpoint on three fixed, non-sensitive Polish/legal samples; the minimum observed chars/token ratio receives an additional safety margin and is persisted in the qualification receipt;
- the HTTP session path feeds this conservative calibrated ratio into the Context Orchestrator for the selected local model; invalid calibration fails closed and cloud/unknown-tokenizer sessions retain the 3 chars/token fallback;
- context tests cover calibrated and invalid tokenizer estimates;
- HTTP tests cover both successful citation refresh and source mutation between execution and presentation;
- a separate semantic/legal-quality benchmark harness is implemented and does not use LLM-as-judge: deterministic scoring checks decision correctness, issue recall, citation recall/precision, invented source IDs and source-to-issue assignment;
- the committed synthetic corpus contains five fictional LEX-BENCH cases for smoke/regression only and is explicitly not treated as evidence of Polish-law quality;
- the self-hosted semantic benchmark can consume an external versioned corpus and can enforce `confidentiality=EXPERT_PRIVATE`; reports omit prompts, source text and raw model answers and retain only case IDs, metrics and response SHA-256 values;
- semantic benchmark prompts are fitted with the bundled tokenizer and spread source blocks through the selected context so the benchmark remains an extended-context semantic test rather than a short-prompt classifier.

Still required before G39C PASS:

- current-head runtime validation must be green;
- the committed self-hosted 64k / 96k / 128k / 160k / 200k long-context capability benchmark must be executed and its artifact reviewed on representative supported hardware;
- the semantic/legal-quality workflow must be executed with an expert-curated `EXPERT_PRIVATE` corpus; synthetic smoke results cannot qualify production legal quality;
- expert owners must review/approve the versioned acceptance thresholds and corpus before treating extended context as a legal-quality guarantee.

A 200k llama.cpp context is not a substitute for retrieval/provenance gates.

## G39H/I — deterministic execution engine and skill migration

Status: **PARTIAL / VERIFYING**

Implemented:

- mandatory legal bootstrap is runtime-enforced: `prawny-router-v3` is loaded first, followed by the shared Polish-law hard gate and router detection/anonymization resources;
- explicit and semantic execution-skill selection is deterministic before provider execution; automatic mode cannot disable the router, privacy, source, citation, audit or finalization gates;
- deterministic workflow preflight currently covers:
  - `SIMPLE_LETTER_V1` for `pisma-proste-v2`;
  - `PROCESS_PLEADING_V1` for `pisma-procesowe-v3`;
  - `COURT_ANALYSIS_V1` for `analiza-sadowa-v6`;
  - `EVIDENCE_ANALYSIS_V1` for `analizator-dowodow-v3`;
  - `STATUTE_ANALYSIS_V1` for `analizator-przepisow-v2`;
  - `CONTRACT_ANALYSIS_V1` for `analizator-umow-v1`;
  - `CHRONOLOGY_V1` for `chronologia-sprawy-v1`;
  - `CASE_LAW_V1` for `orzeczenia-sadowe-v2`;
  - `WITNESS_QUESTIONING_V1` for `przesluchanie-swiadkow-v2-min90`;
  - `CLIENT_REPORT_V1` for `raport-klienta-v1`;
  - `SITUATION_REPORT_V1` for `raport-sytuacyjny-v2`;
- each migrated workflow declares only always-on deterministic resources; semantic legal qualification, evidence significance, MODE A/B/C choices, interpretation and argumentation remain model work;
- actual `read_legal_resource` audit events must cover every required fresh resource before the result can pass the workflow gate;
- process pleading uses encrypted per-case persisted state with optimistic revisions and canonical order:
  `CG_ACCEPTANCE → W1 → PRE_W2 → W2 → W3 → FINAL`;
- process checkpoint applicability is auto-resolved only for objective conditions available from persisted evidence inventory; semantic applicability stays fail-closed;
- CHECKPOINT mode cannot advance without explicit confirmation; conditional user N/A requires a bounded reason and matching revision;
- no public endpoint can mark a process checkpoint ready; only the verified runtime execution gate can do so;
- bounded process AUTO is now connected to `/api/sessions/execute`: maximum four semantic nodes per request, each with a separate permit, provider turn, source/citation/finalization checks and optimistic state commit;
- AUTO stops immediately on a blocked node and does not advance that checkpoint; deterministic applicability is re-evaluated before every node;
- AUTO response contains an explicit checkpoint trace and combines only successful checkpoint outputs;
- court-analysis state machine is encrypted per case and now connected to execution:
  - first court-analysis request may initialize state automatically;
  - provider receives exactly one runtime-selected court stage/checkpoint;
  - a checkpoint closes only after `DRAFT_PRESENTABLE`, finalization PASS, audit PASS/closed and deterministic workflow PASS;
  - state transition is optimistic-revision guarded and records a privacy-safe audit reference derived from session/checkpoint;
  - blocked court-analysis output cannot advance persisted state;
- court-analysis lifecycle exposes only GET / initialize / reset to the user; no public checkpoint-completion endpoint exists;
- deanonymization/final artifact gates remain dependent on persisted process FINAL state.

New/updated validation:

- deterministic workflow tests cover simple/process/court/evidence/statute workflows and missing required reads;
- skill-selection tests cover explicit evidence/statute routing plus chronology, case-law, witness-questioning, client-report and situation-report routing, including the real `legal-skill` / `ux-raport` type exceptions;
- process state, execution permit, applicability and encrypted persistence tests remain active;
- bounded AUTO has pure runner tests plus HTTP integration across ACL/encrypted workspace;
- court-analysis state and execution permit tests exist plus HTTP persistence/blocked-node integration;
- successful stateful workflow nodes persist a privacy-bounded audit artifact in `SecureCaseArtifactStore`; artifacts are encrypted with the case data key, participate in case-key rotation, expose no answer/document body, and are independently retrievable through an `ANALYZE`-guarded `/workflow-audits/:artifactId` endpoint with manifest/payload hash verification;
- workflow history stores resolvable `artifact://artifact_…` references rather than opaque integrity-only ids;
- the real-corpus skill↔engine parity suite validates required fresh-resource declarations for all 11 migrated execution workflows; deeper checkpoint semantic parity remains active for process/court/chronology/contract state machines;
- G16 verification-loop validator has been updated to perform the new statute-workflow fresh reads instead of bypassing the deterministic preflight.

Still required before G39H/I PASS:

- current-head CI must be green after the latest AUTO/stateful/audit integration and expanded all-workflow parity matrix;
- extend stateful deterministic execution beyond process/court/chronology/contract workflows only where multi-turn state materially improves correctness; report skills remain high-determinism schema/output workflows rather than artificial state machines;
- deepen comparative parity for non-stateful workflows from resource-declaration parity to output-schema/gate semantic parity where it adds regression value;
- after two stable releases, shorten duplicated skill instructions that are now runtime-enforced.

Invariant:

- automatic mode may choose goals/skills and execute bounded semantic nodes, but security, privacy, source hierarchy, citations, provenance, STOP/fail-closed rules and final validation remain deterministic in every mode.

## G39J — release / supply-chain hardening

Status: **PARTIAL / BLOCKED FOR PRODUCTION TRUST CONFIGURATION**

Implemented in repo:

- release-critical online/offline/skill-candidate workflows pin `checkout`, `setup-node` and `upload-artifact` to exact commit SHA;
- Windows signing gate verifies that the CI PFX certificate thumbprint is already present in the committed application trust root; the signing secret cannot define its own trust root;
- Authenticode signing requires SHA-256, RFC3161 timestamping and a post-signature verification pass;
- negative CI self-test covers empty trust root and missing signing secret and must fail closed without producing a receipt;
- manual signed Windows release-candidate workflow builds the online installer, signs it, runs installed-copy acceptance, generates npm CycloneDX SBOMs and Rust dependency inventory, writes a release provenance receipt and requests GitHub build-provenance attestation;
- signed skill-update release-candidate workflow exists and requires an Ed25519 private key secret;
- signed model-pack verifier, dedicated trust root, metadata builder and manual release-candidate workflow are implemented; tampered metadata, untrusted key id and unsafe model metadata are rejected in unit tests;
- application, skill and model-pack update channels remain fail-closed while their committed production public trust roots are empty.

External / production blockers:

- configure the real production Authenticode certificate and commit its public thumbprint to `applicationUpdate.trustedSignerThumbprints`;
- configure the corresponding CI PFX/password secrets and execute a signed installer/update acceptance;
- configure the production Ed25519 skill signing key and commit its public key to the skill trust root;
- configure the production Ed25519 model-pack signing key and commit its public key to the model-pack trust root, then execute a real signed model update acceptance;
- protect `main` / release rules and required status checks in GitHub repository administration. The current GitHub integration cannot read or modify branch-protection settings (403: administration permission unavailable), so this cannot be marked PASS from this session;
- add/verify a release-level negative acceptance test for a correctly hashed installer signed by an untrusted certificate. Tampered/untrusted model-pack metadata is already covered at verifier level.

## Current closure order

1. obtain current-head runtime validation PASS after contract-analysis HTTP integration and case-law fixture updates;
2. obtain current-head online installer acceptance PASS with G39G2 registered-install-root and Polish maintenance-language gates;
3. obtain current-head offline installer acceptance PASS;
4. if installer acceptance is green, promote G39G to PASS and keep G39F blocked only on production Authenticode trust;
5. after current-head CI is green, promote the implemented G39C summary-backlink/tokenizer-calibration slices from VERIFYING;
6. validate the new real-corpus skill↔engine parity suite for process/court/chronology/contract workflows on current-head CI;
7. execute and review the self-hosted Local AI 64k / 96k / 128k / 160k / 200k context-capability benchmark artifact;
8. execute the committed semantic/legal-quality benchmark with an expert-curated `EXPERT_PRIVATE` corpus and review/approve the versioned acceptance thresholds;
9. configure production application/skill/model-pack signing and execute signed acceptance;
10. enable protected `main` / release rules outside this GitHub integration;
11. close G39J only after the external trust controls above are verified.

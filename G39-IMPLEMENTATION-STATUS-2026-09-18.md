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

Status: **PASS — STATE MACHINE / INTEGRATION VERIFYING**

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
- the state-machine subgate is independent of production signing keys and therefore closed independently of G39F/G39J;
- **integration acceptance is still required** on the current head: both the real online installed-copy workflow and the standalone offline clean-machine workflow must pass before the installer track as a whole is treated as closed.

## G39F — application update transaction

Status: **IMPLEMENTED / BLOCKED FOR PRODUCTION SIGNING**

Implemented:

1. discovery of a newer GitHub release;
2. release asset requires GitHub-provided SHA-256 digest;
3. download into fixed staging root;
4. exact installer ProductVersion must match the discovered release version;
5. Authenticode verification is mandatory and must match a committed pinned publisher thumbprint;
6. immutable receipt contains version, SHA-256, size, ProductVersion and verified signer identity;
7. native Tauri handoff accepts only a constrained receipt token;
8. external update runner waits for the current process to exit;
9. private runtime process tree is stopped on Tauri `RunEvent::Exit`;
10. backup-capacity check plus backup of installation files and uninstall registry metadata;
11. NSIS update uses `/S /UPDATE /D=<existing install root>`;
12. post-install version check and runtime sidecar self-test;
13. rollback of files and registry on failure;
14. transaction journal covers PREPARED / BACKED_UP / INSTALLING / VERIFYING / COMMITTED / ROLLING_BACK / ROLLED_BACK / ROLLBACK_FAILED;
15. maintenance UI supports check -> download+verify -> install+restart;
16. signed installer acceptance independently re-checks ProductVersion and publisher trust before commit.

Release policy for 0.1.3:

- `verification = SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER`;
- `temporaryUnsignedAllowed = false`;
- `trustedSignerThumbprints = []` until the production certificate is configured;
- therefore in-app application update installation fails closed in 0.1.3, while manual online/offline installers can still be distributed as a pre-release.

Do not mark G39F PASS until a production Authenticode certificate thumbprint is committed, the corresponding CI signing secret is configured and a signed update acceptance/rollback run succeeds.

## G39E — skill update transaction

Status: **IMPLEMENTED / BLOCKED FOR PRODUCTION SIGNING**

Implemented:

- update discovery and download to staging/work directory;
- release asset SHA-256 verification;
- Ed25519 signed index verifier with trusted key-id matching;
- app compatibility constraints (`minAppVersion` / `maxAppVersion`);
- bundle SHA-256/size checks;
- exact skill set/version/hash/dependency validation;
- full corpus registry scan and declaration validation before activation;
- candidate -> current atomic rename with previous-version rollback;
- version marker and maintenance UI for check/apply;
- negative tests for tampered signature/index, untrusted key, version mismatch, dependency mismatch and changed `SKILL.md` hash;
- deterministic signed skill-release candidate builder/workflow.

Release policy for 0.1.3:

- `verification = SHA256_AND_ED25519_SIGNED_INDEX`;
- `temporaryUnsignedAllowed = false`;
- `trustedEd25519PublicKeys = []` until the production skill signing key is configured;
- therefore remote skill update application fails closed in 0.1.3.

Still required for PASS:

- configure the production Ed25519 public key in the committed trust root and matching private-key CI secret;
- publish a signed skill release and verify restart healthcheck/rollback on the installed application.

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

Companion full-corpus audit: `G39-DETERMINISTIC-SKILL-MIGRATION-AUDIT-2026-09-18.md`.

Coverage is machine-enforced by `app/lex-runtime/src/deterministic-skill-coverage.ts` and its test. Current classification covers every top-level `SKILL.md` directory in the development corpus; a new unclassified skill must fail CI.


Status: **IMPLEMENTED / VERIFYING CURRENT HEAD**

Implemented:

- canonical Gate I is split into runtime subgates I-A through I-J; source provenance, source hierarchy, temporal freshness, citation ledger, legal citations, case signatures, document citations, input completeness, output contract, finalization and state transitions are evaluated by code rather than remembered by the model;
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
- evidence analysis and witness questioning now use encrypted per-case ordered workflow state with optimistic revisions and runtime permits;
- `EVIDENCE_ANALYSIS_V1` follows the canonical AD sequence through `AD-KROK4-DASHBOARD`; optional AD blocks may be marked N/A only where explicitly declared by the state machine;
- `WITNESS_QUESTIONING_V1` follows `PRE-W1a-SD-VER → ... → CHECKPOINT-W2 → W3-QUESTIONS`, with only declared post-W3/rehearsal stages optional;
- both workflows auto-initialize only for an authorized case-bound request, advance exactly one permitted checkpoint after full PASS, persist an encrypted audit-artifact reference and do not advance after BLOCKED execution;
- GET / initialize / guarded reset endpoints expose state lifecycle but no public endpoint can directly complete a checkpoint;
- every legal chat turn runs deterministic post-draft reference handling: unambiguous statutory references and supported SN signatures are automatically sent to the verifier, verified markers are inserted from the ledger, failed verification gets an explicit unverified marker, and unsupported/ambiguous case families remain fail-closed;
- mandatory workflow policy resources are pre-read by runtime before provider execution; mechanical policy reads are not repeated as model tool obligations;
- Gate I separately enforces source tier, temporal freshness proof and exact local-document citation/highlight integrity on every turn;
- deanonymization/final artifact gates remain dependent on persisted process FINAL state.

New/updated validation:

- deterministic workflow tests cover simple/process/court/evidence/statute workflows and missing required reads;
- skill-selection tests cover explicit evidence/statute routing plus chronology, case-law, witness-questioning, client-report and situation-report routing, including the real `legal-skill` / `ux-raport` type exceptions;
- process state, execution permit, applicability and encrypted persistence tests remain active;
- bounded AUTO has pure runner tests plus HTTP integration across ACL/encrypted workspace;
- court-analysis state and execution permit tests exist plus HTTP persistence/blocked-node integration;
- evidence/witness ordered-state unit tests cover canonical ordering, optional N/A rules and stale-permit rejection;
- dedicated HTTP integration covers both evidence and witness checkpoint binding, encrypted persistence, audit-artifact resolution and no advancement after a blocked turn;
- Gate I regression tests cover automatic statutory/SN post-draft verification, ambiguous court-family fail-closed behavior and explicit `⚠️ [NIEWERYFIKOWANE]` marking after failed verification;
- Gate I invariant tests cover provenance, source hierarchy, temporal freshness, citation ledger, case signatures and exact document-citation anchoring;
- successful stateful workflow nodes persist a privacy-bounded audit artifact in `SecureCaseArtifactStore`; artifacts are encrypted with the case data key, participate in case-key rotation, expose no answer/document body, and are independently retrievable through an `ANALYZE`-guarded `/workflow-audits/:artifactId` endpoint with manifest/payload hash verification;
- workflow history stores resolvable `artifact://artifact_…` references rather than opaque integrity-only ids;
- the real-corpus skill↔engine parity suite validates required fresh-resource declarations for all 11 migrated execution workflows; deeper checkpoint semantic parity remains active for process/court/chronology/contract state machines;
- G16 verification-loop validator has been updated to perform the new statute-workflow fresh reads instead of bypassing the deterministic preflight;
- `SIMPLE_LETTER_V1` now has a runtime-enforced M9 output contract in addition to fresh-resource reads: a critical intake gap is accepted only as explicit `DANE DO UZUPEŁNIENIA`, while a purported ready artifact must contain `TREŚĆ PISMA → UWAGI PRAKTYCZNE → CO DALEJ → HYBRID-VALIDATION` in order plus the final `Pismo zawiera ... pól do uzupełnienia` count;
- the simple-letter output gate is audited as `G39H_WORKFLOW_OUTPUT` and blocks presentation independently of source/citation finalization; unit tests cover intake-only, valid ready artifact and missing/reordered sections, and a session-level integration test proves the gate reaches the execution audit.
- `PROCESS_PLEADING_V1` now has a checkpoint-aware output contract: intermediate checkpoints may present work products but cannot claim `STATUS PISMA: ... GOTOWE`; the final `CP-PEER` turn must expose `RAPORT W3 → STATUS PISMA → UWAGI REDAKCYJNE PRZED ZŁOŻENIEM → REJESTR KROKÓW` in order before presentation can pass;
- process-output tests cover a valid intermediate checkpoint, premature final-status blocking and valid/invalid `CP-PEER` finalization packages;
- `COURT_ANALYSIS_V1` now has a checkpoint-aware final-report contract: earlier passes remain unconstrained by the §1–§11 document schema, while `FINAL_REPORT_PRESENTED` requires `RAPORT ANALITYCZNY`, `EXECUTIVE SUMMARY`, summaries of Przejście I–IV and §1–§11 in order;
- court-output tests cover non-final passes plus complete and incomplete/reordered final reports; later `SITUATIONAL_REPORT` and process-pleading-offer checkpoints remain separate state-machine stages rather than being merged into the final report.

Still required before G39H/I PASS:

- current-head runtime CI must be green with the Gate I I-A…I-J split, automatic post-draft verification and evidence/witness HTTP state tests;
- online and offline installer acceptance must be green on the same source SHA used for publication.

Non-blocking follow-up after release:

- deepen comparative parity for non-stateful workflows where it adds regression value;
- add official deterministic verification adapters for additional court families before allowing their signatures to pass automatically; discovery alone must not create VERIFIED status;
- after two stable releases, shorten duplicated skill instructions that are now runtime-enforced.

Invariant:

- automatic mode may choose goals/skills and execute bounded semantic nodes, but security, privacy, source hierarchy, citations, provenance, STOP/fail-closed rules and final validation remain deterministic in every mode.

## G39K — program-controlled multi-model routing

Status: **IMPLEMENTED / VERIFYING**

Purpose:

- keep one user-selected primary model responsible for semantic reasoning and the final answer;
- optionally use a separately configured auxiliary model for bounded helper tasks;
- keep task assignment, ordering, verification, caching and audit under deterministic program control;
- prohibit model-to-model delegation and duplicate whole-task execution.

Implemented vertical slice:

- per-user routing preference is persisted in the existing local auth SQLite store;
- the preference contains an explicit enable/disable toggle plus auxiliary provider/model;
- the default auxiliary selection is `local/bielik-11b-v3-q4km`, but the auxiliary lane is disabled until the user activates it;
- the main chat exposes the current primary model as a dropdown and shows the configured auxiliary model separately;
- the settings page lets the user activate/change/save the auxiliary provider/model;
- each session receives only the current user turn as `auxiliaryText`; the helper never receives the full conversation by default;
- deterministic eligibility currently permits only `LEGAL_REFERENCE_PREFLIGHT` when the current turn contains an explicit art./Dz.U./sygnatura-style reference;
- the helper has no runtime tools, uses reasoning=none and is instructed to return only bounded JSON reference candidates;
- helper output is never evidence and never creates VERIFIED status;
- extracted statute/journal candidates are converted by the program into `verify_legal_reference`; supported SN signatures are converted into `verify_case_reference`;
- those existing deterministic verification tools perform official-source checking and write the verification ledger;
- exact duplicate verifier calls made later by the primary model are served from the preflight cache rather than repeated;
- if primary and auxiliary provider/model are identical, the helper lane is skipped;
- if the auxiliary model is unavailable or fails, the auxiliary gate is DEGRADED/FAILED but does not silently replace the primary model or block the whole answer;
- session audit records `G39K_AUXILIARY_MODEL_ROUTING`;
- session/UI metadata exposes primary model, auxiliary model, auxiliary status, task count and deterministic verification count;
- Tauri trust-boundary explicitly allows only GET/PUT for the routing-preference endpoint.

Intentional non-delegation:

- LEXDOC citation resolution, protected-document re-fetch, citation-marker validation and freshness remain deterministic code and are not delegated to the auxiliary LLM;
- source hierarchy, source admissibility, finalization, privacy, workflow checkpoints and citation coverage remain deterministic invariants;
- the auxiliary model does not draft a second answer, critique the complete primary answer or decide legal strategy;
- the primary model remains free to verify new references it introduces itself; only exact preflight duplicates are cached.

Validation added:

- scheduler tests cover disabled mode, no eligible task, primary=auxiliary collision, legal-reference extraction + deterministic verification/cache, and helper failure degradation;
- current-head TypeScript/runtime, Tauri trust-boundary and installer CI are still required before G39K can be promoted to PASS.

Next slices after this vertical slice is green:

1. add a deterministic post-draft citation-coverage scanner that may use the auxiliary model only to classify candidate factual/legal claims, while the runtime remains the decision-maker;
2. add per-task counters/latency to the execution audit and UI;
3. optionally allow distinct auxiliary task policies (reference extraction, bounded source-label normalization, non-semantic formatting checks) with an explicit allowlist;
4. never add an unrestricted "delegate to helper" primitive.

## G39J — release / supply-chain hardening

Status: **PARTIAL / BLOCKED FOR PRODUCTION TRUST CONFIGURATION**

Implemented in repo:

- release-critical workflows pin GitHub Actions to exact commit SHA;
- Windows signing gate requires the CI PFX certificate thumbprint to already exist in the committed application trust root;
- Authenticode signing uses SHA-256 + RFC3161 timestamping and post-signature verification;
- negative CI self-tests cover empty trust root, missing signing secret and foreign/untrusted signer paths;
- signed Windows release-candidate workflow builds/accepts installers, emits SBOM/provenance and requests GitHub build-provenance attestation;
- signed skill-update and signed model-pack release-candidate workflows use separate Ed25519 trust roots;
- model-pack index verifier rejects tampered metadata, untrusted key IDs and unsafe model metadata;
- online/offline manual release pipeline re-verifies acceptance receipts and SHA-256 before GitHub publication;
- release `0.1.3` uses fail-closed update policies for application, skills and model-pack metadata; no unsigned self-update channel is enabled.

Current external blockers:

- application Authenticode trust root is intentionally empty;
- skill and model-pack Ed25519 trust roots are intentionally empty;
- GitHub integration cannot read/modify branch-protection administration (403), so protected `main` / required status checks remain an external repository-admin task;
- production signed release cannot be marked PASS until the real certificates/keys are configured and signed acceptance succeeds.

Installer publication policy:

- online/offline **manual installers may be published as a GitHub pre-release** after runtime + structural + online + offline acceptance all pass;
- in-app application/skill/model update channels remain disabled by fail-closed trust policy until their production keys are configured.

## Current closure order

1. obtain current-head runtime validation PASS including G39K dual-model routing tests, skill-overlay restart rollback and the SIMPLE_LETTER_V1 output gate;
2. obtain current-head online installer acceptance PASS including G39G2 registered-install-root / Polish maintenance-language gates and the foreign-signer negative Authenticode acceptance;
3. obtain current-head offline installer acceptance PASS;
4. if installer/update transaction acceptance is green, promote G39G and the current-development G39F path without waiting for production signing;
5. after current-head runtime CI is green, promote the implemented G39C context-orchestrator slices from VERIFYING and mark the new G39E restart-health transaction as verified;
6. validate the expanded real-corpus skill↔engine parity and simple-letter output-contract suites on current-head CI;
7. execute and review the self-hosted Local AI 64k / 96k / 128k / 160k / 200k context-capability benchmark artifact;
8. execute the committed semantic/legal-quality benchmark with an expert-curated `EXPERT_PRIVATE` corpus and review/approve the versioned acceptance thresholds;
9. configure production application/skill/model-pack signing and execute signed acceptance;
10. enable protected `main` / release rules outside this GitHub integration;
11. close G39J only after the external trust controls above are verified.

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
- online/offline acceptance contract now treats Local AI as optional post-install provisioning.

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

Do not mark G39F PASS before a signed release acceptance test succeeds.

## G39E — skill update transaction

Status: **PARTIAL**

Implemented:

- update discovery;
- verified release asset digest;
- download to work directory;
- archive extraction;
- full corpus registry scan and declaration validation before activation;
- candidate -> current atomic rename;
- previous version rollback if activation fails;
- version marker;
- maintenance UI for checking and applying skill updates.

Still required for full roadmap gate:

- signed `skills-index.json` / independent publisher trust root;
- explicit dependency/minAppVersion/maxAppVersion compatibility matrix;
- retained rollback package policy and healthcheck after runtime restart;
- negative tests for tampered index, dependency conflict and incompatible app version.

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
- if the selected context cannot start successfully, the configuration is rolled back while downloaded files remain cached for a lower-context retry.

Still required for full gates:

- GPU/backend discovery and selection;
- progress reporting during multi-GB downloads;
- update / repair / delete actions for model packs;
- benchmark matrix for 64k / 96k / 128k / 160k / 200k;
- explicit quality acceptance thresholds for extended context;
- signed model-pack metadata rather than relying only on fixed upstream URLs and hashes.

## G39C — effective extended context orchestrator

Status: **OPEN**

Required:

- deterministic chunk/source units;
- retrieval and token budgeting;
- summary backlinks;
- re-fetch original evidence before final citation;
- UI distinction: native context / active runtime context / effective retrieved context.

A 200k llama.cpp context is not a substitute for this gate.

## G39H/I — deterministic execution engine and skill migration

Status: **OPEN**

Target order:

1. prawny-router-v3;
2. pisma-proste-v2;
3. pisma-procesowe-v3;
4. analiza-sadowa-v6;
5. analizator-dowodow-v3;
6. analizator-przepisow-v2;
7. remaining execution skills.

Invariant:

- automatic mode may choose goals/skills, but security, privacy, source hierarchy, citation registry, provenance, STOP/fail-closed gates and final validation remain deterministic in every mode.

## G39J — release / supply-chain hardening

Status: **BLOCKED / OPEN**

Required before production PASS:

- production Authenticode signing;
- signed application update trust root;
- signed skill index;
- signed model-pack metadata;
- protected release branch/rules;
- release-critical workflow pinning;
- SBOM/provenance;
- negative signature/hash tests.

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

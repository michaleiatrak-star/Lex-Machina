# Lex Machina App — Build Log

## Workstream

Branch: `feature/local-runtime`
Draft PR: #38

### 2026-09-15 — Build 0001

Status: **PASS — G0/G1/G2/G3**

Implemented:

- G0 baseline branch created from `main`.
- Initial Lex corpus baseline pinned in `app/lex-version.yaml`.
- Application/runtime scope documented in `app/README.md`.
- TypeScript `LexSkillRegistry` implemented.
- YAML frontmatter parsing implemented.
- Dependency validation implemented for `dependencies.requires`.
- Required resource validation implemented for `required_modules`.
- Semantic resolution implemented for `shared/`, `references/`, `modules/`, `assets/` and explicit sibling-skill paths.
- Path traversal protection implemented.
- G1 corpus-integrity command implemented.
- G2 resolver unit fixtures implemented.
- `LegalSession` state machine bootstrap implemented.
- Router-first invariant enforced by runtime before mandatory resources.
- Fail-closed behavior implemented for missing router or missing mandatory core legal resource.
- G3 real-corpus validation command implemented.
- GitHub Actions workflow executes unit tests + G1 + G3.

Validation evidence:

- **G0 baseline:** PASS.
- **G1 corpus integrity:** PASS on the full development corpus.
- **G2 resolver safety:** PASS.
- **G3 router-first bootstrap:** PASS on the full development corpus.
- GitHub Actions run: `34996304905`, conclusion: `success`.
- Validated head SHA: `c5b79076bbd58b7bd2ff910ce38ac7526cb3d24`.

### 2026-09-15 — Build 0002

Status: **PASS — G4 TOOL SAFETY**

Implemented:

- provider-neutral `ToolBroker`;
- default-deny for unknown tools;
- capability classes: read / network / write / code / MCP;
- read confinement to configured roots;
- write confinement plus explicit write enablement;
- HTTP(S)-only network policy;
- denial of localhost, private/link-local network targets and URL credentials;
- code execution disabled by default;
- MCP execution disabled by default;
- auditable ALLOW/DENY events;
- executable G4 validation suite.

Validation evidence:

- GitHub Actions run: `34996493615`, conclusion: `success`.

### 2026-09-15 — Build 0003

Status: **PASS — G5 PROVIDER CONFORMANCE (NON-LIVE)**

Implemented:

- normalized provider contract aligned with the Mike/AI-SDK pattern;
- `ProviderRegistry` and `ProviderGateway`;
- deterministic adapters for OpenAI, Anthropic and xAI;
- AI SDK factories for `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/xai`;
- strict TypeScript typecheck.

Validation evidence:

- GitHub Actions run: `34997893806`, conclusion: `success`.

Live-provider status:

- live credentialled OpenAI / Anthropic / xAI calls remain a separate gate.

### 2026-09-15 — Build 0004

Status: **PASS — G7 VERTICAL SLICE**

Implemented:

- deterministic Polish-law execution engine;
- enforced order `prawny-router-v3 → prawo-polskie-v2 → ROUTING-MAP → DR → provider`;
- fail-closed for missing routing map/DR/non-DR target.

Validation evidence:

- included in full G1-G8 run `34998379446`.

### 2026-09-15 — Build 0005

Status: **PASS — G8 HARD GATE FINALIZATION**

Implemented:

- verification ledger;
- article/Dz.U./signature detection;
- missing provenance → BLOCKED;
- visible verified marker required;
- visible unverified marker yields DEGRADED, never silent PASS.

Validation evidence:

- run `34998379446`, conclusion: `success`.

### 2026-09-15 — Build 0006

Status: **PASS — G9 AUDIT COMPLETENESS**

Implemented:

- append-only ordered audit trail;
- router-first audit invariant;
- provider start/end pairing;
- G8 finalization presence;
- immutable session after close.

Validation evidence:

- run `34998701143`, conclusion: `success`.

### 2026-09-15 — Build 0007

Status: **PASS — G10 EXPORT GATE**

Implemented:

- HYBRID-VALIDATION required for DOCX/PDF;
- G8 DEGRADED/BLOCKED cannot auto-export;
- G9 incomplete cannot export;
- SHA-256 artifact hash;
- `document_generated` audit event;
- neutral provider-independent verification log.

Validation evidence:

- run `34999378196`, conclusion: `success`.

Legacy compatibility note:

- documentation names `walidator_cytowan.py`, `extract_api_verification_log.py`, `export_gate.py`, but those files are absent under their documented paths;
- runtime implements the documented neutral contract without claiming missing code was executed.

### 2026-09-15 — Build 0008

Status: **PASS — G11 SKILL CONTRACT MATRIX**

Implemented:

- exact expected inventory of 16 DR skills;
- exact contract check against central `prawo-polskie-v2/ROUTING-MAP.md`;
- runtime now fails closed if a selected DR is absent from the central routing map;
- structural contract for 12 core execution skills;
- required version, description and non-empty SKILL body checks;
- real-corpus routing smoke test for every one of the 16 DR skills through the execution engine.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1-G11: PASS;
- GitHub Actions run: `34999731395`, conclusion: `success`.
- Validated head SHA: `82f4c4219f1f077173a9c4e54795e5f973074326`.
- DR routes passing: **16/16**.
- Core execution skill contracts: **12/12**.

Separate corpus fix:

- PR #39 fixes DR-09 count 35 → 36;
- F-138 structural audit PASS: `34998972041`.

Live-provider status:

- credentialled OpenAI / Anthropic / xAI API tests remain pending and are not counted as PASS.

Next gate:

- **G12 Dynamic Model Catalog:** provider-side model discovery for OpenAI, Anthropic and xAI with server-only credentials and deterministic mocked contract tests; no hard-coded consumer ChatGPT/Claude/Grok selector.

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
- Validated head SHA: `c5b79076bbd58b7bdbe86fc0127d0e16daadb480`.

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

- unit tests: PASS;
- G1 corpus integrity: PASS;
- G3 router-first bootstrap: PASS;
- G4 Tool Safety: PASS;
- GitHub Actions run: `34996493615`, conclusion: `success`.
- Validated head SHA: `173bef4f1b4c2d2069f90a51d73a39fa35a13d8a`.

### 2026-09-15 — Build 0003

Status: **PASS — G5 PROVIDER CONFORMANCE (NON-LIVE)**

Implemented:

- normalized provider contract aligned with the Mike/AI-SDK pattern;
- `ProviderRegistry` and `ProviderGateway`;
- provider capability checks for tools/reasoning/model discovery;
- normalized provider error boundary;
- deterministic conformance adapters for OpenAI, Anthropic and xAI;
- normalized tool-call/tool-result roundtrip tests;
- model-discovery contract tests;
- direct AI SDK model factories:
  - `@ai-sdk/openai`;
  - `@ai-sdk/anthropic`;
  - `@ai-sdk/xai`;
- strict TypeScript typecheck added to CI;
- provider package/factory smoke tests without network calls.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1 corpus integrity: PASS;
- G3 router-first bootstrap: PASS;
- G4 Tool Safety: PASS;
- G5 provider conformance: PASS;
- GitHub Actions run: `34997893806`, conclusion: `success`.
- Validated head SHA: `ac26cbef057ccdea783c1f262a14048bc61aabe7`.

Live-provider status:

- live API calls were intentionally not executed in CI;
- live OpenAI / Anthropic / xAI tool-call validation remains a separate credentialled gate and MUST NOT be reported as passed until secrets are configured in a secure environment.

### 2026-09-15 — Build 0004

Status: **PASS — G7 VERTICAL SLICE**

Implemented:

- deterministic Polish-law execution engine;
- enforced order:
  - `prawny-router-v3`;
  - `prawo-polskie-v2`;
  - `prawo-polskie-v2/ROUTING-MAP.md`;
  - exactly one DR primary skill;
  - provider invocation;
- fail-closed behavior for missing routing map, missing DR and invalid non-DR primary target;
- cross-provider orchestration fixture for OpenAI, Anthropic and xAI.

Validation evidence:

- G7 deterministic vertical slice: PASS on the full development corpus;
- included in the later full G1-G8 success run `34998379446`.

### 2026-09-15 — Build 0005

Status: **PASS — G8 HARD GATE FINALIZATION**

Implemented:

- verification ledger with VERIFIED / UNVERIFIED records;
- source URL required for VERIFIED claims;
- legal-reference detector for:
  - `art.`;
  - `Dz.U.`;
  - `sygn.`;
- finalization gate:
  - missing ledger record → BLOCKED;
  - verified record without visible `✅ [VER: ...]` marker → BLOCKED;
  - unverified record without visible warning → BLOCKED;
  - unverified record + `⚠️ [NIEWERYFIKOWANE]` → DEGRADED;
  - verified record + visible verification marker → PASS;
- regression fix for full `Dz.U. RRRR poz. NNNN` detection.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1: PASS;
- G3: PASS;
- G4: PASS;
- G5: PASS;
- G7: PASS;
- G8: PASS;
- GitHub Actions run: `34998379446`, conclusion: `success`.
- Validated head SHA: `9d340232f279a286eb1ef15289e4fdf5d2d01f98`.

### 2026-09-15 — Build 0006

Status: **PASS — G9 AUDIT COMPLETENESS**

Implemented:

- append-only `AuditTrail` with ordered sequence and timestamps;
- event taxonomy for session, skills/resources, routing, provider activity, tools, verification and gates;
- invariant: first audited skill must be `prawny-router-v3`;
- provider start/end cardinality check;
- mandatory successful G8 finalization event;
- mandatory session close;
- contiguous sequence check;
- optional strict requirements for verification and tool activity;
- `AuditedFinalizer` connecting the verification ledger and G8 to the audit trail;
- real-corpus G9 validation after a G7 execution;
- audit trail becomes immutable after session close.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1: PASS;
- G3: PASS;
- G4: PASS;
- G5: PASS;
- G7: PASS;
- G8: PASS;
- G9: PASS;
- GitHub Actions run: `34998701143`, conclusion: `success`.
- Validated head SHA: `c5bad4c17eb9f5c661fd8fdaf12ce8d73ae5bebc`.

Live-provider status:

- credentialled OpenAI / Anthropic / xAI API tests remain pending and are not counted as PASS.

Repository baseline debt:

- Existing `F-138 structural audit` reports `dr-09` module counter `35 != 36`.
- Runtime code does not modify the legal corpus; this issue is being corrected in a separate branch/PR.

Next gate:

- **G10 Export Gate:** inspect and integrate existing Lex export/citation verification scripts behind a controlled runtime adapter; invalid or unsupported citations must block artifact export.

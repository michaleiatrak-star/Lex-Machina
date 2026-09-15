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

Repository baseline debt observed by an existing workflow:

- Existing `F-138 structural audit` reports `dr-09` module counter `35 != 36`.
- The runtime branch did not modify `dr-09`; this is tracked as pre-existing corpus/audit debt and is not treated as a G1-G5 runtime failure.
- It must nevertheless be resolved before declaring the whole repository release-clean.

Next gate:

- **G7 Vertical Slice:** deterministic end-to-end orchestration `prawny-router-v3 → prawo-polskie-v2 → DR-02 → provider → audit trace`, followed by source/HARD-GATE enforcement in G8.

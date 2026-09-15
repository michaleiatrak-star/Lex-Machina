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

### 2026-09-15 — Build 0009

Status: **PASS — G12 DYNAMIC MODEL CATALOG**

Implemented:

- provider-side dynamic model discovery;
- OpenAI discovery via `/v1/models`;
- Anthropic paginated discovery via `/v1/models`;
- xAI language-model discovery via `/v1/language-models`;
- server-side credential resolver;
- provider credentials excluded from model descriptors and sanitized errors;
- mocked HTTP contract tests for all three providers;
- live provider access deliberately not claimed.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1-G12: PASS;
- GitHub Actions run: `35000069786`, conclusion: `success`.
- Validated head SHA: `dc8a987f5d95651be7524318668c6aa8e99ac6c1`.

### 2026-09-15 — Build 0010

Status: **PASS — G13 LOCAL HTTP API**

Implemented:

- Express 5 local backend aligned with the Mike ecosystem;
- default and enforced loopback-only bind;
- `GET /health`;
- `GET /api/skills` exposing metadata only;
- `GET /api/routes`;
- `POST /api/routes/validate`;
- `GET /api/models/:provider`;
- foreign web origins blocked;
- provider/model errors sanitized;
- SKILL.md bodies never exposed through public API;
- full-corpus startup smoke test on an ephemeral localhost port.

Validation evidence:

- strict TypeScript: PASS;
- HTTP/API unit and integration tests: PASS;
- G1-G13: PASS;
- GitHub Actions run: `35001067932`, conclusion: `success`.
- Validated head SHA: `1f586ab061a858d1b51b109ca1192109772cc836`.

Current runnable backend:

```bash
cd app/lex-runtime
npm install
npm start
```

Default address:

`http://127.0.0.1:4317`

Live-provider status:

- model discovery and provider invocation against real credentials remain a separate live gate;
- no API secret is committed to the repository.

Next gate:

- **G14 Local Web UI:** React/Vite application shell consuming the local HTTP API with provider/model selector, DR selector and runtime status, while keeping all credentials and Lex prompt content outside the browser bundle.

### 2026-09-15 — Build 0011

Status: **PASS — G14 LOCAL WEB UI**

Implemented:

- React 19 + Vite 8 local browser application;
- runtime health indicator;
- provider selector for OpenAI / Anthropic / xAI;
- dynamic model selector consuming the local backend only;
- 16-DR selector and explicit route validation;
- browser never receives provider API keys;
- browser never receives Lex `SKILL.md` prompt bodies;
- localhost runtime is the default API target;
- non-local browser origins remain blocked by the backend;
- production bundle security scan for API-key names, private-key markers and prompt-content markers;
- responsive desktop/mobile application shell.

Validation evidence:

- web unit tests: PASS;
- production TypeScript/Vite build: PASS;
- browser bundle safety scan: PASS;
- runtime G1-G13: PASS;
- G14: PASS;
- GitHub Actions run: `35001668494`, conclusion: `success`.
- Validated head SHA: `dfe6248bf856ee97af950aeeba8d9bb6ee7390a9`.

Local startup:

Terminal 1:

```bash
cd app/lex-runtime
npm install
npm start
```

Terminal 2:

```bash
cd app/lex-web
npm install
npm run dev
```

UI: `http://127.0.0.1:5173`

The analysis button is intentionally not enabled yet. The next gate adds an execution endpoint with server-side provider invocation and HARD-GATE-safe response handling.

Next gate:

- **G15 Safe Session Execution:** provider-backed draft execution through the local API with route validation, server-only credentials, deterministic CI adapters and mandatory finalization status before UI presentation.


### 2026-09-15 — Build 0012

Status: **PASS — G15 SAFE SESSION EXECUTION**

Implemented:

- live AI SDK provider adapters for OpenAI, Anthropic and xAI;
- provider credentials resolved only in the local backend process;
- `POST /api/sessions/execute` with input/routing validation;
- server-side `SafeSessionExecutor`;
- selected provider/model executed only after a valid Lex DR route;
- model output is evaluated by G8 before browser presentation;
- G8 PASS → response may expose a working draft;
- G8 DEGRADED/BLOCKED → raw provider output is withheld from the browser;
- blocked responses expose only sanitized reference metadata;
- blocked sessions are explicitly closed in the append-only audit;
- React UI now accepts the user query and executes the local session;
- UI has separate presentable, blocked and provider-error states;
- browser bundle remains free of provider credentials and Lex prompt bodies.

Validation evidence:

- strict TypeScript: PASS;
- runtime/app unit tests: PASS;
- deterministic safe path through `POST /api/sessions/execute`: PASS;
- deterministic unsupported-citation path through HTTP: PASS and raw answer withheld;
- invalid non-DR route through HTTP: PASS (422 `INVALID_ROUTE`);
- runtime G1-G15: PASS;
- web unit tests: PASS;
- production web build: PASS;
- browser bundle safety: PASS;
- GitHub Actions run: `35002611413`, conclusion: `success`.
- Validated head SHA: `b33c3d790ae9ddb24a910d9e806cca96ac2fe5e2`.

Live-provider status:

- the live OpenAI/Anthropic/xAI adapters compile and are wired to the application;
- CI does not contain provider secrets and therefore does not claim a credentialled external API call as PASS.

Current behavior:

- a legal answer with no detected legal citation can be presented as a working draft;
- an answer containing an article, Dz.U. reference or case signature without a verification-ledger entry is blocked before presentation;
- this is intentionally conservative until G16 supplies verified legal-source tool results.

Next gate:

- **G16 Legal Source Verification:** expose provider-neutral verification tools through Tool Broker/MCP/direct official-source adapters and populate the VerificationLedger so verified legal references can pass G8.

### 2026-09-15 — Build 0013

Status: **PASS — G16 VERIFIED LEGAL SOURCE TOOL LOOP**

Implemented:

- provider-neutral `verify_legal_reference` tool;
- ToolBroker host allowlist for official legal-source network calls;
- credential-free HTTPS-only verification;
- fail-closed redirect and unsupported-content handling;
- expected-act-title validation to prevent verifying the correct article number against the wrong act;
- article/Dz.U. matching against freshly fetched official text;
- VERIFIED/UNVERIFIED records written into `VerificationLedger`;
- verification tool decisions included in G9 audit completeness;
- verified marker supplied by the tool and required by G8 on the same citation line;
- fabricated verification markers without a ledger record remain blocked;
- official-source fetch without the requested reference yields UNVERIFIED and is not presented as verified;
- public API/UI exposes verification counts without exposing source bodies;
- browser production bundle gate includes G16 verification-status output.

Validation evidence:

- strict TypeScript: PASS;
- runtime/app unit tests: PASS;
- ToolBroker network allowlist tests: PASS;
- official-source verifier tests: PASS;
- G1-G16 runtime validation: PASS;
- G14-G16 local web UI: PASS;
- GitHub Actions run: `35003728431`, conclusion: `success`;
- F-138 structural audit: `35003728434`, conclusion: `success`;
- Validated head SHA: `4e7b824aac965f8a1bae83b9c75e35fe5e814f05`.

G16 acceptance paths:

- matching official source + expected act title + article → VERIFIED → G8 PASS → answer released;
- fake `✅ [VER: ...]` marker without tool/ledger evidence → G8 BLOCKED → answer withheld;
- official source with correct act title but missing requested article → UNVERIFIED → finalization DEGRADED → public session remains BLOCKED.

Live-source status:

- G16 CI uses a deterministic fetcher and does not claim a real external ELI/Sejm request;
- credentialled OpenAI/Anthropic/xAI calls remain a separate live gate.

Next gate:

- **G17 Live Official Source Probe:** exercise `OfficialLegalSourceVerifier` against a stable real ELI/Sejm endpoint without model-provider credentials, with fail-closed behavior if transport or official-source formatting changes.

### 2026-09-15 — Build 0015

Status: **PASS — G18 DETERMINISTIC LEGAL SOURCE RESOLVER**

Implemented:

- runtime-owned `DeterministicLegalActResolver`;
- initial canonical registry for KC / KPC / KPK;
- normalized legal-act aliases;
- fail-closed unknown-act handling before network access;
- provider tool schema reduced to `claim + kind + act`;
- provider can no longer choose verification URL or expected act title;
- runtime resolves source descriptor before ToolBroker policy evaluation;
- verified official-source flow remains compatible with G16/G8/G9;
- unknown act produces `UNKNOWN_LEGAL_ACT` and zero source fetches;
- resolver aliases and transport ownership covered by unit tests;
- full HTTP G18 acceptance flow added.

Validation evidence:

- strict TypeScript: PASS;
- runtime/app unit tests: PASS;
- G1-G18 deterministic validation: PASS;
- G17 live official-source probe: PASS;
- G14-G18 local web UI: PASS;
- GitHub Actions run: `35011340454`, conclusion: `success`;
- F-138 structural audit: `35011340485`, conclusion: `success`;
- Validated head SHA: `d3e477cf70e5c2e0ee820003a9fd3bbba6cfbc69`.

Initial pinned descriptors:

- KC → `DU/2026/795`;
- KPC → `DU/2026/468`;
- KPK → `DU/2026/490`;
- registry as-of: `2026-09-15`.

Current limitation:

- G18 removes model-owned source URLs but descriptors remain pinned as-of the registry date;
- current-text freshness must therefore be checked by the next temporal gate.

Next gate:

- **G19 Temporal Source Freshness:** use official ELI metadata/references to detect whether the runtime descriptor is still current before verification.

### 2026-09-15 — Build 0016

Status: **PASS — G19 TEMPORAL SOURCE FRESHNESS**

Implemented:

- official ELI temporal freshness checker;
- current t.j. selection from `Inf. o tekście jednolitym` using in-force status;
- base-act and t.j.-side amendment detection;
- union of date-based `Akty zmieniające` with `Nowelizacje po tekście jednolitym`;
- stale pinned descriptor detection;
- PDF-only current-source detection;
- production integration before legal-reference text verification;
- fail-closed `TEMPORAL_*` tool denials;
- live G19 probe chained after G17;
- G18 alias whitespace normalization fix + regression coverage.

Validation evidence:

- G1-G19 deterministic validation: PASS;
- G17 live official-source verification: PASS;
- live G19 freshness probe: PASS;
- G14-G19 local web UI: PASS;
- GitHub Actions run: `35012459142`, conclusion: `success`;
- F-138 structural audit: `35012459149`, conclusion: `success`;
- Validated head SHA: `4f95f5814ef2601e4d9e7ebf88edeb8caa8c0017`.

Live KC result:

- base ELI: `DU/1964/93`;
- current/pinned t.j.: `DU/2026/795`;
- promulgation: `2026-06-17`;
- amendments after t.j.: `0`;
- current format: PDF-only;
- temporal status: `CURRENT_TEXT_REQUIRES_PDF`;
- production verification: fail-closed.

Next gate:

- **G20 Official PDF Text Verification:** bounded backend-only PDF parsing without OCR/external processes, followed by the same title/reference verification and HARD GATE.

### 2026-09-15 — Build 0017

Status: **PASS — G19 HISTORICAL LEGAL-STATE EXCEPTION**

Implemented:

- optional `asOf=YYYY-MM-DD` for explicit historical legal-state requests;
- validity-window checks using ELI entry/valid-from/repeal/expiration metadata;
- historical official-text selection without treating a repealed t.j. as current law;
- current/future `asOf` rejected;
- amendments between the selected historical t.j. and `asOf` remain blocking;
- historical marker includes `STAN NA YYYY-MM-DD`;
- `temporalMode/asOf` propagated to ledger, audit and export verification log;
- current-law repeal remains red/BLOCKED.

Validation evidence:

- full G1-G20 pipeline: PASS;
- GitHub Actions run: `35014644845`, conclusion: `success`;
- F-138 structural audit: `35014644693`, conclusion: `success`;
- validated SHA: `360aeb3854810022222a85ea624182becdd0eb86`.

### 2026-09-15 — Build 0018

Status: **PASS — G20 OFFICIAL PDF VERIFICATION**

Implemented:

- backend-local PDF extraction with `pdfjs-dist`;
- no OCR and no external process execution;
- bounded PDF bytes/pages/extracted-text size;
- malformed/no-text PDFs fail closed;
- PDF temporal states proceed only with explicit PDF verifier capability;
- official PDF title/reference matching;
- verification provenance `web_fetch_pdf` + `sourceFormat=PDF`;
- source format propagated to G9 audit and G10 neutral export log;
- production localhost server enables the bounded PDF verifier.

Validation evidence:

- G1-G20 deterministic validation: PASS;
- G17 live official-source probe: PASS;
- G19 live temporal freshness probe: PASS;
- G20 live official PDF probe: PASS;
- G14-G20 local web UI: PASS;
- GitHub Actions run: `35014644845`, conclusion: `success`;
- F-138 structural audit: `35014644693`, conclusion: `success`;
- validated SHA: `360aeb3854810022222a85ea624182becdd0eb86`.

Next gate:

- **G21 Official Case-Law Verification:** court-family-specific runtime resolver and exact signature verification, beginning with Sąd Najwyższy.


### 2026-09-15 — Build 0019

Status: **PASS — G21 AMENDMENT-AWARE LEGAL STATE**

Implemented:

- amendment applicability classifier:
  - `FUTURE`;
  - `EFFECTIVE`;
  - `UNKNOWN`;
- promulgation separated from ELI relation/effect dates;
- official `entryIntoForce` / `validFrom` support;
- conservative earliest-effect classification;
- FUTURE amendment does not block an earlier legal-state date;
- EFFECTIVE amendment remains fail-closed until deterministic overlay exists;
- UNKNOWN effect date remains fail-closed;
- same rules apply to explicit historical `asOf`.

Acceptance:

- FUTURE → source verification continues → VERIFIED → PASS;
- EFFECTIVE → no content fetch → no ledger record → BLOCKED;
- UNKNOWN → no content fetch → no ledger record → BLOCKED.

Validation evidence:

- G1-G22 deterministic validation: PASS;
- GitHub Actions run: `35016482959`, conclusion: `success`;
- F-138 structural audit: `35016488526`, conclusion: `success`;
- validated code SHA: `31efd8cd6e932a5dcefba00733c817e6c1468182`.

### 2026-09-15 — Build 0020

Status: **PASS — G22 OFFICIAL SN CASE-LAW VERIFICATION**

Implemented:

- runtime-owned `verify_case_reference`;
- first supported court family: Sąd Najwyższy;
- provider supplies claim + signature + court family, never source URL;
- exact signature normalization and matching;
- near-match rejection;
- ambiguous exact matches fail closed;
- official full-text identity verification;
- SN redirect host allowlist and timeout;
- support for current nested Joomla `data[0].data.raw` payload;
- case provenance in VerificationLedger/Audit:
  - `kind=case`;
  - `sourceTier=R1`;
  - `sourceFormat=TEXT`;
  - `caseScope=FULL_TEXT`;
- fabricated case verification marker remains blocked by G8.

Live SN proof:

- signature: `II CSK 101/20`;
- exact result: FOUND;
- judgment date: `2020-07-23`;
- form: `postanowienie SN`;
- source tier: R1;
- scope: FULL_TEXT;
- near match `III CSK 101/20` rejected;
- one live attempt.

Validation evidence:

- G1-G22 deterministic validation: PASS;
- G22 live SN case-law probe: PASS;
- G17 live ELI probe: PASS;
- G19 live temporal probe: PASS;
- G20 live PDF probe: PASS;
- G14-G22 local web UI: PASS;
- GitHub Actions run: `35016482959`, conclusion: `success`;
- PR validation run: `35016488599`, conclusion: `success`;
- F-138 structural audit: `35016488526`, conclusion: `success`;
- validated code SHA: `31efd8cd6e932a5dcefba00733c817e6c1468182`.

Scope boundary:

- G22 proves case identity/metadata/full-text provenance;
- it does not prove an arbitrary thesis, paraphrase or quotation attributed to that judgment.

Next gate:

- **G23 Case-Law Proposition / Quote Verification:** require evidence from the already verified official judgment text before the model may attribute a proposition or quotation to a case.

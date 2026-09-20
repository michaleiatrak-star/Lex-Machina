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


### 2026-09-15 — Build 0021

Status: **PASS — G23 EXACT SN QUOTE EVIDENCE**

Implemented:

- runtime-owned `verify_case_quote`;
- exact quote verification against already verified official SN full text;
- dual evidence records:
  - `caseScope=FULL_TEXT`;
  - `caseScope=EXACT_QUOTE`;
- `caseSignature` and deterministic `evidenceHash` on exact-quote records;
- output marker `✅ [CASE-QUOTE:<hash>]`;
- finalization binding between marker and ledger evidence;
- exact verified quote text required on the same line as marker;
- matching case signature required on the same line;
- fabricated quote marker fails closed;
- quote changed after verification fails closed;
- audit records `caseScope`, `caseSignature` and `evidenceHash`.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1-G23 deterministic validation: PASS;
- G22 live SN case-law probe: PASS;
- G17 live official-source probe: PASS;
- G19 live temporal freshness probe: PASS;
- G20 live official PDF probe: PASS;
- G14-G23 local web UI: PASS;
- GitHub Actions run: `35019534514`, conclusion: `success`;
- validated code SHA: `40a358cd1275e7942efa157bc98435e2c03bf92b`.

Scope boundary:

- G23 verifies verbatim quotations only;
- arbitrary paraphrases or legal theses attributed to a judgment remain outside the verified evidence model.

Next gate:

- **G24 Case-Law Proposition Evidence:** design a deterministic evidence contract for paraphrased propositions without allowing model-only semantic claims to inherit G22/G23 verification.


### 2026-09-15 — Build 0022

Status: **PASS — G24 SN PROPOSITION EVIDENCE LINK**

Implemented:

- third evidence status `SUPPORTED`, explicitly distinct from VERIFIED and UNVERIFIED;
- runtime-owned `verify_case_proposition`;
- proposition linked to an exact already verified SN quotation;
- deterministic proposition evidence hash binds:
  - exact case signature;
  - exact proposition;
  - exact support quote;
- `caseScope=PROPOSITION_SUPPORT`;
- proposition record retains `supportQuote` and `supportQuoteHash`;
- marker `🔗 [CASE-SUPPORT:<hash>]`;
- finalization requires unchanged proposition, exact support quote and case signature on the same line;
- fabricated support markers fail closed;
- altered proposition after tool use fails closed;
- omitted support quote fails closed;
- public verification summary separates `supported` from `verified`;
- tool result explicitly reports `semanticVerification=false`.

Validation evidence:

- strict TypeScript: PASS;
- unit tests: PASS;
- G1-G24 deterministic validation: PASS;
- G22 live SN probe: PASS;
- G17 live ELI probe: PASS;
- G19 live temporal probe: PASS;
- G20 live PDF probe: PASS;
- G14-G24 local web UI: PASS;
- GitHub Actions run: `35020443752`, conclusion: `success`;
- validated code SHA: `3f55b92eed6d8b94884b6fc9798e10c59bf45f15`.

Scope boundary:

- SUPPORTED proves evidence linkage, not semantic entailment;
- SUPPORTED never increments the VERIFIED count.

Next gate:

- **G25 Structured Evidence Bundle / UI Contract:** return typed evidence metadata to the local UI so VERIFIED, SUPPORTED, historical, PDF and case-law evidence can be rendered without scraping markers from answer text.


### 2026-09-15 — Build 0023

Status: **PASS — G25 STRUCTURED EVIDENCE BUNDLE / UI CONTRACT**

Implemented:

- typed sanitized `PublicEvidenceItem[]` returned from session execution;
- separate VERIFIED / SUPPORTED / UNVERIFIED counts and records;
- historical `asOf`, PDF/TEXT, case scope/signature and evidence hashes exposed as metadata;
- backend evidence snippets and supportQuote remain backend-only;
- local UI Evidence Bundle cards;
- explicit SUPPORTED evidence warning in UI;
- official source links;
- evidence cards available on PASS and BLOCKED session responses;
- production web bundle gate requires evidence rendering while preserving secret/corpus-content exclusions.

Validation evidence:

- G1-G25 deterministic validation: PASS;
- G14-G25 web unit tests/build/bundle safety: PASS;
- G22 live SN: PASS;
- G17 live ELI: PASS;
- G19 live temporal: PASS;
- G20 live PDF: PASS;
- GitHub Actions run: `35021203950`, conclusion: `success`;
- F-138 structural audit for the same head: PASS;
- validated code SHA: `9e3ab1fd95aedb68caa8591efe2f81bc780a1232`.

Next gate:

- **G26 Provider Configuration Status:** let the local UI see which provider credentials are configured without returning, logging or fingerprinting the secrets themselves.


### 2026-09-15 — Build 0003A

Status: **PASS — G6 PROVIDER CREDENTIAL BOUNDARY**

The original numbering skipped G6. It is now explicitly defined and validated:
- server-side environment credential resolution only;
- resolver keeps no serializable credential fields;
- no secret value crosses the runtime/browser boundary;
- later G26 exposes boolean configuration status only.

Validation evidence:
- G6 deterministic gate: PASS;
- Lex Runtime Validation run: `35024309354`, conclusion: `success`;
- F-138 structural audit: `35024309358`, conclusion: `success`.

### 2026-09-15 — Build 0024

Status: **PASS — G26 PROVIDER CONFIGURATION STATUS**

Implemented:
- `GET /api/providers` returning only provider + configured boolean;
- UI status for OpenAI / Anthropic / xAI;
- no credential values, environment-variable names or fingerprints in browser output;
- unconfigured provider cannot start analysis.

Validation evidence:
- G26 deterministic gate: PASS;
- G14-G26 local web UI: PASS;
- run `35024309354`: success.

### 2026-09-15 — Build 0025

Status: **PASS — G27 COMPLETE DOCUMENT OCR AND CHUNKING**

Implemented:
- full page-by-page PDF inspection;
- local PaddleOCR PP-OCRv6 Polish adapter for pages with insufficient text;
- OCR result required for every page routed to OCR;
- explicit DIGITAL / OCR / BLANK page provenance;
- lossless large-document chunking with page markers and page-part markers;
- character-count and page-accounting completeness assertions;
- high finite safety envelope instead of model-context truncation.

Validation evidence:
- TypeScript: PASS;
- document ingestion tests: PASS;
- Python worker syntax: PASS;
- G27 deterministic gate: PASS;
- run `35024309354`: success.

### 2026-09-15 — Build 0026

Status: **PASS — G28 LOCAL PSEUDONYMIZATION / DEANONYMIZATION**

Implemented:
- backend-only reversible pseudonymization vault;
- PESEL, NIP, REGON, Polish IBAN, email and formatted phone detection;
- local Polish PERSON NER worker using Stanza;
- stable `[PII:TYPE:NNNN]` tokens;
- deanonymization only through the same local vault;
- re-identification values absent from serialized vault output.

Validation evidence:
- privacy tests: PASS;
- Python NER worker syntax: PASS;
- G28 deterministic gate: PASS;
- run `35024309354`: success.

### 2026-09-15 — Build 0027

Status: **PASS — G29 PRIVATE COMPLETE-DOCUMENT PIPELINE**

Implemented production order:
`PDF → all pages → OCR fallback → page-level pseudonymization → chunking → localhost API`.

- pseudonymization is applied before chunking so chunk boundaries cannot hide PII from recognition;
- production server wires PaddleOCR + Stanza workers;
- `POST /api/documents/ingest` returns pseudonymized chunks only;
- missing OCR/privacy capability fails closed instead of returning a partial document.

Validation evidence:
- G1-G29 deterministic validation: PASS;
- G17 live ELI: PASS;
- G19 live temporal: PASS;
- G20 live official PDF: PASS;
- G22 live SN: PASS;
- G14-G26 web UI: PASS;
- F-138 structural audit: PASS;
- GitHub Actions run `35024309354`: success;
- F-138 run `35024309358`: success.

Next planned gates:
- **G30 — Open Web Discovery:** local SearXNG-backed discovery across unrestricted public domains, with source-tier classification after discovery.
- **G31 — Local DOCX Generation:** backend document generation with template support and G10 export validation.
- **G32 — Document Attachment Session Flow:** select ingested chunks for provider context without sending the re-identification vault.


### 2026-09-16 — Build 0025A

Status: **PASS — G27A DIRECT IMAGE OCR**

Implemented:
- direct JPEG / PNG / WebP / TIFF ingestion;
- local PaddleOCR PP-OCRv6 Polish image worker;
- image treated as a fully accounted single OCR page;
- orientation classification, document unwarping and text-line orientation retained;
- same chunk integrity contract as document OCR;
- localhost API accepts image media types for both direct ingest and review.

Validation evidence:
- strict TypeScript: PASS;
- image-ingestion unit test: PASS;
- Python OCR worker syntax: PASS;
- G27A deterministic gate: PASS;
- GitHub Actions run `35058610946`: success.

### 2026-09-16 — Build 0026A

Status: **PASS — G28A USER-DIRECTED PRIVACY REVIEW**

Implemented:
- local document/image review endpoint returning page text and automatic PII suggestions;
- user may select an exact range and choose:
  - PSEUDONYMIZE;
  - KEEP;
  - LABEL;
- optional semantic label may accompany manual pseudonymization;
- LABEL preserves the text and suppresses automatic anonymization for that exact range;
- KEEP also suppresses automatic anonymization for the selected range;
- overlapping manual directives fail closed;
- finalization happens only after the user's decisions;
- React workbench supports PDF and image upload, page selection, text selection, automatic suggestions and decision removal;
- raw review text remains local and is not sent to model providers by the review/finalize flow.

Validation evidence:
- strict TypeScript: PASS;
- runtime unit tests: PASS;
- G28A deterministic gate: PASS;
- web unit tests: PASS;
- production web build: PASS;
- browser bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS;
- GitHub Actions run `35058610946`: success;
- F-138 structural audit `35058610889`: success.


### 2026-09-16 — Build 0028

Status: **PASS — G32 PROTECTED DOCUMENT ATTACHMENT SESSION**

Implemented:
- finalized protected chunks are retained server-side for explicit session attachment;
- browser sends only `documentId + chunkIndices`, never attachment text supplied by the client;
- unfinalized documents, unknown chunks and invalid selections fail closed;
- aggregate attachment context is bounded before provider execution;
- re-identification vault and raw pre-privacy pages are outside the attachment interface;
- document context is sent as a separate user-data message;
- system prompt marks attached documents as untrusted data and forbids following embedded instructions / role changes / tool requests;
- runtime forbids reconstruction of pseudonym tokens;
- audit records attachment metadata without document text;
- UI defaults to zero selected chunks and requires explicit user selection;
- KEEP ranges remain visible only by prior explicit user decision and are warned about before attachment.

Validation evidence:
- strict TypeScript: PASS;
- runtime unit tests: PASS;
- protected resolver tests: PASS;
- HTTP attachment tests: PASS;
- G32 deterministic gate: PASS;
- G14-G32 web unit tests/build/bundle safety: PASS;
- G17 live ELI: PASS;
- G19 live temporal: PASS;
- G20 live official PDF: PASS;
- G22 live SN: PASS;
- GitHub Actions run `35060003012`: success;
- F-138 structural audit `35060002924`: success.

Open gates:
- **G30 Open Web Discovery:** NOT IMPLEMENTED / NOT PASS.
- **G31 Local DOCX Generation:** NOT IMPLEMENTED / NOT PASS.


### 2026-09-16 — Build 0029

Status: **PASS — G31A CASE STORAGE FOUNDATION + G31B SAFE ZIP INTAKE FOUNDATION**

Implemented:
- production UI creates an opaque local case before accepting file uploads;
- production PDF/image uploads are persisted under the case before OCR/review;
- default data root is outside the Git checkout (`LEX_DATA_DIR` or `~/.lex-machina/data`);
- upload ids are opaque/random;
- original upload uses `.partial` then atomic rename;
- upload manifest contains SHA-256 and non-secret metadata;
- `POST /api/cases/:caseId/files` accepts ZIP archives;
- safe ZIP extraction into the same case directory;
- ZIP-slip/path traversal, absolute/drive/UNC paths, symlinks, special files, encrypted entries, duplicate paths and suspicious expansion are rejected;
- limits cover entry count, one-file bytes, total expanded bytes, path depth and path length;
- rejected archive upload directories are removed;
- nested archives are never recursively auto-extracted;
- ZIP members are never sent to a provider automatically;
- UI shows extracted-file manifest;
- currently processable extracted formats are PDF/JPEG/PNG/WebP/TIFF;
- DOCX/ODT and other files may be stored safely but are not yet input-parsed.

Current-upload audit:
- before Build 0029: uploads were not persisted to a case directory;
- after Build 0029 production path: PDF/image originals are stored in the local case before OCR, and ZIP originals + safe extracted members are stored in the case.

Validation evidence:
- validated code SHA `56134cfa983e8ea88957e08ed46c6d8d3c5565c7`;
- Lex Runtime Validation `35061645463`: success;
- F-138 structural audit `35061645590`: success;
- G31A deterministic gate: PASS;
- G31B deterministic gate: PASS;
- G14-G32 web build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

G31 remaining:
- **G31C — Typed Authoring AST + generation-scoped PII aliases:** NOT IMPLEMENTED / NOT PASS.
- **G31D — Deterministic DOCX + local deanonymization + immediate download:** NOT IMPLEMENTED / NOT PASS.
- **G31E — Deterministic ODT + local deanonymization + immediate download:** NOT IMPLEMENTED / NOT PASS.

Architecture:
- `app/reports/G31-DOCX-ODT-CASE-STORAGE-ARCHITECTURE.md`


### 2026-09-16 — Build 0030

Status: **PASS — G34A LOCAL ACCOUNT BOOTSTRAP + G34B LOGIN/SESSION BOUNDARY**

Implemented:
- local SQLite auth store under the Lex data root;
- zero-user-only first ADMIN bootstrap;
- opaque random local user id;
- Argon2id password-derived KEK;
- random 256-bit User Master Key protected by AES-256-GCM envelope;
- production Node runtime requirement >=24.7.0;
- persistent HMAC-indexed failed-login throttling;
- dummy Argon2 path for nonexistent users;
- bounded Argon2 concurrency/queue;
- 15-minute idle and 8-hour overall session deadlines;
- opaque 256-bit in-memory sessions with digest-only server lookup;
- authEpoch session invalidation;
- authenticated production /api boundary;
- explicit lock/logout;
- sanitized lock/logout/expiry/revocation audit events;
- first-run/login/locked React shell;
- bearer token held only in module memory, never browser persistent storage;
- workbench unmounted on lock/expiry;
- browser bundle checks for auth endpoints and persistent-storage markers;
- G13 updated to validate the authenticated localhost contract.

Validation evidence:
- validated code SHA `b3783309189a6d043fc077e52c736e16b64c10d5`;
- Lex Runtime Validation `35069444351`: success;
- F-138 structural audit `35069444331`: success;
- G1-G29 + G31A/G31B + G32 + G34A/G34B deterministic job: success;
- web unit tests: PASS;
- production web build: PASS;
- browser bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

Open security gates:
- **G34C — case ACL:** NOT IMPLEMENTED / NOT PASS;
- **G34D — case keys/per-user key envelopes:** NOT IMPLEMENTED / NOT PASS;
- **G31C1 — persistent encrypted privacy vault:** NOT IMPLEMENTED / NOT PASS;
- **G34E — recovery/password lifecycle:** NOT IMPLEMENTED / NOT PASS;
- **G34F — deanonymization reauthorization:** NOT IMPLEMENTED / NOT PASS;
- **G34G — Tauri production trust boundary:** NOT IMPLEMENTED / NOT PASS;
- **G34H — sensitive case encryption at rest:** NOT IMPLEMENTED / NOT PASS.

Important: current raw case uploads/ZIP members remain plaintext local files and the reversible privacy vault remains process-memory-only. Build 0030 does not claim secure shared-workstation case separation.


### 2026-09-16 — Build 0031

Status: **PASS — G34C CASE ACL + G34D CASE KEY ENVELOPES**

Implemented:
- explicit case ownership separate from global ADMIN role;
- OWNER / EDITOR / ANALYST / VIEWER case roles;
- independent `canReidentify` capability;
- no silent ownership assignment for legacy G31A cases;
- explicit ADMIN legacy-case import;
- ADMIN-only local USER creation/listing API foundation;
- independent random 256-bit CDK per secured case;
- owner CDK envelope derived from UMK with HKDF-SHA256 + AES-256-GCM;
- per-user X25519 sharing key pair with private key encrypted under UMK;
- offline target-user CDK envelopes using ephemeral X25519 + HKDF + AES-256-GCM;
- ACL-filtered case list/open;
- WRITE enforcement for case uploads and document ingest/review/finalization;
- ANALYZE enforcement before protected document chunks enter a provider session;
- runtime documentId -> caseId binding;
- grant/revoke access API;
- revoke path performs fresh CDK rotation and keyVersion increment;
- explicit case selector in React; no automatic case creation on login/workbench mount;
- production bundle gate requires the explicit ACL case-selection workflow.

Validation evidence:
- validated code SHA `a41fd86dd550dc41c93705edc423516d05199d8c`;
- Lex Runtime Validation `35072926001`: success;
- F-138 structural audit `35072925987`: success;
- strict TypeScript: PASS;
- unit/integration tests: PASS;
- G34C_CASE_ACL: PASS;
- G34D_CASE_KEY_ENVELOPES: PASS;
- web tests/build/bundle safety: PASS;
- G17/G19/G20/G22 live probes: PASS.

Security limitations remain explicit:
- raw uploads and extracted ZIP members remain plaintext at rest until G34H;
- reversible privacy mappings remain process-memory-only until G31C1;
- CDK rotation currently protects future CDK-backed encrypted layers and does not retroactively revoke filesystem copies of current plaintext data;
- `canReidentify` alone does not authorize deanonymization; G34F step-up remains open;
- browser session bearer remains in React module memory until G34G;
- ownership transfer/deletion lifecycle and full account-management UI remain future work.

Next dependency:
- **G31C1 encrypted persistent privacy vault**, then **G34E/G34F recovery and transaction-bound reauthorization**.


### 2026-09-16 — Build 0032

Status: **PASS — G35A CASE WORKSPACE + G35B SHARED FIRM TEMPLATE LIBRARY**

Implemented:
- one browsable persisted upload inventory per selected legal case;
- case READ required for file inventory;
- no arbitrary browser-supplied filesystem path;
- ZIP member metadata shown only from safe persisted manifest;
- separate `shared/templates/template_<id>` application scope;
- DOCX/ODT shared template manifests with SHA-256 and opaque template id;
- authenticated shared-template listing;
- ADMIN-only shared-template upload;
- same shared template reference visible from multiple independently authorized cases;
- no physical template copy into case directories;
- React case-workspace browser;
- shared firm-template panel;
- case inventory refresh after persisted upload;
- bundle gate for case/workspace/template UI.

Validation evidence:
- validated code SHA `181e439232dac1c3e00f9cb45fd1596329d986a8`;
- Lex Runtime Validation `35074544206`: success;
- F-138 `35074544281`: success;
- G35A_CASE_WORKSPACE_BROWSER: PASS;
- G35B_SHARED_FIRM_TEMPLATES: PASS;
- web build/bundle validation: PASS;
- G17/G19/G20/G22 live probes: PASS.

Open:
- G35C template-assisted generated-document integration;
- G31C1 encrypted persistent privacy vault;
- G34E-G34H and remaining G31/G33 work.

Security note:
- listing does not expose raw file bytes;
- raw case files and shared template originals are not yet encrypted at rest;
- templates must not be used as a shared location for client/case PII.


### 2026-09-16 — Build 0033

Status: **PASS — G31C1 ENCRYPTED PERSISTENT PRIVACY VAULT**

Implemented:
- LMV1 binary AES-256-GCM privacy-vault envelope;
- PVK derived from per-case CDK with HKDF-SHA256;
- caseId/generation/keyVersion-bound AAD;
- canonical per-document reversible token payload;
- atomic partial + fsync + decrypt verification + replace;
- non-secret vault metadata with generation/keyVersion/size/SHA-256 consistency checks;
- restart-safe token mapping hydration;
- production document finalization integration without persisting CDK;
- case CDK rotation rekeys the privacy vault;
- rollback before key cutover;
- fail-closed corruption/truncation/wrong-key/wrong-case/wrong-version/stale-meta behavior;
- deterministic G31C1 CI gate.

Validation evidence:
- validated code SHA `8c1a4c3c61b3e3b28c5c648adcfbf932c7dd7394`;
- Lex Runtime Validation `35076077413`: success;
- F-138 `35076077538`: success;
- G31C1_ENCRYPTED_PRIVACY_VAULT: PASS;
- G14-G35 web UI: PASS;
- G17/G19/G20/G22 live probes: PASS.

Open:
- G34E recovery/password lifecycle;
- G34F transaction-bound reauthorization;
- G34H raw case-file encryption;
- G31C2/G31D/G31E;
- G35C and installer work.

Scope note:
- G31C1 protects the reversible PII map;
- it does not encrypt raw case uploads, extracted ZIP members or shared template originals.


### 2026-09-16 — Build 0034

Status: **PASS — G34E RECOVERY/PASSWORD + G34F1 TRANSACTION REAUTH FOUNDATION**

Implemented:
- high-entropy recovery code shown only to the user;
- recovery KEK derived with HKDF-SHA256;
- second AES-256-GCM envelope of the same UMK;
- password change rewraps UMK only;
- recovery restores the same UMK and rotates recovery material;
- authEpoch increments and old sessions are revoked;
- existing case CDKs remain unchanged;
- recovery/password UI without browser secret persistence;
- exact deanonymization intent binding;
- fresh password reauthentication;
- 90-second one-use grant;
- target hash/vault generation/case key version revalidation;
- automatic revocation on lock/logout/expiry/authEpoch.

Validation evidence:
- validated code SHA `f057a0bb22ba89c8a4eb9cb5f9dc774c8cde6524`;
- Lex Runtime Validation `35079648346`: success;
- F-138 `35079648384`: success;
- G34E_RECOVERY_PASSWORD_LIFECYCLE: PASS;
- G34F1_TRANSACTION_REAUTH_FOUNDATION: PASS;
- web build/bundle: PASS;
- G17/G19/G20/G22 live probes: PASS.

Important:
- full G34F remains open because no real DOCX/ODT deanonymization/export path exists yet;
- next critical path is G34H encryption of sensitive case files at rest.


### 2026-09-16 — Build 0038

Status: **PASS — G36 LEGAL SKILL RUNTIME COMPLETENESS**

Implemented:
- actual UTF-8 reads for mandatory core legal resources;
- exact core resource content injected into execution context;
- local `list_legal_skills`, `list_legal_resources`, `read_legal_resource` provider tools;
- path-confined semantic reads for modules/references/shared/cross-skill resources;
- paginated large-resource reads;
- corpus read/tool audit;
- full production-corpus readability validation.

Production corpus validated:
- 32 registered skills;
- 16 DR skills;
- 1,252 listed resources;
- 1,187 supported text resources;
- 16,210,656 text characters read;
- 0 structural issues;
- 0 unreadable supported text resources.

Regression fixes found during integration:
- scripted provider auto-tool behavior made explicit;
- finalizer result preserved independently from release blocking;
- secure incoming parent directory robustness fixed.

Validation evidence:
- validated code SHA `5c19ec48f2c25b5bee7c39a63717e7c808cb3a3e`;
- Lex Runtime Validation `35084662270`: success;
- F-138 `35084662355`: success;
- G17/G19/G20/G22 live probes: success;
- G14-G35 web UI: success.

Semantic boundary:
- G36 proves complete on-demand access to the supported textual corpus;
- it does not preload all resources into every prompt;
- local corpus text does not replace fresh legal-source verification.

Retrospective audit:
- `app/reports/RETROSPECTIVE-IMPLEMENTATION-AUDIT-2026-09-16.md`;
- no current evidence of a falsely marked implemented PASS gate after the fixes above;
- full G34F, G34H5, G31C2/G31D/G31E, G35C, G34G, G33A-D and G30 remain open.


### 2026-09-16 — Build 0043

Status: **PASS — G38 FIRM KNOWLEDGE + CASE RETRIEVAL + EXTENDED DOCUMENT INTAKE**

Implemented:
- encrypted `FIRM_KNOWLEDGE` workspace with case-style ACL/key envelopes/rekey;
- multi-user collaboration panel for cases and firm know-how;
- local protected retrieval from matter documents and firm know-how;
- explicit/manual and automatic knowledge use in session execution;
- restart-safe case-bound document restoration;
- digital-PDF text-layer-first processing with OCR only when required;
- local TXT/Markdown/DOCX/ODT/XLSX/XLSM/CSV/TSV extraction;
- spreadsheet macro/formula non-execution and parser safety limits;
- deterministic Vite/Rolldown web dependency repair.

Validation evidence:
- validated code SHA `2e42a4e29ad48e8c5004866e7535746fdd0ac44a`;
- Lex Runtime Validation `35102533235`: success;
- F-138 `35102533273`: success;
- runtime tests: 55/55 files, 207/207 tests PASS;
- web tests: 1/1 file, 15/15 tests PASS;
- production build/G14: PASS;
- G17/G19/G20/G22 live probes: PASS.

Build report:
- `app/reports/BUILD-0043-G38-KNOWLEDGE-RETRIEVAL-FORMATS.md`.

Remaining before production installer:
- G31C2/G35C;
- G31D/G31E;
- full G34F;
- G34G;
- G33A-D.


### 2026-09-16 — Build 0044

Status: **PASS — G31C2/G31D/G31E + G35C + FULL G34F**

Implemented:
- typed LegalDocumentAst and generation-scoped PII aliases;
- provider-safe AST generation contract;
- deterministic local DOCX/ODT renderer;
- local package validation and deanonymization;
- encrypted restart-safe generation alias/validation state;
- safe shared-template profile extraction with tamper detection;
- full password step-up / one-use grant consumption before privacy-vault access;
- final HYBRID + G8/G10 validation before encrypted CLEAR_PII artifact commit;
- same-session one-use sensitive download ticket;
- secure web authoring workflow.

Validation evidence:
- validated SHA `e0035c68a2034bc4e4132adc28614fb752e10c4f`;
- Lex Runtime Validation `35108047936`: success;
- F-138 `35108047959`: success;
- runtime 61/61 files, 220/220 tests PASS;
- web 16/16 tests + production build/G14 PASS;
- G17/G19/G20/G22 live probes PASS;
- dedicated G31C2/G31D/G31E/G35C/G34F gates PASS.

Next:
- G34G Tauri production trust boundary;
- G33A-G33D installer.

### 2026-09-20 — Build 0045 (0.1.5 / G39L)

Audit of the 0.1.4 G39K line found four defects that CI did not catch, because
the affected gates assert on source strings instead of behaviour.

Fixed:
- **G39L1** first run no longer blocks the application. `admin` / `admin` stays
  as the seeded credential, the account keeps `passwordSetupPending`, and the
  user can work immediately. A persistent, non-dismissible banner sits at the
  top of the window until the password is replaced (min. 10 characters).
- **G39L2** `reauthorizeDeanonymization` forwarded the literal
  `__LEX_NATIVE_REAUTH__` on the desktop shell. The managed bootstrap secret no
  longer exists once the runtime seeds the first admin, so the substitution in
  the Tauri bridge never ran and controlled deanonymization always failed with
  `INVALID_CREDENTIALS`. The typed password is now forwarded verbatim.
- **G39L3** provider API keys stored in the OS keyring were never restored:
  the only caller of `restore_provider_credentials` sat behind the
  managed-identity early return. Restore now runs after every successful
  session, and carries `persistence: OS_KEYRING` so it re-persists the entry
  instead of deleting it.
- **G39L4** the offline self-extractor read its `LEXOFF01` trailer from EOF and
  required an exact file length, so signing the wrapper (Authenticode appends
  the certificate table) broke it. The trailer is now located by a bounded
  backward scan.
- **G39L5** `sign-windows-artifact.ps1` used `"\\s+"` in a double-quoted string,
  so thumbprint whitespace was never stripped and a thumbprint copied from the
  Windows certificate dialog was rejected as malformed.

Validation evidence (local, before release CI):
- runtime typecheck PASS, 121 files / 545 tests PASS on Node 24.21.0;
- web 3 files / 27 tests PASS including the new desktop reauth regression;
- web production build + G14 browser bundle safety PASS;
- Rust `cargo test` 12/12 PASS including the new keyring restore regression,
  `cargo check` clean of new warnings;
- G33C / G37B / G37C2 / Phase 13 offline validators PASS;
- installer PowerShell syntax, NSIS PREINSTALL, Polish.nsh, G39F update policy
  and online bootstrap contract self-tests PASS.

- **G39L6** every frame of the pinned brand icon was an Indexed-colour PNG,
  which the `ico` crate used by `tauri-codegen` cannot decode, so
  `generate_context!` panicked and no desktop build could compile on Windows.
  This blocker was inherited: `release/0.1.4-g39k-rc3-hotfix2` failed the same
  job and never published. Frames re-encoded from palette to RGBA losslessly —
  same dimensions, same pixels — and the icon pin updated to
  `055686adddaf980c1e2a92bd7957090fdac349529dbf60bc85fd0ef26e367b76` (51440 B) in build.rs,
  materialize-brand-icon.ps1, windows-branding-selftest.ps1 and the release
  workflow. Reproduced against `ico 0.5.0` before and after the fix: the old
  icon fails all 7 entries with "Unsupported PNG color type: Indexed", the new
  one decodes all 7.

Not fixed in this line, tracked in ROADMAP:
- Python packages pinned by version only, no `--require-hashes`;
- no `package-lock.json` / `Cargo.lock`, payload built with `npm install`;
- dead `$LASTEXITCODE` guards after `& script.ps1`;
- string-matching validators that cannot catch behavioural regressions.

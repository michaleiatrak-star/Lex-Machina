# BUILD-0042 — G37C1 Memory-Only Provider Credentials + G37E1 Release Discovery

Date: 2026-09-16  
PR: #40  
Parent: `feature/local-runtime`  
Validated code SHA: `b8cdbeeb83a1b7a733dd47180e44deb3f95faadd`

## Status

- **G37C1 — PASS**
- **G37E1 — PASS**

These gates deliberately stop before persistent OS-keychain storage and automatic update installation.

## G37C1 — memory-only provider credentials

### Runtime

Added `MemoryOverlayCredentialResolver` layered over the existing environment resolver.

Properties:

- ADMIN may set an API key at runtime;
- value is stored only in backend process memory;
- memory value overrides environment fallback while present;
- replacing a value zeroizes the previous Buffer;
- clearing a value zeroizes and removes it;
- server shutdown calls `close()` and zeroizes all stored values;
- if memory value is cleared, the environment resolver remains available as fallback;
- public/provider status exposes only configured/not-configured;
- no API response returns the key.

Endpoints:

- `PUT /api/admin/providers/:provider/credential`
- `DELETE /api/admin/providers/:provider/credential`

Both are ADMIN-only.

### Web

ADMIN provider card now supports:

- paste API key;
- **Użyj do restartu** — stores the key in process memory only;
- **Usuń ulotny klucz**;
- direct provider-console link.

The React input is cleared after successful save. No browser persistence was added.

### Security boundary

G37C1 is not durable storage. Restart removes the memory-only value unless an environment variable supplies a fallback.

Persistent user-selected storage remains G37C2 and requires an OS credential vault/keychain.

## G37E1 — trusted GitHub Release discovery

Added `GitHubReleaseUpdateDiscovery`.

Discovery contract:

- fixed repository: `michaleiatrak-star/Lex-Machina`;
- source: GitHub Releases API;
- strict `X.Y.Z` / `vX.Y.Z` semantic versions;
- drafts ignored;
- prereleases ignored by default;
- release URL must remain under:
  `https://github.com/michaleiatrak-star/Lex-Machina/releases/`;
- network/payload failures degrade to `UNAVAILABLE`;
- no artifact download is performed.

Statuses:

- `NO_RELEASE`;
- `UP_TO_DATE`;
- `AVAILABLE`;
- `UNAVAILABLE`.

Endpoint:

- `GET /api/update/status`

Web:

- checks status without blocking normal application startup;
- displays current version;
- displays newer release when available;
- links to the trusted GitHub release page;
- provides manual **Sprawdź aktualizacje**;
- explicitly states that this stage does not install updates.

Application version is now declared as `0.1.0` in `app/lex-version.yaml`.

## Update installation boundary

G37E1 does **not** satisfy G37E2/G33D.

Automatic installation after user acceptance still requires:

- signed release metadata;
- signed installer/update artifacts;
- platform/architecture manifest;
- component-lock verification;
- staging directory;
- offline self-test;
- atomic current-version switch;
- schema backup/migration safety;
- rollback;
- production Tauri trust boundary.

The application therefore cannot silently install an unsigned branch/archive.

## Validation

### GitHub Actions

Lex Runtime Validation run `35096139283`: **SUCCESS**

F-138 structural audit run `35096139253`: **SUCCESS**

### Runtime deterministic validation

- TypeScript strict typecheck — PASS;
- unit tests — **50/50 test files PASS**;
- unit tests — **192/192 tests PASS**;
- Python worker syntax — PASS;
- G1 — PASS;
- G3-G13 — PASS;
- G15-G29 — PASS;
- G31A/G31B/G31C1 — PASS;
- G32 — PASS;
- G34A-G34E — PASS;
- G34F1 — PASS;
- G34H1-H5 — PASS;
- G35A/G35B — PASS;
- G36 — PASS;
- P4B — PASS.

### Web

- web tests — **1/1 test file PASS**;
- web tests — **12/12 tests PASS**;
- production build — PASS;
- G14 browser-bundle safety — PASS.

### Live probes

- G17 real API Sejm/ELI — PASS;
- G19 temporal freshness — PASS;
- G20 official PDF — PASS;
- G22 real SN case-law — PASS.

## Remaining G37

- G37B — OS-vault-backed passwordless first-user bootstrap;
- G37C2 — persistent provider credentials through OS keychain;
- G37D — signed temporary SERVICE support identity;
- G37E2 — signed update download/install/rollback;
- G37F — multi-file drag-and-drop workflow;
- G37G — final repository/release closure.

## Repository note

PR #39 was independently validated and merged to `main` during this audit as commit `54a696638fb58789e66c417f79219237004f75c1`.

No G37 code modifies the legal corpus under `Wersja rozwojowa rozpakowana`.

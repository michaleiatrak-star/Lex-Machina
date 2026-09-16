# Audit — User Settings, API Credentials and DOCX Output

Date: 2026-09-16  
Branch: `feature/local-runtime`

## 1. User settings / API key

### Current state

There is currently **no user settings panel for entering provider API keys**.

The runtime uses `EnvironmentCredentialResolver`, which reads:
- `OPENAI_API_KEY`;
- `ANTHROPIC_API_KEY`;
- `XAI_API_KEY`

directly from the backend process environment.

The public `GET /api/providers` endpoint exposes only:
- provider id;
- `configured: true|false`.

The React UI displays only configured / missing-key status.

### Current storage properties

The app currently does **not**:
- persist provider keys in browser `localStorage`;
- persist provider keys in browser `sessionStorage`;
- write provider keys to an application JSON/settings file;
- use `dotenv` inside the local app;
- use an OS keychain/keyring integration.

The environment resolver reads the process environment on demand and does not retain keys as serializable object properties. G6/G26 tests verify that the public status contract does not expose secret values.

Therefore the current solution is discreet toward the browser, but it is **not a user-facing secret store**. Persistence, if any, is determined by how the user launches the process/shell and is outside Lex Machina itself.

### Recommended settings implementation

For a future settings panel:
1. allow memory-only keys as the default option;
2. for persistent storage use the operating-system credential vault/keychain;
3. never persist plaintext API keys to browser storage, normal JSON, logs or repo files;
4. password-style input with reveal-on-demand;
5. API responses may return only configured/not-configured and optional last validation timestamp — never prefix, length, hash or fingerprint;
6. changing/deleting a key must be a backend-local action.

## 2. DOCX generation and immediate download

### Current state

The local application **does not currently generate a real .docx file**.

There is no DOCX-generation dependency in `app/lex-runtime/package.json`, no generation endpoint, no artifact store and no browser download action.

G10 `ExportGate` accepts document content/bytes and can validate/hash an artifact, but it does not create DOCX bytes.

### Existing formatting specification

The legal corpus already contains production formatting rules, including:
- Arial 11.5 pt by default;
- document title 16–18 pt bold;
- paragraph headings 12 pt bold with bottom border;
- 2.5 cm margins;
- justified body text;
- 6 pt paragraph spacing;
- 1.25 line spacing;
- hanging indentation for enumerations;
- automatic TOC for documents longer than five pages;
- legal-design rules and pre-export gates.

The corpus explicitly expects a separate DOCX/document-generation capability to apply these rules.

### Does AI currently format DOCX automatically?

No — not in the local application.

The AI can generate structured legal text under the skill instructions, but there is currently no deterministic DOCX renderer that converts that output into a correctly formatted Word file.

The intended architecture should be:

`AI structured content → legal/document validation → deterministic DOCX renderer → reopen/inspect generated DOCX → G10 export gate → browser download`

Formatting should be implemented primarily by the renderer, not left to model-generated binary styling. This makes typography, headings, margins, tables, numbering and download behavior reproducible and testable.

### G31 gap

G31 remains **NOT IMPLEMENTED / NOT PASS**.

Required work:
- deterministic DOCX generator;
- formatting profile from the corpus legal-design specification;
- safe filename/content-disposition;
- immediate localhost download endpoint;
- generated-file re-read/validation;
- G10 integration;
- UI download action available only after PASS.

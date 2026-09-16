# G35 — Case Workspace and Firm Template Library

Status: **G35A/G35B IMPLEMENTATION IN PROGRESS — G35C PLANNED**  
Date: 2026-09-16

## 1. User model

Lex Machina uses two different storage scopes.

### CASE scope

One directory represents one legal case:

```text
data/
  cases/
    case_<opaque-id>/
      case.json
      incoming/
      documents/
      artifacts/
      audit/
      private/
```

Everything in this scope is governed by the case ACL.

A user must not obtain access to case B because they can open case A.

### FIRM_SHARED scope

Reusable office templates live outside all case directories:

```text
data/
  shared/
    templates/
      template_<opaque-id>/
        manifest.json
        original/
          <safe-file-name>
```

A shared template:
- has no owning case;
- can be referenced from any case the current user is separately authorized to open;
- is stored once and is not copied into each case;
- must not be used as a channel for case/client data;
- is never attached to a provider automatically.

Initial management policy:
- every authenticated local user may list/read shared template metadata;
- only application ADMIN may add templates;
- a future office-level role may replace ADMIN-only management.

## 2. G35A — Case workspace browser

PASS requirements:
- `GET /api/cases/:caseId/files` requires case READ;
- returns only persisted manifests from that exact case;
- no arbitrary filesystem path is accepted from browser;
- archive members are represented by safe manifest metadata;
- selecting a different case loads a different file inventory;
- browser does not receive raw file bytes merely by listing the workspace.

The file browser is a metadata browser in G35A.

Opening/downloading raw originals remains a sensitive operation and should be integrated with G34F/G34H rather than added as an unauthenticated file URL.

## 3. G35B — Firm template library foundation

Supported initial template package types:
- DOCX;
- ODT.

Each template gets:
- opaque `templateId`;
- safe original filename;
- media type;
- SHA-256;
- byte count;
- createdAt;
- createdByUserId;
- `scope = FIRM_SHARED`.

Endpoints:
- `GET /api/shared/templates` — authenticated library list;
- `POST /api/shared/templates` — ADMIN add;
- `GET /api/cases/:caseId/templates` — requires READ to the selected case and returns references to the same shared library.

The case-scoped endpoint proves cross-case use without copying templates or weakening case ACL.

For two authorized cases A and B:

```text
case A ─┐
        ├── templateId -> shared/templates/template_x
case B ─┘
```

No reverse edge exists from the template to case files.

## 4. Security boundary

Shared templates are not case data.

Initial rules:
- do not store client names, PESEL, addresses or case facts in a shared template;
- template upload does not invoke AI;
- template list does not expose file bytes;
- template path is constructed only from an opaque server-generated id;
- original filename is sanitized;
- template metadata contains no caseId;
- case ACL is still checked before a shared template is exposed in a case workspace.

G34H remains open. Therefore the current G35B foundation does not claim encrypted-at-rest office templates. If office templates are considered confidential, shared-template encryption must be added before secure shared-workstation release.

## 5. G35C — Template-assisted generation

G35C depends on:
- G31C2 typed LegalDocumentAst;
- G31D DOCX and/or G31E ODT;
- G34F reauthorization for clear output;
- G34H for encrypted sensitive artifacts.

Target generation flow:

```text
authorized case
  + selected templateId
  + protected case context
      ↓
local template parser / profile extractor
      ↓
safe template profile
(no macros / active content / case data)
      ↓
provider returns semantic AST only
      ↓
local deterministic renderer applies approved profile
      ↓
local deanonymization + validation
```

The AI must never receive raw OOXML/ODF package bytes merely because a template is selected.

## 6. Non-goals of G35A/G35B

G35A/G35B do not yet:
- download raw case originals;
- edit shared templates;
- parse template styles into LegalDocumentAst;
- use a template in generated DOCX/ODT;
- encrypt shared template bytes at rest;
- synchronize templates between computers.

Those are separate gates and must not be reported as implemented.

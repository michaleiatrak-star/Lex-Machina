# Build 0032 — G35A/G35B Case Workspace + Firm Template Library

Status: **PASS — G35A CASE WORKSPACE + G35B SHARED FIRM TEMPLATES**  
Date: 2026-09-16

## Validated code

Validated code SHA:

`181e439232dac1c3e00f9cb45fd1596329d986a8`

Validation:

- Lex Runtime Validation `35074544206` — **success**
- F-138 structural audit `35074544281` — **success**
- deterministic G1-G29 + G31A/G31B + G32 + G34A-G34D + G35A/G35B — **success**
- TypeScript strict typecheck — **success**
- runtime/app unit tests — **success**
- G35A deterministic validator — **PASS**
- G35B deterministic validator — **PASS**
- G14-G35 web UI build/bundle validation — **success**
- G17/G19/G20/G22 live probes — **success**

Subsequent documentation commits are not included in the validated code SHA above.

---

## 1. One directory per legal case

The local storage model remains:

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

One opaque `caseId` maps to one case directory.

Case-scoped material remains governed by the case ACL.

---

## 2. G35A — case document workspace

Implemented:

- persisted upload inventory per case;
- `GET /api/cases/:caseId/files`;
- READ capability required;
- browser receives manifest metadata only;
- no arbitrary local path supplied by browser;
- safe ZIP member metadata shown from persisted manifest;
- case switch reloads a different inventory;
- UI refreshes after a new upload is persisted.

The workspace currently lists:
- original upload filename;
- media type;
- byte count;
- stored timestamp;
- archive flag;
- safe extracted ZIP member names.

Raw file download/open is deliberately not part of G35A. That should be integrated with G34F/G34H because raw originals may contain clear PII.

---

## 3. G35B — shared firm template library

New physical scope:

```text
data/
  shared/
    templates/
      template_<opaque-id>/
        manifest.json
        original/
          <safe-name>.docx|odt
```

A template is stored once and has no `caseId`.

Manifest fields:
- `templateId`;
- `scope = FIRM_SHARED`;
- sanitized filename;
- DOCX/ODT media type;
- SHA-256;
- byte count;
- createdAt;
- createdByUserId;
- `generationReady = false`.

Initial permissions:
- authenticated user: list template metadata;
- application ADMIN: add template.

---

## 4. Cross-case access

Implemented endpoints:

- `GET /api/shared/templates`;
- `POST /api/shared/templates` — ADMIN;
- `GET /api/cases/:caseId/templates`.

The case-scoped template endpoint first requires READ on the selected case, then returns references to the same shared template library.

Validated behavior:
- create case A;
- create case B;
- upload one shared DOCX template once;
- the same `templateId` is visible from A and B;
- the template is not copied into either case;
- file inventory of A remains isolated from B.

Therefore the shared library does not create a path from one case into another case's files.

---

## 5. UI

The workbench now shows, for the active case:

### Akta wybranej sprawy
- persisted case files;
- archive-member summary;
- no raw bytes exposed by list operation.

### Katalog wspólny / Wzory kancelarii
- shared templates;
- ADMIN upload of DOCX/ODT;
- clear marker that generation integration remains G35C.

The browser production-bundle validator requires these UI markers.

---

## 6. Security constraints

G35A/G35B do not change the G34H limitation.

Current:
- case originals are still plaintext local files;
- extracted ZIP members are still plaintext local files;
- shared template originals are also ordinary local files.

G35B assumes shared templates are office-level reusable assets and should not contain case/client PII.

If templates are confidential, their at-rest encryption should be included in G34H/shared-store hardening before secure shared-workstation release.

No template is sent to an external AI provider automatically.

---

## 7. G35C remains open

G35C is the actual template-assisted generation gate.

It depends on:
- G31C2 LegalDocumentAst;
- G31D DOCX and/or G31E ODT;
- G34F transaction-bound reauthorization;
- G34H encrypted sensitive artifact storage.

Target:
- user selects `templateId`;
- local parser extracts an approved style/structure profile;
- provider receives semantic instructions/protected context, not raw OOXML/ODF;
- deterministic local renderer applies the validated profile;
- local deanonymization and export gates run afterward.

Do not report shared-template upload as generated-document template support yet.

---

## 8. Next stage

Next critical-path gate remains:

**G31C1 — encrypted persistent privacy vault**

Then:
- G34E recovery/password lifecycle;
- G34F transaction-bound reauthorization;
- G34H encrypted case file store;
- G31C2 typed authoring AST;
- G35C template-generation integration;
- G31D/G31E output generation.

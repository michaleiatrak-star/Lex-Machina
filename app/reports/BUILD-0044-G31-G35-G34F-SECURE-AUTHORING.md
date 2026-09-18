# BUILD-0044 — Secure DOCX/ODT Authoring, Templates and Full G34F

Date: 2026-09-16  
Status: **PASS**  
Validated code SHA: `e0035c68a2034bc4e4132adc28614fb752e10c4f`

## Closed gates

- G31C2 — typed LegalDocumentAst + generation-scoped PII aliases;
- G31D — deterministic local DOCX generation;
- G31E — deterministic local ODT generation;
- G35C — safe shared-template profile integration;
- G34F — full transaction-bound deanonymization and sensitive export.

## Security properties

- provider receives semantic AST contract and protected source chunks only;
- source PII tokens are mapped to generation aliases without clear values;
- provider cannot emit raw OOXML/ODF package content;
- unknown aliases and token-looking text nodes fail closed;
- template bytes/XML/text never enter provider context;
- tokenized generation state, alias map and legal validation context survive restart under encrypted case storage;
- deanonymization requires fresh password step-up and exact one-use grant;
- grant is consumed before case key / privacy vault access;
- final DOCX/ODT is re-read locally;
- zero residual LMPII/PII tokens required;
- local HYBRID validation runs on final text;
- final G8/G10 runs on final extracted text and exact package bytes;
- CLEAR_PII artifact is committed only after PASS;
- immediate download uses same-session one-use 60-second ticket;
- raw AST HTTP bypass removed.

## Validation

Validated code SHA:
- `e0035c68a2034bc4e4132adc28614fb752e10c4f`

F-138:
- run `35108047959` — SUCCESS.

Lex Runtime Validation:
- run `35108047936` — SUCCESS.

Runtime:
- test files: 61/61 PASS;
- tests: 220/220 PASS;
- G31C2_TYPED_AUTHORING_AST: PASS;
- G31D_DETERMINISTIC_DOCX: PASS;
- G31E_DETERMINISTIC_ODT: PASS;
- G35C_TEMPLATE_ASSISTED_GENERATION: PASS;
- G34F_FULL_DEANONYMIZATION_EXPORT: PASS.

Web:
- tests: 16/16 PASS;
- production build: PASS;
- G14 bundle safety: PASS.

Live:
- G17: PASS;
- G19: PASS;
- G20: PASS;
- G22: PASS.

## Remaining critical release path

1. G34G — Tauri production trust boundary;
2. G33A-D — offline installer, component lock, repair, self-test, rollback/update;
3. remaining desktop-only G37 integrations and clean-machine acceptance.

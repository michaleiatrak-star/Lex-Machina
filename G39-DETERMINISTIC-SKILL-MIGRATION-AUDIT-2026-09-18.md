# G39 deterministic skill migration audit — 2026-09-18

Branch: `feature/g39-execution-2026-09-17`  
Scope: every top-level skill in `Wersja rozwojowa rozpakowana`.

## Decision rule

The migration target is **hybrid execution**, not “replace every skill with code”.

Deterministic runtime owns things that can be decided by an explicit state, schema, versioned table, invariant or tool result:

- ordering and state transitions;
- routing allowlists and dependency resolution;
- required resource reads;
- source hierarchy and verification status;
- citation/provenance ledgers;
- attachment completeness;
- STOP/fail-closed gates;
- formal intake fields and structured outputs;
- versioned fees/rates/deadlines where the underlying rule has been verified and modeled;
- document assembly/post-validation;
- update/install/release transactions;
- audit logs and rollback.

The model/skill keeps semantic work:

- ambiguous fact interpretation;
- legal qualification where multiple readings remain possible;
- statutory interpretation;
- evidentiary significance;
- strategy and counterargument;
- negotiation;
- witness-question wording/adaptation;
- client-facing explanation and narrative.

**Automatic mode never removes deterministic invariants.** It may choose a goal/skill automatically, but source, citation, privacy, provenance, STOP gates and final validation remain runtime-enforced.

## Coverage result

The machine-readable registry is:

`app/lex-runtime/src/deterministic-skill-coverage.ts`

The corresponding test scans the actual development corpus and fails CI if any top-level `SKILL.md` directory has no classification:

`app/lex-runtime/src/deterministic-skill-coverage.test.ts`

Current scope: **32/32 classified**.

## Executive / orchestration / reporting skills

| Skill | Status | Deterministic target | Semantic remainder | Next migration action |
|---|---|---|---|---|
| `prawny-router-v3` | PARTIAL | router-first bootstrap, core gates, dependency/route validation, source/citation/finalization invariants | ambiguous intent/jurisdiction/domain classification | make runtime own strong deterministic DR selection and emit explicit ambiguity instead of accepting an arbitrary PRIMARY |
| `prawo-polskie-v2` | PARTIAL | versioned DR map/allowlist, map integrity, module resolution | ambiguous multi-domain classification | move routing data from prose substring validation to machine-readable versioned map generated/checked against `ROUTING-MAP.md` |
| `pisma-proste-v2` | ENFORCED | intake/output contract, escalation, mandatory resources, validation | facts and argument wording | deepen schema-per-letter-type after release; do not duplicate current gates in prompt |
| `pisma-procesowe-v3` | ENFORCED | durable per-case state, CP/MRG/order, optimistic concurrency, permits, final status | strategy, argument, counterargument, drafting | keep expanding formal checkpoint predicates only when backed by canonical skill rules |
| `analiza-sadowa-v6` | ENFORCED | ordered pass/checkpoint state, file completeness, required reads, final report contract | qualification, adversarial interpretation, significance | continue structured pass outputs; keep semantic conclusions model-owned |
| `analizator-dowodow-v3` | ENFORCED | gates/resources, evidence/provenance invariants, final output contract | significance, hypotheses, conflict interpretation | next: typed evidence×thesis/provenance matrix rather than free-text-only state |
| `analizator-przepisow-v2` | ENFORCED | fresh source/status/citation gates and full-report structure | interpretation and conflicts of norms | next: typed statute-version/timeline object and branch selection A–H |
| `analizator-umow-v1` | ENFORCED | mode/stage/checkpoint state, checklists, report variants | semantic contract risk, negotiation, drafting | next: typed clause inventory/diff while retaining risk interpretation in LLM |
| `chronologia-sprawy-v1` | ENFORCED | chronology state, date/provenance schema, conflicts, temporal gates | meaning/legal effects | next: typed event/conflict/financial records as canonical runtime objects |
| `orzeczenia-sadowe-v2` | ENFORCED | source hierarchy/status, citation/provenance fields, final-report contract | similarity, ratio relevance, argumentative use | next: deterministic query/dedup/result ledger |
| `przesluchanie-swiadkow-v2-min90` | ENFORCED | ordered stages/resources, admissibility/coverage invariants | question wording, adaptation, examination strategy | next: typed witness/question/goal/evidence matrix and formal ban predicates |
| `raport-klienta-v1` | ENFORCED | structured blueprint, required source/numeric fields, finalization | plain-language explanation and option framing | keep schema deterministic; no need for a separate monolithic state machine |
| `raport-sytuacyjny-v2` | ENFORCED | structured blueprint, source/status fields, IO schema | narrative synthesis and prioritization | keep schema deterministic; add versioned risk/status enums where stable |
| `przewodnik-prawny-v2` | PARTIAL | target: session mode, one-question policy, intake/menu state, irreversible-action gate, route handoff | dialogue, ambiguous intent, lay-language transformation | implement a small durable guide state machine; do not hard-code conversational prose |
| `audyt-systemu-v4` | CODE_FIRST | structural/version/dependency/checksum/map/static checks and release gates | substantive/methodological interpretation of findings | integrate canonical Txx scripts into release gate; avoid recreating them as LLM workflow |

## DR-01 … DR-16

The 16 DR skills were audited as a group and individually classified in the machine-readable registry.

They **must not be converted wholesale into deterministic code**. Their legal/domain interpretation remains skill/model content. What should move to code is the repeated policy shell.

| DR | Deterministic target | Special note |
|---|---|---|
| DR-01 | source/status/module-resolution policy | constitutional interpretation remains semantic |
| DR-02 | source/status/module-resolution policy | civil/family/commercial interpretation remains semantic |
| DR-03 | shared policy + structured criminal-qualification decision graph | code may enforce decision branches; qualification of ambiguous facts remains semantic |
| DR-04 | source/status/module-resolution policy | labour/social-security interpretation remains semantic |
| DR-05 | source/status/module-resolution policy | administrative interpretation remains semantic |
| DR-06 | source/status policy + versioned rate/threshold datasets | tax qualification remains semantic |
| DR-07 | source/status/module-resolution policy | procurement/EU-funds interpretation remains semantic |
| DR-08 | source/status/module-resolution policy | local-government interpretation remains semantic |
| DR-09 | source/status/module-resolution policy | construction/environment/energy/transport interpretation remains semantic |
| DR-10 | source/status policy + freshness gates for frequently changing datasets | health/pharma/food/agriculture interpretation remains semantic |
| DR-11 | source/status policy + staged-application date gates | digital/cyber/AI/data/IP interpretation remains semantic |
| DR-12 | source/status policy + versioned fee datasets | judiciary/professions interpretation remains semantic |
| DR-13 | source/status/module-resolution policy | security-services interpretation remains semantic |
| DR-14 | international source hierarchy + jurisdiction/applicable-law/remedy gates | international/EU/Human Rights interpretation remains semantic |
| DR-15 | source/status + standards/version freshness | compliance/governance interpretation remains semantic |
| DR-16 | tool/calculator routing + formal calculations + shared process gates | strategy and cross-tool synthesis remain semantic |

## Shared skill

`shared` is classified as **POLICY_CODE**.

Highest-value deterministic migrations from `shared`:

1. PRAWO-HARDGATE and source-tier/status enum;
2. citation/verification ledger and anti-facade checks;
3. complete attachment inventory and read coverage;
4. step tracker/checkpoint registry;
5. source fallback policy;
6. DOMAIN-LOCK;
7. RATE-COMPLETENESS;
8. evidence/source provenance;
9. session context schema;
10. final disclaimer placement and finalization rules.

The Markdown resources remain canonical documentation/portable skill policy during migration. Runtime enforcement should be implemented first, compared against the skill behavior, marked as runtime-enforced, and only then should duplicate prompt instructions be shortened.

## Release priority

Before the next installer release:

1. keep all existing deterministic workflows and coverage test green;
2. finish G39G existing-install/location acceptance;
3. make online and offline installer CI green;
4. make runtime validation green;
5. run `audyt-systemu-v4` code-first checks as release gates where practical;
6. do **not** block installer release on deeper semantic migrations listed as “next” above;
7. production auto-update remains fail-closed until Authenticode trust root/secrets are configured.

After installer release, deterministic migration order:

1. router/domain selection data model (`prawny-router-v3` + `prawo-polskie-v2`);
2. `przewodnik-prawny-v2` durable interaction state;
3. evidence typed matrix;
4. statute timeline/version object;
5. witness matrix;
6. contract clause inventory/diff;
7. DR-03/DR-14 specialized decision gates;
8. DR-16 formal calculators;
9. progressive conversion of shared policy to code.

## Audit conclusion

**All current top-level skills have now been explicitly examined and classified.**

This does **not** mean all skills should become deterministic programs. The correct target is:

- mechanical invariants → code,
- formal schemas/state/transitions → code,
- source/citation/provenance → code,
- legal meaning/strategy/interpretation → model + skill,
- domain knowledge → skill, constrained by deterministic policy.

Any future top-level skill added without an explicit migration classification must fail the runtime test suite.

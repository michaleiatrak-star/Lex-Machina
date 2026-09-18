# Build 0001 — Runtime foundation validation report

Date: 2026-09-15
Branch: `feature/local-runtime`
PR: #38

## Result

**PASS for runtime gates G0-G3.**

## Validated components

| Gate | Scope | Result |
| --- | --- | --- |
| G0 | baseline + pinned Lex source | PASS |
| G1 | full-corpus frontmatter/dependencies/required resources | PASS |
| G2 | semantic resolver + path traversal denial | PASS |
| G3 | router-first legal bootstrap on real corpus | PASS |

## CI evidence

GitHub Actions run: `34996304905`

Validated SHA:

`c5b79076bbd58b7bdbe86fc0127d0e16daadb480`

Successful steps:

1. checkout;
2. Node 22 setup;
3. runtime dependency install;
4. resolver/router-first unit tests;
5. G1 corpus integrity;
6. G3 router-first bootstrap on full Lex development corpus.

## Runtime invariants now enforced

1. A legal session cannot become execution-ready without `prawny-router-v3`.
2. The router is the first skill-read event.
3. `shared/PRAWO-HARDGATE.md` is mandatory during bootstrap.
4. `references/KROK0A-anonimizer.md` is mandatory during bootstrap.
5. `references/KROK1-detekcja.md` is mandatory during bootstrap.
6. Missing mandatory bootstrap resources cause `BLOCKED`, not silent fallback.
7. Semantic resource resolution cannot escape the configured Lex root.

## Separate repository debt

The existing `F-138 structural audit` failed on `dr-09` because its declared module counter is 35 while disk/map/router counts are 36. No Build 0001 runtime file changes `dr-09`. This is recorded separately so the runtime gate is not weakened to hide an unrelated corpus consistency issue.

## Next

G4 — Tool Broker and tool-policy enforcement.

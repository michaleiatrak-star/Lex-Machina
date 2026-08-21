# MANIFEST

## Package
`przesluchanie-swiadkow-v2-min90` — 23 pliki (stan 2026-08-20z)

## Pliki operacyjne (wczytywane przez pipeline)
- SKILL.md ← entrypoint
- references/PRAWO-HARDGATE-WITNESS.md
- references/QUESTION-ADMISSIBILITY-GATE.md
- references/WITNESS-INTELLIGENCE.md
- references/FACT-EVIDENCE-MAPPING.md
- references/WITNESS-SCORING.md
- references/CROSS-EXAMINATION-GATE.md
- references/TEXT-FIRST-UI-GATE.md
- typologies/witnesses/witness-types.yaml      ← W2, TYPOLOGIE-LOAD KROK T1
- typologies/judges/judge-types.yaml           ← W2, TYPOLOGIE-LOAD KROK T2
- typologies/matrices/witness-judge-matrix.md  ← W2, TYPOLOGIE-LOAD KROK T3

## Dokumentacja
- README.md
- MANIFEST.md
- references/CHANGELOG.md ← jedyny changelog pakietu (scalony 2026-08-20z, F-101)

## Pliki pomocnicze (tryb graficzny, runner portalu, testy)
- assets/witness_examination_step_lazy.jsx — samowystarczalny; ⚠️ ZAKAZ twardych
  importów komponentów lokalnych (przyczyna historycznego `Module not found`)
- templates/QUESTION-MAP-TEMPLATE.md, templates/TEXT-OUTPUT-TEMPLATE.md
- schemas/witness-blueprint.schema.json, examples/example-blueprint.json
- rules/router-policy.yaml, rules/ui-render-policy.yaml
- integration/ROUTER-SNIPPET.md
- tests/REGRESSION-CASES.md

## Zależności zewnętrzne (poza pakietem)
- shared/MOD-SKAN-DOWODOW-KOMPLETNY.md, shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md,
  shared/MOD-STEP-TRACKER.md, shared/MOD-DOKUMENT-GATES.md, shared/PRAWO-HARDGATE.md

## Usunięte 2026-08-20z (F-99 — balast po scaleniu jsxfix1+jsxfix2)
`reports/` (SOURCE-INVENTORY.json, FIX-REPORT.md, MERGE-REPORT.md, STATIC-CHECKS.json),
`docs/USAGE.md`, `components/README.md`, `CHANGELOG.md` z katalogu głównego
(treść scalona do `references/CHANGELOG.md`). Ostrzeżenie o importach JSX
z `components/README.md` przeniesione do README.md i tego pliku.

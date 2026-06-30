# DEPENDENCY-GRAPH.md — Rejestr zależności modułów shared/

*Wygenerowany: 2026-06-04 | Aktualizuj przy każdej zmianie odwołań w systemie*

## Legenda

- **ACTIVE** — plik wywołany bezpośrednio przez ≥1 skill poza shared/
- **INTERNAL** — plik używany tylko wewnątrz shared/ (przez inny moduł shared)
- **STUB** — plik przekierowujący do pliku kanonicznego (zachować dla kompatybilności)
- **ARCHIVE** — plik nieaktywny (przeniesiony do shared/archive/)

---

## Moduły walidacyjne

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `MOD-WALIDACJA_v2.md` | **ACTIVE — KANONICZNY** | pisma-procesowe-v3, pisma-proste-v2, prawny-router-v3 |
| `MOD-WALIDACJA.md` | STUB → v2 | (zachować — kompatybilność wsteczna) |
| `HYBRID-VALIDATION.md` | ACTIVE | pisma-procesowe-v3, analizator-umow-v1, prawny-router-v3 |
| `POST-VALIDATION.md` | ACTIVE | analizator-umow-v1, pisma-procesowe-v3 |
| `FACT-SOURCE-LOCK.md` | INTERNAL | wywoływany przez MOD-WALIDACJA_v2.md (Blok J), FAKTY_v2.md |
| `LEGAL-STATUS-LOCK.md` | INTERNAL | wywoływany przez MOD-WALIDACJA_v2.md (Blok J), FAKTY_v2.md |
| `FORMAL-CHECK.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md (KROK 2) |
| `BRAKI-FORMALNE.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md (KROK 2) |
| `WARUNKI-SKUTECZNOSCI.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md (KROK 2) |
| `QUALITY-CHECK.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md (KROK 2) |
| `RISK-ASSESSMENT.md` | ACTIVE | wszystkie DR-skille, pisma-procesowe-v3 |

## Moduły faktów i danych wejściowych

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `FAKTY_v2.md` | ACTIVE | pisma-procesowe-v3, pisma-proste-v2 |
| `INTAKE-GAP.md` | ACTIVE | analizator-umow-v1, pisma-procesowe-v3 |

## Moduły terminów i procedury

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `terminy.md` | ACTIVE | analizator-dowodow-v3, pisma-procesowe-v3, pisma-proste-v2 |
| `TERM-CALC.md` | ACTIVE | pisma-procesowe-v3 (KROK 2 MOD-WALIDACJA) |
| `TRYBY-PROCESOWE.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md |
| `PREKLUZJA-DOWODOWA.md` | ACTIVE | pisma-procesowe-v3/modules/MOD-WALIDACJA.md |
| `DISCLAIMER.md` | ACTIVE | prawny-router-v3, przewodnik-prawny-v2 |

## Moduły dowodowe i orzecznicze

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `DOWODY-METODOLOGIA.md` | ACTIVE | analizator-dowodow-v3, pisma-procesowe-v3 |
| `ORZECZENIA-HIERARCHIA.md` | INTERNAL→ACTIVE | orzeczenia-sadowe-v2, pisma-procesowe-v3 |
| `ROSZCZENIA.md` | INTERNAL→ACTIVE | pisma-procesowe-v3 |
| `STRATEGIA-PROCESOWA.md` | ACTIVE | pisma-procesowe-v3, analiza-sadowa-v6 |

## Moduły prawa materialnego (DR-skille)

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `RISK-ASSESSMENT.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `TEMPORAL-LAW-CHECK.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `ISAP-AUDIT-PROTOCOL.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `MODULE-STANDARD-POLISH-LAW.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `LEGAL-QUALITY-GATE.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `ISAP-METRYKI-AKTOW.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `FORMAL-CHECK.md` | ACTIVE | wszystkie DR-01..DR-16 |
| `LEGAL-LIFECYCLE-MANAGEMENT.md` | ACTIVE | wybrane DR-skille |
| `PRAWO-HARDGATE.md` | ACTIVE | wszystkie skille z przepisami |
| `AKTY-PRAWNE-MASTER.md` | ⛔ DEPRECATED 2026-06-14 (WARN-7, opcja b — nigdy nie wdrożony) | — |

## Moduły orkiestratora i routingu

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `ACTIVATION-MATRIX.md` | ACTIVE | prawny-router-v3 |
| `CROSS-DOMAIN-CONFLICT-ROUTER.md` | ACTIVE | prawny-router-v3, prawo-polskie-v2 |
| `SYGNATURY.md` | ACTIVE | orzeczenia-sadowe-v2, prawny-router-v3 |

## Moduły pokrycia prawnego (matryce)

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `POLISH-LAW-COMPLETENESS-MATRIX.md` | ACTIVE | DR-skille, audyt-systemu-v4 |
| `POLISH-LAW-FINAL-COMPLETENESS-GATE.md` | ACTIVE | DR-skille |
| `POLISH-LAW-MAX-COVERAGE-STANDARD.md` | ACTIVE | DR-skille |
| `LEGAL-KNOWLEDGE-GRAPH.md` | ACTIVE | DR-skille, analiza-sadowa-v6 |
| `LEGAL-REGISTRY.md` | ACTIVE | DR-skille |
| `EXPERT-OPINION-AUDIT.md` | ACTIVE | analiza-sadowa-v6, analizator-dowodow-v3 |

## Moduły zarządzania systemem

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `DEDUPLICATION-POLICY.md` | ACTIVE (deweloper) | audyt-systemu-v4 |
| `STATUS.md` | ACTIVE | shared/SKILL.md, audyt-systemu-v4 |
| `KANCELARIA-WORKFLOW.md` | INTERNAL | shared/SKILL.md |

## Raporty i integracje

| Plik | Status | Wywołujące skille |
|------|--------|-------------------|
| `raport-sytuacyjny-integracja.md` | ACTIVE | prawny-router-v3 |

---

## Zasady utrzymania

1. **MOD-WALIDACJA_v2.md** jest jedynym plikiem kanonicznym walidacji. Nie twórz v3 bez usunięcia v2.
2. **MOD-WALIDACJA.md** (stub) zachować — stare odwołania nie spowodują błędu.
3. Pliki w **archive/** nie są ładowane przez żaden skill — bezpieczne do zignorowania.
4. Pliki **INTERNAL** są ładowane tylko przez inne moduły shared/ — nie wymagają odwołań z zewnątrz.
5. Przy dodawaniu nowego pliku do shared/ — zaktualizuj ten graf i SKILL.md.

---

## CHANGELOG — zmiany strukturalne systemu

### 2026-06-09 — Deduplication & Dependency Cleanup (sesja 2)

#### Scalenia modułów (usunięte → wchłonięte przez)
| Usunięty plik | Wchłonięty przez | Powód |
|---|---|---|
| `dr-03/modules/mod-KK-przemoc-domowa-framework.md` | `mod-KK-art207-przemoc-domowa` | identyczne (diff pusty) |
| `dr-03/modules/mod-KK-stalking-framework.md` | `mod-KK-art190a-stalking` | nowszy Dz.U. w art190a |
| `dr-10/modules/mod-PrFarm-framework.md` | `mod-PrFarm-prawo-farmaceutyczne` | podzbiór (109 ⊂ 915 linii) |
| `dr-10/modules/mod-PrFarm-GIF-WIF-framework.md` | `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` | scalono sekcje |
| `dr-10/modules/mod-ustawa-RPP-prawa-pacjenta.md` | `mod-ustawa-prawa-pacjenta-framework` | podzbiór + Dz.U. 2024.581 |
| `dr-11/modules/mod-PrAut-framework-IP.md` | `mod-PrAut-wlasnosc-intelektualna-IP` | identyczne (diff pusty) |
| `dr-11/modules/mod-RODO-framework.md` | `mod-RODO-GDPR-2016-679` | scalono sekcję UODO |

#### MOD-WALIDACJA stuby → czyste view
| Plik | Zmiana |
|---|---|
| `shared/MOD-WALIDACJA.md` | stub opisowy → czyste `view shared/MOD-WALIDACJA_v2.md` |
| `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` | adapter → czyste `view shared/MOD-WALIDACJA_v2.md` |

#### Usunięte orphan files (shared/)
- `MATRIX-COMPLETENESS-AUDIT-GATE.md`, `MATRIX-ROUTING-PRIORITY-RULES.md`, `HIERARCHICAL-COVERAGE-GATE.md`, `OWN-LAW-UNITS-MATRIX-FIRST-GATE.md`, `SECTORAL-MATRIX-FIRST-GATE.md`, `LEGAL-MATRIX-FIRST-GATE.md`, `POLISH-LAW-MAIN-MATRIX-INDEX.md`, `TERYT-INGEST-WORKFLOW.md`
- `references/modules/LOCAL-LAW-AUDIT-GATE.md`, `LOCAL-LAW-SOURCE-PROTOCOL.md`, `MULTI-LEVEL-POLISH-LAW-ROUTER.md`

#### Naprawione MAPA-AKTOW (phantom entries z planowanego rebuild v3.0)
- DR-02 (28→0 phantom), DR-04 (20→0), DR-06 (12→0), DR-07 (9→0), DR-09 (13→0), DR-11 (+1 brakujący)

#### Dodano DISCLAIMER do DR-skillach
- Wszystkie 16 plików `dr-*/SKILL.md` otrzymały sekcję `## ⚖️ DISCLAIMER (obowiązkowy)` z wywołaniem `view shared/DISCLAIMER.md`

#### Wyłączono prompt-master z routingu prawnego
- `prompt-master/SKILL.md`: dodano `routing-exclude: prawny-router-v3`

*Aktualizacja DEPENDENCY-GRAPH: 2026-06-09*

# DR-03 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa zawiera wyłącznie bieżący stan pokrycia. Historia zmian i wcześniejsze oceny nie są częścią warstwy runtime.

## Legenda

- 🟢 B+ / COV — aktualna struktura aktu zmapowana do realnych modułów i fresh gate;
- 🟡 — pokrycie operacyjne wymagające dalszego pogłębienia;
- `FULL` — wyłącznie po audycie artykuł-po-artykule.

## Kodeks karny

**Baza:** Dz.U. 2025 poz. 383 ze zmianami po t.j.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| część ogólna — rozdz. I–XV | 🟢 B+ / COV | `mod-KK-current-state-COV.md` + kwalifikator karnomaterialny |
| część szczególna — rozdz. XVI–XXXVII | 🟢 B+ / COV | `mod-KK-current-state-COV.md` + części tematyczne kwalifikatora |
| część wojskowa — rozdz. XXXVIII–XLIV | 🟢 B+ / COV | `mod-KK-current-state-COV.md` |

## Kodeks postępowania karnego

**Baza:** Dz.U. 2026 poz. 490 ze zmianami.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| current-state całość KPK | 🟢 B+ / COV | `mod-KPK-current-state-COV.md` + rodzina modułów KPK |
| dostęp do akt | 🟢 B+ / COV | rodzina modułów KPK; konkretny przepis zawsze fresh gate |
| środki odwoławcze | 🟢 B+ / COV | rodzina modułów KPK; konkretny przepis zawsze fresh gate |
| postępowania szczególne | 🟢 B+ / COV | indeks COV + moduły szczegółowe |
| wyrok łączny | 🟢 B+ / COV | indeks COV + aktualny tekst KPK |

## Kodeks wykroczeń i KPW

| Akt / zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| KW — część ogólna i główne rozdziały | 🟢/🟡 B+ | rodzina modułów KW; niszowe rozdziały pozostają do pogłębienia |
| KPW — Dz.U. 2025 poz. 860, wszystkie 12 działów | 🟢 B+ / COV | `mod-KPW-kodeks-postepowania-w-sprawach-o-wykroczenia.md` |

## Kodeks karny wykonawczy

**Baza:** Dz.U. 2025 poz. 911 ze zmianami po t.j.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| część ogólna — rozdz. I–VIIa | 🟢 B+ / COV | `mod-KKW-current-state-COV.md` + rodzina modułów KKW |
| część szczególna — wykonanie kar, środków i rozstrzygnięć | 🟢 B+ / COV | `mod-KKW-current-state-COV.md` + moduły szczegółowe |
| SDE | 🟢 B+ / COV | indeks COV + moduły SDE |
| nadzór penitencjarny | 🟢 B+ / COV | indeks COV + moduły KKW |

## Kodeks karny skarbowy

**Baza:** Dz.U. 2025 poz. 633 ze zmianami.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| Tytuł I — część ogólna i szczególna | 🟢 B+ / COV | `mod-KKS-karny-skarbowy-i-AML.md` |
| Tytuł II — postępowanie | 🟢 B+ / COV | jw. + KPK |
| Tytuł III — wykonanie | 🟢 B+ / COV | jw. + KKW |
| intertemporalność | 🟢 B+ / COV | fresh gate dla późniejszych nowelizacji |

## Przeciwdziałanie narkomanii

**Baza current-state:** t.j. Dz.U. 2023 poz. 1939 + obowiązująca od 27.08.2026 ustawa zmieniająca Dz.U. 2026 poz. 1004.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| rozdziały 1–8 | 🟢 B+ / COV | `mod-narkomania-current-state-COV.md` + `mod-ustawa-narkomania.md` |

## Inne akty

| Akt / zakres | Status bieżący |
|---|---|
| opłaty w sprawach karnych | 🟢 B+ / COV |

## Aktywne luki

1. Wszystkie akty F-108 przypisane do DR-03 oraz KKW mają bieżący status B+/COV; F-108 nie jest już flagą otwartą.
2. Dalszego pogłębienia wymagają przede wszystkim niszowe rozdziały KW i szczególne warianty wykonawcze KKW — jako głębokość treści, nie brak mapy.
3. `MAPA-AKTOW.md` DR-03 nadal wymaga osobnego technicznego cleanupu current-state w ramach F-138; nie wpływa to na status COV tej mapy.
4. `COV` nie oznacza `FULL`; znamiona, sankcje, terminy i progi wymagają świeżego odczytu ELI/ISAP.
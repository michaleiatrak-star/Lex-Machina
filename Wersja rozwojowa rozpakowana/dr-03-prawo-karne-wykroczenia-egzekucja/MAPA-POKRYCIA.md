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
| część wojskowa — rozdz. XXXVIII–XLIV | 🟢 B+ / COV | `mod-KK-current-state-COV.md`; aktywować przy właściwym statusie sprawcy |

## Kodeks postępowania karnego

**Baza:** Dz.U. 2026 poz. 490, stan t.j. 16.03.2026, z późniejszymi zmianami.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| current-state całość KPK | 🟢 B+ / COV | `mod-KPK-current-state-COV.md` + rodzina modułów KPK |
| dostęp do akt | 🟢 B+ / COV | art. 156 §1–6 ponownie zweryfikowany w RZĄD 1 |
| środki odwoławcze | 🟢 B+ / COV | art. 437 §1–2 ponownie zweryfikowany w RZĄD 1 |
| postępowanie nakazowe | 🟢 B+ / COV | art. 498 ponownie zweryfikowany w RZĄD 1 |
| wyrok łączny | 🟢 B+ / COV | art. 575 §1 skorygowany do aktualnego brzmienia |

## Kodeks wykroczeń i KPW

| Akt / zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| KW — część ogólna i główne rozdziały | 🟢/🟡 B+ | rodzina modułów KW; niszowe rozdziały pozostają do pogłębienia |
| KPW — Dz.U. 2025 poz. 860, wszystkie 12 działów | 🟢 B+ / COV | `mod-KPW-kodeks-postepowania-w-sprawach-o-wykroczenia.md` |

## Kodeks karny wykonawczy

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| postępowanie wykonawcze / SDE / odroczenie / przerwa / warunkowe zwolnienie | 🟢/🟡 B+ | rodzina modułów KKW |
| nadzór penitencjarny i pozostałe zakresy | 🟡 | `mod-KKW-uzupelnienie-pokrycia-2026.md` |

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
| rozdziały 1–8: definicje, zadania, profilaktyka, leczenie, substancje/prekursory, uprawy, kary pieniężne i przepisy karne | 🟢 B+ / COV | `mod-narkomania-current-state-COV.md` + `mod-ustawa-narkomania.md` |

## Inne akty

| Akt / zakres | Status bieżący |
|---|---|
| opłaty w sprawach karnych | 🟢 B+ / COV — art. 1–23 zmapowane |

## Aktywne luki

1. Wszystkie akty F-108 przypisane do DR-03 mają bieżący status B+/COV.
2. Dalszego pogłębienia wymagają niszowe rozdziały KW oraz część zakresów KKW.
3. `COV` nie oznacza `FULL`; znamiona, sankcje, terminy i progi wymagają świeżego odczytu ELI/ISAP przed użyciem.

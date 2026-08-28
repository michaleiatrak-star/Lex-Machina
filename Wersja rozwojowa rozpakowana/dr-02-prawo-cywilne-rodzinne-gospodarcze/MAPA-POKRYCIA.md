# DR-02 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze statusy pozostają poza mapą runtime.

## Legenda

- 🟢 B+ / COV — aktualna struktura aktu zmapowana do rzeczywistych modułów i fresh gate;
- 🟡 B/B+ — pokrycie operacyjne, ale niepełne strukturalnie;
- `FULL` — wyłącznie po audycie artykuł-po-artykule.

## Kodeks cywilny / KRO / konsument

| Zakres | Status bieżący | Główny moduł |
|---|---|---|
| KC — Dz.U. 2026 poz. 795 | 🟢 B+ / COV | `mod-KC-current-state-COV.md` + moduły tematyczne |
| KRO — Dz.U. 2026 poz. 236 | 🟢 B+ / COV | `mod-KRO-rodzinne.md` + moduły tematyczne |
| prawa konsumenta — Dz.U. 2024 poz. 1796 ze zm. | 🟢 B+ / COV | `mod-ustawa-prawa-konsumenta.md` |
| UOKiK — Dz.U. 2025 poz. 1714 | 🟢 B+ / COV | `mod-ustawa-UOKIK-antymonopolowe.md` |

## KPC / KSH / niewypłacalność

| Zakres | Status bieżący | Główny nośnik |
|---|---|---|
| KPC — główna struktura i procedury | 🟢 B+ / COV | rodzina modułów KPC + mapa głównych działów |
| KSH — wszystkie tytuły co najmniej operacyjnie pokryte | 🟢 B+ / COV | rodzina KSH + `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| Prawo upadłościowe | 🟢 B+ / COV | moduły PrUp, w tym likwidacja i postępowania odrębne |
| Prawo restrukturyzacyjne | 🟢 B+ / COV | moduły PrRestr + pomoc publiczna |

## Nieruchomości / zabezpieczenia / spółdzielczość

| Akt / zakres | Status bieżący | Główny moduł |
|---|---|---|
| własność lokali — Dz.U. 2026 poz. 232 | 🟢 B+ / COV | `mod-ustawa-spoldzielnie-wlasnosc-lokali.md` |
| spółdzielnie mieszkaniowe — Dz.U. 2026 poz. 889 | 🟢 B+ / COV | `mod-ustawa-spoldzielnie-mieszkaniowe.md`; rozdz. 1, 1¹, 2, 2¹, 3, 3¹ oraz przepisy temporalne zmapowane |
| Prawo spółdzielcze — Dz.U. 2026 poz. 521 | 🟢 B+ / COV | `mod-prawo-spoldzielcze.md` |
| ochrona praw lokatorów — Dz.U. 2023 poz. 725 | 🟢 B+ / COV | `mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja.md` |
| księgi wieczyste i hipoteka — Dz.U. 2026 poz. 1066 | 🟢 B+ / COV | `mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md` |
| gospodarka nieruchomościami — Dz.U. 2026 poz. 399 | 🟢 B+ / COV | `dr-09/.../mod-UGN-gospodarka-nieruchomosciami.md` |
| zastaw rejestrowy — Dz.U. 2018 poz. 2017 ze zm. | 🟢 B+ / COV | `mod-ustawa-zastaw-rejestrowy.md` |
| KRS — Dz.U. 2025 poz. 869 ze zm. | 🟢 B+ / COV | `mod-ustawa-KRS-rejestr-sadowy.md` |

## Pozostałe akty F-108 i organizacje

| Akt / zakres | Status bieżący | Główny moduł |
|---|---|---|
| Prawo wekslowe — Dz.U. 2022 poz. 282 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| Prawo czekowe — Dz.U. 2016 poz. 462 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| fundacje | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md` |
| stowarzyszenia | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md` |
| ubezpieczenia obowiązkowe, UFG i PBUK | 🟢 B+ / COV | dedykowany moduł |
| fundacja rodzinna | 🟢 B+ / COV | dedykowany moduł |
| opóźnienia w transakcjach handlowych | 🟢 B+ / COV | dedykowany moduł |
| Prawo przedsiębiorców — Dz.U. 2025 poz. 1480 | 🟢 B+ / COV | `mod-Prawo-przedsiebiorcow-current-state-COV.md` |

## Aktywne luki

1. F-108 w DR-02 ma aktualne COV dla wszystkich przypisanych aktów.
2. Dalsza praca dotyczy głębokości poszczególnych artykułów i niszowych wariantów, nie braku routingu.
3. `COV` nie oznacza `FULL`; każda konkretna jednostka wymaga fresh gate do ELI/ISAP.

# DR-05 — Lokalna Mapa Aktów Prawnych

## Prawo administracyjne i sądownictwo administracyjne

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt → moduł**. Historia zmian, wcześniejsze błędy numerów i zamknięte flagi należą do `audyt-systemu-v4/references/AUDIT-JOURNAL.md` / `CHANGELOG.md`.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Kodeks postępowania administracyjnego (KPA) | Dz.U. 2025 poz. 1691 t.j. ze zm. | `mod-KPA-current-state-COV.md` + `mod-KPA-postepowanie-administracyjne` + rodzina modułów KPA | 🟢 B+/COV |
| KPA — decyzja administracyjna i odwołanie | jw. | `mod-KPA-decyzja-i-odwolanie` | ✅ aktywny |
| KPA — zawieszenie, dowody i rozprawa administracyjna | jw. | `mod-KPA-mechanizmy-w-toku-sprawy` | ✅ aktywny |
| KPA — tryby nadzwyczajne, bezczynność, przewlekłość i strategia | jw. | `mod-KPA-tryby-nadzwyczajne-i-strategia` | ✅ aktywny |
| Prawo o postępowaniu przed sądami administracyjnymi (PPSA) | Dz.U. 2026 poz. 143 t.j. ze zm. | `mod-KPA-postepowanie-administracyjne` + rodzina modułów PPSA | 🟢 B+/COV |
| PPSA — pozostałe działy / pokrycie przekrojowe | jw. | `mod-PPSA-uzupelnienie-pokrycia-2026` | 🟡 B+ |
| PPSA — terminy, kasacja, koszty i prawo pomocy | jw. | `mod-PPSA-terminy-kasacja-prawo-pomocy` | ✅ aktywny |
| PPSA — posiedzenia sądowe | jw. | `mod-PPSA-posiedzenia-sadowe-rozdzial-7` | ✅ aktywny |
| PPSA — orzeczenia sądowe | jw. | `mod-PPSA-orzeczenia-sadowe-rozdzial-10` | ✅ aktywny |
| Ustawa o postępowaniu egzekucyjnym w administracji (UPEA) | Dz.U. 2026 poz. 268 t.j. ze zm. | `mod-UPEA-egzekucja-administracyjna` | ✅ aktywny |
| Ustawa o dostępie do informacji publicznej (UDIP) | Dz.U. 2022 poz. 902 t.j. ze zm. | `mod-UDIP-dostep-informacji-publicznej` | ✅ aktywny |
| Ustawa o otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego | Dz.U. 2023 poz. 1524 t.j. ze zm. | `mod-UDIP-dostep-informacji-publicznej` | ✅ aktywny |
| Ustawa o cudzoziemcach | Dz.U. 2025 poz. 1079 t.j. ze zm. | `mod-ustawa-cudzoziemcy` | ✅ aktywny; fresh gate |
| Ustawa o warunkach dopuszczalności powierzania pracy cudzoziemcom | Dz.U. 2025 poz. 621 ze zm. | `mod-ustawa-cudzoziemcy-zatrudnianie` | ✅ aktywny; fresh gate |
| Ustawa o udzielaniu cudzoziemcom ochrony na terytorium RP | Dz.U. 2026 poz. 862 t.j. ze zm. | `mod-ustawa-cudzoziemcy` | ✅ aktywny; fresh gate |
| Reżim ochrony czasowej obywateli Ukrainy po zmianach z 2026 r. | ustawy właściwe dla ochrony cudzoziemców i pracy cudzoziemców; temporalność sprawdzana na dzień zdarzenia | `mod-ustawa-cudzoziemcy` + `mod-ustawa-cudzoziemcy-zatrudnianie` | ✅ routing aktualny; fresh gate |
| Ustawa o skardze na naruszenie prawa strony do rozpoznania sprawy bez nieuzasadnionej zwłoki | Dz.U. 2023 poz. 1725 t.j. | `mod-ustawa-skargi-przewleklosc-dostep-sadu` + DR-01 `mod-przewleklosc-current-state-COV.md` | 🟢 B+/COV |
| Ustawa o Rzeczniku Praw Obywatelskich | Dz.U. 2024 poz. 1264 t.j. | `mod-ustawa-RPO` | 🟢 B+/COV |
| Ustawa o Rzeczniku Praw Dziecka | Dz.U. 2023 poz. 292 t.j. | `mod-ustawa-RPD` | 🟢 B+/COV |
| Ustawa o samorządowych kolegiach odwoławczych | Dz.U. 2018 poz. 570 t.j. ze zm. | `mod-ustawa-SKO` | ✅ aktywny |
| Ustawa o kontroli w administracji rządowej | Dz.U. 2026 poz. 158 t.j. | `mod-ustawa-kontrola-administracji` | ✅ aktywny |
| Ustawa o wojewodzie i administracji rządowej w województwie | Dz.U. 2025 poz. 428 t.j. | `mod-ustawa-wojewoda-administracja-rzadowa` + DR-08 `mod-wojewoda-administracja-rzadowa-current-state-COV.md` | 🟢 B+/COV |
| Ustawa o petycjach | Dz.U. 2018 poz. 870 t.j. ze zm. | `mod-ustawa-petycje` | ✅ aktywny |
| KPA art. 156 § 2a + ustawa reprywatyzacyjna | KPA jw. + Dz.U. 2021 poz. 795 t.j. ze zm. | `mod-ustawa-zaskarzanie-decyzji-wlasnosci` | ✅ aktywny |
| Ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami | Dz.U. 2024 poz. 1411 t.j. | `mod-ustawa-dostepnosc-niepelnosprawni` | ✅ aktywny |
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 ze zm. | `mod-ustawa-sygnalisci` | ✅ aktywny |

## Reguły runtime

- mapa nie przechowuje informacji typu `NAPRAWIONE`, `ZAMKNIĘTE`, `NOWY`, dawnych numerów ani opisów sesji audytowych;
- każdy fizyczny moduł DR-05 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- przy cudzoziemcach, ochronie czasowej i aktach często nowelizowanych obowiązuje fresh gate do ELI/ISAP przed użyciem konkretnego przepisu, terminu lub statusu temporalnego;
- status `COV` oznacza udokumentowaną mapę struktury i routingu, nie kompletność artykuł-po-artykule (`FULL`).

# DR-01 — Lokalna Mapa Aktów Prawnych

## Ustrój Konstytucyjny i Źródła Prawa

Mapa runtime pokazuje wyłącznie bieżący stan akt → moduł. Historia napraw, wcześniejsze numery i sesje weryfikacyjne pozostają poza tym plikiem.

| Akt / zakres | Dz.U. / źródło bieżące | Moduł | Status bieżący |
|---|---|---|---|
| Konstytucja RP z 2 kwietnia 1997 r. | Dz.U. 1997 nr 78 poz. 483 ze zm. | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟢 B+/COV |
| Organizacja i tryb postępowania przed Trybunałem Konstytucyjnym | Dz.U. 2019 poz. 2393 t.j. | `mod-TK-organizacja-postepowanie-current-state-COV` | 🟢 B+/COV |
| Prawo o ustroju sądów powszechnych | Dz.U. 2024 poz. 334 t.j. ze zm. | `mod-USP-ustroj-sadow-powszechnych` | 🟢 B+/COV |
| Ustawa o Sądzie Najwyższym | Dz.U. 2024 poz. 622 t.j. ze zm. | `mod-ustawa-SN-sad-najwyzszy` | 🟢 B+/COV; temporal gate |
| Prawo o ustroju sądów administracyjnych | Dz.U. 2024 poz. 1267 t.j. | `mod-PUSA-current-state-COV` | 🟢 B+/COV |
| Skarga na naruszenie prawa strony do rozpoznania sprawy bez nieuzasadnionej zwłoki | Dz.U. 2023 poz. 1725 t.j. | `mod-przewleklosc-current-state-COV` | 🟢 B+/COV |
| Ustawa o Krajowej Radzie Sądownictwa | Dz.U. 2024 poz. 1186 t.j. | `mod-KRS-current-state-COV` | 🟢 B+/COV |
| Ustrój władzy — KRS / Rada Ministrów / Prezydent / odpowiedzialność konstytucyjna (moduł przekrojowy) | Konstytucja + właściwe bieżące ustawy ustrojowe | `mod-ustawa-KRS-i-ustroj-wladzy` | ✅ aktywny; każdy akt fresh gate |
| Ustawa o Radzie Ministrów | Dz.U. 2025 poz. 780 t.j. ze zm. | `mod-Rada-Ministrow-current-state-COV` | 🟢 B+/COV |
| Wykonywanie mandatu posła i senatora | Dz.U. 2024 poz. 907 t.j. | `mod-mandat-posla-senatora-current-state-COV` | 🟢 B+/COV |
| Partie polityczne | Dz.U. 2023 poz. 1215 t.j. | `mod-partie-polityczne-current-state-COV` | 🟢 B+/COV |
| Referendum ogólnokrajowe | Dz.U. 2025 poz. 300 t.j. | `mod-ustawa-partie-polityczne-referendum` | 🟢 operacyjny |
| Zasady techniki prawodawczej | Dz.U. 2026 poz. 300 t.j. | `mod-ZTP-przepisy-przejsciowe-doktryna` | 🟢 operacyjny |
| Specustawy / lex specialis — graf zależności | zakres doktrynalny + aktualne akty szczególne | `mod-specustawy-lex-specialis-graf-zaleznosci` | 🟢 operacyjny; akt szczególny zawsze fresh gate |
| Stany nadzwyczajne i sytuacje kryzysowe | rodzina aktualnych ustaw ustrojowych i kryzysowych | `mod-stany-nadzwyczajne-sytuacje-kryzysowe` | 🟢 operacyjny; każdy akt i temporalność fresh gate |

## Reguła użycia

- Konstytucja nie ma tekstu jednolitego; korzystaj z publikacji pierwotnej z uwzględnieniem zmian.
- Dla ustaw ustrojowych i proceduralnych przed konkretnym powołaniem wykonaj fresh gate do ELI/ISAP.
- Stan temporalny każdej jednostki ustala się na dzień sprawy; przed powołaniem wykonaj fresh gate.
- `B+/COV` nie oznacza `FULL`.

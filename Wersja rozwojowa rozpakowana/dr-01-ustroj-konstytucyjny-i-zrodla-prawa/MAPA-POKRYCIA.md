# DR-01 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia korekt i wcześniejsze statusy nie są częścią mapy runtime.

## Legenda

- 🟢 B+ / COV — aktualna struktura aktu zmapowana do użytecznej treści i fresh gate;
- 🟡 — moduł istnieje, ale wymaga dalszego audytu strukturalnego;
- `FULL` — wyłącznie po audycie artykuł-po-artykule.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| Konstytucja RP — Dz.U. 1997 nr 78 poz. 483 | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟢 B+ / COV |
| organizacja i tryb postępowania przed TK — Dz.U. 2019 poz. 2393 | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟡 B+; terminy i formalności zawsze fresh gate |
| Prawo o ustroju sądów powszechnych — Dz.U. 2024 poz. 334 ze zm. | `mod-USP-ustroj-sadow-powszechnych` | 🟢 B+ / COV |
| ustawa o Sądzie Najwyższym — Dz.U. 2024 poz. 622 ze zm. | `mod-ustawa-SN-sad-najwyzszy` | 🟢 B+ / COV |
| Prawo o ustroju sądów administracyjnych — Dz.U. 2024 poz. 1267 | `mod-PUSA-current-state-COV.md` | 🟢 B+ / COV — rozdz. 1–4, WSA/NSA i routing do PPSA zmapowane |
| skarga na przewlekłość postępowania | `mod-USP-ustroj-sadow-powszechnych` | 🟡 — odrębna ustawa, fresh gate |
| ustawa o Krajowej Radzie Sądownictwa | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| ustawa o Radzie Ministrów | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| wykonywanie mandatu posła i senatora | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| partie polityczne | `mod-ustawa-partie-polityczne-referendum` | 🟡 |

## Aktywne luki

1. Konstytucja, PUSP, ustawa o SN i PUSA mają bieżące B+/COV.
2. KRS, ustawa o Radzie Ministrów, wykonywanie mandatu, partie polityczne i odrębna ustawa przewlekłościowa pozostają kolejnymi celami pogłębiania poza F-108.
3. Przy problemach proceduralnych łącz DR-01 z właściwym DR procesowym; PUSA nie zastępuje PPSA.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP.

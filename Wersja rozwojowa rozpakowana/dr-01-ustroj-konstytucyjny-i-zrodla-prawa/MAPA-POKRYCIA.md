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
| Prawo o ustroju sądów administracyjnych — Dz.U. 2024 poz. 1267 | `mod-PUSA-current-state-COV.md` | 🟢 B+ / COV |
| ustawa o Krajowej Radzie Sądownictwa — Dz.U. 2024 poz. 1186 | `mod-KRS-current-state-COV.md` | 🟢 B+ / COV — rozdz. 1–5, kompetencje, ustrój i postępowanie zmapowane |
| ustawa o Radzie Ministrów — Dz.U. 2025 poz. 780 ze zm. | `mod-Rada-Ministrow-current-state-COV.md` | 🟢 B+ / COV — rozdz. 1–7 i routing kompetencji ministrów zmapowane |
| skarga na przewlekłość postępowania | `mod-USP-ustroj-sadow-powszechnych` | 🟡 — odrębna ustawa, fresh gate |
| wykonywanie mandatu posła i senatora | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| partie polityczne | `mod-ustawa-partie-polityczne-referendum` | 🟡 |

## Aktywne luki

1. Konstytucja, PUSP, ustawa o SN, PUSA, KRS i ustawa o Radzie Ministrów mają bieżące B+/COV.
2. Najbliższe luki strukturalne DR-01: wykonywanie mandatu posła i senatora, partie polityczne oraz odrębna ustawa o skardze na przewlekłość.
3. Przy problemach proceduralnych łącz DR-01 z właściwym DR procesowym; ustawy ustrojowe nie zastępują kodeksów proceduralnych.
4. Kompetencje ministra wymagają równoległego sprawdzenia ustawy o działach administracji rządowej i aktualnego rozporządzenia zakresowego.
5. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP.

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
| organizacja i tryb postępowania przed TK — Dz.U. 2019 poz. 2393 | `mod-TK-organizacja-postepowanie-current-state-COV.md` | 🟢 B+ / COV — Działy I–III i wszystkie 10 rozdziałów procesowych Działu II zmapowane |
| Prawo o ustroju sądów powszechnych — Dz.U. 2024 poz. 334 ze zm. | `mod-USP-ustroj-sadow-powszechnych` | 🟢 B+ / COV |
| ustawa o Sądzie Najwyższym — Dz.U. 2024 poz. 622 ze zm. | `mod-ustawa-SN-sad-najwyzszy` | 🟢 B+ / COV |
| Prawo o ustroju sądów administracyjnych — Dz.U. 2024 poz. 1267 | `mod-PUSA-current-state-COV.md` | 🟢 B+ / COV |
| ustawa o Krajowej Radzie Sądownictwa — Dz.U. 2024 poz. 1186 | `mod-KRS-current-state-COV.md` | 🟢 B+ / COV |
| ustawa o Radzie Ministrów — Dz.U. 2025 poz. 780 ze zm. | `mod-Rada-Ministrow-current-state-COV.md` | 🟢 B+ / COV |
| wykonywanie mandatu posła i senatora — Dz.U. 2024 poz. 907 ze zm. | `mod-mandat-posla-senatora-current-state-COV.md` | 🟢 B+ / COV |
| partie polityczne — Dz.U. 2023 poz. 1215 | `mod-partie-polityczne-current-state-COV.md` | 🟢 B+ / COV |
| skarga na przewlekłość — Dz.U. 2023 poz. 1725 | `mod-przewleklosc-current-state-COV.md` | 🟢 B+ / COV |

## Aktywne luki

1. Wszystkie główne pozycje tej mapy mają obecnie co najmniej B+/COV.
2. Następny etap DR-01 to walidacja głębokości i aktualności po nowelizacjach, nie uzupełnianie brakującego routingu.
3. Ustawy ustrojowe nie zastępują kodeksów proceduralnych; kompetencje ministra wymagają również ustawy o działach administracji rządowej i aktualnego rozporządzenia zakresowego.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP.
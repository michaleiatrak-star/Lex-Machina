# DR-01 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia korekt i wcześniejsze statusy nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł istnieje i jest używany, ale brak pełnego audytu całego aktu;
- 🟡 B+ — pokrycie operacyjne pogłębione.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| Konstytucja RP — Dz.U. 1997 nr 78 poz. 483 | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟢 B+ / COV — wszystkie rozdziały I–XIII zmapowane; skarga konstytucyjna, pytanie prawne i test proporcjonalności mają bieżące bramki |
| organizacja i tryb postępowania przed TK — Dz.U. 2019 poz. 2393 | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟢/🟡 B+ — routing i warunki wejścia zmapowane; konkretne terminy i formalności zawsze fresh gate |
| Prawo o ustroju sądów powszechnych — Dz.U. 2024 poz. 334 ze zm. | `mod-USP-ustroj-sadow-powszechnych` | 🟢 B+ / COV — aktywne działy I, II, IV, IVa, V i VI zmapowane; uwzględniono Dz.U. 2026 poz. 370 |
| ustawa o Sądzie Najwyższym | `mod-ustawa-SN-sad-najwyzszy` | 🟢/🟡 B |
| Prawo o ustroju sądów administracyjnych | `mod-USP-ustroj-sadow-powszechnych` | 🟡 — wymaga odrębnego aktualnego audytu PUSA, nie należy wyprowadzać go z PUSP |
| skarga na przewlekłość postępowania | `mod-USP-ustroj-sadow-powszechnych` | 🟡 — odrębna ustawa, fresh gate |
| ustawa o Krajowej Radzie Sądownictwa | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| ustawa o Radzie Ministrów | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| wykonywanie mandatu posła i senatora | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| partie polityczne | `mod-ustawa-partie-polityczne-referendum` | 🟡 |

## Aktywne luki

1. Konstytucja i PUSP mają bieżące B+/COV, ale nie status `FULL` artykuł-po-artykule.
2. PUSA, KRS, ustawa o Radzie Ministrów, wykonywanie mandatu i partie polityczne wymagają dalszego audytu strukturalnego.
3. Ustawa o Sądzie Najwyższym ma dedykowany moduł operacyjny, ale nie jest automatycznie traktowana jako pełny komentarz artykuł-po-artykule.
4. Przy problemach proceduralnych dotyczących sądów łącz DR-01 z DR-02/03/05/12 według rodzaju postępowania.
5. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP przed zastosowaniem.

# DR-01 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia korekt i wcześniejsze statusy nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł istnieje i jest używany, ale brak pełnego audytu całego aktu;
- 🟡 B+ — pokrycie operacyjne pogłębione.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| Konstytucja RP | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟡 |
| organizacja i tryb postępowania przed TK | `mod-Konstytucja-TK-skarga-konstytucyjna` | 🟡 |
| Prawo o ustroju sądów powszechnych | `mod-USP-ustroj-sadow-powszechnych` | 🟡 |
| ustawa o Sądzie Najwyższym | `mod-ustawa-SN-sad-najwyzszy` | 🟢/🟡 B |
| Prawo o ustroju sądów administracyjnych | `mod-USP-ustroj-sadow-powszechnych` | 🟡 |
| skarga na przewlekłość postępowania | `mod-USP-ustroj-sadow-powszechnych` | 🟡 |
| ustawa o Krajowej Radzie Sądownictwa | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| ustawa o Radzie Ministrów | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| wykonywanie mandatu posła i senatora | `mod-ustawa-KRS-i-ustroj-wladzy` | 🟡 |
| partie polityczne | `mod-ustawa-partie-polityczne-referendum` | 🟡 |

## Aktywne luki

1. Konstytucja, TK, PUSP, PUSA i akty ustrojowe nie mają jeszcze statusu `FULL` całego aktu.
2. Ustawa o Sądzie Najwyższym ma dedykowany moduł operacyjny, ale nie jest automatycznie traktowana jako pełny komentarz artykuł-po-artykule.
3. Przy problemach proceduralnych dotyczących sądów łącz DR-01 z DR-02/03/05/12 według rodzaju postępowania.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP przed zastosowaniem.

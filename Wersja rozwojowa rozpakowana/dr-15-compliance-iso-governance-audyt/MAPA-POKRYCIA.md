# DR-15 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze wersje norm/aktów nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł operacyjny, ale bez pełnego audytu całego aktu/normy;
- 🟡 B+ — pokrycie operacyjne pogłębione;
- ⚠️ — wymaga aktualizacji źródła lub weryfikacji wersji normy.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| PZP — zamówienia obronne i bezpieczeństwa | `mod-PZP-zamowienia-obronne-bezpieczenstwa` | 🟡; dołącz DR-07 |
| AML — nadzór finansowy / instytucje obowiązane | `mod-AML-nadzor-finansowy-instytucje` | 🟢/🟡 B+; dołącz DR-06 |
| nauczyciele / uczelnie — compliance pracodawcy | `mod-ustawa-nauczyciele-uczelnie` | 🟡 |
| ochrona sygnalistów | `mod-ustawa-sygnalisci` | 🟢/🟡 B+ |
| ISO 37001 — anti-bribery | `mod-ISO-37001-antykorupcja` | 🟡 |
| ISO 27001 — bezpieczeństwo informacji | `mod-ISO-27001-bezpieczenstwo-informacji` | 🟡 |
| ISO 42001 — AI management | `mod-ISO-42001-AI-management` | 🟡 |
| DORA — compliance sektora finansowego | `mod-DORA-compliance-sektor-finansowy` | 🟢/🟡 B+; dołącz DR-11 |
| ISO 37301 — compliance management | `mod-ISO-37301-compliance-management` | 🟡 |
| ograniczenia działalności osób pełniących funkcje publiczne | `mod-ustawa-antykorupcyjna-1997-ograniczenia` | 🟡 |

## Aktywne luki

1. Norm ISO nie są aktami prawa; ich aktualną wersję i zakres licencyjny należy sprawdzać w oficjalnym źródle normalizacyjnym, a wymagania prawne osobno w właściwym DR.
2. Moduły compliance są warstwą zarządczą i nie zastępują pełnego pokrycia prawa materialnego w DR-06, DR-07, DR-11 i innych domenach.
3. Priorytet pogłębiania: sygnaliści, antykorupcja, DORA oraz mapowanie wymagań ISO na obowiązki prawne.
4. Każdy akt prawny wymaga świeżego źródła urzędowego; dla prawa UE — EUR-Lex.

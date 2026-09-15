# Benchmark

Wyniki testów systemu Lex Machina na zewnętrznych bankach kazusów. Każdy przebieg leży
w katalogu nazwanym datą jego przeprowadzenia.

## Przeprowadzone benchmarki

| Data | Środowisko | Bank | Kazusów | Przebiegów | Najlepszy wynik | Katalog |
|---|---|---|---|---|---|---|
| 2026-09-15 | **ChatGPT — GPT-5.6 Sol** | Kazusy wieloaspektowe (7 międzynarodowych + 7 polskich) | 14 | 4 | **9,34 / 10 — Medium ze skillami** | [`2026-09-15/`](2026-09-15/) |
| 2026-09-08 | Claude | Kazusy wieloaspektowe (7 międzynarodowych + 7 polskich) | 14 | 7 | 9,5 / 10 — Opus 5 ze skillami v3.41 | [`2026-09-08/`](2026-09-08/) |

## Benchmark 2026-09-15 — ChatGPT

**To są wyniki testów przeprowadzonych w ChatGPT.**
Model: **GPT-5.6 Sol**. Porównano cztery konfiguracje: Medium bez skilli,
High bez skilli, Medium ze skillami i High ze skillami.

| Przebieg ChatGPT | Wynik | Pokrycie |
|---|---:|---:|
| GPT-5.6 Sol Medium ze skillami | **9,34** | 14/14 |
| GPT-5.6 Sol High ze skillami | **9,31** | 14/14 |
| GPT-5.6 Sol High bez skilli | 9,16 | 14/14 |
| GPT-5.6 Sol Medium bez skilli | 8,76 | 14/14 |

Wpływ skilli w testach ChatGPT: **+0,58** dla Medium i **+0,15** dla High.
Największy efekt wystąpił w polskich kazusach na Medium: **8,79 → 9,49 (+0,70)**.

Dokumenty:
- [`2026-09-15/METODOLOGIA.md`](2026-09-15/METODOLOGIA.md) — środowisko testowe ChatGPT i zasada oceny;
- [`2026-09-15/WYNIKI.md`](2026-09-15/WYNIKI.md) — macierz 14 × 4 i średnie;
- [`2026-09-15/WPLYW-SKILLI.md`](2026-09-15/WPLYW-SKILLI.md) — analiza wpływu skilli na odpowiedzi ChatGPT.

## Benchmark 2026-09-08 — skrót

Ocena zgodności odpowiedzi z autorskim kluczem, w skali 0–10, według rubryk oceniania
zawartych w samym kluczu (6 obszarów z wagami autora, osobnych dla każdego kazusu).

| Przebieg | Wynik | Pokrycie |
|---|---|---|
| Opus 5 ze skillami v3.41 | **9,5** | 14/14 |
| Opus 5 bez skilli | 9,0 | 14/14 |
| Opus 5 ze skillami v3.37 | 8,8 | 14/14 |
| Sonnet 5 ze skillami v3.41 | 8,0 | 14/14 |
| Sonnet 5 ze skillami v3.x | 6,7 | 14/14 |
| Sonnet 5 bez skilli | 5,7 | 14/14 |
| Haiku 4.5 ze skillami | 2,0 | 7/14 |

Wpływ skilli: **+2,3** na Sonnecie 5, **+0,5** na Opusie 5, brak efektu ratunkowego na
Haiku 4.5. Efekt jest odwrotnie proporcjonalny do siły modelu bazowego, a wersja routera
waży więcej niż sama obecność skilli — router v3.37 obniżył wynik Opusa o 0,2 punktu wobec
próby bez skilli.

## Dokumenty 2026-09-08

| Plik | Zawartość |
|---|---|
| [`2026-09-08/METODOLOGIA.md`](2026-09-08/METODOLOGIA.md) | Skąd wagi, procedura punktowania, kalibracja skali, pięć ograniczeń benchmarku |
| [`2026-09-08/WYNIKI.md`](2026-09-08/WYNIKI.md) | Macierz 14 × 7, średnie, karty ocen z uzasadnieniem każdej noty |
| [`2026-09-08/WPLYW-SKILLI.md`](2026-09-08/WPLYW-SKILLI.md) | Trzy mechanizmy działania skilli, wykaz bramek i wygenerowanych przez nie ustaleń, gdzie skille zawiodły, rekomendacje |
| `2026-09-08/materialy/` | Bank kazusów i klucz autorski |
| `2026-09-08/odpowiedzi/` | Arkusze odpowiedzi wszystkich siedmiu przebiegów, w formie źródłowej |

## Zasada oceny

Klucz autorski jest jedynym miernikiem. Oceniana jest zgodność z kluczem, nie zgodność
z prawem obowiązującym. Klucza nie podważano w żadnym punkcie; tam, gdzie odpowiedź była
lepsza prawniczo, a od klucza odbiegała, punkty spadały.

Materiał ma charakter techniczno-szkoleniowy. Nie jest opinią prawną ani oceną przydatności
systemu do konkretnej sprawy.

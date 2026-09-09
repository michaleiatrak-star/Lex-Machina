# Benchmark

Wyniki testów systemu Lex Machina na zewnętrznych bankach kazusów. Każdy przebieg leży
w katalogu nazwanym datą jego przeprowadzenia.

## Przeprowadzone benchmarki

| Data | Bank | Kazusów | Przebiegów | Najlepszy wynik | Katalog |
|---|---|---|---|---|---|
| 2026-09-08 | Kazusy wieloaspektowe (7 międzynarodowych + 7 polskich) | 14 | 7 | 9,5 / 10 — Opus 5 ze skillami v3.41 | [`2026-09-08/`](2026-09-08/) |

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

## Dokumenty

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

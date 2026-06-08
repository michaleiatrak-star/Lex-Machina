# DEDUPLICATION-POLICY

Stan: 2026-06-02 (wykonano czyszczenie R1).

## Zasada
Moduły merytoryczne prawa polskiego są kanonicznie w:

`/mnt/skills/user/shared/`

Router i skille dziedzinowe mogą zawierać wyłącznie adaptery/stuby z przekierowaniem.
Treść merytoryczna → zawsze i wyłącznie w shared/.

## Status po czyszczeniu R1 (2026-06-02)

## Status po czyszczeniu R1 (2026-06-02) — weryfikacja 2026-06-03

### Stuby lokalne (istniejące, dopuszczalne — adapter z przekierowaniem do shared/):
- `pisma-proste-v2/references/HYBRID-VALIDATION.md` ✅ stub OK (przekierowanie do shared/)
- `pisma-proste-v2/references/INTAKE-GAP.md` ✅ stub OK (przekierowanie do shared/)
- `pisma-proste-v2/references/POST-VALIDATION.md` ✅ stub OK (przekierowanie do shared/)
- `pisma-proste-v2/references/terminy.md` ✅ stub OK (przekierowanie do shared/; M5-terminy.md zachowany)
- `prawny-router-v3/references/HYBRID-VALIDATION.md` ✅ stub OK (przekierowanie do shared/)
- `raport-sytuacyjny-v2/references/HYBRID-VALIDATION.md` ✅ stub OK (przekierowanie do shared/)

> Uwaga: pliki powyżej NIE zostały usunięte — są prawidłowymi adapterami zgodnymi z polityką.
> Poprzedni wpis "✅ usunięto" był błędny (audyt 2026-06-03 wykrył niespójność). Pliki pozostają.

### Naprawione błędne referencje:
- `shared/FAKTY_v2.md` — błędna deklaracja kanoniczna (wskazywała na FAKTY.md) ✅ naprawiono
- `prawny-router-v3/references/MOD-WALIDACJA.md` — wskazywał na MOD-WALIDACJA.md zamiast v2 ✅ naprawiono
- `pisma-procesowe-v3/SKILL.md` — 2× MOD-WALIDACJA.md + 3× FAKTY.md ✅ naprawiono
- `pisma-proste-v2/SKILL.md` — FAKTY.md ✅ naprawiono
- `przewodnik-prawny-v2/SKILL.md` — FAKTY.md ✅ naprawiono
- `shared/SKILL.md` — FAKTY.md ✅ naprawiono
- `shared/HYBRID-VALIDATION.md` — FAKTY.md ✅ naprawiono
- `prawny-router-v3/references/ISAP-AUDIT-PROTOCOL.md` — przekształcono na stub ✅

### Zachowane adaptery (dopuszczalne przez politykę):
- `pisma-proste-v2/references/M5-terminy.md` — adapter z skrótem dla pisma prostego ✅ zachowany
- `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` — adapter z listą view do shared/ ✅ zachowany
- `prawny-router-v3/references/MOD-WALIDACJA.md` — stub przekierowujący ✅ naprawiony
- `prawny-router-v3/references/ISAP-AUDIT-PROTOCOL.md` — stub ✅ przekształcony

### Pliki kanoniczne w shared/ (jedyne źródła prawdy):
| Plik | Funkcja |
|---|---|
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa po wygenerowaniu pisma |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu pisma |
| `MOD-WALIDACJA_v2.md` | Walidacja formalna i prawnicza (bloki A–J) — JEDYNE ŹRÓDŁO |
| `MOD-WALIDACJA.md` | STUB → przekierowuje do MOD-WALIDACJA_v2.md |
| `FAKTY_v2.md` | MOD-FAKTY — weryfikacja zgodności faktycznej ze źródłem — JEDYNE ŹRÓDŁO |
| `FAKTY.md` | STUB → przekierowuje do FAKTY_v2.md |
| `ISAP-AUDIT-PROTOCOL.md` | Protokół aktualności prawa |
| `WERYFIKACJA-SLAD.md` | Ślad weryfikacji przepisów i orzeczeń |
| `terminy.md` | Tabela terminów zawitych (KPC/KPK/KPW/KPA/KP) |
| `SYGNATURY.md` | Format sygnatur procesowych (V-SYG-1/2/3/4) |
| `DISCLAIMER.md` | Disclaimer prawny (LAIK/PRAWNIK) |
| `PRAWO-HARDGATE.md` | Hard gate zakazu cytowania z pamięci |

## Kiedy duplikat jest dopuszczalny
- gdy router/skill wymaga krótkiego adaptera z logiką specyficzną dla skilla,
- gdy plik jest świadomie oznaczony jako `ADAPTER` lub `STUB`, a nie źródło merytoryczne,
- adapter zawiera jedynie: nagłówek STUB + ścieżkę `view shared/...` + opcjonalny skrót.

## Reguła dla nowych modułów
Każdy nowy moduł merytoryczny → wyłącznie w `shared/`.
Nowy adapter w skill → tylko gdy ścieżka w skill nie pokrywa się z ścieżką shared/.

# JURYSDYKCJA PL — manifest kluczy `JUR:`

Skille wykonawcze opisują metodę; treść prawa krajowego wskazują kluczem `JUR:<klucz>`.
Ten plik mapuje każdy klucz na moduł prawa polskiego. Inna jurysdykcja = inny pakiet
z tym samym zestawem kluczy (`shared/UNIVERSAL-RUNTIME-ADAPTER.md` §1B).

| Klucz | Moduł | Zakres |
|---|---|---|
| `JUR:terminy-procesowe` | `shared/terminy.md` | terminy procesowe i materialne wszystkich reżimów (KPC, KPK, KPW, KPA, PPSA, KP, KC i inne), reguły liczenia |
| `JUR:oplaty-sadowe` | `shared/TABELE-OPLAT.md` | opłaty sądowe i koszty |
| `JUR:hierarchia-zrodel` | `shared/HIERARCHIA-ZRODEL.md` | rzędy źródeł, kanon weryfikacji przepisów (ELI, ISAP) |
| `JUR:zrodla-aktow` | `prawny-router-v3/references/ZRODLA-AKTOW-FALLBACK.md` | gdzie czytać akt, gdy źródło urzędowe zawodzi |
| `JUR:mapa-dziedzin` | `prawo-polskie-v2/ROUTING-MAP.md` | dziedziny prawa (DR-01…DR-16) i ich skille |

Zasady:
- Jeden klucz = jeden moduł. Klucz nie zmienia znaczenia; zmienia się tylko moduł, na który wskazuje.
- Klucz bez wiersza albo moduł, którego nie ma → `⛔ TRYB ZDEGRADOWANY — klucz jurysdykcji nierozwiązany`.
- Przeniesienie treści prawa polskiego ze skilla wykonawczego do modułu jest dopuszczalne
  tylko, gdy każdy przeniesiony wiersz ma odpowiednik w module (test równoważności
  `audyt-systemu-v4/scripts/check_jurysdykcja.py`, T50).

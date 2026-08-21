# przesluchanie-swiadkow-v2-min90

Przygotowanie przesłuchania i kontrprzesłuchania świadka: profil świadka,
tezy, dobór modelu, pytania z pełną bramką dopuszczalności, binder sądowy
i adaptacja na sali.

## Jak to działa

Wejście przez `SKILL.md`. Pipeline jest sekwencyjny i nie wolno go skracać:

```
PRE-W1a  SD-VER      → kompletność materiału (HARD GATE, OCR dla skanów)
PRE-W1a.4 RZ-SHOW    → rejestr plików pokazany użytkownikowi (HARD GATE)
PRE-W1a.5 DG-LOAD    → wczytanie shared/MOD-DOKUMENT-GATES.md (HARD GATE)
PRE-W1   INTELLIGENCE→ profil świadka i mapa wiedzy
KROK 0   KONTEKST    → zasilenie z analizatora dowodów / pliku kontekstu
W1       INTAKE      → dane świadka, tezy, dowody
W2       TYPOLOGIE + TEZY I MODEL
CHECKPOINT-W2        → OBOWIĄZKOWA pauza, akceptacja użytkownika
W3       PYTANIA     → FPW + bramka dopuszczalności + scoring
W4/W5/W6 próba generalna → binder → słuchanie direct
```

## Tryby

- **Domyślny: tekstowy.** Tryb graficzny (JSX/widget) wyłącznie na wyraźne
  żądanie („pokaż graficznie", „dashboard", „panel JSX", „wizualizacja").
- W razie wątpliwości — tryb tekstowy.

## Struktura pakietu

| Katalog | Rola |
|---|---|
| `references/` | bramki i metodyka wczytywane na żądanie + pełny CHANGELOG |
| `typologies/` | taksonomie świadka i sędziego + macierz par — wczytywane w W2 (TYPOLOGIE-LOAD) |
| `templates/`, `schemas/`, `examples/` | formaty wyjścia i kontrakt danych dla trybu graficznego |
| `rules/`, `integration/` | polityki routingu i renderowania dla runnera portalu |
| `assets/` | samowystarczalny JSX trybu graficznego |
| `tests/` | przypadki regresyjne |

⚠️ **JSX w `assets/` jest samowystarczalny i nie importuje komponentów
lokalnych.** Nie dodawaj twardych importów z podkatalogów komponentów, chyba
że runner portalu gwarantuje kopiowanie całego drzewa — złamanie tej zasady
było przyczyną błędu `Module not found` w historii pakietu.

## Zależności współdzielone (twarde)

`shared/MOD-SKAN-DOWODOW-KOMPLETNY.md`, `shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md`,
`shared/MOD-STEP-TRACKER.md`, `shared/MOD-DOKUMENT-GATES.md`, `shared/PRAWO-HARDGATE.md`.

Historia wersji: `references/CHANGELOG.md` (jedyny changelog tego pakietu
od 2026-08-20z).

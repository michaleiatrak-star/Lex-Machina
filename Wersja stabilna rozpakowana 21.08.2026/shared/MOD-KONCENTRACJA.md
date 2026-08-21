# MOD-KONCENTRACJA — metryka długości i zwięzłości pisma

> Wersja: 1.0.0 | Typ: moduł jakości | shared/
> Wywoływany z: pisma-procesowe-v3 W3.4 (MOD-WALIDACJA, blok C) · MOD-REDAKCJA
> Podstawa ekspercka: Suntum ALI-ABA 2007 ("Personal rule: summarize a pleading
> in two pages or less. No substitute for taking time to craft a succinct, direct,
> clear pleading."); George Bernard Shaw paradox (krótsze = więcej pracy);
> Garner: "Every word that is not a help is a hindrance."

---

## 1. Limity orientacyjne per typ pisma

Limity nie są bezwzględnymi bramkami — są sygnałem, że pismo może być zbyt długie.
Alert gdy przekroczony, bez blokady. Rekomendacja skrócenia przed złożeniem.

```
TYP PISMA                           LIMIT ORIENTACYJNY    EXECUTIVE SUMMARY
─────────────────────────────────────────────────────────────────────────────
Pozew (prosta sprawa, 1 roszczenie)      8 str.           obowiązkowy
Pozew (złożona sprawa, ≥2 roszczenia)   14 str.           obowiązkowy
Odpowiedź na pozew                       8 str.           obowiązkowy gdy >4 str.
Pismo przygotowawcze                     5 str.           opcjonalny
Replika                                  5 str.           opcjonalny
Apelacja                                10 str.           obowiązkowy
Zażalenie                                4 str.           opcjonalny
Skarga do WSA                            8 str.           obowiązkowy
Skarga kasacyjna do SN/NSA              12 str.           obowiązkowy
Zawiadomienie o przestępstwie (KPK)      4 str.           —
Wezwanie do zapłaty (przedsądowe)        2 str.           —
─────────────────────────────────────────────────────────────────────────────
"strona" = ~2500 znaków ze spacjami (A4, Times 12, marginesy 2,5 cm)
```

---

## 2. Algorytm oceny (KROK K1–K4)

```
KROK K1: Oblicz szacowaną długość pisma z W2
  → policz akapity × średnia długość akapitu
  → szacunek w stronach (co 2500 znaków = 1 strona)

KROK K2: Porównaj z limitem z §1
  → pismo ≤ limit → KONCENTRACJA-OK
  → pismo > limit o ≤20% → KONCENTRACJA-WARN (pismo długie)
  → pismo > limit o >20% → KONCENTRACJA-ALERT (pismo za długie — skróć przed złożeniem)

KROK K3: Gdy WARN lub ALERT — uruchom analizę nadmiaru
  Pytania diagnostyczne:
  D1: Czy stan faktyczny zawiera informacje nieistotne dla żądania?
      TAK → skróć do faktów kluczowych (z W1.3)
  D2: Czy uzasadnienie prawne powtarza argumenty w różnych sformułowaniach?
      TAK → zostaw jedno, najsilniejsze sformułowanie
  D3: Czy pismo zawiera polemikę ze stanowiskiem, które przeciwnik jeszcze
      nie zajął (antycypacja nadmiarowa)?
      TAK → przenieś do argumentu ewentualnego lub usuń
  D4: Czy każdy akapit ma konkretną funkcję procesową?
      NIE → usuń akapit lub scalj z sąsiednim

KROK K4: Raport KONCENTRACJA
```

---

## 3. Format raportu KONCENTRACJA

```
RAPORT MOD-KONCENTRACJA
─────────────────────────────────────────────────────────
Typ pisma:        [typ]
Szacowana długość: [X] stron ([Y] znaków)
Limit orientacyjny: [Z] stron
Status:           [KONCENTRACJA-OK / KONCENTRACJA-WARN / KONCENTRACJA-ALERT]
─────────────────────────────────────────────────────────
[Gdy WARN / ALERT:]
Główne obszary nadmiaru:
  D1 (stan faktyczny): [TAK — usuń akapity: X | NIE]
  D2 (powtórzenia):    [TAK — scal sekcje: X | NIE]
  D3 (antycypacja):    [TAK — przenieś lub usuń: X | NIE]
  D4 (funkcja):        [TAK — usuń akapity: X | NIE]

Rekomendacja: [skróć o ok. X str. przed złożeniem]
              [priorytetowe cięcia: ...]
─────────────────────────────────────────────────────────
```

---

## 4. Zasady skracania (Shaw's paradox w praktyce)

```
Reguła K-A (Shaw): krótsze pismo wymaga więcej pracy niż długie.
  → Przeznacz min. 15–30 min na cięcia po wygenerowaniu W2.
  → Nie skracaj natychmiast — najpierw przeczytaj raz całość.

Reguła K-B (Garner): "Cut one fourth of every sentence in your first draft."
  → Konkretna technika: zaznacz każde zdanie >25 słów → skróć o połowę.

Reguła K-C (koncentracja osi):
  → Jedna teza centralna (W1.2) = jedna oś pisma.
  → Każde zdanie albo wzmacnia tę oś, albo jest zbędne.

Reguła K-D (zasada dostępności):
  → Sędzia powinien zrozumieć istotę sprawy po przeczytaniu executive summary
    i ostatniego akapitu uzasadnienia — bez czytania środka.
  → Test: przeczytaj tylko executive summary + ostatni akapit uzasadnienia.
    Czy suma jest sensowna? NIE → coś ważnego zostało ukryte w środku, a nie
    podkreślone na początku lub końcu.
```

---

## 5. Integracja z pipeline

```
W3.4 — MOD-WALIDACJA (blok C — styl procesowy):
  Po bloku C, dodaj krok KROK K1–K4 z MOD-KONCENTRACJA:
  view /mnt/skills/user/shared/MOD-KONCENTRACJA.md
  → Wyświetl RAPORT MOD-KONCENTRACJA
  → Wynik KONCENTRACJA-OK → kontynuuj W3.5
  → Wynik WARN/ALERT → przedstaw rekomendacje; decyzja o skróceniu po stronie
    użytkownika (nie blokuje generowania .docx)

MOD-REDAKCJA (Test A — redakcja gotowego pisma):
  Gdy użytkownik prosi o skrócenie pisma:
  view /mnt/skills/user/shared/MOD-KONCENTRACJA.md
  → Uruchom KROK K1–K4 na dostarczonym piśmie
  → Zastosuj reguły K-A / K-B / K-C / K-D
  → Dostarcz wersję skróconą z raportem zmian
```

# INTAKE-GAP — Zarządzanie brakami danych faktycznych

## KIEDY URUCHAMIAĆ

Przed redakcją pisma lub dokumentu, gdy brakuje danych faktycznych
niezbędnych do poprawnego wygenerowania treści.

---

## TRYBY — wybierz jeden

### TRYB 1 — PYTANIE ZBIORCZE (dane krytyczne brakują)

Użyj gdy brakuje danych bez których nie możesz zacząć pisma:
strony, typ żądania, istota sporu, kwota.

```
FORMAT JEDNEGO PYTANIA ZBIORCZEGO:
"Żeby przygotować pismo, potrzebuję kilku podstawowych danych:
  1. Kto jest stroną? (imię, nazwisko / nazwa firmy, adres)
  2. Przeciwko komu? (dane pozwanego/organu)
  3. O co chodzi? (żądanie w jednym zdaniu)
  4. Kwota / wartość sporu? (jeśli dotyczy)
Możesz podać tyle, ile masz — resztę oznaczę jako ⬛."
```

**Zasada:** jedno pytanie zbiorcze, nie seria pytań po jednym.

---

### TRYB 2 — ZNACZNIK ⬛ (dane uzupełniające brakują)

Użyj gdy masz dane krytyczne, ale brakuje szczegółów (daty, numery,
kwoty składowe, dane KRS/PESEL, sygnatura akt).

```
FORMAT ZNACZNIKA:
⬛ [UZUPEŁNIJ: opis czego brakuje]

Przykłady:
  ⬛ [UZUPEŁNIJ: data zawarcia umowy]
  ⬛ [UZUPEŁNIJ: PESEL pozwanego]
  ⬛ [UZUPEŁNIJ: sygnatura akt sprawy]
  ⬛ [UZUPEŁNIJ: kwota odsetek na dzień złożenia pozwu]
```

Generuj pismo z ⬛ w miejscach brakujących danych.
Po wygenerowaniu → uruchom HYBRID-VALIDATION.

---

### TRYB 3 — WZÓR SZKIELETOWY (brak danych, użytkownik chce wzór)

Użyj gdy użytkownik wprost prosi o wzór / szablon / pustą wersję pisma.

```
Generuj pismo ze WSZYSTKIMI polami jako ⬛:
⬛ [UZUPEŁNIJ: imię i nazwisko powoda]
⬛ [UZUPEŁNIJ: adres powoda]
⬛ [UZUPEŁNIJ: data zdarzenia]
... itd.

Po wygenerowaniu NIE uruchamiaj HYBRID-VALIDATION
(raport braków nie ma sensu gdy wszystko jest ⬛).
```

---

## PRIORYTETY PYTAŃ — co pytać najpierw

```
POZIOM 1 — KRYTYCZNE (bez nich nie możesz zacząć):
  □ Kim są strony?
  □ Jaki typ pisma / żądania?
  □ Jaka istota sporu?

POZIOM 2 — ISTOTNE (potrzebne w treści):
  □ Daty kluczowych zdarzeń
  □ Kwoty i ich składowe
  □ Sygnatura akt (jeśli sprawa w toku)

POZIOM 3 — UZUPEŁNIAJĄCE (wstaw ⬛, nie pytaj):
  □ PESEL/NIP/KRS stron
  □ Numery kont, rejestrów
  □ Dane świadków, biegłych
  □ Szczegóły proceduralne (nr zarządzenia itp.)
```

---

## SEKWENCJA POSTĘPOWANIA

```
1. Oceń które dane brakują → przypisz do poziomu 1/2/3
2. Jeśli brakuje POZIOM 1 → TRYB 1 (pytanie zbiorcze)
3. Jeśli brakuje POZIOM 2 → TRYB 2 (znaczniki ⬛)
4. Jeśli użytkownik chce wzór → TRYB 3
5. Po otrzymaniu odpowiedzi → wygeneruj lub uzupełnij pismo
6. Uruchom HYBRID-VALIDATION (z wyjątkiem TRYBU 3)
```

---

## FORMAT WYJŚCIA PO UZUPEŁNIENIU

```
📝 UZUPEŁNIONO DANE
Otrzymano: [lista co podano]
Brakuje jeszcze: [lista ⬛ które pozostają]
Generuję pismo...
```

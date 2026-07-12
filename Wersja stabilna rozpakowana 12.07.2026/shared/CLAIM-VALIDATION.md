# MOD-CLAIM-VALIDATION — Walidacja Twierdzeń Strony względem Materiału Dowodowego

**Plik kanoniczny:** `/mnt/skills/user/shared/CLAIM-VALIDATION.md`
Wywołuj przez: `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`

---

## Cel

Weryfikacja twierdzeń strony (tez, roszczeń, zarzutów, tez dowodowych, twierdzeń
procesowych) pod kątem ich oparcia w dostarczonych materiałach.

Stosuj zawsze gdy:
- strona lub użytkownik formułuje twierdzenie faktyczne lub procesowe,
- skill generuje tezy dowodowe na podstawie opisu sprawy,
- skill przygotowuje pytania do świadka oparte na tezach strony,
- skill analizuje pismo procesowe zawierające twierdzenia bez materiału źródłowego.

---

## ZASADA NADRZĘDNA — CLAIM-FIRST

> Twierdzenie strony nieznajdujące oparcia w dostarczonych dowodach, dokumentach
> ani przepisach prawa jest **błędne procesowo** i musi być:
> 1. **zidentyfikowane jako nieudowodnione**,
> 2. **zastąpione twierdzeniem wynikającym faktycznie z materiałów**, jeśli materiały
>    zawierają odmienną treść,
> 3. **oznaczone jako luka dowodowa**, jeśli materiały milczą w danym zakresie.
>
> Twierdzenie wynikające wprost z przepisu prawa (zweryfikowanego online) jest
> traktowane jako **udowodnione normatywnie** — nawet bez dokumentu w aktach.

Zakaz: nie wolno przyjmować twierdzenia strony jako faktu tylko dlatego, że strona
je formułuje lub że brzmi wiarygodnie. Każde twierdzenie wymaga weryfikacji.

---

## KROK C0 — SKAN PISM PROCESOWYCH STRONY (NOWE — v1.1.0)

> ⛔ WYKONAJ JAKO PIERWSZY, PRZED KROK C1.
> Trigger: gdy SD-FAKTY zawiera ≥1 plik typu "pismo procesowe strony"
> (riposta, pismo przygotowawcze, odpowiedź na pozew, rozszerzenie pozwu,
> propozycja ugodowa, wezwanie przedsądowe, pismo własne powoda/pozwanego).

### Cel

Pisma procesowe strony często zawierają roszczenia i twierdzenia które NIE zostały
przekazane przez użytkownika jako "lista roszczeń do pisma" — bo użytkownik skupia
się na nowych roszczeniach, a model milcząco pomija wcześniejsze twierdzenia.
Ten krok wymusza ich wykrycie.

### Procedura C0:

```
KROK C0.1 — IDENTYFIKACJA PISM PROCESOWYCH W MATERIALE:
  Przejrzyj SD-FAKTY (z MOD-SKAN-DOWODOW-KOMPLETNY):
  → Wypisz każdy D[id] z typ_dokumentu = "pismo procesowe strony" LUB
    "odpowiedź", "riposta", "wezwanie", "propozycja ugodowa", "pismo własne"

KROK C0.2 — PER PISMO: WYPISZ WSZYSTKIE WĄTKI PRAWNE:
  Dla każdego pisma procesowego:
    a) wymienione roszczenia (kwotowe, ustalające, nakazowe)
    b) wymienione podstawy prawne (artykuły KP, KC, KPC, KK, KEA itp.)
    c) wymienione wnioski dowodowe (o dopuszczenie dowodu, o zobowiązanie)
    d) zarzuty wobec przeciwnika (mobbing, zakaz konkurencji, fałszywe zeznania,
       konflikt interesów, bezpodstawne wzbogacenie itp.)
    e) sygnatury innych postępowań, o których pismo wspomina
    f) twierdzenia o faktach nieprzywołane w opisie użytkownika
    g) propozycje ugodowe i ich warunki

KROK C0.3 — KONFRONTACJA Z AKTUALNĄ LISTĄ TEZ:
  Dla każdego wątku z C0.2:
    → Czy wątek jest pokryty przez którąkolwiek z tez T1..Tn?
       TAK: oznacz "pokryte przez T[x]" → pomij
       NIE: oznacz jako T_BRAK[id] = "nowy wątek niewłączony do sprawy"

KROK C0.4 — RAPORT C0 I ZAPYTANIE DO UŻYTKOWNIKA:
  Wyświetl:
  ┌────────────────────────────────────────────────────────────┐
  │ ⚠️ CLAIM-VALIDATION C0 — WĄTKI Z PISM PROCESOWYCH         │
  │                                                            │
  │ Pisma procesowe strony zawierają wątki nieujęte w liście   │
  │ tez sprawy:                                                │
  │                                                            │
  │  T_BRAK-01: [wątek] — źródło: D[id], str. [X]             │
  │  T_BRAK-02: [wątek] — źródło: D[id]                       │
  │  ...                                                       │
  │                                                            │
  │ Czy uwzględnić w piśmie procesowym?                        │
  │  a) Tak, wszystkie — dodaj do tez i pisma                  │
  │  b) Tak, wybrane — wskaż które (nr T_BRAK)                 │
  │  c) Nie — kontynuuj tylko z aktualnymi tezami              │
  └────────────────────────────────────────────────────────────┘
  → ⛔ STOP. Czekaj na odpowiedź użytkownika.
  → Po odpowiedzi: aktualizuj listę tez T1..Tn zgodnie z decyzją.
  → Dopiero po zatwierdzeniu: przejdź do KROK C1.

⛔ ZAKAZ: nie przeskakuj do C1 bez wykonania C0 gdy w materiale są pisma strony.
   Pominięcie wątku z pisma strony = błąd systemowy klasy CRIT.
```

---

## PROCEDURA WERYFIKACJI TWIERDZEŃ (wykonaj przed wygenerowaniem tez / pytań / pisma)

### KROK C1 — INWENTARYZACJA TWIERDZEŃ STRONY

Wypisz wszystkie twierdzenia faktyczne lub procesowe strony:
- twierdzenia z opisu słownego użytkownika,
- tezy z dokumentów strony (pozew, odpowiedź, pismo przygotowawcze),
- twierdzenia o faktach będące podstawą żądania lub obrony.

### KROK C2 — KONFRONTACJA Z MATERIAŁEM I PRZEPISAMI

Dla każdego twierdzenia sprawdź kolejno:
a) wynika wprost z dostarczonego dokumentu / dowodu,
b) wynika pośrednio (wniosek logiczny z udokumentowanych faktów),
c) wynika wprost z przepisu prawa — **zweryfikuj online** (ISAP / eli.gov.pl):
   - wykonaj `web_search` z zapytaniem o konkretny przepis,
   - odczytaj aktualną treść normy,
   - oceń czy twierdzenie strony jest zgodne z brzmieniem przepisu,
   - jeśli zgodne → `[✅ NORMATYWNE]`; jeśli niezgodne → `[⛔ SPRZECZNE Z PRAWEM]`,
d) jest sprzeczne z dokumentem / dowodem → `[⛔ SPRZECZNE]`,
e) nie ma żadnego oparcia ani w materiale, ani w przepisach → `[⛔ NIEUDOWODNIONE]`.

**Kolejność weryfikacji jest obowiązkowa** — nie przechodzić do (e) bez sprawdzenia (c).

### KROK C3 — KLASYFIKACJA I KOREKTA

| Status | Oznaczenie | Działanie |
|---|---|---|
| Twierdzenie zgodne z materiałem dowodowym | `[✅ UDOWODNIONE]` | Przyjmij jako podstawę tezy / pytania |
| Twierdzenie wynikające wprost z przepisu (zweryfikowanego) | `[✅ NORMATYWNE]` | Przyjmij; wskaż podstawę prawną z numerem artykułu i ustawy |
| Twierdzenie częściowo zgodne | `[⚠️ CZĘŚCIOWE]` | Przyjmij z ograniczeniem — opisz zakres potwierdzony |
| Wniosek logiczny z udokumentowanych faktów | `[✅ POŚREDNIE]` | Przyjmij; opisz łańcuch wnioskowania |
| Twierdzenie sprzeczne z materiałem dowodowym | `[⛔ SPRZECZNE]` | Odrzuć; zastąp twierdzeniem wynikającym z materiału |
| Twierdzenie sprzeczne z przepisem prawa | `[⛔ SPRZECZNE Z PRAWEM]` | Odrzuć; wskaż prawidłowe brzmienie normy; poinformuj użytkownika |
| Twierdzenie bez oparcia w materiale ani przepisach | `[⛔ NIEUDOWODNIONE]` | Oznacz jako lukę; nie formułuj tezy ani pytania opartego na tym twierdzeniu |

### KROK C4 — KOREKTA TWIERDZEŃ BŁĘDNYCH I DOKUMENTACJA NORMATYWNYCH

Dla każdego `[✅ NORMATYWNE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
PODSTAWA PRAWNA:     [art. X ustawy Y — zweryfikowano: URL]
TREŚĆ NORMY:         [dosłowne lub bliskie brzmienie przepisu]
STATUS:              udowodnione normatywnie — brak wymogu dokumentu w aktach
```

Dla każdego `[⛔ SPRZECZNE Z PRAWEM]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
PRZEPIS:             [art. X ustawy Y — zweryfikowano: URL]
PRAWIDŁOWE BRZMIENIE:[co przepis faktycznie stanowi]
KOREKTA:             [twierdzenie zastąpcze zgodne z normą]
SKUTEK PROCESOWY:    [ryzyko dla pozycji strony]
```

Dla każdego `[⛔ SPRZECZNE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
MATERIAŁ DOWODOWY:   [co faktycznie wynika z dokumentu/dowodu — ze wskazaniem źródła]
KOREKTA:             [twierdzenie zastąpcze oparte na materiale]
SKUTEK PROCESOWY:    [co oznacza ta rozbieżność dla pozycji strony]
```

Dla każdego `[⛔ NIEUDOWODNIONE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
STATUS:              brak oparcia w materiale dowodowym i przepisach
LUKA DOWODOWA:       [opis czego brakuje]
REKOMENDACJA:        [jaki dowód / dokument / przepis mógłby to wykazać]
```

---

## RAPORT WALIDACJI TWIERDZEŃ

Wyświetl zawsze gdy wykryto `[⛔ SPRZECZNE]` lub `[⛔ NIEUDOWODNIONE]`:

```
RAPORT WALIDACJI TWIERDZEŃ (MOD-CLAIM-VALIDATION)

⛔ TWIERDZENIA SPRZECZNE Z MATERIAŁEM — wymagają korekty:
  [nr]. Twierdzenie: [...]
        Materiał mówi: [...] (źródło: [...])
        Twierdzenie zastąpcze: [...]
        Skutek: [...]

⛔ TWIERDZENIA SPRZECZNE Z PRAWEM — wymagają korekty:
  [nr]. Twierdzenie: [...]
        Przepis: [...] (zweryfikowano: URL)
        Prawidłowe brzmienie: [...]
        Twierdzenie zastąpcze: [...]
        Skutek: [...]

⛔ TWIERDZENIA NIEUDOWODNIONE — brak oparcia w materiale i przepisach:
  [nr]. Twierdzenie: [...]
        Luka: [opis]
        Rekomendacja: [co dostarczyć / jaki przepis sprawdzić]

⚠️ TWIERDZENIA CZĘŚCIOWE — przyjęte z ograniczeniem:
  [nr]. Twierdzenie: [...]
        Zakres potwierdzony: [...]
        Zakres niepotwierdzony: [...]

✅ TWIERDZENIA NORMATYWNE (bez dokumentu, wynikają z przepisu):
  [nr]. Twierdzenie: [...] — podstawa: art. X ustawy Y (URL)

✅ TWIERDZENIA UDOWODNIONE: [n] twierdzeń bez zastrzeżeń
```

---

## ZASADA BLOKADY

Jeśli twierdzenie jest `[⛔ SPRZECZNE]`, `[⛔ SPRZECZNE Z PRAWEM]` lub `[⛔ NIEUDOWODNIONE]`:
- **NIE formułuj tezy dowodowej opartej na tym twierdzeniu**,
- **NIE generuj pytań do świadka mających udowodnić to twierdzenie**,
- **NIE umieszczaj tego twierdzenia w piśmie procesowym**,
- zamiast tego: użyj twierdzenia zastępczego z C4 lub oznacz lukę dowodową.

Wyjątek: jeśli użytkownik świadomie chce formułować twierdzenie procesowe
pomimo braku dowodu (np. teza wymagająca dopiero przeprowadzenia dowodu na
rozprawie) — odnotuj to jawnie i opisz ryzyko procesowe.

---

## KROK CV-ALT — ROSZCZENIE ALTERNATYWNE (v1.1 — UNIVERSALNY)

> **Trigger:** po klasyfikacji WSZYSTKICH twierdzeń strony (C3).
> Wykonaj ZAWSZE gdy: ≥1 teza procesowa zidentyfikowana jako `[✅ UDOWODNIONE]`
> lub `[✅ NORMATYWNE]`.

### Cel

Zidentyfikować ścieżkę alternatywną S2 — inną podstawę prawną prowadzącą
do tego samego skutku co ścieżka główna S1 — i wbudować ją do pisma
jako wariant ewentualny.

Korzyść procesowa: sąd, który nie uwzględni S1, może uwzględnić S2.
Przeciwnik musi obalić obie ścieżki osobno.

### Procedura CV-ALT:

```
KROK CV-ALT.1 — IDENTYFIKACJA:
  Dla każdej tezy / roszczenia zakwalifikowanego jako ✅:
    → Czy istnieje INNA podstawa prawna (inny przepis) prowadząca
      do IDENTYCZNEGO skutku dla strony?
    → TAK: zapisz S2 = [inna podstawa + przepis]
    → NIE / BRAK: zapisz "brak S2" i przejdź dalej

KROK CV-ALT.2 — WERYFIKACJA SPÓJNOŚCI:
  □ S2 nie może przeczyć S1 (sprzeczność logiczna) → porzuć S2
  □ S2 nie może osłabiać S1 przez implikację → porzuć S2
  □ S2 musi mieć własną, odrębną podstawę prawną → potwierdź przepis
  □ S2 musi być zweryfikowana pod HARDGATE (przepis z ISAP) przed W3

KROK CV-ALT.3 — POZYCJA W PIŚMIE:
  S1 = argumentacja główna (pełna, wszystkie argumenty)
  S2 = 1 akapit, format:
  "Niezależnie od powyższego, nawet gdyby Sąd nie podzielił argumentacji
  opartej na [S1 — opis], powód wskazuje, że [S2] prowadzi do identycznego
  skutku, albowiem [2-3 zdania podstawy S2 + przepis]."

  ⛔ ZAKAZ: nie odwracaj kolejności S1/S2. Nie dawaj S2 więcej miejsca niż S1.

KROK CV-ALT.4 — OUTPUT DO W1.3:
  Jeśli S2 zidentyfikowana: dostarcz gotowy akapit S2 do wstawienia w uzasadnieniu
  Jeśli brak S2: notatka "brak ścieżki alternatywnej" → kontynuuj bez zmian
```

### Przykłady par S1/S2 (ilustracyjne, nie wyczerpujące):

```
Sprawa pracownicza — ciągłość zatrudnienia:
  S1: art. 23¹ §1 KP (przejście zakładu pracy → podmiot B wstępuje w prawa podmiotu A)
  S2: art. 25¹ §3 KP (czwarta umowa terminowa → konwersja z mocy prawa)
  Skutek obu: umowa na czas nieokreślony → wynagrodzenie za gotowość

Sprawa cywilna — zapłata:
  S1: podstawa kontraktowa (art. 353 KC — niewykonanie umowy)
  S2: bezpodstawne wzbogacenie (art. 405 KC) gdy brak ważnej umowy
  Skutek obu: zapłata kwoty X

Sprawa administracyjna — uchylenie decyzji:
  S1: naruszenie prawa materialnego (błędna wykładnia przepisu)
  S2: naruszenie procedury (brak udziału strony, art. 10 KPA)
  Skutek obu: uchylenie decyzji i przekazanie do ponownego rozpatrzenia
```

---

## Integracja z MOD-FAKTY

MOD-CLAIM-VALIDATION weryfikuje twierdzenia **przed** wygenerowaniem treści.
MOD-FAKTY weryfikuje wygenerowaną treść **po** jej wygenerowaniu.
Oba moduły są komplementarne — nie zastępują się wzajemnie.

Krok CV-ALT zasila W1.3 (mapa cel→przesłanka→dowód) obok głównej ścieżki S1.

---

## HISTORIA ZMIAN

```
1.1.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  Problem: pismo procesowe (rozszerzenie pozwu) pomijało co najmniej 6 wątków
  prawnych zawartych w pismach procesowych powoda dostępnych w materiale:
  - art. 94³ §3 KP (odszkodowanie za mobbing) — pismo Riposta, pismo 12.05.2026
  - art. 101¹ §1 KP (abuzywny zakaz konkurencji) — Riposta pkt IV
  - fałszywe zeznania Marii Koroleva, sprawa VIII W 633/25 — pismo 12.05.2026 pkt IV
  - art. 6 KEA (konflikt interesów pełnomocnika) — Riposta pkt VI
  - roszczenie z tytułu opłat za pozwolenia na pracę / przywłaszczenie — Riposta pkt III/V
  - propozycja ugodowa (zakres wycofania roszczeń) — pismo 12.05.2026 pkt V
  Przyczyna systemowa: brak kroku wykrywającego wątki z pism procesowych
  strony w materiale dowodowym i pytającego użytkownika czy uwzględnić.
Naprawa:
  + KROK C0 — SKAN PISM PROCESOWYCH STRONY: obowiązkowy skan wątków
    z każdego D[id] = "pismo procesowe strony", konfrontacja z T1..Tn,
    raport T_BRAK i zapytanie użytkownika + STOP.
  + Skan C0 musi być wykonany PRZED C1 — lista tez aktualizowana po C0.

1.0.0 (pierwotna)
  MOD-CLAIM-VALIDATION — pierwotna wersja (data nieznana).
  Weryfikacja twierdzeń strony vs materiał i przepisy.
  Krok CV-ALT (roszczenie alternatywne) dodany w wersji 1.0.
```


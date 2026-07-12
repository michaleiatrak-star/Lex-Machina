# MOD-KOSZT-ODPOWIEDZI — Optymalizacja Kosztu Procesowego dla Przeciwnika

> **Plik:** `/mnt/skills/user/shared/MOD-KOSZT-ODPOWIEDZI.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:** W2.2 (redakcja) + W3.6a (AUDYT-KONCOWY)
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-KOSZT-ODPOWIEDZI.md`
> **Trigger:** OBOWIĄZKOWY w W2.2 dla każdego głównego twierdzenia

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Cel pisma procesowego to nie tylko "mieć rację" — to zmuszenie przeciwnika
do pracy, przedstawiania własnych dowodów i ponoszenia kosztów procesowych.

**Pytanie kluczowe przy każdym akapicie:**
> "Jak napisać ten fragment tak, żeby przeciwnik musiał napisać dwie strony odpowiedzi?"

Jeśli przeciwnik może odpowiedzieć jednym zdaniem zaprzeczenia — akapit jest za słaby.
Jeśli musi przedstawić dokumenty, powołać świadków i wyjaśnić sprzeczności — akapit jest silny.

---

## KO-1 — TYPY KOSZTU PROCESOWEGO

```
KO-1A: KOSZT DOKUMENTACYJNY
  Przeciwnik musi złożyć dokumenty, których ujawnienie jest dla niego ryzykowne.
  Trigger: twierdzenie o faktach w dokumentach posiadanych przez pozwanego.
  Format: "[Twierdzenie]. Jeżeli pozwany temu zaprzecza, winien przedłożyć
           [lista dokumentów], które potwierdzą lub zaprzeczą [faktowi].
           Odmowa złożenia dokumentów podlega ocenie na niekorzyść pozwanego
           (art. 233 §2 k.p.c.)."

KO-1B: KOSZT ŚWIADKOWY
  Przeciwnik musi powoływać świadków i narażać ich na cross-examination.
  Trigger: twierdzenie oparte na zeznaniach już złożonych lub dostępnych.
  Format: "Okoliczność tę potwierdzają zeznania świadka [imię] (protokół z [data]).
           Zaprzeczenie przez pozwanego wymagać będzie powołania własnego świadka
           zdolnego obalić te zeznania."

KO-1C: KOSZT WYJAŚNIANIA SPRZECZNOŚCI
  Pozwany musi wyjaśniać sprzeczności między własnymi dokumentami/twierdzeniami.
  Trigger: wykrycie sprzeczności w materiale pozwanego (z MOD-DOKUMENT-ANOMALIE).
  Format: "Powód wskazuje, że twierdzenie pozwanego o [X] pozostaje w sprzeczności
           z własnym dokumentem pozwanego: [dokument, data], w którym [Y].
           Pozwany winien wyjaśnić tę sprzeczność."

KO-1D: KOSZT PRAWNY
  Pozwany musi przedstawiać złożoną argumentację prawną w odpowiedzi.
  Trigger: twierdzenie oparte na rzadko stosowanej normie lub wykładni pro-pracowniczej.
  Format: twierdzenie jasne + powołanie orzeczenia SN → pozwany musi odróżnić stan faktyczny.

KO-1E: KOSZT CZASOWY / PREKLUZYJNY
  Twierdzenie sformułowane precyzyjnie numerycznie wymusza precyzyjne zaprzeczenie
  — które przeciwnik może pominąć (prekluzja twierdzeń).
  Format: "[Twierdzenie z datami i kwotami]." — brak precyzyjnego zaprzeczenia w odpowiedzi
          → art. 230 k.p.c. (milczące przyznanie) lub art. 233 §2 k.p.c.
```

---

## KO-2 — SZABLON "JEŻELI POZWANY TEMU ZAPRZECZA"

Obowiązkowy element po każdym twierdzeniu o dokumentach w posiadaniu pozwanego:

```
[Twierdzenie faktyczne.]

Jeżeli pozwany kwestionuje powyższe, zobowiązany jest przedłożyć:
1. [Dokument 1] — wykazujący [konkretny fakt];
2. [Dokument 2] — wykazujący [konkretny fakt];
3. [Dokument 3] — [cel].

Odmowa złożenia lub brak powyższych dokumentów podlega ocenie przez Sąd
na niekorzyść pozwanego, zgodnie z art. 233 §2 k.p.c.
```

**Przykład dla sprawy pracowniczej z PFRON:**
```
Pozwany pobierał dofinansowanie z PFRON na osobę powoda.

Jeżeli pozwany kwestionuje fakt lub wysokość pobieranych dofinansowań,
zobowiązany jest przedłożyć:
1. Wnioski WN-D złożone do PFRON za cały okres zatrudnienia powoda;
2. Informacje INF-D-P wskazujące kwoty dofinansowania na powoda;
3. Potwierdzenia wypłat z PFRON i listy płac pracowników niepełnosprawnych.

Odmowa złożenia lub brak powyższych dokumentów podlega ocenie przez Sąd
na niekorzyść pozwanego, zgodnie z art. 233 §2 k.p.c.
Powód wnosi o zobowiązanie pozwanego do przedłożenia ww. dokumentów
na podstawie art. 248 §1 k.p.c.
```

---

## KO-3 — AUDIT KOSZTU ODPOWIEDZI (po napisaniu pisma)

Wykonaj przed AUDYT-KOŃCOWY — dla każdego głównego twierdzenia:

```
PER KAŻDA TEZA KLASY A/B:

Pytanie: "Co musi zrobić pełnomocnik pozwanego odpowiadając na ten fragment?"

  Odpowiada jednym zdaniem ("zaprzeczam") → 🔴 SŁABY — przepisz wg KO-2
  Musi napisać akapit argumentacji     → 🟡 PRZECIĘTNY — dodaj KO-1D
  Musi przedstawić dokumenty           → 🟢 DOBRY
  Musi wyjaśnić sprzeczności           → 🟢 DOBRY
  Musi powołać świadków                → 🟢 DOBRY
  Wszystkie powyższe naraz             → ✅ DOSKONAŁY

WYNIK AUDYTU KO:
  Policz tezy klasy A/B:
  — ile ma odpowiedź jednym zdaniem?   → docelowo: 0
  — ile wymaga dokumentów/akapitu?     → docelowo: ≥80% tez A/B

  Jeśli >20% tez A/B = odpowiedź jednym zdaniem → przepisz te bloki.
```

---

## KO-4 — NUMEROWANIE TEZ JAKO NARZĘDZIE KOSZTU

Numerowane tezy z precyzyjnymi datami i kwotami wymuszają numerowane odprzeczenia:

```
ZAMIAST:
"Pozwany nie wypłacał wynagrodzenia od pewnego czasu."

PISZ:
"Pozwany nie wypłacił wynagrodzenia za następujące okresy:
(1) listopad 2024 r. — kwota [X] zł, płatna do dnia [data];
(2) grudzień 2024 r. — kwota [X] zł, płatna do dnia [data];
[...]
Łącznie: [kwota] zł + odsetki ustawowe."

EFEKT: Pozwany musi odnieść się do każdego punktu z osobna — lub milczące
przyznanie co do niezaprzeczonych (art. 230 k.p.c.).
```

---

## KO-5 — INTEGRACJA Z PIPELINE

```
W2.2 (redakcja): Per każdy akapit twierdzenia — sprawdź KO-3 inline.
                 Dla twierdzeń o dokumentach pozwanego → dodaj KO-2.
                 Dla twierdzeń numerycznych → format KO-4.

W2.4 (ATAK-NA-DRAFT): D2 sprawdza "czy możliwa odpowiedź jednym zdaniem".
                       Jeśli TAK → oznacz jako 🟠 ISTOTNY + zastosuj KO-1A/B/C.

W3.6a (AUDYT-KOŃCOWY): Kryterium 7 — EKONOMIA PROCESU (patrz AUDYT-KONCOWY.md).
                        Uruchom KO-3 audit kosztu odpowiedzi jako finalny test.

⛔ ZAKAZ: Nie przekazuj pisma finalnego bez wykonania KO-3 audit.
⛔ ZAKAZ: Twierdzenie o dokumentach w posiadaniu pozwanego bez formatu KO-2
          = zmarnowana dźwignia procesowa.
```

---

## KO-6 — TRIGGER PER TWIERDZENIE (inline W2.2)

> Poprzednie wersje KO-2/KO-3 działały POST-FACTUM (po napisaniu pisma).
> KO-6 działa INLINE — model pyta się przy każdym twierdzeniu w trakcie redakcji.

```
Per każde twierdzenie w W2.2 — ZANIM przejdziesz do następnego akapitu:

KO-6-PYTANIE:
  "Jak zmusić pozwanego do przedstawienia dokumentów lub napisania akapitu
   odpowiedzi w związku z tym konkretnym twierdzeniem?"

KO-6-DECYZJA:
  (a) Twierdzenie o dokumentach w posiadaniu pozwanego
      → OBOWIĄZKOWO zastosuj KO-2 (szablon "Jeżeli pozwany zaprzecza...")
      → Dodaj konkretną listę dokumentów jakie pozwany musi złożyć

  (b) Twierdzenie numeryczne (kwota, data, okres)
      → Zastosuj KO-4 (numerowanie punktów wymuszające odpowiedź per punkt)
      → Precyzja liczb wymusza precyzję zaprzeczenia lub milczące przyznanie (art. 230 k.p.c.)

  (c) Twierdzenie o faktach wewnętrznych spółki (praktyki, zwyczaje)
      → Zastosuj KO-1B (koszt świadkowy) lub KO-1C (sprzeczności własne)
      → "Okoliczność tę potwierdzają zeznania świadka [X] — zaprzeczenie
         wymagać będzie powołania własnego świadka zdolnego obalić zeznania."

  (d) Twierdzenie o przepisie bezwzględnie obowiązującym (arg. klasy A)
      → Nie potrzebujesz KO-2 — ciężar jest już po stronie pozwanego
      → Wystarczy wskazać: "Pozwany nie może skutecznie zaprzeczyć X
         bez wykazania Y — czego nie może uczynić, gdyż Z."

KO-6-TEST:
  Napisz twierdzenie → zapytaj: "Co pozwany zrobi z tym zdaniem?"
  → "Zaprzeczam" jednym słowem? → 🔴 za słabe → zastosuj KO-2/KO-4/KO-1B
  → Musi wyjaśnić? → 🟡 → opcjonalnie KO-1C
  → Musi złożyć dokumenty? → 🟢 → OK
  → Musi złożyć dokumenty I wyjaśnić sprzeczności? → ✅ → doskonałe
```

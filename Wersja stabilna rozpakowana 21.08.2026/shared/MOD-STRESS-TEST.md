# MOD-STRESS-TEST — Symulacja Odpowiedzi Pełnomocnika Pozwanego

> **Plik:** `/mnt/skills/user/shared/MOD-STRESS-TEST.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:** Po W2 (projekcie pisma), przed W3 / AUDYT-KOŃCOWY
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-STRESS-TEST.md`
> **Trigger:** OBOWIĄZKOWY po wygenerowaniu projektu pisma (draft W2),
>   przed finalnym .docx

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Pismo nie istnieje w próżni — istnieje w relacji z odpowiedzią przeciwnika.
Dobry pełnomocnik pozwanego przeczyta każdy akapit i szuka miejsca, gdzie
może odpowiedzieć jednym zdaniem. Każde takie miejsce to słaby punkt.

**Zasada:** Jeżeli pełnomocnik pozwanego może odpowiedzieć na jakikolwiek
główny argument JEDNYM ZDANIEM — argument wymaga wzmocnienia.
Jeżeli musi napisać AKAPIT lub przedstawić DOKUMENTY — argument jest silny.

---

## ST-1 — PROCEDURA STRESS-TESTU

```
WYKONAJ PO NAPISANIU PROJEKTU PISMA (DRAFT W2), PRZED FINALIZACJĄ:

Krok 1: Wciel się w rolę doświadczonego pełnomocnika pozwanego
        (adwokata lub radcy prawnego z co najmniej 5 lat praktyki
        w sprawach pracowniczych).

Krok 2: Przeczytaj każdy główny argument (tezę klasy A/B) pisma.

Krok 3: Dla każdego argumentu odpowiedz jako pełnomocnik pozwanego:
        Co bym napisał w odpowiedzi na pozew / piśmie przygotowawczym?

Krok 4: Zmierz długość odpowiedzi:

        1 zdanie  → 🔴 SŁABY — WRÓĆ I WZMOCNIJ
        1 akapit  → 🟡 PRZECIĘTNY — rozważ wzmocnienie
        2+ akapity → 🟢 DOBRY
        + dokumenty → ✅ DOSKONAŁY
        + sprzeczności własne → ✅ WYBITNY

Krok 5: Dla każdego argumentu 🔴 → zastosuj ST-FIX (poniżej).
        Dla każdego argumentu 🟡 → rozważ zastosowanie KO-2.
        Dla każdego argumentu 🟢/✅ → zostaw bez zmian.
```

---

## ST-2 — FORMAT RAPORTU STRESS-TESTU

Wyświetl użytkownikowi raport przed finalizacją pisma:

```
═══════════════════════════════════════════════════════════
RAPORT STRESS-TEST — [sygnatura sprawy] — [data]
Rola: Pełnomocnik pozwanego (adwokat/radca — min. 5 lat praktyki prac.)
═══════════════════════════════════════════════════════════

TEZA 1: [skrót treści]
─────────────────────────────────────────────
ODPOWIEDŹ PEŁNOMOCNIKA POZWANEGO:
"[Autentyczna odpowiedź jak napisałby pełnomocnik]"

OCENA: 🔴/🟡/🟢/✅
DIAGNOZA: [dlaczego taka ocena]
ZALECENIE: [co zmienić / co zostawić]
─────────────────────────────────────────────

TEZA 2: [skrót treści]
─────────────────────────────────────────────
ODPOWIEDŹ PEŁNOMOCNIKA POZWANEGO:
"[...]"

OCENA: 🔴/🟡/🟢/✅
DIAGNOZA: [...]
ZALECENIE: [...]
─────────────────────────────────────────────

[dla każdej tezy klasy A/B]

WYNIK ŁĄCZNY:
  Tezy 🔴 (wymagają pracy): [N] — [lista]
  Tezy 🟡 (można wzmocnić): [N] — [lista]
  Tezy 🟢/✅ (wystarczające): [N] — [lista]

STATUS: PASS (brak 🔴) / FAIL (≥1 🔴 → wróć do W2.2)
═══════════════════════════════════════════════════════════
```

---

## ST-3 — ST-FIX: Co zrobić z argumentem 🔴

```
Argument 🔴 = pełnomocnik może odpowiedzieć jednym zdaniem.
Zwykle dzieje się tak, gdy:

PRZYCZYNA A: Teza bez dowodu dokumentarnego
  FIX: Dodaj dowód kl. A lub B + lokalizator (SD-LOC).
       Jeśli brak dowodu → złóż wniosek art. 248 §1 k.p.c.
       + zastosuj KO-2 (szablon "Jeżeli pozwany zaprzecza...").

PRZYCZYNA B: Skutek procesowy zbyt ogólny
  FIX: Zastosuj MOD-SKUTEK-PROCESOWY SP-1 — konkretne "co Sąd winien".
       Zamień "roszczenie jest zasadne" na "Sąd winien zasądzić [X]".

PRZYCZYNA C: Brak antycypacji zarzutu
  FIX: Dodaj element [5] z MOD-BUDOWA-ARGUMENTU.
       Zidentyfikuj najsilniejszy zarzut pełnomocnika i wbuduj obalenie.

PRZYCZYNA D: Teza jednowarstwowa (jeden przepis, jeden argument)
  FIX: Dodaj drugą niezależną podstawę prawną (zamknięcie furtki [6]).
       Zasada: każde roszczenie = min. 2 niezależne podstawy.

PRZYCZYNA E: Brak przerzucenia ciężaru dowodu
  FIX: Dodaj mikropodsumowanie (MOD-MIKROPODSUMOWANIA MK-1) z informacją
       co teraz musi wykazać pozwany i jakie dokumenty złożyć.
```

---

## ST-4 — PRZYKŁAD STRESS-TESTU (sprawa pracownicza)

```
TEZA 1: Stosunek pracy na czas nieokreślony (art. 25¹ §3 k.p.)

ODPOWIEDŹ PEŁNOMOCNIKA POZWANEGO:
"Powód był zatrudniony na umowę z podmiotem KRS 0000796445 (Human Park
sp. z o.o.), a nie pozwanym (KRS 0001025052). Pozwany jest odrębną osobą
prawną — nie może być stroną sporu o stosunek pracy wynikający z umów
zawartych z innym podmiotem. Ponadto art. 25¹ §3 k.p. wymaga tożsamości
stron — czego powód nie wykazał. Ewentualnie: nawet gdyby nastąpiło
przejście zakładu pracy (czemu zaprzeczamy), powód zawarł porozumienie
rozwiązujące z dnia 9.10.2024 r., co skutecznie zakończyło stosunek pracy
niezależnie od jego charakteru. Powód powinien dołączyć swoje orzeczenie
o niepełnosprawności, by wykazać stopień, oraz wskazać daty konkretnych
umów, a nie powoływać się ogólnikowo na 'cztery umowy'."

OCENA: 🟡 PRZECIĘTNY
DIAGNOZA: Pełnomocnik napisał 4 zdania — dobra oznaka. Ale może zaatakować
  rozbieżność KRS (co już jest zaadresowane w piśmie) i porozumienie
  9.10.2024 (co pismo pomija — tu jest realna słabość).
ZALECENIE: Dodać akapit o porozumieniu 9.10.2024 i jego nieważności
  (art. 87 k.c. / mobbing) jako argument ewentualny w Tezie 1.

─────────────────────────────────────────────
TEZA 3: Wynagrodzenie uzupełniające PFRON 1 000 zł/mc

ODPOWIEDŹ PEŁNOMOCNIKA POZWANEGO:
"Zaprzeczamy." [+ opcjonalnie: "Brak regulaminu premiowania."]

OCENA: 🔴 SŁABY
DIAGNOZA: Pełnomocnik może odpowiedzieć jednym słowem. Mimo listy PFRON
  i zeznań Nawrota — teza nadal do odpierania bez dokumentów po stronie
  pozwanego. Problem: brak bezpośredniego dowodu kwoty per powód.
ZALECENIE: Wzmocnić przez KO-2 → "Jeżeli pozwany zaprzecza, winien
  złożyć WnD per pracownik" + zaznaczyć wprost że 123 445 zł to suma
  zbiorcza i pozwany MUSI wykazać jak ją podzielił między pracowników.
```

---

## ST-5 — INTEGRACJA Z PIPELINE

```
POZYCJA: Po W2.4 (ATAK-NA-DRAFT), przed W3 / AUDYT-KOŃCOWY.

FLOW:
  W2 (projekt pisma)
    ↓
  W2.4 MOD-ATAK-NA-DRAFT (analiza per akapit)
    ↓
  ST-1 MOD-STRESS-TEST (symulacja całościowa)
    → STATUS PASS  → W3 / AUDYT-KOŃCOWY → .docx
    → STATUS FAIL  → wróć do W2.2 + zastosuj ST-FIX
    → po naprawie  → ponów ST-1 dla argumentów 🔴
    ↓
  W3 / AUDYT-KOŃCOWY
    → Kryterium ST: czy stress-test wykonano i czy wynik = PASS?

⛔ ZAKAZ: Generowanie .docx bez wykonanego ST-1 z wynikiem PASS.
⛔ ZASADA: Nie możesz "zaliczać" stress-testu bez faktycznego
  odegrania roli pełnomocnika pozwanego. Nie wystarczy powiedzieć
  "stress-test wykonany" — musisz pokazać odpowiedź pełnomocnika.
⛔ ZASADA ITERACJI: Jeżeli po naprawie argumentu 🔴 i ponownym
  stress-teście argument nadal jest 🔴 — powtórz ST-FIX.
  Maksimum 2 iteracje. Jeśli po 2 iteracjach nadal 🔴 — oznacz
  argument jako D (awaryjny) i przesuń do żądań ewentualnych.
```

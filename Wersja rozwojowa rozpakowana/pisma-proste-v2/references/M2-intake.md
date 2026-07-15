# M2 — Intake i Identyfikacja Pisma

*Wczytaj ZAWSZE na początku — ustal typ pisma i zebrane dane.*

---

## FAZA 0 — IDENTYFIKACJA TYPU PISMA

Na podstawie opisu użytkownika ustal typ pisma według tabeli:

| Słowa kluczowe | Typ pisma | Schemat | Termin zawity |
|---|---|---|---|
| „nakaz zapłaty", „sprzeciw", „EPU", „e-sąd" | Sprzeciw od nakazu | SPA | **14 dni** |
| „nakaz zapłaty", „zarzuty", „postępowanie nakazowe" | Zarzuty od nakazu | SPB | **7 dni** |
| „klauzula wykonalności", „tytuł wykonawczy" | Wniosek o klauzulę | SPC | brak |
| „komornik", „egzekucja", „wszczęcie egzekucji" | Wniosek o egzekucję | SPD | brak |
| „wezwanie do zapłaty", „wezwanie przedsądowe", „dług" | Wezwanie przedsądowe | SPE | brak |
| „uzasadnienie wyroku", „wniosek o uzasadnienie" | Wniosek o uzasadnienie | SPF | **7 dni** |
| „zabezpieczenie", „zarządzenie tymczasowe" | Wniosek o zabezpieczenie | SPG | brak |
| „zwolnienie od kosztów", „kosztów sądowych", „ZFSZ" | Wniosek zw. od kosztów | SPH | brak |
| „przywrócenie terminu", „termin upłynął" | Wniosek o przywrócenie | SPH | 7 dni od ustania przeszkody |
| „wgląd do akt", „dostęp do akt" | Wniosek o wgląd | SPH | brak |
| „doręczenie przez komornika", „art. 139¹" | Wniosek o doręczenie | SPH | brak |
| „sprzeciw od referendarza", „orzeczenie referendarza" | Sprzeciw od ref. | SPH | **7 dni** |

Jeśli typ pisma nie wynika jednoznacznie z opisu → zapytaj jednym pytaniem.

---

## FAZA 1 — ZBIERANIE DANYCH (jedno pytanie zbiorcze)

Jeśli brakuje danych — zapytaj o **wszystkie brakujące jednocześnie**,
nigdy osobno o każdy element.

### DANE OBOWIĄZKOWE (dla każdego pisma)

```
□ TYP PISMA     — jeśli nieustalony z opisu
□ WNIOSKODAWCA  — imię i nazwisko (lub nazwa firmy), adres, PESEL lub NIP
□ POZWANY/DŁUŻNIK — imię i nazwisko (lub nazwa firmy), adres
□ SĄD / ORGAN   — pełna nazwa, miejscowość, wydział (jeśli znany)
□ SYGNATURA     — jeśli dotyczy istniejącego postępowania (np. „I C 123/24")
□ PODSTAWA      — co chcemy uzyskać / co się stało (krótki opis)
```

### DANE SPECYFICZNE WG TYPU

**SPA / SPB — Sprzeciw / Zarzuty:**
```
□ DATA DORĘCZENIA nakazu zapłaty
□ KWOTA z nakazu (należność główna + odsetki + koszty)
□ SYGNATURA nakazu
□ CZY dołączono uzasadnienie do nakazu
□ POWÓD twierdzony (kto i o co pozwał)
```

**SPC — Klauzula wykonalności:**
```
□ TYP TYTUŁU (wyrok sądowy / nakaz zapłaty / akt notarialny / ugoda)
□ SYGNATURA lub repertorium
□ DATA uprawomocnienia (dla orzeczeń)
□ DŁUŻNIK — dane pełne
```

**SPD — Egzekucja:**
```
□ TYTUŁ WYKONAWCZY z klauzulą — opis (sygnatura, data)
□ KWOTA do wyegzekwowania (należność + odsetki + koszty)
□ SPOSÓB EGZEKUCJI (z rachunku bankowego / wynagrodzenia / ruchomości / nieruchomości)
□ DANE KOMORNIKA (jeśli znane) lub wskazanie komornika
```

**SPE — Wezwanie przedsądowe:**
```
□ PODSTAWA ZOBOWIĄZANIA (umowa / delikt / bezpodstawne wzbogacenie)
□ KWOTA (należność główna + odsetki liczone od kiedy)
□ TERMIN ZAPŁATY (ile dni na reakcję — standardowo 7 lub 14)
□ NUMER RACHUNKU do zapłaty
```

**SPF — Uzasadnienie wyroku:**
```
□ DATA OGŁOSZENIA wyroku (wyznacza bieg terminu 7-dniowego)
□ SYGNATURA SPRAWY
□ CZY zamierzasz składać apelację
```

**SPG — Zabezpieczenie:**
```
□ ROSZCZENIE do zabezpieczenia (kwota / zakaz / zobowiązanie)
□ SPOSÓB ZABEZPIECZENIA (zajęcie rachunku / zakaz zbycia / hipoteka przymusowa)
□ UZASADNIENIE INTERESU PRAWNEGO (obawa przed niewykonalnością)
□ CZY złożono już pozew (zabezpieczenie przed / w trakcie / po)
```

**SPH — Zwolnienie od kosztów:**
```
□ DOCHÓD MIESIĘCZNY (netto, na osobę w gospodarstwie)
□ SKŁAD RODZINY / LICZBA OSÓB na utrzymaniu
□ MAJĄTEK (nieruchomości, oszczędności, pojazdy)
□ POWÓD ubiegania się o zwolnienie
```

---

## FAZA 2 — POLA BRAKUJĄCE

Dla danych, których nie dostarczono i których nie pytano w fazie zbiorczej
— wstaw do treści pisma: `⬛ [UZUPEŁNIJ: opis pola]`

Przykłady:
- `⬛ [UZUPEŁNIJ: data doręczenia nakazu]`
- `⬛ [UZUPEŁNIJ: sygnatura sprawy]`
- `⬛ [UZUPEŁNIJ: imię i nazwisko pozwanego]`

---

## FAZA 3 — WERYFIKACJA ESKALACJI

Przed przystąpieniem do redagowania sprawdź:

```
□ Czy żądań jest więcej niż jedno? → eskalacja do pisma-procesowe-v3
□ Czy podstaw prawnych jest więcej niż jedna wymagająca analizy? → eskalacja
□ Czy strona złożyła już odpowiedź z argumentacją? → eskalacja
□ Czy pismo to apelacja, skarga kasacyjna lub odpowiedź na pozew? → eskalacja
```

Jeśli żadna z powyższych → kontynuuj w pisma-proste-v2.

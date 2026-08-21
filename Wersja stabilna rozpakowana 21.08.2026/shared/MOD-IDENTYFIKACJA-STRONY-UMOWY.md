# MOD-IDENTYFIKACJA-STRONY-UMOWY — Ustalenie strony czynności prawnej metodą danych większościowych

> **Plik:** `/mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md`
> **Wersja:** 1.1.0 (2026-06-27)
> **Status:** PRODUKCJA
> **Typ:** moduł shared — wywoływany przez wiele skilli
> **Pozycja w pipeline:**
>   - `pisma-procesowe-v3`: W1.2d-EXTEND, po MOD-DOKUMENT-ANOMALIE DA-3, przed W1.3
>   - `analizator-umow-v1`: po fazie identyfikacji stron, przed analizą klauzul
>   - `analizator-dowodow-v3`: po BLOK-B, gdy dokumenty strony przeciwnej zawierają
>     rozbieżne dane identyfikacyjne
>   - `PRE-W2-VERIFICATION-GATE`: po PRE-W2.D gdy wykryto rozbieżność podmiotową

---

## DLACZEGO TEN MODUŁ ISTNIEJE

### Problem

Dokumenty handlowe, pracownicze, faktury VAT i pisma procesowe zawierają błędy
identyfikacyjne: błędny NIP, błędny KRS, błędna nazwa, pomylony adres. Strona
dokumentu broniąca się tą rozbieżnością może twierdzić:

- "Stosunek prawny dotyczył podmiotu X, nie Y — bo KRS w umowie wskazuje X"
- "Faktura jest nieważna — NIP jest błędny"
- "Umowę zawarł inny podmiot z grupy — bo na nagłówku inna nazwa"

Dotychczas nie było mechanizmu który **empirycznie** rozstrzyga tożsamość strony
przez policzenie elementów identyfikacyjnych i wskazanie podmiotu większościowego.

### Zasada

Tożsamość strony dokumentu wynika z **całości** jego treści, nie z jednego błędnego
identyfikatora. Wykładnia oświadczeń woli (art. 65 §1 KC) nakazuje uwzględniać
okoliczności złożenia oświadczenia — w tym wszystkie elementy identyfikacyjne.
Podmiot wskazany przez większość elementów = strona dokumentu.
Element wyłącznie niezgodny z pozostałymi = błąd redakcyjny obciążający autora.

### Zasięg zastosowania

```
TYPY DOKUMENTÓW objęte tym modułem:
  □ Umowy o pracę (rozbieżność KRS/NIP pracodawcy)
  □ Umowy B2B (zlecenie, o dzieło, sprzedaż, dystrybucja, IT/SaaS)
  □ Faktury VAT (błędny NIP nabywcy lub wystawcy)
  □ Umowy najmu i dzierżawy
  □ Umowy pożyczki i kredytu
  □ Pisma procesowe i wezwania do zapłaty (błędna identyfikacja adresata)
  □ Polisy ubezpieczeniowe (błędny ubezpieczony/ubezpieczyciel)
  □ Zamówienia i oferty handlowe
  □ Protokoły odbioru i przekazania
  □ Każdy inny dokument prawny z ≥2 elementami identyfikacyjnymi stron

TYPY POSTĘPOWAŃ:
  □ Sprawy pracownicze (pracodawca wielopodmiotowy)
  □ Sprawy cywilne (kontraktor, najemca, dłużnik)
  □ Sprawy podatkowe i VAT (odliczenie przy błędnym NIP na fakturze)
  □ Sprawy gospodarcze (odpowiedzialność z grupy kapitałowej)
  □ Sprawy o zapłatę (kto wystawił/odebrał fakturę)
  □ Postępowania egzekucyjne (właściwy dłużnik)
```

---

## WARUNEK AKTYWACJI

```
AKTYWUJ gdy w dokumentach widoczna jest CHOĆBY JEDNA z poniższych sytuacji:

  T1: Rozbieżność elementów identyfikacyjnych w jednym dokumencie
      (np. KRS wskazuje podmiot A, NIP wskazuje podmiot B)
  T2: Rozbieżność elementów identyfikacyjnych między dokumentami tej samej serii
      (np. umowa 1 = podmiot A, umowa 3 = podmiot B, przy ciągłości faktycznej)
  T3: Strona kwestionuje tożsamość kontrahenta powołując się na jeden błędny identyfikator
  T4: Faktura z błędnym NIP wystawcy lub nabywcy przy prawidłowej nazwie i adresie
  T5: Pismo procesowe kierowane do błędnego podmiotu przy prawidłowej identyfikacji
      faktycznego dłużnika/wierzyciela
  T6: Podmiot z grupy kapitałowej twierdzi że "to nie my" — wskazując inną spółkę
      na podstawie jednego identyfikatora

NIE AKTYWUJ gdy:
  □ Wszystkie elementy identyfikacyjne są spójne (brak rozbieżności)
  □ Rozbieżność dotyczy wyłącznie elementów formalnych bez wpływu na tożsamość
    (np. inne pismo ulicy — "ul. Jana" vs "Jana" — ten sam adres)
```

---

## KATALOG ELEMENTÓW IDENTYFIKACYJNYCH

### EL-PODMIOT — Elementy identyfikacyjne podmiotu (spółki, firmy)

```
┌─────┬──────────────────────────────────┬────────┬──────────────────────────────┐
│ Kod │ Element                          │ Waga   │ Uwagi                        │
├─────┼──────────────────────────────────┼────────┼──────────────────────────────┤
│ E01 │ NIP (Numer Identyf. Podatkowej)  │ ★★★★   │ Najsilniejszy — unikalny     │
│     │                                  │        │ identyfikator podatkowy;      │
│     │                                  │        │ wystawia go US; trudno pomylić│
│ E02 │ Pełna nazwa rejestrowa (firma)   │ ★★★★   │ Z KRS — nie skrót handlowy   │
│ E03 │ KRS (Numer Rej. Sądowy)          │ ★★★    │ Silny, ale podatny na błąd   │
│     │                                  │        │ kopiowania z wzorca           │
│ E04 │ REGON                            │ ★★★    │ 9 cyfr dla sp.; błąd formatu │
│     │                                  │        │ (14 cyfr) = anomalia Klasy I  │
│ E05 │ Adres siedziby rejestrowej       │ ★★★    │ Z KRS; zmiana bez aktualizacji│
│     │                                  │        │ = wskazówka na "stary wzorzec"│
│ E06 │ Imię i nazwisko podpisującego    │ ★★     │ Kto podpisał — czy Prezes     │
│     │                                  │        │ podmiotu_A czy podmiotu_B?    │
│ E07 │ Rola podpisującego               │ ★★     │ "Prezes Zarządu [firma]" —   │
│     │                                  │        │ której firmy?                 │
│ E08 │ Pieczęć (nagłówek, stopka)       │ ★★     │ Czytelna nazwa/NIP na pieczęci│
│ E09 │ Adres korespondencyjny           │ ★      │ Może różnić się od rejestrowego│
│ E10 │ Nr rachunku bankowego            │ ★★     │ Konto zarejestrowane na który │
│     │                                  │        │ NIP? (sprawdź IBAN → NIP)     │
└─────┴──────────────────────────────────┴────────┴──────────────────────────────┘

Łącznie: 10 elementów (E01–E10) | Wagi: ★★★★=4, ★★★=3, ★★=2, ★=1 | Max: 28 pkt
Próg większościowy: podmiot z ≥ 60% sumy ważonej dostępnych elementów = PODMIOT WSKAZANY
```

### EL-OSOBA — Elementy identyfikacyjne osoby fizycznej

```
┌─────┬──────────────────────────────────┬────────┬──────────────────────────────┐
│ Kod │ Element                          │ Waga   │ Uwagi                        │
├─────┼──────────────────────────────────┼────────┼──────────────────────────────┤
│ F01 │ PESEL                            │ ★★★★   │ Unikalny; zawiera datę ur.   │
│     │                                  │        │ i płeć — weryfikuj ISU-PESEL │
│ F02 │ Imię i nazwisko                  │ ★★★★   │ Weryfikuj pisownię            │
│ F03 │ Data urodzenia                   │ ★★★    │ Wynika z PESEL cyfr 1-6      │
│ F04 │ Adres zameldowania/zamieszkania  │ ★★★    │ Różne wersje = błąd lub zmiana│
│ F05 │ Nr dowodu osobistego / paszportu │ ★★★    │ Seria + numer — unikalny      │
│ F06 │ NIP (osoby fiz. prowadzącej dz.) │ ★★★    │ Jeśli prowadzi dz. gosp.      │
│ F07 │ Podpis                           │ ★★     │ Czy odręczny spójny?          │
└─────┴──────────────────────────────────┴────────┴──────────────────────────────┘
```

### ISU-PESEL — Algorytm weryfikacji numeru PESEL

```
⛔ AKTYWUJ ZAWSZE gdy w dokumencie widnieje numer PESEL i znana jest CHOĆBY JEDNA z:
  (a) data urodzenia osoby fizycznej
  (b) płeć osoby fizycznej
  (c) imię osoby (imię męskie / żeńskie → wnioskuj płeć)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P1 — FORMAT PODSTAWOWY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sprawdź: PESEL ma dokładnie 11 cyfr arabskich (0-9), bez liter, spacji, kresek.
  NIE = BŁĄD FORMATU → ANOMALIA KLASA I (błąd dokumentacyjny)
  TAK → przejdź do P2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P2 — DEKODOWANIE DATY URODZENIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PESEL: cyfry oznacz jako P1P2 P3P4 P5P6 P7P8P9 P10 P11
  (gdzie P1P2 = dwie pierwsze, P3P4 = dwie środkowe miesiąca, itd.)

  ROK urodzenia:
    Odczytaj miesiąc-surowy M = P3*10 + P4 (wartość 1–92)
    Stulecie i rok wg zakresu M:
    ┌──────────────────────────────────────────────────────────────────┐
    │  M:  1–12  → 1900+P1P2  (ur. 1900–1999)                        │
    │  M: 21–32  → 2000+P1P2  (ur. 2000–2099, M_realny = M-20)       │
    │  M: 41–52  → 2100+P1P2  (ur. 2100–2199, M_realny = M-40)       │
    │  M: 61–72  → 2200+P1P2  (ur. 2200–2299, M_realny = M-60)       │
    │  M: 81–92  → 1800+P1P2  (ur. 1800–1899, M_realny = M-80)       │
    │  Inne wartości M → BŁĄD DATY                                    │
    └──────────────────────────────────────────────────────────────────┘

  MIESIĄC realny = M_realny (po odjęciu przesunięcia stulecia)
  DZIEŃ = P5*10 + P6  (1–31; sprawdź czy dzień istnieje w danym miesiącu)
  DATA_PESEL = ROK-MIESIĄC-DZIEŃ

  Przykład PESEL 84030315255:
    P1P2=84, P3P4=03, P5P6=15 → M=03 ∈ [1-12] → ROK=1984, MIE=03, DZIEŃ=15
    DATA_PESEL = 1984-03-15

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P3 — WERYFIKACJA DATY Z DOKUMENTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Gdy znana DATA_UR z dokumentu (umowy, protokołu, dowodu, akt):
    DATA_PESEL == DATA_UR? → ✅ DATA ZGODNA
    DATA_PESEL != DATA_UR? → ⛔ NIEZGODNOŚĆ DATY
      → Klasyfikuj: błąd o 1 cyfrę (transpozycja) → prawdopodobny błąd pisarski
      → Błąd o rok lub więcej → poważna rozbieżność, rozważ ANOMALIA KLASA III

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P4 — DEKODOWANIE PŁCI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cyfra P10 (dziesiąta cyfra PESEL):
    P10 NIEPARZYSTA (1,3,5,7,9) → MĘŻCZYZNA
    P10 PARZYSTA    (0,2,4,6,8) → KOBIETA

  Gdy znana płeć z imienia lub opisu:
    PŁEĆ_PESEL == PŁEĆ_ZNANA? → ✅ PŁEĆ ZGODNA
    PŁEĆ_PESEL != PŁEĆ_ZNANA? → ⛔ NIEZGODNOŚĆ PŁCI
      → Np. "Michał" z P10=0 → MĘŻCZYZNA w PESEL = KOBIETA → błąd P10

  Przykład PESEL 84030315255:
    P10=5 (nieparzysta) → MĘŻCZYZNA → zgodne z "Michał" ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P5 — SUMA KONTROLNA (cyfra 11)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Wagi: W = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
  Oblicz: S = suma (P_i * W_i) dla i=1..10  [modulo 10]
  Cyfra kontrolna K = (10 - (S mod 10)) mod 10
  Porównaj K z P11:
    K == P11 → ✅ SUMA KONTROLNA POPRAWNA
    K != P11 → ⛔ BŁĘDNA SUMA KONTROLNA

  Przykład PESEL 84030315255:
    Cyfry:  8  4  0  3  0  3  1  5  2  5  5
    Wagi:   1  3  7  9  1  3  7  9  1  3
    Iloczyn:8 12  0 27  0  9  7 45  2 15 = 125
    S mod 10 = 5 → K = (10-5) mod 10 = 5 → P11=5 → ✅ POPRAWNA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KROK P6 — RAPORT PESEL (wstaw do ISU-1 jako element F01)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Format raportu:
  PESEL [numer]:
    Format (11 cyfr):        ✅ / ⛔ BŁĄD FORMATU
    Data z PESEL:            [RRRR-MM-DD]
    Data z dokumentu:        [RRRR-MM-DD] ✅ ZGODNA / ⛔ NIEZGODNA
    Płeć z PESEL (P10=[x]): [M/K]
    Płeć z imienia/opisu:    [M/K] ✅ ZGODNA / ⛔ NIEZGODNA
    Suma kontrolna:          ✅ POPRAWNA / ⛔ BŁĘDNA (oczekiwana: [K], jest: [P11])
    WYNIK F01:               ✅ PESEL PRAWIDŁOWY / ⛔ BŁĄD PESEL [kody błędów]

  KODY BŁĘDÓW:
    ERR-F  = błąd formatu (nie 11 cyfr)
    ERR-D  = data z PESEL ≠ data z dokumentu
    ERR-PL = płeć z PESEL ≠ płeć z imienia/opisu
    ERR-CK = błędna cyfra kontrolna (PESEL zafałszowany lub błąd przepisania)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KLASYFIKACJA BŁĘDÓW PESEL → ANOMALIE MOD-DOKUMENT-ANOMALIE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ERR-D (niezgodność daty, transpozycja cyfr) → ANOMALIA KLASA I
    → "błąd pisarski przy przepisywaniu PESEL"
    → Nie podważa tożsamości osoby gdy pozostałe elementy F02-F07 zgodne

  ERR-PL (niezgodność płci) → ANOMALIA KLASA I lub III
    → Klasa I jeśli reszta dokumentu spójna (literówka w P10)
    → Klasa III jeśli tożsamość osoby w sporze (por. art. 253 KPC)

  ERR-CK (błąd sumy kontrolnej) → ANOMALIA KLASA III
    → PESEL statystycznie nie może być przypadkowo błędny na P11
    → Wniosek: przepisanie z błędem lub podanie nieprawidłowego PESEL
    → Rozważ wniosek o weryfikację tożsamości przez organ (art. 212 KPC)

  ERR-F (błąd formatu) → ANOMALIA KLASA I
    → Braki cyfr, spacje, litery = błąd maszynowy/edycyjny
```

### EL-FAKTURA — Elementy identyfikacyjne faktury VAT

```
┌─────┬──────────────────────────────────┬────────┬──────────────────────────────┐
│ Kod │ Element                          │ Waga   │ Uwagi                        │
├─────┼──────────────────────────────────┼────────┼──────────────────────────────┤
│ G01 │ NIP wystawcy                     │ ★★★★   │ Kluczowy dla odliczenia VAT  │
│ G02 │ Nazwa wystawcy                   │ ★★★★   │ Z rejestru, nie skrót        │
│ G03 │ Adres wystawcy                   │ ★★★    │                              │
│ G04 │ NIP nabywcy                      │ ★★★★   │ Kluczowy dla odliczenia VAT  │
│ G05 │ Nazwa nabywcy                    │ ★★★★   │                              │
│ G06 │ Adres nabywcy                    │ ★★★    │                              │
│ G07 │ Nr konta do przelewu             │ ★★★    │ IBAN → właściciel konta = NIP│
│ G08 │ Podpis / stempel autoryzacyjny   │ ★★     │                              │
└─────┴──────────────────────────────────┴────────┴──────────────────────────────┘

REGUŁA FAKTUROWA:
  Błąd jednego elementu (np. NIP nabywcy przy prawidłowej nazwie i adresie)
  nie unieważnia faktury ani prawa do odliczenia VAT gdy pozostałe elementy
  jednoznacznie identyfikują nabywcę (por. orzecznictwo TSUE i NSA — WERYFIKUJ).
  Zasada: błąd formalny ≠ nieuczciwa transakcja, jeżeli podmiot jest
  identyfikowalny z całości dokumentu.
```

---

## PROCEDURA ISU (Identyfikacja Strony Umowy)

### ISU-1 — INWENTARYZACJA

```
Dla każdego badanego dokumentu utwórz kartę:

  Dokument: [nazwa/data/numer]
  Typ: [umowa / faktura / pismo / polisa / zamówienie]
  Strona badana: [wystawca / nabywca / pracodawca / zleceniodawca / wierzyciel / etc.]

  ELEMENTY IDENTYFIKACYJNE:
  ┌─────┬─────────────────────┬──────────────────────────┬───────────────┐
  │ Kod │ Element             │ Wartość z dokumentu      │ Podmiot       │
  ├─────┼─────────────────────┼──────────────────────────┼───────────────┤
  │ E01 │ NIP                 │ [wartość]                │ A / B / BRAK  │
  │ E02 │ Nazwa               │ [wartość]                │ A / B / BRAK  │
  │ E03 │ KRS                 │ [wartość]                │ A / B / BRAK  │
  │ E04 │ REGON               │ [wartość]                │ A / B / BRAK  │
  │ E05 │ Adres               │ [wartość]                │ A / B / BRAK  │
  │ E06 │ Podpisujący (imię)  │ [wartość]                │ A / B / BRAK  │
  │ E07 │ Podpisujący (rola)  │ [wartość]                │ A / B / BRAK  │
  │ E08 │ Pieczęć             │ [wartość]                │ A / B / BRAK  │
  └─────┴─────────────────────┴──────────────────────────┴───────────────┘
```

### ISU-2 — ZLICZENIE WAŻONE

```
Suma wag elementów wskazujących na podmiot_A: [X pkt]
Suma wag elementów wskazujących na podmiot_B: [Y pkt]
Elementy nieokreślone / BRAK: [lista]

WYNIK:
  Podmiot_A: [X pkt] = [X/(X+Y)*100]%
  Podmiot_B: [Y pkt] = [Y/(X+Y)*100]%

  Podmiot WSKAZANY (≥60% sumy ważonej): [A lub B]
  Element(y) niezgodny: [lista — to potencjalny błąd pisarski]

PRÓG 60%:
  ≥60% → PODMIOT WSKAZANY jednoznacznie → zastosuj ISU-3
  40%–59% → WYNIK NIEJEDNOZNACZNY → zastosuj ISU-4 (rozstrzyganie uzupełniające)
  <40% po stronie obu → dane zbyt skąpe → ISU-4 obowiązkowe
```

### ISU-3 — KWALIFIKACJA ELEMENTU NIEZGODNEGO

```
Element niezgodny = ten który wskazuje na podmiot mniejszościowy.

REGUŁA-BLAD-PISARSKI:
  Jeśli element niezgodny to identyfikator techniczny (KRS, REGON, nr polisy,
  nr umowy z innej serii) przy prawidłowych danych merytorycznych (NIP, nazwa,
  adres, podpisujący) → ELEMENT NIEZGODNY = BŁĄD PISARSKI AUTORA DOKUMENTU.

  Skutki prawne błędu pisarskiego:
  1. Obciąża wyłącznie autora dokumentu — nie może szkodzić drugiej stronie
     (art. 65 §1 KC w zw. z art. 300 KP; art. 354 KC — wykonanie zobowiązania)
  2. Nie zmienia tożsamości strony umowy (kontrahenta)
  3. Może stanowić dowód na niedbałość dokumentacyjną autora
  4. Może wzmacniać inne zarzuty (np. o fikcyjności odrębności podmiotów)

REGUŁA-ELEMENT-MERYTORYCZNY:
  Jeśli element niezgodny to NIP lub nazwa → sytuacja poważniejsza:
  nie można automatycznie kwalifikować jako błąd pisarski.
  → Zbadaj ISU-4 (rozstrzyganie uzupełniające) przed konkluzją.

REGUŁA-FAKTUROWA-NIP:
  Przy fakturze z błędnym NIP przy prawidłowej nazwie i adresie:
  → BŁĄD PISARSKI; PODMIOT WSKAZANY = ten z prawidłowej nazwy/adresu
  → Efekt VAT: faktura z oczywistą omyłką pisarską nie pozbawia prawa do
    odliczenia podatku — WERYFIKUJ w orzecznictwie NSA/TSUE przed powołaniem.
```

### ISU-4 — ROZSTRZYGANIE UZUPEŁNIAJĄCE (gdy ISU-2 niejednoznaczny lub E01/E02 niezgodne)

```
Gdy wynik ISU-2 niejednoznaczny (40–59%) lub gdy niezgodny element to NIP/nazwa,
przed konkluzją zbadaj dodatkowe źródła:

ŹRÓDŁO UZUP-1: Historia faktycznych rozliczeń
  □ Z konta którego NIP realizowane były przelewy na rzecz drugiej strony?
  □ Który NIP składał deklaracje VAT obejmujące tę transakcję?
  □ Który NIP raportował tę umowę do ZUS (w sprawach pracowniczych)?
  → Dokument: wyciągi bankowe, PIT-11, historia ZUS PUE, JPK_VAT

ŹRÓDŁO UZUP-2: Korespondencja pre-contractualna i wykonawcza
  □ Kto wysyłał maile / pisma w toku negocjacji i wykonania?
  □ Z jakiej domeny / na jakim papierze firmowym? Który NIP?
  □ Kto wystawiał faktury w toku realizacji?
  → Dokument: e-maile, pisma, faktury częściowe

ŹRÓDŁO UZUP-3: Zachowanie stron po zawarciu umowy
  □ Kto rzeczywiście wykonywał zobowiązanie (dostarczał towar, świadczył usługę)?
  □ Kto przyjmował zapłatę?
  □ Kto reklamował / respondował na reklamacje?
  → Zasada: strona która faktycznie wykonywała umowę = strona umowy
    (art. 65 §2 KC — cel umowy i zamiar stron > literalne brzmienie)

ŹRÓDŁO UZUP-4: Dokument rejestrowy (web_search obowiązkowo)
  □ Który NIP ma zarejestrowaną działalność tego rodzaju (PKD)?
  □ Który podmiot ma w KRS adres wskazany w dokumencie?
  □ Który podmiot miał w dacie zawarcia umowy zdolność do jej zawarcia?

WYNIK ISU-4:
  → Jeśli UZUP-1 i UZUP-2 spójnie wskazują jeden podmiot → PODMIOT WSKAZANY = ten podmiot
  → Jeśli UZUP nadal niejednoznaczne → WYNIK: SPÓR CO DO STRONY UMOWY
    (oznacz w piśmie, złóż wniosek o zobowiązanie do przedłożenia dokumentacji)
```

### ISU-5 — KONKLUZJA I FORMUŁA DO PISMA

```
Po ISU-1 → ISU-4 wygeneruj:

[A] WYNIK JEDNOZNACZNY:

  PODMIOT WSKAZANY: [pełna nazwa, NIP, KRS]
  ELEMENT BŁĘDNY: [kod] = [wartość] (wskazywał błędnie na [podmiot_B])
  KWALIFIKACJA: BŁĄD PISARSKI AUTORA DOKUMENTU

  FORMUŁA DO PISMA:
  "W [typ dokumentu] z dnia [data] elementy identyfikacyjne [podmiot X] zostały
  wskazane następująco: nazwa: [nazwa] ✓, NIP: [NIP] ✓, adres: [adres] ✓,
  podpisujący: [imię nazwisko] jako Prezes Zarządu [podmiot X] ✓. Wyłącznie
  [element niezgodny — np. numer KRS] zawiera odmienną wartość ([wartość błędna]),
  co stanowi oczywistą omyłkę pisarską leżącą po stronie autora dokumentu —
  [podmiot będący autorem].
  Omyłka ta nie zmienia tożsamości [roli — pracodawcy / kontrahenta / wystawcy
  faktury] — którym jest [podmiot X] (NIP: [NIP], KRS: [KRS]).
  Zgodnie z art. 65 §1 KC wykładnia oświadczenia woli uwzględnia całość
  okoliczności jego złożenia, nie wyłącznie jeden błędnie wpisany identyfikator.
  Błąd pisarski obciąża wyłącznie jego autora i nie może wywoływać negatywnych
  skutków dla [drugiej strony / powoda / nabywcy]."

[B] WYNIK SPORNY (ISU-4 nierozstrzygnięty):

  WYNIK: SPÓR CO DO STRONY — wymagana dokumentacja uzupełniająca
  WNIOSEK DOWODOWY DO PISMA:
  "Wobec rozbieżnych elementów identyfikacyjnych w dokumentach strony [X]
  powód/pozwany wnosi o zobowiązanie [podmiot_A] i [podmiot_B] do wspólnego
  złożenia: (a) historii przelewów na rzecz [strona] z wyszczególnieniem
  NIP nadawcy per miesiąc; (b) deklaracji VAT lub JPK_VAT za okres [okres];
  (c) korespondencji wykonawczej z tytułu [umowa/faktura]."
```

---

## SYTUACJE SZCZEGÓLNE

### SYTUACJA-1: Faktura VAT z błędnym NIP

```
Problem: nabywca odliczył VAT, US kwestionuje odliczenie bo NIP na fakturze
jest błędny.

Analiza ISU:
  G01 (NIP wystawcy) ✓ → podmiot_A [np. 111-222-33-44]
  G02 (Nazwa wystawcy) ✓ → podmiot_A
  G03 (Adres wystawcy) ✓ → podmiot_A
  G04 (NIP nabywcy) ✗ → błędny [zamiast 555-666-77-88 wpisano 555-666-77-89]
  G05 (Nazwa nabywcy) ✓ → podmiot_B "XYZ sp. z o.o."
  G06 (Adres nabywcy) ✓ → podmiot_B
  G07 (Konto do przelewu) ✓ → podmiot_A (właściciel IBAN)

WYNIK ISU-2: podmiot_A = wystawca 100%; podmiot_B jako nabywca ✓ 5/6, błąd G04.
KWALIFIKACJA: błąd pisarski jednej cyfry NIP nabywcy przy prawidłowej nazwie i adresie.

ARGUMENT: faktura identyfikuje nabywcę przez nazwę i adres; błąd jednej cyfry NIP
nie pozbawia prawa do odliczenia VAT gdy transakcja jest rzeczywista i nabywca
jednoznacznie zidentyfikowalny (WERYFIKUJ: orzecznictwo TSUE C-563/11, NSA).
```

### SYTUACJA-2: Umowa B2B z błędną firmą na nagłówku

```
Problem: umowa na nagłówku zawiera firmę spółki-matki, a NIP i REGON
wskazują na spółkę-córkę. Spółka-matka kwestionuje związanie umową.

Analiza ISU:
  E01 (NIP) → podmiot_B (spółka-córka)
  E02 (Nazwa w nagłówku) → podmiot_A (matka)
  E03 (KRS) → podmiot_B (córka)
  E04 (REGON) → podmiot_B (córka)
  E05 (Adres) → podmiot_B (córka — różny adres niż matka)
  E06 (Podpisujący) → Prezes Zarządu podmiot_B
  E07 (Rola) → "Prezes Zarządu [podmiot_B]" — wprost
  E08 (Pieczęć) → podmiot_B (córka)

WYNIK ISU-2:
  Podmiot_A (matka): 1 element (E02 — nazwa w nagłówku) = 4 pkt = 14%
  Podmiot_B (córka): 7 elementów = 24 pkt = 86%

KWALIFIKACJA: PODMIOT WSKAZANY = podmiot_B (spółka-córka).
  Nazwa w nagłówku = błąd pisarski (skopiowany z wzorca matki).
  Spółka-matka nie jest stroną umowy.

ARGUMENT: "Spośród ośmiu elementów identyfikacyjnych umowy siedem jednoznacznie
wskazuje na [podmiot_B] — NIP [n], KRS [n], REGON [n], adres [n], podpisujący
[imię nazwisko] w roli Prezesa Zarządu [podmiot_B], pieczęć [podmiot_B].
Wyłącznie nazwa w nagłówku zawiera odmienną wartość ([podmiot_A]), co stanowi
oczywistą omyłkę pisarską kopiowanego wzorca umownego. Zgodnie z art. 65 §2 KC
przy wykładni umowy należy badać zgodny zamiar stron i cel umowy, a nie wyłącznie
dosłowne brzmienie jednego elementu. Stroną umowy jest [podmiot_B]."
```

### SYTUACJA-3: Seria umów z różnymi podmiotami (sprawa pracownicza / seria kontraktów)

```
Problem: umowy 1–2 = podmiot_A; umowy 3–5 = podmiot_B. Czy liczyć razem?

Analiza ISU wykonywana PER DOKUMENT:
  Umowa 1: podmiot_A wskazany przez 8/8 elementów → strona = podmiot_A
  Umowa 2: podmiot_A wskazany przez 8/8 elementów → strona = podmiot_A
  Umowa 3: podmiot_B wskazany przez 6/7 elementów (E03 błędny) → strona = podmiot_B
  Umowa 4: podmiot_B wskazany przez 6/7 elementów (E03 błędny) → strona = podmiot_B
  Umowa 5: podmiot_B wskazany przez 6/7 elementów (E03 błędny) → strona = podmiot_B

WYNIK ISU-2 per umowę:
  ✅ PODMIOT WSKAZANY 1–2: podmiot_A (HP sp. z o.o.)
  ✅ PODMIOT WSKAZANY 3–5: podmiot_B (HPG sp. z o.o.)
  ⚠️ ELEMENT BŁĘDNY umów 3–5: KRS (wskazuje podmiot_A zamiast podmiot_B)

⚠️ OGRANICZENIE: ISU ustala STRONĘ każdej umowy z osobna.
   Scalenie do jednego pracodawcy / jednej strony zobowiązania dla celów
   art. 25¹ KP lub odpowiedzialności solidarnej → DALEJ stosuj:
   view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md
   (warstwy W1–W4: pracodawca rzeczywisty, obejście prawa, venire, dowody operacyjne)
```

---

## EFEKT PROCESOWY — MAPA ZASTOSOWAŃ

```
┌───────────────────────┬──────────────────────────────┬───────────────────────┐
│ Typ sporu             │ Element błędny               │ Efekt ISU             │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Pracodawca            │ KRS przy prawidłowym NIP     │ Pracodawca = HPG;     │
│ wielopodmiotowy       │                              │ błąd w KRS nie        │
│                       │                              │ zmienia strony umowy  │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Faktura VAT           │ Jedna cyfra NIP nabywcy      │ Nabywca jednoznaczny  │
│                       │                              │ z nazwy + adresu;     │
│                       │                              │ prawo do odliczenia   │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Umowa B2B             │ Nazwa spółki-matki na        │ Stroną = spółka-córka │
│ (spółka-matka/córka)  │ nagłówku, reszta = córka     │ (7/8 elementów)       │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Odpowiedzialność      │ NIP firmy A na poleceniu     │ Faktyczny zleceniodawca│
│ z umowy zlecenia      │ zapłaty, nazwa firmy B       │ = firma B (ISU-4)     │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Postępowanie          │ Błędna firma dłużnika        │ Właściwy dłużnik z    │
│ egzekucyjne           │ w tytule egzekucyjnym        │ danych większościowych│
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ Spór o dostawę        │ Błędny adres dostawy         │ Odbiorca z całości    │
│ (zamówienie)          │ przy prawidłowym NIP         │ dokumentu i zachowania│
└───────────────────────┴──────────────────────────────┴───────────────────────┘
```

---

## PODSTAWY PRAWNE (WERYFIKUJ PRZED POWOŁANIEM)

```
⛔ HARD GATE: Nie cytuj poniższych norm i sygnatur z pamięci modelu.
   Każdą zweryfikuj przez web_search lub isap.sejm.gov.pl przed użyciem w piśmie.

NORMY KRAJOWE:
  □ Art. 65 §1 KC — wykładnia uwzględnia okoliczności złożenia oświadczenia
  □ Art. 65 §2 KC — cel umowy i zgodny zamiar stron (tekst: Dz.U. 2025 poz. 1071 t.j.)
  □ Art. 354 §1 KC — zobowiązanie wykonuje się zgodnie z jego treścią i w sposób
    odpowiadający jego celowi społeczno-gospodarczemu
  □ Art. 8 KP — zakaz nadużycia prawa podmiotowego (w sprawach pracowniczych)
  □ Art. 300 KP — stosowanie KC w sprawach pracowniczych

PRAWO PODATKOWE (faktury):
  □ Art. 106e USTAWY o VAT — elementy obowiązkowe faktury
  □ Art. 88 USTAWY o VAT — zakaz odliczenia (weryfikuj czy błąd formalny mieści się)
  □ Orzecznictwo TSUE: C-563/11, C-250/21 (błędy formalne ≠ nieuczciwa transakcja)
    → WERYFIKUJ AKTUALNOŚĆ na curia.europa.eu
  □ Orzecznictwo NSA: sygnatur NIE cytuj z pamięci → web_search "NSA błąd NIP faktura VAT"

INTERPRETACJE MF / KIS:
  □ Nie cytuj z pamięci; sprawdź: interpretacje.podatki.gov.pl
```

---

## INTEGRACJA Z PIPELINE

### Wywołanie z pisma-procesowe-v3

```
Po MOD-DOKUMENT-ANOMALIE DA-3 (klasyfikacja anomalii), gdy wykryto Klasę I lub II:
  → view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
  → ISU-1 → ISU-2 → ISU-3 → ISU-4 (jeśli konieczne) → ISU-5
  → Formuła ISU-5 [A] wchodzi do W1.3 (mapa cel → przesłanka → dowód)
    i do W2.2 (uzasadnienie pisma) jako akapit "Identyfikacja strony dokumentu"
```

### Wywołanie z PRE-W2-VERIFICATION-GATE

```
Po PRE-W2.C/D gdy wykryto T1/T2/T3 (rozbieżność podmiotowa):
  → view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md (ISU-1 → ISU-5)
  → view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md
    (R1→R5, warstwy W0→W4 — dla scalenia pracodawców)
  Kolejność: ISU PRZED MOD-PRACODAWCA-RZECZYWISTY
  (ISU ustala stronę każdej umowy → MOD-PR-RZECZ scal je w jednego pracodawcę)
```

### Wywołanie z analizator-umow-v1

```
W fazie identyfikacji stron umowy, gdy dane stron są rozbieżne lub niekompletne:
  → view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
  → ISU-1 → ISU-2 → ISU-5 [A] lub [B]
  → Wynik ISU wchodzi do raportu analizy umowy jako sekcja "Identyfikacja stron"
```

### Wywołanie z analizator-dowodow-v3

```
W BLOK-B (analiza dokumentów), gdy dokument strony przeciwnej zawiera
rozbieżne elementy identyfikacyjne:
  → view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md (ISU-1 → ISU-4)
  → Wynik ISU-4 wchodzi do DA-REJ jako anomalia Klasy I lub II (MOD-DOKUMENT-ANOMALIE)
```

---

## RELACJA Z INNYMI MODUŁAMI

```
MOD-DOKUMENT-ANOMALIE (DA-0 → DA-3):
  Wykrywa że rozbieżność istnieje → zatrzymuje się na klasyfikacji.
  MOD-IDENTYFIKACJA-STRONY-UMOWY:
  Buduje z rozbieżności pełny argument identyfikacyjny → wychodzi z wnioskiem
  "strona to podmiot X, element Y = błąd pisarski".
  SEKWENCJA: MOD-DOKUMENT-ANOMALIE DA-3 → [trigger] → MOD-IDENTYFIKACJA-STRONY-UMOWY ISU

MOD-PRACODAWCA-RZECZYWISTY (W0–W4):
  W0 (dane większościowe) = uproszczona wersja ISU dla spraw pracowniczych.
  Po wdrożeniu tego modułu: W0 to pointer do MOD-IDENTYFIKACJA-STRONY-UMOWY.
  SEKWENCJA: ISU (strona każdej umowy) → MOD-PR-RZECZ (scalenie pracodawców)

PRE-W2-VERIFICATION-GATE (PRE-W2.C/D):
  Wykrywa rozbieżność online → triggeruje oba moduły w kolejności ISU → MOD-PR-RZECZ.
```

---

## HISTORIA ZMIAN

```
1.1.0 (2026-06-27) — Dodano algorytm ISU-PESEL (P1-P6): weryfikacja PESEL przez format, dekodowanie daty urodzenia z uwzględnieniem wszystkich stuleci, dekodowanie płci (P10), suma kontrolna wagowa [1,3,7,9,1,3,7,9,1,3], raport ERR-F/ERR-D/ERR-PL/ERR-CK z klasyfikacją anomalii Klasa I/III. Przykład obliczeniowy dla PESEL 84030315255.

1.0.0 (2026-06-27) — Pierwsza wersja. Wydzielono z WARSTWA 0 modułu
  MOD-PRACODAWCA-RZECZYWISTY v2.1.0 (WARN-19) w odpowiedzi na propozycję
  dewelopera: mechanika danych większościowych jest bardziej universalna niż
  pracodawca rzeczywisty i powinna działać na wszystkich typach dokumentów
  i postępowań, nie tylko pracowniczych.
  Zakres: umowy o pracę, B2B, faktury VAT, polisy, zamówienia, pisma procesowe.
  Nowe: katalog EL-PODMIOT/EL-OSOBA/EL-FAKTURA (10+7+8 elementów z wagami),
  procedura ISU-1–ISU-5, 3 sytuacje szczególne, mapa zastosowań.
  Integracja: pisma-procesowe-v3, analizator-umow-v1, analizator-dowodow-v3,
  PRE-W2-VERIFICATION-GATE, MOD-DOKUMENT-ANOMALIE, MOD-PRACODAWCA-RZECZYWISTY.
  WARN-19 zamknięty przez ten plik.
```

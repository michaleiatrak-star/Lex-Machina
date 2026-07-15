# SPC-SPD-SPE — Klauzula wykonalności / Egzekucja / Wezwanie przedsądowe

*Plik zawiera trzy schematy: SPC (klauzula), SPD (egzekucja), SPE (wezwanie do zapłaty).*
*Ładuj tylko odpowiednią sekcję zgodnie z typem pisma ustalonym w M2-intake.md.*

---

---

# SEKCJA SPC — Wniosek o Nadanie Klauzuli Wykonalności

*Ładuj gdy: użytkownik ma tytuł egzekucyjny (wyrok, nakaz, ugoda, akt notarialny)
i chce uzyskać klauzulę wykonalności, aby przekazać sprawę komornikowi.*

## PODSTAWA PRAWNA

- **art. 781 KPC** — wniosek o nadanie klauzuli wykonalności
- **art. 782 KPC** — właściwość sądu do nadania klauzuli
- **art. 786 KPC** — klauzula na rzecz lub przeciwko następcy prawnemu
- **art. 71 pkt 1 KSCU** — opłata 6 zł (tytuł z sądu)
- **art. 71 pkt 2 KSCU** — opłata 50 zł (akt notarialny z klauzulą wykonalności)

> ⚠ Weryfikuj przepisy na isap.sejm.gov.pl.

## DANE WYMAGANE

```
□ Typ tytułu egzekucyjnego (wyrok / nakaz zapłaty / akt notarialny / ugoda sądowa)
□ Sygnatura sprawy lub repertorium notarialne
□ Data uprawomocnienia (dla orzeczeń sądowych)
□ Dane wierzyciela (imię i nazwisko / firma, adres, PESEL/NIP)
□ Dane dłużnika (imię i nazwisko / firma, adres)
□ Sąd, który wydał orzeczenie (właściwy do nadania klauzuli)
```

## SZABLON PISMA SPC

```
[Miejscowość], dnia [DD miesiąc RRRR] r.

[Imię i nazwisko / Nazwa firmy Wierzyciela]
[Adres]
[PESEL: XXXXXXXXXXX / NIP: XXX-XXX-XX-XX]

                        [Nazwa Sądu — właściwy do nadania klauzuli]
                        [Wydział]
                        [Adres sądu]

Sygn. akt: [sygnatura sprawy]

            WNIOSEK O NADANIE KLAUZULI WYKONALNOŚCI

Na podstawie art. 781 §1 KPC wnoszę o nadanie klauzuli wykonalności:
[wyrokowi / nakazowi zapłaty / ugodzie sądowej] wydanemu przez [Sąd]
w dniu [data] w sprawie sygn. akt [sygnatura] / [aktowi notarialnemu
sporządzonemu przez notariusza [imię i nazwisko] z dnia [data],
Rep. A nr [repertorium]],

— na rzecz wierzyciela: [imię i nazwisko / firma, adres],
— przeciwko dłużnikowi: [imię i nazwisko / firma, adres].

                       UZASADNIENIE

Wskazany tytuł egzekucyjny [uprawomocnił się / stał się wykonalny]
w dniu [data]. W celu wszczęcia postępowania egzekucyjnego niezbędne
jest uzyskanie tytułu wykonawczego poprzez nadanie klauzuli wykonalności
(art. 776 KPC).

Opłata sądowa w kwocie [6 zł / 50 zł] uiszczona — dowód w załączniku.

Załączniki:
1. Oryginał / odpis [tytułu egzekucyjnego].
2. Dowód uiszczenia opłaty sądowej.

                        [Miejscowość], dnia [data]
                        ___________________________
                        [Imię i nazwisko / podpis]
```

## UWAGI SPC

- Wniosek składa się do sądu, który wydał orzeczenie w I instancji (art. 782 §1 KPC).
- Dla aktów notarialnych z klauzulą dobrowolnego poddania się egzekucji (art. 777 KPC)
  — wniosek do sądu rejonowego miejsca siedziby notariusza.
- Sąd wydaje tytuł wykonawczy bez rozprawy — zazwyczaj w ciągu 2–4 tygodni.

---

---

# SEKCJA SPD — Wniosek o Wszczęcie Postępowania Egzekucyjnego

*Ładuj gdy: użytkownik ma tytuł wykonawczy (tytuł egzekucyjny z klauzulą)
i chce wszcząć egzekucję u komornika. Brak opłaty sądowej — opłaty egzekucyjne
pobiera komornik zgodnie z ustawą o kosztach komorniczych.*

## PODSTAWA PRAWNA

- **art. 797 KPC** — wniosek o wszczęcie egzekucji
- **art. 799 KPC** — wskazanie sposobu egzekucji
- **art. 8 ust. 1 ustawy o kosztach komorniczych** — zaliczka na koszty egzekucji
  (10% egzekwowanego świadczenia, nie mniej niż 200 zł i nie więcej niż 2 000 zł)

> ⚠ Weryfikuj przepisy i stawki komornicze na isap.sejm.gov.pl.

## DANE WYMAGANE

```
□ Dane wierzyciela (imię i nazwisko / firma, adres, PESEL/NIP, tel./e-mail)
□ Dane dłużnika (imię i nazwisko / firma, adres, PESEL/NIP — o ile znane)
□ Tytuł wykonawczy (sygnatura + data klauzuli)
□ Kwota do wyegzekwowania (należność główna + odsetki do dnia złożenia +
  koszty zasądzone w tytule)
□ Sposób egzekucji (z rachunku bankowego / wynagrodzenia / ruchomości /
  nieruchomości / wierzytelności)
□ Dane komornika lub rewir komorniczy (do wyboru wierzyciela — art. 10
  ustawy o komornikach sądowych)
□ Znane rachunki bankowe lub pracodawca dłużnika (opcjonalnie)
```

## SZABLON PISMA SPD

```
[Miejscowość], dnia [DD miesiąc RRRR] r.

[Imię i nazwisko / Nazwa firmy Wierzyciela]
[Adres]
[PESEL: XXXXXXXXXXX / NIP: XXX-XXX-XX-XX]
[tel.: XXXXXXXXX / e-mail: XXXXXXXXX]

                        Komornik Sądowy przy Sądzie Rejonowym
                        [imię i nazwisko komornika]
                        [Adres kancelarii komorniczej]

            WNIOSEK O WSZCZĘCIE POSTĘPOWANIA EGZEKUCYJNEGO

Na podstawie art. 797 KPC wnoszę o wszczęcie postępowania egzekucyjnego
przeciwko dłużnikowi:

[Imię i nazwisko / Nazwa firmy Dłużnika]
[Adres dłużnika]
[PESEL: XXXXXXXXXXX / NIP: XXX-XXX-XX-XX]

na podstawie tytułu wykonawczego: [opis tytułu — sąd, data, sygnatura,
data klauzuli wykonalności],

w celu wyegzekwowania należności:
- należność główna:          [kwota] zł
- odsetki [ustawowe/umowne] od dnia [data] do dnia zapłaty
- koszty procesu:            [kwota] zł
- koszty klauzuli:           [kwota] zł
                      ─────────────────
ŁĄCZNIE:                     [kwota] zł (plus dalsze odsetki)

                        SPOSOBY EGZEKUCJI

Na podstawie art. 799 KPC wnoszę o prowadzenie egzekucji z:
□ rachunku bankowego dłużnika [bank: __________ / numer rachunku: __________]
□ wynagrodzenia za pracę (pracodawca: __________)
□ wierzytelności i innych praw majątkowych
□ ruchomości dłużnika
□ nieruchomości (adres: __________) — [tylko dla dużych kwot]

[Opcjonalnie: wniosek o zapytanie do ZUS, US, CEPIK, banków w trybie
art. 761 §1 KPC i art. 8913 KPC o majątek dłużnika]

W załączeniu przekazuję tytuł wykonawczy.

Załączniki:
1. Tytuł wykonawczy (oryginał).
2. [Dowód zaliczki — jeśli komornik wymaga]

                        [Miejscowość], dnia [data]
                        ___________________________
                        [Imię i nazwisko / podpis]
```

## UWAGI SPD

- Wierzyciel może wybrać **dowolnego komornika z rewiru** właściwego dla miejsca
  zamieszkania/siedziby dłużnika lub miejsca położenia majątku (art. 10 u.k.s.).
- Komornik pobierze **zaliczkę na koszty** — zazwyczaj 10% egzekwowanej kwoty.
- Warto dołączyć do wniosku znane informacje o majątku dłużnika (rachunki, pracodawca) —
  przyspiesza egzekucję.

---

---

# SEKCJA SPE — Wezwanie Przedsądowe do Zapłaty

*Ładuj gdy: użytkownik chce wysłać wezwanie do zapłaty przed wniesieniem pozwu.
Brak opłaty sądowej. Dokument nie jest pismem procesowym — jest prywatnym
wezwaniem dłużnika.*

## PODSTAWA PRAWNA

- **art. 455 KC** — wymagalność świadczenia po wezwaniu
- **art. 481 §1 KC** — odsetki za opóźnienie od chwili wymagalności
- **art. 187 §1 pkt 3 KPC** — obowiązek informacji o próbie ugodowej
  (od 03.05.2012; weryfikuj aktualną wersję)

> ⚠ Weryfikuj przepisy na isap.sejm.gov.pl.

## DANE WYMAGANE

```
□ Dane wierzyciela (imię i nazwisko / firma, adres, PESEL/NIP)
□ Dane dłużnika (imię i nazwisko / firma, adres)
□ Podstawa zobowiązania (umowa, delikt, bezpodstawne wzbogacenie — data i opis)
□ Kwota należności głównej
□ Data, od której naliczane są odsetki
□ Termin do zapłaty (standardowo 7 lub 14 dni od doręczenia)
□ Numer rachunku bankowego do zapłaty
□ Forma doręczenia (list polecony za potwierdzeniem odbioru — zalecana)
```

## SZABLON PISMA SPE

```
[Miejscowość], dnia [DD miesiąc RRRR] r.

[Imię i nazwisko / Nazwa firmy Wierzyciela]
[Adres]
[PESEL: XXXXXXXXXXX / NIP: XXX-XXX-XX-XX]

[Imię i nazwisko / Nazwa firmy Dłużnika]
[Adres]

            WEZWANIE DO ZAPŁATY

Niniejszym wzywam Pana/Panią/[nazwę firmy] do zapłaty kwoty:

[kwota słownie] ([kwota liczbowo] zł)

wraz z odsetkami [ustawowymi za opóźnienie / umownymi w wysokości ___%]
naliczanymi od dnia [data] do dnia zapłaty,

— w terminie [7 / 14] dni od dnia doręczenia niniejszego wezwania —

na rachunek bankowy:
[numer rachunku]
[nazwa banku]
z dopiskiem: „[opis tytułu zapłaty]"

                       PODSTAWA ROSZCZENIA

Powyższa należność wynika z [opisu stosunku prawnego: umowy z dnia [data] /
świadczenia nienależnego / szkody wyrządzonej w dniu [data] / innej podstawy].

[Opis zdarzenia: co, kiedy, ile — bez zbędnych emocji, rzeczowo.]

Wobec braku zapłaty w wyznaczonym terminie zostanie skierowane
powództwo do właściwego sądu, co wiązać się będzie z koniecznością
poniesienia przez Pana/Panią/[firmę] kosztów postępowania sądowego
i egzekucyjnego.

                        [Miejscowość], dnia [data]
                        ___________________________
                        [Imię i nazwisko / podpis]
```

## UWAGI SPE

- Wezwanie wysyłaj **listem poleconym za potwierdzeniem odbioru** lub przez
  komornika (art. 139¹ KPC) — dowód doręczenia może być potrzebny w procesie.
- Od dnia wymagalności (dnia następnego po upływie terminu z wezwania)
  biegną **odsetki ustawowe za opóźnienie** (art. 481 §2 KC).
- W sprawach B2B (obie strony są przedsiębiorcami) — odsetki mogą być wyższe
  (odsetki w transakcjach handlowych — ustawa z 8.03.2013 r.).
- Zachowaj kopię wezwania i potwierdzenie nadania — sąd może wymagać wykazania
  próby polubownego rozwiązania sporu (art. 187 §1 pkt 3 KPC).

---

# SEKCJA SPE-OSTATECZNE — przekierowanie

Jeżeli użytkownik chce wysłać wezwanie ostateczne, po bezskutecznym wcześniejszym wezwaniu albo bezpośrednio przed pozwem, nie używaj zwykłego wariantu SPE. Wczytaj `references/SPE-ostateczne.md`.

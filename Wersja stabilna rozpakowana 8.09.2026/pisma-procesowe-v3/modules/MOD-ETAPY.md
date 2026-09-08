# MOD-ETAPY — Etapowa analiza materiałów i redakcja pism procesowych

## Cel

Moduł wymusza pracę etapową przy obszernych materiałach, aktach, wielu pismach,
plikach dowodowych albo gdy użytkownik chce pismo procesowe wysokiego ryzyka.
Finalne pismo nie jest pierwszym wynikiem. Najpierw powstaje mapa sprawy,
analiza, plan, następnie projekt, a na końcu audyt.

## ⛔ Relacja do automatu stanów W1–W3 — REGUŁA PIERWSZEŃSTWA

```
MOD-ETAPY OPAKOWUJE W1–W3, NIE ZASTĘPUJE. Automat stanów obowiązuje
identycznie wewnątrz MOD-ETAPY:

Etap 1 (mapa materiału)  → przygotowanie do W1
Etap 2 (fakty i dowody)  → przygotowanie do W1 (mapa przesłanka→dowód)
Etap 3 (prawo i ryzyka)  → przygotowanie do W1 (lista robocza przepisów)
Etap 4 (plan pisma)      → CHECKPOINT: po Etapie 4 wejdź do W1 i wykonaj
                            cały automat stanów (W1 → zatwierdzenie → W2 → W3)
Etap 5 (projekt pisma)   → = W2 (redakcja z placeholderami ⚠️)
Etap 6 (audyt końcowy)   → = W3 (weryfikacja ISAP + PODMIOT-GATE + WALIDACJA +
                            AUDYT-KONCOWY); obowiązuje ZAKAZ-7 i wszystkie
                            inne zakazy bezwzględne z SKILL.md

⛔ ZAKAZY z SKILL.md (ZAKAZ-1 do ZAKAZ-8) obowiązują we wszystkich
   etapach bez wyjątku — MOD-ETAPY ich nie znosi.
⛔ PODMIOT-GATE wykonuje się na początku Etapu 6 (= W3.0) — nie wcześniej.
⛔ CLAIM-VALIDATION wykonuje się na początku Etapu 2 (= W1.2a).
```

## Kiedy stosować

Stosuj obowiązkowo gdy:

- materiał źródłowy ma wiele dokumentów albo jest obszerny,
- użytkownik prosi o pozew, apelację, odpowiedź na pozew, replikę, zażalenie,
  zawiadomienie do prokuratury lub inne pismo o istotnych skutkach,
- trzeba zrekonstruować stan faktyczny,
- występują sporne dowody, terminy, kilka podstaw prawnych albo ryzyko procesowe,
- użytkownik wyraźnie chce pracę „krok po kroku” albo etapami.

## Model pracy w osobnych wiadomościach

Jeżeli środowisko pozwala prowadzić dialog wieloetapowo, pracuj w kolejnych odpowiedziach:

```
Wiadomość 1 — mapa materiału i zakres analizy
Wiadomość 2 — ustalenia faktyczne i matryca dowodowa
Wiadomość 3 — kwalifikacja prawna, ryzyka, argumenty przeciwnika
Wiadomość 4 — plan pisma: tezy, zarzuty, dowody, żądania
Wiadomość 5 — projekt pisma procesowego
Wiadomość 6 — audyt pisma i wersja finalna po korekcie
```

Jeżeli użytkownik żąda jednego wyniku albo warunki rozmowy nie pozwalają na kontynuację,
zastosuj tę samą strukturę w jednej odpowiedzi, ale jasno oddziel etapy.

## Etap 1 — Mapa materiału

Output:

```
A. Jakie dokumenty przeanalizowano
B. Czego dokumenty dotyczą
C. Jakie kwestie są rozstrzygające
D. Jakie braki uniemożliwiają pewne ustalenia
E. Jakie moduły/skille należy uruchomić
```

Nie formułuj jeszcze finalnego pisma, chyba że sprawa jest prosta i kompletna.

## Etap 2 — Fakty i dowody

Output:

```
A. Fakty bezsporne
B. Fakty sporne
C. Fakty nieudowodnione
D. Dowody mocne / średnie / słabe
E. Sprzeczności i luki
F. Fakty prawnie decydujące
```

Każdy fakt musi mieć źródło. Brak źródła = nie używać jako faktu w piśmie.

## Etap 3 — Prawo i ryzyka

Output:

```
A. Podstawy prawne do weryfikacji online
B. Znamiona / przesłanki / warunki formalne
C. Najsilniejsze argumenty użytkownika
D. Najsilniejsze argumenty przeciwnika
E. Słabe punkty i ryzyka procesowe
F. Prawdopodobny sposób oceny przez sąd/organ
```

## Etap 4 — Plan pisma

Przed projektem pisma przygotuj plan:

```
1. Rodzaj pisma
2. Sąd/organ i tryb
3. Żądania/wnioski
4. Zarzuty lub podstawy roszczenia
5. Układ faktów
6. Dowody przy każdym twierdzeniu
7. Podstawy prawne
8. Załączniki
9. Ryzyka i elementy do przemilczenia/ograniczenia
```

## Etap 5 — Projekt pisma

Dopiero po planie sporządź projekt. Pismo ma mieć strukturę:

```
I. Oznaczenie sądu/organu i stron
II. Rodzaj pisma
III. Żądania / wnioski
IV. Stan faktyczny
V. Zarzuty / twierdzenia
VI. Analiza prawna
VII. Wnioski dowodowe
VIII. Załączniki
IX. Podpis
```

## Etap 6 — Audyt końcowy

Audyt po projekcie jest obowiązkowy. Nie zastępuje pisma, tylko je kontroluje.

```
A. Audyt formalny — właściwość, opłata, podpis, załączniki, odpisy
B. Audyt faktów — czy każdy fakt ma źródło
C. Audyt prawa — czy przepisy są aktualne i adekwatne
D. Audyt dowodów — czy dowód udowadnia konkretną tezę
E. Audyt ryzyk — co przeciwnik może najłatwiej zaatakować
F. Audyt języka — czy pismo jest procesowe, precyzyjne, bez publicystyki
G. Lista poprawek obowiązkowych przed złożeniem
```

## Zasada stopu

Jeżeli w audycie występuje błąd krytyczny:

- brak legitymacji,
- zły sąd/organ,
- przekroczony termin,
- brak podstawowego dowodu,
- twierdzenia bez źródła,
- fikcyjna albo nieweryfikowana podstawa prawna,

nie oznaczaj pisma jako finalnego. Oznacz je jako projekt roboczy i wskaż warunek naprawy.

# Prawo Konsumenckie — Szczegółowy Framework

## KRYTYCZNA ZMIANA 2023 — SPRAWDŹ DATĘ ZAKUPU
```
Zakup PO 01.01.2023 → Niezgodność z umową (ustawa o PK, art. 43a–43g)
Zakup PRZED 01.01.2023 → Rękojmia KC (art. 556–576)
```

## HIERARCHIA UPRAWNIEŃ (od 01.01.2023) — KOLEJNOŚĆ OBOWIĄZKOWA
```
KROK 1: Naprawa LUB wymiana (wybiera konsument)
KROK 2 (dopiero gdy krok 1 nieskuteczny): Obniżenie ceny LUB odstąpienie
  UWAGA: Domniemanie istotności niezgodności (sprzedawca musi obalić!)
```
Wyjątek — od razu krok 2: gdy sprzedawca odmówił/nie zrealizował krok 1,
lub niezgodność jest istotna.

## KLUCZOWE TERMINY
| Czynność | Termin |
|---|---|
| Odpowiedzialność z tytułu niezgodności | 2 lata od wydania (art. 43c ust. 1 PK) |
| Domniemanie niezgodności | 2 lata od wydania (art. 43c PK — od 01.01.2023; wcześniej 1 rok) |
| Odpowiedź sprzedawcy na reklamację | 14 dni (brak = reklamacja uwzględniona) |
| Odstąpienie od umowy (internet/poza lokalem) | 14 dni od odbioru; **30 dni** przy nieumówionej wizycie/wycieczce |
| Wydłużenie prawa odstąpienia (brak info) | do 12 miesięcy (art. 29 PK) |
| Zwrot pieniędzy przez sprzedawcę | 14 dni od oświadczenia konsumenta |
| Roszczenie z opóźnienia/odwołania lotu | 1 rok od dnia lotu (art. 205c ust. 7 PrLot); zawieszone na czas reklamacji |

## ODSTĄPIENIE OD UMOWY (art. 27–38a ustawy PK)
Tylko przy zakupach przez internet lub poza lokalem.
**14 dni bez podawania przyczyny** — liczonych od dnia odbioru towaru (sprzedaż) lub zawarcia umowy (usługi).
**30 dni** — gdy umowa zawarta poza lokalem podczas **nieumówionej wizyty** przedsiębiorcy w miejscu zamieszkania konsumenta lub podczas **wycieczki** (art. 27 ust. 2 PK — zmiana od 2023).
Koszty zwrotu ponosi konsument — CHYBA ŻE sprzedawca ich nie podał.
Brak informacji o prawie odstąpienia → termin przedłuża się do **12 miesięcy** (art. 29 PK).

**Wyjątki — brak prawa odstąpienia:**
- Produkt na indywidualne zamówienie
- Szybko psujący się / krótki termin ważności
- Opakowanie higieniczne — otwarte
- Usługa w pełni wykonana za zgodą konsumenta

## KLAUZULE NIEDOZWOLONE (art. 385¹ KC)
Skutek: klauzula nie wiąże konsumenta z mocy prawa (reszta umowy ważna).
Weryfikuj: rejestr.uokik.gov.pl + art. 385³ KC (szara lista).

## KIM JEST KONSUMENT
- Osoba fizyczna nieprowadząca działalności w zakresie umowy
- **Od 01.01.2021:** Jednoosobowy przedsiębiorca gdy umowa nie ma charakteru ZAWODOWEGO

## GDZIE ZGŁOSIĆ
- UOKiK: uokik.gov.pl (naruszenia zbiorowe, klauzule)
- Inspekcja Handlowa: konkretny sklep
- Rzecznik Konsumentów (powiatowy/miejski): BEZPŁATNA pomoc indywidualna
- Rzecznik Finansowy: sprawy finansowe (banki, ubezpieczenia)
- ODR: ec.europa.eu/consumers/odr (spory z zagranicznymi sprzedawcami online)

## OPÓŹNIENIA LOTÓW (Rozp. WE 261/2004)
- ≥ 3h opóźnienia przy dolocie: 250–600 EUR (zależy od dystansu)
- Odwołanie: 250–600 EUR + zwrot/zmiana trasy
- Wyjątek: nadzwyczajne okoliczności (nie: awaria techniczna)
- Przedawnienie: **1 rok od dnia wykonania przewozu** (art. 205c ust. 7 ustawy Prawo lotnicze)
  → Uwaga: bieg przedawnienia **zawiesza się** od dnia złożenia reklamacji do dnia udzielenia odpowiedzi albo upływu 30-dniowego terminu na rozpatrzenie (art. 205c ust. 8 PrLot)
  → Samo wysłanie reklamacji NIE przerywa biegu — przerywa dopiero wniesienie pozwu lub postępowanie administracyjne
- Weryfikuj: isap.sejm.gov.pl → ustawa z 3.07.2002 r. Prawo lotnicze

*Ustawa PK (t.j. Dz.U. 2025 poz. 1172; poprzedni t.j. Dz.U. 2024 poz. 1796) + KC art. 385¹–385³*
*Dyrektywa Omnibus + Towarowa + Cyfrowa: implementacja od 01.01.2023 (Dz.U. 2022 poz. 2337 i 2581)*

## FAZA 0 — INTAKE
```
□ Data zakupu: przed czy po 01.01.2023? → decyduje reżim prawny
□ Rodzaj sprzedawcy: sklep stacjonarny / internet / poza lokalem?
□ Jaka wada / niezgodność? → naprawa / wymiana (krok 1) czy od razu cena/zwrot?
□ Czy minęły 2 lata od wydania towaru? → termin odpowiedzialności
□ Czy sprzedawca odpowiedział w 14 dniach? → brak = reklamacja uwzględniona
□ Czy zakup online? → prawo odstąpienia 14 dni
```

## PREDYKCJA WYNIKU — SZABLON
```
Szanse na wygraną: [0–100%]
IN PLUS: zakup po 01.01.2023, wada < 2 lata, brak odpowiedzi sprzedawcy
IN MINUS: produkt custom, wada po 2 latach, brak dowodu zakupu
BENCHMARKING: UOKiK — decyzje o klauzulach abuzywnych (rejestr.uokik.gov.pl)
REKOMENDACJA: □ Reklamacja  □ Odstąpienie  □ UOKiK  □ Sąd
```

## ŁĄCZ Z
| Sytuacja | Skill |
|---|---|
| Analiza OWU / regulaminu / umowy | `analizator-umow-v1` |
| Pozew / skarga do sądu | `pisma-procesowe-v3` |
| Pismo reklamacyjne / odstąpienie (proste) | `pisma-proste-v2` |
| Klauzule abuzywne — orzecznictwo | `orzeczenia-sadowe-v2` |

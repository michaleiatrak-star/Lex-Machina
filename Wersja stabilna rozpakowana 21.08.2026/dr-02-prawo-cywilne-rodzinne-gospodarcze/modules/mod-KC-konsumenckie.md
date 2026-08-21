# mod-KC-konsumenckie

**Status:** moduł klasy kancelaryjnej — poziom DR-03

**Źródło weryfikacji:** KC — Dz.U. 2025 poz. 1071 t.j. | Ustawa o prawach konsumenta — Dz.U. 2023 poz. 2759 t.j. ze zm. | Ustawa o kredycie konsumenckim — Dz.U. 2024 poz. 1567 t.j.
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## FAZA 0 — INTAKE

```
□ Czy stroną jest konsument (osoba fizyczna niezwiązana z działalnością gosp.)?
□ Jaki rodzaj umowy: sprzedaż / usługa / umowa na odległość / kredyt?
□ Data zawarcia umowy i metoda (stacjonarna / na odległość / poza lokalem)?
□ Jaki problem: klauzula abuzywna / odstąpienie / rękojmia / niezgodność towaru?
□ Czy konsument złożył reklamację? Kiedy i jak?
□ Czy jest termin do zachowania (np. 14 dni na odstąpienie)?
```

---

## KLAUZULE ABUZYWNE (art. 385¹–385³ KC)

> ⚠️ Brzmienie — weryfikuj w aktualnym KC w ISAP.

```
Przesłanki abuzywności (art. 385¹ §1 KC):
  □ Postanowienie nie zostało indywidualnie uzgodnione
  □ Kształtuje prawa/obowiązki konsumenta sprzecznie z dobrymi obyczajami
  □ Rażące naruszenie interesów konsumenta

Skutek: postanowienie nie wiąże konsumenta — umowa w pozostałym zakresie obowiązuje

Szara lista (art. 385³ KC):
  → Katalog postanowień domniemanych jako abuzywne
  → Weryfikuj aktualny art. 385³ KC w ISAP — lista może być rozszerzana

Rejestr klauzul niedozwolonych UOKiK:
  → https://rejestr.uokik.gov.pl
```

---

## PRAWO ODSTĄPIENIA OD UMOWY (Ustawa o prawach konsumenta)

> ⚠️ Weryfikuj aktualne przepisy ustawy o prawach konsumenta w ISAP.

```
UMOWY NA ODLEGŁOŚĆ / POZA LOKALEM PRZEDSIĘBIORCY:
  Termin odstąpienia: 14 dni od dnia dostarczenia towaru (lub zawarcia — usługi)
  Wydłużenie do 12 miesięcy: gdy przedsiębiorca nie poinformował o prawie odstąpienia
  Forma: pisemna lub trwały nośnik; wystarczy oświadczenie przed upływem terminu
  Skutek: umowa uważana za niezawartą; zwrot towaru + zapłaconej ceny

WYJĄTKI (brak prawa odstąpienia) — weryfikuj aktualny katalog w ustawie:
  → Treści cyfrowe dostarczone na wyraźne życzenie konsumenta
  → Usługi w pełni wykonane za zgodą konsumenta
  → Produkty szybko psujące się
  → Produkty indywidualnie dopasowane
  → i inne — weryfikuj w ISAP
```

---

## RĘKOJMIA / NIEZGODNOŚĆ TOWARU Z UMOWĄ (Dyrektywa 771/2019, ustawa o prawach konsumenta)

```
KONSUMENCI (od 01.01.2023 — nowe przepisy):
  Termin odpowiedzialności: 2 lata od dostarczenia towaru
  Domniemanie: niezgodność istniejąca w chwili dostarczenia (przez 1 rok)
  Kolejność żądań:
    1° Naprawa lub wymiana (wybór konsumenta)
    2° Obniżenie ceny lub odstąpienie (gdy naprawa/wymiana niemożliwa)
  Termin na reklamację: bez specjalnego terminu (tylko termin 2-letni)

PRZEDSIĘBIORCY (kodeksowa rękojmia — art. 556 i n. KC):
  Termin: 2 lata od wydania (5 lat — nieruchomości)
  Terminy na zawiadomienie: weryfikuj aktualny art. 563 KC w ISAP
```

---

## WERYFIKACJA ONLINE

```
web_search: "klauzule abuzywne art 385 KC orzecznictwo SN TSUE 2025 2026"
web_search: "prawo odstąpienia umowa odległość 14 dni ustawa prawa konsumenta isap 2023 poz. 2759"
web_search: "rękojmia niezgodność towaru konsument 2023 nowe przepisy orzecznictwo"
web_search: "rejestr klauzul niedozwolonych UOKiK rejestr.uokik.gov.pl"
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Analiza umowy konsumenckiej | `analizator-umow-v1` (moduł J8 B2C) |
| Pismo do przedsiębiorcy / pozew | `pisma-procesowe-v3` |
| Orzecznictwo SN / TSUE konsumenckie | `orzeczenia-sadowe-v2` |
| Roszczenia cywilne ogólnie | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` |

---

## ŹRÓDŁA ONLINE

- KC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
- Ustawa o prawach konsumenta: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230002759
- Ustawa o kredycie konsumenckim: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001567
- Rejestr klauzul UOKiK: https://rejestr.uokik.gov.pl

---

## ZMIANA 2023 — KRYTYCZNA DATA ZAKUPU

```
Zakup PO 01.01.2023 → Niezgodność z umową (art. 43a–43g ustawy o prawach konsumenta)
Zakup PRZED 01.01.2023 → Rękojmia KC (art. 556–576 KC)
⚠️ INNY REŻIM, inny tryb reklamacji, inne terminy!
```

### Hierarchia uprawnień (od 01.01.2023) — KOLEJNOŚĆ OBOWIĄZKOWA

```
KROK 1: Naprawa LUB wymiana (wybiera konsument)
KROK 2 (dopiero gdy krok 1 nieskuteczny): Obniżenie ceny LUB odstąpienie
  UWAGA: Domniemanie istotności niezgodności — sprzedawca musi obalić!
  Wyjątek — od razu krok 2: gdy sprzedawca odmówił/nie zrealizował krok 1,
  lub niezgodność jest istotna.
```

### Kim jest konsument (aktualna definicja)

```
Osoba fizyczna nieprowadząca działalności w zakresie umowy
OD 01.01.2021: jednoosobowy przedsiębiorca gdy umowa nie ma charakteru ZAWODOWEGO
  → JDG może korzystać z ochrony konsumenckiej przy zakupach niezawodowych
```

---

## TERMIN ODSTĄPIENIA — NIUANSE

```
14 dni (standard) → od dnia odbioru towaru / zawarcia umowy o usługę
30 dni → gdy umowa zawarta podczas NIEUMÓWIONEJ wizyty przedsiębiorcy
          lub podczas WYCIECZKI (art. 27 ust. 2 ustawy o PK — zmiana od 2023)
12 miesięcy → gdy sprzedawca nie poinformował o prawie odstąpienia
```

---

## OPÓŹNIENIA LOTÓW (Rozporządzenie WE 261/2004)

```
≥3h opóźnienia przy dolocie:
  do 1500 km → 250 EUR
  1500–3500 km lub loty wewnątrz UE > 1500 km → 400 EUR
  > 3500 km → 600 EUR

Odwołanie lotu: j.w. + zwrot ceny biletu lub zmiana trasy

Wyjątek: nadzwyczajne okoliczności (burza, strajk ATC, COVID)
  — awaria techniczna NIE jest nadzwyczajną okolicznością!

Termin roszczenia: 1 rok od dnia lotu (art. 205c PrLot) — zawieszony na czas reklamacji
```

---

## GDZIE ZGŁOSIĆ

| Organ | Zakres | URL |
|---|---|---|
| UOKiK | Naruszenia zbiorowe, klauzule niedozwolone | uokik.gov.pl |
| Inspekcja Handlowa | Konkretny sklep/usługodawca | gios.gov.pl |
| Rzecznik Konsumentów (powiatowy) | BEZPŁATNA pomoc indywidualna | — |
| Rzecznik Finansowy | Banki, ubezpieczenia, finanse | rf.gov.pl |
| ODR (platforma UE) | Spory z zagranicznymi sprzedawcami online | ec.europa.eu/consumers/odr |


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?

## OUTPUT

Wynik pracy modułu:
1. Stan faktyczny;
2. Stan prawny i źródła (Dz.U. z ISAP);
3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka);
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendacja + kolejne kroki;
11. Kontrola ISAP/temporalności.

# mod-KC-ubezpieczenia

**Status:** moduł klasy kancelaryjnej — poziom DR-03

**Źródło weryfikacji:** KC art. 805–834 — Dz.U. 2025 poz. 1071 t.j. | Ustawa o ubezpieczeniach obowiązkowych — Dz.U. 2025 poz. 367 t.j.
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## FAZA 0 — INTAKE

```
□ Jaki rodzaj ubezpieczenia: OC komunikacyjne / OC ogólne / AC / majątkowe / na życie?
□ Czy zdarzenie jest objęte ochroną według polisy?
□ Data zdarzenia — czy w okresie ubezpieczenia?
□ Czy zgłoszono szkodę? Kiedy? Jaka decyzja ubezpieczyciela?
□ Czy odwołano się od decyzji?
□ Jakie jest roszczenie: odszkodowanie / zadośćuczynienie / renta?
□ Termin przedawnienia — kiedy upływa?
```

---

## UMOWA UBEZPIECZENIA — PODSTAWY (art. 805 KC)

> ⚠️ Brzmienie — weryfikuj w aktualnym KC w ISAP.

```
Obowiązki ubezpieczyciela: zapłata świadczenia (odszkodowanie / suma ubezpieczenia)
  w razie zajścia wypadku ubezpieczeniowego objętego zakresem ochrony

Obowiązki ubezpieczającego: zapłata składki

ZASADA INDEMNIZACJI: odszkodowanie nie może przekroczyć szkody (nie źródło zysku)
  → wyjątek: ubezpieczenia na życie (suma ubezpieczenia, nie odszkodowanie)
```

---

## OC KOMUNIKACYJNE — QUICK CHECK

> **Podstawa:** Ustawa o ubezpieczeniach obowiązkowych — Dz.U. 2025 poz. 367 t.j.
> ⚠️ Weryfikuj aktualne przepisy w ISAP przed każdą sprawą.

```
Ubezpieczenie obowiązkowe: każdy posiadacz pojazdu

Szkoda rzeczowa (mienie):
  Ubezpieczyciel sprawcy zobowiązany do naprawienia szkody
  Kosztorys vs faktura za naprawę — weryfikuj aktualną linię orzeczniczą SN

Szkoda osobowa (OC komunikacyjne):
  → Odszkodowanie: koszty leczenia, utracone dochody, koszty opieki
  → Zadośćuczynienie: krzywda (ból, cierpienie, trwałe następstwa)
  → Renta: gdy trwała utrata zdolności do pracy

Termin na likwidację szkody:
  → 30 dni od zgłoszenia (podstawowy)
  → 90 dni gdy wyjaśnienie okoliczności niemożliwe w 30 dni
  ⚠️ Weryfikuj aktualne terminy w ustawie o ubezpieczeniach obowiązkowych w ISAP.

Termin przedawnienia roszczeń z OC: 3 lata (od dowiedzenia się o szkodzie i sprawcy)
  lub 20 lat (gdy szkoda wynikła ze zbrodni / występku)
```

---

## ODMOWA WYPŁATY / ZANIŻONE ODSZKODOWANIE — ŚCIEŻKA

```
Decyzja odmowna / zaniżona
  ↓
Odwołanie do ubezpieczyciela (termin wskazany w decyzji lub OWU)
  ↓
Reklamacja do Rzecznika Finansowego (RF):
  https://rf.gov.pl
  ↓ brak satysfakcji
Pozew do sądu (właściwość: miejsce zamieszkania poszkodowanego lub sąd ogólny)
  LUB
Wniosek o polubowne postępowanie przy RF
```

---

## TASK FORCE — ZANIŻONE ODSZKODOWANIE ZA POJAZD

```
□ Czy ubezpieczyciel naliczył amortyzację części? → sprawdź aktualne orzecznictwo SN
  (zakaz amortyzacji — weryfikuj)
□ Czy wycena oparta na cenach z giełdy złomowej / zaniżonych?
□ Czy koszt najmu pojazdu zastępczego uwzględniony?
□ Czy pokryto koszty holowania i parkingu?
□ Kosztorys vs faktura — ubezpieczyciel musi uwzględnić faktyczny koszt naprawy
  (zasada pełnego odszkodowania — art. 361 §2 KC)
```

---

## TERMIN PRZEDAWNIENIA ROSZCZEŃ Z UBEZPIECZEŃ

| Roszczenie | Termin | Podstawa |
|---|---|---|
| Z umowy ubezpieczenia (ogólny) | 3 lata | art. 819 §1 KC — weryfikuj w ISAP |
| Z OC sprawcy (delikt) | 3 lata od wiedzy / max 10 lat | art. 4421 KC |
| Gdy szkoda ze zbrodni/występku | 20 lat | art. 4421 §2 KC |
| Bieg przedawnienia — zgłoszenie do ubezp. | Przerwa — weryfikuj art. 819 §4 KC | — |

---

## WERYFIKACJA ONLINE

```
web_search: "OC komunikacyjne ustawa ubezpieczenia obowiązkowe isap.sejm.gov.pl Dz.U. 2025 poz. 367"
web_search: "amortyzacja części OC komunikacyjne orzecznictwo SN 2025 2026"
web_search: "zadośćuczynienie wypadek komunikacyjny kryteria SN orzecznictwo"
web_search: "Rzecznik Finansowy reklamacja ubezpieczenie rf.gov.pl"
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pozew o odszkodowanie | `pisma-procesowe-v3` |
| Orzecznictwo SN ubezpieczenia | `orzeczenia-sadowe-v2` |
| Wycena szkody (dowody) | `analizator-dowodow-v3` |
| Odpowiedzialność cywilna sprawcy | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` |

---

## ŹRÓDŁA ONLINE

- KC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
- Ustawa o ubezpieczeniach obowiązkowych: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000367
- Rzecznik Finansowy: https://rf.gov.pl
- UFG (fundusz gwarancyjny): https://www.ufg.pl

---

## ACTIO DIRECTA I REGRES

```
ACTIO DIRECTA (art. 822 §4 KC):
  → Poszkodowany może pozwać ubezpieczyciela sprawcy BEZPOŚREDNIO
  → Bez konieczności pozywania sprawcy
  → Możliwe łączenie: ubezpieczyciel + sprawca jako pozwani solidarni

REGRES UBEZPIECZYCIELA (art. 43 ustawy o ubezpieczeniach obowiązkowych):
  Ubezpieczyciel po wypłacie może żądać zwrotu od sprawcy gdy:
  → Wyrządził szkodę umyślnie
  → Był w stanie po użyciu alkoholu/środków odurzających
  → Zbiegł z miejsca zdarzenia
  → Nie posiadał uprawnień do prowadzenia pojazdu
  ⚠️ Weryfikuj aktualny katalog w ustawie o ubezpieczeniach obowiązkowych w ISAP.
```

---

## AC — WYŁĄCZENIA TYPOWE

```
Typowe wyłączenia w OWU AC (weryfikuj konkretną polisę!):
  → Umyślne działanie ubezpieczonego
  → Rażące niedbalstwo (zależy od OWU — może być wyłączenie)
  → Brak ważnego badania technicznego
  → Jazda bez prawa jazdy
  → Alkohol / środki odurzające

⚠️ Klauzule AC mogą być abuzywne — weryfikuj rejestr UOKiK: rejestr.uokik.gov.pl
⚠️ Zawsze czytaj OWU łącznie z polisą — warunki szczególne mogą modyfikować OWU.
```

---

## MAPA POSTĘPOWAŃ UBEZPIECZENIOWYCH

```
1. Zgłoszenie szkody do ubezpieczyciela
   ↓ [30 dni na wypłatę lub odmowę; 90 dni max — weryfikuj w ustawie]
2. Decyzja → odmowa / zaniżenie / opóźnienie
   ↓
3. Odwołanie wewnętrzne (30 dni na odpowiedź; 60 dni — złożone sprawy)
   → Obowiązkowe przed wnioskiem do Rzecznika Finansowego
   ↓
4. Rzecznik Finansowy (rf.gov.pl) — BEZPŁATNE postępowanie interwencyjne
   → Rekomendacja RF: zakład jest nią ZWIĄZANY (może odmówić — musi uzasadnić)
   ↓
5. Pozew cywilny do sądu
   → SR do 100 000 zł / SO powyżej
```


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

---

## STRATEGIA

### Perspektywa poszkodowanego / ubezpieczonego

1. Zgłoś szkodę na piśmie z kompletną dokumentacją — od daty zgłoszenia biegnie termin ubezpieczyciela.
2. Odwołaj się wewnętrznie zanim złożysz wniosek do Rzecznika Finansowego (warunek przed RF w sporach konsumenckich).
3. Nie akceptuj propozycji wypłaty bez zastrzeżenia prawa do dochodzenia dalszych roszczeń.
4. Zbierz wszystkie dowody szkody PRZED akceptacją ugody z ubezpieczycielem.
5. Pozew: wnieść przed upływem 3-letniego terminu przedawnienia (art. 819 KC), liczył od ostatniej decyzji lub zakończenia postępowania likwidacyjnego.

### Ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Przedawnienie | 3 lata od decyzji lub zakończenia likwidacji | Pilnuj terminów; przerwij przedawnienie wezwaniem |
| Wyłączenia OWU | Klauzule wyłączające odpowiedzialność | Analiza OWU przed zawarciem polisy |
| Zaniżone odszkodowanie | Wycena ubezpieczyciela poniżej rzeczywistej szkody | Własna opinia rzeczoznawcy / biegłego |
| Brak dokumentacji | Brak dowodów na zakres szkody | Dokumentuj na bieżąco po zdarzeniu |
| Abuzywne klauzule OWU | Klauzule sprzeczne z dobrymi obyczajami | Rejestr UOKiK + art. 385¹ KC |

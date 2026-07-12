# mod-KPC-egzekucja-windykacja

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** KPC — Dz.U. 2026 poz. 468 t.j. | KSCU — Dz.U. 2024 poz. 959 t.j. | Ustawa o kosztach komorniczych (u.k.k.) — Dz.U. 2024 poz. 377 t.j. | Ustawa o komornikach sądowych — Dz.U. 2024 poz. 1458 t.j.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ Nowelizacja KPC:** Dz.U. 2025 poz. 1172 — wejście w życie 01.03.2026; weryfikuj aktualne przepisy.

---

## 1. CORE

### Zakres modułu
Windykacja polubowna, postępowanie sądowe o zapłatę (nakazowe, upominawcze, uproszczone, gospodarcze, EPU, zwykłe), klauzula wykonalności, egzekucja komornicza (wynagrodzenie, rachunek bankowy, nieruchomości, ruchomości), obrona dłużnika (skarga na czynności komornika, powództwo opozycyjne, ekscydencyjne), skarga pauliańska w kontekście egzekucji.

### Akty i źródła kontrolne

| Akt | Dz.U. |
|---|---|
| KPC | Dz.U. 2026 poz. 468 t.j. |
| KC | Dz.U. 2025 poz. 1071 t.j. ze zm. |
| KSCU | Dz.U. 2024 poz. 959 t.j. |
| Ustawa o kosztach komorniczych (u.k.k.) | Dz.U. 2024 poz. 377 t.j. |
| Ustawa o komornikach sądowych | Dz.U. 2024 poz. 1458 t.j. |

---

## 2. INTAKE

```
□ Jaki etap: windykacja polubowna / nakaz zapłaty / wyrok / egzekucja?
□ Wartość roszczenia → właściwość sądu (SR ≤ 100 000 zł / SO powyżej — weryfikuj art. 17 KPC)
□ Czy istnieje tytuł wykonawczy (wyrok / nakaz z klauzulą)?
□ Czy dłużnik ma majątek: rachunek bankowy / nieruchomość / wynagrodzenie?
□ Czy roszczenie jest przedawnione?
□ Czy zachodzi ryzyko ucieczki majątku? → zabezpieczenie (art. 730 KPC)
□ Jaki tryb: nakazowy (art. 485 KPC) / upominawczy / EPU / uproszczony / gospodarcze / zwykłe?
□ Czy dłużnik to konsument? → sąd bada przedawnienie z urzędu
```

---

## 3. PROCEDURA

### Ścieżka windykacji — schemat

```
ETAP 1 — POLUBOWNY:
  Wezwanie do zapłaty (pisemne, z terminem — praktyka min. 7–14 dni)
  ↓ brak zapłaty

ETAP 2 — SĄDOWY (uzyskanie tytułu egzekucyjnego):
  Nakaz zapłaty → prawomocny + klauzula wykonalności = tytuł wykonawczy
       LUB Wyrok sądu → prawomocny + klauzula
  ↓

ETAP 3 — EGZEKUCJA KOMORNICZA:
  Wniosek do komornika + tytuł wykonawczy → wybór sposobu egzekucji
```

### Wybór trybu postępowania — schemat decyzyjny

```
CZY masz dokumenty z art. 485 KPC?
  (dok. urzędowy, uznanie długu, zaakceptowany rachunek, weksel, czek)
  TAK → NAKAZOWE (najszybsze zabezpieczenie, ¼ opłaty; nakaz = tytuł zabezpieczenia od razu)
  NIE ↓

CZY obie strony to przedsiębiorcy (B2B)?
  TAK → GOSPODARCZE (art. 458¹ KPC; prekluzja dowodowa, rygory formalne)
  NIE ↓

CZY wartość sporu ≤ 20 000 zł i prosta umowa?
  TAK → UPROSZCZONE (rygory formalne; ograniczone zmiany powództwa)
  NIE ↓

CZY roszczenie pieniężne, dłużnik w Polsce, max 3-letnie?
  TAK → EPU (e-sąd Lublin; najniższa opłata 1,25%; ryzyko: sprzeciw → SR)
  NIE ↓

→ ZWYKŁE PROCESOWE (fallback)
```

### Tryby — szczegółowe warunki i zaskarżenie

| Tryb | Warunki | Środek dłużnika | Termin | Skutek |
|---|---|---|---|---|
| Nakazowy (art. 485 KPC) | Dokumenty z art. 485 §1–2 | **Zarzuty** | 2 tygodnie od doręczenia | Sprawa na rozprawę; nakaz nie traci mocy automatycznie |
| Upominawczy | Roszczenie pieniężne, niebudzące wątpliwości | **Sprzeciw** | 2 tygodnie od doręczenia | Nakaz traci moc; sprawa do trybu zwykłego |
| EPU | Roszczenie pieniężne, nie przedawnione | **Sprzeciw** | 2 tygodnie od doręczenia | Nakaz traci moc; przekazanie do SR właściwości ogólnej dłużnika |

> ⚠️ Terminy ZAWITE — niedotrzymanie = utrata prawa do zaskarżenia. Weryfikuj art. 491–505 KPC w ISAP.

### Elementy wezwania do zapłaty

```
Obligatoryjne:
  1. Oznaczenie wierzyciela i dłużnika (NIP/PESEL)
  2. Precyzyjne roszczenie: kwota główna + odsetki (rodzaj, od kiedy) + podstawa
  3. Termin zapłaty (min. 7 dni — praktyka; brak wymogu ustawowego)
  4. Rachunek bankowy wierzyciela
  5. Informacja o konsekwencjach braku zapłaty
  6. Data i podpis

Forma i doręczenie:
  → Pisemna (zalecana — dowód doręczenia)
  → List polecony za potwierdzeniem odbioru
```

---

## 4. TYTUŁ WYKONAWCZY I KLAUZULA WYKONALNOŚCI

```
Tytuł wykonawczy = tytuł egzekucyjny + klauzula wykonalności (art. 776 KPC)

Wniosek o klauzulę (art. 781 KPC):
  → Sąd I instancji, w którym sprawa się toczyła
  → Opłata: 50 zł (art. 71 ust. 1 KSCU — weryfikuj aktualną kwotę)
  → Zażalenie na postanowienie o klauzuli: 7 dni od doręczenia (art. 795 KPC)

Klauzula na małżonka dłużnika (art. 787 KPC):
  → Wierzyciel wykazuje dokumentem, że zobowiązanie powstało za zgodą małżonka
    LUB z czynności prawnej małżonka
  → Odpowiedzialność ograniczona do majątku wspólnego

Notarialny tytuł egzekucyjny (art. 777 §1 pkt 5–6 KPC):
  → Dłużnik poddaje się egzekucji wprost w akcie notarialnym
  → Błyskawiczne uzyskanie tytułu bez procesu sądowego
  → Ryzyko: powództwo opozycyjne dłużnika
```

---

## 5. ZABEZPIECZENIE ROSZCZENIA (art. 730 KPC)

```
Kiedy: w każdym czasie — przed wszczęciem lub w toku postępowania

Warunki łączne:
  □ Uprawdopodobnienie roszczenia (nie pełny dowód — tylko uwiarygodnienie)
  □ Interes prawny w udzieleniu zabezpieczenia

Formy zabezpieczenia roszczeń pieniężnych:
  → Zajęcie rachunku bankowego
  → Zakaz zbywania lub obciążania nieruchomości (wpis ostrzeżenia do KW)
  → Zajęcie wynagrodzenia za pracę
  → Zakaz zbywania praw lub ruchomości

Termin na wniesienie pozwu po udzieleniu zabezpieczenia: 2 tygodnie (art. 733 KPC)
  → Po upływie: zabezpieczenie upada

⚠️ Weryfikuj art. 730–757 KPC w ISAP.
```

---

## 6. POSTĘPOWANIE EGZEKUCYJNE

### Wszczęcie egzekucji

```
Wniosek do komornika (art. 797 KPC):
  □ Pisemny + tytuł wykonawczy (oryginał)
  □ Wskazanie sposobu egzekucji i składników majątkowych
  □ Dane identyfikacyjne dłużnika (PESEL / KRS / NIP)

Wybór komornika (art. 10 u.k.s.):
  → Zasada rewiru: komornik właściwy wg miejsca zamieszkania/siedziby dłużnika
  → Wierzyciel może wybrać innego komornika (pisemne oświadczenie o wyborze)
  → WYJĄTEK: egzekucja z nieruchomości → wyłącznie komornik rewiru

Zawiadomienie dłużnika (art. 805 KPC):
  → Komornik doręcza odpis wniosku wierzyciela
  → Wzywa do zapłaty w terminie 7 dni od doręczenia
```

### Sposoby egzekucji — szczegóły

```
Z RACHUNKU BANKOWEGO (art. 889–902 KPC):
  → Zawiadomienie banku → natychmiastowe zajęcie środków
  → Zwolnienie kwoty wolnej: minimalne wynagrodzenie za pracę
    (weryfikuj aktualną kwotę w aktach wykonawczych)

Z WYNAGRODZENIA ZA PRACĘ (art. 880–888 KPC):
  → Zawiadomienie pracodawcy
  → Limity zajęcia:
    Max ½ wynagrodzenia (pozostałe należności)
    Max 3/5 wynagrodzenia (alimenty)
  → Kwota wolna = minimalne wynagrodzenie za pracę (weryfikuj aktualnie)

Z RUCHOMOŚCI (art. 844–879 KPC):
  → Zajęcie przez komornika, opis i szacowanie, sprzedaż
  → Dłużnik może wskazać składniki, z których żąda egzekucji

Z NIERUCHOMOŚCI (art. 921–1013 KPC):
  → Najdłuższa forma egzekucji
  → Wpis w KW o wszczęciu → opis i oszacowanie (rzeczoznawca)
  → Licytacja I: cena wywołania = ¾ wartości oszacowania
  → Licytacja II: cena wywołania = ⅔ wartości oszacowania
  → Podział sumy: kolejność z art. 1025 KPC — weryfikuj w ISAP

Z WIERZYTELNOŚCI (art. 895–912 KPC):
  → Zajęcie wierzytelności u dłużnika dłużnika
  → Zakaz spełniania świadczenia bezpośrednio przez dłużnika
```

### Koszty egzekucji (u.k.k. — Dz.U. 2024 poz. 377)

> ⚠️ Weryfikuj aktualne stawki w u.k.k. w ISAP.

```
Opłata egzekucyjna (od dłużnika):
  → 10% wyegzekwowanego świadczenia (art. 27 §1 u.k.k.)
  → 3% jeśli dłużnik sam zapłacił w ciągu 1 miesiąca od zawiadomienia (art. 27 §2)
  → Min. 150 zł, max 50 000 zł (weryfikuj aktualne progi w u.k.k.)

Wniosek o obniżenie opłaty (art. 48 u.k.k.):
  → Termin: 7 dni od czynności
  → Przesłanki: szczególne okoliczności, nakład pracy komornika, sytuacja dłużnika
```

---

## 7. OBRONA DŁUŻNIKA

### Skarga na czynności komornika (art. 767 KPC)

```
Uprawniony: dłużnik, wierzyciel, osoba trzecia której prawa naruszono
Przedmiot: czynność komornika naruszająca przepisy postępowania
           ALBO zaniechanie dokonania czynności

Termin: 7 dni od dowiedzenia się o czynności
        Zaniechanie: brak terminu zawitego

Sąd: SR przy którym działa komornik
Opłata: 50 zł (weryfikuj aktualny art. 25 KSCU)

⚠️ Skarga NIE służy do kwestionowania zasadności egzekucji
   ani treści wyroku → do tego: powództwo opozycyjne
```

### Powództwo opozycyjne (art. 840 KPC)

```
Podstawy (art. 840 §1 pkt 1):
  → Zdarzenie niweczące obowiązek po zamknięciu rozprawy:
    - spłata (całkowita lub częściowa)
    - przedawnienie egzekwowanego roszczenia
    - potrącenie wierzytelności wzajemnej
    - zwolnienie z długu
    - niemożliwość świadczenia
    - cofnięcie, unieważnienie, uchylenie tytułu

Sąd właściwy: SR / SO właściwy dla dłużnika (pozwanym jest wierzyciel)
Wniosek o zawieszenie egzekucji: art. 820 KPC — złożyć razem z pozwem

Czego NIE można: ponownie badać wyroku co do meritum
```

### Powództwo ekscydencyjne (art. 841 KPC)

```
Uprawniony: osoba trzecia, której prawa naruszono przez egzekucję
Cel: wyłączenie spod egzekucji składnika majątku
Termin: 1 miesiąc od dowiedzenia się o naruszeniu prawa (ZAWITY)
Sąd: SR / SO wg wartości sporu
```

---

## 8. UGODA I MEDIACJA

```
Mediacja (art. 183¹ i n. KPC):
  → Możliwa przed wszczęciem i w toku postępowania sądowego
  → Ugoda przed mediatorem = tytuł egzekucyjny po zatwierdzeniu przez sąd
    (art. 777 §1 pkt 4 KPC)
  → Ugoda sądowa = tytuł egzekucyjny bez klauzuli (art. 777 §1 pkt 3 KPC)
  → Ugoda pozasądowa = zwykła umowa — NIE jest tytułem egzekucyjnym
```

---

## 9. KOSZTY SĄDOWE (KSCU — Dz.U. 2024 poz. 959)

> ⚠️ Weryfikuj aktualne stawki w KSCU w ISAP.

| Tryb | Opłata |
|---|---|
| Tryb nakazowy | ¼ opłaty stosunkowej (5% wartości sporu) |
| Tryb upominawczy / zwykły | 5% wartości sporu |
| EPU | 1,25% wartości sporu |
| Uproszczony | Stała (zależy od progu wartości) — weryfikuj w KSCU |
| Klauzula wykonalności | 50 zł |
| Skarga na komornika | 50 zł |

---

## 10. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Istnienie długu | Umowa, faktura, wyciąg bankowy | strony | wysoka | brak umowy pisemnej | zeznania + e-maile |
| Doręczenie wezwania | Potwierdzenie odbioru, zwrotka | poczta | wysoka | odmowa odbioru | awizo = doręczenie |
| Brak zapłaty | Wyciąg bankowy / oświadczenie | bank | wysoka | wpłata gotówkowa | świadkowie |
| Majątek dłużnika | KRS, KW, ZUS, US | rejestry | wysoka | ukryty majątek | skarga pauliańska |
| Spłata (obrona) | Potwierdzenie przelewu | bank | wysoka | — | zarzut potrącenia |

---

## 11. STRATEGIA

### Perspektywa wierzyciela

1. Wybierz optymalny tryb postępowania (schemat decyzyjny powyżej).
2. Sprawdź majątek dłużnika przed wniesieniem pozwu (KRS, KW, adresy).
3. Rozważ zabezpieczenie jeśli ryzyko ucieczki majątku.
4. Złóż wniosek egzekucyjny jednocześnie z kilkoma sposobami egzekucji.
5. Przy braku majątku → rozważ skargę pauliańską lub odpowiedzialność zarządu (art. 299 KSH).

### Perspektywa dłużnika

1. Sprawdź przedawnienie — zarzut kończy egzekucję.
2. Zapłać w ciągu 1 miesiąca od zawiadomienia → niższa opłata komornicza (3% zamiast 10%).
3. Kwestionuj podstawy tytułu → powództwo opozycyjne (nie skarga na komornika).
4. Wskaż majątek do egzekucji (zamiast nieruchomości wskaż wynagrodzenie).

---

## 12. QUALITY GATE

- [ ] Termin przedawnienia roszczenia sprawdzony?
- [ ] Właściwy tryb postępowania dobrany (nakazowy / upominawczy / EPU / zwykłe)?
- [ ] Opłaty sądowe obliczone (KSCU zweryfikowane w ISAP)?
- [ ] Dłużnik ma majątek — zidentyfikowany przed wszczęciem?
- [ ] Zabezpieczenie roszczeń rozważone?
- [ ] Nowelizacja KPC z 01.03.2026 uwzględniona?

---

## 13. OUTPUT

1. Stan faktyczny; 2. Kwalifikacja trybu; 3. Stan prawny (Dz.U. z ISAP); 4. Terminy (przedawnienie, termin do wniesienia środka); 5. Matryca dowodowa; 6. Analiza ryzyk; 7. Strategia; 8. Koszty (sądowe + komornicze); 9. Rekomendacja; 10. Kontrola ISAP/temporalności.

---

## ŹRÓDŁA ONLINE

- KPC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000468
- KSCU: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000959
- u.k.k.: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000377
- Ustawa o komornikach: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001458
- EPU (e-sąd): https://www.e-sad.gov.pl
- Licytacje komornicze: https://licytacje.komornik.pl
- NBP (stopa referencyjna): https://nbp.pl

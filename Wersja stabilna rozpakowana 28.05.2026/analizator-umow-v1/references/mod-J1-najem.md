# MODUŁ J1 — NAJEM MIESZKANIOWY I KOMERCYJNY
## Analizator Umów v2 · Moduł J1

> Wczytaj dla: najem mieszkaniowy (lokator–właściciel), najem komercyjny (biuro,
> lokal usługowy, magazyn), najem okazjonalny, instytucjonalny.

---
## J.2 NAJEM MIESZKANIOWY

**Podstawa prawna do weryfikacji:**
```
isap.sejm.gov.pl → ustawa z 21.06.2001 o ochronie praw lokatorów (OPL)
isap.sejm.gov.pl → KC → art. 659–692 (najem)
isap.sejm.gov.pl → ustawa o najmie okazjonalnym i instytucjonalnym (jeśli dotyczy)
```

### Pułapki dla Najemcy:

**NM-1 — Kaucja bez górnego limitu (HIGH RISK)**
```
PRAWO: OPL art. 6 ust. 1 → kaucja max 6-krotność miesięcznego czynszu
PUŁAPKA: "kaucja w wysokości X" bez wskazania co wchodzi w kaucję
  → Wynajmujący potrąca kaucję za "normalne zużycie" (niedopuszczalne)
  → Normalne zużycie mieszkania NIE obciąża najemcy (OPL art. 6d)
WERYFIKUJ: isap.sejm.gov.pl → OPL → art. 6 (aktualne brzmienie!)

REKOMENDACJA:
  „§X. Kaucja w wysokości [X] zł (max 6-krotność czynszu) zostanie zwrócona
  w terminie 30 dni od opróżnienia lokalu, po potrąceniu jedynie udokumentowanych
  szkód wykraczających poza normalne zużycie odpowiadające sposobowi korzystania
  z lokalu (art. 6d ustawy o ochronie praw lokatorów).
  Na żądanie Najemcy Wynajmujący przedstawi szczegółowe rozliczenie kaucji."
```

**NM-2 — Wypowiedzenie bez zachowania ustawowych przesłanek (CRITICAL)**
```
PRAWO: OPL art. 11 → Wynajmujący może wypowiedzieć TYLKO z przyczyn ustawowych:
  (1) zaległości czynszowe ≥ 3 miesiące (po wezwaniu z 1-miesięcznym terminem)
  (2) używanie sprzecznie z umową / niszczenie (po wezwaniu)
  (3) sublokator bez zgody (po wezwaniu)
  (4) własna potrzeba mieszkaniowa (min. 6-miesięczne wypowiedzenie + lokal zamienny)

PUŁAPKA: "Wynajmujący może wypowiedzieć umowę z 3-miesięcznym wyprzedzeniem bez podania przyczyny"
  → NIEWAŻNE — OPL jest bezwzględnie wiążąca, strony nie mogą ograniczyć ochrony najemcy

PUŁAPKA 2: Umowa na czas określony → OPL nie pozwala na wypowiedzenie POZA przyczynami z art. 11
  → Musi trwać do końca lub wypowiedziana w trybie OPL

REKOMENDACJA DLA NAJEMCY:
  → Nie podpisuj umowy zawierającej szersze podstawy wypowiedzenia niż OPL art. 11
  → Żądaj wskazania konkretnej podstawy przy każdym wypowiedzeniu
```

**NM-3 — Protokół zdawczo-odbiorczy pominięty (MEDIUM RISK)**
```
PROBLEM: Brak szczegółowego protokołu = brak dowodu stanu początkowego
  → Wynajmujący żąda naprawy uszkodzeń sprzed wynajmu
  → Spór o kaucję bez możliwości udowodnienia stanu wyjściowego

REKOMENDACJA:
  „§X. W dniu wydania lokalu Strony sporządzą Protokół Zdawczo-Odbiorczy zawierający:
  (a) dokładny opis stanu technicznego każdego pomieszczenia;
  (b) wykaz wyposażenia z opisem stanu;
  (c) zdjęcia lub nagranie wideo wszystkich pomieszczeń;
  (d) stan liczników mediów.
  Protokół stanowi Załącznik nr [1] i jest jedyną podstawą oceny stanu
  lokalu przy zwrocie kaucji. W razie nieobecności którejś ze Stron
  przy zdaniu lokalu — Strona ta sporządzi protokół jednostronny
  z powiadomieniem drugiej Strony na [7] dni wcześniej."
```

**NM-4 — Najem okazjonalny — pułapki formalne (HIGH RISK)**
```
PRAWO: ustawa o ochronie praw lokatorów → najem okazjonalny:
  Wymogi: (1) właściciel = osoba fizyczna, (2) lokal mieszkalny,
          (3) oświadczenie najemcy o dobrowolnym poddaniu się egzekucji (akt notarialny)
          (4) wskazanie lokalu do zamieszkania po zakończeniu najmu
          (5) zgłoszenie do US w terminie 14 dni od zawarcia

PUŁAPKA: Brak zgłoszenia do US → umowa traktowana jak zwykły najem (pełna ochrona OPL)
PUŁAPKA: Oświadczenie notarialne złożone po zawarciu umowy → wątpliwa skuteczność
PUŁAPKA: "Lokal zastępczy" nie istnieje lub jest niedostępny → egzekucja niemożliwa

REKOMENDACJA DLA WYNAJMUJĄCEGO:
  → Wszystkie formalności PRZED wydaniem lokalu, nie po
  → Zgłoszenie do US z potwierdzeniem odbioru
  → Aktualizacja lokalu zastępczego jeśli najemca zmienia adres
```

---

## J.3 NAJEM KOMERCYJNY (biuro, lokal, magazyn)

**Podstawa: KC art. 659–692 (brak ochrony OPL w B2B)**

### Pułapki:

**NK-1 — Waloryzacja czynszu w euro lub indeksem bez limitu (HIGH RISK)**
```
PUŁAPKA: Czynsz nominowany w EUR płatny w PLN wg kursu NBP na dzień płatności
  → Kurs EUR/PLN może wzrosnąć 20–30% → realne zwiększenie kosztów
  → Bez limitu waloryzacji = nieograniczone ryzyko walutowe

REKOMENDACJA:
  „§X. Czynsz nominowany w EUR przeliczany będzie na PLN według kursu
  średniego NBP z dnia wystawienia faktury. Całkowita waloryzacja czynszu
  w żadnym roku nie może przekroczyć [HICP UE / CPI GUS + 2]%.
  W przypadku przekroczenia limitu — Najemca ma prawo do renegocjacji czynszu."
```

**NK-2 — Klauzula break option tylko dla Wynajmującego (CRITICAL)**
```
PROBLEM: Długoterminowa umowa (5+ lat), prawo wcześniejszego wyjścia tylko po jednej stronie
  → Najemca "przyspawany" na 5 lat; Wynajmujący może wyjść za 6 miesięcy
  → Dotyczy zwłaszcza relokacji firmy lub zmiany właściciela nieruchomości

REKOMENDACJA:
  „§X. Każda ze Stron może rozwiązać Umowę przed upływem okresu jej trwania
  (break option) po upływie [2] lat od daty wejścia w posiadanie, z zachowaniem
  [6]-miesięcznego okresu wypowiedzenia, pod warunkiem pisemnego powiadomienia.
  Skorzystanie przez Wynajmującego z break option uprawnia Najemcę do odszkodowania
  równego [3-krotności] miesięcznego czynszu za koszty relokacji."
```

**NK-3 — Fit-out / nakłady na lokal bez prawa do zwrotu (HIGH RISK)**
```
PROBLEM: Najemca wydaje 200 000 zł na adaptację lokalu
  Wynajmujący może wypowiedzieć umowę po 2 latach → nakłady przepadają
  lub: Wynajmujący żąda "przywrócenia stanu pierwotnego" = dodatkowy koszt

REKOMENDACJA:
  „§X. Nakłady Najemcy na adaptację lokalu (fit-out) przekraczające łącznie
  [X] zł netto zostaną Najemcy zwrócone proporcjonalnie:
  - rozwiązanie przez Wynajmującego → zwrot 100% niezamortyzowanych nakładów;
  - rozwiązanie przez Najemcę → zwrot 50% niezamortyzowanych nakładów;
  Amortyzacja = [5] lat od daty wykonania. Wynajmujący nie może żądać
  przywrócenia stanu pierwotnego jeśli Najemca wyda pisemną zgodę na adaptację."
```

---

---
*← Powrót do routingu: `view references/mod-J0-routing.md`*

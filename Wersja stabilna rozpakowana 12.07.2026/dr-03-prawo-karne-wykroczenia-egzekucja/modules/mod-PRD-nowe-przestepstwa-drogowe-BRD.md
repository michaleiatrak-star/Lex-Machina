# mod-PRD-nowe-przestepstwa-drogowe-BRD

**Status:** moduł uzupełniający do `mod-PRD-prawo-jazdy-punkty-karne.md`
**Wydzielony:** 2026-06-14 (audyt — moduł nadrzędny >400 linii, podział tematyczny)
**Źródła weryfikacji (WERYFIKUJ ZAWSZE W ISAP PRZED POWOŁANIEM):**

| Akt | Dz.U. | Status | Uwaga |
|---|---|---|---|
| Ustawa o poprawie BRD (BRD II) | Dz.U. 2025 poz. 1872 | W życie 29.01.2026 (cz. od 30.03.2026, 03.06.2026) | Nielegalne wyścigi, drift, brawurowa jazda — KK i KW |
| Ustawa o zmianie PRD (BRD I) | Dz.U. 2025 poz. 1676 | W życie od 01.2026 (różne daty) | Prawo jazdy od 17 lat |
| KK (art. 178a, 180a, 115 §26) | Dz.U. 2025 poz. 383 ze zm. | ze zm.: Dz.U. 2025 poz. 1872 | Nowe przestępstwa drogowe od 29.01.2026 |
| KW (art. 86c — drift, wyścigi) | Dz.U. 2025 poz. 734 t.j. ze zm. | ze zm.: Dz.U. 2025 poz. 1872 | Nowe art. 86c od 29.01.2026 |

```
⛔ HARD GATE: Kary, kwoty grzywien i daty wejścia w życie ZMIENIAJĄ SIĘ.
Przed każdym powołaniem:
  web_search: "brawurowa jazda art KK 2026 przesłanki kara"
  web_search: "nielegalne wyścigi art 115 §26 KK 2026"
  web_search: "drift art 86c KW 2026"
  isap.sejm.gov.pl → aktualne t.j.
```

---

## Zakres modułu

Moduł główny (`mod-PRD-prawo-jazdy-punkty-karne.md`) pokrywa: punkty karne,
limity, taryfikator, zatrzymanie pj przez policję/starostę, cofnięcie uprawnień
(art. 102–103 u.k.p.), INTAKE.

Ten moduł pokrywa **trzy zagadnienia z ustawy BRD II i BRD I** dotyczące nowych
typów odpowiedzialności i uprawnień, wprowadzonych etapowo od 29.01.2026:

1. Sądowy zakaz prowadzenia pojazdów (art. 42 KK / art. 29 KW) — w tym nowe
   przepadek pojazdu i dożywotni zakaz (BRD II)
2. Nowe przestępstwa drogowe — brawurowa jazda, nielegalne wyścigi, drift (art. 86c KW)
3. Prawo jazdy od 17 lat (BRD I, od 03.03.2026)

---

## ⚡ ALERT — BRD II (Dz.U. 2025 poz. 1872) — w życie 29.01.2026 i 30.03.2026

```
OD 29.01.2026 — NOWE PRZESTĘPSTWA KK i WYKROCZENIA KW:
  → Nielegalne wyścigi pojazdów — definicja legalna (art. 115 §26 KK):
    "rywalizacja co najmniej dwóch kierujących bez zezwolenia, w celu jak najszybszego
     pokonania odcinka drogi, obejmująca celowy drift oraz jazdę na jednym kole
     podczas zorganizowanych spotkań"
  → Brawurowa jazda — NOWE PRZESTĘPSTWO KK:
    Trzy przesłanki łącznie: rażące przekroczenie prędkości + naruszenie innych zasad BRD
    + stworzenie realnego zagrożenia dla innych uczestników ruchu
    Kara: pozbawienie wolności 3 mies. – 5 lat; do 10 lat jeśli ciężki uszczerbek/śmierć
    KLUCZOWE: brak wypadku NIE wyklucza odpowiedzialności karnej
  → Art. 86c KW (NOWY) — celowe driftowanie:
    "Celowe wprowadzenie pojazdu w poślizg lub utrata styczności choćby jednego koła
     z nawierzchnią" na drodze publicznej, strefie ruchu/zamieszkania
    → Grzywna min. 1 500 zł
  → Organizowanie nielegalnych spotkań motoryzacyjnych (≥10 pojazdów bez zgłoszenia):
    → Grzywna do 2 000 zł dla organizatora I uczestników
  → Przygotowanie do wyścigu (blokowanie drogi, organizacja infrastruktury):
    → Kara do 3 lat pozbawienia wolności — nawet bez przeprowadzenia wyścigu
  → Obligatoryjny przepadek pojazdu: gdy alkohol ≥ 1,5‰ (art. 178a KK)
    Alternatywa gdy niemożliwy (leasing, współwłasność): nawiązka 5 000–500 000 zł
  → Dożywotni zakaz prowadzenia pojazdów: recydywiści jeżdżący mimo zakazu

OD 30.03.2026 — ZATRZYMANIE PJ:
  → Administracyjne zatrzymanie PJ na 3 miesiące za drift/wyścig/jazdę na jednym kole
    (niezależnie od tego czy doszło do wypadku)
  → Weryfikuj: web_search "zatrzymanie prawa jazdy drift 2026 art 135 PRD"
```

---

## 1. SĄDOWY ZAKAZ PROWADZENIA POJAZDÓW

```
PODSTAWY (bez zmian systemowych):
  Art. 42 KK — środek karny (sprawy karne)
  Art. 29 KW — środek karny (sprawy o wykroczenia)

NOWE PRZEPISY OD 29.01.2026 (Dz.U. 2025 poz. 1872):
  → DOŻYWOTNI zakaz: recydywista łamiący zakaz prowadzenia pojazdów (art. 42 §4 KK — weryfikuj)
  → Obligatoryjny PRZEPADEK POJAZDU (≥1,5‰): art. 44a §1 KK (nowy) — weryfikuj
    lub nawiązka 5 000–500 000 zł gdy przepadek niemożliwy

SKRÓCENIE ZAKAZU (art. 84 KK):
  → Po połowie okresu (min. 1 rok), na wniosek skazanego
  → Warunki: przestrzeganie zakazu, naprawa szkody
  → Korekta dla zawodowych kierowców (art. 182a KKW): zmiana na zakaz określonych pojazdów

OBLICZANIE OKRESU:
  → Czas od uprawomocnienia wyroku lub od zwolnienia z więzienia
  → Zaliczenie zatrzymania pj (art. 63 §2 KK — weryfikuj aktualne brzmienie)
```

---

## 2. NOWE PRZESTĘPSTWA DROGOWE (od 29.01.2026)

```
Ustawa z 04.12.2025 r. (Dz.U. 2025 poz. 1872) — weryfikuj: isap.sejm.gov.pl

BRAWUROWA JAZDA (nowe przestępstwo KK):
  Przesłanki ŁĄCZNIE:
    1. Rażące przekroczenie prędkości
    2. Naruszenie innych zasad BRD
    3. Stworzenie realnego zagrożenia dla innych uczestników ruchu
  Kara: 3 miesiące–5 lat pozbawienia wolności
  Kwalifikowana (ciężki uszczerbek/śmierć): do 10 lat
  KLUCZOWE: BRAK wypadku = NIE wyklucza odpowiedzialności karnej
  → Weryfikuj: web_search "brawurowa jazda art KK Dz.U. 2025 poz. 1872 przesłanki"

NIELEGALNE WYŚCIGI (art. 115 §26 KK — definicja):
  → Rywalizacja ≥2 kierujących bez zezwolenia + cel pokonania odcinka jak najszybciej
  → Obejmuje: celowy drift + jazdę na jednym kole podczas zorganizowanych spotkań
  → Przygotowanie (blokowanie drogi, infrastruktura): do 3 lat, nawet bez wyścigu

DRIFT I CELOWY POŚLIZG (art. 86c KW — nowy):
  → "Celowe wprowadzenie pojazdu w poślizg lub utrata styczności ≥1 koła z nawierzchnią"
  → Na drodze publicznej, strefie ruchu/zamieszkania
  → Kara: grzywna min. 1 500 zł + od 30.03.2026: zatrzymanie pj 3 miesiące

SPOTY I ZLOTY BEZ ZGŁOSZENIA (≥10 pojazdów):
  → Obowiązek zgłoszenia organowi gminy
  → Brak zgłoszenia: grzywna do 2 000 zł (organizator I uczestnicy)

OBLIGATORYJNY PRZEPADEK POJAZDU:
  → Alkohol ≥1,5‰: sąd orzeka przepadek OBOWIĄZKOWO
  → Niemożność przepadku: nawiązka 5 000–500 000 zł
  → Weryfikuj art. KKW dotyczące wykonania

ZAKAZ DOŻYWOTNI:
  → Recydywista łamiący zakaz prowadzenia: dożywotni zakaz
  → Weryfikuj: web_search "dożywotni zakaz prowadzenia recydywa 2026 art KK"
```

---

## 3. PRAWO JAZDY OD 17 LAT (od 03.03.2026)

```
Podstawa: Dz.U. 2025 poz. 1676 (weryfikuj: isap.sejm.gov.pl)

KTO MOŻE:
  → Kurs: od 3 miesięcy przed ukończeniem 17 lat
  → Egzamin: po ukończeniu 17 lat
  → Wymagana: pisemna zgoda rodzica lub opiekuna prawnego

OGRANICZENIA (przez pierwsze 6 mies. lub do 18 r.ż. — co nastąpi później):
  → Jazda WYŁĄCZNIE z osobą towarzyszącą:
    • ukończone 25 lat
    • co najmniej 5-letni staż pj kat. B
    • brak zakazu prowadzenia pojazdów
    • pełna trzeźwość
  → Naruszenie: poważne konsekwencje dla okresu próbnego

OKRES PRÓBNY DLA pj OD 17 LAT:
  → 3 lata lub do ukończenia 20. roku życia (co nastąpi później)
  → Bezwzględne 0,0‰ alkoholu przez cały okres próbny
  → Limit 20 pkt (jak nowicjusz)

PEŁNE PRAWO JAZDY:
  → Do wyjazdów zagranicznych: nadal plastikowy dokument
  → W Polsce od 03.03.2026: mObywatel = pełnoprawne prawo jazdy
```

---

## STRATEGIA I LINIE OBRONY (specyficzne dla tego modułu)

```
OD MANDATU ZA DRIFT/WYŚCIG (nowe od 29.01.2026):
  1. Brak znamion art. 86c KW — "niezamierzone wprowadzenie w poślizg" vs. "celowe"
  2. Droga niepubliczna — art. 86c stosuje się tylko na drodze publicznej
  3. Błędy proceduralne mandatu
  4. Odmowa mandatu → wyrok nakazowy → sprzeciw → rozprawa

OD ZAKAZU SĄDOWEGO:
  1. Warunkowe umorzenie (art. 66 KK / art. 39 KW) → brak zakazu
  2. Skrócenie (art. 84 KK) po połowie okresu na wniosek
  3. Art. 182a KKW — zmiana wykonywania zakazu dla zawodowych kierowców

BRAWUROWA JAZDA (nowe):
  1. Kwestionowanie "rażącego" przekroczenia (interpretacja — próg nieostry)
  2. Brak spełnienia WSZYSTKICH trzech przesłanek łącznie
  3. Brak "realnego zagrożenia" — czy inne pojazdy faktycznie były zagrożone?
```

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Punkty karne, limity, taryfikator, zatrzymanie pj | `mod-PRD-prawo-jazdy-punkty-karne.md` |
| Alkohol >0,5‰ → art. 178a KK | `mod-KK-KPK-framework-karne` |
| Drift → art. 86c KW (taryfikator wykroczeń) | `mod-KW-KPW-framework-szczegolowy` |
| Wypadek drogowy → odszkodowanie | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` |
| Zakaz → skrócenie (art. 84 KK) | `mod-KKW-kodeks-karny-wykonawczy` |

---

## ŹRÓDŁA ONLINE (weryfikuj przed każdym powołaniem)

```
Ustawa BRD I: isap.sejm.gov.pl → WDU20250001676
Ustawa BRD II: isap.sejm.gov.pl → WDU20251001872

web_search (generuj zawsze przed podaniem konkretnych wartości):
  "brawurowa jazda art KK 2026 przesłanki kara"
  "nielegalne wyścigi art 115 §26 KK 2026"
  "drift art 86c KW 2026"
  "prawo jazdy od 17 lat 2026 warunki"
  "przepadek pojazdu alkohol 2026 art KK"
  "dożywotni zakaz prowadzenia recydywa 2026 art KK"
```

---

## ⚖️ DISCLAIMER

Po zakończeniu analizy: `view /mnt/skills/user/shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).

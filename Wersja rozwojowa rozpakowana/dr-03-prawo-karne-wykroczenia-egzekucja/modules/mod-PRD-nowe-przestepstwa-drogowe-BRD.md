# mod-PRD-nowe-przestepstwa-drogowe-BRD

**Status:** moduł uzupełniający do `mod-PRD-prawo-jazdy-punkty-karne.md`
**Wydzielony:** 2026-06-14 (audyt — moduł nadrzędny >400 linii, podział tematyczny)
**Źródła weryfikacji (WERYFIKUJ ZAWSZE W ISAP PRZED POWOŁANIEM):**

| Akt | Dz.U. | Status | Uwaga |
|---|---|---|---|
| Ustawa o poprawie BRD (BRD II) | Dz.U. 2025 poz. 1872 | W życie 29.01.2026; art. 4 pkt 1, 3, 4 (PRD art. 60 ust. 5, 135, 135a) i art. 6 (u.k.p. art. 102) od 30.03.2026 (art. 9) ✅ [VER: ELI DU/2025/1872 text.pdf, RZĄD 1, 2026-10-20]; ⛔ KOREKTA: data „03.06.2026” nie pochodzi z tej ustawy | Nielegalne wyścigi, drift, brawurowa jazda — KK i KW |
| Ustawa o zmianie PRD (BRD I) | Dz.U. 2025 poz. 1676 | W życie od 01.2026 (różne daty) | Prawo jazdy od 17 lat |
| KK (art. 42, 43a, 44b, 69 §4, 115 §26, 177 §2a, 178, 178c, 178d) | Dz.U. 2026 poz. 1342 t.j. | t.j. obejmuje Dz.U. 2025 poz. 1872; brak zmian po t.j. | Nowe przestępstwa drogowe od 29.01.2026; brzmienie poniżej z t.j. ✅ [VER: ELI DU/2026/1342 text.pdf (t.j. KK), RZĄD 1, 2026-10-20] |
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
OD 29.01.2026 — NOWE PRZESTĘPSTWA KK i WYKROCZENIA KW (brzmienie KK z t.j. 1342):
  → Nielegalny wyścig pojazdów mechanicznych — definicja legalna (art. 115 §26 KK):
    1) rywalizacja kierujących co najmniej dwoma pojazdami mechanicznymi w ruchu lądowym,
       w szczególności z zamiarem pokonania odcinka drogi w jak najkrótszym czasie,
       z naruszeniem zasad bezpieczeństwa w ruchu lądowym, LUB
    2) celowe wprowadzenie pojazdu mechanicznego w poślizg lub celowe doprowadzenie do utraty
       styczności z nawierzchnią chociażby jednego z kół, wykonane w trakcie spotkania
       zorganizowanego na otwartej lub ogólnodostępnej przestrzeni
    – odbywające się bez wymaganego zezwolenia.
  → Art. 178c §1 KK: organizowanie lub prowadzenie nielegalnego wyścigu (pkt 1) albo udział
    w nim jako prowadzący pojazd mechaniczny (pkt 2) — 3 mies. do 5 lat; §2: przygotowania
    do przestępstwa z §1 — do 3 lat (bez przeprowadzenia wyścigu).
  → Art. 178d KK („brawurowa jazda”): prowadzenie pojazdu mechanicznego z RAŻĄCYM
    przekroczeniem prędkości ORAZ rażącym naruszeniem innych zasad bezpieczeństwa w ruchu
    lądowym, przez co sprawca NARAŻA CZŁOWIEKA na bezpośrednie niebezpieczeństwo utraty
    życia albo skutku z art. 156 §1 lub 157 §1 — 3 mies. do 5 lat. Wypadek nie jest
    znamieniem (przestępstwo z narażenia).
  → Art. 177 §2a KK: wypadek ze skutkiem z §2 (śmierć, ciężki uszczerbek) spowodowany
    w nielegalnym wyścigu, w warunkach art. 178d albo w czasie obowiązywania zakazu
    prowadzenia pojazdów (art. 39 pkt 3) — od roku do lat 10.
  → Art. 86c KW (NOWY) — celowe driftowanie:
    § 1: prowadzenie pojazdu mechanicznego na drodze publicznej, w strefie zamieszkania
    lub ruchu z celowym wprowadzeniem w poślizg albo utratą styczności z nawierzchnią
    chociażby jednego koła → grzywna NIE NIŻSZA niż 1 500 zł
    § 2: gdy następstwem jest zagrożenie bezpieczeństwa w ruchu drogowym → grzywna
    NIE NIŻSZA niż 2 500 zł; recydywa (art. 38 § 2 KW, w ciągu 2 lat) — co najmniej
    dwukrotność dolnej granicy; art. 86c objęty art. 24 § 1a KW
  → Organizowanie nielegalnych spotkań motoryzacyjnych (≥10 pojazdów bez zgłoszenia):
    → obowiązek zawiadomienia organu gminy: art. 65ja PRD (spotkanie >10 pojazdów;
      odpowiednio rozdz. 2 Prawa o zgromadzeniach)
    → art. 52aa KW (od 29.01.2026): § 1 organizator/przewodniczący — ograniczenie wolności albo grzywna NIE NIŻSZA niż 2 000 zł (mandat do 5 000 zł — art. 96 § 1e KPW); § 2 umyślny uczestnik — grzywna; § 3 nie-kierujący umyślny uczestnik nielegalnego wyścigu (art. 115 § 26 KK) — grzywna; § 4 widz spotkania bez zawiadomienia lub nielegalnego wyścigu — grzywna ✅ [VER: ELI DU/2025/1872 art. 1 pkt 3 i art. 5 pkt 2, RZĄD 1, 2026-10-20]
    → art. 90 § 3 KW: tamowanie ruchu przez uczestnika takiego spotkania — grzywna ≥1 000 zł
  → Przepadek pojazdu (art. 44b KK): fakultatywny (§1) przy art. 178a §1 lub 4, 178c §1 pkt 2,
    178d, 244 (niezastosowanie się do zakazu) i wobec sprawcy z art. 178 §1 lub 1a;
    OBLIGATORYJNY (§1a) przy art. 178a §1 lub 4, 178c §1 pkt 2, 178d i sprawcy z art. 178
    §1 lub 1a, gdy alkohol ≥1,5‰ we krwi lub 0,75 mg/dm³ w wydychanym powietrzu (albo
    prowadził do takiego stężenia), chyba że wyjątkowy wypadek. §5: nie orzeka się, gdy
    pojazd nie był wyłączną własnością sprawcy albo przepadek niemożliwy/niecelowy;
    §6: wtedy nawiązka 5 000–500 000 zł (obligatoryjna przy §5 pkt 1, fakultatywna przy pkt 2).
  → Dożywotni zakaz prowadzenia pojazdów: art. 42 §3 i §4 KK (sekcja 1).

OD 30.03.2026 — ZATRZYMANIE PJ (art. 9 ustawy 1872):
  → Podstawa: kierowanie w sposób z art. 60 ust. 5 PRD — (1) celowy poślizg kół (drift),
    (2) celowa utrata styczności z nawierzchnią chociażby jednego koła; ⛔ nie dotyczy kół
    na osiach podnoszonych w pojazdach N2, N3 i M3
  → Policja zatrzymuje PJ: art. 135 ust. 1 pkt 2 lit. c i art. 135a ust. 1 pkt 2 lit. c PRD
  → Starosta wydaje decyzję o zatrzymaniu na 3 miesiące: art. 102 ust. 1 pkt 9 u.k.p.
    (odesłania w ust. 1b, 1c, 1e, 2b, 3 rozszerzone o pkt 9)
  → ⛔ KOREKTA: sam „wyścig” NIE jest odrębną podstawą zatrzymania PJ z tych przepisów —
    nielegalny wyścig to przestępstwo z art. 178c KK (środki karne z KK)
  ✅ [VER: ELI DU/2025/1872 art. 4 pkt 1, 3, 4 i art. 6, RZĄD 1, 2026-10-20]
```

---

## 1. SĄDOWY ZAKAZ PROWADZENIA POJAZDÓW

```
PODSTAWY (bez zmian systemowych):
  Art. 42 KK — środek karny (sprawy karne)
  Art. 29 KW — środek karny (sprawy o wykroczenia)

NOWE PRZEPISY OD 29.01.2026 (Dz.U. 2025 poz. 1872; brzmienie z t.j. 1342) ✅ [VER: ELI DU/2026/1342 text.pdf (t.j. KK), RZĄD 1, 2026-10-20]:
  → Art. 42 §1a KK: sąd ORZEKA (obligatoryjnie) zakaz prowadzenia WSZELKICH pojazdów
    mechanicznych w razie skazania za art. 177 §2a, art. 178b, art. 178c §1 pkt 2,
    art. 178d lub art. 180a.
  → Art. 42 §3 KK: zakaz DOŻYWOTNI w razie popełnienia przestępstwa z art. 178a §4 lub
    art. 244 (gdy czyn polegał na niezastosowaniu się do zakazu prowadzenia pojazdów
    mechanicznych) albo gdy sprawca przestępstwa z art. 173 (ze skutkiem śmierci lub
    ciężkiego uszczerbku), art. 177 §2 lub 2a lub art. 355 §2 był nietrzeźwy, pod wpływem
    środka odurzającego, zbiegł z miejsca zdarzenia lub spożywał alkohol/środek przed
    badaniem — chyba że wyjątkowy wypadek. §4: dożywotnio także przy ponownym skazaniu
    osoby prowadzącej pojazd mechaniczny w warunkach §3 (bez wyjątku).
  → Przepadek pojazdu i nawiązka — art. 44b KK (alert wyżej). ⛔ Nie „art. 44a” (wcześniejsza wersja modułu) —
    art. 44a to przepadek przedsiębiorstwa.
  → Świadczenie pieniężne (art. 43a §2 KK): co najmniej 5 000 zł m.in. przy art. 177 §2a,
    178a §1, 178b, 178c §1, 178d, 244; §3: co najmniej 10 000 zł przy art. 178a §4 i 244
    (niezastosowanie się do zakazu); górna granica 60 000 zł (§1).
  → Warunkowe zawieszenie (art. 69 §4 pkt 3 KK): przy art. 173 §1 lub 3, art. 177 §1–2a
    lub art. 355 §1 lub 2 popełnionych z alkoholem ≥1,5‰ / 0,75 mg/dm³ albo w czasie
    zakazu z art. 39 pkt 3 — tylko w szczególnie uzasadnionych wypadkach.

⭐ ZAOSTRZENIE KARY — art. 178 §1 i §1a KK (TYLKO sprawca nietrzeźwy, pod wpływem środka
odurzającego, zbiegły z miejsca zdarzenia albo spożywający alkohol/środek przed badaniem):
  → §1: przy art. 173 §1 lub 2, 174, 177 §1 lub 2a, 178c §1 pkt 2, 178d — kara od dolnej
    granicy zwiększonej o połowę do górnej granicy zwiększonej o połowę.
  → §1a: przy art. 173 §3 lub 4, 177 §2 lub 2a, 178c §1 pkt 2, 178d w tych warunkach:
    1) NIE NIŻSZA niż 3 LATA — ciężki uszczerbek innej osoby (wypadek) albo wielu osób
       (katastrofa), do dwukrotności górnej granicy zagrożenia;
    2) NIE NIŻSZA niż 5 LAT — śmierć człowieka; do dwukrotności górnej granicy (katastrofa),
       do 20 lat (wypadek).
  ⛔ KOREKTA 2026-10-20: wcześniejsza wersja modułu podawała te progi jako ogólne dla
  wypadków/katastrof („prawdopodobnie art. 173/177”). Stosują się wyłącznie w warunkach
  art. 178 §1 (alkohol, środek odurzający, ucieczka).

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
Ustawa z 04.12.2025 r. (Dz.U. 2025 poz. 1872) — weryfikuj: ELI (RZĄD 1)

BRAWUROWA JAZDA — art. 178d KK:
  Znamiona ŁĄCZNIE: rażące przekroczenie prędkości + rażące naruszenie innych zasad
  bezpieczeństwa w ruchu lądowym + narażenie człowieka na BEZPOŚREDNIE niebezpieczeństwo
  utraty życia albo skutku z art. 156 §1 lub 157 §1.
  Kara: 3 miesiące–5 lat. Wypadek ze skutkiem z art. 177 §2 w warunkach art. 178d:
  art. 177 §2a — od roku do lat 10 (+ art. 178 §1a, gdy alkohol/ucieczka).
  KLUCZOWE: brak wypadku NIE wyklucza odpowiedzialności (przestępstwo z narażenia).

NIELEGALNE WYŚCIGI — art. 115 §26 (definicja) i art. 178c KK:
  → Definicja: patrz alert wyżej (rywalizacja ≥2 pojazdów mechanicznych z naruszeniem zasad
    bezpieczeństwa albo celowy poślizg / utrata styczności koła na zorganizowanym spotkaniu
    — w obu wypadkach bez wymaganego zezwolenia).
  → Organizowanie, prowadzenie, udział jako kierujący: 3 mies.–5 lat (art. 178c §1).
  → Przygotowania: do 3 lat (art. 178c §2), nawet bez wyścigu.

DRIFT I CELOWY POŚLIZG (art. 86c KW — nowy):
  → "Celowe wprowadzenie pojazdu w poślizg lub utrata styczności ≥1 koła z nawierzchnią"
  → Na drodze publicznej, strefie ruchu/zamieszkania
  → Kara: grzywna min. 1 500 zł (§ 1), min. 2 500 zł przy zagrożeniu bezpieczeństwa (§ 2)
    + od 30.03.2026: zatrzymanie PJ na 3 miesiące (art. 102 ust. 1 pkt 9 u.k.p.)

SPOTY I ZLOTY BEZ ZGŁOSZENIA (≥10 pojazdów):
  → Obowiązek zgłoszenia organowi gminy
  → Podstawa obowiązku: art. 65ja PRD
  → Brak zgłoszenia: art. 52aa KW (od 29.01.2026) — § 1 organizator/przewodniczący: ograniczenie wolności albo grzywna ≥2 000 zł; § 2 umyślny uczestnik, § 3 nie-kierujący uczestnik nielegalnego wyścigu, § 4 widz: grzywna ✅ [VER: ELI DU/2025/1872 art. 1 pkt 3, RZĄD 1, 2026-10-20]

PRZEPADEK POJAZDU — art. 44b KK (szczegóły w alercie wyżej):
  → §1a: alkohol ≥1,5‰ / 0,75 mg/dm³ — obligatoryjnie (wyjątkowy wypadek wyłącza)
  → §5–§6: pojazd nie wyłącznie sprawcy albo przepadek niemożliwy — nawiązka 5 000–500 000 zł
  → TYMCZASOWE ZAJĘCIE POJAZDU (art. 295 § 1a KPK w brzm. art. 3 ustawy 1872, od
    29.01.2026): Policja zajmuje pojazd prowadzony przez sprawcę WYŁĄCZNIE gdy za
    przestępstwo orzeka się przepadek z art. 44b § 1a KK (≥1,5‰ / 0,75 mg/dm³);
    w pozostałych przypadkach — tylko na zasadach ogólnych art. 295 § 1 KPK
  → Art. 8 ustawy 1872: zajęcia dokonane na podstawie dawnego art. 295 § 1a wobec sprawcy
    z 1–1,5‰ (0,5–0,75 mg/dm³) UPADŁY z mocy prawa 29.01.2026; pojazd zwraca się
    uprawnionemu, chyba że Policja zajmie go na podstawie art. 295 § 1 KPK
  ✅ [VER: ELI DU/2025/1872 art. 3 i 8, RZĄD 1, 2026-10-20]

PRAWO INTERTEMPORALNE — CZYNY SPRZED 29.01.2026 (art. 4 § 1 KK):
  → STARE: przepadek obligatoryjny przy art. 178 § 1/1a, gdy alkohol >1‰ (dawny art. 178
    § 3), i przy art. 178a § 1 lub 4, chyba że <1,5‰ (dawny art. 178a § 5); przepadek
    RÓWNOWARTOŚCI pojazdu (dawny art. 44b § 2–4; nawiązka ≥5 000 zł przy pojeździe
    służbowym — § 4)
  → NOWE: przepadek obligatoryjny dopiero od 1,5‰ (art. 44b § 1a), poniżej — fakultatywny
    (§ 1); zamiast równowartości — nawiązka 5 000–500 000 zł (§ 6); art. 178a § 5 uchylony
  → Sąd stosuje ustawę względniejszą jako całość, in concreto; nowych typów i surowszych
    instytucji (art. 177 § 2a, 178c, 178d, art. 42 § 1a, art. 69 § 4 pkt 3) NIE stosuje się
    do czynów sprzed 29.01.2026
  ✅ [VER: ELI DU/2025/383 (t.j. KK sprzed zmiany) art. 44b, 178 § 3, 178a § 5 i DU/2026/1342
     art. 44b, RZĄD 1, 2026-10-20]

ZAKAZ DOŻYWOTNI I NOWY OBOWIĄZKOWY ZAKAZ:
  → Pełne, zweryfikowane warunki — patrz sekcja 1 wyżej (art. 42 §1a i §3 KK)
```

---

## 3. PRAWO JAZDY OD 17 LAT (od 03.03.2026)

```
Podstawa: Dz.U. 2025 poz. 1676 (weryfikuj: ELI (RZĄD 1))

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
  2. Brak spełnienia WSZYSTKICH znamion art. 178d łącznie (prędkość ORAZ inne zasady)
  3. Brak BEZPOŚREDNIEGO niebezpieczeństwa dla człowieka (utrata życia, art. 156 §1,
     157 §1) — samo zagrożenie abstrakcyjne nie wystarcza
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

Po zakończeniu analizy: `view shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).

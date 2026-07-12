# mod-PRD-prawo-jazdy-punkty-karne

**Status:** moduł klasy kancelaryjskiej — aktualizacja 2026-06-09 (weryfikacja online)
**Źródła weryfikacji (WERYFIKUJ ZAWSZE W ISAP PRZED POWOŁANIEM):**

| Akt | Dz.U. | Status | Uwaga |
|---|---|---|---|
| Prawo o ruchu drogowym (PRD) | Dz.U. 2024 poz. 1251 t.j. ze zm. | ze zm.: Dz.U. 2025 poz. 1676, 1734, 1843, Dz.U. 2026 poz. 180 | Weryfikuj aktualny t.j. — isap.sejm.gov.pl |
| Ustawa o kierujących pojazdami (u.k.p.) | Dz.U. 2025 poz. 1226 t.j. ze zm. | ze zm.: Dz.U. 2025 poz. 1676 | Aktualny t.j. — weryfikuj ISAP |
| Ustawa o zmianie PRD (BRD I) | Dz.U. 2025 poz. 1676 | W życie od 01.2026 (różne daty) | Prawo jazdy od 17 lat, cofnięcie za jazdę po zatrzymaniu |
| Ustawa o poprawie BRD (BRD II) | Dz.U. 2025 poz. 1872 | W życie 29.01.2026 (cz. od 30.03.2026, 03.06.2026) | Nielegalne wyścigi, drift, brawurowa jazda — KK i KW |
| Rozp. MSWiA ws. ewidencji kierujących | Dz.U. 2026 poz. 724 (nowe) | W życie 03.06.2026 | **ZASTĄPIONE**: Dz.U. 2023 poz. 1897 ze zm. Dz.U. 2026 poz. 144 → nowe rozporządzenie 29.05.2026 |
| KK (art. 178a, 180a, 115 §26) | Dz.U. 2025 poz. 383 ze zm. | ze zm.: Dz.U. 2025 poz. 1872 | Nowe przestępstwa drogowe od 29.01.2026 |
| KW (art. 86c — drift, wyścigi) | Dz.U. 2025 poz. 734 t.j. ze zm. | ze zm.: Dz.U. 2025 poz. 1872 | Nowe art. 86c od 29.01.2026 |

```
⛔ HARD GATE: Taryfikator punktów, limity mandatów i kody naruszeń ZMIENIAJĄ SIĘ ROZPORZĄDZENIAMI.
Przed każdym powołaniem:
  web_search: "taryfikator punktów karnych rozporządzenie Dz.U. 2026 poz. 724 kody naruszeń"
  web_search: "prawo jazdy 2026 zmiany przepisy [konkretny temat]"
  isap.sejm.gov.pl → aktualne t.j. PRD i u.k.p.
```

---

## ⚡ ALERTY LEGISLACYJNE — CZYTAJ PRZED ANALIZĄ

### A. Ustawa BRD I (Dz.U. 2025 poz. 1676) — wejście w życie etapami

```
OD 2026-01-XX (weryfikuj konkretną datę w ISAP):
  → Cofnięcie uprawnień za jazdę mimo zatrzymania prawa jazdy
    (nowa przesłanka cofnięcia — art. 103 u.k.p. zmieniony)
  → Zmiany art. 135 PRD — nowe podstawy zatrzymania pj

OD 2026-03-03:
  → Prawo jazdy kat. B od 17. roku życia (z ograniczeniami — osoba towarzysząca)
  → Nowe zasady okresu próbnego: 2 lata (standardowy) / 3 lata lub do 20 r.ż. (od 17 lat)
  → Cyfrowe prawo jazdy (mObywatel) = pełnoprawny odpowiednik dokumentu fizycznego PL
    (przy wyjazdach zagranicznych nadal wymagany dokument plastikowy)
  → Nowe zasady zatrzymania PJ za >50 km/h poza obszarem zabudowanym
    (drogi jednojezdniowe dwukierunkowe — NIE autostrady i drogi ekspresowe)
  → Nowe zasady UTO (urządzenia transportu osobistego)

OD 2026-06-03:
  → Obowiązek kaszków dla dzieci do 16 lat na rowerach i hulajnogach
  → Podniesienie min. wieku na hulajnogę elektryczną: z 10 do 13 lat

WERYFIKUJ: web_search "ustawa BRD Dz.U. 2025 poz. 1676 daty wejścia w życie szczegółowe"
```

### B. Ustawa BRD II (Dz.U. 2025 poz. 1872) — nowe przestępstwa drogowe

→ Wydzielone do `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` (alert + sekcje 1-3):
  nielegalne wyścigi (art. 115 §26 KK), brawurowa jazda (nowe przestępstwo KK),
  drift (art. 86c KW), sądowy zakaz prowadzenia/dożywotni zakaz, przepadek pojazdu,
  zatrzymanie pj od 30.03.2026, prawo jazdy od 17 lat (BRD I).

### C. Nowe Rozporządzenie ws. ewidencji (Dz.U. 2026 poz. 724) — w życie 03.06.2026

```
Rozporządzenie MSWiA z 29.05.2026 r. — ZASTĘPUJE wcześniejsze rozporządzenia

KLUCZOWA ZMIANA: OGRANICZENIE REDUKCJI PUNKTÓW PO SZKOLENIU
  → Redukcja po szkoleniu TYLKO dla naruszeń oznaczonych wybranymi kodami z załącznika nr 1
  → Wykluczono m.in.:
    • Przestępstwa w ruchu drogowym (wypadek, jazda po alkoholu itp.)
    • Przekroczenie prędkości o ponad 30 km/h (kody grupy E — weryfikuj dokładne kody)
    • Spowodowanie zagrożenia bezpieczeństwa w ruchu drogowym
    • Nieprawidłowe zachowanie wobec pieszych
  → Doprecyzowanie (przed podpisaniem): DODANO możliwość redukcji za przekroczenie
    prędkości o 21–30 km/h (kody E 06–E 10) — weryfikuj przez web_search

  UWAGA: Przekroczenie >20 km/h → w wielu kategoriach brak możliwości redukcji szkoleniem
  Jedyna opcja: poczekać 1 rok od opłacenia mandatu

  AUTOMATYCZNE USUWANIE PUNKTÓW (1 rok) — NOWE OGRANICZENIE:
  → Automatyczne kasowanie po roku RÓWNIEŻ ograniczone nową listą wyłączeń
  → Za najpoważniejsze naruszenia: punkty NIE kasują się automatycznie po roku
  → Weryfikuj aktualną listę: web_search "automatyczne kasowanie punktów 2026 nowe zasady"

WERYFIKUJ AKTUALNE KODY: isap.sejm.gov.pl → Dz.U. 2026 poz. 724 → załącznik nr 1
```

---

## 1. INTAKE — PYTANIA OBOWIĄZKOWE

```
□ Co się stało: mandat / wyrok nakazowy / decyzja starosty / zatrzymanie pj przez policję?
□ Kiedy zdarzenie? Data zdarzenia, data doręczenia dokumentu (termin biegnie od doręczenia!)
□ Ile punktów karnych aktualnie na koncie? → SPRAWDŹ: mObywatel lub CEPIK
□ Czy pj mniej niż 12 miesięcy (limit 20 pkt) czy powyżej (limit 24 pkt)?
□ Czy kierowca jest w OKRESIE PRÓBNYM? (2 lata lub 3 lata dla pj od 17 r.ż. — weryfikuj)
  → W okresie próbnym: limit 20 pkt, bezwzględne 0,0‰ alkoholu
□ Czy przekroczono limit punktów (24/20)?
□ Czy starosta wydał decyzję o zatrzymaniu (art. 102 u.k.p.) lub cofnięciu (art. 103 u.k.p.)?
□ Czy sąd orzekł zakaz prowadzenia pojazdów (art. 42 KK / art. 29 KW)?
□ Czy kierowca dalej prowadził po zatrzymaniu PJ? → art. 180a KK (przestępstwo)
□ Czy chodzi o drift / wyścig / brawurową jazdę? → Dz.U. 2025 poz. 1872 (od 29.01.2026)
□ Jaka podstawa zatrzymania przez policję (art. 135 PRD — weryfikuj aktualne brzmienie)?
□ Czy mandat przyjęto czy odmówiono? Kiedy wpłynął wyrok nakazowy?
□ Czy alkohol ≥ 1,5‰? → obligatoryjny przepadek pojazdu lub nawiązka do 500 000 zł
```

---

## 2. SYSTEM PUNKTÓW KARNYCH

### Podstawy prawne
```
Art. 98a u.k.p. (Dz.U. 2025 poz. 1226 ze zm.) — ewidencja i limity punktów
Rozp. MSWiA z 29.05.2026 r. (Dz.U. 2026 poz. 724) — taryfikator, kody naruszeń, szkolenia

WERYFIKACJA AKTUALNYCH PUNKTÓW:
  → mObywatel (aplikacja) — bezpłatnie, natychmiast; od 03.03.2026 = pełnoprawne pj w PL
  → https://historiapojazdu.gov.pl → dane pojazdu + dane OC
  → https://moj.gov.pl → e-usługi rządowe
  → Komenda Powiatowa / Miejska Policji — wniosek pisemny
  → web_search: "sprawdzenie punktów karnych mObywatel CEPIK 2026"
```

### Limity punktów (weryfikuj w u.k.p. art. 98a)
```
Kierowca z pj POWYŻEJ 12 miesięcy poza okresem próbnym: LIMIT = 24 pkt
Kierowca z pj DO 12 MIESIĘCY (nowicjusz/nowy okres próbny): LIMIT = 20 pkt
Kierowca w OKRESIE PRÓBNYM (2–3 lata): LIMIT = 20 pkt + bezwzględne 0,0‰

NOWY OKRES PRÓBNY od 03.03.2026 (pj od 17 lat — Dz.U. 2025 poz. 1676):
  → Czas: 3 lata lub do ukończenia 20. roku życia (co nastąpi później)
  → Obowiązki przez pierwsze 6 mies. lub do 18 r.ż.: jazda TYLKO z osobą towarzyszącą
    (ukończone 25 lat, ≥5 lat pj, brak zakazu, trzeźwość)
  → Każde poważne naruszenie → możliwość wydłużenia okresu próbnego lub cofnięcia

Weryfikuj aktualne limity: web_search "limit punktów karnych 2026 art 98a ukp"
```

### Kasowanie punktów — NOWE ZASADY OD 03.06.2026
```
AUTOMATYCZNE (po 1 roku) — ZMODYFIKOWANE od 03.06.2026:
  → Kasowanie po 1 roku od uiszczenia grzywny mandatowej (gdy mandat stanowi dochód SP
    lub wystawiła go ITD) — TYLKO dla naruszeń z listy dopuszczonej
  → Za najpoważniejsze naruszenia: automatyczne kasowanie WYŁĄCZONE
  → Weryfikuj: web_search "automatyczne usuwanie punktów 2026 rozporządzenie 724 wyłączenia"

SZKOLENIE REDUKUJĄCE (WORD) — ZMODYFIKOWANE od 03.06.2026:
  → Raz na 6 miesięcy, TYLKO kierowcy z pj od >12 miesięcy
  → Od 03.06.2026: redukcja TYLKO za naruszenia oznaczone wybranymi kodami z załącznika
    rozporządzenia Dz.U. 2026 poz. 724
  → WYŁĄCZENIA (brak redukcji po szkoleniu):
    • Przestępstwa drogowe (wypadek, jazda po alkoholu, brawurowa jazda)
    • Przekroczenie prędkości o >30 km/h (weryfikuj dokładny próg)
    • Nieprawidłowe zachowanie wobec pieszych
    • Spowodowanie zagrożenia bezpieczeństwa w ruchu
  → Koszt szkolenia: ok. 950–1 100 zł
  → web_search: "szkolenie redukujące punkty karne WORD 2026 nowe zasady co można redukować"

PO PRZEKROCZENIU LIMITU:
  → Skierowanie na kontrolne sprawdzenie kwalifikacji + badanie psychologiczne
  → Zdanie egzaminu → przywrócenie uprawnień + zerowanie punktów
  → Niezdanie / niestawienie się → konieczność nowego kursu i pełnego egzaminu
```

### Taryfikator punktów — WERYFIKUJ w rozp. Dz.U. 2026 poz. 724

```
⚠️ WYMAGANA weryfikacja online przed powołaniem konkretnych wartości:
   web_search: "taryfikator punktów karnych 2026 rozporządzenie Dz.U. 724 tabela kody"

Przekroczenie prędkości (wartości ORIENTACYJNE — weryfikuj):
  do 10 km/h: 1–2 pkt
  11–20 km/h: 3–4 pkt
  21–30 km/h: 5–7 pkt
  31–40 km/h: 8–9 pkt
  41–50 km/h: 10–13 pkt
  >50 km/h (teren zabudowany): 15 pkt + NATYCHMIASTOWE ZATRZYMANIE PJ (3 mies.)
  >50 km/h (poza zab., jednojezdniowe dwukier.): 15 pkt + zatrzymanie PJ (od 03.03.2026)
    → NIE dotyczy autostrad i dróg ekspresowych

Alkohol / środki podobne:
  0,2–0,5‰ (art. 87 KW): 10 pkt + możliwy zakaz
  >0,5‰ (art. 178a KK): przestępstwo + zakaz prowadzenia
  ≥1,5‰: przepadek pojazdu OBLIGATORYJNY lub nawiązka 5 000–500 000 zł

Wyprzedzanie na przejściu dla pieszych: 15 pkt (weryfikuj)
Nieustąpienie pierwszeństwa pieszemu: 15 pkt (weryfikuj)
Celowy drift (art. 86c KW — od 29.01.2026): ??? pkt + grzywna min. 1 500 zł
  + od 30.03.2026: zatrzymanie PJ na 3 mies.
```

---

## 3. ZATRZYMANIE PRAWA JAZDY

### A. Przez policjanta na miejscu (art. 135 PRD — WERYFIKUJ aktualne brzmienie)

```
PODSTAWY ZATRZYMANIA — najważniejsze (weryfikuj aktualną listę w ISAP):
  □ Stan po alkoholu lub w stanie nietrzeźwości / narkotyki
  □ Uzasadnione podejrzenie przestępstwa/wykroczenia zagrożonego zakazem prowadzenia pj
  □ Przekroczenie prędkości o >50 km/h w terenie zabudowanym
  □ Przekroczenie prędkości o >50 km/h poza terenem zabudowanym (jednojezdniowe,
    dwukierunkowe — od 03.03.2026, NIE autostrady/ekspresowe)
  □ Przekroczenie limitu 24 punktów karnych
  □ Drift/wyścig — od 30.03.2026 (Dz.U. 2025 poz. 1872)
  □ Brak dokumentu (pj) — ale od 03.03.2026 mObywatel = ważne pj w PL

SKUTEK: pokwitowanie → zakaz prowadzenia
  Prowadzenie mimo zatrzymania → art. 103 u.k.p. → cofnięcie uprawnień (nowa przesłanka)
  Prowadzenie mimo cofnięcia → art. 180a KK (do 2 lat poz. wolności)

Weryfikuj: isap.sejm.gov.pl → PRD → art. 135 (aktualne brzmienie)
```

### B. Przez starostę — decyzja administracyjna (art. 102 u.k.p.)

```
PODSTAWY (art. 102 ust. 1 u.k.p. — weryfikuj w ISAP):
  → Przekroczenie limitu 24/20 pkt → starosta MUSI wydać decyzję
  → Niezdolność medyczna (lekarz lub psycholog)
  → Inne — weryfikuj aktualną listę w ISAP

TRYB i ODWOŁANIE:
  → Policja/CEPiK → starosta → postępowanie KPA → decyzja
  → Odwołanie: Samorządowe Kolegium Odwoławcze (SKO) — 14 dni od doręczenia
  → Skarga do WSA — 30 dni od decyzji SKO
  ⚠️ Złożenie odwołania NIE wstrzymuje decyzji → KONIECZNIE: wniosek o wstrzymanie!
    (art. 130 KPA lub art. 61 §3 PPSA)
```

---

## 4. COFNIĘCIE UPRAWNIEŃ DO KIEROWANIA (art. 103 u.k.p.)

```
NOWE PRZESŁANKI OD 2026 (Dz.U. 2025 poz. 1676 — weryfikuj daty wejścia w życie):
  → Kierowanie pojazdem mimo decyzji o zatrzymaniu pj (nowa przesłanka)
  → Kierowanie bez uprawnień
  + Dotychczasowe: zakaz sądowy, orzeczenie lekarskie/psychologiczne, brak egzaminu

SKUTKI COFNIĘCIA:
  → Art. 180a KK: prowadzenie mimo cofnięcia = kara do 2 lat pozbawienia wolności
  → Prowadzenie = ujawnione w mObywatel / centralnej ewidencji kierowców natychmiast

PRZYWRÓCENIE (art. 103 ust. 3 u.k.p.):
  → Po ustaniu przyczyn → decyzja starosty
  → Jeśli od cofnięcia >1 rok i cofnięcie z zakazu >1 roku → kontrolne sprawdzenie kwalifikacji
```

---

## 5–7. SĄDOWY ZAKAZ / NOWE PRZESTĘPSTWA DROGOWE / PRAWO JAZDY OD 17 LAT

→ Wydzielone do `mod-PRD-nowe-przestepstwa-drogowe-BRD.md`:
- sekcja 1 — Sądowy zakaz prowadzenia pojazdów (art. 42 KK / art. 29 KW),
  dożywotni zakaz, przepadek pojazdu, skrócenie zakazu (art. 84 KK)
- sekcja 2 — Nowe przestępstwa drogowe od 29.01.2026: brawurowa jazda,
  nielegalne wyścigi (art. 115 §26 KK), drift (art. 86c KW)
- sekcja 3 — Prawo jazdy od 17 lat (BRD I, od 03.03.2026)

---

## 5. ŚCIEŻKA PRAWNA — MAPA TRYBÓW

```
PROBLEM                              TRYB                    ORGAN          TERMIN
──────────────────────────────────────────────────────────────────────────────────
Mandat → odmowa                     Wniosek o ukaranie      SR             policja kieruje
Wyrok nakazowy                      Sprzeciw                SR             7 dni od doręczenia ⚡
Decyzja starosty (art. 102/103)     Odwołanie               SKO            14 dni od doręczenia
Decyzja SKO                         Skarga                  WSA            30 dni od doręczenia
Sądowy zakaz prow. poj.             Apelacja/kasacja        SO/SN          KPK/KPW terminy
──────────────────────────────────────────────────────────────────────────────────

⚠️ PRZY DECYZJI STAROSTY: złożenie odwołania NIE wstrzymuje decyzji!
   → NATYCHMIAST złóż wniosek o wstrzymanie wykonania (art. 130 KPA lub art. 61 §3 PPSA)

Drift/wyścig/brawurowa jazda → ścieżki i linie obrony:
  `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` sekcja "STRATEGIA I LINIE OBRONY"
```

---

## 6. STRATEGIA — DECYZJE ADMINISTRACYJNE STAROSTY

```
OD DECYZJI STAROSTY (zatrzymanie/cofnięcie uprawnień):
  1. Błędy formalne decyzji (brak uzasadnienia, zły organ, naruszenie KPA)
  2. Punkty już skasowane / błędnie naliczone → wniosek o aktualizację CEPiK
  3. Zdarzenie na drodze niepublicznej (droga wewnętrzna ≠ droga publiczna)
  4. Wadliwość pomiaru prędkości (brak aktualnego świadectwa legalizacji radaru)
  5. Zastosowanie nowych wyłączeń automatycznego kasowania → weryfikuj datę i kod naruszenia

Strategie dla: drift/wyścig/zakaz sądowy/brawurowa jazda →
  `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` sekcja "STRATEGIA I LINIE OBRONY"
```

---

## 7. QUALITY GATE

```
□ Aktualne t.j. PRD (Dz.U. 2024 poz. 1251 ze zm.) i u.k.p. (Dz.U. 2025 poz. 1226 ze zm.) 
  zweryfikowane w ISAP?
□ Rozporządzenie Dz.U. 2026 poz. 724 — nowe kody i wyłączenia sprawdzone?
□ Czy zdarzenie jest PRZED czy PO 29.01.2026 / 30.03.2026 / 03.03.2026 / 03.06.2026?
  (różne regulacje zależnie od daty)
□ Stan punktów na koncie (mObywatel/CEPiK) ustalony?
□ Typ naruszenia: wykroczenie (KW) / przestępstwo (KK) / decyzja administracyjna?
□ TERMIN NA SPRZECIW / ODWOŁANIE obliczony i nie upłynął?
□ Wniosek o wstrzymanie decyzji starosty złożony (jeśli dotyczy)?
□ Czy grozi art. 180a KK (prowadzenie po cofnięciu)?
□ Czy grozi przepadek pojazdu (alkohol ≥1,5‰)?
□ Taryfikator punktów i mandatów zweryfikowany online (nie z pamięci)?
□ Czy drift/wyścig/brawurowa jazda podpada pod KK (Dz.U. 2025 poz. 1872)?
```

---

## 8. OUTPUT

```
1. Stan faktyczny: typ naruszenia, data (przed/po kluczowych datach), stan punktów
2. Kwalifikacja: wykroczenie / przestępstwo / postępowanie administracyjne
3. Terminy natychmiastowe (sprzeciw 7 dni / odwołanie 14 dni)
4. Wniosek o wstrzymanie (jeśli decyzja starosty)
5. Weryfikacja online: mObywatel / CEPIK / ISAP / taryfikator / rozp. 724
6. Matryca dowodowa
7. Strategia i linie obrony
8. Rekomendacja + kolejne kroki
```

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Mandat → sprzeciw | `pisma-proste-v2` |
| Alkohol >0,5‰ → art. 178a KK | `mod-KK-KPK-framework-karne` |
| Brawurowa jazda / nielegalne wyścigi / drift / dożywotni zakaz / prawo jazdy od 17 lat | `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` |
| Wypadek drogowy → odszkodowanie | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` |
| Odwołanie od decyzji starosty | `pisma-procesowe-v3` |
| Skarga do WSA na decyzję SKO | `dr-05` → `mod-KPA-postepowanie-administracyjne` |
| Zakaz → skrócenie (art. 84 KK) | `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` sekcja 1 |
| Mapa wykroczeń drogowych taryfikator | `mod-KW-KPW-framework-szczegolowy` |

---

## ŹRÓDŁA ONLINE (weryfikuj przed każdym powołaniem)

```
PRD aktualny t.j.: isap.sejm.gov.pl → WDU20240001251 + nowelizacje 2025/2026
U.k.p. aktualny t.j.: isap.sejm.gov.pl → WDU20250001226
Rozp. ewidencji (NOWE): isap.sejm.gov.pl → WDU20260000724

Sprawdzenie punktów i pojazdu:
  → mObywatel (aplikacja) — bezpłatnie
  → https://historiapojazdu.gov.pl (historia pojazdu, OC)

web_search (generuj zawsze przed podaniem konkretnych wartości):
  "taryfikator punktów karnych 2026 rozporządzenie 724 kody tabela"
  "szkolenie redukujące punkty karne WORD 2026 które naruszenia"

Brawurowa jazda / nielegalne wyścigi / drift / prawo jazdy od 17 lat →
  zapytania web_search w `mod-PRD-nowe-przestepstwa-drogowe-BRD.md`
```

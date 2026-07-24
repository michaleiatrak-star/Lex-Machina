---
name: dr-10-zdrowie-farmacja-zywnosc-rolnictwo
version: 3.7
description: |
  DR-10: Zdrowie, Farmacja, Żywność, Rolnictwo
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | nsa.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-10 — Zdrowie, Farmacja, Żywność, Rolnictwo

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, stawki, wymogu formalnego lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, kary, stawki refundacyjnej, dopłaty ani sygnatury wyłącznie z pamięci modelu.

**Prawo farmaceutyczne i medyczne jest nowelizowane kilka razy rocznie.**
Prawo farmaceutyczne: nowelizacje Dz.U. 2025 poz. 924, 1416, 1537 po t.j. Dz.U. 2026 poz. 612.
Wykaz leków refundowanych: aktualizowany co 3 miesiące — zawsze sprawdzaj mz.gov.pl.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills

---

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-005/006 Świadczenie zdrowotne / świadczenie towarzyszące (ustawa o dział. leczn.)
- BAS-007 Gospodarstwo rolne
- BAS-106 Status gołębi: drób vs zwierzęta gospodarskie (ORKA-REG-07 — tożsamość
  biologiczna ≠ tożsamość prawna; różne definicje sektorowe)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Zdrowie, farmacja, żywność, rolnictwo — pojęcia dziedzinowe (świadczenie zdrowotne, podmiot leczniczy, produkt leczniczy) zdefiniowane wprost w aktach sektorowych (ustawa o działalności leczniczej, Prawo farmaceutyczne) i pokryte w modułach DR-10. Żaden plik shared/definicje/ nie obejmuje tej dziedziny.
## Moduły (28 łącznie — ✓ 28 OK, ☐ 0 STUB)

```
FARMACJA:
  [✓] OK    mod-PrFarm-prawo-farmaceutyczne
  [✓] OK    mod-rzadkie-choroby-genetyczne-plan-leki-sieroce
              (dodany 2026-07-20: Plan dla Chorób Rzadkich [6 obszarów,
               OECR, rejestr, paszport pacjenta], leki sieroce
               [mechanizm refundacji, 36+12 nowych terapii 2024-2025,
               proponowana nowelizacja]. Odpowiedź na pytanie
               użytkownika)
              (scalony kanceryjski: framework + intake + GIF/WIF + URPL + refundacja +
               reklama; t.j. Dz.U. 2026 poz. 612; alerty: TSUE C-200/2024, projekt UDER114)
  [✓] OK    mod-PrFarm-szczegolowy
              (szczegółowy framework: dopuszczanie do obrotu, GMP, reklama,
               apteki, hurtownie — uzupełnia mod-PrFarm-prawo-farmaceutyczne;
               2026-06-14: usunięto zduplikowaną CZĘŚĆ IX, wydzielono VI-VIII)
  [✓] NOWY  mod-PrFarm-refundacja-nadzor-sankcje
              (wydzielony 2026-06-14 z mod-PrFarm-szczegolowy >400 linii:
               refundacja leków Dz.U. 2025 poz. 907, nadzór GIF/WIF i tryb
               odwoławczy, sankcje karne i kary pieniężne art. 124-129/127 PF)
  [✓] OK    mod-wyroby-medyczne
              (ustawa o wyrobach medycznych Dz.U. 2022 poz. 974, MDR 2017/745,
               IVDR 2017/746, EUDAMED — odrębna regulacja od Prawa farmaceutycznego;
               wydzielony 2026-06-12 z mod-PrFarm CZĘŚĆ IX; scalony 2026-06-14
               z mod-ustawa-wyroby-medyczne — NOTA-7, duplikat usunięty)
  [✓] OK    mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny
              (nadzór sanitarny GIS/SANEPID + nadzór farmaceutyczny GIF/WIF — łącznie;
               scalony z: mod-PrFarm-GIF-WIF-framework)

MEDYCYNA I PRAWA PACJENTA:
  [✓] OK    mod-ustawa-prawa-pacjenta-framework
  [✓] OK    mod-rzecznik-praw-pacjenta-RPP
              (dodany 2026-07-21: pełna treść o RPP [wszczęcie z
               wniosku/z urzędu, praktyki naruszające zbiorowe prawa
               pacjentów, uprawnienie do kontroli BEZ uprzedzenia, trzy
               rozstrzygnięcia z terminem 30 dni na odpowiedź adresata]
               — dotąd RPP był jednym słowem na liście. Odpowiedź na
               pytanie użytkownika)
              (prawa pacjenta RPP + Dz.U. 2024 poz. 581, błąd medyczny, FKZM, zgoda na leczenie,
               dokumentacja medyczna, odpowiedzialność cywilna szpitala/lekarza;
               scalony z: mod-ustawa-RPP-prawa-pacjenta)
  [✓] OK    mod-ustawa-medyczne-szczegolowy
              (szczegółowy framework medyczny: intake, terminy, predykcja, orzecznictwo)
  [✓] OK    mod-ustawa-dzialalnosc-lecznicza-pacjent
              (działalność lecznicza: rejestr podmiotów, kontrakty z NFZ, błąd medyczny)
  [✓] OK    mod-ustawa-jakosc-opieka-zdrowotna
              (ustawa o jakości w opiece zdrowotnej i bezpieczeństwie pacjenta 2023)
  [✓] OK    mod-ustawa-NFZ-swiadczenia
              (świadczenia opieki zdrowotnej, NFZ, kolejki, odmowa, kontraktowanie)

ZAWODY MEDYCZNE:
  [✓] OK    mod-ustawa-zawody-prawnicze-pokrewne
              (⚠️ NAZWA SKORYGOWANA 2026-07-15, było: mod-ustawa-zawody-medyczne-i-prawnicze
               — plik dotyczy WYŁĄCZNIE zawodów prawniczych pokrewnych: doradcy
               podatkowi, rzecznicy patentowi, mediatorzy, syndycy/doradcy
               restrukturyzacyjni. NIE dotyczy zawodów medycznych — te mają
               własne moduły niżej. Dla większości zawodów tu wymienionych
               preferuj moduły dedykowane w innych DR-skillach, patrz nagłówek pliku)
  [✓] OK    mod-ustawa-zawod-lekarza
              (ustawa o zawodach lekarza i lekarza dentysty — Dz.U. 2026 poz. 37 t.j.)
  [✓] OK    mod-ustawa-pielegniarka-polozna
              (ustawa o zawodach pielęgniarki i położnej — Dz.U. 2025 poz. 450 t.j.)
  [✓] OK    mod-ustawa-zdrowie-psychiczne
              (ustawa o ochronie zdrowia psychicznego — przymus, psychiatria sądowa)
  [✓] OK    mod-ustawa-diagnostyka-laboratoryjna
              (ustawa o medycynie laboratoryjnej / diagnostyce — Dz.U. 2022 poz. 2162)
  [✓] NOWY  mod-ustawa-aptekarz-zawod
              (Dz.U. 2025 poz. 1693 t.j.; zawód zaufania publicznego —
               samorząd NIA/okręgowe izby aptekarskie, rejestr farmaceutów;
               rozgraniczenie od mod-PrFarm-* — aptekarz jako osoba vs
               apteka jako placówka)
  [✓] NOWY  mod-ustawa-lekarz-weterynarii-zawod
              (Dz.U. 2026 poz. 125 t.j.; zawód zaufania publicznego —
               izby lekarsko-weterynaryjne, sądownictwo lekarsko-weterynaryjne,
               tytuł specjalisty; rozgraniczenie od
               mod-ustawa-inspekcja-weterynaryjna — zawód vs organ nadzoru)
  [✓] NOWY  mod-ustawa-psycholog-zawod
              (⚠️ STAN PRZEJŚCIOWY 2026-2028: stara ustawa Dz.U. 2019 poz. 1026
               wciąż "obowiązuje" ale samorząd nigdy nie powstał — jedyny
               wymóg: dyplom magistra psychologii; NOWA ustawa Dz.U. 2026
               poz. 187 [23.01.2026, podpisana 12.02.2026] wchodzi w życie
               19.05.2028, z wyjątkiem Komitetu Organizacyjnego Izb
               Psychologów od 5.03.2026 — ZAWSZE web_search aktualny status)

WYROBY MEDYCZNE I CHEMIA:
  [✓] OK    mod-ustawa-produkty-biobojcze
              (produkty biobójcze: Dz.U. 2021 poz. 24 + BPR 528/2012)
  [✓] OK    mod-REACH-CLP-chemikalia
              (REACH 1907/2006 + CLP 1272/2008 — rejestracja, SVHC, karty SDS)

ŻYWNOŚĆ, WETERYNARIA, ROLNICTWO:
  [✓] OK    mod-ustawa-rolne-zywnosc-weterynaria
              (bezpieczeństwo żywności Dz.U. 2023 poz. 1448 + inspekcja weterynaryjna
               Dz.U. 2024 poz. 12 + ARiMR/PROW + IJHARS)
  [✓] OK    mod-ustawa-bezpieczenstwo-zywnosci
              (ustawa o bezpieczeństwie żywności i żywienia — zakres podstawowy)
  [✓] OK    mod-ustawa-inspekcja-weterynaryjna
              (inspekcja weterynaryjna: uprawnienia, decyzje, odwołania)

EDUKACJA I SPORT:
  [✓] OK    mod-ustawa-oswiata-szkolnictwo-wyzsze
              (Prawo oświatowe + PSWiN — szkoły, uczelnie, odpowiedzialność dyscyplinarna)
  [✓] OK    mod-ustawa-edukacja-specjalna-dostepnosc
              (edukacja specjalna, dostępność dla osób z niepełnosprawnościami)
  [✓] OK    mod-ustawa-sport-turystyka-imprezy-masowe
              (ustawa o sporcie + imprezy masowe + usługi turystyczne)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-10-zdrowie-farmacja-zywnosc-rolnictwo/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Odpowiedzialność karna za przestępstwa medyczne → `dr-03`
- Zamówienia publiczne (sprzęt medyczny, leki) → `dr-07`
- Prawo pracy (personel medyczny, lekarze rezydenci) → `dr-04`
- RODO w placówkach medycznych → `dr-11`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | urpl.gov.pl | gif.gov.pl | eur-lex.europa.eu | mz.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.

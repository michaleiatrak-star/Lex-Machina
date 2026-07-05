---
name: dr-09-budownictwo-srodowisko-energia-transport
version: 3.3
description: |
  DR-09: Budownictwo, Środowisko, Energia, Transport
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-09 — Budownictwo, Środowisko, Energia, Transport

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, kary, terminu ani sygnatury wyłącznie z pamięci modelu.

Akty DR-09 (zwłaszcza Prawo budowlane, POŚ, Prawo wodne) są **bardzo często nowelizowane** —
tekst sprzed 6 miesięcy może być już nieaktualny. Zawsze pobieraj aktualny t.j. przed użyciem.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- **Dz.U. DR-09 zmieniają się bardzo często — przed każdym powołaniem weryfikuj t.j.**

---

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-BUDOWLANE-DROGOWE.md` — obiekt liniowy (kable w kanalizacji
  ≠ obiekt budowlany), samowola budowlana, decyzja WZ, definicje ministerialne
  prawa budowlanego (H.2) — PLIK GŁÓWNY dla tej dziedziny

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-007 Gospodarstwo rolne
- BAS-105 Zabudowa zagrodowa na gruntach leśnych (ORKA-REG-05 — def. techniczna
  nie tworzy prawa do zabudowy)
- BAS-108 Odbiorca wrażliwy energii (PE art. 3 pkt 13c + zmiana dyr. 2024/1711)
- BAS-109 Względy techniczne — podatek od nieruchomości (art. 1a ust. 1 pkt 3 upol)
- BAS-111 Strona postępowania w sprawach WZ
- BAS-115 Wolnostojące ogniwa fotowoltaiczne (kwalifikacja: zgłoszenie vs pozwolenie)
- BAS-W09 Samowola budowlana po nowelizacji 2023 (abolicja, brak przedawnienia)
- BAS-W10 Obiekt liniowy (art. 3 pkt 3a PrBud — kable w kanalizacji ≠ obiekt!)
- BAS-W14 ⚠️ Reforma upol 2025 — nowe definicje budynek/budowla (dot. też DR-06)

## Moduły (16 łącznie — ✓ 16 OK, ☐ 0 STUB)

```
BUDOWNICTWO:
  [✓] OK    mod-PrBud-prawo-budowlane
              (samowola, PINB/WINB, pozwolenie, zgłoszenie, WZ/MPZP, umowa z wykonawcą,
               uchwała NSA 7 sędziów luty 2026 — art. 49f i wcześniejszy nakaz rozbiórki)
  [✓] OK    mod-UGN-gospodarka-nieruchomosciami
              (deweloper, MRP, DFG, WM, najem, zasiedzenie, KW, służebności)
  [✓] OK    mod-PrGeodezyjne-kartografia-wywlaszczenia
              (ewidencja gruntów, podziały, wywłaszczenie, ZRID, specustawy)
  [✓] OK    mod-ustawa-planowanie-przestrzenne
              (Plan Ogólny Gminy, MPZP, WZ, ZPI — reforma 2023)
  [✓] NOWY  mod-ustawa-architekci-inzynierowie-budownictwa-zawod
              (Dz.U. 2025 poz. 1783 t.j.; zawody zaufania publicznego —
               samorządy IARP/PIIB; uprawnienia budowlane art. 14 PrBud,
               tytuł rzeczoznawcy budowlanego; ⚠️ URBANISTA — samorząd
               zniesiony 2014, obecnie tylko dobrowolne stowarzyszenia)

ŚRODOWISKO:
  [✓] OK    mod-POS-prawo-ochrony-srodowiska
              (POŚ, pozwolenia, IPPC, emisje, kary WIOŚ, KK 181-188a)
  [✓] OK    mod-POS-prawo-ochrony-srodowiska-szczegoly
              (szczegółowy framework OOŚ: intake, screening, Natura 2000, predykcja,
               kary administracyjne WIOŚ, odpowiedzialność szkodowa)
  [✓] OK    mod-ustawa-OOS-oceny-srodowiskowe
              (DŚU, OOŚ, RDOŚ/GDOŚ, udział społeczeństwa, organy)
  [✓] OK    mod-ustawa-odpadach-gospodarka-komunalna
              (BDO, zezwolenia, kary, nielegalne składowanie, rekultywacja)
  [✓] OK    mod-ustawa-lesna-lowiecka-ochrona-przyrody
              (ochrona przyrody, Natura 2000, szkody łowieckie, wycinka)

ENERGIA I ZASOBY:
  [✓] OK    mod-PrEnergetyczne-URE-OZE
              (koncesje, taryfy, przyłączenia, prosument, OZE, gaz, URE)
  [✓] OK    mod-ustawa-charakterystyka-energetyczna
              (certyfikaty energetyczne, EPBD recast 2024, NZEB)
  [✓] OK    mod-PrWodne-gospodarka-sciekowa
              (Prawo wodne, Wody Polskie, pozwolenia wodnoprawne, opłaty)
  [✓] OK    mod-prawo-geologiczne-gornicze
              (koncesje wydobywcze, opłaty eksploatacyjne, WUG)

TRANSPORT:
  [✓] OK    mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski
              (scalony kanceryjski: drogowy ITD, kolejowy UTK, lotniczy ULC, morski,
               drogi publ., specustawa drogowa ZRID, elektromobilność, drony, pasażerowie)
  [✓] OK    mod-ustawa-prawo-gazowe
              (Prawo energetyczne — część gazowa, URE, TGE, odbiorca wrażliwy)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-09-budownictwo-srodowisko-energia-transport/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-09-budownictwo-srodowisko-energia-transport/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Planowanie przestrzenne (MPZP, WZ) → też `dr-08` → `mod-MPZP-WZ-planowanie-przestrzenne`
- Podatek od nieruchomości (reforma 2025) → `dr-06`
- Zamówienia publiczne (budowlane) → `dr-07`
- Samorząd terytorialny (MPZP, gospodarka komunalna) → `dr-08`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | sn.pl | kio.gov.pl (zamówienia budowlane)

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

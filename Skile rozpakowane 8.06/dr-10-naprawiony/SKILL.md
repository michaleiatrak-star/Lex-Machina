---
name: dr-10-zdrowie-farmacja-zywnosc-rolnictwo
version: 3.1
description: |
  DR-10: Zdrowie, Farmacja, Żywność, Rolnictwo
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | nsa.gov.pl | sn.pl
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

## Moduły (25 łącznie — ✓ 25 OK, ☐ 0 STUB)

```
FARMACJA:
  [✓] OK    mod-PrFarm-prawo-farmaceutyczne
              (scalony kanceryjski: framework + intake + GIF/WIF + URPL + refundacja +
               reklama; t.j. Dz.U. 2026 poz. 612; alerty: TSUE C-200/2024, projekt UDER114)
  [✓] OK    mod-PrFarm-framework
              (mapa rozdziałów PF, tabela decyzyjna, powiązania z frameworkiem zewnętrznym)
  [✓] OK    mod-PrFarm-szczegolowy
              (szczegółowy framework GIF/WIF, URPL, refundacja, Apteka dla Aptekarza,
               reklama aptek, predykcja wyniku — uzupełnia mod-PrFarm-prawo-farmaceutyczne)
  [✓] OK    mod-PrFarm-GIF-WIF-framework
              (szczegółowy framework WIF: terminy, intake, mapa organów, cofnięcie apteki,
               reklama aptek — wyrok TSUE C-200/2024, odpowiedzialność zawodowa farmaceuty)
  [✓] OK    mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny
              (nadzór sanitarny GIS/SANEPID + nadzór farmaceutyczny GIF/WIF — łącznie)

MEDYCYNA I PRAWA PACJENTA:
  [✓] OK    mod-ustawa-prawa-pacjenta-framework
              (prawa pacjenta RPP, błąd medyczny, FKZM, zgoda na leczenie,
               dokumentacja medyczna, odpowiedzialność cywilna szpitala/lekarza)
  [✓] OK    mod-ustawa-medyczne-szczegolowy
              (szczegółowy framework medyczny: intake, terminy, predykcja, orzecznictwo)
  [✓] OK    mod-ustawa-dzialalnosc-lecznicza-pacjent
              (działalność lecznicza: rejestr podmiotów, kontrakty z NFZ, błąd medyczny)
  [✓] OK    mod-ustawa-jakosc-opieka-zdrowotna
              (ustawa o jakości w opiece zdrowotnej i bezpieczeństwie pacjenta 2023)
  [✓] OK    mod-ustawa-NFZ-swiadczenia
              (świadczenia opieki zdrowotnej, NFZ, kolejki, odmowa, kontraktowanie)
  [✓] OK    mod-ustawa-RPP-prawa-pacjenta
              (ustawa o prawach pacjenta i Rzeczniku Praw Pacjenta — zakres podstawowy)

ZAWODY MEDYCZNE:
  [✓] OK    mod-ustawa-zawody-medyczne-i-prawnicze
              (scalony: zawody medyczne + zawody prawnicze i pokrewne —
               doradcy podatkowi, rzecznicy patentowi, mediatorzy, syndycy)
  [✓] OK    mod-ustawa-zawod-lekarza
              (ustawa o zawodach lekarza i lekarza dentysty — Dz.U. 2026 poz. 37 t.j.)
  [✓] OK    mod-ustawa-pielegniarka-polozna
              (ustawa o zawodach pielęgniarki i położnej — Dz.U. 2025 poz. 450 t.j.)
  [✓] OK    mod-ustawa-zdrowie-psychiczne
              (ustawa o ochronie zdrowia psychicznego — przymus, psychiatria sądowa)
  [✓] OK    mod-ustawa-diagnostyka-laboratoryjna
              (ustawa o medycynie laboratoryjnej / diagnostyce — Dz.U. 2022 poz. 2162)

WYROBY MEDYCZNE I CHEMIA:
  [✓] OK    mod-ustawa-wyroby-medyczne
              (wyroby medyczne: Dz.U. 2022 poz. 974 + MDR 2017/745 + IVDR 2017/746)
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

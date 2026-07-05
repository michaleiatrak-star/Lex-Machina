---
name: dr-08-samorzad-terytorialny-prawo-lokalne
version: 3.2
description: |
  DR-08: Samorząd Terytorialny i Prawo Lokalne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | dzienniki.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-08 — Samorząd Terytorialny i Prawo Lokalne

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- Prawo miejscowe i uchwały JST: pobieraj z dzienników wojewódzkich i BIP, nie z pamięci

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-BUDOWLANE-DROGOWE.md` — opłata SPP (charakter prawny,
  zaskarżenie wyłącznie w egzekucji), obiekt liniowy, samowola budowlana
- `definicje/DEF-PROCEDURA.md` — termin zawity (art. 33 UPEA — 7 dni,
  bezwzględny dla SPP)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-008 Mienie komunalne (art. 43 ustawy o samorządzie gminnym)
- BAS-012 Pas drogowy (UDP art. 4 pkt 1)
- BAS-101 Strefa zamieszkania (skutki: pierwszeństwo pieszego, 20 km/h)
- BAS-107 Droga wewnętrzna (definicja negatywna — mandat zasadniczo niedopuszczalny)

## Moduły (17 łącznie — ✓ 17 OK, ☐ 0 STUB)

```
MODUŁY USTROJOWE I PROCEDURALNE:
  [✓] OK    mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa
              (USG + USP + USW — ustrój, kompetencje, organy, nadzór)
  [✓] OK    mod-nadzor-wojewody-RIO-legalnosc-uchwal
  [✓] OK    mod-skargi-na-prawo-miejscowe-WSA-NSA
  [✓] OK    mod-procedury-JST-statuty-regulaminy
  [✓] OK    mod-dzienniki-urzedowe-BIP-publikacja
  [✓] OK    mod-kontrola-administracji-inspekcje
  [✓] OK    mod-akty-porzadkowe-bezpieczenstwo-lokalne
              (akty porządkowe, rozporządzenia porządkowe, zaskarżanie, bezpieczeństwo lokalne)
  [✓] OK    mod-lokalne-dane-publiczne-RODO-BIP
              (RODO w JST, DIP, dostęp do informacji publicznej, BIP)

MODUŁY DZIEDZINOWE (prawo materialne):
  [✓] OK    mod-MPZP-WZ-planowanie-przestrzenne
  [✓] OK    mod-lokalne-podatki-oplaty-taryfy
  [✓] OK    mod-ustawa-dochody-JST
  [✓] OK    mod-ustawa-zarzadzanie-kryzysowe
  [✓] OK    mod-ustawa-referendum-lokalne
  [✓] OK    mod-ustawa-pracownicy-samorzadowi
  [✓] OK    mod-ustawa-komunalne-wod-kan-transport-czystosc
              (scalony: wod-kan + transport zbiorowy + czystość i porządek)
  [✓] OK    mod-ustawa-zabytki-rewitalizacja
  [✓] OK    mod-UDP-strefy-platnego-parkowania
              (SPP/ŚSPP: opłaty art.13/13b/13f UDP Dz.U.2025.889; opłata dodatkowa;
               brak zaskarżalności wezwania do WSA — tylko zarzuty UPEA art.33;
               stawki % płacy min.; karta parkingowa; parking prywatny; zaskarżenie uchwały)
              (scalony: zabytki + rewitalizacja + cmentarze)
```

## Jak wywołać

```
view /mnt/skills/user/dr-08-samorzad-terytorialny-prawo-lokalne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-08-samorzad-terytorialny-prawo-lokalne/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA / PPSA: `dr-04` → `mod-KPA-postepowanie-administracyjne`
- Podatki lokalne (podatek od nieruchomości — stawki i reforma 2025): `dr-06` → `mod-ustawa-podatek-nieruchomosci-i-lokalne`
- Finanse publiczne / dyscyplina: `dr-06` → `mod-UFP-finanse-publiczne-NIK-RIO`
- Zamówienia publiczne JST: `dr-07`
- Budownictwo / środowisko: `dr-09`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Orzecznictwo: orzeczenia.nsa.gov.pl, cbosa.nsa.gov.pl
- Prawo miejscowe: dzienniki.gov.pl, BIP właściwego urzędu

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

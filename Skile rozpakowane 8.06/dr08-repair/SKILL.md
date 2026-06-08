---
name: dr-08-samorzad-terytorialny-prawo-lokalne
version: 3.0
description: |
  DR-08: Samorząd Terytorialny i Prawo Lokalne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | dzienniki.gov.pl
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

## Moduły (16 łącznie — ✓ 16 OK, ☐ 0 STUB)

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

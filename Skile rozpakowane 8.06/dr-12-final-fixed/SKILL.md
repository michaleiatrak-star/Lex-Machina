---
name: dr-12-sadownictwo-prokuratura-zawody-prawnicze
version: 3.1
description: |
  DR-12: Sądownictwo, Prokuratura, Zawody Prawnicze
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl
---

# DR-12 — Sądownictwo, Prokuratura, Zawody Prawnicze

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

```
PRZED każdym powołaniem:
  □ przepisu ustawy → isap.sejm.gov.pl (tekst jednolity + nowelizacje)
  □ sygnatury orzeczenia → orzeczenia.ms.gov.pl / sn.pl / cbosa.nsa.gov.pl
  □ stawki taksy notarialnej → aktualne rozp. MS w ISAP
  □ opłaty egzekucyjne komornika → aktualne rozp. MS w ISAP
  □ wynagrodzenie pełnomocnika z urzędu → aktualne rozp. MS w ISAP
  □ stawek OC zawodów → aktualne rozp. MS w ISAP

Naruszenie HARD GATE = błąd kwalifikowany. Nie ma wyjątków.
```

## Zasada architektoniczna

- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów, sygnatur i stawek z pamięci — weryfikuj w ISAP**

## ⚠️ Ostrzeżenia systemowe

```
PPSA: Sądowa kontrola regulatorów (UOKiK, URE, UKE, KNF) → sądy administracyjne
      (WSA/NSA) wg PPSA — Dz.U. 2026 poz. 143; chyba że przepis sektorowy stanowi
      inaczej (np. SOKiK dla UOKiK). Weryfikuj właściwość przed sporządzeniem pisma.

USP: Prawo o ustroju sądów powszechnych → DR-01/mod-USP-ustroj-sadow-powszechnych
     (nie powielaj w DR-12; do DR-12 należy wyłącznie status zawodowy sędziego
     i referendarza oraz ich odpowiedzialność dyscyplinarna).

EPPO: Od 2025 r. — Prokuratura Europejska działa w Polsce na podstawie
      Dz.U. 2025 poz. 304. Sprawy na szkodę budżetu UE (VAT-karuzele,
      nadużycia funduszy UE > 10 000 EUR) → właściwa EPPO, nie prokuratura krajowa.

NOTARIAT: Prawo o notariacie nie ma nowego tekstu jednolitego (ostatni: 1991).
          Każda nowelizacja osobno w ISAP. Weryfikuj przed każdym cytowaniem.
```

## Moduły (11 łącznie — ✓ 11 OK, ☐ 0 STUB)

```
SĄDOWNICTWO I PROCEDURA:
  [✓] OK    mod-ustawa-sedziowie-referendarze-kuratorzy
              (USP, wyłączenie sędziego, odpowiedzialność dyscyplinarna,
               skarga na orzeczenie referendarza, kuratorzy sądowi)
  [✓] OK    mod-KPC-biegli-sadowi-opinie
              (powołanie biegłego, zarzuty do opinii, wynagrodzenie,
               metodologia, opinia uzupełniająca, instytut)
  [✓] OK    mod-KSCU-koszty-sadowe-i-pomoc-prawna
              (⚡ nowy t.j. Dz.U. 2025 poz. 1228; opłaty od pozwu, zwolnienie,
               prawo pomocy, wynagrodzenie pełnomocnika z urzędu)
  [✓] OK    mod-KPC-arbitraz-mediacja-ADR
              (arbitraż KPC art. 1154–1217, mediacja art. 1831–18315,
               Konwencja nowojorska, regulaminy SA KIG/Lewiatan;
               pełny framework ADR → DR-07/mod-ustawa-arbitraz-mediacja)

PROKURATURA I ORGANY OCHRONY PRAWA:
  [✓] OK    mod-PrProkuratura-organy-ochrony-prawa
              (Prawo o prokuraturze Dz.U. 2024 poz. 390 ze zm.;
               ⚡ EPPO: ustawa Dz.U. 2025 poz. 304 od 2025;
               skargi na czynności, nadzór, bezczynność)

REGULATORZY:
  [✓] OK    mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF
              (decyzje sektorowe, kary, Dz.U. 2025 poz. 1714 UOKiK,
               Dz.U. 2026 poz. 43 URE, Dz.U. 2024 poz. 1221 UKE;
               ⚠️ kontrola sądowa: WSA/NSA wg PPSA lub SOKiK — weryfikuj)

ODPOWIEDZIALNOŚĆ DYSCYPLINARNA:
  [✓] OK    mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow
              (adwokaci, radcowie, lekarze, notariusze, komornicy —
               postępowania, kary, przedawnienie, tryby zaskarżenia)

ZAWODY PRAWNICZE — USTAWY KORPORACYJNE:
  [✓] OK    mod-ustawa-adwokatura
              (Dz.U. 2024 poz. 1564; tajemnica adwokacka; OC;
               odpowiedzialność dyscyplinarna 3-instancyjna;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-radcowie-prawni
              (Dz.U. 2024 poz. 499; nowelizacja 2025 — OC, praca zdalna;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-notariat
              (⚠️ brak t.j. — weryfikuj każdą nowelizację; taksa notarialna
               TYLKO z rozp. MS; NTE art. 777 KPC; odmowa czynności;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-komornicy-sadowi-zawod
              (Dz.U. 2024 poz. 1458; opłaty TYLKO z rozp. MS; OC;
               skarga art. 767 KPC; odpowiedzialność dyscyplinarna;
               wybór komornika; pełny intake/strategia/quality gate)
```

## Jak wywołać

```
view /mnt/skills/user/dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md
```

## Powiązania zewnętrzne

- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- USP / ustrój sądów: `dr-01` → `mod-USP-ustroj-sadow-powszechnych`
- Arbitraż / mediacja (pełny framework): `dr-07` → `mod-ustawa-arbitraz-mediacja`
- Notariat (czynności notarialne w rejestrach): `dr-07` → `mod-PrNotariat-notariat-rejestry`
- KPK (obrońca w procesie karnym): `dr-03`
- Egzekucja komornicza (tryb): `dr-03` → `mod-ustawa-komornicy-sadowi`
- PPSA (skargi na regulatorów): `dr-05` → `mod-PPSA-postepowanie-sadowoadministracyjne`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`

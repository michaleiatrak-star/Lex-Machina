---
name: dr-04-prawo-pracy-zus-swiadczenia
version: 3.2
description: |
  DR-04: Prawo Pracy, ZUS, Świadczenia Społeczne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl
---

# DR-04 — Prawo Pracy, ZUS, Świadczenia Społeczne

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
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## Moduły (17 łącznie — ✓ 17 OK, ☐ 0 STUB)

```
  [✓] OK    mod-KP-prawo-pracy
              (zawiera Aneks A: mobbing i dyskryminacja — 5 przesłanek,
               tabela roszczeń, strategia dowodowa, projekt UD183)
  [✓] OK    mod-KPA-postepowanie-administracyjne
  [✓] OK    mod-SUS-ZUS-ubezpieczenia-spoleczne
              (zawiera Aneks A: renta — 3 przesłanki z tabelą stażu;
               Aneks B: kalkulator terminów ZUS; Aneks C: predykcja wyniku)
  [✓] OK    mod-KRUS-rolnicze-ubezpieczenia
  [✓] OK    mod-ustawa-zwolnienia-grupowe
  [✓] OK    mod-ustawa-zwiazki-zawodowe-spory-zbiorowe
  [✓] OK    mod-ustawa-PIP-inspekcja-pracy
  [✓] OK    mod-ustawa-minimalne-wynagrodzenie
  [✓] OK    mod-ustawa-ZFSS
  [✓] OK    mod-ustawa-praca-tymczasowa
  [✓] OK    mod-ustawa-rynek-pracy-zatrudnienie
  [✓] OK    mod-ustawa-swiadczenia-rodzinne
  [✓] OK    mod-ustawa-aktywny-rodzic
  [✓] OK    mod-ustawa-rehabilitacja-PFRON
              (zawiera Aneks: świadczenie uzupełniające 500+ dla niepełnosprawnych)
  [✓] OK    mod-ustawa-pomoc-spoleczna
  [✓] OK    mod-ustawa-ochrona-konkurencji-konsumentow-UOKiK
  [✓] OK    mod-ustawa-swiadczenie-wspierajace-WZON
```

## Jak wywołać

```
view /mnt/skills/user/dr-04-prawo-pracy-zus-swiadczenia/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-04-prawo-pracy-zus-swiadczenia/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl

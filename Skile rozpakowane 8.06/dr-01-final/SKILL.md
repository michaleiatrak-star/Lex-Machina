---
name: dr-01-ustroj-konstytucyjny-i-zrodla-prawa
version: 3.1
description: |
  DR-01: Ustrój Konstytucyjny i Źródła Prawa
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | trybunal.gov.pl | sn.pl
---

# DR-01 — Ustrój Konstytucyjny i Źródła Prawa

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
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo przy braku dostępu

## Moduły (4 łącznie — ✓ 4 OK, ☐ 0 STUB)

```
  [✓] OK    mod-Konstytucja-TK-skarga-konstytucyjna
  [✓] OK    mod-USP-ustroj-sadow-powszechnych
  [✓] OK    mod-ustawa-KRS-i-ustroj-wladzy
  [✓] OK    mod-ustawa-partie-polityczne-referendum
```

## Jak wywołać

```
view /mnt/skills/user/dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-01-ustroj-konstytucyjny-i-zrodla-prawa/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: trybunal.gov.pl, sn.pl, nsa.gov.pl, orzeczenia.ms.gov.pl

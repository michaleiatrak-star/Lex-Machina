---
name: dr-03-prawo-karne-wykroczenia-egzekucja
version: 2.0
description: |
  DR-03: Prawo Karne, Wykroczenia, Egzekucja
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl
---

# DR-03 — Prawo Karne, Wykroczenia, Egzekucja

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

## Moduły (19 łącznie — ✓ 19 OK, ☐ 0 STUB)

```
  [✓] OK    mod-KK-KPK-framework-karne
  [✓] OK    mod-KK-KPK-framework-szczegolowy
  [✓] OK    mod-KK-art190a-stalking
  [✓] OK    mod-KK-art207-przemoc-domowa
  [✓] OK    mod-KK-art267-269c-cyberprzestepstwa
  [✓] OK    mod-KK-cyber-framework
  [✓] OK    mod-KK-cyberprzestepstwa-szczegolowy
  [✓] OK    mod-KK-kodeks-karny
  [✓] OK    mod-KK-kwalifikator-karnomaterialny
  [✓] OK    mod-KK-przemoc-domowa-framework
  [✓] OK    mod-KK-przemoc-domowa-szczegolowy
  [✓] OK    mod-KK-stalking-framework
  [✓] OK    mod-KK-stalking-szczegolowy
  [✓] OK    mod-KKS-karny-skarbowy-i-AML
  [✓] OK    mod-KKW-kodeks-karny-wykonawczy
  [✓] OK    mod-KPK-tryby-scigania
  [✓] OK    mod-KW-KPW-framework-szczegolowy
  [✓] OK    mod-KW-framework-wykroczenia
  [✓] OK    mod-KW-kodeks-wykroczen
```

## Jak wywołać

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl

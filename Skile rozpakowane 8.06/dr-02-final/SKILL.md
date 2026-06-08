---
name: dr-02-prawo-cywilne-rodzinne-gospodarcze
version: 3.2
description: |
  DR-02: Prawo Cywilne, Rodzinne i Gospodarcze
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl
---

# DR-02 — Prawo Cywilne, Rodzinne i Gospodarcze

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
  [✓] OK    mod-KC-cywilne-zobowiazania-odpowiedzialnosc
  [✓] OK    mod-KC-spadki
  [✓] OK    mod-KC-konsumenckie
  [✓] OK    mod-KC-ubezpieczenia
  [✓] OK    mod-KRO-rodzinne
  [✓] OK    mod-KSH-spolki-handlowe
  [✓] OK    mod-PrUpad-upadlosc-restrukturyzacja
  [✓] OK    mod-KPC-egzekucja-windykacja
  [✓] OK    mod-ustawa-prawa-konsumenta
  [✓] OK    mod-ustawa-UZNK-nieuczciwa-konkurencja
  [✓] OK    mod-ustawa-deweloperska
  [✓] OK    mod-ustawa-KRS-rejestr-sadowy
  [✓] OK    mod-ustawa-fundacje-stowarzyszenia
  [✓] OK    mod-ustawa-spoldzielnie-wlasnosc-lokali
  [✓] OK    mod-KP-art943-mobbing-dyskryminacja
  [✓] OK    mod-ustawa-cudzoziemcy
  [✓] OK    mod-ustawa-timeshare-zastaw-rejestrowy
```

## Jak wywołać

```
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2` / `analizator-umow-v1`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl

---
name: dr-05-prawo-administracyjne-sadowoadministracyjne
version: 3.0
description: |
  DR-05: Prawo Administracyjne i Sądownictwo Administracyjne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | nsa.gov.pl
---

# DR-05 — Prawo Administracyjne i Sądownictwo Administracyjne

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

## Moduły (11 łącznie — ✓ 11 OK, ☐ 0 STUB)

```
  [✓] OK    mod-UDIP-dostep-informacji-publicznej
  [✓] OK    mod-UPEA-egzekucja-administracyjna
  [✓] OK    mod-ustawa-cudzoziemcy
  [✓] OK    mod-ustawa-skargi-przewleklosc-dostep-sadu
  [✓] OK    mod-ustawa-RPO
  [✓] OK    mod-ustawa-SKO
  [✓] OK    mod-ustawa-kontrola-administracji
  [✓] OK    mod-ustawa-petycje
  [✓] OK    mod-ustawa-zaskarzanie-decyzji-wlasnosci
  [✓] OK    mod-ustawa-dostepnosc-niepelnosprawni
  [✓] OK    mod-ustawa-sygnalisci
```

## Uwaga: KPA i PPSA

```
KPA (Dz.U. 2025 poz. 1691) i PPSA (Dz.U. 2026 poz. 143) są kanonicznie
opracowane w DR-04 → mod-KPA-postepowanie-administracyjne.
DR-05 zawiera akty szczegółowe prawa administracyjnego materialnego i procesowego.
```

## Jak wywołać

```
view /mnt/skills/user/dr-05-prawo-administracyjne-sadowoadministracyjne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-05-prawo-administracyjne-sadowoadministracyjne/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA / PPSA: `dr-04` → `mod-KPA-postepowanie-administracyjne`
- Cudzoziemcy (prawo pracy): `dr-04` → `mod-ustawa-cudzoziemcy`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.nsa.gov.pl, cbosa.nsa.gov.pl

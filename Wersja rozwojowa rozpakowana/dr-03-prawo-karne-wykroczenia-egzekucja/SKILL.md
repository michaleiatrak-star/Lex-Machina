---
name: dr-03-prawo-karne-wykroczenia-egzekucja
version: 2.1
description: |
  DR-03: Prawo Karne, Wykroczenia, Egzekucja
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
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

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny
  (KRYTYCZNE: terminy zawite w KPK — apelacje, zażalenia 14 dni)
- `definicje/DEF-PRACA.md` — niealimentacja (art. 209 KK) — sekcja dolna pliku

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: świadek a interes
  własny (KPK art. 182-186 — prawo odmowy zeznań/odpowiedzi, "osoba najbliższa"
  z faktycznym wspólnym pożyciem — BAS-112)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-013 Treści pornograficzne (art. 202 KK — brak definicji legalnej, ocenne)
- BAS-103 Uprawdopodobnienie (≠ udowodnienie — ORKA-REG-02)
- BAS-114 Mobbing a prawo karne (zbieg z art. 190/191/216/217/218 KK)
- BAS-118 Mowa nienawiści (art. 256-257 KK — brak definicji + zmiana 2024/2025)
- BAS-121 Handel ludźmi (art. 115 §22 KK — zgoda ofiary irrelewantna)
- BAS-129 Recydywa szczególna i multirecydywa (art. 64 KK — przesłanki łączne)
- BAS-130 Warunkowe umorzenie (art. 66 KK — 6 przesłanek + wykluczenia)
- BAS-134 Środki karne + zatarcie skazania (→ mod-prawa-obywatelskie-srodki-karne.md)
- BAS-W22 Czyn ciągły / "z góry powzięty zamiar" (art. 12 KK)
- BAS-W23 Mienie znacznej/wielkiej wartości (art. 115 §5-6 KK — progi zamrożone od 2010!)
- BAS-W24 Nieznaczna ilość narkotyku (art. 62a ustawy PN — brak definicji)
- BAS-131/132/133 Niewidomy / niepełnosprawność intelektualna / głuchota —
  obrona obligatoryjna art. 79 §1 pkt 2-4 KPK (→ mod-niewidomy-prawa-prawne.md,
  mod-niepelnosprawnosc-intelektualna-gluchota.md)

## Moduły (20 łącznie — ✓ 20 OK, ☐ 0 STUB)

```
  [✓] OK    mod-KK-KPK-framework-karne
              (nowe przestępstwa drogowe: brawurowa jazda, nielegalne wyścigi, art. 115 §26 KK
               przepadek pojazdu ≥1,5‰, dożywotni zakaz — Dz.U. 2025 poz. 1872)
  [✓] OK    mod-KK-KPK-framework-szczegolowy
  [✓] OK    mod-KK-art190a-stalking
  [✓] OK    mod-KK-art207-przemoc-domowa
  [✓] OK    mod-KK-art267-269c-cyberprzestepstwa
  [✓] OK    mod-KK-cyberprzestepstwa-szczegolowy
  [✓] OK    mod-KK-kodeks-karny
  [✓] OK    mod-KK-kwalifikator-karnomaterialny
  [✓] OK    mod-KK-przemoc-domowa-szczegolowy
  [✓] OK    mod-KK-stalking-szczegolowy
  [✓] OK    mod-KKS-karny-skarbowy-i-AML
  [✓] OK    mod-KKW-kodeks-karny-wykonawczy
  [✓] OK    mod-KPK-tryby-scigania
  [✓] OK    mod-KW-KPW-framework-szczegolowy
              (nowe art. 86c KW — celowy drift/poślizg od 29.01.2026; zloty bez zgłoszenia;
               taryfikator: rozp. Dz.U. 2026 poz. 724 — weryfikuj kody)
  [✓] OK    mod-KW-kodeks-wykroczen
  [✓] OK    mod-grzywny-mandaty-szczegolowe
              (systematyka: grzywna sądowa/mandat/kara adm./grzywna porządkowa/UPEA;
               uchylenie mandatu art.101 KPSW; KPA Dział IVa kary adm.; egzekucja UPEA;
               taryfikator mandatów Dz.U. 2026 poz. 724; przedawnienie; orzecznictwo SN)
  [✓] OK    mod-PRD-prawo-jazdy-punkty-karne
              (PRD + u.k.p. + rozp. ewidencji Dz.U. 2026 poz. 724; punkty karne,
               limity, taryfikator, zatrzymanie/cofnięcie uprawnień przez starostę)
  [✓] OK    mod-PRD-nowe-przestepstwa-drogowe-BRD
              (wydzielony 2026-06-14 z mod-PRD >400 linii: BRD I Dz.U. 2025 poz. 1676
               + BRD II Dz.U. 2025 poz. 1872; brawurowa jazda, nielegalne wyścigi,
               drift art. 86c KW, sądowy zakaz/dożywotni zakaz/przepadek, pj od 17 lat)
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

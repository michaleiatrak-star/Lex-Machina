---
name: dr-05-prawo-administracyjne-sadowoadministracyjne
version: 3.1
description: |
  DR-05: Prawo Administracyjne i Sądownictwo Administracyjne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | nsa.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
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

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-ADMINISTRACYJNE.md` — decyzja administracyjna: definicja
  + wykonalność (scalone E.3+H.5.1)
- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny
  (KPA art. 35 instrukcyjny, art. 128 zawity)

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE, PLIK GŁÓWNY:
  interes prawny vs interes faktyczny (art. 28 KPA — definicja strony
  postępowania, NSA II GSK 163/06, granica sporna przy immisjach/COVID)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-009 Cel publiczny (UGN art. 6 — katalog ZAMKNIĘTY)
- BAS-103 Uprawdopodobnienie (≠ udowodnienie — ORKA-REG-02)
- BAS-111 Strona postępowania w sprawach WZ (sąsiad jako strona — NSA)
- BAS-W11 Dwuinstancyjność postępowania (art. 15 KPA — obowiązek pełnej oceny)
- BAS-W12 Wynagrodzenie dla egzekucji administracyjnej (zmiana 25.03.2024 UPEA)
- BAS-W21 Informacja przetworzona (UDIP art. 3 — "szczególna istotność")
- BAS-W29 Pełnomocnik z urzędu — prawo do sądu (art. 117 KPC)

## Moduły (12 łącznie — ✓ 12 OK, ☐ 0 STUB)

```
  [✓] OK    mod-UDIP-dostep-informacji-publicznej
  [✓] OK    mod-UPEA-egzekucja-administracyjna
  [✓] OK    mod-ustawa-cudzoziemcy
              (moduł kanoniczny: tytuły pobytowe, procedura UW→SZUSC→WSA→NSA,
               wydalenie, ochrona międzynarodowa, ochrona tymczasowa UA)
  [✓] NOWY  mod-ustawa-cudzoziemcy-zatrudnianie
              (wydzielony 2026-06-14 z mod-ustawa-cudzoziemcy >400 linii:
               zezwolenia na pracę typy A/B/C/D/S, ustawa Dz.U. 2025 poz. 621,
               matryca dokument pobytowy → uprawnienie do pracy)
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

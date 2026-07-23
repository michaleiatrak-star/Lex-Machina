---
name: dr-13-sluzby-bezpieczenstwo-informacje-niejawne
version: 3.6
description: |
  DR-13: Służby, Bezpieczeństwo, Informacje Niejawne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-13 — Służby, Bezpieczeństwo, Informacje Niejawne

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, uprawnienia, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, kompetencji, kary ani terminu wyłącznie z pamięci modelu.

**Prawo służb mundurowych było wielokrotnie nowelizowane w 2024–2025.**
Dz.U. 2025 poz. 1366 zmienia równocześnie: Policję, SG, PSP, ABW, AW, SKW, SWW, SOP.
Ustawa o obronie Ojczyzny (Dz.U. 2022 poz. 655) nie ma nowego t.j. — weryfikuj każdą nowelizację.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- **Prawo służb mundurowych zmieniane wielokrotnie w 2024–2025 — weryfikuj ZAWSZE**

---

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-122 Żołnierz (definicja ustawowa — ustawa o obronie Ojczyzny)
- BAS-134 Degradacja wojskowa — pozbawienie stopnia (art. 43ba-bb KK,
  przywrócenie przez MON → mod-prawa-obywatelskie-srodki-karne.md)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Służby, bezpieczeństwo, informacje niejawne — pojęcia (informacja niejawna, klauzula, dostęp) zdefiniowane wprost w ustawie o ochronie informacji niejawnych i pokryte w mod-ustawa-informacje-niejawne. Żaden plik shared/definicje/ nie obejmuje tej dziedziny.
## Moduły (10 łącznie — ✓ 10 OK, ☐ 0 STUB)

```
SŁUŻBY MUNDUROWE:
  [✓] OK    mod-ustawa-policja
              (Dz.U. 2024 poz. 1589 ze zm.: Dz.U. 2024 poz. 1248, 1562;
               Dz.U. 2025 poz. 1366 — zakwaterowanie funkcjonariuszy;
               legitymowanie, zatrzymanie, przeszukanie, środki przymusu,
               skargi, dyscyplina, odpowiedzialność SP; ustawa o śpbp Dz.U. 2023 poz. 202)
  [✓] OK    mod-ustawa-straz-graniczna
              (2026-07-21: dodano kontrolę legalności zatrudnienia/
               pobytu cudzoziemców [SG działa RÓWNOLEGLE z PIP],
               tryb kontroli za zawiadomieniem [7-30 dni, identyczny
               mechanizm jak ogólne Prawo przedsiębiorców], sprzeciw
               wobec czynności kontrolnych, obowiązki zgłoszeniowe
               pracodawcy, dobrowolne zgłoszenie się cudzoziemca do SG.
               Dotąd 195 linii czystego szkieletu proceduralnego bez
               tej treści. Odpowiedź na pytanie użytkownika)
              (Dz.U. 2024 poz. 1552 ze zm.: Dz.U. 2025 poz. 1366;
               kontrola graniczna, detencja cudzoziemca, zobowiązanie do powrotu,
               odmowa wjazdu, push-back, skargi, dyscyplina)
  [✓] OK    mod-ustawa-zandarmeria-wojskowa
              (Dz.U. 2024 poz. 1654 ze zm.;
               czynności wobec żołnierzy, dyscyplina wojskowa, odpowiedzialność)

SŁUŻBY SPECJALNE:
  [✓] OK    mod-ustawa-ABW-AW-CBA-sluzby-specjalne
              (ABW — Dz.U. 2024 poz. 1183 ze zm.; AW, CBA — Dz.U. 2024 poz. 1392; SOP;
               czynności operacyjno-rozpoznawcze, kontrola operacyjna z sądem,
               skargi: Kolegium/Sejm/RPO/ETPC; ustawa antyterrorystyczna Dz.U. 2024 poz. 1474)
  [✓] OK    mod-ustawa-sluzby-operacyjne-retencja-danych
              (czynności niejawne, poświadczenia bezpieczeństwa, retencja danych,
               odpowiedzialność za bezprawne działania, ETPC)

INFORMACJE NIEJAWNE:
  [✓] OK    mod-ustawa-informacje-niejawne
              (Dz.U. 2024 poz. 1612 ze zm.; klauzule ST/T/P/Z;
               postępowanie sprawdzające ABW/SKW, odmowa poświadczenia,
               tryb zaskarżenia do WSA, cofnięcie poświadczenia)

OBRONA I BEZPIECZEŃSTWO PAŃSTWA:
  [✓] OK    mod-ustawa-obrona-ojczyzny-mobilizacja
              (Dz.U. 2022 poz. 655 ze zm.: Dz.U. 2025 poz. 825, 1014;
               obowiązek obrony, kwalifikacja wojskowa WKU/WKL,
               WCR, mobilizacja, świadczenia na rzecz obrony, rekwizycja)
  [✓] OK    mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna
              (Dz.U. 2024 poz. 1907 ze zm.: Dz.U. 2025 poz. 1705; Dz.U. 2026 poz. 646;
               M.P. 2025 poz. 541 — Program Ochrony Ludności 2025–2026;
               obowiązki JST i przedsiębiorców, alerty RCB)

SZCZEGÓLNE ŚRODKI ZABEZPIECZAJĄCE:
  [✓] OK    mod-ustawa-szczegolne-srodki-zabezpieczajace
              (KOZZiD — Dz.U. 2020 poz. 2001 ze zm.;
               nadzór prewencyjny, izolacja sprawców najcięższych przestępstw)

OCHRONA PRZECIWPOŻAROWA:
  [✓] OK    mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa
              (PSP — Dz.U. 2025 poz. 1312 t.j.; ochrona przeciwpożarowa —
               Dz.U. 2025 poz. 188 t.j.; OSP — Dz.U. 2025 poz. 244 t.j.;
               WARN-29 zamknięty 2026-07-07 — trzy akty, jeden moduł domenowy;
               dyscyplinarka PSP rozdz. 11, status stowarzyszeniowy OSP,
               obowiązki właściciela obiektu w zakresie ppoż.)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-13-sluzby-bezpieczenstwo-informacje-niejawne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-13-sluzby-bezpieczenstwo-informacje-niejawne/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Cyberbezpieczeństwo państwa → `dr-11` → `mod-KSC-NIS2-cyberbezpieczenstwo-telekom`
- Zarządzanie kryzysowe JST → `dr-08` → `mod-ustawa-zarzadzanie-kryzysowe`
- Prawo karne wojskowe / odpowiedzialność karna → `dr-03`
- Zamówienia obronne (PZP obronna) → `dr-07`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | nsa.gov.pl | sn.pl

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

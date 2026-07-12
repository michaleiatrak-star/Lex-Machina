---
name: dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka
version: 3.2
description: |
  DR-14: Prawo UE, Międzynarodowe, Prawa Człowieka
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony obszar prawa UE / prawa międzynarodowego.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | echr.coe.int | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-14 — Prawo UE, Międzynarodowe, Prawa Człowieka

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, numeru rozporządzenia, artykułu traktatu, daty stosowania lub sygnatury:**
1. Zweryfikuj akty krajowe w `isap.sejm.gov.pl`
2. Zweryfikuj prawo UE i traktaty w `eur-lex.europa.eu`
3. Zweryfikuj orzeczenia ETPC w `hudoc.echr.coe.int`
4. Zweryfikuj orzeczenia TSUE w `curia.europa.eu`
5. **NIGDY** nie podawaj artykułu, terminu, etapu stosowania ani sygnatury wyłącznie z pamięci modelu.

**Kluczowe daty bezwzględnie weryfikować online:**
- EKPC: termin skargi do ETPC = **4 miesiące** (od 01.02.2022; poprzednio 6 miesięcy)
- Bruksela Ia: znosi exequatur w UE (od 10.01.2015) — weryfikuj wyjątki
- Pytanie prejudycjalne art. 267 TFUE: sąd ostatniej instancji ma OBOWIĄZEK, niższy — prawo

---

## Zasada architektoniczna
- Jeden moduł = jeden akt / obszar prawa UE lub prawa międzynarodowego
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — weryfikuj w ISAP i EUR-Lex**
- **Prawo UE zmienia się dynamicznie — etapy stosowania weryfikuj online**

---

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-113 Płeć społeczno-kulturowa / gender (brak definicji legalnej w PL;
  Konwencja stambulska CETS 210 art. 3 lit. c)
- mod-niewidomy-prawa-prawne.md — Konwencja ONZ o prawach osób niepełnosprawnych
  art. 13 (dostosowania proceduralne — skuteczny dostęp do wymiaru sprawiedliwości)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Prawo UE, międzynarodowe, prawa człowieka — definicje TFUE/TUE/KPP/EKPC mają charakter pierwotny (prawo traktatowe) i są pokryte wprost w modułach dziedzinowych (mod-KPP-karta-praw-podstawowych-UE, mod-EKPC-ETPC-prawa-czlowieka). Żaden plik shared/definicje/ nie obejmuje tej dziedziny.
## Moduły (8 łącznie — ✓ 8 OK, ☐ 0 STUB)

```
PRAWO PIERWOTNE UE I PROCEDURY TSUE:
  [✓] OK    mod-TFUE-TUE-prawo-pierwotne-UE
              (TUE + TFUE — Dz.Urz. UE C 326/2012; test transgraniczny;
               pytanie prejudycjalne art. 267 TFUE — tryb zwykły i pilny (PPU);
               pierwszeństwo prawa UE (Simmenthal/Costa); bezpośredni skutek
               (wertykalny/horyzontalny); odpowiedzialność odszkodowawcza państwa
               (Francovich/Brasserie du Pêcheur — art. 417¹ § 1 KC);
               rozporządzenia kolizyjne: Bruksela Ia, Rzym I/II, ENZ, ESCP)

PRAWA CZŁOWIEKA — STRASBURG:
  [✓] OK    mod-EKPC-ETPC-prawa-czlowieka
              (EKPC Dz.U. 1993 nr 61 poz. 284 ze zm.; KPP UE (Dz.Urz. UE C 326);
               skarga do ETPC: 4 miesiące + wyczerpanie środków + istotna niekorzyść;
               baza HUDOC; intake 8-punktowy; matryca dowodowa; strategia; ryzyka;
               7 protokołów dodatkowych ratyfikowanych przez Polskę — weryfikuj)

PRAWA CZŁOWIEKA — EUROPA/UE:
  [✓] OK    mod-KPP-karta-praw-podstawowych-UE
              (KPP — 7 tytułów, art. 1–54; stosowanie: tylko gdy wdrażane prawo UE;
               art. 47 — prawo do sądu; art. 50 — ne bis in idem; art. 7–8 — prywatność)

EGZEKUCJA I PROCEDURY TRANSGRANICZNE:
  [✓] OK    mod-KPC-egzekucja-transgraniczna-UE
              (KPC Dz.U. 2026 poz. 468 t.j.; Bruksela Ia — znosi exequatur;
               Bruksela IIb 2019/1111 (od 01.08.2022) — sprawy rodzinne;
               ENZ — europejski nakaz zapłaty (formularz A, sprzeciw);
               ESCP — drobne roszczenia do 5 000 EUR;
               doręczenia: Rozp. 2020/1784; apostille Haga 1961;
               uznanie art. 1145–1149 KPC; intake; 12 typowych zarzutów;
               3 warianty strategii; quality gate)

PRAWO PRYWATNE MIĘDZYNARODOWE:
  [✓] OK    mod-PMPP-prawo-prywatne-miedzynarodowe
              (ustawa PPM Dz.U. 2023 poz. 503 t.j.; Rzym I — ochrona konsumenta/pracownika;
               Rzym II — lex loci damni; Rozp. spadkowe 650/2012 — zwykłe miejsce pobytu;
               Haga 1980 (uprowadzenie dziecka), 1996, 2007 (alimenty);
               intake; matryca dowodowa; strategia; ryzyka; quality gate)

PRAWA CZŁOWIEKA — ONZ:
  [✓] OK    mod-ONZ-pakty-prawa-czlowieka
              (MPPOiP Dz.U. 1977 nr 38 poz. 167; MPPGSiK Dz.U. 1977 nr 38 poz. 169;
               CRPD Dz.U. 2012 poz. 1169; Komitet Praw Człowieka ONZ;
               skargi indywidualne po wyczerpaniu środków krajowych;
               hierarchia: umowy > ustawa, nie > Konstytucja)

NATO I UMOWY OBRONNE:
  [✓] OK    mod-NATO-umowy-miedzynarodowe
              (Traktat Waszyngtoński Dz.U. 1999 nr 87 poz. 970;
               SOFA Dz.U. 2000 nr 21 poz. 257;
               art. 5 — klauzula wzajemnej obrony; jurysdykcja nad obcymi żołnierzami;
               art. 42 TUE — wspólna obrona UE; zgoda Sejmu art. 117 Konstytucji)

NARZĘDZIE METODYCZNE:
  [✓] OK    mod-rejestr-zrodla-prawa-lifecycle
              (workflow kancelaryjny aktualności prawa: ISAP audit, stan prawny
               na dzień zdarzenia / pisma / orzekania; przepisy przejściowe;
               integruje: shared/ISAP-AUDIT-PROTOCOL + shared/TEMPORAL-LAW-CHECK +
               shared/LEGAL-LIFECYCLE-MANAGEMENT + shared/LEGAL-QUALITY-GATE)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Cyberprzestępstwa transgraniczne (dyrektywa NIS2, Budapest) → `dr-11`
- AI Act, DSA, DMA — regulacje sektorowe UE wymagają analizy merytorycznej → `dr-11` (mod-AI-Act-framework, mod-DSA-digital-services-act, mod-DMA-digital-markets-act); ten skill dostarcza podstawę praw podstawowych (KPP art. 47, EKPC) gdy decyzja krajowa na bazie tych regulacji jest zaskarżana
- Prawo karne UE (ENA, dyrektywy ofiarowe, Eurojust) → `dr-03`
- Prawo pracy UE (swoboda przepływu, dyrektywy pracownicze) → `dr-04`
- Zamówienia publiczne UE (dyrektywy 2014/24, 2014/25) → `dr-07`
- Obrona narodowa / NATO → `dr-13` → `mod-ustawa-obrona-ojczyzny-mobilizacja`
- Weryfikacja orzecznictwa TSUE/ETPC → `orzeczenia-sadowe-v2`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | echr.coe.int | curia.europa.eu | hcch.net

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

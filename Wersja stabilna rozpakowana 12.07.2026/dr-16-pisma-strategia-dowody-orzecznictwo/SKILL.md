---
name: dr-16-pisma-strategia-dowody-orzecznictwo
version: 3.2
description: |
  DR-16: Pisma, Strategia, Dowody, Orzecznictwo
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony obszar procesowy.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl | nsa.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-16 — Pisma, Strategia, Dowody, Orzecznictwo

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. Przy TSUE/ETPC — weryfikuj w `curia.europa.eu` / `hudoc.echr.coe.int`
4. **NIGDY** nie podawaj artykułu, terminu procesowego ani sygnatury wyłącznie z pamięci modelu.

**Obszar procesowy był nowelizowany w 2024–2026:**
- KPC — tekst jednolity Dz.U. 2026 poz. 468 — weryfikuj aktualność przed każdym użyciem.
- E-doręczenia i portal sądowy — przepisy wdrażane etapami; sprawdź aktualny stan w ISAP.
- Prawo prasowe — ustawa z 1984 r. wielokrotnie nowelizowana; weryfikuj Dz.U. ze zm.
- Ustawa o archiwach — sprawdź aktualny tekst jednolity w ISAP.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.) lub wydzielony obszar procesowy
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- **Terminy procesowe są terminami zawitymi — błąd daty może skutkować prekluzją**

---

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` — szkoda/damnum emergens/lucrum
  cessans — precyzja żądania pozwu; ⚠️ NOWE: siła wyższa + rebus sic stantibus
  (art. 357¹ KC) — przy pismach dot. niewykonania zobowiązań w nadzwyczajnych
  okolicznościach (wojna, inflacja, embargo)
- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny
  — KRYTYCZNE dla każdego pisma z terminem

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: interes
  prawny/faktyczny (strategia legitymacji procesowej), wyłączenie sędziego/
  biegłego, ocena wiarygodności świadka z interesem własnym, czynność prawna
  ukryta/pozorna (art. 83 KC) — przy zarzutach pozorności w pismach

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy redagowaniu pism rozważ doładowanie (`view`) definicji:
- BAS-103 Uprawdopodobnienie vs udowodnienie (ORKA-REG-02 — argumentacja dowodowa)
- BAS-W26 Szkoda / damnum emergens / lucrum cessans — precyzja żądania
- BAS-W27 Termin zawity vs przedawnienie vs instrukcyjny — KRYTYCZNE dla pism
- BAS-W28 Nadużycie prawa (art. 5 KC / art. 8 KP) — "ostatni bastion" argumentacji
- BAS-W30 Moc dowodowa dokumentu urzędowego vs prywatnego — strategia dowodowa
- BAS-W33/W34 Kara umowna i odsetki — precyzja żądań pozwu
- BAS-W35 Nakaz zapłaty: terminologia "sprzeciw" vs "zarzuty"

## Moduły (11 łącznie — ✓ 11 OK, ☐ 0 STUB)

```
KPC — PROCEDURY SZCZEGÓLNE I NARZĘDZIA PROCESOWE:
  [✓] OK    mod-KPC-przesluchanie-swiadkow
              (Dz.U. 2026 poz. 468 ze zm. — art. 258–305 KPC;
               typologia świadków, 10 technik procesowych, cross-examination,
               impeachment, sekwencje pytań, predykcja wyniku przesłuchania;
               KPK art. 171, 272, 391; KPC art. 259, 261 — WYMAGA WERYFIKACJI ISAP)

  [✓] OK    mod-KPC-e-doreczenia-portal-sadowy
              (Dz.U. 2026 poz. 468 ze zm.; ustawa o ustroju sądów powszechnych;
               regulamin urzędowania sądów; ustawa o skardze na przewlekłość;
               portal informacyjny, fikcja doręczenia, skargi administracyjne do prezesa,
               odróżnienie czynności orzeczniczych od administracyjnych)

  [✓] OK    mod-KPC-procedury-UE-TSUE-ETPC
              (KPC + Rozp. UE; Traktaty UE; EKPC i regulamin ETPC;
               pytania prejudycjalne TSUE, bezpośredni skutek i pierwszeństwo prawa UE,
               skargi do ETPC — status ofiary, wyczerpanie środków, termin 4 m-cy;
               odpowiedzialność odszkodowawcza za naruszenie prawa UE;
               weryfikacja: curia.europa.eu | hudoc.echr.coe.int | eur-lex.europa.eu)

  [✓] OK    mod-KPC-arbitraz-sportowy-dyscyplinarny
              (Dz.U. 2026 poz. 468 cz. V — arbitraż; ustawa o sporcie;
               bezpieczeństwo imprez masowych; regulaminy polskich związków sportowych;
               POLADA — przepisy antydopingowe; dyscyplinarki sportowe, transfery,
               licencje, odpowiedzialność klubów, arbitraż sportowy)

  [✓] OK    mod-KPC-wzory-pism-procesowych
              (Dz.U. 2026 poz. 468 t.j. — art. 126–130² KPC;
               wymogi formalne pisma procesowego, pozew o zapłatę art. 187 KPC,
               sprzeciw od nakazu zapłaty art. 503 KPC, zasady absolutne:
               podpis, adres, opłata, pełnomocnictwo, odpisy)

PRAWO MATERIALNE I USTROJOWE — ZASTOSOWANIE PROCESOWE:
  [✓] OK    mod-Konstytucja-prawa-i-wolnosci-procesowe
              (Konstytucja RP art. 45, 47, 51, 77; ustawa o TK; ustawa o RPO;
               KPC/KPA/PPSA/KPK w ścieżkach ochrony praw;
               skarga konstytucyjna, proporcjonalność, równość, prawo do sądu,
               wolność słowa, dostęp do informacji publicznej, RPO)

  [✓] OK    mod-ustawa-prawo-prasowe-media
              (Prawo prasowe — Dz.U. 2018 poz. 1914 ze zm.;
               ustawa o radiofonii i telewizji; KC/KPC; prawo autorskie;
               sprostowanie prasowe, odpowiedzialność redaktora naczelnego,
               ochrona źródeł, dobra osobiste, KRRiT)

  [✓] OK    mod-ustawa-archiwa-dokumentacja
              (Ustawa o narodowym zasobie archiwalnym i archiwach — Dz.U. 2020 poz. 164 ze zm.;
               KPA; ustawa o dostępie do informacji publicznej; RODO;
               retencja akt, udostępnienie dokumentacji, brakowanie,
               archiwizacja elektroniczna, akta osobowe, dowodzenie dokumentem archiwalnym)

  [✓] OK    mod-ustawa-obywatelstwo-paszporty-ewidencja
              (Ustawa o obywatelstwie polskim — Dz.U. 2024 poz. 80 ze zm.;
               ustawa o dokumentach paszportowych; ustawa o ewidencji ludności;
               ustawa o dowodach osobistych; Prawo o aktach stanu cywilnego;
               KPA/PPSA i przepisy konsularne;
               organy: Wojewoda, minister, konsul, kierownik USC, WSA/NSA)

NARZĘDZIA PRZEKROJOWE:
  [✓] OK    mod-narzedzie-kalkulatory
              (Kalkulator terminów procesowych, zachowku, nadgodzin, emerytury;
               tabela terminów zawitych z podstawami KPA/KPC/KP/KC/PPSA/KPSW;
               OSTRZEŻENIA: termin < 5 dni / termin minął — wywołaj automatycznie
               gdy sprawa wymaga obliczeń)

  [✓] OK    mod-narzedzie-kontroler-kompletnosci
              (Moduł nadrzędny dla prawo-polskie-v2; 10-punktowa checklista
               obowiązkowa przed każdą odpowiedzią z zakresu prawa polskiego;
               tabela decyzyjna: typ sprawy → moduł podstawowy → moduły wspierające;
               finalny quality gate 7 pytań kontrolnych)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-16-pisma-strategia-dowody-orzecznictwo/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-16-pisma-strategia-dowody-orzecznictwo/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Pisma procesowe kompleksowe → `pisma-procesowe-v3`
- Pisma proste / jednoinstancyjne → `pisma-proste-v2`
- Przesłuchanie świadków (zaawansowane) → `przesluchanie-swiadkow-v2-min90`
- Analiza dowodów → `analizator-dowodow-v3`
- Analiza akt / szanse sprawy → `analiza-sadowa-v6`
- Orzecznictwo (wyszukiwanie i weryfikacja) → `orzeczenia-sadowe-v2`
- Prawo UE / ETPC materialne → `dr-14`
- Koszty sądowe (KSCU) → `dr-12` → `mod-KSCU-koszty-sadowe-i-pomoc-prawna`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl | nsa.gov.pl | curia.europa.eu | hudoc.echr.coe.int

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

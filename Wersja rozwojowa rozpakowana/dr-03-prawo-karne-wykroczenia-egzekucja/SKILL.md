---
name: dr-03-prawo-karne-wykroczenia-egzekucja
version: 2.8
description: |
  DR-03: Prawo Karne, Wykroczenia, Egzekucja
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-03 — Prawo Karne, Wykroczenia, Egzekucja

## ⛔ OBOWIĄZKOWY KWALIFIKATOR — dla każdej sprawy karnej/wykroczeniowej

> Dodano: 2026-07-06 (utrwalenie preferencji użytkownika "Karne:
> +kwalifikator"). UWAGA DEDUP: zasada i pełne drzewo decyzyjne JUŻ
> istnieją jako `prawny-router-v3` UP-3 (sekcja "PREFERENCJE UŻYTKOWNIKA")
> + moduł kanoniczny poniżej — ten wpis to tylko punkt wejścia z poziomu
> DR-03, NIE nowa treść (nie duplikować dalej).

Dla KAŻDEJ sprawy karnej/wykroczeniowej (nie tylko na wyraźne żądanie
użytkownika) obowiązkowe jest przejście przez drzewo decyzyjne kwalifikacji
przed podaniem jakiejkolwiek analizy lub pisma:

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
```

Zasada naczelna modułu (skrót): nigdy nie kwalifikuj czynu bez przejścia
przez drzewo; kwalifikacja oparta na chronologii faktów, nie na pierwszym
pasującym przepisie; każdy przepis weryfikowany w ISAP przed użyciem
(zgodnie z zasadą 2 `prawo-polskie-v2/SKILL.md` / UP-2 routera). Jeśli czyn
wyczerpuje znamiona więcej niż jednego przepisu — kwalifikacja kumulatywna
(art. 11 § 2 KK), nie wybór arbitralny.

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

## Moduły (33 łącznie — ✓ 33 OK, ☐ 0 STUB; 1 przeniesiony do shared/)
## ⚠️ 2026-07-15: naprawiono niezgodność dysk↔lista — 4 pliki istniały na
## dysku, ale nie były wpisane poniżej: mod-KK-art291-pranie-pieniedzy,
## mod-ustawa-fundusz-pomocy-pokrzywdzonym, mod-ustawa-narkomania,
## mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych — dodane na końcu listy.

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
              (⚠️ 2026-07-15: dodano BLOK 0 — Część Ogólna KK (klasyfikacja
               zbrodnia/występek/materialne/formalne/kontratypy — odpowiedź
               na pytanie o zgodność z doktrynalnym podziałem przestępstw;
               obrona konieczna art. 25 i stan wyższej konieczności art. 26
               w pełni, wcześniej jedno zdanie bez treści); BLOK H —
               przestępczość zorganizowana art. 258 KK; BLOK I —
               zabójstwa/pobicia art. 148/158-159 KK; BLOK J — przestępstwa
               seksualne art. 197-205 KK w tym wobec dzieci/niepełnosprawnych
               + Rejestr Sprawców Dz.U. 2026.110; BLOK L — uszkodzenie
               mienia art. 288 KK / art. 124 KW z progiem 800 zł (część
               2/6 naprawy); BLOK G rozbudowany — podsłuch/nagrania,
               rozróżnienie uczestnik/osoba trzecia art. 267 §2-4 KK,
               GPS (SN V KK 505/18), kontrola operacyjna służb (część
               5/6 naprawy); wszystkie wcześniej
               całkowicie nieobecne lub tylko wzmiankowane w tabelach)
  [✓] OK    mod-KK-przemoc-domowa-szczegolowy
  [✓] OK    mod-KKS-karny-skarbowy-i-AML
              (⚠️ 2026-07-15: rozbudowany o konkretne artykuły KKS —
               art. 54/55/56/62/76, czynny żal art. 16 KKS, zbieg z KK
               przy karuzelach VAT — wcześniej sam szkielet proceduralny)
  [✓] OK    mod-KKW-kodeks-karny-wykonawczy
  [✓] OK    mod-KPK-tryby-scigania
  [✓] NOWY  mod-tajemnica-zawodowa-poufnosc
              (utworzony 2026-07-15, część 4/6 naprawy; art. 266 KK —
               naruszenie tajemnicy zawodowej/służbowej, zbieg z art. 23
               UZNK, konsolidująca mapa 12 kategorii poufności w systemie;
               wcześniej temat całkowicie nieobecny od strony karnej)
  [✓] NOWY  mod-przymusowe-leczenie-odwykowe
              (utworzony 2026-07-15, część 3/6 naprawy; alkohol — ustawa
               o wychowaniu w trzeźwości art. 24-36, GKRPA→sąd rodzinny;
               narkotyki — ustawa o przeciwdziałaniu narkomanii art. 25-30
               nieletni, art. 71-73a dorośli sprawcy przestępstw; wcześniej
               temat całkowicie nieobecny)
  [✓] NOWY  mod-KPK-wspolpraca-miedzynarodowa-karna
              (utworzony 2026-07-15; ENA — KPK rozdz. 65a-65d; EPPO —
               Dział XIIa KPK, Polska przystąpiła po pierwotnym opt-out;
               Europol/Eurojust — rola pomocnicza, nie śledcza; Konwencja
               Palermska Dz.U. 2005 nr 18 poz. 158)
  [✓] OK    mod-KW-KPW-framework-szczegolowy
              (nowe art. 86c KW — celowy drift/poślizg od 29.01.2026; zloty bez zgłoszenia;
               taryfikator: rozp. Dz.U. 2026 poz. 724 — weryfikuj kody)
  [✓] OK    mod-KW-kodeks-wykroczen
  [✓] OK    mod-KW-art119-131-przeciwko-mieniu
              (dodany 2026-07-17: Rozdz. XIV KW — kradzież/przywłaszczenie
               (art. 119, próg 800 zł), paserstwo (122), zniszczenie mienia
               (124) + KLUCZOWE wyłączenia progu kwotowego (broń/amunicja,
               szczególna zuchwałość/włamanie, przemoc/groźba — zawsze
               przestępstwo niezależnie od wartości). Najwyższy priorytet
               z audytu pokrycia KW — dotąd tylko sam próg bez treści)
  [✓] OK    mod-KW-art49-64-porzadek-publiczny
              (dodany 2026-07-17: Rozdz. VIII KW — art. 51 (zakłócanie
               spokoju/porządku/spoczynku nocnego, JEDEN Z NAJCZĘŚCIEJ
               STOSOWANYCH przepisów KW), charakter chuligański i jego
               konsekwencje, art. 49/49a/50/52. Drugi priorytet z audytu
               pokrycia KW)
  [✓] OK    mod-KK-art127-139-przeciwko-RP
              (dodany 2026-07-17: Rozdz. XVII KK — szpiegostwo (art. 130,
               radykalnie zaostrzone reformą 17.08.2023 w reakcji na wojnę
               Rosji przeciw Ukrainie), czynny żal (131), dezinformacja
               wywiadowcza (132, ⚠️ zakres węższy niż nazwa sugeruje),
               zasada wzajemności rozszerzona na PAŃSTWO SOJUSZNICZE (138).
               Priorytet podniesiony przez użytkownika ze względu na
               obecną sytuację bezpieczeństwa)
  [✓] OK    mod-KK-art163-172-bezpieczenstwo-powszechne
              (dodany 2026-07-17: Rozdz. XX KK — sprowadzenie zdarzenia
               niebezpiecznego (163), OCHRONA INFRASTRUKTURY KRYTYCZNEJ
               fizycznej i cyfrowej (165 §1 pkt 3-4 — sieci energia/woda/
               gaz/ciepło + systemy informatyczne), finansowanie
               terroryzmu (165a). Priorytet podniesiony przez użytkownika
               — bezpieczeństwo infrastruktury krytycznej)
  [✓] OK    mod-KK-art181-188a-przeciwko-srodowisku
              (dodany 2026-07-17: Rozdz. XXII KK — zanieczyszczenie
               środowiska (182), gospodarka odpadami (183, najczęstsza
               podstawa odpowiedzialności przedsiębiorców), typ
               kwalifikowany ze skutkiem śmiertelnym (185), czynny żal
               przez naprawienie szkody. Priorytet wskazany przez
               użytkownika — "jeden z powszechniejszych tematów")
  [✓] OK    mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie
              (dodany 2026-07-17: Rozdz. X, XII, XIII KW — bezpieczeństwo
               osób/mienia (art. 70-71, 77-79, 83), przeciwko osobie w
               tym CENTRALNY art. 107 złośliwe niepokojenie (104-108),
               przeciwko zdrowiu w tym szczepienia i choroby zakaźne
               (109-118). Kontynuacja uzupełniania KW)
  [✓] OK    mod-KW-art132-166-pozostale-rozdzialy
              (dodany 2026-07-17: Rozdz. XV-XIX KW — konsumenci (132-139c),
               obyczajność publiczna (140-142), urządzenia użytku
               publicznego (143-145), obowiązek ewidencji (146-147a),
               szkodnictwo leśne/polne/ogrodowe (148-166, częściowo).
               DOMYKA pokrycie części szczególnej KW — wszystkie 12
               rozdziałów mają teraz co najmniej podstawowe pokrycie)
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
  [✓] OK    mod-KK-art291-pranie-pieniedzy
              (paserstwo art. 291-293 KK + pranie pieniędzy art. 299 KK — dopisany do
               listy 2026-07-15, plik istniał wcześniej, patrz naprawa wyżej)
  [✓] OK    mod-ustawa-fundusz-pomocy-pokrzywdzonym
              (dopisany do listy 2026-07-15, plik istniał wcześniej)
  [✓] OK    mod-ustawa-narkomania
              (dopisany do listy 2026-07-15, plik istniał wcześniej — powiązany z
               nowym mod-przymusowe-leczenie-odwykowe.md, sekcja B tego modułu)
  [✓] OK    mod-KPK-mediacja-sprawiedliwosc-naprawcza
              (dodany 2026-07-17: art. 23a KPK §1-7, mediacja karna od 2003,
               rozszerzona na wykroczenia od 2015, idea sprawiedliwości
               naprawczej, przesłanki kwalifikacji, poufność/art. 178a KPK.
               Wypełnia lukę zidentyfikowaną w audycie mediacji — komplementarny
               z dr-12/mod-techniki-mediacyjne-negocjacyjne, nie duplikuje
               ogólnych technik)
  [✓] OK    mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych
  [✓] OK    mod-KK-slupy-fikcyjna-reprezentacja-spolki
              (dodany 2026-07-17: odpowiedzialność karna "słupów" jako
               prezesów/wspólników — współsprawstwo/pomocnictwo art. 18,
               rozbieżność orzecznictwa co do świadomości, powiązanie z
               art. 296 KK i art. 586-590 KSH; fikcyjna reprezentacja
               spółki — falsus procurator art. 103 KC, fałszywy organ
               art. 39 KC per analogiam, bezskuteczność zawieszona,
               ochrona przez wpis w KRS. Potwierdzono, że korupcja i
               poplecznictwo są już dobrze pokryte — bez duplikacji)
              (odpowiedzialność karna spółek — dopisany do listy 2026-07-15, plik
               istniał wcześniej)
```

> **Przeniesiony do shared/ (2026-07-12):** `mod-KK-stalking-szczegolowy` był
> bajt-w-bajt identyczny z `prawny-router-v3/references/stalking-nekanie.md`
> (wykryte przez `ci_check_shared.py`). Scalony pod jedną kanoniczną lokalizacją:
> `view /mnt/skills/user/shared/STALKING-NEKANIE.md`. Ładuj stamtąd bezpośrednio —
> `mod-KK-art190a-stalking.md` zawiera odesłanie. Pełny opis:
> `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` NOTA-12.

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

---
name: shared
version: "3.21"   # ⛔ CUDZYSŁÓW OBOWIĄZKOWY: niecytowane `3.17` YAML parsuje
                  # jako float 3.17, a 3.17 < 3.9 — porządek wersji odwraca się
                  # dla każdego narzędzia porównującego liczbowo. Wykryte
                  # testem T12 (check_wersje_changelog.py), 2026-08-20z.
type: library
entrypoint: SKILL.md
compatibility: "wszystkie skille prawne systemu"
description: >-
  Biblioteka plików kanonicznych systemu prawnych skilli — hardgate, walidacja,
  definicje, terminy, moduły kancelaryjne. NIE jest samodzielnym skillem i NIE
  odpowiada na zapytania użytkownika: moduły wczytują inne skille przez `view`.
  Pełny spis modułów — tabele „Zawartość katalogu" w treści tego pliku.
dependencies:
  requires: []
  # `shared` z definicji powinien być warstwą bazową bez zależności
  # zwrotnych do skili nadrzędnych — patrz limitations poniżej dla
  # ODSTĘPSTWA znanego i zweryfikowanego ręcznie 2026-07-04.
  called_by:
    - wszystkie 31 pozostałych skille systemu (in-degree najwyższy w systemie)
inputs:
  - żadne bezpośrednie — pliki wczytywane (`view`) przez inne skille w
    trakcie ich własnych pipeline'ów
outputs:
  - treść modułu wczytana do kontekstu skilla wywołującego (nie generuje
    samodzielnego outputu)
confidence: n/a
  # moduły proceduralne (walidacja, hardgate, śledzenie kroków) — nie
  # zawierają samodzielnych twierdzeń merytorycznych podlegających ocenie
  # wiarygodności; PRAWO-HARDGATE.md wymusza weryfikację online dla treści
  # dodawanej PRZEZ skille wywołujące, nie przez shared samo
escalation:
  - plik kanoniczny nieznaleziony/uszkodzony → skill wywołujący MUSI
    zatrzymać się i zgłosić błąd, nie kontynuować z pamięci
limitations:
  - "ZNANE ODSTĘPSTWO od zasady 'shared = warstwa bazowa bez zależności
    zwrotnych', zweryfikowane ręcznie 2026-07-04 (FAZA 2E audyt-systemu-v4):
    5 plików zawiera instrukcję `view` wprost do konkretnego skilla
    nadrzędnego — MOD-METODY-BADAWCZE.md → analizator-dowodow-v3/SKILL.md;
    PRE-W2-VERIFICATION-GATE.md i MOD-IDENTYFIKACJA-STRONY-UMOWY.md →
    pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md;
    MOD-MAPA-PRZEPISOW.md → analizator-przepisow-v2/SKILL.md;
    ORZECZENIA-OUTPUT-SCHEMA.md → orzeczenia-sadowe-v2/SKILL.md;
    raport-sytuacyjny-integracja.md → raport-sytuacyjny-v2/SKILL.md.
    NIE scalone/wydzielone w tej sesji — pole `dependencies.requires`
    zostawione jako [] (zgodnie z zasadą architektoniczną), ODSTĘPSTWO
    opisane tu jawnie, żeby FAZA 2E w trybie deklarowanym go NIE zgubiła.
    Decyzja architektoniczna (uznać jako świadomy wzorzec 'plik-most' czy
    wydzielić poza shared/) pozostaje OTWARTA — do następnego audytu."
  - rozmiar (196 plików, ~2,4 MB — stan 2026-08-23) — każda zmiana pliku kanonicznego ma
    potencjalnie systemowy promień rażenia; edytować tylko przez
    audyt-systemu-v4 z pełną weryfikacją CHECKLIST-DEDUP.md
required_modules: []
  # nie ma zastosowania — shared jest wczytywany, nie wczytuje sam siebie
changelog: |
  Wersja bieżąca: 3.21. ⛔ PEŁNA HISTORIA — WYŁĄCZNIE w references/CHANGELOG.md
  (standard 2026-08-20z4: jedna lokalizacja; zakaz sekcji changelogu w korpusie
  SKILL.md i zakaz pełnej listy wpisów w tym polu — pole to było już raz
  porządkowane, miało 111 linii).
  Skrót 3.20 (2026-08-23h, F-111 wariant B): PRAWO-HARDGATE.md podzielony
  967 → 501 l. rdzenia + nowy PRAWO-HARDGATE-ORZECZENIA.md (464 l.), wyzwalacz
  binarny (sygnatura w tekście); 88 linii historii bramki wyniesione z korpusu.
  Skrót 3.19: usunięto 6 plików historycznych bez roli operacyjnej (202 → 196).
  Skrót 3.18: pole changelog: w YAML miało 111 linii — wyniesione do references/.
---

# shared/ — Wspólne moduły systemu prawnych skilli

Katalog zawiera pliki kanoniczne współdzielone przez wszystkie skille prawne.
Nie jest samodzielnym skillem — pełni rolę biblioteki referencji.

## Zawartość katalogu

| Plik | Rola |
|------|------|
| `PRAWO-HARDGATE.md` | ⛔ Globalny zakaz cytowania prawa/orzeczeń z pamięci — RDZEŃ, wczytaj przed każdym przepisem (zasada absolutna, PERMANENT GATE, hierarchia statusów, BRAMKA ANTY-FASADOWA, KROK 2B/2C). Podzielony 2026-08-23h, F-111: 967 → 501 l. |
| `PRAWO-HARDGATE-ORZECZENIA.md` | ⛔ ZAŁĄCZNIK orzeczniczy tej samej bramki — wczytaj ZAWSZE, gdy w tekście ma stanąć SYGNATURA (procedura przed orzeczeniem, WTÓRNE-ŹRÓDŁO-STOP, KROK 5A/5B, warstwy uzasadnienia [1]/[2]/[3], self-check orzeczniczy). NIE jest samodzielny — rdzeń obowiązuje równolegle (dodane 2026-08-23h, F-111) |
| `DOMAIN-LOCK.md` | ⛔ Bramka izolacji dziedzinowej — kontrola na WYJŚCIU, zakaz kwalifikacji spoza PRIMARY bez podstawy faktycznej (dodane 2026-08-23) |
| `RATE-COMPLETENESS.md` | ⛔ Bramka kompletności szeregu stawek — odsetki/waloryzacja jako funkcja czasu, nie pojedyncza liczba (dodane 2026-08-23) |
| `MOD-GENERATOR-AKTU.md` | Procedura budowy modułu aktu prawnego G-1…G-8 — od spisu treści aktu, nie od pytania (dodane 2026-08-23) |
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa — auto-raport braków po piśmie (Fazy 1–3) |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3) |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu gotowego pisma |
| `MOD-WALIDACJA_v2.md` | ⭐ Walidacja formalna i prawnicza pisma (bloki A–J) — **JEDYNE ŹRÓDŁO PRAWDY** |
| `FACT-SOURCE-LOCK.md` | Klasyfikacja faktów FSL-A/B/C — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `LEGAL-STATUS-LOCK.md` | Weryfikacja statusów aktów LSL-1..6 — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `terminy.md` | Tabela terminów zawitych i przedawnień (KPC, KPK, KPW, KPA, KP, PPSA) |
| `FAKTY_v2.md`                        | Weryfikacja zgodności faktycznej pisma ze źródłem (MOD-FAKTY) |
| `raport-sytuacyjny-integracja.md` | Sekwencja wywołania widgetu Raportu Sytuacyjnego v2 |
| `MOD-STEP-TRACKER.md` | ⛔ Śledzenie kroków i raportowanie pominięć — inicjowany w KROK 0-TRACKER routera; każde pominięcie = obowiązek poinformowania użytkownika + czekanie na decyzję |
| `MOD-REJESTR-POKRYCIA-JEDNOSTEK.md` | ⛔ Rejestr plikowy (RPK) pokrycia zbiorów ≥10 ponumerowanych jednostek (kazusy, dokumenty, świadkowie...) w sesji wieloturowej — inicjowany PRZED podziałem na partie, commit po KAŻDEJ partii, obowiązkowy odczyt po kompaktowaniu; zapobiega cichemu pominięciu pojedynczych jednostek |
| `DEFINICJE-KLUCZOWE.md` | Router do 10 plików w `definicje/`: DEF-PODMIOTY-WLASNOSC, DEF-ODPOWIEDZIALNOSC-SZKODA, DEF-PRACA, DEF-PROCEDURA, DEF-BUDOWLANE-DROGOWE, DEF-PODATKOWE, DEF-CYWILNE-WYKLADNIA, DEF-ADMINISTRACYJNE, DEF-INTERES-WLASNY-WYLACZENIA, METODOLOGIA-ORKA2 |
| `MOD-DOKUMENT-GATES.md` | ⛔ Osiem bramek pracy na dokumentach (§1 DOCUMENT-SCAN-PROMPT, §2 FOUNDATION-VERIFICATION-GATE, §3 EXHAUSTIVE-EXTRACTION-GATE, §4 IMMEDIATE-LOGICAL-SCAN, §5 CROSS-DOCUMENT-CONSISTENCY-CHECK, §6 ENTITY-DISAMBIGUATION-TABLE, §7 EVIDENCE-THREAD-LINKING, §8 QUOTE-VERIFICATION-DEFAULT). Konsumenci: `przesluchanie-swiadkow-v2-min90` (PRE-W1a.5 DG-LOAD) i `analizator-dowodow-v3` (KROK 0d DG-LOAD). Utworzony 2026-08-20z przez wydzielenie z pierwszego z nich (F-100 A) — treść przeniesiona 1:1 |
| `mod-niewidomy-prawa-prawne.md` | Osoba niewidoma: prawa procesowe KPK/KPC, ulgi, stopnie niepełnosprawności, Konwencja ONZ o prawach osób niepełnosprawnych |

Pliki w `prawny-router-v3/references/` (nie w shared, ale powiązane):
| `pokrycie-dziedzinowe.md` | Pełna mapa dziedzin → modułów → powiązanych skilli (28 dziedzin) |

Wszystkie pliki są kanoniczne — nie istnieją stuby ani kopie w innych lokalizacjach.

## tools/ — narzędzia produkcyjne (kod, nie markdown)

`shared/tools/` zawiera skrypty uruchamiane przez portal poza sesją modelu
— nie wczytuj ich przez `view()`, to nie są moduły promptowe:

| Plik | Rola |
|------|------|
| `tools/walidator_cytowan.py` | Deterministyczna bramka: sprawdza, czy każde powołanie w gotowym piśmie ma odpowiadający log web_fetch. Pełny opis: `tools/README.md` |

## Jak korzystać

Każdy skill wczytuje pliki z tego katalogu bezpośrednio przez `view`:

```
view /mnt/skills/user/shared/MOD-STEP-TRACKER.md  ← KROK 0-TRACKER (przed wszystkim — ST-INIT)
view /mnt/skills/user/shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md  ← RPK-INIT (gdy zbiór ≥10 ponumerowanych jednostek, np. seria kazusów)
view /mnt/skills/user/shared/PRAWO-HARDGATE.md  ← wymagane przed każdym przepisem
view /mnt/skills/user/shared/PRAWO-HARDGATE-ORZECZENIA.md  ← DODATKOWO, zawsze gdy pada SYGNATURA orzeczenia (F-111)
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/POST-VALIDATION.md
view /mnt/skills/user/shared/terminy.md
view /mnt/skills/user/shared/FAKTY_v2.md
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```

Nie wczytuj wszystkich naraz — tylko te potrzebne dla danego kroku.

> **Uwaga:** `raport-sytuacyjny-integracja.md` jest wywoływany przez `prawny-router-v3`
> opisowo (punkty self-check [A]/[B]/[C]). Skille dziedzinowe nie wywołują go przez `view` —
> logika wyzwalania jest w routerze. `FAKTY_v2.md` jest wbudowany bezpośrednio w `pisma-procesowe-v3`
> i `pisma-proste-v2` (sekcje MOD-FAKTY / M-FAKTY) — wywołanie przez `view` możliwe gdy potrzebna
> jest pełna wersja modułu.

## Zasada utrzymania (v2.1 — 2026-06-04)

- `DEPENDENCY-GRAPH.md` — pełna mapa zależności: który skill wywołuje który moduł; aktualizuj przy każdej zmianie
- ⚠️ Katalog `archive/` NIE istnieje na dysku (zweryfikowano 2026-06-14) — wcześniejsze
  wzmianki o "43 plikach nieaktywnych" są nieaktualne.
- ⛔ **Oznaczanie in-situ przestało być polityką (2026-08-23, v3.19).** Wcześniej pliki
  wycofane zostawały na dysku z nagłówkiem „⛔ DEPRECATED" (tak leżał `AKTY-PRAWNE-MASTER.md`
  przez dwa i pół miesiąca). Wynik: plik bez roli, który mimo to trzeba było czytać przy
  każdym audycie, żeby stwierdzić, że nie ma roli. Od v3.19 plik wycofany jest **usuwany**,
  a uzasadnienie i data trafiają do `references/CHANGELOG.md` — historia zostaje, plik nie.

- Wszystkie pliki w tym katalogu są **kanoniczne** — jedyna kopia w systemie
- Stuby lokalne w katalogach poszczególnych skilli zostały usunięte
- Skille wywołują pliki bezpośrednio przez `view /mnt/skills/user/shared/X.md`
- Nie twórz lokalnych kopii ani stubów — aktualizuj tylko ten katalog

## Moduły kancelaryjne v3.0 — obowiązkowe moduły współdzielone

| Plik | Rola |
|------|------|
| `FORMAL-CHECK.md` | Centralna walidacja formalna pisma i decyzja: gotowe / uzupełnić / nie składać |
| `BRAKI-FORMALNE.md` | Klasyfikacja braków krytycznych, istotnych i technicznych |
| `WARUNKI-SKUTECZNOSCI.md` | Warunki procesowej skuteczności pozwu, apelacji, zażalenia, sprzeciwu, KPA itd. |
| `TRYBY-PROCESOWE.md` | Centralny rejestr trybów, etapów, rygorów i modułów do wczytania |
| `PREKLUZJA-DOWODOWA.md` | Kontrola spóźnionych twierdzeń i dowodów |
| `TERM-CALC.md` | Metodologia kontroli terminów; nie zastępuje kalendarza sądowego |
| `ZAZALENIE-ADRESAT-GATE.md` | Bramka: adresat zażalenia/odwołania/skargi (poziome vs dewolutywne, za pośrednictwem) — obowiązkowa przy każdym środku zaskarżenia (dodano 2026-07-25) |
| `WLASCIWOSC-GATE.md` | Bramka siostrzana: właściwość rzeczowa/miejscowa/funkcjonalna sądu/organu przy WNOSZENIU sprawy (pozew/wniosek) — obowiązkowa przy każdym piśmie inicjującym postępowanie (dodano 2026-07-27, na pytanie użytkownika) |
| `ZAWIADOMIENIA-KRZYZOWE.md` | Obowiązek instytucji (PIP, KAS, sąd) do zawiadamiania prokuratury/Policji o przestępstwie ujawnionym przy okazji własnego postępowania (art. 304 KPK) — kontrole krzyżowe między organami (dodano 2026-07-27, na pytanie użytkownika) |
| `RISK-ASSESSMENT.md` | Matryca ryzyka formalnego, dowodowego, prawnego i kosztowego |
| `ORZECZENIA-HIERARCHIA.md` | Hierarchia orzecznictwa, test aktualności i karta orzeczenia |
| `DOWODY-METODOLOGIA.md` | Matryca dowodowa i test wiarygodności dowodu |
| `ROSZCZENIA.md` | Konstrukcja roszczeń głównych, ewentualnych i alternatywnych |
| `STRATEGIA-PROCESOWA.md` | Taktyka procesowa i wybór następnego ruchu |
| `QUALITY-CHECK.md` | Kontrola jakości pisma: logika, struktura, nadmiar, emocjonalność |
| `KANCELARIA-WORKFLOW.md` | Sekwencja pracy kancelaryjnej możliwa w `.md skills` |
| `MOD-TIMING.md` | Strategia timing składania pism — macierz T1–T5, 6 modeli (T-EARLY…T-ADVANCE-NOTICE) |
| `MOD-PEER-REVIEW.md` | Weryfikacja krzyżowa pisma — 4 role (adwokat diabła, sędzia, klient, spójność) |
| `MOD-INTRO.md` | Executive summary pisma (str. 1) — 2–5 zdań, max 150 słów, killer argument na str. 1 |
| `MOD-KONCENTRACJA.md` | Metryka długości pisma per typ — limity orientacyjne, algorytm K1–K4, reguły skracania |
| `MOD-DOKTRYNA.md` | Polityka cytowania komentarzy i doktryny — hierarchia D-1–D-4, formaty, HARDGATEs |
| `MOD-WIDGET-IO.md` | ⭐ Obligatoryjny pasek Import/Export dla widgetów analitycznych — matryca per skill, wzorzec HTML/CSS/JS, reguły IO-1–IO-8 |
| `MOD-KARTA-DOWODU.md` | ⛔ Karta dowodowa i graf faktów — pisma-procesowe-v3 W1.2c-PRE (po SD-SKAN, przed macierzą MT1); analizator-dowodow-v3 BLOK-B2 |
| `MOD-ELIMINACJA-TEZ.md` | ⛔ Eliminacja tez, żądań i przepisów bez pokrycia prawnego — pisma-procesowe-v3 W1.2a-POST (po CLAIM-VALIDATION, przed W1.3); analizator-dowodow-v3 BLOK-C |
| `MOD-BUDOWA-ARGUMENTU.md` | ⛔ Obowiązkowy schemat budowy każdego argumentu — W2.2, każdy akapit uzasadnienia |
| `MOD-KOSZT-ODPOWIEDZI.md` | ⛔ Optymalizacja kosztu procesowego dla przeciwnika — W2.2 dla każdego głównego twierdzenia + W3.6a AUDYT-KOŃCOWY |
| `MOD-MIKROPODSUMOWANIA.md` | ⛔ Obowiązkowe podsumowanie każdego rozdziału uzasadnienia — W2.2, koniec każdej sekcji numerowanej |
| `MOD-SKUTEK-PROCESOWY.md` | ⛔ Obowiązkowy blok skutku procesowego — W2.2, koniec każdego bloku uzasadnienia klasy A/B |
| `MOD-STRESS-TEST.md` | ⛔ Symulacja odpowiedzi pełnomocnika pozwanego — po W2 (projekt pisma), przed W3 / AUDYT-KOŃCOWY |

### Obowiązkowe wywołania dla generatorów pism

Przy każdym piśmie gotowym do złożenia generator musi co najmniej wczytać:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/FORMAL-CHECK.md
view /mnt/skills/user/shared/BRAKI-FORMALNE.md
view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Gdy występują terminy, dowody, orzecznictwo albo strategia, dodatkowo:

```text
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
view /mnt/skills/user/shared/ROSZCZENIA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
```

Gdy pismo wymaga executive summary, metryki długości lub peer review:

```text
view /mnt/skills/user/shared/MOD-INTRO.md           (pozew/apelacja/pismo >3 str.)
view /mnt/skills/user/shared/MOD-KONCENTRACJA.md    (kontrola długości — zawsze)
view /mnt/skills/user/shared/MOD-PEER-REVIEW.md     (gdy WPS>50k / ≥3 żądania / apelacja)
view /mnt/skills/user/shared/MOD-DOKTRYNA.md        (gdy cytowanie komentarzy w W2)
view /mnt/skills/user/shared/MOD-TIMING.md          (gdy pytanie o timing złożenia)
```

Przed W1.3 (eliminacja tez bez pokrycia) i w trakcie W1.2c-PRE (karta dowodowa), obowiązkowo:

```text
view /mnt/skills/user/shared/MOD-ELIMINACJA-TEZ.md  (⛔ W1.2a-POST, po CLAIM-VALIDATION)
view /mnt/skills/user/shared/MOD-KARTA-DOWODU.md    (⛔ W1.2c-PRE, po SD-SKAN)
```

W W2.2 (redakcja każdego bloku uzasadnienia), obowiązkowo w tej kolejności:

```text
view /mnt/skills/user/shared/MOD-BUDOWA-ARGUMENTU.md    (⛔ każdy akapit uzasadnienia)
view /mnt/skills/user/shared/MOD-KOSZT-ODPOWIEDZI.md    (⛔ każde główne twierdzenie)
view /mnt/skills/user/shared/MOD-SKUTEK-PROCESOWY.md    (⛔ koniec bloku klasy A/B)
view /mnt/skills/user/shared/MOD-MIKROPODSUMOWANIA.md   (⛔ koniec każdego rozdziału)
```

Po W2 (projekt pisma gotowy), przed W3/AUDYT-KOŃCOWY, obowiązkowo:

```text
view /mnt/skills/user/shared/MOD-STRESS-TEST.md     (⛔ symulacja odpowiedzi pełnomocnika pozwanego)
```

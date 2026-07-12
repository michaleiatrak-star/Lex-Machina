---
name: shared
version: 2.6
type: library
entrypoint: SKILL.md
compatibility: "wszystkie skille prawne systemu"
description: |
  Biblioteka współdzielonych modułów systemu prawnych skilli. NIE jest
  samodzielnym skillem — zawiera pliki kanoniczne wczytywane przez inne
  skille przez view.

  Zawiera: PRAWO-HARDGATE (zakaz cytowania prawa/orzeczeń z pamięci),
  HYBRID-VALIDATION (walidacja po piśmie), INTAKE-GAP (braki danych,
  pola, tryby 1-3), POST-VALIDATION, MOD-WALIDACJA_v2 (bloki A-J),
  FACT-SOURCE-LOCK (FSL-A/B/C), LEGAL-STATUS-LOCK (LSL-1..6), terminy
  (terminy KPC/KPK/KPW/KPA/KP), FAKTY (zgodność faktyczna pisma),
  raport-sytuacyjny-integracja (widget Raportu Sytuacyjnego v2),
  MOD-STEP-TRACKER (v1.0.0 — śledzenie kroków i raportowanie pominięć),
  DEFINICJE-KLUCZOWE (router do 9 plików w definicje/: DEF-PODMIOTY-WLASNOSC,
  DEF-ODPOWIEDZIALNOSC-SZKODA, DEF-PRACA, DEF-PROCEDURA, DEF-BUDOWLANE-DROGOWE,
  DEF-PODATKOWE, DEF-CYWILNE-WYKLADNIA, DEF-ADMINISTRACYJNE, METODOLOGIA-ORKA2),
  mod-niewidomy-prawa-prawne (osoba niewidoma: prawa procesowe KPK/KPC,
  ulgi, stopnie niepełnosprawności, Konwencja ONZ).
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
  - rozmiar (115 plików, ~1,4 MB) — każda zmiana pliku kanonicznego ma
    potencjalnie systemowy promień rażenia; edytować tylko przez
    audyt-systemu-v4 z pełną weryfikacją CHECKLIST-DEDUP.md
required_modules: []
  # nie ma zastosowania — shared jest wczytywany, nie wczytuje sam siebie
changelog:
  - "2.6 (2026-07-12, runda 2): ZAMKNIĘTE — WARN 'numer wersji vs nazwa
    pliku' z MOD-DOKUMENT-ANOMALIE (otwarty w 2.5). Plik przemianowano z
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md na MOD-DOKUMENT-ANOMALIE_v1.1.0.md, żeby
    nazwa fizyczna zgadzała się z deklarowaną w treści wersją 1.1.0.
    Zweryfikowano całą bazę (grep całego /mnt/skills/user/) — tylko dwa
    miejsca odwoływały się do tego pliku po pełnej ścieżce z rozszerzeniem:
    pisma-procesowe-v3/references/MODULY-MAPA.md i
    pisma-procesowe-v3/references/AUTOMAT-STANOW.md — oba zaktualizowane.
    Pozostałe wzmianki w systemie (shared/CP-GATE.md,
    shared/MOD-KOSZT-ODPOWIEDZI.md, shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md,
    shared/MOD-STEP-TRACKER.md, pisma-procesowe-v3/modules/
    MOD-PRACODAWCA-RZECZYWISTY.md, pisma-procesowe-v3/references/
    SELF-CHECK-PISMA.md, pisma-procesowe-v3/references/W3-WERYFIKACJA.md,
    pisma-procesowe-v3/SKILL.md) to nazwy koncepcyjne bez ścieżki/rozszerzenia
    — nie wymagały zmiany. Wpis changelog 2.5 opisujący pierwotną naprawę
    (linia 'MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik...') pozostawiony bez
    zmian jako wierny zapis historyczny tamtej sesji."
  - "2.5 (2026-07-12): naprawa niespójności samoopisu w
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik w dwóch miejscach (nagłówek
    'Plik:' i wewnętrzna instrukcja `view` w sekcji WYWOŁANIE) opisywał
    samego siebie pod nazwą bez sufiksu wersji (MOD-DOKUMENT-ANOMALIE.md),
    mimo że fizyczna nazwa na dysku ma sufiks _v1.0.0. Nic zewnętrznego już
    się o to nie potykało (naprawione w pisma-procesowe-v3 sesją wcześniej),
    ale sam plik był niespójny. Przy okazji ujawniona DRUGA niespójność:
    deklarowana w treści 'Wersja: 1.1.0' nie zgadza się z sufiksem nazwy
    pliku '_v1.0.0' — odnotowana jawnie w pliku, nierozstrzygnięta (wymaga
    decyzji: zmienić nazwę pliku na _v1.1.0, czy to nazwa jest kanoniczna a
    numer w treści jest przestarzały)."
  - "2.4 (2026-07-12): korekta merytoryczna w terminy.md — wiersz 'Odpowiedź
    na pozew' (art. 207 §2 KPC) był błędnie sklasyfikowany w tabeli 'Terminy
    ZAWITE'; jest to termin INSTRUKCYJNY. Wykryte przy okazji naprawy WARN
    'nakładanie kompetencji analiza-sadowa-v6/analizator-dowodow-v3' —
    analiza-sadowa-v6 miał tę pozycję poprawnie oznaczoną jako INSTRUKCYJNY
    we własnej (teraz usuniętej) kopii tabeli terminów, co ujawniło
    rozbieżność z kanonicznym shared/terminy.md. Dodano adnotację ⚠ i
    przypis w treści pliku zamiast przenosić wiersz do nowej sekcji — decyzja
    strukturalna (osobna sekcja 'Terminy instrukcyjne' vs. adnotacja inline)
    pozostaje otwarta do najbliższego audytu."
  - "2.3 (2026-07-12): ODZYSKANIE 7 PLIKÓW KANONICZNYCH uznanych za utracone
    (CRIT z audytu silnika, zgłoszony przez pisma-procesowe-v3 SKILL.md
    i modules/MOD-SZABLONY.md jako ⛔ OBOWIĄZKOWE, brak na dysku):
    MOD-BUDOWA-ARGUMENTU.md, MOD-ELIMINACJA-TEZ.md, MOD-KARTA-DOWODU.md,
    MOD-KOSZT-ODPOWIEDZI.md, MOD-MIKROPODSUMOWANIA.md,
    MOD-SKUTEK-PROCESOWY.md, MOD-STRESS-TEST.md. Źródło: archiwum
    shared_v5.zip (frontmatter shared v2.1, poprzedzające obecną v2.2) —
    treść modułów zweryfikowana jako produkcyjna (nagłówek 'Status: PRODUKCJA
    — plik kanoniczny shared', ścieżki i wywołania `view` zgodne z aktualną
    strukturą, brak zależności kaskadowych do innych brakujących plików).
    UWAGA METODOLOGICZNA: pozostałe 25 plików wspólnych z shared_v5.zip
    różniło się treścią od wersji obecnej na dysku (v2.2 jest od nich
    nowsza — np. PRAWO-HARDGATE.md 367 vs 257 linii) — te 25 NIE zostało
    nadpisanych, przywrócono wyłącznie 7 plików faktycznie nieobecnych.
    4 pliki obecne na dysku (MOD-AUDIT-BUNDLE.md, MOD-FSL-DOKUMENTY.md,
    MOD-IDENTYFIKACJA-STRONY-UMOWY.md, MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md)
    nie istniały w shared_v5.zip — dodane po tym zrzucie, zachowane bez zmian.
    Tabela 'Moduły kancelaryjne v3.0' i sekcja 'Obowiązkowe wywołania dla
    generatorów pism' uzupełnione o 7 odzyskanych modułów. Do zrobienia przez
    audyt-systemu-v4 przy najbliższej sesji: wpis w AUDIT-JOURNAL.md,
    zamknięcie odpowiadającej flagi w WARN-OTWARTE.md, weryfikacja czy
    CHECKLIST-DEDUP.md wymaga aktualizacji (dwa moduły — MOD-KARTA-DOWODU
    i MOD-ELIMINACJA-TEZ — są współdzielone przez pisma-procesowe-v3 i
    analizator-dowodow-v3, sprawdzić czy to jedyna kanoniczna lokalizacja)."
  - "2.2: standaryzacja metadanych frontmatter (dependencies/inputs/outputs/
    confidence/escalation/limitations/required_modules) — sesja 2026-07-04.
    Jawnie odnotowane ZNANE ODSTĘPSTWO (5 plików z zależnością zwrotną do
    skili nadrzędnych) — decyzja architektoniczna pozostaje otwarta."
---

# shared/ — Wspólne moduły systemu prawnych skilli

Katalog zawiera pliki kanoniczne współdzielone przez wszystkie skille prawne.
Nie jest samodzielnym skillem — pełni rolę biblioteki referencji.

## Zawartość katalogu

| Plik | Rola |
|------|------|
| `PRAWO-HARDGATE.md` | ⛔ Globalny zakaz cytowania prawa/orzeczeń z pamięci — wczytaj przed każdym przepisem |
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa — auto-raport braków po piśmie (Fazy 1–3) |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3) |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu gotowego pisma |
| `MOD-WALIDACJA_v2.md` | ⭐ Walidacja formalna i prawnicza pisma (bloki A–J) — **JEDYNE ŹRÓDŁO PRAWDY** |
| `MOD-WALIDACJA.md` | STUB → przekierowuje do `MOD-WALIDACJA_v2.md` (zachować dla kompatybilności) |
| `FACT-SOURCE-LOCK.md` | Klasyfikacja faktów FSL-A/B/C — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `LEGAL-STATUS-LOCK.md` | Weryfikacja statusów aktów LSL-1..6 — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `terminy.md` | Tabela terminów zawitych i przedawnień (KPC, KPK, KPW, KPA, KP, PPSA) |
| `FAKTY_v2.md`                        | Weryfikacja zgodności faktycznej pisma ze źródłem (MOD-FAKTY) |
| `raport-sytuacyjny-integracja.md` | Sekwencja wywołania widgetu Raportu Sytuacyjnego v2 |
| `MOD-STEP-TRACKER.md` | ⛔ Śledzenie kroków i raportowanie pominięć — inicjowany w KROK 0-TRACKER routera; każde pominięcie = obowiązek poinformowania użytkownika + czekanie na decyzję |

Pliki w `prawny-router-v3/references/` (nie w shared, ale powiązane):
| `pokrycie-dziedzinowe.md` | Pełna mapa dziedzin → modułów → powiązanych skilli (28 dziedzin) |

Wszystkie pliki są kanoniczne — nie istnieją stuby ani kopie w innych lokalizacjach.

## Jak korzystać

Każdy skill wczytuje pliki z tego katalogu bezpośrednio przez `view`:

```
view /mnt/skills/user/shared/MOD-STEP-TRACKER.md  ← KROK 0-TRACKER (przed wszystkim — ST-INIT)
view /mnt/skills/user/shared/PRAWO-HARDGATE.md  ← wymagane przed każdym przepisem/orzeczeniem
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
  wzmianki o "43 plikach nieaktywnych" są nieaktualne. Pliki uznane za nieaktywne
  są obecnie oznaczane in-situ (np. ⛔ DEPRECATED w nagłówku, jak AKTY-PRAWNE-MASTER.md)
  zamiast przenoszenia do archive/.

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
| `RISK-ASSESSMENT.md` | Matryca ryzyka formalnego, dowodowego, prawnego i kosztowego |
| `ORZECZENIA-HIERARCHIA.md` | Hierarchia orzecznictwa, test aktualności i karta orzeczenia |
| `DOWODY-METODOLOGIA.md` | Matryca dowodowa i test wiarygodności dowodu |
| `ROSZCZENIA.md` | Konstrukcja roszczeń głównych, ewentualnych i alternatywnych |
| `STRATEGIA-PROCESOWA.md` | Taktyka procesowa i wybór następnego ruchu |
| `QUALITY-CHECK.md` | Kontrola jakości pisma: logika, struktura, nadmiar, emocjonalność |
| `KANCELARIA-WORKFLOW.md` | Sekwencja pracy kancelaryjnej możliwa w `.md skills` |
| `STATUS.md` | Rejestr wersji i statusów modułów shared |
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

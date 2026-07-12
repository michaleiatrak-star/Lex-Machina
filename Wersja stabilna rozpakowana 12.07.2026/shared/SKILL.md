---
name: shared
version: 2.2
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
  - rozmiar (106 plików, 1,3 MB) — każda zmiana pliku kanonicznego ma
    potencjalnie systemowy promień rażenia; edytować tylko przez
    audyt-systemu-v4 z pełną weryfikacją CHECKLIST-DEDUP.md
required_modules: []
  # nie ma zastosowania — shared jest wczytywany, nie wczytuje sam siebie
changelog:
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

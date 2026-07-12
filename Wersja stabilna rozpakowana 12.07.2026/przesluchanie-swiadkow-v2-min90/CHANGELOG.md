## v3.14 — 2026-07-11 (AUDYT SYSTEMU na żywym przypadku — sprawa XI P 27/26, świadek Maria Koroleva)

- Naprawiono rozjazd wersji frontmatter (błędnie cofnięty do "3.12" mimo że
  ten plik i sekcja `changelog` w SKILL.md wskazywały 3.13 jako najnowszy
  wpis — ten sam wzorzec błędu wersja-vs-changelog, wcześniej naprawiany
  już w innych skillach systemu).
- **PRE-W1a.2 rozszerzony**: obowiązkowa weryfikacja `tesseract --list-langs`
  i instalacja `tesseract-ocr-pol` PRZED pierwszym OCR w sesji. Wykryto na
  żywym przypadku, że środowisko wykonawcze nie miało domyślnie
  zainstalowanego polskiego pakietu językowego — bez tego kroku SD-VER
  mógłby zostać oznaczony jako KOMPLET mimo bezużytecznego wyniku OCR.
  Dodano też wymóg dzielenia OCR na partie przy dużej liczbie stron (>~40).
- **TEZA-DOWODOWA-SCOPE-GATE rozszerzona** o wariant TEZA-NIEUSTALONA:
  procedura warstwowego budowania pytań (bezpieczne/średnie/wysokiego
  ryzyka), gdy strona wycofała wniosek o świadka, a mimo to sąd i tak go
  wezwał bez utrwalonego w materiale uzasadnienia zakresu tezy.
- **Nowy KROK FPW-1b (ORGAN-COMPETENCY-CHECK)** w
  `QUESTION-ADMISSIBILITY-GATE.md` (v3.3→v3.4): zakaz budowania pytania
  insynuującego odpowiedzialność karną na podstawie wyłącznie
  jednostronnego, niezweryfikowanego twierdzenia strony o postępowaniu
  przed konkretnym organem, bez sprawdzenia, czy ten organ ma w ogóle
  kompetencję rzeczową do takiej sprawy (np. Straż Graniczna nie prowadzi
  spraw o "składanie fałszywych zeznań"). Dodano obowiązkowy self-check
  auto-sprzeczności ze strategią klienta.
- Przyczyna: przygotowanie pytań dla świadka Marii Korolevy (sygn. XI P
  27/26) ujawniło, że pytanie oparte na twierdzeniu powoda o rzekomym
  postępowaniu Straży Granicznej o "fałszywe zeznania" opierało się na
  organie bez kompetencji rzeczowej do takiej sprawy i stosowało wobec
  świadka mechanizm, który klient zarzuca stronie przeciwnej.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-07-11` (audyt skilla
  proceduralnego wg ZASADY 11 z `audyt-systemu-v4`).

## v3.13 — 2026-07-11 (AUDYT SYSTEMU)

- Dodano etap **PRE-W1a-SD-VER** jako TWARDĄ, BEZPOŚREDNIĄ zależność od
  `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` (wcześniej tylko pośrednio przez
  `analizator-dowodow`, więc pomijalna). HARD GATE: zakaz wejścia do
  KROK-PRE-W1-INTELLIGENCE bez SD-VER = KOMPLET.
- Dodano jawny, bezwarunkowy wymóg OCR (`pdftoppm` + `tesseract -l pol`)
  dla każdego pliku PDF bez warstwy tekstowej, przed budową tez/pytań.
- Zintegrowano `shared/MOD-STEP-TRACKER.md` z pipeline'em świadka — 11 nowych
  pozycji rejestru (SW-PRE-W1a…SW-W6), raportowanie pominięć natychmiastowe.
- Dodano **DOCUMENT-REFERENCED-NOT-FOUND-GATE** (PRE-W1a.4): dokument
  wzmiankowany w zeznaniu/protokole, nieobecny w materiale → oznaczenie
  `⬛ DO WERYFIKACJI` zamiast milczącego pominięcia lub mylnego utożsamienia
  z innym dokumentem.
- Przyczyna: w sesji roboczej pominięto skanowanie 130 stron trzech
  zeskanowanych plików akt osobowych świadka i pomylono odręczny dopisek
  na upomnieniu z odrębną notatką służbową, której istnienia nie
  zweryfikowano w materiale.
- Powiązane zmiany: `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` v1.4.0,
  `shared/MOD-STEP-TRACKER.md` v1.1.0.

## v3.1 — 2026-06-03

- Dodano PRAWO-HARDGATE jako pierwsze `required_gate` w YAML frontmatter.
- Dodano blok `⛔ HARD GATE` na początku treści SKILL.md (po tytule i Celu).
- Rozbudowano `QUESTION-ADMISSIBILITY-GATE.md` o katalog zakazów dowodowych
  KPC/KPK/KPW/KPA z procedurą weryfikacji ISAP i wzorcem zapisu pola DOPUSZCZ.
- Rozbudowano `CROSS-EXAMINATION-GATE.md` o protokół sprzeczności z HARDGATE-check
  i self-check przed kontrprzesłuchaniem.
- Dodano nowy plik `references/PRAWO-HARDGATE-WITNESS.md` — katalog 4 obszarów
  prawnych specyficznych dla przesłuchań (dopuszczalność pytań, ocena dowodów,
  terminy, orzecznictwo) z procedurą weryfikacji przy generowaniu pytań.
- Rozbudowano `WITNESS-SCORING.md` o wpływ zakazów dowodowych na scoring
  z HARDGATE-check przy przepisach ograniczających.
- Zaktualizowano sekcję Zakaz w SKILL.md o zakaz podawania podstaw prawnych
  z pamięci.

# CHANGELOG

## v2.90

- Scalono najlepsze cechy trzech paczek.
- Zachowano text-first jako domyślny tryb.
- JSX tylko na wyraźne żądanie.
- Usunięto zależność od `local BlueprintPreview component path`.
- Dodano pełne typologie świadków.
- Dodano pełne typologie sędziów.
- Dodano macierz świadek × sędzia.
- Dodano testy regresji i policy UI.

## v3.3 — 2026-06-18

- **TAKSONOMIA RYZYKA 3-WYMIAROWA** — kategoria "ryzykowne" rozbita na:
  - `RYZYKO-KONTROLA`: pytania otwarte/WHY przy wrogim świadku — utrata narracji
  - `RYZYKO-ODPOWIEDŹ`: odpowiedź NIE aktywnie szkodzi tezie (FPW-RISK)
  - `RYZYKO-KUMULACJA`: pytanie w sekwencji otwiera niekorzystną narrację
  Każdy podtyp ma dedykowaną procedurę w QUESTION-ADMISSIBILITY-GATE.md.

- **WHY-GATE** — twardy zakaz (CRIT) pytań "dlaczego/po co/w jakim celu"
  przy modelu ONE-FACT lub świadku wrogim/strony przeciwnej.
  Źródło: Pozner & Dodd + Gray's Inn (2024) — "WHY is the dumbest question".
  Wyjątek: świadek lojalny / model PEACE / LEJEK.

- **FPW PIPELINE** (wdrożone do produkcji z v3.2-ZIP):
  FPW-1 (fakt + źródło) → FPW-2 (przepis + VER ISAP) → FPW-3 (TAK/NIE + klasyfikacja).
  Zakaz oznaczania ✅ VER bez web_search/web_fetch = CRIT.
  Bramka obowiązkowa dla każdego pytania W3.

- **REGUŁA SAFE-Q** — aktywowana gdy DOWÓD KON. = brak.
  Wymusza przeformułowanie zamykające oba wyjścia dla świadka lub BLOK E.

- **SYGNAŁY STOP** (KNOW-WHEN-TO-STOP) — dodane do BLOKU C i
  QUESTION-ADMISSIBILITY-GATE: STOP-1 (ustępstwo), STOP-2 (narracja szkodliwa),
  STOP-3 (zmiana postawy), STOP-4 (cel osiągnięty).
  Źródło: Gray's Inn (2024) — "Know when to stop, never one question too many".

- **QUESTION-ADMISSIBILITY-GATE.md** — całkowity rewrite v3.3:
  pipeline FPW, taksonomia 3D, WHY-GATE, SAFE-Q, KNOW-WHEN-TO-STOP,
  tabela zbiorcza klasyfikacji, kompletny wzorzec macierzy.

- **SKILL.md** — zaktualizowano: bramka W3, BLOK C sygnały STOP, sekcja Zakaz
  (4 nowe pozycje), W2 adnotacja FPW, changelog YAML.

## v3.4 — 2026-06-18

- **WITNESS-INTELLIGENCE** — nowy moduł `references/WITNESS-INTELLIGENCE.md`
  (327 linii). Pełna faza przygotowawcza pre-W1 w 5 krokach:
  - KROK I: profil świadka — dane, relacje (interes/powiązania/zmiany po sporze),
    historia w postępowaniu (wszystkie zeznania), profil zachowania
  - KROK II: mapa wiedzy — 4 typy: BEZPOŚREDNIA / PROCEDURALNA / ZE SŁYSZENIA /
    WYKLUCZONA; wiedza wykluczona = zakaz pytań otwartych (RYZYKO-KONTROLA)
  - KROK III: ekstrakcja dokumentacyjna — dokumenty autorstwa świadka,
    skierowane do świadka, CC/BCC, cytaty z zeznań (verbatim + kwalifikacja),
    fakty o świadku z innych źródeł
  - KROK IV: preparation chart per temat — fakty + dok_id + strona + cytat +
    pytanie ONE-FACT + zagrożenia + kontrowania + sekwencja 3-pytań dla
    sprzeczności; 8-10 tematów, 4-6 do użycia
  - KROK V: ocena wstępna z podsumowaniem zasileń W1/W2/W3
  Metodyka: Wagner/Taft Law 2024, Pozner & Dodd 4th ed. (2024), Filevine 2024.

- **FACT-EVIDENCE-MAPPING.md** — rozszerzony format v3.4: dok_id + strona jako
  obowiązkowe pola; indeks do preparation chartów.

- **SKILL.md** — dodano KROK PRE-W1 jako sekcję przed KROK 0; aktualizacja
  pipeline stages i validation gates; zakaz pomijania pre-W1 gdy są dokumenty.

## v3.5 — 2026-06-18

- **REGUŁA DWÓCH WIADOMOŚCI** — wiadomość 1: PRE-W1 + W1 + W2 (profil, tezy,
  scoring, model) + CHECKPOINT; wiadomość 2: W3 pytania (dopiero po akceptacji
  użytkownika). Wyjątek: jawne żądanie kompletnego zestawu od razu.
  Źródło: Wagner 2024 — trzy oddzielne kroki przed konspektem rozdziałów.

- **CHECKPOINT-W2** — obowiązkowa pauza po W2 z podsumowaniem (świadek, typ,
  scoring, model, tezy, sprzeczności, tematy zakazane, luki) i pytaniem do
  użytkownika. System nie generuje W3 bez potwierdzenia ("OK"/"kontynuuj").

- **ETAP W4 — PRÓBA GENERALNA** — lista kontrolna przed rozprawą: selekcja
  4-6 rozdziałów z 8-10, kolejność PRIMACY/RECENCY, weryfikacja fizycznych
  lokalizacji dowodów, "clap-back" na 3 odpowiedzi wymijające, STOP-4 per
  rozdział, model awaryjny. Źródło: Wagner (Taft Law 2024).

- **ETAP W5 — BINDER SĄDOWY** — instrukcja do użycia na sali: 5-zakładkowa
  struktura z macierzą finalną, preparation chart, dokumentami kontrolnymi
  (dok_id → zakładka fizyczna), blokiem D i modelem awaryjnym. Nawigacja
  na sali bez szukania dokumentów. Źródło: Pozner & Dodd 4th ed. (2024).

- **ETAP W6 — SŁUCHANIE DIRECT** — etap w trakcie rozprawy: notowanie
  dosłownych sformułowań, klasyfikacja per rozdział (ZIELONY/ŻÓŁTY/CZERWONY),
  decyzja co usunąć/dodać, weryfikacja FPW-3 przed pytaniem improwizowanym,
  review bindera przed cross. Źródło: Davis (NACDL), Rev (2026), Ohio Bar (2025).

- **SKILL.md** — pipeline stages rozszerzone o CHECKPOINT-W2, W4, W5, W6.
  Zakaz w sekcji Zakaz: nie generuj W3 bez CHECKPOINT-W2.

## v3.5 — AUDIT-2026-06-18 (post-audit patch)

- **CRIT-1 naprawiony**: pseudo-ścieżka `.../references/WITNESS-INTELLIGENCE.md`
  → `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md`
- **CRIT-2 naprawiony**: pseudo-ścieżka `.../references/QUESTION-ADMISSIBILITY-GATE.md`
  → pełna ścieżka kanoniczna
- **MANIFEST.md**: wildcard `references/*` zastąpiony explicit listą 7 plików
  (WITNESS-INTELLIGENCE.md dodany)
- **Description**: zaktualizowany do v3.5 (pipeline PRE-W1→W6, CHECKPOINT-W2,
  FPW, taksonomia ryzyka 3D, WHY-GATE, SAFE-Q, W4-W6)
- **SCORING po audycie**: 8.0/10 ✅ ZIELONY
  Pozostały CRIT: ścieżka WITNESS-INTELLIGENCE.md nieistniejąca w produkcji
  (zostanie rozwiązana po wgraniu tego skilla — CRIT pre-deploy, nie błąd pliku)

## v3.15 — 2026-07-12b (AUDYT SYSTEMU — CRIT: MOD-DESCRIPTION przekroczony)

- **CRIT naprawiony:** pole `description` w SKILL.md przekroczyło twardy limit
  1024 znaków (osiągnęło 1151 po dodaniu WITNESS-SCOPE-LOCK w v3.14) — zgodnie
  z `audyt-systemu-v4/modules/MOD-DESCRIPTION.md` przekroczenie >1024 znaków
  to CRIT (grozi bezciszym obcięciem description w UI).
- Skrócono description do 870 znaków (strefa ✅ OK, ≤900) — skonsolidowano
  trzy oddzielne linie HARD GATE w jedną, skrócono opis etapów pipeline'u
  (usunięto powtórzenia typu "sądowy"/"i adaptacja"), zachowano wszystkie
  triggery wywołania, numer wersji i kluczowe ograniczenia, zgodnie z
  "Procedurą naprawy (CRIT)" z MOD-DESCRIPTION.md.
- Przyczyna: przy dodawaniu WITNESS-SCOPE-LOCK w v3.14 nie zweryfikowano
  długości description po edycji frontmatter.
- `version: "3.14" → "3.15"`.

## v3.14 — 2026-07-12 (AUDYT SYSTEMU — na wyraźne wskazanie użytkownika po błędzie sesji)

- Dodano **WITNESS-SCOPE-LOCK** (nowa sekcja w ETAP W1, zaraz po
  TEZY-DOWODY-SWIADEK-GATE). HARD GATE: zakaz dołączania do W2/W3 osoby
  niepotwierdzonej wprost jako przesłuchiwanego świadka tylko dlatego, że
  występuje w tych samych materiałach co świadek już ustalony (np. drugi
  reprezentant strony przeciwnej, współsygnatariusz tego samego pisma).
- Wymaganie: jeśli z materiałów/kontekstu rozmowy nie wynika jednoznacznie,
  kto konkretnie ma być przesłuchiwany, a w dokumentach występuje więcej niż
  jedna możliwa osoba — model musi zapytać wprost o zamkniętą listę
  świadków, zanim powstanie choćby jedno pytanie. Chęć bycia "wyczerpującym"
  nie jest wyjątkiem od tej zasady.
- Dodano test regresyjny w `tests/REGRESSION-CASES.md` (sprawa pracownicza,
  dwóch reprezentantów pozwanej spółki w materiałach, przesłuchiwana tylko
  jedna z nich).
- Przyczyna: w sesji roboczej model przygotował pytania dla dwóch osób
  (Prezes Zarządu + Dyrektor generalna spółki pozwanej), mimo że z
  materiałów i kontekstu rozmowy jednoznacznie wynikało, iż przesłuchiwana
  ma być tylko jedna z nich (autorka najbardziej spornej, najświeższej
  korespondencji). Błąd polegał na milczącym rozszerzeniu zakresu świadków
  zamiast potwierdzenia go z użytkownikiem.
- Zaktualizowano: frontmatter `description` (dodany HARD GATE
  WITNESS-SCOPE-LOCK), sekcję "Zakaz" (nowy punkt z odesłaniem do gate'u),
  `version: "3.12" → "3.14"` (3.13 zarezerwowane przez wcześniejszy audyt
  tej samej daty roboczej — SD-VER/OCR, patrz wpis niżej).
- **OUTPUT-COMPLETENESS**: naprawa dostarczona jako pełny, zsynchronizowany
  skill (SKILL.md + CHANGELOG.md + tests/REGRESSION-CASES.md), zgodnie z
  ZASADĄ 7 z `audyt-systemu-v4`.

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

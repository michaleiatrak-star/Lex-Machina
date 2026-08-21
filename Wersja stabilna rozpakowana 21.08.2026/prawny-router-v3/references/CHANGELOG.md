# CHANGELOG — Router Prawny v3

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 3.22 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Historia scalona z DWÓCH źródeł: sekcji `## CHANGELOG (prawny-router-v3)` w korpusie
oraz pola `changelog:` w YAML (63 linie). Oba przeniesione 1:1 do nowego pliku.
Ten skill trzymał historię w trzech miejscach naraz — po tej zmianie w jednym.

**Standard systemowy wprowadzony tego dnia:** pełna historia zmian każdego skilla
mieszka w `references/CHANGELOG.md` — nigdy w sekcji `## CHANGELOG` korpusu SKILL.md
i nigdy jako pełna lista wpisów w polu `changelog:` frontmatteru. W SKILL.md zostaje
wyłącznie kilkulinijkowy skrót bieżącej wersji z odesłaniem do tego pliku.

**Dlaczego to nie jest kosmetyka:** rozproszenie historii między trzy lokalizacje było
BEZPOŚREDNIĄ przyczyną fałszywych wyników testu T12 w sesji 2026-08-20z3 — test szukał
wpisów w `references/`, nie znajdował ich (bo leżały w SKILL.md) i raportował luki,
których nie było. Jedna lokalizacja kanoniczna usuwa całą tę klasę błędu.
Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z4`.

---

## HISTORIA PRZENIESIONA Z SKILL.md (2026-08-20z4, ujednolicenie standardu)

> Poniższa treść pochodzi z sekcji `## CHANGELOG` w korpusie SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

> ⛔ **WPISY ODTWORZONE 2026-08-20z3 (flaga F-102, test T12).** Poniższe pozycje
> nie istniały w żadnym changelogu — `version:` był podbijany bez wpisu przez
> 8 kolejnych sesji. Treść odtworzona z `audyt-systemu-v4/references/AUDIT-JOURNAL.md`,
> gdzie każde podbicie zostało odnotowane w sekcji Rejestracja wraz z opisem
> sesji. Wpisy są zatem WTÓRNE wobec dziennika — przy wątpliwości źródłem
> rozstrzygającym jest dziennik, nie ten plik. Nic nie zostało zmyślone:
> pozycje bez śladu w dzienniku oznaczono wprost jako lukę.

**3.21 (2026-08-09v)** — przejście modułu do `shared/`: znaleziony systemowy
problem zduplikowanych, ROZBIEŻNYCH kopii tej samej treści w kilku skillach.
Źródło: AUDIT-JOURNAL, wpis AUDYT-2026-08-09v.

**3.20 (2026-08-04s)** — pomiar prędkości: dokładne zbadanie zagadnienia,
odnotowany aktywny spór RPO-MSWiA. Źródło: AUDYT-2026-08-04s.

**3.19 (2026-08-04r)** — mandat wypisany nieczytelnie: sąd ocenia legalność,
nie estetykę. Źródło: AUDYT-2026-08-04r.

**3.18 (2026-07-30z139)** — CRIT: błędny ogólny pułap mandatu karnego.
Źródło: AUDYT-2026-07-30z139.

**3.17 (2026-07-27g)** — znacznik RZĄD w HG-ACTIVE + nowa pozycja ŹRÓDŁO-GATE.
Źródło: AUDYT-2026-07-27g.

**3.16, 3.15, 3.14 (2026-07-13g)** — trzy podbicia w jednej sesji, przy
odkryciu, że `shared/MCP-INTEGRACJA.md` nie była podłączona do skilli
analitycznych. Dziennik nie rozdziela, co przypadło na który numer —
⚠️ podział między 3.14/3.15/3.16 pozostaje NIEUSTALONY. Źródło: AUDYT-2026-07-13g.

**3.13 (2026-07-12) — Reguła 22: TWARDY trigger słowny dla pytań do świadka
(naprawa F-8b, kontynuacja F-8):**
- Incydent: mimo poprawnie wdrożonej reguły 21 (dekompozycja żądań złożonych),
  model w KOLEJNEJ odpowiedzi w tej samej sesji otrzymał proste, samodzielne
  doprecyzowanie ("czy użyłeś skila przesłuchania świadków... router zawsze
  powinien odpalać ten skill") i — zamiast tego — wcześniej dostarczył pytania
  do świadka wprost z pamięci prawniczej, bez żadnego `view` pliku
  przesluchanie-swiadkow-v2-min90/SKILL.md, mimo że fraza "pytania do świadka"
  padła explicite w poleceniu użytkownika.
- Root cause: reguła 21 wiąże obowiązek wczytania skilla świadka z oceną
  "czy zlecenie jest złożone" (≥2 komponenty z różnych PRIMARY). To dobra
  reguła dla dekompozycji, ale nie jest ona TRIGGEREM SAMYM W SOBIE — model
  może (błędnie) ocenić, że dany fragment prośby "nie wymaga" pełnego
  pipeline'u i odpowiedzieć skrótowo.
- Naprawa: dodano REGUŁĘ 22 — bezwarunkowy, słowny trigger niezależny od
  oceny złożoności: obecność fraz "pytania do świadka"/"przesłuchanie
  świadka"/"kontrprzesłuchanie"/"impeachment świadka" wymusza `view`
  przesluchanie-swiadkow-v2-min90/SKILL.md PRZED napisaniem jakiejkolwiek
  odpowiedzi zawierającej takie pytania — niezależnie od tego, czy reszta
  zlecenia jest prosta czy złożona. Dodano też pozycję w SELF-CHECK.
- Pełny opis incydentu: AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12 (F-8 → F-8b).

**3.12 (2026-07-12) — Reguła 21: CHECKPOINT w żądaniach złożonych (naprawa F-8):**
- Incydent: zlecenie łączące tezy/chronologię/sprzeczności + "pytania do świadka"
  zostało obsłużone przez chronologia-sprawy-v1 w całości; przesluchanie-swiadkow-v2-min90
  nigdy nie zostało wczytane mimo poprawnego wiersza [8] w tabeli routingu — pytania
  W3 powstały bez CHECKPOINT-W2 (bez akceptacji tez przez użytkownika).
- Dodano REGUŁĘ 21 (sekcja reguł nadrzędnych, po regule 20/20a): żądania złożone
  dekomponować na komponenty, każdy z własnym PRIMARY skillem i checkpointami;
  obecność checkpointu w jednym komponencie (np. świadek → CHECKPOINT-W2) blokuje
  wyłącznie ten komponent, nie całą odpowiedź — ale MUSI zablokować.
- Pełny opis incydentu i naprawy równoległej w chronologia-sprawy-v1 (v1.3→v1.4,
  KATEGORIA A0 fałszywe sprzeczności): AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12.
- Flaga F-8 w WARN-OTWARTE.md → zamknięta tym wpisem.

**3.11 (2026-07-05) — scalenie standaryzacji metadanych z pełną logiką 3.10:**
- Kontekst: równolegle do rozwoju 3.9→3.10 (logika weryfikacji podmiotów) powstała
  osobna gałąź robocza, oznaczona "3.9" z dnia 2026-07-04, wprowadzająca ustrukturyzowany
  frontmatter (dependencies, inputs, outputs, confidence, escalation, limitations,
  required_modules) — ale bez KROK 0D i bez POV-D-TRIGGER.
- Scalenie: przyjęto ustrukturyzowany frontmatter, zachowując w całości treść
  KROK 0D, [POV-D-TRIGGER], ZASADĘ FUNDAMENTALNĄ ("dane z akt ≠ zweryfikowane")
  oraz pełny blok SELF-CHECK z POV-B/C/D.
- Dodano: required_modules → shared/PRE-W2-VERIFICATION-GATE.md; escalation →
  przypadek podmiotu ⬛ bez dostępu do rejestru.
- Dodano do frontmatter adnotację ZNALEZISKO 2026-07-04 o potencjalnym duplikacie
  kwalifikator-karnomaterialny.md (zgłoszone do CHECKLIST-DEDUP, nie rozwiązane
  w tym scaleniu).
- Wersja: 3.10 → 3.11. Żadna funkcja bezpieczeństwa nie została usunięta.

**3.10 (2026-06-26) — KROK 0D: oznaczanie podmiotów ⬛ [DO WERYFIKACJI]:**
- Nowy krok 0D w sekwencji głównej: obowiązkowe oznaczanie każdego podmiotu
  (spółki, sądy, organy) statusem ⬛ [DO WERYFIKACJI] od chwili napotkania.
- Status ⬛ utrzymuje się do faktycznego web_search/web_fetch — nie do zamiaru.
- SELF-CHECK: nowy blok "STATUS PODMIOTÓW" z checklistą przed każdą odpowiedzią.
- MOD-STEP-TRACKER: dodano R0D do REJESTRU.
- Wyjątki: dane osoby fizycznej (imię/nazwisko/adres/PESEL) — nie oznaczaj ⬛.
- Powiązane: PRE-W2-VERIFICATION-GATE.md v1.2.0 (nowy krok PRE-W2.0).

**3.9 (2026-06-26) — naprawa [POV-D-TRIGGER] i zasady "dane z akt ≠ zweryfikowane":**
- Root cause: model traktował KRS/NIP z umów/akt jako zweryfikowane online.
  Skutek: KRS 0000796445 (HP sp. z o.o.) wpisany przy Human Park Global sp. z o.o.
  (która ma KRS 0001025052) w piśmie procesowym VII P 94/25 (sesja 2026-06-26).
- SELF-CHECK: blok POV-B/C/D rozbudowany o:
  (a) zasadę explicite "dane z akt ≠ zweryfikowane"
  (b) [POV-D] jako osobny krok z triggerem przy ≥2 różnych numerach KRS/NIP
  (c) wymóg wyświetlenia raportu PRE-W2 przed W2
- Reguła nadrzędna 18: dodano [POV-D-TRIGGER] i zasadę fundamentalną.
- Wersja: 3.8 → 3.9

---

## HISTORIA PRZENIESIONA Z SKILL.md (2026-08-20z4, ujednolicenie standardu)

> Poniższa treść pochodzi z pola `changelog:` we frontmatterze SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

changelog:
  - "3.21 (2026-08-18): NOWY KROK 0-RPK — router jest teraz jedynym miejscem
    decydującym, KIEDY inicjować shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md
    (RPK), zamiast zostawiać tę decyzję wyłącznie w opisie biblioteki
    shared/SKILL.md, która sama w sobie nie jest samodzielnym skillem i nie
    ma własnej sekwencji wywołania. Powód: użytkownik trafnie zauważył, że
    dodanie modułu RPK do shared (2026-08-18, AUDYT-2026-08-18, flaga F-93)
    nie wystarcza — biblioteka nie decyduje SAMA o swoim wywołaniu, potrzebny
    jest punkt orkiestracji. Krok umieszczony zaraz po KROK 0-ST (analogicznie
    do MOD-STEP-TRACKER), z jawnymi sygnałami wyzwalającymi (zbiór ≥10
    ponumerowanych jednostek, plik źródłowy z numeracją ciągłą, zapowiedź
    pracy partiami). required_modules i SELF-CHECK rozszerzone. Nie zamyka
    F-93 w całości — propagacja do pozostałych 5 skilli-konsumentów
    (analizator-przepisow-v2, analizator-dowodow-v3,
    przesluchanie-swiadkow-v2-min90, chronologia-sprawy-v1, audyt-systemu-v4)
    pozostaje otwarta, patrz WARN-OTWARTE.md."
  - "3.17 (2026-07-21): NAPRAWIONO — shared/HIERARCHIA-ZRODEL.md (istniał
    od dawna) i shared/PORTALE-BRANZOWE-RZAD-2B.md (zbudowany w tej sesji,
    16 dziedzin z weryfikacją site:) NIE BYŁY ładowane przez ŻADEN DR-skill
    ani przez sam router — DOKŁADNIE ten sam wzorzec 'zbudowano, zapomniano
    podłączyć' co wielokrotnie w tej sesji (moduły niezarejestrowane w
    SKILL.md, plany bez skryptów, poprawki niezsynchronizowane między
    mapami). Dodano OBA do required_modules — TERAZ każde wywołanie routera
    (a więc każdy DR-skill uruchamiany PRZEZ router) ma dostęp do
    kategoryzacji wiarygodności źródeł i rejestru portali branżowych.
    Odkryte przy pytaniu użytkownika 'czy wszystkie DR wiedzą o tej bazie
    portali?' — odpowiedź brzmiała: ŻADEN, naprawiono."
  - "3.16 (2026-07-13f): KONSOLIDACJA — usunięto zależność od osobnych skilli
    mcp-zrodla-prawa-v1/audit-trail-portal-v1/sync-dzu-automatyczny-v1 (utworzonych
    2026-07-13). Ich treść przeniesiono do shared/MCP-INTEGRACJA.md,
    shared/AUDIT-TRAIL-SPEC.md i audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md
    — bo żaden z nich nie był samodzielnym skillem wywoływanym intencją użytkownika,
    tylko protokołem/narzędziem ładowanym przez router lub audyt-systemu-v4,
    dokładnie jak PRAWO-HARDGATE.md czy HYBRID-VALIDATION.md. Powód: uniknięcie
    duplikowania wzorca 'protokół + narzędzia w shared/tools', na wniosek
    użytkownika po pytaniu 'czy nie lepiej wdrożyć to jako elementy obecnych
    skili, a nie tworzyć coś nowego, co duplikuje już istniejące skille?'.
    Skille w systemie: 36 → 33 (powrót do liczby sprzed 2026-07-13)."
  - "3.15 (2026-07-13): INTEGRACJA — dodano shared/MCP-INTEGRACJA.md jako opcjonalną
    warstwę deterministyczną PRZED HARD GATE (nie zamiast). Gdy connector MCP
    (ISAP/SAOS/CBOSA/KRS/EUR-Lex) jest podłączony i dostępny w rozmowie, router
    używa go w pierwszej kolejności do weryfikacji powołań; HARD GATE
    (web_search/web_fetch) pozostaje aktywny bez zmian jako fallback i jako
    jedyna ścieżka gdy MCP niedostępne. Część realizacji rekomendacji #2 z
    audytu komercyjnego silnika 2026-07-13 (pełny opis: audyt-systemu-v4/
    references/AUDIT-JOURNAL.md, wpis AUDYT-2026-07-13)."
  - "3.14 (2026-07-12): DEDUP — usunięty duplikat
    references/kwalifikator-karnomaterialny.md (identyczny z kanonicznym
    dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md, MD5 zgodny),
    zgłoszony jako ZNALEZISKO 2026-07-04. 2 miejsca wywołania w dr-03
    przekierowane na ścieżkę kanoniczną. Zamyka pozycję w limitations —
    pełny opis tam. Część audytu komercyjnego silnika (punkt 4)."
  - "3.9 (2026-06-26): naprawa [POV-D-TRIGGER] i zasady 'dane z akt ≠ zweryfikowane
    online' — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.10 (2026-06-26): KROK 0D — obowiązkowe oznaczanie podmiotów ⬛ [DO WERYFIKACJI]
    — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.11 (2026-07-05): SCALENIE dwóch równoległych gałęzi rozwoju — (a) standaryzacja
    metadanych frontmatter (dependencies/inputs/outputs/confidence/escalation/
    limitations/required_modules), wprowadzona w wersji roboczej oznaczonej 3.9
    z dnia 2026-07-04, z (b) pełną logiką weryfikacji podmiotów KROK 0D +
    POV-D-TRIGGER z wersji 3.10 (2026-06-26). Żadna funkcja bezpieczeństwa nie
    została usunięta w procesie scalenia — required_modules rozszerzone o
    shared/PRE-W2-VERIFICATION-GATE.md, escalation rozszerzone o przypadek
    podmiotu ⬛ bez dostępu do rejestru."

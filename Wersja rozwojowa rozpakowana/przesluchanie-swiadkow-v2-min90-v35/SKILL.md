---
name: przesluchanie-swiadkow-v2-min90
version: 3.5
type: legal-skill
domain: litigation-witness-examination
status: production
default_mode: text
graphic_mode: on_request_only
performance_profile: staged-intake-first
compatibility:
  - Claude Skills
  - Modular Legal Skills
entrypoint: SKILL.md
description: |
  Przesłuchanie świadków v2 — przygotowanie pytań, kontrprzesłuchanie i scoring
  dowodowy w sprawach cywilnych, karnych, pracowniczych i administracyjnych.
  Stosuj gdy użytkownik chce: przygotować pytania do świadka lub biegłego,
  przeprowadzić impeachment, ocenić wiarygodność zeznań, wykryć sprzeczności
  z wcześniejszymi zeznaniami, dobrać model przesłuchania do typu sędziego.
  Pipeline: PRE-W1 (profil+mapa wiedzy+preparation chart) → KROK 0 → W1 intake
  → W2 tezy/model → CHECKPOINT-W2 (pauza, uwagi) → W3 pytania (FPW pipeline,
  taksonomia ryzyka 3D, WHY-GATE, SAFE-Q, SYGNAŁY STOP) → W4 próba generalna
  → W5 binder sądowy → W6 słuchanie direct i adaptacja.
  ⛔ HARD GATE: zakaz cytowania przepisów KPC/KPK/KPW i sygnatur z pamięci.
  NIE stosuj do analizy dokumentów bez świadka — użyj analizator-dowodow-v3.
dependencies:
  required:
    - shared
    - analizator-dowodow
  optional:
    - chronologia-sprawy
    - analiza-sadowa
    - raport-sytuacyjny
    - MOD-KONTEKST-SESJI
    - MOD-PRIORYTETY-ASPEKTOW
    - MOD-SELEKCJA-DOWODOW
    - MOD-MAPA-PRZEPISOW
validation:
  required_gates:
    - PRAWO-HARDGATE
    - PRIOR-TESTIMONY-GATE
    - WITNESS-TYPE-GATE
    - INTAKE-COMPLETENESS-GATE
    - QUESTION-ADMISSIBILITY-GATE
    - WITNESS-SCORING
    - WITNESS-INTELLIGENCE
    - FACT-EVIDENCE-MAPPING
    - MODEL-SELECTION-GATE
    - CROSS-EXAMINATION-GATE
    - TEXT-FIRST-UI-GATE
    - HARDGATE-SD-01
    - HARDGATE-SD-02
pipeline:
  stages:
    - KROK-PRE-W1-INTELLIGENCE
    - KROK-0-KONTEKST
    - W1-INTAKE
    - W1-SUPPLEMENT
    - W2-THESES-AND-MODEL
    - CHECKPOINT-W2
    - W3-QUESTIONS
    - W4-REHEARSAL
    - W5-BINDER
    - W6-LIVE-DIRECT
changelog:
  - "3.5: CHECKPOINT-W2 — obowiązkowa pauza po W2 przed generowaniem pytań W3;
    W4 PRÓBA GENERALNA — lista kontrolna przed rozprawą (Wagner 2024);
    W5 BINDER SĄDOWY — instrukcja nawigacji dokumentami na sali;
    W6 SŁUCHANIE DIRECT — etap adaptacji pytań po zeznaniach na wprost
    (Davis/NACDL, Rev 2026, Ohio Bar 2025). Dwie-wiadomości-per-etap jako
    reguła systemowa: ekstrakcja+tezy → CHECKPOINT → pytania."
  - "3.4: Moduł WITNESS-INTELLIGENCE (pre-W1): pełna faza przygotowawcza —
    KROK I profil świadka (dane, relacje, historia procesowa, zachowanie);
    KROK II mapa wiedzy (bezpośrednia/proceduralna/ze słyszenia/wykluczona);
    KROK III ekstrakcja dokumentacyjna (autorstwo/skierowane/CC/cytaty);
    KROK IV preparation chart per temat (fakty+źródło+pytanie+sprzeczności);
    KROK V ocena wstępna zasilająca W1/W2/W3. Integracja: FPW-1 z dok_id+strona.
    Metodyka: Wagner/Taft 2024, Pozner & Dodd 4th ed., Filevine 2024."
  - "3.3: Trzy zamknięte luki vs literatura ekspercka (Pozner & Dodd, Gray's Inn):
    (1) FPW pipeline (FAKT→PRAWO→WNIOSEK) jako obowiązkowa bramka W3;
    (2) Taksonomia ryzyka 3-wymiarowa: RYZYKO-KONTROLA / RYZYKO-ODPOWIEDŹ /
    RYZYKO-KUMULACJA z dedykowanymi procedurami per podtyp;
    (3) Twardy zakaz WHY-QUESTIONS w trybie cross (ONE-FACT/świadek wrogi)
    jako CRIT; reguła SAFE-Q dla pytań bez dowodu kontrolnego;
    reguła KNOW-WHEN-TO-STOP z sygnałami STOP w BLOKU C."
  - "3.2 (ZIP niezaszyty): FPW pipeline — KROK 0 kontekstu poprzedniej sesji;
    FPW-RISK auto-kwalifikator do BLOKU E; zakaz VER bez web_search = CRIT"
  - "3.1: KROK 0 — wczytanie kontekstu sprawy z KROK 4a analizator-dowodow-v3
    lub z pliku kontekstu sesji (MOD-KONTEKST-SESJI §4 TRYB IMPORT); mapowanie
    aspektów głównych/pobocznych → tezy; zatwierdzone dowody → blok B pytań;
    ostrzeżenia krzyżowe (HARDGATE-SD-01/02) → blok E (tematy zakazane z
    uzasadnieniem); wyniki MET-ACH/CA/NET/COMP/FTL → blok D (sprzeczności/
    looping); chronologia wstępna → materiał do loopingu dat"
---

# Przesłuchanie świadków v2-min90

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Skill może zawierać przepisy KPC, KPK, KW, KPA o dopuszczalności dowodów i pytań,
> terminy zawite, podstawy impeachmentu oraz sygnatury orzeczeń o regułach dowodowych.
> Przed podaniem jakiegokolwiek przepisu, artykułu lub sygnatury:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

## Cel

Moduł służy do przygotowania przesłuchania świadków, kontrprzesłuchania, oceny wartości
dowodowej zeznań oraz doboru strategii do typu świadka, modelu przesłuchania i typu sędziego.

Działa w **trzech etapach sekwencyjnych** (W1 → W2 → W3).
Nie generuje pytań bez przejścia przez wszystkie etapy.

---

## Zasada nadrzędna

Domyślnym trybem jest **szybki tryb tekstowy**.
Tryb graficzny wolno uruchomić wyłącznie na wyraźne żądanie użytkownika
(triggery: „pokaż graficznie", „dashboard", „diagram", „panel JSX", „wizualizacja").

---

## Kiedy używać

Użyj tego skilla, gdy użytkownik chce:

- przygotować pytania do przesłuchania świadka,
- przygotować kontrprzesłuchanie / impeachment,
- ocenić wiarygodność świadka i scoring dowodowy,
- dobrać model przesłuchania do sytuacji,
- dobrać styl pytań do typu sędziego,
- wykryć sprzeczności z wcześniejszymi zeznaniami,
- zbudować macierz: pytanie → cel → fakt → dowód → ryzyko.

---

## KROK PRE-W1 — WITNESS INTELLIGENCE (faza przygotowawcza)

> Cel: zanim rozpoczniesz intake W1, zbuduj pełny profil świadka i mapę źródeł.
> Moduł aktywowany automatycznie gdy dostarczone są dokumenty dotyczące świadka.
> Pełna procedura: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md`

```
AKTYWACJA AUTOMATYCZNA:
  Gdy użytkownik dostarcza akta / protokoły / dokumenty przed W1 intake →
  wykonaj KROK I–V z WITNESS-INTELLIGENCE przed przejściem do KROK 0.

AKTYWACJA NA ŻĄDANIE:
  Frazy: "profil świadka", "mapa źródeł", "preparation chart",
  "co świadek mógł wiedzieć", "co wiemy o świadku z akt"

WYNIK:
  → Podsumowanie KROK V → bezpośrednio zasila pola W1 INTAKE
  → Preparation chart KROK IV → FPW-1 każdego pytania W3 ma dok_id+strona
  → Mapa wiedzy KROK II → BLOK E (tematy zakazane = WIEDZA WYKLUCZONA)
  → Cytaty KROK III-D → BLOK D (sprzeczności z sekwencją 3-pytań)
```

---

## KROK 0 — WCZYTAJ KONTEKST SPRAWY (przed W1)

> Cel: zasilić W1 intake danymi z analizatora (KROK 4a) lub z pliku kontekstu
> sesji (MOD-KONTEKST-SESJI TRYB IMPORT), żeby nie zaczynać od zera.
> Jeśli żadne źródło niedostępne → przejdź bezpośrednio do ETAP W1 (KROK 0
> jest OPCJONALNY, nie blokujący).

```
ŹRÓDŁO 1 — BIEŻĄCA SESJA (priorytet):
  Jeśli w tej samej sesji wykonano analizator-dowodow-v3 KROK 4a → pobierz:
    kontekst_sprawy = {
      aspekty_glowne, aspekty_poboczne,   ← MOD-PRIORYTETY-ASPEKTOW
      mapa_przepisow,                       ← MOD-MAPA-PRZEPISOW §4
      selekcja_dowodow,                     ← MOD-SELEKCJA-DOWODOW §5
      ostrzezenia_krzyzowe,                 ← MOD-SELEKCJA-DOWODOW §6
      wyniki_metod,                         ← BLOK E2a-j (streszczenia)
      chronologia_wstepna                   ← chronologia-sprawy-v1 (jeśli)
    }

ŹRÓDŁO 2 — PLIK KONTEKSTU (jeśli IMPORT_AKTYWNY z MOD-KONTEKST-SESJI):
  Jeśli użytkownik wkleił/wgrał plik kontekstu → pobierz z sekcji §2-§6
  tego pliku (już sparsowane w KROK I2 MOD-KONTEKST-SESJI).

ŹRÓDŁO 3 — BRAK KONTEKSTU:
  Jeśli żadne źródło niedostępne → pomiń KROK 0, przejdź do ETAP W1.
  Poinformuj jednym zdaniem: "Nie mam kontekstu z analizatora — zadam
  pytania o sprawę w W1."
```

### Mapowanie kontekstu na pola W1

```
PO WCZYTANIU kontekstu — wypełnij wstępnie następujące pola W1 INTAKE:

WARSTWA A (dane wspólne):
  "Okoliczność dowodowa" → z aspekty_glowne: które roszczenie ma świadek
    potwierdzić lub obalić (pytaj użytkownika TYLKO o to, którego aspektu
    dotyczy ten konkretny świadek, nie ekstrahujesz tego automatycznie).
  "Typ postępowania" → z kontekstu §1 STRONY I KONTEKST (jeśli znany).

MATERIAŁ DO W2 (tezy i model przesłuchania):
  Tezy DO WYKAZANIA przez świadka → z aspekty_glowne powiązanych z
    okolicznością dowodową świadka + przepis kandydujący z mapa_przepisow.
  Tezy DO OBALENIA (kontrprzesłuchanie) → z aspekty_glowne strony przeciwnej
    (jeśli dostępne) lub z wyniki_metod MET-ACH (hipotezy najsłabsze).

MATERIAŁ DO W3 (pytania):
  Blok B (pytania potwierdzające) → zatwierdzone dowody z selekcja_dowodow
    powiązane z okolicznością dowodową świadka.
  Blok D (pytania na sprzeczności / looping) → per metoda:
    MET-ACH  → pytania eliminujące hipotezy konkurencyjne
    MET-CA   → pytania o zmianę narracji między pismami/oświadczeniami
    MET-NET  → pytania weryfikujące rolę świadka w sieci powiązań
    MET-COMP → pytania o konkretny krok proceduralny (kto/kiedy/forma)
    MET-FTL  → pytania o sekwencję dat i luki logiczne w chronologii
  Blok E (pytania których NIE ZADAWAĆ) → z ostrzezenia_krzyzowe:
    jeśli pytanie o temat X mogłoby zmusić świadka do przyznania faktu
    szkodzącego tezie T_B → BLOK E oznacza to jako "temat zakazany" z
    uzasadnieniem (HARDGATE-SD-02: konkretny fragment i konkretna teza).
  Chronologia → z chronologia_wstepna: zdarzenia do loopingu
    ("zeznał pan X, tymczasem [zdarzenie BEZSPORNE] nastąpiło Y — jak
    to możliwe?").
```

### Informacja zwrotna dla użytkownika (jeśli kontekst wczytany)

```
"Wczytałem kontekst sprawy [nazwa].

Dla tego świadka przygotowuję przesłuchanie w kontekście:
  Roszczenia: [lista aspektów_glowne — 1 linijka per roszczenie]
  Zatwierdzone dowody do potwierdzenia przez świadka: [n]
  Tematy do unikania (ostrzeżenia krzyżowe): [n] 🔴 [jeśli >0]
  Materiał do sprzeczności z metod: [lista MET-XXX których wyniki są dostępne]

Jedno pytanie: KTÓREGO roszczenia dotyczy ten świadek — lub czy ma
świadczyć o całości?"
```

Odpowiedź → przypisz świadka do konkretnego aspektu_glowne (lub "całość")
→ kontynuuj do ETAP W1 z wstępnie wypełnionymi polami.

---

## ETAP W1 — INTAKE

### Cel etapu

Zebranie danych wejściowych o świadku z dwóch źródeł:
1. **Materiały dostarczone przez użytkownika** (akta, protokół, zeznania, dokumenty) — dane ekstrahujesz samodzielnie.
2. **Pytania do użytkownika** — tylko dla danych krytycznych, których nie możesz uzyskać z materiałów.

### Zasada ekstrakcji

> Jeśli użytkownik dostarczył dokumenty, zawsze najpierw czytaj i ekstrahuj z nich dane.
> Pytaj tylko o to, czego dokumenty nie zawierają lub co jest niejednoznaczne.
> Nie pytaj o informacje dostępne w materiale źródłowym.

---

### WARSTWA A — dane wspólne (każdy świadek)

Ekstrahuj z materiałów lub pytaj, jeśli brak:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Imię / inicjały | materiały | „Jak mam oznaczyć świadka?" |
| Strona powołująca | materiały / opis | „Kto powołuje świadka — Państwo czy strona przeciwna?" |
| Typ postępowania | materiały | „Jaki to rodzaj postępowania — cywilne, karne, pracownicze, administracyjne?" |
| Okoliczność dowodowa | opis / teza | „Na jaką konkretną okoliczność jest powoływany świadek?" |
| Typ relacji ze sprawą | materiały | — |
| Wcześniejsze zeznania? | materiały / opis | „Czy świadek składał już zeznania lub deklarację pisemną?" |

---

### PRIOR-TESTIMONY-GATE ⚠️

**Jeśli świadek składał już zeznania (protokół przesłuchania, deklaracja, zeznania w innym postępowaniu):**

```
⚠️ GATE: Świadek z wcześniejszymi zeznaniami.

Wymagam wprowadzenia dokumentu z poprzedniego przesłuchania.
Proszę wgrać protokół / zeznania / deklarację pisemną.

Bez tego dokumentu nie przejdę do W2 — analiza sprzeczności
i technika loopingu wymagają materiału źródłowego.
```

Jeśli użytkownik nie może dostarczyć dokumentu, odnotuj brak i zredukuj zakres W3
(blok D — pytania na sprzeczności — będzie niedostępny; zaznacz to w W2).

Po otrzymaniu dokumentu z zeznaniami: ekstrahuj z niego samodzielnie:
- kluczowe twierdzenia faktyczne,
- daty, miejsca, osoby, sekwencje,
- sformułowania potencjalnie rozbieżne z innymi dowodami,
- wszelkie zastrzeżenia, niepewności, braki odpowiedzi świadka.

---

### WARSTWA B — uzupełnienie zależne od typu świadka

Po identyfikacji typu z materiałów — ekstrahuj z dokumentów, pytaj tylko o luki.

#### TYP 1 — Świadek pracownik / współpracownik

Wymagane dane:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Stanowisko i zakres obowiązków | akta / umowy / dokumenty HR | „Jakie były jego/jej obowiązki w spornym okresie?" |
| Dostęp do spornych dokumentów / decyzji | materiały | „Czy miał bezpośredni dostęp do [dokument / decyzja]?" |
| Czas zatrudnienia / współpracy | akta | — |
| Stosunek do stron po rozstaniu | opis sytuacji | „Czy po zakończeniu zatrudnienia relacje były konfliktem, neutralne, czy pozytywne?" |
| Czy podpisał dokumenty sporne? | materiały | — |

#### TYP 2 — Świadek naoczny / „ze zdarzenia"

Wymagane dane:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Pora dnia zdarzenia | protokół / akta | „O której godzinie doszło do zdarzenia?" |
| Warunki oświetlenia | opis / protokół | „Jakie było oświetlenie — dzień, noc, sztuczne światło?" |
| Warunki atmosferyczne | opis / dokumenty | „Jaka była pogoda — mgła, deszcz, śnieg, dobre warunki?" |
| Odległość od zdarzenia | protokół / szkic | „W jakiej odległości od zdarzenia znajdował się świadek?" |
| Kąt i pole widzenia | opis / szkic | „Czy miał bezpośrednią linię wzroku, czy patrzył przez przeszkodę?" |
| Wady wzroku / słuchu | wcześniejsze zeznania | „Czy świadek nosi okulary lub ma inne wady zmysłów istotne dla obserwacji?" |
| Stan psychofizyczny świadka | opis | „Czy świadek był w normalnym stanie — bez wpływu alkoholu, silnych emocji, zmęczenia?" |
| Czas od zdarzenia do pierwszej relacji | protokół / data | — |

#### TYP 3 — Świadek ze słyszenia

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Kto przekazał informację | „Od kogo świadek dowiedział się o zdarzeniu?" |
| Kiedy i w jakich okolicznościach | „Kiedy i gdzie doszło do tego przekazu?" |
| Czy istnieje możliwość weryfikacji pośrednika | „Czy pośrednik jest dostępny jako świadek lub czy istnieje pisemny ślad?" |

#### TYP 4 — Ekspert / biegły

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Metodologia opinii | „Jaką metodologią posłużył się biegły?" |
| Zleceniodawca opinii | „Kto zlecił opinię — sąd, strona, prokuratura?" |
| Wcześniejsze opinie w podobnych sprawach | „Czy biegły wydawał wcześniej opinie w podobnych sprawach?" |
| Ewentualne powiązania ze stronami | „Czy biegły jest powiązany zawodowo lub osobiście z którąś ze stron?" |

#### TYP 5 — Świadek charakteru

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Czas znajomości | „Od jak dawna świadek zna stronę?" |
| Częstotliwość kontaktów | „Jak często się kontaktowali w spornym okresie?" |
| Podstawa oceny charakteru | „Skąd świadek czerpie wiedzę o charakterze / wiarygodności strony?" |

---

### INTAKE-COMPLETENESS-GATE

Po zebraniu danych W1 wykonaj kontrolę:

```
POLA KRYTYCZNE — bez nich NIE przechodzę do W2:
  □ Strona powołująca
  □ Okoliczność dowodowa
  □ Typ świadka
  □ Dane z Warstwy B (min. 3 z 4+ wymaganych dla danego typu)

POLA UZUPEŁNIAJĄCE — brak → zaznacz ⬛ i kontynuuj:
  □ Szczegóły warunków obserwacji (typ 2)
  □ Stosunek do stron (typ 1)
  □ Wcześniejsze opinie (typ 4)
```

Jeśli brakuje pól krytycznych — zadaj 1–3 pytania uzupełniające, jedno na wiadomość.
Jeśli wszystkie pola krytyczne są uzupełnione — przejdź do W2 bez dodatkowych pytań.

---

## ETAP W2 — TEZY I MODEL

### Cel etapu

Na podstawie danych z W1 (i dokumentów z zeznaniami jeśli dostępne) przygotuj:

> **CLAIM-VALIDATION przed tezami:**
> `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`
> Twierdzenia strony co do okoliczności dowodowych → weryfikuj wobec dostarczonych materiałów.
> Twierdzenie sprzeczne z materiałem → odrzuć; tezę sformułuj zgodnie z tym co wynika z dokumentów.
> Twierdzenie bez oparcia → nie formułuj tezy; zaznacz jako lukę dowodową w pkt 1 poniżej.

1. **Tezy główne do udowodnienia** (maks. 5, konkretne fakty procesowe powiązane z okolicznością dowodową)
2. **Tezy do obalenia / osłabienia** (jeśli świadek strony przeciwnej)
3. **Kluczowe sprzeczności** (jeśli dostępne wcześniejsze zeznania — maks. 5 rozbieżności z cytatem i komentarzem)
4. **Typ świadka** z klasyfikacją i uzasadnieniem
5. **Scoring wstępny 0–10** (skala: 0–3 słaby, 4–6 umiarkowany, 7–8 istotny, 9–10 kluczowy)
6. **Rekomendacja modelu przesłuchania** (patrz niżej)
7. **Prawdopodobny typ sędziego** lub założenie neutralne

---

### MODEL-SELECTION-GATE — Modele przesłuchania

Dobierz model do sytuacji. Opisz wybór z uzasadnieniem i podaj model alternatywny.

#### MODEL PEACE
*(Preparation → Engage → Account → Closure → Evaluation)*

Kiedy stosować: świadek współpracujący, zeznania narracyjne, sprawy cywilne i pracownicze,
świadek lojalizowany lub neutralny.

Struktura pytań: otwarte → narracyjne → uszczegóławiające → zamknięte kontrolne.
Zasada: nie przerywaj swobodnej narracji, używaj pauz jako narzędzia.

Technika Account: najpierw narracja do przodu → potem narracja od końca lub z innej perspektywy
(kognitywa weryfikacja spójności pamięci).

#### MODEL LEJEK (Funnel)
*(szerokie → wąskie → zamknięte)*

Kiedy stosować: świadek ostrożny, częściowo nielojalny, nie wiadomo czego unikać.

Struktura: pytania ogólne otwierają → każda odpowiedź generuje pytanie bardziej szczegółowe →
na końcu pytania zamknięte blokujące fakt.

Zaleta: świadek sam dostarcza materiału do dalszego zawężania, trudniej ucieka
przed pytaniem które wynika z jego własnej poprzedniej odpowiedzi.

#### MODEL ONE-FACT-PER-QUESTION + LOOPING
*(kontrprzesłuchanie / cross-examination)*

Kiedy stosować: świadek strony przeciwnej, zeznania do podważenia, sprzeczności do ujawnienia.

Zasada: jedno pytanie = jeden fakt. Pytania zamknięte (tak/nie lub konkretna wartość).
Świadek nie ma przestrzeni do wyjaśnień — tylko potwierdza lub przeczy.

Technika loopingu: po uzyskaniu ustępstwa wróć do niego w kolejnym pytaniu jako pewnik:
„A skoro powiedział Pan, że [przyznany fakt], to czy...". Blokuje cofnięcie przyznania,
przypomina sądowi kluczowy punkt.

Wersja triple-loop: to samo ustępstwo wplecione trzy razy w różnych kontekstach.

#### MODEL CHRONOLOGICZNY + PRIMACY/RECENCY

Kiedy stosować: świadek bezpośredni, zdarzenie rozciągnięte w czasie, budowanie narracji
do zamknięcia.

Zasada primacy/recency: najważniejsze fakty na początku i końcu przesłuchania,
fakty potencjalnie szkodliwe w środku bloku.

Przy wątku narracyjnym: pytania w porządku chronologicznym.
Przy wątkach niepowiązanych chronologicznie: porządek według wagi dowodowej.

---

### Scoring W2 (wstępny)

> ⚙️ **Uwaga FPW:** Dla każdej tezy wskaż wstępnie przepis kandydujący ⚠️ [kandydat]
> i oczekiwany wniosek procesowy. Pełna weryfikacja ISAP → W3 FPW-2.

Oceń na skali 0–10 na podstawie:

| Kryterium | Waga |
|---|---|
| Bezpośredniość wiedzy o zdarzeniu | wysoka |
| Interes w wyniku sprawy | wysoka |
| Spójność z dokumentami / innymi dowodami | wysoka |
| Odporność na kontrpytania (prognoza) | średnia |
| Znaczenie dla ciężaru dowodu | wysoka |
| Stabilność relacji w czasie | średnia |
| Warunki obserwacji (tylko typ 2) | wysoka |

Scoring W2 jest wstępny — zaktualizuj go w W3 po analizie pytań ryzykownych.

---

## CHECKPOINT-W2 — OBOWIĄZKOWA PAUZA PRZED W3

> ⛔ REGUŁA DWÓCH WIADOMOŚCI — system zatrzymuje się tutaj.
> Po dostarczeniu W2 (tez, profilu, modelu, scoringu) system CZEKA.
> Pytania W3 generowane są w OSOBNEJ wiadomości, dopiero po uwagach użytkownika.

```
WIADOMOŚĆ 1 (ta wiadomość):
  Zawiera: PRE-W1 profil + mapa wiedzy + KROK 0 + W1 intake + W2 tezy/model/scoring
  Kończy się pytaniem do użytkownika.

WIADOMOŚĆ 2 (następna wiadomość, po odpowiedzi użytkownika):
  Zawiera: W3 pytania (kompletny zestaw z FPW + macierz + scoring finalny + rekomendacje)
```

### Treść CHECKPOINT-W2

Po dostarczeniu W2 system prezentuje podsumowanie i zadaje jedno pytanie:

```
═══════════════════════════════════════════════════════════
CHECKPOINT W2 — WERYFIKACJA PRZED GENEROWANIEM PYTAŃ
═══════════════════════════════════════════════════════════

ŚWIADEK:        [oznaczenie]
TYP:            [typ 1/2/3/4/5]
SCORING W2:     [X]/10 — [kwalifikacja]
MODEL:          [PEACE / LEJEK / ONE-FACT / CHRONOLOGICZNY]
ALTERNATYWA:    [model zapasowy]

TEZY (do wykazania):
  T1: [treść] — przepis kandydujący: ⚠️ [art. X]
  T2: ...

TEZY DO OBALENIA (jeśli cross):
  T_OB1: [treść]

SPRZECZNOŚCI DOSTĘPNE: [n] — kluczowe: [lista]

TEMATY ZAKAZANE (BLOK E):
  [lista z uzasadnieniem]

LUKI DOWODOWE:
  [tematy bez dowodu kontrolnego → SAFE-Q wymagane]

══════════════════════════════════════════════════════════
Czy tezy i model są właściwe? Czy chcesz coś zmienić lub
uzupełnić zanim przejdę do generowania pytań?
(Możesz odpowiedzieć "OK" aby kontynuować lub wskazać zmiany)
══════════════════════════════════════════════════════════
```

**Reguła CHECKPOINT-W2:** System nie generuje żadnego pytania z W3 bez
potwierdzenia użytkownika lub jawnej zgody ("OK", "kontynuuj", "generuj").
Wyjątek: użytkownik w pierwotnym poleceniu wprost zażądał pytań
("przygotuj od razu pytania", "wygeneruj cały zestaw") → pomiń checkpoint,
ale poinformuj że W2 i W3 są w tej samej wiadomości.

---

## ETAP W3 — PYTANIA

### Cel etapu

Wygenerowanie kompletnego zestawu pytań podzielonych na bloki,
z pełną bramką dla każdego pytania i finalną macierzą.

---

### QUESTION-ADMISSIBILITY-GATE

> ⛔ PIPELINE FPW (FAKT → PODSTAWA PRAWNA → WNIOSEK) — obowiązkowy przed każdym pytaniem.
> Pełna procedura: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md`

Każde pytanie musi zawierać:

```
FPW-1 FAKT:   [fakt procesowy + źródło: dok_id/strona/zeznanie/domniemanie]
FPW-2 PRAWO:  [przepis → weryfikacja ISAP → ✅ [VER: ISAP, data] lub ⚠️ BRAK]
FPW-3 WNIOSEK:→ TAK: [skutek dla tezy] | → NIE: [skutek dla tezy]
              Ryzyko FPW: BEZPIECZNE / RYZYKO-ODPOWIEDŹ / RYZYKO-KONTROLA / RYZYKO-KUMULACJA

PYTANIE:      [treść pytania]
CEL:          [co chcę uzyskać procesowo]
TEZA:         [której tezie z W2 służy]
TYP:          [otwarte / zamknięte / kontrolne / pułapkowe / impeachment]
DOWÓD KON.:   [dowód który potwierdzi lub obali odpowiedź] / [brak → aktywuj SAFE-Q]
RYZYKO:       [podtyp: RYZYKO-KONTROLA / RYZYKO-ODPOWIEDŹ / RYZYKO-KUMULACJA + opis]
DOPUSZCZ.:    [dopuszczalne / ryzykowne / niedopuszczalne + podstawa prawna ✅]
```

**Reguła WHY-GATE (twardy zakaz w trybie cross):**
```
⛔ WHY-GATE — jeśli model = ONE-FACT lub świadek = wrogi/strony przeciwnej:
  Pytania "dlaczego / po co / w jakim celu / jak to możliwe" są ZAKAZANE.
  Klasyfikacja: RYZYKO-KONTROLA → automatyczny BLOK E.
  Wyjątek: świadek lojalny w modelu PEACE lub LEJEK — dopuszczalne.
```

**Reguła SAFE-Q (brak dowodu kontrolnego):**
```
Jeśli DOWÓD KON. = brak:
  → Przeformułuj pytanie tak, by obie odpowiedzi (TAK i NIE) były
    procesowo użyteczne lub neutralne.
  → Jeśli przeformułowanie niemożliwe → pytanie do BLOKU E.
  → Nie zadawaj pytania bez dowodu kontrolnego do BLOKU D (impeachment).
```

**Reguła FPW-RISK:**
```
Jeśli FPW-3 wskazuje, że odpowiedź NIE jest aktywnie szkodliwa dla tezy
→ pytanie automatycznie BLOK E (ryzykowne).
Podtyp RYZYKO-ODPOWIEDŹ.
```

**Podstawy prawne dopuszczalności — weryfikuj przez HARDGATE, nie z pamięci:**

```
⛔ HARDGATE — przed podaniem jakiejkolwiek podstawy prawnej:
  view /mnt/skills/user/shared/PRAWO-HARDGATE.md

Podstawy wymagające weryfikacji online (przykłady — nie wyczerpująca lista):
  KPC: pytania sugestywne (art. 271), zakaz zeznań co do faktów objętych tajemnicą
       (art. 261), zakaz zeznań małżonka i bliskich (art. 261 §1)
  KPK: zakaz dowodowy (art. 168a, 174, 178, 199), prawo do odmowy zeznań (art. 182),
       zwolnienie z zachowania tajemnicy (art. 180), konfrontacja (art. 172)
  KPW: odpowiednie stosowanie KPK (art. 39, 41)
  KPA: zeznania w postępowaniu administracyjnym (art. 83, 86)

Dla każdej powołanej podstawy → web_search ISAP → oznacz ✅ [VER: ISAP, data]
```

**Pełna logika klasyfikacji pytań:**
`view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md`

---

### BLOK A — Pytania identyfikujące i wiarygodnościowe

Cel: ustalenie relacji świadka ze sprawą, stronami, podstawy wiedzy, ewentualnego interesu.

Zawsze na początku. Ilość: 3–6 pytań.
Model domyślny dla tego bloku: PEACE (Engage).

Przykładowe obszary (dobierz do danych z W1):
- Skąd świadek zna okoliczności sprawy?
- Jak długo i w jaki sposób pozostawał w kontakcie ze stronami?
- Czy posiada interes osobisty lub finansowy w wyniku sprawy?
- Czy był wcześniej przesłuchiwany w tej lub powiązanej sprawie?

---

### BLOK B — Pytania główne (tezy z W2)

Cel: udowodnienie tez dowodowych zidentyfikowanych w W2.

Ilość: min. 2 pytania na tezę.
Model: zgodnie z rekomendacją z W2.

Przy modelu PEACE: pytania otwarte narracyjne → uszczegóławiające.
Przy modelu LEJEK: szerokie → wąskie.
Przy modelu ONE-FACT: zamknięte, jedno zdanie, jeden fakt.

---

### BLOK C — Pytania kontrolne i zabezpieczające

Cel: potwierdzenie kluczowych faktów alternatywnymi sformułowaniami,
zabezpieczenie ustępstw przed wycofaniem.

Ilość: 3–8 pytań.
Technika: looping dla ustępstw uzyskanych w Bloku B.

**SYGNAŁY STOP — oznacz przy każdej grupie pytań w tym bloku:**

```
STOP-1: USTĘPSTWO UZYSKANE
  Świadek potwierdził kluczowy fakt → natychmiast przejdź dalej.
  Nie pytaj o przyczynę, nie eksploruj — looping w BLOKU C, potem STOP.

STOP-2: ODPOWIEDŹ ROZSZERZONA SZKODLIWA
  Świadek zaczął narrację korzystną dla siebie → nie kontynuuj linii.
  Wróć do pytania zamkniętego z innego obszaru lub zmień blok.

STOP-3: ŚWIADEK ZMIENIŁ POSTAWĘ
  Świadek odpowiada inaczej niż prognozowano w W2 → aktywuj model awaryjny
  z REKOMENDACJI KOŃCOWYCH. Nie improwizuj otwartymi pytaniami.

STOP-4: CEL ROZDZIAŁU OSIĄGNIĘTY
  Cel procesowy bloku/rozdziału zrealizowany → zakończ blok bez "jednego pytania za dużo".
```

---

### BLOK D — Pytania na sprzeczności
*(dostępny TYLKO jeśli dostarczono dokument z wcześniejszymi zeznaniami)*

Cel: ujawnienie rozbieżności między obecnymi zeznaniami a wcześniejszymi.

Dla każdej sprzeczności zidentyfikowanej w W2:
- Przytoczyć wcześniejsze sformułowanie (bez cytowania wprost — parafrazą lub przez pytanie).
- Pytanie stwierdzające aktualną wersję.
- Pytanie konfrontacyjne ujawniające rozbieżność.
- Pytanie o przyczynę zmiany zeznań.

Jeśli dokument zeznań nie został dostarczony:
```
⬛ BLOK D: niedostępny — brak dokumentu z wcześniejszymi zeznaniami.
   Aby odblokować: dostarcz protokół przesłuchania / deklarację pisemną.
```

---

### BLOK E — Pytania ryzykowne i niedopuszczalne

Dla każdego pytania ryzykownego lub niedopuszczalnego podaj:
- treść pytania,
- dlaczego jest ryzykowne / niedopuszczalne,
- alternatywę bezpieczną lub rezygnację.

Kategorie:
- **Niedopuszczalne**: sugestywne w przesłuchaniu bezpośrednim, naruszające zakazy dowodowe,
  dotyczące faktów nieobjętych tezą dowodową.
- **Ryzykowne**: otwarte na odpowiedź szkodliwą, mogące wzmocnić zeznania świadka,
  pytania bez dowodu kontrolnego.

---

### MACIERZ FINALNA

Format tabeli:

| # | Pytanie (skrót) | Blok | Cel | Teza | Dowód kontrolny | Ryzyko |
|---|---|---|---|---|---|---|

Uwzględnij wszystkie pytania z Bloków A–D.

---

### SCORING FINALNY

Zaktualizowany scoring 0–10 po analizie pytań ryzykownych.

Format:
```
SCORING FINALNY: [X]/10 — [słaby / umiarkowany / istotny / kluczowy]

Uzasadnienie:
- Bezpośredniość wiedzy: [ocena]
- Interes w wyniku: [ocena]
- Spójność z dokumentami: [ocena]
- Odporność na kontrpytania: [ocena]
- Znaczenie dla ciężaru dowodu: [ocena]
- Warunki obserwacji (jeśli typ 2): [ocena]

Zmiana względem W2: [bez zmiany / podniesiony / obniżony + powód]
```

---

### REKOMENDACJE KOŃCOWE

- Kolejność bloków na sali (jeśli odmienna od A→B→C→D).
- Kwestie do monitorowania podczas przesłuchania.
- Pytania rezerwowe na wypadek nieoczekiwanej odpowiedzi.
- Rekomendacja co do modelu awaryjnego (jeśli świadek zmieni postawę).

---

## ETAP W4 — PRÓBA GENERALNA (przed rozprawą)

> Aktywowany na żądanie lub automatycznie gdy użytkownik mówi
> "jutro rozprawa", "za X dni przesłuchanie", "przejrzyj pytania".
> Metodyka: Wagner (Taft Law 2024) — "Practice Your Cross-Examination".

```
LISTA KONTROLNA W4:
□ Przejrzyj macierz finalną — usuń pytania które "nie czujesz"
□ Zidentyfikuj 4-6 rozdziałów do użycia (z 8-10 przygotowanych)
□ Sprawdź kolejność: PRIMACY — mocny start, RECENCY — mocne zakończenie
□ Sprawdź każdy DOWÓD KON. — czy wiesz gdzie FIZYCZNIE jest w aktach?
□ Przećwicz BLOK D (sprzeczności) — znaj strony protokołów na pamięć
□ Przygotuj "clap-back" na 3 najbardziej prawdopodobne odpowiedzi wymijające
□ Wyznacz STOP-4 dla każdego rozdziału — gdzie kończysz niezależnie od wyniku
□ Ustal model awaryjny: co robisz gdy świadek zmieni postawę w trakcie?
```

**Wynik W4:** zatwierdzona lista rozdziałów z kolejnością + model awaryjny.

---

## ETAP W5 — BINDER SĄDOWY

> Instrukcja do użycia NA SALI. Aktywowana na żądanie lub przy W4.
> Metodyka: Pozner & Dodd 4th ed. (2024) — "Sourcing the Facts in Real Time".

```
STRUKTURA BINDERA (per świadek):
  Zakładka 1: MACIERZ FINALNA (pytania w kolejności rozdziałów)
  Zakładka 2: PREPARATION CHART (tematy A-priorytet)
  Zakładka 3: DOKUMENTY KONTROLNE (kluczowe strony do pokazania świadkowi)
              → każdy dok_id z KROK III ma fizyczną zakładkę z numerem strony
  Zakładka 4: BLOK D — sprzeczności (cytat wcześniejszy + strona)
  Zakładka 5: MODEL AWARYJNY (jeśli świadek zmieni postawę)

NAWIGACJA NA SALI:
  Każde pytanie ma numer → numer = zakładka dokumentu jeśli potrzeba
  Nigdy nie szukaj dokumentu podczas przesłuchania — wszystko oznaczone przed salą
```

---

## ETAP W6 — SŁUCHANIE DIRECT I ADAPTACJA

> Etap w trakcie rozprawy: przed Twoim cross świadek zeznaje na wprost.
> Metodyka: Davis (NACDL), Rev (2026) — aktywne słuchanie = przygotowanie.

```
PODCZAS DIRECT EXAMINATION (zeznania na wprost / przesłuchanie przez sąd):

□ NOTUJ dosłowne sformułowania świadka — szczególnie:
    - fakty których nie przewidziałeś w W2
    - sformułowania sprzeczne z KROK III-D (cytaty z protokołów)
    - odpowiedzi otwierające nowe wątki (ryzyko lub szansę)
    - "nigdy / zawsze / niemożliwe" → ekstrema do wykorzystania

□ OCENIAJ per rozdział z W4:
    ZIELONY: świadek potwierdził Twoją tezę już w direct → ten rozdział możesz skrócić
    ŻÓŁTY:   zeznania neutralne → realizuj plan
    CZERWONY: świadek rozwinął narrację szkodliwą → aktywuj model awaryjny z W4

□ DECYDUJ co usunąć:
    Jeśli świadek przyznał fakt X na direct → nie pytaj o X w cross
    (looping straci efekt, ryzykujesz rozwinięcie niekorzystne)

□ DECYDUJ co dodać:
    Jeśli pojawiło się nowe sformułowanie → oceń FPW-3 przed zadaniem pytania
    Jeśli nie masz dowodu kontrolnego → SAFE-Q lub pomiń

□ PO DIRECT — przed cross:
    Przeglądnij zakładki bindera (30 sekund)
    Zaznacz rozdziały do użycia (z zatwierdzonych 4-6)
    Potwierdź kolejność PRIMACY/RECENCY
```

---

## Zakaz

Nie wolno domyślnie:

- pomijać KROK PRE-W1 WITNESS-INTELLIGENCE gdy dostarczone są dokumenty o świadku,
- generować pytań bez przejścia przez W1 i W2,
- **generować pytań bez zamkniętego pipeline FPW (FPW-1 + FPW-2 + FPW-3)**
  — brak FPW = pytanie procesowo nieuzasadnione, niezależnie od treści,
- **oznaczać FPW-2 jako ✅ [VER] bez faktycznego wywołania web_search/web_fetch**
  — fałszywy VER = CRIT,
- **zadawać pytań "dlaczego / po co / w jakim celu" przy modelu ONE-FACT**
  **lub świadku wrogim** — WHY-GATE → automatyczny BLOK E (RYZYKO-KONTROLA),
- generować pytań bez DOWÓD KON. bez aktywacji procedury SAFE-Q,
- pomijać PRIOR-TESTIMONY-GATE jeśli świadek składał zeznania,
- tworzyć bloku D bez dokumentu źródłowego,
- pytać użytkownika o dane dostępne w materiałach,
- tworzyć artefaktu graficznego bez wyraźnego żądania,
- importować brakujących komponentów JSX,
- generować pytań bez bramki QUESTION-ADMISSIBILITY-GATE,
- **podawać artykułów KPC/KPK/KPW/KPA o dopuszczalności dowodów z pamięci** — każda
  podstawa prawna wymaga weryfikacji przez PRAWO-HARDGATE przed podaniem.

---

## Integracja z innymi skilla

| Skill | Kiedy wywołać |
|---|---|
| `analizator-dowodow-v3` | przed W2 jeśli dostępne obszerne akta |
| `chronologia-sprawy-v1` | jeśli zdarzenia mają złożoną oś czasu |
| `analiza-sadowa-v6` | jeśli potrzebna ocena szans sprawy przed doborem strategii |
| `raport-sytuacyjny-v2` | po W3 na żądanie użytkownika |
| `shared/DOWODY-METODOLOGIA.md` | przy ocenie wartości dowodowej zeznań |
| `shared/STRATEGIA-PROCESOWA.md` | przy doborze modelu przesłuchania |

---

## Tryb graficzny — tylko na żądanie

Tryb JSX / widget uruchamiany wyłącznie gdy użytkownik użyje:
„pokaż graficznie", „dashboard", „panel JSX", „wizualizacja", „diagram".

W razie wątpliwości zawsze wybierz tryb tekstowy.

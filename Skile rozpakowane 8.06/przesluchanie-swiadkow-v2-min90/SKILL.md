---
name: przesluchanie-swiadkow-v2-min90
version: 3.0
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
  Pipeline sekwencyjny W1 (intake) → W2 (tezy i model) → W3 (pytania).
  Nie generuje pytań z pominięciem etapów intake i tez.
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
validation:
  required_gates:
    - PRAWO-HARDGATE
    - PRIOR-TESTIMONY-GATE
    - WITNESS-TYPE-GATE
    - INTAKE-COMPLETENESS-GATE
    - QUESTION-ADMISSIBILITY-GATE
    - WITNESS-SCORING
    - FACT-EVIDENCE-MAPPING
    - MODEL-SELECTION-GATE
    - CROSS-EXAMINATION-GATE
    - TEXT-FIRST-UI-GATE
pipeline:
  stages:
    - W1-INTAKE
    - W1-SUPPLEMENT
    - W2-THESES-AND-MODEL
    - W3-QUESTIONS
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

## ETAP W3 — PYTANIA

### Cel etapu

Wygenerowanie kompletnego zestawu pytań podzielonych na bloki,
z pełną bramką dla każdego pytania i finalną macierzą.

---

### QUESTION-ADMISSIBILITY-GATE

Każde pytanie musi zawierać:

```
PYTANIE:      [treść pytania]
CEL:          [co chcę uzyskać procesowo]
TEZA:         [której tezie z W2 służy]
TYP:          [otwarte / zamknięte / kontrolne / pułapkowe / impeachment]
DOWÓD KON.:   [dowód który potwierdzi lub obali odpowiedź] / [brak — zaznacz]
RYZYKO:       [co może pójść nie tak / odpowiedź niekorzystna]
DOPUSZCZ.:    [dopuszczalne / ryzykowne / niedopuszczalne + podstawa prawna]
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

## Zakaz

Nie wolno domyślnie:

- generować pytań bez przejścia przez W1 i W2,
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

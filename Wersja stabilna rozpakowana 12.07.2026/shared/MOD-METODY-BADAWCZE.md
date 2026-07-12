# MOD-METODY-BADAWCZE — rejestr metod badawczych dla analizy sprawy

> Status: shared canonical. Wczytywany przez `analizator-dowodow-v3` (BLOK E),
> `MOD-PRIORYTETY-ASPEKTOW.md` (sekcja "Metody badawcze") i opcjonalnie
> `analiza-sadowa-v6`.
>
> ⛔ HARD GATE: jeśli metoda odwołuje się do standardu/normy/publikacji
> eksperckiej z nazwy (np. cytat metodologii), nazwa metody jako *kategoria
> analityczna* nie wymaga weryfikacji ISAP (to nie przepis prawa) — ale każdy
> WNIOSEK z zastosowania metody, który powołuje się na przepis, orzeczenie lub
> normę, podlega PRAWO-HARDGATE bez wyjątku.

---

## 1. Cel modułu

Rozszerza dotychczasowe metody śledcze `analizator-dowodow-v3` (profilowanie,
VSA, HUMINT — sekcja E2) o metody pozaśledcze stosowane w analizie spraw
sądowych i procesowych: procesowo-prawnicze (§3 — ACH, forensic timeline,
network analysis, content analysis), z nauk społecznych (§3a — case study,
process tracing, triangulacja), ekonomiczno-finansowe (§3b — forensic
accounting, damages quantification) i compliance (§3c — analiza zgodności
proceduralnej). System może:

- **automatycznie dobrać** 1-2 metody na podstawie typu sprawy i charakteru
  materiału dowodowego (patrz §4 — mapowanie),
- **pozwolić użytkownikowi (PRAWNIK)** wybrać metodę explicite z rejestru,
- **dla LAIK** — pokazać tylko opis funkcjonalny metody, bez nazewnictwa
  eksperckiego (patrz §5).

Wynik zastosowania metody zasila: checklistę priorytetów (`MOD-PRIORYTETY-ASPEKTOW.md`),
mapę ryzyk w `raport-sytuacyjny-v2`, oraz argumentację w `MOD-WARIANTY-POZWU.md`.

---

## 1a. Model wykonania — JEDNOETAPOWY vs DWUETAPOWY

Każda metoda w rejestrze ma przypisany model wykonania:

```
JEDNOETAPOWY (domyślny): sygnał auto-doboru = TAK → metoda wykonywana
  w PEŁNI od razu (KROK 3 analizator-dowodow-v3) → wynik trafia do dashboardu
  i checklisty (KROK 3B) jako gotowa analiza.
  Dotyczy: MET-FTL, MET-CA, MET-CASE, MET-PT, MET-TRI, MET-DQ.

DWUETAPOWY (metody kosztowne — najwyższy nakład tokenowy/poznawczy):
  KROK A — SZKIC: sygnał auto-doboru = TAK → wykonaj WYŁĄCZNIE "PROCEDURĘ
    SZKICU" (1-2 kroki, bez pełnej macierzy/grafu/tabeli) → zapisz jako
    kandydata z 1-zdaniową obserwacją → KROK 3B (checklist).
  KROK B — GŁĘBOKA: w checkliście użytkownik wybiera per kandydat
    "Pomiń" lub "Analiza głęboka" → TYLKO dla "Analiza głęboka" wykonaj
    pełną procedurę z pola "WYNIK" (macierz/graf/tabela) → wynik trafia
    do dashboardu/raportu.
  Dotyczy: SLE-01, SLE-02, SLE-03 (MP6), MET-ACH, MET-NET, MET-FA.
```

### Format wyniku SZKICU (KROK A)

```json
{
  "aspekt_id": "ASP-2",
  "metoda": "MET-CA",
  "model": "jednoetapowy|dwuetapowy",
  "sygnal": "krótki opis sygnału auto-doboru, który się aktywował",
  "wstepna_obserwacja": "1 zdanie — konkretna obserwacja z materiału,
                          uzasadniająca sygnał (NIE ogólne kryterium)",
  "naklad_szacowany": "niski|średni|wysoki — szacunek nakładu KROK B"
}
```

Dla metod JEDNOETAPOWYCH pole `wstepna_obserwacja` jest tożsame z `powod`
z §6 (format checklisty) — metoda jest już wykonana, obserwacja = wniosek.

Dla metod DWUETAPOWYCH `wstepna_obserwacja` jest WYNIKIEM PROCEDURY SZKICU
(patrz pole "PROCEDURA SZKICU" przy każdej z metod §2/§3), NIE wynikiem
pełnej metody — pełna metoda wykonywana jest tylko po wyborze "Analiza
głęboka".

### Self-check przed KROK 3B

```
□ Dla każdej metody z sygnałem auto-doboru = TAK: sprawdzony model
  (jednoetapowy/dwuetapowy) wg tabeli powyżej?
□ Dla modelu dwuetapowego: wykonana WYŁĄCZNIE procedura szkicu, NIE pełna
  metoda — przed checklistą?
□ Czy `wstepna_obserwacja` opisuje konkretny fakt z materiału, nie
  ogólnikowo powtarza kryterium auto-doboru?
Którykolwiek = NIE → koryguj przed renderem checklisty.
```

---

## 2. Rejestr metod — kategoria ŚLEDCZA (istniejąca, referencja)

Metody już obsługiwane przez `analizator-dowodow-v3` BLOK E2 (profilowanie,
VSA — Verbal Statement Analysis, HUMINT-style wywiad). Ten moduł ich nie
duplikuje — referencja:

```
ID: SLE-01  Profilowanie behawioralne stron
ID: SLE-02  VSA (analiza treści zeznań/oświadczeń)
ID: SLE-03  HUMINT-style — ocena wiarygodności źródeł osobowych
```

Kryterium auto-doboru: sprawa karna LUB podejrzenie manipulacji/ukrytej
motywacji LUB sprzeczne zeznania świadków (BLOK E2 = TAK w analizator-dowodow-v3).

MODEL WYKONANIA: **DWUETAPOWY** (§1a) — najwyższy nakład w rejestrze (MP6,
457 linii).

```
PROCEDURA SZKICU (KROK A, dla SLE-01/02/03 łącznie — MP6 nie jest dzielony
na trzy osobne szkice, jeden szkic obsługuje wszystkie trzy):
  1. Zidentyfikuj 1-3 fragmenty zeznań/oświadczeń, które wykazują sygnały
     wymagające głębszej analizy (niekonsekwencja w opisie własnych działań,
     nietypowa szczegółowość/unikanie szczegółów, zmiana rejestru językowego
     między fragmentami tej samej osoby).
  2. Dla każdego fragmentu — 1 zdanie: CO konkretnie wzbudza sygnał (np.
     "świadek opisuje wydarzenia z 3 miesięcy temu z dokładnością do minuty,
     ale nie pamięta wydarzenia z tygodnia wcześniej").
  3. NIE wykonuj pełnego profilowania, VSA ani oceny HUMINT — to KROK B.

WYNIK SZKICU: lista 1-3 fragmentów + obserwacja wg wzorca §1a, naklad_szacowany
  zazwyczaj "wysoki" (MP6 = 457 linii instrukcji).
```
```
PROCEDURA GŁĘBOKA (KROK B, po wyborze "Analiza głęboka"):
  view /mnt/skills/user/analizator-dowodow-v3/SKILL.md → wczytaj MP6 zgodnie
  z dotychczasową logiką (BLOK E2) — pełne profilowanie/VSA/HUMINT dla
  fragmentów wskazanych w szkicu (nie dla całego materiału, jeśli szkic
  zawęził zakres).
```

---

## 3. Rejestr metod — kategoria PROCESOWA/PRAWNICZA (nowe)

### MET-ACH — Analiza Konkurujących Hipotez (Analysis of Competing Hypotheses)

```
ID:          MET-ACH
NAZWA PL:    Analiza konkurujących hipotez
OPIS:        Dla danego zdarzenia/faktu spornego budowana jest macierz:
             wiersze = hipotezy konkurujące (np. "powód sam wypowiedział umowę"
             vs "pracodawca rozwiązał umowę bez przyczyny"), kolumny = dowody.
             Każdy dowód oceniany jest jako: POTWIERDZA / WYKLUCZA / NEUTRALNY
             względem każdej hipotezy. Hipoteza z największą liczbą "WYKLUCZA"
             jest najsłabsza — nie ta z największą liczbą potwierdzeń.
ZASTOSOWANIE: Sprawy ze sprzecznymi wersjami zdarzeń (klasa SPORNE w
             chronologia-sprawy-v1), gdzie strony przedstawiają wzajemnie
             wykluczające się narracje i nie ma dowodu rozstrzygającego wprost.
WYNIK:       Macierz hipoteza×dowód + ranking hipotez od najsłabszej (do
             odrzucenia) do najsilniejszej (do budowy na niej argumentacji).
KRYTERIUM AUTO-DOBORU:
             ≥2 wzajemnie wykluczające się wersje zdarzenia tego samego faktu
             ORAZ brak dowodu kategorii A (urzędowy/bezsporny) rozstrzygającego
             jednoznacznie → auto-aktywacja.
INTEGRACJA:  Wejście: MD3c (sprzeczności między dokumentami) z
             analizator-dowodow-v3. Wyjście: zasila §I.3 (Sprzeczności)
             w raport-sytuacyjny-v2 oraz argumentację "obalanie" w
             MOD-WARIANTY-POZWU.
MODEL WYKONANIA: DWUETAPOWY (§1a).
PROCEDURA SZKICU (KROK A):
             1. Zidentyfikuj fakt sporny + dwie (lub więcej) wzajemnie
                wykluczające się hipotezy (z MD3c).
             2. Wskaż 1 dowód kategorii A (jeśli istnieje, choćby częściowo
                rozstrzygający) lub stwierdź jego brak.
             3. NIE buduj pełnej macierzy hipoteza×dowód — to KROK B.
             WYNIK SZKICU: "Fakt: [opis]. Hipotezy: [H1] vs [H2]. Dowód
             rozstrzygający: [wskazany / brak]." — 1-2 zdania.
PROCEDURA GŁĘBOKA (KROK B, po wyborze "Analiza głęboka"):
             Pełna macierz hipoteza×dowód wg pola WYNIK — wszystkie dostępne
             dowody oceniane POTWIERDZA/WYKLUCZA/NEUTRALNY względem każdej
             hipotezy, ranking od najsłabszej.
```

### MET-FTL — Forensic Timeline (analiza chronologii śledczej/dowodowej)

```
ID:          MET-FTL
NAZWA PL:    Analiza chronologii dowodowej (forensic timeline)
OPIS:        Rekonstrukcja sekwencji zdarzeń z naciskiem na: (1) odstępy
             czasowe między zdarzeniami a reakcjami stron (np. czas reakcji
             na wypowiedzenie, czas zgłoszenia roszczenia), (2) wykrywanie
             zdarzeń "brakujących" — logicznie wymaganych, ale nieudokumentowanych,
             (3) korelację między datą dokumentu a datą zdarzenia, które
             dokumentuje (czy dokument mógł powstać post factum).
ZASTOSOWANIE: Sprawy gdzie kluczowa jest sekwencja/terminowość (przedawnienie,
             terminy zawite, kwestia "kto pierwszy" — np. spór o pierwszeństwo
             wypowiedzenia), lub gdzie podejrzewana jest antydatacja dokumentu.
WYNIK:       Oś czasu z oznaczonymi "lukami logicznymi" + lista zdarzeń, których
             dokumentacja jest niespójna czasowo z deklarowaną datą.
KRYTERIUM AUTO-DOBORU:
             chronologia-sprawy-v1 zwraca ≥1 zdarzenie klasy WYDEDUKOWANE
             lub SPORNE dotyczące DATY (nie samego faktu) → auto-aktywacja.
INTEGRACJA:  Rozszerza chronologia-sprawy-v1 (nie zastępuje) — dodaje warstwę
             analityczną "luki logiczne w sekwencji" do istniejącego indeksu
             sprzeczności dat. Wyjście zasila MET-FTL-tab w raport-sytuacyjny-v2.
```

### MET-NET — Analiza sieci powiązań (network analysis)

```
ID:          MET-NET
NAZWA PL:    Analiza sieci powiązań podmiotów
OPIS:        Mapowanie relacji między podmiotami sprawy (osoby, spółki,
             konta, adresy, pełnomocnicy) jako graf powiązań — kto z kim
             jest formalnie/faktycznie związany, jakie role pełni dana
             osoba w różnych dokumentach (czy ta sama osoba występuje jako
             świadek w jednym piśmie i pełnomocnik w drugim, czy adresy
             e-mail/konta wskazują na wspólny podmiot kontrolujący).
ZASTOSOWANIE: Sprawy z wieloma podmiotami (spółki zależne, grupy kapitałowe,
             mobbing z udziałem kilku przełożonych, sprawy gospodarcze z
             łańcuchem pośredników), sprawy gdzie kwalifikacja konta/adresu
             jako "służbowe" vs "prywatne" jest sporna (por. przykład
             INTRA-CONTRA VII P 94/25 w analizator-dowodow-v3 §P1).
WYNIK:       Diagram powiązań (do show_widget — Visualizer diagram) +
             tabela "podmiot × rola w dokumencie X / Y / Z" pokazująca
             niespójności ról.
KRYTERIUM AUTO-DOBORU:
             ≥3 podmioty w sprawie ORAZ przynajmniej jeden podmiot występuje
             w różnych rolach w różnych dokumentach → auto-aktywacja.
INTEGRACJA:  Wejście: MP1-ekstrakcja (lista podmiotów). Wyjście: diagram
             przez Visualizer (read_me: diagram) + wpis do mapy ryzyk
             raport-sytuacyjny-v2 jeśli wykryto niespójność roli.
MODEL WYKONANIA: DWUETAPOWY (§1a).
PROCEDURA SZKICU (KROK A):
             1. Wypisz podmioty (≥3) z MP1-ekstrakcja.
             2. Wskaż TYLKO podmiot(y), które występują w różnych rolach w
                różnych dokumentach (np. "osoba X: świadek w piśmie A,
                pełnomocnik w piśmie B").
             3. NIE buduj pełnego grafu powiązań — to KROK B.
             WYNIK SZKICU: "Podmiot [X] występuje jako [rola 1] w [dok. A] i
             jako [rola 2] w [dok. B]." — 1-2 zdania per niespójność.
PROCEDURA GŁĘBOKA (KROK B, po wyborze "Analiza głęboka"):
             Pełny diagram powiązań (Visualizer, read_me: diagram) + tabela
             "podmiot × rola w dokumencie X/Y/Z" wg pola WYNIK.
```

### MET-CA — Analiza treści dokumentów (content analysis)

```
ID:          MET-CA
NAZWA PL:    Analiza treści dokumentów (content analysis)
OPIS:        Systematyczne kodowanie powtarzających się sformułowań,
             terminologii i kwalifikacji prawnych używanych przez stronę
             w jej pismach na przestrzeni czasu — wykrywanie zmiany języka
             opisującego to samo zdarzenie (np. "zaliczka" → "nienależne
             świadczenie", "incydent" → "naruszenie obowiązków"). Różni się
             od MD3c (sprzeczności faktyczne) tym, że MET-CA śledzi zmianę
             KWALIFIKACJI/NARRACJI, nie tylko faktów.
ZASTOSOWANIE: Sprawy wielopismowe (≥3 pisma jednej strony), gdzie podejrzewana
             jest ewolucja strategii procesowej przeciwnika — strona zmienia
             opis tego samego zdarzenia, by dopasować je do zmieniającej się
             linii obrony.
WYNIK:       Tabela "termin/kwalifikacja → pismo 1 / pismo 2 / pismo 3" z
             oznaczeniem momentu zmiany i wnioskiem strategicznym (dlaczego
             strona zmieniła język — co to ujawnia o słabości jej pierwotnej
             pozycji).
KRYTERIUM AUTO-DOBORU:
             ≥3 pisma tej samej strony przeciwnej w toku postępowania →
             auto-aktywacja jako rozszerzenie §P1 (INTRA-CONTRA) w
             analizator-dowodow-v3.
INTEGRACJA:  Rozszerza §P1/INTRA-CONTRA (analizator-dowodow-v3) o warstwę
             semantyczną. Wyjście zasila argumentację "obalanie" (MOD-OBAL)
             w pisma-procesowe-v3.
```

---

## 3a. Rejestr metod — kategoria NAUKI SPOŁECZNE (nowe)

### MET-CASE — Case Study Method (analiza przypadku jako struktura)

```
ID:          MET-CASE
NAZWA PL:    Metoda analizy przypadku (case study)
OPIS:        Strukturyzacja sprawy jako pojedynczego "przypadku" osadzonego
             w kontekście — wyodrębnienie zmiennych kontekstowych (relacje
             stron przed sporem, historia współpracy/zatrudnienia, otoczenie
             organizacyjne), zmiennej spornej (co dokładnie jest przedmiotem
             spornym) i zmiennych wynikowych (czego strony żądają). Różni się
             od MP13 (synteza faktyczna) tym, że MET-CASE nie buduje łańcucha
             przyczynowego zdarzeń, lecz MAPĘ KONTEKSTU — czynniki, które
             wyjaśniają DLACZEGO doszło do spornego zdarzenia, nie tylko CO
             się wydarzyło.
ZASTOSOWANIE: Sprawy, w których kontekst relacyjny/organizacyjny ma znaczenie
             dla oceny zasadności roszczenia lub wiarygodności stron (np.
             mobbing — historia relacji przełożony/podwładny, spory rodzinne
             o charakter majątkowy w tle wieloletniego konfliktu, spory
             korporacyjne na tle konfliktu wspólników). Pomocna gdy sąd może
             oceniać "całość okoliczności", nie tylko izolowane zdarzenie.
WYNIK:       Mapa kontekstu (3 kolumny: czynniki przedsporne / zdarzenie
             spornie / żądania) + lista czynników kontekstowych, które
             wzmacniają lub osłabiają wiarygodność narracji każdej strony.
KRYTERIUM AUTO-DOBORU:
             Sprawa dotyczy relacji długotrwałej (zatrudnienie >12 miesięcy,
             związek/rodzina, wieloletnia współpraca gospodarcza) ORAZ
             materiał wskazuje na konflikt narastający przed zdarzeniem
             spornym (≥2 wcześniejsze incydenty/skargi w materiale)
             → auto-aktywacja.
INTEGRACJA:  Wejście: MP1-ekstrakcja + chronologia-sprawy-v1 (zdarzenia
             przedsporne). Wyjście: zasila W1.2 (teza centralna) w
             pisma-procesowe-v3 jako kontekst wzmacniający narrację oraz
             sekcję "Stan faktyczny" w raport-sytuacyjny-v2.
```

### MET-PT — Process Tracing (śledzenie mechanizmu przyczynowego)

```
ID:          MET-PT
NAZWA PL:    Śledzenie procesu (process tracing)
OPIS:        Dla łańcucha zdarzeń A→B→C ustalenie nie tylko KOLEJNOŚCI
             (to robi chronologia-sprawy-v1 / MET-FTL), lecz MECHANIZMU
             przejścia między krokami — czy istnieje dowód, że krok A
             FAKTYCZNIE wywołał krok B (decyzja, dokument, działanie osoby
             odpowiedzialnej), czy jest to tylko korelacja czasowa bez
             dowodu związku. Różni się od MET-FTL (które szuka "luk
             logicznych w sekwencji") tym, że MET-PT bada SIŁĘ DOWODOWĄ
             SAMEGO POŁĄCZENIA przyczynowego między krokami, które są
             chronologicznie bezsporne.
ZASTOSOWANIE: Sprawy, gdzie strona przeciwna zaprzecza związkowi
             przyczynowemu mimo bezspornej kolejności zdarzeń (np. "decyzja
             o zwolnieniu nie miała związku ze skargą pracownika" — kolejność
             zdarzeń bezsporna, ale związek przyczynowy sporny; spory o
             odpowiedzialność deliktową, gdzie pozwany przyznaje zdarzenie,
             ale neguje przyczynowość szkody).
WYNIK:       Łańcuch A→B→C z oceną siły dowodu połączenia na każdym etapie:
             [DOWÓD BEZPOŚREDNI / DOWÓD POŚREDNI / TYLKO KORELACJA CZASOWA].
             Etapy oznaczone "TYLKO KORELACJA" wskazują, gdzie argumentacja
             wymaga wzmocnienia (np. wnioskiem dowodowym o dokumenty
             wewnętrzne, świadka decyzyjnego).
KRYTERIUM AUTO-DOBORU:
             Sprawa wymaga wykazania związku przyczynowego (odpowiedzialność
             cywilna, dyskryminacja/mobbing — związek działania z decyzją
             pracodawcy, przyczynowość szkody) ORAZ strona przeciwna explicite
             neguje związek przyczynowy przy bezspornej kolejności zdarzeń
             → auto-aktywacja.
INTEGRACJA:  Wejście: chronologia-sprawy-v1 (bezsporna kolejność) + MD4-pokrycie
             (przesłanki wymagające dowodu związku). Wyjście: zasila W1.3
             (mapa cel→przesłanka→dowód, kolumna "Słabe punkty") w
             pisma-procesowe-v3 oraz wnioski dowodowe ukierunkowane na
             etapy oznaczone "TYLKO KORELACJA".
```

### MET-TRI — Triangulacja źródeł

```
ID:          MET-TRI
NAZWA PL:    Triangulacja źródeł dowodowych
OPIS:        Dla danego faktu istotnego sprawdzenie, czy jest potwierdzony
             przez ≥2 NIEZALEŻNE kanały dowodowe różnego typu (np. dokument +
             zeznanie świadka niezwiązanego ze stronami + dane techniczne/
             metadane). Fakt potwierdzony tylko przez źródła zależne od jednej
             strony (np. dwa dokumenty wytworzone przez tę samą stronę) NIE
             jest triangulowany, nawet jeśli oba "potwierdzają" to samo —
             traktowany jako pojedynczy kanał.
ZASTOSOWANIE: Każda sprawa, gdzie kluczowy fakt opiera się głównie na
             materiale jednej strony (np. własna dokumentacja pracodawcy,
             własne nagranie jednej ze stron) — przed budowaniem na nim
             argumentacji warto sprawdzić, czy istnieje niezależne
             potwierdzenie. Szczególnie istotne przy ocenie dowodów kategorii
             B/C (DOWODY-METODOLOGIA.md) — triangulacja może podnieść status
             ustalenia.
WYNIK:       Tabela "fakt istotny → kanały potwierdzające (typ + niezależność:
             TAK/NIE) → status triangulacji: POTWIERDZONY TRIANGULACYJNIE /
             POJEDYNCZY KANAŁ / NIEPOTWIERDZONY". Fakty "POJEDYNCZY KANAŁ"
             oznaczane jako priorytetowe do wzmocnienia wnioskiem dowodowym.
KRYTERIUM AUTO-DOBORU:
             ≥1 fakt kluczowy dla roszczenia głównego (z MOD-PRIORYTETY-
             ASPEKTOW, aspekty_glowne) ma w materiale tylko źródła pochodzące
             od jednej strony (status B lub C w SOURCE-STATUS-MATRIX,
             raport-sytuacyjny-v2) → auto-aktywacja.
INTEGRACJA:  Wejście: SOURCE-STATUS-MATRIX (raport-sytuacyjny-v2) + MD4-pokrycie.
             Wyjście: zasila "Luki dowodowe" w raport-sytuacyjny-v2 oraz
             listę wniosków dowodowych w W2.2 ([WNIOSKI DOWODOWE]) w
             pisma-procesowe-v3.
```

---

## 3b. Rejestr metod — kategoria EKONOMICZNA/FINANSOWA (nowe)

### MET-FA — Forensic Accounting (analiza śledcza dokumentacji finansowej)

```
ID:          MET-FA
NAZWA PL:    Analiza śledcza dokumentacji finansowej (forensic accounting)
OPIS:        Systematyczna weryfikacja zapisów finansowych (faktury, wyciągi,
             rozliczenia, listy płac, dokumentacja księgowa) pod kątem:
             (1) zgodności kwot między dokumentami źródłowymi i ich
             odzwierciedleniem w rozliczeniach/zestawieniach, (2) ciągłości
             numeracji/dat dokumentów (wykrywanie "brakujących" pozycji w
             sekwencji), (3) zgodności przepływów (czy kwota wpłacona =
             kwota zaksięgowana = kwota rozliczona). Nie jest to opinia
             biegłego — to analiza WSTĘPNA wskazująca obszary wymagające
             ewentualnej opinii biegłego (shared/EXPERT-OPINION-AUDIT.md).
ZASTOSOWANIE: Sprawy ze sporem o wysokość roszczenia opartego na dokumentacji
             finansowej (wynagrodzenie, nadgodziny, rozliczenia B2B, podział
             majątku, roszczenia odszkodowawcze z udokumentowaną szkodą
             majątkową, spory o rozliczenie wspólnego przedsięwzięcia).
WYNIK:       Tabela rozbieżności: "pozycja → kwota wg dok. źródłowego → kwota
             wg rozliczenia/zestawienia → rozbieżność → możliwe wyjaśnienie".
             Lista "pozycji brakujących" w sekwencji numeracji/dat.
             Rekomendacja: czy rozbieżności wymagają opinii biegłego
             (EXPERT-OPINION-AUDIT) czy wystarczy wniosek o przedłożenie
             dokumentów przez stronę przeciwną.
KRYTERIUM AUTO-DOBORU:
             Roszczenie główne ma charakter pieniężny ORAZ materiał zawiera
             ≥3 dokumenty finansowe (faktury/wyciągi/listy płac/rozliczenia)
             ORAZ kwoty między dokumentami nie są w pełni zgodne (sygnał z
             MD3c — sprzeczność kwot) → auto-aktywacja.
INTEGRACJA:  Wejście: MD1/MD2 (ekstrakcja dowodów finansowych) + MD3c
             (sprzeczności kwot). Wyjście: zasila ROSZCZENIA.md (pole
             "Wysokość") w pisma-procesowe-v3 oraz — gdy rozbieżności
             istotne — eskaluje do shared/EXPERT-OPINION-AUDIT.md.
MODEL WYKONANIA: DWUETAPOWY (§1a).
PROCEDURA SZKICU (KROK A):
             1. Wskaż dokumenty finansowe (≥3) z MD1/MD2.
             2. Wskaż TYLKO pozycje, gdzie MD3c zwróciło sprzeczność kwot —
                "pozycja [X]: kwota [A] wg dok. 1 vs kwota [B] wg dok. 2".
             3. NIE buduj pełnej tabeli rozbieżności ani nie sprawdzaj
                ciągłości numeracji/dat — to KROK B.
             WYNIK SZKICU: lista 1-3 rozbieżności kwot + naklad_szacowany
             (np. "średni" jeśli 2-3 dok., "wysoki" jeśli >5 dok. finansowych).
PROCEDURA GŁĘBOKA (KROK B, po wyborze "Analiza głęboka"):
             Pełna tabela rozbieżności + sprawdzenie ciągłości numeracji/dat
             + rekomendacja (opinia biegłego vs wniosek o przedłożenie
             dokumentów) wg pola WYNIK.
```

### MET-DQ — Damages Quantification (kwantyfikacja szkody/roszczenia)

```
ID:          MET-DQ
NAZWA PL:    Kwantyfikacja szkody / roszczenia (damages quantification)
OPIS:        Strukturyzacja wyliczenia wysokości roszczenia jako: (1) metoda
             wyliczenia (np. różnica majątkowa, lucrum cessans, koszt
             zastępczy, wynagrodzenie utracone), (2) składniki wyliczenia
             z podstawą każdego (dokument/wskaźnik/okres), (3) zakres
             niepewności — które składniki są BEZSPORNE co do kwoty, a
             które wymagają opinii biegłego lub są SZACUNKOWE. Metoda nie
             podaje WŁASNYCH stawek/wskaźników z pamięci — każda stawka
             urzędowa (np. minimalne wynagrodzenie, odsetki ustawowe)
             podlega PRAWO-HARDGATE.
ZASTOSOWANIE: Każda sprawa, w której petitum zawiera kwotę pieniężną
             wymagającą wyliczenia (nie tylko wskazaną przez klienta), w
             szczególności roszczenia odszkodowawcze, o zapłatę zaległego
             wynagrodzenia/nadgodzin, o zwrot nienależnego świadczenia,
             o zadośćuczynienie (z zastrzeżeniem, że zadośćuczynienie nie
             ma sztywnego wzoru — metoda wskazuje wyłącznie STRUKTURĘ
             argumentacji, nie kwotę).
WYNIK:       Tabela wyliczenia: "składnik → metoda → podstawa → kwota/status
             (BEZSPORNA / SZACUNKOWA / WYMAGA BIEGŁEGO / ⚠️ WYMAGA WERYFIKACJI
             STAWKI URZĘDOWEJ)" + suma + zakres niepewności (kwota minimalna
             – maksymalna, jeśli składniki szacunkowe).
KRYTERIUM AUTO-DOBORU:
             Petitum zawiera żądanie pieniężne ORAZ wyliczenie wymaga ≥2
             składników (np. kwota główna + odsetki + utracone korzyści)
             LUB co najmniej jeden składnik nie jest wprost wskazany przez
             użytkownika jako gotowa kwota → auto-aktywacja.
INTEGRACJA:  Wejście: ROSZCZENIA.md (pole "Wysokość") + MET-FA (jeśli
             aktywny — rozbieżności finansowe jako wejście do wyliczenia).
             Wyjście: zasila [ŻĄDANIA] i [UZASADNIENIE] w W2.2
             pisma-procesowe-v3 — każda stawka urzędowa jako ⚠️ do
             weryfikacji w W3 (MOD-PRAWO), nigdy wpisana z pamięci.
```

---

## 3c. Rejestr metod — kategoria COMPLIANCE (nowe)

### MET-COMP — Analiza zgodności proceduralnej (compliance gap analysis)

```
ID:          MET-COMP
NAZWA PL:    Analiza zgodności proceduralnej (compliance gap analysis)
OPIS:        Dla danego działania strony (decyzja, procedura, postępowanie)
             sprawdzenie: (1) jaki standard/procedura/polityka WEWNĘTRZNA
             miała zastosowanie (regulamin, polityka, instrukcja — z
             dokumentów wewnętrznych strony, nie z przepisów prawa), (2) czy
             krok-po-kroku procedury został zachowany (kto, kiedy, w jakiej
             formie — na podstawie dowodów dostępnych w materiale), (3) GDZIE
             wystąpiła rozbieżność między deklarowaną procedurą i faktycznym
             działaniem (krok pominięty, termin niezachowany, osoba
             nieuprawniona, forma niezgodna z procedurą).
             Różni się od MET-FA (które bada KWOTY w dokumentacji finansowej)
             i od oceny prawnej w analizator-przepisow-v2 (która bada
             zgodność z USTAWĄ/normą zewnętrzną) — MET-COMP bada zgodność
             działania ZE WŁASNYM, WEWNĘTRZNYM standardem strony. Sama
             rozbieżność proceduralna NIE jest automatycznie naruszeniem
             prawa — to ustalenie odrębne (PRAWO-HARDGATE, jeśli wniosek
             powołuje się na konsekwencję prawną rozbieżności).
ZASTOSOWANIE: Sprawy pracownicze (procedura zwolnienia, postępowanie
             dyscyplinarne, procedura antymobbingowa — czy pracodawca
             zastosował własny regulamin), sprawy o naruszenie RODO (czy
             zastosowano własną politykę przetwarzania danych — może
             współpracować z MP11), sprawy korporacyjne/governance (czy
             zachowano procedurę decyzyjną organu wg statutu/regulaminu
             organu), sprawy administracyjne (czy organ zastosował własne
             wytyczne/instrukcje wewnętrzne — DR-15 jako domena pomocnicza).
WYNIK:       Tabela: "krok procedury (wg dokumentu wewnętrznego) → wykonano:
             TAK/NIE/CZĘŚCIOWO/BRAK DOWODU → dowód → uwaga". Pod tabelą:
             lista rozbieżności z oznaczeniem, czy rozbieżność jest
             [DO DALSZEJ OCENY PRAWNEJ — czy ma skutek na gruncie KP/KC/KPA]
             — bez podawania tego skutku w ramach MET-COMP (to wymaga
             analizator-przepisow-v2 lub W3 pisma-procesowe-v3).
KRYTERIUM AUTO-DOBORU:
             Materiał zawiera dokument wewnętrzny strony (regulamin, polityka,
             procedura, instrukcja, statut, kodeks etyki) ORAZ sprawa dotyczy
             działania, które ten dokument reguluje (np. regulamin
             dyscyplinarny + spór o zwolnienie dyscyplinarne) →
             auto-aktywacja.
MODEL WYKONANIA: JEDNOETAPOWY (§1a) — tabela krok×wykonanie nie wymaga
             nakładu porównywalnego z MET-ACH/MET-NET/MET-FA; wykonywana w
             pełni w KROK 3.
INTEGRACJA:  Wejście: MP1-ekstrakcja (dokumenty wewnętrzne strony) + MD3a
             (walidacja formalna — czy dokument ma cechy oryginału/jest
             obowiązującą wersją). Wyjście: zasila argumentację w
             pisma-procesowe-v3 (np. "pracodawca nie zastosował kroku X
             własnej procedury dyscyplinarnej przed wypowiedzeniem") oraz —
             gdy rozbieżność dotyczy normy zewnętrznej (ISO/RODO/inne) —
             eskaluje do DR-15 (compliance-iso-governance-audyt) jako
             kontekst dla oceny prawnej.
```

---

## 4. Mapowanie: typ sprawy / klasa pewności → sugerowana metoda

| Sygnał z analizy | Metoda sugerowana (auto) | Metoda alternatywna (do wyboru) |
|---|---|---|
| Sprzeczne wersje zdarzeń, brak dowodu rozstrzygającego (klasa SPORNE) | MET-ACH | SLE-02 (VSA) |
| Sporne daty / podejrzenie antydatacji (klasa WYDEDUKOWANE dot. dat) | MET-FTL | MET-PT |
| ≥3 podmioty, niespójne role w dokumentach | MET-NET | SLE-03 (HUMINT-style) |
| ≥3 pisma jednej strony, zmiana terminologii/kwalifikacji | MET-CA | SLE-01 (profilowanie) |
| Sprawa karna / podejrzenie manipulacji świadka | SLE-01, SLE-02 | MET-ACH |
| Sprawa gospodarcza/finansowa ze spornymi kwotami | MET-FTL + MET-NET | MET-FA |
| Relacja długotrwała + konflikt narastający przed zdarzeniem (mobbing, spory rodzinne/korporacyjne) | MET-CASE | MET-PT |
| Bezsporna kolejność zdarzeń, ale sporny związek przyczynowy | MET-PT | MET-ACH |
| Kluczowy fakt potwierdzony tylko źródłami jednej strony (status B/C) | MET-TRI | — |
| Spór o wysokość roszczenia, dokumentacja finansowa z rozbieżnościami | MET-FA | MET-TRI |
| Petitum pieniężne wymagające wyliczenia (≥2 składniki) | MET-DQ | MET-FA |
| Dokument wewnętrzny strony (regulamin/polityka/procedura) reguluje działanie objęte sporem | MET-COMP | — |

Zasada: jeśli ≥2 sygnały aktywne jednocześnie, sugeruj maks. 2 metody
(priorytet: ta z większą liczbą trafień w tabeli) — nie przeciążać
checklisty użytkownika.

---

## 5. Prezentacja LAIK vs PRAWNIK

```
PRAWNIK → checklist pokazuje: ID metody, nazwę ekspercką (np. "MET-ACH —
          Analiza konkurujących hipotez"), pełny opis z §3/§3a/§3b/§3c.

LAIK    → checklist pokazuje TYLKO opis funkcjonalny, bez ID i nazwy
          eksperckiej:
            MET-ACH  → "Dogłębne porównanie Twojej wersji zdarzeń z wersją
                        drugiej strony — sprawdzenie, która wersja jest
                        bardziej zgodna z dowodami."
            MET-FTL  → "Sprawdzenie, czy kolejność dat w dokumentach jest
                        logiczna i czy nic 'nie pasuje czasowo'."
            MET-NET  → "Mapa powiązań między osobami/firmami w Twojej sprawie
                        — kto z kim jest związany."
            MET-CA   → "Sprawdzenie, czy druga strona nie zmieniała opisu
                        tego samego zdarzenia w swoich pismach."
            MET-CASE → "Spojrzenie na całą historię relacji, nie tylko na
                        jedno zdarzenie — co działo się wcześniej i jak to
                        wpływa na ocenę sprawy."
            MET-PT   → "Sprawdzenie, czy jedno zdarzenie naprawdę
                        SPOWODOWAŁO drugie, czy to tylko zbieg dat."
            MET-TRI  → "Sprawdzenie, czy ważny dla Ciebie fakt potwierdza
                        coś więcej niż tylko dokumenty jednej strony."
            MET-FA   → "Sprawdzenie zgodności kwot we wszystkich
                        dokumentach finansowych — czy nic się 'nie zgubiło'."
            MET-DQ   → "Rozpisanie, z czego składa się żądana kwota i które
                        jej części są bezsporne, a które wymagają dalszego
                        wyliczenia."
            MET-COMP → "Sprawdzenie, czy druga strona zastosowała własne
                        zasady/procedurę — i czy zrobiła to tak, jak
                        deklaruje, że robi."
```

---

## 6. Format wyniku w checkliście (wejście do MOD-PRIORYTETY-ASPEKTOW)

```json
{
  "metody_sugerowane": [
    {"id": "MET-ACH", "auto": true, "powod": "≥2 wykluczające się wersje zdarzenia X bez dowodu A"},
    {"id": "MET-CA", "auto": false, "powod": "3 pisma strony przeciwnej — dostępne jako opcja"},
    {"id": "MET-DQ", "auto": true, "powod": "petitum pieniężne, wyliczenie wymaga 3 składników"},
    {"id": "MET-COMP", "auto": true, "powod": "regulamin postępowania dyscyplinarnego w materiale, sprawa dotyczy zwolnienia dyscyplinarnego"}
  ],
  "metody_wybrane": []
}
```

`metody_wybrane` wypełniane przez użytkownika w checkliście — jeśli pusta,
system stosuje `metody_sugerowane` z `auto: true`.

---

## 7. Walidacja

- Każda metoda z §3/§3a/§3b/§3c jest KATEGORIĄ ANALITYCZNĄ — jej nazwa i opis
  NIE wymagają weryfikacji ISAP.
- Każdy WNIOSEK wygenerowany przy użyciu metody, który zawiera powołanie na
  przepis, orzeczenie, termin ustawowy lub normę — podlega PRAWO-HARDGATE
  (web_search/web_fetch przed podaniem). Dla MET-COMP dotyczy to w
  szczególności wniosków o SKUTKU PRAWNYM rozbieżności proceduralnej.
- Wynik metody nigdy nie jest prezentowany jako "dowód" — jest oznaczany jako
  `[ANALIZA-MET-XXX]` i podlega tej samej regule co `[H-ŚLEDCZA]` w
  analizator-dowodow-v3: hipoteza/wniosek analityczny, nie fakt ustalony.

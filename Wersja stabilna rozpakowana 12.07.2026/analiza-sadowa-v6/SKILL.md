---
name: analiza-sadowa-v6
version: 6.2
type: executive-analiza
status: production
compatibility: "web_search, web_fetch, show_widget"
description: |
  UŻYWAJ ZAWSZE gdy użytkownik: dostarcza akta, pisma, wyroki, decyzje lub dokumenty prawne;
  pyta o szanse w sprawie karnej, wykroczeniowej, cywilnej, pracowniczej, administracyjnej;
  chce ocenić dowody, terminy zawite lub koszty sądowe (KSCU); potrzebuje analizy błędów
  pełnomocnika strony przeciwnej lub audytu własnych pism; pyta o orzecznictwo, groźbę
  bezprawną (art. 87 KC), nagrania (art. 267 KK), podwójną kwalifikację kwoty lub e-mail
  pracownika; pyta o "narzędzie"/"dashboard"/"analizator" → wywołaj widget React;
  pyta "co mam zrobić" / "czy mam szansę" / "czy to zgodne z prawem".
  v6: model CZTEROPRZEBIEGOWY z obowiązkową DWUKROTNĄ WERYFIKACJĄ dowodów i pism.
changelog:
  - "6.2 (2026-07-12): ZAMKNIĘTE — WARN 'średni priorytet: 13 plików w
    references/ bez odwołań do shared/' (otwarty w sesji 6.1). Sprawdzono
    treść, nie tylko obecność odwołań, każdego z 13 plików: MOD-A..MOD-F
    (6 wąskich modułów tematycznych — błędy pełnomocnika, groźba bezprawna,
    nagrania, podwójna kwalifikacja kwoty, konto e-mail pracownika, szkoda
    od własnego pełnomocnika), PRZEBIEG-1/2/3 (model czteroprzebiegowy
    własny dla tego skilla — ekstrakcja/struktura/predykcja, nie istnieje
    odpowiednik w shared/ ani w analizator-dowodow-v3, który używa zupełnie
    innej architektury MP0-MP13 + macierz D×T), WERYFIKACJA-DOWODOW.md
    (protokół W1-W4/O1-O5 przypięty do własnego modelu Przejść I-IV, nie
    do FACT-SOURCE-LOCK/PRAWO-HARDGATE z shared/), filtry-analityczne.md
    (11 filtrów własnych, sprawdzone przeciw shared/MOD-NEGACJA-DOWODOW —
    inny zakres: filtry oceniają kompletność analizy, MOD-NEGACJA-DOWODOW
    ocenia odporność dowodu na obalenie), moduly-spec.md (świadomy fallback
    awaryjny agregujący MOD-A..F w jednym pliku na wypadek braku dostępu do
    plików osobnych — duplikacja WEWNĄTRZ tego samego skilla, udokumentowana
    i zamierzona, nie międzyskillowa). WYNIK: brak potwierdzonej duplikacji
    z shared/ ani z analizator-dowodow-v3 w żadnym z 13 plików — treść jest
    unikalna dla własnej metodologii tego skilla. Brak odwołań do shared/
    był więc fałszywym sygnałem ostrzegawczym, nie dowodem duplikacji.
    Żadna treść nie została zmieniona — to weryfikacja zamykająca, nie
    refaktor."
  - "6.1 (2026-07-12): naprawa nakładania kompetencji z analizator-dowodow-v3
    (WARN z audytu silnika). references/koszty-terminy.md i
    references/orzecznictwo.md przestały utrzymywać własne, niezależne
    kopie terminów procesowych i hierarchii orzecznictwa — teraz wskazują
    na kanoniczne shared/terminy.md i shared/ORZECZENIA-HIERARCHIA.md,
    zachowując lokalnie WYŁĄCZNIE pozycje uzupełniające (terminy) i format
    cytowania (orzecznictwo). Dodano sekcję 'GRANICA KOMPETENCJI vs.
    analizator-dowodow-v3'. Przy okazji wykryto i zgłoszono błędną
    klasyfikację 'Odpowiedź na pozew' (art. 207 §2 KPC) jako ZAWITY w
    shared/terminy.md, powinien być INSTRUKCYJNY — patrz changelog
    shared/terminy.md. UWAGA: pozostałe 13 plików w references/ (MOD-A..F,
    filtry-analityczne, PRZEBIEG-1..3, WERYFIKACJA-DOWODOW, moduly-spec,
    BLUEPRINT-SCHEMA) nadal nie mają żadnych odwołań do shared/ — to
    świadomie NIE zostało ruszone w tej sesji (brak w nich potwierdzonej
    duplikacji jak w terminy/orzecznictwo; wymaga osobnej sesji per plik,
    nie zgadywania). Zarejestrować w CHECKLIST-DEDUP.md i zamknąć
    odpowiednią pozycję w WARN-OTWARTE.md."
---

**Zasada progressive disclosure:** Zacznij od tego pliku. Doładuj references/ tylko gdy
konkretny moduł jest potrzebny. Widget przez show_widget z HTML (NIE przez .jsx).

**Zasada v6 — DOMYŚLNA:** Każda analiza dokumentów prawnych przebiega przez cztery izolowane
przejścia z wbudowanymi punktami STOP i dwukrotną weryfikacją. Ocena prawna NIE może
zanieczyszczać ustaleń faktycznych (zakaz błędu potwierdzenia).

## ARCHITEKTURA SKILLA

```
analiza-sadowa-v6/
├── SKILL.md                              ← ten plik — pełny framework v6
├── references/
│   ├── filtry-analityczne.md             ← 11 filtrów (Filtry #2 #4 #8 #9 — osobny krok)
│   ├── MOD-A.md                          ← Błędy pełnomocnika strony przeciwnej
│   ├── MOD-B.md                          ← Groźba bezprawna / presja ekonomiczna
│   ├── MOD-C.md                          ← Nagrania celowo przygotowane
│   ├── MOD-D.md                          ← Podwójna kwalifikacja tej samej kwoty
│   ├── MOD-E.md                          ← Konto e-mail pracownika
│   ├── MOD-F.md                          ← Audyt własnych pism procesowych
│   ├── WERYFIKACJA-DOWODOW.md            ← Rozszerzony protokół dwukrotnej weryfikacji
│   ├── moduly-spec.md                    ← fallback: wszystkie moduły (awaryjny)
│   ├── orzecznictwo.md                   ← weryfikacja i cytowanie orzeczeń
│   ├── koszty-terminy.md                 ← KSCU, terminy KPC/KPK/KPW/KPA/KP
│   └── engines/
│       ├── adversarial-litigation-analysis-v9.md
│       ├── contradiction-case-analysis-v10.md
│       └── file-analysis-staged-engine.md
```

> Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl, trybunal.gov.pl, nsa.gov.pl, saos.org.pl. Nigdy z pamięci.
> ZAKAZ AUTOŁADOWANIA JSX — widget WYŁĄCZNIE na jawne żądanie użytkownika.

## GRANICA KOMPETENCJI vs. analizator-dowodow-v3

Oba skille pokrywają częściowo ten sam obszar (dowody, terminy, orzecznictwo,
ocena szans) — to świadomy, udokumentowany stan, nie przypadkowy duplikat.
Rozdział wykonuje router (`prawny-router-v3`, tabela PRIMARY/SECONDARY/
FALLBACK), a nie ten plik — ale dla kogoś czytającego wyłącznie ten skill:

- **analiza-sadowa-v6 = PRIMARY**, gdy: ocena całościowa szans w sprawie na
  bazie akt/wyroku/decyzji, audyt błędów pełnomocnika strony przeciwnej,
  audyt własnych pism, 6 wąskich modułów specjalistycznych (MOD-A…MOD-F).
- **analizator-dowodow-v3 = PRIMARY**, gdy: głęboka analiza dowodowa
  wieloplikowa (hierarchia A–D, macierz dowód×teza, łańcuchy proweniencji,
  25 dziedzin MX), analiza śledcza (profilowanie, VSA, HUMINT), lub gdy
  wyjściem ma być graf/macierz, nie executive summary.
- Terminy procesowe i hierarchia orzecznictwa: **oba skille korzystają z tych
  samych plików kanonicznych** `shared/terminy.md` i
  `shared/ORZECZENIA-HIERARCHIA.md` (patrz `references/koszty-terminy.md` i
  `references/orzecznictwo.md` w tym skillu) — żadna z dwóch implementacji
  nie utrzymuje już własnej, potencjalnie rozbieżnej kopii tych tabel.
- Gdy zapytanie pasuje do obu → router ładuje `analiza-sadowa-v6` jako
  PRIMARY i `analizator-dowodow-v3` jako SECONDARY (patrz
  `prawny-router-v3/SKILL.md`, tabela routingu).
- **Zweryfikowane 2026-07-12 (v6.2):** pozostałe 13 plików w `references/`
  (MOD-A…MOD-F, PRZEBIEG-1/2/3, WERYFIKACJA-DOWODOW, filtry-analityczne,
  moduly-spec, BLUEPRINT-SCHEMA) sprawdzono pod kątem treści, nie tylko
  obecności odwołań do `shared/` — żaden nie duplikuje `shared/` ani
  `analizator-dowodow-v3`. To unikalna metodologia własna tego skilla
  (model czteroprzebiegowy PRZEBIEG-1/2/3, nie MP0-MP13 z macierzą D×T).
  Zobacz changelog 6.2 po szczegóły per plik.

---

## KROK 0 — SKAN KOMPLETNOŚCI PLIKÓW ⛔ HARD GATE

> Wykonaj jako ABSOLUTNIE PIERWSZY krok — przed KOMUNIKATEM STARTOWYM i przed Przejściem I.
> Mechanizm współdzielony: `view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md`

```
SD-GATE-0: Czy w wiadomości wzmianka o aktach/pismach/dowodach/dokumentach
  BEZ faktycznie wgranego pliku?
  TAK → ⛔ STOP. "Wskazujesz na dokumenty, których nie wykryłem.
         Wgraj akta/pisma przed uruchomieniem analizy." Czekaj. Nie wyświetlaj komunikatu startowego.

SD-INW: Zinwentaryzuj WSZYSTKIE pliki.
  ZIP → rozpakowuj i inwentaryzuj zawartość.
  Każdy plik = D[id] z typem i liczbą stron w SD-REJ.

SD-READ: Per każdy D[id] — właściwa metoda per typ pliku:
  PDF-skan     → pdftoppm -r 120 per KAŻDA strona → view
  PDF-tekst    → pdftotext; jeśli pusty → rasteryzacja
  XLSX         → openpyxl: KAŻDA zakładka osobno
  ODT-obrazy   → zipfile Pictures/* → view per obraz
  JPG/PNG      → view bezpośrednio
  DOCX         → zipfile word/document.xml
  ⛔ ZAKAZ POMINIĘCIA STRONY / ZAKŁADKI / OBRAZU — pominięcie = błąd krytyczny

SD-READ szczególna reguła — PISMA I PROTOKOŁY SĄDOWE:
  Każde pismo procesowe  → wyodrębnij: strony, daty, żądania, podstawy prawne
  Każdy protokół sądowy  → KAŻDE zdanie zeznań świadka = osobny wpis SD-FAKTY
  Każde postanowienie    → wpis SD-POSTANOWIENIE
  ⛔ ZAKAZ uznania zdania zeznania za "nieistotne" bez uzasadnienia

SD-VER: Wszystkie D[id] = ✅?
  NIE → wróć do SD-READ dla brakujących stron/plików.
  TAK → SD-FAKTY gotowe do zasilenia Przejścia I (mapa faktyczna).

SD-GATE-4: SD-VER ≠ KOMPLET → ⛔ BLOKADA Przejścia I. Nie wyświetlaj komunikatu startowego.
```

---

## KOMUNIKAT STARTOWY

```
"Uruchamiam Analizę Sądową v6. Model czteroprzebiegowy z dwukrotną weryfikacją.

Każde przejście zostanie wysłane jako OSOBNA WIADOMOŚĆ — nie łącz ich w jednej odpowiedzi.

  Wiadomość 1 → Przejście I   — mapowanie faktyczne (zero oceny prawnej)
  Wiadomość 2 → Przejście II  — kwalifikacja prawna (normy ISAP, macierz fakt-norma)
  Wiadomość 3 → Przejście III — analiza adversarialna + WERYFIKACJA PIERWSZA
                                (sędzia / przeciwnik / własny pełnomocnik + V10)
  Wiadomość 4 → Przejście IV  — autokorekta P1-P5 + WERYFIKACJA OSTATECZNA
                                → hard gate przed raportem końcowym
  Wiadomość 5 → Raport końcowy §1-§11
  Wiadomość 6 → Widget Raportu Sytuacyjnego v2 [automatyczny]
  Wiadomość 7 → Oferta pisma procesowego

Obsługuję: karne, cywilne, pracownicze, wykroczeniowe, administracyjne.
Moduły specjalne: błędy pełnomocnika, groźba bezprawna, nagrania, terminy, koszty.

💡 Interaktywne narzędzie: wpisz 'pokaż widget' lub 'uruchom dashboard'."
```

---

## MODEL CZTEROPRZEBIEGOWY Z DWUKROTNĄ WERYFIKACJĄ

> ZASADA BEZWZGLĘDNA: Cztery przejścia OBOWIĄZKOWE i SEKWENCYJNE.
> ZASADA WIADOMOŚCI: Każde przejście oraz raport końcowy = OSOBNA WIADOMOŚĆ.
>   Zakaz łączenia przejść w jednej wiadomości — nawet jeśli materiał jest krótki.
>   Po wysłaniu każdego przejścia zatrzymaj się i czekaj — nie przechodź dalej
>   bez ukończenia bieżącej wiadomości.
> DWUKROTNA WERYFIKACJA wbudowana strukturalnie:
>   pierwsza → Przejście III (skonfrontowanie wniosków z dokumentami źródłowymi)
>   druga    → Przejście IV  (niezależna kontrola kompletności całego raportu)

---

## ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI

> Przed podaniem jakiegokolwiek przepisu, artykułu, terminu lub sygnatury orzeczenia:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
> Jeśli źródło niedostępne → oznacz `⚠️ [NIEWERYFIKOWANE]` i kontynuuj bez treści przepisu.

---

### PRZEJŚCIE I — MAPOWANIE FAKTYCZNE
**Cel: Wyłącznie bezsporny stan faktyczny. Zero oceny. Zero prawa.**

> **CLAIM-VALIDATION przed mapowaniem:**
> `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`
> Twierdzenia strony nieznajdujące oparcia w dostarczonych dokumentach → oznacz
> `[⛔ NIEUDOWODNIONE]`; nie wpisuj do Mapy Faktycznej jako faktów.
> Twierdzenia strony sprzeczne z dokumentami → oznacz `[⛔ SPRZECZNE]`;
> wpisz do Mapy to co faktycznie wynika z materiału (nie wersję strony).

Rejestruj WYŁĄCZNIE:
- daty zdarzeń (chronologia bezwzględna — co do dnia)
- kwoty, liczby, okresy (co do grosza, co do dnia)
- podmioty i ich role (kto, w jakiej roli, w jakim momencie)
- treść dokumentów (co dokument stwierdza dosłownie — nie co znaczy)
- sekwencję czynności (kto co zrobił, kiedy, w jakiej kolejności)

ZAKAZ w Przejściu I:
- oceniania wiarygodności stron
- interpretowania intencji lub motywów
- stosowania przepisów prawa
- formułowania wniosków prawnych
- używania słów: naruszył, bezprawnie, celowo, oszukał

Format wyniku:
```
MAPA FAKTYCZNA
CHRONOLOGIA: [DD.MM.RRRR] → [zdarzenie dosłowne] → [podmiot] → [dokument/strona]
PODMIOTY:    [nazwa] → [rola] → [relacja procesowa]
KWOTY/DATY:  [pozycja] → [kwota lub data] → [dokument źródłowy]
DOKUMENTY:   [nazwa] → [data] → [autor] → [treść kluczowa dosłownie]
```

PUNKT STOP przed Przejściem II:
Czy Mapa Faktyczna zawiera ocenę prawną lub interpretację intencji?
TAK → usuń, zastąp suchym opisem. NIE → przejdź dalej.

> ⚑ KONIEC WIADOMOŚCI 1 — wyślij tę wiadomość. Przejście II w kolejnej wiadomości.

---

### PRZEJŚCIE II — KWALIFIKACJA PRAWNA
**Cel: Przypisanie faktów z Mapy Faktycznej do norm prawnych. Żadne nowe fakty nie powstają.**

> ⚠️ REGUŁA BEZWZGLĘDNA — WERYFIKACJA ISAP PRZED MACIERZĄ:
> Przed wpisaniem JAKIEJKOLWIEK normy do macierzy fakt-norma Claude MUSI:
> 1. Wywołać web_search z zapytaniem o treść konkretnego przepisu (eli.gov.pl / lexlege.pl / arslege.pl)
> 2. Odczytać aktualną treść przepisu z wyników
> 3. Dopiero wtedy wpisać normę do macierzy
>
> ZAKAZ: Pisanie norm z pamięci bez uprzedniego web_search jest bezwzględnie zakazane.
> Każdy przepis w macierzy musi mieć potwierdzenie z live-search w tej samej sesji.
> Jeśli web_search nie zwróci treści przepisu — oznaczyć jako NIEWERYFIKOWALNY i nie stosować.
>
> MINIMUM: Dla każdej ustawy (KP, KC, KPC, KK, KPK) — co najmniej jeden web_search
> przed pierwszą normą z tej ustawy. Przy kolejnych przepisach z tej samej ustawy
> wystarczy web_search jeśli zachodzi wątpliwość co do brzmienia lub aktualności.

Sekwencja obowiązkowa:
1. Pobierz fakty WYŁĄCZNIE z Mapy Faktycznej (Przejście I)
2. Dla każdego faktu: web_search → odczytaj przepis → wpisz do macierzy
3. Każde znamię ustawowe = osobna linia
4. Oznacz: SPEŁNIONE / NIESPEŁNIONE / WĄTPLIWE / BRAK DANYCH
5. Macierz fakt-norma (format poniżej)
6. Fakty bez normy → "procesowo neutralne"
7. Dwie wykluczające się kwalifikacje tej samej kwoty → uruchom MOD-D

Format macierzy:
```
MACIERZ FAKT-NORMA
Fakt nr | Norma (art. X ustawy Y) [zweryfikowano: URL] | Znamię | Status | Uwaga

ZNAMIONA SPORNE:    [znamię] → [co jest potrzebne do wykazania]
ZNAMIONA NIESPORNE: [znamię] → [dokument potwierdzający]
FAKTY NEUTRALNE:    [fakt] → [dlaczego bez normy]
```

PUNKT STOP przed Przejściem III:
Czy każda norma pochodzi z ISAP / oficjalnego źródła ZWERYFIKOWANEGO web_search w tej sesji?
Czy żaden wniosek nie opiera się na fakcie spoza Mapy Faktycznej?
TAK do obu → przejdź dalej. NIE → uzupełnij brakujące web_search przed przejściem dalej.

> ⚑ KONIEC WIADOMOŚCI 2 — wyślij tę wiadomość. Przejście III w kolejnej wiadomości.

---

### PRZEJŚCIE III — ANALIZA ADVERSARIALNA + WERYFIKACJA PIERWSZA
**Cel: Analiza z trzech perspektyw + pierwsze ponowne przeczytanie dokumentów źródłowych.**

#### 3A. Trzy perspektywy

A. Perspektywa sędziego
- Co sąd zobaczy czytając pisma po raz pierwszy?
- Które twierdzenia są udowodnione, które gołosłowne?
- Gdzie ciężar dowodu (art. 6 KC / art. 232 KPC)?
- Które fakty sąd uzna za niesporne bez dowodu?

B. Perspektywa pełnomocnika strony przeciwnej
- Jakie zarzuty procesowe wobec naszych pism?
- Które fakty naszej narracji są wewnętrznie sprzeczne?
- Gdzie nasze dowody są najsłabsze lub brakuje ich?
- Jakie kontrargumenty merytoryczne są najsilniejsze?

C. Perspektywa własnego pełnomocnika
- Które roszczenia/zarzuty mają najsilniejsze podstawy?
- Co wzmocnić przed następnym pismem?
- Jakie dowody są niezbędne a jeszcze nie złożone?
- Czy taktyka jest spójna z teorią sprawy?

#### 3B. Moduły V10 — obowiązkowe

```
V10-1 CONTRADICTION INTELLIGENCE
  Sprzeczności WEWNĄTRZ pism tej samej strony
  Format: [Pismo A, data, str.X] vs [Pismo B, data, str.Y] → [opis sprzeczności]

V10-2 SELF-DESTRUCTIVE ADMISSIONS
  Test: "Czy to zdanie w piśmie PRZECIWNIKA szkodzi mojemu klientowi?"
  TAK → przyznanie szkodliwe
  Format: [Pismo, data, str.X] → [treść] → [dlaczego szkodliwe] → [waga: Krytyczna/Wysoka/Średnia]

V10-3 TIMELINE CONFLICT
  Konflikty chronologiczne między dokumentami
  Zestawiaj daty z Mapy Faktycznej z twierdzeniami w pismach
  Format: [Data wg dok.A] vs [Data wg pisma B] → [opis konfliktu]

V10-4 CROSS-PLEADING CONSISTENCY
  Spójność twierdzeń TEJ SAMEJ strony między pismami
  Format: [Twierdzenie w piśmie DD.MM.RRRR] vs [Twierdzenie w piśmie DD.MM.RRRR]

V10-5 STRATEGIC THEORY COLLAPSE
  Czy teoria sprawy strony jest wewnętrznie spójna?
  Format: [Teza 1] + [Teza 2] → [dlaczego się wykluczają] → [skutek procesowy]

V10-6 JUDICIAL CREDIBILITY SIMULATION
  Symulacja oceny wiarygodności przez sąd
  Format: [strona] → [ocena 1-10] → [uzasadnienie: ton / rzeczowość / spójność]
```

#### 3C. WERYFIKACJA PIERWSZA — ponowne przeczytanie dokumentów

> To jest PIERWSZE z dwóch obowiązkowych przeczytań weryfikacyjnych.
> Cel: skonfrontowanie wniosków z Przejść I-III z dokumentami źródłowymi.

> ⚠️ REGUŁA BEZWZGLĘDNA — MECHANIZM PONOWNEGO CZYTANIA:
> "Ponowne przeczytanie" NIE oznacza odwołania się do zawartości kontekstu.
> Oznacza jawne wywołanie view na każdy plik źródłowy, który zawiera dowód
> podlegający weryfikacji w danym kroku.
>
> PRZED krokiem W1: wywołaj view na każdy dokument/upload wymieniony w Mapie Faktycznej
>   dla co najmniej 3 faktów kluczowych (tych o największym wpływie na predykcję).
> PRZED krokiem W2: wywołaj view na fragment pisma procesowego zawierający
>   każdą sprzeczność V10-1 i V10-2 o wadze KRYTYCZNA lub WYSOKA.
>
> ZAKAZ: Opisywanie "ponownego przeczytania" bez uprzedniego wywołania view
>   jest bezwzględnie zakazane. Jeśli view nie jest możliwy (plik niedostępny)
>   — oznaczyć fakt jako NIEZWERYFIKOWANY i obniżyć poziom pewności do WĄTPLIWY.
>
> FORMAT OBOWIĄZKOWY przed każdym krokiem W:
>   [view: /mnt/user-data/uploads/{plik}, strony {X}-{Y}]
>   → co odczytano / potwierdzono / skorygowano

```
WERYFIKACJA PIERWSZA — PROTOKÓŁ

Krok W1: Fakty kluczowe — view + drugie przeczytanie
  OBOWIĄZEK: view na dokumenty źródłowe dla min. 3 faktów kluczowych
  [ ] Czy każdy fakt z Mapy Faktycznej rzeczywiście wynika z dokumentu?
  [ ] Czy data / kwota / podmiot odczytane dokładnie (nie przybliżone)?
  [ ] Czy żaden fakt nie pominięty ze względu na wygodę narracyjną?

Krok W2: Sprzeczności V10 — view + weryfikacja
  OBOWIĄZEK: view na pisma zawierające sprzeczności KRYTYCZNE i WYSOKIE
  [ ] Czy sprzeczność rzeczywiście istnieje czy to błąd odczytu?
  [ ] Czy oba pisma przeczytane w całości (nie tylko fragment)?
  [ ] Czy kontekst zmienia ocenę sprzeczności?

Krok W3: Przyznania V10-2 — weryfikacja
  [ ] Czy przyznanie jest samooskarżające czy neutralne w kontekście?
  [ ] Czy strona miała alternatywne wyjaśnienie w tym samym piśmie?

Krok W4: Lista korekt:
  [nr] → [korekta] → [zmiana w ustaleniach]

STATUS WERYFIKACJI PIERWSZEJ: UKOŃCZONA / WYMAGA UZUPEŁNIENIA
```

Format wyniku Przejścia III:
```
RAPORT ADVERSARIALNY + WERYFIKACJA PIERWSZA
Perspektywa sędziego:    [...]
Perspektywa przeciwnika: [...]
Perspektywa własna:      [...]
V10-1 Sprzeczności:      [lista z numeracją, pismem, stroną]
V10-2 Przyznania:        [lista z wagą]
V10-3 Konflikty chron.:  [lista]
V10-5 Teoria spójna?:    [TAK/NIE + uzasadnienie]
V10-6 Wiarygodność:      [tabela stron]
WERYFIKACJA PIERWSZA:    [korekty / STATUS]
```

PUNKT STOP przed Przejściem IV:
Czy Weryfikacja Pierwsza ma status UKOŃCZONA? TAK → przejdź. NIE → zakończ weryfikację.

> ⚑ KONIEC WIADOMOŚCI 3 — wyślij tę wiadomość. Przejście IV w kolejnej wiadomości.

---

### PRZEJŚCIE IV — AUTOKOREKTA + WERYFIKACJA OSTATECZNA
**Cel: Spójność I-III + drugie i ostatnie obowiązkowe przeczytanie weryfikacyjne.**

#### 4A. Pięć pytań autokorekty P1-P5

```
P1. ZAKORZENIENIE
    Czy każdy wniosek prawny z II wynika z konkretnego faktu z I?
    NIE → usuń lub wskaż lukę dowodową.

P2. IZOLACJA
    Czy ocena prawna z II nie zanieczyszcza ustaleń faktycznych z I?
    TAK (zanieczyszczenie) → wróć do I i oczyść mapę.

P3. SYMETRIA
    Czy w III przeanalizowano słabości OBU stron z równą starannością?
    NIE → uzupełnij słabiej opracowaną stronę.

P4. SPÓJNOŚĆ NARRACYJNA
    Czy teoria sprawy z III jest spójna z chronologią z I?
    NIE → zidentyfikuj punkt sprzeczności, wyjaśnij lub skoryguj.

P5. POZIOMY PEWNOŚCI
    Czy każdy wniosek ma oznaczony poziom: PEWNE/PRAWDOPODOBNE/WĄTPLIWE/SPEKULATYWNE?
    NIE → dodaj oznaczenia przed raportem.
```

#### 4B. WERYFIKACJA OSTATECZNA — ponowne przeczytanie dokumentów

> To jest DRUGIE i ostatnie obowiązkowe przeczytanie weryfikacyjne.
> Cel: niezależna kontrola raportu końcowego przed jego wydaniem.
> Różnica od Weryfikacji Pierwszej: skupia się na kompletności i spójności
> całego raportu, nie tylko poszczególnych ustaleń.

> ⚠️ REGUŁA BEZWZGLĘDNA — MECHANIZM PONOWNEGO CZYTANIA:
> Identyczna reguła jak w Weryfikacji Pierwszej — obowiązkowe wywołanie view.
>
> PRZED krokiem O1: wywołaj view na każdy dokument zawierający dowód
>   wpływający na predykcję §9 raportu końcowego — dla każdego wariantu
>   predykcji osobno (wariant główny + alternatywny).
> PRZED krokiem O2: wywołaj view na fragmenty pism procesowych zawierające
>   każde przyznanie V10-2 o wadze KRYTYCZNA — sprawdź pełny akapit.
>
> ZAKAZ: Opisywanie "ponownego przeczytania" bez uprzedniego wywołania view
>   jest bezwzględnie zakazane. Identyczne konsekwencje jak w Weryfikacji Pierwszej.
>
> FORMAT OBOWIĄZKOWY przed każdym krokiem O:
>   [view: /mnt/user-data/uploads/{plik}, strony {X}-{Y}]
>   → co odczytano / potwierdzono / skorygowano

```
WERYFIKACJA OSTATECZNA — PROTOKÓŁ

Krok O1: Dowody kluczowe — view + drugie przeczytanie
  OBOWIĄZEK: view na dokumenty zawierające dowody wpływające na predykcję §9
  [ ] Wróć do każdego dowodu wpływającego na predykcję (§9 raportu)
  [ ] Czy dowód odczytany w pełnym kontekście dokumentu?
  [ ] Czy nie istnieje fragment tego samego dokumentu przeczący ustaleniu
      — pominięty w Przejściu I?

Krok O2: Pisma procesowe — view + drugie przeczytanie
  OBOWIĄZEK: view na akapity zawierające przyznania KRYTYCZNE (V10-2)
  [ ] Wróć do każdego pisma, z którego pochodzi ustalenie kluczowe
  [ ] Czy nie pominięto fragmentów pasujących do sprzeczności V10?
  [ ] Czy każde przyznanie V10-2 odczytane w pełnym akapicie (nie wyrwane)?

Krok O3: Spójność raportu
  [ ] Czy Executive Summary zgodne z §1-§11?
  [ ] Czy predykcja §9 zakorzeniona w faktach z I (nie interpretacjach z III)?
  [ ] Czy rekomendacje §10 wynikają z §4-§6?

Krok O4: Luki i braki
  [ ] Jakich dokumentów/dowodów brakuje?
  [ ] Jakie fakty pozostają niewyjaśnione po obu weryfikacjach?
  [ ] Czy braki wpływają na predykcję?

Krok O5: Lista korekt:
  [nr] → [korekta] → [wpływ na raport]

STATUS WERYFIKACJI OSTATECZNEJ: UKOŃCZONA / WYMAGA UZUPEŁNIENIA
```

Format wyniku Przejścia IV:
```
AUTOKOREKTA + WERYFIKACJA OSTATECZNA
P1 ✓/✗ | P2 ✓/✗ | P3 ✓/✗ | P4 ✓/✗ | P5 ✓/✗
WERYFIKACJA OSTATECZNA: [korekty O1-O4 / STATUS]
Luki nierozwiązane:     [lista lub "brak"]
GATE: RAPORT KOŃCOWY ZATWIERDZONY: TAK / NIE [blokada jeśli NIE]
```

> HARD GATE: Raport końcowy §1-§11 można wygenerować WYŁĄCZNIE po:
> (1) ukończeniu Weryfikacji Pierwszej (Przejście III) i
> (2) ukończeniu Weryfikacji Ostatecznej (Przejście IV) z GATE: ZATWIERDZONE TAK.

> ⚑ KONIEC WIADOMOŚCI 4 — wyślij tę wiadomość. Raport końcowy §1-§11 w kolejnej wiadomości.

---

## TRYBY PRACY

### TRYB A — Analiza tekstowa (domyślny)

```
KROK 0 — Model czteroprzebiegowy z dwukrotną weryfikacją [OBOWIĄZKOWY]
  Każde przejście = OSOBNA WIADOMOŚĆ

  Wiadomość 1 → Przejście I   — Mapa faktyczna
  Wiadomość 2 → Przejście II  — Macierz fakt-norma (ISAP)
  Wiadomość 3 → Przejście III — Raport adversarialny + WERYFIKACJA PIERWSZA (W1-W4)
  Wiadomość 4 → Przejście IV  — Autokorekta P1-P5 + WERYFIKACJA OSTATECZNA (O1-O5) → GATE
  Wiadomość 5 → Raport końcowy §1-§11 (tylko po GATE: ZATWIERDZONE TAK)
  Wiadomość 6 → Widget Raportu Sytuacyjnego v2 [OBOWIĄZKOWY]
  Wiadomość 7 → Oferta pisma procesowego

KROK 1 — Filtry #2 #4 #8 #9 z references/filtry-analityczne.md
  (Filtry #1 #3 #5 #6 #7 #10 #11 absorbowane przez Przejścia I-IV)

KROK 2 — Moduły specjalistyczne references/MOD-{litera}.md (tylko pasujące)

KROK 3 — Orzecznictwo online (references/orzecznictwo.md)

KROK 4 — Raport końcowy §1-§11 (tylko po GATE: ZATWIERDZONE TAK)
```

### TRYB B — Widget interaktywny (TYLKO na jawne żądanie)

> Renderuj przez show_widget z HTML vanilla JS. NIE przez .jsx / present_files.

```
1. Dane sprawy ze rozmowy (schemat: syg, sad, rodzaj, klient, rola,
   przeciwnik, etap, wartosc, przepis, znamiona, notatki)
2. visualize:read_me modules=["interactive","mockup"]
3. ⛔ MOD-WIDGET-IO (OBOWIĄZKOWE przed show_widget):
   view /mnt/skills/user/shared/MOD-WIDGET-IO.md
   → wbuduj pasek IO (§3 HTML + §4 CSS + §5 JS) w nagłówek widgetu
   → zaimplementuj ioGetState/ioSetState/ioGetMarkdown dla danych analiza-sadowa
   → ustaw IO_SKILL_ID='analiza-sadowa-v6', IO_CASE_ID=syg
   → matryca: Export JSON ✅ MD ✅ PDF ✅ | Import JSON ✅
4. show_widget — kompletny HTML, dane jako literały JS
   Zakładki: Intake | Przejście I | Przejście II | Przejście III+W1 |
             Przejście IV+WO | Dowody | Filtry | Orzecznictwo | Koszty | Raport
5. Opis 2-3 zdania + "zacznij od zakładki Przejście I"
```

### TRYB C — Analiza hybrydowa

Dokumenty + pytanie o widget:
1. Przejście I (Mapa) + Przejście II (Macierz) w tekście
2. Widget z danymi
3. Po widgecie: Przejście III+IV (z weryfikacjami) w tekście

---

## SEKWENCJA 11 FILTRÓW

| # | Filtr | Zasada kluczowa | v6 |
|---|-------|-----------------|-----|
| 1 | Identyfikacja i kwalifikacja | Pełna lista znamion przed #2 | → I+II |
| 2 | Orzecznictwo oficjalne | ms.gov.pl · sn.pl · nsa.gov.pl | osobny krok |
| 3 | Strona podmiotowa przed przedmiotową | Zamiar przed skutkiem | → II |
| 4 | Kontekst: spór czy czyn zabroniony? | Uprawnienia ≠ wykroczenie | osobny krok |
| 5 | Dowody: całość nie fragment | Spójność→spontaniczność→interes | → I+III+W1+WO |
| 6 | Słabości OBU stron symetrycznie | Oskarżyciel+obrona łącznie | → III |
| 7 | Zachowanie stron = wiarygodność | Rzeczowość > emocjonalność | → III V10-6 |
| 8 | Test in dubio — OBOWIĄZKOWY | art. 5 §2 KPK | osobny krok |
| 9 | Sygnały proceduralne — dwie interpretacje | Nigdy samodzielna podstawa | osobny krok |
| 10 | Sprzeczności między-pismowe | Zmiana twierdzeń = osłabienie | → III V10-4 |
| 11 | Autokorekta P1-P5 | Przed prognozą | → IV |

Pełne instrukcje: references/filtry-analityczne.md

---

## MODUŁY SPECJALISTYCZNE

| Moduł | Plik | Uruchom gdy |
|-------|------|-------------|
| A | references/MOD-A.md | ≥2 pisma procesowe tej samej strony |
| B | references/MOD-B.md | Porozumienie pod presją, art. 87 KC |
| C | references/MOD-C.md | Nagranie audio/video w sprawie |
| D | references/MOD-D.md | Ta sama kwota = 2 wykluczające kwalifikacje |
| E | references/MOD-E.md | Spór o konto e-mail / zmiana hasła |
| F | references/MOD-F.md | Audyt pism własnego pełnomocnika |

A+F łącznie: audyt dwustronny. B+D: często w sporach pracowniczych.

---

## REGUŁY NADRZĘDNE

1. ZAMIAR PRZED SKUTKIEM — strona podmiotowa zawsze przed przedmiotową
2. IZOLACJA PRZEJŚĆ — ustalenia faktyczne (I) i prawne (II) są oddzielne
3. DWUKROTNA WERYFIKACJA OBOWIĄZKOWA — W1 (Przejście III) + WO (Przejście IV)
4. HARD GATE — raport końcowy tylko po GATE: ZATWIERDZONE TAK
5. KONTEKST PRZED FRAGMENTEM — nigdy nie oceniaj zdania bez kontekstu całości
6. IN DUBIO OBOWIĄZKOWE — każda sprawa karna/wykroczeniowa: Filtr #8
7. ORZECZNICTWO TYLKO OFICJALNE — zakaz cytowania z blogów, komentarzy prywatnych
8. SYMETRIA — słabości obrony i oskarżenia zawsze łącznie
9. JEDEN FAKT = JEDNA KWALIFIKACJA — zakwestionuj każdą podwójną kwalifikację
10. WERYFIKACJA WE WSZYSTKICH PISMACH — sprawdź fakt w każdym piśmie tej strony
11. POZIOMY PEWNOŚCI — każdy wniosek: PEWNE/PRAWDOPODOBNE/WĄTPLIWE/SPEKULATYWNE
12. ALTERNATYWNE WYJAŚNIENIE — dla każdego dowodu obciążającego: sprawdź niewinną alternatywę
13. ZAKAZ AUTOŁADOWANIA JSX — widget tylko na jawne żądanie
14. OSOBNA WIADOMOŚĆ PER KROK — każde z czterech przejść, raport końcowy,
    widget sytuacyjny oraz oferta pisma = 7 odrębnych wiadomości;
    łączenie jakichkolwiek kroków jest bezwzględnie zakazane
15. ZAKAZ PRACY Z PAMIĘCI — dwa twarde mechanizmy egzekwowania:
    (a) PRZEPISY: przed każdą normą w macierzy fakt-norma → obowiązkowy web_search;
        brak web_search = zakaz wpisania przepisu do macierzy
    (b) DOKUMENTY: przed każdym krokiem W1/W2/O1/O2 → obowiązkowy view na pliki
        źródłowe; brak view = zakaz opisywania "ponownego przeczytania";
        fakt bez view = oznaczony jako NIEZWERYFIKOWANY z poziomem pewności WĄTPLIWY
16. SD-SKAN KOMPLETNY (KROK 0) — mechanizm shared:
    view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
    Wszystkie dokumenty muszą być zinwentaryzowane i odczytane (SD-VER=KOMPLET)
    PRZED Przejściem I. Pominięcie strony lub protokołu sądowego = błąd krytyczny.

---

## FORMAT RAPORTU KOŃCOWEGO

```
RAPORT ANALITYCZNY — [Sygnatura / Sprawa]
Data: [DD.MM.RRRR] | Postępowanie: [rodzaj] | Etap: [etap]

EXECUTIVE SUMMARY
[3 zdania: prognoza + kluczowy czynnik decydujący + główna rekomendacja]

─── WYNIKI MODELU CZTEROPRZEBIEGOWEGO ─────────────────────────────────

PRZEJŚCIE I — MAPA FAKTYCZNA
  Chronologia: [zdarzenia z datami i dokumentami]
  Podmioty: [lista z rolami]
  Kwoty/daty: [rejestr]

PRZEJŚCIE II — MACIERZ FAKT-NORMA
  [tabela: fakt → norma (ISAP) → znamię → status]
  Sporne: [...] | Niesporne: [...]

PRZEJŚCIE III — RAPORT ADVERSARIALNY
  Perspektywa sędziego: [...]
  Perspektywa przeciwnika: [...]
  Perspektywa własna: [...]
  V10 Sprzeczności: [lista]
  V10 Przyznania: [lista z wagą]
  WERYFIKACJA PIERWSZA: [korekty / STATUS: UKOŃCZONA]

PRZEJŚCIE IV — AUTOKOREKTA
  P1 ✓/✗ | P2 ✓/✗ | P3 ✓/✗ | P4 ✓/✗ | P5 ✓/✗
  WERYFIKACJA OSTATECZNA: [korekty / STATUS: UKOŃCZONA]
  GATE: ZATWIERDZONE TAK

─── RAPORT §1-§11 ──────────────────────────────────────────────────────

§1.  KWALIFIKACJA PRAWNA I ZNAMIONA
     Przepis: [pełna treść z ISAP]
     Znamiona: [każde oddzielnie — sporne vs niesporne]

§2.  ORZECZNICTWO
     [Sąd, DD.MM.RRRR, sygnatura, URL] — [teza max 14 słów]
     [max 3 orzeczenia, zweryfikowane oficjalnie]

§3.  STRONA PODMIOTOWA
     Zamiar: [z min. 3 elementów materiału]
     Forma winy: [zamiar bezpośredni/ewentualny/kierunkowy/nieumyślność]
     Alternatywne wyjaśnienie: [TAK/NIE + uzasadnienie]

§4.  OCENA MATERIAŁU DOWODOWEGO
     Poziom A: [...] | B: [...] | C: [...] | D: [...]
     Siła łączna: [0-10] | Luki: [...]

§5.  SŁABOŚCI STRON
     Powód/Oskarżyciel: [twierdzenia bez dowodu, sprzeczności, interes]
     Pozwany/Obrona:    [milczenie, sprzeczności z dokumentami]

§6.  TEST IN DUBIO
     Znamię 1 [nazwa]: PEWNE / WĄTPLIWE / NIEPEWNE → [skutek]
     [każde znamię osobno]
     Konkluzja: [wynik]

§7.  SYGNAŁY PROCEDURALNE
     [sygnał]: Interpretacja A [...] | Interpretacja B [...]

§8.  MODUŁY SPECJALISTYCZNE (tylko aktywne)
     [Moduł X]: [ustalenia kluczowe]

§9.  PREDYKCJA ROZSTRZYGNIĘCIA
     Wariant główny:       [wynik] [%] — [uzasadnienie] — pewność: [PEWNE/PRAWDOPODOBNE]
     Wariant alternatywny: [wynik] [%] — [warunek zmiany]
     Kluczowy czynnik:     [co zdecyduje]

§10. REKOMENDACJE PROCESOWE
     1. [działanie + podstawa prawna + pilność]
     2. [...] 3. [...]

§11. AUTOKOREKTA (skrót z Przejścia IV)
     P1 ✓ | P2 ✓ | P3 ✓ | P4 ✓ | P5 ✓
     Weryfikacja Pierwsza:    UKOŃCZONA
     Weryfikacja Ostateczna:  UKOŃCZONA
     GATE:                    ZATWIERDZONE TAK
```

---

## SEKWENCJA END-TO-END — PO RAPORCIE KOŃCOWYM

> KOLEJNOŚĆ JEST BEZWZGLĘDNA. Każdy krok w osobnej wiadomości.

```
WIADOMOŚĆ 6 — WIDGET RAPORTU SYTUACYJNEGO [OBOWIĄZKOWY]

Wykonaj natychmiast po §11 raportu końcowego, bez pytania o zgodę.

SEKWENCJA:
  1. view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
     (tylko jeśli nie wczytano w tej sesji)

  2. Zbuduj blueprint JSON ze schematu w raport-sytuacyjny-v2/SKILL.md
     → dane wyłącznie z rozmowy / dokumentów; pola nieznane → null
     → tryb: "A" (po pełnej analizie)

  3. visualize:read_me modules=["interactive","mockup"]
     (tylko jeśli nie załadowano w tej sesji)

  4. show_widget — kompletny HTML vanilla JS z danymi jako literały JS
     Zakładki: Sprawa | Chronologia | Źródła | Ryzyka |
               Luki i sprzeczności | Rekomendacje
     Przyciski sendPrompt dla rekomendacji procesowych

  Poprzedź widgetem komunikat:
  "Poniżej aktualny raport sytuacyjny sprawy —
   możesz uzupełnić brakujące dane lub skorygować automatycznie rozpoznane informacje."

WYJĄTEK: pomiń wiadomość 6 tylko gdy użytkownik zadał jedno pytanie
         bez dokumentów i bez stanu faktycznego sprawy.

---

WIADOMOŚĆ 7 — OFERTA PISMA PROCESOWEGO

Po widgecie (lub gdy wyjątek powyżej — bezpośrednio po raporcie):

  LAIK:    "Czy chcesz żebym napisał pismo na podstawie tej analizy?"
  PRAWNIK: "Czy wygenerować dokument procesowy? (.docx / .pdf)"
  → TAK → prawny-router-v3 → pisma-procesowe-v3 lub pisma-proste-v2
```

---

## TERMINY PROCESOWE — TABELA SZYBKIEGO DOSTĘPU

| Czynność | KPC | KPK | KPW | KPA | KP |
|----------|-----|-----|-----|-----|----|
| Wniosek o uzasadnienie | 7 dni | 7 dni | 3 dni | — | — |
| Apelacja | 14 dni | 14 dni | 7 dni | — | — |
| Zażalenie | 7 dni | 7 dni | — | — | — |
| Sprzeciw od nakazu zapłaty | 14 dni | — | — | — | — |
| Odwołanie od decyzji | — | — | — | 14 dni | — |
| Skarga do WSA | — | — | — | 30 dni | — |
| Odwołanie od wypowiedzenia | — | — | — | — | 21 dni ⚠ |

⚠ KP art. 264 §1 — termin ZAWITY; roszczenie wygasa bezpowrotnie.
Pełne tabele: references/koszty-terminy.md

---

## ZASADY CYTOWANIA ORZECZNICTWA

Format: [Sąd, DD.MM.RRRR, sygnatura, URL]
Cytat: max 14 słów — parafraza, nie oryginał — jedno cytowanie na orzeczenie
Dozwolone: orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl · saos.org.pl
Zakaz: komentarze, blogi, LEX/Legalis bez weryfikacji oficjalnej
Procedura: references/orzecznictwo.md

---

## KIEDY WCZYTAĆ REFERENCES/

| Sytuacja | Plik |
|----------|------|
| Przejścia I-IV (model czteroprzebiegowy) | wbudowane w SKILL.md |
| Filtry #2 #4 #8 #9 | references/filtry-analityczne.md |
| Protokół dwukrotnej weryfikacji (rozszerzony) | references/WERYFIKACJA-DOWODOW.md |
| Moduł specjalistyczny | references/MOD-{litera}.md |
| Moduły A+F łącznie | MOD-A.md + MOD-F.md |
| Fallback | references/moduly-spec.md |
| Orzecznictwo | references/orzecznictwo.md |
| Koszty i terminy | references/koszty-terminy.md |
| Mapa całego skilla | references/BLUEPRINT-SCHEMA.md |
| Widget | show_widget HTML vanilla JS — TYLKO na żądanie |
| Sprawa ≥10 dokumentów (model kontynentalny) | PRZEBIEG-1-ekstrakcja.md → PRZEBIEG-2-strukturalna.md → PRZEBIEG-3-predykcja.md |

---

## V10 — CONTRADICTION INTELLIGENCE

V10 jest integralną częścią Przejścia III (sekcja 3B).
Wszystkie moduły V10 wykonywane w Przejściu III — nie jako osobny krok.

V10-1 contradiction-intelligence — sprzeczności wewnątrz pism tej samej strony
V10-2 self-destructive-admissions — przyznania szkodliwe dla własnej teorii
V10-3 timeline-conflict — konflikty chronologiczne między dokumentami
V10-4 cross-pleading-consistency — spójność twierdzeń między pismami tej samej strony
V10-5 strategic-theory-collapse — wewnętrzna spójność teorii sprawy
V10-6 judicial-credibility-simulation — symulacja oceny wiarygodności przez sąd

Hard gate: nie przygotowuj repliki, odpowiedzi, apelacji bez V10 w Przejściu III.

---

## INTEGRACJA Z KANCELARYJNYM JĄDREM SHARED

Gdy wynik analizy służy do pisma, strategii lub decyzji terminowej:

view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md

Nie dubluj logiki shared w lokalnych plikach.

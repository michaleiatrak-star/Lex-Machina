---
name: analizator-dowodow-v3
version: "5.7.0"
type: executive-analiza
status: production
description: |
  Analizator dowodów procesowych v5 — pełny modularny zestaw (dowody + pisma).
  Stosuj gdy użytkownik: dostarcza dowody, dokumenty, zeznania, nagrania, maile,
  akta, pisma procesowe, decyzje lub korespondencję do oceny; pyta o siłę dowodów,
  hierarchię A–D, wartość procesową, pokrycie przesłanek lub spójność dowodów;
  chce oceny sprawy oczami sądu/przeciwnika/pełnomocnika; pyta o terminy procesowe
  (KPC/KPK/KPW/KPA/KP); chce ekstrakcji faktów, analizy śledczej (profilowanie,
  VSA, HUMINT), syntezy faktycznej, łańcuchów przyczynowych lub narracji procesowej;
  chce ustalić jakich dziedzin prawa dotyczy sprawa (MX: 25 dziedzin).
  Uruchamia widget graficzny z zakładką Sprzeczności (z prawem / między dok.)
  LUB raport narracyjny .md ze spisem treści (MD-NARR) na żądanie formatu dokumentu.
  Nigdy nie oceniaj bez wystarczających informacji — pytaj najpierw.
compatibility: "web_search, bash, document_analysis"
changelog:
  - "5.7.0: nowy moduł MOD-NAZEWNICTWO-STRON.md (10 tabel nazewnictwa T1-T10: cywilne procesowe/nieprocesowe, karne KPK, wykroczenia KPW, administracyjne KPA, sądowoadministracyjne PPSA, pracownicze, egzekucyjne, zabezpieczające, rodzinne; 7 zestawów wymogów formalnych W1-W7 z elementami OBL/ADD/POZ/WNP/WSA/ZAW/WEZ; 7 wzorów nagłówków N1-N7; reguły cross-check C1/C2 dla LA-RODZAJ i LA-PODMIOT-POWTORZONY); MOD-LAPSUS-AUDYT.md zaktualizowany o wywołanie MOD-NAZEWNICTWO-STRON; BLOK-NAZW rozszerzony o cross-reference do tabel T"
  - "5.6.4: BLOK J zastąpiony odwołaniem do dedykowanego modułu MOD-LAPSUS-AUDYT.md; moduł zawiera 22 typy lapsusów w 4 kategoriach (Podmiot, Kwalifikacja, Logika, Dokument), protokół L0-L5, tabele 22 kodów, źródła eksperckie (prawo.pl, Palestra, Lawyers Mutual, BriefCatch, Cornell LII, arxiv); nowe typy z D04: [LA-PODMIOT-POWTORZONY] (ten sam podmiot dwa razy zamiast dwóch różnych), [LA-BRAK-KONKRETYZACJI] (żądanie bez wskazania konkretnego czynu/daty); wzorzec systemowy LA-RODZAJ potwierdzony w D02+D03+D04 (4 wystąpienia u tego samego autora); tablica lapsusy[] rozszerzona o pole wzorzec (SZABLON/JEDNOSTKOWY/SYSTEMOWY)"
  - "5.6.3: BLOK-LAPSUS rozszerzony o 6 nowych typów z D03: [LA-TEZA-DOWODOWA] (wniosek dowodowy na okoliczność faktów dotyczących własnego klienta zamiast strony przeciwnej), [LA-DATA-PRZYSZLA] (dowód powołany z daty późniejszej niż data pisma), [LA-PRZYZNANIE-KORZYSTNE] (twierdzenie osłabiające jedno roszczenie wzmacnia inne roszczenie lub pozycję przeciwnika), [LA-KWALIFIKACJA-TECHNICZNA] (błędne rozumienie mechanizmu technicznego/prawnego np. profil zaufany = urządzenie zamiast osoba), [LA-ZAKRES-DOWODOWY] (dowód powołany spoza okresu objętego zobowiązaniem Sądu), [INTRA-SAMOOBALA] (argumentacja obala własną tezę w obrębie jednego akapitu); protokół L2 uzupełniony; wzorzec systemowy LA-RODZAJ udokumentowany w 4 miejscach D01-D03"
  - "5.6.2: BLOK-LAPSUS — korekty po weryfikacji z oryginalnych dokumentów: LA-1 potwierdzony (POWÓDKA zamiast Powód — błąd rodzaju gramatycznego, nie kierunku podmiotów); LA-2 data Poudela skorygowana na 5.12.2024 (prawidłowa); nowe typy [LA-RODZAJ] (błąd fleksji podmiotu przez kopiowanie wzorca z innej sprawy), [LA-ODERECZNIE] (brak daty przy odręcznie dopisanym fragmencie dokumentu), [LA-KWOTA-SLOWNIECYFRAMI] (rozbieżność kwoty słownie/cyframi przy odręcznym uzupełnieniu), [LA-OSOBA-MYLONA] (pomylenie dwóch różnych osób o podobnych imionach: Bishal Poudel vs Bishwas Pudasaini); protokół L2 rozszerzony o reguły detekcji tych typów"
  - "5.6.1: BLOK-LAPSUS rozszerzony o typy z oryginalnych dokumentów D01/D02: [LA-CHRONOLOGIA] (błąd daty pokwitowania Poudela — 25.01.2024 vs twierdzenie 5.12.2024), [LA-MIESIAC] (pokwitowanie: październik vs narracja: wrzesień), [LA-PODMIOT-KRS] (Rak jako wspólnik Lorica Iuris — nie zewnętrzny radca), [LA-KOSZTY] zmieniony z potencjalnego na potwierdzony typ; protokół L2 uzupełniony o [LA-CHRONOLOGIA] i [LA-MIESIAC]"
  - "5.6.0: tryby addytywne MODE A/B/C (auto-detect z materiału, zmiana w sesji bez kasowania danych); BLOK-MODE jako KROK 0a przed całym routerem; BLOK-LAPSUS — dedykowany detektor błędów autorskich (LA) z kontekstem autora i skutkiem odwrotnym; 8 typów lapsusów: [LA-KOSZTY][LA-DATA][LA-PODMIOT][LA-KWALIF][LA-NARR][LA-KWOTA][LA-LEGAL][LA-INTENCJA]; dashboard v5.6: zakładka Lapsusy z kategoryzacją i severity; auto-rozszerzanie trybu gdy dodano pisma drugiej strony; widget-kreator v3: STEP 1.5 tryb pracy zintegrowany z auto-detect materiału"
  - "5.5.0: widget-kreator v2 (auto-select trybu badania — 1 sygnał→auto, kilka→dialog; 5 kroków zamiast 4; format wyjścia jako osobny krok); dashboard v5.5 (nowe zakładki: Strony i świadkowie, Nazewnictwo procesowe, Kwestie sporne DIS z drill-down; eksport JSON/MD/CSV; metryki KPI rozszerzone); BLOK-STRONY — rejestr osób z rolą/umocowaniem/metadanymi; BLOK-NAZW — kontrola nazewnictwa procesowego i kwalifikacji stron; BLOK-DIS — kwestie sporne z common ground, stanowiskami, przepisami HARDGATE i rekomendacjami"
  - "5.4.1: doprecyzowanie relacji dashboard/MD-NARR — dashboard (FAZA 2/KROK 4) jest WZORCOWYM domyślnym formatem raportu (C3, generowany zawsze gdy B1=TAK); MD-NARR jest wersją SZCZEGÓŁOWĄ generowaną jako DODATEK na wyraźne żądanie (C4: 'szczegółowo'/'dokument'/'plik'/'jak LexAlpha'), nigdy zamiast dashboardu"
  - "5.4.0: nowy MD-NARR (raport narracyjny .md ze spisem treści, format alternatywny do dashboardu); MD3c — nowa podkategoria [DOUBT][IDENT]/[CROSS][IDENT] dla rozbieżności tożsamości osób podpisujących dokumenty; MP1 — reguła tożsamości w Warstwie A; MD3a — KROK 0 (skan błędów dat/nazw przed analizą), obowiązkowy przy ≥2 dok.; MD4 — mapa dowodów do faktów (evidence_map) + pole 'Dotyczy' w lukach; dashboard gaps[] rozszerzony o pole dotyczy"
  - "5.3.0: MD3c kanoniczny z cites[]; nowy type:'intra' dedykowany dla INTRA-CONTRA; dashboard: filtr [INTRA] osobny, type-intra styl, typeLabel/typeCls zaktualizowane; §P3 spójna terminologia type vs prefix"
  - "5.2.0: Reguła Precyzji Detalu §P1–P3; INTRA-CONTRA; checklist 8-punktowy przed zakładką Sprzeczności; format [INTRA]/[CROSS]/[LEG]"
  - "5.1.0: centralny router — jeden decision tree, moduły wczytywane wyłącznie on-demand na podstawie sygnałów; eliminacja duplikacji reguł routingu"
  - "5.0.0: fuzja analizator-dowodow-v4 + analiza-pism-v4; nowy MX; warstwy D/P/DP"
  - "4.0.0: zakładka Sprzeczności z cytatami, M3b skanowanie sprzeczności z prawem"
---

# Analizator Dowodów Procesowych v5.1

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Przed każdą analizą z powołaniem na przepisy lub sygnatury: `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

> **Zasada nadrzędna:** Nigdy nie oceniam bez wystarczających informacji.
> Pytam zanim wystawię ocenę. Każdy alert zawiera podstawę prawną.
> Role: sędzia neutralny · pełnomocnik przeciwnika · Twój pełnomocnik
> · analityk śledczy (hipotezy tylko jako `[H-ŚLEDCZA]`).

---

## KROK 0 — BLOKADA WSTĘPNA

```
Materiał to: umowa / OWU / porozumienie / regulamin / ugoda kontraktowa
(i NIE jest jednym z wielu dowodów w sprawie sądowej)?
→ STOP. Przekieruj do analizator-umow-v1. Nie kontynuuj.
```

---

## KROK 0a — WYKRYCIE TRYBU PRACY (MODE) — addytywny, auto-detect

```
Analizuj materiał i ustal MODE przed uruchomieniem routera.
MODE jest addytywny — może rozszerzyć się w trakcie sesji.

──────────────────────────────────────────────────────────────
SYGNAŁY TRYBU — sprawdzaj w tej kolejności:
──────────────────────────────────────────────────────────────

SYGNAŁ A — tryb porównawczy jednej strony:
  → ≥2 pisma procesowe TEGO SAMEGO autora / tej samej strony z różnych dat
  → słowa kluczowe: "odpowiedź na pozew" + "pismo procesowe" od tego samego pełnomocnika
  → wynik: MODE=A (obligatoryjne: Nazewnictwo, Historia narracji, INTRA)
  → LAPSUS szczególnie istotny: błędy autorskie wynikające z wielokrotnego pisania

SYGNAŁ B — tryb dwustronny:
  → pisma od CO NAJMNIEJ dwóch różnych stron procesowych
  → słowa kluczowe: "pozew" + "odpowiedź", "apelacja" + "odpowiedź na apelację"
  → wynik: MODE=B (obligatoryjne: DIS, Fakty bezsporne, CROSS)

SYGNAŁ C — tryb przygotowawczy:
  → dokumenty źródłowe BEZ pism procesowych drugiej strony
  → słowa kluczowe: "przygotowuję pozew", "piszę wezwanie", "co mam do dyspozycji"
  → wynik: MODE=C (obligatoryjne: Scoring dowodów, Przesłanki i luki, Roszczenia)

TRYBY WIELOKROTNE — addytywność:
  → Materiał może spełniać kilka sygnałów jednocześnie → ustaw wszystkie aktywne tryby
  → Inicjalnie ustaw tryb dominujący; przy dołączeniu nowych pism auto-rozszerz
  → MODE=A+B: jest materiał jednej strony (kilka pism) + odpowiedź drugiej
  → MODE=B+C: jest pozew własny + odpowiedź pozwanej → pełna analiza dwustronna
    z planowaniem dalszych kroków
  → Nigdy nie kasuj danych przy rozszerzeniu MODE — tablice są addytywne

BRAK SYGNAŁU:
  → Uruchom widget-kreator STEP 1.5 — zapytaj użytkownika
  → Zaproponuj tryb na podstawie opisu sprawy

──────────────────────────────────────────────────────────────
ZAKŁADKI OBLIGATORYJNE PER TRYB:
──────────────────────────────────────────────────────────────

| Zakładka dashboardu          | MODE A | MODE B | MODE C |
|------------------------------|--------|--------|--------|
| Strony i świadkowie          |  ✅    |  ✅    |  ✅    |
| Tożsamość IDENT              |  ✅    |  ✅    |  ✅    |
| Lapsusy autorskie [LAPSUS]   |  ✅    |  ✅    |  🔷    |
| Nazewnictwo procesowe        |  ✅    |  🔷    |  ❌    |
| Historia narracji [A-only]   |  ✅    |  ❌    |  ❌    |
| Sprzeczności INTRA           |  ✅    |  🔷    |  ❌    |
| Sprzeczności CROSS           |  ❌    |  ✅    |  ❌    |
| Kwestie sporne DIS           |  ❌    |  ✅    |  ❌    |
| Fakty bezsporne              |  ❌    |  ✅    |  ❌    |
| Rejestr dowodów / scoring    |  🔷    |  🔷    |  ✅    |
| Roszczenia i podstawy [C]    |  ❌    |  ❌    |  ✅    |
| Przesłanki i luki            |  🔷    |  ✅    |  ✅    |
| Terminy procesowe            |  🔷    |  🔷    |  🔷    |
| Raport + Eksport             |  ✅    |  ✅    |  ✅    |

✅ = obligatoryjna  🔷 = opcjonalna (jeśli materiał zawiera)  ❌ = nieaktywna

──────────────────────────────────────────────────────────────
BADGE TRYBU W DASHBOARDZIE:
──────────────────────────────────────────────────────────────
Nagłówek dashboardu zawiera badge aktywnego trybu:
  [MODE A: Analiza jednej strony] [MODE B: Dwustronny] [MODE C: Przygotowanie]
  lub kombinacje: [MODE A+B] [MODE B+C]
Przycisk: "＋ Dodaj pisma drugiej strony →" gdy MODE=A → auto-rozszerz do A+B
Przycisk: "＋ Dodaj własne pisma →" gdy MODE=B → auto-rozszerz do A+B
```

---

## KROK 0b — SKAN KOMPLETNOŚCI PLIKÓW ⛔ HARD GATE

```
Wykonaj PRZED KROK 1. Mechanizm współdzielony z pisma-procesowe-v3 i analiza-sadowa-v6.

view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md → wykonaj sekwencję:

SD-GATE-0: Czy w wiadomości wzmianka o załącznikach/dowodach/aktach BEZ wgranego pliku?
  TAK → ⛔ STOP. Wyświetl: "Wskazujesz na dokumenty, ale nie wykryłem żadnego pliku.
         Wgraj materiały przed analizą." Czekaj. Nie przechodzij do KROK 1.

SD-INW: Zinwentaryzuj WSZYSTKIE pliki (ZIP = zawartość, nie kontener).
  Zbuduj SD-REJ z każdym plikiem D[id] i liczbą stron/zakładek.

SD-READ: Per każdy D[id] — właściwa metoda per typ:
  PDF-skan    → pdftoppm -r 120 per KAŻDA strona → view
  PDF-tekst   → pdftotext; jeśli pusty → rasteryzacja
  XLSX        → openpyxl: KAŻDA zakładka
  ODT-obrazy  → zipfile Pictures/* → view per obraz
  JPG/PNG     → view bezpośrednio
  DOCX        → zipfile word/document.xml
  ⛔ ZAKAZ POMINIĘCIA STRONY / ZAKŁADKI / OBRAZU

SD-VER: Wszystkie D[id] = ✅ ODCZYTANE?
  NIE → wróć do SD-READ. Nie przechodzij do KROK 1.

Wyniki SD-READ → SD-FAKTY[D[id]] zasilają BLOK A i BLOK B.
Protokoły sądowe: KAŻDE zdanie zeznań świadka → osobny wpis SD-FAKTY.
```

---

## KROK 1 — INTAKE I WIDGET

Uruchom widget kreator (zebranie danych od użytkownika):

```
view /mnt/skills/user/analizator-dowodow-v3/assets/widget-kreator.html

LOGIKA AUTO-SELECT (v2):
- 1 sygnał kontekstowy → auto-wybór trybu badania (bez pytania)
- Kilka sygnałów → okno dialogowe z opcjami
- Brak sygnału → użytkownik wybiera ręcznie w STEP 2
- Sygnały: tryb postępowania + słowa kluczowe z opisu materiału + liczba dokumentów

FORMAT WYJŚCIA (STEP 4):
- DASHBOARD (domyślny) → show_widget
- NARR → MD-NARR jako plik .md
- OBA → dashboard + plik .md
- INLINE → bez widgetu
→ show_widget(...)
```

Po zebraniu danych przejdź do KROK 2.

---

## KROK 2 — CENTRALNY ROUTER

Odpowiedz na każde pytanie diagnostyczne (TAK/NIE/?) na podstawie materiału.
Każde TAK dodaje moduły do listy do wczytania. Na końcu wczytujesz TYLKO
moduły z tej listy — nic więcej.

---

### BLOK A — Charakter materiału

```
A1. Materiał zawiera dowody do oceny (dokumenty, nagrania, maile, zeznania)?
    TAK → dodaj: MD1, MD2

A2. Materiał zawiera pisma procesowe, akta lub narrację stron?
    TAK → dodaj: MP0, MP1

A3. Tylko pytanie o termin procesowy (bez analizy dowodów)?
    TAK → dodaj: MD5 · STOP (pomiń pozostałe bloki)
```

---

### BLOK B — Liczba i typ dokumentów

```
B1. Liczba dokumentów ≥ 3 LUB sprawa złożona wielowątkowa?
    TAK → dodaj: FAZA2-dashboard

B2. Liczba dokumentów ≥ 2?
    TAK → dodaj: MD3c (sprzeczności między dokumentami) [obowiązkowy]
        → wykonaj też MD3a KROK 0 (skan błędów dat i nazw) jako pierwszy krok
          analizy, niezależnie od tego czy B4=TAK — MD3a KROK 0 jest lekki
          (kilka punktów kontrolnych) i zapobiega błędom propagowanym dalej

B3. Materiał zawiera nagranie LUB wątpliwość co do legalności dowodu?
    TAK → dodaj: MD3b (walidacja prawna, zakazy dowodowe, art. 267 KK)

B4. Dokument może mieć wady formalne (kopia bez poświadczenia, brak pieczęci,
    brak podpisu, skan bez oryginału)?
    TAK → dodaj: MD3a (pełna walidacja formalna, wszystkie punkty)
```

---

### BLOK B5 — PORCJOWANIE (⛔ HARD GATE gdy materiał duży)

```
Po SD-VER (KROK 0b) — PRZED MD1-ekstrakcją:
  view /mnt/skills/user/shared/MOD-PORCJOWANIE-DOWODOW.md → wykonaj PD0.

  STATUS BEZPIECZNY  (≤5 plików i ≤100 KB):
    → kontynuuj BLOK C i MD1 normalnie bez podziału.

  STATUS OSTRZEŻENIE (6–15 plików lub 100–400 KB):
    → PD1 (podział na partie) → PD2 (plan dla użytkownika) → STOP.
    → Czekaj na zatwierdzenie planu przed analizą.

  STATUS WYMAGANE    (≥16 plików lub >400 KB):
    → ⛔ HARD GATE — nie rozpoczynaj MD1 bez zatwierdzonego planu partii.
    → PD1 → PD2 → STOP → po zatwierdzeniu: MD1/MD2/MD3 per partia.

  STATUS KRYTYCZNE   (≥30 plików lub >800 KB):
    → ⛔ HARD GATE BEZWZGLĘDNY — max 3–4 pliki per partia.
    → Każda partia kończy się PD4 (checkpoint) → present_files.
    → Użytkownik wznawia przez wgranie checkpointu (PD5).

  Trigger wznawiania: plik "# CHECKPOINT ANALIZY" wgrany przez użytkownika
    → PD5 (parsuj checkpoint, odtwórz stan) → kontynuuj od właściwej partii.

  W każdej partii: kroki MD1/MD2/MD3 wykonuj per plik z bieżącej partii.
  Akumuluj wyniki w STAN_PARTII (PD3.3 z MOD-PORCJOWANIE-DOWODOW).
  Po ostatniej partii: PD6 (synteza finalna) → zasilenie MD4/MD5/MD6.
```

---

### BLOK C — Zakres analizy dowodowej

```
C1. Użytkownik pyta o luki w materiale / brakujące dowody / pokrycie przesłanek?
    TAK → dodaj: MD4

C2. W materiale pada data doręczenia, ogłoszenia wyroku lub inna data krytyczna?
    TAK → dodaj: MD5

C3. Potrzebny raport końcowy / podsumowanie dowodowe?
    TAK → dodaj: MD6
    DOMYŚLNY format wyjścia = dashboard interaktywny (FAZA 2 / KROK 4).
    Dashboard jest wzorcowym formatem raportu — generuj go zawsze gdy B1=TAK,
    bez pytania o format.

C4. Użytkownik prosi WYRAŹNIE o wersję szczegółową / dokument / plik / "jak
    LexAlpha" / ciągły tekst z nawigacją po sekcjach LUB chce przekazać analizę
    osobie trzeciej jako dokument?
    TAK → dodaj: MD-NARR jako DODATEK do dashboardu (nie zamiast).
    MD-NARR to wersja szczegółowa — generowana TYLKO na wyraźne żądanie,
    nigdy domyślnie. Jeśli C3=TAK i C4=NIE → tylko dashboard.
    Jeśli C4=TAK → wygeneruj dashboard (jeśli jeszcze nie istnieje w tej
    rozmowie) + MD-NARR, w tej kolejności.
```

---

### BLOK D — Zakres analizy pism (tylko jeśli A2=TAK)

```
D1. Materiał zawiera twierdzenia stron, narrację, sprzeczne wersje zdarzeń?
    TAK → dodaj: MP3 (kolizje i sprzeczności narracyjne)

D2. Użytkownik pyta o mocne/słabe strony, pozycję procesową, szanse?
    TAK → dodaj: MP4

D3. Użytkownik pyta o strategię ataku / obrony / riposty LUB sprawa
    ma wyraźnego przeciwnika procesowego?
    TAK → dodaj: MP5

D4. Potrzebna ocena prawna per roszczenie/zarzut, ciężar dowodu, znamiona?
    TAK → dodaj: MP2
    (UWAGA: MP2 zawiera katalog dziedzinowy — wczytaj MX przed MP2)

D5. Potrzebny raport końcowy z predykcją i rekomendacjami?
    TAK → dodaj: MP7

D6. Potrzebna matryca dowodowa (admissibility, chain of custody)?
    TAK → dodaj: MP8
```

---

### BLOK E — Moduły specjalistyczne (wczytuj TYLKO gdy sygnał obecny)

```
E1. Pytanie o „logikę zdarzeń" / „co z czego wynika" / „narrację procesową"
    / „powiązanie faktów" / łańcuchy przyczynowe LUB sprawa złożona ≥2 dok.?
    TAK → dodaj: MP13 (synteza faktyczna — 442 linie, wczytuj świadomie)

E2. Podejrzenie manipulacji, ukrytych motywacji, kłamstwa, zaplanowanego działania
    LUB sprawa karna LUB użytkownik pyta o profilowanie / zachowanie stron?
    TAK → dodaj: MP6 (techniki śledcze — 457 linii, wczytuj świadomie)

E3. Materiał dotyczy RODO, monitoringu pracownika, danych osobowych,
    dostępu do kont/urządzeń, art. 267 KK?
    TAK → dodaj: MP11

E4. Użytkownik pyta o koszty sądowe, opłacalność postępowania, próg ekonomiczny?
    TAK → dodaj: MP10

E5. W materiale pada wiele dat krytycznych / terminów sądowych do śledzenia?
    TAK → dodaj: MP12

E6. Konieczna kontrola jakości / audyt antyhalucynacyjny analizy?
    TAK → dodaj: MP9
```

---

### BLOK F — Wykrywanie dziedzin prawa

```
F1. Analiza dotyczy oceny prawnej (D4=TAK) LUB sprawa obejmuje wiele reżimów
    prawnych LUB użytkownik pyta o dziedziny prawa?
    TAK → wczytaj MX przed MP2
         view /mnt/skills/user/analizator-dowodow-v3/modules/MX-dziedziny.md
         Wynik MX uzupełni moduły specjalistyczne (np. MP11 dla RODO/CYBER,
         MP6 dla [KARNE-ZN], MD3b dla [PRAC-ROZW]).

F2. MX wykrył dziedzinę karną [KARNE-ZN]?
    TAK → aktywuj kwalifikator: prawo-polskie-v2 (rozbicie na znamiona)
```

---

### BLOK G — Tryb minimalny (kiedy NIE wczytywać modułów P)

```
Jeśli użytkownik zadaje JEDNO konkretne pytanie (np. „czy ten dowód jest silny",
„ile mam czasu na apelację", „co znaczy ten zapis") i NIE prosi o pełną analizę:
→ odpowiedz inline bez wczytywania modułów
→ wczytaj maksymalnie 1–2 moduły jeśli niezbędne do precyzyjnej odpowiedzi
→ NIE uruchamiaj dashboardu ani MP7/MD6

---

## BLOK G — Rejestr stron, świadków i osób trzecich (ZAWSZE przy A2=TAK)

```
G1. Materiał zawiera pisma procesowe, akta lub dokumenty z udziałem osób?
    TAK → wykonaj BLOK-STRONY przed MD3c:

    BLOK-STRONY — dla każdej osoby/podmiotu utwórz kartę:
    - Imię i nazwisko / nazwa (DOSŁOWNIE jak w dokumencie — nie normalizuj)
    - Rola procesowa: Powód / Pozwany / Pełnomocnik / Świadek / Biegły / Osoba trzecia / Organ
    - Status procesowy: strona czynna / bierna / świadek wnioskowany / świadek wzywany / organ
    - Umocowanie: pełnomocnictwo (data, zakres) / organ statutowy / brak danych
    - Dane kontaktowe / adres doręczeń (jeśli znane z materiału)
    - Alerty IDENT: jeśli ta sama osoba pojawia się pod różnymi zapisami → od razu
      przekaż do MD3c jako kandydat [DOUBT][IDENT] / [CROSS][IDENT]
    - Znaczenie dla sprawy: kluczowe / pomocnicze / tło

    Format karty w dashboardzie: zakładka "Strony i świadkowie"
    Kategorie kolorystyczne: Powód (niebieski) / Pozwana (bursztynowy) / Świadek (fioletowy) / Inne (szary)

G2. Materiał zawiera pisma jednej strony (analiza wyłącznie pism Pozwanej lub Powoda)?
    TAK → dodaj: BLOK-NAZW (kontrola nazewnictwa procesowego)

    Wczytaj tabelę nazewnictwa dla trybu sprawy:
    view /mnt/skills/user/analizator-dowodow-v3/modules/MOD-NAZEWNICTWO-STRON.md
    → Tabela T1 (cywilne procesowe), T2 (nieprocesowe), T3 (karne), T4 (wykroczenia)
       T5 (KPA), T6 (PPSA/WSA), T7 (pracownicze), T8 (egzekucja), T9 (zabezpieczenie)
       T10 (rodzinne)
    → Wymogi formalne: W1-W7 (art. 126 KPC, 187 KPC, 511 KPC, 57 PPSA i in.)
    → Wzory nagłówków: N1-N7 (pozew, odpowiedź, wniosek, skarga WSA, zawiadomienie, wezwanie)
    → Reguły C1 (test rodzaju gramatycznego) i C2 (test kompletności podmiotów)

    BLOK-NAZW — sprawdź konsekwentność nazewnictwa w pismach:
    [ ] Czy autor pisma konsekwentnie używa "Powód" / "Pozwany" / "Pozwana" (odpowiedni rodzaj)?
    [ ] Czy przez zamienne użycie zaimków ("on", "ona") podmiot zdania może być niejednoznaczny?
    [ ] Czy kwalifikacje prawne tej samej osoby/kwoty są spójne między pismami (np. "zaliczka"
        vs "nienależnie pobrane" to dwie różne kwalifikacje tej samej kwoty — wzajemnie sprzeczne)?
    [ ] Czy autor pisma odpiera twierdzenie, które strona przeciwna nigdy nie postawiła
        (sygnalizując tym Sądowi argument, który chce zneutralizować)?
    [ ] Czy wniosek o przesłuchanie / pominięcie dotyczy właściwej osoby / właściwej roli procesowej?
    [ ] Czy strona pozwana jest konsekwentnie opisywana jako spółka / osoba fizyczna zgodnie z KRS?

    Format alertów: NZ-1, NZ-2... z cytatem, problemem, skutkiem i rekomendacją
    Renderuj w dashboardzie jako zakładka "Nazewnictwo procesowe"
```

---

## BLOK J — Lapsusy autorskie [LAPSUS] (ZAWSZE przy A2=TAK, gdy autor pisma znany)

```
Wczytaj moduł przed wykonaniem:
view /mnt/skills/user/analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md
    view /mnt/skills/user/analizator-dowodow-v3/modules/MOD-NAZEWNICTWO-STRON.md
    (tabele T1-T10 wymagane dla KROK L0 i KROK L1 w MOD-LAPSUS-AUDYT)

Moduł zawiera pełny protokół L0-L5 + 22 typy lapsusów w 4 kategoriach:
  Kategoria I  — Podmiot: [LA-RODZAJ][LA-PODMIOT][LA-PODMIOT-POWTORZONY]
                           [LA-NAZWA-PODMIOT][LA-OSOBA-MYLONA]
  Kategoria II — Kwalifikacja: [LA-KWALIF][LA-KWALIFIKACJA-PRAWNA]
                                [LA-KWALIFIKACJA-TECHNICZNA][LA-LEGAL][LA-BRAK-KONKRETYZACJI]
  Kategoria III— Logika: [INTRA-SAMOOBALA][LA-PRZYZNANIE-KORZYSTNE][LA-TEZA-DOWODOWA]
                          [LA-INTENCJA][LA-NARR][LA-ZAKRES-DOWODOWY]
  Kategoria IV — Dokument: [LA-KOSZTY][LA-DATA][LA-DATA-PRZYSZLA][LA-KWOTA]
                             [LA-KWOTA-SLOWNIE-CYFRAMI][LA-ODRECZNIE][LA-CHRONOLOGIA]
                             [LA-MIESIAC][LA-PODMIOT-ROLA][LA-SYGNATURA]

Pole wzorzec karty LA: SZABLON | JEDNOSTKOWY | SYSTEMOWY
  SYSTEMOWY → KROK L5: tabela wzorca dla Sądu (gdy ≥2 błędy tego samego typu)

Wynik → tablica lapsusy[] w KROK 4 (dashboard, zakładka "Lapsusy")
Eksport: JSON + MD + CSV
```

---

## BLOK H — Kwestie sporne DIS z drill-down (gdy D4=TAK lub D3=TAK)

```
H1. Sprawa zawiera zidentyfikowane roszczenia / zarzuty / przedmioty sporu?
    TAK → wykonaj BLOK-DIS dla każdej kwestii spornej:

    BLOK-DIS — dla każdej kwestii spornej (DIS01, DIS02...) utwórz rekord:
    - Tytuł kwestii
    - Fakty bezsporne / common ground (co obie strony de facto przyznają)
    - Stanowisko Powoda (z materiału lub "nieznane — brak pisma Powoda")
    - Stanowisko Pozwanej
    - Stosowne przepisy prawne:
      ⛔ HARDGATE: każdy przepis musi mieć etykietę "wymaga weryfikacji w ISAP"
      Nie cytuj treści przepisu z pamięci — tylko art. + ustawa + oznaczenie HARDGATE
    - Rekomendacje procesowe: konkretne wnioski, żądania, argumenty
    - Przycisk drill-down: "Głębsza analiza DIS-XX ↗" → sendPrompt

    Format w dashboardzie: zakładka "Kwestie sporne DIS" z accordion (kliknij → rozwiń)
    Priorytet kwestii: KRYTYCZNA (blokuje główne roszczenie) / ISTOTNA / POBOCZNA
```

---

## BLOK I — Import / Eksport raportu

```
I0. MOD-WIDGET-IO (OBOWIĄZKOWE — wczytaj przed wygenerowaniem dashboardu):
    view /mnt/skills/user/shared/MOD-WIDGET-IO.md
    → wbuduj pasek IO w nagłówek dashboardu (powyżej zakładek)
    → IO_SKILL_ID='analizator-dowodow-v3', IO_CASE_ID=CASE_ID
    → matryca: Export JSON ✅ MD ✅ CSV ✅ | Import JSON ✅
    → ioGetState(): { evidence, contradictions, persons, nazewnictwo,
                      dis_items, coverage_data, gaps, recs, lapsus }
    → ioSetState(s): odtwórz dashboard z wczytanego JSON (wszystkie zakładki)

I1. Dashboard wygenerowany (B1=TAK i KROK 4 wykonany)?
    TAK → dodaj przyciski eksportu do dashboardu:

    EKSPORT-JSON: serializacja tablic evidence[], contradictions[], persons[], nazewnictwo[],
                  dis_items[], coverage_data[], gaps[], recs[] do pliku .json
                  → Blob + URL.createObjectURL + link.click()

    EKSPORT-MD:   generowanie raportu Markdown z sekcjami:
                  # Analiza dowodów — [sygnatura] — [data]
                  ## Strony i świadkowie
                  ## Rejestr dowodów
                  ## Sprzeczności INTRA / CROSS / IDENT
                  ## Nazewnictwo procesowe
                  ## Kwestie sporne DIS
                  ## Pokrycie przesłanek i luki
                  ## Rekomendacje procesowe
                  Każdy przepis → ⚠ [WYMAGA WERYFIKACJI ISAP]

    EKSPORT-CSV:  tabela evidence[] jako CSV (id, nazwa, typ, poziom, score, alerty, opis)

    Pozycja przycisków: pasek eksportu w nagłówku dashboardu (obok przycisku "Sporządź pismo")
    Ikony: JSON=💾  MD=📄  CSV=📊
```

---

---

## KROK 3 — WYKONANIE

Po ustaleniu listy modułów z KROK 2:

1. Wczytaj moduły **jeden po drugim** w kolejności:
   `MX (jeśli F1) → MD1 → MP0 → MP1 → MD2 → MD3* → MP2 → MP3 → MD4 → MP4 → MP5 → MD5 → MP8 → MP10→MP11→MP12 → MP13 → MP6 → MD6/MP7 → MD-NARR → MP9`

2. Prowadź analizę zgodnie z instrukcjami każdego wczytanego modułu.

3. Moduły **nigdy nie wczytywane domyślnie** (tylko gdy sygnał z BLOK E lub C4):
   - MP6 — techniki śledcze (457 linii)
   - MP13 — synteza faktyczna (442 linie)
   - MP11 — RODO/cyber (292 linie)
   - MP12 — terminy kalendarz (256 linii)
   - MP10 — koszty (203 linie)
   - MP9 — kontrola jakości (103 linie)
   - MD-NARR — raport narracyjny (tylko C4=TAK — alternatywny format wyjścia)

---

## KROK 4 — DASHBOARD (jeśli B1=TAK)

```
view /mnt/skills/user/analizator-dowodow-v3/assets/dashboard.html
→ show_widget(widget_code=<treść>, title="analizator_dowodow_dashboard",
              loading_messages=["Buduję dashboard dowodów...",
                                "Wczytuję sprzeczności...",
                                "Kalkuluję pozycję procesową..."])
```

Tablice do wypełnienia: `evidence[]` · `alerts_data{}` · `coverage_data[]`
· `gaps[]` · `terminy[]` · `recs[]` · `contradictions[]` (typy: `legal|intra|inter|doubt`) · `dziedziny[]`
· `persons[]` (BLOK G — strony/świadkowie) · `nazewnictwo[]` (BLOK G — NZ-N) · `dis_items[]` (BLOK H — kwestie sporne) · `lapsusy[]` (BLOK J — błędy autorskie LA-N z typem/autorem/severity/skutkiem/statusem weryfikacji) · 22 typy LA — patrz MOD-LAPSUS-AUDYT.md (w tym nowe: [LA-PODMIOT-POWTORZONY][LA-BRAK-KONKRETYZACJI]) · pole wzorzec: SZABLON|JEDNOSTKOWY|SYSTEMOWY · `mode` (aktywne tryby: 'A'|'B'|'C'|'A+B'|'B+C' — string, addytywny)

---

## OBSŁUGA PLIKÓW

| Typ | Poziom | Sygnały dla routera |
|-----|--------|---------------------|
| PDF protokół urzędowy | A | — |
| Zdjęcie dokumentu | C | pytaj o oryginał |
| E-mail / SMS | C | sprawdź metadane |
| Nagranie | C | **B3=TAK** (MD3b obowiązkowy) |
| Skan umowy jako dowód | C | B4=TAK + B3=TAK |
| Pismo procesowe | — | **A2=TAK** |
| Akt oskarżenia | — | A2=TAK + **F2=TAK** (kwalifikator karny) |

---

## INTEGRACJE

| Kiedy | Skill |
|-------|-------|
| Dokument kontraktowy (nie jako dowód) | `analizator-umow-v1` |
| Głębsza analiza karna | `analiza-sadowa-v6` |
| Pismo po analizie | `pisma-procesowe-v3` |
| Orzecznictwo | `orzeczenia-sadowe-v2` |
| Weryfikacja przepisu | `analizator-przepisow-v2` |
| Chronologia wielu dok. | `chronologia-sprawy-v1` |
| Świadkowie | `przesluchanie-swiadkow-v2` |
| Raport stanu sprawy (widget interaktywny) | `raport-sytuacyjny-v2` (po MD6/MP7) |
| Wersja szczegółowa raportu jako dokument .md (DODATEK do dashboardu, na żądanie) | MD-NARR (ten skill) |
| Raport dla klienta (zewnętrzny, LAIK/uproszczony) | `raport-klienta-v1` |
| Eksport .docx | HYBRID-VALIDATION → `docx` |

---

## ZASADY STYLU

**Zawsze:** ocena siły = liczba + uzasadnienie · alert = `[⚠ KOD-N]` + podstawa
+ rekomendacja · sprzeczność = cytat + lokalizacja + status · luka = konkretne
uzupełnienie · terminy zawite oznaczone ⚠ ZAWITY · przepisy weryfikuj w ISAP.

**Nigdy:** ocena bez kryteriów · pominięcie alertu legalności nagrań · mylenie
terminów instrukcyjnych z zawitymi · orzeczenia z pamięci · sugerowanie że
analiza zastępuje poradę prawnika · LEG-CONTRA bez weryfikacji w ISAP.

**Progi jakości — analiza niedopuszczalna gdy:** wnioski bez źródła · cytaty
mieszane z parafrazą · nieweryfikowane orzeczenia · hipoteza śledcza jako fakt
· pominięty najmocniejszy kontrargument · łańcuch MP13 bez ID z MP1 · narracja
bez wersji przeciwnika · raport bez testu spójności (MP13 §13.7) gdy MP13 aktywny.

---

## REGUŁA PRECYZJI DETALU — obowiązkowa przy każdej analizie

### §P1 — Sprzeczności wewnątrz jednej strony (INTRA-CONTRA)

Przy analizie wielodokumentowej każda strona może zmienić narrację między pismami.
Obowiązek: porównywać twierdzenia tej samej strony **pismo po piśmie**, nie tylko
twierdzenia stron między sobą. Sprzeczność wewnętrzna = zmiana wersji przez tę
samą stronę w różnych dokumentach/terminach.

Przykład kanoniczny (sprawa VII P 94/25):
- Odp. na pozew (kwiecień 2025): konto = `m.wiatrak.humanpark@gmail.com`
  → Pozwana kwalifikuje jako konto pracownicze na domenie humanpark.
- Pismo procesowe (czerwiec 2025): „Powód stworzył PRYWATNEGO maila z dopiskiem
  @humanpark.pl" → Pozwana zmienia kwalifikację na prywatne konto Powoda.
- WYNIK: dwie wykluczające się charakterystyki tego samego konta w dwóch pismach
  tej samej strony → INTRA-CONTRA klasy KRYTYCZNEJ.

### §P2 — Checklist precyzji detalu

Przed wygenerowaniem każdej zakładki „Sprzeczności" wykonaj:

```
[ ] Czy ta sama strona zmienia opis faktyczny między pismami?
[ ] Czy daty w dokumentach są spójne (np. data podpisania vs data odbioru)?
[ ] Czy kwoty są identyczne we wszystkich dokumentach (np. 1 000 zł vs 1 060 zł)?
[ ] Czy nazwy własne (adresy e-mail, nazwy firm, imiona) są identyczne wszędzie?
[ ] Czy kwalifikacja prawna faktu jest spójna (np. zaliczka vs nienależne środki)?
[ ] Czy domena/serwer konta mailowego jest spójna z jego kwalifikacją jako służbowe?
[ ] Czy chronologia zdarzeń jest możliwa (daty → terminy → działania)?
[ ] Czy twierdzenia o świadkach są spójne (rola, zależność, adres doręczeń)?
```

### §P3 — Format INTRA-CONTRA w dashboardzie

Sprzeczności wewnętrzne oznaczać typem `intra` (dedykowany typ — nie `inter`):
- `[INTRA]` — `type:'intra'` — zmiana narracji tej samej strony
- `[CROSS]` — `type:'inter'` — sprzeczność między twierdzeniami różnych stron
- `[LEG]`   — `type:'legal'` — sprzeczność z przepisem prawa
- `[DOUBT]` — `type:'doubt'` — wątpliwość nierozstrzygnięta

Każda INTRA-CONTRA musi zawierać:
1. Cytat z dokumentu pierwszego (z lokalizacją: str./data pisma)
2. Cytat z dokumentu drugiego (z lokalizacją: str./data pisma)
3. Konkretną rozbieżność (co dokładnie się zmienia: słowo, liczba, kwalifikacja)
4. Rekomendację procesową: jak atakować tę sprzeczność na rozprawie

---

## TRYB ETAPOWY DLA OBSZERNYCH MATERIAŁÓW

Przy dużej liczbie dokumentów nie generuj od razu konkluzji końcowej. Dziel analizę na etapy:

```
1. inwentarz dokumentów,
2. ekstrakcja faktów,
3. matryca dowodowa,
4. sprzeczności i luki,
5. ocena siły dowodowej,
6. tezy procesowe,
7. raport końcowy.
```

Jeżeli analiza ma prowadzić do pisma procesowego, wynik przekaż do `pisma-procesowe-v3`,
a nie twórz finalnego pisma bez audytu.
---

## DODATEK V10 — CONTRADICTION INTELLIGENCE

Przy analizie pism przeciwnika obowiązkowo uruchom moduły V10:
- contradiction-intelligence-engine-v10,
- self-destructive-admissions-engine-v10,
- timeline-conflict-engine-v10,
- cross-pleading-consistency-engine-v10,
- strategic-theory-collapse-engine-v10,
- judicial-credibility-simulation-engine-v10.

Hard gate: nie przygotowuj repliki, odpowiedzi, apelacji ani zażalenia bez sprawdzenia, czy przeciwnik nie zawarł w swoich pismach twierdzeń wzajemnie sprzecznych, dorozumianych przyznań albo twierdzeń szkodliwych dla własnej teorii sprawy.

---

## Integracja z kancelaryjnym jądrem shared

Jeżeli wynik tego skilla ma służyć do pisma, strategii procesowej, oceny ryzyka albo decyzji terminowej, wczytaj właściwe moduły shared:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach. Lokalne moduły mogą tylko doprecyzować analizę dziedzinową.

---

## Twarda integracja dowodowa shared

Przy analizie dowodów obowiązkowo wczytaj:

```text
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
```

Raport dowodowy musi wskazywać: fakt istotny, przesłankę prawną, dowód główny, dowody wspierające, lukę, kontrargument i ryzyko pominięcia.

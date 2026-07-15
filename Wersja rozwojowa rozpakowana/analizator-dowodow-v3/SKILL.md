---
name: analizator-dowodow-v3
version: "5.16.0"
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
dependencies:
  required:
    - shared
    - MOD-SKAN-DOWODOW-KOMPLETNY
    - MOD-STEP-TRACKER
  optional:
    - analizator-umow-v1
    - analiza-sadowa
    - pisma-procesowe
    - orzeczenia-sadowe
    - analizator-przepisow
    - chronologia-sprawy
    - przesluchanie-swiadkow
    - raport-sytuacyjny
    - raport-klienta
validation:
  required_gates:
    - PRAWO-HARDGATE
    - SD-VER-GATE-AD
    - STEP-TRACKER-AD
pipeline:
  stages:
    - AD-KROK0-BLOKADA
    - AD-KROK0a-MODE
    - AD-KROK0b-SDVER
    - AD-KROK0c-STINIT
    - AD-KROK1-INTAKE
    - AD-KROK2-ROUTER
    - AD-BLOKG-STRONY
    - AD-BLOKJ-LAPSUSY
    - AD-BLOKH-DIS
    - AD-KROK3-WYKONANIE
    - AD-KROK4-DASHBOARD
changelog:
  - "5.15.0 (2026-07-15, F-7 / ZASADA 11 — audyt proceduralny): dodano
    BLOK D0 TEZA-GATE, obowiązkowy przed BLOK D (D1-D6) — rekonstrukcja
    jednym zdaniem tezy centralnej per strona z materiału, zanim ocenione
    zostaną mocne/słabe strony (D2), ocena prawna (D4) lub raport końcowy
    (D5). Przyczyna: skill nie miał NIGDZIE (grep 0 wyników) mechanizmu
    rekonstrukcji tezy — analogiczny wzorzec braku jak w
    przesluchanie-swiadkow-v2-min90 przed naprawą 3.6 (IMPORTED-QUESTIONS-
    GATE). Pozostałe 3 wzorce z ZASADY 11 (bramki reaktywne, skan
    dokumentów, milczące przyjmowanie ustaleń) już były pokryte: KROK 0b
    SD-VER (HARD GATE od startu), KROK 0c ST-INIT (jawne zgłaszanie
    pominięć). Pełny opis: audyt-systemu-v4/AUDIT-JOURNAL.md,
    AUDYT-2026-07-15e."
  - "5.14.3 (2026-07-14, sprawa XI P 27/26 — dziedziczenie naprawy SD-GATE-TRUNC):
    Ten skill wywołuje `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` bezpośrednio jako
    HARD GATE w KROK 0b (SD-VER) — patrz linia ~182. Naprawa wprowadzona w
    module współdzielonym (1.4.0 → 1.5.0: nowa bramka SD-GATE-TRUNC, wykrywanie
    i obowiązkowe domykanie znaczników `< truncated lines X-Y >` zwracanych
    przez narzędzie `view` przed ekstrakcją faktów) jest dziedziczona
    automatycznie, bez zmian w logice tego pliku — zgodnie z zasadą unikania
    duplikacji (CHECKLIST-DEDUP). Wersja podbita wyłącznie dla odnotowania
    zależności w dzienniku audytu. Pełny opis incydentu:
    `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-14b."
  - "5.14.2 (2026-07-12, runda 2 — redukcja kosztu kontekstu): pełna
    historia changelog (22 wpisy, 4.0.0...5.14.1) wyniesiona 1:1 do
    references/CHANGELOG.md — nic nie usunięto, tylko przeniesiono z
    pola YAML `changelog` (zawsze wczytywanego z SKILL.md) do pliku
    ładowanego na żądanie.
    `view /mnt/skills/user/analizator-dowodow-v3/references/CHANGELOG.md`
    po pełną historię."
  - "5.14.1 (AUDYT SYSTEMU 2026-07-12d — rozwiązanie WARN 'nakładanie
    kompetencji z analiza-sadowa-v6' z audytu silnika): dodano jawną notę
    'Granica kompetencji vs. analiza-sadowa-v6' zaraz po nagłówku (linia
    ~113). Sam ten skill nie duplikował tabel terminów/orzecznictwa (już
    poprawnie wskazywał na shared/HYBRID-VALIDATION i shared/terminy w
    MP12-terminy.md) — źródłem realnej duplikacji był analiza-sadowa-v6,
    naprawiony równolegle w tej samej sesji (v6.1). Nie zmieniono logiki
    pipeline'u, wyłącznie dokumentację granicy odpowiedzialności."
---

# Analizator Dowodów Procesowych v5.1

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Przed każdą analizą z powołaniem na przepisy lub sygnatury: `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

> **Zasada nadrzędna:** Nigdy nie oceniam bez wystarczających informacji.
> Pytam zanim wystawię ocenę. Każdy alert zawiera podstawę prawną.
> Role: sędzia neutralny · pełnomocnik przeciwnika · Twój pełnomocnik
> · analityk śledczy (hipotezy tylko jako `[H-ŚLEDCZA]`).

> **Granica kompetencji vs. analiza-sadowa-v6:** oba skille pokrywają
> częściowo ten sam obszar (dowody, terminy, orzecznictwo, ocena szans) —
> świadomy, udokumentowany stan, rozdzielany przez router
> (`prawny-router-v3`, tabela PRIMARY/SECONDARY/FALLBACK). Ten skill jest
> PRIMARY dla głębokiej analizy dowodowej wieloplikowej (hierarchia A–D,
> macierz dowód×teza, proweniencja, 25 dziedzin MX) i analizy śledczej;
> `analiza-sadowa-v6` jest PRIMARY dla executive summary szans w sprawie i
> audytu błędów pełnomocnika. Terminy procesowe (MP12) i hierarchia
> orzecznictwa korzystają z tych samych plików kanonicznych
> `shared/terminy.md` / `shared/ORZECZENIA-HIERARCHIA.md` co
> `analiza-sadowa-v6` — nie utrzymuj tu równoległej kopii tych tabel.

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

⛔ BLOK-C-FSL: PO SD-VER, PRZED KROK 1 — gdy ≥1 teza dowodowa:
  view /mnt/skills/user/shared/MOD-FSL-DOKUMENTY.md
  → FSL-D-INIT (macierz T[n])
  → FSL-D-SCAN per każda teza: rozłóż na twierdzenia atomowe TC[n,k];
    per każde TC: przeszukaj WSZYSTKIE D[id] z SD-FAKTY (zakaz wnioskowania z nazwy pliku);
    klasyfikuj ✅/⚠️/⬛ (🔴/🟠/🟡)
  → FSL-D-ORPHAN: D[id] z 0 przypisań = kandydaci na nowe tezy
  → FSL-D-REPORT: macierz + luki per klasa
  → Luka 🔴 = STOP (decyzja a/b/c/d); luka 🟠 = kontynuuj z żądaniem ewentualnym
  ⛔ ZAKAZ przejścia do MD1/BLOK-A bez FSL-D-REPORT
```

---

## KROK 0c — ST-INIT: REJESTR KROKÓW (MOD-STEP-TRACKER) ⛔ OBOWIĄZKOWE

> Dodano w audycie 5.13.0. Przyczyna: skill miał już poprawnie wpiętą bramkę
> DOWODOWĄ (SD-VER w KROK 0b), ale brakowało mu bramki PROCEDURALNEJ —
> żaden mechanizm nie raportował użytkownikowi, gdy w wieloetapowym routerze
> (KROK 2 → BLOK A-J → KROK 3) pominięto blok, który powinien być obowiązkowy
> (np. BLOK G/J przy A2=TAK). Ten sam typ luki naprawiono już wcześniej w
> `pisma-procesowe-v3` i `przesluchanie-swiadkow-v2-min90` (audyt 3.13) —
> tutaj stosujemy identyczny mechanizm.

```
Wykonaj PO KROK 0b (SD-VER = KOMPLET), PRZED KROK 1.

ST-INIT: view /mnt/skills/user/shared/MOD-STEP-TRACKER.md (jeśli REJESTR
jeszcze nie zainicjowany w tej sesji) → zainicjuj z pozycjami dedykowanymi
temu skillowi:

  "AD-KROK0"  — KROK 0 blokada wstępna (przekierowanie do analizator-umow?)
  "AD-KROK0a" — KROK 0a wykrycie trybu MODE (A/B/C)
  "AD-KROK0b" — KROK 0b SD-VER skan kompletności plików (już HARD GATE)
  "AD-KROK1"  — KROK 1 intake i widget-kreator
  "AD-KROK2"  — KROK 2 centralny router (BLOK A-F diagnostyka)
  "AD-BLOKG"  — BLOK G rejestr stron/świadków (OBOWIĄZKOWY gdy A2=TAK)
  "AD-BLOKJ"  — BLOK J lapsusy autorskie [LAPSUS] (OBOWIĄZKOWY gdy A2=TAK)
  "AD-BLOKH"  — BLOK H kwestie sporne DIS (gdy D3=TAK lub D4=TAK)
  "AD-KROK3"  — KROK 3 wykonanie modułów MD/MP z listy KROK 2
  "AD-KROK4"  — KROK 4 dashboard (gdy B1=TAK)

Każdy krok/BLOK oznaczony jako obowiązkowy w KROK 2 (np. "TAK → dodaj: X"),
który ostatecznie nie zostanie wykonany, musi zmienić status na
"⚠️ POMINIĘTY" z powodem — NIE wolno cicho pominąć bloku diagnostycznie
wymaganego i przejść dalej bez odnotowania.

ST-REPORT: przed KROK 4 (dashboard) lub przed dostarczeniem raportu MD-NARR
— jeśli REJESTR zawiera ≥1 "⚠️ POMINIĘTY" — wyświetl raport pominięć
(format z shared/MOD-STEP-TRACKER.md FAZA 2) i czekaj na decyzję użytkownika
(a: kontynuuj mimo braków / b: wykonaj brakujące kroki), zanim wywołasz
show_widget/present_files.

⛔ ZAKAZ: generowanie dashboardu lub raportu końcowego bez wyświetlenia
stanu REJESTRU (pełny ✅ lub z jawnym ⚠️ POMINIĘTY) — patrz FAZA 3
ST-FINAL w shared/MOD-STEP-TRACKER.md.
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

### BLOK D0 — TEZA-GATE (obowiązkowe, PRZED D1-D6 — naprawa F-7/ZASADA 11)

```
⛔ Zanim odpowiesz na pytania D1-D6, zrekonstruuj JEDNYM ZDANIEM per strona
tezę centralną wynikającą z materiału: czego strona żąda/twierdzi i na
jakiej podstawie. Zapisz to jawnie w odpowiedzi — nie tylko w rozumowaniu
wewnętrznym.

Powód: bez tego punktu odniesienia ocena mocnych/słabych stron (D2), analiza
prawna per roszczenie (D4) czy raport końcowy (D5) mogą oceniać argumenty
w oderwaniu od tego, co pismo FAKTYCZNIE twierdzi — ryzykując ocenę
powierzchowną (np. na podstawie tonu czy objętości argumentacji, nie jej
rzeczywistego związku z tezą) lub pominięcie, że pismo broni innej tezy niż
się wydaje z pierwszego wrażenia.

Jeśli materiał zawiera kilka wątków/roszczeń → osobna teza per wątek, nie
jedna uśredniona. Jeśli strony są >1 (spór dwustronny) → teza każdej strony
osobno, nawet jeśli są sprzeczne.

To nie zastępuje D1 (kolizje narracyjne) ani MP2 (ocena prawna) — to punkt
odniesienia, do którego D1-D6 się odnoszą.
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
    view /mnt/skills/user/shared/NAZEWNICTWO-STRON.md
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
    view /mnt/skills/user/shared/NAZEWNICTWO-STRON.md
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

## KROK 3B — SYNTEZA: ASPEKTY → PRZEPISY → SELEKCJA DOWODÓW (naprawa audytu 2026-07-12c)

> ⛔ Ten krok istniał wcześniej pod nazwą „KROK 4a" (z podkrokami 4a.1–4a.6),
> zanim analizator-dowodow-v3 został przebudowany na router KROK 2/3/4
> (MD/MP-moduły). Nazwa „KROK 4a" **nie istnieje już w tym pliku**, ale
> pozostała rozsiana po innych skillach (`przesluchanie-swiadkow-v2-min90`,
> `pisma-procesowe-v3/W1-SZCZEGOLY.md`, `shared/MOD-KONTEKST-SESJI.md`,
> `shared/MOD-MAPA-PRZEPISOW.md`, `shared/MOD-SELEKCJA-DOWODOW.md`,
> `shared/MOD-PRIORYTETY-ASPEKTOW.md`, `prawny-router-v3/SKILL.md`,
> `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`) jako odwołanie do
> punktu, który przestał istnieć pod tą nazwą. **KROK 3B to ten sam punkt
> integracji, odtworzony pod nazwą zgodną z aktualną strukturą** —
> wykonywany PO zakończeniu KROK 3 (a w nim: po MD6/MP7), PRZED KROK 4
> (dashboard), niezależnie od tego czy B1=TAK (dashboard jest opcjonalny,
> KROK 3B nie jest).

```
KROK 3B.1 — ASPEKTY GŁÓWNE/POBOCZNE:
  view /mnt/skills/user/shared/MOD-PRIORYTETY-ASPEKTOW.md
  Wykonaj checklistę klasyfikacji/priorytetyzacji na podstawie wyniku KROK 3
  (w tym MD6/MP7) → wynik: aspekty_glowne[], aspekty_poboczne[]

KROK 3B.2 — MAPOWANIE NA PRZEPISY (dawne "KROK 4a.3"):
  view /mnt/skills/user/shared/MOD-MAPA-PRZEPISOW.md
  Zmapuj aspekty z KROK 3B.1 na przepisy kandydujące (oznaczenia
  ⚠️ [akt] art. [X] (NIEWERYFIKOWANE) — bez wywoływania ISAP na tym etapie)
  → wynik: mapa_przepisow{}

KROK 3B.3 — SELEKCJA DOWODÓW (dawne "KROK 4a.5"):
  view /mnt/skills/user/shared/MOD-SELEKCJA-DOWODOW.md
  Na podstawie mapa_przepisow{} z KROK 3B.2 dobierz dowody do każdej tezy,
  oznacz ryzyko krzyżowe (HARDGATE-SD-01/02 z tego modułu obowiązują)
  → wynik: selekcja_dowodow{}, ostrzezenia_krzyzowe[]

KROK 3B.4 — EKSPORT PAKIETU KONTEKSTU:
  Złóż wynik w jeden obiekt do przekazania dalej (do pisma-procesowe-v3 W1.3,
  przesluchanie-swiadkow-v2-min90 KROK 0, MOD-KONTEKST-SESJI EXPORT):
    kontekst_sprawy = {
      aspekty_glowne, aspekty_poboczne,   ← KROK 3B.1
      mapa_przepisow,                       ← KROK 3B.2
      selekcja_dowodow,                     ← KROK 3B.3
      ostrzezenia_krzyzowe,                 ← KROK 3B.3
      wyniki_metod,                         ← BLOK E2a-j / MD-moduły metod (streszczenia)
      chronologia_wstepna                   ← TYLKO jeśli chronologia-sprawy-v1 wykonana osobno
    }
```

**Uwaga zgodności wstecznej:** wszystkie zewnętrzne odwołania do „KROK 4a" /
„KROK 4a.3" / „KROK 4a.5" w innych skillach zostały w tym samym audycie
zaktualizowane odpowiednio do „KROK 3B" / „KROK 3B.2" / „KROK 3B.3" — patrz
`audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-12c.

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
⚠️ DODANE 2026-07-15 (na wyraźne polecenie użytkownika): każdy cytat z
orzeczenia LUB z interpretacji znalezionej online (komentarz, artykuł,
interpretacja urzędowa) MUSI mieć lokalizację w źródle (strona/teza/punkt/
akapit) + kotwicę techniczną gdy platforma na to pozwala — pełny standard
w `orzeczenia-sadowe-v2/SKILL.md` Zasada 2B. "Lokalizacja" w linii wyżej
("sprzeczność = cytat + lokalizacja + status") oznacza TO SAMO dla
sprzeczności między dokumentami sprawy co Zasada 2B dla źródeł
zewnętrznych — jeden spójny standard w całym systemie.

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

## BLOK-KONSEKWENCJE — warstwa skutków prawnych tezy

> **Trigger:** ZAWSZE po ustaleniu tez procesowych (MODE A/B/C).
> **Cel:** każda teza musi generować ≥2 automatyczne skutki prawne.
> **Zasada:** bez tej warstwy pismo broni tez, ale nie buduje strategii.
> **Źródło:** DTA W6 (warstwa konsekwencji).

Dla każdej tezy T-X z dashboardu wykonaj trzy kroki:

```
KROK KC1 — Skutek bezpośredni:
  "Co ta teza UDOWADNIA w sensie prawnym?"
  → wskaż normę prawną którą teza realizuje (z W1.4 / ISAP ⚠ HARDGATE)
  → format: C-X.1: [skutek] → [norma]

KROK KC2 — Skutek pośredni:
  "Jakie INNE ROSZCZENIA lub ARGUMENTY wzmacnia udowodnienie tej tezy?"
  → myśl o tezie jako środku do celu, nie celu samym w sobie
  → format: C-X.2: [skutek wtórny] → [roszczenie / argument]

KROK KC3 — Skutek strategiczny (gdy nieoczywisty):
  "Jak udowodnienie tej tezy ZMIENIA pozycję procesową?"
  → wpływ na ciężar dowodu, zakres pism, orzecznictwo, ugodę
  → format: C-X.3: [zmiana pozycji] (opcjonalny)
```

Przykład (sprawa pracownicza — wzorzec VII P 94/25):

```
T-1: Ciągłość stosunku pracy / tożsamość pracodawcy rzeczywistego
  C-1.1: Pracodawca rzeczywisty = HPG → żądanie zapłaty od HPG (art. 22 §1 KP)
  C-1.2: Ciągłość umów = czwarta umowa terminowa → art. 25¹ KP (bezterminowa)
  C-1.3: Obciąża HPG całością roszczeń: wynagrodzenie, PFRON, gotowość

T-2: Gotowość do pracy — niedopuszczenie po stronie pracodawcy
  C-2.1: Prawo do wynagrodzenia za przestój (art. 81 §1 KP) od daty niedopuszczenia
  C-2.2: Przelicza ciężar dowodu — pracodawca musi wykazać brak gotowości powoda
  C-2.3: Wzmacnia T-1: osobisty akt Prezesa = organ z art. 31 KP → tożsamość podmiotu
```

**Zasada:** Bez ≥2 konsekwencji per teza → BLOK-KONSEKWENCJE niekompletny.
Teza bez konsekwencji nie trafia do W1.3 pisma-procesowe-v3 jako GOTOWA.

**Integracja:**
- Konsekwencje C-X.1 → sekcja petitum pisma (co żądamy i od kogo)
- Konsekwencje C-X.2 → sekcja uzasadnienia (alternatywne podstawy)
- Konsekwencje C-X.3 → W2.1 MOD-TIMING / MOD-STRATEGIA-WYBOR

**Dashboard:** nowa tablica `consequences[]` per teza (id tezy, C-X.1, C-X.2, C-X.3, norma).

## BLOK-ATAK-NA-DOWOD — Atak na dowód jako obiekt procesowy

> **Trigger:** gdy w sprawie są dowody przeciwnika (MP5 perspektywa = TAK)
>   LUB gdy BLOK-PROWENIENCJA wykrył P! (alert autentyczności/custody)
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-ATAK-NA-DOWOD.md`
> **Cel:** systematyczna analiza 12 wektorów ataku na dowody przeciwnika
>   + procedura obrony własnych dowodów przed tymi samymi atakami.

```
12 WEKTORÓW ATAKU (AD-1..AD-12) — skrót (szczegóły w MOD-ATAK-NA-DOWOD.md):
  [AD-1]  Autentyczność: metadane, podpis, fałszerstwo, deepfake
  [AD-2]  Łańcuch przechowywania (custody): przerwy, dostęp, integralność
  [AD-3]  Relewantność: fakt bez znaczenia / już udowodniony (art. 227 KPC)
  [AD-4]  Forma: kopia bez oryginału / bez poświadczenia (art. 129 §1 KPC)
  [AD-5]  Zakaz ustawowy: nagrania (art. 168a KPK), tajemnica, RODO, art. 174 KPK
  [AD-6]  Wiarygodność treści: retrospektywne, interes autora, sprzeczność
  [AD-7]  Zakres wniosku: nieokreślony, nieprzydatny (art. 235¹ KPC)
  [AD-8]  Prekluzja: spóźniony (art. 235² KPC / art. 170 §1 pkt 5-6 KPK)
  [AD-9]  Kontrdowód aktywny: KD-1 dokument, KD-2 biegły, KD-3 świadek...
  [AD-10] Dowody elektroniczne: brak metadanych, hash, kontekst, AI/deepfake
  [AD-11] Jednostronny ex parte: wytworzony przez stronę na potrzeby sporu
  [AD-12] Systemowy: sprzeczność, cherry-picking, koordynacja, luki

PROCEDURA ADIS (ofensywna — atakowanie dowodów przeciwnika):
  ADIS-1 → inwentaryzacja dowodów przeciwnika
  ADIS-2 → screening AD-1..AD-12 per dowód
  ADIS-3 → priorytety 🔴/🟠/🟡/🟢
  ADIS-4 → instrument procesowy (wniosek o oddalenie / biegły / oryginał)
  ADIS-5 → sekcja w piśmie "ZARZUTY CO DO MATERIAŁU DOWODOWEGO"

PROCEDURA SHIELD (obronna — szczepienie własnych dowodów):
  S Secure → oryginał + metadane + hash
  H Harden → triangulacja ≥2 klas (P+ z MOD-PROWENIENCJA)
  I Integrate → każdy dowód = konkretna przesłanka art. X §Y
  E Enumerate → wszystkie dowody w pozwie / odpowiedzi (prekluzja)
  L Link → chronologia MP3 + wyjaśnienie pozornych sprzeczności
  D Document → proweniencja per dowód (MOD-PROWENIENCJA §PR1)

INTEGRACJA:
  P! z BLOK-PROWENIENCJA → automatycznie AD-1 + AD-2
  [ZAW] proweniencja → AD-11 + AD-12 SY-3
  MP5 §5.2 "typ: dowodowe" → rozwiń na AD-X z siłą N/10
```

---

## BLOK-NEGACJA — Siła dowodów, techniki negacji i odporność pisma

> **Trigger:** ZAWSZE — automatyczny dla każdej sprawy z ≥1 dowodem i ≥1 tezą.
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-NEGACJA-DOWODOW.md`
> **Cel:** ocenić siłę każdego dowodu wobec technik negacji przeciwnika,
> zidentyfikować milczące przyznania i zbudować odporne pismo.

```
BLOK N1 — CIĘŻAR DOWODU (per teza T-X):
  KR1: kto wywodzi skutki z faktu? → ten ma ciężar (art. 6 KC)
  KR2: czy istnieje przepis odwracający ciężar?
       OD-1 mobbing | OD-2 dyskryminacja | OD-3 dyscyplinarne
       OD-4 wypowiedzenie | OD-5 wypadek | OD-6 probatio diabolica
  KR3: czy fakt jest negatywny? → rozważ art. 231 KPC
  KR4: co wystarczy do SPEŁNIENIA ciężaru przez nas?
  KR5: co wystarczy przeciwnikowi do ZNIWECZENIA?

BLOK N2 — ODPORNOŚĆ DOWODÓW (per klasa A-G):
  A (urz.) → obalenie: wymaga klasy A lub G + dowód błędu/fałszu
  B (pryw.) → obalenie: żądanie oryginału + twierdzenie o przeróbce
  C (koresp.) → obalenie: zaprzeczenie + wniosek o metadane
  D (świad. bezp.) → obalenie: motyw stronniczości + zeznanie przeciwne
  E (świad. pośr.) → samo wskazanie pośredniości obniża do 1/10
  F (strona) → zaprzeczenie strony p. rodzi sprzeczność (art. 233 §1)
  G (biegły) → obalenie: atak na metodologię + wniosek o 2. biegłego

12 TECHNIK NEGACJI (N1-N12) — pełna taksonomia w MOD-NEGACJA-DOWODOW.md:
  [N1]  Gołosłowne zaprzeczenie
  [N2]  Twierdzenie o nieistnieniu faktu pozytywnego
  [N3]  Twierdzenie o nieistnieniu elementu prawnego
  [N4]  Ogólnikowe zaprzeczenie "wszystkiemu"
  [N5]  Atak na autentyczność dokumentu
  [N6]  Odmowa przedłożenia dokumentu (art. 233 §2 KPC)
  [N7]  Zarzut braku formy / wadliwości formalnej
  [N8]  Atak na wiarygodność świadka
  [N9]  Zarzut prekluzji dowodowej
  [N10] Cherry-picking — selektywne cytowanie (MAN-05)
  [N11] Antycypacja zarzutu / immunizacja twierdzenia
  [N12] Zniszczenie lub ukrycie dowodu (spoliation / art. 233 §2)

BLOK N4 — MILCZENIE JAKO PRZYZNANIE:
  Per każde kluczowe twierdzenie faktyczne:
    M1: czy pismo przeciwnika odnosi się wprost? → NIE → M2
    M2: czy objęte ogólnym zaprzeczeniem? → jeśli nie → PRZYZ-MIL
    M3: waga: H (kluczowe) / M (istotne) / L (poboczne)
    M4: formularz: "T-X pozostaje niezaprzeczone. Art. 230 KPC."
  Rejestr [PRZYZ-MIL-H/M/L] → sekcja "Fakty bezsporne" pisma.

PROCEDURA NG1-NG6:
  NG1 mapowanie ciężaru → NG2 odporność → NG3 prognoza N1-N12
  → NG4 milczenie → NG5 raport BLOK-NEGACJA → NG6 integracja pipeline
```

---

## BLOK-PROWENIENCJA — Wykrywanie wspólnego pochodzenia dowodów

> **Trigger OBOWIĄZKOWY:**
>   ≥3 dowodów klasy C lub D (korespondencja, zeznania)
>   LUB ≥2 świadkowie z tego samego miejsca pracy / działu
>   LUB DTA-ID-MODE aktywny (≥5 plików)
> **Trigger na żądanie:** "sprawdź czy z jednego systemu", "czy zeznania skoordynowane",
>   "skąd pochodzi", "czy ten sam autor", "proweniencja"
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-PROWENIENCJA-DOWODOW.md`
> **Cel:** wykryć wspólne źródło ≥2 pozornie niezależnych dowodów i ocenić konsekwencje.

```
7 TYPÓW PROWENIENCJI (pełna taksonomia w MOD-PROWENIENCJA-DOWODOW.md):

  [SYS]   Wspólny system IT  — format/numeracja/metadane systemowe identyczne
  [KOM]   Wspólny komunikator — ten sam nadawca/odbiorca/wątek/kanał
  [ZAW]   Wspólne środowisko zawodowe — ten sam pracodawca/dział/przełożony
  [AUT]   Wspólny autor — metadane, nawyki typograficzne, identyczne błędy
  [URZ]   Wspólne urządzenie — EXIF, adres IP, artefakty skanera
  [LIN]   Podobieństwo tekstu — identyczne zdania, schematy, błędy merytoryczne
  [CHAIN] Wspólny custody — stemple, braki numeracji, kolejność skanowania

4 KLASY KONSEKWENCJI:

  P+  Wzmacniająca: wspólne niezależne źródło → fakt awansuje do BEZSPORNE/PEWNE
  P-  Osłabiająca:  pozorna niezależność → oba dokumenty traktuj jak jeden
  P0  Neutralna:    wspólne źródło znane obu stronom, bez wpływu na siłę
  P!  Alert:        nieoczekiwane wspólne źródło → [H-PROW] + wniosek dowodowy

PROCEDURA (szczegółowa w MOD-PROWENIENCJA-DOWODOW.md §PR1-PR5):
  PR1 Inwentaryzacja proweniencyjna (autor/system/kanał per dowód)
  PR2 Skan par (Di, Dj) pod wszystkie 7 typów
  PR3 Klasyfikacja P+/P-/P0/P!
  PR4 Raport proweniencji (klastry + fakty awansowane/zdegradowane + alerty P!)
  PR5 Integracja: → DTA-ID-MODE → macierz D×T → BLOK-KONSEKWENCJE

INTEGRACJA Z PIPELINE:
  Fakty awansowane P+ → BEZSPORNE w BLOK-KONSEKWENCJE C-X.1
  Alerty P! → wnioski dowodowe art. 248 KPC / biegły art. 278 KPC
  Obniżona wiarygodność P- → RS (ryzyko sporności) w macierzy D×T
  Hipotezy [H-PROW] → MP6-sledczy §6.12 lista pytań śledczych
```

---

---

## DTA-ID-MODE — Numeracja krzyżowa D/F/T (tryb dużych spraw)
> **Trigger opcjonalny:** na żądanie użytkownika przy każdej sprawie.
> **Cel:** cross-referencja Dowód → Fakt → Teza w raportach i pismach.
> **Źródło:** DTA Warstwa 1–5 (identyfikacja + ekstrakcja + numeracja).

```
FORMAT IDENTYFIKATORÓW:

  D-NNN  = Dowód (dokument / plik)
    Format: D-[numer trzycyfrowy]
    Przykład: D-001 = Pracownicy13_08_2024.xlsx
              D-002 = Protokół rozprawy 27.01.2026

  F-NNN  = Fakt (wyekstrahowany z dowodu — TYLKO opis zdarzenia, NIE wniosek)
    Format: F-[numer trzycyfrowy]
    Zasada DTA W2: F-NNN zawiera WYŁĄCZNIE fakty, NIGDY wnioski prawne.
    Przykład: F-101 = "Arkusze HP i HPG w jednym pliku XLS"
              F-102 = "Numeracja pracowników ciągła — brak resetu po 1.07.2023"
    ⛔ ZAKAZ: F-101 = "Spółki stanowią jeden organizm" → to wniosek, nie fakt → [LA-WNIOSEK-W-FAKCIE]

  T-NN   = Teza procesowa (wniosek prawny z faktów)
    Format: T-[numer dwucyfrowy]
    Przykład: T-01 = "HP i HPG korzystały ze wspólnego systemu kadrowego"
              T-02 = "Powód manifestował gotowość do pracy"

CROSS-REFERENCE w raportach i pismach:
  "Jak wynika z D-001 (xlsx), fakt F-102 (ciągła numeracja) potwierdza T-01."
  "D-007 (RCS Park 21.03.2026) → F-301 (osobiste żądanie zaprzestania kontaktu) → T-02 + T-05"
```

```
KIEDY AKTYWOWAĆ DTA-ID-MODE:

  ⛔ OBOWIĄZKOWY (auto-trigger):
     ≥5 plików dostarczonych przez użytkownika
     LUB ≥5 tez w CLAIM-VALIDATION
     LUB TRYB ETAPOWY (>30 plików — HARD GATE z MOD-PORCJOWANIA)

  Opcjonalny (na żądanie):
     Użytkownik mówi: "numeruj", "D-NNN", "DTA", "cross-reference"

  Nieaktywny (domyślny dla małych spraw):
     <5 plików i <5 tez → używaj Lp. (prostsze, wystarczające)
```

```
PROCEDURA INICJALIZACJI DTA-ID-MODE:

KROK DTA-1: Utwórz rejestr D-NNN
  D-001: [nazwa pliku] | [typ wg MT1.2 DOK-URZ/DOK-PRY/etc.] | [klasa A-G z DOWODY-METODOLOGIA §5]
  D-002: ...

KROK DTA-2: Ekstrakcja faktów F-NNN per dowód
  Dla D-001: wylistuj fakty F-101, F-102, F-103...
  Zasada: jeden fakt = jedno zdanie opisowe zdarzenia/stanu (bez ocen prawnych)

KROK DTA-3: Budowanie tez T-NN z faktów
  T-01 wynika z: F-101, F-102, F-103 (D-001), F-205 (D-002)
  T-02 wynika z: F-301 (D-007), F-302 (D-008), F-303 (D-018)

KROK DTA-4: Zasilenie macierzy D×T (MOD-MACIERZ-DOWOD-TEZA)
  Macierz używa D-NNN zamiast D1/D2 → pełna cross-referencja
```

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
view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md   ← KROK 0b (SD-VER), już HARD GATE
view /mnt/skills/user/shared/MOD-STEP-TRACKER.md              ← KROK 0c (ST-INIT), dodane w audycie 5.13.0
```

Raport dowodowy musi wskazywać: fakt istotny, przesłankę prawną, dowód główny, dowody wspierające, lukę, kontrargument i ryzyko pominięcia.

---

## Zakaz

Nie wolno domyślnie:

- **przechodzić do KROK 1 bez SD-VER = KOMPLET z KROK 0b** — patrz HARD GATE
  w KROK 0b,
- **pomijać inicjalizacji REJESTRU KROKÓW (ST-INIT) po KROK 0b** — patrz
  KROK 0c (audyt 5.13.0),
- **cicho pomijać BLOK oznaczony jako obowiązkowy w KROK 2** (np. BLOK G/J
  przy A2=TAK) bez odnotowania statusu "⚠️ POMINIĘTY" w REJESTRZE i bez
  poinformowania użytkownika — patrz KROK 0c / ST-REPORT (audyt 5.13.0),
- **wywoływać KROK 4 (dashboard) lub dostarczać MD-NARR bez wyświetlenia
  stanu REJESTRU KROKÓW** (pełny ✅ lub z jawnym ⚠️ POMINIĘTY) — patrz
  ST-FINAL w shared/MOD-STEP-TRACKER.md (audyt 5.13.0),
- podawać przepisów/orzeczeń z pamięci bez weryfikacji przez PRAWO-HARDGATE,
- generować oceny siły dowodu bez uzasadnienia i klasy A-D,
- pomijać alertu o legalności nagrań, gdy materiał zawiera nagranie,
- mylić terminy instrukcyjne z zawitymi,
- sugerować, że analiza zastępuje poradę prawnika.

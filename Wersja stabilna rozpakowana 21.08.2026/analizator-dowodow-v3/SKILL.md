---
name: analizator-dowodow-v3
version: "5.17.0"
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
    - MOD-DOKUMENT-GATES
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
    - DOKUMENT-GATES-1-8
pipeline:
  stages:
    - AD-KROK0-BLOKADA
    - AD-KROK0a-MODE
    - AD-KROK0b-SDVER
    - AD-KROK0c-STINIT
    - AD-KROK0d-DGLOAD
    - AD-KROK1-INTAKE
    - AD-KROK2-ROUTER
    - AD-BLOKG-STRONY
    - AD-BLOKJ-LAPSUSY
    - AD-BLOKH-DIS
    - AD-KROK3-WYKONANIE
    - AD-KROK4-DASHBOARD
changelog: |
  Wersja bieżąca: 5.17.0. Pełna historia w references/CHANGELOG.md.
  Skrót 5.17.0 (2026-08-20z): (1) NOWA ZDOLNOŚĆ — KROK 0d DG-LOAD wpina
  shared/MOD-DOKUMENT-GATES.md (8 bramek pracy na dokumentach, dotąd
  dostępnych wyłącznie w skillu przesłuchań, F-100 A); (2) 5 bloków
  strategicznych (KONSEKWENCJE, ATAK, NEGACJA, PROWENIENCJA, DTA-ID)
  wydzielonych do modules/MD7-bloki-strategiczne.md, treść 1:1, w SKILL.md
  tablica wyzwalaczy, rejestracja jako E7 w BLOKU E routera (F-100 B);
  (3) naprawiony nagłówek H1 „v5.1" przy version 5.16.1 (F-101).
  ⚠️ Wersje 5.16.0 i 5.16.1 nie mają wpisu w żadnym rejestrze — luka
  odnotowana jawnie w references/CHANGELOG.md.
---

# Analizator Dowodów Procesowych v5
<!-- TYLKO major - pelny numer w polu `version:` YAML (F-102, 2026-08-20z3).
     Wczesniej v5.1 przy version 5.16.1; naprawa 08-20z wpisala tu v5.17,
     co dryfowaloby przy nastepnym podbiciu - stad przejscie na sam major. -->

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

## KROK 0d — DG-LOAD: BRAMKI PRACY NA DOKUMENTACH ⛔ OBOWIĄZKOWE (dodane 5.17.0)

> **Nowa zdolność, nie przeniesienie.** Do 2026-08-20z osiem bramek pracy na
> dokumentach istniało w systemie WYŁĄCZNIE wewnątrz
> `przesluchanie-swiadkow-v2-min90` — ten skill, którego całym przedmiotem są
> dokumenty, nie miał do nich dostępu (F-100 A). Po wydzieleniu kanonu do
> `shared/` są dostępne tutaj.

```
Warunek: w materiale jest JAKIKOLWIEK dokument (czyli zawsze poza trybem
pytania teoretycznego).
→ view /mnt/skills/user/shared/MOD-DOKUMENT-GATES.md
```

| Bramka | Kiedy odpala się w TYM skillu |
|---|---|
| §1 DOCUMENT-SCAN-PROMPT | KROK 0b/1 — każdy skan, podpis, element odręczny |
| §2 FOUNDATION-VERIFICATION-GATE | przed każdą hipotezą `[H-ŚLEDCZA]` o dokumencie (MP6) i przed [LAPSUS] opartym na wzorcu stylistycznym (BLOK J) |
| §3 EXHAUSTIVE-EXTRACTION-GATE | MP1 ekstrakcja, BLOK G rejestr stron — „wszystkie przypadki X" |
| §4 IMMEDIATE-LOGICAL-SCAN | pierwsze czytanie każdego dokumentu; zasila §P1 INTRA-CONTRA |
| §5 CROSS-DOCUMENT-CONSISTENCY-CHECK | MP3 spójność — nowy dokument vs fakty już ustalone |
| §6 ENTITY-DISAMBIGUATION-TABLE | BLOK G — dokumenty od ≥2 powiązanych podmiotów |
| §7 EVIDENCE-THREAD-LINKING | MP13 synteza faktyczna — łączenie ustaleń z różnych tur |
| §8 QUOTE-VERIFICATION-DEFAULT | każdy cytat z dokumentu w raporcie, dashboardzie i MD-NARR |

⚠️ Pominięcie bramki raportuj jako „⚠️ POMINIĘTY" w REJESTRZE KROKÓW (KROK 0c),
na tych samych zasadach co pominięcie bloku obowiązkowego.

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

E7. ⛔ ZAWSZE gdy ustalono tezy LUB jest ≥1 dowód (czyli praktycznie każda
    analiza pełna; NIE dotyczy trybu minimalnego z BLOKU G):
    → dodaj: MD7 (bloki strategiczne — konsekwencje, atak, negacja,
      proweniencja, DTA-ID; 262 linie, wydzielone 2026-08-20z)
    Wyzwalacze poszczególnych bloków — patrz tablica w sekcji
    „BLOKI STRATEGICZNE — MD7" niżej.
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

## BLOKI STRATEGICZNE — MD7 (konsekwencje, atak, negacja, proweniencja, DTA-ID)

> ⛔ **Wydzielone 2026-08-20z (F-100 B) do `modules/MD7-bloki-strategiczne.md`.**
> Treść przeniesiona 1:1 — wyzwalacze, progi i procedury BEZ ZMIAN. Poniżej
> wyłącznie tablica wyzwalaczy; przy trafieniu KTÓREGOKOLWIEK wiersza:
>
> ```
> view /mnt/skills/user/analizator-dowodow-v3/modules/MD7-bloki-strategiczne.md
> ```

| Blok | Wyzwalacz | Czego dotyczy |
|---|---|---|
| **BLOK-KONSEKWENCJE** | ⛔ ZAWSZE po ustaleniu tez (MODE A/B/C) | każda teza musi generować ≥2 skutki prawne (KC1 bezpośredni, KC2 pośredni, KC3 strategiczny); bez tego teza NIE trafia do W1.3 `pisma-procesowe-v3` jako GOTOWA |
| **BLOK-NEGACJA** | ⛔ ZAWSZE przy ≥1 dowodzie i ≥1 tezie | ciężar dowodu (N1), odporność klas A-G (N2), 12 technik negacji, milczenie jako przyznanie (art. 230 KPC), procedura NG1-NG6 |
| **BLOK-ATAK-NA-DOWOD** | dowody przeciwnika (MP5 perspektywa = TAK) LUB alert **P!** z proweniencji | 12 wektorów AD-1..AD-12, procedura ofensywna ADIS-1..5 i obronna SHIELD |
| **BLOK-PROWENIENCJA** | ≥3 dowody klasy C/D LUB ≥2 świadkowie z tego samego miejsca pracy/działu LUB DTA-ID-MODE aktywny; na żądanie: „czy z jednego systemu", „proweniencja" | 7 typów wspólnego pochodzenia, 4 klasy konsekwencji P+/P-/P0/P!, procedura PR1-PR5 |
| **DTA-ID-MODE** | ⛔ auto: ≥5 plików LUB ≥5 tez w CLAIM-VALIDATION LUB TRYB ETAPOWY; opcjonalnie na żądanie | numeracja krzyżowa D-NNN / F-NNN / T-NN, zakaz wniosku prawnego w polu faktu, zasilenie macierzy D×T |

⚠️ Tablica służy ROZPOZNANIU, że blok się aktywował. Do WYKONANIA bloku
potrzebna jest pełna treść z MD7 — a przy realnej pracy na dowodach
dodatkowo kanon z `shared/` (ATAK / NEGACJA / PROWENIENCJA).

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
view /mnt/skills/user/shared/MOD-DOKUMENT-GATES.md            ← KROK 0d (DG-LOAD), dodane w audycie 5.17.0
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
- **pomijać DG-LOAD (KROK 0d) i pracować na dokumentach bez bramek §1-§8**
  z `shared/MOD-DOKUMENT-GATES.md` — patrz KROK 0d (audyt 5.17.0),
- **wykonywać bloku obowiązkowego z tablicy MD7 (KONSEKWENCJE, NEGACJA)
  bez wczytania `modules/MD7-bloki-strategiczne.md`** — sama tablica
  wyzwalaczy służy rozpoznaniu, nie wykonaniu (audyt 5.17.0),
- podawać przepisów/orzeczeń z pamięci bez weryfikacji przez PRAWO-HARDGATE,
- generować oceny siły dowodu bez uzasadnienia i klasy A-D,
- pomijać alertu o legalności nagrań, gdy materiał zawiera nagranie,
- mylić terminy instrukcyjne z zawitymi,
- sugerować, że analiza zastępuje poradę prawnika.

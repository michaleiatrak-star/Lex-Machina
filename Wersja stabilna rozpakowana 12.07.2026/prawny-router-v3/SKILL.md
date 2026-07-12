---
name: prawny-router-v3
version: 3.13
type: orchestration
status: production
entrypoint: SKILL.md
compatibility: "web_search, web_fetch, show_widget, create_file"
description: |
  Router Prawny v3.13 — orchestrator KAŻDEJ sprawy prawnej. Wykrywa tryb (LAIK/PRAWNIK),
  koordynuje PRIMARY→SECONDARY→FALLBACK, generuje .docx/.pdf.
  UŻYWAJ ZAWSZE i AUTOMATYCZNIE. Nigdy nie analizuj bez wczytania tego pliku.
dependencies:
  requires:
    - shared
    - prawo-polskie-v2
    - analiza-sadowa-v6
    - analizator-dowodow-v3
    - analizator-przepisow-v2
    - analizator-umow-v1
    - chronologia-sprawy-v1
    - dr-03-prawo-karne-wykroczenia-egzekucja
    - dr-08-samorzad-terytorialny-prawo-lokalne
    - dr-09-budownictwo-srodowisko-energia-transport
    - dr-10-zdrowie-farmacja-zywnosc-rolnictwo
    - dr-11-cyfrowe-cyber-ai-dane-ip
    - dr-12-sadownictwo-prokuratura-zawody-prawnicze
    - orzeczenia-sadowe-v2
    - pisma-procesowe-v3
    - pisma-proste-v2
    - przesluchanie-swiadkow-v2-min90
    - przewodnik-prawny-v2
  called_by:
    - użytkownik (punkt wejścia — brak nadrzędnego skilla)
inputs:
  - opis sprawy użytkownika (tekst wolny)
  - opcjonalnie: pliki/dowody wgrane przez użytkownika
  - opcjonalnie: plik kontekstu sesji (eksport z wcześniejszej rozmowy)
outputs:
  - decyzja routingu ([1]-[10]) + wywołanie właściwego skilla PRIMARY/SECONDARY/FALLBACK
  - finalnie: odpowiedź tekstowa, widget (show_widget) lub dokument .docx/.pdf (create_file)
confidence: verified-online
  # HARD GATE wymusza web_search/web_fetch dla każdego przepisu/sygnatury —
  # router sam nie generuje treści prawnej z pamięci, tylko orkiestruje.
escalation:
  - brak dostępu do isap.sejm.gov.pl / orzeczenia.ms.gov.pl / sn.pl / nsa.gov.pl
    → oznacz ⚠️ [NIEWERYFIKOWANE] i poinformuj użytkownika, nie kontynuuj cicho
  - sprawa transgraniczna / prawo obce → pomiń prawo-polskie-v2 i ISAP,
    pozostałe zasady HG aktywne (UP-5)
  - użytkownik zagubiony / brak klasyfikacji → [7] FALLBACK, nie zgadywanie dziedziny
  - podmiot (spółka/organ/sąd) oznaczony ⬛ [DO WERYFIKACJI] i brak dostępu do
    rejestru (KRS/CEIDG) → STOP, poinformuj użytkownika, ZAKAZ generowania
    pisma z podmiotem w statusie ⬛
limitations:
  - nie zastępuje porady radcy prawnego/adwokata — patrz shared/DISCLAIMER.md (KROK 7, obowiązkowy)
  - jakość i czas odpowiedzi zależą od dostępności i jakości web_search/web_fetch
  - nie ingeruje w kontrolę jakości pipeline'u pisma-procesowe-v3 (tylko deleguje)
  - "ZNALEZISKO 2026-07-04 (do weryfikacji w następnym audycie): plik lokalny
    references/kwalifikator-karnomaterialny.md (589 linii) wygląda na
    potencjalny duplikat/wariant kanonicznego
    dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
    wskazanego w UP-3 — nie scalone w tej sesji (poza zakresem pilotażu
    standaryzacji metadanych), zgłoszone do CHECKLIST-DEDUP."
required_modules:
  - shared/PRAWO-HARDGATE.md
  - shared/MOD-STEP-TRACKER.md
  - shared/MOD-KONTEKST-SESJI.md
  - shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
  - shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md
  - shared/MOD-PORCJOWANIE-DOWODOW.md
  - shared/PRE-W2-VERIFICATION-GATE.md
  - shared/CP-GATE.md
  - shared/DISCLAIMER.md
  - references/KROK0A-anonimizer.md
  - references/KROK1-detekcja.md
  - dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md  # kanoniczny, wg UP-3
changelog:
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
---

# ⛔ HARD GATE — PRIORYTET BEZWZGLĘDNY

> Ten blok jest pierwszą instrukcją routera. Obowiązuje od momentu wczytania tego pliku
> do końca rozmowy — niezależnie od liczby wiadomości, dziedziny i jurysdykcji.

```
⛔ HG-ACTIVE — potwierdzam aktywność HARD GATE

ZAKAZ: żaden artykuł / § / Dz.U. / kwota / termin ustawowy / sygnatura
       nie może być podany BEZ web_search/web_fetch w tej samej odpowiedzi.

ZASADA: każde powołanie = osobny fetch — nawet jeśli weryfikowano wcześniej w tej rozmowie.
ZASADA: nawet gdy model "jest pewny" treści przepisu — weryfikacja obowiązkowa.
ZASADA: zakaz nie wygasa. PERMANENT przez całą rozmowę.

Źródła oficjalne (wyłącznie):
  isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl

Brak dostępu → ⚠️ [NIEWERYFIKOWANE] + komunikat użytkownikowi. Nigdy nie pomijaj.

Zagraniczne: pomiń prawo-polskie-v2 i ISAP — pozostałe zasady HG aktywne.

Procedura szczegółowa: view /mnt/skills/user/shared/PRAWO-HARDGATE.md
```

> ⛔ Żaden krok sekwencji głównej nie zwalnia z powyższego. HG nadrzędny wobec wszystkich reguł.

---

# Router Prawny v3.13 — Spis Treści i Sekwencja Główna

## PREFERENCJE UŻYTKOWNIKA (aktywne globalnie)

```
UP-1: router→v3 ZAWSZE pierwszy (przed jakimkolwiek skillem dziedzinowym) — każda jurysdykcja
UP-2: ISAP — weryfikacja KAŻDEGO przepisu online (web_search/web_fetch) — bez wyjątku
UP-3: Sprawy karne → KROK1-detekcja.md kieruje do dr-03; kwalifikacja przez
         view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
UP-4: HYBRID-VALIDATION przed każdym .docx
UP-5: Zagraniczne → pomiń prawo-polskie-v2 + ISAP, pozostałe zasady aktywne
```

## SEKWENCJA GŁÓWNA

```
KROK 0  → Wczytaj ten plik → ⛔ HG-ACTIVE (blok powyżej) — potwierdź przed kontynuacją
KROK 0-ST → ⛔ [ST-INIT — STEP-TRACKER] (zaraz po HG-ACTIVE, przed jakimkolwiek krokiem):
          view /mnt/skills/user/shared/MOD-STEP-TRACKER.md → zainicjuj REJESTR kroków
          (FAZA 0). REJESTR aktywny przez całą sesję — niezależnie od tego, czy później
          zostanie wczytany skill dziedzinowy (np. pisma-procesowe-v3).
          ⛔ ST-FINAL (FAZA 3 MOD-STEP-TRACKER) jest BEZWZGLĘDNIE BLOKUJĄCY przed KAŻDYM
          present_files pisma/.docx — także gdy pismo generowane jest bezpośrednio z routera
          bez pełnego pipeline pisma-procesowe-v3. Polecenia „dalej"/„kontynuuj"/„generuj"
          NIE zwalniają z ST-FINAL ani z obowiązku raportowania pominięć (FAZA 2).
KROK 0A → [ANONIMIZER] → view references/KROK0A-anonimizer.md
KROK 0B → [KONTEKST SESJI] → wykryj czy użytkownik wkleił/wgrał plik
          kontekstu (# KONTEKST SESJI...) lub czy napisał "masz kontekst" /
          "wczytaj sesję" / "plik z poprzedniej sesji" — jeśli TAK:
          view /mnt/skills/user/shared/MOD-KONTEKST-SESJI.md → wykonaj
          TRYB IMPORT (§4). IMPORT_AKTYWNY = true dla tej sesji.
          Jeśli NIE — pomiń, kontynuuj do KROK 1.
KROK 0C → [SKAN KOMPLETNOŚCI + PORCJOWANIE] → gdy użytkownik wgrał pliki LUB
          wspomniał o załącznikach / dowodach:

          ⛔ KROK 0C-EXT — MOD-SKAN-DOWODOW-KOMPLETNY (ZAWSZE PIERWSZY):
          view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
          → SD-GATE-0: czy plik faktycznie wgrany? Jeśli NIE + wzmianka o załącznikach
            → STOP. Zażądaj plików. Nie analizuj z pamięci.
          → SD-INW: zinwentaryzuj WSZYSTKIE pliki (ZIP → rozpakuj i zinwentaryzuj zawartość)
          → SD-READ: odczytaj KAŻDĄ STRONĘ każdego pliku (protokół per typ)
          → SD-VER: weryfikacja kompletności — wszystkie D[id] = ✅?
          → SD-GATE-4: bramka pre-generacji — BLOKADA W2 dopóki SD-VER ≠ KOMPLET
          ⛔ Pominięcie choćby jednej strony = BŁĄD KRYTYCZNY

          ⛔ ROUTER-CP-SKAN: po SD-VER wyświetl RAPORT SD-VER i ZAKOŃCZ odpowiedź.
          NIE kontynuuj do KROK 1 bez wiadomości użytkownika po raporcie SD-VER.
          Format raportu:
            ┌─────────────────────────────────────────────────────────┐
            │ ✅ CHECKPOINT SD-VER — [N] plików / [M] stron           │
            │ Pliki odczytane: [lista D[id] ✅]                       │
            │ Pliki nieodczytalne: [lista ⚠️ lub BRAK]               │
            │ Kluczowe fakty: [top 5 faktów procesowych]             │
            │ ➡️ Kontynuować do analizy? "tak" / uwagi               │
            └─────────────────────────────────────────────────────────┘

          KROK 0C-PD — MOD-PORCJOWANIE-DOWODOW (PO SD-INW, dla dużych materiałów):
          view /mnt/skills/user/shared/MOD-PORCJOWANIE-DOWODOW.md → wykonaj PD0.
          STATUS BEZPIECZNY → kontynuuj do KROK 1 bez raportu.
          STATUS ≥ OSTRZEŻENIE → PD1 → PD2 (plan) → STOP; czekaj na zatwierdzenie.
          STATUS KRYTYCZNE → ⛔ HARD GATE → PD1 → PD2 → STOP; nie analizuj bez planu.
          Trigger wznawiania: plik "# CHECKPOINT ANALIZY" → PD5 (wznów z checkpointu).
          Brak plików i brak wzmianki o załącznikach → pomiń KROK 0C, idź KROK 1.
KROK 0D → [STATUS PODMIOTÓW — OZNACZENIE ⬛] → obowiązkowy gdy w materiałach widoczne
          dane podmiotów (spółki, organy, sądy, fundusze):
          ⛔ Każdy podmiot niebędący osobą prywatną = natychmiast ⬛ [DO WERYFIKACJI]
          ⛔ Status ⬛ utrzymuje się aż do faktycznego web_search/web_fetch w tej sesji
          ⛔ ZAKAZ wstawiania danych ⬛ do pisma / argumentacji bez weryfikacji
          Szczegóły + STATUS-LIFECYCLE: view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md (PRE-W2.0)
          Wyjątki (NIE oznaczaj): imię/nazwisko, adres, PESEL osoby fizycznej
KROK 1  → [DETEKCJA TRYBU + HARD GATE] → view references/KROK1-detekcja.md
KROK 2  → [ROUTING [1]–[10]] → poniżej w tym pliku
KROK 3  → Załaduj PRIMARY → SECONDARY → FALLBACK
KROK 4  → Wykonaj analizę / zbierz dane
KROK 5  → Sprawdź TYP WYJŚCIA → SEKWENCJA END-TO-END → poniżej
KROK 5B → [EXPORT KONTEKSTU] → po KROK 5 jeśli sesja zawierała KROK 3B
           (analizator-dowodow-v3) lub W3 (pisma-procesowe-v3):
           view /mnt/skills/user/shared/MOD-KONTEKST-SESJI.md → wykonaj
           TRYB EXPORT (§3) — generuj plik .md i present_files.
KROK 6  → Jeśli pismo → generuj .docx
          Kontrola jakości i statusu DRAFT/FINAL zarządzana przez pisma-procesowe-v3
          (shared/CP-GATE.md). Router nie ingeruje w pipeline CP — tylko deleguje.
          ⛔ KROK 6-ST — ST-FINAL (BLOKUJĄCY): przed present_files KAŻDEGO pisma/.docx
          wyświetl PEŁNY REJESTR KROKÓW (FAZA 3 MOD-STEP-TRACKER). Jeśli STATUS =
          ⚠️ DRAFT — NIEZWERYFIKOWANY → pokaż raport pominięć (FAZA 2) i czekaj na decyzję
          a/b. ZAKAZ present_files bez uprzedniego ST-FINAL — także gdy router generuje
          pismo bez pełnego pipeline pisma-procesowe-v3.
KROK 7  → DISCLAIMER → view /mnt/skills/user/shared/DISCLAIMER.md
```

> ⛔ KROK 0A jest BRAMKĄ TWARDĄ. Żaden kolejny krok nie może być wykonany
> jeśli KROK 0A nie jest zamknięty (decyzja_sesji ≠ null).

---

## KROK 2 — ROUTING [1]–[10]

### [1] DOKUMENT / UMOWA
`umowa / OWU / kontrakt / ugoda / regulamin / testament / "czy mogę podpisać" / "klauzule"`
→ PRIMARY: `view /mnt/skills/user/analizator-umow-v1/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [2] AKTA / WYROK / ANALIZA SZANS
`wyrok / nakaz zapłaty / wezwanie / pismo przeciwnika / "jakie mam szanse" / analiza pozycji`
→ PRIMARY: `view /mnt/skills/user/analiza-sadowa-v6/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [3] PISMO ZŁOŻONE
`pozew / apelacja / odpowiedź na pozew / zażalenie / skarga / pismo wielowątkowe`
→ PRIMARY: `view /mnt/skills/user/pisma-procesowe-v3/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `analiza-sadowa-v6` · Wyjście: **obowiązkowo .docx**

### [4] PISMO PROSTE (1 wątek, 1 podstawa prawna)
`sprzeciw od nakazu / klauzula / przywrócenie terminu / wgląd / uzasadnienie / wezwanie do zapłaty`
→ PRIMARY: `view /mnt/skills/user/pisma-proste-v2/SKILL.md`
→ NIE używaj gdy >1 wątek → [3] · Wyjście: **obowiązkowo .docx**

### [5] ORZECZNICTWO
`"znajdź wyrok" / "precedens" / "linia orzecznicza" / weryfikacja sygnatury`
→ PRIMARY: `view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [6] DOWODY / TERMINY / KOSZTY
`maile / SMS / nagrania / faktury / terminy procesowe / koszty sądowe / opłaty komornicze`
→ PRIMARY: `view /mnt/skills/user/analizator-dowodow-v3/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [7] ZAGUBIONY / FALLBACK
`"co mam zrobić" / "od czego zacząć" / wyjaśnienie wyniku / walidacja przepisu`
→ PRIMARY: `view /mnt/skills/user/przewodnik-prawny-v2/SKILL.md`
→ SECONDARY: `prawo-polskie-v2`

### [8] PRZESŁUCHANIE ŚWIADKA
`świadek / cross-examination / biegły / pytania do świadka / rozbicie zeznania`
→ PRIMARY: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `analiza-sadowa-v6`

### [9] ANALIZA PRZEPISU
`"art. X" / "§ Y" / przesłanki / wykładnia / "czy mnie dotyczy"`
→ PRIMARY: `view /mnt/skills/user/analizator-przepisow-v2/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `pisma-procesowe-v3`

### [10] BEZ KLASYFIKACJI — ROUTER DZIEDZINOWY
`mandat / ZUS / alimenty / stalking / mobbing / eksmisja / deweloper / upadłość / RODO
/ zatrzymanie / mediacja / komornik / rozwód / zachowek / AI Act / sprawa wielodziedzinowa`
→ PRIMARY: `view /mnt/skills/user/prawo-polskie-v2/SKILL.md`

**Kombinacje skilli** (pełna tabela → `view /mnt/skills/user/shared/ACTIVATION-MATRIX.md`):

| Sytuacja | Primary | Wyjście |
|---|---|---|
| Dokument/umowa + wezwanie | analizator-umow-v1 | .docx |
| Akta + odpowiedź + orzecznictwo | analiza-sadowa-v6 | .docx |
| Pismo złożone | pisma-procesowe-v3 | .docx |
| Pismo 1-wątkowe | pisma-proste-v2 | .docx |
| Dowody + terminy | analizator-dowodow-v3 | raport |
| Świadek | przesluchanie-swiadkow-v2 | .docx |
| Przepis + orzecznictwo | analizator-przepisow-v2 | .docx |
| AI Act | `view /mnt/skills/user/dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-AI-Act-framework.md` | analiza |
| Raport dla klienta (NA ŻĄDANIE) | raport-klienta-v1 | widget+PDF |

**Routing BJ–BW (ZUS / niepełnosprawność / zawody zaufania):**
`view /mnt/skills/user/prawny-router-v3/references/ROUTING-BJ-BW.md`

**Zasada odciążenia routera:** Router NIE jest bazą prawa materialnego — tylko orkiestruje.
Nie dubluj treści modułów dziedzinowych w routerze.

---

## KROK 5–6 — SEKWENCJA END-TO-END

```
CZY WYNIK TO PISMO [3] lub [4]?
├── TAK
│   ├── ⛔ Materiały źródłowe? TAK → view /mnt/skills/user/shared/FAKTY_v2.md (F0-F3)
│   │                           NIE → każdy fakt bez źródła = ⬛ [UZUPEŁNIJ]
│   ├── pisma-procesowe-v3 lub pisma-proste-v2 → treść
│   ├── HYBRID-VALIDATION (policz ⬛) → view /mnt/skills/user/shared/HYBRID-VALIDATION.md
│   ├── view /mnt/skills/public/docx/SKILL.md → generuj .docx → present_files
│   └── Instrukcja złożenia (LAIK: "Wydrukuj i złóż w sądzie...")
├── ANALIZA / RAPORT?
│   ├── LAIK → przewodnik-prawny-v2 (KROK H) → widget + opcje
│   └── PRAWNIK → surowy raport → "Czy wygenerować pismo?"
└── ORZECZNICTWO? → Linki do baz + cytowania → opcja "Dołącz do pisma"
```

**BRAMKA CHRONOLOGICZNA** (auto, przed KROK 4):
Wczytaj gdy ≥2 dokumenty wieloetapowe LUB słowa kluczowe ("chronologia"/"oś czasu"/"timeline"):
`view /mnt/skills/user/chronologia-sprawy-v1/SKILL.md`

---

## KROK 7 — DISCLAIMER (OBOWIĄZKOWY)

**Każda odpowiedź z analizą prawną MUSI kończyć się disclaimerem.**
Pełna procedura i treść: `view /mnt/skills/user/shared/DISCLAIMER.md`

Warianty inline (gdy brak dostępu do shared/):
- **LAIK:** `⚖️ Niniejsza analiza ma charakter informacyjny i nie stanowi porady prawnej.
  Zalecam konsultację z adwokatem lub radcą prawnym.`
- **PRAWNIK:** `⚖️ Niniejsza analiza ma charakter informacyjny. Nie stanowi porady prawnej
  (art. 4 Prawa o adwokaturze / art. 6 u.r.p.). Weryfikacja: isap.sejm.gov.pl.`

Pozycja: zawsze **ostatni element** odpowiedzi lub stopka pisma .docx.

---

## REGUŁY NADRZĘDNE

```
1.  Router = ZAWSZE pierwszy krok
1C. KROK 0C (PORCJOWANIE) — gdy wgrane pliki: PD0 przed analizą;
    STATUS KRYTYCZNE → ⛔ HARD GATE; wznawianie przez checkpoint PD5.
2.  KROK 0A (anonimizer) PRZED wszystkim — bez wyjątku
3.  HARD GATE (KROK 1B) przed każdą analizą — skill dziedzinowy + ISAP online
4.  Jedno pytanie przy niejednoznaczności — nie zakładaj trybu
5.  "kreator" = natychmiastowe uruchomienie kreatora
6.  Pismo procesowe = obligatoryjny .docx
7.  LAIK = każdy raport przez przewodnik-prawny-v2 (KROK H)
7B. MENU = "co możesz zrobić" / "jakie masz narzędzia" / "jak działa X"
    → przewodnik-prawny-v2 KROK M, nie bezpośrednie wywołanie skilla
7C. Q&A = użytkownik pyta zamiast opisywać / "mam pytania"
    → przewodnik-prawny-v2 KROK Q z weryfikacją ISAP
8.  Termin zawity = zawsze pierwszy (nakazy/wyroki)
9.  ⛔ HARD GATE TRWAŁY — nigdy nie cytuj z pamięci, przez CAŁĄ rozmowę, niezależnie od liczby wiadomości.
    Każde powołanie artykułu/sygnatury/liczby = osobny web_search/web_fetch w tej samej odpowiedzi.
    Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl
    ⛔ Zakaz nie wygasa. Nawet jeśli model "jest pewny" — weryfikacja obowiązkowa.
10. HYBRID-VALIDATION przed generowaniem — zero ⬛ przed oddaniem
11. present_files jako ostatni krok (przed disclaimerem w wiadomości)
11a. ⛔ STEP-TRACKER NADRZĘDNY — view /mnt/skills/user/shared/MOD-STEP-TRACKER.md.
    ST-INIT w KROK 0-ST (zaraz po HG-ACTIVE). ST-FINAL (REJESTR KROKÓW) jest BLOKUJĄCY
    przed KAŻDYM present_files pisma/.docx — także gdy router generuje pismo bez pełnego
    pipeline pisma-procesowe-v3 (np. po „kontynuuj"). Każde pominięcie kroku = obowiązek
    raportu (FAZA 2) + czekanie na decyzję a/b. ⛔ ZAKAZ „cichego" pominięcia.
    Wczytanie PRIMARY-skilla (np. pisma-procesowe-v3 dla pism złożonych [3]) jest
    OBOWIĄZKOWE przed generowaniem pisma — jego pominięcie samo jest pominięciem kroku.
12. Bramka chronologiczna — auto przy ≥2 dokumentach wieloetapowych
13. Weryfikacja: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl
14. WERYFIKACJA-ŚLAD: każdy artykuł/liczba/termin → ✅ [VER: źródło, data] lub ⚠️ [NIEWERYFIKOWANE]
    ⛔ ZAKAZ oznaczania VER bez wywołania web_search/web_fetch
    ≥3 błędy sieci z rzędu → komunikat użytkownikowi + kontynuuj z ⚠️
    Procedura: view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md
15. Sygnatury → view /mnt/skills/user/shared/SYGNATURY.md (V-SYG-1/2/3/4)
16. DISCLAIMER → ostatni element każdej odpowiedzi z analizą prawną
17. V10 CONTRADICTION INTELLIGENCE — przy analizie pism przeciwnika (riposta/apelacja/odpowiedź):
    view /mnt/skills/user/pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md (przez analiza-sadowa-v6 lub pisma-procesowe-v3)
    Hard gate: nie przygotowuj repliki bez sprawdzenia sprzeczności wewnętrznych pisma przeciwnika
18. PRE-W2-VERIFICATION-GATE — dla każdego pisma procesowego, PO zatwierdzeniu W1,
    PRZED W2: view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md
    ⛔ ZASADA FUNDAMENTALNA (ROOT CAUSE sesji 2026-06-26):
       DANE Z AKT/UMOW/PROTOKOLOW ≠ DANE ZWERYFIKOWANE ONLINE.
       Nawet gdy dane podmiotowe sa w aktach — wymagane fizyczne web_search/web_fetch.
       "Widzi KRS X w umowie" nie zwalnia ze sprawdzenia czy KRS X = ten podmiot w rejestrze.
    ⛔ Adres sadu/organu NIGDY z pamieci modelu — zawsze web_search (PRE-W2.B)
    ⛔ KRS/NIP pozwanego NIGDY z pamieci ANI z akt — zawsze weryfikacja rejestru (PRE-W2.C)
    ⛔ Rozbiez̈nosc KRS≠NIP w aktach → STOP → weryfikuj kazdy numer osobno (PRE-W2.D)
    ⛔ [POV-D-TRIGGER]: gdy w materiale dowodowym widoczne sa ≥2 rozne numery KRS lub NIP
       przy zbliz̈onej nazwie podmiotu → AUTOMATYCZNIE uruchom PRE-W2.D dla kazdego numeru.
       Nie czekaj na jawna sprzecznos c — sama roznorodnos c numerow = trigger POV-D.
    ⛔ Argument prawny o tozsamosci/odmiennosci podmiotow → WYLACZNIE po PRE-W2.D
    Bledy wyeliminowane: adres SR Katowice-Zachod (ul. Warszawska 45, nie ul. Lompy 14);
    KRS 0000796445 = HP sp. z o.o. (NIP 8971869561), nie HP Global (KRS 0001025052,
    NIP 6343021499) — sesja VII P 94/25 (26.06.2026)
19. MOD-STRATEGIA-WYBOR — dla każdego pisma złożonego (≥2 ścieżki LUB anomalia podmiotowa),
    W1.2b (PRZED W1.3): view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md
    S1→S2→S3→S4→S5: identyfikuj WSZYSTKIE ścieżki → oceń każdą pod kątem ataku
    przeciwnika → rankinguj → rekomenduj strukturę → zatwierdź z użytkownikiem.
    ⛔ Ścieżka z atakiem 🔴 bez kontrargumentu = NIGDY ścieżka główna; zawsze PORZUĆ
    lub EWENTUALNA. Użytkownik może zmienić, ale decyzja musi być explicite.
    ⛔ Przy sprzeczności między ścieżkami: ZAWSZE wybierz mocniejszą; porzuć słabszą.
    Lekcja z VII P 94/25: "ten sam KRS" (🔴) → porzucone; błąd pracodawcy + art.23¹ KP
    + autonomiczny limit HPG = warstwowa obrona A/B/C (każda 🟡/🟢)
20. ⛔ PROTOKÓŁ-CP (CHECKPOINT) — nadrzędny wobec wszystkich reguł poza bezpieczeństwem:
    Po każdym kroku oznaczonym [CP] lub STOP w sekwencji:
      a) Wyświetl raport formatu:
         ┌─────────────────────────────────────────────────────────┐
         │ ✅ CHECKPOINT [nazwa] — ZAKOŃCZONY                       │
         │ Wykonane: [lista]   Wyniki: [kluczowe]                  │
         │ Problemy: [lista ⚠️ lub BRAK]                           │
         │ ➡️ Kontynuować do [następny krok]? "tak" / uwagi        │
         └─────────────────────────────────────────────────────────┘
      b) ZAKOŃCZ odpowiedź. Zero dalszego tekstu po raporcie CP.
      c) NIE kontynuuj do następnego kroku bez wiadomości użytkownika.
    Dotyczy: SD-VER, CLAIM-VALIDATION, MACIERZ D×T, MOD-STRATEGIA-WYBOR,
             RAPORT W1, PRE-W2-GATE, MOD-ATAK-NA-DRAFT, PODMIOT-GATE,
             LEGAL-QUALITY-GATE, AUDYT-KOŃCOWY, PEER-REVIEW+POST-VALIDATION.
20a. Kontrola statusu DRAFT/FINAL .docx należy do pisma-procesowe-v3 (shared/CP-GATE.md).
    Router nie zarządza checkpointami pisma — deleguje do pisma-procesowe-v3 i stamtąd
    pochodzi cała logika CP-GATE, watermark DRAFT, bramka przed .docx.
21. ⛔ CHECKPOINT W ŻĄDANIACH ZŁOŻONYCH [NOWE, audyt 2026-07-12, naprawa F-8] —
    gdy jedno zlecenie użytkownika łączy KILKA elementów z różnych PRIMARY-skilli
    (np. "zbierz tezy + chronologię + sprzeczności + przygotuj pytania do świadka"),
    KAŻDY element podlega checkpointom SWOJEGO PRIMARY-skilla NIEZALEŻNIE — zebranie
    kilku próśb w jedną wiadomość NIE zwalnia z checkpointu żadnej z nich.
    W SZCZEGÓLNOŚCI: jeśli jednym z elementów jest "pytania do świadka" →
    [8] PRZESŁUCHANIE ŚWIADKA → PRIMARY: przesluchanie-swiadkow-v2-min90 →
    CHECKPOINT-W2 (pauza po tezach/modelu, wymagająca jawnej akceptacji użytkownika
    PRZED napisaniem jakichkolwiek pytań W3) MUSI zadziałać, nawet jeśli reszta
    zlecenia (tezy, chronologia, sprzeczności) nie ma własnego checkpointu i może
    zostać dostarczona w tej samej odpowiedzi.
    PROCEDURA: (a) zidentyfikuj wszystkie komponenty zlecenia i przypisz PRIMARY
    skill do każdego z osobna (nie tylko do "głównego" wątku sprawy); (b) dostarcz
    w jednej odpowiedzi komponenty BEZ blokującego checkpointu; (c) dla komponentu
    z checkpointem (np. świadek) — wczytaj jego PRIMARY skill, wykonaj jego etapy
    aż do checkpointu, wyświetl raport CHECKPOINT i ZAKOŃCZ ten wątek odpowiedzi
    zgodnie z regułą 20 (bez pytań W3), nawet jeśli reszta odpowiedzi jest dłuższa.
    Root cause naprawionego incydentu: model potraktował złożone zlecenie jako
    jedno zadanie obsługiwane przez jeden skill (chronologia) i nigdy nie wczytał
    przesluchanie-swiadkow-v2-min90, więc CHECKPOINT-W2 nie miał szansy zadziałać
    mimo poprawnego wpisu routingu w tabeli [8] — sama obecność wiersza w tabeli
    okazała się niewystarczająca bez tej jawnej reguły. Pełny opis: AUDIT-JOURNAL.md,
    wpis AUDYT-2026-07-12.
22. ⛔ TRIGGER SŁOWNY OBLIGATORYJNY — "PYTANIA DO ŚWIADKA" [NOWE, audyt 2026-07-12,
    naprawa F-8b — model dostarczył pytania do świadka "z ręki" bez wczytania
    przesluchanie-swiadkow-v2-min90 mimo obecności reguły 21] —
    niezależnie od tego, czy prośba jest prosta czy złożona, każde z poniższych
    sformułowań (lub ich oczywisty synonim) w wiadomości użytkownika stanowi
    TWARDY, NIEWARUNKOWY trigger:
      "pytania do świadka", "przygotuj pytania [do/dla] świadka/biegłego",
      "przesłuchanie świadka", "kontrprzesłuchanie", "impeachment świadka".
    Wykrycie triggera → OBOWIĄZEK, przed napisaniem JAKIEJKOLWIEK odpowiedzi:
      a) view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/SKILL.md
      b) wejście do pipeline'u od PRE-W1a SD-VER (nie od W3) — zakaz skracania
         do "samych pytań" nawet jeśli użytkownik nie wspomniał o profilu/tezach
      c) jeśli zlecenie jest złożone (tezy/chronologia/sprzeczności + świadek) →
         reguła 21 stosuje się RÓWNOLEGLE (dekompozycja na komponenty), ale
         NIE zwalnia z (a)-(b) dla komponentu świadka
      d) brak wczytania SKILL.md świadka przed dostarczeniem pytań = CRIT,
         niezależnie od tego, czy finalne pytania byłyby merytorycznie poprawne —
         błędem jest sama ścieżka, nie tylko wynik.
    ⛔ SELF-CHECK: pytanie kontrolne "czy odpowiedź zawiera pytania do świadka?"
    → TAK → czy w tej samej odpowiedzi wystąpiło `view` pliku
    przesluchanie-swiadkow-v2-min90/SKILL.md? NIE → STOP, nie wysyłaj odpowiedzi
    z pytaniami, wczytaj skill najpierw.
    Root cause: reguła 21 opisywała POPRAWNY routing tabelaryczny ([8] → PRIMARY),
    ale nie ustanawiała samodzielnego, słownego, bezwarunkowego triggera
    niezależnego od oceny "czy zlecenie jest złożone" — model przy prostym
    doprecyzowaniu ("przygotuj pytania do świadka") pominął ocenę złożoności
    i odpowiedział wprost z pamięci prawniczej, bez żadnego wczytania skilla.
    Zgłoszone i zamknięte w tej samej sesji, co reguła 21 — patrz AUDIT-JOURNAL.md,
    wpis AUDYT-2026-07-12 (kontynuacja F-8 → F-8b).
```

---

## SELF-CHECK (przed każdą odpowiedzią)

Pełny self-check: `view /mnt/skills/user/prawny-router-v3/references/SELF-CHECK.md`

Minimalne bramki obowiązkowe przed każdą odpowiedzią:

```
⛔ BLOK 0A — BRAMKA ANONIMIZERA (wykonaj PRZED wszystkim)
  Szczegóły: view references/KROK0A-anonimizer.md
  decyzja_sesji=null + ≥1 WYSOKI lub ≥2 ŚREDNIE → STOP. Zadaj pytanie. Czekaj.

⛔ BLOK-CP — STATUS AKTYWNYCH CHECKPOINTÓW (dla pism procesowych)
  Który [CP] jest ostatni zamknięty? Czy użytkownik potwierdził?
  Pierwszy niepotwierdzony [CP] = STOP. Nie idź do następnego kroku.
  Lista [CP] → view pisma-procesowe-v3/SKILL.md sekcja MAPA CHECKPOINTÓW

⛔ BLOK-ST — STEP-TRACKER (shared/MOD-STEP-TRACKER.md)
  Czy REJESTR KROKÓW zainicjowany (ST-INIT, KROK 0-ST)?
  Czy są kroki ⚠️ POMINIĘTE bez raportu FAZA 2? → STOP. Zaraportuj. Czekaj a/b.
  ⛔ Generujesz/udostępniasz pismo? → ST-FINAL (REJESTR KROKÓW) MUSI być w tej
  odpowiedzi PRZED present_files. Brak ST-FINAL = NIE wywołuj present_files.

□ ⛔ STATUS PODMIOTÓW — czy wszystkie podmioty (spółki, sądy, organy) mają ✅?
  ⛔ Podmioty oznaczone ⬛ [DO WERYFIKACJI] = ZAKAZ generowania pisma / .docx.
  Oznaczaj ⬛ przy napotkaniu; zdejmuj dopiero po faktycznym web_search/web_fetch.
  Szczegóły STATUS-LIFECYCLE: PRE-W2-VERIFICATION-GATE.md (PRE-W2.0)
□ ⛔ WERYFIKACJA PODMIOTÓW ONLINE [POV-B][POV-C][POV-D] — przed każdym pismem procesowym:
  ⛔ ZASADA FUNDAMENTALNA: dane z dokumentów/akt/umów ≠ ZWERYFIKOWANE.
     Dane z pamięci modelu ≠ ZWERYFIKOWANE. Jedyne źródło: fizyczne web_search/web_fetch.
  [POV-B] web_search/web_fetch dla SĄDU/ORGANU wywołany fizycznie W TEJ ODPOWIEDZI?
          NIE → ⛔ STOP. Wywołaj: web_search "[sąd] [wydział] adres [rok]"
          Potwierdź: pełna nazwa, właściwy wydział dla tego typu sprawy, adres budynku.
  [POV-C] web_search/web_fetch dla POZWANEGO (KRS/NIP/adres) wywołany fizycznie?
          NIE → ⛔ STOP. Wywołaj: web_search "[nazwa] KRS NIP rejestr"
          Potwierdź: firma rejestrowa (≠ handlowa), KRS, NIP, adres z rejestru, status.
  [POV-D] Czy w materiałach dowodowych (umowy, protokoły, SUDOP, inne) pojawiają się
          RÓŻNE numery KRS lub NIP dla podmiotów o zbliżonej nazwie?
          TAK → ⛔ STOP. Zweryfikuj KAŻDY numer KRS/NIP oddzielnie przez web_search.
               ZAKAZ argumentowania o tożsamości/odmienności podmiotów bez tej weryfikacji.
               Rozbieżność = fakt procesowy do wskazania w piśmie (nie błąd analizy).
               Przykład: KRS 0000796445 = HP sp. z o.o. ≠ HP Global (KRS 0001025052).
  NIE do POV-B lub POV-C → ⛔ STOP. NIE generuj pisma bez tych wywołań.
  Wszystkie ✅ → wyświetl raport PRE-W2 (VER-SAD + VER-POZ) → dopiero potem W2.
  Szczegóły: SELF-CHECK-PISMA.md blok PRE-W2 lub PRE-W2-VERIFICATION-GATE.md
□ references/KROK1-detekcja.md wczytany (tryb + hard gate ISAP)?
□ ⛔ HARD GATE TRWAŁY aktywny? (obowiązuje przez całą rozmowę — nie wygasa)
□ ⛔ STEP-TRACKER: REJESTR zainicjowany (ST-INIT) i aktualny po każdym kroku?
□ ⛔ Przed present_files pisma/.docx → ST-FINAL (REJESTR KROKÓW) wyświetlony?
□ Każdy artykuł/termin → web_search/web_fetch faktycznie wywołany W TEJ ODPOWIEDZI?
□ Każdy element → ✅ [VER: źródło] lub ⚠️ [NIEWERYFIKOWANE]?
□ ACTIVATION-MATRIX.md sprawdzony przy nakładaniu się skillów?
□ PRIMARY skill wczytany PRZED analizą? (pismo złożone [3] → pisma-procesowe-v3 — wczytanie OBOWIĄZKOWE)
□ Termin zawity sprawdzony (nakaz/wyrok)?
□ Pismo + materiały źródłowe → shared/FAKTY_v2.md, wynik ✅?
□ LAIK → raport przez przewodnik-prawny-v2 (KROK H)?
□ Bramka chronologiczna → przy ≥2 dokumentach wieloetapowych?
□ ⛔ TRIGGER ŚWIADKA (reguła 22) → jeśli odpowiedź ma zawierać "pytania do
  świadka"/przesłuchanie/kontrprzesłuchanie: czy w TEJ odpowiedzi wykonano
  view przesluchanie-swiadkow-v2-min90/SKILL.md PRZED napisaniem pytań?
  NIE → STOP, nie wysyłaj pytań, wczytaj skill.
□ ⛔ RZ-SHOW (shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md) → jeśli w grze
  są załączniki: pokazano pełny rejestr plików ze statusami ✅/🔶/⬜/➖/⬛
  i — jeśli są ⬜/🔶 — zapytano o kontynuację, ZANIM podano wnioski
  merytoryczne oparte na materiale?
□ DISCLAIMER (shared/DISCLAIMER.md) → OSTATNI element odpowiedzi?
```

---

## RENDEROWANIE WIDGETÓW

> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda inline: `show_widget` z HTML (vanilla JS).
> Pliki .docx / .pdf → present_files (dokumenty do pobrania — tu zasada nie dotyczy).

**Anonimizer — aktualny standard:**
`view /mnt/skills/user/prawny-router-v3/anonimizer/anonimizer-skill.md`

---

## POKRYCIE DZIEDZINOWE (wczytuj tylko gdy potrzebne)

```text
view /mnt/skills/user/prawny-router-v3/references/pokrycie-dziedzinowe.md
```

Tylko gdy: pytanie o dostępność modułu, audyt systemu, budowanie kombinacji multi-skill.

## CHANGELOG (prawny-router-v3)

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

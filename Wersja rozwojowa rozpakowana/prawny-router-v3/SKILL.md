---
name: prawny-router-v3
version: 3.8
type: orchestration
status: production
compatibility: "web_search, web_fetch, show_widget, create_file"
description: |
  Router Prawny v3.8 — orchestrator KAŻDEJ sprawy prawnej. Wykrywa tryb (LAIK/PRAWNIK),
  koordynuje PRIMARY→SECONDARY→FALLBACK, generuje .docx/.pdf.
  UŻYWAJ ZAWSZE i AUTOMATYCZNIE. Nigdy nie analizuj bez wczytania tego pliku.
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

# Router Prawny v3.7 — Spis Treści i Sekwencja Główna

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
KROK 1  → [DETEKCJA TRYBU + HARD GATE] → view references/KROK1-detekcja.md
KROK 2  → [ROUTING [1]–[10]] → poniżej w tym pliku
KROK 3  → Załaduj PRIMARY → SECONDARY → FALLBACK
KROK 4  → Wykonaj analizę / zbierz dane
KROK 5  → Sprawdź TYP WYJŚCIA → SEKWENCJA END-TO-END → poniżej
KROK 5B → [EXPORT KONTEKSTU] → po KROK 5 jeśli sesja zawierała KROK 4a
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
    ⛔ Adres sądu/organu NIGDY z pamięci modelu — zawsze web_search (PRE-W2.B)
    ⛔ KRS/NIP pozwanego NIGDY z pamięci — zawsze weryfikacja rejestru (PRE-W2.C)
    ⛔ Rozbieżność KRS≠NIP w aktach → STOP → weryfikuj każdy numer oddzielnie (PRE-W2.D)
    ⛔ Argument prawny o tożsamości/odmienności podmiotów → WYŁĄCZNIE po PRE-W2.D
    Błędy wyeliminowane: adres SR Katowice-Zachód (ul. Warszawska 45, nie ul. Lompy 14);
    KRS 0000796445 = HP sp. z o.o., nie HP Global (KRS 0001025052) — sesja VII P 94/25
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

□ ⛔ WERYFIKACJA PODMIOTÓW ONLINE [POV-B][POV-C] — przed każdym pismem procesowym:
  [POV-B] web_search/web_fetch dla SĄDU wywołany fizycznie w tej odpowiedzi? TAK/NIE
  [POV-C] web_search/web_fetch dla POZWANEGO (KRS/NIP) wywołany fizycznie? TAK/NIE
  NIE do któregokolwiek → ⛔ STOP. Dane z akt i z pamięci = NIEZWERYFIKOWANE.
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

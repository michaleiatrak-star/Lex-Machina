# MOD-CP-GATE v1.0 — Centralny Kontroler Checkpointów Pisma Procesowego

**Plik kanoniczny:** `/mnt/skills/user/shared/CP-GATE.md`
Wywołanie: `view /mnt/skills/user/shared/CP-GATE.md`

> ⛔ Wczytaj ten moduł na początku każdej sesji pisma procesowego,
> PRZED jakimkolwiek innym krokiem pipeline'u.
> Bez aktywnego CP-GATE generowanie .docx jest ZAKAZANE bezwzględnie.

---

## § 1. ZASADA NADRZĘDNA

Każde pismo procesowe wygenerowane przez pisma-procesowe-v3 przechodzi
przez dwie i tylko dwie fazy statusu:

```
DRAFT   → dopóki nie zamknięto WSZYSTKICH wymaganych checkpointów
FINAL   → wyłącznie po CP-PEER = PEER-OK, zero otwartych ⬛
```

**DRAFT** oznacza, że:
- plik .docx NIE może być złożony do sądu ani organu,
- w nagłówku pliku i w wiadomości czatu widnieje oznaczenie DRAFT,
- każda wygenerowana wersja .docx jest tymczasowa i poglądowa.

**FINAL** oznacza, że:
- wszystkie CP zamknięte i potwierdzone przez użytkownika,
- zero pól ⬛ w treści pisma,
- plik .docx nie zawiera oznaczenia DRAFT,
- pismo nadaje się do złożenia.

⛔ **ZAKAZ ABSOLUTNY:** Model NIE może ogłosić statusu FINAL
   bez faktycznego zamknięcia każdego wymaganego CP.
   Pominięcie nawet jednego CP = status DRAFT bez wyjątku.

---

## § 2. REJESTR CHECKPOINTÓW

Przy starcie każdej sesji pisma model inicjalizuje poniższy rejestr.
Aktualizuje go po każdym zamkniętym CP (użytkownik potwierdził).

```
CP-REJESTR (inicjalizacja — wszystkie OTWARTE):

  [CP-1a]           CLAIM-VALIDATION            ○ OTWARTE
  [CP-1b]           MOD-STRATEGIA-WYBOR         ○ OTWARTE  (warunkowy)
  [CP-1c-skan]      SD-VER KOMPLET              ○ OTWARTE  (gdy pliki)
  [CP-PD]           PORCJOWANIE                 ○ OTWARTE  (gdy ≥30 plików)
  [CP-FSL-D]        FSL-D PER-TEZA              ○ OTWARTE  (gdy SD-VER=KOMPLET i ≥1 teza)
  [CP-1c-macierz]   MACIERZ D×T                 ○ OTWARTE  (gdy ≥2 dowody)
  [CP-1c-lancuch]   ŁAŃCUCH DOWODOWY            ○ OTWARTE  (gdy ≥1 teza)
  [CP-1d-anomalie]  MOD-DOKUMENT-ANOMALIE       ○ OTWARTE  (warunkowy)
  [CP-1d]           MOD-POSZLAKI-KONTEKST       ○ OTWARTE  (gdy ≥1 dok.)
  [CP-W1]           RAPORT W1 KOŃCOWY           ○ OTWARTE
  [CP-PRE-W2]       PRE-W2-VERIFICATION-GATE    ○ OTWARTE
  [CP-ATAK]         MOD-ATAK-NA-DRAFT           ○ OTWARTE
  [CP-PODMIOT]      PODMIOT-GATE W3.0           ○ OTWARTE
  [CP-QUALITY]      LEGAL-QUALITY-GATE          ○ OTWARTE
  [CP-AUDYT]        AUDYT-KOŃCOWY               ○ OTWARTE
  [CP-PEER]         PEER-REVIEW + POST-VALID.   ○ OTWARTE

STATUS DOKUMENTU:   ⚠️ DRAFT — NIE SKŁADAĆ
OTWARTE CP:         15 (lub mniej gdy warunkowe nieaktywne)
ZAMKNIĘTE CP:       0
```

---

## § 3. PROCEDURA ZAMYKANIA CP

Po wykonaniu każdego kroku CP model:

**3.1** Wyświetla raport CP w formacie:
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ CHECKPOINT [CP-XXX] — [NAZWA] — ZAKOŃCZONY               │
│                                                             │
│ Wykonane:  [lista kroków]                                   │
│ Wyniki:    [kluczowe ustalenia]                             │
│ Problemy:  [lista ⚠️ lub BRAK]                             │
│                                                             │
│ REJESTR CP (aktualny):                                      │
│   ✅ zamknięte: [lista]                                     │
│   ○  otwarte:   [lista]                                     │
│   STATUS:       ⚠️ DRAFT — NIE SKŁADAĆ                     │
│                                                             │
│ ➡️ Kontynuować do [NASTĘPNY CP]? "tak" / uwagi             │
└─────────────────────────────────────────────────────────────┘
```

**3.2** Kończy odpowiedź. Zero tekstu po raporcie CP.

**3.3** Czeka na wiadomość użytkownika ("tak" / "ok" / uwagi).

**3.4** Po otrzymaniu potwierdzenia:
  - aktualizuje rejestr: zmienia `○ OTWARTE` → `✅ ZAMKNIĘTE [data/godz.]`
  - przechodzi do następnego kroku

⛔ Bez wiadomości użytkownika model NIE przechodzi dalej — nawet jeśli
   użytkownik wcześniej napisał "rób automatycznie" lub "bez checkpointów".

---

## § 3A. REGUŁA ZAKAZU FAŁSZYWEGO N/A (CRIT-NA)

⛔ **CP-ZAKAZ-NA — nadrzędny wobec wszystkich oznaczeń N/A:**

```
Checkpointy warunkowe mają WYŁĄCZNIE JEDEN warunek aktywacji — wskazany przy CP.
Warunek wyłączający N/A jest WYŁĄCZNIE techniczny (warunek w nawiasie).
N/A NIGDY nie może wynikać z:
  - typu pisma (rozszerzenie, apelacja, pozew, riposta — bez znaczenia)
  - przekonania modelu że "pismo proste"
  - oceny że "dowodów jest mało"
  - braku explicite prośby użytkownika o macierz/łańcuch

WERYFIKACJA przed oznaczeniem N/A — model MUSI odpowiedzieć:
  □ [CP-FSL-D]:       Czy SD-VER=KOMPLET i czy istnieje ≥1 teza? 
                        TAK → AKTYWNY. NIE oznaczaj N/A.
  □ [CP-1c-macierz]:  Czy użytkownik dostarczył ≥2 dowody (pliki)?
                        TAK → AKTYWNY. NIE oznaczaj N/A.
  □ [CP-1c-lancuch]:  Czy istnieje ≥1 teza główna do wykazania?
                        TAK → AKTYWNY. NIE oznaczaj N/A.
  □ [CP-1b]:          Czy istnieją ≥2 ścieżki prawne LUB anomalia podmiotowa?
                        TAK → AKTYWNY. NIE oznaczaj N/A.
  □ [CP-1d-anomalie]: Czy w materiałach są rozbieżne KRS/NIP lub anomalia danych?
                        TAK → AKTYWNY. NIE oznaczaj N/A.

⛔ Oznaczenie N/A bez jawnego uzasadnienia per warunek techniczny = BŁĄD KRYTYCZNY.
   Format wymaganego uzasadnienia: "N/A — warunek '[warunek w nawiasie]' = NIE:
   [wyjaśnienie dlaczego techniczny warunek nie jest spełniony]"

   Przykład poprawny:   "N/A — warunek 'gdy ≥2 dowody' = NIE: użytkownik dostarczył
                         0 plików w tej sesji"
   Przykład niepoprawny: "N/A — pismo rozszerzające, nie nowy pozew"
   Przykład niepoprawny: "N/A — sprawa prosta, jeden świadek"
```

---

## § 4. BRAMKA PRZED KAŻDYM WYWOŁANIEM .docx

Przed KAŻDYM wywołaniem bash_tool/create_file tworzącym plik .docx model
wykonuje CP-CHECK:

```
CP-CHECK (obligatoryjny — nie można pominąć):

  Sprawdź CP-REJESTR:
  → Czy CP-PEER = ✅ ZAMKNIĘTE ?
      TAK: → czy zero pól ⬛ w piśmie?
              TAK: STATUS = FINAL → generuj .docx bez oznaczenia DRAFT
              NIE: → CP-CHECK FAIL — wyświetl komunikat FAIL i STOP
      NIE: → CP-CHECK FAIL — wyświetl komunikat FAIL i STOP

  ⛔ Dodatkowa kontrola CP-FSL-D (CRIT):
  → Czy [CP-FSL-D] zamknięty lub uzasadniony N/A (per §3A)?
      NIE → CP-CHECK FAIL z komunikatem:
            "⛔ CP-FSL-D niezamknięty — per-teza weryfikacja dowodów
             nie wykonana. Pismo może pomijać kluczowe dowody.
             Wykonaj FSL-D-SCAN per każdą tezę przed generacją."

CP-CHECK FAIL — komunikat obowiązkowy:
  ⛔ CP-CHECK FAIL — nie mogę wygenerować wersji FINAL.
  
  Otwarte checkpointy blokujące:
    [lista otwartych CP z opisem co jest wymagane]
  
  Mogę wygenerować wersję DRAFT (poglądową) — czy chcesz?
  Wersja DRAFT będzie oznaczona "NIE SKŁADAĆ" w nagłówku.
  Odpowiedz: "tak draft" / "nie"
```

---

## § 5. OZNACZENIE DRAFT W PLIKU .docx

Gdy model generuje plik .docx przy otwartych CP (wersja DRAFT):

**5.1** W nagłówku KAŻDEJ strony dokumentu dodaje watermark:
```
⚠️ DRAFT — WERSJA ROBOCZA — NIE SKŁADAĆ DO SĄDU
Otwarte checkpointy: [lista skrócona]
Wygenerowano: [data] | Status: WYMAGA WERYFIKACJI
```

**5.2** W wiadomości czatu po present_files dodaje:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  UWAGA — PLIK JEST WERSJĄ ROBOCZĄ (DRAFT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ten plik NIE jest gotowy do złożenia w sądzie.
Wymagane przed wersją FINAL:
  [lista otwartych CP z krótkim opisem]

Następny krok: [nazwa kolejnego CP]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**5.3** Plik nazywa się z przyrostkiem `_DRAFT`:
```
Pismo_[nazwa]_DRAFT.docx
```

---

## § 6. OZNACZENIE FINAL W PLIKU .docx

Gdy CP-CHECK = PASS (CP-PEER zamknięty, zero ⬛):

**6.1** Brak watermarku w nagłówku — czysta strona.

**6.2** W stopce każdej strony:
```
Wygenerowano: [data] | Wszystkie checkpointy zamknięte ✅ | Gotowe do złożenia
```

**6.3** Plik nazywa się bez przyrostka:
```
Pismo_[nazwa].docx
```

**6.4** W wiadomości czatu po present_files:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  PISMO FINALNE — GOTOWE DO ZŁOŻENIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wszystkie checkpointy zamknięte. Zero pól ⬛.
Pismo spełnia wymogi kancelaryjne pisma-procesowe-v3.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## § 7. REGUŁY CIĄGŁOŚCI SESJI

**7.1 Wznowienie sesji** — gdy użytkownik wraca po przerwie:
  - Model wczytuje CP-GATE i odtwarza stan rejestru z historii rozmowy.
  - Wyświetla aktualny rejestr CP na żądanie lub przy pierwszym piśmie.
  - Nie resetuje zamkniętych CP bez wyraźnej prośby użytkownika.

**7.2 Korekta pisma po CP-PEER** — gdy użytkownik prosi o zmianę:
  - Małe zmiany redakcyjne (literówki, formatowanie): nie resetują CP.
  - Zmiana twierdzeń faktycznych lub podstawy prawnej: resetuje CP-ATAK,
    CP-QUALITY, CP-AUDYT, CP-PEER → STATUS wraca do DRAFT.
  - Model informuje użytkownika o resecie przed jego wykonaniem.

**7.3 Pokazanie stanu rejestru na żądanie:**
  Frazy wyzwalające: "status checkpointów" / "jakie kroki zostały" /
  "ile kroków zostało" / "pokaż rejestr" / "czy mogę złożyć pismo"
  → Model wyświetla pełny CP-REJESTR z aktualnym statusem.

---

## § 8. TECHNIKALIA — WATERMARK W .docx

Watermark DRAFT implementowany przez docx-skill jako nagłówek sekcji:

```javascript
// Fragment JS do wklejenia przy każdym DRAFT
const draftHeader = new Header({
  children: [new Paragraph({
    children: [new TextRun({
      text: "⚠️ DRAFT — WERSJA ROBOCZA — NIE SKŁADAĆ DO SĄDU | " +
            "Otwarte CP: [lista] | " + new Date().toLocaleDateString('pl-PL'),
      font: "Arial", size: 18, bold: true, color: "CC0000"
    })],
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CC0000" } }
  })]
});

// Dodaj do każdej sekcji dokumentu:
// headers: { default: draftHeader }
```

Watermark FINAL (stopka):
```javascript
const finalFooter = new Footer({
  children: [new Paragraph({
    children: [new TextRun({
      text: "Wygenerowano: " + new Date().toLocaleDateString('pl-PL') +
            " | Wszystkie checkpointy zamknięte ✅ | Gotowe do złożenia",
      font: "Arial", size: 18, color: "006600"
    })],
    alignment: AlignmentType.CENTER
  })]
});
// footers: { default: finalFooter }
```

---

## § 9. INTEGRACJA Z PISMA-PROCESOWE-V3

Wywołanie CP-GATE w pipeline:

```
STAN 0 (przed routing):
  view /mnt/skills/user/shared/CP-GATE.md
  → zainicjalizuj CP-REJESTR
  → STATUS = DRAFT

Po każdym zamkniętym CP:
  → zaktualizuj CP-REJESTR (○ → ✅)
  → wyświetl raport CP z aktualnym rejestrem
  → STOP → czekaj na użytkownika

Przed każdym bash_tool tworzącym .docx:
  → CP-CHECK (§4)
  → PASS → FINAL (§6)
  → FAIL → DRAFT (§5) lub STOP

Finalne usuniecie DRAFT:
  → dopiero po CP-PEER = PEER-OK + zero ⬛
  → zmień nazwę pliku: usuń przyrostek _DRAFT
  → zmień nagłówek: usuń watermark
  → zmień stopkę: wstaw znacznik FINAL
```

---

## § 10. SAMODIAGNOZA — BŁĄD KRYTYCZNY

Jeśli model wykryje, że wygenerował .docx bez CP-CHECK:

```
⛔ BŁĄD KRYTYCZNY CP-GATE — pismo wygenerowane z pominięciem checkpointów.

Dotyczy: [nazwa pliku]
Pominięte CP: [lista]
Sesja: [data]

DZIAŁANIE NAPRAWCZE (obligatoryjne, natychmiast):
  1. Dodaj do wiadomości czatu komunikat DRAFT (§5.2)
  2. Poinformuj użytkownika że plik jest wersją roboczą
  3. Nie składaj pisma — kontynuuj od brakującego CP
  4. Po zamknięciu wszystkich CP wygeneruj wersję FINAL

Tej naprawy nie można pominąć ani odroczyć.
```

---

## HISTORIA WERSJI

```
v1.1.0  2026-06-27  Naprawy z audytu VII P 94/25:
                    1. Dodano [CP-FSL-D] do CP-REJESTRU (aktywny gdy SD-VER=KOMPLET i ≥1 teza)
                    2. Dodano §3A REGUŁA ZAKAZU FAŁSZYWEGO N/A (CRIT-NA):
                       N/A wyłącznie gdy techniczny warunek aktywacji = NIE;
                       zakaz N/A z powodu "typ pisma" / "prosta sprawa" / "brak prośby"
                    3. Dodano kontrolę CP-FSL-D w bramce CP-CHECK (§4)
                    Root cause: w sprawie VII P 94/25 CP-1c-macierz i CP-1c-lancuch
                    oznaczono N/A "pismo rozszerzające" — mimo 35 plików i 3 tez.
                    FSL-D nie istniał w rejestrze → nie blokował .docx.

v1.0.0  2026-06-24  Pierwsza wersja — lekcja z sesji VII P 94/25.
                    Przyczyna: model wygenerował .docx (15 stron) bez
                    żadnego z 14 wymaganych checkpointów, co grozi
                    złożeniem niezweryfikowanego pisma do sądu.
```

# MOD-CP-GATE v1.0 — Centralny Kontroler Checkpointów Pisma Procesowego

**Plik kanoniczny:** `shared/CP-GATE.md`
Wywołanie: `view shared/CP-GATE.md`

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

**3.2** CP DECYZYJNY (§3C): kończy odpowiedź, zero tekstu po raporcie CP.
CP INFORMACYJNY (§3C): przechodzi do następnego CP w tej samej odpowiedzi.

**3.3** Przy CP DECYZYJNYM czeka na wiadomość użytkownika ("tak" / "ok" / uwagi).

**3.4** Po otrzymaniu potwierdzenia:
  - aktualizuje rejestr: zmienia `○ OTWARTE` → `✅ ZAMKNIĘTE [data/godz.]`
  - przechodzi do następnego kroku

⛔ Bez wiadomości użytkownika model NIE przechodzi przez CP DECYZYJNY (§3C) —
   nawet jeśli użytkownik wcześniej napisał "rób automatycznie" lub "bez checkpointów".
   CP INFORMACYJNE wykonuje bez zatrzymania (§3C).

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

## § 3B. BRAK-DOK — BRAK DOKUMENTU TO INFORMACJA, NIE BLOKADA

Nadrzędne wobec każdego „STOP” / „BLOKADA” wywołanego wyłącznie brakiem dokumentu
(SD-GATE-0, SD-VER, SD-GATE-4, FSL-D-INIT, PRZYPADEK B FSL-D, CP-CHECK, HYBRID-VAL Block Zero).

```
BRAK-DOK = dokument, którego nie ma w materiale, a który:
  (1) użytkownik wskazał jako nieposiadany / „do uzupełnienia później” / „pomiń”, LUB
  (2) figuruje w rejestrze aplikacji, ale nie ma jego identyfikatora ani treści
      (rozbieżność liczby pozycji rejestru i widocznych plików), LUB
  (3) wynika z treści sprawy (np. postanowienie o umorzeniu), ale nie został wgrany.

NIE jest BRAK-DOK: plik wgrany, lecz nieodczytany -> nadal SD-READ (ponów odczyt).

Postępowanie:
  1. Wpisz pozycję do REJESTRU BRAK-DOK: nazwa/opis, do czego potrzebny (teza T[n]),
     źródło wiedzy o nim (akta / wypowiedź użytkownika / rejestr aplikacji).
  2. Twierdzenie oparte na brakującym dokumencie = „według informacji strony”
     (lub wniosek dowodowy o dopuszczenie dokumentu z akt organu), nigdy fakt urzędowy.
  3. Pytanie o brakujący dokument zadaj RAZ, w raporcie bieżącego CP — i pracuj dalej.
     Odpowiedź „brak”, „pomiń”, „nie mam”, „uzupełnię później”, „zamknij”, „tak”,
     „kontynuuj” = decyzja d) z PYTAŃ FSL-D (akceptuję lukę). Nie pytaj ponownie.
  4. CP zamykasz jako „ZAMKNIĘTY Z BRAKAMI (BRAK-DOK: N)”. Ten status = zamknięty
     dla §4 CP-CHECK, ZAKAZ-FSL-D, SD-GATE-4 i HYBRID-VAL. Nie jest krokiem
     „zablokowanym” ani „pominiętym” w ST-FINAL.
  5. REJESTR BRAK-DOK trafia do pliku wynikowego: sekcja „UWAGI REDAKCYJNE —
     dokumenty do uzupełnienia” (DRAFT) oraz do raportu końcowego na czacie.
     W treści pisma: wniosek dowodowy lub „według informacji strony”, bez symboli.
  6. Pozycja z (2) bez treści: podaj w raporcie wszystko, co wiadomo (numer w rejestrze,
     nazwa pliku jeśli widoczna, liczba brakujących pozycji), żeby użytkownik mógł
     ją odszukać i wgrać. Nie zgaduj treści, nie uznawaj za neutralną.

ZAKAZ-BRAK-DOK: zatrzymanie pipeline, odmowa zamknięcia CP lub odmowa zapisania
  pliku DRAFT z powodu samego BRAK-DOK = błąd pipeline. Status FINAL nadal wymaga
  zera ⬛ w treści pisma (§1) — BRAK-DOK obniża status do DRAFT, nie zatrzymuje pracy.
```

---

## § 3C. TRYB PIPELINE-SZYBKI — SCALANIE CHECKPOINTÓW

Tryb pipeline ma działać w tempie TRYB-AUTO. Różnica: zatrzymuje się tylko na
checkpointach, w których decyzja należy do użytkownika.

```
CP DECYZYJNE (STOP — czekaj na odpowiedź):
  CP-1a  tylko gdy C0 wykrył nowe wątki (T_BRAK) do wyboru zakresu
  CP-1b  wybór strategii
  CP-FSL-D tylko gdy luka KRYTYCZNA (nie BRAK-DOK, §3B) bez wcześniejszej decyzji
  CP-PD  gdy ≥30 plików (plan partii)
  CP-ATAK gdy wynik ATAK-KRYTYCZNY
  przed .docx: INFORMACJA WARUNKOWA (a/b) — jeden raz, na końcu

CP INFORMACYJNE (wykonaj, zaraportuj jednym blokiem, NIE zatrzymuj się):
  wszystkie pozostałe: CP-1c-skan, CP-FSL-D (bez luki krytycznej), CP-1c-macierz,
  CP-1c-lancuch, CP-1d-anomalie, CP-1d, CP-W1, CP-PRE-W2, CP-PODMIOT, CP-QUALITY,
  CP-AUDYT, CP-PEER (PEER-OK / PEER-UWAGI)

Reguły:
  1. Po potwierdzeniu użytkownika („tak”, „ok”, „kontynuuj”, „dalej”, „zamknij i rób
     dalej”) zamknij bieżący CP i wykonaj kolejne CP INFORMACYJNE w tej samej
     odpowiedzi, aż do najbliższego CP DECYZYJNEGO albo do końca pipeline.
  2. Każdy wykonany CP = krótki blok raportu (Wykonane / Wyniki / Problemy) w tej
     samej odpowiedzi; rejestr CP wyświetl raz, na końcu odpowiedzi.
  3. CP zamknięty i potwierdzony nie jest raportowany ponownie. Rozbieżność między
     rejestrem CP z historii rozmowy a wskaźnikiem kroku aplikacji: rozstrzyga rejestr
     z potwierdzeniem użytkownika (§7.1) — przejdź do następnego CP, nie powtarzaj
     raportu zamkniętego CP.
  4. Limit odpowiedzi (długość / liczba kroków): przerwij po pełnym CP i dopisz
     „Następny: [CP]”. Kolejna wiadomość użytkownika wznawia od tego CP.
  5. Użytkownik napisze „pełne checkpointy” / „krok po kroku” -> wróć do trybu §3
     (STOP po każdym CP).

Tryb §3C jest DOMYŚLNY dla pipeline pisma. §3.2–3.3 (STOP po każdym CP)
stosuje się tylko na żądanie z reguły 5 i do CP DECYZYJNYCH.
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
  → Czy [CP-FSL-D] zamknięty (także ZAMKNIĘTY Z BRAKAMI, §3B) lub uzasadniony N/A (per §3A)?
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
  view shared/CP-GATE.md
  → zainicjalizuj CP-REJESTR
  → STATUS = DRAFT

Po każdym zamkniętym CP:
  → zaktualizuj CP-REJESTR (○ → ✅)
  → wyświetl raport CP
  → CP DECYZYJNY: STOP → czekaj na użytkownika
  → CP INFORMACYJNY: następny CP w tej samej odpowiedzi (§3C)
  → BRAK-DOK: adnotacja + REJESTR BRAK-DOK, bez STOP (§3B)

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

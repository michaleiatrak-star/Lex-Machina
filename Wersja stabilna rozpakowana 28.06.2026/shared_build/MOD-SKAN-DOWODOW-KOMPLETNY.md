# MOD-SKAN-DOWODOW-KOMPLETNY — Pełna inwentaryzacja i weryfikacja odczytania 100% stron

> **Plik:** `/mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md`
> **Wersja:** 1.1.0 (2026-06-22)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - prawny-router-v3: KROK 0C-EXT — rozszerzenie KROK 0C, wykonywane PO rozpakowaniu ZIP,
>     PRZED PD0 z MOD-PORCJOWANIE-DOWODOW
>   - pisma-procesowe-v3: W1.2c-PRE — PRZED MOD-MACIERZ-DOWOD-TEZA i PRZED PD0
>   - analizator-dowodow-v3: BLOK-B-EXT — rozszerzenie BLOK B, PRZED MD1
>
> **Relacja z MOD-PORCJOWANIE-DOWODOW:**
>   MOD-PORCJOWANIE-DOWODOW zarządza ROZMIAREM partii (ile plików naraz).
>   MOD-SKAN-DOWODOW-KOMPLETNY zarządza KOMPLETNOŚCIĄ (czy odczytano KAŻDĄ stronę każdego pliku).
>   Oba są obowiązkowe i wzajemnie komplementarne. Kolejność: ten moduł PRZED porcjowaniem.

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Problem pierwotny (sprawa VII P 94/25, 2026-06-22):**
Model przystąpił do generowania pisma procesowego na podstawie częściowej analizy dowodów:
- ZIP z 35 plikami — odczytano wybrane, pominięto inne
- ODT z obrazami — próbowano ekstrakcji tekstu (puste), nie dokonano rasteryzacji obrazów
- Protokół rozprawy — odczytano, ale nie wyekstrahowano kluczowego faktu (Nawrot: premia PFRON)
- Tabele XLS — odczytano jedną zakładkę, pominięto pozostałe
- Wynik: pismo z błędną kwotą roszczenia (brak oparcia o zeznania świadka)

**Problem wtórny:**
Model próbował generować tezy i analizować, gdy użytkownik wspomniał o "załącznikach dowodach"
ale żadnych plików fizycznie nie wgrał — zamiast zatrzymać się i zażądać plików.

**Zasada nadrzędna tego modułu:**
> ⛔ KAŻDA STRONA KAŻDEGO DOKUMENTU MUSI BYĆ FAKTYCZNIE ODCZYTANA.
> Pominięcie choćby jednej strony = BŁĄD KRYTYCZNY.
> Generowanie pisma bez pełnego skanowania = ZAKAZ BEZWZGLĘDNY.

---

## FAZA 0 — BRAMKA ZAŁĄCZNIKOWA (wykonaj NATYCHMIAST po detekcji kontekstu)

```
⛔ SD-GATE-0: BRAMKA WYKRYWANIA ZAŁĄCZNIKÓW

WYKRYJ w treści wiadomości użytkownika SŁOWA KLUCZOWE sugerujące załączniki:
  "załącznik" / "załączniki" / "dowody" / "dokumenty" / "w załączniku" /
  "w pliku" / "wgrałem" / "dodaję" / "dołączam" / "przesyłam" /
  "skany" / "akta" / "umowy" / "faktury" / "korespondencja" /
  "protokół" / "wyrok" / "pismo" (bez wyraźnego cytowania treści w wiadomości)

SPRAWDŹ: czy w bieżącej wiadomości faktycznie istnieje plik do odczytania?
  TEST 1: czy w uploads/ jest plik?  → bash: ls -la /mnt/user-data/uploads/ 2>/dev/null
  TEST 2: czy w kontekście jest blok <uploaded_files> z ścieżkami plików?
  TEST 3: czy użytkownik wkleił treść dokumentu bezpośrednio w wiadomości?

WYNIK:
  Słowa kluczowe + BRAK pliku + BRAK treści wklejonej:
    → ⛔ SD-GATE-0-STOP
    → Wyświetl komunikat:
      "⚠️ W treści wiadomości wskazujesz na załączniki/dowody, ale nie wykryłem
       żadnych wgranych plików. Przed przystąpieniem do analizy i generowania
       pisma, proszę wgrać dokumenty, o których mowa.
       Nie mogę przystąpić do pracy bez faktycznego odczytania dowodów —
       pominięcie dokumentów to błąd krytyczny."
    → STOP. Czekaj na wgranie plików.

  Słowa kluczowe + JEST plik LUB wklejona treść:
    → Kontynuuj do FAZY 1.

  Brak słów kluczowych (czyste pytanie prawne bez materiałów):
    → Pomiń ten moduł. Kontynuuj normalnie.
```

---

## FAZA 1 — PEŁNA INWENTARYZACJA MATERIAŁU (SD-INW)

```
⛔ HARD GATE: Nie przystępuj do analizy żadnego pliku bez wykonania SD-INW.

KROK SD-INW.1 — Zidentyfikuj WSZYSTKIE pliki dostępne do analizy:
  Źródło A: /mnt/user-data/uploads/ → bash: ls -la /mnt/user-data/uploads/
  Źródło B: bloki <uploaded_files> w kontekście
  Źródło C: treść wklejona przez użytkownika

  Dla pliku ZIP → NATYCHMIAST rozpakuj i zinwentaryzuj zawartość:
    bash: unzip -l [plik.zip] | grep -v "^Archive" | tail -n +4 | head -200

KROK SD-INW.2 — Dla KAŻDEGO pliku ustal:
  a) nazwa pliku (dokładna)
  b) typ (PDF-tekst / PDF-skan / DOCX / ODT-obraz / XLSX / JPG / PNG / ZIP)
  c) rozmiar w KB
  d) liczba stron (dla PDF: pdfinfo; dla XLSX: liczba zakładek)
  e) metoda odczytu wymagana:
       PDF-tekst    → pdftotext + ewentualnie pdftoppm per stronę
       PDF-skan     → pdftoppm (KAŻDA strona osobno) + view
       DOCX         → zipfile word/document.xml extract
       ODT-z-obrazem→ zipfile content.xml (czy pusty?) + wyodrębnij obrazy + view
       XLSX         → openpyxl (KAŻDA zakładka)
       JPG/PNG      → view bezpośrednio
       ZIP          → REGUŁA-ZIP: zawartość, nie kontener

KROK SD-INW.3 — Zbuduj REJESTR PLIKÓW (SD-REJ):
  ┌─────────────────────────────────────────────────────────────────────┐
  │ REJESTR PLIKÓW DO ANALIZY — [sygnatura / data]                      │
  │ Łącznie: [N] plików / [N] stron PDF / [N] obrazów / [N] zakładek   │
  ├─────┬────────────────────────────┬──────┬──────┬───────────────────┤
  │ ID  │ Nazwa pliku                │ Typ  │ Str. │ Status odczytu    │
  ├─────┼────────────────────────────┼──────┼──────┼───────────────────┤
  │ D01 │ umowa1.pdf                 │ skan │  1   │ ⬜ OCZEKUJE       │
  │ D02 │ Protokol_rozprawy.pdf      │ tekst│  3   │ ⬜ OCZEKUJE       │
  │ D03 │ Pracownicy.xlsx            │ xlsx │  5*  │ ⬜ OCZEKUJE       │
  │     │                            │      │ *zak.│                   │
  └─────┴────────────────────────────┴──────┴──────┴───────────────────┘

KROK SD-INW.4 — Wyświetl SD-REJ użytkownikowi z komunikatem:
  "📋 Zinwentaryzowałem [N] plików ([X] KB, [Y] stron/obrazów).
   Przystępuję do odczytania KAŻDEJ strony każdego dokumentu.
   [Jeśli ≥ OSTRZEŻENIE: Materiał podzielę na partie per MOD-PORCJOWANIE-DOWODOW.]"
```

---

## FAZA 2 — PROTOKÓŁ ODCZYTU (SD-READ)

```
⛔ ZASADA KOMPLETNOŚCI:
  Dla PDF wielostronicowego → odczytaj WSZYSTKIE strony, nie tylko str. 1.
  Dla XLSX wielozakładkowego → odczytaj WSZYSTKIE zakładki, nie tylko pierwszą.
  Dla ODT z obrazami → jeśli content.xml pusty → wyodrębnij KAŻDY obraz + view.
  Dla ZIP → nie traktuj jako "1 plik" — zinwentaryzuj i przeanalizuj zawartość.

KROK SD-READ.1 — Per każdy plik D[id] wykonaj protokół:

  [PDF]
    A. Diagnostyka: pdfinfo + pdffonts
    B. Jeśli pdffonts → fonty obecne → pdftotext -layout → zapisz wynik
       Jeśli BRAK fontów → skan → pdftoppm -jpeg -r 120 -f 1 -l [N_str] → view PER STRONĘ
    C. Weryfikacja: czy wynik jest czytelny? Jeśli nie → rasteryzacja per strona
    D. Aktualizuj SD-REJ: D[id] → ✅ ODCZYTANY (str. 1/[N])...✅ ODCZYTANY (str. [N]/[N])
    E. ⛔ ZAKAZ POMINIĘCIA STRONY: każda strona musi mieć wpis w SD-REJ

  [XLSX]
    A. python3 openpyxl: wb.sheetnames → lista zakładek
    B. Per KAŻDA zakładka: iterate rows → wypisz dane
    C. Aktualizuj SD-REJ: D[id] → ✅ ODCZYTANA zakładka "[nazwa]"... (każda)
    D. ⛔ ZAKAZ POMIJANIA ZAKŁADEK: każda zakładka = osobny wpis w SD-REJ

  [ODT]
    A. zipfile content.xml → czy zawiera tekst?
    B. Jeśli PUSTY lub minimalny → wyodrębnij obrazy: zipfile Pictures/* → /tmp/
    C. Per KAŻDY obraz z ODT: view → wypisz treść wizualną
    D. Aktualizuj SD-REJ: D[id] → ✅ ODCZYTANY obraz [1/N]...[N/N]

  [JPG/PNG standalone]
    A. view → opis treści
    B. Aktualizuj SD-REJ: D[id] → ✅ ODCZYTANY

  [DOCX]
    A. zipfile word/document.xml → regex strip tags → tekst
    B. Jeśli tekst < 50 znaków → prawdopodobnie osadzony obraz → sprawdź word/media/*
    C. Aktualizuj SD-REJ: D[id] → ✅ ODCZYTANY

KROK SD-READ.2 — Po odczytaniu każdego pliku: ekstrakcja faktów do SD-FAKTY:
  SD-FAKTY[D[id]] = {
    typ_dokumentu: [umowa / protokół / korespondencja / tabela / inne],
    strony_odczytane: [n]/[N_stron],  ← MUSI być n = N_stron
    kluczowe_fakty: [ "fakt 1", "fakt 2", ... ],
    daty_kluczowe: [ "RRRR-MM-DD: zdarzenie" ],
    kwoty: [ "X zł — opis" ],
    podmioty: [ "Nazwa — rola" ],
    cytaty_procesowe: [ "cytat — znaczenie dowodowe" ]
  }
```

---

## FAZA 3 — WERYFIKACJA KOMPLETNOŚCI (SD-VER)

```
⛔ SD-GATE-3: BRAMKA KOMPLETNOŚCI — wykonaj PRZED przekazaniem wyników do W1.3 / MD1

KROK SD-VER.1 — Sprawdź SD-REJ:
  Czy każdy plik D[id] ma status ✅ ODCZYTANY?
  Czy dla każdego PDF: strony_odczytane = N_stron_łącznie?
  Czy dla każdego XLSX: wszystkie zakładki przeanalizowane?
  Czy dla każdego ODT z obrazami: wszystkie obrazy z Pictures/ odczytane?

KROK SD-VER.2 — Klasyfikacja wyników:
  ✅ KOMPLET: wszystkie pliki odczytane, wszystkie strony ✅
    → Kontynuuj do W1.3 / MD1 / macierzy

  ⚠️ BRAKI ISTOTNE: ≥1 plik ze statusem ⬜ lub str. odczytane < N_stron:
    → Wróć do SD-READ.1 dla brakujących plików/stron
    → Nie kontynuuj do analizy bez zamknięcia braków

  ⛔ BRAKI KRYTYCZNE: ≥1 plik całkowicie nieodczytany:
    → HARD STOP
    → Poinformuj użytkownika: "Plik [D[id]] nie został odczytany. Nie mogę
      przystąpić do generowania pisma. Próbuję ponownie..."
    → Ponów odczyt z alternatywną metodą (rasteryzacja / inna biblioteka)
    → Jeśli ponowny odczyt niemożliwy → ⚠️ [NIEODCZYTALNY] + informacja dla użytkownika

KROK SD-VER.3 — Wygeneruj RAPORT SD-VER (wyświetl użytkownikowi):
  ┌─────────────────────────────────────────────────────────────┐
  │ ✅ CHECKPOINT SD-VER — [N] plików / [M] stron / [K] obrazów    │
  │ Status: KOMPLET / BRAKI ISTOTNE / BRAKI KRYTYCZNE               │
  │                                                                 │
  │ REJESTR PLIKÓW (SD-REJ):                                        │
  │  D01: [nazwa] — ✅ ODCZYTANY (str. X/X)                        │
  │  D02: [nazwa] — ✅ ODCZYTANY (zakładki: A,B,C)                 │
  │  D0N: [nazwa] — ⚠️ NIEODCZYTALNY (powód)                       │
  │                                                                 │
  │ KLUCZOWE FAKTY WYEKSTRAHOWANE (SD-FAKTY):                       │
  │  → [fakt 1 — źródło D[id]]                                     │
  │  → [fakt 2 — źródło D[id]]                                     │
  │  → [fakt kluczowy — np. kwota premii z zeznań świadka D[id]]   │
  │                                                                 │
  │ DOKUMENTY NIEODCZYTALNE: [brak / lista z ⚠️]                   │
  │                                                                 │
  │ REJESTR KROKÓW (aktualizacja MOD-STEP-TRACKER):                │
  │   ✅ wykonane: R0C (SD-VER)                                     │
  │   ○  oczekujące: R1, R2, W1-CLAIM, W1-STRAT, W1-MACIERZ,      │
  │                  PRE-W2, W2-DRAFT, W3-PODMIOT, W3-LQG,         │
  │                  W3-AUDYT, W3-PEER, HYBRID, DOCX               │
  │   ℹ️ Następne kroki wymagane przed wygenerowaniem pisma.        │
  │      Analiza dowodów kompletna — pipeline pisma NIE ROZPOCZĘTY. │
  │                                                                 │
  │ ➡️ Kontynuować do analizy? Odpowiedz: "tak" / uwagi            │
  └─────────────────────────────────────────────────────────────┘

  ⛔ CHECKPOINT-CP-SKAN: PO wyświetleniu raportu — ZAKOŃCZ ODPOWIEDŹ.
  NIE kontynuuj do W1.3 / analizy / macierzy bez wiadomości użytkownika.
  Nawet gdy SD-VER = KOMPLET — raport musi trafić do użytkownika jako
  osobna wiadomość przed kontynuacją. To jest fizyczna bramka procesu.
```

---

## FAZA 4 — INTEGRACJA Z PIPELINE GENEROWANIA PISMA

```
⛔ SD-GATE-4: BRAMKA PRE-GENERACJI

Przed uruchomieniem W2 (projekt pisma) / MD2 (macierz dowód-teza):
  □ SD-REJ istnieje i jest kompletny (każdy D[id] = ✅)?
  □ SD-VER.2 = KOMPLET?
  □ SD-FAKTY wypełnione dla każdego D[id]?

  Którykolwiek = NIE:
    → ⛔ BLOKADA W2 / MD2
    → "Nie mogę wygenerować pisma — analiza dowodów niekompletna.
       Brakuje: [lista D[id] ze statusem ⬜]."
    → Wróć do SD-READ.1

  Wszystkie = TAK:
    → ⛔ OBOWIĄZKOWY NASTĘPNY KROK: MOD-FSL-DOKUMENTY (W1.2c-FSL-D)
       view /mnt/skills/user/shared/MOD-FSL-DOKUMENTY.md
       ZAKAZ przekazywania SD-FAKTY bezpośrednio do macierzy D×T z pominięciem FSL-D.
       FSL-D wykonuje per-teza przeszukanie WSZYSTKICH D[id] z zakazem cytowania z pamięci.
       Dopiero FSL-D-MACIERZ (nie SD-FAKTY) trafia do W1.3 / MOD-MACIERZ-DOWOD-TEZA.

⛔ ZASADA ZERO-POMINIĘĆ:
  Każdy fakt kluczowy wyekstrahowany z SD-FAKTY MUSI być rozważony
  przy budowie mapy teza→przesłanka→dowód (W1.3 / MT2).
  Jeśli fakt nie pasuje do żadnej tezy → zapisz jako D[id]-ORPHAN
  i zasygnalizuj użytkownikowi: możliwa nowa teza / nowe roszczenie.

SZCZEGÓLNA UWAGA — ZEZNANIA ŚWIADKÓW (protokoły sądowe):
  Protokół rozprawy to dokument procesowy najwyższej rangi dowodowej.
  Per każde zeznanie świadka:
    - imię i nazwisko świadka
    - daty / godziny zeznań
    - KAŻDE twierdzenie faktyczne → osobny wpis w SD-FAKTY
    - KAŻDA kwota / data / zdarzenie wspomniane przez świadka → oznacz jako
      SD-SWIADEK-[NAZWISKO] → może być podstawą roszczenia lub obrony
  ⛔ ZAKAZ pomijania jakiegokolwiek zdania protokołu jako "nieistotnego"
     bez wyraźnego uzasadnienia procesowego.
```

---

## REGUŁY SZCZEGÓLNE

```
REGUŁA-PISMA-PROCESOWE-STRONY (NOWE — v1.2.0):
  ⛔ Każde pismo procesowe POWODA / POZWANEGO / WNIOSKODAWCY w materiale
  (riposta, pismo przygotowawcze, odpowiedź na pozew, rozszerzenie pozwu,
  pismo z wezwaniem, propozycja ugodowa) = OSOBNY SKAN PER WĄTEK.

  PER PISMO STRONY:
    1. Wypisz WSZYSTKIE wątki prawne wymienione (mobbing, zakaz konkurencji,
       fałszywe zeznania, roszczenia finansowe, wnioski dowodowe, twierdzenia
       o podmiotach itp.)
    2. Per wątek: czy istnieje roszczenie / teza procesowa, która NIE jest
       ujęta w aktualnej liście tez sprawy (T1..Tn)?
       → TAK: zapis SD-PISMO-WĄTEK[id] → przekaż do CLAIM-VALIDATION jako
               "nowa potencjalna teza — do weryfikacji przez powoda"
       → NIE: oznacz jako "pokryte przez T[x]"
    3. Per wniosek dowodowy zawarty w piśmie strony:
       → Czy dowód, o który strona wnosi, istnieje w zebranym materiale?
       → TAK: zaznacz jako D[id] → macierz
       → NIE: oznacz jako SD-BRAKUJĄCY-DOWÓD → zasygnalizuj użytkownikowi
    4. Per propozycja ugodowa: wyodrębnij WARUNKI → osobne SD-FAKTY

  ⛔ ZAKAZ traktowania pisma strony jako "tła" lub "kontekstu" bez skanu wątków.
     Każde pismo strony może zawierać roszczenia, które ROZSZERZYŁYBY pismo
     procesowe generowane przez system. Pominięcie wątku = błąd krytyczny.

REGUŁA-ORPHAN-TEZA (NOWE — v1.2.0):
  ⛔ Po zebraniu SD-FAKTY ze WSZYSTKICH D[id]:
  Sprawdź: czy którykolwiek fakt z SD-FAKTY NIE jest przypisany do żadnej
  tezy T[n] w aktualnej liście tez?

  Taki fakt = SD-ORPHAN.

  Per SD-ORPHAN:
    a) Oceń: czy fakt może stanowić podstawę NOWEJ tezy / roszczenia?
       → TAK: zaproponuj T_new: [treść nowej tezy] i poinformuj użytkownika
               "Wykryto potencjalne nowe roszczenie: [opis]. Czy uwzględnić?"
               ⛔ NIE dodawaj T_new do pisma bez potwierdzenia użytkownika
       → NIE (fakt neutralny lub szkodliwy): zanotuj jako SD-ORPHAN-NEUTRALNY
    b) Wykonaj ten skan PO każdorazowym rozszerzeniu listy tez (po zatwierdzeniu
       przez użytkownika) — loop aż nie ma SD-ORPHAN nieprzypisanych.

REGUŁA-PROTOKÓŁ-SĄDOWY:
  Każdy protokół rozprawy / posiedzenia sądowego:
  → Odczytaj KAŻDĄ linię. Protokoły zawierają: zeznania świadków,
    postanowienia sądu, wnioski stron, przyznania faktów — każde z nich
    może być podstawą roszczenia, obrony lub taktyki procesowej.
  → Per świadek: wyodrębnij WSZYSTKIE twierdzenia faktyczne jako osobne wpisy.
  → Per postanowienie sądu: wyodrębnij jako SD-POSTANOWIENIE.
  → Per wniosek strony: wyodrębnij jako SD-WNIOSEK.

REGUŁA-TABELA-PRACOWNICZA (XLSX z wieloma zakładkami):
  → Każda zakładka = osobna kategoria dowodowa.
  → Zakładka z danymi powoda → PRIORYTET NAJWYŻSZY → szukaj wiersza z PESEL/nazwiskiem.
  → Zakładka z limitami / premii / PFRON → wyodrębnij ALL kolumny.
  → Nie ograniczaj się do pierwszych 30 wierszy — skanuj do końca danych.

REGUŁA-ODT-Z-OBRAZAMI:
  Jeśli content.xml ODT zawiera wyłącznie referencje do Pictures/*:
  → Ekstrakcja tekstu ZAWSZE pusta → natychmiast przejdź do ekstrakcji obrazów.
  → Nie ponawiaj pdftotext / cat content.xml na ODT z obrazami — strata czasu.
  → Zamiast: python3 zipfile → Pictures/* → /tmp/ → view każdego obrazu.

REGUŁA-KORESPONDENCJA-KOMUNIKATORY:
  Zrzuty ekranu WhatsApp / Messenger / RCS / SMS:
  → Każdy zrzut = oddzielny dowód.
  → Wyodrębnij: nadawca / odbiorca (nazwa w nagłówku), daty, PEŁNA treść wiadomości.
  → Koreański / inny język: zanotuj treść + wskaż że wymaga tłumaczenia.
  → Nie traktuj jako "kontekst tła" — każda wiadomość może być dowodem
    na gotowość do pracy, odmowę pracodawcy, instrukcje bezprawne itp.

REGUŁA-PFRON-SUDOP:
  Dokumenty SUDOP zawierają tabelaryczne dane pomocy publicznej.
  → Każdy wiersz = osobna refundacja.
  → Wyodrębnij: data udzielenia, kwota nominalna, NIP beneficjenta, nr środka.
  → Zsumuj PER PODMIOT (NIP), nie łącznie.
  → Porównaj z okresem spornym: które miesiące pokrywa, które nie.
```

---

## SELF-CHECK MODUŁU (wykonaj przed każdym W2 / MD2)

```
□ SD-GATE-0: sprawdzono obecność plików gdy wzmianka o załącznikach?
□ SD-INW: zinwentaryzowano WSZYSTKIE pliki (w tym zawartość ZIP)?
□ SD-REJ: każdy plik D[id] ma wpis w rejestrze?
□ SD-READ: dla każdego D[id] wykonano właściwą metodę odczytu?
□ Dla PDF wielostronicowych: str. odczytane = N_stron?
□ Dla XLSX: odczytano WSZYSTKIE zakładki?
□ Dla ODT z obrazami: odczytano WSZYSTKIE obrazy z Pictures/?
□ Dla protokołów sądowych: wyodrębniono zeznania WSZYSTKICH świadków per zdanie?
□ SD-FAKTY: wypełnione dla każdego D[id]?
□ SD-VER: status KOMPLET?
□ SD-GATE-4: weryfikacja pre-generacji PASS?
□ Fakty z zeznań świadków → wprowadzone do W1.3 / macierzy?

Którykolwiek = NIE → wróć do właściwego kroku. Nie generuj pisma.
```

---

## HISTORIA ZMIAN

```
1.3.0 (2026-06-27)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-27):
  SD-VER = KOMPLET ale macierz D×T budowana z pamięci — nie z per-teza
  przeszukania SD-FAKTY. Pliki o mylących nazwach (Szef.odt, Zatrudnienie.odt)
  pomijane w skanowaniu tez bo „intuicyjnie nie pasowały".
Naprawa:
  + FAZA 4 SD-GATE-4: zamiast „Przekaż SD-FAKTY do W1.3" → obowiązkowe
    wywołanie MOD-FSL-DOKUMENTY.md (FSL-D) które wykonuje per-teza
    przeszukanie WSZYSTKICH D[id] z zakazem cytowania z pamięci.
  + Dopiero FSL-D-MACIERZ (nie SD-FAKTY) trafia do macierzy D×T.
  + Nowy plik: shared/MOD-FSL-DOKUMENTY.md (v1.0.0)
  + Zmieniono pointer: SD-FAKTY → MOD-FSL-DOKUMENTY → FSL-D-MACIERZ → W1.3

1.2.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  (1) Pismo procesowe zawierało tylko 5 z 18+ kategorii dowodowych.
  (2) Pisma procesowe powoda (riposta, pismo 12.05.2026) zawierają
      co najmniej 6 wątków prawnych (mobbing, zakaz konkurencji,
      fałszywe zeznania, sprawa VIII W 633/25, roszczenie z EuroRwa)
      — całkowicie pominiętych w generowanym piśmie.
  (3) Tabele XLSX (arkusz "Yurii Nepal") zawierały kwoty opłat
      (500 zł work permit + 2000 zł wiza) — kluczowe dla roszczenia
      o zwrot kosztów — nieodczytane.
  (4) SD-ORPHAN: fakty z SD-FAKTY nie były przypisywane do tez.
Naprawy:
  + REGUŁA-PISMA-PROCESOWE-STRONY: obowiązkowy skan wątków prawnych
    z każdego pisma procesowego strony — wykrywanie nowych roszczeń
  + REGUŁA-ORPHAN-TEZA: loop po wszystkich SD-FAKTY szukający
    faktów nieprzypisanych do żadnej tezy → propozycja T_new

1.1.0 (2026-06-22)
...

1.0.0 (2026-06-22)
Przyczyna: analiza błędów krytycznych w sprawie VII P 94/25:
  (1) Pominięto odczyt obrazów z plików ODT (3 pliki × ~2-3 obrazy)
  (2) Nie wyekstrahowano zeznań Nawrota o premii PFRON z protokołu rozprawy
      → pismo wygenerowano z błędną kwotą roszczenia
  (3) Zakładki XLSX przeanalizowano wybiórczo (1/6 zakładek)
  (4) Brakujący mechanizm blokady gdy użytkownik mówi o załącznikach, ale
      ich nie wgrywa — model zaczął analizować na podstawie kontekstu z pamięci
Relacja z MOD-PORCJOWANIE-DOWODOW:
  PORCJOWANIE = zarządza rozmiarem (ile plików naraz w kontekście)
  TEN MODUŁ = zarządza kompletnością (czy odczytano 100% stron każdego pliku)
  Kolejność: SD-KOMPLETNY przed PORCJOWANIE.
Integrations:
  prawny-router-v3 KROK 0C-EXT
  pisma-procesowe-v3 W1.2c-PRE
  analizator-dowodow-v3 BLOK-B-EXT
```

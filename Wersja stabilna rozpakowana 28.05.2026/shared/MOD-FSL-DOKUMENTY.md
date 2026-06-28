# MOD-FSL-DOKUMENTY — Fact-Source-Lock dla Dokumentów (FSL-D)
# Per-teza weryfikacja dowodów z zakazem cytowania z pamięci

> **Plik:** `/mnt/skills/user/shared/MOD-FSL-DOKUMENTY.md`
> **Wersja:** 1.0.0 (2026-06-27)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - pisma-procesowe-v3: W1.2c-FSL-D — po SD-VER (MOD-SKAN-DOWODOW-KOMPLETNY),
>     PRZED budową macierzy D×T (MOD-MACIERZ-DOWOD-TEZA)
>   - analizator-dowodow-v3: BLOK-C-FSL — po BLOK-B-EXT
>   - Wywoływany automatycznie gdy SD-VER = KOMPLET i lista tez ≥1
>
> **Relacja z innymi modułami:**
>   MOD-SKAN-DOWODOW-KOMPLETNY → gwarantuje że KAŻDY plik odczytany (100% stron)
>   MOD-FSL-DOKUMENTY (TEN MODUŁ) → gwarantuje że KAŻDA teza ma źródło w odczytanym pliku
>   MOD-MACIERZ-DOWOD-TEZA → buduje macierz D×T na bazie FSL-D
>   FACT-SOURCE-LOCK.md → analogiczny zakaz dla PRZEPISÓW PRAWNYCH
>   Kolejność: SD-KOMPLETNY → FSL-D → MACIERZ

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Problem (sprawa VII P 94/25, sesja 2026-06-27):**

Pismo procesowe zawierało twierdzenia faktyczne budowane przez model
z ogólnej wiedzy o sprawie — bez przypisania do konkretnego pliku
i konkretnej strony. Skutek: dwie kluczowe tezy nie miały adekwatnych
dowodów w piśmie mimo że dowody ISTNIAŁY w aktach:

- **Teza gotowości do pracy:** pismo powołało tylko zeznania Nawrota.
  Dostępne były wiadomości RCS do prezesa firmy (Szef.odt,
  Szef stosunek pracy.odt) i odpowiedź na Lorica — nie zostały
  użyte bo model nie przeszedł per-teza przez wszystkie pliki.

- **Teza pracodawcy faktycznego:** pismo powołało art. 23¹ KP i art. 8 KP
  ogólnie. Dostępne były XLSX Pracownicy13.08.2024 (powód jako aktywny
  pracownik HPG w VIII.2024) i Eksport-Pracownicy (HPG jako agencja
  pracy) — nie użyte z tego samego powodu.

**Root cause:** po SD-VER model budował macierz D×T z pamięci —
bez fizycznego powrotu do każdego pliku per każdą tezę.

**Zasada nadrzędna:**
> ⛔ KAŻDE TWIERDZENIE FAKTYCZNE W PIŚMIE MUSI MIEĆ WSKAZANY PLIK ŹRÓDŁOWY
>    (D[id]) + LOKALIZACJA (strona / zakładka / godzina / obraz-nr).
> ⛔ Twierdzenie bez lokalizacji w SD-REJ = ⬛ FSL-D-LUKA.
> ⛔ ⬛ FSL-D-LUKA klasy 🔴/🟠 = BLOKADA .docx.
> ⛔ ZAKAZ CYTOWANIA FAKTÓW Z PAMIĘCI — każdy fakt weryfikowany
>    przez powrót do SD-FAKTY[D[id]], nie przez odtworzenie z kontekstu.

---

## FAZA 1 — INICJALIZACJA (FSL-D-INIT)

```
⛔ GATE: Wykonaj NATYCHMIAST po SD-VER = KOMPLET, przed W1.2c (macierz).

KROK FSL-D-INIT.1 — Pobierz listę tez z CLAIM-VALIDATION:
  T1: [treść tezy 1]
  T2: [treść tezy 2]
  T3: [treść tezy 3]
  ...Tn: [treść tezy n]

KROK FSL-D-INIT.2 — Pobierz SD-REJ z MOD-SKAN-DOWODOW-KOMPLETNY:
  D01: [nazwa] — ✅ (typ, strony)
  D02: [nazwa] — ✅ (typ, strony)
  ...D[N]: [nazwa] — ✅

  ⛔ Jeśli SD-REJ niekompletny (brakuje pliku ⬜) → STOP.
     Nie przystępuj do FSL-D dopóki SD-VER ≠ KOMPLET.

KROK FSL-D-INIT.3 — Zbuduj macierz FSL-D (pustą):
  FSL-D-MACIERZ:
  ┌──────┬──────────────────────────┬──────────────────────────────┐
  │ Teza │ Twierdzenia kluczowe     │ Wymagany dowód źródłowy      │
  ├──────┼──────────────────────────┼──────────────────────────────┤
  │ T1   │ [lista twierdzeń T1]     │ ⬜ DO WERYFIKACJI            │
  │ T2   │ [lista twierdzeń T2]     │ ⬜ DO WERYFIKACJI            │
  │ T3   │ [lista twierdzeń T3]     │ ⬜ DO WERYFIKACJI            │
  └──────┴──────────────────────────┴──────────────────────────────┘
```

---

## FAZA 2 — PROTOKÓŁ PER-TEZA (FSL-D-SCAN)

```
⛔ HARD GATE: Dla KAŻDEJ tezy T[n] wykonaj PEŁNY PROTOKÓŁ FSL-D-SCAN.
   Kolejność: T1 → T2 → ... → Tn. Nie pomijaj żadnej tezy.

⛔ ZAKAZ CYTOWANIA Z PAMIĘCI:
   Na każdym kroku poniżej model MUSI wracać do SD-FAKTY[D[id]]
   wyekstrahowanych w MOD-SKAN-DOWODOW-KOMPLETNY.
   ZAKAZ twierdzenia że „wiadomo z protokołu że..." bez wskazania
   konkretnego D[id] + strony + cytatu.

KROK FSL-D-SCAN.1 — Rozłóż tezę T[n] na twierdzenia atomowe:
  T[n]: [treść tezy]
  Twierdzenia atomowe:
    TC[n,1]: [pierwsze twierdzenie faktyczne konieczne dla T[n]]
    TC[n,2]: [drugie twierdzenie faktyczne]
    TC[n,k]: [każde kolejne]

  REGUŁA ATOMOWOŚCI: twierdzenie atomowe = jedno zdanie, jeden fakt,
  jeden podmiot, jedna data/kwota/okoliczność.
  ⛔ ZAKAZ ŁĄCZENIA: „powód był zatrudniony i gotowy do pracy"
     = dwa twierdzenia atomowe, nie jedno.

KROK FSL-D-SCAN.2 — Per KAŻDE twierdzenie atomowe TC[n,k]:

  KROK A — Przeszukaj SD-FAKTY:
    Dla każdego D[id] w SD-REJ:
      → Czy SD-FAKTY[D[id]].kluczowe_fakty zawiera fakt potwierdzający TC[n,k]?
      → Czy SD-FAKTY[D[id]].cytaty_procesowe zawiera potwierdzenie?
      → Czy SD-FAKTY[D[id]].daty_kluczowe / kwoty / podmioty potwierdzają TC[n,k]?

    ⛔ Przeszukuj WSZYSTKIE D[id] — nie tylko te, które „intuicyjnie pasują".
       Nazwa pliku może być myląca (np. „Szef.odt" zawiera wiadomości RCS
       z gotowością do pracy — nie byłoby oczywiste bez przeszukania).

  KROK B — Klasyfikacja wyniku per TC[n,k]:

    ✅ POTWIERDZONE: znaleziono w SD-FAKTY[D[id]] bezpośrednie potwierdzenie
       Wpisz: TC[n,k] → D[id], str.[X]/godz.[Y]/obraz[Z], treść: „[cytat]"

    ⚠️ POŚREDNIE: znaleziono w SD-FAKTY poszlakę (nie wprost)
       Wpisz: TC[n,k] → D[id] (pośrednio), uzasadnienie: [opis powiązania]
       → Wróć do Kroku A: czy jest D[id2] z bezpośrednim potwierdzeniem?

    ⬛ FSL-D-LUKA: nie znaleziono w żadnym D[id]
       Wpisz: TC[n,k] → BRAK_ŹRÓDŁA
       Klasyfikuj lukę:
         🔴 KRYTYCZNA: bez TC[n,k] teza T[n] odpada w całości
         🟠 ISTOTNA:   bez TC[n,k] teza T[n] jest znacznie słabsza
         🟡 UMIARKOWANA: TC[n,k] uzupełniające, teza utrzymuje się bez niego

  KROK C — Aktualizuj FSL-D-MACIERZ:
    T[n] / TC[n,k]:
      Status: [✅/⚠️/⬛]
      Źródło: D[id] [nazwa pliku] str.[X] / zakładka.[Y] / obraz[Z] / godz.[T]
      Lokalizacja szczegółowa: [nagłówek / kolumna / świadek / godzina nagrania]
      Treść (wyekstrahowana z SD-FAKTY, nie z pamięci): „[...]"
```

---

## FAZA 3 — RAPORT FSL-D (FSL-D-REPORT)

```
Po przeskanowaniu wszystkich T[n] wygeneruj raport:

═══════════════════════════════════════════════════════════════════
RAPORT FSL-D — Fact-Source-Lock Dokumentów
Sprawa: [sygnatura] | Data: [data]
Pliki przeszukane: [N] (SD-REJ ✅ KOMPLET)
═══════════════════════════════════════════════════════════════════

FSL-D-MACIERZ WYNIKOWA:

T1: [treść tezy]
  TC[1,1]: [twierdzenie] → ✅ D02 str.4 godz.00:47:48 „[cytat]"
  TC[1,2]: [twierdzenie] → ✅ D09 zakładka Pracownicy-HP-Global wiersz 371
  TC[1,3]: [twierdzenie] → ⚠️ D07 (pośrednio) — brak bezpośredniego potwierdzenia
  TC[1,4]: [twierdzenie] → ⬛ FSL-D-LUKA 🔴 KRYTYCZNA

T2: [treść tezy]
  TC[2,1]: [twierdzenie] → ✅ D06 obraz szef_0.jpg godz.19:11
  TC[2,2]: [twierdzenie] → ✅ D07 obraz szef_st_0.jpg godz.09:27
  TC[2,3]: [twierdzenie] → ✅ D08 str.1-2 [Odpowiedź na Lorica]

T3: [treść tezy]
  TC[3,1]: [twierdzenie] → ✅ D02 str.4 godz.00:47:48 „PFRON-em zajmował się powód"
  TC[3,2]: [twierdzenie] → ✅ D11 SUDOP suma 122 445 zł
  TC[3,3]: [twierdzenie] → ⚠️ brak bezpośredniego dowodu kwoty 1000 zł/mies.

═══════════════════════════════════════════════════════════════════
PODSUMOWANIE:
  ✅ Potwierdzone:     [N] twierdzeń
  ⚠️ Pośrednie:       [N] twierdzeń
  ⬛ FSL-D-LUKI 🔴:  [N] — BLOKADA .docx
  ⬛ FSL-D-LUKI 🟠:  [N] — wymagana korekta lub żądanie ewentualne
  ⬛ FSL-D-LUKI 🟡:  [N] — notacja, bez blokady

PLIKI NIEUŻYTE (w SD-REJ ale bez przypisania do żadnej tezy):
  D[id]: [nazwa] — rozważyć jako ORPHAN (potencjalna nowa teza?)
═══════════════════════════════════════════════════════════════════
```

---

## FAZA 4 — ROZGAŁĘZIENIE PO RAPORCIE

```
⛔ SD-GATE-FSL-D: wykonaj po FSL-D-REPORT, przed macierzą D×T

PRZYPADEK A — brak ⬛ FSL-D-LUKA 🔴/🟠:
  → Przejdź do MOD-MACIERZ-DOWOD-TEZA
  → Macierz buduj WYŁĄCZNIE z FSL-D-MACIERZ (nie z pamięci)
  → Format wpisów: per teza + per dowód + lokalizacja ze źródła

PRZYPADEK B — wykryto ⬛ FSL-D-LUKA 🔴 (luka krytyczna):
  → ⛔ STOP: nie przystępuj do macierzy ani do projektu pisma
  → Wyświetl blok PYTANIA FSL-D:
    ┌─────────────────────────────────────────────────────────────┐
    │ ⬛ FSL-D-LUKA KRYTYCZNA                                     │
    │                                                             │
    │ Twierdzenie TC[n,k] nie ma potwierdzenia w żadnym z [N]    │
    │ odczytanych plików:                                         │
    │   T[n]: [treść tezy]                                        │
    │   TC[n,k]: [twierdzenie bez źródła]                        │
    │                                                             │
    │ Opcje:                                                      │
    │  a) Mam dodatkowy dokument potwierdzający — wgram go        │
    │  b) Tezę przeformułuję jako żądanie ewentualne              │
    │  c) Usuwam to twierdzenie z tezy T[n]                       │
    │  d) Akceptuję lukę — piszę z oznaczeniem ⬛ [BRAK DOWODU]  │
    └─────────────────────────────────────────────────────────────┘
  → Czekaj na decyzję. NIE generuj pisma bez odpowiedzi.

PRZYPADEK C — wykryto ⬛ FSL-D-LUKA 🟠 (luka istotna):
  → Kontynuuj do macierzy ale oznacz twierdzenie jako ⚠️
  → W piśmie: sformułuj jako żądanie ewentualne lub wniosek dowodowy
  → W sekcji UWAGI REDAKCYJNE: wymień lukę 🟠 jako kwestię do sprawdzenia

PRZYPADEK D — wykryto PLIKI NIEUŻYTE (zero przypisań do tez):
  → Per każdy nieużyty D[id]: czy zawiera fakty tworzące nową tezę?
  → Jeśli TAK: zaproponuj T_new + zapytaj użytkownika o uwzględnienie
  → Jeśli NIE (fakt neutralny): oznacz jako FSL-D-NEUTRALNY
```

---

## FAZA 5 — INTEGRACJA Z MACIERZĄ D×T

```
⛔ ZASADA: MOD-MACIERZ-DOWOD-TEZA musi być zasilona wyłącznie z FSL-D-MACIERZ,
   nie z pamięci modelu ani z fragmentarycznych notatek.

PROTOKÓŁ PRZEKAZANIA:
  1. Dla każdego D[id] z ≥1 przypisaniem ✅:
     → Wpis w macierzy: D[id] | [nazwa] | [lokalizacja] | T[n1], T[n2]... | [okoliczność]
  2. Dla każdego ⚠️ POŚREDNIEGO:
     → Wpis z adnotacją „dowód pośredni — patrz FSL-D-MACIERZ TC[n,k]"
  3. Dla każdego ⬛ FSL-D-LUKA 🟡:
     → Wpis pusty z adnotacją „⬛ BRAK BEZPOŚREDNIEGO DOWODU — uzupełnij"
  4. Dla FSL-D-LUKA 🔴/🟠: DECYZJA z FAZY 4 musi być wykonana PRZED wpisem
```

---

## REGUŁY SZCZEGÓLNE

```
REGUŁA-NAZWA-PLIKU-MYLĄCA:
  ⛔ Nazwa pliku NIE określa jego zawartości dowodowej.
  Przykłady z VII P 94/25:
    „Szef.odt" → wiadomości RCS z gotowością do pracy (nie „korespondencja z szefem")
    „Szef stosunek pracy.odt" → wniosek o powrót do pracy + groźba ze strony szefa
    „Zatrudnienie.odt" → WhatsApp z kartami pobytu cudzoziemców (nie „pismo o zatrudnieniu")
    „Pracownicy13.08.2024.xlsx" → status powoda jako aktywnego pracownika HPG w VIII.2024
  ⛔ ZAKAZ wnioskowania o zawartości pliku z jego nazwy.
  ⛔ OBOWIĄZEK przeszukania KAŻDEGO pliku dla KAŻDEJ tezy — niezależnie od nazwy.

REGUŁA-PAMIĘĆ-VS-ŹRÓDŁO:
  ⛔ „Pamiętam z odczytanego pliku że..." = ZAKAZ.
  Każde powołanie na fakt wymaga:
    1. Identyfikatora pliku: D[id]
    2. Lokalizacji: str.[X] / zakładka.[Y] / obraz[Z] / godz.[T]
    3. Treści: wyekstrahowanej w SD-FAKTY[D[id]], nie odtworzonej z pamięci
  Jeśli model nie może wskazać D[id] + lokalizacji → twierdzenie = ⬛ FSL-D-LUKA.

REGUŁA-KORESPONDENCJA-GOTOWOŚĆ:
  Per każdą tezę o gotowości do pracy / wniosku o powrót / odmowie dopuszczenia:
  → Przeszukaj WSZYSTKIE D[id] z typem: korespondencja / wiadomości / e-mail / RCS / SMS
  → Nie ograniczaj się do pism procesowych — wiadomości prywatne do pracodawcy
    są dowodem gotowości do pracy równie ważnym jak formalne wezwania
  → Data wiadomości: MUSI być po dacie zdarzenia (np. po porozumieniu 09.10.2024)
  → Treść: wyodrębnij DOSŁOWNIE z SD-FAKTY (nie parafrazuj dla tezy)

REGUŁA-TABELE-PRACODAWCA:
  Per każdą tezę o tożsamości pracodawcy / ciągłości zatrudnienia:
  → Przeszukaj WSZYSTKIE D[id] z typem: xlsx / tabela pracownicza / eksport danych
  → Szukaj wiersza z PESEL/nazwiskiem powoda w KAŻDEJ zakładce
  → Status „pracuje" / „nie pracuje" + data = kluczowy fakt FSL-D
  → Kolumna „Pracodawca" / „Rodzaj umowy" / „KRS" → wyodrębnij per wiersz

REGUŁA-ORPHAN-D:
  Po zakończeniu FSL-D-SCAN dla wszystkich tez:
  → Zidentyfikuj D[id] z SD-REJ które mają 0 przypisań do tez
  → Per każdy: wróć do SD-FAKTY[D[id]] i sprawdź czy zawiera fakty
    mogące stanowić podstawę NOWEJ tezy nieujętej w T1...Tn
  → Jeśli TAK → FSL-D-ORPHAN-TEZA: propozycja T_new dla użytkownika
  → Jeśli NIE → FSL-D-NEUTRALNY: odnotuj w raporcie, nie blokuje
```

---

## SELF-CHECK (wykonaj przed przekazaniem do macierzy D×T)

```
□ Lista tez T1...Tn kompletna z CLAIM-VALIDATION?
□ SD-REJ kompletny (wszystkie D[id] = ✅)?
□ Per KAŻDĄ tezę: wykonano FSL-D-SCAN przez WSZYSTKIE D[id]?
□ Per KAŻDE twierdzenie atomowe: wskazano D[id] + lokalizację?
□ Żaden fakt nie pochodzi wyłącznie z pamięci modelu (zakaz cytowania)?
□ Wszystkie ⬛ FSL-D-LUKA 🔴 mają decyzję z FAZY 4?
□ Pliki nieużyte (0 przypisań) sprawdzone pod kątem orphan-teza?
□ FSL-D-MACIERZ gotowa do przekazania do MOD-MACIERZ-DOWOD-TEZA?

Którykolwiek = NIE → wróć do właściwego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-27)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-27):
  Root cause zidentyfikowany przez dewelopera:
  (1) SD-VER = KOMPLET (wszystkie pliki odczytane) — ale macierz D×T
      budowana z pamięci, nie z per-teza przeszukania SD-FAKTY.
      Skutek: teza gotowości do pracy → 1 dowód zamiast 4.
      Teza pracodawcy faktycznego → argumenty ogólne zamiast konkretnych
      wierszy z XLSX i zrzutów ekranu.
  (2) Nazwy plików mylące (Szef.odt, Zatrudnienie.odt) — model
      pomijał je w skanowaniu per-teza bo „intuicyjnie" nie pasowały
      do treści tezy.
  (3) Brak FSL-D jako gate między SD-VER a macierzą D×T — luźna
      reguła „sprawdź SD-FAKTY" nieskuteczna bez hard gate.

  Rozwiązanie:
  - Nowy hard gate FSL-D-SCAN wymusza per-teza przejście przez
    WSZYSTKIE D[id] niezależnie od nazwy
  - ZAKAZ CYTOWANIA Z PAMIĘCI dla faktów (analogia do FACT-SOURCE-LOCK
    dla przepisów) — każde twierdzenie faktyczne musi mieć D[id]+lok.
  - REGUŁA-NAZWA-PLIKU-MYLĄCA: zakaz wnioskowania z nazwy
  - REGUŁA-ORPHAN-D: pliki nieużyte = kandydaci na nowe tezy
  - Blokada .docx gdy ⬛ FSL-D-LUKA 🔴/🟠 bez decyzji użytkownika

  Wzorzec projektowy: FSL-D jest dla FAKTÓW tym, czym FACT-SOURCE-LOCK
  jest dla PRZEPISÓW i czym MOD-SKAN-DOWODOW-KOMPLETNY jest dla STRON.
  Trzy poziomy gwarancji kompletności:
    L1 (strony):    SD-KOMPLETNY   — czy 100% stron odczytano?
    L2 (tezy):      FSL-D (TEN)    — czy 100% tez ma źródło w plikach?
    L3 (przepisy):  FACT-SRC-LOCK  — czy 100% przepisów zweryfikowano?
```

# MOD-STEP-TRACKER — Śledzenie Kroków i Raportowanie Pominięć

> **Plik:** `/mnt/skills/user/shared/MOD-STEP-TRACKER.md`
> **Wersja:** 1.0.0 (2026-06-24)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - prawny-router-v3: inicjowany w KROK 0 zaraz po HARD GATE
>   - pisma-procesowe-v3: integruje się z automat stanów
>   - Każdy skill dziedzinowy: raportuje wykonanie/pominięcie swoich kroków

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Problem (sprawa VII P 94/25, 2026-06-24):**
Model wygenerował pismo procesowe bez wykonania obowiązkowych kroków:
- Pominięto KROK 1 (detekcja trybu PRAWNIK/LAIK)
- Pominięto W1 CLAIM-VALIDATION [CP-1-claim]
- Pominięto MOD-STRATEGIA-WYBOR [CP-1b-strategia]
- Pominięto MOD-MACIERZ-DOWOD-TEZA [CP-1c-macierz]
- Pominięto wszystkie CP (checkpointy) między etapami
- Pominięto PRE-W2-VERIFICATION-GATE
- Pominięto PODMIOT-GATE (W3.0)
- Pominięto LEGAL-QUALITY-GATE
- Pominięto AUDYT-KOŃCOWY
- Pominięto PEER-REVIEW + POST-VALIDATION (W3.7)

**Skutek:** Pismo DRAFT dostarczone użytkownikowi bez żadnej informacji
o brakujących krokach kontroli jakości. Użytkownik nie wiedział, że pismo
nie przeszło wymaganych bramek jakości.

**Zasada nadrzędna tego modułu:**
> ⛔ KAŻDE POMINIĘCIE KROKU MUSI BYĆ ODNOTOWANE I ZAKOMUNIKOWANE.
> ⛔ ANALIZA NIEPEŁNA = OBOWIĄZEK POINFORMOWANIA + KONTYNUACJA.
> Generowanie pisma bez zakończenia wymaganych kroków = ZAKAZ BEZWZGLĘDNY
> CHYBA ŻE użytkownik świadomie rezygnuje (wymaga explicite potwierdzenia).

---

## FAZA 0 — INICJALIZACJA REJESTRU KROKÓW

```
⛔ ST-INIT: uruchom po HARD GATE ZERO, przed jakimkolwiek krokiem:

REJESTR = {
  // ROUTER (prawny-router-v3)
  "R0A": { name: "Anonimizer",           status: "○ OCZEKUJE" },
  "R0C": { name: "Skan dowodów SD-VER",  status: "○ OCZEKUJE" },
  "R0D": { name: "Oznaczenie podmiotów ⬛ [DO WERYFIKACJI]", status: "○ OCZEKUJE" },
  "R1":  { name: "Detekcja trybu",       status: "○ OCZEKUJE" },
  "R2":  { name: "Routing [1]-[10]",     status: "○ OCZEKUJE" },

  // PISMO PROCESOWE (pisma-procesowe-v3)
  "W1-CLAIM":    { name: "CLAIM-VALIDATION [CP-1-claim]",        status: "○ OCZEKUJE" },
  "W1-STRAT":    { name: "MOD-STRATEGIA-WYBOR [CP-1b-strategia]", status: "○ OCZEKUJE" },
  "W1-FSL-D":    { name: "FSL-D PER-TEZA weryfikacja dowodów [CP-FSL-D]", status: "○ OCZEKUJE" },
  "W1-MACIERZ":  { name: "MOD-MACIERZ-DOWOD-TEZA [CP-1c-macierz]", status: "○ OCZEKUJE" },
  "W1-LANCUCH":  { name: "MOD-LANCUCH-DOWODOWY [CP-1c-lancuch]", status: "○ OCZEKUJE" },
  "W1-ANOMALIE": { name: "MOD-DOKUMENT-ANOMALIE [CP-1d-anomalie]", status: "○ OCZEKUJE" },
  "W1-RED-TEAM": { name: "MOD-RED-TEAM-WLASNY [CP-W1]",         status: "○ OCZEKUJE" },
  "PRE-W2-POV":  { name: "MOD-PODMIOT-ONLINE-VERIFY AUTODIAGNOZA [CP-PRE-W2-POV]", status: "○ OCZEKUJE" },
  "PRE-W2":      { name: "PRE-W2-VERIFICATION-GATE [CP-PRE-W2]", status: "○ OCZEKUJE" },
  "W2-DRAFT":    { name: "Projekt pisma W2 [CP-W2]",             status: "○ OCZEKUJE" },
  "W2-ATAK":     { name: "MOD-ATAK-NA-DRAFT [CP-W2-atak]",       status: "○ OCZEKUJE" },
  "W3-PODMIOT":  { name: "PODMIOT-GATE W3.0 [CP-W3-podmiot]",    status: "○ OCZEKUJE" },
  "W3-ISAP":     { name: "Weryfikacja ISAP W3.1-3.3",            status: "○ OCZEKUJE" },
  "W3-BLOKJ":    { name: "Blok J MOD-WALIDACJA [CP-W3-blokj]",   status: "○ OCZEKUJE" },
  "W3-LQG":      { name: "LEGAL-QUALITY-GATE [CP-W3-lqg]",       status: "○ OCZEKUJE" },
  "W3-AUDYT":    { name: "AUDYT-KOŃCOWY + COURT-SIMULATION",      status: "○ OCZEKUJE" },
  "W3-PEER":     { name: "PEER-REVIEW + POST-VALIDATION [CP-PEER]", status: "○ OCZEKUJE" },
  "HYBRID":      { name: "HYBRID-VALIDATION",                     status: "○ OCZEKUJE" },
  "DOCX":        { name: "Generowanie .docx",                     status: "○ OCZEKUJE" }
}

Pomiń kroki nieistotne dla typu zadania (np. W1-MACIERZ gdy brak dowodów).
Oznacz jako "— N/A" z uzasadnieniem. N/A musi być uzasadnione.
```

---

## FAZA 1 — ŚLEDZENIE W TRAKCIE WYKONANIA

```
⛔ ST-TRACK: po każdym wykonanym kroku zaktualizuj REJESTR:

Gdy krok WYKONANY:
  REJESTR[id].status = "✅ WYKONANY"

Gdy krok POMINIĘTY (z powodu ograniczeń kontekstu, złożoności, czasu):
  REJESTR[id].status = "⚠️ POMINIĘTY"
  REJESTR[id].powod = "[krótki powód]"
  ⛔ OBOWIĄZEK POINFORMOWANIA — patrz FAZA 2

Gdy krok N/A (niezastosowalny):
  REJESTR[id].status = "— N/A"
  REJESTR[id].powod = "[uzasadnienie]"
```

---

## FAZA 2 — RAPORTOWANIE POMINIĘĆ

```
⛔ ST-REPORT: OBOWIĄZEK AKTYWNY gdy REJESTR zawiera ≥1 wpis "⚠️ POMINIĘTY":

MOMENT RAPORTOWANIA:
  - Natychmiast po wykryciu pominięcia (nie czekaj do końca)
  - Obowiązkowo w każdym CP (checkpoint)
  - Obowiązkowo przed dostarczeniem pisma / pliku wynikowego

FORMAT RAPORTU POMINIĘĆ (włącz do każdego raportu CP gdy pominięcia istnieją):

  ┌─────────────────────────────────────────────────────────────┐
  │ ⚠️ UWAGA — ANALIZA NIEPEŁNA                                  │
  │                                                             │
  │ Pominięte kroki (nie wykonano):                             │
  │  ⚠️ [ID] [nazwa kroku] — Powód: [krótki opis]              │
  │  ⚠️ [ID] [nazwa kroku] — Powód: [krótki opis]              │
  │                                                             │
  │ Skutek pominięcia:                                          │
  │  → [co nie zostało zweryfikowane / jakie ryzyko dla pisma]  │
  │                                                             │
  │ Czy kontynuować bez tych kroków?                            │
  │  a) Tak — akceptuję pismo bez pełnej weryfikacji            │
  │  b) Nie — wykonaj brakujące kroki przed dostarczeniem       │
  └─────────────────────────────────────────────────────────────┘

  ⛔ Po wyświetleniu raportu pominięć — ZAKOŃCZ ODPOWIEDŹ.
  Czekaj na decyzję użytkownika (a/b).

  Użytkownik odpowiada "a"/tak → kontynuuj, oznacz pismo jako
    ⚠️ DRAFT — NIEZWERYFIKOWANY (wzmocniony watermark w .docx)
  Użytkownik odpowiada "b"/nie → wróć i wykonaj brakujące kroki.
```

---

## FAZA 3 — RAPORT KOŃCOWY PRZED .DOCX

```
⛔ ST-FINAL: OBOWIĄZKOWY przed każdym present_files pisma procesowego:

Wyświetl PEŁNY REJESTR KROKÓW w formacie:

  ┌─────────────────────────────────────────────────────────────┐
  │ 📋 REJESTR KROKÓW — [sygnatura / data]                       │
  │                                                             │
  │ Kroki wykonane:                                             │
  │  ✅ R0A   Anonimizer                                        │
  │  ✅ R0C   Skan dowodów SD-VER (35 plików / 7 stron)        │
  │  ✅ R0D   Oznaczenie podmiotów ⬛ → ✅ (3 podmioty zweryfikowane) │
  │  ✅ R1    Detekcja trybu → PRAWNIK                          │
  │  ✅ W1-FSL-D  FSL-D per-teza (T1×11 D[id] / T2×5 / T3×8)  │
  │  ... (wszystkie ✅)                                          │
  │                                                             │
  │ Kroki pominięte:                                            │
  │  ⚠️ W1-CLAIM  CLAIM-VALIDATION — Powód: [opis]             │
  │  ⚠️ W3-PEER   PEER-REVIEW — Powód: [opis]                  │
  │  (lub: BRAK — wszystkie wymagane kroki wykonane)            │
  │                                                             │
  │ Kroki N/A:                                                  │
  │  — W1-LANCUCH  N/A — brak dowodów pośrednich               │
  │                                                             │
  │ STATUS PISMA:                                               │
  │  ✅ FINAL — GOTOWE DO ZŁOŻENIA                              │
  │  lub ⚠️ DRAFT — NIEZWERYFIKOWANY (pominięto X kroków)       │
  └─────────────────────────────────────────────────────────────┘

⛔ Jeśli STATUS = ⚠️ DRAFT — NIEZWERYFIKOWANY:
  → Wyświetl raport pominięć z FAZY 2
  → Czekaj na decyzję a/b
  → NIE wywołuj present_files bez potwierdzenia użytkownika
```

---

## REGUŁA KONTYNUACJI PO POMINIĘCIU

```
REGUŁA-KONTYNUACJA-ST:
  Gdy użytkownik prosi o wykonanie kolejnego kroku, a poprzednie
  kroki zostały pominięte:

  1. Poinformuj o pominięciach (skrócony raport)
  2. Zaproponuj: wykonać brakujące kroki (rekomendowane)
     lub kontynuować bez nich (ryzyko jawne)
  3. Czekaj na decyzję
  4. NIE kontynuuj cicho — każde pominięcie musi być świadome

  ⛔ ZAKAZ "cichego" pominięcia — model NIGDY nie może pominąć
  kroku bez poinformowania użytkownika i uzyskania potwierdzenia.
```

---

## INTEGRACJA Z CP (CHECKPOINTS)

```
ST-CP-INTEGRACJA:
  Każdy raport CP (format z pisma-procesowe-v3) MUSI zawierać
  sekcję REJESTR CP z aktualnym stanem STEP-TRACKER:

  Standardowa sekcja CP (fragment):
    │ REJESTR CP (stan po tym checkpoint):              │
    │   ✅ zamknięte: R0A, R0C, R1, R2, W1-CLAIM       │
    │   ⚠️ pominięte: W1-STRAT (powód: [opis])          │
    │   ○  otwarte:  W1-MACIERZ, W1-LANCUCH, PRE-W2... │

  ⛔ CP bez sekcji REJESTR = CP niezamknięty.
```

---

## HISTORIA ZMIAN

```
1.0.1 (2026-06-25)
Przyczyna: Moduł był OSIEROCONY — istniał w shared/ i był wpięty tylko w
  pisma-procesowe-v3, ale prawny-router-v3 NIE wywoływał go w żadnym kroku
  (0 wzmianek STEP-TRACKER w routerze i jego SELF-CHECK). Skutek: gdy model
  wygenerował pismo bez wczytania PRIMARY-skilla pisma-procesowe-v3 (sprawa
  VII P 94/25, po poleceniu „kontynuuj"), nic nie wymusiło ST-INIT/ST-FINAL —
  pismo .docx dostarczono bez REJESTRU KROKÓW i bez raportu pominięć.
Naprawa (prawny-router-v3/SKILL.md):
  + KROK 0-ST (ST-INIT zaraz po HG-ACTIVE)
  + KROK 6-ST (ST-FINAL BLOKUJĄCY przed present_files, także bez pełnego pipeline)
  + reguła nadrzędna 11a (STEP-TRACKER + obowiązek wczytania PRIMARY-skilla)
  + BLOK-ST i pozycje w SELF-CHECK
Zasada: router (jedyny punkt wejścia) musi sam wymuszać STEP-TRACKER —
  poleganie wyłącznie na skillu downstream pozwala bugowi „pominiętego skilla"
  ominąć całą siatkę bezpieczeństwa.

1.0.0 (2026-06-24)
Przyczyna: Analiza błędów sprawa VII P 94/25 (2026-06-24):
  Model pominął 10+ obowiązkowych kroków bez informowania użytkownika.
  Pismo dostarczone bez CLAIM-VALIDATION, STRATEGIA-WYBOR, MACIERZ,
  PODMIOT-GATE, LEGAL-QUALITY-GATE, AUDYT-KOŃCOWY, PEER-REVIEW.
  Użytkownik otrzymał DRAFT bez wiedzy o brakach weryfikacji.
Zasada: każde pominięcie = obowiązek raportowania + czekanie na decyzję.
Integracje:
  prawny-router-v3 KROK 0 (ST-INIT)
  pisma-procesowe-v3 automat stanów (ST-TRACK)
  shared/MOD-SKAN-DOWODOW-KOMPLETNY.md (ST-REPORT w SD-VER)
```

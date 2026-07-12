# MOD-KARTA-DOWODU — Karta Dowodowa i Graf Faktów

> **Plik:** `/mnt/skills/user/shared/MOD-KARTA-DOWODU.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - pisma-procesowe-v3: W1.2c-PRE (po SD-SKAN, przed MT1 macierzy)
>   - analizator-dowodow-v3: BLOK-B2 (po ekstrakcji, przed MD2)
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-KARTA-DOWODU.md`
> **Trigger:** OBOWIĄZKOWY gdy ≥2 dokumenty dostarczone przez użytkownika

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Dotychczasowe pipeline'y produkowały LISTY DOWODÓW i LISTY FAKTÓW.
To jest poziom LexAlpha: dowód → okoliczność → roszczenie.

Ten moduł wdraża poziom wyższy: GRAF FAKTÓW i KARTY DOWODÓW.
Zamiast "przeszukaj pliki i napisz pismo" — system odpowiada:
"Jakie fakty, z jakich źródeł i w jakiej kolejności najlepiej
uzasadniają tę tezę?"

Różnica procesowa:
  LISTA: 3 dowody → 3 okoliczności → teza (każdy obalany osobno)
  GRAF:  D1→F1→F2←D2; F2+F3→domniemanie F4 (art.231 KPC)←D3
         → teza (aby obalić: obal F2 I F3 I domniemanie jednocześnie)

---

## KD-1 — FORMAT KARTY DOWODOWEJ

```
Per każdy dokument/dowód ze SD-FAKTY (z MOD-SKAN-DOWODOW-KOMPLETNY):

╔══════════════════════════════════════════════════════════╗
║ KARTA DOWODOWA — D[nn]                                   ║
╠══════════════════════════════════════════════════════════╣
║ IDENTYFIKATOR: D[nn]                                     ║
║ NAZWA: [pełna nazwa pliku / dowodu]                      ║
║ LOKALIZATOR: [str. N / zakładka X / godz. HH:MM:SS]     ║  ← SD-LOC
║                                                          ║
║ TYP: [urzędowy A / dok.prywatny B / zeznania B/C /      ║
║       tabela PFRON A / pismo C / nagranie C]             ║
║ KLASA HIERARCHII: [A / B / C / D]  (wg MOD-DOWODY D1)   ║
║                                                          ║
║ OSOBY: [imię nazwisko — rola]                            ║
║ DATY KLUCZOWE: [RRRR-MM-DD: zdarzenie]                   ║
║ KWOTY: [X zł — opis]                                     ║
║                                                          ║
║ FAKTY WYKAZYWANE (F-nn):                                 ║
║   ✓ F-[nn]: [treść faktu — co wykazuje]                  ║
║   ✓ F-[nn]: [treść faktu]                                ║
║                                                          ║
║ FAKTY NIE-WYKAZYWANE:                                    ║
║   ✗ NIE WYKAZUJE: [co ten dowód NIE potwierdza]          ║
║     (np. dobrowolności, kwoty per pracownik, daty)       ║
║                                                          ║
║ POWIĄZANE DOWODY:                                        ║
║   D[nn] — [typ relacji: potwierdza / uzupełnia /         ║
║             wzmacnia / zastępuje / stoi w sprzeczności]  ║
║                                                          ║
║ POWIĄZANE PRZEPISY:                                      ║
║   art. X §Y [ustawa] — [jaką przesłankę wykazuje]       ║
║                                                          ║
║ POWIĄZANE TEZY:                                          ║
║   T[n] [waga: ●●● bezpośredni / ●● pośredni / ● wspieraj]║
║                                                          ║
║ SIŁA DOWODOWA: [1-10]/10                                 ║
║ WEKTORY ATAKU: [AD-X z MOD-ATAK-NA-DOWOD — jeśli aktywne]║
║ STATUS EQG: [DOPUSZCZ ✅ / WYKLUCZ ❌ / SZCZEPIJ 🛡]    ║
╚══════════════════════════════════════════════════════════╝
```

---

## KD-2 — REJESTR FAKTÓW (F-nn)

Po wypełnieniu kart — utwórz centralny rejestr faktów:

```
REJESTR FAKTÓW SPRAWY [sygnatura]

F-001: [Treść faktu — jedna konkretna okoliczność]
  Źródło: D[nn] (klasa [X]) + D[nn] (potwierdzenie)
  Pewność: PEWNY / PRAWDOPODOBNY / DOMNIEMANY / SPORNY
  Przepis: art. X §Y [ustawa] — jaką przesłankę tego przepisu wykazuje
  Kontrfakt: [czy istnieje D[nn] który przeczy? jeśli tak — SPORNY]

F-002: [Treść faktu]
  Źródło: D[nn]
  Pewność: PEWNY
  Przepis: art. Y §Z
  Kontrfakt: brak

F-003: [Fakt domniemany z art. 231 KPC]
  Podstawa: F-001 + F-002 → domniemanie faktyczne (art. 231 KPC)
  Pewność: DOMNIEMANY (obalalne przez przeciwnika)
  Kontrfakt: [co musiałby wykazać pozwany żeby obalić]

[ORPHAN]: [Fakt bez przypisania do tezy — sygnał do analizy]
  D[nn] wykazuje F-XXX ale brak tezy która by go konsumowała.
  Rozważyć: nowa teza / zignorować / przenieść do kontekstu.
```

---

## KD-3 — GRAF RELACJI MIĘDZY DOWODAMI

```
Format grafu (per teza T-X):

Graf T-01 (stosunek pracy):

D01 (umowy, kl.B) ──potwierdza──► F-001 (zawarcie 4 umów terminowych)
                                         │
                              ┌──────────┘
                              ▼
D02 (protokół KRS, kl.A) ──wzmacnia──► F-002 (tożsamość podmiotu)
                                         │
                              ┌──────────┘
                              ▼
                         F-001 + F-002
                              │
                    [art. 25¹ §3 KP + art. 23¹ §1 KP]
                              │
                              ▼
                    F-003 (stosunek pracy na czas nieokreślony)
                              │
                    [art. 189 KPC — interes prawny]
                              │
                              ▼
                         TEZA T-01 ★★★★

Graf T-03 (wynagrodzenie PFRON):

D03 (lista PFRON HPG, kl.A) ─────────────────────────────────────►
                                    F-004 (fakt pobierania 123 445 zł)
                                                │
D04 (lista PFRON HP, kl.A) ──ciągłość──► F-005 (hist. pobieranie)
                                                │
D05 (zeznania Nawrota, kl.B) ──potwierdza──► F-006 (praktyka wypłat)
                                                │
D06 (orzeczenie niepełnosp., kl.A) ──► F-007 (stopień znaczny 04-O)
                                                │
          F-004 + F-006 + F-007 ───────────────┘
                    │
         [art. 26a ustawy rehabilitacja + art. 78 §1 KP]
                    │
         F-008 (domniemanie: kwota przekazywana powodowi ≥ 1 000 zł)
                    │        (art. 231 KPC: stopień znaczny → wyższe
                    │         dofinansowanie → wyższy obowiązek)
                    │
D07 (brak WnD od pozwanego) ──ŁO-NEG──►  F-009 (odmowa ujawnienia)
                    │        art. 233 §2 KPC
                    ▼
              TEZA T-03 ★★★★★
```

---

## KD-4 — PROCEDURA BUDOWY ŁAŃCUCHA Z KART

```
Po wypełnieniu KD-1 (karty) i KD-2 (rejestr faktów):

KROK KD-4.1 — Dla każdej tezy T-X:
  Zbierz z rejestru F-nn: które fakty wykazują przesłanki tej tezy?
  (z MOD-LANCUCH-DOWODOWY ŁD-1 — identyfikacja przesłanek prawnych)

KROK KD-4.2 — Ustal typ łańcucha (ŁB-3 z MOD-LANCUCH-DOWODOWY):
  Ł-SEK / Ł-RÓW / Ł-DOM / Ł-NEG / Ł-CIĄ
  → Preferuj Ł-RÓW gdy możliwe ≥2 niezależne drogi

KROK KD-4.3 — Przypisz ogniwa (ŁB-1 z MOD-LANCUCH-DOWODOWY):
  ŁO-BASE = fakty PEWNE z kart kl. A/B
  ŁO-POŚR = fakty PRAWDOPODOBNE / domniemane (art. 231 KPC)
  ŁO-WZM  = fakty z triangulacji (różne klasy źródeł)
  ŁO-NEG  = fakty z odmowy pozwanego (art. 233 §2 KPC)

KROK KD-4.4 — Scoring łańcucha (ŁD-5):
  ★★★★★ gdy: ≥1 kl.A + Ł-DOM + Ł-NEG

KROK KD-4.5 — Format w piśmie (CZĘŚĆ III z MOD-LANCUCH-DOWODOWY):
  Dla tez głównych: pełny schemat ogniw + wniosek łańcucha
  Dla tez pobocznych: format skrócony
```

---

## KD-5 — INTEGRACJA Z PIPELINE pisma-procesowe-v3

```
POZYCJA: Po SD-SKAN (FAZA 2-3 z MOD-SKAN-DOWODOW-KOMPLETNY),
          przed MT1 (MOD-MACIERZ-DOWOD-TEZA), przed W1.3.

FLOW:
  SD-FAKTY (ze skanowania)
    ↓
  KD-1: wypełnij karty dowodowe per D[nn]       ← TEN MODUŁ
    ↓
  KD-2: zbuduj rejestr faktów F-nn              ← TEN MODUŁ
    ↓
  KD-3: narysuj graf relacji per teza           ← TEN MODUŁ
    ↓
  MT1-MT5 (MOD-MACIERZ-DOWOD-TEZA)             ← istniejący
    ↓
  ŁD-1..ŁD-7 (MOD-LANCUCH-DOWODOWY)            ← istniejący, teraz aktywny
    ↓
  W1.3 (mapa przesłanka→dowód→łańcuch)         ← wzbogacona
    ↓
  W2.2 (redakcja pisma z łańcuchami)           ← CZĘŚĆ III z MOD-LANCUCH

ZASADA WYJŚCIA:
  KD-3 (graf) → wejście do ŁD-1 (przesłanki) → ŁD-2 (ogniwa) → ŁD-7 (pismo)
  Generator pisma nie pyta "jakie dowody mam?" —
  pyta "jakie FAKTY prowadzą do TEZY i które DOWODY je wykazują?"

⛔ ZAKAZ: Generowanie pisma bez wypełnionych kart KD-1 gdy ≥2 dokumenty.
⛔ ZAKAZ: Sekcja "Na dowód" w piśmie bez powiązania z rejestrem F-nn.
⛔ ZASADA: Każdy fakt w uzasadnieniu MUSI mieć wpis F-nn w rejestrze.
⛔ ZASADA: Każdy dowód w petitum MUSI mieć kartę D[nn] z wypełnionymi
  polami "fakty wykazywane" i "powiązane tezy".
```

---

## KD-6 — SELF-CHECK KART DOWODOWYCH

```
Per każda karta D[nn]:
□ Czy karta ma lokalizator (str./zakładka/godz.) ze SD-LOC?
□ Czy "fakty wykazywane" są spójne z treścią dokumentu?
□ Czy "fakty nie-wykazywane" są wypełnione (pułapka nadinterpretacji)?
□ Czy "powiązane dowody" wskazują relacje (nie tylko listę)?
□ Czy "siła dowodowa" jest spójna z klasą hierarchii (D1 z MOD-DOWODY)?
□ Czy EQG-1..EQG-4 sprawdzone (BRAMKA-ŁD z MOD-LANCUCH-DOWODOWY)?

Per rejestr F-nn:
□ Czy każdy fakt ma ≥1 źródło (D[nn])?
□ Czy fakty DOMNIEMANE mają podstawę art. 231 KPC?
□ Czy fakty SPORNE mają oznaczenie kontrfaktu?
□ Czy ORPHAN fakty są rozważone (nowa teza / zignorowane)?

Per graf KD-3:
□ Czy każda teza ma ≥2 ogniwa w łańcuchu?
□ Czy ogniwa są z niezależnych źródeł (triangulacja P+)?
□ Czy ŁO-NEG jest wbudowane dla twierdzeń o dokumentach pozwanego?
```

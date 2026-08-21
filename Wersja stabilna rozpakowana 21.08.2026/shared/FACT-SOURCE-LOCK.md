# FACT-SOURCE-LOCK (FSL) — Klasyfikacja i Blokada Twierdzeń Bez Źródła

**Plik kanoniczny:** `/mnt/skills/user/shared/FACT-SOURCE-LOCK.md`
Wywołuj przez: `view /mnt/skills/user/shared/FACT-SOURCE-LOCK.md`
**Wersja:** 1.0 | Data wprowadzenia: 2026-06-01

---

## CEL I ZAKRES

FSL rozszerza MOD-FAKTY o klasyfikację źródła każdego twierdzenia
zanim trafi do pisma. MOD-FAKTY weryfikuje CO jest w piśmie.
FSL weryfikuje SKĄD pochodzi każde twierdzenie i jakie zaufanie mu przysługuje.

**Kluczowa różnica od MOD-FAKTY:**
MOD-FAKTY pyta: "czy to twierdzenie ma oparcie w aktach?"
FSL pyta: "od kogo pochodzi i jaki ma poziom wiarygodności proceduralnej?"

**Szczególny przypadek LSL:**
Twierdzenia o statusie prawnym aktów → LEGAL-STATUS-LOCK (LSL)
FSL jest nadrzędny — każde twierdzenie przechodzi przez FSL,
a twierdzenia o statusie aktów przechodzą dodatkowo przez LSL.

---

## TRÓJPOZIOMOWA KLASYFIKACJA ŹRÓDŁA

```
┌─────────────────────────────────────────────────────────────────┐
│  FSL-A │ FAKT URZĘDOWY                                          │
│         Pochodzi z dokumentu sądowego, urzędowego, protokołu,   │
│         orzeczenia, decyzji, umowy podpisanej przez strony,      │
│         pisma z pieczęcią wpłynięcia / prezentatą.              │
│                                                                  │
│  Poziom wiarygodności: NAJWYŻSZY                                 │
│  Użycie w piśmie: wprost, z adnotacją źródła                   │
│  Przykłady:                                                      │
│    • data wyroku z protokołu ogłoszenia                          │
│    • treść umowy z podpisanego egzemplarza                       │
│    • data doręczenia ze zwrotki pocztowej                        │
│    • sygnatura z pieczęci sądowej                                │
├─────────────────────────────────────────────────────────────────┤
│  FSL-B │ TWIERDZENIE STRONY / ORGANU                            │
│         Pochodzi z pisma procesowego strony, pisma pełnomocnika, │
│         uzasadnienia postanowienia organu, zawiadomienia,        │
│         oświadczenia złożonego w piśmie — nie potwierdzonego    │
│         odrębnym dokumentem urzędowym.                           │
│                                                                  │
│  Poziom wiarygodności: WYMAGA WERYFIKACJI                        │
│  Użycie w piśmie: WYŁĄCZNIE z oznaczeniem:                      │
│    "według twierdzeń [strony/organu]"                            │
│    "jak wskazuje [strona] w piśmie z dnia [data]"               │
│    "według stanowiska [organu]"                                  │
│  ZAKAZ użycia jako faktu przyjętego bez weryfikacji.             │
│  Przykłady:                                                      │
│    • twierdzenie prokuratury "wyrok jest nieprawomocny"          │
│    • twierdzenie pełnomocnika "porozumienie jest ważne"          │
│    • twierdzenie strony "doręczenie nastąpiło 15 marca"          │
│      (gdy brak zwrotki potwierdzającej)                          │
│  Weryfikacja: porównaj z FSL-A lub oblicz (FSL-C)               │
│  Jeśli FSL-B sprzeczne z FSL-A → 🔴 LSL-CONFLICT               │
├─────────────────────────────────────────────────────────────────┤
│  FSL-C │ WNIOSEK ANALITYCZNY                                     │
│         Wynika z obliczeń, porównania dat, logicznego wnioskowania│
│         na danych ze źródeł FSL-A.                               │
│                                                                  │
│  Poziom wiarygodności: WYSOKI (gdy składniki z FSL-A)            │
│  Użycie w piśmie: dopuszczalne, z pokazaniem składników          │
│  Format obowiązkowy:                                             │
│    "[wynik] (obliczenie: [składnik A] + [składnik B] = [wynik],  │
│    źródła: [dok. A], [dok. B])"                                  │
│  Przykłady:                                                      │
│    • "termin apelacji upłynął 20.02.2026                         │
│      (ogłoszenie 13.02.2026 + 7 dni KPW,                        │
│      źródło: protokół ogłoszenia z 13.02.2026)"                  │
│    • "łączny staż pracy: 2 lata 3 miesiące                       │
│      (suma z umów 1-5, źródła: umowy w aktach)"                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## PROCEDURA FSL — WYKONAJ DLA KAŻDEGO TWIERDZENIA FAKTYCZNEGO

```
KROK FSL-1: INWENTARYZACJA
  Wypisz wszystkie twierdzenia faktyczne z materiału wejściowego
  i z planowanego pisma:
  daty, kwoty, stany prawne, opisy zdarzeń, statusy aktów,
  fakty procesowe, dane stron, sygnatury, treści dokumentów.

KROK FSL-2: KLASYFIKACJA ŹRÓDŁA
  Dla każdego twierdzenia przypisz FSL-A, FSL-B lub FSL-C.
  Pytanie klasyfikacyjne:
  "Z jakiego TYPU dokumentu pochodzi to twierdzenie?"
    → Dokument urzędowy / protokół / zwrotka / orzeczenie → FSL-A
    → Pismo strony / organu / pełnomocnika → FSL-B
    → Obliczenie na danych z FSL-A → FSL-C
    → Brak jakiegokolwiek źródła → ⛔ FIKCJA (jak w MOD-FAKTY)

KROK FSL-3: WERYFIKACJA KRZYŻOWA FSL-B
  Dla każdego FSL-B:
  a) Czy istnieje FSL-A lub FSL-C potwierdzający to twierdzenie?
     TAK → podnieś do FSL-A / FSL-C, wskaż dokument potwierdzający
     NIE → pozostaw FSL-B, oznacz w piśmie
  b) Czy istnieje FSL-A lub FSL-C SPRZECZNY z tym twierdzeniem?
     TAK → 🔴 LSL-CONFLICT (jeśli dotyczy statusu aktu)
          lub ⛔ SPRZECZNOŚĆ (jeśli inne twierdzenie)
          → użyj FSL-A, odnotuj sprzeczność

KROK FSL-4: TWIERDZENIA O STATUSIE AKTÓW
  Jeśli FSL-B dotyczy statusu prawnego aktu (prawomocność,
  ostateczność, skuteczność, ważność) → OBOWIĄZKOWO uruchom LSL:
  view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md
  Wynik LSL zastępuje tag FSL-B dla tego twierdzenia.

KROK FSL-5: TAGOWANIE I UŻYCIE W PIŚMIE
  FSL-A  → użyj wprost + adnotacja źródła
  FSL-B  → użyj z oznaczeniem "według twierdzeń [strona]"
  FSL-C  → użyj z pokazaniem składników obliczenia
  ⛔     → usuń lub znacznik ⬛ [UZUPEŁNIJ]
  🔴     → użyj FSL-A, wytknij sprzeczność argumentacyjnie
```

---

## REGUŁY SZCZEGÓLNE

### Reguła FSL-B/STATUS — najczęstszy błąd systemowy

```
⛔ REGUŁA KRYTYCZNA:
Twierdzenie organu lub strony o stanie prawnym
(prawomocny / ostateczny / skuteczny / nieważny / wiążący)
jest ZAWSZE FSL-B do momentu weryfikacji przez LSL.

NIGDY nie traktuj go jako FSL-A tylko dlatego, że pochodzi
od organu publicznego (sądu, prokuratury, ZUS, urzędu).

Organy również mogą się mylić lub działać we własnym interesie.
Przykład wzorcowy: prokurator napisała "wyrok nieprawomocny"
gdy obliczenie dat z protokołów wykazało prawomocność.
```

### Reguła FSL-OBLICZENIE — pokazuj pracę

```
Każdy wniosek FSL-C musi zawierać:
  - każdy składnik z odniesieniem do dokumentu (FSL-A)
  - formułę obliczeniową
  - wynik
  - ewentualne zastrzeżenie co do dni wolnych

Przykład poprawny:
  "Termin zaskarżenia upłynął 20.02.2026
   (ogłoszenie: 13.02.2026 [protokół publ. VIII W 633/25]
   + termin KPW: 7 dni = 20.02.2026;
   brak dowodu apelacji w aktach → ✅ LSL-CONFIRMED: prawomocny)"

Przykład błędny:
  "Wyrok jest prawomocny."
  [brak pokazania składników → twierdzenie bez weryfikowalnego źródła]
```

### Reguła FSL-CHRONOLOGIA — weryfikuj daty

```
Przy każdym twierdzeniu zawierającym datę:
  1. Skąd pochodzi ta data? (FSL-A/B/C)
  2. Czy jest spójna z innymi datami w sprawie?
  3. Czy daty różnych dokumentów tworzą logiczną chronologię?

Sprzeczność dat między dokumentami = sygnał ostrzegawczy:
  → oznacz jako ⚠️ SPRZECZNOŚĆ DAT
  → wypisz obie daty z ich źródłami
  → zapytaj użytkownika o wyjaśnienie
  → nie stosuj żadnej z dat bez potwierdzenia
```

---

## FORMAT RAPORTU FSL

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT FSL — KLASYFIKACJA ŹRÓDEŁ TWIERDZEŃ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TWIERDZENIA FSL-A (fakt urzędowy — użyto wprost):
  [nr]. "[twierdzenie]"
        Źródło: [dokument, data, strona/sekcja]

TWIERDZENIA FSL-B (twierdzenie strony — użyto z oznaczeniem):
  [nr]. "[twierdzenie]"
        Źródło: pismo [kogo], data [data]
        Weryfikacja krzyżowa: [FSL-A potwierdzające / brak / sprzeczne]
        Użycie w piśmie: "według twierdzeń [strona]..."
        [jeśli dotyczy statusu aktu:] → przekazano do LSL → wynik: [tag]

TWIERDZENIA FSL-C (wniosek analityczny):
  [nr]. "[twierdzenie]"
        Składniki: [A] (źródło: [dok.]) + [B] (źródło: [dok.]) = [wynik]

SPRZECZNOŚCI FSL-B vs FSL-A:
  [nr]. FSL-B: "[twierdzenie strony]" (pismo: [kto, data])
        FSL-A: "[fakt z dokumentu]" (dokument: [co, data])
        Działanie: użyto FSL-A; sprzeczność wykorzystana argumentacyjnie

BRAKI ŹRÓDŁOWE (⛔):
  [nr]. "[twierdzenie]" — brak jakiegokolwiek źródła
        Działanie: usunięto / zastąpiono ⬛ [UZUPEŁNIJ]

PODSUMOWANIE:
  FSL-A: [n] | FSL-B: [n] (z oznaczeniem) | FSL-C: [n]
  Sprzeczności: [n] | Braki: [n]
  Przekazano do LSL: [n] twierdzeń o statusie aktów
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## INTEGRACJA

```
MOD-FAKTY          → FSL rozszerza krok F2 (Przypisanie do źródła)
                     o klasyfikację FSL-A/B/C przed oznaczeniem
                     ✅/⚠️/⛔. Wywołaj FSL przed F2.

LEGAL-STATUS-LOCK  → FSL wywołuje LSL automatycznie dla każdego
                     FSL-B dotyczącego statusu prawnego aktu.

MOD-WALIDACJA      → FSL dostarcza blok K do raportu walidacyjnego
                     (zestawienie klasyfikacji źródeł).

pisma-procesowe-v3 → FSL uruchamiany w W1.2 (analiza materiału wejściowego)
                     PRZED rozpoczęciem redakcji pisma.
                     Wynik FSL determinuje, które twierdzenia mogą
                     wejść do W2 jako fakty przyjęte.

HYBRID-VALIDATION  → FSL-B oznaczone w piśmie są automatycznie
                     flagowane w HYBRID-VALIDATION jako wymagające
                     potwierdzenia przez użytkownika.
```

---

## ZASADA NADRZĘDNA

```
⛔ ZERO TOLERANCE DLA FSL-B W ROLI FAKTU PRZYJĘTEGO:

Twierdzenie strony lub organu (FSL-B) NIE MOŻE być użyte
w piśmie procesowym jako fakt przyjęty bez zastrzeżeń —
niezależnie od tego, kto jest autorem twierdzenia
(sąd, prokuratura, ZUS, pełnomocnik, strona).

Dopóki FSL-B nie zostanie potwierdzone przez FSL-A lub FSL-C
albo zweryfikowane przez LSL jako ✅ LSL-CONFIRMED —
MUSI być oznaczone jako twierdzenie, nie fakt.

Naruszenie tej zasady = błąd klasy ⛔ BRAK ŹRÓDŁA
w rozumieniu MOD-FAKTY = BLOKADA FINALIZACJI PISMA.
```

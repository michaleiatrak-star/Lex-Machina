# PRZEBIEG 2 — ANALIZA STRUKTURALNA

> **Model:** Kontynentalny — odpowiednik oceny dowodów przez sąd (KPK art. 7, KPC art. 233)
> **Input:** wyłącznie BF z Przebiegu 1 — zakaz sięgania do surowych dokumentów
> **Output:** OBRAZ ANALITYCZNY (OA) — wejście do Przebiegu 3
> **Zakaz absolutny:** predykcje rozstrzygnięcia, rekomendacje procesowe, kwalifikacja ustawowa

---

## ZASADA NADRZĘDNA PRZEBIEGU 2

OA jest produktem analitycznym, nie prawnym. Każde ustalenie OA musi mieć
odesłanie do BF. Jeśli analiza wymaga sięgnięcia do dokumentu spoza BF —
zatrzymaj się, wróć do P1 i uzupełnij BF.

> **Test OA:** „Czy to ustalenie wymaga znajomości faktów spoza BF?"
> TAK → wróć do P1. „Czy to ustalenie zawiera predykcję lub rekomendację?"
> TAK → przesuń do P3.

---

## A1 — KWALIFIKACJA WSTĘPNA (Filtr #1)

Wyłącznie na podstawie BF. Identyfikacja znamion — bez oceny czy zostały wyczerpane.

```
Rodzaj postępowania: [karne / wykroczeniowe / cywilne / pracownicze / administracyjne]
Przepis kandydujący: [numer i tytuł — bez pełnej treści, to P3]
Znamiona (lista — każde = osobna linia):
  Z1: [nazwa znamienia] — sporne (BF.E6.X) / niesporne (BF.E5.X)
  Z2: ...

⛔ STOP: nie oceniaj czy znamię jest wypełnione — to P3.
```

---

## A2 — STRONA PODMIOTOWA (Filtr #3)

Operuje na BF.E2, BF.E3, BF.E4. Zamiar PRZED skutkiem.

```
Elementy materiału wskazujące na zamiar (min. 3, z odesłaniem do BF):
  1. [element] — BF.E3a.X lub BF.E4.Y
  2. [element] — ...
  3. [element] — ...

Forma winy kandydująca: zamiar bezpośredni / ewentualny / kierunkowy / nieumyślność
Uzasadnienie: [z BF — bez słów oceniających]

Alternatywne wyjaśnienie (neutralne):
  „Działanie mogło wynikać z [X] bez zamiaru [Y]"
  Podstawa: BF.E6.Z

⛔ Subiektywne odczucia pokrzywdzonego ≠ dowód zamiaru (BF.E3 ≠ OA.A2).
```

---

## A3 — KONTEKST SPORU (Filtr #4)

```
Równoległe postępowania (z BF.E2):
  [ ] spór cywilny / pracowniczy / administracyjny — data: [BF.E2.X]
  [ ] PIP, RODO, prokuratura — data: [BF.E2.Y]

Reakcja czy inicjatywa:
  Zdarzenie inicjujące: [BF.E2.X]
  Działanie kwestionowane: [BF.E3.X]
  Chronologia: inicjatywa / reakcja / brak związku
  Podstawa: BF.E2.X–Y

Realizacja uprawnień procesowych:
  [ ] TAK — działanie wpisuje się w tok dochodzenia roszczeń
  [ ] NIE — brak związku z uprawnieniami procesowymi
  Uzasadnienie: BF.E3.X
```

---

## A4 — OCENA DOWODÓW (Filtr #5)

Klasyfikacja dowodów z BF.E4 według hierarchii waloru.

| ID dow. | Typ | Poziom waloru | Spójność wewnętrzna | Spójność z BF | Interes procesowy | Uwagi |
|---------|-----|---------------|--------------------|-----------|--------------------|-------|
| | | A/B/C/D | ✓/✗/częściowa | ✓/✗/częściowa | tak/nie/neutralny | |

**Hierarchia waloru dowodów:**
- **A** — dokumenty urzędowe, protokoły, wydruki elektroniczne z metadanymi
- **B** — zeznania złożone przed organem, z pouczeniem; opinia biegłego sądowego
- **C** — zeznania sądowe; dokumenty prywatne; nagrania celowo przygotowane
- **D** — twierdzenia ustne; oświadczenia pozaprocesowe; zeznania wysoce zainteresowane

```
Siła łączna materiału: [0–10]
  0–3: materiał słaby — predykcja w P3 musi uwzględnić Filtr #8
  4–6: materiał umiarkowany
  7–10: materiał mocny

Luki dowodowe (czego brakuje):
  L1: [brakujący dowód] — wpływ na BF.E6.X
  L2: ...
```

---

## A5 — SŁABOŚCI STRON (Filtr #6) — symetrycznie

### A5a — Strona A (Powód / Oskarżyciel)

| Lp | Słabość | Typ | Odesłanie do BF | Waga |
|----|---------|-----|-----------------|------|
| | | twierdzenie bez dowodu / sprzeczność / interes / przyznanie | | Krytyczna/Wysoka/Średnia/Niska |

### A5b — Strona B (Pozwany / Oskarżony)

| Lp | Słabość | Typ | Odesłanie do BF | Waga |
|----|---------|-----|-----------------|------|
| | | twierdzenie sprzeczne z BF.E4 / milczenie / eskalacja / ewolucja narracji | | Krytyczna/Wysoka/Średnia/Niska |

> Symetria obowiązkowa: jeśli tabele są asymetryczne — wróć do BF.E3 i BF.E4.

---

## A6 — WIARYGODNOŚĆ STRON (Filtr #7)

Ocena stylu i zachowania — z odesłaniem do BF.E3.

| Strona | Styl narracji | Spójność z BF.E2 | Spójność własnych pism | Spontaniczność | Wiarygodność |
|--------|---------------|------------------|----------------------|----------------|-------------|
| | rzeczowy/emocjonalny/agresywny/prawniczy | ✓/✗ | ✓/✗ | wysoka/niska | wysoka/umiarkowana/niska |

> Wiarygodność = wskaźnik pomocniczy dla P3. Nie zastępuje dowodów z A4.

---

## A7 — V10 CONTRADICTION INTELLIGENCE

### A7a — Sprzeczności między-pismowe (Filtr #10)

| Nr | Pismo / data | Twierdzenie 1 | Pismo / data | Twierdzenie 2 | Kwestia sporna | Waga |
|----|-------------|---------------|-------------|---------------|----------------|------|
| | BF.E1.ID | BF.E3.X | BF.E1.ID | BF.E3.Y | | Krytyczna/Wysoka/Średnia |

### A7b — Przyznania niekorzystne (MOD-A Kategoria I)

Dla każdego przyznania:
```
PRZYZNANIE [nr] — [nazwa skrótowa]
FRAGMENT: [streszczenie z BF.E3.X]
ZAMIERZONY EFEKT: [co chciała osiągnąć strona]
FAKTYCZNY EFEKT: [jak można to wykorzystać przeciw niej]
WAGA: Krytyczna / Wysoka / Średnia / Niska
```

### A7c — Argumenty o skutku odwrotnym (MOD-A Kategoria II)

```
ARGUMENT ODWROTNY [nr]
FRAGMENT: [BF.E3.X]
MECHANIZM: A (chronologia) / B (podważa własną tezę) / C (nadmiar dowodu) / D (przepis bez użycia)
EFEKT: [opis]
```

### A7d — Timeline Conflict Engine

Zestawienie chronologii z BF.E2 ze stanem podawanym przez strony w BF.E3:
```
KONFLIKT CHRONOLOGICZNY [nr]:
  Data zdarzenia wg E2: [X]
  Data podana przez stronę A: [Y — BF.E3a.Z]
  Data podana przez stronę B: [Z — BF.E3b.W]
  Skutek procesowy: [sprzeczność wewnętrzna / niemożliwa sekwencja / luka]
```

---

## A8 — SYGNAŁY PROCEDURALNE (Filtr #9)

| Sygnał | Opis (z BF) | Interpretacja pro stronie A | Interpretacja pro stronie B | Waga |
|--------|-------------|-----------------------------|-----------------------------|------|
| | BF.E1.X lub BF.E4.Y | | | |

Reguła kierunkowości wniosku dla każdego sygnału:
```
Krok 1 — Strona składająca: [A/B]
Krok 2 — Strona sprzeciwiająca się: [B/A]
Krok 3 — Interes procesowy obu stron w tej kwestii: [opis]
Krok 4 — Wcześniejsze analogiczne wnioski tej strony: [tak/nie, BF.E1.X]
Krok 5 — Znaczenie procesowe: [opis]
```

> Sygnał proceduralny nigdy nie jest samodzielną podstawą prognozy — to P3.

---

## MODUŁY SPECJALISTYCZNE W P2

Uruchamiaj gdy spełniony warunek uruchomienia:

| Moduł | Warunek | Działanie |
|-------|---------|-----------|
| A | ≥2 pisma procesowe tej samej strony | Wypełnij A7a–A7c |
| B | Porozumienie, art. 87 KC | Wczytaj MOD-B.md → wyniki do OA.B |
| C | Nagranie audio/video | Wczytaj MOD-C.md → wyniki do OA.C |
| D | Ta sama kwota = 2 kwalifikacje | Wczytaj MOD-D.md → wyniki do OA.D |
| E | Spór o konto e-mail | Wczytaj MOD-E.md → wyniki do OA.E |
| F | Audyt własnych pism | Wczytaj MOD-F.md → wyniki do OA.F |

Wyniki modułów dołączaj jako sekcje OA.{litera} z odesłaniami do BF.

---

## TWARDY BUFOR — KONTROLA OA PRZED PRZEJŚCIEM DO P3

```
KONTROLA OA:

C1: Czy OA zawiera predykcje rozstrzygnięcia lub rekomendacje procesowe? → przesuń do P3
C2: Czy każde ustalenie OA.A1–A8 ma odesłanie do BF? → uzupełnij
C3: Czy A5 jest symetryczny (obie strony)? → sprawdź
C4: Czy A4 zawiera WSZYSTKIE dowody z BF.E4 (w tym niekorzystne)? → KPK art. 410
C5: Czy A7a zawiera porównanie pism tej samej strony (nie A vs B)? → sprawdź
C6: Czy A8 każdy sygnał ma dwie interpretacje? → uzupełnij

STATUS OA: KOMPLETNY ✓ / NIEKOMPLETNY ✗ [wskaż]
```

> Status KOMPLETNY → przejście do Przebiegu 3.
> Status NIEKOMPLETNY → wróć do odpowiednich sekcji P2.
> Brak BF → wróć do P1.

---

## NOTY DO PRZEBIEGU 3

Na końcu OA dołącz wskazówki dla P3:

```
PRIORYTETY DLA P3:
PR1: [kwestia prawna wymagająca pilnej kwalifikacji — z OA.A1.Z1/Z2]
PR2: [sprzeczność wymagająca orzecznictwa — OA.A7a.Nr]
PR3: [moduł wymagający głębszej analizy w P3]
PR4: [sygnał proceduralny z A8 wymagający oceny prawnej]
```

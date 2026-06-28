# ORZECZENIA-OUTPUT-SCHEMA — Protokół danych wyjściowych orzeczenia-sadowe-v2

> **Plik:** `/mnt/skills/user/shared/ORZECZENIA-OUTPUT-SCHEMA.md`
> **Wersja:** 1.0
> **Właściciel:** orzeczenia-sadowe-v2
> **Konsumenci:** pisma-procesowe-v3 (W3.2), analizator-umow-v1, analiza-sadowa-v6

---

## CEL MODUŁU

Definiuje ujednolicony format rekordu orzeczenia przekazywanego przez
`orzeczenia-sadowe-v2` do skilli downstream. Eliminuje integrację ad-hoc —
każdy consumer odczytuje dane z tych samych pól w tej samej kolejności.

---

## REKORD ORZECZENIA — POLA OBOWIĄZKOWE

Każde orzeczenie przekazywane downstream MUSI zawierać wszystkie pola
oznaczone `[OBL]`. Pola `[OPT]` — gdy dostępne.

```
ORZ-REKORD {
  [OBL] sygnatura    : pełna sygnatura, np. "II PK 123/22"
  [OBL] sad          : pełna nazwa sądu + izba/wydział,
                       np. "Sąd Najwyższy, Izba Pracy i Ubezpieczeń Społecznych"
  [OBL] data         : dzień-miesiąc-rok, np. "15 marca 2023"
  [OBL] url          : link do oryginału w oficjalnym portalu (Tier 1–2)
  [OBL] ver          : znacznik weryfikacji, np. "✅ [VER: sn.pl, 2026-06-04]"
  [OBL] kategoria    : jedna z: 1 / 2 / 3A / 3B / 4 / 5 / 6 / 6A / 7
  [OBL] teza         : cytat ze źródła, max 30 słów — BEZ parafrazowania z pamięci
  [OBL] aktualnosc   : "✅ aktualna" | "⚠️ nieweryfikowana" | "🔴 zmieniona — [opis]"
  [OPT] alerty       : lista aktywnych alertów per orzeczenie
                       (STARE / SPRZECZNE / ZMIANA_PRAWA / WYMIAR_UE / ZASADA_PRAWNA)
  [OPT] pokrycie_p   : lista przesłanek które to orzeczenie pokrywa, np. ["P1", "P3"]
  [OPT] jurysdykcja  : "PL" | "UE/TSUE" | "ETPC" | "Tier4:[kraj]"
}
```

---

## FORMAT TEKSTOWY PRZEKAZANIA (do wklejenia w piśmie lub raporcie)

```
✅ [sygnatura] — [sad], [data]
   Teza: [teza — max 30 słów]
   URL: [url]
   [ver] | Kat. [kategoria] | Aktualność: [aktualnosc]
   Alerty: [alerty lub "brak"]
   Pokrycie: [pokrycie_p lub "ogólne"]
```

**Przykład wypełniony:**

```
✅ II PK 44/21 — Sąd Najwyższy, Izba Pracy i Ubezpieczeń Społecznych, 12 stycznia 2022
   Teza: Pracodawca nie może rozwiązać umowy bez wypowiedzenia z powodu ciężkiego
         naruszenia obowiązków, jeżeli nie wykazał winy umyślnej lub rażącego niedbalstwa.
   URL: https://www.sn.pl/orzecznictwo/...
   ✅ [VER: sn.pl, 2026-06-04] | Kat. 1 | Aktualność: ✅ aktualna
   Alerty: brak
   Pokrycie: P1, P2
```

---

## INSTRUKCJE PER CONSUMER

### → pisma-procesowe-v3 (W3.2)

Przekazuj rekord jako wpis `✅ On` w raporcie W3:

```
✅ O[n]: [sygnatura] — [sad], [data] — URL: [url] — teza: [teza]
         VER: [ver] | Kat. [kategoria] | Aktualność: [aktualnosc]
         Alerty: [alerty]
```

Gdy orzeczenie NIE przeszło weryfikacji (brak URL w Tier 1–2):
```
⛔ O[n]: [opis orzeczenia] — ŹRÓDŁO NIEPOTWIERDZONE W PORTALU SĄDOWYM
          → ZAKAZ użycia w piśmie. Wstaw ⬛ [UZUPEŁNIJ: orzeczenie potwierdzające X]
```

Pole `pokrycie_p` mapuje na placeholder `[ORZECZENIE: opis → W3]` z W2 —
użyj go do zamknięcia odpowiedniego placeholdera w piśmie.

### → analizator-umow-v1

Przekazuj rekord jako element analizy klauzuli lub ryzyka:

```
ORZECZENIE WSPIERAJĄCE [klauzula/ryzyko X]:
  [sygnatura] — [sad], [data]
  Teza: [teza]
  [ver] | Kat. [kategoria] | Aktualność: [aktualnosc]
  URL: [url]
  Alerty: [alerty]
```

Jeśli alert `ZMIANA_PRAWA` lub `SPRZECZNE` → oznacz klauzulę w raporcie
jako wymagającą dodatkowej weryfikacji przed podpisaniem.

Jeśli `kategoria = 6A` → podkreśl w rekomendacji negocjacyjnej jako
niepodważalną podstawę prawną (uchwała z mocą zasady prawnej).

### → analiza-sadowa-v6 i inne skille

Użyj formatu tekstowego przekazania z sekcji powyżej.
Consumer samodzielnie wybiera pola których potrzebuje.

---

## REGUŁY INTEGRALNOŚCI REKORDU

1. **Teza nigdy nie pochodzi z pamięci ani portalu wtórnego** — wyłącznie ze
   źródła Tier 1–2 zweryfikowanego przez web_fetch w tej samej sesji.

2. **Brak URL = brak rekordu** — orzeczenie bez potwierdzonego URL w Tier 1–2
   NIE jest przekazywane jako `✅`. Przekazywane jest jako `⛔` z komunikatem
   "ŹRÓDŁO NIEPOTWIERDZONE W PORTALU SĄDOWYM".

3. **Aktualność linii** — pole `aktualnosc` pochodzi z Fazy 3 skilla.
   Jeśli Faza 3 nie została wykonana, wpisz "⚠️ nieweryfikowana".

4. **Kat. 6A priorytet** — rekord Kat. 6A consumer ZAWSZE umieszcza jako
   pierwszy w piśmie / raporcie, przed Kat. 1, 3A, 5.

5. **Alert SPRZECZNE** — gdy aktywny, consumer MUSI przekazać oba rekordy
   (Kat. 3A i Kat. 3B). Zakaz ukrywania linii mniejszościowej.

---

## WYWOŁANIE PRZEZ KONSUMENTA

Gdy pisma-procesowe-v3 lub inny skill potrzebuje orzeczeń:

```
// W3.2 pisma-procesowe-v3 — szerokie wyszukiwanie:
view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md
→ Przekaż: dziedzina, przepis/instytucja prawna, lista przesłanek P1..Pn
→ Odbierz: listę rekordów ORZ-REKORD w formacie powyżej
→ Zamknij placeholdery ⚠️On w W2 wynikami z rekordów

// analizator-umow-v1 — weryfikacja orzecznicza klauzuli:
view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md
→ Przekaż: typ umowy, klauzula/ryzyko, przepis bazowy
→ Odbierz: listę rekordów z polem pokrycie_p = ["klauzula_X"]
```

---

*ORZECZENIA-OUTPUT-SCHEMA v1.0 · shared · właściciel: orzeczenia-sadowe-v2*
*Konsumenci: pisma-procesowe-v3 · analizator-umow-v1 · analiza-sadowa-v6*

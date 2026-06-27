# QUESTION-ADMISSIBILITY-GATE — v3.3

> ⛔ HARDGATE — przy każdej powołanej podstawie prawnej:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

---

## PIPELINE FPW — FAKT → PODSTAWA PRAWNA → WNIOSEK

> ⛔ BRAMKA OBOWIĄZKOWA — stosuj do każdego pytania w W3.
> Nie generuj pytania bez zamkniętych kroków FPW-1, FPW-2, FPW-3.

```
KROK FPW-1 — FAKT:
  Zidentyfikuj fakt procesowy, który pytanie ma potwierdzić lub obalić.
  Źródło: dokument (dok_id + strona) / zeznanie (protokół + data) / domniemanie.
  Jeśli fakt nie wynika z żadnego źródła → pytanie niedopuszczalne (spekulacja).

KROK FPW-2 — PODSTAWA PRAWNA (weryfikacja ISAP):
  ⛔ HARDGATE → view /mnt/skills/user/shared/PRAWO-HARDGATE.md
  Wskaż przepis regulujący obowiązek/uprawnienie będące przedmiotem pytania LUB
  decydujący o skutku prawnym odpowiedzi.
  Weryfikacja: web_search przepisu w ISAP → oznacz ✅ [VER: ISAP, data].
  Jeśli brak podstawy prawnej → pytanie może być procesowo irrelewantne.
  ⛔ NIE oznaczaj ✅ bez faktycznego wywołania web_search/web_fetch = CRIT.

KROK FPW-3 — WNIOSEK PROCESOWY + KLASYFIKACJA RYZYKA:
  → TAK: [skutek dla tezy T_X]
  → NIE: [skutek dla tezy T_X]
  Klasyfikacja ryzyka FPW (wybierz jeden):
    BEZPIECZNE       — obie odpowiedzi korzystne lub neutralne
    RYZYKO-ODPOWIEDŹ — odpowiedź NIE aktywnie szkodzi tezie → BLOK E
    RYZYKO-KONTROLA  — pytanie otwarte/WHY → utrata kontroli → WHY-GATE
    RYZYKO-KUMULACJA — pytanie w sekwencji otwiera narrację → zmień kolejność
```

**Przykład FPW (sprawa pracownicza art. 81 KP):**

```
FPW-1: Powód zgłaszał gotowość do pracy po 31.10.2024
        Źródło: e-mail powoda 3.11.2024 (Zał. 7, str. 1)
FPW-2: Art. 81 § 1 KP — wynagrodzenie za czas gotowości
        ✅ [VER: ISAP, isap.sejm.gov.pl, 2026-06-18]
FPW-3: → TAK (dopuścił): obala roszczenie z art. 81 KP za ten okres
        → NIE (nie dopuścił): potwierdza roszczenie — korzystne
        Klasyfikacja: BEZPIECZNE
```

---

## TAKSONOMIA RYZYKA — 3 WYMIARY

Kategoria "ryzykowne" w polu RYZYKO bramki dzieli się na trzy podtypy z
dedykowanymi procedurami. Każdy podtyp wymaga odmiennej reakcji.

### RYZYKO-KONTROLA — utrata prowadzenia narracji

**Definicja:** Pytanie otwarte (narracyjne, "dlaczego", "jak to możliwe",
"proszę wyjaśnić") przy świadku wrogim lub neutralnym w trybie cross.
Świadek staje się nauczycielem, przesłuchujący — uczniem.

**Źródło:** Pozner & Dodd (2024): *"The leading question positions the
cross-examiner as the teacher; the open-ended question positions the
cross-examiner as a student."*

**Bramka WHY-GATE:**
```
⛔ WHY-GATE — aktywna gdy: model = ONE-FACT LUB świadek = wrogi/strony przeciwnej
  Pytania zawierające: "dlaczego", "po co", "w jakim celu", "jak to możliwe",
  "proszę wyjaśnić", "co Pan przez to rozumie" → ZAKAZ = CRIT.
  Klasyfikacja: RYZYKO-KONTROLA → automatyczny BLOK E.
  Alternatywa: zamknij wszystkie wyjścia przez sekwencję faktów zamkniętych,
               dopiero ostatnie pytanie może być kontrolnie otwarte.
  Wyjątek: świadek lojalny / model PEACE / model LEJEK → WHY dozwolone.
```

---

### RYZYKO-ODPOWIEDŹ — obie wersje odpowiedzi nie są bezpieczne

**Definicja:** Pytanie zamknięte, ale FPW-3 wykazuje, że odpowiedź NIE
aktywnie szkodzi tezie procesowej.

**Procedura RYZYKO-ODPOWIEDŹ:**
```
1. Zidentyfikuj wariant szkodliwy (NIE lub TAK).
2. Oceń: czy można przeformułować pytanie tak, by oba warianty były bezpieczne?
   → TAK: przeformułuj i ponów FPW-3.
   → NIE: pytanie do BLOKU E z alternatywą lub rezygnacją.
3. Alternatywa standardowa: rozbij na dwa pytania — każde z jednym faktem
   zamykającym jeden kierunek ucieczki.
```

---

### RYZYKO-KUMULACJA — pytanie bezpieczne, sekwencja ryzykowna

**Definicja:** Pojedyncze pytanie jest poprawne, ale w danej pozycji
sekwencji otwiera możliwość rozbudowania narracji przez świadka o fakty
niekorzystne, które w innej kolejności nie byłyby dostępne.

**Źródło:** Pozner & Dodd: *"The order in which chapters are taken, and
the order of questions within the chapter, is often crucial."*

**Procedura RYZYKO-KUMULACJA:**
```
1. Zidentyfikuj, jaką narrację otwiera odpowiedź twierdzaca na to pytanie.
2. Oceń, czy ta narracja jest dostępna bez tego pytania.
3. Jeśli NIE — zmień kolejność: zamknij "bramę" przez wcześniejsze pytania.
4. Jeśli niemożliwe — oznacz jako RYZYKO-KUMULACJA i zasygnalizuj w BLOKU E.
```

---

## REGUŁA SAFE-Q — pytania bez dowodu kontrolnego

```
Jeśli DOWÓD KON. = brak (pole puste lub "brak"):
  KROK 1: Oceń przez FPW-3 czy obie odpowiedzi są procesowo użyteczne.
    → TAK: pytanie dopuszczalne jako "safe question" — oznacz [SAFE-Q].
    → NIE: pytanie wymaga dowodu kontrolnego lub trafia do BLOKU E.
  KROK 2: Przy SAFE-Q przeformułuj pytanie tak, by:
    a) zamykało wszystkie wyjścia dla świadka (Pozner & Dodd: "close off escape routes"),
    b) odpowiedź w obu wariantach dawała użyteczny wynik procesowy.
  KROK 3: Nigdy nie stosuj SAFE-Q w BLOKU D (impeachment) — BLOK D
    wymaga bezwzględnie dokumentu źródłowego.
```

---

## REGUŁA KNOW-WHEN-TO-STOP

```
Sygnały STOP aktywne w trakcie każdego bloku pytań:

STOP-1 USTĘPSTWO UZYSKANE:
  Świadek potwierdził cel rozdziału → NATYCHMIAST przejdź dalej.
  Nie pytaj o przyczynę. Looping w BLOKU C, potem zmień rozdział.

STOP-2 ODPOWIEDŹ SZKODLIWA:
  Świadek rozszerzył narrację korzystnie dla siebie → nie kontynuuj linii.
  Wróć do pytania zamkniętego z innego obszaru.

STOP-3 ZMIANA POSTAWY ŚWIADKA:
  Świadek odpowiada inaczej niż prognozowano w W2 →
  aktywuj model awaryjny z REKOMENDACJI KOŃCOWYCH.
  Nie improwizuj pytaniami otwartymi.

STOP-4 CEL ROZDZIAŁU OSIĄGNIĘTY:
  Po uzyskaniu wszystkich faktów rozdziału — zakończ. Nigdy "jedno pytanie za dużo".
  Źródło: Gray's Inn (2024): "Learn to recognise victory when it sits in your lap."
```

---

## Klasyfikacja pytań (tabela zbiorcza)

| Typ | Opis | Dopuszczalne w | Procedura |
|---|---|---|---|
| dopuszczalne | zgodne z regułami, cel procesowy jasny | każde postępowanie | FPW → generuj |
| warunkowo dopuszczalne | dopuszczalne po spełnieniu warunku | wskazane | FPW → sprawdź warunek |
| RYZYKO-KONTROLA | otwarte/WHY przy wrogim świadku | tylko PEACE/LEJEK | WHY-GATE → BLOK E |
| RYZYKO-ODPOWIEDŹ | NIE szkodzi tezie | z ostrożnością | przeformułuj lub BLOK E |
| RYZYKO-KUMULACJA | sekwencja otwiera narrację | zmień kolejność | reorganizuj blok |
| sugestywne | sugeruje odpowiedź | tylko cross KPK | weryfikuj HARDGATE |
| niedopuszczalne | narusza zakaz dowodowy | nigdy | BLOK E + alternatywa |
| irrelewantne | brak celu procesowego | nigdy | usuń |
| obraźliwe/manipulacyjne | narusza godność | nigdy | usuń |

---

## Zakazy dowodowe — weryfikuj przez HARDGATE, nie z pamięci

### KPC

- Pytania sugestywne w przesłuchaniu bezpośrednim (art. 271 KPC)
- Prawo odmowy zeznań: małżonek, krewni, osoby przysposobione (art. 261 §1 KPC)
- Tajemnica zawodowa lub państwowa (art. 261 §2 KPC)
- Mediator jako świadek (art. 259¹ KPC)

### KPK

- Dowody z naruszeniem przepisów (art. 168a KPK)
- Tajemnica — zwolnienie przez sąd (art. 180 KPK)
- Zakaz zastępowania zeznań notatkami (art. 174 KPK)
- Prawo odmowy zeznań — osoba najbliższa (art. 182 KPK)
- Prawo odmowy odpowiedzi — narażenie na odpowiedzialność (art. 183 KPK)
- Odczytanie zeznań z postępowania przygotowawczego (art. 391 KPK)

### KPW / KPA

- KPW: odesłanie do KPK (art. 39, 41 KPW) — weryfikuj zakres
- KPA: zeznania świadka (art. 83), wyłączenia (art. 83 §2)

---

## Wzorzec zapisu w macierzy pytań (kompletny)

```
FPW-1:     FAKT — e-mail powoda 3.11.2024 (Zał. 7/str. 1)
FPW-2:     Art. 81 §1 KP ✅ [VER: ISAP, 2026-06-18]
FPW-3:     → TAK: potwierdza roszczenie | → NIE: obala — BEZPIECZNE

PYTANIE:   Czy po 31.10.2024 spółka dopuściła powoda do wykonywania pracy?
CEL:       Potwierdzenie gotowości do pracy bez dopuszczenia
TEZA:      T3 — art. 81 KP wynagrodzenie przestojowe
TYP:       zamknięte
DOWÓD K.:  e-mail powoda Zał. 7 + brak protokołu zdawczo-odbiorczego Zał. 12
RYZYKO:    brak — BEZPIECZNE (obie odpowiedzi użyteczne)
DOPUSZCZ.: dopuszczalne ✅
```

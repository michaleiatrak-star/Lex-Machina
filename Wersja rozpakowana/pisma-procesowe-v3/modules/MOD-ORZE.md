# MOD-ORZE — Wyszukiwanie Podobnych Spraw i Cytowanie Orzeczeń

*Ładuj gdy: potrzebne orzecznictwo do wzmocnienia pisma lub obalenia tezy przeciwnika*
*Główna delegacja: `orzeczenia-sadowe-v2` — wywołuj zawsze przy wyszukiwaniu i weryfikacji*
*ZAKAZ: nigdy nie cytuj orzeczeń z pamięci — zawsze weryfikacja online*

---

## ORZE-1 — Identyfikacja charakterystyk sprawy (przed wyszukiwaniem)

Wypisz 3–5 cech sprawy. Szukasz orzeczeń mających co najmniej 3 z nich:

```
CHARAKTERYSTYKI SPRAWY:
[ ] Typ podmiotu: [osoba fizyczna / spółka / organ publiczny]
[ ] Typ relacji: [pracodawca-pracownik / kontrahenci / organ-obywatel]
[ ] Rodzaj naruszenia: [brak zapłaty / naruszenie dobra osobistego / etc.]
[ ] Specyficzny element: [zakaz konkurencji / nagranie bez zgody / etc.]
[ ] Skutek: [utrata pracy / szkoda majątkowa / utrata reputacji / etc.]
```

---

## ORZE-2 — Frazy kluczowe (3 warianty dla każdego roszczenia)

```
Fraza precyzyjna:  "[przepis]" + "[charakterystyczny fakt sprawy]"
Fraza ogólna:      "[teza prawna którą chcesz potwierdzić]"
Fraza analogiczna: "[podobna instytucja z innej dziedziny]"
```

---

## ORZE-3 — Procedura wyszukiwania → deleguj do `orzeczenia-sadowe-v2`

Wywołaj `orzeczenia-sadowe-v2` z frazami z ORZE-2. Skill przeszuka w kolejności:

| Priorytet | Portal | Zakres |
|-----------|--------|--------|
| 1 | https://www.sn.pl/orzecznictwo | SN, uchwały, zasady prawne |
| 2 | https://orzeczenia.ms.gov.pl | SA, SO, SR |
| 3 | https://www.saos.org.pl | sądy apelacyjne (agregator) |
| 4 | https://orzeczenia.nsa.gov.pl | administracyjne |

**Filtr czasowy (priorytet):**
```
KROK 1: Szukaj z ostatnich 2 lat → czy jest?
KROK 2: Jeśli nie → szukaj z ostatnich 5 lat → czy jest?
KROK 3: Jeśli nie → szukaj starszych, oznacz jako "wcześniejszy precedens"
KROK 4: Sprawdź czy starsze orzeczenie nie zostało uchylone lub zastąpione
```

---

## ORZE-4 — Ocena stopnia podobieństwa (karta dla każdego orzeczenia)

```
ORZECZENIE: [Sąd, data, sygnatura]
ŹRÓDŁO WERYFIKACJI: [URL oficjalnej bazy]
PORÓWNANIE STANÓW FAKTYCZNYCH:
[ ] Typ relacji stron:  IDENTYCZNY / ZBLIŻONY / RÓŻNY
[ ] Rodzaj naruszenia:  IDENTYCZNY / ZBLIŻONY / RÓŻNY
[ ] Skutek naruszenia:  IDENTYCZNY / ZBLIŻONY / RÓŻNY
[ ] Branża / kontekst:  IDENTYCZNY / ZBLIŻONY / RÓŻNY
[ ] Skala naruszenia:   IDENTYCZNA / ZBLIŻONA / RÓŻNA
STOPIEŃ PODOBIEŃSTWA:
  5/5 IDENTYCZNE      = cytuj jako precedens bezpośredni
  4/5 BARDZO ZBLIŻONE = cytuj z zastrzeżeniem różnic
  3/5 ZBLIŻONE        = cytuj jako linię orzeczniczą
  2/5 SŁABO PODOBNE   = cytuj tylko dla tezy ogólnej
  1/5 ODMIENNE        = nie cytuj
TEZA UŻYTECZNA:       [co z orzeczenia wspiera argumentację]
RÓŻNICE DO ZAZNACZENIA: [co różni je od sprawy]
ZASTOSOWANIE W PIŚMIE: [pod którą tezę pisma to podpina]
```

**Weryfikacja treści przed użyciem:**
```
[ ] Przeczytałem pełny tekst (nie tylko nagłówek)
[ ] Stan faktyczny analogiczny (ocena X/5)
[ ] Teza wspiera argumentację (nie jest selektywnie wyrwana)
[ ] Orzeczenie nie zostało uchylone ani zmienione
[ ] URL z oficjalnej bazy (sn.pl, orzeczenia.ms.gov.pl, saos.org.pl)
```

---

## ORZE-5 — Analogia z innej dziedziny prawa

Gdy w danej dziedzinie brak wystarczającego orzecznictwa:

**Analogia formalna** — ten sam przepis w różnych kontekstach
(np. art. 24 KC działa tak samo w sprawie pracowniczej i w sporze
o nieuczciwą konkurencję).

**Analogia funkcjonalna** — różny przepis, ta sama zasada
(np. zakaz zrzeczenia się roszczeń pracowniczych = analogia do
zakazu zrzeczenia się roszczeń konsumenckich).

**Analogia podmiotowa** — podobny typ relacji stron mimo różnej branży
(np. zależność pracodawca–pracownik = analogia do relacji
zleceniodawca–zleceniobiorca w kwestii presji przy podpisywaniu umów).

**Format w piśmie:**
"Choć orzeczenie dotyczy dziedziny [X], wyrażona w nim zasada
dotycząca [Y] ma zastosowanie w niniejszej sprawie, ponieważ [Z]."

---

## ORZE-6 — Formaty cytowania w piśmie

**Podobieństwo 5/5 lub 4/5 (precedens bezpośredni):**
```
Analogiczna sytuacja była przedmiotem rozpoznania przez [Sąd]
w wyroku z dnia [data], sygn. [X] (dostępny: [URL]), gdzie sąd
stwierdził, że [teza własnymi słowami, max 14 słów].
Stan faktyczny tamtej sprawy różni się od niniejszej jedynie
[wskaż różnicę], co nie wpływa na zasadność powyższej zasady.
```

**Podobieństwo 3/5 (linia orzecznicza):**
```
Powyższa kwestia wpisuje się w utrwaloną linię orzeczniczą,
zgodnie z którą [teza ogólna]. Wyraził ją m.in. [Sąd] w wyroku
z dnia [data], sygn. [X] ([URL]), wskazując, że [teza].
Choć sprawa tamta dotyczyła [różnica], wyrażona zasada ma
zastosowanie w niniejszej sprawie, ponieważ [powiązanie].
```

**Podobieństwo 2/5 (teza ogólna):**
```
Zasadę tę potwierdza orzecznictwo — w wyroku z dnia [data],
sygn. [X] ([URL]), [Sąd] wskazał, że [teza ogólna],
co ma zastosowanie do niniejszej sprawy w zakresie [konkretny aspekt].
```

---

## ORZE-7 — Słownik procesowy (pojęcia kluczowe)

**Twierdzenie ≠ Dowód**
Twierdzenie to zdanie strony. Dowód to fakt wynikający z dokumentu lub zeznań.

**Obalenie ogólne ≠ Obalenie skuteczne**
"To nieprawda" = obalenie ogólne (bezskuteczne).
"Twierdzeniu temu przeczy [dokument X], który wykazuje [konkretny fakt]" = skuteczne.

**Analogia ≠ Tożsamość**
Orzeczenie analogiczne wspiera argumentację, ale wymaga wskazania różnic.
Brak wskazania różnic = ryzyko że sąd sam je wskaże i oddali argument.

**Stopień podobieństwa 3/5 ≠ Brak podobieństwa**
Orzeczenie 3/5 ma wartość argumentacyjną jako linia orzecznicza.

**Precedens ≠ Obowiązek**
Polskie prawo nie zna formalnie wiążącego precedensu. Orzecznictwo ma moc
argumentacyjną, nie normatywną — sąd może odstąpić, ale musi to uzasadnić.

## Integracja shared/ORZECZENIA-HIERARCHIA

Przed użyciem orzeczenia w piśmie wczytaj:

```text
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
```

Orzeczenie bez publicznej weryfikacji sygnatury, daty i tezy nie może zostać użyte jako argument procesowy.

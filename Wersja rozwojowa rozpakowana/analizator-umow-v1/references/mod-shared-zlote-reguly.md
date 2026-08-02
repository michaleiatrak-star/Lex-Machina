# MODUŁ SHARED — ZŁOTE REGUŁY REDAKCJI UMÓW
## Analizator Umów v1 · Moduł Współdzielony (wczytaj RAZ na starcie każdego generatora/edycji)

> **Geneza (2026-08-02):** ten plik był już cytowany z dwóch miejsc w systemie
> (`generator/boilerplate-strukturalne.md`, odniesienia „Złota Reguła #4" i
> „Złota Reguła #11") — ale nigdy nie istniał jako samodzielny plik.
> Odniesienia były martwe. Powstał przy audycie porównawczym z pakietem
> zewnętrznym, którego odpowiednik pełnił analogiczną funkcję nadrzędną.
> Numeracja poniżej została dobrana tak, by zgadzała się z już istniejącymi
> odniesieniami (#4, #11) — nie edytuj numerów bez sprawdzenia grep
> `Złota Regu` w całym skillu.
>
> **Podstawa merytoryczna:** reguły 1–6 i 10–12 to nie konwencja jednej
> kancelarii, tylko utrwalony standard redakcji kontraktów w common law i
> praktyce polskiej — zob. K. Adams, *A Manual of Style for Contract
> Drafting* (rozdz. „Defined Terms", „Layout"): konsekwentne wielkie litery
> dla pojęć zdefiniowanych, jedna definicja w jednym miejscu, zakaz
> redundancji. Reguły 7–9 wynikają z essentialia negotii (art. 353¹, 66 i n.
> KC) i praktyki weryfikacji umocowania.

---

## Priorytet

Reguły z tego pliku mają pierwszeństwo nad instrukcjami stylistycznymi z
`generator/style-format-generowania.md` i nad indywidualnymi wzorcami z
`generator/boilerplate-strukturalne.md` w razie sprzeczności — ale są
**podrzędne** wobec HARD GATE cytowania przepisów (R1) i essentialia negotii
z modułu źródłowego (J0–MA). Nie poświęcaj essentialia dla stylu.

## Reguły kardynalne

1. **Każde pojęcie pisane wielką literą musi mieć definicję** w § Definicje
   lub jako definicja lokalna (patrz reguła 11). Wielka litera bez definicji
   = błąd formalny — zgłoś go zawsze przy audycie cudzej umowy.

2. **Spójna terminologia — jedno pojęcie, jeden termin w całym dokumencie.**
   Nie mieszaj „Wykonawca" / „Zleceniobiorca" / „Usługodawca" dla tej samej
   strony. Przy edycji fragmentu (`workflows/popraw-fragment.md`) sprawdź, czy
   wprowadzony termin nie koliduje z terminologią reszty dokumentu.

3. **Każde odesłanie wewnętrzne (§ X ust. Y, art. Z) musi prowadzić do
   istniejącego przepisu.** Po każdej edycji zmieniającej numerację —
   weryfikacja odesłań obowiązkowa (`workflows/weryfikacja-spojnosci-odeslan.md`
   dla dokumentów > 15 stron/§/odesłań; dla krótszych — sprawdzenie ręczne
   przed zwróceniem dokumentu).

4. **Brak osieroconych załączników.** Każdy załącznik wymieniony w preambule
   lub w § Postanowienia końcowe musi istnieć i być przywołany w treści —
   i odwrotnie: każdy załącznik przywołany w treści musi figurować na liście
   załączników. Zob. `generator/boilerplate-strukturalne.md` B.4 pkt 5.

5. **Brak powtórzeń — jedna regulacja, jedno miejsce (DRY).** Jeżeli kwestia
   kar umownych jest uregulowana w § 8, nie powtarzaj jej (ani sprzecznej,
   ani zgodnej wersji) w § 12 „Postanowienia końcowe". Naruszenie tej reguły
   to częsta przyczyna wewnętrznej sprzeczności wykrywanej przez
   `mod-shared-model-umowy.md` (MU.3 — klauzule martwe/redundantne).

6. **Nigdy nie poświęcaj precyzji prawnej dla zwięzłości.** Zwięzłość jest
   bonusem, precyzja jest obowiązkiem. W razie konfliktu — wybierz dłuższe,
   jednoznaczne sformułowanie.

7. **Essentialia negotii muszą być zmapowane PRZED rozpoczęciem redakcji**
   (typ umowy, strony, przedmiot, wynagrodzenie, czas trwania — z modułu
   źródłowego J0–MA). Nie generuj żadnego paragrafu merytorycznego przed
   ukończeniem BRAMKI 2 (WYWIAD/INTAKE) w `rdzen-generowania.md`.

8. **Każda umowa musi mieć**: datę i miejsce zawarcia, pełną identyfikację
   stron oraz sposób reprezentacji z umocowaniem (KRS/CEiDG/pełnomocnictwo) —
   zweryfikowany przez `web_search`/`web_fetch`, nigdy z pamięci
   (`generator/boilerplate-strukturalne.md` B.1).

9. **Klauzule ochronne redaguj na korzyść klienta, dla którego pracujesz** —
   chyba że użytkownik wyraźnie wskazał inaczej (np. „piszemy dla drugiej
   strony, sprawdź jak nas to chroni"). Poziom agresywności klauzuli wg
   `mod-shared-fallback-library.md` (FL.1, poziomy A–D).

10. **Język formalny, precyzyjny, zrozumiały. Bez łaciny w treści klauzul
    operacyjnych.** *Essentialia negotii*, *lucrum cessans*, *dolus*,
    *ex contractu* — dopuszczalne w analizie/komentarzu, zero w treści
    podpisywanej przez stronę niebędącą prawnikiem. Wyjątek: utrwalone
    polskie sformułowania, których pominięcie zmienia znaczenie („siła
    wyższa", „z mocy prawa").

11. **Definicje na początku, odesłania później (zasada DRY dla definicji).**
    Każde pojęcie wymagające definicji (reguła 1) definiuj **raz, na
    początku umowy** — w § Definicje lub w preambule „(dalej: „Pojęcie”)”.
    **Wyjątek:** definicja lokalna jest dopuszczalna, gdy pojęcie ma
    znaczenie wyłącznie w obrębie jednego paragrafu lub sekcji (np. „Okres
    Przejściowy" zdefiniowany i używany tylko w § 2–4 ugody). Zasadą
    pozostaje: jedno miejsce definicji, wiele miejsc użycia — zmiana
    definicji w jednym miejscu propaguje się do całego dokumentu.

12. **§ 1 to zawsze Przedmiot Umowy.** Każda umowa zaczyna część merytoryczną
    od § 1 „Przedmiot Umowy" (lub „Przedmiot Ugody"/„Przedmiot Porozumienia").
    Dla umów prostych (NDA, cesja, jednorazowe zlecenie) § 1 może zawierać
    kompletne zobowiązania stron. Dla umów złożonych (wdrożenie, umowa
    ramowa, body leasing) § 1 jest **mapą** — wymienia punktami co reguluje
    umowa, szczegóły doprecyzowują dalsze paragrafy. Test: „czy osoba
    czytająca tylko § 1 wie, czym Strony się umawiają?" — jeśli tak, § 1
    spełnia funkcję.

## Reguła nadrzędna

> **Umowa musi jak najlepiej zabezpieczać interes klienta, ale musi być
> akceptowalna dla drugiej strony.**

Klauzula, która zostanie odrzucona w negocjacjach (odpowiedzialność bez
limitu po stronie kontrahenta, kary 100% wartości umowy, zakaz konkurencji
10 lat bez ekwiwalentu) — proponuj z adnotacją „wariant agresywny" razem
z wariantem negocjowalnym. To już realizuje `mod-shared-fallback-library.md`
(poziomy A–D) — ta reguła jedynie czyni tę filozofię wiążącą dla całego
systemu generowania, nie tylko dla negocjacji.

## Wytyczne stylistyczne (skrót — pełna wersja: `style-format-generowania.md`)

- Tryb „zobowiązuje się do" zamiast „będzie zobowiązany".
- „Strony zgodnie oświadczają" / „Strony postanawiają" zamiast „Strony deklarują".
- Kwoty: cyframi i słownie przy pierwszym wystąpieniu w części operacyjnej
  (wynagrodzenie, kary umowne); dalej wystarczą cyfry. Daty zawsze cyframi.
- Nazwy stron wielką literą (**Zleceniodawca**, **Wykonawca**), bez kursywy.

## Kiedy stosować

Wczytaj ten plik **raz, na starcie** każdego workflow z `workflows/generator-*.md`
oraz `workflows/popraw-fragment.md` — analogicznie do `rdzen-generowania.md`,
z którym współdziała (BRAMKA 3, przed szkieletem dokumentu). Przy analizie
cudzej umowy (tryb ANALIZA, nie REDAKCJA) reguły 1–6 służą jako lista
kontrolna błędów formalnych do zgłoszenia, nie jako instrukcja redakcyjna.

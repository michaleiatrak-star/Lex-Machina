# BOILERPLATE — klauzule strukturalne (komparycja, preambuła, końcowe)
## Analizator Umów v1 · references/generator/ (BRAMKA 3, KROK szkieletu w każdym generatorze)

> Twój system ma bogaty playbook klauzul **negocjacyjnie wrażliwych**
> (`mod-shared-fallback-library.md` — poziomy A/B/C/D dla odpowiedzialności,
> kar, itd.). Brakowało bazy klauzul **strukturalnych/boilerplate** — tych,
> które nie są przedmiotem negocjacji, ale muszą być w każdej umowie i są
> częstym źródłem błędów formalnych, gdy pisane od zera za każdym razem.
> Ten plik uzupełnia tę lukę. Punkt startowy do dopasowania — **nigdy nie
> kopiuj 1:1**, zawsze dopasuj nazwy stron, dane, odesłania do konkretnej umowy.

---

## B.1 Komparycja / oznaczenie stron

**Osoba prawna:**
> *„[Pełna nazwa spółki] z siedzibą w [miejscowość] przy ul. [adres],
> wpisaną do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego
> przez Sąd Rejonowy [nazwa] pod numerem KRS [numer], NIP: [numer], REGON:
> [numer], kapitał zakładowy w wysokości [kwota] PLN [(w całości wpłacony) —
> jeśli sp. z o.o./S.A.], reprezentowaną przez [imię nazwisko], [funkcja]
> [(uprawnionego/ą do samodzielnej reprezentacji zgodnie z odpisem z KRS
> aktualnym na dzień zawarcia Umowy) lub „działającego/ą łącznie z [imię
> nazwisko], [funkcja]"], zwaną dalej „[Zdefiniowana Nazwa]"."*

**Osoba fizyczna prowadząca działalność gospodarczą:**
> *„[Imię i nazwisko], prowadzącym/ą działalność gospodarczą pod firmą
> [nazwa firmy] z siedzibą w [miejscowość], wpisanym/ą do Centralnej Ewidencji
> i Informacji o Działalności Gospodarczej, NIP: [numer], REGON: [numer],
> zwanym/ą dalej „[Zdefiniowana Nazwa]"."*

**Osoba fizyczna nieprowadząca działalności:**
> *„[Imię i nazwisko], zamieszkałym/ą w [miejscowość] przy ul. [adres],
> legitymującym/ą się dowodem osobistym nr [numer] [lub: PESEL: (numer) —
> dobierz wg celu dokumentu i wymogów odbiorcy], zwanym/ą dalej
> „[Zdefiniowana Nazwa]"."*

**Weryfikacja obowiązkowa przed użyciem (R1 + POV-C w SKILL.md):** dane
rejestrowe (KRS/NIP/REGON, sposób reprezentacji) **zawsze** przez
`web_search`/`web_fetch`, nigdy z pamięci ani z samej treści przekazanej przez
klienta bez potwierdzenia w rejestrze.

## B.2 Preambuła („zważywszy że…")

Stosuj **wyłącznie** gdy kontekst współpracy wymaga wyjaśnienia (np. umowa
wykonawcza do wcześniejszego porozumienia, ugoda, transakcja z historią
negocjacji). **Preambuła ≠ treść** — nie umieszczaj w niej zobowiązań.

> *„ZWAŻYWSZY, ŻE:*
> *(A) [Strona 1] prowadzi działalność w zakresie [opis];*
> *(B) [Strona 2] jest zainteresowana [opis potrzeby/celu];*
> *(C) Strony uzgodniły warunki współpracy opisane w niniejszej Umowie;*
> *STRONY POSTANAWIAJĄ, CO NASTĘPUJE:"*

**Anti-pattern:** *„Strony, zważywszy że X, zobowiązują się do Y"* w jednym
zdaniu preambuły — przenieś zobowiązanie do § 1 lub właściwego paragrafu
merytorycznego.

## B.3 Definicje — technika redakcyjna

**Wzorzec — definicja w § Definicje:**
> *„Ilekroć w Umowie jest mowa o:*
> *1) „[Pojęcie]" — rozumie się przez to [definicja];*
> *2) „[Pojęcie]" — rozumie się przez to [definicja];*
> *…"*

**Wzorzec — definicja lokalna w preambule/paragrafie (dopuszczalna, gdy
pojęcie ma znaczenie tylko lokalnie — patrz SKILL.md Zasada nadrzędna #11
analogiczna do Złotej Reguły #11 KTZR):**
> *„…(dalej: „[Pojęcie]")."*

**Technika: definicja jako zbiór zamknięty** (dla list, np. rodzajów usług,
danych, kategorii dokumentów):
> *„Przez „[Pojęcie]" rozumie się wyłącznie: 1) [element]; 2) [element]; 3)
> [element]. Katalog ten ma charakter zamknięty."*
Stosuj, gdy chcesz zapobiec rozszerzającej wykładni definicji przez drugą
stronę lub sąd (routing: `mod-shared-wykladnia.md` przy sporach o zakres).

## B.4 Postanowienia końcowe — zestaw standardowy

```
1. Forma zmian: „Wszelkie zmiany Umowy wymagają formy pisemnej pod rygorem
   nieważności, chyba że Umowa wyraźnie dopuszcza formę dokumentową dla
   określonych czynności (np. zmiana danych kontaktowych)."
2. Klauzula salwatoryjna: „Jeżeli którekolwiek z postanowień Umowy okaże się
   nieważne lub bezskuteczne, pozostałe postanowienia zachowują moc. Strony
   zobowiązują się zastąpić postanowienie nieważne postanowieniem możliwie
   najbliższym jego celowi gospodarczemu."
   ⚠️ Zastrzeżenie (dodane 2026-07-30): klauzula NIE działa wobec nieważności
   essentialia negotii (elementów przedmiotowo istotnych umowy — np. samego
   przedmiotu świadczenia lub wynagrodzenia). Jeśli sporny zapis w konkretnej
   sprawie dotyczy takiego elementu, sama obecność tej klauzuli nie ocali
   umowy — odnotuj to wprost przy audycie cudzej umowy, zamiast zakładać
   automatyczną skuteczność klauzuli salwatoryjnej w każdym przypadku
   częściowej nieważności (art. 58 §3 KC określa to jako zasadę ogólną,
   ale essentialia negotii pozostają poza jej zakresem ochronnym).
3. Prawo właściwe: „Umowa podlega prawu polskiemu." [przy stronach
   zagranicznych — rozważ wyraźne wskazanie, nie poprzestawaj na domyśle]
4. Sąd/spory: „Spory wynikłe z Umowy Strony poddają rozstrzygnięciu sądu
   właściwego miejscowo dla siedziby [Strony]." [lub zapis na sąd polubowny —
   dopytaj klienta, czy taka jest intencja]
5. Załączniki: „Integralną część Umowy stanowią następujące załączniki:
   1) Załącznik nr 1 — [nazwa]; 2) Załącznik nr 2 — [nazwa]." — WYŁĄCZNIE
   załączniki faktycznie dołączone i faktycznie przywołane w treści (Złota
   Reguła #4 — zakaz osieroconych załączników, zob. też
   `weryfikacja-spojnosci-odeslan.md`).
6. Liczba egzemplarzy: „Umowę sporządzono w [liczba] jednobrzmiących
   egzemplarzach, po [liczba] dla każdej ze Stron." [pomiń przy podpisie
   kwalifikowanym elektronicznym — jeden plik, dopisz zamiast tego zdanie o
   dacie zawarcia liczonej od ostatniego podpisu].
```

## B.5 Zwrot materiałów i dokumentacji (klauzula exit)

> *„W terminie [liczba] dni od dnia rozwiązania lub wygaśnięcia Umowy
> [Strona] zobowiązuje się zwrócić [Stronie] wszelkie otrzymane materiały,
> dokumentację, nośniki danych oraz ich kopie, a także trwale usunąć dane
> uzyskane w związku z wykonywaniem Umowy, chyba że ich zachowanie wynika z
> obowiązku prawnego (np. przepisów o rachunkowości, archiwizacji) — w takim
> wypadku [Strona] informuje [Stronę] o podstawie i okresie zachowania."*

Routing: jeśli materiały obejmują dane osobowe — dodaj odesłanie do
`mod-shared-rodo.md` (obowiązek zwrotu/usunięcia po zakończeniu powierzenia).

## B.6 Cesja wierzytelności — essentialia szybkie (art. 509–518 KC)

- Cesja skuteczna bez zgody dłużnika, **chyba że** umowa pierwotna wyłącza
  zbywalność wierzytelności (pactum de non cedendo) — sprawdź to w umowie
  źródłowej przed sporządzeniem cesji.
- Essentialia: oznaczenie cedenta i cesjonariusza, dokładne oznaczenie
  wierzytelności (tytuł, kwota, termin wymagalności), oświadczenie cedenta o
  istnieniu i niezajęciu wierzytelności (odpowiedzialność za *nomen*, nie za
  wypłacalność dłużnika — chyba że wyraźnie przyjęto gwarancję, art. 516 KC),
  data i forma odpowiadająca formie wierzytelności (jeśli wierzytelność
  stwierdzona pismem — cesja również pisemna dla celów dowodowych, art. 511 KC).
- Zawiadomienie dłużnika — nie jest przesłanką skuteczności cesji między
  stronami, ale chroni cesjonariusza przed skutecznym świadczeniem przez
  dłużnika do rąk cedenta (art. 512 KC) — zawsze zalecaj zawiadomienie.

## Powiązania

- Klauzule negocjacyjnie wrażliwe (odpowiedzialność, kary, FM) —
  `mod-shared-fallback-library.md`, NIE ten plik.
- Kategoryzacja funkcjonalna każdej z powyższych klauzul —
  `references/generator/kategorie-klauzul-taksonomia.md`.
- Styl i typografia — `references/generator/style-format-generowania.md`.

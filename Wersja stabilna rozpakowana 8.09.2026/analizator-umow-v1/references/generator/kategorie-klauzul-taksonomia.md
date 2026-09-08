# TAKSONOMIA KATEGORII KLAUZUL (wzorzec: Adams, MSCD)
## Analizator Umów v1 · references/generator/ (BRAMKA 4 — narzędzie diagnostyczne przy redakcji i poprawkach)

> **Status:** narzędzie analityczne, nie normatywne — nie zastępuje doktryny ani
> orzecznictwa. Pomaga świadomie zaklasyfikować każdą klauzulę do jednej z 7
> kategorii, żeby wykryć mieszanie funkcji w jednym zdaniu — najczęstsze źródło
> niejednoznaczności w umowach.
>
> **Źródła doktrynalne:**
> - Adams, Kenneth A., *A Manual of Style for Contract Drafting*, 5. wyd.,
>   American Bar Association 2023 — koncepcja *„categories of contract language"*.
> - Garner, Bryan A., *Guidelines for Drafting and Editing Contracts*, West
>   Academic Publishing 2019 — komplementarny nacisk na plain language.
> - Wronkowska, S.; Zieliński, M., *Komentarz do Zasad techniki prawodawczej*,
>   Wydawnictwo Sejmowe 2004 — polskie standardy redakcji aktów normatywnych,
>   stosowane tu analogicznie do umów.
> - Rozporządzenie Prezesa Rady Ministrów z 20.06.2002 r. w sprawie „Zasad
>   techniki prawodawczej" (t.j. Dz.U. 2016 poz. 283) [VER przy użyciu w
>   konkretnej sprawie, R1].

Ten plik uzupełnia — nie zastępuje — Twoją ZASADĘ 7 z SKILL.md (ścisły język
prawniczy) i `style-format-generowania.md`. Tamte pliki mówią *jak* pisać
poprawnie; ten plik mówi *do jakiej kategorii* należy dana klauzula, zanim
zaczniesz ją pisać.

---

## Siedem kategorii + dwie pomocnicze

| # | Kategoria | Konstrukcja wprowadzająca | Skutek niewykonania |
|---|---|---|---|
| 1 | **Zobowiązanie** | *„[Strona] zobowiązuje się do [czynności]"* | naruszenie → odpowiedzialność (art. 471 KC) / kara umowna |
| 2 | **Uprawnienie** | *„[Strona] ma prawo do… / może…"* | brak skorzystania nie jest naruszeniem |
| 3 | **Zakaz** | *„[Stronie] nie wolno… / zobowiązuje się nie czynić…"* | naruszenie = wykonanie zakazanej czynności, często kara umowna (art. 483 KC) |
| 4 | **Polityka/zasada** | *„[X] wynosi / biegnie / stanowi / jest…"* | brak strony zobowiązanej — reguła obliczeniowa/definicyjna |
| 5 | **Oświadczenie** | *„[Strona] oświadcza, że…"* | nieprawdziwość = odpowiedzialność za zapewnienie, ew. wady oświadczenia woli (art. 84–86 KC) |
| 6 | **Czynność konwencjonalna** | *„[Strona] niniejszym przenosi / udziela / wyraża zgodę…"* | skutek prawny powstaje przez samą umowę — nie wymaga późniejszego wykonania |
| 7 | **Warunek** | *„W przypadku [zdarzenia]…"* | aktywuje inną kategorię (zobowiązanie/uprawnienie/zakaz/politykę); art. 89–94 KC |
| pom. | Intencja | *„Strony zamierzają, że…"* | nie wiąże, pomaga w wykładni |
| pom. | Rekomendacja | *„[Strona] powinna…"* | wewnętrznie sprzeczna w umowie — brak egzekwowalności |

### Typowe anti-patterny (mieszanie kategorii)

- **Zobowiązanie zamiast polityki:** *„Strony zobowiązują się, że termin płatności
  wynosi 30 dni"* → wystarczy *„Termin płatności wynosi 30 dni."* (polityka nie
  wymaga „zobowiązywania się").
- **Uprawnienie zamiast zobowiązania:** *„Wykonawca może zobowiązać się do…"* —
  wybierz jedno: albo zobowiązuje się, albo ma prawo, nie oba naraz.
- **Rekomendacja zamiast zakazu:** *„Zamawiający nie powinien udostępniać
  Materiałów"* — niejasna egzekwowalność. Lepiej: *„Zamawiający zobowiązuje się
  nie udostępniać Materiałów."*
- **Oświadczenie o przyszłym działaniu:** *„Wykonawca oświadcza, że będzie
  wystawiał faktury"* — przyszłe działanie nie jest faktem do oświadczenia,
  to zobowiązanie: *„Wykonawca zobowiązuje się do wystawiania faktur."*
- **Zobowiązanie zamiast czynności konwencjonalnej:** *„Wykonawca zobowiązuje
  się do przeniesienia praw autorskich"* — wymaga osobnego, późniejszego aktu;
  lepiej *„Wykonawca niniejszym przenosi autorskie prawa majątkowe…"* — skutek
  następuje od razu, bez dodatkowej czynności.
- **Warunek ukryty w zobowiązaniu:** *„Wykonawca zobowiązuje się do
  wstrzymania Usług, jeżeli Zamawiający opóźni się z zapłatą o 30 dni"* — to
  faktycznie warunek + uprawnienie (Wykonawca *może*, nie *musi* wstrzymać).
  Lepiej: *„W przypadku opóźnienia w zapłacie powyżej 30 dni Wykonawca ma
  prawo wstrzymać świadczenie Usług."*

## Reguła operacyjna — 4 pytania przed napisaniem klauzuli

1. Co chcę osiągnąć w tej klauzuli? (skutek docelowy)
2. Jaka kategoria najlepiej oddaje ten skutek?
3. Czy w jednej klauzuli próbuję zrobić więcej niż jedno? Jeśli tak — rozbij.
4. Czy konstrukcja składniowa odpowiada kategorii (tabela wyżej)?

## Reguła operacyjna — diagnoza przy poprawkach (`workflows/generator-umowy.md` KROK 4, `weryfikacja-spojnosci-odeslan.md`)

Gdy klauzula brzmi „dziwnie" lub druga strona zgłasza zastrzeżenia
interpretacyjne — sprawdź w tej kolejności:
1. Czy klauzula miesza kategorie w jednym zdaniu?
2. Czy kategoria jest niewłaściwa dla zamierzonego skutku?
3. Czy klauzula jest tylko obserwacją, z której nie wynika żaden skutek prawny?

## Powiązania w systemie

- `references/generator/style-format-generowania.md` — S.1 (styl redakcyjny)
  opisuje wzorce składniowe uzupełniające tę taksonomię.
- SKILL.md, Zasada 7 (ścisły język prawniczy) — ta taksonomia jest jej
  narzędziem diagnostycznym.
- `workflows/generator-dokumentow-korporacyjnych.md` — essentialia uchwał (§2)
  korzysta z kategorii 6 (czynność konwencjonalna) dla treści samej uchwały
  ("Zgromadzenie niniejszym postanawia...").

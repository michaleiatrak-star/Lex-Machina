# TABELE-OPLAT — hierarchia źródeł przy obliczaniu opłat, kosztów i alimentów

> **Plik:** `shared/TABELE-OPLAT.md`
> **Wersja:** 1.5 (2026-09-12b) — zwrot opłaty (art. 79 KSCU), dalsze zwolnienia
>              i wyłączenia (art. 104–107, 109, 111 KSCU), wyłączenie zwolnień
>              w EPU i S24 (art. 104a), wyjątki od zasady odpowiedzialności za
>              wynik (art. 100–103, 110 KPC);
>              1.4 (2026-09-12) — rejestr opłat cywilnych ogólnych (art. 14–25b,
>              68–78), rozwód i sprawy rodzinne (art. 26, 27, 37, 38), prawo pracy
>              i ubezpieczenia społeczne (art. 35, 36), opłaty karne (ustawa
>              z 23.06.1973) i wpis sądowoadministracyjny; rejestr tabel satelickich;
>              1.3 (2026-09-10w) — pełny katalog zwolnień (art. 94–103 KSCU);
>              1.2 (2026-09-10v) — tabele taks z odczytu treści;
>              1.1 (2026-09-10u) — art. 22 KPC i art. 135 KRO z odczytu treści;
>              1.0 (2026-09-10t) — flaga O-11, część merytoryczna F-135.
> **Status:** KANONICZNY dla KOLEJNOŚCI SIĘGANIA PO KWOTY. Nie zastępuje odczytu
> treści przepisu przy konkretnej sprawie.
> **Wywołanie:** `view shared/TABELE-OPLAT.md` — przed pierwszym podaniem
> jakiejkolwiek kwoty opłaty, taksy albo wyliczenia alimentacyjnego.

---

## ⛔ REGUŁA KOLEJNOŚCI — sedno tego pliku

Kwotę bierze się z **tabeli, która ją ustanawia**, a nie z bazy, która ją
opisuje. Kolejność jest wiążąca:

```
0. ⛔ CZY STRONA W OGÓLE PŁACI — katalog zwolnień (sekcja 2b).
      Pytanie zadawane PRZED sięgnięciem po jakąkolwiek tabelę.
1. TABELA USTANAWIAJĄCA — przepis, który podaje liczbę
      KSCU (opłaty sądowe), rozporządzenia MS (taksy), rozporządzenie RM
      (minimalne wynagrodzenie). ⛔ Odczyt TREŚCI aktu, nie metadanych.
2. BAZA KATALOGUJĄCA — zasób, który mówi, JAKI to rodzaj opłaty i ZA CO
      MP10-koszty, mapy DR, leksykon. Służy do rozpoznania rodzaju
      i podstawy, NIGDY do przepisania liczby.
3. RZĄD 2A/2B — wyłącznie do rozpoznania problemu, nigdy do kwoty.
```

⛔ **Baza katalogująca nie jest źródłem kwoty.** Zmierzony przypadek
(AUDYT-2026-09-10s): `orka-bas` podawał minimalne wynagrodzenie 2026 jako
„~4 750 zł" zamiast 4806 zł — kwota służyła do przeliczenia krotności progu,
więc przybliżenie propagowało się na wynik. Liczba w bazie katalogującej
starzeje się i zaokrągla; liczba w przepisie nie.

⚠️ **Kwota „w przybliżeniu" jest w obliczeniu tym samym co kwota błędna.**
Jeżeli nie masz liczby z tabeli — napisz, że jej nie masz, i podaj gdzie jest.
Nie szacuj.

---

## 1. OPŁATY SĄDOWE — KSCU

**Akt:** ustawa z 28.07.2005 o kosztach sądowych w sprawach cywilnych.
**Tekst jednolity:** `Dz.U. 2025 poz. 1228` ✅ [VER] RZĄD 1 2026-09-10t.
⛔ **KROK 2C:** jedna nowelizacja po tekście jednolitym — `Dz.U. 2026 poz. 473`
(ustawa z 11.03.2026 o zmianie ustawy o PIP, w życie 8.07.2026).

### ⛔⛔ PUŁAPKA, KTÓRA UNIEWAŻNIA NAJCZĘŚCIEJ PODAWANĄ KWOTĘ

Tekst jednolity zawiera **dwa brzmienia art. 13 ust. 2**, rozróżnione
odnośnikami. Odczyt treści (`/text.pdf`, 2026-09-10t):

| Odnośnik | Cap opłaty stosunkowej | Status |
|---|---|---|
| 2) | 200 000 zł | „obowiązuje **do wejścia w życie** zmiany z odnośnika 3" |
| 3) | **100 000 zł** | ustalone ustawą z 25.07.2025 (`Dz.U. 2025 poz. 1157`), **w życie 23.09.2025** |

⛔ **Na dziś obowiązuje cap 100 000 zł.** Powszechnie powtarzana kwota
200 000 zł jest **nieaktualna** od 23.09.2025. Kto czyta tekst jednolity bez
odnośników, przepisze wartość nieobowiązującą — a jest to jedna z najczęściej
cytowanych liczb w postępowaniu cywilnym.

⚠️ Klasa tego błędu: identyczna z O-10 (norma przedwczesna), tylko odwrotnie —
tu w tekście stoi obok siebie brzmienie **wygasłe i obowiązujące**, a rozróżnia
je wyłącznie przypis.

### Art. 13 ust. 1 — opłata stała wg progów WPS (odczyt treści)

| Wartość przedmiotu sporu / zaskarżenia | Opłata |
|---|---|
| do 500 zł | 30 zł |
| ponad 500 do 1 500 zł | 100 zł |
| ponad 1 500 do 4 000 zł | 200 zł |
| ponad 4 000 do 7 500 zł | 400 zł |
| ponad 7 500 do 10 000 zł | 500 zł |
| ponad 10 000 do 15 000 zł | 750 zł |
| ponad 15 000 do 20 000 zł | 1 000 zł |
| **ponad 20 000 zł** | **5% WPS, nie więcej niż 100 000 zł** (art. 13 ust. 2) |

⚠️ Powyższe to art. 13. **Dla wielu kategorii spraw art. 13a–13f i dalsze
ustanawiają opłaty odrębne** (m.in. czynności bankowe — opłata stała 1000 zł
przy WPS ponad 20 000 zł; sprawy egzekucyjne przy WPS ponad 40 000 zł —
2000 zł; postępowanie grupowe). ⛔ Przed zastosowaniem art. 13 sprawdź, czy dla
tej kategorii nie ma przepisu szczególnego.

### Art. 22 — zażalenia (odczyt treści)

Opłata stała **100 zł** od zażalenia na postanowienie w przedmiocie m.in.:
oddalenia wniosku o wyłączenie sędziego lub ławnika; skazania na grzywnę strony,
świadka, biegłego, tłumacza; przymusowego sprowadzenia lub aresztowania świadka;
wynagrodzenia mediatora, biegłego, tłumacza, kuratora; należności świadka.

---

## 1a. SPRAWY CYWILNE — REJESTR OPŁAT OGÓLNYCH KSCU

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści `Dz.U. 2025 poz. 1228` przez
`api.sejm.gov.pl/eli/acts/DU/2025/1228/text.pdf`. Reprodukcja:
`curl -s api.sejm.gov.pl/eli/acts/DU/2025/1228/text.pdf | pdftotext -layout - -`.

⛔ **Ta tabela zastępuje rozproszone tabele „art. 27 pkt 1–6 KSCU" krążące po
systemie.** Art. 27 KSCU **nie ustanawia progów WPS** — ustanawia opłatę stałą
200 zł od enumerowanych pozwów (sekcja 1b). Progi WPS to **art. 13 ust. 1**.

### A. Konstrukcja opłaty — zanim sięgniesz po kwotę

| Podstawa | Treść |
|---|---|
| art. 14 ust. 1 | opłatę **podstawową** pobiera się, gdy przepisy nie przewidują stałej, stosunkowej ani tymczasowej |
| art. 14 ust. 3 | opłata podstawowa = **30 zł** i jest **minimalną opłatą** od pisma podlegającego opłacie |
| art. 14 ust. 4 | pobranie opłaty podstawowej **wyłącza** pobranie innej opłaty |
| art. 14 ust. 5 | przepisów o opłacie podstawowej **nie stosuje się** w postępowaniu wieczystoksięgowym i rejestrowym |
| art. 15 ust. 2 | opłata **tymczasowa** (WPS nieustalalny) — od **30 zł do 2000 zł**; w postępowaniu grupowym od **300 zł do 20 000 zł** |
| art. 15 ust. 3 | opłata **ostateczna** określana w orzeczeniu; gdy WPS nieustalony — **nie wyżej niż 5000 zł** |
| art. 18 ust. 1 | **całą** opłatę pobiera się od pozwu, pozwu wzajemnego i wniosku wszczynającego postępowanie nieprocesowe |
| art. 18 ust. 2 | te same przepisy stosuje się do **apelacji, skargi kasacyjnej, skargi o stwierdzenie niezgodności z prawem, interwencji głównej, skargi o wznowienie, skargi o uchylenie wyroku sądu polubownego** |

⛔ **Art. 18 ust. 2 jest odpowiedzią na pytanie „ile kosztuje apelacja".** Nie ma
osobnej tabeli apelacyjnej — stosuje się tabelę od pozwu, liczoną od **wartości
przedmiotu zaskarżenia**, nie od pierwotnego WPS.

### B. Ułamki opłaty — art. 19–20

| Pismo | Opłata | Podstawa |
|---|---|---|
| sprzeciw od wyroku zaocznego; wniosek o uchylenie europejskiego nakazu zapłaty | **połowa** opłaty | art. 19 ust. 1 |
| pozew spełniający przesłanki postępowania **nakazowego** | **1/4** opłaty | art. 19 ust. 2 pkt 1 |
| pozew w **elektronicznym postępowaniu upominawczym** | **1/4** opłaty | art. 19 ust. 2 pkt 2 |
| interwencja uboczna | **1/5** opłaty | art. 19 ust. 3 pkt 1 |
| **zażalenie** (o ile przepis szczególny nie stanowi inaczej) | **1/5** opłaty | art. 19 ust. 3 pkt 2 |
| zawezwanie do próby ugodowej — prawa niemajątkowe | **1/5**, nie mniej niż **100 zł** | art. 19 ust. 3 pkt 3 |
| **zarzuty od nakazu zapłaty** w postępowaniu nakazowym | **3/4** opłaty; gdy nakaz wydano **przeciwko konsumentowi** — od pozwanego konsumenta **nie więcej niż 750 zł** | art. 19 ust. 4 |
| każda z opłat z art. 19 | **nie mniej niż 30 zł** | art. 20 ust. 1 |

⛔ **EPU: „1,25 % WP" jest wzorem pochodnym, nie przepisem.** Ustawa mówi
o **jednej czwartej opłaty**. Przy WPS ponad 20 000 zł daje to istotnie 1,25 %
(¼ z 5 %), ale przy WPS **do 20 000 zł** opłata bazowa jest **stała** (art. 13
ust. 1), więc ¼ liczy się od kwoty z tabeli, a nie procentem — z podłogą 30 zł
z art. 20 ust. 1. Wzór procentowy stosowany poniżej progu **zaniża albo zawyża**
opłatę.

⛔ **Konsumencki cap 750 zł przy zarzutach (art. 19 ust. 4 zdanie drugie) jest
pomijany w każdej znanej tabeli satelickiej.** Przy nakazie nakazowym na
100 000 zł różnica to 3750 zł vs 750 zł.

### C. Opłaty stałe najczęściej mylone

| Pismo / czynność | Opłata | Podstawa |
|---|---|---|
| **skarga na czynności komornika** | **50 zł** | art. 25 ust. 1 |
| zażalenie na odmowę dokonania czynności notarialnej | 100 zł | art. 25 ust. 1a |
| skarga na orzeczenie referendarza | wysokość opłaty od wniosku o wydanie tego orzeczenia, **nie więcej niż 100 zł** | art. 25 ust. 2 |
| rozszerzenie powództwa / zmiana zwiększająca WPS | **różnica** między opłatą od powództwa rozszerzonego a dotychczasową, nie mniej niż 30 zł | art. 25a |
| wniosek o doręczenie **wyroku albo postanowienia co do istoty sprawy** z uzasadnieniem | **100 zł** | art. 25b ust. 1 |
| wniosek o doręczenie **innego postanowienia lub zarządzenia** z uzasadnieniem | **30 zł** | art. 25b ust. 2 |
| wniosek o **udzielenie, zmianę lub uchylenie zabezpieczenia** | **100 zł** | art. 68 pkt 1 |
| wniosek o zabezpieczenie **roszczenia pieniężnego złożony przed** wniesieniem pisma wszczynającego | **1/4** opłaty należnej od pozwu o to roszczenie | art. 69 ust. 1 |
| wniosek o wyjawienie majątku, o ukaranie grzywną dłużnika, o wykonanie zastępcze i in. | 200 zł | art. 70 |
| wniosek o **nadanie klauzuli wykonalności** (tytuł inny niż orzeczenie sądu, ugoda sądowa, nakaz zapłaty, ugoda przed mediatorem z postanowienia sądu; przeciw małżonkowi dłużnika; przeciw następcy prawnemu; przeciw wspólnikowi) | **50 zł** | art. 71 pkt 1–6 |
| poświadczony odpis, wypis, wyciąg, odpis ze stwierdzeniem prawomocności lub wykonalności, zaświadczenie | **20 zł za każde rozpoczęte 10 stron** | art. 77 ust. 1 |
| zapis dźwięku albo obrazu i dźwięku z posiedzenia | 20 zł **za każdy nośnik** | art. 77 ust. 1a |
| **pierwszy** wniosek strony, która wszczęła postępowanie, o odpis orzeczenia kończącego z klauzulą wykonalności | **bez opłaty** | art. 77a |
| kopia dokumentu z akt | 20 zł za każde rozpoczęte **20 stron** | art. 78 |

⛔ **Trzy liczby, które w systemie krążyły błędnie:** skarga na czynności
komornika to **50 zł, nie 100 zł** (art. 25 ust. 1); wniosek o zabezpieczenie ma
podstawę w **art. 68 pkt 1, nie art. 69** (art. 69 to osobna konstrukcja ułamkowa
dla roszczeń pieniężnych przed wszczęciem); opłata kancelaryjna to **20 zł / 10
stron, nie 6 zł za stronę** (art. 77 ust. 1) — **6 zł za stronę obowiązuje
w sprawach karnych**, art. 19 ust. 1 ustawy o opłatach w sprawach karnych, i to
jest źródło pomyłki.

### D. Opłaty szczególne zamiast art. 13 — sprawdź PRZED tabelą progów

| Kategoria | Opłata | Podstawa |
|---|---|---|
| roszczenia z **czynności bankowych**, strona będąca konsumentem lub osobą fizyczną prowadzącą gospodarstwo rodzinne, WPS ponad 20 000 zł | stała **1000 zł** | art. 13a |
| roszczenia z art. 36 ustawy o planowaniu i zagospodarowaniu przestrzennym, WPS ponad 20 000 zł | stała **1000 zł** | art. 13b |
| usunięcie niezgodności treści KW; pozbawienie tytułu wykonalności; zwolnienie zajętego przedmiotu od egzekucji — WPS ponad **40 000 zł** | stała **2000 zł** | art. 13c |
| prawa majątkowe w **postępowaniu grupowym** | **połowa** opłaty z art. 13/13a/13b, nie mniej niż 100 zł i nie więcej niż 200 000 zł | art. 13d |
| powód **przed** wytoczeniem powództwa wziął udział w **mediacji** z umowy o mediację albo złożył wniosek do sądu polubownego konsumenckiego / o pozasądowe rozwiązanie sporu | opłata od pozwu **obniżona o 2/3, nie więcej niż o 400 zł** | art. 13e |
| skarga pauliańska przy roszczeniu stwierdzonym tytułem, WPS ponad 20 000 zł | stała **1000 zł** | art. 13f |

⚠️ **Art. 13e to jedyna w KSCU premia za mediację i jest systematycznie
pomijana.** Obniżka działa z mocy prawa, ale wymaga **wykazania** udziału
w mediacji przed wytoczeniem powództwa.

⛔ **Nie istnieje w KSCU „opłata w sprawach gospodarczych 5 % z capem 20 000 zł".**
Sprawy gospodarcze podlegają art. 13 na zasadach ogólnych, chyba że wchodzi
przepis szczególny z tabeli wyżej. Twierdzenie o odrębnym capie 20 000 zł
zostało w tej sesji **sprawdzone w treści aktu i nie znalazło podstawy**.

---

## 1b. ROZWÓD I SPRAWY RODZINNE — opłaty stałe, niezależne od WPS

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści KSCU `Dz.U. 2025 poz. 1228`,
Dział 3 rozdział 1 oraz Dział 4 rozdział 1.

| Sprawa | Opłata | Podstawa |
|---|---|---|
| **pozew o rozwód** | **600 zł** | art. 26 ust. 1 pkt 1 |
| pozew o **separację** (sporną, w procesie) | **600 zł** | art. 26 ust. 1 pkt 2 |
| ochrona dóbr osobistych | 600 zł | art. 26 ust. 1 pkt 3 |
| ochrona innych praw niemajątkowych, o ile przepis szczególny nie stanowi inaczej | 600 zł | art. 26 ust. 1 pkt 6 |
| ustalenie istnienia lub nieistnienia małżeństwa | 200 zł | art. 27 pkt 1 |
| **unieważnienie małżeństwa** | **200 zł** | art. 27 pkt 2 |
| rozwiązanie przysposobienia | 200 zł | art. 27 pkt 3 |
| **zaprzeczenie ojcostwa lub macierzyństwa** | 200 zł | art. 27 pkt 4 |
| unieważnienie uznania dziecka | 200 zł | art. 27 pkt 5 |
| ustanowienie przez sąd **rozdzielności majątkowej** | 200 zł | art. 27 pkt 6 |
| **separacja na zgodne żądanie małżonków** | **100 zł** | art. 37 pkt 3 |
| **zniesienie separacji** | 100 zł | art. 37 pkt 4 |
| zmiana wyroku rozwodowego / separacyjnego w części dotyczącej **władzy rodzicielskiej** | 100 zł | art. 37 pkt 2 |
| zezwolenie na zawarcie małżeństwa | 100 zł | art. 37 pkt 1 |
| **podział majątku wspólnego** po ustaniu wspólności | **1000 zł** | art. 38 ust. 1 |
| podział majątku wspólnego — **zgodny projekt podziału** we wniosku | **300 zł** | art. 38 ust. 2 |

### ⛔ Art. 26 ust. 2 — opłata, która powstaje DOPIERO W WYROKU

> W sprawach o rozwód, o separację lub o unieważnienie małżeństwa, w razie
> zasądzenia alimentów na rzecz małżonka w orzeczeniu kończącym postępowanie
> w instancji, pobiera się **od małżonka zobowiązanego opłatę stosunkową od
> zasądzonego roszczenia**, a w razie nakazania **eksmisji** jednego z małżonków
> albo **podziału wspólnego majątku** pobiera się także opłatę w wysokości
> przewidzianej od pozwu lub wniosku w takiej sprawie.

⛔ **600 zł nie jest pełnym kosztem rozwodu z żądaniami dodatkowymi.** Jeżeli sąd
zasądzi alimenty na rzecz małżonka, orzeknie eksmisję albo dokona podziału
majątku — dochodzi opłata **naliczana po wyroku**, według stawki właściwej dla
takiej sprawy (podział majątku: 1000 zł / 300 zł z art. 38). Podanie klientowi
samej kwoty 600 zł przy pozwie zawierającym te żądania jest zaniżeniem
prognozy kosztowej, a nie błędem cytowania.

⚠️ **Alimenty na rzecz DZIECKA w wyroku rozwodowym to inna sytuacja** —
strona dochodząca roszczeń alimentacyjnych jest zwolniona z mocy art. 96 ust. 1
pkt 2 KSCU (sekcja 2b). Art. 26 ust. 2 dotyczy alimentów **na rzecz małżonka**
i obciąża **zobowiązanego**, nie uprawnionego.

⛔ **Zanim podasz 600 zł jako koszt — sprawdź zwrot.** Rozwód lub separacja na
zgodny wniosek **bez orzekania o winie** → zwrot **połowy** opłaty (art. 79 ust. 1
pkt 3 lit. b KSCU, bez potrącenia opłaty minimalnej). Cofnięcie pozwu wskutek
**pojednania** w I instancji → zwrot **całości** (art. 79 ust. 2). Sekcja 2c.

⚠️ Stawka pełnomocnika w sprawie rozwodowej: **720 zł** (sekcja 3) i **nie
zależy od WPS**; obejmuje roszczenia majątkowe dochodzone łącznie **z wyjątkiem**
roszczeń z art. 58 § 2 i 3 KRO.

---

## 1c. PRAWO PRACY I UBEZPIECZENIA SPOŁECZNE

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści KSCU art. 35 i 36 oraz art. 96 ust. 1
pkt 4 i art. 14 ust. 3.

### ⛔ Mechanizm jest inny, niż opisują tabele satelickie

> **Art. 35 ust. 1.** W sprawach z zakresu prawa pracy **od pracodawcy** pobiera
> się **opłatę podstawową wyłącznie od apelacji, zażalenia, skargi kasacyjnej
> i skargi o stwierdzenie niezgodności z prawem prawomocnego orzeczenia**.
> Jednakże w sprawach, w których wartość przedmiotu sporu przewyższa kwotę
> **50 000 złotych**, od wartości przedmiotu sporu **ponad tę kwotę**, od
> pracownika i pracodawcy pobiera się **opłatę od apelacji**, na zasadach
> przewidzianych w art. 13.

| Sytuacja | Opłata | Podstawa |
|---|---|---|
| **pracownik** wnoszący powództwo lub wniosek | **nie ma obowiązku uiszczenia kosztów sądowych** (z zastrzeżeniem art. 35 ust. 1 zd. 2) | art. 96 ust. 1 pkt 4 |
| **pracodawca** — pozew, odpowiedź na pozew, pisma w toku I instancji | opłata **nie jest pobierana** (art. 35 ust. 1 wymienia zamknięty katalog pism) | art. 35 ust. 1 zd. 1 |
| pracodawca — **apelacja, zażalenie, skarga kasacyjna, skarga o stwierdzenie niezgodności z prawem** | **opłata podstawowa 30 zł** | art. 35 ust. 1 zd. 1 w zw. z art. 14 ust. 3 |
| **WPS ponad 50 000 zł** — apelacja pracownika **i** pracodawcy | opłata wg art. 13, liczona **od nadwyżki ponad 50 000 zł** | art. 35 ust. 1 zd. 2 |
| pracodawca w sprawie o ustalenie istnienia stosunku pracy z powództwa **inspektora pracy** | opłata podstawowa od pism z ust. 1 | art. 35 ust. 2 |
| **ubezpieczenia społeczne** i odwołania rozpoznawane przez sąd pracy i ubezpieczeń społecznych | opłata podstawowa **wyłącznie** od apelacji, zażalenia, skargi kasacyjnej i skargi o stwierdzenie niezgodności z prawem | art. 36 ust. 1 |
| strona wnosząca **odwołanie** do sądu pracy i ubezpieczeń społecznych | art. 36 ust. 1 **nie ma zastosowania** — odwołanie bez opłaty | art. 36 ust. 2 w zw. z art. 96 ust. 1 pkt 4 |
| **inspektor pracy i związki zawodowe** w sprawach z zakresu prawa pracy | bez obowiązku uiszczenia kosztów sądowych | art. 96 ust. 1 pkt 8 |
| ochrona roszczeń pracowniczych przy niewypłacalności pracodawcy | bez obowiązku uiszczenia kosztów sądowych | art. 96 ust. 1 pkt 14 |

⛔ **Trzy błędy, które ten przepis generuje najczęściej:**
1. **„Pozew pracowniczy przy WPS ponad 50 000 zł kosztuje 5 % nadwyżki"** —
   nieprawda. Zdanie drugie art. 35 ust. 1 mówi o opłacie **od apelacji**, nie od
   pozwu. Pracownik wnoszący pozew pozostaje zwolniony z art. 96 ust. 1 pkt 4
   **niezależnie od WPS**; próg 50 000 zł uruchamia opłatę dopiero na etapie
   apelacyjnym.
2. **„W sprawach pracowniczych 5 % WPS, nie mniej niż 30 zł i nie więcej niż
   1000 zł"** — taka norma **nie występuje w obowiązującym tekście KSCU**;
   sprawdzone w treści aktu w tej sesji.
3. **Opłata podstawowa to 30 zł** (art. 14 ust. 3), a nie kwota wyprowadzana
   z tabeli progów.

⚠️ Stawki pełnomocnika w sprawach pracowniczych są odrębne i **nie wynikają
z tabeli WPS** — patrz sekcja 3a.

---

## 2. ALIMENTY — najpierw zwolnienie, dopiero potem obliczenie

### ⛔ Art. 96 ust. 1 pkt 2 KSCU (odczyt treści)

> Nie mają obowiązku uiszczenia kosztów sądowych: […] **strona dochodząca
> roszczeń alimentacyjnych oraz strona pozwana w sprawie o obniżenie alimentów**.

⛔ **To jest pierwsze pytanie w każdej sprawie alimentacyjnej**, przed
liczeniem czegokolwiek. Podanie kwoty opłaty stronie zwolnionej z mocy ustawy
jest błędem cięższym niż podanie kwoty błędnej — zniechęca do wniesienia pisma,
które nic nie kosztuje.

⚠️ Zwolnienie jest **kierunkowe**: obejmuje dochodzącego alimentów i pozwanego
w sprawie o **obniżenie**. Nie obejmuje automatycznie każdej strony każdej
sprawy alimentacyjnej — sprawdź, po której stronie stoi Twój podmiot i o co
toczy się spór.

⚠️ Zwolnienie od **kosztów sądowych** to nie to samo co zwolnienie od **kosztów
zastępstwa procesowego** zasądzanych na rzecz przeciwnika. Ryzyko kosztowe
liczy się osobno.

### Wartość przedmiotu sporu w alimentach — art. 22 KPC

✅ [VER] RZĄD 1 2026-09-10u — odczyt treści KPC (`Dz.U. 2026 poz. 468`, `/text.pdf`):

> **Art. 22.** W sprawach o prawo do świadczeń powtarzających się wartość
> przedmiotu sporu stanowi **suma świadczeń za jeden rok**, a jeżeli świadczenia
> trwają krócej niż rok – za cały czas ich trwania.

```
WPS = kwota miesięczna × 12        (świadczenie bezterminowe lub dłuższe niż rok)
WPS = suma za cały okres           (świadczenie krótsze niż rok)
```

⚠️ Przy żądaniu **podwyższenia** alimentów WPS liczy się od **różnicy**, nie od
pełnej kwoty — bo przedmiotem sporu jest przyrost, nie całe świadczenie.
⛔ Ta reguła nie wynika wprost z art. 22 i przy sprawie granicznej wymaga
sprawdzenia w orzecznictwie — nie stosować jej jako pewnika.

⚠️ Art. 21 KPC: przy kilku roszczeniach w jednym pozwie **wartości się zlicza**
(np. alimenty na dwoje dzieci).

⛔ **WPS jest potrzebny NAWET przy zwolnieniu od opłaty** — decyduje
o właściwości rzeczowej i o stawce kosztów zastępstwa. Zwolnienie z art. 96
ust. 1 pkt 2 KSCU nie zwalnia z obowiązku jego wskazania.

---

## 2a. ALIMENTY — co decyduje o WYSOKOŚCI (art. 135 KRO)

**Akt:** Kodeks rodzinny i opiekuńczy, t.j. `Dz.U. 2026 poz. 236`.
✅ [VER] RZĄD 1 2026-09-10u — odczyt treści.

> **Art. 135 § 1.** Zakres świadczeń alimentacyjnych zależy od
> **usprawiedliwionych potrzeb uprawnionego** oraz od **zarobkowych
> i majątkowych możliwości zobowiązanego**.

⛔ **To są DWIE przesłanki, nie jedna.** Wyliczenie oparte wyłącznie na
potrzebach dziecka jest niekompletne; wyliczenie oparte wyłącznie na dochodach
rodzica — również. Obie trzeba wykazać dowodowo i obie sąd waży.

⚠️ **„Możliwości zarobkowe" to nie to samo co „dochód faktyczny".** Przepis mówi
o możliwościach — co obejmuje zdolność zarobkowania niewykorzystywaną. Nie
przeliczać mechanicznie z zaświadczenia o zarobkach.

> **§ 2.** Wykonanie obowiązku alimentacyjnego względem dziecka, które nie jest
> jeszcze w stanie utrzymać się samodzielnie albo wobec osoby niepełnosprawnej
> może polegać **w całości lub w części na osobistych staraniach** o utrzymanie
> lub o wychowanie uprawnionego; w takim wypadku świadczenie alimentacyjne
> pozostałych zobowiązanych polega na pokrywaniu kosztów utrzymania lub
> wychowania.

⛔ **Osobiste starania są formą wykonania obowiązku, nie okolicznością
łagodzącą.** Rodzic sprawujący bieżącą pieczę wykonuje obowiązek w naturze —
to przesuwa ciężar finansowy na drugiego zobowiązanego. Pominięcie § 2 zaniża
żądanie strony sprawującej pieczę.

> **§ 3.** Na zakres świadczeń alimentacyjnych **nie wpływają** m.in.:
> świadczenia z pomocy społecznej lub funduszu alimentacyjnego podlegające
> zwrotowi przez zobowiązanego […]

⛔ **Świadczeń z funduszu alimentacyjnego i pomocy społecznej NIE ODLICZA SIĘ**
od żądanej kwoty. Argument „dziecko dostaje 500+/fundusz, więc alimenty mogą
być niższe" jest wprost sprzeczny z § 3. ⚠️ Katalog § 3 jest dłuższy —
odczytać go w całości przy sprawie.

### Przesłanki roszczenia (odczyt treści)

| Podstawa | Treść |
|---|---|
| art. 128 | obowiązek obciąża **krewnych w linii prostej oraz rodzeństwo** |
| art. 129 § 1 | zstępni przed wstępnymi, wstępni przed rodzeństwem; bliżsi stopniem przed dalszymi |
| art. 129 § 2 | krewnych w tym samym stopniu — **w częściach odpowiadających ich możliwościom** |
| art. 130 | obowiązek byłego małżonka **wyprzedza** obowiązek krewnych |
| art. 133 § 1 | rodzice wobec dziecka niezdolnego do samodzielnego utrzymania — **chyba że dochody z majątku dziecka wystarczają** |
| art. 133 § 2 | poza tym wypadkiem uprawniony jest **tylko ten, kto znajduje się w niedostatku** |
| art. 133 § 3 | rodzice mogą się uchylić wobec dziecka **pełnoletniego** przy nadmiernym uszczerbku **lub** gdy dziecko nie dokłada starań o samodzielność |
| art. 138 | w razie **zmiany stosunków** można żądać zmiany orzeczenia lub umowy |

⛔ **Art. 133 § 1 nie zna granicy wieku.** Kryterium to zdolność do
samodzielnego utrzymania, nie ukończenie 18 ani 26 lat. Uchylenie się wobec
dziecka pełnoletniego wymaga wykazania jednej z przesłanek § 3 — nie następuje
z mocy prawa.

⚠️ Art. 140 § 2: roszczenie regresowe osoby, która dostarczała środków zamiast
zobowiązanego, **przedawnia się z upływem 3 lat**.

---

## 2b. ⛔ ZWOLNIENIA OD KOSZTÓW — PEŁNY KATALOG

✅ [VER] RZĄD 1 2026-09-10w — odczyt treści KSCU (`Dz.U. 2025 poz. 1228`).

⛔ **To jest pierwsze pytanie w KAŻDEJ sprawie, nie tylko alimentacyjnej.**
Wcześniejsza wersja tego pliku wymieniała wyłącznie art. 96 ust. 1 pkt 2
(alimenty) — bo powstała przy pracy nad alimentami. Katalog jest znacznie
szerszy i pominięcie go oznacza podanie kwoty komuś, kto nic nie płaci.

### A. Zwolnienie PODMIOTOWE z mocy ustawy — art. 96 ust. 1

Nie mają obowiązku uiszczenia **kosztów sądowych** (opłaty + wydatki):

| pkt | Kto |
|---|---|
| 1 | strona dochodząca **ustalenia ojcostwa lub macierzyństwa** oraz roszczeń z tym związanych |
| 2 | strona dochodząca **roszczeń alimentacyjnych** oraz pozwana w sprawie o **obniżenie** alimentów |
| 3 | strona wnosząca o **uznanie postanowień umownych za niedozwolone** |
| 4 | **pracownik** wnoszący powództwo lub wniosek (z zastrzeżeniem art. 35 ust. 1 zd. 2) albo strona wnosząca **odwołanie do sądu pracy i ubezpieczeń społecznych** |
| 5 | **kurator** wyznaczony przez sąd orzekający lub opiekuńczy dla danej sprawy |
| 6 | prokurator, **RPO**, Rzecznik Praw Dziecka, Rzecznik Praw Pacjenta, Rzecznik Finansowy, Rzecznik MŚP |
| 7, 11 | **powiatowy (miejski) rzecznik konsumentów** — praktyki ograniczające konkurencję i naruszające zbiorowe interesy (pkt 7) oraz ochrona interesów indywidualnych (pkt 11) |
| 7a | podmiot upoważniony z art. 46a ustawy o ochronie konkurencji i konsumentów |
| 8 | **inspektor pracy oraz związki zawodowe** w sprawach z zakresu prawa pracy |
| 9 | strona w sprawach związanych z **ochroną zdrowia psychicznego** |
| 9a | osoba **ubezwłasnowolniona** — o uchylenie lub zmianę ubezwłasnowolnienia |
| 10 | strona **zwolniona przez sąd** — w zakresie przyznanego zwolnienia |
| 12 | strona dochodząca naprawienia **szkód górniczych** (dział VIII Prawa geologicznego i górniczego) |
| 13 | osoba ubiegająca się o **kompensatę** dla ofiar niektórych czynów zabronionych |
| 14 | strona w sprawach **ochrony roszczeń pracowniczych** przy niewypłacalności pracodawcy |
| 15 | **osoba doznająca przemocy domowej** w sprawach z zakresu przeciwdziałania przemocy domowej |
| 16 | osoba wnosząca pozew o **rentę** z art. 444 § 2 lub 446 § 2 KC albo żądająca zabezpieczenia takiego roszczenia |
| 17 | odwołanie od postanowień Państwowej Komisji ds. przeciwdziałania wykorzystaniu seksualnemu małoletnich poniżej lat 15 |
| 18 | apelacja od decyzji Państwowej Komisji ds. badania wpływów rosyjskich 2007–2022 |

⚠️ **Art. 96 ust. 2–4 — kto ponosi wydatki mimo zwolnienia:** za kuratora
wydatki ponosi **tymczasowo strona**, dla której go ustanowiono (albo ta, która
spowodowała ustanowienie); w pozostałych wypadkach **tymczasowo Skarb Państwa**.
⛔ Przy oczywiście bezzasadnym powództwie o ustalenie ojcostwa sąd **może
obciążyć powoda** nieuiszczonymi kosztami (ust. 4) — zwolnienie z pkt 1 nie jest
bezwarunkowe.

### B. Zwolnienie PRZEDMIOTOWE — art. 95: „nie pobiera się opłat od…"

⛔ Tu nie chodzi o to, **kto** wnosi, tylko **co** wnosi. Działa niezależnie od
statusu strony.

**Ust. 1 — wnioski:** o udzielenie zabezpieczenia zgłoszone w piśmie
rozpoczynającym postępowanie; o uznanie dziecka, nadanie nazwiska,
przysposobienie, odebranie osoby podlegającej władzy rodzicielskiej,
umieszczenie w rodzinie zastępczej; testamentowe (przesłuchanie świadka
testamentu ustnego, otwarcie i ogłoszenie testamentu, zwolnienie wykonawcy);
wszczynające postępowanie z urzędu i pisma do sądu opiekuńczego składane
w wykonaniu obowiązku; o odtworzenie zaginionych akt; wpisowe (wymienione
kategorie w księdze wieczystej i KRS); o zatwierdzenie ugody zawartej przed
mediatorem na podstawie umowy o mediację; komornika o wykreślenie wpisu
o wszczęciu egzekucji.

**Ust. 1a–1d:** pozew o odszkodowanie za straty ze stanu nadzwyczajnego; pozew
kombatanta (lub zstępnego) o ochronę dóbr osobistych w sprawach tradycji
patriotycznych; **pozew o roszczenie majątkowe z tytułu zbrodni ludobójstwa,
przeciwko ludzkości, wojennej lub agresji**; pozew o ochronę dobrego imienia RP
lub Narodu Polskiego.

**Ust. 2 — środki zaskarżenia dotyczące samych kosztów:** zażalenie na odmowę
lub cofnięcie zwolnienia od kosztów oraz na odmowę/odwołanie ustanowienia
pełnomocnika; zażalenie na postanowienie o **wysokości opłaty albo wydatków**;
skarga na orzeczenie referendarza w przedmiocie zwolnienia od kosztów i odmowy
ustanowienia pełnomocnika.

⛔ **To domyka pętlę:** zaskarżenie decyzji o kosztach samo nie kosztuje.
Odpowiedź „zażalenie na odmowę zwolnienia też wymaga opłaty" jest błędna.

**Ust. 3 i 3a:** wniosek, zażalenie i apelacja **nieletniego** w sprawach
nieletnich; wniosek z art. 560³a § 1 KPC oraz **zażalenie na policyjny nakaz
opuszczenia mieszkania i zakazy zbliżania się** w sprawach przemocy domowej.

**Ust. 4:** skarga na orzeczenie referendarza i zażalenie w **elektronicznym
postępowaniu upominawczym**.

**Ust. 5:** wniosek o **doręczenie orzeczenia z uzasadnieniem**, jeżeli strona
nie ma obowiązku uiszczenia opłaty od środka zaskarżenia.

### C. Skarb Państwa — art. 94

Skarb Państwa **nie ma obowiązku uiszczania opłat**. ⚠️ Przepis mówi o opłatach,
nie o całości kosztów — nie rozszerzać bez odczytu.

### D. Zwolnienie NA WNIOSEK — art. 100–103

| Podstawa | Treść |
|---|---|
| art. 100 ust. 1 | strona zwolniona z mocy ustawy **w całości** nie uiszcza opłat i nie ponosi wydatków obciążających tymczasowo Skarb Państwa |
| art. 100 ust. 2 | sąd **może** zwolnić stronę w całości |
| art. 101 | sąd może zwolnić **w części**: ułamek, procent, określona kwota, niektóre opłaty lub wydatki, część roszczenia albo niektóre z roszczeń dochodzonych łącznie |
| art. 102 ust. 1 | **osoba fizyczna** — oświadczenie, że nie jest w stanie ponieść kosztów bez uszczerbku utrzymania koniecznego dla siebie i rodziny |
| art. 102 ust. 2 | obowiązkowe **oświadczenie na urzędowym wzorze** o stanie rodzinnym, majątku, dochodach i źródłach utrzymania; brak → art. 130 KPC |
| art. 102 ust. 4 | ⛔ wniosek strony reprezentowanej przez adwokata lub radcę **bez oświadczenia** przewodniczący **zwraca BEZ WEZWANIA** do uzupełnienia |
| art. 102 ust. 5 | wniosek rozpoznaje się w terminie **7 dni** |
| art. 103 | **osoba prawna / jednostka organizacyjna** — musi wykazać brak dostatecznych środków; spółka handlowa dodatkowo, że wspólnicy albo akcjonariusze nie mają środków na zwiększenie majątku spółki |

⛔ **Art. 102 ust. 4 jest pułapką proceduralną.** Dla strony z pełnomocnikiem
brak oświadczenia nie powoduje wezwania do uzupełnienia — wniosek wraca.
Dla strony działającej samodzielnie stosuje się art. 130 KPC (wezwanie).

⚠️ **Zwolnienie od kosztów sądowych ≠ zwolnienie od kosztów przeciwnika.**
Strona zwolniona, która przegra, może zostać obciążona kosztami zastępstwa
procesowego strony przeciwnej. To odrębna podstawa i odrębne ryzyko.

⚠️ Art. 109 i 111 KSCU (cofnięcie zwolnienia, odpowiedzialność za nieprawdziwe
oświadczenie) **nie zostały tu przepisane** — odczytać przy sprawie, w której
zwolnienie ma być wnioskowane.

---

## 2c. ZWROT OPŁATY — art. 79 KSCU

✅ [VER] RZĄD 1 2026-09-12b — odczyt treści `Dz.U. 2025 poz. 1228`.

⛔ **Zwolnienie i zwrot to dwie różne instytucje.** Zwolnienie odpowiada na
pytanie „czy zapłacić"; zwrot — „czy odzyskać to, co już zapłacono". Sąd zwraca
opłatę **z urzędu**, ale wyłącznie w wypadkach wymienionych w ustawie. Pominięcie
tej sekcji przy doradzaniu o kosztach zawyża prognozę, bo część opłaty wraca.

### A. Cała opłata — art. 79 ust. 1 pkt 1

| Wypadek | Litera |
|---|---|
| pismo **zwrócone** wskutek braków formalnych | a |
| pismo **odrzucone lub cofnięte** przed wysłaniem odpisu innym stronom (a gdy ich brak — przed zawiadomieniem o terminie posiedzenia) | b |
| zażalenie na ukaranie grzywną / aresztem / przymusowe sprowadzenie — **uwzględnione w całości** | c |
| zażalenie na wynagrodzenie biegłego lub tłumacza — uwzględnione w całości | d |
| apelacja, zażalenie, skarga kasacyjna uwzględnione z powodu **oczywistego naruszenia prawa** stwierdzonego przez sąd odwoławczy lub SN | e |
| skarga na orzeczenie referendarza — uwzględniona w sprawie wszczętej z urzędu, a w pozostałych tylko przy oczywistym naruszeniu prawa | f |
| skarga o stwierdzenie niezgodności z prawem prawomocnego orzeczenia — **uwzględniona** | g |
| pismo wszczynające I instancję oraz **zarzuty od nakazu**, jeżeli postępowanie zakończyło się **ugodą przed rozpoczęciem rozprawy** | h |

### B. Trzy czwarte — art. 79 ust. 1 pkt 2

ugoda **przed mediatorem po rozpoczęciu rozprawy** (lit. a); umorzenie na zgodny
wniosek stron w I instancji w następstwie **zapisu na sąd polubowny** (lit. aa);
**apelacja**, jeżeli w II instancji zawarto ugodę przed mediatorem (lit. ab);
skarga kasacyjna lub skarga o stwierdzenie niezgodności z prawem **nieprzyjęta do
rozpoznania** przez SN (lit. b); wniosek o **zawezwanie do próby ugodowej**,
jeżeli zawarto ugodę, chyba że sąd uznał ją za niedopuszczalną (lit. e).

### C. Połowa — art. 79 ust. 1 pkt 3

| Wypadek | Litera |
|---|---|
| pismo **cofnięte przed rozpoczęciem posiedzenia**, na które sprawę skierowano | a |
| ⛔ **pozew o rozwód lub separację — gdy orzeczono rozwód/separację NA ZGODNY WNIOSEK STRON BEZ ORZEKANIA O WINIE**, po uprawomocnieniu wyroku, z zastrzeżeniem art. 26 ust. 2 | b |
| pismo wszczynające I instancję oraz zarzuty od nakazu — **ugoda sądowa po rozpoczęciu rozprawy** | c |
| pismo wszczynające II instancję — sprawa zakończona **ugodą sądową** | d |

### D. Rozwód i separacja — dwa dodatkowe tytuły zwrotu (art. 79 ust. 2)

Poza wypadkami z ust. 1 sąd zwraca **całą** opłatę od pozwu o rozwód lub
separację albo wniosku o separację, jeżeli pozew/wniosek **cofnięto na skutek
pojednania się stron w pierwszej instancji**. W razie pojednania przed
zakończeniem postępowania apelacyjnego zwraca się **połowę** opłaty od apelacji.

⛔ **Praktyczny wniosek dla spraw rozwodowych:** opłata 600 zł (art. 26 ust. 1
pkt 1) **nie jest kosztem bezwarunkowym**. Rozwód bez orzekania o winie na zgodny
wniosek → zwrot **połowy** (art. 79 ust. 1 pkt 3 lit. b). Pojednanie i cofnięcie
pozwu w I instancji → zwrot **całości** (art. 79 ust. 2). Przedstawianie klientowi
600 zł jako kosztu utraconego jest błędem prognozy, nie cytowania.

⚠️ **Art. 79 ust. 3 — potrącenie.** Zwrot na podstawie ust. 1 pkt 1 lit. a, b i h,
całego pkt 2 oraz pkt 3 lit. a, c i d **obniża się o kwotę równą opłacie
minimalnej**. Lit. b z pkt 3 (rozwód bez orzekania o winie) **nie jest w tym
katalogu** — tam zwraca się pełną połowę.

⚠️ **Art. 79 ust. 4:** opłata z art. 25b (uzasadnienie) zaliczona na poczet opłaty
od środka zaskarżenia **nie podlega zwrotowi**, chyba że środek uwzględniono
z powodu oczywistego naruszenia prawa stwierdzonego przez sąd.

---

## 2d. DALSZE ZWOLNIENIA I ICH WYŁĄCZENIA — art. 104–107, 109, 111 KSCU

✅ [VER] RZĄD 1 2026-09-12b — odczyt treści.

### A. Organizacje — art. 104

| Podmiot | Zakres |
|---|---|
| **organizacje pożytku publicznego** (ustawa o działalności pożytku publicznego i o wolontariacie) | nie mają obowiązku uiszczania **opłat**, **z wyjątkiem spraw dotyczących prowadzonej przez nie działalności gospodarczej** (ust. 1) |
| **stowarzyszenia ogrodowe** (ustawa o rodzinnych ogrodach działkowych) | jw. (ust. 1) |
| organizacje pozarządowe i podmioty z art. 3 ust. 3 ustawy o dz.p.p. | jw., **w sprawach dotyczących realizacji zleconego zadania publicznego** (ust. 1) |
| **inne** organizacje pozarządowe nieprowadzące działalności gospodarczej | sąd **może** przyznać zwolnienie w ich własnych sprawach związanych z działalnością społeczną, naukową, oświatową, kulturalną, sportową, dobroczynną, samopomocową, ochroną konsumenta, ochroną środowiska i opieką społeczną; sąd uwzględnia cele statutowe (ust. 2) |

### ⛔⛔ B. Art. 104a — miejsca, w których zwolnienia NIE DZIAŁAJĄ

> W **elektronicznym postępowaniu upominawczym** oraz do złożenia wniosku o wpis
> do KRS spółki, której umowa została zawarta **przy wykorzystaniu wzorca
> udostępnionego w systemie teleinformatycznym** (tryb S24), przepisów
> **art. 96 ust. 1 pkt 10, art. 100–103, art. 104 ust. 2 i art. 105 nie stosuje się**.

⛔ **To jest wyłączenie wyłączenia i najłatwiejsza do przeoczenia pułapka całego
rozdziału.** W EPU i w rejestracji S24 **nie ma zwolnienia od kosztów na wniosek**
— ani dla osoby fizycznej (art. 102), ani dla osoby prawnej (art. 103), ani
uznaniowego dla organizacji (art. 104 ust. 2). Odpowiedź „proszę złożyć wniosek
o zwolnienie" jest w tych dwóch trybach **wprost sprzeczna z ustawą**. Zwolnienia
podmiotowe z art. 96 ust. 1 inne niż pkt 10 działają nadal.

### C. Tryb wniosku — art. 105–107

| Podstawa | Treść |
|---|---|
| art. 105 ust. 1 | wniosek **na piśmie albo ustnie do protokołu** w sądzie, w którym sprawa ma być wytoczona lub się toczy; oświadczenie z art. 102 ust. 2 może być złożone także do protokołu |
| art. 105 ust. 2 | osoba fizyczna spoza siedziby sądu może złożyć wniosek w **sądzie rejonowym miejsca zamieszkania** — sąd przesyła go niezwłocznie właściwemu |
| art. 105a | jeżeli wniosek zgłoszony przed upływem terminu do opłacenia pisma został **prawomocnie zwrócony**, przewodniczący wzywa do opłacenia pisma na podstawie **art. 130 KPC**; **ponowny wniosek o zwolnienie od tych samych kosztów jest niedopuszczalny** |
| art. 106 ust. 1–2 | w postępowaniu **wieczystoksięgowym** zwolnienie może nastąpić **wyłącznie przed** złożeniem wniosku o wpis, a gdy wniosek ma być w akcie notarialnym — **przed zawarciem aktu** |
| art. 106 ust. 3 | wniosek o wpis w terminie **3 miesięcy** od doręczenia postanowienia o zwolnieniu, **pod rygorem upadku zwolnienia** |
| art. 107 ust. 1–2 | po oddaleniu wniosku **nie można ponownie** domagać się zwolnienia na tych samych okolicznościach; ponowny wniosek jest niedopuszczalny i pozostaje w aktach **bez dalszych czynności**, a stronę zawiadamia się **tylko raz** |

⛔ **Art. 106 jest terminem prekluzyjnym w przebraniu.** W sprawach
wieczystoksięgowych zwolnienie po złożeniu wniosku o wpis jest **niemożliwe** —
nie „trudne", tylko wykluczone przez przepis.

⚠️ Art. 109 (cofnięcie zwolnienia) i art. 111 (odpowiedzialność za nieprawdziwe
oświadczenie) **nadal nie są tu przepisane** — odczytać przy sprawie, w której
zwolnienie ma być wnioskowane albo jest kwestionowane.

---

## 2e. ⛔ ZWOLNIENIE OD KOSZTÓW ≠ BRAK RYZYKA KOSZTOWEGO

To jest osobna oś i osobne przepisy — **KPC, nie KSCU**. Strona zwolniona od
kosztów sądowych, która przegra, **może zostać obciążona kosztami procesu
przeciwnika**, w tym kosztami zastępstwa.

| Reguła | Podstawa |
|---|---|
| zasada odpowiedzialności za wynik — przegrywający zwraca koszty niezbędne do celowego dochodzenia praw | art. 98 KPC |
| **stosunkowe rozdzielenie** kosztów przy częściowym uwzględnieniu żądań; sąd może włożyć obowiązek zwrotu **całości** na jedną stronę, gdy przeciwnik uległ tylko co do nieznacznej części albo gdy określenie sumy zależało od oceny sądu lub wzajemnego obrachunku | art. 100 KPC |
| **brak zwrotu** od pozwanego, który nie dał powodu do wytoczenia sprawy i uznał żądanie przy pierwszej czynności | art. 101 KPC |
| ⛔ **zasada słuszności** — w wypadkach szczególnie uzasadnionych sąd może nie obciążyć strony przegrywającej kosztami w ogóle albo tylko w części | **art. 102 KPC** |
| zwrot kosztów wywołanych **niesumiennym lub oczywiście niewłaściwym postępowaniem** strony, niezależnie od wyniku | art. 103 KPC |
| odpowiedzialność **solidarna** współuczestników; interwenient; zasady szczególne | art. 105–107 KPC |
| zwrot kosztów w postępowaniu **nieprocesowym** — co do zasady każdy uczestnik ponosi koszty związane ze swoim udziałem | art. 520 KPC |

⛔ **Art. 102 KPC jest najczęściej pomijanym narzędziem obrony kosztowej strony
przegrywającej** i nie ma nic wspólnego z art. 102 KSCU (zwolnienie od kosztów na
wniosek). Zbieżność numeracji dwóch różnych ustaw jest źródłem realnych pomyłek —
przy cytowaniu **zawsze dopisuj akt**.

⚠️ Zakres i brzmienie art. 98–110 i art. 520 KPC weryfikuj przy sprawie w treści
`Dz.U. 2026 poz. 468`; ta tabela wskazuje instytucje i miejsca, nie zastępuje
odczytu.

---

## 3. KOSZTY ZASTĘPSTWA — taksy

| Zawód | Akt | Weryfikacja |
|---|---|---|
| adwokaci | `Dz.U. 2026 poz. 215 t.j.` | ✅ [VER] RZĄD 1 2026-09-10t — obwieszczenie MS z 12.02.2026, najnowszy t.j., **zero nowelizacji po nim** |
| radcowie prawni | `Dz.U. 2026 poz. 118 t.j.` | ✅ [VER] RZĄD 1 2026-09-10t — obwieszczenie MS z 23.01.2026, najnowszy t.j., **zero nowelizacji po nim** |

### Stawki od wartości przedmiotu sprawy (§ 2 obu rozporządzeń)

✅ [VER] RZĄD 1 2026-09-10v — odczyt treści obu aktów. **Tabele są identyczne
w taksie adwokackiej i radcowskiej.**

| Wartość przedmiotu sprawy | Stawka minimalna |
|---|---|
| do 500 zł | 90 zł |
| powyżej 500 do 1 500 zł | 270 zł |
| powyżej 1 500 do 5 000 zł | 900 zł |
| powyżej 5 000 do 10 000 zł | 1 800 zł |
| powyżej 10 000 do 50 000 zł | 3 600 zł |
| powyżej 50 000 do 200 000 zł | 5 400 zł |
| powyżej 200 000 do 2 000 000 zł | 10 800 zł |
| powyżej 2 000 000 do 5 000 000 zł | 15 000 zł |
| powyżej 5 000 000 zł | 25 000 zł |

⚠️ **§ 3: postępowanie upominawcze, elektroniczne upominawcze, nakazowe
i europejskie nakazowe mają WŁASNĄ, niższą tabelę** (do 500 zł – 60 zł;
500–1500 zł – 180 zł; 1500–5000 zł – 600 zł itd.). Nie stosować tabeli z § 2
w tych trybach.

### ⛔ Sprawy rodzinne — stawka NIE zależy od WPS

✅ [VER] RZĄD 1 2026-09-10v — odczyt treści, obie taksy identyczne:

| Sprawa | Stawka minimalna |
|---|---|
| **alimenty**, nakazanie wypłacenia wynagrodzenia do rąk drugiego małżonka | **240 zł** |
| rozwód i unieważnienie małżeństwa | 720 zł |
| ustanowienie rozdzielności majątkowej między małżonkami | 720 zł |
| ustalenie ojcostwa, zaprzeczenie ojcostwa, ustalenie bezskuteczności uznania ojcostwa, rozwiązanie przysposobienia | 480 zł |
| rozstrzygnięcie w istotnych sprawach rodziny lub co do zarządu majątkiem wspólnym | 480 zł |
| podział majątku wspólnego | stawka z § 2 **od wartości udziału**; przy zgodnym wniosku małżonków — **50% tej stawki** |

⛔ **To jest przepis szczególny wobec § 2 i najczęstszy błąd w tej materii.**
W sprawie o alimenty stawka minimalna wynosi **240 zł niezależnie od WPS** —
policzenie jej z tabeli WPS (np. 900 zł przy rocznej sumie świadczeń 4 800 zł)
zawyża koszty zastępstwa **blisko czterokrotnie**.

⚠️ Stawka w sprawie o rozwód obejmuje również roszczenia majątkowe dochodzone
łącznie — **z wyjątkiem** roszczeń z art. 58 § 2 i 3 KRO, od których pobiera się
odrębnie. ⛔ Przy sprawie rozwodowej z podziałem majątku odczytać ten ustęp
w całości.

⚠️ Powyższe to **stawki minimalne**, nie stawki należne. Sąd może je podwyższyć
w granicach wyznaczonych przez rozporządzenie; wynagrodzenie umowne
pełnomocnika jest odrębną kwestią i nie wiąże sądu przy zasądzaniu kosztów.

⚠️ Przypis 3) przy pozycji alimentacyjnej wskazuje brzmienie ustalone
rozporządzeniem MS z 23.12.2024 — **obowiązujące**, bez wariantu przyszłego.
⛔ Sprawdzono celowo: to ta sama konstrukcja redakcyjna, która przy art. 13
ust. 2 KSCU kryła brzmienie wygasłe obok obowiązującego.

---

## 3a. KOSZTY ZASTĘPSTWA — PRACA, UBEZPIECZENIA, SPRAWY KARNE

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści obu taks (`Dz.U. 2026 poz. 215`
adwokacka, `Dz.U. 2026 poz. 118` radcowska). **Brzmienie § 9, § 10, § 11 i § 17
jest w obu aktach identyczne** — sprawdzone porównaniem tekstów, nie założone.

### Prawo pracy i ubezpieczenia społeczne — § 9

| Sprawa | Stawka minimalna |
|---|---|
| nawiązanie umowy o pracę, uznanie wypowiedzenia za bezskuteczne, **przywrócenie do pracy**, ustalenie sposobu ustania stosunku pracy | **360 zł** (§ 9 ust. 1 pkt 1) |
| **wynagrodzenie za pracę** lub odszkodowanie inne niż z pkt 4 | **75 %** stawki z § 2 od wartości wynagrodzenia/odszkodowania (§ 9 ust. 1 pkt 2) |
| inne roszczenia niemajątkowe | 240 zł (§ 9 ust. 1 pkt 3) |
| ustalenie wypadku przy pracy, jeżeli nie łączy się z odszkodowaniem ani rentą | 480 zł (§ 9 ust. 1 pkt 4) |
| świadczenie odszkodowawcze z wypadku przy pracy lub choroby zawodowej | **50 %** stawki z § 2 od wartości odszkodowania (§ 9 ust. 1 pkt 5) |
| świadczenia pieniężne z ubezpieczenia społecznego i zaopatrzenia emerytalnego; podleganie ubezpieczeniom społecznym | **360 zł** (§ 9 ust. 2) |

⛔ **Nie ma jednej „stawki pracowniczej".** Powtarzana kwota **180 zł jest
nieaktualna** — § 9 ust. 1 pkt 1 przewiduje **360 zł**. Sprawy o zapłatę
wynagrodzenia idą procentem od wartości (75 % stawki z § 2), więc przy roszczeniu
30 000 zł stawka to 75 % z 3600 zł = 2700 zł, a nie kwota ryczałtowa.

### Instancje — § 10 (procent, nie kwota)

| Etap | Stawka |
|---|---|
| apelacja przed **sądem okręgowym** | 50 % stawki minimalnej; **75 %** jeżeli w I instancji sprawy nie prowadził ten sam pełnomocnik; w obu wypadkach **nie mniej niż 120 zł** (§ 10 ust. 1 pkt 1) |
| apelacja przed **sądem apelacyjnym** | 75 % / **100 %**, nie mniej niż **240 zł** (§ 10 ust. 1 pkt 2) |
| zażalenie przed SR lub SO | 25 % / 50 %, nie mniej niż 120 zł (§ 10 ust. 2 pkt 1) |
| zażalenie przed SA lub SN | 50 % / 75 %, nie mniej niż 240 zł (§ 10 ust. 2 pkt 2) |
| sprawy z zakresu prawa pracy przed **sądem apelacyjnym** | stosuje się **§ 9**, nie § 10 ust. 1 (§ 10 ust. 3) |
| skarga kasacyjna + udział w rozprawie przed SN | 75 % / 100 %, nie mniej niż 240 zł (§ 10 ust. 4 pkt 1) |

⛔ **„Apelacja 50 %" to połowa reguły.** Drugi wariant — 75 % przy zmianie
pełnomocnika — jest równie obowiązujący, a podłogi kwotowe (120 zł / 240 zł)
decydują w sprawach drobnych.

### Sprawy karne — § 11

| Etap / czynność | Stawka minimalna |
|---|---|
| sprawa objęta **dochodzeniem** | 540 zł (§ 11 ust. 1 pkt 1) |
| sprawa objęta **śledztwem** | 900 zł (§ 11 ust. 1 pkt 2) |
| czynności wyjaśniające w sprawach o wykroczenia | 270 zł (§ 11 ust. 1 pkt 3) |
| obrona przed SR w postępowaniu **szczególnym** | 720 zł (§ 11 ust. 2 pkt 1) |
| obrona przed SR w sprawach o **wykroczenia** | 540 zł (§ 11 ust. 2 pkt 2) |
| obrona przed SR w postępowaniu **zwyczajnym** / wojskowym sądem garnizonowym | **840 zł** (§ 11 ust. 2 pkt 3) |
| obrona przed **SO jako II instancją** (apelacja karna) | **840 zł** (§ 11 ust. 2 pkt 4) |
| obrona przed **SO jako I instancją** oraz przed **sądem apelacyjnym** | **1200 zł** (§ 11 ust. 2 pkt 5) |
| obrona przed **Sądem Najwyższym** | 1200 zł (§ 11 ust. 2 pkt 6) |
| kasacja — orzeczenie I instancji wydał SR | 720 zł (§ 11 ust. 3 pkt 1) |
| kasacja — orzeczenie I instancji wydał SO | 1200 zł (§ 11 ust. 3 pkt 2) |
| wznowienie postępowania / podjęcie postępowania warunkowo umorzonego | 720 zł (§ 11 ust. 4 pkt 1) |
| opinia o braku podstaw do wznowienia albo do kasacji | 720 zł (§ 11 ust. 4 pkt 2) |
| sporządzenie środka odwoławczego bez występowania przed sądem | 720 zł (§ 11 ust. 4 pkt 3) |
| obrona w sprawie o **wyrok łączny** | 240 zł (§ 11 ust. 5) |

⛔ **Apelacja karna to 840 zł przed sądem okręgowym i 1200 zł przed sądem
apelacyjnym** — nie „połowa stawki z I instancji". § 10 ust. 1 (procenty
instancyjne) **nie ma zastosowania** do spraw z § 11; te mają własne kwoty.
Krążąca w systemie liczba **420 zł nie ma podstawy w obowiązującym
rozporządzeniu**.

⚠️ **§ 17 — dwa mnożniki, o których się zapomina:** przy rozprawie trwającej
dłużej niż jeden dzień stawka rośnie o **20 % za każdy następny dzień**
(§ 17 pkt 1); przy obronie kilku osób w tym samym postępowaniu opłatę pobiera się
**od każdej z nich** (§ 17 pkt 2). Dotyczy spraw z § 11–13.

---

## 4. WARTOŚCI POWTARZALNE — gdzie ustanowione

| Wartość | Akt ustanawiający | Stan |
|---|---|---|
| minimalne wynagrodzenie | rozporządzenie RM, wydawane co roku we wrześniu | 2026: **4806 zł** — `Dz.U. 2025 poz. 1242` §1 ✅ [VER] RZĄD 1 (odczyt treści) |
| minimalna stawka godzinowa | jw. | 2026: **31,40 zł** — `Dz.U. 2025 poz. 1242` §2 |
| ustawa o minimalnym wynagrodzeniu (akt bazowy) | `Dz.U. 2024 poz. 1773` | potwierdzony **w podstawie prawnej rozporządzenia** |

⛔ **Cezura roczna.** Minimalne wynagrodzenie zmienia się 1 stycznia (czasem
dwukrotnie w roku). Przy sprawie ze zdarzenia z wcześniejszego roku sięgnąć po
rozporządzenie z **tamtego** okresu, nie po bieżące.

---

## 5. SPRAWY KARNE — inny akt, inna logika

**Akt ustanawiający:** ustawa z 23.06.1973 r. o opłatach w sprawach karnych.
**Tekst jednolity:** `Dz.U. 2023 poz. 123` ✅ [VER] RZĄD 1 2026-09-12 — ELI
`api.sejm.gov.pl/eli/acts/DU/2023/123`, status `obowiązujący`. Wykaz aktów
zmieniających akt bazowy (`DU/1973/152/references`) odczytany 2026-09-12:
**zero nowelizacji ogłoszonych po tekście jednolitym**.

⛔ **KSCU nie ma tu zastosowania.** Opłata karna nie jest liczona od WPS, tylko
od **rodzaju i wymiaru orzeczonej kary**, i co do zasady powstaje **dopiero
w orzeczeniu kończącym** (art. 16). Pytanie „ile kosztuje wniesienie sprawy
karnej" jest źle postawione — oskarżony nie wnosi opłaty na wejściu.

### ⛔⛔ Ta sama pułapka redakcyjna co art. 13 ust. 2 KSCU

Tekst jednolity zawiera **dwa brzmienia art. 2 ust. 1 pkt 6 obok siebie**,
rozróżnione wyłącznie odnośnikami:

| Odnośnik | Brzmienie | Status |
|---|---|---|
| 2) | „do 15 lat **albo 25 lat** – 600 zł" | „obowiązuje **do wejścia w życie** zmiany z odnośnika 3" |
| 3) | „do 15 lat – 600 zł" (+ nowy pkt 7: powyżej 15 lat – 1000 zł) | ustalone ustawą z 7.07.2022 (`Dz.U. 2022 poz. 2600`), **w życie 14.03.2023** |

⛔ **Obowiązuje wariant z odnośnika 3.** Odczyt bez przypisów da brzmienie
wygasłe, w którym nie ma progu „powyżej 15 lat".

### Opłaty w I instancji

| Rozstrzygnięcie | Opłata | Podstawa |
|---|---|---|
| pozbawienie wolności do 3 miesięcy | 60 zł | art. 2 ust. 1 pkt 1 |
| do 6 miesięcy | 120 zł | art. 2 ust. 1 pkt 2 |
| do 1 roku | 180 zł | art. 2 ust. 1 pkt 3 |
| do 2 lat | 300 zł | art. 2 ust. 1 pkt 4 |
| do 5 lat | 400 zł | art. 2 ust. 1 pkt 5 |
| do 15 lat | 600 zł | art. 2 ust. 1 pkt 6 (brzmienie od 14.03.2023) |
| powyżej 15 lat | 1000 zł | art. 2 ust. 1 pkt 7 |
| **kara ograniczenia wolności** | odpowiednio progi pkt 1–4 | art. 2 ust. 2 |
| **grzywna** jako kara samoistna | **10 %** wymierzonej grzywny, nie mniej niż 30 zł | art. 3 ust. 1 |
| grzywna **obok** kary pozbawienia wolności | **20 %** wymierzonej grzywny | art. 3 ust. 1 |
| grzywna z art. 71 § 1 KK | 10 %, nie mniej niż 30 zł | art. 3 ust. 2 |
| **warunkowe umorzenie** postępowania | **60–100 zł** | art. 7 |
| skazanie na karę aresztu albo ograniczenia wolności **za wykroczenie** | **30 zł** | art. 21 pkt 2 lit. a |

### Postępowanie odwoławcze i wnioski

| Sytuacja | Opłata | Podstawa |
|---|---|---|
| nieuwzględniona apelacja oskarżonego co do winy lub kary zasadniczej | jak w I instancji, wg zaskarżonej kary | art. 8 |
| apelacja wniesiona **wyłącznie przez oskarżyciela publicznego**; nieuwzględniona **kasacja** | **bez opłaty** | art. 9 |
| sąd odwoławczy zmienia karę albo skazuje dopiero w II instancji | **jedna** opłata za obie instancje, wg kary orzeczonej przez ten sąd | art. 10 |
| nieuwzględniona apelacja oskarżonego **nie** dotycząca winy ani kary zasadniczej | **30 zł** | art. 11 |
| oskarżyciel posiłkowy / prywatny — uniewinnienie albo nieuwzględnienie jego środka | **60–240 zł** | art. 13 |
| instytucje państwowe i społeczne jako oskarżyciel posiłkowy lub prywatny | **bez opłat** | art. 14 |
| odroczenie wykonania kary pozbawienia albo ograniczenia wolności | 80 zł | art. 15 ust. 1 pkt 1 |
| przerwa w odbywaniu kary pozbawienia wolności albo aresztu | 60 zł | art. 15 ust. 1 pkt 2 |
| warunkowe przedterminowe zwolnienie | 45 zł | art. 15 ust. 1 pkt 3 |
| zwolnienie z reszty kary ograniczenia wolności albo środka karnego | 45 zł | art. 15 ust. 1 pkt 4 |
| **ponowny** wniosek o rozłożenie grzywny na raty | 2 % kwoty objętej wnioskiem, nie mniej niż 25 zł | art. 15 ust. 1 pkt 5 |
| warunkowe zawieszenie wykonania odroczonej kary pozbawienia wolności | 100 zł | art. 15 ust. 1 pkt 6 |
| warunkowe zwolnienie w trybie art. 155 § 1 KKW | 100 zł | art. 15 ust. 1 pkt 7 |
| **zatarcie skazania** | 45 zł | art. 15 ust. 1 pkt 8 |
| **ponowna** prośba o ułaskawienie | 45 zł | art. 15 ust. 1 pkt 9 |
| **wznowienie postępowania** | 150 zł | art. 15 ust. 1 pkt 10 |
| opłata **kancelaryjna** za zaświadczenie lub inny dokument z akt | **6 zł za każdą stronę** | art. 19 ust. 1 |

⚠️ Opłaty z art. 15 uiszcza się **wraz z wnioskiem**, z dowodem wpłaty (art. 15
ust. 2); w razie wznowienia postępowania opłata podlega **zwrotowi**. Organ
postępowania wykonawczego i dowódca jednostki wojskowej są zwolnieni (ust. 3).

⚠️ Zwolnienie od opłat karnych: art. 17 odsyła **odpowiednio** do przepisów
o zwolnieniu od kosztów postępowania karnego (KPK), **nie** do art. 96–103 KSCU.
Na orzeczenie w przedmiocie opłat służy zażalenie, jeżeli nie wniesiono apelacji
(art. 18). Przedawnienie ściągnięcia i zwrotu — **3 lata** (art. 20).

⚠️ Ustawę stosuje się także w sprawach o **przestępstwo i wykroczenie skarbowe**
oraz o **wykroczenia**, z odrębnościami art. 21.

⛔ **Opłata ≠ koszty procesu.** Wydatki, zryczałtowane równowartości i zwrot
kosztów w sprawach karnych reguluje **KPK (art. 616 i n.)** oraz rozporządzenia
wykonawcze — to inny akt i inna tabela. Moduł kanoniczny opisujący całą ustawę
art. 1–23: `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-ustawa-oplaty-w-sprawach-karnych.md`.

---

## 6. POSTĘPOWANIE SĄDOWOADMINISTRACYJNE — wpis, nie opłata

**Akt ustanawiający:** rozporządzenie Rady Ministrów z 16.12.2003 r. w sprawie
wysokości oraz szczegółowych zasad pobierania wpisu w postępowaniu przed sądami
administracyjnymi, t.j. `Dz.U. 2021 poz. 535` ✅ [VER] RZĄD 1 2026-09-12 —
odczyt treści; status ELI `obowiązujący`. Podstawa ustawowa: art. 233 PPSA.

### Wpis stosunkowy — § 1 (procent, nie kwota ryczałtowa)

| Wartość przedmiotu zaskarżenia | Wpis |
|---|---|
| do 10 000 zł | **4 %** WPZ, nie mniej niż **100 zł** |
| ponad 10 000 do 50 000 zł | **3 %** WPZ, nie mniej niż **400 zł** |
| ponad 50 000 do 100 000 zł | **2 %** WPZ, nie mniej niż **1500 zł** |
| ponad 100 000 zł | **1 %** WPZ, nie mniej niż **2000 zł** i **nie więcej niż 100 000 zł** |

### Wpis stały — § 2 ust. 1 (najczęstsze pozycje)

| Skarga | Wpis |
|---|---|
| na postanowienia w postępowaniu administracyjnym, egzekucyjnym i zabezpieczającym | 100 zł |
| na akty lub czynności z zakresu administracji publicznej dotyczące uprawnień lub obowiązków | 200 zł |
| na **akty prawa miejscowego** JST i terenowych organów administracji rządowej | 300 zł |
| na inne akty organów JST i ich związków w sprawach z zakresu administracji publicznej | 300 zł |
| na **akty nadzoru** nad działalnością organów JST | 300 zł |
| na **bezczynność** organów administracji publicznej | 100 zł |
| **sprzeciw od decyzji** | 100 zł |
| zażalenie na postanowienie WSA | 100 zł |

⛔ **Tabela „200 / 500 / 1000 / 2000 zł według WPS" nie ma podstawy w tym
rozporządzeniu.** Wpis stosunkowy jest **procentem z podłogą**, a wpis stały
zależy od **rodzaju zaskarżonego aktu**, nie od wartości. Kwoty ryczałtowe
z tamtej tabeli zostały w tej sesji sprawdzone w treści aktu i nie odpowiadają
żadnej jednostce redakcyjnej.

⚠️ § 2 ust. 2 przewiduje wpisy stałe **8000–10 000 zł** dla skarg dotyczących
koncesji i zezwoleń w sektorach regulowanych (energetyka, banki, transport,
media, gry losowe). Przy takiej sprawie odczytać ustęp w całości.

---

## 7. REJESTR TABEL SATELICKICH — gdzie jeszcze w systemie stoją kwoty

⛔ **Ten rejestr istnieje po to, żeby druga tabela nie stała się drugim źródłem
prawdy.** Każdy plik niżej zawiera własne kwoty opłat. Wiążąca jest tabela
ustanawiająca (ten plik → przepis), nie plik satelicki.

| Plik | Rola | Status 2026-09-12 |
|---|---|---|
| `dr-12-.../modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna.md` | opis ustawy i kwalifikator, **bez utrwalonych kwot** | ✅ zgodny — deleguje tutaj |
| `dr-03-.../modules/mod-ustawa-oplaty-w-sprawach-karnych.md` | kanoniczny opis ustawy karnej art. 1–23 | ✅ zgodny — sekcja 5 tutaj jest wyciągiem |
| `analizator-dowodow-v3/modules/MP10-koszty.md` | **baza katalogująca** — rodzaj opłaty i „za co" | ⚠️ warstwa 2 reguły kolejności; nie jest źródłem kwoty |
| `pisma-proste-v2/references/M6-oplaty.md` | tabela robocza dla pism prostych | 🔧 naprawiona 2026-09-12 |
| `pisma-proste-v2/SKILL.md` (tabela opłat) | duplikat M6 w korpusie skilla | 🔧 naprawiona 2026-09-12 |
| `pisma-procesowe-v3/modules/MOD-OPLATY.md` | tabela robocza dla pism procesowych | 🔧 naprawiona 2026-09-12 |
| `analiza-sadowa-v6/references/koszty-terminy.md` | tabele kosztów i terminów do bilansu sprawy | 🔧 naprawiona 2026-09-12 |

⚠️ **Wzorzec błędu wykryty w trzech z nich naraz:** progi WPS opisane jako
**„art. 27 pkt 1–6 KSCU"**. Art. 27 ustanawia opłatę stałą 200 zł od
enumerowanych pozwów (sekcja 1b) i **nie zna progów wartościowych**. Odesłanie
wyglądało poprawnie formalnie, więc przeszło przez kontrole składniowe —
wykrywa je dopiero odczyt treści przepisu.

---

## 8. Czego ten plik NIE zastępuje

⛔ Nie zastępuje odczytu przepisu przy konkretnej sprawie. Tabele wyżej są
**punktem wyjścia i dowodem, że wartość ma źródło** — nie substytutem HARD GATE.

⛔ Nadal nie obejmuje: opłat **skarbowych** (ustawa o opłacie skarbowej),
**notarialnych** (rozporządzenie MS o maksymalnych stawkach taksy notarialnej),
**komorniczych** (ustawa o kosztach komorniczych), **wieczystoksięgowych
i rejestrowych w zakresie wykraczającym poza art. 95 KSCU**, opłat w KIO
(art. 34 KSCU i przepisy PZP) oraz **kosztów procesu karnego z art. 616 i n.
KPK** wraz z rozporządzeniami o wydatkach i zryczałtowanych równowartościach.
Każda z nich ma własny akt ustanawiający — ta sama reguła kolejności, inne
źródło.

⚠️ Katalog rodzajów opłat i przyporządkowanie „za co" prowadzi
`analizator-dowodow-v3/modules/MP10-koszty.md`. To jest **warstwa druga**
z reguły kolejności: rozpoznaje rodzaj, nie ustala kwoty.

⚠️ Katalog rodzajów opłat i przyporządkowanie „za co" prowadzi
`analizator-dowodow-v3/modules/MP10-koszty.md`. To jest **warstwa druga**
z reguły kolejności: rozpoznaje rodzaj, nie ustala kwoty.

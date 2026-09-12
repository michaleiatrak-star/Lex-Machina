# TABELE-OPLAT — hierarchia źródeł przy obliczaniu opłat, kosztów i alimentów

> **Plik:** `shared/TABELE-OPLAT.md`
> **Wersja:** 1.3 (2026-09-10w) — pełny katalog zwolnień (art. 94–103 KSCU);
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

## 5. Czego ten plik NIE zastępuje

⛔ Nie zastępuje odczytu przepisu przy konkretnej sprawie. Tabele wyżej są
**punktem wyjścia i dowodem, że wartość ma źródło** — nie substytutem HARD GATE.

⛔ Nie obejmuje opłat poza KSCU: administracyjnych, skarbowych, notarialnych,
komorniczych, karnych (art. 616–645 KPK). Każda z nich ma własny akt
ustanawiający i własną tabelę — ta sama reguła kolejności, inne źródło.

⚠️ Katalog rodzajów opłat i przyporządkowanie „za co" prowadzi
`analizator-dowodow-v3/modules/MP10-koszty.md`. To jest **warstwa druga**
z reguły kolejności: rozpoznaje rodzaj, nie ustala kwoty.

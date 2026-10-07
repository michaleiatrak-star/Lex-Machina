# MOD-OPLATY — Opłaty Sądowe i Terminy Zawite

*Ładuj gdy: pismo wszczynające postępowanie, opłata sądowa wymagana,
lub termin zawity musi być obliczony*

---

## OP-0 — KROK 0: czy strona w ogóle płaci

```text
view shared/TABELE-OPLAT.md
```

⛔ **Pytanie o zwolnienie poprzedza pytanie o kwotę.** Trzy niezależne warstwy:
podmiotowa z mocy ustawy (art. 96 ust. 1 KSCU — 18 kategorii), przedmiotowa
(art. 95 — „nie pobiera się opłat od…", niezależnie od tego, kto wnosi),
na wniosek (art. 100–103). Czwarte pytanie: czy opłata **wróci** (art. 79 — OP-4).

⛔⛔ **Art. 104a KSCU — w elektronicznym postępowaniu upominawczym oraz przy
rejestracji spółki w trybie S24 przepisów art. 100–103, art. 104 ust. 2
i art. 105 NIE STOSUJE SIĘ.** W tych dwóch trybach **nie ma zwolnienia od kosztów
na wniosek**. Porada „proszę wnieść o zwolnienie" jest tam sprzeczna z ustawą.

---

## OP-1 — Tabela opłat sądowych

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści KSCU `Dz.U. 2025 poz. 1228`
(`api.sejm.gov.pl/eli/acts/DU/2025/1228/text.pdf`). Ta tabela jest **warstwą
satelicką** (rejestr: `shared/TABELE-OPLAT.md` sekcja 7); w razie rozbieżności
wiąże plik kanoniczny, a nad nim treść przepisu.

### Progi WPS — art. 13 ust. 1 i 2 KSCU

⛔ **Naprawa 2026-09-12.** Poprzednia wersja tej tabeli wiązała progi
z **art. 27 pkt 1–6 KSCU**. Art. 27 ustanawia opłatę stałą **200 zł** od <!-- T28-OK: cytat opisowy — dokumentacja naprawy -->
enumerowanych pozwów (unieważnienie małżeństwa, zaprzeczenie ojcostwa,
rozdzielność majątkowa, naruszenie posiadania, uchwały spółdzielni i wspólnot)
i **nie zawiera progów wartościowych**. Dwa progi były dodatkowo przesunięte
o wiersz.

| WPS / WPZ | Opłata | Podstawa |
|---|---|---|
| do 500 zł | 30 zł | art. 13 ust. 1 pkt 1 KSCU |
| ponad 500 do 1 500 zł | 100 zł | art. 13 ust. 1 pkt 2 KSCU |
| ponad 1 500 do 4 000 zł | 200 zł | art. 13 ust. 1 pkt 3 KSCU |
| ponad 4 000 do 7 500 zł | 400 zł | art. 13 ust. 1 pkt 4 KSCU |
| ponad 7 500 do 10 000 zł | 500 zł | art. 13 ust. 1 pkt 5 KSCU |
| ponad 10 000 do 15 000 zł | **750 zł** | art. 13 ust. 1 pkt 6 KSCU |
| ponad 15 000 do 20 000 zł | **1 000 zł** | art. 13 ust. 1 pkt 7 KSCU |
| ponad 20 000 zł | 5 % WPS, max **100 000 zł** | art. 13 ust. 2 KSCU |

⛔ Cap **100 000 zł** od 23.09.2025 (`Dz.U. 2025 poz. 1157`). Tekst jednolity
niesie dwa brzmienia art. 13 ust. 2 obok siebie — odczyt bez odnośników daje
wygasłe 200 000 zł.

⛔ **Przed art. 13 sprawdź przepis szczególny:** art. 13a (czynności bankowe,
konsument — 1000 zł), 13b (planowanie przestrzenne — 1000 zł), 13c (niezgodność
KW / pozbawienie wykonalności / zwolnienie od egzekucji przy WPS ponad 40 000 zł
— 2000 zł), 13d (postępowanie grupowe — połowa, 100 zł–200 000 zł), 13f (skarga
pauliańska — 1000 zł).

⚠️ **Art. 13e — obniżka o 2/3 (max 400 zł)**, gdy powód przed wytoczeniem
powództwa wziął udział w mediacji albo wystąpił o pozasądowe rozwiązanie sporu
konsumenckiego.

### Środki zaskarżenia i pisma

| Rodzaj pisma | Opłata | Podstawa |
|---|---|---|
| apelacja, skarga kasacyjna, skarga o stwierdzenie niezgodności z prawem, interwencja główna, skarga o wznowienie, skarga o uchylenie wyroku sądu polubownego | wg tabeli od pozwu, liczonej od **wartości przedmiotu zaskarżenia** | art. 18 ust. 2 KSCU |
| sprzeciw od wyroku zaocznego | połowa opłaty | art. 19 ust. 1 KSCU |
| pozew w postępowaniu nakazowym | 1/4 opłaty | art. 19 ust. 2 pkt 1 KSCU |
| pozew w EPU | 1/4 opłaty | art. 19 ust. 2 pkt 2 KSCU |
| interwencja uboczna | 1/5 opłaty | art. 19 ust. 3 pkt 1 KSCU |
| **zażalenie** | 1/5 opłaty, o ile przepis szczególny nie stanowi inaczej | art. 19 ust. 3 pkt 2 KSCU |
| zawezwanie do próby ugodowej (prawa niemajątkowe) | 1/5, nie mniej niż 100 zł | art. 19 ust. 3 pkt 3 KSCU |
| **zarzuty od nakazu** (nakazowe) | 3/4 opłaty; **pozwany konsument — max 750 zł** | art. 19 ust. 4 KSCU |
| dolna granica opłat z art. 19 | 30 zł | art. 20 ust. 1 KSCU |
| **sprzeciw** od nakazu upominawczego / EPU | brak opłaty | art. 19 KSCU *a contrario* |
| skarga na czynności komornika | **50 zł** | art. 25 ust. 1 KSCU |
| skarga na orzeczenie referendarza | jak od wniosku o wydanie orzeczenia, max 100 zł | art. 25 ust. 2 KSCU |
| rozszerzenie powództwa / zmiana zwiększająca WPS | różnica opłat, nie mniej niż 30 zł | art. 25a KSCU |
| wniosek o uzasadnienie **wyroku / postanowienia co do istoty** | 100 zł, zaliczane na środek zaskarżenia | art. 25b ust. 1 i 3 KSCU |
| wniosek o uzasadnienie **innego postanowienia lub zarządzenia** | **30 zł** | art. 25b ust. 2 KSCU |
| wniosek o zabezpieczenie (udzielenie, zmiana, uchylenie) | 100 zł | **art. 68 pkt 1 KSCU** |
| wniosek o zabezpieczenie roszczenia **pieniężnego przed** pismem wszczynającym | 1/4 opłaty od pozwu | art. 69 ust. 1 KSCU |
| wniosek o wyjawienie majątku / wykonanie zastępcze / ukaranie grzywną dłużnika | 200 zł | art. 70 KSCU |
| wniosek o klauzulę wykonalności (tytuł pozasądowy, małżonek, następca, wspólnik) | **50 zł** | art. 71 pkt 1–6 KSCU |
| odpis / wypis / wyciąg / zaświadczenie z akt | **20 zł za każde rozpoczęte 10 stron** | art. 77 ust. 1 KSCU |
| pierwszy wniosek strony wszczynającej o odpis orzeczenia kończącego z klauzulą | bez opłaty | art. 77a KSCU |
| opłata podstawowa (brak stałej, stosunkowej, tymczasowej) | **30 zł**, minimalna opłata od pisma | art. 14 ust. 1 i 3 KSCU |
| opłata tymczasowa (WPS nieustalalny) | 30–2000 zł; grupowe 300–20 000 zł | art. 15 ust. 2 KSCU |
| doręczenie pism **przez komornika** (zlecenie sądu albo wniosek powoda) | **60 zł** za jeden adres | **art. 41 ust. 1 ustawy z 28.02.2018 o kosztach komorniczych** (`Dz.U. 2024 poz. 377`) — ⛔ nie KSCU i nie rozporządzenie MS |
| **pozew o rozwód / separację sporną** | 600 zł | art. 26 ust. 1 pkt 1 i 2 KSCU |
| separacja na zgodne żądanie / zniesienie separacji | 100 zł | art. 37 pkt 3 i 4 KSCU |
| podział majątku wspólnego (ze zgodnym projektem) | 1000 zł (300 zł) | art. 38 ust. 1 i 2 KSCU |
| pozew pracownika | brak — zwolnienie ustawowe | art. 96 ust. 1 pkt 4 KSCU |
| **apelacja** w sprawie pracowniczej przy WPS ponad 50 000 zł | wg art. 13 od **nadwyżki** ponad 50 000 zł | art. 35 ust. 1 zd. 2 KSCU |
| pracodawca — apelacja, zażalenie, skarga kasacyjna | opłata podstawowa 30 zł | art. 35 ust. 1 zd. 1 w zw. z art. 14 ust. 3 KSCU |
| apelacja karna oskarżonego | brak opłaty przy wniesieniu; opłata powstaje w orzeczeniu | art. 8–11 i art. 16 ustawy z 23.06.1973 o opłatach w sprawach karnych |
| zawiadomienie o przestępstwie | brak | — |

⛔ **Cztery pozycje naprawione 2026-09-12:** zabezpieczenie art. 69 → **art. 68
pkt 1**; „EPU 1,25 % WP, art. 19 §2b" → **1/4 opłaty, art. 19 ust. 2 pkt 2** <!-- T28-OK: cytat opisowy — dokumentacja naprawy -->
(§2b nie istnieje; wzór procentowy działa dopiero powyżej progu 20 000 zł);
zarzuty „art. 19 §3" → **art. 19 ust. 4** wraz z konsumenckim capem 750 zł;
„apelacja karna 0 zł, art. 620 KPK" → art. 620 KPK dotyczy **wykładania wydatków
przez Skarb Państwa**, nie opłaty od apelacji — opłaty karne reguluje ustawa
z 23.06.1973 i powstają one w orzeczeniu kończącym.

### OP-1a — poza KSCU: komornicze, skarbowe, notarialne, karne

✅ [VER] RZĄD 1 2026-09-12c. Pełne tabele: `shared/TABELE-OPLAT.md` sekcje 6b–6e.

| Rodzina | Akt ustanawiający | Punkty zapalne |
|---|---|---|
| **komornicze** | ustawa z 28.02.2018 o kosztach komorniczych, t.j. `Dz.U. 2024 poz. 377` | 10 % / **3 %** przy wpłacie w terminie miesiąca (art. 27); widełki 150–50 000 zł (art. 25 ust. 1); eksmisja 1500/2000 zł (art. 34); doręczenie 60 zł (art. 41 ust. 1); ⛔ art. 47 — zwolnienie **nie zwalnia** z opłaty egzekucyjnej |
| **skarbowe** | ustawa z 16.11.2006 o opłacie skarbowej, t.j. `Dz.U. 2025 poz. 1154` | pełnomocnictwo **17 zł od każdego stosunku**; ⛔ art. 2 ust. 1 wyłącza całe kategorie spraw (alimentacyjne, pracy, pomoc społeczna, ubezpieczenia) |
| **notarialne** | rozp. MS, t.j. `Dz.U. 2024 poz. 1566` | stawki **MAKSYMALNE**, nie minimalne (§ 3); § 4 — bez odliczania obciążeń |
| **karne — koszty procesu** | KPK `Dz.U. 2026 poz. 490` art. 616–632a | ⛔ zryczałtowana równowartość wydatków przy oskarżeniu prywatnym: **1000 zł od 1.07.2025** (`Dz.U. 2025 poz. 770`), nie 300 zł |
| **wieczystoksięgowe** | KSCU art. 42–48 | wpis 200 zł / udział min. 100 zł / dziedziczenie 150 zł; wykreślenie — **połowa** (art. 46); ⛔ brak opłaty podstawowej (art. 14 ust. 5) |

---

## OP-2 — Zwolnienia od kosztów sądowych

⛔ Pełny katalog z odczytu treści: `shared/TABELE-OPLAT.md` sekcje 2b i 2d.

**A. Podmiotowe z mocy ustawy — art. 96 ust. 1 KSCU** (wybór najczęstszych):
ustalenie ojcostwa/macierzyństwa (pkt 1); **roszczenia alimentacyjne** oraz
pozwany w sprawie o **obniżenie** alimentów (pkt 2); klauzule niedozwolone
(pkt 3); **pracownik** wnoszący powództwo lub wniosek oraz strona wnosząca
**odwołanie** do sądu pracy i ubezpieczeń społecznych (pkt 4); kurator sądowy
(pkt 5); prokurator, RPO, RPD, Rzecznik Praw Pacjenta, Rzecznik Finansowy,
Rzecznik MŚP (pkt 6); **inspektor pracy i związki zawodowe** (pkt 8); ochrona
zdrowia psychicznego (pkt 9); ubezwłasnowolniony (pkt 9a); **osoba doznająca
przemocy domowej** (pkt 15); pozew o **rentę** z art. 444 § 2 lub 446 § 2 KC
(pkt 16).

⚠️ Art. 96 ust. 2–4: wydatki za kuratora ponosi **tymczasowo strona**, dla której
go ustanowiono; w pozostałych wypadkach tymczasowo Skarb Państwa. Przy oczywiście
bezzasadnym powództwie o ustalenie ojcostwa sąd **może obciążyć powoda**
nieuiszczonymi kosztami — zwolnienie z pkt 1 nie jest bezwarunkowe.

**B. Przedmiotowe — art. 95 KSCU** („nie pobiera się opłat od…", niezależnie od
tego, kto wnosi): wniosek o zabezpieczenie zgłoszony **w piśmie wszczynającym**;
wnioski opiekuńcze, o przysposobienie, o odebranie osoby podlegającej władzy
rodzicielskiej; pisma wszczynające postępowanie z urzędu; **zażalenie na odmowę
lub cofnięcie zwolnienia od kosztów**; **zażalenie na postanowienie o wysokości
opłaty albo wydatków**; skarga na orzeczenie referendarza w przedmiocie
zwolnienia; pisma nieletniego; zażalenie na policyjny nakaz opuszczenia mieszkania
(ust. 3a); skarga i zażalenie w EPU (ust. 4); wniosek o doręczenie orzeczenia
z uzasadnieniem, gdy strona nie ma obowiązku opłaty od środka zaskarżenia (ust. 5).

⛔ **Zaskarżenie rozstrzygnięcia o kosztach samo nie kosztuje** (art. 95 ust. 2).

**C. Na wniosek — art. 102–103 KSCU:** osoba fizyczna — oświadczenie o niemożności
poniesienia kosztów bez uszczerbku utrzymania koniecznego (ust. 1) + **oświadczenie
na urzędowym wzorze** (ust. 2); osoba prawna — wykazanie braku dostatecznych
środków, spółka handlowa dodatkowo brak środków wspólników (art. 103).

⛔ **Art. 102 ust. 4 — wniosek strony reprezentowanej przez adwokata lub radcę
BEZ oświadczenia przewodniczący ZWRACA BEZ WEZWANIA** do uzupełnienia. Rozpoznanie
w terminie 7 dni (ust. 5).

⛔ **Art. 105a:** po prawomocnym zwrocie wniosku przewodniczący wzywa do opłacenia
pisma na podstawie art. 130 KPC, a **ponowny wniosek o zwolnienie od tych samych
kosztów jest niedopuszczalny**. **Art. 107:** po oddaleniu wniosku nie można
ponowić go na tych samych okolicznościach.

⛔ **Art. 106:** w postępowaniu **wieczystoksięgowym** zwolnienie może nastąpić
**wyłącznie przed** złożeniem wniosku o wpis (a gdy wniosek ma być w akcie
notarialnym — przed zawarciem aktu); wniosek o wpis w **3 miesiące** od doręczenia
postanowienia, pod rygorem **upadku zwolnienia**.

**D. Organizacje — art. 104:** organizacje pożytku publicznego i stowarzyszenia
ogrodowe — bez opłat, **z wyjątkiem spraw ich działalności gospodarczej**; inne
organizacje pozarządowe — zwolnienie **uznaniowe** (ust. 2).

⛔⛔ **E. Art. 104a — wyłączenie zwolnień.** W **EPU** i przy rejestracji spółki
**S24** nie stosuje się art. 96 ust. 1 pkt 10, art. 100–103, art. 104 ust. 2
i art. 105.

⚠️ **Zwolnienie od kosztów sądowych ≠ brak ryzyka kosztowego.** Strona zwolniona,
która przegra, może zostać obciążona kosztami przeciwnika (art. 98 KPC), chyba że
sąd zastosuje **art. 102 KPC** (zasada słuszności). ⛔ Art. 102 **KPC** to nie
art. 102 **KSCU** — przy cytowaniu zawsze dopisuj akt.

---

## OP-2a — Zwrot opłaty (art. 79 KSCU)

⛔ Czwarte pytanie kosztowe: czy opłata **wróci**.

| Zakres zwrotu | Najczęstsze wypadki | Podstawa |
|---|---|---|
| **cała** | pismo zwrócone wskutek braków formalnych; pismo odrzucone lub cofnięte przed wysłaniem odpisu innym stronom; środek zaskarżenia uwzględniony z powodu **oczywistego naruszenia prawa**; ugoda **przed rozpoczęciem rozprawy** w I instancji | art. 79 ust. 1 pkt 1 lit. a, b, e, h |
| **3/4** | ugoda przed mediatorem **po** rozpoczęciu rozprawy; skarga kasacyjna **nieprzyjęta do rozpoznania**; ugoda z zawezwania do próby ugodowej | art. 79 ust. 1 pkt 2 lit. a, b, e |
| **połowa** | pismo cofnięte przed rozpoczęciem posiedzenia; **rozwód lub separacja na zgodny wniosek bez orzekania o winie**; ugoda sądowa po rozpoczęciu rozprawy; ugoda w II instancji | art. 79 ust. 1 pkt 3 lit. a, b, c, d |
| **cała** (rozwód/separacja) | cofnięcie pozwu wskutek **pojednania** w I instancji; przy pojednaniu w toku apelacji — połowa opłaty od apelacji | art. 79 ust. 2 |

⚠️ Art. 79 ust. 3: zwrot z pkt 1 lit. a, b, h, całego pkt 2 oraz pkt 3 lit. a, c, d
**obniża się o opłatę minimalną**. Rozwód bez orzekania o winie (pkt 3 lit. b)
**nie jest** w tym katalogu — zwraca się pełną połowę.

---

## OP-3 — Terminy zawite (KRYTYCZNE — ZAWSZE SPRAWDZAJ)

*Termin zawity = po jego upływie czynność jest bezskuteczna z mocy prawa.*

> ⛔ **NAPRAWA 2026-09-12 — termin do wniesienia zarzutów był błędny w DWÓCH
> skillach, w dwóch różnych wartościach.** Ten moduł podawał 7 dni,
> `analiza-sadowa-v6/references/koszty-terminy.md` — 14 dni, oba z odesłaniem do
> **art. 493 § 1 KPC**. Odczyt treści KPC (`Dz.U. 2026 poz. 468`, 2026-09-12)
> wykazał, że **art. 493 § 1 nie zawiera żadnego terminu** — mówi wyłącznie
> o dopuszczalności zarzutów. Termin zaskarżenia nakazu ustanawia **art. 480²
> § 2 KPC** i jest różnicowany miejscem doręczenia oraz trybem: 2 tygodnie
> (upominawczy, w kraju), **miesiąc (nakazowy, doręczenie na terytorium UE —
> czyli także w Polsce)**, 3 miesiące (poza UE). Reprodukcja:
> `curl -s api.sejm.gov.pl/eli/acts/DU/2026/468/text.pdf | pdftotext -layout - - | grep -n "Art. 480\[2\]"`.

| Czynność | Termin | Liczony od | Podstawa | Skutek uchybienia |
|----------|--------|-----------|----------|-------------------|
| Sprzeciw od nakazu **upominawczego** — doręczenie w kraju | **2 tygodnie** | doręczenia nakazu | **art. 480² § 2 pkt 1 KPC** | Nakaz ma skutki prawomocnego wyroku (art. 480² § 4 KPC) |
| Sprzeciw od nakazu upominawczego — doręczenie **poza krajem na terytorium UE** | **miesiąc** | doręczenia nakazu | art. 480² § 2 pkt 2 KPC | jw. |
| ⛔ **Zarzuty od nakazu w postępowaniu NAKAZOWYM** — doręczenie na terytorium UE (w tym w Polsce) | **MIESIĄC** | doręczenia nakazu | **art. 480² § 2 pkt 3 KPC** | jw. |
| Zaskarżenie nakazu — doręczenie **poza terytorium UE** | **3 miesiące** | doręczenia nakazu | art. 480² § 2 pkt 4 KPC | jw. |
| Wniosek o uzasadnienie wyroku | **tydzień** | ogłoszenia wyroku (a gdy wyrok doręcza się z urzędu — doręczenia, § 2) | **art. 328 § 1 KPC** | Brak możliwości wniesienia apelacji |
| Apelacja cywilna | 14 dni | doręczenia uzasadnienia | art. 369 §1 KPC | Wyrok prawomocny |
| Zażalenie | 7 dni | doręczenia postanowienia | art. 394 §2 KPC | Postanowienie prawomocne |
| Sprzeciw od orzeczenia ref. | 7 dni | doręczenia | art. 398²² KPC | Orzeczenie prawomocne |
| Odwołanie od wypowiedzenia (KP) | 21 dni | doręczenia wypowiedzenia | art. 264 §1 KP | Utrata roszczenia |
| Odwołanie od rozwiązania bez wypow. | 21 dni | dnia rozwiązania | art. 264 §2 KP | Utrata roszczenia |
| Przywrócenie terminu | 7 dni | ustania przeszkody | art. 168 KPC | Niedopuszczalność |
| Skarga kasacyjna (cywilna) | 2 miesiące | doręczenia orzeczenia z uzasadnieniem | art. 398⁵ § 1 KPC | Niedopuszczalna |
| Zażalenie prokuratora na odmowę | 7 dni | doręczenia postanowienia | art. 306 KPK | — |

---

## OP-4 — Procedura obliczania terminu zawitego

```
KROK 1: Ustal datę doręczenia pisma/orzeczenia
KROK 2: Dodaj liczbę dni (7, 14 lub 21)
KROK 3: Jeśli ostatni dzień to sobota lub niedziela → termin przesuwa
         się na najbliższy dzień roboczy (art. 165 §1 KPC, art. 115 KC)
KROK 4: Jeśli ostatni dzień to ustawowy dzień wolny od pracy →
         termin przesuwa się analogicznie
KROK 5: Data ZŁOŻENIA pisma = data nadania w placówce pocztowej
         (art. 165 §2 KPC) lub data złożenia w biurze podawczym sądu
         ⚠️⚠️ DODANE 2026-07-18: przepis był ZMIENIANY WIELOKROTNIE (co
         najmniej 4 razy w ostatnich latach, m.in. w reakcji na wyrok
         TSUE C-545/17 z 27.03.2019) i JEGO WYKŁADNIA POZOSTAJE SPORNA —
         część doktryny/orzecznictwa twierdzi, że nadal TYLKO nadanie u
         "operatora wyznaczonego" (Poczta Polska) daje pewność zachowania
         terminu; inne źródła wskazują na rozszerzenie na KAŻDEGO operatora
         świadczącego "usługi powszechne" lub nawet każdego operatora
         wpisanego do rejestru (259 podmiotów wg stanu z lutego 2025).
         **REKOMENDACJA PRAKTYCZNA: dla pism o KRYTYCZNYM znaczeniu
         (środki zaskarżenia, pisma z zawitym terminem) nadawaj WYŁĄCZNIE
         za pośrednictwem Poczty Polskiej, dopóki nie zweryfikujesz online
         AKTUALNEGO brzmienia art. 165 §2 KPC i najnowszego orzecznictwa SN
         na dzień sporządzania pisma — ryzyko nieskuteczności czynności
         procesowej przy użyciu innego operatora jest realne i NIE zostało
         jednoznacznie wyeliminowane.** Patrz też
         `dr-02/.../mod-ustawa-monopole-panstwowe.md` sekcja o operatorze
         wyznaczonym (Poczta Polska) dla szerszego kontekstu.

ALERT TERMINOWY:
Jeśli termin upływa w ciągu ≤ 3 dni: ⚠ PILNE — wskaż wyraźnie
Jeśli termin już upłynął: ⛔ TERMIN UPŁYNĄŁ — oceń możliwość przywrócenia
```

---

## OP-5 — Sposoby uiszczenia opłaty sądowej

1. **Przelewem** na konto sądu (IBAN podany na stronie sądu)
   - Tytuł: sygnatura / typ pisma / imię i nazwisko strony
   - Potwierdzenie przelewu → załączyć do pisma

2. **Znakami opłaty sądowej** (znaczki sądowe) — dla opłat do 1 500 zł
   - Naklejone na pierwszej stronie pisma

3. **Przez e-Płatności** (portal Ministerstwa Sprawiedliwości)
   - Dostępne dla wybranych sądów

4. **W kasie sądu** — w dniu składania pisma

> Po uiszczeniu opłaty: wskaż w piśmie "Opłata sądowa uiszczona w kwocie
> [X] zł, dowód w załączniku nr [Y]."

## Integracja shared/TERM-CALC

Przy każdym terminie albo opłacie wczytaj:

```text
view shared/TERM-CALC.md
```

Terminy krytyczne oznacz jako wymagające sprawdzenia z aktualnym kalendarzem i aktualnym tekstem ustawy.

# DR-02 — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-22 (F-83, zasilenie z `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł.

Ten plik odpowiada na inne pytanie: "**które konkretne tytuły/działy/
zakresy artykułów danego aktu są rzeczywiście opracowane treściowo, a
które są lukami**". Kluczowy mechanizm przy nowelizacji: pokazuje od razu,
czy dotknięty fragment ma już treść do zaktualizowania, czy to obszar
dotąd nieopracowany.

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/dobrze pokryte — rzeczywista, praktycznie użyteczna treść |
| 🟡 | Częściowe pokrycie — część artykułów opracowana, część brakuje |
| 🔴 | Brak — zero treści merytorycznej |
| ⚪ | Nie dotyczy (przepis uchylony/techniczny) |

⚠️ Ten rejestr opisuje ILOŚĆ i ZAKRES treści, nie jej AKTUALNOŚĆ prawną.
Każdy przepis nadal wymaga weryfikacji ISAP przed użyciem (HARD GATE).

---

## Kodeks spółek handlowych (KSH)

**Stan prawny bazowy w chwili audytu źródłowego:** Dz.U. 2024 poz. 18 t.j.
ze zm. (2026.176 dematerializacja akcji, 2026.187 art. 88 — psycholog
w spółce partnerskiej)
**Data ostatniej weryfikacji treści (zasilenie z raportu):** 2026-08-13
**Moduły badane:** `mod-KSH-spolki-handlowe.md`, `mod-KSH-wrogie-przejecie-
obrona-bialy-rycerz.md`

⚠️ **Największa rozbieżność między statusem deklarowanym a rzeczywistym
pokryciem spośród wszystkich zbadanych aktów.** Mapa centralna
(`ROUTING-MAP.md`) oznacza KSH jako "✅ OK" (sugerując pełne pokrycie), ale
rzeczywista inwentaryzacja pokazuje, że **cały system operuje na ok. 14
unikalnych artykułach**, podczas gdy KSH liczy ok. 600 artykułów w 5
tytułach. **To dokładnie ten typ rozbieżności, dla którego istnieje ten
rejestr** — status "OK" w MAPA-AKTOW mówi tylko że moduł istnieje i jest
aktualny co do cytowanego stanu prawnego, NIE że pokrywa cały akt.

### Tytuł I — Przepisy ogólne (art. 1–21¹⁶)

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I | Przepisy wspólne (definicja spółki handlowej, spółka w organizacji) | 1–7¹ | 🔴 | Brak nawet definicyjnego omówienia art. 1 (katalog 7 typów spółek) |
| II | Spółki osobowe — przepisy wspólne | 8–10¹ | 🔴 | — |
| III | Spółki kapitałowe — przepisy wspólne | 11–21¹⁶ | 🔴 | — |
| IV | **Grupa spółek** (holding faktyczny, od 2022) | 21¹–21¹⁶ | 🔴 | Instytucja stosunkowo nowa (wiążące polecenia, ochrona mniejszości), zero treści |

### Tytuł II — Spółki osobowe (art. 22–150)

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I | Spółka jawna | 22–85 | 🔴 śladowo | Tylko art. 22, 31 (kwalifikator odpowiedzialności, jedno zdanie) |
| II | Spółka partnerska | 86–101 | 🔴 śladowo | Tylko art. 88 (katalog zawodów, nowelizacja 2026 — psycholodzy) i 95 |
| III | Spółka komandytowa | 102–124 | 🔴 śladowo | Tylko art. 111 (odpowiedzialność komandytariusza) |
| IV | Spółka komandytowo-akcyjna | 125–150 | 🔴 śladowo | Tylko art. 125, 135 |

**Cały Tytuł II (129 art., 4 typy spółek osobowych) reprezentowany
wyłącznie pojedynczymi zdaniami o odpowiedzialności — zero treści o
prowadzeniu spraw, reprezentacji, wystąpieniu wspólnika, likwidacji.**

### Tytuł III — Spółki kapitałowe (art. 151–490)

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Rozdz. 1 | Sp. z o.o. — powstanie | 151–173 | 🔴 | Tylko wzmianka "kapitały minimalne" |
| I, Rozdz. 2 | Sp. z o.o. — prawa i obowiązki wspólników | 174–200 | 🔴 | — |
| I, Rozdz. 3 | Sp. z o.o. — organy | 201–254 | 🟡 | Tylko zaskarżenie uchwał (art. 251, 252 — terminy) i reprezentacja ogólnie; zero o kompetencjach zarządu, radzie nadzorczej, zgromadzeniu |
| I, Rozdz. 4 | Zmiana umowy spółki | 255–265 | 🔴 | — |
| I, Rozdz. 5 | Wyłączenie wspólnika | 266–269 | 🔴 | — |
| I, Rozdz. 6 | Rozwiązanie i likwidacja spółki | 270–290 | 🔴 | — |
| I, Rozdz. 7 | **Odpowiedzialność cywilnoprawna zarządu** | 291–300 | 🟢 | **Art. 299 — najlepiej opracowany przepis całego KSH**: przesłanki uwolnienia, termin 30 dni na wniosek o upadłość, przedawnienie 3 lata; powiązany z modułem upadłościowym, windykacyjnym, DR-03 |
| Ia | Prosta spółka akcyjna (PSA) — cały dział | 300¹–300¹³⁴ | 🔴 śladowo | Tylko "brak odpowiedzialności akcjonariuszy" + nowelizacja 2026 dematerializacji akcji, punktowo |
| II | Spółka akcyjna (cały dział) | 301–490 | 🔴 | Tylko art. 301 §5 i wzmianka art. 308; 189 artykułów praktycznie nieopracowanych |

**Jeden przepis (art. 299) dobrze opracowany, poza nim cały Tytuł III (sp.
z o.o. poza odpowiedzialnością zarządu + cała PSA + cała S.A., łącznie
340 artykułów) praktycznie pusty.**

### Tytuł IV — Łączenie, podział i przekształcanie spółek (art. 491–584¹³)

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I | Łączenie się spółek | 491–527 | 🟢 | Kto może się łączyć, dwie metody, sukcesja uniwersalna (art. 494), dopłaty do 10%. Transgraniczne łączenie (Rozdz. 2¹) nadal bez treści |
| II | Podział spółek | 528–550¹ | 🟢 | Pięć sposobów podziału, w tym podział przez wyodrębnienie (nowość 2023, art. 529 §1 pkt 5) |
| III | Przekształcenia spółek | 551–595 | 🟡 | Ogólna zasada (art. 551) i przekształcenie przedsiębiorcy; szczegółowe wymogi proceduralne per typ nadal nieopracowane |
| IV | Transgraniczny podział i przekształcenie | 584¹–584¹³ | 🔴 | — |

### Tytuł V — Przepisy karne (art. 585–595)

| Materia | Art. | Status | Moduł |
|---|---|---|---|
| Przestępstwa na szkodę spółki, fałszywe dane, niezgłoszenie upadłości | 585–595 | 🔴 | Nie opracowane bezpośrednio; temat pokrewny "słupy"/fikcyjna reprezentacja w DR-03 z perspektywy KK, nie Tytułu V KSH |

**Rekomendowana kolejność uzupełniania (wg raportu źródłowego):**
1. Tytuł III, Dział I, Rozdz. 3 — organy sp. z o.o. (art. 201–254) — najwyższy priorytet praktyczny
2. Tytuł IV w całości — łączenie, podział, przekształcanie — duża luka przy rosnącym znaczeniu M&A
3. Tytuł II — spółka jawna i komandytowa (art. 22–66, 102–124) — najpopularniejsze typy osobowe
4. Tytuł III, Dział II — spółka akcyjna (art. 301–490) — objętościowo ogromna, całkowicie pusta
5. Tytuł I — przepisy ogólne + grupa spółek — fundament pojęciowy
6. Dział Ia — prosta spółka akcyjna — rosnąca popularność wśród startupów

---

## Prawo upadłościowe (PrUp) i Prawo restrukturyzacyjne (PrRestr)

**Stan prawny bazowy:** PrUp — Dz.U. 2026 poz. 913 t.j.; PrRestr — Dz.U.
2026 poz. 533 t.j. (oba zaktualizowane 2026-08-21, poprzednie t.j.
2025.614 i wcześniejsze — patrz `MAPA-AKTOW.md`)
**Data ostatniej weryfikacji treści:** 2026-08-22 (⛔ NAPRAWIONE — ta
sekcja miała identyczny problem jak KKW w dr-03: zbudowana na raporcie
źródłowym z 13.08, nie uwzględniała PIĘCIU dodatkowych modułów PrRestr i
PODZIAŁU modułu PrUp, wszystkie z 2026-08-19/21, a więc PRZED dniem
budowy tej mapy 21.08 — błąd nie wynikał z upływu czasu, tylko z
niewystarczającej weryfikacji stanu bieżącego przy pierwszym budowaniu)

⚠️ **To druga (po KKW) i znacznie większa naprawa tego samego typu w tej
sesji — potwierdza, że mapy pokrycia wymagają weryfikacji PEŁNEJ LISTY
PLIKÓW modułu (nie tylko treści jednego znanego pliku) przed każdym
zasileniem.** Rzeczywista liczba modułów: PrUp = 2 pliki (moduł główny +
wydzielony po podziale), PrRestr = 5 plików (nie 1, jak sugerował
pierwotny raport źródłowy) — wszystkie potwierdzone bezpośrednio w
`MAPA-AKTOW.md` dr-02, gdzie każdy ma osobny, zweryfikowany wiersz.

### Prawo upadłościowe — Część pierwsza (art. 1–377)

**Moduły:** `mod-PrUpad-upadlosc-restrukturyzacja.md` (moduł macierzysty,
906 linii) + `mod-PrUpad-uklad-likwidacja-zakonczenie.md` (wydzielony
2026-08-21, 307 linii — ZASADA 13, podział wyprzedzający przy zbliżaniu
się do progu 1000 linii, treść przeniesiona verbatim)

| Tytuł | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Dział I | Przepisy wstępne (cel, zasada optymalnego zaspokojenia) | 1–4a | 🔴 | — |
| I, Dział II | Podmiotowy zakres stosowania | 5–9b | 🔴 | — |
| I, Dział III | **Podstawy ogłoszenia upadłości (test niewypłacalności)** | 10–17 | 🟢 | Art. 11 — obie przesłanki (płynnościowa, bilansowa), progi 3/24 miesiące. Moduł macierzysty |
| II, Dział I | Sąd (właściwość) | 18–19 | 🔴 | Tylko ogólna wzmianka bez numeru artykułu |
| II, Dział II | Wniosek o ogłoszenie upadłości | 20–25a | 🟡 | Uprawnieni wskazani, elementy formalne wniosku nie. Moduł macierzysty |
| II, Dział III | Przepisy o postępowaniu | 26–35 | 🔴 | — |
| II, Dział IV | **Postępowanie zabezpieczające** | 36–43 | 🟢 | Charakter fakultatywny (36), tymczasowy nadzorca (38), granica zwykłego zarządu (38a), zawieszenie egzekucji (39), zarząd przymusowy (40), upadek zabezpieczenia (43). Moduł macierzysty |
| II, Dział VI | Orzeczenie o ogłoszeniu upadłości | 51–56 | 🔴 | — |
| II, Dział VII | **Przygotowana likwidacja (pre-pack)** | 56a–56h | 🟢 | Istota, zasady dla podmiotów powiązanych, przesłanki zatwierdzenia, procedura i skutki sprzedaży. Moduł macierzysty |
| III | Skutki ogłoszenia upadłości | 57–148 | 🟡 | **Czynności bezskuteczne (art. 127, 128) dobrze opisane** — bezskuteczność z mocy prawa (1 rok) vs na wniosek syndyka (6 mies., osoby bliskie); reszta działu nieopracowana. Moduł macierzysty |
| IV | **Syndyk, zgromadzenie/rada wierzycieli, plan podziału** | 149–235 | 🟢 | Powołanie i wymogi syndyka (156-157a), kompetencje i status (160/161/173), obowiązki sprawozdawcze (168/176), odwołanie/sankcje (169a-172), wynagrodzenie (162-167b). Zgromadzenie/rada wierzycieli (Dział III, 189-213) nadal bez treści. Moduł macierzysty |
| V | **Zgłoszenie i ustalenie wierzytelności** | 236–266 | 🟢 | Art. 239 (obowiązkowe elementy zgłoszenia), kategorie zaspokojenia I-IV, sprzeciw do sędziego-komisarza. Moduł macierzysty |
| Va | **Układ w upadłości** (NOWA numeracja — dawny Tytuł VI art. 267-305 CAŁKOWICIE UCHYLONY) | 266a–266f | 🟢 NAPRAWIONE 2026-08-21 | `mod-PrUpad-uklad-likwidacja-zakonczenie.md` — ⛔ ta mapa WCZEŚNIEJ błędnie cytowała nieaktualny "Dział VI, art. 267-305" jako brakujący; te przepisy NIE ISTNIEJĄ, zastąpione skróconym Tytułem Va. Art. 266a (dopuszczalność, legitymacja: upadły/wierzyciel/syndyk) opisany |
| VII, Dział I | **Likwidacja masy upadłości** — spis inwentarza, plan likwidacyjny | 306–315 | 🟢 NAPRAWIONE 2026-08-21 | `mod-PrUpad-uklad-likwidacja-zakonczenie.md` |
| VII, Dział II-IV | Likwidacja masy — dalsze działy (sprzedaż, rozliczenia) | 316–334 | 🔴 | Świadomie odłożone, patrz "ZAKRES NIEOPRACOWANY" w module |
| VIII | Podział funduszów masy upadłości | 335–361 | 🟡 | Tylko art. 336 (zaspokojenie wierzytelności zabezpieczonych rzeczowo poza kolejnością). Moduł macierzysty |
| IX | **Zakończenie i umorzenie postępowania** | 361–372 | 🟢 NAPRAWIONE 2026-08-21 | `mod-PrUpad-uklad-likwidacja-zakonczenie.md` — art. 361 (przesłanki umorzenia, w tym "pusta masa") i dalsze |
| X | **Zakaz prowadzenia działalności gospodarczej** | 373–377 | 🟢 | Okres 1-10 lat, przesłanki (w tym faktyczny zarządca), wyjątek restrukturyzacyjny, terminy prekluzyjne 1 rok/3 lata, sprzężenie z art. 299 KSH. Moduł macierzysty |

**Część druga (międzynarodowe postępowanie, art. 378-417): 🔴 całkowity
brak.** **Część trzecia (banki, ubezpieczyciele, deweloperzy, art.
418-425+): 🔴 całkowity brak, niski priorytet.** **Część piąta (upadłość
konsumencka): 🟡 częściowo.**

**Ocena PrUp — ZAKTUALIZOWANA:** siedem instytucji o najwyższej częstości
praktycznej naprawionych (syndyk, zabezpieczenie, zakaz działalności,
pre-pack, TERAZ TAKŻE układ w upadłości, likwidacja masy Dział I,
zakończenie/umorzenie). Pozostają: likwidacja masy Działy II-IV,
postępowanie międzynarodowe, postępowania szczególne. Powiązana flaga:
**F-86** (priorytet obniżony do "bardzo niski" po tej naprawie).

### Prawo restrukturyzacyjne (art. 1–433)

**Moduły — PIĘĆ, nie jeden jak wcześniej w tej mapie:**
`mod-PrRestr-dzial-III-nadzorca-zarzadca.md` (423 l.),
`mod-PrRestr-dzial-IV-uczestnicy-wierzyciele.md` (547 l., obejmuje też
Dział V), `mod-PrRestr-dzial-V-pomoc-publiczna.md` (271 l.),
`mod-PrRestr-dzial-VI-uklad.md` (242 l.), `mod-PrRestr-dzial-VII-uklad-
czesciowy.md` (250 l.)

| Tytuł | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Dział I | Przepisy ogólne (cel, podstawy otwarcia, plan restrukturyzacyjny) | 1–13 | 🔴 | — |
| I, Dział II | Sąd i sędzia-komisarz | 14–22 | 🔴 | — |
| I, Dział III | **Nadzorca i zarządca** (kwalifikator organu, licencja, nadzorca układu, nadzorca sądowy, zarządca) | 23–64 | 🟢 NAPRAWIONE 2026-08-19 | `mod-PrRestr-dzial-III-nadzorca-zarzadca.md` — 4 rozdziały pełne. ⚠️ Oddział 2 Rozdz. 4 (wynagrodzenie zarządcy) świadomie luka, patrz moduł |
| I, Dział IV | **Uczestnicy postępowania** (definicje, spis wierzytelności, zgromadzenie, rada wierzycieli) | 65–139 | 🟢 NAPRAWIONE 2026-08-19 | `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele.md` — 4 rozdziały. ⚠️ Brak instytucji zgłoszenia wierzytelności (spis z urzędu) świadomie odnotowany jako luka w samym module |
| I, Dział V | **Pomoc publiczna** | 139a–149 | 🟢 NAPRAWIONE 2026-08-20 | `mod-PrRestr-dzial-V-pomoc-publiczna.md` — test prywatnego wierzyciela, zasada "one time last time", próg 10 mln EUR. ⚠️ [NIEWERYFIKOWANE RZĄD 1] — treść z RZĄD 2/3; ryzyko przestarzałego odesłania do uchylonego rozp. UE 659/1999 nadal niezweryfikowane |
| I, Dział VI | **Układ** (propozycje, zatwierdzenie, skutki, zmiana, uchylenie) | 150–179 | 🟢 | `mod-PrRestr-dzial-VI-uklad.md` — przepisy ogólne, propozycje układowe, głosowanie/zatwierdzenie art. 119, test zaspokojenia (nowość 2025/1085), skutki układu |
| I, Dział VII | **Układ częściowy** | 180–188 | 🟢 NAPRAWIONE 2026-08-20 | `mod-PrRestr-dzial-VII-uklad-czesciowy.md` — kryteria wyodrębnienia (trójwarunkowy test), katalog przykładowy wierzytelności, próg głosowania 2/3 (bardziej restrykcyjny niż art. 119 w Dziale VI), zażalenie ograniczone do zarzutów art. 180/183 |
| I, Dział VIII | Przepisy ogólne o postępowaniu restrukturyzacyjnym | 189–209 | 🔴 | — |
| II | **Cztery tryby restrukturyzacji** (PZU, PPU, PU, sanacja) | 210–334 | 🟢 | Tabela "Tryby restrukturyzacji" z podstawą prawną: PZU (210-226h), PPU (227-264), PU (265-282), sanacja (283-323), próg 15% (art. 3 ust. 4 pkt 2) |
| III | Międzynarodowe postępowanie restrukturyzacyjne | ok. 335–380 | 🔴 | — |
| IV | Odrębne postępowania (deweloperzy, emitenci, banki, SKOK-i) | ok. 381–433 | 🔴 | — |

**Ocena PrRestr — ZASADNICZO ZMIENIONA:** z 9 jednostek strukturalnych
tylko 3 (Dział I, Dział II, Dział VIII) oraz Tytuły III-IV pozostają bez
treści — **PrRestr jest dziś jednym z lepiej pokrytych aktów pozakodeksowych
w całym systemie**, nie najsłabiej pokrytym jak sugerował pierwotny
raport. Flaga **F-87 W CAŁOŚCI ZAMKNIĘTA** (potwierdzone w WARN-OTWARTE —
brak już aktywnego wiersza, tylko odniesienie historyczne).

### Tematy przekrojowe (PrUp/PrRestr)

| Temat | Status | Moduł |
|---|---|---|
| Status zawodowy syndyka/nadzorcy/zarządcy | 🟢 | `mod-ustawa-doradca-restrukturyzacyjny-zawod` — inny akt (Dz.U. 2022.1007) |
| KRZ — Krajowy Rejestr Zadłużonych | 🟢 | Sekcja dedykowana w module głównym PrUp |
| Odpowiedzialność zarządu sp. z o.o. (powiązanie z KSH art. 299) | 🟢 | Odesłanie do `mod-KSH-spolki-handlowe` — spójność zachowana |
| Nowelizacja 25.07.2025 (Dz.U. 2025.1085) — zmiana 3 ustaw (PrRestr/PrUp/KRZ) | 🟢 | Uwzględniona w naprawionych modułach (test zaspokojenia Dział VI, termin dnia układowego Tytuł II) |

**Zaktualizowana rekomendowana kolejność uzupełniania** (4 z 4 oryginalnych
pozycji już naprawione — pozostają inne, niżej priorytetowe):
1. ~~PrUp Dział VI/Va — układ w postępowaniu upadłościowym~~ ✅ NAPRAWIONE 2026-08-21
2. ~~PrUp Dział VII — likwidacja masy (Dział I)~~ ✅ NAPRAWIONE 2026-08-21 (Działy II-IV nadal 🔴)
3. ~~PrRestr Dział III — nadzorca i zarządca~~ ✅ NAPRAWIONE 2026-08-19
4. **PrRestr Dział I, Dział II, Dział VIII** — przepisy ogólne, sąd/sędzia-komisarz, przepisy ogólne postępowania — jedyne pozostałe luki w Tytule I PrRestr
5. **PrUp likwidacja masy Działy II-IV (art. 316-334)** — dokończenie już częściowo opracowanego tytułu
6. **PrRestr Dział V — weryfikacja RZĄD 1** treści opartej dotąd na RZĄD 2/3, w tym sprawdzenie aktualności odesłania do rozp. UE 659/1999
7. Postępowanie międzynarodowe (oba akty) i postępowania szczególne — niski priorytet praktyczny

---

## Kodeks postępowania cywilnego (KPC)

**Stan prawny bazowy:** Dz.U. 2026 poz. 468 t.j.
**Źródło:** `raport-pokrycia-KPC.md` (13.08.2026 — 106 jednostek redakcyjnych,
197 unikalnych artykułów przywołanych w systemie, ok. 16% jednostek kodeksu)
**Data przeniesienia i uzgodnienia ze stanem bieżącym:** 2026-08-22 (F-83)
**Moduły dedykowane (dr-02):** `mod-KPC-prawomocnosc-granice-apelacji.md`
(205 l.), `mod-KPC-nieproces-czesc-ogolna.md` (404 l.),
`mod-KPC-egzekucja-windykacja.md` (383 l.)

> ⛔ **UWAGA METODYCZNA — dlaczego ta sekcja powstała później niż pozostałe.**
> Raport źródłowy został świadomie NIE przeniesiony 1:1 w sesji 2026-08-22
> (pierwsza faza F-83), bo część jego luk krytycznych naprawiono już wcześniej
> we flagach F-65 i F-83, czego plik raportu nie odzwierciedla. Przeniesienie
> bez uzgodnienia wpisałoby do trwałego rejestru dane fałszywie negatywne.
> Poniższa tabela to wynik **artykuł po artykule** sprawdzenia 15 luk
> krytycznych raportu wobec faktycznego stanu plików na 2026-08-22
> (`grep` na całym `/mnt/skills/user`, z odsianiem kolizji międzykodeksowych
> — np. art. 162 KK vs KPC, art. 617 KRO vs KPC, art. 833 KC vs KPC).

### Weryfikacja 15 luk krytycznych raportu wobec stanu na 2026-08-22

| # raportu | Przepis | Status wg raportu (13.08) | **Stan faktyczny 22.08** | Gdzie |
|---|---|---|---|---|
| 2 | art. 365, 366 — prawomocność, res iudicata | 🔴 luka krytyczna | ✅ **NAPRAWIONE** | `mod-KPC-prawomocnosc-granice-apelacji` |
| 3 | art. 378, 382–386 — granice apelacji | 🔴 luka krytyczna | ✅ **NAPRAWIONE** | j.w. (ramy dla `appellate-engine-v8`) |
| — | art. 398²²–398²⁴ — skarga na orzeczenie referendarza („deklaracja bez pokrycia" w raporcie) | 🔴 deklaracja bez pokrycia | ✅ **NAPRAWIONE** — występuje w 5 plikach | `mod-KPC-prawomocnosc-*`, `SPH-inne` |
| 10 (część) | art. 506–525 — nieproces, przepisy ogólne | 🔴 cała Księga II bez modułu | ✅ **NAPRAWIONE** (art. 506, 518, 519¹, 523) | `mod-KPC-nieproces-czesc-ogolna` |
| 1 | art. 205¹–205¹² — organizacja postępowania, prekluzja | 🔴 luka krytyczna #1 | 🟡 **CZĘŚCIOWO** — art. 205¹² opisany, ale wyłącznie w kontekście *stosowania w nieprocesie*; brak modułu o organizacji postępowania w procesie (plan rozprawy, posiedzenie przygotowawcze) | `mod-KPC-nieproces-czesc-ogolna` sekcja o prekluzji |
| 6 | art. 477⁹, 477¹⁴ — odwołanie od decyzji ZUS | 🔴 luka krytyczna | 🟡 **CZĘŚCIOWO** — termin miesięczny obecny w 6 plikach (`shared/terminy`, dr-04), brak systematyki trybu | dr-04, shared |
| 4 | art. 458¹–458¹³ — sprawy gospodarcze | 🔴 luka krytyczna | 🟡 **WZMIANKI** — art. 458¹ (definicja) w 4 plikach; ⛔ art. 458⁵ (prekluzja gospodarcza) **nie występował w systemie w ogóle** przed poprawką z 22.08 | `mod-KPC-egzekucja-windykacja`, MD3b |
| 8 | art. 399, 401, 401¹, 403 — wznowienie | 🔴 luka krytyczna | 🟡 **CZĘŚCIOWO** — art. 399 obecny, art. 401/401¹/403 nadal 🔴 | `mod-KPC-prawomocnosc-*` |
| 5 | art. 829, 833 — rzeczy wyłączone spod egzekucji, kwota wolna | 🔴 luka krytyczna | 🔴 **NADAL LUKA** — art. 829 występuje wyłącznie w tekście tej mapy | — |
| 7 | art. 350, 351, 352 — sprostowanie, uzupełnienie, wykładnia wyroku | 🔴 luka krytyczna | 🔴 **NADAL LUKA** — art. 351 i 352 zero wystąpień w systemie | — |
| 11 | art. 1041–1059 — egzekucja świadczeń niepieniężnych | 🔴 luka krytyczna | 🔴 **NADAL LUKA** — zero wystąpień | — |
| 12 | art. 1081–1088 — egzekucja alimentów | 🔴 luka krytyczna | 🔴 **NADAL LUKA** — zero wystąpień | — |
| 10 (część) | art. 669–689 — stwierdzenie nabycia spadku, dział spadku | 🔴 luka krytyczna | 🔴 **NADAL LUKA** — art. 669 zero wystąpień; art. 680 tylko przez odesłanie z modułu spadkowego KC | — |
| 9 | art. 458¹⁴–458¹⁶ — postępowanie z udziałem konsumentów | 🔴 luka krytyczna | 🔴 **NADAL LUKA** | — |
| 13 | art. 316 §1 — stan rzeczy z chwili zamknięcia rozprawy | 🔴 luka krytyczna | 🟡 **WZMIANKA** — 1 plik (skarga pauliańska) | dr-02 |
| 14 | art. 162 — zastrzeżenie do protokołu | 🔴 luka krytyczna | ✅ **NAPRAWIONE 2026-08-22** — luka bliźniacza do art. 105 PPSA dr-05, treść zweryfikowana Rząd 1+2B | `mod-KPC-art162-zastrzezenie-protokol` |
| 15 | art. 617–626¹³ — zniesienie współwłasności, wieczystoksięgowe | 🔴 luka krytyczna | 🔴 **NADAL LUKA** w zakresie KPC — trafienia to art. 617 **KRO** | — |

**Bilans uzgodnienia: 5 luk krytycznych zamkniętych (poz. #14 dodana
2026-08-22), 5 częściowo, 7 nadal otwartych.** Raport z 13.08 był
nieaktualny w 4 z 15 pozycji (27%) — czyli w tym samym rzędzie
wielkości, co przy sześciu mapach korygowanych w pierwszej fazie F-83.

### Stan pokrycia wg ksiąg (po uzgodnieniu)

| Jednostka | Zakres | Status | Uwagi |
|---|---|---|---|
| Tytuł wstępny | 1–14 | 🟡 | art. 3, 5, 7, 9 przez bramki walidacyjne; brak art. 1, 2, 6, 13 §2 |
| Ks. I Tyt. I — Sąd (właściwość, skład, wyłączenie) | 15–54 | 🟢 | `shared/WLASCIWOSC-GATE`, `mod-sklad-sadu-liczba-sedziow`; braki w trybie wyłączenia (50–54) |
| Ks. I Tyt. II–III — Prokurator, NGO | 55–63 | 🔴 | całe tytuły bez treści |
| Ks. I — Organizacja postępowania | 205¹–205¹² | 🟡 | patrz tabela wyżej, poz. #1 |
| Ks. I Dz. III — **Dowody** | 227–315 | 🟢 | ⭐ najmocniejszy fragment całego systemu: `analizator-dowodow-v3` + `MOD-ATAK-NA-DOWOD`/`-SWIADKA`. Art. 233 §1 to najczęściej cytowany przepis w systemie (20 plików) |
| Ks. I Dz. IV — Orzeczenia | 316–366 | 🟡 | prawomocność 🟢; sprostowanie/uzupełnienie/wykładnia (350–352) 🔴 |
| Ks. I Dz. V — Środki odwoławcze | 367–424¹² | 🟡 | apelacja 🟢 po F-65; zażalenie przez `ZAZALENIE-ADRESAT-GATE` (F-13) |
| Ks. I Dz. VI — Wznowienie | 399–416¹ | 🟡 | tylko art. 399 i terminy z 407 |
| Ks. I — postępowania odrębne (gospodarcze, konsumenckie, pracy) | 458¹–477¹⁶ | 🔴/🟡 | patrz tabela wyżej |
| Ks. I — nakazowe i upominawcze | 480–505 | 🟢 | pełne szablony w `pisma-proste-v2` |
| **Ks. II — Nieproces** | 506–1088 | 🟡 | część ogólna 🟢 po F-65; **sprawy spadkowe, rzeczowe i wieczystoksięgowe nadal 🔴** |
| Cz. III — Egzekucja | 758–1088 | 🟡 | klauzula, skarga na komornika, powództwa przeciwegzekucyjne 🟢; ⛔ ograniczenia egzekucji, świadczenia niepieniężne, alimenty 🔴 |
| Cz. IV — Jurysdykcja krajowa | 1097–1116 | 🔴 | styk z DR-14 |

### ⭐ Ustalenie uboczne o wadze CRIT — uchylony art. 207 KPC w obiegu

Uzgadnianie raportu ujawniło problem poważniejszy niż same luki: **art. 207
KPC (uchylony 7.11.2019 wraz z art. 217) był nadal cytowany jako podstawa
operacyjna w sześciu miejscach systemu**, w tym w pliku kanonicznym terminów.
Naprawione 2026-08-22 w tej samej sesji — szczegóły i lista plików:
`AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-22m.

Aktualne podstawy: **art. 205¹ §1** (wezwanie do odpowiedzi na pozew, termin
sądowy nie krótszy niż 2 tygodnie), **art. 205¹ §2** (zwrot odpowiedzi
spóźnionej), **art. 205¹²** (prekluzja ogólna), **art. 458⁵** (prekluzja
gospodarcza).

### Rekomendowana kolejność uzupełniania (zaktualizowana 2026-08-22)

1. ~~art. 365–366 prawomocność~~ ✅ F-65
2. ~~art. 378, 382–386 granice apelacji~~ ✅ F-65
3. ~~art. 506–525 nieproces, część ogólna~~ ✅ F-65
4. **art. 829–839 + 824–826 — ograniczenia egzekucji i kwota wolna** ⭐ najwyższy priorytet: system opisuje egzekucję z wynagrodzenia, ale nie zna granic — asymetria działająca na niekorzyść dłużnika
5. **art. 205¹–205¹¹ — organizacja postępowania w procesie** (posiedzenie przygotowawcze, plan rozprawy); art. 205¹² już opisany
6. **art. 458¹–458¹³ — sprawy gospodarcze** (prekluzja 458⁵, umowa dowodowa, ograniczenie dowodu ze świadków 458¹¹)
7. **art. 669–689 — stwierdzenie nabycia spadku i dział spadku** (dwie najczęstsze sprawy spadkowe, tryb nieprocesowy)
8. art. 350–352 — sprostowanie, uzupełnienie, wykładnia wyroku
9. art. 1041–1059 i 1081–1088 — egzekucja świadczeń niepieniężnych i alimentów
~~10. art. 162 KPC — zastrzeżenie do protokołu~~ ✅ NAPRAWIONE 2026-08-22
10. art. 617–626¹³ — zniesienie współwłasności i postępowanie wieczystoksięgowe
11. art. 401, 401¹, 403 — podstawy wznowienia (art. 399 już jest)
12. art. 458¹⁴–458¹⁶ — postępowanie z udziałem konsumentów
13. art. 1097–1116 — jurysdykcja krajowa (domknięcie wobec DR-14)

---

## Akty NIE objęte pełnym rejestrem (raport przestarzały lub niepełny)

✅ **Kodeks postępowania cywilnego (KPC) — PRZENIESIONY 2026-08-22**, patrz
sekcja wyżej. Był ostatnim z dziewięciu raportów pokrycia świadomie odlożonym
w pierwszej fazie F-83; przeniesienie wykonano dopiero po uzgodnieniu
artykuł po artykule ze stanem faktycznym, zgodnie z zastrzeżeniem zapisanym
w tym miejscu 2026-08-22 ("albo świeży audyt KPC, albo staranne, ręczne
uzgodnienie starego raportu ze stanem aktualnym"). Wybrano drugi wariant.

Raport źródłowy `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/
raport-pokrycia-KPC.md` pozostaje na dysku — zgodnie z § 7 `WARN-OTWARTE.md`
plik raportu usuwa się dopiero po PEŁNYM zamknięciu odpowiadającej flagi (F-65),
a osiem luk krytycznych pozostaje otwartych.

⚠️ **Pozostałe akty dr-02 bez rejestru pokrycia:** KC (wszystkie księgi), KRO,
Prawo prywatne międzynarodowe i akty satelickie — audyt źródłowy z 2026-08-13
objął w tym skillu wyłącznie KSH, PrUp/PrRestr i KPC. Do uzupełnienia nowym
audytem, jeśli okaże się potrzebny.

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

## Akty NIE objęte pełnym rejestrem (raport przestarzały lub niepełny)

**Kodeks postępowania cywilnego (KPC)** ma raport źródłowy (`raport-
pokrycia-KPC.md`, 354 linie, 106 zbadanych jednostek redakcyjnych,
197 unikalnych artykułów) — **świadomie NIE przeniesiony w całości do tej
mapy w tej sesji**, ponieważ w międzyczasie nastąpiły już częściowe
naprawy (F-65: art. 205¹, prawomocność/apelacja art. 363-386, Księga II
część ogólna nieprocesu) nieodzwierciedlone w oryginalnym pliku raportu.
Przeniesienie nieaktualnego materiału 1:1 groziłoby wpisaniem błędnych
danych do trwałego rejestru. **Do zrobienia w osobnej, dedykowanej
sesji**: albo świeży audyt KPC, albo staranne, ręczne uzgodnienie starego
raportu ze stanem aktualnym artykuł po artykule przed przeniesieniem.

Raport źródłowy KPC pozostaje dostępny w `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/raport-pokrycia-KPC.md` do wglądu — zawiera
cenne dane (m.in. listę 15 luk krytycznych, w tym art. 829/833 kwota
wolna od egzekucji, art. 350-352 sprostowanie wyroku, deklarację bez
pokrycia — "sprzeciw od referendarza" wymieniony w opisie pisma-proste-v2
bez odpowiadającej treści w żadnym module).

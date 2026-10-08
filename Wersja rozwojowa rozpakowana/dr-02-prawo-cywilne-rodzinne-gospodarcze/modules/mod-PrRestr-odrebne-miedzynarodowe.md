# Restrukturyzacja — postępowanie międzynarodowe, deweloperzy, emitenci obligacji, przepisy karne i przejściowe (PrRestr art. 338–367, 399–400, 448–456)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone i pominięte oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 81–86
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]; rozp. (UE) 2015/848 — „obowiązuje” ✅ [VER: eurlex_lookup CELEX 32015R0848, 2026-10-08]; KK art. 7 (t.j. DU/2025/383) ✅ [VER: isap_tekst DU/1997/553 art. 7, 2026-10-08 — po t.j. ogłoszono zmiany KK (m.in. DU/2026/902, DU/2026/988): przed kwalifikacją potwierdź brzmienie art. 7 na datę czynu]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 354 --verify-online`. Tytuł III ustępuje umowie międzynarodowej i prawu organizacji międzynarodowej (art. 338) — przy elemencie unijnym najpierw ustal zakres rozp. 2015/848 (treść z EUR-Lex). Dział III tytułu IV (art. 368–398) **uchylony**; art. 401–447 (przepisy zmieniające) **pominięte w t.j.** — tekst pierwotny w `references/insolvency/sources/`.

---

## FAZA 0 — INTAKE

```
□ Element zagraniczny: COMI w PL (jurysdykcja wyłączna → postępowanie główne) czy tylko działalność / siedziba / majątek (uboczne) (342)
□ Wierzyciel spoza PL i UE bez pełnomocnika w PL → pełnomocnik do doręczeń, inaczej pozostawienie w aktach (340)
□ Deweloper (art. 5 pkt 1 ustawy o ochronie nabywcy): PZU wyłączone (poza układem częściowym bez nabywców i zabezpieczonych na nieruchomości) (351)
□ Nabywcy ≥ 20% liczby → propozycje w 30 dni od otwarcia (353); wariant dopłat / sprzedaży przedsiębiorcy / zamiany lokali (354)
□ Sanacja dewelopera bez zezwolenia z art. 288 ust. 3 → wstępne głosowanie nabywców (358), dopłaty 2 mies. + 30 dni (359)
□ Emitent obligacji: PZU wyłączone (poza układem częściowym bez obligacji) (362 ust. 3); kurator vs administrator hipoteki (363)
□ Obligacje przychodowe z ograniczoną odpowiedzialnością — poza tytułem i poza układem (362 ust. 2)
□ Ryzyko karne: nieprawdziwe / zatajone informacje (399), niewydanie ksiąg zarządcy (400)
□ Sprawy z wnioskiem sprzed 01.01.2016 → przepisy przejściowe (448–455)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 338–341 | pierwszeństwo umów i prawa UE, wierzyciele zagraniczni, pełnomocnik do doręczeń, odesłanie do KPC | A |
| 342–344 | jurysdykcja krajowa, zakaz umów o jurysdykcję, zarządca zagraniczny | A |
| 345–348 | współpraca z sądami i zarządcami zagranicznymi | A |
| 349–361 | deweloperzy: definicje, wyłączenie PZU, cel, propozycje nabywców, dopłaty, grupy, tytuł egzekucyjny, wstępne głosowanie, zwrot dopłat, zgoda banku | B |
| 362–367 | emitenci obligacji: zakres, kurator, administrator hipoteki, spis, głosowanie | C |
| 399–400 | przepisy karne | D |
| 448–456 | przepisy przejściowe i wejście w życie | E |
| uchylone / pominięte | dział III tytułu IV (art. 368–398) uchylony; art. 401–447 pominięte w t.j. (przepisy zmieniające) | — |

---

## A. Postępowanie międzynarodowe (art. 338–348)

- **Art. 338:** tytuł nie ma zastosowania, gdy **umowa międzynarodowa** RP lub **prawo organizacji międzynarodowej** stanowi inaczej.
- **Art. 339:** wierzyciel zagraniczny ma **te same prawa** co krajowy.
- **Art. 340:** wierzyciel bez miejsca zwykłego pobytu / zamieszkania / siedziby w **PL lub innym państwie UE**, bez pełnomocnika procesowego w PL — wskazuje **pełnomocnika do doręczeń** w PL (ust. 1); w braku — pisma **pozostają w aktach ze skutkiem doręczenia**, z pouczeniem przy pierwszym doręczeniu, także o tym, kto może być pełnomocnikiem (ust. 2).
- **Art. 341:** w sprawach nieuregulowanych — odpowiednio **KPC o międzynarodowym postępowaniu cywilnym**.
- **Art. 342:** jurysdykcja **wyłączna**, gdy w PL jest **COMI** dłużnika (ust. 1); jurysdykcja także, gdy dłużnik prowadzi w PL działalność, ma miejsce zamieszkania, siedzibę lub majątek (ust. 2); wyłączna → postępowanie **główne**; pozostałe → **uboczne** (ust. 3). (W postanowieniu o otwarciu / zatwierdzeniu wskazuje się podstawę jurysdykcji i charakter wg rozp. 2015/848 — art. 233 ust. 2, 223 ust. 2.)
- **Art. 343:** **umów o jurysdykcję nie stosuje się**.
- **Art. 344:** ustanowienie zarządcy zagranicznego do czynności w PL **nie wyłącza** jurysdykcji polskiej.
- **Art. 345:** sąd i sędzia-komisarz porozumiewają się **bezpośrednio** z sądem i zarządcą zagranicznym (telefon, faks, e-mail).
- **Art. 346:** nadzorca sądowy / zarządca — bezpośrednio lub przez sędziego-komisarza.
- **Art. 347:** **obowiązek współpracy** w sprawach tego samego dłużnika.
- **Art. 348:** przekazywanie i żądanie informacji o majątku i postępowaniach (pkt 1), zabezpieczeniu i restrukturyzacji zobowiązań (pkt 2), zaspokojeniu wierzycieli (pkt 3).

## B. Deweloperzy (art. 349–361)

- **Art. 349:** dział stosuje się do restrukturyzacji **dewelopera** w rozumieniu art. 5 pkt 1 ustawy z 20.05.2021 o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz DFG.
- **Art. 350:** **nabywca** (strona umowy deweloperskiej z art. 5 pkt 6 lub umów z art. 2 ust. 1 pkt 2, 3, 5 lub ust. 2 tej ustawy, zobowiązana do świadczenia pieniężnego) (pkt 1); **przeniesienie własności lokalu** — lokal mieszkalny, dom jednorodzinny z gruntem lub użytkowaniem wieczystym, udział ułamkowy, lokal użytkowy z umowy z art. 2 ust. 2 (pkt 2); **umowa deweloperska** (pkt 3).
- **Art. 351:** wobec dewelopera **nie prowadzi się PZU**, z wyjątkiem **układu częściowego**, który nie obejmuje wierzytelności **nabywców** ani wierzytelności **zabezpieczonych na nieruchomości** przedsięwzięcia.
- **Art. 352:** cel — zaspokojenie nabywców przez **przeniesienie własności lokali**, o ile racjonalne względy pozwolą.
- **Art. 353:** nabywcy stanowiący **≥ 20% liczby nabywców** przedsięwzięcia mogą zgłosić **propozycje układowe** w **30 dni od otwarcia**.
- **Art. 354:** propozycje mogą obejmować: **dopłaty** nabywców i przeniesienie własności (z możliwym zwrotem dopłat z przychodów) (pkt 1); **sprzedaż nieruchomości z obciążeniami** przedsiębiorcy przejmującemu zobowiązania wobec nabywców i kontynuującemu przedsięwzięcie, ze zmianą umów (pkt 2); inne warunki i finansowanie (pkt 3); **zamianę lokali** (pkt 4) (ust. 1); art. 162 odpowiednio (ust. 2).
- **Art. 355:** różne traktowanie płacących i niepłacących dopłat (ust. 1); przy wariancie pkt 2 — **nieodwołalne oświadczenie przedsiębiorcy w formie aktu notarialnego**; po prawomocnym zatwierdzeniu układu umowę sprzedaży **uznaje się za zawartą** (ust. 2); postanowienie z oświadczeniem — **podstawa wpisu w KW**; przy rachunku powierniczym — art. 425m PrUp odpowiednio (ust. 3).
- **Art. 356:** głosowanie **w grupach** (ust. 1); nabywcy — **odrębna grupa** z odrębną listą; możliwy dalszy podział, np. według stopnia wykonania umowy (ust. 2).
- **Art. 357:** pisemny głos nabywcy w PPU, PU lub sanacji z zezwoleniem z art. 288 ust. 3, zawierający **zobowiązanie do dopłaty**, wraz z wypisem prawomocnego postanowienia zatwierdzającego — **tytuł egzekucyjny** przeciw nabywcy głosującemu za układem.
- **Art. 358:** w **sanacji z zarządcą** (bez zezwolenia z 288 ust. 3) przy propozycji dopłat — sędzia-komisarz niezwłocznie przeprowadza **wstępne głosowanie nabywców** (ust. 1); uprawnieni — nabywcy z art. 356 ust. 2 (ust. 2); niezatwierdzony spis nie przeszkadza; listę sporządza sędzia-komisarz z listy zarządcy (ust. 3); uchwała przyjęta, gdy za głosują nabywcy deklarujący **dopłaty wystarczające do dokończenia** (ust. 4).
- **Art. 359:** dopłaty do **masy sanacyjnej** lub zabezpieczenie w **2 miesiące** od uchwały (przedłużalne) (ust. 1); uzupełnienie w **30 dni**; dłużnik lub zarządca może wykazać inne źródła finansowania (ust. 2); sędzia-komisarz stwierdza wystarczające środki i wyznacza **zgromadzenie** — układ nie może odbiegać od uchwały nabywców, inaczej **odmowa zatwierdzenia** (ust. 3); dopłaty na **odrębnym rachunku** (ust. 4); bezskuteczny upływ — nowe propozycje w **30 dni**, bez dopłat nabywców (ust. 5).
- **Art. 360:** prawomocne **umorzenie sanacji** lub **odmowa zatwierdzenia** → **zwrot dopłat** z odsetkami z rachunku; zabezpieczenia wygasają (ust. 1); przy **uproszczonym wniosku o upadłość** (art. 334) — wstrzymanie zwrotu; po ogłoszeniu upadłości — dopłaty do **syndyka** (ust. 2); przechowywane dopłaty **wolne od egzekucji** przeciw dłużnikowi (ust. 3).
- **Art. 361:** **zgoda wierzyciela hipotecznego** z art. 25 ust. 1 pkt 1–2 ustawy o ochronie nabywcy (lub zobowiązanie z art. 76 ust. 4 zd. 2 ustawy o KW i hipotece) **pozostaje w mocy**; warunek zapłaty nabywcy spełnia zapłata **do rąk zarządcy**.

## C. Emitenci obligacji (art. 362–367)

- **Art. 362:** dział dotyczy **emitenta obligacji** (ust. 1); nie dotyczy **obligacji przychodowych** z odpowiedzialnością ograniczoną do przychodów / majątku przedsięwzięcia — środki na ich zaspokojenie poza masą, roszczenia **nie są objęte układem** (ust. 2); **PZU niedopuszczalne**, poza układem częściowym bez wierzytelności z obligacji (ust. 3).
- **Art. 363:** sąd ustanawia **kuratora obligatariuszy** (może nim być bank-reprezentant); obligatariusze osobiście po **dopuszczeniu przez sędziego-komisarza** (ust. 1); przy **hipotece** — prawa obligatariuszy zabezpieczonych wykonuje **administrator hipoteki** (art. 31 ust. 4 ustawy o obligacjach) (ust. 2).
- **Art. 364:** do kuratora: art. 68 ust. 4 (odpowiedzialność), 69–71 (wynagrodzenie, VAT, koszty) i przepisy o sprawozdaniach nadzorcy sądowego.
- **Art. 365:** informacje od dłużnika, nadzorcy, zarządcy (ust. 1); wgląd w księgi (ust. 2); głos na zgromadzeniu tylko w sprawach praw obligatariuszy (ust. 3).
- **Art. 366:** nadzorca/zarządca umieszcza obligatariuszy w spisie **łącznie**: nominał wymagalny przed otwarciem z odsetkami (pkt 1) oraz obligacje i odsetki płatne później (pkt 2) (ust. 1); wymienia składniki zabezpieczenia i kwotę **prawdopodobnego niedoboru** (ust. 2).
- **Art. 367:** kurator głosuje sumą wierzytelności objętych układem; liczba głosów = suma / (suma innych wierzytelności uprawnionych ÷ liczba ich wierzycieli) (ust. 1); głosujący osobiście obligatariusze **pomniejszają** siłę i liczbę głosów kuratora (ust. 2).
- **Dział III (art. 368–398):** uchylony — nie stosuj jako prawa bieżącego; banki, SKOK i inne instytucje finansowe są wyłączone z ustawy (art. 4 ust. 2).

## D. Przepisy karne (art. 399–400)

- **Art. 399:** dłużnik lub osoba uprawniona do reprezentacji, która **dostarcza nadzorcy, zarządcy lub sędziemu-komisarzowi nieprawdziwych informacji** w celu wykorzystania w postępowaniu, **zataja informacje istotne** albo **nie udostępnia danych lub dokumentów** potrzebnych do obowiązków informacyjnych spółki publicznej (art. 56 ust. 1 pkt 2 lub ust. 7, art. 70 ustawy o ofercie publicznej; art. 17 ust. 1–2, 19 ust. 3 MAR) — **pozbawienie wolności do lat 3**.
  - **Kwalifikator:** art. 399 ustawy z dnia 15 maja 2015 r. — Prawo restrukturyzacyjne (t.j. Dz.U. 2026 poz. 533); **występek** (art. 7 § 3 KK — zagrożenie karą pozbawienia wolności przekraczającą miesiąc; nie zbrodnia, bo brak dolnej granicy ≥ 3 lata — art. 7 § 2 KK); podmiot **indywidualny** (dłużnik / reprezentant). Pouczenie z art. 36 ust. 3 i klauzula z art. 203 ust. 1 dokumentują świadomość.
- **Art. 400:** dłużnik lub reprezentant, który **nie wydaje zarządcy ksiąg rachunkowych lub innych dokumentów** dotyczących majątku — **pozbawienie wolności od 3 miesięcy do lat 5**.
  - **Kwalifikator:** art. 400 ustawy — Prawo restrukturyzacyjne; **występek** (art. 7 § 3 KK; dolna granica 3 miesiące < 3 lata); podmiot indywidualny; ma zastosowanie, gdy ustanowiono zarządcę (sanacja, art. 291 ust. 1; odebranie zarządu w PPU/PU).
  - Zbieg z przestępstwami KK (m.in. rozdział o przestępstwach przeciwko obrotowi gospodarczemu) — analiza w DR-03 z odczytem przepisów KK z ELI.

## E. Przepisy przejściowe i końcowe (art. 448–456)

- **Art. 401–447:** przepisy zmieniające inne ustawy — **pominięte w t.j.**; dla ich skutków ustal brzmienie zmienianej ustawy.
- **Art. 448:** przepisy o skutkach wszczęcia postępowania co do osoby, majątku i zobowiązań stosuje się także do **zdarzeń sprzed wejścia w życie** ustawy.
- **Art. 449:** wnioski o upadłość złożone **przed** wejściem w życie — przepisy dotychczasowe.
- **Art. 450:** wnioski o **zmianę lub uchylenie układu** złożone przed wejściem w życie, bez postanowienia — przepisy dotychczasowe.
- **Art. 451:** oświadczenie o otwarciu **postępowania naprawczego** złożone wcześniej — przepisy dotychczasowe.
- **Art. 452:** wnioski o **zakaz prowadzenia działalności** złożone wcześniej — przepisy dotychczasowe, ale zakaz **1–10 lat** (ust. 1); wnioski późniejsze — ocena działań/zaniechań z art. 373–374 (w brzmieniu nadanym ustawą zmienianą w art. 428 — PrUp) według prawa z dnia ich wystąpienia (ust. 2); przy działaniach przed i po — nowe brzmienie (ust. 3).
- **Art. 453:** **licencja syndyka** staje się **licencją doradcy restrukturyzacyjnego** (ust. 1); nierozpatrzone wnioski licencyjne — przepisy w nowym brzmieniu (ust. 2); egzamin na syndyka uprawnia do ubiegania się o licencję doradcy (ust. 3).
- **Art. 454:** likwidatorzy z art. 116b Ordynacji podatkowej **nie odpowiadają** za zaległości podatkowe i składkowe powstałe przed wejściem w życie ustawy.
- **Art. 455:** do utworzenia **Rejestru** obwieszczenia w **MSiG**; w upadłości konsumenckiej bez opłat; obwieszczać mogły też organy (ust. 1); wykładanie w sekretariacie, termin od wyłożenia (ust. 2); pisma papierowe (ust. 3).
- **Art. 456:** wejście w życie **1 stycznia 2016 r.**, z wyjątkami: art. 5 — 26.06.2018 (pkt 1), art. 148–149 — 01.09.2015 (pkt 2), art. 428 pkt 138 co do art. 227 — 14 dni od ogłoszenia (ustawa ogłoszona 14.07.2015) (pkt 3).
- Przepisy przejściowe późniejszych nowelizacji (m.in. DU/2025/1085, DU/2025/1170) → `mod-PrRestr-zrodla-i-wersje`.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≥ 20% nabywców; 30 dni od otwarcia | propozycje układowe nabywców | art. 353 |
| 2 miesiące + 30 dni | dopłaty i ich uzupełnienie | art. 359 ust. 1–2 |
| 30 dni | nowe propozycje po bezskutecznym upływie terminów | art. 359 ust. 5 |
| do 3 lat | kara — art. 399 | art. 399 |
| 3 mies. – 5 lat | kara — art. 400 | art. 400 |
| 1–10 lat | zakaz działalności w sprawach przejściowych | art. 452 ust. 1 |
| 01.01.2016 | wejście w życie ustawy | art. 456 |

## PUŁAPKI

- Jurysdykcja wyłączna tylko przy COMI w PL (342 ust. 1); przy rozp. 2015/848 jego reguły mają pierwszeństwo (338).
- Brak pełnomocnika do doręczeń = doręczenie przez pozostawienie w aktach (340 ust. 2) — dotyczy wierzycieli spoza UE.
- Deweloper i emitent obligacji: PZU wyłączone, poza wąsko określonym układem częściowym (351, 362 ust. 3).
- Głos nabywcy z zobowiązaniem do dopłaty = tytuł egzekucyjny (357) — ostrzeż klienta-nabywcę przed głosowaniem.
- Zgromadzenie nie może przyjąć układu sprzecznego z uchwałą nabywców (359 ust. 3).
- Dopłaty wracają z odsetkami przy umorzeniu sanacji / odmowie, chyba że złożono uproszczony wniosek o upadłość (360).
- Obligatariusze zabezpieczeni hipoteką działają przez administratora hipoteki, nie kuratora (363 ust. 2); nie licz podwójnie głosów kuratora i obligatariuszy (367 ust. 2).
- Przestępstwa z art. 399–400 to występki z podmiotem indywidualnym; samo błędne ujęcie pozycji w spisie nie wyczerpuje znamion bez nieprawdziwej informacji dostarczonej organowi w celu wykorzystania w postępowaniu.
- Nie stosuj uchylonych art. 368–398 ani pominiętych 401–447 jako prawa bieżącego PrRestr.

## POWIĄZANIA

- Postanowienie o otwarciu / zatwierdzeniu — jurysdykcja (art. 223, 233) → `mod-PrRestr-pzu`, `mod-PrRestr-ppu-pu`
- Sanacja, zezwolenie z art. 288 ust. 3, art. 291 → `mod-PrRestr-sanacja`
- Uproszczony wniosek (art. 334) → `mod-PrRestr-procedura-zakonczenie`
- Kurator (art. 68–71), pouczenie z art. 36 ust. 3 → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`, `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- Układ, art. 162, układ częściowy → `mod-PrRestr-dzial-VI-uklad`, `mod-PrRestr-dzial-VII-uklad-czesciowy`
- Upadłość dewelopera (art. 425a–425s PrUp), postępowanie międzynarodowe PrUp → `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne`
- Emitenci obligacji w upadłości (art. 483–491 PrUp) → `mod-PrUpad-postepowania-odrebne-426-491-38`
- Zakaz działalności (art. 373–377 PrUp) → `mod-PrUpad-zakonczenie-zakaz-karne`
- Wersje, nowelizacje, korpus źródłowy → `mod-PrRestr-zrodla-i-wersje`

## WYNIK

Element zagraniczny: instrument (338) → jurysdykcja i charakter postępowania (342) → prawa i doręczenia wierzycieli zagranicznych (339–340) → współpraca (345–348). Deweloper: wyłączenie PZU (351) → propozycje nabywców w 30 dni (353–355) → grupa nabywców (356) → w sanacji wstępne głosowanie i dopłaty (358–359) → rozliczenie dopłat (360). Emitent: kurator / administrator (363) → spis łączny (366) → głosy kuratora (367). Ryzyko karne z kwalifikatorem (399–400) → DR-03. Sprawy historyczne — przepisy przejściowe (448–455).

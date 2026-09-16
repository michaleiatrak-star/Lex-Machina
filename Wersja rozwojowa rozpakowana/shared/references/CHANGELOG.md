# CHANGELOG — Biblioteka shared

## 3.62 — 2026-09-16 — F-189

- terminy.md — (1) KRO: dopisane terminy macierzyństwa art. 61¹¹, 61¹³ § 1–2, 61¹⁴ § 1 (ROK; ✅ RZĄD 1 Dz.U. 2026 poz. 236) i ostrzeżenie o błędzie „6 miesięcy/3 lata”; (2) KP: zakres nowelizacji poz. 1046 poprawiony z odczytu treści (art. 11 nie jest zmieniany). Pole YAML `changelog:` skrócone do odesłania (T12).
## 3.61 — 2026-09-14 — CBOSA retrieval/snapshot jako jawny kanał provenance

- V-SYG-0.5 ma obowiązkowy POST-CHECK HOSTA przed exact-match; `site:`
  jest tylko discovery i nie gwarantuje domeny.
- Snapshot oficjalnego `/doc/{ID}` może mieć zakres `METADATA_SENTENCE`,
  `...REASONING_PARTIAL` lub `...REASONING_FULL`; nie redukuj go automatycznie
  do samego snippetu/ISTNIENIA.
- Pomiar 10 realnych sygnatur: 10/10 metryka+sentencja, 5/10 pełne
  uzasadnienie, 2/10 uzasadnienie bez pewności kompletności, 3/10 bez
  potwierdzonego uzasadnienia.
- `access_mode=CRAWLED_OR_INDEXED` jest provenance, NIE piątym statusem.
  `WERYFIKACJA-SLAD.md` 1.7 utrzymuje zamknięte statusy ✅/⚠️.
- Pełna treść snapshotu nie dowodzi `DIRECT_LIVE`; 500/502/503 originu może
  współistnieć z bogatą kopią crawlera.


## 3.60 — 2026-09-14 — kanoniczny direct CBOSA / RZĄD 2A

- Dodano `shared/CBOSA-ADAPTER.md` jako SSOT kontraktu HTTP dla NSA/WSA.
- `HIERARCHIA-ZRODEL.md` 1.8: CBOSA jawnie RZĄD 2A; routing źródłowy
  SN / Portal Orzeczeń / CBOSA / SAOS.
- `SYGNATURY.md` 1.5: V-SYG-0.7 DIRECT-CBOSA przed V-SYG-0.5 fallback.
- `DOSTEP-MASZYNOWY-API.md` 1.5: fresh-probe, formularz, cookies,
  paginacja, /doc/{ID}, exact-match i fail-closed.
- `PRAWO-HARDGATE-ORZECZENIA.md`: override NSA/WSA wymusza direct CBOSA
  po braku MCP, przed ogólnym web_search.
- `MCP-INTEGRACJA.md`: brak mcp-nsa nie obniża systemu do luźnego web_search;
  stosowany jest natywny adapter HTML.
- `KONEKTORY-REKOMENDOWANE.md`: mcp-nsa = MCP-FIRST, direct adapter = fallback
  deterministyczny.
- Implementacja referencyjna `orzeczenia-sadowe-v2` przeszła 22/22 testów
  regresyjnych po hardeningu.
- Reguła 7: shared i orzeczenia-sadowe-v2 wydawane jako kompletne paczki ZIP.


- 3.59 (2026-09-12q, PODZIAL): **TABELE-OPLAT 2.0 — rdzen i siedem satelitow.** Plik mial 1555 linii (47 % ponad prog CRIT, wykryte w 12p po rozszerzeniu T13). Rdzen `TABELE-OPLAT.md` (159 linii) trzyma wylacznie REGULE KOLEJNOSCI, MAPE WLASNOSCI SEKCJI i rejestry (sekcja 7 - tabele satelickie w innych skillach, sekcja 8 - zakres nieobjety). Materia w `shared/oplaty/`: 01-KSCU-cywilne-rodzinne-pracownicze (sekcje 1, 1a, 1b, 1c), 02-zwolnienia-zwrot-alimenty (2, 2a-2e), 03-koszty-zastepstwa-taksy (3, 3a), 04-wartosci-powtarzalne-kotwice (4, 4a-4g), 05-sprawy-karne (5, 6e), 06-administracyjne-wieczystoksiegowe-KIO (6, 6a), 07-komornicze-skarbowe-notarialne (6b, 6c, 6d). ⛔ ZABEZPIECZENIE ANTYREGRESYJNE: kazda sekcja ma DOKLADNIE JEDNEGO wlasciciela wskazanego w mapie, kazdy satelita niesie stopke "Plik satelicki - NIE JEST ZRODLEM SAMODZIELNYM" z zakazem duplikacji, a calosci pilnuje nowy test T29 (check_oplaty_mapa.py, cztery bramki, selftest 5/5). Kontrola integralnosci podzialu: z 1236 niepustych linii oryginalu w nowym zestawie brakuje 78, z czego 72 to pozycje starego spisu tresci i 6 linii jego ramki - ZERO utraty tresci merytorycznej. Wszystkie 7 satelitow zarejestrowanych w tabeli zasobow SKILL.md
- 3.58 (2026-09-12p, nawigacja zasobow kanonicznych): TABELE-OPLAT.md (1472 linie, 72 pozycje) i terminy.md (13 rezimow, 22 pozycje) dostaly SPIS TRESCI. Powod: oba pliki sa CELOWO niedzielone - podzial odtworzylby rozproszenie, przed ktorym broni sekcja 7 TABELE-OPLAT - ale przy tej objetosci problemem staje sie odnalezienie sekcji, nie sama dlugosc. We wstepie do spisu terminy.md ostrzezenie, ze ta sama czynnosc (zazalenie, wniosek o uzasadnienie, przywrocenie terminu) ma INNY termin w KPC, KPA, Op i KKW - spis ma sluzyc weryfikacji rezimu, nie tylko skakaniu po pliku. Poprawiony poziom naglowka UPEA (### -> ##): egzekucja administracyjna byla zagniezdzona pod KPA, choc to odrebny rezim z wlasna ustawa
- 3.57 (2026-09-12o, rodzina TERMINY c.d.): terminy.md - dopisane PRAWO CYWILNE MATERIALNE (KC Dz.U. 2026 poz. 795, odczyt tresci); dotad KC mial w pliku TRZY wiersze. Przedawnienie ogolne art. 118 z pulapka "koniec terminu przypada na OSTATNI DZIEN ROKU KALENDARZOWEGO, chyba ze termin jest krotszy niz dwa lata" - liczenie dzien po dniu daje date wczesniejsza niz rzeczywista. Art. 119 (zakaz modyfikacji czynnoscia prawna) i art. 120 par. 1 zd. 2 (bieg od dnia, w ktorym roszczenie STALOBY SIE wymagalne przy najwczesniejszej mozliwej czynnosci). Pelny art. 442[1]: 3 lata od dowiedzenia sie, 10 lat granica, ⛔ 20 LAT przy zbrodni lub wystepku liczone OD CZYNU niezaleznie od wiedzy, ⛔ przy szkodzie NA OSOBIE granica 10 lat NIE OBOWIAZUJE (par. 3), maloletni +2 lata od pelnoletnosci (par. 4). Terminy zawite: rekojmia 2/5 lat (art. 568 par. 1) i rok od stwierdzenia wady z ochrona konsumenta (par. 2), zawieszenie z par. 4, akt starannosci miedzy przedsiebiorcami (art. 563 par. 1), blad i grozba rok (art. 88 par. 2), ⛔ roszczenie posesoryjne WYGASA po roku, nie przedawnia sie (art. 344 par. 2), umowa przedwstepna rok (art. 390 par. 3), skarga paulianska 5 lat (art. 534), zasiedzenie 20/30 lat (art. 172) z ochrona maloletniego wlasciciela (art. 173)
- 3.56 (2026-09-12n, rodzina TERMINY c.d.): terminy.md - dopisane PRAWO PRACY (KP Dz.U. 2025 poz. 277, odczyt tresci), 13 pozycji; dotad KP mial w pliku DWA wiersze. Kluczowe: art. 264 par. 1-3 (21 dni, trzy rozne punkty poczatkowe), art. 265 par. 2 (7 dni), przedawnienia z art. 291 par. 1, 2 i 5 (3 lata / rok i 3 lata / 10 lat). ⛔ Dopisane oznaczenie GRANIC DLA PRACODAWCY: art. 52 par. 2 (miesiac od uzyskania wiadomosci) i art. 109 par. 1 (2 tygodnie / 3 miesiace) to zarzuty obrony, nie terminy pracownika. ⭐ art. 112 par. 1 zd. 3 - nieodrzucenie sprzeciwu od kary porzadkowej w 14 dni JEST ROWNOZNACZNE Z UWZGLEDNIENIEM; milczenie pracodawcy konczy sprawe po mysli pracownika. KROK 2C: Dz.U. 2026 poz. 1046 (w zycie 5.11.2026) nie dotyka tych przepisow
- 3.55 (2026-09-12m, rodzina TERMINY ZAMKNIETA): terminy.md - dopisane ZASKARZANIE UCHWAL SPOLEK (KSH Dz.U. 2024 poz. 18, odczyt tresci): szesc wierszy obejmujacych cztery rezimy - sp. z o.o. uchylenie (art. 251) i niewaznosc (art. 252 par. 3, granica 3 LATA), S.A. niepubliczna uchylenie (art. 424 par. 1) i niewaznosc (art. 425 par. 2, granica 2 LATA), S.A. publiczna uchylenie (art. 424 par. 2, granica 3 MIESIACE) i niewaznosc (art. 425 par. 3, 30 DNI OD OGLOSZENIA / rok). ⭐ Dopisane art. 252 par. 4 i art. 425 par. 4 - uplyw terminow nie wylacza ZARZUTU niewaznosci. KROK 2C: Dz.U. 2026 poz. 176 (w zycie 18.02.2027) nie dotyka tych przepisow. Tym wpisem rodzina TERMINY jest zamknieta co do rezimow: KPC, KPK, KPW, KPA, PPSA, UPEA, Op, KKW, KRO, PrUp/PrRestr, KSH
- 3.54 (2026-09-12l, rodzina TERMINY c.d.): terminy.md - dopisana UPADLOSC I RESTRUKTURYZACJA (PrUp Dz.U. 2026 poz. 913, PrRestr Dz.U. 2026 poz. 533, odczyt tresci): 30-dniowy OBOWIAZEK dluznika z art. 21 ust. 1 i wariant przy zarzadzie sukcesyjnym (ust. 2a), 30 dni na zgloszenie wierzytelnosci od obwieszczenia w Rejestrze (art. 51 ust. 1 pkt 4 w zw. z art. 236 ust. 1), dwa tygodnie na sprzeciw co do spisu (art. 91 ust. 1-2 PrRestr). ⛔ Dopisane rozroznienie: 3 miesiace z art. 11 ust. 1a i 24 miesiace z art. 11 ust. 2 to NIE TERMINY, tylko domniemanie i samodzielna podstawa niewyplacalnosci - one OTWIERAJA 30-dniowy obowiazek, a nie go zastepuja. ⛔ Adresat zgloszenia to SYNDYK i system teleinformatyczny, nie sedzia-komisarz. TABELE-OPLAT 1.8: nowa sekcja 4g - TRZECIA KOTWICA, przecietne wynagrodzenie w sektorze przedsiebiorstw bez wyplat nagrod z zysku w III kwartale roku poprzedniego (art. 235 ust. 1 PrUp, 15 %); GUS publikuje CZTERY rozne "przecietne wynagrodzenia" i przepis wskazuje jeden konkretny
- 3.53 (2026-09-12k, rodzina TERMINY c.d.): terminy.md - dopisane POCHODZENIE DZIECKA (KRO, Dz.U. 2026 poz. 236, odczyt tresci): zaprzeczenie ojcostwa - maz matki, matka i dziecko po ROKU od dowiedzenia sie (art. 63, 69 par. 1, 70 par. 1), bezskutecznosc uznania - art. 78 par. 1, 79, 81 par. 2, warianty z art. 64-65 przy ubezwlasnowolnieniu i chorobie psychicznej, granice powodztwa prokuratora z art. 86. ⛔ Odnotowane jako NIEPRAWDZIWE dwa terminy krazace w obiegu: matka "6 miesiecy od urodzenia" i dziecko "3 lata od pelnoletnosci" - ten drugi zawyza trzykrotnie. ⛔ Zasada przewodnia sekcji: wszystkie terminy biegna OD DOWIEDZENIA SIE, nie od urodzenia dziecka (reforma 2019)
- 3.52 (2026-09-12j, rodzina TERMINY c.d.): terminy.md - dopisane POSTEPOWANIE WYKONAWCZE KARNE (KKW, Dz.U. 2025 poz. 911, odczyt tresci): skarga skazanego 7 dni od dowiedzenia sie o zdarzeniu (art. 6 par. 4), skarga na decyzje 7 dni (art. 7 par. 3), zazalenie ws. warunkowego zwolnienia rozpoznawane w 14 dni (art. 162 par. 2), KARENCJE 6 miesiecy / 1 rok na ponowny wniosek o warunkowe zwolnienie (art. 161 par. 3-4) i 1 rok na kolejna przerwe (art. 153 par. 3), odroczenie do roku i do 3 lat po urodzeniu dziecka (art. 151 par. 1), raty grzywny do roku albo do 3 lat (art. 49). ⛔ Dopisane rozroznienie KARENCJA vs TERMIN ZAWITY: wniosek przedwczesny nie jest odrzucany, tylko nierozpoznawany do uplywu okresu. Odnotowane uchylenie art. 152 KKW
- 3.51 (2026-09-12i, rodzina TERMINY c.d.): terminy.md - dopisane POSTEPOWANIE PODATKOWE (Ordynacja podatkowa, Dz.U. 2026 poz. 622, odczyt tresci): odwolanie 14 dni (art. 223 par. 2, nie par. 1), zazalenie 7 dni (art. 236 par. 2), przywrocenie terminu 7 dni (art. 162 par. 2) z zakazem z par. 3, wznowienie 1 miesiac w dwoch wariantach (art. 241 par. 2 pkt 1-2), art. 68 par. 1-2 (3/5 lat, NIEPOWSTANIE zobowiazania) i art. 70 par. 1 (5 lat, PRZEDAWNIENIE) z ostrzezeniem, ze to dwie rozne instytucje, oraz zawieszenie i przerwanie z art. 70 par. 2-6. ⛔ Odnotowany KROK 2C: piec ustaw zmieniajacych oglszonych po t.j., trzy wchodza w zycie w ciagu trzech tygodni od sesji
- 3.50 (2026-09-12h, rodzina TERMINY c.d.): terminy.md - dopisana EGZEKUCJA ADMINISTRACYJNA (UPEA, Dz.U. 2026 poz. 268, odczyt tresci): 7 dni po doreczeniu upomnienia przed wszczeciem (art. 15 par. 1 zd. 2), ⛔ BRAK terminu zarzutu biegnacego od doreczenia TW - art. 33 par. 5 podaje wylacznie terminy koncowe (30 dni od wyegzekwowania, do dnia wykonania obowiazku, 7 dni od postanowienia o umorzeniu), skarga na czynnosc egzekucyjna 7 dni (art. 54 par. 3). Dopisane rozroznienie ZARZUT vs SKARGA: katalog art. 33 par. 2 jest ZAMKNIETY i ma 6 pozycji, a "zbyt uciazliwy srodek egzekucyjny" jest podstawa SKARGI z art. 54 par. 1 pkt 2, nie zarzutu
- 3.49 (2026-09-12g, rodzina TERMINY c.d.): terminy.md - obsadzone POSTEPOWANIE ADMINISTRACYJNE I SADOWOADMINISTRACYJNE, ktore mialy dotad po JEDNYM wierszu. Z odczytu tresci KPA (Dz.U. 2025 poz. 1691) i PPSA (Dz.U. 2026 poz. 143): KPA - odwolanie 14 dni (art. 129 par. 1-2, wnoszone ZA POSREDNICTWEM organu), zazalenie 7 dni (art. 141 par. 2), uzupelnienie decyzji 14 dni (art. 111 par. 1), przywrocenie terminu 7 dni z obowiazkiem rownoczesnego dopelnienia czynnosci i ZAKAZEM przywracania terminu do samej prosby (art. 58 par. 2-3), wznowienie 1 miesiac (art. 148), wniosek o ponowne rozpatrzenie (art. 127 par. 3), terminy ORGANU z art. 35 par. 2-3a wraz z art. 35 par. 5 (czego NIE wlicza sie do terminu) i art. 130 par. 2 (odwolanie wstrzymuje wykonanie). PPSA - skarga 30 dni (art. 53 par. 1-2), skarga W KAZDYM CZASIE na inne akty (par. 2a) i na bezczynnosc po ponagleniu (par. 2b), 6 miesiecy dla prokuratora/RPO/RPD (par. 3), sprzeciw od decyzji 14 dni (art. 64c par. 1), wniosek o uzasadnienie 7 dni TYLKO przy oddaleniu skargi (art. 141 par. 2 - przy uwzglednieniu uzasadnienie z urzedu, par. 1), skarga kasacyjna 30 dni (art. 177 par. 1), zazalenie 7 dni (art. 194 par. 2), przywrocenie terminu 7 dni z granica roku (art. 87), wznowienie 3 miesiace i granica 5 lat (art. 277-278). ⛔ Odnotowane: art. 52 par. 3 PPSA czyni wniosek o ponowne rozpatrzenie FAKULTATYWNYM, art. 52 par. 4 UCHYLONY, "wezwanie do usuniecia naruszenia prawa" zniknelo z procedury w 2017 r.; prawo pomocy z art. 243-262 PPSA to ODREBNY rezim, nie art. 100-103 KSCU
- 3.48 (2026-09-12f, O-12): markery <!-- T28-OK: --> na liniach TABELE-OPLAT i terminy.md, ktore CYTUJA bledny zapis w celu ostrzezenia przed nim. Marker dziala w jednej linii i wymaga podania powodu; bez niego nowy test T28 zglaszalby wlasna dokumentacje naprawy. Tresc merytoryczna bez zmian
- 3.47 (2026-09-12e, O-11 rodzina WARTOSCI POWTARZALNE): TABELE-OPLAT 1.7 - sekcja 4 rozbudowana z 14 do ~190 linii, wszystko z odczytu tresci. 4a odsetki cywilne (art. 359 par. 2 KC: stopa referencyjna NBP + 3,5 p.p.; art. 481 par. 2: + 5,5 p.p.; maksymalne = dwukrotnosc, art. 359 par. 2[1] i 481 par. 2[1]; par. 2[3] - zakaz wylaczenia takze przy wyborze prawa obcego; kwota z OBWIESZCZENIA MS w Monitorze Polskim, art. 359 par. 4 i 481 par. 2[4] - NIE z rozporzadzenia RM, bo Dz.U. 2014 poz. 1858 jest uchylone i delegacja z art. 359 par. 3 tez). 4b transakcje handlowe (t.j. Dz.U. 2023 poz. 1790, nazwa ustawy zmieniona na "o przeciwdzialaniu nadmiernym opoznieniom"): + 10 p.p., a dla publicznego podmiotu leczniczego + 8 p.p. (art. 4 pkt 3); sztywna data odczytu stopy 1 stycznia / 1 lipca (art. 11b); rekompensata 40/70/100 EUR wg progow 5000 i 50 000 zl (art. 10 ust. 1), kurs z ostatniego dnia roboczego miesiaca poprzedzajacego wymagalnosc (ust. 1a), roszczenie NIEZBYWALNE (ust. 4). 4c odsetki za zwloke (art. 56 par. 1 OP: 200 % stopy LOMBARDOWEJ + 2 %, nie mniej niz 8 % - inna kotwica niz KC; 50 % art. 56a z warunkami lacznymi; 150 % art. 56b tylko VAT i akcyza) oraz ⛔ art. 23 ust. 1 SUS WYLACZA art. 56a - obnizona stawka NIE dziala do skladek ZUS; prog bagatelnosci 1 % minimalnego wynagrodzenia (ust. 1a). 4d stopy skladek (art. 22 ust. 1 SUS: 19,52 / 8,00 / 2,45 %, wypadkowa WIDELKOWA 0,40-8,12 %). 4e skala PIT (art. 27 ust. 1: 12 % minus 3600 zl do 120 000 zl, wyzej 10 800 zl + 32 %; kwota wolna 30 000 zl to WYNIK DZIALANIA, nie brzmienie przepisu). 4f minimalne wynagrodzenie jako kotwica innych progow. ⛔ DOKTRYNA SEKCJI: wartosci zakotwiczone w stopach NBP zapisujemy jako formule z przepisem, NIGDY jako procent - RPP zmienia stope bez nowelizacji, wiec kontrola aktualnosci aktu tego nie widzi
- 3.46 (2026-09-12d, O-11 rodzina TERMINY): terminy.md — CRIT: plik KANONICZNY powoływał **art. 503 § 1 KPC, który jest UCHYLONY** (odczyt treści Dz.U. 2026 poz. 468: art. 500-504 brzmią "(uchylony)"). Dopuszczalność sprzeciwu daje art. 505 § 1, tryb art. 480[3], a TERMIN art. 480[2] § 2 i jest różnicowany miejscem doręczenia: 2 tygodnie (upominawczy w kraju), miesiąc (upominawczy poza krajem w UE), MIESIĄC (NAKAZOWY przy doręczeniu w UE, więc także w Polsce), 3 miesiące (poza UE). Brakowało całego wiersza zarzutów od nakazu nakazowego. Poprawione też: wniosek o uzasadnienie w sprawach o wykroczenia "3 dni, art. 105 § 1 KPW" -> 7 dni zawite z art. 35 § 1 KPW (art. 105 reguluje apelację); apelacja wykroczeniowa art. 105 § 2 -> § 1; sprzeciw od wyroku nakazowego "art. 94 KPSW" -> art. 94 § 1 KPW w zw. z art. 506 § 1 KPK. Dopisane z odczytu: art. 344 § 1, 369 § 1[1] (3 tygodnie przy przedłużonym uzasadnieniu), 169 § 1, 767 § 4, 407 § 1, 398[5] § 1 KPC oraz art. 460, 506 § 1, 524 § 1 KPK. Nowa reguła: podstawa terminu rzadko stoi w przepisie o samej czynności. Propagacja w MOD-TIMING.md i orka-bas-leksykon
- 3.45 (2026-09-12c, O-11 c.d.): TABELE-OPLAT 1.6: sekcje 6a-6e z odczytu tresci. 6a wieczystoksiegowe (art. 42-48 KSCU: wpis 200 zl, udzial min. 100 zl, dziedziczenie/dzial spadku 150 zl, zalozenie KW 100 zl, wykreslenie polowa oplaty, kumulacja z art. 45, brak oplaty podstawowej z art. 14 ust. 5) i skarga na KIO (art. 34 - TROJKROTNOSC wpisu od odwolania, kwota z PZP nie z KSCU; art. 34a). 6b koszty komornicze (ustawa z 28.02.2018, t.j. Dz.U. 2024 poz. 377, zero nowelizacji po t.j.): 10 %/3 % art. 27, widelki 150-50 000 zl, minima 150/200/300 zl, umorzenie 5 %/10 %/100/150 zl ze zwolnieniami z art. 29 ust. 5, 10 % OD WIERZYCIELA przy niecelowym wszczeciu (art. 30), eksmisja 1500/2000/+1000 zl max 30 000 (art. 34), doreczenie 60 zl (art. 41 ust. 1 - domknieta podstawa wiersza, ktory od dawna nie mial aktu), poszukiwanie majatku 100 zl, obnizenie art. 48, art. 45 vs art. 47. 6c oplata skarbowa (t.j. Dz.U. 2025 poz. 1154): pelnomocnictwo 17 zl OD KAZDEGO STOSUNKU, zaswiadczenia 17/21 zl, art. 2 ust. 1 wylacza cale kategorie spraw. 6d taksa notarialna (t.j. Dz.U. 2024 poz. 1566): stawki MAKSYMALNE - odwrotna logika niz taksy adwokacka i radcowska. 6e koszty procesu karnego (KPK t.j. Dz.U. 2026 poz. 490, art. 616-632a) - ⛔ ZRYCZALTOWANA ROWNOWARTOSC WYDATKOW PRZY OSKARZENIU PRYWATNYM PODNIESIONA Z 300 ZL NA 1000 ZL od 1.07.2025 (Dz.U. 2025 poz. 770, ktore uchylilo akt z 2003 r.)
- 3.44 (2026-09-12b, O-11 c.d.): TABELE-OPLAT 1.5: sekcja 2c ZWROT OPLATY (art. 79 KSCU - cala/3-4/polowa, w tym zwrot polowy oplaty od pozwu o rozwod przy orzeczeniu bez orzekania o winie na zgodny wniosek i zwrot calosci przy pojednaniu, art. 79 ust. 2; potracenie oplaty minimalnej z ust. 3), sekcja 2d DALSZE ZWOLNIENIA (art. 104 organizacje, art. 105-107 tryb wniosku, art. 106 prekluzja wieczystoksiegowa, art. 107 zakaz ponowienia) oraz ART. 104a - w EPU i w trybie S24 NIE STOSUJE SIE art. 100-103, 104 ust. 2 i 105, czyli nie ma zwolnienia na wniosek; sekcja 2e os ryzyka kosztowego z KPC (art. 98, 100, 101, 102 zasada slusznosci, 103, 105-107, 520) z ostrzezeniem o zbieznosci numeracji art. 102 KPC i art. 102 KSCU
- 3.43 (2026-09-12, O-11 c.d.): TABELE-OPLAT 1.4: domkniecie centralizacji oplat. Z ODCZYTU TRESCI dopisane: sekcja 1a rejestr oplat cywilnych ogolnych (art. 14 oplata podstawowa 30 zl, art. 15 oplata tymczasowa 30-2000 zl, art. 18 ust. 2 apelacja wg tabeli od pozwu, art. 19-20 ulamki z konsumenckim capem 750 zl przy zarzutach, art. 25 skarga na komornika 50 zl, art. 25b 100/30 zl, art. 68-71, art. 77-78 oplata kancelaryjna 20 zl/10 stron, art. 13a-13f w tym premia mediacyjna z art. 13e), sekcja 1b rozwod i sprawy rodzinne (art. 26 ust. 1 pkt 1 - 600 zl, art. 26 ust. 2 oplata powstajaca dopiero w wyroku, art. 27, art. 37, art. 38), sekcja 1c prawo pracy i ubezpieczenia (art. 35, 36, 96 ust. 1 pkt 4/8/14), sekcja 3a stawki pelnomocnika z par. 9, 10, 11 i 17 obu taks, sekcja 5 oplaty karne (ustawa z 23.06.1973, Dz.U. 2023 poz. 123, art. 1-21) z pulapka dwoch brzmien art. 2 ust. 1 pkt 6, sekcja 6 wpis sadowoadministracyjny (Dz.U. 2021 poz. 535), sekcja 7 REJESTR TABEL SATELICKICH. OBALONE w tresci aktu: "art. 27 pkt 1-6 KSCU" jako podstawa progow WPS (art. 27 to oplata stala 200 zl od enumerowanych pozwow), cap 20 000 zl w sprawach gospodarczych, oplata pracownicza "5% WPS max 1000 zl", oplata od pozwu pracowniczego "5% nadwyzki ponad 50 000 zl" (art. 35 ust. 1 zd. 2 dotyczy APELACJI), wpis WSA 200/500/1000/2000, stawka pracownicza 180 zl (jest 360 zl), apelacja karna 420 zl (jest 840/1200 zl), oplata kancelaryjna cywilna 6 zl za strone (6 zl za strone to art. 19 ustawy karnej)
- 3.42 (2026-09-10w, O-11): TABELE-OPLAT 1.3: PELNY KATALOG ZWOLNIEN z odczytu tresci KSCU art. 94-103 - 18 kategorii podmiotowych (art. 96 ust. 1), zwolnienia przedmiotowe (art. 95, w tym zazalenia i skargi dotyczace samych kosztow), Skarb Panstwa (art. 94) i zwolnienie na wniosek (art. 100-103, z pulapka art. 102 ust. 4). Do reguly kolejnosci dopisany KROK 0
- 3.41 (2026-09-10v, O-11): TABELE-OPLAT 1.2: tabele obu taks z ODCZYTU TRESCI - stawki od WPS (par. 2, 90-25 000 zl), odrebna nizsza tabela dla postepowan upominawczych i nakazowych (par. 3), oraz stawki rodzinne niezalezne od WPS (alimenty 240 zl, rozwod 720 zl, ojcostwo 480 zl, podzial majatku od wartosci udzialu)
- 3.40 (2026-09-10u, O-11): TABELE-OPLAT 1.1: art. 22 KPC (WPS = suma swiadczen za rok) i art. 21 KPC (zliczanie roszczen) zweryfikowane ODCZYTEM TRESCI; nowa sekcja 2a - wysokosc alimentow wg art. 135 KRO par. 1-3 oraz tabela przeslanek art. 128-140
- 3.39 (2026-09-10t, O-11): nowy TABELE-OPLAT.md: kolejnosc siegania po kwoty (tabela ustanawiajaca -> baza katalogujaca -> RZAD 2A/2B) + zweryfikowane odczytem TRESCI tabele KSCU art. 13/22/96, taksy 2026/215 i 2026/118, minimalne wynagrodzenie
- 3.38 (2026-09-10s, F-135): orka-bas czesc-05: BLEDNA KWOTA minimalnego wynagrodzenia 2026 (~4 750 zl) skorygowana na 4 806 zl - potwierdzone odczytem tresci rozp. RM Dz.U. 2025 poz. 1242
- 3.34 (2026-09-10l, F-181): trzy przeterminowane podstawy: ustawa rehabilitacyjna 2024/44 → 2026/884; w orka-bas działalność lecznicza 2024/799 → 2026/156, UFP 2024/1530 → 2025/1483, Ordynacja 2025/111 → 2026/622 (2 miejsca)
- 3.31 — **KROK 2C: gdzie szukać nowelizacji po t.j. + zakaz przepisywania wyniku**
  (2026-09-01k, flaga F-156). Nowa tabela adresów: sekcja „Nowelizacje po tekście
  jednolitym" w `/references` obwieszczenia, kontrola uzupełniająca aktami
  zmieniającymi aktu bazowego (sekcja bywa właściwym podzbiorem — pomiar F-155:
  16/19 zgodnych, 3/19 niepełnych, 0 rozbieżności odwrotnych), dojście od t.j. do
  aktu bazowego przez „Tekst jednolity dla aktu" (⛔ nie przez wyszukiwanie po
  tytule), bramka F-153 i test T24. ⛔⛔ Dopisany zakaz przenoszenia wyniku do map
  i modułów — również w formie samego znacznika bez liczby, bo **oznaczenie przy
  jednych pozycjach twierdzi coś o pozostałych**: wiersz bez znacznika czyta się
  jako „tu t.j. wystarczy", czyli jako zdanie o stanie rejestru na dzień oznaczania.
- 3.30 — aktualizacja podstawy w `mod-niepelnosprawnosc-intelektualna-gluchota.md`
  (2026-09-01i, flaga F-155): ustawa o świadczeniu wspierającym cytowana była przez
  akt pierwotny Dz.U. 2023 poz. 1429; obowiązuje t.j. **Dz.U. 2026 poz. 873**
  ✅ [VER: api.sejm.gov.pl/eli, 2026-09-01]. Poprawione w dwóch miejscach (podstawa
  i wskazanie źródła do fresh gate); numer pierwotny zachowany w nawiasie.
- 3.29 — **ŚCIEŻKA B-L: odczyt aktu prawa miejscowego** (2026-09-01g, flaga F-154).
  Sekwencja B-T1…B-T3 do aktów lokalnych nie pasuje — nie mają ELI, nie mają tekstu
  jednolitego i nie mają jednolitego wzorca adresu serwisu wojewódzkiego. Nowa
  ścieżka: portal zbiorczy → identyfikacja `Dz.Urz. Woj. {nazwa} {rok} poz. {N}` →
  treść wyłącznie z pliku w dzienniku (BIP pomocniczy, nie publikator) → kontrola
  uchylenia, rozstrzygnięcia nadzorczego wojewody i orzeczenia WSA. ⛔ Zapisano, że
  skonsolidowanego tekstu aktu lokalnego zwykle NIE MA, a rekonstrukcji z aktu
  pierwotnego i uchwał zmieniających nie wolno przedstawiać jako tekstu urzędowego.
  **Korekta v1.6:** podany tam szablon `edziennik.{województwo}.uw.gov.pl` jest
  NIEPRAWDZIWY — zmierzone formy różnią się (`edziennik.malopolska.uw.gov.pl`,
  `e-dziennik.szczecin.uw.gov.pl`, mazowieckie przez `gov.pl/web/uw-mazowiecki`).
  Zastąpiono zakazem budowania adresu z szablonu i nakazem wejścia przez
  `dziennikiurzedowe.gov.pl`.
- 3.28 — **uzupełnienie luk publikatorów urzędowych** (2026-09-01f, flaga F-153).
  Rewizja list źródeł pod kątem pytania „czy istnieje publikator rządowy, którego
  hierarchia nie zna" wykazała cztery luki w RZĘDZIE 1 i trzy w 2A.
  `HIERARCHIA-ZRODEL.md` → **v1.6**. RZĄD 1: **Monitor Polski**
  (`monitorpolski.gov.pl` + `api.sejm.gov.pl/eli/acts/MP/...`) — publikator uchwał,
  obwieszczeń i zarządzeń, dotąd nieobecny mimo wpiętej ścieżki Dz.U.;
  `dziennikustaw.gov.pl` (RCL); `dziennikiurzedowe.gov.pl` (dzienniki ministrów
  i urzędów centralnych); **wojewódzkie dzienniki urzędowe**
  (`edziennik.{województwo}.uw.gov.pl`) — JEDYNY publikator aktów prawa
  miejscowego, bez którego DR-08 i DR-09 nie miały skąd wziąć brzmienia uchwały
  rady gminy ani planu miejscowego. ⚠️ Zmierzone 2026-09-01: `api.sejm.gov.pl/eli/acts`
  zwraca wyłącznie `DU` i `MP`, więc publikatory lokalne są POZA tym API.
  RZĄD 2A: interpretacje organów (EUREKA — KAS; **BIP GIP** — interpretacje
  indywidualne wg art. 14b ustawy o PIP, Dz.U. 2026 poz. 473, w życie 2026-07-08),
  rejestry urzędowe i publikatory ogłoszeń (KRS, KRZ, eKRS/PDF, EKW, CEIDG,
  REGON, SUDOP, BZP) — wyłącznie dla ustalenia FAKTU wpisu, oraz materiały
  legislacyjne (`legislacja.rcl.gov.pl`, druki sejmowe) z ⛔⛔ zakazem cytowania
  z nich brzmienia: projekt nie jest aktem.
  `PRAWO-HARDGATE.md` — POZIOM B rozszerzony o wzorzec M.P. i o jawną granicę
  zasięgu API ELI.
- 3.27 — **korekta dwóch zapisów o dostępności źródeł RZĘDU 1** (2026-09-01c,
  flagi F-150 / F-151). `PRAWO-HARDGATE.md`: POZIOM B wskazywał
  `/eli/acts/DU/{rok}/{poz}/text.html` jako „pełny tekst aktu" — endpoint zwraca
  tekst OGŁOSZONY aktu bazowego, bez jednostek dodanych nowelizacją (zmierzone:
  KC bez art. 385¹/449¹/770¹, KK bez art. 190a). Instrukcja wykonana dosłownie
  łamała REGUŁĘ AKTUALNOŚCI z tego samego pliku. Dodano sekcję „PUŁAPKA
  /text.html" z sekwencją B-T1…B-T3 (references → obwieszczenie ze statusem
  `obowiązujący` → `text.pdf` + ekstrakcja) i oznaczono `/text.html` jako ⛔.
  Tabela kanałów uzupełniona o kolumnę retestu: `eli.gov.pl/robots.txt` zezwala
  na wszystko, więc `ROBOTS_DISALLOWED` opisuje decyzję narzędzia `web_fetch`,
  nie zakaz serwera; `isap.sejm.gov.pl` zapętla 302 i jest martwy w obu trybach.
  `HIERARCHIA-ZRODEL.md` → **v1.5**: sekcja REALIA DOSTĘPNOŚCI rozpisana per
  kanał hosta (przy kanale kodu BRZMIENIE przepisu jest osiągalne, więc
  🟨 KOTWICA URZĘDOWA bywała nieuzasadniona), nowa pozycja RZĄD 2A dla
  orzecznictwa i decyzji organów (UODO, KIO, UKE, UOKiK, EUREKA) z odesłaniem
  do `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`.
- 3.26 — `MOD-UNIT-SWEEP.md` 1.0 **przemianowany i rozszerzony** na
  `MOD-WYJATEK-GATE.md` 2.0 (WYJ-GATE), 2026-08-31d, flaga F-144, na uwagę
  użytkownika w tej samej sesji, przed pierwszym użyciem produkcyjnym.
  Powód zmiany: nazwa 1.0 opisywała CZYNNOŚĆ („zamiataj sąsiedztwo"), a nie CEL
  („nie przegap wyjątku") — przez co mechanizm wyglądał na wąską sztuczkę
  i faktycznie pokrywał tylko jedno z czterech miejsc, w których mieszkają
  wyjątki. Rozstrzygnięcie sporne rozstrzygnięte świadomie: reguła NIE brzmi
  „sprawdź, czy istnieje przepis szczególny", bo taki warunek jest ocenny
  (żeby go wykonać, trzeba już podejrzewać, że wyjątek istnieje) i niesprawdzalny
  z zewnątrz (nieobecności wyjątku nie da się udowodnić). Zamiast tego cztery
  POLICZALNE zamiatania: **S1** sąsiedztwo redakcyjne z regułą indeksu górnego,
  **S2** krawędzie jednostki (pierwszy i ostatni artykuł działu — tam stoją
  klauzule zakresowe i wyłączenia), **S3** akty powiązane z rejestru ELI plus
  pytanie zamknięte o akt sektorowy dla danej kategorii strony (lex specialis
  POZA aktem — w kazusie 111 wyłączenie rękojmi siedziało w innej ustawie,
  więc samo S1 by nie wystarczyło), **S4** przepisy przejściowe przez odesłanie
  do `MOD-OS-CZASU-PRZESLANEK` OŚ-5.4, bez duplikowania procedury.
  Blok wyjściowy WYJ-GATE wymaga wszystkich czterech pozycji także wtedy, gdy
  wynik zamiatania jest pusty. Plik `MOD-UNIT-SWEEP.md` USUNIĘTY — dwie nazwy
  jednego mechanizmu to klasa błędu z `DEDUPLICATION-POLICY.md`; historia nazwy
  zachowana w §10 modułu. ⛔ Skuteczność NIEZMIERZONA (klasa F-119), pomiar
  z grupą kontrolną przypisany do F-144.

- 3.25 — NOWY MODUŁ `MOD-UNIT-SWEEP.md` (US-GATE) + `MOD-OS-CZASU-PRZESLANEK.md`
  1.0 → 1.1 (2026-08-31b, flaga F-144, na polecenie użytkownika po audycie
  cudzego materiału do kazusu 111). Wzorzec awarii, który zamyka: **weryfikacja
  punktowa artykułu nie wykrywa przepisu, o którego istnieniu model nie wie** —
  sprawdza dokładnie to, o co sam siebie zapytał. Incydent źródłowy: art. 770 k.c.
  odczytany ze źródła, we właściwej wersji na datę umowy (20.02.2011), przy
  pominiętym art. 770¹ k.c. — jednostce dodanej ustawą z 27.07.2002, uchylonej
  25.12.2014, która dla kupującego-konsumenta odsyłała umowę komisową do przepisów
  o sprzedaży konsumenckiej. Wszystkie bramki weryfikacyjne zadziałały; żadna nie
  pyta, co leży obok. To jest wiedza NEGATYWNA i nie da się jej dopisać do tablicy
  — tablica rośnie wyłącznie o pozycje, które ktoś już raz przeoczył.
  Konstrukcja: wyzwalacz mechaniczny (każde powołanie jednostki), zakres minimalny
  US-2 nie podlegający skróceniu, ⛔ REGUŁA INDEKSU GÓRNEGO (art. X¹ to osobna
  jednostka, zwykle lex specialis albo odesłanie), reguła kierunku czasu (przepis
  uchylony po dacie zdarzenia jest w stanie aktualnym niewidoczny), klasyfikacja
  sąsiada w stałym szablonie i widoczny blok US-GATE. Milczenie NIE jest
  odpowiedzią negatywną. Wsparcie narzędziowe: `check_unit_sweep_eli.py` (T20
  w audyt-systemu-v4) buduje zakres US-2 deterministycznie, ale NIE ocenia wpływu.
  W MOD-OS-CZASU-PRZESLANEK: §5A **macierz reżimu trzyosiowa** (czas × status
  strony × typ zbywcy/umowy) w miejsce jednowymiarowej tabeli epok wraz z zakazem
  wartości domyślnej na którejkolwiek osi; OŚ-5.4 — obowiązek odczytu przepisu
  przejściowego nowelizacji wyznaczającej cezurę („cezura bez przepisu
  przejściowego jest datą, nie regułą stosowania"); nowe wiersze R-03a (przepis
  przejściowy do reformy z 1.01.2023), R-05 (komis + konsument, art. 770¹,
  1.01.2003–24.12.2014) i T-09 (chwila oceny wady prawnej — wyrok SN 18.10.2023,
  II CSKP 1771/22); korekta zakresu R-03 (wyłączenie obejmuje dział o rękojmi,
  nie „k.c. w ogóle"). ⛔ Skuteczność US-GATE NIEZMIERZONA — obecność modułu
  w pliku nie dowodzi zmiany zachowania (klasa F-119); pomiar z grupą kontrolną
  przypisany do flagi F-144, część otwarta.

- 3.24 — NOWY MODUŁ `MOD-OS-CZASU-PRZESLANEK.md` (OŚ-GATE), 336 linii
  (2026-08-31, flaga F-142, na polecenie użytkownika po sesji kazusów
  111/118). Wzorzec awarii, który zamyka: przesłanka roszczenia oceniana na
  datę zdarzenia sprawczego zamiast na chwilę, którą wskazuje prawo — podczas
  gdy między tymi chwilami upływa termin, który przesłankę wygasza albo
  dopiero powołuje. Incydent źródłowy (kazus 111): trzyletni termin z
  art. 169 § 2 k.c. upłynął pół roku przed zatrzymaniem pojazdu; analiza
  „na datę zakupu" daje wynik spójny wewnętrznie i merytorycznie błędny.
  Kluczowa cecha konstrukcyjna: **wyzwalacz mechaniczny (≥2 daty), nie
  ocenny** — warunek ocenny to ten sam tryb awarii, który mierzy F-113.
  Procedura OŚ-1…OŚ-4: ekstrakcja dat → pełna siatka n(n−1)/2 interwałów →
  punkty przełączenia (4 kierunki: rzecz/roszczenie/strona/reżim) → tablica
  CHWIL OCENY z bramką „zakaz konkluzji przed wypełnieniem". Osobna §5:
  kontrola reżimu (cezury 2003 / 2014 / 2023 dla odpowiedzialności wobec
  konsumenta). Tablice §4/§5 wypełnione polityką WĄSKĄ I ROSNĄCĄ — 8 pozycji
  T-01…T-08 i 4 cezury R-01…R-04, wyłącznie z realnych potknięć systemu,
  z regułą dopisywania §6 i jawnym ZAKAZEM pozycji „na zapas". ⛔ Tablice
  NIE są źródłem prawa — kolumna „chwila oceny" wskazuje, GDZIE patrzeć,
  a nie CO tam stoi; każde użycie przechodzi normalny PRAWO-HARDGATE.
  Wiersze R-02 i R-04 noszą jawne ⚠️ NIEZWERYFIKOWANE. Blok wyjściowy
  OŚ-GATE jest WIDOCZNY w odpowiedzi (uzasadnienie identyczne jak dla
  znaczników weryfikacji: krok niewidoczny to krok pomijalny bez śladu).
  ⚠️ SKUTECZNOŚĆ NIEZMIERZONA — obecność modułu dowodzi obecności reguły,
  nie zmiany zachowania; pomiar w gestii flagi F-143. Pełny opis:
  `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-31b.

- 3.23 — PRAWO-HARDGATE.md: nowa sekcja "OBOWIĄZEK WIDOCZNEGO ZNACZNIKA
  W DOSTARCZONEJ ODPOWIEDZI — BEZWARUNKOWY" (2026-08-27, na żądanie
  użytkownika). Luka źródłowa: przepisy zweryfikowane faktycznym
  `web_search` w danej turze, ale dostarczona odpowiedź nie niosła
  widocznego znacznika statusu przy żadnym cytacie (sprawa: analiza
  kazusów o tymczasowym aresztowaniu, dr-03/mod-KPK-srodki-zapobiegawcze-
  tymczasowe-aresztowanie.md). Nowa reguła: znacznik ✅/🟨/⚠️/🎯 obowiązkowy
  PRZY KAŻDYM powołaniu w tekście odpowiedzi, niezależnie od trybu
  (LAIK/PRAWNIK), formy odpowiedzi (pismo/analiza/notatka/konwersacja) i
  tego, czy weryfikacja miała miejsce we wcześniejszym kroku tej samej
  odpowiedzi. Zbiorczy nagłówek weryfikacyjny bez powtórzenia znacznika
  przy każdym przepisie = wariant BRAMKI ANTY-FASADOWEJ. Nie zmienia
  definicji samych znaczników ani hierarchii źródeł — dokłada wymóg
  WIDOCZNOŚCI w warstwie wyjścia.

- 3.22 — F-108/46: RATE-COMPLETENESS 1.1 rozróżnia publiczny podmiot leczniczy od pozostałych dłużników; odsyła do kanonicznych danych DR-02. (2026-08-27)
  Manifest uzgodniono z 155 rzeczywistymi plikami: stary zawierał wpisy
  nieobecnych narzędzi tools/. Nie usunięto żadnego pliku; brakujących
  narzędzi nie odtworzono ani nie oznaczono jako dostępnych.

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 3.21 (2026-08-23i) — F-115: self-check ANTY-FASADA jako MODUŁ, koniec z kopiami

**Decyzja wykonana: MODUŁ, nie kopia** (rekomendacja z flagi, potwierdzona dowodem
dryfu). Nowy plik `shared/SELF-CHECK-ANTY-FASADA.md` — jedyna lokalizacja treści
listy kontrolnej; skille ją WOŁAJĄ, nie powielają.

**Dowód, że kopia nie działa — zmaterializowany, nie hipotetyczny:** F-117 dodała
regułę AF-6 i drugą pozycję listy do `PRAWO-HARDGATE.md` (2026-08-23f). Żadna z
7 istniejących kopii nie została wtedy zaktualizowana. Pomiar w tej sesji: źródło
2 pozycje, wszystkie kopie 1 pozycja, brzmienie kopii identyczne między sobą co do
znaku — czyli rozjazd nastąpił dokładnie w momencie pierwszej zmiany źródła.

**Wykonane:**
- 7 kopii → wywołanie modułu: `analizator-dowodow-v3`, `prawny-router-v3`
  (references/SELF-CHECK.md), `pisma-proste-v2`, `analiza-sadowa-v6`,
  `przewodnik-prawny-v2`, `pisma-procesowe-v3` (references/SELF-CHECK-PISMA.md),
  `analizator-umow-v1`. Każda kopia liczyła 6 linii; po zamianie w całym systemie
  ZERO wystąpień treści listy poza modułem (`grep "zweryfikowano/zweryfikowałem"`).
- **P1 podłączone:** `orzeczenia-sadowe-v2`, `analizator-przepisow-v2` — dwa
  skille cytujące odpowiednio orzeczenia i przepisy najczęściej w systemie, a
  bramki nie miały w ogóle.
- **P2 podłączone:** `chronologia-sprawy-v1`, `przesluchanie-swiadkow-v2-min90`,
  `raport-klienta-v1`, `raport-sytuacyjny-v2`.
- ⛔ **Fałszywa deklaracja sprostowana.** `PRAWO-HARDGATE.md` twierdził, że
  self-check jest „propagowany do wszystkich skilli" — było 7 z ~25. Zdanie
  zastąpione opisem stanu faktycznego i odesłaniem do rejestru wołających,
  który mieszka teraz W MODULE (jedno miejsce prawdy zamiast deklaracji, której
  nikt nie weryfikował).
- `prawo-polskie-v2` **świadomie poza zakresem** — czysta fasada routingu,
  decyzja zapisana w jego SKILL.md (F-123). Odnotowane w rejestrze modułu, żeby
  nie wracało jako zgłoszenie.

**Pokrycie po zmianie:** 13 skilli + `shared` (`grep -rl SELF-CHECK-ANTY-FASADA`).
**POZOSTAJE:** P3 — 16 skilli DR-01…DR-16.

⚠️ **Ograniczenie zapisane w samym module:** self-check jest samo-raportujący —
wykonuje go ten sam proces, który mógł właśnie zbudować fasadę. Fasada z TEST2
(deklaracja + URL RZĄD 1 + data, wszystko prawdziwe) przeszłaby ten self-check,
gdyby model uznał, że wywołanie „w zasadzie było". Pomiar — F-113.

---

## 3.20 (2026-08-23h) — PRAWO-HARDGATE podzielony (F-111, wariant B); 88 linii changelogu wyniesione z korpusu bramki

**Decyzja użytkownika (F-111, wariant B z trzech przedstawionych).** Pomiar przed
podziałem: `PRAWO-HARDGATE.md` **967 linii** (flaga otwarta była przy 808 — plik
urósł o 159 przez v2.5, v2.6, KROK 2C/F-120 i KOTWICĘ; do progu ZASADY 13 zostały
33 linie). Ścieżka wczytania: **114 plików, 212 wystąpień, 26 skilli**
(`grep -rl PRAWO-HARDGATE --include=*.md /mnt/skills/user | wc -l`).

**Znalezisko, którego flaga nie odnotowała:** 88 pierwszych linii pliku to była
HISTORIA WERSJI (2.0–2.6) — stała POWYŻEJ pierwszej normy. Pierwsza norma
(`⛔ HARD GATE — BEZWZGLĘDNY`) zaczynała się w wierszu 91, `## ZASADA ABSOLUTNA`
w 103. Każdy z 114 plików odsyłających do najczęściej wczytywanej bramki systemu
czytał opisy wersji, zanim dotarł do zakazu. Naruszenie ZASADY 15 w pliku o
największym zasięgu w systemie. Historia przeniesiona tutaj (niżej, sekcja
„HISTORIA PRAWO-HARDGATE 2.0–2.6"), w korpusie zostało odesłanie.

**Granica podziału.** Wydzielono `shared/PRAWO-HARDGATE-ORZECZENIA.md` (464 l.) —
wszystko, co odpala się WYŁĄCZNIE przy sygnaturze orzeczenia: procedura przed
każdym orzeczeniem (bramka WTÓRNE-ŹRÓDŁO-STOP, KROK 5A, KOTWICA-TEKSTOWA
KT-1→KT-4), KROK 5B (wyroki TK 2024-2026), postępowanie przy nieudanej
weryfikacji sygnatury, KROK DODATKOWY (warstwy uzasadnienia [1]/[2]/[3]) oraz
SELF-CHECK przed odpowiedzią z orzecznictwem.

⚠️ **Odstępstwo od liczby zapowiedzianej użytkownikowi, świadome:** przy
przedstawianiu wariantu B rdzeń szacowano na ~620 linii (miała przenieść się sama
„procedura orzecznicza", 261 l.). Po obejrzeniu treści przeniesiono również KROK
DODATKOWY (111 l.) i SELF-CHECK orzeczniczy (66 l.), bo oba dotyczą wyłącznie
uzasadnień sądowych. **Powód:** rozdzielenie logiki orzeczniczej między dwa pliki
— zwłaszcza self-checku, którego pozycje odsyłają wprost do KROKU DODATKOWEGO —
byłoby gorsze niż jeden większy załącznik. Wynik: rdzeń **501 l.**, załącznik
**464 l.** Granica przebiega dokładnie tam, gdzie wyzwalacz: *czy w tekście stoi
sygnatura*.

**Wyzwalacz jest BINARNY, nie ocenny:** „ma paść sygnatura → wczytaj załącznik",
nie „gdy potrzebujesz procedury szczegółowej". Sformułowanie ocenne odtworzyłoby
mechanizm awarii z pilotażu LEX MACHINA, gdzie trzy z czterech usterek to reguła
istniejąca i pominięta, a nie brak reguły.

⛔ **RYZYKO NAZWANE W SAMYM PLIKU, nie tylko tutaj:** treść wydzielona to treść,
której można NIE wczytać. Podział zamienia tryb awarii „reguła przeczytana i
pominięta" na „reguła niewczytana" i **nie został zmierzony** — pomiar należy do
F-113 (test z grupą kontrolną). Zapisane w rdzeniu i w nagłówku załącznika.

**Kontrola kompletności:** suma segmentów 967 = oryginał 967 (zero linii
zgubionych); wszystkie 18 nagłówków oryginału obecne w nowych plikach; normy
stałe (ZASADA ABSOLUTNA, PERMANENT GATE, ANTY-FASADA, KOTWICA URZĘDOWA, KROK 2C)
pozostały w rdzeniu.

**Odblokowane:** F-115 (propagacja self-checku ANTY-FASADA) — self-check został w
RDZENIU, zgodnie z warunkiem zapisanym w tamtej fladze, więc propagacja może
ruszyć bez ryzyka dwukrotnej zmiany ścieżki wczytania.

⚠️ **Ścieżki zewnętrzne NIE wymagały zmiany** — `PRAWO-HARDGATE.md` istnieje pod
tą samą nazwą, więc wszystkie 212 odesłań w 114 plikach pozostają poprawne.
To była główna zaleta wariantu B nad A.

---

## HISTORIA PRAWO-HARDGATE 2.0–2.6 (przeniesiona z korpusu pliku 2026-08-23h)

*(treść 1:1 z wierszy 3–90 `PRAWO-HARDGATE.md` sprzed podziału, zdjęte wyłącznie
prefiksy cytatu `> `)*

**Wersja:** 2.6 (2026-08-23) — BRAMKA ANTY-FASADOWA. Wdrożona po odczytaniu
SUROWEGO TRANSKRYPTU testu 3, który obalił hipotezę leżącą u podstaw v2.5:
model nie trafił na blokadę robots — nie podjął próby weryfikacji, a mimo to
zbudował fasadę weryfikacyjną z prawdziwych elementów (deklaracja + URL RZĄD 1
+ data). v2.5 opisywała, jak oznaczyć stan PO nieudanym fetchu, i milcząco
zakładała, że fetch nastąpił. v2.6 zamyka lukę: wyzwalaczem jest BRAK
WYWOŁANIA NARZĘDZIA dla danego twierdzenia w danej odpowiedzi, niezależnie
od dostępności narzędzi w sesji. Dodano AF-1…AF-5 + format 🎯 [CEL —
NIEOTWARTE]. Rozstrzygnięto propozycję zewnętrzną LM-K2-01: element „adres
nie oznacza otwarcia" PRZYJĘTY, dopuszczenie etykiety `MEM` ODRZUCONE.

**Wersja poprzednia:** 2.5 (2026-08-23) — NAPRAWA ŹRÓDŁA-0 + TRZECI STATUS (KOTWICA
URZĘDOWA). Wdrożona po analizie przyczyn testu 3 pilotażu LEX MACHINA.
Trzy zmiany: (1) POZIOM B rozbity na sekwencję dwukrokową B-1 (web_search
wprowadza URL do kontekstu) → B-2 (web_fetch na URL z wyniku) — dotychczasowe
brzmienie ("web_fetch na skonstruowany URL") było w tym środowisku
niewykonalne w 100% przypadków, co zweryfikowano empirycznie; (2) dodano
czwarty, brakujący status 🟨 [KOTWICA-URZĘDOWA] dla stanu faktycznie
osiągalnego przy blokadzie robots na RZĘDZIE 1 — brak nazwy dla realnego
stanu był bezpośrednią przyczyną konfabulacji statusu przez model;
(3) zamknięcie hierarchii statusów i wyraźny zakaz tworzenia nowych.

**Wersja poprzednia:** 2.4 (2026-07-17) — ZASADA PONOWNEJ WERYFIKACJI OZNACZEŃ +
WYTRWAŁOŚĆ WYSZUKIWANIA + OZNACZANIE PRZY KAŻDYM UŻYCIU. Dodano na
wyraźne polecenie użytkownika jako "reguła na przyszłość", po incydencie
z niepotwierdzonym oznaczeniem/skrótem prawnym (repertorium postępowań
sprawdzających), gdzie pierwsze zapytanie wyszukiwania ("S og" wprost)
nie dało jednoznacznego potwierdzenia z aktu źródłowego, a model
zatrzymał się na hipotezie prawdopodobieństwa zamiast kontynuować
wyszukiwanie innymi zapytaniami. Zarejestrowane też jako ZASADA 13 w
`audyt-systemu-v4/SKILL.md` (STAŁA — nie precedens).

**Trzy elementy tej wersji:**
1. **Ponowna weryfikacja przy powtórnym użyciu:** każde niepotwierdzone
   źródłowo oznaczenie/skrót prawny, gdy pojawia się PONOWNIE w dalszej
   części rozmowy jako podstawa wniosku, wymaga NOWEJ weryfikacji przed
   użyciem — nie wystarczy przywołanie z pamięci wcześniejszej hipotezy,
   NAWET WŁASNEJ. To rozszerza PERMANENT GATE (linia 37-42 niżej) z
   "każde nowe powołanie = osobny web_search" na wyraźne uwzględnienie
   przypadku, gdy wcześniejsze "powołanie" było tylko hipotezą modelu,
   nie potwierdzoną treścią — taka hipoteza NIE zyskuje statusu ustalonego
   faktu tylko dlatego, że pojawiła się już wcześniej w tej rozmowie.
2. **Wytrwałość wyszukiwania — różne zapytania, nie jedna próba:** jeśli
   pierwsze wyszukiwanie nie daje jednoznacznego potwierdzenia z aktu
   źródłowego (regulaminu, ustawy, zarządzenia) — kontynuuj wyszukiwanie
   RÓŻNYMI zapytaniami (np. pełną nazwą instytucji/rejestru zamiast
   samego skrótu, synonimami, szerszym/węższym ujęciem frazy), zamiast
   zatrzymywać się na pierwszej hipotezie prawdopodobieństwa. Przykład z
   incydentu: "repertorium postępowań sprawdzających" jako zapytanie
   zamiast poprzestania na samym skrócie "S og" wprost.
3. **Oznaczanie przy KAŻDYM użyciu, nie tylko przy pierwszym wprowadzeniu:**
   wniosek oparty na niepotwierdzonym oznaczeniu musi mieć widoczne
   ⚠️ [NIEWERYFIKOWANE] PRZY KAŻDYM wystąpieniu w odpowiedzi/dokumencie —
   jednorazowe zastrzeżenie przy pierwszym wprowadzeniu skrótu nie
   zwalnia z ponownego oznaczenia, gdy ten sam skrót jest używany dalej
   jako podstawa kolejnych zdań/wniosków. Czytelnik nie powinien nigdy
   natrafić na użycie niepotwierdzonego oznaczenia bez oznaczenia obok.

**Wersja poprzednia:** 2.3 (2026-07-15c) — SCALENIE: mechanizm KOTWICA-TEKSTOWA
(Text Fragment `#:~:text=`, procedura KT-1→KT-4, FALLBACK, zastrzeżenie
o wsparciu przeglądarek) przeniesiony tutaj z `shared/WERYFIKACJA-SLAD.md`,
gdzie powstał niezależnie tego samego dnia (2026-07-15) co KROK 5A w tym
pliku — dwie osobne implementacje tego samego problemu w dwóch plikach
shared/, nie połączone przy tworzeniu. Wykryte przez użytkownika po tym,
jak odpowiedź spoza modułu analizy przepisów (dr-03, analiza karna)
zawierała cytaty bez żadnej kotwicy — ani z KROK 5A (który akurat nie był
wczytany w tamtej odpowiedzi), ani z WERYFIKACJA-SLAD.md (do którego
dodano punktowe odesłanie zamiast sprawdzić najpierw, czy centralny hard
gate już tego nie zawiera). KROK 5A jest teraz jedyną kanoniczną treścią;
`WERYFIKACJA-SLAD.md` odsyła tutaj. Pełny opis: AUDIT-JOURNAL.md, wpis
AUDYT-2026-07-15c (rozszerzenie).
**Wersja poprzednia:** 2.2 (2026-07-15b) — dodano KROK 5-RZĄD: obowiązkowa
kategoryzacja źródła (RZĄD 1/2A/2B/3, `shared/HIERARCHIA-ZRODEL.md`)
OBOK znacznika VER przy każdym linku, nie tylko w module analizy
przepisów. Rozszerzono BRAMKĘ WTÓRNE-ŹRÓDŁO-STOP o odesłanie do tej
samej kategoryzacji. Zgłoszone przez użytkownika po tym, jak w rozmowie
podano linki do stron indywidualnych kancelarii (Rząd 3) bez kategoryzacji.
**Wersja poprzednia:** 2.1 (2026-07-15) — dodano KROK 5A (lokalizacja w źródle:
strona/teza/punkt/sekcja + kotwica techniczna gdy zweryfikowana) i
KROK 5B (link zawsze obowiązkowy, nawet gdy treść tylko z web_search
bez pełnego web_fetch — nie wolno pomijać linku z powodu braku pełnej
weryfikacji, tylko obniżyć jego status na ⚠️ [NIEWERYFIKOWANE]).
Wdrożone na wyraźne polecenie użytkownika, do mechanizmu cytowania jako
takiego (nie punktowo do jednego modułu) — dotyczy KAŻDEGO cytatu z
orzeczenia, przepisu LUB dowolnej innej strony internetowej.
Poprzednia wersja 2.0 (2026-07-05) — WARSTWA STRUKTURALNA (ŹRÓDŁO-0):
deterministyczne API (ELI Sejm / SAOS / CELLAR) i konektory MCP przed web_search.
Wzorce: prawo-pl-eli, legal-cite-pl, mcp-isap, sententim (AUDYT-2026-07-05a).

---

## 3.19 (2026-08-23) — usunięcie plików historycznych bez roli operacyjnej (6 plików, 202 → 196)

Przegląd kompletny: każdy z 202 plików katalogu skonfrontowany z (a) wywołaniami
`view` we wszystkich 31 pozostałych skillach systemu, (b) odwołaniami wewnątrz
`shared/`, (c) rejestrami `SKILL.md` i `DEPENDENCY-GRAPH.md`. Wzmianki w
`AUDIT-JOURNAL.md`, `WARN-OTWARTE.md` i changelogach NIE liczone jako rola —
to zapis historyczny, nie wywołanie.

**Usunięte:**

| Plik | Podstawa usunięcia |
|---|---|
| `AKTY-PRAWNE-MASTER.md` (271 l.) | Sam plik od 2026-06-14 nosił nagłówek „⛔ DEPRECATED — NIE UŻYWAĆ", z adnotacją, że migracja nigdy nie nastąpiła (WARN-7, opcja b). Rejestrem Dz.U. jest `audyt-systemu-v4/references/mapa_dzu_*.md`, metrykami — `ISAP-METRYKI-AKTOW.md` i lokalne `dr-*/MAPA-AKTOW.md`. Zero wywołań `view`. |
| `STATUS.md` (35 l.) | Rejestr wersji modułów zamrożony na 2026-06-09, obejmował 13 z ~120 plików katalogu. Zero odwołań spoza `shared/` (wpis „ACTIVE \| audyt-systemu-v4" w `DEPENDENCY-GRAPH.md` był nieprawdziwy — zweryfikowano grepem). Rolę rejestru pełnią tabele „Zawartość katalogu" w `SKILL.md` i ten plik. |
| `MOD-WALIDACJA.md` (7 l.) | Stub przekierowujący do `MOD-WALIDACJA_v2.md`, utrzymywany „dla kompatybilności wstecznej". Ostatni realny konsument — `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` — zniknął przy dedupliakcji 2026-07-12; wszystkie żywe wywołania (`pisma-procesowe-v3` ×4, `analizator-umow-v1`) idą wprost do `_v2`. Kompatybilność wsteczna bez konsumenta = zero roli. Zgodne z `DEDUPLICATION-POLICY.md` („stuby pośrednie są niedopuszczalne i będą usuwane w audytach") i z precedensem `FAKTY.md`, usuniętego wcześniej w tym samym trybie. |
| `checklists/final-pleading-audit-v8.md` (42 l.) | Zero odwołań w CAŁYM systemie — jedyny plik `shared/` bez choćby jednej wzmianki. Szkielet listy kontrolnej pokryty merytorycznie przez `FORMAL-CHECK.md`, `QUALITY-CHECK.md` i `AUDYT-KONCOWY.md`. Hasło „final-pleading-audit-v8" w `prawny-router-v3/references/ROUTING-OPPONENT-ANALYSIS-V9.md` to nazwa silnika, nie ścieżka do tego pliku. |
| `checklists/contradiction-intelligence-checklist-v10.md` (34 l.) | Zero wywołań. Kanoniczna implementacja tej logiki to `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md` (wywoływany przez `prawny-router-v3`, `analiza-sadowa-v6`, `pisma-procesowe-v3` W1.2). Plik w `shared/` był 34-liniowym szkicem tego samego, bez ścieżki wywołania. |
| `portale-branzowe-rzad-2b/czesc-05-changelog.md` (297 l.) | ⚠️ NIE skasowany — treść przeniesiona 1:1 do ANEKSU A tego pliku. Druga lokalizacja historii zmian wewnątrz katalogu treściowego, sprzeczna ze standardem 3.18. |

Katalog `checklists/` przestał istnieć (opróżniony).

**NIE usunięto mimo zerowego wywołania — decyzje świadome:**

- `ORKA-BAS-001-125.json` — wygląda na surowy zrzut wchłonięty przez leksykon,
  ale porównanie 125 rekordów z `orka-bas-leksykon/*.md` + `ORKA-BAS-VIII-X-KADENCJA.md`
  wykazało, że **41 rekordów (BAS-025…) nie ma odpowiednika w markdownie**.
  Usunięcie byłoby utratą danych.
- `MOD-AUDIT-BUNDLE.md` — moduł kompletny i aktualny (AI Act art. 12), ale
  niepodpięty do żadnego pipeline'u. To luka integracyjna, nie plik historyczny —
  usunięcie zamiotłoby problem pod dywan. **Do rozstrzygnięcia w osobnej sesji:
  podpiąć czy odłożyć.**
- `tools/` w całości (81 plików) — otwarte flagi F-8, F-10, F-11 wskazują na te
  pliki jako punkt startowy wdrożenia po stronie dewelopera.
- `mod-osoba-niewidoma-prawa-sad.md` vs `mod-niewidomy-prawa-prawne.md` — 390 i
  415 linii treści merytorycznej o częściowo pokrywającym się zakresie. To kandydat
  do **scalenia**, nie do usunięcia; scalenie wymaga porównania treści art. po art.
  i nie mieści się w porządkowaniu plików.
- `DEDUPLICATION-POLICY.md`, `SCHEMAT-ODPOWIEDZI-MCP.md`, `KANCELARIA-WORKFLOW.md` —
  zerowe wywołanie z zewnątrz, ale rola wewnętrzna udokumentowana i żywa.

**Zaktualizowane rejestry:** `SKILL.md` (wiersze `STATUS.md` i `MOD-WALIDACJA.md`
usunięte z tabel, akapit o oznaczaniu in-situ poprawiony, licznik plików w
`limitations` urealniony ze „115 plików, ~1,4 MB" na stan faktyczny),
`DEPENDENCY-GRAPH.md` (3 wiersze + 2 zasady utrzymania), `DEDUPLICATION-POLICY.md`
(2 wiersze martwych stubów), `PORTALE-BRANZOWE-RZAD-2B.md` (odsyłacz do ANEKSU A).

---

## 3.18 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Pole `changelog:` w YAML zawierało 111 linii pełnej historii — najdłuższy taki
przypadek w systemie. Wyniesione 1:1 do nowo utworzonego `references/CHANGELOG.md`;
w YAML został kilkulinijkowy skrót.

**Standard systemowy wprowadzony tego dnia:** pełna historia zmian każdego skilla
mieszka w `references/CHANGELOG.md` — nigdy w sekcji `## CHANGELOG` korpusu SKILL.md
i nigdy jako pełna lista wpisów w polu `changelog:` frontmatteru. W SKILL.md zostaje
wyłącznie kilkulinijkowy skrót bieżącej wersji z odesłaniem do tego pliku.

**Dlaczego to nie jest kosmetyka:** rozproszenie historii między trzy lokalizacje było
BEZPOŚREDNIĄ przyczyną fałszywych wyników testu T12 w sesji 2026-08-20z3 — test szukał
wpisów w `references/`, nie znajdował ich (bo leżały w SKILL.md) i raportował luki,
których nie było. Jedna lokalizacja kanoniczna usuwa całą tę klasę błędu.
Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z4`.

---

## HISTORIA PRZENIESIONA Z SKILL.md (2026-08-20z4, ujednolicenie standardu)

> Poniższa treść pochodzi z pola `changelog:` we frontmatterze SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

changelog:
  - "3.17 (2026-08-20z): NOWY PLIK KANONICZNY `MOD-DOKUMENT-GATES.md` — osiem bramek
    pracy na dokumentach (DOCUMENT-SCAN-PROMPT, FOUNDATION-VERIFICATION-GATE,
    EXHAUSTIVE-EXTRACTION-GATE, IMMEDIATE-LOGICAL-SCAN, CROSS-DOCUMENT-CONSISTENCY-CHECK,
    ENTITY-DISAMBIGUATION-TABLE, EVIDENCE-THREAD-LINKING, QUOTE-VERIFICATION-DEFAULT)
    wydzielonych z `przesluchanie-swiadkow-v2-min90`, gdzie stanowiły jedyną kopię
    w całym systemie — mimo że dotyczą pracy na dokumentach, nie na świadku.
    Konsumenci: skill przesłuchań (PRE-W1a.5 DG-LOAD) i `analizator-dowodow-v3`
    (KROK 0d DG-LOAD — dla tego drugiego to NOWA ZDOLNOŚĆ, wcześniej niedostępna).
    Treść przeniesiona bajtowo, weryfikacja porównawcza przed dostawą. Zarejestrowane
    w tabeli 'Zawartość katalogu' tego pliku ORAZ w DEPENDENCY-GRAPH.md (REGUŁA 2 —
    bez obu wpisów powstałby plik-sierota, wzorzec F-80). Flaga F-100 (A).
    Przy okazji: pole `version` ujęte w cudzysłów po wykryciu pułapki float testem T12."
  - "3.16 (2026-08-18): SKRÓCENIE POLA `description` we frontmatterze — 1172 → 302
    znaków. Poprzednia wersja wyliczała w opisie wyzwalającym całą zawartość
    biblioteki (PRAWO-HARDGATE, HYBRID-VALIDATION, INTAKE-GAP, MOD-WALIDACJA_v2,
    FSL, LSL, terminy, FAKTY, MOD-STEP-TRACKER, MOD-REJESTR-POKRYCIA-JEDNOSTEK,
    DEFINICJE-KLUCZOWE z listą 9 plików definicje/, mod-niewidomy-prawa-prawne),
    co (a) przekraczało limit długości description i groziło ucięciem opisu przy
    ładowaniu, (b) duplikowało tabele 'Zawartość katalogu' w treści pliku,
    (c) rozmywało jedyny komunikat, który w tym opisie jest istotny: shared NIE
    jest skillem wyzwalanym zapytaniem użytkownika. Nowy opis mówi czym jest
    biblioteka, że nie triggeruje się sama, i kieruje po spis do treści pliku.
    PRZENIESIONE (nie usunięte) do tabeli w sekcji 'Zawartość katalogu':
    DEFINICJE-KLUCZOWE.md i mod-niewidomy-prawa-prawne.md — jako jedyne dwa
    moduły z dawnego description NIEOBECNE dotąd w żadnej tabeli treści.
    PRZY OKAZJI skorygowano liczebność: definicje/ zawiera 10 plików, nie 9
    (pominięty był DEF-INTERES-WLASNY-WYLACZENIA.md). Zmiana dotyczy wyłącznie
    frontmattera i tabeli SKILL.md — ŻADEN plik kanoniczny modułu nie ruszony,
    więc promień rażenia zerowy (patrz limitations)."
  - "3.15 (2026-08-18): NOWY MODUŁ — MOD-REJESTR-POKRYCIA-JEDNOSTEK.md (RPK),
    w odpowiedzi na incydent pominięcia kazusów 100, 140, 148 w sesji
    160-elementowej (rozwiązywanie kazusów cywilnych). Rejestr plikowy
    (przetrwa kompaktowanie sesji) pokrycia zbiorów ≥10 ponumerowanych
    jednostek roboczych — komplementarny do MOD-STEP-TRACKER.md (który
    śledzi kroki WEWNĄTRZ jednego pipeline'u, nie pokrycie WIELU
    równorzędnych jednostek). Cztery statusy (DO_ZROBIENIA/ZWERYFIKOWANE/
    POKRYTE/WYMAGA_WERYFIKACJI), kontrola ciągłości numerycznej przed
    każdą partią, obowiązkowy commit po partii, procedura po
    kompaktowaniu, raport końcowy generowany programistycznie z pliku
    zamiast z pamięci modelu. Skille wskazane jako konsumenci (propagacja
    OTWARTA, patrz WARN-OTWARTE.md): prawny-router-v3, analizator-przepisow-v2,
    analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90,
    chronologia-sprawy-v1, audyt-systemu-v4. Pełny opis: AUDIT-JOURNAL.md
    AUDYT-2026-08-18."
  - "2.7 (2026-07-12, audyt komercyjny silnika, punkty 1-2 + zamknięcie
    duplikatów): ci_check_shared.py (audyt-systemu-v4/scripts/) wykrył 4
    nieudokumentowane duplikaty bajtowe — wszystkie scalone: NAZEWNICTWO-STRON.md
    (kanoniczny już istniał, analizator-dowodow-v3 przekierowany), nowe pliki
    kanoniczne STALKING-NEKANIE.md i PRZESLUCHANIE-SWIADKOW-KPC.md (przeniesione
    z dr-03/dr-16 + prawny-router-v3/references/, oba konsumowane przez ≥2
    lokalizacje). Przy okazji naprawiono DEDUPLICATION-POLICY.md: 9 z 10 plików
    zadeklarowanych jako 'usunięte 2026-06-13' wciąż leżało na dysku — usunięte
    naprawdę teraz. Dodano shared/tools/ — walidator_cytowan.py, deterministyczna
    bramka weryfikacji cytowań poza LLM, uruchamiana przez portal przed
    present_files (nie audyt-systemu-v4 — to narzędzie produkcyjne, nie
    deweloperskie). Pełny opis: AUDIT-JOURNAL.md AUDYT-2026-07-12g,
    CHECKLIST-DEDUP.md NOTA-12/13/14."
  - "2.6 (2026-07-12, runda 2): ZAMKNIĘTE — WARN 'numer wersji vs nazwa
    pliku' z MOD-DOKUMENT-ANOMALIE (otwarty w 2.5). Plik przemianowano z
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md na MOD-DOKUMENT-ANOMALIE_v1.1.0.md, żeby
    nazwa fizyczna zgadzała się z deklarowaną w treści wersją 1.1.0.
    Zweryfikowano całą bazę (grep całego /mnt/skills/user/) — tylko dwa
    miejsca odwoływały się do tego pliku po pełnej ścieżce z rozszerzeniem:
    pisma-procesowe-v3/references/MODULY-MAPA.md i
    pisma-procesowe-v3/references/AUTOMAT-STANOW.md — oba zaktualizowane.
    Pozostałe wzmianki w systemie (shared/CP-GATE.md,
    shared/MOD-KOSZT-ODPOWIEDZI.md, shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md,
    shared/MOD-STEP-TRACKER.md, pisma-procesowe-v3/modules/
    MOD-PRACODAWCA-RZECZYWISTY.md, pisma-procesowe-v3/references/
    SELF-CHECK-PISMA.md, pisma-procesowe-v3/references/W3-WERYFIKACJA.md,
    pisma-procesowe-v3/SKILL.md) to nazwy koncepcyjne bez ścieżki/rozszerzenia
    — nie wymagały zmiany. Wpis changelog 2.5 opisujący pierwotną naprawę
    (linia 'MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik...') pozostawiony bez
    zmian jako wierny zapis historyczny tamtej sesji."
  - "2.5 (2026-07-12): naprawa niespójności samoopisu w
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik w dwóch miejscach (nagłówek
    'Plik:' i wewnętrzna instrukcja `view` w sekcji WYWOŁANIE) opisywał
    samego siebie pod nazwą bez sufiksu wersji (MOD-DOKUMENT-ANOMALIE.md),
    mimo że fizyczna nazwa na dysku ma sufiks _v1.0.0. Nic zewnętrznego już
    się o to nie potykało (naprawione w pisma-procesowe-v3 sesją wcześniej),
    ale sam plik był niespójny. Przy okazji ujawniona DRUGA niespójność:
    deklarowana w treści 'Wersja: 1.1.0' nie zgadza się z sufiksem nazwy
    pliku '_v1.0.0' — odnotowana jawnie w pliku, nierozstrzygnięta (wymaga
    decyzji: zmienić nazwę pliku na _v1.1.0, czy to nazwa jest kanoniczna a
    numer w treści jest przestarzały)."
  - "2.4 (2026-07-12): korekta merytoryczna w terminy.md — wiersz 'Odpowiedź
    na pozew' (art. 207 §2 KPC) był błędnie sklasyfikowany w tabeli 'Terminy
    ZAWITE'; jest to termin INSTRUKCYJNY. Wykryte przy okazji naprawy WARN
    'nakładanie kompetencji analiza-sadowa-v6/analizator-dowodow-v3' —
    analiza-sadowa-v6 miał tę pozycję poprawnie oznaczoną jako INSTRUKCYJNY
    we własnej (teraz usuniętej) kopii tabeli terminów, co ujawniło
    rozbieżność z kanonicznym shared/terminy.md. Dodano adnotację ⚠ i
    przypis w treści pliku zamiast przenosić wiersz do nowej sekcji — decyzja
    strukturalna (osobna sekcja 'Terminy instrukcyjne' vs. adnotacja inline)
    pozostaje otwarta do najbliższego audytu."
  - "2.3 (2026-07-12): ODZYSKANIE 7 PLIKÓW KANONICZNYCH uznanych za utracone
    (CRIT z audytu silnika, zgłoszony przez pisma-procesowe-v3 SKILL.md
    i modules/MOD-SZABLONY.md jako ⛔ OBOWIĄZKOWE, brak na dysku):
    MOD-BUDOWA-ARGUMENTU.md, MOD-ELIMINACJA-TEZ.md, MOD-KARTA-DOWODU.md,
    MOD-KOSZT-ODPOWIEDZI.md, MOD-MIKROPODSUMOWANIA.md,
    MOD-SKUTEK-PROCESOWY.md, MOD-STRESS-TEST.md. Źródło: archiwum
    shared_v5.zip (frontmatter shared v2.1, poprzedzające obecną v2.2) —
    treść modułów zweryfikowana jako produkcyjna (nagłówek 'Status: PRODUKCJA
    — plik kanoniczny shared', ścieżki i wywołania `view` zgodne z aktualną
    strukturą, brak zależności kaskadowych do innych brakujących plików).
    UWAGA METODOLOGICZNA: pozostałe 25 plików wspólnych z shared_v5.zip
    różniło się treścią od wersji obecnej na dysku (v2.2 jest od nich
    nowsza — np. PRAWO-HARDGATE.md 367 vs 257 linii) — te 25 NIE zostało
    nadpisanych, przywrócono wyłącznie 7 plików faktycznie nieobecnych.
    4 pliki obecne na dysku (MOD-AUDIT-BUNDLE.md, MOD-FSL-DOKUMENTY.md,
    MOD-IDENTYFIKACJA-STRONY-UMOWY.md, MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md)
    nie istniały w shared_v5.zip — dodane po tym zrzucie, zachowane bez zmian.
    Tabela 'Moduły kancelaryjne v3.0' i sekcja 'Obowiązkowe wywołania dla
    generatorów pism' uzupełnione o 7 odzyskanych modułów. Do zrobienia przez
    audyt-systemu-v4 przy najbliższej sesji: wpis w AUDIT-JOURNAL.md,
    zamknięcie odpowiadającej flagi w WARN-OTWARTE.md, weryfikacja czy
    CHECKLIST-DEDUP.md wymaga aktualizacji (dwa moduły — MOD-KARTA-DOWODU
    i MOD-ELIMINACJA-TEZ — są współdzielone przez pisma-procesowe-v3 i
    analizator-dowodow-v3, sprawdzić czy to jedyna kanoniczna lokalizacja)."
  - "2.2: standaryzacja metadanych frontmatter (dependencies/inputs/outputs/
    confidence/escalation/limitations/required_modules) — sesja 2026-07-04.
    Jawnie odnotowane ZNANE ODSTĘPSTWO (5 plików z zależnością zwrotną do
    skili nadrzędnych) — decyzja architektoniczna pozostaje otwarta."


---

# ANEKS A — historia zmian rejestru portali Rzędu 2B

> Przeniesione 1:1 w wersji 3.19 (2026-08-23) z pliku
> `portale-branzowe-rzad-2b/czesc-05-changelog.md`, który został usunięty.
> Powód: standard systemowy 2026-08-20z4 — historia zmian mieszka w
> `references/CHANGELOG.md`, jednej lokalizacji na skill; plik-changelog
> wewnątrz katalogu treściowego był drugą lokalizacją historii i nigdy nie
> był wczytywany w toku pracy merytorycznej. Treść niezmieniona.

### Historia rejestru PORTALE-BRANZOWE-RZAD-2B (przeniesiona 2026-08-23 z `portale-branzowe-rzad-2b/czesc-05-changelog.md`)

**2.9 (2026-07-24c):** ⛔ Na wyraźne polecenie użytkownika ("usuń
pojedyncze przypisane pdf jako źródła... i pozostałe bezpośrednie linki
do pdf") zamknięto flagę F-12: rejestr `nexto_free_files_registry.json`
wyczyszczony do `[]`, wiersz F-12 usunięty z tabeli otwartych flag w
`audyt-systemu-v4/references/WARN-OTWARTE.md`. Wiersz w tabeli DR-03
powyżej zaktualizowany, żeby to odzwierciedlić. Wiersz "nexto.pl —
PRÓBKI/fragmenty książek" (3B-i/3B-ii) NIE jest tym dotknięty — dotyczy
odrębnego, legalnego mechanizmu podglądu/próbki.

**2.8 (2026-07-24b):** ⭐ Na uwagę użytkownika ("czy nie powinny być w 2,
szczególnie w odniesieniu do literatury Beck, Kluwer?") doprecyzowano
wiersz nexto.pl PRÓBKI: kryterium 2B to marka wydawnicza + redakcja
zawodowa, nie kanał dystrybucji — C.H.Beck i Wolters Kluwer są już w 2B
przez legalis.pl/lex.pl, więc próbka na nexto.pl jednoznacznie
identyfikowalna jako publikacja tych wydawnictw dziedziczy status 2B
(podtyp 3B-ii w `shared/HIERARCHIA-ZRODEL.md`), z zachowaniem wymogów
fragmentu/linku/aktualności wydania. Inne/nieustalone wydawnictwo
pozostaje Rząd 3 (3B-i).

**2.7 (2026-07-24):** ⭐ Na polecenie użytkownika dodano ODRĘBNY wiersz
`nexto.pl — PRÓBKI/fragmenty książek` w tabeli DR-03, celowo
oddzielony od istniejącego wiersza F-12. Rozróżnienie: F-12 = pełne,
nieautoryzowane pliki PDF (`.../free/[hash].pdf`), pod aktywnym
monitorowaniem, nie do cytowania; nowy wiersz = standardowa funkcja
próbki księgarni cyfrowej (spis treści + ograniczone strony),
dozwolona jako Rząd 3 WYŁĄCZNIE jako fragment/pogląd doktrynalny, z
obowiązkową weryfikacją ważności linku przed każdym użyciem — pełna
procedura w nowej sekcji 3B `shared/HIERARCHIA-ZRODEL.md` (wersja 1.1).

**2.6 (2026-07-21):** ⭐ KOREKTA na uwagę użytkownika: "nie reklamujemy
księgarni, więc nie powinny być dodane, tylko wskazane jako źródło
darmowych zasobów do monitorowania". USUNIĘTO wpis nexto.pl/profinfo.pl
jako "legalna księgarnia" z tabeli DR-03 — TEN rejestr ma na celu
wskazywanie źródeł do PRZESZUKIWANIA (`site:` dla treści prawnej), nie
katalogowanie miejsc zakupu, niezależnie od tego, jak legalne i godne
zaufania by nie były. Domena nexto.pl POZOSTAJE wspomniana WYŁĄCZNIE
jako źródło PIĘCIU konkretnych, monitorowanych plików (flaga F-12/T10
w audyt-systemu-v4) — BEZ rekomendowania jej jako ogólnego portalu do
przeszukiwania.

**2.5 (2026-07-21):** [WPIS UZUPEŁNIONY WSTECZNIE 2026-07-21 — w
oryginalnej turze zaktualizowano WYŁĄCZNIE nagłówek wersji pliku, bez
odpowiadającego wpisu w tej sekcji, co jest NIESPÓJNOŚCIĄ naprawioną
teraz] Zarejestrowano (BŁĘDNIE, patrz KOREKTA 2.6 powyżej) nexto.pl i
profinfo.pl jako "legalne księgarnie" w DR-03, w kontekście dyskusji o
znalezionym na Nexto pełnym pliku komentarza do KK o niepewnym statusie
prawnym (patrz flaga F-12).

**2.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
https://www.gov.pl/web/kgpsp — POTWIERDZONO (pobrano stronę
bezpośrednio) jako oficjalny (Rząd 1) portal Komendy Głównej Państwowej
Straży Pożarnej, z dedykowaną sekcją "Prawo" i systemem KSRG — treść W
WIĘKSZOŚCI aktualnościowo-wizerunkowa, sama sekcja "Prawo" NIE zbadana
szczegółowo (punkt startowy). Przy poszukiwaniu ANALOGICZNYCH portali
rządowych dla służb znaleziono **bip.kgp.policja.gov.pl** — oficjalny
portal Komendy Głównej Policji z WŁASNYM Dziennikiem Urzędowym
(edziennik.policja.gov.pl, elektroniczny od 2012 r.) i zarządzeniami
Komendanta Głównego. Dodano OBA do DR-13 jako źródła Rządu 1, z NOWĄ
uwagą o strukturze systemowej: dla służb mundurowych/agencji
bezpieczeństwa właściwym wzorcem jest STRUKTURA gov.pl/web/[skrót]
(każda służba ma własny portal w tej rodzinie), nie komercyjny portal
2B — ale treść tych portali jest w przeważającej części
wizerunkowo-informacyjna, wymagająca odrębnego zbadania sekcji
prawnych/zarządzeń dla oceny faktycznej przydatności merytorycznej.

**2.3 (2026-07-21):** Na polecenie użytkownika ("sprawdź niebezpiecznik
i szukaj dalej, a następnie zajmij się badaniem i dodawaniem kandydatów
do listy po ich weryfikacji"): **niebezpiecznik.pl** (✅✅, DR-11) —
bardzo znany, wieloletni portal cyberbezpieczeństwa, MOCNE pokrycie
NIS2/KSC2 z cytatami artykułów, śledzi głośne sprawy (Morele.net/UODO
z wyrokiem NSA) — UZUPEŁNIA poradyodo.pl (ten silniejszy w
cyberbezpieczeństwie, tamten w samym RODO). NASTĘPNIE zweryfikowano
WSZYSTKIE TRZY kandydatów z listy rekomendacji z wersji 2.2 —
**WSZYSTKIE TRAFIONE**: **e-prawnik.pl** (✅✅) — ROZWIĄZUJE wcześniej
odnotowaną lukę DR-03 (pełny Kodeks wykroczeń z komentarzem
artykuł-po-artykule, WCZEŚNIEJSZY wniosek o "braku dominującego
portalu" SKORYGOWANY w sekcji DR-03); **wirtualnemedia.pl** (✅✅) —
NOWA nisza prawa medialnego/prasowego (analogicznie do wcześniej
odkrytej niszy NGO), dodana do DR-11; **praca.pl** (✅✅) — wypełnia
lukę PERSPEKTYWY PRACOWNIKA w DR-04 (wcześniejsze portale tej sekcji
pisane były z perspektywy pracodawcy/kadr). Odnotowano METODOLOGICZNY
wniosek: WSZYSTKIE trzy kandydaty wybrane na podstawie KONKRETNEJ
analizy luk okazały się trafione, w przeciwieństwie do wcześniejszych
przypadkowych prób (wyborcza.pl, pb.pl, medonet.pl) — potwierdza to
wartość METODYCZNEGO podejścia. Zaktualizowano sekcję rekomendacji:
DR-03 usunięte z listy "wciąż niepokrytych" (pozostają DR-05, DR-15).

**2.2 (2026-07-21):** Na pytanie użytkownika "czy są jeszcze jakieś
ważne portale, których brakuje?" — WYKONANO WŁASNĄ analizę luk (nie
czekano na kolejne wskazania). Przetestowano **bezprawnik.pl** (✅✅,
DR-02) — jeden z NAJBARDZIEJ rozpoznawalnych ogólnie portali prawnych
w Polsce, dotąd nieobecny mimo wielu tur budowy tego rejestru — wynik
DOSKONAŁY (cytaty art. 563 KC, art. 45 ustawy o kredycie konsumenckim,
wyrok SN II CK 291/05). Dodano NOWĄ sekcję "REKOMENDACJE DO ZBADANIA
W PRZYSZŁOŚCI" — przemyślana, WŁASNA lista kandydatów z uzasadnieniem
(nie przypadkowe nazwy), podzielona wg priorytetu: WYSOKI (kandydaci
dla wciąż niepokrytych DR-03/DR-05/DR-15), ŚREDNI (redundancja dla
już pokrytych dziedzin), NISKI (specjalistyczne nisze: nieruchomości
deweloperskie, perspektywa pracownika zamiast pracodawcy w DR-04,
prawo medialne jako możliwa nowa nisza analogiczna do NGO).

**2.1 (2026-07-21):** ⭐⭐⭐ NAJWAŻNIEJSZE ustalenie tej tury — na
pytanie użytkownika "czy wszystkie DR wiedzą o tej bazie portali?"
sprawdzono SYSTEMATYCZNIE (grep) WSZYSTKIE 16 DR-skilli: ŻADEN nie
odwoływał się do tego rejestru, ANI DO shared/HIERARCHIA-ZRODEL.md.
Sprawdzono również orkiestrator prawny-router-v3 — RÓWNIEŻ nie ładował
żadnego z tych plików. NAPRAWIONO: dodano OBA pliki do required_modules
w prawny-router-v3/SKILL.md — TERAZ każde wywołanie routera (a więc
każdy DR-skill uruchamiany przez router) ma dostęp do kategoryzacji
wiarygodności źródeł i rejestru portali. Dodatkowo zbadano portale:
**prawakonsumenta.uokik.gov.pl** (✅, Rząd 1 — oficjalny portal UOKiK,
GOTOWE wzory pism reklamacyjnych, potencjalnie przydatne dla pisma-
proste-v2) oraz **medonet.pl** — ⚠️ TEST NIEUDANY dwukrotnie (różne
frazy), zero wyników z tej domeny mimo że to znana marka ogólnie —
odnotowano UCZCIWIE bez fabrykowania wartości portalu.

**2.0 (2026-07-21):** Na polecenie użytkownika: zbadano cztery portale.
**epodatnik.pl** (✅, DR-06) — ⭐ ODMIENNA funkcja od reszty sekcji:
PRZESZUKIWALNE ARCHIWUM rzeczywistych interpretacji podatkowych (nie
serwis komentarzowy), z wyszukiwarką wg przepisu/PKWiU/hasła —
wartościowe jako alternatywa dla oficjalnej bazy EUREKA. **ngo.pl**
(✅✅, DR-02) — WYPEŁNIA CAŁKOWICIE NOWĄ niszę, dotąd nieobecną w
rejestrze: prawo organizacji pozarządowych (fundacje, stowarzyszenia),
z precyzyjnymi cytatami (art. 7 ustawy o fundacjach, art. 10a Prawa o
stowarzyszeniach). **parp.gov.pl** (✅, Rząd 1) — potwierdzona oficjalna
agencja rządowa (Polska Agencja Rozwoju Przedsiębiorczości), NIE 2B —
dotacje/dofinansowania dla firm, bardzo aktualne nabory z konkretnymi
terminami do 2026/2027.

**1.9 (2026-07-21):** Na polecenie użytkownika: zbadano trzy wskazane
portale. **egospodarka.pl** (✅✅, DR-06/02) — bardzo szeroka oferta
(Podatki/Firma/Finanse/Prawo), komentarze nazwanych ekspertów
kancelaryjnych — ⚠️ ODNOTOWANO ZASTRZEŻENIE: jeden znaleziony artykuł
oznaczony wprost "wygenerowane przez AI", wymaga tej samej ostrożności
co inne źródła AI-generowane w rejestrze. **farmer.pl** (✅✅, DR-10) i
**wiescirolnicze.pl** (✅✅, DR-10) — OBA WYPEŁNIAJĄ dotąd niepokryty
aspekt "ROLNICTWA" (czwarty człon nazwy DR-10, wcześniej reprezentowany
wyłącznie przez rynekzdrowia.pl skupione na zdrowiu/farmacji) — oba
mają dedykowane sekcje prawne, śledzą na bieżąco dopłaty ARiMR, KRUS,
oraz PEŁNĄ, aktualną sagę legislacyjną ustawy "Aktywny Rolnik" (projekt
→ Sejm → weto prezydenta → obowiązujące zasady 2026).

**1.8 (2026-07-21):** Kontynuacja poszukiwań na polecenie użytkownika,
w tym zbadanie wskazanego linku https://problemykryminalistyki.
policja.pl/. POTWIERDZONO (pobrano stronę bezpośrednio): to OFICJALNY
(Rząd 1) kwartalnik naukowy Centralnego Laboratorium Kryminalistycznego
Policji — NISZA ODMIENNA od reszty rejestru (kryminalistyka/metodologia
dowodowa, NIE ogólne prawo karne), ze STRUKTURĄ w pełni akademicką (rada
naukowa, recenzenci, kodeks etyki). Dodano do DR-16, ze SZCZEGÓLNYM
odesłaniem do `analizator-dowodow-v3`. Przy poszukiwaniu kolejnych
dużych portali prawnych ODKRYTO **palestra.pl** (✅✅, oficjalne
czasopismo Naczelnej Rady Adwokackiej, archiwum od co najmniej 2013 r.)
i **temidium.pl** (✅, Okręgowa Izba Radców Prawnych w Warszawie) — OBA
WYPEŁNIAJĄ konkretnie brakujący aspekt "ZAWODY PRAWNICZE" w DR-12
(etyka, forma wykonywania zawodu, relacje adwokat/radca), którego
wcześniej zweryfikowane rp.pl/gazetaprawna.pl (skupione na SĄDOWNICTWIE/
TK) nie pokrywały — DR-12 ma TERAZ podwójne, komplementarne pokrycie
obu aspektów dziedziny.

**1.7 (2026-07-21):** Na polecenie użytkownika o portalach dla służb
oraz kolejnych dużych, uznanych portalach prawnych: **defence24.pl**
(✅ zweryfikowany, DR-13 — ale z ISTOTNYM zastrzeżeniem: treści w
większości STARSZE [2013-2017], profil dziennikarsko-analityczny, NIE
głęboki komentarz prawny). DR-13 potwierdzone jako CZWARTA dziedzina
bez dominującego portalu 2B (dołącza do DR-03/05/15) — nisza
zdominowana przez oficjalne strony ABW/SKW. Przy okazji testowania
wyborcza.pl (⚠️ TEST NIEUDANY — zero wyników z tej domeny) ODKRYTO
**curia.europa.eu** — oficjalną bazę orzeczeń TSUE w języku polskim
(Rząd 1), która WYPEŁNIA częściowo DR-14, analogicznie do sytuacji
DR-16 (treść orzeczeń → źródło urzędowe, nie komentarz 2B). Dodano
**bankier.pl** (✅✅ zweryfikowany, DR-06 — silne śledzenie procesu
legislacyjnego na bieżąco, artykuły z dni nie tygodni). PO tej turze:
WSZYSTKIE 16 dziedzin DR + sekcja specjalna niepełnosprawności zostały
przebadane co najmniej raz — brak dziedzin całkowicie nietkniętych w
tym rejestrze.

**1.6 (2026-07-21):** Na wskazanie użytkownika (szukanie dużych,
autorytatywnych źródeł jak "Dziennik Gazeta Prawna" o wyrobionej
pozycji): zweryfikowano EMPIRYCZNIE dwa GENERALISTYCZNE, prestiżowe
dzienniki. **gazetaprawna.pl** (wydawca INFOR PL S.A.) — status
PODNIESIONY z 📚 (znane) na ✅✅ (w pełni zweryfikowane) — test na
"wyrok SN 2026" dał wynik doskonały, artykuły z BIEŻĄCEGO tygodnia,
precyzyjne sygnatury spraw. **rp.pl** (Rzeczpospolita) — NOWO dodane,
✅✅ — test na "wyrok TK" ujawnił GŁĘBOKĄ, wieloartykułową analizę
sporu ustrojowego wokół legitymacji Trybunału Konstytucyjnego
(sędziowie "dublerzy", publikacja wyroków w Dz.U.), z aktualizacjami
do czerwca 2026 i precyzyjnymi sygnaturami (SK 50/22, I KZP 5/23).
rp.pl WYPEŁNIA częściowo DR-12 (Sądownictwo/Prokuratura/Zawody
Prawnicze) — dziedzina PRZENIESIONA z "brak testu" do "potwierdzone".
Zaktualizowano podsumowanie: TYLKO DWIE dziedziny (DR-13, DR-14)
pozostają bez żadnego świeżego testu, zamiast trzech.

**1.5 (2026-07-21):** Na polecenie użytkownika o zbadaniu kolejnych DR
bez bazy portali: przetestowano TRZY dziedziny. DR-05 (Administracyjne)
— UCZCIWIE odnotowano BRAK dominującego portalu 2B (nisza zdominowana
przez firmy szkoleniowe i sklep Wolters Kluwer), analogicznie do DR-03.
DR-15 (Compliance) — RÓWNIEŻ brak dominującego portalu (nisza
zdominowana przez firmy doradcze typu "Wielka Czwórka" i treści
międzynarodowe; zgadywana domena "compliance.com.pl" okazała się
przypadkowym biurem księgowym). DR-16 (Orzecznictwo) — ODMIENNE,
WAŻNE ustalenie: brak portalu 2B TU NIE JEST luką — dla treści
orzeczeń WŁAŚCIWYM źródłem SĄ oficjalne bazy Rzędu 2A
(orzeczenia.ms.gov.pl, saos.org.pl), już znane systemowi — komentarz
2B przychodzi dopiero PO ustaleniu treści z wyższego rzędu.
Zaktualizowano podsumowanie: teraz TYLKO TRZY dziedziny (DR-12, 13, 14)
pozostają bez ŻADNEGO świeżego testu — WSZYSTKIE pozostałe 13 z 16 DR
mają już albo potwierdzony portal, albo uczciwie odnotowany, świadomy
brak dominującego źródła w danej niszy.

**1.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
portal-sow.pfron.org.pl — POTWIERDZONO jako oficjalny portal PFRON
(Rząd 1, System Obsługi Wsparcia). Zbadano IPON i POPON: POPON
(popon.pl) potwierdzono jako realną organizację pracodawców osób
niepełnosprawnych (od 1995 r.) — ✅ dodano jako Rząd 2B z zastrzeżeniem
charakteru rzeczniczego (advocacy); przy okazji odkryto OBPON.org
(analogiczna organizacja). IPON (ipon.pl/ipon.org.pl) zweryfikowano
jako REALNY, długoletni portal (od 2002 r.), ALE UCZCIWIE odnotowano,
że to portal SPOŁECZNOŚCIOWY/RANDKOWY, NIE serwis prawny — NIE
kwalifikuje się jako źródło 2B dla analizy prawnej. Kontynuowano
poszukiwanie kolejnych portali 2B — dla DR-11 znaleziono ZDECYDOWANIE
lepszego kandydata niż wcześniejsze di.com.pl: **poradyodo.pl** (✅✅,
autorstwo radców prawnych, cytaty art. 37-39 RODO, treści datowane
czerwiec/lipiec 2026) — DR-11 PRZENIESIONE z kategorii "wynik mieszany"
do "potwierdzone". Zaktualizowano sekcję podsumowującą stan pokrycia:
teraz TYLKO SZEŚĆ dziedzin (DR-05, 12, 13, 14, 15, 16) pozostaje bez
świeżego testu, zamiast siedmiu.

**1.3 (2026-07-21):** Na polecenie użytkownika: dodano/potwierdzono
infor.pl (✅✅ doskonały wynik dla DR-06 przez subdomenę
ksiegowosc.infor.pl — bardzo aktualne, wyrok NSA z lutego 2026 r.,
KSeF, JPK_VAT — DRUGI, równoważny filar obok gofin.pl), podatki.biz
(✅ potwierdzony, DR-06, portal TaxNet). Przy okazji szerszego
wyszukiwania ODKRYTO organicznie DWA dedykowane portale dla DR-08
(samorzad.infor.pl, prawodlasamorzadu.pl) — RZADKI przypadek dziedziny
z DWOMA wyspecjalizowanymi portalami. Dodano OBSZERNĄ sekcję
"STAN POKRYCIA WSZYSTKICH 16 DR" — bezpośrednia, uczciwa odpowiedź na
pytanie użytkownika, KTÓRE dziedziny mają potwierdzony portal (DR-02,
04, 06, 07, 08, 09, 10 + niepełnosprawność), które mają wynik mieszany
(DR-04 dodatkowo, DR-11), która ŚWIADOMIE nie ma dominującego portalu
(DR-03), oraz KTÓRE siedem dziedzin (DR-05, 11, 12, 13, 14, 15, 16)
NADAL nie mają ŻADNEGO świeżego testu w tej sesji — wskazane jako
priorytet dla ewentualnej kolejnej tury.

**1.2 (2026-07-21):** Kontynuacja budowy na polecenie użytkownika —
prawo pracy, prawo karne/wykroczeniowe, budownictwo, gospodarka i
firmy. Zweryfikowano EMPIRYCZNIE: kodekspracy.pl (✅ doskonały, DR-04,
prawdopodobnie część rodziny GOFIN), muratorplus.pl (✅ doskonały,
DR-09, strona REGULACYJNA/proceduralna — komplementarna do
prawniknabudowie.com, które pokrywa spory KONTRAKTOWE), poradnik-
przedsiebiorcy.pl (✅ doskonały, DR-02, zakładanie spółek/JDG z
konkretnymi kwotami i terminami — UPGRADE statusu z 📚 na ✅). DLA
DR-03 (prawo karne/wykroczenia) — UCZCIWIE odnotowano BRAK jednego,
dominującego portalu redakcyjnego analogicznego do gofin.pl — niszę
zdominowały indywidualne blogi kancelaryjne (Rząd 3) i strony-rankingi
o wątpliwej wiarygodności — zalecono korzystanie z GENERALISTYCZNYCH
portali 2B z zawężonym zapytaniem zamiast poszukiwania jednego
specjalisty. Odnotowano RÓWNIEŻ nieudany test pb.pl (Puls Biznesu,
DR-02) — zapytanie zwróciło wyłącznie niepowiązane wyniki (Wikipedia,
baza LEI, szablony umów).

**1.1 (2026-07-21):** Dodano SEKCJĘ SPECJALNĄ dla osób niepełnosprawnych
(priorytet użytkownika) — zweryfikowano EMPIRYCZNIE niepelnosprawni.pl
(✅✅ wynik DOSKONAŁY — sekcja "Prawnik radzi" z cytatami konkretnych
sygnatur TK/SN i artykułów ustaw, np. TK SK 2/17) oraz integracja.org
(✅ ta sama platforma redakcyjna, dodatkowo audyty dostępności i
nazwany ekspert prawny). Odnotowano WYRAŹNE ostrzeżenie: niepelnosprawni.gov.pl
i gov.pl/web/rodzina to ORGANY RZĄDOWE (Rząd 1), NIE mylić z portalami
2B mimo podobnych nazw. Dodano też portalzp.pl (✅ zweryfikowane, DR-07
zamówienia publiczne, z zastrzeżeniem częściowej płatności treści).

**1.0 (2026-07-21):** Utworzenie rejestru na wyraźne żądanie
użytkownika. Przetestowano EMPIRYCZNIE (zapytania `site:` na żywo) sześć
portali: prawo.pl (✅ doskonały, ogólny), gofin.pl + 4 subdomeny (✅
doskonały, DR-06), prawniknabudowie.com (✅ dobry, DR-09, spory
kontraktowe), prawnikpodpowienabudowie.pl (✅ dobry, DR-09, ODRĘBNY od
DR-04, prawdopodobnie zorientowany na szkolenia/kalkulatory nie
artykuły), rynekzdrowia.pl (✅ doskonały, DR-10, bardzo aktualny),
di.com.pl (⚠️ ogólny wynik pozytywny, ale artykuły częściowo datowane
na 2018 r., DR-11, traktować jako kontekst nie główne źródło). Dla
POZOSTAŁYCH dziedzin (DR-02, DR-03, DR-05, DR-07, DR-08, DR-12, DR-13,
DR-14, DR-15, DR-16) wykorzystano ISTNIEJĄCĄ listę z `HIERARCHIA-
ZRODEL.md` (oznaczone 📚) oraz DODANO przykładowe wzorce nazw domen
typowych dla danej branży jako PUNKTY STARTOWE (oznaczone ⚠️ NIE
testowane) — UCZCIWIE nierozróżniane od faktycznie zweryfikowanych,
zgodnie z zasadą braku fabrykowania pewności.

---

## PRAWO-HARDGATE — historia wersji

Przeniesiona z korpusu `shared/PRAWO-HARDGATE.md` 2026-09-10b (F-180, ZASADA 15).

⛔ Historia zmian tego pliku NIE mieszka tutaj (ZASADA 15 w
`audyt-systemu-v4/SKILL.md`). Do 2026-08-23h **88 linii changelogu stało POWYŻEJ
pierwszej normy** — każdy z 114 plików odsyłających do tej bramki czytał opisy
wersji 2.0–2.6, zanim dotarł do zakazu. Przeniesione do:

```
view shared/references/CHANGELOG.md
```

---

## 3.32 (2026-09-10b, F-180) — PRAWO-HARDGATE: wydzielenie gałęzi warunkowych

`PRAWO-HARDGATE.md` jest jedynym zasobem czytanym **bezwarunkowo w każdej turze
prawnej** i stanowił 41 kB z ok. 100 kB rdzenia R-1…R-5. Pomiar 2026-09-10b:
z 704 linii **236 opisywało gałęzie, które w typowej sprawie nie padają ani razu.**

Wydzielone bez zmian merytorycznych:

| Nowy plik | Treść | Wyzwalacz |
|---|---|---|
| `PRAWO-HARDGATE-BLOKADA.md` | BRAMKA ANTY-FASADOWA + KOTWICA URZĘDOWA (201 l.) | B-1/B-2 zwrócił blokadę i kanał kodu też zawiódł |
| `PRAWO-HARDGATE-AKT-MIEJSCOWY.md` | ŚCIEŻKA B-L (35 l.) | przedmiotem sprawy jest akt prawa miejscowego |

Historia wersji przeniesiona do tego pliku (ZASADA 15).
Wynik: **40,9 kB → 28,7 kB (−30%)**, rdzeń ok. 100 kB → ok. 88 kB.

⛔ **Ryzyko wydzielenia i jak zamknięte.** Wydzielenie bramki, która pilnuje
przed obejściem procedury, tworzy oczywistą pokusę: pominąć odczyt i od razu
oznaczyć 🟨. Dlatego w korpusie zostały **twarde zaślepki**, nie odesłania:
- rozgałęzienie TAK/NIE z jawnym `⛔ STOP` i wywołaniem `view`,
- zakaz nadania 🟨 oraz ⚠️ przed wykonaniem tego `view` — znacznik nadany
  wcześniej jest nieważny,
- przypomnienie, że Reguła 12d (REM-0) wymaga pomiaru dwukanałowego, którego
  procedura leży w wydzielonym pliku,
- powiązanie z kontrolą `[PROFIL-ODROCZENIA]`, która traktuje „blokada padła,
  `view` nie ma" jako bramkę niewykonaną.

⛔ Kolejność wewnątrz `PRAWO-HARDGATE-BLOKADA.md` pozostaje wiążąca: najpierw
bramka antyfasadowa, potem kotwica. Bramka istnieje po to, żeby kotwica nie
stała się wygodnym wyjściem awaryjnym.

⚠️ Czego to wydzielenie **nie** rozstrzyga: czy w sytuacji blokady model
faktycznie wykona `view`, zamiast go zadeklarować. To jest dokładnie pytanie
z protokołu F-113 i pozostaje niezmierzone.

---

## 3.33 (2026-09-10d, F-160) — odesłania operacyjne rozdzielone od dowodowych

`PRAWO-HARDGATE.md` i `HIERARCHIA-ZRODEL.md` wskazywały
`audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md` jako źródło
**instrukcji** dostępu maszynowego. ⛔ `audyt-systemu-v4` nie występuje
w `dependencies.requires` żadnego skilla produkcyjnego, więc były to wskazania
**nieosiągalne ze ścieżki produkcyjnej** — dokładnie wzorzec, dla którego
powstała flaga F-160.

Rozdzielone: instrukcja → `shared/DOSTEP-MASZYNOWY-API.md` (w `required_modules`
routera), plik audytu → materiał dowodowy pomiaru, przywoływany jako dowód
i opatrzony adnotacją o niedostępności z produkcji.

---

## 3.35 (2026-09-10n, F-181) — 41 wygasłych podstaw prawnych zastąpionych aktualnymi

`shared` niósł **dwie trzecie całej zaległości F-181**: 41 z 61 miejsc, 20 aktów.
Koncentracja w `orka-bas-leksykon`, który cytuje podstawy **w treści definicji**,
a nie w nagłówku — przez co omijały go wszystkie dotychczasowe przeglądy.

| Akt | Było | Jest | Miejsc | KROK 2C |
|---|---|---|---:|---|
| ustawa o finansach publicznych | 2024/1530 | **2025/1483** | 13 | ⛔ 5 nowelizacji |
| ustawa o dochodach JST | 2022/2267 | **2024/1572** ⛔ nowa ustawa | 5 | zm. 2025/1659 |
| ustawa o gospodarce nieruchomościami | 2023/344 | **2026/399** | 2 | ⛔ 1 |
| Karta Nauczyciela | 2023/984 | **2026/515** | 2 | 0 |
| ustawa o VAT | 2024/361 | **2025/775** | 2 | ⛔ 5 |
| KPK | 2024/37 | **2026/490** | 2 | ⛔ 5 |
| ustawa rehabilitacyjna | 2024/44 | **2026/884** | 2 | 0 |
| PZP | 2022/1710, 2024/1320 | **2026/793** | 2 | 0 |
| pozostałe 12 aktów | — | — | po 1 | — |

Pozostałe: podatek rolny `2025/1344`, rozporządzenie MRPiPS `2026/677`,
zatrudnienie socjalne `2025/1718`, obrona Ojczyzny `2025/825` (⛔ 5),
prawo autorskie `2025/24`, AML `2025/644` (⛔ 1), KWiH `2026/1066`,
Prawo energetyczne `2026/43` (⛔ 3), PPSA `2026/143` (⛔ 1),
pomoc społeczna `2026/639` (⛔ 2), Prawo upadłościowe `2026/913`.

⛔ **Dochody JST — jedyny przypadek, który nie był zwykłym starzeniem.**
Wskazany przez pomiar „aktualny" tekst jednolity `2024/356` **też ma status
uchylony**: stara ustawa z 2003 r. została zastąpiona **nową ustawą** z 1.10.2024
(`Dz.U. 2024 poz. 1572`). Automatyczne podstawienie przesunęłoby błąd o jedno
ogniwo dalej, zamiast go usunąć.

⛔ Każda z 20 par sprawdzona przez **porównanie tytułów** starego i nowego
obwieszczenia — po sześciu podmianach aktu w tej serii to element procedury,
nie formalność.

---

## 3.36 (2026-09-10q, F-135) — reforma antymobbingowa: vacatio legis, nie stan obowiązujący

`definicje/DEF-PRACA.md` opisywał nowe brzmienie art. 94³ KP jako obowiązujące
„PO REFORMIE (od 30.07.2026)". ⛔ 30.07.2026 to **data podpisu Prezydenta**.
Odczyt RZĄD 1 (`api.sejm.gov.pl/eli/acts/DU/2026/1046`, 2026-09-10):

```
ogłoszenie      : 2026-08-04
WEJŚCIE W ŻYCIE : 2026-11-05
status          : obowiązujący  (= akt nie został uchylony)
```

⛔ **To był błąd zakresu czasowego normy** — klasa, której pilnuje OŚ-GATE,
popełniony w zasobie kanonicznym `shared`. Sprawa o mobbing z sierpnia albo
września 2026 dostawała przepis, który jeszcze nie obowiązuje: bez wymogu
rozstroju zdrowia i z minimalnym zadośćuczynieniem, których w tej dacie nie ma.

Dodana reguła czasowa w tabeli: zdarzenia **przed 5.11.2026** → stare brzmienie
(wymóg rozstroju zdrowia, brak minimum, brak art. 477⁶ᵃ KPC); **od 5.11.2026** →
nowe.

⚠️ Wpisane wprost: **„status: obowiązujący" w ELI nie znaczy, że przepisy
działają.** Oznacza, że akt nie został uchylony; o stosowaniu rozstrzyga osobne
pole `entryIntoForce`. To rozróżnienie nie było dotąd nigdzie zapisane, a jest
źródłem tej pomyłki.

⚠️ Kwota minimalnego zadośćuczynienia sprowadzona do **mnożnika ustawowego**
(6 × minimalne wynagrodzenie). Wartość złotowa zależy od minimalnego
wynagrodzenia w dacie orzekania i wymaga sprawdzenia w aktualnym rozporządzeniu
Rady Ministrów — poprzedni zapis podawał 28 836 zł jako liczbę do przepisania.

---

## 3.37 (2026-09-10r, O-10) — cezury czasowe dla aktów w vacatio legis

`AKTY-PRAWNE-MASTER.md` i `LEGAL-REGISTRY.md` wymieniały w kolumnie zmian numery
aktów, które **jeszcze nie weszły w życie**, bez podania daty:
`Dz.U. 2026 poz. 507` (w życie 14.10.2026), `2026/346` (30.09.2028),
`2026/176` (18.02.2027), `2026/846` (1.10.2026).

⛔ Model czytający „zmiany Dz.U. 2026 poz. 507" nie ma jak odróżnić zmiany
**działającej** od tej w vacatio legis — a skutek jest taki sam jak przy
powołaniu przepisu nieobowiązującego. Dopisane cezury.

⚠️ Sygnał słabszy niż numer podany wprost jako podstawa (tam błąd jest
bezpośredni), ale realny: rejestr zmian jest czytany właśnie po to, żeby
ustalić stan na dziś.

---

## 3.38 (2026-09-10s, F-135) — błędna kwota minimalnego wynagrodzenia

`orka-bas-leksykon/czesc-05` podawał minimalne wynagrodzenie 2026 jako
**„~4 750 zł"**. Odczyt **treści** rozporządzenia RM (`Dz.U. 2025 poz. 1242`,
`/text.pdf`): „§ 1. Od dnia 1 stycznia 2026 r. ustala się minimalne wynagrodzenie
za pracę w wysokości **4806 zł**". Skorygowane.

⚠️ Kwota podana „w przybliżeniu" jest w rejestrze prawnym tym samym co kwota
błędna — służy do przeliczeń (tu: krotność progu 200 000 zł), więc jej
przybliżenie propaguje się na wynik.

⛔ To jest pierwszy w tej serii błąd **wartości liczbowej**, nie numeru aktu.
Żaden test tej klasy nie dotyka: T27 pyta o status podstawy, nie o to, czy
liczba w zdaniu odpowiada treści przepisu. Zweryfikować można wyłącznie
odczytem tekstu aktu.

---

## 3.39 (2026-09-10t, O-11) — TABELE-OPLAT: kolejność sięgania po kwoty

Nowy zasób kanoniczny. Reguła: **kwotę bierze się z tabeli, która ją ustanawia,
a nie z bazy, która ją opisuje.**

```
1. TABELA USTANAWIAJĄCA — KSCU, rozporządzenia MS o taksach, rozporządzenie RM
                          o minimalnym wynagrodzeniu. Odczyt TREŚCI aktu.
2. BAZA KATALOGUJĄCA    — MP10-koszty, mapy DR, leksykon. Rozpoznaje RODZAJ
                          opłaty i to, ZA CO jest pobierana. NIE źródło liczby.
3. RZĄD 2A/2B           — wyłącznie do rozpoznania problemu, nigdy do kwoty.
```

⛔ **Ustalenie, dla którego ten plik powstał: art. 13 ust. 2 KSCU.**
Tekst jednolity `Dz.U. 2025 poz. 1228` zawiera **dwa brzmienia tego przepisu**,
stojące obok siebie i rozróżnione **wyłącznie odnośnikami**:

| Odnośnik | Cap opłaty stosunkowej | Status |
|---|---|---|
| 2) | 200 000 zł | obowiązuje **do wejścia w życie** zmiany z odnośnika 3 |
| 3) | **100 000 zł** | ustawa z 25.07.2025 (`Dz.U. 2025 poz. 1157`), **w życie 23.09.2025** |

Na dziś obowiązuje **100 000 zł**. Powszechnie powtarzana kwota 200 000 zł jest
nieaktualna od września 2025 — a jest to jedna z najczęściej cytowanych liczb
w postępowaniu cywilnym. ⛔ Kto czyta tekst jednolity bez przypisów, przepisze
brzmienie wygasłe.

⚠️ Klasa błędu: lustrzana wobec O-10. Tam norma jeszcze nie obowiązywała, tu
w jednym dokumencie stoją obok siebie brzmienie wygasłe i obowiązujące.

**Zweryfikowane odczytem treści i wpisane do tabel:** art. 13 ust. 1 (progi
opłat stałych 30–1000 zł do WPS 20 000 zł), art. 13 ust. 2 (5%, cap 100 000 zł),
art. 22 (zażalenia — 100 zł), **art. 96 ust. 1 pkt 2 (zwolnienie strony
dochodzącej roszczeń alimentacyjnych oraz pozwanej w sprawie o obniżenie
alimentów)**, taksy `2026/215` i `2026/118` (obie najnowsze, zero nowelizacji
po tekście jednolitym).

⛔ **W sprawach alimentacyjnych pierwsze pytanie nie brzmi „ile wynosi opłata".**
Podanie kwoty stronie zwolnionej z mocy ustawy zniechęca do wniesienia pisma,
które nic nie kosztuje — błąd cięższy niż kwota nieprawidłowa.

⚠️ WPS w alimentach oznaczony jako **[DO WERYFIKACJI U ŹRÓDŁA — art. 22 KPC]**.
Reguła roszczeń powtarzających się nie została przepisana z pamięci ani z bazy
katalogującej; wymaga odczytu bieżącego tekstu KPC.

---

## 3.40 (2026-09-10u, O-11) — TABELE-OPLAT 1.1: alimenty od podstaw

Uzupełnienie zgodnie z regułą kolejności: **najpierw przepis, który ustanawia**.

**Art. 22 KPC** (t.j. `Dz.U. 2026 poz. 468`, odczyt treści) — zastąpił
zostawiony wcześniej znacznik `[DO WERYFIKACJI]`:

> W sprawach o prawo do świadczeń powtarzających się wartość przedmiotu sporu
> stanowi **suma świadczeń za jeden rok**, a jeżeli świadczenia trwają krócej
> niż rok – za cały czas ich trwania.

Dodano art. 21 KPC (zliczanie wartości kilku roszczeń) oraz ostrzeżenie, że przy
żądaniu **podwyższenia** WPS liczy się od różnicy — z jawnym zastrzeżeniem, że
to nie wynika wprost z art. 22 i przy sprawie granicznej wymaga orzecznictwa.

**Art. 135 KRO** (t.j. `Dz.U. 2026 poz. 236`, odczyt treści) — nowa sekcja 2a:

- **§ 1 — dwie przesłanki, nie jedna**: usprawiedliwione potrzeby uprawnionego
  ORAZ zarobkowe i majątkowe możliwości zobowiązanego. ⚠️ „Możliwości
  zarobkowe" ≠ „dochód faktyczny".
- **§ 2 — osobiste starania są formą wykonania obowiązku**, nie okolicznością
  łagodzącą. Pominięcie zaniża żądanie strony sprawującej bieżącą pieczę.
- **§ 3 — świadczeń z pomocy społecznej i funduszu alimentacyjnego NIE ODLICZA
  SIĘ.** Argument „dziecko dostaje świadczenia, więc alimenty mogą być niższe"
  jest wprost sprzeczny z przepisem.

Tabela przesłanek art. 128, 129 §1–2, 130, 133 §1–3, 138, 140 §2 — przepisana
z treści, nie z pamięci. ⛔ Odnotowane, że **art. 133 § 1 nie zna granicy
wieku**: kryterium to zdolność do samodzielnego utrzymania, a uchylenie się
wobec dziecka pełnoletniego wymaga wykazania przesłanki z § 3, nie następuje
z mocy prawa.

---

## 3.41 (2026-09-10v, O-11) — TABELE-OPLAT 1.2: taksy z odczytu treści

Domknięcie warstwy kosztowej. Odczyt treści obu rozporządzeń
(`Dz.U. 2026 poz. 215` adwokackie, `Dz.U. 2026 poz. 118` radcowskie) —
**w zbadanym zakresie tabele są identyczne**.

**§ 2 — stawki od wartości przedmiotu sprawy:** 90 zł (do 500 zł), 270, 900,
1 800, 3 600, 5 400, 10 800, 15 000, **25 000 zł** (powyżej 5 mln).

⚠️ **§ 3 — postępowania upominawcze, elektroniczne upominawcze, nakazowe
i europejskie nakazowe mają WŁASNĄ, NIŻSZĄ tabelę** (60/180/600 zł…). Nie
stosować tabeli z § 2 w tych trybach — to osobny, łatwy do przeoczenia przepis.

⛔ **§ 4 — sprawy rodzinne: stawka NIE zależy od WPS.**

| Sprawa | Stawka |
|---|---|
| **alimenty** | **240 zł** |
| rozwód i unieważnienie małżeństwa | 720 zł |
| rozdzielność majątkowa | 720 zł |
| ojcostwo (ustalenie/zaprzeczenie), rozwiązanie przysposobienia | 480 zł |
| istotne sprawy rodziny, zarząd majątkiem wspólnym | 480 zł |
| podział majątku wspólnego | stawka z §2 od **wartości udziału**; zgodny wniosek — 50% |

⛔ **Najczęstszy błąd w tej materii:** policzenie stawki alimentacyjnej z tabeli
WPS. Przy rocznej sumie świadczeń 4 800 zł tabela z §2 daje 900 zł, a przepis
szczególny — **240 zł**. Zawyżenie blisko czterokrotne.

⚠️ Stawka rozwodowa obejmuje roszczenia majątkowe dochodzone łącznie,
**z wyjątkiem** roszczeń z art. 58 § 2 i 3 KRO.

⚠️ Sprawdzono celowo przypis przy pozycji alimentacyjnej: brzmienie ustalone
rozporządzeniem MS z 23.12.2024 jest **obowiązujące**, bez wariantu przyszłego.
⛔ To ta sama konstrukcja redakcyjna, która przy art. 13 ust. 2 KSCU kryła
brzmienie wygasłe obok obowiązującego — sprawdzenie przypisu przestało być
opcjonalne.

---

## 3.42 (2026-09-10w, O-11) — TABELE-OPLAT 1.3: pełny katalog zwolnień

⛔ **Luka wykryta na pytanie użytkownika: „czy to wszystkie sytuacje".**
Nie były. Plik w wersjach 1.0–1.2 wymieniał **wyłącznie art. 96 ust. 1 pkt 2**
(alimenty) — bo powstał przy pracy nad alimentami i odziedziczył jej zakres.
To jest ta sama klasa co „niedomknięcie" z AUDYT-2026-09-10g: zapis nie był
błędny, był **niepełny w sposób niewidoczny**, bo wyglądał na kompletny.

Dopisany katalog z odczytu treści KSCU (`Dz.U. 2025 poz. 1228`), **trzy
niezależne warstwy**:

**A. Podmiotowe z mocy ustawy (art. 96 ust. 1) — 18 kategorii.** Poza alimentami
m.in.: ustalenie ojcostwa i macierzyństwa, klauzule niedozwolone, **pracownik**
i odwołanie do sądu pracy i ubezpieczeń, kurator, prokurator i rzecznicy
(RPO, Praw Dziecka, Praw Pacjenta, Finansowy, MŚP), inspektor pracy i związki
zawodowe, ochrona zdrowia psychicznego, **osoba ubezwłasnowolniona**, szkody
górnicze, kompensata dla ofiar czynów zabronionych, ochrona roszczeń
pracowniczych, **osoba doznająca przemocy domowej**, renta z art. 444 § 2
i 446 § 2 KC.

**B. Przedmiotowe (art. 95) — „nie pobiera się opłat od…", niezależnie od tego,
kto wnosi.** ⛔ Najważniejsze praktycznie: **zażalenia i skargi dotyczące samych
kosztów** (odmowa lub cofnięcie zwolnienia, wysokość opłaty lub wydatków,
orzeczenia referendarza). To domyka pętlę — zaskarżenie decyzji o kosztach samo
nie kosztuje. Ponadto m.in. zażalenie na policyjny nakaz opuszczenia mieszkania
w sprawach przemocy domowej, pisma nieletniego, wniosek o doręczenie
uzasadnienia przy zwolnieniu od opłaty od środka zaskarżenia.

**C. Na wniosek (art. 100–103)** — w całości lub w części, z formami
częściowego zwolnienia. ⛔ **Art. 102 ust. 4 jest pułapką proceduralną:** wniosek
strony reprezentowanej przez adwokata lub radcę, złożony bez oświadczenia
majątkowego, przewodniczący **zwraca BEZ WEZWANIA** do uzupełnienia. Dla strony
działającej samodzielnie stosuje się art. 130 KPC. Termin rozpoznania: 7 dni.

⚠️ Wpisane wprost: **zwolnienie od kosztów sądowych ≠ zwolnienie od kosztów
przeciwnika.** Strona zwolniona, która przegra, może zostać obciążona kosztami
zastępstwa procesowego strony przeciwnej.

⚠️ Art. 96 ust. 4: przy **oczywiście bezzasadnym** powództwie o ustalenie
ojcostwa sąd może obciążyć powoda nieuiszczonymi kosztami — zwolnienie z pkt 1
nie jest bezwarunkowe.

⚠️ Art. 109 i 111 (cofnięcie zwolnienia, odpowiedzialność za nieprawdziwe
oświadczenie) **świadomie nieprzepisane** — odczytać przy sprawie, w której
zwolnienie ma być wnioskowane.

Do reguły kolejności dopisany **KROK 0: czy strona w ogóle płaci** — przed
sięgnięciem po jakąkolwiek tabelę.

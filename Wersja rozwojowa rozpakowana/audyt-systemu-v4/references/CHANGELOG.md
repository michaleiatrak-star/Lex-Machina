# CHANGELOG — audyt-systemu-v4

- 6.120 (2026-09-18): **AUDYT-2026-09-18 — odniesienia do skryptów `shared/tools/` sprostowane.** Skrypty bramki cytowań i przykładowe serwery MCP nie zostały przeniesione do `audyt-systemu-v4/scripts/` — nigdy nie trafiły do repozytorium (brak w całej historii gita). CHECKLIST-DEDUP: dwa wiersze oznaczone jako kod po stronie portalu; propagacja do `shared` 3.78.
- 6.119 (2026-09-16, F-189): **AUDYT-2026-09-17u — ⭐⭐ F-135 (część merytoryczna) ZAMKNIĘTA.** Akty UE odczytane przez Cellar; udokumentowany kanał i pomiary rozmiarów dla 6 aktów. WARN-OTWARTE: F-135 usunięta z rejestru (pozycje wykonalne 3 → 2).
- 6.118 (2026-09-16, F-189): **AUDYT-2026-09-17t — F-113: ramię kontrolne zbudowane.** build_ramie_kontrolne_f113.py: 5 bramek wyciętych, 36 plików posprzątanych (55 linii), ci_check_shared OK; hashe manifestów A i B zapisane. ⛔ Pomiar niewykonany — protokół wymaga promptu bez wiedzy o teście i oceny ślepej, a ta sesja zna bramki i przypisanie ramion; wymaga sesji niezależnej (ta sama bariera co F-167). WARN-OTWARTE: nowy status F-113 + warunki przekazania.
- 6.117 (2026-09-16, F-189): **AUDYT-2026-09-17s — pomiar kanałów.** T25 (grupa orzecznictwo, 19 sond) + sondy bezpośrednie: SAOS wrócił (3 endpointy), decyzje.uokik.gov.pl i CBOSA nadal 503, TK i KIO bez zmian konstrukcji. F-171 zawężona do jednej pozycji; F-183a, F-184, F-185 bez zmian.
- 6.116 (2026-09-16, F-189): **AUDYT-2026-09-17r.** Nowy T33 `scripts/check_wydanie.py` — zgodność wydanych paczek z drzewem (liczba plików, bajtowa identyczność, sumy wewnątrz ZIP); wdrożenie zalecenia z 17p, w orkiestratorze, selftest 4/4. Zawężona kolejka aktów UE: NIS2 i DORA bezprzedmiotowe (korpus nie cytuje ich wartości).
- 6.115 (2026-09-16, F-189): **AUDYT-2026-09-17q — ⭐ EUR-Lex odblokowany.** Akty UE są weryfikowalne w RZĘDZIE 1 (kanał wyszukiwarka → fetch); dotychczasowe zapisy „EUR-Lex niedostępny” (16h, 16k, 16l, 17o) nieaktualne. 3 usterki RODO. T28: W1-RODO-48h (selftest 52/52).
- 6.114 (2026-09-16, F-189): **AUDYT-2026-09-17p.** Domknięte pozycje po 17o: 2026/425 (zmiana punktowa FUS), etapy 2026/26 (art. 85a ust. 2 — 13.04.2026; art. 85c–85j i 85f — 1.01.2027; art. 34 — przepis przejściowy), art. 85f ust. 8 (trzech lekarzy). ⛔ Odnotowana niewyjaśniona zmiana kopii roboczej po wydaniu 17o (3 fragmenty, 2 pliki) wykryta przez T21 — treść zweryfikowana i zachowana; zalecenie: diff kopii z ZIP-em po wydaniu.
- 6.113 (2026-09-16, F-189): **AUDYT-2026-09-17o — F-135: prawo pracy i ubezpieczeń (ustawy szczególne).** 6 usterek; korekta własnego zapisu 16f. T28: W1-KPC-kasacja-30dni-SA, W1-Sygn-art12-terminy (selftest 50/50). WARN-OTWARTE: kolejka krajowa F-135 wyczerpana.
- 6.112 (2026-09-16, F-189): **AUDYT-2026-09-17n — F-135: sprawy rodzinne.** 6 usterek (w tym powrót błędnych terminów zaprzeczenia ojcostwa w kalkulatorze czesc-07). T28: W1-KRO-69-6mies, W1-KRO-70-3lata, W1-KRO-59-3mies (selftest 47/47). WARN-OTWARTE: postęp F-135.
- 6.111 (2026-09-16, F-189): **AUDYT-2026-09-16m — F-135: KPA i PPSA poza tabelą.** 10 usterek. T28: W1-PPSA-53par3-14dni, W1-KPA-160, W1-KPA-128-odwolanie-14 (selftest 44/44). WARN-OTWARTE: postęp F-135.
- 6.110 (2026-09-16, F-189): **AUDYT-2026-09-16l — F-135: u.o.d.o.** 7 usterek (w tym awans snapshotu NSA wbrew regule i nieistniejący art. 50 ust. 4). V-SYG-0 dla III OSK 1959/22: OUT_OF_SCOPE. T28: W1-UODO-art50-ust4, W1-UODO-237-KPA (selftest 41/41). WARN-OTWARTE: kolejka ustaw szczególnych wyczerpana w części krajowej.
- 6.109 (2026-09-16, F-189): **AUDYT-2026-09-16k — F-135: KSC po NIS2.** 6 usterek w dr-11. T28: W1-KSC-art16-terminy (selftest 39/39). WARN-OTWARTE: postęp F-135.
- 6.108 (2026-09-16, F-189): **AUDYT-2026-09-16j — F-135: środki ochrony prawnej w PZP.** 7 usterek. T28: W1-PZP-138-ponizej15, W1-PZP-odwolanie-wstrzymuje (selftest 38/38). WARN-OTWARTE: postęp F-135.
- 6.107 (2026-09-16, F-189): **AUDYT-2026-09-16i.** mapa_dzu: nowy t.j. ustawy tytoniowej `2026/1214` (ogłoszony 16.09.2026; wykryty przez T15 NEWER_TJ w dniu ogłoszenia). Dziennik: wpis 16i.
- 6.106 (2026-09-16, F-189): **AUDYT-2026-09-16h — F-135: postępowanie spadkowe (KPC).** Luka postaci 4 uzupełniona; EPS (art. 70 rozp. 650/2012) — EUR-Lex niedostępny maszynowo, wartość nieawansowana. WARN-OTWARTE: postęp F-135.
- 6.105 (2026-09-16, F-189): **AUDYT-2026-09-16g — F-135: terminy i progi KKS.** 24 jednostki z odczytu, 7 usterek. T28: W1-86-KKS-akcyzowy, W1-87-KKS-360 (selftest 36/36). WARN-OTWARTE: postęp F-135.
- 6.104 (2026-09-16, F-189): **AUDYT-2026-09-16f — F-135: terminy KC.** Dziennik: 25 jednostek z odczytu, 11 usterek (2 w kierunku niebezpiecznym). T28: W1-117-KC-6lat, W1-1007-otwarcie-testamentu, W1-4421-par3-20lat (selftest 34/34). WARN-OTWARTE: postęp F-135.
- 6.103 (2026-09-16, F-189): **AUDYT-2026-09-16e — O-11 zamknięta w całości.** (1) Nowy T32 `check_tabele_satelickie.py` (orkiestrator; selftest 9/9). (2) T27: klasa ZASTĄPIONY_TJ + filtr historyczny o „pierwotn”, „podmian”; przebieg: 6 martwych + 9 zastąpionych → 1 znany. (3) T28: W1-KC-2024-1360 (selftest 30/30). (4) WARN-OTWARTE: O-11 zamknięta.
- 6.102 (2026-09-16, F-189): **AUDYT-2026-09-16d.** (1) Nowy T31 `scripts/check_podmiana_aktu.py` — podmiana aktu w mapach niezależnie od oznaczenia „t.j.” (sieć, ręczny, selftest 3/3); 5 podmian wykrytych i usuniętych; 11 aliasów dopisanych po odczycie tytułów. (2) ALIASY: wiersz 2026/1195 uszkodzony przez podmianę numeru z 10r — naprawiony (T15 = 0 w obu trybach). (3) mapa_dzu: 2026/200, 2025/1154, 2024/101, 2023/1235. (4) WARN-OTWARTE: nieaktualne wiersze F-141, F-148, O-4 usunięte; O-11(d) zamknięta.
- 6.101 (2026-09-16, F-189): **AUDYT-2026-09-16c.** (1) Nowy T30 `scripts/check_utrata_tresci.py` — utrata treści bez cofnięcia numeru (tabele „było → jest” vs dysk + kolizje numerów), selftest 5/5, BLOKER orkiestratora; walidacja: 5+1 trafień na stanie sprzed napraw, 0 po. (2) T28: W1-kopaliny-2024-44, W1-UbezpObowLekarzy (selftest 29/29). (3) F-190 zamknięta. (4) REGRESSION-TEST-PLAN: sekcja T30.
- 6.100 (2026-09-16, F-189): **AUDYT-2026-09-16b — T11, T5, F-OP-2026-09, rekonstrukcja treści.** (1) T11: `2026/174` dopisana do mapy (włączona do t.j. 2026/619) + `2026/454`. (2) T5: nowy `scripts/check_widmowe_pokrycie.py` (kandydaci, selftest 4/4, status ręczny); 30 kandydatów → 2 widma, 2 podmiany aktu, 11 błędnych wskaźników; nowa flaga F-190. (3) F-OP-2026-09 zamknięta; korekta 12i (poz. 1098 nie dotyka art. 70). (4) Rekonstrukcja z dziennika: utracona naprawa `dr-09` z 10l (bez cofnięcia numeru — kolizja 3.29); F-189 — co najmniej dwie fale nadpisań. ⚠️ Numer 6.100 (nie 7.0): kolejny minor; porównanie T12 jest krotkowe, (6,100) > (6,99).
- 6.99 (2026-09-16, F-189): **F-189 — regresje dyskowe w 10 skillach; ślepa plamka T12; T28/T29 w orkiestratorze.** Wpis AUDYT-2026-09-16. (1) T12: parser dziennika nie widział wielowierszowych bloków „Wersje:” — zgłaszał 1 regresję z 10; teraz skleja blok, wiersze tabel pozostają jednostkami, numer liczy się tylko za samodzielną nazwą skilla (nie za ścieżką `shared/…`, nie w prozie). (2) T22: zarejestrowane F-187-…md, check_wartosci_prawne.py, check_oplaty_mapa.py, weryfikator_sygnatur.py. (3) Orkiestrator: T28 i T29 wpięte jako blokery (T28 miał 20 FAIL niewidocznych w wyniku). (4) SKRYPTY-RECZNE: weryfikator_sygnatur.py.
- 6.98 (2026-09-14): **CBOSA snapshot/retrieval — oddzielenie bogactwa treści od siły provenance.** Dwa niezależne ustalenia: (1) `site:orzeczenia.nsa.gov.pl` nie jest filtrem domenowym i potrafi zwracać obce hosty — `shared` 3.61 dodaje V-SYG-0.5.1a POST-CHECK HOSTA przed exact-match; (2) snapshot oficjalnego `/doc/{ID}` może być znacznie bogatszy niż snippet. Próba 10 realnych sygnatur: 10/10 metryka+sentencja, 5/10 pełne uzasadnienie, 2/10 uzasadnienie bez dowodu kompletności, 3/10 bez potwierdzonego uzasadnienia. `CRAWLED_OR_INDEXED` jest provenance, nie piątym statusem; `WERYFIKACJA-SLAD` 1.7 utrzymuje ✅/⚠️. F-183a pozostaje otwarta tylko dla pozytywnego DIRECT_LIVE w runtime docelowym.
- 6.97 (2026-09-14): **CBOSA — integracja z kanonicznym routingiem źródeł i korekta zakresu F-183a.** `shared/CBOSA-ADAPTER.md` stał się SSOT kontraktu direct HTML dla NSA/WSA; `HIERARCHIA-ZRODEL` RZĄD 2A, `SYGNATURY` V-SYG-0.7, `DOSTEP-MASZYNOWY-API`, `PRAWO-HARDGATE-ORZECZENIA`, `MCP-INTEGRACJA` i rejestr konektorów kierują system: MCP-FIRST → direct CBOSA → dopiero fallback V-SYG-0.5. Parser hardened fail-closed i testy 22/22 PASS. F-183a NIE została sztucznie zamknięta: luka strukturalna jest usunięta, pozostaje wyłącznie kontrolowany live probe w docelowym runtime. Historyczny pomiar 503 z 2026-09-13d oznaczony jako środowiskowy, nie globalny.
- 6.96 (2026-09-13b): **weryfikacja trzech luk z PPWR/EUDR.** Wpis AUDYT-2026-09-13b. (1) USTALENIE POZYTYWNE: polska ustawa o gospodarce opakowaniami NIE ZOSTALA dostosowana do PPWR - KROK 2C na DU/2013/888 dal zero nowelizacji po t.j. Dz.U. 2026 poz. 619 (30.04.2026), a ostatnia zmiana Dz.U. 2026 poz. 174 z 9.01.2026 dotyczy systemu kaucyjnego i po odczycie tekstu ma ZERO odeslan do rozp. 2025/40; ostatnia zmiana ustawy jest o siedem miesiecy starsza niz data stosowania rozporzadzenia. (2) USTALENIE NEGATYWNE O WASKIM ZAKRESIE: przeszukanie ELI po tytule dla EUDR dalo zero wynikow, ale wykazano tylko brak aktu O TAKIM TYTULE - przepis moglby byc w ustawie o lasach albo o IOS; ograniczenie metody zapisane w module i ROUTING-MAP. (3) PROBA NIEROZSTRZYGNIETA: akt wykonawczy z art. 12 ust. 6 PPWR - wyszukiwarka EUR-Lex wymaga przegladarki; zapisane jako nierozstrzygniete, NIE jako brak aktu. ⭐ Wniosek metodologiczny: luka opisana jako zamknieta, gdy sprawdzono tylko jeden jej wymiar, jest gorsza niz luka otwarta, bo nikt do niej nie wroci
- 6.95 (2026-09-13): **PPWR i EUDR — dwa rozporzadzenia UE, ktorych system nie znal.** Wpis AUDYT-2026-09-13. Zero wystapien w dr-09/MAPA-AKTOW i w ROUTING-MAP. PPWR (UE) 2025/40: stosuje sie od 12.08.2026, czyli JUZ OBOWIAZUJE; uchyla dyrektywe 94/62/WE z dwoma wyjatkami. ⛔⛔ EUDR (UE) 2023/1115: data stosowania PRZESUWANA DWUKROTNIE — obowiazuje 30.12.2026 / 30.06.2027, a powtarzane 30.12.2025 i 30.06.2026 sa nieaktualne. ⭐ PODRECZNIKOWY PRZYPADEK O-12 w wersji unijnej: ten sam CELEX, ten sam status "In force", akt bazowy nietkniety, a data stosowania przesunieta o DWA LATA - wykrywa to wylacznie odczyt wersji skonsolidowanej, nie numeru aktu. Nowy modul dr-09 klasy katalogowo-metrykalnej; tresc obowiazkow materialnych SWIADOMIE niepokryta, bo opisanie progow recyklatu z pamieci byloby ta sama klasa tresci, ktora O-11 wycinala przez caly wrzesien. Zarejestrowany w 3 rejestrach dr-09 i w 4 miejscach ROUTING-MAP
- 6.94 (2026-09-12r, T13): **ta sama slepa plamka drugi raz, w odstepie jednej sesji.** Wpis AUDYT-2026-09-12r. Rozszerzenie T13 z 12p sprawdzalo basename(root)=='shared', czyli wylacznie pliki bezposrednio w katalogu skilla - podzial TABELE-OPLAT z 12q utworzyl shared/oplaty/ i WSZYSTKIE SIEDEM SATELITOW natychmiast wypadlo poza zakres testu. Za pierwszym razem zakres zawezal wzorzec nazwy pliku, za drugim glebokosc katalogu; wspolna przyczyna: warunek wpiecia pisany pod aktualnie znany uklad plikow, wiec kazda zmiana struktury repozytorium jest potencjalnym wypadnieciem z zakresu, ktore nie zglasza sie samo. ⚠️ Plamke wyprodukowala zmiana z poprzedniej sesji, opisana jako zabezpieczona testem T29 - T29 pilnuje mapy wlasnosci i dzialal poprawnie, ale o dlugosci satelitow nie wie nic; luka dokladnie miedzy dwoma poprawnymi testami. Poprawka: 'shared' in root.split(os.sep), rekurencyjnie - 167 zasobow zamiast 138. ⭐ Dodany --selftest (5/5), ktorego T13 nie mial od powstania w sierpniu; przypadki pilnuja PRZYDZIALU DO KATEGORII, a drugi z nich jest dokladnym opisem tej plamki - gdyby istnial w 12q, wyszlaby od razu
- 6.93 (2026-09-12q, PODZIAL + T29): **TABELE-OPLAT podzielone na rdzen i siedem satelitow.** Wpis AUDYT-2026-09-12q. ⭐ Rozwiazane napiecie z 12p, gdzie argumentowalem PRZECIWKO podzialowi: argument byl trafny co do ryzyka, ale bledny co do wniosku - stare tabele satelickie byly zle nie dlatego, ze bylo ich wiele, tylko dlatego, ze NIE MIALY WLASCICIELA ANI REJESTRU. Rdzen 159 linii (regula kolejnosci + MAPA WLASNOSCI SEKCJI + rejestry), siedem satelitow w shared/oplaty/ (108-390 linii). **Nowy test T29** (check_oplaty_mapa.py, 4 bramki, selftest 5/5) jako WARUNEK dopuszczalnosci podzialu, nie dodatek - bez niego podzial byl by regresja. B2 (mapa w gore) lapie plik-sierote, czyli dokladnie stary wzorzec. Kontrola integralnosci przez porownanie z ZIP-em poprzedniej dostawy: z 1236 niepustych linii brakuje 78, z czego 72 to stary spis tresci - zero utraty tresci. T13 przestal raportowac TABELE-OPLAT. 118 odeslan w systemie celowo NIE przepisane na sciezki satelitow - numer sekcji jest stabilniejszym adresem niz nazwa pliku. terminy.md (607 linii) swiadomie niedzielony - ponizej strefy WARN
- 6.92 (2026-09-12p, T13): **slepa plamka T13 — 1472 linie poza zasiegiem testu.** Wpis AUDYT-2026-09-12p. Sesja wywolana wlasna uwaga z 12o, ze terminy.md zbliza sie do progu T13. ⭐ UWAGA BYLA BLEDNA: T13 nie obejmowal shared/*.md w ogole (warunek basename(root)=='modules' and nazwa.startswith('mod-')). Gdybym poprzestal na zalozeniu i podzielil terminy.md, wykonalbym niepotrzebny podzial i NIE ZAUWAZYL rzeczywistego problemu - shared/TABELE-OPLAT.md ma 1472 linie, 47 % ponad prog CRIT, i przez siedem sesji wrzesniowych byl niewidzialny dla testu stworzonego wlasnie do lapania takich przyrostow. Dodana kategoria zasobow kanonicznych shared/*.md jako RAPORTOWANA, nie blokujaca - podzial TABELE-OPLAT odtworzylby tabele satelickie, przed ktorymi broni sekcja 7 tego samego pliku; test wymuszajacy podzial wbrew doktrynie skilla jest testem szkodliwym. Zamiast podzialu: SPISY TRESCI (TABELE-OPLAT 72 pozycje, terminy 22 pozycje). Przy generowaniu spisu wyszedl blad struktury - UPEA byla zagniezdzona pod KPA jako ###, choc to odrebny rezim. ⚠️ Dlug zaciagniety jawnie: spisy sa reczne, bez testu pilnujacego zgodnosci z naglowkami
- 6.91 (2026-09-12o, rodzina TERMINY c.d.): **KC - trzy wiersze na caly kodeks cywilny.** Wpis AUDYT-2026-09-12o. ⛔ Pulapka, ktorej nie mial zaden plik: art. 118 zd. 2 - koniec terminu przedawnienia przypada na OSTATNI DZIEN ROKU KALENDARZOWEGO, chyba ze termin jest krotszy niz dwa lata; liczenie dzien po dniu daje date wczesniejsza niz rzeczywista, co szkodzi obu stronom. ⛔⛔ art. 442[1] ma TRZY PULAPKI naraz: 20 lat przy zbrodni lub wystepku liczone OD CZYNU (par. 2), przy szkodzie NA OSOBIE granica 10 lat NIE OBOWIAZUJE (par. 3), maloletni +2 lata od pelnoletnosci (par. 4) - zastosowanie samego par. 1 do sprawy o uszkodzenie ciala sprzed kilkunastu lat daje bledny wniosek o przedawnieniu. ⭐ art. 344 par. 2: roszczenie posesoryjne WYGASA, nie przedawnia sie - sad uwzglednia z urzedu; czwarta w serii konstrukcja mylona z terminem zawitym. Dopisane rekojmia (art. 563, 568), blad i grozba (art. 88 par. 2), umowa przedwstepna (art. 390 par. 3), skarga paulianska (art. 534), zasiedzenie (art. 172-173). terminy.md 88 -> 607 linii od poczatku serii
- 6.90 (2026-09-12n, rodzina TERMINY c.d.): **KP - dwa wiersze na caly Kodeks pracy.** Wpis AUDYT-2026-09-12n. Liczby w dr-04 poprawne, konstrukcja niepelna: art. 264 par. 2 ma DWA punkty poczatkowe (doreczenie zawiadomienia ALBO dzien wygasniecia umowy), brakowalo par. 3 i art. 265 par. 2. ⛔ USTALENIE GLOWNE: art. 52 par. 2 i art. 109 par. 1 to GRANICE DLA PRACODAWCY - ich uplyw jest zarzutem obrony, nie terminem pracownika; trzymanie ich w jednej tabeli bez oznaczenia prowadzi do szukania po niewlasciwej stronie. ⭐ art. 112 par. 1 zd. 3 - MILCZACA ZGODA: nieodrzucenie sprzeciwu w 14 dni jest rownoznaczne z uwzglednieniem, czyli brak reakcji konczy sprawe po mysli wnoszacego bez sadu; zadnego modulu tego nie mial. Dopisane przedawnienia z art. 291 par. 1, 2, 3, 4 i 5. KROK 2C: Dz.U. 2026 poz. 1046 (w zycie 5.11.2026) nie dotyka tych przepisow - druga po Ordynacji rodzina z aktem czekajacym na wejscie w zycie
- 6.89 (2026-09-12m, **RODZINA TERMINY ZAMKNIETA**): Wpis AUDYT-2026-09-12m. KSH: modul podawal DWIE pary terminow, obie dla sp. z o.o., a KSH zna CZTERY REZIMY - dopisane S.A. niepubliczna i publiczna, uchylenie i niewaznosc (art. 424 par. 1-2, art. 425 par. 2-3). Liczby dotychczasowe okazaly sie poprawne - usterka przez POMINIECIE, nie przez blad. ⛔ Sp. z o.o. granica 3 lata vs S.A. 2 lata; spolka publiczna liczy termin niewaznosci OD OGLOSZENIA uchwaly. ⭐ Dopisane art. 252 par. 4 i 425 par. 4 - uplyw terminu nie wylacza ZARZUTU niewaznosci. ⭐⭐ ZAMKNIECIE RODZINY: 11 rezimow w 7 sesjach, terminy.md 88 -> 489 linii. WNIOSEK ZBIORCZY - cztery postacie usterki terminowej, z ktorych T28 lapie WYLACZNIE jedna (bledny cytat); przez cztery ostatnie sesje nie dopisano do rejestru W1 ani jednej pozycji
- 6.88 (2026-09-12l, rodzina TERMINY c.d.): **upadlosc i restrukturyzacja.** Wpis AUDYT-2026-09-12l. Pierwszy modul w serii, ktorego LICZBY byly poprawne w calosci (30 dni art. 21 ust. 1, 3 miesiace art. 11 ust. 1a, 24 miesiace art. 11 ust. 2) - bledne byly ADRESAT i SKUTEK. Zgloszenie wierzytelnosci idzie do SYNDYKA przez system teleinformatyczny (art. 236 ust. 1), a modul adresata nie podawal wcale; skutek spoznienia to nie "dodatkowa oplata", tylko ryczalt 15 % przecietnego wynagrodzenia w sektorze przedsiebiorstw (art. 235 ust. 1), ponoszony NAWET BEZ WINY. ⭐ TRZECIA KOTWICA WARTOSCI - nowa sekcja 4g w TABELE-OPLAT (1.8); GUS publikuje CZTERY rozne przecietne wynagrodzenia, a przepis wskazuje jeden. ⛔ Trzecia w serii konstrukcja mylona z terminem zawitym: okresy z art. 11 PrUp to domniemanie i podstawa niewyplacalnosci, ktore OTWIERAJA 30-dniowy obowiazek, a nie go zastepuja. Termin sprzeciwu w PrRestr podniesiony z RZEDU 2 do RZEDU 1 (art. 91 ust. 1-2) mimo trafnosci - po doswiadczeniu z art. 33 UPEA terminy zawite domyka wylacznie odczyt tresci
- 6.87 (2026-09-12k, rodzina TERMINY c.d.): **KRO - termin prekluzyjny zawyzony trzykrotnie.** Wpis AUDYT-2026-09-12k. dr-02 (nietkniety w calej serii) podawal: matka "6 miesiecy od urodzenia dziecka" - jest ROK od dowiedzenia sie (art. 69 par. 1); dziecko "3 lata od osiagniecia pelnoletnosci" - jest ROK od dowiedzenia sie (art. 70 par. 1). ⛔ Drugi w tej serii blad w kierunku NIEBEZPIECZNYM - dziecko poinformowane o trzech latach traci powodztwo. Usunieta nieaktualna adnotacja "TK zakwestionowal ograniczenie data pelnoletnosci" - ograniczenie jest w t.j.; realnym sladem orzeczenia TK jest art. 71 KRO, ktory UTRACIL MOC. Dopisane art. 64-65, 70[1], 78, 79, 81, 81[1] oraz granice powodztwa prokuratora z art. 86. ⚠️ Do rejestru W1 nie dopisano nic - bledem byla WARTOSC terminu przy poprawnym cytacie, a takiej usterki rejestr z zalozenia nie lapie; trzy sesje z rzedu daly tylko JEDEN blad zamienialny na regule testu
- 6.86 (2026-09-12j, rodzina TERMINY c.d.): **KKW + flaga F-OP-2026-09.** Wpis AUDYT-2026-09-12j. (1) Otwarta flaga dla PIECIU nowelizacji Ordynacji podatkowej oglszonych po t.j., z ktorych TRZY wchodza w zycie w ciagu trzech tygodni (16.09, 24.09, 1.10.2026) - z protokolem ponownego odczytu po kazdej dacie; zakres poz. 1154, 875 i 1098 jawnie NIEUSTALONY. ⭐ Wzorzec: odczyt moze byc POPRAWNY I JEDNOCZESNIE MIEC DATE WAZNOSCI - kandydat na rozszerzenie adnotacji [VER] o pole "wazne do". (2) mod-KKW liczyl 772 linie i NIE MIAL ANI JEDNEGO TERMINU; shared/terminy.md zero pozycji z KKW. Dopisane 14 pozycji z odczytu tresci (Dz.U. 2025 poz. 911). ⭐ USTALENIE POJECIOWE: KARENCJA (art. 161 par. 3-4, art. 153 par. 3 KKW) to NIE termin zawity - wniosek przedwczesny nie przepada, tylko nie jest rozpoznawany do uplywu okresu; mylenie daje blad w obie strony
- 6.85 (2026-09-12i, rodzina TERMINY c.d.): **Ordynacja podatkowa.** Wpis AUDYT-2026-09-12i. ⛔⛔ KROK 2C dal wynik bez precedensu w tej serii: po t.j. z 22.04.2026 oglszono PIEC ustaw zmieniajacych, wszystkie z odroczonym wejsciem w zycie, a TRZY wchodza w ciagu trzech tygodni od sesji (16.09, 24.09, 1.10.2026). ⛔ Twierdzenie dr-06 o uchyleniu art. 70 par. 6 pkt 1 i "ugodzie podatkowej od 01.10.2026" NIEPOTWIERDZONE: przepis jest w mocy w t.j., a poz. 825 i 846 nie zmieniaja art. 70 ani nie zawieraja slowa "ugoda"; data 1.10 zgadza sie z wejsciem w zycie poz. 846, ale jej zakres jest inny. NOWA KLASA USTERKI: twierdzenie o PRZYSZLYM stanie prawa podane jako obowiazujace, z prawdziwa data przyklejona do nieprawdziwej tresci. Naprawa cytatu: odwolanie 14 dni to art. 223 par. 2, nie par. 1 - trzeci potwierdzony przypadek reguly "podstawa terminu nie stoi w przepisie o samej czynnosci". T28: dopisana pozycja W1-223-Op (trafila od razu w mod-ustawa-podatek-nieruchomosci) oraz ZAWEZONA BRAMKA W2 po pierwszym pomiarze falszywych alarmow - dr-06 wszedl w zakres skanowania i dal 3 falszywki na stawkach podatku u zrodla 19/20 % od odsetek jako kategorii przychodu; bramka lapie teraz wylacznie NAZWANE rodzaje odsetek i tylko przy atrybucji procentu. Selftest 21 -> 26/26. Trzeci wykryty blad wlasny T28 - wszystkie trzy wyszly przy PIERWSZYM kontakcie bramki z nowym materialem, nie przy projektowaniu
- 6.84 (2026-09-12h, rodzina TERMINY c.d.): **UPEA - dwa CRIT i ustalenie metodologiczne.** Wpis AUDYT-2026-09-12h. (1) "Zarzuty 7 dni od doreczenia TW" - taki termin NIE ISTNIEJE; art. 33 par. 5 UPEA podaje wylacznie terminy koncowe. Kierunek bledu NIEBEZPIECZNY: zamykal srodek, ktory nadal przyslugiwal. (2) Katalog podstaw zarzutu byl sprzed nowelizacji - "zbyt uciazliwy srodek" przenios sie do SKARGI z art. 54 par. 1 pkt 2; zarzut na tej podstawie zostanie oddalony. (3) Skarga na czynnosc egzekucyjna: 14 -> 7 dni (art. 54 par. 3), zmieniony takze punkt poczatkowy i adresat. ⭐ USTALENIE: przy blednym wierszu stala adnotacja "POTWIERDZONE 2026-07-27, Rzad 2B: lexlege.pl, arslege.pl" - dwa serwisy potwierdzily regule, ktorej w ustawie nie ma, a prawdziwa tresc przepisu zdegradowaly do "uzupelnienia". PIERWSZY udokumentowany przypadek, w ktorym RZAD 2B nie tyle zawiodl, co ZALEGITYMIZOWAL blad. Wniosek dla HIERARCHIA-ZRODEL: przy terminie zawitym i kwocie adnotacja "potwierdzone Rzad 2B" nie zamyka weryfikacji
- 6.83 (2026-09-12g, rodzina TERMINY c.d.): **obsadzone terminy administracyjne i sadowoadministracyjne.** Wpis AUDYT-2026-09-12g. Punkt wyjscia: shared/terminy.md mial KPA 1 wiersz i PPSA 1 wiersz na 37 - czyli dwa rezimy NIE BADANE, nie "sprawdzone i wystarczy". Z odczytu tresci KPA (Dz.U. 2025 poz. 1691) i PPSA (Dz.U. 2026 poz. 143) dopisane 22 pozycje, w tym osobna tabela terminow ORGANU (art. 35 KPA) z art. 35 par. 5 - czego nie wlicza sie do terminu. ⛔ Ustalenie o najwiekszym ciezarze: uzasadnienie wyroku WSA ma DWA rezimy w jednym artykule - z urzedu przy uwzglednieniu skargi (art. 141 par. 1), tylko na wniosek w 7 dni przy oddaleniu (par. 2); przeoczenie zamyka droge do skargi kasacyjnej. Usterka w dr-05: mod-UDIP opisywal art. 52 par. 3 PPSA jako droge "gdy podmiot bez wyzszego organu" - przepis czyni wniosek o ponowne rozpatrzenie FAKULTATYWNYM zawsze, gdy przysluguje. Do rejestru W1 w T28 nie dopisano nic - usterka opisowa nie ma sygnatury nadajacej sie na wzorzec
- 6.82 (2026-09-12f, O-12): **wdrozony test T28** (scripts/check_wartosci_prawne.py) - trzy bramki: W1 rejestr znanych blednych cytatow (FAIL, 10 pozycji), W2 procent utrwalony przy pojeciu odsetek (FAIL), W3 wiersz kwotowy bez podstawy (WARN). Offline, selftest 21/21, do orkiestratora. Pierwszy przebieg: 410 plikow, 31 trafien FAIL, z tego **8 REALNYCH NIENAPRAWIONYCH USTEREK**, ktorych trzy poprzednie sesje recznego przegladu nie znalazly (SPF-SPG x2, SPB+SKILL x3, dr-03 x3). Dwa bledy w samym tescie wykryte przed wydaniem: falszywy alarm na poprawnym art. 105 par. 1 KPW oraz W3 uznajacy slowo "rozporzadzenie" za podstawe. ODRZUCONY jawnie kandydat z 12e - generyczna regula "indeks gorny = FAIL" dawalaby falszywe alarmy na legalnych art. 205[1], 398[5], 477[9] KPC. Otwarta **MON-4**: monitoring wartosci w rytmie posiedzen RPP jako ROZSZERZENIE, nie zastapienie MON-3
- 6.81 (2026-09-12e, O-11 ZAMKNIETA): **trzeci i ostatni pomiar rodziny wartosci — progi, odsetki, stawki ZUS i podatkowe.** Wpis AUDYT-2026-09-12e. Wynik inny niz w dwoch poprzednich rodzinach: korpus nie mial blednych wartosci, bo nie mial ich prawie wcale — LUKA, nie usterka. TABELE-OPLAT 1.7: sekcja 4 z 14 do ~190 linii (odsetki cywilne art. 359/481 KC, handlowe Dz.U. 2023 poz. 1790 z rekompensata 40/70/100 EUR i sztywna data odczytu stopy 1.01/1.07, odsetki za zwloke art. 56-56b OP na stopie LOMBARDOWEJ z podloga 8 %, art. 23 ust. 1 SUS WYLACZAJACY art. 56a dla ZUS, stopy skladek art. 22 SUS z widelkowa wypadkowa 0,40-8,12 %, skala PIT art. 27 ust. 1). ⛔ DOKTRYNA: wartosci zakotwiczone w stopach NBP zapisujemy jako formule, nigdy jako procent. Kontrola negatywna zrodel RZEDU 2/3 dala w jednej probce 4 rozne stopy referencyjne, 4 rozne stawki handlowe, wzor "+7 p.p." bez podstawy w ustawie i powolanie UCHYLONEGO rozporzadzenia RM Dz.U. 2014 poz. 1858. **O-11 ZAMKNIETA**, otwarta **O-12**: kontrola aktualnosci AKTU nie jest kontrolą aktualnosci WARTOSCI — trzy zmierzone mechanizmy omijaja KROK 2C; trzy kandydaci na testy regresyjne; MON-3 do rozszerzenia o rytm posiedzen RPP
- 6.80 (2026-09-12d, O-11 rodzina TERMINY): **drugi pomiar rodziny wartosci — terminy procesowe.** Wpis AUDYT-2026-09-12d. CRIT-1: plik KANONICZNY shared/terminy.md powolywal UCHYLONY art. 503 par. 1 KPC; art. 500-504 KPC brzmia "(uchylony)", termin daje art. 480[2] par. 2 (2 tygodnie / miesiac / MIESIAC dla nakazowego / 3 miesiace). Propagacja w 6 plikach 3 skilli. CRIT-2: trzy bledne jednostki w rodzinie wykroczeniowej (wniosek o uzasadnienie to 7 dni z art. 35 par. 1 KPW, nie 3 dni z art. 105 par. 1). CRIT-3: "art. 328[1] KPC" po raz SZOSTY — jednostka nie istnieje, naprawiana juz trzykrotnie, znaleziona w MP12-terminy, SPF-SPG (w tresci WZORU PISMA) i MOD-SZABLONY. Skille: shared 3.46, analizator-dowodow-v3 5.16.8, pisma-proste-v2 2.15, pisma-procesowe-v3 5.24. Nowa klasa ryzyka: uchylenie bez zastapienia w tym samym miejscu — akt bazowy wyglada na aktualny, a przepisu w nim nie ma
- 6.79 (2026-09-12c, O-11): **domkniecie rodzin oplat poza rdzeniem KSCU.** Wpis AUDYT-2026-09-12c. TABELE-OPLAT 1.6 (sekcje 6a-6e): wieczystoksiegowe i KIO, koszty komornicze Dz.U. 2024 poz. 377, oplata skarbowa Dz.U. 2025 poz. 1154, taksa notarialna Dz.U. 2024 poz. 1566, koszty procesu karnego KPK Dz.U. 2026 poz. 490. Skille: shared 3.45, pisma-proste-v2 2.14, pisma-procesowe-v3 5.23, analizator-dowodow-v3 5.16.7, dr-03 3.37, dr-12 4.16. ⛔ NOWA KLASA RYZYKA: zryczaltowana rownowartosc wydatkow z art. 621 par. 2 KPK wzrosla z 300 na 1000 zl od 1.07.2025, bo nowe rozporzadzenie (Dz.U. 2025 poz. 770) UCHYLILO poprzednie - akt bazowy i jego t.j. nietkniete, wiec KROK 2C tego nie widzi. Kandydat na rozszerzenie T27. Odnotowana luka: brak modulu oplaty skarbowej w dr-06
- 6.78 (2026-09-12, O-11): **pomiar rodziny wartosci "oplaty sadowe" i naprawa czterech tabel satelickich.** Wpis AUDYT-2026-09-12. Naprawione skille: shared 3.44 (TABELE-OPLAT 1.5), pisma-proste-v2 2.13, pisma-procesowe-v3 5.22, analiza-sadowa-v6 6.7, analizator-dowodow-v3 5.16.6, dr-03 3.36. Kluczowe ustalenia: podstawa falszywa "art. 27 pkt 1-6 KSCU" dla progow WPS w 3 plikach; 6 kwot blednych; 3 normy nieistniejace (cap gospodarczy 20 000 zl, oplata pracownicza 5%/max 1000 zl, wpis WSA 200/500/1000/2000); CRIT terminowy - termin zaskarzenia nakazu podawany jako 7 i 14 dni z art. 493 par. 1 KPC, ktory terminu NIE ZAWIERA (jest art. 480[2] par. 2 KPC: miesiac dla nakazowego przy doreczeniu w UE). O-11 skrocona do tego, co zostalo; zalozony rejestr tabel satelickich
- 6.77 (2026-09-10x, O-11): **powiązanie tabeli opłat z systemem — dotąd było za wąskie.**

  ⛔ Na pytanie użytkownika o powiązania: `TABELE-OPLAT` w wersjach 1.0–1.3 znały
  **tylko dwa moduły** — `MP10-koszty` (analizator-dowodow-v3) i
  `czesc-04-alimenty` (dr-02) — plus wpis w rejestrze `shared`. Router o pliku
  nie wiedział, więc w sprawie spoza tych dwóch ścieżek nikt by po niego nie
  sięgnął.

  **Wpięcia wykonane:**

  | Gdzie | Co |
  |---|---|
  | `prawny-router-v3` | `required_modules` + warstwa odroczona `PROFIL-LEKKI` z wyzwalaczem **„zamierzasz podać kwotę"** |
  | `prawny-router-v3/SELF-CHECK` | nowa pozycja **KWOTA-GATE** — kontrola na wyjściu |
  | `dr-12/mod-KSCU-koszty-sadowe-i-pomoc-prawna` | kanoniczny moduł KSCU — KROK 0, katalog zwolnień, pułapka art. 13 ust. 2 |
  | `pisma-proste-v2` | „Zasada 3 — opłata sądowa zawsze" poprzedzona KROKIEM 0 |
  | `pisma-procesowe-v3/MOD-SZABLONY` | pole „Opłata sądowa" w szablonie pisma |
  | `analiza-sadowa-v6/koszty-terminy` | sekcja kosztowa — kwoty oznaczone jako orientacyjne |

  **KWOTA-GATE — trzy pytania przy każdej podawanej kwocie**, wszystkie muszą
  mieć odpowiedź TAK: (1) czy strona nie jest zwolniona (art. 94–103 KSCU),
  (2) czy kwota pochodzi z tabeli ustanawiającej, (3) czy sprawdzono **przypisy**
  przy jednostce redakcyjnej.

  ⛔ Punkt 3 jest bezpośrednim skutkiem ustalenia z 10t: art. 13 ust. 2 KSCU
  niesie dwa brzmienia obok siebie, rozróżnione wyłącznie odnośnikami.

  ⚠️ **Wzorzec wart nazwania:** nowy zasób w `shared` nie jest częścią systemu,
  dopóki nie ma wyzwalacza w routerze i kontroli w SELF-CHECK. Rejestracja
  w tabeli zasobów `shared` **czyni go widocznym, nie używanym**. Ta sama uwaga
  dotyczy każdego przyszłego modułu kanonicznego.

- 6.76 (2026-09-10w, O-11): **pełny katalog zwolnień — luka wykryta przez pytanie.**

  ⛔ Użytkownik zapytał, czy wskazane są wszystkie sytuacje zwolnienia od opłat.
  **Nie były.** `TABELE-OPLAT` w wersjach 1.0–1.2 wymieniały wyłącznie
  art. 96 ust. 1 **pkt 2** (alimenty) — plik **odziedziczył zakres pracy, przy
  której powstał**, i wyglądał na kompletny.

  ⚠️ To ta sama klasa co „niedomknięcie" z 10g: zapis nie był błędny, był
  **niepełny w sposób niewidoczny**. Różnica wobec 10g jest istotna: tam
  niedomknięcie wykrył test, tu — pytanie człowieka. ⛔ Żaden test nie sprawdza,
  czy katalog jest kompletny, bo kompletność nie ma odniesienia w metadanych.

  Dopisany katalog z odczytu treści KSCU (`Dz.U. 2025 poz. 1228`), trzy warstwy:

  **A. Podmiotowe (art. 96 ust. 1) — 18 kategorii.** Poza alimentami m.in.
  ustalenie ojcostwa i macierzyństwa, klauzule niedozwolone, **pracownik**
  i odwołanie do sądu pracy, kurator, prokurator i pięcioro rzeczników,
  inspektor pracy i związki zawodowe, ochrona zdrowia psychicznego,
  ubezwłasnowolniony, szkody górnicze, kompensata dla ofiar czynów zabronionych,
  ochrona roszczeń pracowniczych, **osoba doznająca przemocy domowej**, renta
  z art. 444 § 2 i 446 § 2 KC.

  **B. Przedmiotowe (art. 95).** ⛔ Praktycznie najważniejsze: **zażalenia
  i skargi dotyczące samych kosztów** nie podlegają opłacie — zaskarżenie
  decyzji o kosztach samo nie kosztuje. Ponadto zażalenie na policyjny nakaz
  opuszczenia mieszkania w sprawach przemocy domowej, pisma nieletniego,
  wniosek o doręczenie uzasadnienia.

  **C. Na wniosek (art. 100–103).** ⛔ Art. 102 ust. 4: wniosek strony
  z pełnomocnikiem, bez oświadczenia majątkowego, przewodniczący **zwraca BEZ
  WEZWANIA**. Dla strony samodzielnej — art. 130 KPC. Termin rozpoznania 7 dni.

  ⚠️ Wpisane wprost: **zwolnienie od kosztów sądowych ≠ zwolnienie od kosztów
  przeciwnika.** Oraz art. 96 ust. 4 — przy oczywiście bezzasadnym powództwie
  o ustalenie ojcostwa sąd może obciążyć powoda; zwolnienie z pkt 1 nie jest
  bezwarunkowe.

  Do reguły kolejności dopisany **KROK 0: czy strona w ogóle płaci** — przed
  sięgnięciem po jakąkolwiek tabelę. `MP10-koszty` spięty z katalogiem.

- 6.75 (2026-09-10v, O-11): **taksy z odczytu treści — stawka alimentacyjna
  nie zależy od WPS.**

  Odczyt treści obu rozporządzeń (`Dz.U. 2026 poz. 215` adwokackie,
  `Dz.U. 2026 poz. 118` radcowskie). W zbadanym zakresie **tabele są identyczne**.

  **§ 2 — stawki od WPS:** 90 / 270 / 900 / 1 800 / 3 600 / 5 400 / 10 800 /
  15 000 / **25 000 zł**.

  ⚠️ **§ 3 — postępowania upominawcze, elektroniczne upominawcze, nakazowe
  i europejskie nakazowe mają WŁASNĄ, NIŻSZĄ tabelę** (60/180/600…). Osobny,
  łatwy do przeoczenia przepis.

  ⛔ **§ 4 — sprawy rodzinne: stawka NIE zależy od WPS.** Alimenty **240 zł**,
  rozwód i unieważnienie 720 zł, rozdzielność majątkowa 720 zł, ojcostwo
  i rozwiązanie przysposobienia 480 zł, istotne sprawy rodziny 480 zł, podział
  majątku — stawka z §2 od wartości udziału (50% przy zgodnym wniosku).

  **Najczęstszy błąd w tej materii:** policzenie stawki alimentacyjnej z tabeli
  WPS. Przy rocznej sumie świadczeń 4 800 zł tabela §2 daje 900 zł, a przepis
  szczególny — **240 zł**. Zawyżenie blisko czterokrotne, w obie strony:
  zawyża ryzyko kosztowe powoda i zawyża to, czego może się domagać.

  ⚠️ Sprawdzony celowo przypis przy pozycji alimentacyjnej: brzmienie z 23.12.2024
  jest obowiązujące, bez wariantu przyszłego. ⛔ To ta sama konstrukcja
  redakcyjna, która przy art. 13 ust. 2 KSCU kryła brzmienie wygasłe obok
  obowiązującego — **sprawdzanie przypisów przestało być opcjonalne**.

  `dr-02/kro-rodzinne/czesc-04-alimenty` spięty z tabelami.

- 6.74 (2026-09-10u, O-11): **alimenty — od przepisu, nie od intuicji.**

  Dokończenie wątku z 10t zgodnie z regułą kolejności. Zdjęty znacznik
  `[DO WERYFIKACJI]` przy WPS: **art. 22 KPC** (t.j. `Dz.U. 2026 poz. 468`,
  odczyt treści) — „wartość przedmiotu sporu stanowi suma świadczeń za jeden
  rok, a jeżeli świadczenia trwają krócej niż rok – za cały czas ich trwania".
  Dodany art. 21 KPC (zliczanie roszczeń).

  **Art. 135 KRO** (t.j. `Dz.U. 2026 poz. 236`, odczyt treści) — trzy ustalenia,
  z których każde zmienia wyliczenie:

  - **§ 1 — dwie przesłanki, nie jedna.** Zakres zależy od usprawiedliwionych
    potrzeb uprawnionego **oraz** od zarobkowych i majątkowych możliwości
    zobowiązanego. ⚠️ „Możliwości zarobkowe" ≠ „dochód faktyczny" — przepis
    obejmuje zdolność zarobkowania niewykorzystywaną.
  - **§ 2 — osobiste starania są FORMĄ WYKONANIA obowiązku**, nie okolicznością
    łagodzącą. Rodzic sprawujący bieżącą pieczę wykonuje obowiązek w naturze,
    co przesuwa ciężar finansowy na drugiego zobowiązanego. Pominięcie § 2
    zaniża żądanie.
  - **§ 3 — świadczeń z pomocy społecznej i funduszu alimentacyjnego NIE
    ODLICZA SIĘ.** Argument „dziecko dostaje świadczenia, więc alimenty mogą być
    niższe" jest **wprost sprzeczny z przepisem**, a jest to jeden
    z najczęstszych argumentów strony zobowiązanej.

  Tabela przesłanek (art. 128, 129 §1–2, 130, 133 §1–3, 138, 140 §2) przepisana
  z treści. ⛔ Odnotowane: **art. 133 § 1 nie zna granicy wieku** — kryterium to
  zdolność do samodzielnego utrzymania, a uchylenie się wobec dziecka
  pełnoletniego wymaga wykazania przesłanki z § 3, nie następuje z mocy prawa.

  Moduł `dr-02/kro-rodzinne/czesc-04-alimenty` wyrównany do tego samego stanu;
  dopisane zwolnienie z art. 96 ust. 1 pkt 2 KSCU i WPS z art. 22 KPC.

  ⚠️ Ostrożność zapisana wprost: reguła „przy podwyższeniu WPS liczy się od
  różnicy" **nie wynika wprost z art. 22** i przy sprawie granicznej wymaga
  orzecznictwa — oznaczona jako niepewna, nie jako pewnik.

- 6.73 (2026-09-10t, O-11): **TABELE-OPLAT — kolejność sięgania po kwoty; cap
  opłaty stosunkowej jest inny, niż wszyscy powtarzają.**

  Na polecenie użytkownika: przy obliczeniach (alimenty, opłaty, koszty)
  najpierw tabele ustanawiające opłaty, dopiero potem bazy katalogujące ich
  rodzaj. Reguła zapisana jako `shared/TABELE-OPLAT.md`, a
  `analizator-dowodow-v3/modules/MP10-koszty.md` oznaczony jako **warstwa
  druga**: rozpoznaje rodzaj opłaty i to, za co jest pobierana — **nie jest
  źródłem liczby**.

  ⛔ **Ustalenie z odczytu treści KSCU (`Dz.U. 2025 poz. 1228`, `/text.pdf`):**
  tekst jednolity niesie **dwa brzmienia art. 13 ust. 2** obok siebie,
  rozróżnione **wyłącznie odnośnikami**. Odnośnik 2) — cap 200 000 zł,
  „obowiązuje do wejścia w życie zmiany z odnośnika 3". Odnośnik 3) — cap
  **100 000 zł**, ustawa z 25.07.2025 (`Dz.U. 2025 poz. 1157`), **w życie
  23.09.2025**.

  Na dziś obowiązuje **100 000 zł**. Kwota 200 000 zł jest nieaktualna od
  września 2025 — a jest to jedna z najczęściej cytowanych liczb w postępowaniu
  cywilnym. Kto czyta tekst jednolity bez przypisów, przepisze brzmienie wygasłe.

  ⚠️ Klasa lustrzana wobec O-10: tam norma jeszcze nie obowiązywała, tu
  w jednym dokumencie stoją obok siebie brzmienie wygasłe i obowiązujące.
  ⛔ Żaden test tego nie złapie — `status` aktu jest zdrowy, numer poprawny,
  a różnica siedzi w przypisie do jednostki redakcyjnej.

  **Alimenty:** art. 96 ust. 1 pkt 2 KSCU (odczyt treści) — zwolnienie strony
  dochodzącej roszczeń alimentacyjnych **oraz pozwanej w sprawie o obniżenie
  alimentów**. Wpisane jako **pierwsze pytanie**, przed liczeniem opłaty:
  podanie kwoty stronie zwolnionej z mocy ustawy zniechęca do wniesienia pisma,
  które nic nie kosztuje.

  ⚠️ WPS w alimentach oznaczony jako **[DO WERYFIKACJI — art. 22 KPC]**, nie
  przepisany z pamięci. Taksy `2026/215` i `2026/118` potwierdzone jako
  najnowsze, zero nowelizacji po tekście jednolitym.

  Mapa centralna: +`2025/1157` z adnotacją o obniżeniu capu.

- 6.72 (2026-09-10s, F-135): **pierwszy błąd wartości liczbowej.**

  `shared/orka-bas-leksykon/czesc-05` podawał minimalne wynagrodzenie 2026 jako
  **„~4 750 zł"**. Odczyt **treści** rozporządzenia RM (`Dz.U. 2025 poz. 1242`,
  kanał `/text.pdf`): „§ 1. Od dnia 1 stycznia 2026 r. ustala się minimalne
  wynagrodzenie za pracę w wysokości **4806 zł**"; §2 — stawka godzinowa
  **31,40 zł**.

  ⚠️ Kwota „w przybliżeniu" jest w rejestrze prawnym tym samym co kwota błędna:
  służyła do przeliczenia krotności progu 200 000 zł, więc przybliżenie
  propagowało się na wynik.

  ⛔ **Nowa klasa — O-11.** To pierwszy w tej serii błąd **wartości**, nie
  numeru. Cały dotychczasowy aparat (T3, T11, T15, T24, T27) pyta o **akty**:
  czy numer istnieje, czy opisuje ten akt, czy akt żyje, czy już obowiązuje.
  **Żaden nie pyta, czy liczba w zdaniu odpowiada treści przepisu.**
  Weryfikacja wymaga odczytu tekstu aktu — czynności, której żaden test nie
  wykonuje i której zautomatyzowanie jest zadaniem innego rzędu.

  Przy okazji: weryfikacja minimalnego wynagrodzenia w `dr-04` opierała się
  dotąd na **wyszukiwaniu**; podniesiona do odczytu treści, z dopisaniem
  podstawy prawnej przy każdej kwocie i ostrzeżeniem o cezurze rocznej.
  Akt bazowy ustawy o minimalnym wynagrodzeniu (`Dz.U. 2024 poz. 1773`)
  potwierdzony **w podstawie prawnej samego rozporządzenia** — najmocniejszy
  możliwy dowód dla tego numeru.

- 6.71 (2026-09-10r, O-10 ZAMKNIĘTA): **T27 pyta też o normy przedwczesne.**

  Rozszerzenie o pole `entryIntoForce`: numer podany jako aktualna podstawa,
  którego data wejścia w życie jest w przyszłości. Dane były w tym samym
  odczycie, więc koszt zerowy — brakowało tylko pytania.

  **Pierwszy przebieg: 16 trafień. Po przeczytaniu kontekstu: 4 realne.**
  Reszta to linie, które same podawały cezurę („w życie 1.10.2026") albo
  wymieniały numer w wyliczeniu zmian, nie jako podstawę. ⛔ Trzeci raz w tej
  serii heurystyka zawyżyła wynik przed przeczytaniem kontekstu — dlatego
  test dostał dwie osobne kategorie (`W VACATIO LEGIS` jako podstawa vs
  `W WYLICZENIU ZMIAN, BEZ CEZURY`), a nie jedną listę błędów.

  ⛔ **Własny błąd testu wykryty przy tej okazji.** T27 dopasowywał cezurę do
  **wycinka 150 znaków**, a w wierszach map cezura stoi zwykle dalej — więc
  zgłaszał jako brak coś, co w pliku było. Poprawione: dopasowanie do pełnej
  linii, skracanie dopiero przy wyświetlaniu. To ta sama klasa co F-179:
  narzędzie mierzyło co innego, niż deklarowało.

  **Naprawione w korpusie:** 19 cezur czasowych dopisanych do aktów w vacatio
  legis (`2026/846` w życie 1.10.2026, `2026/507` — 14.10.2026, `2026/346` —
  30.09.2028, `2026/176` — 18.02.2027). Ponadto ostatni martwy numer wykryty
  przez T27: ustawa o zwolnieniach grupowych `2025/570` → **`2026/1195`**
  w 5 miejscach.

  **Korpus: T27 `✅ PASS` w obu klasach** — zero martwych i zero przedwczesnych
  numerów w pozycji aktualnej podstawy.

- 6.70 (2026-09-10q, F-135): **pierwsze ustalenie z części merytorycznej —
  przepis w vacatio legis opisany jako obowiązujący.**

  `shared/definicje/DEF-PRACA.md` i `dr-04/modules/mod-KP-mobbing-dyskryminacja.md`
  opisywały nowe brzmienie art. 94³ KP jako stan „PO REFORMIE (od 30.07.2026)".
  ⛔ 30.07.2026 to **data podpisu Prezydenta**. Odczyt RZĄD 1
  (`api.sejm.gov.pl/eli/acts/DU/2026/1046`): ogłoszenie **4.08.2026**, wejście
  w życie **5.11.2026**.

  ⛔ **Błąd zakresu czasowego normy w zasobie kanonicznym `shared`** — klasa,
  której pilnuje OŚ-GATE. Sprawa o mobbing z sierpnia albo września 2026
  dostawała przepis, który jeszcze nie obowiązuje: bez wymogu rozstroju zdrowia
  i z minimalnym zadośćuczynieniem, których w tej dacie nie ma. To nie jest
  nieaktualność — to zastosowanie nieobowiązującej normy.

  ⚠️ **Rozróżnienie zapisane po raz pierwszy:** „status: obowiązujący" w ELI
  znaczy tylko, że **akt nie został uchylony**. O stosowaniu rozstrzyga osobne
  pole `entryIntoForce`. Cała ta seria czytała `status` jako wyznacznik
  aktualności — dla aktów w vacatio legis to odczyt mylący.

  ⚠️ Kwota minimalnego zadośćuczynienia sprowadzona do **mnożnika ustawowego**
  (6 × minimalne wynagrodzenie); poprzedni zapis podawał 28 836 zł jako liczbę
  do przepisania do pisma, bez zastrzeżenia, że zależy ona od minimalnego
  wynagrodzenia w dacie orzekania.

  ✅ Zamknięte przy okazji TODO z 2026-07-30: moduł dr-04 twierdził, że jego
  tabela „opisuje stan sprzed reformy", podczas gdy wiersze były już
  zaktualizowane — moduł przeczył sam sobie (klasa z 10h).

  Mapy: wiersz `2026/1046` w mapie centralnej i wiersz KP art. 94³
  w `ROUTING-MAP.md` opatrzone cezurą czasową.

- 6.69 (2026-09-10p, O-9 i F-181 ZAMKNIĘTE): **test T27 — proza przestaje żyć
  obok aparatu.**

  `scripts/check_status_podstaw.py`. Pytanie: czy numer Dz.U. podany **w prozie**
  jako aktualna podstawa prawna nadal opisuje akt obowiązujący.

  ⛔ **Test zamyka lukę, którą cztery ostatnie sesje udokumentowały pomiarowo:**
  numer w wierszu mapy pilnują cztery testy, ten sam numer w zdaniu „aktualne
  t.j.: …" — żaden. T3 pyta o zgodność między mapami, T11 o obecność, T15
  o tożsamość dla zadeklarowanych t.j., T24 o nowelizacje po t.j.

  **Projekt czułości oparty na empirii tej serii, nie na założeniu:**
  - odsiewa konteksty historyczne w **oknie ±2 wierszy**, nie w jednej linii —
    bo adnotacja korygująca rozkłada się na 2–3 linie, przez co pierwsza wersja
    testu zapalała się na **własnych naprawach** systemu;
  - odsiewa linie, w których obok wygasłego stoi numer nowszy;
  - pomija dziennik, changelogi, rejestry flag, generacje map i raporty
    z pomiarów — tam wygasłe numery są treścią, nie podstawą.

  ⛔ **Raportuje `⚠️ DO PRZEGLĄDU`, nie `FAIL`, i kończy kodem 0.** Powód wpisany
  do docstringu: heurystyka tego badania **dwukrotnie zawyżyła wynik** (29→13 przy
  nagłówkach). Traktowanie listy jako błędów powielałoby fałszywe alarmy.
  `--strict` daje kod 1 — do użycia tylko tam, gdzie ktoś listę przejrzy.

  Docstring zawiera cztery ostrzeżenia wyprowadzone z pomiarów: wygasły numer
  nie jest sam w sobie błędem; heurystyka zawyżała; „aktualny t.j." bywa sam
  uchylony (dochody JST); porównanie tytułów przy naprawie jest obowiązkowe
  (siedem podmian aktu w tej serii).

  Wymaga sieci → wpisany do `references/SKRYPTY-RECZNE.md`, nie do orkiestratora
  (ta sama zasada co przy O-5). Tryb `--offline` z cache pozwala powtórzyć
  przebieg bez API.

  **Weryfikacja:** korpus po naprawach 10n/10o — `✅ PASS`, 313 numerów w 1236
  miejscach, 791 odsianych jako historyczne. Mutacja negatywna (wstrzyknięty
  wygasły `2024/44` jako podstawa) — wykryta.

  **F-181 zamknięta**: 61/61 miejsc naprawionych **i** automat, który pilnuje,
  żeby nie wróciły. Sama naprawa nie wystarczała do zamknięcia — to było
  zapisane w 10o.

- 6.68 (2026-09-10o, F-181): **lista 1.2 domknięta — 61/61 miejsc.**

  Pozostałe 20 miejsc w 12 skillach przestawionych na aktualne teksty jednolite.
  Każda para sprawdzona przez porównanie tytułów. Dwa ustalenia wykraczające
  poza samo starzenie:

  ⛔ **SIÓDMA PODMIANA AKTU w tej serii.**
  `dr-10/modules/mod-ustawa-pielegniarka-polozna.md` kierował weryfikację do
  `Dz.U. 2025 poz. 450` — to tekst jednolity **ustawy o działalności leczniczej**,
  nie ustawy o zawodach pielęgniarki i położnej. Właściwy: **`2026/15`**,
  ⛔ KROK 2C: 3 nowelizacje po nim.

  ⛔ **Nieprawdziwa adnotacja o stanie** (klasa O-9).
  `dr-05/modules/mod-ustawa-kontrola-administracji.md` twierdził: „Nowszy t.j.
  NIE został ogłoszony — Dz.U. 2020 poz. 224 jest aktualnym t.j.". Nowszy
  **został ogłoszony**: `2026/158`. Adnotacja była kategoryczna i fałszywa.

  ⚠️ **Akt przemianowany.** `2021/1249` → `2024/1673`: ustawa o przeciwdziałaniu
  przemocy **w rodzinie** nazywa się dziś ustawą o przeciwdziałaniu przemocy
  **domowej**. Sama podmiana numeru zostawiłaby nieaktualną nazwę — a to
  w tej serii dwukrotnie okazało się wierzchołkiem podmiany aktu.

  ⛔ **Dochody JST — drugie wystąpienie tej samej pułapki.**
  `dr-08` kierował do `2024/356`, który sam jest uchylony. Podstawą jest **nowa
  ustawa** `2024/1572` (zm. `2025/1659`), bez tekstu jednolitego. Ten sam błąd,
  który przy `shared` (10n) mógł się powielić automatycznym podstawieniem.

  Mapa centralna: +`2024/1673`, +`2025/1584`, +`2024/68`, +`2026/12`. T11 zielony.

  ⚠️ **F-181 pozostaje otwarta.** Lista 1.2 jest wyczerpana, ale sama była
  wynikiem heurystyki (numer + fraza o t.j., minus konteksty historyczne), nie
  audytu każdej linii. Dwa poprzednie liczniki tego badania okazały się zawyżone;
  nie ma podstaw, by twierdzić, że trzeci był kompletny.

- 6.67 (2026-09-10n, F-181): **naprawa `shared` — 41 z 61 miejsc.**

  `shared` niósł dwie trzecie całej zaległości F-181. Przestawione 41 miejsc,
  20 aktów. Największe: UFP `2024/1530` → `2025/1483` w **13 miejscach**
  (⛔ 5 nowelizacji po t.j.), dochody JST w 5, po 2 miejsca: gospodarka
  nieruchomościami, Karta Nauczyciela, VAT, KPK, ustawa rehabilitacyjna, PZP.

  ⛔ **Dochody JST — jedyny przypadek, który nie był zwykłym starzeniem.**
  Wskazany przez pomiar „aktualny" tekst jednolity `2024/356` **sam ma status
  uchylony**: stara ustawa z 2003 r. została zastąpiona **nową ustawą** z 1.10.2024
  (`Dz.U. 2024 poz. 1572`, zm. `2025/1659`). Automatyczne podstawienie z listy
  przesunęłoby błąd o jedno ogniwo dalej, zamiast go usunąć. ⚠️ To potwierdza
  ostrzeżenie wpisane do listy 1.2: kolumna „aktualny t.j." jest wskazówką, nie
  rozstrzygnięciem — każdą pozycję trzeba przeczytać w kontekście.

  ⛔ Każda z 20 par sprawdzona przez porównanie tytułów — po sześciu podmianach
  aktu w tej serii to element procedury, nie formalność.

  Mapa centralna: +`2025/1718` (zatrudnienie socjalne), +`2026/677`
  (rozporządzenie MRPiPS). T11 zielony.

  **Zostaje 20 miejsc w 12 skillach** — F-181 nadal otwarta.

- 6.66 (2026-09-10m, F-181): **skan całego korpusu — 36 wygasłych podstaw w 61 miejscach.**

  Wersje 1.0 i 1.1 badały **pierwsze 25 linii** plików. To rozszerzenie objęło
  cały korpus: **424 unikalne numery Dz.U. w 1903 miejscach**, każdy odczytany
  w RZĘDZIE 1.

  | | |
  |---|---:|
  | numerów wygasłych/uchylonych | 47 |
  | miejsc z nimi | 75 |
  | odsiane (kontekst historyczny, raporty audytowe, nowszy numer w linii) | 15 |
  | ⛔ **podane jako aktualna podstawa** | **36 / 61** |

  ⛔ **Koncentracja: `shared/orka-bas-leksykon` — 41 z 61 miejsc.** Leksykon cytuje
  podstawy prawne **w treści definicji**, nie w nagłówku, więc wszystkie
  dotychczasowe przeglądy go omijały. Najgorsza pozycja: `2024/1530` (UFP)
  w **14 miejscach**, aktualny t.j. `2025/1483` z pięcioma nowelizacjami po nim.

  ⚠️ **Ostrzeżenie o liczbie wpisane do listy.** Dwa poprzednie liczniki tego
  badania skurczyły się po sprawdzeniu kontekstu. Ta wartość jest ostrożniejsza,
  ale nadal wynika z heurystyki — przed naprawą każdą pozycję przeczytać
  w kontekście.

  Lista 1.2 podaje dla każdej pozycji: akt, aktualny tekst jednolity, liczbę
  nowelizacji po nim (KROK 2C) i wszystkie miejsca wystąpienia.

  ⚠️ `2024/356` ma status **uchylony**, nie „wygaśnięcie aktu" — inna sytuacja
  niż zastąpienie tekstu jednolitego, wymaga osobnego sprawdzenia.

- 6.65 (2026-09-10l, F-181): **korekta własnego alarmu i naprawa 13 podstaw.**

  ⛔ Liczby z wydania 6.64 („29 przeterminowanych, 10% wszystkich") były
  **zawyżone**. Heurystyka traktowała każdy numer Dz.U. obok frazy o tekście
  jednolitym jako deklarację aktualnej podstawy. Czytanie kontekstu: z 35 trafień
  **16** to numery jawnie oznaczone jako poprzednie („Poprzedni t.j.: …"),
  4 to własne adnotacje korygujące z tej serii, 2 to sąsiedztwo numeru
  aktualnego. Realnie przeterminowanych podstaw: **13**.

  ⛔ Klasa **F-164** popełniona w sesji, która tę samą klasę katalogowała
  u innych. Korekta wpisana do listy jako sekcja 1.1, bez usuwania pierwotnych
  liczb.

  ⚠️ Wniosek dla przyszłego testu: **wygasły numer nie jest sam w sobie błędem** —
  rejestr powinien wymieniać numery historyczne. Test musi rozstrzygać, czy numer
  podano **jako aktualną podstawę**, co wymaga kontekstu, nie sąsiedztwa frazy.

  **Naprawione — 13 miejsc w 6 skillach**, każda para sprawdzona przez porównanie
  tytułów (przy sześciu podmianach w tej serii to już nie formalność):
  ZTP `2016/283`→`2026/300`; UŚUDE `2020/344`→`2024/1513`; fundusze
  `2024/1034`→`2026/60`; obrót instrumentami `2023/646`→`2024/722` (⛔ **11**
  nowelizacji po t.j.); UOOŚiS `2024/1112`→`2026/670`; KPK `2024/37`→`2026/490`;
  rehabilitacyjna `2024/44`→`2026/884`; UUDE `2024/695`→`2026/880` ×2;
  działalność lecznicza `2024/799`→`2026/156`; UFP `2024/1530`→`2025/1483`;
  Ordynacja `2025/111`→`2026/622` ×3.

  ⚠️ `dr-09` podawał UOOŚiS jako `2024/1112` w jednym module i `2026/670`
  w drugim — rozjazd **między plikami jednego skilla**.

  F-181 pozostaje otwarta: pomiar objął tylko pierwsze 25 linii plików.

- 6.64 (2026-09-10k, F-181 OTWARTA): **pomiar nagłówków modułów — 10% podstaw
  prawnych deklarowanych jako aktualne jest przeterminowanych.**

  Kandydat z AUDYT-2026-09-10h wykonany jako jednorazowy pomiar: z pierwszych
  25 linii każdego pliku korpusu wyekstrahowano numery Dz.U. stojące przy frazie
  o tekście jednolitym i odczytano ich `status` w RZĘDZIE 1.

  | Status | Numerów |
  |---|---:|
  | obowiązujący | 249 |
  | **wygaśnięcie aktu** | **28** |
  | akt posiada tekst jednolity | 10 |
  | **uchylony** | **1** |
  | pozostałe | 2 |

  ⛔ **29 przeterminowanych w 35 miejscach, w 11 skillach** — `analizator-umow-v1`,
  `dr-01`, `dr-05`, `dr-06`, `dr-07`, `dr-09`, `dr-10`, `dr-11`, `prawny-router-v3`,
  `prawo-polskie-v2`, `shared`. Najstarszy wpis: `2016/283`, aktualny t.j. od
  2026 r. Trzy numery powtarzają się w 2–3 plikach.

  ⛔ Ta klasa jest twardsza niż O-9: tam starzała się **adnotacja o stanie**,
  tu starzeje się **sam numer podstawy prawnej**. Powołanie wygasłego tekstu
  jednolitego jest błędem podstawy, nie nieścisłością redakcyjną.

  Żaden test tego nie widzi: T3 pyta o zgodność między mapami (nagłówek modułu
  nie jest wierszem mapy), T11 o obecność (numery są obecne, tylko martwe),
  T15 działa na `maps` i `operational`, T24 pyta o zmiany PO tekście jednolitym,
  nie o to, czy tekst jednolity jeszcze żyje.

  ⛔ **Nic nie naprawione w tej sesji — to pomiar, nie naprawa.** Lista robocza
  z ustalonym aktualnym numerem dla każdej pozycji:
  `references/PRZETERMINOWANE-TJ-2026-09-10.md`. Wpisana tam reguła: **nie
  poprawiać hurtem podmianą tekstu** — trzy przypadki z tej serii pokazały, że
  pod przeterminowanym numerem bywa podmiana aktu, a nie zwykłe starzenie,
  i wtedy „aktualny t.j." dotyczy niewłaściwej ustawy.

- 6.63 (2026-09-10j): **łańcuch laboratoryjny — piąta i szósta podmiana aktu.**

  Kandydat z F-148a brzmiał: „nazwa robocza nieaktualna, przemianować wiersz
  i usunąć alias". Odczyt RZĄD 1 pokazał, że pod tą nazwą stały **dwie podmiany**:
  - `2022/2162` opisane jako „ustawa o medycynie laboratoryjnej (nowa), brak t.j."
    → jest **obwieszczeniem** o tekście jednolitym **STAREJ** ustawy
    z 27.07.2001 o diagnostyce laboratoryjnej, status **uchylony**;
  - `2023/1517` opisane jako „stara ustawa o diagnostyce laboratoryjnej"
    → jest **rozporządzeniem MSWiA** z 1.08.2023, bez związku z tą materią;
    błąd powielony w **ośmiu generacjach mapy**.

  Nowa ustawa (`2022/2280`) **nie miała wiersza w ogóle**, a jej t.j. `2025/1295`
  stał pod nazwą starej ustawy.

  Wykonane: oba wiersze skorygowane, dopisane `2022/2280` i `2025/1295`,
  ROUTING-MAP przepisany, moduł dr-10 przestawiony na właściwą podstawę
  z ostrzeżeniem, że powołanie ustawy z 2001 r. jest **błędem podstawy prawnej**.
  Alias wycofany zgodnie z zapisem F-148a.

  ⚠️ **Reguła przeglądu zapisana w `ALIASY-NAZW-AKTOW.md`:** adnotacja „nazwa
  nieaktualna" jest **sygnałem, nie rozstrzygnięciem** — zwykle znaczy, że ktoś
  dopasował numer do nazwy, a nie nazwę do numeru, i pod spodem bywa podmiana.

  ⚠️ Odnotowane przy Regule 12d: dwa odczyty `/references` zwróciły **pustą
  odpowiedź przy poprawnym HTTP**; ponowienie po ~25 s dało pełną treść.
  Poprzestanie na pierwszej próbie dałoby fałszywy negatyw „akt nie ma
  referencji". Pomiar zamiast założenia obowiązuje także wtedy, gdy kanał
  odpowiada, ale odpowiada pusto.

- 6.62 (2026-09-10i): **kontrola adnotacji o stanie; O-9 otwarta.**

  ✅ **Trzy wiersze PREV z F-172 potwierdzone niezależnym pomiarem** (nie
  odczytem dziennika): `2022/974` → t.j. 2024/1620, `2023/1429` → 2026/873,
  `2020/1298` → 2026/113. Wszystkie trzy poprawnie ORG/PREV, wszystkie trzy nowe
  teksty jednolite mają wiersze OK. Naprawa F-172 jest kompletna.

  ⛔ **Ale ta sama klasa błędu żyje dalej.** Skan korpusu za twierdzeniami
  „brak t.j.": 10 wystąpień, **2 nieprawdziwe**:
  - `ROUTING-MAP.md:646` (delegowanie kierowców) — **podwójny błąd**: „brak t.j."
    przy akcie o statusie „akt posiada tekst jednolity", a wymieniony obok
    `2025/797` to **właśnie ten tekst jednolity**, nie nowelizacja;
  - `dr-12/SKILL.md` + `mod-ustawa-notariat` — „brak t.j." przy Prawie
    o notariacie, którego t.j. `2026/614` **stał już w mapie centralnej ze
    statusem OK i przypisaniem do dr-12**. Rejestry zgodne, obecność pełna,
    proza w skillu mówiła coś przeciwnego.

  **O-9 (otwarta) — nikt nie pyta, czy adnotacja o stanie nadal mówi prawdę.**
  ZASADA 8 w wariancie czasowym: numer i nazwa poprawne w chwili zapisu,
  przeterminowała się **adnotacja**. T3 pyta o zgodność numerów, T11
  o obecność, T15 o tożsamość i nowszy t.j. dla ZADEKLAROWANYCH t.j., T24
  o nowelizacje po t.j. Żaden nie pyta o prawdziwość twierdzenia — cała grupa
  pilnuje wartości, nikt nie pilnuje twierdzeń o wartościach.
  ⚠️ Test świadomie **nienapisany w tej sesji**: projekt czułości jest
  niebanalny (rozpoznać twierdzenie o stanie, nie każde „brak"), a rodzina fraz
  szersza niż jedna („nowa ustawa", „projekt", „w vacatio legis").
  Zarys w `AUDIT-JOURNAL.md`, AUDYT-2026-09-10i §3.

  **Sygnał T15 przy `2023/1285`** — zamknięty 2026-09-10f (F-148b) dokładnie tak,
  jak nakazywał zapis F-172: **poprawką w skrypcie, nie przepisaniem rejestru**.
  Treść `ROUTING-MAP.md:219` bez zmian; parser rozpoznaje etykietę „akt
  pierwotny" w koniunkcji z obecnością `t.j.`, a licznik `AKT_PIERWOTNY_OPISANY`
  czyni tłumienie widocznym zamiast cichym.

  Mapa centralna: `2023/1523` przestawiony na ORG/PREV, dopisany `2025/797` (TJ).

- 6.61 (2026-09-10h): **źródło wykazu leków refundowanych ustalone i wpięte;
  czwarty błąd w serii.**

  **Pytanie:** który lek jest refundowany, na jakim poziomie i dla kogo.
  **Odpowiedź:** ma **jedno źródło rozstrzygające** — obwieszczenie Ministra
  Zdrowia wydawane na podstawie art. 37 ust. 1 ustawy o refundacji. Wykaz jest
  **załącznikiem** do obwieszczenia, nie stroną ani wyszukiwarką.

  ⛔ **Wykaz NIE jest aktem Dz.U.** i nie może być szukany w mapie centralnej —
  ogłasza się go w Dzienniku Urzędowym Ministra Zdrowia. To rozróżnienie
  wpisane wprost do mapy zbiorczej i do mapy dr-10, bo bez niego kolejna sesja
  będzie szukała wykazu w ELI i nie znajdzie.

  Pomiar dwukanałowy (Reguła 12d) wykonany dla sześciu kandydatów:

  | Kanał | Rola | Rząd | Pomiar |
  |---|---|---|---|
  | `dziennikmz.mz.gov.pl` | ogłoszenie urzędowe | **RZĄD 1** | 200, ⛔ **SPA** — treść nie wychodzi prostym pobraniem |
  | `gov.pl/web/zdrowie/obwieszczenia-...` | załączniki XLSX/PDF | 2A | 200; **XLSX ≈1 MB jedyny przetwarzalny** (PDF ≈97 MB) |
  | `ezdrowie.gov.pl` | dane dla systemów, korekty wskazań | 2A | 200 |
  | `nfz.gov.pl`, `pacjent.gov.pl` | poziomy odpłatności, uprawnienia | 2A | 200 |
  | `api.nfz.gov.pl/app-stat-api-ra/` | ⚠️ **statystyka**, nie wykaz | 2A | 200 |

  ⛔ Dwie pułapki wpisane do modułu: (1) `api.nfz.gov.pl` zwraca dane
  o zrealizowanych receptach — co refundowano, nie co podlega refundacji;
  (2) **poziom odpłatności bez limitu finansowania nie wystarcza do podania
  kwoty** — przy cenie powyżej limitu pacjent dopłaca nadwyżkę, więc odpowiedź
  „lek jest na 50%, zapłaci połowę" jest fałszywa w typowym przypadku.

  ⛔ **CZWARTY błąd w tej serii — inny mechanizm niż trzy poprzednie.**
  `mod-PrFarm-refundacja-nadzor-sankcje` podawał **w nagłówku** ustawę
  refundacyjną jako `Dz.U. 2025 poz. 907` (status *wygaśnięcie aktu*), a **we
  własnej treści** jako `2026/253` (poprawnie). Moduł przeczył sam sobie
  i żaden test tego nie widział: oba numery istnieją, oba są obwieszczeniami,
  oba dotyczą tej samej ustawy. To nie jest podmiana aktu ani niedomknięcie —
  to **rozjazd wewnątrz jednego pliku**. Propagacja do trzech dalszych miejsc
  w dr-10 naprawiona (ZASADA 8).

  Mapa centralna: +`2026/791` (ustawa o rozwoju usług e-zdrowia — nowelizuje po
  tekstach jednolitych zarówno ustawę refundacyjną, jak i Prawo farmaceutyczne).
  T11 zielony.

- 6.60 (2026-09-10g): **zakres modułu POŚ ustalony; wyrównanie modułów DR do
  zweryfikowanej mapy.**

  **Zakres `mod-POS-prawo-ochrony-srodowiska-szczegoly`.** Wiersz mapy zbiorczej
  od poprzedniego audytu nosił „brak konkretnego aktu do zweryfikowania, wymaga
  doprecyzowania zakresu". Ustalono: moduł jest **warstwą PROCEDURALNĄ**
  (terminy, intake FAZA 0, screening OOŚ, wymiar kary WIOŚ, przesłanki szkody,
  predykcja), a `mod-POS-prawo-ochrony-srodowiska.md` **warstwą MATERIALNĄ
  i USTROJOWĄ** (akt, organ, ścieżka odwoławcza, kwalifikacja KK 181–188a).
  ⛔ Trzy zagadnienia występowały w obu modułach — intake, Natura 2000
  i odpowiedzialność za szkodę. Do każdego dopisano regułę rozstrzygającą, plus
  jawną listę wyłączeń (odpady, Prawo wodne, planowanie i proces budowlany, ETS).
  Bez tego dublowanie było kwestią przypadku, a nie projektu.

  **Wyrównanie modułów do stanu RZĄD 1** — zgodnie z kolejnością przyjętą
  2026-09-10e (najpierw mapa, potem moduły):

  | Akt | t.j. | Deklarowano nowelizacji | Jest |
  |---|---|---:|---:|
  | POŚ | 2025/647 | 1 | **9** |
  | ustawa o odpadach | 2023/1587 | 2 | **10** |
  | ochrona przyrody | 2026/13 | 0 | 3 |
  | KK (181–188a) | 2025/383 | 0 | 4 |
  | UOOŚiS | 2026/670 | 0 | 1 |
  | ustawa VAT (dr-06) | 2025/775 | „ze zm." | **5** |
  | KPA | 2025/1691 | — | 0 |
  | szkody w środowisku | 2020/2187 | — | 0 |

  ⛔ Wzorzec wart nazwania: wiersze nie były **błędne**, były **niedomknięte** —
  wymieniały jedną lub dwie nowelizacje i sprawiały wrażenie kompletnych.
  „Ze zm." bez listy jest gorsze niż brak adnotacji, bo wygląda na rozstrzygnięte.

  Skorygowana błędna data obwieszczenia UOOŚiS (zapis podawał 14.06.2024,
  faktycznie 15.05.2026).

- 6.59 (2026-09-10f): **przegląd pozycji oznaczonych do weryfikacji w mapie
  zbiorczej — trzeci błąd podmiany aktu.**

  Zgodnie z przyjętą 2026-09-10e kolejnością: najpierw mapa zbiorcza, potem
  moduły. Zinwentaryzowano **50 wierszy** `ROUTING-MAP.md` niosących znacznik
  weryfikacyjny; każdy numer Dz.U. z tych wierszy odczytany w RZĘDZIE 1
  (istnienie, typ, status, najnowszy tekst jednolity, nowelizacje po nim).

  ⛔ **TRZECI BŁĄD PODMIANY AKTU w tej serii.** Wiersz „Parabanki/chwilówki/
  lombardy/lichwa" podawał `Dz.U. 2023 poz. 1028` jako **ustawę antylichwiarską**.
  To **wygasły tekst jednolity ustawy o KREDYCIE KONSUMENCKIM** (obwieszczenie
  z 12.04.2023, akt bazowy 2011/715; aktualny tekst jednolity tej ustawy to
  Dz.U. 2025 poz. 1362). Ustawa antylichwiarska to **Dz.U. 2022 poz. 2339** —
  ustawa z 6.10.2022 o zmianie ustaw w celu przeciwdziałania lichwie.
  Klasa F-149(3). Propagacja: `analizator-umow-v1/references/mod-J4-finansowanie.md`
  cytował ten sam wygasły numer jako ustawę o kredycie konsumenckim (akt właściwy,
  numer przeterminowany) — zaktualizowany.

  ⛔ **Zamknięty sygnał `❌ NUMER BŁĘDNY`** przy KPK. `Dz.U. 2025 poz. 1390` to
  rozporządzenie Ministra Finansów i Gospodarki z 12.10.2025 o poborze
  zryczałtowanego podatku — potwierdzone w RZĘDZIE 1, że nie ma związku z KPK.
  Nie było czego korygować: pod tym numerem nie zaewidencjonowano żadnego aktu
  zmieniającego KPK, była to **pusta referencja**. Wiersz przepisany na
  aktualny tekst jednolity KPK (2026/490) z listą pięciu nowelizacji po nim.

  ✅ **Antymobbingowa `2026/1046` podniesiona z RZĘDU 2B do RZĘDU 1.**
  Dotychczasowe rozstrzygnięcie opierało się na trzech zgodnych źródłach
  RZĘDU 2B, co przy zgodności wystarczało warunkowo, ale nie zastępowało źródła
  urzędowego. Potwierdzone w API ELI: ustawa z 19.06.2026 o zmianie KP oraz KPC,
  status obowiązujący, zero nowelizacji po niej.

  ✅ **Dopisane listy nowelizacji po tekstach jednolitych** (KROK 2C) tam, gdzie
  wiersz nosił tylko ogólne „weryfikuj": KK `2025/383` — 4 (2025/1818, 2025/1872,
  2026/902, 2026/988); KPK `2026/490` — 5 (2026/421, 638, 760, 882, 901);
  VAT `2025/775` — 5; antykorupcyjna `2025/499` — 2; wychowanie w trzeźwości
  `2024/1162` — 2; UDIP `2022/902` — 1; Prawo łowieckie `2025/539` — 1;
  zarządzanie kryzysowe `2026/574` — 1. Propagacja list KK i KPK do
  `dr-03/MAPA-AKTOW.md`.

  ✅ Zdjęte zastrzeżenie „pełna historia zmian niepotwierdzona" przy ustawie
  o przeciwdziałaniu nadmiernym opóźnieniom (`2023/1790`) — zero nowelizacji
  po tekście jednolitym, historia domknięta po stronie ELI.

  Mapa centralna: +2 pozycje (2022/2339, 2025/427). T11 zielony.

  ⚠️ **Czego NIE domknięto i dlaczego.** Wiersz KSR 1-15 (flaga F-20) — liczba
  standardów sporna, akty **poza Dz.U.** (Dziennik Urzędowy Ministra Finansów),
  więc ELI nic tu nie rozstrzyga. Wiersz „POŚ Szczegóły" — brak konkretnego aktu
  do zweryfikowania, wymaga decyzji o zakresie, nie odczytu. Oba wymagają
  działania innego rodzaju niż weryfikacja numeru.

  ⚠️ Pozostałe znaczniki „weryfikuj" w tej mapie to w większości **stałe
  instrukcje fresh gate** („re-zweryfikuj przy każdym użyciu"), a nie zaległości.
  Świadomie nietknięte — ich usunięcie osłabiłoby bramkę.

- 6.58 (2026-09-10e): **uzupełnienie mapy o użytkowanie wieczyste; przyjęta
  kolejność aktualizacji rejestrów.**

  ⛔ **Wniosek dotyczył „rozporządzenia 2024/900" — takie rozporządzenie nie
  istnieje pod tym numerem.** `Dz.U. 2024 poz. 900` to **obwieszczenie**
  Marszałka Sejmu z 11.06.2024 o tekście jednolitym **ustawy** z 29.07.2005
  o przekształceniu prawa użytkowania wieczystego w prawo własności
  nieruchomości (akt bazowy `Dz.U. 2005 nr 175 poz. 1459`). Wpisane zgodnie ze
  stanem faktycznym z ELI, nie z opisem we wniosku. Gdyby chodziło o inny
  numer — wpis jest jedną pozycją do wycofania.

  ⛔ **Ujawniona luka:** ani ustawa z 2005 r., ani ustawa z 2018 r.
  o przekształceniu UW gruntów zabudowanych na cele mieszkaniowe **nie
  występowały w systemie w żadnej postaci** (0 trafień). Dopisane obie wraz
  z aktami bazowymi do `dr-09/MAPA-AKTOW.md`, `ROUTING-MAP.md` i mapy
  centralnej — z ostrzeżeniem przed ich myleniem: 2005 r. działa **na wniosek**,
  2018 r. przekształciła grunty **z mocy prawa** od 1.01.2019. Powołanie
  niewłaściwej z nich jest błędem podstawy prawnej, nie nieścisłością nazewniczą.
  Obie oznaczone 🔴 KATALOGOWANY — brak dedykowanego modułu.

  Zweryfikowane w RZĘDZIE 1: 2024/900 jest najnowszym z trzech t.j. swojego
  aktu, 2025/6 najnowszym t.j. ustawy z 2018 r.; obie bez nowelizacji po
  tekście jednolitym. T11 zielony.

  **KOLEJNOŚĆ AKTUALIZACJI REJESTRÓW** — nowa sekcja nagłówkowa
  `prawo-polskie-v2/ROUTING-MAP.md`. Kierunek autorytetu biegnie w dół
  (moduł → mapa lokalna → ROUTING-MAP → mapa centralna), ale kierunek pracy
  aktualizacyjnej odwrotnie: najpierw rozstrzygnięcie w źródle urzędowym
  i domknięcie pozycji oznaczonych do weryfikacji, potem jeden zweryfikowany
  zapis w mapie zbiorczej, dopiero na końcu wyrównanie modułów DR.
  Uzasadnienie: 16 map dziedzinowych aktualizowanych niezależnie rozjeżdża się
  szybciej, niż testy to wychwytują, a T11 widzi rozbieżność **między**
  rejestrami, nie błąd wpisany zgodnie wszędzie (F-82).
  ⛔ Zastrzeżenie wpisane wprost: ROUTING-MAP **nigdy nie staje się źródłem
  weryfikacji**; zapis F-141 obowiązuje w obie strony.

- 6.57 (2026-09-10d, F-141 / F-135 / F-148 / F-160 / O-4): **sześć flag
  „wykonalnych sesją audytową" — i dwa realne błędy podmiany aktu.**

  ⛔ **Najważniejsze ustalenie tej sesji nie jest o testach, tylko o treści.**
  Rozszerzenie T15 (F-148a) wykryło DWA wiersze, w których numer Dz.U. opisywał
  **inny akt niż deklarowany**:
  - `prawo-polskie-v2/ROUTING-MAP.md:770` — „Ustawa o działaniach
    antyterrorystycznych | Dz.U. 2024 poz. 1474" → to obwieszczenie **Ministra
    Sprawiedliwości** o t.j. **rozporządzenia** MS. Poprawnie:
    **Dz.U. 2025 poz. 194** (obwieszczenie Marszałka Sejmu z 5.02.2025).
  - `dr-08/.../mod-ustawa-zarzadzanie-kryzysowe.md` — „Ustawa o zarządzaniu
    kryzysowym | Dz.U. 2024 poz. 1194" → to t.j. ustawy o **dozorze
    technicznym**. Poprawnie: **Dz.U. 2026 poz. 574** (obwieszczenie z 21.04.2026).

  Oba miały status `✅ OK`, oba przechodziły każdą dotychczasową kontrolę: numer
  istnieje, jest obwieszczeniem, ma status obowiązujący. Oba skorygowane wraz
  z propagacją (ZASADA 8) i ostrzeżeniem KROK 2C o nowelizacjach po tekście
  jednolitym (Dz.U. 2026 poz. 815 dla obu aktów).

  **F-148 (zamknięta).** (a) `expected_act_title` obejmowało wyłącznie nazwy
  „Kodeks…" i „Prawo…", więc każda „Ustawa o…" była poza porównaniem — stąd
  ślepota na podmianę aktu. Lista rozszerzona o „ustawa o / z / -"; mutacja
  negatywna na przypadku F-149(3) potwierdzona (PROBLEMS 0 → 1).
  (b) Dwa trwałe fałszywe trafienia usunięte **bez tknięcia korpusu**: okno
  sąsiedztwa 6 wierszy zamiast samego wiersza oraz rozpoznanie etykiety „akt
  pierwotny" w koniunkcji z obecnością t.j. w wierszu.
  Nowy `references/ALIASY-NAZW-AKTOW.md` — 17 rozstrzygnięć „nazwa robocza =
  ten sam akt", każde sprawdzone w RZĘDZIE 1. ⛔ Rejestr NIE jest listą
  wyciszeń: wpis bez kolumny „Sprawdzone" jest nieważny, a zmiana nazwy
  w rejestrze operacyjnym unieważnia alias i przywraca sygnał.
  T15 `maps` i `operational`: PROBLEMS=0.

  **F-141 (zamknięta).** Osiem pozycji Dz.U. zweryfikowanych niezależnie
  w RZĘDZIE 1 (tytuł, typ, status; dla trzech obwieszczeń dodatkowo lista
  `Inf. o tekście jednolitym` aktu bazowego). Wszystkie potwierdzone — siedem
  w tabeli głównej mapy 2026-09-09, ósma (2026/1123, `entryIntoForce`
  2028-01-01) w MONITORING zgodnie z projektem. ⚠️ Praca została faktycznie
  wykonana przy F-172 i **flagi nikt nie zamknął** — ten sam rozjazd „dysk
  wyprzedza rejestr" co przy F-169.
  ⛔ Odnotowane osobno: pierwsza próba weryfikacji 2026/980 z 2026-08-31 dała
  fałszywy negatyw, bo szła **wyszukiwarką**. Rozstrzyga odczyt po adresie
  `/eli/acts/DU/{rok}/{poz}` plus lista t.j. aktu bazowego.

  **F-135 (częściowo).** Osiem znaczników „NIEWERYFIKOWANE RZĄD 1"
  w `ROUTING-MAP.md` rozstrzygniętych w ELI: PrRestr 2026/533, KSH 2024/18,
  KKW 2025/911, PZP 2026/793, obie konwencje wiedeńskie, konwencja genewska.
  Ustalony brakujący numer Protokołu nowojorskiego 1967 — **Dz.U. 1991 nr 119
  poz. 517**. Wszystkie cztery t.j. są najnowsze; KSH i KKW mają po jednej
  nowelizacji po t.j. (wyrok TK K 29/23; Dz.U. 2025 poz. 1423) — dopisane jako
  ostrzeżenie KROK 2C. ⚠️ Weryfikacja dotyczy NUMERÓW, nie treści merytorycznej.

  **O-4 (zamknięta).** `scripts/test_pokrycie_orkiestratora.py` (T23) +
  `references/SKRYPTY-RECZNE.md`. Każdy z 22 zarejestrowanych skryptów ma
  status: 15 w orkiestratorze, 7 zadeklarowanych jako ręczne z powodem.
  Mutacja negatywna potwierdza czułość. T23 wpięty do orkiestratora.

  **F-160 (zamknięta).** Przegląd `references/` audytu wykonany.
  `PRAWO-HARDGATE.md` i `HIERARCHIA-ZRODEL.md` odsyłały do
  `PORTALE-ORZECZNICZE-API.md` jako do źródła INSTRUKCJI — pliku nieosiągalnego
  z produkcji. Rozdzielone: instrukcja → `shared/DOSTEP-MASZYNOWY-API.md`,
  plik audytu → materiał dowodowy.

  ⚠️ **Efekt uboczny warty zapamiętania:** własny wpis tej sesji
  („nowelizacja po t.j. — Dz.U. 2026 poz. 815") został przez T15 odczytany jako
  deklaracja tekstu jednolitego i wygenerował NOT_TJ. Parser reaguje na
  sąsiedztwo `t.j.` z numerem — przy opisywaniu aktów ZMIENIAJĄCYCH trzeba
  pisać „po tekście jednolitym", nie „po t.j. — Dz.U. …".

- 6.56 (2026-09-10c, F-180 / O-5 / O-6): **skrócenie rdzenia, preflight korzenia,
  zakaz orzekania o systemie z jednego nośnika.**

  **F-180 — `PRAWO-HARDGATE.md` 704 → 510 linii (40,9 → 28,7 kB).** Jedyny zasób
  czytany bezwarunkowo w każdej turze prawnej niósł 236 linii gałęzi, które
  w typowej sprawie nie padają ani razu. Wydzielone bez zmian merytorycznych do
  `shared/PRAWO-HARDGATE-BLOKADA.md` (bramka antyfasadowa + kotwica urzędowa,
  wyzwalacz: blokada dostępu do RZĘDU 1) i `shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md`
  (ścieżka B-L, wyzwalacz: akt prawa miejscowego). Historia wersji przeniesiona
  do `shared/references/CHANGELOG.md` (ZASADA 15). Rdzeń R-1…R-5: ≈100 → ≈88 kB.

  ⛔ Wydzielenie bramki pilnującej przed obejściem procedury tworzy pokusę
  pominięcia odczytu. W korpusie zostały **twarde zaślepki**, nie odesłania:
  rozgałęzienie z `⛔ STOP`, zakaz nadania 🟨 i ⚠️ przed wykonaniem `view`,
  powiązanie z kontrolą `[PROFIL-ODROCZENIA]`.
  ⚠️ Czego nie rozstrzyga: czy model w sytuacji blokady faktycznie wykona `view`,
  zamiast go zadeklarować. To jest pytanie F-113 i pozostaje niezmierzone.

  **O-5 — preflight kompletności korzenia w `run_regression_suite.py`.**
  Na rozdzielonym drzewie T3 i T11 (oba KRYTYCZNE) kończyły się
  `KeyError: 'prawo-polskie-v2'` — komunikatem nieodróżnialnym od realnego braku
  skilla. Preflight zlicza skille, szuka brakujących w katalogach sąsiednich
  i rozstrzyga jawnie: „skille są, ale poza tym katalogiem" kontra „skilli nie ma
  nigdzie w pobliżu". Przy niekompletnym korzeniu przebieg zatrzymuje się
  z kodem 2, zanim wyniki zaczną wprowadzać w błąd. Zweryfikowane na realnym
  przypadku z 2026-09-09.

  **O-6 — pozycja `[STAN-ZAŁADOWANY]` w SELF-CHECK routera (3.45).** Zakaz
  orzekania o luce w systemie bez zestawienia wersji załadowanej przez hosta
  z wersją w repozytorium; alternatywnie wniosek ⚠️ WARUNKOWY z podaniem wersji
  roboczej. Podstawa: ocena z 2026-09-09/10 prowadzona na kopii z routerem 3.41
  zgłosiła jako usterkę systemu lukę, której w repozytorium (3.42) nie było.
  Klasa F-151, tym razem po stronie oceniającego.

- 6.55 (2026-09-10b, F-179 / O-7): **korekta fałszywej przesłanki, bramka
  wydania w CI, próg minimalnego modelu w README.**

  **F-179 — profil LEKKI był uzasadniony liczbą, która nie opisywała świata.**
  Wydanie 6.54 podało „≈219 kB ≈ 54 tys. tokenów ścieżki obowiązkowej przed
  wczytaniem PRIMARY". Liczba sumowała `MOD-CN-GATE`, `MOD-REM-GATE`,
  `MOD-WYJATEK-GATE`, `MOD-OS-CZASU-PRZESLANEK`, `HIERARCHIA-ZRODEL`,
  `MOD-STEP-TRACKER` i `DISCLAIMER` jako koszt bezwarunkowy — a wszystkie mają
  wyzwalacze warunkowe u siebie i podlegają **leniwemu ładowaniu**.

  ⛔ **Czwarte wystąpienie klasy F-164:** teza o świecie przyjęta bez pomiaru.
  Poprzednie trzy dotyczyły niedostępności źródeł (F-151, F-162, F-164), to
  dotyczy kosztu kontekstu — ale mechanizm jest ten sam i tym razem przeszedł
  przez pełny zestaw regresyjny, bo **żaden test nie sprawdza przesłanek
  faktycznych, na których zbudowano regułę**. Testy pilnują rejestrów, wersji
  i map; twierdzenia o świecie są poza ich zasięgiem. Odnotowane jako
  ograniczenie strukturalne aparatu, nie jako usterka do naprawienia testem.

  Zmierzone poprawnie: koszt stały (`name` + `description` 32 skilli) ≈5,9 kB
  ≈1,5 tys. tokenów; rdzeń R-1…R-5 ≈100 kB ≈25 tys. tokenów po wyzwoleniu
  routera; warstwa warunkowa 0–113 kB, leniwa już wcześniej.
  **Profil LEKKI nie zmniejsza rdzenia ani o bajt** — jego korzyść jest
  audytowa: zamienia uznaniowe leniwe ładowanie na deklarowane i sprawdzalne,
  zamykając tryb awarii „odroczenie cicho stające się pominięciem".
  `PROFIL-LEKKI.md` 1.0 → 1.1, router 3.43 → 3.44.

  **O-7 (zamknięta) — `.github/workflows/regresja.yml`.** Zestaw regresyjny jako
  warunek wydania na `push` i `pull_request` dla kanałów rozpakowanych, plus
  kontrola spójności archiwów `.zip` z rozpakowanymi źródłami. Powód wagi:
  benchmark 2026-09-08 wykazał, że różnica między dwiema wersjami tego samego
  routera (0,7 pkt) przewyższa różnicę między routerem a jego brakiem (−0,2).
  Wydanie niesprawdzonej wersji bramki jest ryzykiem pierwszej klasy — F-178
  była tego dowodem.

  **README — twardy próg minimalnego modelu.** Sekcja przed Krokiem 1
  instalacji, z tabelą efektu per model i zakazem dla Haiku 4.5. Powód:
  Mechanizm 3 z `WPLYW-SKILLI.md` jest udokumentowaną szkodą — ceremonia
  bramkowa odtworzona, treść bramki nie, kilkanaście zmyślonych numerów
  artykułów pod nagłówkiem ścieżki weryfikacji. To jedyny znany tryb, w którym
  system czyni szkodę większą niż jego nieużywanie, i dotąd nie było o nim
  słowa w miejscu, które użytkownik czyta przed instalacją.

- 6.54 (2026-09-10, F-175/F-176/F-177): **profil LEKKI, rejestr konektorów
  POZIOM A, warstwa wykonawcza F-113 i jeden odwrotny rozjazd wersji.**

  **F-175 (zamknięta) — profil LEKKI.** Zmierzona ścieżka obowiązkowa routera:
  ≈219 kB ≈ 54 tys. tokenów PRZED wczytaniem PRIMARY. Wdrożono
  `prawny-router-v3/references/PROFIL-LEKKI.md` (rdzeń R-1…R-5 vs warstwa
  odroczona), pozycję `[PROFIL-ODROCZENIA]` w SELF-CHECK i dwie linie w KROKU 3A.
  Router 3.42 → 3.43. ⛔ Profil nie znosi żadnej bramki. Zbieżność z benchmarkiem
  2026-09-08: ujemny znak skilli przy średnim poziomie rozumowania (−7,5 pkt) to
  właśnie sygnatura wypierania uwagi przez koszt kontekstu.

  **F-175 część druga — konektory POZIOM A.** `shared/PRAWO-HARDGATE.md`
  definiuje POZIOM A jako najsilniejszy kanał weryfikacji i wymieniał wyłącznie
  „wzorce", nie wskazując ani jednego działającego serwera — POZIOM A był
  deklaracją, a weryfikacja szła POZIOMEM B/C.
  `shared/KONEKTORY-REKOMENDOWANE.md` uzupełniony o rejestr dziesięciu
  publicznych serwerów MCP dla źródeł PL/UE z mapowaniem na bramki (HARDGATE,
  SYGNATURY, KROK 0D/PRE-W2, UP-5). Wpisy mają status RZĄD 3; treść dziedziczy
  RZĄD **źródła**, nie konektora. „Zwrócone przez MCP" nie jest znacznikiem.

  **F-176 (zamknięta) — warstwa wykonawcza F-113.** Ustalono, dlaczego plan
  z 2026-08-24 nie ruszył: nie ma wady projektowej, tylko zakłada istnienie
  ramienia kontrolnego i nie mówi, jak je zbudować. Dostarczono
  `scripts/build_ramie_kontrolne_f113.py` i `references/PROTOKOL-WYKONAWCZY-F113.md`
  (plan minimum 20 przebiegów, karta przebiegu, budżet ~2 sesje).
  ⛔ Ustalenie z pierwszego uruchomienia, istotne poza F-113: skasowanie trzech
  plików kanonicznych bramek zostawia **43 zerwane odwołania w 57 plikach**,
  a skill z zerwanym odwołaniem wchodzi fail-closed w TRYB ZDEGRADOWANY —
  przebieg mierzyłby wtedy reakcję na awarię zasobu, nie brak bramki, czyli
  powtórzyłby wadę TEST1–3. Krok sprzątania odwołań jest częścią pomiaru.
  ⛔ **F-113 pozostaje OTWARTA** — status zmieniony z „brak narzędzia" na
  „narzędzie gotowe, pomiar do wykonania".

  **F-177 (zamknięta) — `raport-klienta-v1`.** T12 wykrył ODWROTNY rozjazd:
  `references/CHANGELOG.md` ma wpis 1.5, a `version:` pozostał 1.4 — wersja nie
  została podbita po naprawie. Kierunek odwrotny do F-101, ta sama przyczyna:
  metadane wersji edytowane w dwóch nośnikach osobno. Podbito do 1.5.

- 6.53 (2026-09-09b, F-172 ZAMKNIĘTA): **nowa generacja mapy Dz.U. —
  `references/mapa_dzu_2026-09-09.md`.**

  T11 wskazywał 20 pozycji obecnych w rejestrach operacyjnych i nieobecnych
  w mapie centralnej (11 numerów unikalnych). Każdy sprawdzony w RZĘDZIE 1
  (`api.sejm.gov.pl/eli`, odczyt 2026-09-09): typ, tytuł urzędowy, data
  ogłoszenia, status, akt bazowy. Wszystkie 11 istnieje i obowiązuje.
  Dla ośmiu obwieszczeń sprawdzono dodatkowo listę `Inf. o tekście jednolitym`
  aktu bazowego — każde jest NAJNOWSZYM t.j. swojego aktu, więc żadne nie
  wchodzi jako `PREV`. ⛔ To jest ta kontrola, której ZASADA 8 wymaga wprost:
  numer sprawdzany niezależnie od tego, czy nazwa w rejestrze wygląda dobrze.

  **Dodane do tabeli głównej (10):** 2026/980 (piecza zastępcza, t.j.),
  2026/873 (świadczenie wspierające, t.j.), 2026/731 (nowelizacja ustawy
  o radcach prawnych), 2026/113 (pomoc na ratowanie i restrukturyzację, t.j.),
  2024/1620 (wyroby medyczne, t.j.), 2024/1111 (pożyczka lombardowa, t.j.),
  2023/1285 (pożyczka lombardowa, akt pierwotny, `PREV`), 2023/845 (UPNPR,
  t.j.), 2023/123 (opłaty w sprawach karnych, t.j.), 2022/1722 (radiofonia
  i telewizja, t.j.).

  **Do MONITORING (1):** 2026/1123 — wejście w życie **1.01.2028**, więc nie
  wolno jej trzymać w tabeli głównej. ⚠️ Rozbieżność opisu wychwycona przy
  okazji: `ROUTING-MAP` cytuje ją jako prospektywną zmianę ustawy o SN, a tytuł
  urzędowy brzmi „o zmianie ustawy o opiece nad dziećmi w wieku do lat 3 oraz
  niektórych innych ustaw" — oba są zgodne (zmiana SN idzie przez „niektóre
  inne ustawy"), ale w mapie zapisano tytuł URZĘDOWY, nie skrót z rejestru.

  **Trzy wiersze przestawione na `PREV`,** bo ich akty bazowe doczekały się
  tekstu jednolitego: 2022/974 (wyroby medyczne — wiersz twierdził „brak t.j.",
  co było nieprawdą od 10.10.2024), 2023/1429 (świadczenie wspierające),
  2020/1298 (pomoc na ratowanie). ⛔ Wzorzec ZASADY 8 w wariancie czasowym:
  numer i nazwa poprawne, ale adnotacja o braku t.j. przeterminowała się po
  cichu — mapa nie kłamała w chwili zapisu, tylko przestała być prawdziwa.

  **Sygnał T15 rozstrzygnięty jako fałszywy alarm.** `Dz.U. 2023 poz. 1285`
  w `prawo-polskie-v2/ROUTING-MAP.md:219` jest tam jawnie opisany jako akt
  PIERWOTNY obok t.j. 2024/1111; parser T15 czytał go jako deklarację t.j.
  Mapa i rejestr były zgodne ze stanem faktycznym. Kandydat na zawężenie
  heurystyki T15 — do rozstrzygnięcia przy najbliższej edycji tego testu.

  **Po zmianie:** T11 OK (0 rozbieżności, 632 numery w mapie), T3 OK, T18 OK.

- 6.52 (2026-09-09, F-169 i F-170 ZAMKNIĘTE, F-171 OTWARTA): **naprawy po
  przebiegu całej grupy T na 33 skillach.**

  **F-169 — router 3.41 → 3.42, dwa czerwone testy z jednej przyczyny.**
  T12 zgłaszał ⛔ LUKA HISTORII (version 3.41, najnowszy wpis changelogu 3.38),
  a T17 — FAIL na „lekki korpus ≤500 linii". Oba pochodziły z tego samego
  miejsca: pole `changelog:` we frontmatterze routera trzymało PEŁNE wpisy
  3.30–3.41 (13 wierszy YAML, część o długości akapitu), a wpisy 3.38–3.41
  nie istniały w `references/CHANGELOG.md` — wbrew standardowi 2026-08-20z4,
  który czyni ten plik jedyną lokalizacją kanoniczną i zakazuje pełnej listy
  w YAML. Wpisy przeniesione, pole zredukowane do skrótu bieżącej wersji.
  ⛔ Zero zmian w treści proceduralnej routera, w routingu [1]–[11], w regułach
  i w bramkach.

  **F-169 część druga — T17 mierzył niewłaściwą wielkość.** Warunek nazywa się
  „lekki korpus", a liczył `len(skill.splitlines())`, czyli plik RAZEM
  z frontmatterem. Skutek: każdy nowy wpis `required_modules:` (26 pozycji),
  `escalation:` czy `changelog:` zjadał budżet przeznaczony na treść
  proceduralną, a router 3.41 miał 550 linii pliku przy 437 liniach korpusu.
  Warunek liczy odtąd KORPUS (≤500), a rejestry metadanych dostały własny,
  jawny próg (frontmatter ≤150). ⚠️ To jest ZMIANA MIARY, nie podniesienie
  progu — korpus po naprawie ma 438 linii wobec ~400 z wersji 3.28, więc gate
  chroniący przed rozdęciem procedury nadal ma zapas i nadal blokuje.
  Alternatywa odrzucona: podniesienie 500→600 na całym pliku ucisza test
  w sposób, który powtórzy się przy każdym kolejnym module w rejestrze.

  **F-169 część trzecia — lista reguł w kontrakcie była snapshotem.**
  `expected_rules` w `test_router_contract.py` nie zawierała reguł 12b (CN-GATE,
  router 3.39), 12c (REM-GATE, 3.39/3.40) i 12d (REM-0, 3.40), więc T17 zgłaszał
  FAIL za reguły dodane legalnie i udokumentowane w changelogu. Dopisane;
  kolejność i znaczenie pozostałych 32 pozycji bez zmian. Dopisanie kolejnej
  pozycji wolno wykonać wyłącznie razem z wpisem w changelogu routera
  i w tym dzienniku.

  **F-170 — T21 karał za konwencję, nie za stan plików.** Cztery skille
  (`audyt-systemu-v4`, `prawny-router-v3`, `shared`, `dr-14`) generują sumy przez
  `find . -type f`, czyli w formacie `./plik.md`; T21 nie normalizował prefiksu,
  więc dla WSZYSTKICH 307 ich plików raportował „BRAK WPISU". Dwa skutki:
  test KRYTYCZNY świecił na czerwono bez usterki, a w tym szumie ginął jedyny
  realny rozjazd sum w całym systemie — `references/AUDIT-JOURNAL.md`, edytowany
  bez przeliczenia sumy. ⛔ Ta sama klasa ślepoty, którą T21 miał zamykać
  (F-145): wynik pozornie zdrowy przy niesprawdzonym stanie faktycznym, tylko
  odwrócony — tu szum zamiast ciszy. Dodana `normalizuj()`; obie konwencje
  przechodzą, bo obie są poprawne (`sha256sum -c` też normalizuje `./`).
  Sumy `CHECKSUMS.sha256` przeliczone w obu zmienionych skillach.

  **F-171 OTWARTA — cztery regresje dostępu, pomiar 2026-09-09.** T25:
  52 sondy, 40 zgodnych ze stanem odniesienia z 2026-09-04, regresje:
  SAOS `/api/search`, `/api/dump`, `/api/judgments/{id}` (HTTP 502, 3/3 prób)
  i `decyzje.uokik.gov.pl` (HTTP 503, 3/3). SAOS to kanał maszynowy RZĘDU 2A
  dla orzecznictwa — do powrotu obowiązuje ścieżka zastępcza przez portale
  pojedynczych sądów. ⚠️ Trzykrotna porażka jednego dnia dowodzi
  niedostępności TEGO DNIA, nie trwałej — przed orzeczeniem o wygaszeniu
  powtórz pomiar. Surowy wynik i 8 pozycji grupy `kandydaci` osiągalnych mimo
  statusu POZA_LISTA (materiał F-157): `references/F-171-pomiar-domen-2026-09-09.md`.

  **Przebieg grupy T po naprawach:** T1, T2, T3, T6/T7, T8, T9, T12, T13, T14,
  T17, T18, T19, T19b, T21, T22, T26 i MOCK — zielone. T11 (20 pozycji)
  i T24 (139 pozycji wymagających fresh gate poza t.j.) pozostają WARN
  z przeglądem merytorycznym; T4, T5, T16 i korpusowy przebieg T20 są ręczne
  lub wymagają materiału wejściowego. Pełny opis: `AUDIT-JOURNAL.md`,
  wpis AUDYT-2026-09-09.

- 6.51 (2026-09-04c, F-159 ZAMKNIĘTA, F-160 CZĘŚCIOWO): **T26 —
  `check_frontmatter_yaml.py`, bramka parsowalności frontmatteru.**
  ⛔ Powód: `prawny-router-v3` **dwa razy pod rząd** nie ładował się na hoście
  przez zły YAML (3.37/F-146 — niesparowany cudzysłów; 3.38 — `": "` w linii
  kontynuacji elementu `escalation`, ScannerError w linii 50). Naprawiano
  objaw, nie przyczynę: **żaden skrypt w pakiecie nie używał PyYAML**. T22
  jawnie deklaruje „bez PyYAML" i sprawdza, czy frontmatter da się WYODRĘBNIĆ,
  nie czy da się PRZECZYTAĆ — plik z uszkodzoną składnią przechodził go
  bezbłędnie. Ta sama ślepota co F-130/F-145/F-147.
  T26 łapie też ciche zniekształcenie typu: `- opcjonalnie: X` parsuje się BEZ
  BŁĘDU jako mapa, nie tekst. Brak PyYAML → **kod 2, nie 0**; test kończący
  cicho zerem udawałby, że sprawdził. Przebieg na 32 zainstalowanych skillach:
  **31 czystych**. Selftest 10/10 z mutacjami negatywnymi.
  ⚠️ **Korekta jeszcze przed wydaniem:** pierwsza wersja wymagała, by
  `changelog` był listą, i zgłosiła `shared` jako usterkę — fałszywy alarm,
  bo blok `|` jest legalny i odporniejszy na F-146/F-159 niż lista cytowanych
  elementów. Reguła zawężona; bramka produkująca fałszywe alarmy zostaje
  wyłączona po drugim przebiegu i przestaje chronić cokolwiek.
  **F-160:** `PORTALE-ORZECZNICZE-API.md` §7 był niewidoczny z produkcji —
  `audyt-systemu-v4` nie jest zależnością żadnego skilla produkcyjnego.
  Wyciąg operacyjny przeniesiony do `shared/DOSTEP-MASZYNOWY-API.md`; pomiar
  i dowód zostają tutaj (bez duplikacji).

- 6.50 (2026-09-04b, F-158 CZĘŚCIOWO ZAMKNIĘTA, F-157 część (a) WYKONANA):
  **dwa API rozstrzygnięte metodą zamiast zgadywaniem.**
  ⭐ **UODO** — adres specyfikacji wyjęty z bloku `SwaggerUIBundle` w `/api-doc/`
  (`schemas/openapi.yml`, OpenAPI 3.1). Łańcuch wyszukiwanie → metadane → pełna
  treść XML zmierzony end-to-end: 35 dokumentów w oknie 1Y, dokument oddany jako
  118 kB XML. **Jedyny polski organ z udokumentowanym publicznym API do własnych
  rozstrzygnięć** — dopisany do RZĘDU 2A w `shared/HIERARCHIA-ZRODEL.md`.
  ⚠️ **EUREKA** — baza `/api/public/v1` odczytana z bundle `main.*.js` (2,6 MB),
  nie zgadnięta; pobieranie po ID (26 kB JSON) i katalog 40 metadanych działają.
  Schemat POST wyszukiwarki nierozstrzygnięty — 405 na GET dowodzi istnienia
  zasobu, 500 na trzech domyślonych ciałach; dalszego zgadywania zaniechano.
  **F-157 (a):** reguła kanału kodu propagowana do `shared/PRAWO-HARDGATE.md`
  i `shared/HIERARCHIA-ZRODEL.md` v1.6 — obowiązuje wszystkie skille, nie tylko
  audyt. T25 dostał grupę `kandydaci` (8 sond `POZA_LISTA`) i sekcję ODBLOKOWANE,
  więc po zmianie konfiguracji test sam pokaże, co się otworzyło.
  ⛔ **Dwie korekty własne.** (1) Zapis „`Default.aspx` stabilne 8/8" był
  artefaktem małej próby — przy 10 próbach dał 2×404; niedeterministyczny jest
  CAŁY host `bzp.uzp.gov.pl` (~20%). Stąd pole `flaky` + przypadek selftestu
  pilnujący, by flagi nie użyto do uciszenia wyniku. (2) **Test sam wywołał
  awarię, którą zaraportował**: CBOSA po serii żądań 503 ×3, po 60 s pauzy
  200/200/200. Zapowiedź NSA o blokowaniu „nadmiernego korzystania" przestała
  być cytatem, a stała się pomiarem. Stąd pole `pauza` (CBOSA 15 s), 2 ponowienia
  i wymóg uzasadnienia każdej pauzy. Selftest 15/15 → **17/17**.
  Pomiar: **52 sondy, 52/52 zgodnych, 0 regresji**.

- 6.49 (2026-09-04, F-152 ZAMKNIĘTA, nowe F-157 i F-158): **T25 —
  `check_domeny_allowlist.py`, 40 sond osiągalności.** Deweloper wdrożył
  rekomendację §6 inwentarza; zamiast przepisać statusy ręcznie — zmierzono,
  bo `PORTALE-ORZECZNICZE-API.md` §5/§6 sam tego wymagał, a narzędzia nie było.
  Wynik: 32 ✅ / 4 ⛔ / 3 ✖ / 1 ⚠️, 40/40 zgodnych, 0 regresji, selftest 15/15.
  ⛔ **Ustalenie ważniejsze od samego zamknięcia flagi: dwie pozycje raportowały
  się jako awaria portalu, będąc awarią NASZEGO żądania.** `orzeczenia.ms.gov.pl`
  daje 200 pod `curl/8.5.0` i 502 pod łańcuchem Chrome (5/5 każdy wariant),
  a SAOS oddaje JSON pod neutralnym UA i **HTTP 200 ze stroną „Przerwa
  techniczna"** pod przeglądarkowym — czyli awaria wyglądająca jak sukces.
  Stąd klasyfikator T25 sprawdza TREŚĆ, nie kod. Nowa sekcja §2G inwentarza
  opisuje cztery warianty pułapki (UA, brak `Accept` → 406, przekierowanie na
  host spoza listy, niedeterminizm farmy `bzp.uzp.gov.pl` 404 w 2/8 prób).
  Nowa sekcja §7 — instrukcje dostępu, których inwentarz nie miał: dokumentacja
  SAOS z parametrem `lawJournalEntryCode=RRRR/PPP` (maszynowy most
  „przepis → orzecznictwo go stosujące"), token CEIDG, ścieżki zamiast rootów.
  ⛔ W trakcie budowy T25 wykryto i naprawiono **fałszywy pozytyw we własnym
  klasyfikatorze**: `isap.sejm.gov.pl` raportował się jako OK, bo pętla 302
  Impervy oddaje kod 3xx, a reguła „mniej niż 400 = OK" przepuszczała go jako
  sukces. Dodano gałąź 3xx + dwa przypadki selftestu. To ta sama klasa błędu
  co F-150 — bramka obecna, ale mierząca nie to, co trzeba.
  ⚡ Drzewo STRUKTURA KATALOGU podawało 82 pliki przy 84 faktycznych — trzeci
  z rzędu rozjazd tego licznika (F-147: 71 przy 81); poprawione na 86.

- 6.48 (2026-09-01k, flaga F-156 — korekta rozstrzygnięcia): **cofnięte oznaczanie
  nowelizacji po t.j. w mapie DR-08.** Wersja 09-01j usunęła liczby, ale zostawiła
  znacznik ⚠️ przy 12 pozycjach. Na uwagę użytkownika cofnięto i to, z mocniejszego
  powodu niż pierwotny: **oznaczenie przy jednych pozycjach twierdzi coś o pozostałych**
  — wiersz bez znacznika czyta się jako „tu t.j. wystarczy", czyli jako zdanie o stanie
  rejestru na dzień oznaczania, nie na dzień użycia mapy. Zamiast oznaczeń: sekcja
  „Gdzie sprawdzić nowelizacje" w mapie i kanoniczna tabela adresów w KROKU 2C
  `shared/PRAWO-HARDGATE.md` + ⛔⛔ zakaz przenoszenia wyniku do map i modułów.
  T24 bez zmian — test liczy w momencie uruchomienia, więc nie ma czego zestarzeć.
- 6.47 (2026-09-01j, flaga F-156 ZAMKNIĘTA): **T24 — `check_nowelizacje_po_tj.py`.**
  Rozstrzygnięcie flagi: test przy każdym uruchomieniu zamiast ręcznego oznaczania
  139 pozycji w 15 mapach; wpisana liczba zestarzałaby się w tygodniach i mapa
  kłamałaby pewniej niż dziś, gdy nic nie twierdzi (klasa F-82). Źródło liczby to
  unia sekcji ELI i metody datowej (F-155); logika IMPORTOWANA z
  `check_wyjatek_gate_eli.py`, czego pilnuje osobny przypadek selftestu. Test poza
  orkiestratorem (wymaga sieci), WARN a nie FAIL — to stan świata, nie usterka repo.
  Przebieg: 251 numerów, 139 WARN, 0 problemów statusu; selftest 9/9.
  ⛔ Pierwszy przebieg dał trzy FAŁSZYWE alarmy na adnotacji „(akt pierwotny: Dz.U. …)"
  wprowadzonej dzień wcześniej przy naprawie F-155 — `PIERWOTNY_RE` wycina ją przed
  ekstrakcją, dwa nowe przypadki selftestu.
- 6.46 (2026-09-01i, flaga F-155 ZAMKNIĘTA, nowa F-156): **oba zakresy F-155 wykonane.**
  Zakres 1 — sekcja ELI „Nowelizacje po tekście jednolitym" porównana z metodą datową
  na 19 aktach, pomiar powtórzony niezależnie od deklaracji w docstringu: 16 zgodnych,
  3 przypadki, w których sekcja jest WŁAŚCIWYM PODZBIOREM (brak 4 ustaw zmieniających,
  wszystkich obowiązujących, w tym jednej od ośmiu miesięcy), 0 rozbieżności odwrotnych.
  ⛔ Wniosek ODWROTNY do hipotezy flagi: sekcja nie zastępuje metody datowej, tylko ją
  uzupełnia — obowiązuje unia z jawną proweniencją `DATA+API`/`DATA`/`API`.
  Zakres 2 — przegląd wszystkich 16 map w żywym ELI: 251 numerów, 248 obowiązujących,
  **zero nieaktualnych t.j.**, trzy pozycje wskazujące akt bazowy zamiast t.j.
  (dr-04 ×2, dr-10 ×1) poprawione. Nowy `references/PRZEGLAD-MAP-ELI-2026-09-01i.md`.
  **F-156 OTWARTA** — 139 pozycji w 16 mapach ma nowelizacje po t.j., oznaczone tylko
  w DR-08; do rozstrzygnięcia oznaczanie ręczne vs test automatyczny.
- 6.45 (2026-09-01h, flaga F-155): **pełny przegląd MAPA-AKTOW w DR-08 w żywym ELI.**
  21 pozycji: numer i status `obowiązujący` 21/21, tożsamość tytułu 17/17 obwieszczeń,
  najnowszy t.j. 17/17 — błędu numeru ani podmiany aktu NIE znaleziono. Znaleziono
  co innego: **11 z 17 aktów ma nowelizacje ogłoszone PO dacie t.j.**, a mapa
  oznaczała je jako 🟢 bez sygnału — punkt ślepy F-153 po stronie danych.
  Odnotowano też pułapkę metodyczną: dojście do aktu bazowego przez wyszukiwanie
  po tytule daje wyniki fałszywe; właściwa droga to sekcja „Tekst jednolity dla aktu"
  w `/references`. **F-155 OTWARTA** — ELI podaje gotową sekcję „Nowelizacje po
  tekście jednolitym", którą skrypt dziś rekonstruuje z dat; do przełączenia po
  porównaniu na ≥15 aktach. Drugi zakres F-155: przegląd tą metodą przeszedł
  wyłącznie DR-08, pozostałych 15 map nie badano.
- 6.44 (2026-09-01g, flagi F-153 / F-154 — obie ZAMKNIĘTE): **F-153 rozstrzygnięta
  na rzecz STOP, nie scalania.** `check_wyjatek_gate_eli.py` przerywa zamiatanie
  (kod 6), gdy rejestr ELI pokazuje nowelizacje ogłoszone PO dacie t.j., i wskazuje
  dwa świadome wyjścia: `--mimo-nowelizacji` (kontynuacja z etykietą
  `⚠️ + N nowelizacj(e) PO t.j.`) albo zamiatanie wprost tekstu aktu zmieniającego.
  Scalanie odrzucone — wytworzyłoby brzmienie, którego żaden publikator nie ogłasza.
  Selftest 20/20 → **23/23** (z mutacją negatywną na warunku `if not allow_stale`);
  zweryfikowane na żywym ELI: ustawa o PIP `DU/2007/589` → 6 nowelizacji po t.j. →
  STOP, KC → brak → przebieg bez zmian. **F-154:** publikator aktów prawa miejscowego
  wpięty w DR-08 i DR-09, ścieżka B-L opisana w `shared/PRAWO-HARDGATE.md`.
  ⛔ Przy okazji: DR-08 wskazywał `dzienniki.gov.pl` w 6 plikach (12 wystąpień) —
  poprawione na `dziennikiurzedowe.gov.pl`; skorygowano też własny wpis 09-01f,
  który błędnie twierdził, że DR-08 publikatora nie zna.
- 6.43 (2026-09-01f, flaga F-154): przegląd list źródeł pod kątem publikatorów
  rządowych POMINIĘTYCH w hierarchii → siedem luk uzupełnionych w `shared`
  (HIERARCHIA-ZRODEL v1.6, PRAWO-HARDGATE POZIOM B). Najpoważniejsza:
  **wojewódzkie dzienniki urzędowe** — jedyny publikator aktów prawa miejscowego,
  nieobecny w RZĘDZIE 1, mimo że DR-08 i DR-09 pracują na uchwałach rad gmin
  i planach miejscowych. Dalej w RZĘDZIE 1: Monitor Polski (`monitorpolski.gov.pl`
  + `api.sejm.gov.pl/eli/acts/MP/...`), Dz.U. RCL, dzienniki urzędowe ministrów.
  W 2A: interpretacje organów (EUREKA, BIP GIP wg art. 14b ustawy o PIP),
  rejestry urzędowe (KRS, KRZ, eKRS/PDF, EKW, CEIDG, REGON, SUDOP, BZP) —
  wyłącznie dla FAKTU wpisu — oraz materiały legislacyjne (RCL, druki sejmowe)
  z zakazem cytowania z nich brzmienia. ⚠️ Zmierzone: `api.sejm.gov.pl/eli/acts`
  zwraca wyłącznie `DU` i `MP`, więc publikatory lokalne są POZA API ELI.
  **F-154 OTWARTA** — propagacja do modułów DR-08/DR-09 i MAPA-AKTOW niewykonana;
  wpis w hierarchii nie sprawia, że moduł dziedzinowy po publikator sięgnie.
- 6.42 (2026-09-01e, flaga F-152): **domknięcie badania portali i gotowa rekomendacja
  listy dozwolonych domen.** Nowe sekcje inwentarza: §2E — zamówienia publiczne
  i rejestry sądowe MS (KIO bez REST, ale BZP z API w OBU generacjach PZP:
  SOAP `websrv.bzp.uzp.gov.pl/BZP_PublicWebService.asmx` dla „starego" i REST
  `ezamowienia.gov.pl/mo-board/api/v1/notice` dla „nowego"; pełna Platforma
  e-Zamówienia reglamentowana procedurą UZP; KRZ — portal publiczny bez logowania,
  API urzędowe NIEPOTWIERDZONE, oferty pośredników komercyjnych tego nie dowodzą;
  PRS, eKRS/PDF, EKW, ISWS, RPS). §2F — skrót „HIP" z polecenia użytkownika
  **nierozstrzygnięty**, tropy IPO TK / EKW / BIP sprawdzone i odrzucone, treści
  nie zgadywano. §6 — rekomendacja listy dozwolonych domen w trzech grupach
  priorytetowych (A orzecznictwo i interpretacje, B rejestry podmiotów,
  C legislacja/zamówienia/dane), z pozycjami świadomie pominiętymi
  (`orka*.sejm.gov.pl` — funkcję pełni już dozwolone `api.sejm.gov.pl`;
  `rps.ms.gov.pl` — najpierw podstawa prawna; `api.ezamowienia.gov.pl` — dostęp
  po wniosku) i trzema zastrzeżeniami: odblokowanie kanału ≠ zgoda portalu
  (CBOSA i UOKiK mają własne zabezpieczenia), lista jest hipotezą do zmierzenia,
  a część pozycji wymaga nadto tokenu, renderowania JS albo parsowania HTML.
  Zakres F-152 rozszerzony o jedenaście nowo zmierzonych domen.
- 6.41 (2026-09-01d, flaga F-153): **naprawa F-150 miała własny punkt ślepy.**
  Przestawienie odczytu z tekstu ogłoszonego na tekst jednolity przesunęło tryb
  awarii o jedną wersję dalej: t.j. nie zawiera nowelizacji ogłoszonych po jego
  dacie. Zmierzone na ustawie o PIP — obowiązujący t.j. Dz.U. 2024 poz. 1712 NIE
  zawiera art. 14b, dodanego ustawą Dz.U. 2026 poz. 473 z mocą od 2026-07-08;
  ELI pokazuje dla tego aktu sześć nowelizacji po dacie t.j.
  `check_wyjatek_gate_eli.py` wypisuje teraz tę listę (KROK 2C) i dopisuje
  ostrzeżenie do etykiety wersji; selftest 17/17 → **20/20**. ⛔ F-153 pozostaje
  OTWARTA — skrypt nie scala treści nowelizacji, więc jednostka dodana po t.j.
  nadal nie wchodzi do zamiatania S1/S2; do rozstrzygnięcia scalanie vs twardy STOP.
  `references/PORTALE-ORZECZNICZE-API.md` rozszerzony o sekcje **2A** (API Sejmu
  jako maszynowy następca ORKA/ORKA2 — OpenAPI 3.0.3, 55 ścieżek, druki,
  uzasadnienia, procesy legislacyjne z polem `ELI`, odpowiedzi na interpelacje),
  **2B** (KRS bez klucza, CEIDG v3 za JWT z limitem 50/180 s, REGON/BIR, SUDOP
  z zastrzeżeniem jakości danych samego UOKiK) oraz **2C** — nowa instytucja
  interpretacji indywidualnej Głównego Inspektora Pracy (art. 14b ustawy o PIP,
  od 8.07.2026, opłata 40 zł, termin 30 dni, forma decyzji z odwołaniem
  na zasadach KPC, publikacja w BIP GIP po anonimizacji).
- 6.40 (2026-09-01c, flagi F-150 / F-151 / F-152): **gałąź sieciowa T20 uruchomiona
  po raz pierwszy na żywym API — cztery usterki, wszystkie fałszywie negatywne.**
  `check_wyjatek_gate_eli.py` czytał `/text.html` aktu BAZOWEGO, czyli tekst
  OGŁOSZONY: w KC brak wszystkich jednostek z indeksem górnym (385¹, 449¹, 770¹),
  w KK brak art. 190a. S1 na art. 770 k.c. gubiło art. 770¹ — czyli kazus źródłowy
  F-144. Dalej: t.j. ma `textHTML: false`, więc podstawienie poprawnego obwieszczenia
  dawało „nie znaleziono artykułu"; parser S3 zakładał płaski JSON i zwracał 373/373
  pozycji jako `?/?/?`; `HEADING_RE` bez kotwicy `^` robiło z frazy „w dziale lub"
  nagłówek „DZIAŁ Lu", przez co S2 wskazywało art. 770 zamiast art. 773 jako krawędź
  jednostki. Naprawa: rozwiązanie do najnowszego OBOWIĄZUJĄCEGO t.j. (wybór po
  statusie, nie po kolejności na liście), treść z `text.pdf` przez `pdftotext -layout`,
  indeks górny w formie `[N]`, rozpakowanie `{"act": {...}}`, kotwica nagłówka,
  rozdzielone kody błędu 3/5 z etykietą wersji w komunikacie. Selftest 8/8 → **20/20** (w tym trzy przypadki KROK 2C — lista aktów zmieniających ogłoszonych PO dacie t.j., z jawnym wpisem „brak"),
  przebieg na żywym API potwierdzony. **F-150 ZAMKNIĘTA.**
  **F-151 ZAMKNIĘTA** — `ROBOTS_DISALLOWED` opisywało decyzję narzędzia jako zakaz
  serwera; `eli.gov.pl/robots.txt` zezwala na wszystko, a `isap.sejm.gov.pl` zapętla
  302 i jest kanałem martwym w obu trybach. Skorygowane w `shared/PRAWO-HARDGATE.md`
  (nowa sekcja „PUŁAPKA /text.html" + sekwencja B-T1…B-T3) i
  `shared/HIERARCHIA-ZRODEL.md` v1.5 (realia dostępności per kanał, nowa pozycja
  RZĄD 2A dla orzecznictwa organów).
  **F-152 OTWARTA** — cała warstwa orzecznicza (SAOS, CBOSA, Portal Orzeczeń, SN,
  IPO TK, UODO, KIO, UOKiK, UKE, EUREKA, dane.gov.pl) zwraca `host_not_allowed`
  z proxy środowiska; to decyzja konfiguracyjna dewelopera, nie zadanie audytowe.
  Nowy `references/PORTALE-ORZECZNICZE-API.md` (16 pozycji, pomiar per kanał).
  F-144 skrócona o wykonany podzakres sieciowy (ZASADA 10 pkt 3). T14 domknięte —
  `description` w `prompt-master` skrócone z 837 do 130 znaków, lista wyzwalaczy
  przeniesiona do korpusu (wpływ na trafność wyzwalania NIEZMIERZONY).
- 6.39 (2026-09-01b, flagi F-146 / F-149 / F-148): **drugi przebieg regresyjny, dwa
  FAIL spoza orkiestratora.** Zestaw `run_regression_suite.py` zwrócił PASS strukturalny,
  ale testy zarejestrowane w `scripts:` i NIEwywoływane przez pełny przebieg dały dwa
  niepowodzenia — potwierdzenie obserwacji **O-4** w praktyce.
  **(1) F-146 ZAMKNIĘTA** — 202 rozjazdy `CHECKSUMS.sha256` w 28 skillach rozliczone:
  93 wpisy uzupełnione, 4 wpisy bez pliku rozstrzygnięte jako martwe po udokumentowanych
  przeniesieniach (dr-03, dr-04, dr-10, dr-16 — cele istnieją), 105 sum odświeżonych
  PO kontroli integralności 198 plików (rozmiar, UTF-8, H1, znaczniki konfliktu,
  obcięcie, końcowa nowa linia) — bez śladów utraty. Generator sum poddany kontroli
  pozytywnej: na trzech czystych skillach odtwarza pliki bajtowo identycznie. T21 na
  całym repo PASS.
  **(2) F-149 ZAMKNIĘTA** — T15 uruchomiony po raz pierwszy z ŻYWYM ELI (w tym środowisku
  `api.sejm.gov.pl` jest dozwolony) wykrył trzy błędne numery Dz.U., wszystkie we wzorcu
  ZASADY 8 (nazwa poprawna, numer cudzy): elektromobilność 2024.1634 → **2024.1289**;
  ustawa rehabilitacyjna 2025.913 (w ELI: wygaśnięcie aktu) → **2026.884**; świadczenie
  uzupełniające, opisane numerem t.j. ustawy rehabilitacyjnej → **2026.723**. Propagacja
  przez 12 lokalizacji w dr-04, dr-09, prawo-polskie-v2 i shared + trzy wiersze mapy centralnej.
  **(3) F-148 OTWARTA** — dwie luki czułości T15: ślepota na podmianę aktu (test nie
  porównuje tytułu z ELI z nazwą lokalną, dlatego błąd (2c) przeszedł) oraz dwa trwałe
  fałszywe trafienia. ⛔ Do naprawy w skrypcie, nie w korpusie.

- 6.38 (2026-09-01, flaga F-147): **przebieg regresyjny + naprawy.** Pełny zestaw
  uruchomiony na kopii roboczej całego korpusu (33 skille, 1208 plików). Naprawione
  pięć usterek, z których żadna nie figurowała w `WARN-OTWARTE.md`:
  **(1) ⛔ CRIT — sklejona linia YAML w tym pliku SKILL.md.** Wpis
  `scripts/check_coverage_coherence.py` (T18, priorytet KRYTYCZNY) był doklejony do
  komentarza pozycji poprzedniej escape'em nowej linii zapisanym dosłownie. Parser YAML
  widział JEDEN element listy z długim komentarzem, więc test krytyczny fizycznie
  istniał, był wywoływany przez orkiestrator i przez pięć dni NIE figurował w rejestrze
  `scripts:`. Wykryte parsowaniem frontmatteru, nie odczytem — w renderze linia wygląda
  poprawnie.
  **(2) Trzy pliki-sieroty w `references/`:** `F-135-cross-check-wartosci-prawnych-2026-08-28.md`,
  `AUDYT-PRZERWANYCH-ETAPOW-2026-08-28.md`, `COWORK-HARMONOGRAM-NATYWNY.md` — ten sam
  wzorzec co F-80 i F-124, tylko nienazwany.
  **(3) `test_f108_trade.py` kończył się AWARIĄ, nie wynikiem.** Kotwice `## Rejestr postępu`
  i `**Następna transza:**` znikły przy przebudowie `F-108-lista-MS-egzamin-2026.md`
  z 2026-08-28 (domknięcie flagi usunęło warstwę transz). `split()[1]` na nieistniejącym
  nagłówku dawał `IndexError`. Kotwice nazwane i sprawdzane wprost; po naprawie 17/18 PASS.
  **(4) ⛔ Widmowe pokrycie w `dr-02/MAPA-POKRYCIA.md`** — odsłonięte dopiero przez naprawę (3).
  Trzy wiersze deklarowały 🟢 B+/COV, wskazując w kolumnie modułu ogólnik „dedykowany moduł"
  zamiast nazwy pliku: ubezpieczenia obowiązkowe/UFG/PBUK, fundacja rodzinna, opóźnienia
  w transakcjach handlowych. Kategoria T5, której skrypty nie łapią. Moduły istnieją —
  usterką była nieweryfikowalność deklaracji, nie brak treści.
  **(5) `mock_eli_server_test.py` nie testował niczego** — trzy rozjazdy z przebudowanym
  `sync_dzu_eli.py` naraz: `str` zamiast `Path`, jedna data zamiast dwóch, endpoint
  `/eli/acts/DU/search` zamiast indeksu rocznego `/eli/acts/DU/{rok}`. `AttributeError`
  na pierwszym wywołaniu. Przepisany, dodana kontrola filtra dat; 5/5 PASS.
  **Nowy test T22** `check_frontmatter_rejestracja.py`, KRYTYCZNY: system miał 21 testów
  i ZERO na rejestrację własnych zasobów skilla narzędziowego. `check_rejestracja_modulow`
  pilnuje wyłącznie modułów DR, `ci_check_shared` widzi tylko odwołania ZERWANE — plik
  obecny na dysku i nieobecny w rejestrze był dla niego stanem najzdrowszym (ta sama
  ślepota co F-130 i F-145). T22 sprawdza dodatkowo obecność dosłownego escape'u nowej
  linii we frontmatterze, czyli przyczynę źródłową (1). Mutacja negatywna wykonana:
  po odtworzeniu sklejenia T22 zwraca FAIL i wskazuje wypadnięty wpis.
  **Orkiestrator:** wpięte T22, T19b (`test_f108_trade`) i self-test mocka ELI — wszystkie
  trzy istniały, żaden nie był uruchamiany przez pełny przebieg. T22 i T19b dopisane do
  blockerów strukturalnych.
  **Poza tym przebiegiem świadomie:** F-146 (T21, 202 rozjazdy sum w 28 skillach) — rejestr
  wprost zakazuje domykania hurtowym `sha256sum` bez uprzedniej kontroli integralności.
  F-141 i T15 zablokowane środowiskowo (`api.sejm.gov.pl` → HTTP 403, domena poza listą
  dozwoloną). Odświeżone wyłącznie sumy `audyt-systemu-v4` i `shared` — jako rozliczenie
  zmian TEJ tury, zgodnie z docstringiem T21 („odświeżenie po zmianie zamierzonej jest
  częścią wydania").

- 6.37 (2026-08-31d, flagi F-144, F-145): T20 przemianowany na `check_wyjatek_gate_eli.py`
  i rozszerzony o zamiatania **S2** (krawędzie jednostki — pierwszy i ostatni artykuł działu,
  tam stoją klauzule „nie stosuje się") oraz **S3** (rejestr odesłań ELI — lex specialis leżący
  POZA aktem; w kazusie 111 wyłączenie rękojmi siedziało właśnie w innej ustawie).
  `--selftest` 8/8 PASS, mutacja negatywna zachowana. **Nowy test T21** `check_checksums.py`,
  KRYTYCZNY: `sha256sum -c` nie widzi plików BEZ wpisu, a brak wpisu daje wynik pozornie
  najzdrowszy — ten sam wzorzec co F-130, gdzie brak pola `description:` raportowano jako `0` = OK.
  Przy wprowadzeniu wykrył 34 rozjazdy w 3 skillach, w tym 7 plików bez wpisu.
  **F-145 ZAMKNIĘTA:** 12 niezgodnych sum w `shared` zbadano pod kątem integralności (rozmiar,
  poprawność UTF-8, nagłówek H1, brak znaczników konfliktu i obcięcia, kontrole celowane wobec
  deklaracji dziennika) — brak śladów utraty lub podmiany pliku; przyczyną jest brak testu
  wymuszającego odświeżenie, nie uszkodzenie treści. Sumy odświeżone w trzech skillach, przyczyna
  domknięta testem T21. ⛔ Zapisane ograniczenie: odświeżenie zamraża stan bieżący i nie odtwarza
  historii — gdyby plik został uszkodzony przed tą sesją, odświeżenie utrwala uszkodzenie.

- 6.36 (2026-08-31c, flaga F-144): nowy test **T20** `scripts/check_unit_sweep_eli.py` — deterministyczne budowanie ZAKRESU US-2 dla bramki sąsiedztwa redakcyjnego (US-GATE, `shared/MOD-UNIT-SWEEP.md`): jednostka nadrzędna, sąsiad poprzedni i następny oraz WSZYSTKIE artykuły z indeksem górnym. `--selftest` 5/5 PASS z pozycją rozstrzygającą (art. 770¹ w zakresie art. 770) i mutacją negatywną; gałęzie błędu exit 3 / exit 2 potwierdzone. ⚠️ Gałąź sieciowa ELI NIEURUCHOMIONA — domena poza listą dozwoloną środowiska audytu. ⛔ Skrypt NIE ocenia wpływu sąsiada (krok US-3) — świadomie, bo zgadywanie klasyfikacji produkowałoby fasadę. Zarejestrowane: manifest `SKILL.md`, `REGRESSION-TEST-PLAN.md` sekcja 12, `WARN-OTWARTE.md` (F-144 część otwarta, F-145 nowa), `AUDIT-JOURNAL.md` wpis AUDYT-2026-08-31c. Nowa flaga **F-145**: 12 rozjazdów `shared/CHECKSUMS.sha256` sprzed tej sesji, świadomie NIE domknięte hurtowym przeliczeniem — regeneracja skasowałaby dowód rozjazdu i wyglądałaby identycznie jak naprawa.

- 6.35 (2026-08-31): weryfikacja numerów oznaczonych ⚠️ NIEZWERYFIKOWANY po synchronizacji T11 — wszystkie sześć POTWIERDZONE w RZĘDZIE 1/2B (prawa konsumenta 2024/1796, lombardowa 2024/1111, UPNPR 2023/845, radiofonia 2022/1722, pomoc publiczna 2026/113, radcowie 2024/499 + zm. 2025/1172, 2026/370, 2026/731 — dwie ostatnie zmiany nieobecne dotąd w żadnej mapie). ⛔ Odnotowana omal-pomyłka własna: piecza zastępcza — dwa zapytania nie potwierdziły numeru 2026/980 i przygotowano korektę na starszy 2025/49; rozstrzygnięcie trzecim zapytaniem (łańcuch wersji przepisy.gofin.pl) wykazało, że numer lokalny BYŁ poprawny. Wniosek zapisany w dzienniku: brak potwierdzenia w dwóch zapytaniach nie jest obaleniem, a korekta numeru w dół wymaga dowodu pozytywnego. Ujednolicono zapis prefiksu Dz.U. w wierszu radców (T11 nie widział numeru bez prefiksu).

- 6.34 (2026-08-31): T3, T11, T14 — trzy WARN-y zdjęte. **T3:** wszystkie 6 zgłoszeń zweryfikowane ręcznie jako błędne parowanie heurystyki (akt zarejestrowany centralnie, tylko przy innym wierszu); naprawiono TEST przez filtr `main_numbers` (wyciszanie, nie parowanie — nie mylić ze zmianą cofniętą 2026-07-26), 6 → 0, czułość potwierdzona mutacją. **T11:** 6 realnych propagacji REGUŁA 3 do ROUTING-MAP (piecza zastępcza, pomoc publiczna, prawa konsumenta 2023/2759→2024/1796, ustawa lombardowa, reklama wobec nieletnich, radcowie prawni); samokorekta — wszystkie propagowane numery opatrzone jawnym statusem weryfikacji, bo synchronizacja rejestrów nie jest weryfikacją prawa. **T14:** 3 opisy skrócone do profilu ≤200 znaków wg procedury MOD-DESCRIPTION. **F-141 OTWARTA:** trzecia oś T11 (mapa Dz.U., 8 pozycji) — świadomie niedomknięta propagacją, wymaga weryfikacji per akt w ELI; pierwsza próba numeru nie potwierdziła.

- 6.33 (2026-08-31): F-140 ZAMKNIĘTA — T12 rozszerzony o kontrolę **12c: regresja dysk vs AUDIT-JOURNAL**. Cztery dotychczasowe kontrole porównują nośniki wersji wewnątrz skilla i są ślepe na spójne cofnięcie całego stanu dyskowego; 12c porównuje `version` z najwyższym podbiciem odnotowanym w dzienniku (`dysk < dziennik` = ⛔). Parser zacieśniony trzykrotnie na podstawie przebiegów kontrolnych: wymóg jawnego markera wersji (odrzucił numer Dz.U. „2026.215"), podział linii na segmenty (odrzucił 4 cudze numery), bramka MAJOR → ⚠️. Przebiegi: drzewo ✅ zero; mutacja z cofniętą, SPÓJNĄ wersją ⛔ wykryta; mutacje kontrolne bez fałszywych alarmów. Rejestracja: REGRESSION-TEST-PLAN sekcja 12c, komentarz YAML `scripts:`, docstring. Nowy plik nie powstał — rozszerzenie istniejącego testu.

- 6.32 (2026-08-31): F-140 — T12 ujawnił regresję dyskową w `analizator-dowodow-v3` (dysk 5.16.1 wobec 5.16.2 w dzienniku; changelog urwany na 5.15.0; naprawiony CRIT `art. 328¹ KPC` znów obecny w MD5-terminy.md — trzecie wystąpienie tego wzorca). Odtworzono wpisy 5.16.0-5.16.2 i 3.44 (dr-02) z AUDIT-JOURNAL jako WTÓRNE, podbito do 5.16.3, ponownie naprawiono art. 328 § 1 KPC po niezależnej weryfikacji (t.j. Dz.U. 2026 poz. 468), H1 do MAJOR. T12: 2 ⛔ + 2 ⚠️ → 0. Flaga POZOSTAJE OTWARTA — brak testu wykrywającego regresję dysk-vs-dziennik; T12 łapie metadane, nie utratę treści.

- 6.31 (2026-08-31): F-139 — bramka relacji podstaw prawnych (CV-ALT) była kluczowana wejściem (etap C3, tor pism) i nieosiągalna z toru analitycznego router → dr-XX; `grep -rln "CLAIM-VALIDATION"` wykazał 29 plików, ZERO z `prawny-router-v3` i ZERO z `dr-XX`. Dodano trigger wyjściowy T-B, pozycję WYKLUCZANIE NORMATYWNE w CV-ALT.2, KROK CV-ALT.5 (kontrola na wyjściu, wzorzec DOMAIN-LOCK), wpięcie do `prawny-router-v3/references/SELF-CHECK.md` oraz rozgraniczenie CV-ALT vs MOD-ZBIEZNOSC w `CHECKLIST-DEDUP.md`. Kryteria K1/K2/K3 spełnione, `ci_check_shared.py` bez zerwanych odwołań. Flaga otwarta i zamknięta w tej samej sesji; skuteczność bramek samo-raportujących niezmierzona (zależne od F-113).

- 6.30 (2026-08-28): domknięto ponownie otwartą F-108 do **52/52 B+/COV, 0 FULL**. KW otrzymał current-state indeks całego kodeksu i brakujący moduł art. 65–69; SUS, ustawa zasiłkowa i zwolnienia grupowe otrzymały własne current-state indeksy całych aktów. Zsynchronizowano DR-03/DR-04, `prawo-polskie-v2` 6.7, centralny `ROUTING-MAP`, benchmark, raport weryfikacyjny i `WARN-OTWARTE`. T19 podniesiono z oczekiwanego 48/52 do 52/52 i rozszerzono o fizyczną obecność/rejestrację pięciu modułów COV. `FULL` pozostaje 0/52.

- 6.29 (2026-08-28): ponowny audyt F-108 na najnowszym `main`/„Wersja rozwojowa rozpakowana”. Skorygowano deklarację pokrycia z 52/52 COV do **52/52 routing, 48/52 B+/COV, 4/52 B/B+, 0 FULL** i ponownie otwarto F-108 dla KW, SUS, ustawy zasiłkowej i zwolnień grupowych. Zweryfikowano metryki 52 aktów w źródłach urzędowych; utworzono `mapa_dzu_2026-08-28.md` oraz raport `F-108-verification-2026-08-28.md`. Naprawiono m.in. KC 2026/795, Prawo upadłościowe 2026/913, Prawo o prokuraturze 2026/810 oraz błędne tożsamości 2025/1338, 2023/549, 2024/1069, 2024/1796 i 2026/346. Dodano `test_f108_consistency.py`. T19 podłączono do CI; jego `py_compile` ujawnił i naprawiono wcześniejszy błąd składni `run_regression_suite.py` (wielowierszowe `print()`), a kody błędów T18 są traktowane jako blocker krytyczny.

- 6.28 (2026-08-28): F-138 — migrowano lokalne `MAPA-AKTOW.md` do modelu runtime current-state-only, zachowując bieżący routing, fresh/temporal gate i rejestrację modułów; F-108 pozostaje zamknięta 52/52 B+/COV. Zsynchronizowano metadane routera 3.31 oraz orkiestratora audytu 6.28. F-138 zamknięta po rzeczywistym GitHub Actions run #32: rejestracja 0/16 rozbieżności, coverage/routing OK, T9 OK, `ci_check_shared.py` 0 zerwanych odwołań; 20 grup duplikatów bajtowych pozostaje nieblokującym raportem ostrzegawczym.

- 6.27 (2026-08-27): wykonano rekomendacje audytu pokrycia: utworzono `MAPA-POKRYCIA.md` dla brakujących 9 DR, dodano T18 `check_coverage_coherence.py` i wpięto do suite, rozdzielono status rejestracji od kompletności treściowej oraz oznaczono raporty 2026-08-13 jako baseline historyczny. F-108 Etap 3: 52/52 dedykowanych modułów.

- 6.26 (2026-08-27): errata dowodu F-108/46 — T3 ma 7 ostrzeżeń,
  T11 ma 26 pozycji do przeglądu; nie są globalnym PASS. Test nowego modułu
  nadal 18/18 PASS. Bez zmiany statusu F-108 i bez zmian treści prawa.

- 6.25 — F-108/46: rejestr postępu wszystkich 52 pozycji, kontrola 6 półroczy i propagacji; F-108 otwarta, pełna historia zmian i administracja niezaliczone. (2026-08-27)

- 6.24 (2026-08-27): T17 kontroluje identyfikatory, kolejność i znaczenie
  reguł routera po skróceniu; wzorzec pamięci zsynchronizowano z routerem 3.29.

- 6.23 (2026-08-27): zamknięto F-82 i F-102; F-86 uzupełniono częściowo; zapisano niezależny
  preflight `NIEMIERZALNE` dla F-113/F-133; poprawiono rozwiązywanie ścieżek
  w T1/T2/T3/T15 i dodano kontrolę zgodności tytułu aktu z metryką ELI.

- 6.22 (2026-08-26): T17 rozszerzono o limit 500 linii, pozycję bloku
  bezwzględnego, kontrolę narracji incydentów i duplikatu Reguły 13. Dodano
  pozycję 13 menu oraz `PAMIEC-TRWALA-ROUTER.md`: wersjonowaną, wymagającą
  zgody synchronizację wydzielonej sekcji trwałych preferencji routera.

- 6.21 (2026-08-26): dodano T17 chroniący kontrakt routera (imperatywny
  trigger, PATH-SELFTEST, routing [11], audyt klucza N/N); usunięto rozjazd
  limitu `description` 1024↔200 w orkiestratorze i planie testów; wybór
  aktualnej mapy Dz.U. jest dynamiczny zamiast przywiązany do daty 2026-08-21;
  liczniki drzewa pakietu uzgodniono ze stanem dysku.

- 6.20 (2026-08-26): dodano T15 (operacyjna weryfikacja tekstów jednolitych)
  i T16 (pełny inwentarz zakresu nowelizacji), wzmocniono obowiązek propagacji,
  usunięto zależność od ścieżki jednego hosta, zaktualizowano centralną mapę
  Dz.U. i dodano pełny inwentarz 116 dyspozycji Dz.U. 2022 poz. 2600.

> Pełna historia napraw i zmian wersji orkiestratora (33 wpisy, od
> wersji 4.3 do 6.13). WYNIESIONA z SKILL.md 2026-08-20 (F-78,
> porządkowanie SKILL.md >1000 linii — pierwsze takie wydzielenie dla
> tego pliku, treść skopiowana 1:1, bez zmian merytorycznych). Wczytuj
> TYLKO gdy potrzebujesz historii konkretnej naprawy wersji
> orkiestratora — SKILL.md trzyma tylko krótkie podsumowanie 3
> najnowszych wersji jako kontekst bieżący.

- 6.18 (2026-08-24f, flaga **F-113** — część projektowa): powstał `references/PLAN-TESTU-BRAMEK-F113.md` — protokół testu SKUTECZNOŚCI pięciu bramek z GRUPĄ KONTROLNĄ (ramiona A/B na tym samym kazusie i prompcie, trzy komórki środowiskowe T0/T1/T2, pozycje-pułapki, ocena ślepa, progi orzekania) oraz narzędzie `scripts/ocena_transkryptow_f113.py`. Wykonanie przebiegów POZOSTAJE otwarte — flaga nie jest zamknięta. Opis: `references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24f.

- 6.17 (2026-08-24, flaga **F-130**): dodane pole `description:` do frontmattera — `audyt-systemu-v4` był JEDYNYM skillem w systemie bez niego (poprawka wskazana przez użytkownika). Naprawiona też PRZYCZYNA, dla której luka przetrwała: FAZA 2C i `MOD-DESCRIPTION.md` mierzyły wyłącznie DŁUGOŚĆ, a dla pliku bez pola wypisywały `0` i klasyfikowały wynik jako ✅ OK. Dodany test **T14** (`scripts/check_description.py`), wpięty w orkiestrator i `REGRESSION-TEST-PLAN.md` sekcja 14. Opis: `references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24e.

**6.16 (2026-08-23i) — F-115 zawężona do P3; F-126 otwarta:**
- Wpis dotyczy `shared` i 13 skilli konsumenckich (ZASADA 11). Pełny opis: AUDIT-JOURNAL, AUDYT-2026-08-23i.
- Self-check ANTY-FASADA: 7 KOPII → wywołania modułu `shared/SELF-CHECK-ANTY-FASADA.md`; P1 i P2 podłączone; pokrycie 7 → 14 plików.
- Sprostowana fałszywa deklaracja „propagowana do wszystkich skilli" w PRAWO-HARDGATE.
- **F-126 otwarta jako WŁASNY skutek uboczny sesji:** historia w dwóch miejscach w 3 skillach (sekcja `## CHANGELOG` w korpusie SKILL.md wbrew ZASADZIE 15).
- T12 na drzewie roboczym: 11 ⛔ → 3 ⛔ (pozostałe 3 = zakres F-126).

**6.15 (2026-08-23h) — F-111 zamknięta: PRAWO-HARDGATE podzielony (wariant B, decyzja użytkownika):**
- Wpis dotyczy skilla `shared`, nie orkiestratora — tutaj odnotowany, bo sesja audytowa
  była jego wykonawcą (ZASADA 11). Pełny opis: `references/AUDIT-JOURNAL.md`, AUDYT-2026-08-23h.
- `shared/PRAWO-HARDGATE.md` **967 → 501 l.**; nowy `shared/PRAWO-HARDGATE-ORZECZENIA.md` (464 l.)
  z wyzwalaczem BINARNYM („sygnatura w tekście", nie „gdy potrzebujesz procedury").
- ⭐ Znalezisko poboczne: **88 linii historii wersji stało POWYŻEJ pierwszej normy** bramki —
  114 plików czytało changelog, zanim dotarło do zakazu. Wyniesione do `shared/references/CHANGELOG.md`.
- Ścieżki zewnętrzne bez zmian (114 plików, 212 odesłań) — nazwa pliku nadrzędnego zachowana.
- **F-115 odblokowana** (self-check ANTY-FASADA został w rdzeniu). Licznik flag 19 → 18.
- ⚠️ Ryzyko nazwane w plikach, nie tylko w dzienniku: treść wydzielona to treść, której można
  nie wczytać — pomiar podziału należy do F-113.

**6.14 (2026-08-23g) — ZASADA 14 (AUDIT-CLAIM-GATE); rejestr YAML zsynchronizowany z dyskiem; parsery T11/T3 przestały być ślepe na notację LEX:**
- ⚙️ **NOWA ZASADA 14 (STAŁA) — bramka wyjściowa zgłoszenia audytowego (F-121).**
  Żadne zgłoszenie nie opuszcza skilla jako TWIERDZENIE bez trzech pól: STATUS wg
  rejestru w `shared/PRAWO-HARDGATE.md`, IDENTYFIKATOR ŹRÓDŁA (plik + linia / Dz.U.
  + artykuł / URL z datą) i REPRODUKCJA (polecenie, którym druga osoba odtworzy
  ustalenie). Zakaz szczególny: kwalifikowanie cudzej PRZYCZYNY („halucynacja",
  „awaria infrastruktury") zamiast OBJAWU — przyczyna nie jest obserwowalna z
  zewnątrz. Przesłanka: TEST1 §5.2, trzy obalone diagnozy samoaudytu.
- `references/FORMAT-RAPORTU-ROZNIC.md` § 4 — tabela trzech pól obowiązkowych;
  odpowiedź na pytanie z kryterium zamknięcia F-121 brzmi: przed tą datą plik ich
  NIE wymuszał. Dodano też zastrzeżenie, że kolumna `Akcja sugerowana` z raportu
  jest heurystyką skryptu, nie ustaleniem.
- **F-124 (otwarta i zamknięta w tej samej sesji):** `references/CHANGELOG.md`
  (ten plik!) oraz `references/F-104-lista-robocza-roczniki-starsze.md` były
  plikami-sierotami poza YAML; drzewo STRUKTURA KATALOGU deklarowało 53 pliki przy
  55 i 16 skryptów przy 18, pomijając `README.md` w korzeniu. Trzeci nawrót wzorca
  F-80 — wykryty wyłącznie dlatego, że ZASADA 7 KROK 1 wymusza policzenie plików.
  Nowa obserwacja **O-4**: potrzebny automat DWUKIERUNKOWY (dysk vs YAML **i** YAML
  vs dysk), bo wykryto też wariant odwrotny w `raport-sytuacyjny-v2` (rejestr
  obiecywał plik `assets/`, którego nie ma).
- **F-125 (otwarta, parser naprawiony):** `check_sync_aktow.py` (T11) i
  `test_cross_map_dzu.py` (T3) były ślepe na notację LEX `Dz.U.RRRR.NN.PPPP` —
  T11 rozbierał `Dz.U. 2026 poz. 468` na `(rok, "0")`, po czym `artefakt()` po cichu
  odrzucał wpis, więc prawdziwa pozycja nigdy nie trafiała do porównania (fałszywy
  NEGATYW). 95 wystąpień notacji w korpusie. Dodano `normalizuj()` wołaną przed
  dopasowaniem w obu testach. Pomiar kontrolny: T11 143 → **140**, T3 8 → 8.
  ⚠️ Przy pierwszym podejściu patch w T3 został dodany, ale NIE wpięty w pętlę —
  wykryte dopiero weryfikacją `grep -n DZU_PATTERN`; dokładnie ta klasa pozornej
  naprawy, o której mówi F-113.

**6.13 (2026-08-20z4) — ZASADA 15: historia zmian wyłącznie w references/CHANGELOG.md; standard ujednolicony w 9 skillach:**
- ⚙️ **NOWA ZASADA 15 (STAŁA, na wyraźne polecenie użytkownika):** pełna historia
  zmian każdego skilla mieszka w osobnym pliku `references/CHANGELOG.md`. W SKILL.md
  nie ma sekcji `## CHANGELOG` z wpisami — wyłącznie odesłanie; pole `changelog:`
  w YAML to krótki skrót bieżącej wersji (do ~15 linii), nigdy pełna lista.
- **Uzasadnienie funkcjonalne, nie porządkowe:** rozproszenie historii między trzy
  lokalizacje było BEZPOŚREDNIĄ przyczyną fałszywych wyników T12 w sesji 08-20z3 —
  test szukał wpisów w `references/`, nie znajdował (leżały w SKILL.md) i raportował
  nieistniejące luki. W `pisma-procesowe-v3` groziło to dopisaniem PIĘCIU zmyślonych
  wpisów do changelogu.
- **Ujednolicone 9 skilli.** Z korpusu SKILL.md: `analizator-przepisow-v2` (83 linie),
  `audyt-systemu-v4` (42), `dr-01` (17), `orzeczenia-sadowe-v2` (9),
  `pisma-procesowe-v3` (61), `pisma-proste-v2` (62), `prawny-router-v3` (71).
  Z pola `changelog:` YAML: `shared` (**111 linii** — najdłuższy przypadek w systemie),
  `prawny-router-v3` (63 — ten skill trzymał historię w TRZECH miejscach naraz),
  `analiza-sadowa-v6` (39). Cztery pliki `references/CHANGELOG.md` UTWORZONE od zera.
  Cała treść przeniesiona **1:1**, bez zmiany ani jednego zdania.
- **T12 egzekwuje standard:** sekcja `## CHANGELOG` z wpisami w korpusie → ⛔;
  pole `changelog:` dłuższe niż 15 linii → ⚠️. Zasada przestaje więc zależeć od
  pamięci wykonawcy audytu.
- ⛔ **Znalezisko uboczne — `analizator-przepisow-v2` miał NIESPARSOWALNY frontmatter.**
  Pole `description` zawierało niecytowane dwukropki (`v2:`, `v2.3:`), przez co
  `yaml.safe_load` zwracał błąd i YAML nie ładował się W OGÓLE. Usterka ZASTANA —
  obecna również w stanie pierwotnym, przeżyła wszystkie dotychczasowe audyty, bo
  żaden test nie sprawdzał samej parsowalności frontmatteru. Naprawione blokiem `>-`.
  ⭐ Do rozważenia: kontrola `yaml.safe_load` dla wszystkich SKILL.md jako osobny test.
- Sekcja CHANGELOG usunięta również z SKILL.md tego skilla — była duplikatem trzech
  najnowszych wpisów już obecnych tutaj (skrót wprowadzony w F-78, teraz zbędny).
  `version: "6.12" → "6.13"`.

**6.12 (2026-08-20z3) — realizacja F-102: historia 18 wersji odtworzona z dziennika, pułapka float w 16 skillach, decyzja generalna o duplikatach numeru:**
- ⛔ **Najpierw wyszły trzy WŁASNE błędy testu T12**, wykryte przy ręcznej weryfikacji
  raportu PRZED przystąpieniem do napraw: (1) czytał wyłącznie `references/CHANGELOG.md`,
  pomijając sekcję `## CHANGELOG` wewnątrz SKILL.md — przez co raportował w
  `pisma-procesowe-v3` lukę siedmiu wersji zamiast realnych dwóch; (2) wykrywał WŁASNE
  komentarze naprawcze („stopka podawała Wersja: 5.2") jako stopkę; (3) mylił wiersz
  wewnątrz wpisu changelogu („- Wersja: 3.8 → 3.9") ze stopką pliku. Po naprawie parsera
  test ujawnił za to DWA rozjazdy, których wcześniej nie widział (`dr-01`,
  `prawny-router-v3` 3.13→3.21 — osiem wersji, największa luka w systemie).
  ⭐ Wniosek: raport nowego testu weryfikuj ręcznie, zanim naprawisz system pod jego
  dyktando — inaczej dopiszesz pięć nieistniejących wpisów i przeoczysz dwa realne.
- **Historia 18 wersji ODTWORZONA z `AUDIT-JOURNAL.md`** — okazało się, że istnieje,
  tylko nie w changelogach: dziennik odnotowuje każde podbicie w sekcjach „Rejestracja".
  Uzupełnione: `prawny-router-v3` 3.14-3.21, `analizator-umow-v1` 1.26-1.30,
  `pisma-procesowe-v3` 5.16-5.17, `dr-01` 3.4. Wpisy oznaczone jako WTÓRNE wobec
  dziennika, z odesłaniem do wpisu-źródła. `dr-01` 3.5/3.6 — brak śladu w jakimkolwiek
  pliku systemu → „LUKA JAWNA", bo zmyślony wpis jest gorszy niż jego brak: brak widać,
  zmyślenie zostaje na zawsze jako fałszywe źródło.
- **`orzeczenia-sadowe-v2`: rozjazd ODWROTNY** — `version: 2.9 → "2.9.1"`, changelog
  miał wpis z 2026-07-17, którego pole nie odnotowało.
- **Pułapka float naprawiona w 16 skillach** (13 z realną, dwucyfrowym minor + 3
  profilaktycznie przy okazji edycji). 10 skilli z ryzykiem WYŁĄCZNIE przyszłym
  świadomie NIE naprawiono hurtem — dziesięć dostaw przy zerowym zysku dzisiaj;
  pozycja resztkowa w F-102 + flaga `--profilaktyka` pokazująca listę na bieżąco.
- ⭐ **DECYZJA GENERALNA: duplikat numeru wersji poza polem `version:` się USUWA,
  nie synchronizuje.** Podstawa empiryczna: pięć niezależnych rozjazdów w trzech
  sesjach. Nagłówki H1 noszą teraz sam MAJOR (nie dryfuje), stopka `prawo-polskie-v2`
  odsyła do YAML i nosi wyłącznie datę zmiany treści. Przy okazji poprawiono własny
  błąd z 08-20z: wpisane wtedy w nagłówek `analizator-dowodow-v3` pełne „v5.17"
  zaczęłoby dryfować przy następnym podbiciu.
- **T12 rozpoznaje teraz deklarację „LUKA JAWNA"** — skill, który lukę udokumentował,
  jest w stanie POPRAWNYM; test musi to odróżniać od skilla, który milczy.
- Kontrola skuteczności: T12 przed **7 ⛔ / 20 ⚠️** → po **0 ⛔ / 0 ⚠️**; YAML
  wszystkich 19 edytowanych skilli parsuje się poprawnie, `version` wszędzie typu
  string. Liczba plików bez zmiany w każdym skillu. `version: "6.11" → "6.12"`.

**6.11 (2026-08-20z2) — F-101 zamknięta przez automatyzację: nowy test T12 i jego pierwszy przebieg (F-102):**
- **F-101 ZAMKNIĘTA W CAŁOŚCI.** Jej ostatni punkt — nieodtwarzalne luki historii
  wersji (3.20-3.22 w skillu świadków, 5.16.0-5.16.1 w analizatorze) — rozstrzygnięto
  przez ZAAKCEPTOWANIE luki i udokumentowanie jej sekcją „LUKA JAWNA" w changelogach
  obu skilli. Flaga czekająca na odtworzenie materiału, który nie istnieje, byłaby
  otwarta bezterminowo (wzorzec F-86 — rozrost rejestru o pozycje nie do domknięcia).
- **NOWY TEST T12 (`scripts/check_wersje_changelog.py`), ŚREDNI.** Kontroluje cztery
  nośniki numeru wersji: `version:` (źródło prawdy), najwyższy wpis
  `references/CHANGELOG.md`, numer w polu `changelog:` YAML, numer w nagłówku H1
  i stopce. Zarejestrowany w czterech rejestrach (YAML `scripts:`, STRUKTURA KATALOGU,
  `run_regression_suite.py`, `REGRESSION-TEST-PLAN.md` sekcja 12).
- **PUŁAPKA FLOAT — nowa klasa usterki wykryta przy okazji.** Niecytowane
  `version: 6.10` YAML parsuje jako float **6.1**, czyli numer NIŻSZY niż 6.9;
  problem pojawia się dopiero przy przejściu X.9 → X.10 i jest niewidoczny w treści
  pliku. Pierwszy przebieg znalazł go w **14 skillach** (m.in. dr-06 z 3.72, dr-02
  i dr-10 z 3.35, prawny-router-v3 z 3.21). Naprawiony wzorcowo w `shared` i tutaj,
  z komentarzem ostrzegawczym przy polu; pozostałe 13 → F-102.
- **F-102 OTWARTA** — wynik pierwszego przebiegu na `/mnt/skills/user`: 26 rozbieżności
  w 24 skillach (5 ⛔ czynnych, 21 ⚠️ utajonych). Najpoważniejsza: `pisma-procesowe-v3`,
  `version: 5.17` przy changelogu na 5.10 — **siedem wersji bez opisu**, luka większa
  niż ta, która uruchomiła całą sprawę.
- **Błąd własny testu, naprawiony tego samego dnia:** pierwsza wersja przeszukiwała
  cały plik i dawała 7 fałszywych trafień z wpisów changelogu cytujących wersje INNYCH
  plików. Ograniczono wyszukiwanie do korpusu poza frontmatterem. Rozdzielono też
  klasyfikację wagi (⛔ / ⚠️ / ℹ️) — pierwotne 42 pozycje z 19 „krytycznymi" topiły
  5 realnych problemów w szumie.
- ⭐ **Zasada z tej sesji: flaga opisująca WZORZEC zamyka się testem, nie naprawą.**
  F-101 wystąpiła w trzech skillach z trzech rodzin w jednej sesji — to była definicja
  wzorca, a czwarta naprawa ręczna kosztowałaby więcej niż T12.
- Kontrola skuteczności: T12 na czterech skillach naprawionych w tej rozmowie —
  zero rozbieżności (przed: 26, po: 0). `version: "6.10" → "6.11"`.

**6.10 (2026-08-20z) — wykonanie flag F-99 i F-100 w całości, F-101 zawężona; zasada „wydzielenie ≠ osłabienie":**
- **F-100 (A) — `shared/MOD-DOKUMENT-GATES.md` (nowy plik kanoniczny, 254 linie).**
  Osiem bramek pracy na dokumentach (DOCUMENT-SCAN-PROMPT, FOUNDATION-VERIFICATION-GATE,
  EXHAUSTIVE-EXTRACTION-GATE, IMMEDIATE-LOGICAL-SCAN, CROSS-DOCUMENT-CONSISTENCY-CHECK,
  ENTITY-DISAMBIGUATION-TABLE, EVIDENCE-THREAD-LINKING, QUOTE-VERIFICATION-DEFAULT)
  występowało w CAŁYM systemie wyłącznie w `przesluchanie-swiadkow-v2-min90`.
  `analizator-dowodow-v3` — PRIMARY dla analizy dowodowej — nie miał do nich dostępu.
  Sedno naprawy: udostępnienie działających bramek drugiemu konsumentowi, nie
  oszczędność linii. Zarejestrowane w `shared/SKILL.md` i `DEPENDENCY-GRAPH.md`.
- **F-100 (B)** — 5 bloków strategicznych analizatora do `modules/MD7-bloki-strategiczne.md`
  (E7 w BLOKU E routera). SKILL.md 1174 → 983 mimo dopisania KROKU 0d.
  ⚠️ Zysk MNIEJSZY niż zakładała flaga: 2 z 5 bloków mają wyzwalacz „ZAWSZE" —
  odnotowane wprost, żeby następny audyt nie odziedziczył optymistycznej liczby.
- **F-99** — `TYPOLOGIE-LOAD` w W2 skilla świadków: typologie świadka i sędziego były
  w pakiecie od początku, ale żaden krok pipeline'u ich nie wczytywał, mimo deklaracji
  w `description`. ⭐ Klasa usterki „zdolność zadeklarowana + zasoby dostarczone + brak
  wpięcia" nie jest wykrywana przez FAZĘ 2A ani T6 — wykrywa ją dopiero pytanie
  odwrotne: *czy każdy plik pakietu ma konsumenta?* Kandydat na rozszerzenie
  `check_rejestracja_modulow.py`. Dodatkowo usunięty balast poscaleniowy (30 → 23 pliki).
- **F-101 zawężona** — changelogi scalone, nagłówki wersji naprawione; nieodtwarzalne
  luki 3.20-3.22 i 5.16.0-5.16.1 odnotowane jawnie jako „LUKA JAWNA" zamiast ciszy.
- **Rekomendacja testu T12** (`version` vs najnowszy wpis changelogu): rozjazd wystąpił
  w trzech skillach z trzech rodzin, łącznie ze stopką samego orkiestratora — to wzorzec,
  nie incydent.
- ⚠️ **Pułapka YAML wykryta przy walidacji:** `version: 6.10` bez cudzysłowu parsuje
  się jako float **6.1**, czyli mniej niż 6.9. Pole ujęte w cudzysłów + komentarz
  ostrzegawczy w SKILL.md. Do sprawdzenia w innych skillach systemu.
- **Zasada metodyczna sesji:** każde przeniesienie treści zweryfikowane bajtowo
  (`treść_wycięta in treść_modułu` = True) PRZED dostawą; każde wydzielenie dostało
  twardy krok wczytania (`DG-LOAD`), bo samo odesłanie byłoby regresem wobec historii
  napraw 3.6/3.17/3.18. Flag F-: 26 → 24. `version: 6.9 → 6.10`.

**6.9 (2026-08-20y) — audyt martwej treści własnego orkiestratora: 6 usterek, w tym jedna kasująca dane:**
- ⛔ **FAZA 7B kopiowała mapę ARCHIWALNĄ** — polecenie `cp` wskazywało
  `mapa_dzu_2026-06-14.md` przy mapie aktualnej `2026-07-15`. Literalne wykonanie
  cofało mapę o 3 generacje (~250 wierszy) BEZ sygnału błędu. To DRUGIE wystąpienie
  tej samej usterki — pierwsze naprawiono w 4.4 (2026-06-14g). Naprawiono oba
  wystąpienia + dopisano regułę stałą: przy zmianie mapy aktualnej `grep -n mapa_dzu
  SKILL.md` i poprawa WSZYSTKICH wystąpień, nie tylko `references:`.
- ⛔ **FAZA 7C MARTWA od 2026-06-14g** — nakazywała aktualizację `SKILLS-MAP-AND-FIXES`,
  pliku usuniętego w 4.4. Przeżyła ~2 miesiące, bo FAZA 2A sprawdza wyłącznie ścieżki
  `view`, a to była nazwa w prozie (to samo dotyczyło FAZY 2B — drugie odwołanie do
  tego samego nieistniejącego pliku, też naprawione). W miejsce 7C wpisano aktualizację
  `WARN-OTWARTE.md` — czynność obowiązkową z ZASADY 10, która nie miała własnego kroku
  w FAZIE 7. Poprawiono też zdanie „zaktualizuj **oba** pliki" przy trzech podsekcjach.
- **Frontmatter, `raporty-pokrycia-2026-08-13/`:** licznik „12 raportów + indeks =
  13 plików" przy 11 na dysku (KRO usunięty 08-15, KPK 08-15nn — oba udokumentowane).
  Rejestr wyprzedzał dysk: lustrzane odbicie F-80. Poprawione tu i w § 7 WARN-OTWARTE.
- **STRUKTURA KATALOGU** nieaktualna o 15 plików — wymieniała 4 pliki `references/`
  (stan sprzed F-80), pomijała CAŁY `scripts/`, podawała 460 wierszy mapy przy 509.
  Odtworzona ze stanu faktycznego (48 plików) + reguła aktualizacji obu miejsc naraz.
- **Stopka „Wersja: 5.0 | 2026-07-04"** przy `version: 6.8` — rozjazd 9 wersji.
- **Otwarte F-99, F-100, F-101** — wynik badania trzech skilli pod kątem treści
  bezwartościowej i kandydatów do wydzielenia (patrz `AUDIT-JOURNAL.md`,
  wpis AUDYT-2026-08-20y). Naprawy w skillach `przesluchanie-swiadkow-v2-min90`
  i `analizator-dowodow-v3` NIE wykonane w tej sesji — czekają na decyzję zakresu.
- `version: 6.8 → 6.9`.

**6.8 (2026-08-15z) — synchronizacja ROUTING-MAP (REGUŁA 3) + nowy test T11 wykrywający tę klasę luki automatycznie:**
- ⛔ **Wykryta luka procesu:** sesje 08-15x i 08-15y wpisały nowe akty do mapy
  Dz.U. i modułów, ale NIE do `prawo-polskie-v2/ROUTING-MAP.md` — czyli REGUŁA 3
  HARDGATE-AUDYT została pominięta. Zsynchronizowano: narkomania → Dz.U. 2026
  poz. 1004, AI → poz. 1003, Ordynacja → „ze zm. poz. 825 i 846", nowy wiersz
  katalogowy ustawy o delegowaniu kierowców (2023 poz. 1523).
- **NOWY TEST T11 (`scripts/check_sync_aktow.py`)** — porównuje ZBIORY numerów
  Dz.U. w trzech rejestrach i wypisuje akty obecne w jednym, a brakujące
  w pozostałych. Uzupełnia lukę: T3 wykrywa RÓŻNY numer tego samego aktu,
  `check_rejestracja_modulow.py` — nierejestrację MODUŁÓW, a NIKT dotąd nie
  wykrywał BRAKU AKTU w rejestrze. Zarejestrowany w orkiestratorze.
- **Pierwszy przebieg (stan zastany):** 72 akty z lokalnych map nieobecne
  w ROUTING-MAP, 80 nieobecnych w mapie Dz.U., 53 z ROUTING-MAP nieobecne
  w mapie Dz.U. → flaga **F-89**.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15z`.

**6.7 (2026-08-15y) — F-24 zamknięta po 8 podejściach; F-82 zawężona; ostrzeżenie F-82 wbudowane w test T3:**
- **F-24 ZAMKNIĘTA:** nowelizacja narkomanii to **Dz.U. 2026 poz. 1004**
  (ustawa z 3.07.2026, ogłoszona 27.07.2026, w życie 27.08.2026).
  ⭐ Metoda, która zadziałała po 7 nieudanych próbach: szukanie **wykazu
  pozycji Dziennika Ustaw z konkretnego dnia** zamiast kolejnego pytania
  o sam akt — teksty sejmowe z definicji nie zawierają numeru promulgacji
  (mają w tym miejscu lukę redakcyjną „oraz z …"). Rekomendowane jako
  standardowy krok TRYB DZU. Rozbieżność dat 11.06 vs 3.07 wyjaśniona:
  data sejmowa dotyczy wersji sprzed poprawek Senatu.
- **F-82 pkt 2:** `test_cross_map_dzu.py` wypisuje teraz przy KAŻDYM
  przebiegu ostrzeżenie, że zgodność rejestrów nie jest weryfikacją
  merytoryczną (wynik „OK" był historycznie mylący); docstring rozszerzony
  o przypadek referencyjny i technikę kontrolną. Naprawiony homoglif telugu
  w docstringu.
- **F-82 pkt 3:** ustawa o delegowaniu kierowców (Dz.U. 2023 poz. 1523)
  dostała własny wiersz w mapie — status „skatalogowana bez modułu".
- Mapa Dz.U.: dodane 2026.1004, **2026.1003** (ustawa o systemach AI —
  znana lokalnie w dr-11, nieobecna centralnie) i 2023.1523.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15y`.

**6.6 (2026-08-15x) — F-85 zamknięta, F-88 otwarta, mapa Dz.U. uzupełniona o 3 pozycje:**
- `mapa_dzu_2026-07-15.md`: dodane Dz.U. 2026 poz. **846**, **825** i **779**
  z pełnymi metrykami i datami wejścia w życie; adnotacje „ze zm." przy
  tekstach jednolitych OP (622), PIT (592) i CIT (554).
- ⭐ **poz. 825 wykryta ubocznie** — wcześniej nieobecna w ŻADNYM rejestrze
  systemu; ujawniła ją metryka OP zacytowana wewnątrz tekstu poz. 846.
  Technika (porównywanie metryk aktów zmienianych, cytowanych w nagłówkach
  nowelizacji, z mapą) potwierdzona po raz DRUGI — pierwszy raz przy F-82
  (Kodeks morski). Rekomendowana jako stały element TRYB DZU.
- FAZA 3E w dr-06: doprecyzowana metryka nowelizacji art. 24a ustawy o PIT
  w `mod-PKPiR-ewidencje-uproszczone.md`; ustalono, że zmiana jest
  terminologiczna, a przepisy wykonawcze z art. 24a ust. 8 zachowują moc —
  żadne sformułowanie modułu nie zostało unieważnione.
- **F-88 otwarta:** propagacja omnibusu Dz.U. 2026 poz. 846 (16 obszarów,
  w życie 1.10.2026, priorytetowy podwątek MDR) — ta sama klasa co F-79.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15x`.

**6.5 (2026-08-15w) — porządkowanie `WARN-OTWARTE.md`: rejestr przywrócony do roli TODO:**
- Plik przebudowany: 489 → 439 linii, ~96 KB → ~45 KB, przy zachowaniu
  wszystkich 33 flag F-, 3 flag MON, 4 pozycji OBS, 7 pozycji REACT-1
  i 2 obserwacji. Usunięto wyłącznie narrację napraw JUŻ WYKONANYCH —
  zarchiwizowaną verbatim w `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15w`.
- **Nowa ⚡ TABLICA STERUJĄCA na początku pliku** — indeks wszystkich flag
  z kolumną „następny krok" w jednym zdaniu, rozdzielony na: A. wykonalne
  sesją audytową (29, sortowane wg priorytetu), B. zależne od dewelopera
  lub środowiska (4, sesja audytowa ich NIE zamknie), C. rejestry, które
  z definicji nie są „flagami do zamknięcia" (MON/OBS/REACT-1/O).
- Flagi pogrupowane tematycznie (1A luki z raportów pokrycia, 1B pozostałe
  luki, 1C flagi narzędziowe, 1D zależne od dewelopera) zamiast rozproszenia
  po 12 sekcjach DR, z których 6 nie zawierało żadnej otwartej flagi.
- **ZASADA 10 rozszerzona** o regułę „naprawa częściowa → skróć wiersz, nie
  dopisuj opisu" — usuwa przyczynę rozrostu rejestru u źródła.
- Trzy naprawy uboczne: rozklejony wiersz F-86 (cztery sklejone struktury
  wierszowe), usunięte nieaktualne odesłanie F-45 → „wciąż otwarta F-31"
  (zamknięta 2026-08-14o), uzupełniony zakres F-68 o Dział IV Tytułu IV KSH
  (584¹–584¹³), odnotowany w dzienniku, ale nieobecny w rejestrze zadań.
- ŻADNEJ flagi nie zamknięto ani nie otwarto — stan merytoryczny systemu
  po tej sesji jest identyczny jak przed nią.

**5.4 (2026-07-10b) — CRIT wykryty i naprawiony: naruszenie ZASADY 7 (OUTPUT-COMPLETENESS); zasada wzmocniona mechaniczną procedurą:**
- **Incydent:** naprawa `przesluchanie-swiadkow-v2-min90` (v3.6) oraz
  pierwsza wersja naprawy `audyt-systemu-v4` (v5.3) zostały dostarczone
  użytkownikowi jako pojedyncze pliki (`SKILL.md`, `AUDIT-JOURNAL.md`,
  `WARN-OTWARTE.md`) zamiast jako kompletne skille — bezpośrednie
  naruszenie ZASADY 7, mimo że zasada była obecna w SKILL.md przez cały
  czas trwania sesji. Sama proza reguły okazała się niewystarczająca do
  wymuszenia zachowania.
- **Naprawa natychmiastowa w tej samej sesji:** oba skille dostarczone
  ponownie jako kompletne archiwa ZIP (29/29 i 12/12 plików, zweryfikowane
  liczbowo względem oryginału).
- **Naprawa systemowa (ZASADA 7 wzmocniona):** dodano
  PRE-DELIVERY-COMPLETENESS-CHECK — obowiązkową, mechaniczną sekwencję
  (policz pliki oryginału → skopiuj całe drzewo → edytuj kopię → policz
  pliki po edycji → porównaj liczby → dopiero wtedy spakuj cały katalog
  do .zip → dopiero wtedy present_files). Wynik liczenia plików PRZED i
  PO musi być pokazany w odpowiedzi przed dostarczeniem — nie wystarczy
  odwołanie się do zasady z pamięci. `present_files` dla naprawy skilla
  dozwolone wyłącznie na zip całego katalogu, nigdy na pojedynczym pliku.
- Pełny opis incydentu: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-07-10b`.

**5.3 (2026-07-10) — ZASADA 11: rozszerzenie zakresu audytu na wszystkie skille prawne (stała zasada, nie precedens):**
- **ZASADA 11 dodana** (sekcja "Cel"): zakres audytu obejmuje odtąd
  wszystkie skille prawne w `/mnt/skills/user/`, nie tylko mapę Dz.U. i
  DR-01...DR-16. Obejmuje skille proceduralne (pisma-procesowe-v3,
  przesluchanie-swiadkow-v2-min90, analizator-dowodow-v3,
  chronologia-sprawy-v1 i inne), gdzie przedmiotem audytu jest domyślne
  (nie tylko na żądanie) stosowanie wbudowanych bramek jakości, a nie
  poprawność numeru aktu prawnego.
- **Powód wprowadzenia:** audyt na żywym przypadku (sprawa pracownicza,
  moduł przesłuchań świadków) ujawnił, że bramki jakości (WHY-GATE,
  QUESTION-ADMISSIBILITY-GATE) były stosowane reaktywnie — dopiero na
  wyraźne żądanie oceny — zamiast domyślnie przy generowaniu treści.
  Użytkownik wskazał wprost, że taka kontrola ma dotyczyć wszelkich
  skilli prawnych systemowo, a nie być jednorazowym wyjątkiem dla jednego
  skilla.
- **Pierwszy audyt pod nową zasadą — patrz `AUDIT-JOURNAL.md`, wpis
  `AUDYT-2026-07-10` (przesluchanie-swiadkow-v2-min90 → v3.6, cztery
  bramki dodane: GATE-DEFAULT-NOW, IMPORTED-QUESTIONS-GATE,
  DOCUMENT-SCAN-PROMPT, TEZY-DOWODY-SWIADEK-GATE).**
- **Otwarta flaga strukturalna (F-7, patrz WARN-OTWARTE.md):** pozostałe
  skille proceduralne systemu nie zostały jeszcze systematycznie
  sprawdzone pod kątem tych samych czterech wzorców braków — wymaga
  sesji dedykowanej per skill.

**5.2 (2026-07-07) — Wydzielony rejestr WARN-OTWARTE.md; ZASADA 10 (na polecenie użytkownika):**
- **Nowy plik `references/WARN-OTWARTE.md`** — rejestr żywy zawierający
  WYŁĄCZNIE aktualnie otwarte flagi audytowe (WARN numerowane + strukturalne
  F-N). AUDIT-JOURNAL.md pozostaje pełną, niezmienioną historią —
  zamknięcia trafiają tam, nie tutaj.
- **ZASADA 10 dodana:** otwarcie flagi → wiersz w WARN-OTWARTE.md + wpis
  w dzienniku; zamknięcie → usunięcie wiersza z WARN-OTWARTE.md + pełny
  wpis w dzienniku. Pytania "co otwarte" → czytaj WARN-OTWARTE.md
  najpierw, nie grepuj całego dziennika.
- Zaktualizowano FAZA 0 (wczytuje teraz też WARN-OTWARTE.md), TRYB
  WARN-CLOSE, ZASADĘ 5 i frontmatter `references:` — wszystkie odwołania
  do "otwartych WARN" wskazują teraz na nowy plik.
- Przy okazji naprawiono zdanie o ZASADZIE 7 (OUTPUT-COMPLETENESS)
  omyłkowo osierocone pod koniec ZASADY 9 w poprzedniej edycji —
  przywrócone do właściwego miejsca (koniec ZASADY 7).

**5.1 (2026-07-07) — WARN-12 i WARN-24 zamknięte; ZASADA 9 dodana; naprawiony rozjazd wersji:**
- **WARN-12 zamknięty:** legenda SIŁA_D w `shared/MOD-MACIERZ-DOWOD-TEZA.md`
  dostosowana do kanonicznej hierarchii A-D z
  `analizator-dowodow-v3/modules/MD1-klasyfikacja.md` (4 poziomy zamiast 3,
  dodana reprezentacja kategorii D).
- **WARN-24 zamknięty:** ustalono rzeczywisty zakres Dz.U. 2026 poz. 795 (zwykły
  nowy t.j. KC, nie odrębna nowelizacja) i Dz.U. 2026 poz. 644 (ustawa ESAP —
  omnibus ~17 ustaw sektora finansowego, KSH dotknięty tylko incydentalnie,
  wcześniej błędnie zakładano że to nowelizacja KSH-centryczna). Zaktualizowano
  `mapa_dzu_2026-07-04.md`, `dr-06/MAPA-AKTOW.md` (+1 wiersz), `dr-02/MAPA-AKTOW.md`
  (doprecyzowanie).
- **Dodano ZASADĘ 9** (przegląd okresowy WARN co ~10 wpisów dziennika lub na
  żądanie użytkownika) — reakcja na to, że WARN-12/24 pozostały niezauważone
  przez wiele sesji mimo formalnego statusu "otwarte".
- **Naprawiono rozjazd wersji:** frontmatter błędnie cofnięty do 4.7 mimo że
  CHANGELOG od dawna wskazywał 5.0 jako najnowszy wpis (analogiczne do
  wcześniej naprawianego WARN-10 w innym skillu — rozjazd version: vs
  CHANGELOG). Ustalono 5.1 jako kontynuację prawdziwego najnowszego stanu (5.0).
- Pełny przegląd całego dziennika (`grep WARN-[0-9]+`) potwierdził: WARN-1 do
  WARN-29 wszystkie zamknięte. Zero otwartych CRIT.

**5.0 (2026-07-04p) — PROJEKT "KATALOG WSZYSTKICH T.J." ZAKOŃCZONY:**
- **DR-15 (Compliance, ISO, Governance, Audyt):** sprawdzona — już w pełni
  zweryfikowana z sesji 2026-07-02aaaa (5/5 aktów krajowych), brak akcji.
- **DR-16 (Pisma, Strategia, Dowody, Orzecznictwo) — W PEŁNI SKATALOGOWANA:**
  Prawo prasowe (2018.1914) potwierdzone w pełni jako pierwszy i jedyny
  t.j. tej ustawy od 1984 r.
- **MILESTONE: wszystkie 16 dziedzin (DR-01 do DR-16) przeszły dedykowaną
  sesję katalogowania tekstów jednolitych.** Podsumowanie łączne projektu:
  ok. 20 błędnych/nieistniejących numerów Dz.U. naprawionych, 4 błędne
  klasyfikacje aktu (ustawa↔rozporządzenie), kilka duplikatów
  międzydomenowych skonsolidowanych, 3 fałszywe alarmy o rzekomych nowych
  t.j. rozstrzygnięte. Pozostają świadomie otwarte: 3 flagi strukturalne
  w DR-10 (wymagają przebudowy modułów) + pojedyncze flagi "WYMAGA
  AKTUALIZACJI MODUŁU" w kilku dziedzinach (treść modułu, nie numer).
- Podbicie wersji z 4.x na 5.0 odzwierciedla ukończenie pełnego cyklu
  katalogowania wszystkich 16 dziedzin — kamień milowy projektu.

**4.21 (2026-07-04o):**
- **DR-14 (Prawo UE, Międzynarodowe, Prawa Człowieka) — 2 pozycje krajowe
  domknięte:** ustawa o "obecności sił zbrojnych obcych" — POPRAWKA NAZWY
  I NUMERU: prawidłowa nazwa "ustawa o zasadach pobytu wojsk obcych na
  terytorium RP" (23.09.1999), aktualny t.j. Dz.U. 2024 poz. 1770 (było błędnie
  2020.1287, numer nienależący do tej ustawy); Prawo prywatne
  międzynarodowe (2023.503) w pełni potwierdzone.
- `mapa_dzu_2026-07-04.md` zaktualizowana.

**4.20 (2026-07-04n):**
- **DR-13 (Służby, Bezpieczeństwo, Informacje Niejawne) — 1 pozycja
  poprawiona:** ustawa o SOP — numer "2024.1672" nie odpowiadał żadnemu
  potwierdzonemu dokumentowi; prawidłowy łańcuch t.j.: 2023.66 → 2024.325
  → 2025.34 (aktualny).
- `mapa_dzu_2026-07-04.md` +2 wiersze (nowy OK, PREV chain uzupełniony).
- DR-13 kończy z 0 pozycji o niepotwierdzonym numerze podstawowym.

**4.19 (2026-07-04m):**
- **DR-12 (Sądownictwo, Prokuratura, Zawody Prawnicze) — 2 pozycje w
  tabeli dyscyplinarnej zamknięte:** izby lekarskie (Dz.U. 2021 poz. 1342
  potwierdzone jako nadal aktualne — poprzednia ostrożność po lekcji z
  fałszywym alarmem USW okazała się nadmiarowa, liczne dokumenty ze
  stycznia 2026 potwierdzają ten sam numer); medycyna laboratoryjna
  (POPRAWKA — poprzedni numer 2022.2280 był już nieaktualny, prawidłowy
  aktualny t.j. to 2023.2125, zgodnie z mapą centralną, która już to
  miała poprawnie — korekta propagowana do dr-10 i dr-12 lokalnie).
- Dodano nowy wiersz w mapie centralnej: ustawa o izbach lekarskich
  (2021.1342) — wcześniej całkowicie nieobecna.

**4.18 (2026-07-04l):**
- **DR-11 (Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP) — W PEŁNI
  SKATALOGOWANA:** ostatnia niejednoznaczność (ustawa o świadczeniu usług
  drogą elektroniczną) zamknięta — potwierdzony t.j. Dz.U. 2024 poz. 1513
  (było błędnie cytowane jako "2020.344 ze zm."), plus nowelizacja DSA z
  18.12.2025 zmieniająca ten sam tekst.
- `mapa_dzu_2026-07-04.md` zaktualizowana (+1 wiersz OK, 1 PREV).

**4.17 (2026-07-04k):**
- **DR-10 (Zdrowie, Farmacja, Żywność, Rolnictwo) — 1 flaga numeryczna
  zamknięta:** ustawa o imprezach turystycznych — potwierdzony t.j. Dz.U.
  2023.2211 (poprzedni numer "2022.2189" z dawnego wiersza zbiorczego nie
  odpowiadał żadnemu dokumentowi). Pozostają 3 flagi STRUKTURALNE (nie
  numeryczne): rolnictwo/żywność/weterynaria (wymaga rozbicia wiersza
  zbiorczego), zawody medyczne/prawnicze (błędnie nazwany plik modułu),
  izby lekarskie (brak dedykowanego modułu) — wymagają sesji dedykowanej z
  decyzjami strukturalnymi, nie tylko weryfikacji Dz.U.
- `mapa_dzu_2026-07-04.md` +1 wiersz.

**4.16 (2026-07-04j):**
- **DR-09 (Budownictwo, Środowisko, Energia, Transport) — 2 flagi zamknięte:**
  ustawa o odpadach — flaga PILNA o rzekomym nowym t.j. z 1.07.2026
  rozstrzygnięta jako FAŁSZYWY ALARM (źródło mylnie datowane, opisywało
  wydarzenie z 2023 r.; potwierdzono przez dokument z 11.05.2026, że
  2023.1587 nadal obowiązuje); ustawa OOŚ (2024.1112) w pełni potwierdzona.
  1 pozycja bez numeru pozostaje otwarta ("POŚ Szczegóły" — wymaga
  doprecyzowania zakresu, nie do rozstrzygnięcia samą weryfikacją Dz.U.).

**4.15 (2026-07-04i):**
- **DR-08 (Samorząd Terytorialny i Prawo Lokalne) — SKATALOGOWANA:** 2
  pozycje domknięte: nowelizacja ochrony ludności/obrony cywilnej z
  17.04.2026 zidentyfikowana jako Dz.U. 2026 poz. 646 (scalono z wcześniejszym
  wpisem MONITORING); ustawa o ogłaszaniu aktów normatywnych (2019.1461)
  potwierdzona jako nadal aktualna.
- **Rozstrzygnięty rzekomy konflikt numeracji:** flaga "MOŻLIWY KONFLIKT"
  dla Dz.U. 2026 poz. 646 (dwa różne opisane tematy — obrona cywilna vs.
  oświadczenia przy pozwoleniu na budowę) okazała się FAŁSZYWYM ALARMEM —
  to jedna wieloprzedmiotowa ustawa nowelizująca kilka aktów jednocześnie,
  w tym Prawo budowlane.
- `mapa_dzu_2026-07-04.md` zaktualizowana (3 wiersze poprawione/zamknięte).

**4.14 (2026-07-04h):**
- **DR-07 (Zamówienia Publiczne, Fundusze UE) — SKATALOGOWANA:** 2 pozycje
  domknięte: NIK (2022.623 w pełni potwierdzone), PPP (POPRAWKA — numer
  "1688" należał do zupełnie innego aktu z tego samego roku, prawidłowy
  t.j. to 2023.1637).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.13 (2026-07-04g):**
- **DR-06 (Podatki, Finanse Publiczne, AML) — W PEŁNI SKATALOGOWANA:**
  ostatnia niezweryfikowana pozycja (ustawa akcyzowa, Dz.U. 2025 poz. 126)
  potwierdzona jako poprawna (isap, infor.pl, dziennikustaw.gov.pl, MF).
  DR-06 kończy z 0 pozycji niezweryfikowanych (pozostają 2 flagi treści
  modułu: obligacje, interpretacje podatkowe — numery już poprawne).
- **Podsumowanie etapu:** DR-01 do DR-06 mają teraz 0 otwartych pozycji
  "weryfikuj numer" / "niezweryfikowane". Łącznie w projekcie katalogowania
  naprawiono dotąd 9 błędnych/nieistniejących numerów Dz.U. (KNF x2 warianty,
  Rada Ministrów, Fundusz Pomocy Pokrzywdzonym, pracownicy tymczasowi, SKO,
  cudzoziemcy/ochrona, Aktywny Rodzic duplikat, KRS) w 6 dziedzinach.

**4.12 (2026-07-04f):**
- **DR-05 (Prawo Administracyjne i Sądownictwo Administracyjne) — SKATALOGOWANA:**
  3 pozycje domknięte: ustawa o udzielaniu ochrony cudzoziemcom (nowy t.j.
  2025.223, było 2024.1546 — sync również w dr-13/ROUTING-MAP), SKO
  (POPRAWKA — numer "2023.825" niepotwierdzony w 6 źródłach, prawidłowy
  2018.570), skarga na przewlekłość (status podniesiony do "w pełni
  potwierdzone", trzykrotnie zweryfikowane w projekcie).
- Pozostaje 1 świadomie otwarta flaga PILNA (cudzoziemcy/Ukraina — zmiana
  systemowa, wymaga sesji merytorycznej dedykowanej, nie tylko numeru Dz.U.).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane
  (w tym duplikat cudzoziemcy/ochrona między dr-05 i dr-13).

**4.11 (2026-07-04e):**
- **DR-04 (Prawo Pracy, ZUS, Świadczenia Społeczne) — SKATALOGOWANA:** 2
  pozycje zamknięte: Ustawa Aktywny Rodzic (Dz.U. 2024 poz. 858, brak jeszcze
  t.j.), ustawa o zatrudnianiu pracowników tymczasowych (POPRAWKA — numer
  "2025.1682" był błędny/nieistniejący, prawidłowy to 2025.236, potwierdzone
  4 niezależnymi źródłami).
- **Duplikat wykryty i naprawiony:** dwa wiersze "Ustawa Aktywny Rodzic" w
  mapie centralnej — jeden poprawny (2024.858), drugi błędny (2023.2760,
  który w rzeczywistości to zupełnie inna ustawa o wsparciu odbiorców
  energii). Skonsolidowane.
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.10 (2026-07-04d):**
- **DR-03 (Prawo Karne, Wykroczenia, Egzekucja) — SKATALOGOWANA:** ostatnia
  otwarta pozycja (Fundusz Pomocy Pokrzywdzonym) zamknięta — okazało się być
  BŁĘDEM STRUKTURALNYM, nie tylko numeru: nie jest to odrębna ustawa, lecz
  rozporządzenie MS wydane na podstawie art. 43 KKW; poprzedni numer
  "2022.2256" nie istniał. Poprawiono na aktualny t.j. rozporządzenia
  Dz.U. 2025 poz. 1298. Sygnał o nowelizacji ustawy o przeciwdziałaniu
  narkomanii (11.06.2026) zaktualizowany — bill przeszedł Sejm, ale brak
  potwierdzonej publikacji w Dz.U. — flaga świadomie pozostaje otwarta.
- `mapa_dzu_2026-07-04.md` +1 wiersz (Fundusz Pomocy Pokrzywdzonym, rozporządzenie).
- DR-03 kończy z 0 pozycji "niezweryfikowanych"; pozostaje 1 flaga oczekująca
  na publikację aktu (narkomania, poza kontrolą audytu) + 2 flagi treści
  modułu (numery już poprawne).

**4.9 (2026-07-04c):**
- **DR-02 (Prawo Cywilne, Rodzinne i Gospodarcze) — SKATALOGOWANA:** 4 pozycje
  uprzednio "weryfikuj w ISAP" zamknięte: OZSS (2018.708 — potwierdzone
  aktualne), KK art. 233 (2025.383 — zsynchronizowane z dr-03), doradca
  restrukturyzacyjny licencja (2022.1007 — potwierdzone aktualne). KC
  (2025.1071) i KSH (2024.18) potwierdzone jako aktualne podstawowe t.j.
- **Wykryty i rozwiązany duplikat międzydomenowy (flaga otwarta z sesji
  DR-01):** ustawa o skardze na przewlekłość miała w mapie centralnej 3
  niespójne wiersze (2016.1259 błędny, 2023.1725 typu NW błędnie, 2023.1725
  typu TJ poprawny) — skonsolidowane do jednego kanonicznego wiersza TJ z
  konsumentami dr-01 + dr-05. Zweryfikowano bezpośrednio w `dr-05/MAPA-
  AKTOW.md`, że lokalny plik dr-05 już miał poprawny numer — błąd był
  wyłącznie w niezsynchronizowanej mapie centralnej.
- `mapa_dzu_2026-07-04.md` zaktualizowana (448 → 448 wierszy netto — 2 dodane
  jako duplikaty PREV, ale bez zmiany liczby aktywnych OK).

**4.8 (2026-07-04b):**
- **Rozpoczęto projekt "katalog wszystkich obowiązujących tekstów jednolitych
  ustaw"** — realizowany etapami, jedna dziedzina (DR) na sesję, zgodnie z
  zasadą "nigdy nie zgaduj numeru".
- **DR-01 (Ustrój Konstytucyjny i Źródła Prawa) — W PEŁNI SKATALOGOWANA:**
  11/11 aktów zweryfikowanych w ISAP. 2 akty dodane od zera (PUSA — Dz.U.
  2024.1297; skarga na przewlekłość — Dz.U. 2023 poz. 1725), 2 błędne numery
  poprawione (KRS: 2011.714→2024.1186; Rada Ministrów: 2022.2032 [numer
  nieistniejący]→2025.780), 1 duplikat wykryty i skonsolidowany (PUSP
  2024.334 pod dwiema nazwami), 1 flaga międzydomenowa otwarta (niespójność
  numeru skargi na przewlekłość między DR-01 i DR-05 — do zbadania w sesji
  DR-05).
- `mapa_dzu_2026-07-04.md` zaktualizowana (439 → 448 wierszy).

**4.7 (2026-07-04):**
- **TRYB WARN-CLOSE — 3 drugorzędne flagi z 2026-07-02eeee ZAMKNIĘTE:**
  WARN-KNF (duplikat "Ustawa o nadzorze KNF" — jedyny prawidłowy t.j.
  2025.640, poprzedni 2024.135; błędne 2024.136/2024.724 przeklasyfikowane),
  WARN-SPORT (rozdzielono "Ustawa o sporcie" 2026.95 od odrębnego aktu
  "Ustawa o bezpieczeństwie imprez masowych" — t.j. 2023.616, poprzedni
  2022.1466; turystyka pozostaje otwarta, niezweryfikowana), WARN-RZPAT
  (poprzedni wpis 2025.591 był rozporządzeniem wykonawczym, nie t.j. ustawy;
  prawidłowy aktualny t.j. to 2026.778, poprzedni 2024.749).
- Zaktualizowano `mapa_dzu_2026-07-02.md` → `mapa_dzu_2026-07-04.md` (432 →
  439 wierszy).
- Poprawki propagowane do: `dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md`,
  `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/MAPA-AKTOW.md`,
  `dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md`,
  `prawo-polskie-v2/ROUTING-MAP.md`.
- Wszystkie 3 numery zweryfikowane online (isap.sejm.gov.pl, infor.pl,
  prawo.pl) — żaden nie był zgadywany.
- CRIT-1 (5 plików shared/: MOD-TIMING, MOD-INTRO, MOD-KONCENTRACJA,
  MOD-PEER-REVIEW, MOD-DOKTRYNA) zweryfikowany jako JUŻ ZAMKNIĘTY —
  wszystkie 5 plików istnieją na dysku; wpis w AUDIT-JOURNAL był nieaktualny
  (pochodził z sesji 2026-06-23, naprawiony później bez odnotowania).

**4.6 (2026-07-02):**
- **WARN-26 ZAMKNIĘTY W CAŁOŚCI (16/16 kroków)** — pełna weryfikacja TRYB
  DZU wszystkich DR-skilli (dr-01…dr-16) + synchronizacja obu plików
  centralnych (`prawo-polskie-v2/ROUTING-MAP.md`: 46 wierszy;
  `mapa_dzu_2026-07-02.md`: 28 sync + 3 dodane). 68 błędów CRIT naprawionych
  łącznie w DR-MAPA-AKTOW w trakcie sesji. Wykryto i udokumentowano
  strukturalny dryf synchronizacji dysk↔centralne indeksy (dokładnie
  ryzyko zasygnalizowane we wcześniejszym audycie silnika) — naprawy
  punktowe w DR-skillach nie były propagowane automatycznie do
  ROUTING-MAP/mapa_dzu. 3 flagi świadomie pozostawione nierozstrzygnięte
  (duplikat KNF, możliwe rozdzielenie sport/imprezy masowe, niepotwierdzony
  t.j. rzeczników patentowych) zamiast zgadywania.


**4.5 (2026-06-17):**
- Dodano ZASADĘ 7: OUTPUT-COMPLETENESS — każda naprawa musi być dostarczona
  jako kompletny skill (wszystkie pliki + podfoldery), nie tylko zmieniony plik.
  Naruszenie = CRIT. Wyjątek tylko na explicite potwierdzenie dewelopera w sesji.

**4.4 (2026-06-14g):**
- Naprawiono nieaktualne odwołania `mapa_dzu_2026-06-07.md` → `mapa_dzu_2026-06-14.md`
  (12 miejsc w SKILL.md, w tym FAZA 0, FAZA 7B, drzewo plików)
- WARN-1/2/3 (zaległość z AUDYT-2026-06-04/05) formalnie zamknięte —
  patrz AUDIT-JOURNAL.md → AUDYT-2026-06-14g (skrócony)
- `shared/DEPENDENCY-GRAPH.md` uzupełniony o 20 brakujących wpisów
- 5 nowych plików ORPHAN w shared/ oznaczone (CHECKLIST-DEDUP NOTA-6, PENDING)
- Usunięto pliki archiwalne z `references/`: `SKILLS-MAP-AND-FIXES-2026-06-04.md`
  (snapshot 06-04, zastąpiony przez DEPENDENCY-GRAPH/CHECKLIST-DEDUP/mapa_dzu),
  `mapa_dzu_2026-06-07.md` (zastąpiony przez 06-14), `WARN-8-DZU-worksheet-2026-06-14.md`
  (worksheet zamknięty 16/16, treść skondensowana w AUDIT-JOURNAL)

**4.3:** PRAWO-HARDGATE KROK 2B/5B (NOTA-5, TK 2024-2026), AKTY-PRAWNE-MASTER
deprecated (WARN-7), WARN-8 zamknięty 16/16 (TRYB DZU), WARN-9 zamknięty.

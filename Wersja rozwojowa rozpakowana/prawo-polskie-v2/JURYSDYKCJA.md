# JURYSDYKCJA PL — manifest kluczy `JUR:`

Skille wykonawcze opisują metodę; treść prawa krajowego wskazują kluczem `JUR:<klucz>`.
Ten plik mapuje każdy klucz na moduł prawa polskiego. Inna jurysdykcja = inny pakiet
z tym samym zestawem kluczy (`shared/UNIVERSAL-RUNTIME-ADAPTER.md` §1B).

| Klucz | Moduł | Zakres |
|---|---|---|
| `JUR:terminy-procesowe` | `shared/terminy.md` | terminy procesowe i materialne wszystkich reżimów (KPC, KPK, KPW, KPA, PPSA, KP, KC i inne), reguły liczenia |
| `JUR:oplaty-sadowe` | `shared/TABELE-OPLAT.md` | opłaty sądowe i koszty |
| `JUR:hierarchia-zrodel` | `shared/HIERARCHIA-ZRODEL.md` | rzędy źródeł, kanon weryfikacji przepisów (ELI, ISAP) |
| `JUR:zrodla-aktow` | `prawny-router-v3/references/ZRODLA-AKTOW-FALLBACK.md` | gdzie czytać akt, gdy źródło urzędowe zawodzi |
| `JUR:mapa-dziedzin` | `prawo-polskie-v2/ROUTING-MAP.md` | dziedziny prawa (DR-01…DR-16) i ich skille |

### Pełna mapa modułów prawa polskiego (E1b, 2026-11-06)

Wygenerowana z `audyt-systemu-v4/scripts/mapa_jurysdykcji.py` (klasa MODUŁ PL) i uzupełniona o moduły procedury i kosztów z klasy MIESZANY. Adres, nie przeniesienie: moduł zostaje tam, gdzie jest, do etapu E3.

| Klucz | Moduł | Zakres |
|---|---|---|
| `JUR:umowy-j7-pzp` | `analizator-umow-v1/references/mod-J7-pzp.md` | typy umów, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:prawa-obywatelskie-srodki-karne` | `shared/mod-prawa-obywatelskie-srodki-karne.md` | akty i przepisy, zawody; pakiet PL (dziś shared/router) |
| `JUR:isap-metryki-aktow` | `shared/ISAP-METRYKI-AKTOW.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:legal-registry` | `shared/LEGAL-REGISTRY.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:leksykon-priorytety-p1` | `shared/orka-bas-leksykon/czesc-06-priorytety-P1.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:definicje-interes-wlasny-wylaczenia` | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:leksykon-praca-admin-drogowe` | `shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:leksykon-kandydaci-prawa-obywatelskie-sporne` | `shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:leksykon-praktyka-prawnicza` | `shared/orka-bas-leksykon/czesc-08-praktyka-prawnicza.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:leksykon-cywilne-niepelnosprawnosc` | `shared/orka-bas-leksykon/czesc-03-cywilne-niepelnosprawnosc.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:umowy-j5-umowy-wykonawcze` | `analizator-umow-v1/references/mod-J5-umowy-wykonawcze.md` | źródła i bazy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-odpowiedzialnosc-szkoda` | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | akty i przepisy, sygnatury; pakiet PL (dziś shared/router) |
| `JUR:leksykon-karne` | `shared/orka-bas-leksykon/czesc-04-karne.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-fa-founders-dokumenty-zalozycielskie` | `analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md` | akty i przepisy, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j2-nieruchomosci` | `analizator-umow-v1/references/mod-J2-nieruchomosci.md` | typy umów, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:niewidomy-prawa-prawne` | `shared/mod-niewidomy-prawa-prawne.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j8-b2c` | `analizator-umow-v1/references/mod-J8-b2c.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spj-interpretacja-zus` | `pisma-proste-v2/references/SPJ-interpretacja-zus.md` | organy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-umowy-o-prace` | `analizator-umow-v1/references/umowy-o-prace.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-shared-rodo` | `analizator-umow-v1/references/mod-shared-rodo.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:leksykon-priorytety-p2-bas-v18` | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j0-routing` | `analizator-umow-v1/references/mod-J0-routing.md` | typy umów, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-podmioty-wlasnosc` | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:niepelnosprawnosc-intelektualna-gluchota` | `shared/mod-niepelnosprawnosc-intelektualna-gluchota.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:interpretacje-urzedowe` | `shared/INTERPRETACJE-URZEDOWE.md` | organy, zawody; pakiet PL (dziś shared/router) |
| `JUR:dowody-md3b-walidacja-prawna` | `analizator-dowodow-v3/modules/MD3b-walidacja-prawna.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:router-routing-bj-bw` | `prawny-router-v3/references/ROUTING-BJ-BW.md` | organy, zawody; pakiet PL (dziś shared/router) |
| `JUR:przesluchanie-prawo-hardgate-witness` | `przesluchanie-swiadkow-v2-min90/references/PRAWO-HARDGATE-WITNESS.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:leksykon-finanse-nieruchomosci-energetyczne` | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-zakaz-konkurencji` | `analizator-umow-v1/references/zakaz-konkurencji.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-w3-podmiot-gate` | `pisma-procesowe-v3/references/W3-PODMIOT-GATE.md` | identyfikatory, sądy i procedura; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spb-zarzuty` | `pisma-proste-v2/references/SPB-zarzuty.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:orka-bas-viii-x-kadencja` | `shared/ORKA-BAS-VIII-X-KADENCJA.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:dowody-mp10-koszty` | `analizator-dowodow-v3/modules/MP10-koszty.md` | opłaty, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-praca` | `shared/definicje/DEF-PRACA.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:pisma-proste-sph-inne` | `pisma-proste-v2/references/SPH-inne.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spl-skarga-komornik` | `pisma-proste-v2/references/SPL-skarga-komornik.md` | zawody, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spa-sprzeciw` | `pisma-proste-v2/references/SPA-sprzeciw.md` | wymogi pism, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:router-pokrycie-dziedzinowe` | `prawny-router-v3/references/pokrycie-dziedzinowe.md` | typy umów, organy; pakiet PL (dziś shared/router) |
| `JUR:pisma-proste-m6-oplaty` | `pisma-proste-v2/references/M6-oplaty.md` | opłaty, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:prawo-hardgate-blokada` | `shared/PRAWO-HARDGATE-BLOKADA.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:zazalenie-adresat-gate` | `shared/ZAZALENIE-ADRESAT-GATE.md` | wymogi pism, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:polish-law-completeness-matrix` | `shared/POLISH-LAW-COMPLETENESS-MATRIX.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:definicje-administracyjne` | `shared/definicje/DEF-ADMINISTRACYJNE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:pisma-oplaty` | `pisma-procesowe-v3/modules/MOD-OPLATY.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-shared-fm-hardship` | `analizator-umow-v1/references/mod-shared-fm-hardship.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mp11-rodo-cyber` | `analizator-dowodow-v3/modules/MP11-rodo-cyber.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mx-dziedziny` | `analizator-dowodow-v3/modules/MX-dziedziny.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j10-ubezpieczenia` | `analizator-umow-v1/references/mod-J10-ubezpieczenia.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-ma-transakcje` | `analizator-umow-v1/references/mod-MA-transakcje.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:zawiadomienia-krzyzowe` | `shared/ZAWIADOMIENIA-KRZYZOWE.md` | organy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:osoba-niewidoma-prawa-sad` | `shared/mod-osoba-niewidoma-prawa-sad.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:agent-weryfikator-isap` | `shared/agents/weryfikator-isap.md` | źródła i bazy, waluta; pakiet PL (dziś shared/router) |
| `JUR:definicje-procedura` | `shared/definicje/DEF-PROCEDURA.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:definicje-podatkowe` | `shared/definicje/DEF-PODATKOWE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-shared-orzecznictwo-umow` | `analizator-umow-v1/references/mod-shared-orzecznictwo-umow.md` | źródła i bazy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mp12-terminy` | `analizator-dowodow-v3/modules/MP12-terminy.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-pracodawca-rzeczywisty` | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` | identyfikatory, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-budowlane-drogowe` | `shared/definicje/DEF-BUDOWLANE-DROGOWE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-shared-abusive-clauses` | `analizator-umow-v1/references/mod-shared-abusive-clauses.md` | organy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-b2b-podwykonawcze` | `analizator-umow-v1/references/b2b-podwykonawcze.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spf-spg` | `pisma-proste-v2/references/SPF-SPG.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-essentialia-regulaminy-i-korporacyjne` | `analizator-umow-v1/references/generator/essentialia-regulaminy-i-korporacyjne.md` | akty i przepisy, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-prawo` | `pisma-procesowe-v3/modules/MOD-PRAWO.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pre-w2-verification-gate` | `shared/PRE-W2-VERIFICATION-GATE.md` | identyfikatory, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:tryby-procesowe` | `shared/TRYBY-PROCESOWE.md` | wymogi pism, opłaty; pakiet PL (dziś shared/router) |
| `JUR:definicje-cywilne-wykladnia` | `shared/definicje/DEF-CYWILNE-WYKLADNIA.md` | typy umów, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:identyfikacja-strony-umowy` | `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` | identyfikatory, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:stalking-nekanie` | `shared/STALKING-NEKANIE.md` | wymogi pism, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j21-rodo-archiwizacja-regulaminy` | `analizator-umow-v1/references/mod-J21-rodo-archiwizacja-regulaminy.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j4-finansowanie` | `analizator-umow-v1/references/mod-J4-finansowanie.md` | źródła i bazy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:format-cytowania` | `shared/FORMAT-CYTOWANIA.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:oplaty-cywilne-rodzinne-pracownicze` | `shared/oplaty/01-KSCU-cywilne-rodzinne-pracownicze.md` | waluta, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:oplaty-zwolnienia-zwrot-alimenty` | `shared/oplaty/02-zwolnienia-zwrot-alimenty.md` | akty i przepisy, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-koszty-zastepstwa-taksy` | `shared/oplaty/03-koszty-zastepstwa-taksy.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-wartosci-powtarzalne` | `shared/oplaty/04-wartosci-powtarzalne-kotwice.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:oplaty-sprawy-karne` | `shared/oplaty/05-sprawy-karne.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:oplaty-administracyjne-wieczystoksiegowe-kio` | `shared/oplaty/06-administracyjne-wieczystoksiegowe-KIO.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-komornicze-skarbowe-notarialne` | `shared/oplaty/07-komornicze-skarbowe-notarialne.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:wymogi-formalne-pism` | `shared/FORMAL-CHECK.md` | wymogi pism, opłaty; pakiet PL (dziś shared/router) |
| `JUR:braki-formalne` | `shared/BRAKI-FORMALNE.md` | procedura i koszty; pakiet PL (dziś shared/router) |
| `JUR:wlasciwosc-sadow` | `shared/WLASCIWOSC-GATE.md` | sądy i procedura, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:sygnatury-repertoria` | `shared/SYGNATURY.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:orzecznictwo-hierarchia` | `shared/ORZECZENIA-HIERARCHIA.md` | sądy i procedura, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:portale-branzowe` | `shared/PORTALE-BRANZOWE-RZAD-2B.md` | organy, opłaty; pakiet PL (dziś shared/router) |
| `JUR:nazewnictwo-stron` | `shared/NAZEWNICTWO-STRON.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:przesluchanie-swiadkow-procedura` | `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` | akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:prekluzja-dowodowa` | `shared/PREKLUZJA-DOWODOWA.md` | procedura i koszty; pakiet PL (dziś shared/router) |
| `JUR:liczenie-terminow` | `shared/TERM-CALC.md` | wymogi pism, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:samorzady-zawodowe-dokumenty` | `shared/SAMORZADY-ZAWODOWE-DOKUMENTY.md` | zawody, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:standard-modulu-prawa-krajowego` | `shared/MODULE-STANDARD-POLISH-LAW.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:kompletnosc-prawa-krajowego` | `shared/POLISH-LAW-FINAL-COMPLETENESS-GATE.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:weryfikacja-przepisow-kanon` | `shared/PRAWO-HARDGATE.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:weryfikacja-orzeczen-kanon` | `shared/PRAWO-HARDGATE-ORZECZENIA.md` | sądy i procedura, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:analiza-koszty-terminy` | `analiza-sadowa-v6/references/koszty-terminy.md` | waluta, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |

Zasady:
- Jeden klucz = jeden moduł. Klucz nie zmienia znaczenia; zmienia się tylko moduł, na który wskazuje.
- Klucz bez wiersza albo moduł, którego nie ma → `⛔ TRYB ZDEGRADOWANY — klucz jurysdykcji nierozwiązany`.
- Przeniesienie treści prawa polskiego ze skilla wykonawczego do modułu jest dopuszczalne
  tylko, gdy każdy przeniesiony wiersz ma odpowiednik w module (test równoważności
  `audyt-systemu-v4/scripts/check_jurysdykcja.py`, T50).

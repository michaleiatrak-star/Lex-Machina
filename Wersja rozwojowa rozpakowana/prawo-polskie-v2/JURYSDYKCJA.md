# JURYSDYKCJA PL — manifest kluczy `JUR:`

Skille wykonawcze opisują metodę; treść prawa krajowego wskazują kluczem `JUR:<klucz>`.
Ten plik mapuje każdy klucz na moduł prawa polskiego. Inna jurysdykcja = inny pakiet
z tym samym zestawem kluczy (`shared/UNIVERSAL-RUNTIME-ADAPTER.md` §1B).

## DOSTAWCA JURYSDYKCJI

Jeden blok na pakiet kraju; aplikacja i audyt czytają go, gdy ta jurysdykcja jest wybrana
(lista „Jurysdykcja” w aplikacji, `LEX_JURISDICTION_PACK`; domyślnie `prawo-polskie-v2`).
Inny kraj ma własny pakiet (nazwa kraju) z analogami wszystkich pól i kluczy — nic z prawa polskiego.
Pola komponentów to identyfikatory dostawców zaimplementowanych w aplikacji: kraj, dla którego
aplikacja nie ma dostawcy danego komponentu, działa w trybie zdegradowanym z nazwanym brakiem —
nigdy z komponentem innego kraju.

| Pole | Wartość | Znaczenie |
|---|---|---|
| `kraj` | `PL` | kod kraju (ISO 3166-1) |
| `nazwa` | `Polska — prawo polskie` | pozycja na liście „Jurysdykcja” |
| `jezyk` | `pl` | język dokumentów, odpowiedzi i słowników |
| `waluta` | `PLN` | kwoty, opłaty, kursy |
| `dziedziny` | `prawo-polskie-v2/ROUTING-MAP.md` | skille dziedzinowe (dr-*) tej jurysdykcji |
| `prefiks-dziedzin` | `dr` | prefiks skilli dziedzinowych (`dr-02-…`); inny kraj: dwuliterowy kod (`de-02-…`) |
| `konektory` | `prawo-polskie-v2/mcp-servers` | serwery MCP (pakiet `dist/lex-mcp.mjs`, instalator) |
| `konektory-serwery` | `isap, eurlex, saos, cbosa, sn, sp, tk, kio, etpcz, krs, wl, ceidg, nbp, eureka, sudop, uodo` | konektory widoczne przy tej jurysdykcji |
| `weryfikacja-przepisow` | `pl-eli` | teksty aktów i stan prawny (Sejm ELI, kopia ELI) |
| `hierarchia-zrodel` | `JUR:hierarchia-zrodel` | rzędy źródeł (moduł klucza) |
| `orzecznictwo` | `pl-sady` | SN, sądy powszechne, NSA/WSA, TK, KIO; repertoria sygnatur |
| `rejestry` | `pl-krs-vat-ceidg` | KRS, biała lista VAT, CEIDG, NBP |
| `anonimizacja` | `pl` | imiona, nazwiska i adresy (Morfeusz, Stanza pl), PESEL, NIP, REGON |
| `ocr` | `pl` | język modeli OCR, kwoty w zł |
| `semantyka` | `pl` | reguły routingu i kontroli treści w języku polskim |
| `sady` | `pl` | baza sądów, właściwość, wokandy |
| `model-lokalny` | `bielik` | domyślny model lokalny dla języka jurysdykcji |

## KLUCZE TREŚCI

| Klucz | Moduł | Zakres |
|---|---|---|
| `JUR:terminy-procesowe` | `prawo-polskie-v2/krajowe/shared/terminy.md` | terminy procesowe i materialne wszystkich reżimów (KPC, KPK, KPW, KPA, PPSA, KP, KC i inne), reguły liczenia |
| `JUR:oplaty-sadowe` | `prawo-polskie-v2/krajowe/shared/TABELE-OPLAT.md` | opłaty sądowe i koszty |
| `JUR:hierarchia-zrodel` | `prawo-polskie-v2/krajowe/shared/HIERARCHIA-ZRODEL.md` | rzędy źródeł, kanon weryfikacji przepisów (ELI, ISAP) |
| `JUR:zrodla-aktow` | `prawny-router-v3/references/ZRODLA-AKTOW-FALLBACK.md` | gdzie czytać akt, gdy źródło urzędowe zawodzi |
| `JUR:mapa-dziedzin` | `prawo-polskie-v2/ROUTING-MAP.md` | dziedziny prawa (DR-01…DR-16) i ich skille |

### Pełna mapa modułów prawa polskiego (E1b, 2026-11-06)

Wygenerowana z `audyt-systemu-v4/scripts/mapa_jurysdykcji.py` (klasa MODUŁ PL) i uzupełniona o moduły procedury i kosztów z klasy MIESZANY. Adres, nie przeniesienie: moduł zostaje tam, gdzie jest, do etapu E3.

| Klucz | Moduł | Zakres |
|---|---|---|
| `JUR:umowy-j7-pzp` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J7-pzp.md` | typy umów, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:prawa-obywatelskie-srodki-karne` | `prawo-polskie-v2/krajowe/shared/mod-prawa-obywatelskie-srodki-karne.md` | akty i przepisy, zawody; pakiet PL (dziś shared/router) |
| `JUR:isap-metryki-aktow` | `prawo-polskie-v2/krajowe/shared/ISAP-METRYKI-AKTOW.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:legal-registry` | `prawo-polskie-v2/krajowe/shared/LEGAL-REGISTRY.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:leksykon-priorytety-p1` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-06-priorytety-P1.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:definicje-interes-wlasny-wylaczenia` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:leksykon-praca-admin-drogowe` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:leksykon-kandydaci-prawa-obywatelskie-sporne` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:leksykon-praktyka-prawnicza` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-08-praktyka-prawnicza.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:leksykon-cywilne-niepelnosprawnosc` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-03-cywilne-niepelnosprawnosc.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:umowy-j5-umowy-wykonawcze` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J5-umowy-wykonawcze.md` | źródła i bazy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-odpowiedzialnosc-szkoda` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | akty i przepisy, sygnatury; pakiet PL (dziś shared/router) |
| `JUR:leksykon-karne` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-04-karne.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-fa-founders-dokumenty-zalozycielskie` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md` | akty i przepisy, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j2-nieruchomosci` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J2-nieruchomosci.md` | typy umów, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:niewidomy-prawa-prawne` | `prawo-polskie-v2/krajowe/shared/mod-niewidomy-prawa-prawne.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j8-b2c` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J8-b2c.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spj-interpretacja-zus` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPJ-interpretacja-zus.md` | organy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-umowy-o-prace` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/umowy-o-prace.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-shared-rodo` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-shared-rodo.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:leksykon-priorytety-p2-bas-v18` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j0-routing` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J0-routing.md` | typy umów, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-podmioty-wlasnosc` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:niepelnosprawnosc-intelektualna-gluchota` | `prawo-polskie-v2/krajowe/shared/mod-niepelnosprawnosc-intelektualna-gluchota.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:interpretacje-urzedowe` | `prawo-polskie-v2/krajowe/shared/INTERPRETACJE-URZEDOWE.md` | organy, zawody; pakiet PL (dziś shared/router) |
| `JUR:dowody-md3b-walidacja-prawna` | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MD3b-walidacja-prawna.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:router-routing-bj-bw` | `prawny-router-v3/references/ROUTING-BJ-BW.md` | organy, zawody; pakiet PL (dziś shared/router) |
| `JUR:przesluchanie-prawo-hardgate-witness` | `prawo-polskie-v2/krajowe/przesluchanie-swiadkow-v2-min90/references/PRAWO-HARDGATE-WITNESS.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:leksykon-finanse-nieruchomosci-energetyczne` | `prawo-polskie-v2/krajowe/shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-zakaz-konkurencji` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/zakaz-konkurencji.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-w3-podmiot-gate` | `prawo-polskie-v2/krajowe/pisma-procesowe-v3/references/W3-PODMIOT-GATE.md` | identyfikatory, sądy i procedura; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spb-zarzuty` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPB-zarzuty.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:orka-bas-viii-x-kadencja` | `prawo-polskie-v2/krajowe/shared/ORKA-BAS-VIII-X-KADENCJA.md` | akty i przepisy, organy; pakiet PL (dziś shared/router) |
| `JUR:dowody-mp10-koszty` | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MP10-koszty.md` | opłaty, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-praca` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-PRACA.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:pisma-proste-sph-inne` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPH-inne.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spl-skarga-komornik` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPL-skarga-komornik.md` | zawody, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spa-sprzeciw` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPA-sprzeciw.md` | wymogi pism, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:router-pokrycie-dziedzinowe` | `prawny-router-v3/references/pokrycie-dziedzinowe.md` | typy umów, organy; pakiet PL (dziś shared/router) |
| `JUR:pisma-proste-m6-oplaty` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/M6-oplaty.md` | opłaty, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:prawo-hardgate-blokada` | `prawo-polskie-v2/krajowe/shared/PRAWO-HARDGATE-BLOKADA.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:zazalenie-adresat-gate` | `prawo-polskie-v2/krajowe/shared/ZAZALENIE-ADRESAT-GATE.md` | wymogi pism, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:polish-law-completeness-matrix` | `prawo-polskie-v2/krajowe/shared/POLISH-LAW-COMPLETENESS-MATRIX.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:definicje-administracyjne` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-ADMINISTRACYJNE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:pisma-oplaty` | `prawo-polskie-v2/krajowe/pisma-procesowe-v3/modules/MOD-OPLATY.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-shared-fm-hardship` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-shared-fm-hardship.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mp11-rodo-cyber` | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MP11-rodo-cyber.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mx-dziedziny` | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MX-dziedziny.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j10-ubezpieczenia` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J10-ubezpieczenia.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-ma-transakcje` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-MA-transakcje.md` | akty i przepisy, źródła i bazy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:zawiadomienia-krzyzowe` | `prawo-polskie-v2/krajowe/shared/ZAWIADOMIENIA-KRZYZOWE.md` | organy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:osoba-niewidoma-prawa-sad` | `prawo-polskie-v2/krajowe/shared/mod-osoba-niewidoma-prawa-sad.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:agent-weryfikator-isap` | `shared/agents/weryfikator-isap.md` | źródła i bazy, waluta; pakiet PL (dziś shared/router) |
| `JUR:definicje-procedura` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-PROCEDURA.md` | akty i przepisy, wymogi pism; pakiet PL (dziś shared/router) |
| `JUR:definicje-podatkowe` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-PODATKOWE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-shared-orzecznictwo-umow` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-shared-orzecznictwo-umow.md` | źródła i bazy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:dowody-mp12-terminy` | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MP12-terminy.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-pracodawca-rzeczywisty` | `prawo-polskie-v2/krajowe/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` | identyfikatory, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:definicje-budowlane-drogowe` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-BUDOWLANE-DROGOWE.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:umowy-shared-abusive-clauses` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-shared-abusive-clauses.md` | organy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-b2b-podwykonawcze` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/b2b-podwykonawcze.md` | akty i przepisy, typy umów; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-proste-spf-spg` | `prawo-polskie-v2/krajowe/pisma-proste-v2/references/SPF-SPG.md` | akty i przepisy, opłaty; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-essentialia-regulaminy-i-korporacyjne` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/generator/essentialia-regulaminy-i-korporacyjne.md` | akty i przepisy, identyfikatory; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pisma-prawo` | `prawo-polskie-v2/krajowe/pisma-procesowe-v3/modules/MOD-PRAWO.md` | akty i przepisy, wymogi pism; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:pre-w2-verification-gate` | `prawo-polskie-v2/krajowe/shared/PRE-W2-VERIFICATION-GATE.md` | identyfikatory, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:tryby-procesowe` | `prawo-polskie-v2/krajowe/shared/TRYBY-PROCESOWE.md` | wymogi pism, opłaty; pakiet PL (dziś shared/router) |
| `JUR:definicje-cywilne-wykladnia` | `prawo-polskie-v2/krajowe/shared/definicje/DEF-CYWILNE-WYKLADNIA.md` | typy umów, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:identyfikacja-strony-umowy` | `prawo-polskie-v2/krajowe/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` | identyfikatory, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:stalking-nekanie` | `prawo-polskie-v2/krajowe/shared/STALKING-NEKANIE.md` | wymogi pism, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:umowy-j21-rodo-archiwizacja-regulaminy` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J21-rodo-archiwizacja-regulaminy.md` | akty i przepisy, organy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:umowy-j4-finansowanie` | `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-J4-finansowanie.md` | źródła i bazy, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |
| `JUR:format-cytowania` | `prawo-polskie-v2/krajowe/shared/FORMAT-CYTOWANIA.md` | akty i przepisy, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:oplaty-cywilne-rodzinne-pracownicze` | `prawo-polskie-v2/krajowe/shared/oplaty/01-KSCU-cywilne-rodzinne-pracownicze.md` | waluta, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:oplaty-zwolnienia-zwrot-alimenty` | `prawo-polskie-v2/krajowe/shared/oplaty/02-zwolnienia-zwrot-alimenty.md` | akty i przepisy, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-koszty-zastepstwa-taksy` | `prawo-polskie-v2/krajowe/shared/oplaty/03-koszty-zastepstwa-taksy.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-wartosci-powtarzalne` | `prawo-polskie-v2/krajowe/shared/oplaty/04-wartosci-powtarzalne-kotwice.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:oplaty-sprawy-karne` | `prawo-polskie-v2/krajowe/shared/oplaty/05-sprawy-karne.md` | akty i przepisy, waluta; pakiet PL (dziś shared/router) |
| `JUR:oplaty-administracyjne-wieczystoksiegowe-kio` | `prawo-polskie-v2/krajowe/shared/oplaty/06-administracyjne-wieczystoksiegowe-KIO.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:oplaty-komornicze-skarbowe-notarialne` | `prawo-polskie-v2/krajowe/shared/oplaty/07-komornicze-skarbowe-notarialne.md` | waluta, opłaty; pakiet PL (dziś shared/router) |
| `JUR:wymogi-formalne-pism` | `prawo-polskie-v2/krajowe/shared/FORMAL-CHECK.md` | wymogi pism, opłaty; pakiet PL (dziś shared/router) |
| `JUR:braki-formalne` | `prawo-polskie-v2/krajowe/shared/BRAKI-FORMALNE.md` | procedura i koszty; pakiet PL (dziś shared/router) |
| `JUR:wlasciwosc-sadow` | `prawo-polskie-v2/krajowe/shared/WLASCIWOSC-GATE.md` | sądy i procedura, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:sygnatury-repertoria` | `prawo-polskie-v2/krajowe/shared/SYGNATURY.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:orzecznictwo-hierarchia` | `prawo-polskie-v2/krajowe/shared/ORZECZENIA-HIERARCHIA.md` | sądy i procedura, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:portale-branzowe` | `prawo-polskie-v2/krajowe/shared/PORTALE-BRANZOWE-RZAD-2B.md` | organy, opłaty; pakiet PL (dziś shared/router) |
| `JUR:nazewnictwo-stron` | `prawo-polskie-v2/krajowe/shared/NAZEWNICTWO-STRON.md` | akty i przepisy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:przesluchanie-swiadkow-procedura` | `prawo-polskie-v2/krajowe/shared/PRZESLUCHANIE-SWIADKOW-KPC.md` | akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:prekluzja-dowodowa` | `prawo-polskie-v2/krajowe/shared/PREKLUZJA-DOWODOWA.md` | procedura i koszty; pakiet PL (dziś shared/router) |
| `JUR:liczenie-terminow` | `prawo-polskie-v2/krajowe/shared/TERM-CALC.md` | wymogi pism, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:samorzady-zawodowe-dokumenty` | `prawo-polskie-v2/krajowe/shared/SAMORZADY-ZAWODOWE-DOKUMENTY.md` | zawody, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:standard-modulu-prawa-krajowego` | `prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:kompletnosc-prawa-krajowego` | `prawo-polskie-v2/krajowe/shared/POLISH-LAW-FINAL-COMPLETENESS-GATE.md` | źródła i bazy, sądy i procedura; pakiet PL (dziś shared/router) |
| `JUR:weryfikacja-przepisow-kanon` | `prawo-polskie-v2/krajowe/shared/PRAWO-HARDGATE.md` | źródła i bazy, akty i przepisy; pakiet PL (dziś shared/router) |
| `JUR:weryfikacja-orzeczen-kanon` | `prawo-polskie-v2/krajowe/shared/PRAWO-HARDGATE-ORZECZENIA.md` | sądy i procedura, źródła i bazy; pakiet PL (dziś shared/router) |
| `JUR:analiza-koszty-terminy` | `prawo-polskie-v2/krajowe/analiza-sadowa-v6/references/koszty-terminy.md` | waluta, akty i przepisy; E3: przenieść do pakietu PL (dziś w skillu wykonawczym) |

Zasady:
- Jeden klucz = jeden moduł. Klucz nie zmienia znaczenia; zmienia się tylko moduł, na który wskazuje.
- Klucz bez wiersza albo moduł, którego nie ma → `⛔ TRYB ZDEGRADOWANY — klucz jurysdykcji nierozwiązany`.
- Przeniesienie treści prawa polskiego ze skilla wykonawczego do modułu jest dopuszczalne
  tylko, gdy każdy przeniesiony wiersz ma odpowiednik w module (test równoważności
  `audyt-systemu-v4/scripts/check_jurysdykcja.py`, T50).

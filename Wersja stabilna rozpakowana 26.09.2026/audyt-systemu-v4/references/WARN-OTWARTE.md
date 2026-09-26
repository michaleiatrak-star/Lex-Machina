# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Stan:** 2026-09-23. Ten plik zawiera wyłącznie zakres pozostający do wykonania. Historia zamknięć i napraw znajduje się w `AUDIT-JOURNAL.md` / `CHANGELOG.md`.

> **Przegląd rejestru 2026-09-23 (ZASADA 10).** Z pliku usunięto 25 bloków flag zamkniętych i wpisów nieaktualnych; treść przeniesiona w całości do `AUDIT-JOURNAL.md`, wpis **AUDYT-2026-09-23**. Rejestr skrócony z 665 do 371 linii. Nic nie zostało skasowane bez przeniesienia.

## Tablica sterująca

| Kategoria | Liczba | Pozycje |
|---|---:|---|
| Wykonalne sesją audytową | 2 | F-167, **F-189** |
| Reaktywne | 1 | F-5 |
| Zależne od środowiska/dewelopera | 16 | **F-194** (tylko CBOSA), F-8, F-9, F-11, F-94, F-113, F-133, F-137, F-143, F-144, **F-157b**, F-158(c), F-171, **F-183a**, **F-184**, **F-185** |
| Odnotowane bez działania | 1 | O-8 (ograniczenie strukturalne aparatu) |
| **Razem** | **20** | — |

> **F-157b (2026-09-13c, ZAWĘŻONA) — braki resztkowe listy dozwolonych.**
> Pomiar T25 (52 sondy) po zmianie konfiguracji: **odblokowane** —
> `wl-api.mf.gov.pl` (biała lista VAT, zmierzona end-to-end, zapis
> „nieosiągalna" usunięty z `DOSTEP-MASZYNOWY-API.md` §4 i z `escalation`
> routera 3.49), `api.dane.gov.pl`, `op.europa.eu`, `www.gov.pl` (odblokowuje
> BIP GIP — F-153), `www.pip.gov.pl`. **Pozostaje poza listą:**
> `api.stat.gov.pl` (REGON/BIR — blokuje F-158c), `orzeczenia.*.so/sa/sr.gov.pl`
> (sieć lokalna Zasady 5A w kanale kodu), `www.sn.pl`, `www.nsa.gov.pl`,
> `www.orzeczenia-nsa.pl`, `szukio.pl`. ⚠️ `rdf-przegladarka.ms.gov.pl` jest już
> na liście, ale oddaje 403 z warstwy ochronnej — to inny problem niż lista.
> ⛔ Ruch NIE jest otwarty w całości: kontrola neutralna (`example.com`,
> `www.wikipedia.org`) → `host_not_allowed`.

> **F-189 (2026-09-16, OTWARTA — przyczyna) — nadpisanie skilli dziedzinowych starszym stanem.**
> Treść 10 skilli odtworzona i wydana (AUDYT-2026-09-16). Pozostaje: (1) ustalić mechanizm
> nadpisania — `shared` i `audyt-systemu-v4` z tych samych sesji przetrwały, więc wydanie
> skilli dziedzinowych szło inną ścieżką; ⛔ **2026-09-16b: co najmniej DWIE fale** (stan
> `dr-09` z 10.09 zaginął przed 13.09; stan 12f–12n — po 12.09) — mechanizm powtarzalny,
> nie jednorazowy; (2) przed każdym wydaniem uruchomić T12 na drzewie docelowym ORAZ
> kontrolę treści „było → jest" (T12 nie widzi utraty bez cofnięcia numeru — przypadek
> `dr-09` 3.29, kolizja numeru w dwóch sesjach). ✅ 2026-09-16c: ta kontrola jest
> automatem — **T30** (`check_utrata_tresci.py`, bloker orkiestratora). Otwarte pozostaje
> wyłącznie ustalenie MECHANIZMU nadpisań (poza repozytorium — proces wgrywania paczek).
> ⚡ **2026-09-17p — obserwacja odwrotna:** w kopii roboczej pojawiły się 3 fragmenty treści,
> których sesja nie zapisała (skrypt przerwał się przed zapisem). Wykryte przez T21 (2 rozjazdy);
> treść zweryfikowana odczytem i zachowana. Pochodzenie nieustalone — ten sam obszar niepewności
> co nadpisania. ✅ **2026-09-17r: zalecenie wdrożone jako T33** (`check_wydanie.py`, w orkiestratorze)
> — kontrola „drzewo ↔ wydana paczka" jest odtąd automatyczna, nie ręczna.

> **F-183a (2026-09-14, OTWARTA — WYŁĄCZNIE środowisko docelowe) — direct
> CBOSA wdrożona strukturalnie; pozostaje pomiar live w docelowym runtime.**
> Historyczny pomiar 2026-09-13b/c (503 na wszystkich ścieżkach w tamtym
> środowisku) pozostaje prawdziwym dowodem dla TAMTEJ sesji, ale nie jest już
> globalnym stanem systemu.
>
> **Naprawa strukturalna 2026-09-14:** `shared/CBOSA-ADAPTER.md` +
> `shared/SYGNATURY.md` V-SYG-0.7 + `shared/DOSTEP-MASZYNOWY-API.md` 1.5
> wprowadzają: fresh-probe → `POST /cbo/search` → cookies → kompletna
> `/cbo/find?p=N` → wszystkie `/doc/{ID}` → exact-match. Implementacja
> referencyjna w `orzeczenia-sadowe-v2/tools/cbosa_parser.py` przeszła
> **22/22 regresje** (drift HTML, zapętlona/niepełna paginacja, duplikaty,
> near-match, przerwany transport, zakres uzasadnienia).
>
> **Skutek:** gdy direct CBOSA jest dostępna, system osiąga
> `FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE` oraz odczyt metryki,
> sentencji i — jeśli opublikowane — uzasadnienia. Gdy direct CBOSA w danym
> runtime nadal nie działa, dopiero wtedy aktywuje się V-SYG-0.5, który
> pozostaje jednostronny i nigdy nie daje NOT_FOUND.
>
> **Co nadal pozostaje do wykonania w F-183a:** kontrolowany live probe w
> docelowym środowisku wdrożeniowym (nie w fixture ani cudzym repo), zapis
> request/response i minimum jeden przypadek pozytywny + jeden bez exact-match.
> Do tego czasu nie wolno reklamować direct CBOSA jako gwarantowanej
> dostępności każdego hosta; wolno twierdzić, że system ma deterministyczny
> adapter i fail-closed fallback.
>
> ⚡ **ZAWĘŻENIE 2026-09-14a (ZASADA 10) — podzakres pomiarowy WYKONANY,
> wynik negatywny.** Przeprowadzono kontrolowany probe w tym runtime:
> 503 na `/`, `/cbo/query`, `/cbo/search`, oba adresy A, porty 80 i 443;
> ciało 121 B to komunikat Envoy o nieudanym połączeniu upstream, więc 503
> pochodzi z warstwy egress, nie z originu; brak `x-deny-reason` wyklucza
> allowlistę; DNS rozwiązuje się poprawnie, co eliminuje DNS jako zmienną;
> `www.nsa.gov.pl` tą samą trasą zwraca 200, co wyklucza blokadę domeny i
> awarię resortową. Stan kanału: `DIRECT_UNAVAILABLE`.
> ⛔ Dodatkowo `web_fetch` na CBOSA → `ROBOTS_DISALLOWED`, a indeks daje
> wyłącznie fragment nawigacyjny bez treści orzeczeń — w tym środowisku NIE
> istnieje fallback snapshotowy, którym dysponują inne hosty.
> **Do wykonania pozostaje wyłącznie przypadek pozytywny** w runtime, w którym
> origin odpowiada; podzakres negatywny jest zamknięty i nie wymaga powtórzenia.
> ⚡ **DOPRECYZOWANIE 2026-09-14b — RETRIEVAL/SNAPSHOT ZMIERZONY W INNYM
> HOŚCIE.** Negatywny pomiar direct powyżej pozostaje prawdziwy dla tamtego
> runtime. Niezależnie od niego inna warstwa retrieval udostępniała oficjalne
> reprezentacje `orzeczenia.nsa.gov.pl/doc/{ID}`. Próba 10 realnych sygnatur
> NSA/WSA: **10/10** snapshotów miało co najmniej metrykę + sentencję, **5/10**
> miało potwierdzalnie pełne uzasadnienie, **2/10** uzasadnienie widoczne bez
> dowodu kompletności, **3/10** metrykę + sentencję bez potwierdzonego końca
> uzasadnienia. To nie jest estymacja pokrycia całego korpusu.
>
> Jednocześnie operator `site:orzeczenia.nsa.gov.pl` w dwóch stosach zwracał
> również obce hosty. Naprawa systemowa: `shared` 3.61 / V-SYG-0.5 wymusza
> POST-CHECK pełnego hostname i ścieżki PRZED exact-match. Snapshot ma jawne
> `access_mode=CRAWLED_OR_INDEXED` oraz `content_scope`; bogactwo treści NIE
> awansuje provenance do `DIRECT_LIVE` ani samo nie daje ✅ [VER]. Brak hitu
> retrieval nadal = OUT_OF_SCOPE, nigdy NOT_FOUND.
>
> **F-183a pozostaje otwarta wyłącznie dla pozytywnego DIRECT_LIVE w runtime
> docelowym.** Dostępność snapshotu jest zdolnością konkretnego hosta i nie
> zastępuje tego kryterium zamknięcia.
>
> **F-184 (2026-09-13, OTWARTA, środowisko) — TK bez kontroli po sygnaturze.**
> `ipo.trybunal.gov.pl/ipo/Szukaj` → 200, ale wyszukiwarka to JSF/PrimeFaces
> z `ViewState`: POST-only, `Sprawa?sygnatura=` nie jest kluczem. Do
> przemierzenia: endpoint autouzupełniania `sygnaturaComplete`. Dziś dla TK
> zostaje SAOS w oknie ≤ 2015-12-09, dalej ⚠️ [NIEWERYFIKOWANE].
>
> **F-185 (2026-09-13, OTWARTA, środowisko) — KIO: `Sign=` nie filtruje.**
> `orzeczenia.uzp.gov.pl` `GET /Home/Search` przyjmuje pola `Sign, Phrase, Dt,
> Fle, SCnt, Art, ThIdx`, ale zmierzone `Sign=KIO 827/18` i `Sign=KIO 99999/18`
> zwracają tę samą stronę (57 635 / 57 637 B — różnica to echo wartości),
> 0 odnośników do wyników. ⛔ Teza materiału wejściowego „znalazłem pole
> sygnatury: Sign" była **znalezieniem pola, nie działającego filtra** —
> nieprzetestowana i nieprawdziwa. Do przemierzenia: czy wyniki dociąga AJAX.

> **KANDYDAT (2026-09-10c, bez numeru) — `shared/HIERARCHIA-ZRODEL.md`, 31,6 kB.**
> Nie należy do rdzenia R-1…R-5, ale wyzwalacz „pierwszy URL w odpowiedzi" pada
> praktycznie zawsze, więc koszt jest bliski bezwarunkowemu. Kandydat na tę samą
> operację co F-180. ⚠️ **Warunek podjęcia:** najpierw pomiar, które sekcje są
> faktycznie warunkowe — bez niego byłaby to czwarta powtórka klasy F-164
> (decyzja na podstawie niezmierzonej tezy). Nie otwierać jako flagi przed
> pomiarem.


> **F-135 OTWARTA — zakres zmniejszony 2026-09-10d.** Osiem znaczników
> „NIEWERYFIKOWANE RZĄD 1" w `ROUTING-MAP.md` rozstrzygniętych w ELI, ustalony
> numer Protokołu nowojorskiego 1967 (Dz.U. 1991 nr 119 poz. 517).
> ⛔ Zweryfikowano **numery, nie treść merytoryczną** — pozostaje cross-check
> wartości prawnych w modułach DR i `shared`, czyli właściwy zakres tej flagi.
> ⚠️ **Następny krok:** wybrać jedną dziedzinę i przejść ją w całości, zamiast
> próbować wszystkich naraz — poprzednie podejścia rozmyły się na szerokości.

> **KANDYDAT (2026-09-10d, bez numeru) — rejestr `scripts:` niekompletny
> w drugą stronę.** T23 wykrył 15 skryptów wywoływanych przez orkiestrator,
> a nieobecnych w polu `scripts:`. T22 tego nie widzi, bo pilnuje kierunku
> rejestr → dysk. Do rozstrzygnięcia, czy rejestr ma być kompletny obustronnie;
> dziś raportowane jako ostrzeżenie, nie FAIL.

> **KANDYDAT (2026-09-10j) — nazwa pliku modułu niezgodna z podstawą prawną.**
> `dr-10/modules/mod-ustawa-diagnostyka-laboratoryjna.md` opiera się teraz na
> ustawie o **medycynie** laboratoryjnej. Przemianowanie pliku dotyka rejestrów
> `modules:` w kilku miejscach — osobna operacja, nie łatka.

> **O-8 ODNOTOWANA BEZ DZIAŁANIA (2026-09-10b) — zestaw regresyjny nie sprawdza
> przesłanek faktycznych.** F-179 (profil LEKKI uzasadniony liczbą, która nie
> opisywała świata) przeszła pełny zestaw T1–T22 bez jednego WARN. Testy pilnują
> rejestrów, wersji, map, sum i kontraktu routera; twierdzenia o świecie leżą
> poza ich zasięgiem i z natury nie da się ich tam wciągnąć.
> ⛔ Konsekwencja do zapamiętania: **zielony zestaw regresyjny dowodzi spójności
> wydania, nie jego sensowności.** Pozycja istnieje po to, żeby ten wniosek nie
> zginął — nie ma przypisanego działania naprawczego i nie powinna go dostać.

> **2 nieprawdziwe** (delegowanie kierowców — 2025/797 jest t.j., nie
> nowelizacją; Prawo o notariacie — t.j. 2026/614 istnieje, a mapa centralna
> nawet go miała, podczas gdy dr-12 twierdził, że go nie ma).
> ⚠️ **Następny krok:** test wg zarysu w AUDYT-2026-09-10i §3. Projekt czułości
> jest niebanalny — rozpoznać *twierdzenie o stanie*, nie każde wystąpienie
> słowa „brak". Objąć całą rodzinę fraz, nie jedną.
> ⛔ Świadomie NIE napisany w sesji 2026-09-10i: to osobna robota, nie łatka.

> **KANDYDAT (2026-09-10h) — nagłówki modułów starzeją się niezauważone.**
> `mod-PrFarm-refundacja-nadzor-sankcje` podawał w nagłówku wygasły tekst
> jednolity ustawy refundacyjnej, a we własnej treści poprawny — moduł przeczył
> sam sobie i żaden test tego nie widział. Nagłówki („aktualne t.j.: …") są
> cytowane rzadziej niż treść, a jako pierwsze wpadają w oko czytającemu.
> ⚠️ **Następny krok:** kontrola porównująca numery Dz.U. z nagłówka modułu
> z numerami w jego treści — rozjazd wewnątrz jednego pliku to trzecia odrębna
> klasa obok podmiany aktu i niedomknięcia.

> **KANDYDAT (2026-09-10f) — znacznik „weryfikuj" pełni w ROUTING-MAP dwie role.**
> Część wystąpień to **zaległości** (numer nierozstrzygnięty), część to **stała
> bramka fresh gate** („re-zweryfikuj przy każdym użyciu"). Bez rozdzielenia
> każdy przegląd liczy te same ~30 wierszy jako otwarte w nieskończoność.
> ⚠️ **Następny krok:** osobny znacznik dla stałego fresh gate, np. 🔄, żeby
> przegląd mógł filtrować wyłącznie zaległości.

> **F-20 (KSR) — potwierdzona jako NIEROZSTRZYGALNA przez ELI (2026-09-10f).**
> Krajowe Standardy Rachunkowości leżą poza Dz.U., w Dzienniku Urzędowym
> Ministra Finansów. Spór o liczbę standardów (14 vs 15) wymaga innego kanału
> niż API ELI — kolejne odczyty nic tu nie wniosą.

> **F-113 — ZMIANA STATUSU 2026-09-17t: ramię A ZBUDOWANE i zweryfikowane**
> (`ci_check_shared` OK, 36 plików posprzątanych; HASH A
> `b3fd18cf…1c69`, HASH B `1b12da7e…1679`). ⛔ Pomiar NIEWYKONANY: protokół wymaga
> promptu bez wiedzy o teście i oceny ślepej, a sesja budująca ramię zna bramki i
> przypisanie ramion — przebieg mierzyłby pamięć sesji. **Wymaga sesji niezależnej;
> ta sama bariera co F-167 (brak niezależnego oceniającego).** Szczegóły przekazania:
> AUDYT-2026-09-17t.
>
> **F-113 — ZMIANA STATUSU 2026-09-10 (nie zamknięcie).** Blokada przestała być
> „brak narzędzia" i jest teraz „pomiar do wykonania". Ustalono, że plan
> z 2026-08-24 nie ruszył nie z powodu wady projektu badania, tylko dlatego, że
> zakładał istnienie ramienia kontrolnego i nie mówił, jak je zbudować.
> Dostarczone: `scripts/build_ramie_kontrolne_f113.py`,
> `references/PROTOKOL-WYKONAWCZY-F113.md` (plan minimum 20 przebiegów, karta
> przebiegu, budżet ~2 sesje robocze).
> ⚠️ **Następny krok:** 20 przebiegów (T1 i T2, po 5 na ramię), ocena ślepa,
> Δ(B1…B5), wpis do dziennika — **także wynik negatywny**. Zamknięcie wymaga
> pomiaru, nie potwierdzenia skuteczności. Wpis: AUDYT-2026-09-10.

> **F-171 ZAWĘŻONA (2026-09-09, pomiar 2026-09-17s) — została JEDNA regresja dostępu.**
> ✅ SAOS wrócił: `/api/search/judgments` (w tym filtr `caseNumber`), `/api/judgments/{id}`
> i `/api/dump/judgments` → HTTP 200 (AUDYT-2026-09-17s). ⛔ `decyzje.uokik.gov.pl` — 503,
> 3/3 próby, bez zmian od 2026-09-09.
> ⛔ **SAOS jest NIESTABILNY** — 5 z 8 wywołań bez odpowiedzi (`000`), po czym 200 w < 1 s;
> V-SYG-0 wymaga powtórzenia próby (min. 3) przed uznaniem sygnatury za niesprawdzalną.
> `sudop.uokik.gov.pl` i `rejestr.uokik.gov.pl` działają, więc awaria UOKiK jest
> punktowa.
> ⚠️ **Następny krok:** POWTÓRZYĆ POMIAR w innym dniu przed jakimkolwiek
> wnioskiem o trwałości. Trzykrotna porażka jednego dnia dowodzi niedostępności
> tego dnia — orzekanie o wygaszeniu bez powtórzenia to klasa błędu F-151/F-162/F-164.
> Dowód: `F-171-pomiar-domen-2026-09-09.md`. Wpis: `AUDIT-JOURNAL.md`, AUDYT-2026-09-09.

> **F-166 NARROWED (nie zamknięta w pełni) 2026-09-05d — przebieg na Sonnecie
> wykonany, wynik częściowo pozytywny, test nie jest czysty.**
>
> ⛔ **Skażenie K-06.** `shared/MOD-CN-GATE.md` cytuje K-06 wprost jako przykład
> wzorcowy (art. II vs III Konwencji o odpowiedzialności). Sonnet, wczytując
> bramkę przed napisaniem odpowiedzi, dostał rozwiązanie wpisane w treść
> narzędzia. K-06 służy odtąd wyłącznie jako kontrola uruchomienia mechanizmu,
> nie jako test wykrycia błędu — usunięty z materiału dowodowego F-166.
>
> ✅ **K-02 — porównanie czyste i udokumentowane w tej samej sesji.** Sonnet bez
> skilli (cytat dosłowny): *„Zachowanie NEXCA należy przypisać Alekostrii ze
> względu na pełną kontrolę korporacyjną i polityczną"* — atrybucja per podmiot,
> dokładnie wzorzec błędu opisany w `MOD-CN-GATE.md` §CN-2. Raport
> AUDYT-2026-09-05 potwierdza, że **oba** stare warianty Sonneta (bez skilli
> i ze skillami sprzed routera 3.40) popełniły ten sam błąd. W tej turze Sonnet,
> z CN-GATE wywołanym zgodnie z Regułą 12b, przeprowadził test trzystopniowy
> (ARSIWA art. 4/5/8 per zachowanie, nie per podmiot) i **odrzucił atrybucję**,
> wskazując brak dowodu na kierowanie trasą pojazdu jako odrębną przesłankę od
> zgody na projekt. To jest jeden udokumentowany przypadek naprawy mechanizmu B
> na tym samym modelu, tej samej sprawie, bez skażenia treścią bramki.
>
> ⚠️ **K-07 — wynik mieszany, nowa obserwacja.** Definicyjne progi Nagoi
> (funkcjonalne jednostki dziedziczności, państwo pochodzenia in situ)
> zastosowane poprawnie. Ale samoocena testowego memorandum (873 słów łącznie
> na trzy kazusy, wobec limitu 2500 słów NA KAZUS) dała niższy wynik niż Opus
> nie z powodu błędnej normy, lecz **cienkiego pokrycia** — obszar DSI
> niedorozwinięty, oś czasu skrócona do jednego zdania. To jest dokładnie
> wzorzec, który REM-4 (budżet pokrycia) ma wychwytywać, i tym razem sam siebie
> potwierdził: krótka odpowiedź testowa ujawniła lukę, którą REM-4 by wykrył,
> gdyby przebieg był pełny, a nie diagnostyczny.
>
> **Dlaczego F-166 NIE jest w pełni zamknięta mimo pozytywnego wyniku na K-02:**
> (a) jeden udokumentowany przypadek to nie dowód systemowy; (b) memoranda
> testowe były celowo skrócone i nie odpowiadają formatowi docelowemu
> (2500 słów/kazus), więc porównanie punktowe z pełnymi odpowiedziami Opusa jest
> nieuprawnione; (c) Sonnet samoocenił własną pracę — słabszy, ale wciąż ten sam
> tryb awarii co przy wszystkich poprzednich zamknięciach w tej serii.
> **Pozostaje do wykonania:** pełny przebieg (format docelowy, ocena przez
> trzeciego oceniającego) na K-02 i K-07 jako jedynych nieskażonych kazusach;
> K-06 wymaga osobnego testu na kazusie NIE cytowanym w treści żadnej bramki.
> Przeniesione z kategorii „zależne od dewelopera" do „wykonalne sesją
> audytową" jako **F-167**, bo część pracy da się wykonać bez zewnętrznej
> interwencji — pełny przebieg na K-02/K-07 i dobór kazusu kontrolnego
> nieobecnego w treści bramek.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-05d.
> Do rejestru żywego nie wchodzi (ZASADA 10).

## Wykonalne sesją audytową

| Flaga | Priorytet | Pozostały zakres | Kryterium zamknięcia |
|---|---|---|---|

## Reaktywne

| Flaga | Zakres | Wyzwalacz |
|---|---|---|
| F-5 | Dedykowany moduł ustawy ESAP (Dz.U. 2026 poz. 644) oraz ustalenie wpływu na KSH. | Pierwsza sprawa z rynku kapitałowego lub nadzoru finansowego. |

## Zależne od środowiska lub dewelopera

| Flaga | Pozostały zakres |
|---|---|
| F-194 | Wyłącznie odczyt NSA I OSK 590/26 z CBOSA (`/doc/{ID}`, V-SYG-0.7) → awans z 🟨 do ✅. Stan 2026-09-22: kanał kodu HTTP 503, web_search bez adresu `/doc/{ID}`. ✅ Wykonane: Zasada 2B `orzeczenia-sadowe-v2` 2.18; ETAP 4A V10 `pisma-procesowe-v3` 5.27 (na drzewie repozytorium). |
| F-8 | Wdrożyć realny connector MCP do ELI/ISAP i zweryfikować protokół w środowisku docelowym. |
| F-9 | Wdrożyć znacznik `AUDIT_EVENT`, parser i politykę retencji w portalu. |
| F-11 | Uruchomić `extract_api_verification_log.py` na prawdziwej odpowiedzi API zawierającej wywołania narzędzi. |
| F-94 | Rozstrzygnąć rejestrację `KONEKTORY-REKOMENDOWANE.md`, status `shared/tools/mcp-servers/` i możliwy duplikat checklisty contradiction-intelligence. |
| F-113 | Potrzebne izolowane manifesty A/B, kontrola sieci T1/T2, autorytatywne logi narzędzi i identyfikator backendu do wykonania mierzalnego testu skuteczności bramek. |
| F-133 | Brak warunków środowiskowych do pomiaru B5-e2 i wpływu reguł routera; zależne od warunków F-113. |
| F-137 | Pozostał test akceptacyjny zapisu wydzielonej sekcji w hoście z natywną pamięcią trwałą. |
| F-143 | Pomiar skuteczności OŚ-GATE (`shared/MOD-OS-CZASU-PRZESLANEK.md`) testem z grupą kontrolną wg `PLAN-TESTU-BRAMEK-F113.md`: ≥10 kazusów w dwóch ramionach, dwa kryteria — (i) czy blok OŚ-GATE faktycznie się pojawił, (ii) w ilu przebiegach zmienił konkluzję. Zakres pozostały obejmuje też dwa niewykonane wpięcia oznaczone ⬛ w §9 modułu: `analiza-sadowa-v6` (przebieg 1) i `analizator-przepisow-v2` (Moduł 3). Do zamknięcia flagi ZAKAZ opisywania modułu jako rozwiązującego problem rozjazdu czasowego. Zależne od tych samych warunków co F-113. |
| F-157 | **Braki resztkowe listy dozwolonych** (następca F-152). ⚡ **Część (a) WYKONANA 2026-09-04b:** reguła kanału kodu — neutralny UA, nagłówek `Accept`, ścieżka zamiast roota — **propagowana do `shared/PRAWO-HARDGATE.md`** (blok „KANAŁ KODU MA WŁASNE WYMOGI") i **`shared/HIERARCHIA-ZRODEL.md` v1.6** (REALIA DOSTĘPNOŚCI), czyli obowiązuje wszystkie skille, nie tylko audyt. ⚡ **Weryfikacja zautomatyzowana:** T25 ma grupę `--grupa kandydaci` (8 sond ze statusem odniesienia `POZA_LISTA`) — po zmianie konfiguracji test sam wypisze sekcję ODBLOKOWANE. **POZOSTAJE do rozstrzygnięcia przez dewelopera (zmierzone 2026-09-04b: wszystkie 8 nadal poza listą):** `api.dane.gov.pl`, **`wl-api.mf.gov.pl` (biała lista VAT — jedyna maszynowa weryfikacja rachunku kontrahenta, dziś nieosiągalna w ogóle)**, `rdf-przegladarka.ms.gov.pl`, `op.europa.eu`, `www.gov.pl` i `www.pip.gov.pl` (bez nich BIP GIP z F-153 jest nieosiągalny), `api.stat.gov.pl`, `orzeczenia.*.so/sa/sr.gov.pl`. Do usunięcia: `websrv.bzp.uzp.gov.pl` + 4 martwe duplikaty npm/crates. Do zostawienia mimo ✖: `legislacja.rcl.gov.pl` (brak zamiennika). Po każdej zmianie: `python3 scripts/check_domeny_allowlist.py --grupa kandydaci`. |
| F-160 | **Zasoby operacyjne zamknięte w skillu narzędziowym — CZĘŚCIOWO ZAMKNIĘTA 2026-09-04c.** Instrukcje „jak wywołać API" (nagłówki, endpointy, tokeny, limity) mieszkały wyłącznie w `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`. ⛔ Sprawdzone: `audyt-systemu-v4` **nie występuje w `dependencies.requires` ŻADNEGO skilla produkcyjnego** — ani `prawny-router-v3`, ani `analiza-sadowa-v6`, `prawo-polskie-v2`, `pisma-procesowe-v3`, `orzeczenia-sadowe-v2`; wszystkie wzmianki to narracyjne cytaty flag. Instrukcje były więc niewidoczne z produkcji. ✅ Utworzony `shared/DOSTEP-MASZYNOWY-API.md` (wyciąg operacyjny, bez duplikacji pomiaru) i dopisany do `required_modules` routera 3.38; escalation routera rozszerzone o bramkę „sprawdź kształt żądania, zanim orzekniesz o niedostępności". ⬛ **POZOSTAJE:** ten sam wzorzec może dotyczyć innych zasobów audytu — przegląd `references/` pod kątem treści operacyjnych uwięzionych poza ścieżką produkcyjną nie został wykonany. Wykonalne sesją audytową. |
| F-158 | **Źródła niepotwierdzone — CZĘŚCIOWO ZAMKNIĘTA 2026-09-04b.** ✅ (a) `orzeczenia.uodo.gov.pl` **ROZSTRZYGNIĘTE**: API istnieje, OpenAPI 3.1 pod `/api-doc/schemas/openapi.yml` (adres wyjęty z bloku SwaggerUIBundle, nie zgadnięty); łańcuch wyszukiwanie → metadane → pełna treść XML zmierzony end-to-end (35 dokumentów w oknie 1Y, dokument jako 118 kB XML). To **jedyny polski organ z udokumentowanym publicznym API do własnych rozstrzygnięć** — dopisane do RZĘDU 2A w `shared/HIERARCHIA-ZRODEL.md`, parametry w §7.6. ⚠️ (b) EUREKA **CZĘŚCIOWO**: baza `/api/public/v1` odczytana z bundle `main.*.js`; pobieranie po ID i katalog 40 metadanych działają, **schemat ciała POST dla `wyszukiwarka/informacje` nierozstrzygnięty** (405 na GET dowodzi istnienia zasobu, 500 na trzech domyślonych ciałach). ⛔ Dalszego zgadywania zaniechano; do ustalenia analizą serwisu wyszukiwarki w bundle albo wnioskiem do MF na podstawie ustawy o otwartych danych. Szczegóły: §7.7. ⬛ (c) `api.stat.gov.pl` (REGON/BIR) — **nadal niezweryfikowane, host poza listą**; zależne od F-157. |

## Zasada map runtime

- `MAPA-AKTOW.md` = aktualny akt → moduł;
- `MAPA-POKRYCIA.md` = aktualny faktyczny poziom pokrycia;
- mapy runtime nie przechowują baseline/delta ani historii dawnych luk;
- historia zmian trafia wyłącznie do `AUDIT-JOURNAL.md` / `CHANGELOG.md`;
- każda konkretna jednostka prawa nadal wymaga fresh gate do źródła urzędowego.

---

> ⛔ **O-12 OTWARTA (2026-09-12e) — kontrola aktualności AKTU nie jest kontrolą
> aktualności WARTOŚCI.** Trzy kolejne sesje wykryły trzy różne mechanizmy, w których
> akt wygląda na w pełni aktualny, a wartość w module jest nieprawdziwa:
>
> | Mechanizm | Przykład | Co wygląda na aktualne |
> |---|---|---|
> | nowe rozporządzenie **uchyla** poprzednie | zryczałtowana równowartość wydatków 300 → **1000 zł** od 1.07.2025 (`Dz.U. 2025 poz. 770`) | ustawa delegująca i jej t.j. |
> | przepis **uchylony**, materia przeniesiona | art. 503 KPC → art. 480² § 2, 480³, 505 § 1 | cały kodeks |
> | **decyzja RPP** zmienia wynik wzoru | wszystkie odsetki ustawowe | akt, przepis i jego brzmienie |
>
> ⛔ KROK 2C szuka **nowelizacji po tekście jednolitym** — żaden z tych trzech
> mechanizmów nowelizacją nie jest.
>
> ✅ **WDROŻONE 2026-09-12f — test T28** (`scripts/check_wartosci_prawne.py`),
> trzy bramki: W1 rejestr znanych błędnych cytatów (FAIL), W2 procent utrwalony
> przy pojęciu odsetek (FAIL), W3 wiersz kwotowy bez podstawy (WARN).
> Pierwszy przebieg: 410 plików, 31 trafień FAIL, **8 realnych nienaprawionych
> usterek**, których trzy poprzednie sesje ręcznego przeglądu nie znalazły.
> Po naprawie — czysto. Opis i ograniczenia: `REGRESSION-TEST-PLAN.md`, sekcja T28.
>
> ⚠️ **Odrzucony kandydat, jawnie:** reguła generyczna „indeks górny przy numerze
> artykułu = FAIL" **nie została wdrożona** — dawałaby fałszywe alarmy na
> legalnych jednostkach `art. 205¹`, `art. 398⁵`, `art. 477⁹` KPC. Zastąpiona
> rejestrem konkretnych, zweryfikowanych pozycji.
>
> ⛔ **ZOSTAJE z O-12:** rejestr W1 wykrywa **nawrót znanego** błędu, nie nową
> usterkę tej samej klasy. Domknięcie wymagałoby porównania cytatu z treścią aktu
> przez API ELI — to zadanie innego rzędu niż test offline i nie ma dziś
> wykonalnej postaci.
>
> ⚠️ **Poprzedni zapis kandydatów, zachowany dla ścieżki decyzyjnej:**
> (a) wiersz kwotowy w tabeli **bez kolumny podstawy** → WARN;
> (b) indeks górny przy numerze artykułu tam, gdzie ustawa używa `§`
> (wzorzec `328¹`) → **FAIL** — ten błąd naprawiano trzykrotnie i sześciokrotnie
> przetrwał, więc WARN mu nie wystarcza;
> (c) **procent zapisany obok pojęcia „odsetki ustawowe"** gdziekolwiek w korpusie
> → FAIL, bo tej wartości z definicji nie da się utrwalić poprawnie.
>
> ⚠️ **MON-3 do rozszerzenia:** opisuje rytm **roczny** (obwieszczenia
> waloryzacyjne), a odsetki zmieniają się w rytmie **posiedzeń RPP**.

---

> ⛔ **MON-4 OTWARTA (2026-09-12f) — monitoring wartości w rytmie NIE-rocznym.**
> Rozszerzenie zakresu monitoringu, **nie zastąpienie MON-3**. MON-3 zostaje bez
> zmian i obsługuje rytm **roczny**: obwieszczenia waloryzacyjne, podatki
> i opłaty lokalne, okno październik–grudzień. Nie obejmuje wartości, które
> zmieniają się częściej i z innego powodu.
>
> | Zakres | Rytm | Metoda |
> |---|---|---|
> | **stopa referencyjna NBP** → odsetki ustawowe (art. 359 § 2, 481 § 2 KC), handlowe (art. 4 pkt 3 u.p.n.o.) | **posiedzenia RPP** (ok. 11 w roku) | obwieszczenie MS i ministra gospodarki w **Monitorze Polskim** |
> | **stopa lombardowa NBP** → odsetki za zwłokę (art. 56 § 1 OP), pośrednio ZUS (art. 23 ust. 1 SUS) | jw. | jw.; ⛔ pamiętać o podłodze 8 % |
> | **kwoty z rozporządzeń wykonawczych** | bez cyklu — akt uchylający może wejść w dowolnym momencie | sprawdzać status **rozporządzenia**, nie ustawy delegującej |
>
> ⛔ **Dlaczego to osobna pozycja, a nie akapit w MON-3.** MON-3 opisuje rytm
> kalendarzowy i mówi „sprawdzać w oknie X–XII". Dla odsetek to okno jest
> bezużyteczne — stopa zmienia się w marcu, w maju, kiedykolwiek. Wpisanie tego
> do MON-3 zepsułoby jego protokół i tak samo nie dałoby pokrycia.
>
> ⚠️ **Częściowo zneutralizowane przez doktrynę, nie przez monitoring.**
> `shared/TABELE-OPLAT.md` sekcja 4 zapisuje te wartości jako **formułę**, nie
> procent, a T28/W2 tego pilnuje. Dopóki reguła jest trzymana, zmiana stopy NBP
> **nie dezaktualizuje modułu** — dezaktualizuje odpowiedź, jeżeli ktoś podstawi
> liczbę z pamięci. MON-4 jest więc zabezpieczeniem drugiej linii.
>
> **Co robić przy trafieniu:** zmiana samej stopy → **żadnej flagi F-**, bo moduły
> nie trzymają wyniku. Flagę otwierać wyłącznie, gdy zmieni się **wzór albo liczba
> punktów procentowych w ustawie** (to nowelizacja, więc złapie ją MON-1) albo gdy
> T28/W2 zgłosi utrwalony procent, co oznacza złamanie doktryny sekcji 4.


---

> ⚠️ **NIESPÓJNOŚCI REJESTRU — wykryte przy przeglądzie 2026-09-23, do rozstrzygnięcia.**
> Pozycje poniżej są otwartym zakresem rejestru, nie flagami merytorycznymi. Numerów F- im nie nadano — nadanie jest decyzją dewelopera.
>
> 1. **Tablica sterująca nie zgadza się z tabelami sekcyjnymi.** Tablica wykazuje w kategorii „zależne" 16 pozycji, w tym F-144, F-157b, F-171, F-183a, F-184, F-185; tabela sekcyjna ma 12 wierszy i zawiera F-160, którego tablica nie wymienia. Do rozstrzygnięcia: który z dwóch zapisów jest źródłem prawdy, a który widokiem.
> 2. **Sekcja „Wykonalne sesją audytową" ma pustą tabelę**, mimo że tablica sterująca wykazuje w tej kategorii F-167 i F-189.
> 3. **Osierocony fragment „2 nieprawdziwe (delegowanie kierowców…)"** — akapit bez nagłówka flagi, oderwany od swojego bloku przy którejś wcześniejszej edycji. Kontekst: AUDYT-2026-09-10i §3.
> 4. **F-20 (KSR) nie występuje w żadnej kategorii tablicy.** Opis mówi, że rzecz jest nierozstrzygalna kanałem ELI, więc albo jest to zamknięcie i pozycja idzie do dziennika, albo jest to „odnotowane bez działania" obok O-8 — dziś nie jest ani jednym, ani drugim.
> 5. **Brak kryterium zamknięcia przy większości pozycji „zależnych".** Bez niego pozycja nie może zostać zamknięta inaczej niż uznaniowo, a rejestr rośnie monotonicznie.

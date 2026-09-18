# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Stan:** 2026-09-17u. Ten plik zawiera wyłącznie zakres pozostający do wykonania. Historia zamknięć i napraw znajduje się w `AUDIT-JOURNAL.md` / `CHANGELOG.md`.

## Tablica sterująca

| Kategoria | Liczba | Pozycje |
|---|---:|---|
| Wykonalne sesją audytową | 2 | F-167, **F-189** |
| Reaktywne | 1 | F-5 |
| Zależne od środowiska/dewelopera | 15 | F-8, F-9, F-11, F-94, F-113, F-133, F-137, F-143, F-144, **F-157b**, F-158(c), F-171, **F-183a**, **F-184**, **F-185** |

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
>
> **F-186a ZAMKNIĘTA 2026-09-13c** — ścieżka HUDOC `/app/query/results` zwraca
> 404 (zapis z v1.0 nieprawdziwy); działa `/app/conversion/docx/html/body?
> library=ECHR&id={itemid}` → pełny tekst. Wyszukiwanie po frazie w HUDOC
> pozostaje nierozstrzygnięte, ale nie jako otwarta flaga — jako znany brak.
| Odnotowane bez działania | 1 | O-8 (ograniczenie strukturalne aparatu) |
| **Razem** | **19** | — |

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
>
> F-190 ZAMKNIĘTA 2026-09-16c — trzy luki uzupełnione z odczytu treści (AUDYT-2026-09-16c).

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

> **F-180 / O-5 / O-6 ZAMKNIĘTE 2026-09-10c** — skrócenie rdzenia HARD GATE
> o 30% przez wydzielenie gałęzi warunkowych, preflight kompletności korzenia
> w zestawie regresyjnym, pozycja `[STAN-ZAŁADOWANY]` w SELF-CHECK routera.
> Do rejestru żywego nie wchodzą (ZASADA 10). Szczegóły: AUDYT-2026-09-10c.

> **KANDYDAT (2026-09-10c, bez numeru) — `shared/HIERARCHIA-ZRODEL.md`, 31,6 kB.**
> Nie należy do rdzenia R-1…R-5, ale wyzwalacz „pierwszy URL w odpowiedzi" pada
> praktycznie zawsze, więc koszt jest bliski bezwarunkowemu. Kandydat na tę samą
> operację co F-180. ⚠️ **Warunek podjęcia:** najpierw pomiar, które sekcje są
> faktycznie warunkowe — bez niego byłaby to czwarta powtórka klasy F-164
> (decyzja na podstawie niezmierzonej tezy). Nie otwierać jako flagi przed
> pomiarem.

> **F-141 / F-148 / F-160 / O-4 ZAMKNIĘTE 2026-09-10d.** Szczegóły:
> AUDYT-2026-09-10d. ⛔ Przy F-148 wykryto **dwa realne błędy podmiany aktu**
> (`ROUTING-MAP.md:770` i `dr-08/.../mod-ustawa-zarzadzanie-kryzysowe.md`) —
> oba miały status ✅ OK i przechodziły każdą dotychczasową kontrolę.
> Do rejestru żywego nie wchodzą (ZASADA 10).

> **O-10 ZAMKNIĘTA 2026-09-10r.** T27 pyta też o normy **przedwczesne** —
> numer podany jako aktualna podstawa, którego `entryIntoForce` jest
> w przyszłości. Dwie osobne kategorie w raporcie: „w vacatio legis jako
> podstawa" i „w wyliczeniu zmian, bez cezury". Korpus: PASS w obu klasach.
> ⛔ Przy okazji wykryty własny błąd testu — cezura dopasowywana do wycinka
> 150 znaków, a w wierszach map stoi dalej. Do rejestru żywego nie wchodzi
> (ZASADA 10). Szczegóły: AUDYT-2026-09-10r.


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

> **KANDYDAT ZAMKNIĘTY 2026-09-10j — i okazał się czymś innym.** Przemianowanie
> wiersza „ustawa o diagnostyce laboratoryjnej" ujawniło **dwie podmiany aktu**
> (`2022/2162` i `2023/1517`), z czego druga powielona w ośmiu generacjach mapy.
> Alias wycofany. ⚠️ Reguła przeglądu zapisana w `ALIASY-NAZW-AKTOW.md`:
> adnotacja „nazwa nieaktualna" jest **sygnałem, nie rozstrzygnięciem** — zwykle
> znaczy, że dopasowano numer do nazwy, a nie nazwę do numeru.

> **KANDYDAT (2026-09-10j) — nazwa pliku modułu niezgodna z podstawą prawną.**
> `dr-10/modules/mod-ustawa-diagnostyka-laboratoryjna.md` opiera się teraz na
> ustawie o **medycynie** laboratoryjnej. Przemianowanie pliku dotyka rejestrów
> `modules:` w kilku miejscach — osobna operacja, nie łatka.

> ✅✅ **O-11 ZAMKNIĘTA W CAŁOŚCI 2026-09-16e** — (b) T32, (c) klasa ZASTĄPIONY_TJ w T27, (d) moduł
> opłaty skarbowej. Opis historyczny poniżej zostaje do czasu przeglądu rejestru (ZASADA 10).
>
> **O-11 (historia, 2026-09-10s) — nikt nie pyta, czy LICZBA odpowiada przepisowi.**
> Cały aparat (T3, T11, T15, T24, T27) pyta o **akty**: czy numer istnieje, czy
> opisuje ten akt, czy akt żyje, czy już obowiązuje. ⛔ Żaden nie pyta, czy kwota,
> termin albo próg podany w module odpowiada **treści przepisu**.
> Zmierzony przypadek: `orka-bas` podawał minimalne wynagrodzenie 2026 jako
> „~4 750 zł", a rozporządzenie mówi **4806 zł** — kwota służyła do przeliczenia
> krotności progu, więc przybliżenie propagowało się na wynik.
> ⚠️ **Następny krok:** to NIE jest kolejny test tej samej rodziny. Weryfikacja
> wymaga **odczytu treści aktu** i porównania z liczbą w zdaniu — zadanie innego
> rzędu niż odczyt metadanych.
> ✅ **Pomiar dla rodziny „opłaty sądowe" WYKONANY 2026-09-12** (AUDYT-2026-09-12):
> 4 pliki satelickie, ~72 wiersze kwotowe, trafność poniżej 80 % — 6 kwot
> błędnych, 4 podstawy niewłaściwe, 3 normy nieistniejące, 1 podstawa fałszywa
> powtórzona w 3 plikach. Wszystkie naprawione; rejestr tabel satelickich
> założony w `shared/TABELE-OPLAT.md` sekcja 7.
> ✅ **Rodzina „opłaty" ZAMKNIĘTA CO DO ZAKRESU 2026-09-12c** (AUDYT-2026-09-12c):
> komornicze, skarbowe, notarialne, wieczystoksięgowe, KIO i koszty procesu
> karnego mają akt ustanawiający, jednostkę redakcyjną i datę odczytu.
> ✅ **Rodzina „terminy procesowe" ZMIERZONA I NAPRAWIONA 2026-09-12d**
> (AUDYT-2026-09-12d): 6 plików odsyłało do **uchylonego art. 503 KPC**, 3 podawały
> błędny termin zarzutów od nakazu nakazowego (jest MIESIĄC, art. 480² § 2 pkt 3),
> 3 błędne jednostki w rodzinie wykroczeniowej, 3 żywe wystąpienia nieistniejącej
> jednostki „art. 328¹ KPC" (szósty raz w systemie).
> ✅✅ **RODZINA „WARTOŚCI POWTARZALNE" ZAMKNIĘTA 2026-09-12e** (AUDYT-2026-09-12e):
> odsetki cywilne i handlowe, odsetki podatkowe i ZUS, stopy składek, skala PIT —
> wszystko z odczytu treści, z doktryną „formuła zamiast procentu". Korpus nie miał
> tu błędów, bo **nie miał tych wartości w ogóle** — była to luka, nie usterka.
>
> ✅✅ **RODZINA TERMINY ZAMKNIĘTA CO DO REŻIMÓW 2026-09-12m** — jedenaście
> kodeksów w siedmiu sesjach (12d, 12g–12m), `shared/terminy.md` 88 → 489 linii:
> KPC, KPK, KPW, KPA, PPSA, UPEA, Ordynacja, KKW, KRO, PrUp/PrRestr, KSH.
> ⛔ **Zamknięta co do REŻIMÓW, nie co do POZYCJI** — w każdym kodeksie
> przerobiono terminy najczęściej używane. Otwarte: KC poza art. 118, KP poza
> art. 264, KKS, prawo spadkowe proceduralne, terminy z ustaw szczególnych
> (RODO, KSC, PZP).
>
> ⭐ **Cztery postacie usterki terminowej** (wniosek z AUDYT-2026-09-12m):
> (1) błędna liczba przy poprawnym cytacie — ⛔ **niewykrywalna testem**, bo
> „3 lata" i „6 miesięcy" występują legalnie wszędzie;
> (2) błędny albo uchylony cytat — **jedyna postać, którą T28 łapie**;
> (3) poprawna liczba, zła konstrukcja — karencja (KKW), termin końcowy (UPEA),
> domniemanie i podstawa niewypłacalności (PrUp);
> (4) usterka przez pominięcie — brak adresata (PrUp), brak trzech z czterech
> reżimów (KSH), brak całego kodeksu (KKW, KPA, PPSA).
> ⛔ Przez **cztery ostatnie sesje nie dopisano do rejestru W1 ani jednej
> pozycji** — usterki były postaci 1, 3 i 4. To trwałe ograniczenie zapory
> regresyjnej w tej rodzinie; usunęłoby je wyłącznie porównanie cytatu z treścią
> aktu przez API, czyli zadanie z O-12 bez wykonalnej dziś postaci.
>
> ⛔⛔ **O-11 ZAMKNIĘTA 2026-09-12e.** Trzy rodziny zmierzone: opłaty, terminy,
> wartości powtarzalne. W jej miejsce otwarta **O-12** (niżej).
> ⛔ **ZOSTAJE z O-11 wyłącznie:** (b) decyzja, czy rejestr tabel
> satelickich da się egzekwować testem (kandydat: wiersz kwotowy w tabeli bez
> kolumny podstawy = WARN), czy pozostaje kontrolą ręczną; (c) ⛔ **rozszerzenie
> T27 o wartości z ROZPORZĄDZEŃ WYKONAWCZYCH** — KROK 2C szuka nowelizacji po
> t.j. aktu bazowego i jest ślepy na wypadek, w którym nowe rozporządzenie
> **uchyla** poprzednie, a ustawa pozostaje nietknięta (zmierzony przypadek:
> zryczałtowana równowartość wydatków z art. 621 § 2 KPK, 300 zł → 1000 zł od
> 1.07.2025, `Dz.U. 2025 poz. 770`). ✅ (d) moduł opłaty skarbowej — ZAMKNIĘTE
> 2026-09-16d (`dr-06/mod-ustawa-oplata-skarbowa`).

> **O-8 ODNOTOWANA BEZ DZIAŁANIA (2026-09-10b) — zestaw regresyjny nie sprawdza
> przesłanek faktycznych.** F-179 (profil LEKKI uzasadniony liczbą, która nie
> opisywała świata) przeszła pełny zestaw T1–T22 bez jednego WARN. Testy pilnują
> rejestrów, wersji, map, sum i kontraktu routera; twierdzenia o świecie leżą
> poza ich zasięgiem i z natury nie da się ich tam wciągnąć.
> ⛔ Konsekwencja do zapamiętania: **zielony zestaw regresyjny dowodzi spójności
> wydania, nie jego sensowności.** Pozycja istnieje po to, żeby ten wniosek nie
> zginął — nie ma przypisanego działania naprawczego i nie powinna go dostać.

> **F-179 ZAMKNIĘTA 2026-09-10b — korekta fałszywej przesłanki profilu LEKKIEGO.**
> Czwarte wystąpienie klasy F-164. Do rejestru żywego nie wchodzi (ZASADA 10).
> Szczegóły: AUDYT-2026-09-10b.

> **O-7 ZAMKNIĘTA 2026-09-10b — `.github/workflows/regresja.yml`.** Zestaw
> regresyjny jest odtąd bramką wydania. Do rejestru żywego nie wchodzi.


> **O-9 i F-181 ZAMKNIĘTE 2026-09-10p.** Test **T27**
> (`check_status_podstaw.py`) pyta, czy numer Dz.U. podany w prozie jako
> aktualna podstawa opisuje akt obowiązujący — luka, na którą T3, T11, T15 i T24
> są ślepe z konstrukcji. F-181: 61/61 miejsc naprawionych **i** automat, który
> pilnuje, żeby nie wróciły. ⛔ Test raportuje „DO PRZEGLĄDU", nie FAIL, bo
> heurystyka tego badania dwukrotnie zawyżyła wynik. Do rejestru żywego nie
> wchodzą (ZASADA 10). Szczegóły: AUDYT-2026-09-10p.


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

> **O-5 OTWARTA (2026-09-10) — zestaw regresyjny zakłada jeden korzeń.**
> Na hoście rozdzielającym skille na dwa punkty montowania T3 i T11 (oba
> KRYTYCZNE) dają FAIL z `KeyError: 'prawo-polskie-v2'`, nieodróżnialny
> w wyjściu od realnego braku skilla. ⚠️ **Następny krok:** `--repo-root`
> wielokrotny albo komunikat rozróżniający „brak skilla" od „skill poza tym
> korzeniem".

> **O-6 OTWARTA (2026-09-10) — stan hosta może być starszy niż repozytorium.**
> Zewnętrzna ocena z 2026-09-09/10 prowadzona na kopii sesyjnej z routerem 3.41
> zgłosiła jako usterkę systemu lukę, która w repozytorium (3.42) nie istniała.
> Klasa błędu jak F-151: wniosek z jednego nośnika bez sprawdzenia drugiego.
> ⚠️ **Następny krok:** kontrola wejściowa porównująca `version:` routera
> wczytanego przez hosta z wersją w repozytorium, przed przyjęciem wniosku
> o „luce w systemie". Kandydat na pozycję w SELF-CHECK albo na test T-nowy.

> **O-7 OTWARTA (2026-09-10) — zestaw regresyjny nie jest warunkiem wydania.**
> F-178 (router 3.42 wydany z T17 na FAIL) powstała nie dlatego, że testu
> zabrakło, tylko dlatego, że jego wynik nie został odczytany przed wydaniem.
> ⚠️ **Następny krok:** `run_regression_suite.py` jako GitHub Action na push
> do kanału rozwojowego — orkiestrator jest gotowy, brakuje ~20 linii YAML.

> **F-175 / F-176 / F-177 / F-178 ZAMKNIĘTE 2026-09-10** — profil LEKKI + rejestr
> konektorów POZIOM A, warstwa wykonawcza F-113, podbicie `raport-klienta-v1`.
> Do rejestru żywego nie wchodzą (ZASADA 10). Szczegóły: AUDYT-2026-09-10.

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

> **F-172 ZAMKNIĘTA 2026-09-09b — 20 pozycji T11 zweryfikowanych w RZĘDZIE 1
> i wprowadzonych do mapy.** 11 numerów unikalnych sprawdzonych w API ELI:
> 10 wierszy w tabeli głównej nowej generacji `mapa_dzu_2026-09-09.md`,
> 1 (2026/1123, wejście 1.01.2028) w MONITORING, 3 wiersze dotychczasowe
> przestawione na `PREV` po ujawnieniu nowszych t.j. Sygnał T15 o 2023/1285
> potwierdzony jako fałszywy alarm parsera. T11 zielony.
> Do rejestru żywego nie wchodzi (ZASADA 10).
> ⚠️ **Pozostawiony ślad do przyszłej sesji:** heurystyka T15 czyta akt
> pierwotny wymieniony obok t.j. jako deklarację t.j. — kandydat na zawężenie
> przy najbliższej edycji tego testu, nie usterka mapy.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-09b.

> **F-169 ZAMKNIĘTA 2026-09-09 — router 3.42: historia w lokalizacji
> kanonicznej, T17 mierzy korpus.** Do rejestru żywego nie wchodzi (ZASADA 10).
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-09.

> **F-170 ZAMKNIĘTA 2026-09-09 — T21 normalizuje prefiks `./`.** 307 z 308
> zgłoszeń było artefaktem konwencji generowania sum; szum ukrywał jedyny realny
> rozjazd (`AUDIT-JOURNAL.md` bez przeliczonej sumy). Do rejestru żywego nie
> wchodzi (ZASADA 10). Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-09.

> **F-168 ZAMKNIĘTA 2026-09-05e — przykłady wzorcowe zastąpione regułami
> uniwersalnymi.** Wyzwalacz: użytkownik zażądał wprost, po tym jak test
> F-166/F-167 wykazał, że `shared/MOD-CN-GATE.md` cytował kazus testowy jako
> przykład wzorcowy, dając rozwiązanie wpisane w treść narzędzia. Przepisano
> `shared/MOD-CN-GATE.md` (1.0→2.0), `shared/MOD-REM-GATE.md` (1.1→1.2),
> `shared/MIEDZYNARODOWE-GATES.md` (1.0→1.1) oraz poprawiono indeks
> `shared/SKILL.md` i własny changelog routera (3.39→3.41) — wszystkie
> zawierały tę samą klasę przecieku. Wszystkie pary akt+artykuł+rozstrzygnięcie
> odpowiadające fabule siedmiu kazusów testowych zastąpiono klasami wzorców
> strukturalnych (np. „nowelizacja o ograniczonym skutku podmiotowym",
> „przepisy-bliźniaki o różnym reżimie dla różnego miejsca/przedmiotu",
> „definicja czasu teraźniejszego wykluczająca przedmiot, który już nie
> istnieje", „wyłączenie definicyjne in fine") — bez wskazania, który akt,
> artykuł i która strona sporu akurat pasuje.
> **Rozróżnienie zastosowane:** doktryna ogólna (KWPT art. 31–33 jako metoda
> wykładni, trzystopniowy test atrybucji państwa, zasada względnej
> skuteczności traktatów) POZOSTAŁA nazwana wprost — to są narzędzia pracy
> możliwe do zastosowania w dowolnej sprawie, nie odpowiedzi na pytanie
> egzaminacyjne. Usunięto wyłącznie te fragmenty, które łączyły KONKRETNY
> akt i artykuł z KONKRETNYM rozstrzygnięciem pasującym do jednego z siedmiu
> kazusów w bazie.
> ⚠️ **Test regresji nieprzeprowadzony w tej turze.** Nie sprawdzono, czy
> wersja 2.0/1.2/1.1 nadal skutecznie wymusza wykrycie tych samych klas
> błędów (np. mylenie reżimu odpowiedzialności bliźniaczych przepisów) przy
> braku nazwanego przykładu — to jest właściwy, czysty test na przyszłość dla
> F-167 (kazus kontrolny nieobecny w treści żadnej bramki).
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-05e.
> Do rejestru żywego nie wchodzi (ZASADA 10).

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

> **F-159 ZAMKNIĘTA 2026-09-04c — bramka dodana, nie tylko objaw naprawiony.**
> `prawny-router-v3` **dwa razy pod rząd** nie ładował się na hoście przez zły
> YAML we własnym frontmatterze: 3.37/F-146 (niesparowany cudzysłów w polu
> `changelog`) i 3.38 (element `escalation` z `": "` w linii kontynuacji →
> `ScannerError`, linia 50). Za każdym razem naprawiano OBJAW. ⛔ Przyczyna
> wspólna, przeoczona dwukrotnie: **żaden skrypt w pakiecie nie używał PyYAML** —
> T22 jawnie deklaruje „bez PyYAML" i sprawdza, czy frontmatter da się
> WYODRĘBNIĆ, nie czy da się PRZECZYTAĆ. Ta sama klasa ślepoty co F-130, F-145
> i F-147: bramka istnieje, ale mierzy sąsiedni fakt.
> Dodany **T26** (`check_frontmatter_yaml.py`, selftest 10/10); przebieg na
> 32 zainstalowanych skillach: **31 czystych**, jedyna usterka to naprawiany
> router. Wykrywa też ciche zniekształcenie typu — `- opcjonalnie: X` parsuje
> się bez błędu jako MAPA, nie tekst. Do rejestru żywego nie wchodzi (ZASADA 10).

> **F-152 ZAMKNIĘTA 2026-09-04.** Deweloper wdrożył rekomendację z
> `PORTALE-ORZECZNICZE-API.md` §6 — domeny warstwy orzeczniczej, rejestrowej
> i zamówieniowej są na liście dozwolonych. Pomiar odtwarzalny (**T25**,
> `scripts/check_domeny_allowlist.py`, 40 sond): **32 ✅ · 4 ⛔ · 3 ✖ · 1 ⚠️**,
> 40/40 zgodnych ze stanem odniesienia, 0 regresji, selftest 15/15.
> ⛔ **Ustalenie ważniejsze od samego zamknięcia:** dwie pozycje raportowały się
> jako awaria portalu, będąc awarią NASZEGO żądania — `orzeczenia.ms.gov.pl`
> (200 pod `curl/8.5.0`, 502 pod UA przeglądarkowym, 5/5) i SAOS (200 z JSON-em
> vs 200 ze stroną „Przerwa techniczna", ten sam podział). Reszta zakresu
> rozdzielona na F-157 (kształt żądania + braki resztkowe listy) i F-158
> (źródła niepotwierdzone). Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-04.
> Do rejestru żywego nie wchodzi (ZASADA 10).

> **F-146 i F-149 ZAMKNIĘTE 2026-09-01b.** F-146: 202 rozjazdy sum rozliczone
> (93 wpisy uzupełnione, 4 wpisy bez pliku rozstrzygnięte jako martwe po
> udokumentowanych przeniesieniach, 105 sum odświeżonych po kontroli
> integralności 198 plików bez śladów utraty); T21 na całym repo PASS. F-149:
> trzy błędne numery Dz.U. wykryte testem T15 na żywym ELI, skorygowane
> i rozpropagowane przez 12 lokalizacji. Szczegóły: `AUDIT-JOURNAL.md`,
> wpis AUDYT-2026-09-01b. Do rejestru żywego nie wchodzą (ZASADA 10).

> **F-156 ZAMKNIĘTA 2026-09-01j.** Rozstrzygnięto spór „oznaczać ręcznie
> vs test" na rzecz **testu** — nowy `scripts/check_nowelizacje_po_tj.py` (T24)
> liczy pozycje map, których t.j. nie zawiera już ogłoszonych nowelizacji,
> jako unię sekcji ELI i metody datowej (F-155), importując logikę z
> `check_wyjatek_gate_eli.py`. Argument rozstrzygający zmierzono, nie założono:
> liczby wpisane do DR-08 dzień wcześniej JUŻ się rozjechały (planowanie
> przestrzenne 2→3, zabytki 3→5, drogi 1→2). Adnotacje liczbowe usunięto
> z mapy DR-08 na rzecz bezliczbowego „⚠️ nowelizacje po t.j. → T24".
> Selftest 7/7 offline z mutacją negatywną; przebieg sieciowy na DR-08:
> 10 pozycji z 21. Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-01j.

> **F-156 ZAMKNIĘTA 2026-09-01j.** Rozstrzygnięcie: **test, nie oznaczanie
> ręczne.** Wpisanie liczby nowelizacji do 15 map odrzucone — liczba rośnie
> z każdą publikacją Dz.U., więc zestarzałaby się w tygodniach i mapa
> kłamałaby z większą pewnością siebie niż dziś, gdy nic nie twierdzi (klasa
> błędu F-82). Wdrożono **T24** (`scripts/check_nowelizacje_po_tj.py`): liczy
> pozycje przy każdym uruchomieniu, źródłem jest unia sekcji ELI i metody
> datowej (F-155), logika IMPORTOWANA z `check_wyjatek_gate_eli.py`, nie
> kopiowana. Przebieg 2026-09-01j: 251 numerów, **139 pozycji WARN**,
> 0 problemów statusu. Selftest 9/9 offline. Test stoi poza orkiestratorem,
> bo wymaga sieci — tak jak T15 i sieciowe warianty T20/T21.
> ⛔ Przy pierwszym pełnym przebiegu T24 zgłosił trzy fałszywe alarmy na
> adnotacji „(akt pierwotny: Dz.U. …)", którą sam wprowadziłem dzień wcześniej
> przy naprawie F-155 — poprawione, z dwoma przypadkami w selfteście.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-01j.

> **F-155 ZAMKNIĘTA 2026-09-01i.** Pierwszy zakres: sekcja „Nowelizacje po
> tekście jednolitym" z ELI porównana z metodą datową na 19 aktach — 16 zgodnych,
> 3 przypadki, w których sekcja jest WŁAŚCIWYM PODZBIOREM (brak czterech ustaw
> zmieniających, wszystkich obowiązujących, w tym jednej od ośmiu miesięcy),
> 0 rozbieżności odwrotnych. Wniosek: sekcja NIE zastępuje metody datowej —
> `check_wyjatek_gate_eli.py` bierze unię obu źródeł z jawną proweniencją
> (`DATA+API` / `DATA` / `API`), selftest 23/23 → 27/27 z mutacją negatywną.
> Drugi zakres: przegląd wszystkich 16 map w żywym ELI — 251 numerów, 248
> obowiązujących, **zero nieaktualnych t.j.**, trzy pozycje wskazujące akt bazowy
> zamiast t.j. (dr-04 ×2, dr-10 ×1) POPRAWIONE. Pozostałość — 139 pozycji
> z nowelizacjami po t.j. — wydzielona jako **F-156**.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-01i.

> **F-153 i F-154 ZAMKNIĘTE 2026-09-01g.** F-153: rozstrzygnięto spór
> scalanie-vs-STOP na rzecz **STOP** — `check_wyjatek_gate_eli.py` przerywa
> zamiatanie (kod 6), gdy rejestr ELI pokazuje nowelizacje ogłoszone po dacie
> t.j., i wskazuje dwa świadome wyjścia (`--mimo-nowelizacji` albo zamiatanie
> tekstu aktu zmieniającego). Scalanie odrzucono: wytworzyłoby brzmienie,
> którego żaden publikator nie ogłasza. Trzy przypadki selftestu z mutacją
> negatywną; zweryfikowane na żywym ELI (ustawa o PIP — 6 nowelizacji po t.j.,
> STOP; KC — brak, przebieg bez zmian). F-154: publikator aktów prawa
> miejscowego wpięty w DR-08 i DR-09, ścieżka odczytu opisana jako B-L
> w `PRAWO-HARDGATE.md`. Przy okazji naprawiono błąd adresu: DR-08 w sześciu
> plikach wskazywał `dzienniki.gov.pl` zamiast `dziennikiurzedowe.gov.pl`.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-01g.

> **F-150 i F-151 ZAMKNIĘTE 2026-09-01c** w sesji, w której powstały. F-150:
> cztery usterki gałęzi sieciowej `check_wyjatek_gate_eli.py` (odczyt tekstu
> ogłoszonego zamiast t.j., mylący komunikat przy `textHTML: false`, parser S3
> niezgodny z kształtem żywego ELI, fałszywe nagłówki z prozy) naprawione
> i pokryte pięcioma nowymi przypadkami selftestu (17/17 PASS) oraz przebiegiem
> na żywym API. F-151: rozjazd między zapisem „ROBOTS_DISALLOWED" a stanem
> faktycznym skorygowany w `PRAWO-HARDGATE.md` i `HIERARCHIA-ZRODEL.md`.
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-09-01c. Do rejestru żywego
> nie wchodzą (ZASADA 10).

> **F-147 ZAMKNIĘTA 2026-09-01** w sesji, w której powstała — pięć usterek
> naprawionych i zweryfikowanych ponownym przebiegiem, przyczyna źródłowa objęta
> nowym testem T22 z mutacją negatywną. Szczegóły: `AUDIT-JOURNAL.md`,
> wpis AUDYT-2026-09-01. Do rejestru żywego nie wchodzi (ZASADA 10 — tylko otwarte).

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

> F-OP-2026-09 ZAMKNIĘTA 2026-09-16 — zakres pięciu nowelizacji Op ustalony z treści; opis: AUDIT-JOURNAL, AUDYT-2026-09-16b.

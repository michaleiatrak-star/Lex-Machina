# CHANGELOG — prawny-router-v3

- 3.52 (2026-09-16, F-189): references/legacy-material-router/cyberprzestepstwa.md — „art. 117 § 1 KC — 6 lat” → art. 118 KC (F-135). Treść routera bez zmian.
- 3.51 (2026-09-16, F-189): references/legacy-material-router/cyberprzestepstwa.md — „Prawo telekomunikacyjne, Dz.U. 2024 poz. 1221 t.j.” skorygowane: 2024/1221 to akt pierwotny Prawa komunikacji elektronicznej (RZĄD 1; T31). Treść routera bez zmian.
- 3.50 (2026-09-16, F-189): T12: pole YAML `changelog:` skrócone do odesłania; wersja 3.49 bez opisu oznaczona jako LUKA JAWNA. Treść bez zmian.
- 3.49 — LUKA JAWNA: numer obecny na dysku 2026-09-16, brak wpisu w changelogu i w AUDIT-JOURNAL; zakresu zmian nie da się odtworzyć — wpis celowo niezmyślony
- 3.48 (2026-09-10x, O-11): **KWOTA-GATE — kontrola przy każdej podawanej kwocie.**

  Nowa pozycja w `references/SELF-CHECK.md`. Wyzwalacz: odpowiedź podaje kwotę
  opłaty sądowej, taksy, kosztów zastępstwa albo wyliczenia alimentacyjnego.
  Trzy pytania, wszystkie muszą mieć odpowiedź TAK:

  1. czy sprawdzono, że strona **nie jest zwolniona** (art. 94–103 KSCU — trzy
     warstwy: podmiotowe art. 96 ust. 1, przedmiotowe art. 95, na wniosek
     art. 100–103),
  2. czy kwota pochodzi z **tabeli ustanawiającej**, nie z bazy katalogującej
     ani z pamięci,
  3. czy sprawdzono **przypisy** przy jednostce redakcyjnej.

  ⛔ Punkt 3 istnieje dlatego, że art. 13 ust. 2 KSCU niesie **dwa brzmienia obok
  siebie** rozróżnione wyłącznie odnośnikami — cap opłaty stosunkowej to
  100 000 zł od 23.09.2025, nie powszechnie powtarzane 200 000 zł.

  `shared/TABELE-OPLAT.md` dopisany do `required_modules` oraz do warstwy
  odroczonej w `references/PROFIL-LEKKI.md`, z wyzwalaczem mechanicznym
  „zamierzasz podać kwotę" i najpóźniejszym momentem odczytu „przed pierwszą
  liczbą".

- 3.47 (2026-09-10o, F-181): **przemoc domowa — przeterminowana podstawa
  i przemianowany akt.**

  `references/legacy-material-router/przemoc-domowa.md` podawał ustawę
  o przeciwdziałaniu przemocy jako `Dz.U. 2021 poz. 1249` — status
  **wygaśnięcie aktu**. Aktualny tekst jednolity: **Dz.U. 2024 poz. 1673**
  ✅ [VER] RZĄD 1, ⛔ KROK 2C: jedna nowelizacja po nim.

  ⛔ **Akt został PRZEMIANOWANY.** Tytuł „ustawa o przeciwdziałaniu przemocy
  **w rodzinie**" jest historyczny; obowiązujący to „ustawa o przeciwdziałaniu
  przemocy **domowej**". Wpisane wprost, bo sama podmiana numeru zostawiłaby
  nieaktualną nazwę — a to jest dokładnie sygnał, który w tej serii dwukrotnie
  okazał się wierzchołkiem podmiany aktu (F-148a, 10j).

  Ta sama poprawka w bliźniaczym module `dr-03`.

- 3.46 (2026-09-10l, F-181): legacy-material-router/tryby-scigania: KPK 2024/37 (wygaśnięcie aktu) → 2026/490 + lista 5 nowelizacji po tekście jednolitym
- 3.45 (2026-09-10b, O-6 / F-180): **zakaz orzekania o systemie z jednego
  nośnika; rdzeń mniejszy po wydzieleniu gałęzi HARD GATE.**

  **O-6.** Nowa pozycja `[STAN-ZAŁADOWANY]` w `references/SELF-CHECK.md`:
  jeśli odpowiedź twierdzi, że w systemie jest luka, błąd, brak pliku lub
  niedomknięta flaga, wolno to orzec dopiero po zestawieniu wersji **załadowanej
  przez hosta** z wersją w repozytorium. Alternatywa dopuszczalna: oznaczyć
  wniosek jako ⚠️ WARUNKOWY z podaniem wersji roboczej.

  Podstawa: 2026-09-09/10 ocena prowadzona na kopii sesyjnej z routerem 3.41
  zgłosiła jako usterkę systemu lukę historii, która w repozytorium (3.42) nie
  istniała. ⛔ Klasa błędu jak F-151 — wniosek z jednego nośnika bez sprawdzenia
  drugiego, tym razem po stronie oceniającego, nie źródła.

  **F-180 (skutek dla routera).** Wydzielenie 236 linii gałęzi warunkowych
  z `shared/PRAWO-HARDGATE.md` zmniejszyło rdzeń R-1…R-5 z ≈100 kB do ≈88 kB.
  `references/PROFIL-LEKKI.md` 1.1 → 1.2: skorygowana tabela rdzenia, dwa nowe
  wpisy w warstwie odroczonej (`PRAWO-HARDGATE-BLOKADA.md`,
  `PRAWO-HARDGATE-AKT-MIEJSCOWY.md`) z wyzwalaczami mechanicznymi.

- 3.44 (2026-09-10, F-179): **korekta przesłanki profilu LEKKIEGO — pomiar
  z 3.43 był fałszywy w przesłance.**

  Wpis 3.43 uzasadniał profil liczbą „≈219 kB ≈ 54 tys. tokenów ścieżki
  obowiązkowej przed wczytaniem PRIMARY". Liczba sumowała `MOD-CN-GATE`,
  `MOD-REM-GATE`, `MOD-WYJATEK-GATE`, `MOD-OS-CZASU-PRZESLANEK`,
  `HIERARCHIA-ZRODEL`, `MOD-STEP-TRACKER` i `DISCLAIMER` jako koszt
  bezwarunkowy — a wszystkie mają wyzwalacze warunkowe zapisane u siebie
  i podlegają **leniwemu ładowaniu**. Host wczytuje treść zasobu przy `view`,
  nie z góry, więc warstwa warunkowa była leniwa, zanim profil powstał.

  ⛔ Klasa błędu identyczna z **F-164** (REM-0): reguła zbudowana na tezie
  o świecie, której nikt nie zmierzył. Czwarte wystąpienie w tym systemie
  (F-151, F-162, F-164, F-179).

  Zmierzone poprawnie 2026-09-10:

  | Warstwa | Kiedy | Rozmiar |
  |---|---|---:|
  | `name` + `description` 32 skilli | zawsze | ≈5,9 kB ≈ 1,5 tys. tokenów |
  | rdzeń R-1…R-5 | po wyzwoleniu routera, bezwarunkowo | ≈100 kB ≈ 25 tys. tokenów |
  | zasoby warunkowe | po padnięciu wyzwalacza | 0–113 kB |

  Skutek dla profilu: **korzyść jest audytowa, nie wydajnościowa.** Profil nie
  zmniejsza rdzenia ani o bajt. Zamyka natomiast tryb awarii, który leniwe
  ładowanie tworzy: **odroczenie cicho stające się pominięciem**, dotąd
  nieweryfikowalne z zewnątrz. Trzy mechanizmy zamknięcia bez zmian —
  deklaracja w KROKU 3A, kontrola `[PROFIL-ODROCZENIA]`, zamknięta lista
  wyzwalaczy w jednym miejscu.

  ⚠️ Realna redukcja kosztu wymagałaby skrócenia rdzenia — `PRAWO-HARDGATE.md`
  to 41 kB, czyli 41% rdzenia. Osobna decyzja projektowa, inny profil ryzyka,
  nieobjęta tym wydaniem.

  `references/PROFIL-LEKKI.md` 1.0 → 1.1, sekcja „PO CO ISTNIEJE" przepisana.

- 3.43 (2026-09-10, F-175): **PROFIL LEKKI — kolejność odczytu zasobów
  obowiązkowych.** `references/PROFIL-LEKKI.md`.

  Zmierzona ścieżka obowiązkowa routera 3.42 (2026-09-10): **≈219 kB ≈ 54 tys.
  tokenów PRZED** wczytaniem PRIMARY, jego modułów i materiału sprawy. Rdzeń
  R-1…R-5 (SKILL, KROK 0A, KROK 1, PRAWO-HARDGATE, SELF-CHECK) to ≈106 kB;
  reszta — HIERARCHIA-ZRODEL, CN, REM, WYJ, OŚ, STEP-TRACKER, DISCLAIMER —
  ≈113 kB, i cała ta reszta ma już dziś wyzwalacze warunkowe zapisane u siebie.

  ⛔ Kwalifikacja: to jest kwestia bezpieczeństwa, nie wygody. Bramka, której nie
  da się załadować, nie chroni przed niczym, a presja kontekstowa jest
  strukturalną przyczyną trybu fasadowego — przeciwko któremu SELF-CHECK ma trzy
  osobne kontrole. Trzy kontrole na jeden tryb awarii są objawem, nie
  rozwiązaniem.

  ⚡ **Zbieżność z benchmarkiem 2026-09-08.** Pomiar 2×2 wykazał, że skille mają
  znak ZALEŻNY od poziomu rozumowania: przy wysokim +3,6 pkt, przy średnim
  −7,5 pkt. Ujemny znak przy średnim poziomie jest dokładnie tym, czego należy
  oczekiwać, gdy koszt kontekstu wypiera uwagę z merytoryki. Profil LEKKI
  atakuje ten mechanizm, nie objaw.

  Plik rozdziela RDZEŃ NIEREDUKOWALNY od warstwy ODROCZONEJ, każdą pozycję
  z wyzwalaczem MECHANICZNYM i najpóźniejszym momentem odczytu.
  ⛔ Nie znosi żadnej bramki — zmienia moment `view`, nigdy zakres kontroli.
  UP-6 (CN-GATE i REM-GATE w każdej sprawie) bez zmian. Cztery przypadki
  zakazu profilu LEKKIEGO: karne materialne, tura generująca pismo, kategoria
  [11], błąd odczytu zasobu rdzenia.

  Egzekwowanie: nowa pozycja `[PROFIL-ODROCZENIA]` w `references/SELF-CHECK.md`
  (kontrola na wyjściu — wyzwalacz padł, a `view` nie ma = bramka niewykonana)
  oraz dwie linie w bloku KROKU 3A: `PROFIL` i `ODROCZONE`. Deklaracja
  `PROFIL: LEKKI` bez wypisanej listy odroczeń jest nieweryfikowalna, czyli
  fasadowa.

- 3.42 (2026-09-09, F-169/F-170/F-171): **trzy łatki po audycie czterech
  arkuszy odpowiedzi na bank 14 kazusów wieloaspektowych.**
  Układ pomiaru 2×2 — poziom rozumowania (średni / wysoki) × obecność skilli,
  ten sam klucz autorski jako rdzeń odniesienia, ta sama pula kazusów.
  Wynik: bez skilli 84,5 (śr.) i 88,4 (wys.); ze skillami 77,0 (śr.) i 92,0
  (wys.). Skille nie mają stałego znaku — przy wysokim rozumowaniu +3,6 pkt,
  przy średnim −7,5 pkt; premia za poziom rozumowania rośnie ze skillami
  z +3,9 do +15,0. To INTERAKCJA, nie efekt główny.
  Trzy jednostki obalone, wszystkie w arkuszu skillowanym o średnim
  rozumowaniu, wszystkie noszące znacznik „✅ [VER]".

  **F-169 — AF-7, forma znacznika ✅ [VER]** (`shared/PRAWO-HARDGATE.md`).
  Luka źródłowa: rygor nieważności formy istniał WYŁĄCZNIE dla 🎯 [CEL]
  w AF-2 („brak któregokolwiek z pięciu pól = znacznik NIEWAŻNY"). Znacznik
  najsilniejszy — ✅ [VER] — był jedynym bez sankcji za niekompletność, mimo
  że linia 630 pliku od 2026-08-27 przewidywała formę `✅ [VER: źródło, data]`.
  Asymetria odwrotna do ryzyka. Zmierzone: 24 wystąpienia gołego „✅ [VER]"
  w jednym arkuszu; z pięciu sprawdzonych dwa fałszywe (data stosowania
  obowiązków AI Act podana w brzmieniu sprzed rozporządzenia zmieniającego,
  mimo że akt zmieniający wszedł w życie przed datą weryfikacji arkusza).
  Wdrożono rygor trzech pól: kanał odczytu, identyfikator aktu lub orzeczenia,
  data odczytu W TEJ turze. Brak pola = znacznik nieważny, czytany jak
  ⚠️ [NIEWERYFIKOWANE]. Reguła jest składniowa i sprawdzalna z zewnątrz bez
  dostępu do logów.
  ⚠️ Skutek uboczny wdrożenia: dotychczasowe odpowiedzi z gołym „✅ [VER]"
  stają się formalnie nieoznaczone. Wzrost liczby ⚠️ w pierwszej sesji po
  wdrożeniu jest dowodem działania reguły, nie nową flagą.

  **F-170 — S3(b2), oś działalności regulowanej**
  (`shared/MOD-WYJATEK-GATE.md` 2.0→2.1). Luka źródłowa: pytanie zamknięte
  S3(b) brzmiało „czy obowiązywał akt SEKTOROWY regulujący ten sam stosunek
  dla tej kategorii strony?", a katalog kategorii obejmował wyłącznie role
  chronionej strony stosunku prywatnoprawnego (konsument, pacjent, pracownik,
  rolnik, najemca, inwestor). Akt sektorowy przywiązany do ROLI REGULOWANEJ —
  sponsora, dostawcy usługi, instytucji obowiązanej, zamawiającego — był poza
  zasięgiem tego pytania. Zamiatanie wykonane literalnie i poprawnie NIE MOGŁO
  takiego aktu wskazać. To nie było zaniedbanie wykonawcy, tylko zły zakrój
  warunku. Wdrożono dwie osie: b1 strona chroniona, b2 działalność regulowana;
  oba katalogi otwarte, każda oś zamykana osobnym wpisem, „brak" jest wynikiem
  w każdej z nich. Pozycja S3 w bloku wyjściowym zamyka się dopiero po zapisie
  obu osi.

  **F-171 — S4(b), akt o etapowym stosowaniu** (tamże). Luka źródłowa: S4
  obejmowało nowelizacje ujawnione w S1–S3, a S1–S3 patrzą na akt główny.
  Akt, który przesuwa wyłącznie DATĘ STOSOWANIA aktu głównego, nie zmienia
  treści żadnej normy, więc nie ujawnia się przy odczycie normy i S1–S3 go nie
  wskażą. Wdrożono obowiązek odczytu przepisu o rozpoczęciu stosowania
  (typowo ostatni artykuł, „stosuje się od…", z wyjątkami rozdziałami lub
  załącznikami) w brzmieniu AKTUALNYM, nie pierwotnym, wraz z zapisem aktu
  zmieniającego harmonogram. Zapis „akt X stosuje się zasadniczo od DATY" bez
  ustalenia, czy DATA pochodzi z brzmienia pierwotnego czy aktualnego, jest
  wykonaniem FASADOWYM: pole wypełnione, kontrola niewykonana.

  **Zmiany w routerze:** wersja 3.41→3.42; Reguła 12a rozszerzona o obie osie
  S3 i o zakres S4; nowa Reguła 14a (forma znacznika ✅ wg AF-7); SELF-CHECK
  uzupełniony o bramkę blokującą „każdy znacznik ✅ [VER] niesie kanał,
  identyfikator i datę odczytu".

  **Wniosek ogólny.** Pomiar potwierdza Regułę 26 („skill nie jest źródłem")
  i pokazuje jej warunek brzegowy: bramka wymusza POSTAWIENIE znacznika, nie
  wymusza ODCZYTU. Model o słabszym rozumowaniu wypełnia pole bramki z pamięci
  i wystawia sobie certyfikat; model o mocniejszym rozumowaniu idzie do źródła,
  zanim postawi znacznik. Przy identycznym aparacie proceduralnym daje to trzy
  jednostki obalone w jednym arkuszu i zero w drugim. Rekomendacja doboru:
  skille uruchamiać RAZEM z najwyższym dostępnym poziomem rozumowania, nie
  zamiast niego.
  Zaktualizowane sumy w `shared/CHECKSUMS.sha256`.

- 3.37 (2026-09-01, hotfix F-146): **naprawa CRIT — nieparsowalny frontmatter.**
  We wpisie 3.36 pola `changelog:` fragment `„≥1 powołany artykuł"` łączył
  otwarcie typograficzne `„` z zamknięciem prostym `"`. Ponieważ cały wpis jest
  skalarem w cudzysłowach prostych, ten znak kończył skalar w połowie zdania i
  parser przerywał odczyt (`expected <block end>, but found '<scalar>'`).
  Skutek praktyczny: wersja 3.36 nie ładowała się w ogóle — na dysku hosta
  pozostawała 3.34, a system cicho pracował na starszej generacji bramek
  (brak WYJ-GATE z 3.36 i brak OŚ-GATE w wariancie 3.35+).
  Naprawa: zamknięcie zmienione na `”` (poprawna para `„…”`). Zmiana obejmuje
  JEDEN znak w metadanych; treść proceduralna, routing [1]–[11], bramki i
  pipeline pism bez zmian. Zaktualizowane sumy w `CHECKSUMS.sha256`.
  Wniosek profilaktyczny: w YAML cytuj wpisy apostrofami albo pilnuj pary
  `„…”` — ten sam wzorzec mieszanych cudzysłowów występuje w kilkunastu
  miejscach `references/` (tam nieszkodliwie, bo poza frontmatterem).

- 3.36 (2026-08-31d, flaga F-144): BRAMKA SĄSIEDZTWA z 3.35 przemianowana na
  **BRAMKĘ WYJĄTKÓW (WYJ-GATE)** i rozszerzona z jednego zamiatania na cztery:
  S1 sąsiedztwo redakcyjne, S2 krawędzie jednostki (klauzule zakresowe),
  S3 akty powiązane z rejestru ELI (lex specialis leżący poza aktem),
  S4 przepisy przejściowe. Wyzwalacz bez zmian — mechaniczny, „≥1 powołany
  artykuł". Powód: reguła 3.35 pokrywała tylko jedno z czterech miejsc,
  w których mieszkają wyjątki, a jej nazwa opisywała czynność zamiast celu;
  w kazusie 111 wyłączenie rękojmi leżało w INNEJ ustawie, czego S1 nie widzi.
  Moduł: `shared/MOD-WYJATEK-GATE.md`. Reguła 12a i SELF-CHECK przepisane —
  pozycja blokująca wymaga teraz wszystkich czterech zamiatań w bloku, także
  przy wyniku pustym. Bez zmian w routingu [1]–[11] i w pipeline pism.
  ⛔ Skuteczność NIEZMIERZONA — F-144. Pełny opis:
  `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-31d.

- 3.35 (2026-08-31c, flaga F-144): nowa **BRAMKA SĄSIEDZTWA (US-GATE)** przed KROK 4, wyzwalacz MECHANICZNY „≥1 powołany artykuł" → `shared/MOD-UNIT-SWEEP.md`. Powód: hard gate potwierdza, że cytowany przepis brzmi tak, jak model twierdzi, a kontrola temporalna — że to właściwa wersja; żadna nie pyta, CO LEŻY OBOK. Luka źródłowa (kazus 111): art. 770 k.c. odczytany ze źródła i we właściwym brzmieniu na 20.02.2011, pominięty art. 770¹ k.c. — jednostka pod następnym numerem, odsyłająca kupującego-konsumenta do przepisów o sprzedaży konsumenckiej. Zakres minimalny US-2 obejmuje obowiązkowo artykuły z indeksem górnym, bo to typowe miejsce lex specialis dodanego nowelizacją. Zaktualizowane: `required_modules`, Reguła 12a, SELF-CHECK (pozycja blokująca). Bez zmian w routingu [1]–[11] i w pipeline pism. ⛔ Skuteczność NIEZMIERZONA — pomiar przypisany do F-144. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-31c.

- 3.34 (2026-08-31, flaga F-142): BRAMKA CHRONOLOGICZNA rozdzielona na dwa niezależne tory. TOR A — OŚ-GATE, wyzwalacz MECHANICZNY „≥2 daty w opisie stanu faktycznego" → `shared/MOD-OS-CZASU-PRZESLANEK.md`. TOR B — dotychczasowy, „≥2 dokumenty wieloetapowe lub słowa kluczowe" → `chronologia-sprawy-v1`. Powód rozdzielenia: dotychczasowy wyzwalacz nie odpalał na materiale jednodokumentowym — kazus zapisany w pięciu zdaniach zawiera cztery daty i pełny problem temporalny, a bramka go nie widziała. Warunek TORU A jest liczbowy celowo; warunek ocenny („gdy sprawa wydaje się temporalna") to ten sam tryb awarii, który mierzy F-113. Zaktualizowane: `required_modules`, Reguła 12, SELF-CHECK (blok OŚ-GATE jako pozycja blokująca przed konkluzją). Bez zmian w routingu [1]–[11] i bez zmian w pipeline pism. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-31b.

- 3.33 (2026-08-28): przywrócono jawne wskazanie orzeczenia.ms.gov.pl / sn.pl / nsa.gov.pl w sekcji escalation pliku SKILL.md. Niedostępność uruchamia właściwą weryfikację orzecznictwa; brak potwierdzenia po dostępnych alternatywach wymaga oznaczenia NIEWERYFIKOWANE. Zachowano wszystkie pozostałe instrukcje 3.32, w tym kontroler BI i fallback ISAP.

- 3.32 (2026-08-28): przeniesiono poprawkę BI i fallbacku ISAP z osobistej instalacji, zachowując zmiany rozwojowe 3.30–3.31. Dodano zależność DR-16 i poprawny adres kontrolera; nieudane pobranie aktu/tekstu z ISAP uruchamia LEX/Legalis/ArsLege z kontrolą licencji, wersji i kategorii dowodu.

- 3.31 (2026-08-28): zsynchronizowano router z modelem runtime current-state-only po zamknięciu F-108. Lokalne `MAPA-AKTOW.md` przechowują wyłącznie bieżący akt/zakres → moduł oraz fresh/temporal gate; historia napraw pozostaje w dziennikach i changelogach. Routing korzysta z aktualnych indeksów COV, a `COV` nie jest utożsamiane z `FULL`.

- 3.30 (2026-08-27): zsynchronizowano `pokrycie-dziedzinowe.md` ze stanem faktycznym repozytorium: REACH/CLP → DR-10, akcyza/cło → istniejące moduły DR-06, cudzoziemcy → kanoniczny DR-05; dodano wejścia F-108 P1/41, P1/8 i P1/52.

- 3.29 (2026-08-27): przywrócono stałe identyfikatory reguł po skróceniu,
  bez Reguły 13, z kolejnością 22 → 23. Odwołania w SELF-CHECK i modułach
  zachowują znaczenie. Usunięto pozostałe notatki historyczne z korpusu i YAML.
  Końcowy SKILL.md: 391 linii wobec 924 przed przebudową.

- 3.28 (2026-08-26): korpus routera skrócono z 924 do około 400 linii.
  Na początku dodano siedmiopunktowy blok `ŁADOWANE ZAWSZE`. Szczegóły
  warunkowe pozostawiono w kanonicznych modułach, a z korpusu usunięto
  narracje incydentów, przykłady spraw, zduplikowane źródła, Regułę 13,
  tabelę kombinacji i lokalne warianty disclaimera. `SELF-CHECK.md` zachowuje
  pełne bramki wykonawcze bez opisów historycznych.

- 3.27 (2026-08-26): porównanie z kluczem dostało osobny, obowiązkowy protokół
  `AUDYT-KLUCZA-ODPOWIEDZI.md`: inwentarz wszystkich twierdzeń prawnych,
  atomizacja wg VER-GRAIN, HARD GATE per jednostka oraz jawny licznik pokrycia.
  Werdykt „pełna zgodność" jest teraz dozwolony wyłącznie przy wyniku N/N,
  bez pozycji obalonych i nierozstrzygniętych. Kategoria [11], REGUŁA 27 i oba
  self-checki wskazują tę samą kanoniczną procedurę. Imperatyw `description`
  skrócono z 336 do 170 znaków (profil uniwersalny ≤200), a nagłówek korpusu
  zmieniono z martwego „v3.13" na stabilne „v3", aby nie dublował wersji YAML.

- 3.26 (2026-08-25b, flaga **F-134**): naprawa czterech wad wskazanych w
  zewnętrznej opinii porównawczej — po **audycie samej opinii**, nie po
  przyjęciu jej na wiarę (REGUŁA 25 zastosowana do materiału, który tę regułę
  chwalił).

  **(1) description — przywrócony imperatyw.** Pole było jedynym miejscem
  decydującym o załadowaniu skilla, a w 3.24 wymieniono w nim imperatyw
  („UŻYWAJ ZAWSZE i AUTOMATYCZNIE. Nigdy nie analizuj bez wczytania tego
  pliku") na neutralny opis funkcji. Zysk dla walidatora, strata dla
  wyzwalania. Przywrócono imperatyw i rozszerzono go o przypadek ujawniony
  w F-132 („nie oceniaj cudzej analizy bez wczytania"), zachowując opis
  funkcjonalny dla czytelności.

  **(2) compatibility — realne nazwy.** `live_web_lookup, file_read` nie
  odpowiadały żadnej faktycznej funkcji, co rozluźniało wiązanie HARD GATE
  z konkretnym wywołaniem. Przywrócono nazwy realne z jawnym dopiskiem
  „lub równoważne funkcje hosta wg `shared/UNIVERSAL-RUNTIME-ADAPTER.md`" —
  to zachowuje uniwersalność bez utraty wiązania.

  **(3) PATH-SELFTEST — wykrywanie fail zamiast deklaracji fail-closed.**
  Ścieżki semantyczne (bez prefiksu hosta) są warstwą deklaratywną: jeśli
  host wymaga ścieżki bezwzględnej, odczyt zwróci błąd, a domyślnym
  zachowaniem modelu jest wtedy cicha odpowiedź z pamięci. „Fail-closed
  wymaga, by ktoś wykrył fail". Rozwiązanie NIE polega na powrocie do
  ścieżek jednego hosta (to zabiłoby uniwersalność) ani na dwóch wariantach
  plików (koszt utrzymania), tylko na uczynieniu PIERWSZEGO odczytu w sesji
  testem: forma względna → jeśli błąd, ustal prefiks hosta i powtórz →
  jeśli nadal błąd, jawny `⛔ TRYB ZDEGRADOWANY` z nazwą zasobu i błędu.

  **(4) REGUŁA 26 — skill nie jest źródłem prawa.** Przyczyna zmierzona
  w F-134: wartość „do 2 lat" dla art. 178a §1 KK, którą model podał
  użytkownikowi, pochodziła z modułu `dr-03`, nie z pamięci. Moduł nie był
  drugim źródłem — był jedynym i był w błędzie. Reguła rozdziela role:
  moduł odpowiada „KTÓRY przepis", źródło odpowiada „CO on dziś stanowi";
  znacznik ✅ [VER: data] w module dokumentuje stan na tę datę, nie dziś.

  **Czego z opinii NIE wprowadzono i dlaczego — art. 87 §1 KW.** Opinia
  zgłaszała wartość „30 000 zł" w modułach jako błąd wymagający zamiany na
  „2 500 zł". Weryfikacja: **obie wartości są prawdziwe i opisują różne
  granice tej samej sankcji** — 2 500 zł to dolna granica grzywny z art. 87
  §1 KW, a 30 000 zł to górna granica, bo art. 87 §1 jest wymieniony
  w katalogu art. 24 §1a KW ✅ [VER: lexlege.pl/kw/art-24, odczyt
  2026-08-25]. Zamiana jednej liczby na drugą przeniosłaby błąd, nie
  usunęła. Moduły uzupełniono o OBIE granice z zakazem podawania samej
  górnej. To zastosowanie reguły 25 do samej opinii — trafna diagnoza
  („ta liczba jest niepełna") z błędną korektą.

- 3.25 (2026-08-25, flaga **F-132**): kategoria routingu **[11] WERYFIKACJA
  CUDZEGO MATERIAŁU PRAWNEGO** (→ PRIMARY `analizator-przepisow-v2`) oraz
  **REGUŁA 24 (VER-GRAIN)** i **REGUŁA 25 (ADVERSARIAL-SOURCE)**.

  **Incydent (ta sama rozmowa co F-131, tura następna).** Po naprawie 3.24
  model w turze „porównaj z kluczem" wykonał już weryfikację online — ale
  TYLKO dla części powołań. Zweryfikował definicje stanu po użyciu alkoholu
  (art. 46 ust. 2 ustawy o wychowaniu w trzeźwości), a NIE zweryfikował
  ponownie górnej granicy kary z art. 178a §1 KK i przepisał z pamięci
  wartość „do lat 2", nieaktualną od 1.10.2023 (obowiązuje „do lat 3").
  Wartość ta była BŁĘDNA także w ocenianym kluczu — czyli błąd nie został
  wychwycony, tylko POWIELONY, mimo że jedno ze źródeł w wynikach
  wyszukiwania podawało wartość poprawną. Rozbieżność między źródłami
  została nierozpoznana jako ślad nowelizacji.

  **Dwie odrębne przyczyny, dwie odrębne reguły:**

  (1) *Ziarnistość i kompletność* — reguła 23 wymagała „osobnego wyszukiwania
  dla KAŻDEGO powołania", ale nie definiowała, CO jest powołaniem (teza czy
  liczba?), ani nie ustanawiała kontroli kompletności na wyjściu. Reguła
  spełnialna wybiórczo: model weryfikuje to, co samo wyda mu się wątpliwe,
  a przeoczenie z definicji nie zgłasza się samo. Naprawa: REGUŁA 24 —
  jednostka weryfikacji zdefiniowana wprost (artykuł + §/ust./pkt, każda
  liczba, data, sygnatura, granice kary), INWENTARZ POWOŁAŃ jako czynność
  na wyjściu (lista powołań zestawiona 1:1 z wywołaniami), zakaz znacznika
  ✅ [VER] „hurtem" dla akapitu, oraz reguła 24(c): rozbieżność między
  źródłami = sygnał nowelizacji, nie szum do przegłosowania.

  (2) *Postawa wobec cudzego materiału* — zadanie „porównaj z kluczem"
  weszło do routingu przez skill dziedzinowy (`dr-XX`), bo tabela [1]–[10]
  nie miała pozycji dla weryfikacji cudzego opracowania. `dr-XX` odpowiada
  na pytanie „czy argumentacja jest trafna", nie „czy każda dana w tym
  tekście jest prawdziwa". Skutek: ocena toku rozumowania klucza wypadła
  poprawnie, a ani jedna jednostka redakcyjna klucza nie została sprawdzona
  (niezależna analiza zewnętrzna tego samego materiału wykazała m.in. art.
  250 §2 zamiast §2a, art. 243 zamiast art. 246 §1, grzywnę 100 zł zamiast
  2500 zł, przepadek pojazdu przypisany art. 178a zamiast art. 44b KK,
  oraz zarzut niezgodny ze stanem faktycznym kazusu). Naprawa: kategoria
  [11] z PRIMARY `analizator-przepisow-v2` + REGUŁA 25 — cudzy materiał jako
  hipoteza do obalenia, zgodność ≠ potwierdzenie (dwa teksty mogą powielać
  ten sam błąd), test spójności wewnętrznej jako ustalenie samodzielne,
  zakaz milczącej adopcji cudzej danej bez znacznika.

  **Zakres uniwersalny (portability):** obie reguły i kategoria [11] są
  sformułowane w kategoriach OPERACJI SEMANTYCZNYCH (wyszukanie/odczyt
  źródła, wczytanie skilla), bez nazw narzędzi konkretnego hosta i bez
  ścieżek bezwzględnych — zgodnie z sekcją ADAPTER RUNTIME i
  `shared/UNIVERSAL-RUNTIME-ADAPTER.md`. Działają identycznie na hoście
  bez `web_search`/`view`, o ile host ma funkcje równoważne; brak takich
  funkcji = fail-closed (⚠️ [NIEWERYFIKOWANE]), nie substytucja pamięcią.

  ⚠️ **Skuteczność NIEZMIERZONA** — jak przy F-131 i całej sesji 2026-08-23,
  potwierdzona jest wyłącznie OBECNOŚĆ bramek w plikach, nie ich wpływ na
  zachowanie. Bramka „inwentarz powołań" jest samo-raportująca (klasa e2 wg
  `PLAN-TESTU-BRAMEK-F113.md`) — model, który pominął weryfikację, może z
  tego samego powodu błędnie zaliczyć inwentarz. Pomiar objęty flagą F-133
  (otwarta, `WARN-OTWARTE.md`).

- 3.24 (2026-08-25, flaga **F-131**): REGUŁA 23 — twardy trigger re-check
  HARD GATE/PRIMARY na KAŻDEJ turze rozmowy prawnej, nie tylko pierwszej.
  Incydent: router wczytany raz na starcie rozmowy o kazusach KPK (TA),
  HARD GATE zastosowany poprawnie w pierwszej turze (6 web_search), ale w
  kolejnej turze tej samej rozmowy ("porównaj z kluczem użytkownika") model
  wykonał zero web_search i nigdy nie wczytał PRIMARY dr-03, mimo że treść
  dotyczyła tych samych przepisów KPK/KK/KW. Root cause: reguła 9 (HARD GATE
  TRWAŁY) i formuła SELF-CHECK "przed każdą odpowiedzią" były sformułowane
  jako stan trwały w pliku już przeczytanym, nie jako mechaniczny trigger
  niezależny od klasyfikacji charakteru kolejnej wiadomości ("to tylko
  porównanie, nie nowa analiza" — dokładnie ta klasyfikacja była punktem
  awarii, analogicznie do F-8/F-8b dla świadka). Naprawa: REGUŁA 23 (wzorzec
  reguły 22) + pozycja w bloku SELF-CHECK, niezależna od oceny czy tura jest
  "nowym pytaniem" czy "recenzją/oceną/pytaniem meta" — trigger zależy
  wyłącznie od obecności treści prawnej w odpowiedzi, nie od gatunku tury.
  Dodatkowo odnotowana (nie naprawiona w tej sesji, ⬛ NIEPOTWIERDZONA —
  wymaga testu kontrolowanego) hipoteza uboczna: sekcja ADAPTER RUNTIME
  (ścieżki semantyczne zamiast bezwzględnych `/mnt/skills/user/...`) mogła
  dołożyć koszt pośredniości zwiększający ryzyko pominięcia wykonania —
  patrz `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-25,
  sekcja 3-4 dla pełnej analizy i zastrzeżenia metodologicznego.

- 3.23 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-126**): historia wersji sprowadzona do JEDNEJ lokalizacji kanonicznej (ZASADA 15). Usunięte dwa równoległe nośniki: (1) sekcja `## CHANGELOG (prawny-router-v3)` w korpusie `SKILL.md` — wpisy 3.13…3.9, w korpusie zostało odesłanie; (2) pole `changelog:` w YAML liczące 63 linie, czyli pełną historię zamiast skrótu — T12 zgłaszał je jako ⚠️, teraz ma 7 linii i odsyła tutaj. Oba bloki przeniesione 1:1, bez przeredagowania i bez odtwarzania czegokolwiek z pamięci. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 3.22 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, kopia treści zastąpiona wywołaniem. Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.

---

## Wpisy przeniesione z korpusu SKILL.md (F-126, 2026-08-24)

> Tekst poniżej przeniesiony 1:1 z sekcji `## CHANGELOG (prawny-router-v3)` w `SKILL.md`.
> Nic nie przeredagowano ani nie odtworzono z pamięci — przeniesienie
> istniejącego tekstu, zgodnie z zakazem z wiersza flagi F-126.

**3.13 (2026-07-12) — Reguła 22: TWARDY trigger słowny dla pytań do świadka
(naprawa F-8b, kontynuacja F-8):**
- Incydent: mimo poprawnie wdrożonej reguły 21 (dekompozycja żądań złożonych),
  model w KOLEJNEJ odpowiedzi w tej samej sesji otrzymał proste, samodzielne
  doprecyzowanie ("czy użyłeś skila przesłuchania świadków... router zawsze
  powinien odpalać ten skill") i — zamiast tego — wcześniej dostarczył pytania
  do świadka wprost z pamięci prawniczej, bez żadnego `view` pliku
  przesluchanie-swiadkow-v2-min90/SKILL.md, mimo że fraza "pytania do świadka"
  padła explicite w poleceniu użytkownika.
- Root cause: reguła 21 wiąże obowiązek wczytania skilla świadka z oceną
  "czy zlecenie jest złożone" (≥2 komponenty z różnych PRIMARY). To dobra
  reguła dla dekompozycji, ale nie jest ona TRIGGEREM SAMYM W SOBIE — model
  może (błędnie) ocenić, że dany fragment prośby "nie wymaga" pełnego
  pipeline'u i odpowiedzieć skrótowo.
- Naprawa: dodano REGUŁĘ 22 — bezwarunkowy, słowny trigger niezależny od
  oceny złożoności: obecność fraz "pytania do świadka"/"przesłuchanie
  świadka"/"kontrprzesłuchanie"/"impeachment świadka" wymusza `view`
  przesluchanie-swiadkow-v2-min90/SKILL.md PRZED napisaniem jakiejkolwiek
  odpowiedzi zawierającej takie pytania — niezależnie od tego, czy reszta
  zlecenia jest prosta czy złożona. Dodano też pozycję w SELF-CHECK.
- Pełny opis incydentu: AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12 (F-8 → F-8b).

**3.12 (2026-07-12) — Reguła 21: CHECKPOINT w żądaniach złożonych (naprawa F-8):**
- Incydent: zlecenie łączące tezy/chronologię/sprzeczności + "pytania do świadka"
  zostało obsłużone przez chronologia-sprawy-v1 w całości; przesluchanie-swiadkow-v2-min90
  nigdy nie zostało wczytane mimo poprawnego wiersza [8] w tabeli routingu — pytania
  W3 powstały bez CHECKPOINT-W2 (bez akceptacji tez przez użytkownika).
- Dodano REGUŁĘ 21 (sekcja reguł nadrzędnych, po regule 20/20a): żądania złożone
  dekomponować na komponenty, każdy z własnym PRIMARY skillem i checkpointami;
  obecność checkpointu w jednym komponencie (np. świadek → CHECKPOINT-W2) blokuje
  wyłącznie ten komponent, nie całą odpowiedź — ale MUSI zablokować.
- Pełny opis incydentu i naprawy równoległej w chronologia-sprawy-v1 (v1.3→v1.4,
  KATEGORIA A0 fałszywe sprzeczności): AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12.
- Flaga F-8 w WARN-OTWARTE.md → zamknięta tym wpisem.

**3.11 (2026-07-05) — scalenie standaryzacji metadanych z pełną logiką 3.10:**
- Kontekst: równolegle do rozwoju 3.9→3.10 (logika weryfikacji podmiotów) powstała
  osobna gałąź robocza, oznaczona "3.9" z dnia 2026-07-04, wprowadzająca ustrukturyzowany
  frontmatter (dependencies, inputs, outputs, confidence, escalation, limitations,
  required_modules) — ale bez KROK 0D i bez POV-D-TRIGGER.
- Scalenie: przyjęto ustrukturyzowany frontmatter, zachowując w całości treść
  KROK 0D, [POV-D-TRIGGER], ZASADĘ FUNDAMENTALNĄ ("dane z akt ≠ zweryfikowane")
  oraz pełny blok SELF-CHECK z POV-B/C/D.
- Dodano: required_modules → shared/PRE-W2-VERIFICATION-GATE.md; escalation →
  przypadek podmiotu ⬛ bez dostępu do rejestru.
- Dodano do frontmatter adnotację ZNALEZISKO 2026-07-04 o potencjalnym duplikacie
  kwalifikator-karnomaterialny.md (zgłoszone do CHECKLIST-DEDUP, nie rozwiązane
  w tym scaleniu).
- Wersja: 3.10 → 3.11. Żadna funkcja bezpieczeństwa nie została usunięta.

**3.10 (2026-06-26) — KROK 0D: oznaczanie podmiotów ⬛ [DO WERYFIKACJI]:**
- Nowy krok 0D w sekwencji głównej: obowiązkowe oznaczanie każdego podmiotu
  (spółki, sądy, organy) statusem ⬛ [DO WERYFIKACJI] od chwili napotkania.
- Status ⬛ utrzymuje się do faktycznego web_search/web_fetch — nie do zamiaru.
- SELF-CHECK: nowy blok "STATUS PODMIOTÓW" z checklistą przed każdą odpowiedzią.
- MOD-STEP-TRACKER: dodano R0D do REJESTRU.
- Wyjątki: dane osoby fizycznej (imię/nazwisko/adres/PESEL) — nie oznaczaj ⬛.
- Powiązane: PRE-W2-VERIFICATION-GATE.md v1.2.0 (nowy krok PRE-W2.0).

**3.9 (2026-06-26) — naprawa [POV-D-TRIGGER] i zasady "dane z akt ≠ zweryfikowane":**
- Root cause: model traktował KRS/NIP z umów/akt jako zweryfikowane online.
  Skutek: KRS 0000796445 (HP sp. z o.o.) wpisany przy Human Park Global sp. z o.o.
  (która ma KRS 0001025052) w piśmie procesowym VII P 94/25 (sesja 2026-06-26).
- SELF-CHECK: blok POV-B/C/D rozbudowany o:
  (a) zasadę explicite "dane z akt ≠ zweryfikowane"
  (b) [POV-D] jako osobny krok z triggerem przy ≥2 różnych numerach KRS/NIP
  (c) wymóg wyświetlenia raportu PRE-W2 przed W2
- Reguła nadrzędna 18: dodano [POV-D-TRIGGER] i zasadę fundamentalną.
- Wersja: 3.8 → 3.9

---

## Wpisy przeniesione z pola `changelog:` YAML (F-126, 2026-08-24)

> T12 zgłaszał to pole jako ⚠️ — 63 linie to pełna historia, nie skrót
> (ZASADA 15 dopuszcza w YAML skrót do ~15 linii). Tekst poniżej przeniesiony
> 1:1, w oryginalnej składni listy YAML, bez przeredagowania i bez
> odtwarzania czegokolwiek z pamięci.

```yaml
changelog:
  - "3.21 (2026-08-18): NOWY KROK 0-RPK — router jest teraz jedynym miejscem
    decydującym, KIEDY inicjować shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md
    (RPK), zamiast zostawiać tę decyzję wyłącznie w opisie biblioteki
    shared/SKILL.md, która sama w sobie nie jest samodzielnym skillem i nie
    ma własnej sekwencji wywołania. Powód: użytkownik trafnie zauważył, że
    dodanie modułu RPK do shared (2026-08-18, AUDYT-2026-08-18, flaga F-93)
    nie wystarcza — biblioteka nie decyduje SAMA o swoim wywołaniu, potrzebny
    jest punkt orkiestracji. Krok umieszczony zaraz po KROK 0-ST (analogicznie
    do MOD-STEP-TRACKER), z jawnymi sygnałami wyzwalającymi (zbiór ≥10
    ponumerowanych jednostek, plik źródłowy z numeracją ciągłą, zapowiedź
    pracy partiami). required_modules i SELF-CHECK rozszerzone. Nie zamyka
    F-93 w całości — propagacja do pozostałych 5 skilli-konsumentów
    (analizator-przepisow-v2, analizator-dowodow-v3,
    przesluchanie-swiadkow-v2-min90, chronologia-sprawy-v1, audyt-systemu-v4)
    pozostaje otwarta, patrz WARN-OTWARTE.md."
  - "3.17 (2026-07-21): NAPRAWIONO — shared/HIERARCHIA-ZRODEL.md (istniał
    od dawna) i shared/PORTALE-BRANZOWE-RZAD-2B.md (zbudowany w tej sesji,
    16 dziedzin z weryfikacją site:) NIE BYŁY ładowane przez ŻADEN DR-skill
    ani przez sam router — DOKŁADNIE ten sam wzorzec 'zbudowano, zapomniano
    podłączyć' co wielokrotnie w tej sesji (moduły niezarejestrowane w
    SKILL.md, plany bez skryptów, poprawki niezsynchronizowane między
    mapami). Dodano OBA do required_modules — TERAZ każde wywołanie routera
    (a więc każdy DR-skill uruchamiany PRZEZ router) ma dostęp do
    kategoryzacji wiarygodności źródeł i rejestru portali branżowych.
    Odkryte przy pytaniu użytkownika 'czy wszystkie DR wiedzą o tej bazie
    portali?' — odpowiedź brzmiała: ŻADEN, naprawiono."
  - "3.16 (2026-07-13f): KONSOLIDACJA — usunięto zależność od osobnych skilli
    mcp-zrodla-prawa-v1/audit-trail-portal-v1/sync-dzu-automatyczny-v1 (utworzonych
    2026-07-13). Ich treść przeniesiono do shared/MCP-INTEGRACJA.md,
    shared/AUDIT-TRAIL-SPEC.md i audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md
    — bo żaden z nich nie był samodzielnym skillem wywoływanym intencją użytkownika,
    tylko protokołem/narzędziem ładowanym przez router lub audyt-systemu-v4,
    dokładnie jak PRAWO-HARDGATE.md czy HYBRID-VALIDATION.md. Powód: uniknięcie
    duplikowania wzorca 'protokół + narzędzia w shared/tools', na wniosek
    użytkownika po pytaniu 'czy nie lepiej wdrożyć to jako elementy obecnych
    skili, a nie tworzyć coś nowego, co duplikuje już istniejące skille?'.
    Skille w systemie: 36 → 33 (powrót do liczby sprzed 2026-07-13)."
  - "3.15 (2026-07-13): INTEGRACJA — dodano shared/MCP-INTEGRACJA.md jako opcjonalną
    warstwę deterministyczną PRZED HARD GATE (nie zamiast). Gdy connector MCP
    (ISAP/SAOS/CBOSA/KRS/EUR-Lex) jest podłączony i dostępny w rozmowie, router
    używa go w pierwszej kolejności do weryfikacji powołań; HARD GATE
    (web_search/web_fetch) pozostaje aktywny bez zmian jako fallback i jako
    jedyna ścieżka gdy MCP niedostępne. Część realizacji rekomendacji #2 z
    audytu komercyjnego silnika 2026-07-13 (pełny opis: audyt-systemu-v4/
    references/AUDIT-JOURNAL.md, wpis AUDYT-2026-07-13)."
  - "3.14 (2026-07-12): DEDUP — usunięty duplikat
    references/kwalifikator-karnomaterialny.md (identyczny z kanonicznym
    dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md, MD5 zgodny),
    zgłoszony jako ZNALEZISKO 2026-07-04. 2 miejsca wywołania w dr-03
    przekierowane na ścieżkę kanoniczną. Zamyka pozycję w limitations —
    pełny opis tam. Część audytu komercyjnego silnika (punkt 4)."
  - "3.9 (2026-06-26): naprawa [POV-D-TRIGGER] i zasady 'dane z akt ≠ zweryfikowane
    online' — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.10 (2026-06-26): KROK 0D — obowiązkowe oznaczanie podmiotów ⬛ [DO WERYFIKACJI]
    — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.11 (2026-07-05): SCALENIE dwóch równoległych gałęzi rozwoju — (a) standaryzacja
    metadanych frontmatter (dependencies/inputs/outputs/confidence/escalation/
    limitations/required_modules), wprowadzona w wersji roboczej oznaczonej 3.9
    z dnia 2026-07-04, z (b) pełną logiką weryfikacji podmiotów KROK 0D +
    POV-D-TRIGGER z wersji 3.10 (2026-06-26). Żadna funkcja bezpieczeństwa nie
    została usunięta w procesie scalenia — required_modules rozszerzone o
    shared/PRE-W2-VERIFICATION-GATE.md, escalation rozszerzone o przypadek
    podmiotu ⬛ bez dostępu do rejestru."
```

## 3.38 (2026-09-04c) — naprawa YAML + podpięcie instrukcji dostępu do API

### Błąd naprawiony (F-159)

`escalation:` zawierał wielolinijkowy element z `weryfikacji: view shared/...`
w linii kontynuacji. YAML czyta `": "` jako początek mapy → `ScannerError:
mapping values are not allowed here` w linii 50 → **cały frontmatter
nieparsowalny**, czyli skill nie ładował się na hoście.

⛔ **To NAWRÓT.** Wpis 3.37 opisuje dokładnie tę samą klasę usterki: „naprawa
niesparowanego cudzysłowu w polu changelog — otwarcie typograficzne domknięte
znakiem prostym kończyło skalar YAML w połowie zdania i czyniło CAŁY
frontmatter nieparsowalnym". Dwa razy pod rząd ta sama awaria, bo **nic w tym
skillu nie sprawdza, czy własny frontmatter się parsuje**. Naprawa punktowa
nie usuwa przyczyny — zgłoszone jako F-159, do bramki.

Naprawiono także ciche zniekształcenie typu: `- opcjonalnie: pliki/dowody`
w `inputs`/`outputs` parsowało się BEZ BŁĘDU jako mapa `{opcjonalnie: "..."}`,
nie jako tekst. Konsument czytający listę łańcuchów dostawał słownik.

### Zmiana architektoniczna

Instrukcje „jak wywołać API" mieszkały wyłącznie w
`audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`. Sprawdzone:
`audyt-systemu-v4` **nie występuje w `dependencies.requires` żadnego skilla
produkcyjnego** — ani routera, ani `analiza-sadowa-v6`, `prawo-polskie-v2`,
`pisma-procesowe-v3`, `orzeczenia-sadowe-v2`. Wszystkie wzmianki o tym skillu
to narracyjne cytaty flag. Instrukcje były więc **niewidoczne z produkcji**.

- Utworzony `shared/DOSTEP-MASZYNOWY-API.md` — wyciąg operacyjny (nagłówki,
  ścieżki robocze, limity tempa, endpointy ELI/SAOS/KRS/UODO/HUDOC/eZamówienia,
  token CEIDG, anonimizacja odpisu KRS).
- Dopisany do `required_modules` routera.
- `escalation` rozszerzone o trzy pozycje: bramkę „sprawdź kształt żądania,
  zanim orzekniesz o niedostępności źródła", status ISAP jako **stanu
  normalnego** (kanał maszynowy martwy — weryfikacja przez ELI, ISAP jako
  adres dla człowieka) oraz białą listę VAT jako nieosiągalną maszynowo.

⛔ Bez duplikacji: pomiar i jego dowód zostają w `audyt-systemu-v4` (T25),
w `shared` stoi wyłącznie wyciąg operacyjny.

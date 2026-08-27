# PRAWO-HARDGATE-ORZECZENIA — Załącznik orzeczniczy hard gate'u

> **Plik nadrzędny:** `shared/PRAWO-HARDGATE.md` — ten załącznik jest jego
> częścią wydzieloną 2026-08-23h (flaga F-111, wariant B zatwierdzony przez
> użytkownika). Historia wersji: `shared/references/CHANGELOG.md`.
>
> ⛔ **NIE JEST samodzielną bramką.** Zawiera wyłącznie procedury, które odpalają
> się, gdy w tekście ma stanąć SYGNATURA ORZECZENIA. Wszystko, co obowiązuje
> ZAWSZE — zasada absolutna, PERMANENT GATE, hierarchia statusów, BRAMKA
> ANTY-FASADOWA, procedura przed każdym PRZEPISEM — zostało w pliku nadrzędnym
> i obowiązuje RÓWNOLEGLE. Jeśli czytasz ten plik, nie wczytawszy nadrzędnego:
>
> ```
> view shared/PRAWO-HARDGATE.md
> ```
>
> **Dlaczego wydzielone:** plik nadrzędny miał 967 linii i był wczytywany przez
> 114 plików w 26 skillach; 438 z tych linii odpalało się wyłącznie przy
> orzeczeniach. Granica podziału nie jest arbitralna — przebiega dokładnie tam,
> gdzie przebiega wyzwalacz: *czy w tekście stoi sygnatura*.
>
> ⚠️ **Znane ryzyko:** treść wydzielona to treść, której można nie wczytać.
> Pomiar skuteczności podziału — flaga **F-113**, test z grupą kontrolną.

---

## PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM ORZECZENIEM

> ⛔ BRAMKA WTÓRNE-ŹRÓDŁO-STOP (nowa, obowiązkowa — wykonaj PRZED KROK 1)
>
> Sygnatury pojawiające się w:
>   - wynikach web_search (snippety portali: infor.pl, poradnikprzedsiebiorcy.pl,
>     rp.pl, kadry.infor.pl, prawo.pl, lexlege.pl, komentarzach, artykułach blogów)
>   - treści modułów SKILL.md ("przykładowo SN wskazał w...")
>   - cytowaniach pośrednich ("zgodnie z wyrokiem SN z dnia...")
>
> NIE mogą być podane użytkownikowi bez przejścia przez KROK 1–5 poniżej.
> Źródło wtórne = tylko wskazówka do wyszukania. NIGDY nie jest dowodem istnienia orzeczenia.
>
> ⛔ ZAKAZ podawania sygnatury z adnotacją ✅ [VER: poradnikprzedsiebiorcy.pl] lub podobną.
> Znacznik ✅ [VER] jest zastrzeżony wyłącznie dla oficjalnych baz (sn.pl, orzeczenia.ms.gov.pl,
> nsa.gov.pl, trybunal.gov.pl, saos.org.pl). Wszystko inne = ⚠️ [NIEWERYFIKOWANE].
>
> ⛔ Portale wtórne wymienione wyżej (infor.pl, poradnikprzedsiebiorcy.pl, rp.pl,
> kadry.infor.pl, prawo.pl, lexlege.pl, komentarze, blogi) mają swoją kategorię
> w `shared/HIERARCHIA-ZRODEL.md` (RZĄD 2B lub RZĄD 3) — kategoryzacja RZĄD
> jest OBOWIĄZKOWA obok znacznika VER przy KAŻDYM linku do takiego źródła.

```
KROK 0 (strukturalny — ZAWSZE próbuj pierwszy):
  Konektor MCP verify_signature (sententim / prawo-pl-saos) — gdy dostępny,
  lub web_fetch: https://www.saos.org.pl/api/search/judgments?caseNumber=[sygnatura]
  → Wynik interpretuj wg kontraktu FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE
    (pełny kontrakt: shared/SYGNATURY.md, sekcja "KONTRAKT WYNIKU WERYFIKACJI")
  → FOUND (dokładnie 1 trafienie) → znacznik ✅ [VER: saos.org.pl API, data], przejdź do KROK 3
  → AMBIGUOUS (≥2 sądy, ta sama sygnatura) → NIE wybieraj sam; dopytaj o sąd/datę lub podaj kandydatów
  → NOT_FOUND w zakresie pokrywanym przez bazę → traktuj jak sygnaturę prawdopodobnie zmyśloną (SCENARIUSZ B)
  → OUT_OF_SCOPE / baza nie pokrywa danego sądu (np. NSA/WSA w SAOS) → przejdź do KROK 1
  ⚠️ Zero trafień w bazie WTÓRNEJ ≠ dowód nieistnienia — rozstrzyga baza oficjalna (KROK 1).

KROK 1: Wyszukaj sygnaturę WYŁĄCZNIE w oficjalnej bazie:
  sn.pl           → wyroki i uchwały Sądu Najwyższego
  orzeczenia.ms.gov.pl → sądy powszechne (apelacyjne, okręgowe, rejonowe)
  nsa.gov.pl      → Naczelny Sąd Administracyjny
  trybunal.gov.pl → Trybunał Konstytucyjny
  saos.org.pl     → agregator (pomocniczo, gdy powyższe niedostępne)

  [zawody zaufania publicznego — odpowiedzialność dyscyplinarna, dot. dr-12
   mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow]:
    Jawność I/II instancji korporacyjnej jest NIERÓWNA między zawodami I MIĘDZY
    IZBAMI TEGO SAMEGO ZAWODU — zweryfikowane online (2026-07-06), NIE zgaduj:
      adwokat  → wsd.adwokatura.pl/rejestry/showMain/orzecznictwo-19 —
                 "Portal Orzecznictwa Dyscyplinarnego Adwokatury", 1151+ pozycji
                 (WSD + orzecznictwo SN, sygn. SDI)
      radca prawny → wsd.kirp.pl (centralny, od 2018) + strony lokalne OIRP
                 (np. oirp.lu, oirp.gda.pl) — ⚠️ praktyka NIERÓWNA: badanie
                 Watchdog Polska wykazało, że część OIRP nie publikuje wcale
      lekarz   → nil.org.pl/orzeczenia (portal NIL, od 2024, OSL+NSL);
                 kasacje SN osobno pod nil.org.pl/izba/naczelny-rzecznik-
                 odpowiedzialnosci-zawodowej/dokumenty/orzeczenia-sadu-najwyzszego
      sędzia/asesor sądowy → Sąd Dyscyplinarny przy Sądzie Apelacyjnym
                 (art. 110 USP, osobny w każdej apelacji) — BRAK potwierdzonego
                 archiwum treści orzeczeń; jawne są tylko KOMUNIKATY o wszczętych
                 postępowaniach na rzecznik.gov.pl (to NIE są pełne orzeczenia)
      notariusz, komornik, rzecznik patentowy → BRAK potwierdzonego
                 scentralizowanego publicznego portalu I/II instancji
    Niezależnie od powyższego: brak trafienia w bazie korporacyjnej NIE jest
    dowodem, że sygnatura jest zmyślona — oznacz ⚠️ [NIEWERYFIKOWALNE — baza
    korporacyjna niekompletna/nieaktualna/lokalna], NIGDY ✅ [VER] bez faktycznego
    odnalezienia treści orzeczenia.
    Kasacja / odwołanie → publiczna baza wg zawodu:
      adwokat, radca prawny, lekarz, notariusz, rzecznik patentowy, sędzia →
        sn.pl (Sąd Najwyższy, Izba Odpowiedzialności Zawodowej — dawniej Izba
        Dyscyplinarna; sygnatury SDI dla notariusza/rzecznika patentowego)
      komornik sądowy → orzeczenia.ms.gov.pl (JEDYNY z tej grupy, gdzie
        II instancja to sąd apelacyjny, nie sąd korporacyjny)
    Pełny opis, tabela i zastrzeżenia: dr-12 →
      mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md, sekcja
      "Orzecznictwo dyscyplinarne — instancje i bazy".
    Do tej kategorii stosuj tę samą procedurę KROK 1–5 co do orzeczeń powszechnych,
    z zastrzeżeniami dot. jawności I/II instancji powyżej.

  Metoda wyszukiwania:
    web_fetch: https://www.sn.pl/orzecznictwo/SitePages/Baza_orzeczen.aspx → szukaj sygnatury
    lub web_search: "[sygnatura] site:sn.pl" / "[sygnatura] site:orzeczenia.ms.gov.pl"

KROK 2: Potwierdź że sygnatura istnieje i prowadzi do właściwego orzeczenia
  → Jeśli baza nie zwraca orzeczenia dla tej sygnatury: ⚠️ [NIEWERYFIKOWANE — brak w oficjalnej bazie]
  → NIE próbuj "blisko pasującej" sygnatury — to generuje fałszywe potwierdzenia

KROK 3: Odczytaj tezę ze źródła — nie parafrazuj z pamięci ani z portalu wtórnego
  LIMIT CYTATU: maksymalnie 30 słów z treści orzeczenia (dziedzinowy override — wyższy niż
  globalny limit 15 słów, uzasadniony koniecznością dokładnego oddania tezy prawnej;
  dotyczy WYŁĄCZNIE cytatów z orzeczeń sądowych; dla przepisów ustawowych limit 15 słów
  pozostaje w mocy)

KROK 4: Sprawdź datę — czy linia orzecznicza jest aktualna? Czy nie została zmieniona nowszym orzeczeniem?

KROK 5: Podaj URL źródłowy razem z sygnaturą
  Format: sygnatura (sąd, data) — teza — ✅ [VER: sn.pl / orzeczenia.ms.gov.pl, RRRR-MM-DD]

KROK 5-RZĄD — KATEGORYZACJA ŹRÓDŁA (dodano 2026-07-15, obowiązkowa dla
KAŻDEGO linku/URL podanego użytkownikowi, nie tylko dla orzeczeń):
  ⛔ Przed podaniem linku → sklasyfikuj domenę wg
     `view shared/HIERARCHIA-ZRODEL.md` (RZĄD 1/2A/2B/3)
     i dołącz odpowiedni znacznik (✅/📚/⚠️📚) OBOK znacznika VER z KROK 5.
  ⛔ Pominięcie kategoryzacji RZĄD przy podaniu linku jest błędem tego
     samego rzędu co brak znacznika VER/NIEWERYFIKOWANE — nie jest to
     krok opcjonalny ani zależny od tego, czy odpowiedź "dotyczy" analizy
     przepisu w wąskim sensie.

KROK 5A — LOKALIZACJA W ŹRÓDLE + KOTWICA (dodano 2026-07-15, na wyraźne
polecenie użytkownika — wdrożenie do samego mechanizmu cytowania, nie
tylko do jednego modułu; rozszerzone 2026-07-15c — SCALENIE z mechanizmem
Text Fragment, który powstał tego samego dnia równolegle w
`shared/WERYFIKACJA-SLAD.md` pod nazwą KOTWICA-TEKSTOWA, nie zauważając
że KROK 5A już istniał — dwie niezależne implementacje tego samego
problemu w dwóch plikach shared/, wykryte przez użytkownika. Ten plik
(PRAWO-HARDGATE.md) jest teraz JEDYNĄ kanoniczną treścią; WERYFIKACJA-SLAD.md
odsyła tutaj zamiast duplikować). Obowiązuje dla KAŻDEGO cytatu/tezy z
orzeczenia LUB z jakiejkolwiek innej strony internetowej (komentarz,
interpretacja, artykuł) — nie tylko dla orzeczeń objętych tym plikiem.
  (a) NUMER STRONY — jeśli źródło jest plikiem stronicowanym (PDF z
      portalu, skan, uzasadnienie do druku): "s. 4" / "k. 12" (akta).
  (b) NUMER TEZY/PUNKTU/AKAPITU — jeśli źródło ma numerację wewnętrzną
      (częste w TSUE/ETPC — akapity numerowane od 1; niektóre uchwały SN).
  (c) NAZWA SEKCJI/NAGŁÓWKA — źródła bez numeracji: podaj dosłowne
      brzmienie najbliższego nagłówka nadrzędnego.
  (d) Brak (a)-(c) w źródle → jawna adnotacja opisowa: "brak wewnętrznej
      numeracji — lokalizacja opisowa: [krótki opis miejsca cytatu]".

  KOTWICA TECHNICZNA — dwa niezależne mechanizmy, stosuj ten, który pasuje
  do platformy źródła (nie wybieraj dowolnie — patrz warunki niżej):

  (i) KOTWICA STRONY/AKAPITU — #page=N (PDF-y otwierane w przeglądarce —
      działa dla większości plików z portali orzeczeń i dla ISAP text.pdf),
      kotwica nagłówka HTML (TYLKO jeśli faktycznie zweryfikowana przez
      web_fetch — zakaz zgadywania nazwy kotwicy), numer akapitu w adresie
      (niektóre bazy TSUE/ETPC udostępniają URL per punkt).

  (ii) KOTWICA-TEKSTOWA / Text Fragment (`#:~:text=...`) — dla stron HTML
      bez własnej kotwicy per akapit (typowe: komentarze, blogi prawnicze,
      portale orzeczeń bez numeracji URL). Mechanizm przeglądarkowy
      obsługiwany przez Chrome/Edge/Brave (silnik Chromium); NIEobsługiwany
      gwarantowanie przez Safari i Firefox — w tych przeglądarkach link
      nadal działa, ale otwiera stronę od góry, bez podświetlenia.

      STOSUJ dla: każdego cytatu dosłownego (poziom FRAGMENT), każdej tezy
      z pinpointem, orzeczeń bez URL per akapit — zawsze obok zwykłego URL.
      NIE stosuj dla: powołań na poziomie ISTNIENIE (spis bez funkcji
      dowodowej), ogólnych parafraz bez konkretnego zdania do wskazania.

      Procedura konstrukcji (KT-1 → KT-4):
      KT-1: Po web_fetch/web_search wybierz NAJKRÓTSZY unikalny fragment
            zdania (4–12 słów) jednoznacznie identyfikujący miejsce
            w źródle.
      KT-2: URL-enkoduj fragment (spacje → %20, polskie znaki → %-formy
            UTF-8). Kopiuj dokładnie z treści zwróconej przez narzędzie —
            nie przepisuj z pamięci (zgodnie z zasadą tego pliku).
      KT-3: Dołącz do URL źródła: `[URL]#:~:text=[fragment-zakodowany]`.
            Opcjonalnie zakres: `#:~:text=[początek],[koniec]`.
      KT-4: Oznacz w śladzie weryfikacji jako 🔗 — NIE jako gwarancję
            działania (patrz zastrzeżenie niżej). Podaj też zwykły URL
            bez fragmentu jako fallback.

      ⚠️ ZASTRZEŻENIE OBOWIĄZKOWE przy każdym 🔗 [KOTWICA-TEKSTOWA]:
      (a) działa zależnie od przeglądarki odbiorcy (Chromium — tak,
          Safari/Firefox — nie, bez błędu, po prostu bez podświetlenia),
      (b) działa tylko, jeśli treść żywej strony nie zmieniła się od
          momentu web_fetch/web_search,
      (c) NIE zastępuje znacznika ✅/🟢 [VER] — to dodatek nawigacyjny,
          nie dowód weryfikacji.
      ⛔ ZAKAZ przedstawiania jako "linku, który na pewno przeniesie do
      cytatu" — zawsze formułuj jako "powinien przewinąć/podświetlić".

      🔻 FALLBACK — gdy KT-1→KT-4 zawodzi (fragment zbyt długi/nieregularny,
      treść z PDF-a, tabele/znaki specjalne psujące dopasowanie, brak
      pewności unikalności) → NIE twórz kotwicy "na siłę". Podaj wyłącznie
      zwykły link bez `#:~:text=`, bez znacznika 🔗, z adnotacją: "kotwica
      tekstowa niemożliwa do skonstruowania — link do strony źródłowej,
      nie do fragmentu".

  ⛔ Wymyślona/niezweryfikowana kotwica (i) lub (ii) jest GORSZA niż jej
  brak — myli czytelnika zamiast mu pomóc. Gdy nie masz pewności → podaj
  sam URL dokumentu (z KROK 5) + lokalizację opisową (a-d), bez kotwicy.
  ⛔ Numer strony/tezy/fragment tekstowy MUSI pochodzić z faktycznie
  przeczytanej treści (web_fetch tej konkretnej strony/akapitu) — nigdy
  z odgadnięcia na podstawie długości/struktury dokumentu.

  Format w śladzie weryfikacji (przykład (ii), z kategoryzacją RZĄD z
  KROK 5-RZĄD wyżej — dwa niezależne, równoległe znaczniki):
  ```
  art. 281 KK — kradzież rozbójnicza wobec osoby trzeciej
    📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: kdkadwokat.pl, 2020-12-13]
    🟢 [VER-TREŚĆ: kdkadwokat.pl, 2026-07-15]
    🔗 [KOTWICA-TEKSTOWA: kdkadwokat.pl/.../#:~:text=Jako%20kradzie%C5%BC...]
  ```

KROK 5B — LINK OBOWIĄZKOWY NAWET GDY TREŚĆ NIEZWERYFIKOWANA (dodano
2026-07-15). Jeśli dotarłeś do źródła tylko przez wynik web_search (widzisz
fragment/indeks, nie pełną treść po web_fetch) — to NIE jest powód, by
pominąć link całkowicie. Podaj URL, który faktycznie zwrócił web_search,
z jawną etykietą stanu weryfikacji:
  ✅ [VER: ...] → gdy treść potwierdzona (KROK 0-4 powyżej) → pełny cytat + link + KROK 5A
  ⚠️ [NIEWERYFIKOWANE — źródło wtórne/tylko fragment] → gdy widziałeś
    wyłącznie snippet/indeks (np. Google, portal wtórny) → NADAL podaj
    URL tego wyniku wyszukiwania, ALE: (1) bez oznaczenia ✅ [VER], (2) bez
    przypisywania tezy jako "ustalonej", (3) z jawnym zdaniem: "źródło
    niezweryfikowane bezpośrednio — link do wyniku wyszukiwania, nie do
    potwierdzonej treści: [URL]". Sam BRAK linku nie jest bezpieczniejszy
    niż link oznaczony jako niezweryfikowany — czytelnik ma prawo sam
    sprawdzić źródło, nawet gdy Ty go nie potwierdziłeś w pełni.
  ⛔ Wyjątek pozostaje wyłącznie dla SYGNATURY/TREŚCI PRZYPISYWANEJ
  KONKRETNEMU SĄDOWI jako "ustalone prawo" (SCENARIUSZ B niżej — sygnatura
  nieistniejąca w oficjalnej bazie nadal musi zniknąć z analizy). KROK 5B
  dotyczy samego LINKU jako informacji pomocniczej, nie podniesienia
  statusu dowodowego niezweryfikowanej treści.
```

## ⛔ KROK 5B — WYROKI TK Z OKRESU 2024-2026: STATUS PUBLIKACJI SPORNY

> Dodano: 2026-06-14 (na podstawie AUDYT-2026-06-13, korekta TK P 10/19).
> Od marca 2024 r. (formalizowane uchwałą RM nr 162 z 18.12.2024) rząd nie
> publikuje wyroków TK w Dz.U., argumentując niewłaściwym składem TK.
> TK utrzymuje (m.in. wyrok 23.09.2025, postanowienie SK 34/24, wyrok P 3/25),
> że publikacja jest "czynnością techniczną" i wyroki wiążą od ogłoszenia.
> Skutek: orzeczenia TK z tego okresu formalnie NIE SĄ w Dz.U., a ich
> "obowiązywanie" jest przedmiotem spornej oceny — część sądów je stosuje,
> część ignoruje.

Dla KAŻDEGO orzeczenia Trybunału Konstytucyjnego z okresu 2024-2026:

```
□ Sprawdź (web_search/web_fetch) czy orzeczenie zostało opublikowane w Dz.U.
□ Jeśli NIE → podaj sygnaturę i tezę normalnie (zgodnie z KROK 1-5), ale
  dodaj zastrzeżenie:
  "⚠️ Status formalny: wyrok TK [sygnatura] nie został opublikowany w Dz.U.
   (spór o skład TK, uchwała RM nr 162/2024). TK uznaje wyrok za wiążący
   od ogłoszenia; część orzecznictwa sądów powszechnych/administracyjnych
   stosuje go, część nie. Rekomendowana weryfikacja aktualnej praktyki
   orzeczniczej sądu właściwego dla sprawy."
□ Jeśli TAK (opublikowany) → standardowe oznaczenie ✅ [VER], bez zastrzeżenia.
```

Zastrzeżenie to NIE zastępuje weryfikacji sygnatury (KROK 1-5) — jest
DODATKOWE i obowiązkowe dla wszystkich orzeczeń TK z lat 2024-2026.

### Jeśli weryfikacja sygnatury się nie powiedzie

```
SCENARIUSZ A — źródło oficjalne niedostępne (timeout, blokada):
  → Oznacz: ⚠️ [NIEWERYFIKOWANE — oficjalna baza chwilowo niedostępna]
  → Podaj zasadę prawną BEZ sygnatury: "SN przyjął, że... (sygnatura nieweryfikowana)"
  → Wyraźnie zaznacz że sygnatura pochodzi ze źródła wtórnego i wymaga sprawdzenia

SCENARIUSZ B — sygnatura nie istnieje w oficjalnej bazie:
  → ⛔ USUŃ sygnaturę z analizy/pisma całkowicie
  → Podaj zasadę prawną BEZ sygnatury lub pomiń orzeczenie
  → Komunikat: "Sygnatura [X] nie została potwierdzona w oficjalnych bazach —
     pominięto w analizie zgodnie z PRAWO-HARDGATE."

SCENARIUSZ C — sygnatura istnieje, ale teza jest inna niż podano w źródle wtórnym:
  → Użyj WYŁĄCZNIE tezy z oficjalnej bazy
  → Zaznacz rozbieżność: "Źródło wtórne cytowało tę sygnaturę w innym kontekście —
     użyto tezy z oficjalnej bazy sn.pl."
```

## ⛔ KROK DODATKOWY — WERYFIKACJA ROLI CYTOWANEGO FRAGMENTU (dodano
2026-08-14, na żądanie użytkownika: sprawdzić, czy system rozróżnia
ustalenie sądu / wykładnię prawa / twierdzenie strony — ODPOWIEDŹ PO
AUDYCIE: NIE rozróżniał. To naprawia lukę.)

⭐⭐⭐ ISTNIENIE sygnatury + ZGODNOŚĆ tezy z oficjalną bazą (Scenariusze
A-C wyżej) POTWIERDZAJĄ, że cytat POCHODZI z prawdziwego dokumentu —
ALE NIE MÓWIĄ NIC o tym, CZYJĄ WYPOWIEDŹ w tym dokumencie cytujesz.
Każde uzasadnienie orzeczenia typowo zawiera TRZY różne warstwy
tekstu o zupełnie różnej wartości dowodowej dla pisma procesowego:

```
[1] USTALENIE/ROZSTRZYGNIĘCIE SĄDU — to, co sąd SAM stwierdził jako
    wynik swojej oceny (zwykle w części "Sąd zważył, co następuje"
    / "Sąd Najwyższy zważył" / sentencja) — ⭐⭐⭐ JEDYNA warstwa o
    PEŁNEJ wartości precedensowej, właściwa do powołania jako "sąd
    orzekł, że..." / "sąd przyjął, że..."

[2] WYKŁADNIA PRAWA dokonana przez sąd — interpretacja przepisu,
    zasady, doktryny PRZEZ sąd (może występować w części ustaleń,
    ale też w obszerniejszych wywodach uzasadnienia) — ⭐⭐ WYSOKA
    wartość, właściwa do powołania jako "sąd wyjaśnił, że..." /
    "zgodnie z wykładnią przyjętą przez..."

[3] ZREFEROWANE TWIERDZENIE STRONY — fragment, w którym sąd
    STRESZCZA lub PRZYTACZA argumentację powoda/pozwanego/skarżącego
    (typowo w części "Stan faktyczny"/"Stanowiska stron"/opis
    zarzutów apelacji/kasacji, PRZED właściwym wywodem sądu) — ⭐
    NISKA LUB ZEROWA wartość dla pisma procesowego, GDY cytowana
    SAMODZIELNIE, bez zaznaczenia że to relacja, nie stanowisko sądu.
    ⛔ SZCZEGÓLNIE MYLĄCE, gdy sąd TO twierdzenie ODRZUCIŁ lub w ogóle
    się do niego nie ustosunkował merytorycznie — cytowanie go jako
    "sąd stwierdził" byłoby WPROST NIEPRAWDZIWE, mimo że tekst
    dosłownie pochodzi z autentycznego dokumentu sądowego
```

⭐⭐⭐ SYGNAŁY TEKSTOWE do rozpoznania warstwy [3] (⭐ NIE wyczerpujące,
ale najbardziej typowe wzorce redakcyjne polskich uzasadnień):
```
- "Powód/powódka podniósł/podniosła, że..."
- "Pozwany wywodził, iż..."
- "Skarżący w apelacji/kasacji zarzucił..."
- "Zdaniem strony powodowej..."
- "W ocenie wnoszącego skargę kasacyjną..."
- Cały fragment występuje PRZED zwrotem strukturalnym w rodzaju
  "Sąd zważył, co następuje" / "Sąd Najwyższy zważył" / "Rozpoznając
  [środek zaskarżenia], Sąd/Trybunał uznał" — fragmenty PRZED tym
  zwrotem w uzasadnieniach polskich sądów typowo relacjonują STAN
  SPRAWY i STANOWISKA STRON, nie własną ocenę sądu
```

⭐⭐⭐ PROCEDURA OBOWIĄZKOWA: PRZED powołaniem JAKIEGOKOLWIEK cytatu z
orzeczenia jako poparcia tezy w piśmie procesowym — ustal, z KTÓREJ
warstwy [1]/[2]/[3] pochodzi (patrz web_fetch treści źródłowej, nie
tylko sam tekst cytatu bez kontekstu). Jeżeli fragment pochodzi z
warstwy [3] (twierdzenie strony):
  → NIE cytuj go jako stanowisko/ustalenie SĄDU
  → JEŻELI mimo to wartościowy kontekstowo (np. pokazuje argumentację,
    którą sąd PÓŹNIEJ odrzucił lub przyjął) — cytuj WYRAŹNIE oznaczone:
    "Powód argumentował, że [cytat], CO SĄD [uznał za zasadne /
    ODRZUCIŁ jako..., wskazując że...]" — z jasnym wskazaniem
    OSTATECZNEGO stanowiska sądu, nie samego twierdzenia strony w
    oderwaniu od rozstrzygnięcia
  → JEŻELI sąd w ogóle nie odniósł się merytorycznie do tego
    twierdzenia (np. sprawa rozstrzygnięta na innej podstawie) —
    fragment [3] NIE NADAJE SIĘ do powołania jako poparcie tezy w
    piśmie procesowym W OGÓLE — pomiń, nie cytuj

⚠️ TA WERYFIKACJA JEST DODATKOWA względem Scenariuszy A-C (istnienie/
zgodność tezy) — WSZYSTKIE poziomy muszą być spełnione łącznie:
sygnatura prawdziwa (Scenariusz B) + teza zgodna z oficjalną bazą
(Scenariusz C) + cytat pochodzi z warstwy [1] lub [2], nie [3] (ten
krok). Spełnienie tylko pierwszych dwóch, przy zignorowaniu tego
trzeciego, PROWADZI DOKŁADNIE do tego samego typu ryzyka co sprawa
I FZ 104/26 (patrz precedens niżej) — z tą różnicą, że TAM były
błędne DATY/TEZY, TU cytat może być w 100% dosłownie poprawny, a
mimo to WPROWADZAĆ W BŁĄD co do tego, KTO faktycznie tak twierdzi.

> ⭐⭐⭐ PRECEDENS UZASADNIAJĄCY SCENARIUSZ C (dodano 2026-08-14, na
> żądanie użytkownika) — postanowienie NSA z 23.06.2026, sygn.
> **I FZ 104/26** (skład: SSNSA Sylwester Marciniak), ✅ zweryfikowane
> 8+ zgodnych źródeł (rp.pl, infor.pl, inforlex.pl [pełny tekst],
> gazetaprawna.pl, lex.media.pl, forsal.pl, taxbooster.pl, telko.in).
>
> Pełnomocnik w zażaleniu (sprawa o wstrzymanie wykonania decyzji VAT,
> art. 61 §3 PPSA) powołał TRZY sygnatury NSA: II FZ 230/17, II GZ
> 452/18, I GZ 164/22 — WSZYSTKIE TRZY SĄ PRAWDZIWE i REALNIE ISTNIEJĄ
> w CBOSA (⭐⭐⭐ to NIE był Scenariusz B — sygnatury nie były zmyślone).
> NSA ustalił: (1) każde z tych postanowień zostało wydane W INNEJ
> DACIE niż podana przez pełnomocnika; (2) ŻADNE nie dotyczyło
> wstrzymania wykonania (art. 61 §3 PPSA) — dotyczyły braków
> formalnych skargi i przywrócenia terminu; (3) we wszystkich trzech
> zażalenia skarżących zostały ODDALONE, a uzasadnienia NIE zawierały
> tez, które pełnomocnik im przypisał (o nadmiernym formalizmie sądu,
> obowiązku poszukiwania okoliczności w aktach administracyjnych).
>
> NSA wprost nazwał to "jednoznacznie widocznymi śladami tzw.
> halucynacji AI" i ocenił "nader krytycznie bezrefleksyjne
> korzystanie z narzędzi AI przez zawodowego pełnomocnika" — z
> naciskiem na wymiar ETYCZNY (klient płaci za profesjonalną usługę,
> nie za nieweryfikowany output narzędzia dostępnego każdemu).
>
> ⭐⭐⭐ DLACZEGO TO WAŻNIEJSZE niż zmyślona sygnatura (Scenariusz B):
> weryfikacja "czy sygnatura istnieje" (KROK 0/1 wyżej) NIE WYSTARCZY
> samodzielnie — sygnatura może być w 100% prawdziwa, a MIMO TO cały
> "cytat" być halucynacją, jeśli data/przedmiot/teza nie zostały
> zweryfikowane WPROST z treścią orzeczenia pod TĄ sygnaturą. To
> dokładnie mechanizm, przed którym chroni Scenariusz C — ten
> precedens jest jego rzeczywistym uzasadnieniem, nie tylko
> teoretycznym ryzykiem.

## SELF-CHECK PRZED KAŻDĄ ODPOWIEDZIĄ Z ORZECZNICTWEM

Przed wysłaniem odpowiedzi zawierającej sygnaturę orzeczenia odpowiedz na każde pytanie:

```
□ Czy sygnatura pochodzi z oficjalnej bazy (sn.pl / orzeczenia.ms.gov.pl / nsa.gov.pl)?
    TAK → ✅ [VER: źródło, data] — możesz podać
    NIE → ⚠️ [NIEWERYFIKOWANE] — usuń sygnaturę lub oznacz jako nieweryfikowaną

□ Czy web_fetch / web_search faktycznie zwróciły treść orzeczenia pod tą sygnaturą?
    TAK → kontynuuj
    NIE (snippet z portalu wtórnego) → BRAMKA WTÓRNE-ŹRÓDŁO-STOP — NIE podawaj
        sygnatury jako ustalonego prawa, ALE (KROK 5B) NADAL podaj URL wyniku
        wyszukiwania z jawną etykietą "⚠️ [NIEWERYFIKOWANE — link do wyniku
        wyszukiwania, nie do potwierdzonej treści]" — link nie znika, znika
        tylko status "ustalone"

□ Czy teza, którą cytujesz, pochodzi dosłownie z bazy oficjalnej?
    TAK → użyj
    NIE (parafrazujesz z pamięci lub portalu) → użyj sformułowania "SN przyjął, że..."
        bez sygnatury, z adnotacją ⚠️ [NIEWERYFIKOWANE]

□ Czy sprawdziłeś czy ta linia orzecznicza nie została zmieniona nowszym orzeczeniem?
    TAK → ✅ aktualne
    NIE → dodaj adnotację "aktualność linii orzeczniczej nieweryfikowana"

□ Czy podałeś LOKALIZACJĘ w źródle (strona/teza/punkt/sekcja — KROK 5A) dla
  KAŻDEGO cytatu, nie tylko sam URL dokumentu?
    TAK → kontynuuj
    NIE → uzupełnij przed wysłaniem odpowiedzi — sam URL bez wskazania
        MIEJSCA w dokumencie jest niekompletny wg KROK 5A

□ Czy dodałeś kotwicę techniczną (#page=N lub inną), i czy była ZWERYFIKOWANA
  (nie zgadnięta)?
    TAK, zweryfikowana → dodaj
    Niepewna/niezweryfikowana → NIE dodawaj kotwicy, zostaw sam URL + lokalizację opisową

□ (dodano 2026-07-17, v2.4) Czy w tej odpowiedzi PONOWNIE użyto oznaczenia/
  skrótu prawnego (np. nazwy rejestru, repertorium, symbolu aktu), które
  wcześniej w TEJ ROZMOWIE nie zostało jednoznacznie potwierdzone źródłowo?
    TAK → wykonaj NOWĄ weryfikację w tym kroku (nie przywołuj z pamięci
        wcześniejszej hipotezy, nawet własnej) → jeśli pierwsze zapytanie
        nie da potwierdzenia, wypróbuj RÓŻNE zapytania (pełna nazwa,
        synonim, szersze/węższe ujęcie) zanim uznasz brak wyniku →
        każde KOLEJNE wystąpienie tego oznaczenia w odpowiedzi/dokumencie
        musi mieć widoczne ⚠️ [NIEWERYFIKOWANE] OBOK SIEBIE, nie tylko przy
        pierwszym wprowadzeniu
    NIE → kontynuuj

□ (dodano 2026-08-14, na żądanie użytkownika) Czy ustaliłeś, z KTÓREJ
  warstwy uzasadnienia pochodzi cytat — [1] ustalenie/rozstrzygnięcie
  SĄDU, [2] wykładnia prawa DOKONANA przez sąd, czy [3] zreferowane
  TWIERDZENIE STRONY (patrz "KROK DODATKOWY — WERYFIKACJA ROLI
  CYTOWANEGO FRAGMENTU" wyżej)?
    [1] lub [2] → możesz cytować jako stanowisko sądu
    [3] → NIE cytuj jako "sąd stwierdził" — albo pomiń, albo zacytuj
        WYRAŹNIE jako twierdzenie strony Z jednoczesnym wskazaniem
        jak sąd OSTATECZNIE się do niego odniósł (przyjął/odrzucił/
        nie rozpoznał)
    Niepewne (nie sprawdziłeś kontekstu, tylko wyrwany cytat) → WRÓĆ
        do źródła (web_fetch) i ustal kontekst PRZED wysłaniem — nie
        zgaduj na podstawie samej treści zdania
```

**Zasada finalna:** Lepiej podać zasadę prawną bez sygnatury niż sygnaturę nieistniejącą lub niepasującą.


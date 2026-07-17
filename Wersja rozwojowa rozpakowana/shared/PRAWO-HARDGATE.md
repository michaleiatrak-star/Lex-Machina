# PRAWO-HARDGATE — Zakaz cytowania prawa i orzeczeń z pamięci

> **Wersja:** 2.4 (2026-07-17) — ZASADA PONOWNEJ WERYFIKACJI OZNACZEŃ +
> WYTRWAŁOŚĆ WYSZUKIWANIA + OZNACZANIE PRZY KAŻDYM UŻYCIU. Dodano na
> wyraźne polecenie użytkownika jako "reguła na przyszłość", po incydencie
> z niepotwierdzonym oznaczeniem/skrótem prawnym (repertorium postępowań
> sprawdzających), gdzie pierwsze zapytanie wyszukiwania ("S og" wprost)
> nie dało jednoznacznego potwierdzenia z aktu źródłowego, a model
> zatrzymał się na hipotezie prawdopodobieństwa zamiast kontynuować
> wyszukiwanie innymi zapytaniami. Zarejestrowane też jako ZASADA 13 w
> `audyt-systemu-v4/SKILL.md` (STAŁA — nie precedens).
>
> **Trzy elementy tej wersji:**
> 1. **Ponowna weryfikacja przy powtórnym użyciu:** każde niepotwierdzone
>    źródłowo oznaczenie/skrót prawny, gdy pojawia się PONOWNIE w dalszej
>    części rozmowy jako podstawa wniosku, wymaga NOWEJ weryfikacji przed
>    użyciem — nie wystarczy przywołanie z pamięci wcześniejszej hipotezy,
>    NAWET WŁASNEJ. To rozszerza PERMANENT GATE (linia 37-42 niżej) z
>    "każde nowe powołanie = osobny web_search" na wyraźne uwzględnienie
>    przypadku, gdy wcześniejsze "powołanie" było tylko hipotezą modelu,
>    nie potwierdzoną treścią — taka hipoteza NIE zyskuje statusu ustalonego
>    faktu tylko dlatego, że pojawiła się już wcześniej w tej rozmowie.
> 2. **Wytrwałość wyszukiwania — różne zapytania, nie jedna próba:** jeśli
>    pierwsze wyszukiwanie nie daje jednoznacznego potwierdzenia z aktu
>    źródłowego (regulaminu, ustawy, zarządzenia) — kontynuuj wyszukiwanie
>    RÓŻNYMI zapytaniami (np. pełną nazwą instytucji/rejestru zamiast
>    samego skrótu, synonimami, szerszym/węższym ujęciem frazy), zamiast
>    zatrzymywać się na pierwszej hipotezie prawdopodobieństwa. Przykład z
>    incydentu: "repertorium postępowań sprawdzających" jako zapytanie
>    zamiast poprzestania na samym skrócie "S og" wprost.
> 3. **Oznaczanie przy KAŻDYM użyciu, nie tylko przy pierwszym wprowadzeniu:**
>    wniosek oparty na niepotwierdzonym oznaczeniu musi mieć widoczne
>    ⚠️ [NIEWERYFIKOWANE] PRZY KAŻDYM wystąpieniu w odpowiedzi/dokumencie —
>    jednorazowe zastrzeżenie przy pierwszym wprowadzeniu skrótu nie
>    zwalnia z ponownego oznaczenia, gdy ten sam skrót jest używany dalej
>    jako podstawa kolejnych zdań/wniosków. Czytelnik nie powinien nigdy
>    natrafić na użycie niepotwierdzonego oznaczenia bez oznaczenia obok.
>
> **Wersja poprzednia:** 2.3 (2026-07-15c) — SCALENIE: mechanizm KOTWICA-TEKSTOWA
> (Text Fragment `#:~:text=`, procedura KT-1→KT-4, FALLBACK, zastrzeżenie
> o wsparciu przeglądarek) przeniesiony tutaj z `shared/WERYFIKACJA-SLAD.md`,
> gdzie powstał niezależnie tego samego dnia (2026-07-15) co KROK 5A w tym
> pliku — dwie osobne implementacje tego samego problemu w dwóch plikach
> shared/, nie połączone przy tworzeniu. Wykryte przez użytkownika po tym,
> jak odpowiedź spoza modułu analizy przepisów (dr-03, analiza karna)
> zawierała cytaty bez żadnej kotwicy — ani z KROK 5A (który akurat nie był
> wczytany w tamtej odpowiedzi), ani z WERYFIKACJA-SLAD.md (do którego
> dodano punktowe odesłanie zamiast sprawdzić najpierw, czy centralny hard
> gate już tego nie zawiera). KROK 5A jest teraz jedyną kanoniczną treścią;
> `WERYFIKACJA-SLAD.md` odsyła tutaj. Pełny opis: AUDIT-JOURNAL.md, wpis
> AUDYT-2026-07-15c (rozszerzenie).
> **Wersja poprzednia:** 2.2 (2026-07-15b) — dodano KROK 5-RZĄD: obowiązkowa
> kategoryzacja źródła (RZĄD 1/2A/2B/3, `shared/HIERARCHIA-ZRODEL.md`)
> OBOK znacznika VER przy każdym linku, nie tylko w module analizy
> przepisów. Rozszerzono BRAMKĘ WTÓRNE-ŹRÓDŁO-STOP o odesłanie do tej
> samej kategoryzacji. Zgłoszone przez użytkownika po tym, jak w rozmowie
> podano linki do stron indywidualnych kancelarii (Rząd 3) bez kategoryzacji.
> **Wersja poprzednia:** 2.1 (2026-07-15) — dodano KROK 5A (lokalizacja w źródle:
> strona/teza/punkt/sekcja + kotwica techniczna gdy zweryfikowana) i
> KROK 5B (link zawsze obowiązkowy, nawet gdy treść tylko z web_search
> bez pełnego web_fetch — nie wolno pomijać linku z powodu braku pełnej
> weryfikacji, tylko obniżyć jego status na ⚠️ [NIEWERYFIKOWANE]).
> Wdrożone na wyraźne polecenie użytkownika, do mechanizmu cytowania jako
> takiego (nie punktowo do jednego modułu) — dotyczy KAŻDEGO cytatu z
> orzeczenia, przepisu LUB dowolnej innej strony internetowej.
> Poprzednia wersja 2.0 (2026-07-05) — WARSTWA STRUKTURALNA (ŹRÓDŁO-0):
> deterministyczne API (ELI Sejm / SAOS / CELLAR) i konektory MCP przed web_search.
> Wzorce: prawo-pl-eli, legal-cite-pl, mcp-isap, sententim (AUDYT-2026-07-05a).
>
> ⛔ HARD GATE — BEZWZGLĘDNY. Aktywny we wszystkich skillach, modułach i krokach systemu.
> Nie ma wyjątków. Nie ma trybu "szybkiego". Nie ma trybu "wiem na pewno".
>
> ⛔ PERMANENT GATE — OBOWIĄZUJE PRZEZ CAŁĄ ROZMOWĘ
> Zakaz nie wygasa po żadnej liczbie wiadomości w sesji.
> Każde nowe powołanie artykułu, sygnatury lub liczby = osobny web_search/web_fetch
> w tej samej odpowiedzi — nawet jeśli był weryfikowany wcześniej w tej rozmowie.
> Nawet jeśli model "jest pewny" treści przepisu — weryfikacja jest obowiązkowa.
> Brak dostępu do źródeł → ⚠️ [NIEWERYFIKOWANE] + komunikat. Nigdy nie pomijaj oznaczenia.
> Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl

## ZASADA ABSOLUTNA

**ZAKAZ** podawania jakiegokolwiek przepisu, artykułu, paragrafu, ustępu, punktu, numeru Dz.U., daty aktu, brzmienia normy, stawki, terminu ustawowego, kary, sankcji lub sygnatury orzeczenia — bez uprzedniej weryfikacji online w tym samym kroku.

Dotyczy KAŻDEJ dziedziny prawa: cywilnego, karnego, pracy, administracyjnego, podatkowego, budowlanego, UE i wszystkich pozostałych.

## CO JEST ZAKAZANE

- Podanie artykułu "z pamięci" nawet gdy model jest pewny jego brzmienia
- Podanie numeru Dz.U. bez sprawdzenia tekstu jednolitego
- Podanie kary / stawki / terminu bez weryfikacji aktualnego brzmienia
- Podanie sygnatury orzeczenia bez weryfikacji że orzeczenie istnieje pod tym numerem
- Cytowanie fragmentu przepisu bez sprawdzenia aktualnego tekstu na isap.sejm.gov.pl
- Powoływanie się na "ugruntowaną linię orzeczniczą" bez sprawdzenia aktualnych orzeczeń

## REGUŁA AKTUALNOŚCI — BEZWZGLĘDNA

> ⛔ ZAWSZE i DOMYŚLNIE używaj WYŁĄCZNIE najnowszego obowiązującego tekstu jednolitego (t.j.).
>
> ZAKAZ powoływania się na starszy t.j. gdy istnieje nowszy, nawet jeśli różnica jest niewielka.
> ZAKAZ cytowania przepisu z t.j. który nie jest najnowszym ogłoszonym tekstem jednolitym.
>
> Weryfikacja sekwencja:
>   1. PREFEROWANE (deterministyczne): web_fetch / narzędzie MCP na
>      https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references
>      → odczytaj łańcuch "Tekst jednolity" — najnowsza pozycja = obowiązujący t.j.
>      (patrz sekcja "WARSTWA STRUKTURALNA (ŹRÓDŁO-0)").
>   2. Fallback: sprawdź na isap.sejm.gov.pl jaki jest NAJNOWSZY t.j. danego aktu.
>   3. Jeśli od najnowszego t.j. były nowelizacje — wskaż je jako "(ze zm. Dz.U. YYYY poz. NNN)".
>   4. Dopiero na tej podstawie cytuj przepis.
>
> Standardowy format cytowania:
>   art. X ustawy z dnia [...] (t.j. Dz.U. z RRRR r. poz. NNN[, ze zm.])
>
> ⛔ ZAKAZ formatu: "Dz.U. 2022 poz. XYZ" gdy istnieje t.j. 2025 lub 2026.
> ⛔ ZAKAZ używania t.j. starszego niż najnowszy dostępny — nawet gdy moduł podaje inny rok.
> Jeśli t.j. w module jest starszy niż najnowszy na ISAP: użyj najnowszego z ISAP.

## ⚙️ WARSTWA STRUKTURALNA (ŹRÓDŁO-0) — API zamiast wyszukiwarki

> Dodano: 2026-07-05 (AUDYT-2026-07-05a). Wzorce: prawo-pl-eli (ELI Sejm),
> legal-cite-pl / mcp-isap (strukturalny odczyt aktu po identyfikatorze),
> sententim (deterministyczna weryfikacja sygnatur), prawo-pl-saos (SAOS API).
>
> **Zasada:** web_search to wyszukiwarka ogólnego przeznaczenia — może trafić na
> nieaktualną kopię, forum lub komentarz. Strukturalne API pytamy o KONKRETNY
> identyfikator aktu/orzeczenia i dostajemy odpowiedź deterministyczną.
> Dlatego API/MCP są ZAWSZE pierwszym wyborem, a web_search — fallbackiem.

**Hierarchia narzędzi weryfikacji (od najsilniejszego):**

```
POZIOM A — konektor MCP (gdy skonfigurowany w środowisku):
  get_act / verify_article        (mcp-isap, legal-cite-pl)  → akty Dz.U./M.P.
  verify_signature / search_judgments (sententim)            → sygnatury (kontrakt FOUND/NOT_FOUND/AMBIGUOUS)
  narzędzia SAOS / KIO / EUR-Lex  (prawo-pl-saos, kio-orzeczenia-mcp, prawo-eu-eurlex)

POZIOM B — bezpośredni web_fetch na strukturalne API (działa bez MCP):
  Akty PL (ELI Sejm):  https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}            → metadane (status, wejście w życie)
                       https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references → nowelizacje, TEKST JEDNOLITY
                       https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/text.html  → pełny tekst aktu
  Orzeczenia (SAOS):   https://www.saos.org.pl/api/search/judgments?caseNumber={sygnatura}
  Prawo UE (CELLAR):   https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:{celex}
                       (wersje skonsolidowane: CELEX 0{...}-{YYYYMMDD})

POZIOM C — web_search / web_fetch na strony (dotychczasowe ŹRÓDŁO-1..3 poniżej):
  stosuj TYLKO gdy POZIOM A i B niedostępne lub nie znasz identyfikatora aktu
  (wtedy web_search służy do USTALENIA identyfikatora, a cytat i tak pobierz z POZIOMU A/B).
```

**Reguły warstwy strukturalnej:**

1. Wynik z POZIOMU A/B oznaczaj: `✅ [VER: api.sejm.gov.pl ELI DU/RRRR/NNN, data]`
   lub `✅ [VER: saos.org.pl API, data]` — to znacznik silniejszy niż web-fallback.
2. Weryfikację t.j. wykonuj przez endpoint `/references` (typ „Tekst jednolity") —
   NIE przez web_search. Endpoint zwraca pełny łańcuch t.j.; najnowszy = obowiązujący.
   Narzędzie/endpoint ostrzega też o nowelizacjach PO tekście jednolitym — nałóż je
   i sprawdź vacatio legis względem daty zdarzenia.
3. Akt OGŁOSZONY ≠ OBOWIĄZUJĄCY: z metadanych ELI odczytaj datę wejścia w życie
   i status; przy nowelizacji sprawdź artykuł „wchodzi w życie" (różne daty dla
   różnych jednostek redakcyjnych).
4. Brak aktu/orzeczenia w odpowiedzi API ≠ dowód nieistnienia, jeżeli API nie
   pokrywa danego zakresu (np. SAOS nie indeksuje NSA/WSA; indeksacja ELI bywa
   opóźniona). Wtedy przejdź na POZIOM C i zaznacz ograniczenie pokrycia.
5. Do dosłownego cytatu w piśmie/umowie preferuj urzędowy PDF t.j. (ELI `text.pdf`),
   bo konwersja HTML bywa zlepiona.

## PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM PRZEPISEM

```
KROK 1: Zidentyfikuj akt prawny (nazwa ustawy / kodeksu)

KROK 2: Weryfikacja online — sekwencja ŹRÓDEŁ (zatrzymaj się na pierwszym działającym):

  ŹRÓDŁO-0 (strukturalne, deterministyczne — ZAWSZE próbuj przed wszystkimi):
    Konektor MCP (get_act / verify_article / verify_signature) — gdy dostępny,
    lub web_fetch: https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}[/references|/text.html]
    → Wynik ✅: użyj. Znacznik: ✅ [VER: api.sejm.gov.pl ELI DU/RRRR/NNN, data]
    → Nie znasz roku/pozycji aktu → ustal je (ŹRÓDŁO-1/3), potem WRÓĆ do ŹRÓDŁO-0 po treść.
    → Szczegóły i reguły: sekcja "WARSTWA STRUKTURALNA (ŹRÓDŁO-0)" powyżej.

  ŹRÓDŁO-1 (autorytatywne, bezpłatne — gdy ŹRÓDŁO-0 niedostępne):
    web_search: "art. X [nazwa ustawy] isap.sejm.gov.pl tekst jednolity"
    lub web_fetch: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=[Dz.U.]
    → Wynik ✅ ISAP: użyj. Znacznik: ✅ [VER: ISAP, data]

  ŹRÓDŁO-2 (komercyjne — gdy ISAP niedostępny i kancelaria posiada dostęp):
    web_fetch: https://sip.lex.pl (Wolters Kluwer LEX)
    lub web_fetch: https://sip.legalis.pl (C.H.Beck Legalis)
    → Wynik ✅ LEX/Legalis: użyj. Znacznik: ✅ [VER: LEX/Legalis, data]
    ⚠️ UWAGA: LEX/Legalis wymagają aktywnej licencji kancelarii.
    Dla trybu PRAWNIK: stosuj równoważnie do ISAP.
    Dla trybu LAIK (pro se): poinformuj że weryfikacja pochodzi z bazy komercyjnej
      i zalecaj samodzielną weryfikację na isap.sejm.gov.pl (bezpłatny dostęp).

  ŹRÓDŁO-3 (szerokie — ostateczny fallback sieciowy):
    web_search: "art. X [ustawa] [rok bieżący] tekst obowiązujący"
    lub web_fetch: https://www.saos.org.pl (jeśli kontekst orzeczniczy)
    → Wynik ✅: użyj TYLKO tekstu z oficjalnego fragmentu (gov.pl, lex.pl, legalis.pl).
    Znacznik: ✅ [VER: web-fallback, data] + dopisz ⚠️ [ZALECANA WERYFIKACJA ISAP]

  WSZYSTKIE ŹRÓDŁA NIEDOSTĘPNE:
    → ⛔ BLOKADA TWARDA — NIE podawaj przepisu z pamięci
    → Oznacz: ⚠️ [NIEWERYFIKOWANE — wszystkie źródła niedostępne]
    → Komunikat do użytkownika:
       "Nie mogę zweryfikować art. X [ustawy] — źródła online chwilowo niedostępne.
        Proszę sprawdzić samodzielnie na isap.sejm.gov.pl lub w LEX/Legalis
        przed podpisaniem pisma / podjęciem działania prawnego."
    → Kontynuuj analizę BEZ podawania treści przepisu — użyj opisu funkcjonalnego.
    → NIE blokuj całej sesji — oznaczaj każdy niesprawdzony artykuł z osobna.

KROK 3: Znajdź artykuł → odczytaj AKTUALNE brzmienie ze źródła
KROK 4: Sprawdź datę "stan na dzień" — czy obowiązuje w dacie zdarzenia?
KROK 5: Zapisz pełne oznaczenie: art. X §Y ustawy z dnia [...] (t.j. Dz.U. z [...] r. poz. [...])
KROK 5A: Dołącz URL źródła (ISAP text.html/text.pdf, ELI) + gdy to PDF —
  kotwica #page=N do konkretnej strony z tym przepisem, jeśli znana z
  faktycznie przeczytanej treści (nie zgadnięta). Ten sam wymóg linku i
  lokalizacji co dla orzeczeń (patrz "PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM
  ORZECZENIEM", KROK 5A/5B) — dotyczy każdego źródła na stronie internetowej,
  nie tylko orzeczeń. Gdy dotarłeś tylko przez web_search bez pełnego
  web_fetch → podaj link mimo to, z adnotacją ⚠️ [NIEWERYFIKOWANE — link
  do wyniku wyszukiwania], zamiast go pomijać.
KROK 6: Dopiero teraz użyj przepisu w analizie lub piśmie
```

## ⛔ KROK 2B — WERYFIKACJA PRZEDMIOTU AKTU (nie tylko numeru Dz.U.)

> Dodano: 2026-06-14 (na podstawie AUDYT-2026-06-13b, NOTA-5).
> Nowy typ błędu: "prawdziwy cytat w złym kontekście" — numer Dz.U. ISTNIEJE
> i jest prawdziwy, ale dotyczy INNEGO aktu/zakresu niż ten, do którego
> jest przywołany w module.

**Potwierdzenie istnienia Dz.U. NIE jest równoznaczne z potwierdzeniem,
że ten akt reguluje tezę, którą się nim popiera.**

Przed użyciem jakiegokolwiek "Dz.U. RRRR poz. NNN" jako podstawy KONKRETNEJ
tezy (kwoty, taryfikatora, stawki, terminu, instytucji prawnej):

```
KROK 2B-1: Po znalezieniu Dz.U. RRRR poz. NNN na ISAP — odczytaj TYTUŁ aktu
           (pełną nazwę: "Rozporządzenie [organ] z dnia [...] w sprawie [...]"
           lub "Ustawa z dnia [...] o [...]").

KROK 2B-2: Porównaj TYTUŁ aktu z TEZĄ, którą chcesz poprzeć.
           Czy tytuł faktycznie odnosi się do tego zagadnienia
           (np. "taryfikator mandatów" vs "ewidencja punktów karnych" —
           to SĄ RÓŻNE akty, mimo że dotyczą tej samej dziedziny — ruchu
           drogowego, i mogą mieć zbliżone daty/numery)?

KROK 2B-3: Jeśli tytuł NIE odpowiada tezie → ⛔ NIE używaj tego Dz.U.
           Wyszukaj prawidłową podstawę osobnym zapytaniem
           ("[teza] podstawa prawna [rok] isap").

KROK 2B-4: Dopiero gdy tytuł aktu wprost odpowiada tezie → kontynuuj KROK 3.
```

⛔ ZAKAZ: oznaczania ✅ [VER: ISAP, data] na podstawie samego potwierdzenia,
że numer Dz.U. istnieje. Znacznik ✅ [VER] wymaga potwierdzenia ISTNIENIA
ORAZ PRZEDMIOTU (tytułu) aktu zgodnego z tezą.

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
     `view /mnt/skills/user/shared/HIERARCHIA-ZRODEL.md` (RZĄD 1/2A/2B/3)
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

## SKUTKI NARUSZENIA

Naruszenie tego hardgate = błąd dyskredytujący całą analizę lub pismo.
Halucynacja przepisu lub sygnatury = ryzyko odpowiedzialności i utraty sprawy przez klienta.

## JEDYNY DOZWOLONY WYJĄTEK

Ogólne zasady procesowe powszechnie znane (np. "ciężar dowodu spoczywa na powodzie") mogą być podawane bez cytowania artykułu — ale BEZ podawania numeru przepisu jeśli nie był on weryfikowany online w tej samej odpowiedzi.

Zasada: **brak numeru artykułu jest lepszy niż błędny numer artykułu.**
Zasada: **brak sygnatury jest lepszy niż sygnatura nieweryfikowana lub fałszywa.**

---

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
```

**Zasada finalna:** Lepiej podać zasadę prawną bez sygnatury niż sygnaturę nieistniejącą lub niepasującą.


# mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci

**Wersja:** 1.0 | **Dodano:** 2026-07-19
**Rola w systemie:** odpowiedź na pytanie użytkownika o zależność stawki
VAT od klasyfikacji tego SAMEGO fizycznie produktu (przykład: rękawice
nitrylowe robocze vs medyczne) — z budową bazy analogicznych przypadków.

> ⛔ HARDGATE — stawki VAT i przypisania PKWiU/CN bywają zmieniane
> rozporządzeniami i WIS — zweryfikuj AKTUALNY stan na ISAP/w bazie WIS
> (podatki.gov.pl) PRZED zastosowaniem w konkretnej sprawie. Ceny/kody w
> tym module to ilustracja MECHANIZMU, nie gwarancja aktualności.

---

## 0. ⭐ KOREKTA TERMINOLOGICZNA — PKD to NIE jest kod decydujący o stawce VAT

**Ważne rozróżnienie na wstępie:** stawka VAT na TOWAR nigdy nie zależy
od kodu **PKD** (Polska Klasyfikacja Działalności — klasyfikuje RODZAJ
DZIAŁALNOŚCI GOSPODARCZEJ podatnika, np. "47.19.Z — pozostała sprzedaż
detaliczna"). PKD to kategoria REJESTROWA/statystyczna dotycząca FIRMY,
nie towaru. Stawkę VAT na KONKRETNY TOWAR determinują:
```
□ PKWiU (Polska Klasyfikacja Wyrobów i Usług) — klasyfikacja SAMEGO
  TOWARU/USŁUGI, używana w załącznikach do ustawy VAT wskazujących
  stawki obniżone
□ CN (Nomenklatura Scalona, Combined Nomenclature) — klasyfikacja
  CELNA/towarowa, używana RÓWNOLEGLE z PKWiU, zwłaszcza w kontekście
  Wiążącej Informacji Stawkowej (WIS)
□ STATUS PRAWNY towaru wynikający z ODRĘBNYCH przepisów (np. "wyrób
  medyczny" w rozumieniu rozporządzenia MDR/ustawy o wyrobach
  medycznych) — TEN status, NIE sam kod PKWiU/CN, jest w wielu
  przypadkach OSTATECZNYM przesądzającym czynnikiem
```
Jeśli w pytaniu chodziło o PKD — to prawdopodobnie POMYŁKA terminologiczna
(częsta w praktyce nieprawniczej); mechanizm opisany w tym module
dotyczy PKWiU/CN/statusu prawnego towaru, NIE kodu działalności podatnika.

---

## 1. ⭐⭐ MECHANIZM OGÓLNY — DLACZEGO TEN SAM FIZYCZNY TOWAR MA RÓŻNĄ STAWKĘ

```
KLUCZOWA ZASADA: o stawce VAT decyduje CO DO ZASADY klasyfikacja
PKWiU/CN towaru ORAZ — dla wielu pozycji załącznika nr 3 do ustawy VAT
(stawka 8%) — DODATKOWO status PRAWNY towaru wynikający z przepisów
SPOZA prawa podatkowego (np. czy towar jest "wyrobem medycznym
dopuszczonym do obrotu" wg rozporządzenia MDR)

MECHANIZM "TEGO SAMEGO TOWARU O DWÓCH STAWKACH":
  1. Producent/importer wytwarza IDENTYCZNY fizycznie produkt (np.
     rękawiczkę nitrylową) w DWÓCH liniach dystrybucji
  2. JEDNA linia jest CERTYFIKOWANA jako wyrób medyczny (oznakowanie CE
     zgodne z MDR, deklaracja zgodności, dopuszczenie do obrotu jako
     wyrób medyczny) → kwalifikuje się do pozycji 105 załącznika nr 3
     ustawy VAT → STAWKA 8%
  3. DRUGA linia (fizycznie MOŻE być IDENTYCZNA lub niemal identyczna)
     NIE POSIADA takiej certyfikacji, sprzedawana jest jako zwykły
     środek ochrony osobistej/artykuł BHP → klasyfikacja PKWiU 22.19.60
     (CN 4015 19 00, z WYRAŹNYM wyłączeniem zastosowań medycznych w
     opisie pozycji celnej) → STAWKA 23%
  4. ⭐ PUNKT SPORNY: sprzedawca CZĘSTO fizycznie DYSPONUJE TYLKO JEDNĄ
     partią towaru (np. zakupioną jako "wyrób medyczny" ze stawką 8% od
     dostawcy), ale SPRZEDAJE ją odbiorcom, którzy będą jej używać do
     CELÓW INNYCH niż medyczne (np. hurtownia BHP, przemysł spożywczy,
     motoryzacja, kosmetyka) — RODZI TO PYTANIE, którą stawkę
     zastosować PRZY DALSZEJ SPRZEDAŻY

ROZSTRZYGNIĘCIE tego punktu spornego (z interpretacji podatkowych,
  potwierdzone w kilku niezależnych źródłach): DECYDUJE FAKTYCZNE
  PRZEZNACZENIE zadeklarowane/wynikające z okoliczności SPRZEDAŻY, NIE
  wyłącznie sam fakt posiadania przez towar CERTYFIKATU/dopuszczenia
  jako wyrób medyczny w ogólności:
  □ Sprzedaż DLA CELÓW MEDYCZNYCH (podmiotom leczniczym, aptekom,
    odbiorcom deklarującym użycie medyczne) → 8% — towar POZOSTAJE
    wyrobem medycznym w obrocie
  □ Sprzedaż DLA CELÓW INNYCH NIŻ MEDYCZNE (hurtownia BHP, przemysł
    spożywczy/kosmetyczny/motoryzacyjny) → 23%, MIMO że fizycznie to
    TEN SAM towar zakupiony pierwotnie ze stawką 8% od dostawcy
  ⚠️ TO OZNACZA: sprzedawca prowadzący sprzedaż MIESZANĄ (część
  odbiorców medycznych, część niemedycznych) MUSI stosować RÓŻNE
  stawki dla TEJ SAMEJ partii towaru w zależności od PRZEZNACZENIA
  KONKRETNEJ transakcji — to WYSOKIE ryzyko błędu i przedmiot licznych
  sporów z organami podatkowymi
```

### ⚠️ Ryzyko podatkowe przy błędnej klasyfikacji

Jeśli podmiot stosuje stawkę 8% dla towaru, który W RZECZYWISTOŚCI nie
spełnia warunków (np. nie jest faktycznie wyrobem medycznym w obrocie,
lub certyfikat okazał się wadliwy — patrz przykład WIS niżej, gdzie
kontrola dokumentacji MDR wykazała "krytyczne niezgodności" mimo
wcześniejszej deklaracji zgodności) — powstaje ZALEGŁOŚĆ PODATKOWA w
wysokości RÓŻNICY między stawką 23% a zastosowaną stawką obniżoną, plus
odsetki za zwłokę.

---

## 2. ⭐⭐⭐ BAZA PRZYPADKÓW — PRODUKTY O NIEJEDNOZNACZNEJ KLASYFIKACJI VAT

### 2.1. Rękawice jednorazowe (nitrylowe/lateksowe/winylowe)

```
STATUS "WYRÓB MEDYCZNY" (rękawice DIAGNOSTYCZNE/chirurgiczne,
  oznakowanie CE wg MDR, wpis do rejestru, dopuszczone do obrotu jako
  wyrób medyczny) → poz. 105 zał. nr 3 ustawy VAT → STAWKA 8%
STATUS "ZWYKŁY ŚRODEK OCHRONY/BHP" (rękawice ROBOCZE, bez certyfikacji
  medycznej) → PKWiU 22.19.60.0, CN 4015 19 00 (WPROST wyłączający
  zastosowania medyczne/chirurgiczne/dentystyczne/weterynaryjne z tej
  pozycji celnej) → STAWKA 23%
⭐ TA SAMA fizycznie rękawica (skład, grubość, właściwości barierowe)
  MOŻE być sprzedawana w OBU kanałach — decyduje CERTYFIKACJA i
  DEKLAROWANE PRZEZNACZENIE, nie inherentne właściwości fizyczne
DOWÓD PRAKTYCZNY (WIS 0115-KDST2-2.440.170.2021.30.BM): rękawiczki
  nitrylowe sklasyfikowane pod CN dział 40 (nie jako wyrób medyczny) —
  STAWKA 23% — mimo kontroli GIS wykazującej wcześniej deklarowany
  status wyrobu medycznego klasy I z KRYTYCZNYMI NIEZGODNOŚCIAMI w
  dokumentacji systemu zarządzania jakością/ryzykiem
REKOMENDACJA: przy zakupie hurtowym rękawic ZAWSZE żądać (a) dowodu
  certyfikacji CE/MDR jeśli sprzedaż ma być ze stawką 8%, (b)
  jednoznacznej informacji o KODZIE CN dostawcy, (c) rozważyć
  wystąpienie o własną WIS przy wątpliwościach — zwłaszcza przy
  sprzedaży MIESZANEJ (część odbiorców medycznych, część nie)
```

### 2.2. Maseczki ochronne/medyczne

```
STATUS "WYRÓB MEDYCZNY" (maseczki chirurgiczne z certyfikacją
  medyczną) → potencjalnie stawka obniżona (jeśli mieszczą się w
  odpowiedniej pozycji załącznika)
STATUS "ZWYKŁA MASECZKA OCHRONNA" (bez certyfikacji medycznej, np.
  maseczki tekstylne/higieniczne powszechnego użytku) → STAWKA
  PODSTAWOWA 23%
⚠️ Odnotowany w praktyce PROBLEM z okresu pandemii: część podmiotów
  STOSOWAŁA stawkę obniżoną dla maseczek NIEBĘDĄCYCH faktycznie
  wyrobem medycznym — organy podatkowe kwestionowały to jako ZANIŻENIE
  podatku należnego z odpowiednimi konsekwencjami (dopłata różnicy +
  odsetki)
```

### 2.3. Płyny dezynfekujące

```
STATUS "PRODUKT BIOBÓJCZY zarejestrowany" (wpisany do rejestru
  produktów biobójczych, z odpowiednim pozwoleniem) → potencjalnie
  stawka obniżona
STATUS "ZWYKŁY KOSMETYK/środek czyszczący" (bez rejestracji jako
  produkt biobójczy — np. zwykły żel do rąk bez odpowiedniego
  pozwolenia) → STAWKA PODSTAWOWA 23%
⭐ TEN SAM skład chemiczny (np. 70% alkoholu) MOŻE trafić do obu
  kategorii — decyduje FORMALNA REJESTRACJA produktu, nie sam skład
```

### 2.4. Podkłady chłonne/higieniczne jednorazowe

```
STATUS "WYRÓB MEDYCZNY" (stosowane w placówkach opieki zdrowotnej,
  certyfikowane) → potencjalnie stawka obniżona
STATUS "PRODUKT WETERYNARYJNY/przemysłowy/dla zwierząt" (te SAME
  fizycznie podkłady, sprzedawane np. do klinik weterynaryjnych lub
  zastosowań pozamedycznych) → STAWKA PODSTAWOWA 23%, MIMO identycznej
  konstrukcji produktu
```

### 2.5. Inne kategorie z tym samym mechanizmem — ✅ ZWERYFIKOWANE 2026-08-19
(F-35) — JEDEN uniwersalny mechanizm rozstrzyga wszystkie poniższe

⭐⭐⭐ **KLUCZOWE USTALENIE:** wszystkie 5 kategorii niżej podlegają
DOKŁADNIE tej samej regule z **poz. 105 załącznika nr 3 do ustawy o VAT**
— stawka **8% BEZ WZGLĘDU NA SYMBOL PKWiU**, jeśli przedmiot jest
"wyrobem medycznym w rozumieniu ustawy o wyrobach medycznych (7.04.2022),
dopuszczonym do obrotu na terytorium RP" (co obecnie oznacza: zgodność z
rozporządzeniem UE 2017/745 MDR, ew. z procedurą przejściową z art. 97
MDR dla wyrobów klasy I). **PKWiU/CN samo w sobie NIE decyduje** —
decyduje WYŁĄCZNIE status certyfikacyjny/rejestracyjny jako wyrób
medyczny. Ten sam fizyczny przedmiot bez takiej certyfikacji (wersja
przemysłowa/kuchenna/hobbystyczna/"wellness") → **23%**, standardowa
stawka. Potwierdzone: stawkivat.pl (interpretacja MF), ewaflor.pl, kis.gov.pl
(oficjalny dokument KIS o WIS dla wyrobów medycznych), log24.pl, rp.pl.

```
□ Termometry — medyczne (certyfikowane wg MDR, dopuszczone do obrotu) →
  8% | przemysłowe/kuchenne (brak certyfikacji MDR) → 23%
□ Okulary/gogle ochronne — laboratoryjne/medyczne (jeśli certyfikowane
  jako wyrób medyczny — rzadziej niż inne pozycje, zwykle to ŚOI wg
  odrębnego reżimu, nie MDR) → status DO WERYFIKACJI PRZY KONKRETNYM
  PRODUKCIE, nie wszystkie okulary ochronne są "wyrobem medycznym" nawet
  w kontekście medycznym | przemysłowe BHP → 23% zawsze
□ Fartuchy jednorazowe — medyczne/chirurgiczne (certyfikowane MDR) → 8%
  | gastronomiczne/przemysłowe (brak certyfikacji) → 23%
□ Strzykawki/igły — ✅ WPROST POTWIERDZONE (stawkivat.pl, interpretacja
  indywidualna): strzykawki/filtry do strzykawek jako wyrób medyczny wg
  poz. 13 zał. nr 3 (dawna numeracja) → 8% | do zastosowań przemysłowych/
  hobbystycznych (brak certyfikacji medycznej) → 23%
□ Sprzęt do pomiaru ciśnienia/glukometry — medyczne (certyfikowane MDR)
  → 8% | urządzenia "wellness"/fitness (BRAK certyfikacji jako wyrób
  medyczny, mimo mierzenia tych samych parametrów) → 23% — rozróżnienie
  formalne: wyrób medyczny podlega MDR i ma deklarację zgodności/
  oznakowanie CE jako wyrób medyczny, urządzenie "wellness" — nie, mimo
  identycznej funkcji technicznej
```

⭐⭐ **WAŻNA DODATKOWA PUŁAPKA (potwierdzona, rp.pl, stanowisko MF/wiceministra
zdrowia):** przy sprzedaży wyrobu medycznego WRAZ z osprzętem
towarzyszącym (np. tomograf + komputer/monitor/drukarka do jego obsługi)
— **8% obejmuje WYŁĄCZNIE sam wyrób medyczny**, towarzyszący sprzęt
elektroniczny (komputery, monitory) musi być **opodatkowany ODRĘBNIE
stawką 23%**, nawet jeśli jest technicznie niezbędny do działania
urządzenia medycznego i sprzedawany w jednym zestawie — MF stoi na
stanowisku RESTRYKCYJNYM (wbrew wcześniejszemu stanowisku wiceministra
zdrowia o "jednolitym świadczeniu") — **traktować jako sporne, ale
praktyka fiskusa RESTRYKCYJNA jest dominująca i bezpieczniejsza do
przyjęcia przy doradzaniu**.

### 2.6. ⭐⭐⭐ GASTRONOMIA/CATERING — USŁUGA vs TOWAR (dodano 2026-08-12,
na żądanie użytkownika — JEDEN z NAJCZĘŚCIEJ spornych obszarów VAT
w Polsce, dotąd CAŁKOWICIE nieobecny w tej bazie przypadków)

```
⭐⭐ MECHANIZM: TA SAMA fizycznie kanapka SPRZEDANA na miejscu, na
  wynos i W cateringu MOŻE podlegać TRZEM różnym stawkom — DECYDUJE
  NIE sam produkt, LECZ FORMA sprzedaży i TOWARZYSZĄCE jej usługi

⭐⭐⭐ KLUCZOWE KRYTERIUM (TSUE C-703/19, potwierdzone przez polskie
  WSA — "sprawa food court"): DLA kwalifikacji jako "usługa
  restauracyjna/cateringowa" (8%) NIE MA znaczenia SAM SPOSÓB
  przygotowania POSIŁKU (podgrzanie, wymieszanie) — DECYDUJE, CZY
  dostawie ŻYWNOŚCI TOWARZYSZĄ usługi WSPOMAGAJĄCE O CHARAKTERZE
  PRZEWAŻAJĄCYM (obsługa kelnerska, nakrycie stołu, umożliwienie
  NATYCHMIASTOWEJ konsumpcji NA miejscu) — ⭐ PKWiU SAMO w sobie NIE
  ma decydującego ZNACZENIA dla tej kwalifikacji wg TSUE — JEŚLI
  klient DECYDUJE się NIE skorzystać Z oferowanych zasobów
  (stolik/sztućce) i ZABIERA jedzenie NA WYNOS — brak jest USŁUGI
  wspomagającej, NIEZALEŻNIE od TEGO, że przedsiębiorca TE zasoby
  OFERUJE
  → ⭐ POWIĄZANE orzeczenie TSUE C-497/21: SAMO istnienie STOLIKÓW i
    SZTUĆCÓW w LOKALU JUŻ NIE determinuje AUTOMATYCZNIE stawki 8% —
    liczy się FAKTYCZNE skorzystanie

⭐⭐⭐ ORIENTACYJNA MAPA STAWEK (2026, ⚠️ WERYFIKUJ aktualne
  rozporządzenie — temat DYNAMICZNY):
  → 8% — POSIŁKI/dania PRZYGOTOWANE w LOKALU, serwowane NA miejscu
    LUB na WYNOS (Z obsługą, W opakowaniu jednorazowym GORĄCE) —
    PKWiU 56 "usługi związane Z wyżywieniem"
  → 5% — GOTOWE produkty PAKOWANE, przeznaczone DO sprzedaży NA
    wynos I spożycia POZA lokalem, BEZ dodatkowej usługi (np.
    SCHŁODZONE/mrożone dania GOTOWE — TRAKTOWANE jako "DOSTAWA
    towaru")
  → 23% — NAPOJE (kawa, HERBATA, woda, napoje GAZOWANE), alkohol
    (>1,2%), produkty LUKSUSOWE (np. DANIA z owoców morza/kawioru) —
    BEZWZGLĘDNIE, NIEZALEŻNIE od kontekstu — ⭐ WYJĄTEK: JEŚLI napój
    STANOWI integralną CZĘŚĆ zestawu (np. śniadaniowego Z kanapką) —
    CAŁY zestaw OPODATKOWANY jest STAWKĄ 8% (NIE rozbija SIĘ
    sztucznie na osobne stawki W ramach jednego, ZŁOŻONEGO
    świadczenia)

⭐⭐⭐ ŚWIEŻY, KONKRETNY PRZYPADEK — "DIETA PUDEŁKOWA" (wyrok NSA, ok.
  lipca 2026): SPÓR o TO, czy CATERING dietetyczny (gotowe posiłki
  dostarczane CODZIENNIE, dostosowane DO indywidualnego
  zapotrzebowania) to USŁUGA (8%) czy DOSTAWA towaru (5%,
  potencjalnie KORZYSTNIEJSZA dla podatnika) — ⭐⭐ NSA POTWIERDZIŁ:
  TO USŁUGA (PKWiU 56), NIE zwykła dostawa towaru — mimo że danie
  JEST już PRAKTYCZNIE gotowe DO spożycia (WYMAGA tylko podgrzania
  LUB wymieszania) — UZASADNIENIE: dostawie TOWARZYSZY usługa
  polegająca NA opracowaniu ZBILANSOWANEJ diety, przygotowaniu
  posiłków NA zamówienie I codziennej DOSTAWIE — TO świadczenie
  KOMPLEKSOWE, charakterystyczne DLA placówek gastronomicznych —
  ⭐ NSA WPROST odrzucił argument, że "rekomendowane WYMIESZANIE czy
  PODGRZANIE" oznacza, iż danie NIE jest jeszcze "GOTOWE" — PRAKTYCZNA
  REKOMENDACJA dla podatników Z branży CATERINGU dietetycznego:
  stosować 8% DO wszystkich świadczeń, ZWERYFIKOWAĆ dotychczasowe
  rozliczenia (JEŚLI stosowano 5% — RYZYKO kontroli), NIE składać
  korekt ZMIERZAJĄCYCH do obniżenia stawki

⭐ NADCHODZĄCA ZMIANA (od 1.07.2026, ⚠️ SPRAWDŹ czy WESZŁA W ŻYCIE
  na dzień weryfikacji, TA data JEST BLISKA dacie TEJ sesji): napoje
  ENERGETYCZNE, bezalkoholowe ODPOWIEDNIKI piw/win/cydrów MAJĄ
  trafić DO stawki 23% (obecnie NIŻSZE opodatkowanie)

⭐ NARZĘDZIE OCHRONNE: WIĄŻĄCA INFORMACJA STAWKOWA (WIS) — JEDYNY
  instrument DAJĄCY PEŁNE bezpieczeństwo co DO stosowanej stawki —
  REKOMENDOWANE dla kluczowych POZYCJI menu W lokalach o WYSOKIM
  wolumenie sprzedaży

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł 2026 (gopos.pl
[kwiecień 2026], restaumatic.com [luty 2026], infor.pl [lipiec
2026, Z omówieniem WYROKU NSA dot. diety pudełkowej], horecapolska.pl
[czerwiec 2026], podatki.biz [×2, w tym Z omówieniem WYROKU WSA i
TSUE C-703/19], eztax.pl [luty 2026, Z odniesieniem DO TSUE
C-497/21], freenance.io [czerwiec 2026]).
```

### 2.7. ⭐⭐⭐ SUPLEMENTY DIETY — TRZY MOŻLIWE STAWKI, ŚWIEŻA MASOWA
FALA ZMIAN WIS (dodano 2026-08-12, na żądanie użytkownika —
KONTYNUACJA badania podobnych przypadków spornej klasyfikacji)

```
⭐⭐⭐ ISTOTA PROBLEMU: SUPLEMENTY diety MOGĄ być OPODATKOWANE TRZEMA
  różnymi stawkami VAT — 5%, 8% LUB 23% — ZALEŻNIE od KONKRETNEGO
  składu I klasyfikacji CN — TEN SAM rodzaj produktu (np. suplement
  W płynie) MOŻE trafić DO różnych KODÓW w ZALEŻNOŚCI od
  SZCZEGÓŁOWEGO składu

⭐⭐ KLUCZOWY SPÓR KLASYFIKACYJNY — DWA konkurujące KODY CN:
  → CN 2106 ("PRZETWORY spożywcze, gdzie indziej NIEWYMIENIONE ani
    niewłączone") → **8%** VAT (poz. 5 załącznika NR 3 do ustawy o
    VAT) — TA klasyfikacja PRZEWAŻA w WIĘKSZOŚCI wydanych WIS
  → CN 2202 (KLASYFIKOWANY jako "NAPÓJ", GDY udział MASOWY soku
    owocowego/warzywnego/owocowo-warzywnego WYNOSI MNIEJ niż **20%**
    składu SUROWCOWEGO) → **23%** VAT (STAWKA podstawowa, JAK dla
    zwykłego napoju) — ORGANY CZĘSTO KWESTIONUJĄ obniżoną stawkę
    WŁAŚNIE NA TEJ podstawie, DLA suplementów W FORMIE PŁYNNEJ

⭐⭐⭐ ⚡ BARDZO ŚWIEŻA, MASOWA fala ZMIAN — WYDARZENIE Z 1.07.2026 R.
  (ok. 6 TYGODNI przed tą weryfikacją): DYREKTOR KIS OPUBLIKOWAŁ
  zmianę WCZEŚNIEJ wydanej WIĄŻĄCEJ Informacji STAWKOWEJ (WIS) dla
  KONKRETNEGO suplementu diety — Z **23% NA 8%** — ⭐ PRZYCZYNA:
  publikacja W Dzienniku URZĘDOWYM UE Z **13.02.2026 R.** (C/2026/999)
  NOWYCH not WYJAŚNIAJĄCYCH DO podpozycji CN 2202 99 — TA
  UNIJNA zmiana INTERPRETACYJNA wywołała KASKADOWY skutek W polskich
  WIS-ach — ⭐⭐ SKALA: DYREKTOR KIS wydał W CIĄGU OSTATNIEGO
  MIESIĄCA PRZED tą zmianą **PONAD 20 DECYZJI** zmieniających WCZEŚNIEJ
  wydane WIS-y DOTYCZĄCE suplementów diety — MASOWA, SYSTEMOWA
  korekta, NIE pojedynczy PRZYPADEK

⭐ PRAKTYCZNA REKOMENDACJA (MDDP): Z UWAGI NA udokumentowaną
  MOŻLIWOŚĆ klasyfikacji TEGO SAMEGO typu produktu DO trzech różnych
  stawek — ZASADNE jest WYSTĄPIENIE Z WŁASNYM wnioskiem O WIS DLA
  KONKRETNEGO produktu, ZAMIAST polegania NA ogólnych regułach LUB
  WIS-ach wydanych DLA INNYCH, choćby PODOBNYCH produktów — ⭐
  WCZEŚNIEJ wydana, POZYTYWNA WIS NIE DAJE gwarancji TRWAŁOŚCI —
  MOŻE zostać ZMIENIONA (JAK w OPISANYM przypadku), SZCZEGÓLNIE PRZY
  zmianach interpretacyjnych NA poziomie UNIJNYM

⭐ POWIĄZANY, ⚠️ NIEPOTWIERDZONY sygnał: JEDNO źródło (eztax.pl,
  luty 2026) WSPOMINA O "PROGNOZOWANYM wzroście stawek VAT DLA
  wyrobów MEDYCZNYCH w 2026 roku (Z 8% DO 10%)" — ⚠️ TO TYLKO
  PROGNOZA/plan Z JEDNEGO źródła, NIE potwierdzona GDZIE INDZIEJ w
  TEJ transzy — TRAKTUJ Z OSTROŻNOŚCIĄ, wymaga DEDYKOWANEJ
  weryfikacji PRZED cytowaniem

Potwierdzone w 5+ zgodnych, BARDZO aktualnych źródeł (inforlex.pl
[×2, JEDNO sprzed 1 TYGODNIA od tej weryfikacji, Z dokładną datą i
numerem publikacji UE], mddp.pl, eztax.pl [luty 2026], freenance.io
[czerwiec 2026]).
```

---

## 3. CHECKLIST PRAKTYCZNY — WERYFIKACJA STAWKI DLA PRODUKTU O NIEJEDNOZNACZNEJ KLASYFIKACJI

```
□ Czy produkt POSIADA certyfikat CE zgodny z rozporządzeniem MDR (2017/745)
  lub inny dokument potwierdzający status wyrobu medycznego — sprawdź
  DATĘ i CZY certyfikat jest nadal WAŻNY (kontrole GIS/URPL mogą
  wykazać niezgodności PODWAŻAJĄCE wcześniej wydany certyfikat)
□ Czy KONKRETNA transakcja sprzedaży dotyczy odbiorcy DEKLARUJĄCEGO
  użycie MEDYCZNE czy INNE — TA SAMA partia towaru może wymagać RÓŻNYCH
  stawek dla różnych odbiorców
□ Czy dostawca (przy zakupie) wskazał JEDNOZNACZNY kod PKWiU/CN na
  fakturze — jeśli NIE, rozważ wystąpienie o WŁASNĄ Wiążącą Informację
  Stawkową (WIS) do Dyrektora KIS
□ Czy prowadzona jest sprzedaż MIESZANA (część odbiorców medycznych,
  część nie) — jeśli TAK, WDROŻ wewnętrzną procedurę klasyfikacji
  KAŻDEJ transakcji z osobna, nie stosuj jednej stawki "hurtowo" dla
  całego asortymentu
□ Czy klasyfikacja PKWiU/CN nie ULEGŁA zmianie (nowa matryca stawek,
  aktualizacja klasyfikacji GUS) — sprawdź AKTUALNY stan przed
  zastosowaniem historycznej interpretacji
```

---

> ⭐⭐⭐ **BAZA WERYFIKACJI STAWEK — ŹRÓDŁO KANONICZNE (dodane
> 2026-08-12):** pełna, czteropoziomowa procedura ustalania stawki
> (POZIOM A: ISAP — art. 41, 146x, zał. 3 i 10, art. 83 + rozporządzenie
> Dz.U. 2023 poz. 2670 ze zmianami; POZIOM B: ISZTAR4 dla kodów CN z
> funkcją DATY SYMULACJI oraz PKWiU 2015 dla usług; POZIOM C: EUREKA;
> POZIOM D: WIS) znajduje się w **`mod-VAT-podatek-od-towarow-i-uslug.md`,
> sekcja 3**. NIE DUPLIKUJ jej tutaj — ten moduł dostarcza KONKRETNE
> przypadki sporne w obrębie tej procedury, nie zastępuje jej.

## 3a. ⭐ PUBLICZNA BAZA WIS — SYSTEM EUREKA (dodano 2026-08-12, na
żądanie użytkownika — konkretny adres bazy, dotąd tylko ogólnie
wspominanej jako "narzędzie ochronne" bez wskazania URL)

```
⭐⭐ ADRES: **https://eureka.mf.gov.pl/** — oficjalny SYSTEM
  Ministerstwa FINANSÓW i Krajowej Informacji SKARBOWEJ

⭐ DOSTĘPNOŚĆ: PUBLICZNA, BEZPŁATNA, BEZ konieczności ZAKŁADANIA
  konta/loginu/hasła — DOSTĘPNA dla KAŻDEGO, NIE tylko pracowników
  administracji SKARBOWEJ

⭐⭐ ZAWARTOŚĆ: WIĄŻĄCE informacje STAWKOWE (WIS) i AKCYZOWE (WIA),
  interpretacje INDYWIDUALNE i OGÓLNE, objaśnienia PODATKOWE,
  broszury INFORMACYJNE, pisma/materiały MF i KAS, ODPOWIEDZI na
  interpelacje, WYBRANE orzeczenia sądów ADMINISTRACYJNYCH z zakresu
  spraw PODATKOWYCH — system ZASTĄPIŁ wcześniejsze, ODRĘBNE
  wyszukiwarki (SIP, WIA, WIS)

⭐ MOŻLIWOŚCI wyszukiwania: PO przepisie, SYGNATURZE, KODZIE PKWiU,
  Nomenklaturze SCALONEJ (CN), RODZAJU wyrobu AKCYZOWEGO,
  klasyfikacji PKOB, DACIE rejestracji, AUTORZE, słowie KLUCZOWYM,
  kategorii

⚠️ ZASTRZEŻENIE Z PRAKTYKI: DOŚWIADCZENI doradcy PODATKOWI
  zgłaszali (w OKRESIE wdrożenia) zastrzeżenia DO EFEKTYWNOŚCI
  samej WYSZUKIWARKI — wyszukiwanie PO frazach/słowach KLUCZOWYCH
  NIE zawsze przynosi OCZEKIWANE wyniki — TRAKTUJ jako
  UZUPEŁNIAJĄCE, NIE jedyne źródło WERYFIKACJI

Potwierdzone w 6+ zgodnych źródeł (prawo.pl [×2], infor.pl,
puesc.gov.pl [Rząd 1], kancelaria-szip.pl, kpmg.com [z potwierdzeniem
statusu systemu Eureka jako OFICJALNEGO publikatora interpretacji
samorządowych organów podatkowych]).
```

## 4. INTEGRACJA Z SYSTEMEM

- **`mod-PKWiU-klasyfikacje-statystyczne.md`** (DR-06) — ogólne ramy
  klasyfikacji PKWiU/CN/PKOB/KŚT — TEN moduł dostarcza KONKRETNE,
  praktyczne przypadki niejednoznaczności w obrębie tych klasyfikacji.
- **`mod-VAT-podatek-od-towarow-i-uslug.md`** (DR-06) — WIS (Wiążąca
  Informacja Stawkowa) jako narzędzie ROZSTRZYGANIA wątpliwości opisanych
  w tym module — sprawdź procedurę wnioskowania.
- **DR-10 (Zdrowie, Farmacja)** — `mod-wyroby-medyczne.md` — status
  prawny "wyrobu medycznego" wg rozporządzenia MDR/ustawy o wyrobach
  medycznych, który JEST przesłanką materialną dla stawki 8% opisanej
  w tym module — sprawdź tam pełną definicję i procedurę certyfikacji.

---

## 5. LITERATURA I ŹRÓDŁA (zweryfikowane online 2026-07-19)

- sip.lex.pl (WIS 0115-KDST2-2.440.170.2021.30.BM) — rękawiczki
  nitrylowe, klasyfikacja CN dział 40, kontrola GIS wykazująca
  niezgodności dokumentacji MDR mimo wcześniejszej deklaracji zgodności.
  wyrobmedyczny.info — potwierdzenie mechanizmu ogólnego (stawka zależy
  od przypisania do grupowania PKWiU).
- e-prawnik.pl (2×) — interpretacje podatkowe dot. rękawic diagnostycznych
  sprzedawanych do celów innych niż medyczne (8% vs 23% w zależności od
  odbiorcy), rękawic lateksowych/winylowych.
- infor.pl (2×) — maseczki/rękawiczki/płyny dezynfekujące w okresie
  pandemii, ryzyko zaniżenia podatku przy niewłaściwym zastosowaniu
  stawki obniżonej, wymóg opinii klasyfikacyjnej GUS.
- serwiszoz.pl — rękawice i podkłady chłonne jako przykład "tego samego
  wyrobu medycznego, różnego VAT" w zależności od faktycznego zastosowania.
- przetargi.wody.gov.pl — konkretny przykład kodu CN 4015 19 00 z
  wyraźnym wyłączeniem zastosowań medycznych z tej pozycji celnej.

---

## CHANGELOG

**1.0 (2026-07-19):** Utworzenie modułu na wyraźne żądanie użytkownika
— zbudowanie "bazy" produktów, gdzie stawka VAT zależy od niejednoznacznej
klasyfikacji tego samego fizycznego towaru. Skorygowano terminologię:
mechanizm dotyczy PKWiU/CN i statusu prawnego towaru (wyrób medyczny wg
MDR), NIE kodu PKD (który klasyfikuje działalność podatnika, nie towar).
W PEŁNI opracowano na konkretnym przykładzie rękawic nitrylowych
(diagnostyczne/medyczne 8% vs robocze/BHP 23%, z realnym przykładem WIS
i interpretacji podatkowych pokazujących, że TA SAMA fizyczna partia
towaru może wymagać różnych stawek zależnie od odbiorcy/przeznaczenia
KONKRETNEJ transakcji). Rozszerzono na 3 dodatkowe, w pełni udokumentowane
przypadki (maseczki, płyny dezynfekujące, podkłady chłonne) oraz
zasygnalizowano 5 dalszych kategorii jako punkt startowy do przyszłego
pogłębienia.

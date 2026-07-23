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

### 2.5. Inne kategorie z tym samym mechanizmem (⚠️ punkt startowy, wymaga własnej weryfikacji przy konkretnej sprawie)

```
□ Termometry — medyczne (certyfikowane) vs przemysłowe/kuchenne
□ Okulary/gogle ochronne — laboratoryjne/medyczne vs przemysłowe BHP
□ Fartuchy jednorazowe — medyczne/chirurgiczne vs gastronomiczne/przemysłowe
□ Strzykawki/igły — medyczne vs np. do zastosowań przemysłowych/hobbystycznych
□ Sprzęt do pomiaru ciśnienia/glukometry — medyczne vs "wellness"/fitness
  (rozróżnienie: wyrób medyczny podlega MDR, urządzenie "wellness" — nie)
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

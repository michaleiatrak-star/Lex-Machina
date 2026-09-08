# Podatkowa Księga Przychodów i Rozchodów (PKPiR) i inne ewidencje
uproszczone

v1.0.0 (utworzony 2026-08-13, na żądanie użytkownika — moduł
odtworzony od podstaw po wykryciu, że był fantomowym wpisem w
ROUTING-MAP.md, patrz flaga F-20 w audyt-systemu-v4/references/
WARN-OTWARTE.md: poprzedni wpis centralny opisywał ten moduł jako
istniejący, ale plik fizycznie nie istniał na dysku)

**Zweryfikowano 2026-08-13** (ZASADA 14): Rząd 1 — bezpośrednio
isap.sejm.gov.pl (WDU20250001299), gov.pl/web/finanse (komunikat MF
o publikacji trzech powiązanych rozporządzeń). Rząd 2B — biznes.gov.pl
(rządowy portal informacyjny, zgodny z Rządem 1 co do progów i
struktury), pit.pl, przepisy.gofin.pl, poradnikprzedsiebiorcy.pl,
taxmachine.pl, firmino.pl, infakt.pl, rarpit.pl, szybkafaktura.pl,
podatki.biz, jpk.info.pl, formsoft-skp.pl. ⚠️ [NIEWERYFIKOWANE
BEZPOŚREDNIO PRZEZ PEŁNY TEKST ROZPORZĄDZENIA] — ISAP niedostępny do
web_fetch w tej sesji (blokada robots), treść ustalona na podstawie
zgodnych źródeł wtórnych cytujących konkretne paragrafy — przed
pismem procesowym potwierdź brzmienie wprost na ISAP.

---

## 1. PODSTAWA PRAWNA I ZAKRES

```
USTAWA: art. 24a ustawy z 26.07.1991 r. o podatku dochodowym od osób
  fizycznych (delegacja ustawowa dla rozporządzenia wykonawczego —
  ust. 8)
  ⚠️ NOWELIZACJA ART. 24a — DOPRECYZOWANA METRYKA (dopisane 2026-08-15x,
    audyt TRYB DZU / F-85): ustawa z 15.05.2026 r. o zmianie ustawy o PIT,
    ustawy o CIT oraz ustawy o zryczałtowanym podatku dochodowym —
    **Dz.U. 2026 poz. 779**, publikacja 15.06.2026, w życie **1.07.2026**
    (wyjątki: art. 1 pkt 7, art. 2 pkt 1 lit. c i art. 3 — dzień po
    ogłoszeniu). Zmiana ma charakter TERMINOLOGICZNY, nie konstrukcyjny:
    w ust. 1 skreślono skrót „zwaną dalej »księgą«", a w ust. 1a-1c wyrazy
    „w prowadzonej księdze albo w prowadzonych księgach rachunkowych,
    o których mowa w ust. 1" zastąpiono wyrazami „w podatkowej księdze
    przychodów i rozchodów albo księgach rachunkowych". Przepisy
    wykonawcze wydane na podstawie art. 24a ust. 8 ZACHOWUJĄ MOC — czyli
    rozporządzenie z 6.09.2025 r. (niżej) pozostaje aktualne.
    ⛔ SKUTEK PRAKTYCZNY DLA PISM: w powołaniach na art. 24a ust. 1a-1c
    NIE używać skrótu „księga" jako terminu ustawowego — od 1.07.2026
    ustawa posługuje się pełną nazwą „podatkowa księga przychodów
    i rozchodów". ✅ VER 2026-08-15x: podatki.gov.pl (podstawa prawna
    PIT/ryczałt), prawo.pl (tekst aktu Dz.U. 2026 poz. 779),
    przepisy.gofin.pl (rejestr wersji czasowych art. 24a).
    ⚠️ [ZALECANA WERYFIKACJA ISAP przed powołaniem w piśmie]

ROZPORZĄDZENIE WYKONAWCZE — ZMIANA OD 1.01.2026 R.:
  □ DO 31.12.2025 r.: rozporządzenie Ministra Finansów z 23.12.2019 r.
    w sprawie prowadzenia podatkowej księgi przychodów i rozchodów
    (Dz.U. poz. 2544 ze zm.) — ⛔ UTRACIŁO MOC 1.01.2026 r.
  □ OD 1.01.2026 r.: rozporządzenie Ministra Finansów i Gospodarki z
    6.09.2025 r. w sprawie prowadzenia podatkowej księgi przychodów
    i rozchodów (Dz.U. 2025 poz. 1299) — ✅ POTWIERDZONE bezpośrednio
    na isap.sejm.gov.pl (WDU20250001299) i gov.pl/web/finanse
  ⭐ PRZEPIS PRZEJŚCIOWY: do wniosków złożonych na podstawie starego
    rozporządzenia (do 31.12.2025 r.) stosuje się przepisy
    DOTYCHCZASOWE — sprawdź, czy sprawa nie dotyczy okresu przed
    zmianą, zanim zastosujesz nowe rozporządzenie

GENEZA NOWELIZACJI: dostosowanie do NOWEGO obowiązku (wprowadzanego
  do ustawy o PIT) PROWADZENIA księgi WYŁĄCZNIE w postaci
  ELEKTRONICZNEJ, przy użyciu PROGRAMÓW komputerowych, oraz
  PRZESYŁANIA jej po ZAKOŃCZENIU roku podatkowego naczelnikowi
  urzędu skarbowego w formie USTRUKTURYZOWANEJ (JPK_PKPIR) — w
  terminie DO upływu terminu ZŁOŻENIA zeznania rocznego

⭐⭐ TRZY POWIĄZANE ROZPORZĄDZENIA Z 6.09.2025 R. (publikowane RAZEM
  w Dzienniku Ustaw, potwierdzone bezpośrednio na gov.pl/web/finanse):
  1) w sprawie prowadzenia podatkowej KSIĘGI przychodów i rozchodów
     (Dz.U. 2025 poz. 1299) — TA sekcja
  2) w sprawie prowadzenia EWIDENCJI przychodów i wykazu środków
     trwałych oraz wartości niematerialnych i prawnych (Dz.U. 2025
     poz. 1294) — dotyczy RYCZAŁTU od przychodów ewidencjonowanych,
     patrz sekcja 5 niżej
  3) w sprawie DODATKOWYCH danych, o które należy uzupełnić prowadzone
     księgi rachunkowe i ewidencję środków trwałych oraz wartości
     niematerialnych i prawnych podlegające przekazaniu na podstawie
     ustawy o PIT (Dz.U. 2025 poz. 1311) — powiązanie z JPK, patrz
     mod-ustawa-rachunkowosci.md dla ksiąg PEŁNYCH
  Wszystkie TRZY weszły w życie 1.01.2026 r.
```

---

## 2. KTO PROWADZI PKPiR — ZAKRES PODMIOTOWY

```
PODMIOTY OBOWIĄZANE (art. 24a ust. 1-2 ustawy o PIT) — ŁĄCZNIE trzy
  warunki:
  1) FORMA opodatkowania: skala PODATKOWA (12%/32%) ALBO podatek
     LINIOWY (19%) — ⛔ NIE dotyczy podatników RYCZAŁTU od przychodów
     ewidencjonowanych (CI prowadzą ODRĘBNĄ ewidencję, patrz sekcja 5)
  2) FORMA prowadzenia działalności: osoba FIZYCZNA indywidualnie,
     spółka CYWILNA osób fizycznych, spółka CYWILNA osób fizycznych
     i przedsiębiorstwo W SPADKU, spółka JAWNA osób fizycznych,
     spółka PARTNERSKA, przedsiębiorstwo W SPADKU
  3) PRÓG PRZYCHODÓW: przychody NETTO (bez VAT) z działalności
     gospodarczej (LUB przychody spółki) NIE PRZEKROCZYŁY w
     POPRZEDNIM roku 2,5 MLN EUR — ⭐ POTWIERDZONE bezpośrednio na
     biznes.gov.pl (portal RZĄDOWY)

PODMIOTY DODATKOWE (poza katalogiem GŁÓWNYM z art. 24a):
  □ osoby PROWADZĄCE działy SPECJALNE produkcji ROLNEJ — JEŚLI
    ZGŁOSIŁY zamiar prowadzenia ksiąg
  □ DUCHOWNI, którzy ZREZYGNOWALI z opłacania ZRYCZAŁTOWANEGO
    podatku dochodowego
  □ osoby WYKONUJĄCE działalność NA podstawie umów AGENCYJNYCH i
    umów-ZLECEŃ zawartych na PODSTAWIE odrębnych przepisów

⭐⭐⭐ PRZEKROCZENIE PROGU 2,5 MLN EUR — OBOWIĄZEK PEŁNYCH KSIĄG:
  jeżeli PRZYCHODY netto ze SPRZEDAŻY towarów, produktów I operacji
  FINANSOWYCH za POPRZEDNI rok obrotowy OSIĄGNĘŁY LUB przekroczyły
  RÓWNOWARTOŚĆ w walucie POLSKIEJ progu Z art. 2 ust. 1 pkt 2 ustawy
  o rachunkowości (2,5 mln EUR — patrz mod-ustawa-rachunkowosci.md,
  sekcja 2) — PODATNIK MUSI w KOLEJNYM roku prowadzić PEŁNĄ księgowość
  w formie KSIĄG rachunkowych, NIE MOŻE już korzystać Z uproszczonej
  PKPiR
  ⭐ PRZYKŁADOWA kwota LIMITU po PRZELICZENIU dla konkretnego roku
  (⚠️ [WYMAGA WERYFIKACJI CO ROK] przeliczenie zmienia się co ROK
  wg kursu ŚREDNIEGO NBP z PIERWSZEGO dnia roboczego października
  roku POPRZEDZAJĄCEGO — patrz mechanizm szczegółowo omówiony w
  mod-ustawa-rachunkowosci.md sekcja 2, ta SAMA metodologia dotyczy
  progu Z ustawy o rachunkowości, DO którego odsyła art. 24a ust. 4
  ustawy o PIT) — jeden z PRZESZUKANYCH przykładów wskazuje limit
  10 646 500 zł ORIENTACYJNIE dla przeliczenia na 2026 r. (⚠️
  [NIEWERYFIKOWANE BEZPOŚREDNIO] — POTWIERDŹ aktualny przelicznik
  na dany rok PRZED zastosowaniem w konkretnej sprawie)

ZWOLNIENIE Z OBOWIĄZKU PKPiR (na WNIOSEK, wyjątkowe): MOŻLIWE ze
  względu na SZCZEGÓLNE okoliczności (rodzaj DZIAŁALNOŚCI, stan
  ZDROWIA, wiek podatnika) — WNIOSEK składa się DO właściwego
  naczelnika URZĘDU skarbowego — ⚠️ [NIEWERYFIKOWANE W PEŁNI]
  dokładna PODSTAWA prawna i PRZESŁANKI tego zwolnienia wymagają
  POGŁĘBIENIA przy konkretnej sprawie
```

---

## 3. ZAKŁADANIE, PROWADZENIE I FORMA KSIĘGI

```
ZAŁOŻENIE KSIĘGI: na dzień 1 STYCZNIA każdego roku podatkowego (DLA
  kontynuujących działalność) ALBO na dzień ROZPOCZĘCIA działalności
  W ciągu roku podatkowego (DLA nowych podmiotów) — KSIĘGA obejmuje
  DANY rok podatkowy, NIE MIESZA SIĘ zapisów Z różnych lat

FORMA KSIĘGI — ZMIANA OD 1.01.2026 R.: ⭐⭐⭐ obowiązek PROWADZENIA
  WYŁĄCZNIE w postaci ELEKTRONICZNEJ przy UŻYCIU programów
  komputerowych — DOTYCHCZASOWA możliwość prowadzenia W formie
  PAPIEROWEJ (zbroszurowanej, KOLEJNO ponumerowanej) BYŁA regułą
  DO 31.12.2025 r., OD 1.01.2026 r. FORMA elektroniczna JEST
  obowiązkowa — powiązanie Z Krajowym Systemem e-FAKTUR (KSeF)

⭐⭐⭐ TERMINY DOKONYWANIA ZAPISÓW — DWA WARIANTY:
  □ GDY podatnik prowadzi KSIĘGĘ samodzielnie: zapisy NA bieżąco,
    RAZ dziennie PO zakończeniu dnia, NIE później niż PRZED
    rozpoczęciem działalności W dniu NASTĘPNYM (⭐ WYJĄTEK: podatnicy
    prowadzący sprzedaż NA kasach fiskalnych LUB prowadzący
    ewidencję sprzedaży MAJĄ prawo DOKONYWANIA wpisów NA koniec
    KAŻDEGO miesiąca — odpowiednio NA podstawie raportów MIESIĘCZNYCH
    lub miesięcznego ZESTAWIENIA sprzedaży)
  □ GDY KSIĘGĘ prowadzi BIURO rachunkowe: zapisów DOKONUJE się
    CHRONOLOGICZNIE, na PODSTAWIE dokumentów DOSTARCZONYCH przez
    klienta, W TERMINIE do 20. DNIA każdego miesiąca ZA miesiąc
    poprzedni (⭐ TERMIN powiązany Z obowiązkiem obliczenia I wpłaty
    zaliczki NA podatek dochodowy DO tego SAMEGO dnia — dane Z
    księgi SĄ niezbędne DO tego wyliczenia) — GDY księgę prowadzi
    biuro RACHUNKOWE, przedsiębiorca NIE dokonuje zapisów SAMODZIELNIE,
    ale JEST zobowiązany DO prowadzenia EWIDENCJI dodatkowych
    wskazanych W rozporządzeniu (np. ewidencji ŚRODKÓW trwałych)

JĘZYK I WALUTA: zapisy DOKONYWANE w JĘZYKU polskim I walucie
  POLSKIEJ, w SPOSÓB staranny, CZYTELNY i trwały, NA podstawie
  prawidłowych I rzetelnych DOWODÓW

RZETELNOŚĆ I NIEWADLIWOŚĆ KSIĘGI (§ 4 rozporządzenia): podatnik
  OBOWIĄZANY jest prowadzić KSIĘGĘ RZETELNIE i W sposób NIEWADLIWY.
  Za NIEWADLIWĄ uznaje się KSIĘGĘ prowadzoną ZGODNIE z przepisami
  rozporządzenia, WEDŁUG ustalonego wzoru I zgodnie z OBJAŚNIENIAMI
  do wzoru.
  ⭐⭐ USTAWOWE WYJĄTKI OD SANKCJI NIERZETELNOŚCI — księga NADAL
  uznawana za rzetelną, GDY:
  1) błędy Z sumie NIE PRZEKRACZAJĄ 0,5% przychodu (⚠️ [DO WERYFIKACJI
     PRZY KONKRETNEJ SPRAWIE] dokładna WYSOKOŚĆ progu procentowego
     wymaga potwierdzenia — źródła TEJ sesji NIE wskazały wprost
     tej liczby, ale KATALOG wyjątków JEST szerszy niż wyłącznie
     próg procentowy, patrz PUNKTY 2-5 niżej)
  2) BRAK właściwych zapisów jest ZWIĄZANY z NIESZCZĘŚLIWYM wypadkiem
     LUB zdarzeniem LOSOWYM, które UNIEMOŻLIWIŁY podatnikowi
     PROWADZENIE księgi
  3) BŁĘDY spowodowały ZWIĘKSZENIE wysokości PODSTAWY obliczenia
     podatku, Z WYJĄTKIEM błędów polegających NA niewykazaniu LUB
     zaniżeniu kosztów ZAKUPU materiałów (surowców) PODSTAWOWYCH,
     towarów HANDLOWYCH oraz kosztów ROBOCIZNY
  4) podatnik UZUPEŁNIŁ zapisy LUB poprawił BŁĘDNE zapisy W księdze
     PRZED rozpoczęciem KONTROLI przez organ PODATKOWY, lub w
     TERMINIE przysługującego UPRAWNIENIA do złożenia DEKLARACJI/
     korekty deklaracji (art. 62 UST. 4 ustawy o KAS)
  5) BŁĘDNE zapisy SĄ skutkiem OCZYWISTEJ omyłki, a PODATNIK posiada
     dowody KSIĘGOWE odpowiadające WYMAGANIOM formalnym
```

---

## 4. DOWODY KSIĘGOWE I SPIS Z NATURY

```
DOWODY KSIĘGOWE STANOWIĄCE PODSTAWĘ ZAPISÓW: faktury VAT (W TYM
  faktury VAT RR — dla ROLNIKÓW ryczałtowych), DOKUMENTY celne,
  RACHUNKI, inne dokumenty STWIERDZAJĄCE fakt DOKONANIA operacji
  gospodarczej zgodnie Z jej rzeczywistym PRZEBIEGIEM (W TYM: noty
  księgowe SPORZĄDZONE w celu SKORYGOWANIA zapisu, dokumenty
  wewnętrzne — W ściśle określonych W rozporządzeniu przypadkach,
  opisy/specyfikacje otrzymanych MATERIAŁÓW lub towarów HANDLOWYCH
  połączone Z późniejszą FAKTURĄ)

WYMOGI FORMALNE DOWODU: wiarygodne OKREŚLENIE wystawcy LUB wskazanie
  stron (NAZWĘ i adresy) UCZESTNICZĄCYCH w operacji GOSPODARCZEJ —
  ⚠️ [NIEWERYFIKOWANE W PEŁNI] pełny katalog WYMOGÓW formalnych
  analogiczny DO dowodów księgowych z USTAWY o rachunkowości (patrz
  mod-ustawa-rachunkowosci.md sekcja 3a) — SPRAWDŹ tamtą sekcję DLA
  pełnego obrazu wymogów dowodowych wspólnych DLA obu reżimów

WYŁĄCZENIE Z ZAKRESU (nowelizacja 2026): dzienne ZESTAWIENIA dowodów
  (faktur DOTYCZĄCYCH sprzedaży) SPORZĄDZANYCH do ZAKSIĘGOWANIA ich
  zbiorczym ZAPISEM — WYŁĄCZONE Z katalogu dowodów KSIĘGOWYCH pod
  nowym rozporządzeniem — PODATNIK BĘDZIE dokonywał zapisów
  BEZPOŚREDNIO w księdze NA podstawie POSZCZEGÓLNYCH faktur, NIE
  zbiorczych zestawień

VAT JAKO SKŁADNIK ZAPISU: JEŻELI VAT jest DLA podatnika KOSZTEM
  uzyskania PRZYCHODU (NP. przy braku prawa DO odliczenia), DO PKPiR
  wpisuje SIĘ jako KOSZT kwotę BRUTTO z faktury

⭐⭐ SPIS Z NATURY (REMANENT) — obowiązkowe MOMENTY sporządzenia:
  □ NA dzień ROZPOCZĘCIA działalności gospodarczej (DOTYCZY również
    przedsiębiorców będących WSPÓLNIKAMI spółek) — OBEJMUJE wszystkie
    RZECZY kupione PRZED założeniem firmy: TOWARY handlowe, materiały
    I surowce podstawowe/POMOCNICZE, półwyroby, BRAKI i odpady
    użytkowe — ⛔ NIE obejmuje SKŁADNIKÓW majątku FIRMY, środków
    trwałych CZY wyposażenia (komputery, MEBLE, samochody)
  □ NA koniec KAŻDEGO roku podatkowego (remanent ROCZNY, patrz też
    mod-ustawa-rachunkowosci.md sekcja 3b DLA metodyki inwentaryzacji
    ogólnie stosowanej TAKŻE analogicznie W praktyce PKPiR)
  □ W RAZIE utraty W ciągu roku PODATKOWEGO prawa DO zryczałtowanego
    opodatkowania podatkiem DOCHODOWYM
  ⭐ ZEROWY spis Z natury: JEŻELI podatnik NIE posiada ŻADNYCH
  składników PODLEGAJĄCYCH ujęciu na DZIEŃ rozpoczęcia działalności
  — MUSI mimo TO przygotować spis Z natury o WARTOŚCI zerowej (NIE
  zwalnia GO to Z samego obowiązku SPORZĄDZENIA dokumentu)
```

---

## 5. STRUKTURA KSIĘGI — LICZBA KOLUMN (ZMIANA 2026)

```
⭐⭐⭐ ZMIANA LICZBY KOLUMN OD 1.01.2026 R.: DO końca 2025 r. — 17
  kolumn (WCZEŚNIEJ, historycznie, 16 kolumn — ⚠️ [NIEJEDNOZNACZNOŚĆ
  MIĘDZY ŹRÓDŁAMI] część ŹRÓDEŁ podaje 16, część 17 kolumn DLA STANU
  przed 2026 r. — RÓŻNICA prawdopodobnie WYNIKA z różnych momentów W
  czasie, GDY poszczególne źródła BYŁY pisane — SPRAWDŹ dokładną
  liczbę KOLUMN dla KONKRETNEGO roku podatkowego przy sprawie
  dotyczącej OKRESU sprzed 2026 r.); OD 1.01.2026 r. — 19 KOLUMN,
  zgodnych z WYMOGAMI struktury JPK_PKPIR (ustrukturyzowanego pliku
  przesyłanego DO urzędu skarbowego)

⭐ CEL ZWIĘKSZENIA LICZBY KOLUMN: dostosowanie DO wymogów
  ustrukturyzowanego RAPORTOWANIA JPK_PKPIR — WIĘKSZA granularność
  danych UMOŻLIWIAJĄCA automatyczną ANALIZĘ przez organy PODATKOWE

⚠️ [ZAKRES NIEOPRACOWANY SZCZEGÓŁOWO W TEJ SESJI] dokładna TREŚĆ
  poszczególnych 19 kolumn (numeracja, NAZWY, przeznaczenie każdej)
  NIE była przedmiotem POGŁĘBIONEJ weryfikacji w TEJ sesji — DO
  uzupełnienia reaktywnie PRZY konkretnej sprawie wymagającej
  szczegółowej ANALIZY zapisów W poszczególnych kolumnach — sprawdź
  wzór KSIĘGI stanowiący załącznik DO rozporządzenia (Dz.U. 2025
  poz. 1299) bezpośrednio na ISAP.
```

---

## 6. ZALICZKI, ZEZNANIE ROCZNE, PRZECHOWYWANIE

```
ZALICZKI NA PODATEK DOCHODOWY: wysokość USTALANA na podstawie zapisów
  W PKPiR — PŁATNE w terminie DO 20. dnia miesiąca NASTĘPUJĄCEGO po
  miesiącu/KWARTALE, za który wpłacana JEST zaliczka

ZEZNANIE ROCZNE: sporządzane NA podstawie zapisów W księdze — TERMIN
  do 30 KWIETNIA roku następującego PO roku podatkowym — FORMULARZ
  zależny OD formy opodatkowania: PIT-36 (skala PODATKOWA) lub
  PIT-36L (podatek LINIOWY)

⭐⭐ NOWY OBOWIĄZEK OD 2026 R. — PRZESYŁANIE KSIĘGI DO URZĘDU
  SKARBOWEGO: PO zakończeniu roku PODATKOWEGO, w TERMINIE do UPŁYWU
  terminu ZŁOŻENIA zeznania rocznego, PODATNIK przesyła WŁAŚCIWEMU
  naczelnikowi urzędu SKARBOWEGO księgę W formie USTRUKTURYZOWANEJ
  (JPK_PKPIR) — WYNIKA z NOWEGO art. 24a ust. 7 ustawy O PIT (dodany
  NOWELIZACJĄ wprowadzającą zmiany OD 2026 r.) — ⭐ ANALOGICZNY
  mechanizm DO obowiązków JPK_KR W pełnej księgowości (patrz
  mod-ustawa-rachunkowosci.md ORAZ ⚠️ powiązanie z modułem
  mod-JPK-ksiegi-elektroniczne-e-sprawozdania.md — patrz SEKCJA 8
  niżej, moduł NA razie tylko SZKICOWY)

PRZECHOWYWANIE KSIĘGI I DOWODÓW: OBOWIĄZEK wynika Z art. 86 Ordynacji
  podatkowej — DO czasu upływu OKRESU przedawnienia zobowiązania
  PODATKOWEGO (standardowo 5 LAT, licząc OD końca roku
  KALENDARZOWEGO, w KTÓRYM upłynął termin PŁATNOŚCI podatku), CHYBA
  że ustawy PODATKOWE stanowią INACZEJ — ⭐ PRZYKŁAD: księga ZA rok
  2018 (termin PŁATNOŚCI 30.04.2019) WYMAGAŁA przechowywania CO
  NAJMNIEJ do KOŃCA 2025 r. — POWIĄZANIE z mod-ustawa-rachunkowosci.md
  sekcja 4e (przechowywanie DOKUMENTACJI księgowej — TA SAMA
  metodologia 5-LETNIA, choć podstawa PRAWNA częściowo ODRĘBNA —
  Ordynacja podatkowa DLA PKPiR, u.o.r. DLA pełnych ksiąg)

USUNIĘTE OBOWIĄZKI (nowelizacja 2026, § 8 ust. 3-5 STAREGO
  rozporządzenia): BRAK obowiązku POSIADANIA przez PRZEDSIĘBIORSTWA
  wielozakładowe KSIĄG w RAMACH każdego zakładu ORAZ obowiązku
  sporządzania DOWODÓW przesunięć — TE wymogi ZOSTAŁY zniesione W
  ramach LIBERALIZACJI/upraszczania przepisów towarzyszącej
  wprowadzeniu FORMY elektronicznej
```

---

## 7. METODA KASOWA A MEMORIAŁOWA — MOMENT UJĘCIA KOSZTU

```
⭐⭐ DWIE METODY ROZLICZANIA KOSZTÓW (WYBÓR podatnika, art. 22 ustawy
  o PIT — POWIĄZANIE z mod-PIT-podatek-dochodowy-fizyczne.md):
  □ METODA KASOWA (UPROSZCZONA): za DZIEŃ poniesienia KOSZTU
    PRZYJMUJE się dzień WYSTAWIENIA faktury (LUB innego dowodu
    stanowiącego PODSTAWĘ zaksięgowania) — PROSTSZA, WIĘKSZOŚĆ
    małych przedsiębiorców JĄ stosuje
  □ METODA MEMORIAŁOWA: WYMAGA rozróżniania KOSZTÓW bezpośrednio i
    pośrednio ZWIĄZANYCH z osiąganym PRZYCHODEM —
    • koszty BEZPOŚREDNIE (m.in. towary HANDLOWE, materiały do
      PRODUKCJI) — ujmowane W okresie, W KTÓRYM powstają ODPOWIADAJĄCE
      im przychody
    • koszty POŚREDNIE (np. NAJEM, opłaty, PALIWO, wynagrodzenia) —
      W dacie ich PONIESIENIA (dacie wystawienia DOKUMENTU księgowego
      stanowiącego PODSTAWĘ zapisu) — ⭐ koszty POŚREDNIE przypadające
      NA okres PRZEKRACZAJĄCY dany rok PODATKOWY podlegają
      PROPORCJONALNEMU podziałowi na LATA (lub miesiące), KTÓRYCH
      dotyczą

⭐ MOMENT POWSTANIA PRZYCHODU: określony W samej ustawie O PIT (art.
  14), NIE w rozporządzeniu WYKONAWCZYM — zasada OGÓLNA: dzień
  WYDANIA rzeczy LUB wykonania usługi (LUB częściowego wykonania),
  NIE później niż dzień WYSTAWIENIA faktury ALBO uregulowania
  NALEŻNOŚCI — przychód POMNIEJSZANY o NALEŻNY VAT (dla PODATNIKÓW
  VAT czynnych)
```

---

## 8. POWIĄZANIA Z INNYMI MODUŁAMI

```
□ mod-ustawa-rachunkowosci.md — próg 2,5 mln EUR PRZEJŚCIA na pełne
  księgi (sekcja 2 tamtego modułu), metodyka PRZELICZENIA walutowego
  progu, DOWODY księgowe (analogiczne WYMOGI formalne), przechowywanie
  dokumentacji (WSPÓLNA metodologia 5-letnia)
□ mod-PIT-podatek-dochodowy-fizyczne.md — moment POWSTANIA przychodu
  (art. 14 PIT), metody ROZLICZANIA kosztów (art. 22 PIT), FORMULARZE
  zeznania rocznego (PIT-36/PIT-36L)
□ mod-ustawa-ryczalt-przychody.md — DLA podatników RYCZAŁTU od
  przychodów ewidencjonowanych, KTÓRZY NIE prowadzą PKPiR, lecz
  ODRĘBNĄ ewidencję przychodów — patrz ROZPORZĄDZENIE MFiG z
  6.09.2025 r. (Dz.U. 2025 poz. 1294), SEKCJA 1 tego modułu
□ ⚠️ mod-JPK-ksiegi-elektroniczne-e-sprawozdania.md — NA razie moduł
  wyłącznie SZKICOWY (patrz odrębny wpis W tej samej sesji
  uzupełniania luk) — DOTYCZY szczegółowo MECHANIZMU przesyłania
  JPK_PKPIR/JPK_KR wskazanego W sekcji 6 wyżej
□ mod-OP-ordynacja-podatkowa.md — art. 86 OP jako PODSTAWA obowiązku
  przechowywania KSIĄG i dowodów
```

---

## ⚠️ SAMOOCENA POKRYCIA — MODUŁ NOWO UTWORZONY

```
Ten moduł ZOSTAŁ zbudowany OD PODSTAW 2026-08-13, po wykryciu, że
BYŁ fantomowym wpisem w ROUTING-MAP.md (nigdy WCZEŚNIEJ nie
istniał jako PLIK — patrz flaga F-20). Pokrycie WSTĘPNE, oparte
na jednej SESJI wyszukiwania — NIE przechodził jeszcze przez
wielokrotne iteracje pogłębiające, W przeciwieństwie do np.
mod-VAT-podatek-od-towarow-i-uslug.md czy mod-ustawa-akcyzowa-i-
clo-UCC.md.

ZIDENTYFIKOWANE LUKI DO DALSZEGO POGŁĘBIENIA:
□ Dokładna treść 19 kolumn PKPiR (numeracja, nazwy, przeznaczenie)
□ Dokładny próg procentowy błędów przy ocenie rzetelności księgi
  (0,5%? — niepotwierdzone wprost w tej sesji)
□ Dokładna podstawa prawna i przesłanki zwolnienia z obowiązku
  PKPiR ze względu na szczególne okoliczności
□ Pełny katalog wymogów formalnych dowodu księgowego
□ Przeliczenie progu 2,5 mln EUR na PLN dla konkretnych lat
  (mechanizm znany, konkretne kwoty wymagają weryfikacji rocznej)

⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO NA ISAP] cała treść tego modułu —
ISAP niedostępny do web_fetch w tej sesji. Przed pismem procesowym
lub wiążącą poradą potwierdź brzmienie kluczowych przepisów wprost
na isap.sejm.gov.pl (WDU20250001299).
```

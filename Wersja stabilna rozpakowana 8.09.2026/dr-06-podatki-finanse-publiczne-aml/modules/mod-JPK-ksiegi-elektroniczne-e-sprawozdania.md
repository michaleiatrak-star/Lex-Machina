# JPK — Jednolity Plik Kontrolny: księgi elektroniczne i
e-sprawozdania

v1.0.0 (utworzony 2026-08-13, na żądanie użytkownika — moduł
odtworzony od podstaw po wykryciu, że był fantomowym wpisem w
ROUTING-MAP.md, patrz flaga F-20 w audyt-systemu-v4/references/
WARN-OTWARTE.md)

**Zweryfikowano 2026-08-13** (ZASADA 14): Rząd 1 — podatki.gov.pl
(broszura informacyjna JPK_VAT z deklaracją). Rząd 2B — comarch.pl,
insert.com.pl, poradnikprzedsiebiorcy.pl, haergi.pl, varico.pl,
accace.pl, symfonia.pl, jpk.info.pl, e-druki.pl, bizneserp.pl,
ksiegowego.pl. ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO PRZEZ ISAP] — ISAP
niedostępny do web_fetch w tej sesji, treść ustalona na podstawie
zgodnych źródeł wtórnych — przed pismem procesowym potwierdź
brzmienie kluczowych przepisów wprost na ISAP.

⚠️ TEMAT WYBITNIE DYNAMICZNY — harmonogram wdrożenia JPK_CIT jest w
toku (etapy do 2027-2028), a terminy były już raz przedłużane
rozporządzeniem z 2026 r. Sprawdź aktualny stan przed każdym
zastosowaniem.

---

## 1. PRZEGLĄD SYSTEMU JPK — RODZINA STRUKTUR

```
JPK (Jednolity Plik Kontrolny) TO zbiorcza NAZWA dla RODZINY
  ustrukturyzowanych plików ELEKTRONICZNYCH (formularze XML wg
  określonego SCHEMATU XSD), za POMOCĄ których podatnicy PRZEKAZUJĄ
  dane KSIĘGOWE/podatkowe organom SKARBOWYM — W MIEJSCE (lub
  UZUPEŁNIENIU) tradycyjnych PAPIEROWYCH/PDF deklaracji.

GŁÓWNE STRUKTURY, W PORZĄDKU chronologicznym WPROWADZENIA:
  □ JPK_VAT z deklaracją (JPK_V7M/JPK_V7K) — OBOWIĄZUJE od 1.10.2020 r.
    — PATRZ sekcja 2
  □ JPK_CIT (JPK_KR_PD + JPK_ST_KR) — WDRAŻANY etapami OD 2025 r. —
    PATRZ sekcja 3
  □ JPK_PKPIR — NOWY obowiązek OD 2026 r. DLA podatników PROWADZĄCYCH
    podatkową księgę PRZYCHODÓW i rozchodów — PATRZ sekcja 4 i
    mod-PKPiR-ewidencje-uproszczone.md sekcja 6
  □ JPK_KR (bez "_PD") — STARSZA, WĘŻSZA struktura KSIĄG rachunkowych,
    PRZESYŁANA WYŁĄCZNIE na ŻĄDANIE organu (kontrola PODATKOWA,
    celno-skarbowa, POSTĘPOWANIE podatkowe, czynności SPRAWDZAJĄCE)
    — NIE zlikwidowana PRZEZ wprowadzenie JPK_KR_PD, funkcjonuje
    RÓWNOLEGLE dla OKRESÓW sprzed obowiązkowego RAPORTOWANIA —
    PATRZ sekcja 5
  □ INNE struktury NA żądanie (JPK_FA — faktury, JPK_MAG — magazyn,
    JPK_WB — wyciągi bankowe, itd.) — ⚠️ [POZA ZAKRESEM TEJ SESJI]
    wymagają odrębnego OPRACOWANIA reaktywnie
```

---

## 2. JPK_VAT Z DEKLARACJĄ (JPK_V7M / JPK_V7K)

```
PODSTAWA: ustawa z 4.07.2019 r. o zmianie ustawy o podatku od
  towarów i usług oraz innych ustaw — WPROWADZIŁA nową strukturę,
  ŁĄCZĄCĄ dane WYKAZYWANE dotąd W deklaracji VAT-7/VAT-7K Z plikiem
  JPK_VAT — OD 1.10.2020 r. ZASTĄPIŁA obie te FORMY.

OBOWIĄZEK: dotyczy WSZYSTKICH czynnych PODATNIKÓW VAT (⛔ nie
  dotyczy PODATNIKÓW zwolnionych podmiotowo Z VAT — CI w dalszym
  ciągu NIE mają tego obowiązku)

DWA WARIANTY WEDŁUG OKRESU ROZLICZENIOWEGO:
  □ JPK_V7M — DLA podatników rozliczających VAT MIESIĘCZNIE
  □ JPK_V7K — DLA podatników rozliczających VAT KWARTALNIE (⭐ dostęp
    DO rozliczenia kwartalnego MAJĄ MALI podatnicy zarejestrowani DO
    VAT PRZEZ okres DŁUŻSZY niż 12 MIESIĘCY — status "małego
    podatnika" NA gruncie VAT: obrót W ciągu roku PODATKOWEGO NIE
    przekraczający 1 200 000 EUR — ⭐ ANALOGICZNY, choć NIE identyczny
    próg DO progu 2,5 mln EUR z u.o.r./PKPiR — NIE MYLIĆ progów Z
    różnych reżimów)

STRUKTURA PLIKU (4 GŁÓWNE węzły W formacie XML): Naglowek, Podmiot1,
  Deklaracja, Ewidencja
  □ CZĘŚĆ deklaracyjna — LUSTRZANE odbicie DAWNEJ deklaracji VAT-7
  □ CZĘŚĆ ewidencyjna — SZCZEGÓŁOWE dane O transakcjach sprzedaży I
    zakupu — ZAWIERA dane pozwalające NA prawidłowe rozliczenie
    podatku NALEŻNEGO i naliczonego, W TYM: numer DOWODU (faktura,
    faktura korygująca, RAPORT fiskalny), datę wystawienia DOWODU,
    OZNACZENIA procedur podatkowych, GRUPOWANIA GTU (towarów I usług
    o PODWYŻSZONYM ryzyku nadużyć)

WARIANTY SKŁADANIA DLA JPK_V7K (kwartalne): ⭐ ASYMETRIA między
  pierwszymi DWOMA miesiącami kwartału A trzecim:
  □ ZA pierwsze DWA miesiące kwartału: TYLKO część EWIDENCYJNA
    (elementy: Naglowek [Z wyjątkiem Kwartał/KodFormularzaDekl/
    WariantFormularzaDekl], Podmiot1, SprzedazWiersz, SprzedazCtrl,
    ZakupWiersz, ZakupCtrl)
  □ ZA trzeci MIESIĄC kwartału: PEŁNY plik — WSZYSTKIE elementy
    (Naglowek, Podmiot1, DEKLARACJA [dotycząca danych ZA CAŁY
    kwartał], Ewidencja [OBEJMUJĄCA dane TYLKO za OSTATNI miesiąc
    kwartału])

TERMIN: DO 25. dnia MIESIĄCA następującego PO miesiącu, KTÓREGO
  dotyczy ROZLICZENIE (⭐ ten SAM termin dla JPK_V7M co MIESIĄC oraz
  DLA JPK_V7K ZA trzeci miesiąc kwartału, obejmujący DEKLARACJĘ
  kwartalną)

⭐⭐ OBOWIĄZEK "ZEROWEGO" JPK_VAT: GDY W ewidencji I deklaracji ZA
  dany miesiąc/KWARTAŁ podatnik NIE wykonał ŻADNEJ transakcji
  wpływającej NA podatek VAT — MIMO to SKŁADA tzw. ZEROWY JPK_V7M/
  JPK_V7K, W KTÓRYM: W polach P_38 i P_51 (element DEKLARACJA)
  wykazuje "0", W elementach LiczbaWierszySprzedazy oraz
  LiczbaWierszyZakupow wykazuje "0", W elementach PodatekNalezny
  oraz PodatekNaliczony wykazuje "0.00" — ⭐ obowiązek TEN NIE ZNIKA
  wyłącznie DLATEGO, że NIE było TRANSAKCJI — BRAK złożenia
  ZEROWEGO pliku JEST samodzielnym naruszeniem

FORMA I AUTORYZACJA: WYŁĄCZNIE elektronicznie (E-Urząd Skarbowy,
  Portal Podatkowy, PROGRAMY FK/ERP) — metody AUTORYZACJI: podpis
  KWALIFIKOWANY (polski lub UE), Profil ZAUFANY, dane AUTORYZUJĄCE
  — POTWIERDZENIE złożenia: Urzędowe POŚWIADCZENIE Odbioru (UPO) —
  DOWÓD terminowego złożenia

⭐ AKTUALNA WERSJA STRUKTURY: JPK_V7M(3)/JPK_V7K(3) — OBOWIĄZUJE OD
  1.02.2026 r. (WCZEŚNIEJ wersja 2, DO 31.01.2026 r.) — ⚠️ [DO
  WERYFIKACJI PRZY KONKRETNEJ SPRAWIE] sprawdź, CZY nie WPROWADZONO
  KOLEJNEJ wersji struktury PO tej dacie

KOREKTY: PO 1.10.2020 r., KOREKTA poprzednich EWIDENCJI odbywa się
  NA "starych zasadach" (⚠️ [WYMAGA DOPRECYZOWANIA] — DOKŁADNY
  mechanizm KOREKTY struktury JPK_V7 NIE był przedmiotem POGŁĘBIONEJ
  weryfikacji W tej sesji, poza OGÓLNYM stwierdzeniem że KOREKTA
  odbywa SIĘ przez korektę DEKLARACJI VAT/korektę JPK)

MOMENT UJĘCIA DOKUMENTU: podatnicy W ewidencji UJMUJĄ faktury I
  dokumenty WEDŁUG DATY POWSTANIA OBOWIĄZKU PODATKOWEGO (⛔ NIE wg
  daty WYSTAWIENIA faktury, daty OTRZYMANIA zaliczki, daty ZAPŁATY
  ani innej DATY, jeśli W tym TERMINIE nie powstaje OBOWIĄZEK
  podatkowy) — ⭐ ISTOTNE rozróżnienie, ŹRÓDŁO częstych BŁĘDÓW w
  ewidencjonowaniu

SANKCJE ZA BŁĘDY: DO 500 ZŁ za KAŻDY błąd LUB brak W ewidencji
  (⚠️ [WYMAGA POWIĄZANIA] — patrz mod-VAT-podatek-od-towarow-i-uslug.md
  sekcja o EWIDENCJACH/JPK_V7 W rdzeniu VAT DLA pełnego omówienia
  ART. 109/109a/110 ustawy O VAT i sankcji 500 ZŁ oraz 100% — TA
  sekcja JEST uzupełnieniem TECHNICZNYM, nie ZASTĘPUJE analizy
  materialnoprawnej Z modułu VAT)

STRUKTURY ZASTĄPIONE PRZEZ JPK_V7: deklaracja VAT-7/VAT-7K, plik
  JPK_VAT (STARY, bez deklaracji), a TAKŻE m.in. VAT-ZT (wniosek O
  przyspieszenie terminu ZWROTU podatku VAT) — ⭐ NIEKTÓRE odrębne
  deklaracje POZOSTAŁY w mocy (⚠️ [NIEWERYFIKOWANE W PEŁNI] pełny
  katalog deklaracji NADAL wymaganych ODRĘBNIE od JPK_V7 wymaga
  pogłębienia PRZY konkretnej sprawie)
```

---

## 3. JPK_CIT (JPK_KR_PD I JPK_ST_KR)

```
✅ NOWY obowiązek — DWIE ODRĘBNE struktury logiczne:
  □ JPK_KR_PD — dane Z KSIĄG rachunkowych (dziennik, OBROTY, salda,
    numery FAKTUR z KSeF, NIP kontrahentów)
  □ JPK_ST_KR — WYŁĄCZNIE ewidencja ŚRODKÓW trwałych oraz wartości
    NIEMATERIALNYCH i prawnych

⭐⭐⭐ HARMONOGRAM WDROŻENIA — TRZY ETAPY (OD roku podatkowego
  rozpoczynającego SIĘ po 31.12.2024 r. DO roku rozpoczynającego się
  po 31.12.2026 r.):
  □ ETAP 1 (OD 1.01.2025 r.): NAJWIĘKSI podatnicy ORAZ podatkowe
    grupy KAPITAŁOWE — PIERWSZY plik JPK_KR_PD ZA rok 2025, przesyłany
    W 2026 r. — DLA spółek Z grupy kapitałowej I podatników Z
    przychodem POWYŻEJ 50 mln EUR: TERMIN pierwotnie DO 31.03.2026 r.
    (data upływu TERMINU złożenia zeznania CIT ZA rok podatkowy 2025)
  □ ETAP 2 (OD roku PODATKOWEGO rozpoczynającego się PO 31.12.2025 r.,
    a WIĘC OD 2026 r.): pozostali PODATNICY CIT obowiązani DO
    składania ewidencji JPK_VAT (JPK_V7M/V7K) — ⭐ PODATNICY Z
    przychodem PONIŻEJ 50 mln EUR, jeśli ROK podatkowy JEST tożsamy
    Z kalendarzowym, PRZESYŁAJĄ pierwszy plik JPK_KR_PD ZA rok 2026
    do 31.07.2027 r.
  □ ETAP 3 (OD roku PODATKOWEGO rozpoczynającego się PO 31.12.2026 r.):
    POZOSTALI podatnicy CIT (CI, którzy NIE składają JPK_VAT ALBO
    składają go KWARTALNIE) — ⭐ OSTATNIA grupa

⭐⭐⭐ WYDŁUŻENIE TERMINU — ROZPORZĄDZENIE MFiG Z 16.02.2026 R. (Dz.U.
  2026 poz. 188, OPUBLIKOWANE 19.02.2026 r.): TERMIN przesyłania
  pliku JPK_KR_PD ZOSTAŁ WYDŁUŻONY z TRZECH do SIEDMIU miesięcy PO
  zakończeniu roku PODATKOWEGO lub obrotowego (dla PIERWSZEJ grupy
  podatników OBJĘTYCH nowym obowiązkiem — DOTYCZY przesyłania KSIĄG
  za rok PODATKOWY rozpoczynający SIĘ po 31.12.2024 r., a KOŃCZĄCY
  się przed 1.04.2026 r.) — ⭐ ROZWIĄZANIE oznaczone JAKO TYMCZASOWE
  W ROUTING-MAP.md (patrz FLAGA F-20) — ⚠️ [WYMAGA WERYFIKACJI]
  SPRAWDŹ, CZY nie NASTĄPIŁA dalsza ZMIANA terminu PO tej dacie
  ⭐⭐ POWIĄZANA nowelizacja: ustawa Z 15.05.2026 r. o ZMIANIE ustawy
  o podatku DOCHODOWYM — WPROWADZAJĄCA TRWAŁY (nie tymczasowy) termin
  7-MIESIĘCZNY (art. 9 ust. 1c i 1e CIT) — WESZŁA w ŻYCIE 1.07.2026 r.
  — ⭐ TA ustawa PRZEKSZTAŁCA tymczasowe ROZWIĄZANIE z rozporządzenia
  W trwałą REGULACJĘ ustawową

ROZSZERZONY ZAKRES DANYCH (od 2026 r., DLA lat podatkowych
  rozpoczynających SIĘ w PEŁNI po 31.12.2025 r.) — KSIĘGI RACHUNKOWE
  w formacie JPK_CIT MUSZĄ być UZUPEŁNIONE o:
  1) dane IDENTYFIKACYJNE kontrahenta PODATNIKA (m.in. NIP, NAZWA
     lub imię i NAZWISKO)
  2) numer IDENTYFIKUJĄCY fakturę W Krajowym Systemie e-FAKTUR (o
     ILE został nadany DO dnia złożenia KSIĄG)
  3) dane POTWIERDZAJĄCE nabycie, WYTWORZENIE lub wykreślenie Z
     ewidencji ŚRODKA trwałego LUB wartości niematerialnej I prawnej
  4) DANE dotyczące różnic MIĘDZY wynikiem BILANSOWYM a podatkowym
  ⭐ WYJĄTEK PRZEJŚCIOWY: GDY rok podatkowy (obrotowy) ROZPOCZYNA się
  W trakcie 2025 r. — KSIĘGI NIE muszą zawierać DODATKOWYCH danych z
  PUNKTÓW 1, 2 i 4 (⚠️ [NIEJEDNOZNACZNE] jeden Z przeszukanych źródeł
  wymienia RÓWNIEŻ punkt "5", INNY tylko 1/2/4 — ROZBIEŻNOŚĆ MIĘDZY
  ŹRÓDŁAMI, sprawdź dokładny KATALOG wyłączeń przejściowych PRZY
  konkretnej sprawie)

⭐ ROZPORZĄDZENIE MF Z 13.12.2024 R. — ODROCZENIE JPK_ST_KR: obowiązek
  RAPORTOWANIA danych z EWIDENCJI środków trwałych/wartości
  niematerialnych ZOSTAŁ przesunięty O ROK — PIERWSZYM rokiem
  podatkowym, za KTÓRY ma być PRZESŁANA struktura JPK_ST_KR JEST rok
  podatkowy ROZPOCZYNAJĄCY się 1.01.2026 r. LUB później — TERMIN na
  WYSYŁKĘ tego pliku DLA podmiotów, u KTÓRYCH rok podatkowy POKRYWA
  się z kalendarzowym: DO KOŃCA marca 2027 r. — ⭐ TO PRZESUNIĘCIE
  dotyczyło WYŁĄCZNIE największych podmiotów, PIERWOTNIE zobowiązanych
  do wysyłki JUŻ za 2025 r.

⭐ UŁATWIENIE PRZEJŚCIOWE (transza 2025): PODMIOTY zobowiązane DO
  złożenia JPK_KR_PD ZA 2025 r. MOGĄ uwzględnić W strukturze
  logicznej SWOICH ksiąg rachunkowych ZALEDWIE JEDEN element —
  znaczniki IDENTYFIKUJĄCE konta ksiąg WYKAZYWANE według SŁOWNIKA
  zawartego W rozporządzeniu MF

⭐ RELACJA DO JPK_KR (BEZ "_PD"): wprowadzenie JPK_KR_PD NIE likwiduje
  STARSZEJ struktury JPK_KR — TA funkcjonuje NADAL, m.in. DLA okresów
  SPRZED obowiązkowego raportowania W formie JPK_KR_PD, oraz JAKO
  struktura PRZESYŁANA na ŻĄDANIE organu (patrz SEKCJA 5)

⚠️ TRWAJĄ PRACE LEGISLACYJNE mające NA celu PRZEDŁUŻENIE i
  ujednolicenie TERMINÓW dla KOLEJNYCH grup podatników, ABY dostosować
  termin SKŁADANIA JPK_CIT do PROCESU przygotowywania i ZATWIERDZANIA
  sprawozdań finansowych — ⚠️ [MONITORUJ] SPRAWDŹ najnowszy stan
  PRZED konkretną sprawą, temat W TOKU zmian
```

---

## 4. JPK_PKPIR

```
✅ NOWY obowiązek OD 2026 r. DLA podatników PROWADZĄCYCH podatkową
  księgę PRZYCHODÓW i rozchodów (patrz mod-PKPiR-ewidencje-
  uproszczone.md, sekcja 6, DLA pełnego omówienia OD strony PKPiR).

MECHANIZM: PO zakończeniu roku PODATKOWEGO, w TERMINIE do UPŁYWU
  terminu ZŁOŻENIA zeznania rocznego, PODATNIK przesyła WŁAŚCIWEMU
  naczelnikowi urzędu SKARBOWEGO księgę W formie USTRUKTURYZOWANEJ
  (JPK_PKPIR) — WYNIKA z NOWEGO art. 24a UST. 7 ustawy o PIT

⚠️ [ZAKRES OGRANICZONY W TEJ SESJI] dokładna STRUKTURA techniczna
  pliku JPK_PKPIR (nazwa węzłów XML, SCHEMAT XSD) NIE była przedmiotem
  ODRĘBNEJ, pogłębionej weryfikacji W tej sesji — sprawdź WZÓR
  struktury logicznej BEZPOŚREDNIO w rozporządzeniu (Dz.U. 2025 poz.
  1299) LUB na PUESC przy konkretnej sprawie.

POWIĄZANE ROZPORZĄDZENIE Z DANYMI DODATKOWYMI: rozporządzenie MFiG z
  6.09.2025 r. W sprawie DODATKOWYCH danych, o KTÓRE należy uzupełnić
  prowadzone KSIĘGI rachunkowe i ewidencję ŚRODKÓW trwałych oraz
  wartości NIEMATERIALNYCH i prawnych podlegające PRZEKAZANIU na
  podstawie ustawy o PIT (Dz.U. 2025 poz. 1311) — TRZECIE z TRZECH
  powiązanych rozporządzeń Z 6.09.2025 r. (patrz mod-PKPiR-
  ewidencje-uproszczone.md sekcja 1)
```

---

## 5. JPK_KR (BEZ "_PD") — NA ŻĄDANIE ORGANU

```
CHARAKTER: STRUKTURA JPK dotycząca KSIĄG rachunkowych, PRZESYŁANA
  wyłącznie NA ŻĄDANIE organów podatkowych W ramach: kontroli
  PODATKOWEJ, kontroli celno-SKARBOWEJ, postępowania PODATKOWEGO,
  lub czynności SPRAWDZAJĄCYCH — ⛔ NIE jest to obowiązek OKRESOWY/
  cykliczny jak JPK_V7 czy JPK_KR_PD, TYLKO reaktywny NA żądanie
  KONKRETNEGO organu W konkretnej SPRAWIE

RÓŻNICA WZGLĘDEM JPK_KR_PD: nowa struktura JPK_KR_PD JEST
  ROZBUDOWANA względem STAREGO JPK_KR o DODATKOWE informacje (patrz
  sekcja 3 wyżej — DANE kontrahenta, numer KSeF, dane O środkach
  trwałych, RÓŻNICE bilansowo-podatkowe)

⚠️ [ZAKRES NIEOPRACOWANY W TEJ SESJI] szczegółowa PROCEDURA żądania
  JPK_KR przez ORGAN (forma żądania, TERMIN na odpowiedź PODATNIKA,
  konsekwencje NIEZŁOŻENIA) NIE była przedmiotem POGŁĘBIONEJ
  weryfikacji — patrz mod-KAS-kontrola-celno-skarbowa.md i
  mod-OP-kontrola-podatkowa-dzial-VI.md DLA ogólnych ram PROCEDURALNYCH
  kontroli, W RAMACH których żądanie JPK_KR MOŻE się POJAWIĆ.
```

---

## 6. POWIĄZANIA Z INNYMI MODUŁAMI

```
□ mod-PKPiR-ewidencje-uproszczone.md — sekcja 6 (obowiązek
  przesyłania JPK_PKPIR), sekcja 1 (trzy powiązane rozporządzenia
  z 6.09.2025 r.)
□ mod-ustawa-rachunkowosci.md — pełne księgi rachunkowe jako
  źródło danych dla JPK_KR_PD/JPK_ST_KR; sekcja 4e (przechowywanie
  dokumentacji księgowej — powiązanie z retencją danych JPK)
□ mod-VAT-podatek-od-towarow-i-uslug.md — rdzeń materialnoprawny
  ewidencji VAT (art. 109/109a/110 ustawy o VAT), sankcje za błędy
  w ewidencji (500 zł, 100%) — TA sekcja JPK jest uzupełnieniem
  technicznym/proceduralnym, nie zastępuje analizy materialnoprawnej
□ mod-CIT-podatek-dochodowy-prawne.md — podatnicy CIT jako adresaci
  obowiązku JPK_KR_PD/JPK_ST_KR
□ mod-KAS-kontrola-celno-skarbowa.md, mod-OP-kontrola-podatkowa-
  dzial-VI.md — procedura żądania JPK_KR w toku kontroli
```

---

## ⚠️ SAMOOCENA POKRYCIA — MODUŁ NOWO UTWORZONY

```
Ten moduł ZOSTAŁ zbudowany OD PODSTAW 2026-08-13, po wykryciu, że
BYŁ fantomowym wpisem w ROUTING-MAP.md (patrz flaga F-20). Pokrycie
WSTĘPNE, oparte na JEDNEJ sesji wyszukiwania.

ZIDENTYFIKOWANE LUKI DO DALSZEGO POGŁĘBIENIA:
□ Dokładna struktura techniczna JPK_PKPIR (węzły XML, schemat)
□ Pełny katalog struktur JPK "na żądanie" poza JPK_KR (JPK_FA,
  JPK_MAG, JPK_WB i inne)
□ Procedura żądania JPK_KR przez organ (forma, terminy, sankcje
  za niezłożenie)
□ Mechanizm korekty JPK_V7 ("stare zasady") — wymaga doprecyzowania
□ Aktualny stan prac legislacyjnych ws. ujednolicenia terminów
  JPK_CIT dla kolejnych grup podatników (temat w toku na dzień
  weryfikacji)
□ Rozbieżność źródeł co do dokładnego katalogu wyłączeń przejściowych
  dla JPK_CIT za lata rozpoczynające się w 2025 r. (punkty 1/2/4 vs
  1/2/4/5)

⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO NA ISAP] cała treść tego modułu —
ISAP niedostępny do web_fetch w tej sesji. Przed pismem procesowym
lub wiążącą poradą potwierdź brzmienie kluczowych przepisów wprost
na isap.sejm.gov.pl.
```

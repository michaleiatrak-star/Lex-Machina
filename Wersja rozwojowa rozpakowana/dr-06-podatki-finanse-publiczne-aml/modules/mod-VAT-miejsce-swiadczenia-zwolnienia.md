# Moduł — VAT: miejsce świadczenia usług, grupa VAT, zwolnienie podmiotowe, VAT marża, eksport/WDT

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie). Moduł MACIERZYSTY (z aktualnym stanem
> weryfikacji ustawy, ostrzeżeniami o nowelizacjach i alertami
> KSeF/PKWiU): `mod-VAT-podatek-od-towarow-i-uslug.md`.
>
> **⛔ KRYTYCZNE ostrzeżenie (dotyczy CAŁEJ rodziny plików VAT):**
> podstawowy termin zwrotu różnicy podatku to **40 DNI** (art. 87
> ust. 2 zd. 1), NIE 60 dni — SPRAWDŹ moduł macierzysty PRZED
> cytowaniem tego terminu.

---

### ⭐⭐⭐ MIEJSCE ŚWIADCZENIA USŁUG (Dział V Rozdział 3, art. 28a–28o
ustawy VAT) — dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w
audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne — mechanizm
FUNDAMENTALNY, decydujący CZY dana usługa W OGÓLE podlega polskiemu
VAT)

```
⭐⭐⭐ ZNACZENIE PRAKTYCZNE: "miejsce świadczenia" TO w istocie miejsce
  POWSTANIA obowiązku podatkowego — DECYDUJE, CZY usługa PODLEGA
  polskiemu VAT, CZY VAT innego KRAJU (lub W OGÓLE nie podlega VAT w
  UE) — BŁĘDNE ustalenie miejsca świadczenia SKUTKUJE zaniżeniem LUB
  zawyżeniem podatku, NIEZALEŻNIE od PRAWIDŁOWO ustalonej stawki

⭐⭐ DEFINICJA "PODATNIKA" NA POTRZEBY TEGO ROZDZIAŁU (art. 28a) —
  SZERSZA niż ogólna definicja Z art. 15:
  → podmiot SAMODZIELNIE wykonujący działalność GOSPODARCZĄ (art. 15
    ust. 1–2), NIEZALEŻNIE od CELU i REZULTATU tej działalności
  → osoba PRAWNA niebędąca podatnikiem wg powyższego, ALE OBOWIĄZANA
    do IDENTYFIKACJI na potrzeby VAT/podatku o PODOBNYM charakterze
  → OBEJMUJE również podatnika Z INNEGO państwa członkowskiego ORAZ
    podatnika Z kraju TRZECIEGO — status "PODATNIKA" NA gruncie
    Działu V NIE jest ograniczony DO podmiotów polskich

⭐⭐⭐ ZASADA OGÓLNA #1 — USŁUGI B2B (art. 28b ust. 1): miejscem
  świadczenia USŁUG na rzecz PODATNIKA jest miejsce, W KTÓRYM
  usługobiorca POSIADA SIEDZIBĘ działalności gospodarczej — ⚠️
  DECYDUJE siedziba NABYWCY, nie sprzedawcy (odwrotnie NIŻ przy B2C)
  □ WYJĄTEK — STAŁE MIEJSCE PROWADZENIA DZIAŁALNOŚCI (FE, ust. 2):
    JEŚLI usługa jest świadczona DLA stałego miejsca prowadzenia
    działalności usługobiorcy, POŁOŻONEGO w INNYM miejscu niż JEGO
    siedziba — MIEJSCEM świadczenia JEST TO stałe miejsce
  □ WYJĄTEK — BRAK siedziby/FE (ust. 3): miejscem świadczenia jest
    MIEJSCE stałego ZAMIESZKANIA/zwykłego pobytu usługobiorcy
  □ WYJĄTEK — CELE OSOBISTE (ust. 4): usługi PRZEZNACZONE wyłącznie
    NA cele osobiste PODATNIKA/pracowników/wspólników — STOSUJE SIĘ
    odpowiednio zasady Z art. 28c (jak DLA konsumenta)

⭐⭐⭐ ZASADA OGÓLNA #2 — USŁUGI B2C (art. 28c ust. 1): miejscem
  świadczenia USŁUG na rzecz PODMIOTÓW niebędących podatnikami
  (konsumentów) jest miejsce, W KTÓRYM usługodawca POSIADA siedzibę
  działalności GOSPODARCZEJ — ⚠️ DECYDUJE siedziba SPRZEDAWCY (ODWROTNIE
  niż PRZY B2B) — POLSKI usługodawca ŚWIADCZĄCY na rzecz konsumenta
  (np. Z INNEGO kraju UE) CO DO ZASADY rozlicza VAT W Polsce, chyba że
  ZASTOSOWANIE ma jeden Z licznych WYJĄTKÓW poniżej
  □ ANALOGICZNY wyjątek FE PO stronie USŁUGODAWCY (ust. 2)

⭐⭐⭐ KATALOG WYJĄTKÓW OD ZASAD OGÓLNYCH (art. 28d–28n) — DLA
  KAŻDEGO wyjątku sprawdź, CZY dotyczy TYLKO B2C, TYLKO B2B, CZY OBU:

  → art. 28d — POŚREDNICY działający W IMIENIU i NA rzecz osób
    NIEBĘDĄCYCH podatnikami: miejsce, GDZIE dokonano TRANSAKCJI
    podstawowej (dotyczy WYŁĄCZNIE B2C — przy B2B stosuje SIĘ zasadę
    ogólną art. 28b)

  → art. 28e — USŁUGI ZWIĄZANE Z NIERUCHOMOŚCIĄ (rzeczoznawcy,
    pośrednicy W obrocie nieruchomościami, ZAKWATEROWANIE, usługi
    przygotowania/koordynacji ROBÓT budowlanych, UDZIELANIE prawa
    użytkowania NIERUCHOMOŚCI): miejsce POŁOŻENIA nieruchomości —
    ⭐ DOTYCZY OBU (B2B i B2C) — WYJĄTEK BEZWZGLĘDNY, NIEZALEŻNY OD
    statusu nabywcy — ⚠️ CZĘSTY SPÓR: CZY usługa jest "WYSTARCZAJĄCO
    związana" Z KONKRETNĄ nieruchomością (art. 31a rozp. 282/2011
    doprecyzowuje: WYMAGANY bezpośredni ZWIĄZEK z OKREŚLONĄ
    nieruchomością, NIE wystarczy OGÓLNY związek Z branżą
    nieruchomości)

  → art. 28f — TRANSPORT PASAŻERÓW: miejsce, GDZIE OdBYWA SIĘ
    transport, proporcjonalnie DO POKONANYCH odległości (dotyczy OBU)
    | TRANSPORT TOWARÓW: DLA B2B — zasada ogólna art. 28b (siedziba
    nabywcy); DLA B2C — miejsce ROZPOCZĘCIA transportu, Z WYJĄTKIEM
    transportu WEWNĄTRZWSPÓLNOTOWEGO (miejsce ROZPOCZĘCIA, ALE inne
    zasady PRZY podaniu numeru VAT — ⚠️ SZCZEGÓŁOWA analiza WYMAGA
    odrębnej weryfikacji przy TRANSPORCIE międzynarodowym)

  → art. 28g — USŁUGI KULTURALNE, artystyczne, SPORTOWE, naukowe,
    edukacyjne, ROZRYWKOWE i PODOBNE (WSTĘP na imprezy + usługi
    POMOCNICZE): DLA B2C — miejsce, GDZIE usługi SĄ faktycznie
    wykonywane; DLA B2B — WSTĘP na TAKIE imprezy: miejsce, GDZIE
    impreza SIĘ odbywa (POZOSTAŁE usługi B2B ZWIĄZANE Z tą
    działalnością — zasada OGÓLNA art. 28b)

  → art. 28h–28h1 — USŁUGI POMOCNICZE do transportu (załadunek,
    rozładunek, przeładunek) I WYCENA/prace NA rzeczowym majątku
    RUCHOMYM: DLA B2C — miejsce FAKTYCZNEGO wykonania

  → art. 28i — USŁUGI RESTAURACYJNE i CATERINGOWE: miejsce
    FAKTYCZNEGO wykonania (dotyczy OBU) — ⭐ WYJĄTEK: GDY usługi TE są
    faktycznie WYKONYWANE na POKŁADACH statków, statków POWIETRZNYCH
    lub W pociągach PODCZAS części transportu PASAŻERÓW wykonanej NA
    terytorium UE — miejsce ROZPOCZĘCIA transportu PASAŻERÓW (art.
    28i ust. 2, w ZW. z art. 28f ust. 1a) — POWIĄZANIE Z mechanizmem
    "gastronomia/catering" opisanym W module klasyfikacji VAT
    (STAWKA), ALE to ODRĘBNE zagadnienie (MIEJSCE vs STAWKA)

  → art. 28j — KRÓTKOTERMINOWY wynajem ŚRODKÓW transportu (do 30 dni,
    a DLA jednostek pływających DO 90 dni): miejsce, GDZIE środek
    transportu jest FAKTYCZNIE oddawany DO dyspozycji usługobiorcy
    (dotyczy OBU) | DŁUGOTERMINOWY wynajem B2C: miejsce SIEDZIBY/
    zamieszkania usługobiorcy, Z WYJĄTKIEM jednostek pływających
    rekreacyjnych (miejsce ODDANIA do dyspozycji, PRZY dodatkowych
    warunkach)

  → art. 28k — USŁUGI TELEKOMUNIKACYJNE, NADAWCZE i ELEKTRONICZNE
    na rzecz PODMIOTÓW niebędących podatnikami: miejsce, GDZIE
    nabywca POSIADA siedzibę/stałe MIEJSCE zamieszkania/zwykłe
    miejsce POBYTU — ⭐⭐ KLUCZOWE dla e-commerce/usług CYFROWYCH:
    SPRZEDAWCA rozlicza VAT WEDŁUG stawki KRAJU KONSUMENTA, NIE
    własnego kraju — ⭐ POWIĄZANIE z mechanizmem VAT OSS (sekcja
    wyżej W tym module) — REJESTRACJA W OSS pozwala UNIKNĄĆ
    rejestracji LOKALNEJ w KAŻDYM państwie nabywcy

  → art. 28l — "USŁUGI NIEMATERIALNE" (m.in. DORADCZE, prawnicze,
    księgowe, INŻYNIERSKIE, tłumaczeń, REKLAMY, przetwarzania
    danych, dostarczania INFORMACJI, bankowe/finansowe/
    ubezpieczeniowe, UDOSTĘPNIANIA personelu, WYNAJMU rzeczy
    ruchomych — Z WYŁĄCZENIEM środków TRANSPORTU): DLA B2C, GDY
    nabywca MA siedzibę/miejsce zamieszkania POZA terytorium UE —
    miejsce SIEDZIBY/zamieszkania NABYWCY (a NIE usługodawcy) — ⭐
    ISTOTNE dla POLSKICH kancelarii/firm DORADCZYCH świadczących
    USŁUGI dla klientów SPOZA UE (np. USA, Wielka Brytania POZA
    ramami odrębnych umów) — TAKA usługa MOŻE być POZA zakresem
    polskiego VAT

  → art. 28n — USŁUGI TURYSTYKI rozliczane W procedurze MARŻY:
    miejsce SIEDZIBY/stałego miejsca prowadzenia działalności/
    zwykłego miejsca POBYTU usługodawcy — STATUS usługobiorcy NIE MA
    znaczenia (JEDYNY wyjątek W całym katalogu, GDZIE nie ROZRÓŻNIA
    się B2B/B2C)

  → art. 28o — DELEGACJA dla MINISTRA finansów DO określenia W
    rozporządzeniu INNEGO miejsca świadczenia W szczególnych
    przypadkach — SPRAWDŹ aktualne rozporządzenia WYKONAWCZE przy
    nietypowym STANIE faktycznym

⭐⭐⭐ STAŁE MIEJSCE PROWADZENIA DZIAŁALNOŚCI (FE / "Fixed
  Establishment") — KLUCZOWE, SPORNE pojęcie warunkujące ZASTOSOWANIE
  wyjątku Z art. 28b ust. 2:
  □ PODSTAWA: art. 11 rozporządzenia WYKONAWCZEGO Rady (UE) 282/2011
    — brak ODRĘBNEJ definicji W samej ustawie VAT, STOSUJE SIĘ
    BEZPOŚREDNIO przepis UNIJNY
  □ DEFINICJA: miejsce INNE niż siedziba, charakteryzujące SIĘ
    WYSTARCZAJĄCĄ stałością ORAZ odpowiednią STRUKTURĄ zaplecza
    PERSONALNEGO i TECHNICZNEGO, umożliwiającą ODBIÓR/wykorzystanie
    (jako NABYWCA) lub ŚWIADCZENIE (jako sprzedawca) usług
  □ SAM numer VAT NIE JEST wystarczający DO uznania istnienia FE
    (utrwalone orzecznictwo TSUE)
  □ ⭐⭐⭐ ORZECZNICTWO TSUE — LINIA interpretacyjna:
    → C-931/19 Titanium: SAMA nieruchomość BEZ zasobów LUDZKICH
      umożliwiających SAMODZIELNE działanie NIE stanowi FE (WYNAJEM
      nieruchomości bez WŁASNEGO personelu na MIEJSCU — NIE tworzy FE)
    → C-547/18 Dong Yang Electronics: sama KONTROLA kapitałowa nad
      spółką ZALEŻNĄ (spółka-córka) NIE oznacza AUTOMATYCZNIE, że
      spółka MATKA ma FE W kraju spółki córki
    → C-333/20 Berlin Chemie: WŁASNE zaplecze NIE jest konieczne —
      WYSTARCZY, że podatnik jest UPRAWNIONY dysponować cudzym
      zapleczem TAK, jakby BYŁO własne (np. NA podstawie umowy o
      świadczenie USŁUG) — ALE samo ODDELEGOWANIE czynności
      technicznych innemu PODMIOTOWI (podwykonawcy) NIE tworzy
      AUTOMATYCZNIE FE
    → C-232/22 Cabot Plastics (29.06.2023, ⚠️ ZWERYFIKUJ aktualność
      cytowania w konkretnej sprawie): potwierdza, że MINIMALNA
      trwałość W postaci SAMEGO zgromadzenia zasobów, ANI sama
      kontrola EKONOMICZNA nad zapleczem podwykonawcy — NIE
      WYSTARCZAJĄ
    → C-533/22 SC Adient: KONTYNUACJA linii ZAOSTRZAJĄCEJ kryteria —
      usługodawca i JEGO zaplecze u PODWYKONAWCY NIE tworzą
      AUTOMATYCZNIE FE nabywcy TYLKO dlatego, że USŁUGI są
      świadczone WYŁĄCZNIE na jego rzecz
  □ TRZY PRZESŁANKI łącznie (wg praktyki/objaśnień MF): (1)
    ODPOWIEDNIE zaplecze PERSONALNE i techniczne, (2) STRUKTURA
    umożliwiająca SAMODZIELNE wykonywanie czynności opodatkowanych,
    (3) WYSTARCZAJĄCA stałość
  □ ⭐ POWIĄZANIE Z KSeF: OD 1.02.2026 r. posiadanie FE W Polsce
    (przez PODMIOT zagraniczny) MOŻE skutkować OBOWIĄZKIEM
    wystawiania faktur W KSeF — TYLKO GDY FE "CZYNNIE uczestniczy"
    W konkretnej TRANSAKCJI — MF opublikowało OBJAŚNIENIA W tym
    zakresie 28.01.2026 r. — ⚠️ WERYFIKUJ aktualną TREŚĆ objaśnień
    przy SPRAWACH z udziałem podmiotów ZAGRANICZNYCH
  □ ⚠️ ROZBIEŻNOŚĆ: wykładnia TSUE jest OGÓLNIE korzystniejsza DLA
    podatników niż PRAKTYKA polskich organów PODATKOWYCH — choć
    odnotowuje SIĘ (2026) pewne ZŁAGODZENIE podejścia KRAJOWEGO —
    PRZY sporze rozważ powołanie SIĘ wprost na LINIĘ TSUE

⭐ ODRĘBNOŚĆ OD "ZAKŁADU" W PODATKACH DOCHODOWYCH: FE (fixed
  establishment) funkcjonuje WYŁĄCZNIE na gruncie VAT i jest
  NIEZALEŻNE pojęciowo OD "zakładu" (permanent establishment) na
  gruncie CIT/umów O unikaniu podwójnego opodatkowania — ⚠️ ISTNIENIE
  zakładu CIT NIE przesądza AUTOMATYCZNIE o istnieniu FE dla VAT (i
  ODWROTNIE) — WYMAGANA odrębna ANALIZA dla każdego podatku

⭐ POWIĄZANIE Z WNT/IMPORTEM USŁUG (sekcja wyżej w tym module):
  USTALENIE miejsca świadczenia USŁUGI (art. 28b) jest KROKIEM
  POPRZEDZAJĄCYM analizę, CZY dochodzi DO importu usług Z
  odwrotnym obciążeniem — JEŚLI miejscem świadczenia usługi
  nabywanej PRZEZ polskiego podatnika OD zagranicznego usługodawcy
  jest POLSKA (zasada OGÓLNA art. 28b) — DOPIERO wtedy AKTUALIZUJE
  SIĘ mechanizm importu usług OPISANY wyżej

Checklist praktyczny:
□ Czy usługobiorca JEST podatnikiem W rozumieniu art. 28a (SZERSZA
  definicja niż art. 15) — TO PRZESĄDZA, czy STOSOWAĆ zasadę B2B (28b)
  czy B2C (28c) jako PUNKT wyjścia
□ Czy usługa MIEŚCI SIĘ w KTÓRYMŚ z wyjątków art. 28d–28n — PRZEJRZYJ
  KATALOG ZANIM zastosujesz zasadę OGÓLNĄ
□ PRZY usłudze dotyczącej NIERUCHOMOŚCI (art. 28e) — czy ZWIĄZEK z
  KONKRETNĄ nieruchomością jest WYSTARCZAJĄCO bezpośredni (art. 31a
  rozp. 282/2011), CZY to tylko OGÓLNY związek branżowy
□ Przy TRANSAKCJACH z podmiotem ZAGRANICZNYM — czy KONTRAHENT
  POSIADA FE w Polsce (LUB odwrotnie) — ZWERYFIKUJ wg TRZECH
  przesłanek TSUE, nie POPRZESTAWAJ na SAMYM numerze VAT
□ Czy USTALONE miejsce świadczenia jest SPÓJNE z DEKLAROWANYM
  traktowaniem transakcji NA fakturze (stawka KRAJOWA vs "poza
  zakresem VAT w PL"/"odwrotne obciążenie" vs "NP" — wykaz POZA
  terytorium kraju)
□ Przy USŁUGACH cyfrowych/elektronicznych DLA konsumentów w UE —
  czy ROZWAŻONO rejestrację W OSS zamiast rejestracji LOKALNEJ W
  każdym kraju nabywcy

⚠️ Weryfikuj aktualne brzmienie art. 28a–28o w ISAP oraz NAJNOWSZE
  orzecznictwo TSUE dot. FE — TO OBSZAR o WYSOKIEJ dynamice
  interpretacyjnej, SZCZEGÓLNIE przy transakcjach TRANSGRANICZNYCH
  z udziałem PODMIOTÓW powiązanych/podwykonawców.
```

### ⭐⭐⭐ ZWOLNIENIE PODMIOTOWE (art. 113) I PROCEDURA SME — dodane
2026-08-12, na żądanie użytkownika (priorytet #1 z mapy pokrycia
VAT — dotąd TYLKO przelotna wzmianka wewnątrz innej sekcji)

```
⚠️⚠️ WAŻNA ZMIANA OD 1.01.2026 R.: limit PODWYŻSZONY Z 200 000 ZŁ
  NA **240 000 ZŁ** — ⭐ TA zmiana JEST BARDZO ŚWIEŻA (obowiązuje OD
  początku BIEŻĄCEGO roku) — WIELE starszych, wcześniej
  ZWERYFIKOWANYCH źródeł/materiałów W SYSTEMIE MOŻE nadal cytować
  STARY próg 200 000 zł — SPRAWDŹ i SKORYGUJ WSZĘDZIE, gdzie TEN
  próg JEST wspominany

⭐⭐⭐ PODSTAWOWA ZASADA (art. 113 ust. 1): ZWALNIA SIĘ od podatku
  sprzedaż DOKONYWANĄ przez PODATNIKÓW, U KTÓRYCH wartość SPRZEDAŻY
  NIE PRZEKROCZYŁA łącznie W POPRZEDNIM roku podatkowym kwoty
  **240 000 ZŁ** — DO wartości sprzedaży NIE WLICZA się kwoty
  podatku (LICZY SIĘ NETTO)

⭐⭐ CO WLICZA SIĘ DO LIMITU (art. 2 pkt 22 — DEFINICJA "sprzedaży"):
  ODPŁATNA dostawa TOWARÓW + odpłatne ŚWIADCZENIE usług NA
  terytorium KRAJU + EKSPORT towarów + WDT (wewnątrzwspólnotowa
  dostawa TOWARÓW)

⭐⭐⭐ CO NIE WLICZA SIĘ DO LIMITU (art. 113 ust. 2) — CZĘSTY BŁĄD
  praktyczny:
  → IMPORT USŁUG
  → WNT (wewnątrzwspólnotowe NABYCIE towarów)
  → dostawa, DLA KTÓREJ podatnikiem JEST nabywca (odwrotne
    obciążenie)
  → sprzedaż PODLEGAJĄCA opodatkowaniu POZA terytorium POLSKI
  → WSTO (wewnątrzwspólnotowa SPRZEDAŻ towarów NA odległość)
    NIEOPODATKOWANA na terytorium POLSKI

⭐ PROPORCJONALNY LIMIT dla NOWYCH podmiotów (art. 113 ust. 9):
  przedsiębiorca ROZPOCZYNAJĄCY działalność W TRAKCIE roku LICZY
  limit PROPORCJONALNIE do LICZBY dni PROWADZENIA firmy W danym
  roku (NIE pełne 240 000 zł OD razu)

⭐⭐⭐ MOMENT UTRATY ZWOLNIENIA: zwolnienie TRACI MOC POCZĄWSZY OD
  CZYNNOŚCI, KTÓRĄ PRZEKROCZONO limit — ⭐ NIE od POCZĄTKU miesiąca
  ANI od NASTĘPNEGO dnia — DOKŁADNIE OD TEJ konkretnej TRANSAKCJI,
  KTÓRA spowodowała PRZEKROCZENIE — WYMAGA precyzyjnego ŚLEDZENIA
  narastającej sumy SPRZEDAŻY W trakcie roku

⭐⭐⭐ WYŁĄCZENIA — KATALOG PODATNIKÓW BEZ PRAWA do zwolnienia OD
  PIERWSZEJ sprzedaży (art. 113 ust. 13, ⚠️ NIEZALEŻNIE od
  wysokości OBROTU — MUSZĄ być czynnymi PODATNIKAMI VAT od SAMEGO
  początku): ORIENTACYJNIE OBEJMUJE m.in. dostawę WYROBÓW z metali
  SZLACHETNYCH, świadczenie USŁUG prawniczych, doradczych,
  jubilerskich — ⚠️ PEŁNY katalog WYMAGA weryfikacji NA ISAP przy
  KONKRETNEJ branży, TU podane TYLKO PRZYKŁADY

⭐⭐⭐ ⚡ NOWY MECHANIZM — PROCEDURA SME (art. 113b i n., TRANSGRANICZNE
  zwolnienie DLA małych PRZEDSIĘBIORSTW z UE): ⭐ ROZSZERZENIE
  zwolnienia NA podmioty ZAGRANICZNE (Z INNYCH państw UE) — WARUNKI:
  1) POWIADOMIENIE państwa CZŁONKOWSKIEGO, W KTÓRYM podmiot MA
     SIEDZIBĘ, O zamiarze SKORZYSTANIA ze zwolnienia NA terytorium
     Polski
  2) UZYSKANIE W tym PAŃSTWIE indywidualnego NUMERU identyfikacyjnego
     zawierającego KOD "EX" — SPECJALNY numer NA potrzeby
     korzystania ZE zwolnienia TRANSGRANICZNEGO
  → ⭐ TO GENUINE, NOWA instytucja — ROZSZERZAJĄCA logikę zwolnienia
    podmiotowego POZA granice KRAJOWE, ZGODNIE Z unijną dyrektywą O
    procedurze SME (small AND medium enterprises)

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł 2026
(poradnikprzedsiebiorcy.pl [×2, NAJŚWIEŻSZE — jedno sprzed 20 GODZIN,
drugie sprzed DNIA], BEZPOŚREDNIO inforlex.pl [Praktyczny Leksykon
VAT 2026, maj 2026, Z dosłownym cytatem art. 113 ust. 1], fakturownia.pl
[×2], staniekandpartners.pl [maj 2026], symfonia.pl [czerwiec 2026]).
```

### ⭐ PROCEDURA VAT MARŻA (art. 120 ustawy VAT) — dodane 2026-07-19

```
ZAKRES: WYŁĄCZNIE towary UŻYWANE, dzieła sztuki, przedmioty
  kolekcjonerskie, antyki — NABYTE PRZEZ PODATNIKA W CELU ODSPRZEDAŻY
⚠️ NIE MOŻNA stosować VAT marży do towarów NOWYCH — to częsty błąd

WARUNEK KLUCZOWY — OD KOGO NABYTO towar (art. 120 ust. 10):
  □ Od OSOBY FIZYCZNEJ/prawnej/jednostki BEZ osobowości prawnej,
    NIEBĘDĄCEJ podatnikiem VAT (np. sprzedaż od osoby prywatnej —
    STĄD "FB VAT marża": skup towarów używanych od osób sprzedających
    prywatnie np. na Facebook Marketplace, w celu dalszej odsprzedaży
    w ramach działalności — TO KLASYCZNY, podręcznikowy przypadek
    zastosowania procedury VAT marża)
  □ Od podatników, których dostawa BYŁA zwolniona z VAT (art. 43 ust.
    1 pkt 2 — dostawa towarów używanych wykorzystywanych WYŁĄCZNIE na
    cele zwolnione, lub art. 113 — zwolnienie podmiotowe "drobnych"
    przedsiębiorców)
  □ Od podatników, u których dostawa BYŁA JUŻ opodatkowana procedurą
    marży (żeby uniknąć wielokrotnego opodatkowania tego samego towaru)

DEFINICJA "TOWARU UŻYWANEGO" (art. 120 ust. 1 pkt 4): RUCHOME dobro
  materialne, nadające się do DALSZEGO użytku w aktualnym stanie lub po
  naprawie — WYMAGA rzeczywistego wcześniejszego UŻYTKOWANIA (samo
  nabycie/magazynowanie/posiadanie BEZ faktycznego korzystania NIE
  WYSTARCZA, by uznać towar za "używany" w tym rozumieniu) — NIE
  obejmuje nieruchomości

MECHANIZM: podstawą opodatkowania jest MARŻA = różnica między kwotą
  SPRZEDAŻY a kwotą NABYCIA, POMNIEJSZONA o VAT (nie cała wartość
  sprzedaży, jak przy zasadach ogólnych)

FORMALNOŚCI:
  □ FAKTURA oznaczona jako "procedura marży — towary używane" (bez
    wykazanej kwoty VAT — art. 106e ust. 3 ustawy VAT)
  □ EWIDENCJA osobna: cena nabycia + cena sprzedaży dla KAŻDEJ pozycji
    objętej marżą (jeśli podatnik stosuje RÓWNOLEŻNIE zasady ogólne i
    marżę — konieczny PODZIAŁ ewidencji)
  □ Przy BRAKU dowodu nabycia od osoby prywatnej — orzecznictwo/
    interpretacje dopuszczają stosowanie marży MIMO braku dokumentu
    zakupu, PRZY zachowaniu rzetelnej, własnej ewidencji
  □ Przy EKSPORCIE towaru objętego marżą — sama MARŻA (nie cała
    wartość) podlega stawce 0%

⭐ SPRZEDAŻ PRZEZ OSOBĘ PRYWATNĄ (BEZ działalności gospodarczej):
  osoby fizyczne NIEPROWADZĄCE działalności gospodarczej MOGĄ
  sprzedawać używane rzeczy (np. odzież, elektronikę) OKAZJONALNIE, BEZ
  VAT w ogóle — to NIE JEST "procedura VAT marża" (która dotyczy
  PODATNIKA odsprzedającego towar), tylko zwykła sprzedaż PRYWATNA poza
  systemem VAT — rozróżnij te dwie sytuacje: (1) osoba prywatna
  sprzedająca okazjonalnie na FB → brak VAT w ogóle, (2) podatnik
  SKUPUJĄCY takie towary w celu odsprzedaży w ramach działalności → VAT
  marża od jego DALSZEJ sprzedaży

Checklist praktyczny:
□ Czy towar jest UŻYWANY (rzeczywiste wcześniejsze użytkowanie) czy
  NOWY — marża dotyczy TYLKO używanych
□ Czy sprzedawca (podatnik) NABYŁ towar od podmiotu z KRĘGU art. 120
  ust. 10 (osoba prywatna/zwolniony/już opodatkowany marżą)
□ Czy prowadzona jest WYMAGANA odrębna ewidencja cen nabycia/sprzedaży
□ Czy faktura ma PRAWIDŁOWE oznaczenie "procedura marży" i NIE wykazuje
  kwoty VAT osobno
□ Przy sprzedaży MIESZANEJ (marża + zasady ogólne) — czy ewidencja jest
  PODZIELONA
```

### ⭐ EKSPORT TOWARÓW I WDT — ROZBUDOWANE (dodane 2026-07-19)

> Dotychczas tylko jedna linijka ("0%: Eksport towarów, WDT") w sekcji
> stawek — poniżej pełne warunki stosowania stawki 0%.

```
WDT (Wewnątrzwspólnotowa Dostawa Towarów, art. 13 ustawy VAT) — wywóz
  towaru z Polski na terytorium INNEGO kraju UE, na rzecz podatnika
  zidentyfikowanego dla transakcji wewnątrzwspólnotowych w tym kraju

WARUNKI stawki 0% dla WDT (art. 42 ustawy VAT) — WSZYSTKIE łącznie:
  1) Dostawa NA RZECZ nabywcy posiadającego WAŻNY numer VAT-UE (z
     dwuliterowym prefiksem kraju), podany dostawcy
  2) Dostawca PRZED upływem terminu złożenia deklaracji za dany okres
     POSIADA DOWODY, że towar został WYWIEZIONY z Polski i DOSTARCZONY
     do nabywcy w innym kraju UE (dokumenty przewozowe — CMR, list
     przewozowy, specyfikacja ładunku — art. 42 ust. 3 i art. 45a
     Rozporządzenia UE 282/2011)
  3) Dostawca w chwili składania deklaracji jest ZAREJESTROWANY do
     VAT-UE
  4) Dostawca ZŁOŻYŁ w terminie (do 25. dnia miesiąca po miesiącu
     powstania obowiązku) INFORMACJĘ PODSUMOWUJĄCĄ VAT-UE — BRAK tego
     zgłoszenia WYKLUCZA stawkę 0%, nawet gdy pozostałe warunki
     spełnione

⭐ BRAK DOKUMENTACJI W TERMINIE — CO ROBIĆ (art. 42 ust. 12-12a):
  □ Rozliczenie KWARTALNE: jeśli dokumentów brak przed upływem terminu
    złożenia deklaracji za KOLEJNY kwartał — dostawę wykazuje się z
    KRAJOWĄ stawką (zwykle 23%), NIE jako WDT — możliwa KOREKTA po
    późniejszym zebraniu dokumentów
  □ Analogiczny mechanizm przy rozliczeniu MIESIĘCZNYM
  □ NSA (uchwała I FPS 1/10): WYSTARCZY posiadanie TYLKO NIEKTÓRYCH z
    dowodów wymienionych w ustawie — nie wszystkich naraz, jeśli łącznie
    potwierdzają fakt wywozu/dostarczenia

DOMNIEMANIE z art. 45a Rozporządzenia UE 282/2011: w OKREŚLONYCH
  okolicznościach (np. dwa niesprzeczne dowody od niezależnych stron)
  DOMNIEMYWA SIĘ, że towar został wysłany/dostarczony do innego kraju
  UE — ułatwia spełnienie warunku 2) powyżej

WYJĄTEK PODMIOTOWY: podatnik ZWOLNIONY z VAT (korzystający ze
  zwolnienia podmiotowego) sprzedający towary do UE — CO DO ZASADY NIE
  MA obowiązku wykazywania WDT/składania deklaracji w tym zakresie —
  WYJĄTEK: dostawa NOWYCH ŚRODKÓW TRANSPORTU (zawsze WDT, niezależnie
  od statusu stron)

ORZECZNICTWO — ZAKRES ODPOWIEDZIALNOŚCI DOSTAWCY (TSUE, postanowienie
  z 9.01.2023): CO DO ZASADY nie jest rolą podatnika BADANIE, czy
  kontrahenci na WCZEŚNIEJSZYCH etapach łańcucha dostaw przestrzegali
  przepisów — to ORGAN PODATKOWY musi WYKAZAĆ, że podatnik dopuścił się
  oszustwa VAT lub o nim WIEDZIAŁ/mógł wiedzieć — korzystne dla
  uczciwych podatników w łańcuchach dostaw

EKSPORT TOWARÓW (poza UE, odrębnie od WDT) — analogicznie stawka 0%,
  ale WYMAGA innych dowodów (dokument celny SAD/potwierdzenie wywozu
  poza obszar celny UE), NIE dokumentów przewozowych WEWNĄTRZUNIJNYCH

Checklist praktyczny:
□ Czy nabywca ma WAŻNY i AKTYWNY numer VAT-UE — zweryfikuj w systemie
  VIES PRZED transakcją
□ Czy zebrano WYMAGANE dowody wywozu/dostarczenia PRZED terminem
  deklaracji — jeśli NIE, rozważ wykazanie ze stawką krajową z
  możliwością późniejszej korekty
□ Czy złożono INFORMACJĘ PODSUMOWUJĄCĄ VAT-UE w terminie — BRAK tego
  wyklucza 0% nawet przy pozostałych warunkach spełnionych
□ Czy to WDT (do kraju UE) czy EKSPORT (poza UE) — różne wymogi
  dokumentacyjne dla stawki 0% w każdym przypadku
```

---



---

## Połącz z
- DR-06/mod-VAT-podatek-od-towarow-i-uslug (moduł MACIERZYSTY)
- DR-06/mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci
- DR-06/mod-VAT-transakcje-fakturowanie

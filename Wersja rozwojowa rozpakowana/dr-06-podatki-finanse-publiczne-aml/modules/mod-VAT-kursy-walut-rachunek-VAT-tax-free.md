# Moduł — VAT: przeliczanie walut obcych (art. 31a–31b), rachunek VAT i uwolnienie środków (art. 108b), system zwrotu podatku podróżnym TAX FREE (art. 126–130)

> **Akt:** ustawa z 11.03.2004 o podatku od towarów i usług — **t.j. Dz.U. 2025 poz. 775**.
> ⚠️ NOWELIZACJE PO t.j.: Dz.U. 2025 poz. 894, 896, 1203, 1811; Dz.U. 2026 poz. 507, 846.
>
> ⛔ **HARD GATE — `shared/PRAWO-HARDGATE.md`.**
>
> ⚠️ **PRZYPOMNIENIE GLOBALNE RODZINY mod-VAT-*:** termin podstawowy zwrotu
> różnicy podatku wynosi **40 dni** (art. 87 ust. 2 zd. 1), **NIE 60**.
> ⭐ UWAGA TERMINOLOGICZNA: w tym module pojawia się DRUGI termin 60-dniowy —
> na rozpatrzenie wniosku o uwolnienie środków z rachunku VAT (art. 108b
> ust. 3). To ZUPEŁNIE INNA instytucja niż zwrot różnicy podatku. Nie mylić.

**Utworzony 2026-08-12** (audyt pokrycia VAT, iteracja VII).

---

## 13a. ⭐⭐⭐ PRZELICZANIE WALUT OBCYCH (art. 31a) — najczęstszy błąd techniczny

> Dotąd w systemie: **jedna wzmianka**. A jest to operacja wykonywana
> przy każdej transakcji walutowej i systematycznie kwestionowana
> w kontrolach, bo błąd kursu = błędna podstawa opodatkowania.

```
⭐⭐⭐ REGUŁA PODSTAWOWA (art. 31a ust. 1) — faktura PO powstaniu
  obowiązku podatkowego:
  przeliczenie wg **średniego kursu NBP na OSTATNI DZIEŃ ROBOCZY
  POPRZEDZAJĄCY dzień powstania OBOWIĄZKU PODATKOWEGO**.

⭐⭐⭐ REGUŁA ALTERNATYWNA (art. 31a ust. 2) — faktura PRZED powstaniem
  obowiązku podatkowego:
  przeliczenie wg średniego kursu NBP na ostatni dzień roboczy
  POPRZEDZAJĄCY **dzień WYSTAWIENIA FAKTURY**.
  ⭐ Ta sytuacja jest częsta, bo art. 106i ust. 7 pozwala wystawić
  fakturę do **60 DNI PRZED** dostawą/wykonaniem usługi lub
  otrzymaniem zapłaty.

⛔⛔ TEST DECYZYJNY — JEDNO PYTANIE ROZSTRZYGA:
  „Czy faktura została wystawiona PRZED, czy PO powstaniu obowiązku
  podatkowego?" → PRZED = kurs z dnia przed WYSTAWIENIEM (ust. 2);
  PO = kurs z dnia przed OBOWIĄZKIEM PODATKOWYM (ust. 1).
  ⭐ PRZYKŁAD: dostawa 31 stycznia (obowiązek podatkowy), faktura
  10 lutego → faktura PO obowiązku → kurs NBP z **30 stycznia**
  (ostatni dzień roboczy przed 31 stycznia), NIE z 9 lutego.

⭐ OPCJA EBC (art. 31a ust. 1 i 2): zamiast NBP można zastosować
  ostatni kurs wymiany opublikowany przez **Europejski Bank Centralny**
  na ostatni dzień poprzedzający odpowiednio dzień powstania obowiązku
  podatkowego albo dzień wystawienia faktury.
  ⭐ Waluta inna niż euro: przelicza się z zastosowaniem kursu wymiany
  każdej z nich WZGLĘDEM EURO (dwuetapowo: waluta → EUR → PLN).

⭐⭐ OPCJA SPÓJNOŚCI Z PODATKIEM DOCHODOWYM (art. 31a ust. 2a):
  podatnik MOŻE przeliczać podstawę opodatkowania VAT zgodnie
  z zasadami przeliczania przychodu wynikającymi z przepisów
  o podatku dochodowym, obowiązującymi go dla danej transakcji.
  ⭐ KORZYŚĆ: jeden kurs dla PIT/CIT i VAT — mniej pracy, mniej błędów.
  ⛔ WARUNEK ZWIĄZANIA: raz wybrana metoda musi być stosowana przez
  co najmniej **12 KOLEJNYCH MIESIĘCY**, licząc od miesiąca wyboru.
  ⭐ To jest decyzja, nie ustawienie w programie — udokumentuj wybór.
```

### ⭐⭐ FAKTURY KORYGUJĄCE (art. 31b) — stan po SLIM VAT 3

```
⭐ ZASADA (art. 31b ust. 1): przy korekcie stosuje się kurs
  PIERWOTNY — ten, który przyjęto do przeliczenia podstawy
  opodatkowania przed jej zmianą, ODRĘBNIE dla każdej transakcji.

⭐⭐ UPROSZCZENIE DLA KOREKT ZBIORCZYCH (art. 31b ust. 2): przy
  zbiorczej fakturze korygującej z tytułu OPUSTU lub OBNIŻKI CENY
  podatnik może zastosować JEDEN kurs — średni kurs NBP (albo EBC)
  na ostatni dzień roboczy poprzedzający dzień wystawienia FAKTURY
  KORYGUJĄCEJ — do wszystkich korygowanych transakcji.
  ⭐ SENS: bez tego przy zbiorczej korekcie do 100 faktur trzeba by
  odtworzyć 100 różnych kursów pierwotnych.

⭐ ANALOGICZNIE dla korekt zbiorczych otrzymanych od kontrahenta
  zagranicznego przy WNT, imporcie usług i dostawach, dla których
  podatnikiem jest nabywca — możliwość (nie obowiązek) zastosowania
  kursu z dnia poprzedzającego wystawienie zbiorczej korekty.

⛔ WYŁĄCZENIE: art. 31b ust. 1–2 NIE stosuje się do podatników, którzy
  wybrali przeliczanie wg zasad z podatku dochodowego (art. 31a ust. 2a).
  ⭐ Kto wybrał spójność z PIT/CIT — zostaje przy tym reżimie także
  przy korektach.

⛔ Zweryfikuj pełne brzmienie art. 31b w ISAP — przepis jest stosunkowo
  nowy i bywa mylony z art. 31a.
```

---

## 13b. ⭐⭐⭐ RACHUNEK VAT — UWOLNIENIE ŚRODKÓW (art. 108b)

> Uzupełnienie luki w opisie MPP: system opisywał mechanizm
> podzielonej płatności (art. 108a), ale nie ŚCIEŻKĘ WYJŚCIA —
> a to ona jest przedmiotem realnych sporów, bo dotyczy pieniędzy
> zablokowanych na rachunku podatnika.

```
⭐⭐ PUNKT WYJŚCIA: środki na rachunku VAT NALEŻĄ DO PODATNIKA, ale
  dysponowanie nimi jest USTAWOWO OGRANICZONE (katalog dozwolonych
  wypłat — art. 62b Prawa bankowego). Kumulacja środków na rachunku
  VAT to typowy problem firm z przewagą zakupów objętych MPP.

⭐⭐⭐ WNIOSEK (art. 108b ust. 1): na wniosek podatnika naczelnik US
  wydaje **W DRODZE POSTANOWIENIA** zgodę na przekazanie środków
  z rachunku VAT na wskazany rachunek rozliczeniowy (bankowy albo
  w SKOK), dla którego prowadzony jest ten rachunek VAT.
  ⭐ Wniosek nie wymaga szczegółowego uzasadnienia; wskazuje numer
  rachunku VAT i wysokość środków.

⭐⭐ TERMIN: naczelnik US ma **60 DNI** od dnia otrzymania wniosku
  na wydanie postanowienia (art. 108b ust. 3). W postanowieniu określa
  WYSOKOŚĆ środków do przekazania — ⭐ może to być kwota NIŻSZA
  niż wnioskowana.
  ⭐ Po otrzymaniu informacji o postanowieniu bank przekazuje środki —
  w praktyce w ciągu kilku dni roboczych.
  ⭐ Informację o postanowieniu naczelnik przekazuje bankowi/SKOK
  drogą teleinformatyczną.

⛔⛔ ODMOWA — W DRODZE **DECYZJI** (art. 108b ust. 5), m.in. gdy:
  □ podatnik posiada ZALEGŁOŚCI z tytułu podatków i należności,
    o których mowa w art. 62b ust. 2 pkt 2 lit. a Prawa bankowego
    (VAT, CIT, PIT, akcyza, należności celne) — w wysokości
    odpowiadającej zaległości wraz z odsetkami, wg stanu na dzień
    wydania decyzji,
  □ zachodzi UZASADNIONA OBAWA, że zobowiązanie podatkowe nie zostanie
    wykonane (m.in. sytuacje wskazujące na ryzyko niewykonania).
  ⛔ Zweryfikuj pełny katalog ust. 5 w ISAP — był nowelizowany.

⭐⭐ ŚRODKI ZASKARŻENIA — ⚠️ DWA RÓŻNE, ZALEŻNIE OD FORMY:
  □ ZGODA/określenie niższej kwoty = POSTANOWIENIE → **ZAŻALENIE**
  □ ODMOWA = DECYZJA → **ODWOŁANIE**
  ⛔⛔ To jest dokładnie ten typ rozróżnienia, który jest przedmiotem
  bramki `shared/ZAZALENIE-ADRESAT-GATE.md` — przy redagowaniu pisma
  URUCHOM tę bramkę i zweryfikuj adresata oraz termin, zamiast
  przyjmować je z tego modułu.

⭐⭐ RACHUNEK TECHNICZNY (art. 108b ust. 10–15) — sytuacja po zamknięciu
  rachunku rozliczeniowego:
  gdy na dzień rozwiązania umowy rachunku rozliczeniowego podatnik
  ma środki na rachunku VAT i ich nie przeniósł ani nie wystąpił
  o uwolnienie — bank przeksięgowuje je na wyodrębniony **RACHUNEK
  TECHNICZNY** (art. 62e Prawa bankowego).
  □ ust. 10 — podatnik może wystąpić o zgodę na WYPŁATĘ tych środków,
  □ ust. 11 — we wniosku wskazuje numer rachunku VAT, z którego
    nastąpiło przekazanie, i wysokość środków,
  □ ust. 15 — ⭐ analogiczne rozwiązanie dla podmiotów, które NIE SĄ
    JUŻ PODATNIKAMI VAT (np. po likwidacji działalności)
    ⭐⭐ SPRZĘŻENIE LIKWIDACYJNE: to jest krok, o którym przy zamykaniu
    firmy zapomina się najczęściej — środki zostają na rachunku
    technicznym „bezterminowo". DODAJ do checklisty likwidacyjnej
    w `mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja.md`,
    sekcja 6d.
  ⭐ Termin 60 dni i przesłanki odmowy z ust. 5 — stosuje się odpowiednio.

⭐ ⚠️ DO MONITOROWANIA: kwestia przekazania środków z rachunku VAT
  na wniosek SYNDYKA MASY UPADŁOŚCI była przedmiotem postępowania
  przed TSUE. ⛔ SYGNATURA I SENTENCJA NIEUSTALONE W TEJ SESJI —
  przy sprawie upadłościowej zweryfikuj przez `orzeczenia-sadowe-v2`
  przed powołaniem.
```

---

## 13c. ⭐⭐ TAX FREE — SYSTEM ZWROTU PODATKU PODRÓŻNYM (art. 126–130)

```
⭐ ISTOTA: osoby fizyczne NIEMAJĄCE STAŁEGO MIEJSCA ZAMIESZKANIA
  na terytorium UE („podróżni") mają prawo do zwrotu podatku
  zapłaconego przy nabyciu towarów na terytorium Polski, które
  w stanie NIENARUSZONYM wywiozły poza terytorium UE **w bagażu
  osobistym** (art. 126 ust. 1).
  ⛔ Kryterium to MIEJSCE ZAMIESZKANIA, nie obywatelstwo.

⭐⭐ WARUNKI PO STRONIE PODRÓŻNEGO:
  □ zakup u JEDNEGO sprzedawcy na kwotę co najmniej **200 ZŁ**,
    potwierdzoną pojedynczym, odrębnym dokumentem
  □ wywóz towaru w stanie nienaruszonym poza UE
  □ potwierdzenie wywozu przez funkcjonariusza Służby Celno-Skarbowej
    w systemie TAX FREE (weryfikacja tożsamości wg paszportu)
  □ ⭐ gdy podróżny opuszcza UE z terytorium innego państwa
    członkowskiego — przedstawia sprzedawcy POTWIERDZONY WYDRUK
    elektronicznego dokumentu TAX FREE
  ⛔ ZWROT NIE PRZYSŁUGUJE przy nabyciu PALIW SILNIKOWYCH.

⭐⭐⭐ WARUNKI PO STRONIE SPRZEDAWCY — to jest część istotna doradczo:
  □ ⛔ sprzedawcą NIE MOŻE być podatnik korzystający ze ZWOLNIENIA
    PODMIOTOWEGO (art. 113) — ⭐ próg: do 31.12.2025 — 200 000 zł,
    **od 1.01.2026 — 240 000 zł** (zgodne z nowelizacją Dz.U. 2025
    poz. 896; → `mod-VAT-miejsce-swiadczenia-zwolnienia.md`)
  □ obowiązek stosowania **KASY FISKALNEJ ONLINE**
    → `mod-VAT-platnicy-egzekucja-kasy-trojstronne.md`, sekcja 7b
  □ rejestracja na **PUESC** i w systemie TAX FREE — ⭐ od 1.01.2022
    dokumenty TAX FREE wystawia się WYŁĄCZNIE ELEKTRONICZNIE
  □ ewidencja TAX FREE — ⭐ pole w JPK_V7
    → `mod-VAT-ewidencja-deklaracje.md`

⭐⭐ STAWKA 0% U SPRZEDAWCY (art. 129): sprzedawca może zastosować
  stawkę 0% do dostawy, od której dokonano zwrotu podatku podróżnemu,
  pod warunkiem posiadania:
  □ dokumentów potwierdzających WYWÓZ towarów poza UE — przed upływem
    terminu do złożenia JPK_V7 za dany okres,
  □ dokumentów potwierdzających OTRZYMANIE ZWROTU przez podróżnego
    (zwrot gotówkowy — czytelny podpis; bezgotówkowy — potwierdzenie
    określone odrębnymi przepisami).

⭐⭐ TERMIN NAPRAWCZY: otrzymanie dokumentów potwierdzających wywóz
  w terminie PÓŹNIEJSZYM — nie później jednak niż przed upływem
  **10 MIESIĘCY**, licząc od końca miesiąca, w którym dokonano
  dostawy — uprawnia do KOREKTY podatku należnego.
  ⭐ To jest realna ścieżka ratunkowa przy opóźnionych potwierdzeniach.

⭐ PODMIOT ZWRACAJĄCY: sprzedawca albo podmiot, którego działalność
  polega na dokonywaniu takich zwrotów, związany ze sprzedawcą umową
  (art. 127 ust. 5 i n. — ⛔ zweryfikuj warunki, jakie musi spełniać
  taki podmiot). Zwrot w PLN, gotówkowo lub bezgotówkowo; podmiot
  zwracający może pobrać PROWIZJĘ.
⛔ Zweryfikuj w ISAP aktualne brzmienie art. 127 (warunki dla
  sprzedawcy), art. 128 (zasady zwrotu, terminy), art. 130 (delegacje).
```

---

## 14. STRATEGIA / QUALITY GATE

```
□ KURSY: ustalono, czy faktura wystawiona PRZED czy PO powstaniu
  obowiązku podatkowego? (to jedno pytanie rozstrzyga o ust. 1 vs ust. 2)
□ KURSY: sprawdzono, czy klient nie wybrał metody z art. 31a ust. 2a
  (spójność z PIT/CIT) — jeśli tak, czy minęło 12 miesięcy związania?
□ KURSY: przy korekcie — kurs PIERWOTNY (art. 31b ust. 1), chyba że
  zbiorcza korekta opustowa (ust. 2)?
□ RACHUNEK VAT: forma rozstrzygnięcia ustalona (postanowienie vs decyzja)
  i dobrany WŁAŚCIWY środek zaskarżenia? ⛔ URUCHOMIONO
  shared/ZAZALENIE-ADRESAT-GATE.md?
□ RACHUNEK VAT: czy 60-dniowy termin z art. 108b ust. 3 nie został
  pomylony ze zwrotem różnicy podatku (40 dni, art. 87)?
□ RACHUNEK VAT przy likwidacji: sprawdzono rachunek TECHNICZNY
  (art. 108b ust. 10–15)?
□ TAX FREE: sprzedawca NIE korzysta ze zwolnienia z art. 113
  (próg 240 000 zł od 2026) i ma kasę ONLINE?
□ TAX FREE: przy braku potwierdzenia wywozu — czy 10-miesięczne okno
  korekty jeszcze biegnie?
□ Każda kwota/termin zweryfikowane w ISAP na datę czynności?
```

---

## Połącz z
- DR-06/`mod-VAT-podatek-od-towarow-i-uslug` (moduł MACIERZYSTY; MPP —
  art. 108a; zwrot różnicy podatku — art. 87, ⚠️ 40 dni)
- DR-06/`mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci` (art. 19a —
  moment powstania obowiązku podatkowego, wejściowy dla wyboru kursu;
  art. 29a — podstawa opodatkowania; faktury korygujące)
- DR-06/`mod-VAT-transakcje-fakturowanie` (art. 106i ust. 7 — faktura
  na 60 dni przed; art. 106j — korekty)
- DR-06/`mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja` (⭐ dodaj
  rachunek techniczny do checklisty likwidacyjnej)
- DR-06/`mod-VAT-platnicy-egzekucja-kasy-trojstronne` (kasa online jako
  warunek TAX FREE)
- DR-06/`mod-VAT-miejsce-swiadczenia-zwolnienia` (art. 113 — próg 240 000 zł
  od 2026, wyłącza sprzedawcę z TAX FREE)
- DR-06/`mod-VAT-ewidencja-deklaracje` (pole TAX FREE w JPK_V7)
- DR-06/`mod-prawo-bankowe-KNF-BFG` (art. 62b, 62e Prawa bankowego —
  katalog wypłat z rachunku VAT, rachunek techniczny)
- `shared/ZAZALENIE-ADRESAT-GATE.md` (⛔ OBOWIĄZKOWO przy piśmie
  kwestionującym rozstrzygnięcie z art. 108b)
- `orzeczenia-sadowe-v2` (TSUE ws. wniosku syndyka o środki z rachunku VAT)

---

## ŹRÓDŁA WERYFIKACJI (zweryfikowane online 2026-08-12)

```
RZĄD 1 — isap.sejm.gov.pl: t.j. Dz.U. 2025 poz. 775
RZĄD 1/2 — puesc.gov.pl, biznes.gov.pl (TAX FREE: warunki, próg 200 zł,
  próg zwolnienia podmiotowego 240 000 zł od 1.01.2026, kasa online)
RZĄD 2 — brzmienie art. 108b ust. 1: przepisy.gofin.pl
RZĄD 2 — praktyka art. 108b: gofin.pl (03.2026), pit.pl, isp-modzelewski.pl
  (05.2025 — forma odmowy), podatekvat.pl, oneclick-workflow.pl
RZĄD 2 — kursy walut: symfonia.pl (02.2026), poradnikprzedsiebiorcy.pl
  (04.2026), gofin.pl (01.2026), fakturaxl.pl, wzajaczkowski.pl (art. 31b)
RZĄD 2 — TAX FREE: ifirma.pl, infor.pl, poradypodatkowe.pl (2026)
⛔ Sygnatury TSUE (syndyk/rachunek VAT) NIE ustalone w tej sesji —
  wymagają weryfikacji przed powołaniem.
```

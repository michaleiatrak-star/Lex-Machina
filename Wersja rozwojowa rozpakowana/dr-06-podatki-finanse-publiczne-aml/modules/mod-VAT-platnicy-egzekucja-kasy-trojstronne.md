# Moduł — VAT: płatnicy i sprzedaż egzekucyjna (art. 18, 106c), kasy rejestrujące — reżim ustawowy (art. 111–111b), wewnątrzwspólnotowe transakcje trójstronne — procedura uproszczona (art. 135–138)

> **Akt:** ustawa z 11.03.2004 o podatku od towarów i usług — **t.j. Dz.U. 2025 poz. 775**.
> ⚠️ NOWELIZACJE PO t.j.: Dz.U. 2025 poz. 894, 896, 1203, 1811; Dz.U. 2026 poz. 507, 846.
>
> ⛔ **HARD GATE — patrz `shared/PRAWO-HARDGATE.md`.** Kwoty ulg, progów i kar
> zmieniają się nowelizacjami i rozporządzeniami — każda liczba w tym module
> jest PUNKTEM STARTOWYM wymagającym weryfikacji w ISAP na datę czynności.
>
> ⚠️ **PRZYPOMNIENIE GLOBALNE RODZINY mod-VAT-*:** termin podstawowy zwrotu
> różnicy podatku wynosi **40 dni** (art. 87 ust. 2 zd. 1), **NIE 60**.

**Utworzony 2026-08-12** (audyt pokrycia VAT, iteracja VI — domknięcie luk P1:
Dział III art. 18, Dział XI rozdz. 3 w wymiarze ustawowym, Dział XII rozdz. 8).

---

## 7a. ⭐⭐⭐ PŁATNICY VAT — SPRZEDAŻ EGZEKUCYJNA (art. 18 + art. 106c)

> **Dotąd CAŁKOWICIE nieobecne** mimo bardzo dużej częstotliwości praktycznej
> (licytacje komornicze nieruchomości i ruchomości, egzekucja administracyjna).
> Luka była podwójnie dotkliwa, bo temat wchodzi jednocześnie w DR-06 (VAT),
> DR-03 (egzekucja) i DR-02 (cywilne) — i nie był pokryty w żadnym.

```
⭐⭐⭐ ZASADA (art. 18): PŁATNIKAMI podatku od dostawy dokonywanej w TRYBIE
  EGZEKUCJI towarów będących własnością DŁUŻNIKA lub posiadanych przez
  niego z naruszeniem obowiązujących przepisów są:
  1) ORGANY EGZEKUCYJNE określone w ustawie z 17.06.1966 o postępowaniu
     egzekucyjnym w administracji,
  2) KOMORNICY SĄDOWI wykonujący czynności egzekucyjne w rozumieniu KPC.

⭐⭐⭐ KONSTRUKCJA — TO JEST ISTOTA, NIE DETAL:
  □ PODATNIKIEM pozostaje **DŁUŻNIK** (to jego dostawa, jego obowiązek
    podatkowy, jego status decyduje o stawce i zwolnieniu)
  □ PŁATNIKIEM jest komornik/organ egzekucyjny — oblicza, POBIERA
    i WPŁACA podatek (definicja płatnika: **art. 8 Ordynacji podatkowej**)
  □ RATIO LEGIS: skoro wobec dłużnika prowadzona jest egzekucja, istnieje
    uzasadnione przypuszczenie, że sam nie odprowadzi podatku należnego
  ⛔ KONSEKWENCJA TESTOWA: komornik NIE jest stroną transakcji w sensie
    materialnoprawnym. Czynność jest opodatkowana WTEDY I TYLKO WTEDY,
    gdy byłaby opodatkowana u dłużnika. Jeżeli dłużnik nie jest podatnikiem
    VAT albo dostawa korzystałaby u niego ze zwolnienia — podatku nie ma.
```

### ⭐⭐⭐ FAKTURA KOMORNICZA (art. 106c, 106e ust. 1 pkt 20, 106g ust. 2)

```
⭐ art. 106c — faktury dokumentujące dostawę z art. 18, z tytułu której
  na DŁUŻNIKU ciąży obowiązek podatkowy, wystawiają **W IMIENIU I NA RZECZ
  DŁUŻNIKA**:
  pkt 1 — organy egzekucyjne (u.p.e.a.),
  pkt 2 — komornicy sądowi (KPC).

⭐⭐ ELEMENTY SZCZEGÓLNE (art. 106e ust. 1 pkt 20): faktura zawiera
  DODATKOWO nazwę i adres organu egzekucyjnego ALBO imię i nazwisko
  komornika sądowego oraz jego adres, a **w miejscu określonym dla
  podatnika — imię i nazwisko lub nazwę DŁUŻNIKA oraz jego adres**.
  ⛔ TO JEST TEST POPRAWNOŚCI FAKTURY: jeżeli w polu sprzedawcy widnieje
  komornik zamiast dłużnika — faktura jest wadliwa.

⭐ LICZBA EGZEMPLARZY (art. 106g ust. 2): faktura papierowa w **TRZECH
  EGZEMPLARZACH** — jeden nabywcy, drugi w dokumentacji wystawcy,
  trzeci PRZEKAZYWANY DŁUŻNIKOWI.
  ⚠️ W REŻIMIE KSeF odpowiednikiem jest art. 106gc ust. 6 — zweryfikuj
  aktualną numerację i brzmienie w ISAP (przepisy KSeF były wielokrotnie
  nowelizowane; patrz alerty KSeF w
  `mod-VAT-podatek-od-towarow-i-uslug.md`).
  ⭐ KSeF a komornik: sprawdź krąg podmiotów uprawnionych do korzystania
  z KSeF (art. 106nb) — komornik działa w imieniu dłużnika, co rodzi
  odrębne kwestie uprawnień/uwierzytelnienia. ⛔ TEMAT ŚWIEŻY,
  weryfikuj online przy każdej sprawie.
```

### ⭐⭐ PRAWO NABYWCY DO ODLICZENIA Z FAKTURY KOMORNIKA

```
⭐ Faktura wystawiona przez komornika dokumentuje czynność opodatkowaną
  DOKONANĄ PRZEZ DŁUŻNIKA → co do zasady stanowi podstawę odliczenia
  podatku naliczonego przez nabywcę (art. 86 ust. 1), o ile spełnione
  są przesłanki pozytywne i NIE zachodzi żadna z negatywnych z art. 88.
  ⭐ Potwierdzone w praktyce interpretacyjnej KIS — ⛔ przed powołaniem
  konkretnej interpretacji zweryfikuj ją w EUREKA
  (`podatki.gov.pl/narzedzia/eureka/`).

⛔⛔ RYZYKO KLUCZOWE — BRAK INFORMACJI U KOMORNIKA:
  gdy komornik NIE dysponuje informacjami pozwalającymi ustalić prawo
  do zwolnienia (typowo: nieruchomość — pierwsze zasiedlenie, art. 43
  ust. 1 pkt 10/10a), praktyka idzie w kierunku OPODATKOWANIA transakcji.
  ⭐ SKUTEK DLA NABYWCY: ryzyko zakwestionowania odliczenia, jeżeli
  organ następnie ustali, że dostawa BYŁA zwolniona — wtedy wchodzi
  **art. 88 ust. 3a pkt 2** (faktura dokumentująca czynność zwolnioną).
  ⭐ SPRZĘŻENIE: patrz `mod-VAT-obowiazek-podstawa-zwolnienia-
  nieruchomosci.md` (pierwsze zasiedlenie, opcja opodatkowania)
  ORAZ `mod-VAT-sankcje-bony-odliczenia.md` sekcja 4h (katalog negatywny).
  ⭐ DZIAŁANIE OBRONNE NABYWCY PRZED LICYTACJĄ: wystąpić do komornika
  o informację o statusie VAT dłużnika i podstawie opodatkowania/
  zwolnienia; udokumentować należytą staranność.
```

---

## 7b. ⭐⭐⭐ KASY REJESTRUJĄCE — REŻIM USTAWOWY (art. 111–111b)

> **Uzupełnienie asymetrii:** system pokrywał kasy od strony
> ROZPORZĄDZENIA o zwolnieniach (limit 20 000 zł, § 4 katalog bezwzględny
> — patrz `mod-VAT-podatek-od-towarow-i-uslug.md`), ale NIE pokrywał
> USTAWOWEJ warstwy: sankcji, ulgi i jej zwrotu, kar pieniężnych.
> To właśnie ta warstwa decyduje o skutkach finansowych sporu z US.

```
⭐ OBOWIĄZEK (art. 111 ust. 1): podatnicy dokonujący sprzedaży na rzecz
  OSÓB FIZYCZNYCH nieprowadzących działalności gospodarczej oraz
  ROLNIKÓW RYCZAŁTOWYCH prowadzą ewidencję sprzedaży przy zastosowaniu
  kas rejestrujących.
  ⭐ ZWOLNIENIA (podmiotowe 20 000 zł / przedmiotowe / katalog bezwzględny
  § 4): rozporządzenie MF z 17.12.2024, Dz.U. 2024 poz. 1902 — obowiązuje
  co do zasady do 31.12.2027. Pełne omówienie:
  `mod-VAT-podatek-od-towarow-i-uslug.md`, sekcja „KASY FISKALNE".
```

### ⛔⛔ SANKCJA ZA BRAK EWIDENCJONOWANIA (art. 111 ust. 2)

```
⛔ Podatnik, który narusza obowiązek prowadzenia ewidencji przy
  zastosowaniu kasy, traci prawo do obniżenia podatku należnego
  o kwotę odpowiadającą **30%** podatku naliczonego przy nabyciu
  towarów i usług — do czasu rozpoczęcia prowadzenia ewidencji.
  ⭐ TO NIE JEST „kara 30%" — to UTRATA CZĘŚCI PRAWA DO ODLICZENIA.
  ⛔ Zweryfikuj AKTUALNE brzmienie ust. 2 w ISAP — w szczególności
  wyłączenie stosowania wobec osób fizycznych ponoszących
  odpowiedzialność za wykroczenie/przestępstwo skarbowe (zakaz
  podwójnego karania) — art. 111 ust. 2 zd. 2.
  ⭐ ZBIEG Z KKS: brak ewidencjonowania / niewydanie paragonu to
  odrębna odpowiedzialność karnoskarbowa → `mod-OP-ordynacja-podatkowa`
  (czynny żal) i DR-03.
```

### ⭐⭐⭐ ULGA NA ZAKUP KASY (art. 111 ust. 4–5) — ⛔ KOREKTA BŁĘDNEJ KWOTY

```
⛔⛔ SPROSTOWANIE (2026-08-12): we WCZEŚNIEJSZEJ analizie pokrycia
  ulga została opisana jako „300 zł". TO BYŁO BŁĘDNE — 300 zł to
  KARA PIENIĘŻNA za brak przeglądu technicznego, a NIE wysokość ulgi.
  Błąd wychwycony przez weryfikację online przed napisaniem modułu.

⭐⭐ WYSOKOŚĆ ULGI (art. 111 ust. 4): **90% ceny zakupu kasy (bez podatku),
  nie więcej niż 700 ZŁ** na każdą kasę.
  ⭐ Dotyczy kas ONLINE; przysługuje podatnikom rozpoczynającym
  prowadzenie ewidencji w OBOWIĄZUJĄCYCH TERMINACH oraz podmiotom
  objętym obowiązkową wymianą kas.

⭐ WARUNKI (rozporządzenie MF w sprawie odliczania lub zwrotu kwot
  wydanych na zakup kas rejestrujących — Dz.U. 2019 poz. 820, § 2 i 3):
  □ rozpoczęcie ewidencjonowania w obowiązujących terminach
  □ posiadanie DOWODU ZAPŁATY całej należności za kasę
  □ zakup kasy nie później niż w ciągu **6 MIESIĘCY** od dnia rozpoczęcia
    prowadzenia ewidencji
  ⛔ Zweryfikuj aktualny tekst rozporządzenia i ewentualne zmiany.

⭐ MECHANIZM ROZLICZENIA (§ 3 ust. 2 rozporządzenia): przy podatku
  należnym wyższym od naliczonego odliczenie do wysokości RÓŻNICY;
  nadwyżka ulgi PRZECHODZI na następne okresy rozliczeniowe.
  ⭐ art. 111 ust. 5 — podatnicy ZWOLNIENI z VAT: tryb ZWROTU na rachunek
  bankowy (odrębny reżim i odrębne terminy).
```

### ⛔⛔ ZWROT ULGI (art. 111 ust. 6) — PUŁAPKA PRZY LIKWIDACJI

```
⛔ Obowiązek ZWROTU odliczonej/zwróconej kwoty, gdy w okresie
  **3 LAT od dnia rozpoczęcia prowadzenia ewidencji** podatnik:
  □ ZAKOŃCZY DZIAŁALNOŚĆ GOSPODARCZĄ
    ⭐⭐ SPRZĘŻENIE KRYTYCZNE: to jest ukryty koszt likwidacji firmy —
    sprawdzaj ZAWSZE razem z remanentem z art. 14
    (`mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja.md`, sekcja 6d)
  □ NIE PODDA kas obowiązkowemu PRZEGLĄDOWI TECHNICZNEMU w terminie
  □ NARUSZY obowiązki z art. 111 ust. 3a pkt 12 lub ust. 3ab
    (m.in. brak zapewnienia POŁĄCZENIA kasy online z **CRK** —
    Centralnym Repozytorium Kas; czasowy lub trwały)
  ⛔ Zweryfikuj pełny katalog ust. 6 i § 5 ust. 1 rozporządzenia
  Dz.U. 2019 poz. 820.

⭐ TERMINY ZWROTU:
  □ czynni podatnicy VAT — do **25. dnia miesiąca następującego**
    po okresie rozliczeniowym, w którym powstały okoliczności
  □ podatnicy zwolnieni (art. 111 ust. 5) — do KOŃCA MIESIĄCA
    następującego po miesiącu, w którym powstały okoliczności

⚠️ ZAWIESZENIE DZIAŁALNOŚCI: przepisy nie rozstrzygają jednoznacznie,
  czy zawieszenie rodzi obowiązek zwrotu. Praktyka interpretacyjna
  (KIS) idzie w kierunku SUMOWANIA okresów faktycznego używania kasy —
  jeżeli suma okresów używania przekracza 3 lata, obowiązek zwrotu
  przy późniejszej likwidacji nie powstaje. ⛔ TO JEST OBSZAR SPORNY —
  przy konkretnej sprawie WYSTĄP O INTERPRETACJĘ INDYWIDUALNĄ zamiast
  opierać się na analogii.
```

### ⭐ KARA ZA BRAK PRZEGLĄDU TECHNICZNEGO (art. 111 ust. 6ka)

```
⭐ Gdy podatnik nie podda kasy obowiązkowemu przeglądowi technicznemu
  w terminie (przez właściwy podmiot prowadzący serwis) — naczelnik US
  nakłada **W DRODZE DECYZJI** karę pieniężną **300 ZŁ**.
  ⭐ Przegląd techniczny: co do zasady nie rzadziej niż co **2 LATA**;
  termin pierwszego liczony od FISKALIZACJI kasy.
  ⭐ Kara 300 zł jest ODRĘBNA od obowiązku ZWROTU ULGI — te same
  zaniedbanie może uruchomić OBA skutki jednocześnie.
  ⭐ Skoro kara jest nakładana DECYZJĄ → przysługuje odwołanie
  w trybie Ordynacji podatkowej (14 dni) → `mod-OP-ordynacja-podatkowa`.

⭐ art. 111 ust. 3a — pozostałe obowiązki (m.in. wydawanie paragonu
  nabywcy, zapewnienie połączenia z CRK, zapoznanie osób obsługujących
  kasę z zasadami — pod rygorem odpowiedzialności).
⭐ art. 111b — kasy w postaci OPROGRAMOWANIA (kasy wirtualne) —
  odrębny reżim, weryfikuj rozporządzenia wykonawcze.
⭐ POWIĄZANIE: faktura do paragonu — art. 106b ust. 5 (wymóg NIP
  na paragonie) → `mod-VAT-transakcje-fakturowanie.md`.
```

---

## 7c. ⭐⭐⭐ WEWNĄTRZWSPÓLNOTOWA TRANSAKCJA TRÓJSTRONNA — PROCEDURA UPROSZCZONA (art. 135–138)

> **Luka funkcjonalna, nie tylko formalna:** system opisywał TRANSAKCJE
> ŁAŃCUCHOWE (art. 22 ust. 2–2d, `mod-VAT-transakcje-fakturowanie.md`),
> ale nie zawierał UPROSZCZENIA, które jest najczęstszym praktycznym
> rozwiązaniem łańcucha trójpodmiotowego w UE. Analiza łańcucha bez
> sprawdzenia procedury uproszczonej prowadziła do wniosku o obowiązku
> rejestracji pośrednika za granicą — często niepotrzebnie.

```
⭐⭐⭐ WARUNKI TRANSAKCJI TRÓJSTRONNEJ (art. 135 ust. 1 pkt 2) — ŁĄCZNIE:
  □ TRZECH podatników (⛔ dokładnie trzech w ramach danej transakcji)
  □ każdy zarejestrowany na potrzeby transakcji wewnątrzwspólnotowych
    w INNYM państwie członkowskim
  □ dostawa formalnie: pierwszy → drugi ORAZ drugi → ostatni
  □ towar FIZYCZNIE wydawany przez PIERWSZEGO bezpośrednio OSTATNIEMU
  □ transport z terytorium jednego państwa członkowskiego na terytorium
    innego państwa członkowskiego
  □ ORGANIZATOREM TRANSPORTU jest PIERWSZY albo DRUGI podmiot
    ⛔ jeżeli transport organizuje OSTATNI — procedura uproszczona
    NIE MA ZASTOSOWANIA (to jest najczęstszy punkt dyskwalifikacji)

⭐⭐⭐ SKUTEK PROCEDURY (art. 135 ust. 1 pkt 4, art. 136 ust. 1): uznaje się,
  że WNT zostało opodatkowane u DRUGIEGO w kolejności podatnika —
  mimo że faktycznie nie rozlicza on WNT. Podatek rozlicza OSTATNI
  w kolejności podatnik w państwie zakończenia transportu.
  ⭐ EFEKT PRAKTYCZNY: pośrednik NIE MUSI rejestrować się dla celów VAT
  w państwie zakończenia transportu. To jest cała wartość uproszczenia.
```

### ⛔⛔ WARUNEK FAKTUROWY — TU PROCEDURA NAJCZĘŚCIEJ UPADA

```
⭐⭐⭐ art. 136 ust. 1 (w zw. z art. 106e ust. 1 pkt 23): faktura
  wystawiona przez DRUGIEGO w kolejności podatnika ostatniemu
  w kolejności MUSI zawierać — oprócz danych z art. 106e:
  □ ADNOTACJĘ: „VAT: Faktura WE uproszczona na mocy art. 135-138
    ustawy o ptu" LUB „VAT: Faktura WE uproszczona na mocy artykułu 141
    dyrektywy 2006/112/WE"
  □ STWIERDZENIE, że podatek z tytułu dokonanej dostawy zostanie
    rozliczony przez OSTATNIEGO w kolejności podatnika podatku
    od wartości dodanej
  □ NUMER, o którym mowa w **art. 97 ust. 10** (numer VAT UE drugiego
    podatnika), stosowany przez niego wobec PIERWSZEGO i OSTATNIEGO
  □ NUMER identyfikacyjny VAT OSTATNIEGO w kolejności podatnika
  ⛔ BRAK PEŁNEJ ADNOTACJI = BRAK PRAWA DO PROCEDURY UPROSZCZONEJ.
  Sądy traktują ten wymóg RESTRYKCYJNIE (m.in. linia TSUE dot.
  wymogów formalnych procedury uproszczonej — ⛔ zweryfikuj aktualne
  orzecznictwo TSUE i NSA przez `orzeczenia-sadowe-v2` PRZED powołaniem
  konkretnego wyroku; nie cytuj sygnatur z pamięci).
  ⭐ Na fakturze uproszczonej NIE podaje się stawki VAT.
```

### ⭐⭐ OBOWIĄZKI SPRAWOZDAWCZE — PER ROLA W ŁAŃCUCHU

```
⭐ JAKO PIERWSZY podmiot: rozpoznajesz KLASYCZNE WDT na rzecz drugiego —
  JPK_V7 + informacja podsumowująca VAT-UE, BEZ dodatkowych oznaczeń.
⭐ JAKO DRUGI (pośrednik): informacja podsumowująca VAT-UE
  z ZAZNACZENIEM pola „transakcje trójstronne" (kolumna d).
  ⛔ To oznaczenie jest warunkiem spójności danych w VIES —
  jego brak generuje typowe wezwanie z US.
⭐ JAKO OSTATNI podmiot: rozpoznajesz WNT i ROZLICZASZ VAT.
⭐ art. 138 — obowiązki ewidencyjne przy procedurze uproszczonej —
  zweryfikuj zakres w ISAP.

⛔ MODELE WIELOPODMIOTOWE (4+ uczestników): praktyka interpretacyjna
  dopuszcza stosowanie procedury do TRÓJKI podmiotów WYODRĘBNIONEJ
  w dłuższym łańcuchu, przy spełnieniu wszystkich warunków — ⭐ ale to
  jest obszar rozbieżności. ⛔ NIE zakładaj tego automatycznie;
  wystąp o interpretację indywidualną i zweryfikuj aktualną linię
  w EUREKA.
```

---

## 8. STRATEGIA / QUALITY GATE

```
□ Każdy przepis zweryfikowany w ISAP NA DATĘ CZYNNOŚCI?
□ EGZEKUCJA: ustalono STATUS VAT DŁUŻNIKA (nie komornika) przed oceną
  opodatkowania? Sprawdzono, czy dostawa nie byłaby ZWOLNIONA u dłużnika?
□ EGZEKUCJA: faktura ma w polu podatnika DŁUŻNIKA, a dane komornika
  jako element dodatkowy (art. 106e ust. 1 pkt 20)?
□ EGZEKUCJA: przy nieruchomości sprawdzono pierwsze zasiedlenie
  (art. 43 ust. 1 pkt 10/10a) PRZED przyjęciem opodatkowania?
□ KASY: nie pomylono ULGI (90%, max 700 zł) z KARĄ za brak przeglądu
  (300 zł)? — ⛔ to był realny błąd wychwycony w audycie
□ KASY: przy likwidacji sprawdzono 3-letni okres zwrotu ulgi?
□ KASY: sankcja z art. 111 ust. 2 to utrata 30% odliczenia, nie grzywna?
□ TRÓJSTRONNE: sprawdzono, KTO organizuje transport (pierwszy/drugi,
  nie ostatni)?
□ TRÓJSTRONNE: faktura zawiera WSZYSTKIE CZTERY elementy z art. 136 ust. 1?
□ TRÓJSTRONNE: zaznaczono pole „transakcje trójstronne" w VAT-UE?
□ Czy sprawdzono, czy sprawa nie wymaga zamiast tego zwykłej analizy
  łańcucha z art. 22 ust. 2-2d?
```

---

## Połącz z
- DR-06/`mod-VAT-podatek-od-towarow-i-uslug` (moduł MACIERZYSTY; kasy —
  warstwa rozporządzeniowa; alerty KSeF)
- DR-06/`mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja` (moduł
  SIOSTRZANY; art. 97 ust. 10 numer VAT-UE; likwidacja a zwrot ulgi na kasę)
- DR-06/`mod-VAT-transakcje-fakturowanie` (art. 22 ust. 2–2d transakcje
  łańcuchowe — ⭐ ZAWSZE sprawdzaj RAZEM z art. 135–138; art. 106e elementy
  faktury; art. 106b ust. 5 faktura do paragonu)
- DR-06/`mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci` (art. 43
  ust. 1 pkt 10/10a — kluczowe przy licytacji nieruchomości)
- DR-06/`mod-VAT-sankcje-bony-odliczenia` (art. 88 ust. 3a pkt 2 — ryzyko
  nabywcy z faktury komorniczej)
- DR-06/`mod-VAT-miejsce-swiadczenia-zwolnienia` (WDT/WNT — role w łańcuchu)
- DR-06/`mod-OP-ordynacja-podatkowa` (art. 8 OP definicja płatnika;
  odwołanie od decyzji o karze 300 zł)
- DR-03 (egzekucja sądowa i administracyjna — status prawny czynności
  komornika)
- `orzeczenia-sadowe-v2` (TSUE/NSA: wymogi formalne procedury uproszczonej,
  odpowiedzialność w łańcuchu dostaw)

---

## ŹRÓDŁA WERYFIKACJI (zweryfikowane online 2026-08-12)

```
RZĄD 1 — isap.sejm.gov.pl: t.j. Dz.U. 2025 poz. 775
RZĄD 2 — struktura i brzmienie: lexlege.pl / arslege.pl (stan 12.08.2026)
RZĄD 2 — praktyka art. 18/106c: prawo.pl (01.2026), poradnikprzedsiebiorcy.pl
  (04.2026 i 03.2026 — wątek KSeF a komornik), porozmawiajmyopodatkach.pl,
  interpretacje KIS (m.in. 0114-KDIP1-3.4012.200.2019.2.JF — ⛔⛔ SPRAWDZONE
  2026-08-19 (F-19), NIE POTWIERDZONE: wielokrotne zapytania (dokładna
  sygnatura, warianty numeru) NIE zwróciły tej pozycji w żadnym z
  sip.lex.pl/OpenLEX, interpretacje.gofin.pl, inforlex.pl — zwracane były
  WYŁĄCZNIE sąsiednie numery z tej samej serii 2019 r. (170, 233, 315,
  394...). WYSOKIE ryzyko, że sygnatura jest BŁĘDNA lub nieistniejąca.
  ⛔ USUNIĘTE Z UŻYCIA — NIE POWOŁYWAĆ w żadnym piśmie. Jeśli teza jest
  potrzebna merytorycznie, znaleźć odpowiednik od nowa przez EUREKA)
RZĄD 2 — kasy: prawo.pl (10.2025), gofin.pl (obowiązek zwrotu ulgi),
  ifirma.pl (art. 111 ust. 6ka), infor.pl; rozporządzenie Dz.U. 2019 poz. 820
RZĄD 2 — trójstronne: interpretacja KIS 0114-KDIP1-2.4012.141.2025.1.RM
  ✅ POTWIERDZONA 2026-08-19 (F-19) — inforlex.pl, interpretacja z
  14.04.2025, dot. wewnątrzwspólnotowej transakcji trójstronnej, model
  czteropodmiotowy — TREŚĆ ZGODNA z opisem w module. BEZPIECZNA do
  powołania.
  ✅ F-19 ZAMKNIĘTA W CAŁOŚCI 2026-08-20 — pozostałe 3 punkty (c) TSUE
  art. 52 ust. 1 → `mod-VAT-import-towarow-i-zwolnienia-importowe.md`
  (sygn. C-405/24 + NSA I FSK 110/21, POTWIERDZONE); (d) TSUE syndyk/
  rachunek VAT → `mod-VAT-kursy-walut-rachunek-VAT-tax-free.md` (sygn.
  C-709/22, POTWIERDZONE); (f) WSA Łódź wykreślenie z rejestru →
  `mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja.md` (I SA/Łd
  190/20 i 417/20 POTWIERDZONE, wzmocnione uchwałą 7 sędziów NSA
  I FPS 3/23). Punkt (e) — sankcja 36-miesięczna art. 33a — mechanizm
  ustawowy potwierdzony, ALE konkretna sygnatura NSA "linii orzeczniczej"
  NIE znaleziona — pozostaje jako uwaga w module import towarów, NIE
  jako osobna flaga (element bez samodzielnej wagi blokującej).
  (model czteropodmiotowy), zrozumvat.pl (04.2025),
  poradnikprzedsiebiorcy.pl (04.2026), isp-modzelewski.pl
⛔ ŻADNA sygnatura ani interpretacja z tego modułu NIE MOŻE trafić do pisma
  procesowego bez uprzedniej weryfikacji przez `orzeczenia-sadowe-v2` /
  EUREKA — zgodnie z shared/PRAWO-HARDGATE.md.
```

# ORKA-BAS — część 7: priorytety P2 + brakujące z oryginału BAS v1.8

> Część leksykonu `shared/ORKA-BAS-LEKSYKON.md` (podział 2026-08-20,
> naprawa F-78 — plik źródłowy przekroczył 1900 linii). Metareguły
> wykładni i Quality Gate — zobacz plik nadrzędny (indeks). Ten plik
> ładowany WYŁĄCZNIE na żądanie konkretnej definicji przez indeks
> nadrzędny.

---

## CZĘŚĆ XX — PRIORYTETY P2 (z audytu archiwum v1.8)

### BAS-006 — Świadczenie towarzyszące (DR-10)
```
Weryfikacja: ustawa o działalności leczniczej art. 5 pkt 40
  (Dz.U. 2024 poz. 799 t.j. — weryfikuj isap.sejm.gov.pl)
→ Patrz BAS-005 powyżej (zintegrowano w jednym rekordzie)
```

### BAS-070 — Jednostka budżetowa i IGB (DR-06)
```
Weryfikacja: UFP art. 11–15 (Dz.U. 2024 poz. 1530 t.j. — weryfikuj)

JEDNOSTKA BUDŻETOWA (art. 11 UFP):
  Jednostka SFP pokrywająca wydatki bezpośrednio z budżetu i odprowadzająca
  dochody do budżetu (bez zdolności do samofinansowania).
  Przykłady: ministerstwa, urzędy centralne, sądy, szkoły publiczne, szpitale
  publiczne (sp zoz) — NIE; ZUS — NIE (fundusz celowy)

INSTYTUCJA GOSPODARKI BUDŻETOWEJ (art. 23 UFP):
  Jednostka SFP prowadząca odpłatną działalność i pokrywająca koszty z
  uzyskiwanych przychodów. Zysk = przychód budżetu.
  Przykłady: KPRM, drukarnia skarbowa, niektóre jednostki MON

REGUŁA: Każda jednostka budżetowa i IGB podlega rozliczeniu z budżetem;
  nie mają zdolności upadłościowej. Zobowiązania płacone przez SP.
```

### BAS-106 — Status gołębi: drób vs zwierzęta gospodarskie
```
Weryfikacja: MRiRW interp. nr 31430 (ORKA-REG-07)
  Definicja sektorowa; stabilna — bez zmian
Źródło: odpowiedź MRiRW na interpelację nr 31430 (orka2.sejm.gov.pl)
Reguła: ORKA-REG-07 (tożsamość biologiczna ≠ tożsamość prawna)

GOŁĄB jako drób:
  → Ustawa o ochronie zdrowia zwierząt i zwalczaniu chorób zakaźnych: TAK
  → Rozporządzenie o identyfikacji i rejestracji drobiu: TAK
  
GOŁĄB jako zwierzę gospodarskie NIE będące drobiem:
  → Ustawa o identyfikacji i rejestracji zwierząt: NIE = odrębna kategoria
  → Ustawa łowiecka: NIE jest zwierzyną

Praktyczne znaczenie: przy hodowli gołębi wyścigowych/ozdobnych różne
przepisy weterynaryjne, różne obowiązki rejestracyjne.
Reguła: zawsze wskazuj którą ustawę stosujemy i jaką definicję przyjmuje.
```

### BAS-122 — Żołnierz (DR-13)
```
Weryfikacja: ustawa o obronie Ojczyzny art. 4 pkt 1 (Dz.U. 2024 poz. 655 t.j. — weryfikuj)

DEFINICJA USTAWOWA:
  Żołnierzem jest osoba wchodząca w skład Sił Zbrojnych RP:
  → żołnierz zawodowy
  → żołnierz pełniący czynną służbę wojskową (każda inna forma)
  → żołnierz WOT (Wojsk Obrony Terytorialnej)

KATEGORIE:
  Żołnierz zawodowy: stała forma służby; umowa z MON; pełne prawa+obowiązki
  Żołnierz rezerwy: stosunek bojowy ustał, pozostaje w ewidencji
  Żołnierz pełniący czynną służbę: ćwiczenia, szkolenia, powołanie

PRAWA PROCESOWE:
  → KPK art. 638: sprawy wojskowych = właściwe sądy wojskowe (WOs)
  → Prawa pracownicze: ustawa pragmatyczna MON (nie KP co do zasady)
  → Zakaz rozwiązania stosunku służbowego w czasie służby bez zgody przełożonego

WERYFIKUJ: isap.sejm.gov.pl → ustawa o obronie Ojczyzny — wielokrotnie nowelizowana
  web_search: "żołnierz definicja ustawa obrona ojczyzny 2025 2026 aktualny"
```

---


---

## CZĘŚĆ XVII — BRAKUJĄCE Z ORYGINAŁU BAS v1.8 — UZUPEŁNIENIE

### BAS-022 — Budżet JST
```
Weryfikacja: ustawa o finansach publicznych art. 211 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Roczny plan dochodów i wydatków jednostki samorządu terytorialnego,
  uchwalany przez organ stanowiący JST (radę gminy/powiatu/sejmik województwa).
Podstawa: art. 211 ustawy o finansach publicznych (Dz.U. 2024 poz. 1530 t.j.)
Reguła: Budżet JST jest częścią Wieloletniej Prognozy Finansowej (WPF) —
  wydatki majątkowe wymagają pokrycia w WPF co najmniej przez okres realizacji.
```

### BAS-023 / BAS-096 — Dług Skarbu Państwa
```
Weryfikacja: ustawa o finansach publicznych art. 72 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Zobowiązania finansowe zaciągnięte bezpośrednio przez Skarb Państwa
  (nie tożsamy z Państwowym Długiem Publicznym — PDP obejmuje cały sektor finansów publ.)
Podstawa: art. 72 ustawy o finansach publicznych
Reguła: Dług SP < PDP (różnica: zobowiązania innych jednostek SFP niekonsolidowane ze SP)
```

### BAS-045 / BAS-055 — Państwowy fundusz celowy
```
Weryfikacja: ustawa o finansach publicznych art. 29 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Fundusz ustawowo wyodrębniony z budżetu państwa, posiadający plan finansowy
  i przeznaczony na realizację określonego zadania publicznego.
Podstawa: art. 29 ust. 1 ustawy o finansach publicznych
Przykłady: Fundusz Ubezpieczeń Społecznych (FUS), Fundusz Pracy, PFRON
Reguła: Fundusz celowy ≠ fundusz rezerwowy; ma własny plan finansowy zatwierdzany
  przez ministra finansów; nie ma osobowości prawnej (z wyjątkami ustawowymi)
```

### BAS-050 — Wieloletnia prognoza finansowa (WPF)
```
Weryfikacja: ustawa o finansach publicznych art. 226–232 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Instrument wieloletniego planowania finansowego JST,
  uchwalany na co najmniej 4 lata, obejmujący dochody, wydatki i zadania inwestycyjne.
Podstawa: art. 226–232 ustawy o finansach publicznych
Reguła: WPF jest wiążąca dla budżetu JST w zakresie wydatków majątkowych —
  projekt budżetu musi być spójny z WPF. Zmiany w WPF są uchwalane przez organ stanowiący.
```

### BAS-053 — Funkcja państwa (budżet zadaniowy)
```
Weryfikacja: rozp. MF ws. budżetu zadaniowego + UFP art. 174–175
  (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Najwyższy poziom w klasyfikacji zadaniowej budżetu — grupuje zadania
  według dziedzin aktywności państwa (np. "Bezpieczeństwo wewnętrzne i porządek publiczny").
Podstawa: rozporządzenie MF ws. szczegółowego sposobu, trybu i terminów
  opracowania materiałów do projektu ustawy budżetowej
Reguła: 22 funkcje państwa w budżecie zadaniowym → zadania → podzadania → działania.
```

### BAS-054 — Miernik realizacji zadania / działania
```
Weryfikacja: rozp. MF ws. szczegółowego sposobu budżetu zadaniowego
  (Dz.U. 2024 poz. 1530 t.j. art. 174)
Definicja: Wskaźnik liczbowy służący do oceny stopnia realizacji celu określonego
  w budżecie zadaniowym (output, outcome lub result indicator).
Podstawa: rozporządzenie MF ws. budżetu zadaniowego
Reguła: Mierniki mają wartość bazową i docelową; są podstawą ewaluacji polityk
  publicznych; sądy administracyjne nie kontrolują ich "trafności" merytorycznej.
```

### BAS-059 — Klasyfikacja budżetowa
```
Weryfikacja: rozp. MF ws. szczegółowej klasyfikacji dochodów, wydatków
  web_search: "klasyfikacja budżetowa rozporządzenie MF 2025 aktualne"
Definicja: System systematyzowania dochodów i wydatków budżetowych według działów,
  rozdziałów i paragrafów, określony rozporządzeniem ministra finansów.
Podstawa: rozporządzenie MF ws. szczegółowej klasyfikacji dochodów, wydatków,
  przychodów i rozchodów oraz środków pochodzących ze źródeł zagranicznych
Reguła: Klasyfikacja budżetowa jest wiążąca — przeniesienie wydatków między
  paragrafami wymaga decyzji dysponenta lub uchwały organu stanowiącego JST.
```

### BAS-061 — Procedura nadmiernego deficytu (EDP)
```
Weryfikacja: TFUE art. 126 + rozp. 1467/97 (Pakt Stabilności i Wzrostu)
  web_search: "Polska procedura nadmiernego deficytu EDP 2025 2026 status"
Definicja: Procedura UE wobec państwa członkowskiego, które naruszyło kryteria
  fiskalne traktatu (deficyt > 3% PKB lub dług > 60% PKB).
Podstawa: art. 126 TFUE + rozporządzenie 1467/97 (Pakt Stabilności i Wzrostu)
Reguła: EDP → Komisja Europejska wszczyna → Rada ECOFIN wydaje zalecenia →
  sankcje finansowe możliwe przy niewykonaniu. Polska była objęta EDP 2009–2015.
  ⚠️ Weryfikuj aktualny status: web_search "Polska procedura nadmiernego deficytu 2025 2026 EDP"
```

### BAS-071 — Instytucja gospodarki budżetowej (IGB)
```
Weryfikacja: ustawa o finansach publicznych art. 23–28 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Jednostka sektora finansów publicznych tworzona przez ministra lub organ
  kierujący jednostką nadrzędną, prowadząca odpłatną działalność i pokrywająca
  koszty z uzyskiwanych przychodów (może być dofinansowana z budżetu).
Podstawa: art. 23–28 ustawy o finansach publicznych
Reguła: IGB ≠ agencja wykonawcza (agencja ma własną ustawę; IGB — zarządzenie ministra).
  IGB może udzielać zamówień publicznych i zawierać umowy cywilnoprawne.
```

### BAS-073 — Państwowa osoba prawna
```
Weryfikacja: ustawa o finansach publicznych art. 9 pkt 14 (Dz.U. 2024 poz. 1530 t.j.)
Definicja: Podmiot z osobowością prawną, niebędący Skarbem Państwa,
  nieposiadający statusu spółki handlowej, który wykonuje zadania publiczne
  i w całości lub dominującej części jest finansowany ze środków publicznych.
Podstawa: art. 9 pkt 14 ustawy o finansach publicznych
Przykłady: Polska Agencja Rozwoju Przedsiębiorczości, Agencja Restrukturyzacji
  i Modernizacji Rolnictwa, NFOŚiGW (weryfikuj aktualną listę w art. 9 UFP)
```

### BAS-076 / BAS-040 — Subwencja ogólna JST
```
Weryfikacja: ustawa o dochodach JST (Dz.U. 2022 poz. 2267 t.j.)
  web_search: "ustawa o dochodach jednostek samorządu terytorialnego 2025 t.j."
Definicja: Świadczenie publicznoprawne z budżetu państwa przekazywane JST
  bez obowiązku rozliczania konkretnego celu — JST swobodnie decyduje o przeznaczeniu.
Podstawa: ustawa o dochodach JST (Dz.U. 2022 poz. 2267 t.j.)
Składowe: część oświatowa (BAS-077), część wyrównawcza (BAS-078),
  część równoważąca/regionalna (BAS-079/080)
Reguła: Subwencja ogólna ≠ dotacja celowa (ta wymaga rozliczenia konkretnego celu
  i podlega zwrotowi przy niewykonaniu). Subwencja raz wypłacona — bez zwrotu.
```

### BAS-081–BAS-084 — Dochody własne JST (gmina/powiat/województwo)
```
Weryfikacja: ustawa o dochodach JST art. 4–10 (Dz.U. 2022 poz. 2267 t.j.)
  web_search: "ustawa o dochodach JST 2025 aktualny tekst jednolity"
Definicja: Dochody należne JST na podstawie ustaw, pozostające w ich dyspozycji.
Podstawa: ustawa o dochodach JST art. 4–10
KATALOG (gmina): udziały w PIT/CIT, podatek od nieruchomości, podatek rolny,
  leśny, transportowy, karta podatkowa, opłaty lokalne, dochody z majątku
Reguła: Dochody własne + subwencja + dotacje celowe = trzy filary finansowania JST.
  Im wyższy udział dochodów własnych, tym większa samodzielność finansowa JST.
  NSA: gmina nie może zrzec się dochodów własnych wynikających z ustaw.
```

### BAS-086 / BAS-087 — Dochody bieżące i majątkowe JST
```
Weryfikacja: ustawa o finansach publicznych art. 235–236 (Dz.U. 2024 poz. 1530 t.j.)
DOCHODY BIEŻĄCE: wpływy przeznaczane na finansowanie wydatków bieżących
  (wynagrodzenia, zakup usług, dotacje bieżące); muszą w pełni finansować
  wydatki bieżące → złota reguła budżetowa.
DOCHODY MAJĄTKOWE: ze sprzedaży majątku, przekształcenia prawa użytkowania
  wieczystego, dotacje na inwestycje; przeznaczane na wydatki majątkowe.
Reguła: Budżet JST nie może mieć deficytu bieżącego — zakaz art. 242 UFP.
```

### BAS-090 — System dochodów JST
```
Weryfikacja: ustawa o dochodach JST (Dz.U. 2022 poz. 2267 t.j.) — struktura trójfilarowa
Definicja: Trójfilarowy system finansowania JST oparty na:
  1. Dochodach własnych (podatki, udziały w PIT/CIT, opłaty)
  2. Subwencji ogólnej (bez wskazania celu)
  3. Dotacjach celowych (ze wskazaniem celu, rozliczane)
Reguła: Proporcje między filarami decydują o samodzielności finansowej JST —
  spory o poziom subwencji oświatowej są stałym przedmiotem interpelacji poselskich.
```

### BAS-092 — Jednostki sektora finansów publicznych (katalog)
```
Weryfikacja: ustawa o finansach publicznych art. 9 (Dz.U. 2024 poz. 1530 t.j.)
  ZWERYFIKOWANO — katalog zamknięty
Definicja: Katalog z art. 9 ustawy o finansach publicznych:
  organy władzy publicznej (Sejm, Senat, Prezydent, NSA, TK, NIK...),
  jednostki samorządu terytorialnego i ich związki,
  jednostki budżetowe, samorządowe ZB i AGT,
  państwowe i samorządowe fundusze celowe,
  ZUS, KRUS i zarządzane przez nie fundusze,
  NFZ i inne,
  agencje wykonawcze i IGB,
  uczelnie publiczne, PAN i in.
Reguła: Katalog ZAMKNIĘTY — podmiot spoza listy art. 9 UFP nie należy do SFP
  i nie ma obowiązku stosowania ustawy o finansach publicznych (np. spółki SP).
```

### BAS-097 / BAS-098 — Poręczenie i Gwarancja Skarbu Państwa
```
Weryfikacja: ustawa o poręczeniach i gwarancjach udzielanych przez SP
  (Dz.U. 2024 poz. 836 t.j.) — ZWERYFIKOWANO
PORĘCZENIE SP (art. 89 ust. 1 pkt 4 UFP):
  Zobowiązanie SP do spełnienia świadczenia pieniężnego w razie niewykonania
  go przez dłużnika głównego — akcesoryjne, wygasa z głównym zobowiązaniem.
GWARANCJA SP:
  Zobowiązanie SP niezależne od zobowiązania dłużnika głównego — nieakcesoryjne;
  SP płaci po ziszczeniu się warunków bez badania, czy dłużnik był zobowiązany.
Reguła: Gwarancja silniejsza niż poręczenie — beneficjent nie musi dowodzić
  winy dłużnika ani wyczerpania środków od dłużnika przed żądaniem od SP.
Podstawa: ustawa o poręczeniach i gwarancjach udzielanych przez SP
  (Dz.U. 2024 poz. 836 t.j.)
```

### BAS-110 — Absolwent centrum integracji społecznej (CIS)
```
Weryfikacja: ustawa z 13.06.2003 r. o zatrudnieniu socjalnym art. 2 pkt 1a
  (Dz.U. 2022 poz. 2241 t.j. — weryfikuj aktualne Dz.U.)
  + nowelizacja 2024 (Sejm X kad.) — podniesienie świadczenia integracyjnego do 120%

Definicja ustawowa (art. 2 pkt 1a):
  "Absolwent CIS = osoba, która przez okres nie krótszy niż 6 miesięcy
  uczestniczyła w zajęciach w centrum integracji społecznej i otrzymała
  zaświadczenie (art. 13 ust. 5a); osoba ta jest absolwentem CIS przez okres
  6 miesięcy od dnia zakończenia zajęć."

Skutki prawne statusu absolwenta CIS:
  → Może być skierowana przez PUP do pracy, stażu lub zatrudnienia wspieranego
  → Może założyć spółdzielnię socjalną z innymi absolwentami CIS/KIS
  → Po upływie 6 miesięcy — status wygasa; traktowana jak nigdy niekorzystająca z CIS

Zmiana 2024: likwidacja przesłanki ubóstwa przy kierowaniu do CIS;
  świadczenie integracyjne: 120% zasiłku dla bezrobotnych (było 100%)
  Skrócenie okresu zatrudnienia wspieranego: z 12 do 6 miesięcy
```

### BAS-113 — Płeć społeczno-kulturowa (gender)
```
Weryfikacja: Konwencja stambulska CETS 210 art. 3 lit. c (Dz.U. 2015 poz. 961)
  web_search: "płeć kulturowa gender definicja prawo polskie 2025 2026 Konwencja"
Status prawny w Polsce: BRAK DEFINICJI LEGALNEJ

Pojęcie funkcjonuje wyłącznie w:
  → Konwencji stambulskiej (CETS 210) art. 3 lit. c — "społecznie ukształtowane role"
    ratyfikowanej przez Polskę (Dz.U. 2015 poz. 961)
  → Orzecznictwie ETPC (m.in. Fedotova p. Rosja)
  → Projekcie ustawy o związkach partnerskich (X kadencja — weryfikuj status)

Reguła: Do ostrożnego użycia wyłącznie w kontekście definicyjnym (Konwencja);
  pojęcie politycznie i prawnie kontrowersyjne w Polsce;
  web_search: "płeć społeczno-kulturowa Polska prawo konwencja stambulska 2025 2026"
```

### BAS-116 — Dzieło / utwór w regulacjach antykryzysowych (COVID-19)
```
Weryfikacja: MKiDN interp. nr 4610 (Sejm IX kad.) + ustawa o prawie autorskim art. 1
  (Dz.U. 2022 poz. 2509 t.j. — weryfikuj aktualne zmiany)
  Historyczne (tarcze COVID) — stosować tylko do stanów faktycznych 2020–2022
Źródło: interpelacja nr 4610 do Ministra Kultury (Sejm IX kadencja)
  dot. rekompensat dla twórców z "tarczy antykryzysowej"

Teza (odpowiedź MKiDN):
  Dla celów wsparcia antykryzysowego "dzieło/utwór" interpretowane szeroko —
  nie ogranicza się do dzieł spełniających przesłanki Prawa autorskiego art. 1.
  Twórca = osoba wykonująca wolny zawód twórczy (artysta, pisarz, muzyk)
  lub świadcząca usługi w obszarze kultury na podstawie umów cywilnoprawnych.

Reguła: Definicja na potrzeby tarczy ma charakter autonomiczny — nie przenosi się
  na kwalifikację praw autorskich (ORKA-META-01).
Weryfikuj: Dz.U. 2020 poz. 374 i kolejne zmiany tarcz antykryzysowych (historyczne)
```

### BAS-120 — Powierzenie cudzoziemcowi nielegalnego wykonywania pracy
```
Weryfikacja: ustawa z 15.06.2012 r. o skutkach powierzania wykonywania pracy
  cudzoziemcom przebywającym wbrew przepisom na terytorium RP
  (Dz.U. 2024 poz. 1543 t.j. — weryfikuj)

Definicja: Powierzenie cudzoziemcowi wykonywania pracy bez wymaganego:
  a) tytułu pobytowego uprawniającego do wykonywania pracy, LUB
  b) zezwolenia na pracę / oświadczenia o powierzeniu pracy, LUB
  c) przy pracy niezgodnej z warunkami zezwolenia

Sankcje dla pracodawcy:
  → Grzywna do 30 000 zł (wykroczenie z KP) lub wyższa (tryb karny KKS)
  → Zakaz udziału w postępowaniach PZP
  → Obowiązek zwrotu dofinansowań UE
  → Odpowiedzialność solidarna za zaległe wynagrodzenie cudzoziemca

Reguła: "Nielegalna praca" cudzoziemca ≠ "nielegalne zatrudnienie" z BAS-002
  (to drugie dot. Polaków). Dwie odrębne podstawy prawne.
```

### BAS-125 — CRU JSFP — Centralny Rejestr Umów
```
⚠️ AKTUALNE — wejście w życie 01.07.2026 (stan na 06.06.2026)
Weryfikacja: art. 34a UFP (Dz.U. 2025 poz. 1844 nowelizacja) + rozp. MF Dz.U. 2026 poz. 440

DEFINICJA OBOWIĄZKU:
  Każda JSFP (art. 9 UFP) ma OBOWIĄZEK udostępnić w CRU informacje o umowach
  stanowiących "zamówienie" w rozumieniu PZP art. 7 pkt 32:
  = umowa odpłatna między JSFP (zamawiający) a wykonawcą,
    której przedmiotem jest nabycie dostaw, usług lub robót budowlanych.

KLUCZOWE PARAMETRY:
  → Brak progu kwotowego (nawet umowy za 1 zł podlegają rejestracji!)
  → Start obowiązku raportowania: 01.07.2026 (dla umów zawartych od tej daty)
  → Termin na wpis: 30 dni od zawarcia umowy
  → Usunięcie z CRU: 5 lat od końca roku, w którym umowa przestała obowiązywać
  → Spółki handlowe SP: NIE podlegają (nie są JSFP z art. 9 UFP)
  → Konta w systemie: od 01.04.2026 (wnioski kierownicy JSFP)

ZARZĄDZANIE: Minister Finansów odpowiada za system teleinformatyczny

REGUŁA: CRU JSFP ≠ BIP — to odrębny rejestr centralny; ujawnienie umowy
  w CRU nie zwalnia z obowiązków BIP i UDIP (kumulacja obowiązków).
  web_search: "CRU JSFP centralny rejestr umów 2026 wdrożenie"
```

---


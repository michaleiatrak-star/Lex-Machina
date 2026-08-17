# mod-BronAmunU-pozwolenia-cofniecie-strzelnice

**Wersja:** 1.0 | **Dodano:** 2026-08-16
**Akt:** ustawa z 21.05.1999 r. o broni i amunicji — **t.j. Dz.U. 2024 poz. 485**
(obwieszczenie Marszałka Sejmu z 21.03.2024, ogł. 2.04.2024)
**Rola w systemie:** zamknięcie flagi **F-92** — ustawa o broni i amunicji
NIE MIAŁA własnego modułu w żadnym z 16 DR-skilli. Występowała wyłącznie jako
akt pomocniczy przywołany w `dr-03/mod-KK-art263-bron-nielegalna.md`, przez co
pytanie ADMINISTRACYJNE („cofnięto mi pozwolenie", „odmówiono wydania")
trafiało na moduł KARNY i było obsługiwane niewłaściwym materiałem.

> ⛔ **HARDGATE** — ISAP (`isap.sejm.gov.pl`) i `api.sejm.gov.pl` blokują
> `web_fetch` (ROBOTS_DISALLOWED). Numer t.j. **2024.485** ustalono z
> metadanych wyniku ISAP (`WDU20240000485`) + potwierdzenie krzyżowe
> lexlege.pl/arslege.pl (stan prawny serwisu: 16.08.2026). **Przed użyciem
> w piśmie potwierdź ręcznie w ISAP, czy po 2024.485 nie ogłoszono nowszego
> t.j. lub nowelizacji.**

> ⚠️ **NIE MYLIĆ Z:** ustawą o środkach przymusu bezpośredniego i broni palnej
> (t.j. Dz.U. 2026 poz. 244, moduł `mod-ustawa-policja`) — tamta reguluje
> UŻYCIE broni przez FUNKCJONARIUSZY, ta — pozwolenia dla osób CYWILNYCH.
> Kolizja nazw jest źródłem błędnego routingu.

---

## 0. STRUKTURA AKTU I MAPA POKRYCIA TEGO MODUŁU

```
Rozdz. 1  art. 1-8a   Przepisy ogólne                       → sekcja 1 (PEŁNE ramowo)
Rozdz. 2  art. 9-33   Pozwolenia, cofanie, rejestracja      → sekcje 2-6 (RDZEŃ)
Rozdz. 3  art. 34-44a Przewóz/przywóz/wywóz, cudzoziemcy    → sekcja 7 (SZKIC)
Rozdz. 4  art. 45-49  Strzelnice                            → sekcja 8
Rozdz. 5  art. 50-51  Przepisy karne (przestępstwo + wykr.) → sekcja 9
Rozdz. 6  art. 52-56  Przepisy przejściowe i końcowe        → nieopracowane
```

---

## 1. ORGAN, FORMA, CHARAKTER ROZSTRZYGNIĘCIA (art. 9, 12, 20)

```
ORGAN I INSTANCJI (art. 9):
  □ broń palna + amunicja → KOMENDANT WOJEWÓDZKI POLICJI właściwy wg
    MIEJSCA STAŁEGO POBYTU osoby / siedziby podmiotu
  □ żołnierze zawodowi → komendant oddziału ŻANDARMERII WOJSKOWEJ
  □ miotacze gazu obezwładniającego, paralizatory >10 mA (art. 4 ust. 1
    pkt 3 i 4) → komendant POWIATOWY Policji
  □ broń pneumatyczna, broń pozbawiona cech użytkowych → karta rejestracyjna
    (odpowiednio komendant powiatowy / wojewódzki)
  □ świadectwo broni i legitymacja osoby dopuszczonej (art. 9 ust. 8) →
    WYŁĄCZNIE komendant wojewódzki

FORMA (art. 12 ust. 1): DECYZJA ADMINISTRACYJNA, w której organ określa
  CEL wydania oraz RODZAJ i LICZBĘ EGZEMPLARZY broni.
CZAS (art. 9 ust. 6): pozwolenie i karty rejestracyjne — na czas NIEOKREŚLONY.
COFNIĘCIE (art. 20): również w drodze DECYZJI ADMINISTRACYJNEJ.
```

**⭐ Konsekwencja proceduralna (ścieżka odwoławcza — brak przepisu szczególnego,
stosuje się KPA/PPSA):**
```
decyzja KWP → odwołanie do KOMENDANTA GŁÓWNEGO POLICJI (14 dni, art. 127-129 KPA)
           → skarga do WSA (30 dni od doręczenia decyzji ostatecznej, art. 53 §1 PPSA)
           → skarga kasacyjna do NSA (30 dni, przymus adwokacko-radcowski)
Warstwa proceduralna → `dr-05/modules/mod-KPA-decyzja-i-odwolanie.md`,
`dr-05/modules/mod-PPSA-terminy-kasacja-prawo-pomocy.md` — NIE duplikuj tutaj.
```

**Bramka rozstrzygająca w każdej sprawie:** ustal, czy przepis operuje słowem
**„cofa"/„odmawia"** (związanie organu) czy **„może cofnąć"/„może odmówić"**
(uznanie administracyjne). Zarzut i strategia są RÓŻNE: przy związaniu atakuje
się USTALENIE PRZESŁANKI, przy uznaniu — sposób jego wykonania (art. 7, 7a, 8,
77 §1, 80, 107 §3 KPA: zupełność materiału, granice uznania, uzasadnienie).

---

## 2. PRZESŁANKA POZYTYWNA — „WAŻNA PRZYCZYNA" (art. 10)

```
art. 10 ust. 1 — DWA warunki ŁĄCZNIE:
  (a) wnioskodawca NIE STANOWI ZAGROŻENIA dla samego siebie, porządku lub
      bezpieczeństwa publicznego, ORAZ
  (b) przedstawi WAŻNĄ PRZYCZYNĘ posiadania broni

art. 10 ust. 2 — CELE (katalog otwarty, „w szczególności"):
  1) ochrona osobista;      2) ochrona osób i mienia;
  3) łowieckie;             4) sportowe;
  5) rekonstrukcje hist.;   6) kolekcjonerskie;
  7) pamiątkowe;            8) szkoleniowe

art. 10 ust. 3 — CO JEST „WAŻNĄ PRZYCZYNĄ" dla danego celu:
  1) ochrona osobista/osób i mienia → STAŁE, REALNE i PONADPRZECIĘTNE
     zagrożenie życia, zdrowia lub mienia  ⭐ najtrudniejsza do wykazania,
     źródło ~większości spraw sądowoadministracyjnych
  2) cele ŁOWIECKIE → posiadanie uprawnień do wykonywania polowania
     (→ `dr-09/mod-lowiectwo-klusownictwo.md`, art. 42 Prawa łowieckiego)
  3) cele SPORTOWE → członkostwo w stowarzyszeniu strzeleckim + kwalifikacje
     z art. 10b + licencja polskiego związku sportowego (KOMPLET TRZECH)
  4) rekonstrukcje → członkostwo w stowarzyszeniu + zaświadczenie o czynnym
     udziale w działalności statutowej
  5) kolekcjonerskie → udokumentowane członkostwo w stowarzyszeniu kolekcjonerskim
  6) pamiątkowe → nabycie w drodze SPADKU, DAROWIZNY lub WYRÓŻNIENIA
  7) szkoleniowe → uprawnienia do prowadzenia szkoleń strzeleckich +
     zarejestrowana działalność gospodarcza w tym zakresie

art. 10 ust. 3a — ODRĘBNA ważna przyczyna dla ochrony osobistej: zadeklarowana
  chęć WZMOCNIENIA POTENCJAŁU OBRONNEGO RP przez funkcjonariusza formacji
  uzbrojonej / żołnierza zawodowego z bronią służbową, a także osobę pełniącą
  terytorialną służbę wojskową co najmniej 2 lata.
```

**Zakres uprawnienia (art. 10 ust. 4)** — pozwolenie NIE jest blankietowe:
każdy cel odpowiada zamkniętemu katalogowi rodzajów broni (np. ochrona
osobista — pistolety/rewolwery centralnego zapłonu 6–12 mm, paralizatory
>10 mA, miotacze gazu; cele łowieckie — wyłącznie broń dopuszczona do polowań
odrębnymi przepisami).

**Broń szczególnie niebezpieczna (art. 10 ust. 5) — pozwolenia NIE WYDAJE SIĘ na:**
samoczynną broń palną; broń zatajającą przeznaczenie lub imitującą inne
przedmioty; broń z tłumikiem huku **(wyjątek: pozwolenie do celów łowieckich,
a użycie takiej broni ograniczone do odstrzału sanitarnego z nakazu — art. 10
ust. 5a)**; broń niewykrywalną przez urządzenia kontroli osób i bagażu.
**Amunicja szczególnie niebezpieczna (ust. 6)** — zakaz posiadania, m.in.
amunicja wytworzona niefabrycznie, z wyłączeniem wytwarzanej na własny użytek
przez posiadaczy pozwolenia myśliwskiego, sportowego lub kolekcjonerskiego.

**Noszenie (ust. 7-9):** organ MOŻE w pozwoleniu OGRANICZYĆ lub WYKLUCZYĆ
noszenie (adnotacja w legitymacji). Broni kolekcjonerskiej i pamiątkowej NIE
WOLNO nosić bez odrębnej zgody organu. **Definicja legalna:** noszenie =
KAŻDY sposób przemieszczania broni ZAŁADOWANEJ.

---

## 3. PRZESŁANKI NEGATYWNE ODMOWY (art. 15 i art. 17)

```
OBLIGATORYJNE — „pozwolenia NIE WYDAJE SIĘ" (art. 15 ust. 1):
  1) osoby poniżej 21 lat (wyjątek ust. 2: od 18 lat na wniosek szkoły,
     organizacji sportowej, PZŁ lub stowarzyszenia obronnego — TYLKO broń
     sportowa lub łowiecka)
  2) z zaburzeniami psychicznymi w rozumieniu ustawy o ochronie zdrowia
     psychicznego lub o znacznie ograniczonej sprawności psychofizycznej
  3) z istotnymi zaburzeniami funkcjonowania psychologicznego
  4) uzależnione od alkoholu lub substancji psychoaktywnych
  5) nieposiadające MIEJSCA STAŁEGO POBYTU na terytorium RP
  6) stanowiące zagrożenie — skazane prawomocnie za: (a) UMYŚLNE przestępstwo
     lub umyślne przestępstwo skarbowe; (b) NIEUMYŚLNE przeciwko życiu i
     zdrowiu albo przeciwko bezpieczeństwu w komunikacji popełnione w stanie
     nietrzeźwości/pod wpływem środka odurzającego albo gdy sprawca zbiegł

ODMOWA ZWIĄZANA — „organ ODMAWIA" (art. 17 ust. 3 i 4):
  □ niezdanie egzaminu z art. 16 ust. 1
  □ nieprzedstawienie orzeczenia lekarskiego i psychologicznego (art. 15 ust. 3)

ODMOWA UZNANIOWA — „organ MOŻE odmówić" (art. 17 ust. 1 i 2), gdy osoba
naruszyła:
  1) warunki określone w pozwoleniu (art. 10 ust. 7)
  2) obowiązek rejestracji broni (art. 13 ust. 1)
  3) obowiązek zawiadomienia o utracie broni (art. 25)
  4) obowiązek zawiadomienia o zmianie miejsca stałego pobytu (art. 26)
  5) zasady przechowywania/ewidencjonowania/noszenia (art. 32)
  — oraz wobec osoby, której cofnięto pozwolenie na podstawie art. 18 ust. 1 pkt 4
```

---

## 4. BADANIA LEKARSKIE I PSYCHOLOGICZNE (art. 15 ust. 3-9, art. 15a-15l)

```
TERMIN WAŻNOŚCI ORZECZEŃ: wydane NIE WCZEŚNIEJ NIŻ 3 MIESIĄCE przed dniem
  złożenia wniosku (art. 15 ust. 3)
BADANIA OKRESOWE: posiadacz pozwolenia do celów OCHRONY OSOBISTEJ oraz
  OCHRONY OSÓB I MIENIA (art. 10 ust. 2 pkt 1 i 2) — RAZ NA 5 LAT (ust. 4).
  ⚠️ Cele łowieckie, sportowe, kolekcjonerskie NIE podlegają temu obowiązkowi.
BADANIE NADZWYCZAJNE (ust. 5): przy ujawnieniu okoliczności dostatecznie
  uzasadniających podejrzenie przynależności do grupy z ust. 1 pkt 2-4 organ
  MOŻE zobowiązać do niezwłocznych badań.
OBOWIĄZEK DENUNCJACYJNY LEKARZA/PSYCHOLOGA: przy orzeczeniu negatywnym —
  obowiązek zawiadomienia właściwego organu Policji (ust. 4 zd. 2, ust. 5).
KOSZTY (art. 15 ust. 8, art. 15e): ponosi osoba badana; maksymalna opłata za
  badanie lekarskie i osobno psychologiczne — po 15% przeciętnego wynagrodzenia
  w gospodarce narodowej z roku poprzedniego (GUS/M.P.).
WYŁĄCZENIA (ust. 6): funkcjonariusze Policji, ABW, AW, SKW, SWW, CBA, SOP, SG,
  Straży Marszałkowskiej, SCS, SW, innych formacji uzbrojonych i żołnierze
  zawodowi z przydzieloną bronią służbową.
```

**⭐ ODWOŁANIE OD ORZECZENIA (art. 15h) — ODRĘBNY TRYB, NIE KPA:**
```
□ Legitymowani: osoba ubiegająca się ORAZ komendant wojewódzki Policji
□ Termin: 30 DNI od doręczenia orzeczenia
□ Tryb: PISEMNIE, Z UZASADNIENIEM, za pośrednictwem lekarza/psychologa, który
  wydał orzeczenie, do INNEGO WYBRANEGO przez odwołującego lekarza/psychologa
  upoważnionego (nie do organu wyższego stopnia!)
□ Przekazanie akt: 3 dni; badanie odwoławcze: 30 dni od otrzymania odwołania
□ Koszty: odwołujący się
□ ⛔ Orzeczenie wydane w trybie odwołania jest OSTATECZNE (ust. 7)
```
Kontrolę badań i orzeczeń sprawuje **WOJEWODA** (art. 15i-15j), a wnioskiem
pokontrolnym może doprowadzić do wykreślenia lekarza/psychologa z rejestru
prowadzonego przez komendanta wojewódzkiego Policji (art. 15b-15c).

---

## 5. EGZAMIN (art. 16)

```
ZASADA: obowiązek zdania egzaminu przed komisją powołaną przez właściwy organ
  Policji — część TEORETYCZNA (przepisy) + PRAKTYCZNA (posługiwanie się bronią);
  komisja min. 3 osoby, w tym min. 1 z uprawnieniami instruktora strzelań
  policyjnych lub wyszkolenia strzeleckiego. Opłata ≤ 20% minimalnego
  wynagrodzenia za pracę.
ZWOLNIENI (ust. 2), jeśli zdali egzamin na podstawie odrębnych przepisów:
  □ funkcjonariusze Policji, ABW, AW, SKW, SWW, CBA, SG, Straży Marszałkowskiej,
    SCS, SOP, SW, innych formacji uzbrojonych, żołnierze zawodowi
  □ ⭐ CZŁONKOWIE PZŁ — w zakresie broni MYŚLIWSKIEJ
  □ ⭐ członkowie PZSS z licencją — w zakresie broni SPORTOWEJ
```

---

## 6. COFNIĘCIE POZWOLENIA I ODEBRANIE BRONI (art. 18, 19, 19a, 22)

```
COFNIĘCIE OBLIGATORYJNE — „organ COFA" (art. 18 ust. 1):
  1) nieprzestrzeganie warunków określonych w pozwoleniu (art. 10 ust. 7)
  2) przynależność do osób z art. 15 ust. 1 pkt 2-6 ⭐ w tym KAŻDE prawomocne
     skazanie za przestępstwo umyślne — także niezwiązane z bronią
  3) naruszenie obowiązku zawiadomienia o utracie broni (art. 25)
  4) przemieszczanie się z rozładowaną bronią albo noszenie broni w stanie
     PO UŻYCIU alkoholu, środka odurzającego, substancji psychotropowej albo
     środka zastępczego ⭐ próg „po użyciu", NIE „w stanie nietrzeźwości"

COFNIĘCIE UZNANIOWE — „organ MOŻE cofnąć":
  □ ust. 4 — gdy USTAŁY OKOLICZNOŚCI FAKTYCZNE stanowiące podstawę wydania
    (np. odpadła ważna przyczyna z art. 10 ust. 3)
  □ ust. 5 — naruszenie: rejestracji (art. 13 ust. 1); obowiązku poddania się
    badaniom (art. 15 ust. 3-5, art. 19a ust. 4); zawiadomienia o zmianie
    miejsca stałego pobytu (art. 26); zasad przechowywania/noszenia/ewidencji
    (art. 32); zgody na wywóz za granicę (art. 38); zasady z art. 45;
    zakazu użyczania broni osobie nieupoważnionej

SKUTEK (art. 18 ust. 8): zwrot dokumentów w terminie 7 DNI od otrzymania
  decyzji OSTATECZNEJ.
SKUTEK MATERIALNY (art. 22): obowiązek NIEZWŁOCZNEGO zbycia broni i amunicji;
  jeśli nie zbyto w 30 DNI — złożenie do depozytu organu Policji. Za wykonanie
  obowiązku uważa się też pozbawienie broni cech użytkowych (ust. 1a).
```

**Odebranie broni PRZED cofnięciem (art. 19)** — za pokwitowaniem, gdy ujawniono
okoliczności z art. 18 ust. 1 pkt 1-2 i 4 oraz ust. 5, **a zwłoka zagrażałaby
bezpieczeństwu publicznemu**; ponadto (ust. 1a) na czas postępowania karnego o
przestępstwa z art. 15 ust. 1 pkt 6 — **maksymalnie 3 lata**. Uprawnienie
realizuje także Straż Graniczna w strefie nadgranicznej i na przejściu (ust. 3).

**⭐ Odebranie OBLIGATORYJNE — przemoc domowa (art. 19a ust. 1):** Policja
(wobec żołnierza — ŻW) **odbiera** broń, amunicję i dokumenty w razie:
wszczęcia procedury „Niebieskie Karty" przy zagrożeniu życia lub zdrowia osoby
doznającej przemocy domowej; zatrzymania w związku ze stosowaniem przemocy
domowej; wydania nakazu opuszczenia mieszkania / zakazu zbliżania się (art.
15aa, 15aaa ustawy o Policji; art. 18a, 18aa ustawy o ŻW); powiadomienia przez
sąd o postanowieniu zabezpieczającym z art. 11a/11aa ustawy o przeciwdziałaniu
przemocy domowej. **Osoba taka MUSI poddać się badaniom z art. 15a (ust. 4)**;
zwrot następuje tylko, gdy nie stwierdzono podstaw do wszczęcia postępowania o
cofnięcie (ust. 5). → powiązanie: `dr-02` (przemoc domowa, zabezpieczenie),
`dr-13/mod-ustawa-policja`.

**Pozostałe obowiązki posiadacza — mapa terminów:**
```
□ art. 13 ust. 1 — rejestracja broni: 5 DNI od nabycia
□ art. 25      — zawiadomienie o UTRACIE broni: NIEZWŁOCZNIE, max 24 GODZINY
                 od stwierdzenia utraty
□ art. 26      — zawiadomienie o zmianie miejsca stałego pobytu: 14 DNI
□ art. 21      — zbycie broni tylko między osobami z pozwoleniem na TEN SAM
                 rodzaj broni + niezwłoczne pisemne powiadomienie organu
□ art. 28      — użyczać wolno WYŁĄCZNIE broń łowiecką/sportową i wyłącznie
                 osobie z pozwoleniem wydanym w celach łowieckich/sportowych
□ art. 32      — przechowywanie i noszenie w sposób uniemożliwiający dostęp
                 osób nieuprawnionych (szczegóły — rozporządzenie MSWiA)
□ art. 27 ust. 5 — PZŁ i zarządy stowarzyszeń strzeleckich: coroczne wykazy
                 członków + powiadomienie o WYKLUCZENIU w 30 DNI
```

**Świadectwo broni i dopuszczenie (art. 29-30):** świadectwo broni (pozwolenie
na okaziciela) dla m.in. wewnętrznych służb ochrony, koncesjonowanych firm
ochrony, prowadzących strzelnice, szkół i organizacji łowieckich/sportowych,
podmiotów filmowych, a także **zarządców/dzierżawców obwodów łowieckich do
odstrzału sanitarnego z nakazu**. Dopuszczenie do posiadania broni — decyzja
administracyjna organu Policji, z zachowaniem art. 15 ust. 1-5 i art. 16.

---

## 7. WYŁĄCZENIA OBOWIĄZKU POZWOLENIA (art. 11) — bramka wstępna

```
Pozwolenia NIE WYMAGA m.in.:
  □ używanie broni w celach sportowych/szkoleniowych/rekreacyjnych NA
    STRZELNICY działającej na podstawie zezwolenia
  □ posiadanie broni palnej POZBAWIONEJ CECH UŻYTKOWYCH (ale karta rejestracyjna
    i wiek 18 lat — art. 13 ust. 6)
  □ posiadanie BRONI PNEUMATYCZNEJ (karta rejestracyjna; 18 lat, orzeczenia
    z art. 15 ust. 3 oraz zaświadczenie z KRK — art. 13 ust. 7)
  □ paralizatory o średnim prądzie ≤ 10 mA; ręczne miotacze gazu obezwładniającego
  □ broń palna rozdzielnego ładowania wytworzona PRZED 1885 r. i jej repliki
  □ ⭐ broń palna ALARMOWA o kalibrze DO 6 mm
  □ gromadzenie broni w zbiorach muzealnych; dysponowanie bronią przez
    koncesjonowanych przedsiębiorców i rusznikarzy; broń przekazana w celu
    pozbawienia cech użytkowych
```
Rozdz. 3 (art. 34-44a) — przewóz, przywóz z zagranicy, wywóz, Europejska karta
broni palnej (art. 10a: wydawana na okres **do 5 lat**, traci ważność i podlega
zwrotowi w razie cofnięcia pozwolenia), zasady posiadania broni przez
cudzoziemców — **opracowane wyłącznie szkicowo, do rozwinięcia przy sprawie**.

---

## 8. STRZELNICE (art. 45-49)

```
□ art. 45 — używanie broni zdolnej do rażenia celów na odległość w celach
  szkoleniowych/sportowych — WYŁĄCZNIE na strzelnicach
□ art. 46 — lokalizacja i zasady bezpieczeństwa; szczegóły określa REGULAMIN
  strzelnicy; MSWiA wydaje wzorcowy regulamin (rozporządzenie)
□ art. 47 — ⭐ ZATWIERDZENIE REGULAMINU następuje w drodze DECYZJI
  ADMINISTRACYJNEJ wydawanej przez WÓJTA, BURMISTRZA (PREZYDENTA MIASTA);
  do postępowania stosuje się dział II rozdz. 14 KPA
  → organ odwoławczy: SKO (nie Policja!) — patrz `dr-05/mod-ustawa-SKO.md`
□ art. 48 — wymagania środowiskowe budowy i użytkowania strzelnic
  (rozporządzenie ministra klimatu w porozumieniu z ministrem środowiska)
  → hałas/emisje: `dr-09/mod-POS-prawo-ochrony-srodowiska.md`
□ art. 49 — strzelnice wyłączone spod stosowania przepisów ustawy
```

---

## 9. PRZEPISY KARNE USTAWY (art. 50-51) — ODRĘBNE OD ART. 263 KK

```
ART. 50 — PRZESTĘPSTWO: kto PORZUCA broń palną lub amunicję pozostającą w
  jego dyspozycji → grzywna, ograniczenie wolności albo pozbawienie wolności
  DO LAT 2.
  ⚠️ Odróżnić od art. 263 §4 KK (NIEUMYŚLNE spowodowanie UTRATY) — porzucenie
  jest zachowaniem UMYŚLNYM i sankcjonowanym poza Kodeksem karnym.

ART. 51 — WYKROCZENIA (areszt albo grzywna; orzekanie w trybie KPW — ust. 5):
  ust. 1 — posiadanie broni pneumatycznej BEZ wymaganej rejestracji; zbycie
    osobie nieuprawnionej broni pneumatycznej, miotacza gazu lub narzędzia
    zagrażającego życiu/zdrowiu
  ust. 2 — m.in.: 1) brak rejestracji broni albo zdania do depozytu;
    2) brak zawiadomienia o utracie/zbyciu; 3) brak zawiadomienia o zmianie
    miejsca stałego pobytu w 14 dni; 4) ⭐ NOSZENIE BRONI W STANIE PO UŻYCIU
    alkoholu/środka odurzającego; 5, 5a-5d) naruszenia przywozu/wywozu (UE i
    poza UE, zgody przewozowe, zaświadczenia konsula); 6) przesyłanie broni
    poza operatorem pocztowym; 7) przechowywanie/noszenie umożliwiające dostęp
    osób nieuprawnionych; 8) przewóz transportem publicznym bez zabezpieczenia;
    9) przewóz w kabinie pasażerskiej statku powietrznego; 10) noszenie wbrew
    ograniczeniu/wykluczeniu z pozwolenia lub zakazowi MSWiA; 11) używanie
    broni poza strzelnicą; 12) naruszenie regulaminu strzelnicy; 13) niezwrócenie
    legitymacji/karty/EKBP; 14) niezawiadomienie KWP o polowaniu/imprezie/
    rekonstrukcji z udziałem cudzoziemców
  ust. 3 — posiadanie broni BEZ dokumentów PRZY SOBIE → kara GRZYWNY
  ust. 4 — ⭐ można orzec PRZEPADEK broni i amunicji, CHOĆBY NIE STANOWIŁY
    WŁASNOŚCI SPRAWCY (mechanizm analogiczny do art. 54 ust. 2 Prawa łowieckiego)
```

**⭐ Podwójny skutek jednego czynu:** noszenie broni po użyciu alkoholu to
JEDNOCZEŚNIE wykroczenie z art. 51 ust. 2 pkt 4 ORAZ obligatoryjna przesłanka
cofnięcia pozwolenia z art. 18 ust. 1 pkt 4. W sprawie klienta ZAWSZE prowadź
oba wątki równolegle — wynik sprawy wykroczeniowej nie wyczerpuje ryzyka.

---

## 10. CHECKLIST INTAKE

```
□ Jaki DOKŁADNIE jest przedmiot sprawy: odmowa wydania / cofnięcie / odmowa
  rejestracji / odebranie broni (art. 19 lub 19a) / wykroczenie z art. 51?
□ Który ORGAN wydał akt (KWP / komendant powiatowy / ŻW / wójt przy strzelnicy)?
□ Data DORĘCZENIA decyzji — termin 14 dni (odwołanie) / 30 dni (skarga do WSA)
□ CEL, w jakim pozwolenie wydano lub o jaki wnioskowano (art. 10 ust. 2) —
  determinuje wymaganą „ważną przyczynę" i obowiązki okresowe
□ Czy podstawa jest ZWIĄZANA („cofa"/„odmawia") czy UZNANIOWA („może") —
  determinuje kierunek zarzutów
□ Czy w sprawie są ORZECZENIA lekarskie/psychologiczne — czy wykorzystano
  30-dniowe odwołanie z art. 15h (jest OSTATECZNE — po nim tylko atak
  procesowy na ocenę dowodu w postępowaniu administracyjnym)
□ Czy toczy się równoległe postępowanie KARNE (art. 263 KK) lub WYKROCZENIOWE
  (art. 51) — → `dr-03/mod-KK-art263-bron-nielegalna.md`
□ Czy zachowano terminy własne klienta: 24 h (utrata), 5 dni (rejestracja),
  7 dni (zwrot dokumentów), 14 dni (zmiana pobytu), 30 dni (zbycie broni)
□ Czy w tle jest przemoc domowa / Niebieskie Karty (art. 19a) — inny reżim,
  odebranie jest OBLIGATORYJNE i niezależne od uznania organu
```

---

## 11. INTEGRACJA Z SYSTEMEM

- **`dr-03/mod-KK-art263-bron-nielegalna.md`** — warstwa karna (nielegalne
  posiadanie/wyrób/handel). Ten moduł dostarcza warstwę ADMINISTRACYJNĄ, do
  której art. 263 KK odsyła przez znamię „bez wymaganego zezwolenia".
- **`dr-05/mod-KPA-decyzja-i-odwolanie.md`**, **`mod-KPA-tryby-nadzwyczajne-i-strategia.md`**,
  **`mod-PPSA-terminy-kasacja-prawo-pomocy.md`** — ścieżka odwoławcza i sądowa.
- **`dr-09/mod-lowiectwo-klusownictwo.md`** — pozwolenie do celów łowieckich,
  zwolnienie członków PZŁ z egzaminu, odstrzał sanitarny, świadectwo broni dla
  dzierżawcy obwodu (art. 29 ust. 1 pkt 8).
- **`dr-13/mod-ustawa-policja.md`** — ustawa o środkach przymusu bezpośredniego
  i broni palnej (t.j. Dz.U. 2026 poz. 244) — INNY AKT, uzbrojenie służb.
- **`dr-05/mod-ustawa-SKO.md`** — organ odwoławczy przy zatwierdzeniu regulaminu
  strzelnicy (decyzja wójta/burmistrza, art. 47).

---

## 12. ŹRÓDŁA (weryfikacja 2026-08-16)

- **Rząd 1 (pośrednio):** isap.sejm.gov.pl — metadane `WDU20240000485`
  (obwieszczenie Marszałka Sejmu z 21.03.2024, t.j. ogłoszony 2.04.2024).
  ⛔ Bezpośredni `web_fetch` zablokowany (ROBOTS_DISALLOWED).
- **Rząd 2:** lexlege.pl / arslege.pl — pełne brzmienie Rozdz. 2 (art. 9-33)
  i Rozdz. 5 (art. 50-51), stan prawny serwisu 16.08.2026, sygnowane
  „Dz.U.2024.0.485 t.j."; struktura rozdziałów potwierdzona krzyżowo.

## ⚠️ NIEZWERYFIKOWANE — DO USTALENIA PRZY SPRAWIE

```
□ Czy po t.j. 2024.485 ogłoszono nowszy t.j. lub nowelizację (ISAP ręcznie)
□ Rozporządzenia wykonawcze: przechowywanie/noszenie/ewidencja (art. 32 ust. 2),
  wzory dokumentów (art. 31), tryb egzaminu (art. 16 ust. 3), wykaz stanów
  chorobowych (art. 15 ust. 9), wzorcowy regulamin strzelnic (art. 46 ust. 3)
□ Rozdz. 3 (art. 34-44a) — opracowany szkicowo, wymaga rozwinięcia
□ Rozdz. 6 (art. 52-56) — nieopracowany
□ Orzecznictwo: art. 15 ma 295, art. 18 — 290, art. 10 — 76 odnotowanych
  orzeczeń (lexlege). ⛔ ŻADNEJ sygnatury nie wpisano do tego modułu —
  przed powołaniem linii orzeczniczej uruchom `orzeczenia-sadowe-v2`
  (CBOSA/NSA — sprawy pozwoleń na broń to niemal wyłącznie WSA/NSA)
```

---

## CHANGELOG

**1.0 (2026-08-16):** Utworzenie modułu — zamknięcie luki F-92 wykrytej w
audycie pokrycia prawa łowieckiego i broni. Opracowano: organ i formę (art. 9,
12, 20) z pełną ścieżką odwoławczą KPA/PPSA; „ważną przyczynę" i katalog celów
(art. 10 ust. 1-3a) wraz z zakresem uprawnienia (ust. 4) i bronią szczególnie
niebezpieczną (ust. 5-6); przesłanki odmowy obligatoryjne i uznaniowe (art. 15,
17); badania lekarskie/psychologiczne z odrębnym 30-dniowym trybem odwoławczym
(art. 15a-15l); egzamin i zwolnienia dla PZŁ/PZSS (art. 16); cofnięcie
obligatoryjne i uznaniowe (art. 18), odebranie broni (art. 19) oraz
obligatoryjne odebranie przy przemocy domowej (art. 19a); mapę terminów
posiadacza; wyłączenia z art. 11; strzelnice (art. 45-49, z decyzją wójta);
przepisy karne ustawy (art. 50-51) z przepadkiem niezależnym od własności.
Świadomie NIE wpisano żadnej sygnatury orzeczniczej (HARDGATE).

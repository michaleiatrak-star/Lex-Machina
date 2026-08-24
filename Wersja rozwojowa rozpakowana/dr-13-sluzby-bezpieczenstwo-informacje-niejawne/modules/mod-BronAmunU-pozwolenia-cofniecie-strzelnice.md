# mod-BronAmunU-pozwolenia-cofniecie-strzelnice

**Wersja:** 1.1 | **Dodano:** 2026-08-16 | **Zaktualizowano:** 2026-08-19 (F-92)
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
> lexlege.pl/arslege.pl (stan prawny serwisu: 16.08.2026).
>
> ✅ **KONTROLA NOWELIZACJI WYKONANA (2026-08-19, F-92)** — po t.j. 2024.485
> ogłoszono DWIE nowelizacje, obie potwierdzone niezależnie (inforlex —
> oficjalna chronologia zmian aktu; ISAP-hosted PDF z nagłówkiem stan na
> 30.03.2026 wprost wymieniający obie pozycje w podstawie prawnej):
> 1. **Dz.U. 2025 poz. 1795** — ustawa z 21.11.2025 o zdrowiu zwierząt
>    (już skatalogowana gdzie indziej w systemie, dr-09 — nie generuje
>    nowej luki); zakres zmiany w samej ustawie o broni i amunicji NIE
>    zweryfikowany artykuł po artykule w tej sesji, tylko fakt objęcia.
> 2. **Dz.U. 2026 poz. 187** — ustawa z 23.01.2026 o zawodzie psychologa
>    oraz samorządzie zawodowym psychologów. **Art. 137** tej ustawy
>    zmienia **art. 15c ust. 1 pkt 1** ustawy o broni i amunicji —
>    zastępuje dotychczasowy wymóg dyplomu (magister psychologii lub
>    dyplom KUL/ATK z filozofii ze specjalizacją psychologiczną) nowym
>    odesłaniem do reżimu kwalifikacji zawodowych z ustawy o zawodzie
>    psychologa. Potwierdzone bezpośrednio w tekście ustawy nowelizującej
>    (przepisy.gofin.pl, cytujący dosłownie numerację "Art. 137. W ustawie
>    (...) o broni i amunicji (...) w art. 15c w ust. 1 pkt 1 otrzymuje
>    brzmienie: (...)"). ⚠️ Dokładna NOWA treść pkt 1 (po podstawieniu)
>    NIE odczytana w tej sesji — do ustalenia przy sprawie dotyczącej
>    kwalifikacji psychologa upoważnionego. Ustawa nowelizująca wchodzi
>    w życie zasadniczo dopiero 19.05.2028 (co do zasady), ale zawiera
>    wyjątki dla części przepisów wchodzących wcześniej — **czy art. 137
>    jest objęty którymś z wcześniejszych terminów, NIE ustalone w tej
>    sesji**, wymaga sprawdzenia przy sprawie (ryzyko: przepis może jeszcze
>    nie obowiązywać pomimo publikacji).
> **Przed użyciem w piśmie nadal potwierdź ręcznie w ISAP aktualny stan
> art. 15c oraz czy w międzyczasie nie doszło do kolejnej nowelizacji.**

> ⚠️ **NIE MYLIĆ Z:** ustawą o środkach przymusu bezpośredniego i broni palnej
> (t.j. Dz.U. 2026 poz. 244, moduł `mod-ustawa-policja`) — tamta reguluje
> UŻYCIE broni przez FUNKCJONARIUSZY, ta — pozwolenia dla osób CYWILNYCH.
> Kolizja nazw jest źródłem błędnego routingu.

---

## 0. STRUKTURA AKTU I MAPA POKRYCIA TEGO MODUŁU

```
Rozdz. 1  art. 1-8a   Przepisy ogólne                       → sekcja 1 (PEŁNE ramowo)
Rozdz. 2  art. 9-33   Pozwolenia, cofanie, rejestracja      → sekcje 2-6 (RDZEŃ)
Rozdz. 3  art. 34-44a Przewóz/przywóz/wywóz, cudzoziemcy    → sekcja 7a (ROZWINIĘTE 2026-08-19, F-92)
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

### ⭐⭐⭐ ORZECZNICTWO — linia dot. "ważnej przyczyny"/zagrożenia bezpieczeństwa
publicznego przy zatarciu skazania — dodano 2026-08-19, naprawa F-92
(zgodnie z PLAN MINIMUM: orzeczenia wspierające restrykcyjną linię NSA;
BRAK zidentyfikowanej linii przeciwnej w tej sesji — ⚠️ nie oznacza,
że nie istnieje, tylko że nie znaleziono jej przy tym wyszukiwaniu)

```
⭐⭐⭐ NSA, wyrok z 9.09.2025 r., sygn. akt II GSK 491/22 — ✅ VER: 2026-08-19
  (prawo.pl + infor.pl, zgodne co do treści i sygnatury). TEZA: instytucja
  zatarcia skazania (art. 106 KK) pozwala uznać osobę za niekaraną, ale
  przy OCENIE WNIOSKODAWCY liczy się nie sam fakt (nie)ukarania, lecz
  DOTYCHCZASOWE ŻYCIE i sposób postępowania — popełnione wcześniej
  przestępstwo "nie pozostaje faktem obojętnym" dla oceny zagrożenia
  porządku/bezpieczeństwa publicznego. UCHYLIŁ korzystny dla żołnierza
  wyrok WSA w Warszawie z 16.11.2021 r. (VI SA/Wa 805/21) i ODDALIŁ
  jego skargę — decyzja PRAWOMOCNA.

⭐⭐ NSA, wyrok z 11.10.2023 r., sygn. akt II GSK 1952/22 — ✅ VER:
  legeartis.org. Podobny stan faktyczny (żołnierz, broń kolekcjonerska).
  TEZA: sama codzienna służba z bronią maszynową NIE daje automatycznego
  prawa do pozwolenia cywilnego — przesłanki ocenia się indywidualnie.

⭐⭐ NSA, wyrok z 20.02.2015 r., sygn. akt II OSK 1683/13 — ✅ VER:
  prawo.pl. TEZA: odstąpienie sądu karnego od wymierzenia kary NIE daje
  rękojmi, że wnioskodawca w przyszłości nie użyje broni w celu
  sprzecznym z interesem społecznym.

⭐ WSA w Warszawie, wyrok z 5.11.2021 r., sygn. akt VI SA/Wa 2117/21 —
  ✅ VER: prawo.pl (przywołany jako spójny z linią II OSK 1683/13).

⭐⭐ NSA, wyrok z 29.09.2019 r., sygn. akt II OSK 3223/14 — ⚠️ [POŚREDNIO
  ZWERYFIKOWANE — cytat z artykułu branżowego legeartis.org, nie z
  bezpośredniego źródła orzeczniczego]. TEZA: art. 10 ust. 5 pkt 1
  ustawy wprowadza WYJĄTEK od zasady ogólnej (art. 10 ust. 4) —
  zakaz udzielania pozwolenia na broń SZCZEGÓLNIE NIEBEZPIECZNĄ
  (w tym samoczynną broń palną) w celach kolekcjonerskich; prawo do
  broni jest prawem REGLAMENTOWANYM, nie konstytucyjnym — brak podstaw
  do wykładni rozszerzającej.

⚠️ [NIEWERYFIKOWANE — USZKODZONA SYGNATURA] NSA, wyrok z 2.12.2015 r. —
  dotyczy niedopuszczalności odmowy pozwolenia kolekcjonerskiego
  WYŁĄCZNIE z powodu żądanej DUŻEJ LICZBY sztuk broni; sygnatura
  w źródle wyświetliła się USZKODZONA ("II OSK 847?14" — prawdopodobnie
  II OSK 847/14, ale ZNAK ZAPYTANIA w miejscu ukośnika wskazuje na błąd
  kodowania źródła). NIE cytować tej sygnatury w piśmie bez odrębnej
  weryfikacji dokładnego numeru.

⚠️ ZASYGNALIZOWANE, NIE ZWERYFIKOWANE TREŚCIOWO w tej sesji (tylko tytuły
  z OpenLEX, bez dostępu do treści):
  □ NSA, II OSK 1097/11 — "zatarcie skazania jako okoliczność uzasadniająca
    COFNIĘCIE pozwolenia na broń" (inny stan faktyczny niż wyżej — dot.
    COFNIĘCIA, nie ODMOWY wydania)
  □ NSA, II OSK 497/20 — "zatarcie skazania a wydanie pozwolenia na broń"

WNIOSEK PRAKTYCZNY: linia orzecznicza NSA jest SPÓJNA i RESTRYKCYJNA —
zatarcie skazania NIE eliminuje możliwości odmowy/cofnięcia pozwolenia
na broń, jeśli organ wykaże związek między przeszłym zachowaniem
a oceną ryzyka na przyszłość. Dotyczy to RÓWNIEŻ żołnierzy zawodowych —
codzienny kontakt z bronią służbową NIE przekłada się automatycznie na
uprawnienia cywilne.
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
                 osób nieuprawnionych (szczegóły — sekcja 6a niżej,
                 ROZPORZĄDZENIE wykonawcze rozwinięte 2026-08-19, F-92)
□ art. 27 ust. 5 — PZŁ i zarządy stowarzyszeń strzeleckich: coroczne wykazy
                 członków + powiadomienie o WYKLUCZENIU w 30 DNI
```

## 6a. ⭐⭐⭐ ROZPORZĄDZENIE WYKONAWCZE — PRZECHOWYWANIE, NOSZENIE,
EWIDENCJONOWANIE (art. 32 ust. 2) — dodano 2026-08-19, naprawa F-92
(pierwsze rozporządzenie wykonawcze rozwinięte w tym module)

```
⭐ PODSTAWA: rozporządzenie Ministra Spraw Wewnętrznych z 26.08.2014 r.
  w sprawie przechowywania, noszenia oraz ewidencjonowania broni
  i amunicji — pierwotnie Dz.U. 2014 poz. 1224, wydane na podstawie
  art. 32 ust. 2 ustawy. TEKST JEDNOLITY ogłoszony obwieszczeniem MSWiA
  z 10.02.2023 — Dz.U. 2023 poz. 364. ✅ VER: 2026-08-19 (isap.sejm.gov.pl,
  potwierdzone WDU20230000364), zgodne z 5+ źródłami wtórnymi.
  ⚠️ Sprawdzić przy sprawie, czy nie zaszła nowsza zmiana po 2023 poz. 364.

⭐⭐⭐ WYMÓG SEJFU/SZAFY (§5 ust. 1) — KLUCZOWY praktycznie:
  → urządzenie do przechowywania musi spełniać wymagania CO NAJMNIEJ
    klasy S1 wg normy PN-EN 14450 (certyfikat Instytutu Mechaniki
    Precyzyjnej + tabliczka znamionowa/hologram)
  → ZWYKŁE meble (szafa, komoda, szuflada) NIE SPEŁNIAJĄ wymogu —
    konieczny specjalistyczny sejf/szafa na broń
  → broń MUSI być przechowywana ROZŁADOWANA, z ROZŁĄCZONYM magazynkiem
  → amunicja — w pojemnikach/pudełkach UNIEMOŻLIWIAJĄCYCH uderzenie
    w spłonkę naboju; MOŻE być przechowywana W TYM SAMYM urządzeniu
    co broń, JEŚLI jest fizycznie WYDZIELONA (osobna skrytka/pojemnik)
  → dokumentacja (kopie dokumentów zakupu broni/amunicji) —
    przechowywana W TYM SAMYM urządzeniu

⭐ PRZEPIS PRZEJŚCIOWY (nadal aktualny mechanizm, choć z 2014 r.):
  → posiadacze pozwolenia WYDANEGO PO 26.08.2014 — obowiązek stosowania
    wymogów OD RAZU
  → posiadacze pozwolenia WYDANEGO PRZED 26.08.2014 — mieli 5 LAT na
    dostosowanie (termin 26.08.2019, już upłynął — obecnie WSZYSCY
    posiadacze podlegają wymogom bez wyjątku)

⚠️ SANKCJA za niedostosowanie: możliwe COFNIĘCIE pozwolenia + fakultatywny
  PRZEPADEK broni (art. 18 ust. 5 pkt 4 ustawy — patrz sekcja 6) oraz
  kara ARESZTU lub GRZYWNY w trybie wykroczeniowym (art. 51 — patrz
  sekcja 9, ⭐ NOSZENIE/przechowywanie umożliwiające dostęp osób
  nieuprawnionych jest tam wprost wymienione jako wykroczenie)

⚠️ MONITOROWAĆ: w wykazie prac legislacyjnych MSWiA figuruje PROJEKT
  rozporządzenia ZMIENIAJĄCEGO to rozporządzenie (nr 572) — status
  i zakres zmian NIEUSTALONE w tej sesji, do sprawdzenia przy sprawie
  na gov.pl/web/mswia lub RCL.

Źródła: malopolska.policja.gov.pl (Policja, dosłowny cytat §5 ust. 1),
sejfzone.pl, krajenskaostoja.pl, metalowe24.pl, allegro.pl/artykul —
5+ zgodnych źródeł wtórnych + potwierdzenie numeru t.j. na isap.sejm.gov.pl.
```

---

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
## 7a. ⭐⭐⭐ ROZDZ. 3 — PRZEWÓZ, PRZYWÓZ, WYWÓZ, CUDZOZIEMCY (art. 34-44a)
— ROZWINIĘTE 2026-08-19, naprawa F-92 (dotąd wyłącznie szkic)

```
⭐ ZASADA OGÓLNA PRZEWOZU PRZEZ TERYTORIUM RP (art. 34):
  → §1: przewóz broni i amunicji PRZEZ terytorium RP — na podstawie
    ZAŚWIADCZENIA wydanego przez właściwego KONSULA RP
  → §2: WYJĄTEK — obywatele państwa członkowskiego UE posiadający
    Europejską Kartę Broni Palnej (EKB) NIE potrzebują zaświadczenia
    konsula (art. 34 §2)
  → art. 35 — przewożenie środkami transportu PUBLICZNEGO — zasady
    szczególne (⚠️ treść §2 i n. NIEUSTALONA w tej sesji)

⭐⭐ PRZYWÓZ/WYWÓZ PRZEZ CUDZOZIEMCÓW Z MISJI DYPLOMATYCZNYCH
  (art. 39-41, dot. osób z art. 39 [członkowie misji dyplomatycznych,
  urzędów konsularnych] i art. 40 [ochrona misji/delegacji]):
  → art. 41 §1: wymaga UPRZEDNIEGO zaświadczenia KONSULA RP —
    zaświadczenie ZASTĘPUJE pozwolenie na broń na okres DO 30 DNI
    od dnia przywozu
  → §1a: po upływie terminu ważności — broń i amunicja podlegają
    NIEZWŁOCZNEMU złożeniu do DEPOZYTU organu Policji właściwego
    ze względu na miejsce pobytu cudzoziemca
  → §3: w SZCZEGÓLNIE UZASADNIONYCH przypadkach właściwy organ
    POLICJI (nie konsul) może wydać zaświadczenie zastępcze +
    uprawniające do wywozu, na okres NIE DŁUŻSZY niż 14 DNI
  → zaświadczenia wydaje się PO uzyskaniu POZYTYWNEJ OPINII
    Komendanta Służby Ochrony Państwa (SOP)

⭐⭐ PRZYWÓZ/WYWÓZ PRZEZ CUDZOZIEMCÓW W CELACH ŁOWIECKICH/SPORTOWYCH
  (art. 42):
  → §1-2: cudzoziemcy mogą przywozić/wywozić broń ODPOWIADAJĄCĄ
    celom ŁOWIECKIM oraz amunicję
  → §3: dla cudzoziemców SPOZA art. 39/40 — na podstawie ZAŚWIADCZENIA
    konsula RP, zastępującego pozwolenie na DO 30 DNI od przywozu
  → §5: OBYWATELE UE mogą pominąć tryb konsularny — wystarczy
    Europejska Karta Broni Palnej, JEŚLI broń jest w niej wpisana
    I cudzoziemiec uzasadni cel podróży z bronią
  → §6: przywóz/wywóz broni w INNYCH celach niż łowieckie/sportowe
    przez obywateli UE — na podstawie WPISU w EKB dokonanego przez
    właściwe władze

⭐⭐ NABYWANIE I WYWÓZ PRZEZ CUDZOZIEMCÓW SPOZA UE (art. 43) —
  cudzoziemcy NIEBĘDĄCY obywatelami UE i NIEWYMIENIENI w art. 39
  mogą NABYWAĆ i WYWOZIĆ broń/amunicję, jeżeli otrzymali:
  1) zaświadczenie UPRAWNIAJĄCE do nabycia określonego rodzaju
     i liczby egzemplarzy broni/amunicji, ORAZ
  2) zgodę NA WYWÓZ z terytorium RP — obie wydawane przez
     KOMENDANTA WOJEWÓDZKIEGO POLICJI właściwego ze względu na
     miejsce nabycia broni

⭐ REJESTR DANYCH OSOBOWYCH CUDZOZIEMCÓW (art. 43 §6, dot. osób
  z art. 39, 40, 42 §1-2, 43 §1) — obejmuje: nazwisko, imię, miejsce
  i datę urodzenia, adres — ⚠️ pełny katalog danych NIEUSTALONY
  w tej sesji, wymaga odczytu przy sprawie

⭐ WZORY DOKUMENTÓW (art. 44) — ✅ ROZPORZĄDZENIE ZIDENTYFIKOWANE
  2026-08-19n (F-92): rozporządzenie Ministra Spraw Wewnętrznych
  i Administracji w sprawie wzorów dokumentów dotyczących przewozu
  przez terytorium RP, przywozu z zagranicy i wywozu za granicę broni
  i amunicji — **Dz.U. 2024 poz. 503**, WYDANE na podstawie art. 44
  ustawy o broni i amunicji w brzmieniu Dz.U. z 2024 r. poz. 485
  (t.j. ustawy na dzień wydania rozporządzenia — ⚠️ może być nieaktualny
  wobec nowelizacji z 2025/2026 wykrytych wcześniej przy zamykaniu
  kontroli nowelizacji F-92, do potwierdzenia przy sprawie).
  ✅ VER: 2026-08-19 (infor.pl, prawo.pl — zgodne co do numeru Dz.U.
  i daty). ZASTĄPIŁO poprzednie rozporządzenie z 20.02.2012 (Dz.U.
  poz. 213), które utraciło moc.
  ⚠️ Dokładna liczba i numeracja załączników (wzorów) W NOWYM
  rozporządzeniu z 2024 r. NIEUSTALONA w tej sesji — poprzednie
  rozporządzenie z 2000 r. miało 5 wzorów (przewóz przez RP; przywóz
  własny obywateli PL; przywóz/wywóz cudzoziemców; zaświadczenie
  zastępcze + wywóz; nabycie przez cudzoziemców) — struktura MOŻE,
  ale nie musi być identyczna w wersji 2024.

⭐ AMUNICJA MIĘDZY PAŃSTWAMI UE (art. 44a) — ODESŁANIE: przemieszczanie
  amunicji przez granice WEWNĘTRZNE państw UE i stowarzyszonych, przez
  PRZEDSIĘBIORCĘ/przedsiębiorcę zagranicznego — regulowane ODRĘBNIE,
  ustawą z 21.06.2002 o materiałach wybuchowych przeznaczonych do
  użytku cywilnego (poza zakresem tego modułu)

⚠️ NIEOPRACOWANE w tej sesji, do rozwinięcia przy sprawie:
  □ art. 36-38 (przywóz z państw UE / spoza UE — tryb dla OSÓB
    FIZYCZNYCH niebędących cudzoziemcami uprzywilejowanymi wyżej)
  □ art. 39-40 pełna treść definicyjna (kto dokładnie należy do
    kategorii misji dyplomatycznych/ochrony delegacji)
  □ art. 35 §2 i n. (szczegóły przewozu środkami transportu publicznego)
  □ Europejska Karta Broni Palnej — pełna procedura wydania w Polsce
    (odesłanie do art. 10a w Rozdz. 2, tu tylko przywołane)

Źródła: lexlege.pl (art. 34, 41, 42, 43, 44, 44a — dosłowne brzmienie),
granica.gov.pl (Straż Graniczna — potwierdza tryb dla cudzoziemców),
klzeran.pl (koło łowieckie, tekst art. 34-35 zgodny) — 3+ źródła
zgodne. ⚠️ Aktualny tekst jednolity ustawy o broni i amunicji NIE zweryfikowany
w tej sesji — przed cytowaniem w piśmie potwierdzić numer Dz.U. na
isap.sejm.gov.pl (moduł macierzysty MAPA-AKTOW dr-13 zawiera już
weryfikowany numer z sesji 2026-08-16 — sprawdzić tam, nie zgadywać).
```

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
  „Dz.U.2024.0.485 t.j."; struktura rozdziałów potwierdzona krzyżowo.  <!-- zapis źródła cytowany dosłownie — CELOWO nieujednolicony (F-125, 2026-08-24d) -->

## ⚠️ NIEZWERYFIKOWANE — DO USTALENIA PRZY SPRAWIE

```
□ ✅ CZĘŚCIOWO ZAMKNIĘTE (F-92, 2026-08-19): kontrola nowelizacji po t.j.
  2024.485 wykonana — DWIE nowelizacje potwierdzone (Dz.U. 2025 poz. 1795,
  Dz.U. 2026 poz. 187 art. 137 zmieniający art. 15c ust. 1 pkt 1). Pozostaje:
  dokładna nowa treść art. 15c ust. 1 pkt 1 po podstawieniu; czy art. 137
  ustawy 2026.187 wszedł już w życie (ustawa co do zasady wchodzi w życie
  19.05.2028 z wyjątkami — objęcie art. 137 wyjątkiem NIE sprawdzone);
  zakres zmian wniesionych przez Dz.U. 2025 poz. 1795 w treść samej ustawy
  o broni i amunicji (tylko fakt objęcia potwierdzony, nie artykuły)
□ Rozporządzenia wykonawcze: przechowywanie/noszenie/ewidencja (art. 32 ust. 2),
  wzory dokumentów (art. 31), tryb egzaminu (art. 16 ust. 3), wykaz stanów
  chorobowych (art. 15 ust. 9), wzorcowy regulamin strzelnic (art. 46 ust. 3)
□ Rozdz. 3 (art. 34-44a) — ROZWINIĘTY 2026-08-19 (F-92, sekcja 7a); pozostaje
  wyłącznie: art. 36-38 (przywóz os. fizycznych spoza kategorii uprzywilejowanych),
  art. 39-40 pełna treść, art. 35 §2+ (transport publiczny), pełna procedura EKB
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

**1.1 (2026-08-19, F-92):** Kontrola nowelizacji po t.j. 2024.485 wykonana
(web_search, obejście blokady ISAP zgodnie z ZASADĄ 14 audytu). Ustalono
DWIE nowelizacje: Dz.U. 2025 poz. 1795 (ustawa o zdrowiu zwierząt, fakt objęcia
potwierdzony, artykuły nie zweryfikowane) i Dz.U. 2026 poz. 187 (ustawa o zawodzie
psychologa, art. 137 zmienia art. 15c ust. 1 pkt 1 — wymóg dyplomu psychologa
upoważnionego zastąpiony odesłaniem do nowego reżimu kwalifikacji zawodowych).
Potwierdzone bezpośrednio w tekście ustawy nowelizującej (przepisy.gofin.pl).
Nowa treść pkt 1 po podstawieniu oraz status wejścia w życie art. 137 (ustawa
co do zasady wchodzi w życie 19.05.2028, z wyjątkami dla części przepisów —
przynależność art. 137 do wyjątku NIE ustalona) pozostają do sprawdzenia przy
konkretnej sprawie. Zaktualizowano nagłówek HARDGATE i listę NIEZWERYFIKOWANE.

---
name: mod-AD-akcyza-clo

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł podatku akcyzowego. Stosuj ZAWSZE gdy użytkownik pyta o:
  - podatek akcyzowy (wyroby energetyczne, alkohol, tytoń, energia elektryczna,
    samochody osobowe) — stawki, zwolnienia, procedury, składy podatkowe
  - wiążącą informację akcyzową (WIA)
  - naruszenia celno-akcyzowe (KKS — kwalifikator karny-skarbowy)
  Cło, UCC, Nomenklatura Scalona (CN), WIT, wartość celna, FTA/GSP →
  `mod-UCC-clo-taryfa-celna.md` (wydzielony 2026-06-14).
  Powiązane: mod-Q (PIT/VAT/CIT), mod-AC (REACH/chemikalia), mod-L (gospodarcze).
compatibility:
  tools:
    - web_search
    - web_fetch
---

# mod-AD — Akcyza: Podatek Akcyzowy / WIA / KKS

## AKTY PRAWNE — WERYFIKUJ NA ISAP

| Akt | Oznaczenie | Przedmiot |
|-----|-----------|-----------|
| Ustawa akcyzowa | Dz.U. 2026 poz. 412 t.j. (⚠️ POPRAWIONE 2026-08-11: było przestarzałe "2025 poz. 126" — nowy t.j. obowiązuje od 27.03.2026, potwierdzone w 3+ zgodnych źródłach, w tym inforlex.pl z dosłownym cytatem "Wersja obowiązująca od 2026.03.27") | Podatek akcyzowy PL |
| Dyrektywa akcyzowa | 2020/262/UE (Energy Tax Dir.) | Harmonizacja UE — wyroby energet. |
| Dyrektywa 92/83/EWG | zmieniona 2020/1151/UE | Harmonizacja — alkohol |
| KKS | Dz.U. 2025 poz. 633 t.j. | Kodeks karny skarbowy |

> Cło, UCC, Nomenklatura Scalona (CN), TARIC, WIT, wartość celna, preferencje
> FTA/GSP → `mod-UCC-clo-taryfa-celna.md`.

> ⚠ Stawki akcyzy zmieniają się co roku — weryfikuj zawsze.

---

### ⭐⭐ WYROBY WĘGLOWE I GAZOWE (CELE OPAŁOWE) — LUKA UZUPEŁNIONA
2026-08-11, na żądanie użytkownika (zbadanie pełnego pokrycia
tematu akcyzy)

```
⚠️ TEN TEMAT był DOTĄD CAŁKOWICIE NIEOBECNY w module — odrębna od
  paliw silnikowych/LPG kategoria akcyzowa (Dział II rozdz. 6
  ustawy akcyzowej), obejmująca węgiel/koks/wyroby węglopodobne
  (art. 31a) oraz gaz ziemny na cele OPAŁOWE, NIE do napędu
  pojazdów (art. 31b) — TU akcyza działa GŁÓWNIE poprzez SYSTEM
  ZWOLNIEŃ, nie stawek do zapamiętania

⭐⭐ KLUCZOWE ZWOLNIENIE (dotyczy WIĘKSZOŚCI zwykłych obywateli):
  gospodarstwa domowe NABYWAJĄCE i ZUŻYWAJĄCE wyroby węglowe/gazowe
  NA WŁASNE cele opałowe — ZWOLNIONE Z AKCYZY CAŁKOWICIE (art. 31a
  ust. 1 pkt 3 dla węgla, art. 31b ust. 1 dla gazu) — RÓWNIEŻ
  zwolnione: organy administracji publicznej, jednostki Sił
  Zbrojnych RP, podmioty systemu oświaty, żłobki/kluby dziecięce

⭐ WARUNKI FORMALNE zwolnienia (WAŻNE dla osób fizycznych):
  → przy zakupie WĘGLA: obowiązek OKAZANIA sprzedawcy dowodu
    osobistego/innego dokumentu tożsamości — ODMOWA okazania
    dokumentu = sprzedawca MUSI doliczyć akcyzę
  → przy zakupie GAZU: wymagane OŚWIADCZENIE nabywcy, że NIE używa
    wyrobów na inne cele niż prowadzenie gospodarstwa domowego
    (w tym NIE na działalność gospodarczą) — LUB oświadczenie o
    PROPORCJI zużycia na inne cele (dla lokali MIESZANYCH,
    mieszkalno-usługowych)

⭐ SPÓŁDZIELNIE/WSPÓLNOTY MIESZKANIOWE: MOGĄ korzystać ze
  zwolnienia JAKO "finalny nabywca węglowy działający w IMIENIU"
  mieszkańców, PROWADZĄCYCH gospodarstwa domowe — ALE TYLKO w
  zakresie, w JAKIM wyroby faktycznie służą OGRZANIU lokali
  MIESZKALNYCH — część zużycia na cele KOMERCYJNE (np. lokal
  usługowy we wspólnocie) NIE JEST objęta zwolnieniem, wymaga
  proporcjonalnego rozliczenia

⚠️ BRAK ZWOLNIENIA — PODMIOTY WYNAJMUJĄCE: podmioty, które
  WYNAJMUJĄ lokale/nieruchomości W RAMACH działalności gospodarczej
  (np. najem krótkoterminowy jako biznes) NIE SĄ uprawnione do
  nabywania wyrobów węglowych ZE zwolnieniem "na cele opałowe
  gospodarstw domowych" — nawet jeśli OSTATECZNIE korzystają z tego
  ciepła osoby prywatne (najemcy)

TERMIN POWSTANIA OBOWIĄZKU PODATKOWEGO (gdy akcyza JEST należna, bo
  zwolnienie nie ma zastosowania): jeśli sprzedaż węgla
  UDOKUMENTOWANA fakturą — obowiązek powstaje z DNIEM WYSTAWIENIA
  faktury, NIE PÓŹNIEJ niż w 7. DNIU od dnia WYDANIA wyrobów

⭐ ZAKŁAD ENERGOCHŁONNY (odrębna kategoria zwolnienia
  PRZEDSIĘBIORCÓW, NIE gospodarstw domowych): podmiot wykorzystujący
  wyroby gazowe MOŻE kwalifikować się do zwolnienia jako "zakład
  energochłonny" — z WYMOGIEM osiągnięcia określonego PROCENTOWEGO
  udziału kosztów wyrobów gazowych w wartości produkcji — PRZY
  NIEOSIĄGNIĘCIU progu na koniec PIERWSZEGO roku działalności —
  obowiązek ZAPŁATY akcyzy w I KWARTALE KOLEJNEGO roku, WRAZ Z
  ODSETKAMI

Potwierdzone w 6+ zgodnych źródłach (arslege.pl [dosłowny tekst art.
31b], inforlex.pl [dosłowny tekst art. 31a, z aktualnym t.j.],
podatekakcyzowy.pl [×2], e-prawnik.pl [interpretacja KIS],
poradnikprzedsiebiorcy.pl).
```

---

### ⭐⭐⭐ WYROBY NIKOTYNOWE / E-PAPIEROSY — NOWA, DOTĄD NIEOBECNA
KATEGORIA (dodano 2026-08-11, na żądanie użytkownika — kontynuacja
badania pełnego pokrycia akcyzy)

```
⚠️ TO GENUINE, DUŻA LUKA która ISTNIAŁA w module — CAŁA kategoria
  wyrobów nikotynowych/waporyzacyjnych, objęta MASOWĄ reformą
  wprowadzaną ETAPOWO na przestrzeni 2025-2027 ("mapa akcyzowa"),
  BYŁA CAŁKOWICIE NIEOBECNA

PODSTAWA PRAWNA: art. 99ca-99cc ustawy akcyzowej (nowe przepisy,
  Dz.U.2026.412 t.j., Dział 4 rozdz. 3) — potwierdzone BEZPOŚREDNIO
  dosłownym tekstem (OpenLEX/sip.lex.pl)

⭐⭐ HARMONOGRAM WEJŚCIA W ŻYCIE (dwuetapowy, WAŻNE dla oceny
  aktualnego stanu):
  → Urządzenia do waporyzacji + płyn w JEDNORAZOWYCH e-papierosach:
    obowiązek oznaczania znakami akcyzy OD 1.07.2025 r., z okresem
    PRZEJŚCIOWYM na wyprzedaż zapasów NIEOZNACZONYCH do **31.08.2025**
  → Saszetki nikotynowe + inne wyroby nikotynowe + BEZTYTONIOWE
    wyroby nowatorskie: okres przejściowy do **30.04.2026** — TA
    KATEGORIA MIAŁA więc DŁUŻSZY czas na dostosowanie

⭐⭐ STAWKI (mapa akcyzowa 2025→2026→2027, wzrost stopniowy —
POTWIERDZONE w 6+ zgodnych źródłach dla WIĘKSZOŚCI pozycji):
  → PŁYN do e-papierosów: 0,96 zł/ml (2025) → **1,44 zł/ml (2026)**
    → 1,80 zł/ml (2027) — wzrost potwierdzony JEDNOGŁOŚNIE, wysoka
    pewność
  → JEDNORAZOWE e-papierosy: DODATKOWA, RYCZAŁTOWA stawka ~40 zł ZA
    SZTUKĘ urządzenia (NIEZALEŻNIE/OBOK stawki za zawarty płyn —
    OBIE stawki SUMUJĄ SIĘ)
  → URZĄDZENIA do waporyzacji (WIELORAZOWE — podgrzewacze,
    urządzenia wielofunkcyjne): **40,00 zł/sztukę** — art. 99ca ust.
    4/5, potwierdzone BEZPOŚREDNIO dosłownym tekstem przepisu
  → ZESTAWY CZĘŚCI do urządzeń do waporyzacji: **40,00 zł/sztukę**
    (art. 99cb ust. 2) — potwierdzone BEZPOŚREDNIO dosłownym
    tekstem przepisu — TA SAMA stawka co całe urządzenie
  → SASZETKI NIKOTYNOWE: ⚠️ ROZBIEŻNOŚĆ ŹRÓDEŁ, NIE ROZSTRZYGNIĘTA —
    część źródeł podaje mapę 150→200→250 zł/kg (2025-2027), INNE
    100→150(?)→300 zł/kg — ALE ⭐ dosłowny tekst przepisu (OpenLEX,
    art. 99cc ust. 5) POTWIERDZA RELACJĘ, NIE kwotę absolutną:
    "stawka akcyzy na saszetki nikotynowe wynosi DWUKROTNOŚĆ stawki,
    o której mowa w ust. 4" [ust. 4 = stawka urządzeń do
    waporyzacji, 40 zł] — SUGERUJE to WYLICZENIE relatywne, nie
    zapamiętaną kwotę — ⚠️ PRZED cytowaniem KONKRETNEJ kwoty w zł/kg
    dla saszetek, ZAWSZE zweryfikuj NA ISAP art. 99cc w AKTUALNYM
    brzmieniu, ZAMIAST polegać na medialnych "mapach akcyzowych",
    które WZAJEMNIE SIĘ NIE ZGADZAJĄ
  → WYROBY NOWATORSKIE (podgrzewane wyroby tytoniowe, np. IQOS):
    565,52 zł/kg (2025) + **20% podwyżka w 2026 r.** (razem z
    papierosami tradycyjnymi +20%, tytoniem do palenia +30%, cygara/
    cygaretki +20%, płynem do e-papierosów +50% w skali roku —
    OBWIESZCZENIE Ministerstwa Finansów, potwierdzone w 4+ zgodnych
    źródłach z grudnia 2025)

⭐ DEFINICJA "WYROBÓW NOWATORSKICH" — ROZSZERZONA nowelizacją: NIE
  TYLKO wyroby ZAWIERAJĄCE tytoń (jak w poprzednim stanie prawnym) —
  TERAZ OBEJMUJE również produkty dostarczające AEROZOL powstający z
  PODGRZEWANIA tytoniu BEZ spalania w specjalnie dostosowanych
  urządzeniach — ROZSZERZENIE miało na celu OBJĄĆ nowe produkty
  rynkowe, które WCZEŚNIEJ mogły UMYKAĆ dotychczasowej, węższej
  definicji

⭐ CEL DEKLAROWANY (Ministerstwo Finansów, oceny skutków regulacji):
  OGRANICZENIE dostępności CENOWEJ, SZCZEGÓLNIE dla MŁODZIEŻY —
  cytowane dane: "nawet 70% nastolatków sięga po e-papierosy" —
  RETORYKA analogiczna do uzasadnienia wcześniej opisanych w tym
  systemie regulacji zdrowia publicznego

⭐ OBOWIĄZEK SKŁADU PODATKOWEGO: dla NIEKTÓRYCH podmiotów
  (SZCZEGÓLNIE producentów wyrobów nowatorskich i innych NOWYCH
  kategorii) wprowadzono WYMÓG prowadzenia działalności W SKŁADZIE
  PODATKOWYM — dodatkowy, ISTOTNY obowiązek organizacyjny/
  proceduralny dla przedsiębiorców z tej branży

Potwierdzone w 8+ zgodnych źródłach 2025-2026 (OpenLEX/sip.lex.pl
[Rząd 1-adjacent, dosłowny tekst przepisu — NAJWYŻSZA wiarygodność],
politykazdrowotna.com, portal.abczdrowie.pl, podatnik.info,
portalspozywczy.pl [×2], money.pl, pro-log.com.pl [×2, z jednym
źródłem z marca 2026 — stosunkowo świeże], kancelariapiotrowski.pl).
```

---

### ⭐⭐⭐ OLEJ OPAŁOWY vs NAPĘDOWY — RÓŻNICA STAWEK I MECHANIZM
PRZECIWDZIAŁANIA OSZUSTWOM (dodano 2026-08-11, na żądanie
użytkownika — kontynuacja badania pełnego pokrycia akcyzy)

```
⭐⭐ ISTOTA PROBLEMU: olej opałowy (do ogrzewania) i olej napędowy (do
  napędu pojazdów) są CHEMICZNIE BARDZO ZBLIŻONE — olej opałowy
  MOŻNA technicznie wlać wprost do baku pojazdu — ALE opodatkowane
  są RADYKALNIE różnymi stawkami akcyzy, WŁAŚNIE ZE WZGLĘDU na
  PRZEZNACZENIE (cel opałowy = preferencyjna, niska stawka; cel
  napędowy = pełna, wysoka stawka) — TA różnica jest GŁÓWNYM
  MOTOREM oszustw akcyzowych w tym obszarze

⭐ RZĄD WIELKOŚCI RÓŻNICY (orientacyjny, ⚠️ WERYFIKUJ aktualne
  stawki — źródła miały różne daty):
  → Olej napędowy (pełna stawka, cel napędowy): ok. 1048-1458 zł/
    1000 l (akcyza + opłata paliwowa łącznie, wg MF)
  → Olej napędowy PRZEZNACZONY do celów OPAŁOWYCH (zabarwiony na
    CZERWONO + oznaczony znacznikiem): TYLKO 232,00 zł/1000 l
  → RÓŻNICA: olej "opałowy" jest OK. 4-6 RAZY TAŃSZY niż olej do
    napędu — STĄD silna pokusa nadużycia

⭐⭐ MECHANIZM ZNAKOWANIA I BARWIENIA (art. 90 ustawy akcyzowej) —
  GŁÓWNE narzędzie zapobiegawcze:
  → OBOWIĄZKOWI: podmioty prowadzące składy podatkowe, importerzy,
    podmioty dokonujące nabycia wewnątrzwspólnotowego,
    przedstawiciele podatkowi
  → CO PODLEGA znakowaniu/barwieniu: (1) oleje opałowe określonych
    kodów CN/gęstości, (2) oleje napędowe PRZEZNACZONE na cele
    opałowe, (3) oleje napędowe używane do CELÓW ŻEGLUGI (w tym
    rejsów rybackich)
  → ZNACZNIK CHEMICZNY: obecnie ACCUTRACE™ PLUS (zawiera
    butoksybenzen) — od rozporządzenia MF z 28.11.2022, zastąpił
    wcześniejszy znacznik Solvent Yellow 124 (okres przejściowy
    zakończył się 18.01.2024) — WYKRYWALNY specjalnymi testami
    laboratoryjnymi
  → WIZUALNIE: dodatkowo barwienie na CZERWONO dla łatwej
    identyfikacji "na oko" (obok NIEWIDOCZNEGO znacznika chemicznego)

⭐⭐ DRUGI FILAR — MECHANIZM OŚWIADCZEŃ (dla obrotu olejem opałowym):
  → SPRZEDAWCA MUSI uzyskać od NABYWCY pisemne OŚWIADCZENIE o
    przeznaczeniu oleju NA CELE OPAŁOWE — z danymi
    UMOŻLIWIAJĄCYMI IDENTYFIKACJĘ nabywcy (⭐ TK potwierdził
    KONSTYTUCYJNOŚĆ tego wymogu — sam fakt otrzymania oświadczenia
    NIEUMOŻLIWIAJĄCEGO identyfikacji nabywcy = TAK, jakby
    oświadczenia W OGÓLE nie było)
  → SPRZEDAWCA MUSI dołączyć oświadczenie do dokumentów ORAZ
    złożyć MIESIĘCZNE zestawienie zebranych oświadczeń do organu
    podatkowego

⭐⭐⭐ SANKCJE — DWUTOROWE, RÓŻNI ADRESACI (KLUCZOWE rozróżnienie):

  (A) SANKCYJNA STAWKA AKCYZY (odpowiedzialność PODATKOWA,
      NIEZALEŻNIE od winy):
      → **1822,00 zł/1000 litrów** (⚠️ dla olejów o gęstości ≥890
        kg/m³ w 15°C — STAWKA MOŻE różnić się dla innych parametrów,
        weryfikuj przed cytowaniem) — TA sankcyjna stawka jest
        WYŻSZA nawet niż zwykła, PEŁNA stawka na olej napędowy!
      → ZASTOSOWANIE: (a) gdy olej NIE SPEŁNIA wymogów znakowania/
        barwienia, LUB (b) gdy SPRZEDAWCA nie posiada PRAWIDŁOWYCH
        oświadczeń, A JEDNOCZEŚNIE okazało się, że nabywca zużył
        olej NIEZGODNIE z przeznaczeniem — ⭐ REALNY PRZYKŁAD z
        praktyki (rp.pl): spółka sprzedała lekki olej opałowy BEZ
        uzyskania oświadczenia — nabywca (firma przewozowa BEZ
        żadnego urządzenia grzewczego) wykorzystał go JAKO paliwo
        silnikowe — sankcyjna stawka 1822 zł/1000 l ZASTOSOWANA

  (B) ODPOWIEDZIALNOŚĆ KARNA SKARBOWA (KKS, art. 65 ust. 1a — dla
      NABYWCY, GDY sprzedawca dopełnił WSZYSTKICH formalności):
      → KARA: grzywna DO 720 STAWEK DZIENNYCH, ALBO pozbawienie
        wolności DO 2 LAT, ALBO OBIE kary ŁĄCZNIE
      → ⭐⭐ KLUCZOWE ROZRÓŻNIENIE ADRESATA: jeśli SPRZEDAWCA
        prawidłowo uzyskał oświadczenie (dopełnił formalności), a
        TO NABYWCA następnie użył oleju niezgodnie z deklarowanym
        przeznaczeniem — ODPOWIEDZIALNOŚĆ KARNA spada na NABYWCĘ,
        NIE na sprzedawcę — sprzedawca, który dochował należytej
        staranności formalnej, jest CHRONIONY

⭐ ORZECZNICTWO — ZNAKOWANIE JAKO WARUNEK PODSTAWOWY, NIE POMOCNICZY:
  WSA Szczecin (I SA/Sz 348/21, 17.06.2021): uchybienie WYMOGOM
  znakowania/barwienia PRZED nadaniem przeznaczenia STWARZA RYZYKO
  wykorzystania oleju do INNYCH celów — BŁĘDNY jest pogląd, że
  znakowanie ma jedynie POMOCNICZY charakter, a "faktyczne
  wykorzystanie" (np. rzeczywiste zużycie do żeglugi) TŁUMACZY
  uchybienia formalne — ⭐ HIERARCHIA warunków: znakowanie/barwienie
  = warunek PODSTAWOWY (musi być spełniony NAJPIERW); zabezpieczenie
  akcyzowe, ewidencja, dokument dostawy = warunki POMOCNICZE
  (formalne), NASTĘPUJĄCE PO warunku podstawowym

⭐ TRYBUNAŁ KONSTYTUCYJNY — RYGORYZM UZNANY ZA ZGODNY Z KONSTYTUCJĄ:
  TK potwierdził, że USTAWODAWCA MA PRAWO stawiać RYGORYSTYCZNE
  warunki korzystania z preferencyjnej stawki (w tym wymóg
  IDENTYFIKUJĄCEGO oświadczenia, wymóg TERMINOWEGO miesięcznego
  zestawienia) — CEL: ograniczenie oszustw podatkowych i
  uszczuplania budżetu państwa — SUROWOŚĆ regulacji NIE JEST
  nadmierną ingerencją w prawa podatnika (art. 20, 22, 64 ust. 1 i 3
  w zw. z art. 31 ust. 3, art. 2 i art. 84 Konstytucji)

Potwierdzone w 6+ zgodnych źródłach (infor.pl [×3, w tym
bezpośrednio wyjaśnienia MF], rp.pl/PRO, isp-modzelewski.pl [z
cytowanym wyrokiem WSA], trybunal.gov.pl [Rząd 1, komunikat
prasowy], poradypodatkowe.pl, dziewonska-architekt.pl).
```

---

### ⭐ AUTOMATY DO SAMODZIELNEGO WYTWARZANIA PAPIEROSÓW — HISTORYCZNA
LUKA PRAWNA, ZAMKNIĘTA REFORMĄ 2015 R. (dodano 2026-08-11, na
żądanie użytkownika — case study ilustrujący WZORZEC "znajdź lukę →
zamknij lukę", przydatny do rozpoznawania PODOBNYCH schematów)

```
⚠️ TEN TEMAT jest GŁÓWNIE HISTORYCZNY — LUKA ZAMKNIĘTA od
  1.01.2015 R. — opisany TU jako WZORZEC rozumowania, PRZYDATNY przy
  ocenie PODOBNYCH, NOWYCH prób obejścia (np. potencjalnie
  analogiczne schematy wobec NOWSZYCH kategorii akcyzowych opisanych
  wyżej — wyroby nikotynowe/nowatorskie)

⭐ SCHEMAT (jak działał, przed 2015 r.): sklepy sprzedawały LUŹNY
  tytoń (czasem CELOWO "mokry", wymagający suszenia) ORAZ
  UDOSTĘPNIAŁY automaty do samodzielnego nabijania gilz — z
  ZAŁOŻENIEM prawnym, że TO KLIENT (nie sklep) "produkuje" papierosy
  NA WŁASNY UŻYTEK, dzierżawiąc maszynę na czas czynności — SKUTEK:
  opłacano NISKĄ stawkę na tytoń do palenia/susz, ZAMIAST znacznie
  WYŻSZEJ stawki na gotowe papierosy

⭐ WYKORZYSTANA LUKA PRAWNA: ustawa akcyzowa (przed 2015 r.) NIE
  ZAWIERAŁA legalnej definicji "suchego tytoniu" — SĄDY, stosując
  ZASADĘ PIERWSZEŃSTWA wykładni JĘZYKOWEJ (szczególnie WAŻNEJ przy
  przepisach o charakterze fiskalnym — NIE WOLNO obciążać obywateli
  na podstawie DOMNIEMANYCH intencji ustawodawcy, gdy BRAK
  jednoznacznej definicji ustawowej), WIELOKROTNIE przyznawały
  RACJĘ przedsiębiorcom wykorzystującym TĘ lukę — MIMO że organy
  podatkowe (Izba Celna) KONSEKWENTNIE się z tym NIE ZGADZAŁY i
  REKWIROWAŁY automaty

⭐ STANOWISKO MF (przed reformą): udostępnianie maszyn klientowi w
  punkcie sprzedaży detalicznej NALEŻY UZNAĆ za "OBEJŚCIE
  przepisów" poprzez "FIKCYJNE uczynienie przedmiotem sprzedaży
  tytoniu... W SYTUACJI GDY faktycznie DOKONYWANA jest produkcja i
  sprzedaż papierosów" — argumentacja SUBSTANCE-OVER-FORM,
  NIESKUTECZNA jednak DOPÓKI brakowało wyraźnej podstawy ustawowej

⭐⭐ REFORMA — ZAMKNIĘCIE LUKI OD 1.01.2015 R. (DWA jednoczesne
  mechanizmy):
  1) NOWA DEFINICJA "produkcji": ZA produkcję papierosów NIE UZNAJE
     SIĘ WYŁĄCZNIE wytwarzania RĘCZNIE, "domowym sposobem", w
     GOSPODARSTWACH DOMOWYCH — a contrario: WYTWARZANIE PRZY UŻYCIU
     MASZYNY, ZWŁASZCZA W PUNKCIE HANDLOWYM (NIE w prywatnym domu),
     JEST TRAKTOWANE jak produkcja papierosów, PODLEGAJĄCA akcyzie
     NA ZASADACH OGÓLNYCH
  2) LEGALNE wytwarzanie PRZY UŻYCIU maszyn TYLKO w punktach
     ZAREJESTROWANYCH jako "SKŁAD PODATKOWY", z PODANYM imieniem i
     nazwiskiem/nazwą podmiotu PROWADZĄCEGO — ⭐ TEN SAM mechanizm
     ("skład podatkowy" jako WARUNEK legalności) POWTÓRZONY później
     w REFORMIE wyrobów nikotynowych z 2025-2027 (patrz sekcja
     wyżej) — SPÓJNY, POWTARZALNY wzorzec legislacyjny w tej
     dziedzinie prawa

⭐ SANKCJE za NIELEGALNE (POZA składem podatkowym) użycie maszyn:
  KONFISKATA urządzeń + akcyza ok. **16 zł OD PACZKI** (20 szt.) +
  grzywna **175 zł — 35 000 zł**

⭐ DODATKOWA, RÓWNOLEGŁA korekta definicyjna: "susz tytoniowy"
  przedefiniowano jako obejmujący tytoń "BEZ WZGLĘDU NA WILGOTNOŚĆ"
  — TO SPECYFICZNIE zamknęło "lukę mokrego tytoniu" wykorzystywaną
  przez firmę opisaną w prasie ("Tanie Papierosy") — argument, że
  "mokry" tytoń formalnie NIE MIEŚCIŁ SIĘ w definicji suszu, PRZESTAŁ
  DZIAŁAĆ

⭐ WNIOSEK METODOLOGICZNY (przydatny przy ocenie NOWYCH schematów):
  ten epizod POKAZUJE typowy CYKL: (1) przedsiębiorca znajduje LUKĘ
  w BRAKU definicji legalnej, (2) sądy STOSUJĄ wykładnię językową
  NA KORZYŚĆ podatnika (zasada in dubio pro tributario przy braku
  jasnej podstawy), (3) organ podatkowy PRZEGRYWA w sądach, MIMO
  merytorycznej racji co do CELU regulacji, (4) USTAWODAWCA
  ZAMYKA lukę PRZEZ nowelizację wprowadzającą PRECYZYJNĄ definicję —
  TEN SAM wzorzec MOŻE się powtórzyć przy NOWYCH kategoriach
  produktów (np. nowe formy dostarczania nikotyny, o CZYM świadczy
  ROZBUDOWANA definicja "wyrobów nowatorskich" w reformie 2025-2027,
  patrz wyżej — PRAWDOPODOBNIE ŚWIADOME zapobieganie POWTÓRZENIU się
  TEGO scenariusza)

Potwierdzone w 5+ zgodnych źródłach, w większości HISTORYCZNYCH z
okresu 2013-2015 (pch24.pl, rp.pl, ksiegowego.pl [z cytowanym
pismem MF i numerem interpelacji poselskiej SPS-023-26404/14],
prawo.pl, bankier.pl [z cytowaną opinią kancelarii Accace Poland]).
```

---

### ⭐⭐ OPŁATA PALIWOWA I OPŁATA EMISYJNA — ODRĘBNE DANINY, NIE
AKCYZA (dodano 2026-08-11, na żądanie użytkownika — dopełnienie
tematu akcyzy paliwowej)

```
⚠️ KLUCZOWE ROZRÓŻNIENIE POJĘCIOWE: OBOK samej akcyzy, na paliwa
  silnikowe (i gaz) NAKŁADANE SĄ RÓWNIEŻ DWIE ODRĘBNE, DODATKOWE
  daniny — CZĘSTO MYLONE Z SAMĄ AKCYZĄ w potocznych zestawieniach
  "akcyza + opłata paliwowa" (jak we WCZEŚNIEJSZEJ notatce w tym
  module dot. oleju napędowego, sekcja wyżej) — WARTO rozróżniać je
  PRECYZYJNIE

⭐⭐ OPŁATA PALIWOWA (ustawa o autostradach płatnych oraz KFD):
  → PODSTAWA UWZGLĘDNIENIA: powstaje RÓWNOCZEŚNIE z obowiązkiem
    akcyzowym — TEN SAM moment (produkcja, WNT, import paliw/gazu,
    a TAKŻE inne czynności prowadzące do naliczenia akcyzy, np.
    przekroczenie dopuszczalnych norm UBYTKÓW)
  → PODMIOT ZOBOWIĄZANY: WPROWADZAJĄCY na rynek (importer/
    wyprowadzający ze składu podatkowego) — ⭐ opłata NIE PRZECHODZI
    formalnie na KOLEJNYCH uczestników łańcucha dostaw (analogicznie
    do konstrukcji NCW — Narodowego Celu Wskaźnikowego — i rezerw
    obowiązkowych)
  → STAWKI NA 2026 R. (obwieszczenie Ministerstwa Infrastruktury z
    8.12.2025, WALORYZOWANE corocznie wg wskaźnika CPI — art. 37m
    ust. 2 ustawy o autostradach płatnych): **210,29 zł/1000 l**
    benzyn silnikowych (+8,09 zł r/r), **453,52 zł/1000 l** olejów
    napędowych (+17,45 zł r/r), **256,75 zł/1000 kg** gazów (+9,88
    zł r/r)
  → MECHANIZM WALORYZACJI: stawki ROSNĄ CO ROKU AUTOMATYCZNIE, wg
    wskaźnika wzrostu cen towarów/usług konsumpcyjnych za PIERWSZE
    TRZY KWARTAŁY roku poprzedniego — NIE wymaga NOWEJ ustawy, TYLKO
    obwieszczenia

⭐ OPŁATA EMISYJNA (odrębna, TRZECIA danina — od 1.01.2019):
  → STAWKA: **80,00 zł/m³** (jednolita, NIEZRÓŻNICOWANA wg rodzaju
    paliwa w dostępnych źródłach — ⚠️ zweryfikuj, czy NIE była
    zmieniana od wprowadzenia)
  → OBOWIĄZEK: przedsiębiorcy WPROWADZAJĄCY na rynek krajowy paliwa
    silnikowe

⭐ PRAKTYCZNA KONSEKWENCJA dla obliczeń: PEŁNY, ŁĄCZNY koszt
  fiskalny litra paliwa = AKCYZA + OPŁATA PALIWOWA + OPŁATA
  EMISYJNA (+ VAT na całość) — TRZY ODRĘBNE, SUMUJĄCE SIĘ elementy,
  NIE tylko sama akcyza — PRZY cytowaniu "łącznego obciążenia
  paliwa" ZAWSZE PRECYZUJ, KTÓRE elementy są uwzględnione

⭐ ⚡ AKTUALNY STATUS PAKIETU "CENY PALIWA NIŻEJ" (CPN) — WYSOKO
  ZMIENNY: potwierdzone WIELOKROTNE, KOLEJNE przedłużenia obniżonej
  stawki VAT+akcyzy w 2026 r. (np. przedłużenie do 31.05.2026,
  KOLEJNE przedłużenie do 15.06.2026 — publikowane W ROZPORZĄDZENIACH
  wchodzących w życie Z DNIEM OGŁOSZENIA) — ⚠️ TEN PAKIET wymaga
  WERYFIKACJI NA BIEŻĄCO, z uwagi na WZORZEC krótkoterminowych,
  POWTARZAJĄCYCH SIĘ przedłużeń — NIE zakładaj z góry ANI że pakiet
  WYGASŁ, ANI że nadal obowiązuje, BEZ świeżego sprawdzenia

Potwierdzone w 6+ zgodnych źródłach, w tym e-petrol.pl [×2, portal
branżowy z aktualnymi notowaniami], forsal.pl [marzec 2026, z
dosłownym cytatem obwieszczenia MI], podatki.biz [czerwiec 2026].
```

---

### ⭐⭐⭐ TAKSONOMIA TECHNIK OBCHODZENIA AKCYZY — SYNTEZA (dodano
2026-08-11, na żądanie użytkownika — ŁĄCZY i UOGÓLNIA schematy
opisane wcześniej [olej opałowy, automaty do papierosów] + DODAJE
nowe kategorie)

```
⭐⭐ STRUKTURALNA PRZYCZYNA WYJĄTKOWEJ OPŁACALNOŚCI OSZUSTW W AKCYZIE
  (opinia prof. Witolda Modzelewskiego, UW — potwierdzona w
  materiale prawo.pl): akcyza ma CHARAKTER REGRESYWNY — DOMINUJĄ
  stawki KWOTOWE (zł/jednostka), NIE procentowe od wartości — SKUTEK:
  WRAZ ZE WZROSTEM skali/wartości sprzedaży, UDZIAŁ podatku w cenie
  MALEJE relatywnie — TO CZYNI oszustwa akcyzowe BARDZIEJ opłacalne
  niż w VAT, "nieporównywalne z niczym innym" wg cytowanej opinii —
  DODATKOWO: produkcja WIĘKSZOŚCI istotnych wyrobów akcyzowych
  (papierosy, spirytus, NAWET paliwa mieszane) MOŻE być zorganizowana
  POZA składem podatkowym PRZY NIEWIELKICH nakładach inwestycyjnych,
  W SPOSÓB ROZPROSZONY — TRUDNIEJSZY do wykrycia niż scentralizowana
  produkcja

⭐⭐⭐ KATALOG GŁÓWNYCH TECHNIK (z przykładami i orientacyjnym stanem
prawnym):

  1) ⭐ ZMIANA PRZEZNACZENIA wyrobu ZAKUPIONEGO ze zwolnieniem/
     preferencyjną stawką — UNIWERSALNY wzorzec, WYSTĘPUJĄCY w
     WIELU kategoriach (już SZCZEGÓŁOWO opisany wyżej dla oleju
     opałowego → napędowego; ANALOGICZNIE możliwy dla wyrobów
     węglowych/gazowych zwolnionych "na cele opałowe gospodarstw
     domowych", jeśli faktycznie idą na cele komercyjne)

  2) ⭐⭐⭐ BŁĘDNA/FAŁSZYWA KLASYFIKACJA TOWARU (kod CN) — DEKLAROWANIE
     wyrobu akcyzowego JAKO innego, NIEOBJĘTEGO akcyzą towaru —
     ⭐⭐ DRAMATYCZNY, HISTORYCZNY PRZYKŁAD ("afera spirytusowa",
     2004-2010): import spirytusu konsumpcyjnego 96% Z UKRAINY,
     DEKLAROWANEGO na granicy JAKO "płyn do spryskiwaczy szyb" —
     BEZ WYMAGANEGO barwnika/skażalnika w rzeczywistości — wg
     wyliczeń celnika: NALEŻNOŚCI z JEDNEJ cysterny POWINNY wynieść
     4,5 MLN ZŁ (30 tys. cło + 3,6 mln akcyza + 870 tys. VAT), a
     ZAPŁACONO jedynie 35 TYS. ZŁ (sam VAT) — SZACUNEK: ok. 80 MLN
     LITRÓW alkoholu w latach 2004-2009 PRZEZ JEDNO przejście
     graniczne (Medyka) — NIK POTWIERDZIŁ straty budżetu BLISKIE 3
     MLD ZŁ za lata 2004-2007 — ⭐ CIEKAWOSTKA: PROCEDER trwał
     NADAL PO reformie z 2007 r. (wprowadzenie WYMOGU DWÓCH,
     zamiast jednego, środków skażających) — pokazuje, że
     PUNKTOWE zaostrzenie przepisów NIE zawsze WYSTARCZA, jeśli
     LUKA klasyfikacyjna pozostaje

  3) ⭐⭐ NADUŻYCIE SKAŻONEGO (DENATUROWANEGO) ALKOHOLU — spirytus
     SKAŻONY (uczyniony niezdatnym do spożycia) jest ZWOLNIONY z
     akcyzy (bo akcyza OBCIĄŻA co do zasady KONSUMPCJĘ napojów
     alkoholowych, NIE alkohol przemysłowy) — TECHNIKI nadużycia:
     (a) "ODKAŻANIE" — częściowe LUB całkowite USUWANIE środka
     skażającego (zakazane WPROST już w przepisach MIĘDZYWOJENNYCH,
     art. o powrotnym uzyskiwaniu spirytusu ze skażonego), (b)
     WYKORZYSTANIE słabszych/łatwiej odwracalnych metod skażania —
     ⭐ NAZWANY PRZYPADEK: "SKAŻANIE SPOSOBEM WĘGIERSKIM" — SŁABSZA
     metoda skażania, UMOŻLIWIAJĄCA łatwiejsze odzyskanie spirytusu
     pitnego — ZDELEGALIZOWANA reformą z 27.05.2017 — ⚠️⚠️ ALE:
     ŚWIEŻE źródło (gazetaprawna.pl, maj 2026) POKAZUJE, że temat
     WCIĄŻ jest AKTYWNY — MF PROPONUJE KOLEJNĄ likwidację zwolnienia
     dla spirytusu skażanego "na sposób węgierski" ORAZ chce
     ŚLEDZIĆ KAŻDĄ dostawę denaturatu z UE — SUGERUJE to, że
     PROBLEM (LUB podobny wariant) MOŻE nadal ISTNIEĆ/POWRACAĆ,
     mimo wcześniejszej reformy z 2017 r. — branża spirytusowa SAMA
     OSTRZEGA przed nadużyciami PO planowanej zmianie — TEMAT
     AKTYWNY na dzień weryfikacji, WYMAGA śledzenia

  4) PRZEMYT (fizyczny, transgraniczny) — techniki: (a) PODANIE
     FAŁSZYWEGO kraju pochodzenia (dla skorzystania z
     preferencyjnych stawek CELNYCH), (b) FIZYCZNE UKRYCIE towaru
     (skrytki w pojazdach), (c) SPRZEDAŻ/magazynowanie/przewóz
     wyrobów akcyzowych (alkohol, papierosy, paliwo) BEZ POLSKICH
     znaków akcyzy (banderol) — NAJCZĘSTSZY zarzut OBOK samego
     przemytu celnego
     → ⭐ ESKALACJA zarzutów przy zorganizowanej działalności: art.
       258 KK (udział w ZORGANIZOWANEJ GRUPIE przestępczej) —
       DRASTYCZNIE zwiększa grożącą karę; DODATKOWO możliwy zarzut
       PRANIA PIENIĘDZY, jeśli dochody z przemytu były
       "legalizowane"; PRZY POŁĄCZENIU z wyłudzeniem zwrotu VAT —
       RÓWNIEŻ zarzuty z zakresu oszustw podatkowych — SPRAWY
       PRZEMYTOWE często WIELOWĄTKOWE, wymagające obrony ZNAJĄCEJ
       CAŁE spektrum prawa celnego + karnego + karnoskarbowego

  5) ⭐ "FIRMY SŁUPY" I BUFORY W ŁAŃCUCHU DOSTAW — MECHANIZM
     ZAADAPTOWANY z klasycznych "karuzeli VAT" (art. przywołany w
     tym module POŚREDNIO), STOSOWALNY ANALOGICZNIE do towarów
     akcyzowych w OBROCIE wewnątrzwspólnotowym — SCHEMAT (na
     przykładzie potwierdzonej sprawy dot. INNEGO towaru, ale
     mechanika PRZENOSZALNA): (a) OSOBY ZWERBOWANE jako "słupy"/
     bufory PODPISUJĄ przygotowane dokumenty/faktury W MIEJSCACH
     PUBLICZNYCH (np. restauracjach), (b) WIĘKSZOŚĆ zaangażowanych
     firm NIE POSIADA żadnego RZECZYWISTEGO zaplecza technicznego
     do faktycznego handlu towarem, (c) towar POZORNIE wywożony za
     granicę (upozorowanie WDT), NASTĘPNIE wprowadzany z powrotem
     PRZEZ spółki pełniące rolę "ZNIKAJĄCYCH PODATNIKÓW", (d)
     ORGANIZATORZY koordynują CAŁOŚĆ (transakcje, płatności,
     transport, obrót fakturowy), pozostając FORMALNIE poza
     bezpośrednim łańcuchem faktur

  6) ⭐ NIELEGALNA PRODUKCJA POZA SKŁADEM PODATKOWYM — DOTYCZY
     WIELU kategorii jednocześnie (papierosy — patrz sekcja o
     automatach wyżej; spirytus etylowy; NAWET paliwa mieszane) —
     WSPÓLNY mianownik: NISKI próg inwestycyjny, MOŻLIWOŚĆ
     rozpoczęcia w STOSUNKOWO krótkim czasie, TRUDNOŚĆ
     zwalczania z uwagi na ROZPROSZENIE geograficzne

⭐ CEL SYSTEMOWY narzędzi PRZECIWDZIAŁANIA (już opisanych wcześniej w
  tym module dla poszczególnych kategorii): znakowanie/barwienie,
  banderole (znaki akcyzy), oświadczenia+identyfikacja nabywcy,
  system EMCS (elektroniczne przemieszczanie), obowiązek "składu
  podatkowego" dla produkcji maszynowej — WSZYSTKIE te mechanizmy
  są ODPOWIEDZIĄ na KONKRETNE, HISTORYCZNIE UDOKUMENTOWANE
  techniki obejścia opisane wyżej — ZROZUMIENIE technik POMAGA
  zrozumieć LOGIKĘ poszczególnych obowiązków formalnych (dlaczego
  akurat TAKI wymóg istnieje)

Potwierdzone w 8+ zgodnych źródłach, w tym akademickich (ojs.tnkul.pl
— czasopismo naukowe, dspace.uni.lodz.pl — praca doktorska UŁ),
opinii eksperckiej (prawo.pl, prof. Modzelewski UW), doniesień
prasowych z konkretnymi wyliczeniami strat (rp.pl, NIK), oraz
BIEŻĄCEGO monitoringu tematu (gazetaprawna.pl, maj 2026 —
potwierdzający, że temat skażonego alkoholu POZOSTAJE aktywny).
```

---

## 1. PODATEK AKCYZOWY — ZAKRES

### Wyroby akcyzowe (art. 2 ustawy akcyzowej)

| Kategoria | Stawka (orientacyjna — weryfikuj!) | Podstawa |
|-----------|-----------------------------------|----------|
| Paliwa silnikowe (benzyna 95) | 1 565,00 zł/1000 l (⚠️ SPRAWDŹ 2026-07-27: rok 2025-2026 miał WIELOKROTNE tymczasowe obniżki akcyzy paliwowej do minimum unijnego w ramach programu "Ceny Paliwa Niżej" (CPN), z kilkoma przedłużeniami — pakiet WYGASŁ 1.07.2026 wg jednego źródła, ale mógł zostać ponownie przedłużony/zmieniony. ⭐ NOWY PUNKT DANYCH (2026-08-11): źródło z 25.06.2026 podaje **1 540,00 zł/1000 l** jako obowiązującą wówczas stawkę — TO INNA wartość niż powyżej, POTWIERDZA ciągłą zmienność — TO NADAL NAJBARDZIEJ ZMIENNA POZYCJA w tej tabeli — zawsze sprawdź aktualne obwieszczenie/rozporządzenie przed cytowaniem, NIE polegaj na ŻADNEJ z powyższych wartości bez świeżej weryfikacji) | Zał. nr 2 u.p.a. |
| Olej napędowy (diesel) | 1 196,00 zł/1000 l (⚠️ TA SAMA zmienność co wyżej — sprawdź aktualnie) | Zał. nr 2 u.p.a. |
| Gaz LPG (do napędu) | 670,00 zł/1000 kg | Zał. nr 2 u.p.a. |
| ⭐ Gaz ziemny CNG/LNG, biogaz, wodór, biowodór (DO NAPĘDU silników spalinowych) | ✅ **0 ZŁ** (STAWKA ZEROWA) — dodano 2026-08-11, na żądanie użytkownika — obowiązuje od 14.08.2019 (ustawa z 4.07.2019, Dz.U. poz. 1520), potwierdzone w 5+ zgodnych źródłach, w tym BEZPOŚREDNIO podatki.gov.pl (Rząd 1) — DOTYCZY: CN 2711 11 00/2711 21 00 (LNG/CNG), biogaz (BEZ WZGLĘDU na kod CN), wodór/biowodór (CN 2804 10 00) — WYŁĄCZNIE gdy PRZEZNACZONE do napędu silników spalinowych — ⭐ RADYKALNA różnica względem LPG (670 zł/1000 kg) — cel: PROMOCJA paliw alternatywnych/niskoemisyjnych | art. dot. gazu ziemnego, u.p.a. (nowelizacja 2019) |
| Piwo | ✅ 2026: **11,47 zł**/hl za każdy stopień Plato (było błędnie 10,00 zł — nieaktualne, prawdopodobnie z 2022-2023 r.) — potwierdzone oficjalną "mapą akcyzową" (2022: 9,43 → 2023: 9,90 → 2024: 10,40 → 2025: 10,92 → 2026: 11,47 zł), zgodne w 6+ źródłach | art. 94 u.p.a. |
| Wino (ciche) | ✅ 2026: **233,00 zł**/hl (było błędnie 188,00 zł — znacząco nieaktualne) — mapa akcyzowa: 2022: 191 → 2023: 201 → 2024: 211 → 2025: 222 → 2026: 233 zł | art. 95 u.p.a. |
| Wyroby spirytusowe | ✅ 2026: **8 391,00 zł**/hl alkoholu 100% vol. (było błędnie 6 275,00 zł — znacząco nieaktualne, ok. 2 lata za stare) | art. 93 u.p.a. |
| Tytoń (papierosy) | ✅ 2026: **476,10 zł**/1000 szt. + 32,05% ceny (było błędnie 228,10 zł — bardzo nieaktualne). ⚠️ UWAGA: sama stawka 2026 r. ZMIENIŁA SIĘ W TRAKCIE ROKU — od 1.01.2026 obowiązywało 414 zł/1000 szt., DOPIERO od **29.03.2026** podniesiono do 476,10 zł. Sprawdź, czy nie doszła KOLEJNA zmiana od dnia audytu | art. 99 u.p.a. |
| ⚠️ Podatek/opłata cukrowa (napoje słodzone) | ✅ ROZSTRZYGNIĘTE 2026-08-11 (8+ zgodnych źródeł, grudzień 2025): Prezydent Karol Nawrocki ZAWETOWAŁ W CAŁOŚCI nowelizację ustawy o zdrowiu publicznym + ustawy o PIT, która miała podnieść: opłatę STAŁĄ z 0,50 na 0,70 zł/l, opłatę ZMIENNĄ (za cukier >5g/100ml) z 0,05 na 0,10 zł/g, oraz PUŁAP maksymalny z 1,2 na 1,8 zł/l — WETO objęło CAŁY pakiet zmian, NIE tylko część — AKTUALNE stawki POZOSTAJĄ: 0,50 zł/l (podstawowa) + 0,05 zł/g (zmienna), pułap 1,2 zł/l | Ustawa o zdrowiu publicznym |
| Akcyza alkoholowa — ⚠️ ZWIĄZANE z wetem wyżej | ✅ ROZSTRZYGNIĘTE 2026-08-11: Prezydent RÓWNOLEGLE zawetował ODRĘBNĄ nowelizację ustawy akcyzowej, która miała PODNIEŚĆ skalę podwyżki 2026 r. z bazowych 5% do 15% (i 2027 r. z zapowiadanych 5% do 10%) — ⭐⭐ KLUCZOWE: weto NIE ZATRZYMUJE wzrostu cen w ogóle — BAZOWA podwyżka **5% w 2026 r.** (uchwalona WCZEŚNIEJ, odrębną ustawą, NIEOBJĘTA tym wetem) NADAL OBOWIĄZUJE — zawetowano WYŁĄCZNIE DODATKOWĄ nadwyżkę ponad te 5% — STAWKI piwa/wina/spirytusu W TABELI WYŻEJ już PRAWIDŁOWO odzwierciedlają TĘ bazową podwyżkę 5% (potwierdzone matematycznie: 222×1,05=233,1≈233 zł wino; 10,92×1,05=11,466≈11,47 zł piwo) — WNIOSEK: stawki w tabeli SĄ AKTUALNE, weto TYLKO zapobiega DALSZEMU wzrostowi ponad już odzwierciedlony poziom |
| Energia elektryczna | 5,00 zł/MWh | art. 89 u.p.a. |
| Samochody osobowe (>2000 cm³) | 18,6% podstawy | art. 105 u.p.a. |

> ⚠ **Stawki ulegają corocznej indeksacji** — zawsze weryfikuj aktualną tabelę na:
> https://www.podatki.gov.pl/akcyza/stawki-akcyzy/

### Podatnicy akcyzy (art. 13 u.p.a.)

- Podmiot prowadzący **skład podatkowy** (produkcja, przetwarzanie, magazynowanie)
- **Zarejestrowany odbiorca** (import zwolniony z procedury zawieszenia poboru)
- **Importer** (wwóz spoza UE)
- **Nabywca wewnątrzwspólnotowy** (nabycie z innego kraju UE)

### Procedura zawieszenia poboru akcyzy (art. 40–56 u.p.a.)

```
Skład podatkowy A (PL) → Transport z e-AD → Skład podatkowy B (UE)
         ↓ EMCS (elektroniczny system monitorowania)
Akcyza zawieszona do momentu wyprowadzenia ze składu/dopuszczenia do konsumpcji
```

---

## 2. CŁO / UCC — WYDZIELONE

→ `mod-UCC-clo-taryfa-celna.md`: Nomenklatura Scalona (CN/TARIC), Wiążąca
Informacja Taryfowa (WIT), procedury celne (UCC art. 201-272), wartość celna
(metody wyceny art. 70-74 UCC), preferencje taryfowe i umowy FTA (GSP, CETA,
JEEPA, reguły pochodzenia).

---

## 3. NARUSZENIA — KKS + PRAWO CELNO-AKCYZOWE

### Główne przestępstwa i wykroczenia skarbowe (KKS)

| Czyn | Przepis KKS | Sankcja orientacyjna |
|------|-------------|----------------------|
| Uchylanie się od zapłaty akcyzy | art. 54 KKS | do 720 stawek dziennych / do 5 lat |
| Przemyt akcyzowy (uszczuplenie > małej wartości) | art. 86 KKS | do 720 stawek / do 5 lat |
| Podanie fałszywych danych w zgłoszeniu celnym | art. 87 KKS | do 360 stawek |
| Niedopełnienie obowiązku celnego | art. 91 KKS | grzywna do 720 stawek |
| Przestępstwo celne przy imporcie VAT | art. 86–87 KKS | do 5 lat |

> **Kwalifikator karny:** Przemyt narkotyków, broni lub substancji REACH/ADR → kumulatywna kwalifikacja KKS + KK (art. 55 KK, art. 163 KK, ustawa o przeciwdziałaniu narkomanii).

### Czynny żal (art. 16 KKS)
- Skuteczny do czasu wszczęcia postępowania przez organ
- Wymaga dobrowolnego ujawnienia czynu + uiszczenia uszczuplonej należności
- Pisemnie do właściwego urzędu celno-skarbowego

---

## 4. ORGANY I ŚCIEŻKA ODWOŁAWCZA (AKCYZA)

```
Urząd Celno-Skarbowy (UCS)
  ↓ decyzja I instancji (akcyza)
Dyrektor Izby Administracji Skarbowej (IAS)
  ↓ odwołanie (14 dni od doręczenia decyzji UCS)
Wojewódzki Sąd Administracyjny (WSA)
  ↓ skarga (30 dni od doręczenia decyzji IAS)
Naczelny Sąd Administracyjny (NSA)
  ↓ skarga kasacyjna (30 dni od doręczenia wyroku WSA)
```

> Ścieżka odwoławcza dla cła i WIT (klasyfikacja taryfowa) →
> `mod-UCC-clo-taryfa-celna.md` sekcja 5.

---

## 5. ŚCIEŻKA WERYFIKACJI ONLINE (obowiązkowa)

```
1. Sprawdź stawki akcyzy:
   https://www.podatki.gov.pl/akcyza/stawki-akcyzy/
   https://isap.sejm.gov.pl → ustawa z 6.12.2008 o podatku akcyzowym

2. Sprawdź aktualny tekst KKS:
   https://isap.sejm.gov.pl → Dz.U. 2025 poz. 633 t.j.

Cło/CN/TARIC/WIT/FTA → `mod-UCC-clo-taryfa-celna.md` sekcja 6.
```

---

*mod-AD-akcyza-clo · v1.1 · 2026-06-14 — wydzielono mod-UCC-clo-taryfa-celna.md*
*Powiązane: mod-UCC-clo-taryfa-celna (cło/UCC), mod-Q (PIT/VAT/CIT), mod-AC (REACH/chemikalia), mod-L (gospodarcze)*
*Weryfikacja: isap.sejm.gov.pl*

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- towar/kod CN;
- zdarzenie podatkowe/celne;
- procedura celna;
- dokumenty SAD/JPK;
- organ;
- KKS;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- dokumenty celne;
- faktury;
- kody CN;
- magazyn/transport;
- decyzje organu;
- ekspertyzy klasyfikacyjne;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- błędna klasyfikacja CN;
- brak dokumentacji przemieszczeń;
- ryzyko KKS;
- przedawnienie i zabezpieczenie;

## 4a. KLASYFIKACJA TARYFOWA CN I OSZUSTWA CELNE (rozbudowane 2026-07-15,
## część 4/6 naprawy braków — wcześniej jeden wyraz bez treści)

### Nomenklatura Scalona (CN) — jak działa klasyfikacja

```
System HS (Zharmonizowany System, Światowa Organizacja Celna) — pierwsze
  6 cyfr, globalny standard, ~200 państw
System CN (Nomenklatura Scalona, rozp. Rady (EWG) 2658/87) — dodaje 2
  cyfry (razem 8), poziom UE, aktualizowana rozporządzeniem co roku
  (publikacja do 31.10, obowiązuje od 1.01 następnego roku)
TARIC — dodaje kolejne 2 cyfry (razem 10), zawiera środki szczególne
  (antydumping, zawieszenia ceł, embarga)
Klasyfikacja opiera się na OBIEKTYWNYCH cechach towaru (skład, funkcja,
  stopień przetworzenia, przeznaczenie) + Ogólne Reguły Interpretacji
  Nomenklatury Scalonej (ORINS) — hierarchia: opis szczegółowy > ogólny;
  przy towarach złożonych decyduje materiał/element nadający zasadniczy
  charakter całości
NARZĘDZIE OCHRONNE: Wiążąca Informacja Taryfowa (WIT) — decyzja Dyrektora
  Izby Administracji Skarbowej, wiąże organy celne przez 3 lata, chroni
  przed sankcjami przy późniejszej kontroli (analogicznie: WIS — wiążąca
  informacja stawkowa VAT, WIA — akcyzowa)
Odpowiedzialność za poprawność kodu CN spoczywa na ZGŁASZAJĄCYM, nawet
  jeśli zlecił zgłoszenie agencji celnej — przeniesienie czynności NIE
  zwalnia z odpowiedzialności
Kontrola postimportowa KAS — możliwa do 3 LAT po odprawie
```

### KWALIFIKACJA KARNOSKARBOWA BŁĘDNEJ KLASYFIKACJI — art. 86-87 KKS

```
⛔ NAJCZĘSTSZY BŁĄD KWALIFIKACYJNY — rozróżnienie art. 86 vs art. 87 KKS:

ART. 86 KKS — PRZEMYT CELNY: towar PRZEWOŻONY POZA KONTROLĄ CELNĄ (brak
  zgłoszenia / brak przedstawienia towaru organowi celnemu w ogóle).
  §1: nieprzedstawienie towaru/zgłoszenia → narażenie należności celnej
  na uszczuplenie — grzywna do 720 stawek dziennych lub PW, albo obie
  §3-4: mała wartość / poniżej progu ustawowego → wykroczenie skarbowe

ART. 87 KKS — OSZUSTWO CELNE: towar ZOSTAŁ ZGŁOSZONY, ale ma INNE CECHY
  niż zadeklarowane (w tym: błędna klasyfikacja taryfowa/kod CN podany
  niezgodnie ze stanem rzeczywistym) — WPROWADZENIE W BŁĄD organu celnego.
  §1: dot. reglamentacji taryfowej (należności celne) — grzywna do 720
      stawek dziennych lub PW, albo obie
  §2: dot. reglamentacji POZATARYFOWEJ (embargo, kontyngenty, zezwolenia)
      — TA SAMA kara, ALE nie wymaga narażenia na uszczuplenie należności
      — wystarczy samo naruszenie reguł obrotu (np. ominięcie kontyngentu)
  §3: mała wartość (5-200-krotność minimalnego wynagrodzenia) — łagodniej
  §4: poniżej progu ustawowego — wykroczenie skarbowe
  "Wprowadzenie w błąd" (SN, V KK 377/04): umyślne wywołanie u organu
    celnego nieadekwatnej oceny okoliczności istotnych dla wymiaru
    należności — obejmuje też PODANIE NIEZGODNYCH danych lub ZATAJENIE
    stanu rzeczywistego (analogia do art. 92 KKS)

⚠️ PRZYKŁAD BŁĘDU SĄDOWEGO (z orzecznictwa, opisany w komentarzach):
  sąd zastosował art. 86 §1 KKS (przemyt) do sytuacji, gdy towar BYŁ
  zgłoszony do odprawy, ale miał inne cechy niż zadeklarowane — to
  klasyczny przypadek art. 87, NIE art. 86 (przemyt wymaga braku
  jakiegokolwiek zgłoszenia). Pomylenie tych dwóch przepisów jest częste
  i ma realne skutki (np. na przedawnienie, bo terminy/opisy czynu różnią
  się między przepisami).

ROZRÓŻNIENIE OD OSZUSTWA Z KK (art. 286 KK):
  Zaniżenie należności celnej/podatkowej to NIE "niekorzystne rozporządzenie
  mieniem" w rozumieniu art. 286 KK — to uniknięcie wydatku z własnego
  majątku kosztem uszczuplenia SPODZIEWANEGO dochodu Skarbu Państwa, więc
  NIE mieści się w znamionach oszustwa zwykłego (SA Katowice, II AKa 153/14;
  potwierdzone też dla podatków w art. 56 KKS — patrz mod-KKS-karny-skarbowy-
  i-AML.md). Wyjątek: WYŁUDZENIE nienależnego zwrotu (np. VAT) MOŻE
  wypełniać znamiona art. 286 KK w określonych układach faktycznych — SN,
  V KK 248/03 — ale tylko gdy dochodzi do faktycznego "rozporządzenia
  mieniem" przez organ (wypłata/zaliczenie zwrotu), nie przy samym
  zaniżeniu zobowiązania.

DODATKOWE PRZESTĘPSTWA W ROZDZIALE 7 KKS (przeciwko obowiązkom celnym):
  Art. 85-86 — nieprzedstawienie towaru/przemyt
  Art. 88 — naruszenie zamknięcia celnego
  Art. 89 — wyłudzenie pozwolenia/dokumentu obrotu z zagranicą przez
    podstępne wprowadzenie w błąd — do 720 stawek dziennych lub 2 lata PW
  Art. 91 — paserstwo celne (nabycie/przechowanie/przewóz towaru z
    przestępstwa celnego) — do 720 stawek dziennych lub 3 lata PW
    (§2: paserstwo NIEUMYŚLNE — powinien i mógł przypuszczać — tylko grzywna)
```

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |

---

## ANEKS — WIA: WIĄŻĄCA INFORMACJA AKCYZOWA

```
WIA = akcyzowy odpowiednik WIS (Wiążącej Informacji Stawkowej)

Cel: Ustalenie klasyfikacji wyrobu akcyzowego lub kwalifikacji jako wyrób akcyzowy
     PRZED dokonaniem czynności podlegającej akcyzie

Wniosek: Do Dyrektora Izby Administracji Skarbowej właściwego dla wnioskodawcy
Termin na wydanie: 3 miesiące od złożenia wniosku (weryfikuj w ustawie akcyzowej)
Wiążąca: dla organów podatkowych przez 5 lat od dnia wydania
         (chyba że zmianie uległa podstawa klasyfikacji — weryfikuj aktualne przepisy)

Zaskarżenie WIA:
  → Skarga do WSA w 30 dniach od doręczenia

⚠️ Weryfikuj aktualne przepisy o WIA w ustawie akcyzowej (Dz.U. 2025 poz. 126) w ISAP.
web_search: "WIA wiążąca informacja akcyzowa wniosek termin 2025 2026"
```

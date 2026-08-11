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
v1.3.0 (2026-08-11 — transza 3, OSTATNIE luki 🔴 domknięte: 1j
przemieszczanie poza zawieszeniem/System e-DD art. 46a-46w, 1k wyroby
poza zawieszeniem/UDT art. 77-83a, 1l zezwolenia zbiorczo art. 84 +
przedsiębiorstwo w spadku art. 84a-84f, 1m postępowanie przy imporcie
art. 27-29a; mapa pokrycia 🟢 14→19/27 (52%→70%), 🔴 5→0 — WSZYSTKIE
pozycje 🔴 domknięte, pozostaje 8 pozycji 🟡 wymagających rozszerzenia
nie tworzenia od zera; v1.2.0 — transza 2: 1e rejestracja CRPA
art. 16-20, 1f rejestracja PPT art. 20a-20o, 1g deklaracje/terminy
ogólne art. 21-26, 1h podmiot pośredniczący art. 56-56a, 1i ewidencje
Dział VIA art. 138a-138ta; mapa pokrycia 🟢 11→14/27 (41%→52%), 🔴
zredukowane z 7 do 5; v1.1.0 — transza 1: 1a zabezpieczenie
akcyzowe art. 63-76, 1b normy ubytków art. 85, 1c znaki akcyzy
art. 114-138w + kary pieniężne art. 138u-138w, 1d akcyza na samochody
osobowe art. 100-113a; poprawiono pozostałość nieaktualnego t.j. w
aneksie WIA; mapa pokrycia 🟢 5→11/27 (19%→41%))

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
| Wino (cichе) | ✅ 2026: **233,00 zł**/hl (było błędnie 188,00 zł — znacząco nieaktualne) — mapa akcyzowa: 2022: 191 → 2023: 201 → 2024: 211 → 2025: 222 → 2026: 233 zł | art. 95 u.p.a. |
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

## 1a. ⭐⭐⭐ ZABEZPIECZENIE AKCYZOWE (Dział III rozdz. 6, art. 63-76)
(uzupełnienie luki #15 mapy pokrycia, dodano 2026-08-11 — dotąd 0
wystąpień w całym module)

Zweryfikowano: lexlege.pl, gofin.pl, prawnik.cc (Rząd 2A/2B, treść
zgodna wieloźródłowo), rp.pl, ksiegowego.pl, isp-modzelewski.pl (Rząd
3, potwierdzenie dodatkowe).

```
⭐⭐⭐ ART. 63 — OBOWIĄZEK ZŁOŻENIA ZABEZPIECZENIA AKCYZOWEGO:
  → KRĄG PODMIOTÓW OBOWIĄZANYCH (ust. 1) — m.in.: podmiot prowadzący
    skład podatkowy, zarejestrowany odbiorca, zarejestrowany
    wysyłający, podatnik dokonujący przemieszczania wyrobów w
    procedurze zawieszenia poboru akcyzy
  → ZWOLNIENIE Z OBOWIĄZKU: wyroby akcyzowe opodatkowane ZEROWĄ
    stawką akcyzy ze względu na PRZEZNACZENIE
  → zabezpieczenie może obejmować JEDNO lub WIELE zobowiązań
    podatkowych, na czas OZNACZONY lub NIEOZNACZONY, oraz może
    obejmować RÓWNIEŻ opłatę paliwową
  → MOŻLIWOŚĆ ZABEZPIECZENIA PRZEZ OSOBĘ TRZECIĄ (za jej zgodą) —
    art. 66 pkt 1 (delegacja do rozporządzenia określającego
    dodatkowe przypadki)

⭐⭐ ART. 65 — DWA RODZAJE: ZABEZPIECZENIE GENERALNE I RYCZAŁTOWE:
  → ZABEZPIECZENIE GENERALNE — dla podmiotów o WIĘKSZEJ skali
    obrotu; wysokość ustala naczelnik US w kwocie WSKAZANEJ przez
    podmiot we wniosku, oszacowanej na poziomie POKRYWAJĄCYM W KAŻDYM
    CZASIE zobowiązania objęte zabezpieczeniem (art. 65 ust. 3a)
    → gdy wysokość zobowiązań może się ZMIENIAĆ w czasie — podmiot
      wstępnie SZACUJE poziom pokrywający zobowiązania w każdym
      momencie (ust. 5)
    → KRĄG: podmioty OBOWIĄZANE do złożenia generalnego + podmioty,
      które MOGĄ wystąpić o nie DOBROWOLNIE (np. przewoźnik,
      spedytor, przedstawiciel podatkowy — gdy uznają to za
      korzystne)
  → ZABEZPIECZENIE RYCZAŁTOWE — alternatywa dla mniejszych
    podmiotów/niższego ryzyka; szczegółowe przypadki określa
    rozporządzenie wykonawcze (delegacja z art. 66 pkt 2)

⭐⭐⭐ ART. 67 — PIĘĆ FORM ZABEZPIECZENIA (wybór należy do podatnika,
  formy można ŁĄCZYĆ, byle łączna kwota w pełni pokrywała zawieszoną
  akcyzę):
  1) depozyt w gotówce (art. 68 — DEPOZYT W WALUCIE POLSKIEJ)
  2) gwarancja bankowa lub ubezpieczeniowa
  3) czek potwierdzony przez bank/oddział banku zagranicznego z
     siedzibą/działalnością na terytorium UE lub EFTA-EOG
  4) WEKSEL WŁASNY — złożony we właściwym urzędzie skarbowym wraz z
     DEKLARACJĄ WEKSLOWĄ (porozumienie co do sposobu wypełnienia);
     naczelnik US wydaje POKWITOWANIE złożenia zabezpieczenia
     ⚠️ weksla własnego NIE może stosować OSOBA TRZECIA (ograniczenie
     od 1.03.2009)
  5) HIPOTEKA NA NIERUCHOMOŚCI (art. 69a) — WYŁĄCZNIE na prawie
     WŁASNOŚCI nieruchomości, do WYSOKOŚCI 65% wartości nieruchomości;
     wartość przyjmuje się na podstawie zadeklarowanej przez podmiot
     wartości RYNKOWEJ
  → Rozporządzenie wykonawcze: rozporządzenie MF z 21.12.2018 r. ws.
    zabezpieczeń akcyzowych (Dz. U. z 2018 r. poz. 2543, z późn. zm.)
    — ⚠️ [NIEWERYFIKOWANE, czy istnieje nowszy t.j. — sprawdź przed
    powołaniem w piśmie]

⭐ POZOSTAŁE PRZEPISY ROZDZIAŁU:
  → art. 64 — zwolnienie SKŁADU PODATKOWEGO ze złożenia zabezpieczenia
    (w określonych przypadkach)
  → art. 69 — obowiązki GWARANTA (przy zabezpieczeniu w formie
    gwarancji bankowej/ubezpieczeniowej)
  → art. 70 — wybór formy zabezpieczenia (dopuszczalność zmiany)
  → art. 71 — ODMOWA przyjęcia zabezpieczenia akcyzowego przez organ
  → art. 72 — skutki złożenia zabezpieczenia NIEPOKRYWAJĄCEGO w pełni
    kwoty zobowiązania
  → art. 73 — pokrycie akcyzy Z ZABEZPIECZENIA (realizacja)
  → art. 74 — WYGAŚNIĘCIE zobowiązania podatkowego a zabezpieczenie
    (zwolnienie zabezpieczenia po wygaśnięciu)
  → art. 75 — BRAK ODSETEK od kwoty zwracanego zabezpieczenia (istotne
    przy sporach o zwrot — podatnik nie może żądać oprocentowania)

⭐ ZNACZENIE PRAKTYCZNE DLA KANCELARII: spory o zabezpieczenie akcyzowe
  to częsty przedmiot postępowań przy zakładaniu/prowadzeniu składu
  podatkowego oraz przy przemieszczaniu wyrobów w procedurze
  zawieszenia — odmowa przyjęcia zabezpieczenia (art. 71) lub spór o
  wysokość wymaganego zabezpieczenia generalnego bywają przedmiotem
  odwołań do IAS i skarg do WSA (ścieżka jak w sekcji 4 tego modułu).
```

---

## 1b. ⭐⭐ NORMY DOPUSZCZALNYCH UBYTKÓW WYROBÓW AKCYZOWYCH (Dział III
rozdz. 9, art. 85)
(uzupełnienie luki #19, dodano 2026-08-11 — dotąd 0 wystąpień)

Zweryfikowano: arslege.pl, lexlege.pl, dlajurysty.pl (Rząd 2A/2B, treść
zgodna trzyźródłowo), gofin.pl (Rząd 2B, kontekst wykonawczy).

```
⭐⭐ ART. 85 — DWA TRYBY USTALANIA NORM:
  1) NA WNIOSEK podmiotu (ust. 1) — właściwy naczelnik US ustala w
     drodze DECYZJI: (a) normy dopuszczalnych UBYTKÓW wyrobów
     akcyzowych; (b) dopuszczalne normy ZUŻYCIA napojów alkoholowych
     — objętych procedurą zawieszenia (użytych do produkcji innych
     wyrobów) LUB zwolnionych ze względu na przeznaczenie (art. 32
     ust. 4 pkt 2-3), gdy użyte przez PODMIOT ZUŻYWAJĄCY
  2) Z URZĘDU (ust. 2) — naczelnik US MOŻE ustalić normy ubytków/
     zużycia z własnej inicjatywy; dodatkowo OBLIGATORYJNIE ustala
     normy zużycia wyrobów z zał. nr 2 (objętych zerową stawką poza
     procedurą zawieszenia, zużywanych do produkcji innych wyrobów)

  → PRZY WIELU ZEZWOLENIACH: normy ustala się ODRĘBNIE dla KAŻDEGO
    składu podatkowego z osobna (ust. 3)
  → KRYTERIA USTALANIA (ust. 4): rodzaj wyrobów, specyfika procesu
    produkcyjnego/magazynowania, warunki techniczne
  → PODSTAWA rozporządzenia wykonawczego (delegacja ust. 5-7):
    (a) wysokość RZECZYWISTYCH ubytków/zużycia w ostatnim okresie
        obrachunkowym, (b) BADANIE rzeczywistych ubytków/zużycia —
        obowiązkowe przy nowym dziale produkcyjnym, zmianach
        technicznych/technologicznych lub nowym wyrobie,
        (c) OCENA zaawansowania technologicznego urządzeń
    → jeżeli ubytek powstał w wyniku PRZESTĘPSTWA przeciwko mieniu
      lub ZAWINIONEGO działania/zaniechania podatnika — odrębny reżim
      rozliczenia (nie korzysta z normy)
    → NOWY PODMIOT: do czasu ustalenia norm przez naczelnika, ubytki
      rozlicza się w wysokości RZECZYWISTYCH STRAT, nie dłużej niż
      przez 6 MIESIĘCY od miesiąca następującego po rozpoczęciu
      produkcji/magazynowania/przemieszczania

⭐ ZNACZENIE PRAKTYCZNE: przekroczenie normy ubytków = ubytek PONAD
  normę podlega OPODATKOWANIU akcyzą jak wyrób wyprowadzony do
  konsumpcji — częsty przedmiot sporów przy kontrolach składów
  podatkowych i podmiotów prowadzących rozlewnie/magazyny wyrobów
  akcyzowych (zwłaszcza paliw płynnych i alkoholu)
```

---

## 1c. ⭐⭐⭐ ZNAKI AKCYZY (banderole) I KARY PIENIĘŻNE (Dział VI,
art. 114-138w; Dział VIb, art. 138u-138w)
(uzupełnienie luki #24 i #26, dodano 2026-08-11 — dotąd tylko 1-2
wzmianki, 0 systematyki)

Zweryfikowano: podatekakcyzowy.pl (3×), poradnikprzedsiebiorcy.pl,
interpretacje.pl, ksiegowego.pl, e-prawnik.pl (Rząd 3, zgodne
wieloźródłowo), oraz **podatki.gov.pl (Rząd 1)** — bezpośrednie
potwierdzenie treści art. 114 i procedury.

```
⭐⭐⭐ ART. 114 — OBOWIĄZEK OZNACZANIA — PODSTAWA: obowiązkowi oznaczania
  znakami akcyzy podlegają WYŁĄCZNIE wyroby akcyzowe wymienione w
  ZAŁĄCZNIKU NR 3 do ustawy (katalog zamknięty — NIE każdy wyrób
  akcyzowy podlega obowiązkowi banderolowania)
  → poz. 10 zał. nr 3: papierosy, tytoń do palenia, cygara i
    cygaretki — bez względu na kod CN
  → ⭐ od 31.08.2025 (nowelizacja implementująca opodatkowanie nowych
    kategorii — patrz case study e-papierosy w sekcji „WYROBY
    NIKOTYNOWE" wyżej w module): rozszerzono katalog o urządzenia do
    waporyzacji, zestawy części do urządzeń do waporyzacji, płyny w
    jednorazowych e-papierosach, wyroby nowatorskie, saszetki
    nikotynowe i pozostałe wyroby nikotynowe (Deloitte, Rząd 3 —
    potwierdzenie terminu wdrożenia)

⭐⭐ DWA RODZAJE ZNAKÓW (art. 2 ust. 1 pkt 17):
  a) PODATKOWE znaki akcyzy (banderole podatkowe) — potwierdzenie
     WPŁATY kwoty stanowiącej ich wartość; obowiązek na podmiotach z
     art. 116 ust. 1 — m.in. podmioty prowadzące składy podatkowe,
     IMPORTERZY, podmioty dokonujące nabycia WEWNĄTRZWSPÓLNOTOWEGO
  b) LEGALIZACYJNE znaki akcyzy (banderole legalizacyjne) —
     potwierdzenie PRAWA do przeznaczenia wyrobów do SPRZEDAŻY;
     obowiązek powstaje (art. 116 ust. 3), gdy POZA procedurą
     zawieszenia poboru akcyzy występują wyroby: NIEOZNACZONE,
     oznaczone NIEPRAWIDŁOWO, lub znakami UTRACONYMI WAŻNOŚĆ/
     USZKODZONYMI — GDY przeznaczone do DALSZEJ SPRZEDAŻY
     → posiadacz takich wyrobów OBOWIĄZANY zakupić znaki i oznaczyć
       wyroby; z czynności sporządza się PROTOKÓŁ
     → posiadacz SPORZĄDZA SPIS wyrobów i przedstawia go do
       potwierdzenia naczelnikowi urzędu celno-skarbowego
  ⭐ PRAKTYCZNY PRZYKŁAD: utrata ważności banderol z rocznika X (np.
    zmiana wzoru) → posiadacz papierosów w kiosku sporządza spis na
    koniec okresu przejściowego, składa do potwierdzenia naczelnikowi
    US, następnie wnioskuje o legalizacyjne znaki

⭐ ART. 117 UST. 3 — ZAKAZ SPRZEDAŻY: wyroby podlegające obowiązkowi
  oznaczania NIE MOGĄ być przedmiotem sprzedaży na terytorium kraju
  bez uprzedniego PRAWIDŁOWEGO oznaczenia właściwymi znakami

⭐ ART. 118 — ZWOLNIENIE Z OBOWIĄZKU OZNACZANIA: ustawa przewiduje
  katalog wyrobów zwolnionych (m.in. określone przeznaczenia/
  okoliczności) — ⚠️ [pełny katalog art. 118 NIE odczytany w tej
  sesji ze źródła — do uzupełnienia punktowo przy konkretnej sprawie]

⭐ ART. 138 — STRATY ZNAKÓW: w razie utraty, uszkodzenia lub
  zniszczenia znaków w procesie oznaczania, W GRANICACH dopuszczalnej
  normy strat — odrębny reżim rozliczenia (analogicznie do norm
  ubytków w sekcji 1b)

═══════════════════════════════════════════════════════════════

⭐⭐⭐ DZIAŁ VIb — KARY PIENIĘŻNE (art. 138u-138w) — ODRĘBNE OD KKS:
  ⭐ KLUCZOWA RÓŻNICA WZGLĘDEM SEKCJI 3 (KKS): kary pieniężne z
  art. 138u-138w są ADMINISTRACYJNE — nakładane w drodze DECYZJI
  administracyjnej przez naczelnika urzędu celno-skarbowego/
  skarbowego, NIEZALEŻNIE od odpowiedzialności karnoskarbowej z KKS.
  Możliwy ZBIEG obu reżimów dla tego samego stanu faktycznego.

  → ART. 138u — PRZYKŁAD PODSTAWOWY (mechanizm identyczny dla
    pozostałych przypadków kar w tym dziale): gdy podmiot odbierający
    (użytkownik Systemu — EMCS) NIE SPORZĄDZI projektu raportu odbioru
    albo nie przedstawi dokumentu zastępującego w terminie z art. 46i
    ust. 2 → KARA PIENIĘŻNA **5 000 zł**
    → ust. 2 — MOŻLIWOŚĆ ODSTĄPIENIA od nałożenia kary — na WNIOSEK
      podmiotu lub Z URZĘDU, gdy uzasadnia to WAŻNY INTERES podmiotu
      lub INTERES PUBLICZNY
    → ust. 5 — kara stanowi DOCHÓD BUDŻETU PAŃSTWA
    → ust. 6 — TERMIN ZAPŁATY: 7 DNI od dnia, w którym decyzja o
      nałożeniu stała się OSTATECZNA
    → ust. 7 — PRZEDAWNIENIE NAŁOŻENIA: kara NIE MOŻE być nałożona,
      jeżeli od dnia niedopełnienia obowiązku upłynęło **5 LAT**
    → ust. 8 — PRZEDAWNIENIE ZAPŁATY: obowiązek zapłaty PRZEDAWNIA SIĘ
      z upływem 5 lat, licząc od KOŃCA ROKU KALENDARZOWEGO, w którym
      upłynął termin zapłaty
  → ART. 138w — analogiczna kara PIENIĘŻNA nakładana na IMPORTERA
    wyrobów akcyzowych (odpowiednie stosowanie ust. 2, 3, 5-8 z art.
    138u)
  → ⚠️ [Pełny katalog przesłanek pozostałych kar w Dziale VIb (poza
    art. 138u/138w) NIE odczytany szczegółowo w tej sesji — struktura
    proceduralna (termin 7 dni, przedawnienie 5 lat, możliwość
    odstąpienia) jest WSPÓLNA dla całego działu przez odesłania
    "odpowiednio" — ale KONKRETNE kwoty i przesłanki pozostałych
    przypadków wymagają odrębnej weryfikacji przy konkretnej sprawie]

⭐ ZNACZENIE PRAKTYCZNE: kary administracyjne z Działu VIb są częstym
  przedmiotem odwołań w praktyce podmiotów korzystających z Systemu
  (EMCS) — ścieżka odwoławcza jak w sekcji 4 tego modułu (IAS → WSA →
  NSA), z uwzględnieniem możliwości wniosku o ODSTĄPIENIE od kary
  PRZED wniesieniem odwołania (art. 138u ust. 2 — szybsza i tańsza
  ścieżka niż spór sądowoadministracyjny).
```

---

## 1d. ⭐⭐⭐ OPODATKOWANIE AKCYZĄ SAMOCHODÓW OSOBOWYCH (Dział V,
art. 100-113a)
(uzupełnienie luki #23, dodano 2026-08-11 — dotąd tylko 1 stawka
orientacyjna bez systematyki)

Zweryfikowano: lexlege.pl, arslege.pl, gofin.pl, prawnik.cc, qmap.pl
(Rząd 2A/2B, zgodne wieloźródłowo), oraz **puesc.gov.pl i
podatki.gov.pl — formularz AKC-US (Rząd 1)**, fakturaxl.pl,
rachunkowosc.com.pl, podatekakcyzowy.pl (Rząd 3, potwierdzenie
terminów i zwolnień).

```
⭐⭐⭐ ART. 100 — PRZEDMIOT OPODATKOWANIA (katalog czynności, ust. 1):
  1) IMPORT samochodu osobowego niezarejestrowanego wcześniej w kraju
  2) NABYCIE WEWNĄTRZWSPÓLNOTOWE (WNT) samochodu osobowego
     niezarejestrowanego wcześniej w kraju
  3) PIERWSZA SPRZEDAŻ na terytorium kraju samochodu osobowego
     niezarejestrowanego w kraju: (a) wyprodukowanego w kraju, LUB
     (b) od którego nie zapłacono akcyzy z tytułu importu/WNT
  → ROZSZERZENIA (ust. 1a-2): także (a) zmiana KONSTRUKCYJNA innego
    pojazdu samochodowego na samochód osobowy (zarejestrowanego w
    kraju), (b) nabycie/posiadanie samochodu niezarejestrowanego
    wcześniej, gdy NIE MOŻNA ustalić podmiotu, który dokonał
    wcześniejszej czynności opodatkowanej, (c) DRUGA i kolejna
    sprzedaż niezarejestrowanego samochodu w kraju (następująca po
    pierwszej sprzedaży) — jeżeli wcześniej akcyza NIE została
    zapłacona w należnej wysokości, a kontrola/postępowanie tego NIE
    ustaliły
  → ZASADA JEDNOKROTNOŚCI: jeżeli obowiązek podatkowy powstał z
    tytułu JEDNEJ czynności, NIE powstaje ponownie z tytułu INNEJ
    czynności — o ile akcyza została określona/zadeklarowana w
    należnej wysokości
  → DEFINICJA „samochodu osobowego": pojazdy objęte pozycją **CN
    8703** przeznaczone zasadniczo do przewozu osób (inne niż CN
    8702), włącznie z kombi i wyścigowymi, z zastrzeżonymi
    wyłączeniami
  → PUŁAPKA PRAKTYCZNA: wymiana silnika ≤2000 cm³ na >2000 cm³ PRZED
    pierwszą rejestracją w kraju → przyjmuje się, że przedmiotem
    czynności jest samochód o WIĘKSZEJ pojemności (wyższa stawka);
    analogicznie przy instalacji silnika w pojeździe bez silnika

⭐⭐ ART. 101 — OBOWIĄZEK PODATKOWY — MOMENT POWSTANIA zależy od
  czynności (import, WNT, sprzedaż) — trzy różne momenty w zależności
  od podstawy (art. 101 ust. 2 i 4a)
  → WYŁĄCZENIE: obowiązek NIE POWSTAJE, jeśli samochód nabyty
    wewnątrzwspólnotowo (lub sprzedany wg art. 100 ust. 1 pkt 3 lit.
    a) został DOSTARCZONY wewnątrzwspólnotowo LUB WYEKSPORTOWANY w
    terminie **30 DNI** od nabycia/sprzedaży — potwierdzone
    dokumentami z art. 107 ust. 3

⭐⭐⭐ TERMINY PROCEDURALNE (⚠️ NIE mylić dwóch odrębnych terminów):
  → ZŁOŻENIE DEKLARACJI (AKC-US, deklaracja uproszczona): **14 DNI**
    od dnia powstania obowiązku podatkowego — ale NIE PÓŹNIEJ niż w
    dniu zawiadomienia o zmianach konstrukcyjnych LUB w dniu sprzedaży
    (jeśli wystąpiła przed złożeniem zawiadomienia); można złożyć
    papierowo do US lub elektronicznie przez system PUESC
  → ZAPŁATA PODATKU: **30 DNI** od dnia powstania obowiązku
    podatkowego (odrębny, dłuższy termin niż termin złożenia
    deklaracji — ⭐ typowy błąd praktyczny: mylenie obu terminów)
  → BRAK ZAPŁATY w terminie lub zapłata w NIEPEŁNEJ wysokości →
    deklaracja AKC-US stanowi PODSTAWĘ WYSTAWIENIA TYTUŁU
    WYKONAWCZEGO (postępowanie egzekucyjne w administracji)

⭐⭐ ART. 105 — STAWKI (przykładowe, ⚠️ ZAWSZE WERYFIKUJ AKTUALNOŚĆ
  PRZED CYTOWANIEM — stawki podlegają zmianom):
  → 18,6% podstawy — samochody o pojemności silnika **>2000 cm³**
    (potwierdzone wcześniej w sekcji 1 tabeli stawek tego modułu)
  → 3,1% podstawy — POZOSTAŁE samochody osobowe (reguła ogólna)
  → 1,55% podstawy — samochody o napędzie HYBRYDOWYM spalinowo-
    elektrycznym BEZ ładowania z zewnętrznego źródła (tzw. hybrydy
    "self-charging"), o pojemności silnika spalinowego **≤2000 cm³**

⭐⭐⭐ ZWOLNIENIA (art. 109a-112) — SYSTEMATYKA:
  → ART. 109A — pojazdy ELEKTRYCZNE i pojazdy napędzane WODOREM
    (definicje z ustawy o elektromobilności i paliwach alternatywnych,
    art. 2 pkt 12 i 15) — zwolnienie obowiązuje od **18.12.2019**
    (data decyzji KE potwierdzającej, że regulacja NIE stanowi
    niedozwolonej pomocy publicznej)
    → PROCEDURA: zaświadczenie wydawane przez naczelnika US NA
      WNIOSEK, po przedstawieniu dokumentacji potwierdzającej rodzaj
      napędu; przy sprzedaży przez wyspecjalizowany salon bez
      oryginału zaświadczenia — obowiązek dołączenia do faktury
      OŚWIADCZENIA o posiadaniu KOPII zaświadczenia (może być złożone
      czytelnie podpisane na samej fakturze)
  → HYBRYDY PLUG-IN (ładowane z zewnętrznego źródła) o pojemności
    silnika spalinowego ≤2000 cm³ — również objęte zwolnieniem
    analogicznym mechanizmem zaświadczenia
  → ART. 110/110A — dalsze przesłanki zwolnienia, w tym AMBULANSE
    DROGOWE (art. 110a)
  → ART. 111-112 — zwolnienia przy przywozie SPOZA UE/EFTA oraz inne
    przesłanki szczegółowe — ⚠️ [pełna treść art. 110-112 NIE
    odczytana szczegółowo w tej sesji — struktura tylko sygnalizowana]

⭐ ART. 102-104, 106-107, 109 (pozycje sygnalizowane, nieopisane
  szczegółowo w tej sesji):
  → art. 102 — podatnik akcyzy od samochodu osobowego (przy
    współwłasności — WSZYSCY współwłaściciele są podatnikami,
    odpowiedzialność SOLIDARNA, nawet gdy czynności dokonał jeden z
    nich)
  → art. 103 — płatnik akcyzy w trybie EGZEKUCJI
  → art. 104 — podstawa opodatkowania
  → art. 106 — obowiązki podatnika
  → art. 107 — ZWROT akcyzy z tytułu opodatkowania samochodu
    osobowego (przy powrotnym wywozie/eksporcie)
  → art. 109 — obowiązki naczelnika urzędu celnego (w tym instytucja
    „wyspecjalizowanego salonu sprzedaży" — art. 109 ust. 3e)

⭐ ZNACZENIE PRAKTYCZNE: to jeden z najczęstszych tematów klienckich
  (import/WNT używanych samochodów, przeróbki konstrukcyjne, spory o
  klasyfikację CN 8703 vs 8702 przy pojazdach dostawczych z kratką).
  Rozróżnienie terminu deklaracji (14 dni) od terminu zapłaty (30 dni)
  jest częstym źródłem sporów o odsetki za zwłokę.
```

---

## 1e. ⭐⭐⭐ REJESTRACJA PODMIOTÓW — CRPA (Dział II rozdz. 3, art. 16-20)
(uzupełnienie luki #5, dodano 2026-08-11 — transza 2)

Zweryfikowano: **biznes.gov.pl (Rząd 1)** ×2 — bezpośrednie
potwierdzenie procedury i terminu; poradnikprzedsiebiorcy.pl,
inforlex.pl, isp-modzelewski.pl, podatekakcyzowy.pl (Rząd 3, zgodne
wieloźródłowo); sip.lex.pl (t.j. 2026.412, Rząd 2A).

```
⭐⭐⭐ ART. 16 — OBOWIĄZEK ZGŁOSZENIA DO CRPA (Centralny Rejestr
  Podmiotów Akcyzowych):
  → od 1.02.2021 CRPA ZASTĄPIŁ dotychczasowe papierowe formularze
    AKC-R i AKC-Z oraz rejestry prowadzone przez poszczególnych
    naczelników US — zgłoszenia dokonuje się przez system PUESC
  → TERMIN: przed dniem wykonania PIERWSZEJ czynności podlegającej
    opodatkowaniu akcyzą (lub przed rozpoczęciem działalności w
    zakresie akcyzy) — ⭐ NIE jest to termin liczony od zdarzenia, lecz
    warunek WYPRZEDZAJĄCY (rejestracja musi nastąpić PRZED, nie "w
    ciągu X dni od")
  → KRĄG OBOWIĄZANYCH: nie tylko "klasyczni" podatnicy akcyzy — także
    m.in. podmiot reprezentujący, podmioty NIEPROWADZĄCE działalności
    gospodarczej (niebędące osobami fizycznymi) zużywające wyroby
    akcyzowe zwolnione ze względu na przeznaczenie
  → REJESTRACJA następuje z chwilą wprowadzenia wszystkich danych i
    ZŁOŻENIA PODPISU w systemie PUESC (usługa bezpłatna, chyba że
    realizowana przez pełnomocnika)
  → NUMER IDSISC — służy do komunikacji z organami celnymi przez PUESC

⭐⭐ WYŁĄCZENIA Z OBOWIĄZKU REJESTRACJI W CRPA (⚠️ ważne rozróżnienie
  praktyczne — te podmioty rejestrują się w INNYCH, ODRĘBNYCH
  rejestrach):
  → PODMIOTY zajmujące się SUSZEM TYTONIOWYM (pośredniczące podmioty
    tytoniowe, PPT) — NIE rejestrują się w CRPA, lecz uzyskują WPIS DO
    REJESTRU PPT prowadzonego przez Dyrektora Izby Administracji
    Skarbowej w POZNANIU (patrz sekcja 1f niżej — luka #6)
  → pośredniczące podmioty OLEJOWE i zużywające podmioty OLEJOWE —
    również wyłączone z CRPA

⭐ SANKCJA ZA UCHYBIENIE TERMINOWI: niedopełnienie obowiązku rejestracji
  PRZED pierwszą czynnością stanowi CZYN ZABRONIONY przez KKS
  (zagrożony karą grzywny) — możliwe skorzystanie z CZYNNEGO ŻALU
  (art. 16 KKS, patrz sekcja 3 tego modułu): zawiadomienie organu
  ścigania + dokonanie zaległej rejestracji w CRPA CHRONI przed karą

⭐ TERMIN AKTUALIZACJI DANYCH: zmiana danych zawartych w zgłoszeniu
  rejestracyjnym → zgłoszenie w terminie **7 DNI** od dnia, w którym
  zmiana nastąpiła
```

---

## 1f. ⭐⭐ REJESTRACJA POŚREDNICZĄCYCH PODMIOTÓW TYTONIOWYCH (PPT)
(Dział II rozdz. 3a, art. 20a-20o)
(uzupełnienie luki #6, dodano 2026-08-11 — transza 2)

```
⭐⭐ REJESTR ODRĘBNY OD CRPA: podmiot zamierzający prowadzić działalność
  gospodarczą w zakresie HANDLU LUB PRZETWARZANIA SUSZU TYTONIOWEGO
  (pośredniczący podmiot tytoniowy) NIE dokonuje zgłoszenia
  rejestracyjnego do CRPA — musi uzyskać WPIS DO REJESTRU
  POŚREDNICZĄCYCH PODMIOTÓW TYTONIOWYCH prowadzonego przez Dyrektora
  Izby Administracji Skarbowej w POZNANIU (właściwość CENTRALNA dla
  całego kraju — ⚠️ ważna praktyczna informacja: niezależnie od
  siedziby wnioskodawcy, właściwy organ jest zawsze ten sam)
  → analogicznie do CRPA: zmiana danych → zgłoszenie w terminie 7 dni

⭐ ZNACZENIE PRAKTYCZNE: susz tytoniowy to jeden z najbardziej
  regulowanych obszarów akcyzy (wysokie ryzyko oszustw podatkowych w
  obrocie tym wyrobem) — kancelaria powinna pamiętać, że doradztwo dla
  klienta w tej branży wymaga sprawdzenia WŁAŚCIWEGO rejestru (nie
  CRPA), inaczej niż przy większości pozostałych wyrobów akcyzowych.
```

---

## 1g. ⭐⭐⭐ DEKLARACJA PODATKOWA I TERMINY PŁATNOŚCI — REGUŁA OGÓLNA
(Dział II rozdz. 4, art. 21-26)
(uzupełnienie luki #7, dodano 2026-08-11 — transza 2; ⚠️ ODRĘBNE od
terminów specyficznych dla samochodów osobowych opisanych w sekcji 1d)

Zweryfikowano: lexlege.pl, arslege.pl, gofin.pl, sip.lex.pl, prawnik.cc
(Rząd 2A/2B, zgodne wieloźródłowo, t.j. 2026.412).

```
⭐⭐⭐ ART. 21 — REGUŁA OGÓLNA (zdecydowana większość wyrobów
  akcyzowych, poza przypadkami szczególnymi niżej):
  → podatnik OBOWIĄZANY, BEZ WEZWANIA organu:
    (1) składać deklaracje podatkowe wg ustalonego WZORU właściwemu
        naczelnikowi US
    (2) obliczać i WPŁACAĆ akcyzę na rachunek właściwego US — za
        MIESIĘCZNE okresy rozliczeniowe, w TERMINIE DO 25. DNIA
        miesiąca NASTĘPUJĄCEGO po miesiącu, w którym powstał
        obowiązek podatkowy
  → PRZY PROCEDURZE ZAWIESZENIA POBORU AKCYZY: analogiczny termin —
    do 25. dnia miesiąca następującego po miesiącu, w którym nastąpiło
    ZAKOŃCZENIE procedury zawieszenia SKUTKUJĄCE powstaniem
    zobowiązania podatkowego

⭐⭐ TERMINY SZCZEGÓLNE (odstępstwa od reguły "25. dnia następnego
  miesiąca" — WYMAGAJĄ odrębnej weryfikacji per rodzaj wyrobu):
  → art. 21a — WYROBY WĘGLOWE: termin WYDŁUŻONY — do 25. dnia
    przypadającego w DRUGIM miesiącu od miesiąca, w którym powstał
    obowiązek podatkowy (o miesiąc dłużej niż reguła ogólna)
  → art. 22 — produkcja POZA składem podatkowym — odrębny reżim
    (przedpłata akcyzy, patrz niżej)
  → art. 23 — WPŁATY DZIENNE akcyzy — dla określonych sytuacji zamiast
    rozliczenia miesięcznego
  → art. 24 — ENERGIA ELEKTRYCZNA — odrębny artykuł regulujący
    obowiązek deklaracyjny (AKC-4/H, AKC-EN dla WNT energii)
  → art. 24a — SUSZ TYTONIOWY — odrębne obowiązki
  → art. 24b — WYROBY GAZOWE — odrębne obowiązki
  → art. 24e — DEKLARACJE KWARTALNE — dostępne w określonych
    przypadkach jako alternatywa dla miesięcznych (m.in. dla wyrobów
    węglowych objętych zwolnieniem — art. 21a ust. 1a)

⭐⭐⭐ MECHANIZM PRZEDPŁATY AKCYZY (art. 22-22a, powiązany z
  deklaracjami):
  → wpłaconą PRZEDPŁATĘ uwzględnia się w deklaracji podatkowej
  → gdy przedpłata MNIEJSZA od należnej akcyzy za dany miesiąc — od
    RÓŻNICY należne są ODSETKI jak od zaległości podatkowej, liczone
    od ostatniego dnia miesiąca POPRZEDZAJĄCEGO miesiąc produkcji do
    dnia, w którym akcyza powinna zostać zapłacona
  → gdy przedpłata WIĘKSZA od należnej akcyzy — NADWYŻKĘ rozlicza się
    przy przedpłatach za NASTĘPNE okresy (o ile podatnik nie ma
    zaległości/bieżących zobowiązań ani nie złożył wniosku o
    zaliczenie na poczet przyszłych zobowiązań)

⭐ ART. 24d — FORMA ELEKTRONICZNA OBOWIĄZKOWA: deklaracje podatkowe (z
  art. 21, 21a, 24, 24a, 24b, 24e) oraz deklaracje w sprawie
  przedpłaty (art. 22) składa się WYŁĄCZNIE za pomocą środków
  komunikacji ELEKTRONICZNEJ
  → WYJĄTEK: osoby fizyczne NIEPROWADZĄCE działalności gospodarczej
    MOGĄ składać deklaracje w postaci PAPIEROWEJ

⭐ ART. 26 — delegacja do rozporządzenia MF określającego wzory
  deklaracji i deklaracji w sprawie przedpłaty, z pouczeniem, że
  deklaracje STANOWIĄ PODSTAWĘ DO WYSTAWIENIA TYTUŁU WYKONAWCZEGO
  (analogicznie do mechanizmu opisanego już w sekcji 1d dla AKC-US)

⭐ ZNACZENIE PRAKTYCZNE: rozróżnienie reguły ogólnej (25. dnia
  następnego miesiąca) od terminów szczególnych (węgiel: 25. dnia w
  DRUGIM miesiącu; samochody osobowe: 14/30 dni od zdarzenia — sekcja
  1d) jest częstym źródłem błędów przy doradztwie wielobranżowym.
```

---

## 1h. ⭐⭐⭐ PODMIOT POŚREDNICZĄCY (Dział III rozdz. 3, art. 56-56a)
(uzupełnienie luki #13, dodano 2026-08-11 — transza 2; ⚠️ NIE mylić z
pośredniczącym podmiotem TYTONIOWYM z sekcji 1f — to inna instytucja)

Zweryfikowano: **biznes.gov.pl (Rząd 1)** ×2, poradypodatkowe.pl,
podatekakcyzowy.pl (Rząd 3, zgodne), prawnik.cc (Rząd 2A, struktura).

```
⭐⭐⭐ DEFINICJA (art. 2 ust. 1 pkt 23): podmiot pośredniczący to podmiot
  mający siedzibę lub miejsce zamieszkania NA TERYTORIUM KRAJU, KTÓREMU
  WYDANO ZEZWOLENIE na prowadzenie działalności polegającej na
  DOSTARCZANIU wyrobów akcyzowych OBJĘTYCH ZWOLNIENIEM od akcyzy ZE
  WZGLĘDU NA PRZEZNACZENIE (art. 32) ze SKŁADU PODATKOWEGO na
  terytorium kraju DO PODMIOTU ZUŻYWAJĄCEGO
  → dla wyrobów z art. 32 ust. 1 — TAKŻE wyroby pochodzące BEZPOŚREDNIO
    Z IMPORTU (nie tylko ze składu podatkowego)

⭐⭐ ART. 56 — WARUNKI UZYSKANIA ZEZWOLENIA (ust. 1 pkt 1-5, KUMULATYWNIE):
  → m.in.: działalnością podmiotu KIERUJĄ osoby NIESKAZANE
    prawomocnym wyrokiem za przestępstwo przeciwko: wiarygodności
    dokumentów, mieniu, obrotowi gospodarczemu, obrotowi pieniędzmi i
    papierami wartościowymi, LUB przestępstwo skarbowe
    → przy ocenie tej przesłanki bierze się pod uwagę okres OSTATNICH
      3 LAT licząc od dnia złożenia wniosku
  → PRZESŁANKA ODMOWY (dodatkowa, poza niespełnieniem warunków ust.
    1): wydanie zezwolenia MOGŁOBY powodować zagrożenie WAŻNEGO
    INTERESU PUBLICZNEGO
  → FORMA I CZAS TRWANIA: decyzja administracyjna, na czas OZNACZONY
    (nie dłuższy niż **3 LATA**) albo na czas NIEOZNACZONY — wybór na
    WNIOSEK podmiotu
  → PROCEDURA WSTĘPNA: podmiot musi NAJPIERW zarejestrować się jako
    podatnik akcyzy (zgłoszenie do właściwego US) PRZED podjęciem
    pierwszej czynności z wyrobami objętymi zwolnieniem ze względu na
    przeznaczenie
  → PRAWO STRONY: w toku postępowania o zezwolenie — prawo zapoznania
    się z materiałem zgromadzonym w aktach sprawy
  → ROZSZERZENIE ZAKRESU: gdy podmiot pośredniczący zamierza
    dostarczać wyroby akcyzowe NIEOBJĘTE dotychczasowym zezwoleniem —
    obowiązek uzyskania NOWEGO zezwolenia (rozszerzającego zakres
    wyrobów)
  → rozporządzenie wykonawcze: rozporządzenie MF z 30.08.2010 ws.
    zezwoleń na wykonywanie działalności w zakresie podatku
    akcyzowego (Dz. U. nr 159, poz. 1071, z późn. zm.) — ⚠️
    [NIEWERYFIKOWANE, czy istnieje nowszy t.j.]

⭐ ART. 56A — MAGAZYNOWANIE wyrobów przez podmiot pośredniczący (poza
  składem podatkowym, w miejscu przez niego wskazanym) — ⚠️ [treść
  szczegółowa NIE odczytana w tej sesji, tylko sygnalizacja
  istnienia]

⭐⭐ ZABEZPIECZENIE PRZY IMPORCIE: wyroby akcyzowe wprowadzane przez
  podmiot pośredniczący w drodze IMPORTU obejmuje się zabezpieczeniem
  złożonym w TRYBIE stosowanym przy zabezpieczeniu NALEŻNOŚCI CELNYCH
  (na podstawie przepisów prawa celnego — powiązanie z
  `mod-UCC-clo-taryfa-celna.md`) — zabezpieczenie gwarantuje pokrycie
  zobowiązania mogącego powstać przy UŻYCIU NIEZGODNYM Z PRZEZNACZENIEM
  lub naruszeniu warunków zwolnienia

⭐ ZNACZENIE PRAKTYCZNE: podmiot pośredniczący to kluczowe ogniwo w
  łańcuchu dostaw wyrobów zwolnionych ze względu na przeznaczenie
  (paliwa lotnicze/żeglugowe, węglowodory gazowe do celów opałowych,
  alkohol etylowy skażony, oleje smarowe — katalog z rozporządzenia MF
  ws. zwolnień). Naruszenie warunków zwolnienia przez podmiot
  zużywający/pośredniczący (np. powrotna dostawa do składu podatkowego
  z naruszeniem procedury dokumentu dostawy) rodzi obowiązek zapłaty
  akcyzy po stronie podmiotu pośredniczącego/zużywającego (art. 8
  ust. 2 pkt 2 u.p.a. — powiązanie z sekcją 1 tego modułu).
```

---

## 1i. ⭐⭐ EWIDENCJE I INNE DOKUMENTACJE (Dział VIA, art. 138a-138ta)
(uzupełnienie luki #25, dodano 2026-08-11 — transza 2)

Zweryfikowano: lexlege.pl, gofin.pl (Rząd 2A/2B, zgodne), oraz
**podatki.gov.pl (Rząd 1)** — bezpośrednie potwierdzenie formy
prowadzenia i rozporządzenia wykonawczego; isp-modzelewski.pl (Rząd 3).

```
⭐⭐ KATALOG EWIDENCJI (wg podmiotu/wyrobu — przykłady, katalog art.
  138a-138o NIE jest wyczerpująco wymieniony w tej sesji, tylko
  najważniejsze pozycje):
  → art. 138a — EWIDENCJA WYROBÓW AKCYZOWYCH SKŁADU PODATKOWEGO —
    prowadzi podmiot prowadzący skład podatkowy; operator logistyczny
    prowadzący skład dodatkowo prowadzi ewidencję wyrobów
    NIEAKCYZOWYCH (innych niż wyposażenie składu)
  → art. 138c — ewidencja PRZEDSTAWICIELA PODATKOWEGO (wyrobów
    nabywanych wewnątrzwspólnotowo, dostarczanych przez wysyłający
    podmiot zagraniczny) oraz zarejestrowanego odbiorcy/podatnika WNT
  → art. 138h — EWIDENCJA ILOŚCIOWA ENERGII ELEKTRYCZNEJ — prowadzą:
    (1) podatnik sprzedający energię nabywcy końcowemu, (2) podatnik
    zużywający energię w określonych przypadkach z art. 9 ust. 1 pkt
    3-4; ⚠️ WYJĄTEK dla małych producentów OZE (JST) — gdy moc
    generatorów ≤1 MW, JST prowadzi ewidencję tylko w zakresie danej
    jednostki organizacyjnej
  → art. 138o — dokumentowanie czynności przy PRODUKCJI PIWA LUB WINA

⭐⭐⭐ ART. 138P — FORMA PROWADZENIA (kluczowy przepis proceduralny):
  → ewidencje z art. 138a-138l ORAZ art. 138o (piwo/wino) — prowadzi
    się w postaci PAPIEROWEJ lub ELEKTRONICZNEJ (wybór podmiotu)
  → ⭐ MOŻLIWOŚĆ ZASTĄPIENIA: ewidencje z art. 138a-138c i 138e-138l
    MOGĄ zostać ZASTĄPIONE dokumentacją prowadzoną na podstawie innych
    przepisów prawa podatkowego (niż akcyzowe) LUB przepisów o
    RACHUNKOWOŚCI — POD WARUNKIEM że ta dokumentacja zawiera
    WSZYSTKIE dane wymagane dla danej ewidencji akcyzowej (⭐
    powiązanie z `mod-ustawa-rachunkowosci.md` — księgi rachunkowe
    prowadzone dla celów u.o.r. mogą w praktyce zaspokoić RÓWNIEŻ
    obowiązek ewidencyjny z u.p.a., o ile spełniają komplet wymogów)
  → rozporządzenie wykonawcze: rozporządzenie MF z 22.12.2023 r. ws.
    ewidencji, dokumentacji i protokołów dotyczących wyrobów
    akcyzowych i znaków akcyzy — potwierdzone BEZPOŚREDNIO w
    podatki.gov.pl (Rząd 1, wyjaśnienie MF): forma papierowa i
    elektroniczna nadal DOPUSZCZALNE (informacja aktualna wg
    komunikatu MF)

⭐ TERMIN PRZECHOWYWANIA: ewidencje i dokumentacje z art. 138a-138o
  przechowuje się DO CELÓW KONTROLI przez okres **5 LAT**, licząc od
  KOŃCA ROKU KALENDARZOWEGO, w którym zostały sporządzone — ⭐
  powiązanie: identyczny okres 5 lat jak przedawnienie kar pieniężnych
  z art. 138u (sekcja 1c) — spójność systemowa terminu

⭐ ZNACZENIE PRAKTYCZNE: obowiązki ewidencyjne dotyczą niemal KAŻDEGO
  podmiotu prowadzącego działalność w obrocie wyrobami akcyzowymi —
  brak prawidłowej ewidencji jest częstą podstawą zakwestionowania
  prawa do zwolnienia/stawki preferencyjnej w kontrolach celno-
  -skarbowych, niezależnie od tego, czy sama czynność materialnie
  podlegała opodatkowaniu.
```

---

## 1j. ⭐⭐ PRZEMIESZCZANIE POZA PROCEDURĄ ZAWIESZENIA — SYSTEM (e-DD)
(Dział III rozdz. 1a-1b, art. 46a-46w)
(uzupełnienie luki #11, dodano 2026-08-11 — transza 3)

Zweryfikowano: lexlege.pl, arslege.pl, gofin.pl (Rząd 2A/2B, zgodne
wieloźródłowo, gofin.pl potwierdza t.j. 2026.412), dlajurysty.pl.

```
⭐⭐⭐ ART. 46A — MECHANIZM I ZASTOSOWANIE: przemieszczanie wyrobów
  akcyzowych na terytorium kraju POZA procedurą zawieszenia poboru
  akcyzy odbywa się z użyciem SYSTEMU (elektroniczny system
  monitorowania — powiązany z, lecz ODRĘBNY od EMCS opisanego w
  sekcji 1 dla procedury zawieszenia), na podstawie **e-DD**
  (elektroniczny dokument dostawy) albo dokumentu ZASTĘPUJĄCEGO e-DD
  → GŁÓWNE ZASTOSOWANIE (katalog przykładowy z art. 46a pkt 1):
    wyroby OBJĘTE ZWOLNIENIEM ze względu na przeznaczenie
    przemieszczane m.in.: (a) ze składu podatkowego DO podmiotu
    pośredniczącego, (b) OD podmiotu pośredniczącego do składu
    podatkowego w celu ZWROTU, (c) ze składu podatkowego DO podmiotu
    zużywającego, (d) OD podmiotu zużywającego do składu w celu
    zwrotu, (e) MIĘDZY podmiotem pośredniczącym a zużywającym
    (obustronnie) — ⭐ powiązanie z sekcją 1h (podmiot pośredniczący)
    i definicją podmiotu zużywającego
  → RÓWNIEŻ obejmuje: monitorowanie SPRZEDAŻY WYROBÓW WĘGLOWYCH z
    użyciem Systemu (nazwa rozdziału to sygnalizuje wprost)

⭐⭐ TERMIN ZAKOŃCZENIA PRZEMIESZCZANIA: **30 DNI** od dnia wysłania
  wyrobów wskazanego w e-DD (lub dokumencie zastępującym)
  → dla wyrobów WĘGLOWYCH (monitorowanie sprzedaży, art. 46na): termin
    dłuższy — podmiot wysyłający dokonuje czynności kończących
    monitorowanie w terminie **47 DNI** od dnia sprzedaży (⚠️ termin
    ODRĘBNY od ogólnego 30-dniowego, analogicznie do wzorca "wyroby
    węglowe = termin wydłużony", znanego już z sekcji 1g dla
    deklaracji podatkowych węgla)

⭐ POTWIERDZENIE ODBIORU (art. 46j): podmiot odbierający, który NIE
  jest użytkownikiem Systemu, potwierdza odbiór i przekazuje
  potwierdzenie podmiotowi wysyłającemu NIEZWŁOCZNIE po odbiorze (o
  ile nie otrzymał wcześniej informacji o zamiarze kontroli celno-
  -skarbowej odbieranych wyrobów) — możliwe potwierdzenie ELEKTRONICZNE
  za pomocą urządzenia odwzorowującego pismo własnoręczne (czytelny
  podpis z imieniem i nazwiskiem)
  → ⭐ POWIĄZANIE Z SEKCJĄ 1c: brak sporządzenia projektu raportu
    odbioru lub nieprzedstawienie dokumentu zastępującego w terminie
    (art. 46i ust. 2) → KARA PIENIĘŻNA 5000 zł z art. 138u

⭐ ZAKOŃCZENIE PRZY WYWOZIE POZA UE (art. 46m): w Systemie tworzony
  jest RAPORT WYWOZU na podstawie informacji z elektronicznego systemu
  obsługi eksportu, potwierdzający wyprowadzenie wyrobów poza
  terytorium UE — po weryfikacji kompletności automatycznie przesyłany
  do podmiotu wysyłającego

⭐ ZNACZENIE PRAKTYCZNE: mechanizm e-DD (System) obsługuje najczęstszy
  w praktyce scenariusz — dostawy zwolnionych wyrobów akcyzowych
  między składem podatkowym, podmiotem pośredniczącym i podmiotem
  zużywającym. Uchybienia formalne w raportach odbioru są typowym
  źródłem sporów zakończonych karą pieniężną (sekcja 1c) lub
  zakwestionowaniem prawa do zwolnienia.
```

---

## 1k. ⭐⭐ WYROBY AKCYZOWE POZA PROCEDURĄ ZAWIESZENIA — UDT
(Dział III rozdz. 7, art. 77-83a)
(uzupełnienie luki #16, dodano 2026-08-11 — transza 3; ⚠️ NIE mylić z
Systemem/e-DD z sekcji 1j — UDT dotyczy WYŁĄCZNIE obrotu
WEWNĄTRZUNIJNEGO wyrobami Z ZAPŁACONĄ akcyzą)

Zweryfikowano: **finanse-arch.mf.gov.pl (Rząd 1, archiwum MF)**,
e-prawnik.pl, interpretacje.pl, dlajurysty.pl, prawnik.cc,
podatekakcyzowy.pl (Rząd 2A/3, zgodne wieloźródłowo).

```
⭐⭐⭐ ART. 77 — UPROSZCZONY DOKUMENT TOWARZYSZĄCY (UDT) — DEFINICJA I
  ZASTOSOWANIE: dokument, na którego podstawie przemieszcza się, w
  ramach DOSTAWY wewnątrzwspólnotowej lub NABYCIA wewnątrzwspólnotowego
  (WNT), wyroby akcyzowe Z ZAPŁACONĄ AKCYZĄ (art. 2 pkt 16) — ⭐
  KLUCZOWE ROZRÓŻNIENIE: UDT stosuje się WYŁĄCZNIE dla wyrobów
  wymienionych w zał. nr 2 do ustawy, ZNAJDUJĄCYCH SIĘ POZA procedurą
  zawieszenia poboru akcyzy (czyli już dopuszczonych do konsumpcji) —
  NIE dla wyrobów objętych zwolnieniem ze względu na przeznaczenie
  (dla tych — System/e-DD z sekcji 1j)
  → art. 77 ust. 2 — UDT MOŻE BYĆ ZASTĄPIONY dokumentem HANDLOWYM,
    jeżeli zawiera te same dane co UDT — do dokumentu handlowego
    stosuje się wówczas ODPOWIEDNIO przepisy o UDT

⭐⭐ STRUKTURA DOKUMENTU (3 karty — potwierdzone praktyką MF):
  → KARTA 1 — pozostaje u WYSYŁAJĄCEGO wyroby
  → KARTA 2 — dołączana do wysyłanych wyrobów, pozostaje u
    ODBIERAJĄCEGO (przechowywanie: 5 LAT od końca roku kalendarzowego
    otrzymania wyrobów — ⭐ ten sam okres co ewidencje z sekcji 1i)
  → KARTA 3 — dołączana do wyrobów, po POTWIERDZENIU ODBIORU przez
    odbierającego jest PRZEKAZYWANA z powrotem do dostawcy w państwie
    członkowskim wysyłki (służy m.in. do uzyskania zwrotu akcyzy
    zapłaconej w państwie wysyłki)

⭐⭐⭐ ART. 78 — OBOWIĄZKI PODATNIKA NABYWAJĄCEGO WEWNĄTRZWSPÓLNOTOWO
  (przy WNT wyrobów z zał. nr 2, poza procedurą zawieszenia, na
  potrzeby działalności gospodarczej):
  1) PRZED wprowadzeniem wyrobów na terytorium kraju — ZGŁOSZENIE o
     planowanym WNT do właściwego naczelnika US
  2) potwierdzenie ODBIORU na UDT (z wyjątkami wynikającymi z
     rozporządzenia Komisji (EWG) nr 3649/92)
  3) BEZ WEZWANIA organu — złożenie DEKLARACJI UPROSZCZONEJ wg wzoru +
     obliczenie i ZAPŁATA akcyzy — TERMIN: **10 DNI** od dnia
     powstania obowiązku podatkowego — ⚠️ TYLKO gdy nabywane wyroby są
     opodatkowane w kraju stawką INNĄ niż zerowa (jeśli stawka zerowa
     — obowiązek deklaracji/zapłaty NIE powstaje z tego tytułu)
  4) ZŁOŻENIE ZABEZPIECZENIA akcyzowego — przed wyprowadzeniem wyrobów
     z miejsca wysyłki (analogicznie jak przy zerowej stawce — dotyczy
     wyrobów opodatkowanych stawką inną niż zerowa)

⭐ ART. 78A — OGRANICZENIE NABYWANIA PALIW SILNIKOWYCH na potrzeby
  działalności gospodarczej — ⚠️ [treść szczegółowa NIE odczytana w
  tej sesji, tylko sygnalizacja istnienia — istotne przy doradztwie
  dla przewoźników/stacji paliw]

⭐ ART. 79-81 — PRZEDSTAWICIEL PODATKOWY: nabycie wyrobów za
  pośrednictwem przedstawiciela podatkowego (art. 79), obowiązki
  wysyłającego podmiotu zagranicznego bez przedstawiciela (art. 79a),
  instytucja przedstawiciela podatkowego (art. 80) i zezwolenie na
  wykonywanie czynności w tym charakterze (art. 81) — ⚠️ [struktura
  tylko sygnalizowana, nieopisana szczegółowo]

⭐ ART. 83A — REKLAMACJA wyrobów akcyzowych z zapłaconą akcyzą,
  UZNANEJ przez podatnika — mechanizm korekty przy uznanych reklamacjach

⭐ ZNACZENIE PRAKTYCZNE: UDT to podstawowy dokument dla handlu
  hurtowego wyrobami akcyzowymi (głównie paliwa, alkohol) w OBROCIE
  WEWNĄTRZUNIJNYM z zapłaconą już akcyzą — częsty temat sporów o
  prawidłowość zgłoszenia WNT i dotrzymanie terminu 10-dniowego na
  deklarację uproszczoną (analogia do terminu 14-dniowego dla
  samochodów osobowych z sekcji 1d — RÓŻNE terminy dla różnych
  kategorii wyrobów, wymagają odrębnej weryfikacji per sprawa).
```

---

## 1l. ⭐⭐ ZEZWOLENIA AKCYZOWE — MECHANIZM ZBIORCZY (Dział III rozdz. 8,
art. 84) I PRZEDSIĘBIORSTWO W SPADKU (Dział III rozdz. 8a, art. 84a-84f)
(uzupełnienie luk #17 i #18, dodano 2026-08-11 — transza 3)

Zweryfikowano: lexlege.pl, gofin.pl, prawnik.cc (Rząd 2A/2B, zgodne
wieloźródłowo).

```
⭐⭐⭐ ART. 84 — PRZEPIS ZBIORCZY dla wydania/odmowy/zmiany/cofnięcia
  WSZYSTKICH zezwoleń akcyzowych wymienionych w ustawie (pkt 1-5, m.in.
  zezwolenie na prowadzenie składu podatkowego, na nabywanie wyrobów
  jako zarejestrowany odbiorca, na wysyłanie jako zarejestrowany
  wysyłający, na działalność jako podmiot pośredniczący z sekcji 1h,
  na wykonywanie czynności jako przedstawiciel podatkowy)
  → ⭐ TECHNIKA LEGISLACYJNA: ustawa NIE powtarza w każdym miejscu
    identycznych przesłanek — art. 84 zbiorczo ODSYŁA do przepisu
    "macierzystego" dla danego rodzaju zezwolenia (np. dla
    przedstawiciela podatkowego — odpowiednie stosowanie art. 52 ust.
    1 pkt 1-2 przy odmowie i art. 52 ust. 2-5 przy cofnięciu/
    wygaśnięciu — czyli PRZESŁANKI ANALOGICZNE jak przy zezwoleniu na
    prowadzenie składu podatkowego)
  → PRZESŁANKI ODMOWY/COFNIĘCIA (wzorzec z art. 48, stosowany
    odpowiednio): m.in. NIEZŁOŻENIE zabezpieczenia akcyzowego (poza
    wyjątkiem zwolnienia składu z art. 64), oraz — istotna
    przesłanka NEGATYWNA — COFNIĘCIE, ze względu na naruszenie prawa,
    JAKIEGOKOLWIEK z posiadanych zezwoleń akcyzowych, koncesji lub
    zezwolenia na działalność gospodarczą, ALBO wydanie decyzji o
    ZAKAZIE wykonywania działalności regulowanej w rozumieniu Prawa
    przedsiębiorców — w zakresie wyrobów akcyzowych
    ⭐ WYJĄTEK: przesłanka NIE dotyczy ROLNIKÓW występujących o
    zezwolenie na prowadzenie składu podatkowego przeznaczonego do
    działalności zgodnej z ustawą o biokomponentach i biopaliwach
    ciekłych

⭐⭐⭐ ART. 84A-84F — PRZEDSIĘBIORSTWO W SPADKU (kontynuacja
  działalności akcyzowej po śmierci przedsiębiorcy):
  → art. 84a — WARUNKI CIĄGŁOŚCI obowiązywania decyzji i zezwoleń
    akcyzowych posiadanych przez ZMARŁEGO przedsiębiorcę
  → art. 84b — działalność przedsiębiorstwa w spadku NA PODSTAWIE
    zezwolenia akcyzowego posiadanego przez zmarłego (kontynuacja BEZ
    konieczności uzyskania nowego zezwolenia od zera)
  → art. 84c — analogicznie dla DECYZJI O WPISIE do rejestru PPT
    (powiązanie z sekcją 1f)
  → art. 84d — ZWOLNIENIE przedsiębiorstwa w spadku z obowiązku
    złożenia ZABEZPIECZENIA akcyzowego (powiązanie z sekcją 1a) — w
    określonym zakresie/okresie
  → art. 84e — zmiana decyzji/zezwolenia akcyzowego W TRAKCIE trwania
    ZARZĄDU SUKCESYJNEGO
  → ⭐ NASTĘPSTWO PRAWNE: jeden z następców prawnych zmarłego
    przedsiębiorcy może WSTĄPIĆ w prawa i obowiązki wynikające z
    zezwoleń/decyzji akcyzowych (w tym wpisu PPT) — również w
    kontekście PRAWA DO STOSOWANIA ZNAKÓW AKCYZY (powiązanie z sekcją
    1c — Dział VI)
  → PODSTAWA USTAWOWA SUKCESJI: ustawa z 5.07.2018 o zarządzie
    sukcesyjnym przedsiębiorstwem osoby fizycznej i innych
    ułatwieniach związanych z sukcesją przedsiębiorstw — mechanizm
    akcyzowy jest KONSEKWENCJĄ tej ustawy, nie tworzy odrębnego reżimu
    sukcesji

⭐ ZNACZENIE PRAKTYCZNE: mechanizm przedsiębiorstwa w spadku pozwala
  UNIKNĄĆ przerwania działalności akcyzowej (skład podatkowy, PPT) w
  okresie między śmiercią przedsiębiorcy a uregulowaniem sukcesji —
  istotne dla kancelarii przy doradztwie sukcesyjnym klientów
  prowadzących działalność regulowaną (gorzelnie, składy paliw,
  handel tytoniem).
```

---

## 1m. ⭐ POSTĘPOWANIE W PRZYPADKU IMPORTU (Dział II rozdz. 5, art. 27-29a)
(uzupełnienie luki #8, dodano 2026-08-11 — transza 3)

Zweryfikowano: lexlege.pl, arslege.pl, dlajurysty.pl (Rząd 2A/2B,
zgodne), poradypodatkowe.pl, poradnikprzedsiebiorcy.pl (Rząd 3).

```
⭐⭐ ART. 27 — OBOWIĄZEK OBLICZENIA I WYKAZANIA AKCYZY PRZY IMPORCIE:
  podatnik obliczaj i wykazuje kwotę akcyzy (z uwzględnieniem
  obowiązujących stawek) w JEDNYM z trzech dokumentów:
  1) w ZGŁOSZENIU CELNYM (reguła podstawowa)
  2) przy stosowaniu UPROSZCZEŃ (art. 166 i art. 182 unijnego kodeksu
     celnego) — w zgłoszeniu UPROSZCZONYM lub wpisie do rejestru
     zgłaszającego ORAZ w zgłoszeniu UZUPEŁNIAJĄCYM
  3) w ROZLICZENIU ZAMKNIĘCIA (art. 175 rozporządzenia delegowanego
     UE 2015/2446 — kontekst UCC, powiązanie z `mod-UCC-clo-taryfa-
     celna.md`)
  → OBNIŻENIE kwoty akcyzy: o wartość PODATKOWYCH ZNAKÓW AKCYZY
    prawidłowo naniesionych na wyroby/opakowania objęte zgłoszeniem
    celnym (powiązanie z sekcją 1c — znaki akcyzy)
  → PRZY PROCEDURZE ZAWIESZENIA LUB ZWOLNIENIU: obowiązek zamieszczenia
    w dokumentach INFORMACJI o kwocie akcyzy, która BYŁABY należna,
    gdyby wyroby nie były objęte zawieszeniem/zwolnieniem (art. 27
    ust. 3) — mechanizm transparentności dla organu

⭐⭐ ART. 27 UST. 5-7 — ŚCIEŻKA WERYFIKACJI KWOTY:
  → PO przyjęciu zgłoszenia celnego — podatnik MOŻE wystąpić o
    wydanie DECYZJI naczelnika urzędu celno-skarbowego określającej
    kwotę akcyzy w NALEŻNEJ wysokości (fakultatywne, na wniosek)
  → w przypadkach INNYCH niż podstawowe (ust. 1, 4-5) — naczelnik
    URZĘDU CELNO-SKARBOWEGO SAM określa kwotę w drodze DECYZJI
  → PRZY DECYZJI: podatnik OBOWIĄZANY w terminie **10 DNI** od
    doręczenia zapłacić RÓŻNICĘ między akcyzą z decyzji a akcyzą już
    pobraną, WRAZ Z ODSETKAMI za zwłokę (liczonymi od dnia
    następującego po powstaniu obowiązku podatkowego do dnia
    powiadomienia o wysokości należności) — stosuje się przepisy
    Ordynacji podatkowej o odsetkach

⭐ POWIĄZANIE Z ART. 29 (przedawnienie długu celnego): do postępowań
  z art. 27 ust. 4-6a oraz art. 29 (określenie elementów
  kalkulacyjnych w razie PRZEDAWNIENIA długu celnego) stosuje się
  ODPOWIEDNIO przepisy UCC (art. 5, 18, 19, 22-23, 27-28) — ⭐
  powiązanie strukturalne z `mod-UCC-clo-taryfa-celna.md`, gdzie
  omówione są te przepisy w kontekście celnym

⭐ ZNACZENIE PRAKTYCZNE: import wyrobów akcyzowych (najczęściej: alkohol
  spoza UE, wyroby tytoniowe, niektóre wyroby energetyczne) wymaga
  ŁĄCZNEGO stosowania przepisów akcyzowych I celnych — trzy różne
  dokumenty rozliczeniowe (zgłoszenie celne / uproszczone / rozliczenie
  zamknięcia) odpowiadają różnym procedurom celnym, co bywa źródłem
  pomyłek przy doradztwie importerom.
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

⚠️ Weryfikuj aktualne przepisy o WIA w ustawie akcyzowej (Dz.U. 2026 poz. 412 t.j. — poprawione 2026-08-11, potwierdzone BEZPOŚREDNIO w Rządzie 1: isap.sejm.gov.pl, eli.gov.pl, api.sejm.gov.pl — obwieszczenie Marszałka Sejmu z 12.03.2026, stan prawny na 10.03.2026) w ISAP.
web_search: "WIA wiążąca informacja akcyzowa wniosek termin 2025 2026"
```

---

## ⭐⭐⭐ MAPA POKRYCIA DZIEDZINY AKCYZOWEJ — UCZCIWA SAMOOCENA
(dodano 2026-08-11, na żądanie użytkownika, analogicznie do metodologii
zastosowanej przy `mod-ustawa-rachunkowosci.md`)

Ustawa o podatku akcyzowym (Dz.U. 2026 poz. 412 t.j.) ma **9 działów
głównych**, ok. 170 artykułów. Struktura zweryfikowana w Rządzie 2A/2B
(lexlege.pl, gofin.pl — zgodne).

OZNACZENIA: 🟢 PEŁNE pokrycie | 🟡 CZĘŚCIOWE (wzmianka/fragment) |
🔴 BRAK pokrycia (temat NIEOBECNY)

| # | Dział / instytucja | Zakres art. | Pokrycie | Uwagi |
|---|---|---|---|---|
| 1 | Przepisy ogólne (definicje, CN, zakres) | Dział I, 1-7c | 🟡 CZĘŚCIOWE | Definicja wyrobów akcyzowych (art. 2) via tabela stawek; brak systematyki art. 1, 3, 6, 7-7c |
| 2 | Wiążąca Informacja Akcyzowa (WIA) | Dział IA, 7d-7k | 🟢 PEŁNE | Aneks na końcu modułu |
| 3 | Przedmiot opodatkowania, obowiązek podatkowy | Dział II rozdz. 1, 8-12 | 🟡 CZĘŚCIOWE | Wzmiankowe, brak systematycznego katalogu czynności opodatkowanych |
| 4 | Podatnik akcyzy, właściwość organów | Dział II rozdz. 2, 13-15 | 🟢 PEŁNE | Sekcja 1, katalog 4 kategorii podatników |
| 5 | Rejestracja podmiotów | Dział II rozdz. 3, 16-20 | 🟢 PEŁNE (2026-08-11, transza 2) | Nowa sekcja 1e — CRPA, termin przed pierwszą czynnością, wyłączenia (PPT, oleje), sankcja KKS + czynny żal |
| 6 | Rejestracja pośredniczących podmiotów tytoniowych | Dział II rozdz. 3a, 20a-20o | 🟢 PEŁNE (2026-08-11, transza 2) | Nowa sekcja 1f — rejestr ODRĘBNY od CRPA, Dyrektor IAS w Poznaniu (właściwość centralna) |
| 7 | Deklaracja podatkowa, terminy płatności | Dział II rozdz. 4, 21-26 | 🟢 PEŁNE (2026-08-11, transza 2) | Nowa sekcja 1g — reguła ogólna 25. dnia, terminy szczególne (węgiel: 2. miesiąc), przedpłata, forma elektroniczna obowiązkowa |
| 8 | Postępowanie przy imporcie | Dział II rozdz. 5, 27-29a | 🟢 PEŁNE (2026-08-11, transza 3) | Nowa sekcja 1m — trzy dokumenty rozliczeniowe, decyzja naczelnika, termin 10 dni na dopłatę różnicy |
| 9 | Zwolnienia (katalog ogólny) | Dział II rozdz. 6, 30-39 | 🟡 CZĘŚCIOWE | Energochłonni + gaz do napędu; brak systematyki art. 30-39 |
| 10 | Procedura zawieszenia poboru akcyzy | Dział III rozdz. 1, 40-46 | 🟢 PEŁNE | Sekcja 1, diagram EMCS |
| 11 | Przemieszczanie poza zawieszeniem (System) | Dział III rozdz. 1a-1b, 46a-46w | 🟢 PEŁNE (2026-08-11, transza 3) | Nowa sekcja 1j — e-DD, termin 30 dni (węgiel: 47), potwierdzenie odbioru, powiązanie z karą art. 138u |
| 12 | Składy podatkowe | Dział III rozdz. 2, 47-55 | 🟡 CZĘŚCIOWE | Wzmiankowane, brak warunków prowadzenia/zezwoleń |
| 13 | Podmiot pośredniczący | Dział III rozdz. 3, 56-56a | 🟢 PEŁNE (2026-08-11, transza 2) | Nowa sekcja 1h — definicja, warunki zezwolenia (art. 56), czas trwania max 3 lata, zabezpieczenie importowe |
| 14 | Zarejestrowani odbiorcy / handlowcy | Dział III rozdz. 4-5, 57-62c | 🟡 CZĘŚCIOWE | — |
| 15 | ⭐⭐⭐ Zabezpieczenie akcyzowe | Dział III rozdz. 6, 63-76 | 🟢 PEŁNE (2026-08-11) | Nowa sekcja 1a — generalne/ryczałtowe, 5 form (art. 67), hipoteka, weksel |
| 16 | Wyroby poza procedurą zawieszenia | Dział III rozdz. 7, 77-83a | 🟢 PEŁNE (2026-08-11, transza 3) | Nowa sekcja 1k — UDT (3 karty), obowiązki nabywcy WNT, termin 10 dni na deklarację uproszczoną |
| 17 | Zezwolenia akcyzowe | Dział III rozdz. 8, 84 | 🟢 PEŁNE (2026-08-11, transza 3) | Nowa sekcja 1l — mechanizm zbiorczy (odesłania do przepisów macierzystych), przesłanki odmowy/cofnięcia, wyjątek rolniczy |
| 18 | Przedsiębiorstwo w spadku | Dział III rozdz. 8a, 84a-84f | 🟢 PEŁNE (2026-08-11, transza 3) | Nowa sekcja 1l — ciągłość zezwoleń/decyzji, zwolnienie z zabezpieczenia, następstwo prawne |
| 19 | ⭐⭐ Normy dopuszczalnych ubytków | Dział III rozdz. 9, 85 | 🟢 PEŁNE (2026-08-11) | Nowa sekcja 1b — dwa tryby ustalania, kryteria, rozliczenie ponad normę |
| 20 | Wyroby energetyczne i energia elektryczna | Dział IV rozdz. 1, 86-91b | 🟡 CZĘŚCIOWE→ZAAWANSOWANE | Stawki + case studies (węgiel/gaz, olej opałowy) bardzo dobre; brak systematyki zwolnień art. 89-91b |
| 21 | Napoje alkoholowe | Dział IV rozdz. 2, 92-97a | 🟡 CZĘŚCIOWE | Tylko stawki; brak zwolnień, małych browarów/gorzelni |
| 22 | Wyroby tytoniowe/nikotynowe | Dział IV rozdz. 3, 98-99d | 🟢 PEŁNE (case study) | E-papierosy, automaty do papierosów |
| 23 | ⭐⭐⭐ Opodatkowanie samochodów osobowych | Dział V, 100-113a | 🟢 PEŁNE (2026-08-11) | Nowa sekcja 1d — przedmiot opodatkowania, terminy 14/30 dni, stawki, zwolnienia elektryki/hybrydy (art. 109a) |
| 24 | ⭐⭐⭐ Znaki akcyzy (banderole) | Dział VI, 114-138w | 🟢 PEŁNE (2026-08-11) | Nowa sekcja 1c — podatkowe/legalizacyjne, obowiązek art. 114, zakaz sprzedaży art. 117 |
| 25 | Ewidencje i dokumentacja | Dział VIA, 138a-138ta | 🟢 PEŁNE (2026-08-11, transza 2) | Nowa sekcja 1i — katalog ewidencji, forma papierowa/elektroniczna, zastąpienie dokumentacją rachunkową, przechowywanie 5 lat |
| 26 | ⭐⭐⭐ Kary pieniężne (administracyjne) | Dział VIb, 138u-138w | 🟡 CZĘŚCIOWE (2026-08-11) | Nowa sekcja 1c — mechanizm ogólny (5000 zł, 7 dni, przedawnienie 5 lat) na przykładzie art. 138u/138w; POZOSTAŁE przesłanki Działu VIb nieopisane szczegółowo |
| 27 | Przepisy karne skarbowe (via KKS) | poza u.p.a. | 🟢 PEŁNE | Sekcja 3 |

⭐ PODSUMOWANIE LICZBOWE (2026-08-11, transza 3 — WSZYSTKIE luki 🔴
  DOMKNIĘTE): z 27 zidentyfikowanych głównych podtematów —
  🟢 PEŁNE: **19 (70%)**, 🟡 CZĘŚCIOWE: **8 (30%)**, 🔴 BRAK: **0 (0%)**
  → stan przed sesją uzupełniającą (transza 1): 🟢 5 (19%) / 🟡 9 (33%) / 🔴 13 (48%)
  → transza 1 (2026-08-11): domknięto #15, #19, #23, #24; #26
    podniesiono z 🔴 do 🟡
  → transza 2 (2026-08-11): domknięto #5, #6, #7, #13, #25
  → transza 3 (2026-08-11): domknięto #8, #11, #16, #17, #18 —
    OSTATNIE pozycje 🔴 mapy

⭐⭐ ŻADNA pozycja mapy NIE jest już oznaczona 🔴. Pozostałe 8 pozycji
  🟡 (CZĘŚCIOWE, nie BRAK) — wymagają ROZSZERZENIA istniejącej treści,
  nie tworzenia od zera:
  #1 (przepisy ogólne — art. 1, 3, 6, 7-7c), #3 (przedmiot
  opodatkowania poza samochodami — art. 8-12), #9 (zwolnienia ogólne
  art. 30-39, poza już opisanymi wyjątkami energochłonnych/gazu), #12
  (składy podatkowe — warunki prowadzenia, poza zabezpieczeniem już
  opisanym w 1a), #14 (zarejestrowani odbiorcy/handlowcy — art.
  57-62c), #20-21 (zwolnienia w Dziale IV — wyroby energetyczne/
  alkohol poza case studies), #26 (pełny katalog kar pieniężnych poza
  art. 138u/138w)

⚠️ ŚWIADOMIE NIEZAMKNIĘTE w tej sesji — bez zgadywania (ZASADA 1,
  ZASADA 13):
  - Rozporządzenie MF z 21.12.2018 ws. zabezpieczeń akcyzowych — czy
    istnieje nowszy t.j.: NIE zweryfikowane
  - Pełny katalog zwolnień z obowiązku oznaczania (art. 118) — poza
    ogólną wzmianką
  - Pełna treść art. 110-112 (zwolnienia samochodowe poza elektrykami/
    hybrydami) — struktura tylko sygnalizowana
  - Konkretne przesłanki i kwoty pozostałych kar pieniężnych Działu
    VIb poza art. 138u/138w


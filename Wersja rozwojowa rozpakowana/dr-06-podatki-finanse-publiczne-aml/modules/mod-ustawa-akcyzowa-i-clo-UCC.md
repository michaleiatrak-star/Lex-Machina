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

**Wersja:** 1.7 | **Rozbudowano:** 2026-08-13 — ETAP audytu pokrycia
per dział ustawy (pierwszy systematyczny audyt akcyzy, analogiczny do
wielokrotnie już przeprowadzanego dla VAT). Domknięto Działy II
(rejestracja CRPA, deklaracje/terminy, zwolnienia), III (składy
podatkowe, zabezpieczenie akcyzowe), V (samochody osobowe), VI (znaki
akcyzy — podatkowe/legalizacyjne), VIA (ewidencje), VIb (kary
pieniężne) — patrz nowa Sekcja 1a. Rozbudowano też Dział IA (WIA) —
✅ ISTOTNA KOREKTA: organ właściwy zmienił się 1.07.2023 r. z
Dyrektora IAS we Wrocławiu na Dyrektora KIS, poprzednia wersja
sekcji WIA była nieaktualna. Dotąd moduł był silny w stawkach i
kilku tematach szczegółowych (węgiel/gaz, olej opałowy, e-papierosy),
ale miał poważne luki w rdzeniu proceduralnym ustawy.

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

## 1a. AUDYT POKRYCIA PER DZIAŁ USTAWY — DOMKNIĘCIE (2026-08-13,
na żądanie użytkownika, PIERWSZY tego rodzaju systematyczny audyt
akcyzy w systemie, analogiczny do wielokrotnie już przeprowadzanego
dla VAT)

⚠️ DOTYCHCZASOWY stan modułu BYŁ silny W stawkach i kilku tematach
SZCZEGÓŁOWYCH (węgiel/gaz, olej OPAŁOWY, e-papierosy), ALE miał
POWAŻNE luki systemowe W rdzeniu PROCEDURALNYM ustawy — poniżej
DOMKNIĘCIE Działów II (rejestracja/deklaracje/zwolnienia), III
(składy podatkowe/zabezpieczenie), V (samochody osobowe), VI (znaki
akcyzy), VIA (ewidencje), VIb (kary pieniężne).

### 1a.1. Dział II rozdz. 3 — Rejestracja podmiotów (art. 16–20)

```
CENTRALNY REJESTR PODMIOTÓW AKCYZOWYCH (CRPA) — OD 1.02.2021 r.
  ZASTĄPIŁ dotychczasowe PAPIEROWE formularze AKC-R/AKC-Z ORAZ
  rejestry prowadzone PRZEZ naczelników US.

OBOWIĄZEK REJESTRACJI (art. 16 ust. 1): dotyczy PODATNIKÓW akcyzy
  ORAZ szeregu INNYCH podmiotów (NIE tylko podatników) — W
  SZCZEGÓLNOŚCI: podmiotów PROWADZĄCYCH działalność gospodarczą W
  zakresie wyrobów AKCYZOWYCH, podmiotów ZUŻYWAJĄCYCH wyroby akcyzowe
  ZWOLNIONE od akcyzy ZE względu na PRZEZNACZENIE, pośredniczących
  PODMIOTÓW węglowych/gazowych. ⭐ art. 16 ust. 1a (DODANY): zgłoszenia
  MOŻE dokonać RÓWNIEŻ osoba fizyczna NIEPROWADZĄCA działalności
  gospodarczej, ZUŻYWAJĄCA zwolnione węglowodory gazowe DO celów
  OPAŁOWYCH (art. 32 ust. 1 pkt 3).
  ⭐ WYŁĄCZENIA z obowiązku REJESTRACJI w CRPA: pośredniczące podmioty
  OLEJOWE, zużywające podmioty OLEJOWE, pośredniczące podmioty
  TYTONIOWE — MIMO że TE kategorie SĄ formalnie objęte REŻIMEM
  akcyzowym

TERMIN: PRZED wykonaniem PIERWSZEJ czynności, KTÓREJ przedmiotem SĄ
  wyroby AKCYZOWE (Z odpowiednim WYPRZEDZENIEM, nie PO fakcie)

FORMA: zgłoszenie PODPISUJE się kwalifikowanym PODPISEM elektronicznym,
  podpisem ZAUFANYM, podpisem OSOBISTYM albo zaawansowanym PODPISEM
  elektronicznym Z certyfikatem CELNYM (LUB inny sposób POTWIERDZENIA
  danych W jednostkach organizacyjnych URZĘDU celno-skarbowego przy
  BRAKU podpisu elektronicznego)

⭐⭐⭐ KWALIFIKACJA KARNOSKARBOWA BRAKU REJESTRACJI (art. 56b § 2 KKS):
  "Kto WBREW obowiązkom określonym w art. 16, art. 16b, art. 17 i
  art. 19 ustawy AKCYZOWEJ NIE składa zgłoszenia rejestracyjnego,
  zgłoszenia rejestracyjnego UPROSZCZONEGO, powiadomienia, zgłoszenia
  o ZAPRZESTANIU prowadzenia działalności, ALBO nie zgłasza ZMIANY
  danych W nich zawartych, ALBO składa JE po terminie LUB podaje W
  nich dane NIEZGODNE ze stanem RZECZYWISTYM, PODLEGA karze grzywny
  DO 120 stawek DZIENNYCH" — WYKROCZENIE/przestępstwo skarbowe,
  ⭐ ODRĘBNE od samego NIEZAPŁACENIA akcyzy — sama LUKA rejestracyjna
  jest SAMODZIELNYM czynem ZABRONIONYM
  ⭐⭐ CZYNNY ŻAL (art. 16 KKS): Ministerstwo Finansów WPROST wskazuje,
  że NIE jest skłonne KARAĆ za samo NIEDOPEŁNIENIE wpisu do REJESTRU,
  jeśli PODMIOT złoży skuteczny czynny ŻAL (opisujący ISTOTNE
  okoliczności niedopełnienia OBOWIĄZKU) I JEDNOCZEŚNIE niezwłocznie
  DOKONA zaległej rejestracji — ⭐ PRAKTYCZNA STRATEGIA obronna w
  sprawach Z tego zakresu: łączne ZASTOSOWANIE czynnego żalu Z art.
  16 KKS ORAZ natychmiastowej rejestracji W CRPA
```

### 1a.2. Dział II rozdz. 4 — Deklaracja podatkowa, terminy płatności
(art. 21–26)

```
ZASADA OGÓLNA (art. 21): podatnik SKŁADA właściwemu naczelnikowi US
  deklarację PODATKOWĄ WEDŁUG ustalonego WZORU ORAZ oblicza I wpłaca
  akcyzę NA rachunek WŁAŚCIWEGO urzędu — ZA miesięczne okresy
  ROZLICZENIOWE, W TERMINIE do 25. DNIA miesiąca NASTĘPUJĄCEGO po
  miesiącu, W KTÓRYM powstał OBOWIĄZEK podatkowy (chyba że PRZEPISY
  szczególne STANOWIĄ inaczej)
  ⭐ PRZY zastosowaniu PROCEDURY zawieszenia poboru — TERMIN liczony
  jest OD miesiąca ZAKOŃCZENIA tej procedury SKUTKUJĄCEGO powstaniem
  zobowiązania PODATKOWEGO, nie od momentu WYPRODUKOWANIA/nabycia

TERMINY SZCZEGÓLNE — RÓŻNIĄ się W ZALEŻNOŚCI od rodzaju WYROBU:
  □ WYROBY węglowe (art. 21a): TERMIN wydłużony — DO 25. dnia
    PRZYPADAJĄCEGO W DRUGIM miesiącu OD miesiąca powstania OBOWIĄZKU
    (a WIĘC PRAKTYCZNIE 2 miesiące, NIE 1, W porównaniu Z zasadą
    OGÓLNĄ) — ⭐ WAŻNA różnica DLA praktyki, ŁATWO pomylić Z zasadą
    ogólną
  □ ENERGIA elektryczna (art. 24), susz TYTONIOWY (art. 24a), wyroby
    GAZOWE (art. 24b) — ODRĘBNE przepisy Z własnymi WARIANTAMI
    terminów/formularzy (AKC-EN, AKC-ST, AKC-WG)
  □ PRODUKCJA POZA składem podatkowym (art. 22): PRZEDPŁATA akcyzy —
    obowiązek WPŁATY W wysokości akcyzy JAKA będzie NALEŻNA od
    wyprodukowanych W danym MIESIĄCU wyrobów, W terminie DO ostatniego
    dnia MIESIĄCA POPRZEDZAJĄCEGO miesiąc PRODUKCJI (a WIĘC "Z GÓRY",
    NIE "z dołu" jak PRZY zasadzie ogólnej) — WPŁACONĄ przedpłatę
    ZALICZA się NA poczet akcyzy NALEŻNEJ za ten MIESIĄC
  □ art. 24e — KWARTALNE deklaracje DLA wyrobów WĘGLOWYCH objętych
    zwolnieniem (ALTERNATYWA dla deklaracji MIESIĘCZNEJ, dostępna W
    określonych PRZYPADKACH)

FORMULARZE: system OBEJMUJE deklarację GŁÓWNĄ AKC-4/AKC-4zo (Z
  formularzami SZCZEGÓŁOWYMI AKC-4/A do AKC-4/N WEDŁUG grup wyrobów)
  ORAZ odrębne DEKLARACJE specjalistyczne: AKC-WW/AKC-WWn (WĘGLOWE),
  AKC-EN (energia ELEKTRYCZNA), AKC-ST/AKC-STn (SUSZ tytoniowy),
  AKC-WG (wyroby GAZOWE) — FORMA elektroniczna PRZEZ PUESC jest
  ZASADĄ, papier DOPUSZCZALNY WYJĄTKOWO

⭐ DEKLARACJA "ZEROWA": co DO zasady, JEŻELI podmiot JEST podatnikiem
  akcyzy, ALE W danym miesiącu NIE wystąpiły CZYNNOŚCI powodujące
  obowiązek PODATKOWY, CZĘSTO nie MA obowiązku składania "ZEROWEJ"
  deklaracji — ZALEŻY jednak OD rodzaju działalności I PRZEPISÓW
  szczególnych, W razie WĄTPLIWOŚCI rozważ WNIOSEK o interpretację
  INDYWIDUALNĄ.
```

### 1a.3. Dział II rozdz. 6 — Zwolnienia (art. 30–39)

```
DWIE GŁÓWNE KATEGORIE zwolnień W ustawie:

□ ZWOLNIENIA "STAŁE"/przedmiotowe (art. 30): energia ELEKTRYCZNA z
  OZE (na podstawie DOKUMENTU potwierdzającego UMORZENIE świadectwa
  pochodzenia — zwolnienie STOSUJE się NIE wcześniej niż Z chwilą
  otrzymania TEGO dokumentu, poprzez OBNIŻENIE akcyzy NALEŻNEJ za
  NAJBLIŻSZE okresy); UBYTKI wyrobów akcyzowych LUB CAŁKOWITE
  zniszczenie WSKUTEK zdarzenia LOSOWEGO lub SIŁY wyższej; ALKOHOL
  etylowy CAŁKOWICIE/częściowo SKAŻONY (Z rozróżnieniem PRODUKOWANEGO
  krajowo VS nabywanego WEWNĄTRZWSPÓLNOTOWO — RÓŻNE środki SKAŻAJĄCE
  dopuszczone); alkohol ZAWARTY w PRODUKTACH leczniczych, OLEJKACH
  eterycznych, ARTYKUŁACH spożywczych

□ ZWOLNIENIA "ZE WZGLĘDU NA PRZEZNACZENIE" (art. 31a-32) — ⭐⭐⭐
  NAJWAŻNIEJSZA praktycznie KATEGORIA, DZIELĄCA się na DWIE grupy:
  1) korzystające ZE zwolnienia PRZY KAŻDEJ z wymienionych CZYNNOŚCI
  2) korzystające TYLKO przy NIEKTÓRYCH z tych CZYNNOŚCI
  Katalog art. 32 ust. 1 OBEJMUJE m.in.: paliwa LOTNICZE (benzyny/
  paliwa DO silników odrzutowych, oleje SMAROWE) — DLA statków
  powietrznych; wyroby ENERGETYCZNE — do celów ŻEGLUGI (włączając
  REJSY rybackie); pozostałe WĘGLOWODORY gazowe (CN 2711 12 11 —
  2711 19 00) — do celów OPAŁOWYCH; wyroby ENERGETYCZNE CN 2901 10 00
  — analogicznie do CELÓW z art. 31b (wyroby GAZOWE opałowe)
  □ WYROBY węglowe DO celów opałowych (art. 31a ust. 1) — SZEROKI
  katalog: PRODUKCJA energii elektrycznej, PRODUKCJA wyrobów
  energetycznych, ZUŻYCIE przez GOSPODARSTWO domowe/organ ADMINISTRACJI
  publicznej/Siły ZBROJNE/podmiot systemu OŚWIATY/żłobek i KLUB
  dziecięcy

⭐⭐ WARUNKI FORMALNE (art. 32 ust. 5, 6, 12, 13) — kluczowe DLA
  SKUTECZNOŚCI zwolnienia: OKREŚLONE oświadczenia NABYWCY, ewidencja
  Z monitorowaniem SYSTEMEM (dla WĘGLA — próg 30 MLN kg sprzedaży
  ROCZNIE dla pośredniczącego PODMIOTU węglowego), DODATKOWE warunki
  Z ust. 6e (żegluga) — ⚠️ TE mechanizmy SĄ już SZCZEGÓŁOWO opisane
  W istniejących sekcjach modułu DOT. węgla/gazu (patrz WYŻEJ, sekcja
  "WYROBY WĘGLOWE I GAZOWE") — NIE duplikować, TYLKO odsyłać

ROZPORZĄDZENIE WYKONAWCZE: KATALOG zwolnień jest UZUPEŁNIANY przez
  rozporządzenie MF Z 8.02.2013 r. W sprawie zwolnień OD podatku
  akcyzowego — DRUGA, mniej ZNANA warstwa źródeł ZWOLNIEŃ, poza SAMĄ
  ustawą — ⚠️ [NIEWERYFIKOWANE] sprawdź AKTUALNY t.j. tego
  rozporządzenia PRZY konkretnej sprawie, gdyż MOGŁO być WIELOKROTNIE
  nowelizowane OD 2013 r.
```

### 1a.4. Dział III rozdz. 2 — Składy podatkowe (art. 47–55)

```
ISTOTA: PRODUKCJA wyrobów akcyzowych Z załącznika NR 2 (objętych
  STAWKĄ inną niż ZEROWA) MOŻE odbywać SIĘ WYŁĄCZNIE w SKŁADZIE
  podatkowym (art. 47) — Z określonymi WYJĄTKAMI (np. drobna PRODUKCJA
  na WŁASNY użytek W pewnych PRZYPADKACH — ⚠️ [NIEWERYFIKOWANE W
  PEŁNI] dokładny KATALOG wyjątków wymaga POGŁĘBIENIA przy KONKRETNEJ
  sprawie)

PRZESŁANKI ZEZWOLENIA (art. 48): podmiot MUSI prowadzić CO NAJMNIEJ
  jeden RODZAJ działalności — PRODUKCJA, przeładowywanie LUB
  magazynowanie wyrobów AKCYZOWYCH (W TYM będących WŁASNOŚCIĄ innych
  podmiotów) — PLUS dodatkowe warunki FORMALNE Z art. 48 ust. 1 pkt
  2-6 (niekaralność, WIARYGODNOŚĆ finansowa, itd. — ⚠️ [NIEWERYFIKOWANE
  W PEŁNI] szczegółowy KATALOG wymaga pogłębienia PRZY konkretnej
  sprawie o WYDANIE/odmowę zezwolenia)

TRYB WYDANIA (art. 49): WNIOSEK o zezwolenie NA prowadzenie
  PIERWSZEGO składu STANOWI JEDNOCZEŚNIE wniosek O nadanie NUMERU
  akcyzowego. DO wniosku ZAŁĄCZA się PLAN składu PODATKOWEGO, dokumenty
  POTWIERDZAJĄCE spełnienie WARUNKÓW z art. 48 ORAZ dokumenty
  wymagane DO przeprowadzenia URZĘDOWEGO sprawdzenia (Z ustawy o
  KAS). OBOWIĄZEK powiadamiania naczelnika US o ZMIANIE danych z
  WNIOSKU — W TERMINIE 7 dni OD zaistnienia zmiany.

ZEZWOLENIE WYPROWADZENIA (odrębna instytucja, art. 54 i n.):
  DOTYCZY sytuacji, GDY podmiot NIEPROWADZĄCY danego SKŁADU chce
  WYPROWADZAĆ Z NIEGO wyroby POZA procedurą zawieszenia POBORU —
  wymaga PISEMNEJ zgody PODMIOTU prowadzącego skład ORAZ SPEŁNIENIA
  warunków ANALOGICZNYCH do art. 48 ust. 1 pkt 2-6

⭐ POWIĄZANE KATEGORIE PODMIOTÓW (Rozdziały 3-5, art. 56-62c):
  □ PODMIOT pośredniczący (art. 56-56a) — pośredniczy W obrocie
    wyrobami ZWOLNIONYMI ze względu NA przeznaczenie
  □ ZAREJESTROWANI odbiorcy (art. 57-59, DAWNIEJ "zarejestrowani
    handlowcy") — odbierają WYROBY W procedurze ZAWIESZENIA poboru
    akcyzy BEZ prowadzenia WŁASNEGO składu podatkowego
  □ NIEZAREJESTROWANI handlowcy (art. 60-62c) — JEDNORAZOWE odbiory
    wyrobów Z zapłaconą AKCYZĄ w INNYM państwie UE
```

### 1a.5. Dział III rozdz. 6 — Zabezpieczenie akcyzowe (art. 63–76)

```
OBOWIĄZEK (art. 63 ust. 1): OKREŚLONE podmioty (m.in. PROWADZĄCY
  skład PODATKOWY, zarejestrowany ODBIORCA, podmiot Z zezwoleniem
  WYPROWADZENIA, nabywca WEWNĄTRZWSPÓLNOTOWY z zapłaconą AKCYZĄ,
  pośredniczący PODMIOT tytoniowy) SĄ obowiązani DO złożenia
  zabezpieczenia W kwocie POKRYWAJĄCEJ powstałe ALBO mogące POWSTAĆ
  zobowiązanie PODATKOWE oraz OPŁATĘ paliwową

DWA RODZAJE ZABEZPIECZENIA (art. 65):
  □ GENERALNE — dla ZAGWARANTOWANIA pokrycia WIELU zobowiązań
    podatkowych (zasada OGÓLNA DLA większości ZOBOWIĄZANYCH podmiotów)
  □ RYCZAŁTOWE — UPROSZCZONA, TAŃSZA forma: wysokość USTALANA na
    poziomie TYLKO 30% wysokości ZABEZPIECZENIA generalnego, DO
    KTÓREGO byłby OBOWIĄZANY dany PODMIOT — DOSTĘPNE na WNIOSEK, PO
    spełnieniu TRZECH warunków z art. 64 UST. 1 pkt 1, 3 i 4
    (⚠️ [NIEWERYFIKOWANE W PEŁNI] dokładna TREŚĆ tych trzech
    warunków wymaga POGŁĘBIENIA przy konkretnej SPRAWIE, orientacyjnie
    dotyczą braku ZALEGŁOŚCI/wiarygodności podmiotu)

WYSOKOŚĆ ZABEZPIECZENIA: USTALA się WEDŁUG stawek akcyzy I opłaty
  paliwowej OBOWIĄZUJĄCYCH w DNIU powstania obowiązku PODATKOWEGO
  (a GDY tego dnia NIE można USTALIĆ — w DNIU złożenia ZABEZPIECZENIA)
  — JEŻELI stawki ZMIENIĄ się W trakcie TRWANIA procedury zawieszenia
  poboru, NACZELNIK koryguje WYSOKOŚĆ zabezpieczenia I POWIADAMIA
  podmiot

FORMY ZABEZPIECZENIA (art. 67): USTAWA przewiduje PIĘĆ WARIANTÓW
  złożenia (m.in. DEPOZYT w walucie POLSKIEJ — art. 68, gwarancja
  BANKOWA/ubezpieczeniowa — poprzez GWARANTA z art. 69, HIPOTEKA na
  nieruchomości — art. 69a) — WYBÓR formy NALEŻY do PODATNIKA (art. 70)

ODMOWA I KOREKTY: naczelnik MOŻE odmówić PRZYJĘCIA zabezpieczenia
  (art. 71); przy ZŁOŻENIU zabezpieczenia NIEPOKRYWAJĄCEGO całej
  kwoty ZOBOWIĄZANIA — odrębne KONSEKWENCJE (art. 72); AKCYZA MOŻE
  być POKRYTA z zabezpieczenia (art. 73); WYGAŚNIĘCIE zobowiązania
  podatkowego MA wpływ NA zabezpieczenie (art. 74); ZWRACANE
  zabezpieczenie NIE JEST oprocentowane — BRAK odsetek OD kwoty
  zwracanego ZABEZPIECZENIA (art. 75)

ROZPORZĄDZENIE WYKONAWCZE: rozporządzenie MF z 21.12.2018 r. W
  sprawie ZABEZPIECZEŃ akcyzowych (Dz.U. z 2024 r. poz. 601 —
  ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO] sprawdź AKTUALNOŚĆ tego numeru
  przy KONKRETNEJ sprawie) — OKREŚLA szczegółowy sposób USTALANIA
  wysokości zabezpieczenia GENERALNEGO i RYCZAŁTOWEGO, wzory WNIOSKÓW

⭐ PRAKTYCZNE ZNACZENIE: zabezpieczenie AKCYZOWE jest JEDNYM z
  NAJWIĘKSZYCH kosztów OPERACYJNYCH dla podmiotów PROWADZĄCYCH
  składy PODATKOWE (zamrożenie ŚRODKÓW lub KOSZT gwarancji BANKOWEJ)
  — PRZY doradztwie STRATEGICZNYM dla klienta ROZWAŻAJĄCEGO otwarcie
  składu PODATKOWEGO, WARTO od RAZU zbadać, CZY kwalifikuje się DO
  zabezpieczenia RYCZAŁTOWEGO (oszczędność 70% kwoty ZABEZPIECZENIA).
```

### 1a.6. Dział V — Opodatkowanie akcyzą samochodów osobowych (art. 100–113a)

```
✅ DOMKNIĘTE 2026-08-13 — dotąd W module TYLKO jeden WIERSZ stawki
w tabeli głównej, BEZ mechaniki proceduralnej.

PRZEDMIOT OPODATKOWANIA (art. 100 ust. 1): CZTERY kategorie ZDARZEŃ:
  1) IMPORT samochodu osobowego NIEZAREJESTROWANEGO wcześniej NA
     terytorium kraju (Z WYŁĄCZENIEM przypadków, GDY dług CELNY
     wygasł NA podstawie art. 124 UKC ust. 1 lit. e-g LUB k)
  2) NABYCIE wewnątrzwspólnotowe samochodu NIEZAREJESTROWANEGO
     wcześniej W Polsce
  3) PIERWSZA sprzedaż NA terytorium kraju samochodu NIEZAREJESTROWANEGO,
     a) WYPRODUKOWANEGO w Polsce, LUB b) OD którego NIE zapłacono
     akcyzy Z tytułu pkt 1 ALBO 2
  ⭐ DODATKOWO (art. 100 ust. 2): DOKONANIE W pojeździe SAMOCHODOWYM
  innym NIŻ osobowy (np. CIĘŻAROWYM z homologacją), ZAREJESTROWANYM
  W Polsce, ZMIAN konstrukcyjnych ZMIENIAJĄCYCH rodzaj TEGO pojazdu
  NA samochód OSOBOWY — ⭐⭐ ISTOTNE dla PRAKTYKI: "przeróbka" pojazdu
  DOSTAWCZEGO na OSOBOWY (np. usunięcie PRZEGRODY/dodatkowych siedzeń)
  RODZI OBOWIĄZEK zapłaty AKCYZY, ANALOGICZNIE do PIERWOTNEGO nabycia
  samochodu OSOBOWEGO

WYŁĄCZENIE Z OBOWIĄZKU (art. 101): OBOWIĄZEK podatkowy Z tytułu WNT
  albo SPRZEDAŻY niezarejestrowanego samochodu NIE powstaje, JEŻELI
  samochód ZOSTAŁ dostarczony wewnątrzwspólnotowo LUB wyeksportowany
  W terminie 30 DNI od dnia nabycia/sprzedaży (FAKT dostawy/eksportu
  POTWIERDZANY dokumentami z art. 107 ust. 3) — ⭐ ISTOTNE dla
  POŚREDNIKÓW handlowych W samochodach: krótkie "OKNO" 30-dniowe na
  DALSZĄ odsprzedaż BEZ zapłaty akcyzy W Polsce

STAWKI (art. 105, potwierdzenie ZGODNE z JUŻ obecną tabelą W module):
  □ 3,1% podstawy OPODATKOWANIA — silniki O pojemności DO 2000 cm³
  □ 18,6% podstawy OPODATKOWANIA — silniki O pojemności POWYŻEJ
    2000 cm³
  ⭐ PREFERENCJE DLA pojazdów NISKOEMISYJNYCH: SAMOCHODY elektryczne
  (BEV), wodorowe ORAZ (Z ZASTRZEŻENIAMI czasowymi DO 31.12.2029 r.)
  hybrydy PLUG-IN (PHEV) O pojemności PONIŻEJ 2000 cm³ — KORZYSTAJĄ
  z PREFERENCYJNEGO traktowania (⚠️ [NIEWERYFIKOWANE W PEŁNI] dokładny
  MECHANIZM — czy PEŁNE zwolnienie, CZY obniżona STAWKA — wymaga
  POTWIERDZENIA wprost NA ISAP przy konkretnej SPRAWIE, gdyż źródła
  WTÓRNE różnią się W sformułowaniach)

TERMIN I DEKLARACJA: NA opłacenie akcyzy — 30 DNI od SPROWADZENIA
  pojazdu (LUB innego zdarzenia RODZĄCEGO obowiązek); NA złożenie
  deklaracji AKC-U/S — 14 DNI od sprowadzenia — ⭐⭐ DWA RÓŻNE terminy
  W TYM SAMYM postępowaniu, ŁATWO pomylić: krótszy TERMIN deklaracji
  (14 dni) I dłuższy TERMIN zapłaty (30 dni)

PODSTAWA OPODATKOWANIA PRZY POJAZDACH USZKODZONYCH: PRZY samochodzie
  uszkodzonym STOSUJE się TE SAME stawki PROCENTOWE, jednak WARTOŚĆ
  bazowa (CENA transakcyjna Z dokumentu ZAKUPU) jest NIŻSZA — WYMAGA
  udokumentowania USZKODZEŃ (dokumentacja TECHNICZNA) I wskazania
  NIŻSZEJ ceny NA umowie — organ MA obowiązek UWZGLĘDNIĆ tę OKOLICZNOŚĆ,
  jeśli jest ONA odpowiednio WYKAZANA

⭐⭐ ZMIANY OD 1.04.2025 R. (ustawa z 20.02.2025 r.): wprowadzono
  NOWĄ kategorię ZWOLNIENIA DLA samochodów osobowych REJESTROWANYCH
  PROFESJONALNIE na terytorium KRAJU w CELU wykonywania jazd TESTOWYCH
  — ⚠️ [WYMAGA DODATKOWEJ WERYFIKACJI] dokładne WARUNKI tego zwolnienia
  (adresaci, ZAKRES czasowy, dodatkowe WYTYCZNE) NIE były PRZEDMIOTEM
  pogłębionej analizy W tej sesji — sprawdź PRZY konkretnej sprawie
  z branży MOTORYZACYJNEJ/dealerskiej

ZWROT AKCYZY (art. 107): przy DOSTAWIE wewnątrzwspólnotowej lub
  EKSPORCIE samochodu, OD którego akcyza ZOSTAŁA już ZAPŁACONA w
  Polsce — PODATNIK może UBIEGAĆ się o ZWROT, potwierdzając transakcję
  odpowiednimi DOKUMENTAMI (⚠️ [NIEWERYFIKOWANE W PEŁNI] dokładna
  procedura I termin WNIOSKU o zwrot WYMAGAJĄ pogłębienia PRZY
  konkretnej sprawie)
```

### 1a.7. Dział VI — Znaki akcyzy (art. 114–138)

```
✅ DOMKNIĘTE 2026-08-13 — dotąd W module WYŁĄCZNIE wzmiankowane
przy okazji KKS ("brak banderol" JAKO najczęstszy zarzut), BEZ
systematycznego opracowania MECHANIZMU. ⭐⭐⭐ WYSOKI priorytet
praktyczny — bezpośrednio ZWIĄZANY z Twoimi sprawami KARNOSKARBOWYMI
dot. nielegalnych wyrobów akcyzowych.

ZAKRES PRZEDMIOTOWY (art. 114): obowiązkowi OZNACZANIA znakami
  akcyzy PODLEGAJĄ WYŁĄCZNIE wyroby WYMIENIONE w ZAŁĄCZNIKU nr 3 do
  ustawy (NIE wszystkie wyroby AKCYZOWE automatycznie) — m.in.
  papierosy, TYTOŃ do palenia, CYGARA i cygaretki (POZ. 10, BEZ
  względu NA kod CN), napoje ALKOHOLOWE (poz. 2 I n.), PŁYN do
  papierosów ELEKTRONICZNYCH (poz. 12, bez WZGLĘDU na kod CN)

DWA RODZAJE ZNAKÓW (art. 2 pkt 17):
  □ PODATKOWE znaki akcyzy (potocznie "BANDEROLE podatkowe") —
    POTWIERDZENIE wpłaty KWOTY stanowiącej WARTOŚĆ tych znaków —
    obowiązek OZNACZANIA ciąży NA zarejestrowanym (zgodnie Z art. 16)
    podmiocie BĘDĄCYM m.in.: podmiotem PROWADZĄCYM skład podatkowy,
    IMPORTEREM, podmiotem dokonującym NABYCIA wewnątrzwspólnotowego,
    podmiotem DOKONUJĄCYM produkcji (art. 116 ust. 1)
  □ LEGALIZACYJNE znaki akcyzy — POTWIERDZENIE PRAWA podmiotu DO
    przeznaczenia WYROBÓW do SPRZEDAŻY — obowiązek POWSTAJE, GDY
    poza PROCEDURĄ zawieszenia poboru WYSTĘPUJĄ wyroby NIEOZNACZONE,
    oznaczone NIEPRAWIDŁOWO lub NIEODPOWIEDNIMI znakami (W SZCZEGÓLNOŚCI
    uszkodzonymi), a SĄ przeznaczone DO dalszej sprzedaży (art. 116
    ust. 3) — OBOWIĄZEK naniesienia CIĄŻY na POSIADACZU wyrobów (art.
    116 ust. 4) — ⭐⭐ ISTOTNE: DOTYCZY RÓWNIEŻ przypadku, GDY podatkowe
    znaki akcyzy UTRACIŁY ważność (WYGASŁ okres ich OBOWIĄZYWANIA) —
    wyroby Z NIEWAŻNYMI już banderolami TRAKTOWANE są JAK nieoznaczone

TERMIN NANIESIENIA (art. 117 ust. 1): wyroby AKCYZOWE podlegające
  OBOWIĄZKOWI oznaczania POWINNY być prawidłowo OZNACZONE przed
  ZAKOŃCZENIEM procedury zawieszenia POBORU akcyzy (a WIĘC PRZED
  wprowadzeniem do OBROTU/konsumpcji)

PROCEDURA UZYSKANIA (Rozdz. 3, art. 125-129): WNIOSEK o wydanie
  banderol PODATKOWYCH LUB o sprzedaż BANDEROL legalizacyjnych,
  składany DO właściwego naczelnika US W sprawach ZNAKÓW akcyzy —
  DO wniosku ZAŁĄCZA się DOKUMENTY potwierdzające DANE (chyba że
  naczelnik JUŻ nimi dysponuje) — legalizacyjne ZNAKI akcyzy SĄ
  ODPŁATNE, wpłatę NALEŻY dokonać PRZED wydaniem decyzji O sprzedaży
  (art. 126 ust. 3 pkt 2)

ZWROT/WYMIANA ZNAKÓW W RAZIE STRAT (art. 138): W razie strat ZNAKÓW
  wskutek UTRATY/uszkodzenia/zniszczenia W procesie OZNACZANIA, W
  GRANICACH dopuszczalnej NORMY strat — PRZYSŁUGUJE zwrot WPŁACONYCH
  kwot LUB prawo do OTRZYMANIA nowych ZNAKÓW W zamian

⭐ POWIĄZANIE Z KKS: BRAK oznaczenia znakami AKCYZY lub UŻYCIE znaków
  PODROBIONYCH/nieprawidłowych to NAJCZĘSTSZY samodzielny zarzut W
  sprawach KARNOSKARBOWYCH dot. NIELEGALNEGO obrotu wyrobami
  akcyzowymi (art. 63 § 1-6 KKS I n. — PATRZ istniejąca sekcja
  "NARUSZENIA — KKS" w TYM module dla PEŁNEJ analizy karnoskarbowej) —
  TA sekcja DOSTARCZA materialnoprawnego TŁA regulacyjnego (co TO
  są znaki, KTO je NANOSI, kiedy WYSTĘPUJE obowiązek LEGALIZACYJNY),
  KTÓRE jest PRZESŁANKĄ prawidłowej KWALIFIKACJI czynu w SPRAWACH
  karnych.
```

### 1a.8. Dział VIA — Ewidencje i inne dokumentacje (art. 138a–138ta)

```
ZASADA OGÓLNA: różne KATEGORIE podmiotów PROWADZĄ różne, WYSPECJALIZOWANE
  ewidencje W ZALEŻNOŚCI od pełnionej FUNKCJI W łańcuchu obrotu —
  system NIE przewiduje JEDNEJ uniwersalnej ewidencji, LECZ SZEREG
  odrębnych OBOWIĄZKÓW ewidencyjnych:
  □ art. 138a — PODMIOT prowadzący skład PODATKOWY prowadzi
    ewidencję WYROBÓW akcyzowych; OPERATOR logistyczny PROWADZĄCY
    skład podatkowy DODATKOWO prowadzi EWIDENCJĘ wyrobów NALEŻĄCYCH
    do innych PODMIOTÓW
  □ art. 138e — EWIDENCJA dokumentów HANDLOWYCH towarzyszących
    PRZEMIESZCZANIU wyrobów (INNYCH niż z załącznika NR 2, objętych
    stawką INNĄ niż zerowa) — PROWADZONA przez podmiot ZE składu
    podatkowego I zarejestrowanego WYSYŁAJĄCEGO, zawiera DANE
    dotyczące PODMIOTÓW i wyrobów, KTÓRYCH dokumenty DOTYCZĄ
  □ art. 138j — EWIDENCJA wyrobów gazowych, PROWADZONA przez
    pośredniczące PODMIOTY gazowe (dokonujące SPRZEDAŻY finalnemu
    nabywcy ORAZ inne kategorie Z art. 138j ust. 1)

TERMIN PRZECHOWYWANIA (art. 138q): ewidencje I inne dokumentacje
  z art. 138a-138o POWINNY być przechowywane DO celów kontroli PRZEZ
  OKRES 5 LAT, licząc OD końca roku KALENDARZOWEGO, w KTÓRYM zostały
  SPORZĄDZONE — ⭐ ANALOGICZNY okres DO standardowego przedawnienia
  zobowiązań PODATKOWYCH w Ordynacji podatkowej, WARTO PORÓWNAĆ te
  dwa reżimy PRZY konkretnej sprawie kontrolnej

⭐ ZNACZENIE PRAKTYCZNE: BRAK prowadzenia WYMAGANEJ ewidencji LUB jej
  NIEKOMPLETNOŚĆ jest CZĘSTYM, samodzielnym PRZEDMIOTEM ustaleń
  kontrolnych PRZY kontrolach celno-skarbowych składów PODATKOWYCH —
  WARTO przy DORADZTWIE prewencyjnym dla KLIENTA prowadzącego skład
  podatkowy ZWERYFIKOWAĆ, KTÓRA/e z powyższych EWIDENCJI (138a, 138e,
  138j I inne Z zakresu 138a-138o) GO DOTYCZĄ, W ZALEŻNOŚCI od
  pełnionej FUNKCJI (podmiot PROWADZĄCY skład, OPERATOR logistyczny,
  zarejestrowany WYSYŁAJĄCY, pośredniczący podmiot GAZOWY itd.).
```

### 1a.9. Dział VIb — Przepisy o karach pieniężnych (art. 138u–138w)

```
✅ DOMKNIĘTE 2026-08-13 — dotąd CAŁKOWICIE nieobecne w module,
mimo iż TO ODRĘBNY od KKS, ADMINISTRACYJNY mechanizm SANKCYJNY
(kary pieniężne NAKŁADANE decyzją ADMINISTRACYJNĄ, nie WYROKIEM
sądu karnego).

PRZYKŁADOWA KONSTRUKCJA (art. 138u) — kara ZA naruszenia PROCEDURALNE
  związane z SYSTEMEM (EMCS): W przypadku GDY podmiot ODBIERAJĄCY,
  będący UŻYTKOWNIKIEM Systemu, NIE SPORZĄDZI projektu RAPORTU
  odbioru ALBO nie PRZEDSTAWI naczelnikowi DOKUMENTU zastępującego
  raport ODBIORU w terminie Z art. 46i ust. 2 — NAKŁADA się KARĘ
  pieniężną w WYSOKOŚCI 5000 zł.

MECHANIZM ŁAGODZĄCY: naczelnik ODSTĘPUJE od NAŁOŻENIA kary I
  POPRZESTAJE na pouczeniu, JEŻELI waga NARUSZENIA jest ZNIKOMA A
  podmiot ZAPRZESTAŁ naruszania PRAWA — ⭐ analogiczny MECHANIZM do
  "znikomej SZKODLIWOŚCI" znanej Z prawa karnego/wykroczeń, ale W
  RAMACH postępowania ADMINISTRACYJNEGO

TRYB: kara NAKŁADANA W drodze DECYZJI przez WŁAŚCIWEGO naczelnika US
  (LUB naczelnika urzędu CELNO-SKARBOWEGO, w ZALEŻNOŚCI od PODSTAWY —
  art. 138w DOT. importu przewiduje WŁAŚCIWOŚĆ naczelnika CELNO-
  SKARBOWEGO)

TERMIN UISZCZENIA: 7 DNI od dnia, W KTÓRYM decyzja O nałożeniu STAŁA
  SIĘ ostateczna

PRZEDAWNIENIE: kara NIE MOŻE być NAŁOŻONA, jeżeli OD dnia
  NIEDOPEŁNIENIA obowiązku ZAGROŻONEGO tą karą UPŁYNĘŁO 5 LAT — ⭐
  ANALOGICZNY okres DO przechowywania ewidencji Z art. 138q — SPÓJNA
  konstrukcja 5-LETNICH terminów W tej CZĘŚCI ustawy

KARA ZA IMPORT PRZY WYGAŚNIĘTYM DŁUGU CELNYM (art. 138w): GDY
  obowiązek PODATKOWY z tytułu IMPORTU wyrobów akcyzowych NIE powstał
  Z powodu WYGAŚNIĘCIA długu CELNEGO (na podstawie art. 124 UKC ust.
  1 lit. e) — NA podmiot który DOKONAŁ importu NAKŁADA się karę
  PIENIĘŻNĄ w WYSOKOŚCI długu CELNEGO, jaki BY powstał I nie WYGASŁ
  — ⭐⭐ MECHANIZM zapobiegający OBCHODZENIU obowiązku podatkowego
  poprzez WYKORZYSTANIE technicznych PRZESŁANEK wygaśnięcia długu
  celnego (analogicznych DO omówionych już W istniejącej sekcji
  modułu "TAKSONOMIA TECHNIK obchodzenia AKCYZY")

⭐ RELACJA DO KKS: KARY pieniężne Z Działu VIb SĄ ODRĘBNYM reżimem
  OD odpowiedzialności KARNOSKARBOWEJ (KKS) — TEORETYCZNIE MOŻLIWA
  jest KUMULACJA obu (kara PIENIĘŻNA administracyjna ORAZ grzywna
  za PRZESTĘPSTWO/wykroczenie skarbowe ZA TEN SAM czyn), CHOĆ
  zasada NE BIS IN IDEM I orzecznictwo TK/ETPCz W tym ZAKRESIE
  bywają PRZEDMIOTEM sporów — ⚠️ [NIEWERYFIKOWANE, WYMAGA POGŁĘBIENIA
  PRZY KONKRETNEJ SPRAWIE] jeśli KLIENT stoi wobec RÓWNOCZESNEGO
  postępowania administracyjnego (kara PIENIĘŻNA) i karnoskarbowego
  ZA to samo ZDARZENIE, rozważ ARGUMENT podwójnego karania — WYMAGA
  odrębnej, DEDYKOWANEJ analizy orzeczniczej PRZED powołaniem w
  PIŚMIE procesowym.
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

## ANEKS — WIA: WIĄŻĄCA INFORMACJA AKCYZOWA (DZIAŁ IA, art. 7d–7k)

✅ ROZBUDOWANE 2026-08-13 (dalsza część audytu pokrycia per dział) —
ISTOTNA KOREKTA: poprzednia wersja tej sekcji wskazywała Dyrektora
Izby Administracji Skarbowej we Wrocławiu jako organ właściwy — TO
JEST NIEAKTUALNE od 1 lipca 2023 r.

```
DEFINICJA I ZAKRES (art. 7d ust. 1): WIA JEST decyzją WYDAWANĄ na
  POTRZEBY opodatkowania WYROBU akcyzowego ALBO samochodu OSOBOWEGO
  akcyzą, ORGANIZACJI obrotu wyrobami AKCYZOWYMI, lub OZNACZANIA
  znakami AKCYZY tych wyrobów — OKREŚLA:
  1) KLASYFIKACJĘ wyrobu/samochodu W układzie ODPOWIADAJĄCYM
     Nomenklaturze SCALONEJ (CN), ALBO
  2) RODZAJ wyrobu AKCYZOWEGO przez OPIS w stopniu SZCZEGÓŁOWOŚCI
     wystarczającym DO określenia opodatkowania — TA druga OPCJA
     wydawana JEST, GDY sam kod CN NIE wystarcza DO ustalenia
     opodatkowania/organizacji obrotu/znaków AKCYZY

⭐⭐⭐ ORGAN WŁAŚCIWY — ZMIANA OD 1.07.2023 R. (kluczowa KOREKTA tej
  sesji): OD 1 lipca 2023 r. WIA WYDAJE Dyrektor Krajowej INFORMACJI
  Skarbowej (KIS, siedziba W Bielsku-Białej) — NIE (jak DOTĄD BŁĘDNIE
  wskazywano W tej sekcji ORAZ jak WCIĄŻ podają liczne, NIEAKTUALIZOWANE
  źródła internetowe — w TYM strony kilku IZB administracji
  skarbowej) Dyrektor IZBY Administracji Skarbowej WE Wrocławiu —
  ⭐ TEN organ BYŁ właściwy TYLKO do 30.06.2023 r. WNIOSKI składa się
  DO Dyrektora KIS ZA pośrednictwem PUESC (od 1.01.2024 r. WYŁĄCZNIE
  elektronicznie — poprzedni PAPIEROWY wzór wniosku Z rozporządzenia
  MF z 12.12.2014 r. STRACIŁ moc)
  ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO W ISAP] potwierdzone WPROST na
  kis.gov.pl (Rząd 1 — oficjalna STRONA KIS) — WYSOKI stopień
  pewności mimo braku BEZPOŚREDNIEGO dostępu do ISAP w tej SESJI.

WNIOSEK: DOTYCZY WYŁĄCZNIE jednego WYROBU akcyzowego ALBO jednego
  samochodu OSOBOWEGO (NIE można łączyć WIELU wyrobów W jednym
  wniosku) — NIE PODLEGA opłacie (⭐ W przeciwieństwie DO niektórych
  innych wiążących INFORMACJI — np. WIS ma OPŁATĘ w OKREŚLONYCH
  przypadkach) — JEŚLI działa PEŁNOMOCNIK, wymagana OPŁATA skarbowa
  OD pełnomocnictwa w wysokości 17 ZŁ (Z WYJĄTKIEM pełnomocnictwa
  OGÓLNEGO)

TERMIN NA WYDANIE: 3 MIESIĄCE od dnia ZŁOŻENIA wniosku — ⭐ ANALOGICZNY
  do terminu WIS w VAT (patrz sekcja "WIS" wyżej W module VAT) — DO
  tego terminu STOSUJE się zasady ANALOGICZNE jak PRZY interpretacjach
  indywidualnych (m.in. MOŻLIWOŚĆ przedłużenia W sprawach
  SKOMPLIKOWANYCH)

OKRES WAŻNOŚCI: WIA WYDAWANA jest NA okres 5 LAT i JEST ważna OD dnia
  NASTĘPUJĄCEGO po dniu, W KTÓRYM stała się OSTATECZNA (art. 7d ust. 4)
  — ⭐ IDENTYCZNY okres jak WIS w VAT

MOC WIĄŻĄCA (art. 7d ust. 3): WIA WIĄŻE organy PODATKOWE ORAZ podmiot,
  NA rzecz KTÓREGO została WYDANA, W ODNIESIENIU do wyrobów/samochodów,
  WOBEC których czynności PODLEGAJĄCE opodatkowaniu akcyzą ZOSTAŁY
  dokonane W okresie WAŻNOŚCI WIA

⭐⭐ WYGAŚNIĘCIE Z MOCY PRAWA: WIA wygasa Z mocy PRAWA, jeżeli ZMIENIĄ
  się PRZEPISY prawa PODATKOWEGO, do KTÓRYCH odnosi SIĘ decyzja, I
  jeżeli W związku Z tą zmianą BĘDZIE ona NIEZGODNA z tymi PRZEPISAMI
  — Z DNIEM wejścia W życie NOWYCH przepisów, Z KTÓRYMI WIA STAŁA się
  niezgodna — ⭐⭐⭐ MECHANIZM ANALOGICZNY do art. 42h ust. 1 VAT (WIS)
  — WYGAŚNIĘCIE BEZ formalnego zawiadomienia, wymaga OD posiadacza
  WIA SAMODZIELNEGO monitorowania ZMIAN przepisów w SWOJEJ branży —
  ⭐ WZORZEC systemowy: obie WIĄŻĄCE informacje (WIS w VAT I WIA w
  akcyzie) MAJĄ TĘ SAMĄ, ryzykowną DLA podatnika konstrukcję
  automatycznego WYGAŚNIĘCIA

PRZESŁANKI ODMOWY WYDANIA (art. 7i ust. 1 pkt 3): organ ODMÓWI
  wydania WIA, JEŻELI wniosek DOTYCZY informacji O rodzaju wyrobu,
  DLA którego wnioskodawca POSIADA już interpretację INDYWIDUALNĄ w
  TYM zakresie — ⭐ RELACJA jednokierunkowa: KOLEJNOŚĆ "najpierw WIA,
  potem interpretacja INDYWIDUALNA" jest w PEŁNI dopuszczalna, ale
  ODWROTNA kolejność ("najpierw interpretacja, POTEM WIA dla TEGO
  SAMEGO wyrobu") SKUTKUJE odmową — ⭐⭐ ISTOTNA wskazówka STRATEGICZNA
  przy DORADZTWIE: jeśli klient POTRZEBUJE OBU instrumentów, WNIOSEK
  o WIA powinien BYĆ złożony JAKO pierwszy

FAŁSZYWE OŚWIADCZENIE: wnioskodawca SKŁADA oświadczenie, że W dniu
  złożenia wniosku NIE toczy się postępowanie PODATKOWE/kontrola
  podatkowa/kontrola CELNO-SKARBOWA W zakresie PRZEDMIOTOWYM wniosku,
  ORAZ że sprawa NIE została ROZSTRZYGNIĘTA co DO istoty W decyzji/
  postanowieniu — OŚWIADCZENIE zawiera KLAUZULĘ "Jestem świadomy
  odpowiedzialności KARNEJ za złożenie FAŁSZYWEGO oświadczenia" —
  ⭐⭐⭐ W RAZIE złożenia fałszywego OŚWIADCZENIA — przepis O mocy
  wiążącej WIA (art. 7d ust. 3) NIE STOSUJE się — decyzja TRACI
  praktyczną WARTOŚĆ ochronną, mimo FORMALNEGO pozostawania W obrocie

ZASKARŻENIE: SKARGA do WSA W terminie 30 DNI od doręczenia (ZGODNIE
  z ogólnymi zasadami zaskarżania DECYZJI administracyjnych) — ⚠️
  [NIEWERYFIKOWANE W PEŁNI] przy KONKRETNEJ sprawie potwierdź, czy
  ZMIANA organu wydającego (Z IAS Wrocław NA Dyrektora KIS) wpłynęła
  RÓWNIEŻ na organ ODWOŁAWCZY (WCZEŚNIEJ: Dyrektor IAS w WARSZAWIE) —
  TA sesja NIE zawierała pogłębionej WERYFIKACJI tego konkretnego
  aspektu

PUBLIKACJA: decyzje WIA (WRAZ z decyzjami o ZMIANIE/uchyleniu/odmowie
  wydania, informacjami O okresie ważności) SĄ publikowane W
  ogólnodostępnym SYSTEMIE Informacji Celno-Skarbowej EUREKA — PO
  usunięciu danych IDENTYFIKUJĄCYCH wnioskodawcę I danych OBJĘTYCH
  tajemnicą przedsiębiorstwa (art. 7k) — ⭐ PRAKTYCZNE narzędzie:
  PRZED złożeniem WŁASNEGO wniosku o WIA, WARTO przeszukać EUREKA
  pod kątem ANALOGICZNYCH wyrobów, gdzie decyzja JUŻ zapadła —
  ANALOGICZNIE do bazy weryfikacji STAWEK VAT (poziom C W module
  rdzenia VAT)

⭐ RELACJA WIA — WIS: obie INSTYTUCJE (wiążąca informacja AKCYZOWA i
  wiążąca informacja STAWKOWA w VAT) mają WSPÓLNĄ architekturę
  konstrukcyjną (5 LAT ważności, wygaśnięcie Z mocy prawa PRZY
  zmianie przepisów, PUBLIKACJA w systemie WYSZUKIWAWCZYM), ale SĄ
  wydawane PRZEZ RÓŻNE organy i DOTYCZĄ różnych PODATKÓW — NIE MYLIĆ
  przy doradztwie DLA klienta wprowadzającego NOWY produkt na RYNEK,
  który MOŻE wymagać OBU instrumentów RÓWNOLEGLE (np. wyrób akcyzowy
  będący JEDNOCZEŚNIE przedmiotem sporu O stawkę VAT).

⚠️ Weryfikuj aktualne przepisy o WIA w ustawie akcyzowej (Dz.U. 2026
poz. 412) w ISAP przed każdym zastosowaniem — instytucja podlegała
w ostatnich latach istotnym zmianom proceduralnym (zmiana organu
2023, elektronizacja wniosku 2024).
```

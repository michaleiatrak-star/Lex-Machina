# MOD-SPECUSTAWY — Specustawy, Lex Specialis, Prawa Tymczasowe i Graf Zależności

**Wersja:** 1.0 | **Dodano:** 2026-07-17
**Rola w systemie:** trzecia warstwa doktrynalna prawa międzyczasowego/kolizyjnego
w DR-01, obok `mod-ZTP-przepisy-przejsciowe-doktryna.md`. Tamten moduł odpowiada
na pytanie "co się dzieje ZE STARYM prawem, gdy wchodzi NOWE" (przepisy
przejściowe). Ten moduł odpowiada na dwa inne pytania: "który z DWÓCH równolegle
obowiązujących aktów stosować" (lex specialis) i "co się dzieje, gdy akt z
założenia ma obowiązywać tylko przez jakiś czas" (specustawy / przepisy
epizodyczne) — oraz dostarcza narzędzie do mapowania tych zależności (graf).

> ⛔ NIE DUBLUJ: mechanikę dat/wersji przepisu → `MOD-VACATIO-LEGIS.md`.
> Podstawę prawną i algorytm przepisów przejściowych → `mod-ZTP-przepisy-
> przejsciowe-doktryna.md`. Ten moduł dotyczy WYŁĄCZNIE: (a) relacji między
> dwoma równolegle obowiązującymi aktami tej samej rangi, (b) ustaw z
> ustawowo ograniczonym czasem obowiązywania, (c) mapowania tych relacji.

**Zasada:** `view /mnt/skills/user/shared/PRAWO-HARDGATE.md` przed każdym
przepisem/aktem z tego modułu.

---

## 1. TRZY POJĘCIA — ROZRÓŻNIENIE (często mylone ze sobą)

| Pojęcie | Status prawny | Co reguluje |
|---|---|---|
| **Specustawa** | Pojęcie DOKTRYNALNE/POTOCZNE, nie ustawowe. Definicja słownikowa: „ustawa specjalna, regulująca sposób przeprowadzania jakiejś inwestycji, dla której przepisy ogólne są niewystarczające" | Konkretna inwestycja/sytuacja, z uproszczoną procedurą wobec prawa ogólnego |
| **Lex specialis derogat legi generali** | Reguła KOLIZYJNA doktryny prawa (nie przepis pozytywny) | Który z DWÓCH aktów tej samej rangi, obowiązujących RÓWNOLEGLE, stosować do danego stanu faktycznego |
| **Przepisy epizodyczne** | Kategoria USTAWOWA — ZTP Rozdział 4a, § 29a-29c | Odstępstwa od określonych przepisów z WYRAŹNIE OZNACZONYM okresem obowiązywania (rok/lata kalendarzowe, daty, liczba dni/miesięcy) |

**Dlaczego to rozróżnienie ma znaczenie praktyczne:** specustawa NIE MUSI być
przepisem epizodycznym (wiele specustaw, mimo zamysłu tymczasowości, jest
regularnie przedłużanych bezterminowo — np. specustawa drogowa z 2003 r.
przetrwała ponad 20 lat kolejnych przedłużeń terminu) — a przepis epizodyczny
nie musi dotyczyć inwestycji (może dotyczyć dowolnej dziedziny). Specustawa
korzysta z zasady lex specialis, żeby wyłączyć stosowanie prawa ogólnego —
ale mechanizm wyłączenia (czy ma określony koniec, czy nie) to osobna kwestia
techniki legislacyjnej.

---

## 2. PODSTAWA PRAWNA — PRZEPISY EPIZODYCZNE (ZTP Rozdział 4a)

Ta sama rozporządzenie co w `mod-ZTP-przepisy-przejsciowe-doktryna.md` —
Rozporządzenie Prezesa Rady Ministrów z 20.06.2002 ws. Zasad Techniki
Prawodawczej, t.j. Dz.U. 2016 poz. 283 ze zm. — ale inny dział: **Rozdział 4a
"Przepisy epizodyczne", § 29a-29c** (dodany nowelizacją z 5.11.2015, Dz.U. 2015
poz. 1812, w życie 1.03.2016).

Wymogi § 29a-29c:
1. W przepisach epizodycznych zamieszcza się regulacje wprowadzające
   odstępstwa od określonych przepisów, **których okres obowiązywania jest
   wyraźnie określony**.
2. Okres obowiązywania określa się przez: (a) wskazanie roku/lat
   kalendarzowych, (b) oznaczenie początku i końca dniami kalendarzowymi,
   (c) wskazanie liczby dni/tygodni/miesięcy/lat od wejścia w życie ustawy.
3. Początku/końca obowiązywania **nie uzależnia się od zdarzenia przyszłego**,
   chyba że jest to konieczne ze względu na zakres regulacji — wtedy termin
   wystąpienia zdarzenia musi być możliwy do jednoznacznego stwierdzenia.

⚠️ **Krytyka doktrynalna odnotowana w systemie (nie do pominięcia w analizie):**
kategoria przepisów epizodycznych budzi od wejścia w życie (2016) spory w
doktrynie legislacyjnej — krytycy (m.in. blog ekspercki poświęcony legislacji,
patrz literatura pkt 6) wskazują, że ociera się ona o granice zasady pewności
prawa i zasady zaufania obywatela do państwa (art. 2 Konstytucji), zwłaszcza
gdy "epizod" jest w praktyce przedłużany wielokrotnie — co czyni go faktycznie
przepisem stałym pod etykietą tymczasowości. Ten argument jest bezpośrednio
przydatny przy kwestionowaniu przedłużanej specustawy w piśmie procesowym.

---

## 3. KATALOG PRZYKŁADOWY SPECUSTAW (punkt startowy, NIE źródło do cytowania wprost)

⛔ Poniższa tabela to WYŁĄCZNIE mapa orientacyjna do rozpoznania tematu w
rozmowie z klientem — **każdy numer Dz.U. musi być zweryfikowany na ISAP
przed użyciem w piśmie** (aktualny t.j. zmienia się przy każdej nowelizacji
przedłużającej okres obowiązywania).

| Nazwa potoczna | Ustawa | Cel/zakres |
|---|---|---|
| specustawa drogowa | z 10.04.2003 o szczególnych zasadach przygotowania i realizacji inwestycji w zakresie dróg publicznych | Decyzja ZRID zastępująca kilka odrębnych decyzji administracyjnych; wywłaszczenia pod drogi |
| specustawa mieszkaniowa | z 5.07.2018 o ułatwieniach w przygotowaniu i realizacji inwestycji mieszkaniowych oraz inwestycji towarzyszących | Uproszczona procedura lokalizacyjna dla inwestycji mieszkaniowych, z pominięciem MPZP |
| specustawa koronawirusowa | z 2.03.2020 o szczególnych rozwiązaniach związanych z zapobieganiem, przeciwdziałaniem i zwalczaniem COVID-19... | Szeroki pakiet odstępstw międzybranżowych (terminy, zamówienia, praca zdalna) |
| specustawa o pomocy obywatelom Ukrainy | z 12.03.2022 o pomocy obywatelom Ukrainy w związku z konfliktem zbrojnym na terytorium tego państwa | Legalizacja pobytu, dostęp do świadczeń, rynku pracy — odstępstwo od ogólnego reżimu cudzoziemskiego |
| specustawa EURO 2012 | z 7.09.2007 o przygotowaniu finałowego turnieju UEFA EURO 2012 | Wzorzec dla późniejszych specustaw "wydarzeniowych" (ŚDM Kraków i in.) |
| specustawa stoczniowa | z 19.12.2008 o postępowaniu kompensacyjnym w podmiotach o szczególnym znaczeniu dla przemysłu stoczniowego | Sektorowa, restrukturyzacyjna |
| specustawa ws. gminy Ostrowice | z 5.07.2018 o szczególnych rozwiązaniach dot. gminy Ostrowice | Przykład specustawy o zakresie JEDNOSTKOWYM (jedna gmina) |

**Krytyka systemowa odnotowana w doktrynie (do wykorzystania w argumentacji o
nadużyciu trybu specustawy):** liczba specustaw w polskim porządku prawnym
rośnie, obejmując coraz częściej inwestycje o marginalnym znaczeniu
ogólnospołecznym (strzelnice, pojedyncze obiekty) — prawnicy komentujący to
zjawisko określają je wprost jako "psucie prawa", bo uproszczona procedura
przestaje być proporcjonalna do wagi interesu publicznego, który miała
pierwotnie chronić.

---

## 4. ALGORYTM LEX SPECIALIS DEROGAT LEGI GENERALI

```
KROK 1 — Czy dwa akty tej samej rangi (obie ustawy, albo oba rozporządzenia)
         regulują TEN SAM stan faktyczny w sposób ze sobą sprzeczny?
  NIE → brak kolizji, stosuj każdy akt w swoim zakresie. STOP.
  TAK → KROK 2.

KROK 2 — Który akt reguluje WĘŻSZĄ klasę przypadków (jest bardziej
         szczegółowy względem drugiego)?
         Kryterium: klasa węższa = WYJĄTEK (lex specialis), klasa szersza
         = REGUŁA (lex generalis). To, co jest wyjątkiem a co regułą,
         wyznacza zakres zastosowania obu norm — NIE ranga aktu (oba są
         ustawami) ani data (to osobna oś, patrz KROK 4).
  → Zidentyfikowano lex specialis → stosuje się PRZED lex generalis,
    w zakresie w jakim się z nią krzyżuje. KROK 3.

KROK 3 — Czy zakresy zastosowania obu norm w ogóle się krzyżują, czy jeden
         w pełni zawiera się w drugim?
         Jeśli zakresy tylko CZĘŚCIOWO się pokrywają (przypadki normowane
         WYŁĄCZNIE przez jedną z norm) — to jest **poważny problem
         kolizyjny sam w sobie** (patrz Wikipedia PL, hasło "Lex specialis
         derogat legi generali") — wymaga dodatkowej analizy celu regulacji
         (wykładnia celowościowa), nie samej reguły kolizyjnej.

KROK 4 — Czy lex specialis jest STARSZA niż lex generalis (uchwalona
         wcześniej), a lex generalis nowsza?
         TAK → możliwa kolizja z zasadą lex posterior derogat legi priori
         ("ustawa późniejsza uchyla wcześniejszą"). Reguła rozstrzygająca:
         **lex posterior generalis non derogat legi priori speciali** —
         nowsza ustawa OGÓLNA NIE uchyla wcześniejszej ustawy SZCZEGÓLNEJ,
         chyba że ustawodawca WYRAŹNIE tak postanowił (np. przez klauzulę
         uchylającą wprost, albo przez oczywisty zamiar całościowej reformy
         dziedziny — domniemanie, że ustawodawca planował uchylić
         wcześniejszą regulację).
  NIE (lex specialis jest NOWSZA) → obie reguły (specialis i posterior)
  wskazują ten sam kierunek, brak kolizji reguł kolizyjnych.

KROK 5 — Czy sama specustawa zawiera WYRAŹNĄ klauzulę derogacyjną
         (np. "nie stosuje się art. X ustawy Y")?
  TAK → stosuj klauzulę wprost — to eliminuje potrzebę całego powyższego
        rozumowania doktrynalnego (ustawodawca rozstrzygnął kolizję sam).
        Większość współczesnych specustaw ma taką klauzulę wprost (np.
        wyłączenie stosowania art. 31 § 3 KPA — udział organizacji
        społecznych — w niektórych specustawach inwestycyjnych).
  NIE → kolizja musi być rozstrzygnięta doktrynalnie wg KROK 1-4 powyżej.
```

---

## 5. GRAF ZALEŻNOŚCI — MECHANIZM MAPOWANIA RELACJI SPECUSTAWA ↔ AKT OGÓLNY

### 5.1 Cel

Specustawa rzadko deroguje JEDEN akt w całości — typowo wyłącza **fragmenty**
kilku aktów ogólnych jednocześnie (KPA, ustawa o gospodarce nieruchomościami,
Prawo budowlane, ustawa o planowaniu i zagospodarowaniu przestrzennym, prawo
ochrony środowiska — tak jak specustawa drogowa). Bez systematycznego zapisu
tych relacji, analiza "czy przepis ogólny X nadal się stosuje w mojej sprawie"
wymaga za każdym razem przeszukiwania całej treści specustawy od nowa. Graf
zależności to ustrukturyzowany zapis tych relacji — do budowania PUNKTOWO,
per sprawa, nie jako gotowa baza (system nie ma z góry przygotowanego grafu
dla wszystkich specustaw — byłoby to nieaktualne przy każdej nowelizacji).

### 5.2 Schemat węzłów i krawędzi

**Węzeł (akt prawny):**
```json
{
  "id": "akt_kpa",
  "nazwa": "Kodeks postępowania administracyjnego",
  "typ": "ogólny | specjalny",
  "dz_u": "do zweryfikowania na ISAP przy użyciu"
}
```

**Krawędź (relacja derogacji/wyłączenia):**
```json
{
  "od": "akt_specustawa_drogowa",
  "do": "akt_kpa",
  "przepis_wylaczajacy": "art. X specustawy",
  "przepis_wylaczony": "art. 31 § 3 KPA",
  "zakres_derogacji": {
    "podmiotowy": "np. tylko organizacje społeczne jako uczestnik na prawach strony",
    "przedmiotowy": "np. tylko postępowania o wydanie decyzji ZRID",
    "czasowy": "np. tylko na czas obowiązywania specustawy — sprawdź czy epizodyczna czy bezterminowo przedłużana",
    "terytorialny": "zwykle brak ograniczenia terytorialnego w specustawach inwestycyjnych krajowych"
  },
  "klauzula_wprost": true,
  "zrodlo_weryfikacji": "ISAP — do uzupełnienia przy analizie konkretnej sprawy"
}
```

### 5.3 Procedura budowy grafu dla konkretnej sprawy

```
KROK G1 — Zidentyfikuj specustawę mającą zastosowanie do stanu faktycznego
          (tytuł zawiera zwykle "o szczególnych zasadach/rozwiązaniach...").
KROK G2 — Przeczytaj rozdział "przepisy zmieniające/końcowe/przejściowe"
          specustawy (zwykle na końcu aktu) — tam znajdują się KLAUZULE
          WPROST wyłączające stosowanie konkretnych przepisów aktów ogólnych.
KROK G3 — Dla każdej znalezionej klauzuli — zbuduj węzeł (akt ogólny) i
          krawędź (zakres derogacji) wg schematu z 5.2.
KROK G4 — Jeśli specustawa NIE zawiera klauzuli wprost dla danej kwestii —
          NIE zakładaj automatycznie derogacji. Zastosuj ALGORYTM LEX
          SPECIALIS (sekcja 4) do konkretnego przepisu ogólnego, który
          wydaje się kolidować.
KROK G5 — Zapisz graf jako tabelę w analizie sprawy (nie jako oddzielny
          plik trwały systemu — graf jest ARTEFAKTEM SPRAWY, nie
          elementem tego skilla), z jawnym odesłaniem source→target→zakres,
          żeby klient/sąd mógł prześledzić każdą derogację do konkretnego
          przepisu specustawy.
```

### 5.4 Przykład zastosowania (specustawa drogowa → 4 akty ogólne)

| Akt ogólny wyłączany | Zakres wyłączenia | Klauzula |
|---|---|---|
| KPA art. 31 § 3 | Udział organizacji społecznych jako uczestnik na prawach strony | Wprost, w niektórych wersjach specustaw inwestycyjnych — ⛔ zweryfikuj aktualne brzmienie, budzi kontrowersje doktrynalne (patrz pkt 2) |
| Ustawa o gospodarce nieruchomościami | Standardowa procedura wywłaszczenia zastąpiona przez ZRID | Wprost |
| Prawo budowlane | Odrębne decyzje (lokalizacyjna, podziałowa) zastąpione jedną decyzją ZRID | Wprost |
| Ustawa o planowaniu i zagospodarowaniu przestrzennym | Zgodność z MPZP nie jest badana tak jak w procedurze zwykłej | Częściowo, zależnie od wersji |

⛔ Tabela ilustracyjna — każdy wiersz wymaga potwierdzenia aktualnego brzmienia
konkretnej specustawy przed użyciem w piśmie (art. mogły się zmienić przy
kolejnych nowelizacjach przedłużających okres obowiązywania).

### 4.1 ORZECZNICTWO WPIĘTE — konstytucyjność specustawy drogowej (bilans)

Zweryfikowane online 2026-07-17 (punkt startowy, nie zamknięty katalog):

| Orzeczenie | Kierunek | Teza |
|---|---|---|
| TK, wyrok z 16.10.2012, sygn. K 4/10, OTK-A 2012/9/106 (potwierdzone: prawo.pl, OpenLEX, trybunal.gov.pl) | POTWIERDZAJĄCA | Art. 31 ust. 1-2 specustawy drogowej zgodny z art. 64 ust. 1 w zw. z art. 45 ust. 1 i art. 31 ust. 3 Konstytucji — uproszczona procedura ZRID i wywłaszczenie mieszczą się w granicach dopuszczalnej ingerencji w prawo własności |
| TK, wyrok z 30.06.2021, sygn. SK 37/19 (trybunal.gov.pl, komunikat oficjalny + BRPO) | KRYTYCZNA wobec konkretnego rozwiązania | Art. 23 specustawy drogowej, w zakresie w jakim NIE przewiduje zwrotu nieruchomości wywłaszczonej, gdy inwestycja drogowa ostatecznie nie powstała, jest niezgodny z Konstytucją — jeśli wywłaszczenie nie osiągnęło celu publicznego, jego skutki powinny być usunięte |

**Wniosek praktyczny z bilansu:** TK generalnie akceptuje UPROSZCZENIE procedury
przez specustawę (K 4/10) jako mieszczące się w granicach proporcjonalności —
ale nie akceptuje MILCZENIA specustawy tam, gdzie brak regulacji pozbawia
jednostkę gwarancji dostępnej na zasadach ogólnych (SK 37/19). To rozróżnienie
(uproszczenie proceduralne vs. luka w ochronie) jest kluczowe przy ocenie
konstytucyjności KAŻDEJ nowej specustawy — patrz KROK 5 algorytmu w sekcji 4
(czy specustawa ma klauzulę wprost, czy milczy).

⛔ Każde KOLEJNE powołanie wyroku TK/NSA nt. innej specustawy niż drogowa
wymaga odrębnej weryfikacji online — HARDGATE.

---

## 6. LITERATURA EKSPERCKA (zweryfikowana online 2026-07-17)

- **Wikipedia PL, hasło "Lex specialis derogat legi generali"** — systematyczny
  wykład reguły kolizyjnej, w tym kolizji z zasadą lex posterior i rozwiązania
  (lex posterior generalis non derogat legi priori speciali).
- **Wikipedia PL, hasło "Specustawa"** — katalog obowiązujących specustaw z
  numerami Dz.U. (punkt startowy do weryfikacji, nie źródło ostateczne).
- **P. Kroczek**, *Nowelizacja "Zasad techniki prawodawczej": przepisy
  epizodyczne* — artykuł naukowy omawiający nową kategorię ustawową
  wprowadzoną nowelizacją ZTP z 2015 r.
- **Blog Legislatora (W. Zając), wpisy "Przepisy epizodyczne a przepisy
  końcowe" i "Przepisy epizodyczne w praktyce"** — krytyczna analiza
  praktyczna kategorii przepisów epizodycznych przez praktykującego
  legislatora, w tym argument o ryzyku dla zasady pewności prawa.
- **S. Wronkowska, M. Zieliński**, *Komentarz do zasad techniki prawodawczej*
  — już cytowany w `mod-ZTP-przepisy-przejsciowe-doktryna.md`, obejmuje też
  Rozdział 4a (nie duplikować, patrz tamten moduł).
- Artykuły branżowe (prawo.pl) krytykujące rozrost liczby specustaw i ich
  stosowanie do inwestycji o marginalnym znaczeniu publicznym — przydatne
  jako argument o nieproporcjonalności przy kwestionowaniu zastosowania
  trybu specustawy w konkretnej sprawie.

---

## 7. INTEGRACJA Z SYSTEMEM

- **`mod-ZTP-przepisy-przejsciowe-doktryna.md`** — komplementarny, ten sam
  akt (ZTP), inny dział. Przy pytaniu łączonym ("czy to jest specustawa i
  jak działa jej przepis przejściowy") — wywołaj oba moduły.
- **DR-09 (Budownictwo/Środowisko/Energia/Transport)** — najczęstszy
  konsument: specustawa drogowa, mieszkaniowa, przesyłowa. DR-09 ustala
  WŁASNY, aktualny stan konkretnej specustawy (numer Dz.U., zakres); ten
  moduł dostarcza wyłącznie mechanizm/algorytm, nie aktualne dane.
- **DR-05 (Administracyjne)** — kolizje z KPA (art. 31 § 3 i inne wyłączenia
  proceduralne).
- **DR-14 (Międzynarodowe)** — specustawa o pomocy obywatelom Ukrainy jako
  przykład specustawy o charakterze migracyjnym/międzynarodowym.
- **`orzeczenia-sadowe-v2`** — źródło do weryfikacji orzecznictwa TK/SN/NSA
  dot. konstytucyjności konkretnych klauzul derogacyjnych specustaw
  (zwłaszcza wyłączeń art. 31 § 3 KPA — sygnalizowane w doktrynie jako
  potencjalnie sporne z art. 2 Konstytucji).
- **`pisma-procesowe-v3`** — przy zarzucie "sąd/organ zastosował niewłaściwy
  akt" (pomylenie reguły lex specialis) lub "specustawa nie ma zastosowania
  bo brak klauzuli wprost dla tej kwestii" — algorytm z sekcji 4 jako
  podstawa argumentacji.

---

## 8. ZOBACZ TEŻ — stany nadzwyczajne i sytuacje kryzysowe (dodane 2026-07-17)

Gdy pytanie dotyczy KONSTYTUCYJNEJ architektury reakcji na kryzys (klęska
żywiołowa, katastrofa, epidemia) — czyli poziomu WYŻEJ niż pojedyncza
specustawa: Rozdziału XI Konstytucji (art. 228-234), różnicy między
konstytucyjnym stanem klęski żywiołowej a ustawowym "stanem epidemii",
lub grafu zależności między reżimami kryzysowymi (nie pojedynczymi
przepisami) — wywołaj:

```
view /mnt/skills/user/dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-stany-nadzwyczajne-sytuacje-kryzysowe.md
```

Katalog specustaw doraźnych (np. koronawirusowa) POZOSTAJE w niniejszym
module (sekcja 3) — tamten moduł się do niego odsyła, nie duplikuje.

## CHANGELOG

**1.1 (2026-07-17):** Wpięto zweryfikowane sygnatury TK (K 4/10 — linia
potwierdzająca, SK 37/19 — linia krytyczna) do sekcji 4.1, bilans nt.
konstytucyjności specustawy drogowej. Weryfikacja: trybunal.gov.pl (komunikaty
oficjalne), prawo.pl, OpenLEX, BRPO.

**1.0 (2026-07-17):** Utworzenie modułu na wniosek użytkownika (mechanizm
specustaw + lex specialis + graf zależności). Zweryfikowano online: ZTP
Rozdział 4a § 29a-29c (przepisy epizodyczne, t.j. Dz.U. 2016 poz. 283 ze
zm.), katalog przykładowy specustaw (Wikipedia PL), reguła lex specialis
derogat legi generali i jej kolizja z lex posterior. Zarejestrowano w
`audyt-systemu-v4/references/CHECKLIST-DEDUP.md` jako lokalizację
kanoniczną — bez duplikacji z `mod-ZTP-przepisy-przejsciowe-doktryna.md`
(rozdzielenie: tamten = przepisy przejściowe/Rozdział 5 ZTP; ten = lex
specialis + przepisy epizodyczne/Rozdział 4a ZTP + graf zależności).

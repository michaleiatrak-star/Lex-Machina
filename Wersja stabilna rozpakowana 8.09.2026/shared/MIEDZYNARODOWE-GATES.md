# MIEDZYNARODOWE-GATES — Bramki dla spraw międzynarodowych (MG-1, MG-2)

> **Plik kanoniczny:** `shared/MIEDZYNARODOWE-GATES.md`
> **Wersja:** 1.1 | Utworzony: 2026-09-05 (F-162 — zasób wymagany fail-closed
> przez UP-5 i DR-14 nie istniał w paczce) · Przepisany na reguły uniwersalne
> 2026-09-05e (F-168) — usunięto pary akt+artykuł+rozstrzygnięcie
> odpowiadające wprost kazusom testowym; pozostawiono wyłącznie doktrynę
> ogólną (KWPT, ARSIWA jako nazwana metoda, nie jako gotowy wynik).
> **Wywołują:** `prawny-router-v3` (UP-5),
> `dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka`
> **Charakter:** ⛔ BLOKUJĄCE. Zastępują OŚ-GATE i WYJ-GATE w ścieżce UP-5.

---

## 0. STATUS TEGO PLIKU

UP-5 oraz DR-14 nakazywały odczyt tego modułu w reżimie fail-closed, ale plik
nie istniał na dysku. Skutkiem był tryb zdegradowany z substytucją funkcjonalną
(partia P4, 2026-09-05). Moduł odtwarza bramki na podstawie tekstów odczytanych
w tamtej sesji ze źródeł RZĘDU 1 i domyka lukę F-162.

**Relacja do bramek krajowych.** MG-1 zastępuje OŚ-GATE, MG-2 zastępuje
WYJ-GATE. CN-GATE (`shared/MOD-CN-GATE.md`) i REM-GATE
(`shared/MOD-REM-GATE.md`) **NIE są zastępowane** — działają w obu ścieżkach.
MG-1 rozszerza CN-1 i CN-2 o warstwę traktatową.

---

## 1. MG-1 — RATYFIKACJA, ZAKRES CZASOWY I PODMIOTOWY

> Pytanie bramki: **czy w chwili czynu ta norma wiązała TEN podmiot?**

Oś czasu w prawie międzynarodowym ma cztery punkty, nie jeden, i pominięcie
któregokolwiek unieważnia analizę.

### MG-1.1 — Cztery daty, osobno dla każdego państwa

```
(a) przyjęcie tekstu               — nie tworzy zobowiązań
(b) wejście w życie traktatu       — próg ogólny (zwykle n ratyfikacji)
(c) wejście w życie DLA TEGO państwa — data własna, zwykle 30–90 dni
                                     od złożenia dokumentu
(d) wejście w życie NOWELIZACJI dla tego państwa — reżim odrębny
```

⛔ Punkt (c) jest obowiązkowy dla KAŻDEGO państwa występującego w sprawie.
„Traktat obowiązuje od 1994 r." nie jest odpowiedzią — pytanie brzmi, od
kiedy obowiązuje tę stronę.

### MG-1.2 — Reżim nowelizacji

Nowelizacja traktatu nie musi wiązać wszystkich stron. **Wzorzec strukturalny:**
akt bazowy może wiązać wszystkie strony, a jego nowelizacja — tylko te, które
ją przyjęły lub ratyfikowały, wchodząc w życie dla nich w odrębnym terminie
(zwykle liczonym od złożenia własnego dokumentu przyjęcia). Wobec strony,
która nowelizacji nie przyjęła, instytucja stosująca akt może być pozbawiona
kompetencji co do materii objętej wyłącznie nowelizacją — sprawdź to wprost
w klauzuli o wejściu w życie zmian, nie zakładaj przez analogię do reżimu
ogólnego.

Skutek praktyczny: przepis może istnieć w aktualnym tekście traktatu
i jednocześnie nie mieć zastosowania do sprawy. Kontrola: czy sprawdzono
listę ratyfikacji nowelizacji, a nie tylko jej przyjęcie.

### MG-1.3 — Status podmiotowy państwa

Kategorie, których nie wolno mylić:

```
Państwo-Strona                          ≠  państwo związane wyłącznie aktem
                                           jednostronnym (deklaracja ad hoc,
                                           uznanie kompetencji dla wybranej
                                           kategorii spraw)
strona traktatu                         ≠  państwo związane normą zwyczajową
                                           o tej samej treści
umowa dwustronna A–B                    ≠  źródło obowiązków dla państwa C
                                           (zasada względnej skuteczności
                                           traktatów — państwo trzecie nie
                                           nabywa praw ani obowiązków bez
                                           własnej zgody)
reżim wypracowany dla relacji MIĘDZY    ≠  ten sam reżim automatycznie
CZŁONKAMI danego ugrupowania                przeniesiony na relację z PODMIOTEM
                                           SPOZA tego ugrupowania — wymaga
                                           odrębnego uzasadnienia, samo
                                           podobieństwo mechanizmu (np. sądu
                                           polubownego) nie wystarczy
```

### MG-1.4 — Zastrzeżenia i deklaracje

Sprawdź zastrzeżenia złożone przez każde państwo do powoływanej jednostki
oraz sprzeciwy innych stron. Zastrzeżenie modyfikuje zobowiązanie w relacji
dwustronnej i bywa decydujące przy jednym artykule, choć niewidoczne
w tekście traktatu.

### MG-1.5 — Retroakcja

Traktaty nie działają wstecz, o ile nie stanowią inaczej (KWPT art. 28).
Kontrola obowiązkowa przy każdym stanie faktycznym, którego początek
poprzedza wejście w życie instrumentu — typowo: materiał zebrany „dekady
wcześniej", umowy zawarte przed protokołem, czyny sprzed nowelizacji.

### Blok wyjściowy MG-1

```
MG-1
Państwo A: traktat X — w mocy od [data]; nowelizacja [tak/nie/⬛]; zastrzeżenia [...]
Państwo B: ...
Status podmiotowy: [Państwo-Strona / deklaracja ad hoc / państwo trzecie / ⬛]
Retroakcja: [zdarzenie przed/po wejściu w życie]
→ WYNIK: [norma wiąże / nie wiąże / wiąże warunkowo — ⬛ brak daty]
```

---

## 2. MG-2 — WYKŁADNIA TRAKTATU I KRAWĘDZIE JEDNOSTEK

> Pytanie bramki: **co zwykłe znaczenie tej jednostki wyłącza, a czego
> punktowy odczyt nie pokazuje?**

### MG-2.0 — Reguła bazowa (KWPT art. 31–33)

Traktat interpretuje się w dobrej wierze, zgodnie ze zwykłym znaczeniem
wyrazów w ich kontekście oraz w świetle przedmiotu i celu (art. 31 ust. 1).
Wraz z kontekstem uwzględnia się późniejsze porozumienia i praktykę
ustalającą porozumienie stron oraz odpowiednie normy prawa międzynarodowego
mające zastosowanie w stosunkach między stronami (art. 31 ust. 3). Prace
przygotowawcze służą potwierdzeniu znaczenia albo jego ustaleniu, gdy wynik
z art. 31 jest niejasny lub absurdalny (art. 32). Przy tekstach autentycznych
w kilku językach zob. art. 33.

⛔ **Wykładnia celowościowa nie może prowadzić do wyniku sprzecznego ze
zwykłym znaczeniem.** Argument „inaczej instrument byłby nieskuteczny" jest
mocny politycznie i słaby tekstowo — oznacz go jako taki (REM-3).

### MG-2.1 … MG-2.4 — Cztery zamiatania

```
S1  DEFINICJE I SĄSIEDZTWO
    → słowniczek aktu (zwykle art. 1–3) dla KAŻDEGO pojęcia użytego
      w rozstrzygnięciu
    → wyłączenia stoją IN FINE definicji, nie w osobnym przepisie
    → czas gramatyczny definicji bywa rozstrzygający — definicja odwołująca
      się do stanu aktualnego (czas teraźniejszy) wyklucza zastosowanie do
      przedmiotu, który już nie istnieje w tym stanie
    → definicja progowa wymaga cechy JAKOŚCIOWEJ (stanu czynnego, zdatności,
      zachowanej właściwości), nie samej przynależności rodzajowej — materiał
      szczątkowy, uszkodzony albo zrekonstruowany może nie spełniać progu

S2  KRAWĘDZIE JEDNOSTKI
    → pierwszy i ostatni ustęp artykułu — tam stoją klauzule zachowawcze,
      zastrzegające, że dana regulacja nie wyczerpuje uprawnień strony
      ani nie uchyla innych reżimów; przeczytaj artykuł DO KOŃCA
    → nagłówek katalogu, w którym leży punkt: katalog ma własny warunek
      wstępny, którego w punkcie nie widać — możesz poprawnie zacytować
      punkt i mimo to pozostać poza zakresem całego katalogu
    → sprawdź, czy akt nie zawiera klauzuli stabilizującej określony stan
      prawny wbrew zmianie okoliczności faktycznych — takie klauzule
      przesądzają sprawę jednym zdaniem i łatwo je przeoczyć, bo stoją poza
      głównym przepisem regulującym daną instytucję

S3  INSTRUMENTY POWIĄZANE I LEX SPECIALIS GDZIE INDZIEJ
    → protokoły, porozumienia wykonawcze, konwencje siostrzane regulujące
      TEN SAM przedmiot z innej strony — jedna grupa instrumentów może
      dzielić między siebie aspekty jednego zjawiska, a właściwa odpowiedź
      leżeć w instrumencie innym niż ten najbardziej oczywisty
    → normy zwyczajowe o tej samej treści (art. 31 ust. 3 lit. c KWPT)
    → akty organów traktatowych: rezolucje, decyzje okresowych konferencji
      stron, rekomendacje komitetów — z jawnym oznaczeniem mocy wiążącej;
      ⚑ samo USTANOWIENIE późniejszego mechanizmu regulującego daną kwestię
      bywa argumentem, że reżim bazowy jej NIE obejmował — inaczej mechanizm
      byłby zbędny; działa to w obie strony i trzeba to rozważyć jawnie

S4  NOWELIZACJE I REŻIM PRZEJŚCIOWY
    → przekazuje ustalenia do MG-1.2
    → reguły temporalne regulaminów proceduralnych bywają ODWROTNE między
      systemami tego samego rodzaju: jeden system wiąże wersję regulaminu
      z chwilą wyrażenia zgody na daną procedurę, inny — z chwilą faktycznego
      wszczęcia postępowania; nigdy nie zakładaj kierunku bez sprawdzenia
      tekstu źródłowego dla KONKRETNEGO systemu
```

⛔ Milczenie nie jest odpowiedzią negatywną. Każde zamiatanie zamyka się
wpisem „brak" albo nazwanym skutkiem.

### Blok wyjściowy MG-2

```
MG-2
S1 definicje:   [n trafień] — [...]
S2 krawędzie:   [n trafień] — [...]
S3 powiązane:   [n trafień] — [...]
S4 nowelizacje: [n trafień] — [...]
```

---

## 3. TRZY BŁĘDY, KTÓRE TE BRAMKI ZAMYKAJĄ

Zmierzone w partii P4; kontrola obowiązkowa w każdej sprawie międzynarodowej.

```
(a) zlanie warstw: jurysdykcja / prawo właściwe / wykonalność w jedno pytanie
    — każda z trzech ma inny test i inny organ właściwy; odpowiedź na jedną
    nie przesądza pozostałych
(b) atrybucja per podmiot („powiązany własnościowo lub organizacyjnie
    z państwem, więc to zachowanie państwa") zamiast per zachowanie —
    zastosuj rozłączne testy z CN-2 (status organu / wykonywanie funkcji
    publicznych / faktyczne kierowanie KONKRETNYM zachowaniem)
(c) ZAŁOŻENIE reżimu odpowiedzialności (np. że jest absolutny) zamiast
    odczytania go z tekstu — sprawdź, czy nie istnieje przepis-bliźniak
    ustanawiający inny standard (winy zamiast odpowiedzialności absolutnej)
    dla innego miejsca, przedmiotu albo strony zdarzenia (CN-3)
```

---

## 4. INTEGRACJA

```
Wywołanie:   prawny-router-v3 → UP-5 (sprawa transgraniczna / prawo obce)
             dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka
Zastępuje:   shared/MOD-OS-CZASU-PRZESLANEK.md → MG-1
             shared/MOD-WYJATEK-GATE.md → MG-2
NIE zastępuje: shared/MOD-CN-GATE.md, shared/MOD-REM-GATE.md,
             shared/PRAWO-HARDGATE.md — aktywne w obu ścieżkach
Źródła:      shared/HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md
Rejestr:     shared/MOD-STEP-TRACKER.md — pozycje „MG-1" i „MG-2" obowiązkowe
```

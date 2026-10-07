# MOD-CN-GATE — Bramka normy centralnej (CN-GATE)

> **Plik kanoniczny:** `shared/MOD-CN-GATE.md`
> **Wersja:** 2.0 | Utworzony: 2026-09-05 (F-163) · Przepisany na reguły
> uniwersalne 2026-09-05e (F-168) — usunięto przykłady wzorcowe powiązane
> z konkretnymi kazusami testowymi.
> **Wywołują:** `prawny-router-v3` (BRAMKA NORMY CENTRALNEJ, przed KROK 4),
> wszystkie skille analityczne i pismowe
> **Charakter:** ⛔ BLOKUJĄCA. Bez zamkniętego bloku CN-GATE nie wolno oddać
> analizy, opinii ani pisma.
> **Nie jest** bramką weryfikacyjną — nie zastępuje `shared/PRAWO-HARDGATE.md`.
> HARD GATE pyta „czy ten przepis brzmi tak, jak twierdzę". CN-GATE pyta
> **„czy ten przepis w ogóle obowiązuje ten podmiot w tym stanie faktycznym"**.

---

## 0. DLACZEGO TEN MODUŁ NIE ZAWIERA NAZWANYCH PRZYKŁADÓW

> ⛔ Wersja 1.0 tego modułu ilustrowała każdą regułę konkretnym aktem,
> artykułem i rozstrzygnięciem z bazy kazusów testowych. Skutek uboczny:
> model wykonujący bramkę na tych samych kazusach dostawał gotową odpowiedź
> wpisaną w treść narzędzia, zamiast ją wypracować (F-167/F-168, test
> kontrolny 2026-09-05d). Poniższe reguły są opisane jako **klasy wzorców
> strukturalnych** — rozpoznawalne w dowolnym akcie prawnym, bez wskazania,
> który akt, który artykuł i które rozstrzygnięcie akurat pasuje do sprawy
> aktualnie analizowanej. Znajomość doktryny ogólnej (np. testu atrybucji
> państwa, reguł wykładni traktatów) pozostaje w tekście, bo jest to
> narzędzie pracy, nie odpowiedź na pytanie egzaminacyjne — różnica polega na
> tym, że doktryna ogólna nie mówi, KTÓRA strona sporu ją wygrywa.

---

## 1. PROBLEM, KTÓRY TEN MODUŁ ZAMYKA

> ⛔ **Poprawnie odczytany przepis, który nie ma zastosowania, jest groźniejszy
> niż przepis niezweryfikowany — bo cała dalsza analiza wygląda na rzetelną.**

Istniejące bramki zamykają trzy pytania i żadna nie zamyka czwartego:

```
HARD GATE      → czy cytat brzmi tak, jak twierdzę?              (treść)
OŚ-GATE        → która wersja i który reżim na daną chwilę?      (czas)
WYJ-GATE       → co tę regułę wyłącza, zawęża albo odsyła?       (otoczenie)
CN-GATE        → czy ta norma obejmuje TEN PODMIOT i TEN STAN?   (zakres)  ← luka
```

Różnica między OŚ-GATE a CN-GATE jest istotna i nie wolno ich mylić. OŚ-GATE
pracuje na osi czasu wewnątrz jednego, już wybranego reżimu. CN-GATE pyta,
czy wybrany reżim jest w ogóle właściwy — a to obejmuje także zakres
podmiotowy i przedmiotowy, których oś czasu nie dotyka.

**Mechanizm awarii, w postaci ogólnej.** Analiza cytuje jednostkę redakcyjną
poprawnie — treść się zgadza, wersja czasowa się zgadza — i zatrzymuje się na
tym. Nie sprawdza, czy ta jednostka **w ogóle obejmuje** rozpatrywaną stronę
albo rozpatrywany stan faktyczny. Im bardziej fachowo brzmi cytat, tym mniej
prawdopodobne, że ktokolwiek wróci sprawdzić zakres.

---

## 2. DLACZEGO REGUŁA BRZMI „NAZWIJ JEDNĄ NORMĘ", A NIE „SPRAWDŹ ZAKRES"

Reguła „sprawdź zakres zastosowania przepisów" jest ocenna i dlatego
bezużyteczna jako bramka: przy pięciu powołanych aktach sprawdzenie
„zakresu" rozmywa się w deklarację. CN-GATE żąda czegoś policzalnego —
**wskazania jednej jednostki redakcyjnej per oś sporu** i przepuszczenia jej
przez trzy zamknięte pytania. Wykonanie da się sprawdzić z zewnątrz pytaniem
„czy w bloku są trzy odpowiedzi na normę", bez wchodzenia w merytorykę.

Warunek ocenny to udokumentowany tryb awarii tego systemu — F-113 (reguła
obecna w pliku, nieodpalająca) i F-119 (bramka samoraportująca).

---

## 3. WYZWALACZ — MECHANICZNY

```
CZY W ODPOWIEDZI JEST ROZSTRZYGNIĘCIE, ZARZUT, ROSZCZENIE ALBO KWALIFIKACJA?
  TAK → wykonaj CN-GATE.
```

Wyzwalacz jest liczbowy, nie ocenny. Bramka odpala także wtedy, gdy sprawa
wydaje się prosta, a przepis oczywisty — właśnie wtedy najczęściej zawodzi.
Polecenia „krótko" / „szybko" / „tylko odpowiedz" NIE zwalniają; przy jednej
osi sporu blok ma trzy linie, ale musi być.

**Kolejność wobec innych bramek.** CN-GATE wykonuje się **przed** OŚ-GATE
i WYJ-GATE. Nie ma sensu ustalać właściwej wersji czasowej ani zamiatać
sąsiedztwa normy, która nie ma zastosowania.

---

## 4. PROCEDURA — CN-1 … CN-3

Dla **każdej osi sporu** (osobne roszczenie, zarzut, kwalifikacja) wskaż
**jedną** jednostkę redakcyjną, która ją rozstrzyga, i odpowiedz na trzy
pytania. Każda odpowiedź zamyka się słowem „TAK", „NIE" albo „⬛ brak faktu".

### CN-1 — ZAKRES CZASOWY

```
Czy norma obowiązywała w tym brzmieniu w chwili, którą prawo wskazuje
jako miarodajną dla tej przesłanki?
```

Sprawdź: wejście w życie, nowelizacje, vacatio legis, przepisy przejściowe.
Trzy klasy wzorców, na jakie natrafisz niezależnie od dziedziny:

- **Nowelizacja o ograniczonym skutku podmiotowym.** Zmiana aktu może wiązać
  wyłącznie tych adresatów, którzy ją przyjęli lub ratyfikowali, podczas gdy
  wersja bazowa nadal wiąże pozostałych. Sprawdzaj zawsze, czy nowelizacja
  jest powszechna, czy warunkowa — domyślne założenie „skoro jest w tekście,
  to obowiązuje wszystkich" jest błędne częściej, niż się wydaje.
- **Reguła temporalna proceduralna o przeciwnym punkcie odniesienia.**
  Różne systemy proceduralne (regulaminy, statuty instytucji) wskazują różne
  chwile jako miarodajne dla wyboru wersji przepisów procesowych — jedne
  liczą od momentu powstania zobowiązania lub wyrażenia zgody na daną
  procedurę, inne od momentu faktycznego wszczęcia postępowania. Reguły bywają
  **odwrotne** między systemami tego samego rodzaju — nigdy nie zakładaj
  kierunku, sprawdź tekst źródłowy dla KONKRETNEGO systemu.
- **Retroakcja.** Norma nie działa wstecz, chyba że wprost tak stanowi.
  Kontrola obowiązkowa przy każdym stanie faktycznym, którego początek
  poprzedza wejście w życie badanego aktu, protokołu czy nowelizacji.

### CN-2 — ZAKRES PODMIOTOWY

```
Czy norma obejmuje TEN podmiot?
```

Sprawdź definicję podmiotową w akcie (zwykle przepisy początkowe albo
słowniczek), nie intuicję co do „rodzaju" podmiotu. Trzy klasy wzorców:

- **Wyłączenie definicyjne umieszczone na końcu przepisu.** Definicja ogólna
  bywa zawężona zdaniem dodanym na końcu tego samego ustępu albo artykułu
  („[kategoria] nie obejmuje..."), a nie osobnym, łatwym do znalezienia
  przepisem. Czytaj definicję do końca, nie do pierwszego przecinka, który
  wygląda na kompletny.
- **Status formalny różny od statusu faktycznego lub częściowego.** Pełne
  członkostwo w traktacie albo organizacji to inna kategoria niż związanie
  częścią jego reżimu przez akt jednostronny (deklaracja, zastrzeżenie,
  przystąpienie do wybranych postanowień). Reżim czy linia orzecznicza
  wypracowane dla jednej konfiguracji stron (np. relacji między pełnymi
  członkami tego samego ugrupowania) **nie przenoszą się automatycznie** na
  odmienną konfigurację (np. relację z podmiotem spoza tego ugrupowania) —
  wymaga to odrębnego uzasadnienia, nie analogii.
- **Kontrola własnościowa lub organizacyjna nie jest tożsama z wykonywaniem
  funkcji, których dotyczy badana norma.** Gdy podmiot jest powiązany
  z inną osobą prawną (własnością, obsadą organów, wymogiem zgody na
  decyzje), samo to powiązanie nie przesądza, że zachowanie tego podmiotu
  jest przypisywalne powiązanej osobie. Atrybucja bada się przez rozłączne
  testy: (i) czy podmiot ma status organu wedle prawa właściwego, (ii) czy
  w danym przypadku wykonywał funkcje publiczne, (iii) czy powiązana osoba
  faktycznie kierowała **tym konkretnym zachowaniem**, a nie tylko
  zatwierdziła decyzję o jego podjęciu. Każdy test przechodzi się osobno;
  spełnienie jednego nie przesądza pozostałych.

### CN-3 — ZAKRES PRZEDMIOTOWY

```
Czy norma obejmuje TEN stan faktyczny?
```

Trzy klasy wzorców:

- **Warunek wstępny w nagłówku katalogu, nie w punkcie.** Katalog przepisów
  bywa podzielony na grupy, z których każda ma własny warunek zastosowania
  zapisany w nagłówku grupy (np. rodzaj sytuacji, do której cała grupa się
  odnosi), a nie powtórzony przy każdym punkcie z osobna. Można poprawnie
  zacytować treść punktu i mimo to pozostać poza zakresem całej grupy, jeśli
  warunek z nagłówka nie jest spełniony. Zawsze sprawdź nagłówek grupy, nie
  tylko punkt.
- **Przepisy-bliźniaki o różnym reżimie.** Sąsiadujące jednostki redakcyjne
  bywają skonstruowane tak, że ustanawiają odmienne reżimy prawne (inny próg
  odpowiedzialności, inny standard, inny skutek) w zależności od miejsca,
  przedmiotu albo strony zdarzenia. Łatwo pomylić, który z bliźniaczych
  przepisów stosuje się do danego stanu faktycznego, zwłaszcza gdy oba
  brzmią podobnie i różnią się jedną przesłanką.
- **Definicja progowa i definicja czasu teraźniejszego.** Niektóre definicje
  wymagają spełnienia cechy jakościowej, a nie samej przynależności rodzajowej
  — obecność elementu w postaci szczątkowej, uszkodzonej albo
  zrekonstruowanej może nie wystarczyć, jeśli definicja żąda cechy czynnej.
  Inne definicje odwołują się do stanu aktualnego — czas gramatyczny
  w przepisie definiującym bywa rozstrzygający i wyklucza zastosowanie do
  sytuacji, w której wymagany stan już nie zachodzi albo nigdy nie zachodził
  wobec tego podmiotu. Sprawdź czas gramatyczny definicji, nie tylko jej treść.

---

## 5. BLOK WYJŚCIOWY — OBOWIĄZKOWY I WIDOCZNY

Blok umieszcza się **przed konkluzjami**, nie w przypisie.

```
CN-GATE
Oś sporu 1: [nazwa] → norma centralna: [akt, jednostka]
  CN-1 czasowy:     [TAK / NIE / ⬛] — [jedno zdanie]
  CN-2 podmiotowy:  [TAK / NIE / ⬛] — [jedno zdanie]
  CN-3 przedmiotowy:[TAK / NIE / ⬛] — [jedno zdanie]
  → WYNIK: [stosuje się / NIE stosuje się → norma zastępcza: ... / warunkowo]
Oś sporu 2: ...
```

⛔ **Milczenie nie jest odpowiedzią negatywną.** Pominięta pozycja = bramka
niewykonana, nawet gdy wynik i tak byłby „TAK".

⛔ **„NIE" w którymkolwiek punkcie jest BLOKUJĄCE.** Nie wolno kontynuować
analizy na tej normie. Trzeba albo wskazać normę zastępczą i powtórzyć dla
niej CN-1…CN-3, albo jawnie stwierdzić brak podstawy.

⛔ **⬛ nie jest przejściem.** Brak faktu przenosi oś sporu do REM-GATE
(`shared/MOD-REM-GATE.md`) jako rozstrzygnięcie warunkowe — nie zamyka jej
milczeniem.

---

## 6. ŚCIEŻKA NADPISANIA (OVERRIDE)

Bramka jest blokująca, ale nie jest ślepa. Kontynuacja mimo wyniku „NIE"
jest dopuszczalna **wyłącznie** przy spełnieniu obu warunków łącznie:

```
(a) w bloku CN-GATE widnieje wpis:
    ⚠️ OVERRIDE CN-[1/2/3] — [podstawa nadpisania w jednym zdaniu]
(b) podstawą jest norma wyższego rzędu, zwyczaj międzynarodowy albo
    utrwalone orzecznictwo POWOŁANE I ZWERYFIKOWANE w tej turze
```

„Przepis wydaje się mimo wszystko właściwy", „intencja ustawodawcy",
„analogia" — NIE są podstawami nadpisania. W dziedzinach, w których ustawa
wymaga wykładni ścisłej i wprost zakazuje analogii na niekorzyść adresata
normy (typowo: prawo karne materialne, w tym prawo karne międzynarodowe),
nadpisanie jest **zakazane bezwzględnie** — wątpliwość co do zakresu
zastosowania rozstrzyga się wtedy na korzyść osoby, wobec której normę
próbuje się zastosować.

---

## 7. INTEGRACJA

```
Wywołanie:   prawny-router-v3 → BRAMKA NORMY CENTRALNEJ (przed OŚ-GATE)
Poprzedza:   shared/MOD-OS-CZASU-PRZESLANEK.md (OŚ-GATE)
             shared/MOD-WYJATEK-GATE.md (WYJ-GATE)
Zasila:      shared/MOD-REM-GATE.md (wyniki ⬛ → rozstrzygnięcie warunkowe)
Wariant
międzynar.:  shared/MIEDZYNARODOWE-GATES.md §MG-1 rozszerza CN-1 i CN-2
             o ratyfikację i reżim nowelizacji
Rejestr:     shared/MOD-STEP-TRACKER.md — pozycja „CN-GATE" obowiązkowa
             w raporcie pominięć (FAZA 2)
```

⛔ CN-GATE nie rozstrzyga sprawy. Produkuje odpowiedź na pytanie, czy wolno
ją rozstrzygać na wskazanej podstawie.

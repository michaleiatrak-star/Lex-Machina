# REGRESSION-TEST-PLAN.md — Plan Testów Regresyjnych systemu prawo-polskie-v2

> **Wersja:** 1.0 (2026-07-21)
> **Metodologia:** oparta na standardowej praktyce testów regresyjnych
> (zweryfikowanej online 2026-07-21: TestRail, BrowserStack, QualityLogic,
> TestDevLab) — zaadaptowanej do specyfiki systemu skilli
> markdown-jako-baza-wiedzy dla LLM (nie jest to typowa aplikacja
> softwarowa, więc "regresja" oznacza tu: PONOWNE pojawienie się BŁĘDU
> STRUKTURALNEGO/SPÓJNOŚCIOWEGO, który JUŻ RAZ wystąpił i został
> naprawiony w tej sesji).
> **Zasada naczelna testów regresyjnych (za TestRail):** "regression
> tests re-execute previously successful test cases after any major
> updates" — KAŻDY test w tym zestawie odpowiada KONKRETNEMU,
> RZECZYWIŚCIE znalezionemu i naprawionemu błędowi w historii tej
> sesji (2026-07-19 do 2026-07-21), NIE jest to test hipotetyczny.

---

## 1. ZAKRES (Scope) — za BrowserStack/QualityLogic: "impact analysis"

```
Testowany system: /mnt/skills/user/ — 17 skilli DR (DR-01 do DR-16 +
prawo-polskie-v2 jako fasada routingu) + shared/ (180 plików
wspólnych) + narzędzia pomocnicze (pisma-proste-v2, analizator-umow-v1,
audyt-systemu-v4).

Zakres NIE obejmuje: poprawności MERYTORYCZNEJ treści prawnej (to
wymaga eksperckiej weryfikacji prawniczej, poza możliwościami testu
automatycznego) — WYŁĄCZNIE integralność STRUKTURALNĄ i SPÓJNOŚCIOWĄ.
```

---

## 2. KATEGORIE TESTÓW (Test Suite Structure) — za Insurity/TestDevLab: "structure by coverage area"

| # | Kategoria | Priorytet | Źródło (błąd rzeczywisty z tej sesji) |
|---|---|---|---|
| T1 | Rejestracja modułów | ⭐⭐⭐ KRYTYCZNY | 15+ modułów w DR-03 istniało fizycznie, nigdy niezarejestrowanych w SKILL.md (audyt 2026-07-21o) |
| T2 | Zgodność liczników | ⭐⭐ WYSOKI | SKILL.md deklarował "37 modułów", fizycznie było 52 (ta sama data) |
| T3 | Spójność Dz.U. między mapami | ⭐⭐⭐ KRYTYCZNY | Ustawa o SUS/ZUS: lokalna mapa DR-04 vs główna ROUTING-MAP wskazywały RÓŻNE numery Dz.U. dla TEGO SAMEGO aktu (audyt 2026-07-21m) |
| T4 | Integralność nagłówków Markdown | ⭐⭐⭐ KRYTYCZNY | Przypadkowa utrata nagłówka "ŁĄCZ Z" przy wstawianiu treści przez str_replace (co najmniej 2 udokumentowane przypadki w tej sesji) |
| T5 | "Widmowe pokrycie" (ghost coverage) | ⭐⭐ WYSOKI | Główna mapa deklarowała "Specustawa drogowa ✅ OK" wskazując moduł, w którym ta treść NIGDY nie istniała (audyt 2026-07-21g) |
| T6 | Zerwane odwołania | ⭐⭐⭐ KRYTYCZNY | JUŻ POKRYTE przez istniejący `ci_check_shared.py` — NIE duplikować, WYWOŁYWAĆ jako część tego zestawu |
| T7 | Duplikaty bajtowe | ⭐ ŚREDNI | JUŻ POKRYTE przez istniejący `ci_check_shared.py` |
| T8 | Zakresy tytuł-vs-treść | ⭐⭐ WYSOKI | Moduł `mod-KK-art148-162` obiecywał w tytule "art. 148-162", treść urywała się na art. 157 (audyt 2026-07-21o) |
| T9 | Weryfikacja przeniesień do shared/ | ⭐⭐ WYSOKI | Dodane 2026-07-21 przy PONOWNYM przeglądzie T1 — wąski, celowany następca próbnego, SZEROKIEGO skanera dangling references, który dał ZBYT DUŻO szumu (patrz sekcja 10) |
| ~~T10~~ | ~~Monitorowanie plików Nexto/Virtualo o niepewnym statusie prawnym~~ | — | USUNIĘTE 2026-07-24d na polecenie użytkownika (wraz z flagą F-12, rejestrem i skryptem `check_nexto_free_files.py`) — patrz `AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-24d |

---

## 3. PODEJŚCIE (Approach) — za TestDevLab: "combined manual + automated"

```
AUTOMATYZOWANE (skrypty Python, deterministyczne, bez zależności od
LLM/sieci — ta sama filozofia co istniejący ci_check_shared.py):
  T1, T2, T3 (częściowo), T4, T6, T7

WYMAGAJĄCE OSĄDU CZŁOWIEKA/LLM przy URUCHOMIENIU (skrypt jedynie
WSKAZUJE kandydatów do weryfikacji, NIE rozstrzyga automatycznie):
  T3 (ostateczna ocena, KTÓRY Dz.U. jest poprawny — wymaga sprawdzenia
  na ISAP), T5, T8 (skrypt wykrywa PODEJRZANE wzorce, człowiek/LLM
  POTWIERDZA czy to faktyczny błąd)
```

---

## 4. PRIORYTETYZACJA — za TestRail: "focus on high-impact flows"

```
⭐⭐⭐ KRYTYCZNE (T1, T3, T4, T6) — URUCHAMIAĆ przy KAŻDEJ sesji audytowej
  i PO KAŻDEJ serii edycji plików .md, NIEZALEŻNIE od tego, jak mała
  wydaje się zmiana — te błędy WIELOKROTNIE wystąpiły "po cichu"
⭐⭐ WYSOKIE (T2, T5, T8) — URUCHAMIAĆ przy KOŃCU każdej sesji, PRZED
  finalnym pakowaniem/dostarczeniem plików użytkownikowi
⭐ ŚREDNI (T7) — URUCHAMIAĆ okresowo (np. raz na kilka sesji), NIE
  BLOKUJE dostarczenia (tylko ostrzeżenie, zgodnie z ISTNIEJĄCĄ logiką
  ci_check_shared.py)
```

---

## 5. KRYTERIA WYJŚCIA (Exit Criteria) — za Insurity: "define pass/fail thresholds"

```
✅ PASS — zestaw testów można uznać za ZALICZONY, gdy:
  □ T1: ZERO plików modułów na dysku spoza listy w SKILL.md danego skilla
  □ T2: licznik zadeklarowany w SKILL.md == rzeczywista liczba plików
    modułów NA DYSKU (z uwzględnieniem jawnie oznaczonych wyjątków, np.
    "przeniesiony do shared/")
  □ T3: ZERO przypadków, gdzie TEN SAM akt prawny (identyfikowany po
    NAZWIE ustawy) ma RÓŻNE numery Dz.U. w lokalnej MAPA-AKTOW vs
    głównej ROUTING-MAP.md BEZ jawnego komentarza wyjaśniającego
    rozbieżność (⚠️ z odnotowaniem "do weryfikacji")
  □ T4: (weryfikacja MANUALNA/przy code review, PO edycji) — brak
    NIEOCZEKIWANEGO zmniejszenia liczby nagłówków `^## ` w edytowanym
    pliku względem stanu SPRZED edycji
  □ T6/T7: kod wyjścia `ci_check_shared.py` == 0 (brak zerwanych
    odwołań; duplikaty dozwolone jako ostrzeżenie)

⚠️ WARUNKOWY PASS — dopuszczalne z ZASTRZEŻENIEM, gdy rozbieżność jest
  JAWNIE, PISEMNIE odnotowana jako "wymaga weryfikacji" (np. przy
  nowelizacjach w trakcie procesu legislacyjnego, gdzie numer Dz.U.
  jeszcze nie istnieje)

❌ FAIL — jakikolwiek wynik T1/T3/T6 POZA kategorią "warunkowy pass"
  BLOKUJE uznanie sesji za zakończoną poprawnie — WYMAGA naprawy PRZED
  dostarczeniem plików użytkownikowi
```

---

## 6. NARZĘDZIA (Tooling)

```
scripts/test_module_registration.py   → T1 (v1.1 — naprawiono ryzyko fałszywego negatywu przy nazwach-podciągach, 2026-07-21)
scripts/test_module_count.py          → T2
scripts/test_cross_map_dzu.py         → T3 (część automatyzowalna)
scripts/test_header_snapshot.py       → T4 (mechanizm migawki przed/po)
scripts/test_title_scope_match.py     → T8 (heurystyka: zakres liczb w
                                          tytule pliku vs treść)
scripts/test_moved_to_shared.py       → T9 (weryfikacja że deklarowane
                                          przeniesienia do shared/ mają
                                          potwierdzony plik docelowy)
scripts/ci_check_shared.py            → T6, T7 (JUŻ ISTNIEJĄCY, nie
                                          duplikować — WYWOŁYWANY przez
                                          run_regression_suite.py)
scripts/run_regression_suite.py       → URUCHAMIA WSZYSTKIE powyższe,
                                          zbiera wyniki w JEDEN raport
scripts/install_precommit_hook.sh     → v2.0 (2026-07-21) — instaluje
                                          PEŁNY run_regression_suite.py
                                          jako git pre-commit hook (NIE
                                          wyłącznie ci_check_shared.py
                                          jak w wersji 1.0 — POPRAWKA
                                          znaleziona przy tym przeglądzie,
                                          patrz sekcja 10)
```

---

## 7. UTRZYMANIE (Maintenance) — za TestDevLab: "regular reviews, add/update/remove"

```
□ PO KAŻDYM audycie znajdującym NOWY wzorzec błędu (nie pokryty przez
  T1-T8) — DODAĆ nową kategorię testu do tego planu I odpowiadający
  skrypt, z ODWOŁANIEM do konkretnego wpisu w AUDIT-JOURNAL.md, KTÓRY
  ten błąd udokumentował (zasada TRACEABILITY — identyfikowalność
  testu wstecz do przyczyny jego powstania)
□ Ten plik jest KANONICZNYM dokumentem — zmiany w zakresie/priorytetach
  testów WYMAGAJĄ aktualizacji TUTAJ, nie tylko w kodzie skryptów
```

---

## 8. RAPORTOWANIE

```
Każde uruchomienie `run_regression_suite.py` generuje:
  1) Wynik ZBIORCZY (PASS/WARN/FAIL) na poziomie CAŁEGO systemu
  2) Wynik SZCZEGÓŁOWY per kategoria testu (T1-T8)
  3) Listę KONKRETNYCH plików/wpisów wymagających uwagi, z odesłaniem
     do NUMERU kategorii testu, KTÓRY je wykrył
  4) Sugerowany NASTĘPNY krok (np. "sprawdź na ISAP", "dodaj wpis do
     SKILL.md", "przywróć usunięty nagłówek")
```

---

## 9. ⭐⭐ WALIDACJA — PIERWSZE PEŁNE URUCHOMIENIE (dodane 2026-07-21)

```
Przy dokończeniu implementacji (skrypty T2, T3, T4, T8 oraz orkiestrator
run_regression_suite.py — wcześniej ISTNIAŁ tylko test_module_registration.py
dla T1, a SAM plan NIE BYŁ zarejestrowany w SKILL.md, dokładnie ten sam
wzorzec "plan bez pełnej implementacji" znajdowany wielokrotnie w tej
sesji) — WYKONANO PEŁNE URUCHOMIENIE na całym systemie, z NASTĘPUJĄCYMI
wynikami:

□ T1: ✅ PASS — 18 skilli sprawdzonych, zero niezarejestrowanych modułów
  (poza 25 pozycjami do weryfikacji manualnej w skillach o odwołaniach
  skrótowych — analizator-dowodow-v3, pisma-procesowe-v3)

□ T2: ⭐ ZNALEZIONO I NAPRAWIONO PRAWDZIWY BŁĄD przy PIERWSZYM
  uruchomieniu — dr-10-zdrowie-farmacja-zywnosc-rolnictwo/SKILL.md
  deklarował "27 łącznie", fizycznie 28 plików (wszystkie 28 BYŁY
  indywidualnie zarejestrowane, licznik zbiorczy po prostu nie został
  zaktualizowany przy dodaniu ostatniego modułu) — NAPRAWIONE, PONOWNE
  uruchomienie: ✅ PASS
  ⚠️ SKRYPT WYMAGAŁ WŁASNEJ NAPRAWY: pierwsza wersja BŁĘDNIE odejmowała
  adnotacje "X przeniesiony do shared/" od liczby fizycznej, dając
  FAŁSZYWE POZYTYWY dla DR-03 i DR-16 (gdzie adnotacja jest opisowa/
  historyczna, NIE dodatkowym wyjątkiem do odjęcia) — USUNIĘTO tę
  logikę, PO naprawie: czysty PASS

□ T3: ⭐⭐ ZNALEZIONO I NAPRAWIONO PRAWDZIWY, AKTYWNY BŁĄD REGRESJI —
  ustawa o samorządzie gminnym (DR-08): lokalna MAPA-AKTOW.md miała
  JUŻ POPRAWIONY numer (Dz.U. 2026 poz. 662, z jawną notatką o
  wcześniejszej korekcie z 2026-07-02), ale główna ROUTING-MAP.md
  NADAL wskazywała STARY numer (2025 poz. 1153) — poprawka NIGDY nie
  została zsynchronizowana do głównej mapy. NAPRAWIONE w tej sesji.
  ⚠️ SKRYPT WYMAGAŁ ISTOTNEJ NAPRAWY: pierwsza wersja heurystyki
  dopasowania (pierwsze 6 słów >3 znaki jako "klucz") dawała MASOWE
  fałszywe pozytywy (np. "Ustawa AML" mylona z "PIT"/"CIT"/"VAT" przez
  redukcję do jednego, zbyt ogólnego słowa "ustawa") — PRZEPISANO na
  dopasowanie przez PODOBIEŃSTWO JACCARDA zbiorów słów dystynktywnych
  (próg 0.5, z wykluczeniem słów nadmiernie ogólnych: "ustawa",
  "kodeks", "prawo", "przepisy") — z dziesiątek fałszywych trafień do
  4-5 sensownych kandydatów, w tym POTWIERDZONEGO prawdziwego błędu

□ T4: skrypt zbudowany i przetestowany na pojedynczym pliku (mechanizm
  migawki działa poprawnie) — WYMAGA rutynowego stosowania PRZY
  każdej edycji str_replace w przyszłych sesjach, nie uruchamiany
  wstecznie (brak stanu "przed" dla JUŻ wykonanych edycji)

□ T6/T7: ✅ PASS — 711 plików przeskanowanych, zero zerwanych odwołań,
  zero duplikatów bajtowych (istniejący ci_check_shared.py, ponownie
  potwierdzony jako działający)

□ T8: WARN — 7 przypadków oznaczonych do weryfikacji manualnej w
  DR-03. SPRAWDZONO JEDEN PRZYKŁADOWO (mod-KK-art69-84): POTWIERDZONO
  jako FAŁSZYWY POZYTYW (treść pokrywa "art. 80-82" łącznie, po prostu
  nie cytuje pojedynczo "art. 84") — heurystyka działa ZGODNIE z
  udokumentowanym ograniczeniem (wykrywa BRAK cytatu końca zakresu,
  NIE odróżnia "faktycznie brakującej treści" od "treści omówionej w
  innej formie zapisu") — POZOSTAŁE 6 przypadków NIE zweryfikowano
  manualnie w tej sesji, WYMAGAJĄ przeglądu w przyszłości

⭐ WNIOSEK OGÓLNY: ten zestaw testów, w PIERWSZYM pełnym uruchomieniu,
ZNALAZŁ I POZWOLIŁ NAPRAWIĆ DWA prawdziwe, aktywne błędy w systemie
(T2: licznik DR-10; T3: Dz.U. samorządu gminnego) — POTWIERDZAJĄC
wartość praktyczną tego narzędzia, NIE TYLKO jego formalną poprawność
metodologiczną.
```

---

## 10. ⭐⭐⭐ PONOWNY PRZEGLĄD T1 I OCENA POZIOMU PROFESJONALNEGO (dodane 2026-07-21)

> Na wyraźne żądanie użytkownika: "zbadaj działanie T1, czy jeszcze
> jakieś testy w audycie są wymagane, aby [zestaw] miały poziom
> profesjonalny". Poniżej PEŁNA dokumentacja przeglądu — zgodnie z
> zasadą profesjonalnej praktyki QA: UZASADNIONE decyzje o zakresie
> (co dodano, co ŚWIADOMIE odrzucono i DLACZEGO) są RÓWNIE ważne co
# sam kod testów.

### 10.1 Znaleziony i naprawiony błąd w SAMYM T1

```
⭐⭐ T1 (v1.0) używał NAIWNEGO sprawdzenia podciągu (`name in
skill_text`) do ustalenia, czy nazwa modułu jest "wspomniana" w
SKILL.md. TO stwarzało TEORETYCZNE ryzyko FAŁSZYWEGO NEGATYWU: jeśli
nazwa KRÓTSZEGO modułu jest DOSŁOWNYM podciągiem nazwy DŁUŻSZEGO
modułu (np. plik "mod-ustawa-cudzoziemcy.md" ORAZ "mod-ustawa-
cudzoziemcy-zatrudnianie.md" — oba ISTNIEJĄ w systemie), a SKILL.md
wspominałby WYŁĄCZNIE dłuższą nazwę — sprawdzenie podciągu BŁĘDNIE
uznałoby KRÓTSZĄ nazwę za "zarejestrowaną" (bo WYSTĘPUJE jako fragment
tekstu dłuższej), UKRYWAJĄC prawdziwy brak.

SYSTEMATYCZNE przeszukanie CAŁEGO systemu POTWIERDZIŁO, że TAKIE pary
nazw ISTNIEJĄ (2 przypadki: dr-05 mod-ustawa-cudzoziemcy/-zatrudnianie;
dr-09 mod-POS-prawo-ochrony-srodowiska/-szczegoly) — W OBU przypadkach
sprawdzono, że OBIE nazwy SĄ obecnie jawnie, osobno zarejestrowane
(żaden AKTYWNY błąd nie został znaleziony), ALE ryzyko było REALNE.

NAPRAWIONO: zastąpiono sprawdzenie podciągu dopasowaniem regex z
GRANICĄ SŁOWA (uwzględniającą myślnik jako część nazw modułów, nie
tylko standardowe `\b`). PO naprawie: T1 nadal zwraca CZYSTY PASS
(25 pozycji do weryfikacji manualnej, jak poprzednio — BEZ nowych
fałszywych trafień), potwierdzając że naprawa NIE wprowadziła regresji.
```

### 10.2 Zbadany, ale ŚWIADOMIE ODRZUCONY zakres — pełny skaner dangling references

```
⭐⭐⭐ NAJWAŻNIEJSZA decyzja metodologiczna tego przeglądu: zbadano
możliwość zbudowania PEŁNEGO, systemowego testu "T9 szerokiego" —
wykrywającego WSZYSTKIE odwołania do modułów w treści SKILL.md,
sprawdzającego, czy KAŻDE z nich wskazuje na FAKTYCZNIE istniejący
plik GDZIEKOLWIEK w systemie (nie tylko w TYM SAMYM skillu).

WYNIK próbnego uruchomienia: ~50 "podejrzanych" odwołań w kilkunastu
skillach. Manualne sprawdzenie PRÓBKI (6 przypadków) ujawniło, że
WSZYSTKIE 6 to FAŁSZYWE POZYTYWY, należące do CZTERECH odrębnych,
LEGALNYCH wzorców:
  1) Cross-referencje międzyskillowe z jawnym prefiksem "→ dr-XX"
     (np. dr-11 odsyłający do mod-KPP-karta-praw-podstawowych-UE,
     który ISTNIEJE w dr-14)
  2) Odwołania do plików w shared/ (inna struktura katalogów niż
     dr-XX/modules/)
  3) ŚWIADOME placeholdery na przyszłość ("rozważyć mod-X.md jeśli
     pojawią się sprawy") — NIE są to błędy, lecz udokumentowane braki
     CELOWE
  4) Notatki HISTORYCZNE o przeniesieniu do shared/ pod NOWĄ nazwą
     (np. mod-KK-stalking-szczegolowy → shared/STALKING-NEKANIE.md)

⭐⭐⭐ DECYZJA: pełny, szeroki skaner dangling references ODRZUCONO
jako NIEWARTY budowy w OBECNEJ formie — zgodnie z ZASADĄ z badanej
literatury (Virtuoso QA: "fifty stable tests covering workflows that
matter most" lepsze niż "thousand brittle tests nobody maintains") —
odróżnienie WSZYSTKICH czterech legalnych wzorców od PRAWDZIWEJ
regresji wymagałoby na tyle SKOMPLIKOWANEGO parsera (rozpoznawanie
prefiksów "→ dr-XX", przeszukiwanie shared/, rozpoznawanie fraz
"rozważyć"/"w przyszłości", rozpoznawanie fraz historycznych o
przeniesieniu), że RYZYKO fałszywych alarmów PRZEWAŻSZAŁOBY wartość
informacyjną — TAKI test szybko STAŁBY SIĘ ignorowany ("alert
fatigue"), tracąc sens jako narzędzie regresyjne.

ZAMIAST tego, zbudowano T9 — WĄSKI, CELOWANY test wyłącznie dla
KATEGORII 4 (przeniesienia do shared/), NAJBARDZIEJ ryzykownej
kategorii (bo odwołuje się do KONKRETNEJ, WERYFIKOWALNEJ nowej
lokalizacji, w odróżnieniu od kategorii 1-3, które z NATURY wymagają
szerszego kontekstu do poprawnej interpretacji). Pierwsze uruchomienie
T9 na całym systemie: 3 deklaracje znalezione, WSZYSTKIE 3 rozwiązane
(czysty PASS) — potwierdzając, że WĄSKI zakres DAJE praktyczną wartość
bez nadmiernego szumu.
```

### 10.3 Znaleziony i naprawiony brak integracji CI

```
⭐⭐ Przy przeglądzie CAŁEGO zestawu narzędzi (nie tylko T1), odkryto,
że `install_precommit_hook.sh` (istniejący od WCZEŚNIEJSZEJ sesji)
INSTALOWAŁ WYŁĄCZNIE `ci_check_shared.py` (T6/T7) jako git pre-commit
hook — MIMO że PÓŹNIEJ w TEJ SAMEJ sesji dokończono PEŁNY zestaw T1-T8
(`run_regression_suite.py`). Hook NIGDY nie został zaktualizowany, by
wywoływać PEŁNY zestaw — DOKŁADNIE ten sam wzorzec "zbudowano
narzędzie, zapomniano podłączyć", znajdowany WIELOKROTNIE w tej sesji
w innych częściach systemu (moduły niezarejestrowane w SKILL.md, plany
bez zaimplementowanych skryptów, poprawki Dz.U. nieskopiowane między
mapami).

NAPRAWIONO: `install_precommit_hook.sh` (v2.0) instaluje TERAZ
`run_regression_suite.py` zamiast samego `ci_check_shared.py` — hook
blokuje commit PRZY FAIL testów KRYTYCZNYCH (T1/T6/T7), TRAKTUJĄC
testy heurystyczne (T3/T8/T9) i informacyjne (T2) jako OSTRZEŻENIE, nie
blokadę — zgodnie z priorytetyzacją z sekcji 4 tego planu.
```

### 10.4 Ocena ogólna — czy zestaw ma "poziom profesjonalny"?

```
✅ SPEŁNIONE kryteria profesjonalnego zestawu testów regresyjnych (za
   zweryfikowaną literaturą — TestRail, Katalon, Virtuoso QA):
   □ Traceability — każdy test odwołuje się do KONKRETNEGO, udokumen-
     towanego błędu w AUDIT-JOURNAL.md
   □ Priorytetyzacja ryzyko-oparta — KRYTYCZNE blokują, WYSOKIE
     ostrzegają, ŚREDNIE informują
   □ Niezależność testów — każdy skrypt działa SAMODZIELNIE, bez
     zależności od kolejności uruchomienia innych
   □ Walidacja przez rzeczywiste użycie — zestaw ZNALAZŁ i pozwolił
     naprawić DWA prawdziwe błędy systemu PRZY pierwszym uruchomieniu
     (nie tylko potwierdza JUŻ znane naprawy)
   □ Dokumentowane, ŚWIADOME decyzje o zakresie (sekcja 10.2) —
     odróżnienie "nie zbudowano, bo nie zdążono" od "świadomie
     odrzucono jako zbyt hałaśliwe, z uzasadnieniem"
   □ Integracja CI — pre-commit hook wywołuje PEŁNY zestaw (PO
     naprawie z sekcji 10.3)
   □ Utrzymanie kodu testowego — SAME skrypty testowe podlegają TEJ
     SAMEJ dyscyplinie co reszta systemu (naprawiono błąd w T1,
     zweryfikowano PO naprawie)

⚠️ ŚWIADOMIE POZOSTAJĄCE OGRANICZENIA (udokumentowane, NIE ukryte):
   □ T4 (integralność nagłówków) WYMAGA ręcznego wywołania PRZED i PO
     każdej edycji — NIE jest zautomatyzowany wstecznie w orkiestratorze
   □ T5 (widmowe pokrycie/ghost coverage) NIE MA zautomatyzowanego
     skryptu — z NATURY wymaga osądu semantycznego (czy deklarowana
     treść "✅ OK" ODPOWIADA rzeczywistej zawartości modułu), poza
     zasięgiem prostej analizy tekstowej
   □ T8 ma 7 przypadków WARN nigdy w pełni niesprawdzonych manualnie
     (tylko 1 z 7 zweryfikowany jako fałszywy pozytyw)
   □ Merytoryczna POPRAWNOŚĆ treści prawnej POZOSTAJE poza zakresem
     (wymaga eksperckiej weryfikacji prawniczej, nie automatycznej)

⭐ WNIOSEK: zestaw OSIĄGNĄŁ poziom profesjonalny WEDŁUG zweryfikowanych
kryteriów branżowych, z UCZCIWIE udokumentowanymi, ŚWIADOMYMI granicami
zakresu — NIE przez brak wiedzy o możliwych rozszerzeniach, lecz przez
UZASADnioną decyzję, że DALSZE rozszerzenia (pełny skaner dangling
references) obniżyłyby JAKOŚĆ praktyczną (przez nadmierny szum) mimo
pozornie WIĘKSZEGO pokrycia.
```

---

## 11. T19 — F-108: integralność benchmarku i metryk bieżących (2026-08-28)

**Źródło błędu rzeczywistego:** ponowny audyt F-108 wykazał, że rejestr 52 aktów
mieszał obecność modułu z COV oraz że aktywne indeksy mogły zachować stare lub
błędnie przypisane metryki Dz.U. mimo poprawnej mapy dziedzinowej.

**Skrypt:** `scripts/test_f108_consistency.py` — test KRYTYCZNY, bez sieci.

Sprawdza mechanicznie:
- dokładnie 52 identyfikatory F-108;
- dokładnie cztery pozycje poniżej COV: 7, 29, 30, 40;
- deklarację 52/52 routing i 48/52 COV;
- brak znanych regresji KC 2025/1071 i Prawa o prokuraturze 2024/390 w aktywnym `ROUTING-MAP.md`;
- obecność skorygowanych wierszy w aktualnej `mapa_dzu_2026-08-28.md`;
- zakaz powrotu błędnych tożsamości 2025/1338, 2023/549, 2024/1069 i 2026/346.

**Kryterium:** każdy FAIL T19 blokuje wynik strukturalny suite. Test nie zastępuje
żywej kontroli ELI/ISAP; chroni wyłącznie ustalenia już zweryfikowane źródłowo.


## LITERATURA (zweryfikowana online 2026-07-21)

- testrail.com/blog/regression-testing — definicja regresji, priorytetyzacja
  wg "high-impact flows", automatyzacja stabilnych testów.
- browserstack.com/guide/regression-test-plan — struktura planu (core
  suite, priorytetyzacja, integracja z CI).
- go.insurity.com (ITS Regression Test Planning White Paper) —
  definicje formalne (Regression, Test Plan, Test Suite), struktura wg
  obszaru pokrycia, kryteria wyjścia.
- testdevlab.com (2×) — cykl utrzymania (review/update/remove),
  podejście mieszane automatyczne/manualne, dokumentacja.
- qualitylogic.com — zarządzanie: planowanie, koordynacja, automatyzacja.
- testomat.io — struktura test case (cel, kroki, oczekiwany wynik).

---

## CHANGELOG

**1.2 (2026-07-21):** PONOWNY PRZEGLĄD T1 na wyraźne żądanie użytkownika
("zbadaj działanie T1, czy jeszcze jakieś testy są wymagane, aby mieć
poziom profesjonalny"). NAPRAWIONO: ryzyko fałszywego negatywu w T1
(sprawdzenie podciągu → dopasowanie z granicą słowa). ZBADANO i
ŚWIADOMIE ODRZUCONO: pełny, szeroki skaner dangling references (zbyt
duży szum — patrz sekcja 10.2). ZBUDOWANO: T9 (wąski, celowany test
weryfikacji przeniesień do shared/) jako PROPORCJONALNA alternatywa.
NAPRAWIONO: install_precommit_hook.sh (v1.0→v2.0) instalował WYŁĄCZNIE
stary ci_check_shared.py zamiast pełnego run_regression_suite.py — ten
sam wzorzec "zbudowano, zapomniano podłączyć" jak wielokrotnie w tej
sesji. Dodano sekcję 10 z PEŁNĄ dokumentacją przeglądu i formalną oceną
kryteriów profesjonalnego zestawu testów wg zweryfikowanej literatury.

**1.1 (2026-07-21):** DOKOŃCZONO implementację — plan ISTNIAŁ już
(wersja 1.0), ale TYLKO JEDEN z pięciu odwołanych skryptów faktycznie
istniał (test_module_registration.py), a SAM plan NIE BYŁ zarejestrowany
w SKILL.md audyt-systemu-v4 — dokładnie ten sam wzorzec "opisane, nie
zaimplementowane", znajdowany wielokrotnie w tej sesji w innych
skillach. ZBUDOWANO: test_module_count.py (T2), test_cross_map_dzu.py
(T3), test_header_snapshot.py (T4), test_title_scope_match.py (T8),
run_regression_suite.py (orkiestrator). WYKONANO pełne uruchomienie —
patrz sekcja 9 — ZNALEZIONO i NAPRAWIONO DWA prawdziwe, aktywne błędy
systemu (licznik modułów DR-10, Dz.U. samorządu gminnego w DR-08) oraz
NAPRAWIONO DWA błędy w SAMYCH skryptach testowych (fałszywe pozytywy
w T2 i T3, wykryte przy pierwszym uruchomieniu i skorygowane przed
uznaniem zestawu za gotowy). Zarejestrowano plan i skrypty w SKILL.md.

**1.0 (2026-07-21):** Utworzenie planu na wyraźne żądanie użytkownika
("zestaw testów regresyjnych, profesjonalnie, w oparciu o literaturę
ekspercką online"). Zaadaptowano standardową metodologię testów
regresyjnych (zweryfikowaną online: TestRail, BrowserStack, Insurity,
TestDevLab, QualityLogic) do specyfiki systemu markdown-jako-baza-wiedzy.
KLUCZOWA decyzja metodologiczna: KAŻDA kategoria testu (T1-T8) odpowiada
KONKRETNEMU, udokumentowanemu w AUDIT-JOURNAL.md błędowi znalezionemu
i naprawionemu w TEJ sesji — zgodnie z fundamentalną zasadą testów
regresyjnych (ponowne wykonanie testów dla PRZESZŁYCH, znanych
problemów), NIE są to testy hipotetyczne/spekulatywne.

---

## 11. T11 — SYNCHRONIZACJA AKTÓW MIĘDZY REJESTRAMI (dodane 2026-08-15z, flaga F-89)

**Skrypt:** `scripts/check_sync_aktow.py` | **Priorytet:** ⭐⭐ WYSOKI |
**Charakter:** heurystyka tekstowa → WARN (nie bramka, nie rozstrzyga automatycznie)

**Błąd przeszły, przed którym chroni** (zgodnie z zasadą: każdy test odpowiada
udokumentowanemu incydentowi, nie hipotezie) — CZTERY udokumentowane przypadki:
1. 2026-08-13 — cztery podatki sektorowe opisane w dr-06, nieobecne w mapie
   centralnej i ROUTING-MAP.
2. 2026-08-14 — 12 nowych modułów zarejestrowanych lokalnie, nieobecnych
   w ROUTING-MAP (przyczyna powstania REGUŁY 3 w HARDGATE-AUDYT).
3. 2026-08-15y — ustawa o systemach AI (Dz.U. 2026 poz. 1003) znana w dr-11
   od 14.08, nieobecna w mapie centralnej.
4. 2026-08-15z — poz. 1004, 825 i 846 wpisane do mapy Dz.U. i modułów, ale
   nie do ROUTING-MAP (REGUŁA 3 pominięta przez samego wykonawcę audytu).

**Luka, którą wypełnia:** `test_cross_map_dzu.py` (T3) porównuje NUMER tego
samego aktu w dwóch mapach — wykrywa ROZBIEŻNOŚĆ, ale nie BRAK.
`check_rejestracja_modulow.py` sprawdza rejestrację MODUŁÓW, nie AKTÓW.
Żaden test nie wykrywał aktu obecnego w jednym rejestrze, a nieobecnego
w drugim — najczęstszego realnego defektu synchronizacji w tym systemie.

**Trzy kierunki kontroli:** lokalne `MAPA-AKTOW.md` → ROUTING-MAP (REGUŁA 3);
lokalne → mapa Dz.U.; ROUTING-MAP → mapa Dz.U.

**Kryterium wyjścia — ŚWIADOMIE NIE „zero":** rejestry mają różne
przeznaczenie (mapa Dz.U. to katalog wszystkich aktów, ROUTING-MAP zawiera
to, co ma routing do modułu), więc akt skatalogowany bez modułu MOŻE legalnie
nie mieć wiersza w ROUTING-MAP. Kryterium: **zero pozycji z ostatnich
12 miesięcy bez rozstrzygnięcia** (dopisane albo udokumentowane jako świadomy
brak). Docelowo — lista wyjątków w skrypcie, żeby test mógł stać się bramką.

**Stan zastany przy wprowadzeniu (2026-08-15z):** 72 / 80 / 53 pozycji
w trzech kierunkach → flaga F-89.

---

### 11a. POPRAWKA CZUŁOŚCI 2026-08-22 (F-106) — redukcja fałszywych trafień 29 → 19

Pierwszy pełny przegląd wyniku T11 (29 pozycji, kierunek `lokalne`) ujawnił
**dwa źródła szumu, oba po stronie testu, nie systemu**:

1. **Forma skrócona numeru bez prefiksu aktu.** `RE_POZ` wymaga prefiksu
   „Dz.U." przed numerem. Tymczasem ROUTING-MAP zapisuje nowelizacje
   skrótowo w komentarzu wiersza aktu bazowego — „zm.: 2025.1705",
   „+2026.176", „(zm. 2025.1863)". Osiem pozycji było raportowanych jako
   brakujące, choć numer w pliku JEST (2025.1705, 2025.1366, 2024.80,
   2023.1082, 2021.2490 i dalsze).
2. **Artefakt „poz. 0"** — numer nieistniejący w Dz.U., produkt rozbioru
   uciętych zapisów.

**Rozwiązanie:** dodany `RE_POZ_LUZNA` (numer w formie `RRRR.NNN` bez
prefiksu) zbierany WYŁĄCZNIE dla ROUTING-MAP i używany tylko do
**demotowania** trafienia z „brak" na „obecny w formie skróconej" —
nigdy do zgłaszania nowych braków. Uzasadnienie asymetrii: wzorzec bez
prefiksu jest podatny na przypadkowe dopasowania (daty, numery stron),
więc dopuszczamy go jedynie tam, gdzie kierunek błędu to MNIEJ alarmów,
nie więcej. Artefakt „poz. 0" odsiewany funkcją `artefakt()`.

**Przełącznik `--bez-filtra`** przywraca listę surową (stan sprzed
poprawki) — do kontroli, czy filtr nie ukrywa czegoś istotnego.

⚠️ **Czego poprawka NIE usuwa:** trafień typu „numer nowelizacji
wymieniony jako »ze zm.« w wierszu aktu bazowego, którego w ROUTING-MAP
w ogóle nie ma w żadnej formie". To nadal wymaga oceny człowieka — i
słusznie, bo część takich pozycji to realne braki wiersza.

**Skuteczność poprawki potwierdzona empirycznie:** ten sam przebieg,
29 → 19 pozycji, przy zachowaniu OBU realnych rozjazdów wykrytych w
sesji 2026-08-22 (Prawo oświatowe 2026.820, ZTP 2026.300) — filtr nie
ukrył żadnego prawdziwego błędu.

---

## 12. T12 — ZGODNOŚĆ METADANYCH WERSJI SKILLA (dodane 2026-08-20z, flaga F-101)

**Skrypt:** `scripts/check_wersje_changelog.py` | **Priorytet:** ⭐ ŚREDNI |
**Charakter:** kontrola tekstowa → WARN (nie bramka; wynik wymaga przeglądu)

**Błąd przeszły, przed którym chroni** (zasada: test odpowiada udokumentowanemu
incydentowi, nie hipotezie) — TRZY przypadki wykryte w JEDNEJ sesji, w trzech
skillach z trzech różnych rodzin, co przesądziło o powstaniu testu:
1. `przesluchanie-swiadkow-v2-min90` — `version: 3.22`, changelog kończy się na
   3.19; zmiany 3.20-3.22 nie są opisane NIGDZIE i nie da się ich odtworzyć.
2. `analizator-dowodow-v3` — `version: 5.16.1`, pole `changelog:` deklaruje
   5.15.0, nagłówek H1 podaje „v5.1": trzy różne numery w jednym pliku.
3. `audyt-systemu-v4` — stopka „Wersja: 5.0" przy `version: 6.8` (rozjazd
   dziewięciu wersji i półtora miesiąca), wykryta 2026-08-20y.

**Luka, którą wypełnia:** żaden wcześniejszy test nie patrzył na metadane wersji.
T1-T4 i T8 kontrolują treść i strukturę, T9 przeniesienia do `shared/`,
T11 synchronizację aktów. Rozjazd numeru wersji nie blokuje działania skilla —
i dlatego przeżywał audyty — ale uniemożliwia odpowiedź na pytanie „co się
zmieniło od kiedy", czyli podstawową operację audytową.

**Cztery kontrolowane nośniki numeru:** pole `version:` w YAML (źródło prawdy),
najwyższy wpis w `references/CHANGELOG.md`, numer w polu `changelog:` YAML,
numer w nagłówku H1 i stopce SKILL.md.

**Pułapka float — osobna klasa wykrywana przy okazji.** Niecytowane
`version: 6.10` YAML parsuje jako **float 6.1**, czyli numer NIŻSZY niż 6.9.
Problem nie istnieje przy jednocyfrowym minor, więc pojawia się dopiero przy
przejściu X.9 → X.10 i jest niewidoczny w treści pliku. Wykryty 2026-08-20z
przypadkiem, przy kontroli parsowalności frontmatterów — pierwszy przebieg
testu znalazł go w 8 skillach systemu. Klasyfikowany jako **⚠️ ryzyko utajone**,
nie ⛔ czynny błąd: sam plik działa poprawnie, dopóki nikt nie porównuje wersji
liczbowo.

**Wynik pierwszego przebiegu (2026-08-20z, `/mnt/skills/user`):** 26 rozbieżności
w 24 skillach — 5 czynnych rozjazdów ⛔, 21 ryzyk utajonych ⚠️. Szczegóły
i lista skilli: flaga **F-102** w `WARN-OTWARTE.md`.

**Kryterium wyjścia — ŚWIADOMIE NIE „zero":** luki historii w skillach, których
przeszłych wersji nie da się odtworzyć (3.20-3.22, 5.16.0-5.16.1), zostają
jako udokumentowane, a nie usuwane przez zmyślenie wpisów. Kryterium:
**zero ⛔ czynnych rozjazdów poza pozycjami jawnie oznaczonymi jako
„LUKA JAWNA" w changelogu danego skilla.**

**Znane ograniczenia (z docstringu skryptu):** parser rozpoznaje trzy formaty
numeracji wpisów (`**6.9 (data)**`, `- 5.15.0 (data)`, `## v3.15`); skill
o formacie nietypowym zgłosi brak changelogu zamiast realnej niezgodności.
Brak `references/CHANGELOG.md` NIE jest błędem — wiele skilli trzyma historię
wyłącznie w polu YAML. ⚠️ Pierwsza wersja testu przeszukiwała cały plik i dawała
7 fałszywych trafień z wpisów changelogu cytujących wersje INNYCH plików
(np. `shared/SKILL.md` wpis 3.15 cytujący „Wersja: 1.1.0" pliku
MOD-DOKUMENT-ANOMALIE) — naprawione tego samego dnia przez ograniczenie
wyszukiwania do korpusu pliku, poza frontmatterem.

### 12b — ROZSZERZENIE T12 O STANDARD LOKALIZACJI (2026-08-20z4, ZASADA 15)

Test kontroluje dodatkowo, GDZIE mieszka historia zmian:
- sekcja `## CHANGELOG` w korpusie SKILL.md zawierająca wpisy wersji → **⛔**
  (samo odesłanie do pliku jest dozwolone i nie jest zgłaszane),
- pole `changelog:` w YAML dłuższe niż 15 linii → **⚠️** (to już nie skrót,
  tylko pełna historia w niewłaściwym miejscu).

**Błąd przeszły, przed którym chroni:** w sesji 2026-08-20z3 sam ten test dał
fałszywy raport o luce siedmiu wersji w `pisma-procesowe-v3`, bo wpisy 5.12-5.15
leżały w SKILL.md, a nie w `references/CHANGELOG.md`. Naprawa parsera usunęła
objaw; ZASADA 15 i ta kontrola usuwają przyczynę.

**Wynik pierwszego przebiegu (2026-08-20z4):** 9 skilli naruszało standard —
7 z sekcją w korpusie (`analizator-przepisow-v2` 83 linie, `prawny-router-v3` 71,
`audyt-systemu-v4` 42, `pisma-proste-v2` 62, `pisma-procesowe-v3` 61, `dr-01` 17,
`orzeczenia-sadowe-v2` 9) i 3 z pełną historią w YAML (`shared` 111 linii,
`prawny-router-v3` 63, `analiza-sadowa-v6` 39). Wszystkie naprawione tego samego
dnia; po naprawie test zwraca zero.

**Kryterium wyjścia:** zero ⛔. Skill bez `references/CHANGELOG.md` jest poprawny
tylko dopóki nie ma historii — przy pierwszym wpisie plik zakłada się od razu.

---

## 13. T13 — PRÓG DŁUGOŚCI MODUŁU (dodane 2026-08-21, obserwacja O-3)

**Skrypt:** `scripts/check_dlugosc_modulow.py`
**Priorytet:** ŚREDNI | **Typ:** pomiar deterministyczny (nie heurystyka)
**Kod wyjścia:** 0 = brak modułów >1000 linii, 1 = naruszenie progu

### Co kontroluje

| Wynik | Warunek | Znaczenie |
|---|---|---|
| ⛔ CRIT | `modules/mod-*.md` > **1000** linii | ZASADA 13 naruszona — podział wymagany |
| ⚠️ WARN | strefa **800-1000** linii | kolejna transza przekroczy próg; dziel PRZY OKAZJI najbliższej edycji, nie hurtem |
| ℹ️ INFO | `SKILL.md` > 1000 linii | osobna kategoria wg F-78 — DO ROZSTRZYGNIĘCIA przez użytkownika, NIE wpływa na kod wyjścia |

**Wyłączenia świadome:** `AUDIT-JOURNAL.md` (dziennik append-only, wyłączony
TRWALE — podział zerwałby chronologię i odesłania `AUDYT-YYYY-MM-DD`),
`mapa_dzu_*.md` (rejestry historyczne, ta sama logika).

### Dlaczego powstał

Do 2026-08-21 system miał **dwanaście** testów regresyjnych — na rejestrację
modułów, liczniki, spójność Dz.U., nagłówki, zakres tytułów, przeniesienia do
`shared/`, synchronizację aktów i metadane wersji — i **ani jednego na długość**,
mimo że ZASADA 13 jest regułą twardą z progiem liczbowym, czyli najłatwiejszą
do zautomatyzowania ze wszystkich. Skutek: naruszenie w
`dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KC-spadki.md` (1036 linii) przetrwało od momentu
przekroczenia progu do ręcznego skanu ad hoc, a zamknięcie flagi F-78 musiało
kończyć się rekomendacją *„świeży skan `wc -l` przy następnym audycie"* —
czyli przerzuceniem kontroli na pamięć audytora. To ta sama klasa problemu co
F-80 (rejestr nie nadążał za dyskiem), tylko dotycząca rozmiaru, nie istnienia.

### Wynik pierwszego przebiegu (2026-08-21)

Na stanie sprzed napraw: **1 ⛔** (`mod-KC-spadki` 1036) i **6 ⚠️** (strefa
800-1000: `mod-ustawa-bezpieczenstwo-zywnosci` 925, `mod-PrUpad-upadlosc-
restrukturyzacja` 906, `mod-PrFarm-prawo-farmaceutyczne` 903,
`mod-techniki-mediacyjne-negocjacyjne` 856, `mod-KSH-spolki-handlowe` 850,
`mod-OP-ordynacja-podatkowa` 837). Po podziałach z tej samej sesji (PrUpad
wyprzedzająco, KC-spadki obligatoryjnie): **0 ⛔, 5 ⚠️**, kod wyjścia 0.

### Ograniczenie — świadome

Test mierzy WYŁĄCZNIE liczbę linii. **Nie ocenia, czy w miejscu, w którym
wypadałoby ciąć, przebiega naturalna granica rozdziału** — to zawsze pozostaje
decyzją audytora. Wynik ⛔ znaczy „podział wymagany", nie „podziel w połowie".
Doświadczenie z podziału `mod-KC-spadki` pokazało, dlaczego to rozróżnienie
jest istotne: sekcje modułu były dopisywane w kolejności zgłoszeń, nie
w systematyce Księgi IV KC, więc wierny podział „wg rozdziałów aktu" wymagałby
przestawienia treści — a to naruszyłoby nadrzędny wymóg podziału czysto
strukturalnego. Test tego konfliktu nie wykryje i wykryć nie może.

**Kryterium wyjścia:** zero ⛔. Pozycje ⚠️ nie blokują — są sygnałem
planistycznym na najbliższą edycję danego pliku.

## 14. WYMÓG WOBEC TESTÓW ZEWNĘTRZNYCH — kontrakt statusów (dodano 2026-08-23f, flaga F-116, część 2/3)

⛔ **Ten punkt dotyczy PROMPTÓW TESTOWYCH pisanych przez osoby trzecie
(audyty zewnętrzne, benchmarki, recenzje LM), nie testów T1-T13 powyżej.**
Powstał po stwierdzeniu, że trzy niezależne raporty zewnętrzne (TEST1/TEST2/
TEST3, 2026-08-23e) oceniały system wobec etykiety `MEM` i rejestru
`VER/MEM/NIEWERYFIKOWANE`, którego system **nie ma** — `AF-4` w
`shared/PRAWO-HARDGATE.md` v2.6 wprost ZAKAZUJE etykiety `MEM`. Skutek:
poprawne zachowanie systemu (odmowa użycia `MEM`) było punktowane jako
uchybienie, a niedopuszczalne zachowanie portu porównawczego (użycie `MEM`)
jako jego przewaga.

**Reguła:** prompt testowy oceniający zgodność ze statusami weryfikacji
NIE WPROWADZA własnego rejestru etykiet ani nie wymienia z góry kryteriów
oceny w treści polecenia dla modelu. Jedyne poprawne źródło etykiet
dopuszczalnych to sekcja statusów w `shared/PRAWO-HARDGATE.md`
(`✅ [VER]` / `🟨 [KOTWICA-URZĘDOWA]` / `⚠️ [NIEWERYFIKOWANE]` /
`⬛ [DO UZUPEŁNIENIA]`) oraz rozszerzenie poziomu TREŚĆ/FRAGMENT
w `shared/WERYFIKACJA-SLAD.md`. Etykieta spoza tych dwóch plików
(w tym `MEM`, „pamięć normatywna", „wiedza modelu", „stan znany")
użyta w kryteriach oceny czyni **wynik testu wobec tego kryterium
nieważny niezależnie od uzyskanego wyniku PASS/FAIL** — test mierzy
wtedy zgodność z fikcyjną specyfikacją, nie zachowanie systemu.

**Decyzja architektoniczna 2026-08-23f:** rozważano stworzenie osobnego
pliku `shared/KARTA-STATUSOW.md` jako "jednej strony, jedynego źródła
prawdy" łączącej wszystkie rejestry statusów w systemie. **Odrzucono.**
Uzasadnienie w AUDIT-JOURNAL, wpis 2026-08-23f, sekcja 2 — ryzyko
utworzenia TRZECIEGO rejestru obok `PRAWO-HARDGATE.md` i
`WERYFIKACJA-SLAD.md`, przewyższające korzyść z konsolidacji. Zamiast
karty, punkt niniejszy odsyła wprost do dwóch istniejących plików
źródłowych jako jedynego kryterium ważności testu.

---

## 14. T14 — POLE `description:` W SKILL.md (obecność + długość)

**Skrypt:** `scripts/check_description.py`
**Priorytet:** KRYTYCZNY
**Dodany:** 2026-08-24, flaga F-130
**Kod wyjścia:** 0 = czysto, 1 = wykryto ⛔ lub ⚠️

### Co sprawdza
1. obecność frontmattera YAML w `SKILL.md`;
2. **obecność pola `description:`** — brak = ⛔;
3. czy pole nie jest puste — puste = ⛔;
4. długość w profilu uniwersalnym: >200 = ⛔, 181–200 = ⚠️, ≤180 = OK.

### Po co powstał
FAZA 2C mierzyła wyłącznie DŁUGOŚĆ. Jej skrypt dla pliku bez pola `description:`
wypisywał `0` i klasyfikował wynik jako ✅ OK — czyli **stan najgorszy raportował
jako najzdrowszy**. Skutek: `audyt-systemu-v4` był jedynym skillem w systemie bez
tego pola i żadna faza tego nie zgłosiła. Wykryte dopiero, gdy użytkownik przysłał
gotową poprawkę.

`description` jest polem, na podstawie którego skill jest WYBIERANY do wywołania —
jego brak objawia się CISZĄ (skill po prostu nie wystartuje), nie błędem. To
najgorszy możliwy tryb awarii do wykrycia ręcznego, więc jedyną sensowną obroną
jest test.

### Test negatywny (sprawdź przy każdej zmianie skryptu)
Uruchom na katalogu, w którym któryś `SKILL.md` NIE ma pola `description:` —
np. `/mnt/skills/user` w stanie sprzed 2026-08-24. Oczekiwane: dokładnie jedno
⛔ dla `audyt-systemu-v4`. Jeśli skrypt zwraca „✅ czysto" — regresja, ta sama
wada co w pierwotnej FAZIE 2C.

### Znane ograniczenie (jawne)
Mierzy OBECNOŚĆ i DŁUGOŚĆ, nie TRAFNOŚĆ opisu. Description obecny, ale źle
opisujący skill, przejdzie test i nadal będzie powodował złe wyzwalanie —
na to potrzeba testu z F-113, nie tego.

---

## 17. T17 — STATYCZNY KONTRAKT ROUTERA PRAWNEGO

**Skrypt:** `scripts/test_router_contract.py`
**Priorytet:** KRYTYCZNY dla wydania routera
**Dodany:** 2026-08-26
**Kod wyjścia:** 0 = kontrakt kompletny, 1 = regresja, 2 = router nieodnaleziony

### Co sprawdza

1. `description` zaczyna się od imperatywu `UŻYWAJ ZAWSZE`, obejmuje każdą
   jurysdykcję i mieści się w 200 znakach;
2. nagłówek korpusu używa stabilnej wersji major `v3`, a nie martwego numeru
   minor niezależnego od YAML;
3. istnieje PATH-SELFTEST i jawny `TRYB ZDEGRADOWANY`;
4. blok `ŁADOWANE ZAWSZE` poprzedza adapter i wymusza pełny self-check;
5. korpus ma najwyżej 500 linii, nie zawiera narracji incydentów ani
   zduplikowanej Reguły 13;
6. routing [11] wymusza odczyt `AUDYT-KLUCZA-ODPOWIEDZI.md`;
7. protokół klucza wymusza rachunek N/N i zakazuje „pełnej zgodności" przy
   choć jednej pozycji obalonej lub nierozstrzygniętej;
8. ta sama bramka jest obecna w `SELF-CHECK.md`;
9. identyfikatory reguł są kompletne i zachowują pierwotne znaczenie,
   z pominięciem 13 oraz fizyczną kolejnością 22 → 23. Usunięcie, zmiana
   numeru lub przestawienie reguły musi powodować FAIL.

Skrypt rozpoznaje router po polu `name:` w `SKILL.md`, więc działa zarówno
przy katalogach semantycznych, jak i przy identyfikatorach pakietów hosta.

### Ograniczenie

T17 dowodzi obecności i spójności kontraktu statycznego, nie skuteczności
behawioralnej. F-113/F-133 pozostają otwarte do testu A/B z transkryptami.

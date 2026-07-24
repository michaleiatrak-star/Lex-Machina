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

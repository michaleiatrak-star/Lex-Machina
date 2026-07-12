---
name: przesluchanie-swiadkow-v2-min90
version: "3.14"
type: legal-skill
domain: litigation-witness-examination
status: production
default_mode: text
graphic_mode: on_request_only
performance_profile: staged-intake-first
compatibility:
  - Claude Skills
  - Modular Legal Skills
entrypoint: SKILL.md
description: |
  Przesłuchanie świadków v2 — przygotowanie pytań, kontrprzesłuchanie i scoring
  dowodowy w sprawach cywilnych, karnych, pracowniczych i administracyjnych.
  Stosuj gdy użytkownik chce: przygotować pytania do świadka lub biegłego,
  przeprowadzić impeachment, ocenić wiarygodność zeznań, wykryć sprzeczności
  z wcześniejszymi zeznaniami, dobrać model przesłuchania do typu sędziego.
  Pipeline: PRE-W1a SD-VER (skan i weryfikacja kompletności dowodów, HARD GATE)
  → PRE-W1 (profil+mapa wiedzy+preparation chart) → KROK 0 → W1 intake
  → W2 tezy/model → CHECKPOINT-W2 (pauza, uwagi) → W3 pytania (FPW pipeline,
  taksonomia ryzyka 3D, WHY-GATE, SAFE-Q, SYGNAŁY STOP) → W4 próba generalna
  → W5 binder sądowy → W6 słuchanie direct i adaptacja.
  ⛔ HARD GATE: zakaz cytowania przepisów KPC/KPK/KPW i sygnatur z pamięci.
  ⛔ HARD GATE: zakaz wejścia do WITNESS-INTELLIGENCE bez SD-VER = KOMPLET.
  NIE stosuj do analizy dokumentów bez świadka — użyj analizator-dowodow-v3.
dependencies:
  required:
    - shared
    - analizator-dowodow
    - MOD-SKAN-DOWODOW-KOMPLETNY
    - MOD-STEP-TRACKER
  optional:
    - chronologia-sprawy
    - analiza-sadowa
    - raport-sytuacyjny
    - MOD-KONTEKST-SESJI
    - MOD-PRIORYTETY-ASPEKTOW
    - MOD-SELEKCJA-DOWODOW
    - MOD-MAPA-PRZEPISOW
validation:
  required_gates:
    - SD-VER-GATE-WITNESS
    - PRAWO-HARDGATE
    - PRIOR-TESTIMONY-GATE
    - WITNESS-TYPE-GATE
    - INTAKE-COMPLETENESS-GATE
    - QUESTION-ADMISSIBILITY-GATE
    - WITNESS-SCORING
    - WITNESS-INTELLIGENCE
    - FACT-EVIDENCE-MAPPING
    - MODEL-SELECTION-GATE
    - CROSS-EXAMINATION-GATE
    - TEXT-FIRST-UI-GATE
    - HARDGATE-SD-01
    - HARDGATE-SD-02
    - STEP-TRACKER-WITNESS
pipeline:
  stages:
    - PRE-W1a-SD-VER
    - KROK-PRE-W1-INTELLIGENCE
    - KROK-0-KONTEKST
    - W1-INTAKE
    - W1-SUPPLEMENT
    - W2-THESES-AND-MODEL
    - CHECKPOINT-W2
    - W3-QUESTIONS
    - W4-REHEARSAL
    - W5-BINDER
    - W6-LIVE-DIRECT
changelog:
  - "3.14 (2026-07-11, AUDYT SYSTEMU na żywym przypadku — sprawa XI P 27/26,
    świadek Maria Koroleva): (1) naprawiono rozjazd wersji frontmatter
    (błędnie cofnięty do '3.12' mimo że CHANGELOG.md i sekcja changelog
    poniżej wskazywały 3.13 jako najnowszy wpis — ten sam wzorzec błędu co
    poprzednio naprawiany w innych skillach systemu); (2) PRE-W1a.2
    rozszerzony o obowiązkową weryfikację `tesseract --list-langs` i
    instalację `tesseract-ocr-pol` PRZED pierwszym OCR w sesji — wykryto,
    że środowisko wykonawcze nie miało domyślnie zainstalowanego polskiego
    pakietu językowego, co przy braku tego kroku dawałoby fałszywy status
    SD-VER=KOMPLET; dodano też wymóg dzielenia OCR na partie przy dużej
    liczbie stron (>~40), po przerwaniu wywołania z powodu limitu czasu;
    (3) TEZA-DOWODOWA-SCOPE-GATE rozszerzona o wariant TEZA-NIEUSTALONA —
    procedura warstwowego budowania pytań (bezpieczne/średnie/wysokiego
    ryzyka), gdy strona wycofała wniosek o świadka, a mimo to sąd i tak go
    wezwał, bez utrwalonego w materiale uzasadnienia zakresu; (4) dodano
    KROK FPW-1b (ORGAN-COMPETENCY-CHECK) w QUESTION-ADMISSIBILITY-GATE.md
    (v3.3→v3.4): zakaz budowania pytania insynuującego odpowiedzialność
    karną na podstawie wyłącznie jednostronnego, niezweryfikowanego
    twierdzenia strony o postępowaniu przed konkretnym organem, bez
    sprawdzenia, czy ten organ ma w ogóle kompetencję rzeczową do takiej
    sprawy; dodano też obowiązkowy self-check auto-sprzeczności ze
    strategią, gdy pytanie stosuje wobec świadka dokładnie ten mechanizm
    (bezpodstawne oskarżenie o przestępstwo bez dowodu), który klient
    zarzuca stronie przeciwnej. Odkryte podczas przygotowania pytań do
    świadka Maria Koroleva (sygn. XI P 27/26) — pytanie o rzekome
    postępowanie Straży Granicznej o 'fałszywe zeznania' było oparte
    wyłącznie na twierdzeniu powoda i opierało się na organie bez
    kompetencji rzeczowej do takiej sprawy. Pełny opis w AUDIT-JOURNAL.md
    (wpis AUDYT-2026-07-11, sekcja procedural skill audit wg ZASADY 11)."
  - "3.13 (AUDYT SYSTEMU — na wyraźne wskazanie użytkownika po błędach sesji:
    przedwczesne tezy o rzekomo brakującej 'notatce' bez wykonania OCR na
    130 stronach zeskanowanych akt; pomylenie odręcznego dopisku na
    upomnieniu z odrębną notatką służbową; brak wskazania dat poszczególnych
    naruszeń w upomnieniu przeoczony przy pierwszym czytaniu): dodano
    PRE-W1a-SD-VER jako TWARDĄ, BEZPOŚREDNIĄ zależność od
    MOD-SKAN-DOWODOW-KOMPLETNY (wcześniej wpięty tylko pośrednio przez
    analizator-dowodow, więc pomijalny gdy ten skill nie był ładowany).
    HARD GATE: zakaz wejścia do KROK-PRE-W1-INTELLIGENCE / profilu świadka
    dopóki SD-VER ≠ KOMPLET. Dodano jawny wymóg OCR (pdftoppm + tesseract -l pol)
    dla KAŻDEGO pliku PDF bez warstwy tekstowej >0 znaków/stronę, zanim
    przystąpi się do budowy tez lub pytań. Zintegrowano MOD-STEP-TRACKER
    z pipeline'em świadka (rejestr kroków PRE-W1a..W6, status ⚠️ POMINIĘTY
    raportowany natychmiast). Dodano DOCUMENT-REFERENCED-NOT-FOUND-GATE:
    dokument wzmiankowany w zeznaniu/protokole, którego nie ma w przekazanym
    materiale, oznaczany jako ⬛ DO WERYFIKACJI zamiast milcząco pomijany lub
    mylony z innym, fizycznie obecnym dokumentem. Zobacz też changelog
    shared/MOD-SKAN-DOWODOW-KOMPLETNY.md i shared/MOD-STEP-TRACKER.md."
  - "3.12 (KOREKTA NADINTERPRETACJI — na wyraźne wskazanie użytkownika, że
    zeznanie świadka było trafne, a wygenerowana 'teoria o pomyleniu/
    przeformułowaniu' była zbędnym i nietrafnym nadbudowywaniem napięcia
    tam, gdzie go nie było): dodano PLAIN-TESTIMONY-DEFAULT — zasadę
    zabraniającą konstruowania kontrariańskiej reinterpretacji zeznania
    świadka ('świadek się pomylił', 'świadek celowo przeformułował'), gdy
    proste, dosłowne odczytanie tego zeznania jest już zgodne z materiałem
    dowodowym i nie wymaga obalania. Przyczyna: zeznanie świadka Nawrota
    o 'dokumentach wewnętrznych — transakcjach' zostało błędnie
    zinterpretowane jako niezgodne z rzeczywistością (rzekome pomylenie
    kierunku transakcji przez świadka), podczas gdy w rzeczywistości
    zeznanie było trafnym, neutralnym opisem dokumentów faktycznie
    istniejących (rejestr kwot należnych cudzoziemcom) — należało to
    potwierdzić i wykorzystać na korzyść użytkownika, a nie budować wobec
    tego zeznania sztuczną kontrę. Nadinterpretacja jasnego, zgodnego z
    materiałem zeznania jako 'wymagającego obalenia' jest równie
    szkodliwa analitycznie jak przyjmowanie każdego zeznania bezkrytycznie
    — marnuje wysiłek na konstruowanie niepotrzebnej kontrteorii i ryzykuje
    zbudowanie na sali argumentu, który łatwo obalić, wskazując, że
    świadek miał rację od początku."
  - "3.11 (EVIDENCE-THREAD-LINKING — na wyraźne wskazanie użytkownika):
    dodano mechanizm proaktywnego łączenia pozornie osobnych ustaleń
    dowodowych znalezionych w RÓŻNYCH momentach tej samej sesji/sprawy
    w jedną spójną narrację, zamiast traktowania ich jako izolowane
    fakty. Przyczyna: trzy elementy — (a) niejasne zeznanie świadka o
    'dokumentach wewnętrznych/transakcjach', (b) własna wiadomość
    użytkownika do agenta odwołująca się do 'dokumentu z kwotą do
    zwrotu', (c) tabela udokumentowanych zwrotów środków cudzoziemcom —
    zostały znalezione i przeanalizowane osobno, w różnych turach tej
    samej rozmowy, mimo że łączą się w jedną, spójną i korzystną dla
    użytkownika interpretację (rejestr długów spółki wobec cudzoziemców,
    błędnie/celowo przeformułowany jako 'transakcje między pracownikiem
    a spółką'). Mechanizm nakazuje, przy każdym nowym ustaleniu
    dowodowym, świadome przeszukanie PAMIĘCI CAŁEJ ROZMOWY (nie tylko
    aktualnie analizowanego dokumentu) pod kątem wcześniej znalezionych
    faktów, które mogłyby się z nim semantycznie łączyć — nie tylko
    identycznych słów kluczowych (to już robi CROSS-DOCUMENT-CONSISTENCY-
    CHECK), ale też powiązanych tematycznie wątków opisujących to samo
    zjawisko z innej strony."
  - "3.10 (NAPRAWA NA PODSTAWIE ANALIZY PROTOKOŁÓW ROZPRAW — cztery mechanizmy,
    jeden krytyczny dla przesłuchań): (1) TEZA-DOWODOWA-SCOPE-GATE [KRYTYCZNY] —
    przed sfinalizowaniem pytań do świadka w konkretnym postępowaniu, ustal
    z dostępnych protokołów/postanowień sądu, jaka jest ZATWIERDZONA teza
    dowodowa dla tego świadka w TYM postępowaniu; każde przygotowane pytanie
    wykraczające poza tę tezę oznacz jako wysokie ryzyko uchylenia przez sąd,
    NIEZALEŻNIE od jego merytorycznej siły — sąd uchyla pytania spoza tezy
    natychmiast, bez względu na to, jak dobrze skonstruowane; (2)
    PROCEEDING-DISAMBIGUATION-TABLE — analogicznie do ENTITY-DISAMBIGUATION-TABLE,
    prowadzić tabelę równolegle toczących się postępowań (sygnatura, sąd,
    przedmiot, zatwierdzona teza dowodowa, status) i oznaczać, dla którego
    postępowania przygotowywany jest dany zestaw pytań — pytania trafne w
    jednym postępowaniu mogą być całkowicie nieadmisyjne w innym; (3)
    CONTEXTUAL-REBUTTAL-CHECK (rozszerzenie PRZESŁANKI-GATE) — oceniając,
    czy przesłanka zarzutu jest 'niepotwierdzona', przeszukaj WSZYSTKIE
    dostępne dokumenty sprawy (w tym własne pisma procesowe użytkownika i
    transkrypty zeznań innych świadków), nie tylko dokument oskarżycielski,
    zanim oznaczysz przesłankę jako pozbawioną pokrycia dowodowego; (4)
    TRANSCRIPT-MINING-GATE — gdy dostępny jest pełny protokół wcześniejszego
    przesłuchania TEGO SAMEGO świadka, przed przygotowaniem nowych pytań
    wydobądź z niego: już przyznane fakty, sprzeczności oraz uprzednie
    decyzje sądu o uchyleniu pytań (i powody uchylenia) — żeby nie powielać
    pytań już raz uchylonych z tego samego powodu. Przyczyny: analiza
    przesłanki 'czy oferowanie pracy było w zakresie obowiązków' pominęła
    własne pismo procesowe użytkownika oraz transkrypt zeznań Marii Koroleva,
    które wprost tę przesłankę potwierdzały — obie dostępne w tym samym
    archiwum, niesprawdzone przy pierwszej analizie; równolegle odkryto, że
    sąd w postępowaniu VII P 94/25 systematycznie uchylał pytania o
    upomnienie/kary porządkowe jako wykraczające poza tezę dowodową — ryzyko,
    że znaczna część przygotowanego w tej sesji zestawu pytań o upomnienie
    może być nieadmisyjna w konkretnym postępowaniu, nie zostało wcześniej
    zasygnalizowane."
  - "3.9 (ROZSZERZENIE NA WYRAŹNE ŻĄDANIE UŻYTKOWNIKA — pełny, systematyczny
    mechanizm weryfikacji przesłanek zarzutów karnych i dyscyplinarnych):
    LEGAL-ELEMENT-MATCH-CHECK z audytu 3.8 rozbudowany z pojedynczej,
    wyrywkowej obserwacji do PRZESŁANKI-GATE — obowiązkowego, ustrukturyzowanego
    przeglądu KAŻDEJO zarzutu karnego (art. KK) lub podstawy zwolnienia
    dyscyplinarnego/kary porządkowej (art. 52 KP, art. 108-109 KP) pojawiającego
    się w dokumencie skierowanym przeciwko Panu. Mechanizm: (1) zidentyfikuj
    każdą przywołaną podstawę prawną, (2) zweryfikuj JEJ USTAWOWE ZNAMIONA/
    PRZESŁANKI przez ISAP/orzecznictwo (PRAWO-HARDGATE — zakaz z pamięci),
    (3) zestaw każdą przesłankę z tym, co KONKRETNIE opisano w dokumencie na
    jej poparcie, (4) zwróć wynik w formie tabeli: podstawa prawna | wymagana
    przesłanka | co dokument podaje na jej poparcie | ocena (spełniona /
    niespełniona / brak opisu w dokumencie) | uwaga, (5) sformułuj wniosek
    zbiorczy, czy zarzut ma pełne pokrycie w opisanych faktach. Wykonywane
    automatycznie przy PIERWSZEJ analizie takiego dokumentu, jako osobna,
    ustrukturyzowana odpowiedź — nie tylko wplecione pojedynczym zdaniem
    w szerszą analizę."
  - "3.8 (AUDYT JAKOŚCI ANALIZY — ta sama sesja, druga retrospektywa,
    tym razem skupiona na TREŚCI analizy merytorycznej, nie na procesie):
    pięć mechanizmów dodanych: (1) FOUNDATION-VERIFICATION-GATE — przed
    zaproponowaniem teorii kryminalistycznej/stylistycznej/technicznej
    o dokumencie (np. artefakt tłumacza, język interfejsu) należy NAJPIERW
    sprawdzić, czy ten sam wzorzec występuje też w innych dostępnych
    dokumentach oraz czy dokument spełnia strukturalny warunek konieczny
    dla danej metody (np. czy to w ogóle odpowiedź, a nie samodzielna
    wiadomość) — dopiero potem przedstawiać teorię jako obiecującą; (2)
    EXHAUSTIVE-EXTRACTION-GATE — przy przeszukiwaniu archiwum/zbioru
    dokumentów pod kątem 'wszystkich przypadków X', budować pełną listę
    ze WSZYSTKICH trafień, nie tylko pierwszych/najbardziej oczywistych —
    z jawnym policzeniem trafień przed prezentacją wyniku; (3)
    IMMEDIATE-LOGICAL-SCAN — przy pierwszym czytaniu każdego dostarczonego
    dokumentu, proaktywnie skanować pod kątem wewnętrznych sprzeczności
    logicznych/czasowych (np. zachowanie opisane jako 'systematyczne'
    przypisane do jednej daty), zamiast czekać na pytanie naprowadzające
    użytkownika; (4) LEGAL-ELEMENT-MATCH-CHECK — gdy dokument zarzuca
    Panu czyn zabroniony, przy pierwszym czytaniu sprawdzić, czy opisane
    zachowanie faktycznie wypełnia znamiona cytowanego przepisu, nie tylko
    zacytować przepis; (5) ENTITY-DISAMBIGUATION-TABLE — przy występowaniu
    w sprawie więcej niż jednego powiązanego podmiotu prawnego (różne NIP,
    nazwy), prowadzić i proaktywnie aktualizować tabelę przypisania
    dokumentów do podmiotów. Przyczyny: teoria o 'Ogrodzie zoologicznym'
    jako śladzie tłumacza zbudowana przed sprawdzeniem czy błąd występuje
    gdzie indziej (występował, co osłabiło tezę); technika weryfikacji
    języka interfejsu Gmaila zaproponowana dla maila, który nie był
    odpowiedzią (więc technika nie mogła zadziałać) — sprawdzone dopiero
    po pytaniu użytkownika; przeszukanie archiwum ZIP ujawniło tylko 3 z 5
    obecnych w tym samym akapicie przypadków zwrotu środków, resztę
    (Sharma, Amit Shrestha) odkrył dopiero użytkownik dwoma osobnymi
    pytaniami; sprzeczność 'systematyczne/notoryczne w jednym dniu' w
    upomnieniu zauważona dopiero na pytanie użytkownika, mimo że wymagała
    tylko analizy już posiadanego tekstu; błędna kwalifikacja czynu z art.
    191 §1 KK (żądanie zwrotu należności opisane jako groźba bezprawna)
    nie zasygnalizowana od razu przy pierwszej analizie pisma z 7.10.2024."
  - "3.7 (AUDYT RETROSPEKTYWNY — pełna sesja Wiatrak/Human Park Global,
    wieloetapowe przesłuchanie Koroleva/Park, wielokrotne rundy korekty
    pytań): sześć luk zamkniętych na podstawie analizy całej sesji: (1)
    FACT-CROSS-CHECK-GATE — każde pytanie zawierające twierdzenie o treści
    dokumentu ('dokument nie zawiera X') musi być zestawione z faktyczną
    treścią dokumentu dostępną w rozmowie PRZED oceną pytania, nie po
    fakcie na żądanie użytkownika; (2) LEGAL-TIMING-GATE — przed
    zbudowaniem argumentu opartego na ochronie ustawowej (sygnalista,
    terminy KP itp.) należy NAJPIERW ustalić dokładną datę zdarzenia,
    a dopiero potem oceniać zastosowanie przepisu w czasie — nie odwrotnie;
    (3) CROSS-DOCUMENT-CONSISTENCY-CHECK — każdy nowy dokument dowodowy
    wgrany w toku tej samej sprawy jest automatycznie zestawiany z
    wcześniej ustalonymi faktami/datami/kwotami w tej rozmowie, z jawnym
    wskazaniem rozbieżności; (4) QUOTE-VERIFICATION-DEFAULT — każdy cytat
    proponowany do użycia w pytaniu wobec świadka jest weryfikowany
    słowo-w-słowo względem źródła w momencie jego zaproponowania, nie
    dopiero na wyraźne życzenie użytkownika; (5) REVISION-DIFF-CHECK — gdy
    użytkownik przesyła pełną, zaktualizowaną wersję wcześniej ocenianego
    zestawu pytań, ocena zaczyna się od jawnego zestawienia z poprzednio
    zatwierdzoną wersją (co naprawiono / co się cofnęło / co nowe), a nie
    od pełnej ponownej analizy od zera; (6) AUTO-RENUMBER-OFFER — przy
    wykryciu duplikującej się numeracji w zestawie pytań, zamiast samego
    flagowania problemu, oferowane jest natychmiastowe przenumerowanie
    całości na jedną ciągłą sekwencję. Przyczyny: w toku sesji nieścisłe
    twierdzenie o treści dokumentu trafiło do zaakceptowanego pytania i
    zostało wykryte dopiero na żądanie użytkownika; obiecująca teoria
    prawna (ochrona sygnalisty) została zbudowana przed ustaleniem daty,
    co wymagało późniejszego wycofania się; rozbieżność dat (23.08 vs
    23.09 dla tej samej osoby w dwóch dokumentach) została wykryta
    przypadkowo, nie systemowo; cytaty z pism wymagały potwierdzenia na
    wyraźną prośbę użytkownika; te same niedociągnięcia (duplikacja
    numeracji, nieprecyzyjne pytanie o brak dat) powracały nienaprawione
    w kolejnych, w pełni odtwarzanych od zera ocenach."
  - "3.6 (AUDYT NAPRAWCZY — sesja Wiatrak/Human Park Global): cztery luki
    zamknięte na podstawie audytu na żywym przypadku: (1) GATE-DEFAULT-NOW —
    QUESTION-ADMISSIBILITY-GATE i WHY-GATE stosowane OBOWIĄZKOWO przy
    pierwszym wygenerowaniu pytań, nie tylko na żądanie oceny post factum;
    (2) IMPORTED-QUESTIONS-GATE — gdy użytkownik dostarcza gotowy blok pytań
    (nie budowany od zera w W1-W2), wymagana rekonstrukcja tezy jednym zdaniem
    dla KAŻDEGO pytania przed jego zaakceptowaniem lub poprawą; brak dającej
    się zrekonstruować tezy = automatyczny BLOK E; (3) DOCUMENT-SCAN-PROMPT —
    przy każdym nowo wgranym dokumencie z elementami odręcznymi/graficznymi
    obowiązkowe jednozdaniowe zapytanie użytkownika, czy są tam nieoczywiste
    elementy (dopiski, skreślenia, poprawki, nieczytelne fragmenty) do
    zbadania, zamiast czekać na inicjatywę użytkownika; (4)
    TEZY-DOWODY-SWIADEK-GATE — obowiązkowe pytanie (jeśli nie wynika wprost
    z materiałów) o maks. 3 tezy do wykazania, posiadane dowody na ich
    poparcie oraz tożsamość i rolę świadka, zanim rozpocznie się generowanie
    jakichkolwiek pytań. Przyczyna: w sesji audytowej pytania ryzykowne
    (WHY-pytania, założenia nieudowodnionych faktów, prośby o spekulację)
    trafiły do finalnej listy i zostały wykryte dopiero na wyraźne żądanie
    oceny 0-10, kluczowy dowód (odręczne przekreślenie na upomnieniu)
    ujawnił się dopiero po pytaniu użytkownika zamiast w toku systematycznej
    ekstrakcji dokumentu, a tezy/dowody/rola świadka były przyjmowane
    milcząco zamiast jawnie potwierdzane."
  - "3.5: CHECKPOINT-W2 — obowiązkowa pauza po W2 przed generowaniem pytań W3;
    W4 PRÓBA GENERALNA — lista kontrolna przed rozprawą (Wagner 2024);
    W5 BINDER SĄDOWY — instrukcja nawigacji dokumentami na sali;
    W6 SŁUCHANIE DIRECT — etap adaptacji pytań po zeznaniach na wprost
    (Davis/NACDL, Rev 2026, Ohio Bar 2025). Dwie-wiadomości-per-etap jako
    reguła systemowa: ekstrakcja+tezy → CHECKPOINT → pytania."
  - "3.4: Moduł WITNESS-INTELLIGENCE (pre-W1): pełna faza przygotowawcza —
    KROK I profil świadka (dane, relacje, historia procesowa, zachowanie);
    KROK II mapa wiedzy (bezpośrednia/proceduralna/ze słyszenia/wykluczona);
    KROK III ekstrakcja dokumentacyjna (autorstwo/skierowane/CC/cytaty);
    KROK IV preparation chart per temat (fakty+źródło+pytanie+sprzeczności);
    KROK V ocena wstępna zasilająca W1/W2/W3. Integracja: FPW-1 z dok_id+strona.
    Metodyka: Wagner/Taft 2024, Pozner & Dodd 4th ed., Filevine 2024."
  - "3.3: Trzy zamknięte luki vs literatura ekspercka (Pozner & Dodd, Gray's Inn):
    (1) FPW pipeline (FAKT→PRAWO→WNIOSEK) jako obowiązkowa bramka W3;
    (2) Taksonomia ryzyka 3-wymiarowa: RYZYKO-KONTROLA / RYZYKO-ODPOWIEDŹ /
    RYZYKO-KUMULACJA z dedykowanymi procedurami per podtyp;
    (3) Twardy zakaz WHY-QUESTIONS w trybie cross (ONE-FACT/świadek wrogi)
    jako CRIT; reguła SAFE-Q dla pytań bez dowodu kontrolnego;
    reguła KNOW-WHEN-TO-STOP z sygnałami STOP w BLOKU C."
  - "3.2 (ZIP niezaszyty): FPW pipeline — KROK 0 kontekstu poprzedniej sesji;
    FPW-RISK auto-kwalifikator do BLOKU E; zakaz VER bez web_search = CRIT"
  - "3.1: KROK 0 — wczytanie kontekstu sprawy z KROK 4a analizator-dowodow-v3
    lub z pliku kontekstu sesji (MOD-KONTEKST-SESJI §4 TRYB IMPORT); mapowanie
    aspektów głównych/pobocznych → tezy; zatwierdzone dowody → blok B pytań;
    ostrzeżenia krzyżowe (HARDGATE-SD-01/02) → blok E (tematy zakazane z
    uzasadnieniem); wyniki MET-ACH/CA/NET/COMP/FTL → blok D (sprzeczności/
    looping); chronologia wstępna → materiał do loopingu dat"
---

# Przesłuchanie świadków v2-min90

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Skill może zawierać przepisy KPC, KPK, KW, KPA o dopuszczalności dowodów i pytań,
> terminy zawite, podstawy impeachmentu oraz sygnatury orzeczeń o regułach dowodowych.
> Przed podaniem jakiegokolwiek przepisu, artykułu lub sygnatury:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

## Cel

Moduł służy do przygotowania przesłuchania świadków, kontrprzesłuchania, oceny wartości
dowodowej zeznań oraz doboru strategii do typu świadka, modelu przesłuchania i typu sędziego.

Działa w **trzech etapach sekwencyjnych** (W1 → W2 → W3).
Nie generuje pytań bez przejścia przez wszystkie etapy.

---

## Zasada nadrzędna

Domyślnym trybem jest **szybki tryb tekstowy**.
Tryb graficzny wolno uruchomić wyłącznie na wyraźne żądanie użytkownika
(triggery: „pokaż graficznie", „dashboard", „diagram", „panel JSX", „wizualizacja").

---

## Kiedy używać

Użyj tego skilla, gdy użytkownik chce:

- przygotować pytania do przesłuchania świadka,
- przygotować kontrprzesłuchanie / impeachment,
- ocenić wiarygodność świadka i scoring dowodowy,
- dobrać model przesłuchania do sytuacji,
- dobrać styl pytań do typu sędziego,
- wykryć sprzeczności z wcześniejszymi zeznaniami,
- zbudować macierz: pytanie → cel → fakt → dowód → ryzyko.

---

## KROK PRE-W1a — SD-VER: WERYFIKACJA KOMPLETNOŚCI SKANOWANIA DOWODÓW (HARD GATE)

> Dodano w audycie 3.13. Przyczyna: w sesji roboczej model zbudował trzy tezy
> i pytania dla świadka wyłącznie na podstawie plików tekstowych i JEDNEGO już
> zrasteryzowanego dokumentu, całkowicie pomijając 130 stron trzech dużych
> zeskanowanych plików akt osobowych — dokładnie ten typ pominięcia, przeciwko
> któremu istnieje `MOD-SKAN-DOWODOW-KOMPLETNY`. Ten skill miał go w
> `dependencies` tylko POŚREDNIO (przez `analizator-dowodow`), więc gdy ten
> drugi skill nie został wczytany, bramka nie zadziałała i nikt tego nie
> zaraportował — dopiero korekta użytkownika to ujawniła.
>
> ⛔ HARD GATE — BEZWZGLĘDNY: nie wolno wejść do KROK-PRE-W1-INTELLIGENCE
> (profil świadka), a tym bardziej do W1/W2/W3, dopóki SD-VER dla WSZYSTKICH
> dokumentów dot. świadka i sprawy nie ma statusu KOMPLET.

```
PRE-W1a.1 — WYWOŁANIE MODUŁU (bezpośrednie, nie przez analizator-dowodow):
  view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
  Wykonaj FAZĘ 0 (SD-GATE-0) → FAZĘ 1 (SD-INW) → FAZĘ 2 (SD-READ) → FAZĘ 3 (SD-VER).

PRE-W1a.2 — WYMÓG OCR JAWNY (bez tego kroku SD-READ jest niekompletny):
  Dla KAŻDEGO pliku PDF w materiale dot. świadka:
    a) sprawdź ekstrakcję tekstu (pdftotext / pdffonts) — czy >0 znaków na stronę?
    b) jeśli TAK dla wszystkich stron → plik tekstowy, kontynuuj normalnie
    c) jeśli NIE (0 znaków na ≥1 stronie) → plik lub strona jest SKANEM →
       0) ⛔ PRZED pierwszym wywołaniem tesseract w tej sesji — sprawdź:
          `tesseract --list-langs` → czy `pol` jest na liście?
          NIE → `apt-get install -y tesseract-ocr-pol` (lub równoważne dla
          środowiska) PRZED jakimkolwiek wywołaniem OCR. Uruchomienie
          `tesseract -l pol` bez zainstalowanego pakietu językowego kończy
          się błędem/wynikiem bezużytecznym — SD-VER=KOMPLET oznaczony w
          takiej sytuacji byłby FAŁSZYWY. Ten pod-krok jest częścią
          definicji "wykonano OCR", nie czynnością opcjonalną.
       OBOWIĄZKOWO: pdftoppm -jpeg -r 120 -f [n] -l [n] plik.pdf /tmp/strona
                    → tesseract -l pol /tmp/strona.jpg stdout
                    (lub view rastra, jeśli tesseract niedostępny nawet po
                    próbie instalacji — odnotuj to jawnie jako ograniczenie,
                    nie jako "OCR wykonano")
    d) ⛔ ZAKAZ pominięcia strony/pliku z powodu "prawdopodobnie mało istotny"
       lub "duży plik" — rozmiar/liczba stron NIE zwalnia z odczytu. Przy
       dużej liczbie stron (>~40) dziel wywołania OCR na partie (batch), aby
       uniknąć przerwania z powodu limitu czasu pojedynczego wywołania —
       przerwanie w trakcie NIE zwalnia z dokończenia pozostałych stron.
    e) Krok ten jest BEZWARUNKOWY: wykonuje się automatycznie, bez czekania
       na to, aż użytkownik zauważy brak i poprosi o korektę.

PRE-W1a.3 — REJESTR KROKÓW (integracja z MOD-STEP-TRACKER):
  view /mnt/skills/user/shared/MOD-STEP-TRACKER.md (jeśli REJESTR jeszcze
  nie zainicjowany w tej sesji) → ST-INIT z pozycjami dedykowanymi świadkowi:
    "SW-PRE-W1a" (SD-VER świadka), "SW-PRE-W1" (WITNESS-INTELLIGENCE),
    "SW-KROK0" (kontekst), "SW-W1" (intake), "SW-W1-SUPP" (uzupełnienie),
    "SW-W2" (tezy/model), "SW-CP-W2" (checkpoint), "SW-W3" (pytania),
    "SW-W4" (próba generalna), "SW-W5" (binder), "SW-W6" (live/adaptacja).
  Każdy pominięty krok → status "⚠️ POMINIĘTY" + natychmiastowy raport do
  użytkownika (FAZA 2 MOD-STEP-TRACKER), nie odłożony do końca pracy.

PRE-W1a.4 — DOCUMENT-REFERENCED-NOT-FOUND-GATE:
  Gdy w zeznaniu, protokole lub piśmie strony pada odniesienie do KONKRETNEGO
  dokumentu (np. "notatka dołączona do akt", "kopia upomnienia", "załącznik nr X")
  — sprawdź, czy ten dokument FIZYCZNIE istnieje w przekazanym materiale (SD-REJ).
    ✅ ZNALEZIONY → połącz z właściwym D[id], kontynuuj normalnie.
    ⬛ DO WERYFIKACJI → dokument wzmiankowany, ale nieobecny w SD-REJ:
       - oznacz jawnie jako osobną pozycję "⬛ DO WERYFIKACJI — [opis dokumentu],
         wzmiankowany w [źródło], nieodnaleziony w przekazanym materiale",
       - ⛔ ZAKAZ milczącego pominięcia,
       - ⛔ ZAKAZ utożsamienia go "na wyczucie" z innym, fizycznie obecnym
         dokumentem o zbliżonej funkcji (np. odręczny dopisek na innym piśmie
         ≠ odrębna notatka służbowa, nawet jeśli oba dotyczą tego samego
         zdarzenia — to różne dokumenty, dopóki nie ma dowodu przeciwnego),
       - zapytaj użytkownika, gdzie (który protokół/minuta/inne postępowanie)
         można znaleźć ten dokument, zamiast budować tezę na przypuszczeniu.

PRE-W1a.5 — RAPORT SD-VER PRZED PIERWSZĄ ODPOWIEDZIĄ MERYTORYCZNĄ:
  Zanim padnie profil świadka, teza lub pytanie — wyświetl raport z FAZY 3
  MOD-SKAN-DOWODOW-KOMPLETNY (format CHECKPOINT SD-VER: N plików / M stron /
  K obrazów, status KOMPLET/BRAKI, lista D[id], pozycje ⬛ DO WERYFIKACJI z
  PRE-W1a.4) oraz stan REJESTRU KROKÓW z PRE-W1a.3.
  ⛔ KOMPLET → kontynuuj do KROK PRE-W1.
  ⚠️/⛔ BRAKI → wróć do SD-READ, nie przechodź dalej bez zamknięcia braków
  lub jawnej, świadomej decyzji użytkownika o kontynuacji mimo braków.
```

---

## KROK PRE-W1 — WITNESS INTELLIGENCE (faza przygotowawcza)

> Cel: zanim rozpoczniesz intake W1, zbuduj pełny profil świadka i mapę źródeł.
> Moduł aktywowany automatycznie gdy dostarczone są dokumenty dotyczące świadka.
> Pełna procedura: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md`

```
AKTYWACJA AUTOMATYCZNA:
  Gdy użytkownik dostarcza akta / protokoły / dokumenty przed W1 intake →
  wykonaj KROK I–V z WITNESS-INTELLIGENCE przed przejściem do KROK 0.

AKTYWACJA NA ŻĄDANIE:
  Frazy: "profil świadka", "mapa źródeł", "preparation chart",
  "co świadek mógł wiedzieć", "co wiemy o świadku z akt"

WYNIK:
  → Podsumowanie KROK V → bezpośrednio zasila pola W1 INTAKE
  → Preparation chart KROK IV → FPW-1 każdego pytania W3 ma dok_id+strona
  → Mapa wiedzy KROK II → BLOK E (tematy zakazane = WIEDZA WYKLUCZONA)
  → Cytaty KROK III-D → BLOK D (sprzeczności z sekwencją 3-pytań)
```

> 🔴 **DOCUMENT-SCAN-PROMPT (dodane w audycie 3.6):**
> Przy KAŻDYM nowo wgranym dokumencie zawierającym elementy odręczne,
> skany, zdjęcia lub podpisy — zanim przejdziesz do ekstrakcji treści
> drukowanej, zadaj jednozdaniowe pytanie (lub, jeśli jakość obrazu na to
> pozwala, od razu spróbuj i zgłoś wynik): czy są tam odręczne dopiski,
> skreślenia, poprawki, parafki lub nieczytelne fragmenty, które warto
> zbadać. Nie czekaj, aż użytkownik sam zauważy i zapyta — to on dostarczył
> dokument, ale to system ma systematycznie sprawdzić, czy dokument kryje
> coś więcej niż tekst główny. Jeśli jakość obrazu nie pozwala na pewny
> odczyt — zgłoś to wprost i nie zgaduj treści z fałszywą pewnością (patrz
> KROK III-D: brak VER = nie twierdź, że fakt jest ustalony).

> 🔴 **FOUNDATION-VERIFICATION-GATE (dodane w audycie 3.8):**
> Przed zaproponowaniem teorii kryminalistycznej, stylistycznej lub
> technicznej dotyczącej dokumentu (np. artefakt tłumacza maszynowego,
> język interfejsu programu pocztowego, analiza autorstwa) — sprawdź
> DWA warunki, zanim przedstawisz teorię jako obiecującą:
> 1. Czy ten sam wzorzec/artefakt występuje też w INNYCH dostępnych
>    dokumentach z tej sprawy? Jeśli tak — zmienia to wagę dowodową teorii
>    (może ją osłabić: wzorzec powszechny ≠ wzorzec unikalny dla jednej
>    osoby/zdarzenia) i musi być to sprawdzone PRZED zaprezentowaniem,
>    nie po tym, jak nowy dokument przypadkowo to ujawni.
> 2. Czy dokument, do którego ma być zastosowana metoda, SPEŁNIA
>    STRUKTURALNY WARUNEK KONIECZNY tej metody? (np. technika odczytu
>    języka interfejsu z linii cytowania wymaga, żeby dokument BYŁ
>    odpowiedzią na wcześniejszą wiadomość — jeśli to samodzielna,
>    pierwsza wiadomość w wątku, metoda nie ma zastosowania i nie należy
>    jej proponować jako możliwej do wykonania).
> Jeśli nie sprawdzono obu warunków — teorię przedstawia się z jawnym
> zastrzeżeniem "niezweryfikowane" zamiast jako gotowy, mocny wniosek.

> 🔴 **EXHAUSTIVE-EXTRACTION-GATE (dodane w audycie 3.8):**
> Przy przeszukiwaniu archiwum lub zbioru dokumentów pod kątem "wszystkich
> przypadków X" (osób, kwot, dat, zdarzeń określonej kategorii):
> 1. Zbierz i policz WSZYSTKIE trafienia wyszukiwania (grep/keyword search),
>    nie tylko te najbardziej oczywiste lub pierwsze w kolejności.
> 2. Dla każdego akapitu/fragmentu zawierającego trafienie — sprawdź, czy
>    w TYM SAMYM fragmencie występują dodatkowe, powiązane wzmianki
>    (np. lista kilku nazwisk w jednym zdaniu), które łatwo pominąć,
>    skupiając się tylko na pierwszym/najlepiej udokumentowanym przykładzie.
> 3. Przedstaw wynik jako pełną listę z jawnie podaną liczbą znalezionych
>    przypadków, zanim uznasz zadanie za wykonane — nie przedstawiaj
>    częściowego wyniku jako kompletnego.
> Ryzyko zaniechania: użytkownik odkrywa brakujące przypadki dopiero
> własnymi, kolejnymi pytaniami, mimo że dane były dostępne od pierwszego
> przeszukania.

> 🔴 **IMMEDIATE-LOGICAL-SCAN (dodane w audycie 3.8):**
> Przy PIERWSZYM czytaniu każdego dostarczonego dokumentu — niezależnie od
> tego, czy użytkownik o to prosi — proaktywnie skanuj pod kątem
> wewnętrznych sprzeczności logicznych lub czasowych w samej treści
> dokumentu (np. zachowanie opisane słowem sugerującym powtarzalność
> "systematyczne", "notoryczne", "wielokrotne" przypisane do jednej,
> pojedynczej daty; role sprawcy i zgłaszającego zamienione miejscami
> względem opisanych faktów). Takie sprzeczności zgłoś w PIERWSZEJ analizie
> dokumentu, nie dopiero gdy użytkownik zapyta wprost "czy to nie jest
> ogólnikowe" lub podobne pytanie naprowadzające — to nie wymaga żadnego
> dodatkowego materiału, tylko uważnego czytania tego, co już dostępne.

> 🔴 **LEGAL-ELEMENT-MATCH-CHECK → rozbudowany do PRZESŁANKI-GATE (audyt 3.9):**
> Gdy dokument zarzuca Panu popełnienie czynu zabronionego (powołanie na
> przepis Kodeksu karnego) LUB stanowi podstawę zwolnienia dyscyplinarnego
> albo kary porządkowej (art. 52 KP, art. 108-109 KP) — przy PIERWSZYM
> czytaniu tego dokumentu wykonaj pełny, ustrukturyzowany przegląd, nie
> tylko wyrywkową obserwację:
>
> ```
> KROK 1 — Zidentyfikuj każdą przywołaną podstawę prawną osobno
>   (jeśli dokument cytuje kilka artykułów — każdy dostaje osobny wiersz
>   analizy, nie jedną łączną ocenę).
>
> KROK 2 — Zweryfikuj ustawowe znamiona/przesłanki KAŻDEJ podstawy
>   przez ISAP lub zweryfikowane orzecznictwo — zgodnie z PRAWO-HARDGATE,
>   zakaz cytowania znamion z pamięci bez weryfikacji.
>
> KROK 3 — Zestaw KAŻDĄ wymaganą przesłankę z tym, co dokument KONKRETNIE
>   podaje na jej poparcie (nie z tym, co dokument ogólnie twierdzi, tylko
>   z faktycznym opisem zdarzenia/dowodu, jeśli taki występuje).
>
>   🔴 **CONTEXTUAL-REBUTTAL-CHECK (dodane w audycie 3.10):** zanim oznaczysz
>   przesłankę jako 🔴 BRAK z powodu braku poparcia w SAMYM dokumencie
>   oskarżycielskim — przeszukaj WSZYSTKIE inne dokumenty już dostępne w tej
>   sprawie (własne pisma procesowe użytkownika, transkrypty zeznań innych
>   świadków, umowy, zakresy obowiązków, korespondencję), pod kątem materiału
>   POTWIERDZAJĄCEGO lub OBALAJĄCEGO tę konkretną przesłankę. Dokument
>   oskarżycielski rzadko zawiera sam w sobie pełny obraz — kontekst
>   potwierdzający lub obalający przesłankę często znajduje się w innych,
>   już przesłanych materiałach, które trzeba aktywnie przeszukać, a nie
>   czekać, aż użytkownik wskaże je wprost.
>
> KROK 4 — Zwróć wynik w formie tabeli:
>   | Podstawa prawna | Wymagana przesłanka | Co dokument podaje na poparcie | Kontekst z innych dokumentów (CONTEXTUAL-REBUTTAL-CHECK) | Ocena | Uwaga |
>   Ocena: ✅ SPEŁNIONA (opisany fakt realnie wyczerpuje przesłankę) /
>          ⚠️ NIEPEŁNA (opisano coś, ale nie wprost tę przesłankę) /
>          🔴 BRAK (dokument nie podaje nic na poparcie tej przesłanki,
>          lub opisane zachowanie jest przesłance przeciwne — np. dochodzenie
>          własnych praw podane jako "groźba bezprawna") —
>          **i żaden inny dostępny dokument tego nie potwierdza ani nie
>          obala** (dopiero po sprawdzeniu CONTEXTUAL-REBUTTAL-CHECK).
>
> KROK 5 — Sformułuj JEDNOZDANIOWY wniosek zbiorczy dla każdej podstawy
>   prawnej: czy zarzut ma pełne pokrycie w opisanych faktach, częściowe,
>   czy żadne — i czy dokument w ogóle nadaje się jako podstawa
>   ewentualnego zwolnienia dyscyplinarnego / postępowania karnego, czy
>   jest to zarzut czysto deklaratywny bez opisu skonkretyzowanego
>   zdarzenia.
> ```
>
> Ten przegląd jest wykonywany **automatycznie, jako osobna, wyraźnie
> wydzielona część pierwszej odpowiedzi** na taki dokument — nie wplatany
> pojedynczym zdaniem w szerszą analizę, i nie odkładany do momentu, gdy
> użytkownik o to poprosi. Przykład wzorca łatwego do przeoczenia bez tego
> mechanizmu: żądanie zwrotu należnych pieniędzy lub wydania własnych
> dokumentów, opisane jako "szantaż"/"groźba bezprawna" z powołaniem na
> art. 191 KK — zwykłe domaganie się przysługujących praw nie wypełnia
> typowo znamion przemocy lub groźby bezprawnej, co ujawnia się dopiero
> przy systematycznym zestawieniu przesłanki z opisem faktu, nie przy
> samym odnotowaniu, że przepis został przywołany. Drugi przykład: przesłanka
> "działanie bez upoważnienia/poza zakresem obowiązków" oznaczona jako brak
> pokrycia w jednym dokumencie (zakres obowiązków niesprecyzowany), mimo że
> własne pismo procesowe użytkownika ORAZ transkrypt zeznań świadka strony
> przeciwnej — oba już dostępne w aktach — wprost tę przesłankę potwierdzają.

### TRANSCRIPT-MINING-GATE (dodane w audycie 3.10)

> 🔴 Aktywacja: dostępny jest pełny protokół/transkrypt WCZEŚNIEJSZEGO
> przesłuchania TEGO SAMEGO świadka (w tym lub powiązanym postępowaniu).

```
Przed przygotowaniem NOWYCH pytań dla świadka, którego wcześniejsze zeznania
są już dostępne w materiałach — wydobądź systematycznie z transkryptu:

1. Fakty już przyznane przez świadka (nie trzeba o nie pytać ponownie —
   chyba że celem jest technika loopingu/konfrontacji).
2. Sprzeczności między zeznaniami tego świadka a innymi dokumentami/
   zeznaniami (kandydat do BLOKU D).
3. Pytania wcześniej ZADANE i UCHYLONE przez sąd, wraz z PODANYM PRZEZ SĄD
   POWODEM uchylenia (np. "poza tezą dowodową", "hipotetyczne", "dublujące").
   Nowe pytania o tej samej naturze i tym samym ryzyku uchylenia — oznacz
   z ostrzeżeniem, że sąd już raz zastosował to kryterium wobec tego
   świadka/tej sprawy i może zrobić to ponownie.
4. Fakty ustalone przez sąd wprost w protokole (np. potwierdzone przez
   pełnomocnika, niekwestionowane) — takich nie trzeba już ponownie
   dowodzić, tylko rozwijać ich konsekwencje (patrz BLOK 4 w przykładzie
   z tej sesji: fakt wysłania wiadomości "Pracownicy YSP" był już
   niekwestionowany, więc pytania powinny rozszerzać konsekwencje, nie
   ustalać fakt od nowa).
```

---

## KROK 0 — WCZYTAJ KONTEKST SPRAWY (przed W1)

> Cel: zasilić W1 intake danymi z analizatora (KROK 4a) lub z pliku kontekstu
> sesji (MOD-KONTEKST-SESJI TRYB IMPORT), żeby nie zaczynać od zera.
> Jeśli żadne źródło niedostępne → przejdź bezpośrednio do ETAP W1 (KROK 0
> jest OPCJONALNY, nie blokujący).

```
ŹRÓDŁO 1 — BIEŻĄCA SESJA (priorytet):
  Jeśli w tej samej sesji wykonano analizator-dowodow-v3 KROK 4a → pobierz:
    kontekst_sprawy = {
      aspekty_glowne, aspekty_poboczne,   ← MOD-PRIORYTETY-ASPEKTOW
      mapa_przepisow,                       ← MOD-MAPA-PRZEPISOW §4
      selekcja_dowodow,                     ← MOD-SELEKCJA-DOWODOW §5
      ostrzezenia_krzyzowe,                 ← MOD-SELEKCJA-DOWODOW §6
      wyniki_metod,                         ← BLOK E2a-j (streszczenia)
      chronologia_wstepna                   ← chronologia-sprawy-v1 (jeśli)
    }

ŹRÓDŁO 2 — PLIK KONTEKSTU (jeśli IMPORT_AKTYWNY z MOD-KONTEKST-SESJI):
  Jeśli użytkownik wkleił/wgrał plik kontekstu → pobierz z sekcji §2-§6
  tego pliku (już sparsowane w KROK I2 MOD-KONTEKST-SESJI).

ŹRÓDŁO 3 — BRAK KONTEKSTU:
  Jeśli żadne źródło niedostępne → pomiń KROK 0, przejdź do ETAP W1.
  Poinformuj jednym zdaniem: "Nie mam kontekstu z analizatora — zadam
  pytania o sprawę w W1."
```

### CROSS-DOCUMENT-CONSISTENCY-CHECK (dodane w audycie 3.7)

> 🔴 Aktywacja: za każdym razem, gdy w toku **tej samej sprawy** (niekoniecznie
> tej samej wiadomości) zostaje wgrany nowy dokument dowodowy — nie tylko
> przy pierwszym KROK 0.

```
Przy każdym nowym dokumencie dowodowym dotyczącym sprawy już omawianej
w tej rozmowie:

1. Zidentyfikuj fakty w nowym dokumencie, które DUBLUJĄ lub ROZSZERZAJĄ
   fakty już ustalone wcześniej w tej rozmowie (daty, kwoty, nazwiska,
   cytaty przypisywane konkretnym osobom).
2. Zestaw je wprost z wcześniejszymi ustaleniami. Jeśli występuje
   rozbieżność (np. ta sama osoba figuruje z inną datą lub kwotą w dwóch
   różnych dokumentach) — zgłoś to WPROST, zanim jakiekolwiek pytanie
   oparte na tym fakcie zostanie sformułowane lub zaakceptowane.
3. Nie wybieraj milcząco "poprawnej" wersji przy rozbieżności — przedstaw
   obie, ze wskazaniem źródła każdej, i poproś użytkownika o rozstrzygnięcie
   przed użyciem tego faktu w pytaniu do świadka.

Ryzyko zaniechania: rozbieżność wykryta dopiero na sali (przez świadka lub
pełnomocnika przeciwnej strony) niszczy wiarygodność całego pytania, nawet
jeśli istota zarzutu jest słuszna.
```

### ENTITY-DISAMBIGUATION-TABLE (dodane w audycie 3.8)

> 🔴 Aktywacja: w sprawie występuje więcej niż jeden powiązany podmiot
> prawny (różne NIP, różne nazwy firm o podobnym brzmieniu, różne adresy
> e-mail przypisane do tej samej grupy kapitałowej).

```
Prowadź i proaktywnie aktualizuj (bez czekania na prośbę użytkownika)
tabelę przypisania dokumentów i faktów do konkretnych podmiotów, np.:

| Podmiot | NIP | Dokumenty/maile z tego podmiotu | Osoby podpisujące |
|---|---|---|---|
| Human Park sp. z o.o. | [nr] | [lista] | [imiona] |
| Human Park Global sp. z o.o. | [nr] | [lista] | [imiona] |

Aktualizuj tę tabelę przy każdym nowym dokumencie odnoszącym się do
któregokolwiek z podmiotów. Udostępnij ją użytkownikowi, gdy:
- pojawi się pytanie dotyczące tego, który podmiot jest odpowiedzialny
  za dane działanie lub zobowiązanie,
- liczba podmiotów w sprawie przekroczy jeden i nie było jeszcze takiego
  zestawienia,
- użytkownik o to poprosi wprost.

Cel: uniknięcie sytuacji, w której przez wiele wiadomości analizuje się
dokumenty pod kątem treści, nigdy nie zestawiając ich systematycznie
względem tego, który z powiązanych podmiotów faktycznie je wystawił —
co może mieć znaczenie dla ustalenia właściwego pozwanego lub adresata
poszczególnych roszczeń.
```

### EVIDENCE-THREAD-LINKING (dodane w audycie 3.11)

> 🔴 Różnica względem CROSS-DOCUMENT-CONSISTENCY-CHECK: tamten mechanizm
> wykrywa sprzeczności między IDENTYCZNYMI faktami (ta sama osoba, inna
> data). Ten mechanizm wykrywa POWIĄZANIA TEMATYCZNE między pozornie
> różnymi faktami, które opisują to samo zjawisko z innej strony — nawet
> gdy nie dzielą żadnego identycznego słowa kluczowego.

```
Przy każdym nowym ustaleniu dowodowym (nowy dokument, nowa odpowiedź na
przeszukanie, nowy fragment zeznania) — zanim przejdziesz dalej, zapytaj
się aktywnie:

1. Czy to ustalenie opisuje TEN SAM przedmiot/zdarzenie/mechanizm co coś,
   co zostało już ustalone WCZEŚNIEJ w tej samej rozmowie, tylko z innej
   perspektywy lub w innym słownictwie? (Nie szukaj identycznych słów —
   szukaj tego samego zjawiska opisanego inaczej: np. "dokument z kwotą
   do zwrotu" wspomniany w wiadomości WhatsApp i "dokumenty wewnętrzne —
   transakcje" wspomniane w zeznaniu świadka mogą odnosić się do TEGO
   SAMEGO dokumentu, opisanego przez dwie różne osoby z przeciwstawnych
   perspektyw.)
2. Jeśli tak — przedstaw to POŁĄCZENIE wprost, jako spójną narrację,
   zamiast zostawiać oba fakty jako osobne, niepowiązane ustalenia,
   czekając aż użytkownik sam zauważy związek.
3. Zaznacz wyraźnie, czy połączenie jest PEWNE (te same konkretne dane:
   nazwisko + kwota + data) czy PRAWDOPODOBNE/DO POTWIERDZENIA (tematyczne
   podobieństwo bez twardego dowodu tożsamości) — nie przedstawiaj
   hipotezy jako ustalonego faktu.
4. Zaproponuj, jeśli to możliwe, jedno pytanie do świadka, które wprost
   testuje, czy połączenie jest prawdziwe (np. "czy dokument X, o którym
   Pani zeznała, to ten sam dokument, do którego odwoływałem się w
   wiadomości Y").

Ryzyko zaniechania: użytkownik traci mocniejszą, zunifikowaną narrację
dowodową na rzecz kilku osobnych, słabszych faktów, które w istocie
wzajemnie się potwierdzają i wzmacniają, gdyby je połączyć.
```

### PLAIN-TESTIMONY-DEFAULT (dodane w audycie 3.12) — przeciwwaga do FOUNDATION-VERIFICATION-GATE i EVIDENCE-THREAD-LINKING

> 🔴 Ostrzeżenie przed nadużyciem poprzednich mechanizmów: dążenie do
> weryfikacji założeń i łączenia wątków (FOUNDATION-VERIFICATION-GATE,
> EVIDENCE-THREAD-LINKING) NIE oznacza, że KAŻDE zeznanie świadka trzeba
> potraktować jako coś do obalenia lub reinterpretacji. Gdy proste, dosłowne
> odczytanie zeznania jest już zgodne z materiałem dowodowym i NIE jest
> niekorzystne dla użytkownika — przyjmij je wprost i zbuduj na nim, zamiast
> konstruować kontrariańską teorię ("świadek się pomylił", "świadek celowo
> przeformułował", "świadek coś ukrywa"), która nie ma oparcia w żadnej
> sprzeczności czy nieścisłości.

```
Przed zaproponowaniem alternatywnej/kontrariańskiej interpretacji zeznania:

1. Sprawdź: czy PROSTE, dosłowne znaczenie tego zeznania jest sprzeczne
   z materiałem dowodowym, czy z nim zgodne?
   - Jeśli ZGODNE i NIEKORZYSTNE dla użytkownika → to legitymny grunt do
     analizy strategicznej (jak złagodzić/skontrować), ale nie do
     zaprzeczania faktowi, który po prostu jest prawdziwy.
   - Jeśli ZGODNE i KORZYSTNE (lub neutralne) dla użytkownika → PRZYJMIJ
     WPROST jako potwierdzony fakt i buduj na nim dalszą strategię.
     Nie szukaj w nim ukrytego drugiego dna, którego nic nie sugeruje.
   - Jedynie gdy istnieje KONKRETNA, wskazywalna sprzeczność z innym
     dowodem — dopiero wtedy uzasadnione jest budowanie teorii o pomyłce,
     nieścisłości lub celowym zniekształceniu.
2. Nie myl entuzjazmu analitycznego z konfliktem interesu: nie każde
   zeznanie świadka strony przeciwnej jest z definicji wrogie lub
   wymagające obalenia — jeśli jego treść jest prawdziwa i nieszkodliwa,
   powiedz to wprost, zamiast szukać sposobu, by uczynić je spornym.
```

### Mapowanie kontekstu na pola W1

```
PO WCZYTANIU kontekstu — wypełnij wstępnie następujące pola W1 INTAKE:

WARSTWA A (dane wspólne):
  "Okoliczność dowodowa" → z aspekty_glowne: które roszczenie ma świadek
    potwierdzić lub obalić (pytaj użytkownika TYLKO o to, którego aspektu
    dotyczy ten konkretny świadek, nie ekstrahujesz tego automatycznie).
  "Typ postępowania" → z kontekstu §1 STRONY I KONTEKST (jeśli znany).

MATERIAŁ DO W2 (tezy i model przesłuchania):
  Tezy DO WYKAZANIA przez świadka → z aspekty_glowne powiązanych z
    okolicznością dowodową świadka + przepis kandydujący z mapa_przepisow.
  Tezy DO OBALENIA (kontrprzesłuchanie) → z aspekty_glowne strony przeciwnej
    (jeśli dostępne) lub z wyniki_metod MET-ACH (hipotezy najsłabsze).

MATERIAŁ DO W3 (pytania):
  Blok B (pytania potwierdzające) → zatwierdzone dowody z selekcja_dowodow
    powiązane z okolicznością dowodową świadka.
  Blok D (pytania na sprzeczności / looping) → per metoda:
    MET-ACH  → pytania eliminujące hipotezy konkurencyjne
    MET-CA   → pytania o zmianę narracji między pismami/oświadczeniami
    MET-NET  → pytania weryfikujące rolę świadka w sieci powiązań
    MET-COMP → pytania o konkretny krok proceduralny (kto/kiedy/forma)
    MET-FTL  → pytania o sekwencję dat i luki logiczne w chronologii
  Blok E (pytania których NIE ZADAWAĆ) → z ostrzezenia_krzyzowe:
    jeśli pytanie o temat X mogłoby zmusić świadka do przyznania faktu
    szkodzącego tezie T_B → BLOK E oznacza to jako "temat zakazany" z
    uzasadnieniem (HARDGATE-SD-02: konkretny fragment i konkretna teza).
  Chronologia → z chronologia_wstepna: zdarzenia do loopingu
    ("zeznał pan X, tymczasem [zdarzenie BEZSPORNE] nastąpiło Y — jak
    to możliwe?").
```

### Informacja zwrotna dla użytkownika (jeśli kontekst wczytany)

```
"Wczytałem kontekst sprawy [nazwa].

Dla tego świadka przygotowuję przesłuchanie w kontekście:
  Roszczenia: [lista aspektów_glowne — 1 linijka per roszczenie]
  Zatwierdzone dowody do potwierdzenia przez świadka: [n]
  Tematy do unikania (ostrzeżenia krzyżowe): [n] 🔴 [jeśli >0]
  Materiał do sprzeczności z metod: [lista MET-XXX których wyniki są dostępne]

Jedno pytanie: KTÓREGO roszczenia dotyczy ten świadek — lub czy ma
świadczyć o całości?"
```

Odpowiedź → przypisz świadka do konkretnego aspektu_glowne (lub "całość")
→ kontynuuj do ETAP W1 z wstępnie wypełnionymi polami.

---

## ETAP W1 — INTAKE

### Cel etapu

Zebranie danych wejściowych o świadku z dwóch źródeł:
1. **Materiały dostarczone przez użytkownika** (akta, protokół, zeznania, dokumenty) — dane ekstrahujesz samodzielnie.
2. **Pytania do użytkownika** — tylko dla danych krytycznych, których nie możesz uzyskać z materiałów.

### Zasada ekstrakcji

> Jeśli użytkownik dostarczył dokumenty, zawsze najpierw czytaj i ekstrahuj z nich dane.
> Pytaj tylko o to, czego dokumenty nie zawierają lub co jest niejednoznaczne.
> Nie pytaj o informacje dostępne w materiale źródłowym.

---

### WARSTWA A — dane wspólne (każdy świadek)

Ekstrahuj z materiałów lub pytaj, jeśli brak:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Imię / inicjały | materiały | „Jak mam oznaczyć świadka?" |
| Strona powołująca | materiały / opis | „Kto powołuje świadka — Państwo czy strona przeciwna?" |
| Typ postępowania | materiały | „Jaki to rodzaj postępowania — cywilne, karne, pracownicze, administracyjne?" |
| Okoliczność dowodowa | opis / teza | „Na jaką konkretną okoliczność jest powoływany świadek?" |
| Typ relacji ze sprawą | materiały | — |
| Wcześniejsze zeznania? | materiały / opis | „Czy świadek składał już zeznania lub deklarację pisemną?" |

---

### TEZY-DOWODY-SWIADEK-GATE (dodane w audycie 3.6) ⚠️ OBOWIĄZKOWA

> Cel: nie budować pytań na milczącym domyśle co do tego, kim jest świadek,
> czego dotyczy jego zeznanie i czym to jest poparte — jeśli te trzy rzeczy
> nie wynikają JEDNOZNACZNIE z dostarczonych materiałów, trzeba o nie zapytać
> wprost, zanim powstanie choćby jedno pytanie.

```
Przed przejściem do W2, sprawdź czy z dostarczonych materiałów wynika
JEDNOZNACZNIE (nie przez domysł czy prawdopodobieństwo) odpowiedź na TRZY
poniższe punkty. Dla każdego punktu, który NIE wynika wprost z dokumentów —
zadaj pytanie użytkownikowi. Nie zgaduj i nie zakładaj milcząco.

1. TEZY DO WYKAZANIA (maks. 3, jednozdaniowe):
   "Jakie są maksymalnie trzy główne tezy/fakty, które to przesłuchanie ma
   wykazać lub obalić?"
   → Jeśli użytkownik już to podał wcześniej w rozmowie lub wynika to
     jasno z kontekstu sprawy (np. z KROK 0) — nie pytaj ponownie, tylko
     potwierdź jednym zdaniem: "Rozumiem, że tezy to: [...] — potwierdza Pan?"

2. POSIADANE DOWODY:
   "Jakimi konkretnie dowodami dysponuje Pan już teraz na poparcie tych
   tez (dokumenty, maile, zeznania innych osób, nagrania, metadane)?"
   → Ekstrahuj samodzielnie z już wgranych dokumentów w tej rozmowie;
     pytaj tylko o dowody, których nie widziałeś, a na które użytkownik
     się powołuje.
   → Brak dowodu kontrolnego dla danej tezy → ta teza NIE otrzymuje
     pytań typu impeachment/pułapka w W3, tylko SAFE-Q lub trafia do
     luk dowodowych w CHECKPOINT-W2.

3. KIM JEST ŚWIADEK I JAKĄ PEŁNI ROLĘ:
   "Kim dokładnie jest ten świadek względem obu stron — jakie stanowisko
   zajmował/zajmuje, czy jest stroną, pracownikiem, osobą postronną, i w
   jakim charakterze ma zeznawać (naoczny, ze słyszenia, biegły)?"
   → Jeśli rola i stanowisko wynikają wprost z dostarczonych dokumentów
     (np. z podpisu na piśmie, z nagłówka maila, z wcześniejszych ustaleń
     w tej samej rozmowie) — NIE pytaj, tylko zrekonstruuj to jednym
     zdaniem i poproś o potwierdzenie zamiast otwartego pytania.

REGUŁA NADRZĘDNA: to nie jest formularz do wypełnienia w każdej sesji od
zera. Jeśli którykolwiek z trzech punktów już padł explicite w tej samej
rozmowie (np. przy okazji wcześniejszego dokumentu) — nie powtarzaj pytania,
tylko przywołaj ustalenie i poproś o samo potwierdzenie ("czy to nadal
aktualne?"). Pytaj tylko o to, czego naprawdę brakuje.
```

---

### PRIOR-TESTIMONY-GATE ⚠️

**Jeśli świadek składał już zeznania (protokół przesłuchania, deklaracja, zeznania w innym postępowaniu):**

```
⚠️ GATE: Świadek z wcześniejszymi zeznaniami.

Wymagam wprowadzenia dokumentu z poprzedniego przesłuchania.
Proszę wgrać protokół / zeznania / deklarację pisemną.

Bez tego dokumentu nie przejdę do W2 — analiza sprzeczności
i technika loopingu wymagają materiału źródłowego.
```

Jeśli użytkownik nie może dostarczyć dokumentu, odnotuj brak i zredukuj zakres W3
(blok D — pytania na sprzeczności — będzie niedostępny; zaznacz to w W2).


Po otrzymaniu dokumentu z zeznaniami: ekstrahuj z niego samodzielnie:
- kluczowe twierdzenia faktyczne,
- daty, miejsca, osoby, sekwencje,
- sformułowania potencjalnie rozbieżne z innymi dowodami,
- wszelkie zastrzeżenia, niepewności, braki odpowiedzi świadka.

---

### WARSTWA B — uzupełnienie zależne od typu świadka

Po identyfikacji typu z materiałów — ekstrahuj z dokumentów, pytaj tylko o luki.

#### TYP 1 — Świadek pracownik / współpracownik

Wymagane dane:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Stanowisko i zakres obowiązków | akta / umowy / dokumenty HR | „Jakie były jego/jej obowiązki w spornym okresie?" |
| Dostęp do spornych dokumentów / decyzji | materiały | „Czy miał bezpośredni dostęp do [dokument / decyzja]?" |
| Czas zatrudnienia / współpracy | akta | — |
| Stosunek do stron po rozstaniu | opis sytuacji | „Czy po zakończeniu zatrudnienia relacje były konfliktem, neutralne, czy pozytywne?" |
| Czy podpisał dokumenty sporne? | materiały | — |

#### TYP 2 — Świadek naoczny / „ze zdarzenia"

Wymagane dane:

| Pole | Źródło | Pytanie jeśli brak |
|---|---|---|
| Pora dnia zdarzenia | protokół / akta | „O której godzinie doszło do zdarzenia?" |
| Warunki oświetlenia | opis / protokół | „Jakie było oświetlenie — dzień, noc, sztuczne światło?" |
| Warunki atmosferyczne | opis / dokumenty | „Jaka była pogoda — mgła, deszcz, śnieg, dobre warunki?" |
| Odległość od zdarzenia | protokół / szkic | „W jakiej odległości od zdarzenia znajdował się świadek?" |
| Kąt i pole widzenia | opis / szkic | „Czy miał bezpośrednią linię wzroku, czy patrzył przez przeszkodę?" |
| Wady wzroku / słuchu | wcześniejsze zeznania | „Czy świadek nosi okulary lub ma inne wady zmysłów istotne dla obserwacji?" |
| Stan psychofizyczny świadka | opis | „Czy świadek był w normalnym stanie — bez wpływu alkoholu, silnych emocji, zmęczenia?" |
| Czas od zdarzenia do pierwszej relacji | protokół / data | — |

#### TYP 3 — Świadek ze słyszenia

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Kto przekazał informację | „Od kogo świadek dowiedział się o zdarzeniu?" |
| Kiedy i w jakich okolicznościach | „Kiedy i gdzie doszło do tego przekazu?" |
| Czy istnieje możliwość weryfikacji pośrednika | „Czy pośrednik jest dostępny jako świadek lub czy istnieje pisemny ślad?" |

#### TYP 4 — Ekspert / biegły

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Metodologia opinii | „Jaką metodologią posłużył się biegły?" |
| Zleceniodawca opinii | „Kto zlecił opinię — sąd, strona, prokuratura?" |
| Wcześniejsze opinie w podobnych sprawach | „Czy biegły wydawał wcześniej opinie w podobnych sprawach?" |
| Ewentualne powiązania ze stronami | „Czy biegły jest powiązany zawodowo lub osobiście z którąś ze stron?" |

#### TYP 5 — Świadek charakteru

Wymagane dane:

| Pole | Pytanie jeśli brak |
|---|---|
| Czas znajomości | „Od jak dawna świadek zna stronę?" |
| Częstotliwość kontaktów | „Jak często się kontaktowali w spornym okresie?" |
| Podstawa oceny charakteru | „Skąd świadek czerpie wiedzę o charakterze / wiarygodności strony?" |

---

### INTAKE-COMPLETENESS-GATE

Po zebraniu danych W1 wykonaj kontrolę:

```
POLA KRYTYCZNE — bez nich NIE przechodzę do W2:
  □ Strona powołująca
  □ Okoliczność dowodowa
  □ Typ świadka
  □ Dane z Warstwy B (min. 3 z 4+ wymaganych dla danego typu)

POLA UZUPEŁNIAJĄCE — brak → zaznacz ⬛ i kontynuuj:
  □ Szczegóły warunków obserwacji (typ 2)
  □ Stosunek do stron (typ 1)
  □ Wcześniejsze opinie (typ 4)
```

Jeśli brakuje pól krytycznych — zadaj 1–3 pytania uzupełniające, jedno na wiadomość.
Jeśli wszystkie pola krytyczne są uzupełnione — przejdź do W2 bez dodatkowych pytań.

---

### IMPORTED-QUESTIONS-GATE (dodane w audycie 3.6)

> Aktywacja: użytkownik dostarcza **gotowy blok pytań** (np. z poprzedniej
> sesji, notatek własnych, projektu innej osoby) zamiast budować pytania
> od zera przez W1→W2→W3.

```
Dla KAŻDEGO dostarczonego pytania, przed jego oceną, poprawą lub włączeniem
do finalnej listy:

1. Zrekonstruuj tezę jednym zdaniem: "To pytanie ma wykazać, że...".
2. Jeśli teza nie daje się zrekonstruować w jednym zdaniu z materiału
   dostarczonego przez użytkownika → pytanie jest strukturalnie podejrzane
   (fishing expedition albo pytanie poboczne) → oznacz do BLOKU E lub zapytaj
   użytkownika o cel.
3. Dopiero po rekonstrukcji tezy zastosuj normalny QUESTION-ADMISSIBILITY-GATE
   (FPW-1/2/3, WHY-GATE, SAFE-Q) do TREŚCI pytania.

Nie wolno oceniać samej poprawności gramatyczno-taktycznej pytania
(otwarte/zamknięte, sugestywne/nie) bez wykonania kroku 1-2 — inaczej pytania
poboczne przechodzą bramkę mimo braku uzasadnienia procesowego.
```

---

### REVISION-DIFF-CHECK (dodane w audycie 3.7)

> Aktywacja: użytkownik przesyła **pełną, zaktualizowaną wersję** zestawu
> pytań, który był już wcześniej w tej rozmowie oceniany lub poprawiany.

```
Zamiast pełnej, od-zera analizy każdego pytania:

1. Zestaw nadesłaną wersję z ostatnią wersją zaakceptowaną/poprawioną przez
   ten skill w tej samej rozmowie.
2. Wskaż jawnie, w trzech kategoriach:
   - NAPRAWIONE: które z wcześniej zgłoszonych problemów zostały usunięte.
   - REGRESJA: które z wcześniej zgłoszonych problemów WRÓCIŁY nienaprawione
     lub w zmodyfikowanej, ale nadal wadliwej formie.
   - NOWE: pytania lub zmiany nieobecne w poprzedniej wersji, wymagające
     pełnej oceny wg standardowych bramek.
3. Priorytet uwagi: REGRESJA > NOWE > przypomnienie NAPRAWIONYCH (te ostatnie
   wystarczy wymienić jednym zdaniem, bez powtarzania pełnego uzasadnienia).

Cel: uniknięcie sytuacji, w której ten sam problem jest wykrywany od nowa
przy każdej kolejnej rundzie, bo ocena zaczyna się od zera zamiast od
różnicy względem stanu poprzedniego.
```

### AUTO-RENUMBER-OFFER (dodane w audycie 3.7)

> Aktywacja: wykryto duplikującą się numerację pytań w obrębie jednego
> zestawu (ten sam numer użyty w dwóch różnych sekcjach/blokach).

```
Nie poprzestawaj na samym zasygnalizowaniu problemu numeracji. Razem z
sygnałem zaproponuj i — jeśli użytkownik nie zastrzeże inaczej — wykonaj
od razu przenumerowanie całego zestawu na jedną, ciągłą sekwencję (1, 2,
3... przez wszystkie bloki), zachowując przypisanie pytań do bloków
tematycznych w treści, ale z unikalnym numerem globalnym dla każdego.
```

## ETAP W2 — TEZY I MODEL

### Cel etapu

Na podstawie danych z W1 (i dokumentów z zeznaniami jeśli dostępne) przygotuj:

> **CLAIM-VALIDATION przed tezami:**
> `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`
> Twierdzenia strony co do okoliczności dowodowych → weryfikuj wobec dostarczonych materiałów.
> Twierdzenie sprzeczne z materiałem → odrzuć; tezę sformułuj zgodnie z tym co wynika z dokumentów.
> Twierdzenie bez oparcia → nie formułuj tezy; zaznacz jako lukę dowodową w pkt 1 poniżej.

> 🔴 **LEGAL-TIMING-GATE (dodane w audycie 3.7):**
> Zanim teza W2 oprze się na ochronie wynikającej z konkretnej ustawy lub
> przepisu, którego zastosowanie zależy od daty (np. ochrona sygnalisty,
> terminy z art. 109/112 KP, przepisy przejściowe) — **najpierw** ustal
> dokładną datę zdarzenia, na którym teza ma się opierać, **a dopiero potem**
> oceniaj, czy przepis mógł mieć zastosowanie w tej dacie. Nie buduj
> rozbudowanej, obiecującej teorii prawnej na dacie przybliżonej lub
> nieustalonej z zamiarem "sprawdzę/skoryguję po fakcie" — to prowadzi do
> kosztownego wycofywania się z argumentu już przedstawionego użytkownikowi
> jako mocny. Jeśli data nie jest znana — zapytaj o nią PRZED sformułowaniem
> tezy opartej na czasowym zakresie ustawy, nie po.

1. **Tezy główne do udowodnienia** (maks. 5, konkretne fakty procesowe powiązane z okolicznością dowodową)
2. **Tezy do obalenia / osłabienia** (jeśli świadek strony przeciwnej)
3. **Kluczowe sprzeczności** (jeśli dostępne wcześniejsze zeznania — maks. 5 rozbieżności z cytatem i komentarzem)
4. **Typ świadka** z klasyfikacją i uzasadnieniem
5. **Scoring wstępny 0–10** (skala: 0–3 słaby, 4–6 umiarkowany, 7–8 istotny, 9–10 kluczowy)
6. **Rekomendacja modelu przesłuchania** (patrz niżej)
7. **Prawdopodobny typ sędziego** lub założenie neutralne

---

### MODEL-SELECTION-GATE — Modele przesłuchania

Dobierz model do sytuacji. Opisz wybór z uzasadnieniem i podaj model alternatywny.

#### MODEL PEACE
*(Preparation → Engage → Account → Closure → Evaluation)*

Kiedy stosować: świadek współpracujący, zeznania narracyjne, sprawy cywilne i pracownicze,
świadek lojalizowany lub neutralny.

Struktura pytań: otwarte → narracyjne → uszczegóławiające → zamknięte kontrolne.
Zasada: nie przerywaj swobodnej narracji, używaj pauz jako narzędzia.

Technika Account: najpierw narracja do przodu → potem narracja od końca lub z innej perspektywy
(kognitywa weryfikacja spójności pamięci).

#### MODEL LEJEK (Funnel)
*(szerokie → wąskie → zamknięte)*

Kiedy stosować: świadek ostrożny, częściowo nielojalny, nie wiadomo czego unikać.

Struktura: pytania ogólne otwierają → każda odpowiedź generuje pytanie bardziej szczegółowe →
na końcu pytania zamknięte blokujące fakt.

Zaleta: świadek sam dostarcza materiału do dalszego zawężania, trudniej ucieka
przed pytaniem które wynika z jego własnej poprzedniej odpowiedzi.

#### MODEL ONE-FACT-PER-QUESTION + LOOPING
*(kontrprzesłuchanie / cross-examination)*

Kiedy stosować: świadek strony przeciwnej, zeznania do podważenia, sprzeczności do ujawnienia.

Zasada: jedno pytanie = jeden fakt. Pytania zamknięte (tak/nie lub konkretna wartość).
Świadek nie ma przestrzeni do wyjaśnień — tylko potwierdza lub przeczy.

Technika loopingu: po uzyskaniu ustępstwa wróć do niego w kolejnym pytaniu jako pewnik:
„A skoro powiedział Pan, że [przyznany fakt], to czy...". Blokuje cofnięcie przyznania,
przypomina sądowi kluczowy punkt.

Wersja triple-loop: to samo ustępstwo wplecione trzy razy w różnych kontekstach.

#### MODEL CHRONOLOGICZNY + PRIMACY/RECENCY

Kiedy stosować: świadek bezpośredni, zdarzenie rozciągnięte w czasie, budowanie narracji
do zamknięcia.

Zasada primacy/recency: najważniejsze fakty na początku i końcu przesłuchania,
fakty potencjalnie szkodliwe w środku bloku.

Przy wątku narracyjnym: pytania w porządku chronologicznym.
Przy wątkach niepowiązanych chronologicznie: porządek według wagi dowodowej.

---

### Scoring W2 (wstępny)

> ⚙️ **Uwaga FPW:** Dla każdej tezy wskaż wstępnie przepis kandydujący ⚠️ [kandydat]
> i oczekiwany wniosek procesowy. Pełna weryfikacja ISAP → W3 FPW-2.

Oceń na skali 0–10 na podstawie:

| Kryterium | Waga |
|---|---|
| Bezpośredniość wiedzy o zdarzeniu | wysoka |
| Interes w wyniku sprawy | wysoka |
| Spójność z dokumentami / innymi dowodami | wysoka |
| Odporność na kontrpytania (prognoza) | średnia |
| Znaczenie dla ciężaru dowodu | wysoka |
| Stabilność relacji w czasie | średnia |
| Warunki obserwacji (tylko typ 2) | wysoka |

Scoring W2 jest wstępny — zaktualizuj go w W3 po analizie pytań ryzykownych.

---

## CHECKPOINT-W2 — OBOWIĄZKOWA PAUZA PRZED W3

> ⛔ REGUŁA DWÓCH WIADOMOŚCI — system zatrzymuje się tutaj.
> Po dostarczeniu W2 (tez, profilu, modelu, scoringu) system CZEKA.
> Pytania W3 generowane są w OSOBNEJ wiadomości, dopiero po uwagach użytkownika.

```
WIADOMOŚĆ 1 (ta wiadomość):
  Zawiera: PRE-W1 profil + mapa wiedzy + KROK 0 + W1 intake + W2 tezy/model/scoring
  Kończy się pytaniem do użytkownika.

WIADOMOŚĆ 2 (następna wiadomość, po odpowiedzi użytkownika):
  Zawiera: W3 pytania (kompletny zestaw z FPW + macierz + scoring finalny + rekomendacje)
```

### Treść CHECKPOINT-W2

Po dostarczeniu W2 system prezentuje podsumowanie i zadaje jedno pytanie:

```
═══════════════════════════════════════════════════════════
CHECKPOINT W2 — WERYFIKACJA PRZED GENEROWANIEM PYTAŃ
═══════════════════════════════════════════════════════════

ŚWIADEK:        [oznaczenie]
TYP:            [typ 1/2/3/4/5]
SCORING W2:     [X]/10 — [kwalifikacja]
MODEL:          [PEACE / LEJEK / ONE-FACT / CHRONOLOGICZNY]
ALTERNATYWA:    [model zapasowy]

TEZY (do wykazania):
  T1: [treść] — przepis kandydujący: ⚠️ [art. X]
  T2: ...

TEZY DO OBALENIA (jeśli cross):
  T_OB1: [treść]

SPRZECZNOŚCI DOSTĘPNE: [n] — kluczowe: [lista]

TEMATY ZAKAZANE (BLOK E):
  [lista z uzasadnieniem]

LUKI DOWODOWE:
  [tematy bez dowodu kontrolnego → SAFE-Q wymagane]

══════════════════════════════════════════════════════════
Czy tezy i model są właściwe? Czy chcesz coś zmienić lub
uzupełnić zanim przejdę do generowania pytań?
(Możesz odpowiedzieć "OK" aby kontynuować lub wskazać zmiany)
══════════════════════════════════════════════════════════
```

**Reguła CHECKPOINT-W2:** System nie generuje żadnego pytania z W3 bez
potwierdzenia użytkownika lub jawnej zgody ("OK", "kontynuuj", "generuj").
Wyjątek: użytkownik w pierwotnym poleceniu wprost zażądał pytań
("przygotuj od razu pytania", "wygeneruj cały zestaw") → pomiń checkpoint,
ale poinformuj że W2 i W3 są w tej samej wiadomości.

---

### TEZA-DOWODOWA-SCOPE-GATE (dodane w audycie 3.10) ⚠️ KRYTYCZNA, OBOWIĄZKOWA

> 🔴 Sąd uchyla pytania wykraczające poza zatwierdzoną tezę dowodową
> NATYCHMIAST i BEZ WZGLĘDU na ich merytoryczną siłę — najlepiej
> skonstruowane pytanie jest bezwartościowe, jeśli dotyczy okoliczności,
> na którą świadek nie został dopuszczony.

```
Przed przejściem do ETAP W3 w KONKRETNYM postępowaniu sądowym:

1. Sprawdź, czy w dostępnych materiałach (protokoły, postanowienia sądu)
   jest zapis USTALONEJ/ZATWIERDZONEJ tezy dowodowej dla tego świadka
   w TYM konkretnym postępowaniu (sygn. akt).
   - Jeśli TAK → wypisz tę tezę dosłownie, jako ramę, w której muszą
     zmieścić się wszystkie pytania W3.
   - Jeśli NIE (brak takiej informacji w materiałach) → zapytaj
     użytkownika wprost o zakres zatwierdzonej tezy PRZED wygenerowaniem
     pytań, zamiast zakładać, że każdy wątek merytoryczny jest dopuszczalny.

1a. ⚠️ WARIANT TEZA-NIEUSTALONA (dodane w audycie na żywym przypadku,
    2026-07-11) — gdy z protokołów wynika, że: (i) strona SAMA wycofała
    swój wniosek o przesłuchanie tego świadka, a mimo to (ii) sąd i tak
    postanowił wezwać świadka — bez utrwalonego w dostępnym materiale
    uzasadnienia/zakresu tego wezwania:
    - ⛔ ZAKAZ milczącego przyjęcia, że teza obejmuje wszystkie wątki,
      których dotyczyły dotychczasowe zeznania stron w sprawie.
    - Oznacz to jawnie jako "⬛ TEZA-NIEUSTALONA" w raporcie przed W3.
    - Buduj pytania WARSTWOWO: warstwa bezpieczna = fakty niesporne
      (przyznane wprost przez stronę przeciwną w protokole) → warstwa
      średnia = fakty własne świadka jednoznacznie z jego wcześniejszych,
      udokumentowanych czynności → warstwa wysokiego ryzyka = wątki
      wyłącznie odtworzone z twierdzeń jednej, zainteresowanej strony.
    - W binderze (W5) każdy blok pytań musi mieć widoczne oznaczenie
      warstwy, żeby użytkownik mógł natychmiast pominąć warstwę wysokiego
      ryzyka, jeśli teza okaże się węższa niż zakładano.
    - Rekomenduj użytkownikowi pozyskanie dokładnego brzmienia
      postanowienia dowodowego przed terminem rozprawy, zamiast czekać
      z tym pytaniem do samej rozprawy.

2. Dla KAŻDEGO pytania z W3 — oznacz zgodność z tezą:
   ✅ W RAMACH TEZY / ⚠️ GRANICZNE (może wymagać wniosku o rozszerzenie
   tezy przed rozprawą) / 🔴 POZA TEZĄ (wysokie ryzyko uchylenia — sąd
   może odrzucić natychmiast, niezależnie od jakości pytania).

3. Pytania oznaczone 🔴 POZA TEZĄ nie trafiają do finalnego zestawu bez
   wyraźnego ostrzeżenia użytkownika i/lub rekomendacji złożenia
   wcześniejszego wniosku o rozszerzenie tezy dowodowej.

4. Jeśli sąd już wcześniej (w tym samym lub powiązanym postępowaniu)
   uchylał pytania określonego typu z uzasadnieniem "poza tezą" —
   traktuj to jako precedens dla tego konkretnego sądu/sprawy i ostrzegaj
   z wyższym priorytetem.

Przykład z praktyki: sąd w postępowaniu o wynagrodzenie/świadectwo pracy
systematycznie uchylał pytania o treść i procedurę wydania upomnienia/kary
porządkowej, wskazując wprost "nie jest to przedmiotem tego postępowania"
— mimo że merytorycznie pytania były dobrze skonstruowane. Zestaw pytań
przygotowany bez sprawdzenia tezy dowodowej danego postępowania może więc
być w dużej części nieadmisyjny, niezależnie od jakości analitycznej.
```

### PROCEEDING-DISAMBIGUATION-TABLE (dodane w audycie 3.10)

> 🔴 Aktywacja: sprawa użytkownika obejmuje więcej niż jedno równolegle
> toczące się postępowanie (różne sygnatury, sądy, przedmiotowe zakresy).

```
Prowadź i aktualizuj tabelę:

| Sygnatura | Sąd | Przedmiot postępowania | Zatwierdzona teza dowodowa (jeśli znana) | Status |
|---|---|---|---|---|

Każdy przygotowywany zestaw pytań musi być jawnie oznaczony, do którego
konkretnego postępowania (sygnatury) jest przeznaczony — pytania właściwe
w jednym postępowaniu (np. o odszkodowanie za mobbing) mogą być całkowicie
nieadmisyjne w innym, równoległym postępowaniu tej samej osoby (np. o samo
wynagrodzenie i świadectwo pracy), nawet dotyczącym tych samych stron.
```

---

## ETAP W3 — PYTANIA

### Cel etapu

Wygenerowanie kompletnego zestawu pytań podzielonych na bloki,
z pełną bramką dla każdego pytania i finalną macierzą.

---

### QUESTION-ADMISSIBILITY-GATE

> ⛔ PIPELINE FPW (FAKT → PODSTAWA PRAWNA → WNIOSEK) — obowiązkowy przed każdym pytaniem.
> Pełna procedura: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md`

> 🔴 **GATE-DEFAULT-NOW (dodane w audycie 3.6):**
> QUESTION-ADMISSIBILITY-GATE, WHY-GATE i SAFE-Q stosuje się **w momencie
> generowania pierwszej wersji pytań**, nie dopiero gdy użytkownik poprosi
> o ocenę, audyt lub scoring 0-10. Wygenerowanie pytania łamiącego WHY-GATE
> lub zakładającego nieudowodniony fakt, z zamiarem "poprawię jeśli użytkownik
> zapyta" — jest błędem procesu, niezależnie od tego, czy użytkownik
> ostatecznie o ocenę poprosi. Jeśli pytanie nie przechodzi bramki, nie trafia
> do wersji roboczej — trafia od razu do BLOKU E z alternatywą.

> 🔴 **FACT-CROSS-CHECK-GATE (dodane w audycie 3.7):**
> FPW-1 (FAKT) nie może być zaakceptowany na podstawie samego brzmienia
> pytania — musi zostać **zestawiony z faktyczną treścią źródłowego
> dokumentu**, jeśli dokument ten jest dostępny w rozmowie. Dotyczy to
> zwłaszcza pytań formułujących twierdzenie negatywne o dokumencie
> ("dokument nie zawiera X", "brak w nim Y") — takie twierdzenie wymaga
> aktywnego sprawdzenia treści dokumentu przed akceptacją pytania, nie
> tylko przyjęcia go na wiarę, bo łatwo o nieścisłość, którą świadek lub
> pełnomocnik przeciwnej strony obnaży na sali (np. dokument faktycznie
> zawiera jedną, ogólną datę i ogólnikowy opis, więc twierdzenie
> "nie zawiera dat i opisu" jest fałszywe, mimo że intencja pytania —
> wykazanie niewystarczającej konkretności — jest słuszna). Jeśli treść
> dokumentu nie jest dostępna w rozmowie, oznacz FPW-1 jako ⚠️ NIEZWERYFIKOWANE
> i zapytaj użytkownika o dokument, zamiast przyjmować twierdzenie wprost.

> 🔴 **QUOTE-VERIFICATION-DEFAULT (dodane w audycie 3.7):**
> Każdy fragment tekstu przedstawiany jako dosłowny cytat z dokumentu
> (do użycia w pytaniu konfrontacyjnym / technice loopingu) jest
> weryfikowany słowo-w-słowo względem źródła **w momencie jego
> zaproponowania**, nie dopiero gdy użytkownik o to wprost zapyta.
> Wynik weryfikacji (zgodny / zgodny ze skrótem oznaczonym wielokropkiem /
> niezgodny) podaje się przy pytaniu. Cytatu niemożliwego do zweryfikowania
> względem dostępnego źródła nie włącza się do pytania — oznacza się jako
> wymagający weryfikacji przed użyciem.

Każde pytanie musi zawierać:

```
FPW-1 FAKT:   [fakt procesowy + źródło: dok_id/strona/zeznanie/domniemanie]
FPW-2 PRAWO:  [przepis → weryfikacja ISAP → ✅ [VER: ISAP, data] lub ⚠️ BRAK]
FPW-3 WNIOSEK:→ TAK: [skutek dla tezy] | → NIE: [skutek dla tezy]
              Ryzyko FPW: BEZPIECZNE / RYZYKO-ODPOWIEDŹ / RYZYKO-KONTROLA / RYZYKO-KUMULACJA

PYTANIE:      [treść pytania]
CEL:          [co chcę uzyskać procesowo]
TEZA:         [której tezie z W2 służy]
TYP:          [otwarte / zamknięte / kontrolne / pułapkowe / impeachment]
DOWÓD KON.:   [dowód który potwierdzi lub obali odpowiedź] / [brak → aktywuj SAFE-Q]
RYZYKO:       [podtyp: RYZYKO-KONTROLA / RYZYKO-ODPOWIEDŹ / RYZYKO-KUMULACJA + opis]
DOPUSZCZ.:    [dopuszczalne / ryzykowne / niedopuszczalne + podstawa prawna ✅]
```

**Reguła WHY-GATE (twardy zakaz w trybie cross):**
```
⛔ WHY-GATE — jeśli model = ONE-FACT lub świadek = wrogi/strony przeciwnej:
  Pytania "dlaczego / po co / w jakim celu / jak to możliwe" są ZAKAZANE.
  Klasyfikacja: RYZYKO-KONTROLA → automatyczny BLOK E.
  Wyjątek: świadek lojalny w modelu PEACE lub LEJEK — dopuszczalne.
```

**Reguła SAFE-Q (brak dowodu kontrolnego):**
```
Jeśli DOWÓD KON. = brak:
  → Przeformułuj pytanie tak, by obie odpowiedzi (TAK i NIE) były
    procesowo użyteczne lub neutralne.
  → Jeśli przeformułowanie niemożliwe → pytanie do BLOKU E.
  → Nie zadawaj pytania bez dowodu kontrolnego do BLOKU D (impeachment).
```

**Reguła FPW-RISK:**
```
Jeśli FPW-3 wskazuje, że odpowiedź NIE jest aktywnie szkodliwa dla tezy
→ pytanie automatycznie BLOK E (ryzykowne).
Podtyp RYZYKO-ODPOWIEDŹ.
```

**Podstawy prawne dopuszczalności — weryfikuj przez HARDGATE, nie z pamięci:**

```
⛔ HARDGATE — przed podaniem jakiejkolwiek podstawy prawnej:
  view /mnt/skills/user/shared/PRAWO-HARDGATE.md

Podstawy wymagające weryfikacji online (przykłady — nie wyczerpująca lista):
  KPC: pytania sugestywne (art. 271), zakaz zeznań co do faktów objętych tajemnicą
       (art. 261), zakaz zeznań małżonka i bliskich (art. 261 §1)
  KPK: zakaz dowodowy (art. 168a, 174, 178, 199), prawo do odmowy zeznań (art. 182),
       zwolnienie z zachowania tajemnicy (art. 180), konfrontacja (art. 172)
  KPW: odpowiednie stosowanie KPK (art. 39, 41)
  KPA: zeznania w postępowaniu administracyjnym (art. 83, 86)

Dla każdej powołanej podstawy → web_search ISAP → oznacz ✅ [VER: ISAP, data]
```

**Pełna logika klasyfikacji pytań:**
`view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md`

---

### BLOK A — Pytania identyfikujące i wiarygodnościowe

Cel: ustalenie relacji świadka ze sprawą, stronami, podstawy wiedzy, ewentualnego interesu.

Zawsze na początku. Ilość: 3–6 pytań.
Model domyślny dla tego bloku: PEACE (Engage).

Przykładowe obszary (dobierz do danych z W1):
- Skąd świadek zna okoliczności sprawy?
- Jak długo i w jaki sposób pozostawał w kontakcie ze stronami?
- Czy posiada interes osobisty lub finansowy w wyniku sprawy?
- Czy był wcześniej przesłuchiwany w tej lub powiązanej sprawie?

---

### BLOK B — Pytania główne (tezy z W2)

Cel: udowodnienie tez dowodowych zidentyfikowanych w W2.

Ilość: min. 2 pytania na tezę.
Model: zgodnie z rekomendacją z W2.

Przy modelu PEACE: pytania otwarte narracyjne → uszczegóławiające.
Przy modelu LEJEK: szerokie → wąskie.
Przy modelu ONE-FACT: zamknięte, jedno zdanie, jeden fakt.

---

### BLOK C — Pytania kontrolne i zabezpieczające

Cel: potwierdzenie kluczowych faktów alternatywnymi sformułowaniami,
zabezpieczenie ustępstw przed wycofaniem.

Ilość: 3–8 pytań.
Technika: looping dla ustępstw uzyskanych w Bloku B.

**SYGNAŁY STOP — oznacz przy każdej grupie pytań w tym bloku:**

```
STOP-1: USTĘPSTWO UZYSKANE
  Świadek potwierdził kluczowy fakt → natychmiast przejdź dalej.
  Nie pytaj o przyczynę, nie eksploruj — looping w BLOKU C, potem STOP.

STOP-2: ODPOWIEDŹ ROZSZERZONA SZKODLIWA
  Świadek zaczął narrację korzystną dla siebie → nie kontynuuj linii.
  Wróć do pytania zamkniętego z innego obszaru lub zmień blok.

STOP-3: ŚWIADEK ZMIENIŁ POSTAWĘ
  Świadek odpowiada inaczej niż prognozowano w W2 → aktywuj model awaryjny
  z REKOMENDACJI KOŃCOWYCH. Nie improwizuj otwartymi pytaniami.

STOP-4: CEL ROZDZIAŁU OSIĄGNIĘTY
  Cel procesowy bloku/rozdziału zrealizowany → zakończ blok bez "jednego pytania za dużo".
```

---

### BLOK D — Pytania na sprzeczności
*(dostępny TYLKO jeśli dostarczono dokument z wcześniejszymi zeznaniami)*

Cel: ujawnienie rozbieżności między obecnymi zeznaniami a wcześniejszymi.

Dla każdej sprzeczności zidentyfikowanej w W2:
- Przytoczyć wcześniejsze sformułowanie (bez cytowania wprost — parafrazą lub przez pytanie).
- Pytanie stwierdzające aktualną wersję.
- Pytanie konfrontacyjne ujawniające rozbieżność.
- Pytanie o przyczynę zmiany zeznań.

Jeśli dokument zeznań nie został dostarczony:
```
⬛ BLOK D: niedostępny — brak dokumentu z wcześniejszymi zeznaniami.
   Aby odblokować: dostarcz protokół przesłuchania / deklarację pisemną.
```

---

### BLOK E — Pytania ryzykowne i niedopuszczalne

Dla każdego pytania ryzykownego lub niedopuszczalnego podaj:
- treść pytania,
- dlaczego jest ryzykowne / niedopuszczalne,
- alternatywę bezpieczną lub rezygnację.

Kategorie:
- **Niedopuszczalne**: sugestywne w przesłuchaniu bezpośrednim, naruszające zakazy dowodowe,
  dotyczące faktów nieobjętych tezą dowodową.
- **Ryzykowne**: otwarte na odpowiedź szkodliwą, mogące wzmocnić zeznania świadka,
  pytania bez dowodu kontrolnego.

---

### MACIERZ FINALNA

Format tabeli:

| # | Pytanie (skrót) | Blok | Cel | Teza | Dowód kontrolny | Ryzyko |
|---|---|---|---|---|---|---|

Uwzględnij wszystkie pytania z Bloków A–D.

---

### SCORING FINALNY

Zaktualizowany scoring 0–10 po analizie pytań ryzykownych.

Format:
```
SCORING FINALNY: [X]/10 — [słaby / umiarkowany / istotny / kluczowy]

Uzasadnienie:
- Bezpośredniość wiedzy: [ocena]
- Interes w wyniku: [ocena]
- Spójność z dokumentami: [ocena]
- Odporność na kontrpytania: [ocena]
- Znaczenie dla ciężaru dowodu: [ocena]
- Warunki obserwacji (jeśli typ 2): [ocena]

Zmiana względem W2: [bez zmiany / podniesiony / obniżony + powód]
```

---

### REKOMENDACJE KOŃCOWE

- Kolejność bloków na sali (jeśli odmienna od A→B→C→D).
- Kwestie do monitorowania podczas przesłuchania.
- Pytania rezerwowe na wypadek nieoczekiwanej odpowiedzi.
- Rekomendacja co do modelu awaryjnego (jeśli świadek zmieni postawę).

---

## ETAP W4 — PRÓBA GENERALNA (przed rozprawą)

> Aktywowany na żądanie lub automatycznie gdy użytkownik mówi
> "jutro rozprawa", "za X dni przesłuchanie", "przejrzyj pytania".
> Metodyka: Wagner (Taft Law 2024) — "Practice Your Cross-Examination".

```
LISTA KONTROLNA W4:
□ Przejrzyj macierz finalną — usuń pytania które "nie czujesz"
□ Zidentyfikuj 4-6 rozdziałów do użycia (z 8-10 przygotowanych)
□ Sprawdź kolejność: PRIMACY — mocny start, RECENCY — mocne zakończenie
□ Sprawdź każdy DOWÓD KON. — czy wiesz gdzie FIZYCZNIE jest w aktach?
□ Przećwicz BLOK D (sprzeczności) — znaj strony protokołów na pamięć
□ Przygotuj "clap-back" na 3 najbardziej prawdopodobne odpowiedzi wymijające
□ Wyznacz STOP-4 dla każdego rozdziału — gdzie kończysz niezależnie od wyniku
□ Ustal model awaryjny: co robisz gdy świadek zmieni postawę w trakcie?
```

**Wynik W4:** zatwierdzona lista rozdziałów z kolejnością + model awaryjny.

---

## ETAP W5 — BINDER SĄDOWY

> Instrukcja do użycia NA SALI. Aktywowana na żądanie lub przy W4.
> Metodyka: Pozner & Dodd 4th ed. (2024) — "Sourcing the Facts in Real Time".

```
STRUKTURA BINDERA (per świadek):
  Zakładka 1: MACIERZ FINALNA (pytania w kolejności rozdziałów)
  Zakładka 2: PREPARATION CHART (tematy A-priorytet)
  Zakładka 3: DOKUMENTY KONTROLNE (kluczowe strony do pokazania świadkowi)
              → każdy dok_id z KROK III ma fizyczną zakładkę z numerem strony
  Zakładka 4: BLOK D — sprzeczności (cytat wcześniejszy + strona)
  Zakładka 5: MODEL AWARYJNY (jeśli świadek zmieni postawę)

NAWIGACJA NA SALI:
  Każde pytanie ma numer → numer = zakładka dokumentu jeśli potrzeba
  Nigdy nie szukaj dokumentu podczas przesłuchania — wszystko oznaczone przed salą
```

---

## ETAP W6 — SŁUCHANIE DIRECT I ADAPTACJA

> Etap w trakcie rozprawy: przed Twoim cross świadek zeznaje na wprost.
> Metodyka: Davis (NACDL), Rev (2026) — aktywne słuchanie = przygotowanie.

```
PODCZAS DIRECT EXAMINATION (zeznania na wprost / przesłuchanie przez sąd):

□ NOTUJ dosłowne sformułowania świadka — szczególnie:
    - fakty których nie przewidziałeś w W2
    - sformułowania sprzeczne z KROK III-D (cytaty z protokołów)
    - odpowiedzi otwierające nowe wątki (ryzyko lub szansę)
    - "nigdy / zawsze / niemożliwe" → ekstrema do wykorzystania

□ OCENIAJ per rozdział z W4:
    ZIELONY: świadek potwierdził Twoją tezę już w direct → ten rozdział możesz skrócić
    ŻÓŁTY:   zeznania neutralne → realizuj plan
    CZERWONY: świadek rozwinął narrację szkodliwą → aktywuj model awaryjny z W4

□ DECYDUJ co usunąć:
    Jeśli świadek przyznał fakt X na direct → nie pytaj o X w cross
    (looping straci efekt, ryzykujesz rozwinięcie niekorzystne)

□ DECYDUJ co dodać:
    Jeśli pojawiło się nowe sformułowanie → oceń FPW-3 przed zadaniem pytania
    Jeśli nie masz dowodu kontrolnego → SAFE-Q lub pomiń

□ PO DIRECT — przed cross:
    Przeglądnij zakładki bindera (30 sekund)
    Zaznacz rozdziały do użycia (z zatwierdzonych 4-6)
    Potwierdź kolejność PRIMACY/RECENCY
```

---

## Zakaz

Nie wolno domyślnie:

- **odkładać stosowania QUESTION-ADMISSIBILITY-GATE/WHY-GATE do momentu, gdy użytkownik poprosi o ocenę** —
  bramki stosuje się przy pierwszym generowaniu pytań (GATE-DEFAULT-NOW, audyt 3.6),
- **oceniać lub poprawiać pytanie dostarczone gotowe przez użytkownika bez uprzedniej rekonstrukcji jego tezy** —
  patrz IMPORTED-QUESTIONS-GATE (audyt 3.6),
- **pomijać zapytania o odręczne/nieoczywiste elementy przy nowym dokumencie** —
  patrz DOCUMENT-SCAN-PROMPT (audyt 3.6),
- **rozpoczynać generowanie pytań bez jawnego ustalenia tez do wykazania, posiadanych dowodów
  oraz tożsamości/roli świadka**, gdy nie wynika to jednoznacznie z materiałów —
  patrz TEZY-DOWODY-SWIADEK-GATE (audyt 3.6),
- **akceptować pytanie zawierające twierdzenie o treści dokumentu bez zestawienia go
  z faktyczną treścią źródła dostępną w rozmowie** —
  patrz FACT-CROSS-CHECK-GATE (audyt 3.7),
- **budować tezę opartą na ochronie ustawowej zależnej od daty, zanim ustalona zostanie
  dokładna data zdarzenia** —
  patrz LEGAL-TIMING-GATE (audyt 3.7),
- **pomijać zestawienie nowego dokumentu dowodowego z wcześniej ustalonymi faktami/datami/kwotami
  w tej samej sprawie** —
  patrz CROSS-DOCUMENT-CONSISTENCY-CHECK (audyt 3.7),
- **włączać cytat do pytania bez weryfikacji słowo-w-słowo względem źródła w momencie jego zaproponowania** —
  patrz QUOTE-VERIFICATION-DEFAULT (audyt 3.7),
- **oceniać nadesłaną, zaktualizowaną wersję zestawu pytań od zera, bez zestawienia
  z poprzednio zatwierdzoną wersją** —
  patrz REVISION-DIFF-CHECK (audyt 3.7),
- **poprzestawać na samym zasygnalizowaniu duplikującej się numeracji bez zaproponowania przenumerowania** —
  patrz AUTO-RENUMBER-OFFER (audyt 3.7),
- **proponować teorię kryminalistyczną/stylistyczną/techniczną o dokumencie bez sprawdzenia,
  czy ten sam wzorzec występuje gdzie indziej i czy dokument spełnia strukturalny warunek metody** —
  patrz FOUNDATION-VERIFICATION-GATE (audyt 3.8),
- **przedstawiać częściowy wynik przeszukania archiwum/zbioru dokumentów jako kompletny,
  bez zliczenia i uwzględnienia wszystkich trafień w tym samym fragmencie** —
  patrz EXHAUSTIVE-EXTRACTION-GATE (audyt 3.8),
- **czekać z zgłoszeniem wewnętrznej sprzeczności logicznej/czasowej dokumentu na pytanie
  naprowadzające użytkownika, zamiast zgłosić ją przy pierwszym czytaniu** —
  patrz IMMEDIATE-LOGICAL-SCAN (audyt 3.8),
- **cytować przepis karny lub podstawę zwolnienia dyscyplinarnego/kary porządkowej obok opisu
  zarzucanego czynu bez ustrukturyzowanego, tabelarycznego zestawienia KAŻDEJ wymaganej
  przesłanki z tym, co dokument faktycznie podaje na jej poparcie** —
  patrz PRZESŁANKI-GATE (dawne LEGAL-ELEMENT-MATCH-CHECK, rozbudowane w audycie 3.9),
- **analizować dokumenty od wielu powiązanych podmiotów prawnych bez prowadzenia
  i aktualizowania tabeli przypisania dokumentów do podmiotów** —
  patrz ENTITY-DISAMBIGUATION-TABLE (audyt 3.8),
- **finalizować pytania W3 dla konkretnego postępowania bez ustalenia zatwierdzonej
  tezy dowodowej dla danego świadka w TYM postępowaniu i oznaczenia zgodności
  każdego pytania z tą tezą** —
  patrz TEZA-DOWODOWA-SCOPE-GATE (audyt 3.10, KRYTYCZNA),
- **przygotowywać pytania bez jawnego oznaczenia, do którego konkretnego,
  równolegle toczącego się postępowania są przeznaczone**, gdy toczy się
  ich więcej niż jedno —
  patrz PROCEEDING-DISAMBIGUATION-TABLE (audyt 3.10),
- **oznaczać przesłankę zarzutu jako pozbawioną pokrycia dowodowego bez przeszukania
  wszystkich innych dostępnych dokumentów sprawy (w tym pism własnych użytkownika
  i transkryptów innych świadków) pod kątem materiału potwierdzającego lub obalającego** —
  patrz CONTEXTUAL-REBUTTAL-CHECK (audyt 3.10, rozszerzenie PRZESŁANKI-GATE),
- **przygotowywać nowe pytania dla świadka, którego wcześniejsze zeznania są już
  dostępne, bez wydobycia z transkryptu przyznanych faktów, sprzeczności
  i wcześniejszych decyzji sądu o uchyleniu pytań** —
  patrz TRANSCRIPT-MINING-GATE (audyt 3.10),
- **pozostawiać tematycznie powiązane ustalenia dowodowe z różnych momentów tej samej
  rozmowy jako osobne, niepołączone fakty, gdy opisują to samo zjawisko z innej strony** —
  patrz EVIDENCE-THREAD-LINKING (audyt 3.11),
- **konstruować kontrariańską reinterpretację ("świadek się pomylił/celowo przeformułował")
  zeznania, które w prostym, dosłownym odczytaniu jest już zgodne z materiałem dowodowym
  i nieszkodliwe lub korzystne dla użytkownika, bez konkretnej, wskazywalnej sprzeczności
  uzasadniającej taką reinterpretację** —
  patrz PLAIN-TESTIMONY-DEFAULT (audyt 3.12),
- **wchodzić do KROK-PRE-W1-INTELLIGENCE, profilu świadka, tez lub pytań bez
  wykonanego SD-VER = KOMPLET dla całego materiału dot. świadka, w tym bez
  jawnego wykonania OCR dla każdego pliku PDF bez warstwy tekstowej** —
  patrz PRE-W1a-SD-VER (audyt 3.13, HARD GATE),
- **utożsamiać dokument wzmiankowany w zeznaniu/protokole (np. "notatka
  dołączona do akt") z innym, fizycznie obecnym dokumentem o zbliżonej
  funkcji, zamiast oznaczyć go jako ⬛ DO WERYFIKACJI, gdy sam nie występuje
  w przekazanym materiale** —
  patrz DOCUMENT-REFERENCED-NOT-FOUND-GATE w PRE-W1a-SD-VER (audyt 3.13),
- **pomijać krok pipeline'u świadka (PRE-W1a..W6) bez natychmiastowego
  zaraportowania tego jako "⚠️ POMINIĘTY" w rejestrze MOD-STEP-TRACKER** —
  patrz integracja STEP-TRACKER w PRE-W1a-SD-VER (audyt 3.13),
- pomijać KROK PRE-W1 WITNESS-INTELLIGENCE gdy dostarczone są dokumenty o świadku,
- generować pytań bez przejścia przez W1 i W2,
- **generować pytań bez zamkniętego pipeline FPW (FPW-1 + FPW-2 + FPW-3)**
  — brak FPW = pytanie procesowo nieuzasadnione, niezależnie od treści,
- **oznaczać FPW-2 jako ✅ [VER] bez faktycznego wywołania web_search/web_fetch**
  — fałszywy VER = CRIT,
- **zadawać pytań "dlaczego / po co / w jakim celu" przy modelu ONE-FACT**
  **lub świadku wrogim** — WHY-GATE → automatyczny BLOK E (RYZYKO-KONTROLA),
- generować pytań bez DOWÓD KON. bez aktywacji procedury SAFE-Q,
- pomijać PRIOR-TESTIMONY-GATE jeśli świadek składał zeznania,
- tworzyć bloku D bez dokumentu źródłowego,
- pytać użytkownika o dane dostępne w materiałach,
- tworzyć artefaktu graficznego bez wyraźnego żądania,
- importować brakujących komponentów JSX,
- generować pytań bez bramki QUESTION-ADMISSIBILITY-GATE,
- **podawać artykułów KPC/KPK/KPW/KPA o dopuszczalności dowodów z pamięci** — każda
  podstawa prawna wymaga weryfikacji przez PRAWO-HARDGATE przed podaniem.

---

## Integracja z innymi skilla

| Skill | Kiedy wywołać |
|---|---|
| `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` | **OBOWIĄZKOWO, BEZPOŚREDNIO, na PRE-W1a** — przed jakimkolwiek profilem świadka lub tezą, niezależnie od tego, czy `analizator-dowodow-v3` jest wczytany (audyt 3.13) |
| `shared/MOD-STEP-TRACKER.md` | **OBOWIĄZKOWO, na PRE-W1a.3** — inicjalizacja rejestru kroków świadka, aktualizacja po każdym etapie (audyt 3.13) |
| `analizator-dowodow-v3` | przed W2 jeśli dostępne obszerne akta (uzupełniająco — nie zastępuje bezpośredniego SD-VER z PRE-W1a) |
| `chronologia-sprawy-v1` | jeśli zdarzenia mają złożoną oś czasu |
| `analiza-sadowa-v6` | jeśli potrzebna ocena szans sprawy przed doborem strategii |
| `raport-sytuacyjny-v2` | po W3 na żądanie użytkownika |
| `shared/DOWODY-METODOLOGIA.md` | przy ocenie wartości dowodowej zeznań |
| `shared/STRATEGIA-PROCESOWA.md` | przy doborze modelu przesłuchania |

---

## Tryb graficzny — tylko na żądanie

Tryb JSX / widget uruchamiany wyłącznie gdy użytkownik użyje:
„pokaż graficznie", „dashboard", „panel JSX", „wizualizacja", „diagram".

W razie wątpliwości zawsze wybierz tryb tekstowy.

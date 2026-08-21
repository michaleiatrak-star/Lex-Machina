# CHANGELOG — przesluchanie-swiadkow-v2-min90

> Pełna historia napraw i zmian wersji (17 wpisów: 3.1–3.19). Wyniesiona z
> SKILL.md 2026-07-12 (runda 2 — redukcja kosztu kontekstu), ZAKTUALIZOWANA
> 2026-08-20 (F-78, porządkowanie SKILL.md >1000 linii — dopisano wpisy
> 3.16-3.19, które od poprzedniej redukcji ponownie trafiały bezpośrednio
> do pola YAML `changelog` w SKILL.md zamiast tutaj). Wczytuj TYLKO gdy
> potrzebujesz historii konkretnej naprawy (SKILL.md trzyma tylko krótkie
> podsumowanie bieżącej wersji jako kontekst).

- 3.19 (2026-07-14, runda 5 — na wyraźne polecenie użytkownika po incydencie sprawa XI P 27/26 — świadek Maria Koroleva, protokół rozprawy 08.07.2026): PRZYCZYNA: model odczytał protokół rozprawy z 08.07.2026 narzędziem `view` bez `view_range`. Narzędzie zwróciło adnotację `< truncated lines 174-230 >` — obcięcie środka pliku mimo jego niewielkiego rozmiaru (394-403 linii, ~14 KB; próg obcięcia jest znakowy, nie zależy od "wyglądu" pliku jako krótkiego). Model potraktował to jako nieistotną adnotację techniczną i zbudował tezy oraz pytania (W2/W3) na pozostałej treści, nigdy nie wracając do obciętego zakresu. Skutek: przez trzy kolejne tury pominięto zeznanie o wiadomości WhatsApp z 28.09.2024 do kilkuset pracowników — fakt niekwestionowany przez pełnomocnika pozwanej wprost na rozprawie — dopóki użytkownik nie porównał wyniku z niezależnie przygotowanym dokumentem (Pytania_dla_Marii.docx, Blok 4) i nie polecił ponownego zbadania protokołów pod tym kątem. NAPRAWA: poprawka wprowadzona w zależności współdzielonej, nie lokalnie w tym skillu — patrz `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` w.1.5.0, REGUŁA-TRUNCATION-VIEW oraz SD-GATE-TRUNC (FAZA 2 i FAZA 3). Ten skill dziedziczy naprawę automatycznie przez istniejącą, twardą zależność PRE-W1a-SD-VER — nie wymaga osobnej kopii reguły, zgodnie z zasadą unikania duplikacji (CHECKLIST-DEDUP). Pełny opis incydentu: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-14b.

- 3.18 (2026-07-14, runda 4 — na wyraźne polecenie użytkownika po incydencie sprawa XI P 27/26 — świadek Maria Koroleva, pismo pracodawcy 7.10.2024): PRZYCZYNA: przy pierwszym czytaniu dokumentu powołującego się na przepisy Kodeksu karnego jako podstawę zwolnienia dyscyplinarnego (upomnienie 14.08.2024, pismo 7.10.2024) model wykonał WYŁĄCZNIE KROK 2 procedury PRZESŁANKI-GATE (weryfikacja treści przepisu przez web_search — zgodnie z PRAWO-HARDGATE), ale pominął KROKI 3-5 (zestawienie KAŻDEJ wymaganej przesłanki z tym, co dokument konkretnie podaje na jej poparcie, CONTEXTUAL-REBUTTAL-CHECK wobec innych dokumentów sprawy, tabela zbiorcza, wniosek jednozdaniowy per podstawa prawna). Model pomylił "zweryfikowałem treść przepisu" z "wykonałem PRZESŁANKI-GATE" — to są dwa różne, niezależne obowiązki tego skilla. Analiza formalna dokumentu (upomnienia) pod kątem zgodności z art. 108-112 k.p. również nie została wykonana proaktywnie przy pierwszym czytaniu, tylko dopiero na wprost zadane pytanie użytkownika "czy analizowałeś dokumenty pod kątem zgodności z prawem i wymogami formalnymi?" — dokładnie ten sam wzorzec reaktywności, który doprowadził do naprawy 3.17 (RZ-SHOW). Skutek: 5 podstaw prawnych z pisma 7.10.2024 pozostało niezweryfikowanych pod kątem pokrycia faktycznego przez półtorej tury rozmowy, mimo że materiał do tej analizy (w tym CONTEXTUAL-REBUTTAL-CHECK z pisma powoda 30.06.2025 i zeznań świadka Nawrota) był dostępny od momentu wczytania akt. NAPRAWA: (1) dodano jawne rozróżnienie PRAWO-HARDGATE vs PRZESŁANKI-GATE w sekcji PRZESŁANKI-GATE (blok "ROZRÓŻNIENIE 3.18") — weryfikacja treści przepisu NIGDY nie zamyka obowiązku PRZESŁANKI-GATE sama w sobie; (2) dodano SELF-CHECK-PO-WERYFIKACJI-PRAWNEJ: bezpośrednio po KAŻDYM web_search weryfikującym przepis karny/kp w dokumencie oskarżycielskim, model MUSI natychmiast, w tej samej odpowiedzi, przejść do KROKU 3 PRZESŁANKI-GATE dla tego przepisu — zakaz kończenia odpowiedzi na samej weryfikacji treści; (3) dodano FORMALNA-ZGODNOSC-GATE — analogiczny obowiązek jak PRZESŁANKI-GATE, ale dla zgodności FORMALNEJ dokumentu (nie merytorycznej) z wymogami proceduralnymi (art. 108-113 k.p. dla kar porządkowych, wymogi doręczenia, pouczeń) — wykonywany RÓWNOLEGLE z PRZESŁANKI-GATE przy pierwszym czytaniu takiego dokumentu, nie tylko na żądanie.

- 3.17 (2026-07-14, runda 3 — na wyraźne polecenie użytkownika po incydencie sprawa XI P 27/26 — świadek Maria Koroleva): PRZYCZYNA: moduł shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md (utworzony 2026-07-12 właśnie z powodu tej sprawy) istniał, ale NIE był wpisany jako zależność required tego skilla — działał wyłącznie reaktywnie (na wprost zadane pytanie użytkownika "czy sprawdziłeś wszystko?"), a nie proaktywnie przy każdym otwarciu sprawy z dowodami. Skutek: model przedstawił tezy i pytania W3 na podstawie 7 z 23 dostępnych plików, bez poinformowania użytkownika o pominięciu pozostałych 16, które wyszło na jaw dopiero po pytaniu kontrolnym. NAPRAWA: (1) dodano MOD-REJESTR-ZALACZNIKOW-CHECKPOINT do dependencies.required (nie tylko pośrednio przez SD-VER); (2) dodano RZ-SHOW-GATE do validation.required_gates; (3) dodano jawny etap PRE-W1a.4-RZ-SHOW do pipeline.stages, wykonywany BEZPOŚREDNIO po PRE-W1a-SD-VER i PRZED KROK-PRE-W1-INTELLIGENCE — nie opcjonalnie, nie tylko na żądanie; (4) dodano regułę RZ-SHOW-ZAWSZE wymuszającą wyświetlenie pełnego rejestru plików ze statusem ✅/🔶/⬜/➖ w PIERWSZEJ odpowiedzi każdej tury, w której obecne są dowody, niezależnie od tego czy użytkownik o to zapytał.

- 3.16 (AUDYT SYSTEMU — na wyraźne wskazanie użytkownika, 3 luki naraz): (1) USUNIĘTO wyjątek w CHECKPOINT-W2 pozwalający pominąć pauzę, gdy użytkownik wprost zażądał pytań od razu — teraz BEZ WYJĄTKÓW, zawsze osobna wiadomość z akceptacją przed W3. (2) CHECKPOINT-W2 rozszerzony o obowiązkowe pole CHRONOLOGIA ZDARZEŃ — akceptacja użytkownika musi obejmować tezy+model ORAZ chronologię łącznie, nie tylko tezy. (3) Dodano SELF-CHECK-PRZED-W3 — obowiązkowe ponowne wczytanie checklisty (W2+chronologia potwierdzone / lista świadków zamknięta / teza dowodowa ustalona / rejestr kroków aktualny) na starcie KAŻDEJ wiadomości zawierającej W3, z krótkim raportem co potwierdzono i co (jeśli cokolwiek) pominięto — na tej samej zasadzie jak FAZA 2 MOD-STEP-TRACKER w pisma-procesowe-v3. Przyczyna: użytkownik wskazał, że (a) pytania nie mogą powstać bez odrębnej akceptacji chronologii, nie tylko dowodów/tez, (b) ustalenie kto ma być przesłuchany musi wynikać z dokumentów/protokołów lub, gdy się nie da, z wprost zadanego pytania — nie z domysłu, (c) pominięcie etapu musi być zawsze jawnie zaraportowane, tak jak w pisma-procesowe-v3, (d) checklista musi być wczytywana na nowo w kolejnej wiadomości, nie tylko raz na początku sesji.

- 3.13 (AUDYT SYSTEMU — na wyraźne wskazanie użytkownika po błędach sesji: przedwczesne tezy o rzekomo brakującej 'notatce' bez wykonania OCR na 130 stronach zeskanowanych akt; pomylenie odręcznego dopisku na upomnieniu z odrębną notatką służbową; brak wskazania dat poszczególnych naruszeń w upomnieniu przeoczony przy pierwszym czytaniu): dodano PRE-W1a-SD-VER jako TWARDĄ, BEZPOŚREDNIĄ zależność od MOD-SKAN-DOWODOW-KOMPLETNY (wcześniej wpięty tylko pośrednio przez analizator-dowodow, więc pomijalny gdy ten skill nie był ładowany). HARD GATE: zakaz wejścia do KROK-PRE-W1-INTELLIGENCE / profilu świadka dopóki SD-VER ≠ KOMPLET. Dodano jawny wymóg OCR (pdftoppm + tesseract -l pol) dla KAŻDEGO pliku PDF bez warstwy tekstowej >0 znaków/stronę, zanim przystąpi się do budowy tez lub pytań. Zintegrowano MOD-STEP-TRACKER z pipeline'em świadka (rejestr kroków PRE-W1a..W6, status ⚠️ POMINIĘTY raportowany natychmiast). Dodano DOCUMENT-REFERENCED-NOT-FOUND-GATE: dokument wzmiankowany w zeznaniu/protokole, którego nie ma w przekazanym materiale, oznaczany jako ⬛ DO WERYFIKACJI zamiast milcząco pomijany lub mylony z innym, fizycznie obecnym dokumentem. Zobacz też changelog shared/MOD-SKAN-DOWODOW-KOMPLETNY.md i shared/MOD-STEP-TRACKER.md.

- 3.12 (KOREKTA NADINTERPRETACJI — na wyraźne wskazanie użytkownika, że zeznanie świadka było trafne, a wygenerowana 'teoria o pomyleniu/ przeformułowaniu' była zbędnym i nietrafnym nadbudowywaniem napięcia tam, gdzie go nie było): dodano PLAIN-TESTIMONY-DEFAULT — zasadę zabraniającą konstruowania kontrariańskiej reinterpretacji zeznania świadka ('świadek się pomylił', 'świadek celowo przeformułował'), gdy proste, dosłowne odczytanie tego zeznania jest już zgodne z materiałem dowodowym i nie wymaga obalania. Przyczyna: zeznanie świadka Nawrota o 'dokumentach wewnętrznych — transakcjach' zostało błędnie zinterpretowane jako niezgodne z rzeczywistością (rzekome pomylenie kierunku transakcji przez świadka), podczas gdy w rzeczywistości zeznanie było trafnym, neutralnym opisem dokumentów faktycznie istniejących (rejestr kwot należnych cudzoziemcom) — należało to potwierdzić i wykorzystać na korzyść użytkownika, a nie budować wobec tego zeznania sztuczną kontrę. Nadinterpretacja jasnego, zgodnego z materiałem zeznania jako 'wymagającego obalenia' jest równie szkodliwa analitycznie jak przyjmowanie każdego zeznania bezkrytycznie — marnuje wysiłek na konstruowanie niepotrzebnej kontrteorii i ryzykuje zbudowanie na sali argumentu, który łatwo obalić, wskazując, że świadek miał rację od początku.

- 3.11 (EVIDENCE-THREAD-LINKING — na wyraźne wskazanie użytkownika): dodano mechanizm proaktywnego łączenia pozornie osobnych ustaleń dowodowych znalezionych w RÓŻNYCH momentach tej samej sesji/sprawy w jedną spójną narrację, zamiast traktowania ich jako izolowane fakty. Przyczyna: trzy elementy — (a) niejasne zeznanie świadka o 'dokumentach wewnętrznych/transakcjach', (b) własna wiadomość użytkownika do agenta odwołująca się do 'dokumentu z kwotą do zwrotu', (c) tabela udokumentowanych zwrotów środków cudzoziemcom — zostały znalezione i przeanalizowane osobno, w różnych turach tej samej rozmowy, mimo że łączą się w jedną, spójną i korzystną dla użytkownika interpretację (rejestr długów spółki wobec cudzoziemców, błędnie/celowo przeformułowany jako 'transakcje między pracownikiem a spółką'). Mechanizm nakazuje, przy każdym nowym ustaleniu dowodowym, świadome przeszukanie PAMIĘCI CAŁEJ ROZMOWY (nie tylko aktualnie analizowanego dokumentu) pod kątem wcześniej znalezionych faktów, które mogłyby się z nim semantycznie łączyć — nie tylko identycznych słów kluczowych (to już robi CROSS-DOCUMENT-CONSISTENCY- CHECK), ale też powiązanych tematycznie wątków opisujących to samo zjawisko z innej strony.

- 3.10 (NAPRAWA NA PODSTAWIE ANALIZY PROTOKOŁÓW ROZPRAW — cztery mechanizmy, jeden krytyczny dla przesłuchań): (1) TEZA-DOWODOWA-SCOPE-GATE [KRYTYCZNY] — przed sfinalizowaniem pytań do świadka w konkretnym postępowaniu, ustal z dostępnych protokołów/postanowień sądu, jaka jest ZATWIERDZONA teza dowodowa dla tego świadka w TYM postępowaniu; każde przygotowane pytanie wykraczające poza tę tezę oznacz jako wysokie ryzyko uchylenia przez sąd, NIEZALEŻNIE od jego merytorycznej siły — sąd uchyla pytania spoza tezy natychmiast, bez względu na to, jak dobrze skonstruowane; (2) PROCEEDING-DISAMBIGUATION-TABLE — analogicznie do ENTITY-DISAMBIGUATION-TABLE, prowadzić tabelę równolegle toczących się postępowań (sygnatura, sąd, przedmiot, zatwierdzona teza dowodowa, status) i oznaczać, dla którego postępowania przygotowywany jest dany zestaw pytań — pytania trafne w jednym postępowaniu mogą być całkowicie nieadmisyjne w innym; (3) CONTEXTUAL-REBUTTAL-CHECK (rozszerzenie PRZESŁANKI-GATE) — oceniając, czy przesłanka zarzutu jest 'niepotwierdzona', przeszukaj WSZYSTKIE dostępne dokumenty sprawy (w tym własne pisma procesowe użytkownika i transkrypty zeznań innych świadków), nie tylko dokument oskarżycielski, zanim oznaczysz przesłankę jako pozbawioną pokrycia dowodowego; (4) TRANSCRIPT-MINING-GATE — gdy dostępny jest pełny protokół wcześniejszego przesłuchania TEGO SAMEGO świadka, przed przygotowaniem nowych pytań wydobądź z niego: już przyznane fakty, sprzeczności oraz uprzednie decyzje sądu o uchyleniu pytań (i powody uchylenia) — żeby nie powielać pytań już raz uchylonych z tego samego powodu. Przyczyny: analiza przesłanki 'czy oferowanie pracy było w zakresie obowiązków' pominęła własne pismo procesowe użytkownika oraz transkrypt zeznań Marii Koroleva, które wprost tę przesłankę potwierdzały — obie dostępne w tym samym archiwum, niesprawdzone przy pierwszej analizie; równolegle odkryto, że sąd w postępowaniu VII P 94/25 systematycznie uchylał pytania o upomnienie/kary porządkowe jako wykraczające poza tezę dowodową — ryzyko, że znaczna część przygotowanego w tej sesji zestawu pytań o upomnienie może być nieadmisyjna w konkretnym postępowaniu, nie zostało wcześniej zasygnalizowane.

- 3.9 (ROZSZERZENIE NA WYRAŹNE ŻĄDANIE UŻYTKOWNIKA — pełny, systematyczny mechanizm weryfikacji przesłanek zarzutów karnych i dyscyplinarnych): LEGAL-ELEMENT-MATCH-CHECK z audytu 3.8 rozbudowany z pojedynczej, wyrywkowej obserwacji do PRZESŁANKI-GATE — obowiązkowego, ustrukturyzowanego przeglądu KAŻDEJO zarzutu karnego (art. KK) lub podstawy zwolnienia dyscyplinarnego/kary porządkowej (art. 52 KP, art. 108-109 KP) pojawiającego się w dokumencie skierowanym przeciwko Panu. Mechanizm: (1) zidentyfikuj każdą przywołaną podstawę prawną, (2) zweryfikuj JEJ USTAWOWE ZNAMIONA/ PRZESŁANKI przez ISAP/orzecznictwo (PRAWO-HARDGATE — zakaz z pamięci), (3) zestaw każdą przesłankę z tym, co KONKRETNIE opisano w dokumencie na jej poparcie, (4) zwróć wynik w formie tabeli: podstawa prawna | wymagana przesłanka | co dokument podaje na jej poparcie | ocena (spełniona / niespełniona / brak opisu w dokumencie) | uwaga, (5) sformułuj wniosek zbiorczy, czy zarzut ma pełne pokrycie w opisanych faktach. Wykonywane automatycznie przy PIERWSZEJ analizie takiego dokumentu, jako osobna, ustrukturyzowana odpowiedź — nie tylko wplecione pojedynczym zdaniem w szerszą analizę.

- 3.8 (AUDYT JAKOŚCI ANALIZY — ta sama sesja, druga retrospektywa, tym razem skupiona na TREŚCI analizy merytorycznej, nie na procesie): pięć mechanizmów dodanych: (1) FOUNDATION-VERIFICATION-GATE — przed zaproponowaniem teorii kryminalistycznej/stylistycznej/technicznej o dokumencie (np. artefakt tłumacza, język interfejsu) należy NAJPIERW sprawdzić, czy ten sam wzorzec występuje też w innych dostępnych dokumentach oraz czy dokument spełnia strukturalny warunek konieczny dla danej metody (np. czy to w ogóle odpowiedź, a nie samodzielna wiadomość) — dopiero potem przedstawiać teorię jako obiecującą; (2) EXHAUSTIVE-EXTRACTION-GATE — przy przeszukiwaniu archiwum/zbioru dokumentów pod kątem 'wszystkich przypadków X', budować pełną listę ze WSZYSTKICH trafień, nie tylko pierwszych/najbardziej oczywistych — z jawnym policzeniem trafień przed prezentacją wyniku; (3) IMMEDIATE-LOGICAL-SCAN — przy pierwszym czytaniu każdego dostarczonego dokumentu, proaktywnie skanować pod kątem wewnętrznych sprzeczności logicznych/czasowych (np. zachowanie opisane jako 'systematyczne' przypisane do jednej daty), zamiast czekać na pytanie naprowadzające użytkownika; (4) LEGAL-ELEMENT-MATCH-CHECK — gdy dokument zarzuca Panu czyn zabroniony, przy pierwszym czytaniu sprawdzić, czy opisane zachowanie faktycznie wypełnia znamiona cytowanego przepisu, nie tylko zacytować przepis; (5) ENTITY-DISAMBIGUATION-TABLE — przy występowaniu w sprawie więcej niż jednego powiązanego podmiotu prawnego (różne NIP, nazwy), prowadzić i proaktywnie aktualizować tabelę przypisania dokumentów do podmiotów. Przyczyny: teoria o 'Ogrodzie zoologicznym' jako śladzie tłumacza zbudowana przed sprawdzeniem czy błąd występuje gdzie indziej (występował, co osłabiło tezę); technika weryfikacji języka interfejsu Gmaila zaproponowana dla maila, który nie był odpowiedzią (więc technika nie mogła zadziałać) — sprawdzone dopiero po pytaniu użytkownika; przeszukanie archiwum ZIP ujawniło tylko 3 z 5 obecnych w tym samym akapicie przypadków zwrotu środków, resztę (Sharma, Amit Shrestha) odkrył dopiero użytkownik dwoma osobnymi pytaniami; sprzeczność 'systematyczne/notoryczne w jednym dniu' w upomnieniu zauważona dopiero na pytanie użytkownika, mimo że wymagała tylko analizy już posiadanego tekstu; błędna kwalifikacja czynu z art. 191 §1 KK (żądanie zwrotu należności opisane jako groźba bezprawna) nie zasygnalizowana od razu przy pierwszej analizie pisma z 7.10.2024.

- 3.7 (AUDYT RETROSPEKTYWNY — pełna sesja Wiatrak/Human Park Global, wieloetapowe przesłuchanie Koroleva/Park, wielokrotne rundy korekty pytań): sześć luk zamkniętych na podstawie analizy całej sesji: (1) FACT-CROSS-CHECK-GATE — każde pytanie zawierające twierdzenie o treści dokumentu ('dokument nie zawiera X') musi być zestawione z faktyczną treścią dokumentu dostępną w rozmowie PRZED oceną pytania, nie po fakcie na żądanie użytkownika; (2) LEGAL-TIMING-GATE — przed zbudowaniem argumentu opartego na ochronie ustawowej (sygnalista, terminy KP itp.) należy NAJPIERW ustalić dokładną datę zdarzenia, a dopiero potem oceniać zastosowanie przepisu w czasie — nie odwrotnie; (3) CROSS-DOCUMENT-CONSISTENCY-CHECK — każdy nowy dokument dowodowy wgrany w toku tej samej sprawy jest automatycznie zestawiany z wcześniej ustalonymi faktami/datami/kwotami w tej rozmowie, z jawnym wskazaniem rozbieżności; (4) QUOTE-VERIFICATION-DEFAULT — każdy cytat proponowany do użycia w pytaniu wobec świadka jest weryfikowany słowo-w-słowo względem źródła w momencie jego zaproponowania, nie dopiero na wyraźne życzenie użytkownika; (5) REVISION-DIFF-CHECK — gdy użytkownik przesyła pełną, zaktualizowaną wersję wcześniej ocenianego zestawu pytań, ocena zaczyna się od jawnego zestawienia z poprzednio zatwierdzoną wersją (co naprawiono / co się cofnęło / co nowe), a nie od pełnej ponownej analizy od zera; (6) AUTO-RENUMBER-OFFER — przy wykryciu duplikującej się numeracji w zestawie pytań, zamiast samego flagowania problemu, oferowane jest natychmiastowe przenumerowanie całości na jedną ciągłą sekwencję. Przyczyny: w toku sesji nieścisłe twierdzenie o treści dokumentu trafiło do zaakceptowanego pytania i zostało wykryte dopiero na żądanie użytkownika; obiecująca teoria prawna (ochrona sygnalisty) została zbudowana przed ustaleniem daty, co wymagało późniejszego wycofania się; rozbieżność dat (23.08 vs 23.09 dla tej samej osoby w dwóch dokumentach) została wykryta przypadkowo, nie systemowo; cytaty z pism wymagały potwierdzenia na wyraźną prośbę użytkownika; te same niedociągnięcia (duplikacja numeracji, nieprecyzyjne pytanie o brak dat) powracały nienaprawione w kolejnych, w pełni odtwarzanych od zera ocenach.

- 3.6 (AUDYT NAPRAWCZY — sesja Wiatrak/Human Park Global): cztery luki zamknięte na podstawie audytu na żywym przypadku: (1) GATE-DEFAULT-NOW — QUESTION-ADMISSIBILITY-GATE i WHY-GATE stosowane OBOWIĄZKOWO przy pierwszym wygenerowaniu pytań, nie tylko na żądanie oceny post factum; (2) IMPORTED-QUESTIONS-GATE — gdy użytkownik dostarcza gotowy blok pytań (nie budowany od zera w W1-W2), wymagana rekonstrukcja tezy jednym zdaniem dla KAŻDEGO pytania przed jego zaakceptowaniem lub poprawą; brak dającej się zrekonstruować tezy = automatyczny BLOK E; (3) DOCUMENT-SCAN-PROMPT — przy każdym nowo wgranym dokumencie z elementami odręcznymi/graficznymi obowiązkowe jednozdaniowe zapytanie użytkownika, czy są tam nieoczywiste elementy (dopiski, skreślenia, poprawki, nieczytelne fragmenty) do zbadania, zamiast czekać na inicjatywę użytkownika; (4) TEZY-DOWODY-SWIADEK-GATE — obowiązkowe pytanie (jeśli nie wynika wprost z materiałów) o maks. 3 tezy do wykazania, posiadane dowody na ich poparcie oraz tożsamość i rolę świadka, zanim rozpocznie się generowanie jakichkolwiek pytań. Przyczyna: w sesji audytowej pytania ryzykowne (WHY-pytania, założenia nieudowodnionych faktów, prośby o spekulację) trafiły do finalnej listy i zostały wykryte dopiero na wyraźne żądanie oceny 0-10, kluczowy dowód (odręczne przekreślenie na upomnieniu) ujawnił się dopiero po pytaniu użytkownika zamiast w toku systematycznej ekstrakcji dokumentu, a tezy/dowody/rola świadka były przyjmowane milcząco zamiast jawnie potwierdzane.

- 3.5: CHECKPOINT-W2 — obowiązkowa pauza po W2 przed generowaniem pytań W3; W4 PRÓBA GENERALNA — lista kontrolna przed rozprawą (Wagner 2024); W5 BINDER SĄDOWY — instrukcja nawigacji dokumentami na sali; W6 SŁUCHANIE DIRECT — etap adaptacji pytań po zeznaniach na wprost (Davis/NACDL, Rev 2026, Ohio Bar 2025). Dwie-wiadomości-per-etap jako reguła systemowa: ekstrakcja+tezy → CHECKPOINT → pytania.

- 3.4: Moduł WITNESS-INTELLIGENCE (pre-W1): pełna faza przygotowawcza — KROK I profil świadka (dane, relacje, historia procesowa, zachowanie); KROK II mapa wiedzy (bezpośrednia/proceduralna/ze słyszenia/wykluczona); KROK III ekstrakcja dokumentacyjna (autorstwo/skierowane/CC/cytaty); KROK IV preparation chart per temat (fakty+źródło+pytanie+sprzeczności); KROK V ocena wstępna zasilająca W1/W2/W3. Integracja: FPW-1 z dok_id+strona. Metodyka: Wagner/Taft 2024, Pozner & Dodd 4th ed., Filevine 2024.

- 3.3: Trzy zamknięte luki vs literatura ekspercka (Pozner & Dodd, Gray's Inn): (1) FPW pipeline (FAKT→PRAWO→WNIOSEK) jako obowiązkowa bramka W3; (2) Taksonomia ryzyka 3-wymiarowa: RYZYKO-KONTROLA / RYZYKO-ODPOWIEDŹ / RYZYKO-KUMULACJA z dedykowanymi procedurami per podtyp; (3) Twardy zakaz WHY-QUESTIONS w trybie cross (ONE-FACT/świadek wrogi) jako CRIT; reguła SAFE-Q dla pytań bez dowodu kontrolnego; reguła KNOW-WHEN-TO-STOP z sygnałami STOP w BLOKU C.

- 3.2 (ZIP niezaszyty): FPW pipeline — KROK 0 kontekstu poprzedniej sesji; FPW-RISK auto-kwalifikator do BLOKU E; zakaz VER bez web_search = CRIT

- 3.1: KROK 0 — wczytanie kontekstu sprawy z KROK 3B analizator-dowodow-v3 lub z pliku kontekstu sesji (MOD-KONTEKST-SESJI §4 TRYB IMPORT); mapowanie aspektów głównych/pobocznych → tezy; zatwierdzone dowody → blok B pytań; ostrzeżenia krzyżowe (HARDGATE-SD-01/02) → blok E (tematy zakazane z uzasadnieniem); wyniki MET-ACH/CA/NET/COMP/FTL → blok D (sprzeczności/ looping); chronologia wstępna → materiał do loopingu dat

---

## ARCHIWUM — wpisy przeniesione z `CHANGELOG.md` w katalogu głównym (2026-08-20z, F-101)

> ⛔ **Powód przeniesienia:** skill miał DWA równoległe changelogi o ROZŁĄCZNYCH
> zbiorach wpisów. `CHANGELOG.md` w katalogu głównym zawierał v3.15, v3.14, v2.90
> i część v3.1-3.5, których NIE BYŁO w tym pliku; ten plik zawierał 3.19-3.16
> i 3.13-3.1, których nie było tam. **Żaden z dwóch nie był kompletny**, a F-78
> (2026-08-20) uznał ten plik za kanoniczny, nie ruszając drugiego. Poniżej treść
> tamtego pliku przeniesiona 1:1; plik w katalogu głównym usunięty, żeby rozjazd
> nie mógł się odtworzyć. Wpisy mogą częściowo pokrywać się tematycznie z listą
> powyżej — zachowano OBA zapisy zamiast rozstrzygać, który jest wierniejszy.

## v3.15 — 2026-07-12b (AUDYT SYSTEMU — CRIT: MOD-DESCRIPTION przekroczony)

- **CRIT naprawiony:** pole `description` w SKILL.md przekroczyło twardy limit
  1024 znaków (osiągnęło 1151 po dodaniu WITNESS-SCOPE-LOCK w v3.14) — zgodnie
  z `audyt-systemu-v4/modules/MOD-DESCRIPTION.md` przekroczenie >1024 znaków
  to CRIT (grozi bezciszym obcięciem description w UI).
- Skrócono description do 870 znaków (strefa ✅ OK, ≤900) — skonsolidowano
  trzy oddzielne linie HARD GATE w jedną, skrócono opis etapów pipeline'u
  (usunięto powtórzenia typu "sądowy"/"i adaptacja"), zachowano wszystkie
  triggery wywołania, numer wersji i kluczowe ograniczenia, zgodnie z
  "Procedurą naprawy (CRIT)" z MOD-DESCRIPTION.md.
- Przyczyna: przy dodawaniu WITNESS-SCOPE-LOCK w v3.14 nie zweryfikowano
  długości description po edycji frontmatter.
- `version: "3.14" → "3.15"`.

## v3.14 — 2026-07-12 (AUDYT SYSTEMU — na wyraźne wskazanie użytkownika po błędzie sesji)

- Dodano **WITNESS-SCOPE-LOCK** (nowa sekcja w ETAP W1, zaraz po
  TEZY-DOWODY-SWIADEK-GATE). HARD GATE: zakaz dołączania do W2/W3 osoby
  niepotwierdzonej wprost jako przesłuchiwanego świadka tylko dlatego, że
  występuje w tych samych materiałach co świadek już ustalony (np. drugi
  reprezentant strony przeciwnej, współsygnatariusz tego samego pisma).
- Wymaganie: jeśli z materiałów/kontekstu rozmowy nie wynika jednoznacznie,
  kto konkretnie ma być przesłuchiwany, a w dokumentach występuje więcej niż
  jedna możliwa osoba — model musi zapytać wprost o zamkniętą listę
  świadków, zanim powstanie choćby jedno pytanie. Chęć bycia "wyczerpującym"
  nie jest wyjątkiem od tej zasady.
- Dodano test regresyjny w `tests/REGRESSION-CASES.md` (sprawa pracownicza,
  dwóch reprezentantów pozwanej spółki w materiałach, przesłuchiwana tylko
  jedna z nich).
- Przyczyna: w sesji roboczej model przygotował pytania dla dwóch osób
  (Prezes Zarządu + Dyrektor generalna spółki pozwanej), mimo że z
  materiałów i kontekstu rozmowy jednoznacznie wynikało, iż przesłuchiwana
  ma być tylko jedna z nich (autorka najbardziej spornej, najświeższej
  korespondencji). Błąd polegał na milczącym rozszerzeniu zakresu świadków
  zamiast potwierdzenia go z użytkownikiem.
- Zaktualizowano: frontmatter `description` (dodany HARD GATE
  WITNESS-SCOPE-LOCK), sekcję "Zakaz" (nowy punkt z odesłaniem do gate'u),
  `version: "3.12" → "3.14"` (3.13 zarezerwowane przez wcześniejszy audyt
  tej samej daty roboczej — SD-VER/OCR, patrz wpis niżej).
- **OUTPUT-COMPLETENESS**: naprawa dostarczona jako pełny, zsynchronizowany
  skill (SKILL.md + CHANGELOG.md + tests/REGRESSION-CASES.md), zgodnie z
  ZASADĄ 7 z `audyt-systemu-v4`.

## v3.13 — 2026-07-11 (AUDYT SYSTEMU)

- Dodano etap **PRE-W1a-SD-VER** jako TWARDĄ, BEZPOŚREDNIĄ zależność od
  `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` (wcześniej tylko pośrednio przez
  `analizator-dowodow`, więc pomijalna). HARD GATE: zakaz wejścia do
  KROK-PRE-W1-INTELLIGENCE bez SD-VER = KOMPLET.
- Dodano jawny, bezwarunkowy wymóg OCR (`pdftoppm` + `tesseract -l pol`)
  dla każdego pliku PDF bez warstwy tekstowej, przed budową tez/pytań.
- Zintegrowano `shared/MOD-STEP-TRACKER.md` z pipeline'em świadka — 11 nowych
  pozycji rejestru (SW-PRE-W1a…SW-W6), raportowanie pominięć natychmiastowe.
- Dodano **DOCUMENT-REFERENCED-NOT-FOUND-GATE** (PRE-W1a.4): dokument
  wzmiankowany w zeznaniu/protokole, nieobecny w materiale → oznaczenie
  `⬛ DO WERYFIKACJI` zamiast milczącego pominięcia lub mylnego utożsamienia
  z innym dokumentem.
- Przyczyna: w sesji roboczej pominięto skanowanie 130 stron trzech
  zeskanowanych plików akt osobowych świadka i pomylono odręczny dopisek
  na upomnieniu z odrębną notatką służbową, której istnienia nie
  zweryfikowano w materiale.
- Powiązane zmiany: `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` v1.4.0,
  `shared/MOD-STEP-TRACKER.md` v1.1.0.

## v3.1 — 2026-06-03

- Dodano PRAWO-HARDGATE jako pierwsze `required_gate` w YAML frontmatter.
- Dodano blok `⛔ HARD GATE` na początku treści SKILL.md (po tytule i Celu).
- Rozbudowano `QUESTION-ADMISSIBILITY-GATE.md` o katalog zakazów dowodowych
  KPC/KPK/KPW/KPA z procedurą weryfikacji ISAP i wzorcem zapisu pola DOPUSZCZ.
- Rozbudowano `CROSS-EXAMINATION-GATE.md` o protokół sprzeczności z HARDGATE-check
  i self-check przed kontrprzesłuchaniem.
- Dodano nowy plik `references/PRAWO-HARDGATE-WITNESS.md` — katalog 4 obszarów
  prawnych specyficznych dla przesłuchań (dopuszczalność pytań, ocena dowodów,
  terminy, orzecznictwo) z procedurą weryfikacji przy generowaniu pytań.
- Rozbudowano `WITNESS-SCORING.md` o wpływ zakazów dowodowych na scoring
  z HARDGATE-check przy przepisach ograniczających.
- Zaktualizowano sekcję Zakaz w SKILL.md o zakaz podawania podstaw prawnych
  z pamięci.

# CHANGELOG

## v2.90

- Scalono najlepsze cechy trzech paczek.
- Zachowano text-first jako domyślny tryb.
- JSX tylko na wyraźne żądanie.
- Usunięto zależność od `local BlueprintPreview component path`.
- Dodano pełne typologie świadków.
- Dodano pełne typologie sędziów.
- Dodano macierz świadek × sędzia.
- Dodano testy regresji i policy UI.

## v3.3 — 2026-06-18

- **TAKSONOMIA RYZYKA 3-WYMIAROWA** — kategoria "ryzykowne" rozbita na:
  - `RYZYKO-KONTROLA`: pytania otwarte/WHY przy wrogim świadku — utrata narracji
  - `RYZYKO-ODPOWIEDŹ`: odpowiedź NIE aktywnie szkodzi tezie (FPW-RISK)
  - `RYZYKO-KUMULACJA`: pytanie w sekwencji otwiera niekorzystną narrację
  Każdy podtyp ma dedykowaną procedurę w QUESTION-ADMISSIBILITY-GATE.md.

- **WHY-GATE** — twardy zakaz (CRIT) pytań "dlaczego/po co/w jakim celu"
  przy modelu ONE-FACT lub świadku wrogim/strony przeciwnej.
  Źródło: Pozner & Dodd + Gray's Inn (2024) — "WHY is the dumbest question".
  Wyjątek: świadek lojalny / model PEACE / LEJEK.

- **FPW PIPELINE** (wdrożone do produkcji z v3.2-ZIP):
  FPW-1 (fakt + źródło) → FPW-2 (przepis + VER ISAP) → FPW-3 (TAK/NIE + klasyfikacja).
  Zakaz oznaczania ✅ VER bez web_search/web_fetch = CRIT.
  Bramka obowiązkowa dla każdego pytania W3.

- **REGUŁA SAFE-Q** — aktywowana gdy DOWÓD KON. = brak.
  Wymusza przeformułowanie zamykające oba wyjścia dla świadka lub BLOK E.

- **SYGNAŁY STOP** (KNOW-WHEN-TO-STOP) — dodane do BLOKU C i
  QUESTION-ADMISSIBILITY-GATE: STOP-1 (ustępstwo), STOP-2 (narracja szkodliwa),
  STOP-3 (zmiana postawy), STOP-4 (cel osiągnięty).
  Źródło: Gray's Inn (2024) — "Know when to stop, never one question too many".

- **QUESTION-ADMISSIBILITY-GATE.md** — całkowity rewrite v3.3:
  pipeline FPW, taksonomia 3D, WHY-GATE, SAFE-Q, KNOW-WHEN-TO-STOP,
  tabela zbiorcza klasyfikacji, kompletny wzorzec macierzy.

- **SKILL.md** — zaktualizowano: bramka W3, BLOK C sygnały STOP, sekcja Zakaz
  (4 nowe pozycje), W2 adnotacja FPW, changelog YAML.

## v3.4 — 2026-06-18

- **WITNESS-INTELLIGENCE** — nowy moduł `references/WITNESS-INTELLIGENCE.md`
  (327 linii). Pełna faza przygotowawcza pre-W1 w 5 krokach:
  - KROK I: profil świadka — dane, relacje (interes/powiązania/zmiany po sporze),
    historia w postępowaniu (wszystkie zeznania), profil zachowania
  - KROK II: mapa wiedzy — 4 typy: BEZPOŚREDNIA / PROCEDURALNA / ZE SŁYSZENIA /
    WYKLUCZONA; wiedza wykluczona = zakaz pytań otwartych (RYZYKO-KONTROLA)
  - KROK III: ekstrakcja dokumentacyjna — dokumenty autorstwa świadka,
    skierowane do świadka, CC/BCC, cytaty z zeznań (verbatim + kwalifikacja),
    fakty o świadku z innych źródeł
  - KROK IV: preparation chart per temat — fakty + dok_id + strona + cytat +
    pytanie ONE-FACT + zagrożenia + kontrowania + sekwencja 3-pytań dla
    sprzeczności; 8-10 tematów, 4-6 do użycia
  - KROK V: ocena wstępna z podsumowaniem zasileń W1/W2/W3
  Metodyka: Wagner/Taft Law 2024, Pozner & Dodd 4th ed. (2024), Filevine 2024.

- **FACT-EVIDENCE-MAPPING.md** — rozszerzony format v3.4: dok_id + strona jako
  obowiązkowe pola; indeks do preparation chartów.

- **SKILL.md** — dodano KROK PRE-W1 jako sekcję przed KROK 0; aktualizacja
  pipeline stages i validation gates; zakaz pomijania pre-W1 gdy są dokumenty.

## v3.5 — 2026-06-18

- **REGUŁA DWÓCH WIADOMOŚCI** — wiadomość 1: PRE-W1 + W1 + W2 (profil, tezy,
  scoring, model) + CHECKPOINT; wiadomość 2: W3 pytania (dopiero po akceptacji
  użytkownika). Wyjątek: jawne żądanie kompletnego zestawu od razu.
  Źródło: Wagner 2024 — trzy oddzielne kroki przed konspektem rozdziałów.

- **CHECKPOINT-W2** — obowiązkowa pauza po W2 z podsumowaniem (świadek, typ,
  scoring, model, tezy, sprzeczności, tematy zakazane, luki) i pytaniem do
  użytkownika. System nie generuje W3 bez potwierdzenia ("OK"/"kontynuuj").

- **ETAP W4 — PRÓBA GENERALNA** — lista kontrolna przed rozprawą: selekcja
  4-6 rozdziałów z 8-10, kolejność PRIMACY/RECENCY, weryfikacja fizycznych
  lokalizacji dowodów, "clap-back" na 3 odpowiedzi wymijające, STOP-4 per
  rozdział, model awaryjny. Źródło: Wagner (Taft Law 2024).

- **ETAP W5 — BINDER SĄDOWY** — instrukcja do użycia na sali: 5-zakładkowa
  struktura z macierzą finalną, preparation chart, dokumentami kontrolnymi
  (dok_id → zakładka fizyczna), blokiem D i modelem awaryjnym. Nawigacja
  na sali bez szukania dokumentów. Źródło: Pozner & Dodd 4th ed. (2024).

- **ETAP W6 — SŁUCHANIE DIRECT** — etap w trakcie rozprawy: notowanie
  dosłownych sformułowań, klasyfikacja per rozdział (ZIELONY/ŻÓŁTY/CZERWONY),
  decyzja co usunąć/dodać, weryfikacja FPW-3 przed pytaniem improwizowanym,
  review bindera przed cross. Źródło: Davis (NACDL), Rev (2026), Ohio Bar (2025).

- **SKILL.md** — pipeline stages rozszerzone o CHECKPOINT-W2, W4, W5, W6.
  Zakaz w sekcji Zakaz: nie generuj W3 bez CHECKPOINT-W2.

## v3.5 — AUDIT-2026-06-18 (post-audit patch)

- **CRIT-1 naprawiony**: pseudo-ścieżka `.../references/WITNESS-INTELLIGENCE.md`
  → `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md`
- **CRIT-2 naprawiony**: pseudo-ścieżka `.../references/QUESTION-ADMISSIBILITY-GATE.md`
  → pełna ścieżka kanoniczna
- **MANIFEST.md**: wildcard `references/*` zastąpiony explicit listą 7 plików
  (WITNESS-INTELLIGENCE.md dodany)
- **Description**: zaktualizowany do v3.5 (pipeline PRE-W1→W6, CHECKPOINT-W2,
  FPW, taksonomia ryzyka 3D, WHY-GATE, SAFE-Q, W4-W6)
- **SCORING po audycie**: 8.0/10 ✅ ZIELONY
  Pozostały CRIT: ścieżka WITNESS-INTELLIGENCE.md nieistniejąca w produkcji
  (zostanie rozwiązana po wgraniu tego skilla — CRIT pre-deploy, nie błąd pliku)

---

## LUKA JAWNA — wersje 3.20, 3.21, 3.22 (odnotowane 2026-08-20z, F-101)

`version: "3.22"` widniało w YAML bez ANI JEDNEGO wpisu opisującego zmiany
3.20 → 3.21 → 3.22 — ani w tym pliku, ani w polu `changelog`, ani w
`AUDIT-JOURNAL.md`. Historii tych trzech numerów **nie da się odtworzyć**
z materiału dostępnego w systemie. Odnotowane wprost jako luka, zamiast
zostawiać ciszę, która przy kolejnym audycie wygląda jak kompletny rejestr.

## 3.23 (2026-08-20z) — wydzielenie bramek dokumentowych, podłączenie typologii, usunięcie balastu poscaleniowego

- **F-100 (A) — 8 bramek pracy na dokumentach wydzielone do
  `shared/MOD-DOKUMENT-GATES.md`** (§1 DOCUMENT-SCAN-PROMPT, §2
  FOUNDATION-VERIFICATION-GATE, §3 EXHAUSTIVE-EXTRACTION-GATE, §4
  IMMEDIATE-LOGICAL-SCAN, §5 CROSS-DOCUMENT-CONSISTENCY-CHECK, §6
  ENTITY-DISAMBIGUATION-TABLE, §7 EVIDENCE-THREAD-LINKING, §8
  QUOTE-VERIFICATION-DEFAULT). Treść przeniesiona **bajtowo, bez zmiany ani
  jednego zdania** — potwierdzone testem porównawczym przed dostawą. W SKILL.md
  zostały indeksy wyzwalaczy (nazwa + aktywacja + obowiązek w jednym zdaniu),
  wystarczające do ROZPOZNANIA aktywacji, ale nie do wykonania bramki.
- **Nowy HARD GATE `PRE-W1a.5 — DG-LOAD`:** wczytanie kanonu jest osobnym,
  twardym krokiem pipeline'u, gdy w sprawie jest jakikolwiek dokument.
  Uzasadnienie: historia napraw 3.6/3.17/3.18 dowodzi, że bramka opisana samą
  prozą bywa pomijana do momentu, aż użytkownik zapyta wprost — samo odesłanie
  byłoby więc regresem. Dodatkowo osiem bramek trafiło do
  `validation.required_gates` (`DOKUMENT-GATES-1-8`), gdzie ich **wcześniej
  w ogóle nie było** — formalnie skill jest po tej zmianie MOCNIEJ zabezpieczony
  niż przed nią.
- **F-99 — naprawiona luka zdolności deklarowanej:** dodano `TYPOLOGIE-LOAD`
  (etap W2, KROKI T1-T4) wczytujący `witness-types.yaml`, `judge-types.yaml`
  i `witness-judge-matrix.md`. Te trzy pliki były w pakiecie od początku, ale
  ŻADEN krok pipeline'u ich nie ładował (`grep` = 0), mimo że `description`,
  „Kiedy używać" i pole „Prawdopodobny typ sędziego" deklarowały dobór stylu
  do typu sędziego — zdolność działała na improwizacji zamiast na taksonomii.
  Wynik T1-T3 wchodzi teraz do CHECKPOINT-W2, więc użytkownik akceptuje również
  dobór typów, nie tylko tezy i model.
- **F-99 — usunięty balast poscaleniowy jsxfix1+jsxfix2** (7 plików):
  `reports/SOURCE-INVENTORY.json` (506 linii inwentarza plików z pakietów, które
  nie istnieją), `reports/FIX-REPORT.md`, `reports/MERGE-REPORT.md`,
  `reports/STATIC-CHECKS.json`, `docs/USAGE.md` (3 linie duplikujące sekcję
  „Tryb graficzny"), `components/README.md` (opis pustego folderu),
  `CHANGELOG.md` w katalogu głównym (scalony tutaj — patrz wyżej).
  ⚠️ Ostrzeżenie z `components/README.md` (zakaz twardych importów komponentów
  w JSX) NIE zostało utracone — przeniesione do `MANIFEST.md` i `README.md`.
- **README.md** przepisany z historii scalania na opis operacyjny;
  **MANIFEST.md** doprowadzony do stanu faktycznego (był rozjechany:
  wymieniał usunięte pliki, pomijał `references/CHANGELOG.md`).
- Zachowane bez zmian: `rules/`, `schemas/`, `examples/`, `integration/`,
  `templates/`, `tests/`, `assets/*.jsx` — nieprzywoływane z SKILL.md, ale
  to interfejsy dla runnera portalu i materiał do trybu graficznego, nie balast;
  usunięcie mogłoby zerwać działającą integrację, której nie widać z poziomu
  plików `.md`. Pozostają udokumentowane w MANIFEST jako pliki pomocnicze.
- `version: "3.22" → "3.23"`. Pełny opis sesji:
  `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z`.

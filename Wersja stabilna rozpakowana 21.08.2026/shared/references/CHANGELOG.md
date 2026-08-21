# CHANGELOG — Biblioteka shared

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 3.18 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Pole `changelog:` w YAML zawierało 111 linii pełnej historii — najdłuższy taki
przypadek w systemie. Wyniesione 1:1 do nowo utworzonego `references/CHANGELOG.md`;
w YAML został kilkulinijkowy skrót.

**Standard systemowy wprowadzony tego dnia:** pełna historia zmian każdego skilla
mieszka w `references/CHANGELOG.md` — nigdy w sekcji `## CHANGELOG` korpusu SKILL.md
i nigdy jako pełna lista wpisów w polu `changelog:` frontmatteru. W SKILL.md zostaje
wyłącznie kilkulinijkowy skrót bieżącej wersji z odesłaniem do tego pliku.

**Dlaczego to nie jest kosmetyka:** rozproszenie historii między trzy lokalizacje było
BEZPOŚREDNIĄ przyczyną fałszywych wyników testu T12 w sesji 2026-08-20z3 — test szukał
wpisów w `references/`, nie znajdował ich (bo leżały w SKILL.md) i raportował luki,
których nie było. Jedna lokalizacja kanoniczna usuwa całą tę klasę błędu.
Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z4`.

---

## HISTORIA PRZENIESIONA Z SKILL.md (2026-08-20z4, ujednolicenie standardu)

> Poniższa treść pochodzi z pola `changelog:` we frontmatterze SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

changelog:
  - "3.17 (2026-08-20z): NOWY PLIK KANONICZNY `MOD-DOKUMENT-GATES.md` — osiem bramek
    pracy na dokumentach (DOCUMENT-SCAN-PROMPT, FOUNDATION-VERIFICATION-GATE,
    EXHAUSTIVE-EXTRACTION-GATE, IMMEDIATE-LOGICAL-SCAN, CROSS-DOCUMENT-CONSISTENCY-CHECK,
    ENTITY-DISAMBIGUATION-TABLE, EVIDENCE-THREAD-LINKING, QUOTE-VERIFICATION-DEFAULT)
    wydzielonych z `przesluchanie-swiadkow-v2-min90`, gdzie stanowiły jedyną kopię
    w całym systemie — mimo że dotyczą pracy na dokumentach, nie na świadku.
    Konsumenci: skill przesłuchań (PRE-W1a.5 DG-LOAD) i `analizator-dowodow-v3`
    (KROK 0d DG-LOAD — dla tego drugiego to NOWA ZDOLNOŚĆ, wcześniej niedostępna).
    Treść przeniesiona bajtowo, weryfikacja porównawcza przed dostawą. Zarejestrowane
    w tabeli 'Zawartość katalogu' tego pliku ORAZ w DEPENDENCY-GRAPH.md (REGUŁA 2 —
    bez obu wpisów powstałby plik-sierota, wzorzec F-80). Flaga F-100 (A).
    Przy okazji: pole `version` ujęte w cudzysłów po wykryciu pułapki float testem T12."
  - "3.16 (2026-08-18): SKRÓCENIE POLA `description` we frontmatterze — 1172 → 302
    znaków. Poprzednia wersja wyliczała w opisie wyzwalającym całą zawartość
    biblioteki (PRAWO-HARDGATE, HYBRID-VALIDATION, INTAKE-GAP, MOD-WALIDACJA_v2,
    FSL, LSL, terminy, FAKTY, MOD-STEP-TRACKER, MOD-REJESTR-POKRYCIA-JEDNOSTEK,
    DEFINICJE-KLUCZOWE z listą 9 plików definicje/, mod-niewidomy-prawa-prawne),
    co (a) przekraczało limit długości description i groziło ucięciem opisu przy
    ładowaniu, (b) duplikowało tabele 'Zawartość katalogu' w treści pliku,
    (c) rozmywało jedyny komunikat, który w tym opisie jest istotny: shared NIE
    jest skillem wyzwalanym zapytaniem użytkownika. Nowy opis mówi czym jest
    biblioteka, że nie triggeruje się sama, i kieruje po spis do treści pliku.
    PRZENIESIONE (nie usunięte) do tabeli w sekcji 'Zawartość katalogu':
    DEFINICJE-KLUCZOWE.md i mod-niewidomy-prawa-prawne.md — jako jedyne dwa
    moduły z dawnego description NIEOBECNE dotąd w żadnej tabeli treści.
    PRZY OKAZJI skorygowano liczebność: definicje/ zawiera 10 plików, nie 9
    (pominięty był DEF-INTERES-WLASNY-WYLACZENIA.md). Zmiana dotyczy wyłącznie
    frontmattera i tabeli SKILL.md — ŻADEN plik kanoniczny modułu nie ruszony,
    więc promień rażenia zerowy (patrz limitations)."
  - "3.15 (2026-08-18): NOWY MODUŁ — MOD-REJESTR-POKRYCIA-JEDNOSTEK.md (RPK),
    w odpowiedzi na incydent pominięcia kazusów 100, 140, 148 w sesji
    160-elementowej (rozwiązywanie kazusów cywilnych). Rejestr plikowy
    (przetrwa kompaktowanie sesji) pokrycia zbiorów ≥10 ponumerowanych
    jednostek roboczych — komplementarny do MOD-STEP-TRACKER.md (który
    śledzi kroki WEWNĄTRZ jednego pipeline'u, nie pokrycie WIELU
    równorzędnych jednostek). Cztery statusy (DO_ZROBIENIA/ZWERYFIKOWANE/
    POKRYTE/WYMAGA_WERYFIKACJI), kontrola ciągłości numerycznej przed
    każdą partią, obowiązkowy commit po partii, procedura po
    kompaktowaniu, raport końcowy generowany programistycznie z pliku
    zamiast z pamięci modelu. Skille wskazane jako konsumenci (propagacja
    OTWARTA, patrz WARN-OTWARTE.md): prawny-router-v3, analizator-przepisow-v2,
    analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90,
    chronologia-sprawy-v1, audyt-systemu-v4. Pełny opis: AUDIT-JOURNAL.md
    AUDYT-2026-08-18."
  - "2.7 (2026-07-12, audyt komercyjny silnika, punkty 1-2 + zamknięcie
    duplikatów): ci_check_shared.py (audyt-systemu-v4/scripts/) wykrył 4
    nieudokumentowane duplikaty bajtowe — wszystkie scalone: NAZEWNICTWO-STRON.md
    (kanoniczny już istniał, analizator-dowodow-v3 przekierowany), nowe pliki
    kanoniczne STALKING-NEKANIE.md i PRZESLUCHANIE-SWIADKOW-KPC.md (przeniesione
    z dr-03/dr-16 + prawny-router-v3/references/, oba konsumowane przez ≥2
    lokalizacje). Przy okazji naprawiono DEDUPLICATION-POLICY.md: 9 z 10 plików
    zadeklarowanych jako 'usunięte 2026-06-13' wciąż leżało na dysku — usunięte
    naprawdę teraz. Dodano shared/tools/ — walidator_cytowan.py, deterministyczna
    bramka weryfikacji cytowań poza LLM, uruchamiana przez portal przed
    present_files (nie audyt-systemu-v4 — to narzędzie produkcyjne, nie
    deweloperskie). Pełny opis: AUDIT-JOURNAL.md AUDYT-2026-07-12g,
    CHECKLIST-DEDUP.md NOTA-12/13/14."
  - "2.6 (2026-07-12, runda 2): ZAMKNIĘTE — WARN 'numer wersji vs nazwa
    pliku' z MOD-DOKUMENT-ANOMALIE (otwarty w 2.5). Plik przemianowano z
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md na MOD-DOKUMENT-ANOMALIE_v1.1.0.md, żeby
    nazwa fizyczna zgadzała się z deklarowaną w treści wersją 1.1.0.
    Zweryfikowano całą bazę (grep całego /mnt/skills/user/) — tylko dwa
    miejsca odwoływały się do tego pliku po pełnej ścieżce z rozszerzeniem:
    pisma-procesowe-v3/references/MODULY-MAPA.md i
    pisma-procesowe-v3/references/AUTOMAT-STANOW.md — oba zaktualizowane.
    Pozostałe wzmianki w systemie (shared/CP-GATE.md,
    shared/MOD-KOSZT-ODPOWIEDZI.md, shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md,
    shared/MOD-STEP-TRACKER.md, pisma-procesowe-v3/modules/
    MOD-PRACODAWCA-RZECZYWISTY.md, pisma-procesowe-v3/references/
    SELF-CHECK-PISMA.md, pisma-procesowe-v3/references/W3-WERYFIKACJA.md,
    pisma-procesowe-v3/SKILL.md) to nazwy koncepcyjne bez ścieżki/rozszerzenia
    — nie wymagały zmiany. Wpis changelog 2.5 opisujący pierwotną naprawę
    (linia 'MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik...') pozostawiony bez
    zmian jako wierny zapis historyczny tamtej sesji."
  - "2.5 (2026-07-12): naprawa niespójności samoopisu w
    MOD-DOKUMENT-ANOMALIE_v1.0.0.md — plik w dwóch miejscach (nagłówek
    'Plik:' i wewnętrzna instrukcja `view` w sekcji WYWOŁANIE) opisywał
    samego siebie pod nazwą bez sufiksu wersji (MOD-DOKUMENT-ANOMALIE.md),
    mimo że fizyczna nazwa na dysku ma sufiks _v1.0.0. Nic zewnętrznego już
    się o to nie potykało (naprawione w pisma-procesowe-v3 sesją wcześniej),
    ale sam plik był niespójny. Przy okazji ujawniona DRUGA niespójność:
    deklarowana w treści 'Wersja: 1.1.0' nie zgadza się z sufiksem nazwy
    pliku '_v1.0.0' — odnotowana jawnie w pliku, nierozstrzygnięta (wymaga
    decyzji: zmienić nazwę pliku na _v1.1.0, czy to nazwa jest kanoniczna a
    numer w treści jest przestarzały)."
  - "2.4 (2026-07-12): korekta merytoryczna w terminy.md — wiersz 'Odpowiedź
    na pozew' (art. 207 §2 KPC) był błędnie sklasyfikowany w tabeli 'Terminy
    ZAWITE'; jest to termin INSTRUKCYJNY. Wykryte przy okazji naprawy WARN
    'nakładanie kompetencji analiza-sadowa-v6/analizator-dowodow-v3' —
    analiza-sadowa-v6 miał tę pozycję poprawnie oznaczoną jako INSTRUKCYJNY
    we własnej (teraz usuniętej) kopii tabeli terminów, co ujawniło
    rozbieżność z kanonicznym shared/terminy.md. Dodano adnotację ⚠ i
    przypis w treści pliku zamiast przenosić wiersz do nowej sekcji — decyzja
    strukturalna (osobna sekcja 'Terminy instrukcyjne' vs. adnotacja inline)
    pozostaje otwarta do najbliższego audytu."
  - "2.3 (2026-07-12): ODZYSKANIE 7 PLIKÓW KANONICZNYCH uznanych za utracone
    (CRIT z audytu silnika, zgłoszony przez pisma-procesowe-v3 SKILL.md
    i modules/MOD-SZABLONY.md jako ⛔ OBOWIĄZKOWE, brak na dysku):
    MOD-BUDOWA-ARGUMENTU.md, MOD-ELIMINACJA-TEZ.md, MOD-KARTA-DOWODU.md,
    MOD-KOSZT-ODPOWIEDZI.md, MOD-MIKROPODSUMOWANIA.md,
    MOD-SKUTEK-PROCESOWY.md, MOD-STRESS-TEST.md. Źródło: archiwum
    shared_v5.zip (frontmatter shared v2.1, poprzedzające obecną v2.2) —
    treść modułów zweryfikowana jako produkcyjna (nagłówek 'Status: PRODUKCJA
    — plik kanoniczny shared', ścieżki i wywołania `view` zgodne z aktualną
    strukturą, brak zależności kaskadowych do innych brakujących plików).
    UWAGA METODOLOGICZNA: pozostałe 25 plików wspólnych z shared_v5.zip
    różniło się treścią od wersji obecnej na dysku (v2.2 jest od nich
    nowsza — np. PRAWO-HARDGATE.md 367 vs 257 linii) — te 25 NIE zostało
    nadpisanych, przywrócono wyłącznie 7 plików faktycznie nieobecnych.
    4 pliki obecne na dysku (MOD-AUDIT-BUNDLE.md, MOD-FSL-DOKUMENTY.md,
    MOD-IDENTYFIKACJA-STRONY-UMOWY.md, MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md)
    nie istniały w shared_v5.zip — dodane po tym zrzucie, zachowane bez zmian.
    Tabela 'Moduły kancelaryjne v3.0' i sekcja 'Obowiązkowe wywołania dla
    generatorów pism' uzupełnione o 7 odzyskanych modułów. Do zrobienia przez
    audyt-systemu-v4 przy najbliższej sesji: wpis w AUDIT-JOURNAL.md,
    zamknięcie odpowiadającej flagi w WARN-OTWARTE.md, weryfikacja czy
    CHECKLIST-DEDUP.md wymaga aktualizacji (dwa moduły — MOD-KARTA-DOWODU
    i MOD-ELIMINACJA-TEZ — są współdzielone przez pisma-procesowe-v3 i
    analizator-dowodow-v3, sprawdzić czy to jedyna kanoniczna lokalizacja)."
  - "2.2: standaryzacja metadanych frontmatter (dependencies/inputs/outputs/
    confidence/escalation/limitations/required_modules) — sesja 2026-07-04.
    Jawnie odnotowane ZNANE ODSTĘPSTWO (5 plików z zależnością zwrotną do
    skili nadrzędnych) — decyzja architektoniczna pozostaje otwarta."

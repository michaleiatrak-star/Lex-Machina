# CHANGELOG — Biblioteka shared

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 3.19 (2026-08-23) — usunięcie plików historycznych bez roli operacyjnej (6 plików, 202 → 196)

Przegląd kompletny: każdy z 202 plików katalogu skonfrontowany z (a) wywołaniami
`view` we wszystkich 31 pozostałych skillach systemu, (b) odwołaniami wewnątrz
`shared/`, (c) rejestrami `SKILL.md` i `DEPENDENCY-GRAPH.md`. Wzmianki w
`AUDIT-JOURNAL.md`, `WARN-OTWARTE.md` i changelogach NIE liczone jako rola —
to zapis historyczny, nie wywołanie.

**Usunięte:**

| Plik | Podstawa usunięcia |
|---|---|
| `AKTY-PRAWNE-MASTER.md` (271 l.) | Sam plik od 2026-06-14 nosił nagłówek „⛔ DEPRECATED — NIE UŻYWAĆ", z adnotacją, że migracja nigdy nie nastąpiła (WARN-7, opcja b). Rejestrem Dz.U. jest `audyt-systemu-v4/references/mapa_dzu_*.md`, metrykami — `ISAP-METRYKI-AKTOW.md` i lokalne `dr-*/MAPA-AKTOW.md`. Zero wywołań `view`. |
| `STATUS.md` (35 l.) | Rejestr wersji modułów zamrożony na 2026-06-09, obejmował 13 z ~120 plików katalogu. Zero odwołań spoza `shared/` (wpis „ACTIVE \| audyt-systemu-v4" w `DEPENDENCY-GRAPH.md` był nieprawdziwy — zweryfikowano grepem). Rolę rejestru pełnią tabele „Zawartość katalogu" w `SKILL.md` i ten plik. |
| `MOD-WALIDACJA.md` (7 l.) | Stub przekierowujący do `MOD-WALIDACJA_v2.md`, utrzymywany „dla kompatybilności wstecznej". Ostatni realny konsument — `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` — zniknął przy dedupliakcji 2026-07-12; wszystkie żywe wywołania (`pisma-procesowe-v3` ×4, `analizator-umow-v1`) idą wprost do `_v2`. Kompatybilność wsteczna bez konsumenta = zero roli. Zgodne z `DEDUPLICATION-POLICY.md` („stuby pośrednie są niedopuszczalne i będą usuwane w audytach") i z precedensem `FAKTY.md`, usuniętego wcześniej w tym samym trybie. |
| `checklists/final-pleading-audit-v8.md` (42 l.) | Zero odwołań w CAŁYM systemie — jedyny plik `shared/` bez choćby jednej wzmianki. Szkielet listy kontrolnej pokryty merytorycznie przez `FORMAL-CHECK.md`, `QUALITY-CHECK.md` i `AUDYT-KONCOWY.md`. Hasło „final-pleading-audit-v8" w `prawny-router-v3/references/ROUTING-OPPONENT-ANALYSIS-V9.md` to nazwa silnika, nie ścieżka do tego pliku. |
| `checklists/contradiction-intelligence-checklist-v10.md` (34 l.) | Zero wywołań. Kanoniczna implementacja tej logiki to `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md` (wywoływany przez `prawny-router-v3`, `analiza-sadowa-v6`, `pisma-procesowe-v3` W1.2). Plik w `shared/` był 34-liniowym szkicem tego samego, bez ścieżki wywołania. |
| `portale-branzowe-rzad-2b/czesc-05-changelog.md` (297 l.) | ⚠️ NIE skasowany — treść przeniesiona 1:1 do ANEKSU A tego pliku. Druga lokalizacja historii zmian wewnątrz katalogu treściowego, sprzeczna ze standardem 3.18. |

Katalog `checklists/` przestał istnieć (opróżniony).

**NIE usunięto mimo zerowego wywołania — decyzje świadome:**

- `ORKA-BAS-001-125.json` — wygląda na surowy zrzut wchłonięty przez leksykon,
  ale porównanie 125 rekordów z `orka-bas-leksykon/*.md` + `ORKA-BAS-VIII-X-KADENCJA.md`
  wykazało, że **41 rekordów (BAS-025…) nie ma odpowiednika w markdownie**.
  Usunięcie byłoby utratą danych.
- `MOD-AUDIT-BUNDLE.md` — moduł kompletny i aktualny (AI Act art. 12), ale
  niepodpięty do żadnego pipeline'u. To luka integracyjna, nie plik historyczny —
  usunięcie zamiotłoby problem pod dywan. **Do rozstrzygnięcia w osobnej sesji:
  podpiąć czy odłożyć.**
- `tools/` w całości (81 plików) — otwarte flagi F-8, F-10, F-11 wskazują na te
  pliki jako punkt startowy wdrożenia po stronie dewelopera.
- `mod-osoba-niewidoma-prawa-sad.md` vs `mod-niewidomy-prawa-prawne.md` — 390 i
  415 linii treści merytorycznej o częściowo pokrywającym się zakresie. To kandydat
  do **scalenia**, nie do usunięcia; scalenie wymaga porównania treści art. po art.
  i nie mieści się w porządkowaniu plików.
- `DEDUPLICATION-POLICY.md`, `SCHEMAT-ODPOWIEDZI-MCP.md`, `KANCELARIA-WORKFLOW.md` —
  zerowe wywołanie z zewnątrz, ale rola wewnętrzna udokumentowana i żywa.

**Zaktualizowane rejestry:** `SKILL.md` (wiersze `STATUS.md` i `MOD-WALIDACJA.md`
usunięte z tabel, akapit o oznaczaniu in-situ poprawiony, licznik plików w
`limitations` urealniony ze „115 plików, ~1,4 MB" na stan faktyczny),
`DEPENDENCY-GRAPH.md` (3 wiersze + 2 zasady utrzymania), `DEDUPLICATION-POLICY.md`
(2 wiersze martwych stubów), `PORTALE-BRANZOWE-RZAD-2B.md` (odsyłacz do ANEKSU A).

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


---

# ANEKS A — historia zmian rejestru portali Rzędu 2B

> Przeniesione 1:1 w wersji 3.19 (2026-08-23) z pliku
> `portale-branzowe-rzad-2b/czesc-05-changelog.md`, który został usunięty.
> Powód: standard systemowy 2026-08-20z4 — historia zmian mieszka w
> `references/CHANGELOG.md`, jednej lokalizacji na skill; plik-changelog
> wewnątrz katalogu treściowego był drugą lokalizacją historii i nigdy nie
> był wczytywany w toku pracy merytorycznej. Treść niezmieniona.

### Historia rejestru PORTALE-BRANZOWE-RZAD-2B (przeniesiona 2026-08-23 z `portale-branzowe-rzad-2b/czesc-05-changelog.md`)

**2.9 (2026-07-24c):** ⛔ Na wyraźne polecenie użytkownika ("usuń
pojedyncze przypisane pdf jako źródła... i pozostałe bezpośrednie linki
do pdf") zamknięto flagę F-12: rejestr `nexto_free_files_registry.json`
wyczyszczony do `[]`, wiersz F-12 usunięty z tabeli otwartych flag w
`audyt-systemu-v4/references/WARN-OTWARTE.md`. Wiersz w tabeli DR-03
powyżej zaktualizowany, żeby to odzwierciedlić. Wiersz "nexto.pl —
PRÓBKI/fragmenty książek" (3B-i/3B-ii) NIE jest tym dotknięty — dotyczy
odrębnego, legalnego mechanizmu podglądu/próbki.

**2.8 (2026-07-24b):** ⭐ Na uwagę użytkownika ("czy nie powinny być w 2,
szczególnie w odniesieniu do literatury Beck, Kluwer?") doprecyzowano
wiersz nexto.pl PRÓBKI: kryterium 2B to marka wydawnicza + redakcja
zawodowa, nie kanał dystrybucji — C.H.Beck i Wolters Kluwer są już w 2B
przez legalis.pl/lex.pl, więc próbka na nexto.pl jednoznacznie
identyfikowalna jako publikacja tych wydawnictw dziedziczy status 2B
(podtyp 3B-ii w `shared/HIERARCHIA-ZRODEL.md`), z zachowaniem wymogów
fragmentu/linku/aktualności wydania. Inne/nieustalone wydawnictwo
pozostaje Rząd 3 (3B-i).

**2.7 (2026-07-24):** ⭐ Na polecenie użytkownika dodano ODRĘBNY wiersz
`nexto.pl — PRÓBKI/fragmenty książek` w tabeli DR-03, celowo
oddzielony od istniejącego wiersza F-12. Rozróżnienie: F-12 = pełne,
nieautoryzowane pliki PDF (`.../free/[hash].pdf`), pod aktywnym
monitorowaniem, nie do cytowania; nowy wiersz = standardowa funkcja
próbki księgarni cyfrowej (spis treści + ograniczone strony),
dozwolona jako Rząd 3 WYŁĄCZNIE jako fragment/pogląd doktrynalny, z
obowiązkową weryfikacją ważności linku przed każdym użyciem — pełna
procedura w nowej sekcji 3B `shared/HIERARCHIA-ZRODEL.md` (wersja 1.1).

**2.6 (2026-07-21):** ⭐ KOREKTA na uwagę użytkownika: "nie reklamujemy
księgarni, więc nie powinny być dodane, tylko wskazane jako źródło
darmowych zasobów do monitorowania". USUNIĘTO wpis nexto.pl/profinfo.pl
jako "legalna księgarnia" z tabeli DR-03 — TEN rejestr ma na celu
wskazywanie źródeł do PRZESZUKIWANIA (`site:` dla treści prawnej), nie
katalogowanie miejsc zakupu, niezależnie od tego, jak legalne i godne
zaufania by nie były. Domena nexto.pl POZOSTAJE wspomniana WYŁĄCZNIE
jako źródło PIĘCIU konkretnych, monitorowanych plików (flaga F-12/T10
w audyt-systemu-v4) — BEZ rekomendowania jej jako ogólnego portalu do
przeszukiwania.

**2.5 (2026-07-21):** [WPIS UZUPEŁNIONY WSTECZNIE 2026-07-21 — w
oryginalnej turze zaktualizowano WYŁĄCZNIE nagłówek wersji pliku, bez
odpowiadającego wpisu w tej sekcji, co jest NIESPÓJNOŚCIĄ naprawioną
teraz] Zarejestrowano (BŁĘDNIE, patrz KOREKTA 2.6 powyżej) nexto.pl i
profinfo.pl jako "legalne księgarnie" w DR-03, w kontekście dyskusji o
znalezionym na Nexto pełnym pliku komentarza do KK o niepewnym statusie
prawnym (patrz flaga F-12).

**2.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
https://www.gov.pl/web/kgpsp — POTWIERDZONO (pobrano stronę
bezpośrednio) jako oficjalny (Rząd 1) portal Komendy Głównej Państwowej
Straży Pożarnej, z dedykowaną sekcją "Prawo" i systemem KSRG — treść W
WIĘKSZOŚCI aktualnościowo-wizerunkowa, sama sekcja "Prawo" NIE zbadana
szczegółowo (punkt startowy). Przy poszukiwaniu ANALOGICZNYCH portali
rządowych dla służb znaleziono **bip.kgp.policja.gov.pl** — oficjalny
portal Komendy Głównej Policji z WŁASNYM Dziennikiem Urzędowym
(edziennik.policja.gov.pl, elektroniczny od 2012 r.) i zarządzeniami
Komendanta Głównego. Dodano OBA do DR-13 jako źródła Rządu 1, z NOWĄ
uwagą o strukturze systemowej: dla służb mundurowych/agencji
bezpieczeństwa właściwym wzorcem jest STRUKTURA gov.pl/web/[skrót]
(każda służba ma własny portal w tej rodzinie), nie komercyjny portal
2B — ale treść tych portali jest w przeważającej części
wizerunkowo-informacyjna, wymagająca odrębnego zbadania sekcji
prawnych/zarządzeń dla oceny faktycznej przydatności merytorycznej.

**2.3 (2026-07-21):** Na polecenie użytkownika ("sprawdź niebezpiecznik
i szukaj dalej, a następnie zajmij się badaniem i dodawaniem kandydatów
do listy po ich weryfikacji"): **niebezpiecznik.pl** (✅✅, DR-11) —
bardzo znany, wieloletni portal cyberbezpieczeństwa, MOCNE pokrycie
NIS2/KSC2 z cytatami artykułów, śledzi głośne sprawy (Morele.net/UODO
z wyrokiem NSA) — UZUPEŁNIA poradyodo.pl (ten silniejszy w
cyberbezpieczeństwie, tamten w samym RODO). NASTĘPNIE zweryfikowano
WSZYSTKIE TRZY kandydatów z listy rekomendacji z wersji 2.2 —
**WSZYSTKIE TRAFIONE**: **e-prawnik.pl** (✅✅) — ROZWIĄZUJE wcześniej
odnotowaną lukę DR-03 (pełny Kodeks wykroczeń z komentarzem
artykuł-po-artykule, WCZEŚNIEJSZY wniosek o "braku dominującego
portalu" SKORYGOWANY w sekcji DR-03); **wirtualnemedia.pl** (✅✅) —
NOWA nisza prawa medialnego/prasowego (analogicznie do wcześniej
odkrytej niszy NGO), dodana do DR-11; **praca.pl** (✅✅) — wypełnia
lukę PERSPEKTYWY PRACOWNIKA w DR-04 (wcześniejsze portale tej sekcji
pisane były z perspektywy pracodawcy/kadr). Odnotowano METODOLOGICZNY
wniosek: WSZYSTKIE trzy kandydaty wybrane na podstawie KONKRETNEJ
analizy luk okazały się trafione, w przeciwieństwie do wcześniejszych
przypadkowych prób (wyborcza.pl, pb.pl, medonet.pl) — potwierdza to
wartość METODYCZNEGO podejścia. Zaktualizowano sekcję rekomendacji:
DR-03 usunięte z listy "wciąż niepokrytych" (pozostają DR-05, DR-15).

**2.2 (2026-07-21):** Na pytanie użytkownika "czy są jeszcze jakieś
ważne portale, których brakuje?" — WYKONANO WŁASNĄ analizę luk (nie
czekano na kolejne wskazania). Przetestowano **bezprawnik.pl** (✅✅,
DR-02) — jeden z NAJBARDZIEJ rozpoznawalnych ogólnie portali prawnych
w Polsce, dotąd nieobecny mimo wielu tur budowy tego rejestru — wynik
DOSKONAŁY (cytaty art. 563 KC, art. 45 ustawy o kredycie konsumenckim,
wyrok SN II CK 291/05). Dodano NOWĄ sekcję "REKOMENDACJE DO ZBADANIA
W PRZYSZŁOŚCI" — przemyślana, WŁASNA lista kandydatów z uzasadnieniem
(nie przypadkowe nazwy), podzielona wg priorytetu: WYSOKI (kandydaci
dla wciąż niepokrytych DR-03/DR-05/DR-15), ŚREDNI (redundancja dla
już pokrytych dziedzin), NISKI (specjalistyczne nisze: nieruchomości
deweloperskie, perspektywa pracownika zamiast pracodawcy w DR-04,
prawo medialne jako możliwa nowa nisza analogiczna do NGO).

**2.1 (2026-07-21):** ⭐⭐⭐ NAJWAŻNIEJSZE ustalenie tej tury — na
pytanie użytkownika "czy wszystkie DR wiedzą o tej bazie portali?"
sprawdzono SYSTEMATYCZNIE (grep) WSZYSTKIE 16 DR-skilli: ŻADEN nie
odwoływał się do tego rejestru, ANI DO shared/HIERARCHIA-ZRODEL.md.
Sprawdzono również orkiestrator prawny-router-v3 — RÓWNIEŻ nie ładował
żadnego z tych plików. NAPRAWIONO: dodano OBA pliki do required_modules
w prawny-router-v3/SKILL.md — TERAZ każde wywołanie routera (a więc
każdy DR-skill uruchamiany przez router) ma dostęp do kategoryzacji
wiarygodności źródeł i rejestru portali. Dodatkowo zbadano portale:
**prawakonsumenta.uokik.gov.pl** (✅, Rząd 1 — oficjalny portal UOKiK,
GOTOWE wzory pism reklamacyjnych, potencjalnie przydatne dla pisma-
proste-v2) oraz **medonet.pl** — ⚠️ TEST NIEUDANY dwukrotnie (różne
frazy), zero wyników z tej domeny mimo że to znana marka ogólnie —
odnotowano UCZCIWIE bez fabrykowania wartości portalu.

**2.0 (2026-07-21):** Na polecenie użytkownika: zbadano cztery portale.
**epodatnik.pl** (✅, DR-06) — ⭐ ODMIENNA funkcja od reszty sekcji:
PRZESZUKIWALNE ARCHIWUM rzeczywistych interpretacji podatkowych (nie
serwis komentarzowy), z wyszukiwarką wg przepisu/PKWiU/hasła —
wartościowe jako alternatywa dla oficjalnej bazy EUREKA. **ngo.pl**
(✅✅, DR-02) — WYPEŁNIA CAŁKOWICIE NOWĄ niszę, dotąd nieobecną w
rejestrze: prawo organizacji pozarządowych (fundacje, stowarzyszenia),
z precyzyjnymi cytatami (art. 7 ustawy o fundacjach, art. 10a Prawa o
stowarzyszeniach). **parp.gov.pl** (✅, Rząd 1) — potwierdzona oficjalna
agencja rządowa (Polska Agencja Rozwoju Przedsiębiorczości), NIE 2B —
dotacje/dofinansowania dla firm, bardzo aktualne nabory z konkretnymi
terminami do 2026/2027.

**1.9 (2026-07-21):** Na polecenie użytkownika: zbadano trzy wskazane
portale. **egospodarka.pl** (✅✅, DR-06/02) — bardzo szeroka oferta
(Podatki/Firma/Finanse/Prawo), komentarze nazwanych ekspertów
kancelaryjnych — ⚠️ ODNOTOWANO ZASTRZEŻENIE: jeden znaleziony artykuł
oznaczony wprost "wygenerowane przez AI", wymaga tej samej ostrożności
co inne źródła AI-generowane w rejestrze. **farmer.pl** (✅✅, DR-10) i
**wiescirolnicze.pl** (✅✅, DR-10) — OBA WYPEŁNIAJĄ dotąd niepokryty
aspekt "ROLNICTWA" (czwarty człon nazwy DR-10, wcześniej reprezentowany
wyłącznie przez rynekzdrowia.pl skupione na zdrowiu/farmacji) — oba
mają dedykowane sekcje prawne, śledzą na bieżąco dopłaty ARiMR, KRUS,
oraz PEŁNĄ, aktualną sagę legislacyjną ustawy "Aktywny Rolnik" (projekt
→ Sejm → weto prezydenta → obowiązujące zasady 2026).

**1.8 (2026-07-21):** Kontynuacja poszukiwań na polecenie użytkownika,
w tym zbadanie wskazanego linku https://problemykryminalistyki.
policja.pl/. POTWIERDZONO (pobrano stronę bezpośrednio): to OFICJALNY
(Rząd 1) kwartalnik naukowy Centralnego Laboratorium Kryminalistycznego
Policji — NISZA ODMIENNA od reszty rejestru (kryminalistyka/metodologia
dowodowa, NIE ogólne prawo karne), ze STRUKTURĄ w pełni akademicką (rada
naukowa, recenzenci, kodeks etyki). Dodano do DR-16, ze SZCZEGÓLNYM
odesłaniem do `analizator-dowodow-v3`. Przy poszukiwaniu kolejnych
dużych portali prawnych ODKRYTO **palestra.pl** (✅✅, oficjalne
czasopismo Naczelnej Rady Adwokackiej, archiwum od co najmniej 2013 r.)
i **temidium.pl** (✅, Okręgowa Izba Radców Prawnych w Warszawie) — OBA
WYPEŁNIAJĄ konkretnie brakujący aspekt "ZAWODY PRAWNICZE" w DR-12
(etyka, forma wykonywania zawodu, relacje adwokat/radca), którego
wcześniej zweryfikowane rp.pl/gazetaprawna.pl (skupione na SĄDOWNICTWIE/
TK) nie pokrywały — DR-12 ma TERAZ podwójne, komplementarne pokrycie
obu aspektów dziedziny.

**1.7 (2026-07-21):** Na polecenie użytkownika o portalach dla służb
oraz kolejnych dużych, uznanych portalach prawnych: **defence24.pl**
(✅ zweryfikowany, DR-13 — ale z ISTOTNYM zastrzeżeniem: treści w
większości STARSZE [2013-2017], profil dziennikarsko-analityczny, NIE
głęboki komentarz prawny). DR-13 potwierdzone jako CZWARTA dziedzina
bez dominującego portalu 2B (dołącza do DR-03/05/15) — nisza
zdominowana przez oficjalne strony ABW/SKW. Przy okazji testowania
wyborcza.pl (⚠️ TEST NIEUDANY — zero wyników z tej domeny) ODKRYTO
**curia.europa.eu** — oficjalną bazę orzeczeń TSUE w języku polskim
(Rząd 1), która WYPEŁNIA częściowo DR-14, analogicznie do sytuacji
DR-16 (treść orzeczeń → źródło urzędowe, nie komentarz 2B). Dodano
**bankier.pl** (✅✅ zweryfikowany, DR-06 — silne śledzenie procesu
legislacyjnego na bieżąco, artykuły z dni nie tygodni). PO tej turze:
WSZYSTKIE 16 dziedzin DR + sekcja specjalna niepełnosprawności zostały
przebadane co najmniej raz — brak dziedzin całkowicie nietkniętych w
tym rejestrze.

**1.6 (2026-07-21):** Na wskazanie użytkownika (szukanie dużych,
autorytatywnych źródeł jak "Dziennik Gazeta Prawna" o wyrobionej
pozycji): zweryfikowano EMPIRYCZNIE dwa GENERALISTYCZNE, prestiżowe
dzienniki. **gazetaprawna.pl** (wydawca INFOR PL S.A.) — status
PODNIESIONY z 📚 (znane) na ✅✅ (w pełni zweryfikowane) — test na
"wyrok SN 2026" dał wynik doskonały, artykuły z BIEŻĄCEGO tygodnia,
precyzyjne sygnatury spraw. **rp.pl** (Rzeczpospolita) — NOWO dodane,
✅✅ — test na "wyrok TK" ujawnił GŁĘBOKĄ, wieloartykułową analizę
sporu ustrojowego wokół legitymacji Trybunału Konstytucyjnego
(sędziowie "dublerzy", publikacja wyroków w Dz.U.), z aktualizacjami
do czerwca 2026 i precyzyjnymi sygnaturami (SK 50/22, I KZP 5/23).
rp.pl WYPEŁNIA częściowo DR-12 (Sądownictwo/Prokuratura/Zawody
Prawnicze) — dziedzina PRZENIESIONA z "brak testu" do "potwierdzone".
Zaktualizowano podsumowanie: TYLKO DWIE dziedziny (DR-13, DR-14)
pozostają bez żadnego świeżego testu, zamiast trzech.

**1.5 (2026-07-21):** Na polecenie użytkownika o zbadaniu kolejnych DR
bez bazy portali: przetestowano TRZY dziedziny. DR-05 (Administracyjne)
— UCZCIWIE odnotowano BRAK dominującego portalu 2B (nisza zdominowana
przez firmy szkoleniowe i sklep Wolters Kluwer), analogicznie do DR-03.
DR-15 (Compliance) — RÓWNIEŻ brak dominującego portalu (nisza
zdominowana przez firmy doradcze typu "Wielka Czwórka" i treści
międzynarodowe; zgadywana domena "compliance.com.pl" okazała się
przypadkowym biurem księgowym). DR-16 (Orzecznictwo) — ODMIENNE,
WAŻNE ustalenie: brak portalu 2B TU NIE JEST luką — dla treści
orzeczeń WŁAŚCIWYM źródłem SĄ oficjalne bazy Rzędu 2A
(orzeczenia.ms.gov.pl, saos.org.pl), już znane systemowi — komentarz
2B przychodzi dopiero PO ustaleniu treści z wyższego rzędu.
Zaktualizowano podsumowanie: teraz TYLKO TRZY dziedziny (DR-12, 13, 14)
pozostają bez ŻADNEGO świeżego testu — WSZYSTKIE pozostałe 13 z 16 DR
mają już albo potwierdzony portal, albo uczciwie odnotowany, świadomy
brak dominującego źródła w danej niszy.

**1.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
portal-sow.pfron.org.pl — POTWIERDZONO jako oficjalny portal PFRON
(Rząd 1, System Obsługi Wsparcia). Zbadano IPON i POPON: POPON
(popon.pl) potwierdzono jako realną organizację pracodawców osób
niepełnosprawnych (od 1995 r.) — ✅ dodano jako Rząd 2B z zastrzeżeniem
charakteru rzeczniczego (advocacy); przy okazji odkryto OBPON.org
(analogiczna organizacja). IPON (ipon.pl/ipon.org.pl) zweryfikowano
jako REALNY, długoletni portal (od 2002 r.), ALE UCZCIWIE odnotowano,
że to portal SPOŁECZNOŚCIOWY/RANDKOWY, NIE serwis prawny — NIE
kwalifikuje się jako źródło 2B dla analizy prawnej. Kontynuowano
poszukiwanie kolejnych portali 2B — dla DR-11 znaleziono ZDECYDOWANIE
lepszego kandydata niż wcześniejsze di.com.pl: **poradyodo.pl** (✅✅,
autorstwo radców prawnych, cytaty art. 37-39 RODO, treści datowane
czerwiec/lipiec 2026) — DR-11 PRZENIESIONE z kategorii "wynik mieszany"
do "potwierdzone". Zaktualizowano sekcję podsumowującą stan pokrycia:
teraz TYLKO SZEŚĆ dziedzin (DR-05, 12, 13, 14, 15, 16) pozostaje bez
świeżego testu, zamiast siedmiu.

**1.3 (2026-07-21):** Na polecenie użytkownika: dodano/potwierdzono
infor.pl (✅✅ doskonały wynik dla DR-06 przez subdomenę
ksiegowosc.infor.pl — bardzo aktualne, wyrok NSA z lutego 2026 r.,
KSeF, JPK_VAT — DRUGI, równoważny filar obok gofin.pl), podatki.biz
(✅ potwierdzony, DR-06, portal TaxNet). Przy okazji szerszego
wyszukiwania ODKRYTO organicznie DWA dedykowane portale dla DR-08
(samorzad.infor.pl, prawodlasamorzadu.pl) — RZADKI przypadek dziedziny
z DWOMA wyspecjalizowanymi portalami. Dodano OBSZERNĄ sekcję
"STAN POKRYCIA WSZYSTKICH 16 DR" — bezpośrednia, uczciwa odpowiedź na
pytanie użytkownika, KTÓRE dziedziny mają potwierdzony portal (DR-02,
04, 06, 07, 08, 09, 10 + niepełnosprawność), które mają wynik mieszany
(DR-04 dodatkowo, DR-11), która ŚWIADOMIE nie ma dominującego portalu
(DR-03), oraz KTÓRE siedem dziedzin (DR-05, 11, 12, 13, 14, 15, 16)
NADAL nie mają ŻADNEGO świeżego testu w tej sesji — wskazane jako
priorytet dla ewentualnej kolejnej tury.

**1.2 (2026-07-21):** Kontynuacja budowy na polecenie użytkownika —
prawo pracy, prawo karne/wykroczeniowe, budownictwo, gospodarka i
firmy. Zweryfikowano EMPIRYCZNIE: kodekspracy.pl (✅ doskonały, DR-04,
prawdopodobnie część rodziny GOFIN), muratorplus.pl (✅ doskonały,
DR-09, strona REGULACYJNA/proceduralna — komplementarna do
prawniknabudowie.com, które pokrywa spory KONTRAKTOWE), poradnik-
przedsiebiorcy.pl (✅ doskonały, DR-02, zakładanie spółek/JDG z
konkretnymi kwotami i terminami — UPGRADE statusu z 📚 na ✅). DLA
DR-03 (prawo karne/wykroczenia) — UCZCIWIE odnotowano BRAK jednego,
dominującego portalu redakcyjnego analogicznego do gofin.pl — niszę
zdominowały indywidualne blogi kancelaryjne (Rząd 3) i strony-rankingi
o wątpliwej wiarygodności — zalecono korzystanie z GENERALISTYCZNYCH
portali 2B z zawężonym zapytaniem zamiast poszukiwania jednego
specjalisty. Odnotowano RÓWNIEŻ nieudany test pb.pl (Puls Biznesu,
DR-02) — zapytanie zwróciło wyłącznie niepowiązane wyniki (Wikipedia,
baza LEI, szablony umów).

**1.1 (2026-07-21):** Dodano SEKCJĘ SPECJALNĄ dla osób niepełnosprawnych
(priorytet użytkownika) — zweryfikowano EMPIRYCZNIE niepelnosprawni.pl
(✅✅ wynik DOSKONAŁY — sekcja "Prawnik radzi" z cytatami konkretnych
sygnatur TK/SN i artykułów ustaw, np. TK SK 2/17) oraz integracja.org
(✅ ta sama platforma redakcyjna, dodatkowo audyty dostępności i
nazwany ekspert prawny). Odnotowano WYRAŹNE ostrzeżenie: niepelnosprawni.gov.pl
i gov.pl/web/rodzina to ORGANY RZĄDOWE (Rząd 1), NIE mylić z portalami
2B mimo podobnych nazw. Dodano też portalzp.pl (✅ zweryfikowane, DR-07
zamówienia publiczne, z zastrzeżeniem częściowej płatności treści).

**1.0 (2026-07-21):** Utworzenie rejestru na wyraźne żądanie
użytkownika. Przetestowano EMPIRYCZNIE (zapytania `site:` na żywo) sześć
portali: prawo.pl (✅ doskonały, ogólny), gofin.pl + 4 subdomeny (✅
doskonały, DR-06), prawniknabudowie.com (✅ dobry, DR-09, spory
kontraktowe), prawnikpodpowienabudowie.pl (✅ dobry, DR-09, ODRĘBNY od
DR-04, prawdopodobnie zorientowany na szkolenia/kalkulatory nie
artykuły), rynekzdrowia.pl (✅ doskonały, DR-10, bardzo aktualny),
di.com.pl (⚠️ ogólny wynik pozytywny, ale artykuły częściowo datowane
na 2018 r., DR-11, traktować jako kontekst nie główne źródło). Dla
POZOSTAŁYCH dziedzin (DR-02, DR-03, DR-05, DR-07, DR-08, DR-12, DR-13,
DR-14, DR-15, DR-16) wykorzystano ISTNIEJĄCĄ listę z `HIERARCHIA-
ZRODEL.md` (oznaczone 📚) oraz DODANO przykładowe wzorce nazw domen
typowych dla danej branży jako PUNKTY STARTOWE (oznaczone ⚠️ NIE
testowane) — UCZCIWIE nierozróżniane od faktycznie zweryfikowanych,
zgodnie z zasadą braku fabrykowania pewności.

# CHANGELOG — audyt-systemu-v4

- 6.28 (2026-08-27): domknięto F-86 materiałowo modułem B+ dla Prawa upadłościowego art. 426–491^38; T18 dopisano do REGRESSION-TEST-PLAN i scripts/README; zsynchronizowano metadane wydania po pełnej propagacji modułów pokrycia.

- 6.27 (2026-08-27): wykonano rekomendacje audytu pokrycia: utworzono `MAPA-POKRYCIA.md` dla brakujących 9 DR, dodano T18 `check_coverage_coherence.py` i wpięto do suite, rozdzielono status rejestracji od kompletności treściowej oraz oznaczono raporty 2026-08-13 jako baseline historyczny. F-108 Etap 3: 52/52 dedykowanych modułów.

- 6.26 (2026-08-27): errata dowodu F-108/46 — T3 ma 7 ostrzeżeń,
  T11 ma 26 pozycji do przeglądu; nie są globalnym PASS. Test nowego modułu
  nadal 18/18 PASS. Bez zmiany statusu F-108 i bez zmian treści prawa.

- 6.25 — F-108/46: rejestr postępu wszystkich 52 pozycji, kontrola 6 półroczy i propagacji; F-108 otwarta, pełna historia zmian i administracja niezaliczone. (2026-08-27)

- 6.24 (2026-08-27): T17 kontroluje identyfikatory, kolejność i znaczenie
  reguł routera po skróceniu; wzorzec pamięci zsynchronizowano z routerem 3.29.

- 6.23 (2026-08-27): zamknięto F-82 i F-102; F-86 uzupełniono częściowo; zapisano niezależny
  preflight `NIEMIERZALNE` dla F-113/F-133; poprawiono rozwiązywanie ścieżek
  w T1/T2/T3/T15 i dodano kontrolę zgodności tytułu aktu z metryką ELI.

- 6.22 (2026-08-26): T17 rozszerzono o limit 500 linii, pozycję bloku
  bezwzględnego, kontrolę narracji incydentów i duplikatu Reguły 13. Dodano
  pozycję 13 menu oraz `PAMIEC-TRWALA-ROUTER.md`: wersjonowaną, wymagającą
  zgody synchronizację wydzielonej sekcji trwałych preferencji routera.

- 6.21 (2026-08-26): dodano T17 chroniący kontrakt routera (imperatywny
  trigger, PATH-SELFTEST, routing [11], audyt klucza N/N); usunięto rozjazd
  limitu `description` 1024↔200 w orkiestratorze i planie testów; wybór
  aktualnej mapy Dz.U. jest dynamiczny zamiast przywiązany do daty 2026-08-21;
  liczniki drzewa pakietu uzgodniono ze stanem dysku.

- 6.20 (2026-08-26): dodano T15 (operacyjna weryfikacja tekstów jednolitych)
  i T16 (pełny inwentarz zakresu nowelizacji), wzmocniono obowiązek propagacji,
  usunięto zależność od ścieżki jednego hosta, zaktualizowano centralną mapę
  Dz.U. i dodano pełny inwentarz 116 dyspozycji Dz.U. 2022 poz. 2600.

> Pełna historia napraw i zmian wersji orkiestratora (33 wpisy, od
> wersji 4.3 do 6.13). WYNIESIONA z SKILL.md 2026-08-20 (F-78,
> porządkowanie SKILL.md >1000 linii — pierwsze takie wydzielenie dla
> tego pliku, treść skopiowana 1:1, bez zmian merytorycznych). Wczytuj
> TYLKO gdy potrzebujesz historii konkretnej naprawy wersji
> orkiestratora — SKILL.md trzyma tylko krótkie podsumowanie 3
> najnowszych wersji jako kontekst bieżący.

- 6.18 (2026-08-24f, flaga **F-113** — część projektowa): powstał `references/PLAN-TESTU-BRAMEK-F113.md` — protokół testu SKUTECZNOŚCI pięciu bramek z GRUPĄ KONTROLNĄ (ramiona A/B na tym samym kazusie i prompcie, trzy komórki środowiskowe T0/T1/T2, pozycje-pułapki, ocena ślepa, progi orzekania) oraz narzędzie `scripts/ocena_transkryptow_f113.py`. Wykonanie przebiegów POZOSTAJE otwarte — flaga nie jest zamknięta. Opis: `references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24f.

- 6.17 (2026-08-24, flaga **F-130**): dodane pole `description:` do frontmattera — `audyt-systemu-v4` był JEDYNYM skillem w systemie bez niego (poprawka wskazana przez użytkownika). Naprawiona też PRZYCZYNA, dla której luka przetrwała: FAZA 2C i `MOD-DESCRIPTION.md` mierzyły wyłącznie DŁUGOŚĆ, a dla pliku bez pola wypisywały `0` i klasyfikowały wynik jako ✅ OK. Dodany test **T14** (`scripts/check_description.py`), wpięty w orkiestrator i `REGRESSION-TEST-PLAN.md` sekcja 14. Opis: `references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24e.

**6.16 (2026-08-23i) — F-115 zawężona do P3; F-126 otwarta:**
- Wpis dotyczy `shared` i 13 skilli konsumenckich (ZASADA 11). Pełny opis: AUDIT-JOURNAL, AUDYT-2026-08-23i.
- Self-check ANTY-FASADA: 7 KOPII → wywołania modułu `shared/SELF-CHECK-ANTY-FASADA.md`; P1 i P2 podłączone; pokrycie 7 → 14 plików.
- Sprostowana fałszywa deklaracja „propagowana do wszystkich skilli" w PRAWO-HARDGATE.
- **F-126 otwarta jako WŁASNY skutek uboczny sesji:** historia w dwóch miejscach w 3 skillach (sekcja `## CHANGELOG` w korpusie SKILL.md wbrew ZASADZIE 15).
- T12 na drzewie roboczym: 11 ⛔ → 3 ⛔ (pozostałe 3 = zakres F-126).

**6.15 (2026-08-23h) — F-111 zamknięta: PRAWO-HARDGATE podzielony (wariant B, decyzja użytkownika):**
- Wpis dotyczy skilla `shared`, nie orkiestratora — tutaj odnotowany, bo sesja audytowa
  była jego wykonawcą (ZASADA 11). Pełny opis: `references/AUDIT-JOURNAL.md`, AUDYT-2026-08-23h.
- `shared/PRAWO-HARDGATE.md` **967 → 501 l.**; nowy `shared/PRAWO-HARDGATE-ORZECZENIA.md` (464 l.)
  z wyzwalaczem BINARNYM („sygnatura w tekście", nie „gdy potrzebujesz procedury").
- ⭐ Znalezisko poboczne: **88 linii historii wersji stało POWYŻEJ pierwszej normy** bramki —
  114 plików czytało changelog, zanim dotarło do zakazu. Wyniesione do `shared/references/CHANGELOG.md`.
- Ścieżki zewnętrzne bez zmian (114 plików, 212 odesłań) — nazwa pliku nadrzędnego zachowana.
- **F-115 odblokowana** (self-check ANTY-FASADA został w rdzeniu). Licznik flag 19 → 18.
- ⚠️ Ryzyko nazwane w plikach, nie tylko w dzienniku: treść wydzielona to treść, której można
  nie wczytać — pomiar podziału należy do F-113.

**6.14 (2026-08-23g) — ZASADA 14 (AUDIT-CLAIM-GATE); rejestr YAML zsynchronizowany z dyskiem; parsery T11/T3 przestały być ślepe na notację LEX:**
- ⚙️ **NOWA ZASADA 14 (STAŁA) — bramka wyjściowa zgłoszenia audytowego (F-121).**
  Żadne zgłoszenie nie opuszcza skilla jako TWIERDZENIE bez trzech pól: STATUS wg
  rejestru w `shared/PRAWO-HARDGATE.md`, IDENTYFIKATOR ŹRÓDŁA (plik + linia / Dz.U.
  + artykuł / URL z datą) i REPRODUKCJA (polecenie, którym druga osoba odtworzy
  ustalenie). Zakaz szczególny: kwalifikowanie cudzej PRZYCZYNY („halucynacja",
  „awaria infrastruktury") zamiast OBJAWU — przyczyna nie jest obserwowalna z
  zewnątrz. Przesłanka: TEST1 §5.2, trzy obalone diagnozy samoaudytu.
- `references/FORMAT-RAPORTU-ROZNIC.md` § 4 — tabela trzech pól obowiązkowych;
  odpowiedź na pytanie z kryterium zamknięcia F-121 brzmi: przed tą datą plik ich
  NIE wymuszał. Dodano też zastrzeżenie, że kolumna `Akcja sugerowana` z raportu
  jest heurystyką skryptu, nie ustaleniem.
- **F-124 (otwarta i zamknięta w tej samej sesji):** `references/CHANGELOG.md`
  (ten plik!) oraz `references/F-104-lista-robocza-roczniki-starsze.md` były
  plikami-sierotami poza YAML; drzewo STRUKTURA KATALOGU deklarowało 53 pliki przy
  55 i 16 skryptów przy 18, pomijając `README.md` w korzeniu. Trzeci nawrót wzorca
  F-80 — wykryty wyłącznie dlatego, że ZASADA 7 KROK 1 wymusza policzenie plików.
  Nowa obserwacja **O-4**: potrzebny automat DWUKIERUNKOWY (dysk vs YAML **i** YAML
  vs dysk), bo wykryto też wariant odwrotny w `raport-sytuacyjny-v2` (rejestr
  obiecywał plik `assets/`, którego nie ma).
- **F-125 (otwarta, parser naprawiony):** `check_sync_aktow.py` (T11) i
  `test_cross_map_dzu.py` (T3) były ślepe na notację LEX `Dz.U.RRRR.NN.PPPP` —
  T11 rozbierał `Dz.U. 2026 poz. 468` na `(rok, "0")`, po czym `artefakt()` po cichu
  odrzucał wpis, więc prawdziwa pozycja nigdy nie trafiała do porównania (fałszywy
  NEGATYW). 95 wystąpień notacji w korpusie. Dodano `normalizuj()` wołaną przed
  dopasowaniem w obu testach. Pomiar kontrolny: T11 143 → **140**, T3 8 → 8.
  ⚠️ Przy pierwszym podejściu patch w T3 został dodany, ale NIE wpięty w pętlę —
  wykryte dopiero weryfikacją `grep -n DZU_PATTERN`; dokładnie ta klasa pozornej
  naprawy, o której mówi F-113.

**6.13 (2026-08-20z4) — ZASADA 15: historia zmian wyłącznie w references/CHANGELOG.md; standard ujednolicony w 9 skillach:**
- ⚙️ **NOWA ZASADA 15 (STAŁA, na wyraźne polecenie użytkownika):** pełna historia
  zmian każdego skilla mieszka w osobnym pliku `references/CHANGELOG.md`. W SKILL.md
  nie ma sekcji `## CHANGELOG` z wpisami — wyłącznie odesłanie; pole `changelog:`
  w YAML to krótki skrót bieżącej wersji (do ~15 linii), nigdy pełna lista.
- **Uzasadnienie funkcjonalne, nie porządkowe:** rozproszenie historii między trzy
  lokalizacje było BEZPOŚREDNIĄ przyczyną fałszywych wyników T12 w sesji 08-20z3 —
  test szukał wpisów w `references/`, nie znajdował (leżały w SKILL.md) i raportował
  nieistniejące luki. W `pisma-procesowe-v3` groziło to dopisaniem PIĘCIU zmyślonych
  wpisów do changelogu.
- **Ujednolicone 9 skilli.** Z korpusu SKILL.md: `analizator-przepisow-v2` (83 linie),
  `audyt-systemu-v4` (42), `dr-01` (17), `orzeczenia-sadowe-v2` (9),
  `pisma-procesowe-v3` (61), `pisma-proste-v2` (62), `prawny-router-v3` (71).
  Z pola `changelog:` YAML: `shared` (**111 linii** — najdłuższy przypadek w systemie),
  `prawny-router-v3` (63 — ten skill trzymał historię w TRZECH miejscach naraz),
  `analiza-sadowa-v6` (39). Cztery pliki `references/CHANGELOG.md` UTWORZONE od zera.
  Cała treść przeniesiona **1:1**, bez zmiany ani jednego zdania.
- **T12 egzekwuje standard:** sekcja `## CHANGELOG` z wpisami w korpusie → ⛔;
  pole `changelog:` dłuższe niż 15 linii → ⚠️. Zasada przestaje więc zależeć od
  pamięci wykonawcy audytu.
- ⛔ **Znalezisko uboczne — `analizator-przepisow-v2` miał NIESPARSOWALNY frontmatter.**
  Pole `description` zawierało niecytowane dwukropki (`v2:`, `v2.3:`), przez co
  `yaml.safe_load` zwracał błąd i YAML nie ładował się W OGÓLE. Usterka ZASTANA —
  obecna również w stanie pierwotnym, przeżyła wszystkie dotychczasowe audyty, bo
  żaden test nie sprawdzał samej parsowalności frontmatteru. Naprawione blokiem `>-`.
  ⭐ Do rozważenia: kontrola `yaml.safe_load` dla wszystkich SKILL.md jako osobny test.
- Sekcja CHANGELOG usunięta również z SKILL.md tego skilla — była duplikatem trzech
  najnowszych wpisów już obecnych tutaj (skrót wprowadzony w F-78, teraz zbędny).
  `version: "6.12" → "6.13"`.

**6.12 (2026-08-20z3) — realizacja F-102: historia 18 wersji odtworzona z dziennika, pułapka float w 16 skillach, decyzja generalna o duplikatach numeru:**
- ⛔ **Najpierw wyszły trzy WŁASNE błędy testu T12**, wykryte przy ręcznej weryfikacji
  raportu PRZED przystąpieniem do napraw: (1) czytał wyłącznie `references/CHANGELOG.md`,
  pomijając sekcję `## CHANGELOG` wewnątrz SKILL.md — przez co raportował w
  `pisma-procesowe-v3` lukę siedmiu wersji zamiast realnych dwóch; (2) wykrywał WŁASNE
  komentarze naprawcze („stopka podawała Wersja: 5.2") jako stopkę; (3) mylił wiersz
  wewnątrz wpisu changelogu („- Wersja: 3.8 → 3.9") ze stopką pliku. Po naprawie parsera
  test ujawnił za to DWA rozjazdy, których wcześniej nie widział (`dr-01`,
  `prawny-router-v3` 3.13→3.21 — osiem wersji, największa luka w systemie).
  ⭐ Wniosek: raport nowego testu weryfikuj ręcznie, zanim naprawisz system pod jego
  dyktando — inaczej dopiszesz pięć nieistniejących wpisów i przeoczysz dwa realne.
- **Historia 18 wersji ODTWORZONA z `AUDIT-JOURNAL.md`** — okazało się, że istnieje,
  tylko nie w changelogach: dziennik odnotowuje każde podbicie w sekcjach „Rejestracja".
  Uzupełnione: `prawny-router-v3` 3.14-3.21, `analizator-umow-v1` 1.26-1.30,
  `pisma-procesowe-v3` 5.16-5.17, `dr-01` 3.4. Wpisy oznaczone jako WTÓRNE wobec
  dziennika, z odesłaniem do wpisu-źródła. `dr-01` 3.5/3.6 — brak śladu w jakimkolwiek
  pliku systemu → „LUKA JAWNA", bo zmyślony wpis jest gorszy niż jego brak: brak widać,
  zmyślenie zostaje na zawsze jako fałszywe źródło.
- **`orzeczenia-sadowe-v2`: rozjazd ODWROTNY** — `version: 2.9 → "2.9.1"`, changelog
  miał wpis z 2026-07-17, którego pole nie odnotowało.
- **Pułapka float naprawiona w 16 skillach** (13 z realną, dwucyfrowym minor + 3
  profilaktycznie przy okazji edycji). 10 skilli z ryzykiem WYŁĄCZNIE przyszłym
  świadomie NIE naprawiono hurtem — dziesięć dostaw przy zerowym zysku dzisiaj;
  pozycja resztkowa w F-102 + flaga `--profilaktyka` pokazująca listę na bieżąco.
- ⭐ **DECYZJA GENERALNA: duplikat numeru wersji poza polem `version:` się USUWA,
  nie synchronizuje.** Podstawa empiryczna: pięć niezależnych rozjazdów w trzech
  sesjach. Nagłówki H1 noszą teraz sam MAJOR (nie dryfuje), stopka `prawo-polskie-v2`
  odsyła do YAML i nosi wyłącznie datę zmiany treści. Przy okazji poprawiono własny
  błąd z 08-20z: wpisane wtedy w nagłówek `analizator-dowodow-v3` pełne „v5.17"
  zaczęłoby dryfować przy następnym podbiciu.
- **T12 rozpoznaje teraz deklarację „LUKA JAWNA"** — skill, który lukę udokumentował,
  jest w stanie POPRAWNYM; test musi to odróżniać od skilla, który milczy.
- Kontrola skuteczności: T12 przed **7 ⛔ / 20 ⚠️** → po **0 ⛔ / 0 ⚠️**; YAML
  wszystkich 19 edytowanych skilli parsuje się poprawnie, `version` wszędzie typu
  string. Liczba plików bez zmiany w każdym skillu. `version: "6.11" → "6.12"`.

**6.11 (2026-08-20z2) — F-101 zamknięta przez automatyzację: nowy test T12 i jego pierwszy przebieg (F-102):**
- **F-101 ZAMKNIĘTA W CAŁOŚCI.** Jej ostatni punkt — nieodtwarzalne luki historii
  wersji (3.20-3.22 w skillu świadków, 5.16.0-5.16.1 w analizatorze) — rozstrzygnięto
  przez ZAAKCEPTOWANIE luki i udokumentowanie jej sekcją „LUKA JAWNA" w changelogach
  obu skilli. Flaga czekająca na odtworzenie materiału, który nie istnieje, byłaby
  otwarta bezterminowo (wzorzec F-86 — rozrost rejestru o pozycje nie do domknięcia).
- **NOWY TEST T12 (`scripts/check_wersje_changelog.py`), ŚREDNI.** Kontroluje cztery
  nośniki numeru wersji: `version:` (źródło prawdy), najwyższy wpis
  `references/CHANGELOG.md`, numer w polu `changelog:` YAML, numer w nagłówku H1
  i stopce. Zarejestrowany w czterech rejestrach (YAML `scripts:`, STRUKTURA KATALOGU,
  `run_regression_suite.py`, `REGRESSION-TEST-PLAN.md` sekcja 12).
- **PUŁAPKA FLOAT — nowa klasa usterki wykryta przy okazji.** Niecytowane
  `version: 6.10` YAML parsuje jako float **6.1**, czyli numer NIŻSZY niż 6.9;
  problem pojawia się dopiero przy przejściu X.9 → X.10 i jest niewidoczny w treści
  pliku. Pierwszy przebieg znalazł go w **14 skillach** (m.in. dr-06 z 3.72, dr-02
  i dr-10 z 3.35, prawny-router-v3 z 3.21). Naprawiony wzorcowo w `shared` i tutaj,
  z komentarzem ostrzegawczym przy polu; pozostałe 13 → F-102.
- **F-102 OTWARTA** — wynik pierwszego przebiegu na `/mnt/skills/user`: 26 rozbieżności
  w 24 skillach (5 ⛔ czynnych, 21 ⚠️ utajonych). Najpoważniejsza: `pisma-procesowe-v3`,
  `version: 5.17` przy changelogu na 5.10 — **siedem wersji bez opisu**, luka większa
  niż ta, która uruchomiła całą sprawę.
- **Błąd własny testu, naprawiony tego samego dnia:** pierwsza wersja przeszukiwała
  cały plik i dawała 7 fałszywych trafień z wpisów changelogu cytujących wersje INNYCH
  plików. Ograniczono wyszukiwanie do korpusu poza frontmatterem. Rozdzielono też
  klasyfikację wagi (⛔ / ⚠️ / ℹ️) — pierwotne 42 pozycje z 19 „krytycznymi" topiły
  5 realnych problemów w szumie.
- ⭐ **Zasada z tej sesji: flaga opisująca WZORZEC zamyka się testem, nie naprawą.**
  F-101 wystąpiła w trzech skillach z trzech rodzin w jednej sesji — to była definicja
  wzorca, a czwarta naprawa ręczna kosztowałaby więcej niż T12.
- Kontrola skuteczności: T12 na czterech skillach naprawionych w tej rozmowie —
  zero rozbieżności (przed: 26, po: 0). `version: "6.10" → "6.11"`.

**6.10 (2026-08-20z) — wykonanie flag F-99 i F-100 w całości, F-101 zawężona; zasada „wydzielenie ≠ osłabienie":**
- **F-100 (A) — `shared/MOD-DOKUMENT-GATES.md` (nowy plik kanoniczny, 254 linie).**
  Osiem bramek pracy na dokumentach (DOCUMENT-SCAN-PROMPT, FOUNDATION-VERIFICATION-GATE,
  EXHAUSTIVE-EXTRACTION-GATE, IMMEDIATE-LOGICAL-SCAN, CROSS-DOCUMENT-CONSISTENCY-CHECK,
  ENTITY-DISAMBIGUATION-TABLE, EVIDENCE-THREAD-LINKING, QUOTE-VERIFICATION-DEFAULT)
  występowało w CAŁYM systemie wyłącznie w `przesluchanie-swiadkow-v2-min90`.
  `analizator-dowodow-v3` — PRIMARY dla analizy dowodowej — nie miał do nich dostępu.
  Sedno naprawy: udostępnienie działających bramek drugiemu konsumentowi, nie
  oszczędność linii. Zarejestrowane w `shared/SKILL.md` i `DEPENDENCY-GRAPH.md`.
- **F-100 (B)** — 5 bloków strategicznych analizatora do `modules/MD7-bloki-strategiczne.md`
  (E7 w BLOKU E routera). SKILL.md 1174 → 983 mimo dopisania KROKU 0d.
  ⚠️ Zysk MNIEJSZY niż zakładała flaga: 2 z 5 bloków mają wyzwalacz „ZAWSZE" —
  odnotowane wprost, żeby następny audyt nie odziedziczył optymistycznej liczby.
- **F-99** — `TYPOLOGIE-LOAD` w W2 skilla świadków: typologie świadka i sędziego były
  w pakiecie od początku, ale żaden krok pipeline'u ich nie wczytywał, mimo deklaracji
  w `description`. ⭐ Klasa usterki „zdolność zadeklarowana + zasoby dostarczone + brak
  wpięcia" nie jest wykrywana przez FAZĘ 2A ani T6 — wykrywa ją dopiero pytanie
  odwrotne: *czy każdy plik pakietu ma konsumenta?* Kandydat na rozszerzenie
  `check_rejestracja_modulow.py`. Dodatkowo usunięty balast poscaleniowy (30 → 23 pliki).
- **F-101 zawężona** — changelogi scalone, nagłówki wersji naprawione; nieodtwarzalne
  luki 3.20-3.22 i 5.16.0-5.16.1 odnotowane jawnie jako „LUKA JAWNA" zamiast ciszy.
- **Rekomendacja testu T12** (`version` vs najnowszy wpis changelogu): rozjazd wystąpił
  w trzech skillach z trzech rodzin, łącznie ze stopką samego orkiestratora — to wzorzec,
  nie incydent.
- ⚠️ **Pułapka YAML wykryta przy walidacji:** `version: 6.10` bez cudzysłowu parsuje
  się jako float **6.1**, czyli mniej niż 6.9. Pole ujęte w cudzysłów + komentarz
  ostrzegawczy w SKILL.md. Do sprawdzenia w innych skillach systemu.
- **Zasada metodyczna sesji:** każde przeniesienie treści zweryfikowane bajtowo
  (`treść_wycięta in treść_modułu` = True) PRZED dostawą; każde wydzielenie dostało
  twardy krok wczytania (`DG-LOAD`), bo samo odesłanie byłoby regresem wobec historii
  napraw 3.6/3.17/3.18. Flag F-: 26 → 24. `version: 6.9 → 6.10`.

**6.9 (2026-08-20y) — audyt martwej treści własnego orkiestratora: 6 usterek, w tym jedna kasująca dane:**
- ⛔ **FAZA 7B kopiowała mapę ARCHIWALNĄ** — polecenie `cp` wskazywało
  `mapa_dzu_2026-06-14.md` przy mapie aktualnej `2026-07-15`. Literalne wykonanie
  cofało mapę o 3 generacje (~250 wierszy) BEZ sygnału błędu. To DRUGIE wystąpienie
  tej samej usterki — pierwsze naprawiono w 4.4 (2026-06-14g). Naprawiono oba
  wystąpienia + dopisano regułę stałą: przy zmianie mapy aktualnej `grep -n mapa_dzu
  SKILL.md` i poprawa WSZYSTKICH wystąpień, nie tylko `references:`.
- ⛔ **FAZA 7C MARTWA od 2026-06-14g** — nakazywała aktualizację `SKILLS-MAP-AND-FIXES`,
  pliku usuniętego w 4.4. Przeżyła ~2 miesiące, bo FAZA 2A sprawdza wyłącznie ścieżki
  `view`, a to była nazwa w prozie (to samo dotyczyło FAZY 2B — drugie odwołanie do
  tego samego nieistniejącego pliku, też naprawione). W miejsce 7C wpisano aktualizację
  `WARN-OTWARTE.md` — czynność obowiązkową z ZASADY 10, która nie miała własnego kroku
  w FAZIE 7. Poprawiono też zdanie „zaktualizuj **oba** pliki" przy trzech podsekcjach.
- **Frontmatter, `raporty-pokrycia-2026-08-13/`:** licznik „12 raportów + indeks =
  13 plików" przy 11 na dysku (KRO usunięty 08-15, KPK 08-15nn — oba udokumentowane).
  Rejestr wyprzedzał dysk: lustrzane odbicie F-80. Poprawione tu i w § 7 WARN-OTWARTE.
- **STRUKTURA KATALOGU** nieaktualna o 15 plików — wymieniała 4 pliki `references/`
  (stan sprzed F-80), pomijała CAŁY `scripts/`, podawała 460 wierszy mapy przy 509.
  Odtworzona ze stanu faktycznego (48 plików) + reguła aktualizacji obu miejsc naraz.
- **Stopka „Wersja: 5.0 | 2026-07-04"** przy `version: 6.8` — rozjazd 9 wersji.
- **Otwarte F-99, F-100, F-101** — wynik badania trzech skilli pod kątem treści
  bezwartościowej i kandydatów do wydzielenia (patrz `AUDIT-JOURNAL.md`,
  wpis AUDYT-2026-08-20y). Naprawy w skillach `przesluchanie-swiadkow-v2-min90`
  i `analizator-dowodow-v3` NIE wykonane w tej sesji — czekają na decyzję zakresu.
- `version: 6.8 → 6.9`.

**6.8 (2026-08-15z) — synchronizacja ROUTING-MAP (REGUŁA 3) + nowy test T11 wykrywający tę klasę luki automatycznie:**
- ⛔ **Wykryta luka procesu:** sesje 08-15x i 08-15y wpisały nowe akty do mapy
  Dz.U. i modułów, ale NIE do `prawo-polskie-v2/ROUTING-MAP.md` — czyli REGUŁA 3
  HARDGATE-AUDYT została pominięta. Zsynchronizowano: narkomania → Dz.U. 2026
  poz. 1004, AI → poz. 1003, Ordynacja → „ze zm. poz. 825 i 846", nowy wiersz
  katalogowy ustawy o delegowaniu kierowców (2023 poz. 1523).
- **NOWY TEST T11 (`scripts/check_sync_aktow.py`)** — porównuje ZBIORY numerów
  Dz.U. w trzech rejestrach i wypisuje akty obecne w jednym, a brakujące
  w pozostałych. Uzupełnia lukę: T3 wykrywa RÓŻNY numer tego samego aktu,
  `check_rejestracja_modulow.py` — nierejestrację MODUŁÓW, a NIKT dotąd nie
  wykrywał BRAKU AKTU w rejestrze. Zarejestrowany w orkiestratorze.
- **Pierwszy przebieg (stan zastany):** 72 akty z lokalnych map nieobecne
  w ROUTING-MAP, 80 nieobecnych w mapie Dz.U., 53 z ROUTING-MAP nieobecne
  w mapie Dz.U. → flaga **F-89**.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15z`.

**6.7 (2026-08-15y) — F-24 zamknięta po 8 podejściach; F-82 zawężona; ostrzeżenie F-82 wbudowane w test T3:**
- **F-24 ZAMKNIĘTA:** nowelizacja narkomanii to **Dz.U. 2026 poz. 1004**
  (ustawa z 3.07.2026, ogłoszona 27.07.2026, w życie 27.08.2026).
  ⭐ Metoda, która zadziałała po 7 nieudanych próbach: szukanie **wykazu
  pozycji Dziennika Ustaw z konkretnego dnia** zamiast kolejnego pytania
  o sam akt — teksty sejmowe z definicji nie zawierają numeru promulgacji
  (mają w tym miejscu lukę redakcyjną „oraz z …"). Rekomendowane jako
  standardowy krok TRYB DZU. Rozbieżność dat 11.06 vs 3.07 wyjaśniona:
  data sejmowa dotyczy wersji sprzed poprawek Senatu.
- **F-82 pkt 2:** `test_cross_map_dzu.py` wypisuje teraz przy KAŻDYM
  przebiegu ostrzeżenie, że zgodność rejestrów nie jest weryfikacją
  merytoryczną (wynik „OK" był historycznie mylący); docstring rozszerzony
  o przypadek referencyjny i technikę kontrolną. Naprawiony homoglif telugu
  w docstringu.
- **F-82 pkt 3:** ustawa o delegowaniu kierowców (Dz.U. 2023 poz. 1523)
  dostała własny wiersz w mapie — status „skatalogowana bez modułu".
- Mapa Dz.U.: dodane 2026.1004, **2026.1003** (ustawa o systemach AI —
  znana lokalnie w dr-11, nieobecna centralnie) i 2023.1523.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15y`.

**6.6 (2026-08-15x) — F-85 zamknięta, F-88 otwarta, mapa Dz.U. uzupełniona o 3 pozycje:**
- `mapa_dzu_2026-07-15.md`: dodane Dz.U. 2026 poz. **846**, **825** i **779**
  z pełnymi metrykami i datami wejścia w życie; adnotacje „ze zm." przy
  tekstach jednolitych OP (622), PIT (592) i CIT (554).
- ⭐ **poz. 825 wykryta ubocznie** — wcześniej nieobecna w ŻADNYM rejestrze
  systemu; ujawniła ją metryka OP zacytowana wewnątrz tekstu poz. 846.
  Technika (porównywanie metryk aktów zmienianych, cytowanych w nagłówkach
  nowelizacji, z mapą) potwierdzona po raz DRUGI — pierwszy raz przy F-82
  (Kodeks morski). Rekomendowana jako stały element TRYB DZU.
- FAZA 3E w dr-06: doprecyzowana metryka nowelizacji art. 24a ustawy o PIT
  w `mod-PKPiR-ewidencje-uproszczone.md`; ustalono, że zmiana jest
  terminologiczna, a przepisy wykonawcze z art. 24a ust. 8 zachowują moc —
  żadne sformułowanie modułu nie zostało unieważnione.
- **F-88 otwarta:** propagacja omnibusu Dz.U. 2026 poz. 846 (16 obszarów,
  w życie 1.10.2026, priorytetowy podwątek MDR) — ta sama klasa co F-79.
- Pełny opis: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15x`.

**6.5 (2026-08-15w) — porządkowanie `WARN-OTWARTE.md`: rejestr przywrócony do roli TODO:**
- Plik przebudowany: 489 → 439 linii, ~96 KB → ~45 KB, przy zachowaniu
  wszystkich 33 flag F-, 3 flag MON, 4 pozycji OBS, 7 pozycji REACT-1
  i 2 obserwacji. Usunięto wyłącznie narrację napraw JUŻ WYKONANYCH —
  zarchiwizowaną verbatim w `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-15w`.
- **Nowa ⚡ TABLICA STERUJĄCA na początku pliku** — indeks wszystkich flag
  z kolumną „następny krok" w jednym zdaniu, rozdzielony na: A. wykonalne
  sesją audytową (29, sortowane wg priorytetu), B. zależne od dewelopera
  lub środowiska (4, sesja audytowa ich NIE zamknie), C. rejestry, które
  z definicji nie są „flagami do zamknięcia" (MON/OBS/REACT-1/O).
- Flagi pogrupowane tematycznie (1A luki z raportów pokrycia, 1B pozostałe
  luki, 1C flagi narzędziowe, 1D zależne od dewelopera) zamiast rozproszenia
  po 12 sekcjach DR, z których 6 nie zawierało żadnej otwartej flagi.
- **ZASADA 10 rozszerzona** o regułę „naprawa częściowa → skróć wiersz, nie
  dopisuj opisu" — usuwa przyczynę rozrostu rejestru u źródła.
- Trzy naprawy uboczne: rozklejony wiersz F-86 (cztery sklejone struktury
  wierszowe), usunięte nieaktualne odesłanie F-45 → „wciąż otwarta F-31"
  (zamknięta 2026-08-14o), uzupełniony zakres F-68 o Dział IV Tytułu IV KSH
  (584¹–584¹³), odnotowany w dzienniku, ale nieobecny w rejestrze zadań.
- ŻADNEJ flagi nie zamknięto ani nie otwarto — stan merytoryczny systemu
  po tej sesji jest identyczny jak przed nią.

**5.4 (2026-07-10b) — CRIT wykryty i naprawiony: naruszenie ZASADY 7 (OUTPUT-COMPLETENESS); zasada wzmocniona mechaniczną procedurą:**
- **Incydent:** naprawa `przesluchanie-swiadkow-v2-min90` (v3.6) oraz
  pierwsza wersja naprawy `audyt-systemu-v4` (v5.3) zostały dostarczone
  użytkownikowi jako pojedyncze pliki (`SKILL.md`, `AUDIT-JOURNAL.md`,
  `WARN-OTWARTE.md`) zamiast jako kompletne skille — bezpośrednie
  naruszenie ZASADY 7, mimo że zasada była obecna w SKILL.md przez cały
  czas trwania sesji. Sama proza reguły okazała się niewystarczająca do
  wymuszenia zachowania.
- **Naprawa natychmiastowa w tej samej sesji:** oba skille dostarczone
  ponownie jako kompletne archiwa ZIP (29/29 i 12/12 plików, zweryfikowane
  liczbowo względem oryginału).
- **Naprawa systemowa (ZASADA 7 wzmocniona):** dodano
  PRE-DELIVERY-COMPLETENESS-CHECK — obowiązkową, mechaniczną sekwencję
  (policz pliki oryginału → skopiuj całe drzewo → edytuj kopię → policz
  pliki po edycji → porównaj liczby → dopiero wtedy spakuj cały katalog
  do .zip → dopiero wtedy present_files). Wynik liczenia plików PRZED i
  PO musi być pokazany w odpowiedzi przed dostarczeniem — nie wystarczy
  odwołanie się do zasady z pamięci. `present_files` dla naprawy skilla
  dozwolone wyłącznie na zip całego katalogu, nigdy na pojedynczym pliku.
- Pełny opis incydentu: `AUDIT-JOURNAL.md`, wpis `AUDYT-2026-07-10b`.

**5.3 (2026-07-10) — ZASADA 11: rozszerzenie zakresu audytu na wszystkie skille prawne (stała zasada, nie precedens):**
- **ZASADA 11 dodana** (sekcja "Cel"): zakres audytu obejmuje odtąd
  wszystkie skille prawne w `/mnt/skills/user/`, nie tylko mapę Dz.U. i
  DR-01...DR-16. Obejmuje skille proceduralne (pisma-procesowe-v3,
  przesluchanie-swiadkow-v2-min90, analizator-dowodow-v3,
  chronologia-sprawy-v1 i inne), gdzie przedmiotem audytu jest domyślne
  (nie tylko na żądanie) stosowanie wbudowanych bramek jakości, a nie
  poprawność numeru aktu prawnego.
- **Powód wprowadzenia:** audyt na żywym przypadku (sprawa pracownicza,
  moduł przesłuchań świadków) ujawnił, że bramki jakości (WHY-GATE,
  QUESTION-ADMISSIBILITY-GATE) były stosowane reaktywnie — dopiero na
  wyraźne żądanie oceny — zamiast domyślnie przy generowaniu treści.
  Użytkownik wskazał wprost, że taka kontrola ma dotyczyć wszelkich
  skilli prawnych systemowo, a nie być jednorazowym wyjątkiem dla jednego
  skilla.
- **Pierwszy audyt pod nową zasadą — patrz `AUDIT-JOURNAL.md`, wpis
  `AUDYT-2026-07-10` (przesluchanie-swiadkow-v2-min90 → v3.6, cztery
  bramki dodane: GATE-DEFAULT-NOW, IMPORTED-QUESTIONS-GATE,
  DOCUMENT-SCAN-PROMPT, TEZY-DOWODY-SWIADEK-GATE).**
- **Otwarta flaga strukturalna (F-7, patrz WARN-OTWARTE.md):** pozostałe
  skille proceduralne systemu nie zostały jeszcze systematycznie
  sprawdzone pod kątem tych samych czterech wzorców braków — wymaga
  sesji dedykowanej per skill.

**5.2 (2026-07-07) — Wydzielony rejestr WARN-OTWARTE.md; ZASADA 10 (na polecenie użytkownika):**
- **Nowy plik `references/WARN-OTWARTE.md`** — rejestr żywy zawierający
  WYŁĄCZNIE aktualnie otwarte flagi audytowe (WARN numerowane + strukturalne
  F-N). AUDIT-JOURNAL.md pozostaje pełną, niezmienioną historią —
  zamknięcia trafiają tam, nie tutaj.
- **ZASADA 10 dodana:** otwarcie flagi → wiersz w WARN-OTWARTE.md + wpis
  w dzienniku; zamknięcie → usunięcie wiersza z WARN-OTWARTE.md + pełny
  wpis w dzienniku. Pytania "co otwarte" → czytaj WARN-OTWARTE.md
  najpierw, nie grepuj całego dziennika.
- Zaktualizowano FAZA 0 (wczytuje teraz też WARN-OTWARTE.md), TRYB
  WARN-CLOSE, ZASADĘ 5 i frontmatter `references:` — wszystkie odwołania
  do "otwartych WARN" wskazują teraz na nowy plik.
- Przy okazji naprawiono zdanie o ZASADZIE 7 (OUTPUT-COMPLETENESS)
  omyłkowo osierocone pod koniec ZASADY 9 w poprzedniej edycji —
  przywrócone do właściwego miejsca (koniec ZASADY 7).

**5.1 (2026-07-07) — WARN-12 i WARN-24 zamknięte; ZASADA 9 dodana; naprawiony rozjazd wersji:**
- **WARN-12 zamknięty:** legenda SIŁA_D w `shared/MOD-MACIERZ-DOWOD-TEZA.md`
  dostosowana do kanonicznej hierarchii A-D z
  `analizator-dowodow-v3/modules/MD1-klasyfikacja.md` (4 poziomy zamiast 3,
  dodana reprezentacja kategorii D).
- **WARN-24 zamknięty:** ustalono rzeczywisty zakres Dz.U. 2026 poz. 795 (zwykły
  nowy t.j. KC, nie odrębna nowelizacja) i Dz.U. 2026 poz. 644 (ustawa ESAP —
  omnibus ~17 ustaw sektora finansowego, KSH dotknięty tylko incydentalnie,
  wcześniej błędnie zakładano że to nowelizacja KSH-centryczna). Zaktualizowano
  `mapa_dzu_2026-07-04.md`, `dr-06/MAPA-AKTOW.md` (+1 wiersz), `dr-02/MAPA-AKTOW.md`
  (doprecyzowanie).
- **Dodano ZASADĘ 9** (przegląd okresowy WARN co ~10 wpisów dziennika lub na
  żądanie użytkownika) — reakcja na to, że WARN-12/24 pozostały niezauważone
  przez wiele sesji mimo formalnego statusu "otwarte".
- **Naprawiono rozjazd wersji:** frontmatter błędnie cofnięty do 4.7 mimo że
  CHANGELOG od dawna wskazywał 5.0 jako najnowszy wpis (analogiczne do
  wcześniej naprawianego WARN-10 w innym skillu — rozjazd version: vs
  CHANGELOG). Ustalono 5.1 jako kontynuację prawdziwego najnowszego stanu (5.0).
- Pełny przegląd całego dziennika (`grep WARN-[0-9]+`) potwierdził: WARN-1 do
  WARN-29 wszystkie zamknięte. Zero otwartych CRIT.

**5.0 (2026-07-04p) — PROJEKT "KATALOG WSZYSTKICH T.J." ZAKOŃCZONY:**
- **DR-15 (Compliance, ISO, Governance, Audyt):** sprawdzona — już w pełni
  zweryfikowana z sesji 2026-07-02aaaa (5/5 aktów krajowych), brak akcji.
- **DR-16 (Pisma, Strategia, Dowody, Orzecznictwo) — W PEŁNI SKATALOGOWANA:**
  Prawo prasowe (2018.1914) potwierdzone w pełni jako pierwszy i jedyny
  t.j. tej ustawy od 1984 r.
- **MILESTONE: wszystkie 16 dziedzin (DR-01 do DR-16) przeszły dedykowaną
  sesję katalogowania tekstów jednolitych.** Podsumowanie łączne projektu:
  ok. 20 błędnych/nieistniejących numerów Dz.U. naprawionych, 4 błędne
  klasyfikacje aktu (ustawa↔rozporządzenie), kilka duplikatów
  międzydomenowych skonsolidowanych, 3 fałszywe alarmy o rzekomych nowych
  t.j. rozstrzygnięte. Pozostają świadomie otwarte: 3 flagi strukturalne
  w DR-10 (wymagają przebudowy modułów) + pojedyncze flagi "WYMAGA
  AKTUALIZACJI MODUŁU" w kilku dziedzinach (treść modułu, nie numer).
- Podbicie wersji z 4.x na 5.0 odzwierciedla ukończenie pełnego cyklu
  katalogowania wszystkich 16 dziedzin — kamień milowy projektu.

**4.21 (2026-07-04o):**
- **DR-14 (Prawo UE, Międzynarodowe, Prawa Człowieka) — 2 pozycje krajowe
  domknięte:** ustawa o "obecności sił zbrojnych obcych" — POPRAWKA NAZWY
  I NUMERU: prawidłowa nazwa "ustawa o zasadach pobytu wojsk obcych na
  terytorium RP" (23.09.1999), aktualny t.j. Dz.U. 2024 poz. 1770 (było błędnie
  2020.1287, numer nienależący do tej ustawy); Prawo prywatne
  międzynarodowe (2023.503) w pełni potwierdzone.
- `mapa_dzu_2026-07-04.md` zaktualizowana.

**4.20 (2026-07-04n):**
- **DR-13 (Służby, Bezpieczeństwo, Informacje Niejawne) — 1 pozycja
  poprawiona:** ustawa o SOP — numer "2024.1672" nie odpowiadał żadnemu
  potwierdzonemu dokumentowi; prawidłowy łańcuch t.j.: 2023.66 → 2024.325
  → 2025.34 (aktualny).
- `mapa_dzu_2026-07-04.md` +2 wiersze (nowy OK, PREV chain uzupełniony).
- DR-13 kończy z 0 pozycji o niepotwierdzonym numerze podstawowym.

**4.19 (2026-07-04m):**
- **DR-12 (Sądownictwo, Prokuratura, Zawody Prawnicze) — 2 pozycje w
  tabeli dyscyplinarnej zamknięte:** izby lekarskie (Dz.U. 2021 poz. 1342
  potwierdzone jako nadal aktualne — poprzednia ostrożność po lekcji z
  fałszywym alarmem USW okazała się nadmiarowa, liczne dokumenty ze
  stycznia 2026 potwierdzają ten sam numer); medycyna laboratoryjna
  (POPRAWKA — poprzedni numer 2022.2280 był już nieaktualny, prawidłowy
  aktualny t.j. to 2023.2125, zgodnie z mapą centralną, która już to
  miała poprawnie — korekta propagowana do dr-10 i dr-12 lokalnie).
- Dodano nowy wiersz w mapie centralnej: ustawa o izbach lekarskich
  (2021.1342) — wcześniej całkowicie nieobecna.

**4.18 (2026-07-04l):**
- **DR-11 (Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP) — W PEŁNI
  SKATALOGOWANA:** ostatnia niejednoznaczność (ustawa o świadczeniu usług
  drogą elektroniczną) zamknięta — potwierdzony t.j. Dz.U. 2024 poz. 1513
  (było błędnie cytowane jako "2020.344 ze zm."), plus nowelizacja DSA z
  18.12.2025 zmieniająca ten sam tekst.
- `mapa_dzu_2026-07-04.md` zaktualizowana (+1 wiersz OK, 1 PREV).

**4.17 (2026-07-04k):**
- **DR-10 (Zdrowie, Farmacja, Żywność, Rolnictwo) — 1 flaga numeryczna
  zamknięta:** ustawa o imprezach turystycznych — potwierdzony t.j. Dz.U.
  2023.2211 (poprzedni numer "2022.2189" z dawnego wiersza zbiorczego nie
  odpowiadał żadnemu dokumentowi). Pozostają 3 flagi STRUKTURALNE (nie
  numeryczne): rolnictwo/żywność/weterynaria (wymaga rozbicia wiersza
  zbiorczego), zawody medyczne/prawnicze (błędnie nazwany plik modułu),
  izby lekarskie (brak dedykowanego modułu) — wymagają sesji dedykowanej z
  decyzjami strukturalnymi, nie tylko weryfikacji Dz.U.
- `mapa_dzu_2026-07-04.md` +1 wiersz.

**4.16 (2026-07-04j):**
- **DR-09 (Budownictwo, Środowisko, Energia, Transport) — 2 flagi zamknięte:**
  ustawa o odpadach — flaga PILNA o rzekomym nowym t.j. z 1.07.2026
  rozstrzygnięta jako FAŁSZYWY ALARM (źródło mylnie datowane, opisywało
  wydarzenie z 2023 r.; potwierdzono przez dokument z 11.05.2026, że
  2023.1587 nadal obowiązuje); ustawa OOŚ (2024.1112) w pełni potwierdzona.
  1 pozycja bez numeru pozostaje otwarta ("POŚ Szczegóły" — wymaga
  doprecyzowania zakresu, nie do rozstrzygnięcia samą weryfikacją Dz.U.).

**4.15 (2026-07-04i):**
- **DR-08 (Samorząd Terytorialny i Prawo Lokalne) — SKATALOGOWANA:** 2
  pozycje domknięte: nowelizacja ochrony ludności/obrony cywilnej z
  17.04.2026 zidentyfikowana jako Dz.U. 2026 poz. 646 (scalono z wcześniejszym
  wpisem MONITORING); ustawa o ogłaszaniu aktów normatywnych (2019.1461)
  potwierdzona jako nadal aktualna.
- **Rozstrzygnięty rzekomy konflikt numeracji:** flaga "MOŻLIWY KONFLIKT"
  dla Dz.U. 2026 poz. 646 (dwa różne opisane tematy — obrona cywilna vs.
  oświadczenia przy pozwoleniu na budowę) okazała się FAŁSZYWYM ALARMEM —
  to jedna wieloprzedmiotowa ustawa nowelizująca kilka aktów jednocześnie,
  w tym Prawo budowlane.
- `mapa_dzu_2026-07-04.md` zaktualizowana (3 wiersze poprawione/zamknięte).

**4.14 (2026-07-04h):**
- **DR-07 (Zamówienia Publiczne, Fundusze UE) — SKATALOGOWANA:** 2 pozycje
  domknięte: NIK (2022.623 w pełni potwierdzone), PPP (POPRAWKA — numer
  "1688" należał do zupełnie innego aktu z tego samego roku, prawidłowy
  t.j. to 2023.1637).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.13 (2026-07-04g):**
- **DR-06 (Podatki, Finanse Publiczne, AML) — W PEŁNI SKATALOGOWANA:**
  ostatnia niezweryfikowana pozycja (ustawa akcyzowa, Dz.U. 2025 poz. 126)
  potwierdzona jako poprawna (isap, infor.pl, dziennikustaw.gov.pl, MF).
  DR-06 kończy z 0 pozycji niezweryfikowanych (pozostają 2 flagi treści
  modułu: obligacje, interpretacje podatkowe — numery już poprawne).
- **Podsumowanie etapu:** DR-01 do DR-06 mają teraz 0 otwartych pozycji
  "weryfikuj numer" / "niezweryfikowane". Łącznie w projekcie katalogowania
  naprawiono dotąd 9 błędnych/nieistniejących numerów Dz.U. (KNF x2 warianty,
  Rada Ministrów, Fundusz Pomocy Pokrzywdzonym, pracownicy tymczasowi, SKO,
  cudzoziemcy/ochrona, Aktywny Rodzic duplikat, KRS) w 6 dziedzinach.

**4.12 (2026-07-04f):**
- **DR-05 (Prawo Administracyjne i Sądownictwo Administracyjne) — SKATALOGOWANA:**
  3 pozycje domknięte: ustawa o udzielaniu ochrony cudzoziemcom (nowy t.j.
  2025.223, było 2024.1546 — sync również w dr-13/ROUTING-MAP), SKO
  (POPRAWKA — numer "2023.825" niepotwierdzony w 6 źródłach, prawidłowy
  2018.570), skarga na przewlekłość (status podniesiony do "w pełni
  potwierdzone", trzykrotnie zweryfikowane w projekcie).
- Pozostaje 1 świadomie otwarta flaga PILNA (cudzoziemcy/Ukraina — zmiana
  systemowa, wymaga sesji merytorycznej dedykowanej, nie tylko numeru Dz.U.).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane
  (w tym duplikat cudzoziemcy/ochrona między dr-05 i dr-13).

**4.11 (2026-07-04e):**
- **DR-04 (Prawo Pracy, ZUS, Świadczenia Społeczne) — SKATALOGOWANA:** 2
  pozycje zamknięte: Ustawa Aktywny Rodzic (Dz.U. 2024 poz. 858, brak jeszcze
  t.j.), ustawa o zatrudnianiu pracowników tymczasowych (POPRAWKA — numer
  "2025.1682" był błędny/nieistniejący, prawidłowy to 2025.236, potwierdzone
  4 niezależnymi źródłami).
- **Duplikat wykryty i naprawiony:** dwa wiersze "Ustawa Aktywny Rodzic" w
  mapie centralnej — jeden poprawny (2024.858), drugi błędny (2023.2760,
  który w rzeczywistości to zupełnie inna ustawa o wsparciu odbiorców
  energii). Skonsolidowane.
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.10 (2026-07-04d):**
- **DR-03 (Prawo Karne, Wykroczenia, Egzekucja) — SKATALOGOWANA:** ostatnia
  otwarta pozycja (Fundusz Pomocy Pokrzywdzonym) zamknięta — okazało się być
  BŁĘDEM STRUKTURALNYM, nie tylko numeru: nie jest to odrębna ustawa, lecz
  rozporządzenie MS wydane na podstawie art. 43 KKW; poprzedni numer
  "2022.2256" nie istniał. Poprawiono na aktualny t.j. rozporządzenia
  Dz.U. 2025 poz. 1298. Sygnał o nowelizacji ustawy o przeciwdziałaniu
  narkomanii (11.06.2026) zaktualizowany — bill przeszedł Sejm, ale brak
  potwierdzonej publikacji w Dz.U. — flaga świadomie pozostaje otwarta.
- `mapa_dzu_2026-07-04.md` +1 wiersz (Fundusz Pomocy Pokrzywdzonym, rozporządzenie).
- DR-03 kończy z 0 pozycji "niezweryfikowanych"; pozostaje 1 flaga oczekująca
  na publikację aktu (narkomania, poza kontrolą audytu) + 2 flagi treści
  modułu (numery już poprawne).

**4.9 (2026-07-04c):**
- **DR-02 (Prawo Cywilne, Rodzinne i Gospodarcze) — SKATALOGOWANA:** 4 pozycje
  uprzednio "weryfikuj w ISAP" zamknięte: OZSS (2018.708 — potwierdzone
  aktualne), KK art. 233 (2025.383 — zsynchronizowane z dr-03), doradca
  restrukturyzacyjny licencja (2022.1007 — potwierdzone aktualne). KC
  (2025.1071) i KSH (2024.18) potwierdzone jako aktualne podstawowe t.j.
- **Wykryty i rozwiązany duplikat międzydomenowy (flaga otwarta z sesji
  DR-01):** ustawa o skardze na przewlekłość miała w mapie centralnej 3
  niespójne wiersze (2016.1259 błędny, 2023.1725 typu NW błędnie, 2023.1725
  typu TJ poprawny) — skonsolidowane do jednego kanonicznego wiersza TJ z
  konsumentami dr-01 + dr-05. Zweryfikowano bezpośrednio w `dr-05/MAPA-
  AKTOW.md`, że lokalny plik dr-05 już miał poprawny numer — błąd był
  wyłącznie w niezsynchronizowanej mapie centralnej.
- `mapa_dzu_2026-07-04.md` zaktualizowana (448 → 448 wierszy netto — 2 dodane
  jako duplikaty PREV, ale bez zmiany liczby aktywnych OK).

**4.8 (2026-07-04b):**
- **Rozpoczęto projekt "katalog wszystkich obowiązujących tekstów jednolitych
  ustaw"** — realizowany etapami, jedna dziedzina (DR) na sesję, zgodnie z
  zasadą "nigdy nie zgaduj numeru".
- **DR-01 (Ustrój Konstytucyjny i Źródła Prawa) — W PEŁNI SKATALOGOWANA:**
  11/11 aktów zweryfikowanych w ISAP. 2 akty dodane od zera (PUSA — Dz.U.
  2024.1297; skarga na przewlekłość — Dz.U. 2023 poz. 1725), 2 błędne numery
  poprawione (KRS: 2011.714→2024.1186; Rada Ministrów: 2022.2032 [numer
  nieistniejący]→2025.780), 1 duplikat wykryty i skonsolidowany (PUSP
  2024.334 pod dwiema nazwami), 1 flaga międzydomenowa otwarta (niespójność
  numeru skargi na przewlekłość między DR-01 i DR-05 — do zbadania w sesji
  DR-05).
- `mapa_dzu_2026-07-04.md` zaktualizowana (439 → 448 wierszy).

**4.7 (2026-07-04):**
- **TRYB WARN-CLOSE — 3 drugorzędne flagi z 2026-07-02eeee ZAMKNIĘTE:**
  WARN-KNF (duplikat "Ustawa o nadzorze KNF" — jedyny prawidłowy t.j.
  2025.640, poprzedni 2024.135; błędne 2024.136/2024.724 przeklasyfikowane),
  WARN-SPORT (rozdzielono "Ustawa o sporcie" 2026.95 od odrębnego aktu
  "Ustawa o bezpieczeństwie imprez masowych" — t.j. 2023.616, poprzedni
  2022.1466; turystyka pozostaje otwarta, niezweryfikowana), WARN-RZPAT
  (poprzedni wpis 2025.591 był rozporządzeniem wykonawczym, nie t.j. ustawy;
  prawidłowy aktualny t.j. to 2026.778, poprzedni 2024.749).
- Zaktualizowano `mapa_dzu_2026-07-02.md` → `mapa_dzu_2026-07-04.md` (432 →
  439 wierszy).
- Poprawki propagowane do: `dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md`,
  `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/MAPA-AKTOW.md`,
  `dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md`,
  `prawo-polskie-v2/ROUTING-MAP.md`.
- Wszystkie 3 numery zweryfikowane online (isap.sejm.gov.pl, infor.pl,
  prawo.pl) — żaden nie był zgadywany.
- CRIT-1 (5 plików shared/: MOD-TIMING, MOD-INTRO, MOD-KONCENTRACJA,
  MOD-PEER-REVIEW, MOD-DOKTRYNA) zweryfikowany jako JUŻ ZAMKNIĘTY —
  wszystkie 5 plików istnieją na dysku; wpis w AUDIT-JOURNAL był nieaktualny
  (pochodził z sesji 2026-06-23, naprawiony później bez odnotowania).

**4.6 (2026-07-02):**
- **WARN-26 ZAMKNIĘTY W CAŁOŚCI (16/16 kroków)** — pełna weryfikacja TRYB
  DZU wszystkich DR-skilli (dr-01…dr-16) + synchronizacja obu plików
  centralnych (`prawo-polskie-v2/ROUTING-MAP.md`: 46 wierszy;
  `mapa_dzu_2026-07-02.md`: 28 sync + 3 dodane). 68 błędów CRIT naprawionych
  łącznie w DR-MAPA-AKTOW w trakcie sesji. Wykryto i udokumentowano
  strukturalny dryf synchronizacji dysk↔centralne indeksy (dokładnie
  ryzyko zasygnalizowane we wcześniejszym audycie silnika) — naprawy
  punktowe w DR-skillach nie były propagowane automatycznie do
  ROUTING-MAP/mapa_dzu. 3 flagi świadomie pozostawione nierozstrzygnięte
  (duplikat KNF, możliwe rozdzielenie sport/imprezy masowe, niepotwierdzony
  t.j. rzeczników patentowych) zamiast zgadywania.


**4.5 (2026-06-17):**
- Dodano ZASADĘ 7: OUTPUT-COMPLETENESS — każda naprawa musi być dostarczona
  jako kompletny skill (wszystkie pliki + podfoldery), nie tylko zmieniony plik.
  Naruszenie = CRIT. Wyjątek tylko na explicite potwierdzenie dewelopera w sesji.

**4.4 (2026-06-14g):**
- Naprawiono nieaktualne odwołania `mapa_dzu_2026-06-07.md` → `mapa_dzu_2026-06-14.md`
  (12 miejsc w SKILL.md, w tym FAZA 0, FAZA 7B, drzewo plików)
- WARN-1/2/3 (zaległość z AUDYT-2026-06-04/05) formalnie zamknięte —
  patrz AUDIT-JOURNAL.md → AUDYT-2026-06-14g (skrócony)
- `shared/DEPENDENCY-GRAPH.md` uzupełniony o 20 brakujących wpisów
- 5 nowych plików ORPHAN w shared/ oznaczone (CHECKLIST-DEDUP NOTA-6, PENDING)
- Usunięto pliki archiwalne z `references/`: `SKILLS-MAP-AND-FIXES-2026-06-04.md`
  (snapshot 06-04, zastąpiony przez DEPENDENCY-GRAPH/CHECKLIST-DEDUP/mapa_dzu),
  `mapa_dzu_2026-06-07.md` (zastąpiony przez 06-14), `WARN-8-DZU-worksheet-2026-06-14.md`
  (worksheet zamknięty 16/16, treść skondensowana w AUDIT-JOURNAL)

**4.3:** PRAWO-HARDGATE KROK 2B/5B (NOTA-5, TK 2024-2026), AKTY-PRAWNE-MASTER
deprecated (WARN-7), WARN-8 zamknięty 16/16 (TRYB DZU), WARN-9 zamknięty.

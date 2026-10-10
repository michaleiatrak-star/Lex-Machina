---
name: audyt-systemu-v4
description: "Audyt jakości, spójności i bezpieczeństwa systemu prawnych skilli: zależności, wersje, mapy Dz.U., treść merytoryczna, propagacja zmian, deduplikacja i bramki jakości."
dependencies:
  requires:
    - shared
version: "6.217"   # zawsze w cudzysłowie (6.10 bez niego = float 6.1)
type: governance-audit
compatibility: "host-neutral; file read/write, fresh legal-source lookup and optional archive/UI operations mapped by the runtime adapter"
entrypoint: SKILL.md
modules:
  - modules/MOD-INTERLINIE.md
  - modules/MOD-WSTAWKI.md
  - modules/MOD-DESCRIPTION.md
  - modules/MOD-TRESC-MERYTORYCZNA.md
  - modules/MOD-PROPAGACJA-NOWELIZACJI.md
widgets:
  - widgets/WIDGET-MENU.md
references:
  - references/AUDIT-JOURNAL.md
  - references/F-113-PREFLIGHT-2026-08-26.md
  - references/HISTORIA-ZMIAN-PLIKOW.md
  - references/CHANGELOG.md
  - references/F-171-pomiar-domen-2026-09-09.md
  - references/F-152-pomiar-domen-2026-09-04.md
  - references/PORTALE-ORZECZNICZE-API.md
  - references/WARN-OTWARTE.md
  - references/CHECKLIST-DEDUP.md
  - references/mapa_dzu_2026-10-04.md
  - references/mapa_dzu_2026-08-28.md
  - references/ALIASY-NAZW-AKTOW.md
  - references/SKRYPTY-RECZNE.md
  - references/PROTOKOL-WYKONAWCZY-F113.md
  - references/PLAN-TESTU-BRAMEK-F113.md
  - references/REGRESSION-TEST-PLAN.md
  - references/SYNC-DZU-AUTOMATYCZNY.md
  - references/HARMONOGRAM-CRON.md
  - references/SCHEDULED-TASK-COWORK.md
  - references/PAMIEC-TRWALA-ROUTER.md
  - references/FORMAT-RAPORTU-ROZNIC.md
  - references/F-108-lista-MS-egzamin-2026.md
  - references/COWORK-HARMONOGRAM-NATYWNY.md
  - references/raporty-pokrycia-2026-08-13/
  - references/PLAN-POMIARU-BRAMEK-UNIWERSALNY.md
  - references/REJESTR-BRAMEK-POMIAR.json
  - references/REJESTR-KORPUSU-POMIAROWEGO.md
scripts:
  - scripts/check_wartosci_prawne.py
  - scripts/check_oplaty_mapa.py
  - scripts/check_utrata_tresci.py
  - scripts/check_wydanie.py
  - scripts/check_archiwa_repo.py
  - scripts/check_wejscie_dokumentu.py
  - scripts/check_eli_extract.py
  - scripts/check_plugin_manifest.py
  - scripts/check_kontrakt_rachunek.py
  - scripts/check_sekrety.py
  - scripts/check_graf_przyczynowy.py
  - scripts/check_mapy_aktow.py
  - scripts/test_mac_ce_litery.py
  - scripts/test_konstytucja_tekst_czysty.py
  - scripts/napraw_tekst_dzu.py
  - scripts/check_osiagalnosc_shared.py
  - scripts/check_sieroty.py
  - scripts/_lex_common.py
  - scripts/check_limit_plikow.py
  - scripts/check_tabele_satelickie.py
  - scripts/check_podmiana_aktu.py
  - scripts/check_widmowe_pokrycie.py
  - scripts/weryfikator_sygnatur.py
  - scripts/test_konstytucja_tekst_czysty.py
  - scripts/test_pokrycie_orkiestratora.py
  - scripts/test_module_registration.py
  - scripts/test_module_count.py
  - scripts/test_cross_map_dzu.py
  - scripts/test_header_snapshot.py
  - scripts/test_title_scope_match.py
  - scripts/test_moved_to_shared.py
  - scripts/check_wersje_changelog.py
  - scripts/check_dlugosc_modulow.py
  - scripts/build_ramie_kontrolne_f113.py
  - scripts/build_ramie_kontrolne.py
  - scripts/ocena_transkryptow_f113.py
  - scripts/check_description.py
  - scripts/check_sync_aktow.py
  - scripts/run_regression_suite.py
  - scripts/ci_check_shared.py
  - scripts/check_rejestracja_modulow.py
  - scripts/check_coverage_coherence.py
  - scripts/sync_dzu_eli.py
  - scripts/audit_tj_inventory.py
  - scripts/audit_amendment_scope.py
  - scripts/check_status_podstaw.py
  - scripts/check_wyjatek_gate_eli.py
  - scripts/check_checksums.py
  - scripts/check_nowelizacje_po_tj.py
  - scripts/check_frontmatter_yaml.py
  - scripts/check_domeny_allowlist.py
  - scripts/test_router_contract.py
  - scripts/check_frontmatter_rejestracja.py
  - scripts/test_f108_trade.py
  - scripts/test_f108_consistency.py
  - scripts/mock_eli_server_test.py
  - scripts/bootstrap_last_sync_date.py
  - scripts/dostarcz_skill.sh
  - scripts/install_precommit_hook.sh
  - scripts/README.md
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Tryby audytu, zasady kontroli merytorycznej, map Dz.U., deduplikacji, propagacji zmian, rejestrów i bramek jakości pozostają bez zmian.

1. `view audyt-systemu-v4/<plik>` oraz względne odwołania do `modules/`, `references/`, `scripts/` i `widgets/` oznaczają świeży odczyt lokalnego zasobu tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do paczki audytora. Brak obowiązkowego zasobu = fail-closed.
3. `view <inny-skill>/<plik>` oznacza odczyt/aktywację osobnego skilla przez mechanizm hosta. Audyt może kontrolować zależności między skillami, ale nie vendoryzuje ich.
4. `web_search` / `web_fetch` oznaczają świeże wyszukanie i odczyt źródła przez równoważną funkcję hosta. Przy audycie prawa zachowaj wymóg źródeł oficjalnych i nie traktuj pamięci modelu jako weryfikacji.
5. `present_files`, `create_file`, `show_widget`, `visualize:read_me`, Cowork i podobne nazwy są operacjami semantycznymi. Użyj równoważnej natywnej funkcji hosta, jeśli istnieje; jeśli nie, zastosuj tekstowy/plikowy fallback bez fikcyjnego raportowania wykonania.
6. Skrypty w `scripts/` mają wykrywać root repo względnie lub z `REPO_ROOT`/`LEX_MACHINA_ROOT`; nie zakładaj `/mnt/skills/user`. Twardy limit wydania pozostaje 200 plików na skill.
7. Audyt treści i narzędzi może raportować Claude-specific lub ChatGPT-specific tokeny jako portability warnings; sama obecność legacy nazwy nie jest automatycznie błędem, jeśli adapter semantyczny zapewnia równoważne wykonanie.
8. Nie ujawniaj prywatnego chain-of-thought jako produktu audytu. Raportuj wykryte fakty, ślady weryfikacji, testy, różnice, ryzyka i rekomendowane poprawki.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


# audyt-systemu-v4 — Orchestrator Audytu Systemu Prawnego

## Cel
Audyt jakości, spójności i bezpieczeństwa systemu prawniczych skilli AI.
Po zakończeniu audytu: **obowiązkowa aktualizacja plików references**.

> ⚙️ **ZASADA 11 (2026-07-10, STAŁA — nie precedens):** Zakres audytu obejmuje
> **wszystkie skille prawne w systemie**, nie tylko mapę Dz.U. i skille DR-01
> do DR-16. Obejmuje to również skille proceduralne (np. `pisma-procesowe-v3`,
> `przesluchanie-swiadkow-v2-min90`, `analizator-dowodow-v3`,
> `chronologia-sprawy-v1`), gdzie przedmiotem audytu nie jest poprawność
> numeru aktu prawnego, lecz **poprawność i domyślne (nie tylko na żądanie)
> stosowanie wbudowanych bramek jakości** (np. zakazy pytań sugestywnych,
> wymóg rekonstrukcji tezy, wymóg jawnego potwierdzenia ról/dowodów/tez przed
> generowaniem treści). Wpis dokumentujący taki audyt trafia do tego samego
> `AUDIT-JOURNAL.md`, z jawnym wskazaniem w tytule sekcji, że dotyczy skilla
> proceduralnego, a nie mapy Dz.U. — żeby FAZA 3 (Dz.U.) nie myliła kontekstów.
> Ta zasada nie jest jednorazowym wyjątkiem — obowiązuje dla każdego kolejnego
> audytu, dowolnego skilla w ``.

---

> ⚙️ **ZASADA 12 (2026-07-16, STAŁA — nie precedens):** Audyt map Dz.U.
> (FAZA 3A–3D) i audyt treści merytorycznej modułów (FAZA 3E,
> `MOD-TRESC-MERYTORYCZNA.md`) to **dwa odrębne zakresy kontroli, oba
> obowiązkowe**. Aktualizacja numeru/statusu tekstu jednolitego w
> `mapa_dzu`/`MAPA-AKTOW.md` (np. `OK` → `PREV`, dodanie nowego wiersza
> `TJ`) **nie jest równoznaczna** ze sprawdzeniem, czy opisowa treść
> modułu `dr-XX/modules/mod-*.md` (progi, terminy, definicje, przesłanki)
> nadal odpowiada aktualnemu stanowi prawnemu. FAZA 3E uruchamia się
> automatycznie po każdej sesji FAZA 3, w której wykryto zmianę statusu
> aktu — nie jest opcjonalna i nie wymaga osobnego wywołania. Naruszenie
> (zamknięcie FAZA 3 bez FAZA 3E mimo wykrytej zmiany) = **CRIT**.

---

> ⚙️ **ZASADA 13 (2026-07-17, STAŁA — nie precedens):** Ponowna weryfikacja
> oznaczeń/skrótów prawnych + wytrwałość wyszukiwania + oznaczanie przy
> każdym użyciu. Pełna treść i uzasadnienie: `shared/PRAWO-HARDGATE.md`
> wersja 2.4. Skrót operacyjny na potrzeby audytu:
> 1. Każde niepotwierdzone źródłowo oznaczenie/skrót prawny, gdy pojawia
>    się PONOWNIE w dalszej części rozmowy jako podstawa wniosku, wymaga
>    NOWEJ weryfikacji — przywołanie z pamięci wcześniejszej hipotezy
>    (nawet własnej) NIE wystarcza i nie podnosi jej do statusu ustalonego
>    faktu.
> 2. Pierwsze wyszukiwanie bez jednoznacznego potwierdzenia z aktu
>    źródłowego NIE kończy weryfikacji — kontynuuj różnymi zapytaniami
>    (pełna nazwa instytucji/rejestru, synonimy, szersze/węższe ujęcie)
>    zamiast zatrzymywać się na hipotezie prawdopodobieństwa.
> 3. ⚠️ [NIEWERYFIKOWANE] musi towarzyszyć KAŻDEMU wystąpieniu
>    niepotwierdzonego oznaczenia w odpowiedzi/dokumencie, nie tylko
>    pierwszemu wprowadzeniu.
>
> Przy audycie treści merytorycznej (FAZA 3E) i przy każdym audycie
> skilli operujących na sygnaturach/repertoriach/oznaczeniach
> instytucjonalnych — sprawdź zgodność z tą zasadą jako osobny punkt.
> Naruszenie (powtórne użycie niepotwierdzonego oznaczenia bez ponownej
> weryfikacji lub bez powtórzonego ⚠️ [NIEWERYFIKOWANE]) = **CRIT**.

---

> ⚙️ **ZASADA 14 (2026-07-26, STAŁA — nie precedens):** Gradacja źródeł
> przy weryfikacji merytorycznej (FAZA 3E) — obowiązkowe stosowanie
> `shared/HIERARCHIA-ZRODEL.md` (Rząd 1/2A/2B/3), nie tylko przy
> podawaniu linków użytkownikowi, ale RÓWNIEŻ jako metodologia SAMEJ
> weryfikacji przy audycie. Ustalone po dwóch transzach FAZA 3E
> (AUDYT-2026-07-26h/i), na wyraźne polecenie użytkownika.
>
> **Procedura, w kolejności:**
> 1. **Rząd 1 — ELI, próba pierwsza, zawsze (kanon E-1…E-5,
>    `shared/HIERARCHIA-ZRODEL.md`, od audytu 6.125).** Brzmienie i stan
>    aktu z `api.sejm.gov.pl/eli` kanałem kodu (`text.pdf` t.j.,
>    `/references` dla zmian), host bez kanału kodu — B-1 → B-2 na
>    `eli.gov.pl`. ISAP (`isap.sejm.gov.pl`) wyłącznie jako link dla
>    człowieka; jego blokada to stan normalny, nie powód do zejścia rzędu.
> 2. **Rząd 2A/2B jako główne potwierdzenie** wyłącznie, gdy ELI zawiódł
>    i ISAP (akt niepobieralny z RZĘDU 1 — awaria, timeout, blokada; wynik
>    zapisany): LEX/Legalis, potem lexlege.pl,
>    arslege.pl, prawo.pl i analogiczne z rejestru
>    `HIERARCHIA-ZRODEL.md`/`PORTALE-BRANZOWE-RZAD-2B.md`. Traktuj jako
>    wiarygodne dla BRZMIENIA przepisu, ale NIGDY nie zaznaczaj wyniku
>    jako ✅ [VER] tak jakby to był Rząd 1 — użyj oznaczenia zgodnego z
>    `shared/WERYFIKACJA-SLAD.md` odpowiedniego dla źródła Rządu 2.
> 3. **Rząd 3 (blogi kancelaryjne) — WYŁĄCZNIE jako dodatkowe
>    potwierdzenie zbieżności, NIGDY jako jedyne źródło.** Wysoka liczba
>    zgodnych źródeł Rządu 3 (5+) wokół tego samego brzmienia ZWIĘKSZA
>    pewność, ale nie zastępuje braku Rządu 1/2 — jeśli WSZYSTKIE
>    dostępne źródła to Rząd 3, oznacz wynik jako potwierdzony z
>    zastrzeżeniem niższej kategorii źródła, nie jako pełne ✅.
> 4. **Próg potwierdzenia:** minimum 2-3 źródła NIEZALEŻNE (różne domeny,
>    różni wydawcy) zgodne ze sobą, zanim twierdzenie modułu zostanie
>    oznaczone jako sprawdzone. Rozbieżność między źródłami = sygnał do
>    DALSZEGO wyszukiwania (inne zapytanie, inny kąt), nie do wyboru
>    jednego źródła arbitralnie (patrz ZASADA 13, pkt 2 — wytrwałość
>    wyszukiwania stosuje się też tutaj).
> 5. **Każdy wynik weryfikacji FAZA 3E w AUDIT-JOURNAL.md wskazuje
>    WYRAŹNIE, z jakiego Rzędu pochodziło potwierdzenie** (nie tylko
>    nazwy domen) — np. "potwierdzone w lexlege.pl (Rząd 2B) oraz 5
>    źródłach Rządu 3" — żeby czytelnik dziennika mógł ocenić siłę
>    dowodową ustalenia bez ponownego sprawdzania.
>
> Naruszenie (oznaczenie twierdzenia jako "zweryfikowane" na podstawie
> WYŁĄCZNIE jednego źródła Rządu 3, lub bez wskazania Rzędu w ogóle) =
> **WARN**, nie CRIT — to zasada jakości dowodu, nie zakaz absolutny jak
> PRAWO-HARDGATE, ale traktuj ją jako obowiązkową praktykę FAZA 3E.

> ⚙️ **ZASADA 15 (2026-08-20z4, STAŁA — nie precedens; na wyraźne polecenie
> użytkownika):** **Historia zmian KAŻDEGO skilla mieszka wyłącznie w osobnym
> pliku `references/CHANGELOG.md`.** W SKILL.md nie ma sekcji `## CHANGELOG`
> z wpisami — dopuszczalne jest wyłącznie odesłanie do pliku; pole `changelog:`
> w YAML pozostaje krótkim skrótem bieżącej wersji (do ~15 linii), nigdy pełną
> listą wpisów.
>
> Uzasadnienie nie jest porządkowe, tylko funkcjonalne: rozproszenie historii
> między trzy lokalizacje (korpus SKILL.md, frontmatter, `references/`) było
> BEZPOŚREDNIĄ przyczyną fałszywych wyników testu T12 w sesji 2026-08-20z3 —
> test szukał wpisów w `references/`, nie znajdował ich (bo leżały w SKILL.md)
> i raportował luki, których nie było. W `pisma-procesowe-v3` groziło to
> dopisaniem pięciu zmyślonych wpisów. Jedna lokalizacja kanoniczna usuwa całą
> tę klasę błędu — i ten sam argument dotyczy każdego przyszłego narzędzia,
> które będzie czytać historię automatycznie.
>
> Egzekwowanie: test **T12** (`scripts/check_wersje_changelog.py`) zgłasza
> sekcję z wpisami w korpusie jako ⛔, a pole `changelog:` dłuższe niż 15 linii
> jako ⚠️. Nowy skill BEZ `references/CHANGELOG.md` jest dopuszczalny tylko
> dopóki nie ma historii — przy pierwszym wpisie plik zakłada się od razu.
>

---

## FAZA 0 — WCZYTANIE REFERENCES (ZAWSZE PIERWSZE)

> ⚠️ **NAPRAWA 2026-08-15 (F-80, wykryta na skutek pytania użytkownika o
> scheduled task):** 15 plików istniało fizycznie na dysku (references/
> i scripts/), ale nie było wpisanych do YAML frontmatter powyżej —
> dokładnie ten sam wzorzec luki, jaki `scripts/check_rejestracja_modulow.py`
> wykrywa dla modułów DR (F-33/F-77), tylko dotyczący plików SAMEGO
> audyt-systemu-v4. Naprawione: wszystkie 15 plików dopisane do
> `references:`/`scripts:` w YAML. Zawierało: `SYNC-DZU-AUTOMATYCZNY.md` +
> `HARMONOGRAM-CRON.md` + `FORMAT-RAPORTU-ROZNIC.md` (mechanizm
> automatyzacji wykrywania nowych pozycji Dz.U. — odpowiedź na pytanie o
> "scheduled task": TAK, istnieje jako gotowy DO ADAPTACJI kod cron/GitHub
> Actions, ale wymaga wdrożenia przez developera w środowisku z dostępem do
> api.sejm.gov.pl — Claude w tej sesji czatu nie ma własnego mechanizmu
> cyklicznego uruchamiania), 3 archiwalne mapy Dz.U., folder
> `raporty-pokrycia-2026-08-13/`, oraz 7 skryptów pomocniczych (w tym
> `check_rejestracja_modulow.py` — ironicznie, sam był plikiem-sierotą).
> Szczegóły: `AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-15h.

Przed jakimkolwiek działaniem wczytaj:

```
ODCZYT DZIENNIKA (wyłącznie potrzebny fragment — procedura niżej)
view audyt-systemu-v4/references/WARN-OTWARTE.md
view audyt-systemu-v4/references/CHECKLIST-DEDUP.md
USTAL AKTUALNA_MAPA_DZU: wylistuj references/mapa_dzu_YYYY-MM-DD.md,
wybierz plik z najpóźniejszą datą w nazwie i sprawdź, że da się go odczytać
view AKTUALNA_MAPA_DZU
```

⛔ **Nie wczytuj całego `AUDIT-JOURNAL.md`** (ok. 71 tys. linii, ok. 4 MB) — ani
w FAZIE 0, ani w 7A. Odczytuj tylko potrzebny fragment:

```bash
J=audyt-systemu-v4/references/AUDIT-JOURNAL.md
# najnowszy wpis = najwyższy identyfikator AUDYT-…, nie ostatnia pozycja w pliku
N=$(grep -n '^## AUDYT-[0-9]' "$J" | LC_ALL=C sort -t' ' -k2,2 | tail -1 | cut -d: -f1)
# odczyt najnowszego wpisu: od linii N do nagłówka następnego wpisu
sed -n "${N},$((N+120))p" "$J" | awk 'NR>1 && /^## /{exit} {print}'
# szablon wpisu (tylko przy pisaniu, FAZA 6/7A)
S=$(grep -n '^## SZABLON NOWEGO WPISU' "$J" | cut -d: -f1); sed -n "${S},$((S+38))p" "$J"
```

Wcześniejsze wpisy czytaj tylko wtedy, gdy zadanie ich wymaga (np. `grep -n
'AUDYT-2026-08-15h' "$J"` → odczyt zakresu linii tego wpisu).

⛔ Nie wpisuj na stałe daty bieżącej mapy w procedurze. Każda nowa generacja
zmienia nazwę pliku; brak dynamicznego wyboru powodował odwołania do usuniętej
mapy z 2026-08-21 mimo obecności mapy z 2026-08-26. Brak choć jednego pliku
`mapa_dzu_YYYY-MM-DD.md` albo błąd odczytu najnowszego = CRIT i STOP.

Celem jest ustalenie:
- Jaki był wynik ostatniego audytu (AUDIT-JOURNAL.md → ostatni wpis `## AUDYT-YYYY-MM-DD`)
- Czy wprowadzane zmiany dotyczą pojęcia już skatalogowanego w CHECKLIST-DEDUP.md
  (jeśli TAK → edytuj lokalizację kanoniczną, NIE twórz nowego wpisu — patrz
  "PROCEDURA UŻYCIA" w CHECKLIST-DEDUP.md)
- Czy edytowany moduł jest na liście modułów >400 linii (NOTA-4 w
  CHECKLIST-DEDUP.md) — jeśli TAK, rozważ podział "przy okazji"
- Jakie WARN/flagi są otwarte i wymagają zamknięcia — źródło: `WARN-OTWARTE.md`
  (ZASADA 10), NIE przeszukiwanie całego AUDIT-JOURNAL.md
- Jaka jest aktualna mapa skilli i Dz.U.

---

## FAZA 0B — INTERAKTYWNY WYBÓR ZAKRESU

Gdy użytkownik wywołuje audyt **bez precyzowania zakresu** (np. "przeprowadź audyt", "audytuj system"):

1. Wyrenderuj menu wielokrotnego wyboru: `show_widget(path="audyt-systemu-v4/widgets/WIDGET-MENU.md")` — host czyta kod JSX z pliku; nie przepisuj go.

2. Host bez `path`: `view audyt-systemu-v4/widgets/WIDGET-MENU.md` → `show_widget` z kodem JSX z pliku.

3. Czekaj na wybór użytkownika. Po otrzymaniu — uruchom **tylko wskazane fazy/moduły**.

Gdy użytkownik podał konkretny tryb lub zakres → pomiń widget, przejdź bezpośrednio do właściwej fazy.

---

## FAZA 0C — ZADANIE CYKLICZNE W COWORK (POZYCJA 11, TYLKO NA ŻĄDANIE)

*(dodane 2026-08-15o; od 2026-10-10 wyłącznie na wyraźne żądanie użytkownika.)*

⛔ **Nigdy nie proponuj zadania cyklicznego automatycznie** — ani na końcu
audytu, ani po wykryciu Cowork. FAZĘ 0C uruchamia wyłącznie: wybór pozycji 11
menu (`widgets/WIDGET-MENU.md`, id `harmonogram`) albo jednoznaczna prośba
użytkownika o utworzenie zadania.

Po takim żądaniu sprawdź łącznie:

1. sesja toczy się w **Cowork** (poza Cowork: poinformuj jednym zdaniem, nie twórz);
2. użytkownik **nie ma jeszcze** zadania cyklicznego „Cotygodniowa weryfikacja
   ISAP" w harmonogramie Cowork.

⛔ **Warunku 2 NIE zgaduj** — Claude nie widzi listy zadań harmonogramu. Bez
jednoznacznego potwierdzenia w kontekście: zapytaj jednym zdaniem.

Jeśli oba spełnione → utwórz zadanie **dosłownie** wg
`references/SCHEDULED-TASK-COWORK.md` (§ 2A Description, § 2B prompt — treść
kanoniczna, bez parafrazy). Blok map pokrycia (§ 3 tamże) dołączaj do promptu
wyłącznie po **zamknięciu flagi F-83**; dopóki otwarta — pomiń i odnotuj.
Wynik (utworzono / odmowa / już istniało) zapisz w AUDIT-JOURNAL.md jednym zdaniem.

Wariant natywny (harmonogram wbudowany w Cowork, bez infrastruktury developera): `references/COWORK-HARMONOGRAM-NATYWNY.md` (do 6.146 plik bez odwołania z treści).

Pozycja 11 może być wybrana samodzielnie albo razem z pozycjami audytowymi
(wtedy zadanie tworzy się po audycie).

---

## FAZA 0D — KONTRAKT ROUTERA W PREFERENCJACH (POZYCJA 13, od 6.125)

Po wyborze pozycji 13 albo poleceniu „zsynchronizuj pamięć routera”:

1. `view references/PAMIEC-TRWALA-ROUTER.md`;
2. porównaj preferencje użytkownika widoczne w kontekście z regułami UP-1…UP-6
   routera (treść, nie numer wersji);
3. pokaż rozbieżności i proponowany tekst preferencji (≤ 4 linie, bez numeru
   wersji) do wklejenia przez użytkownika w Ustawienia → Profil;
4. odnotuj wynik w `AUDIT-JOURNAL.md`, jeżeli host pozwala na zapis.

⛔ Zakaz zapisu bloków dyrektyw do pamięci trwałej hosta. Pomiar z sesji
produkcyjnej: klasyfikator pamięci odrzuca treść sterującą zachowaniem modelu —
zapis jest niewykonalny z założenia, a ponowienie lub przeformułowanie
stanowiłoby obchodzenie zabezpieczenia. Wynik stały: `ZAPIS: NIEOBSŁUGIWANE W HOŚCIE`.

## FAZA 0E — INSTALACJA SERWERÓW MCP (POZYCJA 14; wybór serwerów i klucz CEIDG od 6.152)

Po wyborze pozycji 14 menu („Instalacja serwerów MCP”, plakietka 🖥️ *działa w Claude Desktop*)
albo poleceniu „zainstaluj serwery MCP”. Narzędzie: `mcp-servers/instaluj_serwery_mcp.py` (ten skill).
Przebieg ma **trzy tury**: (1) lista wyboru → (2) instalacja wybranych + prośba o klucz CEIDG, jeśli
wybrano CEIDG → (3) sam klucz w kolejnej wiadomości → uzupełnienie. Tura 3 jest opcjonalna.

⛔ **Działa w Claude Desktop.** claude.ai w przeglądarce nie uruchamia serwerów lokalnych — tam
wynikiem jest plik rozszerzenia do zainstalowania w Desktopie. Nie obiecuj działania w przeglądarce.

**0. LISTA WYBORU (tura 1) — zanim cokolwiek zbudujesz.** Jedynym źródłem listy jest
`python mcp-servers/instaluj_serwery_mcp.py --lista` (stan 6.202: 16 serwerów w 3 grupach, numeracja
stała); nie przepisuj jej z pamięci. Zapytaj jednym zdaniem, które serwery zainstalować:
   - host z przyciskami wyboru (np. `ask_user_input_v0`, limit 3 pytania × 4 opcje): **jedno pytanie
     multi_select na poziomie GRUP** z `--lista` — „Akty prawne i orzecznictwo”, „Rejestry podmiotów
     (CEIDG wymaga klucza)”, „Podatki, finanse, dane osobowe”, „Wybiorę numerami”. Pojedynczych serwerów
     nie rozpisuj na przyciski: grupa orzecznicza ma 9 pozycji, więcej niż mieści pytanie (korekta 6.202 —
     dawny opis „trzy pytania = trzy grupy, ≤4 opcje” był niewykonalny od dodania sn/sp/tk/kio/etpcz).
     „Wybiorę numerami” → pokaż wynik `--lista` i poproś o numery;
   - host bez przycisków: pokaż wynik `--lista` i poproś o odpowiedź numerami, nazwami albo „wszystkie”;
   - użytkownik od razu napisał „wszystkie” / wymienił serwery → pomiń pytanie.
   **Przy CEIDG zawsze** (także w pytaniu z przyciskami — w zdaniu wprowadzającym) podaj link do
   klucza: **https://dane.biznes.gov.pl/pl/portal/034872** (Hurtownia danych CEIDG: „wypełnij wniosek
   o dostęp i zarejestruj się”, logowanie Profilem Zaufanym; token JWT = klucz API).
   Po wysłaniu pytania zakończ turę.

1. **Ścieżka pomiarem, nie domysłem (tura 2).** `python mcp-servers/instaluj_serwery_mcp.py --diagnoza`.
   `WYBÓR` = numery/nazwy z tury 1 (argument `--serwery` przyjmuje jedne i drugie).
   - **kod 0 — „ŚCIEŻKA: --scal-desktop”** (komputer z Claude Desktop: Claude Code, terminal lokalny).
     Jednym zdaniem uprzedź, że skrypt dopisze wybrane serwery `lex-*` do `claude_desktop_config.json`
     i zrobi kopię `.kopia-przed-lex`; następnie `… --scal-desktop --serwery WYBÓR --bez-pytan`.
     Przekaż wynik dosłownie (✅/⛔, ścieżka kopii); poproś o restart Claude Desktop.
   - **kod 3 — „ŚCIEŻKA: --mcpb”** (piaskownica: claude.ai, czat Desktop, Cowork):
     `… --mcpb <katalog wyjściowy hosta> --serwery WYBÓR` → `lex-machina.mcpb` tylko z wybranymi
     serwerami (manifest wymienia wyłącznie ich narzędzia); udostępnij plik (`present_files`).
     Instrukcja: Claude Desktop → Ustawienia → Rozszerzenia → zainstaluj z pliku.
     ⛔ Przy kodzie 3 NIGDY nie uruchamiaj `--scal-desktop` i nie raportuj „zainstalowano”.
   - **Bez wykonania kodu:** podaj polecenie do uruchomienia u siebie
     (`python <katalog skilla>/mcp-servers/instaluj_serwery_mcp.py --scal-desktop --serwery WYBÓR`)
     — bez fikcyjnego raportu wykonania (adapter hosta, zasada 5).
   - **Wybrano CEIDG, a klucza jeszcze nie ma** → na końcu odpowiedzi DOKŁADNIE ta treść w sensie:
     „Klucz CEIDG uzyskasz tu: https://dane.biznes.gov.pl/pl/portal/034872. Gdy go dostaniesz, **wklej
     w kolejnej wiadomości sam klucz** — sprawdzę go i uzupełnię instalację o CEIDG.” (Na ścieżce
     `.mcpb` dodaj: albo wpisz go sam w polu „Klucz API CEIDG” rozszerzenia.) Bez klucza serwer
     CEIDG jest nieaktywny — pozostałe działają normalnie.

2. **KLUCZ W KOLEJNEJ WIADOMOŚCI (tura 3).** Wyzwalacz: wiadomość, której treścią jest (prawie)
   wyłącznie token JWT (`eyJ….eyJ….…`), w rozmowie, w której trwa FAZA 0E albo padła prośba z pkt 1.
   ⛔ Token to dane osobowe — ładunek (base64, nie szyfrowanie) zawiera PESEL, imię i nazwisko:
   - NIE powtarzaj tokenu ani jego fragmentów w odpowiedzi, NIE dekoduj na głos PESEL-u, NIE zapisuj
     go w pamięci rozmów ani w plikach skilla; w myśleniu nie przepisuj go ponad potrzebę polecenia;
   - zapisz go do pliku POZA katalogiem skilla z uprawnieniami 600 (piaskownica: plik roboczy hosta,
     np. `~/.ceidg_token`; komputer użytkownika: `~/.lex-machina/ceidg.token`);
   - `… --ceidg-test --ceidg-klucz-plik PLIK` (jedno żądanie; 204/200 = działa, 401 = zły lub wygasły
     → podaj link ponownie i poproś o nowy klucz; 429 → poproś o ponowienie za kilka minut, nie ponawiaj sam);
   - po teście 204/200:
     • kod 0 → `… --scal-desktop --serwery ceidg --ceidg-klucz-plik PLIK` (uzupełnia istniejącą
       instalację wyłącznie o CEIDG; konfiguracja z tokenem ląduje w `~/.lex-machina/`, nie w repo);
     • kod 3 → `… --mcpb <katalog wyjściowy> --serwery WYBÓR --ceidg-klucz-plik PLIK` →
       **`lex-machina-osobisty.mcpb`** z kluczem wpisanym na stałe (CEIDG dołączany automatycznie).
       Powiedz wprost: przed instalacją odinstaluj wcześniejsze „Lex Machina”; plik jest OSOBISTY
       (zawiera token) — nie udostępniać, nie wrzucać do repozytorium;
     • w piaskownicy usuń plik z tokenem po zbudowaniu rozszerzenia;
   - przypomnij jednym zdaniem, że token pozostaje w historii tej rozmowy (decyzja użytkownika, czy ją usunąć).
   Brak wybranego wcześniej zestawu (tura 3 bez tur 1–2) → przyjmij „wszystkie”.

3. **Kontrola po instalacji** (nowa rozmowa w Claude Desktop): narzędzia `lex-*` widoczne; wywołanie
   `nbp_kurs_waluty` dla EUR (jeśli wybrany) zwraca FOUND; `ceidg_szukaj_firmy` dla NIP spółki
   → NOT_FOUND z odesłaniem do KRS (dowód, że klucz działa). `cbosa_sprawdz_sygnature` „III OSK 1959/22”
   → FOUND zamyka **F-213** (z sandboxa Claude CBOSA jest nieosiągalna).
4. Zapisz w AUDIT-JOURNAL.md jednym zdaniem: ścieżka, wybrane serwery, CEIDG tak/nie — **bez tokenu**.

---

## FAZA 1 — INWENTARYZACJA SYSTEMU

```bash
find "${LEX_MACHINA_SKILLS_ROOT:?}" -not -path "*/archive/*" | sort
```

Jeżeli host nie udostępnia zmiennej, najpierw rozwiąż semantyczny katalog
zainstalowanych skilli wg adaptera runtime i użyj jego rzeczywistej ścieżki.

Zbuduj tabelę: skill → liczba plików → rozmiar → status (✅/⚠️/❌).

Porównaj z ostatnim snapshotem z AUDIT-JOURNAL.md (sekcja "STRUKTURA SYSTEMU — SNAPSHOT").
Wykryj: nowe skille, usunięte skille, zmienione rozmiary.

---

## FAZA 2 — WERYFIKACJA ZALEŻNOŚCI

### 2A — Spójność ścieżek

Dla każdego SKILL.md sprawdź, czy wszystkie `view`/`load` odwołania wskazują na istniejące pliki:

```bash
grep -r "view " "${LEX_MACHINA_SKILLS_ROOT:?}" --include="*.md" | grep -v archive
```

Każda ścieżka nieistniejąca = błąd **CRIT**.

### 2B — Wersje skilli w cross-referencjach

Sprawdź, czy żaden skill nie odwołuje się do usuniętej wersji innego skilla (np. v1 zamiast v2):

```bash
grep -r "przewodnik-prawny-v1\|analiza-sadowa-v5\|pisma-procesowe-v2" \
  "${LEX_MACHINA_SKILLS_ROOT:?}" --include="*.md" | grep -v archive
```

Dodaj tu wzorce wg historii napraw z `references/CHANGELOG.md` i `references/CHECKLIST-DEDUP.md`.
*(Do 2026-08-20y ta linia odsyłała do `SKILLS-MAP-AND-FIXES` — pliku USUNIĘTEGO
2026-06-14g i zastąpionego przez CHANGELOG/CHECKLIST-DEDUP/mapa_dzu. Odwołanie
przetrwało 2 miesiące i ~90 sesji, bo FAZA 2A sprawdza tylko ścieżki `view`, a to
była nazwa w prozie — wzorzec do uwzględnienia przy rozbudowie testu T6.)*

### 2C — Pole description: OBECNOŚĆ + profil uniwersalny ≤200 znaków

Wczytaj moduł i uruchom procedurę:

```
view audyt-systemu-v4/modules/MOD-DESCRIPTION.md
```

Kontrola automatyczna (test **T14**, zalecana zamiast ręcznego liczenia):

```bash
python3 audyt-systemu-v4/scripts/check_description.py "${LEX_MACHINA_SKILLS_ROOT:?}"
```

**Brak pola / pole puste = CRIT** (F-130). Długość >200 = **CRIT**,
181–200 = **WARN**, ≤180 = **OK**. To wspólny profil przenośności; nie
utrzymuj osobnych opisów per host.

> ⛔ **ROZSZERZENIE 2026-08-24 (F-130).** Ta faza sprawdzała dotąd WYŁĄCZNIE
> długość — i przez to była ślepa na jedyny przypadek, który naprawdę wystąpił:
> **brak pola w ogóle**. Skrypt z `MOD-DESCRIPTION.md` dla takiego pliku wypisywał
> `0` znaków i klasyfikował go jako ✅ OK. `audyt-systemu-v4` — ten plik — był
> JEDYNYM skillem w systemie bez `description:`, przez nieustaloną liczbę sesji,
> i żadna faza tego nie zgłosiła. Naprawione na wskazanie użytkownika.

---

## FAZA 2D — CZYSTOŚĆ KODU (NOWE MODUŁY)

### 2D-1 — Zbędne interlinie

Wczytaj moduł:
```
view audyt-systemu-v4/modules/MOD-INTERLINIE.md
```

Wykonaj procedurę wykrycia → napraw każdy plik z ≥2 kolejnymi pustymi liniami → zapisz wynik do raportu.

### 2D-2 — Wstawki opisowe

Wczytaj moduł:
```
view audyt-systemu-v4/modules/MOD-WSTAWKI.md
```

Wykonaj skan regex → oceń każde trafienie wg tabeli kwalifikacji → usuń tylko jednoznacznie opisowe wstawki → zapisz wynik do raportu.

**Zasada obu modułów**: zmiany tylko przez `str_replace` na skopiowanych plikach. Nigdy `sed -i` na `` (read-only mount).

---

## FAZA 3 — WERYFIKACJA MAPY Dz.U.

Wczytaj `AKTUALNA_MAPA_DZU` ustaloną w FAZIE 0. Nie wybieraj mapy na podstawie
daty zapamiętanej w tym pliku.

### 3-PULL — Synchronizacja DR-MAPA-AKTOW → ROUTING-MAP → mapa_dzu

> ⚙️ **Protokół pull** — wykonaj PRZED 3A gdy zakres audytu obejmuje TRYB DZU lub pełny audyt.
> Cel: mapa_dzu musi być spójna z tym co faktycznie mają DR-skills.

**Krok 1 — Skan DR-MAPA-AKTOW:**

```bash
# Zebranie wszystkich Dz.U. z lokalnych map DR
grep -h "Dz\.U\." dr-*/MAPA-AKTOW.md | \
  grep -oP "Dz\.U\. \d{4} poz\. \d+" | sort -u
```

**Krok 2 — Porównanie z ROUTING-MAP.md:**

```bash
# Znalezienie Dz.U. w MAPA-AKTOW które nie są w ROUTING-MAP
# (wykonuj manualnie: porównaj output Kroku 1 z ROUTING-MAP.md)
view prawo-polskie-v2/ROUTING-MAP.md
```

**Krok 3 — Porównanie z mapa_dzu:**

```bash
# Znalezienie Dz.U. w ROUTING-MAP których brak w mapa_dzu
# Każdy akt w ROUTING-MAP z Dz.U. powinien mieć wpis w mapa_dzu
```

**Krok 4 — Wykrywanie MONITORING ze wszystkich źródeł:**

```bash
# Znajdź akty z vacatio legis w DR-MAPA-AKTOW
grep -h "OCZEKUJE\|WCHODZI\|vacatio\|wchodzi w życie" \
  dr-*/MAPA-AKTOW.md | sort -u
```

Każdy wynik Kroku 4 → **sprawdź czy jest wpisany do sekcji MONITORING** w:
- `mapa_dzu_*.md` (tabela MONITORING)
- `ROUTING-MAP.md` (sekcja MONITORING)

Jeśli brakuje → **dodaj do obu plików** jako `⏳ OCZEKUJE`.

---

### 3A — Nowe t.j. od ostatniego audytu

Sprawdź w ELI (`api.sejm.gov.pl/eli/acts/search`, RZĄD 1; ISAP tylko jako link dla człowieka) czy pojawiły się nowe teksty jednolite dla kluczowych aktów:
- KC, KPC, KPK, KRO, KP, KSH, KPA, PB, PrFarm, PIT, CIT, OrdPod, PrNotariat
- Sprawdź Dz.U. poz. > max_poz z ostatniego audytu (aktualnie: > 1079 z 2026 — najwyższa pozycja odnotowana w sesji 2026-08-21)

### 3B — Aktualizacja statusów

Jeśli znaleziono nowe t.j.:
- Zmień status starego wpisu: `OK` → `PREV`
- Dodaj nowy wiersz do tabeli z: rok, poz., akt, typ=TJ, status=OK, skille (wg mapy), uwagi

### 3D — Akty oczekujące na wejście w życie (MONITORING)

> ⛔ **UZUPEŁNIENIE LEGENDY 2026-08-15p — brakujący znacznik ⚠️ ALERT.**
> Prompt zadania cyklicznego (`references/SCHEDULED-TASK-COWORK.md`, § 2B krok 4)
> każe priorytetyzować „wszelkie ⚠️ ALERT z poprzednich audytów". Kontrola
> wykazała **0 wystąpień** tego znacznika zarówno w SKILL.md, jak i w mapie
> Dz.U. — krok 4 promptu odsyłał do konwencji, której nigdy nie wprowadzono,
> więc sesja wykonawcza nie miała czego szukać.
>
> **Definicja (od 2026-08-15p):** `⚠️ ALERT` oznacza w kolumnie uwag mapy akt,
> którego numer **okazał się błędny lub sporny** i został skorygowany — czyli
> pozycję o podwyższonym ryzyku nawrotu, wymagającą sprawdzenia w KAŻDYM
> kolejnym przebiegu, niezależnie od rotacji. Znaczniki `⏳ OCZEKUJE`
> i `⚡ WCHODZI-90DNI` dotyczą PRZYSZŁOŚCI aktu (vacatio legis); `⚠️ ALERT`
> dotyczy PRZESZŁOŚCI rejestru (już raz się pomylił).
>
> Pierwsze pozycje kwalifikujące się do oznaczenia: Kodeks morski (F-82 —
> numer należał do innej ustawy), PIT/CIT/KC (F-84 — stary t.j. nieziejący
> statusu PREV), KPSW (błędna „poprawka" z 2026-07-02q, patrz wpis 08-15d).

Po weryfikacji nowych t.j. (3A–3B) sprawdź i zaktualizuj tabelę aktów opublikowanych, które **nie weszły jeszcze w całości w życie** lub wchodzą etapami.

Dla każdego aktu z tabeli MONITORING wykonaj:
1. Sprawdź w ELI (metryka `entryIntoForce` + przepis o wejściu w życie — DOSTEP-MASZYNOWY-API §2) czy data wejścia w życie minęła lub zbliża się (horyzont: 90 dni).
2. Jeśli akt wszedł w życie → przenieś do tabeli głównej mapy Dz.U. (zmień typ `OCZEKUJE` → `TJ` lub `NOV`), usuń z MONITORING.
3. Jeśli data jeszcze nie minęła → zaktualizuj uwagi, potwierdź termin.
4. Jeśli akt zastępuje inny → odnotuj w kolumnie `Zastępuje` (nazwa aktu + stary Dz.U.).

**Format tabeli MONITORING** (prowadzonej w `mapa_dzu_YYYY-MM-DD.md`, sekcja osobna na końcu pliku):

| Akt | Dz.U. opubl. | Data wejścia w życie | Zastępuje / zmienia | Moduł DR | Status |
|---|---|---|---|---|---|
| Prawo budowlane art. 1 pkt 1 lit. a i c, pkt 3 *(przykład formatu — historyczny; w mocy od 20.09.2026, źródło zmiany: 2025/1847, nie t.j. 2026/524 — F-195)* | Dz.U. 2025 poz. 1847 | 20.09.2026 | — (przepis nowy) | dr-09/mod-PrBud-* | ✅ WSZEDŁ |
| Ordynacja podatkowa (część przepisów z Dz.U. 2025 poz. 1235) | Dz.U. 2026 poz. 622 | ~4 mies. od ogłoszenia | — (nowelizacja OP) | dr-06/mod-OP-* | ⏳ OCZEKUJE |
| Obrona cywilna zm. | Dz.U. 2026 poz. 646 | vacatio legis — weryfikuj | Dz.U. 2024 poz. 1907 (część) | dr-13/mod-ustawa-zarzadzanie-kryzysowe-* | ⏳ OCZEKUJE |

**Reguły statusów MONITORING:**

| Status | Znaczenie |
|---|---|
| ⏳ OCZEKUJE | Opublikowany, vacatio legis w toku — nie stosuj do zdarzeń wcześniejszych |
| ⚡ WCHODZI-90DNI | Data wejścia w ciągu 90 dni — zaktualizuj moduł przed tą datą |
| ✅ WSZEDŁ | Wszedł w życie — przesuń do tabeli głównej, usuń z MONITORING |
| ❌ UCHYLONY | Uchylony przed wejściem — usuń z MONITORING, odnotuj w AUDIT-JOURNAL |

**Przy wpisie do raportu (Faza 6)** dodaj sekcję `### 4B. MONITORING — akty oczekujące` z aktualnym stanem tabeli.

**Przy aktualizacji mapa_dzu (Faza 7B)** — tabela MONITORING jest aktualizowana razem z tabelą główną, na końcu pliku.

---

### 3C — Rozporządzenia "do weryfikacji"

Otwarte WARN z poprzednich audytów:
- WARN-4: Rozp. RM 2020.2437 (progi PZP) — dr-07
- WARN-5b: Rozp. MS 2015.1800 (stawki komornicze) — analizator-dowodow-v3
- WARN-6: Rozp. RM 2008.1656 (prace uciążliwe) — dr-16

Dla każdego: sprawdź online czy istnieje nowszy akt. Jeśli tak → CRIT. Jeśli nie → zamknij WARN jako "zweryfikowane, bez zmian".

---

## FAZA 3E — WERYFIKACJA TREŚCI MERYTORYCZNEJ MODUŁÓW (ZASADA 12)

> Odpowiada na pytanie: skoro FAZA 3A–3D wykryła zmianę numeru/statusu
> aktu — czy **treść** modułu DR, która o tym akcie coś twierdzi (progi,
> terminy, definicje, przesłanki), nadal jest zgodna z aktualnym stanem
> prawnym? To zakres inny niż poprawność numeru Dz.U. w mapie.

Pełna procedura: `modules/MOD-TRESC-MERYTORYCZNA.md` — wczytaj przed wykonaniem:

```
view audyt-systemu-v4/modules/MOD-TRESC-MERYTORYCZNA.md
```

> ⭐ **Mechanizm uzupełniający (dodany 2026-07-26):** gdy transza FAZA 3E
> ujawni, że MODUŁ SAM ostrzegał o nowelizacji, ale nie zastosował jej do
> własnej treści (wzorzec z AUDYT-2026-07-26l) — uruchom
> `modules/MOD-PROPAGACJA-NOWELIZACJI.md`, żeby sprawdzić, czy TA SAMA
> nieaktualność występuje też w INNYCH plikach systemu (nie tylko w
> module "domowym" dla danego aktu). Jedna naprawa punktowa nie
> gwarantuje, że problem nie powtarza się gdzie indziej.

**Uruchamia się automatycznie**, gdy FAZA 3 (dowolny podtryb) zakończyła
się co najmniej jedną zmianą: nowy `TJ` (3A/3B), pozycja `✅ WSZEDŁ` z
MONITORING (3D), lub WARN z 3C zamknięty jako "jest nowszy akt".

> ⭐ **Tryb NA ŻĄDANIE (dodane 2026-07-26):** FAZA 3E może być też
> wywołana samodzielnie, bez poprzedzającej zmiany Dz.U. — użytkownik
> wskazuje konkretny moduł/dziedzinę do pogłębionej weryfikacji
> merytorycznej ("sprawdź treść modułu X", "kontynuuj audyt
> merytoryczny"). W tym trybie KROK 1 (identyfikacja modułu) jest
> zastąpiony wskazaniem użytkownika lub wyborem audytora wg priorytetu
> (np. najnowsze/najmniej sprawdzone moduły) — reszta procedury
> identyczna. Każda taka transza to jeden fragment jednego pliku, nie
> cały system naraz — traktuj jako iteracyjne, nie jednorazowe zadanie.

Skrót procedury:
1. Zidentyfikuj moduł(y) DR opisujące dotknięty akt (kolumna `Moduł` w `MAPA-AKTOW.md`).
2. Ustal w ELI (`text.pdf` aktu zmieniającego) zakres zmiany — które artykuły dodano/zmieniono/uchylono (zakaz cytowania z pamięci — PRAWO-HARDGATE).
3. Skonfrontuj wyłącznie te twierdzenia modułu, które dotyczą zmienionych artykułów (nie cały moduł).
4. Sklasyfikuj: ✅ ZGODNE / ⚠️ WARN-TREŚĆ / ❌ CRIT-TREŚĆ.
5. CRIT-TREŚĆ → napraw treść modułu w tej samej sesji (str_replace na kopii), z adnotacją źródła i datą weryfikacji.

> ⚙️ Przy KROKU 2/3 stosuj ZASADĘ 14 (gradacja źródeł, patrz sekcja
> ZASADY KRYTYCZNE pkt 12 i `shared/HIERARCHIA-ZRODEL.md`) — Rząd 1
> pierwsza próba, Rząd 2B główne potwierdzenie gdy Rząd 1 niedostępny
> wprost, Rząd 3 wyłącznie jako dodatkowe potwierdzenie zbieżności.

Brak zmian Dz.U. w sesji → FAZA 3E pomijana, odnotuj wprost:
`FAZA 3E: pominięta — brak zmian Dz.U. w tej sesji` (NIE dotyczy trybu
NA ŻĄDANIE, który działa niezależnie od FAZA 3A-3D).

Wynik trafia do raportu jako `### 4C. TREŚĆ MERYTORYCZNA MODUŁÓW` (FAZA 6)
oraz — dla CRIT-TREŚĆ naprawionych — do `AUDIT-JOURNAL.md` z jawnym
odróżnieniem od poprawek czysto numeracyjnych (analogicznie do ZASADY 11
dla skilli proceduralnych).

---

## FAZA 4 — TESTY ANTYHALUCYNACYJNE

### 4A — Zakaz cytowania z pamięci

```bash
grep -r "Dz\.U\. [0-9]\{4\} poz\." "${LEX_MACHINA_SKILLS_ROOT:?}" \
  --include="*.md" | grep -v "isap\|weryfikuj\|MAPA\|mapa_dzu\|references\|archive" | head -30
```

Hardkodowane Dz.U. bez kontekstu weryfikacji = **WARN**.

### 4B — PRAWO-HARDGATE obecny

```bash
grep -r "PRAWO-HARDGATE" "${LEX_MACHINA_SKILLS_ROOT:?}" \
  --include="*.md" | grep -v archive | head -10
```

Brak HARDGATE w routerze = **CRIT**.

---

## FAZA 5 — SCORING

Dla każdego skilla generuj wynik 0–10:

| Kryterium | Waga | Punkty |
|-----------|------|--------|
| Brak błędów CRIT | 40% | 0–4 |
| Spójność zależności (ścieżki, wersje) | 25% | 0–2.5 |
| Description w limicie | 10% | 0–1 |
| Czystość kodu (interlinie + wstawki) | 15% | 0–1.5 |
| HARDGATE obecny (router) | 10% | 0–1 |

**Wynik < 6.0** = skill wymaga naprawy przed użyciem.
**Wynik ≥ 8.0** = skill zielony.

---

## FAZA 6 — RAPORT AUDYTU

Generuj raport wg szablonu z AUDIT-JOURNAL.md (sekcja "SZABLON NOWEGO WPISU").

Struktura wymaganego raportu:

```
## AUDYT-YYYY-MM-DD

### 1. STATUS OGÓLNY
### 2. NAPRAWY WYKONANE (CRIT)
### 3. OSTRZEŻENIA (WARN)
### 4. WERYFIKACJA Dz.U.
### 4C. TREŚĆ MERYTORYCZNA MODUŁÓW (FAZA 3E — patrz MOD-TRESC-MERYTORYCZNA.md)
### 5. STRUKTURA SYSTEMU — SNAPSHOT
### 6. WNIOSKI I ZALECENIA
```

---

## FAZA 7 — AKTUALIZACJA PLIKÓW REFERENCES ← OBOWIĄZKOWE

Po zakończeniu audytu **ZAWSZE** zaktualizuj pliki references (7A obowiązkowo,
7B i 7C warunkowo — wg opisu każdej podfazy):

### 7A — Aktualizacja AUDIT-JOURNAL.md

> ⛔ **KOREKTA 2026-08-15p — reguła doprowadzona do zgodności ze stanem faktycznym.**
> Ta sekcja nakazywała dotąd dopisywanie wpisu „na początku listy" i aktualizację
> stopki. Kontrola pliku wykazała, że **przez co najmniej 15 kolejnych sesji
> (wpisy 08-15a … 08-15o) wpisy były dopisywane na KOŃCU**, a stopka
> `*Ostatnia aktualizacja:*` nie była ruszana od **2026-06-09** i tkwi w połowie
> pliku (ok. w. 18383). Kolejność wpisów w pliku jest dziś mieszana (24 przejścia
> rosnące i 24 malejące na 698 wpisów) — nie jest ani chronologiczna, ani odwrotna.
>
> **Reguła z 2026-08-15p (nakazywała dopisywanie na KOŃCU PLIKU) — zastąpiona
> praktyką od 2026-10-04h.** Od wpisu AUDYT-2026-10-04h kolejne wpisy tworzą na
> końcu pliku blok w kolejności **od najnowszego** (10-10a, 10-09h, 10-09g, …,
> 10-04h); stan zmierzony 2026-10-10.
>
> **Stopki NIE reanimujemy jako pola do ręcznej aktualizacji** — była martwa
> przez ponad dwa miesiące, co dowodzi, że nikt jej nie utrzymuje. Datę ostatniego
> audytu odczytuje się z **najwyższego identyfikatora wpisu** (nie z pozycji
> w pliku). Istniejącą stopkę w połowie pliku pozostawiono jako artefakt
> historyczny z adnotacją.
>
> ⚠️ **Historyczne warianty (nieaktualne, zachowane dla zrozumienia starych wpisów):**
> wpisy sprzed sierpnia 2026 były wstawiane na początku listy; od 2026-08-15p do
> 2026-10-04g — na końcu pliku.

**Reguła kanoniczna (od 2026-10-04h):** nowy wpis `## AUDYT-YYYY-MM-DD[litera]`
wstaw **bezpośrednio PRZED dotychczas najnowszym wpisem** (najwyższy identyfikator;
dziś pierwszy wpis bloku malejącego przy końcu pliku), bez separatora `---`.
Litera po dacie rozróżnia kilka sesji tego samego dnia (a, b, c…). Nie oglądaj
całego pliku — wystarczą numery linii:

```bash
J=audyt-systemu-v4/references/AUDIT-JOURNAL.md
grep -n "^## AUDYT-$(date +%Y-%m-%d)" "$J"                     # wolna litera
N=$(grep -n '^## AUDYT-[0-9]' "$J" | LC_ALL=C sort -t' ' -k2,2 | tail -1 | cut -d: -f1)
sed -n "${N},$((N+15))p" "$J"                                  # kontrola miejsca
# nowy_wpis.md: treść wpisu zakończona jedną pustą linią
python3 - "$J" nowy_wpis.md "$N" <<'PY'
import sys
j, w, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
linie = open(j, encoding="utf-8").read().split("\n")
nowe = open(w, encoding="utf-8").read().rstrip("\n").split("\n") + [""]
assert linie[n - 1].startswith("## AUDYT-"), "linia N nie jest nagłówkiem wpisu"
open(j, "w", encoding="utf-8").write("\n".join(linie[:n - 1] + nowe + linie[n - 1:]))
PY
grep -n '^## AUDYT-[0-9]' "$J" | LC_ALL=C sort -t' ' -k2,2 | tail -2   # nowy wpis = najwyższy
```
⛔ Nie wstawiaj wpisu na początku pliku, w środku ani za ostatnim wpisem bloku
malejącego. Nie używaj `str_replace` na całym pliku (ryzyko REGUŁY 5).

### 7B — Aktualizacja mapa_dzu_YYYY-MM-DD.md

Jeśli znaleziono nowe t.j. lub zmiany statusów Dz.U.:

> ⛔ **KOREKTA 2026-08-20y/2026-08-26 — ta sekcja kopiowała mapę ARCHIWALNĄ.**
> Polecenie wcześniej wskazywało datę na stałe, więc stawało się błędne przy
> każdej nowej generacji. Wykonanie
> FAZY 7B literalnie cofnęłoby mapę o **trzy generacje** (06-14 → 07-02 → 07-04 →
> 07-15), kasując ~250 wierszy ustaleń, i to bez żadnego sygnału błędu — nowy plik
> powstałby poprawnie, tylko z przestarzałą treścią. To DRUGIE wystąpienie tej samej
> klasy usterki: identyczną naprawę wykonano w 4.4 (2026-06-14g, „12 miejsc w SKILL.md,
> w tym FAZA 7B"). **Reguła stała: przy każdej zmianie mapy aktualnej sprawdź
> `grep -n mapa_dzu SKILL.md` i popraw WSZYSTKIE wystąpienia, nie tylko `references:`.**

1. Utwórz nową wersję pliku z datą bieżącą. Źródłem jest wyłącznie
   `AKTUALNA_MAPA_DZU` ustalona dynamicznie w FAZIE 0:
```bash
cp "$AKTUALNA_MAPA_DZU" \
   audyt-systemu-v4/references/mapa_dzu_YYYY-MM-DD.md
```

2. Zaktualizuj w nowym pliku:
   - Nagłówek: `**Data weryfikacji:** YYYY-MM-DD`
   - Zmień statusy `OK` → `PREV` dla zastąpionych t.j.
   - Dodaj nowe wiersze do tabeli (na początku, sortuj malejąco po roku/poz.)

3. Zaktualizuj wpis mapy aktualnej w `references:`. Procedura FAZY 0 i FAZY 3
   pozostaje dynamiczna — nie wolno dopisywać tam nowej daty na stałe.

Jeśli **brak zmian Dz.U.** — plik mapy pozostaje bez zmian, odnotuj w AUDIT-JOURNAL.md:
```
Dz.U.: brak nowych t.j. — mapa bez zmian (ostatnia: [nazwa AKTUALNA_MAPA_DZU])
```

### 7C — Aktualizacja WARN-OTWARTE.md (ZASADA 10)

> ⛔ **ZMIANA 2026-08-20y — ta sekcja była MARTWA od 2026-06-14g.** Nakazywała
> aktualizację pliku `SKILLS-MAP-AND-FIXES`, USUNIĘTEGO w wersji 4.4 i zastąpionego
> przez `CHANGELOG.md` / `CHECKLIST-DEDUP.md` / `mapa_dzu`. Przez ~2 miesiące FAZA 7
> deklarowała trzy podfazy, z których jedna nie miała przedmiotu (stąd też sprzeczność
> w zdaniu wprowadzającym: „zaktualizuj **oba** pliki references" przy trzech
> podsekcjach). W to miejsce wpisano czynność, która i tak jest obowiązkowa z ZASADY 10,
> a nie miała własnego kroku w FAZIE 7 — co było drugą, cichszą luką tej samej sekcji.

Po każdej sesji, w której odkryto lub zamknięto flagę:

1. **Flaga nowa** → wiersz w TABLICY STERUJĄCEJ + wiersz w sekcji 1
   `references/WARN-OTWARTE.md` + wpis w `AUDIT-JOURNAL.md`.
2. **Flaga zamknięta** → USUŃ wiersz z obu miejsc w `WARN-OTWARTE.md`, pełny opis
   naprawy dopisz do `AUDIT-JOURNAL.md`.
3. **Naprawa częściowa** → SKRÓĆ wiersz flagi do tego, co ZOSTAŁO (nie dopisuj opisu
   tego, co zrobione — to jedyne udokumentowane źródło rozrostu tego pliku, F-86).
4. Zaktualizuj licznik flag w TABLICY STERUJĄCEJ oraz „kolejny wolny numer" w § 8.

Jeśli zmieniła się struktura katalogu skilla — zaktualizuj sekcję STRUKTURA KATALOGU
w tym pliku ORAZ `references:`/`scripts:` w YAML (wzorzec luki F-80).

---

## TRYBY WYWOŁANIA

### TRYB INTERAKTYWNY (menu wyboru) ← DOMYŚLNY
Wywołanie: "przeprowadź audyt" / "audytuj system" (bez zakresu)
→ Faza 0 → Faza 0B (widget menu) → czekaj na wybór → uruchom wybrane fazy.

### TRYB AUTO (pełny audyt)
Wywołanie: "pełny audyt" / "audyt kompletny"
→ Wykonaj Fazy 0–7 w całości.

### TRYB TARGETED (wybrany skill)
Wywołanie: "audytuj [nazwa-skilla]"
→ Faza 0 + Fazy 1–5 tylko dla wskazanego skilla + Faza 6 (skrócony raport) + Faza 7A.

### TRYB CZYSTOŚĆ (tylko interlinie + wstawki + description)
Wywołanie: "wyczyść skille" / "usuń zbędne interlinie" / "usuń wstawki opisowe" / "sprawdź description"
→ Faza 0 → Fazy 2C + 2D-1 + 2D-2 (lub podzbiór) → Faza 6 (skrócony) → Faza 7A.

### TRYB DZU (tylko mapa Dz.U.)
Wywołanie: "sprawdź mapę Dz.U." / "aktualizuj Dz.U."
→ Faza 0 + Faza 3 (A+B+C+D) + Faza 3E (automatycznie, jeśli 3A–3D wykryły zmianę) + Faza 7A + 7B.

### TRYB TREŚĆ (tylko weryfikacja merytoryczna modułów)
Wywołanie: "sprawdź czy moduł X wymaga aktualizacji po zmianie Y" / "zweryfikuj treść modułów po nowelizacji"
→ Faza 0 → Faza 3E bezpośrednio (pomija 3A–3D, wskazany akt/moduł podany przez użytkownika lub ostatni wpis MONITORING/mapa_dzu) → Faza 6 (skrócony, sekcja 4C) → Faza 7A.

### TRYB HARMONOGRAM (pozycja 11 — zadanie cykliczne w Cowork)
Wywołanie: "ustaw cotygodniowy audyt" / "zadanie cykliczne ISAP" / wybór pozycji 11 w menu
→ FAZA 0C → `references/SCHEDULED-TASK-COWORK.md` (bez uruchamiania faz audytowych)

### TRYB KONTRAKT ROUTERA (pozycja 13 — kontrola, bez zapisu)
Wywołanie: „zsynchronizuj pamięć routera” / wybór pozycji 13 w menu
→ FAZA 0D → `references/PAMIEC-TRWALA-ROUTER.md`

### TRYB WARN-CLOSE (zamknięcie ostrzeżeń)
Wywołanie: "zamknij otwarte warningi" / "sprawdź WARN-X"
→ Faza 0 → odczytaj otwarte flagi z `references/WARN-OTWARTE.md` (NIE grepuj
całego AUDIT-JOURNAL.md — to jest wolniejsze i mniej niezawodne, patrz
ZASADA 10) → weryfikacja online → Faza 7A → po zamknięciu: usuń wiersz
z WARN-OTWARTE.md, dodaj pełny wpis do AUDIT-JOURNAL.md.

---

## ZASADY KRYTYCZNE

1. **Nigdy nie cytuj przepisów ani sygnatur z pamięci** — weryfikacja tylko przez ELI (RZĄD 1) i oficjalne źródła orzeczeń.
2. **Każdy audyt kończy się aktualizacją AUDIT-JOURNAL.md** — bez wyjątków.
3. **Mapa Dz.U. aktualizowana tylko gdy potwierdzone zmiany online** — nie spekuluj.
4. **CRIT blokuje skill** — nie używaj skilla z otwartym CRIT.
5. **WARN nie blokuje** — ale musi być odnotowany w `references/WARN-OTWARTE.md`
   (nie tylko w AUDIT-JOURNAL.md) i zamknięty w przyszłym audycie (patrz ZASADA 10).
6. **Moduły czystości (interlinie, wstawki) działają zachowawczo** — w razie wątpliwości ZOSTAW, nie usuwaj.
7. ⛔ **ZASADA KOMPLETNOŚCI OUTPUTU (OUTPUT-COMPLETENESS) — NARUSZENIE = CRIT**

   Każda naprawa pliku (CRIT lub WARN) musi być dostarczona jako **kompletny skill**
   zawierający WSZYSTKIE pliki i podfoldery danego skilla, nie tylko zmieniony plik.
   Naruszenie tej zasady (dostarczenie samego pliku zamiast pełnego skilla) jest błędem
   krytycznym równoważnym CRIT i musi być odnotowane w AUDIT-JOURNAL.

   > 🔴 **PRE-DELIVERY-COMPLETENESS-CHECK — procedura przenośna.** Najpierw
   > rozwiąż trzy lokalizacje przez adapter hosta: `SKILL_SOURCE` (pełne
   > źródło skilla), `WORK_COPY` (zapisywalna kopia robocza) i `ARCHIVE`
   > (plik wynikowy). Żadna z nich nie może być ścieżką założoną dla jednego
   > hosta.
   >
   > ⛔ **`SKILL_SOURCE` = repozytorium (`main`), NIGDY kopia zainstalowana
   > w hoście (F-221/F-223, od 6.158).** claude.ai przy imporcie z marketplace
   > serializuje frontmatter `SKILL.md` ponownie: usuwa komentarze YAML, zdejmuje
   > wcięcia list, zamienia skalary blokowe na ciągi z literalnym `\n`. Pozostałe
   > pliki są bajtowo zgodne z `main`. Wydanie 6.157 zbudowane z takiej kopii
   > straciło 181 linii frontmatteru audytu i podniosło T22 na `main` z 6 do 113
   > rozjazdów. Gdy repozytorium nie jest dostępne, a kopia zainstalowana tak —
   > pobierz `SKILL.md` z `main` (raw GitHub) i nanieś zmiany na niego.
   > `dostarcz_skill.sh` odmawia spakowania skilla, który nie przechodzi T22.
   > Audyt prowadzony NA kopii zainstalowanej: T21 i T22 przełączają się same
   > w tryb kopii (układ `plugin:skill`); `SKILL.md` weryfikuje wtedy wyłącznie
   > T21 z `--repo-ref <katalog skilli repozytorium>` (od 6.159).
   >
   > ```bash
   > # 1. Stan wejściowy
   > find "$SKILL_SOURCE" -type f | sort > before.files
   >
   > # 2. Pełna kopia; edycje wykonuj wyłącznie w WORK_COPY
   > cp -R "$SKILL_SOURCE" "$WORK_COPY"
   >
   > # 3. Stan wyjściowy — różnicę liczby plików trzeba jawnie uzasadnić
   > find "$WORK_COPY" -type f | sort > after.files
   >
   > # 4. Jeden pełny pakiet na jeden skill
   > zip -r "$ARCHIVE" "$WORK_COPY"
   >
   > # 5. Rozpakuj do świeżego VERIFY_COPY i porównaj bajtowo
   > diff -rq "$VERIFY_COPY" "$WORK_COPY"
   > ```
   >
   > Przed wydaniem pokaż liczbę plików przed/po oraz listę zamierzonych
   > różnic. `diff` archiwum po rozpakowaniu z `WORK_COPY` musi być pusty.
   > Dodatkowy `diff` względem `SKILL_SOURCE` ma zawierać wyłącznie zmiany
   > tej tury. Przy wielu skillach wykonaj procedurę osobno dla każdego;
   > zakaz pakietu zbiorczego i zakaz dostarczania pojedynczego `SKILL.md`.
   > Sposób udostępnienia (`present_files`, instalacja skilla lub równoważna
   > funkcja hosta) nie zmienia wymogu kompletności.
   >
   > ⛔ **Pliki kanału pluginów NIE wchodzą do paczki skilla (F-230, od 6.187).**
   > `.claude-plugin/` i `.mcp.json` w korzeniu skilla służą wyłącznie instalacji
   > z marketplace (repozytorium, T38); claude.ai odrzuca wgrywany skill z
   > manifestem pluginu („Umiejętność nie może zawierać manifestu wtyczki”).
   > Kompletny skill do wgrania = wszystkie pliki skilla bez tych dwóch pozycji;
   > `CHECKSUMS.sha256` ich nie wymienia (T21 i tak pomija pliki ukryte).
   > `dostarcz_skill.sh`, `repack_development_archives.py` i T34 liczą pliki
   > przed/po bez nich; T34 i weryfikator paczek zgłaszają plik pluginu w ZIP-ie.
8. ⛔ **ZASADA WERYFIKACJI NUMERU NIEZALEŻNIE OD NAZWY (dodana 2026-07-02s,
   na wyraźny nakaz użytkownika) — "jeśli nazwy różnią się choć trochę,
   sprawdzaj w ISAP" (od 6.125 czytaj: w RZĘDZIE 1 — najpierw ELI).**

   Zgodność NAZWY aktu między dwoma źródłami (np. między MAPA-AKTOW.md a
   treścią modułu) NIE jest dowodem poprawności numeru Dz.U. Odkryty
   przypadek referencyjny (dr-10, ustawa o medycynie laboratoryjnej): moduł
   poprawnie nazwał akt, ale podał numer Dz.U. należący do INNEGO,
   zastąpionego aktu o pokrewnej tematyce (2022.2162 zamiast 2022.2280).
   Zasada praktyczna: przy każdej weryfikacji TRYB DZU sprawdzaj NUMER
   niezależnie od tego, czy NAZWA aktu w mapie/module wygląda poprawnie —
   zwłaszcza gdy w tej samej dziedzinie istnieje stary i nowy akt o
   zbliżonym temacie (typowy wzorzec ryzyka: reformy zawodowe/regulacyjne,
   gdzie nowa ustawa zastępuje starą pod inną nazwą lub tym samym tytułem).
   Kanał (od 6.125): numer Dz.U. sprawdzaj w ELI —
   `api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}` zwraca tytuł aktu, więc
   rozbieżność numeru i nazwy widać wprost. Kanał maszynowy ISAP jest
   martwy; `web_search` z numerem Dz.U. (fragmenty ISAP, dziennikustaw.gov.pl,
   sip.lex.pl, gofin.pl) tylko pomocniczo, gdy aktu nie da się pobrać z RZĘDU 1.
   Dostarczanie wyłącznie zmodyfikowanego pliku bez reszty struktury grozi nieodwracalną
   utratą danych przy wgraniu (nadpisanie katalogu bez pozostałych plików).

   ⛔ **Limit i relikty (od 6.153):** skill ma mieć < 200 plików (T41). Instalację wydania
   wykonuje się przez ZASTĄPIENIE katalogu skilla w całości, nie nałożenie paczki na stary katalog —
   nałożenie wskrzesza pliki usunięte w poprzednich wydaniach (zmierzone: 6 plików z 6.146 i 30 z 6.149
   w jednej instalacji; AUDYT-2026-09-29c). Plik zgłoszony przez T21 jako „BRAK WPISU” najpierw
   sprawdź w CHANGELOG — dopisanie mu sumy legalizuje relikt.

   **Reguła:** po każdej naprawie → `find <skill>/ -not -path "*/archive/*"` →
   skopiuj WSZYSTKIE pliki do `/home/claude/<skill>/` z zachowaniem podfolderów →
   `zip -r <skill>.zip <skill>/` → skopiuj ZIP do `/mnt/user-data/outputs/` →
   `present_files` pliku ZIP. Nigdy nie dostarcza się luźnych plików .md.

   **Wyjątek dozwolony:** wyłącznie gdy deweloper **explicite** potwierdził w tej sesji,
   że chce tylko diff/patch i rozumie ryzyko. Bez takiego potwierdzenia — zawsze pełna struktura.

9. ⛔ **ZASADA PRZEGLĄDU OKRESOWEGO WARN (dodana 2026-07-07, po sesji w której
   WARN-12 i WARN-24 pozostały otwarte przez wiele kolejnych wpisów dziennika
   bez zamknięcia i bez ponownego odnotowania).**

   Flagi drugorzędne (priorytet "niski/średni", bez oznaczenia PILNY) mogą
   zostać zgubione w długich, wielokrokowych sesjach, gdy kolejne wpisy
   dziennika koncentrują się na głównym wątku bieżącej sesji i nie powtarzają
   pełnej listy historycznie otwartych WARN. Wynik: flaga pozostaje formalnie
   otwarta, ale nikt jej już nie widzi w bieżącym kontekście.

   **Reguła:** co najmniej raz na ~10 wpisów dziennika (liczonych od
   ostatniego pełnego przeglądu) — lub natychmiast, gdy użytkownik pyta
   wprost "czy wszystkie WARN są zamknięte" / podobnie — wykonaj:
   `grep -noE "WARN-[0-9]+" AUDIT-JOURNAL.md | sort -t- -k2 -n -u`, a następnie
   dla każdego numeru sprawdź kontekst NAJNOWSZEGO (najniższy numer linii)
   wystąpienia, by potwierdzić status. Nie polegaj wyłącznie na podsumowaniach
   "WARN nadal otwarte: ..." z pojedynczej sesji — mogą być niekompletne,
   jeśli odnoszą się tylko do WARN otwartych w ramach tej jednej sesji, a nie
   do całej historii. Wynik przeglądu odnotuj w dzienniku jako osobny wpis
   (jak ten), nawet jeśli nie znaleziono nowych otwartych flag.

10. ⛔ **ZASADA ROZDZIAŁU OTWARTE/ZAMKNIĘTE (dodana 2026-07-07, na wyraźne
    polecenie użytkownika) — "wydziel do otwartych warnów osobny dziennik,
    a zamknięte utrzymuj w aktualnym".**

    `AUDIT-JOURNAL.md` i `references/WARN-OTWARTE.md` mają rozłączne role:
    - **`WARN-OTWARTE.md`** — WYŁĄCZNIE aktualnie otwarte flagi (WARN
      numerowane + flagi strukturalne F-N). Krótki, żywy rejestr — to jest
      TODO systemu, nie archiwum. Nie zawiera narracji, dat naprawy ani
      historii — tylko to, co jeszcze czeka.
    - **`AUDIT-JOURNAL.md`** — pełna historia chronologiczna, w tym
      zamknięcia z pełnym opisem naprawy. Nic z niego nigdy nie jest
      usuwane.

    **Reguła operacyjna:**
    - Nowa flaga (WARN lub strukturalna) odkryta w sesji → dodaj wiersz do
      `WARN-OTWARTE.md` ORAZ krótki wpis o odkryciu w `AUDIT-JOURNAL.md`.
    - Flaga zamknięta → USUŃ jej wiersz z `WARN-OTWARTE.md` ORAZ dodaj pełny
      wpis o naprawie w `AUDIT-JOURNAL.md` (jak dotychczas).
    - ⛔ **Naprawa CZĘŚCIOWA (dodane 2026-08-15w, po porządkowaniu rejestru,
      który urósł do 489 linii / ~96 KB): SKRÓĆ wiersz flagi do tego, co
      ZOSTAŁO — NIE dopisuj do niego opisu tego, co właśnie zrobiono.**
      Opis wykonanej części należy WYŁĄCZNIE do `AUDIT-JOURNAL.md`; w
      wierszu flagi zostaje co najwyżej odesłanie do wpisu dziennika.
      Dopisywanie bloków „✅ CZĘŚCIOWO ZAMKNIĘTE …" do komórki opisu było
      JEDYNĄ przyczyną rozrostu rejestru i doprowadziło do sklejenia
      czterech struktur wierszowych w jednym wierszu (F-86) oraz do
      sytuacji, w której odczyt „co mam zrobić" wymagał przeczytania
      opisu tego, co już zrobione.
    - Pytanie "co jest otwarte" / "czy wszystko zamknięte" → czytaj
      NAJPIERW `WARN-OTWARTE.md`. Grep całego `AUDIT-JOURNAL.md` (ZASADA 9)
      pozostaje jako kontrola co ~10 wpisów, żeby wykryć rozjazd między
      dwoma plikami — nie jako podstawowy sposób odpowiadania na bieżąco.
    - Ten sam skill (`audyt-systemu-v4`) z niepustym `WARN-OTWARTE.md`
      NIE jest blokowany (WARN nie blokuje, ZASADA 5) — plik służy
      wyłącznie widoczności, nie jest bramką.

11. ⛔ **ZASADA TREŚĆ-PO-MAPIE (dodana 2026-07-16, ZASADA 12 w nagłówku
    pliku, tu jako pozycja 11 listy operacyjnej) — audyt aktualności
    numeru Dz.U. i audyt aktualności treści merytorycznej modułu to
    dwie różne kontrole.**

    Zamknięcie FAZA 3 (dowolny podtryb) z wykrytą zmianą statusu aktu
    (nowy `TJ`, `✅ WSZEDŁ`, lub WARN z 3C potwierdzony jako "jest nowszy
    akt") **bez uruchomienia FAZA 3E** (`modules/MOD-TRESC-MERYTORYCZNA.md`)
    jest błędem krytycznym równoważnym CRIT — analogicznie do ZASADY 7
    dla kompletności dostarczenia. Aktualizacja samego wiersza w
    `mapa_dzu`/`MAPA-AKTOW.md` nie jest dowodem, że treść modułu została
    sprawdzona pod kątem tego, co konkretnie zmieniła nowelizacja.

12. ⛔ **ZASADA GRADACJI ŹRÓDEŁ PRZY WERYFIKACJI (dodana 2026-07-26,
    ZASADA 14 w nagłówku pliku, tu jako pozycja 12 listy operacyjnej) —
    FAZA 3E stosuje `shared/HIERARCHIA-ZRODEL.md` jako metodologię, nie
    tylko jako zasadę oznaczania linków.**

    Kolejność: kanon E-1…E-5 — Rząd 1 ELI (próba zawsze pierwsza; ISAP
    tylko link dla człowieka) → Rząd 2A LEX/Legalis → Rząd 2B (lexlege.pl,
    arslege.pl, prawo.pl — gdy aktu nie da się pobrać z RZĘDU 1) → Rząd 3 (blogi kancelaryjne — WYŁĄCZNIE jako dodatkowe
    potwierdzenie zbieżności, nigdy jako jedyne źródło). Minimum 2-3
    źródła niezależne zgodne ze sobą przed oznaczeniem twierdzenia jako
    sprawdzonego. Każdy wpis w AUDIT-JOURNAL.md wskazuje Rząd źródła
    potwierdzenia, nie tylko nazwę domeny. Naruszenie (oznaczenie
    "zweryfikowane" na podstawie wyłącznie 1 źródła Rządu 3, lub bez
    wskazania Rzędu) = **WARN**.

13. ⛔ **ZASADA LIMITU DŁUGOŚCI MODUŁU (dodana 2026-08-14, na żądanie
    użytkownika) — moduł przekraczający 1000 linii MUSI zostać
    podzielony wg rozdziałów aktu, który opisuje.**

    **Kiedy sprawdzać:** (a) po KAŻDYM utworzeniu nowego modułu (budowa wg
    `shared/MOD-GENERATOR-AKTU.md` G-1…G-8) — `wc -l`
    na plik zaraz po `create_file`, PRZED rejestracją w SKILL.md/mapie/
    ROUTING-MAP; (b) po KAŻDYM rozbudowaniu istniejącego modułu (kolejna
    sesja FAZA 3E, dopisanie nowego rozdziału/artykułów) — sprawdzić
    długość PO edycji, nie tylko przy tworzeniu; (c) okresowo przy
    audytach kompletności (np. razem z `check_rejestracja_modulow.py`)
    jako dodatkowa kontrola dla modułów rozrastających się iteracyjnie
    przez wiele sesji.

    **Próg:** **1000 linii** (`wc -l`). Moduł ≤1000 linii — bez zmian,
    zostaje jednym plikiem. Moduł >1000 linii — PODZIEL wg rozdziałów
    aktu (nie wg arbitralnego przecięcia w połowie treści), analogicznie
    do wzorca już stosowanego w systemie dla dużych kodeksów (np.
    `mod-KW-art49-64-...`, `mod-KW-art70-118-...`,
    `mod-KW-art119-131-...`, `mod-KK-art127-139-...` — każdy moduł
    obejmuje spójny zakres rozdziałów/artykułów, nie cały kodeks
    naraz).

    **Zakres stosowania (doprecyzowane 2026-08-15n, po pełnym skanie
    systemu ujawniającym pliki >1000 linii POZA katalogami `modules/`):**
    - **OBJĘTE:** wszystkie pliki `modules/mod-*.md` w DR-01…DR-16 oraz
      pliki merytoryczne w `shared/` opisujące jeden akt/jedną dziedzinę
      (precedens: `ORKA-BAS-LEKSYKON.md`, `PORTALE-BRANZOWE-RZAD-2B.md`
      już figurują w F-78).
    - **DO ROZSTRZYGNIĘCIA (nie egzekwować bez decyzji użytkownika):**
      pliki `SKILL.md` skilli-orchestratorów (`przesluchanie-swiadkow-v2-min90`
      1809, `analizator-dowodow-v3` 1203, `audyt-systemu-v4` 1170 —
      stan 2026-08-15n). Podział wg „rozdziałów aktu" nie ma tu
      zastosowania (nie opisują aktu prawnego), a `SKILL.md` musi
      pozostać JEDNYM plikiem wejściowym skilla — ewentualny zabieg to
      wydzielenie sekcji do `modules/`, nie podział pliku.
    - **WYŁĄCZONE TRWALE:** `references/AUDIT-JOURNAL.md` (40 483 linii
      na 2026-08-15n) — dziennik przyrostowy, append-only, z definicji
      rosnący; nie ma rozdziałów aktu, a podział zerwałby chronologię
      i odesłania `AUDYT-YYYY-MM-DD` używane w całym systemie.
      Analogicznie pozostałe rejestry historyczne (`mapa_dzu_*.md`).

    **Jak dzielić:** (1) zidentyfikuj naturalne granice rozdziałów w
    obrębie modułu (np. "Rozdział I", "Rozdział II" aktu źródłowego);
    (2) pogrupuj rozdziały w 2+ nowe moduły tak, by każdy mieścił się
    wygodnie poniżej progu, zachowując spójność tematyczną (nie dziel
    W ŚRODKU pojedynczego rozdziału/artykułu); (3) każdy nowy plik
    dostaje nazwę wzorowaną na istniejącej konwencji
    (`mod-<KODEKS>-art<OD>-<DO>-<krotki-opis>.md`); (4) w PIERWSZYM
    (najniższe numery artykułów) module dodaj sekcję "PODZIAŁ MODUŁU"
    wskazującą pozostałe części i ich zakres; (5) zarejestruj WSZYSTKIE
    nowe pliki osobno w SKILL.md/mapie/ROUTING-MAP (Reguła 2/3
    HARDGATE) — podział zwiększa liczbę zarejestrowanych modułów, co
    jest zamierzoną, uzasadnioną zmianą liczby plików w Regule 6/
    ZASADA 7 KROK 1/4; (6) usuń oryginalny, zbyt długi plik dopiero PO
    potwierdzeniu, że wszystkie nowe pliki poprawnie zastępują jego
    treść (nic nie zgubione) — porównaj sumę linii nowych plików z
    linią bazową oryginału jako grubą kontrolę kompletności.

    **Uzasadnienie:** moduły >1000 linii utrudniają nawigację przy
    `view` (truncation przy dużych plikach), zwiększają ryzyko
    przypadkowego nadpisania fragmentu przy `str_replace` (niejednoznaczne
    dopasowanie w długim pliku) i utrudniają utrzymanie spójności przy
    częściowych aktualizacjach (łatwiej przeoczyć fragment do
    zaktualizowania w rozdziale odległym od miejsca edycji).

    Naruszenie (dostarczenie/pozostawienie modułu >1000 linii bez próby
    podziału, lub podział w niewłaściwym miejscu przecinający rozdział)
    = **WARN**, odnotować w WARN-OTWARTE.md z docelowym podziałem do
    wykonania.

14. ⛔ **ZASADA BRAMKI WYJŚCIOWEJ ZGŁOSZENIA (AUDIT-CLAIM-GATE, dodana
    2026-08-23g, flaga F-121) — skill audytowy stosuje wobec własnych
    zgłoszeń dokładnie ten kontrakt weryfikacyjny, którego pilnuje u
    innych.**

    **Przesłanka (TEST1 §5.2):** trzy diagnozy samoaudytu zostały obalone
    przez recenzenta zewnętrznego, bo powstały bez weryfikacji w źródle —
    termin „30 dni" zgłoszony jako prawdopodobna halucynacja (podczas gdy
    termin ten ma podstawę ustawową i wymagał tylko sprawdzenia zakresu
    zastosowania), status niedzieli opisany jako jednoznaczny mimo że nie
    jest, oraz `ROBOTS_DISALLOWED` zakwalifikowany jako „błąd krytyczny
    infrastruktury" cudzego systemu. **Fałszywy alarm audytu kosztuje tyle
    samo, co błąd przeoczony** — kieruje sesję naprawczą na nieistniejący
    problem i podważa zaufanie do pozostałych zgłoszeń w tym samym
    raporcie, w tym tych trafnych.

    **Reguła:** żadne zgłoszenie audytowe (wiersz w `WARN-OTWARTE.md`,
    punkt raportu, akapit w `AUDIT-JOURNAL.md`, wiersz raportu różnic) NIE
    opuszcza skilla w postaci TWIERDZENIA, jeśli nie niesie łącznie trzech
    pól:

    ```
    (1) STATUS  — wg rejestru statusów w shared/PRAWO-HARDGATE.md:
        ✅ [VER: źródło, data]        — potwierdzone w Rzędzie 1
        🟨 [KOTWICA-URZĘDOWA]         — potwierdzone kotwicą urzędową
        ⚠️ [NIEWERYFIKOWANE — HIPOTEZA] — NIEpotwierdzone; wolno zgłosić
                                         WYŁĄCZNIE z tym oznaczeniem
        (F-116 ANULOWANA — brak osobnej karty statusów, rejestr jest
        i pozostaje w shared/PRAWO-HARDGATE.md)
    (2) IDENTYFIKATOR ŹRÓDŁA — plik + numer linii, albo numer Dz.U. +
        artykuł, albo URL z datą odczytu. „Widziałem gdzieś w systemie"
        NIE jest identyfikatorem.
    (3) REPRODUKCJA — polecenie lub sekwencja, którą czytelnik odtworzy
        zgłoszenie samodzielnie (`grep -n …`, `python3 scripts/…`, „otwórz
        plik X w. N"). Zgłoszenie nieodtwarzalne przez drugą osobę jest
        opinią, nie ustaleniem audytowym.
    ```

    **Zakaz szczególny — KWALIFIKACJA CUDZEGO BŁĘDU:** określenia „błąd
    krytyczny", „halucynacja", „awaria infrastruktury" opisują PRZYCZYNĘ,
    a przyczyna prawie nigdy nie jest obserwowalna z zewnątrz. Zgłaszaj
    OBJAW (co dokładnie zwróciło narzędzie, czego zabrakło w odpowiedzi) i
    dopiero po nim — osobno oznaczoną — hipotezę przyczyny. `ROBOTS_DISALLOWED`
    to zaobserwowany objaw; „krytyczna awaria serwisu X" to hipoteza.

    **Egzekwowanie:** `references/FORMAT-RAPORTU-ROZNIC.md` § 4 wymusza te
    trzy pola w raporcie różnic. Dla pozostałych wyjść bramka jest ręczna —
    przed zamknięciem sesji przejrzyj każde NOWE zgłoszenie i sprawdź
    obecność (1)(2)(3). Naruszenie = **WARN** (nie CRIT: zgłoszenie bez
    pól nie niszczy danych, tylko wprowadza w błąd), odnotowywane jak
    każda inna flaga.

    ⚠️ **Ograniczenie znane i jawne:** ta bramka, jak każda bramka
    samo-raportująca (por. F-119, `KROK 3A` w `prawny-router-v3`), jest
    wiarygodna tylko wtedy, gdy pole (2) da się sprawdzić NIEZALEŻNIE.
    Sama deklaracja „zweryfikowano" bez identyfikatora, który druga osoba
    otworzy, jest fasadą tej samej klasy co usterka z TEST2. Skuteczność
    bramki mierzy dopiero test z grupą kontrolną z **F-113** — do jej
    zamknięcia obecność ZASADY 14 w pliku dowodzi wyłącznie obecności
    reguły, nie zmiany zachowania.

---

## STRUKTURA KATALOGU

> ⛔ **KOREKTA 2026-08-20y — drzewo było nieaktualne o 15 plików.** Wymieniało
> 4 pliki `references/` (stan sprzed F-80) i pomijało CAŁY folder `scripts/`,
> mimo że YAML `references:`/`scripts:` naprawiono 2026-08-15h. Podawało też
> „460 wierszy" mapy Dz.U. przy faktycznych 509. **Przy każdej zmianie liczby
> plików aktualizuj OBA miejsca — YAML i to drzewo** (rozjazd jednego z drugim
> to ten sam wzorzec luki, który wykrywa `check_rejestracja_modulow.py`).

> ⚡ **2026-09-27m:** +`.mcp.json` (serwery MCP pluginu) i +`mcp-servers/` (74 pliki: źródła 9 serwerów z CBOSA,
> `dist/lex-mcp.mjs`, manifest rozszerzenia MCPB, instalator, skrypt budowy, README) — łącznie **192 pliki** (6.144: +`mcp-servers/LICENSE`). Drzewo niżej nie
> rozpisuje `mcp-servers/` — opis w `mcp-servers/README.md`. Licznik w pierwszej linii drzewa jest
> historyczny (stan 2026-09-09b).
> ⚡ **2026-10-04e:** +`scripts/check_mapy_aktow.py` (T45) — **189 plików**.
> ⚡ **2026-10-04d:** +`scripts/check_osiagalnosc_shared.py` (T44) — **188 plików**.
> ⚡ **2026-10-04b:** usunięte 40 reliktów (30 `mcp-servers/*-example/*`, 2 `.pyc`, 6 `references/` z 6.146, raporty pokrycia KPK/KRO), dodany `scripts/check_sieroty.py` (T43) — **187 plików**.
> ⚡ **2026-09-27s:** `mcp-servers/` scalony — wspólne `package.json`/`package-lock.json` i jeden `test_protokol.mjs` zamiast 10 kopii; 11 serwerów (+`wl-example`). Liczba plików skilla: `find . -type f | wc -l` (limit wydania 200).

```
audyt-systemu-v4/                               ← 89 plików (stan 2026-09-09b; licznik sprawdzony
│                                                  `find . -type f`, bez __pycache__. ⚡ Drzewo podawało
│                                                  82 przy 84 faktycznych PRZED tą turą — trzeci z rzędu
│                                                  rozjazd tego licznika (F-147: 71 przy 81). Ta tura
│                                                  dokłada 2 pliki: check_domeny_allowlist.py i
│                                                  F-152-pomiar-domen-2026-09-04.md)
├── SKILL.md                                    ← orchestrator (ten plik)
├── README.md                                   ← opis skilla dla czytelnika ludzkiego (NIE wczytywany
│                                                  przez żadną fazę; dopisany do drzewa 2026-08-23g)
├── modules/                                    ← 5 modułów, pełna lista w YAML `modules:`
│   ├── MOD-INTERLINIE.md                       ← zbędne puste linie (FAZA 2D-1)
│   ├── MOD-WSTAWKI.md                          ← wstawki opisowe (FAZA 2D-2)
│   ├── MOD-DESCRIPTION.md                      ← description, profil ≤200 (FAZA 2C)
│   ├── MOD-TRESC-MERYTORYCZNA.md               ← FAZA 3E, treść modułów DR po zmianie przepisu
│   └── MOD-PROPAGACJA-NOWELIZACJI.md           ← propagacja nowelizacji przez CAŁY system
├── widgets/
│   └── WIDGET-MENU.md                          ← menu interaktywne (FAZA 0B; 14 pozycji, poz. 14 → FAZA 0E)
├── scripts/                                    ← 47 plików (stan 2026-09-27e): testy T1-T4, T8, T9, T11-T36, T38,
│   │                                             orkiestrator, ci_check_shared (T6/T7),
│   │                                             check_rejestracja_modulow, sync ELI (3 pliki),
│   │                                             2 skrypty .sh, README.md — pełna lista w YAML
│   └── …                                         `scripts:`
└── references/                                 ← 44 pliki (31 w katalogu głównym + 13 w podfolderze)
    ├── AUDIT-JOURNAL.md                        ← dziennik audytów (kilka MB; nie wczytywać w całości — FAZA 0)
    ├── WARN-OTWARTE.md                         ← rejestr żywy otwartych flag (ZASADA 10)
    ├── CHANGELOG.md                            ← historia wersji orkiestratora (F-78)
    ├── CHECKLIST-DEDUP.md                      ← mapa pojęć → lokalizacje kanoniczne
    ├── REGRESSION-TEST-PLAN.md                 ← testy T1-T17
    ├── PORTALE-ORZECZNICZE-API.md              ← dostęp maszynowy do orzecznictwa/interpretacji
    ├── F-171-pomiar-domen-2026-09-09.md        ← surowy wynik T25 (52 sondy), 4 regresje — F-171
    ├── F-152-pomiar-domen-2026-09-04.md        ← surowy wynik T25 (40 sond), dowód zamknięcia F-152
    ├── SYNC-DZU-AUTOMATYCZNY.md                ← + HARMONOGRAM-CRON.md, FORMAT-RAPORTU-ROZNIC.md
    ├── SCHEDULED-TASK-COWORK.md                ← POZYCJA 11 menu (FAZA 0C)
    ├── PAMIEC-TRWALA-ROUTER.md                 ← POZYCJA 13 menu (FAZA 0D)
    ├── F-108-lista-MS-egzamin-2026.md          ← benchmark F-108 (52 akty MS; 52/52 B+/COV, 0 FULL)
    ├── mapa_dzu_2026-10-04.md                  ← mapa Dz.U. AKTUALNA (AUDYT-2026-10-04, 2026/1161)
    ├── mapa_dzu_2026-08-28.md                  ← generacja poprzednia; dane test_f108_consistency.py
    │                                             (starsze generacje usunięte w 6.208 — historia w Git)
    └── raporty-pokrycia-2026-08-13/            ← 12 raportów + indeks = 13 plików
```

---

*Wersja: 6.217 | Ostatnia aktualizacja: 2026-10-10 (AUDYT-2026-10-10a). Stopkę aktualizuj razem z polem `version`.*

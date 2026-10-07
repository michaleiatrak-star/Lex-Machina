# Historia zmian plików — audyt-systemu-v4

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## SKILL.md (przeniesione 2026-10-04n)

## CHANGELOG

⛔ **Historia zmian tego skilla NIE mieszka w tym pliku.** Pełny changelog:

```
view audyt-systemu-v4/references/CHANGELOG.md
```

Skrót bieżącej wersji — pole `changelog:` we frontmatterze powyżej.
Standard systemowy (2026-08-20z4): `references/CHANGELOG.md` jest jedyną
lokalizacją kanoniczną historii; zakaz odtwarzania sekcji changelogu w korpusie
SKILL.md i zakaz trzymania pełnej listy wpisów w YAML.

## Frontmatter SKILL.md — adnotacje YAML do wersji 6.173 (przeniesione 2026-10-05, AUDYT-2026-10-05)

Frontmatter w brzmieniu sprzed usunięcia komentarzy (wartości bez zmian; usunięte wyłącznie komentarze).

```yaml
name: audyt-systemu-v4
description: "Audyt jakości, spójności i bezpieczeństwa systemu prawnych skilli: zależności, wersje, mapy Dz.U., treść merytoryczna, propagacja zmian, deduplikacja i bramki jakości."
dependencies:
  requires:
    - shared
  # 2026-09-27e: jawna zależność (każdy skill systemu korzysta z `shared`); pole czytane przy imporcie z marketplace
version: "6.173"   # ⛔ CUDZYSŁOWY OBOWIĄZKOWE od 6.10: niecytowane `6.10` YAML
                  # parsuje jako float 6.1 — czyli numer NIŻSZY niż 6.9, co cicho
                  # odwraca porządek wersji. Wykryte przy walidacji 2026-08-20z.
                  # Każda kolejna wersja z dwucyfrowym minor — też w cudzysłowie.
type: governance-audit
compatibility: "host-neutral; file read/write, fresh legal-source lookup and optional archive/UI operations mapped by the runtime adapter"
entrypoint: SKILL.md
modules:
  - modules/MOD-INTERLINIE.md          # usuwanie zbędnych pustych linii
  - modules/MOD-WSTAWKI.md             # usuwanie wstawek opisowych
  - modules/MOD-DESCRIPTION.md         # walidacja description (profil uniwersalny ≤200)
  - modules/MOD-TRESC-MERYTORYCZNA.md  # FAZA 3E — weryfikacja treści modułów DR po zmianie przepisu (ZASADA 12, dodane 2026-07-16)
  - modules/MOD-PROPAGACJA-NOWELIZACJI.md  # propagacja zmian z konkretnej nowelizacji przez CAŁY system, nie 1 moduł (dodane 2026-07-26)
widgets:
  - widgets/WIDGET-MENU.md        # interaktywne menu wielokrotnego wyboru
references:
  - references/AUDIT-JOURNAL.md
  - references/F-113-PREFLIGHT-2026-08-26.md
  - references/HISTORIA-ZMIAN-PLIKOW.md   # historia zmian SKILL.md (2026-10-04n, AUDYT-2026-10-04n); plik historyczny, nie czytany przy pracy
  - references/CHANGELOG.md   # ⚡ REJESTROWANE 2026-08-23g (F-124) — plik-sierota mimo że ZASADA 15
                                          # czyni go JEDYNĄ lokalizacją kanoniczną historii wersji tego skilla
                                          # i mimo że drzewo w sekcji STRUKTURA KATALOGU już go wymieniało;
                                          # dokładnie ten sam wzorzec co F-80, tylko odwrotny kierunek rozjazdu
  - references/F-104-lista-robocza-roczniki-starsze.md   # lista robocza F-104 dla roczników 2013-2025
                                          # (70 pozycji z T11) — REJESTROWANE 2026-08-23g (F-124), plik-sierota
  - references/F-136-zakres-DzU-2022-2600.md   # pełny inwentarz 116 dyspozycji nowelizacji KK i wynik T16
  - references/F-171-pomiar-domen-2026-09-09.md   # surowy wynik T25 z 2026-09-09 (52 sondy):
                                          # 4 regresje (SAOS /api/search, /api/dump,
                                          # /api/judgments/{id} — 502; decyzje.uokik.gov.pl — 503)
                                          # i 8 pozycji grupy `kandydaci` odpowiadających mimo
                                          # statusu POZA_LISTA; materiał do F-157 i F-171
  - references/F-152-pomiar-domen-2026-09-04.md   # surowy wynik T25 (40 sond) — dowód zamknięcia F-152
                                          # i materiał źródłowy §2G/§6/§7 inwentarza; dodane 2026-09-04
  - references/PORTALE-ORZECZNICZE-API.md   # inwentarz dostępu maszynowego do orzecznictwa
                                          # i interpretacji — materiał wykonawczy dla
                                          # HIERARCHIA-ZRODEL (RZĄD 2A organów) i PRAWO-HARDGATE
                                          # (POZIOM B); dodane 2026-09-01c, flagi F-151 / F-152.
                                          # 2026-09-01d: sekcja 2B (rejestry — API Sejmu jako następca
                                          # ORKA/ORKA2, KRS, CEIDG v3, REGON/BIR, SUDOP, RCL),
                                          # 2C (pułapka cicho ignorowanego parametru: /prints?limit=1
                                          # zwraca 3219 pozycji z HTTP 200) i 2D (interpretacje
                                          # indywidualne GIP od 2026-07-08 — zakres nowej flagi F-153)
  - references/WARN-OTWARTE.md   # rejestr żywy TYLKO otwartych flag (WARN + strukturalne) — dodane 2026-07-07, ZASADA 10; ⚡ od 2026-08-15w zaczyna się TABLICĄ STERUJĄCĄ (indeks wszystkich flag + następny krok w jednym zdaniu) — czytaj ją PIERWSZĄ przy pytaniu „co jest do zrobienia"
  - references/SPROSTOWANIE-LM-2026-08-23.md   # dokument do wysłania autorowi raportów TEST1-3 — realizacja F-116 część 3/3, bez treści proceduralnej systemu — dodane 2026-08-23f
  - references/CHECKLIST-DEDUP.md   # mapa pojęć → lokalizacje (5 not, NOTA-6 ORPHAN dodana 06-14g)
  - references/mapa_dzu_2026-10-04.md      # ⭐ GENERACJA BIEŻĄCA (AUDYT-2026-10-04) — 2026/1161 (samorządy
                                          # architektów/inżynierów + PrBud), 2002/690 rozp. WT — UCH od 20.09.2026 (F-224)
  - references/mapa_dzu_2026-09-22.md      # generacja POPRZEDNIA (F-193) — wiersz 2026/26 z etapami
                                          # + MONITORING etapów 1.10.2026 i 1.01.2027 (sesja TARGETED)
  - references/mapa_dzu_2026-09-10.md      # generacja POPRZEDNIA (F-148a) — +5 pozycji, w tym trzy
                                          # wchodzące jako skutek DWÓCH błędów podmiany aktu
                                          # (2024/1474 i 2024/1194); KROK 2C dla 2026/815
  - references/mapa_dzu_2026-09-09.md   # generacja POPRZEDNIA (F-172) — 11 numerów z T11
                                        # zweryfikowanych w RZĘDZIE 1 (ELI), 10 wierszy dodanych, 1 do MONITORING,
                                        # 3 wiersze przestawione na PREV po ujawnieniu nowszych t.j.
  - references/mapa_dzu_2026-08-28.md   # POPRZEDNIA generacja; ponowny audyt F-108, korekty tożsamości i statusów t.j.
  - references/mapa_dzu_2026-08-26.md   # POPRZEDNIA generacja — zachowana historycznie
  - references/mapa_dzu_2026-07-15.md   # POPRZEDNIA generacja (sync 2026-08-13) — zachowana jako materiał historyczny
  - references/ALIASY-NAZW-AKTOW.md       # rozstrzygnięcia człowieka: nazwa robocza aktu w rejestrze
                                          # = ten sam akt co tytuł urzędowy w ELI. Kontrakt dla T15;
                                          # NIE jest listą wyciszeń — wpis bez kolumny „Sprawdzone"
                                          # jest nieważny (F-148a)
  - references/SKRYPTY-RECZNE.md          # rejestr skryptów świadomie poza pełnym przebiegiem,
                                          # z powodem i wskazaniem, kto je uruchamia. Kontrakt dla T23
  - references/PROTOKOL-WYKONAWCZY-F113.md   # warstwa OPERACYJNA protokołu F-113 (F-176, 2026-09-10):
                                          # budowa ramienia kontrolnego, plan minimum 20 przebiegów,
                                          # karta przebiegu, łańcuch wykonania
  - references/PLAN-TESTU-BRAMEK-F113.md   # protokół testu SKUTECZNOŚCI bramek z GRUPĄ KONTROLNĄ
                                          # (F-113, część projektowa, 2026-08-24). Odpowiada na pytanie,
                                          # którego `grep` nie rozstrzyga: czy bramka ZMIENIA ZACHOWANIE,
                                          # czy tylko jest obecna w pliku. Zawiera zakaz podawania kryteriów
                                          # w prompcie, trzy komórki środowiskowe, pozycje-pułapki i progi orzekania
  - references/REGRESSION-TEST-PLAN.md   # plan testów T1-T19; T19 chroni ustalenia F-108
  - references/SYNC-DZU-AUTOMATYCZNY.md   # narzędzie WSPIERAJĄCE FAZĘ 3 — automatyzacja wykrywania nowych pozycji Dz.U./M.P. (wprowadzone 2026-07-13, skonsolidowane z osobnego skilla 2026-07-13f) — REJESTROWANE 2026-08-15 po wykryciu jako plik-sierota (użytkownik przesłał starą wersję ZIP i zapytał o funkcję scheduled task; plik istniał na dysku, ale nigdy nie trafił do tego frontmatter)
  - references/HARMONOGRAM-CRON.md   # przykłady harmonogramu (cron / GitHub Actions) do adaptacji przez developera — powiązane z SYNC-DZU-AUTOMATYCZNY.md — REJESTROWANE 2026-08-15, ten sam powód co wyżej
  - references/SCHEDULED-TASK-COWORK.md   # POZYCJA 11 menu — zadanie cykliczne w Cowork (TRYB DZU co tydzień): warunek uruchomienia, kanoniczna treść Description+promptu, blok map pokrycia za bramką F-83 — DODANE 2026-08-15o
  - references/PAMIEC-TRWALA-ROUTER.md   # POZYCJA 13 menu — od 6.125 kontrola zgodności preferencji użytkownika z UP routera (tylko odczyt, bez zapisu do pamięci)
  - references/FORMAT-RAPORTU-ROZNIC.md   # format wyjściowy raportu różnic produkowanego przez sync_dzu_eli.py — REJESTROWANE 2026-08-15, ten sam powód co wyżej
  - references/mapa_dzu_2026-07-04.md   # ARCHIWALNA — poprzednia wersja mapy Dz.U., zachowywana jako materiał historyczny cytowany w AUDIT-JOURNAL.md — REJESTROWANE 2026-08-15 (nigdy formalnie nie wpisana mimo aktywnego cytowania)
  - references/mapa_dzu_2026-07-02.md   # ARCHIWALNA — jw., wcześniejsza wersja — REJESTROWANE 2026-08-15
  - references/F-108-lista-MS-egzamin-2026.md   # benchmark 52 aktów MS; stan końcowy F-108: 52/52 routing i 52/52 B+/COV, 0 FULL
  - references/F-108-verification-2026-08-28.md  # dowód ponownej weryfikacji pokrycia i aktualności t.j./Dz.U.
  - references/COWORK-HARMONOGRAM-NATYWNY.md   # natywny harmonogram Cowork jako wariant POZYCJI 11 obok
                                          # SCHEDULED-TASK-COWORK.md — REJESTROWANE 2026-09-01 (F-147), plik-sierota
  - references/F-104-lista-robocza-mapa-dzu.md   # lista robocza flagi F-104 — 16 aktów rocznika 2026
                                          # do wpisania do mapy centralnej, po kwalifikacji numer GŁÓWNY vs POBOCZNY;
                                          # zawiera opis pułapki parsowania (mapa trzyma numer w DWÓCH formatach:
                                          # prozą `poz. N` i w kolumnach tabeli) — dodane 2026-08-21
  - references/raporty-pokrycia-2026-08-13/   # 10 raportów + indeks = 11 plików (2026-10-04b: KPK i KRO — relikty F-81/F-73 usunięte); wcześniej 13
  - references/PLAN-POMIARU-BRAMEK-UNIWERSALNY.md   # F-167 (27f): projekt pomiaru DOWOLNEJ bramki;
                                          # uogólnia PLAN-TESTU-BRAMEK-F113 — REJESTROWANE 2026-09-27j (T22, plik-sierota od 27f)
  - references/REJESTR-BRAMEK-POMIAR.json # F-167 (27f): rejestr bramek i wycięć dla build_ramie_kontrolne.py — REJESTROWANE 27j (T22)
  - references/REJESTR-KORPUSU-POMIAROWEGO.md   # F-167 (27f): metryki korpusu bez treści — REJESTROWANE 27j (T22)
scripts:
  - scripts/check_wartosci_prawne.py      # T28 — wartości i cytaty (W1 rejestr znanych błędnych cytatów,
                                          # W2 procent przy odsetkach, W3 kwota bez podstawy). Offline.
                                          # W orkiestratorze od 2026-09-16 (F-189) — wcześniej SKRYPTY-RECZNE
                                          # deklarował „wchodzi do orkiestratora", a orkiestrator go nie wołał
  - scripts/check_oplaty_mapa.py          # T29 — integralność podziału TABELE-OPLAT (rdzeń + satelity).
                                          # Offline; w orkiestratorze od 2026-09-16 (F-189)
  - scripts/check_utrata_tresci.py        # T30 — utrata treści BEZ cofnięcia numeru (F-189): tabele
                                          # „było → jest" z AUDIT-JOURNAL vs dysk + kolizje numerów wersji
                                          # (deklaracja „LUKA JAWNA"/„KOLIZJA" w CHANGELOG honorowana).
                                          # Offline, selftest 5/5; w orkiestratorze jako BLOKER od 2026-09-16c
  - scripts/check_wydanie.py              # T33 — zgodność wydanych paczek (.zip) z drzewem: liczba plików,
                                          # bajtowa identyczność, sumy WEWNĄTRZ paczki. Realizacja zalecenia
                                          # z AUDYT-2026-09-17p (zmiana kopii roboczej PO wydaniu).
                                          # Offline, selftest 4/4; brak katalogu wydań = PASS (pomija)
  - scripts/check_archiwa_repo.py         # T34 — drzewo rozpakowane ↔ paczki ZIP repozytorium (F-196):
                                          # nadmiar/brak/różna treść, zagnieżdżony <skill>/<skill>/. T33
                                          # porównuje z katalogiem wydań sesji i w repo był bezprzedmiotowy.
                                          # Offline, selftest 4/4; BLOKER od 2026-09-26
  - scripts/check_wejscie_dokumentu.py    # T35 — wywołanie shared/MOD-WEJSCIE-DOKUMENTU.md u każdego
                                          # konsumenta z DEPENDENCY-GRAPH + zakaz kopii treści WD (F-200).
                                          # Offline, selftest 4/4; BLOKER od 2026-09-26
  - scripts/check_eli_extract.py          # T36 — regresja shared/tools/eli_art_extract.py (F-201):
                                          # treść obwieszczenia ≠ przepis, przypisy, indeksy, wybór t.j.
                                          # Offline (15 przypadków, 1 live pomijany); BLOKER od 2026-09-26
  - scripts/check_plugin_manifest.py      # T38 — `.claude-plugin/plugin.json` każdego skilla: name/version/
                                          # description = SKILL.md; `dependencies` → shared we frontmatterze;
                                          # marketplace.json ↔ katalogi 1:1. Offline, selftest 5/5; BLOKER
                                          # od 2026-09-27e. ⛔ Każde podbicie `version:` w SKILL.md wymaga
                                          # tej samej zmiany w plugin.json — inaczej T38 FAIL.
  - scripts/check_kontrakt_rachunek.py    # T39 — regresja shared/tools/kontrakt_rachunek.py (F-215): testy
                                          # jednostkowe + korpus analizator-umow-v1/benchmark/posiane-wady
                                          # (05: i3 słownie≠cyfrą, i6 martwe §10; 01: zero alarmów). BLOKER
  - scripts/check_sekrety.py              # T40 — JWT (również PESEL zakodowany w ładunku), klucze PEM, tokeny
                                          # API, PESEL z poprawną sumą kontrolną; wartości maskowane. Offline,
                                          # selftest 6/6; BLOKER od 2026-09-29 (F-216, F-217)
  - scripts/check_graf_przyczynowy.py     # T42 — MOD-GRAF-PRZYCZYNOWY: selftest silnika shared/tools/graf_przyczynowy.py,
                                          # parytet z silnikiem JS widgetu chronologii (±1e-6), regresja błędu
                                          # „× 0,9 = 0,27” w MOD-LANCUCH-DOWODOWY, podpięcia MP13/TRYB C/MET-PT.
                                          # Offline (Node opcjonalny: bez niego WARN); BLOKER od 2026-10-01b
  - scripts/check_mapy_aktow.py          # T45 — MAPA-AKTOW/ROUTING-MAP czytelne dla parsera Markdown (nagłówek,
                                          # liczba komórek), każdy moduł DR w kolumnie „Moduł”, odesłania rozwiązywalne
  - scripts/test_mac_ce_litery.py        # T46 — polskie litery w Dz.U./M.P. 2000–2009 (Mac CE opisane jako Mac
                                          # Roman, zgłoszenie #83): mapa wyprowadzona z kodeków, wykrycie usterki
                                          # (bez fałszywych trafień na francuskim), żywa pagina, zgodność PY↔JS
  - scripts/napraw_tekst_dzu.py          # KONWERTER UŻYTKOWNIKA (nie test) — czyta akt Dz.U./M.P. z lat 2000–2009
                                          # z poprawnymi polskimi literami: txt/md/html do podglądu. Wiążący
                                          # pozostaje PDF ogłoszony; do pisma cytuj z ELI (RZĄD 1)
  - scripts/check_osiagalnosc_shared.py  # T44 — każdy plik shared osiągalny z SKILL.md skilli produkcyjnych
                                          # (bez krawędzi z audytu i rejestrów); allowlista z uzasadnieniem
  - scripts/check_sieroty.py             # T43 — sieroty: plik bez ścieżki wywołania (ścieżkowo, odróżnia
                                          # pliki o tej samej nazwie); allowlista z uzasadnieniem w skrypcie
  - scripts/check_limit_plikow.py         # T41 — każdy skill < 200 plików (reguła użytkownika), WARN od 190;
                                          # przed redukcją szukaj RELIKTÓW (pliki usunięte, a wskrzeszone przez
                                          # instalację „na nakładkę”). Offline, selftest; BLOKER od 2026-09-29c
  - scripts/check_tabele_satelickie.py    # T32 — rejestr tabel satelickich (shared/TABELE-OPLAT.md §7):
                                          # plik musi istnieć (FAIL), kwota bez podstawy w wierszu, kolumnie
                                          # albo nagłówku/zdaniu wprowadzającym = WARN. Offline, selftest 9/9;
                                          # w orkiestratorze od 2026-09-16e (O-11(b))
  - scripts/check_podmiana_aktu.py        # T31 — podmiana aktu w ROUTING-MAP i MAPA-AKTOW niezależnie od
                                          # oznaczenia „t.j." (T15 porównuje tytuły tylko przy t.j.).
                                          # WYMAGA SIECI (ELI), selftest 3/3; ręczny. Dodany 2026-09-16d
  - scripts/check_widmowe_pokrycie.py     # T5 — widmowe pokrycie: KANDYDACI do przeglądu ręcznego (wiersz
                                          # ROUTING-MAP → moduł bez numeru i bez nazwy aktu). Offline, selftest 4/4.
                                          # Ręczny (wynik wymaga osądu) — SKRYPTY-RECZNE. Dodany 2026-09-16b
  - scripts/weryfikator_sygnatur.py       # V-SYG-0 — kontrola istnienia sygnatury w kanale maszynowym
                                          # (shared/SYGNATURY.md, DOSTEP-MASZYNOWY-API.md). WYMAGA SIECI —
                                          # narzędzie wykonawcze, nie test; poza orkiestratorem (SKRYPTY-RECZNE)
  - scripts/test_pokrycie_orkiestratora.py # T23 — każdy zarejestrowany skrypt testowy MUSI być albo
                                          # wywoływany przez orkiestrator, albo jawnie zadeklarowany
                                          # jako ręczny w references/SKRYPTY-RECZNE.md z powodem (O-4)
  - scripts/test_module_registration.py   # T1 — rejestracja modułów (KRYTYCZNY)
  - scripts/test_module_count.py          # T2 — zgodność liczników (WYSOKI)
  - scripts/test_cross_map_dzu.py         # T3 — spójność Dz.U. między mapami (KRYTYCZNY, heurystyka→WARN)
  - scripts/test_header_snapshot.py       # T4 — integralność nagłówków, --snapshot/--verify (KRYTYCZNY, RĘCZNY)
  - scripts/test_title_scope_match.py     # T8 — zakres tytuł-vs-treść (WYSOKI, heurystyka→WARN)
  - scripts/test_moved_to_shared.py       # T9 — weryfikacja przeniesień do shared/ (WYSOKI, heurystyka celowana→WARN, dodane 2026-07-21)
  # T10 (check_nexto_free_files.py, monitorowanie plików Nexto/Virtualo,
  # flaga F-12) USUNIĘTE 2026-07-24d na polecenie użytkownika — patrz
  # AUDIT-JOURNAL.md, wpis AUDYT-2026-07-24d
  - scripts/check_wersje_changelog.py     # T12 — zgodność metadanych wersji skilla: `version:` vs najnowszy wpis references/CHANGELOG.md vs pole `changelog:` vs nagłówek H1 i stopka; wykrywa też pułapkę float (niecytowane `X.10` parsuje się jako X.1, czyli MNIEJ niż X.9). ŚREDNI, dodany 2026-08-20z, flaga F-101 — powstał po wykryciu tego samego rozjazdu w 3 skillach z 3 rodzin w jednej sesji. ⚡ ROZSZERZONY 2026-08-31 (F-140, sekcja 12c planu testów) o PIĄTĄ kontrolę: regresja dysk vs AUDIT-JOURNAL — `dysk < dziennik` = ⛔ utrata pracy (cztery poprzednie kontrole porównują nośniki WEWNĄTRZ skilla i są ślepe na cofnięcie całego stanu dyskowego)
  - scripts/check_dlugosc_modulow.py     # T13 — próg długości modułu (ZASADA 13): ⛔ dla `modules/mod-*.md`
                                          # >1000 linii, ⚠️ dla strefy 800-1000. ŚREDNI, dodany 2026-08-21,
                                          # obserwacja O-3 — powstał po tym, jak naruszenie w mod-KC-spadki
                                          # (1036 l.) przetrwało do ręcznego skanu ad hoc, bo system miał
                                          # 12 testów na rejestry/wersje/mapy i ZERO na długość
  - scripts/build_ramie_kontrolne_f113.py # generator RAMIENIA A (kontrolnego) dla F-113 (F-176):
                                          # wycina bramki B1-B5, kasuje ich pliki kanoniczne, SPRZĄTA
                                          # odwołania i weryfikuje wynik przez ci_check_shared.
                                          # ⛔ Krok sprzątania jest krytyczny: zmierzone 2026-09-10 —
                                          # 3 skasowane pliki zostawiają 43 zerwane odwołania w 57
                                          # plikach, a skill z zerwanym odwołaniem wchodzi w TRYB
                                          # ZDEGRADOWANY, więc przebieg mierzyłby reakcję na awarię
                                          # zasobu zamiast braku bramki
  - scripts/build_ramie_kontrolne.py      # F-167 (27f): UNIWERSALNY generator RAMIENIA A dla dowolnej bramki
                                          # (mapa wycięć w REJESTR-BRAMEK-POMIAR.json, nie w kodzie) — REJESTROWANE 27j (T22)
  - scripts/ocena_transkryptow_f113.py    # narzędzie do protokołu F-113: anonimizacja przebiegów
                                          # (ocena Ślepa), karta ocen, liczenie Δ między ramionami.
                                          # ⛔ NIE ocenia transkryptów automatycznie — świadomie, patrz docstring
  - scripts/check_description.py          # T14 — OBECNOŚĆ i długość pola `description:` w SKILL.md.
                                          # KRYTYCZNY, dodany 2026-08-24, flaga F-130 — powstał po tym, jak `audyt-systemu-v4`
                                          # okazał się JEDYNYM skillem w systemie bez tego pola, a FAZA 2C nie mogła
                                          # tego zobaczyć: jej skrypt dla pliku BEZ pola wypisywał `0` i klasyfikował
                                          # wynik jako ✅ OK. Brak pola raportowany jako stan najzdrowszy.
  - scripts/check_sync_aktow.py           # T11 — synchronizacja AKTÓW między lokalną MAPA-AKTOW, ROUTING-MAP i mapą Dz.U. (WYSOKI, heurystyka→WARN, dodany 2026-08-15z, flaga F-89) — wykrywa BRAK pozycji, czego T3 (rozbieżność numeru) i check_rejestracja_modulow (moduły) nie robią
  - scripts/run_regression_suite.py       # orkiestrator — uruchamia T1/T2/T3/T6/T7/T8 w jednym przebiegu
  - scripts/ci_check_shared.py            # T6/T7 — zerwane odwołania / duplikaty (już istniejący, wywoływany przez orkiestrator)
  - scripts/check_rejestracja_modulow.py  # kontrola spójności rejestracji modułów DR (4 rejestry: dysk/SKILL.md/MAPA-AKTOW.md/ROUTING-MAP.md) — powstał 2026-08-14e (F-77) — REJESTROWANE 2026-08-15, plik-sierota tego samego wzorca jaki sam wykrywa
  - scripts/check_coverage_coherence.py   # T18 — wszystkie 16 MAPA-POKRYCIA, jawne ścieżki routingu, moduły-widma
                                          # i stałe deklaracje „brak modułu”; KRYTYCZNY, dodany 2026-08-27 po audycie
                                          # pokrycia. ⚡ NAPRAWIONE 2026-09-01 (F-147): wpis był doklejony do komentarza
                                          # linii poprzedniej ESCAPE'em nowej linii zapisanym DOSŁOWNIE (backslash + n),
                                          # więc parser YAML widział JEDEN element listy z długim komentarzem, a T18 —
                                          # test KRYTYCZNY — nie figurował w rejestrze `scripts:` mimo obecności na dysku
                                          # i w orkiestratorze. Odtąd pilnuje tego T22 (check_frontmatter_rejestracja.py),
                                          # który ten sam dwuznak traktuje jako błąd — dlatego opis tutaj go NIE cytuje
  - scripts/sync_dzu_eli.py               # pobiera z Sejm ELI API nowe pozycje Dz.U./M.P., produkuje raport różnic — patrz SYNC-DZU-AUTOMATYCZNY.md — REJESTROWANE 2026-08-15
  - scripts/audit_tj_inventory.py         # T15 — sprawdza wszystkie operacyjne deklaracje t.j. względem rocznych indeksów Sejm ELI; tryby maps/operational/all; błąd API = exit 2, dodane 2026-08-26
  - scripts/audit_amendment_scope.py      # T16 — pełny inwentarz dyspozycji nowelizacji i propagacja każdej zmienionej jednostki przez cały korpus; bez ścieżek hosta
  - scripts/check_status_podstaw.py       # T27 — czy numer Dz.U. podany W PROZIE jako aktualna
                                          # podstawa prawna opisuje akt obowiązujący (O-9, F-181).
                                          # ⛔ WYMAGA SIECI. ⛔ Raportuje „DO PRZEGLĄDU", nie FAIL:
                                          # heurystyka tego badania dwukrotnie zawyżyła wynik,
                                          # a wygasły numer w kontekście historycznym NIE jest błędem
  - scripts/check_wyjatek_gate_eli.py     # T20 — trzy z czterech zamiatań bramki WYJ-GATE (F-144):
                                          # S1 sąsiedztwo (art. X¹ to osobna jednostka), S2 krawędzie
                                          # jednostki (klauzule zakresowe), S3 rejestr odesłań ELI
                                          # (lex specialis poza aktem). ŚREDNI, dodany 2026-08-31c jako
                                          # check_unit_sweep_eli.py, przemianowany 2026-08-31d wraz
                                          # z modułem. `--selftest` 23/23 PASS + mutacje negatywne.
                                          # ⚡ 2026-09-01c (F-150): gałąź sieciowa URUCHOMIONA na żywym
                                          # api.sejm.gov.pl/eli; ujawniła cztery usterki fałszywie
                                          # negatywne (tekst ogłoszony zamiast t.j., mylący komunikat
                                          # przy textHTML:false, parser S3 niezgodny z kształtem żywego
                                          # ELI, fałszywe nagłówki z prozy) — wszystkie naprawione.
                                          # Wymaga `pdftotext` dla ścieżki tekstu jednolitego.
                                          # ⚡ 2026-09-01d (F-153): dodana kontrola KROK 2C — lista aktów
                                          # zmieniających OGŁOSZONYCH PO dacie t.j.; naprawa F-150
                                          # przesunęła punkt ślepy o jedną wersję, nie usunęła go.
                                          # Selftest 20/20.
                                          # ⛔ NIE ocenia wpływu — świadomie
  - scripts/check_checksums.py            # T21 — kompletność I zgodność CHECKSUMS.sha256 (F-145):
                                          # `sha256sum -c` widzi tylko sumy niezgodne, NIE widzi plików
                                          # BEZ wpisu — a brak wpisu daje wynik pozornie najzdrowszy.
                                          # Ten sam wzorzec co F-130 (brak `description:` raportowany
                                          # jako 0 = OK). KRYTYCZNY, dodany 2026-08-31d; przy wprowadzeniu
                                          # wykrył 34 rozjazdy w 3 skillach, w tym 7 plików bez wpisu
  - scripts/check_nowelizacje_po_tj.py     # T24 — pozycje MAPA-AKTOW, których t.j. NIE zawiera już
                                          # ogłoszonych nowelizacji. Dodany 2026-09-01j, flaga F-156.
                                          # ⛔ Rozstrzygnięcie: liczby NIE wpisujemy do map — w ciągu
                                          # jednego dnia trzy oznaczenia w DR-08 rozjechały się z rejestrem
                                          # (2→3, 3→5, 1→2), bo rosną z każdą publikacją Dz.U. Wynik ma
                                          # powstawać w momencie uruchomienia. Liczy UNIĘ sekcji ELI
                                          # i metody datowej (F-155); logikę IMPORTUJE z
                                          # check_wyjatek_gate_eli.py, nie kopiuje. WYMAGA SIECI — stoi
                                          # poza orkiestratorem, jak T15/T20. `--selftest` 7/7 offline
  - scripts/check_frontmatter_yaml.py     # T26 — czy frontmatter KAŻDEGO SKILL.md parsuje się jako
                                          # YAML i czy pola listowe są listami TEKSTÓW, nie map.
                                          # Dodany 2026-09-04c, flaga F-159. ⛔ Powstał po NAWROCIE:
                                          # prawny-router-v3 dwa razy pod rząd nie ładował się na
                                          # hoście przez zły YAML (3.37/F-146 — niesparowany
                                          # cudzysłów; 3.38/F-159 — „: " w linii kontynuacji elementu
                                          # listy). Za każdym razem naprawiano OBJAW, bo ŻADEN skrypt
                                          # w pakiecie nie używał PyYAML: T22 sprawdza, czy
                                          # frontmatter da się WYODRĘBNIĆ, nie czy da się PRZECZYTAĆ
                                          # (ta sama ślepota co F-130/F-145/F-147). Łapie też ciche
                                          # zniekształcenie typu: „- opcjonalnie: X" parsuje się bez
                                          # błędu jako MAPA. ⛔ Brak PyYAML = kod 2, nie 0 — test,
                                          # który przy braku zależności kończy cicho zerem, udaje że
                                          # sprawdził. `--selftest` 10/10 offline
  - scripts/check_domeny_allowlist.py     # T25 — osiągalność źródeł prawnych z kanału kodu (40 sond).
                                          # Dodany 2026-09-04, flagi F-152 ZAMKNIĘTA / F-157 / F-158.
                                          # ⛔ Powstał, bo PORTALE-ORZECZNICZE-API.md §5/§6 sam nakazywał
                                          # „po zmianie listy domen zmierzyć, nie przepisać", a narzędzia
                                          # do tego nie było — status `⬛ host` przetrwał w tabeli po tym,
                                          # jak domeny FAKTYCZNIE dopisano (ta sama klasa co F-156).
                                          # Łapie trzy rzeczy, których `curl -I` nie: (1) UA przeglądarkowy
                                          # jako sygnaturę bota — orzeczenia.ms.gov.pl 200 pod curl vs 502
                                          # pod Chrome, 5/5; (2) HTTP 200 ze stroną zastępczą (SAOS
                                          # „Przerwa techniczna") — dlatego sprawdza TREŚĆ, nie kod;
                                          # (3) przekierowanie na host spoza listy. Manifest trzyma
                                          # ŚCIEŻKI ROBOCZE, nie domeny (root ≠ ścieżka użyteczna).
                                          # WYMAGA SIECI — poza orkiestratorem, jak T15/T20/T24.
                                          # `--selftest` 17/17 offline z mutacjami negatywnymi.
                                          # Grupa `kandydaci` (odniesienie POZA_LISTA) sprawia, że po
                                          # zmianie listy dozwolonych test sam wypisze ODBLOKOWANE.
                                          # ⛔ Pola `flaky` i `pauza` — hosty niedeterministyczne i
                                          # limitujące tempo; oba pilnowane przypadkiem selftestu, by
                                          # nie stały się sposobem na uciszanie niewygodnych wyników
  - scripts/test_router_contract.py       # T17 — lekki router, stałe identyfikatory reguł, PATH-SELFTEST, [11] i N/N
  - scripts/check_frontmatter_rejestracja.py  # T22 — samo-rejestracja frontmatteru: każdy plik w modules/references/
                                          # scripts/widgets ma wpis w odpowiedniej liście YAML, każdy wpis ma plik,
                                          # a we frontmatterze nie ma dosłownie zapisanego escape'u nowej linii.
                                          # KRYTYCZNY, dodany 2026-09-01, flaga F-147 — system miał 21 testów i ZERO
                                          # na rejestrację własnych zasobów skilla narzędziowego: check_rejestracja_
                                          # modulow pilnuje tylko modułów DR, a ci_check_shared widzi wyłącznie
                                          # odwołania ZERWANE — plik obecny na dysku i nieobecny w rejestrze był dla
                                          # niego stanem najzdrowszym (ten sam wzorzec ślepoty co F-130 i F-145)
  - scripts/test_f108_trade.py            # F-108/46 — 6 półroczy, rejestr 52/52, propagacja i mutacje negatywne
  - scripts/test_f108_consistency.py      # T19 — guard 52/52 inventory, 52/52 COV, 0 FULL i znane korekty metryk Dz.U.
  - scripts/mock_eli_server_test.py       # mock serwera ELI do testowania sync_dzu_eli.py bez żywego dostępu do api.sejm.gov.pl — REJESTROWANE 2026-08-15
  - scripts/bootstrap_last_sync_date.py   # inicjalizacja pliku .last_sync_date przy pierwszym uruchomieniu sync_dzu_eli.py — REJESTROWANE 2026-08-15
  - scripts/dostarcz_skill.sh             # skrypt automatyzujący łańcuch dostawy (Reguła 4/6/7 HARDGATE-AUDYT: policz/zip/rozpakuj/diff) — REJESTROWANE 2026-08-15
  - scripts/install_precommit_hook.sh     # instalacja git pre-commit hook wywołującego testy regresyjne przed commitem — REJESTROWANE 2026-08-15
  - scripts/README.md                     # dokumentacja folderu scripts/ — REJESTROWANE 2026-08-15
```

## Stopka SKILL.md do wersji 6.173 (przeniesione 2026-10-05)

*Wersja: 6.173 | Ostatnia aktualizacja: 2026-10-04n (historia zmian plików w references/HISTORIA-ZMIAN-PLIKOW.md każdego skilla); poprzednio 2026-10-04m (znaczniki sekcji wykonywanych przez aplikację: lex:wykonuje-aplikacja); poprzednio 2026-10-04l (T2: wiersz umowy PL–UA o zabezpieczeniu społecznym przeniesiony do sekcji DR-04 ROUTING-MAP); poprzednio 2026-10-04k (zgłoszenie #83: polskie litery Mac CE w Dz.U./M.P. 2000–2009 — naprawa w serwerze MCP i w `check_wyjatek_gate_eli.py`, przebudowany `dist`, test T46, konwerter `napraw_tekst_dzu.py`; nowa F-234); poprzednio 2026-10-04j (F-233 zamknięta)*

*(Stopka podawała „5.0 | 2026-07-04" przy `version: 6.8` w YAML — rozjazd
9 wersji, naprawiony 2026-08-20y. **Stopkę aktualizuj razem z polem `version`**;
jeśli znów zacznie się rozjeżdżać, kandyduje do usunięcia jako pole martwe —
tak jak stopkę AUDIT-JOURNAL.md w korekcie 2026-08-15p.)*

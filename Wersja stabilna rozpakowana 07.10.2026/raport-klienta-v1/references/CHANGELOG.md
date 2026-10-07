# CHANGELOG — raport-klienta-v1

- 1.8 (2026-10-05o, AUDYT-2026-10-05o): widget: delta.bez_zmian widoczne (F-232)

- 1.7 (2026-10-05h, AUDYT-2026-10-05h): `assets/widget-raport-klienta.html` zasilany danymi: sekcje wg profilu IND/BIZ i trybu, „Eksportuj PDF”. Schemat: pola `co_dalej`, `potwierdzenie`, `data_raportu`, `najblizsze_zdarzenie`, `delta` jako obiekt.

- 1.6 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 1.5 (2026-09-05, sesja audytowa `audyt-systemu-v4`, flaga **F-163**): utworzono
  trzy pliki `references/`, które SKILL.md deklarował w drzewie katalogu i kazał
  wczytywać, a których **nie było w skillu ani nigdzie indziej w systemie**:
  `jezyk-klienta.md`, `sekcje-biznesowe.md`, `BLUEPRINT-SCHEMA.md`. SKILL.md
  odsyłał do nich w 12 miejscach (m.in. KROK 2 i KROK 3 sekwencji wywołania,
  oba tryby kryzysowe, self-check), więc skill odsyłał w próżnię przy każdym
  uruchomieniu. Klasa błędu identyczna z F-161 w `prawny-router-v3` (UP-5
  wskazująca nieistniejące moduły `shared`).
  **Dlaczego wyszło dopiero teraz:** poprzednia wersja `ci_check_shared`
  wymagała słowa `view` bezpośrednio przed ścieżką, a tutejsze instrukcje
  brzmią „wczytaj references/…". Wykryte po rozszerzeniu bramki (F-162).
  **Podstawa treści:** wszystkie trzy pliki wywiedzione ze specyfikacji
  zawartej w samym SKILL.md — nazwy sekcji wywoływanych po nazwie („ZŁE
  WIADOMOŚCI — ZDARZENIE W TRAKCIE SPRAWY", „OGRANICZENIE SZKÓD — SYTUACJA
  JEDNOZNACZNA…"), struktury FAKT→ZNACZENIE→PRZYCZYNA→CO DALEJ oraz
  WYNIK→ZAMKNIĘTE→DO ROZLICZENIA→NATYCHMIASTOWE→RYZYKA REZYDUALNE, lista
  sekcji BIZ, pola schematu widgetu i mapowanie `assessment.level` na tryb.
  ⛔ Nie dopisano żadnej sekcji ani pola, których SKILL.md nie przewiduje.
  ⚠️ Słownik żargonu jest materiałem KOMUNIKACYJNYM, nie prawnym: nie zawiera
  kwot, stawek ani długości terminów — każde takie ustalenie wymaga
  weryfikacji w aktualnym brzmieniu przepisu (`shared/PRAWO-HARDGATE.md`).
  Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis
  AUDYT-2026-09-05c.

- 1.4 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-127**): NAPRAWA wstawki F-115 z sesji 08-23i — blok `SELF-CHECK ANTY-FASADA` był wstawiony WEWNĄTRZ bloku ``` sekcji ARCHITEKTURA, przez co rozbijał drzewo katalogu. Blok przeniesiony pod blok HARD GATE odsyłający do `shared/PRAWO-HARDGATE.md`. Klasa błędu: REGUŁA 5 bloku HARDGATE-AUDYT (`audyt-systemu-v4/references/WARN-OTWARTE.md`) — wstawianie treści bez kontroli struktury docelowej. Kontrola po naprawie: parzystość znaczników ``` zachowana, spis nagłówków identyczny przed/po. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 1.3 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, bramka dodana (P2). Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.


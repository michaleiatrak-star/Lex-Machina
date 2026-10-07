# CHANGELOG — raport-sytuacyjny-v2

> Lokalizacja kanoniczna historii wersji tego skilla (ZASADA 15 w
> `audyt-systemu-v4/SKILL.md`). Plik założony 2026-08-23g — do tej daty wpisy
> mieszkały w polu YAML `changelog:` w SKILL.md, co jest dokładnie tą klasą
> rozproszenia, którą ZASADA 15 zakazuje (i którą test T12 zgłasza jako ⚠️).
> Pole YAML trzyma odtąd wyłącznie skrót bieżącej wersji.

- 2.12 (2026-10-05h, AUDYT-2026-10-05h): `assets/widget-raport-sytuacyjny.html` zasilany blueprintem (7 zakładek); sekwencja: `show_widget(path, data=BLUEPRINT)`. Wariant bez pola `data` (MOD-WIDGET-IO, kod) w sekcji WIDGET-DANE.

- 2.11 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 2.10 (2026-09-27d, AUDYT-2026-09-27d, F-207): **odtworzone** wywołanie `shared/MOD-WEJSCIE-DOKUMENTU.md` (bramka WD-1…WD-3, F-200) — jedyna zmiana tego skilla z wydania 2.9, które nie dotarło do repozytorium. Treść reguł nie jest kopiowana; obecność wywołania pilnuje T35.
- 2.9 — WYDANIE NIEDOSTARCZONE (F-207): odnotowane w AUDIT-JOURNAL, AUDYT-2026-09-26 §7 (wywołanie WD, F-200), nieobecne na żadnej gałęzi `michaleiatrak-star/Lex-Machina`. Zakres odtworzony w 2.10; numer 2.9 nie jest używany ponownie.

- 2.8 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, bramka dodana (P2). Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

- 2.7 (2026-08-23g, sesja audytowa audyt-systemu-v4, flaga F-123): dodano HARD
  GATE odsyłający do `shared/PRAWO-HARDGATE.md` przed wpisaniem do blueprintu
  jakiegokolwiek przepisu, terminu ustawowego, sygnatury lub skutku procesowego.
  PRZYCZYNA: pomiar `grep -rl PRAWO-HARDGATE` z 2026-08-23 wykazał ZERO odesłań
  w tym skillu, mimo że renderuje on użytkownikowi końcowemu chronologię, mapę
  ryzyk (pole `podstawa`) i rekomendacje procesowe zawierające twierdzenia o
  prawie — widget jest ostatnim ogniwem przed odbiorcą, więc treść, która tu
  przejdzie, nie ma już żadnej dalszej kontroli. Dodano też: (a) jawne
  rozróżnienie dwóch niezależnych osi statusu — klasyfikacja A–E ocenia źródło
  FAKTU w aktach, statusy PRAWO-HARDGATE oceniają źródło TWIERDZENIA O PRAWIE;
  (b) pozycję w sekcji HARD GATES — ZAKAZY (brak statusu → raport zostaje
  `WERSJA ROBOCZA`); (c) `PRAWO-HARDGATE.md` na czele listy w sekcji INTEGRACJA
  Z KANCELARYJNYM JĄDREM SHARED. Przy okazji: nagłówek H1 sprowadzony do samego
  MAJOR (`v2`) zgodnie z decyzją generalną F-102(C) — stało w nim „v2.5" przy
  `version: 2.6`; historia wersji wyniesiona z YAML do tego pliku (ZASADA 15).
  Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23g.

- 2.6: nowa zakładka Historia strategii (oś czasu wersji z MOD-HISTORIA-STRATEGII,
  oznaczenie wybranego i odrzuconych wariantów, porównanie wersji, powrót do
  wariantu); rozszerzenie zakładki Ryzyka o sekcję Priorytety sprawy (aspekty
  główne/poboczne + metody badawcze z MOD-PRIORYTETY-ASPEKTOW); nowe pola
  blueprintu: `priorytetyAspektow`, `historiaStrategii`.

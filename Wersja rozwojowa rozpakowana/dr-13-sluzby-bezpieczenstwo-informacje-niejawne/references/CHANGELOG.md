# CHANGELOG — dr-13-sluzby-bezpieczenstwo-informacje-niejawne

- 3.16 (2026-10-09f, AUDYT-2026-10-09f): ⛔ mod-ustawa-straz-graniczna: „ustawa o udzielaniu ochrony cudzoziemcom — Dz.U. 2024 poz. 1546” to t.j. rozp. RM o zaświadczeniach de minimis — poprawione na t.j. 2026/862 (ELI 2026-10-09).

- 3.15 (2026-10-04n, AUDYT-2026-10-04n): Historia zmian SKILL.md i modułów przeniesiona z plików roboczych do `references/HISTORIA-ZMIAN-PLIKOW.md` (plik historyczny, niewczytywany przez model). Treść robocza bez zmian.

- 3.14 (2026-10-04c, AUDYT-2026-10-04c): **F-227 (zamknięta).** SKILL.md nie wczytywał `MAPA-POKRYCIA.md`, choć `prawny-router-v3/references/pokrycie-dziedzinowe.md` nazywa lokalną mapę jedynym bieżącym źródłem statusu pokrycia — dodana sekcja „Mapa pokrycia treściowego” z `view`, wzorem DR-02…DR-06 i DR-16. Treść prawa bez zmian. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, AUDYT-2026-10-04c.

- 3.13 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 3.12 (2026-09-23, AUDYT-2026-09-23b): kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` 1.10): instrukcje weryfikacji „w ISAP” / „isap.sejm.gov.pl →” zamienione na „w ELI (RZĄD 1)” (10 plików); ISAP pozostaje adresem dla człowieka; wpisy historyczne („zweryfikowano w ISAP …”) bez zmian.
- 3.11 (2026-09-16, F-189): SKILL.md — ⛔ nieprawdziwe zdanie „ustawa o obronie Ojczyzny nie ma nowego t.j.” skorygowane: t.j. `2025/825` (RZĄD 1); wyliczenie zmian — 825 to t.j., nie nowelizacja (T27 ZASTĄPIONY_TJ).
- 3.10 (2026-09-10d, F-148a/F-135/F-141): ustawa antyterrorystyczna: 2024/1474 → 2025/194 t.j. + KROK 2C dla Dz.U. 2026 poz. 815; propagacja ZASADY 8 z ROUTING-MAP (F-148a)
- 3.9 (2026-08-26): zsynchronizowano aktualne teksty jednolite w mapie aktów
  i modułach służb specjalnych oraz informacji niejawnych.

# CHANGELOG — dr-16-pisma-strategia-dowody-orzecznictwo

- 3.12 (2026-10-04n, AUDYT-2026-10-04n): Historia zmian SKILL.md i modułów przeniesiona z plików roboczych do `references/HISTORIA-ZMIAN-PLIKOW.md` (plik historyczny, niewczytywany przez model). Treść robocza bez zmian.

- 3.11 (2026-10-04b, AUDYT-2026-10-04b): **Sieroty (F-225).** `MAPA-POKRYCIA.md` bez wywołania — dodany `view` (sekcja „Mapa pokrycia treściowego”, wzorem DR-02…DR-06). Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, AUDYT-2026-10-04b.

- 3.10 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 3.9 (2026-09-23, AUDYT-2026-09-23b): kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` 1.10): instrukcje weryfikacji „w ISAP” / „isap.sejm.gov.pl →” zamienione na „w ELI (RZĄD 1)” (5 plików); ISAP pozostaje adresem dla człowieka; wpisy historyczne („zweryfikowano w ISAP …”) bez zmian.
- 3.8 (2026-09-16, F-189): mod-narzedzie-kalkulatory — sprzeciw od orzeczenia ZUS: art. 14 ust. 2a FUS do 31.12.2026, od 1.01.2027 art. 85f ustawy o systemie ubezpieczeń społecznych (ustawa 2026/26; F-135, RZĄD 1).
- 3.7 (2026-09-16, F-189): mod-narzedzie-kalkulatory — zachowek: „od otwarcia testamentu” (nieistniejący punkt startowy) → ogłoszenie testamentu (art. 1007 § 1) albo otwarcie spadku (§ 2–4); art. 994 § 1 — precyzyjnie, kogo dotyczy granica 10 lat (F-135, RZĄD 1).
- 3.6 (2026-09-16, F-189): T28 W1 (RZĄD 1): uchylony art. 503 KPC → art. 505 § 1 z terminem z art. 480² § 2 (2 miejsca; termin sprzeciwu 2 tygodnie/miesiąc/3 miesiące zamiast „14 dni”); „art. 94 KPSW” → art. 94 § 1 KPW w zw. z art. 506 § 1 KPK (2 miejsca).
- 3.5 (2026-08-26): zsynchronizowano licznik istniejących modułów 12/12.
- 3.4 (2026-08-26): skorygowano metrykę aktu używanego w module kalkulatorów.

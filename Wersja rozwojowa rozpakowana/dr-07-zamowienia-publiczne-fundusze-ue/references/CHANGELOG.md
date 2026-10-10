# CHANGELOG — dr-07-zamowienia-publiczne-fundusze-ue

- 3.15 (2026-10-09g, AUDYT-2026-10-09g): mod-ustawa-fundusze-UE-pomoc-publiczna: ustawa wdrożeniowa — t.j. 2025/1733 jest pierwszym t.j. (było „zastępuje t.j. 2024.1655” — rozp. MON); nowelizacje po t.j. 2025/1844, 2026/912.

- 3.14 (2026-10-05l, AUDYT-2026-10-05l): mod-PZP-wykonanie-umowy-compliance: linia „Hasła spraw”. Treść prawna bez zmian.

- 3.13 (2026-10-04n, AUDYT-2026-10-04n): Historia zmian SKILL.md i modułów przeniesiona z plików roboczych do `references/HISTORIA-ZMIAN-PLIKOW.md` (plik historyczny, niewczytywany przez model). Treść robocza bez zmian.

- 3.12 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 3.11 (2026-09-23, AUDYT-2026-09-23b): kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` 1.10): instrukcje weryfikacji „w ISAP” / „isap.sejm.gov.pl →” zamienione na „w ELI (RZĄD 1)” (13 plików); ISAP pozostaje adresem dla człowieka; wpisy historyczne („zweryfikowano w ISAP …”) bez zmian.
- 3.10 (2026-09-16, F-189): mod-PZP-zamowienia-publiczne-KIO — sekcja 4 „Terminy” przebudowana z odczytu (RZĄD 1 — PZP 2026/793): ⛔ „10 dni od publikacji w BZP (gdy brak powiadomienia)” → 10 dni przy informacji przekazanej inną drogą niż elektroniczna; wpis — art. 517 ust. 2 (nie 519); dopisane art. 515 ust. 3–4, 514 ust. 2 i 528 pkt 6, 525, 509, 585 ust. 2, art. 398⁵ KPC, art. 34 KSCU; art. 544 ust. 1 zd. 2; ⛔ art. 138 — brak terminu ofert poniżej 15 dni (F-135).
- 3.9 (2026-08-27): dodano moduł uzupełniający PZP dla pozostałych luk Działów I/II/III/VIII/X; zsynchronizowano mapy/routing.

- 3.8 (2026-08-26): zarejestrowano istniejący moduł Działu IV PZP i
  zsynchronizowano licznik modułów 19/19.
- 3.7 (2026-08-26): ujednolicono metryki tekstów jednolitych w modułach
  notarialnym oraz funduszy UE.

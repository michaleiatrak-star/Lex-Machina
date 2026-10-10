# CHANGELOG — przewodnik-prawny-v2

- 2.11 (2026-10-10b, AUDYT-2026-10-10b): Katalog wyjściowy hosta zamiast stałej ścieżki /mnt/user-data.

- 2.10 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 2.9 (2026-09-23, AUDYT-2026-09-23c): Zasada 3 i procedura Q&A: E-3/E-4 przy BRAKU-AKTU w RZĘDZIE 1 (awaria, timeout, blokada).
- 2.8 (2026-09-23, AUDYT-2026-09-23b): kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` 1.10): instrukcje weryfikacji „w ISAP” / „isap.sejm.gov.pl →” zamienione na „w ELI (RZĄD 1)” (3 plików); ISAP pozostaje adresem dla człowieka; wpisy historyczne („zweryfikowano w ISAP …”) bez zmian.
- 2.7 (2026-09-16, F-189): KROK-F: przykład wyniku powoływał uchylony art. 503 KPC jako „POPRAWNY” — zastąpiony art. 505 § 1 KPC z odesłaniem do terminu z art. 480² § 2 (RZĄD 1, Dz.U. 2026 poz. 468; T28 W1-503).
- 2.6 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, kopia treści zastąpiona wywołaniem. Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.


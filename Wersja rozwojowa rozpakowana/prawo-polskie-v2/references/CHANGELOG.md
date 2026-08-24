# CHANGELOG — prawo-polskie-v2

> Lokalizacja kanoniczna historii wersji tego skilla (ZASADA 15 w
> `audyt-systemu-v4/SKILL.md`). Plik założony 2026-08-23g przy okazji naprawy
> F-123 — skill był na wersji 6.1 bez żadnego pliku historii i bez pola
> `changelog:` w YAML.
>
> ⛔ **LUKA JAWNA — wersje 1.x–6.1 NIE zostały odtworzone.** Nie ma ich w żadnym
> pliku tego skilla; jedynym śladem jest `audyt-systemu-v4/references/AUDIT-JOURNAL.md`.
> Odtwarzanie ich z pamięci byłoby zmyślaniem — dokładnie ten błąd, który w sesji
> 2026-08-20z3 (F-102) groził dopisaniem pięciu nieistniejących wpisów do
> `pisma-procesowe-v3`. Kto potrzebuje historii sprzed 6.2: `grep -n "prawo-polskie-v2"
> audyt-systemu-v4/references/AUDIT-JOURNAL.md`.

- 6.2 (2026-08-23g, sesja audytowa audyt-systemu-v4, flaga F-123): zapisana
  DECYZJA o zakresie `shared/PRAWO-HARDGATE.md` w tym skillu. Rozstrzygnięcie
  rozdzielne: `SKILL.md` — bramka NIE obowiązuje (czysta fasada routingu, nie
  twierdzi nic o treści prawa, bramka odpala się w DR-skillu, w którym przepis
  faktycznie pada); `ROUTING-MAP.md` — podlega reżimowi mapy (FAZA 3 A–D +
  ZASADA 8 + REGUŁA 3), bo nosi numery i statusy Dz.U., czyli weryfikowalne
  twierdzenia o stanie prawnym, a błędny numer propaguje się w każdą sprawę
  przechodzącą przez ten routing (klasa F-82). Dopisany wyzwalacz wygaśnięcia
  decyzji: pierwsze twierdzenie o TREŚCI prawa w którymkolwiek pliku skilla
  przywraca obowiązek bramki. Powód zapisania decyzji, a nie samego jej
  podjęcia: bez utrwalenia ten sam pomiar `grep` wracałby jako nowe zgłoszenie
  w każdym kolejnym audycie. Przy okazji: stopka przestała nieść własny numer
  wersji (niosła „5.2" przy `version: 6.1` — rozjazd o dziewięć wersji),
  zgodnie z decyzją generalną F-102(C); `version` ujęty w cudzysłów
  (profilaktyka pułapki float, F-102(B)). Pełny opis:
  `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23g.

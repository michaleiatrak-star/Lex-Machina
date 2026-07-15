# SYNC-DZU-AUTOMATYCZNY.md
## Automatyzacja wykrywania nowych/zmienionych pozycji Dz.U./M.P. (wejście do FAZY 3)

status: skrypt referencyjny gotowy do adaptacji (wymaga uruchomienia w środowisku
  developera z dostępem do api.sejm.gov.pl)
wprowadzono: 2026-07-13 (jako osobny skill `sync-dzu-automatyczny-v1`)
skonsolidowano do `audyt-systemu-v4/`: 2026-07-13f (patrz AUDIT-JOURNAL, powód:
to narzędzie WSPIERAJĄCE FAZĘ 3 tego właśnie skilla — audyt-systemu-v4 już ma
własne references/ i scripts/ na dokładnie ten rodzaj automatyzacji, więc
osobny skill-wrapper tylko duplikował ten wzorzec)
narzędzia: audyt-systemu-v4/scripts/sync_dzu_eli.py,
  audyt-systemu-v4/scripts/mock_eli_server_test.py,
  audyt-systemu-v4/scripts/bootstrap_last_sync_date.py
powiązane pliki: audyt-systemu-v4/references/FORMAT-RAPORTU-ROZNIC.md,
  audyt-systemu-v4/references/HARMONOGRAM-CRON.md

---



## Czego ten skill NIE robi (żeby nie było wątpliwości)

`audyt-systemu-v4` ma twardą zasadę: **"nigdy nie zgaduj numeru Dz.U."** — cała
dotychczasowa dyscyplina audytowa (katalogowanie DR-01…DR-16, dziesiątki
naprawionych błędnych numerów) polega na ręcznej, wielokrotnej weryfikacji przez
sesję audytową. Ten skill **nie zastępuje tej dyscypliny** i nie wprowadza
automatycznych zmian do `mapa_dzu`. Automatyzuje wyłącznie **pierwszy, najbardziej
pracochłonny krok**: wykrycie, że *w ogóle coś się zmieniło* od ostatniej
weryfikacji — żeby sesje audytowe nie musiały zaczynać od zera przy każdej
aktualizacji.

## Problem, który rozwiązuje

Obecny proces (patrz `audyt-systemu-v4/references/AUDIT-JOURNAL.md`) polega na
cyklicznych, ręcznych sesjach "dziedzina po dziedzinie" (DR-01, potem DR-02, itd.),
z ręcznym sprawdzaniem każdej pozycji w ISAP. To działa i jest rzetelne, ale nie
skaluje się liniowo z liczbą klientów/dziedzin aktywnych jednocześnie — każda
nowelizacja czeka na swoją kolej w harmonogramie sesji audytowych.

## Rozwiązanie: cykliczny "diff" zamiast pełnej ręcznej weryfikacji

1. Harmonogram (cron / GitHub Actions — patrz `references/HARMONOGRAM-CRON.md`)
   uruchamia `scripts/sync_dzu_eli.py` np. raz dziennie.
2. Skrypt pobiera z Sejm ELI API listę pozycji Dz.U./M.P. opublikowanych od daty
   ostatniego uruchomienia (przechowywanej lokalnie, np. w pliku
   `.last_sync_date`).
3. Skrypt porównuje numery aktów z nowych pozycji względem numerów aktów już
   obecnych w `mapa_dzu_*.md` (parsowanie wzorca `Dz\.U\. \d{4} poz\. \d+`,
   identycznie jak w FAZIE 3 audyt-systemu-v4, sekcja 3-PULL).
4. Wynik: raport różnic wg `references/FORMAT-RAPORTU-ROZNIC.md`, NIE modyfikacja
   mapy. Raport trafia jako wejście do najbliższej sesji `audyt-systemu-v4`
   (FAZA 3), skracając czas tej sesji z "przeszukaj wszystko" do "przejrzyj tę
   listę różnic".
5. Audytor/deweloper (człowiek + Claude w sesji audytowej) decyduje, czy dana
   nowa pozycja: (a) dotyczy aktu już skatalogowanego → nowy t.j./nowelizacja,
   wymaga ręcznej weryfikacji i aktualizacji `mapa_dzu` zgodnie z dotychczasową
   procedurą; (b) to zupełnie nowy akt → ocena, czy wchodzi w zakres któregoś
   DR-skilla; (c) nieistotne dla systemu → odnotowanie i pominięcie.

## Integracja z audyt-systemu-v4

`references/mapa_dzu_2026-07-04.md` w audyt-systemu-v4 pozostaje jedynym źródłem
prawdy używanym przez router i DR-skille. Ten skill produkuje wyłącznie
**wejściowy raport dla FAZY 3**, nie nową kopię mapy. Po sesji audytowej,
aktualizacja `mapa_dzu` przebiega dokładnie tak jak dotychczas (str_replace na
kopii, wpis do AUDIT-JOURNAL.md, aktualizacja CHECKLIST-DEDUP jeśli dotyczy).

## Co developer musi zrobić przed produkcją

1. Uruchomić `scripts/sync_dzu_eli.py` w środowisku z dostępem do
   `api.sejm.gov.pl` (sandbox audytowy tego środowiska nie ma takiego dostępu —
   skrypt nie był testowany wobec żywego API, patrz limitations w frontmatter).
2. Ustawić harmonogram wg `references/HARMONOGRAM-CRON.md`.
3. Podłączyć wyjście raportu (plik/webhook) do procesu, który uruchamia kolejną
   sesję `audyt-systemu-v4` FAZA 3 (może być tak prosto jak: raport trafia do
   kolejki zadań dla zespołu prawnego/developerskiego).
4. Po pierwszym pełnym cyklu — dodać wpis w `AUDIT-JOURNAL.md` potwierdzający,
   że automatyzacja faktycznie skróciła czas sesji audytowej (metryka do
   zebrania, nie zakładana z góry).

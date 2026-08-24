# CHANGELOG — raport-klienta-v1

- 1.4 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-127**): NAPRAWA wstawki F-115 z sesji 08-23i — blok `SELF-CHECK ANTY-FASADA` był wstawiony WEWNĄTRZ bloku ``` sekcji ARCHITEKTURA, przez co rozbijał drzewo katalogu. Blok przeniesiony pod blok HARD GATE odsyłający do `shared/PRAWO-HARDGATE.md`. Klasa błędu: REGUŁA 5 bloku HARDGATE-AUDYT (`audyt-systemu-v4/references/WARN-OTWARTE.md`) — wstawianie treści bez kontroli struktury docelowej. Kontrola po naprawie: parzystość znaczników ``` zachowana, spis nagłówków identyczny przed/po. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 1.3 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, bramka dodana (P2). Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.


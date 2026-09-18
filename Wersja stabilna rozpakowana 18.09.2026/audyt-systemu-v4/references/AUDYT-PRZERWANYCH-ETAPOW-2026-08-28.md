# Audyt przerwanych etapów — 2026-08-28

## Cel

Sprawdzenie, czy zadania rozpoczęte przed kolejnymi instrukcjami użytkownika „kontynuuj” / „przepchnij stan” zostały faktycznie dokończone, a nie tylko opisane jako wykonane.

## Reguła zaliczenia

Etap jest `ZAMKNIĘTY` wyłącznie gdy łącznie:
1. istnieje właściwa treść/moduł;
2. lokalna `MAPA-POKRYCIA.md` odpowiada temu stanowi;
3. jeżeli akt należy do F-108 — benchmark F-108 jest zsynchronizowany;
4. zmiana została zapisana na gałęzi PR #21;
5. nie pozostaje sprzeczna deklaracja runtime w centralnej mapie pokrycia.

`MAPA-AKTOW.md` i metadane wersji są kontrolowane osobno, ponieważ audyt wykazał w nich historyczny dług rejestrowy.

## Wynik etapów przerywanych

| Etap | Wynik bieżący | Dowód operacyjny |
|---|---|---|
| KPW — utworzenie modułu i późniejsza synchronizacja | ZAMKNIĘTY | dedykowany `mod-KPW-kodeks-postepowania-w-sprawach-o-wykroczenia.md`; DR-03 i F-108 = B+/COV |
| KKS — etap rozpoczęty przed checkpointem GitHub | ZAMKNIĘTY | `mod-KKS-karny-skarbowy-i-AML.md`; DR-03/DR-06 i F-108 = B+/COV |
| KPA + Kodeks pracy | ZAMKNIĘTY | `mod-KPA-current-state-COV.md`, `mod-KP-current-state-COV.md`; mapy i F-108 zsynchronizowane |
| KC | ZAMKNIĘTY | `mod-KC-current-state-COV.md`; DR-02 i F-108 = B+/COV |
| samorząd powiatowy i województwa | ZAMKNIĘTY | dedykowane moduły, DR-08 i F-108 = B+/COV |
| wojewoda + Prawo przedsiębiorców | ZAMKNIĘTY | current-state COV i F-108 = B+/COV |
| KK + KPK | ZAMKNIĘTY strukturalnie | current-state COV; DR-03 i F-108 zsynchronizowane; nie oznacza FULL |
| spółdzielnie mieszkaniowe | ZAMKNIĘTY strukturalnie | pełna mapa rozdziałów w dedykowanym module; F-108 = B+/COV |
| przeciwdziałanie narkomanii | ZAMKNIĘTY strukturalnie | current-state COV z bramką dla Dz.U. 2026 poz. 1004; DR-03 i F-108 zsynchronizowane |
| Sąd Najwyższy | ZAMKNIĘTY strukturalnie | moduł current-state bez traktowania przyszłych zmian jako obowiązujących; DR-01 i F-108 = B+/COV |
| F-108 jako całość | ZAMKNIĘTY na poziomie COV | 52/52 B+/COV; 0 pozycji B/B+ bez COV; `FULL` nieprzyznany automatycznie |
| PUSA / KKW po F-108 | ZAMKNIĘTY strukturalnie | odrębne current-state COV i zaktualizowane mapy DR-01/DR-03 |
| KRS / Rada Ministrów / mandat / partie / przewlekłość | ZAMKNIĘTY strukturalnie | odrębne current-state COV, DR-01 zsynchronizowany |
| TK — organizacja i tryb postępowania | ZAMKNIĘTY strukturalnie | odrębny `mod-TK-organizacja-postepowanie-current-state-COV.md`; DR-01 = B+/COV |
| KPC — jawny indeks całego kodeksu | ZAMKNIĘTY strukturalnie | `mod-KPC-current-state-COV.md`; rozproszona rodzina modułów spięta jednym indeksem COV |

## Dług ujawniony przez audyt — stan końcowy F-138

### A. `MAPA-AKTOW.md` — ZAMKNIĘTE

Sweep DR-01–DR-16 został zakończony. Mapy runtime przechowują bieżące przypisania akt/zakres → moduł oraz fresh/temporal gate, bez historycznych statusów sesji i bez przyszłego stanu w wierszach runtime.

Deterministyczny re-run na aktualnym drzewie Git potwierdził dla wszystkich 16 DR brak fizycznych modułów `modules/mod-*.md` pominiętych w lokalnym `MAPA-AKTOW.md`. W toku cross-checku naprawiono również stale copies po migracjach/rename oraz brakujące rejestracje ujawnione dopiero przez pełny inwentarz.

### B. `SKILL.md` / `CHANGELOG.md` — ZAMKNIĘTE

Metadane są zsynchronizowane:
- `prawny-router-v3`: 3.31 w `SKILL.md` i kanonicznym `references/CHANGELOG.md`;
- `audyt-systemu-v4`: 6.28 w `SKILL.md` i kanonicznym `references/CHANGELOG.md`.

Checklisty modułów i liczniki DR zostały zsynchronizowane z rzeczywistym drzewem plików w toku realnego testu czterech rejestrów.

## Korekta rejestru otwartych flag

F-108 pozostaje zamknięta na 52/52 B+/COV. F-138 została zamknięta po zakończeniu migracji current-state, synchronizacji wersji i uzyskaniu rzeczywistego zielonego przebiegu CI; nie figuruje już w `WARN-OTWARTE.md`.

## Testy — rzeczywisty przebieg CI

GitHub Actions workflow `F-138 structural audit` został uruchomiony na rzeczywistym checkoutcie PR #23. Run #32 (run id `33165703241`, job `structural-audit`) zakończył się `success`.

Wyniki bramek:
- `check_rejestracja_modulow.py`: **0 z 16 dziedzin z rozbieżnościami**;
- `check_coverage_coherence.py`: **OK — 16 map bieżących, routing i moduły spójne, brak warstwy baseline/delta w runtime**;
- `test_moved_to_shared.py` (T9): **OK — brak nierozwiązanych przeniesień i stale source copies**;
- `ci_check_shared.py`: **0 zerwanych odwołań**, wynik końcowy OK.

`ci_check_shared.py` raportuje dodatkowo 20 grup duplikatów bajtowych jako ostrzeżenia. Nie są one blockerem strukturalnym F-138 i nie są w tym audycie automatycznie klasyfikowane jako błędy; wymagają osobnej decyzji deduplikacyjnej, jeżeli mają być redukowane.

## Zasada dalszej pracy

Każdy kolejny batch ma być wykonywany w kolejności:

`moduł/treść → MAPA-POKRYCIA → MAPA-AKTOW (jeżeli dotyczy) → benchmark/rejestr centralny → test spójności → PR checkpoint`.

Nie uznawać etapu za zakończony wyłącznie na podstawie utworzenia modułu.
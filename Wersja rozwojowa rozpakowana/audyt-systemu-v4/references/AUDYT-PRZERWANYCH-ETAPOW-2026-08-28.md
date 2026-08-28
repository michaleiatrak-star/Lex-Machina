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

## Dług ujawniony przez audyt

### A. `MAPA-AKTOW.md` — W TOKU

Część lokalnych map nadal przechowywała historię sesji (`VER`, `ZAMKNIĘTE`, `NAPRAWIONE`, dawne alerty i narrację audytową) mimo decyzji, że mapy runtime mają zawierać tylko stan aktualny.

Oczyszczone do current-state-only:
- DR-01 — dodatkowo routing podpięty do nowych odrębnych modułów COV (TK, PUSA, KRS, Rada Ministrów, mandat, partie, przewlekłość);
- DR-07;
- DR-08;
- DR-12;
- DR-14.

Pozostałe mapy są przeglądane selektywnie. Największy dług narracyjny potwierdzono obecnie w DR-03, DR-04, DR-05, DR-06 i DR-10. Nie oznacza to luki treściowej tych dziedzin — chodzi o mieszanie historii z runtime.

### B. `SKILL.md` / `CHANGELOG.md` — W TOKU

Kontrola potwierdziła realny rozjazd metadanych:
- `audyt-systemu-v4/SKILL.md`: YAML `version: 6.27`, natomiast stopka nadal wskazuje 6.26;
- `audyt-systemu-v4/references/CHANGELOG.md`: ostatni wpis 6.27 opisuje jeszcze wcześniejszy model pokrycia;
- `prawny-router-v3/SKILL.md`: `version: 3.30`;
- `prawny-router-v3/references/CHANGELOG.md`: ostatni wpis 3.30, sprzed przejścia map runtime na current-state-only.

Do zamknięcia pozostaje spójny bump wersji obu skilli wraz z ich changelogami, wykonany po zakończeniu batcha map, aby nie generować wielu pustych wersji pośrednich.

## Korekta rejestru otwartych flag

F-108 została usunięta z `WARN-OTWARTE.md`, ponieważ jej kryterium strukturalne zostało spełnione: 52/52 aktów ma B+/COV. Pozostała praca nie jest kontynuacją F-108.

Utworzono F-138 jako odrębną flagę techniczną końcowej migracji current-state: cleanup pozostałych `MAPA-AKTOW.md`, końcowy bump wersji audytora/routera i realny test spójności. Dzięki temu rejestr otwartych prac nie miesza zamkniętego benchmarku prawnego z długiem technicznym.

## Testy

Dla sprawdzonego headu GitHub nie zwrócił uruchomionych workflowów Actions. Nie raportować CI jako `PASS`. Próba pobrania repozytorium do lokalnego środowiska wykonawczego nie powiodła się z powodu braku rozwiązywania hosta GitHub w tym środowisku; nie traktować tego jako wyniku testu repozytorium.

## Zasada dalszej pracy

Każdy kolejny batch ma być wykonywany w kolejności:

`moduł/treść → MAPA-POKRYCIA → MAPA-AKTOW (jeżeli dotyczy) → benchmark/rejestr centralny → test spójności → PR checkpoint`.

Nie uznawać etapu za zakończony wyłącznie na podstawie utworzenia modułu.
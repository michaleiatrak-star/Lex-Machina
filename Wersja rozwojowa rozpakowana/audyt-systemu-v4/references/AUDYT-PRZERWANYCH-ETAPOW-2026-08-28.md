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

## Dług ujawniony przez audyt

### A. `MAPA-AKTOW.md` — NIE BYŁO W PEŁNI DOMKNIĘTE

Część lokalnych map nadal przechowywała historię sesji (`VER`, `ZAMKNIĘTE`, `NAPRAWIONE`, dawne alerty i narrację audytową) mimo wcześniejszej decyzji, że mapy runtime mają zawierać tylko stan aktualny.

Status po rozpoczęciu naprawy:
- DR-08: **oczyszczona do current-state only** w tej sesji;
- pozostałe istniejące `MAPA-AKTOW.md`: wymagają przeglądu i selektywnego oczyszczenia, jeżeli nadal zawierają historię.

### B. `SKILL.md` / `CHANGELOG.md` — NIE BYŁO LITERALNIE DOMKNIĘTE

Treść systemu została zmieniona, ale po dużej serii prac nie wykonano końcowego bumpu/rejestracji wersji dla `audyt-systemu-v4` i `prawny-router-v3`. To jest dług metadanych, nie luka merytoryczna prawa.

Do zamknięcia:
- `audyt-systemu-v4/SKILL.md` + jego `references/CHANGELOG.md`;
- `prawny-router-v3/SKILL.md` + jego changelog;
- rejestracja modelu current-state maps, F-108 52/52 COV i usunięcia baseline/delta.

## Zasada dalszej pracy

Każdy kolejny batch ma być wykonywany w kolejności:

`moduł/treść → MAPA-POKRYCIA → MAPA-AKTOW (jeżeli dotyczy) → benchmark/rejestr centralny → test spójności → PR checkpoint`.

Nie uznawać etapu za zakończony wyłącznie na podstawie utworzenia modułu.
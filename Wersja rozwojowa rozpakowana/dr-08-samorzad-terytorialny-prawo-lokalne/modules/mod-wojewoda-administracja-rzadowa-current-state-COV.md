---
module: wojewoda-administracja-rzadowa-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+ / COV — aktualna struktura ustawy + routing ustrojowy, kontrolny i prawa miejscowego"
source_policy: "RZĄD 1 only"
---

# Wojewoda i administracja rządowa w województwie — current-state COV

## 1. Źródło urzędowe

Ustawa z 23 stycznia 2009 r. o wojewodzie i administracji rządowej w województwie.
Aktualny tekst jednolity: **Dz.U. 2025 poz. 428**.
Obwieszczenie Marszałka Sejmu z 24.03.2025, publikacja 02.04.2025, stan prawny tekstu jednolitego 12.03.2025.

RZĄD 1:
- https://eli.gov.pl/eli/DU/2025/428/ogl
- https://eli.gov.pl/api/acts/DU/2025/428/text/T/D20250428L.pdf

Fresh gate: przed użyciem konkretnego przepisu sprawdź w ELI późniejsze akty zmieniające i tekst ujednolicony.

## 2. Mapa struktury

| Rozdział | Zakres operacyjny |
|---|---|
| 1 | Przepisy ogólne — zakres ustawy i podmioty wykonujące administrację rządową w województwie |
| 2 | Wojewoda jako przedstawiciel Rady Ministrów |
| 3 | Kontrola prowadzona przez wojewodę |
| 4 | Rządowa administracja zespolona w województwie |
| 5 | Niezespolona administracja rządowa |
| 6 | Akty prawa miejscowego stanowione przez wojewodę oraz organy niezespolonej administracji rządowej |
| 7 | Przepisy zmieniające |
| 8 | Przepisy przejściowe i końcowe |

## 3. Routing podmiotowy

Art. 1 określa trzy osie ustawy: zakres działania i funkcjonowania wojewody, tryb jego powoływania/odwoływania oraz organizację administracji zespolonej i niezespolonej.

Art. 2 wymaga ustalenia, kto w konkretnej sprawie wykonuje zadanie administracji rządowej w województwie. Nie utożsamiaj automatycznie każdego zadania administracji rządowej z kompetencją wojewody; kompetencja może należeć także do organu administracji zespolonej, niezespolonej, JST/starosty albo innego podmiotu na podstawie przepisu szczególnego.

## 4. Wojewoda a samorząd województwa

Wojewoda jest organem administracji rządowej. Marszałek, zarząd i sejmik należą do samorządu województwa. Przy każdym routingu DR-08 najpierw rozdziel te dwa porządki ustrojowe.

Dla kompetencji samorządu użyj `mod-ustawa-samorzad-wojewodztwa.md`; dla wojewody i terenowej administracji rządowej — niniejszego modułu.

## 5. Kontrola

Rozdział 3 stanowi podstawę kontroli prowadzonej przez wojewodę. Nie zastępuje ustawy o kontroli w administracji rządowej ani szczególnych ustaw inspekcyjnych. Przy kontroli uruchom równolegle `mod-kontrola-administracji-inspekcje.md` i lex specialis właściwego organu.

## 6. Administracja zespolona i niezespolona

Rozdziały 4–5 wymagają rozpoznania modelu organizacyjnego właściwego organu. Nie przenoś kompetencji wojewody na kierownika służby, inspekcji lub straży bez podstawy prawnej i odwrotnie.

## 7. Akty prawa miejscowego

Rozdział 6 jest odrębną bramką dla aktów prawa miejscowego wojewody i organów niezespolonej administracji rządowej. Sprawdź łącznie:
1. delegację ustawową;
2. właściwy organ;
3. granice delegacji;
4. tryb ogłoszenia;
5. wejście w życie;
6. dostępne środki kontroli sądowej.

Nie mieszaj tej podstawy z kompetencjami prawotwórczymi organów JST.

## 8. Intertemporalność

Rozdziały 7–8 mają znaczenie dla spraw dotyczących zmian ustrojowych i przepisów przejściowych. Dla bieżącej kompetencji nie wyprowadzaj normy z przepisu historycznego bez potwierdzenia jego aktualnego zastosowania.

## 9. Quality gate

- [ ] potwierdzono Dz.U. 2025 poz. 428 i późniejsze zmiany w ELI;
- [ ] odróżniono wojewodę od organów samorządu województwa;
- [ ] wskazano konkretny podmiot z art. 2 / lex specialis;
- [ ] ustalono model zespolony albo niezespolony;
- [ ] dla kontroli sprawdzono ustawę kontrolną i ustawę sektorową;
- [ ] dla prawa miejscowego sprawdzono delegację i publikację;
- [ ] przy stanie historycznym wykonano gate intertemporalny.

## 10. F-108

F-108/45: **B+ / COV**. Aktualna struktura całej ustawy jest jawnie zmapowana; status nie oznacza `FULL` artykuł-po-artykule.
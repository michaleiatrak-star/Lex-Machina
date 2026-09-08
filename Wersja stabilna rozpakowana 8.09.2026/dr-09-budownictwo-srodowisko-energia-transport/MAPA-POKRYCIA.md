# DR-09 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa zawiera wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze oceny pozostają poza mapą runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, ale niepełne artykuł-po-artykule;
- 🔴 — brak realnej treści;
- ⚪ — zakres techniczny/przejściowy.

## Prawo budowlane

**Baza operacyjna:** Dz.U. 2026 poz. 524 t.j.; fresh gate przed cytowaniem konkretnej jednostki.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| przepisy ogólne | 🟢/🟡 | `mod-PrBud-prawo-budowlane.md` |
| samodzielne funkcje techniczne | 🟡 B+ | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |
| uczestnicy procesu budowlanego | 🟢/🟡 | moduł główny + uzupełnienie |
| pozwolenie / zgłoszenie / odstępstwa | 🟢 | `mod-PrBud-prawo-budowlane.md` |
| rozpoczęcie i prowadzenie robót | 🟡 B+ | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |
| dziennik budowy | 🟡 B+ | jw. |
| samowola budowlana | 🟢 | moduł główny / moduły tematyczne |
| zakończenie budowy / użytkowanie | 🟢/🟡 | moduł główny + `mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia.md` |
| książka obiektu budowlanego | 🟡 B+ | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |
| utrzymanie obiektów / zmiana sposobu użytkowania | 🟢/🟡 | moduł tematyczny |
| katastrofa budowlana | 🟡 B+ | uzupełnienie pokrycia |
| e-Budownictwo | 🟡 B+ | jw. |
| organy administracji architektoniczno-budowlanej i nadzoru | 🟡 B+ | jw. |
| przepisy karne | 🟡 | moduł główny + routing DR-03 |
| odpowiedzialność zawodowa | 🟡 B+ | uzupełnienie pokrycia |

## Gospodarka nieruchomościami

**Baza operacyjna:** ustawa o gospodarce nieruchomościami — Dz.U. 2026 poz. 399 t.j.; ELI, stan prawny tekstu jednolitego 10.03.2026.

| Dział | Status bieżący | Dowód pokrycia |
|---|---|---|
| I — przepisy ogólne | 🟢 B+ / COV | `mod-UGN-gospodarka-nieruchomosciami.md` |
| II — nieruchomości Skarbu Państwa i JST | 🟢 B+ / COV | jw. |
| III — podziały, pierwokup, wywłaszczenie, ograniczenia, zwrot, opłaty | 🟢 B+ / COV | jw. + moduły wywłaszczeniowe |
| IV — wycena nieruchomości | 🟢 B+ / COV | jw. |
| V — działalność zawodowa | 🟢/🟡 B+ | jw. |
| przepisy szczególne/przejściowe | temporalne | fresh gate |

## Środowisko / energia / transport

| Obszar | Status bieżący |
|---|---|
| Prawo ochrony środowiska | 🟢/🟡; `mod-POS-prawo-ochrony-srodowiska.md` i moduły sektorowe |
| szkody w środowisku | 🟢/🟡; dedykowany routing DR-09 |
| energia | 🟢/🟡; moduły sektorowe, fresh gate dla taryf i regulacji |
| transport / Prawo lotnicze | 🟢/🟡; bieżące metryki w MAPA-AKTOW |
| zabytki / inwestycje | routing krzyżowy DR-08/DR-09 według problemu |

## Aktywne luki

1. Prawo budowlane: uczestnicy procesu, zakończenie budowy i przepisy karne wymagają dalszego pogłębienia.
2. UGN ma bieżące B+/COV głównych działów, ale nie status `FULL` artykuł-po-artykule.
3. Środowisko, energia i transport mają moduły sektorowe, lecz kompletność ocenia się per akt.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP, a prawo UE — EUR-Lex.

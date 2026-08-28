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
| utrzymanie obiektów / zmiana sposobu użytkowania | 🟢/🟡 | `mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia.md` |
| katastrofa budowlana | 🟡 B+ | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |
| e-Budownictwo | 🟡 B+ | jw. |
| organy administracji architektoniczno-budowlanej i nadzoru | 🟡 B+ | jw. |
| przepisy karne | 🟡 | moduł główny + routing DR-03 |
| odpowiedzialność zawodowa | 🟡 B+ | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |

## Środowisko / energia / transport

| Obszar | Status bieżący |
|---|---|
| Prawo ochrony środowiska | 🟢/🟡; `mod-POS-prawo-ochrony-srodowiska.md` i moduły sektorowe |
| szkody w środowisku | 🟢/🟡; dedykowany routing DR-09 |
| energia | 🟢/🟡; moduły sektorowe, fresh gate dla taryf i regulacji |
| transport / Prawo lotnicze | 🟢/🟡; bieżące metryki w MAPA-AKTOW |
| zabytki / inwestycje | routing krzyżowy DR-08/DR-09 według problemu |

## Aktywne luki

1. Prawa i obowiązki uczestników, zakończenie budowy i przepisy karne wymagają dalszego pogłębienia.
2. Zakresy B+ są operacyjne, ale nie mają statusu `FULL`.
3. Środowisko, energia i transport mają moduły sektorowe, lecz kompletność ocenia się per akt, nie dla całego DR jednym statusem.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP, a prawo UE — EUR-Lex.

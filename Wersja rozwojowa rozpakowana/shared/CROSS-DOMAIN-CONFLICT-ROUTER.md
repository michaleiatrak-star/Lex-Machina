# CROSS-DOMAIN-CONFLICT-ROUTER

## Zasada główna

Sprawa niewskazana w routerze albo wielowątkowa trafia do pakietu jurysdykcji (`JUR:mapa-dziedzin`) jako
modułu nadrzędnego dziedzin. Router nie rozstrzyga merytorycznie, tylko deleguje.

## Tryby wielowątkowe

Przy kilku dziedzinach naraz wybierz **procedurę dominującą**: tę, w której biegnie termin albo która
rozstrzyga o żądaniu; pozostałe dziedziny są modułami pomocniczymi. Układy typowe dla jurysdykcji,
z procedurą dominującą i modułami pomocniczymi: `JUR:konflikt-dziedzin`.

## Wymóg końcowy

Jeżeli użytkownik nie poda dziedziny, ładuj:

- moduł nadrzędny dziedzin jurysdykcji (`JUR:mapa-dziedzin`),
- `shared/LEGAL-KNOWLEDGE-GRAPH.md`,
- `shared/POLISH-LAW-MAX-COVERAGE-STANDARD.md`,
- odpowiednie moduły dziedzinowe.

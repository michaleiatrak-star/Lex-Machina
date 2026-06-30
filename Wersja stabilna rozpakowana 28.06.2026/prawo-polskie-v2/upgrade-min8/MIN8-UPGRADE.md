# MIN8 UPGRADE — warstwa dziedzinowa, nie główny router

## Cel modernizacji
Moduł działa jako mapa prawa polskiego i klasyfikator dziedzinowy. Nie dubluje `prawny-router-v3`.

## Zasada pierwszeństwa
- `prawny-router-v3` decyduje o ścieżce wykonania.
- `prawo-polskie-v2-min8` klasyfikuje dziedzinę, typ sprawy, reżim prawny i możliwe podstawy.

## Obowiązkowy wynik
1. dziedzina prawa,
2. reżim prawny,
3. potencjalne podstawy prawne,
4. właściwy moduł wykonawczy,
5. elementy wymagające weryfikacji,
6. ryzyka błędnej kwalifikacji.

## Antyduplikacja
Jeżeli zadanie dotyczy pisma, dowodów, orzeczeń albo chronologii, moduł nie wykonuje pełnej analizy, tylko przekazuje do właściwego skilla.

# LEGAL-MATRIX-FIRST-GATE

## Cel
Ten moduł wymusza zasadę: `matrix first, module second`.

## Reguła główna
Jeżeli istnieje matryca właściwa dla sprawy, `prawo-polskie-v2` i `prawny-router-v3` muszą najpierw uruchomić matrycę, a dopiero potem moduł dziedzinowy.

## Kiedy matryca jest obowiązkowa
Matryca jest obowiązkowa, gdy sprawa dotyczy:
- aktu lokalnego,
- aktu prawa miejscowego,
- uchwały JST,
- zarządzenia organu,
- statutu,
- regulaminu,
- aktu wewnętrznego,
- jednostki z własnym reżimem prawnym,
- zawodu zaufania publicznego,
- samorządu zawodowego,
- służby,
- organu regulacyjnego,
- jednostki podległej,
- aktu wojewódzkiego, powiatowego lub gminnego,
- decyzji albo aktu nadzorczego wojewody/RIO,
- aktu uczelni, szpitala, szkoły, spółdzielni, wspólnoty, izby lub regulatora.

## Kolejność
1. `POLISH-LAW-MAIN-MATRIX-INDEX.md`
2. właściwa matryca szczegółowa;
3. `HIERARCHICAL-COVERAGE-GATE.md`;
4. `SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md`;
5. moduł dziedzinowy;
6. quality gate;
7. raport braków źródłowych.

## Zakaz
Nie wolno przejść bezpośrednio do modułu dziedzinowego, jeżeli matryca istnieje albo powinna istnieć.

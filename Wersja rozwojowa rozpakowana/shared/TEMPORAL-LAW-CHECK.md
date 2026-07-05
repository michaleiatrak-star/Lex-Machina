# TEMPORAL-LAW-CHECK — stan prawny na dzień zdarzenia

Stan: 2026-05-28.

## Cel

Oddziela stan prawny dzisiejszy od stanu prawnego właściwego dla zdarzenia, decyzji, czynności procesowej albo okresu zatrudnienia.

## Obowiązkowe pytania

1. Kiedy nastąpiło zdarzenie prawne?
2. Kiedy doręczono decyzję/pismo/wyrok?
3. Kiedy upływa termin?
4. Czy przepis obowiązywał w tej dacie?
5. Czy nowelizacja miała przepisy przejściowe?
6. Czy sprawa dotyczy czynności sprzed wejścia w życie nowego prawa?
7. Czy sprawa ma skutek ciągły?

## Reguła

Jeżeli data zdarzenia jest inna niż data analizy, zawsze rozdziel:

- `prawo obowiązujące w dacie zdarzenia`,
- `prawo obowiązujące w dacie wniesienia pisma`,
- `prawo obowiązujące w dacie orzekania`,
- `przepisy przejściowe`.

## Wpływ na pisma

W każdym piśmie procesowym zawierającym podstawę prawną dodaj wewnętrzną kontrolę:

```text
Czy przepis obowiązywał w dacie zdarzenia? TAK/NIE/NIEUSTALONE
Czy istnieją przepisy przejściowe? TAK/NIE/NIEUSTALONE
Czy cytat pochodzi z ISAP z dnia bieżącej kontroli? TAK/NIE
```

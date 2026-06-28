
# CROSS-DOMAIN-CONFLICT-ROUTER

## Zasada główna

Każda sprawa niewskazana w routerze albo wielowątkowa z zakresu prawa polskiego ma trafić do `prawo-polskie-v2` jako modułu nadrzędnego. Router nie rozstrzyga merytorycznie, tylko deleguje.

## Tryby wielowątkowe

| Układ sprawy | Procedura dominująca | Moduły pomocnicze |
|---|---|---|
| praca + karne + RODO | prawo pracy lub karne zależnie od żądania | RODO, dowody, dobra osobiste |
| administracyjne + karne | procedura, w której biegnie termin | karne, KPA/PPSA, dowody |
| służby + dyscyplinarne + cywilne | dyscyplinarne/służbowe | cywilne, dobra osobiste, dowody |
| Policja + czynności operacyjne + odszkodowanie | karne/administracyjne | cywilne, Policja, RODO |
| sąd + sekretariat + przewlekłość | procedura sądowa | PUSP, regulamin, przewlekłość |
| cyber + dowody cyfrowe + karne | karne albo cyber-regulacyjne | RODO, KSC, komunikacja elektroniczna |
| UE/ETPC + sprawa krajowa | procedura krajowa | TSUE/ETPC, konstytucyjne |

## Wymóg końcowy

Jeżeli użytkownik nie poda dziedziny, ale opis dotyczy prawa polskiego, ładuj:

- `prawo-polskie-v2/SKILL.md`,
- `shared/LEGAL-KNOWLEDGE-GRAPH.md`,
- `shared/POLISH-LAW-MAX-COVERAGE-STANDARD.md`,
- odpowiednie moduły dziedzinowe.

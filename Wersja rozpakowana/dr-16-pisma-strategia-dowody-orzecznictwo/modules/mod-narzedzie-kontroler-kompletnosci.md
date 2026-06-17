# mod-BI — Kontroler kompletności prawa polskiego

**Status:** moduł nadrzędny dla `prawo-polskie-v2`.

## Cel
Moduł wymusza, aby każda odpowiedź z zakresu prawa polskiego była prowadzona według standardu modułów wzorcowych: prawo pracy i prawo karne.

## Zasada nadrzędna
Jeżeli użytkownik pyta o prawo polskie, najpierw ustal:

```text
1. dziedzinę prawa,
2. tryb postępowania,
3. organ albo sąd,
4. termin,
5. status strony,
6. akt prawny i jego aktualność w ISAP,
7. stan prawny na dzień zdarzenia,
8. stan prawny na dzień odpowiedzi/orzekania,
9. pismo albo czynność, która jest procesowo skuteczna,
10. ryzyka klienta i przeciwnika/organu.
```

## Importy obowiązkowe

```text
shared/MODULE-STANDARD-POLISH-LAW.md
shared/POLISH-LAW-COMPLETENESS-MATRIX.md
shared/LEGAL-REGISTRY.md
shared/LEGAL-LIFECYCLE-MANAGEMENT.md
shared/TEMPORAL-LAW-CHECK.md
shared/ISAP-AUDIT-PROTOCOL.md
shared/ISAP-METRYKI-AKTOW.md
shared/FORMAL-CHECK.md
shared/WARUNKI-SKUTECZNOSCI.md
shared/DOWODY-METODOLOGIA.md
shared/RISK-ASSESSMENT.md
shared/QUALITY-CHECK.md
```

## Decyzja o uruchomieniu modułów

| Typ sprawy | Moduł podstawowy | Moduły wspierające |
|---|---|---|
| praca / ZUS / mobbing | `mod-A`, `mod-B`, `mod-H` | dowody, pisma, orzeczenia |
| karne / wykroczenia / stalking / cyber | `mod-N`, `mod-I`, `mod-J`, `mod-T` | przesłuchanie, dowody |
| cywilne / rodzinne / spadkowe | `mod-C`, `mod-D`, `mod-E` | pisma, dowody, terminy |
| gospodarcze / KSH / restrukturyzacja | `mod-L`, `mod-AJ` | egzekucja, podatki, KKS |
| administracyjne / WSA / NSA | `mod-G` | PPSA, formal-check, temporal |
| podatkowe / KAS / egzekucja admin. | `mod-AR`, `mod-AT`, `mod-AS` | KKS, WSA, dowody |
| regulacyjne | `mod-AU`, `mod-BC`, `mod-AK`, `mod-AF` | compliance, UE |
| UODO / RODO / cyber | `mod-BA`, `mod-P`, `mod-BG` | dowody techniczne |
| cudzoziemcy / pomoc społeczna | `mod-AX`, `mod-AY` | administracyjne, WSA |
| dyscyplinarne | `mod-AZ`, `mod-BF` | dowody, orzeczenia, etyka |
| UE/transgraniczne/arbitraż | `mod-BD`, `mod-BE`, `mod-AL` | prawo właściwe, egzekucja |

## Finalny quality gate
Nie kończ analizy prawa polskiego bez odpowiedzi na pytania:

```text
□ Czy właściwy moduł ma poziom workflow, a nie opisu?
□ Czy ustalono właściwy tryb?
□ Czy podano decyzję procesową: co składać, gdzie, kiedy i z jakimi dowodami?
□ Czy wskazano najsilniejszy argument przeciwnika/organu?
□ Czy wskazano słaby punkt klienta?
□ Czy przepisy i Dz.U. są oznaczone jako sprawdzone w ISAP albo wymagające kontroli?
□ Czy nie pomieszano procedur: KPC/KPK/KPA/Ordynacja/PPSA/egzekucja administracyjna?
```

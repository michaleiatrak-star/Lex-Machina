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
| praca / ZUS / mobbing | DR-04: `mod-KP-prawo-pracy.md`, `mod-SUS-ZUS-ubezpieczenia-spoleczne.md`, `mod-KP-mobbing-dyskryminacja.md` | dowody, pisma, orzeczenia |
| karne / wykroczenia / stalking / cyber | DR-03: `mod-KK-KPK-framework-karne.md`, `mod-KW-kodeks-wykroczen.md`, `mod-KK-art190a-stalking.md`, `mod-KK-art267-269c-cyberprzestepstwa.md` | przesłuchanie, dowody |
| cywilne / rodzinne / spadkowe | DR-02: `mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md`, `mod-KRO-rodzinne.md`, `mod-KC-spadki.md` | pisma, dowody, terminy |
| gospodarcze / KSH / restrukturyzacja | DR-02: `mod-KSH-spolki-handlowe.md`, `mod-PrUpad-upadlosc-restrukturyzacja.md` + właściwy `mod-PrRestr-*` | egzekucja, podatki, KKS |
| administracyjne / WSA / NSA | DR-05: `mod-KPA-postepowanie-administracyjne.md` + właściwy `mod-PPSA-*` | PPSA, formal-check, temporal |
| podatkowe / KAS / egzekucja admin. | DR-06: `mod-OP-ordynacja-podatkowa.md`, `mod-KAS-kontrola-celno-skarbowa.md`; egzekucja administracyjna → DR-05 `mod-UPEA-egzekucja-administracyjna.md` | KKS, WSA, dowody |
| regulacyjne | regulatorzy → DR-12 `mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF.md`; energia → DR-09 `mod-PrEnergetyczne-URE-OZE.md`; zamówienia → DR-07 `mod-PZP-zamowienia-publiczne-KIO.md`; konkurencja → DR-02 `mod-ustawa-UOKIK-antymonopolowe.md` | compliance, UE |
| UODO / RODO / cyber | DR-11: `mod-UODO-postepowanie-ochrona-danych.md`, `mod-RODO-GDPR-2016-679.md`, `mod-KSC-NIS2-cyberbezpieczenstwo-telekom.md` | dowody techniczne |
| cudzoziemcy / pomoc społeczna | cudzoziemcy → DR-05 `mod-ustawa-cudzoziemcy.md`; pomoc społeczna → DR-04 `mod-ustawa-pomoc-spoleczna.md` | administracyjne, WSA |
| dyscyplinarne | zawody → DR-12 `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md`; służby → właściwy moduł konkretnej służby w DR-13 | dowody, orzeczenia, etyka |
| UE/transgraniczne/arbitraż | DR-14: `mod-TFUE-TUE-prawo-pierwotne-UE.md`, `mod-PMPP-prawo-prywatne-miedzynarodowe.md`, `mod-KPC-egzekucja-transgraniczna-UE.md`; arbitraż → DR-12 `mod-KPC-arbitraz-mediacja-ADR.md` | prawo właściwe, egzekucja |

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

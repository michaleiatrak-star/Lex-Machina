# mod-USP-ustroj-sadow-powszechnych

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — Prawo o ustroju sądów powszechnych, tekst jednolity Dz.U. 2024 poz. 334, z późniejszymi zmianami.  
**Istotna zmiana obowiązująca:** Dz.U. 2026 poz. 370 — ustawa z 27.02.2026 r., obowiązująca po 14 dniach od ogłoszenia 19.03.2026; dotyczy m.in. stanowisk asystenckich i przepisów powiązanych.

## Zakres

Moduł obejmuje wyłącznie ustrój sądów powszechnych: organizację sądów, organy sądów, samorząd sędziowski, nadzór administracyjny, status sędziów i asesorów, odpowiedzialność dyscyplinarną, referendarzy, kuratorów, asystentów, urzędników, mediatorów i ławników oraz finansowanie sądów.

Nie zastępuje KPC, KPK ani PPSA — właściwa procedura procesowa jest pobierana z odpowiedniego DR.

## Mapa aktu

| Dział / zakres | Status operacyjny |
|---|---|
| Dział I — sądy powszechne: przepisy ogólne, organizacja, organy, samorząd sędziowski, nadzór, skargi i wnioski, czynności sądów | 🟢 B+ / COV |
| Dział II — sędziowie i asesorzy: powołanie, status, prawa i obowiązki, asesorzy, odpowiedzialność dyscyplinarna | 🟢 B+ / COV |
| Dział III | uchylony — nie traktuj jako aktywnego zakresu |
| Dział IV — referendarze, kuratorzy, pracownicy, mediatorzy, ławnicy i organy pomocnicze | 🟢 B+ / COV |
| Dział IVa — dane, telekomunikacja, poczta, Internet i informatyzacja sądownictwa | 🟡 B |
| Dział V — finansowanie działalności sądów powszechnych | 🟡 B |
| Dział VI — zmiany, przepisy przejściowe i końcowe | kontrola temporalna per sprawa |

## Kluczowe reguły wejścia

1. Najpierw ustal, czy pytanie dotyczy **ustroju**, czy konkretnego postępowania. PUSP nie jest podstawą do rekonstruowania terminów apelacji, zażaleń ani innych środków procesowych.
2. Ustal szczebel sądu: rejonowy, okręgowy, apelacyjny. Zakres właściwości rzeczowej/procesowej sprawdzaj w odpowiednim kodeksie i przepisach wykonawczych.
3. Przy statusie sędziego/asesora rozdziel: powołanie, miejsce służbowe, prawa i obowiązki, delegowanie, odpowiedzialność dyscyplinarną i administracyjny nadzór nad sądem.
4. Nadzór administracyjny nie może być utożsamiany z ingerencją w treść orzekania.
5. Przy asystentach sędziego stosuj aktualne brzmienie po Dz.U. 2026 poz. 370; ustawa wprowadziła m.in. kategorie młodszego asystenta, asystenta i starszego asystenta sędziego oraz zmiany powiązane.
6. Dla organizacji konkretnego sądu kontroluj aktualne rozporządzenia o siedzibach, obszarach właściwości i zakresach rozpoznawanych spraw.

## Routing praktyczny

| Problem | Połącz z |
|---|---|
| sprawa cywilna / gospodarcza | DR-02 / KPC |
| sprawa karna / wykroczeniowa | DR-03 / KPK albo KPW |
| sprawa administracyjna | DR-05 / PPSA |
| zawód sędziego / odpowiedzialność dyscyplinarna | DR-12 |
| KRS / konstytucyjny status sądów | DR-01 moduły KRS/Konstytucja |
| Sąd Najwyższy | dedykowany moduł ustawy o SN |

## Quality gate

```text
□ właściwy sąd i szczebel ustalone
□ odróżniono ustrój od procedury
□ sprawdzono aktualny tekst PUSP i późniejsze nowelizacje
□ przy asystentach uwzględniono Dz.U. 2026 poz. 370
□ przy właściwości terytorialnej sprawdzono aktualne akty wykonawcze
□ przy odpowiedzialności dyscyplinarnej ustalono właściwy rozdział i stan temporalny
```

## Fresh gate

Przed powołaniem konkretnego paragrafu lub jednostki PUSP pobierz aktualny tekst ujednolicony z ELI/ISAP i sprawdź nowelizacje po Dz.U. 2024 poz. 334. Przy aktach wykonawczych sprawdzaj ich aktualny status oddzielnie.

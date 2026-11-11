# MOD-DOPUSZCZALNOSC-GATE — dopuszczalność przed meritum (bramka FATAL)

> Wersja: 1.0.0 | Typ: bramka jakości | shared/
> Źródło metody: LEGAL GAUNTLET UNIVERSAL v3, II.7 GATE 3 (PROCEDURE) i VI.4; testy akceptacyjne T07, T09, T10, T11, T20, T25.
> Wywoływany z: pisma-procesowe-v3 (W1.1, przed tezą centralną) i recenzent-niezalezny (punkt 7).
> Parametry krajowe (środki, terminy, wymogi) wyłącznie z kluczy jurysdykcji i z ELI: `JUR:tryby-procesowe`,
> `JUR:terminy-procesowe`, `JUR:liczenie-terminow`, `JUR:wymogi-formalne-pism`. Żadnego przepisu z pamięci.

## 1. Zasada

Pismo poprawne merytorycznie, ale niedopuszczalne, nie jest gotowe. Najpierw ustal, czy żądanie w ogóle może zostać
rozpoznane, dopiero potem pracuj nad argumentami. Wada wykluczająca żądanie = **FATAL**: status pisma `DRAFT/BLOCKED`
z przyczyną; nie redaguj go „na czysto” i nie oznaczaj jako gotowego, chyba że istnieje wykazany odrębny legalny tryb.

## 2. Kontrola (każdy punkt z wynikiem i źródłem)

| Punkt | Pytanie | Wynik |
|---|---|---|
| D1 Środek | Czy wybrany środek istnieje w tym trybie i na tym etapie (`JUR:tryby-procesowe`, przepis w ELI)? | OK / FATAL |
| D2 Zaskarżalność | Czy orzeczenie lub czynność podlega temu środkowi (przepis przewidujący środek, nie analogia)? | OK / FATAL |
| D3 Tryb | Czy szablon i procedura pasują do trybu (sprawa administracyjna nie idzie szablonem cywilnym; wykonawcza nie zastępuje środka od orzeczenia)? | OK / FATAL |
| D4 Legitymacja | Czy wnoszący ma uprawnienie (strona, uczestnik, pełnomocnik z umocowaniem)? | OK / FATAL / DO USTALENIA |
| D5 Właściwość | Czy adresat (sąd, organ) jest właściwy rzeczowo i miejscowo, z pośrednictwem organu, jeśli wymagane? | OK / FATAL / DO USTALENIA |
| D6 Termin | Termin liczony od właściwego zdarzenia (§3); przy nieznanej dacie — scenariusze | OK / FATAL / SCENARIUSZE |
| D7 Zakres | Czy żądanie mieści się w granicach rozstrzygnięcia i jego prawomocności (§4) | OK / FATAL |
| D8 Forma | Wymogi formalne i opłata (`JUR:wymogi-formalne-pism`) — usuwalne braki to nie FATAL, tylko lista do uzupełnienia | OK / BRAKI |

## 3. Termin przy nieznanej dacie doręczenia (T09)

Data wydania, ogłoszenia, doręczenia i prawomocności to osobne dane — nie wyprowadzaj jednej z drugiej. Gdy data
doręczenia (albo inne zdarzenie początkowe) jest nieznana:
- nie pisz, że termin jest zachowany ani że upłynął;
- podaj scenariusze: najwcześniejsza możliwa data zdarzenia → ostatni dzień terminu; data podana przez użytkownika
  (oznaczona jako jego twierdzenie) → ostatni dzień; zasada liczenia z `JUR:liczenie-terminow`;
- wskaż, skąd ustalić datę (zwrotne potwierdzenie odbioru, e-doręczenie, akta, portal);
- przy terminie zawitym i ryzyku uchybienia: wskaż działanie awaryjne z `JUR:terminy-procesowe` (np. wniosek
  przewidziany przez przepis), zweryfikowane w ELI.

## 4. Zakres rozstrzygnięcia i prawomocność (T07, T11)

- Orzeczenie uchylone lub zmienione **w części**: rozdziel części — co jest prawomocne, co wróciło do ponownego
  rozpoznania, co zmieniono. Skutków uchylenia nie przenoś na część prawomocną. Źródło: sentencja każdego orzeczenia,
  nie streszczenie.
- Postępowanie wykonawcze wykonuje treść orzeczenia, a nie ją zmienia. Wniosek, który w istocie zmienia sentencję
  (wymiar, zakres, rozstrzygnięcie), to niewłaściwy środek → FATAL, chyba że przepis trybu wykonawczego przewiduje
  wprost taką zmianę (zweryfikuj w ELI).

Skarga do ETPC: zamiast D1–D8 bramki E-1–E-7 z
`dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md` §11.

## 5. Wynik

```text
DOPUSZCZALNOŚĆ (MOD-DOPUSZCZALNOSC-GATE)
D1 środek: ...   D2 zaskarżalność: ...   D3 tryb: ...   D4 legitymacja: ...
D5 właściwość: ...   D6 termin: ... (SCENARIUSZE: ...)   D7 zakres: ...   D8 forma: ...
WERDYKT: DOPUSZCZALNE / DOPUSZCZALNE Z BRAKAMI / FATAL — <przyczyna i źródło>
```

FATAL zatrzymuje pipeline przed W1.2: użytkownik dostaje przyczynę i, jeśli istnieje, właściwy tryb. Werdykt i jego
źródła trafiają do raportu W3 i do HYBRID-VALIDATION (pismo z FATAL nie może dostać statusu gotowego).

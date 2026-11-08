# STAN PRAWNY — parametry PL (`JUR:stan-prawny`)

Parametry krajowe metody z `shared/TEMPORAL-LAW-CHECK.md`, `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`,
`shared/LEGAL-QUALITY-GATE.md` i `shared/POLISH-LAW-MAX-COVERAGE-STANDARD.md`. Metoda używa pojęć
ontologii ELI; ten moduł mówi, jak nazywa je i publikuje prawo polskie.

## Pojęcia metody → prawo polskie

| Pojęcie metody (ELI) | W prawie polskim | Uwaga |
|---|---|---|
| akt pierwotny (`eli:LegalResource`) | ustawa / rozporządzenie ogłoszone w Dz.U. albo M.P. | ELI: `DU/{rok}/{pozycja}` |
| dziennik urzędowy | Dziennik Ustaw (Dz.U.), Monitor Polski (M.P.) | |
| wersja skonsolidowana | tekst jednolity (t.j.) | ⚠️ w PL to **osobna pozycja Dz.U. z własnym ELI**, ogłaszana obwieszczeniem Marszałka Sejmu / właściwego organu — nie wersja tego samego identyfikatora z datą |
| zakres wersji skonsolidowanej | lista zmian w obwieszczeniu („tekst jednolity uwzględnia zmiany wprowadzone…”) i zmiany „nieuwzględnione” w odnośnikach | KROK T-1 |
| akt zmieniający (`eli:amends`) | nowelizacja (ustawa zmieniająca) | szukać **po dacie t.j.**, każdy rok osobno (KROK T-2) |
| wejście w życie, etapy | przepis o wejściu w życie noweli, `vacatio legis`, terminy etapowe w ELI | |
| przepisy przejściowe | przepisy przejściowe i dostosowujące noweli | |
| oficjalne źródło aktów | API Sejmu ELI (`api.sejm.gov.pl/eli`), ISAP | rząd 1 (`JUR:hierarchia-zrodel`) |
| źródła pomocnicze | LEX, Legalis (komentarze, wersje historyczne) | tylko przy braku dostępu do aktu lub komentarza |
| sądy najwyższe dla hierarchii orzeczeń | SN, NSA, TK (+ TSUE, ETPC) | `JUR:orzecznictwo-hierarchia` |

## Kontrola w piśmie (brzmienie PL)

```text
Czy przepis obowiązywał w dacie zdarzenia? TAK/NIE/NIEUSTALONE
Czy istnieją przepisy przejściowe? TAK/NIE/NIEUSTALONE
Czy sprawdzono WSZYSTKIE nowelizacje PO dacie t.j. (KROK T-2)?
  TAK: [pełna lista chronologiczna lub „brak"] / NIE
Czy cytat pochodzi z ELI/ISAP z dnia bieżącej kontroli? TAK/NIE
```

## Statusy aktu (format odpowiedzi)

`AKTUALNY-ISAP` (brzmienie z ostatniego t.j. bez późniejszych zmian), `PO-TJ-ZMIANY` (są nowelizacje
po t.j. — brzmienie z ich tekstu), `WYMAGA-KONTROLI-ISAP` (źródło niedostępne). Źródło: `ISAP` / `ELI`;
metryka: `Dz.U. {rok} poz. {pozycja}` według `JUR:format-cytowania`.

## Zakazy krajowe

- Nie wolno przywoływać pozycji Dz.U. z pamięci.
- Nie wolno używać starszego t.j., gdy jest nowszy; nie wolno mylić t.j. z ustawą zmieniającą.

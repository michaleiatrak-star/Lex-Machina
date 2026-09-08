# TERM-CALC — metodologia kontroli terminów

## 1. Status

Moduł jest walidatorem metodologicznym. Nie jest kalendarzem sądowym ani backendem do automatycznego liczenia dni wolnych. Jeżeli termin jest krytyczny, wynik oznacz jako wymagający weryfikacji w kalendarzu.

## 2. Dane wejściowe

Zawsze ustal:

- data doręczenia / ogłoszenia / zdarzenia,
- sposób doręczenia,
- czy termin jest procesowy czy materialny,
- długość terminu,
- czy termin jest zawity,
- czy ostatni dzień przypada na dzień ustawowo wolny od pracy,
- forma wniesienia pisma,
- skutek uchybienia.

## 3. Tabela robocza

| Czynność | Punkt startowy | Kontrola |
|---|---|---|
| sprzeciw / zarzuty | doręczenie nakazu | rodzaj nakazu, właściwy sąd/system |
| wniosek o uzasadnienie | ogłoszenie albo doręczenie, zależnie od trybu | aktualny przepis szczególny |
| apelacja | doręczenie orzeczenia z uzasadnieniem | czy wniosek o uzasadnienie był skuteczny |
| zażalenie | doręczenie / ogłoszenie postanowienia | czy postanowienie jest zaskarżalne |
| odwołanie KPA | doręczenie decyzji | organ odwoławczy i pośrednictwo organu I instancji |
| skarga WSA | doręczenie rozstrzygnięcia / bezczynność | wyczerpanie środków zaskarżenia |
| roszczenie pracownicze | czynność pracodawcy / wymagalność | termin prawa pracy albo przedawnienie |

## 4. Format ostrzeżenia

```text
TERMIN
Zdarzenie początkowe: ...
Długość terminu: ...
Charakter: procesowy / materialny / zawity / instrukcyjny
Ostatni dzień według danych: ...
Wymaga weryfikacji dni wolnych: TAK / NIE
Skutek uchybienia: ...
Działanie awaryjne: ...
```

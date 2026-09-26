# TEMPORAL-LAW-CHECK — stan prawny na dzień zdarzenia

Stan: 2026-05-28.

## Cel

Oddziela stan prawny dzisiejszy od stanu prawnego właściwego dla zdarzenia, decyzji, czynności procesowej albo okresu zatrudnienia.

## ⛔ SEKWENCJA OBOWIĄZKOWA (podniesiono do rangi bramki 2026-08-23f, F-120)

> Powód podniesienia: dotychczasowa forma (lista 7 pytań poniżej) jest
> deklaratywna, nie wymuszająca — w TEST1 jedno wykonanie znalazło
> nowelizację (Dz.U. 2025 poz. 1172) ad hoc, drugie na tym samym akcie
> pominęło ją całkowicie. Różnica wynikała z przypadku, nie z procedury.
> Poniższa sekwencja zamienia listę pytań w krok z obowiązkowym zapisem
> wyniku, także gdy wynik jest negatywny.

**PRÓG STOSOWANIA (koszt vs korzyść):** krok OBOWIĄZKOWY dla przepisu
NIOSĄCEGO ROZSTRZYGNIĘCIE sprawy (podstawa żądania, przesłanka decyzji,
termin, wysokość świadczenia) — OPCJONALNY dla przywołań czysto
kontekstowych (np. wzmianka o istnieniu instytucji prawnej bez oparcia
na niej konkretnego wniosku).

```
KROK T-1 → USTAL tekst jednolity (t.j.) właściwy dla przepisu — data
           ogłoszenia t.j. w Dz.U./M.P. ORAZ WYPISZ z treści obwieszczenia
           o t.j. listę nowelizacji, które ten t.j. JUŻ UWZGLĘDNIA
           (obwieszczenia o t.j. standardowo wymieniają: „tekst jednolity
           uwzględnia zmiany wprowadzone ustawami z dnia..."). To jest
           PUNKT WYJŚCIA odcinający, co jest już wliczone do t.j. — nie
           trzeba tego szukać ponownie w KROK T-2.

KROK T-2 → OSOBNE ZAPYTANIE o WSZYSTKIE akty zmieniające OPUBLIKOWANE PO
           dacie t.j. z KROK T-1 (skorygowano 2026-08-23f, po pytaniu
           użytkownika — pierwotna redakcja sugerowała pytanie o SAM FAKT
           istnienia nowelizacji, co zatrzymuje się na pierwszym trafieniu;
           między t.j. a dziś mogła wejść w życie WIĘCEJ NIŻ JEDNA
           nowelizacja w sekwencji, a zatrzymanie się na pierwszej
           znalezionej daje fałszywe poczucie sprawdzonej aktualności
           przy przepisie zmienionym powtórnie). ⛔ To NIE jest to samo
           zapytanie, które znalazło t.j. — szukanie „ustawa X tekst
           jednolity” nie wykrywa nowelizacji ogłoszonych PO dacie t.j.
           Wymagane osobne zapytanie typu „ustawa X nowelizacja [rok t.j.]
           do dziś” lub „ustawa X zmiana Dz.U. [każdy rok od t.j. do
           bieżącego]” — NIE kończ po pierwszym trafieniu, jeśli zakres
           lat od t.j. do dziś obejmuje więcej niż jeden rok kalendarzowy,
           sprawdź KAŻDY rok osobno lub użyj zapytania obejmującego cały
           przedział.

KROK T-3 → ZAPISZ PEŁNĄ LISTĘ wyników KROK T-2 W KAŻDYM PRZYPADKU, także
           gdy lista jest pusta: „sprawdzono akty zmieniające po [data
           t.j.] — brak znalezionych” JEST informacją i MUSI zostać
           zapisana. Gdy znaleziono więcej niż jedną nowelizację —
           wypisz WSZYSTKIE w kolejności chronologicznej, nie tylko
           najnowszą lub pierwszą znalezioną. Milczenie o wyniku
           ⛔ NIE JEST równoważne wynikowi negatywnemu — jest brakiem
           wykonania kroku.

KROK T-4 → DLA KAŻDEJ nowelizacji z listy KROK T-3 (nie tylko dla
           pierwszej/ostatniej): ustal datę wejścia w życie i przepisy
           przejściowe (patrz „Obowiązkowe pytania” niżej, pkt 5-7).
           Jeśli nowelizacje następowały PO SOBIE (kolejne zmiany tego
           samego przepisu), ustal KOLEJNOŚĆ i to, które brzmienie jest
           aktualne NA DATĘ ANALIZY — ostatnia chronologicznie
           nowelizacja obowiązująca w tej dacie, nie automatycznie
           najnowsza ze znalezionych (przepis mógł zostać uchylony
           późniejszą zmianą, zanim wszedł w życie, lub mieć odroczone
           vacatio legis).

KROK T-5 → PRZY BLOKADZIE ŹRÓDŁA (robots.txt, brak dostępu) na KROK T-2:
           ⛔ NIGDY nie pomijaj kroku milcząco — przejdź do statusu
           🟨 [KOTWICA-URZĘDOWA] (shared/PRAWO-HARDGATE.md, warunki
           K-1…K-4) zamiast twierdzić o aktualności bez sprawdzenia.
```

**Kryterium zamknięcia bramki:** przebieg kontrolny na akcie z nowelizacją
opublikowaną po dacie t.j. wykrywa ją BEZ podpowiedzi w treści polecenia.

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

W każdym piśmie procesowym zawierającym podstawę prawną NIOSĄCĄ
ROZSTRZYGNIĘCIE dodaj wewnętrzną kontrolę:

```text
Czy przepis obowiązywał w dacie zdarzenia? TAK/NIE/NIEUSTALONE
Czy istnieją przepisy przejściowe? TAK/NIE/NIEUSTALONE
Czy sprawdzono WSZYSTKIE akty zmieniające PO dacie t.j. (KROK T-2)?
  TAK: [pełna lista chronologiczna lub „brak"] / NIE
Czy cytat pochodzi z ISAP z dnia bieżącej kontroli? TAK/NIE
```


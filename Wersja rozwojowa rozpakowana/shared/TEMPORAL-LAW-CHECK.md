# TEMPORAL-LAW-CHECK — stan prawny na dzień zdarzenia

Stan: 2026-11-08. Metoda wspólna dla każdej jurysdykcji; nazwy i źródła krajowe (jak jurysdykcja nazywa i publikuje
wersję skonsolidowaną, akt zmieniający, dziennik urzędowy): `JUR:stan-prawny`.
Pojęcia według ontologii ELI: akt, wersja skonsolidowana (punkt w czasie), akt zmieniający.

## Cel

Oddziela stan prawny dzisiejszy od stanu prawnego właściwego dla zdarzenia, decyzji, czynności procesowej albo okresu zatrudnienia.

## ⛔ SEKWENCJA OBOWIĄZKOWA (podniesiono do rangi bramki 2026-08-23f, F-120)

> Powód podniesienia: dotychczasowa forma (lista 7 pytań poniżej) jest
> deklaratywna, nie wymuszająca — w TEST1 jedno wykonanie znalazło
> akt zmieniający ad hoc, drugie na tym samym akcie
> pominęło ją całkowicie. Różnica wynikała z przypadku, nie z procedury.
> Poniższa sekwencja zamienia listę pytań w krok z obowiązkowym zapisem
> wyniku, także gdy wynik jest negatywny.

**PRÓG STOSOWANIA (koszt vs korzyść):** krok OBOWIĄZKOWY dla przepisu
NIOSĄCEGO ROZSTRZYGNIĘCIE sprawy (podstawa żądania, przesłanka decyzji,
termin, wysokość świadczenia) — OPCJONALNY dla przywołań czysto
kontekstowych (np. wzmianka o istnieniu instytucji prawnej bez oparcia
na niej konkretnego wniosku).

```
KROK T-1 → USTAL wersję skonsolidowaną właściwą dla przepisu i jej datę
           (punkt w czasie) ORAZ WYPISZ akty zmieniające, które ta wersja
           JUŻ UWZGLĘDNIA — skąd je wziąć w danej jurysdykcji, mówi
           `JUR:stan-prawny`. To jest PUNKT WYJŚCIA odcinający, co jest już
           wliczone — nie trzeba tego szukać ponownie w KROK T-2.

KROK T-2 → OSOBNE ZAPYTANIE o WSZYSTKIE akty zmieniające OPUBLIKOWANE PO
           dacie wersji skonsolidowanej z KROK T-1 (skorygowano 2026-08-23f, po pytaniu
           użytkownika — pierwotna redakcja sugerowała pytanie o SAM FAKT
           istnienia aktu zmieniającego, co zatrzymuje się na pierwszym trafieniu;
           między wersją skonsolidowaną a dziś mogło wejść w życie WIĘCEJ
           NIŻ JEDNA zmiana w sekwencji, a zatrzymanie się na pierwszej
           znalezionej daje fałszywe poczucie sprawdzonej aktualności
           przy przepisie zmienionym powtórnie). ⛔ To NIE jest to samo
           zapytanie, które znalazło wersję skonsolidowaną — jej odczyt
           nie wykrywa aktów zmieniających ogłoszonych PO jej dacie.
           Wymagane osobne zapytanie o akty zmieniające ten akt od roku
           wersji skonsolidowanej do dziś (w dzienniku urzędowym albo w
           metadanych zmian źródła urzędowego) — NIE kończ po pierwszym
           trafieniu, jeśli zakres lat obejmuje więcej niż jeden rok kalendarzowy,
           sprawdź KAŻDY rok osobno lub użyj zapytania obejmującego cały
           przedział.

KROK T-3 → ZAPISZ PEŁNĄ LISTĘ wyników KROK T-2 W KAŻDYM PRZYPADKU, także
           gdy lista jest pusta: „sprawdzono akty zmieniające po [data
           wersji skonsolidowanej] — brak znalezionych” JEST informacją i MUSI zostać
           zapisana. Gdy znaleziono więcej niż jeden akt zmieniający —
           wypisz WSZYSTKIE w kolejności chronologicznej, nie tylko
           najnowszą lub pierwszą znalezioną. Milczenie o wyniku
           ⛔ NIE JEST równoważne wynikowi negatywnemu — jest brakiem
           wykonania kroku.

KROK T-4 → DLA KAŻDEGO aktu zmieniającego z listy KROK T-3 (nie tylko dla
           pierwszej/ostatniej): ustal datę wejścia w życie i przepisy
           przejściowe (patrz „Obowiązkowe pytania” niżej, pkt 5-7).
           Jeśli zmiany następowały PO SOBIE (kolejne zmiany tego
           samego przepisu), ustal KOLEJNOŚĆ i to, które brzmienie jest
           aktualne NA DATĘ ANALIZY — ostatnia chronologicznie
           zmiana obowiązująca w tej dacie, nie automatycznie
           najnowsza ze znalezionych (przepis mógł zostać uchylony
           późniejszą zmianą, zanim wszedł w życie, lub mieć odroczone
           vacatio legis).

KROK T-5 → PRZY BLOKADZIE ŹRÓDŁA (robots.txt, brak dostępu) na KROK T-2:
           ⛔ NIGDY nie pomijaj kroku milcząco — przejdź do statusu
           🟨 [KOTWICA-URZĘDOWA] (JUR:weryfikacja-przepisow-kanon, warunki
           K-1…K-4) zamiast twierdzić o aktualności bez sprawdzenia.
```

### W aplikacji — wynik `verify_legal_reference` (2026-10-16)

Kroki T-1…T-4 wykonuje narzędzie; model nie szuka aktów zmieniających sam, tylko
przepisuje wynik. Mapowanie:

| Krok | Pole wyniku | Jak użyć |
|---|---|---|
| T-1 | `freshness.currentEli` | wersja skonsolidowana, na której oparto brzmienie |
| T-2/T-3 | `freshness.amendments[]` (`dzU`, `from`, `status`, `stages`) | pełna lista chronologiczna; pusta = „sprawdzono akty zmieniające po wersji skonsolidowanej — brak”; nigdy sama liczba |
| T-4 vacatio | `status: OCZEKUJE` | zmiana ogłoszona, jeszcze nie obowiązuje: podaj datę wejścia w życie |
| T-4 etapy | `stages` (terminy z ELI) | inna data dla części przepisów aktu zmieniającego; liczy się data części zmieniającej ten akt |
| T-4 brzmienie | `evidence` / `pendingWording[]` | `evidence` = obowiązujące w dniu sprawdzenia (odnośniki wersji skonsolidowanej); `pendingWording` = brzmienie od `from`, nigdy jako obowiązujące |
| pkt 5-6 | `freshness.transitionalProvisions[]` | przepisy przejściowe aktu zmieniającego z jego tekstu (małe litery = normalizacja); stosuj do czynności sprzed zmiany |
| data zdarzenia | `asOf=RRRR-MM-DD` | brzmienie na dzień zdarzenia; akt zmieniający, który nie dotyczy artykułu, nie blokuje |

Brak VER (`⚠️ [NIEWERYFIKOWANE]`) z przyczyną w `evidence`: dwa brzmienia bez
czytelnej daty w odnośniku, artykuł `(uchylony)`, zmiana nieobowiązująca
wydrukowana w wersji skonsolidowanej bez rozstrzygających odnośników, powołana jednostka
(§ / ust. / pkt) wchodząca w życie później, uchylona albo nieistniejąca —
powołuj wtedy jednostkę obowiązującą albo podaj datę wejścia w życie.

**Kryterium zamknięcia bramki:** przebieg kontrolny na akcie z aktem zmieniającym
opublikowanym po dacie wersji skonsolidowanej wykrywa ją BEZ podpowiedzi w treści polecenia.

## Obowiązkowe pytania

1. Kiedy nastąpiło zdarzenie prawne?
2. Kiedy doręczono decyzję/pismo/wyrok?
3. Kiedy upływa termin?
4. Czy przepis obowiązywał w tej dacie?
5. Czy akt zmieniający miał przepisy przejściowe?
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
ROZSTRZYGNIĘCIE dodaj wewnętrzną kontrolę (brzmienie krajowe: `JUR:stan-prawny`):

```text
Czy przepis obowiązywał w dacie zdarzenia? TAK/NIE/NIEUSTALONE
Czy istnieją przepisy przejściowe? TAK/NIE/NIEUSTALONE
Czy sprawdzono WSZYSTKIE akty zmieniające PO dacie wersji skonsolidowanej (KROK T-2)?
  TAK: [pełna lista chronologiczna lub „brak"] / NIE
Czy cytat pochodzi z oficjalnego źródła aktów z dnia bieżącej kontroli? TAK/NIE
```


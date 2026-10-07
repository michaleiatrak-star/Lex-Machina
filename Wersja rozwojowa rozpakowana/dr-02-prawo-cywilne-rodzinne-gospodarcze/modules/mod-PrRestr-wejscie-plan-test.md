# Restrukturyzacja — kwalifikacja sprawy, plan i test zaspokojenia

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prrestr.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prrestr/index.json`.

## Wejście: art. 1–13

Zbierz aktualny KRS/CEIDG, reprezentację, strukturę aktywów i zobowiązań,
terminy płatności, spory, zabezpieczenia, budżet płynności, postępowania egzekucyjne,
wcześniejsze układy, datę wniosku lub ustalenia dnia układowego.

1. Zdolność restrukturyzacyjna: art. 4. Uwzględnij spółki kapitałowe bez działalności
   i wspólników wymienionych w ustawie. Sprawdź wyłączenia ust. 2, w tym banki,
   SKOK i ubezpieczycieli; nie twórz dla nich zwykłej sanacji.
2. Przesłanki: art. 6 i art. 11 PrUp. Zagrożenie niewypłacalnością wystarcza dla
   restrukturyzacji, lecz nie zastępuje testu zdolności finansowania postępowania.
3. Wnioskodawca: art. 7, z wyjątkami sanacji w art. 283. Wierzyciel osobisty
   nie ma uniwersalnego prawa do otwarcia każdego z czterech trybów.
4. Przeszkody: art. 8. Oceń pokrzywdzenie wierzycieli; dla PU i sanacji również
   uprawdopodobnienie finansowania kosztów i zobowiązań po otwarciu.
5. Zbieg z upadłością: art. 11–13; porównaj art. 9a–9b PrUp. Pierwszeństwo
   rozpoznania restrukturyzacji nie oznacza automatycznego oddalenia upadłości.
6. Właściwość/organ: art. 14–22, COMI i właściwość szczególna; element zagraniczny
   kieruj do modułu międzynarodowego przed wyborem sądu.

## Wybór postępowania — art. 3

| Dane sprawy | Warunek wyboru |
|---|---|
| Samodzielne zbieranie głosów z nadzorcą | PZU, sporne wierzytelności uprawniające do głosowania ≤15% właściwej sumy |
| Szybki spis i postępowanie sądowe | PPU, ten sam ustawowy próg ≤15% |
| Sporne wierzytelności przekraczają 15% | PU; nie „przyspieszaj” go przez pominięcie sporów |
| Konieczne działania sanacyjne | Sanacja, bez utożsamienia jej z PU ani uzależniania od progu 15% |

Mianownik i licznik wyznacz według uprawnienia do głosowania, nie całego salda
księgowego. Oddziel wyłączenia, zgody pracowników, zabezpieczenia i powiązania.
Wyliczenie przedstaw jako tabelę kwot z podstawą kwalifikacji każdej pozycji.

## Plan — art. 9–10

Wstępny plan: przyczyny kryzysu, środki i koszty, harmonogram, sprawozdanie
finansowe z ustawowego okresu. Pełny plan: przedsiębiorstwo/rynek, przyczyny,
strategia/ryzyka, środki i skutki zatrudnienia, harmonogram, moce produkcyjne,
finansowanie, prognozy zysków i strat, osoby odpowiedzialne, autorzy, data.
Sprawdź wszystkie punkty art. 10, w tym ocenę wykonalności i informacje dodane
reformą. Uproszczenie uzasadnij wielkością/charakterem przedsiębiorstwa.
Nie traktuj samej deklaracji inwestora jako dowodu dostępności finansowania.

## Test zaspokojenia — art. 10a

Wykonuje nadzorca albo zarządca. Rozdziel wycenę kontynuacji od scenariuszy
upadłościowych: sprzedaż całości oraz poszczególnych składników. Zapisz metody,
założenia, koszty, czas postępowania, kolejność zaspokojenia i wynik dla wierzycieli.
Dla podmiotów bez zdolności upadłościowej ustal ustawowy scenariusz egzekucyjny.
Sprawdź wyjątek mikroprzedsiębiorcy bezpośrednio w art. 10a ust. 4; nie wymagaj
automatycznie testu od każdego dłużnika. Brak ustawowego obowiązku testu nie
zwalnia z oceny pokrzywdzenia ani wykonalności układu.

Test zaspokojenia nie jest testem prywatnego wierzyciela/inwestora z art. 140.
Ten drugi służy pomocy publicznej. Układ nie może zostać oceniony wyłącznie
na podstawie porównania średniego odzysku wszystkich wierzycieli.

## Wynik

Przygotuj rekomendowany tryb z alternatywą, tabelę przesłanek i dowodów,
wyliczenie progu, budżet postępowania, plan pozyskania brakujących danych oraz
kalendarz ustawowy właściwego trybu. Bez potwierdzenia źródeł danych oznacz
wycenę i wykonalność jako założenia, nie ustalone fakty.

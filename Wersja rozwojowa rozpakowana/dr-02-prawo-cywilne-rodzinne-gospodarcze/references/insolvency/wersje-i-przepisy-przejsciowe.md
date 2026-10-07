# Wersje prawa i przepisy przejściowe obu ustaw

## Stan dostawy: 04.10.2026

| Ustawa | Tekst jednolity | Stan prawny obwieszczenia | Publikacja |
|---|---|---|---|
| Prawo upadłościowe | DU/2026/913 | 10.06.2026 | 07.07.2026 |
| Prawo restrukturyzacyjne | DU/2026/533 | 25.03.2026 | 17.04.2026 |

Metryki źródłowe, PDF, ekstrakcje i hashe: `../prup/`, `../prrestr/`.
Pełne teksty niżej wskazanych nowelizacji: `sources/`, metryka: `sources.json`.
Sprawdź aktualne relacje ELI obu aktów przy każdym użyciu. Brak zmiany PDF
tekstu jednolitego nie dowodzi, że nie uchwalono późniejszej nowelizacji.

## Reżimy przejściowe

| Nowelizacja | Zmiana i data | Reguła dla sprawy |
|---|---|---|
| [2025/1085](https://api.sejm.gov.pl/eli/acts/DU/2025/1085/text.pdf) | Reforma restrukturyzacji, wejście 23.08.2025, art. 6 | Art. 4 zachowuje stare przepisy dla spraw, w których wcześniej wpłynął wskazany wniosek lub ustalono dzień układowy. Dotyczy także wniosku o upadłość/uznanie zagranicznego postępowania oraz stwierdzenie wykonania, zmianę lub uchylenie układu. |
| [2025/1170](https://api.sejm.gov.pl/eli/acts/DU/2025/1170/text.pdf) | Informacje bankowe, wejście 09.09.2025, art. 6 | Art. 5: dla wszczętych i niezakończonych postępowań przed wejściem — dotychczasowe przepisy. Nie zastępuj „wszczęcia” dowolną datą dokumentu. |
| [2025/1172](https://api.sejm.gov.pl/eli/acts/DU/2025/1172/text.pdf) | Procedura, PrUp art. 229 i PrRestr art. 209; art. 7 i 10 nowelizacji wchodzą 10.09.2025 | Art. 14 i 16 różnicują wejście i sprawy/pisma/doręczenia. Ogólna data 01.03.2026 dla ustawy nie jest datą wszystkich jej zmian. |
| [2026/331](https://api.sejm.gov.pl/eli/acts/DU/2026/331/text.pdf) | Banki spółdzielcze, wejście 28.03.2026 (art. 10) | Przepisy 7–9 dotyczą wskazanych umów, organów i wystąpień; oceniaj ich zakres przed przeniesieniem do upadłości. |
| [2026/340](https://api.sejm.gov.pl/eli/acts/DU/2026/340/text.pdf) | Rynek finansowy, PrUp w art. 4; właściwe wejście 31.03.2026 | Art. 9 pozostawia stare brzmienie art. 440 ust. 2 pkt 1 w postępowaniach wszczętych i niezakończonych wcześniej. Wyjątek daty 09.01.2027 z art. 12 dotyczy innych wskazanych zmian. |
| [2026/1206](https://api.sejm.gov.pl/eli/acts/DU/2026/1206/text.pdf) | PrUp 452 ust. 1 i 456 ust. 1 (art. 7), PrRestr 4 ust. 2 pkt 4 (art. 24) | Art. 57: te zmiany dopiero 11.01.2027, mimo wcześniejszego ogólnego wejścia ustawy. |
| [2026/176](https://api.sejm.gov.pl/eli/acts/DU/2026/176/text.pdf) | PrRestr 156 ust. 5 pkt 4 uchylany przez art. 24 | Art. 35: 18.02.2027. PDF t.j. zawiera obie redakcje, odnośniki 31–32. Do tego dnia stosuj dotychczasową treść, jeżeli reżim sprawy nie wymaga jeszcze wcześniejszej wersji. |

## Wykonanie kontroli

1. Oddziel datę oceny prawnej od dat wniosku, dnia układowego, otwarcia,
   czynności, doręczenia, powstania i wymagalności długu.
2. Sprawdź pełne źródło właściwego artykułu, jego przypisy i relacje ELI.
3. Wybierz reżim na podstawie przepisów przejściowych; wpisz zdarzenie,
   datę, dowód i jednostkę nowelizacji. Sam numer najnowszego t.j. nie wystarcza.
4. Dla starszej sprawy pobierz właściwy tekst i zmiany między nim a datą
   graniczną. Dołączone poprzednie t.j. 2024/1428 i 2025/614 są punktami
   odniesienia, nie automatycznie gotowymi wersjami dla każdej daty.
5. Nie scalaj wariantów „na oko”. Gdy czytnik blokuje `--as-of`, odczytaj
   wskazaną nowelizację i przeprowadź udokumentowaną rekonstrukcję.

`insolvency.py regime --event arrangement_date=2025-08-22` sprawdza wyłącznie
bramkę reformy 2025/1085 na podstawie podanych zdarzeń tej samej sprawy.
Nie orzeka o zastosowaniu innych nowelizacji. Odpowiedź „brak wcześniejszego
zdarzenia w danych” wymaga potwierdzenia, że lista zdarzeń jest kompletna.

## Przepisy pominięte i uchylone

Pełne pierwotne PDF obu ustaw zachowują przepisy zmieniające inne akty
(PrUp 524–535 i PrRestr 401–447), których teksty jednolite nie drukują.
Odczyt tekstu pierwotnego nie przywraca przepisów uchylonych. Skutki dawnych
zmian należy sprawdzać we właściwej wersji aktu zmienionego. Rejestr nie
wymyśla indywidualnych artykułów tam, gdzie t.j. podaje tylko grupę.

## Odesłania poza obiema ustawami

KPC, KC, KRO, ustawa o KRZ, przepisy kosztowe, ustawy deweloperskie/DFG,
Prawo bankowe/BFG, ubezpieczenia, obligacje, pomoc publiczna i prawo UE
pozostają osobnymi źródłami. Użyj właściwego modułu systemu oraz aktualnego
urzędowego tekstu. Komplet dwóch ustaw nie oznacza zamrożenia całego prawa
związanego z niewypłacalnością w jednym pliku ani kompletnej bazy orzecznictwa.

Pierwotny PDF PrUp z 2003 r. ma stary skład dwukolumnowy i częściowo błędne
mapowanie polskich znaków w ekstrakcji TXT. Cytaty przepisów pominiętych
odczytuj z obrazu PDF; nie używaj tego TXT do automatycznej rekonstrukcji.
Pierwsza strona zachowuje także końcówkę poprzedniej pozycji Dziennika Ustaw.
Bieżące czytniki indeksują wyłącznie kontrolowane teksty jednolite 2026 r.

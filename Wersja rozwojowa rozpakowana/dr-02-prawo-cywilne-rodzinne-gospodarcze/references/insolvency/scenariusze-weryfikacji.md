# Sprawdzone scenariusze źródłowe — 04.10.2026

Porównanie reguł z pobranymi urzędowymi przepisami oraz zachowaniem czytnika.
To kontrola autora rozszerzenia, nie niezależny benchmark porad prawnych ani
walidacja na aktach rzeczywistych spraw. Pełne źródła i hashe są w korpusie.

| Scenariusz | Wynik kontroli | Podstawa |
|---|---|---|
| Dzień układowy 22.08.2025, wniosek po 23.08.2025 | Wcześniejszy dzień układowy uruchamia stare przepisy reformy; późniejszy wniosek nie usuwa zdarzenia | 2025/1085 art. 4, 6; test bramki |
| Pierwsze relewantne zdarzenie 23.08.2025 | Nie jest „przed” wejściem; wymagane kompletne dane sprawy | ten sam przepis, test granicy |
| Zabezpieczona rzeczowo wierzytelność w nowym reżimie | Brak ogólnej zasady wyłączenia do zgody; odrębna grupa i ochrona | PrRestr 150 ust. 3, 151, 161 ust. 1a, 161a |
| Pracownik nie wyraża zgody | Zachowana odrębna zgoda pracownika; nie mylić z dawną zgodą zabezpieczonych | PrRestr 151 ust. 2 |
| Układ częściowy liczony dawnym art. 186 | Przepis uchylony, trzeba zastosować obecne większości i odesłania | PrRestr 119, 180, 181, 186–188 |
| Sprzeciwy do spisu w PPU i PU | Odrębne mechanizmy; nie przenosić zwykłego sprzeciwu bez sprawdzenia | PrRestr 91–103, 261–262, 280–282 |
| Mikroprzedsiębiorca bez testu zaspokojenia | Ustawowy wyjątek, lecz nie wyłącza badania innych przesłanek | PrRestr 10a ust. 4 |
| PZU: głosy zbierane natychmiast po sporządzeniu dokumentów | W nowym reżimie wymagane wyprzedzenie co najmniej 30 dni | PrRestr 211b |
| PPU: stary dwutygodniowy termin przygotowania planu | Obecny art. 261 ust. 1 przewiduje 30 dni; osobne wyprzedzenie dokumentów głosowania | PrRestr 261 |
| PZU: brak wniosku przez cztery miesiące od obwieszczenia | Umorzenie z mocy prawa, nie tylko dawne hasło utraty ochrony | PrRestr 218a ust. 2 |
| PZU po umorzeniu postępowania w przedmiocie wniosku | Sprawdzić szczególne siedem dni na uproszczony wniosek | PrRestr 226h |
| Konwersja na akcje w październiku 2026 | Nie wybierać przyszłego uchylenia pkt 4; PDF zawiera oba warianty | PrRestr 156 ust. 5 pkt 4, 2026/176 art. 24,35 |
| Art. 452 PrUp po 11.01.2027 | Jawna data blokuje odczyt starej wersji, wymagana nowelizacja | 2026/1206 art. 7,57; test z symulowaną datą |
| Odesłanie art. 266f PrUp | Stosowanie PrRestr odpowiednio i rola syndyka; nie wynagrodzenie | PrUp 266f |
| Plan likwidacyjny a zastępcze sprawozdanie ogólne | 30 dni z 306 i miesiąc z 307 nie są tym samym okresem | PrUp 306–307 |
| Konsument: sprzedaż nieruchomości | Szczególne zawiadomienie i kontrola, a nie automatyczna zgoda rady | PrUp 491¹¹a |
| System płatności po upadłości | Art. 136–137 istnieją i regulują zlecenia rozrachunku, nie uchylony układ | PrUp 136–137 |
| Pominięte w t.j. przepisy zmieniające | Nie tworzyć brakującego przepisu z pamięci; oryginalny PDF w źródłach | PrUp 524–535, PrRestr 401–447 |
| Utrata sieci lub nowa relacja zmieniająca/uchylająca | Brak pozytywnego fresh gate; komunikat błędu | testy czytników |

Kontrole automatyczne: pełny podział tekstu bez utraty znaków od pierwszego
artykułu, zgodność stron, odrębność ustaw/numerów/sufiksów, integralność źródeł,
pełność routingu, przyszłe/historyczne daty, zmiany i błędy ELI, działanie
poza katalogiem skilla. Nie testują one prawidłowości każdego rozstrzygnięcia.

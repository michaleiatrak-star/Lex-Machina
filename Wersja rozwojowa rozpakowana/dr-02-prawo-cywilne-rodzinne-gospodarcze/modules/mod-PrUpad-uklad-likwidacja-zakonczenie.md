# Układ w upadłości i powiązanie z likwidacją

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prup.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prup/index.json`.

## Układ: art. 266a–266f

Propozycje mogą zgłosić upadły, wierzyciel lub syndyk (266a).
Przygotuj propozycje, listę, prognozę przepływów, porównanie z likwidacją,
finansowanie zobowiązań nieobjętych i ocenę wykonalności.

Art. 266b: wniosek o całkowite/częściowe wstrzymanie likwidacji, właściwy
organ i wymóg zaspokojenia nieobjętych wierzytelności. Nie zakładaj,
że samo złożenie propozycji zatrzymuje każdą sprzedaż. Art. 266c:
uprawdopodobnienie przyjęcia i wykonania, poparcie wierzycieli, zatwierdzenie
listy i dopuszczalny udział sprzeciwów. Próg poparcia wniosku o zwołanie
nie jest większością przyjęcia układu.

Art. 266d: zakończenie po prawomocnym zatwierdzeniu, odpowiednie stosowanie
362–367. Art. 266e: szczególne ustalenie wynagrodzenia syndyka z odesłaniem
do przepisów PrRestr po spełnieniu warunków; nie jest automatyczną premią.
**Art. 266f** jest odesłaniem do przepisów PrRestr o propozycjach, głosowaniu,
zatwierdzeniu, skutkach, zmianie i uchyleniu układu — nie przepisem o wynagrodzeniu.
Czynności zastrzeżone dla nadzorcy sądowego lub zarządcy wykonuje syndyk.
Odczytaj zakres odpowiedniego stosowania przed zastosowaniem art. 119,
150–179 PrRestr. Ustal reżim przejściowy nowelizacji 2025/1085 dla sprawy.

Dawny tytuł VI (267–305) jest uchylony. Historyczne rozróżnienie ogłoszenia
„likwidacyjnego” i „z możliwością układu” nie jest dzisiejszym wyborem
zamiast konstrukcji 266a–266f.

## Likwidacja: art. 306–334

Dokumenty z 306–307, rozpoczęcie i cel czasowy 308, wstrzymanie 309,
wcześniejsza sprzedaż 310, metody 311, przedsiębiorstwo 312,
skutki sprzedaży i wyjątki 313–315. Szczegóły →
`mod-PrUpad-syndyk-likwidacja.md` oraz
`mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md`.
Miesiąc i 30 dni nie są równoważnymi terminami kalendarzowymi;
zawsze użyj literalnej jednostki czasu z obowiązującego przepisu.

## Zakończenie i umorzenie: art. 361–372

Pełna procedura → `mod-PrUpad-zakonczenie-zakaz-karne.md`.
Nie utożsamiaj art. 369 (osoba fizyczna w zwykłym postępowaniu) z projektem
planu spłaty w uproszczonej upadłości konsumenckiej. Uwzględnij reżim
postępowania z postanowienia, właściwy wniosek/projekt i jego termin.

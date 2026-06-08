# MULTI-LEVEL-POLISH-LAW-ROUTER — routing prawa krajowego, wojewódzkiego, powiatowego i gminnego

## Reguła główna
Każda sprawa z prawa polskiego, której nie da się jednoznacznie przypisać do jednego wyspecjalizowanego skillu, trafia najpierw do `prawo-polskie-v2`, a dopiero potem do modułu szczegółowego.

## Sprawy wielopoziomowe
Jeżeli sprawa obejmuje ustawę, rozporządzenie i akt prawa miejscowego, wykonaj kolejność:
1. akt krajowy w ISAP,
2. delegacja ustawowa,
3. rozporządzenie wykonawcze,
4. akt wojewódzki/powiatowy/gminny,
5. publikacja i wejście w życie,
6. rozstrzygnięcia nadzorcze,
7. orzecznictwo WSA/NSA,
8. praktyka organu lokalnego.

## Fallback
Jeżeli użytkownik nie wskazuje miejscowości lub organu:
- poproś o lokalizację tylko gdy bez tego nie da się rozstrzygnąć,
- w innym przypadku oznacz brak jako `BRAK WŁAŚCIWOŚCI MIEJSCOWEJ — DO UZUPEŁNIENIA`,
- nie podstawiaj losowej gminy/powiatu/województwa.

## Walidacja źródłowa
- Źródło podstawowe: ISAP dla ustaw i rozporządzeń ogólnokrajowych.
- Dla prawa miejscowego: właściwy wojewódzki dziennik urzędowy, BIP wojewody, BIP JST, portal dzienników wojewódzkich, rozstrzygnięcia nadzorcze wojewody i RIO.
- LEX/Legalis: wyłącznie pomocniczo przy komentarzu, orzecznictwie, praktyce lub braku stabilnego dostępu do tekstu.
- Zakaz rekonstruowania brzmienia przepisu z pamięci. Jeżeli tekstu nie da się potwierdzić, oznacz: `WYMAGA KONTROLI ŹRÓDŁOWEJ`.

## Standard głębokości
Każde użycie modułu ma działać jak moduły wzorcowe prawa pracy i karnego: intake → kwalifikacja → źródło prawa → przesłanki → procedura → dowody → ryzyka → strategia → pismo/wniosek → kontrola jakości.

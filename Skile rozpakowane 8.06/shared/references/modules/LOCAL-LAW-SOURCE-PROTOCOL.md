# LOCAL-LAW-SOURCE-PROTOCOL — prawo miejscowe i akty terenowe

## Cel
Moduł określa zasady wyszukiwania, walidacji i używania prawa miejscowego oraz aktów wojewódzkich, powiatowych i gminnych w systemie kancelaryjnym.

## Hierarchia źródeł
1. Konstytucja, ustawy i rozporządzenia ogólnokrajowe — ISAP / Dziennik Ustaw / Monitor Polski.
2. Akty prawa miejscowego — właściwy wojewódzki dziennik urzędowy.
3. Akty nadzoru — BIP wojewody, BIP RIO, dziennik urzędowy jeżeli podlega publikacji.
4. Akty wewnętrzne organów JST — BIP właściwej gminy, powiatu, województwa, starostwa, urzędu marszałkowskiego.
5. Praktyka i komentarze — LEX/Legalis pomocniczo.

## Reguła lokalizacji aktu
Przed analizą zawsze ustal:
- województwo,
- powiat,
- gminę,
- organ wydający,
- rodzaj aktu: uchwała, zarządzenie, rozporządzenie porządkowe, regulamin, statut, plan, program, rozstrzygnięcie nadzorcze,
- datę podjęcia,
- datę publikacji,
- publikator,
- wejście w życie,
- ewentualne uchylenie lub stwierdzenie nieważności.

## Zakaz skrótu
Nie wolno zakładać treści lokalnego aktu tylko dlatego, że podobny akt istnieje w innej JST. Każda JST może mieć własny statut, regulamin, uchwały, taryfy, programy, plany i procedury.

## Wynik kontroli
Każde użycie aktu lokalnego kończ statusem:
- `POTWIERDZONY W DZIENNIKU WOJEWÓDZKIM`,
- `POTWIERDZONY W BIP`,
- `POTWIERDZONY W ROZSTRZYGNIĘCIU NADZORCZYM`,
- `WYMAGA KONTROLI ŹRÓDŁOWEJ`,
- `RYZYKO UTRATY MOCY / NIEWAŻNOŚCI`.

## Walidacja źródłowa
- Źródło podstawowe: ISAP dla ustaw i rozporządzeń ogólnokrajowych.
- Dla prawa miejscowego: właściwy wojewódzki dziennik urzędowy, BIP wojewody, BIP JST, portal dzienników wojewódzkich, rozstrzygnięcia nadzorcze wojewody i RIO.
- LEX/Legalis: wyłącznie pomocniczo przy komentarzu, orzecznictwie, praktyce lub braku stabilnego dostępu do tekstu.
- Zakaz rekonstruowania brzmienia przepisu z pamięci. Jeżeli tekstu nie da się potwierdzić, oznacz: `WYMAGA KONTROLI ŹRÓDŁOWEJ`.

## Standard głębokości
Każde użycie modułu ma działać jak moduły wzorcowe prawa pracy i karnego: intake → kwalifikacja → źródło prawa → przesłanki → procedura → dowody → ryzyka → strategia → pismo/wniosek → kontrola jakości.

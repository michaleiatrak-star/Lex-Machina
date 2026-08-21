# mod-EH-akty-porzadkowe-bezpieczenstwo-lokalne — Akty porządkowe i bezpieczeństwo lokalne

## Status modułu
Moduł ekspercki prawa polskiego. Budowany do poziomu funkcjonalnego prawa pracy i prawa karnego: pełny intake, kwalifikacja, procedura, dowody, strategia, ryzyka, orzecznictwo, quality gate i źródła.

## Akty i źródła kontrolne
- ISAP: ustawy ustrojowe samorządu, ustawa o wojewodzie, ustawa o ogłaszaniu aktów normatywnych, ustawa o RIO, ustawa o zarządzaniu kryzysowym, ustawa o ochronie ludności i obronie cywilnej.
- Wojewódzkie dzienniki urzędowe: akty prawa miejscowego i publikatory wejścia w życie.
- BIP wojewodów: rozstrzygnięcia nadzorcze, zarządzenia, rozporządzenia, obwieszczenia.
- BIP JST: statuty, regulaminy, uchwały, zarządzenia organów wykonawczych, konsultacje, projekty, protokoły.
- Orzecznictwo: WSA/NSA, ewentualnie SN/TK przy kolizjach konstytucyjnych.

## Intake
Ustal:
1. lokalizację: województwo, powiat, gmina;
2. organ: wojewoda, sejmik, zarząd województwa, rada powiatu, zarząd powiatu, rada gminy, wójt/burmistrz/prezydent, starosta;
3. rodzaj aktu: prawo miejscowe, uchwała, zarządzenie, rozporządzenie porządkowe, statut, regulamin, plan, program, taryfa, obwieszczenie, rozstrzygnięcie nadzorcze;
4. publikator i datę wejścia w życie;
5. czy akt był zmieniany, uchylony albo unieważniony;
6. interes prawny strony i właściwy środek zaskarżenia.

## Procedura
1. Zweryfikuj akt nadrzędny w ISAP.
2. Ustal delegację ustawową.
3. Pobierz akt lokalny z dziennika wojewódzkiego lub BIP.
4. Sprawdź publikację, vacatio legis i datę obowiązywania.
5. Sprawdź rozstrzygnięcia nadzorcze wojewody/RIO.
6. Sprawdź orzecznictwo WSA/NSA dla podobnych aktów i tej samej delegacji.
7. Oceń środek: wezwanie, skarga, wniosek do organu, skarga do WSA, zawiadomienie nadzorcze, skarga na bezczynność.

## Dowody
- tekst aktu z publikatora,
- metryka publikacyjna,
- protokół sesji / uzasadnienie / projekt,
- opinie komisji,
- konsultacje społeczne,
- korespondencja z organem,
- rozstrzygnięcie nadzorcze,
- dokumenty wykonawcze organu,
- decyzje wydane na podstawie aktu,
- dowód interesu prawnego lub naruszenia uprawnienia.

## Strategia
- Najpierw kontroluj kompetencję i delegację ustawową; to najczęstszy punkt decydujący.
- Następnie kontroluj publikację i wejście w życie.
- W sprawach lokalnych buduj argumentację na hierarchii źródeł prawa i granicach samodzielności JST.
- Przy sprawach wielowątkowych równolegle badaj ścieżkę nadzorczą i sądowoadministracyjną.
- Przy aktach indywidualno-generalnych sprawdzaj, czy organ nie użył formy aktu prawa miejscowego do rozstrzygnięcia indywidualnej sprawy albo odwrotnie.

## Ryzyka
- brak legitymacji skargowej,
- przekroczenie terminu,
- pomylenie aktu prawa miejscowego z aktem wewnętrznym,
- brak potwierdzenia publikacji,
- użycie nieaktualnej wersji aktu,
- nieuwzględnienie rozstrzygnięcia nadzorczego,
- brak wykazania interesu prawnego,
- błędna właściwość WSA.

## Orzecznictwo i praktyka
Nie cytuj orzecznictwa z pamięci. Wyszukaj aktualną linię WSA/NSA dla konkretnej delegacji ustawowej i rodzaju aktu. Oceń, czy linia dotyczy tego samego typu sprawy, tego samego organu lub tej samej materii lokalnej.

## Quality gate
Przed wygenerowaniem pisma lub analizy odpowiedz:
- czy akt jest potwierdzony w oficjalnym źródle?
- czy obowiązuje w dacie analizowanego zdarzenia?
- czy organ był właściwy?
- czy publikacja była prawidłowa?
- czy istnieje rozstrzygnięcie nadzorcze?
- czy istnieje realny interes prawny strony?
- czy dobrano właściwy środek procesowy?

## Powiązania shared
- `shared/references/modules/LOCAL-LAW-SOURCE-PROTOCOL.md`
- `shared/references/modules/LOCAL-LAW-AUDIT-GATE.md`
- `shared/references/modules/MULTI-LEVEL-POLISH-LAW-ROUTER.md`
- `shared/LEGAL-REGISTRY.md`
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`
- `shared/TEMPORAL-LAW-CHECK.md`

## Walidacja źródłowa
- Źródło podstawowe: ISAP dla ustaw i rozporządzeń ogólnokrajowych.
- Dla prawa miejscowego: właściwy wojewódzki dziennik urzędowy, BIP wojewody, BIP JST, portal dzienników wojewódzkich, rozstrzygnięcia nadzorcze wojewody i RIO.
- LEX/Legalis: wyłącznie pomocniczo przy komentarzu, orzecznictwie, praktyce lub braku stabilnego dostępu do tekstu.
- Zakaz rekonstruowania brzmienia przepisu z pamięci. Jeżeli tekstu nie da się potwierdzić, oznacz: `WYMAGA KONTROLI ŹRÓDŁOWEJ`.

## Standard głębokości
Każde użycie modułu ma działać jak moduły wzorcowe prawa pracy i karnego: intake → kwalifikacja → źródło prawa → przesłanki → procedura → dowody → ryzyka → strategia → pismo/wniosek → kontrola jakości.

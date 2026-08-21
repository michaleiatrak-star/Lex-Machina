# mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa.md — Państwowa Straż Pożarna, Ochotnicze Straże Pożarne, ochrona przeciwpożarowa

Status: moduł prawa polskiego klasy wzorcowej (poziom A wg `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`). Stan metodyczny: 2026-07-07 — naprawa WARN-29 (audyt kompletności DR-13 z 2026-07-06, sesja dedykowana). Źródła prawa muszą być każdorazowo weryfikowane w ISAP / Dzienniku Ustaw; LEX/Legalis/portale branżowe dopuszczalne wyłącznie pomocniczo.

## 1. Akty i źródła do weryfikacji
- Ustawa z dnia 24 sierpnia 1991 r. o Państwowej Straży Pożarnej — Dz.U. 2025 poz. 1312 t.j. (obwieszczenie Marszałka Sejmu 15.09.2025; VER: isap.sejm.gov.pl WDU20250001312)
- Ustawa z dnia 24 sierpnia 1991 r. o ochronie przeciwpożarowej — Dz.U. 2025 poz. 188 t.j. (obwieszczenie Marszałka Sejmu 5.02.2025; VER: isap.sejm.gov.pl WDU20250000188)
- Ustawa z dnia 17 grudnia 2021 r. o ochotniczych strażach pożarnych (OSP) — Dz.U. 2025 poz. 244 t.j. (obwieszczenie Marszałka Sejmu 21.02.2025, akt pierwotny Dz.U. 2021 poz. 2490; VER: isap.sejm.gov.pl WDU20250000244)

Uwaga architektoniczna: trzy akty w jednym module — analogicznie do mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md (wzorzec już przyjęty w DR-13 dla klastra domenowego). Ustawa o PSP i ustawa o ochronie przeciwpożarowej to DWA ODRĘBNE akty tego samego dnia (24.08.1991) — nie mylić numerów Dz.U.

Nie cytuj literalnego brzmienia przepisu bez aktualnego sprawdzenia źródła. Przed użyciem artykułu ustal:
- akt i Dz.U. (PSP vs ochrona przeciwpożarowa — łatwo pomylić, sprawdzaj zawsze którego aktu dotyczy pytanie),
- status obowiązywania i dalsze nowelizacje po t.j.,
- wersję temporalną na dzień zdarzenia,
- przepisy przejściowe,
- właściwy organ i tryb zaskarżenia.

Dz.U. 2025 poz. 1366 (zakwaterowanie funkcjonariuszy Policji/SG/PSP/ABW/AW/SKW/SWW/SOP) zmienia równolegle ustawę o PSP — weryfikuj w ISAP przed cytowaniem przepisów o zakwaterowaniu.

## 2. Zakres spraw
- status prawny i zadania PSP (formacja zawodowa, umundurowana) vs OSP (stowarzyszenie w rozumieniu Prawa o stowarzyszeniach, Dz.U. 2020 poz. 2261)
- krajowy system ratowniczo-gaśniczy (KSRG) — organizacja, dysponowanie siłami
- obowiązki właściciela/zarządcy/użytkownika budynku, obiektu, terenu w zakresie ochrony przeciwpożarowej (art. 3-4 ustawy o ochronie przeciwpożarowej)
- służba w PSP: nabór, korpusy i stopnie, prawa i obowiązki strażaków, uposażenie, mieszkania służbowe
- odpowiedzialność dyscyplinarna strażaków PSP (rozdz. 11 ustawy o PSP, art. 115-124n)
- świadczenia dla strażaków ratowników OSP (rozdz. 3 ustawy o OSP, art. 12-31) — ekwiwalent, świadczenie ratownicze, odszkodowania/renty za wypadki
- finansowanie PSP (rozdz. 2a ustawy o PSP) i OSP (rozdz. 4 ustawy o OSP)
- majątek i likwidacja OSP (rozdz. 5 ustawy o OSP, w tym odesłanie do art. 38 Prawa o stowarzyszeniach)
- relacje gmina - OSP (obowiązek zawarcia umowy, art. 7 ustawy o OSP)
- czynności kontrolno-rozpoznawcze PSP wobec obiektów (rozdz. 4 ustawy o ochronie przeciwpożarowej)
- odpowiedzialność za naruszenie przepisów przeciwpożarowych (art. 3 ust. 2 ustawy o ochronie przeciwpożarowej — odsyła do innych przepisów: KW, Prawo budowlane, prawo administracyjne)

## 3. Intake
Ustal obowiązkowo:
1. czy strona jest: (a) strażakiem PSP (stosunek służbowy, mundurowy), (b) strażakiem ratownikiem OSP (członek stowarzyszenia, nie stosunek służbowy), (c) właścicielem/zarządcą/użytkownikiem obiektu (adresat obowiązków ppoż.), (d) gminą, (e) samą jednostką OSP jako stowarzyszeniem,
2. jaki akt, czynność albo zaniechanie jest kwestionowane — i którego z trzech aktów dotyczy (łatwa pomyłka: PSP inne niż ochrona przeciwpożarowa inne niż OSP),
3. data czynności, doręczenia, powzięcia wiadomości i termin do reakcji,
4. organ pierwszej instancji (komendant powiatowy/miejski, wojewódzki, Komendant Główny PSP) i organ odwoławczy,
5. czy sprawa jest dyscyplinarna (tylko PSP — OSP nie ma reżimu dyscyplinarnego państwowego), cywilna (OSP jako stowarzyszenie), administracyjna (nadzór ppoż. nad obiektem), odszkodowawcza (wypadek strażaka OSP) albo mieszana,
6. czy istnieje dokument urzędowy: orzeczenie komisji dyscyplinarnej, protokół kontroli ppoż., decyzja/opinia komendanta, uchwała walnego zebrania OSP, umowa gmina-OSP,
7. czy zachodzi ryzyko przedawnienia dyscyplinarnego (1 rok / 2 lata od czynu — art. 119 ustawy o PSP) albo terminu odwoławczego.

## 4. Mapa proceduralna
Stosuj ścieżkę zależną od typu sprawy:

A. Dyscyplinarka strażaka PSP:
przewinienie -> czynności sprawdzające -> wniosek rzecznika dyscyplinarnego -> komisja dyscyplinarna I instancji (rozprawa, 30 dni) -> odwołanie (7 dni od wpływu) -> odwoławcza komisja dyscyplinarna -> skarga do WSA (art. 124j) -> skarga kasacyjna do NSA

Wariant uproszczony: przewinienie mniejszej wagi -> kara upomnienia przez przełożonego dyscyplinarnego (do 3 miesięcy od powzięcia wiadomości, art. 118) -> odwołanie do komisji dyscyplinarnej (bez reformationis in peius) -> linia orzecznicza NSA/WSA potwierdza dopuszczalność skargi do sądu administracyjnego również na tym etapie.

B. Obowiązki ppoż. właściciela obiektu:
kontrola/czynność kontrolno-rozpoznawcza PSP -> protokół -> decyzja/nakaz usunięcia nieprawidłowości -> odwołanie w trybie KPA (o ile decyzja administracyjna) -> WSA/NSA — UWAGA: art. 7b ustawy o ochronie przeciwpożarowej wyłącza KPA dla dopuszczeń i opinii (nie dla wszystkich aktów!) — sprawdzaj każdorazowo charakter aktu.

C. Świadczenia/wypadek strażaka ratownika OSP:
zdarzenie -> zgłoszenie -> ustalenie prawa do świadczenia odszkodowawczego/renty (analogicznie do strażaków PSP, przez komendanta wojewódzkiego PSP jako organ wypłacający) -> odwołanie w trybie właściwym dla świadczenia

D. Spory wewnątrz OSP (stowarzyszenie):
uchwała organu OSP -> zaskarżenie w trybie Prawa o stowarzyszeniach i statutu OSP -> sąd rejestrowy (KRS) / sąd cywilny, NIE sąd administracyjny — status stowarzyszeniowy oznacza, że tryb administracyjny/dyscyplinarny państwowy NIE ma zastosowania do wewnętrznych sporów OSP, co jest częstym błędem kwalifikacyjnym.

W sprawach ppoż. zawsze rozważ równolegle:
- odpowiedzialność wykroczeniową (Kodeks wykroczeń — DR-03, art. 3 ust. 2 ustawy o ochronie przeciwpożarowej odsyła do "innych przepisów"),
- odpowiedzialność z Prawa budowlanego przy naruszeniach techniczno-budowlanych (DR-09),
- odpowiedzialność cywilną (art. 415/435 KC) za szkodę pożarową,
- ochronę ludności i obronę cywilną jako reżim równoległy (OSP są też podmiotami ochrony ludności — DR-13/mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna).

## 5. Warunki skuteczności
Sprawdź:
- termin (dyscyplinarny: 3 mies. upomnienie / 7 dni odwołanie / przedawnienie 1-2 lata; administracyjny: KPA ogólne, o ile stosowane),
- właściwość organu/sądu (komendant powiatowy vs wojewódzki vs Komendant Główny — zależnie od szczebla),
- legitymację (strażak PSP / strażak ratownik OSP / obrońca / rzecznik dyscyplinarny / właściciel obiektu),
- w postępowaniu dyscyplinarnym: prawo do obrońcy (strażak, adwokat lub radca prawny — art. 124a),
- podpis, pełnomocnictwo, opłatę, odpisy, załączniki, dowód doręczenia,
- dla OSP: zgodność ze statutem i Prawem o stowarzyszeniach (nie z reżimem służb mundurowych).

## 6. Matryca dowodowa
Dla każdego faktu zbuduj tabelę:

| Fakt | Dowód | Źródło | Siła | Luka | Ryzyko |
|---|---|---|---|---|---|

Typowe dowody:
- orzeczenia i protokoły komisji dyscyplinarnych PSP, uzasadnienia (art. 124e — na piśmie w 7 dni),
- protokoły kontroli/czynności kontrolno-rozpoznawczych PSP wobec obiektu,
- dokumentacja szkoleniowa strażaka ratownika OSP (art. 8-11 ustawy o OSP — warunek dopuszczenia do działań ratowniczych),
- umowa gmina-OSP (art. 7 ustawy o OSP) i ewidencja majątku OSP (art. 35),
- dokumentacja medyczna przy wypadku strażaka (renty/odszkodowania),
- zeznania świadków, nagrania, dokumentacja techniczna obiektu (przeglądy urządzeń ppoż.),
- wydruki z BIP, ewidencji komendanta powiatowego sił i środków OSP (art. 5 ustawy o OSP).

## 7. Zarzuty typowe
Rozważ co najmniej:
- naruszenie właściwości organu/komisji dyscyplinarnej,
- brak podstawy prawnej albo błędna kwalifikacja aktu (PSP zamiast OSP lub odwrotnie),
- przedawnienie odpowiedzialności dyscyplinarnej (art. 119) pominięte przez organ,
- naruszenie prawa do obrony (brak obrońcy, brak wysłuchania),
- dowolna ocena dowodów / brak uzasadnienia (art. 124e),
- pominięcie stosowania KPK odpowiednio (art. 124n) w postępowaniu dyscyplinarnym,
- błędne zamknięcie drogi sądowej mimo art. 124j (linia orzecznicza NSA/WSA: skarga do WSA przysługuje na KAŻDE orzeczenie kończące postępowanie w II instancji, w tym na tryb uproszczony z art. 118 — nie tylko na "pełne" postępowanie dyscyplinarne),
- błędna kwalifikacja sporu wewnątrz OSP jako sprawy administracyjnej/dyscyplinarnej zamiast cywilnej/stowarzyszeniowej,
- nieproporcjonalność nakazu ppoż. wobec właściciela obiektu, brak rozważenia alternatywnych środków.

## 8. Kontrargumenty organu / strony przeciwnej
Przewiduj:
- formalny brak legitymacji albo spóźnienie środka,
- domniemanie prawidłowości protokołu kontroli / orzeczenia dyscyplinarnego,
- bezpieczeństwo publiczne i ochrona życia/zdrowia jako uzasadnienie rygoru,
- dla OSP: zarzut niewłaściwej drogi (próba wciągnięcia sporu wewnątrzstowarzyszeniowego w tryb administracyjny),
- uznaniowość organu przy ocenie zagrożenia pożarowego,
- brak szkody albo związku przyczynowego przy odpowiedzialności odszkodowawczej.

## 9. Strategia
Priorytety:
1. ustal precyzyjnie, KTÓREGO aktu i KTÓREGO statusu (PSP / OSP / właściciel obiektu) dotyczy sprawa — błąd na tym etapie rzutuje na całą dalszą kwalifikację,
2. zabezpiecz termin i dowód doręczenia (szczególnie 7-dniowe terminy w postępowaniu dyscyplinarnym PSP),
3. uzyskaj pełne akta postępowania dyscyplinarnego / kontroli ppoż.,
4. oddziel zarzuty formalne od materialnych,
5. dla strażaka OSP w sprawie świadczeniowej — ustal właściwego komendanta wojewódzkiego PSP jako organ wypłacający,
6. dla sporu wewnątrz OSP — skieruj na właściwą drogę (stowarzyszeniowa/cywilna), nie administracyjną,
7. oceń, czy korzystniejsze jest: uchylenie orzeczenia dyscyplinarnego, stwierdzenie przedawnienia, skarga do WSA, czy droga cywilna odszkodowawcza.

## 10. Orzecznictwo
Nie wpisuj fikcyjnych sygnatur. Szukaj tylko realnych orzeczeń w:
- CBOSA (WSA/NSA — szczególnie liczne orzeczenia ws. art. 124j i dopuszczalności skargi po karze upomnienia, np. linia utrwalona po uchwale NSA w składzie 7 sędziów),
- Portalu Orzeczeń Sądów Powszechnych,
- SN — w zakresie odpowiedzialności cywilnej za szkodę pożarową,
- LEX/Legalis pomocniczo.

Każde orzeczenie oceniaj według: aktualność, hierarchia sądu, analogiczność stanu faktycznego (PSP vs OSP — to różne reżimy, orzecznictwo dot. PSP NIE przenosi się automatycznie na OSP), linia dominująca/odmienna.

## 11. Ryzyka
Oceń:
- ryzyko błędnej kwalifikacji aktu (PSP/ochrona przeciwpożarowa/OSP pomylone — trzy różne Dz.U. tego samego dnia dla dwóch pierwszych aktów),
- ryzyko przedawnienia dyscyplinarnego przeoczonego przez organ,
- ryzyko niewłaściwej drogi sądowej (administracyjna zamiast cywilnej dla sporu OSP),
- ryzyko spóźnienia (terminy 3 mies./7 dni są krótkie),
- ryzyko braku legitymacji,
- ryzyko kosztowe (koszty komisji dyscyplinarnej ponosi Skarb Państwa — art. 124g, ale koszty sądowoadministracyjne już nie),
- ryzyko równoległych postępowań (dyscyplinarne + karne/wykroczeniowe za ten sam czyn — art. 116 ustawy o PSP: niezależność odpowiedzialności).

## 12. Quality gate
Przed odpowiedzią lub pismem zastosuj:
- shared/POLISH-LAW-FINAL-COMPLETENESS-GATE.md,
- shared/ISAP-AUDIT-PROTOCOL.md,
- shared/TEMPORAL-LAW-CHECK.md,
- shared/LEGAL-QUALITY-GATE.md,
- shared/RISK-ASSESSMENT.md, jeżeli istnieje,
- shared/FORMAL-CHECK.md, jeżeli powstaje pismo,
- shared/ORZECZENIA-HIERARCHIA.md §4.2 (PSP — dyscyplinarka) / §4.3 (OSP — status stowarzyszeniowy) przed powołaniem właściwości sądu.

---

## KLUCZOWE AKTY — ZWERYFIKOWANE 2026-07-07 (naprawa WARN-29)

```
Ustawa o Państwowej Straży Pożarnej: Dz.U. 2025 poz. 1312 t.j. (ustawa z 24.08.1991,
  obwieszczenie 15.09.2025, weszła w życie 30.09.2025) — weryfikuj dalsze zm. w ISAP
  VER: isap.sejm.gov.pl WDU20250001312
  Organy: Komendant Główny PSP -> komendant wojewódzki -> komendant powiatowy (miejski)
  Rozdz. 11 (art. 115-124n) — odpowiedzialność dyscyplinarna strażaków:
    -> przedawnienie: 1 rok od czynu / 2 lata od wszczęcia postępowania (art. 119)
    -> kara upomnienia (przewinienie mniejszej wagi): przełożony dyscyplinarny, do 3 mies.
       od powzięcia wiadomości (art. 118) — odwołanie do komisji dyscyplinarnej,
       zakaz reformationis in peius
    -> postępowanie I instancji: rozprawa, zakończenie w 30 dni (art. 124b)
    -> odwołanie: 7 dni do rozpoznania przez odwoławczą komisję dyscyplinarną (art. 124f)
    -> skarga do sądu administracyjnego na orzeczenie kończące postępowanie w II instancji
       (art. 124j) — linia orzecznicza NSA (uchwała 7 sędziów) potwierdza dopuszczalność
       również dla trybu uproszczonego z art. 118
    -> KPK stosowany odpowiednio (art. 124n)
    -> wznowienie na niekorzyść ukaranego: do 10 lat, gdy ujawniono przestępstwo (art. 124k i n.)

Ustawa o ochronie przeciwpożarowej: Dz.U. 2025 poz. 188 t.j. (ustawa z 24.08.1991,
  obwieszczenie 5.02.2025) — WERYFIKUJ dalsze zmiany w ISAP przed cytowaniem
  VER: isap.sejm.gov.pl WDU20250000188
  UWAGA: ten sam dzień uchwalenia (24.08.1991) co ustawa o PSP, ale ODRĘBNY akt
     i odrębny Dz.U. — nie mylić numerów.
  Art. 3-4 — obowiązki właściciela/zarządcy/użytkownika budynku, obiektu, terenu:
    wymagania techniczno-budowlane, urządzenia ppoż. i gaśnice, przeglądy/konserwacja,
    ewakuacja, przygotowanie do akcji ratowniczej, zapoznanie pracowników, plan postępowania
  Art. 3 ust. 2 — odpowiedzialność za naruszenie przepisów ppoż. "w trybie i na zasadach
    określonych w innych przepisach" -> odsyła do KW (DR-03), Prawa budowlanego (DR-09),
    prawa administracyjnego ogólnego — NIE zawiera własnego reżimu sankcyjnego
  Art. 7b — wyłączenie KPA dla dopuszczeń i opinii (NIE dla wszystkich aktów — sprawdzaj
    charakter konkretnego aktu przed przyjęciem trybu)
  KSRG (krajowy system ratowniczo-gaśniczy) — nadzór ministra właściwego ds. wewnętrznych
  Jednostki ochrony przeciwpożarowej (art. 15) — PSP, Wojskowa Ochrona Przeciwpożarowa, OSP i in.

Ustawa o ochotniczych strażach pożarnych (OSP): Dz.U. 2025 poz. 244 t.j. (ustawa
  z 17.12.2021, akt pierwotny Dz.U. 2021 poz. 2490, obwieszczenie 21.02.2025)
  VER: isap.sejm.gov.pl WDU20250000244
  STATUS PRAWNY KLUCZOWY: OSP = stowarzyszenie w rozumieniu Prawa o stowarzyszeniach
    (Dz.U. 2020 poz. 2261) — NIE jest służbą mundurową, NIE ma państwowego reżimu
    dyscyplinarnego. Strażacy ratownicy OSP nie są w stosunku służbowym.
    (patrz shared/ORZECZENIA-HIERARCHIA.md §4.3)
  Art. 7 — gmina obowiązana zawrzeć umowę ze wszystkimi OSP na jej terenie
  Art. 5-6 — komendant powiatowy (miejski) prowadzi ewidencję sił/środków OSP;
    komendant wojewódzki zapewnia wsparcie
  Rozdz. 3 (art. 12-31) — świadczenia dla strażaków ratowników OSP: ekwiwalent pieniężny,
    świadczenie ratownicze, odszkodowania/renty za wypadek — wypłacane przez komendanta
    wojewódzkiego PSP na zasadach analogicznych do strażaków PSP (ustawa z 2014 r.
    o świadczeniach odszkodowawczych — weryfikuj osobno w ISAP)
  Rozdz. 4 (art. 32-34) — finansowanie: dotacje na wniosek OSP/związku OSP do Komendanta
    Głównego PSP za pośrednictwem komendanta powiatowego
  Rozdz. 5 (art. 35-36) — majątek i ewidencja; likwidacja OSP -> art. 38 Prawa
    o stowarzyszeniach (NIE przepisy o PSP)
  Art. 31 — możliwość łączenia funkcji: wójt/burmistrz/radny może być członkiem władz OSP
  Młodzieżowe/dziecięce drużyny pożarnicze (art. 4) — osoby do 18 lat za zgodą opiekuna

Powiązane akty do weryfikacji przy konkretnej sprawie (NIE w tym module — osobne akty):
  -> Ustawa o ochronie ludności i obronie cywilnej (Dz.U. 2024 poz. 1907 ze zm.) — OSP jako
     podmioty ochrony ludności (patrz mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna)
  -> Ustawa o zakwaterowaniu funkcjonariuszy (Dz.U. 2025 poz. 1366) — zmienia równolegle PSP
  -> Kodeks wykroczeń art. 82 i n. (wykroczenia przeciwpożarowe) — DR-03
  -> Prawo budowlane — sankcje techniczno-budowlane — DR-09
  -> Ustawa z 2014 r. o świadczeniach odszkodowawczych w razie wypadku/choroby związanej
     ze służbą — weryfikuj aktualny t.j. osobno przed cytowaniem stawek/trybu
```

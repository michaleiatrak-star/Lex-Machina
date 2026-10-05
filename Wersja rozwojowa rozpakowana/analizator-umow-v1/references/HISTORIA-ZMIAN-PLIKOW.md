# Historia zmian plików — analizator-umow-v1

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## references/poufnosc-nda.md (przeniesione 2026-10-04n)

## CHANGELOG

**2026-07-30:** Utworzono Moduł K (poufność/NDA) w toku zewnętrznej analizy
porównawczej klauzul kontraktowych. Wypełnia lukę: system dotychczas nie miał
dedykowanego modułu eksperckiego dla poufności, mimo że jest to klauzula niemal
tak powszechna jak zakaz konkurencji (Moduł I), na wzór którego zbudowano
strukturę (mapa prawna, test ważności, pułapki, checklista, szablon, scoring,
złote zasady). Wprowadzono rozróżnienie dwóch podstaw ochrony (klauzula
kontraktowa vs tajemnica przedsiębiorstwa z art. 11 UZNK) jako centralną
zasadę modułu (K.1, Pułapka K-6) — nieobecne w źródłowym dokumencie
porównawczym, który tego rozróżnienia nie zawierał. Zintegrowano z istniejącymi
modułami: `mod-shared-economic.md` (OEK.3, OEK.3a, OEK.5, OEK.5a — kalkulacja
kar i limitów), `mod-shared-rodo.md` (spójność terminów notyfikacji przy
jednoczesnym DPA — Pułapka K-7). Wymaga integracji routingu w SKILL.md,
mod-J0-routing.md i punktowych odesłań z innych modułów (b2b-podwykonawcze.md,
mod-J6-it-konsorcjum.md, mod-FA-founders-dokumenty-zalozycielskie.md,
mod-core-checklist.md, triage-szybki.md) — patrz wpisy w tych plikach z tą
samą datą.


## references/zakaz-konkurencji.md (przeniesione 2026-10-04n)

## CHANGELOG

**2026-07-30b:** Uzupełniono sekcję I.1a o pełną, zweryfikowaną treść tezy SN II CSK
58/18 (zweryfikowano bezpośrednio na sn.pl, nie tylko streszczenie wtórne) — test
"skutku dławiącego" jako CAŁOŚCIOWA OCENA czterech czynników łącznie (zakres
działalności dłużnika, zakres przedmiotowo-podmiotowo-geograficzno-czasowy zakazu,
surowość sankcji, dodatkowe korzyści dłużnika), nie ocena samej odpłatności w
oderwaniu od kontekstu. Potwierdzono na SAOS istnienie i metadane orzeczenia SN
IV CSK 658/12 (23.05.2013) jako współźródła nurtu liberalnego, spójnie cytowanego
w wielu niezależnych źródłach. Pełna treść uzasadnienia IV CSK 658/12 pozostaje
oznaczona jako wymagająca dalszej weryfikacji przed dosłownym cytowaniem tezy w
piśmie procesowym (na tym etapie zweryfikowano istnienie orzeczenia i zgodność
cytowanej tezy między niezależnymi źródłami, nie sam pełny tekst uzasadnienia z
sn.pl/SAOS). Usunięto adnotacje "DO SAMODZIELNEJ WERYFIKACJI" tam, gdzie pełna
weryfikacja została już wykonana w tej rundzie.

**2026-07-30:** Dodano sekcję I.1a (orzecznictwo B2B — nurt przeważający vs granica
proporcjonalności) i Pułapkę ZK-11 (non-solicitation myloną z zakazem konkurencji),
w toku zewnętrznej analizy porównawczej klauzul kontraktowych innego podmiotu.
Zweryfikowano bezpośrednio na oficjalnych portalach orzeczeń (nie z pamięci, nie
z wtórnych źródeł): SN V CSK 30/13 (sn.pl), SA Białystok I ACa 219/17
(orzeczenia.bialystok.sa.gov.pl), SA Łódź I ACa 1755/16 (SAOS), SA Kraków I ACa
467/18 (orzeczenia.krakow.sa.gov.pl), SN II CSK 58/18 (fragment na sn.pl, pełna
treść do dalszej weryfikacji). Istotna korekta względem wstępnego, roboczego
odczytu wtórnego źródła: SA Kraków I ACa 467/18 NIE reprezentuje odrębnego,
surowszego nurtu orzeczniczego — sąd w uzasadnieniu tej sprawy sam potwierdza,
że pogląd liberalny (dopuszczający nieodpłatny zakaz B2B) jest "przeważający
obecnie w judykaturze"; niekorzystne dla strony rozstrzygnięcie wynikało ze
specyfiki stanu faktycznego (pozorny ekwiwalent), nie z odrzucenia zasady
swobody umów. Zaktualizowano wskazówkę do scoringu I.6: dla B2B nie stosować
automatycznie surowości reżimu UoP (gdzie brak odszkodowania = nieważność
automatyczna) — właściwym testem jest proporcjonalność z II CSK 58/18.
Rozszerzono nagłówek "Wczytaj ten moduł gdy" o non-solicitation. ZK-11 wypełnia
lukę: moduł dotychczas nie zawierał odrębnej analizy tej instytucji, mimo że
jest ona powszechnie stosowana i myloną z zakazem konkurencji w praktyce
kontraktowej (w tym w dokumentach źródłowych, które zainicjowały tę analizę).

**2026-07-18:** Dodano Pułapkę ZK-10 (zakaz obejmujący działalność
MARGINALNĄ lub FAKTYCZNIE NIEPROWADZONĄ przez firmę — rozbieżność między
formalnym wykazem PKD/KRS a rzeczywistym zakresem działalności) na
wyraźne pytanie użytkownika. Odrębna od Pułapki ZK-1 (tam: NIEJASNOŚĆ
definicji; tu: definicja MOŻE być precyzyjna, ale NIEPROPORCJONALNA do
realnej skali działalności). Zweryfikowano online: rp.pl — zasada, że
zakres zakazu należy określać na podstawie działalności FAKTYCZNIE
prowadzonej, nie samych kodów PKD; zakaz-konkurencji.pl — praktyczny
problem spółek deklarujących "kilkadziesiąt kodów PKD"; test
konkurencyjności (ten sam rynek + ten sam obszar, kryteria łączne);
doktrynalne określenie "umowy kneblujące/dławiące" w kontekście B2B
(ocena całościowa proporcji). Odnotowano UCZCIWIE rozbieżność w
orzecznictwie: sąd II instancji w jednej sprawie przyjął szerokie
podejście ("choćby jeden rynek się pokrywa"), ale ta sama sprawa w SN
skrytykowała odwołanie do "wszelkiej działalności z KRS" jako zbyt
ogólne — zalecono argumentację dwutorową (ZK-1 + ZK-10 łącznie).
Zaktualizowano KROK 2 i scoring ZAKRES o odesłania.

**2026-07-17:** Dodano Pułapkę ZK-9 (zakaz BEZTERMINOWY / brak wskazanego
okresu — nieważność AUTOMATYCZNA, odrębna od zwykłego "zbyt długiego"
zakazu podlegającego ocenie proporcjonalności) na wyraźne pytanie
użytkownika o zakaz bez ograniczenia czasowego. Zweryfikowano online:
SN, wyrok z 2.10.2003, sygn. I PK 453/02 (MoP 2004/10/1) — brak
wskazania okresu = zakaz w ogóle nie powstał. Doprecyzowano też (przy
tej samej weryfikacji) niuans B2B: sama nieekwiwalentność/brak
wynagrodzenia NIE wystarcza do nieważności zakazu między
przedsiębiorcami (orzecznictwo SN dot. zasady swobody umów, art. 353¹
KC) — inaczej niż w reżimie KP, gdzie brak odszkodowania wystarcza sam
w sobie. Zaktualizowano KROK 4, Złotą Zasadę 2, scoring I.6 i checklistę
I.4.1 o odesłania do nowej pułapki. Pozostałe trzy scenariusze z pytania
użytkownika (zakaz ogólnoświatowy, zakaz bezpłatny, zakaz ukryty pod
UZNK/tajemnicą przedsiębiorstwa) były JUŻ w pełni pokryte przed tą
aktualizacją (KROK 3, Zasada 1, Pułapka ZK-8) — potwierdzono bez zmian.

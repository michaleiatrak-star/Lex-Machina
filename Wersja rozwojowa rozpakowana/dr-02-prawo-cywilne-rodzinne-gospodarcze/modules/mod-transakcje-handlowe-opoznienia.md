---
module: transakcje-handlowe-opoznienia
version: "1.1"
verified_on: "2026-08-27"
coverage: "B+ — rdzeń cywilny + workflow UOKiK + temporalność 2013/2022/2023"
---

# Transakcje handlowe — opóźnienia, odsetki i rekompensata

## 1. Zakres i źródło

Ustawa z 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom
w transakcjach handlowych; t.j. Dz.U. 2023 poz. 1790.
[Metryka ELI](https://eli.gov.pl/eli/DU/2023/1790/ogl) {RZĄD: 1};
[tekst urzędowy](https://eli.gov.pl/api/acts/DU/2023/1790/text.html) {RZĄD: 1}.
Metrykę, treść wskazanych niżej jednostek i sześć obwieszczeń odczytano
27.08.2026. Jest to zapis wykonanej kontroli, NIE zwolnienie z HARD GATE:
przy zastosowaniu ponownie odczytaj przepis i każde potrzebne obwieszczenie.

**Historia/aktualność — zweryfikowana warstwa operacyjna:** ELI dla aktu
pierwotnego potwierdza wcześniejszy tytuł „ustawa o terminach zapłaty w
transakcjach handlowych”, wejście w życie 28.04.2013 oraz istnienie aktów
zmieniających. Tekst jednolity Dz.U. 2023 poz. 1790 uwzględnia zmianę
Dz.U. 2023 poz. 852; wcześniejszy t.j. Dz.U. 2023 poz. 711 dokumentuje
nowelizację Dz.U. 2022 poz. 2414. Dla zdarzeń historycznych stosuj sekcję 11A
poniżej i `shared/TEMPORAL-LAW-CHECK.md`.

## 2. Uruchomienie i wymagane dane

Uruchom przy zapłacie za towar/usługę między podmiotami zawodowymi,
odsetkach handlowych, ryczałcie 40/70/100 EUR lub zatorach płatniczych.
Zbierz: datę zawarcia/zmiany umowy; status obu stron; umowę i zamówienia;
wykonanie świadczenia; datę doręczenia faktury; odbiór/badanie towaru;
uzgodniony termin; kwotę i walutę; daty częściowych zapłat; żądany okres.
Nieznanej dacie/statusowi nadaj **NIEUSTALONE**, nie przyjmuj ich domyślnie.

## 3. Kwalifikacja podmiotowa i wyłączenia — art. 1–4c

1. Ustal, czy obie strony należą do katalogu art. 2, a umowa jest odpłatną
   dostawą towaru lub świadczeniem usługi w związku z działalnością (art. 4 pkt 1).
   Sama faktura ani napis „B2B” nie dowodzą wszystkich przesłanek.
2. Sprawdź wyłączenia art. 3: długi objęte postępowaniem upadłościowym od dnia
   ogłoszenia upadłości, a restrukturyzacyjnym od dnia jego otwarcia;
   czynności bankowe oraz umowy wyłącznie
   między jednostkami sektora finansów publicznych. Odrzuć reżim ustawy,
   jeżeli zachodzi wyłączenie; wskaż właściwy moduł KC/upadłościowy.
3. Status publiczny ustal przez art. 4 pkt 2 i właściwe odesłanie do PZP.
   Status MŚP/dużego przedsiębiorcy wymaga kryteriów wskazanego w art. 4
   załącznika I do rozporządzenia 651/2014; sam wpis CEIDG/KRS nie wystarcza.
   Nie wyliczaj progów ani powiązań z pamięci — odczytaj załącznik.
4. Niższa stopa dotyczy wyłącznie dłużnika **publicznego będącego podmiotem
   leczniczym** w ustawowym rozumieniu art. 4 pkt 4. Inny publiczny dłużnik
   oraz prywatny podmiot leczniczy należą do kolumny „pozostali”.
5. Zbadaj oświadczenie dużego przedsiębiorcy (art. 4c); jego brak lub błędne
   oświadczenie MŚP nie zastępują ustalenia rzeczywistego statusu (art. 4b).

## 4. Wybór podstawy i terminu — art. 5–9

| Stan | Reguła operacyjna | Jednostka |
|---|---|---|
| Uzgodniony termin ponad 30 dni, wierzyciel nie jest dużym przedsiębiorcą | Zbadaj odsetki ustawowe po 30 dniach od wykonania i doręczenia faktury do wymagalności; to NIE stopa handlowa. Wyłącz publiczny podmiot leczniczy | art. 5 |
| Brak uzgodnionego terminu | Odrębna przesłanka odsetek handlowych po 30 dniach od wykonania; przy badaniu zgodności uwzględnij jego zakończenie | art. 6 |
| Dłużnik niepubliczny | Wykonanie przez wierzyciela i brak zapłaty w terminie → odsetki od wymagalności do zapłaty. Co do zasady termin do 60 dni od doręczenia faktury; dłuższy tylko wyraźnie uzgodniony i nierażąco nieuczciwy | art. 7 ust. 1–2 |
| Duży dłużnik, wierzyciel MŚP | Termin nie może przekroczyć 60 dni; sprawdź również każdą ratę | art. 7 ust. 2a |
| Dłużnik publiczny | Limit 30 dni; dla publicznego podmiotu leczniczego 60 dni; wykonanie i brak terminowej zapłaty są przesłankami odsetek | art. 8 |
| Faktura przed towarem/usługą lub nieustalona data doręczenia | Zastosuj ustawowy punkt początkowy oparty na odbiorze, nie wymyślaj daty faktury | art. 7 ust. 4; art. 8 ust. 5 |
| Badanie zgodności | Maksymalnie 30 dni i zakaz rażącej nieuczciwości; faktura przed badaniem/w jego toku wymaga przesunięcia początku liczenia terminu | art. 9 |

Nie utożsamiaj limitu płatności z okresem naliczania odsetek. Ustal osobno
datę wymagalności i pierwszy dzień konkretnego roszczenia; stosuj właściwy
ustęp art. 5, 6, 7 lub 8. Nie przenoś automatycznie reguł wezwania z KC.
Strony nie mogą umownie ustalać fikcyjnej daty doręczenia faktury (art. 8a).
Przy terminie sprzecznym z ustawą uwzględnij art. 7 ust. 3, art. 8 ust. 4–4a
i art. 13: dla publicznego dłużnika odpowiednio 30/60 dni, nie ogólne 60.
Przy terminie ponad 120 dni zbadaj dodatkowo uprawnienie do zakończenia
umowy i jego przesłanki z art. 7 ust. 3a–3b; samo przekroczenie 120 dni
nie wystarcza bez pozostałych warunków.

## 5. Pełny szereg stawek dla zakresu 2024–2026 — art. 4 pkt 3, art. 11b–11c

Stopy procentowe rocznie. W każdym wierszu zweryfikowano oba warianty.
Są to odsetki USTAWOWE za opóźnienie w transakcjach handlowych, nie
odsetki kapitałowe ani każda umowna stopa; odrębnie zbadaj umowę i jej granice.

| Od | Do | Publiczny i leczniczy (%) | Pozostali (%) | Urzędowe źródło |
|---|---|---:|---:|---|
| 2024-01-01 | 2024-06-30 | 13,75 | 15,75 | [M.P. 2023 poz. 1465](https://eli.gov.pl/eli/MP/2023/1465/ogl/pol/pdf) {RZĄD: 1} |
| 2024-07-01 | 2024-12-31 | 13,75 | 15,75 | [M.P. 2024 poz. 546](https://eli.gov.pl/eli/MP/2024/546/ogl/pol/pdf) {RZĄD: 1} |
| 2025-01-01 | 2025-06-30 | 13,75 | 15,75 | [M.P. 2024 poz. 1106](https://eli.gov.pl/eli/MP/2024/1106/ogl/pol/pdf) {RZĄD: 1} |
| 2025-07-01 | 2025-12-31 | 13,25 | 15,25 | [M.P. 2025 poz. 602](https://eli.gov.pl/eli/MP/2025/602/ogl/pol/pdf) {RZĄD: 1} |
| 2026-01-01 | 2026-06-30 | 12,00 | 14,00 | [M.P. 2025 poz. 1257](https://eli.gov.pl/eli/MP/2025/1257/ogl/pol/pdf) {RZĄD: 1} |
| 2026-07-01 | 2026-12-31 | 11,75 | 13,75 | [M.P. 2026 poz. 642](https://eli.gov.pl/eli/MP/2026/642/ogl/pol/pdf) {RZĄD: 1} |

**STOP poza zakresem:** data przed 01.01.2024 albo po 31.12.2026 = LUKA;
pozyskaj kolejne obwieszczenia. Nie ekstrapoluj stopy z sąsiedniego okresu.
Nie zmieniaj stopy w środku półrocza tylko dlatego, że RPP zmieniła stopę:
ustawa wskazuje stany na 1 stycznia/1 lipca. Odrębnie kontroluj zmianę prawa.

## 6. Obliczenie odsetek

Wykonaj `view shared/RATE-COMPLETENESS.md`. Przetnij żądany przedział
granicami półroczy, zmianami kapitału i ewentualnymi zmianami reżimu.
Dla każdego odcinka pokaż: kapitał, pierwszy/ostatni dzień, liczbę dni,
stopę, konwencję rachunkową i wynik. Uzasadnij uwzględnienie dnia zapłaty,
podzielności świadczeń oraz zaliczenia częściowych wpłat; brak danych blokuje
wynik końcowy. Nie sumuj odsetek kapitałowych i za opóźnienie za ten sam
okres bez odrębnej podstawy. Nie kapitalizuj automatycznie odsetek.
Użyj kalkulatora/kodu z jawnymi danymi, nie rachunku wyłącznie w narracji.
Odcinki po dacie analizy są prognozą warunkową, nie już powstałą zaległością.

## 7. Rekompensata — art. 10–11

Od nabycia uprawnienia do odsetek z art. 7 ust. 1 lub art. 8 ust. 1,
bez wezwania, zbadaj rekompensatę za koszty odzyskiwania należności:

| Wartość świadczenia pieniężnego | Ryczałt |
|---|---:|
| Do 5 000 zł włącznie | 40 EUR |
| Powyżej 5 000 zł i poniżej 50 000 zł | 70 EUR |
| Od 50 000 zł włącznie | 100 EUR |

Równowartość EUR przelicz po średnim kursie NBP ogłoszonym w **ostatnim dniu
roboczym miesiąca poprzedzającego miesiąc wymagalności**. Odczytaj właściwą
tabelę NBP; data wystawienia faktury, data pozwu i bieżący kurs nie są zamienne.
Waluta długu inna niż PLN wymaga osobnego, uzasadnionego ustalenia wartości
do progów — nie używaj bez uzasadnienia kursu służącego przeliczeniu EUR.
Ryczałt wiąż z transakcją, nie automatycznie z każdą fakturą. Przy prawidłowo
uzgodnionych ratach sprawdź art. 11 ust. 2. Nie dubluj rekompensaty za tę samą
podstawę. Roszczenie o rekompensatę nie podlega zbyciu (art. 10 ust. 4).
Ponad ryczałt udokumentuj uzasadnione koszty odzyskania, w części go
przewyższającej (art. 10 ust. 2). Art. 6 sam nie jest wskazany w art. 10
ust. 1 — nie przyznawaj ryczałtu wyłącznie na tej podstawie bez analizy.

## 8. Postanowienia umowne i zarzuty — art. 9a, 11a, 13

Sprawdź ważność wyłączeń/ograniczeń uprawnień wierzyciela oraz obejścia ustawy.
Przy terminie ponad 60 dni ciężar wykazania braku rażącej nieuczciwości
spoczywa na dłużniku (art. 11a); badaj okoliczności, nie sam podpis wierzyciela.
Przy MŚP jako wierzycielu i dużym dłużniku zbadaj bezskuteczność zakazu
przelewu po braku zapłaty, z wyłączeniem publicznego dłużnika (art. 9a).
Nie utożsamiaj tego ze zbywalnością rekompensaty.
Przedawnienie długu i odsetek ustal według podstawy roszczenia i historii;
ustawa nie daje jednego uniwersalnego terminu dla wszystkich należności.
Oceniaj zarzuty niewykonania, wad, potrącenia, zapłaty, niewłaściwego statusu
i podziału jednej transakcji. Nadużycie prawa wymaga indywidualnej analizy
i aktualnego orzecznictwa; nie przyjmuj automatycznego oddalenia ryczałtu.

## 9. Dowody i droga dochodzenia

Mapa roszczenia: transakcja → wykonanie → doręczenie → termin → zaległość
→ status dłużnika → stawki → rekompensata/koszty → dowód każdej przesłanki.
Dołącz umowę/zamówienie, protokół wykonania, dowód doręczenia, historię wpłat,
dokumenty statusowe oraz źródła stóp/kursu. Faktura nie zastępuje dowodu sporu
co do wykonania. Właściwość, tryb pozwu i opłaty: właściwe moduły KPC/KSCU,
nie procedura UOKiK. Uprawnienia organizacji z art. 12 sprawdź osobno.
Wezwanie do zapłaty i pozew przekazuj do właściwego skilla pism wraz
z tabelą podstaw i dat, a nie tylko sumą.

## 10. Gałąź publicznoprawna — workflow art. 13a–13y

### 10.1 Raportowanie — art. 13a, 13aa, 13ab

Najpierw ustal, czy podmiot należy do katalogu z art. 13a ust. 1. Obowiązek
nie dotyczy automatycznie każdego dużego przedsiębiorcy. Ustawa odsyła do
publicznego wykazu podatników CIT i przewiduje wyłączenia, w tym określone
podmioty lecznicze.

**Termin:** sprawozdanie przekazuje się elektronicznie do ministra właściwego
do spraw gospodarki do **30 kwietnia** roku następującego po roku, w którym
indywidualne dane podmiotu zostały podane do publicznej wiadomości.

W sprawozdaniu nie uwzględnia się m.in.:
- określonych transakcji ubezpieczeniowych/reasekuracyjnych;
- transakcji wyłącznie wewnątrz tej samej grupy kapitałowej;
- świadczeń, dla których upłynął termin przedawnienia.

Raport rozbija świadczenia otrzymane/spełnione po terminie na przedziały
opóźnienia: ≤5 dni, 6–30, 31–60, 61–120 i >120 dni oraz pokazuje udziały
procentowe. Waluty obce przelicza się według zasad rachunkowości danego
podmiotu.

**Korekta:** art. 13aa wymaga korekty z uzasadnieniem, gdy co najmniej jedna
pozycja zmieniła się o co najmniej 10%, z uwzględnieniem wyjątku art. 13ab.
Art. 13ab kieruje późniejsze zmiany wartości do sprawozdania za rok, w którym
świadczenie w zmienionej wartości jest wymagalne.

### 10.2 Zakaz zatorów — art. 13b

Zakazane jest nadmierne opóźnianie przez podmiot z art. 2 niebędący podmiotem
publicznym. Próg ustawowy jest spełniony, gdy w **3 kolejnych miesiącach**
suma wymagalnych świadczeń niespełnionych i spełnionych po terminie wynosi
co najmniej **2 000 000 zł**.

Przy obliczeniu:
- walutę obcą przelicz według właściwego kursu NBP z art. 13b ust. 3;
- pomiń świadczenia z terminem starszym niż 2 lata przed wszczęciem;
- pomiń transakcje wyłącznie wewnątrz grupy kapitałowej;
- pomiń ustawowo wskazane transakcje ubezpieczeniowe/reasekuracyjne.

Próg nie jest przesłanką cywilnego roszczenia o jedną fakturę.

### 10.3 Wszczęcie — art. 13c i wystąpienie bez postępowania

Postępowanie prowadzi **Prezes UOKiK** wobec podmiotów niepublicznych i
wszczyna je **z urzędu**, gdy posiadane informacje wskazują na zator.
Wszczęcie poprzedza analiza prawdopodobieństwa obejmująca m.in. szacowaną
wartość opóźnionych świadczeń i liczbę wierzycieli. Prezes może korzystać
z danych KAS oraz informacji ze sprawozdań.

Ustawa przewiduje też wystąpienie Prezesa bez wszczynania postępowania;
adresat może przedstawić stanowisko, a wyznaczony termin nie może być krótszy
niż ustawowe minimum z art. 13ca.

### 10.4 Dowody i kontrola — art. 13f–13p

W toku sprawy Prezes może żądać informacji i dokumentów. Art. 13h odsyła do
wybranych przepisów ustawy o ochronie konkurencji i konsumentów.

Kontrolę u przedsiębiorcy może prowadzić upoważniony pracownik UOKiK lub
Inspekcji Handlowej. Zakres uprawnień obejmuje m.in. wejście do pomieszczeń,
żądanie ksiąg, dokumentów, korespondencji elektronicznej i danych z systemów,
sporządzanie kopii oraz żądanie wyjaśnień.

Kontrolowany ma obowiązek współdziałać; prawo odmowy jest ograniczone
ustawowo. W razie przewidywanego oporu kontrolujący może korzystać z pomocy
Policji na zasadach art. 13k. Do kontroli odpowiednio stosuje się wskazane
przepisy Prawa przedsiębiorców, z ustawowymi wyłączeniami.

### 10.5 Procedura i termin — art. 13q–13r

W sprawach nieuregulowanych stosuje się **KPA**, z wyłączeniem art. 31 KPA.
Postępowanie powinno zostać zakończone nie później niż w terminie
**5 miesięcy od wszczęcia**.

### 10.6 Decyzja, kary i środki — art. 13t–13y

**Art. 13t:** osobna kara może zostać nałożona za nieudzielenie żądanych
informacji / informacje nieprawdziwe albo utrudnianie kontroli. Maksimum
wynika z aktualnego art. 13t i jest związane z przychodem oraz limitem EUR.

**Art. 13u:** jeżeli Prezes nie stwierdzi nadmiernego opóźniania, umarza
postępowanie **decyzją**.

**Art. 13v:** przy stwierdzeniu nadmiernego opóźniania Prezes może nałożyć
karę. Maksymalna kara jest liczona ustawowym wzorem progresywnym według
wartości świadczeń i długości opóźnienia. Nie licz jej z pamięci — zasil
aktualne WŚ1–WŚ5 z danych transakcyjnych i odczytaj bieżący wzór.

Aktualna regulacja obejmuje m.in.:
- możliwość obniżenia kary o **20%**, jeżeli w 14 dni od doręczenia decyzji
  strona zapłaci całość i zrzeknie się prawa do ponownego rozpatrzenia;
- zwiększenie maksymalnej kary przy ponownym stwierdzeniu zatoru w okresie
  wskazanym ustawą;
- obligatoryjne odstąpienie od kary, gdy zator wynikał z siły wyższej;
- wniosek o ponowne rozpatrzenie sprawy;
- **skargę do WSA**, a nie do SOKiK.

Art. 13va wymaga załącznika do decyzji z wykazem analizowanych świadczeń.
Art. 13w reguluje publikację decyzji z ochroną tajemnicy przedsiębiorstwa.

**Zapłata kary:** art. 13x przewiduje 30 dni od ostateczności decyzji.
Po terminie kara jest ściągana w egzekucji administracyjnej. Art. 13xa
pozwala w ważnym interesie wnioskodawcy odroczyć płatność lub rozłożyć ją
na raty. Art. 13y reguluje zwrot kary po uchyleniu/stwierdzeniu nieważności
lub obniżeniu decyzji.

### 10.7 Wykroczenia — art. 13z–13zb

- art. 13z: odpowiedzialny za sprawozdanie, który dopuszcza do jego
  nieprzekazania w terminie, oraz osoba utrudniająca/udaremniająca wykonanie
  tego obowiązku — grzywna;
- art. 13za: brak wymaganego oświadczenia z art. 4c albo oświadczenie
  niezgodne ze stanem rzeczywistym — grzywna;
- art. 13zb: orzekanie odbywa się według KPW.

Dla obrony/kwalifikacji wykroczeniowej uruchom DR-03, ale sama treść
ustawowych typów jest pokryta tutaj.

## 11. Relacje i wersja czasowa

KC: pomocniczo, z uwzględnieniem szczególnego art. 4a; UZNK: oddzielna
kwalifikacja nieuczciwego wydłużania terminów; upadłość/restrukturyzacja:
kontrola wyłączenia, nie podwójne naliczenie. Dyrektywa 2011/7/UE stanowi
kontekst implementacyjny, a nie automatyczną zamianę polskiej podstawy.

## 11A. Temporalność — art. 15–17 i kluczowe nowelizacje

### A. Wejście ustawy z 2013 r.

Art. 15 ustawy bazowej:
- do transakcji zawartych **przed wejściem w życie** ustawy stosuje się
  przepisy dotychczasowe;
- tę samą regułę stosuje się do transakcji z zamówień publicznych wszczętych
  przed wejściem ustawy.

Art. 16 uchylił ustawę z 12.06.2003 r. o terminach zapłaty w transakcjach
handlowych. Art. 17 ustanowił wejście ustawy po **30 dniach od ogłoszenia**;
ogłoszenie nastąpiło 28.03.2013, więc gate temporalny dla umów przebiega
przez 28.04.2013.

### B. Nowelizacja Dz.U. 2022 poz. 2414

Nowelizacja z 4.11.2022 r. zmieniła m.in.:
- wyłączenia dla upadłości/restrukturyzacji;
- definicję grupy kapitałowej;
- oświadczenie dużego przedsiębiorcy;
- art. 9a o bezskuteczności zakazu cesji w relacji duży dłużnik–MŚP;
- raportowanie 13a–13ab;
- próg/wyłączenia zatoru;
- postępowanie UOKiK i model kar.

**Przepisy przejściowe art. 3 tej nowelizacji:**
- do transakcji zawartych przed wejściem nowelizacji stosuje się co do zasady
  przepisy dotychczasowe;
- analogicznie dla transakcji po wcześniejszych postępowaniach PZP;
- art. 9a nie stosuje się do transakcji zawartych przed jego własnym wejściem
  w życie ani wskazanych wcześniejszych postępowań PZP;
- sprawozdania za 2020/2021 mają szczególny reżim korekt;
- raport za 2022 i jego korekty stosują nowe zasady;
- postępowania zatorowe wszczęte i niezakończone przed zmianą prowadzi się
  według przepisów dotychczasowych, z wyjątkami wskazanymi w art. 3.

**Daty wejścia:** zasadniczo 14 dni od ogłoszenia 23.11.2022; art. 9a
(art. 1 pkt 4 nowelizacji) po 2 miesiącach od ogłoszenia; wybrane zmiany
raportowania i wykroczeń od 01.01.2023. Nie sprowadzaj całej nowelizacji
do jednej daty.

### C. Dz.U. 2023 poz. 852 i t.j. 1790

Tekst jednolity Dz.U. 2023 poz. 1790 uwzględnia zmianę Dz.U. 2023 poz. 852
ogłoszoną przed 12.07.2023. Obwieszczenie wskazuje zróżnicowane daty wejścia
poszczególnych przepisów nowelizacji; przy sprawie z 2023 r. ustal konkretną
zmienioną jednostkę, nie używaj jednej daty dla całej ustawy.

### D. Algorytm starej umowy

1. Ustal datę zawarcia umowy oraz ewentualnego postępowania PZP.
2. Jeśli przed 28.04.2013 → zacznij od ustawy z 12.06.2003 r.
3. Jeśli 2013–2022 → odtwórz wersję ustawy przez ELI i akty zmieniające.
4. Jeśli okolice nowelizacji 2022/2414 → zastosuj art. 3–5 tej nowelizacji
   i oddziel datę art. 9a / raportowania od daty ogólnej.
5. Jeśli 2023 → sprawdź także Dz.U. 2023 poz. 852 i datę wejścia zmienianej
   jednostki.
6. Dopiero po tym wybierz stopę, termin, cesję, obowiązek raportowy lub
   regułę UOKiK.



KC: pomocniczo, z uwzględnieniem szczególnego art. 4a; UZNK: oddzielna
kwalifikacja nieuczciwego wydłużania terminów; upadłość/restrukturyzacja:
kontrola wyłączenia, nie podwójne naliczenie. Dyrektywa 2011/7/UE stanowi
kontekst implementacyjny, a nie automatyczną zamianę polskiej podstawy.
Stare umowy, odnowienia oraz zdarzenia sprzed zakresu tabeli wymagają
przepisów przejściowych ustawy i ustaw zmieniających. Nie stosuj obecnych
progów rekompensaty do każdego historycznego długu.

## 12. Zakres pokrycia i dalsza praca

Poziom B+ obejmuje rdzeń cywilny, workflow administracyjny UOKiK,
wykroczenia ustawy i operacyjną temporalność art. 15–17 oraz nowelizacji
2022/2414 i 2023/852. Nie oznacza kompletnego komentarza orzeczniczego do
każdej jednostki ani pełnej tabeli wszystkich zmian od 2013 r. Dla konkretnej
historycznej daty nadal wykonuj fresh temporal check ELI.
Pomocnicza kontrola organu:
[MRiT — zatory płatnicze](https://www.gov.pl/web/rozwoj-technologia/walka-z-zatorami-platniczymi) {RZĄD: 1}.

## 13. Bramka wyjściowa

- Ustalono kwalifikację transakcji, status obu stron i wyłączenia?
- Wybrano właściwy art. 5/6/7/8, a termin odróżniono od okresu odsetek?
- Każdy dzień i każdy kapitał mają właściwą stopę oraz świeżo odczytane źródło?
- Publiczny podmiot nieleczniczy i prywatna lecznica nie dostały niższej stopy?
- Ryczałt ma właściwy próg, liczbę transakcji/rat i historyczny kurs NBP?
- Dla starej umowy wykonano algorytm 11A i właściwe przepisy przejściowe?
- Dla UOKiK rozdzielono raportowanie, próg 13b, kontrolę, decyzję/karę i WSA?
- Wykonano `shared/SELF-CHECK-ANTY-FASADA.md` i SELF-CHECK routera?

Nieustalona przesłanka = warunkowy wynik z listą braków, nie fikcyjna
„pełna zgodność”. W odpowiedzi zachowaj znaczniki źródeł i końcowy disclaimer.

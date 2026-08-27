---
module: transakcje-handlowe-opoznienia
version: "1.0"
verified_on: "2026-08-27"
coverage: "B — rdzeń cywilny; administracyjne i historyczne gałęzie częściowe"
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

**Historia/aktualność:** wyszukiwania zmian z lat 2024–2026 nie ujawniły
późniejszej nowelizacji; obwieszczenie M.P. 2026 poz. 642 nadal powołuje
t.j. 1790. Nie potwierdzono jednak pełnego rejestru zmian przez API ELI
(błąd odczytu). Brak wyniku wyszukania nie jest dowodem braku zmian.
Przed kategoryczną oceną stanu na konkretny dzień domknij kontrolę temporalną
wg `shared/TEMPORAL-LAW-CHECK.md`; nie oznaczaj całej historii jako kompletnej.

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

## 10. Gałąź publicznoprawna — częściowa, nie poradnik pełnego postępowania

Oddziel roszczenie wierzyciela od postępowania Prezesa UOKiK. Próg nadmiernego
opóźniania z art. 13b dotyczy co najmniej 2 mln zł niezapłaconych/opłaconych
po terminie świadczeń w trzech kolejnych miesiącach, z ustawowymi wyłączeniami;
nie jest warunkiem dochodzenia pojedynczej faktury. Dotyczy podmiotów
niepublicznych. UOKiK działa z urzędu; kara zasila budżet, nie wierzyciela.
[Wyjaśnienia UOKiK](https://uokik.gov.pl/zatory-platnicze) {RZĄD: 1}.

Raportowanie z art. 13a–13ab wymaga osobnej weryfikacji katalogu podmiotów,
roku danych, wyłączeń i korekt; nie każdy przedsiębiorca raportuje. Termin
30 kwietnia nie rozstrzyga sam, kogo obowiązek dotyczy.
Postępowanie, obliczenie kary i ulgi (art. 13c–13y) wymagają odczytu całej
właściwej gałęzi; weryfikuj drogę sądowoadministracyjną art. 13v ust. 10,
nie kieruj automatycznie do SOKiK. Dołącz DR-05. Wykroczenia art. 13z–13zb
→ DR-03 i KPW. **Brak tu kompletnego kalkulatora kar ani pełnego workflow
sprawozdania/odwołania** — nie deklaruj tego zakresu jako pokrytego.

## 11. Relacje i wersja czasowa

KC: pomocniczo, z uwzględnieniem szczególnego art. 4a; UZNK: oddzielna
kwalifikacja nieuczciwego wydłużania terminów; upadłość/restrukturyzacja:
kontrola wyłączenia, nie podwójne naliczenie. Dyrektywa 2011/7/UE stanowi
kontekst implementacyjny, a nie automatyczną zamianę polskiej podstawy.
Stare umowy, odnowienia oraz zdarzenia sprzed zakresu tabeli wymagają
przepisów przejściowych ustawy i ustaw zmieniających. Nie stosuj obecnych
progów rekompensaty do każdego historycznego długu.

## 12. Ograniczenia pokrycia i dalsza praca

Poziom B dotyczy rdzenia cywilnego, nie całej ustawy. Mapa jednostek znajduje
się w `MAPA-POKRYCIA.md`. Nie wykonano kompletnego przeglądu orzecznictwa,
całej historii zmian ani wszystkich gałęzi administracyjnych. W sporze
wymagającym tych elementów wykonaj research i pokaż lukę przed konkluzją.
Pomocnicza kontrola organu:
[MRiT — zatory płatnicze](https://www.gov.pl/web/rozwoj-technologia/walka-z-zatorami-platniczymi) {RZĄD: 1}.

## 13. Bramka wyjściowa

- Ustalono kwalifikację transakcji, status obu stron i wyłączenia?
- Wybrano właściwy art. 5/6/7/8, a termin odróżniono od okresu odsetek?
- Każdy dzień i każdy kapitał mają właściwą stopę oraz świeżo odczytane źródło?
- Publiczny podmiot nieleczniczy i prywatna lecznica nie dostały niższej stopy?
- Ryczałt ma właściwy próg, liczbę transakcji/rat i historyczny kurs NBP?
- Nie udawano zamknięcia historii zmian, orzecznictwa lub gałęzi administracyjnej?
- Wykonano `shared/SELF-CHECK-ANTY-FASADA.md` i SELF-CHECK routera?

Nieustalona przesłanka = warunkowy wynik z listą braków, nie fikcyjna
„pełna zgodność”. W odpowiedzi zachowaj znaczniki źródeł i końcowy disclaimer.

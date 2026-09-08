# Wyniki benchmarku — 2026-09-08

Bank 14 kazusów wieloaspektowych, 7 przebiegów, ocena 0–10 według rubryk autora klucza.
Metoda: `METODOLOGIA.md`. Materiał źródłowy: `materialy/`, `odpowiedzi/`.

## Macierz wyników

| Kazus | 01 Sonnet bez | 02 Sonnet v3.x | 03 Sonnet v3.41 | 04 Opus bez | 05 Opus v3.37 | 06 Opus v3.41 | 07 Haiku |
|---|---|---|---|---|---|---|---|
| K-01 Heliox / Solaria | 5,5 | 6,0 | 8,5 | 8,5 | 8,5 | **9,5** | — |
| K-02 Wąwóz Gordyjski | 4,0 | 6,5 | 8,5 | 8,5 | 8,5 | **9,5** | — |
| K-03 Vitoria i Graviola | 6,0 | 7,0 | 8,0 | 9,0 | 8,0 | **9,5** | — |
| K-04 Syrax | 5,5 | 6,5 | 8,0 | 9,0 | 8,5 | **9,5** | — |
| K-05 Orchis / Darwin | 6,0 | 7,0 | 8,0 | 9,0 | 8,5 | **9,5** | — |
| K-06 Inkaton / Accadia | 5,5 | 5,5 | 8,0 | 9,0 | 9,0 | **9,5** | — |
| K-07 Anecoyon / Ridus | 6,0 | 7,0 | 8,0 | 9,0 | 9,0 | **9,5** | — |
| PL-01 Algorytm i sygnalistka | 6,0 | 7,0 | 8,0 | 9,0 | 8,5 | **9,5** | 2,0 |
| PL-02 Osiedle na łące | 6,0 | 7,0 | 8,0 | 9,0 | 9,0 | **9,5** | 2,0 |
| PL-03 Fundacja rodzinna | 5,0 | 6,0 | 8,0 | **9,5** | **9,5** | **9,5** | 2,0 |
| PL-04 Szpital i MedPrompt | 6,0 | 7,0 | 8,0 | 9,0 | 8,5 | **9,5** | 2,0 |
| PL-05 Chmura dla metropolii | 6,0 | 7,0 | 7,5 | 9,0 | 9,0 | **9,5** | 2,0 |
| PL-06 Karuzela VAT | 6,0 | 7,0 | 8,0 | 8,5 | **9,5** | **9,5** | 2,0 |
| PL-07 Deepfake wyborczy | 6,0 | 7,0 | 8,0 | **9,5** | **9,5** | **9,5** | 2,0 |

## Średnie

| Przebieg | Część międzynarodowa K-01–K-07 | Część polska PL-01–PL-07 | **Łącznie** | Pokrycie | Słów / kazus |
|---|---|---|---|---|---|
| 06 Opus 5 ze skillami v3.41 | 9,5 | 9,5 | **9,5** | 14/14 | 5 852 |
| 04 Opus 5 bez skilli | 8,9 | 9,1 | **9,0** | 14/14 | 2 006 |
| 05 Opus 5 ze skillami v3.37 | 8,6 | 9,1 | **8,8** | 14/14 | 1 916 |
| 03 Sonnet 5 ze skillami v3.41 | 8,1 | 7,9 | **8,0** | 14/14 | 1 044 |
| 02 Sonnet 5 ze skillami v3.x | 6,5 | 6,9 | **6,7** | 14/14 | 1 400 |
| 01 Sonnet 5 bez skilli | 5,5 | 5,9 | **5,7** | 14/14 | 300 |
| 07 Haiku 4.5 ze skillami | nie wykonano | 2,0 | **2,0** | **7/14** | 749 |

Limit formalny z banku kazusów to 2500 słów na kazus. Trzy przebiegi mieszczą się z zapasem
(01, 03, 07), dwa są bliskie limitu (04, 05), jeden przekracza go ponad dwukrotnie (06).
Limit nie był punktowany — patrz `METODOLOGIA.md`, „Czego benchmark nie mierzy".

---

## Karty ocen — część międzynarodowa

### K-01 Heliox przeciwko Królestwu Solarii

Klucz wymaga rozdzielenia trzech płaszczyzn: wadliwa konsultacja nie unicestwia certyfikatów;
odzyskanie wymaga kompetencji właściwego organu i ustalenia rzeczywistej korzyści (ryczałt
podatny na zarzut nieproporcjonalności); wyrok arbitrażowy nie jest nieważny tylko dlatego,
że dotyka pomocy. Błąd wspólny do uniknięcia: traktowanie wszczęcia postępowania Komisji jak
decyzji ostatecznej.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 5,5 | Trzy reżimy rozpoznane, ryczałt i Micula trafione; Aarhus jednym zdaniem, brak rozbicia kompetencji Komisja/sąd krajowy. |
| 02 | 6,0 | Rozdziela Aarhus od reżimu pomocowego („nie należy ich zlewać"), ale teza główna czyni arbitraż „martwym torem wewnątrz UE" i zaciera różnicę wewnątrzunijne/zewnętrzne. |
| 03 | 8,5 | Art. 2 pkt 2 in fine konwencji z Aarhus (wyłączenie władzy ustawodawczej) → art. 8 zamiast art. 6; art. 13/16/17 rozp. 2015/1589 z przedawnieniem; jawny zakaz powoływania linii Achmea. |
| 04 | 8,5 | Opinia 1/17 jako właściwa podstawa przy umowie z państwem trzecim; test uzasadnionych oczekiwań czteroelementowy; ryczałt rozbity na trzy wady; brak art. 16 ust. 1 zd. 2 i przedawnienia. |
| 05 | 8,5 | Pełny ślad weryfikacji z art. 16 ust. 1, art. 17 i art. 55 konwencji ICSID; część kotwic pod kluczowymi twierdzeniami to RZĄD 3 (blogi kancelaryjne), co obniża notę mimo trafności. |
| 06 | 9,5 | Wszystko powyższe z kotwicami RZĄD 1, plus art. 26 i art. 27 ust. 1 ICSID (zawieszenie wykonania odblokowuje ochronę dyplomatyczną — „cena zawieszenia"), plus sprostowanie sentencji C-741/19. Oś kolejności postępowań zadeklarowana jako cienka. |

### K-02 Spór o Wąwóz Gordyjski

Klucz: sama własność NEXCA przez państwo nie wystarcza do atrybucji, lecz zgody polityczne
i kontrola nad konkretnym projektem mogą ją uzasadnić; wypadek badać jako problem należytej
staranności; ekstradycja wymaga osobnej analizy traktatowej i nie jest pochodną
odpowiedzialności międzynarodowej.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 4,0 | Przypisuje NEXCA Alekostrii „ze względu na pełną kontrolę korporacyjną i polityczną" — dokładnie błąd wspólny z klucza. Kara −0,5. |
| 02 | 6,5 | Rozróżnia kontrolę korporacyjną od operacyjnej, ale przypisuje incydent bez dowodu instrukcji co do tego zachowania; ekstradycję poprawnie odracza. |
| 03 | 8,5 | Atrybucja per zachowanie (trzy zachowania, trzy wyniki); art. 34 KWPT dla bojkotu Sollanii; wykrywa wewnętrzną sprzeczność w opisie ekstradycji. |
| 04 | 8,5 | Art. 4/5/8 badane osobno z komentarzem KPM; rozdzielenie decyzji projektowej od operacyjnej; trzy odrębne czyny; ciężar dowodu przy staranności. |
| 05 | 8,5 | Art. 6 konwencji MOP 169 (przedstawicieli wyłania społeczność, nie państwo) i art. 32 UNDRIP; poprawna asymetria atrybucji. |
| 06 | 9,5 | Dokłada art. 7 KPM (przekroczenie uprawnień nie przerywa atrybucji — neutralizuje argument „pojazd zjechał z trasy"), art. 32 ust. 2 UNDRIP zamiast art. 19 (brak elementu uprzedniości przy zasobach mineralnych), art. 15 ust. 2 MOP 169 z dwoma środkami materialnymi, art. 55 KPM jako kontrola lex specialis. |

### K-03 Vitoria i Graviola przeciwko Uxi

Klucz: uznać silny interes bezpieczeństwa, ale stwierdzić niedostatek gwarancji; polubienie
nie przesądza o podżeganiu; oddzielić informacje operacyjne od debaty; kumulacja może
wskazywać na efekt represyjny.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Wszystkie osie trafione, żadna rozwinięta; blokada → zniesienie z redakcją in camera. |
| 02 | 7,0 | Pełny test legalność–cel–konieczność, prior restraint, chilling effect. Uwaga metodologiczna deklaruje odstąpienie od weryfikacji („ugruntowana doktryna niewymagająca weryfikacji online") — sprzeczne z HARD GATE. |
| 03 | 8,0 | Rozdziela cztery środki państwa, każdy z własnym testem; rozstrzygnięcia warunkowe; widoczne znaczniki weryfikacji z jawnym ⚠️ przy pozycjach niepotwierdzonych. |
| 04 | 9,0 | Big Brother Watch (test gwarancji „od początku do końca") i Melike przeciwko Turcji dla polubienia — jedyny przebieg z orzeczeniem wprost na tę oś; pięcioelementowy test prior restraint; nadużycie ograniczeń jako osobny zarzut, świadomie nierozstrzygnięty przy braku materiału. |
| 05 | 8,0 | MPPOiP art. 17/19, Komentarz Ogólny 34, Goodwin; rozdzielenie „bezprawna" od „arbitralna". Kotwice przeważnie RZĄD 3. |
| 06 | 9,5 | Art. 20 ust. 2 MPPOiP jako katalog zamknięty → oddalenie zarzutu podżegania na zakresie; art. 19 ust. 1 vs ust. 2 dla polubienia (ust. 1 bez klauzuli limitacyjnej); art. 13 vs art. 12 ust. 4 dla pobytu; symetria przy uchylaniu blokady; kumulacja jako materiał dowodowy, nie odrębny zarzut. |

### K-04 Prokurator przeciwko Drogannie Syrax

Klucz: unikać automatyzmów; wykazać nexus, element świadomości i indywidualny wkład;
deklarację jurysdykcyjną czytać ściśle; immunitet i wadliwe doprowadzenie analitycznie
odrębne od jurysdykcji przedmiotowej.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 5,5 | Art. 12(3), Al-Bashir, male captus, kwalifikacje alternatywne. Nie stawia pytania o zakres przedmiotowy art. 8 — czyli o oś, na której kazus się rozstrzyga. |
| 02 | 6,5 | Jak wyżej, z pełniejszą macierzą; nowelizacja z 2019 r. nieodnotowana. |
| 03 | 8,0 | Wykrywa art. 8 ust. 2 lit. e pkt xix jako nowelizację z 2019 r. i art. 121 ust. 5; przenosi na art. 7 ust. 1 lit. h i k; odnotowuje niespójność orzecznictwa immunitetowego. |
| 04 | 9,0 | Rezolucja ICC-ASP/18/Res.5 z datą i trybem wejścia w życie; przeniesienie na zbrodnie przeciwko ludzkości z rekomendacją prowadzenia kumulatywnego; cztery formy odpowiedzialności uszeregowane wg siły dowodowej; „leki na choroby przewlekłe" jako najsilniejsza poszlaka zamiaru. |
| 05 | 8,5 | Głębokie na formach odpowiedzialności i na Gbagbo dla wykładni deklaracji, ale rozstrzygnięcie potwierdza zarzut z art. 8 ust. 2 lit. b pkt xxv, czyli przyjmuje charakter międzynarodowy konfliktu bez rozstrzygnięcia — automatyzm, przed którym klucz ostrzega. |
| 06 | 9,5 | Nagłówek lit. b jako klauzula zakresowa; luka art. 121 ust. 5 wobec państwa niebędącego stroną rozstrzygnięta przez art. 22 ust. 2 na korzyść oskarżonej; przeniesienie na art. 7 ust. 2 lit. b (eksterminacja obejmuje wprost pozbawienie dostępu do żywności i leków); art. 8 ust. 2 lit. f jako próg NIAC; liczba ratyfikacji poprawki podana. |

### K-05 Orchis Worldwide przeciwko Darwin Natural Food

Klucz: regulamin z chwili wszczęcia arbitrażu, chyba że klauzula zamraża wersję; ujawnienie
tożsamości finansującego i danych do konflikt-checku, pełna umowa wymaga dodatkowej potrzeby;
zmiana CITES przeszkodą tylko przy nieprzejęciu ryzyka i podjęciu działań zastępczych.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Wszystkie cztery konkluzje zgodne z kluczem, żadna oparta na tekście reguły. |
| 02 | 7,0 | Wytyczne IBA 2024 Standard 6, art. 25/49/75–80 CISG; brak reguły intertemporalnej samego regulaminu. |
| 03 | 8,0 | Siódma edycja regulaminu z datą wejścia w życie i regułą temporalną; art. 75 vs art. 76 jako alternatywa; opinie doradcze do CISG. |
| 04 | 9,0 | Reguła intertemporalna z odnotowaną rozbieżnością komentarzy jako wartością procesową; art. 79 rozbity na przesłanki (a)–(d) z wnioskiem, że zwolnienie jest bezprzedmiotowe, bo naruszenia prawdopodobnie nie było; rozdział formalności wywozowych i przywozowych; art. 73 dla dostaw w transzach. |
| 05 | 8,5 | Rule 1.5 i Rule 38 cytowane precyzyjnie, trzy filtry art. 79, art. 79 ust. 5 jako filtr trzeci; kotwice RZĄD 3. |
| 06 | 9,5 | Rozstrzyga na tym, do którego załącznika CITES trafił gatunek: przy załączniku I art. III ust. 3 lit. c (zakaz użycia głównie komercyjnego) czyni przeszkodę nieusuwalną, a propozycję alternatywnej trasy — prawnie bezprzedmiotową; art. XV jako kalendarz przewidywalności; art. XV ust. 3 zastrzeżenia; art. 80 CISG jako droga rozstrzygnięcia bez wchodzenia w art. 79. |

### K-06 Inkaton przeciwko Accadii

Klucz: brak kontroli nie jest porzuceniem; orzeczenie in rem nie rozstrzyga tytułu
międzynarodowo; odpowiedzialność za szkody księżycowe **wymaga analizy reżimu właściwego dla
miejsca**; ratowanie załogi to obowiązek, pozyskanie technologii wymaga odrębnego uzasadnienia.
Błąd wspólny: automatyczne uznanie cyberataku lub zjawiska naturalnego za siłę wyższą.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 5,5 | Art. VIII trafiony, in rem bezskuteczne; sformułowanie o odpowiedzialności absolutnej niejasne, ale rozstrzygnięcie stosuje ocenę staranności. |
| 02 | 5,5 | **Stwierdza odpowiedzialność absolutną za szkodę na Księżycu i wprost odrzuca siłę wyższą jako „prawnie nieskuteczną wobec jasnego brzmienia Konwencji z 1972 r."** — odwrotność tezy klucza w osi wartej 20 punktów. Uwaga metodologiczna deklaruje, że reżim kosmiczny „nie wymaga dodatkowej weryfikacji online". |
| 03 | 8,0 | Poprawia: art. II vs art. III (wina poza powierzchnią Ziemi); art. IX jako obowiązek konsultacji zamiast samopomocy; art. 5 Układu o ratownictwie. |
| 04 | 9,0 | Art. II/III/IV zweryfikowane w tekście; odrzucenie ładunku jako akt ludzki przerywający łańcuch siły wyższej; status wydobytego helu-3 jako kwestia sporna i kluczowa dla wyceny; wyczerpanie środków krajowych wobec orzeczenia in rem. |
| 05 | 9,0 | Dokłada rozdzielenie art. VI (odpowiedzialność za działalność narodową) od art. VII (odpowiedzialność odszkodowawcza) i wskazuje, że to odwrotność problemu atrybucji z K-02 — jedyne w tym przebiegu porównanie międzykazusowe. |
| 06 | 9,5 | Art. IX Układu adresowany do państwa i wymagający konsultacji **międzynarodowych** — zwrócenie się do prywatnego operatora nie jest jego wykonaniem „ani w części"; art. I lit. d (odrzucony ładunek jest obiektem kosmicznym); art. VII konwencji jako klauzula wyłączająca; art. VI ust. 2 (zwolnienie nie działa przy działalności sprzecznej z prawem międzynarodowym) łączy bezprawność przechwycenia z odpowiedzialnością za szkodę. |

### K-07 Anecoyon przeciwko Ridusowi

Klucz: zacząć od osi czasu i rozdzielenia kolejnych czynności; dawne legalne nabycie nie
obejmuje późniejszego sekwencjonowania i komercjalizacji; właściwym środkiem jest
wynegocjowany pakiet korzyści, a nie zakazanie projektu lub wyłączna własność jednego państwa.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Konkluzja zgodna z kluczem (nakaz negocjacji ABS, zgoda społeczności, zasada ostrożności), ale bez analizy zakresu czasowego. |
| 02 | 7,0 | Decyzja COP16 i Fundusz z Cali, współpochodzenie państw, art. 8(j); ostrzeżenie o niepełnej operacyjności mechanizmu. |
| 03 | 8,0 | Rozdziela dostęp od wykorzystania jako dwa odrębne akty; art. 7 Protokołu jako odrębny tryb zgody społeczności. |
| 04 | 9,0 | Bariera temporalna postawiona jako oś rozstrzygająca — zgodnie z „Zakresem czasowym" z mapy zagadnień; ustalenie, że mechanizm z decyzji 16/2 jest wielostronny, więc najbardziej oczywiste roszczenie Anecoyonu o udział w przychodach jest przedwczesne; rozróżnienie znaczenia duchowego od wiedzy tradycyjnej związanej z zasobem. |
| 05 | 9,0 | Cezury 2022 i 2024 dla informacji sekwencyjnej; reintrodukcja z suwerenności terytorialnej jako „najpewniejsze roszczenie w całym kazusie i zarazem najczęściej pomijane". |
| 06 | 9,5 | Definicje z art. 2 konwencji odczytane jako progowe: „warunki in-situ" w czasie teraźniejszym → gatunek wymarły nie ma kraju pochodzenia → art. 15 ust. 3 zamyka roszczenie u podstawy; przeniesienie na art. 10 Protokołu, przewidziany dokładnie dla sytuacji transgranicznych i braku możliwości uzyskania zgody; art. 11 ust. 1 nie działa z tego samego powodu gramatycznego. |

---

## Karty ocen — część polska

### PL-01 Algorytm zwalnia sygnalistkę

Klucz: odtworzyć rzeczywisty proces decyzyjny i oś czasu; formalne zatwierdzenie nie jest
realnym nadzorem; ochrona sygnalistki nie legalizuje automatycznie każdego sposobu pozyskania
i ujawnienia danych; priorytetem zabezpieczenie logów, wersji modelu i kryteriów ratingu.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Domniemanie odwetu, art. 22 RODO, retencja jako niekorzystne domniemanie. Powołuje obowiązki aktu o AI dla systemów wysokiego ryzyka bez zastrzeżenia czasowego. |
| 02 | 7,0 | „Rubber-stamping" i kryterium realnej interwencji ludzkiej; kwalifikator karnomaterialny wskazuje rozdział karny ustawy, ale przyznaje, że brzmienia nie sprawdzono. |
| 03 | 8,0 | Art. 12 ust. 3 (ciężar dowodu po stronie pracodawcy) jako oś sporu; przesunięcie dat stosowania obowiązków dla załącznika III odnotowane i użyte. |
| 04 | 9,0 | Katalog art. 3 ust. 1 jako zamknięty, pkt 17 zawężony do relacji z organami władzy publicznej → właściwy jest pkt 13; art. 12 ust. 1 pkt 2 i 11 jako dwa odrębne działania odwetowe; **art. 53 wyłącza test sekwencyjny przy przekazaniu bezpośrednio do prasy**; art. 233 § 2 KPC jako najsilniejszy instrument przy odmowie ujawnienia logiki. |
| 05 | 8,5 | Brzmienia z urzędowych PDF tekstów jednolitych; art. 51 ust. 2 pkt 3 jako właściwa przesłanka; art. 55 (odpowiedzialność karna za odwet). Powołuje art. 26 ust. 11 aktu o AI bez zastrzeżenia czasowego; relacja podstaw jawnie niezbadana. |
| 06 | 9,5 | Dokłada ustalenie, że art. 22³ § 4 KP rozciąga reżim tylko na monitoring konieczny do celów z § 1, a cele PeopleScore (lojalność, absencja, kontakty z mediami) do tego katalogu nie należą — system nie jest więc wadliwie wprowadzony, tylko w ogóle poza reżimem; precyzyjne ustalenie zakresu odesłania przy retencji. |
| 07 | 2,0 | Art. 52 KP jako podstawa wypowiedzenia (to przepis o rozwiązaniu bez wypowiedzenia); „art. 13 ust. 1" ustawy o sygnalistach jako źródło domniemania (ciężar przenosi art. 12 ust. 3); „art. 52 aktu o AI"; art. 276 KPC; fakty z PL-04 wmieszane w PL-01 („interfejs pokazuje rekomendację kliniczną", „lekarz akceptuje"); archive.org jako sposób odzyskania logów serwera. |

### PL-02 Osiedle na zalewowej łące

Klucz: mapa zależnych aktów, bo wada planu nie daje automatycznie tego samego skutku co wada
decyzji; nowa mapa nie działa sama przez się wstecz; publicznoprawny los inwestycji i prywatne
rozliczenia wymagają osobnych konkluzji.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Cztery ścieżki rozpoznane; konflikt interesów potraktowany jako mocny zarzut, wbrew kierunkowi klucza. |
| 02 | 7,0 | Salami slicing dobrze rozwinięte; rozdziela odpowiedzialność gminy od dewelopera. |
| 03 | 8,0 | Art. 28 ust. 1 jako lex specialis wobec ogólnej sankcji nieważności; art. 3 ust. 1 pkt 13 ustawy ocenowej. Powołuje wyrok NSA z kwietnia 2026 r. przy kotwicy RZĄD 2A. |
| 04 | 9,0 | Pełna mapa: art. 25a usg (interes prawny radnego, nie bliskich → zarzut wątpliwy), art. 28 ust. 1 z testem istotności, art. 72 ust. 1 pkt 1 ustawy ocenowej jako mechanizm przeniesienia wady na pozwolenie, art. 145 § 1 pkt 5 KPA z wymogiem istnienia okoliczności w dniu wydania, art. 161 KPA jako droga kosztowna i dlatego pomijana, art. 417¹ § 2 KC z wymogiem prejudykatu. |
| 05 | 9,0 | Definicja przedsięwzięcia odczytana z tekstu jednolitego; art. 28 ust. 2 Prawa budowlanego jako granica legitymacji sąsiadów; art. 36 ust. 1 z odesłaniem do art. 37¹. |
| 06 | 9,5 | Dokłada dwa ustalenia zmieniające kierunek: art. 50 ust. 1 pkt 2 Prawa budowlanego odnosi się do **sposobu wykonywania robót**, a nie do właściwości terenu, więc postanowienie nadzoru jest podatne na uchylenie; art. 145 § 1 pkt 5 KPA rozbity na człon „nowy dowód" (nie działa — mapa powstała później) i człon „nowa okoliczność" (działa — zagrożenie istniało w dniu wydania decyzji). |
| 07 | 2,0 | Art. 18 usg zamiast art. 25a; „art. 209 usg"; art. 137 PZP jako zakaz dzielenia przedsięwzięcia w ocenie środowiskowej; art. 54 Konstytucji jako podstawa udziału społeczeństwa; fragment o „Marcie, pracownicy gminy" przeniesiony z PL-01. |

### PL-03 Fundacja po śmierci fundatora

Klucz: analiza aktywo po aktywie; fundacja nie jest ani zwykłą masą spadkową, ani absolutną
tarczą; najpierw skuteczność wniesienia mienia, potem roszczenia spadkowe i wierzycielskie;
kryzys spółki wymaga własnej analizy niewypłacalności.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 5,0 | Instytucje nazwane poprawnie (zgoda małżonka, doliczenie, skarga pauliańska), ale bez jednostek redakcyjnych i bez reżimu zachowkowego wprowadzonego wraz z ustawą o fundacji rodzinnej. |
| 02 | 6,0 | Dodaje governance i warstwę podatkową; nadal bez konkretnych przepisów o doliczaniu funduszu założycielskiego. |
| 03 | 8,0 | Art. 37 § 2 KRO (czynność niezupełna, nie nieważność), art. 993 § 2–3, art. 994¹, art. 996 § 2 KC, art. 8–9 ustawy. |
| 04 | 9,5 | Rozstrzygnięcie różnicujące per składnik: nieruchomości objęte art. 37 § 1 pkt 1 KRO, akcje nie; art. 994¹ § 1 KC jako bariera dziesięcioletnia; art. 8 ust. 1 ustawy jako instrument mocniejszy od skargi pauliańskiej; **brak fundacji rodzinnej w wyliczeniu z art. 5 ust. 2 Prawa upadłościowego** i wynikające z tego ograniczenie środków wierzycieli; art. 24q ust. 1a i art. 24r ustawy o CIT. |
| 05 | 9,5 | To samo, plus rozróżnienie art. 37 § 2 (umowa — bezskuteczność zawieszona) od art. 37 § 4 KRO (czynność jednostronna — nieważność bezwzględna) i wskazanie, że wniesienie mienia na fundusz założycielski jest bliższe drugiej kategorii. |
| 06 | 9,5 | Cztery ustalenia tekstowe, z których dwa odwracają wynik: „ustanowienie w testamencie" z art. 993 § 2 KC to nie to samo co powołanie fundacji do spadku (rozróżnienie wsparte art. 927 § 3 KC), a art. 994¹ § 1 traci moc ochronną słowami „chyba że fundacja rodzinna jest spadkobiercą" — testament sam wyłączył tarczę czasową; art. 127 ust. 1 Prawa upadłościowego nie obejmuje transferu dokonanego przez fundatora, bo upadłym jest spółka. |
| 07 | 2,0 | Majątek wspólny lokowany w Kodeksie cywilnym („KC art. 33–36", „art. 36 § 1 KC") zamiast w KRO; zachowek jako 1/2 albo 1/3 zależnie od liczby dzieci; „UPR art. 15–19"; „art. 72 KC — zasada ostrożnego gospodarza". |

### PL-04 Szpital podpowiada diagnozę

Klucz: rozdzielić błąd kliniczny, wadę organizacyjną i wadę produktu, a połączyć je dopiero
na poziomie przyczynowości i regresu; system wspomagający nie zwalnia lekarza z badania;
odpowiedzialność wobec pacjentki oddzielić od rozliczeń profesjonalistów.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Trzy warstwy odpowiedzialności rozdzielone; przerzucenie ciężaru dowodu przy brakach dokumentacji. |
| 02 | 7,0 | Rozbieżność między deklaracją producenta a interfejsem użyta jako argument klasyfikacyjny; nieskuteczność klauzuli audytowej wobec pacjentki. |
| 03 | 8,0 | Klasyfikacja jako oprogramowanie będące wyrobem medycznym i wynikająca z niej kwalifikacja wysokiego ryzyka; przesunięcie dat stosowania dla ścieżki załącznika I; dyrektywa o odpowiedzialności za produkty wadliwe jako jeszcze nieaktywna. |
| 04 | 9,0 | Dwie niezależne podstawy odpowiedzialności szpitala (art. 430 i art. 415 KC); integrator wskazany jako ogniwo przyczynowo najbliższe szkodzie i najczęściej pomijane; odrzucenie konstrukcji utraty szansy jako osłabiającej pozew; art. 233 § 2 KPC. |
| 05 | 8,5 | Brzmienia z urzędowych tekstów jednolitych, art. 4 ustawy o zawodach lekarza jako punkt wyjścia niezależny od technologii; art. 26 ust. 11 aktu o AI powołany bez zastrzeżenia czasowego. |
| 06 | 9,5 | Pięć ustaleń, dwa rozstrzygające: obowiązki rozdziału III aktu o AI dla ścieżki załącznika I nie mają w tej dacie podstawy czasowej, ale obowiązek kompetencji w zakresie AI **nie został odroczony** i to jedyny obowiązek z tego aktu, który tu naruszono; art. 449¹ § 2 KC definiuje produkt jako rzecz ruchomą, więc samodzielne oprogramowanie jest poza reżimem odpowiedzialności za produkt niebezpieczny, a zarzut wobec producenta przenosi się na art. 415 KC z pełnym ciężarem dowodu winy. |
| 07 | 2,0 | „AI Act art. 52" jako podstawa obowiązku transparentności; ustawa o ochronie konkurencji i konsumentów jako podstawa roszczenia o uszczerbek na zdrowiu; procentowy rozkład odpowiedzialności (40–50 / 30–40 / 20–30) bez podstawy. |

### PL-05 Chmura dla metropolii

Klucz: bezpieczeństwo może być kryterium, ale musi być obiektywne, mierzalne i otwarte na
rozwiązania równoważne; tajemnica wymaga uzasadnienia per informacja; incydent po wyborze nie
pozwala swobodnie przepisać wymagań; środek czasowy ma zabezpieczyć ciągłość bez przesądzania
długiej umowy.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Wszystkie pięć osi rozpoznane, żadna oparta na jednostce redakcyjnej. |
| 02 | 7,0 | Jedyny przebieg poza 06, który wykrył nowelizację ustawy o krajowym systemie cyberbezpieczeństwa wdrażającą dyrektywę NIS2. Konkluzja, że nowe wymagania mieszczą się w dopuszczalnej zmianie umowy, jest jednak wątpliwa przy braku klauzuli przeglądowej. |
| 03 | 7,5 | Art. 240 ust. 2 jako zarzut samodzielny; przesłanki tajemnicy przedsiębiorstwa jako kumulatywne i wymagające wykazania, nie deklaracji. Najsłabszy kazus tego przebiegu — warstwa cyberbezpieczeństwa potraktowana ogólnie. |
| 04 | 9,0 | Rozdzielenie testu związku z przedmiotem (art. 241 ust. 2 — obroniony) od testu podmiotowości (art. 241 ust. 3) i od testu mierzalności (art. 240 ust. 2 — nieobroniony); art. 118 ust. 2 jako wymóg faktycznego wykonania usług; test interesu publicznego z art. 578 oceniony jako przegrany dla zamawiającego, z uzasadnieniem trwałości ryzyka. |
| 05 | 9,0 | Ta sama konstrukcja z brzmieniami odczytanymi z urzędowych PDF; wskazanie, że wymóg prawa audytu to błąd projektowania dokumentacji sprzed incydentu, a nie reakcja na niego. Cytuje przepis ustawy o KSC w terminologii sprzed transpozycji NIS2. |
| 06 | 9,5 | Pięć ustaleń, w tym korekta poprzedniego przebiegu: tekst jednolity ustawy o KSC nie obejmuje noweli NIS2, więc „kto czyta wyłącznie tekst jednolity, czyta stan nieaktualny"; rozporządzenie o swobodnym przepływie danych nieosobowych zbadane co do zakresu (jednorazowe kryterium w jednej dokumentacji nie jest „praktyką powszechną i spójną"); art. 454–455 PZP w ogóle nie działają, bo umowy jeszcze nie ma → art. 255 pkt 6 zamiast art. 256; prawo audytu wyprowadzone z art. 28 ust. 3 lit. h RODO jako obowiązek ustawowy, a nie nowe świadczenie do wyceny. |
| 07 | 2,0 | Numeracja Prawa zamówień publicznych z ustawy z 2004 r. („art. 1, 8, 24, 70, 181 PZP"), nieobowiązującej; KIO umocowana w „art. 181". |

### PL-06 Karuzela, faktoring i milczący zarząd

Klucz: nie używać etykiety „karuzela" zamiast przesłanek; ocena podatkowa i odpowiedzialność
karnoskarbowa mają odrębne testy; alert AML jest sygnałem, nie dowodem; strategia ma
równolegle zabezpieczyć dane, ochronić tajemnicę i zarządzić konfliktem interesów.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Linia orzecznicza o dobrej wierze, indywidualizacja odpowiedzialności, tajemnica zawodowa — wszystko poprawnie nazwane, nic nieoparte na tekście. |
| 02 | 7,0 | Wyraźne rozdzielenie ról prezesa i dyrektora finansowego; ochrona tajemnicy obrończej jako zagadnienie proceduralne. Kwalifikator karnomaterialny opisowy, bez typów czynów. |
| 03 | 8,0 | Pełny kwalifikator: art. 270a, 271a, 277a i 277c KK w zbiegu idealnym z art. 8 § 1 KKS; metodyka resortowa; art. 225 KPK. |
| 04 | 8,5 | Bardzo mocna warstwa podatkowa i AML (art. 88 ust. 3a, art. 108 ustawy o VAT, art. 33/43/54/74 ustawy AML, art. 483 § 3 KSH jako tarcza i pułapka jednocześnie), ale **świadomie rezygnuje z pełnej kwalifikacji karnomaterialnej** — a to oś warta 20 punktów w rubryce. |
| 05 | 9,5 | Kwalifikator przeprowadzony jako drzewo od faktu, z jawnym rozgałęzieniem przy nieustalonej realności dostaw; art. 24 § 1 KKS (odpowiedzialność posiłkowa spółki) i art. 16 § 5 pkt 2 KKS (czynny żal spóźniony, bo kontrola już się odbyła) — dwa ustalenia, których nie ma nigdzie indziej; art. 225 § 2 KPK jako wyłączenie ochrony wobec posiadacza podejrzanego; aneks weryfikacyjny z orzeczeniem TSUE koryguje część główną przez rozdzielenie ciężaru dowodu na dwie osie. |
| 06 | 9,5 | Rozbicie art. 88 ust. 3a pkt 4 na litery a, b i c z wnioskiem, że pierwszym ruchem obrony jest zmuszenie organu do wskazania litery; art. 483 § 3 KSH jako przepis, który dostarcza miary przegrywanej przez prezesa; art. 54 ust. 1 ustawy AML jako bariera ustawowa, nie polityka banku. |
| 07 | 2,0 | „Art. 86 KKS" jako przepis o karuzeli VAT; art. 278 KK (kradzież) jako niszczenie dowodów; „art. 160 KC (defraudacja)"; art. 196 KSH jako obowiązek nadzoru zarządu; w tekście ciąg „MONNACAGE" bez znaczenia. |

### PL-07 Deepfake w wyborach samorządowych

Klucz: zacząć od procedury, bo wartość środka zależy od czasu; oddzielić syntetyczne
twierdzenie o korupcji od ocen i autentycznych fragmentów; brak pliku źródłowego nie wyklucza
ochrony; środek ma być szybki, precyzyjny i wykonalny.

| Przebieg | Nota | Uzasadnienie |
|---|---|---|
| 01 | 6,0 | Tryb wyborczy, obowiązki platformy, standard uprawdopodobnienia — trafione kierunkowo. |
| 02 | 7,0 | Odnotowuje brak odrębnego typu czynu dotyczącego treści syntetycznych i datę stosowania obowiązku oznaczania; koordynacja jako poszlaka wymagająca dowodu treściowego. |
| 03 | 8,0 | Art. 111 Kodeksu wyborczego z terminami i katalogiem żądań; art. 16, 34–35 i 39 aktu o usługach cyfrowych; prawa pokrewne wykonawcy jako odrębna podstawa. |
| 04 | 9,5 | Ustalenie porządkujące, że film nie jest materiałem wyborczym w rozumieniu art. 109 § 1, ale mieści się w art. 111 § 1 jako inna forma agitacji; **przesunięcie ciężaru z dowodu syntezy na niewykazanie prawdziwości informacji** jako jedyna konstrukcja wykonalna w 24 godziny; art. 132 § 3 i art. 149 dla finansowania; art. 81 ust. 2 pkt 1 nie obejmuje wizerunku wytworzonego; legitymacja autorska prawdopodobnie nie należy do kandydatki. |
| 05 | 9,5 | Najpełniejsza mapa przepisów (Kodeks wyborczy, KC, prawo autorskie, KK, akt o usługach cyfrowych, akt o AI) z arytmetyką terminów wykluczającą sprostowanie przed głosowaniem i z uczciwym wnioskiem, że kopie w komunikatorach pozostają poza zasięgiem każdego z tych środków. |
| 06 | 9,5 | Rozpada film prawnie na dwie części o różnym reżimie: wobec fragmentu autentycznego wyjątek z art. 81 ust. 2 pkt 1 działa, wobec części syntetycznej nie działa, bo wizerunek nie został „wykonany", tylko wygenerowany. |
| 07 | 2,0 | „Kodeks wyborczy art. 135, 138, 139, 113, 71" — przepisy o takiej treści nie istnieją; „grzywna 10–100 PLN"; art. 24 § 3 KC jako podstawa zadośćuczynienia. |

---

## Obserwacje przekrojowe

**1. Rozpiętość między najlepszym a najgorszym przebiegiem wynosi 7,5 punktu** przy tym samym
banku kazusów i tym samym kluczu. Nie jest to rozpiętość między modelami — to rozpiętość
między konfiguracjami.

**2. Trzy przebiegi popełniły błędy wspólne wymienione w kluczu.** Przebieg 01 w K-02
(atrybucja z samej własności), przebieg 02 w K-06 (odrzucenie analizy reżimu odpowiedzialności
przez przyjęcie odpowiedzialności absolutnej), przebieg 05 w K-04 (przyjęcie charakteru
konfliktu bez rozstrzygnięcia). Żaden nie wystąpił w przebiegu 06.

**3. Pokrycie banku jest samodzielnym wynikiem.** Przebieg 07 rozwiązał połowę kazusów,
pomijając całą część międzynarodową. Przy ocenie systemu produkcyjnego niewykonanie zadania
jest wynikiem gorszym niż wykonanie go słabo, bo nie generuje sygnału o własnej ułomności.

**4. Nikt nie osiągnął statusu POKRYTE w rejestrze własnym.** Dwa przebiegi (05 i 06)
raportują wprost, że nie mogą nadać wynikom statusu porównania ze wzorcem, ponieważ klucz nie
został im udostępniony, i proszą o niego. Wszystkie oceny w tym benchmarku są zatem pierwszą
konfrontacją tych arkuszy z kluczem.

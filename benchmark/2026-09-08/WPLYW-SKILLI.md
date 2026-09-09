# Wpływ skilli na odpowiedzi — benchmark 2026-09-08

## Wynik główny

| Model | Bez skilli | Ze skillami (starsza wersja routera) | Ze skillami v3.41 | Delta bez → v3.41 |
|---|---|---|---|---|
| Sonnet 5 | 5,7 | 6,7 (v3.x) | **8,0** | **+2,3** |
| Opus 5 | 9,0 | 8,8 (v3.37) | **9,5** | **+0,5** |
| Haiku 4.5 | brak próby kontrolnej | 2,0 przy pokryciu 7/14 | — | — |

**Efekt skilli jest odwrotnie proporcjonalny do siły modelu bazowego.** Skille podniosły
Sonneta o 2,3 punktu, Opusa o 0,5, a Haiku nie uratowały — mimo że przebieg Haiku deklaruje
pełną ścieżkę routera („Router → dr-04 → dr-11 → ISAP").

## Trzy odrębne mechanizmy, które trzeba rozdzielić

### Mechanizm 1: skille jako proteza metodologiczna (działa na słabszym modelu)

Sonnet bez skilli pisze 300 słów na kazus, w prozie, bez macierzy argumentów i bez jednostek
redakcyjnych. Ten sam model z routerem v3.41 produkuje 1044 słowa z macierzą argumentów,
tabelą braków faktycznych z kolumną „dowód, który go usuwa" i znacznikami weryfikacji przy
każdym powołaniu. Struktura wymuszona przez skill zamieniła issue spotting w analizę
przesłankową. To jest cały mechanizm wzrostu +2,3 — nie nowa wiedza, tylko wymuszony format
myślenia.

Dowód, że chodzi o strukturę, a nie o wiedzę: Sonnet bez skilli i Sonnet ze skillami v3.41
podają w większości kazusów te same instytucje prawne. Różnica jest w tym, że wersja skillowa
pyta o zakres podmiotowy przepisu, zanim go zastosuje.

### Mechanizm 2: wersja routera waży więcej niż sama obecność skilli

| Porównanie | Delta |
|---|---|
| Sonnet: v3.x → v3.41 | +1,3 |
| Opus: v3.37 → v3.41 | +0,7 |
| Opus: bez skilli → v3.37 | **−0,2** |

Przy wersji v3.37 skille **pogorszyły** wynik Opusa. Konkretnie: przebieg bez skilli wykrył
przesunięcie dat stosowania obowiązków aktu o sztucznej inteligencji i oparł na tym
rozstrzygnięcia w PL-01 i PL-04; przebieg v3.37 powołał art. 26 ust. 11 tego aktu wprost, bez
zastrzeżenia czasowego, i przez to postawił zarzut pozbawiony podstawy w dacie zdarzenia.
Bramka chronologiczna w v3.37 obejmowała oś faktów kazusu, ale nie datę stosowania aktu
unijnego. W v3.41 ta luka jest domknięta i to samo ustalenie pojawia się jako pierwsza teza
kazusu PL-04.

Podobnie w PL-05: przebieg v3.37 odczytał tekst jednolity ustawy o krajowym systemie
cyberbezpieczeństwa i zacytował przepis w terminologii sprzed transpozycji dyrektywy NIS2.
Przebieg v3.41 dodaje kontrolę „ile aktów zmieniających ogłoszono po tekście jednolitym"
i formułuje ostrzeżenie wprost: „kto czyta wyłącznie tekst jednolity, czyta stan nieaktualny".

**Wniosek dla utrzymania systemu:** różnica między dwiema wersjami tego samego routera na tym
samym modelu (0,7 punktu) jest większa niż różnica między routerem a jego brakiem (−0,2).
Wersjonowanie bramek jest istotniejsze niż fakt ich włączenia.

### Mechanizm 3: skille bez zdolności do ich wykonania są gorsze niż ich brak

Przebieg Haiku deklaruje ścieżkę routera i weryfikację w ISAP, a produkuje: art. 52 Kodeksu
pracy jako podstawę wypowiedzenia, art. 209 ustawy o samorządzie gminnym, art. 137 Prawa
zamówień publicznych jako zakaz dzielenia przedsięwzięcia w ocenie środowiskowej, przepisy
Kodeksu wyborczego o numerach 135, 138, 139 i 113 w treści, której nie mają, oraz numerację
Prawa zamówień publicznych z ustawy z 2004 r. W PL-01 do stanu faktycznego wpływają fakty
z PL-04 („interfejs pokazuje rekomendację kliniczną", „lekarz akceptuje wynik"), a w PL-02 —
z PL-01 („Marta, pracownica gminy").

Ceremonia bramkowa została odtworzona, treść bramki — nie. Deklaracja „Ścieżka weryfikacji:
Router → dr-04 → dr-11 → ISAP" w nagłówku arkusza, po którym następuje kilkanaście
zmyślonych numerów artykułów, jest gorsza niż jej brak: nadaje halucynacjom pozór
audytowalności.

## Które konkretnie artefakty skillowe wygenerowały wartość

Poniżej wyłącznie te ustalenia, które w przebiegach skillowych są **przypisane do nazwanej
bramki** i których **nie ma** w przebiegach bez skilli tego samego modelu.

| Bramka | Co robi | Ustalenia, które wygenerowała |
|---|---|---|
| WYJ-GATE / S1 (zamiatanie sąsiedztwa, jednostki z indeksem górnym) | czyta przepisy sąsiadujące i indeksowane, nie tylko powołany | art. 994¹ KC (bariera dziesięcioletnia przy zachowku); art. 22² i 22³ KP jako dwie odrębne jednostki; **art. 7 artykułów KPM** — przekroczenie uprawnień nie przerywa atrybucji, co unieważnia argument „pojazd zjechał z trasy" w K-02; art. 55 artykułów KPM jako kontrola lex specialis; art. 88 ust. 3a pkt 4 rozbite na litery a, b, c |
| WYJ-GATE / S2 (krawędzie jednostki) | szuka klauzul wyłączających na końcu artykułu lub sekcji | art. 55 konwencji ICSID (immunitet egzekucyjny — niewidoczny w art. 54); art. 16 ust. 1 zd. 2 rozp. 2015/1589; art. 225 § 2 KPK (wyłączenie ochrony wobec posiadacza podejrzanego); art. VII konwencji o odpowiedzialności za obiekty kosmiczne; art. 79 ust. 5 CISG |
| CN-GATE (norma centralna: czas / podmiot / przedmiot) | sprawdza, czy powołany przepis w ogóle obejmuje ten stan | art. 2 pkt 2 in fine konwencji z Aarhus (parlament poza definicją władzy publicznej); art. 20 ust. 2 MPPOiP (katalog zamknięty — mobilizacja przeciw technologii poza zakresem); art. 109 § 1 Kodeksu wyborczego (film fundacji nie jest materiałem wyborczym); **art. 449¹ § 2 KC** (produkt to rzecz ruchoma — oprogramowanie poza reżimem); art. 50 ust. 1 pkt 2 Prawa budowlanego (sposób wykonywania robót ≠ właściwość terenu); art. 3 pkt 5 rozp. 2018/1807 |
| OŚ-GATE (bramka chronologiczna) | liczy interwały i daty stosowania | art. 121 ust. 5 Statutu Rzymskiego i luka wobec państwa niebędącego stroną; art. 16 § 5 pkt 2 KKS (czynny żal spóźniony, bo kontrola już się odbyła); arytmetyka art. 111 § 2–4 Kodeksu wyborczego wykluczająca sprostowanie przed głosowaniem; przesunięcie dat stosowania rozdziału III aktu o AI |
| HARD GATE poziom B (API ELI → `/references` → `text.pdf`) | ustala obowiązujący tekst jednolity z rejestru, nie z pamięci | numery tekstów jednolitych dla 13–20 aktów per partia; wykrycie, że tekst jednolity ustawy o KSC nie zawiera noweli NIS2; kolumna „liczba zmian ogłoszonych po tekście jednolitym" |
| REM-GATE (bramka środka naprawczego) | zakazuje oddalenia żądania bez podania alternatywy o tej samej głębokości | art. 8 konwencji z Aarhus jako reżim zastępczy po oddaleniu art. 6; art. 10 Protokołu z Nagoi jako reżim zastępczy po ustaleniu, że gatunek wymarły nie ma kraju pochodzenia; art. 19 ust. 3 MPPOiP po oddaleniu art. 20 ust. 2 |
| Kwalifikator karnomaterialny (UP-3) | prowadzi drzewo kwalifikacji od faktu, nie od pierwszego pasującego przepisu | art. 270a/271a/277a KK w zbiegu idealnym z art. 8 § 1 KKS; art. 24 § 1 KKS (odpowiedzialność posiłkowa spółki za grzywnę); rozgałęzienie kwalifikacji przy nieustalonej realności dostaw zamiast wyboru jednego typu |
| Aneks weryfikacyjny | domyka pozycje oznaczone jako niezweryfikowane i raportuje, czy zmieniły wynik | rozdzielenie ciężaru dowodu na dwie osie w PL-06 (przesłanki materialne — podatnik; oszustwo i wiedza — organ, z zakazem domniemań) |

## Gdzie skille zawiodły

**1. Deklaracja weryfikacji zamiast weryfikacji.** Przebieg 02 zapisał w uwagach
metodologicznych, że reżim prawa kosmicznego i standardy praw człowieka „nie wymagają
dodatkowej weryfikacji online, bo nie uległy zmianie od czasu treningu modelu". Bezpośrednim
skutkiem jest jedyny w całym benchmarku błąd reżimu odpowiedzialności: przyjęcie
odpowiedzialności absolutnej za szkodę na Księżycu i odrzucenie siły wyższej jako „prawnie
nieskutecznej". HARD GATE nie ma trybu, w którym model sam ocenia, czy przepis wymaga
sprawdzenia — a ten przebieg taki tryb sobie przyznał.

**2. Znacznik weryfikacji nad kotwicą niskiego rzędu.** Przebieg 05 w części międzynarodowej
oznacza znacznikiem `[VER: … RZĄD 3]` twierdzenia niosące rozstrzygnięcie, powołując blogi
kancelaryjne i opracowania akademickie. Ślad formalnie istnieje, hierarchia źródeł nie jest
dotrzymana. Przebieg 06 przy tych samych kazusach schodzi na RZĄD 1 przez repozytorium
Urzędu Publikacji UE i depozytariusza traktatów, i to jest istota różnicy 8,6 → 9,5 w części
międzynarodowej.

**3. Koszt objętości.** Przebieg 06 zużywa 5852 słowa na kazus przy limicie formalnym 2500
słów z banku kazusów. Jakość rośnie, zgodność z zamówionym formatem spada. Bramki nie mają
mechanizmu przycinania: raportują pokrycie, nie mieszczenie się w limicie.

**4. Relacje podstaw pozostawiane niezbadane.** Przebiegi 05 i 06 same odnotowują pozycje
`CV-ALT — relacja podstaw niezbadana` (PL-01, PL-04) i oznaczają je jako gałęzie warunkowe.
Uczciwe, ale to oznacza, że kumulacja roszczeń — o którą kazus pyta wprost — pozostaje
nierozstrzygnięta.

## Zastrzeżenie, bez którego liczby są mylące

**Próba kontrolna nie jest czysta.** Przebieg 04 („Opus 5 bez skilli") deklaruje, że nie
uruchomiono routera, skilli dziedzinowych ani modułów walidacyjnych — a jednocześnie
w części polskiej wykonał weryfikację przez API ELI Sejmu z ustaleniem obowiązującego tekstu
jednolitego, czyli dokładnie procedurę HARD GATE poziom B. Sam to zresztą raportuje: „każdy
przepis krajowy sprawdzony w tekście ujednoliconym ISAP".

Mierzona delta dla Opusa (+0,5) opisuje zatem różnicę „pełny aparat bramek vs. sama
weryfikacja źródeł", a nie „system vs. model". Rzeczywisty wkład samej dyscypliny
weryfikacyjnej — najtańszego elementu systemu — jest w tym benchmarku niemierzalny, bo
występuje po obu stronach porównania. Nota końcowa przebiegu 04 sama wskazuje, że weryfikacja
zmieniła wynik w siedmiu punktach na siedem kazusów polskich.

Jedyna czysta próba kontrolna w tym zestawie to Sonnet 5 bez skilli, gdzie numery artykułów
„celowo pominięto lub podano poglądowo". Tam delta wynosi **+2,3**.

## Rekomendacje wynikające z pomiaru

1. **Wersjonować bramki agresywniej niż skille dziedzinowe.** Różnica v3.37 → v3.41 na tym
   samym modelu to 0,7 punktu; przy Sonnecie v3.x → v3.41 to 1,3 punktu. Regres w v3.37
   (−0,2 wobec braku skilli) pokazuje, że wersja routera potrafi zaszkodzić.
2. **Rozszerzyć OŚ-GATE na daty stosowania aktów unijnych**, nie tylko na oś faktów kazusu.
   To jest źródło jedynego regresu zmierzonego w tym benchmarku.
3. **Zamknąć tryb samozwolnienia z weryfikacji.** Zdanie „materia stabilna, nie wymaga
   sprawdzenia" powinno być traktowane przez bramkę jak brak weryfikacji, a nie jak jej
   wykonanie.
4. **Wprowadzić próg kotwicy dla twierdzeń rozstrzygających.** Twierdzenie niosące
   rozstrzygnięcie osi rubryki nie powinno móc zamknąć się kotwicą RZĘDU 3.
5. **Dodać bramkę objętości.** Bank kazusów podaje limit formalny; system go ignoruje.
6. **Nie wdrażać zestawu na modelach, które nie utrzymują dyscypliny cytowania.** Przy Haiku
   skille wygenerowały wyłącznie pozór audytowalności. Warstwa bramkowa powinna mieć próg
   modelu albo tryb, który przy wykryciu niezweryfikowanych numerów artykułów wstrzymuje
   wydanie arkusza zamiast go podpisywać.

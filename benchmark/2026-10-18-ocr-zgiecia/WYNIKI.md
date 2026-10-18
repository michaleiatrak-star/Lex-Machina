# OCR zgiętych zdjęć dokumentów: złamanie linii, ramki dynamiczne, biała lista VAT, model wizyjny

Data: 2026-10-18. Aplikacja: `lex-machina-aplikacja` `main` @ `44ff58e` (0.1.36), PaddleOCR 3.7 / PP-OCRv6_medium, CPU 4 vCPU bez GPU.
Wdrożenie: wydanie **0.1.37** (instalatory online Windows i macOS), gałąź `claude/awesome-sagan-c5rb9m` w `lex-machina-aplikacja`.

## Najważniejsze wnioski

1. **Dzisiejsza ścieżka aplikacji gubi 58% linii zgiętego dokumentu** (120/206, CER 73,8%). Strona 2: 37 z 42 linii.
   Przyczyna nie leży w rozpoznawaniu tekstu, tylko w **ramce linii**. Linia złamana na zgięciu (mediana 3–4°, maks. 13°) nie mieści się w prostokącie:
   - detektor liczy pewność w prostokącie (`score_mode=fast`), tło obniża wynik poniżej `box_thresh=0.6` i linia znika (str. 2: 10 z 47 wykrytych);
   - nawet zachowana linia jest wycinana obróconym prostokątem o wysokości 100–170 px zamiast ~45 (obie połówki przesunięte na zgięciu), więc rozpoznawanie zwraca pusty tekst.
2. **PDF ze zdjęć jest traktowany jak płaski skan.** `paddle_worker.py` włącza prostowanie UVDoc tylko w trybie `image` (`--unwarp auto`). Ten dokument to PDF z 5 zdjęciami telefonu (Haru Free PDF), więc prostowania nie ma.
3. **Ramka dopasowana do linii rozwiązuje problem.** Wariant adaptacyjny (wielokąt + pewność w konturze + prostowanie paskiem wzdłuż linii środkowej dla linii złamanych) daje **CER 7,5%, 11/206 zgubionych linii, 46/50 pól krytycznych**. To najlepszy wynik spośród wszystkich testowanych darmowych narzędzi.
4. **Aplikacja wykrywa złamanie sama, bez dodatkowego modelu**: z geometrii wielokąta detektora (wysokość prostokąta / grubość linii > 1,35 albo ugięcie linii środkowej > 0,35 grubości). Strona ze zgięciem (≥ 20% długich linii złamanych) jest czytana trybem zgięcia, każda inna jak dotąd.
   **Wdrożone w `paddle_worker.py` (0.1.37): CER 6,75%, 7/206 zgubionych linii, 44/50 pól krytycznych.** Na płaskich skanach i na zdjęciach bez zgięć (dok. B) tryb się nie włącza, a tekst jest bajt w bajt taki jak w 0.1.36. Udział linii złamanych: 0% na dokumentach płaskich, 33–75% na stronach dok. A.
5. **Biała lista VAT wpływa na wynik końcowy, ale przed poprawką tylko połowicznie.** Na dokumencie „wezwanie + pełnomocnictwo” OCR odczytał nazwę spółki z błędem („…**Giobal**” zamiast „…Global”). Bez poprawki dostaje on **osobny symbol** (dwie spółki dla modelu), także przy zapytaniu do białej listy. W sesji użytkownika model zbudował na tym zarzut „rozbieżności umocowania”, czyli **zarzut oparty na błędzie OCR**. Po poprawce wariant OCR ma symbol spółki z rejestru i oznaczenie „do potwierdzenia”.
6. **Dobór sądu działa prawidłowo** (na żywo, GUGiK/PRG): adres spółki → SR Katowice-Zachód, zgodnie z aktami (sprawa pracownicza w tym sądzie). Niepewny sąd model oznacza `[Sąd do ustalenia: …]`.
   Luka: taki znacznik przechodził do pliku bez informacji dla użytkownika. Teraz pola do uzupełnienia (sąd, `[UZUPEŁNIJ: …]`, `⬛`) **zostają w pliku i nie blokują go**, a użytkownik dostaje listę tego, co ma uzupełnić.
7. **Błąd generowania pisma** `TOKENIZED_DOCUMENT_VALIDATION_FAILED:ALIAS_MISSING` naprawiony. Renderer zapisuje alias z przypadkiem (`[LMPII:D00:PERSON:0003|GEN]`), a kontrola szukała gołego aliasu. Każde pismo z nazwą w formie odmienionej było blokowane.

## Dokumenty

| | Dok. A: postanowienie o umorzeniu dochodzenia | Dok. B: wezwanie + pełnomocnictwo |
|---|---|---|
| Strony / słowa | 5 / 2428 | 3 / ~800 |
| Obraz | zdjęcia telefonem; zgięcia pionowe i poziome, zawinięty róg s. 2, pieczęć czerwona, podpisy, odręczne poprawki | zdjęcia telefonem, lekka krzywizna |
| W próbie? | **nie** | tak (dok. 1 z benchmarku 2026-10-15) |
| Wzorzec | ręczna transkrypcja tekstu drukowanego i pieczęci (bez pisma ręcznego) | brak; anonimizacja oceniana na tekście po OCR |

Pola krytyczne dok. A (50): sygnatury, przepisy z kwalifikacją, daty, rachunek, e-mail, nazwiska, kwoty. Wzorzec i listy elementów zawierają dane osobowe i nie są w repozytorium.

## 1. OCR, dok. A

| Wariant / narzędzie | CER | WER | Recall słów | Diakrytyki | Zgub. linie (206) | Pola kryt. (50) | s.2 CER / zgub. |
|---|---:|---:|---:|---:|---:|---:|---:|
| **0.1.37: `paddle_worker.py` z trybem zgięcia** (rozdzielanie pieczęci jak dotąd) | **6,75%** | **15,7%** | 91,0% | 82,3% | **7** | 44 | 13,3% / 5 |
| Adaptacyjny, eksperyment (poly + slow + pasek dla linii złamanych) | 7,5% | 16,0% | **91,6%** | **84,0%** | 11 | **46** | 13,0% / 5 |
| Adaptacyjny + UVDoc | 5,2% | 17,0% | 88,3% | 77,9% | 9 | 44 | 2,2% / 0 |
| UVDoc + `score_mode=slow` | 11,7% | 22,5% | 82,5% | 79,3% | 24 | 41 | 21,8% / 13 |
| Aplikacja z `--unwarp on` | 20,1% | 25,4% | 78,9% | 75,3% | 30 | 42 | 36,0% / 14 |
| docTR (db_resnet50 + PARSeq multilingual) | 34,1% | 49,5% | 79,9% | 83,5% | 77 | 26 | 45,5% / 29 |
| Tesseract 5.3.4 `pol` | 38,8% | 58,9% | 74,5% | 73,4% | 92 | 22 | 44,6% / 25 |
| EasyOCR `pl` | 42,2% | 60,3% | 74,7% | 73,6% | 98 | 20 | 59,9% / 37 |
| OCRmyPDF 17.13 (`--deskew --rotate-pages`) | 58,0% | 86,9% | 57,0% | 50,2% | 137 | 12 | 60,9% / 35 |
| Sama `score_mode=slow` (bez wycinka paskiem) | 64,9% | 73,0% | 29,7% | 25,1% | 111 | 20 | 71,0% / 34 |
| Sam wielokąt `poly` (wycinek Paddle) | 63,7% | 68,4% | 34,9% | 28,8% | 107 | 23 | 69,1% / 32 |
| Page-dewarp (model powierzchni) + Tesseract | 31,6% | 54,1% | 69,3% | 69,0% | 75 | 21 | 26,8% / 17 |
| **Aplikacja 0.1.36** (PDF, bez UVDoc) | **73,8%** | 76,5% | 26,1% | 19,9% | **120** | **19** | 84,2% / 37 |

CER silników z własną segmentacją kolumn (Tesseract, EasyOCR, docTR, OCRmyPDF) jest zawyżony przez kolejność czytania. Liczba zgubionych linii jest od niej niezależna. Czasy nie są porównywalne: przebiegi szły równolegle na 4 vCPU (obciążenie ~15).

Sama zmiana detekcji (`slow` albo `poly`) prawie nic nie daje, bo linia wraca, ale jej wycinek jest nieczytelny. Działa dopiero połączenie: detekcja po konturze + wycinek wzdłuż linii.

### Złamanie linii a utrzymanie linii

Linie z detekcji wielokątnej (bez UVDoc), z tekstem ≥ 12 znaków, n = 218:

| Linia | n | Aplikacja dziś | `--unwarp on` | UVDoc + slow | Adaptacyjny |
|---|---:|---:|---:|---:|---:|
| prosta (złamanie < 1°, ugięcie < 0,3 wys.) | 25 | 92% | 84% | 88% | 100% |
| złamanie 1–3° | 80 | 56% | 94% | 96% | 100% |
| złamanie ≥ 3° | 113 | **26%** | 81% | 85% | 100% |
| ugięcie ≥ 0,5 wysokości linii | 52 | **10%** | 77% | 81% | 100% |

Złamanie leży w połowie szerokości strony (mediana x = 0,44–0,54), czyli na pionowym zgięciu. Mediana kąta to 2,8–4,2° na stronę, maksimum 13,2° (s. 2).
UVDoc pomaga przy zgięciu łagodnym, ale prostuje całą stronę jedną siatką i nie domyka ostrego załamania. Pasek wzdłuż linii środkowej prostuje każdą linię osobno.

### Ramki w podglądzie (`PageScanView`) i maskowanie obrazu (`maskBoxes`)

Ramka linii to dziś prostokąt osiowy z wielokąta (`paddle_worker._box`). Na dok. A:
- 36% ramek (68/190) przykrywa ponad 25% innej linii; maksymalnie 4 linie;
- średnio 46% pola ramki to tło lub inne linie (p90: 71%);
- `maskBoxes` rozkłada znaki proporcjonalnie po szerokości prostokąta. Na linii złamanej czarny pasek trafia w złą wysokość: wyciek danych na obrazie wysyłanym jako dowód albo zamaskowanie sąsiedniej linii.

UVDoc + tryb zgięcia ma najniższy CER, ale gorsze diakrytyki, WER i s. 4. Do tego UVDoc wyłącza rozdzielanie pieczęci. Wdrożony jest więc wariant bez UVDoc.

## 2. Automatyczne wykrywanie zgięcia i dobór ustawień (wdrożone w 0.1.37)

Wystarczy geometria z detektora, osobny model nie jest potrzebny:

1. Detekcja raz, z `box_type=poly` i `score_mode=slow` (wielokąt wzdłuż linii, pewność liczona w konturze).
2. Dla każdej linii: linia środkowa i grubość z wielokąta. Linia jest złamana, gdy wysokość obróconego prostokąta > 1,35 × grubość albo odchylenie linii środkowej od prostej > 0,35 grubości.
3. Linia prosta: wycinek jak dziś. Linia złamana: pasek prostowany wzdłuż linii środkowej (`cv2.remap`).
4. Strona jest czytana trybem zgięcia, gdy ≥ 20% długich linii (≥ 8 grubości) jest złamanych i takich linii jest co najmniej 6. W przeciwnym razie zostaje wynik dotychczasowej ścieżki (ustawienia 0.1.36 bez zmian).

| Strony | Udział linii złamanych | Tryb zgięcia |
|---|---:|---|
| płaski skan (prosty i przekrzywiony o 1,5°) | 0% | nie |
| dok. B (zdjęcia bez zgięć), s. 1–3 | 0% | nie; tekst identyczny z 0.1.36 |
| dok. A (zgięty), s. 1–5 | 33–75% | tak, wszystkie strony |

W wyniku workera strona ma `engine: "…, linie wzdłuż zgięcia"` i `fold: {brokenLines, lines}`. Każda linia ma obrys `poly`. Model wizyjny dostaje pasek wzdłuż linii. Błąd trybu zgięcia nie psuje odczytu: zostaje wynik dotychczasowy (`LEX_OCR_FOLD_FAILED` w logu). `LEX_OCR_FOLDS=off` wyłącza tryb.
Koszt: dodatkowa detekcja wielokątna na każdej stronie; ponowne rozpoznanie tylko na stronach ze zgięciem.

### Ramki dynamiczne w interfejsie (wdrożone)

- `paddle_worker.py` oddaje obrys linii `poly` (uproszczony wielokąt, w skali obrazu podglądu).
- `PageScanView.tsx` rysuje obrys linii w SVG; prostokąt zostaje tylko jako kotwica przewijania.
- `maskBoxes` bierze wysokość maski z obrysu w miejscu maskowanych liter (`polyBand`), a nie z całego prostokąta. Test: nazwisko za zgięciem ma maskę tylko na swojej połówce linii.

## 3. Model wizyjny (Qwen2.5-VL 7B Q4_K_M, jak w instalatorze)

Serwer `llama-server` (llama.cpp) z modelem i projektorem z `installer/*-release-source.json` (instalator pobiera **7B**, komentarz w `ocr-vision.ts` mówi o 3B: do ujednolicenia). Prompt i parametry jak w `LocalVisionLineReader`. 12 linii złamanych z dok. A; serwer padł po 8 na limicie pamięci kontenera (OOM, 5,9 GB RSS przy równoległych przebiegach OCR).

| Odczyt linii złamanej (8 linii, podpowiedź OCR z wariantu adaptacyjnego) | Zgodność ze wzorcem |
|---|---:|
| OCR adaptacyjny | 98,1% |
| model wizyjny na wycinku aplikacji (`_line_crop`: prostokąt w poprzek zgięcia) | 98,5% |
| model wizyjny na pasku wzdłuż linii | **99,1%** |

- Model poprawia drobiazgi (kropka, „wskazuja” → „wskazują”), ale na wycinku aplikacji raz **„poprawił autora”**: „Sądu Rejonowego” → „Sądem Rejonowym”. Arbiter w `ocr-vision.ts` odrzuca podmianę słowa słownikowego, więc do tekstu by to nie weszło.
- Model **nie odzyska linii, której detektor nie wykrył**: czyta tylko linie z wycinkiem i z wynikiem 0,85–0,95. Przy zgięciu linie giną wcześniej, w detekcji, więc model wizyjny nie zastąpi trybu zgięcia, tylko go uzupełnia.
- Wdrożenie: w trybie zgięcia worker oddaje modelowi wizyjnemu pasek wzdłuż linii zamiast prostokąta (`--line-crops`).
- Nie zmierzono trybu ratunkowego (pusta podpowiedź OCR) z powodu OOM; czas na CPU to 30–170 s/linię.

## 4. Biała lista VAT i anonimizacja

### Jak jest dziś (`privacy/registry-enrichment.ts`)

Kolejność jest dobra: NIP/KRS z tekstu → `wl_sprawdz_nip` (potem KRS lub CEIDG) → formy nazwy, adresu i osób → dopasowanie w tekście, także przybliżone (`findNameApproximately`). Usterki:

| Usterka | Skutek | Stan |
|---|---|---|
| Wariant nazwy z OCR („Giobal”) dopasowany do rejestru tylko jako „niepewny”, bez przypięcia do symbolu firmy z rejestru | dwa symbole = dwie spółki dla modelu; oznaczenie niepewności ginęło, gdy fragment wykryła też reguła nazw firm | **naprawione** `c30a595` |
| KRS „0000 297714” wysyłany do `krs_lookup` ze spacją (wzorzec narzędzia `^\d{1,10}$`) | zapytanie o KRS kancelarii zawsze kończy się błędem | **naprawione** `c30a595` |
| NIP rozpoznawany tylko w czystym formacie | brak zapytania przy: półpauzie, spacji po łączniku, O/l/I zamiast cyfr, grupach 3-2-2-3 ze spacją, etykiecie sklejonej z numerem | **naprawione** `c30a595` (tylko klucz zapytania, z sumą kontrolną) |
| Z odpowiedzi białej listy nie są brane `rachunki` | rachunek z wezwania jest na białej liście tej spółki; odczyt z 1–2 błędnymi cyframi nie był maskowany | **naprawione** w 0.1.37: rachunki z listy maskowane także z błędami OCR, z oznaczeniem „rachunek z białej listy VAT: <nazwa>” |
| Dopasowanie przybliżone tylko dla nazw osób i firm, nie dla adresów | adres z błędem OCR („l5” zamiast „15”, „4O-” zamiast „40-”) nie jest wiązany z adresem z rejestru | **naprawione** w 0.1.37, pod warunkiem tych samych numerów (inny numer to inny budynek) |
| Miejscowość z adresu propagowana do nazw organów | utrata właściwości sądu w treści dla modelu | **naprawione** w 0.1.37 (sekcja „Anonimizacja dok. A”) |
| Zapytanie tylko dla tekstu strony, na której jest NIP | strona bez NIP korzysta z rejestru tylko pośrednio (sejf dokumentu, 2 przebiegi) | do sprawdzenia |

Odpowiedź białej listy dla NIP spółki z dok. B (2026-10-18): status „Czynny”, nazwa, KRS, REGON, adres i 2 rachunki; `osoby` puste. API KRS w dniu testu zwracało stronę HTML zamiast JSON (przerwa techniczna), więc wszystkie zapytania KRS skończyły się `ERROR`. Formy z KRS w teście nie wystąpiły.

### Wpływ na wynik, dok. B (OCR aplikacji → anonimizator Lex)

| Wariant | Elementy zamaskowane | „…Giobal” | Oznaczenie do potwierdzenia |
|---|---:|---|---|
| bez białej listy | 21/21 | osobny symbol `PERSON:0006` | brak |
| biała lista, kod `main` | 21/21 | osobny symbol `PERSON:0006` | brak |
| **biała lista + poprawka** | 21/21 | **symbol spółki `PERSON:0005`** | „odczyt zniekształcony przez OCR, w rejestrze: <nazwa z rejestru>” |

Maskowanie jest kompletne we wszystkich wariantach (dok. B był w próbie, pod którą pisano reguły). Różnica dotyczy treści prawnej: z dwoma symbolami model widzi dwie spółki. W piśmie z sesji użytkownika to wprost dało pkt 1 („Brak wykazania umocowania”: „…Giobal” vs „…Global”). **Ten zarzut należy usunąć z pisma**: to ta sama spółka, a różnica to błąd OCR.

Inne obserwacje (bez poprawki):
- ucięta nazwa z pieczątki: trzeci symbol firmy;
- „Katowice:” w stopce kancelarii zamaskowane jako osoba (`PERSON:0001`);
- druga, odrębna spółka o podobnej nazwie ma własny symbol, poprawnie.

### Anonimizacja dok. A (poza próbą)

Wzorzec tekstu → anonimizator (12 elementów: 7 osób, e-mail, rachunek, adres, 2 firmy; 22 frazy treści prawnej, które muszą zostać):

| Narzędzie | Zamaskowane | Wycieki | Utracona treść prawna |
|---|---:|---|---|
| **Lex 0.1.36** | **12/12** | — | 5/22: miejscowość w nazwach organów („Prokuraturze Rejonowej Katowice-Zachód”, „Sądem Rejonowym Katowice-Zachód”, „Komisariat Policji VII w Katowicach”), adres prokuratury |
| **Lex 0.1.37 (poprawka miejscowości)** | **12/12** | — | **1/22** (adres prokuratury); „Katowicach” maskowane 14×, tylko w kontekście adresu |
| GLiNER multi PII | 10/12 | obie firmy | 2/22 (PKD, adres prokuratury) |
| Presidio + spaCy pl | 7/12 | pokrzywdzony, prezes, rachunek, obie firmy | 4/22 (nazwy państw, adres prokuratury) |
| spaCy pl | 6/12 | jw. + e-mail | 4/22 |

E2E (OCR → anonimizator): OCR aplikacji dziś gubi tekst, więc z 12 elementów w wejściu jest tylko 8. Maskowanie 12/12 wynika z tego, że reszty po prostu nie ma w tekście. Z trybem zgięcia jest 11/12 elementów w wejściu, wszystkie zamaskowane.

**Nadgorliwość „Katowicach”** (33 wystąpienia): gazeter maskuje miejscowość raz, w adresie prokuratury („ul. Wita Stwosza 31 w Katowicach”). Drugi przebieg propagował tę samą nazwę na każdą wzmiankę, także w nazwach sądów i organów, i model tracił właściwość sądu. Poprawka: sama miejscowość (bez ulicy i numeru) nie wchodzi w nazwę organu ani w człon nazwy okręgu („<miasto>-Zachód”). W innych miejscach pozostaje zamaskowana.

## 5. Dobór właściwego sądu i pola do uzupełnienia w piśmie

Mechanizm aplikacji (`courts/`): baza sądów z rozporządzenia MS (t.j. Dz.U. 2026 poz. 492, stan z ELI w repo aplikacji) i lokalizator adresu GUGiK/PRG. Miasta z kilkoma sądami rejonowymi rozstrzygane są po punkcie adresowym.
- Pierwsze pismo: model woła `court_for_address` z aliasem adresu (adresu nie widzi). Aplikacja ustala sąd i zapisuje go jako sąd sprawy (`zrodlo: PISMO`).
- Kolejne pisma: sąd z rejestru sprawy. Gdy sprawa jest w sądzie, sąd, wydział i sygnatura z dokumentów (`zrodlo: AKTA`).
- Sąd wpisany przez model bez ustalenia aplikacji: dopisek `[SĄD DO SPRAWDZENIA: …]`.

Test na żywo (2026-10-18):

| Adres | Rodzaj | Wynik | Zgodność |
|---|---|---|---|
| siedziba pozwanej spółki (Katowice) | pracy | SR Katowice-Zachód, SO w Katowicach; wydział pracy rozpoznaje | **zgodne z aktami** (sprawa pracownicza przed SR Katowice-Zachód) |
| ta sama siedziba, skrót nazwy ulicy jak w piśmie | — | SR Katowice-Zachód | jw. |
| adres pracownika (gmina bez podziału na kilka SR) | — | SR i SO właściwe dla gminy | zgodne z rozporządzeniem (gmina) |
| ul. Marszałkowska 1, Warszawa | — | SR dla Warszawy-Śródmieścia | miasto z kilkoma SR rozstrzygnięte |
| ta sama ulica, numer nieistniejący | — | `ADDRESS_NOT_FOUND`: „potrzebny numer budynku istniejący w ewidencji” | sąd nie jest zgadywany |

Odczyt sądu z akt na dok. A i B: brak (`null`). Postanowienie wymienia sądy tylko w formach odmienionych i w innych sprawach (sygnatury dwóch innych postępowań), więc nie zostały błędnie przyjęte za sąd tej sprawy.
Testy jednostkowe sądów: 83/85. Dwie porażki `g39i-court-http` (HTTP 500) są identyczne na czystym `main` i wynikają ze środowiska kontenera.

**Luka i zmiana w 0.1.37.** Przy niepewnym sądzie model pisze `[Sąd do ustalenia: kandydaci, czego brakuje]`. Ten znacznik przechodził do pliku bez informacji dla użytkownika, a `[UZUPEŁNIJ: …]` i `⬛` blokowały cały plik.
Teraz wszystkie pola do uzupełnienia zostają w pliku. Po zapisie użytkownik dostaje: „Sprawdź przed użyciem: sąd nie jest ustalony: podaj pełny adres strony, według którego ustala się właściwość (z numerem budynku), albo wpisz sąd; pola do uzupełnienia: [UZUPEŁNIJ: …]; puste pola ⬛ do wypełnienia: N”.
Nie zmierzono pełnego przebiegu z modelem (pierwsze pismo w nowej sprawie przez czat): wymaga konta dostawcy modelu, którego w kontenerze nie ma.

## 6. Błąd generowania pisma (`ALIAS_MISSING`)

`document-authoring-service.ts` porównywał listę aliasów z AST z tekstem pliku przez `includes(alias)`. `legal_document_worker.py:pii_ref_text` zapisuje alias z przypadkiem jako `[LMPII:D00:PERSON:0003|GEN]`. Każdy symbol użyty tylko w formie odmienionej był „brakujący” i pismo nie powstawało.
Poprawka `544ae66`: symbol uznany z sufiksem przypadka lub bez. Test regresyjny przechodzi do pliku końcowego z przywróconymi danymi; bez poprawki pada z kodem `ALIAS_MISSING:[LMPII:D01:PERSON:0001]`, tym samym co w sesji użytkownika.
Testy: `document-authoring-service` 7/7; pakiet generowania 61/62. Jedyna porażka (`document-generation-http`, `AUTHENTICATION_REQUIRED`) występuje identycznie na czystym `main` i wynika ze środowiska kontenera.

## 7. Usterki samych dokumentów (do analizy prawnej, nie OCR)

OCR odczytuje je poprawnie, więc pipeline powinien je flagować, a nie poprawiać:

- **Dok. A, s. 1 i s. 4:** sygnatura policyjna „KVII-8502/25” vs „KVII-5802/25” (przestawione cyfry w samym postanowieniu).
- **Dok. A, s. 1 i 3:** „porozumienia zawartego w dniu 9 października **2025** roku” vs s. 3 „porozumienia z dnia 9 października **2024** r.”; dok. B: porozumienie z 9 października 2024. Data 2025 jest późniejsza niż data postanowienia (30.06.2025).
- **Dok. A, s. 1 i 4:** w sygnaturze prokuratorskiej „4111-5.Ds.245.2025” liczba 245 jest przekreślona i ręcznie poprawiona (s. 1: „467”). OCR czyta przekreślone „245”, a pisma ręcznego nie czyta.

## 8. Pozostałe ryzyka

1. Jeden dokument zgięty poza próbą; reguła złamania (1,35 / 0,35) była dobrana na nim samym.
2. Próg trybu zgięcia sprawdzony na 3 dokumentach (płaski syntetyczny, zdjęcia bez zgięć, zgięty). Strona z pojedynczym zgięciem w rogu może nie przekroczyć 20% i zostanie przeczytana jak dotąd.
3. Pisma ręcznego (data zatwierdzenia, poprawka sygnatury, podpisy) żaden silnik nie odczytał poprawnie; aplikacja oznacza je do przeglądu.
4. Poprawki anonimizatora sprawdzone na jednym dokumencie z białej listy; KRS niedostępny w dniu testu.

## Odtworzenie

Skrypty: [`skrypty/`](skrypty/). Katalog roboczy: `doc/in.pdf`, `gt/p{1..5}.txt`, `gold_local.json` (lokalnie, poza repo).

```bash
python paddle_worker.py --input doc/in.pdf --output out/app_default.json --pages 1,2,3,4,5      # aplikacja dziś
python adaptive_ocr.py adapt 0                       # ramka dopasowana do linii
python poly_ocr.py uv_q_slow 1 quad slow             # warianty: <nazwa> <unwarp> <quad|poly> <fast|slow>
python ocr_metrics.py adapt,app_default,tess gold_local.json
python folds.py out/adapt.json app_default,adapt     # złamania linii vs utrzymanie linii
python frames.py out/poly.json                       # ramki prostokątne vs wielokąt
python vision_test.py out/adapt.json <port> 12 [ocr|empty]   # llama-server z Qwen2.5-VL 7B
npx tsx lex_anon_reg.mts out.json p1.txt p2.txt p3.txt       # REGISTRY_FIXTURES=..., REGISTRY=off
```

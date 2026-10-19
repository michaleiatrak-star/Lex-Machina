# OCR i anonimizacja, runda 2: Lex Machina 0.1.36-0.1.38 a darmowe narzędzia

Test z 18.10.2026, CPU bez GPU. Poprzednie raporty: `../2026-10-15-ocr-anonimizacja/`, `../2026-10-18-ocr-zgiecia/`.
Dane osobowe z dokumentów testowych zastąpione opisami (osoba 1, spółka X); dokumentów nie ma w repozytorium.

## Najważniejsze wnioski

1. **Zgięte zdjęcia:** Lex 0.1.37+ gubi 7 z 206 wierszy; najlepsza darmowa konkurencja (docTR) 77, Lex 0.1.36 120.
2. **Płaski skan: Lex przegrywa w CER z docTR i Tesseractem.** Lex 0.1.38 ma CER 5,76% wobec 4,04% (docTR) i 4,99% (Tesseract). Wygrywa w polach krytycznych (30/30 wobec 28/30) i ma najmniej zgubionych wierszy (5/186, jak docTR; Tesseract 11). Wcześniej podawany CER 2,33% był liczony po usunięciu tylko z wyniku Lex wierszy oznaczonych jako pieczęć lub kolorowy tusz (odręczne wpisy); konkurencji tego samego nie usunięto, więc porównanie było nieuczciwe i zostało wycofane.
3. **Polskie znaki (pismo szeryfowe):** drugi rozpoznawacz (latin PP-OCRv5) i korekta słownikowa (Morfeusz): diakrytyki pisma ORA 17% -> 83%, skanu 92,3% -> 94,8%, zdjęcia zgiętego 82,3% -> 90,4%.
4. **Anonimizacja (7 stron, 19 danych):** 13/19 -> 18/19 po poprawkach 0.1.38; pozostała sygnatura (polityka sygnatur, nie wyciek). Konkurencja: GLiNER 10/19, Presidio 6/19, spaCy 3/19.
5. **Spójność symboli:** jedna osoba lub firma = jeden symbol mimo różnych zapisów OCR; 13 -> 7 symboli na 7 podmiotów.
6. **Najsłabsze punkty: szybkość i odręczne wpisy na skanie.** Tesseract jest 10-20 razy szybszy. Odręczne wpisy i pieczęcie Lex odczytuje jako śmieci oznaczone „[PIECZĘĆ lub kolorowy tusz]”, ale zostają one w tekście i podnoszą CER.

## Dokumenty

| Zestaw | Opis | Stron |
|---|---|---:|
| Skan | umowy, płaski skan z odręcznymi wpisami (z 54-stronicowego pliku) | 7 |
| ORA | pismo okręgowej rady adwokackiej, czcionka szeryfowa | 1 |
| Zgięte | postanowienie o umorzeniu dochodzenia, zdjęcia telefonem ze zgięciami (dok. A z raportu 2026-10-18) | 5 |

## 1. OCR

Wszystkie narzędzia liczone na tym samym pełnym tekście wzorcowym, bez wyłączania czegokolwiek z wyniku któregokolwiek narzędzia. Lex 0.1.38 = wersja wydana (z korektą słownikową).

### Skan (7 stron, 186 wierszy, 30 pól krytycznych)

| Narzędzie | CER | WER | Polskie znaki | Zgubione wiersze | Pola krytyczne |
|---|---:|---:|---:|---:|---:|
| docTR | **4,04%** | 12,2% | 94,4% | **5** | 28 |
| Tesseract | 4,99% | 9,63% | **94,8%** | 11 | 28 |
| **Lex 0.1.38** | 5,76% | 10,53% | **94,8%** | **5** | **30** |
| Lex 0.1.36 / 0.1.37 | 6,05% | 11,75% | 89,8% | 6 | **30** |
| EasyOCR | 6,1% | 21,07% | 91,0% | 9 | 27 |
| OCRmyPDF | 6,17% | **9,51%** | 94,4% | 13 | 29 |
| page-dewarp + Tesseract | 8,62% | 20,81% | 85,8% | 12 | 26 |

- **Lex jest trzeci w CER.** Główna przyczyna: 10 wierszy odręcznych wpisów i pieczęci na s. 6-7 (podpisy, daty, numery) Lex odczytuje jako śmieci, oznacza „[PIECZĘĆ lub kolorowy tusz]”, ale zostawia w tekście. Usunięcie ich tylko z wyniku Lex dawało 2,33%, ale to nie jest porównanie z konkurencją (jej odczytów tych samych miejsc nie usuwano).
- **Lex wygrywa w polach krytycznych** (numery, daty, PESEL, sygnatury): 30/30; docTR i Tesseract gubią po 2.

### Pismo ORA (1 strona, czcionka szeryfowa, 18 wierszy, 16 pól krytycznych)

| Narzędzie | CER | WER | Polskie znaki | Zgubione wiersze | Pola krytyczne |
|---|---:|---:|---:|---:|---:|
| **Lex 0.1.38** | **4,35%** | **9,64%** | **83,3%** | **0** | **15** |
| Lex 0.1.36 / 0.1.37 | 5,65% | 19,28% | 16,7% | 0 | 11 |
| docTR | 10,65% | 21,69% | **83,3%** | 1 | 11 |
| EasyOCR | 15,32% | 37,35% | **83,3%** | 2 | 12 |
| Tesseract | 33,71% | 49,4% | 75,0% | 6 | 10 |
| OCRmyPDF | 46,77% | 54,22% | 58,3% | 10 | 6 |
| page-dewarp + Tesseract | 63,55% | 73,49% | 25,0% | 11 | 3 |

### Zgięte zdjęcia (5 stron, 206 wierszy, 50 pól krytycznych)

| Narzędzie | CER | WER | Polskie znaki | Zgubione wiersze | Pola krytyczne |
|---|---:|---:|---:|---:|---:|
| **Lex 0.1.38** | **7,63%** | **15,0%** | **90,4%** | **7** | **44** |
| Lex 0.1.37 | 7,68% | 16,61% | 82,3% | **7** | **44** |
| page-dewarp + Tesseract | 31,57% | 54,1% | 69,0% | 75 | 21 |
| docTR | 34,08% | 49,48% | 83,5% | 77 | 26 |
| Tesseract | 38,81% | 58,85% | 73,4% | 92 | 22 |
| OCRmyPDF | 40,28% | 58,85% | 67,2% | 96 | 26 |
| EasyOCR | 42,24% | 60,34% | 73,6% | 98 | 20 |
| Lex 0.1.36 | 73,63% | 76,91% | 19,9% | 120 | 19 |

### Czas na stronę (CPU)

| Lex 0.1.36 | Lex 0.1.37 | Lex 0.1.38 | docTR | Tesseract | OCRmyPDF | EasyOCR | page-dewarp + Tesseract |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 11,5 s | 17 s | 17,5 s | 7 s (+15 s ładowania) | 1,4 s | 2,6 s | 15 s (+15 s ładowania) | 4,6 s |

Cały 54-stronicowy skan: Tesseract 43 s, OCRmyPDF 49 s, Lex 0.1.37 774 s. Po usunięciu drugiej detekcji zgięć (0.1.38) 7 stron skanu: 125 s -> 105 s (0.1.36: 83 s).

### Zmiany OCR w 0.1.38

| Zmiana | Efekt |
|---|---|
| Drugi rozpoznawacz latin PP-OCRv5 (8 MB, opcjonalny w instalatorze); przy tych samych literach wygrywa odczyt z większą liczbą polskich znaków | ORA: diakrytyki 17% -> 83%, CER 5,65% -> 4,35%; skan: CER 6,05% -> 5,85%; czas +4% |
| Korekta słownikowa (Morfeusz, osobny proces): słowo nieznane -> jedyne znane w zasięgu typowych pomyłek OCR („Spóika” -> „Spółka”) | skan: polskie znaki 92,3% -> 94,8%, CER 5,85% -> 5,76%; zgięte: 82,3% -> 90,4%, CER 7,9% -> 7,63%; pola krytyczne bez zmian |
| Obce akcenty zamieniane na polskie lub usuwane (ž->ż, č->ć, á->a) | drugi rozpoznawacz nie wygrywa obcymi znakami |
| Kontrola zgięcia z mapy prawdopodobieństwa zwykłej detekcji zamiast drugiej detekcji | 0,06 s zamiast 4,7-6,5 s na stronę, te same decyzje; 7 stron skanu 125 s -> 105 s |
| Tryb zgięcia zastępuje stronę tylko, gdy czyta więcej pewnych liter | pusta strona z przebitką nie daje już śmieci („注 ははは”) |

**Odrzucone:** PP-OCRv6_small (gorszy), PP-OCRv5_server (brak ś, ź, Ą, Ę), uproszczona detekcja zgięć (błędy w obie strony), paddle 3.3.x (oneDNN nie obsługuje detektora PP-OCRv6, OCR 5,4x wolniejszy; przypięte 3.2.2).

## 2. Anonimizacja (7 stron po OCR 0.1.38, 19 danych osobowych)

| Narzędzie | Zamaskowane | Utrata treści | Czas |
|---|---:|---:|---:|
| **Lex 0.1.38 (po poprawkach)** | **18 z 19** | 0 | nie mierzono |
| Lex przed poprawkami (biała lista VAT) | 13 z 19 | 0 | 33 s |
| GLiNER | 10 z 19 | 1 | 127 s |
| Presidio + spaCy | 6 z 19 | 0 | 70 s |
| spaCy | 3 z 19 | 0 | 5 s |

### Wycieki z rundy 2 i ich naprawa (0.1.38)

| Przypadek | Przed | Po |
|---|---|---|
| Osoba zapisana „Nazwisko Imię” (odwrócona kolejność) | imię wyciekało | zamaskowana, ten sam symbol |
| Imię i nazwisko rozdzielone końcem linii („Adwokata Imię / Nazwisko”) | maskowane tylko imię | zamaskowane całe |
| Kod pocztowy przed „przy [adres]” | wyciekał | zamaskowany |
| KRS bez etykiety („pod numerem …”) | wyciekał, choć biała lista go zwraca | zamaskowany |
| REGON różny o cyfrę od rejestru (literówka w dokumencie) | niemaskowany (zła suma kontrolna) | zamaskowany z notatką o niezgodności |
| Firma oznaczona jako osoba; miasto w linii daty i „Sz. P.” jako osoba | błędne typy | poprawne typy |
| „Pomiędzy” wciągane do nazwy firmy | błąd zakresu | poprawione |
| Sygnatura sprawy | zostaje | zostaje (polityka sygnatur) |

### Jeden podmiot = jeden symbol

OCR i piszący zapisują tę samą osobę różnie: wersaliki bez ogonków, sklejone imię i nazwisko, odmiana („Imieniem Nazwiskiem”), literówka w imieniu. Przed poprawką każdy zapis dostawał osobny symbol, więc model widział kilka osób (nie był to wyciek). Po poprawce (`person-identity.ts`) wzmianka dostaje symbol znanej osoby, czytelniejszy zapis staje się wzorcem przywracania, a inna osoba o podobnym nazwisku zostaje inną. Nazwa firmy z innej strony: jeden symbol niezależnie od wielkości liter.

Zestaw 7 stron: **7 symboli na 7 osób i firm (było 13)**, wycieki bez zmian.

### Regresja na wcześniejszych dokumentach

Dok. A (zgięte postanowienie): 12/12. Dok. B (wezwanie z pełnomocnictwem): 21/21. Bez zmian.

## 3. Otwarte

1. **Odręczne wpisy i pieczęcie na skanie:** odczytywane jako śmieci i zostawiane w tekście (z oznaczeniem). To główna przyczyna wyższego CER niż docTR i Tesseract; do rozważenia: nie wstawiać do tekstu wierszy pieczęci o niskiej pewności, tylko pokazywać je w przeglądzie.
2. **Szybkość:** od 0.1.37 płaski skan jest wolniejszy niż w 0.1.36 (7 stron: 105 s wobec 83 s); różnicę robi drugi rozpoznawacz polskich znaków (ok. 2 s na stronę). Linii nie da się bezpiecznie odfiltrować z góry, bo brak ogonków zdarza się też przy wysokiej pewności.
3. **Pismo ręczne (ogólnie):** żadne narzędzie nie odczytuje poprawnie odręcznych poprawek i podpisów; aplikacja oznacza je do przeglądu.
4. **Mała próba:** jeden zgięty dokument; próg trybu zgięcia dobrany na nim.
5. **Pusta strona z przebitką:** nadal kilka śmieciowych znaków (jak w 0.1.36).

## Wersje

- Lex 0.1.37: tryb zgięcia, ramki wielokątne, biała lista dla wariantów OCR.
- Lex 0.1.38: drugi rozpoznawacz, korekta słownikowa, poprawki anonimizacji z tego raportu, jeden symbol na podmiot.
- Konkurencja: docTR, Tesseract 5.3.4 (pol), OCRmyPDF 17.13, EasyOCR (pl), page-dewarp + Tesseract, GLiNER, Presidio + spaCy pl, spaCy pl.

Skrypty pomiarowe: `../2026-10-18-ocr-zgiecia/skrypty/` (`ocr_metrics.py`, `anon_score2.py`, `lex_anon_reg.mts`).

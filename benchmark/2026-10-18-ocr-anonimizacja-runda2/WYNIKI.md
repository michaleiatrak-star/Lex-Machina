# OCR i anonimizacja, runda 2: Lex Machina 0.1.36-0.1.38 a darmowe narzędzia

Test z 18.10.2026, CPU bez GPU. Poprzednie raporty: `../2026-10-15-ocr-anonimizacja/`, `../2026-10-18-ocr-zgiecia/`.
Dane osobowe z dokumentów testowych zastąpione opisami (osoba 1, spółka X); dokumentów nie ma w repozytorium.

## Najważniejsze wnioski

1. **Zgięte zdjęcia:** Lex 0.1.37+ gubi 7 z 206 wierszy; najlepsza darmowa konkurencja (docTR) 77, Lex 0.1.36 120.
2. **Płaski skan:** po wyłączeniu z pomiaru odręcznych wpisów (aplikacja wydziela je celowo) Lex ma CER 2,33% wobec 4,04% (docTR) i 4,99% (Tesseract); pola krytyczne 30/30 wobec 28/30.
3. **Polskie znaki (pismo szeryfowe):** drugi rozpoznawacz (latin PP-OCRv5) i korekta słownikowa (Morfeusz): diakrytyki pisma ORA 17% -> 83%, skanu 92,3% -> 94,8%, zdjęcia zgiętego 82,3% -> 90,4%.
4. **Anonimizacja (7 stron, 19 danych):** 13/19 -> 18/19 po poprawkach 0.1.38; pozostała sygnatura (polityka sygnatur, nie wyciek). Konkurencja: GLiNER 10/19, Presidio 6/19, spaCy 3/19.
5. **Spójność symboli:** jedna osoba lub firma = jeden symbol mimo różnych zapisów OCR; 13 -> 7 symboli na 7 podmiotów.
6. **Najsłabszy punkt: szybkość.** Tesseract jest 10-20 razy szybszy (przy kilkukrotnie większej liczbie błędów).

## Dokumenty

| Zestaw | Opis | Stron |
|---|---|---:|
| Skan | umowy, płaski skan z odręcznymi wpisami (z 54-stronicowego pliku) | 7 |
| ORA | pismo okręgowej rady adwokackiej, czcionka szeryfowa | 1 |
| Zgięte | postanowienie o umorzeniu dochodzenia, zdjęcia telefonem ze zgięciami (dok. A z raportu 2026-10-18) | 5 |

## 1. OCR

| Narzędzie | Skan: CER / pola krytyczne | ORA: CER / diakrytyki | Zgięte: CER / zgubione wiersze | Czas na stronę |
|---|---|---|---|---|
| Lex 0.1.36 | 6,05% / 30 z 30 | 5,65% / 17% | 73,6% / 120 z 206 | 11,5 s |
| Lex 0.1.37 | 6,05% / 30 z 30 | 5,65% / 17% | 7,7% / 7 z 206 | 17 s |
| **Lex 0.1.38** | **5,85% / 30 z 30** | **4,35% / 83%** | **7,9% / 7 z 206** | 17,5 s |
| docTR | 4,04% / 28 z 30 | 10,7% / 83% | 34,1% / 77 | 7 s (+15 s ładowania) |
| Tesseract | 4,99% / 28 z 30 | 33,7% / 75% | 38,8% / 92 | 1,4 s |
| OCRmyPDF | 6,17% / 29 z 30 | 46,8% / 58% | 40,3% / 96 | 2,6 s |
| EasyOCR | 6,1% / 27 z 30 | 15,3% / 83% | 42,2% / 98 | 15 s (+15 s ładowania) |
| page-dewarp + Tesseract | 8,6% / 26 z 30 | 63,6% / 25% | 31,6% / 75 | 4,6 s |

Cały 54-stronicowy skan: Tesseract 43 s, OCRmyPDF 49 s, Lex 0.1.37 774 s.

- CER skanu Lex 5,85% obejmuje odręczne wpisy, które aplikacja wydziela do przeglądu. Bez nich: **Lex 2,33%**, docTR 4,04%, Tesseract 4,99%. Przewaga konkurencji w pierwszym pomiarze wynikała ze sposobu liczenia.
- Pola krytyczne: numery, daty, PESEL, sygnatury. Konkurencja gubi 1-4 z 30.

### Zmiany OCR w 0.1.38

| Zmiana | Efekt |
|---|---|
| Drugi rozpoznawacz latin PP-OCRv5 (8 MB, opcjonalny w instalatorze); przy tych samych literach wygrywa odczyt z większą liczbą polskich znaków | ORA: diakrytyki 17% -> 83%, CER 5,65% -> 4,35%; skan: CER 6,05% -> 5,85%; czas +4% |
| Korekta słownikowa (Morfeusz, osobny proces): słowo nieznane -> jedyne znane w zasięgu typowych pomyłek OCR („Spóika” -> „Spółka”) | skan: diakrytyki 92,3% -> 94,8%, CER 2,42% -> 2,33%; zgięte: 82,3% -> 90,4%, CER 7,9% -> 7,63%; pola krytyczne bez zmian |
| Obce akcenty zamieniane na polskie lub usuwane (ž->ż, č->ć, á->a) | drugi rozpoznawacz nie wygrywa obcymi znakami |
| Kontrola zgięcia z mapy prawdopodobieństwa zwykłej detekcji zamiast drugiej detekcji | 0,06 s zamiast 4,7-6,5 s na stronę, te same decyzje; 7 stron skanu 125 s -> 105 s |
| Tryb zgięcia zastępuje stronę tylko, gdy czyta więcej pewnych liter | pusta strona z przebitką nie daje już śmieci („注 ははは”) |

**Odrzucone:** PP-OCRv6_small (gorszy), PP-OCRv5_server (brak ś, ź, Ą, Ę), uproszczona detekcja zgięć (błędy w obie strony), paddle 3.3.x (oneDNN nie obsługuje detektora PP-OCRv6, OCR 5,4x wolniejszy; przypięte 3.2.2).

## 2. Anonimizacja (7 stron po OCR 0.1.38, 19 danych osobowych)

| Narzędzie | Zamaskowane | Utrata treści | Czas |
|---|---:|---:|---:|
| **Lex 0.1.38 (po poprawkach)** | **18 z 19** | 0 | ok. 33 s |
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

1. **Szybkość:** od 0.1.37 płaski skan jest wolniejszy niż w 0.1.36 (7 stron: 105 s wobec 83 s); różnicę robi drugi rozpoznawacz polskich znaków (ok. 2 s na stronę). Linii nie da się bezpiecznie odfiltrować z góry, bo brak ogonków zdarza się też przy wysokiej pewności.
2. **Pismo ręczne:** żadne narzędzie nie odczytuje poprawnie odręcznych poprawek i podpisów; aplikacja oznacza je do przeglądu.
3. **Mała próba:** jeden zgięty dokument; próg trybu zgięcia dobrany na nim.
4. **Pusta strona z przebitką:** nadal kilka śmieciowych znaków (jak w 0.1.36).

## Wersje

- Lex 0.1.37: tryb zgięcia, ramki wielokątne, biała lista dla wariantów OCR.
- Lex 0.1.38: drugi rozpoznawacz, korekta słownikowa, poprawki anonimizacji z tego raportu, jeden symbol na podmiot.
- Konkurencja: docTR, Tesseract 5.3.4 (pol), OCRmyPDF 17.13, EasyOCR (pl), page-dewarp + Tesseract, GLiNER, Presidio + spaCy pl, spaCy pl.

Skrypty pomiarowe: `../2026-10-18-ocr-zgiecia/skrypty/` (`ocr_metrics.py`, `anon_score2.py`, `lex_anon_reg.mts`).

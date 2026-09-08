# Kwalifikator Karnomaterialny v3.0 — INDEKS (podzielony 2026-08-20, naprawa F-78)
# Moduł: Drzewo Decyzyjne Podobnych Czynów Zabronionych
# Dla: prawo-polskie-v2 / `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` / analiza-sadowa-v6

> ⚡ **ZMIANA STRUKTURALNA 2026-08-20 (F-78):** ten plik był 2109 linii —
> ryzyko gubienia kontekstu przy pracy nad pojedynczym blokiem oraz przy
> wczytywaniu całości do jednej analizy. Treść PODZIELONA na 8 plików w
> katalogu `kwalifikator-karnomaterialny/` (podkatalog `modules/`). TEN
> plik pozostaje pod NIEZMIENIONĄ nazwą i pełni rolę LEKKIEGO INDEKSATORA
> — dzięki temu ~30 innych plików w systemie, które odsyłają do
> `mod-KK-kwalifikator-karnomaterialny.md`, NIE WYMAGAJĄ EDYCJI (decyzja
> architektoniczna: jeden punkt wejścia zamiast aktualizacji każdego
> odsyłacza z osobna). Wczytaj TEN plik najpierw, potem — na podstawie
> tabeli niżej — WYŁĄCZNIE właściwy plik części z podkatalogu.

---

## ZASADA NACZELNA

> Nigdy nie kwalifikuj czynu bez przejścia przez drzewo.
> Każda kwalifikacja MUSI być oparta na chronologii faktów, nie na pierwszym pasującym przepisie.
> Przepisy oznaczone ⚠️ weryfikuj w isap.sejm.gov.pl przed każdą analizą — zakaz cytowania z pamięci.

---

## JAK UŻYWAĆ TEGO MODUŁU (zaktualizowane o krok 0 — nawigację)

```
KROK 0 — Wybierz właściwą CZĘŚĆ z tabeli niżej wg tematu sprawy i wczytaj
  WYŁĄCZNIE ten jeden plik (`view kwalifikator-karnomaterialny/part-0X-*.md`).
  NIE wczytuj wszystkich 8 części naraz — to unieważniałoby cel podziału
  (mniejszy, spójniejszy kontekst na jedną analizę).

  ⛔ **KROK 0-CROSS — BRAMKA ANTY-SILOSOWA (dodana 2026-08-25b, flaga F-134).**
  Zasada „wczytaj WYŁĄCZNIE jeden plik" jest poprawna dla NAWIGACJI, ale
  tworzy silos dla WARTOŚCI LICZBOWYCH: ta sama sankcja bywa opisana w kilku
  częściach i w modułach spoza kwalifikatora, a naprawa wpisana do jednej
  z nich nie propaguje się do pozostałych. Przypadek zmierzony: naprawa
  zagrożenia art. 178a §1 KK (2 → 3 lata) z 21.05.2026 objęła
  `mod-KK-KPK-framework-szczegolowy.md` i `part-08`, ale NIE `part-04` —
  a UP-3 kieruje sprawy drogowe właśnie do `part-04`. Kto wszedł tą ścieżką,
  strukturalnie nie mógł zobaczyć wartości poprawnej.

  Dlatego: jeżeli z części, którą wczytałeś, zamierzasz PODAĆ DALEJ
  konkretną WARTOŚĆ LICZBOWĄ (granicę kary, próg kwotowy, promile, termin),
  wartość ta NIE pochodzi z tego pliku jako źródła — pochodzi z aktu
  prawnego. Zweryfikuj ją w źródle w tej samej odpowiedzi (HARD GATE,
  reguła 24 VER-GRAIN routera). Sam odczyt części kwalifikatora NIE zalicza
  weryfikacji, nawet gdy wartość jest tu opatrzona znacznikiem ✅ [VER] —
  ten znacznik dokumentuje stan na DATĘ przy nim podaną, nie stan dzisiejszy.

  ⛔ Odwrotnie dla EDYCJI: naprawiając wartość w którejkolwiek części, ustal
  najpierw wszystkie miejsca jej wystąpienia w całym skillu (wyszukanie po
  numerze artykułu w plikach `modules/`), a naprawę wprowadź we WSZYSTKICH
  naraz. Naprawa w jednym pliku = flaga niezamknięta.

KROK 1 — Zbierz fakty przed drzewem:
  □ Co sprawca zabrał / zrobił? (przedmiot czynu)
  □ Kiedy nastąpiła każda czynność? (chronologia — KRYTYCZNA)
  □ Wobec kogo użyto przemocy / groźby / podstępu?
  □ ILE OSÓB brało udział po stronie sprawcy/napastników? (KRYTYCZNE przy
    czynach przeciwko zdrowiu — patrz część 2, pułapka BLOK B vs BLOK I)
  □ Jaka była wartość mienia? (aktualny próg: 800 zł od 01.10.2023 — weryfikuj)
  □ Czy były wcześniejsze epizody? (czyn ciągły — art. 12 §1 KK)
  □ Jaki był cel działania sprawcy? (zamiar kierunkowy)

KROK 2 — Wejdź do właściwego BLOKU tematycznego (patrz tabela nawigacyjna).

KROK 3 — Idź przez drzewo pytanie po pytaniu. Nie pomijaj kroków.

KROK 4 — Na końcu drzewa: PRZEPIS + ZAGROŻENIE + LINIA OBRONY.

KROK 5 — Sprawdź SEKCJĘ NIUANSÓW (część 8) dla wybranego przepisu.

KROK 6 — Uruchom TEST KOŃCOWY P1–P5 (część 8, na końcu).
```

---

## TABELA NAWIGACYJNA — KTÓRY BLOK, W KTÓREJ CZĘŚCI

| BLOK | Temat | Artykuły / zakres | Plik |
|---|---|---|---|
| 0 | Część ogólna KK — klasyfikacja, formy winy, kontratypy | art. 1-116 (wprowadzenie teoretyczne) | `part-01-ogolny-mienie-rozboj.md` |
| A | Przestępstwa rozbójnicze i kradzieżowe | art. 278-282 (⚡ najczęstszy błąd: 280 vs 281) | `part-01-ogolny-mienie-rozboj.md` |
| L | Uszkodzenie mienia | art. 288 i pokrewne | `part-01-ogolny-mienie-rozboj.md` |
| B | Przestępstwa przeciwko zdrowiu i życiu — uszczerbek INDYWIDUALNY | art. 156, 157, 217 | `part-02-zdrowie-zycie-pobicia.md` |
| I | Zabójstwa (art. 148-150) i pobicia/bójki ZBIOROWE (art. 158-159) | art. 148-150, 155, 158-159 | `part-02-zdrowie-zycie-pobicia.md` — ⚠️ **PUŁAPKA:** przy ≥2 napastnikach lub ≥3 uczestnikach zawsze sprawdź TĘ część, nie tylko BLOK B |
| C | Przestępstwa oszukańcze | art. 286 i pokrewne | `part-03-oszustwa-gospodarcze.md` |
| G | Przestępstwa informatyczne i gospodarcze | hacking, tajemnica, oszustwo informatyczne | `part-03-oszustwa-gospodarcze.md` |
| D | Przestępstwa narkotykowe | posiadanie/obrót/uprawa | `part-04-narkotyki-drogowe.md` |
| E | Przestępstwa drogowe | alkohol, wypadek | `part-04-narkotyki-drogowe.md` |
| F | Przestępstwa przeciwko wolności | groźba, stalking, zmuszanie, pozbawienie wolności | `part-05-wolnosc-seksualne.md` |
| J | Przestępstwa seksualne, w tym wobec dzieci i osób niepełnosprawnych | art. 197-205 — ⛔ temat wysoce wrażliwy | `part-05-wolnosc-seksualne.md` |
| H | Przestępczość zorganizowana | art. 258 i Rozdział XXXII | `part-06-zorganizowana-nienawisc-deepfake.md` |
| Q | Przestępstwa z nienawiści / mowa nienawiści | art. 256-257 i pokrewne | `part-06-zorganizowana-nienawisc-deepfake.md` |
| R | Deepfake i manipulacja głosem/obrazem | ⚠️ brak dedykowanego typu — klasyczne przepisy KK | `part-06-zorganizowana-nienawisc-deepfake.md` |
| K | Kontratypy ogólne — obrona konieczna, stan wyższej konieczności | art. 25-31 | `part-07-kontratypy-zbieg-sankcje.md` |
| M | Zbieg przestępstw i kara łączna | art. 85-92a | `part-07-kontratypy-zbieg-sankcje.md` |
| N | Środki zabezpieczające | art. 93-100 (niepoczytalność) | `part-07-kontratypy-zbieg-sankcje.md` |
| O | Zatarcie skazania | art. 106-108 | `part-07-kontratypy-zbieg-sankcje.md` |
| P | Kary, środki karne, zasady wymiaru kary | art. 32-63 | `part-07-kontratypy-zbieg-sankcje.md` |
| — | Sekcja niuansów — najczęstsze błędy kwalifikacyjne | cross-block | `part-08-referencje-master-lista.md` |
| — | Test końcowy P1-P5 (OBOWIĄZKOWY) | — | `part-08-referencje-master-lista.md` |
| — | Sekcja weryfikacji online | — | `part-08-referencje-master-lista.md` |
| — | Powiązane przepisy — master lista | tabela zbiorcza wszystkich przepisów | `part-08-referencje-master-lista.md` |
| — | Instrukcja integracji z innymi skillami | — | `part-08-referencje-master-lista.md` |

---

## ⚠️ ZASADY PODZIAŁU — DLA PRZYSZŁYCH SESJI AUDYTOWYCH

- Bloki pogrupowano wg BLISKOŚCI MERYTORYCZNEJ, nie tylko rozmiaru — np.
  BLOK B i BLOK I (oba: zdrowie/życie) CELOWO w JEDNYM pliku, żeby
  pułapka kwalifikacyjna między nimi (indywidualny uszczerbek vs
  zbiorowe pobicie) była widoczna w JEDNYM kontekście, a nie rozerwana
  między plikami.
- ŻADEN plik części nie przekracza ~540 linii (najkrótszy: 89, najdłuższy:
  537) — wszystkie 8 wielokrotnie mniejsze od oryginalnych 2109.
- Ten plik (indeks) NIE zawiera treści merytorycznej samych drzew — tylko
  nawigację. Jeśli edytujesz treść merytoryczną, edytuj WŁAŚCIWY plik
  części, NIE ten indeks.
- Pełna historia zmian przed podziałem — patrz `AUDIT-JOURNAL.md`,
  wpisy z 2026-07-15 (sesja 6-częściowa) i 2026-07-17 (BLOK M-R).
- Zawartość zweryfikowana jako 100% kompletna po podziale: suma linii
  8 plików części = liczba linii oryginału minus nagłówek (ZASADA
  NACZELNA + JAK UŻYWAĆ, zachowane W TYM indeksie).

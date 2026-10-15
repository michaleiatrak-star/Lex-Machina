# OCR i anonimizator Lex Machina vs narzędzia darmowe i komercyjne — test na 2 realnych dokumentach

Data: 2026-10-15. Testowane wersje `lex-machina-aplikacja`:

| Oznaczenie | Commit | Uwagi |
|---|---|---|
| 0.1.34 | `main` @ `7442fe4` | pierwszy przebieg |
| **0.1.35** | `main` @ `fab03eb4` (wydanie `bb002b4b`, #78) | wersja 0.1.35 we wszystkich manifestach |
| **0.1.35 + poprawka** | `3a5e3410` na `fix/kwoty-ocr-firmy` | patch: [`poprawka-aplikacji/`](poprawka-aplikacji/) — **niewypchnięty** |

## Najważniejsze wnioski

1. **OCR 0.1.35 jest najlepszy z darmowych na obu dokumentach** po pełnej ścieżce aplikacji (PaddleOCR -> rozdzielanie słów -> czyszczenie): CER **3,0%** i **2,7%**, 1 zgubiona linia na ~95. 0.1.34 gubiło 7–12 linii przez prostowanie zdjęcia.
2. **Anonimizator 0.1.35 na dokumencie spoza próby (orzeczenie): 6/8 — wyciek daty urodzenia** („Data i miejsce urodzenia ...”). Poprawka: **7/8**; ósma pozycja to sygnatura sprawy, zostawiana celowo.
3. **Dokument 1 (pismo) nie mierzy już uogólnienia** — reguły 0.1.35 pisano pod niego (komentarze i testy w kodzie cytują jego ciągi). Na nim 0.1.35 i poprawka: 20/20.
4. Konkurenci darmowi (Presidio, spaCy, GLiNER) gubią identyfikatory polskie: na orzeczeniu 3–4/8 (bez dowodu osobistego, daty urodzenia, adresu; spaCy i GLiNER także bez PESEL).
5. **Komercyjnych usług nie testowano na dokumentach** — brak kluczy API, a dokumenty zawierają dane osobowe (orzeczenie: dane o zdrowiu, art. 9 RODO). Porównanie komercyjne z dokumentacji producentów (sekcja 4).

## Korekta wcześniejszej wersji raportu

Wcześniejsza wersja zawierała trzy błędne wnioski:

| Było | Jest | Przyczyna błędu |
|---|---|---|
| Kwoty przekłamane (`20.ooo,00 zł`) | Aplikacja już je poprawia (`restoreOcrSpacing`, zawsze włączone) | oceniany był surowy wynik workera OCR, nie tekst po ścieżce aplikacji |
| Firma kancelarii maskowana niekonsekwentnie | W 0.1.35 spójnie na wszystkich stronach | harness tworzył osobny sejf na stronę; aplikacja ma jeden sejf i 2 przebiegi |
| `package.json` = 0.1.34 | `main` ma 0.1.35 wszędzie | testowana była gałąź robocza przed wydaniem |

Harness odwzorowuje teraz `DocumentService.review` i `finalize` (jeden sejf, dwa przebiegi, `restoreOcrSpacing` + `normalizeOcrPage`).

## Dokumenty testowe

| | Dok. 1 | Dok. 2 |
|---|---|---|
| Rodzaj | wezwanie do zapłaty + pełnomocnictwo | orzeczenie o stopniu niepełnosprawności |
| Strony / słowa | 3 / 812 | 2 / 1022 |
| Obraz | zdjęcie telefonem, perspektywa, rozmycie s. 2 | zdjęcie telefonem, ucięty lewy margines s. 1 |
| Dane | osoby, adres, IBAN, numery wpisu, NIP/KRS/REGON | PESEL, dowód osobisty, data urodzenia, adres, **dane o zdrowiu** |
| W próbie? | tak (reguły pod niego pisane) | **nie** |

Ground truth: ręczna transkrypcja na wycinkach pełnej rozdzielczości. Środowisko: 4 vCPU, bez GPU, wszystko lokalnie.

## 1. OCR

| Silnik | Dok. 1 CER | Dok. 1 zgub. linie | Dok. 1 pola kryt. (31) | Dok. 2 CER | Dok. 2 zgub. linie | Dok. 2 pola kryt. (29) | Czas / stronę |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Lex 0.1.35, pełna ścieżka** | **3,0%** | **1** | **30** | **2,7%** | **1** | **25** | ~60–90 s |
| Lex 0.1.35, surowy PaddleOCR | 3,5% | 1 | 28 | 3,4% | 1 | 23 | |
| Lex 0.1.34 (prostowanie) | 10,3% | 7 | 26 | 20,0% | 12 | 21 | |
| Tesseract 5.3.4 | 24,3% | 13 | 28 | 6,7% | 9 | 24 | 2–3 s |
| OCRmyPDF 17.13 | 45,0% | 33 | 24 | 12,9% | 16 | 22 | 2–3 s |
| docTR (PARSeq multilingual) | 18,5% | 9 | 25 | 18,1% | 9 | 23 | 10–65 s |
| EasyOCR | 23,0% | 15 | 20 | 24,1% | 26 | 15 | 20–27 s |
| Surya 0.17 | — | — | — | — | — | — | >10 h (przerwany) |

WER pełnej ścieżki Lex: 7,4% / 9,5%. Tesseract na dok. 2 ma WER 11,4% i lepsze diakrytyki surowego tekstu (85% vs 70%), ale gubi 9 linii (pieczątki, nagłówki).

Słabości OCR Lex na dok. 2 (po ścieżce aplikacji):
- sklejenia nagłówka pola z imieniem i nazwiskiem (`nazwiskoIMIĘ`) oraz utrata „ł” — anonimizator i tak je maskuje;
- czerwone pieczątki: nazwa miejscowości urzędu i imię z pieczątki odczytane z błędami.

## 2. Anonimizacja

Wejście: tekst ground truth (jakość samego anonimizatora) oraz pełna ścieżka OCR -> anonimizacja (e2e). Wyciek liczony także w pisowni bez polskich znaków.

**Dok. 2 — orzeczenie (poza próbą), 8 elementów**

| Narzędzie | Osoby (3) | PESEL / dowód / data ur. (3) | Adres (1) | Sygnatura (1) | Razem GT | Razem e2e | Fałszywe trafienia |
|---|---:|---:|---:|---:|---:|---:|---|
| **Lex 0.1.35 + poprawka** | 3 | **3** | 1 | 0 | **7/8** | **7/8** | adres i 2 telefony urzędu (z pieczątki) |
| Lex 0.1.35 | 3 | 2 | 1 | 0 | 6/8 | 6/8 | jw.; adres przecinał linię i ciął numer telefonu |
| Presidio + spaCy pl | 3 | 1 | 0 | 0 | 4/8 | — | — |
| spaCy pl | 3 | 0 | 0 | 0 | 3/8 | — | — |
| GLiNER multi PII | 3 | 0 | 0 | 0 | 3/8 | — | — |

Dane o zdrowiu (symbol przyczyny niepełnosprawności, specjalizacja przewodniczącej składu z pieczątki) zostają w tekście u wszystkich narzędzi — w Lex z założenia, bo są potrzebne do analizy prawnej. Specjalizacja lekarza z pieczątki pośrednio ujawnia rodzaj schorzenia.

**Dok. 1 — pismo (w próbie), 20 elementów**

| Narzędzie | Razem GT | Razem e2e | Utracona treść prawna |
|---|---:|---:|---|
| **Lex 0.1.35 + poprawka** | **20/20** | **20/20** | e2e: „Sądowego” (OCR bez „ą” = nazwisko z PESEL) |
| Lex 0.1.35 | 20/20 | 20/20 | „Radców Prawnych” na każdej stronie; e2e także „Sądowego” |
| GLiNER multi PII | 10/20 | — | ~30 słów: „Pana”, „Pracownik”, „Pracodawcy” |
| Presidio + spaCy pl | 9/20 | — | ~33: „Katowice”, „ul.” |
| spaCy pl | 7/20 | — | jw. |

## 3. Co zmienia poprawka (`3a5e3410`)

| Zmiana | Plik | Efekt zmierzony |
|---|---|---|
| Data urodzenia po „Data i miejsce urodzenia” / „data i miejsce ur.” | `privacy/identifiers.ts` | dok. 2: 6/8 -> 7/8 |
| Nazwa spółki osobowej bez słów zawodu („Kancelaria Adwokatów i Radców Prawnych X sp.k.”) | `privacy/firm-names.ts` | dok. 1: „Radców Prawnych” zostaje |
| Nagłówek roli nad nazwiskiem przy cięciu nazwy na końcu linii | `privacy/pseudonymizer.ts` | jw. |
| Forma prawna w pisowni OCR (`Spólka`, `Sp6łka`, `sp. z 0.o.`, `sp. zo.o.`) | `privacy/firm-names.ts` | gdy brak słownika SGJP (Morfeusz) |
| `tel.`/`fax` w następnej linii nie jest częścią nazwy ulicy | `privacy/polish_pii_gazetteer.py` | dok. 2: adres urzędu nie tnie telefonu |
| Reguły typowych błędów w kwotach: o/O/D->0, l/I/\|->1, S->5, B->8, Z->2; `20.000.00` i `20,000,00` -> `20.000,00`; `zl` -> `zł`. Tylko przy walucie i tylko gdy wynik to poprawna kwota; każda zmiana w `page.corrections` | `ocr-amounts.ts`, `ocr-correction.ts` | na tych dokumentach bez zmian (o->0 robi już `restoreOcrSpacing`); pokrywa pozostałe pomyłki i brak słownika |
| Czyszczenie OCR bez modelu zawsze, nie tylko z korektą AI | `document-service.ts` | reguły kwot działają w trybie domyślnym |
| Podgląd: 2 przebiegi przy wielu stronach, jak zatwierdzenie | `document-service.ts` | propozycje w podglądzie = wynik po zatwierdzeniu |

Testy: `tsc` czysto; pełny `vitest`: 2660 zaliczonych / 72 niezaliczone vs `main` 2652 / 72 — **te same 72 porażki na czystym `main`** (środowisko kontenera, m.in. KDF w `auth/crypto`). 8 nowych testów; każdy nowy test anonimizacji pada na `main` i przechodzi z poprawką. Dane w testach fikcyjne.

## 4. Rynek komercyjny (bez testu na dokumentach)

| Usługa | Polski | Cena katalogowa | Uwagi |
|---|---|---|---|
| Azure Document Intelligence (Read) | tak | ~1,50 USD / 1000 s. | najlepszy na druku w teście AIMultiple (96%) |
| Google Document AI | tak | — | brak niezależnego testu na polskim |
| Mistral OCR 4 | tak | 4 USD / 1000 s. (batch 2) | wynik OmniDocBench od producenta |
| ABBYY FineReader / Engine | tak | licencja | skuteczność głównie z materiałów producenta |
| **AWS Textract** | **nie** | — | brak ą ć ę ł ń ś ź ż w rozpoznawanych znakach |
| Azure AI Language — PII | tak | ~1 USD / 1000 rekordów | jedyna duża chmura z potwierdzonym polskim PII |
| Google Sensitive Data Protection | częściowo | 1–3 USD / GiB | wykrywacze PL do weryfikacji (`infoTypes.list`) |
| AWS Comprehend PII | nie | — | tylko EN/ES |
| Private AI / Limina | deklarowane 50+ jęz. | indywidualnie | brak potwierdzenia PL |

Usługi chmurowe przetwarzają dokument poza urządzeniem; przy orzeczeniu o niepełnosprawności to przekazanie danych szczególnej kategorii podmiotowi przetwarzającemu.

## 5. Pozostałe ryzyka

1. Dwa dokumenty to mała próba; 7/8 na dok. 2 to wynik jednego dokumentu poza próbą.
2. „Sadowego” (OCR bez „ą” po „Komornika”) maskowane jako osoba — nazwisko istnieje w PESEL.
3. Dane o zdrowiu nie są oznaczane; brak flagi „dokument zawiera dane szczególnej kategorii” przed wysyłką do modelu zewnętrznego.
4. Nie testowano: lokalnego modelu wizyjnego dla wątpliwych linii i korekty Bielikiem (modele kilka GB).

## Odtworzenie

Skrypty w [`skrypty/`](skrypty/). Ground truth, wyniki OCR i listy elementów (`gold_local.json`) zawierają dane osobowe i nie są w repozytorium.

```bash
python run_paddle_var.py ...                                   # warianty OCR; NPAGES=2 dla dok. 2
LEX_RUNTIME_SRC=.../app/lex-runtime/src npx tsx normalize.mts out/paddle135.json out/n_main
NPAGES=2 python ocr_metrics.py paddle135,n_main,tess,easy,doctr gold_local.json
npx tsx lex_anon.mts out/lex_main_e2e.json out/n_main_p1.txt out/n_main_p2.txt
NPAGES=2 python anon_baselines.py presidio|spacy|gliner
NPAGES=2 python anon_score.py gold_local.json lex_main_gt,lex_main_e2e,presidio,spacy,gliner
```

Źródła danych rynkowych: [Azure PII — języki](https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/language-support), [AWS Textract — limity i znaki](https://docs.aws.amazon.com/textract/latest/dg/limits-document.html), [AIMultiple OCR benchmark](https://aimultiple.com/ocr-accuracy), [Mistral OCR](https://mistral.ai/news/mistral-ocr/), [Eden AI — Mistral OCR 4](https://www.edenai.co/post/mistral-ocr-4-vs-top-document-parsing-apis-features-benchmarks-and-integration-guide), [ceny Azure DI](https://docs.litellm.ai/docs/providers/azure_document_intelligence), [ceny PII](https://www.beri.net/article/pii-redaction-pricing-comprehend-azure-google-presidio-cost-per-million-characters), [Google SDP infoTypes](https://docs.cloud.google.com/sensitive-data-protection/docs/high-sensitivity-infotypes-reference).

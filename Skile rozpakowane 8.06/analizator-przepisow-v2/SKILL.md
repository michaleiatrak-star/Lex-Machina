---
name: analizator-przepisow-v2
version: 2.0
type: executive-analiza
status: production
compatibility: "web_search, web_fetch, show_widget"
description: Analizuje przepisy prawa polskiego. Stosuj gdy użytkownik pyta o artykuł, przesłanki, wykładnię, orzecznictwo, zbieg norm, historię zmian przepisu lub chce sprawdzić czy przepis stosuje się do jego sytuacji. v2: automatyczne orzecznictwo (3 orzeczenia + alert rozbieżności linii), mapa powiązań norm, historia nowelizacji z obsługą vacatio legis, interaktywne drzewo przesłanek krok-po-kroku, kontekst praktyczny dla laika.
---

# Analizator Przepisów Prawnych v2

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Przed podaniem jakiegokolwiek przepisu, artykułu, numeru Dz.U. lub sygnatury orzeczenia:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

Profesjonalne narzędzie do analizy przepisów prawnych z widgetem wizualnym, automatycznym orzecznictwem (MOD-ORZECZ-PRZEPIS), mapą powiązań norm, historią zmian z obsługą vacatio legis, interaktywnym drzewem przesłanek i kontekstem praktycznym dla laika. (v2)

---

## ZASADA NACZELNA

> ⛔ HARDGATE — Nigdy nie cytuj przepisów z pamięci. Każdy przepis MUSI być pobrany z ISAP lub innego oficjalnego źródła zgodnie z procedurą w `shared/PRAWO-HARDGATE.md`. Jeśli wszystkie źródła niedostępne — oznacz `⚠️ [NIEWERYFIKOWANE]` i kontynuuj bez treści przepisu.

---

## MODUŁ 0 — INTAKE I ROUTING

### Krok 0.1 — Zbierz dane wejściowe

| Element                | Przykład                             | Wymagany? |
|------------------------|--------------------------------------|-----------|
| Identyfikator przepisu | art. 415 KC / § 3 ust. 2 pkt 1 uVAT | TAK       |
| Data analizy           | dziś / 1.01.2020 / przed nowelizacją | TAK       |
| Typ sprawy             | cywilna / karna / admin / pracownicza| TAK       |
| Stan faktyczny         | opis sytuacji, dokumenty, fakty      | TAK       |
| Strona analizująca     | powód / pozwany / oskarżony / organ  | zalecane  |
| Cel analizy            | obrona / atak / zgodność / wykładnia | zalecane  |

### Krok 0.2 — Wybierz ścieżkę analizy

```
A) Jeden przepis + stan faktyczny   → Moduł 1 → 2 → 3 → 7A → 7C → 4 → WIDGET
B) Wiele przepisów / zbieg norm     → Moduł 1 → 2 → 3 → 7A → 7B → 7C → 4 → 5 → WIDGET
C) Stan prawny na datę historyczną  → Moduł 1H → 2 → 7C → 4 → WIDGET
D) Linia orzecznicza przepisu       → Moduł 1 → 7 → 7A
E) Tylko wyjaśnienie przepisu       → Moduł 1 → 2 → 7D → Raport uproszczony
F) Brak danych od użytkownika       → WIDGET WYBORU PRZEPISU → potem A–E
G) Użytkownik-laik (wykryty)        → +7D (kontekst praktyczny) do każdej ścieżki
H) Przepis z odesłaniem do innych   → +7B (mapa powiązań) do każdej ścieżki
```

### Krok 0.3 — WIDGET WYBORU PRZEPISU

Uruchom gdy: użytkownik nie podał przepisu, pyta o "widget wyboru", "wyszukaj przepis" lub wpisał tylko kodeks bez artykułu.

Wygeneruj interaktywny widget HTML (CSS i JS inline) z następującymi elementami:

NAGŁÓWEK: ikona ⚖️, tytuł "Analizator Przepisów Prawnych v2"

SEKCJA 1 — IDENTYFIKACJA PRZEPISU:
- SELECT "Kodeks / Akt prawny" z grupami optgroup:
  - Prawo cywilne: KC, KPC, KRO, KSH
  - Prawo karne: KK, KPK, KKW, KW, KPW
  - Prawo administracyjne: KPA, PPSA, OP
  - Prawo pracy: KP
  - Inne ustawy: uVAT, uPIT, uCIT, PrBud, RODO, UODO, inne (pole tekstowe)
- INPUT TEXT "Numer artykułu" z podglądem na żywo obok pola (np. "art. 415 KC")
  - Obsługuje: zwykły numer (415), indeks (23¹), paragraf (§ 3 ust. 2 pkt 1)
  - Placeholder: "np. 415 lub 23 ust. 1 pkt 2"
- Szybkie przyciski-badge z popularnymi artykułami per kodeks:
  - KC: 415, 471, 448, 23, 446
  - KPC: 840, 843, 189, 193, 730
  - KK: 278, 286, 190, 193, 177
  - KP: 52, 55, 183a, 94
  - KRO: 56, 58, 61¹

SEKCJA 2 — PARAMETRY (dwie kolumny):
- SELECT "Cel analizy": czy stosuje się / wykładnia przesłanek / linia orzecznicza / stan historyczny / zbieg norm / tryb karny / tryb administracyjny / pełna analiza
- SELECT "Typ sprawy": cywilna / karna / administracyjna / pracownicza / podatkowa / gospodarcza

SEKCJA 3 — DATA STANU PRAWNEGO:
- Checkbox "Data historyczna" → odkrywa date picker
- Tekst: "Stan prawny: aktualny (dziś)" lub "Stan prawny: historyczny [data]"

SEKCJA 4 — STAN FAKTYCZNY:
- TEXTAREA opcjonalne, placeholder "Opisz swoją sytuację..."

PRZYCISK "🔍 Analizuj przepis":
- Disabled gdy brak kodeksu lub artykułu
- onClick → sendPrompt("Analizuj [kodeks] art. [artykuł]. Cel: [cel]. Typ sprawy: [typ]. Stan prawny na: [data]. Stan faktyczny: [treść lub brak]")
- Fallback gdy brak sendPrompt → alert z gotowym promptem

Paleta: --primary #1B3A6B, --accent #C8960C, --bg #F8F7F4, --success #16a34a, --danger #dc2626, --warn #d97706. Czcionka: Segoe UI lub system-ui. Responsywny, min-width 320px.

---

## MODUŁ 1 — WERYFIKACJA I POBRANIE PRZEPISU

### Hierarchia źródeł

1. ISAP — https://isap.sejm.gov.pl — PRIORYTET (tekst jednolity)
2. Sejm RP — https://www.sejm.gov.pl/prawo/prawo.htm
3. EUR-Lex — https://eur-lex.europa.eu — prawo UE implementowane w Polsce
4. UODO — https://uodo.gov.pl — przepisy o ochronie danych
5. BIP właściwego organu — dla rozporządzeń branżowych

### Procedura weryfikacji (OBOWIĄZKOWA)

```
1. web_search: [nazwa aktu] + "tekst jednolity" + rok na ISAP
2. web_fetch tekstu jednolitego
3. Zlokalizuj dokładny przepis (artykuł / paragraf / ustęp / punkt)
4. Sprawdź datę ostatniej nowelizacji i historię zmian
5. Sprawdź czy przepis nie został uchylony lub zmieniony
6. Zapisz DOSŁOWNĄ treść z oficjalnego źródła
```

### Karta Przepisu

```
KARTA PRZEPISU
Akt prawny:         [pełna nazwa + rok + Dz.U.]
Numer przepisu:     [art./§/ust./pkt]
Tekst jednolity z:  [data Dz.U. lub data publikacji ISAP]
Ostatnia zmiana:    [data i numer nowelizacji]
Historia zmian:     [liczba nowelizacji + daty kluczowych]
Status:             Obowiązuje / Zmieniony / Uchylony
Data analizy:       [data stanu prawnego]
Źródło URL:         [link ISAP lub inne źródło]

PEŁNA TREŚĆ PRZEPISU:
[tekst dosłownie z oficjalnego źródła]
```

---

## MODUŁ 1H — STAN PRAWNY NA WYBRANĄ DATĘ

Stosuj gdy użytkownik chce zbadać przepis w stanie na konkretną datę przeszłą.

```
1. Ustal datę docelową: [DD.MM.RRRR]
2. Na ISAP wyszukaj historię nowelizacji danego aktu
3. Zidentyfikuj tekst jednolity obowiązujący W DNIU docelowym
4. Pobierz historyczną wersję przepisu
5. Oznacz wyraźnie: "STAN NA [data]" we wszystkich wynikach
```

### Raport historyczny

```
ANALIZA ZMIAN PRZEPISU W CZASIE
Przepis:          [identyfikator]
Data docelowa:    [DD.MM.RRRR]

Chronologia zmian:
┌──────────────┬─────────────────────┬────────────────────────┐
│ Data zmiany  │ Nowelizacja (Dz.U.) │ Co się zmieniło        │
├──────────────┼─────────────────────┼────────────────────────┤
│ [data]       │ Dz.U. [rok] poz.[n] │ [opis zmiany]          │
└──────────────┴─────────────────────┴────────────────────────┘

Wersja na [datę docelową]: [treść — dosłownie]
Wersja aktualna:           [treść dziś — dosłownie]
Różnice procesowo istotne: [co się zmieniło i jak wpływa]
```

---

## MODUŁ 2 — DEKOMPOZYCJA PRZESŁANEK

### Klasyfikacja struktury logicznej

| Typ         | Symbol        | Opis                          |
|-------------|---------------|-------------------------------|
| Koniunkcja  | A i B i C     | Wszystkie przesłanki łącznie  |
| Alternatywa | A lub B lub C | Wystarczy jedna               |
| Warunkowa   | A → B         | Warunek konieczny             |
| Mieszana    | (A i B) lub C | Grupy przesłanek              |

### Drzewo Przesłanek

> ⚠️ **DRZEWO-LIMIT — przeczytaj przed wygenerowaniem:**
> Drzewo przesłanek jest modelem analitycznym opartym na tekście przepisu pobranego
> z ISAP. NIE jest oficjalną wykładnią prawa ani opinią prawną.
> Struktura logiczna (koniunkcja / alternatywa) wynika z literalnej analizy językowej
> przepisu — może odbiegać od wykładni przyjętej w orzecznictwie.
>
> **ZAKAZ-DRZEWO:** Nie prezentuj wyniku drzewa jako definitywnego rozstrzygnięcia
> bez weryfikacji w Module 7A (orzecznictwo). Jeśli linia orzecznicza jest niejednolita
> lub pojęcia są nieostre — wynik drzewa jest ZAWSZE `?` (niejednoznaczny), niezależnie
> od literalnej struktury logicznej przepisu. Dla laika: dodaj obligatoryjnie sekcję
> 7D z zaznaczeniem ograniczeń analizy.

```
DRZEWO PRZESŁANEK — [numer przepisu]
Skutek prawny: [co wynika z przepisu]
Typ logiczny:  [koniunkcja / alternatywa / mieszany]

P1: [nazwa przesłanki]
    Definicja ustawowa: [jeśli istnieje]
    Treść: [opis]
    Charakter: Konieczna / Alternatywna
    Pojęcia nieostre: [jeśli są → Krok 2.3]

P2: [j.w.]
Pn: [j.w.]

LOGIKA: Wszystkie P1–Pn lacznie / Wystarczy jedna / Wystarczy: [opis]
```

### Weryfikacja pojęć nieostrych

```
POJĘCIE: "[słowo/fraza]"
Definicja ustawowa (ten sam akt): [artykuł + treść]
Definicja ustawowa (inny akt):    [akt + artykuł + treść]
Pojęcie nieostre → wykładnia orzecznicza (Moduł 7)
Pojęcie techniczne → znaczenie branżowe: [źródło]
```

### Wykładnia orzecznicza pojęć nieostrych

Przeszukaj w kolejności:
1. https://www.sn.pl/orzecznictwo — Sąd Najwyższy
2. https://orzeczenia.nsa.gov.pl — NSA / WSA
3. https://orzeczenia.ms.gov.pl — sądy powszechne
4. https://www.trybunal.gov.pl/orzeczenia — Trybunał Konstytucyjny
5. https://saos.org.pl — agregator orzeczeń

---

## MODUŁ 3 — ANALIZA SPEŁNIENIA PRZESŁANEK

### Matryca oceny

```
MATRYCA OCENY PRZESŁANEK
Przepis:             [identyfikator]
Stan prawny na:      [data analizy]
Materiały wejściowe: [lista dokumentów / faktów]

┌─────┬──────────────────────┬────────┬──────────────────────┬─────────┐
│ Nr  │ Przesłanka           │ Status │ Uzasadnienie          │ Pewność │
├─────┼──────────────────────┼────────┼──────────────────────┼─────────┤
│ P1  │ [nazwa]              │ T/N/?  │ [dowód / brak]       │ 85%     │
│ P2  │ [nazwa]              │ T/N/?  │ [dowód / brak]       │ 60%     │
└─────┴──────────────────────┴────────┴──────────────────────┴─────────┘
Legenda: T = Spełniona  N = Niespełniona  ? = Wątpliwa
```

### Analiza szczegółowa przesłanki N lub ?

```
PRZESŁANKA [Pn] — SZCZEGÓŁOWO
Treść:                [cytat z przepisu]
Co musi być wykazane: [fakty 1, 2...]
Na spełnienie (+):    [dokument/fakt → powiązanie]
Przeciw spełnieniu(-): [dokument/fakt → powiązanie]
Braki dowodowe (?):   [czego brak]
Ocena:    spełniona / niespełniona / wątpliwa
Pewność:  [%] — wysoka 80+ / średnia 50-79 / niska <50
```

### Wynik logiczny

```
WYNIK LOGICZNY
Koniunkcja: P1(T) i P2(N) i P3(T) = N — NIE STOSUJE SIĘ
  Blokuje: P2 — [wyjaśnienie]

Alternatywa: P1(N) lub P2(T) = T — STOSUJE SIĘ
  Podstawa: P2 — [wyjaśnienie]

KONKLUZJA:
  T — PRZEPIS STOSUJE SIĘ
  N — PRZEPIS NIE STOSUJE SIĘ
  ? — WYNIK NIEJEDNOZNACZNY — [co go warunkuje]
```

---

## MODUŁ 4 — RAPORT KOŃCOWY

```
RAPORT ANALIZY — [identyfikator przepisu]
Stan prawny na: [data] | Typ sprawy: [typ] | Wygenerowano: [dziś]

1. PRZEPIS (źródło: [URL ISAP])
   [pełna treść]

2. STRUKTURA PRZESŁANEK
   Typ logiczny: [koniunkcja / alternatywa / mieszany]
   Przesłanek: [n] łącznie, koniecznych: [k], alternatywnych: [a]

3. WYNIK: T STOSUJE SIĘ / N NIE STOSUJE / ? NIEJEDNOZNACZNY
   Pewność ogólna: [%]

4. PRZESŁANKI — PODSUMOWANIE
   Spełnione: [lista]
   Niespełnione: [lista + przyczyna]
   Wątpliwe: [lista + co warunkuje]

5. UZASADNIENIE MERYTORYCZNE
   [zwięzłe uzasadnienie — język profesjonalny]

6. LINIA ORZECZNICZA (skrót)
   Dominujące stanowisko: [opis]
   Orzeczenia kluczowe: [sygnatury — tylko zweryfikowane online]

7. RYZYKA I ZASTRZEŻENIA
   [lista ryzyk procesowych, wątpliwości dowodowych]
   ⚠️ DRZEWO-LIMIT (obowiązkowe): Drzewo przesłanek jest modelem analitycznym
   opartym na wykładni literalnej. Wynik może odbiegać od wykładni orzeczniczej.
   Wskaż konkretnie: czy pojęcia nieostre zostały rozstrzygnięte orzecznictwem
   (M7A), czy linia jest jednolita. Jeśli nie — wynik analizy ma charakter
   orientacyjny i wymaga konsultacji z prawnikiem przed podjęciem działań.

8. REKOMENDACJE
   [co zrobić, jakie dowody zebrać, jakie czynności]

9. POWIĄZANE PRZEPISY
   [przepisy powiązane, wyjątki, lex specialis]

10. ŹRÓDŁA — [lista URL]
```

---

## MODUŁ 5 — ZBIEG NORM

```
PORÓWNANIE PRZEPISÓW
┌──────────────┬──────────┬────────┬──────────┬────────────────┐
│ Przepis      │ P1       │ P2     │ Wynik    │ Uwagi          │
├──────────────┼──────────┼────────┼──────────┼────────────────┤
│ art. X ust.Y │ T        │ N      │ N        │                │
│ art. Z §1    │ T        │ T      │ T        │ Lex specialis  │
└──────────────┴──────────┴────────┴──────────┴────────────────┘

ZBIEG NORM:
Typ: kumulatywny / eliminacyjny / pozorny
Przepis właściwy: [który i dlaczego]
Zasada: lex specialis / lex posterior / lex superior / [inna]
```

---

## MODUŁ 6 — TRYBY SPECJALNE

### Tryb A — Przepis karny

```
STRONA PODMIOTOWA:
Forma winy: Umyślna (dolus) / Nieumyślna (culpa) / Obie
  Umyślna: Zamiar bezpośredni / Zamiar ewentualny
Analiza zamiaru w stanie faktycznym: [ocena]

STRONA PRZEDMIOTOWA:
Skutek: Wymagany (materialne) / Niewymagany (formalne)
Związek przyczynowy: [ocena adekwatności]
Przedmiot ochrony: [dobro prawne]
```

### Tryb B — Przepis administracyjny

```
Organ właściwy:        [kto stosuje przepis]
Tryb postępowania:     KPA / Ordynacja podatkowa / inne
Terminy:               [terminy wynikające z przepisu]
Forma rozstrzygnięcia: Decyzja / Postanowienie / inne
```

### Tryb C — Przepis proceduralny (KPC/KPK/PPSA)

```
Etap postępowania:         [kiedy stosuje się]
Inicjatywa:                Z urzędu / Na wniosek
Termin zawity/prekluzyjny: [jeśli dotyczy — KRYTYCZNE]
Skutek niespełnienia:      [konsekwencje procesowe]
```

---

## MODUŁ 7 — LINIA ORZECZNICZA

Stosuj gdy: użytkownik pyta o orzecznictwo, przepis zawiera pojęcia nieostre, wynik jest niejednoznaczny.

```
KROK 7.1 — Identyfikacja kwestii spornych
  Jakie pojęcia/przesłanki są interpretowane różnie?

KROK 7.2 — Wyszukiwanie (TYLKO oficjalne źródła w tej kolejności):
  1. SN: https://www.sn.pl/orzecznictwo
  2. NSA: https://orzeczenia.nsa.gov.pl
  3. TK: https://www.trybunal.gov.pl/orzeczenia
  4. TSUE: https://curia.europa.eu (dla norm UE)
  5. MS: https://orzeczenia.ms.gov.pl
  6. SAOS: https://saos.org.pl

KROK 7.3 — NIGDY nie cytuj sygnatur z pamięci AI.
  Każde orzeczenie zweryfikuj online przed podaniem.

KROK 7.4 — Analiza:
  Stanowisko dominujące / mniejszościowe
  Rozbieżności SN vs SA, NSA vs WSA
  Uchwały SN/NSA wiążące inne sądy
```

### Raport linii orzeczniczej

```
LINIA ORZECZNICZA — [przepis] / [kwestia]
Kwestia sporna: [o co chodzi]

DOMINUJĄCE:
  Treść: [opis wykładni]
  Orzeczenia: [sygnatury — zweryfikowane online]
  Sąd: SN / NSA / TK / sądy powszechne

MNIEJSZOŚCIOWE:
  Treść: [opis]
  Orzeczenia: [sygnatury — zweryfikowane]

HISTORIA: [data] → [zmiana wykładni / uchwała / wyrok TK]

ROZBIEŻNOŚCI: między izbami SN / SN a SA / NSA a WSA / PL a TSUE

REKOMENDACJA: [właściwa wykładnia + ryzyko odmiennej interpretacji]
```

---

## MODUŁ 7A — MOD-ORZECZ-PRZEPIS (automatyczne orzecznictwo do przepisu)

**Uruchamiaj automatycznie** po każdej analizie przepisu — bez żądania użytkownika.  
Cel: pobranie 3 realnych orzeczeń bezpośrednio dotyczących analizowanego przepisu i wykrycie rozbieżności linii orzeczniczych.

### Procedura wyszukiwania

```
KROK A — Sformułuj 3 różne zapytania per źródło:
  q1: [sygnatura art. X §Y] + [nazwa aktu] + "orzeczenie" + rok (bieżący i -2)
  q2: [teza kluczowego pojęcia z Modułu 2] + [kodeks/ustawa]
  q3: [skutek prawny z przepisu] + [dziedzina] + "wyrok" / "uchwała"

KROK B — Źródła w kolejności:
  1. https://saos.org.pl — agregator, najszerszy zasięg
  2. https://www.sn.pl/orzecznictwo — SN (linia wiodąca cywilna/karna)
  3. https://orzeczenia.ms.gov.pl — sądy powszechne SA/SO/SR
  4. https://orzeczenia.nsa.gov.pl — NSA/WSA (jeśli przepis administracyjny)
  5. https://www.trybunal.gov.pl/orzeczenia — TK (jeśli konstytucyjność)

KROK C — Weryfikacja każdego orzeczenia:
  Sprawdź czy URL prowadzi do realnego dokumentu
  Potwierdź sygnaturę i datę
  Jeśli orzeczenie niedostępne → pomiń, wyszukaj kolejne
  NIGDY nie podawaj sygnatury z pamięci AI

KROK D — Klasyfikacja hierarchiczna:
  TIER 1 (linia wiodąca):   SN, NSA, TK, TSUE
  TIER 2 (linia stosowania): SA, WSA
  TIER 3 (przykłady):        SO, SR — dopuszczalne gdy brak Tier 1/2

KROK E — Alert rozbieżności:
  Porównaj tezy zebranych orzeczeń
  Jeśli teza T1 ≠ T2 lub T1 sprzeczna z T3:
    → oznacz "⚠️ LINIA NIEJEDNOLITA"
    → wskaż co powoduje rozbieżność (inna wykładnia pojęcia / inna data / inna izba / zmiana ustawy)
    → wskaż które stanowisko jest dominujące i dlaczego
```

### Format karty orzeczenia

```
┌─────────────────────────────────────────────────────────────┐
│ ORZECZENIE [nr z 1–3] — [Tier 1/2/3]                       │
├──────────────┬──────────────────────────────────────────────┤
│ Sygnatura    │ [sygn. — zweryfikowana online]               │
│ Sąd          │ [pełna nazwa sądu i izby]                    │
│ Data         │ [DD.MM.RRRR]                                 │
│ Teza         │ [jedno zdanie — własne słowa, nie cytat]     │
│ Link         │ [URL do oficjalnego źródła]                   │
│ Relevance    │ ██████░░░░ 6/10 — [jak bezpośrednio dotyczy] │
└──────────────┴──────────────────────────────────────────────┘
```

### Raport MOD-ORZECZ-PRZEPIS

```
ORZECZNICTWO DO PRZEPISU — [identyfikator]
Wyszukano: [data dziś] | Źródła: [lista]

[3 karty orzeczeń według formatu powyżej]

OCENA LINII ORZECZNICZEJ:
  Status: JEDNOLITA ✅ / NIEJEDNOLITA ⚠️ / BRAK DANYCH ❓

  [jeśli NIEJEDNOLITA:]
  Rozbieżność: [co jest sporne — konkretna kwestia]
  Stanowisko A: [opis + orzeczenia] — dominujące / mniejszościowe
  Stanowisko B: [opis + orzeczenia] — dominujące / mniejszościowe
  Przyczyna rozbieżności: [inna wykładnia pojęcia X / zmiana ustawy z dnia Y /
                           rozbieżność izb SN / SN vs SA / wpływ TSUE / inne]
  Rekomendacja praktyczna: [które stanowisko powołać i dlaczego]
```

---

## MODUŁ 7B — MOD-ZBIEZNOSC (mapa powiązań norm)

**Uruchamiaj gdy:** przepis odsyła do innych artykułów / zachodzi zbieg / ścieżka B (wiele przepisów) / użytkownik pyta o "powiązane przepisy" lub "inne artykuły".

```
PROCEDURA:
1. Przeczytaj treść przepisu — wypisz wszystkie odesłania ustawowe
2. Sprawdź ISAP: czy artykuły odsyłające obowiązują
3. Wyszukaj zbieg norm (patrz Moduł 5) i dodaj do mapy
4. Ustal typ relacji dla każdego powiązania

TYP RELACJI:
  → ODESŁANIE BEZPOŚREDNIE: przepis wprost powołuje inny art.
  → LEX SPECIALIS: jeden przepis zawęża/rozszerza drugi
  → ZBIEG KUMULATYWNY: oba stosują się jednocześnie
  → ZBIEG ELIMINACYJNY: jeden wyklucza drugi
  → SKUTEK / PODSTAWA: jeden jest podstawą, drugi skutkiem
  → DEFINICJA: jeden definiuje pojęcie użyte w drugim
```

### Format mapy powiązań (tekstowy — gotowy do widget)

```
MAPA POWIĄZAŃ — [przepis główny]

[przepis główny]
  ├── [art. X] — ODESŁANIE BEZPOŚREDNIE — [dlaczego powiązany]
  ├── [art. Y §Z] — LEX SPECIALIS — [w jakim zakresie]
  ├── [art. A] — DEFINICJA — [jakie pojęcie definiuje]
  └── [art. B] — ZBIEG KUMULATYWNY — [gdy stosuje się razem]
       └── [art. C] — SKUTEK — [co z tego wynika]

Węzłów: [n] | Zbiegów: [k] | Lex specialis: [l]
```

---

## MODUŁ 7C — MOD-HISTORIA-ZMIAN + MOD-VACATIO-LEGIS (nowelizacje przepisu)

**Uruchamiaj automatycznie** przy każdej analizie — w tle, bez przerywania głównego flow.  
Wynik prezentuj w dedykowanej zakładce widgetu (Moduł 8 Zakładka 6).

**Szczególnie krytyczny dla:** przepisów podatkowych (PIT/VAT/CIT), KPA, KPC, KP, RODO, prawa budowlanego.

**Moduł vacatio legis** — uruchom przy wykryciu:
- aktywnego vacatio legis (akt opublikowany, jeszcze nie obowiązuje),
- nowelizacji wieloetapowej (różne daty wejścia w życie),
- rozbieżności między wersją w dacie zdarzenia a wersją aktualną.
```
view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
```
W środowisku produkcyjnym:
```
view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
```

```
PROCEDURA:
1. ISAP — pobierz historię nowelizacji aktu prawnego (wykaz zmian)
   URL: https://isap.sejm.gov.pl → wyszukaj akt → zakładka "Historia"
2. Ogranicz do ostatnich 3 lat (domyślnie) lub wskazanego okresu
3. Dla każdej nowelizacji: ustal co się zmieniło W ANALIZOWANYM PRZEPISIE
   (pomiń nowelizacje innych artykułów)
4. Oceń istotność zmiany dla analizowanej sprawy

ALERT KRYTYCZNY:
  Jeśli przepis zmieniony w ostatnich 6 miesiącach → ⚠️ ŚWIEŻA NOWELIZACJA
  Jeśli zmiana w trakcie analizowanego okresu → ⚠️ STAN PRAWNY NIESTAŁY
  Jeśli wykryto vacatio legis lub nowelizację wieloetapową:
    → view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
    → uruchom procedurę VL-1→VL-4, dodaj alerty VL-A/VL-B/VL-C do raportu
```

### Format raportu historii zmian

```
HISTORIA ZMIAN — [identyfikator przepisu]
Źródło: ISAP [URL] | Okres: ostatnie 3 lata

┌─────────────┬──────────────────────┬────────────────┬──────────────────┐
│ Data zmiany │ Nowelizacja (Dz.U.)  │ Co się zmieniło│ Istotność        │
├─────────────┼──────────────────────┼────────────────┼──────────────────┤
│ [DD.MM.RR]  │ Dz.U. [rok] poz.[n] │ [opis skrócony]│ ⚠️ WYSOKA / niska│
└─────────────┴──────────────────────┴────────────────┴──────────────────┘

Status: BEZ ZMIAN w ostatnich 3 latach ✅ / ZMIENIONY [n] razy ⚠️
Ostatnia zmiana: [data] — [Dz.U.]
Rekomendacja: [czy sprawdzić tekst historyczny dla starszej sprawy]
```

---

## MODUŁ 7D — MOD-KONTEKST-PRAKTYCZNY (wyjaśnienie dla laika)

**Uruchamiaj automatycznie** gdy: użytkownik nie jest prawnikiem (wykryj z tonu pytania) LUB użytkownik wprost pyta "co to znaczy" / "jak to działa" / "czy to dotyczy mnie".  
Prezentuj w osobnym boxie obok analizy technicznej — NIE zastępuje analizy, jest jej uzupełnieniem.

```
FORMAT — trzy elementy obowiązkowe:

CO TEN PRZEPIS ZNACZY W PRAKTYCE (dla laika):
  [Zdanie 1: co przepis pozwala / zabrania / nakazuje — bez żargonu]
  [Zdanie 2: kiedy typowo się go stosuje — przykład życiowy]
  [Zdanie 3: co to oznacza dla osoby w takiej sytuacji jak użytkownik]

PRZYKŁAD Z ŻYCIA:
  Sytuacja: [krótki opis — 2-3 zdania — maksymalnie konkretny]
  Skutek: [co się stało, kto wygrał/przegrał, dlaczego]

JĘZYK TECHNICZNY vs PROSTY:
  "Czyn niedozwolony" = wyrządzona komuś szkoda
  "Związek przyczynowy" = że właśnie to działanie wywołało szkodę
  [Inne pojęcia z analizowanego przepisu — tłumacz z pary na parę]

Styl: jak tłumaczenie przyjacielowi przy kawie — konkretnie, bez patronizowania.
Nie upraszczaj przez omijanie istotnych niuansów — zaznaczaj je słowem "uwaga:".
```

---

## MODUŁ 8 — WIDGET WYNIKÓW (po analizie)

Po każdej pełnej analizie (Moduły 1–7D) wygeneruj interaktywny widget HTML z zakładkami:

Zakładka 1 — KARTA PRZEPISU:
- Pełna treść z wyróżnieniem przesłanek kolorem
- Badge statusu: obowiązuje / zmieniony / uchylony
- Data stanu prawnego, link do ISAP
- Jeśli tryb historyczny: oś czasu zmian przepisu
- Jeśli MOD-KONTEKST aktywny: boks "W PRAKTYCE" z tłumaczeniem dla laika (collapsible)

Zakładka 2 — DRZEWO PRZESŁANEK (INTERAKTYWNE):
- Wizualne drzewo div z węzłami: zielony (T) / czerwony (N) / pomarańczowy (?)
- Badge typu logicznego (AND / OR / MIXED) przy korzeniu
- Tooltip z uzasadnieniem po najechaniu
- TRYB KROKOWY (przycisk "Sprawdź krok po kroku"):
  Krok 1/N: "Czy przesłanka [P1: nazwa] jest spełniona?"
  Przyciski: [TAK] [NIE] [WĄTPLIWE]
  Po wyborze: →gałąź wyniku cząstkowego + wyjaśnienie co to oznacza
  Po P1..Pn: podsumowanie automatyczne (wszystkie TAK → przepis stosuje się / dowolne NIE przy AND → nie stosuje się)
  Reset: "Zacznij od nowa"

Zakładka 3 — MATRYCA OCENY:
- Tabela: przesłanka | status | pasek pewności (%) | uzasadnienie | braki
- Wiersz podsumowujący z dużym badge WYNIK KOŃCOWY

Zakładka 4 — ORZECZNICTWO (MOD-ORZECZ-PRZEPIS):
- 3 karty orzeczeń (sygnatura + sąd + rok + teza + link + relevance bar)
- Tier badge: SN/NSA/TK (tier 1) / SA/WSA (tier 2) / SR/SO (tier 3)
- Alert LINIA NIEJEDNOLITA ⚠️ jeśli wykryto rozbieżność (czerwony boks)
  → opis stanowiska A i B + co powoduje rozbieżność + rekomendacja
- Alert LINIA JEDNOLITA ✅ jeśli brak rozbieżności (zielony boks)
- Filtry: [SN] [SA] [NSA] [WSA] — toggle pokazuje/ukrywa tier

Zakładka 5 — POWIĄZANIA NORM (MOD-ZBIEZNOSC):
- Wizualna mapa powiązań (ASCII-tree lub div-tree)
- Każdy węzeł: [artykuł] + [typ relacji badge] + [opis jednozdaniowy]
- Klik w węzeł → sendPrompt("Analizuj [artykuł] [akt]")
- Legenda typów relacji kolorami

Zakładka 6 — HISTORIA ZMIAN (MOD-HISTORIA-ZMIAN):
- Tabela nowelizacji z ostatnich 3 lat
- Badge istotności: ⚠️ WYSOKA / szara NISKA
- Alert ⚠️ ŚWIEŻA NOWELIZACJA jeśli zmiana w ostatnich 6 miesiącach
- Porównanie wersji (gdy dostępne): aktualna vs poprzednia (diff-style)

Zakładka 7 — RAPORT I REKOMENDACJE:
- Konkluzja w dużym boxie (zielony/czerwony/pomarańczowy)
- Gauge 0–100% ogólnej pewności analizy
- Lista ryzyk i rekomendacji
- Jeśli MOD-KONTEKST aktywny: boks "Co to oznacza dla Ciebie" (laik)
- Przyciski: sendPrompt("Generuj pismo procesowe") / sendPrompt("Zbadaj orzecznictwo") / sendPrompt("Analizuj dowody")

Wymagania techniczne widgetu wyników:
- Jeden plik HTML, CSS i JS inline, bez zewnętrznych bibliotek
- Kolory jak w Module 0.3, responsywny min-width 320px
- Eksport PDF: window.print() ze stylami @media print

---

## MODUŁ 9 — INTEGRACJA Z SYSTEMEM SKILLÓW

| Wynik analizy                           | Proponowany skill       |
|-----------------------------------------|-------------------------|
| Przepis stosuje się → chcę pismo        | pisma-procesowe-v3      |
| Brak dowodów na przesłanki              | analizator-dowodow-v3   |
| Pojęcia nieostre, linia niejednoznaczna | orzeczenia-sadowe-v2    |
| Złożona sprawa, wiele przepisów         | analiza-sadowa-v6       |
| Użytkownik zagubiony w wynikach         | przewodnik-prawny-v2    |
| Linia niejednolita ⚠️ — chcę więcej    | orzeczenia-sadowe-v2    |
| Zbieg norm — chcę mapę powiązań         | analiza-sadowa-v6       |

---

## INSTRUKCJE OPERACYJNE

### Sekwencja obowiązkowa

```
1. Moduł 0 → intake + routing
   Jeśli brak przepisu → Widget wyboru przepisu (Moduł 0.3)
2. Moduł 1 → pobierz przepis z ISAP (ZAWSZE, BEZ WYJĄTKU)
   Lub Moduł 1H → tryb historyczny
3. Moduł 2 → dekompozycja przesłanek
4. Moduł 3 → analiza spełnienia (jeśli jest stan faktyczny)
5. Moduł 7 → linia orzecznicza (pojęcia nieostre lub żądanie)
6. Moduł 7A → MOD-ORZECZ-PRZEPIS (AUTOMATYCZNIE — 3 orzeczenia + alert rozbieżności)
7. Moduł 7B → MOD-ZBIEZNOSC (jeśli przepis odsyła lub ścieżka B)
8. Moduł 7C → MOD-HISTORIA-ZMIAN (AUTOMATYCZNIE — w tle, wynik w zakładce widgetu)
   8a. Jeśli wykryto vacatio legis lub nowelizację wieloetapową → MOD-VACATIO-LEGIS
       `view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md`
9. Moduł 7D → MOD-KONTEKST-PRAKTYCZNY (gdy laik lub żądanie wyjaśnienia)
10. Moduł 4 → raport końcowy
11. Moduł 5 → zbieg norm (jeśli wiele przepisów)
12. Moduł 6 → tryb specjalny (karny / admin / proceduralny)
13. Moduł 8 → Widget wyników HTML z 7 zakładkami (zawsze po analizie)
14. Moduł 9 → propozycja kolejnych skillów
```

### Poziomy pewności

| Poziom | %     | Kryterium                                           |
|--------|-------|-----------------------------------------------------|
| Wysoka | 80–100| Materiały jednoznacznie i bezpośrednio potwierdzają |
| Średnia| 50–79 | Pośrednie wskazanie, możliwa inna interpretacja     |
| Niska  | <50   | Brak materiałów lub wzajemna sprzeczność            |

### Cytowanie orzeczeń

- Nigdy sygnatur z pamięci AI
- Format: [Sąd], [data], sygn. [sygnatura], [teza skrócona]
- Link do źródła oficjalnego obowiązkowy

### Postępowanie przy braku dostępu do ISAP

```
Spróbuj kolejno: sejm.gov.pl → EUR-Lex → BIP organu
Jeśli wszystkie niedostępne:
  ZATRZYMAJ analizę
  Poinformuj użytkownika
  Zaproponuj dostarczenie tekstu przez użytkownika
  NIE analizuj z pamięci AI
```

---

## PRZYKŁAD

Zapytanie: "Czy art. 415 KC stosuje się do mojej sprawy? Stan na 1.01.2020."

```
[M0]  Ścieżka C — historyczna
[M1H] Pobrano ISAP, Dz.U. 2019 poz. 1145, stan na 01.01.2020
[M2]  Koniunkcja: P1 Szkoda | P2 Wina | P3 Związek przyczynowy
[M3]  P1 T 90% | P2 ? 55% (brak protokołu) | P3 T 80%
[M7]  SN: "wina" — wykładnia obiektywna (sygn. zweryfikowana)
[M7A] 3 orzeczenia pobrane z saos.org.pl + sn.pl — LINIA NIEJEDNOLITA ⚠️
      Stanowisko A (dominujące SN): subiektywna miara staranności
      Stanowisko B (mniejszościowe SA): obiektywny wzorzec "dobrego gospodarza"
      Przyczyna: różna wykładnia pojęcia "wina" przed uchwałą SN z 2018
[M7C] Przepis bez zmian w ostatnich 3 latach ✅
[M4]  KONKLUZJA: ? NIEJEDNOZNACZNY — blokuje P2, ryzyko linii niejednolitej
[M7D] Dla laika: "Przepis mówi, że kto wyrządził komuś szkodę przez własną winę,
      musi ją naprawić. Tu kwestią sporną jest, czy winę oceniamy przez Twoje
      zamierzenia czy przez to, co zrobiłby 'rozsądny człowiek' na Twoim miejscu."
[M8]  Widget wyników z 7 zakładkami.
```

---

## Integracja z kancelaryjnym jądrem shared

Jeżeli wynik tego skilla ma służyć do pisma, strategii procesowej, oceny ryzyka albo decyzji terminowej, wczytaj właściwe moduły shared:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach. Lokalne moduły mogą tylko doprecyzować analizę dziedzinową.

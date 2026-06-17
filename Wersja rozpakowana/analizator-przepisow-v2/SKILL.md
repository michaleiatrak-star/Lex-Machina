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

## MODUŁY 7–8 — ORZECZNICTWO, MAPA POWIĄZAŃ, HISTORIA ZMIAN, KONTEKST DLA LAIKA, WIDGET WYNIKÓW

Wyodrębnione do osobnego pliku referencyjnego (refaktoryzacja 2026-06-14 — eliminacja monolitu 794 linii):

```
view /mnt/skills/user/analizator-przepisow-v2/references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md
```

Zawiera:
- **Moduł 7** — Linia orzecznicza (wyszukiwanie i analiza stanowisk SN/NSA/TK/SA/WSA)
- **Moduł 7A** — MOD-ORZECZ-PRZEPIS (automatyczne pobranie 3 orzeczeń do przepisu)
- **Moduł 7B** — MOD-ZBIEZNOSC (mapa powiązań norm)
- **Moduł 7C** — MOD-HISTORIA-ZMIAN + MOD-VACATIO-LEGIS (nowelizacje, vacatio legis — odsyła dalej do `references/MOD-VACATIO-LEGIS.md`)
- **Moduł 7D** — MOD-KONTEKST-PRAKTYCZNY (wyjaśnienie dla laika)
- **Moduł 8** — Widget wyników HTML (7 zakładek)

Wczytaj ten plik na etapie 5–9 i 13 sekwencji obowiązkowej (patrz INSTRUKCJE OPERACYJNE poniżej).

---

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

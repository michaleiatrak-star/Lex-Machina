---
name: analizator-przepisow-v2
version: 2.3
type: executive-analiza
status: production
compatibility: "web_search, web_fetch, show_widget"
description: Analizuje przepisy prawa polskiego. Stosuj gdy użytkownik pyta o artykuł, przesłanki, wykładnię, orzecznictwo, zbieg norm, historię zmian przepisu lub chce sprawdzić czy przepis stosuje się do jego sytuacji. v2: automatyczne orzecznictwo (3 orzeczenia + alert rozbieżności linii), mapa powiązań norm, historia nowelizacji z obsługą vacatio legis, interaktywne drzewo przesłanek krok-po-kroku, kontekst praktyczny dla laika. v2.3: RZĄD 1 (ISAP) / RZĄD 2 (orzecznictwo, LEX-Legalis-tekst, ORAZ duże portale: prawo.pl, LEX/Legalis-komentarz, rp.pl, infor.pl, gofin.pl i inne) / RZĄD 3 (strony prawników, kancelarii, NGO, blogów — wysokie ryzyko dezaktualizacji, wymagają daty i krzyżowej weryfikacji).
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

### Hierarchia źródeł (RZĄD 1 / RZĄD 2 / RZĄD 3)

**RZĄD 1 — PIERWSZORZĘDNE (wiążące, wyłączne dla BRZMIENIA przepisu):**
1. ISAP — https://isap.sejm.gov.pl — PRIORYTET (tekst jednolity)
2. Sejm RP — https://www.sejm.gov.pl/prawo/prawo.htm
3. EUR-Lex — https://eur-lex.europa.eu — prawo UE implementowane w Polsce
4. UODO — https://uodo.gov.pl — przepisy o ochronie danych
5. BIP właściwego organu — dla rozporządzeń branżowych

Ten rząd dotyczy WYŁĄCZNIE brzmienia przepisu — obowiązuje tu
`shared/PRAWO-HARDGATE.md` bez wyjątków.

**RZĄD 2 — DRUGORZĘDNE (oficjalne orzecznictwo, LEX/Legalis jako tekst przy
licencji, ORAZ duże, uznane portale prawnicze/branżowe — komentarz i
interpretacja o niskim ryzyku dezaktualizacji, redakcja profesjonalna):**

**2A — oficjalne, wykonawcze/orzecznicze (znacznik ✅ [VER: ...]):**
- Orzecznictwo z oficjalnych baz sądowych: sn.pl, orzeczenia.ms.gov.pl,
  orzeczenia.nsa.gov.pl, trybunal.gov.pl, saos.org.pl (pomocniczo) — Moduł
  7/7A, procedura wyłącznie wg `shared/PRAWO-HARDGATE.md`.
- LEX (sip.lex.pl) i Legalis (sip.legalis.pl) jako ŹRÓDŁO-2 dla BRZMIENIA
  przepisu, gdy ISAP niedostępny i kancelaria posiada aktywną licencję —
  równoważne ISAP wyłącznie w tej roli, zgodnie z `shared/PRAWO-HARDGATE.md`.

**2B — duże, uznane portale prawnicze/branżowe (komentarz/interpretacja,
znacznik 📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...], NIGDY brzmienie przepisu ani
dowód istnienia orzeczenia):** lista przykładowa, nie zamknięta:

- prawo.pl (Wolters Kluwer — portal informacyjny)
- lex.pl / sip.lex.pl (Wolters Kluwer LEX — w roli komentarza/glosy, nie tekstu)
- legalis.pl / sip.legalis.pl (C.H.Beck — w roli komentarza/monografii, nie tekstu)
- rp.pl (Rzeczpospolita, dział Prawo)
- infor.pl, lexlege.pl — portale informacyjno-branżowe
- gazetaprawna.pl (Dziennik Gazeta Prawna)
- kadry.infor.pl (prawo pracy — komentarze praktyczne)
- poradnikprzedsiebiorcy.pl (prawo gospodarcze/podatkowe dla przedsiębiorców)
- money.pl (dział Prawo/Podatki)
- gofin.pl (Wydawnictwo Podatkowe GOFIN — podatki, rachunkowość, prawo pracy)
- biznes.gov.pl — wyłącznie treści poradnikowe/informacyjne (odróżnij od
  aktów prawnych i oficjalnych interpretacji organów — te, gdy dostępne
  bezpośrednio na stronach urzędowych, np. podatki.gov.pl/eureka, należą
  do Rzędu 1/2A, nie do tej listy)
- inne duże portale o podobnym profilu: redakcja zawodowa/wydawnicza,
  systematyczna aktualizacja po nowelizacjach, rozpoznawalna marka —
  kryterium przynależności do 2B, nie do Rzędu 3.

Kryterium 2B vs Rząd 3: redakcja zawodowa + rozpoznawalna marka wydawnicza/
medialna + praktyka regularnej aktualizacji treści po zmianach przepisów →
niższe ryzyko dezaktualizacji niż Rząd 3 (patrz niżej), ale nadal NIE jest to
wykładnia wiążąca — zawsze 📚, nigdy ✅ [VER].

Ten rząd dotyczy WYŁĄCZNIE brzmienia przepisu — obowiązuje tu
`shared/PRAWO-HARDGATE.md` bez wyjątków.

**RZĄD 3 — TRZECIORZĘDNE (WYSOKIE RYZYKO DEZAKTUALIZACJI — strony
indywidualnych prawników/kancelarii, blogi eksperckie, organizacje NGO,
fora, poradniki bez redakcji wydawniczej):**

Obejmuje: strony własne adwokatów/radców/kancelarii, blogi prawnicze,
publikacje NGO, fora internetowe, poradniki bez wskazanej redakcji lub daty
aktualizacji. Cecha wspólna uzasadniająca niższy rząd niż 2B: brak
systematycznej redakcji wydawniczej i brak gwarancji aktualizacji treści po
nowelizacji — wpis mógł powstać przed zmianą przepisu i nigdy nie zostać
poprawiony.

ZASADY DODATKOWE DLA RZĄDU 3 (ponad ogólny zakaz mieszania ról poniżej):
```
1. Sprawdź datę publikacji/ostatniej aktualizacji treści.
   Brak daty lub data > 24 miesiące wstecz → dodaj ostrzeżenie
   "⚠️ możliwa dezaktualizacja — brak/dawna data publikacji".
2. NIGDY nie cytuj twierdzenia z Rzędu 3 jako samodzielnej podstawy —
   zawsze skrzyżuj z Rzędem 1 (tekst) lub 2A (orzecznictwo) przed użyciem.
   Jeśli nie da się skrzyżować (np. brak czasu/dostępu) → oznacz
   "⚠️ NIEPOTWIERDZONE W ŹRÓDLE WYŻSZEGO RZĘDU" i nie buduj na tym wniosku.
3. Dozwolone wyłącznie jako inspiracja do dalszego wyszukiwania (podobnie do
   BRAMKI WTÓRNE-ŹRÓDŁO-STOP dla orzeczeń w `shared/PRAWO-HARDGATE.md`) —
   nigdy jako ostateczne potwierdzenie stanu prawnego.
```

Uzupełniająco do Rzędu 1 (tekst) i Rzędu 2 (orzecznictwo/LEX-Legalis-tekst/
duże portale) — analiza MOŻE sięgać po Rząd 3, gdy wzbogaca kontekst
praktyczny (Moduł 7D) lub wskazuje trop do dalszej weryfikacji, ale ZAWSZE
z zastrzeżeniami powyżej.

⛔ ZAKAZ mieszania rzędów:
- Dla BRZMIENIA przepisu → wyłącznie Rząd 1 lub Rząd 2A (LEX/Legalis-tekst,
  przy licencji) — Rząd 2B i Rząd 3 nigdy nie pełnią tej roli.
- Dla ISTNIENIA sygnatury orzeczenia → wyłącznie Rząd 2A (oficjalna baza
  sądowa, BRAMKA WTÓRNE-ŹRÓDŁO-STOP z `shared/PRAWO-HARDGATE.md`) — Rząd 2B
  i Rząd 3 nigdy nie potwierdzają istnienia orzeczenia, tylko wskazują trop.
- Rząd 2B i Rząd 3 wolno cytować WYŁĄCZNIE jako pogląd/informację pomocniczą,
  nigdy jako samodzielną podstawę normatywną.

ZNACZNIK OBOWIĄZKOWY — każdy fragment pochodzący z Rzędu 2B lub Rzędu 3 oznacz:
```
📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: nazwa portalu, autor jeśli podany, data]
— pogląd doktrynalny/informacyjny, nie wykładnia wiążąca

⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: nazwa strony/autor, data jeśli znana]
— WYSOKIE RYZYKO DEZAKTUALIZACJI, wymaga potwierdzenia w Rzędzie 1/2
```
Nie myl ze znacznikami HARDGATE:
```
✅ [VER: ISAP / api.sejm.gov.pl, data]              → Rząd 1, tekst przepisu, wiążący
✅ [VER: sn.pl / orzeczenia.ms.gov.pl / ..., data]   → Rząd 2A, orzeczenie zweryfikowane oficjalnie
✅ [VER: LEX/Legalis, data]                          → Rząd 2A, tekst przepisu (tylko przy licencji)
📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: portal, data]        → Rząd 2B, duży portal, komentarz/informacja
⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: strona/autor, data] → Rząd 3, wysokie ryzyko dezaktualizacji
```

KOLIZJA Z ORZECZNICTWEM: jeśli pogląd z Rzędu 2B/3 jest sprzeczny ze
zweryfikowaną linią orzeczniczą (Rząd 2A, Moduł 7/7A) → wyraźnie zaznacz
rozbieżność w raporcie; priorytet interpretacyjny ma zawsze Rząd 1/2A.

GDZIE STOSOWAĆ RZĄD 2B / RZĄD 3:
- Moduł 2 — jako dodatkowy kontekst przy wykładni pojęć nieostrych, obok
  (nie zamiast) wykładni orzeczniczej; Rząd 3 wyłącznie po skrzyżowaniu z
  Rzędem 1/2A (zasada 2 powyżej).
- Moduł 7D — komentarze (zwłaszcza 2B) ułatwiają przystępne, praktyczne
  wyjaśnienie dla laika.
- Moduł 4, sekcja 10 — osobna podsekcja "Źródła pomocnicze (Rząd 2B/Rząd 3)",
  oddzielona od "Źródła normatywne i orzecznicze (Rząd 1/2A, zweryfikowane)".

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

Uzupełniająco (POMOCNICZO, nie zamiast powyższego): sprawdź też komentarze
doktrynalne na dużych, uznanych portalach RZĘDU 3 (prawo.pl, LEX, Legalis,
rp.pl, gofin.pl i pozostałe duże portale — patrz "Hierarchia źródeł" w
Module 1) i oznacz je znacznikiem 📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...].
Strony indywidualnych prawników/kancelarii/blogów (Rząd 3) traktuj z
dodatkową ostrożnością wg zasad Rzędu 3. Gdy komentarz i orzecznictwo się różnią —
priorytet ma orzecznictwo, odnotuj rozbieżność.

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

10. ŹRÓDŁA
    Normatywne i orzecznicze (zweryfikowane, ✅ [VER: ...]): [lista URL]
    Pomocnicze — duże portale RZĄD 2 (📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...], o ile użyto): [lista URL]
    Pomocnicze — Rząd 3, wysokie ryzyko dezaktualizacji (⚠️📚 [... RZĄD 3: ...], o ile użyto): [lista URL]
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
    ⛔ MOD-WIDGET-IO (OBOWIĄZKOWE przed show_widget):
    view /mnt/skills/user/shared/MOD-WIDGET-IO.md
    → wbuduj pasek IO w nagłówek widgetu
    → IO_SKILL_ID='analizator-przepisow-v2', IO_CASE_ID=sygnatura_lub_przepis
    → matryca: Export JSON ✅ MD ✅ | Import JSON ✅
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

---

## CHANGELOG

**2.3 (2026-07-06):**
- **KOREKTA na wyraźne polecenie użytkownika:** duże, uznane portale
  prawnicze/branżowe (prawo.pl, LEX-komentarz, Legalis-komentarz, rp.pl,
  infor.pl, lexlege.pl, gazetaprawna.pl, kadry.infor.pl,
  poradnikprzedsiebiorcy.pl, money.pl, biznes.gov.pl), błędnie nazwane w
  v2.2 "RZĄD 3", przeniesione do **RZĄD 2** jako podkategoria **2B**
  (obok 2A — oficjalne orzecznictwo i LEX/Legalis-tekst). Dodano do listy
  **gofin.pl**. Znacznik zmieniony na `📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...]`.
- **RZĄD 3 zredefiniowany:** teraz wyłącznie strony indywidualnych
  prawników/kancelarii, blogi eksperckie, NGO, fora — źródła z WYSOKIM
  RYZYKIEM DEZAKTUALIZACJI (brak redakcji wydawniczej, brak gwarancji
  aktualizacji po nowelizacji). Dodano zasady dodatkowe: obowiązkowe
  sprawdzenie daty publikacji (brak/starsza niż 24 mies. → ostrzeżenie),
  zakaz cytowania bez krzyżowej weryfikacji w Rzędzie 1/2A, rola wyłącznie
  jako trop do dalszego wyszukania. Nowy znacznik:
  `⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: ...]` (z ostrzeżeniem w samym znaczniku,
  nie tylko w opisie).
- Zaktualizowano spójnie: Moduł 2, Moduł 4 sekcja 10 (rozdzielone teraz na
  trzy pozycje: normatywne/orzecznicze Rząd 1–2A, pomocnicze Rząd 2B,
  pomocnicze wysokiego ryzyka Rząd 3), Moduł 7D.
- Wersja 2.2 → 2.3, description 698 znaków (✅ OK).

**2.2 (2026-07-06):**
- **Restrukturyzacja "Hierarchii źródeł" (Moduł 1) na jawne RZĄD 1/2/3**, na
  wyraźne polecenie użytkownika. RZĄD 1 = ISAP/Sejm/EUR-Lex/UODO/BIP (tekst
  przepisu, wiążący). RZĄD 2 = oficjalne bazy orzeczeń (sn.pl,
  orzeczenia.ms.gov.pl, nsa.gov.pl, trybunal.gov.pl, saos.org.pl) oraz
  LEX/Legalis wyłącznie w roli tekstu przepisu przy aktywnej licencji. RZĄD 3
  = interpretacja doktrynalna/portale informacyjne — TRZECIORZĘDNE,
  POMOCNICZE: rozszerzono listę z v2.1 (prawo.pl, LEX/Legalis-komentarz,
  rp.pl, infor.pl, lexlege.pl) o **pozostałe portale**: gazetaprawna.pl,
  kadry.infor.pl, poradnikprzedsiebiorcy.pl, money.pl, biznes.gov.pl
  (wyłącznie treści poradnikowe) — spójnie z listą już rozpoznaną w
  `shared/PRAWO-HARDGATE.md` (BRAMKA WTÓRNE-ŹRÓDŁO-STOP), rozszerzoną i
  nazwaną tu wprost jako RZĄD 3.
- Znacznik doprecyzowany: `📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: portal, data]` —
  numer rzędu wprost w znaczniku, żeby w raporcie było widać na pierwszy
  rzut oka, że to trzeciorzędne źródło pomocnicze, nie tekst ani orzecznictwo.
  Zaktualizowano spójnie odesłania w Module 2, Module 4 sekcja 10 i Module 7D
  (`references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md`).
- Wersja 2.1 → 2.2, description 633 znaki (✅ OK).

**2.1 (2026-07-06):**
- **Dodano sekcję "Źródła pomocnicze — interpretacja doktrynalna" (Moduł 1).**
  Na wyraźne polecenie użytkownika: skill ma chętnie korzystać z zewnętrznych
  interpretacji/komentarzy (prawo.pl, LEX/lex.pl, Legalis, rp.pl i inne duże,
  uznane portale branżowe), ale ZAWSZE oznaczać je wyraźnie jako źródło
  pomocnicze — znacznik 📚 [ŹRÓDŁO POMOCNICZE: ...], odróżniony od znaczników
  HARDGATE ✅ [VER: ...] zastrzeżonych dla zweryfikowanego tekstu przepisu
  (ISAP/ELI) i zweryfikowanego orzecznictwa (sn.pl/orzeczenia.ms.gov.pl/...).
  Wyraźny zakaz mieszania ról: te portale nie mogą być podstawą brzmienia
  przepisu (poza rolą ŹRÓDŁO-2 LEX/Legalis już opisaną w `shared/PRAWO-
  HARDGATE.md` przy aktywnej licencji) ani potwierdzeniem istnienia sygnatury
  orzeczenia (BRAMKA WTÓRNE-ŹRÓDŁO-STOP z HARDGATE pozostaje w mocy).
- Skrzyżowane odesłania dodane w: Moduł 2 (wykładnia pojęć nieostrych —
  komentarz doktrynalny jako uzupełnienie, nie zamiennik, wykładni
  orzeczniczej), Moduł 4 sekcja 10 (Raport końcowy — rozdzielono "Źródła
  normatywne i orzecznicze" od "Źródła pomocnicze"), Moduł 7D w
  `references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md` (kontekst dla laika —
  komentarze mogą wspomóc przystępne wyjaśnienie, oznaczone 📚).
- Nie zduplikowano logiki HARDGATE — nowa sekcja odsyła do istniejących zasad
  ŹRÓDŁO-2 (LEX/Legalis dla tekstu) i BRAMKI WTÓRNE-ŹRÓDŁO-STOP (sygnatury)
  w `shared/PRAWO-HARDGATE.md`, dodaje wyłącznie nową kategorię — użycie tych
  portali jako doktryny/komentarza, którego dotąd skill nie adresował wprost.
- Wersja podniesiona 2.0 → 2.1, description zaktualizowany (614 znaków, ✅ OK).

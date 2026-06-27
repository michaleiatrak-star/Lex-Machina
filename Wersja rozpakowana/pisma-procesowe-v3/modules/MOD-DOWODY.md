# MOD-DOWODY — Hierarchia i Łańcuch Dowodowy

*Ładuj gdy: użytkownik dostarczył dokumenty / akta / dowody do analizy*
*Powiązany skill: `analizator-dowodow-v3` — użyj gdy dużo dowodów lub potrzebna pełna ocena*

---

## D1 — Hierarchia dowodów (4 poziomy)

### Poziom A — Dokumenty urzędowe (moc najwyższa)
Protokoły sądowe z sygnaturą/datą/godziną, wyniki kontroli organów państwowych,
wpisy do rejestrów, orzeczenia prawomocne, potwierdzenia z metadanymi
elektronicznymi, akty notarialne, decyzje administracyjne.

**Jak powoływać:** "(protokół z dnia [data], godz. [X], str. [Y])"

### Poziom B — Zeznania pod rygorem odpowiedzialności
Zeznania świadków z protokołu sądowego lub prokuratorskiego.
**Oceniaj:** spójność wewnętrzna, spójność zewnętrzna (z A), interes procesowy,
spontaniczność odpowiedzi.

**Jak powoływać:** "(zeznanie świadka [imię], protokół z dnia [data], godz. [X])"

### Poziom C — Dokumenty prywatne stron
Pisma, maile, wiadomości, nagrania, zdjęcia, faktury, umowy prywatne.
**Wartość:** gdy strona sama je złożyła (działa przeciw niej) lub są niesprzeczne z A i B.

**Jak powoływać:** "(pismo z dnia [data], zał. nr [X])"

### Poziom D — Twierdzenia bez dowodu
Zdania strony bez poparcia dowodowego.
**Reakcja:** wskazuj brak dowodu → żądaj przedstawienia (art. 248 KPC)
lub stosuj art. 233 §2 KPC (odmowa oceniana na niekorzyść).

---

## D2 — Budowa łańcucha dowodowego

Dla każdego roszczenia/tezy:

```
ROSZCZENIE / TEZA:
[treść]
  ↓
PRZEPIS PRAWNY (zweryfikowany — patrz MOD-PRAWO):
[art. X §Y — co wymaga udowodnienia]
  ↓
DOWÓD Z AKT (poziom A lub B):
[nazwa, data, str./godz.]
  ↓
ORZECZENIE ANALOGICZNE (opcjonalnie — via orzeczenia-sadowe-v2):
[sąd, data, sygnatura, podobieństwo X/5]
  ↓
WNIOSEK DLA SĄDU:
[konkretna konkluzja]
```

---

## D3 — Weryfikacja kompletności łańcucha

Przed napisaniem pisma sprawdź dla każdego roszczenia:

```
ROSZCZENIE: [treść]
┌─ Przepis: [zweryfikowany online]              → OK / BRAK
├─ Dowód A/B: [z akt, str./data]                → OK / BRAK
├─ Podobna sprawa: [sygnatura, podobień. X/5]   → OK / BRAK / ZBĘDNE
├─ Twierdzenie przeciwnika: [zidentyfikowane]   → OK / BRAK / N/D
└─ Obalenie twierdzenia: [typ A/B/C/D/E/F]      → OK / BRAK / N/D

STATUS:
✓ KOMPLETNY → można pisać
⚠ NIEKOMPLETNY → wskaż lukę i sposób jej uzupełnienia
✗ BRAK PODSTAWY → nie umieszczaj w piśmie
```

---

## D4 — Sekcja "Na dowód" w piśmie

Format obligatoryjny z precyzyjnym lokalizatorem (SD-LOC):

```
Na dowód powyższego powołuję:

1. [Pełna nazwa dowodu / dokumentu]
   Lokalizacja: [PRECYZYJNY LOKALIZATOR wg D4-LOC]
   Na okoliczność: [co wykazuje — powiązanie z konkretną tezą]

2. [Kolejny dowód]
   Lokalizacja: [...]
   Na okoliczność: [...]
```

### D4-LOC — Format lokalizatora (zbierany podczas skanowania SD-READ.2)

```
PDF z warstwą tekstową:
  "str. N, [akapit N / punkt X / godz. HH:MM:SS nagrania]"
  Przykład: "str. 4 protokołu, godz. 00:47:48 nagrania, odpowiedzi
             na pytania powoda"

PDF-skan (bez warstwy tekstowej):
  "str. N — skan [opis wizualny dokumentu]"
  Przykład: "str. 1 — skan jednostronicowy, umowa o pracę"

XLSX wielozakładkowy:
  "zakładka '[Nazwa]', wiersze N-M, kolumna '[Nagłówek]'"
  Przykład: "zakładka 'Pracownicy HP Global', wiersze 1-765"

Lista PFRON (PDF tabelaryczny):
  "str. N-M, lp. X-Y, suma Z zł; kluczowe: lp. A-B (str. C) — opis"
  Przykład: "str. 1-4, lp. 1-30, łącznie 123 445 zł; kluczowe:
             lp. 1-9 (str. 1) — WnD VII/2023-IV/2024 po 5 850 zł"

Pismo / korespondencja:
  "str. N, [sekcja / akapit N od góry / nagłówek]"
  Przykład: "str. 2, tabela kwot miesięcznych, wiersz I 2026 - IV 2026"
```

### D4-VER — Weryfikacja przed wpisem do pisma (HARD GATE)

```
⛔ Per każdy dowód przed wpisaniem do sekcji "Na dowód":

VER-1 LOKALIZATOR: Czy mam str./zakładkę/wiersz/godzinę z SD-READ.2?
  TAK → wpisz; NIE → wróć do skanowania (nie wymyślaj lokalizatora)

VER-2 PRZEPIS: Czy przepis podstawy prawnej jest zweryfikowany online?
  TAK → wpisz z numerem Dz.U. i datą weryfikacji
  NIE → [WERYFIKACJA W3] jako placeholder; ZAKAZ wpisania z pamięci

VER-3 SPÓJNOŚĆ: Czy fakt w tekście pisma odpowiada treści dokumentu?
  TAK → OK
  NIE → KORYGUJ PISMO wg dokumentu (wytyczną jest prawo i dokument, nie pismo)

VER-4 PRZESŁANKA: Czy dowód wykazuje PRZESŁANKĘ przepisu (nie ogólnie)?
  TAK → OK; NIE → zmień opis "na okoliczność" lub zmień kwalifikację
```

> ⚠ Brak lokalizatora → sędzia nie może odnaleźć fragmentu → wniosek słaby
> ⚠ Brak okoliczności → sąd może oddalić wniosek dowodowy
> ⚠ Dowód bez faktu w stanie faktycznym → nieaktywny procesowo
> ⚠ Przepis niezweryfikowany → ryzyko błędnej lub nieaktualnej normy
> ⛔ Wytyczną jest PRAWO i STAN FAKTYCZNY Z DOKUMENTÓW — nie pierwotna treść pisma

---

## D5 — Kiedy delegować do analizatora-dowodow-v3

Deleguj do `analizator-dowodow-v3` gdy:
- Akta liczą więcej niż 10 dokumentów
- Istnieją sprzeczności między dowodami
- Użytkownik prosi o pełną ocenę wartości dowodowej
- Potrzebna jest ocena 0–10 i hierarchia A–D dla każdego dowodu

Wyniki z `analizatora-dowodow-v3` integruj wg reguł:
- Alerty LEGAL (zakaz dowodowy, prekluzja) → pomiń dowód w sekcji "Na dowód"
- Alerty FORM (brak oryginału, brak daty) → wyjaśnij lub pomiń
- Alerty SPOJ (konflikty) → wyjaśnij w stanie faktycznym lub pomiń słabszy
- Dowody 0–3/10 → nie powoływać (obniżają wiarygodność)

## Integracja shared/DOWODY-METODOLOGIA

Przy każdej analizie materiału dowodowego wczytaj:

```text
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
```

Nie klasyfikuj dowodu wyłącznie opisowo. Każdy dowód musi być przypisany do faktu istotnego prawnie i przesłanki prawnej.

---

## D6 — Protokół eksploracji dowodów wielowarstwowych (v1.2 — UNIVERSALNY)

> **Trigger:** ≥1 dokument w materiale — ZAWSZE.
> Szczególnie gdy: plik XLS/XLSX z wieloma arkuszami, tabele operacyjne
> (pracownicy, faktury, zamówienia, zezwolenia, kandydaci, korespondencja),
> zrzuty ekranu z komunikatorów, korespondencja mailowa, akta osobowe,
> dokumentacja techniczna, rejestry, spisy, protokoły.
>
> **Cel:** wydobyć WSZYSTKIE trzy warstwy każdego dokumentu:
>   Warstwa 1 — FAKTY (co dokument stwierdza wprost)
>   Warstwa 2 — KONTEKST (relacje, schematy, rutyny, braki)
>   Warstwa 3 — POSZLAKI (co można wywnioskować pośrednio)
>
> Pełna metodologia Warstw 2/3: `view shared/MOD-POSZLAKI-KONTEKST.md`
>
> D6 skupia się na specyficznych typach dokumentów — dla pełnego protokołu
> poszlak i łańcuchów dowodowych wywołaj MOD-POSZLAKI-KONTEKST (krok W1.2d).

### D6.1 — Tabele operacyjne jako dowód ciągłości i schematów

Gdy w materiale są arkusze XLS/XLSX lub tabele z danymi operacyjnymi
(pracownicy, klienci, zamówienia, faktury, zezwolenia, rejestry):

```
KROK D6.1.A — IDENTYFIKACJA STRUKTURY:
  Dla każdego pliku: wylistuj wszystkie arkusze i ich rozmiary.
  Szukaj: arkusze z podobną strukturą kolumn dla różnych podmiotów,
  okresów lub kategorii (np. dwa arkusze dla dwóch podmiotów / lat).

KROK D6.1.B — CIĄGŁOŚĆ NUMERACJI:
  Sprawdź każdą kolumnę numeracji wewnętrznej (Ser. Nr, Nr, ID, lp, ref).
  Jeśli numeracja między arkuszami / podmiotami / okresami jest CIĄGŁA
  (brak resetu po dacie spornej lub zmianie podmiotu):
    → Dowód: jeden system prowadził ewidencję bez przerwy.
    → Wniosek: brak faktycznego wyodrębnienia operacyjnego.
    → Zanotuj: "numeracja ciągła od [data/rok] bez resetu po [data spornej]"
  Jeśli reset: zanotuj datę i liczbę luki — czy reset koreluje z datą sporną?

KROK D6.1.C — WSPÓLNE ELEMENTY PERSONALNE:
  Czy te same osoby (po nazwisku / numerze / roli) pojawiają się
  w różnych arkuszach / podmiotach / okresach bez wyraźnej zmiany?
  → Dowód: personel nie był wymieniany mimo formalnej zmiany.
  Czy ta sama osoba pełni rolę kierowniczą / decyzyjną po obu stronach
  daty spornej lub dla obu podmiotów?
  → Dowód: jedność decyzyjna, niezależnie od formy prawnej.

KROK D6.1.D — BRAK PRZEJĘCIA / BRAKI FORMALNE:
  Czy w dniu kluczowego zdarzenia jest widoczna jakakolwiek przerwa
  (brak wpisów, inna struktura, reset)?
  NIE → Dowód ciągłości operacyjnej.
  Czy brakuje dokumentów, które powinny być (protokół przejęcia,
  nowe umowy, nowe badania, nowe szkolenia)?
  → Zastosuj PK1-TYP-P3 (chronologia negatywna z MOD-POSZLAKI-KONTEKST).
```

### D6.2 — Tabele operacyjne jako dowód zakresu działania i ciągłości

```
KROK D6.2.A — IDENTYFIKACJA WŁAŚCICIELA / AUTORA ARKUSZA:
  Jeśli arkusz lub zakładka wskazuje na konkretną osobę (imię, inicjały,
  dział, konto użytkownika) → to dowód podziału pracy między osobami.
  Jeśli ta sama osoba ma arkusze obejmujące cały sporny okres → ciągłość obowiązków.
  Jeśli po dacie spornej właściciel arkusza się nie zmienia → ciągłość personalna.

KROK D6.2.B — DATY CZYNNOŚCI WZGLĘDEM DATY SPORNEJ:
  Czy daty czynności w tabeli (złożenia, opłat, decyzji, zamówień)
  przekraczają datę sporną (rzekomego zakończenia / zmiany)?
  TAK → dowód kontynuowania czynności po dacie spornej.
  Zanotuj: konkretne daty z tabeli + co z tego wynika.

KROK D6.2.C — TOŻSAMOŚĆ KLIENTÓW / KONTRAHENTÓW / KATEGORII:
  Czy te same podmioty zewnętrzne (klienci, dostawcy, kontrahenci, instytucje)
  pojawiają się po obu stronach daty spornej lub w arkuszach różnych podmiotów?
  → Dowód: działalność operacyjna nie zmieniła się mimo formalnej zmiany.
```

### D6.3 — Korespondencja (komunikatory / mail / SMS / pisma) jako dowód ciągłości i relacji

```
KROK D6.3.A — TABELARYZACJA KORESPONDENCJI:
  Dla każdego zrzutu / maila / pisma: data (z metadanych lub treści) |
  nadawca | adresat | treść (streszczenie) | ton (formalny/nieformalny) |
  pozycja względem daty spornej | wartość dowodowa.

KROK D6.3.B — GRANICZNE DATY I CIĄGŁOŚĆ TONU:
  Identyfikuj korespondencję w okolicach daty spornej.
  Jeśli te same osoby wysyłają te same typy wiadomości bez zmiany tonu
  przed i po dacie spornej → ciągłość relacji, ciągłość działania.
  Jeśli ton zmienia się gwałtownie po dacie spornej (np. z nieformalnego
  na formalny) → zanotuj jako potencjalną granicę faktyczną.

KROK D6.3.C — WIADOMOŚCI PO DACIE SPORNEJ JAKO DOWÓD STANOWISKA STRONY:
  Czy korespondencja po dacie spornej zawiera:
  → Deklarację gotowości / woli kontynuowania (art. 81 §1 KP)?
  → Odmowę dopuszczenia / zamknięcie kanałów (niedopuszczenie do pracy)?
  → Przyznanie faktu przez stronę, która go kwestionuje?
  → Żądanie usunięcia dowodów / danych (próba utrudnienia postępowania)?

  Dla każdej wiadomości od organu/strony po dacie spornej:
    → Kto wysłał? Czy ma umocowanie formalne do działania za stronę?
    → Co wiadomość przyznaje lub wyklucza?
    → Czy wiadomość odebrana (potwierdzenie odczytu)? → dowód wiedzy odbiorcy

KROK D6.3.D — RAPORT TABELARYCZNY:
  Wygeneruj tabelę:
  Data | Nadawca | Treść (skrót) | Podmiot/rola nadawcy | Wartość | Teza(y)
  Sortuj chronologicznie. Zaznacz pozycję względem daty spornej (PRZED/PO).
  Eksponuj wiersze gdzie nadawca = organ strony przeciwnej.
```

### D6.4 — Spisy, rejestry, protokoły jako dowód jednej struktury

```
Jeśli w materiale jest spis zdawczo-odbiorczy, rejestr, inwentarz lub protokół:
  — Ile pozycji / wierszy obejmuje?
  — Dla jakiego podmiotu / okresu jest wystawiony?
  — Czy obejmuje pozycje przypisane do różnych podmiotów / kategorii
    bez wyraźnego rozgraniczenia?
  TAK → Dowód: jedno wspólne archiwum / rejestr = brak faktycznego wyodrębnienia.
  — Czy jest ciągłość numeracji / chronologii bez luk w kluczowym momencie?
  TAK → Dowód: operacja trwała bez przerwy przez datę sporną.
```

### D6.5 — Wynik D6: zestawienie dla W1.3 (UNIVERSALNE)

```
Po wykonaniu D6.1–D6.4, zasilaj W1.3 (mapa cel→przesłanka→dowód):

TEZA: Ciągłość operacyjna / tożsamość podmiotu / brak rzeczywistej zmiany
  Przesłanka A: Jeden system / jedna baza danych dla całego okresu
    Dowód: [plik / arkusz — opis, ciągłość numeracji, daty]
  Przesłanka B: Ten sam personel / te same osoby decyzyjne
    Dowód: [names z arkuszy / protokołów + pozycja względem daty spornej]
  Przesłanka C: Identyczne czynności operacyjne bez przerwy
    Dowód: [tabela z D6.3.D — daty graniczne, strona daty spornej]
  Przesłanka D: Jedno wspólne archiwum / rejestr
    Dowód: [spis / rejestr — liczba pozycji, brak rozgraniczenia]

TEZA: Wiedza / stanowisko strony po dacie spornej
  Przesłanka A: Strona wiedziała o [fakcie] (dowód doręczenia / odczytu)
    Dowód: [wiadomość z potwierdzeniem odczytu — data, nadawca]
  Przesłanka B: Strona odmówiła / podjęła działanie X po dacie spornej
    Dowód: [korespondencja / pismo — data, kto wysłał, treść]
  Walor PRZYZNANIA: [jeśli dokument pochodzi od strony przeciwnej —
    eksponuj jako jej własne przyznanie]

→ Pełna metodologia poszlak i łańcuchów: view shared/MOD-POSZLAKI-KONTEKST.md
```

---

## D7 — Antycypacja zarzutów (v1.2 — UNIVERSALNA)

> **Trigger:** ZAWSZE — każde pismo procesowe.
> Pełny protokół antycypacji: `view shared/MOD-POSZLAKI-KONTEKST.md` (krok PK5).
>
> **Zasada:** każdy istotny zarzut przeciwnika powinien być wprost wyartykułowany
> w uzasadnieniu pisma i obalony — zanim pełnomocnik go podniesie.
> To silniejsze procesowo niż obalenie dopiero w replice.

### Format antycypacji (universalny):

```
[ANTYCYPACJA ZARZUTU X]

Strona [pozwana/powodowa/skarżąca] może podnieść, że [treść zarzutu].

Argument ten jest chybiony z [liczba] powodów:

Po pierwsze, [kontrargument faktyczny + dowód + źródło].
Po drugie, [kontrargument prawny + przepis/orzeczenie].
Po trzecie (jeśli dotyczy), [kontrargument procesowy / łańcuch poszlak].
```

### Triggery antycypacji — UNIVERSALNE (każda dziedzina):

```
ZARZUT-U1: Brak interesu prawnego (art. 189 KPC / analogiczne)
  → Aktywuj gdy: roszczenie o ustalenie stosunku prawnego
  → Kontratak: opisz dlaczego powód nie może uzyskać ochrony inaczej
    (spór jest aktywny, strona nie respektuje stanu prawnego)

ZARZUT-U2: Przedawnienie / prekluzja
  → Aktywuj ZAWSZE gdy roszczenie pieniężne lub z terminem
  → Kontratak: wskaż datę zdarzenia, bieg terminu, przerwę/zawieszenie

ZARZUT-U3: Brak legitymacji procesowej (czynnej lub biernej)
  → Aktywuj gdy: zmiana podmiotowa, pełnomocnik, następstwo prawne
  → Kontratak: tytuł prawny do dochodzenia roszczenia / właściwy pozwany

ZARZUT-U4: Sprzeczność z dokumentem / podpisaną umową
  → Aktywuj gdy: strona polega na podpisanym porozumieniu / umowie
  → Kontratak: wada oświadczenia woli / obejście prawa / nieważność

ZARZUT-U5: Kwota wygórowana / nieudowodniona
  → Aktywuj gdy: roszczenie pieniężne bez jednostkowej podstawy
  → Kontratak: sposób wyliczenia + każda składowa + dowód każdej pozycji

ZARZUT-U6: Brak dowodów bezpośrednich / domniemanie
  → Aktywuj gdy: roszczenie oparte na łańcuchu poszlak
  → Kontratak: powołaj łańcuchy L-X z MOD-POSZLAKI-KONTEKST; wskaż
    że ciężar obalenia każdego ogniwa spoczywa na stronie przeciwnej

ZARZUT-U7: Twierdzenia strony sprzeczne z zeznaniami / dokumentami
  → Aktywuj gdy: strona złożyła do akt dokument obciążający siebie
  → Kontratak: walor PRZYZNANIA (PK4 — dowód od strony przeciwnej)

ZARZUT-U8: Brak związku przyczynowego między zdarzeniem a szkodą
  → Aktywuj gdy: roszczenie odszkodowawcze lub z odpowiedzialności
  → Kontratak: łańcuch przyczynowy + dowód każdego ogniwa

ZARZUT-U9: Forma / brak wymaganej formy pisemnej
  → Aktywuj gdy: umowa / porozumienie zawarte ustnie lub dorozumianie
  → Kontratak: przepis o formie ad probationem vs ad solemnitatem;
    praktyka zakładowa / utrwalone zachowanie jako substytut formy
```

### Triggery antycypacji — specyficzne dla spraw pracowniczych:

```
ZARZUT-P1: "Dwie spółki to odrębne podmioty / brak pracodawcy grupowego"
  → Kontratak: NIE twierdzimy że grupa = pracodawca; wskazujemy który
    z podmiotów jest pracodawcą rzeczywistym (por. łańcuchy z D6)

ZARZUT-P2: "Gotowość nie była czynna / brak fizycznego stawiennictwa"
  → Kontratak: (1) standard orzeczniczy — czynna manifestacja woli;
    (2) przeszkoda po stronie pracodawcy eliminuje konieczność stawiennictwa;
    (3) błędne przeświadczenie pracodawcy nie pozbawia prawa do wynagrodzenia

ZARZUT-P3: "Brak regulaminu wynagradzania / premia nie jest regulaminowa"
  → Kontratak: utrwalona praktyka zakładowa = element prawa pracy (art. 9 §1 KP);
    wniosek zobowiązania z art. 248 KPC o dokumenty

ZARZUT-P4: "Porozumienie / umowa skutecznie zakończyła stosunek"
  → Kontratak: zbadaj czy porozumienie nie zawiera wady oświadczenia woli
    lub nie zmierza do obejścia normy bezwzględnie obowiązującej
```


---

## D8 — Architektura łańcucha dowodowego (pełna — łączy z MOD-LANCUCH-DOWODOWY)

> **Trigger:** ZAWSZE — każde pismo z ≥2 dowodami lub ≥1 tezą główną.
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-LANCUCH-DOWODOWY.md`
> Zastępuje prosty schemat D2 (który pozostaje jako skrócone przypomnienie).

```
Per każda teza główna T-X — pipeline ŁD-1..ŁD-7:

ŁD-1: Przesłanki prawne z MOD-MACIERZ-DOWOD-TEZA (MT1)
ŁD-2: Dobór ogniw: BASE (kl.A/B) + POŚR (kl.C/D) + WZM + NEG
ŁD-3: BRAMKA EQG — eliminacja ogniw szkodliwych:
  EQG-1 ZAKAZ DOWODOWY → ❌ WYKLUCZ bezwzględnie
  EQG-2 SAMOOSKARŻENIE → ❌/⚠️/✅ (decyzja użytkownika)
  EQG-3 ŁATWE DO PODWAŻENIA (≥2 wektory AD-X ≥6/10) → ❌/🛡/✅
  EQG-4 RYZYKO UJAWNIENIA → ⏳/✅
ŁD-4: Typ łańcucha: Ł-SEK / Ł-RÓW / Ł-DOM / Ł-NEG / Ł-CIĄ
ŁD-5: Scoring ★→★★★★★
ŁD-6: Antycypacja ataku ŁA-1..ŁA-4 → wstawiaj do D7
ŁD-7: Format w piśmie (pełny schemat per teza główna — §CZĘŚĆ III modułu)

⛔ EQG-1=WYKLUCZ → nie wchodzi do łańcucha bez wyjątku.
⛔ ★/★★ scoring → musi mieć antycypację D7 lub alternatywną tezę.
⛔ Każde ogniwo w sekcji "Na dowód" → musi mieć wskazaną przesłankę.
```

---

## D9 — Atak na łańcuch dowodowy przeciwnika

> **Trigger:** gdy w sprawie znany jest materiał dowodowy strony przeciwnej.
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-LANCUCH-DOWODOWY.md §CZĘŚĆ II`

```
4 strategie ataku na łańcuch (ŁA-1..ŁA-4):

ŁA-1 NAJSŁABSZE OGNIWO:
  Odtwórz łańcuch przeciwnika → oceń klasy A-G per ogniwo →
  atakuj to z najniższą klasą + aktywne wektory AD-X.
  Instrument: wniosek o oddalenie (art. 235² KPC) lub obniżenie wartości.

ŁA-2 KONTRDOWÓD AKTYWNY:
  Per kluczowy fakt F-X łańcucha → złóż własny dowód wykazujący [nie-F-X]
  (KD-1..KD-5 z MOD-ATAK-NA-DOWOD §AD-9).

ŁA-3 LOGIKA PRZEJŚCIA:
  Gdy ogniwa są silne ale most logiczny jest słaby →
  "Fakt [A] jest kompatybilny z [X], [Y], [Z] — nie tylko z [B]."

ŁA-4 PROWENIENCJA:
  Gdy wszystkie ogniwa z jednego źródła →
  "Pozorna triangulacja z jednego źródła — obalenie jednego = obalenie wszystkich."
  (MOD-PROWENIENCJA §PR3 P-)

Format w piśmie:
  Sekcja "ZARZUTY CO DO ŁAŃCUCHA DOWODOWEGO STRONY POWODOWEJ"
  "[ŁA-X]: Strona pozwana kwestionuje łańcuch przez [opis].
   Bez wykazania ogniwa [X] teza [T-Y] nie ma podstawy dowodowej."
```


---

## D10 — ARCHITEKTURA TEZA+DOWÓD w treści pisma procesowego (OBLIGATORYJNA)

> **Wersja modułu:** dodano w ramach poprawy po sprawie VII P 94/25 (2026-06-25)
> **Trigger:** ZAWSZE — każde pismo z ≥1 tezą i ≥1 dowodem.
> **Pozycja w pipeline:** W2.2 (redakcja pisma) — budowanie uzasadnienia.

### ZASADA STRUKTURY TEZA+DOWÓD

Każdy akapit uzasadnienia musi być zbudowany według schematu:

```
[TEZA]: Twierdzenie prawne lub faktyczne.
[PRZEPIS]: art. X §Y [ustawa] — co wymaga udowodnienia.
[DOWÓD]: Powołanie dowodu (kl. A/B/C wg D1) — co konkretnie wykazuje.
[WNIOSEK]: Konkluzja dla Sądu.
```

Teza bez dowodu = twierdzenie strony (poziom D wg D1) — najsłabszy możliwy.
Dowód bez tezy = dowód nieaktywny procesowo (sąd może go pominąć).

### FORMAT SEKCJI KOŃCOWEJ "TEZY DOWODOWE"

Na końcu każdego pisma, po uzasadnieniu i przed podpisem (lub jako ostatnia
część sekcji wnioski dowodowe), OBOWIĄZKOWO umieść sekcję:

```
═══════════════════════════════════════════════════════════
TEZY DOWODOWE I DOWODY

Teza 1: [Treść tezy — co należy wykazać przed Sądem]
Podstawa prawna: [art. X §Y — przesłanka prawna tezy]
Na dowód:
  Dowód 1. [Nazwa / opis] — [lokalizacja: str. X / akt / zał. nr Y]
           na okoliczność: [co konkretnie wykazuje w odniesieniu do tej tezy]
  Dowód 2. [Nazwa / opis] — [lokalizacja]
           na okoliczność: [...]

Teza 2: [...]
[...]
═══════════════════════════════════════════════════════════
```

### WERYFIKACJA TEZY PRZED WPISANIEM DO PISMA (HARD GATE)

Przed każdą tezą wykonaj kontrolę:

```
T-CHECK-1: Czy teza ma oparcie w przepisie prawa?
  TAK → wskaż przepis (zweryfikowany online w W3.1)
  NIE → usuń tezę lub przekształć na twierdzenie pomocnicze

T-CHECK-2: Czy dla tej tezy istnieje dowód kl. A lub B?
  TAK → powiąż dowód z tezą jawnie
  NIE (tylko kl. C lub D) → oznacz jako ⚠️ RYZYKO i złóż wniosek art. 248 KPC

T-CHECK-3: Czy teza i dowód są prawnie spójne?
  Dowód musi wykazywać PRZESŁANKĘ przepisu, nie tylko okoliczność ogólnie.
  Przykład błędu: Teza o premii PFRON; dowód = lista beneficjentów PFRON
    → wykazuje FAKT pobierania dofinansowania przez pracodawcę (przesłanka),
      ale nie wysokość premii per pracownik (luka → wniosek art. 248 KPC).
  Przykład OK: Teza o 4. umowie → dowód = kopia 4. umowy (kl. B) → wykazuje
    zawarcie 4. umowy terminowej (przesłanka art. 25¹ §3 KP). ✅
```

### INTEGRACJA Z PIPELINE

W2.2 (redakcja): Każdy akapit uzasadnienia buduj wg schematu TEZA→PRZEPIS→DOWÓD→WNIOSEK.
W2.3 (lista placeholderów): Każda teza bez dowodu kl. A/B = ⬛ LUKA D10.
W2.4 (MOD-ATAK-NA-DRAFT): Tezy bez dowodów = ataki D2 klasy 🔴.
W3 (finalizacja): Sekcja "TEZY DOWODOWE" obowiązkowa w piśmie finalnym.

⛔ ZAKAZ: Nie generuj .docx bez sekcji "TEZY DOWODOWE" w piśmie.
⛔ ZAKAZ: Nie umieszczaj tezy bez wskazanego przepisu prawnego.
⛔ ZAKAZ: Nie powoływaj dowodu bez wskazania na okoliczność (co wykazuje).

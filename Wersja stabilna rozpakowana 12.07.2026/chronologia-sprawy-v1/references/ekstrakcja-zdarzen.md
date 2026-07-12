# Ekstrakcja Zdarzeń — Reguły Szczegółowe

## 1. FORMATY DAT DO ROZPOZNANIA

### Formaty jawne (bezpośrednie)
```
dd.mm.rrrr         → 15.03.2023
dd/mm/rrrr         → 15/03/2023
dd-mm-rrrr         → 15-03-2023
d miesiąc rrrr     → 15 marca 2023 r.
miesiąc rrrr       → marzec 2023 (precyzja: miesiąc)
rrrr               → 2023 (precyzja: rok)
```

### Formaty względne (wymagają zakotwiczenia)
```
"następnego dnia"          → +1 dzień od daty referencyjnej
"w ciągu 7 dni"            → zakres od daty referencyjnej
"po upływie miesiąca"      → +30 dni od daty referencyjnej
"w tym samym miesiącu"     → ten sam miesiąc
"rok później"              → +12 miesięcy od daty referencyjnej
"przed rozprawą"           → przed datą znana z innego miejsca
"w dniu doręczenia"        → synchronizacja z datą doręczenia
```

### Daty kontekstowe (wnioskowane z treści)
```
"po wydaniu wyroku"        → po dacie wyroku z akt
"w trakcie zatrudnienia"   → zakres dat zatrudnienia z umowy
"podczas urlopu"           → zakres urlopu z dokumentu
```

---

## 2. TYPY DOKUMENTÓW — GDZIE SZUKAĆ DAT

### Pismo procesowe (pozew, odpowiedź, apelacja)
```
GDZIE SZUKAĆ:
• Nagłówek: data pisma (≠ data zdarzenia — UWAGA)
• Prezentata sądu: data wpływu (= data procesowa)
• Uzasadnienie faktyczne: daty zdarzeń (główne źródło)
• Petitum: daty żądanych orzeczeń ("od dnia X")
• Dowody powołane: daty dokumentów dowodowych

PUŁAPKA: Data pisma ≠ data zdarzenia. Data w uzasadnieniu > data pisma.
```

### Wyrok / postanowienie
```
GDZIE SZUKAĆ:
• Nagłówek: data wydania (= data orzeczenia)
• Sygnatura: rok sprawy (kontekst czasowy)
• Treść: daty przywołanych faktów
• Uzasadnienie: daty zdarzeń ustalone przez sąd
• Sentencja: data od której liczyć skutki (np. "od dnia X")

UWAGA: Daty w uzasadnieniu wyroku = ustalenia sądu (wysoka wiarygodność).
```

### Umowa
```
GDZIE SZUKAĆ:
• Data zawarcia (nagłówek lub podpisy)
• Data wejścia w życie (może różnić się od zawarcia)
• Terminy świadczeń (§/art. z terminami)
• Data rozwiązania / wygaśnięcia
• Aneksy: data każdego aneksu

PUŁAPKA: Umowa podpisana ≠ data wejścia w życie jeśli jest klauzula suspensywna.
```

### Protokół (przesłuchania, oględzin, rozprawy)
```
GDZIE SZUKAĆ:
• Nagłówek: data i godzina (= data zdarzenia procesowego)
• Treść zeznań: daty podawane przez przesłuchiwanego
• Adnotacje przewodniczącego: daty postanowień

UWAGA: Zeznania zawierają daty subiektywne — oznacz jako [ZEZNANIE].
```

### Korespondencja (e-mail, pismo urzędowe, wezwanie)
```
GDZIE SZUKAĆ:
• Nagłówek/stopka: data wysłania
• Potwierdzenie odbioru: data doręczenia (kluczowe dla terminów!)
• Treść: daty zdarzeń opisywanych
• Odpowiedź: data odpowiedzi = min. data doręczenia oryginału

PUŁAPKA: Data wysłania ≠ data doręczenia. Terminy biegną od doręczenia.
```

### Decyzja administracyjna
```
GDZIE SZUKAĆ:
• Data decyzji (= data wydania)
• Data doręczenia (ze zwrotnego potwierdzenia odbioru — ZPO)
• Data, od której liczyć termin odwołania (14 dni od doręczenia)
• Daty zdarzeń opisanych w uzasadnieniu
```

---

## 3. PEWNOŚĆ ZDARZENIA — CZTERY KLASY (v2)

### [BEZSPORNE]  ✓✓
```
Kryteria (choć jedno):
• Fakt potwierdzony przez obie strony postępowania (np. w piśmie przygotowawczym,
  odpowiedzi na pozew, protokole rozprawy — "okoliczność niesporna")
• Fakt ustalony przez sąd w prawomocnym orzeczeniu
• Fakt wynikający z dokumentu urzędowego niekwestionowanego przez żadną stronę

Priorytet w piśmie:
→ Prezentuj BEZ powołania dowodu: "Niespornym jest, że w dniu X..."
→ Nie poświęcaj zasobów argumentacyjnych na ich udowadnianie
→ Sekcja A eksportu (pierwsza, skraca uzasadnienie)

Pułapka: faktu nie uznaje się za BEZSPORNE tylko dlatego, że strona przeciwna
milczy lub nie odpowiedziała. Wymagane aktywne potwierdzenie lub orzeczenie sądu.
```

### [PEWNE]  ✓
```
Kryteria (wszystkie muszą być spełnione):
✓ Data jawna w dokumencie (dd.mm.rrrr)
✓ Dokument urzędowy lub z potwierdzeniem odbioru
✓ Brak sprzeczności z innymi źródłami
✓ Jedna strona twierdzi, druga nie kwestionuje wprost

Przykłady:
• Data na wyroku sądu (sygnatura, data wydania)
• Data w prezentatce kancelarii sądowej
• Data na ZPO (potwierdzenie doręczenia)
• Data zawarcia umowy potwierdzona przez obie strony podpisem
```

### [WYDEDUKOWANE]  ~
```
Kryteria:
• Brak bezpośredniego dokumentu z datą zdarzenia
• Zdarzenie logicznie wynika z co najmniej dwóch PEWNYCH faktów
• Brak alternatywnego wyjaśnienia zgodnego z materiałem dowodowym

Obowiązkowy zapis rozumowania:
  DEDUKUJĘ:    "[opis wnioskowanego zdarzenia]"
  PODSTAWA:    "[fakt A] (DOK-XX, str. N) + [fakt B] (DOK-YY, str. M)"
  PRZEDZIAŁ:   "zdarzenie nastąpiło MIĘDZY [data_A] a [data_B]"
               LUB "zdarzenie nastąpiło PRZED [data_X] ponieważ..."
               LUB "zdarzenie nastąpiło PO [data_Y] ponieważ..."
  PEWNOŚĆ:     [0–10] — skala pewności logicznej:
               10 = jedyne możliwe wyjaśnienie
                7 = najbardziej prawdopodobne, brak dowodu przeciwnego
                5 = równie prawdopodobne jak inne wyjaśnienia
                3 = możliwe, ale są silniejsze alternatywy
                0 = czysta spekulacja — NIE UŻYWAJ WYDEDUKOWANE dla 0–2

Zastosowanie w piśmie:
"Z całokształtu materiału dowodowego wynika, że... [opis]. Przemawia za tym
[fakt A] wynikający z [DOK-XX] oraz [fakt B] wynikający z [DOK-YY]."

Zakaz: nie używaj WYDEDUKOWANE jako etykiety dla twierdzeń strony bez dowodu.
Twierdzenia strony bez potwierdzenia → [SPORNE] lub [TWIERDZENIE_STRONY].
```

### [SPORNE]  ⚠
```
Kryteria (choć jedno):
• Dwie różne daty dla tego samego zdarzenia w różnych źródłach
• Data kwestionowana wprost przez stronę
• Sprzeczność wewnętrzna w jednym dokumencie
• Twierdzenie jednej strony bez dokumentu potwierdzającego, kwestionowane przez drugą

Oznaczenie: ⚠ [SPORNE] → SPRZECZNOŚĆ-[N] (zawsze z odesłaniem do Indeksu Sprzeczności)
Obowiązkowe: podać obie wersje z dok_id i autorem twierdzenia
```

---

## 3A. PROWENIENCJA ZDARZENIA — POLA OBOWIĄZKOWE (v2)

```
Dla każdego zdarzenia wypełnij:

typ_zrodla:
  DOKUMENT_URZEDOWY    — wyrok, postanowienie, decyzja, ZPO, prezentata
  DOKUMENT_PRYWATNY    — umowa, pismo, faktura, wezwanie, list
  KORESPONDENCJA       — e-mail, SMS, pismo urzędowe z potwierdzeniem
  ZEZNANIE             — protokół przesłuchania, zeznania pisemne
  DEDUKCJA             — wniosek z kilku faktów (tylko dla WYDEDUKOWANE)
  TWIERDZENIE_STRONY   — twierdzenie w piśmie procesowym bez dowodu

dok_id:
  Identyfikator z inwentaryzacji: DOK-01, DOK-02, …
  Dla DEDUKCJA: lista źródeł [DOK-01, DOK-03]

strona_dok:
  Numer strony / akapit / paragraf / nagłówek
  Przykłady: "str. 3", "§ 5 ust. 2", "nagłówek", "str. 1, pkt 3", "uzasadnienie"
  Dla e-mail: "nagłówek wiadomości" / "treść wiadomości"
  Dla zeznania: "str. 2, odpowiedź na pytanie 4"

autor_twierdzenia:
  powod / pozwany / sad / biegly / organ / osoba_trzecia /
  obie_strony (tylko dla BEZSPORNE)
  Wartość "obie_strony" rezerwowana wyłącznie dla faktów BEZSPORNE.
```

---

## 4. ZNACZENIE ZDARZENIA — KLASYFIKACJA

### [KLUCZOWE]
```
Kryteria: zdarzenie, od którego zależą:
• Skuteczność doręczenia / bieg terminu
• Przedawnienie roszczenia
• Właściwość sądu
• Powstanie / wygaśnięcie zobowiązania
• Zasadność roszczenia głównego

→ ZAWSZE uwzględnić w sekcji faktów pisma procesowego
```

### [ISTOTNE]
```
Kryteria: zdarzenie, które:
• Wzmacnia lub osłabia pozycję strony
• Buduje kontekst faktyczny
• Jest warunkiem dla zdarzenia KLUCZOWEGO
• Dotyczy zachowania strony istotnego dla oceny winy/należytości

→ Zazwyczaj uwzględnić w uzasadnieniu
```

### [TŁO]
```
Kryteria: zdarzenie, które:
• Dostarcza kontekstu, ale nie wpływa na rozstrzygnięcie
• Jest powtórzeniem z innego dokumentu
• Dotyczy faktów niespornych i oczywistych

→ Można pominąć lub umieścić w przypisie
```

---

## 5. ALGORYTM PRZETWARZANIA WIELU DOKUMENTÓW (v2)

```
KROK 1 — Inwentaryzacja
  Lista wszystkich dokumentów z: DOK-id, nazwa, typ, data pisma, autor

KROK 2 — Identyfikacja wątków prawnych
  Nazwij wątki: W1, W2, … (np. W1: Stosunek pracy, W2: Wypowiedzenie)
  Przypisanie zdarzenia do wątku możliwe do wielu wątków jednocześnie

KROK 3 — Ekstrakcja równoległa
  Dla każdego dokumentu: wypisz zdarzenia wg schematu v2
  Wypełnij proweniencję: typ_zrodla, dok_id, strona_dok, autor_twierdzenia
  Nie deduplikuj jeszcze — zachowaj wszystkie wzmianki

KROK 4 — Klasyfikacja pewności
  Dla każdego zdarzenia: BEZSPORNE / PEWNE / WYDEDUKOWANE / SPORNE
  Dla WYDEDUKOWANE: zapisz rozumowanie + przedział czasowy
  Dla SPORNE: zanotuj obie wersje z dok_id do Indeksu Sprzeczności

KROK 5 — Deduplikacja
  Grupuj zdarzenia o tej samej dacie i opisie z różnych źródeł
  → jedno zdarzenie + lista proveniencji (wszystkie potwierdzające źródła)
  → jeśli różne daty → nie deduplikuj, oznacz jako SPORNE → Indeks Sprzeczności

KROK 6 — Budowa Indeksu Sprzeczności
  Dla sprzeczności DAT:
    Porównaj pole `data` dla zdarzeń opisujących tę samą okoliczność faktyczną
    → załaduj references/sprzecznosci-dat.md → określ kategorię A/B/C
    → zapisz TYP: DATA

  Dla sprzeczności OPISÓW:
    Porównaj treść opisów zdarzeń z tej samej lub zbliżonej daty
    Szukaj rozbieżności w: przebiegu zdarzenia, sprawcy, skutku, okolicznościach,
    intensywności działania, roli uczestników, charakterze zachowania
    → określ kategorię A/B/C przez analogię z katalogiem dat (patrz niżej)
    → zapisz TYP: OPIS

  Dla każdego rekordu SPRZECZNOŚĆ-[N]:
    → zapisz obie wersje z pełną proweniencją (dok_id, strona_dok, autor_twierdzenia)
    → oznacz kolizja_id i typ_kolizji na obu zdarzeniach

KROK 7 — Budowa osi czasu per wątek
  Osobna chronologia dla W1, W2, …
  Węzły wspólne (zdarzenie w >1 wątku): oznacz [WSPÓLNY], wymień pozostałe wątki

KROK 8 — Widok zbiorczy CROSS-WĄTEK
  Wszystkie zdarzenia posortowane globalnie — do wykrywania sprzeczności MIĘDZY wątkami
  Porównaj wątki: czy data zdarzenia w W1 jest spójna z datą w W2?

KROK 9 — Wyodrębnienie faktów BEZSPORNE
  Lista do sekcji A eksportu — prezentowane bez dowodów w piśmie

KROK 10 — Walidacja kompletności
  Czy każdy wątek ma ciągłą oś czasu?
  Czy brakuje zdarzeń między kluczowymi punktami?
  → oznacz luki per wątek
```

---

## 6. SZCZEGÓLNE PRZYPADKI

### Sprawy pracownicze
```
Kluczowe daty do zawsze wyciągania:
• Zawarcie umowy o pracę (data + rodzaj umowy)
• Każda zmiana stanowiska / wynagrodzenia
• Zdarzenia inicjujące konflikt (pierwsze naruszenie, mobbing od kiedy)
• Doręczenie wypowiedzenia (nie data pisma, lecz data doręczenia!)
• Ostatni dzień pracy
• Data upływu okresu wypowiedzenia
• Data złożenia pozwu (termin 21 dni od doręczenia wypowiedzenia!)
```

### Sprawy karne / wykroczeniowe
```
Kluczowe daty:
• Data czynu (ewentualnie zakres "od–do" przy przestępstwie ciągłym)
• Data zawiadomienia / złożenia doniesienia
• Data wszczęcia postępowania
• Data zatrzymania / przeszukania
• Daty przesłuchań
• Data przedstawienia zarzutów
• Daty terminów przedawnienia
```

### Sprawy cywilne / odszkodowawcze
```
Kluczowe daty:
• Data zdarzenia powodującego szkodę
• Data ujawnienia szkody (jeśli różna)
• Data wezwania do naprawienia szkody
• Bieg przedawnienia (3 lub 10 lat — weryfikuj w ISAP)
• Data wniesienia pozwu (przerywa przedawnienie)
```

### Sprawy administracyjne / ZUS
```
Kluczowe daty:
• Data złożenia wniosku / podania
• Data decyzji
• Data doręczenia decyzji (ZPO)
• Termin odwołania (14 dni od doręczenia)
• Data odwołania (czy w terminie?)
• Data decyzji odwoławczej
• Data skargi do WSA (30 dni od doręczenia decyzji odwoławczej)
```

### Sprawy z rozliczeniami finansowymi między stronami lub z osobami trzecimi [NOWE v1.2]
```
Dotyczy: spraw pracowniczych z rozliczeniami pozapłacowymi (opłaty pobierane od
kandydatów/klientów, zaliczki, kaucje), spraw o zwrot nienależnie pobranych
świadczeń, spraw z wątkiem pokrzywdzonych osób trzecich (np. cudzoziemcy
wnoszący opłaty za pośrednictwo w uzyskaniu zezwolenia na pracę).

OBOWIĄZKOWO stosuj sekcję 3B (KORELACJA FINANSOWA) z SKILL.md — nie poprzestawaj
na wypisaniu kwot jako zwykłych "zdarzeń" bez pól kwota/płatnik/odbiorca/termin/status.

Kluczowe dane do zawsze wyciągania:
• Każda kwota pobrana od osoby trzeciej — tytuł, data, potwierdzenie (pokwitowanie,
  przelew, zapis w arkuszu rozliczeniowym)
• Każda deklaracja zwrotu — kto, komu, ile, kiedy (deklarowany termin) — z
  korespondencji NIEFORMALNEJ (czat, SMS) równie rygorystycznie jak z dokumentów
  formalnych, ponieważ to właśnie w korespondencji nieformalnej pojawiają się
  najczęściej przyznania w rodzaju "ona nadal ma moje pieniądze"
• Status na dzień najpóźniejszego dokumentu w aktach — czy zwrot nastąpił, czy
  kwota pozostaje NIEROZLICZONA
• Czy ta sama osoba/kwota pojawia się w więcej niż jednym źródle (arkusz +
  wiadomość + zeznanie) — jeśli tak, zbuduj wiersz rekoncyliacji łączący wszystkie
  źródła, zamiast referować do nich osobno w różnych miejscach chronologii
```

---

## 7. KATALOG SPRZECZNOŚCI OPISOWYCH — KATEGORIE

Analogia do katalogu sprzeczności dat (references/sprzecznosci-dat.md).
Klasyfikacja A/B/C przez wpływ procesowy — identyczna metodologia.

### KATEGORIA A — Sprzeczności KRYTYCZNE (mogą zmienić wynik sprawy)

#### A-O1 — Sprawca vs brak sprawcy
```
PROBLEM: Źródło X wskazuje konkretną osobę jako sprawcę; źródło Y nie potwierdza
         jej udziału lub wskazuje inną osobę
TYPOWE W: sprawach karnych, pracowniczych (mobbing, dyskryminacja), odszkodowawczych
ROZSTRZYGNIĘCIE: Hierarchia źródeł (REGUŁA EKSTRAKCJI pkt 7) + dowód rzeczowy
WPŁYW: zmiana podmiotu odpowiedzialnego = zmiana stron sporu lub kwalifikacji czynu
```

#### A-O2 — Charakter zachowania zmieniający kwalifikację prawną
```
PROBLEM: Źródło X: "groził" / "uderzył" / "zabrał"; źródło Y: "ostrzegał" /
         "popchnął" / "wziął za zgodą"
TYPOWE W: sprawach karnych (art. kwalifikujący), sprawach o naruszenie dóbr osobistych
ROZSTRZYGNIĘCIE: Dowód obiektywny (nagranie, obrażenia, dokument) > zeznania
WPŁYW: może zmienić kwalifikację z przestępstwa na wykroczenie lub odwrotnie
```

#### A-O3 — Sprzeczność co do treści oświadczenia woli
```
PROBLEM: Strona A twierdzi że oświadczyła X; strona B twierdzi że usłyszała Y
TYPOWE W: umowach ustnych, wypowiedzeniach ustnych, zgodzie na czynność
ROZSTRZYGNIĘCIE: Forma pisemna > zeznania; nagranie > zeznania
WERYFIKUJ: art. 60–65 KC (wykładnia oświadczeń woli)
WPŁYW: może zmienić skuteczność czynności prawnej lub treść umowy
```

#### A-O4 — Sprzeczność co do wiedzy / świadomości strony
```
PROBLEM: Źródło X: strona wiedziała o okoliczności X; źródło Y: strona nie wiedziała
TYPOWE W: sprawach o błąd (art. 84 KC), rękojmię, ubezpieczenia (zatajenienie)
ROZSTRZYGNIĘCIE: Dokumenty potwierdzające doręczenie / informowanie > zeznania
WPŁYW: wpływa na ważność czynności prawnej lub odpowiedzialność z rękojmi/gwarancji
```

#### A-O5 — Rozbieżność tożsamości osoby podpisującej / wskazanej w dokumencie
```
PROBLEM: Dokument dowodowy (pokwitowanie, formularz, podpis) zawiera zapis
         imienia/nazwiska osoby, który różni się od danych strony lub świadka
         używanych w pismach procesowych (np. "Wiatrak" w pozwie vs "Wiatr" na
         pokwitowaniu; "Poudel" w pismach vs "Paudel" na pokwitowaniu)
TYPOWE W: sprawach z dokumentami gotówkowymi/pokwitowaniami, sprawach z licznymi
          podobnymi nazwiskami, dokumentach skanowanych/OCR
ROZSTRZYGNIĘCIE: Nie zakładaj automatycznie że to ta sama osoba ani że to inna
         osoba — oznacz jako [SPORNE]/[DOUBT][IDENT] i wskaż konieczność wyjaśnienia
WERYFIKUJ: czy strona, której dotyczy dokument, kiedykolwiek wyjaśniła rozbieżność;
         brak wyjaśnienia w żadnym dotychczasowym piśmie podnosi kategorię do A-KRYTYCZNA
WPŁYW: jeśli dokument jest GŁÓWNYM dowodem dla istotnej przesłanki (np. zgoda na
         potrącenie, pokwitowanie odbioru środków) — rozbieżność tożsamości
         podważa wartość dowodową całego dokumentu
```

---

### KATEGORIA B — Sprzeczności ISTOTNE (wpływają na narrację faktyczną)

#### B-O1 — Intensywność / natężenie zachowania
```
PROBLEM: "krzyczał" vs "mówił podniesionym głosem"; "regularnie" vs "kilka razy";
         "systematycznie" vs "sporadycznie"
TYPOWE W: sprawach o mobbing, naruszenie dóbr osobistych, przemoc
ROZSTRZYGNIĘCIE: Więcej świadków po jednej stronie; nagrania; dokumentacja medyczna
WPŁYW: wpływa na ocenę czy zachowanie przekracza próg prawny (np. mobbing wg art. 94³ KP)
```

#### B-O2 — Przebieg zdarzenia (sekwencja działań)
```
PROBLEM: Źródło X podaje sekwencję A→B→C; źródło Y podaje B→A→C lub pomija krok
TYPOWE W: wypadkach, zdarzeniach karnych, sporach o wykonanie umowy
ROZSTRZYGNIĘCIE: Dokumentacja techniczna / protokół oględzin > zeznania stron
WPŁYW: może zmienić ocenę przyczynowości lub przyczynienia się
```

#### B-O3 — Rola uczestnika (sprawca / świadek / pokrzywdzony)
```
PROBLEM: Osoba X według jednego źródła aktywnie uczestniczyła; według innego była
         tylko obecna lub o niczym nie wiedziała
TYPOWE W: sprawach karnych (współsprawstwo), pracowniczych (mobbing zbiorowy)
ROZSTRZYGNIĘCIE: Zeznania krzyżowe + dokumenty (e-maile, logi dostępu)
WPŁYW: odpowiedzialność solidarna lub jej brak; zakres odszkodowania
```

#### B-O4 — Sprzeczność co do treści umowy / uzgodnień
```
PROBLEM: Strony różnią się co do tego co uzgodniły (warunki, cena, zakres)
TYPOWE W: umowach z elementem negocjacji, zamówieniach, projektach IT
ROZSTRZYGNIĘCIE: Forma pisemna > e-mail > zeznania; ostatnia wersja dokumentu > wcześniejsze
WPŁYW: wpływa na zakres zobowiązania i podstawę roszczenia
```

#### B-O5 — Sprzeczność zeznań świadka z własnym wcześniejszym zeznaniem
```
PROBLEM: Ten sam świadek zeznaje inaczej w różnych momentach postępowania
TYPOWE W: każdy rodzaj sprawy (zeznania policyjne vs sądowe)
ROZSTRZYGNIĘCIE: Wcześniejsze zeznanie (bliższe zdarzeniu) często wiarygodniejsze;
                 wyjaśnij przyczynę zmiany
WPŁYW: impeachment świadka — użyj w przesluchanie-swiadkow-v2
```

---

### KATEGORIA C — Sprzeczności MARGINALNE

#### C-O1 — Różnice stylistyczne / subiektywna ocena
```
PROBLEM: "zdenerwowany" vs "wzburzony"; "późno" vs "po godz. 18"
ROZSTRZYGNIĘCIE: Przyjmij wersję bardziej konkretną / obiektywną
WPŁYW: Brak — chyba że kontekst czyni różnicę prawnie istotną
```

#### C-O2 — Różne poziomy szczegółowości opisu
```
PROBLEM: Jeden dokument opisuje zdarzenie szczegółowo, inny skrótowo —
         brak sprzeczności co do istoty
ROZSTRZYGNIĘCIE: Wersja bardziej szczegółowa jako uzupełnienie
WPŁYW: Brak
```

---

## REGUŁA WYKRYWANIA SPRZECZNOŚCI OPISOWYCH

```
KROK 1: Dla każdego zdarzenia z >1 źródłem — porównaj opisy dosłownie
KROK 2: Zadaj pytanie: "Czy oba opisy mogą być jednocześnie prawdziwe?"
        TAK  → nie ma sprzeczności (różny poziom szczegółowości / perspektywa)
        NIE  → sprzeczność opisowa → zapisz do Indeksu
KROK 3: Dla sprzeczności OPIS — zacytuj dosłownie obie wersje (lub kluczowy fragment)
        Zakaz parafrazowania obu stron tymi samymi słowami — ukrywa sprzeczność
KROK 4: Określ co dokładnie się różni:
        [przebieg] / [sprawca] / [skutek] / [okoliczności] / [intensywność] /
        [rola uczestnika] / [treść oświadczenia] / [wiedza strony]
KROK 5: Przypisz kategorię A-O / B-O / C-O i oceń wpływ procesowy
KROK 6: Zaproponuj dowód który rozstrzygnąłby sprzeczność
```

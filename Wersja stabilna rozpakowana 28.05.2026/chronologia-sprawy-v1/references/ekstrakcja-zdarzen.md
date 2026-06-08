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

## 3. PEWNOŚĆ DATY — KRYTERIA KLASYFIKACJI

### [PEWNA]
```
Kryteria (wszystkie muszą być spełnione):
✓ Data jawna w dokumencie (dd.mm.rrrr)
✓ Dokument urzędowy lub z potwierdzeniem
✓ Brak sprzeczności z innymi źródłami
✓ Data nie jest kwestionowana przez żadną stronę

Przykłady:
• Data na wyroku sądu
• Data w prezentatce kancelarii
• Data na ZPO (potwierdzenie doręczenia)
```

### [SZACOWANA]
```
Kryteria (choć jedno):
• Data względna wyliczona z daty referencyjnej
• Precyzja niższa niż dzień (tylko miesiąc lub rok)
• Data jawna, ale brak potwierdzenia

Oznaczenie w raporcie: ~dd.mm.rrrr lub [zakres: od–do]
```

### [SPORNA]
```
Kryteria (choć jedno):
• Dwie różne daty dla tego samego zdarzenia w różnych źródłach
• Data kwestionowana wprost przez stronę
• Sprzeczność wewnętrzna w jednym dokumencie

Oznaczenie: ⚠ [data1] wg [źródło1] / [data2] wg [źródło2]
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

## 5. ALGORYTM PRZETWARZANIA WIELU DOKUMENTÓW

```
KROK 1 — Inwentaryzacja
  Lista wszystkich dokumentów z: nazwa, typ, data pisma, autor

KROK 2 — Ekstrakcja równoległa
  Dla każdego dokumentu: wypisz zdarzenia wg schematu z SKILL.md
  Nie dedulikuj jeszcze — zachowaj wszystkie wzmianki

KROK 3 — Deduplikacja
  Grupuj zdarzenia o tej samej dacie i opisie z różnych źródeł
  → jedno zdarzenie + lista źródeł potwierdzających

KROK 4 — Wykrycie sprzeczności
  Porównaj daty dla tych samych zdarzeń we wszystkich parach dokumentów
  → załaduj references/sprzecznosci-dat.md

KROK 5 — Sortowanie
  Oś czasu od najstarszego do najnowszego
  Zdarzenia bez daty → na końcu w sekcji "nieustalone"

KROK 6 — Walidacja kompletności
  Czy oś czasu jest ciągła?
  Czy brakuje zdarzeń między kluczowymi punktami?
  → oznacz luki
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

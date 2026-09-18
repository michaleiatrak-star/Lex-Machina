# Sprzeczności Dat — Katalog Typowych Kolizji w Sprawach PL

## ZASADA OGÓLNA

Sprzeczność dat = ta sama okoliczność faktyczna ma różne daty w różnych źródłach.
Każda sprzeczność wymaga oceny: czy różnica ma **wpływ procesowy**?

---

## KATEGORIE SPRZECZNOŚCI

### KATEGORIA A — Sprzeczności KRYTYCZNE (mogą zmienić wynik sprawy)

#### A1 — Data doręczenia vs data nadania
```
PROBLEM: Pismo nadane [data1], doręczone [data2] — strona twierdziła inaczej.
TYPOWE W: terminach zawitych (apelacja, sprzeciw od nakazu, odwołanie od decyzji)
ROZSTRZYGNIĘCIE: Data doręczenia (ZPO / prezentata) > data wysłania
WERYFIKUJ: art. 165 KPC, art. 57 KPA
SKUTEK: termin zawity liczyć od daty DORĘCZENIA, nie nadania
```

#### A2 — Data wypowiedzenia vs data doręczenia wypowiedzenia
```
PROBLEM: Pracodawca datuje wypowiedzenie [data1], pracownik twierdzi że otrzymał [data2]
TYPOWE W: sprawach pracowniczych (termin 21 dni od doręczenia)
ROZSTRZYGNIĘCIE: Data doręczenia do rąk lub data awiza + 14 dni
WERYFIKUJ: art. 61 KC, art. 264 KP
SKUTEK: jeśli różnica >0 dni → mogła nastąpić różnica w kalkulacji terminu do sądu
```

#### A3 — Data zdarzenia vs data zawiadomienia organów
```
PROBLEM: Zdarzenie [data1], zawiadomienie złożone [data2 > data1 + 7 dni]
TYPOWE W: sprawach karnych, wykroczeniowych (wiarygodność pokrzywdzonego)
ROZSTRZYGNIĘCIE: Obie daty istotne — wyjaśnij przyczynę opóźnienia
SKUTEK: Zbyt późne zawiadomienie może osłabić wiarygodność zeznań
```

#### A4 — Data umowy vs data wejścia w życie
```
PROBLEM: Umowa podpisana [data1], klauzula: "wchodzi w życie dnia [data2]"
TYPOWE W: umowach z klauzulą suspensywną, umowach z datą przyszłą
ROZSTRZYGNIĘCIE: data wejścia w życie = data2, nie data podpisów
WERYFIKUJ: art. 89 KC (warunek), art. 116 KC (termin)
SKUTEK: Roszczenia przed data2 mogą być bezskuteczne
```

#### A5 — Data czynu vs termin przedawnienia
```
PROBLEM: Różne dokumenty wskazują różne daty czynu/zdarzenia
TYPOWE W: sprawach karnych, cywilnych odszkodowawczych
ROZSTRZYGNIĘCIE: Data najwcześniej poświadczona dokumentem urzędowym
WERYFIKUJ: art. 101 KK (przedawnienie karne), art. 442¹ KC (odszkodowanie)
SKUTEK: Różnica nawet 1 dnia może zmienić kwalifikację lub umorzyć sprawę
```

---

### KATEGORIA B — Sprzeczności ISTOTNE (wpływają na narrację faktyczną)

#### B1 — Data zawarcia umowy vs data pierwszego świadczenia
```
PROBLEM: Umowa zawarta [data1], pierwsze świadczenie spełnione [data2 < data1]
TYPOWE W: sprawach o wynagrodzenie, umowach ustnych potwierdzonych pisemnie
ROZSTRZYGNIĘCIE: Sprawdź czy była umowa ustna przed pisemną
SKUTEK: Może wskazywać na faktyczną datę zawarcia umowy wcześniejszą niż pisemna
```

#### B2 — Daty w zeznaniach vs daty w dokumentach
```
PROBLEM: Świadek/strona zeznaje "[data_zeznana]", dokument wskazuje "[data_dok]"
TYPOWE W: każdym rodzaju sprawy
ROZSTRZYGNIĘCIE: Dokument urzędowy > zeznanie (art. 244 KPC)
SKUTEK: Wiarygodność zeznań pod znakiem zapytania — nie kwestionować zeznań bez dowodu
```

#### B3 — Data zwolnienia lekarskiego vs data zdarzenia
```
PROBLEM: Pracownik wystawił L4 [data1], zdarzenie powodujące niezdolność [data2]
TYPOWE W: sporach pracowniczych, wypadkach przy pracy
ROZSTRZYGNIĘCIE: Sprawdź czy L4 obejmuje datę zdarzenia
SKUTEK: L4 wystawione przed zdarzeniem = podejrzenie nadużycia; po zdarzeniu = prawidłowo
```

#### B4 — Daty korespondencji e-mail (serwer vs klient)
```
PROBLEM: Data wysłania e-mail w Outlooku ≠ data w nagłówkach serwera
TYPOWE W: sprawach korporacyjnych, IT, umowach elektronicznych
ROZSTRZYGNIĘCIE: Nagłówki serwera (Received:) > data klienta
SKUTEK: Dowód elektroniczny wymaga weryfikacji nagłówków
```

---

### KATEGORIA C — Sprzeczności MARGINALNE (zazwyczaj bez wpływu)

#### C1 — Data pisma vs data prezentaty (kilka dni)
```
PROBLEM: Pismo datowane [data1], wpłynęło do sądu [data1+3 dni]
ROZSTRZYGNIĘCIE: Dla terminów liczy się prezentata (wpływ do sądu)
SKUTEK: Marginalny jeśli obie daty w terminie
```

#### C2 — Różne pisownie tej samej daty
```
PROBLEM: "15 marca 2023" vs "15.03.2023" — możliwy błąd pisarski
ROZSTRZYGNIĘCIE: Sprawdź kontekst — raczej ta sama data
SKUTEK: Brak, chyba że wynika z błędu istotnego
```

#### C3 — Data protokołu vs data zdarzenia protokołowanego
```
PROBLEM: Protokół sporządzony [data2], opisuje zdarzenie z [data1]
ROZSTRZYGNIĘCIE: Typowe — protokół sporządza się po zdarzeniu
SKUTEK: Brak, chyba że opóźnienie jest podejrzanie duże (>7 dni bez wyjaśnienia)
```

---

## KATEGORIA D — Sprzeczności KWOTOWE [NOWE v1.2, audyt 2026-07-12]

> Dodane na wyraźne wskazanie użytkownika: korelacja kwot, terminów zwrotów i stron
> płatności między dokumentami musi być sprawdzana obowiązkowo, tak samo jak
> sprzeczności dat — patrz też SKILL.md sekcja 3B (KORELACJA FINANSOWA).

#### D1 — Kwota zadeklarowana vs kwota potwierdzona jako rozliczona
```
PROBLEM: Dokument/wiadomość X wskazuje kwotę do zapłaty/zwrotu [kwota1];
         inne źródło (późniejsze w czasie) wskazuje inną kwotę [kwota2] dla
         tej samej relacji płatniczej (ten sam płatnik + odbiorca + tytuł)
TYPOWE W: rozliczeniach nieformalnych (czat, SMS) zestawianych z arkuszami/
          rejestrami wewnętrznymi, sprawach o zwrot nienależnie pobranych
          świadczeń, sprawach z udziałem osób trzecich (np. kandydaci do pracy)
ROZSTRZYGNIĘCIE: dowód przelewu/pokwitowania > zapis w rejestrze wewnętrznym >
                 twierdzenie w korespondencji nieformalnej > twierdzenie gołosłowne
SKUTEK: różnica może oznaczać częściowe rozliczenie w czasie (nie musi być
        sprzecznością) — sprawdź KOLEJNOŚĆ CZASOWĄ źródeł przed uznaniem za
        sprzeczność; jeśli źródła są jednoczesne/nie da się ustalić kolejności
        → SPORNE
```

#### D2 — Rozbieżność co do statusu rozliczenia (zapłacone / zaległe)
```
PROBLEM: Jedno źródło twierdzi "zapłacone", inne (dla tej samej kwoty i relacji)
         twierdzi "do zapłaty"/"zaległe"
TYPOWE W: rejestrach opłat z wielokrotnymi wpisami, korespondencji rozciągniętej
          w czasie
ROZSTRZYGNIĘCIE: sprawdź datę każdego źródła — status w NAJPÓŹNIEJSZYM
                 chronologicznie dokumencie ma pierwszeństwo, o ile nie ma
                 dowodu przeciwnego po tej dacie
SKUTEK: jeśli nie da się ustalić, który dokument jest późniejszy →
        oznacz jako [NIEROZLICZONE — STATUS NIEJEDNOZNACZNY], nie wybieraj
        wersji korzystniejszej dla strony bez podstawy
```

#### D3 — Tożsamość płatnika/odbiorcy przy danych szczątkowych
```
PROBLEM: Kwota jest przypisana do numeru telefonu/pseudonimu w jednym źródle,
         a do imienia i nazwiska w innym — bez jawnego potwierdzenia, że to
         ta sama osoba
ROZSTRZYGNIĘCIE: nie zakładaj automatycznie tożsamości — oznacz jako
                 [OSOBA-NIEZIDENTYFIKOWANA-N] dopóki nie ma potwierdzenia
                 (np. zbieżność numeru telefonu z nazwą pliku/arkusza to
                 poszlaka, NIE dowód — oceń ją w skali pewności 0–10 jak
                 [WYDEDUKOWANE], nigdy jako [BEZSPORNE])
SKUTEK: błędne połączenie osoby z kwotą może wypaczyć całą rekoncyliację
        finansową i skutkować przypisaniem cudzego zobowiązania
```

---

## ALGORYTM OCENY SPRZECZNOŚCI KWOTOWEJ (analogicznie do dat)

```
KROK 1: Zidentyfikuj parę dokumentów odnoszących się do tej samej relacji
        płatniczej (ten sam płatnik + odbiorca + tytuł, lub silna poszlaka
        wskazująca na tę samą relację — np. identyczny numer kontaktu)
KROK 2: Ustal kolejność czasową źródeł (które jest wcześniejsze/późniejsze)
KROK 3: Sprawdź czy różnica kwoty da się wyjaśnić częściowym rozliczeniem
        w czasie (rata/zaliczka) — jeśli TAK, nie jest to sprzeczność, tylko
        etap rozliczenia; odnotuj obie kwoty na osi czasu bez oznaczania SPRZECZNOŚĆ
KROK 4: Jeśli różnicy nie da się tak wyjaśnić → KATEGORIA D1/D2/D3 → oceń wpływ:
  → Kwota jest wprost przedmiotem żądania w sprawie → KRYTYCZNY
  → Kwota wzmacnia/osłabia wiarygodność strony/świadka (wzór zachowania) → ISTOTNY
  → Różnica rzędu zaokrągleń bez znaczenia dla żądań → MARGINALNY
KROK 5: Wskaż źródło rozstrzygnięcia (hierarchia z D1)
KROK 6: Zaproponuj rekomendację — najczęściej: zażądać dowodu przelewu/pokwitowania
```


## KATEGORIA A0 — FAŁSZYWE SPRZECZNOŚCI (błąd analityczny modelu, NIE sprzeczność źródeł)
[NOWE v1.3, audyt 2026-07-12 — patrz AUDIT-JOURNAL.md AUDYT-2026-07-12]

> Ta kategoria kataloguje sytuacje, w których DWA (lub więcej) stwierdzeń wyglądają
> na sprzeczne, ale po ścisłej analizie okazują się w pełni spójne. Rozpoznanie
> tych wzorców jest OBOWIĄZKOWE i musi nastąpić PRZED zakwalifikowaniem czegokolwiek
> do kategorii A/B/C. Błędne oznaczenie fałszywej sprzeczności jako prawdziwej jest
> traktowane jak błąd CRIT (wprowadza w błąd co do wiarygodności strony/świadka).

#### A0-1 — Pomylenie czasownika "dowiedzieć się o [X]" z "otrzymać/uzyskać [X]"
```
WZORZEC BŁĘDU: strona zeznaje (a) "o istnieniu dokumentu dowiedziałem się [data1]"
               oraz osobno (b) "dokument/kopię otrzymałem [data2]" — model odczytuje
               to jako dwie sprzeczne wersje "kiedy się dowiedziałem", podczas gdy
               to są DWA RÓŻNE ZDARZENIA PRAWNE:
               (a) = powzięcie wiedzy o samym istnieniu/treści (np. przy podpisywaniu,
                   przy ustnym poinformowaniu, przy odczytaniu na głos),
               (b) = fizyczne wejście w posiadanie dokumentu/kopii (doręczenie).
DLACZEGO TO NIE JEST SPRZECZNOŚĆ: obie daty mogą być prawdziwe jednocześnie —
               osoba może wiedzieć o istnieniu pisma od dnia X (bo je podpisała,
               bo jej je odczytano, bo brała udział w zdarzeniu), a fizyczną kopię
               do wglądu/na własność otrzymać dopiero w dniu Y > X (np. po formalnym
               wniosku i biegu terminu na jego rozpatrzenie).
PROCEDURA: zanim zgłosisz sprzeczność między dwoma datami dot. "wiedzy o dokumencie",
           wypisz OSOBNO dla każdej wzmianki: (1) dokładny czasownik użyty w źródle
           ("dowiedziałem się", "wiedziałem", "otrzymałem", "doręczono mi", "wydano mi",
           "podpisałem"), (2) czy dotyczy powzięcia wiedzy czy fizycznego posiadania.
           Sprzeczność istnieje TYLKO gdy ten sam czasownik/zdarzenie ma różne daty
           w różnych źródłach — NIE gdy różne czasowniki mają różne daty.
```

#### A0-2 — Brak wykonania arytmetyki dat przed zgłoszeniem sprzeczności
```
WZORZEC BŁĘDU: źródło A podaje datę względną ("X miesiące po zdarzeniu Y"),
               źródło B podaje datę bezwzględną (np. "styczeń 2025") — model
               zestawia je "na oko" bez policzenia, czy data względna faktycznie
               odpowiada dacie bezwzględnej, i błędnie zgłasza sprzeczność.
PROCEDURA OBOWIĄZKOWA: dla KAŻDEJ pary dat, z których co najmniej jedna jest
               wyrażona względnie (np. "N miesięcy/tygodni/dni po/od [zdarzenie]"),
               wykonaj jawne obliczenie: [data zdarzenia bazowego] + [N jednostek]
               = [data wynikowa]. Dopiero porównaj wynik z drugą datą. Jeśli wynik
               pokrywa się (nawet w przybliżeniu miesiąca) z drugą datą — to NIE
               jest sprzeczność, tylko potwierdzenie tej samej chronologii opisanej
               na dwa sposoby.
PRZYKŁAD (błąd rzeczywisty z sesji 2026-07-12): stosunek pracy zakończony w
               październiku 2024; strona twierdzi "otrzymałem dokument 3 miesiące
               po rozwiązaniu umowy" ORAZ osobno "otrzymałem w styczniu 2025".
               Arytmetyka: październik + 3 miesiące = styczeń. Obie wypowiedzi są
               ZGODNE. Błędem byłoby zestawienie ich jako sprzecznych bez wykonania
               tego działania.
```

---

## ALGORYTM OCENY SPRZECZNOŚCI

```
KROK 0 (OBOWIĄZKOWY, PRZED KROKIEM 1 — bramka przeciw fałszywym sprzecznościom):
  0a. Dla każdej wzmianki o dacie/terminie wypisz DOSŁOWNY czasownik/zdarzenie
      użyty w źródle (nie parafrazuj). Sprawdź wg A0-1, czy różne wzmianki opisują
      TO SAMO zdarzenie prawne, czy różne zdarzenia (wiedza vs posiadanie,
      podpisanie vs doręczenie, nadanie vs otrzymanie).
  0b. Jeśli którakolwiek data jest wyrażona względnie ("N dni/tygodni/miesięcy
      od/po ...") — wykonaj jawne obliczenie arytmetyczne (A0-2) i zapisz wynik
      przed porównaniem z drugą datą.
  0c. Dopiero po 0a i 0b: czy nadal istnieje rozbieżność między datami TEGO SAMEGO
      zdarzenia? Jeśli NIE → nie zgłaszaj sprzeczności (odnotuj jako spójne,
      opcjonalnie wyjaśnij czytelnikowi dlaczego pozornie wyglądały na sprzeczne).
      Jeśli TAK → przejdź do KROK 1.
KROK 1: Zidentyfikuj parę dokumentów z różnymi datami dla tego samego zdarzenia
KROK 2: Oblicz różnicę w dniach
KROK 3: Sprawdź kategorię (A/B/C) z katalogu powyżej
KROK 4: Oceń wpływ procesowy:
  → Czy zmienia bieg terminu zawitego? → KRYTYCZNY
  → Czy zmienia sekwencję przyczynową? → ISTOTNY
  → Czy nie wpływa na rozstrzygnięcie? → MARGINALNY
KROK 5: Wskaż źródło rozstrzygnięcia (które źródło wiarygodniejsze)
KROK 6: Zaproponuj rekomendację do pisma
```

---

## REKOMENDACJE STANDARDOWE

### Gdy sprzeczność jest KRYTYCZNA
```
"⚠ UWAGA KRYTYCZNA: Wykryto sprzeczność dat w zakresie [opis].
Różnica [N] dni może wpłynąć na [bieg terminu / przedawnienie / skuteczność].
PRZED KONTYNUACJĄ należy ustalić właściwą datę na podstawie dokumentu
[wskaż który] lub wyjaśnienia strony."
```

### Gdy sprzeczność jest ISTOTNA
```
"ℹ Sprzeczność istotna: [opis]. Rekomendowana data: [data] wg [źródło].
Rozważ wyjaśnienie rozbieżności w piśmie lub wniosek o sprostowanie."
```

### Gdy sprzeczność jest MARGINALNA
```
"Różnica techniczna: [opis]. Brak wpływu na rozstrzygnięcie.
Odnotowano w chronologii dla pełności."
```

---

## POLSKIE TERMINY ZAWITE — PROGI KRYTYCZNE

> UWAGA: Wszystkie terminy weryfikuj w ISAP przed podaniem. Tabela poglądowa.

| Zdarzenie | Termin | Podstawa (do weryfikacji) |
|-----------|--------|--------------------------|
| Apelacja cywilna | 2 tyg. od doręczenia z uzasadnieniem | art. 369 KPC |
| Sprzeciw od nakazu zapłaty | 2 tyg. od doręczenia | art. 502 KPC |
| Odwołanie od decyzji ZUS | 1 miesiąc od doręczenia | art. 477⁹ KPC |
| Odwołanie od decyzji administracyjnej | 14 dni od doręczenia | art. 129 KPA |
| Skarga do WSA | 30 dni od doręczenia decyzji II inst. | art. 53 PPSA |
| Pozew o przywrócenie do pracy | 21 dni od doręczenia wypowiedzenia | art. 264 KP |
| Zażalenie | 7 dni od doręczenia postanowienia | art. 394 KPC |

> KAŻDĄ z tych liczb WERYFIKUJ w ISAP przed podaniem użytkownikowi.
> Tabela służy tylko do identyfikacji — nie do cytowania.

# Kodeks pracy — current-state COV

**Stan weryfikacji:** 2026-08-28  
**Tekst jednolity bazowy:** Dz.U. 2025 poz. 277  
**Stan prawny tekstu jednolitego:** 2025-02-07  
**Źródło kanoniczne:** ELI/ISAP  
**Status:** **B+ / COV** — aktualna struktura kodeksu jest zmapowana do rodziny modułów prawa pracy; brak deklaracji `FULL` artykuł-po-artykule.

## 1. Bramka źródłowa

ELI: `https://eli.gov.pl/eli/DU/2025/277/ogl`

ELI wskazuje akty zmieniające po tekście jednolitym. Przed użyciem konkretnej jednostki sprawdź tekst ujednolicony oraz datę wejścia w życie właściwej nowelizacji. Nie utrwalaj w module dynamicznych kwot minimalnego wynagrodzenia, limitów zależnych od wynagrodzenia ani danych rocznych.

## 2. Mapa kodeksu

### Dział I — Przepisy ogólne

Zakres: przepisy wstępne, podstawowe zasady prawa pracy, równe traktowanie w zatrudnieniu oraz nadzór i kontrola przestrzegania prawa pracy.

**Runtime:** `mod-KP-prawo-pracy.md`, `mod-KP-mobbing-dyskryminacja.md`.

### Dział II — Stosunek pracy

Zakres: nawiązanie stosunku pracy, umowa o pracę, rozwiązanie i wygaśnięcie stosunku pracy, szczególne podstawy zatrudnienia oraz praca zdalna.

**Runtime:** `mod-KP-prawo-pracy.md`, `mod-KP-praca-zdalna.md` i moduły szczegółowe rozwiązania stosunku pracy.

### Dział III — Wynagrodzenie za pracę i inne świadczenia

Zakres: ustalanie wynagrodzenia, ochrona wynagrodzenia, świadczenia za okres niezdolności do pracy, odprawy.

Kwoty, limity potrąceń i wartości zależne od minimalnego wynagrodzenia zawsze pobieraj z aktualnego przepisu i urzędowego obwieszczenia.

### Dział IV — Obowiązki pracodawcy i pracownika

Zakres: podstawowe obowiązki stron, zakaz konkurencji, kwalifikacje zawodowe, regulamin pracy, nagrody oraz odpowiedzialność porządkowa.

**Runtime:** `mod-KP-prawo-pracy.md` + moduły dotyczące nadużyć pracodawcy, dokumentacji i obowiązków pracowniczych.

### Dział V — Odpowiedzialność materialna pracowników

Rozdziel odpowiedzialność za szkodę wyrządzoną pracodawcy od odpowiedzialności za mienie powierzone. Nie stosuj automatycznie zasad odpowiedzialności kontraktowej z KC bez uwzględnienia lex specialis Kodeksu pracy.

### Dział VI — Czas pracy

Zakres obejmuje m.in. normy i wymiar czasu pracy, odpoczynki, systemy i rozkłady czasu pracy, nadgodziny, pracę w nocy oraz niedziele i święta.

**Runtime:** `mod-KP-dzial-VI-czas-pracy.md`.

### Dział VII — Urlopy pracownicze

Zakres: urlop wypoczynkowy, urlop opiekuńczy oraz urlopy bezpłatne.

**Runtime:** `mod-KP-dzial-VII-urlopy-pracownicze.md`.

### Dział VIII — Uprawnienia pracowników związane z rodzicielstwem

Przy urlopach i uprawnieniach rodzicielskich równolegle sprawdź ustawę zasiłkową w zakresie świadczeń pieniężnych. Kodeks pracy reguluje uprawnienie pracownicze, a ustawa zasiłkowa — świadczenie z ubezpieczenia społecznego.

### Dział IX — Zatrudnianie młodocianych

Zakres: warunki zatrudniania, przygotowanie zawodowe, dokształcanie i szczególna ochrona zdrowia.

### Dział X — Bezpieczeństwo i higiena pracy

Zakres: obowiązki pracodawcy i pracownika, obiekty i pomieszczenia, maszyny, czynniki szkodliwe, profilaktyczna ochrona zdrowia, wypadki i choroby zawodowe, szkolenia oraz konsultacje BHP.

Przy normach technicznych i czynnikach szkodliwych zawsze dołącz aktualne rozporządzenia wykonawcze.

### Dział XI — Układy zbiorowe pracy

Zakres: układy ponadzakładowe i zakładowe. Sprawdź również aktualne prawo związkowe i przepisy szczególne, jeżeli sprawa dotyczy reprezentatywności lub sporu zbiorowego.

### Dział XII — Rozpatrywanie sporów o roszczenia ze stosunku pracy

Spory o roszczenia ze stosunku pracy prowadzą do sądu pracy. Procedurę sądową analizuj równolegle według KPC i właściwości sądu.

### Dział XIII — Wykroczenia przeciwko prawom pracownika

Dla sankcji i aktualnej kwalifikacji odczytaj bieżące przepisy Kodeksu pracy oraz sprawdź kompetencje Państwowej Inspekcji Pracy. Jeżeli czyn może stanowić przestępstwo, dołącz DR-03.

### Dział XIV — Przedawnienie roszczeń

Terminy przedawnienia pobieraj z aktualnego przepisu i kwalifikuj oddzielnie według rodzaju roszczenia. Nie przenoś automatycznie terminów z KC.

### Dział XV — Przepisy końcowe

Zakres końcowy i wykonawczy; akty wykonawcze pobieraj z ELI dla aktualnej daty.

## 3. Intake prawa pracy

Przed analizą ustal:
1. podstawę zatrudnienia i czy w ogóle powstał stosunek pracy;
2. rodzaj umowy lub innej podstawy zatrudnienia;
3. daty zawarcia, zmiany i rozwiązania stosunku pracy;
4. wymiar etatu, system czasu pracy i rozkład;
5. wynagrodzenie i jego składniki;
6. szczególną ochronę pracownika, jeżeli występuje;
7. obecność regulaminu, układu zbiorowego lub innych źródeł zakładowych;
8. właściwy termin dochodzenia roszczenia;
9. czy problem ma także wymiar ZUS, BHP, związkowy, antydyskryminacyjny lub karny.

## 4. Routing

- stosunek pracy / czas pracy / urlopy / BHP → DR-04;
- ZUS i świadczenia pieniężne → DR-04, właściwa ustawa ubezpieczeniowa;
- postępowanie przed sądem pracy → DR-02/KPC;
- wykroczenia i przestępstwa przeciw prawom pracownika → DR-03;
- związki zawodowe / układy / spory zbiorowe → DR-04 + właściwa ustawa szczególna;
- dyskryminacja i dobra osobiste → DR-04, a w razie potrzeby także DR-02.

## 5. Quality gate

- [ ] aktualny Dz.U. 2025 poz. 277 i tekst ujednolicony sprawdzone w ELI;
- [ ] sprawdzono późniejsze nowelizacje i ich daty wejścia w życie;
- [ ] ustalono prawidłową podstawę zatrudnienia;
- [ ] zakładowe źródła prawa pracy skonfrontowano z ustawą;
- [ ] czas pracy, urlop, wynagrodzenie i ochronę oceniono według właściwego działu;
- [ ] kwoty i limity dynamiczne pobrano z aktualnego źródła;
- [ ] termin przedawnienia ustalono według konkretnego roszczenia;
- [ ] procedurę sądową oddzielono od materialnego Kodeksu pracy.

## 6. Źródła urzędowe

- ELI — Kodeks pracy, Dz.U. 2025 poz. 277: `https://eli.gov.pl/eli/DU/2025/277/ogl`

**Zasada runtime:** ten plik jest indeksem pokrycia. Źródłem normy pozostaje aktualny tekst urzędowy i właściwe akty wykonawcze.
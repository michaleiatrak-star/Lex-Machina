# MODUŁ J6 — UMOWY IT: SaaS, WDROŻENIE, LICENCJA, AGILE, CLOUD, SLA
## Analizator Umów v1 · Moduł J6 (Rozbudowany)

> **Wczytaj dla:** umowy software development (waterfall i agile), umowy SaaS
> (Software as a Service), umowy licencyjne (oprogramowanie), umowy wdrożeniowe,
> umowy chmurowe (cloud), SLA (service level agreement), maintenance & support,
> escrow kodu źródłowego, konsorcjum IT, umowy B2B IT / kontrakt IT.

> ⛔ HARD GATE — PrAut: art. 41–65 (pola eksploatacji, przeniesienie/licencja),
> art. 53 (forma pisemna przeniesienia praw), art. 67 ust. 5 (forma pisemna licencji wyłącznej),
> art. 74–77² (programy komputerowe) — weryfikuj: isap.sejm.gov.pl → ustawa z 4.02.1994 r.
>
> ⚠ RODO — GATE OBOWIĄZKOWY:
> Każda umowa IT/SaaS gdzie kontrahent przetwarza dane osobowe → WYMAGA DPA (art. 28 RODO)
> Ten moduł (J6) zawiera tylko sygnały RODO w kontekście SaaS/cloud.
> Pełna analiza DPA, lista 13 elementów obowiązkowych, szablony klauzul:
> → OBOWIĄZKOWO wczytaj: view references/mod-shared-rodo.md

---

## J6.1 PODSTAWY PRAWNE

```
Weryfikuj aktualne brzmienie:
  Prawo autorskie: isap.sejm.gov.pl → ustawa z 4.02.1994 o prawie autorskim
    → art. 1 (co jest utworem IT), art. 41–65 (prawa majątkowe, pola eksploatacji)
    → art. 53 (forma pisemna przeniesienia praw), art. 67 ust. 5 (forma pisemna licencji wyłącznej)
    → art. 74–77² (szczególna ochrona programów komputerowych)
  KC: art. 627–646 (umowa o dzieło — software development)
      art. 734–751 (umowa zlecenia — wsparcie, maintenance)
  Ustawa o zwalczaniu nieuczciwej konkurencji: isap.sejm.gov.pl → aktualny tekst ujednolicony
    → art. 11 (tajemnica przedsiębiorstwa)
```

---

## J6.2 UMOWY SOFTWARE DEVELOPMENT — PUŁAPKI

### SD-1 — Własność IP: brak przeniesienia praw lub wadliwe brzmienie (CRITICAL)

```
PRAWO (art. 41 ust. 2 PrAut — weryfikuj w ISAP):
  Umowa o przeniesienie praw autorskich lub licencja obejmuje tylko pola eksploatacji
  wyraźnie w niej wymienione. Brak pola = brak skutecznego nabycia/licencji w tym zakresie;
  dodatkowo przeniesienie praw wymaga formy pisemnej pod rygorem nieważności (art. 53 PrAut),
  a licencja wyłączna wymaga formy pisemnej pod rygorem nieważności (art. 67 ust. 5 PrAut).

POLA EKSPLOATACJI (art. 50 PrAut) — lista musi być kompletna:
  □ Utrwalanie i zwielokrotnianie (wytwarzanie egzemplarzy)
  □ Obrót oryginałem lub egzemplarzami (sprzedaż, najem)
  □ Rozpowszechnianie w inny sposób (publiczne udostępnienie, internet)
  □ Modyfikacja i tworzenie dzieł pochodnych
  □ Utrwalanie, zwielokrotnianie, tłumaczenie, przystosowanie i rozpowszechnianie programu — formułuj zgodnie z art. 74 PrAut
  UWAGA: dekompilacja i kopie zapasowe to szczególne uprawnienia/ograniczenia z art. 75 PrAut, nie klasyczne „pole eksploatacji”.
  
  DLA OPROGRAMOWANIA (dodaj koniecznie):
  □ Instalacja i uruchomienie na określonej liczbie stanowisk/serwerów
  □ Tworzenie kopii zapasowych (art. 75 ust. 1 PrAut)
  □ Dostosowanie do potrzeb Zamawiającego (modyfikacja)
  □ Sublicencjonowanie podmiotom powiązanym (jeśli potrzebne)
  □ Udostępnienie jako usługa (SaaS) — osobne pole!
  □ Dalsze zlecanie development (podwykonawcy)

PUŁAPKA SD-1a — "wszelkie prawa autorskie":
  PROBLEM: "Wykonawca przenosi wszelkie autorskie prawa majątkowe do Oprogramowania."
  → Zbyt ogólne = sporna ważność bez wskazania pól
  → Nie obejmuje oprogramowania preistniejącego (tools, frameworks)
  REKOMENDACJA: wylistuj pola + wyłącz biblioteki preistniejące

PUŁAPKA SD-1b — brak wynagrodzenia za przeniesienie praw (MEDIUM):
  PRAWO (art. 43 PrAut): jeśli umowa nie określa wynagrodzenia za przeniesienie,
  twórcy należy się "wynagrodzenie odpowiednie" do zakresu przekazanych praw.
  → Ryzyko: twórca może dochodzić dodatkowego wynagrodzenia
  REKOMENDACJA: "Wynagrodzenie za przeniesienie praw autorskich zawarte jest
  w łącznym wynagrodzeniu określonym w §[X]."

PUŁAPKA SD-1c — prawa do "przyszłych" niezdefiniowanych utworów (HIGH):
  PRAWO (art. 41 ust. 3 PrAut):
  Nieważna jest umowa dotycząca "wszystkich przyszłych utworów" bez ich określenia.
  → UMOWA RAMOWA: można wskazać typ przyszłych utworów ("oprogramowanie tworzone
    na zlecenie Zamawiającego w ramach niniejszej Umowy") — to dozwolone.
  → ZAKAZ: "wszystkie przyszłe dzieła twórcy bez ograniczeń" — nieważne.
```

### SD-2 — Odbiór oprogramowania — kryteria "gotowości" (HIGH RISK)

```
PUŁAPKA SD-2a — Brak obiektywnych kryteriów odbioru:
  PROBLEM: "Oprogramowanie zostanie odebrane po akceptacji przez Zamawiającego"
  → Brak obiektywnych kryteriów = Zamawiający może odmawiać odbioru w nieskończoność
  → Wykonawca nie dostaje wynagrodzenia, bo "nie odebrano"

REKOMENDACJA — DEFINICJA ODBIORU:
  "§X. Odbiór Oprogramowania nastąpi po pozytywnym przejściu testów akceptacyjnych.
   Testy akceptacyjne opierają się na kryteriach zdefiniowanych w Specyfikacji
   Funkcjonalnej (Załącznik nr [Y]).
   Kryteria odbioru: brak błędów Priorytetu 1 (Blokujących), mniej niż [X] błędów
   Priorytetu 2 (Krytycznych), nie więcej niż [Y]% przypadków testowych zakończonych
   niepowodzeniem, performance zgodny z §[Z] (czas odpowiedzi ≤[X]ms dla [Y]% żądań)."

PUŁAPKA SD-2b — Brak procedury przy spornym odbiorze:
  PROBLEM: "Strony uzgodnią rozbieżności."
  → Wykonawca twierdzi że gotowe; Zamawiający że nie
  → Impas blokuje płatność w nieskończoność

REKOMENDACJA — PROCEDURA SPORNEGO ODBIORU:
  "§X. Jeżeli Zamawiający odmawia odbioru, obowiązany jest wskazać w protokole
   konkretne braki lub błędy. Wykonawca ma [X] dni roboczych na ich usunięcie.
   Jeżeli Strony nie dojdą do porozumienia po dwóch rundach poprawek, każda
   ze Stron może powołać niezależnego rzeczoznawcę (eksperta IT), którego ocena
   jest wiążąca dla obu Stron. Koszty rzeczoznawcy ponosi strona, której stanowisko
   było nieuzasadnione."
```

### SD-3 — Change request / Zmiana zakresu (HIGH RISK dla Wykonawcy)

```
PUŁAPKA SD-3 — Brak procedury change request:
  PROBLEM: Zamawiający w trakcie projektu rozszerza zakres ("skoro już robisz,
  dodaj też X, Y, Z") → Wykonawca albo odmawia (napięcie) albo robi za darmo.
  → W IT: typowy "scope creep" — jedna z głównych przyczyn nierentownych projektów

PROCEDURA CHANGE REQUEST (wymagana w każdej umowie IT >3 miesięcy):
  "§X. ZARZĄDZANIE ZMIANĄ ZAKRESU (Change Request)
  1. Każda zmiana zakresu Oprogramowania względem Specyfikacji wymaga złożenia
     pisemnego Change Request (CR) przez Zamawiającego.
  2. Wykonawca ma [5] dni roboczych na analizę wpływu CR na:
     (a) harmonogram — o ile dni opóźni projekt,
     (b) wynagrodzenie — dodatkowy koszt realizacji,
     (c) ryzyko — czy CR nie narusza wcześniej ukończonych modułów.
  3. Zamawiający akceptuje lub odrzuca wycenę CR w terminie [3] dni roboczych.
  4. CR niezaakceptowany = nie jest realizowany.
  5. CR bez zachowania procedury pisemnej nie jest wiążący dla Wykonawcy.
  6. Każdy zaakceptowany CR skutkuje automatycznym wydłużeniem harmonogramu
     o czas wskazany w wycenie + [X]% buforu."
```

### SD-4 — Escrow kodu źródłowego (MEDIUM/HIGH zależnie od krytyczności)

```
KONTEKST: Gdy oprogramowanie jest krytyczne dla działania biznesu Zamawiającego,
  a Wykonawca może zniknąć (bankructwo, sprzedaż firmy, key person risk).

ESCROW — CO TO JEST:
  Depozyt kodu źródłowego u niezależnego podmiotu (escrow agent).
  Zamawiający dostaje dostęp do kodu gdy spełni się "trigger" (zdarzenie wyzwalające).

KLAUZULA ESCROW:
  "§X. ESCROW KODU ŹRÓDŁOWEGO
  1. W terminie [30] dni od odbioru Oprogramowania Wykonawca umieszcza pełny
     kod źródłowy, dokumentację techniczną i instrukcję budowania w depozycie
     escrow prowadzonym przez [podmiot escrow, np. NCC Group, EscrowTech].
  2. Depozyt jest aktualizowany przy każdym nowym release, nie rzadziej niż co [3] miesiące.
  3. Zamawiający ma prawo dostępu do depozytu w przypadku:
     (a) ogłoszenia upadłości Wykonawcy,
     (b) zaprzestania przez Wykonawcę świadczenia maintenance przez >90 dni,
     (c) rozwiązania Umowy z przyczyn leżących po stronie Wykonawcy,
     (d) innych zdarzeń wskazanych w Umowie Escrow.
  4. Koszty prowadzenia depozytu ponosi [Zamawiający / dzielone po 50%].
  5. Prawa do kodu uzyskane przez Zamawiającego z depozytu ograniczone są
     do utrzymania i modyfikacji Oprogramowania na własne potrzeby."
```

---

## J6.3 UMOWY SaaS — PUŁAPKI

### SaaS-1 — Definicja dostępności i SLA (CRITICAL)

```
PUŁAPKA SaaS-1a — Dostępność "99,9%" bez jednoznacznej definicji:
  99,9% rocznie = 8,76 h niedostępności/rok (87,6 min/miesiąc)
  99,9% z wyłączeniem maintenance 8h/mies. = 95,6h potencjalnej niedostępności/rok
  → To może być 12 razy więcej niż klient myśli!

DEFINICJA DOSTĘPNOŚCI — rekomendowane brzmienie:
  "'Dostępność' oznacza możliwość połączenia z Systemem i uzyskania odpowiedzi
   na żądanie HTTP przez niezależne narzędzie monitorujące (URL: [adres])
   w czasie nie dłuższym niż [3000] ms.
   
   'Niedostępność' to każdy okres, gdy Dostępność nie jest zapewniona,
   z wyłączeniem Planowanych Przerw Serwisowych (max [4]h/miesiąc, w godzinach
   [02:00–06:00] CET, z [72]-godzinnym wyprzedzeniem).
   Przerwy niezapowiedziane zawsze wliczają się do czasu Niedostępności.
   
   SLA obliczane jest jako: [(czas okresu rozliczeniowego - czas Niedostępności)
   / czas okresu rozliczeniowego] × 100%"

PROGI SLA I KARY — standard rynkowy:
  99,9–100%: brak kredytu
  99,0–99,9%: 10% miesięcznej opłaty jako Service Credit
  95,0–99,0%: 25% miesięcznej opłaty
  <95,0%: 50% miesięcznej opłaty + prawo rozwiązania
  
  PUŁAPKA: "Service Credit" jako wyłączne odszkodowanie
  → Klient może mieć realną stratę 100× większą niż kredyt SLA
  REKOMENDACJA: "Service Credit nie wyłącza prawa do odszkodowania za szkodę."
```

### SaaS-2 — Dane klienta i vendor lock-in (HIGH RISK)

```
PUŁAPKA SaaS-2a — Brak klauzuli przeniesienia danych (data portability):
  PROBLEM: Klient chce zmienić dostawcę SaaS → jego dane "więzione" w systemie
  → Eksport w niestandardowym formacie → praktycznie niemożliwy import do innego systemu
  
REKOMENDACJA:
  "§X. Usługodawca zapewnia Klientowi możliwość eksportu wszystkich danych
   w standardowym formacie ([CSV/JSON/XML/SQL]) na żądanie Klienta, w terminie
   [10] dni roboczych. Eksport dostępny przez cały czas trwania Umowy i przez
   [90] dni po jej zakończeniu. Dane przechowywane przez Usługodawcę po tym
   terminie zostają trwale usunięte (potwierdzenie na piśmie)."

PUŁAPKA SaaS-2b — Dane klienta po zakończeniu umowy:
  PRAWO (art. 28 RODO): procesor musi usunąć lub zwrócić dane po zakończeniu przetwarzania
  → Wczytaj: mod-shared-rodo.md → sekcja RO.4 (Pułapka RO-4)
  
PUŁAPKA SaaS-2c — Zmiany funkcjonalności bez zgody:
  PROBLEM: "Usługodawca ma prawo modyfikować funkcjonalność Platformy."
  → Usunięcie kluczowej funkcji bez odszkodowania
  REKOMENDACJA: Zmiany istotne (usunięcie funkcji z SOW) wymagają [90]-dniowego
  powiadomienia + możliwości rozwiązania bez kary.
```

### SaaS-3 — Umowy chmurowe i sub-procesory (MEDIUM RISK)

```
PUŁAPKA SaaS-3 — SaaS na AWS/Azure/GCP bez klauzuli:
  TYPOWA SYTUACJA: Dostawca SaaS hostuje na Amazon AWS
  → AWS przetwarza dane klientów Zamawiającego
  → AWS jest sub-procesorem (podprocesorem RODO)
  → Wymagana: (a) ujawnienie AWS jako podprocesora, (b) standardowe klauzule (SCC)
    jeśli AWS obsługuje dane z serwera w USA
  → Weryfikuj: gdzie fizycznie są serwery? (region EU = mniejsze ryzyko)
  
LISTA KONTROLNA CHMURY:
  □ Gdzie fizycznie przechowywane dane (kraj / region UE)?
  □ Lista zatwierdzonych podprocesora podana w Załączniku?
  □ Klauzule SCC (Standard Contractual Clauses) dla transferu poza EOG?
  □ Certyfikaty bezpieczeństwa dostawcy chmury (ISO 27001, SOC 2)?
  □ Prawo do audytu (lub certyfikat jako substytut audytu)?
```

---

## J6.4 UMOWY AGILE — SPECYFIKA

```
PROBLEM Z AGILE I PRAWEM: Klasyczne umowy o dzieło (KC art. 627) zakładają
  precyzyjne dzieło w momencie zawarcia umowy. Agile = brak gotowej specyfikacji.
  → Napięcie: KC wymaga oznaczonego dzieła, agile go nie ma

ROZWIĄZANIA PRAWNE:

OPCJA A — Umowa o dzieło z modularną specyfikacją:
  "Umowa o dzieło (art. 627 KC) na stworzenie Oprogramowania w rozumieniu
   Przyrostów (Increments) definiowanych przez Zamawiającego w kolejnych
   Sprintach. Product Backlog stanowi orientacyjny opis zakresu; szczegółowy
   zakres każdego Sprintu (Sprint Backlog) ustalany jest w Sprint Planning."
  → Każdy Sprint = oddzielne dzieło → osobny odbiór i płatność
  → Sprint nieprzyjęty bez wskazania konkretnych braków → nie przysługuje odmowa

OPCJA B — Umowa o świadczenie usług (KC art. 750 → zlecenie):
  "Wykonawca świadczy usługi development (time & material) w wymiarze [X]h
   tygodniowo za stawkę [Y] PLN/h netto."
  → Zamawiający płaci za czas, nie wynik
  → Elastyczny zakres
  → RYZYKO dla Zamawiającego: płaci nawet za czas niskiej produktywności

ELEMENTY OBOWIĄZKOWE UMOWY AGILE:
  □ Definition of Done (DoD) — kiedy Sprint / Increment jest "ukończony"
  □ Procedura Sprint Review / odbioru każdego sprintu
  □ Procedura Change Request (SD-3 stosuje się!)
  □ Własność IP do częściowo ukończonego kodu (ważne przy rozwiązaniu)
  □ Co się dzieje gdy sprint nie spełnia DoD (kto płaci za poprawki?)
  □ Prawo wglądu Zamawiającego w code repository (GitHub/GitLab)
```

---

## J6.5 MAINTENANCE & SUPPORT — PUŁAPKI

```
PUŁAPKA MS-1 — Brak definicji priorytetów błędów:
  Standard branżowy — wymagaj w umowie:
  P1 Krytyczny: system niedostępny lub utrata danych → SLA: [4h] reakcja, [8h] fix
  P2 Wysoki: kluczowa funkcja niedostępna → SLA: [8h] reakcja, [3 dni robocze] fix
  P3 Średni: funkcja ograniczona, workaround dostępny → [2 dni] reakcja, [10 dni] fix
  P4 Niski: kosmetyczny, brak impact biznesowy → [5 dni] reakcja, [next release] fix

PUŁAPKA MS-2 — Brak definicji "wady" vs "nowej funkcjonalności":
  PROBLEM: Klient zgłasza "błąd"; vendor mówi "to nowa funkcja do wyceny"
  REKOMENDACJA:
  "Wadą jest zachowanie Oprogramowania niezgodne ze Specyfikacją Funkcjonalną
   lub z zachowaniem opisanym w dokumentacji. Wszelkie zachowania w Specyfikacji
   nieujęte traktowane są jako zakres potencjalnych zmian (Change Request, §[X])."

PUŁAPKA MS-3 — End of Life (EOL) oprogramowania:
  REKOMENDACJA: Dodaj klauzulę:
  "Usługodawca zobowiązuje się do utrzymania wsparcia bezpieczeństwa (security patches)
   przez co najmniej [3] lata od daty odbioru. O planowanym zaprzestaniu wsparcia
   Usługodawca powiadomi Zamawiającego z [12]-miesięcznym wyprzedzeniem,
   oferując ścieżkę migracji do obsługiwanej wersji."
```

---

## J6.6 KONSORCJUM IT — PUŁAPKI (rozbudowanie)

```
KJ-1 — Solidarna odpowiedzialność bez limitów wewnętrznych (CRITICAL):
  PROBLEM: Zamawiający może żądać 100% wykonania od każdego członka konsorcjum.
  Lider odpowiada za błędy Partnera bez prawa automatycznego regresu.
  RYZYKO: Lider płaci odszkodowanie za cudzy błąd, traci płynność.
  
  REKOMENDACJA — klauzula w umowie wewnętrznej konsorcjum:
  "§X. Odpowiedzialność finansowa Stron wobec siebie jest ograniczona do zakresu
   własnych Zadań określonych w Załączniku nr 1. Strona, która poniosła koszt
   wynikający z winy drugiej Strony, ma prawo regresu w terminie 30 dni od daty
   zapłaty. Roszczenie regresowe jest potwierdzone fakturą lub notą obciążeniową."

  PODZIAŁ ZADAŃ W UMOWIE WEWNĘTRZNEJ KONSORCJUM:
  □ Zakres Lidera: [lista modułów/usług]
  □ Zakres Partnera: [lista modułów/usług]
  □ Odpowiedzialność: każdy odpowiada finansowo za swój zakres
  □ Regres: w razie zapłaty za błąd Partnera → Lider ma regres w [30] dni
  □ Procedura przy bankructwie partnera: Lider przejmuje zakres lub
    ma prawo rozwiązania Umowy z Zamawiającym z [30]-dniowym terminem
  □ Wspólne PI (indemnification): zasady podziału kosztów obrony sądowej

KJ-2 — Własność IP wytworzona przez konsorcjum:
  PROBLEM: Kto jest właścicielem kodu napisanego przez obu członków konsorcjum?
  REKOMENDACJA:
  "§X. Wszelkie prawa do Oprogramowania stworzonego przez Konsorcjum przechodzą
   na Zamawiającego na warunkach §[Y]. W relacjach wewnętrznych Konsorcjum,
   każdy Partner zachowuje prawa do preistniejącego IP wniesionych przez siebie
   narzędzi i bibliotek."
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Podstawa prawna: Prawo Autorskie — isap.sejm.gov.pl → t.j. Dz.U. 2025 poz. 24 (obwieszczenie 06.12.2024)*
*KC art. 627–646 (o dzieło), art. 750 (usługi) · RODO art. 28 (DPA)*
*Powiązane: mod-shared-rodo.md (DPA obowiązkowe dla SaaS/cloud)*

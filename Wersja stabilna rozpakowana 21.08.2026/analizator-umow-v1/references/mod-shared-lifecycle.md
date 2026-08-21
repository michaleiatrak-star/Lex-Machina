# MODUŁ SHARED-LIFECYCLE — ZARZĄDZANIE CYKLEM ŻYCIA UMOWY
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** umowa długoterminowa (>12 miesięcy); użytkownik pyta
> o terminy po podpisaniu, procedurę aneksowania, zarządzanie naruszeniami,
> rozwiązanie umowy i rozliczenie końcowe. Szczególnie: SLA, umowy deweloperskie,
> franczyza, najem, umowy dystrybucyjne, B2B wieloletnie.

> ⛔ HARD GATE — terminy wypowiedzenia, okresy gwarancji weryfikuj w ISAP.

---

## LC.1 KALENDARZ KLUCZOWYCH TERMINÓW

Po analizie umowy — ekstrakcja terminów wymagających monitoringu:

```
EKSTRAKCJA OBLIGATORYJNA — sprawdź każdą umowę pod kątem:

□ DATY KLUCZOWE:
  [ ] Data wejścia w życie / data podpisania
  [ ] Data rozpoczęcia świadczenia (może być inna niż podpisanie)
  [ ] Data zakończenia / wygaśnięcia
  [ ] Termin obowiązkowego przeglądu / renegocjacji (jeśli jest)

□ TERMINY OPCJI I ODNOWIEŃ:
  [ ] Termin na złożenie opcji przedłużenia (np. "30 dni przed końcem")
    → ALERT: opcja wygasa jeśli nie złożona w terminie
  [ ] Termin na odmowę automatycznego odnowienia ("evergreen clause")
    → PUŁAPKA: brak odmowy = automatyczne przedłużenie o kolejny rok
  [ ] Data przeglądu cenowego / indeksacji

□ TERMINY WYPOWIEDZENIA:
  [ ] Okres wypowiedzenia (z jakiego dnia liczony)
  [ ] Warunki wypowiedzenia z ważnych przyczyn (bez okresu)
  [ ] Termin na przesłanie wypowiedzenia (forma: pisemna / e-mail / list polecony?)

□ TERMINY FINANSOWE:
  [ ] Terminy płatności (cykliczne / jednorazowe)
  [ ] Data naliczenia kar / odsetek
  [ ] Terminy rozliczeń końcowych
  [ ] Data rewizji cen / indeksacji

□ TERMINY JAKOŚCIOWE I ODBIORU:
  [ ] Termin zgłoszenia wad przy odbiorze
  [ ] Okres rękojmi / gwarancji (od kiedy liczony)
  [ ] Termin usunięcia wad zgłoszonych w odbiorze
  [ ] Termin cure period przy naruszeniu

FORMAT KALENDARZA:
  Data          | Zdarzenie                    | Strona         | Priorytet
  [RRRR-MM-DD]  | Opcja przedłużenia — złożyć  | [Klient]       | ⚠ WYSOKI
  [RRRR-MM-DD]  | Przegląd cen (klauzula §X)   | [Obie]         | ℹ INFO
  [RRRR-MM-DD]  | Koniec umowy / odnowienie    | [Monitorować]  | ⚠ WYSOKI
```

---

## LC.2 ANEKSOWANIE — PROCEDURA I PUŁAPKI

```
KIEDY WYMAGANY ANEKS:
  □ Zmiana przedmiotu umowy lub zakresu świadczenia
  □ Zmiana wynagrodzenia lub metody jego wyliczenia
  □ Zmiana terminu (przedłużenie, skrócenie)
  □ Zmiana danych stron (adres, nr konta, osoba kontaktowa)
  □ Zmiana prawa właściwego lub sądu właściwości
  □ Każda zmiana klauzuli, która w oryginalnej umowie ma rygor nieważności

FORMA ANEKSU — weryfikuj co mówi umowa główna:
  □ Umowa wymaga formy pisemnej pod rygorem nieważności dla zmian
    → Aneks musi być podpisany; e-mail jest niewystarczający
  □ Umowa wymaga formy pisemnej bez rygoru
    → E-mail może być dowodem, ale ryzyko sporu o skuteczność
  □ Umowa milczy → zastosuj formę umowy głównej (ostrożność)

ZASADA LEX POSTERIOR W ANEKSACH:
  Aneks ma pierwszeństwo przed umową główną w zakresie zmienionym.
  Klauzule umowy głównej nie zmienione aneksem — obowiązują nadal.
  Przy sprzeczności: zawsze wskazuj wprost "§X umowy głównej otrzymuje
  brzmienie: [nowe brzmienie]"

PUŁAPKA: Aneks bez klauzuli integralności
  PROBLEM: Strony podpisują kilka aneksów bez numeracji i chronologii
  → Spór który aneks jest ostatni / który obowiązuje
  REKOMENDACJA: każdy aneks numeruj (Aneks nr 1, nr 2...) i wskazuj
  "Niniejszy Aneks zastępuje Aneks nr [poprzedni] w zakresie §[X]."

SZABLON ANEKSU:
  "ANEKS NR [X] DO UMOWY [NAZWA] Z DNIA [DATA]
  
  zawarty w dniu [data] pomiędzy [Strona A] a [Strona B],
  
  §1. Zmiany do Umowy
  1. §[X] Umowy otrzymuje nowe brzmienie: [nowy tekst]
  2. Do §[Y] Umowy dodaje się ust. [Z] w brzmieniu: [nowy tekst]
  3. §[Z] Umowy skreśla się.
  
  §2. Postanowienia końcowe
  1. Aneks wchodzi w życie z dniem [podpisania / [data]].
  2. W pozostałym zakresie Umowa pozostaje bez zmian.
  3. Aneks sporządzono w dwóch jednobrzmiących egzemplarzach."
```

---

## LC.3 ZARZĄDZANIE NARUSZENIAMI UMOWY

```
SEKWENCJA POSTĘPOWANIA PRZY NARUSZENIU:

ETAP 1 — IDENTYFIKACJA I DOKUMENTACJA:
  □ Zidentyfikuj klauzulę naruszoną
  □ Oceń typ naruszenia: istotne / nieistotne / trwałe / jednorazowe
  □ Udokumentuj: data, dowody (maile, zdjęcia, protokoły), kwota szkody
  □ Sprawdź: czy istnieje cure period (czas na naprawę naruszenia)?

ETAP 2 — NOTICE OF BREACH (wezwanie do naprawy):
  Forma: ZAWSZE pisemna (e-mail z potwierdzeniem odbioru lub list polecony)
  Treść wezwania:
    □ Wskazanie naruszenia (konkretna klauzula + opis faktyczny)
    □ Żądanie: zaprzestania naruszenia / naprawienia wady / zapłaty
    □ Termin na naprawę (cure period): standardowo 7–30 dni
    □ Skutki braku naprawy w terminie (rozwiązanie, kary, odszkodowanie)
  
  Dlaczego pisemnie?
    → Dowód wysłania wezwania (warunek dochodzenia kary umownej)
    → Przerywa termin przedawnienia (art. 123 KC)
    → Podstawa do wypowiedzenia z ważnych przyczyn

ETAP 3 — CURE PERIOD:
  □ Czy umowa przewiduje cure period? Jeśli tak — ile dni?
  □ Upływ cure period bez naprawy → przejdź do Etapu 4
  □ Dokumentuj brak naprawy (kolejne e-maile, protokoły, zdjęcia)

ETAP 4 — ESKALACJA:
  ŚCIEŻKA A: Kara umowna
    □ Ustal czy kara jest naliczana automatycznie czy wymaga odrębnego wezwania
    □ Oblicz karę (wg Modułu SHARED-RYZYKO)
    □ Wystaw notę obciążeniową / wezwanie do zapłaty kary
  
  ŚCIEŻKA B: Odszkodowanie (gdy brak kary lub szkoda > kara)
    □ KC art. 484 §1: "W razie niewykonania lub nienależytego wykonania
       zobowiązania kara umowna należy się wierzycielowi"
    □ KC art. 484 §1 zd. 2: odszkodowanie ponad karę — TYLKO gdy umowa
       to przewiduje lub gdy brak klauzuli (wtedy pełne odszkodowanie)
    Weryfikuj: isap.sejm.gov.pl → KC → art. 484
  
  ŚCIEŻKA C: Rozwiązanie umowy
    □ Czy naruszenie jest wystarczająco istotne by uzasadniać rozwiązanie?
    □ Czy umowa przewiduje prawo rozwiązania przy tym typie naruszenia?
    □ Forma: pisemne oświadczenie o rozwiązaniu + wskazanie podstawy
    □ Zachowaj dowody na potwierdzenie doręczenia

ETAP 5 — ROZLICZENIE PO ROZWIĄZANIU:
  □ Co zostało już wykonane (wartość na dzień rozwiązania)?
  □ Rozliczenie zaliczek i zadatków
  □ Zwrot materiałów / licencji / dostępów / dokumentów
  □ Certyfikat wykonania (jeśli umowa przewiduje)
  □ Końcowe rozliczenie kar + odszkodowanie
```

---

## LC.4 ROZWIĄZANIE UMOWY — PROCEDURA ZAMKNIĘCIA

```
CHECKLIST ROZWIĄZANIA UMOWY:

□ FORMA ROZWIĄZANIA: weryfikuj co wymagała umowa
  [ ] Pisemna pod rygorem nieważności
  [ ] Pisemna (zalecana)
  [ ] Porozumienie stron (każdy tryb)

□ PODSTAWA PRAWNA:
  [ ] Wypowiedzenie z zachowaniem okresu (umowa na czas nieokreślony)
  [ ] Wypowiedzenie z ważnych przyczyn (bez okresu, umowa na czas określony)
  [ ] Porozumienie stron (natychmiastowe, każdy czas)
  [ ] Odstąpienie (gdy przewidziane w umowie lub art. 491–493 KC)
  Weryfikuj: isap.sejm.gov.pl → KC → art. 491 (zwłoka, odstąpienie)

□ OBOWIĄZKI POST-CONTRACTUAL (przeżywające rozwiązanie):
  [ ] Poufność: do kiedy trwa po rozwiązaniu?
  [ ] Zakaz konkurencji: od kiedy liczony? (od rozwiązania czy od zakończenia faktycznego)
  [ ] Własność intelektualna: co dzieje się z licencjami / prawami autorskimi?
  [ ] Dane osobowe: DPA — obowiązek usunięcia (termin? potwierdzenie?)
  [ ] Gwarancja / rękojmia: czy dalej obowiązuje po rozwiązaniu?
  [ ] Jurysdykcja: klauzula sądu właściwości przeżywa rozwiązanie

□ ROZLICZENIE FINANSOWE:
  [ ] Faktury wystawione a niezapłacone → termin płatności i sposób
  [ ] Zaliczki i zadatki → zwrot lub zaliczenie
  [ ] Kary naliczone → potrącenie lub osobne wezwanie
  [ ] Koszty demontażu / usunięcia / przywrócenia stanu
  [ ] Prowizja za okres po rozwiązaniu (umowy agencyjne — art. 764² KC)

□ ZWROT I TRANSFER:
  [ ] Dokumenty i materiały Administratora → termin i protokół przekazania
  [ ] Dostępy (systemy, platformy, konta) → dezaktywacja
  [ ] Własność i wyposażenie → protokół odbioru
  [ ] Know-how i informacje poufne → potwierdzenie zniszczenia
  [ ] Prawa autorskie / licencje → cesja lub wygaśnięcie

PROTOKÓŁ ZAKOŃCZENIA UMOWY (rekomendowany):
  Jeśli umowa trwała > 6 miesięcy lub wartość > 50 000 PLN:
  □ Sporządź pisemny protokół zakończenia potwierdzający:
    - datę zakończenia
    - stan rozliczeń
    - brak wzajemnych roszczeń (lub listę roszczeń zachowanych)
    - zwrot dokumentów/dostępów (lista)
    - obowiązki dalej obowiązujące (poufność, zakaz konkurencji)
```

---

## LC.5 INDEKSACJA I KLAUZULE WALORYZACYJNE

```
W umowach wieloletnich (>2 lata lub >12 miesięcy o podwyższonym ryzyku inflacji):

KLAUZULA WALORYZACYJNA:
  Podstawa: KC art. 358¹ — weryfikuj: isap.sejm.gov.pl → KC → art. 358¹
  
  TYPY:
  □ Indeksacja do wskaźnika (GUS, NBP):
    "Wynagrodzenie podlega corocznemu zwiększeniu o [X%] lub o wskaźnik
     GUS inflacji CPI za poprzedni rok, w zależności co jest wyższe."
    web_search "wskaźnik inflacji GUS CPI [rok bieżący]" — zawsze aktualizuj
  
  □ Klauzula eskalacyjna (po wzroście kosztów):
    "W przypadku wzrostu kosztów surowców / energii / pracy o więcej niż [15%]
     w stosunku do dnia zawarcia Umowy, Strony przeprowadzą negocjacje warunków
     finansowych w terminie [30] dni."
  
  □ Stała cena (brak klauzuli):
    RYZYKO: przy inflacji lub wzroście kosztów wykonawca traci
    REKOMENDACJA: zawsze wpisuj klauzulę waloryzacyjną przy umowach >1 rok

  PUŁAPKA: Klauzula jednostronna
    PROBLEM: "Wynagrodzenie wzrośnie automatycznie o X% rocznie."
    → Wzrost bez możliwości negocjacji = potencjalna klauzula abuzywna (B2C)
    REKOMENDACJA: "Strony mogą uzgodnić inny wskaźnik. Brak uzgodnienia = CPI GUS."
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Podstawa prawna: KC art. 123, 391, 471, 484, 491–493, 358¹ — weryfikuj: isap.sejm.gov.pl*
*Powiązane: mod-shared-ryzyko-kwant.md (kwantyfikacja kar), mod-shared-fm-hardship.md*

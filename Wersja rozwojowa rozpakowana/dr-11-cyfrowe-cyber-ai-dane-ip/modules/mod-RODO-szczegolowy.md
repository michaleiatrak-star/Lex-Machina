# RODO i Ochrona Danych Osobowych — Szczegółowy Framework

## ZASADY ABSOLUTNE — SPRAWDŹ JAKO PIERWSZE
```
1. Organ nadzorczy w Polsce = Prezes UODO (nie sąd w pierwszym kroku)
2. 72h na zgłoszenie naruszenia do UODO (art. 33 RODO) — termin od wykrycia
3. Skarga do UODO → decyzja adm. → skarga do WSA (NIE do SO!)
4. Pozew cywilny (art. 82 RODO) niezależny od skargi do UODO — można łączyć
5. Zakaz cytowania przepisów z pamięci — weryfikuj w EUR-LEX i isap.sejm.gov.pl
```

## FAZA 0 — INTAKE
```
□ Kto jest administratorem danych? (firma / organ publiczny / osoba fizyczna)
□ Jakie dane i w jakim celu są przetwarzane?
□ Co konkretnie naruszono?
  → brak zgody / bezprawne udostępnienie / odmowa usunięcia / wyciek / monitoring
□ Czy jest podmiot przetwarzający (procesor) — np. firma IT, call center?
□ Czy dotyczy pracownika (monitoring) czy klienta / osoby trzeciej?
□ Jakiego efektu oczekuje klient?
  → usunięcie danych / odszkodowanie / decyzja UODO / zaprzestanie przetwarzania
□ Termin na zgłoszenie naruszenia: czy 72h już upłynęło?
```

## MAPA POSTĘPOWAŃ
```
A. SKARGA DO PREZESA UODO
   ↓ bezpłatna; pisemna lub przez ePUAP; brak terminu (tylko przedawnienie)
   Prezes UODO — decyzja administracyjna
   ↓ [30 dni] skarga do WSA
   WSA → NSA (kasacja)

B. POZEW CYWILNY O ODSZKODOWANIE (art. 82 RODO)
   ↓ SR: do 100 000 zł / SO: powyżej 100 000 zł (art. 17 pkt 4 KPC — zm. od 01.07.2023)
   Niezależny od postępowania A — można prowadzić równolegle
   Ciężar dowodu: na administratorze (art. 82 ust. 3 RODO — egzoneracja)

C. OBA JEDNOCZEŚNIE (A + B)
   → Dozwolone; różne tryby, różne organy
   → Wynik w UODO nie wiąże sądu cywilnego, ale ma walor dowodowy
```

## PODSTAWY PRZETWARZANIA (art. 6 RODO) — QUICK CHECK
| Podstawa | Kiedy dopuszczalna | Ryzyko |
|---|---|---|
| Zgoda (art. 6 ust. 1 lit. a) | Dobrowolna, konkretna, świadoma, wycofalna | Cofnięcie = obowiązek usunięcia |
| Umowa (lit. b) | Niezbędność do wykonania umowy | Zakres musi być proporcjonalny |
| Obowiązek prawny (lit. c) | Przepis prawa nakazuje | Musi istnieć konkretna norma |
| Żywotne interesy (lit. d) | Stan zagrożenia życia | Wąskie zastosowanie |
| Interes publiczny (lit. e) | Zadania organu publicznego | Nie dotyczy podmiotów prywatnych |
| Uzasadniony interes (lit. f) | Ważenie interesów | Niedopuszczalne dla organów pub. wobec obyw. |

⚠️ Dane szczególne (art. 9 RODO — zdrowie, orientacja seksualna, poglądy) wymagają podstawy z art. 9 ust. 2 + podstawy z art. 6 łącznie.

## PRAWA OSÓB — KATALOG I TERMINY (weryfikuj przed każdym pismem)
| Prawo | Podstawa | Termin odpowiedzi | Wyjątki |
|---|---|---|---|
| Dostęp do danych | art. 15 | 1 miesiąc (przedł. do 3 m.) | — |
| Sprostowanie | art. 16 | 1 miesiąc | — |
| Usunięcie (bycie zapomnianym) | art. 17 | 1 miesiąc | obowiązek prawny, roszczenia, interes publiczny |
| Ograniczenie przetwarzania | art. 18 | 1 miesiąc | — |
| Przenoszalność | art. 20 | 1 miesiąc | Tylko: zgoda lub umowa + autom. przetwarzanie |
| Sprzeciw | art. 21 | Niezwłocznie | Prawnie uzasadnione nadrzędne interesy |

## NARUSZENIE OCHRONY DANYCH — PROCEDURA

> Rozszerzono: 2026-07-05 (AUDYT-2026-07-05a), wzorzec rodo-naruszenie-72h-pl:
> deterministyczny zegar 72h, typologia naruszenia, zgłoszenie etapowe, wyjątki art. 34 ust. 3.

```
KROK 0 — ZEGAR (deterministycznie, nie "w pamięci"):
  → Start biegu: moment STWIERDZENIA naruszenia przez administratora
    (nie moment zdarzenia!). Zanotuj datę i GODZINĘ stwierdzenia.
  → deadline_72h = stwierdzenie + 72 godziny (liczone godzinowo, ISO z godziną)
  → Po terminie → zgłoszenie NADAL obowiązkowe + wyjaśnienie przyczyn
    opóźnienia (art. 33 ust. 1 zd. 2)
  → Procesor stwierdza naruszenie → zawiadamia administratora BEZ ZBĘDNEJ
    ZWŁOKI (art. 33 ust. 2) — zegar administratora startuje od jego stwierdzenia

KROK 1 — Kwalifikacja i ocena ryzyka
  → Czy to naruszenie (art. 4 pkt 12)? Typ: POUFNOŚĆ (ujawnienie/dostęp) /
    INTEGRALNOŚĆ (modyfikacja) / DOSTĘPNOŚĆ (utrata/zniszczenie) — często łącznie
  → Ocena ryzyka dla praw i wolności (czynniki wg wytycznych EROD 9/2022):
    charakter/wrażliwość/wolumen danych, łatwość identyfikacji, waga skutków,
    cechy osób (dzieci, pacjenci), liczba osób
  → Wynik deterministyczny: ryzyko BRAK / ISTNIEJE / WYSOKIE + uzasadnienie
  → ISTNIEJE lub WYSOKIE: zgłoszenie do UODO przed deadline_72h (art. 33)
  → WYSOKIE: + zawiadomienie osób bez zbędnej zwłoki (art. 34) — patrz KROK 2B
  → BRAK: bez zgłoszenia, ale UZASADNIJ i udokumentuj w rejestrze (art. 33 ust. 5)

KROK 2 — Zgłoszenie do UODO (treść wymagana art. 33 ust. 3):
  □ Charakter naruszenia (kategorie i przybliżona liczba osób oraz rekordów)
  □ Dane kontaktowe IOD lub innego punktu kontaktowego
  □ Prawdopodobne konsekwencje naruszenia
  □ Środki podjęte lub proponowane w celu zaradzenia
  → Brak kompletu informacji w 72h → ZGŁOSZENIE ETAPOWE (art. 33 ust. 4):
    zgłoś to, co wiesz, uzupełniaj sukcesywnie — nie czekaj z całością po terminie
  → Formularz i kanał zgłoszenia: weryfikuj aktualny na uodo.gov.pl (web_fetch)

KROK 2B — Zawiadomienie osób (art. 34, tylko WYSOKIE ryzyko):
  → Językiem prostym: opis naruszenia, kontakt IOD, konsekwencje, środki (art. 34 ust. 2)
  → WYJĄTKI (art. 34 ust. 3): (a) dane nieczytelne dla nieuprawnionych
    (np. skuteczne szyfrowanie), (b) środki następcze eliminują wysokie ryzyko,
    (c) niewspółmierny wysiłek → komunikat publiczny

KROK 3 — Rejestr naruszeń (art. 33 ust. 5):
  → Dokumentuj WSZYSTKIE naruszenia — także niezgłaszane: okoliczności, skutki,
    działania naprawcze, ocenę ryzyka z uzasadnieniem (dowód rozliczalności)

GRANICA: moduł przygotowuje ocenę, liczy deadline_72h i składa DRAFT zgłoszenia
i zawiadomień. Decyzję o zgłoszeniu i WYSYŁKĘ wykonuje administrator/IOD.
```

## MONITORING PRACOWNIKÓW (art. 22² KP)
```
WARUNKI LEGALNOŚCI MONITORINGU WIZYJNEGO:
  □ Cel: ochrona mienia / kontrola produkcji / bezpieczeństwo
  □ Forma: układ zbiorowy / regulamin / obwieszczenie
  □ Poinformowanie pracowników — przed dopuszczeniem do pracy
  □ Oznakowanie pomieszczeń (co najmniej 2 tygodnie przed uruchomieniem)
  □ Zakaz monitorowania: pomieszczeń sanitarnych, szatni, stołówek, palarni,
    miejsc odpoczynku (chyba że wymagają tego szczególne warunki — art. 22² §2 KP)
  □ Przechowywanie: max 3 miesiące (chyba że dowód w postępowaniu)

MONITORING POCZTY E-MAIL (art. 22³ KP — weryfikuj numerację w aktualnym t.j. KP Dz.U. 2025.277):
  → Cel: weryfikacja wykonania pracy
  → Zakaz naruszania tajemnicy korespondencji i dóbr osobistych
  → Te same wymogi informacyjne jak monitoring wizyjny
```

## ODSZKODOWANIE — PODSTAWY I STRATEGIA (art. 82 RODO)
```
CIĘŻAR DOWODU:
  → Osoba poszkodowana: udowodnienie naruszenia i szkody
  → Administrator: egzoneracja = udowodnienie, że NIE ponosi winy
     (art. 82 ust. 3 — bardzo wysoki próg: pełna staranność nie zapobiegła)

SZKODA:
  → Materialna: mierzalna strata majątkowa
  → Niematerialna: stres, utrata kontroli nad danymi, uszczerbek na reputacji
  Orzecznictwo TSUE: szkoda niematerialna nie może być czysto hipotetyczna
  (C-300/21, Österreichische Post — maj 2023): sam fakt naruszenia ≠ automatyczna szkoda

BENCHMARKING KWOTOWY (orientacyjny — weryfikuj aktualnie):
  → Wycieki danych medycznych: UODO nakłada kary na ADM od 50 000 zł wzwyż
  → Sądy cywilne: zadośćuczynienia 5 000–50 000 zł za stres/utratę kontroli
  → Wyjątki: naruszenia dotykające intymnej sfery życia — powyżej 100 000 zł
```

## PREDYKCJA WYNIKU — SZABLON
```
Szanse: [0–100%]
IN PLUS: brak podstawy prawnej, wyciek danych wrażliwych, brak reakcji ADM,
         dokumentacja potwierdzająca szkodę, wielokrotne naruszenia
IN MINUS: administrator podjął niezwłoczne działania naprawcze, szkoda niewykazana,
          przetwarzanie na podstawie uzasadnionego interesu, brak szkody realnej
BENCHMARKING:
  → Wywołaj orzeczenia-sadowe-v2 z frazą: "RODO art. 82 odszkodowanie szkoda niematerialna"
  → Wytyczne EROD (edpb.europa.eu) — guidelines dot. danego zagadnienia
  → Wyroki TSUE: C-300/21 (Österreichische Post), C-340/21 (Natsionalna agentsia)
    ⚠️ NIEZWERYFIKOWANE — wyszukaj URL przed powołaniem: curia.europa.eu
REKOMENDACJA: □ Skarga UODO  □ Pozew cywilny  □ Oba  □ Wezwanie przedsądowe
```

## KARY ADMINISTRACYJNE (art. 83 RODO) — orientacyjne progi
| Kategoria naruszenia | Max kara |
|---|---|
| Naruszenie zasad, podstaw, praw osób (art. 83 ust. 5) | 20 mln EUR lub 4% global. obrotu |
| Naruszenia techniczne/org., IOD, certyfikacja (art. 83 ust. 4) | 10 mln EUR lub 2% |
| Podmioty publiczne w Polsce | Ograniczone — weryfikuj ustawę o ODO |

⚠️ Kara UODO ≠ odszkodowanie dla osoby fizycznej — to dwa odrębne postępowania.

## ŁĄCZ Z
| Sytuacja | Skill |
|---|---|
| Pozew o odszkodowanie RODO | `pisma-procesowe-v3` |
| Skarga do UODO | `pisma-proste-v2` |
| Wezwanie przedsądowe do ADM | `pisma-proste-v2` |
| Naruszenie wizerunku + IP | `mod-O-wlasnosc-intelektualna.md` |
| Monitoring pracowników — KP | `mod-A-prawo-pracy.md` + `prawo-pracy.md` |
| Analiza szans procesowych | `analiza-sadowa-v6` |
| Orzecznictwo TSUE / sądy polskie | `orzeczenia-sadowe-v2` |
| Redakcja/audyt: polityka prywatności, RCP/RCO, IOD, naruszenia (procedura wewnętrzna), archiwizacja/retencja, regulamin pracy/wynagradzania/ZFŚS/monitoringu | `analizator-umow-v1` → `mod-J21-rodo-archiwizacja-regulaminy.md` (J21) |

*RODO (UE) 2016/679 → eur-lex.europa.eu*
*Ustawa o ODO (Dz.U. 2019.1781 — weryfikuj aktualny t.j. w isap.sejm.gov.pl)*
*KP art. 22²–22³ (Dz.U. 2025.277 t.j.) | Wytyczne EROD: edpb.europa.eu*
*Weryfikacja: 22.05.2026 — zakaz cytowania przepisów z pamięci*

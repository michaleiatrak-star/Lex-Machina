# MOD-ATAK-NA-DOWOD — Atak na dowód: taksonomia, mechanizmy i obrona

> **Wersja:** 1.0.0 | **Status:** PRODUKCJA — plik kanoniczny shared/
> **Wywoływany z:**
>   - `analizator-dowodow-v3` §BLOK-ATAK-NA-DOWOD (trigger: ≥1 dowód + perspektywa przeciwnika)
>   - `analizator-dowodow-v3` modules/MP5-atak.md §5.3 Karta uderzenia (typ: dowodowe)
>   - `pisma-procesowe-v3` W2.4 MOD-ATAK-NA-DRAFT §D2 (atak na dowody)
>   - `pisma-procesowe-v3` W1.2d MOD-SELEKCJA-DOWODOW (analiza ryzyk)
>
> **Źródła:**
>   - KPC art. 227, 232, 233, 235², 243-257, 278-291 (Dz.U. 2026 poz. 468 t.j.)
>   - KPK art. 168a, 170, 174, 393a (Dz.U. 2026 poz. 490 t.j.)
>   - SN III CSK 253/13 — nagrania bez wiedzy (art. 267 KK vs KPC)
>   - FRE 401-403, 801-807, 901-903 (US — porównawcze)
>   - Literatura: FindLaw Documentary Evidence 2024; Garner/Scalia "Making Your Case";
>     MP5-atak.md (system); inwestum.pl art. 170 KPK 2025; adwokat-sechman.pl 2023
>
> ⛔ HARD GATE: normy, artykuły i sygnatury — weryfikuj w ISAP i orzeczenia.ms.gov.pl
> przed powołaniem w piśmie. Moduł podaje przepisy jako punkty startowe.

---

## MAPA ISTNIEJĄCEGO POKRYCIA vs LUKI

```
CO JUŻ ISTNIEJE W SYSTEMIE (nie dublować):
  ✓ Siła dowodów klasy A-G           → shared/DOWODY-METODOLOGIA.md §5
  ✓ Odporność per klasa na negację   → shared/MOD-NEGACJA-DOWODOW.md §N2
  ✓ Atak na draft pisma (D1-D5)      → shared/MOD-ATAK-NA-DRAFT.md
  ✓ Atak na świadka/biegłego         → shared/MOD-ATAK-NA-SWIADKA.md
  ✓ Sprzeczności między dowodami     → MP3-spojnosc.md
  ✓ Dopuszczalność prawna dowodu     → MD3b-walidacja-prawna.md (podstawy)
  ✓ Prekluzja dowodowa               → shared/PREKLUZJA-DOWODOWA.md
  ✓ Plan ataku przeciwnika (ogólny)  → MP5-atak.md §5.2 (8 typów ogólnie)
  ✓ Zakaz dowodowy (nagrania, RODO)  → MD3b §LEG-CONTRA-N

CO TEN MODUŁ DODAJE (luki systemowe):
  ✗ → Kompleksowa taksonomia 12 wektorów ataku NA DOWÓD jako obiekt
  ✗ → Atak na autentyczność: łańcuch custody, metadane, fałszerstwo
  ✗ → Atak na relewantność i proporcjonalność (art. 227 KPC)
  ✗ → Atak na formę: oryginał vs kopia, niepoświadczone
  ✗ → Atak przez dowód przeciwny: kontrdowód aktywny
  ✗ → Oddalenie wniosku dowodowego (art. 170 KPK, art. 235² KPC) — jak żądać
  ✗ → Procedura "szczepienia dowodu" (hardening przed atakiem)
  ✗ → Specyfika dowodów elektronicznych: email, SMS, zrzuty ekranu, nagrania
  ✗ → Atak na zakres wniosku dowodowego (okoliczność bez znaczenia)
  ✗ → Sekwencja ofensywna: jak atakować dowody przeciwnika krok po kroku
```

---

## CZĘŚĆ I — 12 WEKTORÓW ATAKU NA DOWÓD (AD-1..AD-12)

### [AD-1] ATAK NA AUTENTYCZNOŚĆ (authentication attack)

```
Opis: Kwestionowanie że dowód jest tym, za co go podają —
      że pochodzi od wskazanego autora, w podanym czasie, bez modyfikacji.
Cel: Wykluczenie lub obniżenie wartości dowodowej dokumentu.
Siła: 8/10 przy zrzutach ekranu; 4/10 przy dokumentach urzędowych

SYGNAŁY DO SPRAWDZENIA:
  AU-1: Brak oryginalnego podpisu / pieczęci — kopia bez poświadczenia
  AU-2: Metadane dokumentu niezgodne z deklarowaną datą
        (data "Created" późniejsza niż data pisma)
  AU-3: Zrzut ekranu bez metadanych technicznych
        (brak EXIF, nagłówków SMTP, logów systemowych)
  AU-4: Dokument cyfrowy bez integralności (hash, podpis elektroniczny)
  AU-5: Ciągłość numeracji / struktury niespójna z deklarowanym źródłem
  AU-6: Typograficzne lub stylistyczne cechy niezgodne z deklarowanym autorem
        → patrz MOD-PROWENIENCJA-DOWODOW.md §TYP 4 [AUT]
  AU-7: "Deepfake" / manipulacja cyfrowa (2024-2025: rosnący problem)
        → Nowe regulacje FRE 901(c) propozycja 2025 (US porównawcze)

MECHANIZM ATAKU W PIŚMIE:
  "Dowód [D-NNN / opis] stanowi [kopię / zrzut ekranu] bez poświadczenia
   autentyczności. Strona pozwana kwestionuje, że:
   [a] pochodzi od wskazanego nadawcy,
   [b] zachował oryginalną treść bez modyfikacji.
   Strona wnosi o zobowiązanie do złożenia [oryginału / pełnych metadanych
   technicznych / eksportu z systemu ze znacznikiem hash] (art. 248 KPC)."

MECHANIZM ATAKU NA ROZPRAWIE:
  → Wniosek o biegłego IT / kryminalistyka cyfrowa (art. 278 KPC)
     "na okoliczność autentyczności i daty faktycznego wytworzenia"
  → Żądanie metadanych EXIF, nagłówków SMTP, logów serwera

OBRONA WŁASNA:
  → Złóż oryginał (art. 129 §1 KPC)
  → Zabezpiecz metadane PRZED złożeniem pisma (zrzut + hash + czas serwera)
  → Triangulacja proweniencyjna P+ (MOD-PROWENIENCJA §PR2): ≥2 niezależne
    źródła potwierdzające ten sam fakt eliminują atak na każde z osobna
  → Złóż razem z dowodem wydruk metadanych podpisany przez osobę składającą
```

### [AD-2] ATAK NA ŁAŃCUCH PRZECHOWYWANIA / CUSTODY (chain of custody attack)

```
Opis: Kwestionowanie integralności dowodu przez wykazanie przerw
      lub manipulacji w łańcuchu jego przechowywania od wytworzenia do sądu.
Cel: Podważenie że dowód nie był modyfikowany lub podmeniony.
Siła: 9/10 w sprawach karnych; 5/10 w cywilnych

SYGNAŁY DO SPRAWDZENIA:
  CC-1: Dowód "gdzieś leżał" bez udokumentowanego przechowywania
  CC-2: Różne osoby miały dostęp bez protokołowania (sprawdź MOD-PROWENIENCJA [CHAIN])
  CC-3: Brak daty i podpisów przy każdej zmianie osoby przechowującej
  CC-4: Ślady uszkodzenia / otwarcia opakowania / degradacji fizycznej
  CC-5: Numer koperty / sygnatury nie odpowiada treści

PODSTAWA PRAWNA:
  KPK: brak kodeksowej definicji "łańcucha przechowywania" — stosowana praktycznie
  KPC art. 233 §1 — swobodna ocena dowodów uwzględniająca integralność
  Porównawcze: FRE 901(b)(1) — chain of custody jako metoda autentykacji

MECHANIZM ATAKU (KPK):
  "Protokolarna weryfikacja drogi dowodu [X] od miejsca zabezpieczenia
   do sali sądowej nie jest możliwa — strona wnosi o wyjaśnienie:
   kto miał dostęp do dowodu [X] w dniu [Y] i [Z]?"
  → Wniosek o oddalenie (art. 170 §1 pkt 1 KPK — niedopuszczalność)
    jeśli integralność jest fundamentalnie podważona

OBRONA WŁASNA:
  → Dokumentuj chain of custody od momentu uzyskania dowodu
  → Zrób kopię z oznaczeniem daty i osoby → złóż razem z oryginałem
  → W sprawach elektronicznych: użyj narzędzi kryminalistyki cyfrowej
    generujących hash (MD5/SHA-256) w momencie pobrania danych
```

### [AD-3] ATAK NA RELEWANTNOŚĆ (relevance attack)

```
Opis: Twierdzenie że dowód nie ma znaczenia dla rozstrzygnięcia sprawy —
      nie wykazuje faktu istotnego dla roszczenia/obrony.
Cel: Oddalenie wniosku dowodowego; ograniczenie zakresu postępowania.
Siła: 6/10 — sądy są ostrożne w oddalaniu

PODSTAWA PRAWNA:
  KPC art. 227 — przedmiotem dowodu są fakty mające istotne znaczenie
  KPK art. 170 §1 pkt 2 — okoliczność bez znaczenia dla rozstrzygnięcia
  Porównawcze: FRE 401-403 — relevance + unfair prejudice

MECHANIZM ATAKU:
  "Strona wnosi o oddalenie wniosku dowodowego dotyczącego [opis]
   na podstawie art. 235² §1 KPC / art. 170 §1 pkt 2 KPK.
   Fakt który wniosek ma wykazać ([opis faktu]) nie ma znaczenia
   dla rozstrzygnięcia, ponieważ [uzasadnienie: nie jest przesłanką
   żadnego roszczenia, jest już udowodniony, lub jest bezsporny]."

WARIANT — ZBĘDNOŚĆ (fakt już udowodniony):
  "Okoliczność [X] jest już wykazana dowodem D-NNN. Kolejny dowód
   na tę samą okoliczność nie służy wyjaśnieniu sprawy (art. 227 KPC)."

OBRONA:
  → Dla każdego dowodu wstaw w D4 (sekcja "Na dowód"):
    "na okoliczność: [konkretna przesłanka przepisu art. X §Y]"
    → Bez powiązania dowód–przesłanka sąd może go oddalić jako nieistotny.
  → Jeśli fakt jest sporny → podnieś że jest sporny i wymaga udowodnienia.
  → ⚠️ Art. 170 §2 KPK: "Nie można oddalić wniosku na tej podstawie,
     że dotychczasowe dowody wykazały przeciwieństwo tego, co wnioskodawca
     zamierza udowodnić." → wnioski kontrdownodowe są dopuszczalne.
```

### [AD-4] ATAK NA FORMĘ: ORYGINAŁ VS KOPIA (best evidence attack)

```
Opis: Kwestionowanie mocy dowodowej kopii, odpisu lub wydruku —
      żądanie złożenia oryginału dokumentu.
Cel: Obniżenie wartości dowodowej; wymuszenie złożenia oryginału.
Siła: 6/10 — sądy dopuszczają kopie gdy niekwestionowane

PODSTAWA PRAWNA:
  KPC art. 129 §1 — strona może żądać złożenia oryginału
  KPC art. 129 §2 — zamiast oryginału odpis jeśli notarialnie poświadczony
  KPC art. 233 §1 — sąd ocenia moc kopii jako dowodu
  Porównawcze: "Best Evidence Rule" (FRE 1001-1008)

SYGNAŁY:
  BE-1: Złożono kserokopię bez poświadczenia
  BE-2: Wydruk e-mail bez nagłówków technicznych
  BE-3: Zdjęcie dokumentu zamiast skanu
  BE-4: Odpis bez podpisu notarialnego przy kluczowym dokumencie

MECHANIZM ATAKU:
  "Strona składa kopię dokumentu [opis] bez poświadczenia za zgodność
   z oryginałem. Strona pozwana kwestionuje jego autentyczność
   i wnosi o zobowiązanie do złożenia oryginału (art. 129 §1 KPC)."

OBRONA:
  → Złóż oryginał niezwłocznie po żądaniu (art. 129 §1 KPC)
  → Jeśli oryginał niedostępny: poświadcz odpis notarialnie lub złóż
    oświadczenie o przyczynach niemożności złożenia oryginału
  → Powołaj SA Warszawa V ACa 690/19 — weryfikuj — kopia ma moc dowodową
    gdy jej treść nie była kwestionowana i nie złożono wniosku o oryginał
    (zasada: brak żądania oryginału = akceptacja kopii)
  → Kontrdowód przez triangulację: D-001 [kopia] potwierdzona D-007 [oryginał
    od innej strony] = eliminuje atak AD-4
```

### [AD-5] ATAK NA ZAKAZ DOWODOWY (inadmissibility attack)

```
Opis: Twierdzenie, że przepis prawa zakazuje przeprowadzenia tego dowodu.
Cel: Definitywne wykluczenie dowodu z postępowania.
Siła: 9/10 gdy zakaz bezwzględny; 5/10 gdy warunkowy

KATALOG ZAKAZÓW DOWODOWYCH (weryfikuj ISAP):
  ZD-1 NAGRANIA:
    KPK art. 168a — zakaz bezwzględny dowodu z przestępstwa
    KPC: brak analogicznego zakazu — sąd ocenia swobodnie
    SN III CSK 253/13 — nagrania bez wiedzy dopuszczalne w cywilnym
    ⚠️ Granica: naruszenie prawa do prywatności vs prawo do sądu
    → MD3b §LEG-CONTRA-N już to obejmuje; tu procedura ataku przeciwnika

  ZD-2 TAJEMNICA ADWOKACKA / RADCOWSKA:
    art. 6 PrAdw, art. 3 URadPr — bezwzględna tajemnica
    KPK art. 178 pkt 1 — zakaz przesłuchiwania obrońcy
    KPC art. 261 §2 — prawo odmowy zeznań (nie jest zakazem bezwzględnym)

  ZD-3 TAJEMNICA LEKARSKA / BANKOWA / ZAWODOWA:
    art. 40 UZL (lekarz) — zakaz z wyjątkami
    art. 104 PrBank — tajemnica bankowa
    → w KPC: strona może zwolnić z tajemnicy lub sąd może uchylić

  ZD-4 ART. 174 KPK — zakaz zastępowania zeznań pismami:
    "Dowodu z zeznań nie wolno zastępować treścią pism, zapisków,
    notatek urzędowych." → Notatka policjanta ze słów świadka nie zastąpi
    zeznania świadka.

  ZD-5 NARUSZENIE RODO:
    art. 5-6 RODO — dane uzyskane bez podstawy prawnej
    art. 22¹ KP — dane pracownika uzyskane spoza katalogu

  ZD-6 DOWÓD Z NIELEGALNIE POZYSKANEJ KORESPONDENCJI:
    art. 267 §3 KK — bezprawne ujawnienie informacji
    KPC: doktryna podzielona (repozytorium Wroc. 2018 — "warunkowa dopuszczalność")
    → W KPC sąd waży prawo do sądu vs tajemnica korespondencji

MECHANIZM ATAKU:
  "Dowód [opis] jest niedopuszczalny z uwagi na zakaz ustawowy:
   [art. X ustawy Y — zweryfikuj ISAP].
   Strona wnosi o oddalenie wniosku dowodowego (art. 235² §1 pkt 1 KPC /
   art. 170 §1 pkt 1 KPK)."

OBRONA:
  → Zidentyfikuj czy zakaz jest bezwzględny czy warunkowy
  → Jeśli warunkowy: wykaż spełnienie wyjątku
  → Dla nagrań w KPC: powołaj SN III CSK 253/13 — weryfikuj
  → Dla tajemnicy zawodowej: złóż wniosek o uchylenie tajemnicy przez sąd
  → Rozważ złożenie dowodu alternatywnego klasy A (bez zakazu)
```

### [AD-6] ATAK NA WIARYGODNOŚĆ DOKUMENTU (document reliability attack)

```
Opis: Kwestionowanie prawdziwości treści dokumentu — nie autentyczności
      (że pochodzi od autora), lecz rzetelności (że treść odpowiada prawdzie).
Cel: Obniżenie mocy dowodowej bez kwestionowania autentyczności.
Siła: 5/10 — sam zarzut bez kontrdownodu jest słaby

SYGNAŁY:
  DR-1: Dokument sporządzony dla celów procesowych (po wszczęciu sporu)
  DR-2: Autor dokumentu ma interes w jego treści
  DR-3: Wewnętrzna niespójność treści dokumentu
  DR-4: Treść dokumentu sprzeczna z innymi dowodami (MP3 kolizja [FAKT])
  DR-5: Dokument sporządzony retrospektywnie ("dokument tylnej daty")

MECHANIZM ATAKU:
  "Dokument [opis] sporządzony został [po wszczęciu sporu / przez podmiot
   mający interes / z datą wsteczną]. Jego treść pozostaje w sprzeczności
   z dowodem D-NNN [opis sprzeczności]. Wartość dowodowa dokumentu
   jest znacząco obniżona."

OBRONA:
  → Triangulacja: konfirmuj treść dokumentu niezależnym dowodem klasy A/D
  → Wykaż datę i okoliczności sporządzenia (metadane, kontekst)
  → Powołaj się na zasadę "waloru PRZYZNANIA" jeśli dokument pochodzi
    od strony przeciwnej (PK4 z MOD-POSZLAKI-KONTEKST.md)
```

### [AD-7] ATAK NA ZAKRES WNIOSKU DOWODOWEGO (scope attack)

```
Opis: Kwestionowanie że wniosek dowodowy jest sformułowany zbyt szeroko,
      zbyt wąsko lub w sposób nieoznaczony — uniemożliwiający jego przeprowadzenie.
Cel: Oddalenie wniosku z przyczyn formalnych lub ograniczenie zakresu.
Siła: 6/10 — skuteczny gdy wniosek faktycznie wadliwy formalnie

PODSTAWA PRAWNA:
  KPC art. 235¹ — oznaczenie dowodu w sposób umożliwiający jego przeprowadzenie
  KPC art. 235² §1 — pomijanie wniosków spóźnionych lub zbędnych
  KPK art. 170 §1 pkt 3 — dowód nieprzydatny do stwierdzenia okoliczności

MECHANIZM ATAKU:
  "Wniosek dowodowy [opis] nie spełnia wymogu art. 235¹ KPC —
   nie oznacza dowodu w sposób umożliwiający jego przeprowadzenie:
   [brak wskazania dokumentu / daty / osoby / zakresu tematycznego].
   Strona wnosi o oddalenie (art. 235² §1 KPC)."

WARIANT — OBSTRUKCJA:
  Wniosek złożony "na wszelki wypadek" bez uzasadnienia powiązania
  z roszczeniem → wniosek o oddalenie z art. 170 §1 pkt 5 KPK
  (oczywiste zmierzanie do przedłużenia postępowania)
  ⚠️ Ostrożnie: sąd musi wykazać "oczywistość" — nadużywane

OBRONA:
  → Sformułuj każdy wniosek dowodowy zgodnie z art. 235¹ KPC:
    "Wnoszę o dopuszczenie dowodu z [dokument / zeznanie / opinia]:
     [dokładne oznaczenie] na okoliczność: [konkretna przesłanka art. X §Y]"
  → Uzasadnij dlaczego nie powołano wcześniej (art. 235² §2 pkt 1-3 KPC)
```

### [AD-8] ATAK PRZEZ PREKLUZJĘ DOWODOWĄ (exclusion by lateness)

```
Opis: Twierdzenie, że dowód lub twierdzenie jest spóźnione i powinno być
      pominięte przez sąd.
Cel: Definitywne wykluczenie z procesu — nawet prawidłowego dowodu.
Siła: 9/10 w postępowaniach z rygorystyczną koncentracją; 5/10 ogólnie

PODSTAWA PRAWNA:
  KPC art. 235² §1 — pomijanie spóźnionych twierdzeń i dowodów
  KPC art. 458⁵ — postępowanie gospodarcze (prekluzja po pozwie/odpowiedzi)
  KPK art. 170 §1 pkt 6 — wniosek po upływie terminu
  → shared/PREKLUZJA-DOWODOWA.md — PEŁNY PROTOKÓŁ (odsyłam)

MECHANIZM ATAKU:
  "Twierdzenie [opis] i wniosek dowodowy [opis] powołany zostały
   po terminie wynikającym z art. 235² §1 KPC / art. 458⁵ KPC.
   Strona wnosi o pominięcie (art. 235² §1 KPC) — powód nie wykazał,
   że potrzeba powołania powstała później ani że brak zwłoki."

OBRONA:
  → Powołuj dowody jak najwcześniej — najlepiej w pozwie / odpowiedzi
  → Jeśli spóźnione: wykaż JEDEN z trzech warunków (art. 235² §2 KPC):
    (a) potrzeba powołania powstała po upływie terminu
    (b) niemożność powołania wcześniej
    (c) uwzględnienie nie spowoduje zwłoki w rozpoznaniu sprawy
  → Złóż uzasadnienie w piśmie EXPLICITE — nie zakładaj że sąd domyśli się
  → ⚠️ KPK art. 170 §2: "Nie można oddalić, że dotychczasowe dowody
     wykazały przeciwieństwo" → kontrdownód zawsze dopuszczalny w karnym
```

### [AD-9] AKTYWNY KONTRDOWNÓD (rebuttal evidence — atak przez dowód przeciwny)

```
Opis: Zamiast atakować dowód formalnie — strona składa własny dowód
      bezpośrednio zaprzeczający faktowi wykazywanemu przez dowód D-NNN.
Cel: Obalenie faktu dowodem, nie argumentem — zmiana oceny sądu.
Siła: 8/10 gdy dowód klasy A/G; 4/10 gdy klasy E/F (wymaga corroboration)

TYPY KONTRDOWNODÓW:
  KD-1 DOKUMENT BEZPOŚREDNI: D-NNN twierdzi [X] → składamy D-ABC który
        wykazuje [nie-X] wprost (np. inny rejestr z tą samą datą i inną treścią)
  KD-2 BIEGŁY KONTRUJĄCY: opinia własna vs opinia strony przeciwnej
        → art. 286 KPC — wniosek o innego biegłego lub opinię uzupełniającą
  KD-3 ŚWIADEK KONTRUJĄCY: świadek widzący to samo zdarzenie inaczej
        → ryzyko TA-7 (konfrontacja świadków) — ocenić przed powołaniem
  KD-4 ODMIENNE WYNIKI SYSTEMU IT: eksport z tego samego systemu za
        inny okres lub z innych parametrów pokazujący inny fakt
  KD-5 CHRONOLOGIA NEGATYWNA: wykazanie że opisane zdarzenie nie mogło
        nastąpić w podanym czasie (np. inny dokument z tym samym momentem)

SEKWENCJA OFENSYWNA:
  KROK K1: Zidentyfikuj kluczowy fakt który D-NNN przeciwnika ma wykazać
  KROK K2: Oceń klasę D-NNN (A-G) → co potrzebujesz do skutecznego obalenia
  KROK K3: Wybierz typ kontrdownodu KD-1..KD-5
  KROK K4: Złóż kontrdowód z jednoczesnym wnioskiem o konfrontację
           (art. 272 KPC — sąd może zarządzić konfrontację)
  KROK K5: W piśmie: "Dowód D-NNN strony powodowej wykazuje [X].
            Przedkładamy dowód D-ABC który wykazuje [nie-X]:
            [opis]. Twierdzenie powoda oparte na D-NNN jest wątpliwe."

OBRONA WŁASNA:
  → Antycypuj kontrdownody (MOD-NEGACJA N11 — immunizacja twierdzenia)
  → Triangulacja P+: fakt wykazany ≥2 niezależnymi dowodem jest trudniejszy
    do obalenia kontrdownodem niż fakt z jednego źródła
```

### [AD-10] ATAK NA DOWODY ELEKTRONICZNE (digital evidence attack)

```
Opis: Specyficzne ataki na e-maile, SMS, zrzuty ekranu, nagrania,
      dane z systemów IT — z uwagi na ich podatność na manipulację.
Cel: Podważenie autentyczności lub integralności dowodów cyfrowych.
Siła: 8/10 gdy brak metadanych; 3/10 gdy pełna dokumentacja techniczna

WEKTORY ATAKU NA DOWODY CYFROWE:
  DE-1 BRAK METADANYCH: "Zrzut ekranu nie zawiera metadanych potwierdzających
       czas wykonania, urządzenie, użytkownika."
  DE-2 EDYTOWALNOŚĆ: "Treść wiadomości elektronicznej mogła zostać zmieniona
       przez nadawcę lub odbiorcę przed złożeniem."
  DE-3 HASH NIEZWERYFIKOWANY: "Integralność pliku nie została potwierdzona
       skrótem kryptograficznym (hash MD5/SHA-256)."
  DE-4 KONTEKST NIEKOMPLETNY: "Zrzut obejmuje fragment rozmowy —
       bez kontekstu poprzedzającego i następującego."
       → MAN-05 cherry-picking (MOD-NEGACJA §N10) — atak nakładkowy
  DE-5 DEEPFAKE / MANIPULACJA AI: "Strona nie wyklucza że materiał
       wideo / audio / dokument był generowany lub modyfikowany narzędziami AI."
       → Nowy trend 2024-2025 (USCOURTS FRE 901(c) propozycja 2025)

OBRONA PRZEZ SZCZEPIENIE (hardening):
  → PRZED złożeniem e-maila / SMS / zrzutu: 
    [1] Wyeksportuj pełne nagłówki SMTP (nie tylko treść)
    [2] Zrób hash pliku i zachowaj (narzędzia: sha256sum / md5sum)
    [3] Złóż razem: treść + nagłówki + hash + oświadczenie o sposobie pobrania
    [4] Dla komunikatorów: złóż pełną historię wątku (nie wyrwany fragment)
  → Wniosek o biegłego IT zapobiegawczy: "Strona wnosi o biegłego IT
    na okoliczność autentyczności i integralności dowodów cyfrowych
    D-NNN, D-NNN+1, D-NNN+2" — PRZED atakiem strony przeciwnej
```

### [AD-11] ATAK NA MOC DOWODÓW JEDNOSTRONNYCH (ex parte evidence attack)

```
Opis: Kwestionowanie dowodów wytworzonych jednostronnie przez jedną stronę
      na użytek sporu — bez możliwości weryfikacji przez drugą stronę.
Cel: Obniżenie wagi dowodów własnych strony vs dokumentów systemowych.
Siła: 6/10 przy dokumentach wewnętrznych pracodawcy/strony

SYGNAŁY:
  EP-1: Dokumentacja wewnętrzna sporządzona po wszczęciu sporu
  EP-2: Notatki służbowe bez potwierdzenia odbioru
  EP-3: Opisy zdarzeń sporządzone przez podmiot mający interes w ich treści
  EP-4: Zestawienia finansowe sporządzone przez stronę bez certyfikacji

MECHANIZM ATAKU:
  "Dowód [opis] jest dokumentem wewnętrznym sporządzonym jednostronnie
   przez stronę pozwaną po wszczęciu sporu. Strona powodowa nie miała
   możliwości weryfikacji jego treści w trakcie sporządzania.
   Moc dowodowa takiego dokumentu jest ograniczona do wykazania
   [że dokument istnieje / że strona tak twierdziła] — nie wykazuje
   prawdziwości opisanych faktów."

OBRONA:
  → Kontekstualizuj dokument: kiedy powstał, kto miał do niego dostęp,
    czy drugiej stronie był znany (np. wysłany wcześniej)
  → Walor PRZYZNANIA: jeśli dokument pochodzi od strony i jej szkodzi →
    najsilniejszy dowód (PK4 z MOD-POSZLAKI-KONTEKST)
  → Triangulacja z dokumentem zewnętrznym klasy A (eliminuje EP-1..EP-4)
```

### [AD-12] ATAK NA SPÓJNOŚĆ SYSTEMU DOWODOWEGO (systemic attack)

```
Opis: Zamiast atakować pojedyncze dowody — strona atakuje cały materiał
      jako wewnętrznie sprzeczny, niekompletny lub skoordynowany.
Cel: Podważenie całości narracji dowodowej przez wskazanie niespójności.
Siła: 7/10 gdy rzeczywiste sprzeczności; 2/10 gdy pozorne

TYPY ATAKU SYSTEMOWEGO:
  SY-1 WEWNĘTRZNA SPRZECZNOŚĆ: "Dowody D-001 i D-007 złożone przez powoda
       wzajemnie sobie przeczą: D-001 twierdzi [X], D-007 twierdzi [nie-X].
       Żaden z nich nie może być prawdziwy jednocześnie."
  SY-2 SELEKCJA (cherry-picking): "Powód złożył wybrane dokumenty z okresu
       [X]. Brakuje dokumentów z okresu [Y], które byłyby niekorzystne."
       → N12 (spoliation) jeśli celowe; N10 jeśli cherry-picking
  SY-3 KOORDYNACJA DOWODÓW: "Dowody D-003 i D-009 (zeznania dwóch świadków)
       zawierają identyczne fragmenty słowne — wskazuje na uzgodnienie
       zeznań." → MOD-PROWENIENCJA [LIN] + TA-7 (konfrontacja)
  SY-4 LUKI CHRONOLOGICZNE: "Materiał dowodowy obejmuje okresy [A] i [C],
       pomijając kluczowy okres [B] bez wyjaśnienia."

MECHANIZM ATAKU:
  "Materiał dowodowy strony powodowej zawiera wewnętrzną sprzeczność:
   [opis SY-1..SY-4]. Sprzeczność ta podważa wiarygodność całości
   zebranego materiału i czyni ustalenie faktów na jego podstawie
   niemożliwym bez usunięcia wskazanych niespójności."

OBRONA:
  → MP3-spojnosc.md: analiza sprzeczności przed złożeniem pisma
  → MOD-LAPSUS-AUDYT typ [INTRA-SAMOOBALA]: wykryj własne sprzeczności
    zanim zrobi to przeciwnik
  → Jeśli sprzeczność pozorna: wyjaśnij ją explicite w piśmie
    ("Pozorna sprzeczność między D-001 a D-007 wynika z: [wyjaśnienie]")
  → Jeśli luka: wyjaśnij brak dokumentów (zniszczone / niedostępne / irrelevantne)
```

---

## CZĘŚĆ II — PROCEDURA OFENSYWNA: JAK ATAKOWAĆ DOWODY PRZECIWNIKA

### Sekwencja ADIS (Attack on Documentary and Informational Sources)

```
Trigger: ZAWSZE gdy w sprawie są dowody przeciwnika kl. B/C/D/F
Cel: Systematyczna identyfikacja najsłabszych ogniw materiału przeciwnika

KROK ADIS-1 — INWENTARYZACJA DOWODÓW PRZECIWNIKA:
  Lista wszystkich dowodów złożonych lub zapowiedzianych przez przeciwnika.
  Per dowód: klasa A-G → podatność bazowa (patrz MOD-NEGACJA §N2.1)

KROK ADIS-2 — SCREENING PER DOWÓD (AD-1..AD-12):
  Dla każdego D-NNN przeciwnika sprawdź:
  □ AD-1 Autentyczność: czy mamy zarzut do autentyczności? (metadane, podpis)
  □ AD-2 Custody: czy istnieje przerwa w łańcuchu? (zwł. sprawy karne)
  □ AD-3 Relewantność: czy fakt wykazywany jest naprawdę istotny dla sprawy?
  □ AD-4 Forma: oryginał vs kopia — czy złożono oryginał lub poświadczenie?
  □ AD-5 Zakaz: czy istnieje zakaz ustawowy? (nagrania, tajemnica, RODO)
  □ AD-6 Wiarygodność treści: kiedy sporządzony, kto, interes?
  □ AD-7 Zakres wniosku: czy wniosek jest prawidłowo sformułowany?
  □ AD-8 Prekluzja: czy złożony w terminie?
  □ AD-10 Cyfrowy: metadane, hash, kompletność kontekstu?
  □ AD-11 Jednostronny: czy wytworzony przez stronę dla celów sporu?
  □ AD-12 Systemic: sprzeczności, luki, koordynacja?

KROK ADIS-3 — PRIORYTETYZACJA:
  🔴 KRYTYCZNE (8-10/10): składasz wniosek o oddalenie (art. 235² KPC)
  🟠 ISTOTNE (5-7/10): w piśmie: obniżenie wartości dowodowej + kontrdowód
  🟡 UMIARKOWANE (2-4/10): odnotuj; podniesiesz na rozprawie jeśli konieczne
  🟢 KOSMETYCZNE (0-1/10): ignoruj — atak kosztuje więcej niż wart

KROK ADIS-4 — OFENSYWA PROCESOWA:
  Per każdy atak 🔴/🟠: wybierz instrument procesowy:
  [a] Wniosek o oddalenie wniosku dowodowego (art. 235² KPC / art. 170 KPK)
  [b] Wniosek o zobowiązanie do złożenia oryginału (art. 129 §1 KPC)
  [c] Wniosek o biegłego na autentyczność (art. 278 KPC)
  [d] Wniosek o konfrontację / uzupełnienie (art. 272 / 286 KPC)
  [e] Obniżenie wartości dowodowej w treści pisma (bez formalnego wniosku)

KROK ADIS-5 — INTEGRACJA Z PISMEM:
  Per atak 🔴/🟠 w piśmie procesowym:
  Sekcja: "ZARZUTY CO DO MATERIAŁU DOWODOWEGO STRONY POZWANEJ"
  Format per dowód:
  "D. Kwestionowanie dowodu [opis]:
   Strona powodowa kwestionuje moc dowodową [opis] z uwagi na:
   [AD-X: opis ataku]. Strona wnosi o [instrument z ADIS-4]."
```

---

## CZĘŚĆ III — "SZCZEPIENIE DOWODU": OBRONA WŁASNEGO MATERIAŁU

### Procedura SHIELD (Secure, Harden, Integrate, Enumerate, Link, Document)

```
Trigger: PRZED złożeniem pisma z nowymi dowodami
Cel: Uodpornienie każdego własnego dowodu na ataki AD-1..AD-12

S — SECURE (zabezpiecz autentyczność):
  → Złóż oryginał lub notarialnie poświadczony odpis (AD-4)
  → Dla dokumentów elektronicznych: eksportuj z metadanymi + hash (AD-10)
  → Zrób zrzut z nagłówkami SMTP / logami systemowymi (AD-1)

H — HARDEN (wzmocnij przez triangulację):
  → Każdy kluczowy fakt: ≥2 niezależne dowody różnych klas (P+ z MOD-PROWENIENCJA)
  → Fakt wykazany A+D lub B+D jest odporny na atak AD-1, AD-4, AD-6, AD-11

I — INTEGRATE (zintegruj z przesłanką prawną):
  → Każdy dowód: "na okoliczność: [konkretna przesłanka art. X §Y]" (AD-3, AD-7)
  → Bez powiązania z normą → ryzyko oddalenia jako irrelevantny

E — ENUMERATE (wyprzedź prekluzję):
  → Wszystkie dowody w pozwie / odpowiedzi (AD-8)
  → Jeśli późniejsze: uzasadnij dlaczego (art. 235² §2 KPC)

L — LINK (powiąż z narracją):
  → Każdy dowód ma miejsce w chronologii sprawy (MP3 linia czasu §3.5)
  → Sprzeczności wewnętrzne: wyeliminuj przed złożeniem (AD-12 SY-1)
  → Jeśli pozorna sprzeczność: wyjaśnij w tekście pisma

D — DOCUMENT (dokumentuj proweniencję):
  → Dla każdego dowodu: kto, kiedy, jak go uzyskałeś (MOD-PROWENIENCJA §PR1)
  → Dokument wytworzony przez stronę: wskaż kontekst i kiedy (AD-11)
  → Łańcuch przechowywania dla dowodów fizycznych (AD-2)
```

---

## CZĘŚĆ IV — SPECYFIKA DZIEDZIN

### Sprawy pracownicze (DR-04)

```
Najczęstsze ataki na dowody powoda (pracownika):
  AD-1 (autentyczność): "Zrzuty RCS/WhatsApp bez metadanych"
  AD-4 (kopia): "E-maile jako wydruki bez nagłówków"
  AD-6 (wiarygodność): "Notatki sporządzone retrospektywnie na potrzeby sprawy"
  AD-11 (jednostronny): "XLS z systemem HR sporządzony przez pracodawcę"

Najczęstsze ataki na dowody pozwanego (pracodawcy):
  AD-2 (custody): "Dokumentacja kadrowa — kto miał dostęp"
  AD-5 (zakaz): "Monitoring pracownika bez jego wiedzy / RODO"
  AD-6 (wiarygodność): "Notatki HR sporządzone po złożeniu wniosku o zwolnienie"
  AD-11 (jednostronny): "Regulaminy / procedury wystawione przez pracodawcę"

Obrona kluczowych dowodów pracowniczych:
  PFRON/SUDOP (klasa A): praktycznie nieatakowalne — priorytet powołania
  XLS HR (klasa B): trianguluj z zeznaniem świadka D (MOD-PROWENIENCJA [SYS])
  RCS/WhatsApp (klasa C): eksportuj z metadanymi; złóż pełny wątek (nie zrzut)
```

### Sprawy cywilne — odszkodowawcze (DR-02)

```
Najczęstsze ataki:
  AD-4 (forma): "Faktury bez oryginałów"
  AD-6 (wiarygodność): "Wycena szkody sporządzona przez poszkodowanego"
  AD-9 (kontrdowód): "Strona składa własną wycenę / opinię prywatną"
  B1 (biegły — patrz MOD-ATAK-NA-SWIADKA): "Metodologia biegłego ds. szkody"
```

### Sprawy karne (DR-03)

```
Specyfika:
  Art. 168a KPK — dowód z przestępstwa: zakaz bezwzględny (AD-5)
  Art. 170 KPK — katalog przesłanek oddalenia (szerszy niż KPC)
  Art. 174 KPK — zakaz zastępowania zeznań notatkami (AD-5 ZD-4)
  Najsilniejszy atak: AD-5 (niedopuszczalność) → definitywne wykluczenie
```

### Postępowanie administracyjne (DR-05)

```
Specyfika KPA:
  Zasada prawdy obiektywnej (art. 7 KPA) — organ z urzędu zbiera dowody
  Dowody w KPA: dokumenty urzędowe mają szczególną moc (art. 76 KPA)
  Atak AD-3 (relewantność) jest rzadszy — organ sam ustala fakty
  Atak AD-5 (zakaz) przez tajemnicę służbową / informację niejawną
```

---

## INTEGRACJA Z PIPELINE SYSTEMU

```
→ analizator-dowodow-v3 MP5-atak.md §5.2 "typ: dowodowe":
    Rozwiń na AD-1..AD-12: konkretna technika, siła N/10, instrument procesowy

→ analizator-dowodow-v3 MP5-atak.md §5.3 Karta uderzenia [UD]:
    Typ: "AD-X [opis]" | Siła: N/10 | Instrument: wniosek art. X / obniżenie wartości

→ analizator-dowodow-v3 §BLOK-PROWENIENCJA:
    P! alerty → automatycznie generują AD-1 (autentyczność) lub AD-2 (custody)
    [ZAW] → AD-11 (jednostronny) + AD-12 SY-3 (koordynacja)

→ shared/MOD-NEGACJA-DOWODOW §N2 (odporność per klasa):
    AD-1..AD-12 precyzują "co wystarczy do obalenia" per klasa
    Klasa C (zrzut): AD-1 + AD-4 + AD-10 → wszystkie 3 możliwe

→ pisma-procesowe-v3 W2.4 MOD-ATAK-NA-DRAFT §D2:
    Atak pełnomocnika na dowody: typ AD-X | Siła N/10 | Po kontrze N/10

→ pisma-procesowe-v3 MOD-DOWODY §D3 (weryfikacja kompletności):
    SHIELD (S-H-I-E-L-D) per każdy własny dowód przed złożeniem pisma

→ pisma-procesowe-v3 W1.2d MOD-SELEKCJA-DOWODOW:
    ADIS-2 screening per dowód przeciwnika → ADIS-3 priorytetyzacja
```

---

## SELF-CHECK

```
□ ADIS-1: inwentaryzacja dowodów przeciwnika kompletna?
□ ADIS-2: per każdy dowód przeciwnika: screening AD-1..AD-12 wykonany?
□ ADIS-3: priorytety 🔴/🟠/🟡/🟢 przypisane?
□ ADIS-4: per 🔴/🟠: konkretny instrument procesowy wybrany?
□ ADIS-5: ataki 🔴/🟠 ujęte w sekcji pisma "ZARZUTY CO DO MATERIAŁU DOWODOWEGO"?
□ SHIELD: własne dowody 🔴/🟠 podatności zaszczepione (S-H-I-E-L-D)?
□ Wektory AD-5 (zakaz) sprawdzone per każdy dowód (oryginał vs kopia, RODO, nagranie)?
□ Dowody elektroniczne (klasa C): metadane + hash + kontekst kompletny?
□ Integracja: MP5 karty [UD] zaktualizowane o AD-X per atak dowodowy?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system miał fragmentaryczne pokrycie ataku na dowody
  (MD3b §LEG-CONTRA-N dla zakazów, PREKLUZJA-DOWODOWA dla prekluzji,
  MP5 §5.2 dla ogólnej typologii). Brakowało: kompleksowej taksonomii
  12 wektorów, procedury ADIS (sekwencja ofensywna), SHIELD (szczepienie),
  specyfiki dowodów elektronicznych i integracji z pipeline pisma.
Źródła: KPC art. 227, 232-233, 235¹-², 243-257, 278-291 (Dz.U.2026.468);
  KPK art. 168a, 170, 174 (Dz.U.2026.490); SN III CSK 253/13;
  FindLaw Documentary Evidence 2024; Garner/Scalia Making Your Case;
  inwestum.pl art.170 KPK 2025; adwokat-sechman.pl 2023;
  FRE 401-403, 801-807, 901-903 (US porównawcze);
  USCOURTS FRE 901(c) deepfake proposal 2025.
12 wektorów: AD-1 autentyczność, AD-2 custody, AD-3 relewantność,
  AD-4 forma/oryginał, AD-5 zakaz ustawowy, AD-6 wiarygodność treści,
  AD-7 zakres wniosku, AD-8 prekluzja, AD-9 kontrdowód aktywny,
  AD-10 cyfrowe, AD-11 jednostronne, AD-12 systemowy.
Procedury: ADIS (ofensywna, 5 kroków), SHIELD (obronna, 6 kroków).
Specyfika: DR-02/03/04/05.
```

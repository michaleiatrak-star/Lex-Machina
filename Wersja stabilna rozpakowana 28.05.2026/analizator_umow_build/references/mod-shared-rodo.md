# MODUŁ SHARED-RODO — KLAUZULE RODO/GDPR W UMOWACH
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** umowa wiąże się z przetwarzaniem danych osobowych;
> brak DPA (umowy powierzenia) a strony wymieniają dane; SaaS, IT, HR,
> marketing, call center, biuro rachunkowe, hosting, CRM — każda z tych
> sytuacji wymaga DPA. Stosuj przy każdej umowie usługowej B2B.
>
> ⛔ ZAKRES vs J21 (mod-J21-rodo-archiwizacja-regulaminy.md, NOWY
> 2026-06-15): ten moduł = klauzule RODO/DPA JAKO CZĘŚĆ UMOWY z
> kontrahentem. Dla SAMODZIELNYCH dokumentów wewnętrznych (polityka
> prywatności, RCP, PBI, upoważnienia, IOD, procedura naruszeń, archiwizacja/
> retencja, regulamin pracy/wynagradzania/ZFŚS) → J21.

> ⛔ HARD GATE — art. 28 RODO weryfikuj: eur-lex.europa.eu lub uodo.gov.pl
> Decyzje UODO: uodo.gov.pl/pl/decyzje-prezesa-uodo

---

## RO.1 PODSTAWA PRAWNA

```
Weryfikuj aktualne brzmienie:
  RODO: eur-lex.europa.eu → GDPR 2016/679 → art. 28
  Polska ustawa o ochronie danych osobowych: isap.sejm.gov.pl → Dz.U. 2019 poz. 1781

KLUCZOWY PRZEPIS — Art. 28 ust. 3 RODO:
  Umowa powierzenia (DPA) MUSI zawierać co najmniej:
  □ Przedmiot i czas trwania przetwarzania
  □ Charakter i cel przetwarzania
  □ Rodzaj danych osobowych i kategorie osób, których dane dotyczą
  □ Obowiązki i prawa administratora
  □ Zakaz przetwarzania danych w innym celu niż wskazany przez administratora
  □ Zobowiązanie do poufności osób przetwarzających dane
  □ Obowiązek wdrożenia środków bezpieczeństwa (art. 32 RODO)
  □ Warunki korzystania z podprocesora (podpowierzenie)
  □ Pomoc administratorowi w realizacji praw osób fizycznych
  □ Pomoc przy naruszeniach bezpieczeństwa danych (art. 33–34 RODO)
  □ Usunięcie lub zwrot danych po zakończeniu przetwarzania
  □ Udostępnienie wszelkich niezbędnych informacji + prawo do audytu
  
  SANKCJA za brak DPA: art. 83 ust. 4 RODO → kara do 10 mln EUR lub 2% obrotu
  Przykłady kar UODO za brak/wadliwą umowę powierzenia — zweryfikuj aktualne decyzje: uodo.gov.pl/pl/decyzje-prezesa-uodo
```

---

## RO.2 KIEDY WYMAGANA JEST UMOWA POWIERZENIA (DPA)?

```
TEST: Czy w związku z wykonaniem umowy głównej kontrahent będzie przetwarzał
      dane osobowe TWOICH klientów/pracowników/kontrahentów?

  □ Hosting / cloud (dane klientów na serwerach dostawcy) → DPA WYMAGANA
  □ CRM / ERP (dostawca widzi dane kontrahentów, klientów) → DPA WYMAGANA
  □ Biuro rachunkowe (przetwarza dane pracowników) → DPA WYMAGANA
  □ Agencja marketingowa (dane kontaktowe do kampanii) → DPA WYMAGANA
  □ Call center (obsługuje klientów na zlecenie) → DPA WYMAGANA
  □ Rekruter zewnętrzny (przetwarza CV kandydatów) → DPA WYMAGANA
  □ Szkolenia e-learning (dane pracowników w systemie) → DPA WYMAGANA
  □ Drukarnia (drukuje dokumenty z danymi osobowymi) → DPA WYMAGANA

  □ Sprzedaż produktu (kupujący nie przetwarza danych sprzedającego) → DPA NIE
  □ Umowa z osobą fizyczną (poza działalnością) → RÓŻNE REGUŁY
  □ Doradztwo prawne (adwokat jako oddzielny administrator) → DPA NIE (joint admin?)

ALERT: Brak DPA przy faktycznym przetwarzaniu = naruszenie art. 28 RODO
  → Kara UODO + odpowiedzialność cywilna wobec osób których dane dotyczą
```

---

## RO.3 ANALIZA KLAUZUL RODO W UMOWIE GŁÓWNEJ

```
KROK 1 — IDENTYFIKACJA: Czy umowa w ogóle wspomina o danych osobowych?
  □ TAK — przejdź do KROK 2
  □ NIE — sprawdź czy dane osobowe faktycznie będą przetwarzane (test RO.2)
    → Brak wzmianki + faktyczne przetwarzanie = ALERT: brak DPA

KROK 2 — WERYFIKACJA KLAUZUL RODO W TREŚCI UMOWY:
  □ Czy jest odesłanie do oddzielnej umowy DPA? (optymalne)
  □ Czy umowa główna zawiera art. 28-compatible klauzule wprost?
  □ Czy klauzule są wystarczające czy tylko deklaratywne?

KROK 3 — LISTA KONTROLNA KLAUZUL DPA (wymagane przez art. 28 RODO):
  [ ] Cel i zakres przetwarzania danych → czy precyzyjnie wskazane?
  [ ] Rodzaj danych → czy wymienione kategorie?
  [ ] Kategorie osób → klienci / pracownicy / kontrahenci?
  [ ] Zakaz przetwarzania poza zleconym celem → czy jest?
  [ ] Poufność osób przetwarzających → czy zobowiązanie?
  [ ] Bezpieczeństwo (art. 32 RODO) → czy odesłanie lub konkretne środki?
  [ ] Podpowierzenie (podprocesory) → tryb zgody (ogólna/indywidualna)?
  [ ] Prawa osób (dostęp, sprostowanie, usunięcie) → procedura współpracy?
  [ ] Naruszenia bezpieczeństwa → termin notyfikacji administratora (max 72h)?
  [ ] Usunięcie danych po zakończeniu → termin + potwierdzenie?
  [ ] Audyt → prawo administratora do weryfikacji procesora?

KROK 4 — OCENA RYZYKA RODO:
  Brak wszystkich elementów → KRYTYCZNE (kara UODO)
  Brak >5 elementów → WYSOKIE
  Brak 2–4 elementów → ŚREDNIE
  Brak 1 elementu → NISKIE (uzupełnić aneksem)
```

---

## RO.4 PUŁAPKI W KLAUZULACH RODO

```
PUŁAPKA RO-1 — Klauzula "zgodności z RODO" bez treści (CRITICAL)
  PROBLEM: "Kontrahent zapewnia zgodność z RODO."
  → Gołosłowne zapewnienie bez żadnej konkretnej klauzuli z art. 28 RODO
  → UODO uznaje taką klauzulę za niewystarczającą (naruszenie art. 28 ust. 3)
  REKOMENDACJA: Zastąp lub uzupełnij o pełne postanowienia DPA

PUŁAPKA RO-2 — Brak klauzuli podpowierzenia (HIGH RISK)
  PROBLEM: Umowa milczy o podprocesorach.
  → Procesor może korzystać z sub-procesora (np. AWS, Google Cloud) bez zgody
  → Naruszenie art. 28 ust. 2 RODO
  → Ryzyko: dane trafiają do krajów trzecich bez standardowych klauzul (SCC)
  REKOMENDACJA:
    "§X. Procesor może korzystać z usług podprocesora wyłącznie za uprzednią
     pisemną / ogólną zgodą Administratora. Lista zatwierdzonych podprocesora
     stanowi Załącznik nr [Y]. Procesor zobowiązuje każdego podprocesora do
     zachowania obowiązków ochrony danych co najmniej równoważnych niniejszej
     Umowie. Za działania podprocesora Procesor odpowiada jak za własne."

PUŁAPKA RO-3 — Termin powiadomienia o naruszeniu dłuższy niż 72h (CRITICAL)
  PROBLEM: "Procesor powiadomi Administratora o naruszeniu w terminie 7 dni."
  → Art. 33 RODO: Administrator ma 72h na zgłoszenie UODO od powzięcia wiedzy
  → Jeśli Procesor powiadamia po 7 dniach → Administrator nie zdąży z notyfikacją
  REKOMENDACJA:
    "§X. Procesor zgłasza Administratorowi każde naruszenie bezpieczeństwa
     danych osobowych nie później niż w terminie 24 godzin od powzięcia
     o nim wiedzy, w formie pisemnej na adres [email]."

PUŁAPKA RO-4 — Dane nie są usuwane po zakończeniu umowy (HIGH RISK)
  PROBLEM: Umowa milczy o losie danych po zakończeniu współpracy.
  → Art. 28 ust. 3 lit. g RODO: procesor musi usunąć lub zwrócić dane
  → Brak klauzuli = ryzyko że dane zostają u procesora w nieskończoność
  REKOMENDACJA:
    "§X. Po zakończeniu Umowy Procesor, według wyboru Administratora, niezwłocznie
     usuwa lub zwraca Administratorowi wszystkie dane osobowe oraz usuwa
     istniejące kopie, chyba że prawo UE lub polskie nakazuje dalsze
     przechowywanie danych. Procesor potwierdza usunięcie na piśmie w terminie
     [14] dni od zakończenia Umowy."

PUŁAPKA RO-5 — Brak prawa do audytu (MEDIUM RISK)
  PROBLEM: "Kontrahent zapewnia poufność."
  → Art. 28 ust. 3 lit. h RODO: procesor musi umożliwić przeprowadzenie audytów
  → Prawo do audytu jest OBLIGATORYJNE — nie można go wyłączyć umownie
  REKOMENDACJA:
    "§X. Administrator jest uprawniony do przeprowadzenia audytu lub inspekcji
     przetwarzania danych przez Procesora, z zachowaniem [14]-dniowego terminu
     powiadomienia, nie częściej niż raz w roku, w godzinach pracy Procesora.
     Procesor zapewnia wszelką niezbędną pomoc przy audycie."
```

---

## RO.5 SZABLON MINIMALNEJ KLAUZULI DPA (ZGODNEJ Z ART. 28 RODO)

```
"§[X]. POWIERZENIE PRZETWARZANIA DANYCH OSOBOWYCH

1. ZAKRES POWIERZENIA. Na podstawie niniejszej Umowy Administrator powierza
   Procesorowi przetwarzanie danych osobowych w zakresie niezbędnym do
   realizacji Umowy:
   a) Cel przetwarzania: [np. obsługa klientów Administratora / prowadzenie
      księgowości / hosting systemu informatycznego]
   b) Rodzaj danych: [np. imię, nazwisko, adres e-mail, adres zamieszkania,
      numer telefonu, dane finansowe] — uszczegółowić!
   c) Kategorie osób: [np. klienci Administratora / pracownicy / kontrahenci]
   d) Czas przetwarzania: przez czas trwania Umowy.

2. OBOWIĄZKI PROCESORA. Procesor zobowiązuje się do:
   a) przetwarzania danych wyłącznie na udokumentowane polecenie Administratora;
   b) zapewnienia, że osoby upoważnione do przetwarzania danych zobowiązały się
      do zachowania tajemnicy lub podlegają stosownym ustawowym obowiązkom
      zachowania tajemnicy;
   c) wdrożenia i utrzymania środków bezpieczeństwa zgodnie z art. 32 RODO;
   d) poinformowania Administratora przed udzieleniem upoważnienia do korzystania
      z usług podprocesora — wymagana [ogólna / uprzednia pisemna] zgoda;
   e) udzielania Administratorowi pomocy przy realizacji praw osób fizycznych;
   f) niezwłocznego, nie później niż w terminie [24] godzin, powiadamiania
      Administratora o wszelkich naruszeniach bezpieczeństwa danych osobowych;
   g) po zakończeniu Umowy: usunięcia lub zwrotu wszystkich danych na wybór
      Administratora, z pisemnym potwierdzeniem w terminie [14] dni;
   h) udostępnienia Administratorowi wszelkich informacji niezbędnych do
      wykazania zgodności z art. 28 RODO oraz umożliwienia przeprowadzenia
      audytów, z [14]-dniowym uprzedzeniem.

3. PODPROCESORY. Lista zatwierdzonych podprocesorów stanowi Załącznik [nr].
   Na każdego podprocesora Procesor nakłada co najmniej takie same obowiązki
   ochrony danych. Za działania podprocesora Procesor odpowiada jak za własne.

4. ODPOWIEDZIALNOŚĆ. Procesor ponosi odpowiedzialność wobec Administratora
   za szkody wynikłe z przetwarzania danych niezgodnie z RODO lub niniejszą
   Umową, z zastrzeżeniem art. 82 RODO."
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Podstawa prawna: art. 28, 32, 33, 82, 83 RODO — weryfikuj: eur-lex.europa.eu → GDPR*
*Decyzje UODO: uodo.gov.pl/pl/decyzje-prezesa-uodo*
*Wytyczne EROD 07/2020 (podprocesory): edpb.europa.eu*
